# دليل المساهمة في خطوة (Khatwa Contributing Guide)

مرحباً بك في مشروع **خطوة**! نحن نقدر مساهماتك ونريد أن نجعل عملية المساهمة سهلة وممتعة قدر الإمكان.

---

## 📋 جدول المحتويات

1. [قواعد السلوك](#قواعد-السلوك)
2. [إعداد بيئة التطوير](#إعداد-بيئة-التطوير)
3. [سير عمل التطوير](#سير-عمل-التطوير)
4. [معايير الكود](#معايير-الكود)
5. [اختبارات](#اختبارات)
6. [إرسال Pull Request](#إرسال-pull-request)
7. [إبلاغ الأخطاء](#إبلاغ-الأخطاء)
8. [طلب الميزات](#طلب-الميزات)

---

## 🤝 قواعد السلوك

هذا المشروع يتبع [قواعد السلوك للمساهمين](https://www.contributor-covenant.org/ar/). بالتزمتك، يُتوقع منك احترام جميع المشاركين والحفاظ على بيئة إيجابية وشاملة.

---

## 🛠️ إعداد بيئة التطوير

### المتطلبات الأساسية

- **Node.js** 20.x أو أحدث
- **npm** 10.x أو أحدث
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git** 2.40+

### خطوات الإعداد

```bash
# 1. استنساخ المستودع
git clone https://github.com/your-org/khatwa.git
cd khatwa

# 2. تثبيت التبعيات
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env.local
# قم بتعديل .env.local وإضافة إعدادات Firebase الخاصة بك

# 4. تشغيل محاكيات Firebase (اختياري للتطوير المحلي)
firebase emulators:start

# 5. تشغيل خادم التطوير
npm run dev
```

### متغيرات البيئة المطلوبة

| المتغير | مطلوب | الوصف |
|-----------|--------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | نعم | مفتاح API لـ Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | نعم | نطاق المصادقة |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | نعم | معرف المشروع |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | نعم | حاوية التخزين |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | نعم | معرف المرسل |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | نعم | معرف التطبيق |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | للتطوير | مفتاح حساب الخدمة (JSON) |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | للإشعارات | مفتاح VAPID للـ Web Push |
| `CRON_SECRET` | للإنتاج | سر Cron jobs |
| `STRIPE_SECRET_KEY` | للمدفوعات | مفتاح Stripe السري |

---

## 🔄 سير عمل التطوير

### 1. إنشاء فرع جديد

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
# أو
git checkout -b fix/your-bug-fix
```

### 2. التطوير والتجربة

```bash
# تشغيل خادم التطوير
npm run dev

# تشغيل الاختبارات
npm run test
npm run test:e2e

# فحص الكود
npm run lint
npx tsc --noEmit
```

### 3. الالتزام (Commits)

اتبع تنسيق [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**الأنواع (Types):**
- `feat`: ميزة جديدة
- `fix`: إصلاح خطأ
- `docs`: توثيق
- `style`: تنسيق (لا يؤثر على الكود)
- `refactor`: إعادة هيكلة الكود
- `test`: إضافة/تعديل اختبارات
- `chore`: مهام صيانة

**أمثلة:**
```
feat(dashboard): add streak visualization
fix(auth): resolve login redirect loop
docs(api): update exam scoring documentation
test(exam): add unit tests for scoring algorithm
```

---

## 🎨 معايير الكود

### TypeScript

- استخدم `strict: true` (مفعل في المشروع)
- تجنب `any` — استخدم أنواعًا دقيقة
- فعل `noUncheckedIndexedAccess` للمصفوفات
- استخدم `interface` للكائنات العامة، `type` للاتحادات والوظائف

### React

- استخدم Functional Components مع Hooks
- اتبع قواعد Hooks
- استخدم `useCallback` و `useMemo` عند الحاجة
- تجنب الـ inline styles — استخدم Tailwind CSS

### Tailwind CSS

- استخدم الـ utility classes بدلاً من CSS مخصص
- اتبع نظام الألوان والمسافات المعرف في `globals.css`
- استخدم الـ dark mode عبر `dark:` prefix
- احترم RTL عبر `rtl:` prefix

### تسمية الملفات

```
components/
  ui/              # المكونات الأساسية (Button, Card, Input)
  feature/         # مكونات الميزات (ExamRunner, Flashcard)
  layout/          # مكونات التخطيط (Navbar, Sidebar)
  landing/         # مكونات صفحة الهبوط

lib/
  firebase/        # Firebase client/admin
  firestore/       # دوال Firestore
  validation/      # Zod schemas
  utils/           # دوال مساعدة عامة

hooks/             # Custom React hooks
types/             # TypeScript types
```

### الترجمة (i18n)

- **لا تكتب نصوصًا عربية مباشرة** في الكود
- استخدم `useTranslations("namespace")` في Client Components
- أضف المفاتيح في `messages/ar.json` و `messages/en.json`
- استخدم `Intl.DateTimeFormat` و `Intl.RelativeTimeFormat` للتاريخ

---

## 🧪 اختبارات

### اختبارات الوحدة (Vitest)

```bash
# تشغيل جميع الاختبارات
npm run test

# تشغيل اختبارات مع واجهة مستخدم
npm run test:ui

# تشغيل اختبارات مع التغطية
npm run test:coverage
```

**إرشادات:**
- اختبر الدوال الخالصة (pure functions) في `lib/`
- اهدف لتغطية >80% للدوال الحرجة
- استخدم `vi.mock` للمحاكاة (mocking)
- سمِّ ملفات الاختبار بـ `.test.ts` أو `.test.tsx`

### اختبارات E2E (Playwright)

```bash
# تشغيل ضد محاكيات Firebase
firebase emulators:exec "npm run test:e2e"

# تشغيل مع واجهة مستخدم
npm run test:e2e:ui
```

**إرشادات:**
- اختبر تدفقات المستخدم الحرجة (تسجيل دخول، امتحان، مراجعة)
- استخدم `data-testid` للاختيار
- اختبر كلا اللغتين (العربية والإنجليزية)

### أنواع الاختبارات المطلوبة

| نوع الاختبار | ماذا يختبر | متى مطلوب |
|-------------|------------|------------|
| Unit | دوال خالصة، utilities | لكل دالة جديدة في `lib/` |
| Component | مكونات UI معزولة | للمكونات المعقدة |
| Integration | تدفقات متعددة المكونات | للميزات الرئيسية |
| E2E | تدفقات المستخدم الحقيقية | للمسارات الحرجة |

---

## 📤 إرسال Pull Request

### قبل الإرسال

- [ ] جميع الاختبارات تمر (`npm run test && npm run test:e2e`)
- [ ] لا توجد أخطاء Lint/TypeScript (`npm run lint && npx tsc --noEmit`)
- [ ] الكود منسق (`npm run format` إن وجد)
- [ ] التحديثات موثقة (تغييرات API، متغيرات بيئة جديدة)
- [ ] الترجمة مضافة للغتين

### قالب Pull Request

```markdown
## الوصف
وصف مختصر للتغييرات.

## نوع التغيير
- [ ] إصلاح خطأ (Bug fix)
- [ ] ميزة جديدة (New feature)
- [ ] تغيير جوهري (Breaking change)
- [ ] توثيق (Documentation)
- [ ] إعادة هيكلة (Refactor)
- [ ] اختبارات (Tests)

## كيف تم اختباره؟
وصف خطوات الاختبار.

## لقطات شاشة (إن أمكن)
أضف لقطات شاشة للتغييرات البصرية.

## قائمة التحقق
- [ ] الاختبارات تمر
- [ ] Lint/TypeScript نظيف
- [ ] الترجمة مضافة
- [ ] التوثيق محدث
```

### مراجعة الكود

- يتم مراجعة جميع PRs من قبل مشرف واحد على الأقل
- يتم دمج PR بعد الموافقة واجتياز جميع الفحوصات
- يتم حذف الفرع بعد الدمج

---

## 🐛 إبلاغ الأخطاء

استخدم [GitHub Issues](https://github.com/your-org/khatwa/issues) مع القالب التالي:

```markdown
**وصف الخطأ**
وصف واضح ومختصر للخطأ.

**خطوات الاستنساخ**
1. اذهب إلى '...'
2. انقر على '...'
3. مرر لأسفل إلى '...'
4. شاهد الخطأ

**السلوك المتوقع**
وصف واضح لما كان يجب أن يحدث.

**لقطات شاشة**
إن أمكن، أضف لقطات شاشة.

**البيئة:**
- المتصفح: [مثل Chrome 120]
- نظام التشغيل: [مثل macOS 14]
- اللغة: [العربية / الإنجليزية]

**معلومات إضافية**
أي سياق إضافي.
```

---

## 💡 طلب الميزات

استخدم [GitHub Issues](https://github.com/your-org/khatwa/issues) مع القالب:

```markdown
**هل طلب الميزة مرتبط بمشكلة؟**
وصف واضح للمشكلة.

**الحل المقترح**
وصف واضح للحل الذي تريده.

**بدائل تم النظر فيها**
أي حلول بديلة.

**معلومات إضافية**
سياق إضافي، نماذج أولية، إلخ.
```

---

## 🏷️ إصدار الإصدارات (Versioning)

نتبع [Semantic Versioning](https://semver.org/):

- `MAJOR`: تغييرات جذرية غير متوافقة
- `MINOR`: ميزات جديدة متوافقة
- `PATCH`: إصلاحات أخطاء متوافقة

---

## 📞 التواصل

- **GitHub Discussions**: للأسئلة العامة والنقاشات
- **GitHub Issues**: للأخطاء وطلبات الميزات
- **Email**: team@khatwa.sa (للأمور الأمنية والحساسة)

---

شكراً لمساهمتك في خطوة! 🌟