import { getSupabase } from "@/lib/supabase/client";
import type { LessonProgress } from "@/types/course";
import type { ExamAttempt } from "@/types/exam";
import type { StudyPlan, UserAchievement } from "@/types/gamification";
import type { UserProfile } from "@/types/user";
import type { VocabReviewState, VocabSet } from "@/types/vocabulary";
import type { PublicProfile } from "@/lib/firestore/public-profiles";

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const db = () => getSupabase();
const opt = <T>(v: T | null | undefined): T | undefined => (v == null ? undefined : v);
const numOrNull = (v: unknown) => (v == null ? null : Number(v));

function check<T>(result: { data: T; error: { message: string; code?: string } | null }): T {
  if (result.error) throw new Error(`Supabase: ${result.error.message}`);
  return result.data;
}

function checkOne<T>(result: { data: T; error: { message: string; code?: string } | null }): NonNullable<T> {
  const data = check(result);
  if (data == null) throw new Error("Supabase: no row returned");
  return data;
}

// ---------- mappers ----------

export const toUserProfile = (r: Row): UserProfile => ({
  uid: r.uid,
  name: r.name,
  email: r.email,
  photoURL: opt(r.photo_url),
  avatarEmoji: r.avatar_emoji ?? null,
  age: r.age ?? null,
  gender: r.gender ?? null,
  goal: r.goal ?? null,
  level: r.level ?? null,
  xp: r.xp,
  coins: r.coins,
  streak: r.streak,
  lastActiveAt: r.last_active_at ?? null,
  recentActivityDays: r.recent_activity_days ?? [],
  planTier: r.plan_tier,
  activeStudyPlanId: r.active_study_plan_id ?? null,
  notificationsEnabled: r.notifications_enabled,
  lastDailyChallengeDate: opt(r.last_daily_challenge_date),
  dailyChallengesCompleted: r.daily_challenges_completed,
  examDate: r.exam_date ?? null,
  fcmTokens: r.fcm_tokens ?? [],
  stripeCustomerId: opt(r.stripe_customer_id),
  studyHours: Number(r.study_hours),
  testsTaken: r.tests_taken,
  lastScore: numOrNull(r.last_score),
  completionPercent: Number(r.completion_percent),
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const PROFILE_COLUMNS: Partial<Record<keyof UserProfile, string>> = {
  name: "name",
  photoURL: "photo_url",
  avatarEmoji: "avatar_emoji",
  age: "age",
  gender: "gender",
  goal: "goal",
  level: "level",
  xp: "xp",
  coins: "coins",
  streak: "streak",
  lastActiveAt: "last_active_at",
  recentActivityDays: "recent_activity_days",
  planTier: "plan_tier",
  activeStudyPlanId: "active_study_plan_id",
  notificationsEnabled: "notifications_enabled",
  lastDailyChallengeDate: "last_daily_challenge_date",
  dailyChallengesCompleted: "daily_challenges_completed",
  examDate: "exam_date",
  fcmTokens: "fcm_tokens",
  stripeCustomerId: "stripe_customer_id",
  studyHours: "study_hours",
  testsTaken: "tests_taken",
  lastScore: "last_score",
  completionPercent: "completion_percent",
};

export function toProfileRow(partial: Partial<UserProfile>): Row {
  const out: Row = {};
  for (const [key, column] of Object.entries(PROFILE_COLUMNS)) {
    if (key in partial) out[column] = partial[key as keyof UserProfile];
  }
  return out;
}

export const toLessonProgress = (r: Row): LessonProgress => ({
  userId: r.user_id,
  lessonId: r.lesson_id,
  courseId: r.course_id,
  completed: r.completed,
  quizScore: numOrNull(r.quiz_score),
  lastPosition: Number(r.last_position),
  updatedAt: r.updated_at,
});

export const toStudyPlan = (r: Row): StudyPlan => ({
  id: r.id,
  userId: r.user_id,
  durationDays: r.duration_days,
  goal: r.goal,
  weeklyHours: Number(r.weekly_hours),
  startedAt: r.started_at,
  targetEndAt: r.target_end_at,
  weeklySchedule: r.weekly_schedule ?? [],
});

export const toExamAttempt = (r: Row): ExamAttempt => ({
  id: r.id,
  userId: r.user_id,
  examId: r.exam_id,
  kind: r.kind,
  status: r.status,
  answers: r.answers ?? {},
  flagged: r.flagged ?? [],
  startedAt: r.started_at,
  submittedAt: r.submitted_at ?? null,
  score: numOrNull(r.score),
  sectionResults: r.section_results ?? [],
  weakSkills: r.weak_skills ?? [],
  newWords: r.new_words ?? [],
  recommendations: r.recommendations ?? [],
});

export const toReviewState = (r: Row): VocabReviewState => ({
  userId: r.user_id,
  wordId: r.word_id,
  easeFactor: Number(r.ease_factor),
  intervalDays: r.interval_days,
  repetitions: r.repetitions,
  dueAt: r.due_at,
  bookmarked: r.bookmarked,
  lastReviewedAt: r.last_reviewed_at ?? null,
  lapses: r.lapses,
  reviewCount: r.review_count,
});

export const toVocabSet = (r: Row): VocabSet => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  wordIds: r.word_ids ?? [],
  createdAt: r.created_at,
});

