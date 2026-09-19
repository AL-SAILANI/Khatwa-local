import { z } from "zod";
import { STUDY_GOALS } from "@/lib/constants/exam";

/** Built per-locale (called with `useTranslations("auth.login"/"auth.register")`
 * from the form component) so validation error messages follow the active
 * locale instead of always showing Arabic. */
type Translator = (key: string) => string;

export function buildLoginSchema(t: Translator) {
  return z.object({
    email: z.string().min(1, t("errors.emailRequired")).email(t("errors.emailInvalid")),
    password: z.string().min(1, t("errors.passwordRequired")),
    rememberMe: z.boolean(),
  });
}

export type LoginInput = z.infer<ReturnType<typeof buildLoginSchema>>;

export function buildRegisterSchema(t: Translator) {
  return z
    .object({
      name: z.string().min(2, t("errors.nameMin")),
      email: z.string().min(1, t("errors.emailRequired")).email(t("errors.emailInvalid")),
      password: z.string().min(8, t("errors.passwordMin")),
      confirmPassword: z.string(),
      goal: z
        .number({ error: t("errors.goalRequired") })
        .refine((value) => (STUDY_GOALS as readonly number[]).includes(value), {
          message: t("errors.goalRequired"),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("errors.passwordMismatch"),
      path: ["confirmPassword"],
    });
}

export type RegisterInput = z.infer<ReturnType<typeof buildRegisterSchema>>;
