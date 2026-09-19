"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const emptySubscribe = () => () => {};

/** Single natural playback rate — fast enough to sound human, slow enough
 * to catch the exact pronunciation. Used for both the bundled MP3 and the
 * SpeechSynthesis fallback. */
const RATE_NATURAL = 0.9;

/** True only on the client — `speechSynthesis` is a browser platform API
 * that doesn't exist during SSR. `useSyncExternalStore` with a constant
 * server snapshot keeps hydration consistent (server renders nothing; the
 * client swaps the button in after mount). */
function ttsSupportedSnapshot() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

interface PronounceButtonProps {
  text: string;
  label: string;
  lang?: string;
  size?: "sm" | "md";
  className?: string;
  /** Optional bundled MP3 URL. When present it takes precedence over the
   * browser's speechSynthesis (higher quality, consistent voice). */
  audioSrc?: string;
}

/** Speaker button that plays `audioSrc` when available, otherwise reads
 * `text` aloud via the browser's SpeechSynthesis API. Renders nothing when
 * neither is available. */
export function PronounceButton({
  text,
  label,
  lang = "en-US",
  size = "md",
  className,
  audioSrc,
}: PronounceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsSupported = useSyncExternalStore(emptySubscribe, ttsSupportedSnapshot, () => false);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const playAudio = useCallback(
    (src: string) => {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.playbackRate = RATE_NATURAL;
      audio.addEventListener("play", () => setIsSpeaking(true));
      audio.addEventListener("ended", () => {
        setIsSpeaking(false);
      });
      audio.addEventListener("error", () => {
        setIsSpeaking(false);
        window.speechSynthesis?.speak(new SpeechSynthesisUtterance(text));
      });
      void audio.play();
    },
    [text],
  );

  const speak = useCallback(() => {
    if (isSpeaking) {
      stop();
      return;
    }
    if (audioSrc) {
      playAudio(audioSrc);
      return;
    }
    if (!ttsSupported) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = RATE_NATURAL;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [text, lang, isSpeaking, ttsSupported, audioSrc, playAudio, stop]);

  if (!ttsSupported && !audioSrc) return null;

  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => {
        e.stopPropagation();
        speak();
      }}
      disabled={isSpeaking}
      aria-label={label}
      aria-pressed={isSpeaking}
      className={cn(
        "group/pronounce shrink-0 rounded-lg p-1.5 text-ink-violet transition-all duration-150 ease-out dark:text-primary-300",
        "hover:bg-primary-50 hover:text-ink-violet active:scale-90 active:bg-primary-100 dark:hover:bg-primary-500/10 dark:active:bg-primary-500/20",
        "cursor-pointer select-none tap-highlight-transparent",
        size === "md" && "p-2",
        isSpeaking && "animate-pulse text-ink-violet dark:text-primary-300",
        className,
      )}
    >
      <span className="block transition-transform duration-150 ease-out group-active/pronounce:scale-90">
        {isSpeaking ? (
          <VolumeX className={cn("size-4", size === "md" && "size-5")} />
        ) : (
          <Volume2 className={cn("size-4", size === "md" && "size-5")} />
        )}
      </span>
    </button>
  );
}
