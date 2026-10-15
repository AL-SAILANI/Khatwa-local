import { useTranslations } from "next-intl";
import { CheckCircle2, Clock, HelpCircle, Lock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExamStage, StageKey } from "@/lib/exam-stages";

interface StageBriefingProps {
  stage: ExamStage;
  stageNumber: number;
  stageTotal: number;
  onStart: () => void;
}

/** Shown before every stage: what it contains, how long it lasts and the rules. */
export function StageBriefing({
  stage,
  stageNumber,
  stageTotal,
  onStart,
}: StageBriefingProps) {
  const t = useTranslations("exam.stage");
  const key: StageKey = stage.key;
  const rules = [
    t("ruleTimer", { minutes: stage.minutes }),
    t("ruleNoReturn"),
    t(`rule.${key}`),
    t("ruleUnanswered"),
  ];

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 content-center gap-8 px-4 py-8 sm:px-8 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold text-muted sm:text-base">
          {t("stageOf", { current: stageNumber, total: stageTotal })}
        </p>
        <h2 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">
          {t(`name.${key}`)}
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted sm:text-xl">
          {t(`about.${key}`)}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 border-2 border-border p-5">
            <HelpCircle className="size-8 text-ink-violet dark:text-primary-300" />
            <div>
              <p className="text-3xl font-bold tabular-nums">{stage.count}</p>
              <p className="text-sm text-muted">{t("questions")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 border-2 border-border p-5">
            <Clock className="size-8 text-ink-violet dark:text-primary-300" />
            <div>
              <p className="text-3xl font-bold tabular-nums">{stage.minutes}</p>
              <p className="text-sm text-muted">{t("minutes")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center border-2 border-border bg-surface p-6 sm:p-8">
        <ul className="space-y-5">
          {rules.map((rule, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-lg leading-7"
            >
              {index === 1 ? (
                <Lock className="mt-1 size-5 shrink-0 text-warning-600 dark:text-warning-400" />
              ) : (
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-success" />
              )}
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        <Button size="xl" className="mt-8 w-full" onClick={onStart}>
          <Play className="size-5" />
          {t("start")}
        </Button>
      </div>
    </div>
  );
}
