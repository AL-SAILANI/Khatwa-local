export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  /** Group name for the achievements page (streak, vocabulary, exams, …). */
  category?: string;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  durationDays: 7 | 15 | 30;
  goal: number;
  weeklyHours: number;
  startedAt: string;
  targetEndAt: string;
  weeklySchedule: PlanDay[];
}

export interface PlanDay {
  dayIndex: number;
  courseId: string;
  lessonIds: string[];
  completed: boolean;
}

export interface Subscription {
  userId: string;
  tier: "free" | "pro" | "premium";
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd: string | null;
}
