# خطوة (Khatwa)

منصة تعليمية عربية للاستعداد لاختبار STEP — خطة دراسية ذكية، اختبارات
تجريبية مطابقة لتوزيع STEP الفعلي، تحليلات أداء تفصيلية، ونظام مفردات
بالتكرار المتباعد.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19.2)
- **TypeScript**, **Tailwind CSS v4** (CSS-based design tokens, class-based dark mode)
- **Firebase**: Auth, Firestore, Storage, App Hosting
- **next-intl**: Arabic (default, RTL) with English scaffolded for later
- **motion** (Framer Motion successor) for animation
- **react-hook-form + zod** for forms/validation

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Firebase project config
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The default locale is
Arabic (`/`), English is available at `/en`.

### Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password + Google providers), **Firestore**,
   and **Storage**.
3. Copy the web app config into `.env.local` (see `.env.example`).
4. Log in locally and point the CLI at your project:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add
   ```
5. Deploy security rules and indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
6. For production hosting, deploy via **Firebase App Hosting** (`apphosting.yaml`
   is already configured) — connect the GitHub repo in the Firebase console,
   or run `firebase init apphosting`.
7. Cascade-delete on account removal and the daily streak-reminder push both run for free without
   Cloud Functions: cascade-delete happens client-side (`src/lib/firestore/users.ts`), and the
   streak reminder is a Vercel Cron job (`vercel.json`) hitting `src/app/api/cron/streak-reminder`
   — set `CRON_SECRET` in the Vercel project's env vars to lock that endpoint down. (Cron jobs are
   Vercel-specific; this only fires if the app is actually deployed there.) A Cloud Functions
   version of both still exists in `functions/` as an optional upgrade path — see
   `functions/README.md` — but it requires the paid Blaze plan and isn't needed to run the app.
8. Optional env vars for features that gracefully no-op without them:
   `NEXT_PUBLIC_FIREBASE_VAPID_KEY` (push notifications) and `STRIPE_SECRET_KEY` /
   `STRIPE_WEBHOOK_SECRET` / `STRIPE_PRICE_ID_PRO` / `STRIPE_PRICE_ID_PREMIUM`
   (subscription checkout) — see `.env.example`.

### Emulators (optional, for local development without touching prod data)

```bash
firebase emulators:start
```

### Seeding sample content

The mock exam / placement test engine needs question-bank content to run
against. `src/data/sample-questions.ts` has a small original seed set
(grammar, reading, listening, writing-analysis) — enough to exercise the
whole flow, nowhere near the ~100 questions a real mock exam needs (see
`ROADMAP.md`, admin CMS). Push it to Firestore with:

```bash
# against the emulator
FIRESTORE_EMULATOR_HOST=localhost:8080 npm run seed

# against a real project (needs FIREBASE_SERVICE_ACCOUNT_KEY in .env.local)
npm run seed
```

### Admin access

`/admin` (dashboard stats, user plan management, course/lesson authoring,
question bank) is gated on an `admin` custom claim, which only the Admin
SDK can set — there's no in-app way to promote a user, by design:

```bash
npm run set-admin -- someone@example.com
```

The affected user needs to sign out and back in before the claim takes effect.

## Project structure

```
src/
  app/[locale]/            App Router pages, one segment per locale
    (auth)/                 login, register, forgot-password
    (app)/                  authenticated shell: dashboard, courses, ...
  components/
    ui/                      atomic primitives (Button, Card, Input, Badge)
    layout/                  Navbar, Footer
    landing/                 marketing page sections
    auth/                    login/register/forgot-password forms
    dashboard/               dashboard widgets
    app-shell/               sidebar, topbar, auth guard
    brand/                   logo, icons
    motion/                  scroll-reveal animation primitives
  lib/
    firebase/                client SDK, admin SDK, auth helpers, error messages
    validation/              zod schemas
    constants/                STEP exam shape (sections, weights, question counts)
  types/                     Firestore data model (User, Course, Question, Exam, ...)
  i18n/                      next-intl routing/navigation config
messages/                    ar.json (complete), en.json (same keys — only the landing
                              page, navbar/footer, and auth forms actually use them; see
                              ROADMAP.md "Known gaps")
functions/                   Optional Cloud Functions alternative to the free client-side
                              cascade-delete + Vercel Cron streak reminder (needs Blaze plan)
e2e/                         Playwright smoke tests (run against the Firebase emulator)
firestore.rules / storage.rules / firestore.indexes.json
```

See `ROADMAP.md` for what's built vs. what's next.

## Fonts

Typography is locale-dependent, set via CSS variables scoped to
`html[lang]` in `src/app/globals.css` (`src/lib/fonts.ts` loads the actual
font files):

- **Arabic (default)** — **خط ثمانية (Thmanyah)**, free for personal/
  commercial use at [font.thmanyah.com](https://font.thmanyah.com/), is the
  official typeface: Thmanyah Sans (`--font-sans`) for body text/UI chrome,
  Thmanyah Serif Display (`--font-serif-display`) for every heading
  (`h1`–`h6`, applied via a global rule).
- **English** — Plus Jakarta Sans (Google Fonts, `--font-latin`) for both
  body text and headings, chosen as a free, openly-licensed approximation
  of a bold rounded geometric sans. (Some reference screenshots for this
  project's visual direction used EF SET's site, whose actual font is a
  proprietary webfont licensed to EF and served from their own CDN — it
  isn't reusable here, hence the substitute.)

See `public/fonts/thmanyah/README.md` for the full weight/file breakdown.

A third face, **Thmanyah Serif Text** (`--font-serif-text`), is loaded for
future long-form reading use but not yet applied anywhere.

## Scripts

```bash
npm run dev       # start dev server (Turbopack)
npm run build     # production build
npm run start     # run the production build
npm run lint      # eslint
npm run seed      # push sample-data seed content to Firestore
npm run set-admin # grant the admin custom claim to a user by email
npm run test:e2e  # Playwright smoke tests (see e2e/, needs Firebase emulators running)
```
