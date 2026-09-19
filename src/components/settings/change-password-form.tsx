"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { buildChangePasswordSchema, type ChangePasswordInput } from "@/lib/validation/settings";
import { changePassword } from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/error-messages";

export function ChangePasswordForm() {
  const t = useTranslations("settings.changePassword");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(buildChangePasswordSchema(t)),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setFormError(null);
    setSuccess(false);
    setIsSubmitting(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      setSuccess(true);
      reset();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 font-semibold">
        <KeyRound className="size-4 text-ink-violet dark:text-primary-300" />
        {t("title")}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
          <Input id="currentPassword" type="password" dir="ltr" error={Boolean(errors.currentPassword)} {...register("currentPassword")} />
          <FieldError id="currentPassword-error">{errors.currentPassword?.message}</FieldError>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="newPassword">{t("newPassword")}</Label>
            <Input id="newPassword" type="password" dir="ltr" error={Boolean(errors.newPassword)} {...register("newPassword")} />
            <FieldError id="newPassword-error">{errors.newPassword?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="confirmNewPassword">{t("confirmPassword")}</Label>
            <Input id="confirmNewPassword" type="password" dir="ltr" error={Boolean(errors.confirmNewPassword)} {...register("confirmNewPassword")} />
            <FieldError id="confirmNewPassword-error">{errors.confirmNewPassword?.message}</FieldError>
          </div>
        </div>

        {formError && <p role="alert" className="text-sm text-error">{formError}</p>}
        {success && <p role="status" className="text-sm text-success">{t("success")}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </form>
    </Card>
  );
}
