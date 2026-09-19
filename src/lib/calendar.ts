/** Formats a date as YYYY-MM-DD key. */
export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Sunday-first booleans for the current calendar week, `true` where
 * `recentActivityDays` (an array of "YYYY-MM-DD" strings) has an entry. */
export function getWeekActiveDays(recentActivityDays: string[]): boolean[] {
  const activeSet = new Set(recentActivityDays);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    return activeSet.has(toDateKey(day));
  });
}

/** Day-of-month numbers (for the current month) present in
 * `recentActivityDays`, for highlighting a mini calendar grid. */
export function getStudiedDaysInCurrentMonth(recentActivityDays: string[]): number[] {
  const now = new Date();
  return getStudiedDaysInMonth(recentActivityDays, now.getFullYear(), now.getMonth());
}

/** Day-of-month numbers present in `recentActivityDays` for an arbitrary
 * `year`/`month` (0-indexed), so calendar widgets can navigate history
 * instead of being locked to the current month. */
export function getStudiedDaysInMonth(recentActivityDays: string[], year: number, month: number): number[] {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;

  return recentActivityDays
    .filter((day) => day.startsWith(prefix))
    .map((day) => Number(day.slice(8, 10)))
    .sort((a, b) => a - b)
    .filter((v, i, a) => a.indexOf(v) === i);
}

/** Length of the consecutive study run that ends on `day` (day-of-month) in
 * `year`/`month`, counting backwards and across month boundaries (Dec 31 is
 * the day after Jan 1's run, etc.). Powers heat-level intensity on the
 * dashboard calendar. Returns 0 for a non-studied day. */
export function getRunEndingOn(recentActivityDays: string[], year: number, month: number, day: number): number {
  const activeSet = new Set(recentActivityDays);
  const key = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  let run = 0;
  let y = year;
  let m = month;
  let d = day;
  while (activeSet.has(key(y, m, d))) {
    run += 1;
    d -= 1;
    if (d === 0) {
      m -= 1;
      if (m < 0) {
        m = 11;
        y -= 1;
      }
      d = new Date(y, m + 1, 0).getDate();
    }
  }
  return run;
}
