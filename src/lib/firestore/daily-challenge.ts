import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { getUserProfile, markDayActive } from "@/lib/firestore/users";
import { syncPublicProfile } from "@/lib/firestore/public-profiles";
import { unlockDailyMilestones } from "@/lib/firestore/achievements";

export interface DailyChallenge {
  id: string;
  date: string;
  questionIds: string[];
  xpReward: number;
}

/** Returns today's date string in YYYY-MM-DD format */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Grants the once-per-day daily-challenge reward. Guards on the profile's
 * `lastDailyChallengeDate` so calling it twice in the same day is a no-op
 * (defense in depth on top of the UI's `alreadyDone` check).
 */
export async function completeDailyChallenge(uid: string, xpReward = 30): Promise<void> {
  const today = getTodayDateString();
  const userRef = doc(db, "users", uid);
  const profile = await getUserProfile(uid);
  if (!profile) return;

  // Prevent multiple completions on the same day.
  if (profile.lastDailyChallengeDate === today) return;

  await updateDoc(userRef, {
    xp: increment(xpReward),
    coins: increment(10),
    lastDailyChallengeDate: today,
    dailyChallengesCompleted: increment(1),
    updatedAt: new Date().toISOString(),
  });

  await unlockDailyMilestones(uid, (profile.dailyChallengesCompleted ?? 0) + 1);

  // Count the completed challenge as study activity so the 90-day heatmap
  // and streak both reflect it (same day guard inside).
  await markDayActive(uid, 0.25);

  await syncPublicProfile(uid);
}
