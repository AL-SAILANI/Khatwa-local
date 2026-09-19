import { describe, it, expect } from "vitest";
import { recommendDuration, buildStudyPath, difficultyOf } from "@/lib/study-plan-generator";
import { PLAN_DURATIONS } from "@/lib/constants/exam";
import type { Lesson } from "@/types/course";

const CONTENT_TRACKS = ["grammar", "reading", "listening", "writingAnalysis", "vocabulary"] as const;
const AUX_TRACKS = ["tips", "strategies", "revision"] as const;

function lesson(id: string, courseId: string, order: number): Lesson {
  return { id, courseId, title: id, order, resources: [], notes: "", questionIds: [] };
}

/** Mirrors the seeded library: 8 lessons per content track, 3 per aux track. */
function sampleLibrary(): Lesson[] {
  const lessons: Lesson[] = [];
  for (const track of CONTENT_TRACKS) {
    for (let order = 0; order < 8; order++) {
      lessons.push(lesson(`lesson-${track}-${order + 1}`, `course-${track}`, order));
    }
  }
  for (const track of AUX_TRACKS) {
    for (let order = 0; order < 3; order++) {
      lessons.push(lesson(`lesson-${track}-${order + 1}`, `course-${track}`, order));
    }
  }
  return lessons;
}

function flattenIds(days: ReturnType<typeof buildStudyPath>): string[] {
  return days.flatMap((day) => day.lessonIds);
}

describe("study-plan-generator", () => {
  describe("recommendDuration", () => {
    it("should recommend 7 days for small gap (<= 10)", () => {
      expect(recommendDuration(80, 75)).toBe(7);
      expect(recommendDuration(90, 85)).toBe(7);
      expect(recommendDuration(95, 90)).toBe(7);
    });

    it("should recommend 15 days for medium gap (<= 25)", () => {
      expect(recommendDuration(80, 60)).toBe(15);
      expect(recommendDuration(90, 70)).toBe(15);
      expect(recommendDuration(95, 75)).toBe(15);
    });

    it("should recommend 30 days for large gap (> 25)", () => {
      expect(recommendDuration(80, 40)).toBe(30);
      expect(recommendDuration(90, 50)).toBe(30);
      expect(recommendDuration(95, 50)).toBe(30);
    });

    it("should assume goal - 20 when currentScore is null", () => {
      expect(recommendDuration(80, null)).toBe(15);
      expect(recommendDuration(90, null)).toBe(15);
    });

    it("should return valid plan durations", () => {
      for (let goal = 60; goal <= 95; goal += 5) {
        for (let current = 0; current <= goal; current += 10) {
          expect(PLAN_DURATIONS).toContain(recommendDuration(goal, current));
        }
      }
    });
  });

  describe("buildStudyPath", () => {
    it("should generate exactly durationDays days", () => {
      for (const duration of [7, 15, 30]) {
        const schedule = buildStudyPath(duration, sampleLibrary());
        expect(schedule).toHaveLength(duration);
        schedule.forEach((day, index) => {
          expect(day.dayIndex).toBe(index);
          expect(day.completed).toBe(false);
        });
      }
    });

    it("should never exceed two lessons per day", () => {
      for (const duration of [7, 15, 30]) {
        const schedule = buildStudyPath(duration, sampleLibrary());
        for (const day of schedule) {
          expect(day.lessonIds.length).toBeLessThanOrEqual(2);
        }
      }
    });

    it("should leave no day empty when there is enough content", () => {
      for (const duration of [7, 15, 30]) {
        const schedule = buildStudyPath(duration, sampleLibrary());
        for (const day of schedule) {
          expect(day.lessonIds.length).toBeGreaterThan(0);
        }
      }
    });

    it("should cover the whole library on a 30-day plan with no duplicates", () => {
      const schedule = buildStudyPath(30, sampleLibrary());
      const ids = flattenIds(schedule);
      const library = sampleLibrary();
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.length).toBe(library.length);
    });

    it("should cap the path at two lessons/day for short plans", () => {
      const schedule7 = buildStudyPath(7, sampleLibrary());
      expect(flattenIds(schedule7)).toHaveLength(14);
      const schedule15 = buildStudyPath(15, sampleLibrary());
      expect(flattenIds(schedule15)).toHaveLength(30);
    });

    it("should interleave skills within a day (day 1 = reading + listening)", () => {
      const schedule = buildStudyPath(30, sampleLibrary());
      const day0 = schedule[0].lessonIds;
      expect(day0).toHaveLength(2);
      const tracks = day0.map((id) => id.replace("lesson-", "").replace(/-\d+$/, ""));
      expect(tracks).toContain("reading");
      expect(tracks).toContain("listening");
      expect(new Set(tracks).size).toBe(tracks.length);
    });

    it("should progress difficulty within each content track", () => {
      const schedule = buildStudyPath(30, sampleLibrary());
      const ids = flattenIds(schedule);
      for (const track of CONTENT_TRACKS) {
        const orders = ids
          .filter((id) => id.startsWith(`lesson-${track}-`))
          .map((id) => Number(id.replace(`lesson-${track}-`, "")));
        expect(orders).toEqual([...orders].sort((a, b) => a - b));
      }
    });

    it("should include revision lessons in a 30-day plan", () => {
      const ids = flattenIds(buildStudyPath(30, sampleLibrary()));
      expect(ids.some((id) => id.startsWith("lesson-revision-"))).toBe(true);
    });

    it("should include tips and strategies lessons in a 30-day plan", () => {
      const ids = flattenIds(buildStudyPath(30, sampleLibrary()));
      expect(ids.some((id) => id.startsWith("lesson-tips-"))).toBe(true);
      expect(ids.some((id) => id.startsWith("lesson-strategies-"))).toBe(true);
    });

    it("should be deterministic", () => {
      const library = sampleLibrary();
      expect(buildStudyPath(30, library)).toEqual(buildStudyPath(30, library));
    });
  });

  describe("difficultyOf", () => {
    it("should map content lesson order to difficulty", () => {
      expect(difficultyOf(lesson("a", "course-reading", 0))).toBe("easy");
      expect(difficultyOf(lesson("a", "course-reading", 2))).toBe("easy");
      expect(difficultyOf(lesson("a", "course-reading", 3))).toBe("medium");
      expect(difficultyOf(lesson("a", "course-reading", 5))).toBe("medium");
      expect(difficultyOf(lesson("a", "course-reading", 6))).toBe("hard");
      expect(difficultyOf(lesson("a", "course-reading", 7))).toBe("hard");
    });

    it("should return null for auxiliary tracks", () => {
      expect(difficultyOf(lesson("a", "course-tips", 0))).toBeNull();
      expect(difficultyOf(lesson("a", "course-revision", 1))).toBeNull();
    });
  });
});
