import { SKILLS, skillsForTags, type SkillSection } from "@/data/skills";
import type { ExamAttempt } from "@/types/exam";
import type { Lesson, LessonProgress } from "@/types/course";
import type { Question } from "@/types/question";

export interface SkillMastery {
  /** 0 to 1, smoothed toward 0.5 when there is little evidence. */
  mastery: number;
  /** Number of weighted answers behind the estimate. */
  evidence: number;
}

export type MasteryMap = Map<string, SkillMastery>;

export const MASTERY_TARGET = 0.8;
const PRIOR = 0.5;
const PRIOR_WEIGHT = 2;
/** A completed lesson counts as this many answers at its exit-card score. */
const LESSON_EVIDENCE_WEIGHT = 3;

export function skillsOfQuestion(question: Question): string[] {
  return skillsForTags(question.section as SkillSection, question.tags);
}

interface Tally {
  correct: number;
  total: number;
}

/**
 * Estimates mastery per skill from what the learner has already done:
 * submitted exams (latest attempt counts double) and the exit-card scores of
 * completed lessons. No new storage is needed; skills with no evidence are
 * absent from the map.
 */
export function computeSkillMastery(input: {
  attempts: ExamAttempt[];
  progress: LessonProgress[];
  lessonById: Map<string, Lesson>;
  getQuestion: (id: string) => Question | null;
}): MasteryMap {
  const tallies = new Map<string, Tally>();
  const add = (skillId: string, correct: number, total: number) => {
    const tally = tallies.get(skillId) ?? { correct: 0, total: 0 };
    tally.correct += correct;
    tally.total += total;
    tallies.set(skillId, tally);
  };

  const submitted = input.attempts.filter((a) => a.status === "submitted");
  submitted.forEach((attempt, index) => {
    const weight = index === 0 ? 2 : 1;
    for (const [questionId, optionId] of Object.entries(attempt.answers)) {
      const question = input.getQuestion(questionId);
      if (!question) continue;
      const correct = optionId === question.correctOptionId ? weight : 0;
      for (const skillId of skillsOfQuestion(question))
        add(skillId, correct, weight);
    }
  });

  for (const progress of input.progress) {
    if (!progress.completed || progress.quizScore === null) continue;
    const lesson = input.lessonById.get(progress.lessonId);
    if (!lesson) continue;
    const skills = new Set<string>();
    for (const questionId of lesson.questionIds) {
      const question = input.getQuestion(questionId);
      if (question) skillsOfQuestion(question).forEach((id) => skills.add(id));
    }
    for (const skillId of skills)
      add(
        skillId,
        (progress.quizScore / 100) * LESSON_EVIDENCE_WEIGHT,
        LESSON_EVIDENCE_WEIGHT,
      );
  }

  const result: MasteryMap = new Map();
  for (const skill of SKILLS) {
    const tally = tallies.get(skill.id);
    if (!tally || tally.total === 0) continue;
    result.set(skill.id, {
      mastery:
        (tally.correct + PRIOR * PRIOR_WEIGHT) / (tally.total + PRIOR_WEIGHT),
      evidence: tally.total,
    });
  }
  return result;
}

/** The skills a lesson practises, most frequent first (resolved from its questions). */
export function skillsOfLesson(
  lesson: Lesson,
  getQuestion: (id: string) => Question | null,
): string[] {
  const counts = new Map<string, number>();
  for (const questionId of lesson.questionIds) {
    const question = getQuestion(questionId);
    if (!question) continue;
    for (const skillId of skillsOfQuestion(question))
      counts.set(skillId, (counts.get(skillId) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
}
