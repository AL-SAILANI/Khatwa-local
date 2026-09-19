"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";
import { resetPassword } from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/error-messages";
import { useLocale } from "next-intl";

export function ForgotPasswordForm() {
  const t = useTranslations("forgotPassword");
  const locale = useLocale();
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = z.object({
    email: z.string().min(1, t("errors.emailRequired")).email(t("errors.emailInvalid")),
  });
  type Input = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (data: Input) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      const origin =
        configuredUrl && !/localhost|127\.0\.0\.1/.test(configuredUrl)
          ? configuredUrl.replace(/\/$/, "")
          : typeof window !== "undefined"
            ? window.location.origin
            : configuredUrl || "http://localhost:3000";
      await resetPassword(data.email, {
        url: `${origin}/${locale}/reset-password`,
        handleCodeInApp: true,
      });
      setSent(true);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <Card className="w-full max-w-md text-center">
        <CheckCircle2 className="mx-auto size-10 text-success" />
        <h1 className="mt-4 text-xl font-bold">{t("checkEmailTitle")}</h1>
        <p className="mt-2 text-sm text-muted">{t("checkEmailNote")}</p>
        <p className="mt-2 text-xs text-muted">{t("checkSpam")}</p>
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-ink-violet dark:text-primary-400">
          {t("backToLogin")}
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input id="email" type="email" dir="ltr" error={Boolean(errors.email)} {...register("email")} />
          <FieldError id="email-error">{errors.email?.message}</FieldError>
        </div>

        {formError && <p role="alert" className="text-sm text-error">{formError}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {t("submit")}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        <Link href="/login" className="font-medium text-ink-violet dark:text-primary-400">
          {t("backToLogin")}
        </Link>
      </p>
    </Card>
  );
}
