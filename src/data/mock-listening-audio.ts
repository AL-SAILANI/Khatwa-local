/**
 * Clips of mock exams 2-5 that have a recorded MP3 in
 * `public/audio/listening/<id>.mp3` (id = first question using the clip).
 * Rewritten by `python3 scripts/generate-listening-audio.py --mocks`; clips
 * not listed here are read aloud by the browser instead.
 */
export const MOCK_LISTENING_AUDIO: ReadonlySet<string> = new Set<string>([]);
