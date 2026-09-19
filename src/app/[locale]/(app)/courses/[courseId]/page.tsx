import { LessonList } from "@/components/courses/lesson-list";

export default async function CourseLessonsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <LessonList courseId={courseId} />;
}
