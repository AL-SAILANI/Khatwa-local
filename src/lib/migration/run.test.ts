import { describe, expect, it } from "vitest";
import { supabaseId } from "./firebase-to-supabase";
import {
  runMigration,
  type CreateUserResult,
  type MigrationSource,
  type MigrationTarget,
  type SourceDoc,
} from "./run";

const SCRYPT = { signerKey: "c2lnbmVy", saltSeparator: "c2VwYQ==", rounds: 8, memCost: 14 };

function fakeSource(): MigrationSource {
  const collections: Record<string, SourceDoc[]> = {
    users: [
      { id: "u1", data: { name: "Ali", xp: 120, goal: 80, planTier: "pro" } },
      { id: "ghost", data: { name: "Not in auth" } },
    ],
    lessonProgress: [
      { id: "u1_l1", data: { userId: "u1", lessonId: "l1", courseId: "c1", completed: true } },
      { id: "dup", data: { userId: "u1", lessonId: "l1", courseId: "c1", completed: false } },
      { id: "orphan", data: { userId: "ghost", lessonId: "l1", courseId: "c1" } },
      { id: "bad", data: { userId: "u1" } },
    ],
    userAchievements: [{ id: "a", data: { userId: "u2", achievementId: "first-exam" } }],
    examAttempts: [
      { id: "e1", data: { userId: "u1", examId: "m", kind: "mock", status: "submitted", startedAt: "2026-10-01T00:00:00Z" } },
    ],
  };
  return {
    async *listAuthUsers() {
      yield { uid: "u1", email: "ali@x.com", providerData: [{ providerId: "password" }], passwordHash: "aGFzaA", passwordSalt: "c2FsdA" };
      yield { uid: "u2", email: "sara@x.com", providerData: [{ providerId: "google.com" }] };
      yield { uid: "phone1" };
    },
    async *readCollection(name) {
      for (const doc of collections[name] ?? []) yield doc;
    },
  };
}

function fakeTarget(opts: { existing?: Set<string>; badTable?: string } = {}) {
  const writes: { table: string; rows: Record<string, unknown>[] }[] = [];
  const created: string[] = [];
  const target: MigrationTarget = {
    async createUser(payload): Promise<CreateUserResult> {
      if (opts.existing?.has(payload.id)) return "exists";
      created.push(payload.id);
      return "created";
    },
    async upsert(table, rows) {
      if (opts.badTable === table && rows.length > 1) return { error: "batch rejected" };
      if (opts.badTable === table && rows[0]?.lesson_id === "l1") return { error: "bad row" };
      writes.push({ table, rows });
      return {};
    },
    async count() {
      return 0;
    },
  };
  return { target, writes, created };
}

describe("runMigration", () => {
  it("dry-run reads and validates everything but writes nothing", async () => {
    const { target, writes, created } = fakeTarget();
    const report = await runMigration(fakeSource(), target, { apply: false, scrypt: SCRYPT });
    expect(writes).toHaveLength(0);
    expect(created).toHaveLength(0);
    expect(report.mode).toBe("dry-run");
    expect(report.auth).toMatchObject({ firebaseUsers: 3, eligible: 2, passwordHashesCarried: 1, needPasswordReset: 0 });
    expect(report.auth.skipped).toEqual({ "no email (phone/anonymous account)": 1 });
    expect(report.phases.lessonProgress).toMatchObject({ read: 4, migrated: 1 });
  });

  it("apply creates users then writes only rows that belong to migrated users", async () => {
    const { target, writes, created } = fakeTarget();
    const report = await runMigration(fakeSource(), target, { apply: true, scrypt: SCRYPT });
    expect(created.sort()).toEqual([supabaseId("user", "u1"), supabaseId("user", "u2")].sort());
    expect(report.auth).toMatchObject({ created: 2, failed: 0 });

    const profiles = writes.find((w) => w.table === "profiles")!.rows;
    expect(profiles).toHaveLength(1);
    expect(profiles[0]).toMatchObject({ uid: supabaseId("user", "u1"), email: "ali@x.com", xp: 120, plan_tier: "pro" });
    expect(report.phases.profiles!.skipped["user not in migration set"]).toBe(1);

    const progress = writes.find((w) => w.table === "lesson_progress")!.rows;
    expect(progress).toHaveLength(1);
    expect(progress[0]).toMatchObject({ user_id: supabaseId("user", "u1"), lesson_id: "l1", completed: true });
    expect(report.phases.lessonProgress!.skipped).toMatchObject({
      "duplicate (kept first)": 1,
      "user not in migration set": 1,
      "missing userId/lessonId/courseId": 1,
    });
    expect(writes.find((w) => w.table === "exam_attempts")!.rows[0]).toMatchObject({ id: supabaseId("examAttempt", "e1") });
    expect(writes.find((w) => w.table === "user_achievements")!.rows[0]).toMatchObject({ user_id: supabaseId("user", "u2") });
  });

  it("is safe to re-run: users that already exist are counted, not failed", async () => {
    const existing = new Set([supabaseId("user", "u1")]);
    const { target } = fakeTarget({ existing });
    const report = await runMigration(fakeSource(), target, { apply: true, scrypt: SCRYPT });
    expect(report.auth).toMatchObject({ created: 1, alreadyExisted: 1, failed: 0 });
  });

  it("isolates a failing row instead of losing the whole batch", async () => {
    const source = fakeSource();
    const original = source.readCollection.bind(source);
    source.readCollection = async function* (name) {
      yield* original(name);
      if (name === "lessonProgress") {
        yield { id: "ok", data: { userId: "u2", lessonId: "l2", courseId: "c1" } };
      }
    };
    const { target, writes } = fakeTarget({ badTable: "lesson_progress" });
    const report = await runMigration(source, target, { apply: true, scrypt: SCRYPT });
    expect(report.phases.lessonProgress).toMatchObject({ migrated: 1, failed: 1 });
    expect(writes.find((w) => w.table === "lesson_progress")!.rows[0]).toMatchObject({ lesson_id: "l2" });
    expect(report.failures[0]).toMatchObject({ phase: "lessonProgress", error: "bad row" });
  });

  it("--limit restricts the migration set and everything that hangs off it", async () => {
    const { target, created } = fakeTarget();
    const report = await runMigration(fakeSource(), target, { apply: true, limit: 1, scrypt: SCRYPT });
    expect(created).toEqual([supabaseId("user", "u1")]);
    expect(report.phases.userAchievements!.skipped["user not in migration set"]).toBe(1);
  });

  it("--only restricts phases", async () => {
    const { target, writes } = fakeTarget();
    const report = await runMigration(fakeSource(), target, { apply: true, only: new Set(["lessonProgress"]), scrypt: SCRYPT });
    expect(writes.map((w) => w.table)).toEqual(["lesson_progress"]);
    expect(report.phases.profiles).toBeUndefined();
    expect(report.auth.created).toBe(0);
  });

  it("without scrypt params, password users are flagged for a reset", async () => {
    const report = await runMigration(fakeSource(), null, { apply: false, scrypt: null });
    expect(report.auth).toMatchObject({ passwordHashesCarried: 0, needPasswordReset: 1 });
  });
});
