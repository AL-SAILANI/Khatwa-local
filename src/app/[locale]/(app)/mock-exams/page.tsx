"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { MockExamList } from "@/components/mock-exams/mock-exam-list";
import { useExamSession } from "@/hooks/use-exam-session";
import { STEP_SECTION_QUESTION_COUNTS, STEP_TOTAL_MINUTES } from "@/lib/constants/exam";

// Dynamically import heavy exam runner component
const ExamRunner = dynamic(() => import("@/components/exam/exam-runner").then((mod) => mod.ExamRunner), {
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    </div>
  ),
  ssr: false,
});

export default function MockExamsPage() {
  const t = useTranslations("mockExams");
  const { isLoading, session, start, submit } = useExamSession({
    kind: "mock",
    examId: "full-mock-exam",
    sectionCounts: STEP_SECTION_QUESTION_COUNTS,
    bankTag: "step-mock",
  });

  if (!session) {
    return <MockExamList onStart={start} isLoading={isLoading} />;
  }

  return (
    <ExamRunner
      title={t("pageTitle")}
      questions={session.questions}
      passages={session.passages}
      durationMinutes={STEP_TOTAL_MINUTES}
      onSubmit={submit}
    />
  );
}
