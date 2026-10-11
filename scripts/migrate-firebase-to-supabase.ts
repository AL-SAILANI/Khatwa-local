/**
 * Copies existing users and their data from Firebase (Auth + Firestore) to
 * Supabase. Safe by default: without --apply it only reads and reports.
 *
 *   npm run migrate:supabase                       # dry run: counts + problems, writes nothing
 *   npm run migrate:supabase -- --apply --limit=3  # trial: first 3 users only
 *   npm run migrate:supabase -- --apply            # everything
 *   npm run migrate:supabase -- --apply --only=lessonProgress,examAttempts
 *
 * Idempotent: Supabase ids are derived from Firebase ids (UUIDv5), users that
 * already exist are left alone, and rows are upserted, so re-running is safe.
 *
 * Env (.env.local):
 *   FIREBASE_SERVICE_ACCOUNT_KEY   Firebase service-account JSON (one line)
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (needed for --apply)
 *   FIREBASE_SCRYPT_SIGNER_KEY, FIREBASE_SCRYPT_SALT_SEPARATOR,
 *   FIREBASE_SCRYPT_ROUNDS (default 8), FIREBASE_SCRYPT_MEM_COST (default 14)
 *     -> Firebase console > Authentication > Users > ⋮ > "Password hash parameters".
 *        Without these, users are created without passwords and must use
 *        "forgot password" on first login (Google users are unaffected).
 *
 * Prerequisites on the Supabase project: migrations 0001-0003 applied, and
 * Auth > Providers > Email > "Confirm email" turned OFF.
 */
import { writeFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldPath, getFirestore, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { FirebaseUserLike, ScryptParams } from "../src/lib/migration/firebase-to-supabase";
import {
  PHASES,
  runMigration,
  type CreateUserResult,
  type MigrationSource,
  type MigrationTarget,
  type Phase,
} from "../src/lib/migration/run";

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const flagValue = (name: string) => flag(name)?.split("=")[1];

const apply = Boolean(flag("apply"));
const limit = flagValue("limit") ? Number(flagValue("limit")) : undefined;
const reportPath = flagValue("report") ?? "migration-report.json";
const onlyArg = flagValue("only");
const only = onlyArg ? new Set(onlyArg.split(",").map((s) => s.trim()) as Phase[]) : undefined;

if (only && [...only].some((p) => !PHASES.includes(p))) {
  console.error(`Unknown phase in --only. Valid: ${PHASES.join(", ")}`);
  process.exit(1);
}
if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
  console.error("--limit must be a positive integer");
  process.exit(1);
}

// ---- Firebase (read-only) ----
function buildSource(): MigrationSource {
  let credential;
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (key) {
    try {
      credential = cert(JSON.parse(key));
    } catch {
      console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not a valid service-account JSON (paste the whole file as one line).");
      process.exit(1);
    }
  } else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("No Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local");
    console.error("(Firebase console > Project settings > Service accounts > Generate new private key).");
    process.exit(1);
  }

  const app = initializeApp(credential ? { credential } : undefined);
  const fbAuth = getAuth(app);
  const fs = getFirestore(app);

  return {
    async *listAuthUsers() {
      let pageToken: string | undefined;
      do {
        const page = await fbAuth.listUsers(1000, pageToken);
        for (const u of page.users) {
          const created = u.metadata.creationTime ? new Date(u.metadata.creationTime) : null;
          yield {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            disabled: u.disabled,
            passwordHash: u.passwordHash,
            passwordSalt: u.passwordSalt,
            customClaims: u.customClaims,
            providerData: u.providerData.map((p) => ({ providerId: p.providerId })),
            createdAt: created && !Number.isNaN(created.getTime()) ? created.toISOString() : undefined,
          } satisfies FirebaseUserLike & { createdAt?: string };
        }
        pageToken = page.pageToken;
      } while (pageToken);
    },

    async *readCollection(name) {
      let last: QueryDocumentSnapshot | undefined;
      for (;;) {
        let query = fs.collection(name).orderBy(FieldPath.documentId()).limit(500);
        if (last) query = query.startAfter(last);
        const snap = await query.get();
        if (snap.empty) return;
        for (const doc of snap.docs) yield { id: doc.id, data: doc.data() };
        last = snap.docs[snap.docs.length - 1];
      }
    },
  };
}

