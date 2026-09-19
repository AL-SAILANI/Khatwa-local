import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const hasRealConfig = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

if (!hasRealConfig && typeof window !== "undefined") {
  console.warn(
    "[khatwa] NEXT_PUBLIC_FIREBASE_* env vars are not set — Firebase calls will fail. " +
      "Copy .env.example to .env.local and fill in your project config.",
  );
}

/**
 * Falls back to a syntactically-valid placeholder so `initializeApp`/`getAuth`
 * don't throw at import time when env vars are absent (e.g. a fresh clone
 * before `.env.local` is configured, or a CI build/lint/typecheck run with
 * no secrets). Any *actual* Firebase call still fails clearly at call time.
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyDPlaceholder00000000000000000",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "placeholder.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "placeholder",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "placeholder.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:000000000000:web:0000000000000000000000",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

/**
 * Points the client SDKs at the local Firebase emulator suite instead of a
 * real project — used by CI's Playwright smoke tests (see
 * `.github/workflows/ci.yml`) so they don't need real project secrets.
 * Guarded by a global flag because `connect*Emulator` throws if called more
 * than once (e.g. on Fast Refresh in dev).
 */
declare global {
  var __khatwaEmulatorConnected: boolean | undefined;
}

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" && !globalThis.__khatwaEmulatorConnected) {
  globalThis.__khatwaEmulatorConnected = true;
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}

/**
 * Firebase Analytics only runs in the browser and only when supported
 * (it depends on IndexedDB/cookies, so it's a no-op during SSR and in
 * unsupported environments like private browsing).
 */
export async function getAnalyticsIfSupported() {
  if (typeof window === "undefined" || !hasRealConfig) return null;
  const { isSupported, getAnalytics } = await import("firebase/analytics");
  return (await isSupported()) ? getAnalytics(firebaseApp) : null;
}
