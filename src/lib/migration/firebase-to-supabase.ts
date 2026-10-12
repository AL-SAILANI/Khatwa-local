/**
 * Pure transforms used by scripts/migrate-firebase-to-supabase.ts. Kept free of
 * Firebase/Supabase clients so every mapping can be unit-tested.
 */
import { createHash } from "node:crypto";

type Doc = Record<string, unknown>;
export type Mapped<T> = { row: T } | { skip: string };

// ---------- ids ----------

/** Fixed namespace: the same Firebase id always maps to the same Supabase uuid,
 * which makes the migration idempotent and needs no id-mapping table. */
export const KHATWA_NAMESPACE = "6f1c3a52-7b1d-4e6a-9c58-2d4f8a1b9e30";

export function uuidV5(name: string, namespace: string = KHATWA_NAMESPACE): string {
  const ns = Buffer.from(namespace.replace(/-/g, ""), "hex");
  const hash = createHash("sha1").update(ns).update(name, "utf8").digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x50;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export type IdKind = "user" | "studyPlan" | "vocabSet" | "examAttempt";
export const supabaseId = (kind: IdKind, firebaseId: string) => uuidV5(`${kind}:${firebaseId}`);

// ---------- value helpers ----------

export function toIso(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.toISOString();
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (typeof value === "object") {
    const v = value as { toDate?: () => Date; seconds?: number; _seconds?: number };
    if (typeof v.toDate === "function") return toIso(v.toDate());
    const seconds = v.seconds ?? v._seconds;
    if (typeof seconds === "number") return new Date(seconds * 1000).toISOString();
  }
  return null;
}

const toDateOnly = (value: unknown): string | null =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) ? value : null;

const toNum = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const toStr = (value: unknown): string | null => (typeof value === "string" && value !== "" ? value : null);

const toStrArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

const oneOf = <T extends string | number>(value: unknown, allowed: readonly T[]): T | null =>
  allowed.includes(value as T) ? (value as T) : null;

/** Firebase hands out web-safe base64 (no padding); Supabase wants standard base64. */
export function normalizeBase64(input: string): string {
  const std = input.trim().replace(/-/g, "+").replace(/_/g, "/");
  return std + "=".repeat((4 - (std.length % 4)) % 4);
}

const isBase64 = (s: string) => /^[A-Za-z0-9+/]+={0,2}$/.test(s);

// ---------- Firebase Auth user -> Supabase auth user ----------

export interface ScryptParams {
  signerKey: string;
  saltSeparator: string;
  rounds: number;
  memCost: number;
}

/** `$fbscrypt$v=1,n=<memCost>,r=<rounds>,p=1,ss=<sep>,sk=<key>$<salt>$<hash>`
 * as parsed by supabase/auth (internal/crypto/password.go). Returns null when
 * the user has no password or any piece is malformed, so the caller can fall
 * back to a password-reset instead of importing a hash that can never verify. */
export function buildFirebaseScryptHash(
  user: { passwordHash?: string; passwordSalt?: string },
  params: ScryptParams,
): string | null {
  if (!user.passwordHash || !user.passwordSalt) return null;
  const sk = normalizeBase64(params.signerKey);
  const ss = normalizeBase64(params.saltSeparator);
  const hash = normalizeBase64(user.passwordHash);
  const salt = normalizeBase64(user.passwordSalt);
  if (![sk, ss, hash, salt].every(isBase64)) return null;
  if (!Number.isInteger(params.rounds) || !Number.isInteger(params.memCost) || params.rounds < 1 || params.memCost < 1) {
    return null;
  }
  return `$fbscrypt$v=1,n=${params.memCost},r=${params.rounds},p=1,ss=${ss},sk=${sk}$${salt}$${hash}`;
}

export interface FirebaseUserLike {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled?: boolean;
  passwordHash?: string;
  passwordSalt?: string;
  customClaims?: Record<string, unknown>;
  providerData?: { providerId: string }[];
}

export interface CreateUserPayload {
  id: string;
  email: string;
  email_confirm: true;
  password_hash?: string;
  user_metadata: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  ban_duration?: string;
}

export interface AuthUserMapping {
  payload: CreateUserPayload;
  /** Signs in with email+password in Firebase but we could not carry the hash over. */
  needsPasswordReset: boolean;
}

