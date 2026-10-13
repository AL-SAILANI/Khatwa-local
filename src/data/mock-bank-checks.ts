import { describe, expect, it } from "vitest";
import { STEP_SECTION_QUESTION_COUNTS } from "@/lib/constants/exam";
import type { Question, ReadingPassage } from "@/types/question";

/** Shared structural checks for a full mock-exam bank (100 questions). */
export function describeMockBank(
  name: string,
  bankTag: string,
  bank: { passages: ReadingPassage[]; questions: Question[] },
  otherIds: Set<string>,
  clipCount: number,
) {
  const ALL = bank.questions;
  describe(`${name} content`, () => {
    it("matches the official section sizes", () => {
      const count = (section: string) => ALL.filter((q) => q.section === section).length;
      expect(count("reading")).toBe(STEP_SECTION_QUESTION_COUNTS.reading);
      expect(count("grammar")).toBe(STEP_SECTION_QUESTION_COUNTS.grammar);
      expect(count("writingAnalysis")).toBe(STEP_SECTION_QUESTION_COUNTS.writingAnalysis);
      expect(count("listening")).toBe(STEP_SECTION_QUESTION_COUNTS.listening);
    });

    it("uses unique ids that do not clash with other banks", () => {
      const ids = ALL.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(otherIds.has(id)).toBe(false);
    });

    it("gives every question four distinct options, one correct answer, an explanation and the bank tag", () => {
      for (const q of ALL) {
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options.map((o) => o.text)).size).toBe(4);
        expect(q.options.filter((o) => o.id === q.correctOptionId)).toHaveLength(1);
        expect(q.explanation.length).toBeGreaterThan(10);
        expect(q.tags).toContain(bankTag);
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
      expect(bank.passages).toHaveLength(10);
      const reading = ALL.filter((q) => q.section === "reading");
      const byId = new Map(reading.map((q) => [q.id, q]));
      for (const passage of bank.passages) {
        expect(passage.questionIds).toHaveLength(4);
        const words = passage.body.split(/\s+/).length;
        expect(words).toBeGreaterThanOrEqual(120);
        expect(words).toBeLessThanOrEqual(200);
        for (const id of passage.questionIds) expect(byId.get(id)?.passageId).toBe(passage.id);
      }
      expect(reading.every((q) => q.passageId)).toBe(true);
    });

    it("covers vocabulary, detail and pronoun / inference items in every passage", () => {
      for (const passage of bank.passages) {
        const tags = new Set(
          ALL.filter((q) => q.passageId === passage.id).flatMap((q) => q.tags),
        );
        expect(tags.has("vocabulary")).toBe(true);
        expect(tags.has("detail") || tags.has("inference")).toBe(true);
        expect(tags.has("pronoun-reference") || tags.has("inference")).toBe(true);
      }
    });

    it("gives every listening question a transcript shared by its clip", () => {
      const listening = ALL.filter((q) => q.section === "listening");
      expect(listening.every((q) => (q.transcript ?? "").length > 150)).toBe(true);
      expect(new Set(listening.map((q) => q.transcript)).size).toBe(clipCount);
    });
  });
}
