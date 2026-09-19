import { addDoc, collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { ExamSectionKey, Question, ReadingPassage } from "@/types/question";

const questionsCollection = collection(db, "questions");
const passagesCollection = collection(db, "readingPassages");

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j]!;
    copy[j] = temp!;
  }
  return copy;
}

/**
 * Firestore has no native "random N rows" query, and the question bank is
 * small enough (low hundreds, even at full scale) that fetching all matches
 * for a section and shuffling client-side is simpler and cheap. Revisit
 * with a `randomKey` field + range query if the bank grows to thousands.
 */
export async function getQuestionsBySection(
  section: ExamSectionKey,
  count: number,
  bankTag?: string,
): Promise<Question[]> {
  const q = bankTag
    ? query(questionsCollection, where("section", "==", section), where("tags", "array-contains", bankTag))
    : query(questionsCollection, where("section", "==", section));
  const snapshot = await getDocs(q);
  const all = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Question);
  return shuffle(all).slice(0, count);
}

/** Firestore's `in` operator caps out at 10 values per query, so ids are
 * fetched in chunks and re-combined. */
export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  if (ids.length === 0) return [];

  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));

  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const q = query(questionsCollection, where(documentId(), "in", chunk));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Question);
    }),
  );

  return results.flat();
}

export async function getReadingPassage(passageId: string): Promise<ReadingPassage | null> {
  const snapshot = await getDoc(doc(passagesCollection, passageId));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as ReadingPassage) : null;
}

export async function getReadingPassages(passageIds: string[]): Promise<Record<string, ReadingPassage>> {
  const unique = [...new Set(passageIds)];
  const passages = await Promise.all(unique.map(getReadingPassage));
  return Object.fromEntries(passages.filter(Boolean).map((passage) => [passage!.id, passage!]));
}

/** Admin-only list/write — enforced by firestore.rules, not by these
 * functions. Fine to fetch everything here; the question bank is small. */
export async function getAllQuestions(): Promise<Question[]> {
  const snapshot = await getDocs(questionsCollection);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Question);
}

export async function createQuestion(question: Omit<Question, "id">) {
  const docRef = await addDoc(questionsCollection, question);
  return docRef.id;
}
