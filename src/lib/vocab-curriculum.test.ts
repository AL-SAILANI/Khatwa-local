import { describe, it, expect } from "vitest";
import {
  buildVocabCurriculum,
  dailyBatch,
  entryById,
  planDayIndex,
  resolveLinkedLesson,
  wordsPerDay,
  MIN_WORDS_PER_DAY,
  MAX_WORDS_PER_DAY,
} from "@/lib/vocab-curriculum";
import type { Lesson } from "@/types/course";
import type { VocabWord } from "@/types/vocabulary";

const mk = (id: string, level: VocabWord["level"], tags: string[], order = 0): VocabWord => ({
  id,
  word: id.replace("vocab-", ""),
  meaningAr: "معنى",
  example: "Example sentence.",
  level,
  tags,
});

function deck(): VocabWord[] {
  const words: VocabWord[] = [];
  let order = 0;
  for (const level of ["easy", "medium", "hard"] as const) {
    for (const tag of ["reading", "listening", "grammar", "writing", "academic"]) {
      for (let i = 0; i < 12; i++) {
        words.push(mk(`vocab-${level}-${tag}-${i}`, level, [tag], order++));
      }
    }
  }
  return words;
}

describe("vocab curriculum", () => {
  const full = deck();

  describe("buildVocabCurriculum", () => {
    const curriculum = buildVocabCurriculum(full);

    it("should include every word exactly once", () => {
      expect(curriculum.totalWords).toBe(full.length);
      expect(new Set(curriculum.orderedWordIds).size).toBe(full.length);
    });

    it("should order progressively easy → medium → hard", () => {
      const firstEasy = curriculum.entries[0];
      const firstHard = curriculum.entries[curriculum.totalWords - 1];
      expect(firstEasy.tier).toBe("easy");
      expect(firstHard.tier).toBe("hard");
    });

    it("should group tiers contiguously", () => {
      const tiers = curriculum.entries.map((e) => e.tier);
      const firstHard = tiers.indexOf("hard");
      expect(firstHard).not.toBe(-1);
      expect(tiers.slice(firstHard).every((t) => t === "hard")).toBe(true);
    });

    it("should interleave sections within a tier", () => {
      const tierSlice = curriculum.entries.filter((e) => e.tier === "easy").slice(0, 10);
      const sections = new Set(tierSlice.map((e) => e.section));
      expect(sections.size).toBeGreaterThan(2);
    });

    it("should anchor each word to a course lesson", () => {
      for (const entry of curriculum.entries) {
        expect(entry.linkedCourseId).toMatch(/^course-/);
        expect(entry.linkedLessonOrder).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe("wordsPerDay", () => {
    it("should divide the deck across the plan horizon", () => {
      expect(wordsPerDay(626, 30)).toBe(21);
      expect(wordsPerDay(60, 30)).toBe(5); // respects MIN
    });

    it("should obey the daily bounds", () => {
      expect(wordsPerDay(626, 7)).toBeLessThanOrEqual(MAX_WORDS_PER_DAY);
      expect(wordsPerDay(626, 7)).toBeGreaterThanOrEqual(MIN_WORDS_PER_DAY);
    });

    it("should handle degenerate durations", () => {
      expect(wordsPerDay(626, 0)).toBeGreaterThanOrEqual(MIN_WORDS_PER_DAY);
    });
  });

  describe("dailyBatch", () => {
    const curriculum = buildVocabCurriculum(full);
    const perDay = wordsPerDay(full.length, 30);

    it("should partition the deck into disjoint batches", () => {
      const all = [];
      for (let d = 0; d < 30; d++) {
        all.push(...dailyBatch(curriculum, d, perDay).map((e) => e.word.id));
      }
      expect(all.length).toBe(full.length);
      expect(new Set(all).size).toBe(full.length);
    });

    it("should reuse the last batch for an overflowing-curve deck", () => {
      const last = dailyBatch(curriculum, 29, perDay);
      expect(last.length).toBeGreaterThan(0);
    });
  });

  describe("resolveLinkedLesson", () => {
    const lessons: Lesson[] = [
      { id: "lesson-reading-1", courseId: "course-reading", title: "Reading 1", order: 1, resources: [], notes: "", questionIds: [] },
      { id: "lesson-grammar-3", courseId: "course-grammar", title: "Grammar 3", order: 3, resources: [], notes: "", questionIds: [] },
    ];

    it("should resolve the exact anchored lesson", () => {
      const curriculum = buildVocabCurriculum(full);
      const entry = curriculum.entries.find((e) => e.linkedCourseId === "course-grammar")!;
      const lesson = resolveLinkedLesson(entry, lessons);
      expect(lesson).not.toBeNull();
    });

    it("should fall back to the course's first lesson", () => {
      const curriculum = buildVocabCurriculum(full);
      const entry = curriculum.entries.find((e) => e.linkedCourseId === "course-reading")!;
      const lesson = resolveLinkedLesson({ ...entry, linkedLessonOrder: 99 }, lessons);
      expect(lesson?.courseId).toBe("course-reading");
    });

    it("should return null when no lesson matches the course", () => {
      const curriculum = buildVocabCurriculum(full);
      const entry = curriculum.entries.find((e) => e.linkedCourseId === "course-vocabulary")!;
      expect(resolveLinkedLesson(entry, lessons)).toBeNull();
    });
  });

  describe("entryById", () => {
    it("should find entries by word id", () => {
      const curriculum = buildVocabCurriculum(full);
      const first = curriculum.entries[0];
      expect(entryById(curriculum, first.word.id)).toBe(first);
      expect(entryById(curriculum, "missing")).toBeNull();
    });
  });

  describe("planDayIndex", () => {
    it("should be 0-based, clamped to the plan", () => {
      const start = "2026-01-01T00:00:00Z";
      const dayMs = 86_400_000;
      expect(planDayIndex(start, Date.parse(start) + dayMs, 30)).toBe(1);
      expect(planDayIndex(start, Date.parse(start) + 50 * dayMs, 30)).toBe(29);
      expect(planDayIndex(start, Date.parse(start) - dayMs, 30)).toBe(0);
    });
  });
});