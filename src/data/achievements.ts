import type { Achievement } from "@/types/gamification";

/**
 * Every achievement in the app, grouped by category. Kept as one source of
 * truth so the seed script (Firestore) and the achievements page share the
 * exact same definitions. Unlock triggers live in the firestore modules:
 *
 *   streak-*      → markDayActive / submitExamAttempt (profile.streak)
 *   words-*       → recordReview (vocabReviewState count)
 *   bookmarks-*   → recordReview / toggleBookmark (bookmarked count)
 *   exams-*       → submitExamAttempt (profile.testsTaken)
 *   score-*       → submitExamAttempt (attempt score)
 *   level-*       → submitExamAttempt placement (profile.level)
 *   lessons-*     → markLessonComplete (lessonProgress count)
 *   hours-*       → markDayActive (profile.studyHours)
 *   daily-*       → completeDailyChallenge (profile.dailyChallengesCompleted)
 */
export const ACHIEVEMENTS: Achievement[] = [
  // ── المثابرة — streak ───────────────────────────────────────────────
  { id: "streak-3", title: "انطلاقة", description: "حافظت على نشاطك 3 أيام متتالية", icon: "flame", xpReward: 15, category: "streak" },
  { id: "week-streak", title: "أسبوع كامل", description: "حافظت على نشاطك 7 أيام متتالية", icon: "flame", xpReward: 30, category: "streak" },
  { id: "streak-14", title: "التزام", description: "حافظت على نشاطك 14 يومًا متتالية", icon: "flame", xpReward: 40, category: "streak" },
  { id: "streak-30", title: "شهر من العزم", description: "حافظت على نشاطك 30 يومًا متتالية", icon: "flame", xpReward: 60, category: "streak" },
  { id: "streak-60", title: "عزيمة حديدية", description: "حافظت على نشاطك 60 يومًا متتالية", icon: "flame", xpReward: 80, category: "streak" },
  { id: "streak-100", title: "100 يوم من الإصرار", description: "حافظت على نشاطك 100 يوم متتالية", icon: "flame", xpReward: 120, category: "streak" },

  // ── المفردات — vocabulary ──────────────────────────────────────────
  { id: "words-10", title: "بداية لغوية", description: "راجعت 10 كلمات في قسم المفردات", icon: "book-marked", xpReward: 10, category: "vocabulary" },
  { id: "words-50", title: "مخزون لغوي", description: "راجعت 50 كلمة في قسم المفردات", icon: "book-marked", xpReward: 15, category: "vocabulary" },
  { id: "100-words", title: "100 كلمة", description: "راجعت 100 كلمة في قسم المفردات", icon: "book-marked", xpReward: 25, category: "vocabulary" },
  { id: "words-250", title: "قاموسك ينمو", description: "راجعت 250 كلمة في قسم المفردات", icon: "book-marked", xpReward: 40, category: "vocabulary" },
  { id: "words-500", title: "عاشق الكلمات", description: "راجعت 500 كلمة في قسم المفردات", icon: "book-marked", xpReward: 60, category: "vocabulary" },
  { id: "words-1000", title: "موسوعة لغوية", description: "راجعت 1000 كلمة في قسم المفردات", icon: "book-marked", xpReward: 100, category: "vocabulary" },
  { id: "bookmarks-25", title: "جامع الكلمات", description: "أضفت 25 كلمة إلى المفضلة", icon: "star", xpReward: 20, category: "vocabulary" },
  { id: "bookmarks-100", title: "أمين المكتبة", description: "أضفت 100 كلمة إلى المفضلة", icon: "star", xpReward: 50, category: "vocabulary" },

  // ── الاختبارات — exams ─────────────────────────────────────────────
  { id: "first-exam", title: "أول اختبار", description: "أكملت أول اختبار لك على خطوة", icon: "award", xpReward: 20, category: "exams" },
  { id: "exams-5", title: "خمسة اختبارات", description: "أكملت 5 اختبارات تجريبية", icon: "award", xpReward: 30, category: "exams" },
  { id: "exams-10", title: "عشرة اختبارات", description: "أكملت 10 اختبارات تجريبية", icon: "award", xpReward: 50, category: "exams" },
  { id: "exams-25", title: "محارب الاختبارات", description: "أكملت 25 اختبارًا تجريبيًا", icon: "trophy", xpReward: 80, category: "exams" },
  { id: "exams-50", title: "خبير الاختبارات", description: "أكملت 50 اختبارًا تجريبيًا", icon: "trophy", xpReward: 120, category: "exams" },
  { id: "score-90", title: "درجة 90+", description: "حققت 90 أو أعلى في اختبار تجريبي", icon: "trophy", xpReward: 50, category: "exams" },
  { id: "score-100", title: "علامة كاملة", description: "حققت 100% في اختبار تجريبي", icon: "trophy", xpReward: 80, category: "exams" },
  { id: "level-intermediate", title: "مستوى متوسط", description: "وصلت إلى المستوى المتوسط", icon: "trending-up", xpReward: 40, category: "exams" },
  { id: "level-advanced", title: "مستوى متقدم", description: "وصلت إلى المستوى المتقدم", icon: "trending-up", xpReward: 60, category: "exams" },

  // ── الدروس — lessons ───────────────────────────────────────────────
  { id: "first-lesson", title: "أول خطوة", description: "أكملت أول درس لك", icon: "book-open", xpReward: 10, category: "lessons" },
  { id: "lessons-10", title: "متعلم واعٍ", description: "أكملت 10 دروس", icon: "book-open", xpReward: 20, category: "lessons" },
  { id: "lessons-25", title: "طالب مجتهد", description: "أكملت 25 درسًا", icon: "book-open", xpReward: 35, category: "lessons" },
  { id: "lessons-50", title: "باحث دؤوب", description: "أكملت 50 درسًا", icon: "graduation-cap", xpReward: 50, category: "lessons" },
  { id: "lessons-100", title: "إنسان متعلم", description: "أكملت 100 درس", icon: "graduation-cap", xpReward: 80, category: "lessons" },

  // ── ساعات الدراسة — focus ──────────────────────────────────────────
  { id: "hours-5", title: "خمس ساعات", description: "درست 5 ساعات على خطوة", icon: "clock", xpReward: 15, category: "focus" },
  { id: "hours-10", title: "عشر ساعات", description: "درست 10 ساعات على خطوة", icon: "clock", xpReward: 25, category: "focus" },
  { id: "hours-25", title: "25 ساعة", description: "درست 25 ساعة على خطوة", icon: "clock", xpReward: 40, category: "focus" },
  { id: "hours-50", title: "50 ساعة", description: "درست 50 ساعة على خطوة", icon: "clock", xpReward: 60, category: "focus" },
  { id: "hours-100", title: "100 ساعة", description: "درست 100 ساعة على خطوة", icon: "clock", xpReward: 100, category: "focus" },

  // ── التحدي اليومي — daily ──────────────────────────────────────────
  { id: "daily-1", title: "تحدي اليوم", description: "أكملت أول تحدٍّ يومي", icon: "calendar-check", xpReward: 15, category: "daily" },
  { id: "daily-7", title: "أسبوع من التحديات", description: "أكملت 7 تحديات يومية", icon: "calendar-check", xpReward: 35, category: "daily" },
  { id: "daily-30", title: "شهر من التحديات", description: "أكملت 30 تحديًا يوميًا", icon: "calendar-check", xpReward: 70, category: "daily" },
];
