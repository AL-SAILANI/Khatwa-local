"use client";

import { useLocale, useMessages } from "next-intl";
import type { Course, Lesson } from "@/types/course";
import type { Achievement } from "@/types/gamification";
import type { VocabWord } from "@/types/vocabulary";

interface ContentMessage {
  title?: string;
  description?: string;
  notes?: string;
}

interface ContentMessages {
  content?: {
    courses?: Record<string, ContentMessage>;
    lessons?: Record<string, ContentMessage>;
    achievements?: Record<string, ContentMessage>;
  };
}

/**
 * Firestore stores course/lesson/achievement copy in Arabic only, so the
 * English locale would otherwise show Arabic content. Each content item has
 * a stable id, so translations live in `messages/{locale}.json` under
 * `content.<kind>.<id>.<field>` — with a fallback to the stored (Arabic)
 * value whenever a key is missing.
 */
export function useLocalizedContent() {
  const locale = useLocale();
  const messages = useMessages() as ContentMessages;
  const content = messages.content;

  return {
    courseTitle: (course: Course) => content?.courses?.[course.id]?.title ?? course.title,
    courseDescription: (course: Course) => content?.courses?.[course.id]?.description ?? course.description,
    lessonTitle: (lesson: Lesson) => content?.lessons?.[lesson.id]?.title ?? lesson.title,
    lessonNotes: (lesson: Lesson) => content?.lessons?.[lesson.id]?.notes ?? lesson.notes,
    achievementTitle: (achievement: Achievement) => content?.achievements?.[achievement.id]?.title ?? achievement.title,
    achievementDescription: (achievement: Achievement) =>
      content?.achievements?.[achievement.id]?.description ?? achievement.description,
    wordMeaning: (word: VocabWord) => (locale === "en" ? word.meaningEn ?? word.meaningAr : word.meaningAr),
  };
}
