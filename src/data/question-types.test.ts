import { describe, expect, it } from "vitest";
import { deriveTypeTag, effectiveTags, reportableTags } from "./question-types";
import type { ExamSectionKey, Question } from "@/types/question";

const q = (
  section: ExamSectionKey,
  prompt: string,
  tags: string[],
): Question => ({
  id: "t",
  section,
  prompt,
  options: [],
  correctOptionId: "a",
  explanation: "",
  difficulty: "easy",
  tags,
});

describe("deriveTypeTag", () => {
  it.each([
    ["How much is the change fee?", "listening-number"],
    ["What time does the office close today?", "listening-number"],
    ["When does the customer originally want to travel?", "listening-number"],
    ["Why has the flight been postponed?", "listening-reason"],
    ["What does the man think about the plan?", "listening-opinion"],
    [
      "What important point does the lecturer make?",
      "listening-important-idea",
    ],
    ["What is the lecture mainly about?", "listening-main-idea"],
    ['What does the speaker mean by "under the weather"?', "listening-term"],
    [
      "Which information supports the professor's opinion?",
      "listening-evidence",
    ],
  ])("listening: %s", (prompt, expected) => {
    expect(
      deriveTypeTag(q("listening", prompt, ["listening-comprehension"])),
    ).toBe(expected);
  });

  it("leaves plain listening detail questions alone", () => {
    expect(
      deriveTypeTag(
        q("listening", "What does the doctor recommend?", [
          "listening-comprehension",
        ]),
      ),
    ).toBeNull();
  });

  it("never overrides an explicit specific tag", () => {
    expect(
      deriveTypeTag(
        q("listening", "Why did the plan change?", ["listening-inference"]),
      ),
    ).toBeNull();
    expect(
      deriveTypeTag(
        q("listening", "What does the man like?", ["listening-opinion"]),
      ),
    ).toBeNull();
    expect(
      deriveTypeTag(q("reading", "Which is NOT true? EXCEPT", ["vocabulary"])),
    ).toBeNull();
  });

  it.each([
    "All of the following are disadvantages mentioned in the passage EXCEPT",
    "Which of the following is true according to the passage?",
    "Which statement is NOT true about bees?",
  ])("reading agreement: %s", (prompt) => {
    expect(
      deriveTypeTag(q("reading", prompt, ["reading-comprehension", "detail"])),
    ).toBe("agreement");
  });

  it("does not mistake author-view questions for agreement", () => {
    expect(
      deriveTypeTag(
        q(
          "reading",
          "Which statement best reflects the author's view of Ali?",
          ["reading-comprehension"],
        ),
      ),
    ).toBeNull();
  });

  it("ignores grammar and writing", () => {
    expect(
      deriveTypeTag(q("grammar", "Why is this wrong?", ["tenses"])),
    ).toBeNull();
  });
});

describe("effectiveTags and reportableTags", () => {
  it("replaces generic comprehension tags with the derived type", () => {
    const question = q("listening", "How many units will the exam cover?", [
      "listening-comprehension",
      "step-mock-2",
    ]);
    expect(effectiveTags(question)).toEqual([
      "step-mock-2",
      "listening-number",
    ]);
    expect(reportableTags(question)).toEqual(["listening-number"]);
  });

  it("re-types a mean-by stem authored as inference", () => {
    const question = q("listening", 'What does B mean by "we stayed inside"?', [
      "listening-inference",
      "lesson-practice",
    ]);
    expect(deriveTypeTag(question)).toBe("listening-term");
    expect(reportableTags(question)).toEqual(["listening-term"]);
  });

  it("drops bank tags but keeps a lone generic tag", () => {
    const question = q("listening", "What does the doctor recommend?", [
      "listening-comprehension",
      "lesson-practice",
    ]);
    expect(reportableTags(question)).toEqual(["listening-comprehension"]);
  });
});
