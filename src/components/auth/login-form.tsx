"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { GoogleIcon } from "@/components/brand/google-icon";
import { buildLoginSchema, type LoginInput } from "@/lib/validation/auth";
import { loginWithEmail, loginWithGoogle } from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/error-messages";

const REMEMBER_KEY = "khatwa.remembered-email";

function loadRemembered(): string | null {
  try {
    return window.localStorage.getItem(REMEMBER_KEY);
  } catch {
    return null;
  }
}

function saveRemembered(email: string) {
  try {
    window.localStorage.setItem(REMEMBER_KEY, email);
  } catch {
    /* storage unavailable — ignore */
  }
}

function clearRemembered() {
  try {
    window.localStorage.removeItem(REMEMBER_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
}

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(buildLoginSchema(t)),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  useEffect(() => {
    const remembered = loadRemembered();
    if (!remembered) return;
    setValue("email", remembered);
  }, [setValue]);

  const onSubmit = async (data: LoginInput) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      await loginWithEmail(data.email, data.password, data.rememberMe);
      if (data.rememberMe) {
        saveRemembered(data.email);
      } else {
        clearRemembered();
      }
      router.push("/dashboard");
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setFormError(null);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  };

  return (
    <Card className="w-full max-w-lg" padding="lg" elevation="level2">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" dir="ltr" error={Boolean(errors.email)} {...register("email")} />
          <FieldError id="email-error">{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="password">{t("password")}</Label>
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-foreground/80">
            <input type="checkbox" className="size-4 rounded accent-primary-500" {...register("rememberMe")} />
            {t("rememberMe")}
          </label>
          <Link href="/forgot-password" className="font-medium text-ink-violet dark:text-primary-400">
            {t("forgotPassword")}
          </Link>
        </div>

        {formError && <p role="alert" className="text-sm text-error">{formError}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {t("submit")}
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        {t("orContinueWith")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <Button variant="outline" size="lg" onClick={handleGoogle} type="button" aria-label={t("continueWithGoogle")} className="h-12 gap-2.5 px-2 text-sm sm:px-4">
          <GoogleIcon className="size-5" />
          <span className="hidden sm:inline">Google</span>
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-ink-violet transition-colors hover:text-ink-violet dark:text-primary-400 dark:hover:text-primary-300">
          {t("createAccount")}
        </Link>
      </p>
    </Card>
  );
}
