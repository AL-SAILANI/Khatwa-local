import { SAMPLE_LESSONS } from "@/data/sample-courses";
import { SAMPLE_QUESTIONS } from "@/data/sample-questions";
import { SAMPLE_READING_QUESTIONS_EXTRA } from "@/data/reading-extra";
import { SAMPLE_LISTENING_QUESTIONS_EXTRA } from "@/data/listening-extra";
import type { Lesson } from "@/types/course";
import type { Question } from "@/types/question";

/**
 * Bridges the exam's post-review to the course library: given a question
 * (or its tags) it resolves the most relevant lesson(s) to study next.
 *
 * The seed content links lessons to questions through `lesson.questionIds`,
 * so the index is *derived* from that same data rather than maintained by
 * hand — a lesson is relevant to a tag when one of its own questions carries
 * that tag. Firestore mirrors this seeded content, so the mapping stays
 * correct in production. When an admin authors brand-new questions/lessons
 * the mapping simply doesn't resolve and the UI degrades gracefully.
 */

const ALL_QUESTIONS: Question[] = [
  ...SAMPLE_QUESTIONS,
  ...SAMPLE_READING_QUESTIONS_EXTRA,
  ...SAMPLE_LISTENING_QUESTIONS_EXTRA,
];

const LESSON_BY_ID = new Map<string, Lesson>(SAMPLE_LESSONS.map((lesson) => [lesson.id, lesson]));

const QUESTION_BY_ID = new Map<string, Question>(ALL_QUESTIONS.map((question) => [question.id, question]));

/** Tag spelling variants that refer to the same grammar concept. */
const TAG_ALIASES: Record<string, string> = {
  "dangling-modifiers": "dangling-modifier",
  parallelism: "parallel-structure",
};

function canonicalTag(tag: string): string {
  return TAG_ALIASES[tag] ?? tag;
}

const SECTION_TO_TRACK: Record<string, string> = {
  reading: "reading",
  grammar: "grammar",
  listening: "listening",
  writingAnalysis: "writingAnalysis",
};

/** Lessons whose `questionIds` include the given question id. */
function lessonsOwningQuestion(questionId: string): Lesson[] {
  const owners: Lesson[] = [];
  for (const lesson of SAMPLE_LESSONS) {
    if (lesson.questionIds.includes(questionId)) owners.push(lesson);
  }
  return owners;
}

/**
 * Picks the single most relevant lesson for a tag: the lesson with the most
 * questions carrying that tag, preferring the same track as `preferredTrack`
 * and lower `order` as tie-breakers.
 */
function bestLessonForTag(tag: string, preferredTrack?: string): Lesson | null {
  const normalized = canonicalTag(tag);
  let best: Lesson | null = null;
  let bestScore = -1;

  for (const lesson of SAMPLE_LESSONS) {
    let count = 0;
    for (const questionId of lesson.questionIds) {
      const question = QUESTION_BY_ID.get(questionId);
      if (question?.tags.some((t) => canonicalTag(t) === normalized)) count++;
    }
    if (count === 0) continue;

    let score = count;
    if (lesson.courseId === `course-${preferredTrack}`) score += 10;
    score -= lesson.order;

    if (score > bestScore) {
      bestScore = score;
      best = lesson;
    }
  }

  return best;
}

/**
 * Resolves 1–2 lessons to study for a question, prioritizing the lesson(s)
 * that own the question directly, then the best lesson for each of its tags.
 */
export function suggestLessonsForQuestion(question: Question, limit = 2): Lesson[] {
  const track = SECTION_TO_TRACK[question.section];
  const candidates: Lesson[] = [];

  const directOwners = lessonsOwningQuestion(question.id);
  candidates.push(...directOwners);

  if (candidates.length < limit) {
    for (const tag of question.tags) {
      const lesson = bestLessonForTag(tag, track);
      if (lesson && !candidates.some((candidate) => candidate.id === lesson.id)) {
        candidates.push(lesson);
      }
      if (candidates.length >= limit) break;
    }
  }

  return candidates.slice(0, limit);
}

/** Resolves a lesson by id, or null if it isn't part of the seeded library. */
export function getLessonTarget(lessonId: string): Lesson | null {
  return LESSON_BY_ID.get(lessonId) ?? null;
}

/** Resolves the single most relevant lesson for a tag (weak-concept chips). */
export function suggestLessonForTag(tag: string, preferredTrack?: string): Lesson | null {
  return bestLessonForTag(tag, preferredTrack);
}
