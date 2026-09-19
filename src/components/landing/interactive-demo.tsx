"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Timer, Trophy, CheckCircle2, XCircle, ArrowLeft, RotateCcw, Play, Sparkles } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { TicketButton } from "@/components/ui/ticket-button";
import { cn } from "@/lib/utils/cn";

const QUESTION_SECONDS = 30;

interface DemoQuestion {
  question: string;
  options: [string, string, string, string];
  correct: number;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function InteractiveDemo() {
  const t = useTranslations("interactiveDemo");
  const questions = t.raw("questions") as DemoQuestion[];
  const total = Math.max(questions.length, 1);

  const [phase, setPhase] = useState<"start" | "quiz" | "result">("start");
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const current = questions[index] ?? questions[0];

  useEffect(() => {
    if (!current || phase !== "quiz" || answered) return;
    const id = setInterval(() => {
      setTimeLeft((seconds) => {
        if (seconds <= 1) {
          clearInterval(id);
          setAnswered(true);
          setSelected(null);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, answered, index, current]);

  if (!current) return null;

  const handleStart = () => {
    setPhase("quiz");
    setIndex(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(QUESTION_SECONDS);
  };

  const isLast = index === total - 1;

  const handleSelect = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    if (optionIndex === current.correct) {
      setScore((value) => value + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setPhase("result");
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(QUESTION_SECONDS);
  };

  const feedback =
    answered && selected === current.correct
      ? { text: t("correct"), tone: "text-success-600 dark:text-success", icon: CheckCircle2 }
      : answered && selected !== null
        ? { text: t("wrong"), tone: "text-error-600 dark:text-error", icon: XCircle }
        : answered
          ? { text: t("timeUp"), tone: "text-error-600 dark:text-error", icon: Timer }
          : null;

  const FeedbackIcon = feedback?.icon ?? null;
  const passed = score >= Math.ceil(total / 2);

  return (
    <Section className="bg-surface-muted">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-3xl">
          <Card className="relative overflow-hidden p-0">
            <div className="h-1.5 bg-ink-violet" />

            <AnimatePresence mode="wait">
              {phase === "start" && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="p-8 text-center sm:p-12"
                >
                  <div className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-primary-500/10 text-ink-violet dark:text-primary-300">
                    <Trophy className="size-8" />
                  </div>
                  <p className="mt-6 text-xl font-bold leading-relaxed text-foreground">
                    {t("startTitle")}
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
                    {t("startNote", { total })}
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" onClick={handleStart} type="button" className="w-full sm:w-auto">
                      <Play className="size-5 rtl:rotate-180" />
                      {t("startButton")}
                    </Button>
                    <Link
                      href="/register"
                      className="inline-flex h-13 items-center justify-center gap-2 rounded-none px-8 text-base font-semibold text-ink-violet underline-offset-4 hover:underline dark:text-primary-300"
                    >
                      {t("skipCta")}
                    </Link>
                  </div>
                </motion.div>
              )}

              {phase === "quiz" && current && (
                <motion.div
                  key={`quiz-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-none border border-border bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground/70">
                      {t("questionCounter", { current: index + 1, total })}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-none border border-border bg-surface-muted px-3 py-1 text-xs font-semibold tabular-nums",
                          timeLeft <= 5 && !answered && "border-error/40 text-error-600 dark:text-error",
                        )}
                      >
                        <Timer className="size-3.5" />
                        {t("timerLabel")}: {formatTime(timeLeft)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-none border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-bold text-ink-violet dark:border-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                        <Trophy className="size-3.5" />
                        {t("scoreLabel")}: {score}
                      </span>
                    </div>
                  </div>

                  <div
                    className="mt-4 h-1 overflow-hidden rounded-none bg-border/60"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-none bg-ink-violet transition-all duration-1000 ease-linear"
                      style={{ width: `${(timeLeft / QUESTION_SECONDS) * 100}%` }}
                    />
                  </div>

                  {/* Question content is always English (STEP tests English), so it needs
                      an explicit direction — inside an RTL page, the Unicode bidi algorithm
                      sweeps trailing neutral punctuation like "?" to the visual start of the
                      line, since it sits on the boundary of the surrounding RTL paragraph. */}
                  <p dir="ltr" className="mt-6 text-start text-xl font-semibold leading-relaxed text-foreground">
                    {current.question}
                  </p>

                  <div className="mt-6 grid gap-3">
                    {current.options.map((option, optionIndex) => {
                      const isCorrect = answered && optionIndex === current.correct;
                      const isWrongPick = answered && optionIndex === selected && optionIndex !== current.correct;

                      return (
                        <button
                          key={`${index}-${optionIndex}`}
                          type="button"
                          disabled={answered}
                          onClick={() => handleSelect(optionIndex)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 text-start text-sm font-medium text-foreground transition-all duration-200 sm:py-3",
                            "hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-500/5",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                            "disabled:cursor-not-allowed",
                            isCorrect && "border-success bg-success/10 text-success-600 dark:text-success",
                            isWrongPick && "border-error bg-error/10 text-error-600 dark:text-error",
                            answered && !isCorrect && !isWrongPick && "opacity-50",
                          )}
                        >
                          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold opacity-80">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span className="flex-1 rtl:text-right">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {FeedbackIcon && feedback && (
                        <FeedbackIcon className={cn("size-5", feedback.tone)} aria-hidden="true" />
                      )}
                      {feedback && <span className={feedback.tone}>{feedback.text}</span>}
                      {!answered && <span className="text-muted">{t("pickHint")}</span>}
                    </div>

                    {answered ? (
                      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Button variant="ghost" size="sm" onClick={handleStart} type="button" className="w-full sm:w-auto">
                          <RotateCcw className="size-4" />
                          {t("restart")}
                        </Button>
                        <Button size="sm" onClick={handleNext} type="button" className="w-full sm:w-auto">
                          {isLast ? t("seeResult") : t("next")}
                          <ArrowLeft className="size-4 rtl:rotate-180" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted">{t("optionsHint")}</span>
                    )}
                  </div>
                </motion.div>
              )}

              {phase === "result" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="p-8 text-center sm:p-12"
                >
                  <div
                    className={cn(
                      "mx-auto inline-flex size-16 items-center justify-center rounded-2xl",
                      passed
                        ? "bg-success/10 text-success-600 dark:text-success"
                        : "bg-primary-500/10 text-ink-violet dark:text-primary-300",
                    )}
                  >
                    {passed ? <Trophy className="size-8" /> : <Sparkles className="size-8" />}
                  </div>
                  <p className="mt-6 text-xl font-bold leading-relaxed text-foreground">
                    {t("resultTitle", { score, total })}
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
                    {t("resultNote")}
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <TicketButton href="/register" className="w-full sm:w-auto">
                      {t("resultCta")}
                      <ArrowLeft className="size-4 rtl:rotate-180" />
                    </TicketButton>
                    <Button variant="ghost" size="lg" onClick={handleStart} type="button" className="w-full sm:w-auto">
                      <RotateCcw className="size-4" />
                      {t("tryAgain")}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </Reveal>
      </Container>
    </Section>
  );
}
