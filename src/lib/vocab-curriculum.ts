import type { Lesson } from "@/types/course";
import type { VocabLevel, VocabWord } from "@/types/vocabulary";

/**
 * Vocab Curriculum — the professional, interconnected vocabulary backbone.
 *
 * Every word in the STEP deck is organized into a single deterministic
 * sequence with three layers of methodology, mirroring how the study-plan
 * generator interleaves the lesson tracks:
 *
 * 1. **Progressive difficulty** — words are tiered easy → medium → hard (per
 *    `step-prep-curriculum`), so beginners start light and difficulty ramps
 *    steadily as the plan advances.
 * 2. **Section interleaving within each tier** — each tier mixes the four
 *    STEP sections (reading / listening / grammar / writing) like the real
 *    exam, so a single study day never feels like one repeated skill.
 * 3. **Lesson linkage** — every word is anchored to a "home lesson" in the
 *    course of its section by round-robin order, so the words you meet on a
 *    given plan day line up with the lesson you'd take that same day. The
 *    link is *derived* (like `tag-lesson-map`) and stays valid as lessons
 *    are further developed later.
 */

export type VocabSection = "reading" | "listening" | "grammar" | "writingAnalysis" | "academic";

export const TIER_ORDER: VocabLevel[] = ["easy", "medium", "hard"];

const SECTION_ORDER: VocabSection[] = ["reading", "listening", "grammar", "writingAnalysis", "academic"];

const SECTION_TO_COURSE: Record<VocabSection, string> = {
  reading: "course-reading",
  listening: "course-listening",
  grammar: "course-grammar",
  writingAnalysis: "course-writingAnalysis",
  academic: "course-vocabulary",
};

/** Section counts used to map round-robin lesson order. Falls back to these
 * when actual lesson data isn't available at build time; `resolveLinkedLesson`
 * re-checks against the real lesson library when given one. */
const DEFAULT_LESSON_COUNTS: Record<string, number> = {
  "course-reading": 8,
  "course-listening": 8,
  "course-grammar": 14,
  "course-writingAnalysis": 8,
  "course-vocabulary": 8,
};

export const MIN_WORDS_PER_DAY = 5;
export const MAX_WORDS_PER_DAY = 25;
export const DEFAULT_PLAN_DAYS = 30;

export interface VocabCurriculumEntry {
  word: VocabWord;
  tier: VocabLevel;
  section: VocabSection;
  linkedCourseId: string;
  /** 1-based lesson order inside `linkedCourseId` that this word anchors to. */
  linkedLessonOrder: number;
}

export interface VocabCurriculum {
  entries: VocabCurriculumEntry[];
  orderedWordIds: string[];
  totalWords: number;
}

const SECTION_TAGS = ["reading", "listening", "grammar", "writing"] as const;

function primarySection(tags: string[]): VocabSection {
  for (const tag of SECTION_TAGS) {
    if (tags.includes(tag)) return tag === "writing" ? "writingAnalysis" : tag;
  }
  return "academic";
}

function interleaveSections(buckets: Record<VocabSection, VocabWord[]>, tier: VocabLevel): VocabCurriculumEntry[] {
  const entries: VocabCurriculumEntry[] = [];
  const ordinalBySection = new Map<VocabSection, number>();
  for (const section of SECTION_ORDER) ordinalBySection.set(section, 0);

  const maxLen = Math.max(...SECTION_ORDER.map((s) => buckets[s].length));
  for (let i = 0; i < maxLen; i++) {
    for (const section of SECTION_ORDER) {
      const word = buckets[section][i];
      if (!word) continue;
      const ordinal = ordinalBySection.get(section) ?? 0;
      ordinalBySection.set(section, ordinal + 1);
      const linkedCourseId = SECTION_TO_COURSE[section];
      const lessonCount = DEFAULT_LESSON_COUNTS[linkedCourseId] ?? 8;
      entries.push({
        word,
        tier,
        section,
        linkedCourseId,
        linkedLessonOrder: (ordinal % lessonCount) + 1,
      });
    }
  }
  return entries;
}

/** Deterministic global word order — progressive difficulty, sections
 * interleaved inside each tier. */
export function buildVocabCurriculum(words: VocabWord[]): VocabCurriculum {
  const buckets: Record<VocabLevel, Record<VocabSection, VocabWord[]>> = {
    easy: { reading: [], listening: [], grammar: [], writingAnalysis: [], academic: [] },
    medium: { reading: [], listening: [], grammar: [], writingAnalysis: [], academic: [] },
    hard: { reading: [], listening: [], grammar: [], writingAnalysis: [], academic: [] },
  };

  for (const word of words) {
    const level = word.level ?? "medium";
    if (!(level in buckets)) continue;
    const section = primarySection(word.tags);
    buckets[level][section].push(word);
  }

  const entries = TIER_ORDER.flatMap((tier) => interleaveSections(buckets[tier], tier));

  return {
    entries,
    orderedWordIds: entries.map((e) => e.word.id),
    totalWords: entries.length,
  };
}

/** Daily quota of brand-new words, derived from the student's chosen plan
 * duration (number of words must fit the plan horizon with sane bounds). */
export function wordsPerDay(totalWords: number, durationDays: number): number {
  const target = Math.ceil(totalWords / Math.max(1, durationDays));
  return Math.max(MIN_WORDS_PER_DAY, Math.min(MAX_WORDS_PER_DAY, target));
}

/** The words scheduled for a given plan day (0-based index). */
export function dailyBatch(
  curriculum: VocabCurriculum,
  dayIndex: number,
  perDay: number,
): VocabCurriculumEntry[] {
  const start = dayIndex * perDay;
  return curriculum.entries.slice(start, start + perDay);
}

/** 0-based plan day index for a given timestamp, clamped to the plan. */
export function planDayIndex(startedAt: string, nowMs: number, durationDays: number): number {
  const start = new Date(startedAt).getTime();
  const elapsedDays = Math.max(0, Math.floor((nowMs - start) / 86_400_000));
  return Math.min(elapsedDays, Math.max(0, durationDays - 1));
}

/** Resolve an entry's anchored lesson against the real lesson library. */
export function resolveLinkedLesson(
  entry: VocabCurriculumEntry,
  lessons: Lesson[],
): Lesson | null {
  const exact = lessons.find(
    (lesson) => lesson.courseId === entry.linkedCourseId && lesson.order === entry.linkedLessonOrder,
  );
  if (exact) return exact;
  return (
    lessons.find((lesson) => lesson.courseId === entry.linkedCourseId) ?? null
  );
}

export function entryById(curriculum: VocabCurriculum, wordId: string): VocabCurriculumEntry | null {
  return curriculum.entries.find((e) => e.word.id === wordId) ?? null;
}