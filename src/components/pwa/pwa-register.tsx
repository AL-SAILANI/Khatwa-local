"use client";

import { useEffect } from "react";

/** Registers the offline-shell service worker. Skipped outside production
 * so dev's HMR/asset churn never gets cached. */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  }, []);

  return null;
}
