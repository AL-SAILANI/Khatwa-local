import { describe, expect, it } from "vitest";
import {
  LESSON_PRACTICE_GRAMMAR_IDS,
  LESSON_PRACTICE_GRAMMAR_QUESTIONS,
} from "./lesson-practice-grammar";
import {
  LESSON_PRACTICE_WRITING_IDS,
  LESSON_PRACTICE_WRITING_QUESTIONS,
} from "./lesson-practice-writing";
import { SAMPLE_LESSONS } from "./sample-courses";
import { skillsForTags, type SkillSection } from "./skills";

const QUESTIONS = [
  ...LESSON_PRACTICE_GRAMMAR_QUESTIONS,
  ...LESSON_PRACTICE_WRITING_QUESTIONS,
];

describe("lesson practice bank", () => {
  it("has unique ids, unique prompts and well-formed options", () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    expect(
      new Set(
        QUESTIONS.map((q) => q.prompt + q.options.map((o) => o.text).join("|")),
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

  it("gives every grammar lesson at least 8 questions and every writing-analysis lesson at least 6", () => {
    const ids = new Set(QUESTIONS.map((q) => q.id));
    for (const id of [
      ...Object.values(LESSON_PRACTICE_GRAMMAR_IDS),
      ...Object.values(LESSON_PRACTICE_WRITING_IDS),
    ].flat()) {
      expect(ids.has(id), id).toBe(true);
    }
    for (const lesson of SAMPLE_LESSONS.filter((l) =>
      /grammar|writingAnalysis/.test(l.id),
    )) {
      expect(lesson.questionIds.length, lesson.id).toBeGreaterThanOrEqual(
        lesson.id.includes("grammar") ? 8 : 6,
      );
      expect(new Set(lesson.questionIds).size, lesson.id).toBe(
        lesson.questionIds.length,
      );
    }
  });
});
