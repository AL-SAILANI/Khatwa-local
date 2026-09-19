"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarRange } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { PLAN_DURATIONS } from "@/lib/constants/exam";
import { recommendDuration, buildStudyPath } from "@/lib/study-plan-generator";
import { createStudyPlan } from "@/lib/firestore/study-plans";
import { getAllLessons } from "@/lib/firestore/courses";

export function PlanBuilder() {
  const t = useTranslations("studyPlan");
  const { user, profile } = useUserProfile();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weeklyHours, setWeeklyHours] = useState(7);

  const recommended = profile ? recommendDuration(profile.goal ?? 80, profile.lastScore) : 15;
  const [duration, setDuration] = useState(recommended);

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  const handleCreate = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const startedAt = new Date();
    const targetEndAt = new Date(startedAt);
    targetEndAt.setDate(targetEndAt.getDate() + duration);

    const lessons = await getAllLessons();
    await createStudyPlan({
      userId: user.uid,
      durationDays: duration,
      goal: profile.goal ?? 80,
      weeklyHours,
      startedAt: startedAt.toISOString(),
      targetEndAt: targetEndAt.toISOString(),
      weeklySchedule: buildStudyPath(duration, lessons),
    });

    router.push("/study-plan/path");
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 p-6 lg:p-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-none border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-semibold text-ink-violet dark:border-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
          {t("eyebrow")}
        </span>
        <div className="mx-auto mt-5 inline-flex size-14 items-center justify-center rounded-2xl bg-primary-500 text-ink-violet">
          <CalendarRange className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted">
          {t("recommendationNote", {
            goal: profile.goal ?? t("noValue"),
            lastScore: profile.lastScore ?? t("noValue"),
            recommended,
          })}
        </p>
      </div>

      <Card>
        <Label>{t("durationLabel")}</Label>
        <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label={t("durationLabel")}>
          {PLAN_DURATIONS.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={duration === option}
              onClick={() => setDuration(option)}
              className={cn(
                "rounded-xl border py-3 text-sm font-semibold transition-colors",
                duration === option
                  ? "border-primary-500 bg-primary-50 text-ink-violet dark:bg-primary-500/10 dark:text-primary-300"
                  : "border-border text-foreground hover:border-primary-500 hover:text-ink-violet dark:hover:text-primary-300",
              )}
            >
              {t("durationOption", { days: option })}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Label htmlFor="weeklyHours">{t("weeklyHoursLabel")}</Label>
          <input
            id="weeklyHours"
            type="range"
            min={2}
            max={30}
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="text-center text-sm font-medium">{t("weeklyHoursValue", { hours: weeklyHours })}</div>
        </div>

        <p className="mt-4 rounded-xl bg-surface-muted px-4 py-3 text-xs leading-relaxed text-muted">
          {t("pathNote")}
        </p>
      </Card>

      <Button size="lg" className="w-full" onClick={handleCreate} disabled={isSubmitting}>
        {isSubmitting ? t("creating") : t("createButton")}
      </Button>
    </div>
  );
}
