import { describe, expect, it } from "vitest";
import { toCourse, toLesson, toQuestion, toVocabWord } from "./catalog";

describe("supabase catalog mappers", () => {
  it("maps snake_case course rows and turns null optionals into undefined", () => {
    const course = toCourse({
      id: "c1", track: "grammar", title: "T", description: "D", order: 2,
      lesson_count: 14, estimated_minutes: 90, cover_image: null,
    });
    expect(course).toEqual({
      id: "c1", track: "grammar", title: "T", description: "D", order: 2,
      lessonCount: 14, estimatedMinutes: 90, coverImage: undefined,
    });
  });

  it("maps lessons with default empty arrays", () => {
    const lesson = toLesson({
      id: "l1", course_id: "c1", title: "L", order: 1, resources: null, notes: "n", question_ids: null,
    });
    expect(lesson.courseId).toBe("c1");
    expect(lesson.resources).toEqual([]);
    expect(lesson.questionIds).toEqual([]);
  });

  it("maps question rows including optional audio/passage links", () => {
    const q = toQuestion({
      id: "q1", section: "listening", course_id: null, passage_id: "p1", audio_url: "/a.mp3",
      transcript: null, prompt: "?", options: [{ id: "a", text: "A" }], correct_option_id: "a",
      explanation: "e", difficulty: "easy", tags: ["x"],
    });
    expect(q.passageId).toBe("p1");
    expect(q.audioUrl).toBe("/a.mp3");
    expect(q.courseId).toBeUndefined();
    expect(q.correctOptionId).toBe("a");
  });

  it("maps vocab words", () => {
    const w = toVocabWord({
      id: "w1", word: "abate", meaning_ar: "يخف", meaning_en: null, example: "ex",
      audio_url: null, level: "hard", tags: null,
    });
    expect(w).toMatchObject({ meaningAr: "يخف", level: "hard", tags: [] });
    expect(w.meaningEn).toBeUndefined();
  });
});
