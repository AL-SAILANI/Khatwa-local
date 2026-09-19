"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarClock, CircleCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/lib/firestore/users";
import { cn } from "@/lib/utils/cn";
import type { UserProfile } from "@/types/user";

function toLocalDateString(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function ExamDateSection({ profile }: { profile: UserProfile }) {
  const t = useTranslations("settings.examDate");
  const locale = useLocale();
  const [registered, setRegistered] = useState<"yes" | "no">(
    profile.examDate ? "yes" : "no",
  );
  const [date, setDate] = useState(() => {
    const stored = profile.examDate ?? "";
    return stored.includes("T") ? stored.slice(0, stored.indexOf("T")) : stored;
  });
  const [time, setTime] = useState(() => {
    const stored = profile.examDate ?? "";
    return stored.includes("T") ? stored.slice(stored.indexOf("T") + 1) : "00:00";
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateUserProfile(profile.uid, {
        examDate: registered === "yes" && date ? `${date}T${time || "00:00"}` : null,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const currentDate =
    date && time
      ? new Intl.DateTimeFormat(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(`${date}T${time}`))
      : null;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <CalendarClock className="mt-0.5 size-5 shrink-0 text-ink-violet dark:text-primary-400" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight">{t("title")}</h2>
          <p className="mt-1 text-sm text-muted">{t("description")}</p>
        </div>
      </div>

      <div className="mt-5">
        <Label>{t("registeredLabel")}</Label>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t("registeredLabel")}>
          {(["yes", "no"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={registered === value}
              onClick={() => {
                setRegistered(value);
                setSaved(false);
              }}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                registered === value
                  ? "border-primary-500 bg-primary-50 text-ink-violet ring-1 ring-primary-500 dark:bg-primary-500/10 dark:text-primary-300"
                  : "border-border text-foreground/70 hover:border-primary-400 hover:text-ink-violet dark:hover:text-primary-300",
              )}
            >
              {t(value === "yes" ? "registered" : "notRegistered")}
            </button>
          ))}
        </div>
      </div>

      {registered === "yes" ? (
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <Label htmlFor="exam-date">{t("dateLabel")}</Label>
              <Input
                id="exam-date"
                type="date"
                value={date}
                min={toLocalDateString(new Date())}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSaved(false);
                }}
                className="w-auto"
              />
            </div>
            <div>
              <Label htmlFor="exam-time">{t("timeLabel")}</Label>
              <Input
                id="exam-time"
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setSaved(false);
                }}
                className="w-auto"
              />
            </div>
          </div>
          {currentDate && (
            <p className="text-xs text-muted">{t("currentDate", { date: currentDate })}</p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">{t("registerLater")}</p>
      )}

      <div className="mt-5 flex items-center gap-3">
        <Button size="sm" onClick={handleSave} loading={saving}>
          {t("save")}
        </Button>
        {saved && !saving && (
          <span
            role="status"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-success-600 dark:text-success-300"
          >
            <CircleCheck className="size-3.5" />
            {t("saved")}
          </span>
        )}
      </div>
    </Card>
  );
}
