import { createCipheriv, scryptSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  buildFirebaseScryptHash,
  mapAuthUser,
  mapExamAttempt,
  mapLessonProgress,
  mapProfile,
  mapReviewState,
  mapStudyPlan,
  mapSubscription,
  mapUserAchievement,
  mapVocabSet,
  normalizeBase64,
  supabaseId,
  toIso,
  uuidV5,
} from "./firebase-to-supabase";

const SCRYPT = { signerKey: "c2lnbmVyLWtleQ==", saltSeparator: "c2FsdC1zZXA=", rounds: 8, memCost: 14 };

describe("ids", () => {
  it("matches the RFC 4122 v5 reference vector", () => {
    expect(uuidV5("python.org", "6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe("886313e1-3b8a-5372-9b90-0c9aee199e5d");
  });

  it("is deterministic and separates kinds", () => {
    expect(supabaseId("user", "abc")).toBe(supabaseId("user", "abc"));
    expect(supabaseId("user", "abc")).not.toBe(supabaseId("studyPlan", "abc"));
    expect(supabaseId("user", "abc")).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});

describe("helpers", () => {
  it("converts web-safe base64 to padded standard base64", () => {
    expect(normalizeBase64("ab-_")).toBe("ab+/");
    expect(normalizeBase64("YQ")).toBe("YQ==");
  });

  it("handles strings, Dates, Firestore Timestamps and junk", () => {
    expect(toIso("2026-10-01T10:00:00Z")).toBe("2026-10-01T10:00:00.000Z");
    expect(toIso({ toDate: () => new Date("2026-10-01T10:00:00Z") })).toBe("2026-10-01T10:00:00.000Z");
    expect(toIso({ _seconds: 1790848800 })).toBe("2026-10-01T10:00:00.000Z");
    expect(toIso("not a date")).toBeNull();
    expect(toIso(undefined)).toBeNull();
  });
});

describe("buildFirebaseScryptHash", () => {
  it("produces the format supabase/auth parses", () => {
    const hash = buildFirebaseScryptHash({ passwordHash: "aGFzaA-_", passwordSalt: "c2FsdA" }, SCRYPT)!;
    expect(hash).toBe("$fbscrypt$v=1,n=14,r=8,p=1,ss=c2FsdC1zZXA=,sk=c2lnbmVyLWtleQ==$c2FsdA==$aGFzaA+/");
    expect(hash).toMatch(
      /^\$fbscrypt\$v=(\d+),n=(\d+),r=(\d+),p=(\d+),ss=([^,]+),sk=([^$]+)\$([^$]+)\$(.+)$/,
    );
  });

  it("returns null for missing or malformed input rather than a hash that can't verify", () => {
    expect(buildFirebaseScryptHash({}, SCRYPT)).toBeNull();
    expect(buildFirebaseScryptHash({ passwordHash: "x$y", passwordSalt: "c2FsdA" }, SCRYPT)).toBeNull();
    expect(buildFirebaseScryptHash({ passwordHash: "aGFzaA", passwordSalt: "c2FsdA" }, { ...SCRYPT, memCost: 0 })).toBeNull();
    expect(buildFirebaseScryptHash({ passwordHash: "aGFzaA", passwordSalt: "c2FsdA" }, { ...SCRYPT, signerKey: "###" })).toBeNull();
  });
});

/** Port of supabase/auth internal/crypto/password.go (ParseFirebaseScryptHash +
 * firebaseScrypt), so we can prove the string we build verifies the way GoTrue verifies it. */
function verifyLikeGoTrue(hash: string, password: string): boolean {
  const m = hash.match(/^\$fbscrypt\$v=([0-9]+),n=([0-9]+),r=([0-9]+),p=([0-9]+)(?:,ss=([^,]+))?(?:,sk=([^$]+))?\$([^$]+)\$(.+)$/);
  if (!m) throw new Error("incorrect scrypt hash format");
  const [, , n, r, p, ss, sk, salt, raw] = m;
  const b = (s: string) => Buffer.from(s, "base64");
  const key = scryptSync(password, Buffer.concat([b(salt!), b(ss!)]), 32, { N: 2 ** Number(n), r: Number(r), p: Number(p), maxmem: 2 ** 30 });
  const derived = Buffer.concat([createCipheriv("aes-256-ctr", key, Buffer.alloc(16)).update(b(sk!))]);
  return derived.equals(b(raw!));
}

describe("firebase scrypt interop", () => {
  // Example from Firebase's password-hash documentation, in the web-safe form the Admin SDK returns.
  const webSafe = (s: string) => s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const user = {
    passwordSalt: webSafe("42xEC+ixf3L2lw=="),
    passwordHash: webSafe("lSrfV15cpx95/sZS2W9c9Kp6i/LVgQNDNC/qzrCnh1SAyZvqmZqAjTdn3aoItz+VHjoZilo78198JAdRuid5lQ=="),
  };
  const params = {
    signerKey: "jxspr8Ki0RYycVU8zykbdLGjFQ3McFUH0uiiTvC8pVMXAn210wjLNmdZJzxUECKbm0QsEmYUSDzZvpjeJ9WmXA==",
    saltSeparator: "Bw==",
    rounds: 8,
    memCost: 14,
  };

  it("the built hash verifies the original password and rejects others", () => {
    const hash = buildFirebaseScryptHash(user, params)!;
    expect(verifyLikeGoTrue(hash, "user1password")).toBe(true);
    expect(verifyLikeGoTrue(hash, "wrong-password")).toBe(false);
  });
});

describe("mapAuthUser", () => {
  const base = { uid: "fb1", email: "Ali@Example.com", displayName: "Ali", providerData: [{ providerId: "password" }] };

  it("carries the password hash, admin claim and disabled flag", () => {
    const result = mapAuthUser(
      { ...base, passwordHash: "aGFzaA", passwordSalt: "c2FsdA", customClaims: { admin: true }, disabled: true },
      SCRYPT,
    );
    if (!("row" in result)) throw new Error("expected a row");
    expect(result.row.payload).toMatchObject({
      id: supabaseId("user", "fb1"),
      email: "ali@example.com",
      email_confirm: true,
      app_metadata: { admin: true },
      ban_duration: "876000h",
      user_metadata: { name: "Ali", firebase_uid: "fb1" },
    });
    expect(result.row.payload.password_hash).toContain("$fbscrypt$");
    expect(result.row.needsPasswordReset).toBe(false);
  });

  it("flags password users whose hash could not be carried over", () => {
    const noParams = mapAuthUser({ ...base, passwordHash: "aGFzaA", passwordSalt: "c2FsdA" }, null);
    if (!("row" in noParams)) throw new Error("expected a row");
    expect(noParams.row.payload.password_hash).toBeUndefined();
    expect(noParams.row.needsPasswordReset).toBe(true);
  });

  it("does not demand a reset for Google-only users and skips accounts without email", () => {
    const google = mapAuthUser({ uid: "g1", email: "g@x.com", providerData: [{ providerId: "google.com" }] }, SCRYPT);
    if (!("row" in google)) throw new Error("expected a row");
    expect(google.row.needsPasswordReset).toBe(false);
    expect(mapAuthUser({ uid: "p1" }, SCRYPT)).toEqual({ skip: "no email (phone/anonymous account)" });
  });
});

describe("mapProfile", () => {
  it("sanitises invalid values the schema would reject", () => {
    const row = mapProfile(
      "fb1",
      {
        name: "Ali", goal: 85, gender: "other", level: "expert", planTier: "gold", xp: -5, streak: 3.9,
        examDate: "soon", lastDailyChallengeDate: "2026-10-01", activeStudyPlanId: "plan1",
        createdAt: { _seconds: 1790848800 }, fcmTokens: ["t", 4],
      },
      { email: "Fallback@X.com" },
    );
    expect(row).toMatchObject({
      uid: supabaseId("user", "fb1"), email: "fallback@x.com", goal: null, gender: null, level: null,
      plan_tier: "free", xp: 0, streak: 3, exam_date: null, last_daily_challenge_date: "2026-10-01",
      active_study_plan_id: supabaseId("studyPlan", "plan1"), created_at: "2026-10-01T10:00:00.000Z",
      fcm_tokens: ["t"],
    });
  });

  it("keeps valid values", () => {
    const row = mapProfile("fb1", { goal: 80, gender: "female", level: "advanced", planTier: "premium", lastScore: 71.5 }, { email: "a@x.com" });
    expect(row).toMatchObject({ goal: 80, gender: "female", level: "advanced", plan_tier: "premium", last_score: 71.5 });
  });
});

describe("collection mappers", () => {
  it("study plan: maps ids and rejects incomplete docs", () => {
    const ok = mapStudyPlan("p1", {
      userId: "fb1", durationDays: 60, goal: 80, weeklyHours: 7, startedAt: "2026-09-01T00:00:00Z",
      targetEndAt: "2026-11-01T00:00:00Z", weeklySchedule: [{ dayIndex: 0 }],
    });
    expect(ok).toMatchObject({ row: { id: supabaseId("studyPlan", "p1"), user_id: supabaseId("user", "fb1"), duration_days: 60 } });
    expect(mapStudyPlan("p2", { userId: "fb1" })).toHaveProperty("skip");
  });

  it("lesson progress, review state, achievement: require their keys", () => {
    expect(mapLessonProgress({ userId: "u", lessonId: "l", courseId: "c", completed: true, quizScore: 8 })).toMatchObject({
      row: { lesson_id: "l", course_id: "c", completed: true, quiz_score: 8 },
    });
    expect(mapLessonProgress({ userId: "u" })).toHaveProperty("skip");
    expect(mapReviewState({ userId: "u", wordId: "w", easeFactor: 2.3, dueAt: "2026-10-02T00:00:00Z" })).toMatchObject({
      row: { word_id: "w", ease_factor: 2.3, lapses: 0 },
    });
    expect(mapReviewState({ wordId: "w" })).toHaveProperty("skip");
    expect(mapUserAchievement({ userId: "u", achievementId: "first-exam" })).toMatchObject({ row: { achievement_id: "first-exam" } });
    expect(mapUserAchievement({ userId: "u" })).toHaveProperty("skip");
  });

  it("vocab set and exam attempt", () => {
    expect(mapVocabSet("s1", { userId: "u", name: "Mine", wordIds: ["a", "b"] })).toMatchObject({
      row: { id: supabaseId("vocabSet", "s1"), word_ids: ["a", "b"] },
    });
    const attempt = mapExamAttempt("a1", {
      userId: "u", examId: "mock-1", kind: "mock", status: "submitted", startedAt: "2026-10-01T00:00:00Z",
      submittedAt: "2026-10-01T02:00:00Z", score: 74, answers: { q1: "a" }, flagged: ["q2"], sectionResults: [],
    });
    expect(attempt).toMatchObject({ row: { id: supabaseId("examAttempt", "a1"), score: 74, kind: "mock", answers: { q1: "a" } } });
    expect(mapExamAttempt("a2", { userId: "u", examId: "e", kind: "other", status: "submitted", startedAt: "2026-10-01" })).toEqual({
      skip: "invalid kind/status",
    });
  });

  it("subscription uses the doc id as the user id", () => {
    expect(mapSubscription("fb1", { tier: "pro", status: "active", currentPeriodEnd: "2026-12-01T00:00:00Z" })).toMatchObject({
      row: { user_id: supabaseId("user", "fb1"), tier: "pro", current_period_end: "2026-12-01T00:00:00.000Z" },
    });
    expect(mapSubscription("fb1", { tier: "gold", status: "active" })).toHaveProperty("skip");
  });
});
