import { beforeEach, describe, expect, it, vi } from "vitest";

type Call = [string, ...unknown[]];
let calls: Call[] = [];
let result: { data: unknown; error: { message: string; code?: string } | null } = { data: [], error: null };

/** Chainable stand-in for the supabase-js query builder: records every call
 * and resolves with `result` when awaited. */
function builder(): unknown {
  const proxy: unknown = new Proxy(
    {},
    {
      get(_target, prop: string) {
        if (prop === "then") return (resolve: (v: unknown) => void) => resolve(result);
        return (...args: unknown[]) => {
          calls.push([prop, ...args]);
          return proxy;
        };
      },
    },
  );
  return proxy;
}

vi.mock("@/lib/supabase/client", () => ({ getSupabase: () => builder() }));

import {
  sbBumpProfile,
  sbGetRecentAttempts,
  sbInsertUserAchievement,
  toExamAttempt,
  toProfileRow,
  toUserProfile,
} from "./user-data";

beforeEach(() => {
  calls = [];
  result = { data: [], error: null };
});

describe("profile mapping", () => {
  const row = {
    uid: "u1", name: "Sara", email: "s@x.com", photo_url: null, avatar_emoji: "🦊", age: 19,
    gender: "female", goal: 80, level: null, xp: 120, coins: 10, streak: 3,
    last_active_at: "2026-10-01T00:00:00Z", recent_activity_days: ["2026-10-01"], plan_tier: "free",
    active_study_plan_id: null, notifications_enabled: true, last_daily_challenge_date: null,
    daily_challenges_completed: 2, exam_date: "2026-12-01", fcm_tokens: null, stripe_customer_id: null,
    study_hours: "4.5", tests_taken: 2, last_score: "71.5", completion_percent: "12",
    created_at: "2026-09-01T00:00:00Z", updated_at: "2026-10-01T00:00:00Z",
  };

  it("maps a row to a UserProfile (numeric strings, nulls, defaults)", () => {
    const p = toUserProfile(row);
    expect(p).toMatchObject({
      uid: "u1", planTier: "free", studyHours: 4.5, lastScore: 71.5, completionPercent: 12,
      fcmTokens: [], photoURL: undefined, level: null, dailyChallengesCompleted: 2,
    });
  });

  it("toProfileRow only emits provided, writable columns", () => {
    expect(toProfileRow({ xp: 5, lastScore: null, examDate: "2026-12-01", recentActivityDays: [] })).toEqual({
      xp: 5, last_score: null, exam_date: "2026-12-01", recent_activity_days: [],
    });
    expect(toProfileRow({ uid: "x", email: "e@x.com", createdAt: "now" } as never)).toEqual({});
  });
});

describe("toExamAttempt", () => {
  it("maps snake_case and keeps in-progress attempts null-safe", () => {
    const a = toExamAttempt({
      id: "a1", user_id: "u1", exam_id: "e1", kind: "mock", status: "in_progress", answers: null,
      flagged: null, started_at: "t", submitted_at: null, score: null, section_results: null,
      weak_skills: null, new_words: null, recommendations: null,
    });
    expect(a).toMatchObject({ userId: "u1", examId: "e1", submittedAt: null, score: null, answers: {}, flagged: [] });
  });
});

describe("query behaviour", () => {
  it("recent attempts sort submitted_at desc with nulls last and filter by kind", async () => {
    await sbGetRecentAttempts("u1", 5, "placement");
    expect(calls).toContainEqual(["eq", "kind", "placement"]);
    expect(calls).toContainEqual(["order", "submitted_at", { ascending: false, nullsFirst: false }]);
    expect(calls).toContainEqual(["limit", 5]);
  });

  it("achievement insert reports duplicates as already held", async () => {
    result = { data: null, error: { message: "dup", code: "23505" } };
    await expect(sbInsertUserAchievement("u1", "a1")).resolves.toBe(false);
    result = { data: null, error: null };
    await expect(sbInsertUserAchievement("u1", "a1")).resolves.toBe(true);
    result = { data: null, error: { message: "boom", code: "42501" } };
    await expect(sbInsertUserAchievement("u1", "a1")).rejects.toThrow("boom");
  });

  it("bump_profile receives zero defaults for unspecified counters", async () => {
    await sbBumpProfile({ xp: 50 });
    expect(calls).toContainEqual([
      "rpc",
      "bump_profile",
      { p_xp: 50, p_coins: 0, p_study_hours: 0, p_tests_taken: 0, p_daily_challenges: 0 },
    ]);
  });
});
