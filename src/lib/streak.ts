function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Same calendar day as the last recorded activity → streak unchanged.
 * Exactly the next calendar day → streak grows. Anything else (first-ever
 * activity, or a gap of 2+ days) → streak restarts at 1.
 */
export function computeNextStreak(lastActiveAt: string | null, currentStreak: number): number {
  if (!lastActiveAt) return 1;

  const dayDiff = Math.round(
    (startOfDay(new Date()) - startOfDay(new Date(lastActiveAt))) / (1000 * 60 * 60 * 24),
  );

  if (dayDiff <= 0) return currentStreak || 1;
  if (dayDiff === 1) return currentStreak + 1;
  return 1;
}

/** Appends today (if not already present) to a bounded activity-day log,
 * dropping the oldest entries beyond `maxDays` (90 ≈ three months of
 * calendar heatmap history, bounded so the profile doc stays small). */
export function withTodayMarkedActive(recentActivityDays: string[], maxDays = 90): string[] {
  const today = new Date().toISOString().slice(0, 10);
  const withoutToday = recentActivityDays.filter((day) => day !== today);
  return [...withoutToday, today].slice(-maxDays);
}
