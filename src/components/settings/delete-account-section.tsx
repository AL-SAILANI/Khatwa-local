"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { buildDeleteAccountSchema, type DeleteAccountInput } from "@/lib/validation/settings";
import { deleteAccount } from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/error-messages";

export function DeleteAccountSection() {
  const t = useTranslations("settings.deleteAccount");
  const confirmWord = t("confirmWord");
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountInput>({
    resolver: zodResolver(buildDeleteAccountSchema(t, confirmWord)),
    defaultValues: { password: "", confirmation: undefined },
  });

  const onSubmit = async (data: DeleteAccountInput) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      await deleteAccount(data.password);
      router.push("/");
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-error/30">
      <div className="flex items-center gap-2 font-semibold text-error-600 dark:text-error-300">
        <AlertTriangle className="size-4" />
        {t("title")}
      </div>
      <p className="mt-2 text-sm text-muted">{t("warning")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <Label htmlFor="deletePassword">{t("passwordLabel")}</Label>
          <Input id="deletePassword" type="password" dir="ltr" error={Boolean(errors.password)} {...register("password")} />
          <FieldError id="deletePassword-error">{errors.password?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="deleteConfirmation">{t("confirmLabel", { word: confirmWord })}</Label>
          <Input id="deleteConfirmation" error={Boolean(errors.confirmation)} {...register("confirmation")} />
          <FieldError id="deleteConfirmation-error">{errors.confirmation?.message}</FieldError>
        </div>

        {formError && <p role="alert" className="text-sm text-error">{formError}</p>}

        <Button type="submit" variant="outline" className="border-error text-error-600 hover:bg-error/5 dark:text-error-300" disabled={isSubmitting}>
          {isSubmitting ? t("deleting") : t("deleteButton")}
        </Button>
      </form>
    </Card>
  );
}