export function mapAuthUser(user: FirebaseUserLike, scrypt: ScryptParams | null): Mapped<AuthUserMapping> {
  if (!user.email) return { skip: "no email (phone/anonymous account)" };

  const hasPasswordProvider = (user.providerData ?? []).some((p) => p.providerId === "password");
  const passwordHash = scrypt ? buildFirebaseScryptHash(user, scrypt) : null;

  const payload: CreateUserPayload = {
    id: supabaseId("user", user.uid),
    email: user.email.trim().toLowerCase(),
    email_confirm: true,
    user_metadata: {
      name: user.displayName ?? "",
      ...(user.photoURL ? { photo_url: user.photoURL } : {}),
      firebase_uid: user.uid,
    },
    ...(passwordHash ? { password_hash: passwordHash } : {}),
    ...(user.customClaims?.admin === true ? { app_metadata: { admin: true } } : {}),
    ...(user.disabled ? { ban_duration: "876000h" } : {}),
  };

  return { row: { payload, needsPasswordReset: hasPasswordProvider && !passwordHash } };
}

// ---------- Firestore docs -> Supabase rows ----------

const GOALS = [60, 70, 80, 90, 95] as const;
const GENDERS = ["male", "female"] as const;
const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TIERS = ["free", "pro", "premium"] as const;
const SUB_STATUSES = ["active", "canceled", "past_due"] as const;
const ATTEMPT_KINDS = ["placement", "mock"] as const;
const ATTEMPT_STATUSES = ["in_progress", "submitted"] as const;

export function mapProfile(uid: string, doc: Doc, fallback: { email: string; createdAt?: string | null }): Record<string, unknown> {
  const planId = toStr(doc.activeStudyPlanId);
  return {
    uid: supabaseId("user", uid),
    email: (toStr(doc.email) ?? fallback.email).trim().toLowerCase(),
    name: toStr(doc.name) ?? "",
    photo_url: toStr(doc.photoURL),
    avatar_emoji: toStr(doc.avatarEmoji),
    age: toNum(doc.age) !== null ? Math.trunc(doc.age as number) : null,
    gender: oneOf(doc.gender, GENDERS),
    goal: oneOf(doc.goal, GOALS),
    level: oneOf(doc.level, LEVELS),
    xp: Math.max(0, Math.trunc(toNum(doc.xp) ?? 0)),
    coins: Math.max(0, Math.trunc(toNum(doc.coins) ?? 0)),
    streak: Math.max(0, Math.trunc(toNum(doc.streak) ?? 0)),
    last_active_at: toIso(doc.lastActiveAt),
    recent_activity_days: toStrArray(doc.recentActivityDays),
    plan_tier: oneOf(doc.planTier, TIERS) ?? "free",
    active_study_plan_id: planId ? supabaseId("studyPlan", planId) : null,
    notifications_enabled: doc.notificationsEnabled === true,
    last_daily_challenge_date: toDateOnly(doc.lastDailyChallengeDate),
    daily_challenges_completed: Math.max(0, Math.trunc(toNum(doc.dailyChallengesCompleted) ?? 0)),
    exam_date: toDateOnly(doc.examDate),
    fcm_tokens: toStrArray(doc.fcmTokens),
    stripe_customer_id: toStr(doc.stripeCustomerId),
    study_hours: Math.max(0, toNum(doc.studyHours) ?? 0),
    tests_taken: Math.max(0, Math.trunc(toNum(doc.testsTaken) ?? 0)),
    last_score: toNum(doc.lastScore),
    completion_percent: toNum(doc.completionPercent) ?? 0,
    created_at: toIso(doc.createdAt) ?? fallback.createdAt ?? new Date().toISOString(),
  };
}

export function mapStudyPlan(docId: string, doc: Doc): Mapped<Record<string, unknown>> {
  const userId = toStr(doc.userId);
  const startedAt = toIso(doc.startedAt);
  const targetEndAt = toIso(doc.targetEndAt);
  const durationDays = toNum(doc.durationDays);
  const goal = toNum(doc.goal);
  const weeklyHours = toNum(doc.weeklyHours);
  if (!userId) return { skip: "missing userId" };
  if (!startedAt || !targetEndAt) return { skip: "missing start/end date" };
  if (durationDays === null || goal === null || weeklyHours === null) return { skip: "missing plan numbers" };
  return {
    row: {
      id: supabaseId("studyPlan", docId),
      user_id: supabaseId("user", userId),
      duration_days: durationDays,
      goal,
      weekly_hours: weeklyHours,
      started_at: startedAt,
      target_end_at: targetEndAt,
      weekly_schedule: Array.isArray(doc.weeklySchedule) ? doc.weeklySchedule : [],
    },
  };
}

