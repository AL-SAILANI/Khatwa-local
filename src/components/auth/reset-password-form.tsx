"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, FieldError } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { confirmNewPassword } from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/error-messages";

export function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword");
  const tAuth = useTranslations("auth");
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = z
    .object({
      password: z.string().min(8, t("errors.passwordMin")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("errors.passwordMismatch"),
      path: ["confirmPassword"],
    });
  type Input = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({ resolver: zodResolver(schema), defaultValues: { password: "", confirmPassword: "" } });

  const onSubmit = async (data: Input) => {
    if (!oobCode) {
      setFormError(t("errors.missingCode"));
      return;
    }
    setFormError(null);
    setIsSubmitting(true);
    try {
      await confirmNewPassword(oobCode, data.password);
      setDone(true);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!oobCode) {
    return (
      <Card className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold">{t("errors.missingCodeTitle")}</h1>
        <p className="mt-2 text-sm text-muted">{t("errors.missingCode")}</p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-none bg-primary-600 px-6 text-sm font-semibold text-ink-violet transition-colors hover:bg-primary-700"
        >
          {t("requestNewLink")}
        </Link>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="w-full max-w-md text-center">
        <CheckCircle2 className="mx-auto size-10 text-success" />
        <h1 className="mt-4 text-xl font-bold">{t("successTitle")}</h1>
        <p className="mt-2 text-sm text-muted">{t("successNote")}</p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-none bg-primary-600 px-6 text-sm font-semibold text-ink-violet transition-colors hover:bg-primary-700"
        >
          {t("login")}
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
          <Label htmlFor="password">{t("newPassword")}</Label>
          <PasswordInput
            id="password"
            dir="ltr"
            error={Boolean(errors.password)}
            showLabel={tAuth("showPassword")}
            hideLabel={tAuth("hidePassword")}
            {...register("password")}
          />
          <FieldError id="password-error">{errors.password?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <PasswordInput
            id="confirmPassword"
            dir="ltr"
            error={Boolean(errors.confirmPassword)}
            showLabel={tAuth("showPassword")}
            hideLabel={tAuth("hidePassword")}
            {...register("confirmPassword")}
          />
          <FieldError id="confirmPassword-error">{errors.confirmPassword?.message}</FieldError>
        </div>

        {formError && <p role="alert" className="text-sm text-error">{formError}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {t("submit")}
        </Button>
      </form>
    </Card>
  );
}
