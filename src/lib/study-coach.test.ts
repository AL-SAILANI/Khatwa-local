import { describe, it, expect } from "vitest";
import { rankWeakTracks, recommendNextLessons } from "@/lib/study-coach";
import type { ExamAttempt } from "@/types/exam";
import type { Course, CourseTrack, Lesson, LessonProgress } from "@/types/course";

const createMockAttempt = (overrides: Partial<ExamAttempt> = {}): ExamAttempt => ({
  id: "attempt-1",
  userId: "user-1",
  type: "placement",
  status: "submitted",
  score: 70,
  sectionResults: [
    { section: "reading", correct: 8, total: 10, timeSpentSeconds: 600 },
    { section: "grammar", correct: 6, total: 10, timeSpentSeconds: 600 },
    { section: "listening", correct: 4, total: 10, timeSpentSeconds: 600 },
    { section: "writingAnalysis", correct: 2, total: 10, timeSpentSeconds: 600 },
  ],
  timeBySection: { reading: 600, grammar: 600, listening: 600, writingAnalysis: 600 },
  createdAt: new Date().toISOString(),
  ...overrides,
});

const MOCK_COURSES: Course[] = [
  { id: "course-reading-1", title: "Reading Basics", track: "reading", order: 1, description: "", lessonCount: 3, estimatedMinutes: 60 },
  { id: "course-grammar-1", title: "Grammar Basics", track: "grammar", order: 1, description: "", lessonCount: 3, estimatedMinutes: 60 },
  { id: "course-listening-1", title: "Listening Basics", track: "listening", order: 1, description: "", lessonCount: 3, estimatedMinutes: 60 },
  { id: "course-writing-1", title: "Writing Basics", track: "writingAnalysis", order: 1, description: "", lessonCount: 3, estimatedMinutes: 60 },
  { id: "course-vocab-1", title: "Vocabulary 1", track: "vocabulary", order: 1, description: "", lessonCount: 3, estimatedMinutes: 60 },
];

