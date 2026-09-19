"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar, CalendarDays, Crown, Flame, Gauge, Medal, Trophy, Trophy as EmptyTrophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/cn";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getLeaderboard, getLeaderboardByPeriod, type PublicProfile } from "@/lib/firestore/public-profiles";

type LeaderboardPeriod = "all" | "weekly" | "monthly";

type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

const PERIOD_OPTIONS: { value: LeaderboardPeriod; label: string; icon: LucideIcon }[] = [
  { value: "all", label: "periods.all", icon: Trophy },
  { value: "weekly", label: "periods.weekly", icon: CalendarDays },
  { value: "monthly", label: "periods.monthly", icon: Calendar },
];

const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: "all", label: "levels.all" },
  { value: "beginner", label: "levels.beginner" },
  { value: "intermediate", label: "levels.intermediate" },
  { value: "advanced", label: "levels.advanced" },
];

const LEVEL_STYLES: Record<string, string> = {
  beginner: "bg-success/10 text-success dark:bg-success/20",
  intermediate: "bg-warning/10 text-warning dark:bg-warning/20",
  advanced: "bg-error/10 text-error dark:bg-error/20",
};

/**
 * Top-3 podium styling. The `from-/to-` colour stops these entries used to
 * carry did nothing — the card they land on is `bg-surface`, with no
 * `bg-gradient-to-*` to attach them to — and a `medal` key was defined but
 * never read anywhere, so both are gone. Only the border tone survives.
 */
const PODIUM = [
  {
    place: 2,
    tone: "border-muted/20",
    height: "h-16",
    icon: "bg-slate-400 text-white dark:bg-slate-500",
  },
  {
    place: 1,
    tone: "border-secondary-500/30",
    height: "h-24",
    // Was `bg-ink-violet text-ink-violet` — the crown was the same colour as
    // the square it sat on, so first place showed an empty box.
    icon: "bg-ink-violet text-butter-yellow",
  },
  {
    place: 3,
    tone: "border-bronze/25",
    height: "h-12",
    icon: "bg-bronze text-white",
  },
];

