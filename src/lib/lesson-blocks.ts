import type { Lesson, LessonResource } from "@/types/course";
import type { Question } from "@/types/question";

/** A lesson is mastered when the exit card scores at least this percentage. */
export const MASTERY_THRESHOLD = 80;

export type LessonBlock =
  | { kind: "explain"; notes: string }
  | { kind: "video"; resources: LessonResource[] }
  | { kind: "example"; question: Question }
  | { kind: "guided"; questions: Question[] }
  | { kind: "strategy"; notes: string }
  | { kind: "exit"; questions: Question[] }
  | { kind: "review"; notes: string }
  | { kind: "summary" };

const MARKER_GROUP: Record<string, "explain" | "strategy" | "review"> = {
  "📌": "explain",
  "⚡": "explain",
  "⚠️": "explain",
  "🧭": "strategy",
  "🔄": "review",
};

/** Splits the emoji-marked notes string into explain / strategy / review text. */
export function splitNotes(
  notes: string,
): Record<"explain" | "strategy" | "review", string> {
  const groups = {
    explain: [] as string[],
    strategy: [] as string[],
    review: [] as string[],
  };
  let current: keyof typeof groups = "explain";
  for (const raw of notes.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const marker = Object.keys(MARKER_GROUP).find((m) => line.startsWith(m));
    if (marker) current = MARKER_GROUP[marker]!;
    groups[current].push(line);
  }
  return {
    explain: groups.explain.join("\n"),
    strategy: groups.strategy.join("\n"),
    review: groups.review.join("\n"),
  };
}

/** Splits explain text into one short card per marked section (rule, quick form, trap). */
export function explainCards(text: string): string[] {
  const cards: string[][] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const isMarker = Object.keys(MARKER_GROUP).some((m) => line.startsWith(m));
    if (isMarker || cards.length === 0) cards.push([]);
    cards[cards.length - 1]!.push(line);
  }
  return cards.map((card) => card.join("\n"));
}

/**
 * Turns a lesson plus its questions into the ordered teaching blocks:
 * explain, video, worked example, guided practice, strategy, exit card, review.
 * The exit card is the assessed part; with 3+ questions the first one is shown
 * as a worked example instead of being assessed.
 */
export function buildLessonBlocks(
  lesson: Lesson,
  questions: Question[],
): LessonBlock[] {
  const notes = splitNotes(lesson.notes);
  const blocks: LessonBlock[] = [];

  for (const card of explainCards(notes.explain))
    blocks.push({ kind: "explain", notes: card });
  if (lesson.resources.length > 0)
    blocks.push({ kind: "video", resources: lesson.resources });
  if (notes.strategy) blocks.push({ kind: "strategy", notes: notes.strategy });

  const pool = [...questions];
  if (pool.length >= 3)
    blocks.push({ kind: "example", question: pool.shift()! });

  const exitSize =
    pool.length <= 2 ? pool.length : Math.min(3, Math.ceil(pool.length / 2));
  const exit = pool.splice(pool.length - exitSize, exitSize);
  if (pool.length > 0) blocks.push({ kind: "guided", questions: pool });
  if (exit.length > 0) blocks.push({ kind: "exit", questions: exit });

  if (notes.review) blocks.push({ kind: "review", notes: notes.review });
  if (exit.length > 0) blocks.push({ kind: "summary" });
  return blocks;
}

export function scorePercent(
  questions: Question[],
  answers: Record<string, string>,
): number {
  if (questions.length === 0) return 0;
  const correct = questions.filter(
    (q) => answers[q.id] === q.correctOptionId,
  ).length;
  return Math.round((correct / questions.length) * 100);
}
