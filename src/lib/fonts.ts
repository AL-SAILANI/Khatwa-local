import { Rubik, DM_Serif_Display } from "next/font/google";

/**
 * Brand body typeface — Rubik, a free geometric sans (Google Fonts) that
 * covers both Arabic and Latin. Used for body text in both locales, matching
 * the Little Squirrel theme.
 */
const rubik = Rubik({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * English-locale display typeface. DM Serif Display gives English headings
 * the theme's signature serif voice; it has no Arabic glyphs, so Arabic
 * headings fall back to Rubik (see globals.css).
 */
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-latin",
  display: "swap",
});

export const fontVariables = `${rubik.variable} ${dmSerifDisplay.variable}`;
