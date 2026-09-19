import * as functionsV1 from "firebase-functions/v1";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, type Query } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

/** Collections that store per-user documents with a `userId` field, none of
 * which a client is allowed to bulk-delete under firestore.rules — only this
 * function (running with admin privileges) can safely clean them up. */
const USER_OWNED_COLLECTIONS = [
  "examAttempts",
  "lessonProgress",
  "studyPlans",
  "userAchievements",
  "vocabReviewState",
] as const;

const BATCH_SIZE = 400;

async function deleteQueryBatch(query: Query): Promise<void> {
  const snapshot = await query.limit(BATCH_SIZE).get();
  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  if (snapshot.size === BATCH_SIZE) {
    await deleteQueryBatch(query);
  }
}

/** Runs whenever a user is deleted from Firebase Auth (including via the
 * client `deleteAccount` flow in `src/lib/firebase/auth.ts`, which only
 * removes the Auth account + the two profile docs a client is allowed to
 * touch). Cleans up everything else a client can't safely bulk-delete under
 * security rules. */
export const onUserDeleted = functionsV1.auth.user().onDelete(async (user) => {
  const uid = user.uid;

  await Promise.all(
    USER_OWNED_COLLECTIONS.map((collectionId) =>
      deleteQueryBatch(db.collection(collectionId).where("userId", "==", uid)),
    ),
  );

  // Client already deletes these two on account-deletion, but a user can
  // also be removed directly from the Firebase console/Admin SDK, so cover
  // that path too.
  await Promise.all([
    db.collection("publicProfiles").doc(uid).delete().catch(() => undefined),
    db.collection("users").doc(uid).delete().catch(() => undefined),
  ]);
});

export { sendStreakReminders } from "./notifications";
