"use client";

import { useEffect, useRef, useState } from "react";

/** Counts down from `durationMinutes` and fires `onExpire` once, exactly
 * when it hits zero (a ref guards against firing twice under React
 * StrictMode's double-invoke in development).
 *
 * Pass a `resetKey` (e.g. the active exam section) to restart the countdown
 * from its full `durationMinutes` whenever it changes — so each section of
 * the exam gets its own fresh timer. */
export function useExamTimer(
  durationMinutes: number,
  onExpire: () => void,
  resetKey: string | null = null,
) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);
  const hasExpiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const resetKeyRef = useRef(resetKey);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (resetKey === resetKeyRef.current) return;
    resetKeyRef.current = resetKey;
    hasExpiredRef.current = false;
    setRemainingSeconds(durationMinutes * 60);
  }, [durationMinutes, resetKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true;
            onExpireRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const label = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { remainingSeconds, label, isRunningLow: remainingSeconds <= 5 * 60 };
}