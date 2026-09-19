/** XP needed to reach each level, index = level - 1. Level 1 starts at 0 XP;
 * each level roughly needs 20% more XP than the last. */
const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];

export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

export interface LevelProgress {
  /** Display title lives in `messages/*.json` under `levelTitles.{level}` —
   * this module has no access to `useTranslations`, so it returns the raw
   * level number and lets the calling component look up the title. */
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number | null;
  percentToNextLevel: number;
}

export function getLevelProgress(xp: number): LevelProgress {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    const threshold = LEVEL_THRESHOLDS[i];
    if (threshold !== undefined && xp >= threshold) {
      level = i + 1;
      break;
    }
  }

  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level] ?? null : null;

  return {
    level,
    xpIntoLevel: xp - currentThreshold,
    xpForNextLevel: nextThreshold !== null ? nextThreshold - currentThreshold : null,
    percentToNextLevel:
      nextThreshold !== null
        ? Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
        : 100,
  };
}
