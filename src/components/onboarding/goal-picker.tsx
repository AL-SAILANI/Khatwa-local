"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useRouter } from "@/i18n/navigation";
import { updateUserProfile } from "@/lib/firestore/users";
import { STUDY_GOALS } from "@/lib/constants/exam";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { StudyGoal } from "@/types/user";

export function GoalPicker() {
  const t = useTranslations("onboarding");
  const { user } = useUserProfile();
  const router = useRouter();
  const [selected, setSelected] = useState<StudyGoal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || selected === null) return;
    setIsSubmitting(true);
    await updateUserProfile(user.uid, { goal: selected });
    router.push("/dashboard");
  };

  return (
    <Card className="w-full max-w-md p-8 text-center">
      <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-butter-yellow text-ink-violet">
        <Target className="size-6" />
      </div>
      <h1 className="mt-5 text-2xl font-bold">{t("goalQuestion")}</h1>
      <p className="mt-2 text-sm text-muted">{t("goalDescription")}</p>

      <div className="mt-8 grid grid-cols-3 gap-2 min-[400px]:grid-cols-5" role="radiogroup" aria-label={t("goalQuestion")}>
        {STUDY_GOALS.map((goal) => (
          <button
            key={goal}
            type="button"
            role="radio"
            aria-checked={selected === goal}
            onClick={() => setSelected(goal)}
            className={cn(
              "rounded-xl border py-3 text-sm font-semibold transition-all duration-200",
              selected === goal
                ? "border-primary-500 bg-primary-50 text-ink-violet ring-1 ring-primary-500 dark:bg-primary-500/10 dark:text-primary-300"
                : "border-border text-foreground/70 hover:border-primary-400 hover:text-ink-violet dark:hover:text-primary-300",
            )}
          >
            {goal === 95 ? "+95" : goal}
          </button>
        ))}
      </div>

      <Button
        className="mt-8 w-full"
        size="lg"
        disabled={selected === null || isSubmitting}
        onClick={handleSubmit}
      >
        {t("continue")}
      </Button>
    </Card>
  );
}
