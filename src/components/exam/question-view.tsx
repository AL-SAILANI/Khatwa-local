import { useTranslations } from "next-intl";
import { Headphones, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { Question, ReadingPassage } from "@/types/question";

interface QuestionViewProps {
  question: Question;
  passage?: ReadingPassage;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
}

export function QuestionView({ question, passage, selectedOptionId, onSelect }: QuestionViewProps) {
  const t = useTranslations("exam");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {passage && (
        <Card className="max-h-[60vh] overflow-y-auto">
          <h3 className="font-semibold">{passage.title}</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90" dir="ltr">
            {passage.body}
          </p>
        </Card>
      )}

      {question.audioUrl && (
        <Card className="max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Volume2 className="size-4 text-ink-violet dark:text-primary-300" />
            {t("audioNote")}
          </div>
          <audio controls preload="none" className="mt-3 w-full" src={question.audioUrl} />
        </Card>
      )}

      {question.transcript && !question.audioUrl && (
        <Card className="max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Headphones className="size-4 text-ink-violet dark:text-primary-300" />
            {t("transcriptNote")}
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90" dir="ltr">
            {question.transcript}
          </p>
        </Card>
      )}

      <div className={cn(!passage && !question.audioUrl && !question.transcript && "lg:col-span-2")}>
        <p className="text-base font-medium leading-relaxed" dir="ltr">
          {question.prompt}
        </p>

        <div className="mt-6 space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                dir="ltr"
                aria-pressed={isSelected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-4 text-start text-sm transition-all duration-200",
                  isSelected
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                    : "border-border hover:border-primary-300 hover:bg-surface-muted",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isSelected
                      ? "border-primary-600 bg-primary-600 text-ink-violet"
                      : "border-border text-muted",
                  )}
                >
                  {option.id.toUpperCase()}
                </span>
                {option.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
