import { useTranslations } from "next-intl";
import { Check, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ListeningPlayer } from "./listening-player";
import type { Question, ReadingPassage } from "@/types/question";

interface QuestionViewProps {
  question: Question;
  passage?: ReadingPassage;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
}

/**
 * Exam question. With a passage or audio it becomes a split view: the
 * material on one side and the question with its answers on the other, each
 * scrolling on its own so the passage stays in view while answering. Without
 * material the question is a single centred column.
 */
export function QuestionView({
  question,
  passage,
  selectedOptionId,
  onSelect,
}: QuestionViewProps) {
  const t = useTranslations("exam");
  const hasMaterial = Boolean(
    passage || question.audioUrl || question.transcript,
  );

  const material = (
    <>
      {passage && (
        <article className="max-h-[34vh] overflow-y-auto border-s-4 border-primary-500 bg-surface-muted/50 px-5 py-4 sm:px-8 sm:py-5">
          <h3 className="text-xl font-bold leading-snug sm:text-2xl" dir="ltr">
            {passage.title}
          </h3>
          <p
            className="mt-3 whitespace-pre-line text-base leading-8 text-foreground/90 sm:text-lg sm:leading-8"
            dir="ltr"
          >
            {passage.body}
          </p>
        </article>
      )}

      {question.audioUrl && (
        <div className="border border-border bg-surface-muted/50 p-5">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Volume2 className="size-5 text-ink-violet dark:text-primary-300" />
            {t("audioNote")}
          </div>
          <audio
            controls
            preload="none"
            className="mt-4 w-full"
            src={question.audioUrl}
          />
        </div>
      )}

      {question.transcript && !question.audioUrl && (
        <ListeningPlayer transcript={question.transcript} />
      )}
    </>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 sm:px-8 sm:py-6">
        {hasMaterial && <div className="space-y-4">{material}</div>}

        <div>
          <p
            className="text-xl font-semibold leading-snug sm:text-2xl"
            dir="ltr"
          >
            {question.prompt}
          </p>

          <div className="mt-4 space-y-2.5" role="group">
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
                    "flex min-h-14 w-full items-center gap-4 rounded-xl border-2 px-4 py-3 text-start text-lg leading-snug transition-colors sm:px-5 sm:text-xl",
                    isSelected
                      ? "border-primary-500 bg-primary-100 font-semibold dark:bg-primary-500/15"
                      : "border-border hover:border-primary-300 hover:bg-surface-muted",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-full border-2 font-sans text-base font-bold leading-none",
                      isSelected
                        ? "border-primary-600 bg-primary-500 text-ink-violet"
                        : "border-border text-muted",
                    )}
                  >
                    <span className="block leading-none">
                      {option.id.toUpperCase()}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">{option.text}</span>
                  {isSelected && (
                    <Check className="size-5 shrink-0 text-ink-violet dark:text-primary-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
