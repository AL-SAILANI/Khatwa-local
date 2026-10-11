import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { applyProfileChanges, getUserProfile } from "@/lib/firestore/users";
import { unlockExamMilestones, unlockStreakMilestones } from "@/lib/firestore/achievements";
import { syncPublicProfile } from "@/lib/firestore/public-profiles";
import { computeNextStreak, withTodayMarkedActive } from "@/lib/streak";
import type { ExamAttempt, SectionResult } from "@/types/exam";
import { useSupabaseUsers } from "@/lib/supabase/flags";
import {
  sbCreateExamAttempt,
  sbGetExamAttempt,
  sbGetRecentAttempts,
  sbSaveAttemptAnswer,
  sbSubmitAttempt,
} from "@/lib/supabase/user-data";

const attemptsCollection = collection(db, "examAttempts");

export async function createExamAttempt(
  attempt: Omit<ExamAttempt, "id" | "status" | "submittedAt" | "score" | "sectionResults" | "weakSkills" | "newWords" | "recommendations">,
) {
  if (useSupabaseUsers) return sbCreateExamAttempt(attempt);
  const docRef = await addDoc(attemptsCollection, {
    ...attempt,
    status: "in_progress",
    submittedAt: null,
    score: null,
    sectionResults: [],
    weakSkills: [],
    newWords: [],
    recommendations: [],
  });
  return docRef.id;
}

export async function saveAttemptAnswer(attemptId: string, answers: Record<string, string>, flagged: string[]) {
  if (useSupabaseUsers) return sbSaveAttemptAnswer(attemptId, answers, flagged);
  await updateDoc(doc(db, "examAttempts", attemptId), { answers, flagged });
}

interface SubmitResult {
  score: number;
  sectionResults: SectionResult[];
  weakSkills: string[];
  newWords: string[];
  recommendations: string[];
}

/**
 * Finalizes an attempt and rolls the result into the denormalized stats on
 * the user's profile (testsTaken, lastScore, streak, xp) in one place, so
 * every caller (placement test, mock exam) gets consistent dashboard stats.
 */
export async function submitExamAttempt(uid: string, attemptId: string, result: SubmitResult) {
  if (useSupabaseUsers) {
    await sbSubmitAttempt(attemptId, result);
  } else {
    await updateDoc(doc(db, "examAttempts", attemptId), {
      ...result,
      status: "submitted",
      submittedAt: new Date().toISOString(),
    });
  }

  const profile = await getUserProfile(uid);
  if (!profile) return;

  const nextStreak = computeNextStreak(profile.lastActiveAt, profile.streak);

  await applyProfileChanges(uid, {
    set: {
      lastScore: result.score,
      streak: nextStreak,
      lastActiveAt: new Date().toISOString(),
      recentActivityDays: withTodayMarkedActive(profile.recentActivityDays ?? []),
    },
    inc: { testsTaken: 1, xp: 50 },
  });

  await unlockExamMilestones(uid, (profile.testsTaken ?? 0) + 1, result.score, profile.level);
  await unlockStreakMilestones(uid, nextStreak);

  await syncPublicProfile(uid);
}

export async function getExamAttempt(attemptId: string): Promise<ExamAttempt | null> {
  if (useSupabaseUsers) return sbGetExamAttempt(attemptId);
  const snapshot = await getDoc(doc(db, "examAttempts", attemptId));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as ExamAttempt) : null;
}

export async function getRecentAttempts(uid: string, count = 5): Promise<ExamAttempt[]> {
  if (useSupabaseUsers) return sbGetRecentAttempts(uid, count);
  const q = query(
    attemptsCollection,
    where("userId", "==", uid),
    orderBy("submittedAt", "desc"),
    limit(count),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ExamAttempt);
}

export async function getAttemptsByKind(
  uid: string,
  kind: ExamAttempt["kind"],
  count = 10,
): Promise<ExamAttempt[]> {
  if (useSupabaseUsers) return sbGetRecentAttempts(uid, count, kind);
  const q = query(
    attemptsCollection,
    where("userId", "==", uid),
    where("kind", "==", kind),
    orderBy("submittedAt", "desc"),
    limit(count),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ExamAttempt);
}
