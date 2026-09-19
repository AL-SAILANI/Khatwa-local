# معمارية خطوة (Khatwa Architecture)

هذا المستند يوثق القرارات المعمارية، أنماط التصميم، وتدفقات البيانات في منصة **خطوة**.

---

## 🏗️ نظرة عامة عالية المستوى

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js 16 App Router                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Server      │  │  Client      │  │  Edge/Serverless     │  │
│  │  Components  │  │  Components  │  │  Functions           │  │
│  │  (RSC)       │  │  ("use client")│  │  (API Routes,      │  │
│  │              │  │              │  │   Cron, Webhooks)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │             │
│         ▼                 ▼                      ▼             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Firebase Services                      │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐    │  │
│  │  │ Auth    │ │Firestore│ │ Storage │ │ Messaging   │    │  │
│  │  │ (Auth)  │ │ (DB)    │ │ (Files) │ │ (FCM)       │    │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 هيكل المشروع

```
khatwa/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # التوجيه المعتمد على اللغة
│   │   │   ├── (auth)/        # مسارات المصادقة (مجموعة)
│   │   │   ├── (app)/         # تطبيق المصادق عليه
│   │   │   ├── admin/         # لوحة الإدارة
│   │   │   └── api/           # API Routes
│   │   └── globals.css        # الأنماط العامة + Tailwind v4 @theme
│   │
│   ├── components/            # مكونات React
│   │   ├── ui/               # مكونات أساسية (Button, Card, Input)
│   │   ├── feature/          # مكونات الميزات (ExamRunner, Flashcard)
│   │   ├── layout/           # التخطيط (Navbar, Sidebar)
│   │   ├── landing/          # صفحة الهبوط
│   │   └── ...
│   │
│   ├── lib/                   # منطق الأعمال والمكتبات
│   │   ├── firebase/         # Firebase client & admin
│   │   ├── firestore/        # دوال Firestore (CRUD)
│   │   ├── validation/       # Zod schemas
│   │   ├── constants/        # ثوابت التطبيق
│   │   └── utils/            # دوال مساعدة
│   │
│   ├── hooks/                # Custom React Hooks
│   ├── types/                # TypeScript types
│   ├── i18n/                 # إعدادات التدويل
│   └── ...
│
├── messages/                 # ملفات الترجمة
│   ├── ar.json              # العربية (الرئيسية)
│   └── en.json              # الإنجليزية
│
├── functions/               # Cloud Functions (اختياري)
├── e2e/                     # اختبارات Playwright
├── firestore.rules          # قواعد أمان Firestore
├── storage.rules            # قواعد أمان Storage
└── firestore.indexes.json   # فهارس Firestore
```

---

## 🔐 المصادقة والصلاحيات

### Firebase Auth
- **Email/Password** + **Google OAuth**
- Custom Claims: `admin` للوحة الإدارة
- `emailVerified` مطلوب للعمليات الحساسة

### قواعد Firestore (مقتطفات)

```javascript
// المستخدم يقرأ/يكتب بياناته فقط
match /users/{uid} {
  allow read, write: if request.auth.uid == uid;
  allow read: if isAdmin(); // للمشرفين
}

// الملف الشخصي العام للجميع
match /publicProfiles/{uid} {
  allow read: if true;
  allow write: if request.auth.uid == uid || isAdmin();
}

// محاولات الامتحان - المستخدم يملك بياناته
match /examAttempts/{attemptId} {
  allow read, write: if request.auth.uid == resource.data.userId;
  allow read: if isAdmin();
}

// تقدم الدروس
match /lessonProgress/{progressId} {
  allow read, write: if request.auth.uid == resource.data.userId;
}
```

### Admin SDK
يستخدم في:
- API Routes للعمليات الإدارية
- Cron jobs (تنبيهات الاستمرارية)
- Webhooks (Stripe)
- الحذف المتتالي للحسابات

---

## 🗄️ نموذج البيانات (Firestore)

### المجموعات الرئيسية

