import { collection, doc, getDocs, limit, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/firestore/users";
import type { UserProfile } from "@/types/user";

const publicProfilesCollection = collection(db, "publicProfiles");

export interface PublicProfile {
  uid: string;
  name: string;
  photoURL: string | null;
  avatarEmoji?: string | null;
  xp: number;
  streak: number;
  level: UserProfile["level"];
}

export type LeaderboardPeriod = "all" | "weekly" | "monthly";

/**
 * `users/{uid}` is owner-only (it has email and other private fields), but
 * a leaderboard needs to compare XP across everyone. This denormalized,
 * public-safe copy (name/photo/xp/streak/level only) is what the leaderboard
 * actually queries — call this after anything that changes `xp`, `streak` or
 * `level` so the two stay in sync.
 */
export async function syncPublicProfile(uid: string) {
  const profile = await getUserProfile(uid);
  if (!profile) return;

  await setDoc(doc(publicProfilesCollection, uid), {
    uid,
    name: profile.name,
    photoURL: profile.photoURL ?? null,
    avatarEmoji: profile.avatarEmoji ?? null,
    xp: profile.xp,
    streak: profile.streak,
    level: profile.level ?? null,
  });
}

export async function getLeaderboard(count = 20): Promise<PublicProfile[]> {
  const q = query(publicProfilesCollection, orderBy("xp", "desc"), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data() as PublicProfile);
}

/**
 * Period-based leaderboards.
 * Note: This is a simplified implementation. For true period-based leaderboards,
 * you would need to track XP changes over time in a separate collection.
 * This version returns the all-time leaderboard with period-appropriate labels.
 */
export async function getLeaderboardByPeriod(period: LeaderboardPeriod, count = 20): Promise<PublicProfile[]> {
  // For now, return the same all-time leaderboard
  // In a full implementation, you would query a separate collection
  // that tracks XP earned within specific time windows
  return getLeaderboard(count);
}
