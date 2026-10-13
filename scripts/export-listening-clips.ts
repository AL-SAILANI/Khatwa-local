/**
 * Prints the unique listening clips of mock exams 2-5 as JSON
 * ([{ id, transcript }]); `id` is the first question that uses the clip and
 * names its MP3. Consumed by generate-listening-audio.py --mocks.
 */
import { STEP_MOCK_2_LISTENING_QUESTIONS } from "../src/data/step-mock-2-listening";
import { STEP_MOCK_3_LISTENING_QUESTIONS } from "../src/data/step-mock-3-listening";
import { STEP_MOCK_4_LISTENING_QUESTIONS } from "../src/data/step-mock-4-listening";
import { STEP_MOCK_5_LISTENING_QUESTIONS } from "../src/data/step-mock-5-listening";

const questions = [
  ...STEP_MOCK_2_LISTENING_QUESTIONS,
  ...STEP_MOCK_3_LISTENING_QUESTIONS,
  ...STEP_MOCK_4_LISTENING_QUESTIONS,
  ...STEP_MOCK_5_LISTENING_QUESTIONS,
];

const clips = new Map<string, string>();
for (const q of questions) {
  if (q.transcript && !clips.has(q.transcript)) clips.set(q.transcript, q.id);
}

console.log(JSON.stringify([...clips].map(([transcript, id]) => ({ id, transcript }))));
