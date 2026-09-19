"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useStudyPath } from "@/hooks/use-study-path";
import { useLocalizedContent } from "@/hooks/use-localized-content";

/**
 * Shown after a student finishes a lesson: jumps to the next lesson in the
 * active study path. Renders nothing when there is no plan, the lesson is
 * not part of the path, or the lesson was the last one.
 */
export function PlanNextLesson({ uid, lessonId }: { uid: string; lessonId: string }) {
  const t = useTranslations("studyPlan");
  const { plan, lessonById, orderedLessonIds, loading } = useStudyPath(uid);
  const { lessonTitle } = useLocalizedContent();

  if (loading || !plan || orderedLessonIds.length === 0) return null;

  const index = orderedLessonIds.indexOf(lessonId);
  if (index === -1 || index + 1 >= orderedLessonIds.length) return null;

  const nextId = orderedLessonIds[index + 1];
  if (!nextId) return null;
  const nextLesson = lessonById.get(nextId);
  if (!nextLesson) return null;

  return (
    <Link
      href={`/courses/${nextLesson.courseId}/${nextLesson.id}`}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-primary-500/40 bg-primary-50 p-4 transition-colors hover:border-primary-500 dark:bg-primary-500/10"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-ink-violet">
          <Play className="size-3.5 fill-current" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-ink-violet/80 dark:text-primary-300">{t("nextLesson")}</p>
          <p className="truncate text-sm font-semibold">{lessonTitle(nextLesson)}</p>
        </div>
      </div>
      <ChevronLeft className="size-4 shrink-0 text-ink-violet transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1 dark:text-primary-400" />
    </Link>
  );
}
