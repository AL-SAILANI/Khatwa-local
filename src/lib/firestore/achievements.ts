import { addDoc, collection, doc, getDoc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { syncPublicProfile } from "@/lib/firestore/public-profiles";
import type { Achievement, UserAchievement } from "@/types/gamification";

const userAchievementsCollection = collection(db, "userAchievements");
const achievementsCollection = collection(db, "achievements");

export async function getAllAchievements(): Promise<Achievement[]> {
  const snapshot = await getDocs(achievementsCollection);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Achievement);
}

export async function getUserAchievements(uid: string): Promise<UserAchievement[]> {
  const q = query(userAchievementsCollection, where("userId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data() as UserAchievement);
}

/**
 * Client-side unlock helper for the free-tier achievements this app grants
 * automatically (first exam, streaks). Anything with real payout value
 * (coins/xp bonuses beyond a token amount) should move to a Cloud Function
 * once `firestore.rules` locks `userAchievements` writes to admin-only,
 * since a client write here is technically forgeable by the signed-in user.
 */
export async function unlockAchievement(uid: string, achievementId: string) {
  const existing = await getDocs(
    query(userAchievementsCollection, where("userId", "==", uid), where("achievementId", "==", achievementId)),
  );
  if (!existing.empty) return;

  await addDoc(userAchievementsCollection, {
    userId: uid,
    achievementId,
    unlockedAt: new Date().toISOString(),
  });

  const achievementSnap = await getDoc(doc(achievementsCollection, achievementId));
  const xpReward = achievementSnap.exists() ? (achievementSnap.data() as Achievement).xpReward : 0;
  if (xpReward > 0) {
    await updateDoc(doc(db, "users", uid), { xp: increment(xpReward) });
  }

  await syncPublicProfile(uid);
}

/** Unlocks every achievement whose id is present in `ids` (each one goes
 * through `unlockAchievement`'s no-op-if-held guard). Sequential so a burst
 * of newly-met milestones still awards cleanly. */
export async function unlockAchievements(uid: string, ids: string[]) {
  for (const id of ids) {
    if (id) await unlockAchievement(uid, id);
  }
}

/** Per-user counters we already read for other reasons, mapped to the
 * milestone thresholds defined in `src/data/achievements.ts`. */
const STREAK_TIERS = [3, 7, 14, 30, 60, 100];
const WORDS_TIERS = [10, 50, 100, 250, 500, 1000];
const BOOKMARKS_TIERS = [25, 100];
const EXAMS_TIERS = [1, 5, 10, 25, 50];
const LESSONS_TIERS = [1, 10, 25, 50, 100];
const HOURS_TIERS = [5, 10, 25, 50, 100];
const DAILY_TIERS = [1, 7, 30];

/** id name for `100-words` is legacy (kept for existing holds). */
function wordsIdFor(tier: number) {
  return tier === 100 ? "100-words" : `words-${tier}`;
}

export async function unlockStreakMilestones(uid: string, streak: number) {
  await unlockAchievements(
    uid,
    STREAK_TIERS.filter((t) => streak >= t).map((t) => (t === 7 ? "week-streak" : `streak-${t}`)),
  );
}

export async function unlockVocabMilestones(uid: string, reviewCount: number, bookmarksCount = 0) {
  await unlockAchievements(uid, [
    ...WORDS_TIERS.filter((t) => reviewCount >= t).map(wordsIdFor),
    ...BOOKMARKS_TIERS.filter((t) => bookmarksCount >= t).map((t) => `bookmarks-${t}`),
  ]);
}

export async function unlockExamMilestones(
  uid: string,
  testsTaken: number,
  score: number,
  level: "beginner" | "intermediate" | "advanced" | null,
) {
  await unlockAchievements(uid, [
    ...EXAMS_TIERS.filter((t) => testsTaken >= t).map((t) => (t === 1 ? "first-exam" : `exams-${t}`)),
    ...(score >= 90 ? ["score-90"] : []),
    ...(score >= 100 ? ["score-100"] : []),
    ...(level === "intermediate" ? ["level-intermediate"] : []),
    ...(level === "advanced" ? ["level-intermediate", "level-advanced"] : []),
  ]);
}

export async function unlockLessonMilestones(uid: string, completedLessons: number) {
  await unlockAchievements(
    uid,
    LESSONS_TIERS.filter((t) => completedLessons >= t).map((t) => (t === 1 ? "first-lesson" : `lessons-${t}`)),
  );
}

export async function unlockHoursMilestones(uid: string, studyHours: number) {
  await unlockAchievements(uid, HOURS_TIERS.filter((t) => studyHours >= t).map((t) => `hours-${t}`));
}

export async function unlockDailyMilestones(uid: string, completedCount: number) {
  await unlockAchievements(uid, DAILY_TIERS.filter((t) => completedCount >= t).map((t) => `daily-${t}`));
}
