"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, FieldError, FieldHint } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AvatarPicker } from "@/components/avatar/avatar-picker";
import { GoogleIcon } from "@/components/brand/google-icon";
import { cn } from "@/lib/utils/cn";
import {
  registerWithEmail,
  loginWithGoogle,
} from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/error-messages";
import type { Gender } from "@/types/user";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [examRegistered, setExamRegistered] = useState<string | null>(null);
  const [examDate, setExamDate] = useState<string>("");

  function toLocalDateString(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  const registerSchema = z
    .object({
      name: z.string(),
      age: z
        .string()
        .refine((v) => v.trim() !== "", { message: t("errors.ageRequired") })
        .refine((v) => {
          const n = Number(v);
          return Number.isInteger(n) && n >= 13 && n <= 80;
        }, { message: t("errors.ageRange") }),
      email: z.string().min(1, t("errors.emailRequired")).email(t("errors.emailInvalid")),
      password: z.string().min(8, t("errors.passwordMin")),
      confirmPassword: z.string(),
      gender: z.enum(["male", "female"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("errors.passwordMismatch"),
      path: ["confirmPassword"],
    });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", age: "", email: "", password: "", confirmPassword: "", gender: undefined },
  });

  const handleGenderChange = (value: Gender) => {
    setGender(value);
    setGenderError(null);
    setValue("gender", value, { shouldValidate: true });
    setAvatar(null);
  };

  const handleRadioGroupKeyDown = <T extends string>(
    e: React.KeyboardEvent,
    values: readonly T[],
    current: T | null,
    onChange: (value: T) => void,
  ) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const currentIndex = current ? values.indexOf(current) : -1;
    const direction = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + direction + values.length) % values.length;
    const next = values[nextIndex] as T;
    onChange(next);
    document.getElementById(`radio-${next}`)?.focus();
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setFormError(null);
    if (!data.gender) {
      setGenderError(t("errors.genderRequired"));
      return;
    }
    setIsSubmitting(true);
    try {
      await registerWithEmail({
        name: data.name,
        email: data.email,
        password: data.password,
        goal: null,
        age: Number(data.age),
        gender: data.gender,
        avatarEmoji: avatar,
        examDate: examRegistered === "yes" && examDate ? examDate : null,
      });
      router.push("/dashboard");
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocial = async (login: () => Promise<unknown>) => {
    setFormError(null);
    try {
      await login();
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
          <Label htmlFor="name">{t("nameOptional")}</Label>
          <Input id="name" placeholder={t("namePlaceholder")} {...register("name")} />
        </div>

        <div>
          <Label>{t("genderLabel")}</Label>
          <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label={t("genderLabel")}
            aria-invalid={Boolean(genderError || errors.gender?.message)}
            aria-describedby={genderError || errors.gender?.message ? "gender-error" : undefined}
            onKeyDown={(e) =>
              handleRadioGroupKeyDown(e, ["male", "female"], gender, handleGenderChange)
            }
          >
            {(["male", "female"] as const).map((value) => (
              <button
                key={value}
                id={`radio-${value}`}
                type="button"
                role="radio"
                aria-checked={gender === value}
                tabIndex={gender === value ? 0 : -1}
                onClick={() => handleGenderChange(value)}
                className={cn(
                  "rounded-xl border py-2.5 text-sm font-semibold transition-all duration-200",
                  gender === value
                    ? "border-primary-500 bg-primary-50 text-ink-violet ring-1 ring-primary-500 dark:bg-primary-500/10 dark:text-primary-300"
                    : "border-border text-foreground/70 hover:border-primary-400 hover:text-ink-violet dark:hover:text-primary-300",
                )}
              >
                {t(`gender${value[0]!.toUpperCase()}${value.slice(1)}`)}
              </button>
            ))}
          </div>
          {(genderError || errors.gender?.message) && (
            <FieldError id="gender-error">{genderError ?? errors.gender?.message}</FieldError>
          )}
        </div>

        <div>
          <Label htmlFor="age">{t("ageLabel")}</Label>
          <Input
            id="age"
            type="number"
            inputMode="numeric"
            min={13}
            max={80}
            placeholder={t("agePlaceholder")}
            error={Boolean(errors.age)}
            aria-describedby={errors.age ? "age-error" : "age-hint"}
            {...register("age")}
          />
          <FieldHint id="age-hint">{t("ageHelp")}</FieldHint>
          <FieldError id="age-error">{errors.age?.message}</FieldError>
        </div>

        <div>
          <Label>{t("avatarLabel")} <span className="text-xs font-normal text-muted">{t("avatarOptional")}</span></Label>
          <p className="mb-2 text-xs leading-relaxed text-muted">{t("avatarDescription")}</p>
          <div className="rounded-2xl border border-border bg-surface-muted/40 p-3">
            <AvatarPicker value={avatar} onChange={setAvatar} gender={gender} />
          </div>
        </div>

        <div>
          <Label>{t("examLabel")}</Label>
          <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label={t("examLabel")}
            onKeyDown={(e) =>
              handleRadioGroupKeyDown(e, ["yes", "no"], examRegistered, (v) => setExamRegistered(v))
            }
          >
            {(["yes", "no"] as const).map((value) => (
              <button
                key={value}
                id={`radio-${value}`}
                type="button"
                role="radio"
                aria-checked={examRegistered === value}
                tabIndex={examRegistered === value ? 0 : -1}
                onClick={() => setExamRegistered(value)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                  examRegistered === value
                    ? "border-primary-500 bg-primary-50 text-ink-violet ring-1 ring-primary-500 dark:bg-primary-500/10 dark:text-primary-300"
                    : "border-border text-foreground/70 hover:border-primary-400 hover:text-ink-violet dark:hover:text-primary-300",
                )}
              >
                {t(value === "yes" ? "examRegistered" : "examNotRegistered")}
              </button>
            ))}
          </div>
          {examRegistered === "yes" && (
            <div className="mt-3">
              <Label htmlFor="examDate">{t("examDateLabel")}</Label>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                min={toLocalDateString(new Date())}
                onChange={(e) => setExamDate(e.target.value)}
              />
              <FieldHint id="examDate-hint">{t("examDateHelp")}</FieldHint>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" dir="ltr" error={Boolean(errors.email)} {...register("email")} />
          <FieldError id="email-error">{errors.email?.message}</FieldError>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <Button variant="outline" size="lg" type="button" onClick={() => handleSocial(loginWithGoogle)} aria-label={tAuth("continueWithGoogle")} className="h-12 gap-2.5 px-2 text-sm sm:px-4">
          <GoogleIcon className="size-5" />
          <span className="hidden sm:inline">Google</span>
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-ink-violet transition-colors hover:text-ink-violet dark:text-primary-400 dark:hover:text-primary-300">
          {t("login")}
        </Link>
      </p>
    </Card>
  );
}
