import type { Lesson } from "@/types/course";
import type { PlanDay } from "@/types/gamification";
import { PLAN_DURATIONS } from "@/lib/constants/exam";

/**
 * The order in which the five content tracks are interleaved at each
 * difficulty level, so that consecutive lessons in the path always come
 * from different skills (e.g. day 1 = a reading lesson + a listening
 * lesson). Reading and listening lead because they are the two sections a
 * STEP beginner is tested on most heavily.
 */
const CONTENT_TRACK_ORDER = ["reading", "listening", "grammar", "writingAnalysis", "vocabulary"] as const;

const CONTENT_TRACKS = new Set<string>(CONTENT_TRACK_ORDER);

/**
 * Soft cap on how many lessons a single day can hold. The daily path never
 * exceeds this, so a 7-day plan covers a lighter slice of the library while
 * a 30-day plan walks through all of it.
 */
const MAX_LESSONS_PER_DAY = 2;

export function recommendDuration(goal: number, currentScore: number | null): (typeof PLAN_DURATIONS)[number] {
  const gap = goal - (currentScore ?? goal - 20);
  if (gap <= 10) return 7;
  if (gap <= 25) return 15;
  return 30;
}

/**
 * Builds a day-by-day study path from the lesson library.
 *
 * The path is a single ordered sequence — skills interleaved per difficulty
 * level (progressive difficulty), with tips/strategies and weekly revision
 * lessons woven in at spread positions — which is then sliced to fit the
 * plan duration (capped at two lessons/day) and chunked evenly across the
 * days. Each `PlanDay.lessonIds` therefore mixes different skills while the
 * overall sequence stays strictly ordered: completing one lesson unlocks the
 * next.
 *
 * The function is deterministic and pure, so an old plan with empty
 * `lessonIds` (created before this feature) can be back-filled on the fly
 * from `durationDays` alone.
 */
export function buildStudyPath(durationDays: number, lessons: Lesson[]): PlanDay[] {
  const byCourse = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const bucket = byCourse.get(lesson.courseId) ?? [];
    bucket.push(lesson);
    byCourse.set(lesson.courseId, bucket);
  }
  const orderedForTrack = (track: string) =>
    (byCourse.get(`course-${track}`) ?? []).slice().sort((a, b) => a.order - b.order);

  // 1. Leveled interleave of the content tracks.
  const content: Lesson[] = [];
  for (let level = 0; ; level++) {
    let added = 0;
    for (const track of CONTENT_TRACK_ORDER) {
      const lesson = orderedForTrack(track)[level];
      if (lesson) {
        content.push(lesson);
        added++;
      }
    }
    if (added === 0) break;
  }

  // 2. Weave auxiliary + revision lessons into the path at spread positions.
  const positioned: { pos: number; lesson: Lesson }[] = content.map((lesson, index) => ({
    pos: index,
    lesson,
  }));
  const weave = (track: string, fractions: number[]) => {
    orderedForTrack(track).forEach((lesson, index) => {
      positioned.push({ pos: content.length * (fractions[index] ?? 0.9), lesson });
    });
  };
  // tips/strategies: one every ~4-5 days across the plan.
  weave("tips", [0.18, 0.5, 0.8]);
  weave("strategies", [0.32, 0.65, 0.9]);
  // revision: roughly one per week.
  weave("revision", [0.27, 0.62, 0.97]);

  positioned.sort((a, b) => a.pos - b.pos);

  // 3. Slice to fit the duration (<= 2 lessons/day) and chunk evenly.
  const path = positioned
    .slice(0, Math.min(positioned.length, durationDays * MAX_LESSONS_PER_DAY))
    .map(({ lesson }) => lesson);

  const buckets: Lesson[][] = Array.from({ length: durationDays }, () => []);
  path.forEach((lesson, index) => {
    const day = Math.min(durationDays - 1, Math.floor((index * durationDays) / path.length));
    buckets[day]!.push(lesson);
  });

  return buckets.map((dayLessons, dayIndex) => ({
    dayIndex,
    courseId: dayLessons[0]?.courseId ?? "",
    lessonIds: dayLessons.map((lesson) => lesson.id),
    completed: false,
  }));
}

/** Difficulty label shown per lesson in the path, derived from its position
 * within its own track so the progression is visible without a content
 * author having to annotate every lesson. Only meaningful for content
 * tracks; auxiliary/revision lessons return null. */
export function difficultyOf(lesson: Lesson): "easy" | "medium" | "hard" | null {
  if (!CONTENT_TRACKS.has(lesson.courseId.replace("course-", ""))) return null;
  if (lesson.order <= 2) return "easy";
  if (lesson.order <= 5) return "medium";
  return "hard";
}
