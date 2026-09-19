"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { getCourse, getLessonsForCourse } from "@/lib/firestore/courses";
import { getCourseProgress } from "@/lib/firestore/lesson-progress";
import type { Course, Lesson } from "@/types/course";

export function LessonList({ courseId }: { courseId: string }) {
  const { user } = useUserProfile();
  const tCourses = useTranslations("courses");
  const { courseTitle, courseDescription, lessonTitle } = useLocalizedContent();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getCourse(courseId).then(setCourse);
    getLessonsForCourse(courseId).then(setLessons);
  }, [courseId]);

  useEffect(() => {
    if (!user) return;
    getCourseProgress(user.uid, courseId).then((progress) => {
      setCompletedLessonIds(new Set(progress.filter((p) => p.completed).map((p) => p.lessonId)));
    });
  }, [user, courseId]);

  if (!course || !lessons) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6 lg:p-8">
      <PageHeader eyebrow={tCourses("eyebrow")} title={courseTitle(course)} description={courseDescription(course)} />

      <Card className="divide-y divide-border p-0">
        {lessons.map((lesson) => {
          const isCompleted = completedLessonIds.has(lesson.id);
          return (
            <Link
              key={lesson.id}
              href={`/courses/${courseId}/${lesson.id}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-surface-muted"
            >
              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                ) : (
                  <Circle className="size-4 shrink-0 text-muted" />
                )}
                <span className="text-sm font-medium">{lessonTitle(lesson)}</span>
              </div>
              <ChevronLeft className="size-4 shrink-0 text-muted rtl:rotate-180" />
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
