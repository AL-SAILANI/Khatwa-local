import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, increment, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { computeNextReview, NEW_WORD_STATE, type ReviewQuality } from "@/lib/spaced-repetition";
import { unlockVocabMilestones } from "@/lib/firestore/achievements";
import { syncPublicProfile } from "@/lib/firestore/public-profiles";
import type { VocabSet, VocabWord, VocabReviewState } from "@/types/vocabulary";

const wordsCollection = collection(db, "vocabWords");
const reviewStateCollection = collection(db, "vocabReviewState");
const vocabSetsCollection = collection(db, "vocabSets");

function reviewStateId(userId: string, wordId: string) {
  return `${userId}_${wordId}`;
}

export async function getAllVocabWords(): Promise<VocabWord[]> {
  const snapshot = await getDocs(query(wordsCollection, orderBy("word")));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as VocabWord);
}

export async function getReviewStatesForUser(uid: string): Promise<VocabReviewState[]> {
  const q = query(reviewStateCollection, where("userId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => docSnap.data() as VocabReviewState);
}

export async function getVocabSetsForUser(uid: string): Promise<VocabSet[]> {
  const q = query(vocabSetsCollection, where("userId", "==", uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as VocabSet);
}

export async function createVocabSet(uid: string, name: string): Promise<string> {
  const ref = await addDoc(vocabSetsCollection, {
    userId: uid,
    name: name.trim(),
    wordIds: [],
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function deleteVocabSet(setId: string) {
  await deleteDoc(doc(vocabSetsCollection, setId));
}

export async function addWordToSet(setId: string, wordId: string) {
  await updateDoc(doc(vocabSetsCollection, setId), { wordIds: arrayUnion(wordId) });
}

export async function removeWordFromSet(setId: string, wordId: string) {
  await updateDoc(doc(vocabSetsCollection, setId), { wordIds: arrayRemove(wordId) });
}

export async function recordReview(
  uid: string,
  wordId: string,
  quality: ReviewQuality,
): Promise<{ intervalDays: number; repetitions: number }> {
  const ref = doc(reviewStateCollection, reviewStateId(uid, wordId));
  const existing = await getDoc(ref);
  const previousState = existing.exists() ? (existing.data() as VocabReviewState) : null;

  const next = computeNextReview(previousState ?? NEW_WORD_STATE, quality);

  await setDoc(ref, {
    userId: uid,
    wordId,
    ...next,
    bookmarked: previousState?.bookmarked ?? false,
    reviewCount: (previousState?.reviewCount ?? 0) + 1,
    lastReviewedAt: new Date().toISOString(),
  });

  if (!previousState) {
    const allStates = await getReviewStatesForUser(uid);
    await unlockVocabMilestones(
      uid,
      allStates.length,
      allStates.filter((s) => s.bookmarked).length,
    );
  }

  return { intervalDays: next.intervalDays, repetitions: next.repetitions };
}

/** Token XP reward for finishing a vocabulary session (review/favorites/sets),
 * mirroring the client-side reward pattern used by exams and the daily
 * challenge. */
export async function awardVocabSessionXp(uid: string, amount: number) {
  if (amount <= 0) return;
  await updateDoc(doc(db, "users", uid), { xp: increment(amount) });
  await syncPublicProfile(uid);
}

export async function toggleBookmark(uid: string, wordId: string, bookmarked: boolean) {
  const ref = doc(reviewStateCollection, reviewStateId(uid, wordId));
  const existing = await getDoc(ref);

  if (existing.exists()) {
    await setDoc(ref, { ...existing.data(), bookmarked }, { merge: true });
  } else {
    await setDoc(ref, {
      userId: uid,
      wordId,
      ...NEW_WORD_STATE,
      dueAt: new Date().toISOString(),
      bookmarked,
      lastReviewedAt: null,
    });
  }
}
