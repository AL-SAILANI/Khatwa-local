"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Award,
  BookMarked,
  BookOpen,
  CalendarCheck,
  Check,
  Clock,
  Flame,
  GraduationCap,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils/cn";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { getUserAchievements } from "@/lib/firestore/achievements";
import { ACHIEVEMENTS } from "@/data/achievements";
import type { UserAchievement } from "@/types/gamification";

const ICONS: Record<string, LucideIcon> = {
  award: Award,
  flame: Flame,
  "book-marked": BookMarked,
  trophy: Trophy,
  star: Star,
  "book-open": BookOpen,
  "trending-up": TrendingUp,
  "graduation-cap": GraduationCap,
  clock: Clock,
  "calendar-check": CalendarCheck,
};

const CATEGORY_ORDER = ["streak", "vocabulary", "exams", "lessons", "focus", "daily"];

/** Legacy achievements (seeded before the `category` field existed) map to
 * their proper group so the page stays correct even before a re-seed. */
const LEGACY_CATEGORY: Record<string, string> = {
  "first-exam": "exams",
  "score-90": "exams",
  "100-words": "vocabulary",
  "week-streak": "streak",
};

function categoryOf(id: string, category?: string): string {
  return category ?? LEGACY_CATEGORY[id] ?? "streak";
}

function achievementIcon(icon: string): LucideIcon {
  return ICONS[icon] ?? Award;
}

export function AchievementsPage() {
  const t = useTranslations("achievements");
  const locale = useLocale();
  const { user } = useUserProfile();
  const { achievementTitle, achievementDescription } = useLocalizedContent();
  const [unlocked, setUnlocked] = useState<Map<string, UserAchievement>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserAchievements(user.uid)
      .then((records) => {
        setUnlocked(new Map(records.map((r) => [r.achievementId, r])));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const totalXp = useMemo(
    () => ACHIEVEMENTS.reduce((sum, a) => sum + (unlocked.has(a.id) ? a.xpReward : 0), 0),
    [unlocked],
  );

  const unlockedCount = unlocked.size;
  const total = ACHIEVEMENTS.length;
  const progress = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: ACHIEVEMENTS.filter((a) => categoryOf(a.id, a.category) === category).sort(
          (a, b) => Number(unlocked.has(b.id)) - Number(unlocked.has(a.id)),
        ),
      })).filter((g) => g.items.length > 0),
    [unlocked],
  );

  if (loading) {
    return (
      <div role="status" aria-label={t("loading")} className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6 lg:p-8">
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={Award}
        eyebrowTone="gold"
        title={t("pageTitle")}
        description={t("unlockedCount", { unlocked: unlockedCount, total })}
      />

      {/* Progress overview */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Was `bg-ink-violet text-ink-violet` — the percentage was the
                same colour as its own background, same defect as the
                leaderboard's first-place crown. */}
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-ink-violet text-butter-yellow">
              <span className="text-2xl font-black">{progress}%</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{t("progressLabel")}</p>
              <p className="mt-0.5 text-xs text-muted">
                {t("unlockedCount", { unlocked: unlockedCount, total })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-secondary-500/20 bg-secondary-100/60 px-4 py-2.5 dark:bg-secondary-500/10">
            <Flame className="size-4 text-secondary-600 dark:text-secondary-400" />
            <span className="text-xs text-muted">{t("totalXpLabel")}</span>
            <span className="text-sm font-bold text-ink-violet dark:text-primary-300">+{totalXp}</span>
          </div>
        </div>
        <div
          role="progressbar"
          aria-label={t("progressLabel")}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={unlockedCount}
          className="h-2 w-full bg-surface-muted"
        >
          <div
            className="h-full bg-ink-violet transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {unlockedCount < total && (
          <p className="border-t border-border px-6 py-3 text-xs text-muted">{t("nextTip")}</p>
        )}
      </Card>

      <div className="space-y-8">
        {grouped.map(({ category, items }) => (
          <section key={category} className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">{t(`categories.${category}`)}</h2>
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted">
                {items.filter((i) => unlocked.has(i.id)).length}/{items.length}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((achievement) => {
                const record = unlocked.get(achievement.id);
                const isUnlocked = Boolean(record);
                const Icon = achievementIcon(achievement.icon);

                return (
                  <Card
                    key={achievement.id}
                    className={cn(
                      "relative flex flex-col gap-3 overflow-hidden",
                      isUnlocked && "border-secondary-500/30",
                      !isUnlocked && "opacity-75",
                    )}
                  >
                    {isUnlocked && (
                      <span className="absolute end-3 top-3 inline-flex size-5 items-center justify-center rounded-full bg-success text-white">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                    )}

                    <div className="flex items-center gap-3.5">
                      <div
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                          isUnlocked
                            ? "bg-butter-yellow text-ink-violet"
                            : "bg-surface-muted text-muted",
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{achievementTitle(achievement)}</div>
                        <p className="mt-0.5 truncate text-xs text-muted">{achievementDescription(achievement)}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-border pt-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-none bg-secondary-100 px-2.5 py-1 text-xs font-bold text-ink-violet dark:bg-secondary-500/15 dark:text-secondary-300">
                        <Flame className="size-3" />
                        {t("xpReward", { xp: achievement.xpReward })}
                      </span>
                      <span className="text-xs font-medium text-muted">
                        {isUnlocked && record
                          ? t("unlockedOn", { date: new Date(record.unlockedAt).toLocaleDateString(locale) })
                          : t("lockedLabel")}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}