<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Khatwa (خطوة)

STEP exam prep platform. See `README.md` for setup and folder structure,
`ROADMAP.md` for what's built vs. what's next before touching a feature area.

Key conventions already established — follow them rather than reintroducing
alternatives:

- All routes live under `src/app/[locale]/`; every page/layout that isn't
  purely presentational calls `setRequestLocale(locale)`.
- Use the `Link`/`useRouter`/`usePathname` exports from `@/i18n/navigation`,
  never `next/link` or `next/navigation` directly, so locale-aware routing
  keeps working.
- Client-only Firebase calls go through `@/lib/firebase/client`; anything
  needing elevated privilege goes through `@/lib/firebase/admin` (has
  `server-only` guard — never import it from a Client Component).
- Design tokens (colors, dark mode variant, fonts) live in
  `src/app/globals.css` as Tailwind v4 `@theme` — extend there, don't
  hardcode hex values in components.
- Arabic is the default locale and the only fully-translated one; every new
  user-facing string goes in `messages/ar.json` first, with a matching key
  added to `messages/en.json` (English content can lag, but the key must
  exist or `next-intl` throws).
- **STEP content authority**: the `step-prep-curriculum` skill
  (`.opencode/skills/step-prep-curriculum/SKILL.md`) is the authoritative
  reference for exam structure, the ASMA reading technique, the AGDA grammar
  technique, grammar rules, expected reading/listening topics, and the
  top-600 vocabulary. Load it whenever generating or validating questions,
  lessons, passages, or learning paths, and keep generated content aligned
  with it (e.g., 40% reading / 30% grammar / 20% listening / 10% writing).