export function LeaderboardPage() {
  const t = useTranslations("leaderboard");
  const { user } = useUserProfile();
  const [entries, setEntries] = useState<PublicProfile[] | null>(null);
  const [period, setPeriod] = useState<LeaderboardPeriod>("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = period === "all" ? await getLeaderboard(50) : await getLeaderboardByPeriod(period, 50);
        if (!cancelled) setEntries(data);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [period]);

  const filteredEntries = useMemo(() => {
    if (!entries || levelFilter === "all") return entries ?? [];
    return entries.filter((entry) => entry.level === levelFilter);
  }, [entries, levelFilter]);

  const podium = useMemo(() => filteredEntries.slice(0, 3), [filteredEntries]);
  const rankedList = useMemo(() => filteredEntries.slice(3), [filteredEntries]);

  const renderAvatar = (entry: PublicProfile, className?: string) => {
    return (
      <Avatar
        emoji={entry.avatarEmoji}
        photoURL={entry.photoURL}
        name={entry.name}
        className={className}
      />
    );
  };

  const renderRow = (entry: PublicProfile, rank: number) => {
    const isYou = entry.uid === user?.uid;
    const prev = filteredEntries[rank - 2];
    const gap = prev && prev.xp > entry.xp ? prev.xp - entry.xp : null;

    return (
      <div
        key={entry.uid}
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-3.5",
          isYou && "bg-primary-50/80 dark:bg-primary-500/10",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "grid w-7 shrink-0 place-items-center rounded-lg py-1 text-xs font-bold",
              rank === 1
                ? "bg-secondary-500/15 text-cream-paper dark:text-secondary-300"
                : rank === 2
                  ? "bg-muted/10 text-muted"
                  : rank === 3
                    ? "bg-bronze/10 text-bronze"
                    : "text-muted",
            )}
          >
            {rank}
          </span>
          {renderAvatar(entry, "size-9")}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={cn("truncate text-sm font-semibold", isYou && "text-ink-violet dark:text-primary-300")}>
                {entry.name}
              </span>
              {isYou && (
                <Badge variant="primary" size="sm" className="shrink-0">
                  {t("you")}
                </Badge>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              {entry.level && (
                <span className={cn("rounded-none px-1.5 py-px text-xs font-medium", LEVEL_STYLES[entry.level])}>
                  {t(`levels.${entry.level}`)}
                </span>
              )}
              {entry.streak > 0 && (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted">
                  <Flame className="size-3 text-amber-600 dark:text-amber-400" />
                  {entry.streak}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {gap !== null && (
            <span className="hidden text-xs text-muted sm:block">
              {t("behindNext", { xp: gap.toLocaleString() })}
            </span>
          )}
          <span className="text-sm font-bold tabular-nums text-ink-violet dark:text-primary-400">
            {entry.xp.toLocaleString()}
          </span>
          <span className="w-9 text-left text-xs text-muted">{t("pointsShort")}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-6 lg:p-8">
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={Medal}
        eyebrowTone="gold"
        title={t("pageTitle")}
        description={t("description")}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex items-center gap-1 rounded-none border border-border bg-surface p-1"
          role="group"
          aria-label={t("periodFilter")}
        >
          {PERIOD_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              aria-pressed={period === value}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-none px-3.5 py-1.5 text-xs font-medium transition-all",
                period === value
                  ? "bg-butter-yellow text-ink-violet"
                  : "text-muted hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {t(label)}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2">
          <Gauge className="size-4 text-muted" />
          <span className="sr-only">{t("levelFilter")}</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
            className="h-9 rounded-none border border-border bg-surface px-3.5 text-xs text-foreground focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
          >
            {LEVEL_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {t(label)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && entries === null ? (
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            <span className="text-sm text-muted">{t("loading")}</span>
          </div>
        </div>
      ) : entries === null || entries.length === 0 ? (
        <EmptyState
          icon={<EmptyTrophy className="size-7" />}
          title={t("notEnoughData")}
          description={period !== "all" ? t("tryAllTime") : undefined}
        />
      ) : filteredEntries.length === 0 ? (
        <EmptyState
          icon={<EmptyTrophy className="size-7" />}
          title={t("noLevelMatches")}
        />
      ) : (
        <>
          {/* Podium */}
          {filteredEntries.length >= 3 && (
            <div className="grid grid-cols-3 items-end gap-3">
              {podium.map((entry, i) => {
                const config = PODIUM[i]!;
                const isYou = entry.uid === user?.uid;
                return (
                  <div
                    key={entry.uid}
                    className={cn(
                      "flex flex-col items-center rounded-2xl border bg-surface p-3 text-center",
                      config.tone,
                    )}
                  >
                    <div className={cn("flex w-9 items-center justify-center rounded-t-lg", config.icon)}>
                      {config.place === 1 ? (
                        <Crown className="size-3.5" />
                      ) : (
                        <Medal className="size-3.5" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-muted">{config.place}</span>
                    <div className={cn("mt-1", config.height)}>{renderAvatar(entry, "size-14")}</div>
                    <div className="mt-2 w-full truncate text-xs font-semibold">{entry.name}</div>
                    <div className="text-xs font-bold tabular-nums text-ink-violet dark:text-primary-400">
                      {entry.xp.toLocaleString()}
                    </div>
                    {isYou && (
                      <Badge variant="primary" size="sm" className="mt-1">
                        {t("you")}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Ranked list */}
          <Card className="divide-y divide-border p-0">
            {podium.map((entry, i) => renderRow(entry, i + 1))}
            {rankedList.map((entry, i) => renderRow(entry, i + 4))}
          </Card>
        </>
      )}
    </div>
  );
}
