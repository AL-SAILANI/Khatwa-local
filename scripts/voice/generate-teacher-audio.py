#!/usr/bin/env python3
"""
Generates the platform's vocabulary pronunciation MP3s in the teacher's cloned
voice using Resemble AI's Chatterbox (MIT-licensed, open-source, runs locally).

The site's flashcards already point at `public/audio/vocab/<word>.mp3` and
`<word>.example.mp3` (see `src/lib/vocab-audio.ts`); this script rewrites those
files so the *entire* vocabulary set is voiced by the teacher instead of the
rotating edge-tts voices.

Voice cloning is zero-shot: Chatterbox conditions on a single clean reference
clip (`scripts/voice/teacher/reference.wav`, produced by
`prepare-teacher-clips.py`). A 5-20s single-speaker reference is ideal.

Speed/articulation controls (per-word read a touch slower than natural so the
eye catches the pronunciation — same rationale as the old edge-tts script):

    /opt/homebrew/bin/python3.11 scripts/voice/generate-teacher-audio.py [arithm/arg, ...]

Generation is slow on Apple Silicon (MPS), so always prints progress and
skips existing files unless `--force` is passed.

Requires: `pip install chatterbox-tts torch torchaudio` under Python 3.11+.
"""
import argparse
import os
import re
import subprocess
import sys
import tempfile
import time

import torch
import torchaudio as ta

SRC = os.path.join(os.path.dirname(__file__), "..", "..", "src", "data", "sample-vocabulary.ts")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "public", "audio", "vocab")
REFERENCE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "teacher", "reference.wav")

# "exaggeration" dials emotional expressiveness. For clear didactic speech a
# slight bump is more engaging than flat monotone; keep it modest.
EXAGGERATION = 0.4
# cfg_weight nudges how closely the clone follows the reference voice.
CFG_WEIGHT = 0.5
SAMPLE_RATE = 24000


def slugify(text: str) -> str:
    """URL-safe filename matching `src/lib/vocab-audio.ts`. """
    cleaned = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return cleaned or "word"


def parse_words(src: str):
    content = open(src, encoding="utf-8").read()
    pattern = re.compile(
        r'\{ id: "([^"]+)", word: "([^"]+)", meaningAr: "[^"]*", meaningEn: "[^"]*", example: "((?:[^"\\]|\\.)*)"'
    )
    seen = set()
    out = []
    for m in pattern.finditer(content):
        wid, word, example = m.group(1), m.group(2), m.group(3)
        example = bytes(example, "utf-8").decode("unicode_escape")
        if word in seen:
            continue
        seen.add(word)
        out.append({"id": wid, "word": word, "example": example})
    return out


def synth(model, text: str, out_path: str, tempo: float) -> None:
    """Clones the teacher voice for `text`, then converts to MP3.

    `tempo *= atempo filter on the WAV before MP3 encod1ing — Chatterbox's
    English model has no speed knob, so a word read slightly slower (atempo
    preserves pitch) gives the eye time to catch the pronunciation while
    keeping the same voice, exactly as the old edge-tts script did.
    """
    fd, wav_path = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    try:
        wav = model.generate(
            text,
            audio_prompt_path=REFERENCE,
            exaggeration=EXAGGERATION,
            cfg_weight=CFG_WEIGHT,
        )
        ta.save(wav_path, wav, model.sr)
        filter_args = ["-af", f"atempo={tempo:.3f}"] if tempo and abs(tempo - 1.0) > 0.001 else []
        subprocess.run(
            ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
             "-i", wav_path, *filter_args, "-codec:a", "libmp3lame", "-q:a", "2", out_path],
            check=True,
        )
    finally:
        try:
            os.remove(wav_path)
        except OSError:
            pass


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="regenerate existing files")
    parser.add_argument("--dry", action="store_true", help="only parse and show what would be generated")
    parser.add_argument("--model", choices=["turbo", "base"], default="turbo",
                        help="Chatterbox variant: turbo (350M, ~6x faster, recommended) or base (0.5B, max quality)")
    args = parser.parse_args()

    if not os.path.exists(REFERENCE):
        print(f"Missing reference clip: {REFERENCE}")
        print("Run scripts/voice/prepare-teacher-clips.py with drums in "
              "scripts/voice/teacher/raw/ first.")
        sys.exit(1)

    words = parse_words(SRC)
    print(f"vocabulary words parsed: {len(words)}")

    if args.dry:
        for entry in words:
            print(f"  {entry['word']}  ->  {slugify(entry['word'])}.mp3")
        return

    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"loading Chatterbox {args.model} (first run downloads weights)...")
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    if args.model == "base":
        from chatterbox.tts import ChatterboxTTS
        model = ChatterboxTTS.from_pretrained(device=device)
    else:
        from chatterbox.tts_turbo import ChatterboxTurboTTS
        model = ChatterboxTurboTTS.from_pretrained(device=device)
    print("model ready")

    t0 = time.time()
    for i, entry in enumerate(words, 1):
        slug = slugify(entry["word"])
        # Words spoken slowly & clearly (atempo 0.9x), sentences at natural pace.
        entries = [
            (os.path.join(OUT_DIR, f"{slug}.mp3"), entry["word"], 0.9),
        ]
        if entry.get("example"):
            entries.append(
                (os.path.join(OUT_DIR, f"{slug}.example.mp3"), entry["example"], 1.0)
            )
        for out_path, text, tempo in entries:
            if os.path.exists(out_path) and not args.force:
                continue
            synth(model, text, out_path, tempo)
            kb = os.path.getsize(out_path) / 1024
            print(f"  [{i}/{len(words)}] {slug}  {kb:.0f} KB")
    print(f"done in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()