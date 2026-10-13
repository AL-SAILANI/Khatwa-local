#!/usr/bin/env python3
"""
Generates free listening-audio MP3s for the STEP listening questions using
Microsoft Edge's free online TTS (edge-tts) — no API key, no billing, no
Firebase Storage. Outputs one MP3 per unique conversation transcript into
`public/audio/listening/`, keyed by the first question that uses it.

The exam runner plays `question.audioUrl`, which `src/data/sample-questions.ts`
points at these static files. Run this whenever transcripts change:

    python3 scripts/generate-listening-audio.py          # original q-listening-* clips
    python3 scripts/generate-listening-audio.py --mocks  # clips of mock exams 2-5

`--mocks` also rewrites `src/data/mock-listening-audio.ts`, which tells the
question data which clips have an MP3 (commit the MP3s and that file).

Requires: `pip install edge-tts` and `brew install ffmpeg` (for joining the
per-speaker segments with natural pauses).
"""
import os
import re
import subprocess
import sys
import time

SRC = "src/data/sample-questions.ts"
SRC_EXTRA = "src/data/listening-extra.ts"
OUT_DIR = "public/audio/listening"

# Male/female role pairing so dialogues sound like two people. Free voices
# standing in for ElevenLabs: ChristopherNeural (deep, warm male ≈ Adam) and
# AvaNeural (vibrant natural female ≈ Rachel/Bella).
VOICES = {
    "Man": "en-US-ChristopherNeural",
    "Woman": "en-US-AvaNeural",
    "Student": "en-US-AvaNeural",
    "Professor": "en-US-ChristopherNeural",
    "Receptionist": "en-US-AvaNeural",
    "Salesperson": "en-US-AvaNeural",
    "Agent": "en-US-ChristopherNeural",
    "Doctor": "en-US-ChristopherNeural",
}
DEFAULT_VOICE = "en-US-AvaNeural"


# Mock-exam clips use many speaker labels (roles and first names), so voices
# are assigned per clip: a known first name keeps its gender, other speakers
# alternate male/female in order of appearance.
FEMALE_NAMES = {"Reem", "Salma", "Noura", "Huda", "Sara", "Nada", "Laila"}
MALE_NAMES = {"Ali", "Faisal", "Yazeed", "Hamad", "Omar", "Khalid"}
MALE_VOICES = ["en-US-ChristopherNeural", "en-US-GuyNeural"]
FEMALE_VOICES = ["en-US-AvaNeural", "en-US-JennyNeural"]
MOCK_MANIFEST = "src/data/mock-listening-audio.ts"


def assign_voices(labels: list[str]) -> dict:
    voices = {}
    used = {"m": 0, "f": 0}
    last = "f"  # so the first unnamed speaker is male
    for label in labels:
        if label in voices:
            continue
        if label in FEMALE_NAMES:
            gender = "f"
        elif label in MALE_NAMES:
            gender = "m"
        else:
            gender = "m" if last == "f" else "f"
        pool = MALE_VOICES if gender == "m" else FEMALE_VOICES
        voices[label] = pool[used[gender] % len(pool)]
        used[gender] += 1
        last = gender
    return voices


def load_mock_clips() -> list:
    import json
    out = subprocess.run(
        ["npx", "tsx", "scripts/export-listening-clips.ts"],
        check=True, capture_output=True, text=True,
    ).stdout
    return json.loads(out)


def write_mock_manifest(ids: list[str]) -> None:
    body = ",\n".join(f'  "{i}"' for i in sorted(ids))
    open(MOCK_MANIFEST, "w", encoding="utf-8").write(
        "/**\n * Clips of mock exams 2-5 that have a recorded MP3 in\n"
        " * `public/audio/listening/<id>.mp3` (id = first question using the clip).\n"
        " * Rewritten by `python3 scripts/generate-listening-audio.py --mocks`; clips\n"
        " * not listed here are read aloud by the browser instead.\n */\n"
        "export const MOCK_LISTENING_AUDIO: ReadonlySet<string> = new Set<string>("
        + ("[\n" + body + ",\n]" if ids else "[]") + ");\n"
    )


def unescape(s: str) -> str:
    return s.replace('\\"', '"').replace("\\n", "\n")


def parse_questions(path: str):
    src = open(path, encoding="utf-8").read()
    pattern = re.compile(
        r'id: "(q-listening-\d+)",\s*section: "listening",\s*transcript:\s*\n\s*"((?:[^"\\]|\\.)*)"',
        re.S,
    )
    return [
        {"id": m.group(1), "transcript": unescape(m.group(2))}
        for m in pattern.finditer(src)
    ]


def gen_segment(text: str, voice: str, out_path: str) -> None:
    subprocess.run(
        ["python3", "-m", "edge_tts", "--voice", voice, "--text", text, "--write-media", out_path],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def merge(segments: list[str], out_path: str) -> None:
    if len(segments) == 1:
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", segments[0], "-codec", "copy", out_path],
            check=True,
        )
        return
    inputs = []
    filters = []
    for i, seg in enumerate(segments):
        inputs += ["-i", seg]
        filters.append(
            f"[{i}:a]apad=pad_dur=0.35,aresample=24000,aformat=channel_layouts=mono[a{i}]"
        )
    filter_complex = ";".join(filters) + ";" + "".join(
        f"[a{i}]" for i in range(len(segments))
    ) + f"concat=n={len(segments)}:v=0:a=1[out]"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", filter_complex, "-map", "[out]", out_path],
        check=True,
    )


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    mocks = "--mocks" in sys.argv
    if mocks:
        questions = load_mock_clips()
    else:
        questions = parse_questions(SRC) + parse_questions(SRC_EXTRA)

    unique = {}
    for q in questions:
        if q["transcript"] not in unique:
            unique[q["transcript"]] = q["id"]
    print(f"listening questions: {len(questions)}, unique transcripts: {len(unique)}")

    for transcript, canonical in unique.items():
        out_path = os.path.join(OUT_DIR, f"{canonical}.mp3")
        if os.path.exists(out_path) and "--force" not in sys.argv:
            continue
        lines = [ln.strip() for ln in transcript.split("\n") if ln.strip()]
        clip_voices = {}
        if mocks:
            clip_voices = assign_voices(
                [m.group(1) for m in (re.match(r"^([A-Za-z]+):", ln) for ln in lines) if m]
            )
        tmp_dir = f"/tmp/edge-segs-{canonical}"
        os.makedirs(tmp_dir, exist_ok=True)
        seg_files = []
        for i, line in enumerate(lines):
            label_match = re.match(r"^([A-Za-z]+):\s*(.*)$", line)
            if label_match:
                label, text = label_match.group(1), label_match.group(2)
                voice = clip_voices.get(label) or VOICES.get(label, DEFAULT_VOICE)
            else:
                text, voice = line, DEFAULT_VOICE
            seg = os.path.join(tmp_dir, f"seg{i}.mp3")
            gen_segment(text, voice, seg)
            seg_files.append(seg)
        merge(seg_files, out_path)
        print(f"  {canonical}.mp3  {os.path.getsize(out_path) / 1024:.1f} KB  ({len(seg_files)} segments)")
        time.sleep(0.3)
    if mocks:
        done = [
            canonical for canonical in unique.values()
            if os.path.exists(os.path.join(OUT_DIR, f"{canonical}.mp3"))
        ]
        write_mock_manifest(done)
        print(f"{MOCK_MANIFEST}: {len(done)} clips with audio")
    print("done")


if __name__ == "__main__":
    main()
