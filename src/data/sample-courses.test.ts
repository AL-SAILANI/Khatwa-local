import { describe, expect, it } from "vitest";
import { SAMPLE_COURSES, SAMPLE_LESSONS } from "@/data/sample-courses";

describe("course library integrity", () => {
  it("has unique lesson ids", () => {
    expect(new Set(SAMPLE_LESSONS.map((l) => l.id)).size).toBe(SAMPLE_LESSONS.length);
  });

  it.each(SAMPLE_COURSES.map((c) => [c.id, c] as const))(
    "%s: lessons are ordered 0..n-1 without gaps or duplicates and match lessonCount",
    (_id, course) => {
      const orders = SAMPLE_LESSONS.filter((l) => l.courseId === course.id)
        .map((l) => l.order)
        .sort((a, b) => a - b);
      expect(orders).toEqual(orders.map((_, i) => i));
      expect(orders).toHaveLength(course.lessonCount);
    },
  );

  it("every lesson belongs to a known course", () => {
    const courseIds = new Set(SAMPLE_COURSES.map((c) => c.id));
    for (const lesson of SAMPLE_LESSONS) {
      expect(courseIds.has(lesson.courseId)).toBe(true);
    }
  });
});
