import { z } from "zod";

/** Schemas are built per-locale (called with `useTranslations("settings...")`
 * from the form component) rather than exported as static objects, since
 * their error messages need to follow the active locale — including the
 * delete-confirmation word itself, which differs from language to language. */
type Translator = (key: string, values?: Record<string, string | number>) => string;

export function buildChangePasswordSchema(t: Translator) {
  return z
    .object({
      currentPassword: z.string().min(1, t("errors.currentPasswordRequired")),
      newPassword: z.string().min(8, t("errors.newPasswordMin")),
      confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("errors.mismatch"),
      path: ["confirmNewPassword"],
    });
}

export type ChangePasswordInput = z.infer<ReturnType<typeof buildChangePasswordSchema>>;

export function buildDeleteAccountSchema(t: Translator, confirmWord: string) {
  return z.object({
    password: z.string().min(1, t("errors.passwordRequired")),
    confirmation: z.literal(confirmWord, { error: t("errors.confirmationMismatch", { word: confirmWord }) }),
  });
}

export type DeleteAccountInput = z.infer<ReturnType<typeof buildDeleteAccountSchema>>;
