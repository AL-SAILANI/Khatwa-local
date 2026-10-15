import { describe, expect, it } from "vitest";
import {
  TYPE_PRACTICE_GRAMMAR_QUESTIONS,
  TYPE_PRACTICE_LISTENING_QUESTIONS,
  TYPE_PRACTICE_QUESTIONS,
  TYPE_PRACTICE_READING_PASSAGES,
  TYPE_PRACTICE_READING_QUESTIONS,
} from "./type-practice";
import { skillsOfQuestion } from "@/lib/skill-mastery";

describe("type practice bank", () => {
  it("has unique ids and prompts per clip or passage, with four distinct options", () => {
    expect(new Set(TYPE_PRACTICE_QUESTIONS.map((q) => q.id)).size).toBe(
      TYPE_PRACTICE_QUESTIONS.length,
    );
    for (const q of TYPE_PRACTICE_QUESTIONS) {
      expect(q.options, q.id).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.text)).size, q.id).toBe(4);
      expect(
        q.options.some((o) => o.id === q.correctOptionId),
        q.id,
      ).toBe(true);
      expect(q.explanation.length, q.id).toBeGreaterThan(20);
    }
  });

  it("spreads the correct answer over all four positions", () => {
    const counts = new Map<string, number>();
    for (const q of TYPE_PRACTICE_QUESTIONS)
      counts.set(q.correctOptionId, (counts.get(q.correctOptionId) ?? 0) + 1);
    for (const id of ["a", "b", "c", "d"])
      expect(counts.get(id) ?? 0, id).toBeGreaterThan(8);
  });

  it("listening items carry a transcript; reading items point at their passage", () => {
    for (const q of TYPE_PRACTICE_LISTENING_QUESTIONS)
      expect(q.transcript, q.id).toBeTruthy();
    const passageIds = new Set(TYPE_PRACTICE_READING_PASSAGES.map((p) => p.id));
    for (const q of TYPE_PRACTICE_READING_QUESTIONS)
      expect(passageIds.has(q.passageId ?? ""), q.id).toBe(true);
    for (const p of TYPE_PRACTICE_READING_PASSAGES) {
      for (const id of p.questionIds)
        expect(
          TYPE_PRACTICE_READING_QUESTIONS.some((q) => q.id === id),
          id,
        ).toBe(true);
    }
  });

  it("covers each thin skill with several questions", () => {
    const counts = new Map<string, number>();
    for (const q of TYPE_PRACTICE_QUESTIONS) {
      for (const id of skillsOfQuestion(q))
        counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    for (const id of [
      "ls-opinion",
      "ls-important-idea",
      "ls-gist",
      "ls-idiom",
      "ls-evidence",
      "ls-reason",
      "ls-numbers",
      "rd-agreement",
      "gr-time-clauses",
    ]) {
      expect(counts.get(id) ?? 0, id).toBeGreaterThanOrEqual(3);
    }
    expect(TYPE_PRACTICE_GRAMMAR_QUESTIONS.length).toBe(8);
  });
});
