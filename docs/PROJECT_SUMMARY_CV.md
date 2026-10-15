# خطوة (Khatwa): ملخص المشروع للسيرة الذاتية

منصة عربية للتحضير لاختبار STEP (اختبار الكفاءة في اللغة الإنجليزية) لطلاب الثانوية في السعودية.
الموقع: https://khatwa-2026.vercel.app

## نبذة من سطرين
منصة ويب عربية (RTL) تقدّم اختبار تحديد مستوى، وخطة دراسية مخصّصة، ودروسًا ومفردات بالتكرار المتباعد،
و5 اختبارات تجريبية بتوزيع STEP الفعلي (قراءة 40%، قواعد 30%، استماع 20%، تحليل كتابي 10%).

## التقنيات
- **الواجهة:** Next.js 16 (App Router)، React 19، TypeScript، Tailwind CSS v4، next-intl (عربي افتراضي + إنجليزي)
- **الخلفية وقاعدة البيانات:** Supabase (PostgreSQL، RLS، مصادقة)، مع مسار ترحيل من Firebase
- **النشر:** Vercel (نشر تلقائي من GitHub)، GitHub Actions
- **الصوت:** edge-tts + ffmpeg لتوليد تسجيلات الاستماع داخل GitHub Actions (بتكلفة صفر)
- **الاختبارات والجودة:** Vitest (273 اختبارًا آليًا)، ESLint، TypeScript صارم
- **أخرى:** Stripe (الاشتراكات)، تضمين فيديو YouTube، تصميم متجاوب مع الوضع الليلي

## ما أُنجز
**المنتج**
- اختبار تحديد المستوى (30 سؤالًا) يخرج بدرجة متوقعة ونطاق ومجالات الضعف.
- خطة دراسية (7/15/30 يومًا) تُبنى من نتيجة الاختبار، وتبدأ بالأقسام الأضعف.
- اختبارات تجريبية كاملة (100 سؤال بتوقيت حقيقي) مع تقرير وتوصيات.
- مفردات بالتكرار المتباعد، ولوحة المتصدرين، والإنجازات، والسلسلة اليومية.
- مشغّل درس خطوة بخطوة: شرح، مثال محلول، تدريب موجّه، بطاقة خروج بإتقان 80%.
- لوحة إدارة للدورات والمستخدمين.

**المحتوى**
- 764 سؤالًا، 63 درسًا، 8 دورات، 77 نص قراءة (أغلبها أصلي من تأليفي بمساعدة Claude).
- تسجيلات صوتية للاستماع، وفيديوهات تعليمية مضمّنة في دروس القواعد.
- مراجعة جودة منهجية: تحليل انحياز موقع الإجابة الصحيحة وطول الخيارات، وإعادة كتابة المموّهات، وإصلاح الأسئلة الملتبسة.

**الهندسة**
- مزامنة محتوى الاختبارات مع قاعدة البيانات بدون توقف، والتحقق بقيم تجزئة (checksum) بين الكود والإنتاج.
- أتمتة توليد الصوت عبر GitHub Actions، وفحوصات آلية لجودة بنك الأسئلة.
- تصميم معمارية منهج قائمة على خريطة مهارات (52 مهارة)، ومخطط جداول للإتقان والمراجعة.
- حوالي 27 طلب دمج (PR) مراجعة ومنشورة، مع التحقق من كل نشر على الإنتاج.

## نقاط جاهزة للسيرة (إنجليزي)
- Built and shipped **Khatwa**, an Arabic-first (RTL) STEP exam-prep platform with placement testing, personalised study plans, spaced-repetition vocabulary and five full-length mock exams (Next.js 16, React 19, TypeScript, Supabase, Vercel).
- Designed a content pipeline of **764 questions and 63 lessons** aligned to the official STEP section weights, with automated quality checks (answer-position and option-length bias analysis, checksum-verified database syncs).
- Automated listening-audio generation with **GitHub Actions** (edge-tts + ffmpeg) at zero infrastructure cost.
- Designed a **skill-graph curriculum architecture** (52 skills, prerequisites, mastery tracking, spaced review) and a step-by-step lesson player based on mastery learning and retrieval practice.
- Maintained **273 automated tests**, row-level security on all user data, and continuous deployment with production verification.

## نقاط جاهزة (عربي)
- بناء وإطلاق منصة «خطوة» للتحضير لاختبار STEP بواجهة عربية كاملة (Next.js وSupabase وVercel).
- تصميم بنك محتوى من 764 سؤالًا و63 درسًا متوافقًا مع أوزان الاختبار الرسمية، مع فحوصات جودة آلية.
- أتمتة توليد التسجيلات الصوتية عبر GitHub Actions بتكلفة صفر.
- تصميم معمارية منهج قائمة على خريطة مهارات والتعلم بالإتقان والتكرار المتباعد.

## تنبيهات قبل وضعها في السيرة
- **لا أرقام مستخدمين:** لا يوجد لديّ عدد مستخدمين أو أثر قياسي، فلا تضف رقمًا لا تملكه.
- **المحتوى مدعوم بالذكاء الاصطناعي:** أنصح بذكر ذلك بصراحة، وإنه لم تتم مراجعته من معلم إنجليزي مؤهل بعد.
- **مرحلة المنهج:** المراحل C–E (محرك الجلسة، إعادة ربط المحتوى بالمهارات، التحليلات) لم تُنفَّذ بعد؛ المرحلة B في PR #27 ولم تُدمج.
- **حقوق المحتوى:** فيديوهات EngVid مضمّنة بمشغّل YouTube الرسمي، ويُنصح بإذن كتابي منهم قبل الاستخدام التجاري.
- **الأرقام تقريبية:** أعددتها من قاعدة البيانات اليوم (2026-10-14) وقد تتغير.
