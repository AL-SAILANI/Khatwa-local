"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Headphones, Play, Timer, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnswerOptions } from "@/components/exam/question-view";
import {
  speakTranscript,
  speechSupported,
} from "@/components/exam/listening-player";
import { cn } from "@/lib/utils/cn";
import type { Question } from "@/types/question";

/** Seconds given to read each question before the recording starts. */
export const PREVIEW_SECONDS_PER_QUESTION = 15;

type ClipPhase = "preview" | "tap" | "playing" | "ended";

interface ListeningClipProps {
  questions: Question[];
  answers: Record<string, string>;
  onSelect: (questionId: string, optionId: string) => void;
  /** Called once when the recording has finished (or cannot be played). */
  onEnded: () => void;
}

/**
 * One listening clip as in the real exam: a preview window to read the
 * questions, then the recording plays once (no replay, no pause), and the
 * questions stay answerable until the learner moves on for good.
 */
export function ListeningClip({
  questions,
  answers,
  onSelect,
  onEnded,
}: ListeningClipProps) {
  const t = useTranslations("exam.listening");
  const first = questions[0]!;
  const previewSeconds = PREVIEW_SECONDS_PER_QUESTION * questions.length;

  const [phase, setPhase] = useState<ClipPhase>("preview");
  const [secondsLeft, setSecondsLeft] = useState(previewSeconds);
  const [progress, setProgress] = useState(0);
  const [textFallback, setTextFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancelSpeechRef = useRef<(() => void) | null>(null);
  const endedRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    setProgress(1);
    setPhase("ended");
    onEndedRef.current();
  }, []);

  const startPlayback = useCallback(() => {
    if (first.audioUrl) {
      const audio = audioRef.current ?? new Audio(first.audioUrl);
      audioRef.current = audio;
      audio.onended = finish;
      audio.onerror = finish;
      audio.ontimeupdate = () => {
        if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);
      };
      setPhase("playing");
      audio.play().catch(() => setPhase("tap"));
      return;
    }
    if (first.transcript && speechSupported()) {
      setPhase("playing");
      cancelSpeechRef.current = speakTranscript(first.transcript, finish);
      return;
    }
    // Nothing to play (no audio and no speech support): show the script.
    setTextFallback(true);
    finish();
  }, [first.audioUrl, first.transcript, finish]);

  useEffect(() => {
    startRef.current = startPlayback;
  }, [startPlayback]);

  useEffect(() => {
    if (phase !== "preview") return;
    let left = previewSeconds;
    const timer = setInterval(() => {
      left -= 1;
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(timer);
        startRef.current();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, previewSeconds]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      cancelSpeechRef.current?.();
    },
    [],
  );

  const statusIcon =
    phase === "preview" ? (
      <Timer className="size-6" />
    ) : phase === "ended" ? (
      <Headphones className="size-6" />
    ) : (
      <Volume2 className="size-6" />
    );

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-5 sm:px-8 sm:py-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-8 lg:space-y-0">
        <section
          aria-live="polite"
          className={cn(
            "border-2 p-4 sm:p-5 lg:sticky lg:top-0",
            phase === "playing"
              ? "border-primary-500 bg-primary-100/60 dark:bg-primary-500/10"
              : "border-border bg-surface-muted/50",
          )}
        >
          <div className="flex flex-wrap items-center gap-4 lg:flex-col lg:items-stretch">
            <span className="grid size-12 shrink-0 place-items-center bg-butter-yellow text-ink-violet lg:self-start">
              {statusIcon}
            </span>
            <div className="min-w-0 flex-1 lg:flex-none">
              <p className="text-lg font-bold sm:text-xl">
                {phase === "preview" && t("previewTitle")}
                {phase === "tap" && t("tapTitle")}
                {phase === "playing" && t("playingTitle")}
                {phase === "ended" && t("endedTitle")}
              </p>
              <p className="mt-0.5 text-sm text-muted sm:text-base">
                {phase === "preview" && t("previewHint")}
                {phase === "tap" && t("tapHint")}
                {phase === "playing" && t("playingHint")}
                {phase === "ended" && t("endedHint")}
              </p>
            </div>
            {phase === "preview" && (
              <>
                <span className="font-mono text-3xl font-bold tabular-nums">
                  {secondsLeft}
                </span>
                <Button variant="outline" size="md" onClick={startPlayback}>
                  <Play className="size-4" />
                  {t("startNow")}
                </Button>
              </>
            )}
            {phase === "tap" && (
              <Button size="lg" onClick={startPlayback}>
                <Play className="size-5" />
                {t("tapButton")}
              </Button>
            )}
          </div>
          {phase !== "preview" && phase !== "tap" && (
            <div className="mt-4 h-2 w-full bg-surface-muted" aria-hidden>
              <div
                className={cn(
                  "h-full bg-primary-500 transition-[width] duration-300",
                  phase === "playing" && !first.audioUrl && "animate-pulse",
                )}
                style={{
                  width:
                    phase === "playing" && !first.audioUrl
                      ? "100%"
                      : `${progress * 100}%`,
                }}
              />
            </div>
          )}
          {textFallback && first.transcript && (
            <p
              className="mt-4 whitespace-pre-line text-base leading-8"
              dir="ltr"
            >
              {first.transcript}
            </p>
          )}
        </section>

        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id}>
              <p
                className="text-xl font-semibold leading-snug sm:text-2xl"
                dir="ltr"
              >
                <span className="me-2 text-muted">{index + 1}.</span>
                {question.prompt}
              </p>
              <AnswerOptions
                question={question}
                selectedOptionId={answers[question.id]}
                onSelect={(optionId) => onSelect(question.id, optionId)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
