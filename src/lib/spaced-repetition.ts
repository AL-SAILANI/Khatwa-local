export type ReviewQuality = 0 | 3 | 5;

export interface ReviewState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  /** Number of times this card was marked as forgotten (quality 0). Drives
   * retention-rate analytics and the session summary. */
  lapses?: number;
}

export const NEW_WORD_STATE: ReviewState = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
};

/**
 * SM-2 spaced repetition — the algorithm behind SuperMemo/Anki, and the
 * practical engine of the spacing effect described by Ebbinghaus' forgetting
 * curve (each successful retrieval lengthens the next interval).
 *
 * `quality` is simplified to 3 buttons: 0 ("لا أعرفها"), 3 ("صعبة"),
 * 5 ("سهلة") instead of the full 0-5 scale.
 *
 * Behavioral notes that keep the science intact:
 * - A failure (quality < 3) resets the repetition count, pins the next
 *   review to 1 day, and increments `lapses` — the Leitner "back to box 1"
 *   rule so the word re-enters the curve quickly.
 * - Successful reviews double-then-multiply the interval by easeFactor,
 *   mirroring the optimal-expanding-intervals findings (Cepeda et al., 2008).
 */
export function computeNextReview(state: ReviewState, quality: ReviewQuality): ReviewState & { dueAt: string } {
  let { easeFactor, intervalDays, repetitions, lapses = 0 } = state;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);

    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + intervalDays);

  return { easeFactor, intervalDays, repetitions, lapses, dueAt: dueAt.toISOString() };
}

/** Retention rate (0-1) from review history, or null when there's no data. */
export function retentionRate(totalReviews: number, lapses: number): number | null {
  if (totalReviews <= 0) return null;
  return Math.max(0, 1 - lapses / totalReviews);
}