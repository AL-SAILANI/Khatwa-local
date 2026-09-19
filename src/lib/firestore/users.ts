import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, increment, limit as fbLimit, onSnapshot, orderBy, query, setDoc, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { computeNextStreak, withTodayMarkedActive } from "@/lib/streak";
import { unlockHoursMilestones, unlockStreakMilestones } from "@/lib/firestore/achievements";
import type { Gender, StudyGoal, UserProfile } from "@/types/user";

const usersCollection = collection(db, "users");

function userRef(uid: string) {
  return doc(db, "users", uid);
}

interface NewProfileInput {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  avatarEmoji?: string | null;
  age?: number | null;
  gender?: Gender | null;
  goal: StudyGoal | null;
  examDate?: string | null;
}

/** Called once, right after Firebase Auth account creation. Also seeds the
 * public-profile projection (see `public-profiles.ts`) the leaderboard
 * reads, inline rather than via `syncPublicProfile` to avoid a circular
 * import between the two modules. */
export async function createUserProfile({ uid, name, email, photoURL, avatarEmoji, age, gender, goal, examDate }: NewProfileInput) {
  await setDoc(userRef(uid), {
    uid,
    name,
    email,
    photoURL: photoURL ?? null,
    avatarEmoji: avatarEmoji ?? null,
    age: age ?? null,
    gender: gender ?? null,
    examDate: examDate ?? null,
    goal,
    level: null,
    xp: 0,
    coins: 0,
    streak: 0,
    lastActiveAt: null,
    recentActivityDays: [],
    planTier: "free",
    activeStudyPlanId: null,
    notificationsEnabled: true,
    studyHours: 0,
    testsTaken: 0,
    lastScore: null,
    completionPercent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await setDoc(doc(db, "publicProfiles", uid), {
    uid,
    name,
    photoURL: photoURL ?? null,
    avatarEmoji: avatarEmoji ?? null,
    xp: 0,
    streak: 0,
  });
}

/**
 * Social sign-in (Google) doesn't go through the register form, so there's
 * no chosen goal yet. Creates a minimal profile with `goal: null` the first
 * time such a user is seen; the app shell redirects those users to
 * `/onboarding/goal` before letting them into the dashboard.
 */
export async function ensureUserProfile(input: Omit<NewProfileInput, "goal">) {
  const snapshot = await getDoc(userRef(input.uid));
  if (snapshot.exists()) return;
  await createUserProfile({ ...input, goal: null });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userRef(uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export function subscribeUserProfile(uid: string, onChange: (profile: UserProfile | null) => void) {
  return onSnapshot(userRef(uid), (snapshot) => {
    onChange(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
  });
}

export async function updateUserProfile(uid: string, partial: Partial<UserProfile>) {
  await updateDoc(userRef(uid), { ...partial, updatedAt: new Date().toISOString() });
}

/**
 * Marks today as a study day on the profile and advances the streak, shared
 * by every study action that isn't an exam submission (lesson completion,
 * daily challenge, etc.) so the streak and the activity calendar reflect all
 * learning, not just graded tests. Returns the new streak, or null if the
 * profile can't be read.
 */
export async function markDayActive(uid: string, studyHours = 0.5): Promise<number | null> {
  const profile = await getUserProfile(uid);
  if (!profile) return null;

  const nextStreak = computeNextStreak(profile.lastActiveAt, profile.streak);
  await updateDoc(userRef(uid), {
    streak: nextStreak,
    lastActiveAt: new Date().toISOString(),
    recentActivityDays: withTodayMarkedActive(profile.recentActivityDays ?? []),
    studyHours: increment(studyHours),
    updatedAt: new Date().toISOString(),
  });

  await unlockStreakMilestones(uid, nextStreak);
  await unlockHoursMilestones(uid, (profile.studyHours ?? 0) + studyHours);
  return nextStreak;
}

/** Registers a Web Push token for this user's current browser. Safe to call
 * repeatedly — `arrayUnion` is a no-op for a token already stored. */
export async function addFcmToken(uid: string, token: string) {
  await updateDoc(userRef(uid), { fcmTokens: arrayUnion(token), updatedAt: new Date().toISOString() });
}

/** Collections that store per-user documents with a `userId` field, cleaned
 * up as part of account deletion. `firestore.rules` grants owner-delete on
 * each of these specifically so this cascade can run client-side, with no
 * Cloud Function (and no Blaze-plan billing) required. */
const CASCADE_DELETE_COLLECTIONS = ["examAttempts", "lessonProgress", "studyPlans", "userAchievements", "vocabReviewState"] as const;

async function deleteUserOwnedDocs(uid: string, collectionName: string) {
  const snapshot = await getDocs(query(collection(db, collectionName), where("userId", "==", uid)));
  const docs = snapshot.docs;
  for (let i = 0; i < docs.length; i += 500) {
    const batch = writeBatch(db);
    docs.slice(i, i + 500).forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  }
}

/**
 * Deletes everything Firestore knows about this user, run client-side right
 * before the Auth account itself is removed (see `deleteAccount` in
 * `lib/firebase/auth.ts`). The one gap this doesn't cover: a user removed
 * directly from the Firebase Auth console (bypassing the app) would leave
 * these documents orphaned — an accepted trade-off to avoid needing the
 * paid Blaze plan for a Cloud Function trigger.
 */
export async function deleteUserData(uid: string) {
  await Promise.all(CASCADE_DELETE_COLLECTIONS.map((name) => deleteUserOwnedDocs(uid, name)));
  await deleteDoc(userRef(uid));
  await deleteDoc(doc(db, "publicProfiles", uid));
}

/** Admin-only: firestore.rules lets `isAdmin()` read any `users/{uid}` doc,
 * which extends to a list query too — each returned doc still has to pass
 * the per-document rule, and it does for an admin regardless of owner. */
export async function listAllUsers(count = 50): Promise<UserProfile[]> {
  const q = query(usersCollection, orderBy("createdAt", "desc"), fbLimit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data() as UserProfile);
}
