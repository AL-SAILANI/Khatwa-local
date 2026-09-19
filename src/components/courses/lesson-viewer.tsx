"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, ChevronLeft, ChevronRight, Lock, Play, Volume2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LessonNotes } from "@/components/courses/lesson-notes";
import { LessonQuiz } from "@/components/courses/lesson-quiz";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { useStudyPath } from "@/hooks/use-study-path";
import { getLesson, getLessonsForCourse } from "@/lib/firestore/courses";
import { getQuestionsByIds, getReadingPassages } from "@/lib/firestore/questions";
import { getLessonProgress, markLessonComplete } from "@/lib/firestore/lesson-progress";
import { PlanNextLesson } from "@/components/study-plan/plan-next-lesson";
import type { Lesson } from "@/types/course";
import type { Question, ReadingPassage } from "@/types/question";

export function LessonViewer({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const t = useTranslations("courses");
  const { user } = useUserProfile();
  const { lessonTitle, lessonNotes } = useLocalizedContent();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [passages, setPassages] = useState<Record<string, ReadingPassage>>({});
  const [isDone, setIsDone] = useState(false);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const { plan, orderedLessonIds, currentLessonId, lessonById } = useStudyPath(user?.uid);

  useEffect(() => {
    getLesson(lessonId).then(async (fetchedLesson) => {
      setLesson(fetchedLesson);
      if (!fetchedLesson || fetchedLesson.questionIds.length === 0) return;

      const fetchedQuestions = await getQuestionsByIds(fetchedLesson.questionIds);
      setQuestions(fetchedQuestions);

      const passageIds = fetchedQuestions.map((q) => q.passageId).filter((id): id is string => Boolean(id));
      setPassages(await getReadingPassages(passageIds));
    });
    getLessonsForCourse(courseId).then(setCourseLessons);
    if (user) {
      getLessonProgress(user.uid, lessonId).then((progress) => setIsDone(Boolean(progress?.completed)));
    }
  }, [lessonId, courseId, user]);

  const inPath = Boolean(plan) && orderedLessonIds.includes(lessonId);
  const order = inPath ? orderedLessonIds : courseLessons.map((lesson) => lesson.id);
  const index = order.indexOf(lessonId);
  const position = index >= 0 ? index + 1 : null;
  const total = order.length;
  const prevId = index > 0 ? order[index - 1] : null;
  const nextId = index >= 0 && index < order.length - 1 ? order[index + 1] : null;

  const currentIndex = currentLessonId ? orderedLessonIds.indexOf(currentLessonId) : orderedLessonIds.length;
  const isLocked = inPath && index > currentIndex;
  const currentLesson = currentLessonId ? lessonById.get(currentLessonId) : undefined;

  const hrefOf = (id: string) => {
    const target = inPath ? lessonById.get(id) : courseLessons.find((lesson) => lesson.id === id);
    return `/courses/${target?.courseId ?? courseId}/${id}`;
  };

  if (!lesson) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 p-6 lg:p-8">
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-surface-muted text-muted">
            <Lock className="size-5" />
          </span>
          <p className="font-medium">{t("lockedLessonNotice")}</p>
          {currentLesson && (
            <Button onClick={() => router.push(`/courses/${currentLesson.courseId}/${currentLesson.id}`)}>
              <Play className="size-4" />
              {t("goToCurrentLesson")}
            </Button>
          )}
        </Card>
      </div>
    );
  }

  const listeningAudioUrls = [
    ...new Set(
      questions
        .filter((q) => q.section === "listening" && q.audioUrl)
        .map((q) => q.audioUrl as string),
    ),
  ];

  const finish = async (quizScore: number | null) => {
    if (!user) return;
    await markLessonComplete(user.uid, courseId, lessonId, quizScore);
    setIsDone(true);
  };

  const lessonProgress = total > 0 ? Math.round((((position ?? 1) - 1) / total) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6 lg:p-8">
      {position !== null && (
        <Card className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-muted">{t("lessonPosition", { position, total })}</p>
            <span className="text-xs font-bold text-ink-violet dark:text-primary-400">{lessonProgress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-none bg-surface-muted">
            <div
              className="h-full rounded-none bg-ink-violet transition-all"
              style={{ width: `${lessonProgress}%` }}
            />
          </div>
        </Card>
      )}

      <div>
        <h1 className="text-2xl font-bold">{lessonTitle(lesson)}</h1>
      </div>

      {lesson.courseId === "course-listening" && listeningAudioUrls.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Volume2 className="size-4 text-ink-violet dark:text-primary-300" />
            {t("listenToDialogue")}
          </div>
          {listeningAudioUrls.map((url) => (
            <audio key={url} controls preload="none" className="w-full" src={url} />
          ))}
        </Card>
      )}

      <LessonNotes notes={lessonNotes(lesson)} />

      {lesson.resources.length > 0 && (
        <div className="space-y-4">
          {lesson.resources.map((resource, resourceIndex) => (
            <Card key={`${resource.url}-${resourceIndex}`} className="space-y-2">
              <p className="text-sm font-medium">{resource.title}</p>
              {resource.type === "video" && (
                <video controls className="w-full rounded-xl" src={resource.url} />
              )}
              {resource.type === "audio" && <audio controls className="w-full" src={resource.url} />}
              {resource.type === "pdf" && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-ink-violet underline dark:text-primary-400"
                >
                  {t("openPdf")}
                </a>
              )}
            </Card>
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <LessonQuiz questions={questions} passages={passages} onComplete={(score) => finish(score)} />
      )}

      {questions.length === 0 && !isDone && (
        <Button size="lg" className="w-full" onClick={() => finish(null)}>
          {t("finishLesson")}
        </Button>
      )}

      {isDone && (
        <div className="space-y-3">
          <Card className="flex flex-wrap items-center justify-center gap-2 border-success/30 bg-success/5 py-6 text-center">
            <CheckCircle2 className="size-5 text-success-600 dark:text-success-300" />
            <span className="font-medium">{t("lessonCompleted")}</span>
            <Button size="sm" variant="outline" onClick={() => router.push(`/courses/${courseId}`)}>
              {t("backToCourse")}
            </Button>
          </Card>
          {user && <PlanNextLesson uid={user.uid} lessonId={lessonId} />}
        </div>
      )}

      {(prevId || nextId) && (
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          {prevId ? (
            <Button variant="outline" onClick={() => router.push(hrefOf(prevId))}>
              <ChevronRight className="size-4 rtl:rotate-180" />
              {t("prevLesson")}
            </Button>
          ) : (
            <span />
          )}
          {nextId ? (
            <div className="flex flex-col items-end gap-1">
              <Button
                disabled={!isDone}
                onClick={() => router.push(hrefOf(nextId))}
              >
                {t("nextLesson")}
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </Button>
              {!isDone && <p className="text-xs text-muted">{t("completeToContinue")}</p>}
            </div>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