export const toUserAchievement = (r: Row): UserAchievement => ({
  userId: r.user_id,
  achievementId: r.achievement_id,
  unlockedAt: r.unlocked_at,
});

export const toPublicProfile = (r: Row): PublicProfile => ({
  uid: r.uid,
  name: r.name,
  photoURL: r.photo_url ?? null,
  avatarEmoji: r.avatar_emoji ?? null,
  xp: r.xp,
  streak: r.streak,
  level: r.level ?? null,
});

// ---------- profiles ----------

export async function sbGetUserProfile(uid: string): Promise<UserProfile | null> {
  const row = check(await db().from("profiles").select("*").eq("uid", uid).maybeSingle());
  return row ? toUserProfile(row) : null;
}

export function sbSubscribeUserProfile(uid: string, onChange: (profile: UserProfile | null) => void) {
  let active = true;
  sbGetUserProfile(uid)
    .then((profile) => active && onChange(profile))
    .catch((error) => {
      console.error("[khatwa] profile load failed:", error);
      if (active) onChange(null);
    });

  const channel = db()
    .channel(`profile:${uid}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "profiles", filter: `uid=eq.${uid}` },
      (payload) => {
        if (!active) return;
        onChange(payload.eventType === "DELETE" ? null : toUserProfile(payload.new));
      },
    )
    .subscribe();

  return () => {
    active = false;
    void db().removeChannel(channel);
  };
}

export async function sbUpdateUserProfile(uid: string, partial: Partial<UserProfile>) {
  const row = toProfileRow(partial);
  if (Object.keys(row).length === 0) return;
  check(await db().from("profiles").update(row).eq("uid", uid));
}

export interface ProfileIncrements {
  xp?: number;
  coins?: number;
  studyHours?: number;
  testsTaken?: number;
  dailyChallengesCompleted?: number;
}

export async function sbBumpProfile(inc: ProfileIncrements) {
  check(
    await db().rpc("bump_profile", {
      p_xp: inc.xp ?? 0,
      p_coins: inc.coins ?? 0,
      p_study_hours: inc.studyHours ?? 0,
      p_tests_taken: inc.testsTaken ?? 0,
      p_daily_challenges: inc.dailyChallengesCompleted ?? 0,
    }),
  );
}

export async function sbAddFcmToken(uid: string, token: string) {
  const profile = await sbGetUserProfile(uid);
  if (!profile) return;
  const tokens = profile.fcmTokens ?? [];
  if (tokens.includes(token)) return;
  await sbUpdateUserProfile(uid, { fcmTokens: [...tokens, token] });
}

export async function sbListAllUsers(count: number): Promise<UserProfile[]> {
  const rows = check(await db().from("profiles").select("*").order("created_at", { ascending: false }).limit(count));
  return (rows ?? []).map(toUserProfile);
}

export async function sbGetAdminStats() {
  const count = async (table: string) => {
    const { count: n, error } = await db().from(table).select("*", { count: "exact", head: true });
    if (error) throw new Error(`Supabase: ${error.message}`);
    return n ?? 0;
  };
  const [totalUsers, totalExamAttempts, totalCourses, totalQuestions] = await Promise.all([
    count("profiles"),
    count("exam_attempts"),
    count("courses"),
    count("questions"),
  ]);
  return { totalUsers, totalExamAttempts, totalCourses, totalQuestions };
}

// ---------- leaderboard ----------

export async function sbGetLeaderboard(count: number): Promise<PublicProfile[]> {
  const rows = check(await db().from("public_profiles").select("*").order("xp", { ascending: false }).limit(count));
  return (rows ?? []).map(toPublicProfile);
}

// ---------- lesson progress ----------

export async function sbGetLessonProgress(userId: string, lessonId: string) {
  const row = check(
    await db().from("lesson_progress").select("*").eq("user_id", userId).eq("lesson_id", lessonId).maybeSingle(),
  );
  return row ? toLessonProgress(row) : null;
}

export async function sbGetCourseProgress(userId: string, courseId: string) {
  const rows = check(await db().from("lesson_progress").select("*").eq("user_id", userId).eq("course_id", courseId));
  return (rows ?? []).map(toLessonProgress);
}

export async function sbGetAllUserProgress(userId: string) {
  const rows = check(await db().from("lesson_progress").select("*").eq("user_id", userId));
  return (rows ?? []).map(toLessonProgress);
}

export async function sbMarkLessonComplete(userId: string, courseId: string, lessonId: string, quizScore: number | null) {
  check(
    await db().from("lesson_progress").upsert({
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      completed: true,
      quiz_score: quizScore,
      last_position: 0,
      updated_at: new Date().toISOString(),
    }),
  );
}

// ---------- study plans ----------

export async function sbGetActiveStudyPlan(uid: string) {
  const rows = check(
    await db().from("study_plans").select("*").eq("user_id", uid).order("started_at", { ascending: false }).limit(1),
  );
  return rows && rows[0] ? toStudyPlan(rows[0]) : null;
}

export async function sbCreateStudyPlan(plan: Omit<StudyPlan, "id">): Promise<string> {
  const row = checkOne(
    await db()
      .from("study_plans")
      .insert({
        user_id: plan.userId,
        duration_days: plan.durationDays,
        goal: plan.goal,
        weekly_hours: plan.weeklyHours,
        started_at: plan.startedAt,
        target_end_at: plan.targetEndAt,
        weekly_schedule: plan.weeklySchedule,
      })
      .select("id")
      .single(),
  );
  return row.id;
}

export async function sbMarkPlanDayComplete(planId: string, dayIndex: number) {
  const row = check(await db().from("study_plans").select("weekly_schedule").eq("id", planId).maybeSingle());
  if (!row) return;
  const weeklySchedule = (row.weekly_schedule as StudyPlan["weeklySchedule"]).map((day) =>
    day.dayIndex === dayIndex ? { ...day, completed: true } : day,
  );
  check(await db().from("study_plans").update({ weekly_schedule: weeklySchedule }).eq("id", planId));
}

// ---------- exam attempts ----------

export async function sbCreateExamAttempt(
  attempt: Pick<ExamAttempt, "userId" | "examId" | "kind" | "answers" | "flagged" | "startedAt">,
): Promise<string> {
  const row = checkOne(
    await db()
      .from("exam_attempts")
      .insert({
        user_id: attempt.userId,
        exam_id: attempt.examId,
        kind: attempt.kind,
        status: "in_progress",
        answers: attempt.answers,
        flagged: attempt.flagged,
        started_at: attempt.startedAt,
      })
      .select("id")
      .single(),
  );
  return row.id;
}

export async function sbSaveAttemptAnswer(attemptId: string, answers: Record<string, string>, flagged: string[]) {
  check(await db().from("exam_attempts").update({ answers, flagged }).eq("id", attemptId));
}

export async function sbSubmitAttempt(
  attemptId: string,
  result: Pick<ExamAttempt, "score" | "sectionResults" | "weakSkills" | "newWords" | "recommendations">,
) {
  check(
    await db()
      .from("exam_attempts")
      .update({
        score: result.score,
        section_results: result.sectionResults,
        weak_skills: result.weakSkills,
        new_words: result.newWords,
        recommendations: result.recommendations,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", attemptId),
  );
}

export async function sbGetExamAttempt(attemptId: string) {
  const row = check(await db().from("exam_attempts").select("*").eq("id", attemptId).maybeSingle());
  return row ? toExamAttempt(row) : null;
}

export async function sbGetRecentAttempts(uid: string, count: number, kind?: ExamAttempt["kind"]) {
  let query = db().from("exam_attempts").select("*").eq("user_id", uid);
  if (kind) query = query.eq("kind", kind);
  // Firestore's `orderBy desc` sorts null (in-progress) last; match that.
  const rows = check(await query.order("submitted_at", { ascending: false, nullsFirst: false }).limit(count));
  return (rows ?? []).map(toExamAttempt);
}

// ---------- vocabulary (per-user) ----------

export async function sbGetReviewStates(uid: string) {
  const rows = check(await db().from("vocab_review_state").select("*").eq("user_id", uid));
  return (rows ?? []).map(toReviewState);
}

export async function sbGetReviewState(uid: string, wordId: string) {
  const row = check(
    await db().from("vocab_review_state").select("*").eq("user_id", uid).eq("word_id", wordId).maybeSingle(),
  );
  return row ? toReviewState(row) : null;
}

export async function sbUpsertReviewState(state: VocabReviewState) {
  check(
    await db().from("vocab_review_state").upsert({
      user_id: state.userId,
      word_id: state.wordId,
      ease_factor: state.easeFactor,
      interval_days: state.intervalDays,
      repetitions: state.repetitions,
      due_at: state.dueAt,
      bookmarked: state.bookmarked,
      last_reviewed_at: state.lastReviewedAt,
      lapses: state.lapses ?? 0,
      review_count: state.reviewCount ?? 0,
    }),
  );
}

export async function sbGetVocabSets(uid: string) {
  const rows = check(await db().from("vocab_sets").select("*").eq("user_id", uid).order("created_at", { ascending: false }));
  return (rows ?? []).map(toVocabSet);
}

export async function sbCreateVocabSet(uid: string, name: string): Promise<string> {
  const row = checkOne(await db().from("vocab_sets").insert({ user_id: uid, name: name.trim() }).select("id").single());
  return row.id;
}

export async function sbDeleteVocabSet(setId: string) {
  check(await db().from("vocab_sets").delete().eq("id", setId));
}

async function sbUpdateSetWords(setId: string, change: (ids: string[]) => string[]) {
  const row = check(await db().from("vocab_sets").select("word_ids").eq("id", setId).maybeSingle());
  if (!row) return;
  check(await db().from("vocab_sets").update({ word_ids: change(row.word_ids ?? []) }).eq("id", setId));
}

export const sbAddWordToSet = (setId: string, wordId: string) =>
  sbUpdateSetWords(setId, (ids) => (ids.includes(wordId) ? ids : [...ids, wordId]));

export const sbRemoveWordFromSet = (setId: string, wordId: string) =>
  sbUpdateSetWords(setId, (ids) => ids.filter((id) => id !== wordId));

// ---------- achievements (per-user) ----------

export async function sbGetUserAchievements(uid: string) {
  const rows = check(await db().from("user_achievements").select("*").eq("user_id", uid));
  return (rows ?? []).map(toUserAchievement);
}

/** Returns true when newly unlocked, false when the user already held it. */
export async function sbInsertUserAchievement(uid: string, achievementId: string): Promise<boolean> {
  const { error } = await db()
    .from("user_achievements")
    .insert({ user_id: uid, achievement_id: achievementId, unlocked_at: new Date().toISOString() });
  if (!error) return true;
  if (error.code === "23505") return false;
  throw new Error(`Supabase: ${error.message}`);
}

export async function sbGetAchievementXp(achievementId: string): Promise<number> {
  const row = check(await db().from("achievements").select("xp_reward").eq("id", achievementId).maybeSingle());
  return row?.xp_reward ?? 0;
}
