import dynamic from "next/dynamic";

const ExamResults = dynamic(() => import("@/components/exam/exam-results").then((mod) => mod.ExamResults), {
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    </div>
  ),
});

export default async function ExamResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  return <ExamResults attemptId={attemptId} />;
}
