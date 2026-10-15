import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle2, Circle, Flag, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageNavigator } from "@/components/exam/stage-navigator";
import type { ExamStage } from "@/lib/exam-stages";

interface StageReviewProps {
  stage: ExamStage;
  isLastStage: boolean;
  currentIndex: number;
  summary: {
    total: number;
    answered: number;
    unanswered: number;
    flagged: number;
  };
  answeredIndexes: Set<number>;
  flaggedIndexes: Set<number>;
  onJump: (index: number) => void;
  onBack: () => void;
  onFinish: () => void;
  isSubmitting: boolean;
}

/** Review of the current stage before it is closed (stages cannot be reopened). */
export function StageReview({
  stage,
  isLastStage,
  currentIndex,
  summary,
  answeredIndexes,
  flaggedIndexes,
  onJump,
  onBack,
  onFinish,
  isSubmitting,
}: StageReviewProps) {
  const t = useTranslations("exam.stage");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 py-4">
      <div>
        <h2 className="text-xl font-bold">
          {t("reviewTitle", { name: t(`name.${stage.key}`) })}
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <Lock className="size-3.5" />
          {isLastStage ? t("reviewFinalNote") : t("reviewNote")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="flex items-center gap-2 p-3">
          <CheckCircle2 className="size-4 text-success" />
          <div>
            <p className="text-lg font-bold tabular-nums">{summary.answered}</p>
            <p className="text-xs text-muted">{t("answered")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-2 p-3">
          <Circle className="size-4 text-muted" />
          <div>
            <p className="text-lg font-bold tabular-nums">
              {summary.unanswered}
            </p>
            <p className="text-xs text-muted">{t("unanswered")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-2 p-3">
          <Flag className="size-4 text-warning" />
          <div>
            <p className="text-lg font-bold tabular-nums">{summary.flagged}</p>
            <p className="text-xs text-muted">{t("flagged")}</p>
          </div>
        </Card>
      </div>

      {summary.unanswered > 0 && (
        <p className="flex items-start gap-2 border border-warning/40 bg-warning/10 p-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-600 dark:text-warning-400" />
          {t("unansweredWarning", { count: summary.unanswered })}
        </p>
      )}

      <Card className="p-3">
        <StageNavigator
          start={stage.start}
          count={stage.count}
          currentIndex={currentIndex}
          answeredIndexes={answeredIndexes}
          flaggedIndexes={flaggedIndexes}
          onJump={onJump}
          size="md"
        />
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-3 border border-primary-400 bg-primary-100 dark:bg-primary-500/20" />
            {t("legendAnswered")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 border border-border" />
            {t("legendUnanswered")}
          </span>
          <span className="flex items-center gap-1.5">
            <Flag className="size-3 fill-warning text-warning" />
            {t("legendFlagged")}
          </span>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          {t("backToQuestions")}
        </Button>
        <Button className="flex-1" onClick={onFinish} disabled={isSubmitting}>
          {isSubmitting
            ? t("submitting")
            : isLastStage
              ? t("submitExam")
              : t("finishStage")}
        </Button>
      </div>
    </div>
  );
}
