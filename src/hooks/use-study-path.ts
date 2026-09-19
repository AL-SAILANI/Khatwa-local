"use client";

import { useEffect, useMemo, useState } from "react";
import { getActiveStudyPlan } from "@/lib/firestore/study-plans";
import { getCourses, getAllLessons } from "@/lib/firestore/courses";
import { getAllUserProgress } from "@/lib/firestore/lesson-progress";
import { buildStudyPath } from "@/lib/study-plan-generator";
import type { Course, Lesson, LessonProgress } from "@/types/course";
import type { PlanDay, StudyPlan } from "@/types/gamification";

export interface StudyPathState {
  plan: StudyPlan | null;
  schedule: PlanDay[];
  lessonById: Map<string, Lesson>;
  courseById: Map<string, Course>;
  orderedLessonIds: string[];
  currentLessonId: string | null;
  completedCount: number;
  totalCount: number;
  loading: boolean;
}

/**
 * Loads everything the study-path UI needs in one shot: the active plan,
 * the full lesson library, and the user's lesson progress. Plans created
 * before the day-based path existed have empty `lessonIds`, so the schedule
 * is back-filled deterministically via `buildStudyPath` whenever that is the
 * case.
 */
export function useStudyPath(uid: string | undefined): StudyPathState {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      const handle = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(handle);
    }
    let cancelled = false;
    Promise.all([getActiveStudyPlan(uid), getCourses(), getAllLessons(), getAllUserProgress(uid)])
      .then(([activePlan, courseList, lessonList, userProgress]) => {
        if (cancelled) return;
        setPlan(activePlan);
        setCourses(courseList);
        setLessons(lessonList);
        setProgress(userProgress);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const schedule = useMemo<PlanDay[]>(() => {
    if (!plan) return [];
    const hasLessonIds = plan.weeklySchedule.some((day) => day.lessonIds.length > 0);
    return hasLessonIds ? plan.weeklySchedule : buildStudyPath(plan.durationDays, lessons);
  }, [plan, lessons]);

  const derived = useMemo(() => {
    const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
    const courseById = new Map(courses.map((course) => [course.id, course]));
    const orderedLessonIds = schedule.flatMap((day) => day.lessonIds);
    const completed = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
    const currentLessonId = orderedLessonIds.find((id) => !completed.has(id)) ?? null;

    return {
      lessonById,
      courseById,
      orderedLessonIds,
      currentLessonId,
      completedCount: orderedLessonIds.filter((id) => completed.has(id)).length,
      totalCount: orderedLessonIds.length,
    };
  }, [schedule, lessons, courses, progress]);

  return { plan, schedule, loading, ...derived };
}
