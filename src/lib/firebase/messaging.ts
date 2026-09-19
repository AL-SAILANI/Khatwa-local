"use client";

import { getMessaging, getToken, onMessage, isSupported, type Messaging } from "firebase/messaging";
import { firebaseApp } from "./client";

let messagingInstance: Messaging | null = null;

async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return null;
  if (!(await isSupported())) return null;
  if (!messagingInstance) messagingInstance = getMessaging(firebaseApp);
  return messagingInstance;
}

/** Requests notification permission and registers a push token. Returns
 * `null` (no-op, no throw) whenever push isn't configured or supported —
 * missing VAPID key, unsupported browser, or the user denying permission —
 * so callers can treat "no token" as just "notifications stay off." */
export async function requestPushToken(): Promise<string | null> {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.warn(
      "[khatwa] NEXT_PUBLIC_FIREBASE_VAPID_KEY not set — generate a Web Push " +
        "certificate under Project Settings > Cloud Messaging in the Firebase " +
        "console to enable push notifications.",
    );
    return null;
  }

  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  try {
    return await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
  } catch (error) {
    console.error("[khatwa] Failed to get push token:", error);
    return null;
  }
}

/** Foreground push messages don't trigger the service worker's background
 * handler — the page has to show its own UI while it's open and focused. */
export async function listenForForegroundMessages(
  onMessageReceived: (title: string, body: string) => void,
): Promise<() => void> {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    onMessageReceived(payload.notification?.title ?? "خطوة", payload.notification?.body ?? "");
  });
}