| المجموعة | الوصف | الحقول الرئيسية |
|-----------|--------|----------------|
| `users` | الملف الشخصي الكامل | `uid`, `name`, `email`, `goal`, `level`, `xp`, `streak`, `planTier`, `fcmTokens` |
| `publicProfiles` | بيانات عامة للمتصدرين | `uid`, `name`, `xp`, `streak` |
| `examAttempts` | محاولات الامتحان | `userId`, `type`, `score`, `sectionResults`, `timeBySection` |
| `lessonProgress` | تقدم الدروس | `userId`, `lessonId`, `completed`, `quizScore` |
| `studyPlans` | خطط الدراسة | `userId`, `weeklySchedule`, `startedAt` |
| `courses` | الدورات | `id`, `track`, `title`, `order`, `lessonCount` |
| `lessons` | الدروس | `id`, `courseId`, `title`, `order`, `resources` |
| `questions` | بنك الأسئلة | `section`, `prompt`, `options`, `correctOptionId`, `explanation` |
| `readingPassages` | نصوص القراءة | `id`, `title`, `body`, `questionIds` |
| `userAchievements` | إنجازات المستخدم | `userId`, `achievementId`, `unlockedAt` |
| `vocabReviewState` | حالة المراجعة | `userId`, `wordId`, `easeFactor`, `intervalDays`, `dueAt` |

### البيانات غير الطبيعية (Denormalized)

- `UserProfile` يحتوي على إحصائيات محسوبة: `studyHours`, `testsTaken`, `lastScore`, `completionPercent`
- `publicProfiles` نسخة مبسطة للمتصدرين
- تحديث هذه الحقول يتم عبر دوال `firestore/` عند كل عملية كتابة

---

## 🧭 التوجيه واللغة (i18n/Routing)

### هيكل المسارات
```
/ar/                    # العربية (افتراضي)
/en/                    # الإنجليزية
/ar/dashboard           # لوحة التحكم
/ar/placement-test      # اختبار تحديد المستوى
/ar/mock-exams          # الاختبارات التجريبية
/ar/courses             # الدورات
/ar/vocabulary          # المفردات
/ar/admin               # الإدارة (محمية بـ admin claim)
```

### تنفيذ اللغة
- `next-intl` مع `localePrefix: "always"`
- `setRequestLocale(locale)` في كل layout/page
- روابط عبر `@/i18n/navigation` (Link, useRouter, usePathname)
- RTL تلقائي عبر `dir={localeDirection[locale]}` في `<html>`

---

## ⚛️ أنماط المكونات

### Server Components (RSC) - افتراضي
```tsx
// app/[locale]/(app)/dashboard/page.tsx
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  return <DashboardContent />;
}
```

### Client Components - عند الحاجة
```tsx
// components/dashboard/dashboard-content.tsx
"use client";

import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/use-user-profile";

export function DashboardContent() {
  const { user, profile } = useUserProfile();
  // ...
}
```

### متى تستخدم Client Components؟
- التفاعل (`useState`, `useEffect`, `onClick`)
- Hooks المتصفح (`useRouter`, `useSearchParams`)
- مكتبات تحتاج `window` (motion, charts)
- Firebase client SDK (auth, messaging)

---

## 🎨 نظام التصميم

### Tailwind CSS v4 (@theme)
```css
/* src/app/globals.css */
@theme inline {
  --color-primary-500: #059669;    /* الزمرد */
  --color-primary-600: #047857;
  --color-violet-500: #6366f1;     /* الياقوت */
  --color-amber-500: #f59e0b;      /* العنبر */
  --font-sans: var(--font-family-body);
  --font-heading: var(--font-family-heading);
}
```

### الخطوط
| اللغة | الخط الأساسي | العناوين |
|-------|-------------|----------|
| العربية | IBM Plex Sans Arabic | Tajawal |
| الإنجليزية | Plus Jakarta Sans | Plus Jakarta Sans |

### الوضع الداكن
- مبني على الكلاس (`.dark` على `<html>`)
- independente من `prefers-color-scheme`
- مفتاح التبديل في `ThemeToggle` يحفظ في `localStorage`

---

## 🔥 Firebase Integration

### Client SDK (`src/lib/firebase/client.ts`)
```typescript
// تهيئة أحادية (singleton)
export const app = getApps().length ? getApp() : initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = isSupported() ? getMessaging(app) : null;
```

