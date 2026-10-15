"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslations } from "next-intl";
import { Headphones, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const emptySubscribe = () => () => {};
const ttsSupportedSnapshot = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

const LINE_PATTERN = /^([A-Za-z][A-Za-z ]{0,20}):\s*(.+)$/;
const RATE = 0.92;

interface Segment {
  speaker: string;
  text: string;
}

export function parseTranscript(transcript: string): Segment[] {
  return transcript
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = LINE_PATTERN.exec(line);
      return match
        ? { speaker: match[1] as string, text: match[2] as string }
        : { speaker: "", text: line };
    });
}

/** Distinct voice per speaker (in order of first appearance). With a single
 * installed voice, pitch alone separates the speakers. */
function pickVoices(
  speakers: string[],
): Map<string, { voice?: SpeechSynthesisVoice; pitch: number }> {
  const english = window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith("en"));
  const preferred = english.filter((v) => v.lang.toLowerCase() === "en-us");
  const pool = preferred.length >= 2 ? preferred : english;
  const result = new Map<
    string,
    { voice?: SpeechSynthesisVoice; pitch: number }
  >();
  speakers.forEach((speaker, index) => {
    result.set(speaker, {
      voice: pool.length ? pool[index % pool.length] : undefined,
      pitch: pool.length >= 2 ? 1 : index % 2 === 0 ? 1 : 1.25,
    });
  });
  return result;
}

export const speechSupported = () => ttsSupportedSnapshot();

/** Reads a transcript aloud once, one utterance per line with a distinct voice
 * per speaker. Calls `onEnd` when the last line finishes (or on error) and
 * returns a function that cancels playback. */
export function speakTranscript(
  transcript: string,
  onEnd: () => void,
): () => void {
  const segments = parseTranscript(transcript);
  const voices = pickVoices([...new Set(segments.map((s) => s.speaker))]);
  let cancelled = false;
  window.speechSynthesis.cancel();

  segments.forEach((segment, index) => {
    const utterance = new SpeechSynthesisUtterance(segment.text);
    const setting = voices.get(segment.speaker);
    utterance.lang = "en-US";
    if (setting?.voice) utterance.voice = setting.voice;
    utterance.pitch = setting?.pitch ?? 1;
    utterance.rate = RATE;
    const isLast = index === segments.length - 1;
    utterance.onend = () => {
      if (isLast && !cancelled) onEnd();
    };
    utterance.onerror = () => {
      if (!cancelled) onEnd();
    };
    window.speechSynthesis.speak(utterance);
  });

  return () => {
    cancelled = true;
    window.speechSynthesis.cancel();
  };
}

interface ListeningPlayerProps {
  transcript: string;
}

/** Reads a listening transcript aloud with the browser's SpeechSynthesis
 * (free, no files). Used for clips that have no recorded MP3 yet. The text is
 * hidden by default so the question still tests listening; browsers without
 * speech support get the text instead. */
export function ListeningPlayer({ transcript }: ListeningPlayerProps) {
  const t = useTranslations("exam");
  const supported = useSyncExternalStore(
    emptySubscribe,
    ttsSupportedSnapshot,
    () => true,
  );
  const [playing, setPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const runId = useRef(0);
  const cancelRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    runId.current += 1;
    cancelRef.current?.();
    cancelRef.current = null;
    window.speechSynthesis?.cancel();
    setPlaying(false);
  }, []);

  useEffect(() => stop, [stop, transcript]);

  const play = useCallback(() => {
    cancelRef.current?.();
    runId.current += 1;
    setPlaying(true);
    cancelRef.current = speakTranscript(transcript, () => setPlaying(false));
  }, [transcript]);

  const textVisible = showText || !supported;

  return (
    <Card className="max-h-[60vh] overflow-y-auto">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Headphones className="size-4 text-ink-violet dark:text-primary-300" />
        {t("audioNote")}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {supported && (
          <Button type="button" size="sm" onClick={playing ? stop : play}>
            {playing ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
            {playing ? t("listenStop") : t("listenPlay")}
          </Button>
        )}
        {supported && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowText((v) => !v)}
          >
            {showText ? t("hideTranscript") : t("showTranscript")}
          </Button>
        )}
      </div>

      {textVisible && (
        <p
          className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90"
          dir="ltr"
        >
          {transcript}
        </p>
      )}
    </Card>
  );
}
