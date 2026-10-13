import type { ExamSectionKey, Question } from "@/types/question";

/** Compact authoring format for a multiple-choice question: the correct answer
 * is written first and `buildQuestions` places it at a rotating position so
 * the answer key is evenly spread over A-D without hand-balancing. */
export interface QuestionSpec {
  id: string;
  prompt: string;
  correct: string;
  wrong: [string, string, string];
  why: string;
  level: Question["difficulty"];
  tags: string[];
  passageId?: string;
  transcript?: string;
}

const OPTION_IDS = ["a", "b", "c", "d"] as const;

export function buildQuestions(section: ExamSectionKey, bankTag: string, specs: QuestionSpec[]): Question[] {
  return specs.map((spec, index) => {
    const slot = (index + Math.floor(index / 4)) % 4;
    const texts = [...spec.wrong];
    texts.splice(slot, 0, spec.correct);
    return {
      id: spec.id,
      section,
      ...(spec.passageId ? { passageId: spec.passageId } : {}),
      ...(spec.transcript ? { transcript: spec.transcript } : {}),
      prompt: spec.prompt,
      options: texts.map((text, i) => ({ id: OPTION_IDS[i]!, text })),
      correctOptionId: OPTION_IDS[slot]!,
      explanation: spec.why,
      difficulty: spec.level,
      tags: [...spec.tags, bankTag],
    };
  });
}
