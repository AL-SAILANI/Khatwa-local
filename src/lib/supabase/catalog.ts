import { getSupabase } from "@/lib/supabase/client";
import type { Course, Lesson } from "@/types/course";
import type { Achievement } from "@/types/gamification";
import type { ExamSectionKey, Question, ReadingPassage } from "@/types/question";
import type { VocabWord } from "@/types/vocabulary";

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const opt = <T>(v: T | null | undefined): T | undefined => (v == null ? undefined : v);

export const toCourse = (r: Row): Course => ({
  id: r.id,
  track: r.track,
  title: r.title,
  description: r.description,
  order: r.order,
  lessonCount: r.lesson_count,
  estimatedMinutes: r.estimated_minutes,
  coverImage: opt(r.cover_image),
});

export const toLesson = (r: Row): Lesson => ({
  id: r.id,
  courseId: r.course_id,
  title: r.title,
  order: r.order,
  resources: r.resources ?? [],
  notes: r.notes,
  questionIds: r.question_ids ?? [],
});

export const toQuestion = (r: Row): Question => ({
  id: r.id,
  section: r.section,
  courseId: opt(r.course_id),
  passageId: opt(r.passage_id),
  audioUrl: opt(r.audio_url),
  transcript: opt(r.transcript),
  prompt: r.prompt,
  options: r.options,
  correctOptionId: r.correct_option_id,
  explanation: r.explanation,
  difficulty: r.difficulty,
  tags: r.tags ?? [],
});

export const toPassage = (r: Row): ReadingPassage => ({
  id: r.id,
  title: r.title,
  body: r.body,
  questionIds: r.question_ids ?? [],
});

export const toVocabWord = (r: Row): VocabWord => ({
  id: r.id,
  word: r.word,
  meaningAr: r.meaning_ar,
  meaningEn: opt(r.meaning_en),
  example: r.example,
  audioUrl: opt(r.audio_url),
  level: opt(r.level),
  tags: r.tags ?? [],
});

export const toAchievement = (r: Row): Achievement => ({
  id: r.id,
  title: r.title,
  description: r.description,
  icon: r.icon,
  xpReward: r.xp_reward,
  category: opt(r.category),
});

async function rows(query: PromiseLike<{ data: Row[] | null; error: { message: string } | null }>) {
  const { data, error } = await query;
  if (error) throw new Error(`Supabase: ${error.message}`);
  return data ?? [];
}

const db = () => getSupabase();

export async function sbGetCourses() {
  return (await rows(db().from("courses").select("*").order("order"))).map(toCourse);
}

export async function sbGetCourse(id: string) {
  const [row] = await rows(db().from("courses").select("*").eq("id", id).limit(1));
  return row ? toCourse(row) : null;
}

export async function sbGetLessonsForCourse(courseId: string) {
  return (await rows(db().from("lessons").select("*").eq("course_id", courseId).order("order"))).map(toLesson);
}

export async function sbGetAllLessons() {
  return (await rows(db().from("lessons").select("*").order("order"))).map(toLesson);
}

export async function sbGetLesson(id: string) {
  const [row] = await rows(db().from("lessons").select("*").eq("id", id).limit(1));
  return row ? toLesson(row) : null;
}

export async function sbGetQuestionsBySection(section: ExamSectionKey, bankTag?: string) {
  let q = db().from("questions").select("*").eq("section", section);
  if (bankTag) q = q.contains("tags", [bankTag]);
  return (await rows(q)).map(toQuestion);
}

export async function sbGetQuestionsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return (await rows(db().from("questions").select("*").in("id", ids))).map(toQuestion);
}

export async function sbGetAllQuestions() {
  return (await rows(db().from("questions").select("*"))).map(toQuestion);
}

export async function sbGetReadingPassages(ids: string[]) {
  if (ids.length === 0) return [];
  return (await rows(db().from("reading_passages").select("*").in("id", ids))).map(toPassage);
}

export async function sbGetAllVocabWords() {
  return (await rows(db().from("vocab_words").select("*").order("word"))).map(toVocabWord);
}

export async function sbGetAllAchievements() {
  return (await rows(db().from("achievements").select("*"))).map(toAchievement);
}
