import type { ExamSectionKey } from "@/types/question";

/** Official STEP exam shape per the step-prep-curriculum: 100 questions across
 * 165 minutes (2h45m), split 40% reading / 30% grammar / 20% listening / 10%
 * writing analysis. */
export const STEP_TOTAL_QUESTIONS = 100;
export const STEP_TOTAL_MINUTES = 165;

export const STEP_SECTION_WEIGHTS: Record<ExamSectionKey, number> = {
  reading: 0.4,
  grammar: 0.3,
  listening: 0.2,
  writingAnalysis: 0.1,
};

export const STEP_SECTION_QUESTION_COUNTS: Record<ExamSectionKey, number> = {
  reading: Math.round(STEP_TOTAL_QUESTIONS * STEP_SECTION_WEIGHTS.reading),
  grammar: Math.round(STEP_TOTAL_QUESTIONS * STEP_SECTION_WEIGHTS.grammar),
  listening: Math.round(STEP_TOTAL_QUESTIONS * STEP_SECTION_WEIGHTS.listening),
  writingAnalysis: Math.round(STEP_TOTAL_QUESTIONS * STEP_SECTION_WEIGHTS.writingAnalysis),
};

/** The order sections appear in the real STEP exam: Reading first, then the
 * Grammar + Writing Analysis block (one combined 40-question / 30-minute
 * unit), then Listening last. The exam flow builds questions in this order
 * and the palette groups by it. */
export const STEP_SECTION_ORDER: readonly ExamSectionKey[] = [
  "reading",
  "grammar",
  "writingAnalysis",
  "listening",
];

/** Per-section minutes from the curriculum. NOTE: the curriculum allocates one
 * combined 30-minute block to Grammar (30%) + Writing Analysis (10%) — 40
 * questions in 30 min — so `grammar` and `writingAnalysis` here both describe
 * that same block and must never be summed together. */
export const STEP_SECTION_MINUTES: Record<ExamSectionKey, number> = {
  reading: 60,
  listening: 25,
  grammar: 30,
  writingAnalysis: 30,
};

export const STUDY_GOALS = [60, 70, 80, 90, 95] as const;
export const PLAN_DURATIONS = [7, 15, 30] as const;

/** Next official STEP exam session. This is a placeholder — update to the real
 * announced session date (steps.sa) so the landing countdown stays accurate. */
export const NEXT_STEP_EXAM_AT = "2026-12-12T09:00:00+03:00";
