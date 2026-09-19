/**
 * Pushes the sample question bank + reading passages + achievement
 * definitions into Firestore. Run once against a fresh project (or the
 * emulator) so the placement test / mock exam engine has real content:
 *
 *   npm run seed                 # against the emulator (see README)
 *   FIREBASE_SERVICE_ACCOUNT_KEY=... npm run seed   # against a real project
 *
 * Safe to re-run: every write is a `set` keyed by a fixed id, so it
 * overwrites rather than duplicates.
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { SAMPLE_QUESTIONS, SAMPLE_READING_PASSAGES } from "../src/data/sample-questions";
import { SAMPLE_COURSES, SAMPLE_LESSONS } from "../src/data/sample-courses";
import { SAMPLE_VOCAB_WORDS } from "../src/data/sample-vocabulary";
import { ACHIEVEMENTS } from "../src/data/achievements";
import {
  STEP_MOCK_READING_PASSAGES,
  STEP_MOCK_READING_QUESTIONS,
} from "../src/data/step-mock-reading";
import { STEP_MOCK_LISTENING_QUESTIONS } from "../src/data/step-mock-listening";
import {
  STEP_MOCK_GRAMMAR_QUESTIONS,
  STEP_MOCK_WRITING_QUESTIONS,
} from "../src/data/step-mock-grammar-writing";
import type { Question } from "../src/types/question";

/** The dedicated STEP mock bank the full mock exam draws from (tagged
 * "step-mock"). Exactly 40 reading / 30 grammar / 20 listening / 10 writing
 * questions to mirror the real 100-question STEP split. */
const STEP_MOCK_QUESTIONS: Question[] = [
  ...STEP_MOCK_READING_QUESTIONS,
  ...STEP_MOCK_GRAMMAR_QUESTIONS,
  ...STEP_MOCK_LISTENING_QUESTIONS,
  ...STEP_MOCK_WRITING_QUESTIONS,
].map((q) => ({ ...q, tags: [...q.tags, "step-mock"] }));

// Standalone init (not the app's `src/lib/firebase/admin.ts`, which is
// guarded with `import "server-only"` — that guard throws outside of
// Next.js's server bundling, which is exactly the plain Node context this
// script runs in).
const app = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)) })
  : initializeApp();
const adminDb = getFirestore(app);

async function seed() {
  const batch = adminDb.batch();

  for (const passage of SAMPLE_READING_PASSAGES) {
    batch.set(adminDb.collection("readingPassages").doc(passage.id), passage);
  }

  for (const question of SAMPLE_QUESTIONS) {
    const { id, ...data } = question;
    batch.set(adminDb.collection("questions").doc(id), data);
  }

  for (const passage of STEP_MOCK_READING_PASSAGES) {
    batch.set(adminDb.collection("readingPassages").doc(passage.id), passage);
  }

  for (const question of STEP_MOCK_QUESTIONS) {
    const { id, ...data } = question;
    batch.set(adminDb.collection("questions").doc(id), data);
  }

  for (const achievement of ACHIEVEMENTS) {
    const { id, ...data } = achievement;
    batch.set(adminDb.collection("achievements").doc(id), data);
  }

  for (const course of SAMPLE_COURSES) {
    const { id, ...data } = course;
    batch.set(adminDb.collection("courses").doc(id), data);
  }

  for (const lesson of SAMPLE_LESSONS) {
    const { id, ...data } = lesson;
    batch.set(adminDb.collection("lessons").doc(id), data);
  }

  for (const word of SAMPLE_VOCAB_WORDS) {
    const { id, ...data } = word;
    batch.set(adminDb.collection("vocabWords").doc(id), data);
  }

  await batch.commit();

  console.log(
    `Seeded ${SAMPLE_READING_PASSAGES.length} passages, ${SAMPLE_QUESTIONS.length} questions, ` +
      `${ACHIEVEMENTS.length} achievements, ${SAMPLE_COURSES.length} courses, ${SAMPLE_LESSONS.length} lessons, ` +
      `${SAMPLE_VOCAB_WORDS.length} vocab words, ` +
      `and the STEP mock bank: ${STEP_MOCK_READING_PASSAGES.length} passages + ${STEP_MOCK_QUESTIONS.length} questions.`,
  );
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
