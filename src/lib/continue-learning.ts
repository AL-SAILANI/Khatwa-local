import type { Course, Lesson, LessonProgress } from "@/types/course";

export interface ContinueLearningTarget {
  course: Course;
  lesson: Lesson;
}

/**
 * Resolves the "continue where you left off" target: the next incomplete
 * lesson in whichever course the student most recently touched, falling
 * back to the next course (catalog order) with anything left to study if
 * the last-touched course is now fully complete.
 */
export function findContinueLearningTarget(
  courses: Course[],
  lessonsByCourseId: Record<string, Lesson[]>,
  progress: LessonProgress[],
): ContinueLearningTarget | null {
  if (progress.length === 0) return null;

  const completedLessonIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));

  const nextIncompleteLesson = (courseId: string) =>
    (lessonsByCourseId[courseId] ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .find((lesson) => !completedLessonIds.has(lesson.id));

  const sortedProgress = [...progress].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  const mostRecent = sortedProgress[0];
  if (!mostRecent) return null;

  const lastCourse = courses.find((c) => c.id === mostRecent.courseId);
  if (lastCourse) {
    const lesson = nextIncompleteLesson(lastCourse.id);
    if (lesson) return { course: lastCourse, lesson };
  }

  for (const course of [...courses].sort((a, b) => a.order - b.order)) {
    const lesson = nextIncompleteLesson(course.id);
    if (lesson) return { course, lesson };
  }

  return null;
}
