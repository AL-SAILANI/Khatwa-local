"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, ListChecks, TrendingUp, GraduationCap, CalendarRange } from "lucide-react";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { GoalProgressCard } from "@/components/dashboard/goal-progress-card";
import { StreakCard } from "@/components/dashboard/streak-card";
import { ExamCountdownCard } from "@/components/dashboard/exam-countdown-card";
import { DailyMotivationCard } from "@/components/dashboard/daily-motivation-card";
import { AchievementsPreview } from "@/components/dashboard/achievements-preview";
import { CalendarPreview } from "@/components/dashboard/calendar-preview";
import { StartPlacementCta } from "@/components/dashboard/start-placement-cta";
import { StudyPathCard } from "@/components/dashboard/study-path-card";
import { ContinueLearningCard } from "@/components/dashboard/continue-learning-card";
import { StudyCoachCard } from "@/components/dashboard/study-coach-card";
import { SectionPerformanceCard } from "@/components/dashboard/section-performance-card";
import { DailyChallengeCard } from "@/components/dashboard/daily-challenge-card";
import { LevelCard } from "@/components/gamification/level-card";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getActiveStudyPlan } from "@/lib/firestore/study-plans";
import { getUserAchievements } from "@/lib/firestore/achievements";
import { getWeekActiveDays } from "@/lib/calendar";
import type { StudyPlan } from "@/types/gamification";

export function DashboardContent() {
  const t = useTranslations("dashboard");
  const { user, profile, isLoading } = useUserProfile();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    getActiveStudyPlan(user.uid).then(setPlan);
    getUserAchievements(user.uid).then((records) => setUnlockedAchievementIds(records.map((r) => r.achievementId)));
  }, [user]);

  if (isLoading || !profile) {
    return (
      <div role="status" aria-label={t("loading")} className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  const hasTakenAnyTest = profile.testsTaken > 0;

  return (
    <>
      <div className="flex-1 space-y-8 p-6 lg:p-8">
        <WelcomeHeader
          lastActiveAt={profile.lastActiveAt}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
          <StatCard
            icon={CalendarRange}
            label={t("currentPlan")}
            value={plan ? t("planDuration", { days: plan.durationDays }) : t("planNotCreatedYet")}
          />
          <StatCard
            icon={GraduationCap}
            label={t("currentLevel")}
            value={profile.level ? t(`levels.${profile.level}`) : t("levelNotDetermined")}
          />
          <StatCard icon={Clock} label={t("studyHours")} value={t("studyHoursValue", { hours: profile.studyHours })} />
          <StatCard icon={ListChecks} label={t("testsTaken")} value={String(profile.testsTaken)} />
          <StatCard
            icon={TrendingUp}
            label={t("lastScore")}
            value={profile.lastScore !== null ? String(profile.lastScore) : t("noScore")}
          />
        </div>

        <DailyMotivationCard />

        <ExamCountdownCard profile={profile} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ContinueLearningCard uid={profile.uid} />

            <StudyPathCard />

            <DailyChallengeCard />

            <StudyCoachCard uid={profile.uid} />

            <SectionPerformanceCard uid={profile.uid} />
          </div>

          <div className="space-y-6">
            <LevelCard xp={profile.xp} coins={profile.coins} />

            <StreakCard streak={profile.streak} activeDays={getWeekActiveDays(profile.recentActivityDays)} />

            {hasTakenAnyTest && profile.goal !== null ? (
              <GoalProgressCard currentScore={profile.lastScore ?? 0} goal={profile.goal} />
            ) : (
              <StartPlacementCta />
            )}

            <AchievementsPreview
              achievements={[
                { title: t("achievementPreviewTitles.firstExam"), unlocked: unlockedAchievementIds.includes("first-exam") },
                { title: t("achievementPreviewTitles.weekStreak"), unlocked: unlockedAchievementIds.includes("week-streak") },
                { title: t("achievementPreviewTitles.words100"), unlocked: unlockedAchievementIds.includes("100-words") },
                { title: t("achievementPreviewTitles.score90"), unlocked: unlockedAchievementIds.includes("score-90") },
              ]}
            />

            <CalendarPreview recentActivityDays={profile.recentActivityDays} />
          </div>
        </div>
      </div>
    </>
  );
}
