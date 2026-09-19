#!/usr/bin/env python3
"""
Generates free, natural-sounding pronunciation MP3s for the vocabulary
flashcards using Microsoft Edge's free online TTS (edge-tts) — no API key, no
billing, no Firebase Storage. Outputs one MP3 per unique word into
`public/audio/vocab/` plus one per example sentence into
`public/audio/vocab/` keyed `<slug>.example.mp3` (the flashcard plays it with
a fallback to the browser's speechSynthesis).

    python3 scripts/generate-vocab-audio.py [--force]

Why it sounds human (not robotic):
  * neural voices that carry real prosody (pauses, emphasis, tone).
  * a word is read a touch slower than its natural sentence pace — the eye
    needs time to catch the exact pronunciation, and the slight drawl is
    what makes a single word sound spoken rather than spelled.
  * a warm, slightly lower pitch keeps the read from sounding flat and nasal.
  * the example sentence is read by the SAME voice at natural pace, so the
    whole card keeps one consistent, conversational speaker.

Voices: a rotating pool of natural male + female voices (free stand-ins in
the spirit of ElevenLabs' Adam/Rachel/Bella) — each word is assigned a voice
deterministically from its hash, so re-runs never change a word's voice.

Requires: `pip install edge-tts`.
"""
import os
import re
import subprocess
import sys
import time
import zlib

SRC = "src/data/sample-vocabulary.ts"
OUT_DIR = "public/audio/vocab"

# Natural-sounding free voices rotating across words for variety:
# male (warm/deep)  — AndrewNeural, ChristopherNeural, BrianNeural
# female (bright/natural) — AvaNeural, EmmaNeural, JennyNeural
VOICES = [
    "en-US-AvaNeural",
    "en-US-AndrewNeural",
    "en-US-EmmaNeural",
    "en-US-ChristopherNeural",
    "en-US-JennyNeural",
    "en-US-BrianNeural",
]

# A single word read at default TTS speed sounds clipped and mechanical, so
# we slow it down slightly and warm it up — this is the single biggest lever
# against the "robot voice" feel.
WORD_ARGS = ["--rate=-8%", "--pitch=-2Hz"]
SENTENCE_ARGS = ["--rate=+0%", "--pitch=-2Hz"]


def voice_for(word: str) -> str:
    """Deterministic per-word voice so generation is stable across re-runs."""
    return VOICES[zlib.crc32(word.encode("utf-8")) % len(VOICES)]


def slugify(text: str) -> str:
    """URL-safe filename: lowercase, spaces/punctuation collapsed to a dash."""
    cleaned = re.sub(r"[^a-z0-9_-]+", "-", text.lower()).strip("-").strip("_")
    return cleaned or "word"


def parse_words(path: str):
    src = open(path, encoding="utf-8").read()
    pattern = re.compile(r'\{ id: "([^"]+)", word: "([^"]+)", meaningAr: "[^"]*", meaningEn: "[^"]*", example: "((?:[^"\\]|\\.)*)"')
    seen = set()
    out = []
    for m in pattern.finditer(src):
        wid, word, example = m.group(1), m.group(2), m.group(3)
        example = bytes(example, "utf-8").decode("unicode_escape")
        if word in seen:
            continue
        seen.add(word)
        out.append({"id": wid, "word": word, "example": example})
    return out


def run_tts(text: str, voice: str, out_path: str, args: list[str]) -> None:
    subprocess.run(
        ["python3", "-m", "edge_tts", "--voice", voice, "--text", text, *args, "--write-media", out_path],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    words = parse_words(SRC)
    print(f"vocabulary words: {len(words)}")

    for entry in words:
        slug = slugify(entry["word"])
        voice = voice_for(entry["word"])
        word_path = os.path.join(OUT_DIR, f"{slug}.mp3")
        if not (os.path.exists(word_path) and "--force" not in sys.argv):
            run_tts(entry["word"], voice, word_path, WORD_ARGS)
            print(f"  {slug}.mp3  {os.path.getsize(word_path) / 1024:.1f} KB")
            time.sleep(0.15)

        example_path = os.path.join(OUT_DIR, f"{slug}.example.mp3")
        if entry.get("example") and not (os.path.exists(example_path) and "--force" not in sys.argv):
            run_tts(entry["example"], voice, example_path, SENTENCE_ARGS)
            print(f"  {slug}.example.mp3  {os.path.getsize(example_path) / 1024:.1f} KB")
            time.sleep(0.15)
    print("done")


if __name__ == "__main__":
    main()
