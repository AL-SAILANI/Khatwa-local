# Thmanyah font files

Licensed OTF files (free for personal & commercial use,
https://font.thmanyah.com/), all loaded via `next/font/local` in
`src/lib/fonts.ts`. All three faces are dual-script (Arabic + Latin).

Thmanyah is the **official typeface for Arabic** — body text and headings
alike, via the locale-scoped CSS variables in `src/app/globals.css`
(`html[lang="en"]` swaps in Plus Jakarta Sans instead; see that file's
comments for why).

- **Thmanyah Sans** (`--font-sans`) — Arabic body text and UI chrome.
  Weights: Light (300), Regular (400), Medium (500), Bold (700), Black (900).
- **Thmanyah Serif Display** (`--font-serif-display`) — the Arabic headline
  face, applied to every `h1`–`h6`. Weights: Light (300), Regular (400),
  Medium (500), Bold (700), Black (900).
- **Thmanyah Serif Text** (`--font-serif-text`) — long-form reading face.
  Full weight range (300–900) loaded, not yet applied to any component.

If more weights/styles (e.g. italics) arrive later, add matching entries to
the relevant `src` array in `src/lib/fonts.ts`.
