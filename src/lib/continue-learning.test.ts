import { describe, it, expect } from "vitest";
import { findContinueLearningTarget } from "@/lib/continue-learning";
import type { Course, Lesson, LessonProgress } from "@/types/course";

const MOCK_COURSES: Course[] = [
  { id: "course-1", title: "Course 1", track: "reading", order: 1, description: "", lessonCount: 3, estimatedMinutes: 60 },
  { id: "course-2", title: "Course 2", track: "grammar", order: 2, description: "", lessonCount: 3, estimatedMinutes: 60 },
  { id: "course-3", title: "Course 3", track: "listening", order: 3, description: "", lessonCount: 3, estimatedMinutes: 60 },
];

const MOCK_LESSONS: Record<string, Lesson[]> = {
  "course-1": [
    { id: "lesson-1-1", courseId: "course-1", title: "Lesson 1", order: 1, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-1-2", courseId: "course-1", title: "Lesson 2", order: 2, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-1-3", courseId: "course-1", title: "Lesson 3", order: 3, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
  ],
  "course-2": [
    { id: "lesson-2-1", courseId: "course-2", title: "Lesson 1", order: 1, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-2-2", courseId: "course-2", title: "Lesson 2", order: 2, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-2-3", courseId: "course-2", title: "Lesson 3", order: 3, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
  ],
  "course-3": [
    { id: "lesson-3-1", courseId: "course-3", title: "Lesson 1", order: 1, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-3-2", courseId: "course-3", title: "Lesson 2", order: 2, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-3-3", courseId: "course-3", title: "Lesson 3", order: 3, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
  ],
};

describe("continue-learning", () => {
  describe("findContinueLearningTarget", () => {
    it("should return null for empty progress", () => {
      const result = findContinueLearningTarget(MOCK_COURSES, MOCK_LESSONS, []);
      expect(result).toBeNull();
    });

    it("should return next incomplete lesson in most recent course", () => {
      const progress: LessonProgress[] = [
        { lessonId: "lesson-1-1", userId: "user-1", completed: true, completedAt: "2025-01-12T10:00:00Z", courseId: "course-1" }, // Most recent
        { lessonId: "lesson-2-1", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-2" },
      ];

      const result = findContinueLearningTarget(MOCK_COURSES, MOCK_LESSONS, progress);

      expect(result).not.toBeNull();
      expect(result!.course.id).toBe("course-1"); // Most recent is course-1
      expect(result!.lesson.id).toBe("lesson-1-2"); // Next incomplete in course-1
    });

    it("should skip completed lessons in most recent course", () => {
      const progress: LessonProgress[] = [
        { lessonId: "lesson-2-1", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-2" },
        { lessonId: "lesson-2-2", userId: "user-1", completed: true, completedAt: "2025-01-12T10:00:00Z", courseId: "course-2" }, // Most recent, 2 lessons done
      ];

      const result = findContinueLearningTarget(MOCK_COURSES, MOCK_LESSONS, progress);

      expect(result).not.toBeNull();
      expect(result!.course.id).toBe("course-2");
      expect(result!.lesson.id).toBe("lesson-2-3"); // Third lesson
    });

    it("should fall back to next course when most recent course is complete", () => {
      const progress: LessonProgress[] = [
        { lessonId: "lesson-2-1", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-2" },
        { lessonId: "lesson-2-2", userId: "user-1", completed: true, completedAt: "2025-01-11T10:00:00Z", courseId: "course-2" },
        { lessonId: "lesson-2-3", userId: "user-1", completed: true, completedAt: "2025-01-12T10:00:00Z", courseId: "course-2" }, // Most recent, course complete
      ];

      const result = findContinueLearningTarget(MOCK_COURSES, MOCK_LESSONS, progress);

      expect(result).not.toBeNull();
      expect(result!.course.id).toBe("course-1"); // Falls back to first course in catalog order
      expect(result!.lesson.id).toBe("lesson-1-1");
    });

    it("should handle uncompleted lessons in progress", () => {
      const progress: LessonProgress[] = [
        { lessonId: "lesson-1-1", userId: "user-1", completed: false, updatedAt: "2025-01-12T10:00:00Z", courseId: "course-1" }, // Most recent, not completed
      ];

      const result = findContinueLearningTarget(MOCK_COURSES, MOCK_LESSONS, progress);

      expect(result).not.toBeNull();
      expect(result!.course.id).toBe("course-1");
      expect(result!.lesson.id).toBe("lesson-1-1"); // Same lesson (in progress)
    });

    it("should sort courses by order for fallback", () => {
      const progress: LessonProgress[] = [
        { lessonId: "lesson-3-1", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-3" },
        { lessonId: "lesson-3-2", userId: "user-1", completed: true, completedAt: "2025-01-11T10:00:00Z", courseId: "course-3" },
        { lessonId: "lesson-3-3", userId: "user-1", completed: true, completedAt: "2025-01-12T10:00:00Z", courseId: "course-3" }, // Course 3 complete
        { lessonId: "lesson-2-1", userId: "user-1", completed: true, completedAt: "2025-01-09T10:00:00Z", courseId: "course-2" },
        { lessonId: "lesson-2-2", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-2" },
        { lessonId: "lesson-2-3", userId: "user-1", completed: true, completedAt: "2025-01-11T10:00:00Z", courseId: "course-2" }, // Course 2 complete
      ];

      const result = findContinueLearningTarget(MOCK_COURSES, MOCK_LESSONS, progress);

      expect(result).not.toBeNull();
      // Should fall back to course-1 (order 1) since 2 and 3 are complete
      expect(result!.course.id).toBe("course-1");
    });

    it("should return null when all courses are complete", () => {
      const allProgress: LessonProgress[] = [
        { lessonId: "lesson-1-1", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-1" },
        { lessonId: "lesson-1-2", userId: "user-1", completed: true, completedAt: "2025-01-11T10:00:00Z", courseId: "course-1" },
        { lessonId: "lesson-1-3", userId: "user-1", completed: true, completedAt: "2025-01-12T10:00:00Z", courseId: "course-1" },
        { lessonId: "lesson-2-1", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-2" },
        { lessonId: "lesson-2-2", userId: "user-1", completed: true, completedAt: "2025-01-11T10:00:00Z", courseId: "course-2" },
        { lessonId: "lesson-2-3", userId: "user-1", completed: true, completedAt: "2025-01-12T10:00:00Z", courseId: "course-2" },
        { lessonId: "lesson-3-1", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-3" },
        { lessonId: "lesson-3-2", userId: "user-1", completed: true, completedAt: "2025-01-11T10:00:00Z", courseId: "course-3" },
        { lessonId: "lesson-3-3", userId: "user-1", completed: true, completedAt: "2025-01-12T10:00:00Z", courseId: "course-3" },
      ];

      const result = findContinueLearningTarget(MOCK_COURSES, MOCK_LESSONS, allProgress);
      expect(result).toBeNull();
    });

    it("should handle courses with no lessons", () => {
      const coursesWithEmpty: Course[] = [
        { id: "empty-course", title: "Empty", track: "vocabulary", order: 1, description: "", lessonCount: 0, estimatedMinutes: 0 },
        { id: "course-1", title: "Course 1", track: "reading", order: 2, description: "", lessonCount: 3, estimatedMinutes: 60 },
      ];
      const lessonsWithEmpty: Record<string, Lesson[]> = {
        "empty-course": [],
        "course-1": MOCK_LESSONS["course-1"],
      };

      const progress: LessonProgress[] = [
        { lessonId: "lesson-1-1", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-1" },
      ];

      const result = findContinueLearningTarget(coursesWithEmpty, lessonsWithEmpty, progress);
      expect(result).not.toBeNull();
      expect(result!.course.id).toBe("course-1");
    });

    it("should ignore progress for non-existent courses", () => {
      const progress: LessonProgress[] = [
        { lessonId: "lesson-x-1", userId: "user-1", completed: true, completedAt: "2025-01-12T10:00:00Z", courseId: "non-existent" },
        { lessonId: "lesson-1-1", userId: "user-1", completed: true, completedAt: "2025-01-10T10:00:00Z", courseId: "course-1" },
      ];

      const result = findContinueLearningTarget(MOCK_COURSES, MOCK_LESSONS, progress);
      // Should fall back to course-1 since non-existent course is not in courses list
      expect(result).not.toBeNull();
      expect(result!.course.id).toBe("course-1");
    });
  });
});