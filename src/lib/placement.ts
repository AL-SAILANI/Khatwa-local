import { STEP_SECTION_WEIGHTS } from "@/lib/constants/exam";
import type { SectionResult } from "@/types/exam";
import type { ExamSectionKey, Question } from "@/types/question";

/** Placement test blueprint: 30 questions that keep the official STEP weights
 * (reading 40%, grammar block 40% split 30/10, listening 20%). */
export const PLACEMENT_COUNTS: Record<ExamSectionKey, number> = {
  reading: 12,
  grammar: 9,
  writingAnalysis: 3,
  listening: 6,
};
export const PLACEMENT_TOTAL_QUESTIONS = Object.values(PLACEMENT_COUNTS).reduce((a, b) => a + b, 0);
/** About 1.5 min per reading question, 45 s per grammar question and 1.25 min
 * per listening question, rounded up. */
export const PLACEMENT_MINUTES = 35;

/** Share of easy / medium / hard questions in each section. Weighted toward
 * easy and medium so beginners are not discouraged, with enough hard items to
 * separate the upper bands. */
const DIFFICULTY_MIX: Record<Question["difficulty"], number> = { easy: 0.4, medium: 0.4, hard: 0.2 };
const DIFFICULTIES = ["easy", "medium", "hard"] as const;

type Rng = () => number;

function shuffled<T>(items: T[], rng: Rng): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = tmp;
  }
  return copy;
}

/** Splits `count` across difficulties by `DIFFICULTY_MIX` (largest remainder). */
function difficultyTargets(count: number): Record<Question["difficulty"], number> {
  const raw = DIFFICULTIES.map((d) => ({ d, exact: count * DIFFICULTY_MIX[d] }));
  const targets = Object.fromEntries(raw.map(({ d, exact }) => [d, Math.floor(exact)])) as Record<
    Question["difficulty"],
    number
  >;
  let left = count - DIFFICULTIES.reduce((sum, d) => sum + targets[d], 0);
  for (const { d } of raw.slice().sort((a, b) => (b.exact % 1) - (a.exact % 1))) {
    if (left <= 0) break;
    targets[d]++;
    left--;
  }
  return targets;
}

/** Picks `count` questions with the difficulty mix above, topping up from any
 * difficulty when a bucket runs short. Output is shuffled easy-to-hard-agnostic. */
export function pickBalanced(pool: Question[], count: number, rng: Rng = Math.random): Question[] {
  const targets = difficultyTargets(count);
  const buckets = Object.fromEntries(
    DIFFICULTIES.map((d) => [d, shuffled(pool.filter((q) => q.difficulty === d), rng)]),
  ) as Record<Question["difficulty"], Question[]>;

  const picked: Question[] = [];
  for (const d of DIFFICULTIES) picked.push(...buckets[d].splice(0, targets[d]));

  if (picked.length < count) {
    const rest = shuffled(DIFFICULTIES.flatMap((d) => buckets[d]), rng);
    picked.push(...rest.slice(0, count - picked.length));
  }
  return shuffled(picked, rng);
}

/** Reading questions come in passage groups, so picking them one by one would
 * make a student read a new passage for every question. Takes whole passages
 * until `count` is reached (trimming the last one), keeping each passage's
 * questions together and in their original order. */
export function pickReadingByPassage(pool: Question[], count: number, rng: Rng = Math.random): Question[] {
  const groups = new Map<string, Question[]>();
  const loose: Question[] = [];
  for (const q of pool) {
    if (!q.passageId) loose.push(q);
    else groups.set(q.passageId, [...(groups.get(q.passageId) ?? []), q]);
  }

  const picked: Question[] = [];
  for (const group of shuffled([...groups.values()], rng)) {
    const remaining = count - picked.length;
    if (remaining <= 0) break;
    if (group.length <= remaining) picked.push(...group);
    else if (remaining >= 2) picked.push(...pickBalanced(group, remaining, rng));
  }
  if (picked.length < count) picked.push(...shuffled(loose, rng).slice(0, count - picked.length));
  return picked;
}

export type StepBand = "foundation" | "beginner" | "intermediate" | "advanced";

/** Score bands from the STEP preparation guide: under 40 foundation, 40-60
 * beginner, 60-80 intermediate, 80-100 advanced. */
export function bandFromScore(score: number): StepBand {
  if (score >= 80) return "advanced";
  if (score >= 60) return "intermediate";
  if (score >= 40) return "beginner";
  return "foundation";
}

export interface PlacementFocus {
  section: ExamSectionKey;
  percentCorrect: number;
  /** Number of questions behind `percentCorrect`; small samples are noisy. */
  total: number;
  /** Estimated score points lost in this section (weight x missed share). */
  pointsLost: number;
}

/** Sections ordered by how many exam points the student is losing there, so
 * the plan spends time where it pays most. Sections with no questions are
 * skipped. */
export function focusSections(sectionResults: SectionResult[]): PlacementFocus[] {
  return sectionResults
    .filter((r) => r.total > 0)
    .map((r) => {
      const percentCorrect = r.correct / r.total;
      return {
        section: r.section,
        total: r.total,
        percentCorrect: Math.round(percentCorrect * 100),
        pointsLost: Math.round((1 - percentCorrect) * STEP_SECTION_WEIGHTS[r.section] * 1000) / 10,
      };
    })
    .sort((a, b) => b.pointsLost - a.pointsLost);
}
