"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModuleHeader } from "@/components/ui/module-header";
import { Link } from "@/i18n/navigation";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { getCourses, getLessonsForCourse } from "@/lib/firestore/courses";
import { getAllUserProgress } from "@/lib/firestore/lesson-progress";
import { findContinueLearningTarget, type ContinueLearningTarget } from "@/lib/continue-learning";

export function ContinueLearningCard({ uid }: { uid: string }) {
  const t = useTranslations("dashboard.continueLearning");
  const { courseTitle, lessonTitle } = useLocalizedContent();
  const [target, setTarget] = useState<ContinueLearningTarget | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [courses, progress] = await Promise.all([getCourses(), getAllUserProgress(uid)]);

      const lessonsByCourseId: Record<string, Awaited<ReturnType<typeof getLessonsForCourse>>> = {};
      await Promise.all(
        courses.map(async (course) => {
          lessonsByCourseId[course.id] = await getLessonsForCourse(course.id);
        }),
      );

      if (cancelled) return;
      setTarget(findContinueLearningTarget(courses, lessonsByCourseId, progress));
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (target === null) return null;

  return (
    <Card>
      <ModuleHeader icon={BookOpen} title={t("title")} />

      {target === undefined ? (
        <div className="mt-4 flex justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <Link
          href={`/courses/${target.course.id}/${target.lesson.id}`}
          className="group mt-4 flex items-center justify-between gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary-500"
        >
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">{courseTitle(target.course)}</p>
            <p className="mt-0.5 truncate text-sm font-medium">{lessonTitle(target.lesson)}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-ink-violet dark:text-primary-400">
            {t("resume")}
            <ArrowLeft className="size-4 transition-transform rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
          </span>
        </Link>
      )}
    </Card>
  );
}
