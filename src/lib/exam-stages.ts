import { STEP_TOTAL_MINUTES } from "@/lib/constants/exam";
import type { ExamSectionKey, Question } from "@/types/question";

/**
 * An exam is taken in timed stages. Grammar and writing analysis are one
 * stage (the official exam has a single 40-question, 30-minute block for
 * them); reading and listening are stages of their own. Once a stage is
 * finished the learner cannot return to it.
 */
export type StageKey = "reading" | "structure" | "listening";

export interface ExamStage {
  key: StageKey;
  sections: ExamSectionKey[];
  /** Index of the stage's first question in the full question list. */
  start: number;
  count: number;
  minutes: number;
}

const OFFICIAL_STAGE_MINUTES: Record<StageKey, number> = {
  reading: 60,
  structure: 30,
  listening: 25,
};

export function stageKeyOf(section: ExamSectionKey): StageKey {
  if (section === "reading") return "reading";
  if (section === "listening") return "listening";
  return "structure";
}

/**
 * Splits the questions (already in exam order) into stages. With the official
 * exam length each stage gets its official minutes; for a shorter exam (the
 * placement test) the total is shared in proportion to the number of questions.
 */
export function buildStages(
  questions: Question[],
  durationMinutes: number,
): ExamStage[] {
  const stages: ExamStage[] = [];
  questions.forEach((question, index) => {
    const key = stageKeyOf(question.section);
    const last = stages[stages.length - 1];
    if (last && last.key === key) {
      last.count += 1;
      if (!last.sections.includes(question.section))
        last.sections.push(question.section);
    } else {
      stages.push({
        key,
        sections: [question.section],
        start: index,
        count: 1,
        minutes: 0,
      });
    }
  });

  const official = durationMinutes === STEP_TOTAL_MINUTES;
  for (const stage of stages) {
    stage.minutes = official
      ? OFFICIAL_STAGE_MINUTES[stage.key]
      : Math.max(
          1,
          Math.round(
            (durationMinutes * stage.count) / Math.max(1, questions.length),
          ),
        );
  }
  return stages;
}

export type QuestionState = "answered" | "flagged" | "unanswered";

/** Counts for the questions of one stage, used by the stage summary. */
export function summarizeStage(
  stage: ExamStage,
  questions: Question[],
  answers: Record<string, string>,
  flagged: Set<string>,
) {
  const slice = questions.slice(stage.start, stage.start + stage.count);
  const answered = slice.filter((q) => Boolean(answers[q.id])).length;
  return {
    total: slice.length,
    answered,
    unanswered: slice.length - answered,
    flagged: slice.filter((q) => flagged.has(q.id)).length,
  };
}
