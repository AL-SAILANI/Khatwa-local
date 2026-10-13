import { SAMPLE_QUESTIONS } from "@/data/sample-questions";
import { STEP_MOCK_READING_QUESTIONS } from "@/data/step-mock-reading";
import { STEP_MOCK_LISTENING_QUESTIONS } from "@/data/step-mock-listening";
import { STEP_MOCK_GRAMMAR_QUESTIONS, STEP_MOCK_WRITING_QUESTIONS } from "@/data/step-mock-grammar-writing";
import { STEP_MOCK_2_READING_QUESTIONS } from "@/data/step-mock-2-reading";
import { STEP_MOCK_2_LISTENING_QUESTIONS } from "@/data/step-mock-2-listening";
import { STEP_MOCK_2_GRAMMAR_QUESTIONS, STEP_MOCK_2_WRITING_QUESTIONS } from "@/data/step-mock-2-grammar-writing";
import { STEP_MOCK_3_READING_PASSAGES, STEP_MOCK_3_READING_QUESTIONS } from "@/data/step-mock-3-reading";
import { STEP_MOCK_3_LISTENING_QUESTIONS } from "@/data/step-mock-3-listening";
import { STEP_MOCK_3_GRAMMAR_QUESTIONS, STEP_MOCK_3_WRITING_QUESTIONS } from "@/data/step-mock-3-grammar-writing";
import { describeMockBank } from "@/data/mock-bank-checks";

describeMockBank(
  "mock exam 3",
  "step-mock-3",
  {
    passages: STEP_MOCK_3_READING_PASSAGES,
    questions: [
      ...STEP_MOCK_3_READING_QUESTIONS,
      ...STEP_MOCK_3_GRAMMAR_QUESTIONS,
      ...STEP_MOCK_3_WRITING_QUESTIONS,
      ...STEP_MOCK_3_LISTENING_QUESTIONS,
    ],
  },
  new Set(
    [
      ...SAMPLE_QUESTIONS,
      ...STEP_MOCK_READING_QUESTIONS,
      ...STEP_MOCK_LISTENING_QUESTIONS,
      ...STEP_MOCK_GRAMMAR_QUESTIONS,
      ...STEP_MOCK_WRITING_QUESTIONS,
      ...STEP_MOCK_2_READING_QUESTIONS,
      ...STEP_MOCK_2_LISTENING_QUESTIONS,
      ...STEP_MOCK_2_GRAMMAR_QUESTIONS,
      ...STEP_MOCK_2_WRITING_QUESTIONS,
    ].map((q) => q.id),
  ),
  8,
);
