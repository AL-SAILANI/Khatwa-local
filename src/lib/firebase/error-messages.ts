import { FirebaseError } from "firebase/app";
import { isAuthError } from "@supabase/supabase-js";
import { FlowAuthError } from "@/lib/supabase/auth-error";

const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "البريد الإلكتروني غير صالح.",
  "auth/user-disabled": "تم تعطيل هذا الحساب. تواصل مع الدعم.",
  "auth/user-not-found": "لا يوجد حساب بهذا البريد الإلكتروني.",
  "auth/wrong-password": "كلمة المرور غير صحيحة.",
  "auth/invalid-credential": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "auth/email-already-in-use": "هذا البريد الإلكتروني مستخدم بالفعل.",
  "auth/weak-password": "كلمة المرور ضعيفة جدًا.",
  "auth/expired-action-code": "انتهت صلاحية الرابط. اطلب رابطًا جديدًا.",
  "auth/invalid-action-code": "الرابط غير صالح أو مستخدم من قبل. اطلب رابطًا جديدًا.",
  "auth/too-many-requests": "محاولات كثيرة جدًا. حاول مرة أخرى لاحقًا.",
  "auth/popup-closed-by-user": "تم إغلاق نافذة تسجيل الدخول.",
  "auth/network-request-failed": "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.",
  // Firebase config problems — these are what you see when the app is
  // running without a real project behind it (no `.env.local`, or the
  // placeholder fallback from `src/lib/firebase/client.ts`).
  "auth/api-key-not-valid": "إعدادات الاتصال غير مكتملة. تواصل مع إدارة المنصة.",
  "auth/invalid-api-key": "إعدادات الاتصال غير مكتملة. تواصل مع إدارة المنصة.",
  "auth/configuration-not-found": "إعدادات الاتصال غير مكتملة. تواصل مع إدارة المنصة.",
  "auth/invalid-app-credential": "إعدادات الاتصال غير مكتملة. تواصل مع إدارة المنصة.",
  "auth/argument-error": "إعدادات الاتصال غير مكتملة. تواصل مع إدارة المنصة.",
  "auth/internal-error": "حدث خطأ أثناء الاتصال. حاول مرة أخرى.",
  "auth/operation-not-allowed": "تسجيل الحسابات بهذه الطريقة غير مفعل حالياً.",
  "auth/account-exists-with-different-credential":
    "يوجد حساب مسجل بهذا البريد باستخدام طريقة تسجيل مختلفة.",
  // Reset-link action URL problems — these come up when the redirect domain
  // isn't listed under Firebase Authentication > Settings > Authorized domains.
  "auth/unauthorized-continue-uri":
    "رابط إعادة التعيين غير معتمد من المنصة. تواصل مع إدارة المنصة.",
  "auth/missing-continue-uri":
    "رابط إعادة التعيين ناقص. تواصل مع إدارة المنصة.",
  "auth/invalid-continue-uri":
    "رابط إعادة التعيين غير صالح. تواصل مع إدارة المنصة.",
  "auth/email-not-found": "لا يوجد حساب بهذا البريد الإلكتروني.",
  // Firestore / Storage permission errors surface as `permission-denied`,
  // which is a FirebaseError but not an `auth/*` code.
  "permission-denied": "لا تملك صلاحية تنفيذ هذا الإجراء.",
  "unavailable": "خدمة التخزين غير متاحة حالياً. حاول مرة أخرى لاحقاً.",
  "not-found": "البيانات المطلوبة غير موجودة.",
  "already-exists": "يوجد سجل بنفس المعرف بالفعل.",
};

/** Supabase Auth error codes mapped onto the same Arabic copy as the
 * Firebase equivalents above. */
const SUPABASE_CODES: Record<string, string> = {
  invalid_credentials: MESSAGES["auth/invalid-credential"]!,
  user_not_found: MESSAGES["auth/user-not-found"]!,
  email_exists: MESSAGES["auth/email-already-in-use"]!,
  user_already_exists: MESSAGES["auth/email-already-in-use"]!,
  weak_password: MESSAGES["auth/weak-password"]!,
  same_password: "كلمة المرور الجديدة مطابقة للحالية. اختر كلمة مختلفة.",
  email_address_invalid: MESSAGES["auth/invalid-email"]!,
  validation_failed: MESSAGES["auth/invalid-email"]!,
  user_banned: MESSAGES["auth/user-disabled"]!,
  over_request_rate_limit: MESSAGES["auth/too-many-requests"]!,
  over_email_send_rate_limit: MESSAGES["auth/too-many-requests"]!,
  otp_expired: MESSAGES["auth/expired-action-code"]!,
  flow_state_expired: MESSAGES["auth/expired-action-code"]!,
  flow_state_not_found: MESSAGES["auth/invalid-action-code"]!,
  session_expired: "انتهت جلستك. سجّل الدخول من جديد.",
  session_not_found: "انتهت جلستك. سجّل الدخول من جديد.",
  bad_jwt: "انتهت جلستك. سجّل الدخول من جديد.",
  reauthentication_needed: "أعد إدخال كلمة المرور الحالية للمتابعة.",
  email_not_confirmed: "أكّد بريدك الإلكتروني من الرسالة التي وصلتك ثم سجّل الدخول.",
  email_confirmation_required: "أرسلنا رابط تأكيد إلى بريدك. افتحه ثم سجّل الدخول.",
  signup_disabled: MESSAGES["auth/operation-not-allowed"]!,
  provider_disabled: MESSAGES["auth/operation-not-allowed"]!,
  unexpected_failure: MESSAGES["auth/internal-error"]!,
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FlowAuthError || isAuthError(error)) {
    const code = error.code ?? undefined;
    const message = code ? SUPABASE_CODES[code] : undefined;
    if (message) return message;
    // supabase-js reports a dropped connection as a retryable fetch error with status 0.
    if (isAuthError(error) && error.status === 0) return MESSAGES["auth/network-request-failed"]!;

    console.error("[khatwa] Unmapped Supabase auth error:", code, error.message, error);
    return "حدث خطأ غير متوقع. حاول مرة أخرى.";
  }

  if (error instanceof FirebaseError) {
    const message = MESSAGES[error.code];
    if (message) return message;

    // Unknown/unmapped Firebase error — log the raw code so it's diagnosable
    // from the browser console instead of being swallowed by the generic UI.
    console.error("[khatwa] Unmapped Firebase error:", error.code, error.message, error);
    return "حدث خطأ غير متوقع. حاول مرة أخرى.";
  }

  if (error instanceof Error) {
    console.error("[khatwa] Non-Firebase error during auth:", error);
    return "حدث خطأ غير متوقع. حاول مرة أخرى.";
  }

  console.error("[khatwa] Unknown error during auth:", error);
  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}
