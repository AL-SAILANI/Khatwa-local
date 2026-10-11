/** Shared Firebase Admin setup for the one-off migration scripts. */
import { cert, initializeApp, type App } from "firebase-admin/app";
import { FieldPath, type Firestore, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { SourceDoc } from "../../src/lib/migration/run";

/** Exits with a plain-language message instead of a stack trace when credentials are missing or malformed. */
export function initFirebaseAdmin(options: { storageBucket?: string } = {}): App {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  let credential;
  if (key) {
    try {
      credential = cert(JSON.parse(key));
    } catch {
      console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not a valid service-account JSON (paste the whole file as one line).");
      process.exit(1);
    }
  } else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("No Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local");
    console.error("(Firebase console > Project settings > Service accounts > Generate new private key).");
    process.exit(1);
  }
  return initializeApp({ ...(credential ? { credential } : {}), ...options });
}

export async function* readCollection(fs: Firestore, name: string): AsyncGenerator<SourceDoc> {
  let last: QueryDocumentSnapshot | undefined;
  for (;;) {
    let query = fs.collection(name).orderBy(FieldPath.documentId()).limit(500);
    if (last) query = query.startAfter(last);
    const snap = await query.get();
    if (snap.empty) return;
    for (const doc of snap.docs) yield { id: doc.id, data: doc.data() };
    last = snap.docs[snap.docs.length - 1];
  }
}
