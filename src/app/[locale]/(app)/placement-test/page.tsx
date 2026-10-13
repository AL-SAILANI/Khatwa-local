"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { PlacementIntro } from "@/components/placement/placement-intro";
import { PLACEMENT_COUNTS, PLACEMENT_MINUTES } from "@/lib/placement";
import { useExamSession } from "@/hooks/use-exam-session";

// Dynamically import heavy exam runner component
const ExamRunner = dynamic(() => import("@/components/exam/exam-runner").then((mod) => mod.ExamRunner), {
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    </div>
  ),
  ssr: false,
});

export default function PlacementTestPage() {
  const t = useTranslations("placementTest");
  const { isLoading, session, start, submit } = useExamSession({
    kind: "placement",
    examId: "placement-test",
    sectionCounts: PLACEMENT_COUNTS,
  });

  if (!session) {
    return <PlacementIntro onStart={() => start()} isLoading={isLoading} />;
  }

  return (
    <ExamRunner
      title={t("pageTitle")}
      questions={session.questions}
      passages={session.passages}
      durationMinutes={PLACEMENT_MINUTES}
      onSubmit={submit}
    />
  );
}
