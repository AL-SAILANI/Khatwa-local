/**
 * Clips of mock exams 2-5 that have a recorded MP3 in
 * `public/audio/listening/<id>.mp3` (id = first question using the clip).
 * Rewritten by `python3 scripts/generate-listening-audio.py --mocks`; clips
 * not listed here are read aloud by the browser instead.
 */
export const MOCK_LISTENING_AUDIO: ReadonlySet<string> = new Set<string>([
  "sm2-listening-1",
  "sm2-listening-11",
  "sm2-listening-13",
  "sm2-listening-15",
  "sm2-listening-18",
  "sm2-listening-4",
  "sm2-listening-7",
  "sm2-listening-9",
  "sm3-listening-1",
  "sm3-listening-11",
  "sm3-listening-13",
  "sm3-listening-15",
  "sm3-listening-18",
  "sm3-listening-4",
  "sm3-listening-7",
  "sm3-listening-9",
  "sm4-listening-1",
  "sm4-listening-11",
  "sm4-listening-13",
  "sm4-listening-15",
  "sm4-listening-18",
  "sm4-listening-4",
  "sm4-listening-7",
  "sm4-listening-9",
  "sm5-listening-1",
  "sm5-listening-11",
  "sm5-listening-13",
  "sm5-listening-15",
  "sm5-listening-18",
  "sm5-listening-4",
  "sm5-listening-7",
  "sm5-listening-9",
]);
