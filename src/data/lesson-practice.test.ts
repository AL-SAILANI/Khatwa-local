import { describe, expect, it } from "vitest";
import {
  LESSON_PRACTICE_GRAMMAR_IDS,
  LESSON_PRACTICE_GRAMMAR_QUESTIONS,
} from "./lesson-practice-grammar";
import {
  LESSON_PRACTICE_WRITING_IDS,
  LESSON_PRACTICE_WRITING_QUESTIONS,
} from "./lesson-practice-writing";
import {
  LESSON_PRACTICE_READING_IDS,
  LESSON_PRACTICE_READING_PASSAGES,
  LESSON_PRACTICE_READING_QUESTIONS,
} from "./lesson-practice-reading";
import {
  LESSON_PRACTICE_LISTENING_IDS,
  LESSON_PRACTICE_LISTENING_QUESTIONS,
} from "./lesson-practice-listening";
import { SAMPLE_LESSONS } from "./sample-courses";
import { skillsForTags, type SkillSection } from "./skills";

const QUESTIONS = [
  ...LESSON_PRACTICE_GRAMMAR_QUESTIONS,
  ...LESSON_PRACTICE_WRITING_QUESTIONS,
  ...LESSON_PRACTICE_READING_QUESTIONS,
  ...LESSON_PRACTICE_LISTENING_QUESTIONS,
];

describe("lesson practice bank", () => {
  it("has unique ids, unique prompts and well-formed options", () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    expect(
      new Set(
        QUESTIONS.map(
          (q) =>
            q.passageId +
            q.transcript +
            q.prompt +
            q.options.map((o) => o.text).join("|"),
        ),
      ).size,
    ).toBe(QUESTIONS.length);
    for (const q of QUESTIONS) {
      expect(q.options, q.id).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.text)).size, q.id).toBe(4);
      expect(
        q.options.some((o) => o.id === q.correctOptionId),
        q.id,
      ).toBe(true);
      expect(q.explanation.length, q.id).toBeGreaterThan(10);
      expect(q.tags, q.id).toContain("lesson-practice");
      expect(
        skillsForTags(q.section as SkillSection, q.tags).length,
        q.id,
      ).toBeGreaterThan(0);
    }
  });

  it("spreads the correct answer over all four positions", () => {
    const counts = { a: 0, b: 0, c: 0, d: 0 } as Record<string, number>;
    for (const q of QUESTIONS) counts[q.correctOptionId]!++;
    for (const n of Object.values(counts))
      expect(n / QUESTIONS.length).toBeGreaterThan(0.2);
  });

  it("does not make the correct option the longest one far more often than chance", () => {
    const longest = QUESTIONS.filter((q) => {
      const lengths = q.options.map((o) => o.text.length);
      const correct = q.options.find((o) => o.id === q.correctOptionId)!.text
        .length;
      return (
        correct === Math.max(...lengths) &&
        lengths.filter((n) => n === correct).length === 1
      );
    }).length;
    expect(longest / QUESTIONS.length).toBeLessThan(0.5);
  });

  it("gives every grammar, reading and listening lesson at least 8 questions and writing-analysis at least 6", () => {
    const ids = new Set(QUESTIONS.map((q) => q.id));
    const all = [
      LESSON_PRACTICE_GRAMMAR_IDS,
      LESSON_PRACTICE_WRITING_IDS,
      LESSON_PRACTICE_READING_IDS,
      LESSON_PRACTICE_LISTENING_IDS,
    ].flatMap((map) => Object.values(map).flat());
    for (const id of all) expect(ids.has(id), id).toBe(true);

    for (const lesson of SAMPLE_LESSONS.filter((l) =>
      /grammar|writingAnalysis|reading|listening/.test(l.id),
    )) {
      expect(lesson.questionIds.length, lesson.id).toBeGreaterThanOrEqual(
        lesson.id.includes("writing") ? 6 : 8,
      );
      expect(new Set(lesson.questionIds).size, lesson.id).toBe(
        lesson.questionIds.length,
      );
    }
  });

  it("links reading questions to passages that list them and listening questions to a transcript", () => {
    const passageById = new Map(
      LESSON_PRACTICE_READING_PASSAGES.map((p) => [p.id, p]),
    );
    for (const q of LESSON_PRACTICE_READING_QUESTIONS) {
      expect(passageById.get(q.passageId ?? "")?.questionIds, q.id).toContain(
        q.id,
      );
    }
    for (const q of LESSON_PRACTICE_LISTENING_QUESTIONS)
      expect(q.transcript?.length, q.id).toBeGreaterThan(40);
  });
});
