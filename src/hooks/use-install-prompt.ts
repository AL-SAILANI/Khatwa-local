"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "khatwa:install-prompt-dismissed";
const STORAGE_KEY = "khatwa:installable";

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
let dismissed = typeof window !== "undefined" && window.localStorage.getItem(DISMISSED_KEY) === "1";
let installed = typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches;

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

  const canInstall = !!prompt && !isDismissed && !isStandalone;

  return { canInstall, promptInstall, dismiss };
}
