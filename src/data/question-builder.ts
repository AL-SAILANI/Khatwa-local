import type { ExamSectionKey, Question } from "@/types/question";
import { MOCK_LISTENING_AUDIO } from "@/data/mock-listening-audio";

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
  // A clip is shared by several questions; its MP3 is named after the first.
  const clipIds = new Map<string, string>();
  for (const spec of specs) {
    if (spec.transcript && !clipIds.has(spec.transcript)) clipIds.set(spec.transcript, spec.id);
  }

  return specs.map((spec, index) => {
    const clipId = spec.transcript ? clipIds.get(spec.transcript) : undefined;
    const slot = (index + Math.floor(index / 4)) % 4;
    const texts = [...spec.wrong];
    texts.splice(slot, 0, spec.correct);
    return {
      id: spec.id,
      section,
      ...(spec.passageId ? { passageId: spec.passageId } : {}),
      ...(spec.transcript ? { transcript: spec.transcript } : {}),
      ...(clipId && MOCK_LISTENING_AUDIO.has(clipId) ? { audioUrl: `/audio/listening/${clipId}.mp3` } : {}),
      prompt: spec.prompt,
      options: texts.map((text, i) => ({ id: OPTION_IDS[i]!, text })),
      correctOptionId: OPTION_IDS[slot]!,
      explanation: spec.why,
      difficulty: spec.level,
      tags: [...spec.tags, bankTag],
    };
  });
}

/** Spreads the correct answer evenly over A-D within each section of a
 * hand-written question list (they were written with the key clustered on
 * B), so the answer position carries no information. Deterministic: the n-th
 * question of a section gets the same slot `buildQuestions` would use. The
 * other options keep their relative order; ids are re-lettered by position. */
export function rebalanceAnswerKey(questions: Question[]): Question[] {
  const counters = new Map<string, number>();
  return questions.map((question) => {
    const n = counters.get(question.section) ?? 0;
    counters.set(question.section, n + 1);
    if (question.options.length !== OPTION_IDS.length) return question;

    const slot = (n + Math.floor(n / 4)) % 4;
    const correct = question.options.find((option) => option.id === question.correctOptionId);
    if (!correct) return question;

    const others = question.options.filter((option) => option !== correct);
    const ordered = [...others];
    ordered.splice(slot, 0, correct);
    return {
      ...question,
      options: ordered.map((option, i) => ({ ...option, id: OPTION_IDS[i]! })),
      correctOptionId: OPTION_IDS[slot]!,
    };
  });
}