export function mapLessonProgress(doc: Doc): Mapped<Record<string, unknown>> {
  const userId = toStr(doc.userId);
  const lessonId = toStr(doc.lessonId);
  const courseId = toStr(doc.courseId);
  if (!userId || !lessonId || !courseId) return { skip: "missing userId/lessonId/courseId" };
  return {
    row: {
      user_id: supabaseId("user", userId),
      lesson_id: lessonId,
      course_id: courseId,
      completed: doc.completed === true,
      quiz_score: toNum(doc.quizScore),
      last_position: toNum(doc.lastPosition) ?? 0,
      updated_at: toIso(doc.updatedAt) ?? new Date().toISOString(),
    },
  };
}

export function mapReviewState(doc: Doc): Mapped<Record<string, unknown>> {
  const userId = toStr(doc.userId);
  const wordId = toStr(doc.wordId);
  if (!userId || !wordId) return { skip: "missing userId/wordId" };
  return {
    row: {
      user_id: supabaseId("user", userId),
      word_id: wordId,
      ease_factor: toNum(doc.easeFactor) ?? 2.5,
      interval_days: Math.trunc(toNum(doc.intervalDays) ?? 0),
      repetitions: Math.trunc(toNum(doc.repetitions) ?? 0),
      due_at: toIso(doc.dueAt) ?? new Date().toISOString(),
      bookmarked: doc.bookmarked === true,
      last_reviewed_at: toIso(doc.lastReviewedAt),
      lapses: Math.trunc(toNum(doc.lapses) ?? 0),
      review_count: Math.trunc(toNum(doc.reviewCount) ?? 0),
    },
  };
}

export function mapVocabSet(docId: string, doc: Doc): Mapped<Record<string, unknown>> {
  const userId = toStr(doc.userId);
  const name = toStr(doc.name);
  if (!userId || !name) return { skip: "missing userId/name" };
  return {
    row: {
      id: supabaseId("vocabSet", docId),
      user_id: supabaseId("user", userId),
      name,
      word_ids: toStrArray(doc.wordIds),
      created_at: toIso(doc.createdAt) ?? new Date().toISOString(),
    },
  };
}

export function mapExamAttempt(docId: string, doc: Doc): Mapped<Record<string, unknown>> {
  const userId = toStr(doc.userId);
  const examId = toStr(doc.examId);
  const kind = oneOf(doc.kind, ATTEMPT_KINDS);
  const status = oneOf(doc.status, ATTEMPT_STATUSES);
  const startedAt = toIso(doc.startedAt);
  if (!userId || !examId) return { skip: "missing userId/examId" };
  if (!kind || !status) return { skip: "invalid kind/status" };
  if (!startedAt) return { skip: "missing startedAt" };
  return {
    row: {
      id: supabaseId("examAttempt", docId),
      user_id: supabaseId("user", userId),
      exam_id: examId,
      kind,
      status,
      answers: doc.answers && typeof doc.answers === "object" ? doc.answers : {},
      flagged: toStrArray(doc.flagged),
      started_at: startedAt,
      submitted_at: toIso(doc.submittedAt),
      score: toNum(doc.score),
      section_results: Array.isArray(doc.sectionResults) ? doc.sectionResults : [],
      weak_skills: toStrArray(doc.weakSkills),
      new_words: toStrArray(doc.newWords),
      recommendations: toStrArray(doc.recommendations),
    },
  };
}

export function mapUserAchievement(doc: Doc): Mapped<Record<string, unknown>> {
  const userId = toStr(doc.userId);
  const achievementId = toStr(doc.achievementId);
  if (!userId || !achievementId) return { skip: "missing userId/achievementId" };
  return {
    row: {
      user_id: supabaseId("user", userId),
      achievement_id: achievementId,
      unlocked_at: toIso(doc.unlockedAt) ?? new Date().toISOString(),
    },
  };
}

/** `subscriptions/{userId}`: the doc id is the user id. */
export function mapSubscription(docId: string, doc: Doc): Mapped<Record<string, unknown>> {
  const tier = oneOf(doc.tier, TIERS);
  const status = oneOf(doc.status, SUB_STATUSES);
  if (!tier || !status) return { skip: "invalid tier/status" };
  return {
    row: {
      user_id: supabaseId("user", docId),
      tier,
      status,
      current_period_end: toIso(doc.currentPeriodEnd),
    },
  };
}
