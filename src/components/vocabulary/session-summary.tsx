"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { CheckCircle2, Layers, Lightbulb, Repeat, Sparkles, TrendingUp, Undo2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SessionContext } from "@/components/vocabulary/flashcard-session";
import { cn } from "@/lib/utils/cn";

interface SessionSummaryProps {
  context: SessionContext;
  stats: { again: number; hard: number; easy: number };
  total: number;
  newCount: number;
  xpEarned: number | null;
  onExit?: () => void;
}

const TITLES: Record<SessionContext, string> = {
  review: "doneTitle",
  favorites: "doneTitle",
  sets: "doneTitle",
};

function RetentionCurve() {
  const t = useTranslations("vocabulary");
  return (
    <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <TrendingUp className="size-4 text-secondary-500" />
        {t("curveTitle")}
      </div>

      <svg viewBox="0 0 320 150" className="mt-3 w-full" role="img" aria-label={t("curveTitle")}>
        <line x1="15" y1="125" x2="305" y2="125" className="stroke-border" strokeWidth="1" />
        <path
          d="M15 14 C 90 70, 180 105, 305 122"
          fill="none"
          strokeWidth="2"
          strokeDasharray="5 5"
          className="stroke-muted"
        />
        <path
          d="M15 14 C 105 18, 210 24, 305 28"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-secondary-500"
        />

        {[15, 105, 210, 305].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={i === 0 ? 14 : 20 + i * 2} r="3.5" className="fill-secondary-500" />
            <circle cx={x} cy={i === 0 ? 14 : 20 + i * 2} r="3.5" className="fill-ink-violet dark:fill-primary-300" />
            <text x={x} y="140" textAnchor="middle" className="fill-foreground/60" fontSize="10">
              {i === 0 ? t("curveToday") : `+${[1, 6, 15][i - 1]}`}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded-none border-t-2 border-dashed" />
          {t("curveWithoutReview")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded-none bg-secondary-500" />
          {t("curveWithReview")}
        </span>
      </div>
    </div>
  );
}

export function SessionSummary({ context, stats, total, newCount, xpEarned, onExit }: SessionSummaryProps) {
  const t = useTranslations("vocabulary");

  const retention = total > 0 ? Math.round(((stats.easy + stats.hard) / total) * 100) : 0;
  const retentionRing = retention * 2.76;

  const tips = useMemo(() => [t("tipRetrieval"), t("tipSpacing"), t("tipLeitner")], [t]);
  const tipIndex = (total + stats.again) % tips.length;

  const schedule: { label: string; color: string }[] = [];
  if (stats.again > 0)
    schedule.push({ label: t("scheduleAgain", { count: stats.again }), color: "bg-error/10 text-error" });
  if (stats.hard > 0)
    schedule.push({ label: t("scheduleHard", { count: stats.hard }), color: "bg-warning/10 text-warning" });
  if (stats.easy > 0)
    schedule.push({ label: t("scheduleEasy", { count: stats.easy }), color: "bg-success/10 text-success" });
  if (newCount > 0)
    schedule.push({ label: t("scheduleNew", { count: newCount }), color: "bg-secondary-100 text-cream-paper dark:bg-secondary-500/15 dark:text-secondary-300" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-md"
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="bg-butter-yellow px-6 py-7 text-center text-ink-violet">
          <CheckCircle2 className="mx-auto size-10 text-secondary-400" />
          <h2 className="mt-3 text-lg font-bold">{t(TITLES[context])}</h2>
          <p className="mt-1 text-sm text-white/80">{t("doneNote", { total })}</p>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center justify-center gap-5">
            <div className="relative size-20">
              <svg viewBox="0 0 36 36" className="size-20 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3.5" className="stroke-border" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={`${retentionRing} 100`}
                  className="stroke-ink-violet dark:stroke-primary-300"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{retention}%</span>
            </div>
            <div className="text-sm">
              <div className="font-semibold">{t("retentionTitle")}</div>
              <div className="mt-0.5 max-w-40 text-xs text-muted">{t("retentionNote")}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatTile icon={Sparkles} label={t("statMastered")} value={stats.easy} tone="success" />
            <StatTile icon={Repeat} label={t("statHard")} value={stats.hard} tone="warning" />
            <StatTile icon={Undo2} label={t("statAgain")} value={stats.again} tone="error" />
            <StatTile icon={Layers} label={t("statNew")} value={newCount} tone="primary" />
          </div>

          <RetentionCurve />

          {schedule.length > 0 && (
            <div>
              <div className="text-sm font-semibold">{t("scheduleTitle")}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {schedule.map((chip) => (
                  <span
                    key={chip.label}
                    className={cn("inline-flex items-center rounded-none px-3 py-1 text-xs font-medium", chip.color)}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 rounded-2xl border border-secondary-400/40 bg-secondary-50 p-4 dark:bg-secondary-500/10">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-secondary-500" />
            <div className="text-xs leading-relaxed text-foreground/80">{tips[tipIndex]}</div>
          </div>

          {xpEarned !== null && (
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
              <Sparkles className="size-4" />
              {t("xpEarned", { xp: xpEarned })}
            </div>
          )}

          {context !== "review" && onExit && (
            <Button variant="outline" className="w-full" onClick={onExit}>
              <XCircle className="size-4" />
              {context === "sets" ? t("setsBackToList") : t("favoritesBack")}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Sparkles;
  label: string;
  value: number;
  tone: "success" | "warning" | "error" | "primary";
}) {
  const tones = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    primary: "bg-primary-50 text-ink-violet dark:bg-primary-500/10 dark:text-primary-300",
  };
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-3">
      <div className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-base font-bold leading-none">{value}</div>
        <div className="mt-1 truncate text-xs text-muted">{label}</div>
      </div>
    </div>
  );
}
