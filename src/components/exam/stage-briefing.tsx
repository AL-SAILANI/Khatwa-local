import { useTranslations } from "next-intl";
import { CheckCircle2, Clock, HelpCircle, Lock, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
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
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-6">
      <Card className="space-y-6 p-6 sm:p-8">
        <div>
          <p className="text-xs font-semibold text-muted">
            {t("stageOf", { current: stageNumber, total: stageTotal })}
          </p>
          <h2 className="mt-1 text-2xl font-bold">{t(`name.${key}`)}</h2>
          <p className="mt-2 text-sm text-muted">{t(`about.${key}`)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 border border-border p-3">
            <HelpCircle className="size-5 text-ink-violet dark:text-primary-300" />
            <div>
              <p className="text-lg font-bold tabular-nums">{stage.count}</p>
              <p className="text-xs text-muted">{t("questions")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-border p-3">
            <Clock className="size-5 text-ink-violet dark:text-primary-300" />
            <div>
              <p className="text-lg font-bold tabular-nums">{stage.minutes}</p>
              <p className="text-xs text-muted">{t("minutes")}</p>
            </div>
          </div>
        </div>

        <ul className="space-y-2.5">
          {rules.map((rule, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm">
              {index === 1 ? (
                <Lock className="mt-0.5 size-4 shrink-0 text-warning-600 dark:text-warning-400" />
              ) : (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              )}
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        <Button size="lg" className="w-full" onClick={onStart}>
          <Play className="size-4" />
          {t("start")}
        </Button>
      </Card>
    </div>
  );
}
