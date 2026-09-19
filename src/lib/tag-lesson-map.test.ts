import { describe, expect, it } from "vitest";
import { SAMPLE_QUESTIONS } from "@/data/sample-questions";
import { suggestLessonForTag, suggestLessonsForQuestion } from "./tag-lesson-map";

describe("suggestLessonsForQuestion", () => {
  it("resolves the grammar-1 lesson for its own subject-verb-agreement question", () => {
    const question = SAMPLE_QUESTIONS.find((q) => q.id === "q-grammar-1")!;
    const lessons = suggestLessonsForQuestion(question);
    expect(lessons.length).toBeGreaterThan(0);
    expect(lessons.some((lesson) => lesson.id === "lesson-grammar-1")).toBe(true);
  });

  it("prioritizes the lesson that owns the question directly", () => {
    const question = SAMPLE_QUESTIONS.find((q) => q.id === "q-reading-13")!;
    const lessons = suggestLessonsForQuestion(question);
    expect(lessons[0]!.id).toBe("lesson-reading-3");
  });

  it("prefers same-track lessons for grammar tags", () => {
    const question = SAMPLE_QUESTIONS.find((q) => q.id === "q-grammar-10")!;
    const lessons = suggestLessonsForQuestion(question);
    expect(lessons[0]!.courseId).toBe("course-grammar");
  });

  it("returns an empty list for an unknown question", () => {
    const lessons = suggestLessonsForQuestion({
      id: "q-unknown",
      section: "grammar",
      prompt: "x",
      options: [],
      correctOptionId: "a",
      difficulty: "easy",
      tags: ["totally-unknown-tag"],
    });
    expect(lessons).toHaveLength(0);
  });
});

describe("suggestLessonForTag", () => {
  it("maps subject-verb-agreement to the grammar track", () => {
    const lesson = suggestLessonForTag("subject-verb-agreement", "grammar");
    expect(lesson?.courseId).toBe("course-grammar");
  });

  it("maps comma-splice to a writing-analysis lesson", () => {
    const lesson = suggestLessonForTag("comma-splice", "writingAnalysis");
    expect(lesson?.courseId).toBe("course-writingAnalysis");
  });

  it("normalizes tag spelling variants", () => {
    const a = suggestLessonForTag("dangling-modifiers", "writingAnalysis");
    const b = suggestLessonForTag("dangling-modifier", "writingAnalysis");
    expect(a?.id).toBe(b?.id);
  });

  it("returns null for an unmapped tag", () => {
    expect(suggestLessonForTag("no-such-tag")).toBeNull();
  });
});
