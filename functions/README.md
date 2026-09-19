# Cloud Functions (optional — not required)

**This package is no longer required to run Khatwa.** Both of its jobs now
have free-tier equivalents that ship as part of the Next.js app itself:

- Cascade-delete now runs **client-side** as part of `deleteAccount`
  (`src/lib/firebase/auth.ts` → `deleteUserData` in
  `src/lib/firestore/users.ts`), right before the Auth account is removed.
  `firestore.rules` grants owner-delete on `examAttempts`, `lessonProgress`,
  `studyPlans`, `userAchievements`, and `vocabReviewState` specifically so
  this can happen without admin privileges.
- The daily streak reminder now runs as a **Vercel Cron job** hitting
  `src/app/api/cron/streak-reminder`, configured in the repo root's
  `vercel.json`. Uses the same Admin SDK (`src/lib/firebase/admin.ts`)
  already required for other server-only work, so no separate deploy step.

Both free replacements only need the Spark (free) Firebase plan — Firestore's
free tier and the Admin SDK don't require Blaze billing; only Cloud
Functions themselves do.

**One tradeoff of the client-side cascade delete**: a user removed directly
from the Firebase Auth console (bypassing the app's own delete-account
flow) leaves their Firestore documents orphaned, since there's no server
trigger watching for that. `onUserDeleted` below still covers that edge
case if you ever do upgrade to Blaze — kept here as a working, optional
upgrade path, not because it's required.

## What's here

- `onUserDeleted` — Auth trigger. Cascade-deletes `examAttempts`,
  `lessonProgress`, `studyPlans`, `userAchievements`, `vocabReviewState`,
  `publicProfiles`, and the `users` doc whenever an account is removed from
  Firebase Auth — including via the Firebase console, not just the app.
- `sendStreakReminders` — scheduled (daily, 18:00 Asia/Riyadh). Same logic
  as the Vercel Cron route, as a Cloud Scheduler + Cloud Functions
  alternative.

## Deploy (only if you want this instead of the free path above)

Requires a Firebase CLI login with deploy rights on the project (the
service-account-key approach used earlier in this project's setup doesn't
have Cloud Functions permissions — this needs `firebase login` interactively,
or a service account with `Cloud Functions Admin` + `Cloud Scheduler Admin`
+ `Service Account User` roles).

```bash
npm --prefix functions install
firebase deploy --only functions
```

The Blaze (pay-as-you-go) plan is required for Cloud Functions — Spark
(free) projects can't deploy them, and Blaze requires a billing account
(and typically a payment method) even though usage here would stay within
the free-tier quota.
