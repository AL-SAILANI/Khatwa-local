import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { getUserProfile, markDayActive } from "@/lib/firestore/users";
import { unlockHoursMilestones, unlockLessonMilestones, unlockStreakMilestones } from "@/lib/firestore/achievements";
import type { LessonProgress } from "@/types/course";

function progressId(userId: string, lessonId: string) {
  return `${userId}_${lessonId}`;
}

export async function getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | null> {
  const snapshot = await getDoc(doc(db, "lessonProgress", progressId(userId, lessonId)));
  return snapshot.exists() ? (snapshot.data() as LessonProgress) : null;
}

export async function getCourseProgress(userId: string, courseId: string): Promise<LessonProgress[]> {
  const q = query(
    collection(db, "lessonProgress"),
    where("userId", "==", userId),
    where("courseId", "==", courseId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data() as LessonProgress);
}

/** All of a user's lesson progress across every course — used by the study
 * coach recommender, which needs to know completed lessons platform-wide
 * rather than one course at a time. */
export async function getAllUserProgress(userId: string): Promise<LessonProgress[]> {
  const q = query(collection(db, "lessonProgress"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data() as LessonProgress);
}

export async function markLessonComplete(
  userId: string,
  courseId: string,
  lessonId: string,
  quizScore: number | null,
) {
  await setDoc(doc(db, "lessonProgress", progressId(userId, lessonId)), {
    userId,
    courseId,
    lessonId,
    completed: true,
    quizScore,
    lastPosition: 0,
    updatedAt: new Date().toISOString(),
  });

  const profile = await getUserProfile(userId);
  const nextStreak = await markDayActive(userId, 0.5);

  const completed = await getAllUserProgress(userId);
  await unlockLessonMilestones(userId, completed.length);
  if (nextStreak) await unlockStreakMilestones(userId, nextStreak);
  if (profile) await unlockHoursMilestones(userId, profile.studyHours + 0.5);
}
