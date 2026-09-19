const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** Returns `null` for "no timestamp yet" instead of a hardcoded fallback
 * string — callers (which have access to `useTranslations`) supply their
 * own localized "hasn't started yet" copy for that case. `now` is optional
 * so callers that re-render on a timer can pass a fresh "now" without
 * recreating a real-time clock just for tests. */
export function formatRelativeTime(
  iso: string | null,
  locale: string,
  now = Date.now(),
): string | null {
  if (!iso) return null;

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const diffSeconds = (new Date(iso).getTime() - now) / 1000;

  for (const [unit, secondsInUnit] of UNITS) {
    const value = diffSeconds / secondsInUnit;
    if (Math.abs(value) >= 1) {
      return rtf.format(Math.round(value), unit);
    }
  }

  return rtf.format(0, "minute");
}

/** Short weekday labels (Sun..Sat) in the given locale, for calendar/streak
 * widgets — derived from `Intl.DateTimeFormat` rather than a hardcoded
 * array, so it's correct for any locale without a translation key per day. */
export function getWeekdayLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  // 2024-01-07 was a Sunday — an arbitrary known-Sunday anchor date.
  return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(2024, 0, 7 + i)));
}

/** Full month name + year in the given locale (e.g. "يناير 2026" /
 * "January 2026"). */
export function getMonthYearLabel(locale: string, date: Date): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}
