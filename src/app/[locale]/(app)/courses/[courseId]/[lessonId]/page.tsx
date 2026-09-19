import { LessonViewer } from "@/components/courses/lesson-viewer";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  return <LessonViewer courseId={courseId} lessonId={lessonId} />;
}