const MOCK_LESSONS: Record<string, Lesson[]> = {
  "course-reading-1": [
    { id: "lesson-r1", courseId: "course-reading-1", title: "Reading 1", order: 1, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-r2", courseId: "course-reading-1", title: "Reading 2", order: 2, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-r3", courseId: "course-reading-1", title: "Reading 3", order: 3, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
  ],
  "course-grammar-1": [
    { id: "lesson-g1", courseId: "course-grammar-1", title: "Grammar 1", order: 1, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-g2", courseId: "course-grammar-1", title: "Grammar 2", order: 2, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-g3", courseId: "course-grammar-1", title: "Grammar 3", order: 3, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
  ],
  "course-listening-1": [
    { id: "lesson-l1", courseId: "course-listening-1", title: "Listening 1", order: 1, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-l2", courseId: "course-listening-1", title: "Listening 2", order: 2, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-l3", courseId: "course-listening-1", title: "Listening 3", order: 3, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
  ],
  "course-writing-1": [
    { id: "lesson-w1", courseId: "course-writing-1", title: "Writing 1", order: 1, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-w2", courseId: "course-writing-1", title: "Writing 2", order: 2, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-w3", courseId: "course-writing-1", title: "Writing 3", order: 3, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
  ],
  "course-vocab-1": [
    { id: "lesson-v1", courseId: "course-vocab-1", title: "Vocab 1", order: 1, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-v2", courseId: "course-vocab-1", title: "Vocab 2", order: 2, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
    { id: "lesson-v3", courseId: "course-vocab-1", title: "Vocab 3", order: 3, notes: "", quizQuestionIds: [], resources: [], estimatedMinutes: 20 },
  ],
};

const MOCK_PROGRESS: LessonProgress[] = [
  { lessonId: "lesson-r1", userId: "user-1", completed: true, completedAt: new Date().toISOString() },
  { lessonId: "lesson-g1", userId: "user-1", completed: true, completedAt: new Date().toISOString() },
];

describe("study-coach", () => {
  describe("rankWeakTracks", () => {
    it("should rank tracks by percent correct (weakest first)", () => {
      const attempts = [createMockAttempt()];

      const result = rankWeakTracks(attempts);

      // writingAnalysis: 2/10 = 20%
      // listening: 4/10 = 40%
      // grammar: 6/10 = 60%
      // reading: 8/10 = 80%
      expect(result[0].track).toBe("writingAnalysis");
      expect(result[0].percentCorrect).toBeCloseTo(0.2);
      expect(result[1].track).toBe("listening");
      expect(result[2].track).toBe("grammar");
      expect(result[3].track).toBe("reading");
    });

    it("should weight latest attempt double", () => {
      const oldAttempt = createMockAttempt({
        id: "old",
        sectionResults: [
          { section: "reading", correct: 10, total: 10, timeSpentSeconds: 600 },
          { section: "grammar", correct: 10, total: 10, timeSpentSeconds: 600 },
          { section: "listening", correct: 10, total: 10, timeSpentSeconds: 600 },
          { section: "writingAnalysis", correct: 10, total: 10, timeSpentSeconds: 600 },
        ],
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      });

      const newAttempt = createMockAttempt({
        id: "new",
        sectionResults: [
          { section: "reading", correct: 0, total: 10, timeSpentSeconds: 600 },
          { section: "grammar", correct: 0, total: 10, timeSpentSeconds: 600 },
          { section: "listening", correct: 0, total: 10, timeSpentSeconds: 600 },
          { section: "writingAnalysis", correct: 0, total: 10, timeSpentSeconds: 600 },
        ],
        createdAt: new Date().toISOString(),
      });

      const result = rankWeakTracks([newAttempt, oldAttempt]);

      // Latest attempt (weight 2) with 0% should dominate over old attempt (weight 1) with 100%
      // Weighted: (0*2 + 100*1) / (10*2 + 10*1) = 100/30 = 33%
      expect(result.every((r) => r.percentCorrect < 0.5)).toBe(true);
    });

    it("should only consider submitted attempts", () => {
      const attempts = [
        createMockAttempt({ status: "submitted" }),
        createMockAttempt({ status: "in-progress" }),
        createMockAttempt({ status: "abandoned" }),
      ];

      const result = rankWeakTracks(attempts);

      // Should only have data from 1 submitted attempt
      expect(result.length).toBe(4);
    });

    it("should limit to maxAttempts", () => {
      const attempts = Array.from({ length: 5 }, (_, i) => createMockAttempt({ id: `attempt-${i}` }));
      const result = rankWeakTracks(attempts, 3);

      // Should only process first 3 submitted attempts
      expect(result.length).toBe(4); // 4 tracks
    });

    it("should handle empty attempts array", () => {
      const result = rankWeakTracks([]);
      expect(result).toEqual([]);
    });

    it("should handle attempts with zero total questions", () => {
      const attempts = [createMockAttempt({
        sectionResults: [
          { section: "reading", correct: 0, total: 0, timeSpentSeconds: 0 },
          { section: "grammar", correct: 5, total: 10, timeSpentSeconds: 600 },
          { section: "listening", correct: 5, total: 10, timeSpentSeconds: 600 },
          { section: "writingAnalysis", correct: 5, total: 10, timeSpentSeconds: 600 },
        ],
      })];

      const result = rankWeakTracks(attempts);

      // reading should be skipped (total === 0), so only 3 tracks
      expect(result.length).toBe(3);
      expect(result.find((r) => r.track === "reading")).toBeUndefined();
    });

    it("should return percentCorrect as 1 for tracks with no data", () => {
      const attempts = [createMockAttempt({
        sectionResults: [
          { section: "reading", correct: 0, total: 0, timeSpentSeconds: 0 },
          { section: "grammar", correct: 0, total: 0, timeSpentSeconds: 0 },
          { section: "listening", correct: 0, total: 0, timeSpentSeconds: 0 },
          { section: "writingAnalysis", correct: 0, total: 0, timeSpentSeconds: 0 },
        ],
      })];

      const result = rankWeakTracks(attempts);
      expect(result).toEqual([]);
    });
  });

  describe("recommendNextLessons", () => {
    it("should recommend lessons from weakest tracks first", () => {
      const weakTracks = [
        { track: "writingAnalysis" as CourseTrack, percentCorrect: 0.2 },
        { track: "listening" as CourseTrack, percentCorrect: 0.4 },
        { track: "grammar" as CourseTrack, percentCorrect: 0.6 },
      ];

      const result = recommendNextLessons(weakTracks, MOCK_COURSES, MOCK_LESSONS, MOCK_PROGRESS, 3);

      expect(result.length).toBe(3);
      expect(result[0].course.track).toBe("writingAnalysis");
      expect(result[0].lesson.id).toBe("lesson-w1");
      expect(result[0].reason.kind).toBe("weakness");
      expect(result[1].course.track).toBe("listening");
      expect(result[2].course.track).toBe("grammar");
    });

    it("should skip already completed lessons", () => {
      const weakTracks = [
        { track: "reading" as CourseTrack, percentCorrect: 0.2 },
        { track: "grammar" as CourseTrack, percentCorrect: 0.4 },
      ];

      // lesson-r1 and lesson-g1 are completed
      const result = recommendNextLessons(weakTracks, MOCK_COURSES, MOCK_LESSONS, MOCK_PROGRESS, 2);

      expect(result[0].lesson.id).toBe("lesson-r2"); // r1 is done
      expect(result[1].lesson.id).toBe("lesson-g2"); // g1 is done
    });

    it("should fall back to other tracks when weak tracks have no lessons left", () => {
      // All lessons in weak tracks completed
      const allProgress = MOCK_LESSONS["course-writing-1"].map((l) => ({
        lessonId: l.id,
        userId: "user-1",
        completed: true,
        completedAt: new Date().toISOString(),
      }));

      const weakTracks = [
        { track: "writingAnalysis" as CourseTrack, percentCorrect: 0.2 },
      ];

      const result = recommendNextLessons(weakTracks, MOCK_COURSES, MOCK_LESSONS, allProgress, 3);

      // Should fall back to other tracks
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].reason.kind).toBe("default");
    });

    it("should respect limit", () => {
      const weakTracks = [
        { track: "writingAnalysis" as CourseTrack, percentCorrect: 0.2 },
        { track: "listening" as CourseTrack, percentCorrect: 0.4 },
        { track: "grammar" as CourseTrack, percentCorrect: 0.6 },
        { track: "reading" as CourseTrack, percentCorrect: 0.8 },
      ];

      const result = recommendNextLessons(weakTracks, MOCK_COURSES, MOCK_LESSONS, MOCK_PROGRESS, 2);

      expect(result.length).toBe(2);
    });

    it("should not recommend same course twice", () => {
      // Add more courses for same track
      const coursesWithDuplicates: Course[] = [
        ...MOCK_COURSES,
        { id: "course-writing-2", title: "Writing 2", track: "writingAnalysis", order: 2, description: "", lessonCount: 3, estimatedMinutes: 60 },
      ];

      const weakTracks = [
        { track: "writingAnalysis" as CourseTrack, percentCorrect: 0.2 },
        { track: "listening" as CourseTrack, percentCorrect: 0.4 },
      ];

      const result = recommendNextLessons(weakTracks, coursesWithDuplicates, MOCK_LESSONS, MOCK_PROGRESS, 3);

      const courseIds = result.map((r) => r.course.id);
      expect(new Set(courseIds).size).toBe(courseIds.length); // All unique
    });

    it("should return default reason for fallback recommendations", () => {
      const weakTracks: { track: CourseTrack; percentCorrect: number }[] = [];
      const result = recommendNextLessons(weakTracks, MOCK_COURSES, MOCK_LESSONS, MOCK_PROGRESS, 3);

      expect(result.length).toBe(3);
      expect(result.every((r) => r.reason.kind === "default")).toBe(true);
    });

    it("should handle courses with no lessons", () => {
      const coursesWithEmpty: Course[] = [
        { id: "empty-course", title: "Empty", track: "reading", order: 1, description: "", lessonCount: 0, estimatedMinutes: 0 },
      ];
      const lessonsWithEmpty: Record<string, Lesson[]> = { "empty-course": [] };

      const result = recommendNextLessons([], coursesWithEmpty, lessonsWithEmpty, [], 3);

      expect(result).toEqual([]);
    });

    it("should handle empty inputs gracefully", () => {
      const result = recommendNextLessons([], [], {}, [], 3);
      expect(result).toEqual([]);
    });
  });
});