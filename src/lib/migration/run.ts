import {
  mapAuthUser,
  mapExamAttempt,
  mapLessonProgress,
  mapProfile,
  mapReviewState,
  mapStudyPlan,
  mapSubscription,
  mapUserAchievement,
  mapVocabSet,
  supabaseId,
  type CreateUserPayload,
  type FirebaseUserLike,
  type Mapped,
  type ScryptParams,
} from "./firebase-to-supabase";

export interface SourceDoc {
  id: string;
  data: Record<string, unknown>;
}

export interface MigrationSource {
  listAuthUsers(): AsyncIterable<FirebaseUserLike & { createdAt?: string }>;
  readCollection(name: string): AsyncIterable<SourceDoc>;
}

export type CreateUserResult = "created" | "exists" | { error: string };

export interface MigrationTarget {
  createUser(payload: CreateUserPayload): Promise<CreateUserResult>;
  upsert(table: string, rows: Record<string, unknown>[], onConflict: string): Promise<{ error?: string }>;
  count(table: string): Promise<number>;
}

export const PHASES = [
  "auth",
  "profiles",
  "studyPlans",
  "lessonProgress",
  "vocabReviewState",
  "vocabSets",
  "examAttempts",
  "userAchievements",
  "subscriptions",
] as const;
export type Phase = (typeof PHASES)[number];

export interface MigrationOptions {
  apply: boolean;
  only?: ReadonlySet<Phase>;
  /** Migrate only the first N Firebase users (trial run). */
  limit?: number;
  scrypt: ScryptParams | null;
  concurrency?: number;
  batchSize?: number;
}

export interface PhaseReport {
  read: number;
  migrated: number;
  skipped: Record<string, number>;
  failed: number;
}

export interface MigrationReport {
  mode: "dry-run" | "apply";
  auth: {
    firebaseUsers: number;
    eligible: number;
    created: number;
    alreadyExisted: number;
    failed: number;
    passwordHashesCarried: number;
    needPasswordReset: number;
    skipped: Record<string, number>;
  };
  phases: Partial<Record<Phase, PhaseReport>>;
  failures: { phase: string; key: string; error: string }[];
}

interface CollectionSpec {
  phase: Phase;
  collection: string;
  table: string;
  onConflict: string;
  map: (doc: SourceDoc) => Mapped<Record<string, unknown>>;
  userKey: "user_id" | "uid";
  rowKey: (row: Record<string, unknown>) => string;
}

const COLLECTIONS: CollectionSpec[] = [
  { phase: "studyPlans", collection: "studyPlans", table: "study_plans", onConflict: "id", userKey: "user_id", rowKey: (r) => String(r.id), map: (d) => mapStudyPlan(d.id, d.data) },
  { phase: "lessonProgress", collection: "lessonProgress", table: "lesson_progress", onConflict: "user_id,lesson_id", userKey: "user_id", rowKey: (r) => `${r.user_id}|${r.lesson_id}`, map: (d) => mapLessonProgress(d.data) },
  { phase: "vocabReviewState", collection: "vocabReviewState", table: "vocab_review_state", onConflict: "user_id,word_id", userKey: "user_id", rowKey: (r) => `${r.user_id}|${r.word_id}`, map: (d) => mapReviewState(d.data) },
  { phase: "vocabSets", collection: "vocabSets", table: "vocab_sets", onConflict: "id", userKey: "user_id", rowKey: (r) => String(r.id), map: (d) => mapVocabSet(d.id, d.data) },
  { phase: "examAttempts", collection: "examAttempts", table: "exam_attempts", onConflict: "id", userKey: "user_id", rowKey: (r) => String(r.id), map: (d) => mapExamAttempt(d.id, d.data) },
  { phase: "userAchievements", collection: "userAchievements", table: "user_achievements", onConflict: "user_id,achievement_id", userKey: "user_id", rowKey: (r) => `${r.user_id}|${r.achievement_id}`, map: (d) => mapUserAchievement(d.data) },
  { phase: "subscriptions", collection: "subscriptions", table: "subscriptions", onConflict: "user_id", userKey: "user_id", rowKey: (r) => String(r.user_id), map: (d) => mapSubscription(d.id, d.data) },
];

const bump = (counts: Record<string, number>, key: string) => {
  counts[key] = (counts[key] ?? 0) + 1;
};

async function pool<T>(items: T[], size: number, worker: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(size, items.length)) }, async () => {
      while (next < items.length) await worker(items[next++]!);
    }),
  );
}

