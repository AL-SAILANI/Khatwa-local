"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  nightShift: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleNightShift: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "khatwa-theme";
const NIGHT_SHIFT_KEY = "khatwa-night-shift";

/**
 * Runs before hydration via `dangerouslySetInnerHTML` in the root layout to
 * apply the saved/preferred theme class before first paint, avoiding a
 * light/dark flash.
 */
export const themeInitScript = `
(function () {
  try {
    // First visit defaults to light + night shift, deliberately ignoring
    // prefers-color-scheme: the reading-heavy study screens were designed
    // for the warm light palette, and "dark" is a separate mode the learner
    // opts into. Once they pick either one it is stored and wins from then on.
    var stored = localStorage.getItem("${STORAGE_KEY}");
    document.documentElement.classList.toggle("dark", stored === "dark");
    var night = localStorage.getItem("${NIGHT_SHIFT_KEY}");
    document.documentElement.classList.toggle("night-shift", night === null ? true : night === "1");
  } catch (e) {}
})();
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The inline script in the root layout already applies the `.dark` class
  // before hydration, so reading it here (rather than in an effect) keeps
  // this in sync without an extra render.
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );
  const [nightShift, setNightShift] = useState<boolean>(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("night-shift"),
  );

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const next: Theme = isDark ? "light" : "dark";
    setTheme(next);
  }, [setTheme]);

  const toggleNightShift = useCallback(() => {
    const isNight = document.documentElement.classList.contains("night-shift");
    const next = !isNight;
    setNightShift(next);
    document.documentElement.classList.toggle("night-shift", next);
    localStorage.setItem(NIGHT_SHIFT_KEY, next ? "1" : "0");
  }, []);

  const value = useMemo(
    () => ({
      theme,
      nightShift,
      setTheme,
      toggleTheme,
      toggleNightShift,
    }),
    [theme, nightShift, setTheme, toggleTheme, toggleNightShift],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
