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
  /** The stage cannot be reopened at all (listening clips play once). */
  locked?: boolean;
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
  locked = false,
  onBack,
  onFinish,
  isSubmitting,
}: StageReviewProps) {
  const t = useTranslations("exam.stage");

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 py-4">
      <div>
        <h2 className="text-3xl font-bold">
          {t("reviewTitle", { name: t(`name.${stage.key}`) })}
        </h2>
        <p className="mt-2 flex items-center gap-2 text-base text-muted">
          <Lock className="size-3.5" />
          {isLastStage ? t("reviewFinalNote") : t("reviewNote")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="flex items-center gap-3 p-4">
          <CheckCircle2 className="size-6 text-success" />
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {summary.answered}
            </p>
            <p className="text-sm text-muted">{t("answered")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <Circle className="size-6 text-muted" />
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {summary.unanswered}
            </p>
            <p className="text-sm text-muted">{t("unanswered")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <Flag className="size-6 text-warning" />
          <div>
            <p className="text-2xl font-bold tabular-nums">{summary.flagged}</p>
            <p className="text-sm text-muted">{t("flagged")}</p>
          </div>
        </Card>
      </div>

      {summary.unanswered > 0 && (
        <p className="flex items-start gap-2 border border-warning/40 bg-warning/10 p-4 text-base">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-600 dark:text-warning-400" />
          {t("unansweredWarning", { count: summary.unanswered })}
        </p>
      )}

      {!locked && (
        <Card className="p-4">
          <StageNavigator
            start={stage.start}
            count={stage.count}
            currentIndex={currentIndex}
            answeredIndexes={answeredIndexes}
            flaggedIndexes={flaggedIndexes}
            onJump={onJump}
            size="md"
          />
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
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
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        {!locked && (
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={onBack}
          >
            {t("backToQuestions")}
          </Button>
        )}
        <Button
          size="lg"
          className="flex-1"
          onClick={onFinish}
          disabled={isSubmitting}
        >
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
