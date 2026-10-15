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
        <article>
          <h3 className="text-xl font-bold leading-snug sm:text-2xl" dir="ltr">
            {passage.title}
          </h3>
          <p
            className="mt-4 whitespace-pre-line text-base leading-8 text-foreground/90 sm:text-xl sm:leading-10"
            dir="ltr"
          >
            {passage.body}
          </p>
        </article>
      )}

      {question.audioUrl && (
        <div>
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

  const answers = (
    <div
      className={cn("w-full", hasMaterial ? "max-w-2xl" : "mx-auto max-w-3xl")}
    >
      <p
        className={cn(
          "font-semibold leading-snug",
          hasMaterial ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl",
        )}
        dir="ltr"
      >
        {question.prompt}
      </p>

      <div className="mt-6 space-y-3" role="group">
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
                "flex min-h-16 w-full items-center gap-4 border-2 px-4 py-3.5 text-start text-lg leading-snug transition-colors sm:px-5 sm:text-xl",
                isSelected
                  ? "border-primary-500 bg-primary-100 font-semibold dark:bg-primary-500/15"
                  : "border-border hover:border-primary-300 hover:bg-surface-muted",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center border-2 text-base font-bold",
                  isSelected
                    ? "border-primary-600 bg-primary-500 text-ink-violet"
                    : "border-border text-muted",
                )}
              >
                {option.id.toUpperCase()}
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
  );

  if (!hasMaterial) {
    return (
      <div className="px-4 py-6 sm:px-8 sm:py-10 lg:h-full lg:overflow-y-auto">
        {answers}
      </div>
    );
  }

  return (
    <div className="grid lg:h-full lg:grid-cols-2">
      <section
        aria-label={t("audioNote")}
        className="max-h-[42vh] space-y-4 overflow-y-auto border-b border-border bg-surface-muted/40 px-4 py-4 sm:px-8 sm:py-8 lg:max-h-none lg:border-b-0 lg:border-e"
      >
        {material}
      </section>
      <section className="px-4 py-5 sm:px-8 sm:py-8 lg:overflow-y-auto">
        {answers}
      </section>
    </div>
  );
}
