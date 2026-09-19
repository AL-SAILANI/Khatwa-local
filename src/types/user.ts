export type StudyGoal = 60 | 70 | 80 | 90 | 95;

export type Gender = "male" | "female";

export type PlanDuration = 40 | 60 | 90;

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  /** Emoji character avatar picked from the character set — takes precedence
   * over `photoURL` for display. Google sign-in users who haven't chosen one
   * keep their Google photo instead. */
  avatarEmoji?: string | null;
  /** Student's age in whole years (captured at registration, used later for
   *  personalization). Absent until they register or complete onboarding. */
  age?: number | null;
  /** Student's self-identified gender. Absent until set. */
  gender?: Gender | null;
  goal: StudyGoal | null;
  level: "beginner" | "intermediate" | "advanced" | null;
  xp: number;
  coins: number;
  streak: number;
  lastActiveAt: string | null;
  /** Last ~30 distinct "YYYY-MM-DD" days the user did something graded
   * (exam submitted, lesson completed) — powers the streak/calendar widgets
   * without a separate activity-log collection. */
  recentActivityDays: string[];
  planTier: "free" | "pro" | "premium";
  activeStudyPlanId: string | null;
  notificationsEnabled: boolean;
  /** Last date (YYYY-MM-DD) the user completed the daily challenge — used to
   * gate the once-per-day XP/coin reward. */
  lastDailyChallengeDate?: string;
  /** Total number of daily challenges ever completed — milestone counter for
   * the `daily-*` achievements. */
  dailyChallengesCompleted?: number;
  /** Target STEP exam date (YYYY-MM-DD) the student books from the dashboard
   * countdown — powers the "days until your exam" counter. Absent until the
   * student sets it. */
  examDate?: string | null;
  /** Web Push (FCM) registration tokens for this user's browsers. Populated
   * by `requestPushToken` in `@/lib/firebase/messaging` when notifications
   * are turned on; pruned by the `sendStreakReminders` Cloud Function when a
   * token stops being valid. */
  fcmTokens?: string[];
  /** Set by the Stripe webhook once the user completes a checkout — links
   * the Firestore profile to its Stripe Customer for subscription-status
   * updates. Absent for users who've never subscribed. */
  stripeCustomerId?: string;
  // Denormalized stats, updated whenever an exam attempt is submitted or a
  // lesson is completed (see src/lib/firestore/exam-attempts.ts) — kept on
  // the user doc so the dashboard is a single-document read/listener.
  studyHours: number;
  testsTaken: number;
  lastScore: number | null;
  completionPercent: number;
  createdAt: string;
  updatedAt: string;
}

export type UserStats = Pick<
  UserProfile,
  "studyHours" | "testsTaken" | "lastScore" | "completionPercent"
>;
