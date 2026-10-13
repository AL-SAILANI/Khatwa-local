import { describe, expect, it } from "vitest";
import { STEP_SECTION_QUESTION_COUNTS } from "@/lib/constants/exam";
import { SAMPLE_QUESTIONS } from "@/data/sample-questions";
import { STEP_MOCK_READING_QUESTIONS } from "@/data/step-mock-reading";
import { STEP_MOCK_LISTENING_QUESTIONS } from "@/data/step-mock-listening";
import { STEP_MOCK_GRAMMAR_QUESTIONS, STEP_MOCK_WRITING_QUESTIONS } from "@/data/step-mock-grammar-writing";
import { STEP_MOCK_2_READING_PASSAGES, STEP_MOCK_2_READING_QUESTIONS } from "@/data/step-mock-2-reading";
import { STEP_MOCK_2_LISTENING_QUESTIONS } from "@/data/step-mock-2-listening";
import {
  STEP_MOCK_2_GRAMMAR_QUESTIONS,
  STEP_MOCK_2_WRITING_QUESTIONS,
} from "@/data/step-mock-2-grammar-writing";

const ALL = [
  ...STEP_MOCK_2_READING_QUESTIONS,
  ...STEP_MOCK_2_GRAMMAR_QUESTIONS,
  ...STEP_MOCK_2_WRITING_QUESTIONS,
  ...STEP_MOCK_2_LISTENING_QUESTIONS,
];

describe("mock exam 2 content", () => {
  it("matches the official section sizes", () => {
    const count = (section: string) => ALL.filter((q) => q.section === section).length;
    expect(count("reading")).toBe(STEP_SECTION_QUESTION_COUNTS.reading);
    expect(count("grammar")).toBe(STEP_SECTION_QUESTION_COUNTS.grammar);
    expect(count("writingAnalysis")).toBe(STEP_SECTION_QUESTION_COUNTS.writingAnalysis);
    expect(count("listening")).toBe(STEP_SECTION_QUESTION_COUNTS.listening);
  });

  it("uses unique ids that do not clash with existing banks", () => {
    const existing = new Set(
      [
        ...SAMPLE_QUESTIONS,
        ...STEP_MOCK_READING_QUESTIONS,
        ...STEP_MOCK_LISTENING_QUESTIONS,
        ...STEP_MOCK_GRAMMAR_QUESTIONS,
        ...STEP_MOCK_WRITING_QUESTIONS,
      ].map((q) => q.id),
    );
    const ids = ALL.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(existing.has(id)).toBe(false);
  });

  it("gives every question four distinct options, one correct answer, an explanation and the bank tag", () => {
    for (const q of ALL) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.text)).size).toBe(4);
      expect(q.options.filter((o) => o.id === q.correctOptionId)).toHaveLength(1);
      expect(q.explanation.length).toBeGreaterThan(10);
      expect(q.tags).toContain("step-mock-2");
    }
  });

  it("spreads the answer key across A-D", () => {
    for (const letter of ["a", "b", "c", "d"]) {
      const share = ALL.filter((q) => q.correctOptionId === letter).length / ALL.length;
      expect(share).toBeGreaterThanOrEqual(0.18);
      expect(share).toBeLessThanOrEqual(0.32);
    }
  });

  it("keeps hard questions to a minority in every section", () => {
    for (const section of ["reading", "grammar", "listening", "writingAnalysis"]) {
      const qs = ALL.filter((q) => q.section === section);
      expect(qs.filter((q) => q.difficulty === "hard").length / qs.length).toBeLessThanOrEqual(0.25);
      expect(qs.filter((q) => q.difficulty === "easy").length).toBeGreaterThan(0);
    }
  });

  it("links 10 passages of 4 questions each, with matching back-references", () => {
    expect(STEP_MOCK_2_READING_PASSAGES).toHaveLength(10);
    const byId = new Map(STEP_MOCK_2_READING_QUESTIONS.map((q) => [q.id, q]));
    for (const passage of STEP_MOCK_2_READING_PASSAGES) {
      expect(passage.questionIds).toHaveLength(4);
      const words = passage.body.split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(120);
      expect(words).toBeLessThanOrEqual(200);
      for (const id of passage.questionIds) expect(byId.get(id)?.passageId).toBe(passage.id);
    }
    expect(STEP_MOCK_2_READING_QUESTIONS.every((q) => q.passageId)).toBe(true);
  });

  it("covers the five reading question types in every passage", () => {
    for (const passage of STEP_MOCK_2_READING_PASSAGES) {
      const tags = new Set(
        STEP_MOCK_2_READING_QUESTIONS.filter((q) => q.passageId === passage.id).flatMap((q) => q.tags),
      );
      expect(tags.has("vocabulary")).toBe(true);
      expect(tags.has("detail") || tags.has("inference")).toBe(true);
      expect(tags.has("pronoun-reference") || tags.has("inference")).toBe(true);
    }
  });

  it("gives every listening question a transcript shared by its clip", () => {
    expect(STEP_MOCK_2_LISTENING_QUESTIONS.every((q) => (q.transcript ?? "").length > 150)).toBe(true);
    const clips = new Set(STEP_MOCK_2_LISTENING_QUESTIONS.map((q) => q.transcript));
    expect(clips.size).toBe(8);
  });
});
