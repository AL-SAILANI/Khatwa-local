import { SKILL_BY_ID } from "@/data/skills";
import { MASTERY_TARGET, type MasteryMap } from "@/lib/skill-mastery";
import type { Lesson, LessonProgress } from "@/types/course";

export type LessonReason = "weak" | "new";

export interface DailySession {
  /** Vocabulary words due for review today. */
  dueWords: number;
  /** One new or weakest-skill lesson. */
  lesson: {
    lesson: Lesson;
    skillId: string | null;
    reason: LessonReason;
    mastery: number | null;
  } | null;
  /** A completed lesson whose exit card was below mastery, to retry. */
  retry: { lesson: Lesson; score: number } | null;
  minutes: number;
}

const UNKNOWN_MASTERY = 0.4;
const NOT_READY_FACTOR = 0.4;
const PREREQUISITE_READY = 0.5;

function sortLessons(lessons: Lesson[]): Lesson[] {
  return [...lessons].sort(
    (a, b) => a.order - b.order || a.id.localeCompare(b.id),
  );
}

/**
 * Picks today's study session: due reviews, one lesson, and one retry.
 *
 * The lesson is chosen by skill priority = exam frequency x gap to mastery,
 * damped when a prerequisite skill is not ready (a soft gate: the learner may
 * still open any lesson). Skills already above the mastery target are skipped.
 */
export function buildDailySession(input: {
  lessons: Lesson[];
  progress: LessonProgress[];
  mastery: MasteryMap;
  skillsOfLesson: (lesson: Lesson) => string[];
  dueWords: number;
}): DailySession {
  const completed = new Map(
    input.progress.filter((p) => p.completed).map((p) => [p.lessonId, p]),
  );
  const lessons = sortLessons(input.lessons);
  const open = lessons.filter((lesson) => !completed.has(lesson.id));
  const skillsByLesson = new Map(
    open.map((lesson) => [lesson.id, input.skillsOfLesson(lesson)]),
  );

  const masteryOf = (skillId: string) =>
    input.mastery.get(skillId)?.mastery ?? null;

  const priority = (skillId: string): number => {
    const skill = SKILL_BY_ID.get(skillId);
    if (!skill) return 0;
    const mastery = masteryOf(skillId);
    if (mastery !== null && mastery >= MASTERY_TARGET) return 0;
    const ready = skill.prerequisites.every(
      (id) => (masteryOf(id) ?? UNKNOWN_MASTERY) >= PREREQUISITE_READY,
    );
    return (
      (skill.frequency / 5) *
      (1 - (mastery ?? UNKNOWN_MASTERY)) *
      (ready ? 1 : NOT_READY_FACTOR)
    );
  };

  let best: DailySession["lesson"] = null;
  let bestScore = 0;
  for (const lesson of open) {
    const skills = skillsByLesson.get(lesson.id) ?? [];
    for (const skillId of skills.slice(0, 3)) {
      const score = priority(skillId);
      if (score > bestScore) {
        bestScore = score;
        const mastery = masteryOf(skillId);
        best = {
          lesson,
          skillId,
          mastery,
          reason: mastery === null ? "new" : "weak",
        };
      }
    }
  }
  if (!best && open[0])
    best = { lesson: open[0], skillId: null, mastery: null, reason: "new" };

  const retryCandidates = input.progress
    .filter(
      (p) =>
        p.completed &&
        p.quizScore !== null &&
        p.quizScore < MASTERY_TARGET * 100,
    )
    .sort((a, b) => (a.quizScore ?? 0) - (b.quizScore ?? 0));
  const retryLesson = retryCandidates
    .map((p) => ({
      lesson: lessons.find((l) => l.id === p.lessonId),
      score: p.quizScore ?? 0,
    }))
    .find((entry): entry is { lesson: Lesson; score: number } =>
      Boolean(entry.lesson),
    );

  const minutes =
    (input.dueWords > 0 ? 5 : 0) + (best ? 12 : 0) + (retryLesson ? 8 : 0);
  return {
    dueWords: input.dueWords,
    lesson: best,
    retry: retryLesson ?? null,
    minutes,
  };
}