### Admin SDK (`src/lib/firebase/admin.ts`)
```typescript
// يستخدم في Server Components و API Routes فقط
import { cert, getApps, initializeApp } from "firebase-admin/app";
export const adminApp = getApps().length ? getApp() : initializeApp({ credential: cert(...) });
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
```

### محاكيات التطوير
```bash
firebase emulators:start
# NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true يوجه SDK للـ localhost
```

---

## 📡 API Routes و Serverless

### الهيكل
```
src/app/api/
├── cron/
│   └── streak-reminder/route.ts    # Vercel Cron يومي
├── stripe/
│   ├── checkout/route.ts           # إنشاء جلسة Checkout
│   └── webhook/route.ts            # Stripe Webhook
├── firebase-messaging-sw.js/route.ts  # Service Worker للـ FCM
└── ...
```

### Cron Jobs
- **Vercel Cron** (مجاني): `vercel.json` يحدد الجدول
- `CRON_SECRET` يحمي نقطة النهاية
- يستخدم Admin SDK مباشرة (لا يحتاج Cloud Functions)

### Stripe Webhook
```typescript
// التحقق من التوقيع
const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
// تحديث planTier في Firestore
```

---

## 🧪 استراتيجية الاختبار

### الهرم
```
        E2E (Playwright)
       /                \
   Integration        Component
      |                    |
   Unit (Vitest)  ←  Pure Functions
```

### تغطية مطلوبة
| الطبقة | التغطية المستهدفة | الأدوات |
|---------|-----------------|---------|
| دوال خالصة (`lib/`) | >90% | Vitest |
| مكونات معقدة | المسارات الحرجة | Vitest + RTL |
| تدفقات المستخدم | تسجيل دخول، امتحان، مراجعة | Playwright |

---

## 🚀 النشر والبنية التحتية

### Firebase App Hosting
- متصل بـ GitHub repo
- بيئات: `production` + `preview` لكل PR
- إعداد في `apphosting.yaml`

### Vercel (للـ Cron Jobs)
- `vercel.json` يحدد Cron
- متغيرات البيئة في Vercel Dashboard

### CI/CD (GitHub Actions)
```yaml
# .github/workflows/ci.yml
jobs:
  lint-typecheck-build:
  e2e:  # ضد محاكيات Firebase
```

---

## 🔒 الأمان

### قواعد عامة
- لا أسرار في الكود (متغيرات بيئة فقط)
- `server-only` guard للـ Admin SDK
- التحقق من `request.auth` في جميع قواعد Firestore
- `Content-Security-Policy` عبر Next.js headers

### حماية البيانات
- تشفير TLS في النقل
- Firebase App Check (مستحسن للإنتاج)
- حذف متتالي للحسابات (client-side + rules)

---

## 📊 المراقبة والأداء

### المقاييس المهمة
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, INP < 200ms
- **API Latency**: p95 < 500ms
- **Error Rate**: < 0.1%

### الأدوات المقترحة
- **Sentry**: تتبع الأخطاء
- **Vercel Analytics**: أداء الصفحات
- **Firebase Performance**: تتبع SDK

---

## 🔮 القرارات المعمارية المستقبلية (ADRs)

| رقم | العنوان | الحالة | التاريخ |
|-----|---------|--------|---------|
| 001 | استخدام Next.js App Router + RSC | مقبولة | 2024 |
| 002 | Firebase كمنصة خلفية موحدة | مقبولة | 2024 |
| 003 | Tailwind CSS v4 مع @theme | مقبولة | 2024 |
| 004 | next-intl للتدويل | مقبولة | 2024 |
| 005 | Vercel Cron بدلاً من Cloud Functions | مقبولة | 2024 |
| 006 | التكرار المتباعد SM-2 للمفردات | مقبولة | 2024 |
| 007 | تقييم الامتحان الموزع حسب أقسام STEP | مقبولة | 2024 |

---

## 📚 موارد إضافية

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Semantic Versioning](https://semver.org/)

---

*آخر تحديث: 2025-08-08 — الإصدار 1.0.0*