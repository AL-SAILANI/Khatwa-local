"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X, FileVideo, FileAudio, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getCourses, createCourse, createLesson } from "@/lib/firestore/courses";
import { uploadLessonResource, resourceTypeFromFile } from "@/lib/firebase/storage-upload";
import type { Course, CourseTrack } from "@/types/course";
import type { LessonResource } from "@/types/course";

const RESOURCE_ICONS = { video: FileVideo, audio: FileAudio, pdf: FileText } as const;

const TRACKS: CourseTrack[] = [
  "grammar",
  "reading",
  "listening",
  "writingAnalysis",
  "vocabulary",
  "tips",
  "strategies",
  "revision",
];

export function AdminCourses() {
  const t = useTranslations("admin.courses");
  const [courses, setCourses] = useState<Course[] | null>(null);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    track: "grammar" as CourseTrack,
    estimatedMinutes: 20,
  });
  const [lessonForm, setLessonForm] = useState({ courseId: "", title: "", notes: "", questionIds: "" });
  const [resources, setResources] = useState<LessonResource[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  const refresh = () => getCourses().then(setCourses);

  useEffect(() => {
    refresh();
  }, []);

  const handleCreateCourse = async () => {
    setIsSavingCourse(true);
    await createCourse({
      title: courseForm.title,
      description: courseForm.description,
      track: courseForm.track,
      order: courses?.length ?? 0,
      lessonCount: 0,
      estimatedMinutes: courseForm.estimatedMinutes,
    });
    setCourseForm({ title: "", description: "", track: "grammar", estimatedMinutes: 20 });
    setIsSavingCourse(false);
    refresh();
  };

  const handleCreateLesson = async () => {
    if (!lessonForm.courseId) return;
    setIsSavingLesson(true);
    await createLesson({
      courseId: lessonForm.courseId,
      title: lessonForm.title,
      order: 0,
      resources,
      notes: lessonForm.notes,
      questionIds: lessonForm.questionIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    });
    setLessonForm({ courseId: "", title: "", notes: "", questionIds: "" });
    setResources([]);
    setIsSavingLesson(false);
  };

  const handleUploadResource = async (file: File) => {
    if (!lessonForm.courseId) {
      setUploadError(t("chooseCourseFirst"));
      return;
    }
    const type = resourceTypeFromFile(file);
    if (!type) {
      setUploadError(t("unsupportedFormat"));
      return;
    }
    setUploadError(null);
    setUploadProgress(0);
    try {
      const url = await uploadLessonResource(lessonForm.courseId, file, setUploadProgress);
      setResources((prev) => [...prev, { type, url, title: file.name }]);
    } catch {
      setUploadError(t("uploadFailed"));
    } finally {
      setUploadProgress(null);
    }
  };

  const removeResource = (index: number) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Container className="max-w-6xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("description")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">{t("addCourseTitle")}</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="courseTitle">{t("titleLabel")}</Label>
              <Input
                id="courseTitle"
                value={courseForm.title}
                onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="courseDescription">{t("descriptionLabel")}</Label>
              <Input
                id="courseDescription"
                value={courseForm.description}
                onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="courseTrack">{t("trackLabel")}</Label>
                <select
                  id="courseTrack"
                  value={courseForm.track}
                  onChange={(e) => setCourseForm((f) => ({ ...f, track: e.target.value as CourseTrack }))}
                  className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm"
                >
                  {TRACKS.map((track) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="courseMinutes">{t("minutesLabel")}</Label>
                <Input
                  id="courseMinutes"
                  type="number"
                  value={courseForm.estimatedMinutes}
                  onChange={(e) => setCourseForm((f) => ({ ...f, estimatedMinutes: Number(e.target.value) }))}
                />
              </div>
            </div>
            <Button onClick={handleCreateCourse} disabled={!courseForm.title || isSavingCourse}>
              {isSavingCourse ? t("saving") : t("addCourse")}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">{t("addLessonTitle")}</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="lessonCourse">{t("courseLabel")}</Label>
              <select
                id="lessonCourse"
                value={lessonForm.courseId}
                onChange={(e) => setLessonForm((f) => ({ ...f, courseId: e.target.value }))}
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm"
              >
                <option value="">{t("chooseCourse")}</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="lessonTitle">{t("lessonTitleLabel")}</Label>
              <Input
                id="lessonTitle"
                value={lessonForm.title}
                onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="lessonNotes">{t("lessonNotesLabel")}</Label>
              <textarea
                id="lessonNotes"
                rows={4}
                value={lessonForm.notes}
                onChange={(e) => setLessonForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded-xl border border-border bg-surface p-3 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="lessonQuestions">{t("lessonQuestionsLabel")}</Label>
              <Input
                id="lessonQuestions"
                dir="ltr"
                value={lessonForm.questionIds}
                onChange={(e) => setLessonForm((f) => ({ ...f, questionIds: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="lessonResource">{t("resourcesLabel")}</Label>
              <input
                id="lessonResource"
                type="file"
                accept="video/*,audio/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUploadResource(file);
                  e.target.value = "";
                }}
                className="block w-full text-sm text-foreground/70 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink-violet dark:file:bg-primary-500/10 dark:file:text-primary-300"
              />
              {uploadProgress !== null && (
                <div
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-none bg-surface-muted"
                  role="progressbar"
                  aria-label={t("uploadProgress")}
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-primary-500 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              {uploadError && <p className="mt-2 text-xs text-error">{uploadError}</p>}

              {resources.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {resources.map((resource, index) => {
                    const Icon = RESOURCE_ICONS[resource.type];
                    return (
                      <li
                        key={`${resource.url}-${index}`}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-xs"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Icon className="size-4 shrink-0 text-ink-violet dark:text-primary-300" />
                          <span className="truncate">{resource.title}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeResource(index)}
                          aria-label={t("removeResource", { title: resource.title })}
                          className="shrink-0 rounded-lg p-1 text-foreground/70 transition-colors hover:text-error hover:bg-error/10"
                        >
                          <X className="size-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <Button onClick={handleCreateLesson} disabled={!lessonForm.courseId || !lessonForm.title || isSavingLesson}>
              {isSavingLesson ? t("saving") : t("addLesson")}
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold">{t("currentCoursesTitle")}</h2>
        {courses === null ? (
          <div className="mt-4 flex justify-center" role="status" aria-label={t("loading")}>
            <div className="size-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium">{course.title}</span>
                <span className="text-muted">{course.track}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}
