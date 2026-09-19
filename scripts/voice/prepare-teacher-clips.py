#!/usr/bin/env python3
"""
Prepares the teacher's raw audio clips as a voice-cloning reference for the
Chatterbox generator (`generate-teacher-audio.py`).

Steps, per input file in `raw/`:
  1. load with ffmpeg (handles mp3/m4a/wav/ogg),
  2. downmix to mono + resample to 24 kHz (Chatterbox's native rate),
  3. strip long leading/trailing silence,
  4. loopback-noise-gate simple RMS trim + mild normalize to -18 LUFS-ish,
  5. write a quiet-loudness-normalized per-file WAV into `ready/`.

Then the best reference clip: the longest single utterance (longest gap of
continuous speech) across all `ready/` files, capped at 20 seconds, written to
`reference.wav`. Chatterbox clones best from a clean 5-20s single-speaker clip
with no music or background noise.

    /opt/homebrew/bin/python3.11 scripts/voice/prepare-teacher-clips.py

Requires: `brew install ffmpeg`.
"""
import glob
import os
import subprocess
import sys

RAW_DIR = os.path.join(os.path.dirname(__file__), "teacher", "raw")
READY_DIR = os.path.join(os.path.dirname(__file__), "teacher", "ready")
REFERENCE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "teacher", "reference.wav")

SAMPLE_RATE = 24000


def strip_and_normalize(src: str, dst: str) -> None:
    """Mono 24 kHz, silence trimmed, loudness normalized via ffmpeg filters."""
    subprocess.run(
        [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", src,
            "-ac", "1",
            "-ar", str(SAMPLE_RATE),
            # Remove leading/trailing silence (threshold -35dB).
            "-af", "silenceremove=start_periods=1:start_threshold=-35dB:start_silence=0.3,"
                   "silenceremove=stop_periods=1:stop_threshold=-35dB:stop_silence=0.3,"
                   # Normalize peak to 0dBFS (Chatterbox conditions on the
                   # reference waveform directly; a hot-but-clean peak is best).
                   "loudnorm=I=-18:TP=-1.5:LRA=11",
            dst,
        ],
        check=True,
    )


def longest_speech_span(path: str, cap_seconds: float = 20.0) -> tuple[float, str]:
    """Finds the longest continuous-speech window in `path`.

    Uses ffmpeg's silencedetect to split the file into speech between silences,
    then keeps the longest segment. Returns (start_s, "" | tmp_name).
    Selecting by silence means the "reference" is one natural utterance, which
    clones far better than a stitch of many clips.
    """
    base = os.path.splitext(os.path.basename(path))[0]
    analysis = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-i", path, "-af",
            "silencedetect=n=-35dB:d=0.6", "-f", "null", "-",
        ],
        capture_output=True, text=True,
    )
    # Parse silence_start / silence_end lines.
    silence_starts: list[float] = []
    silence_ends: list[float] = []
    for line in analysis.stderr.splitlines():
        if "silence_start" in line:
            silence_starts.append(float(line.split("silence_start: ")[1]))
        elif "silence_end" in line:
            silence_ends.append(float(line.split("silence_end: ")[1]))

    total = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True,
    ).stdout.strip()
    total = float(total) if total else 0.0
    if not total:
        return 0.0, ""

    # Speech windows are [prev silence_end, next silence_start].
    starts = [0.0] + silence_ends
    ends = silence_starts + [total]
    windows = [(s, e) for s, e in zip(starts, ends) if e - s > 1.0]
    if not windows:
        return 0.0, ""
    best = max(windows, key=lambda w: w[1] - w[0])
    dur = best[1] - best[0]
    if dur > cap_seconds:
        dur = cap_seconds
    tmp = f"{base}.ref.wav"
    subprocess.run(
        [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-ss", f"{best[0]:.2f}", "-t", f"{dur:.2f}",
            "-i", path, "-ac", "1", "-ar", str(SAMPLE_RATE), tmp,
        ],
        check=True,
    )
    return dur, tmp


def main() -> None:
    os.makedirs(READY_DIR, exist_ok=True)
    inputs = sorted(glob.glob(os.path.join(RAW_DIR, "*")))
    if not inputs:
        print(f"No clips found in {RAW_DIR}/. Drop the teacher's mp3/m4a/wav "
              f"there and re-run.")
        sys.exit(1)

    ready = []
    for src in inputs:
        if os.path.splitext(src)[1].lower() in (".txt", ".md"):
            continue
        dst = os.path.join(READY_DIR, os.path.basename(src).rsplit(".", 1)[0] + ".wav")
        if not os.path.exists(dst):
            print(f"  preparing {os.path.basename(src)}...")
            strip_and_normalize(src, dst)
        ready.append(dst)

    # Pick the single best reference utterance.
    best_dur, best_tmp, best_file = 0.0, None, None
    overrides = glob.glob(os.path.join(READY_DIR, "reference-*.wav"))
    if overrides:
        best_file = sorted(overrides)[0]
        best_dur, best_tmp = 0.0, best_file
        print(f"using explicit reference override: {best_file}")

    if best_file is None:
        for path in ready:
            dur, tmp = longest_speech_span(path)
            if dur > best_dur:
                best_dur, best_tmp, best_file = dur, tmp, path

    if best_file is None:
        print("No usable speech found in clips.")
        sys.exit(1)

    # If not an override, the tmp WAV is next to the ready source; else move.
    if best_tmp == best_file:
        final = best_file
    else:
        final = os.path.join(os.path.dirname(best_file), "reference.wav")
        os.replace(best_tmp, final) if os.path.exists(best_tmp) else None

    os.makedirs(os.path.dirname(REFERENCE), exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
         "-i", final, "-ac", "1", "-ar", str(SAMPLE_RATE), REFERENCE],
        check=True,
    )
    dur = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", REFERENCE],
        capture_output=True, text=True,
    ).stdout.strip()
    print(f"reference: {os.path.relpath(REFERENCE)}  ({float(dur):.1f}s)")


if __name__ == "__main__":
    main()