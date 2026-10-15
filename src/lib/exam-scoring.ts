import { STEP_SECTION_WEIGHTS } from "@/lib/constants/exam";
import { reportableTags } from "@/data/question-types";
import { bandFromScore } from "@/lib/placement";
import type { ExamSectionKey, Question } from "@/types/question";
import type { SectionResult } from "@/types/exam";

interface ScoredResult {
  score: number;
  sectionResults: SectionResult[];
  weakSkills: string[];
}

/**
 * STEP's official scaled-scoring formula isn't public, so this approximates
 * it as a weighted percentage — each section's percent-correct times its
 * share of the exam (reading 40%, grammar 30%, listening 20%, writing
 * analysis 10%, see `STEP_SECTION_WEIGHTS`) — which lands on the same 0–100
 * scale as the goal picker (60/70/80/90/95). Good enough for practice
 * feedback; not a guarantee of the real exam's scoring curve.
 */
export function scoreAttempt(
  questions: Question[],
  answers: Record<string, string>,
  timeBySection: Partial<Record<ExamSectionKey, number>>,
): ScoredResult {
  const sections = Object.keys(STEP_SECTION_WEIGHTS) as ExamSectionKey[];
  const wrongTagCounts = new Map<string, number>();

  const sectionResults: SectionResult[] = sections.map((section) => {
    const sectionQuestions = questions.filter((q) => q.section === section);
    const correct = sectionQuestions.filter((q) => answers[q.id] === q.correctOptionId).length;

    for (const question of sectionQuestions) {
      if (answers[question.id] !== question.correctOptionId) {
        for (const tag of reportableTags(question)) {
          wrongTagCounts.set(tag, (wrongTagCounts.get(tag) ?? 0) + 1);
        }
      }
    }

    return {
      section,
      correct,
      total: sectionQuestions.length,
      timeSpentSeconds: Math.round(timeBySection[section] ?? 0),
    };
  });

  const score = Math.round(
    sectionResults.reduce((total, result) => {
      if (result.total === 0) return total;
      const percentCorrect = result.correct / result.total;
      return total + percentCorrect * STEP_SECTION_WEIGHTS[result.section] * 100;
    }, 0),
  );

  const weakSkills = [...wrongTagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  return { score, sectionResults, weakSkills };
}

/** Profile level, derived from the STEP score bands (see `bandFromScore`):
 * foundation and beginner both read as "beginner". */
export function levelFromScore(score: number): "beginner" | "intermediate" | "advanced" {
  const band = bandFromScore(score);
  if (band === "advanced") return "advanced";
  if (band === "intermediate") return "intermediate";
  return "beginner";
}
