import type { Course, Lesson } from "@/types/course";
import type { Achievement } from "@/types/gamification";
import type { MockExam } from "@/types/exam";
import type { Question, ReadingPassage } from "@/types/question";
import type { VocabWord } from "@/types/vocabulary";

/** Domain object -> table row. Pure and shared by the admin CMS writes and the
 * Firestore content migration, so both produce identical rows. */
type Row = Record<string, unknown>;
const orNull = <T>(v: T | undefined | null): T | null => (v === undefined ? null : v);

export const courseToRow = (c: Course): Row => ({
  id: c.id,
  track: c.track,
  title: c.title,
  description: c.description ?? "",
  order: c.order ?? 0,
  lesson_count: c.lessonCount ?? 0,
  estimated_minutes: c.estimatedMinutes ?? 0,
  cover_image: orNull(c.coverImage),
});

export const lessonToRow = (l: Lesson): Row => ({
  id: l.id,
  course_id: l.courseId,
  title: l.title,
  order: l.order ?? 0,
  resources: l.resources ?? [],
  notes: l.notes ?? "",
  question_ids: l.questionIds ?? [],
});

export const questionToRow = (q: Question): Row => ({
  id: q.id,
  section: q.section,
  course_id: orNull(q.courseId),
  passage_id: orNull(q.passageId),
  audio_url: orNull(q.audioUrl),
  transcript: orNull(q.transcript),
  prompt: q.prompt,
  options: q.options,
  correct_option_id: q.correctOptionId,
  explanation: q.explanation ?? "",
  difficulty: q.difficulty,
  tags: q.tags ?? [],
});

export const passageToRow = (p: ReadingPassage): Row => ({
  id: p.id,
  title: p.title,
  body: p.body,
  question_ids: p.questionIds ?? [],
});

export const vocabWordToRow = (w: VocabWord): Row => ({
  id: w.id,
  word: w.word,
  meaning_ar: w.meaningAr,
  meaning_en: orNull(w.meaningEn),
  example: w.example ?? "",
  audio_url: orNull(w.audioUrl),
  level: orNull(w.level),
  tags: w.tags ?? [],
});

export const achievementToRow = (a: Achievement): Row => ({
  id: a.id,
  title: a.title,
  description: a.description ?? "",
  icon: a.icon ?? "",
  xp_reward: a.xpReward ?? 0,
  category: orNull(a.category),
});

export const mockExamToRow = (e: MockExam): Row => ({
  id: e.id,
  title: e.title,
  total_questions: e.totalQuestions,
  duration_minutes: e.durationMinutes,
  section_question_ids: e.sectionQuestionIds,
});
