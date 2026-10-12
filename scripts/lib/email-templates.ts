/**
 * Arabic (RTL) auth e-mail templates in the Khatwa look: cream paper, ink-violet
 * text and borders, yellow button with a hard offset edge. Table layout and
 * inline styles only, because mail clients ignore most modern CSS.
 *
 * The {{ .Variable }} placeholders are Supabase Auth (Go template) variables.
 */

const INK = "#0d0129";
const CREAM = "#fffcf7";
const YELLOW = "#f9e589";
const MUTED = "#5b5472";
const FONT = "'Segoe UI', Tahoma, 'Noto Sans Arabic', Arial, sans-serif";

interface TemplateInput {
  title: string;
  heading: string;
  paragraphs: string[];
  buttonLabel: string;
  note: string;
}

function layout({ title, heading, paragraphs, buttonLabel, note }: TemplateInput): string {
  const body = paragraphs
    .map((p) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.9;color:${INK};">${p}</p>`)
    .join("\n              ");

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};font-family:${FONT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="width:100%;max-width:520px;background:#ffffff;border:2px solid ${INK};border-bottom-width:6px;border-left-width:6px;">
          <tr>
            <td style="padding:28px 32px 8px;direction:rtl;text-align:right;">
              <div style="font-size:30px;font-weight:800;color:${INK};letter-spacing:0;">خطوة</div>
              <div style="height:6px;width:56px;background:${YELLOW};margin-top:8px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;direction:rtl;text-align:right;">
              <h1 style="margin:0 0 16px;font-size:22px;line-height:1.5;font-weight:800;color:${INK};">${heading}</h1>
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 24px;direction:rtl;text-align:right;">
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:${YELLOW};color:${INK};text-decoration:none;font-size:16px;font-weight:700;padding:14px 30px;border:2px solid ${INK};border-bottom-width:5px;border-left-width:5px;">${buttonLabel}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;direction:rtl;text-align:right;">
              <p style="margin:0 0 10px;font-size:13px;line-height:1.8;color:${MUTED};">${note}</p>
              <p style="margin:0;font-size:12px;line-height:1.8;color:${MUTED};">إن لم يعمل الزر، انسخ هذا الرابط والصقه في المتصفح:<br><a href="{{ .ConfirmationURL }}" style="color:${MUTED};word-break:break-all;direction:ltr;unicode-bidi:embed;">{{ .ConfirmationURL }}</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;border-top:2px solid ${INK};background:${CREAM};direction:rtl;text-align:right;">
              <p style="margin:0;font-size:12px;line-height:1.8;color:${MUTED};">خطوة · منصة الاستعداد لاختبار STEP<br>للمساعدة راسلنا على <a href="mailto:supportkhatwa@gmail.com" style="color:${INK};font-weight:700;">supportkhatwa@gmail.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export interface EmailTemplate {
  /** Supabase Management API field stem, e.g. "recovery". */
  key: "confirmation" | "recovery" | "magic_link" | "email_change";
  subject: string;
  html: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    key: "confirmation",
    subject: "أكّد بريدك الإلكتروني في خطوة",
    html: layout({
      title: "تأكيد البريد الإلكتروني",
      heading: "أهلاً بك في خطوة",
      paragraphs: [
        "شكراً لانضمامك. بقيت خطوة واحدة: أكّد بريدك الإلكتروني لتبدأ رحلتك نحو إتقان اللغة والنجاح في اختبار STEP.",
      ],
      buttonLabel: "تأكيد البريد الإلكتروني",
      note: "إن لم تنشئ حساباً في خطوة فتجاهل هذه الرسالة، ولن يحدث شيء.",
    }),
  },
  {
    key: "recovery",
    subject: "إعادة تعيين كلمة المرور في خطوة",
    html: layout({
      title: "إعادة تعيين كلمة المرور",
      heading: "إعادة تعيين كلمة المرور",
      paragraphs: [
        "وصلنا طلب لإعادة تعيين كلمة المرور للحساب <strong dir=\"ltr\">{{ .Email }}</strong>.",
        "اضغط الزر أدناه لاختيار كلمة مرور جديدة.",
      ],
      buttonLabel: "اختيار كلمة مرور جديدة",
      note: "الرابط صالح لمدة ساعة. إن لم تطلب ذلك فتجاهل الرسالة، وستبقى كلمة مرورك كما هي.",
    }),
  },
  {
    key: "magic_link",
    subject: "رابط الدخول إلى خطوة",
    html: layout({
      title: "رابط الدخول",
      heading: "ادخل إلى حسابك",
      paragraphs: ["اضغط الزر أدناه لتسجيل الدخول إلى خطوة مباشرة، بلا كلمة مرور."],
      buttonLabel: "الدخول إلى خطوة",
      note: "الرابط يعمل مرة واحدة ولمدة محدودة. إن لم تطلبه فتجاهل الرسالة.",
    }),
  },
  {
    key: "email_change",
    subject: "تأكيد تغيير البريد الإلكتروني في خطوة",
    html: layout({
      title: "تأكيد تغيير البريد",
      heading: "تأكيد تغيير البريد الإلكتروني",
      paragraphs: [
        "طلبت تغيير بريد حسابك من <strong dir=\"ltr\">{{ .Email }}</strong> إلى <strong dir=\"ltr\">{{ .NewEmail }}</strong>.",
        "اضغط الزر أدناه لتأكيد التغيير.",
      ],
      buttonLabel: "تأكيد التغيير",
      note: "إن لم تطلب هذا التغيير فتجاهل الرسالة وغيّر كلمة مرورك للحفاظ على أمان حسابك.",
    }),
  },
];
