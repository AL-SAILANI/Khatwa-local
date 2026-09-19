import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { getStorage } from "firebase-admin/storage";

/**
 * Server-only Firebase Admin SDK, for use in Server Actions, Route Handlers,
 * and Cloud Functions. Never import this from a Client Component — the
 * `server-only` import above makes that a build error.
 */
function getAdminApp(): App {
  if (getApps().length) return getApps()[0]!;

  // On Firebase App Hosting / Cloud Functions, Application Default
  // Credentials are picked up automatically with no env vars needed.
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  return initializeApp({
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export const adminMessaging = getMessaging(adminApp);
