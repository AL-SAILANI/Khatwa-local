# Khatwa على Supabase — دليل التشغيل

## الحالة (12 أكتوبر 2026)
- مشروع Supabase الخاص بخطوة: `dcjhxgckzffhkplrnycl` (الخطة المجانية). لا يُستخدم لأي مشروع آخر.
- المستخدمون الثمانية نُقلوا من Firebase مع تقدمهم وكلمات مرور البريد؛ حسابات Google تُربط تلقائياً عند أول دخول بنفس البريد.
- الإنتاج على Vercel (`khatwa-2026`) يعمل بـ `NEXT_PUBLIC_DATA_BACKEND=supabase` و`NEXT_PUBLIC_USER_BACKEND=supabase`.

## الرجوع إلى Firebase (دقيقة واحدة)
احذف المتغيرين `NEXT_PUBLIC_DATA_BACKEND` و`NEXT_PUBLIC_USER_BACKEND` من Vercel (بيئة Production) ثم أعد النشر. بيانات Firebase لم تُحذف.

## الترحيلات (`supabase/migrations`)
| الملف | الغرض |
|---|---|
| 0001 | الجداول وسياسات RLS |
| 0002 | قراءة الكتالوج للزوار |
| 0003 | trigger إنشاء الملف الشخصي، العدادات، حذف الحساب، Realtime |
| 0004 | مخزن وسائط الدروس |
| 0005 | تثبيت `search_path` وحصر الدوال |
| 0006 | أداء RLS وفهرس `questions.passage_id` |

## السكربتات
- `npm run migrate:supabase` — نقل مستخدمي Firebase وبياناتهم (تجربة بلا كتابة افتراضياً، `--apply` للكتابة، آمن للتكرار).
- `npm run migrate:content` — نقل ملفات الدروس والمحتوى.
- `scripts/supabase-set-admin.ts` — منح صلاحية الأدمن.

## ما يعمل ضمن الخطة المجانية
- مهمة `/api/cron/keepalive` اليومية تمنع إيقاف المشروع بعد 7 أيام بلا نشاط.
- بريد Supabase الافتراضي لا يرسل لغير أعضاء المشروع: لإرسال رسائل التأكيد وإعادة كلمة المرور للجميع اضبط SMTP مجاني (مثل Resend) في Authentication > Emails.
- حماية كلمات المرور المسرّبة تتطلب خطة Pro.

## متغيرات البيئة
`NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_ANON_KEY` (مفتاح `sb_publishable_…` العام). المفتاح السري `SUPABASE_SERVICE_ROLE_KEY` (نوع Sensitive، مفتاح `sb_secret_…`) مطلوب لمهمة تذكير السلسلة و webhook الدفع فقط، ولا يوضع في الواجهة أبداً.

## الدومين
`khatwa.com` / `www.khatwa.com` مرتبطان بمشروع Vercel `khatwa-2026`. سجلات DNS عند المسجّل: `A @ → 76.76.21.21` و`CNAME www → cname.vercel-dns.com`. وفي Supabase (Authentication > URL Configuration) يكون Site URL هو `https://www.khatwa.com` وRedirect URLs تشمل الدومينين.