// ---- Supabase (writes, --apply only) ----
const ALREADY_EXISTS = new Set(["email_exists", "user_already_exists", "id_exists"]);

async function withRetry<T extends { error: { status?: number; message: string } | null }>(run: () => PromiseLike<T>): Promise<T> {
  let result = await run();
  for (let attempt = 1; attempt <= 5 && result.error; attempt++) {
    const status = result.error.status ?? 0;
    if (status !== 0 && status !== 429 && status < 500) break;
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    result = await run();
  }
  return result;
}

function buildTarget(supabase: SupabaseClient): MigrationTarget {
  return {
    async createUser(payload): Promise<CreateUserResult> {
      const { error } = await withRetry(() => supabase.auth.admin.createUser(payload));
      if (!error) return "created";
      const code = (error as { code?: string }).code;
      if (code && ALREADY_EXISTS.has(code)) return "exists";
      return { error: `${code ?? "error"}: ${error.message}` };
    },
    async upsert(table, rows, onConflict) {
      const { error } = await withRetry(() => supabase.from(table).upsert(rows, { onConflict }));
      return error ? { error: error.message } : {};
    },
    async count(table) {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
  };
}

function scryptFromEnv(): ScryptParams | null {
  const signerKey = process.env.FIREBASE_SCRYPT_SIGNER_KEY;
  const saltSeparator = process.env.FIREBASE_SCRYPT_SALT_SEPARATOR;
  if (!signerKey || !saltSeparator) return null;
  return {
    signerKey,
    saltSeparator,
    rounds: Number(process.env.FIREBASE_SCRYPT_ROUNDS ?? 8),
    memCost: Number(process.env.FIREBASE_SCRYPT_MEM_COST ?? 14),
  };
}

async function main() {
  const scrypt = scryptFromEnv();
  console.log(`Mode: ${apply ? "APPLY (writes to Supabase)" : "dry run (read-only)"}`);
  console.log(`Password hashes: ${scrypt ? "will be carried over" : "NOT configured - password users must reset their password"}`);
  if (limit) console.log(`Limit: first ${limit} user(s)`);
  if (only) console.log(`Phases: ${[...only].join(", ")}`);

  let target: MigrationTarget | null = null;
  if (apply) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.error("--apply needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
      process.exit(1);
    }
    console.log(`Target: ${new URL(url).host}`);
    if (!flag("yes")) {
      console.log("Starting in 5 seconds - press Ctrl+C to abort (use --yes to skip this pause).");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    target = buildTarget(createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }));
  }

  const report = await runMigration(buildSource(), target, { apply, only, limit, scrypt }, (line) => console.log(`  ${line}`));

  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${reportPath} (contains ids only, no passwords or emails).`);
  console.log(`Auth: ${JSON.stringify(report.auth)}`);
  for (const [phase, p] of Object.entries(report.phases)) {
    const skipped = Object.entries(p.skipped).map(([reason, n]) => `${n}x ${reason}`).join("; ");
    console.log(`${phase}: read ${p.read}, migrated ${p.migrated}, failed ${p.failed}${skipped ? `, skipped: ${skipped}` : ""}`);
  }

  if (apply && target) {
    console.log("\nRows now in Supabase:");
    for (const table of ["profiles", "study_plans", "lesson_progress", "vocab_review_state", "vocab_sets", "exam_attempts", "user_achievements", "subscriptions"]) {
      console.log(`  ${table}: ${await target.count(table)}`);
    }
  }

  const failed = report.auth.failed + Object.values(report.phases).reduce((n, p) => n + p.failed, 0);
  if (failed > 0) {
    console.error(`\n${failed} item(s) failed - see "failures" in ${reportPath}. Fix and re-run; completed work is not repeated.`);
    process.exit(2);
  }
  if (!apply) console.log("\nDry run only. Re-run with --apply (try --limit=3 first) to write to Supabase.");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Migration failed: ${message}`);
  if (/credential|project id|unauthenticated|permission/i.test(message)) {
    console.error("Check that the Firebase service account belongs to the right project and can read Auth and Firestore.");
  }
  process.exit(1);
});
