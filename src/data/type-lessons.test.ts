import { describe, expect, it } from "vitest";
import { TYPE_LESSONS } from "./type-lessons";
import { SAMPLE_COURSES } from "./sample-courses";
import { getStaticQuestion } from "@/lib/tag-lesson-map";
import { buildLessonBlocks, splitNotes } from "@/lib/lesson-blocks";

describe("type lessons", () => {
  it("belong to known courses with unique ids", () => {
    const courses = new Set(SAMPLE_COURSES.map((c) => c.id));
    expect(new Set(TYPE_LESSONS.map((l) => l.id)).size).toBe(
      TYPE_LESSONS.length,
    );
    for (const lesson of TYPE_LESSONS)
      expect(courses.has(lesson.courseId), lesson.id).toBe(true);
  });

  it("only reference questions that exist, and have enough to assess", () => {
    for (const lesson of TYPE_LESSONS) {
      expect(lesson.questionIds.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(new Set(lesson.questionIds).size, lesson.id).toBe(
        lesson.questionIds.length,
      );
      for (const id of lesson.questionIds)
        expect(getStaticQuestion(id), `${lesson.id} -> ${id}`).not.toBeNull();
    }
  });

  it("use the marked note template so the viewer can build its cards", () => {
    for (const lesson of TYPE_LESSONS) {
      const parts = splitNotes(lesson.notes);
      expect(parts.explain, lesson.id).toContain("📌");
      expect(parts.explain, lesson.id).toContain("⚠️");
      expect(parts.review, lesson.id).toContain("اليوم 14");
      const questions = lesson.questionIds.map((id) => getStaticQuestion(id)!);
      const kinds = buildLessonBlocks(lesson, questions).map((b) => b.kind);
      expect(kinds, lesson.id).toEqual(
        expect.arrayContaining(["explain", "exit", "summary"]),
      );
    }
  });
});
