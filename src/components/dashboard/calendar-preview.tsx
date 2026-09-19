"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, ChevronLeft, ChevronRight, Flame, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModuleHeader } from "@/components/ui/module-header";
import { getMonthYearLabel, getWeekdayLabels } from "@/lib/format";
import { getRunEndingOn, getStudiedDaysInMonth } from "@/lib/calendar";
import { cn } from "@/lib/utils/cn";

const HEAT_LEVELS = [
  "bg-primary-100 text-ink-violet dark:bg-primary-500/20 dark:text-primary-200",
  "bg-primary-200 text-ink-violet dark:bg-primary-500/30 dark:text-primary-200",
  "bg-primary-400 text-ink-violet dark:bg-primary-500/60 dark:text-ink-violet",
  "bg-primary-500 text-ink-violet dark:bg-primary-600",
] as const;

function heatLevel(run: number): number {
  if (run <= 0) return -1;
  return Math.min(run - 1, HEAT_LEVELS.length - 1);
}

function formatDayLabel(locale: string, year: number, month: number, day: number): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, day));
}

export function CalendarPreview({ recentActivityDays }: { recentActivityDays: string[] }) {
  const locale = useLocale();
  const t = useTranslations("dashboard.calendar");

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
  const today = now.getDate();

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOffset = new Date(viewYear, viewMonth, 1).getDay();

  const studiedDays = useMemo(
    () => new Set(getStudiedDaysInMonth(recentActivityDays, viewYear, viewMonth)),
    [recentActivityDays, viewYear, viewMonth],
  );

  const navigate = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
    setSelectedDay(null);
  };

  const bestRun = useMemo(() => {
    let max = 0;
    for (let day = 1; day <= daysInMonth; day += 1) {
      if (studiedDays.has(day)) {
        max = Math.max(max, getRunEndingOn(recentActivityDays, viewYear, viewMonth, day));
      }
    }
    return max;
  }, [studiedDays, recentActivityDays, viewYear, viewMonth, daysInMonth]);

  const selectedRun = selectedDay !== null ? getRunEndingOn(recentActivityDays, viewYear, viewMonth, selectedDay) : 0;

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Card className="h-fit border-primary-200/70 bg-primary-50/60 p-5 dark:border-primary-500/20 dark:bg-primary-500/10">
        <ModuleHeader
          icon={CalendarDays}
          title={t("title")}
          action={
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label={t("prevMonth")}
                className="flex size-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <ChevronRight className="size-4 rtl:rotate-180" />
              </button>
              <span className="min-w-32 text-center text-sm font-medium">
                {getMonthYearLabel(locale, new Date(viewYear, viewMonth, 1))}
              </span>
              <button
                type="button"
                onClick={() => navigate(1)}
                disabled={isCurrentMonth}
                aria-label={t("nextMonth")}
                className="flex size-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </button>
            </div>
          }
        />

      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {getWeekdayLabels(locale).map((day) => (
          <div key={day} className="text-[11px] text-muted">
            {day.slice(0, 2)}
          </div>
        ))}

        {cells.map((day, index) => {
          const isStudied = day !== null && studiedDays.has(day);
          const isToday = day === today && isCurrentMonth;
          const isSelected = day === selectedDay;
          const level = day !== null ? heatLevel(getRunEndingOn(recentActivityDays, viewYear, viewMonth, day)) : -1;

          return (
            <button
              key={index}
              type="button"
              disabled={!isStudied}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              aria-label={day ? formatDayLabel(locale, viewYear, viewMonth, day) : undefined}
              aria-pressed={isSelected}
              className={cn(
                "flex h-8 items-center justify-center rounded-lg text-xs transition-colors",
                day === null && "invisible",
                day !== null && !isStudied && "text-foreground/60",
                day !== null && isStudied && !isSelected && HEAT_LEVELS[level],
                isSelected && "bg-primary-700 text-ink-violet dark:bg-primary-500",
                isToday && "ring-2 ring-primary-500 ring-offset-1 ring-offset-background dark:ring-offset-primary-950",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDay !== null && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-primary-200 bg-surface px-4 py-3 dark:border-primary-500/30 dark:bg-surface-muted">
          <div className="flex items-center gap-3">
            <Flame className={cn("size-5 shrink-0", selectedRun >= 2 ? "text-amber-600 fill-current dark:text-amber-400" : "text-ink-violet dark:text-primary-300")} />
            <div className="text-sm">
              <div className="font-medium">{formatDayLabel(locale, viewYear, viewMonth, selectedDay)}</div>
              <div className="text-muted">
                {selectedRun >= 2 ? t("runLabel", { count: selectedRun }) : t("singleDay")}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDay(null)}
            aria-label={t("closeDetail")}
            className="flex size-6 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="mt-4 border-t border-border pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">
            {t("monthlyTotal", {
              count: studiedDays.size,
              total: daysInMonth,
            })}
          </span>
          <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
            <Flame className="size-3.5 fill-current" />
            {t("bestRun", { count: bestRun })}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-none bg-surface-muted">
          <div
            className="h-full rounded-none bg-ink-violet"
            style={{ width: `${Math.round((studiedDays.size / daysInMonth) * 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