export async function runMigration(
  source: MigrationSource,
  target: MigrationTarget | null,
  options: MigrationOptions,
  log: (line: string) => void = () => {},
): Promise<MigrationReport> {
  if (options.apply && !target) throw new Error("apply mode needs a target");
  const wants = (phase: Phase) => !options.only || options.only.has(phase);
  const batchSize = options.batchSize ?? 500;

  const report: MigrationReport = {
    mode: options.apply ? "apply" : "dry-run",
    auth: { firebaseUsers: 0, eligible: 0, created: 0, alreadyExisted: 0, failed: 0, passwordHashesCarried: 0, needPasswordReset: 0, skipped: {} },
    phases: {},
    failures: [],
  };
  const fail = (phase: string, key: string, error: string) => {
    if (report.failures.length < 200) report.failures.push({ phase, key, error });
  };

  // ---- Firebase Auth users define the migration set (everything else hangs off it) ----
  const eligible: { fb: FirebaseUserLike & { createdAt?: string }; payload: CreateUserPayload }[] = [];
  const firebaseEmails = new Map<string, { email: string; createdAt?: string }>();
  for await (const fb of source.listAuthUsers()) {
    report.auth.firebaseUsers++;
    if (options.limit !== undefined && eligible.length >= options.limit) continue;
    const mapped = mapAuthUser(fb, options.scrypt);
    if ("skip" in mapped) {
      bump(report.auth.skipped, mapped.skip);
      continue;
    }
    eligible.push({ fb, payload: mapped.row.payload });
    firebaseEmails.set(fb.uid, { email: mapped.row.payload.email, createdAt: fb.createdAt });
    if (mapped.row.payload.password_hash) report.auth.passwordHashesCarried++;
    if (mapped.row.needsPasswordReset) report.auth.needPasswordReset++;
  }
  report.auth.eligible = eligible.length;
  const migratedIds = new Set(eligible.map((u) => u.payload.id));
  log(`auth: ${report.auth.firebaseUsers} Firebase users, ${eligible.length} eligible`);

  if (wants("auth") && options.apply) {
    await pool(eligible, options.concurrency ?? 5, async ({ payload }) => {
      const result = await target!.createUser(payload);
      if (result === "created") report.auth.created++;
      else if (result === "exists") report.auth.alreadyExisted++;
      else {
        report.auth.failed++;
        fail("auth", payload.id, result.error);
      }
    });
    log(`auth: created ${report.auth.created}, existed ${report.auth.alreadyExisted}, failed ${report.auth.failed}`);
  }

  const writeRows = async (phase: Phase, table: string, rows: Record<string, unknown>[], onConflict: string, keyOf: (r: Record<string, unknown>) => string, rep: PhaseReport) => {
    if (rows.length === 0) return;
    if (!options.apply) {
      rep.migrated += rows.length;
      return;
    }
    const res = await target!.upsert(table, rows, onConflict);
    if (!res.error) {
      rep.migrated += rows.length;
      return;
    }
    // One bad row must not sink the batch: retry individually to isolate it.
    for (const row of rows) {
      const single = await target!.upsert(table, [row], onConflict);
      if (single.error) {
        rep.failed++;
        fail(phase, keyOf(row), single.error);
      } else rep.migrated++;
    }
  };

  // ---- profiles (users collection) ----
  if (wants("profiles")) {
    const rep: PhaseReport = { read: 0, migrated: 0, skipped: {}, failed: 0 };
    report.phases.profiles = rep;
    let batch: Record<string, unknown>[] = [];
    const seen = new Set<string>();
    for await (const doc of source.readCollection("users")) {
      rep.read++;
      const info = firebaseEmails.get(doc.id);
      if (!info) {
        bump(rep.skipped, "user not in migration set");
        continue;
      }
      seen.add(doc.id);
      batch.push(mapProfile(doc.id, doc.data, { email: info.email, createdAt: info.createdAt }));
      if (batch.length >= batchSize) {
        await writeRows("profiles", "profiles", batch, "uid", (r) => String(r.uid), rep);
        batch = [];
      }
    }
    await writeRows("profiles", "profiles", batch, "uid", (r) => String(r.uid), rep);
    const missing = eligible.filter((u) => !seen.has(u.fb.uid)).length;
    if (missing > 0) rep.skipped["auth user without a users/ doc (profile comes from sign-up trigger defaults)"] = missing;
    log(`profiles: ${rep.migrated} migrated`);
  }

  // ---- per-user collections ----
  for (const spec of COLLECTIONS) {
    if (!wants(spec.phase)) continue;
    const rep: PhaseReport = { read: 0, migrated: 0, skipped: {}, failed: 0 };
    report.phases[spec.phase] = rep;
    const seen = new Set<string>();
    let batch: Record<string, unknown>[] = [];
    for await (const doc of source.readCollection(spec.collection)) {
      rep.read++;
      const mapped = spec.map(doc);
      if ("skip" in mapped) {
        bump(rep.skipped, mapped.skip);
        continue;
      }
      const row = mapped.row;
      if (!migratedIds.has(String(row[spec.userKey]))) {
        bump(rep.skipped, "user not in migration set");
        continue;
      }
      const key = spec.rowKey(row);
      if (seen.has(key)) {
        bump(rep.skipped, "duplicate (kept first)");
        continue;
      }
      seen.add(key);
      batch.push(row);
      if (batch.length >= batchSize) {
        await writeRows(spec.phase, spec.table, batch, spec.onConflict, spec.rowKey, rep);
        batch = [];
      }
    }
    await writeRows(spec.phase, spec.table, batch, spec.onConflict, spec.rowKey, rep);
    log(`${spec.phase}: ${rep.migrated}/${rep.read} migrated`);
  }

  return report;
}

export { supabaseId };
