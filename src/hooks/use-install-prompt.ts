"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "khatwa:install-prompt-dismissed";
const STORAGE_KEY = "khatwa:installable";

/** Safari never fires `beforeinstallprompt`, so iOS can only be offered the
 * manual Share → "Add to Home Screen" route. iPadOS 13+ reports itself as
 * "Macintosh", hence the touch-point check. */
export function detectIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

/** `display-mode: standalone` covers Android and modern iOS; the legacy
 * `navigator.standalone` still answers on older iOS, where the media query
 * does not. */
function detectStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
let dismissed = typeof window !== "undefined" && window.localStorage.getItem(DISMISSED_KEY) === "1";
let installed = detectStandalone();
const isIOSDevice = detectIOS();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return deferredPrompt;
}

function getDismissed() {
  return dismissed;
}

function getInstalled() {
  return installed;
}

export function useInstallPrompt() {
  const prompt = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const isDismissed = useSyncExternalStore(subscribe, getDismissed, () => false);
  const isStandalone = useSyncExternalStore(subscribe, getInstalled, () => false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event as BeforeInstallPromptEvent;
      window.localStorage.setItem(STORAGE_KEY, "1");
      emit();
    };

    const onAppInstalled = () => {
      deferredPrompt = null;
      installed = true;
      window.localStorage.removeItem(STORAGE_KEY);
      emit();
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    dismissed = true;
    window.localStorage.setItem(DISMISSED_KEY, "1");
    emit();
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      deferredPrompt = null;
      installed = true;
      window.localStorage.removeItem(STORAGE_KEY);
      emit();
      return true;
    }
    return false;
  }, []);

  /** For the automatic bottom card only, which interrupts unprompted and so
   * must respect a dismissal. iOS never reaches it (no `beforeinstallprompt`)
   * and doesn't need to — the menu entry covers that platform. */
  const canInstall = !!prompt && !isDismissed && !isStandalone;

  /** For install entries the user goes looking for — the nav menu, settings.
   * Deliberately ignores `dismissed`: that flag means "stop interrupting me",
   * not "never let me install". Gating a menu item on it hid the entry
   * permanently after a single dismissal of the automatic card. */
  const installAvailable = !isStandalone && (!!prompt || isIOSDevice);

  return {
    canInstall,
    installAvailable,
    isIOS: isIOSDevice,
    /** Actually running as an installed app. Callers must not infer this from
     * `!canInstall` — that is also false on iOS, after a dismissal, and on
     * browsers without install support. */
    isStandalone,
    promptInstall,
    dismiss,
  };
}
