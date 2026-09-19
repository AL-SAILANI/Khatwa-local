import type { ExamAttempt } from "@/types/exam";
import type { ExamSectionKey } from "@/types/question";
import type { Course, CourseTrack, Lesson, LessonProgress } from "@/types/course";

const SECTION_TO_TRACK: Record<ExamSectionKey, CourseTrack> = {
  reading: "reading",
  grammar: "grammar",
  listening: "listening",
  writingAnalysis: "writingAnalysis",
};

export interface TrackWeakness {
  track: CourseTrack;
  percentCorrect: number;
}

/**
 * Deterministic, rule-based recommender — no external LLM call, entirely
 * derived from the student's own exam history and lesson progress. Averages
 * each STEP section's percent-correct across the user's most recent
 * attempts (the latest attempt counts double, so a recent improvement or
 * regression outweighs older data), maps each section onto its matching
 * course track, and returns weakest-first.
 */
export function rankWeakTracks(attempts: ExamAttempt[], maxAttempts = 3): TrackWeakness[] {
  const recent = attempts.filter((a) => a.status === "submitted").slice(0, maxAttempts);
  const totals = new Map<CourseTrack, { weightedCorrect: number; weightedTotal: number }>();

  recent.forEach((attempt, index) => {
    const weight = index === 0 ? 2 : 1;
    for (const result of attempt.sectionResults) {
      if (result.total === 0) continue;
      const track = SECTION_TO_TRACK[result.section];
      const entry = totals.get(track) ?? { weightedCorrect: 0, weightedTotal: 0 };
      entry.weightedCorrect += result.correct * weight;
      entry.weightedTotal += result.total * weight;
      totals.set(track, entry);
    }
  });

  return [...totals.entries()]
    .map(([track, { weightedCorrect, weightedTotal }]) => ({
      track,
      percentCorrect: weightedTotal === 0 ? 1 : weightedCorrect / weightedTotal,
    }))
    .sort((a, b) => a.percentCorrect - b.percentCorrect);
}

/** Structured, not pre-formatted — the calling component (which has access
 * to `useTranslations`) renders the actual localized sentence. */
export type RecommendationReason =
  | { kind: "weakness"; track: CourseTrack; percentCorrect: number }
  | { kind: "default" };

export interface LessonRecommendation {
  course: Course;
  lesson: Lesson;
  reason: RecommendationReason;
}

/**
 * Picks up to `limit` next-incomplete lessons, one per weakest track first.
 * Falls back to the lowest-order incomplete lesson in any remaining course
 * (e.g. a brand-new user with no exam history yet, or a track with nothing
 * left to study) so the coach always has something concrete to suggest.
 */
export function recommendNextLessons(
  weakTracks: TrackWeakness[],
  courses: Course[],
  lessonsByCourseId: Record<string, Lesson[]>,
  progress: LessonProgress[],
  limit = 3,
): LessonRecommendation[] {
  const completedLessonIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
  const recommendations: LessonRecommendation[] = [];
  const usedCourseIds = new Set<string>();

  const nextIncompleteLesson = (courseId: string) =>
    (lessonsByCourseId[courseId] ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .find((lesson) => !completedLessonIds.has(lesson.id));

  for (const weak of weakTracks) {
    if (recommendations.length >= limit) break;
    const courseForTrack = courses
      .filter((c) => c.track === weak.track && !usedCourseIds.has(c.id))
      .sort((a, b) => a.order - b.order)[0];
    if (!courseForTrack) continue;

    const lesson = nextIncompleteLesson(courseForTrack.id);
    if (!lesson) continue;

    usedCourseIds.add(courseForTrack.id);
    recommendations.push({
      course: courseForTrack,
      lesson,
      reason: { kind: "weakness", track: weak.track, percentCorrect: weak.percentCorrect },
    });
  }

  if (recommendations.length < limit) {
    for (const course of [...courses].sort((a, b) => a.order - b.order)) {
      if (recommendations.length >= limit) break;
      if (usedCourseIds.has(course.id)) continue;

      const lesson = nextIncompleteLesson(course.id);
      if (!lesson) continue;

      usedCourseIds.add(course.id);
      recommendations.push({ course, lesson, reason: { kind: "default" } });
    }
  }

  return recommendations;
}
