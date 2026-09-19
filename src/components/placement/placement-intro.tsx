import { useTranslations } from "next-intl";
import { BookOpen, Clock, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STEP_SECTION_QUESTION_COUNTS } from "@/lib/constants/exam";

const PLACEMENT_QUESTIONS_PER_SECTION = 5;
const PLACEMENT_MINUTES = 20;

export function PlacementIntro({ onStart, isLoading }: { onStart: () => void; isLoading: boolean }) {
  const t = useTranslations("placementTest");
  const tTracks = useTranslations("trackNames");
  const totalQuestions = PLACEMENT_QUESTIONS_PER_SECTION * Object.keys(STEP_SECTION_QUESTION_COUNTS).length;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-butter-yellow text-ink-violet">
        <BookOpen className="size-7" />
      </div>

      <h1 className="mt-6 text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-muted">{t("description")}</p>

      <div className="mt-8 grid w-full grid-cols-2 gap-4">
        <Card className="text-center">
          <ListChecks className="mx-auto size-5 text-ink-violet dark:text-primary-300" />
          <div className="mt-2 text-lg font-bold">{totalQuestions}</div>
          <div className="text-xs text-muted">{t("questionUnit")}</div>
        </Card>
        <Card className="text-center">
          <Clock className="mx-auto size-5 text-ink-violet dark:text-primary-300" />
          <div className="mt-2 text-lg font-bold">{PLACEMENT_MINUTES}</div>
          <div className="text-xs text-muted">{t("minuteUnit")}</div>
        </Card>
      </div>

      <div className="mt-4 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.keys(STEP_SECTION_QUESTION_COUNTS).map((section) => (
          <Card key={section} className="text-center">
            <div className="text-lg font-bold">{PLACEMENT_QUESTIONS_PER_SECTION}</div>
            <div className="text-xs text-muted">{tTracks(section)}</div>
          </Card>
        ))}
      </div>

      <Button size="lg" className="mt-10" onClick={onStart} disabled={isLoading}>
        {isLoading ? t("preparing") : t("startNow")}
      </Button>
    </div>
  );
}

export { PLACEMENT_QUESTIONS_PER_SECTION, PLACEMENT_MINUTES };
