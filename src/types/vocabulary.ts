export type VocabLevel = "easy" | "medium" | "hard";

export interface VocabWord {
  id: string;
  word: string;
  meaningAr: string;
  meaningEn?: string;
  example: string;
  audioUrl?: string;
  /** STEP vocabulary difficulty band per the step-prep-curriculum. */
  level?: VocabLevel;
  tags: string[];
}

/** A user-created vocabulary set: a named, ordered collection of word IDs. */
export interface VocabSet {
  id: string;
  userId: string;
  name: string;
  wordIds: string[];
  createdAt: string;
}

/** Per-user spaced-repetition state (SM-2 style) for a given word. */
export interface VocabReviewState {
  userId: string;
  wordId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: string;
  bookmarked: boolean;
  lastReviewedAt: string | null;
  /** Times this word was answered "لا أعرفها" (quality 0). */
  lapses?: number;
  /** Times this word was reviewed in total (any quality). */
  reviewCount?: number;
}
