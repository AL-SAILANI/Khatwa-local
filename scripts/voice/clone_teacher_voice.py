#!/usr/bin/env python3
"""
Voice Cloning Script (English) — Coqui XTTS-v2
=============================================

Clones the voice of the first audio file found in a local reference folder
and speaks a sample English sentence in that cloned voice.

Pipeline:
  1. Scan the reference folder for the first audio file (.wav / .mp3).
  2. Load the free multilingual XTTS-v2 model (weights auto-download once).
  3. Condition the model on the reference clip (voice timbre, articulation,
     and pacing are read from it — zero-shot, no training needed).
  4. Synthesise a sample English text into speech with that cloned voice.
  5. Save the result as `khotwa_cloned_voice.wav` on the Desktop.

Hardware acceleration: uses MPS on Apple Silicon, CUDA on Nvidia GPUs, and
falls back to CPU otherwise.

Usage:
    /path/to/scripts/voice/.venv/bin/python scripts/voice/clone_teacher_voice.py

Requires (inside the venv): `pip install coqui-tts torch torchaudio`.
Note: XTTS-v2 ships under Coqui's CPML non-commercial licence.
"""
from __future__ import annotations

import glob
import os
import sys

import torch
from TTS.api import TTS

# --------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------

# Folder containing the teacher's reference clips.
REFERENCE_DIR = os.path.expanduser("~/Desktop/دروس Aj Huge")

# First match wins: the script uses whichever audio file appears first
# alphabetically in the folder (cheap, deterministic reference selection).
SUPPORTED_EXTENSIONS = (".wav", ".mp3", ".m4a", ".flac", ".ogg")

# The multilingual model including XTTS-v2. It supports cloning English
# speech from a single reference clip.
MODEL_NAME = "tts_models/multilingual/multi-dataset/xtts_v2"

# Sample English text to demonstrate the cloned voice.
SAMPLE_TEXT = (
    "Welcome back. Today we are going to learn how to pronounce some common "
    "English words. Listen carefully, and repeat after me."
)

# Output file: saved directly on the user's Desktop.
OUTPUT_PATH = os.path.join(os.path.expanduser("~"), "Desktop", "khotwa_cloned_voice.wav")

# Experiment hints: lower = calmer, higher = more energetic delivery.
EXAGGERATION = 0.5


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------

def find_first_audio_file(directory: str) -> str | None:
    """Returns the first audio file (alphabetically) inside `directory`.

    Ignores any sub-directories; only direct children are scanned. Returns
    None when no supported audio file is present.
    """
    candidates = []
    for ext in SUPPORTED_EXTENSIONS:
        candidates.extend(glob.glob(os.path.join(directory, f"*{ext}")))
        candidates.extend(glob.glob(os.path.join(directory, f"*{ext.upper()}")))
    candidates.sort()  # deterministic: same first file every run
    return candidates[0] if candidates else None


def pick_device() -> torch.device:
    """Chooses the fastest connected accelerator for synthesis.

    CUDA (Nvidia GPUs) > MPS (Apple Silicon) > CPU.
    """
    if torch.cuda.is_available():
        return torch.device("cuda")
    if torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def main() -> None:
    reference = find_first_audio_file(REFERENCE_DIR)
    if reference is None:
        sys.exit(f"No audio file (.wav/.mp3/...) found in: {REFERENCE_DIR}")

    print(f"reference clip : {reference}")
    print(f"sample text    : {SAMPLE_TEXT!r}")

    device = pick_device()
    print(f"device         : {device}")

    # Load XTTS-v2. The first run downloads ~1.8 GB of weights from
    # HuggingFace into the user cache; later runs load from disk.
    tts = TTS(model_name=MODEL_NAME, progress_bar=False)

    # Zero-shot voice cloning in English.
    tts.tts_to_file(
        text=SAMPLE_TEXT,
        speaker_wav=reference,
        language="en",
        emotion=EXAGGERATION,
        file_path=OUTPUT_PATH,
    )

    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"saved          : {OUTPUT_PATH}  ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()