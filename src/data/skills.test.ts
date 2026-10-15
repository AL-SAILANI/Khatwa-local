import { describe, expect, it } from "vitest";
import { SAMPLE_QUESTIONS } from "./sample-questions";
import { STEP_MOCK_READING_QUESTIONS } from "./step-mock-reading";
import { STEP_MOCK_LISTENING_QUESTIONS } from "./step-mock-listening";
import {
  STEP_MOCK_GRAMMAR_QUESTIONS,
  STEP_MOCK_WRITING_QUESTIONS,
} from "./step-mock-grammar-writing";
import { GRAMMAR_EXTRA_QUESTIONS } from "./grammar-extra";
import { SAMPLE_READING_QUESTIONS_EXTRA } from "./reading-extra";
import { SAMPLE_LISTENING_QUESTIONS_EXTRA } from "./listening-extra";
import { LESSON_PRACTICE_GRAMMAR_QUESTIONS } from "./lesson-practice-grammar";
import { LESSON_PRACTICE_WRITING_QUESTIONS } from "./lesson-practice-writing";
import { LESSON_PRACTICE_READING_QUESTIONS } from "./lesson-practice-reading";
import { LESSON_PRACTICE_LISTENING_QUESTIONS } from "./lesson-practice-listening";
import { TYPE_PRACTICE_QUESTIONS } from "./type-practice";
import { GRAPH_PRACTICE_QUESTIONS } from "./graph-practice";
import { STEP_MOCK_2_READING_QUESTIONS } from "./step-mock-2-reading";
import { STEP_MOCK_2_LISTENING_QUESTIONS } from "./step-mock-2-listening";
import {
  STEP_MOCK_2_GRAMMAR_QUESTIONS,
  STEP_MOCK_2_WRITING_QUESTIONS,
} from "./step-mock-2-grammar-writing";
import { STEP_MOCK_3_READING_QUESTIONS } from "./step-mock-3-reading";
import { STEP_MOCK_3_LISTENING_QUESTIONS } from "./step-mock-3-listening";
import {
  STEP_MOCK_3_GRAMMAR_QUESTIONS,
  STEP_MOCK_3_WRITING_QUESTIONS,
} from "./step-mock-3-grammar-writing";
import { STEP_MOCK_4_READING_QUESTIONS } from "./step-mock-4-reading";
import { STEP_MOCK_4_LISTENING_QUESTIONS } from "./step-mock-4-listening";
import {
  STEP_MOCK_4_GRAMMAR_QUESTIONS,
  STEP_MOCK_4_WRITING_QUESTIONS,
} from "./step-mock-4-grammar-writing";
import { STEP_MOCK_5_READING_QUESTIONS } from "./step-mock-5-reading";
import { STEP_MOCK_5_LISTENING_QUESTIONS } from "./step-mock-5-listening";
import {
  STEP_MOCK_5_GRAMMAR_QUESTIONS,
  STEP_MOCK_5_WRITING_QUESTIONS,
} from "./step-mock-5-grammar-writing";
import {
  SKILLS,
  SKILL_BY_ID,
  skillsForTags,
  type SkillSection,
} from "./skills";
import { skillsOfQuestion } from "@/lib/skill-mastery";

const QUESTIONS = [
  ...SAMPLE_QUESTIONS,
  ...STEP_MOCK_READING_QUESTIONS,
  ...STEP_MOCK_LISTENING_QUESTIONS,
  ...STEP_MOCK_GRAMMAR_QUESTIONS,
  ...STEP_MOCK_WRITING_QUESTIONS,
  ...GRAMMAR_EXTRA_QUESTIONS,
  ...SAMPLE_READING_QUESTIONS_EXTRA,
  ...SAMPLE_LISTENING_QUESTIONS_EXTRA,
  ...LESSON_PRACTICE_GRAMMAR_QUESTIONS,
  ...LESSON_PRACTICE_WRITING_QUESTIONS,
  ...LESSON_PRACTICE_READING_QUESTIONS,
  ...LESSON_PRACTICE_LISTENING_QUESTIONS,
  ...TYPE_PRACTICE_QUESTIONS,
  ...GRAPH_PRACTICE_QUESTIONS,
  ...STEP_MOCK_2_READING_QUESTIONS,
  ...STEP_MOCK_2_LISTENING_QUESTIONS,
  ...STEP_MOCK_2_GRAMMAR_QUESTIONS,
  ...STEP_MOCK_2_WRITING_QUESTIONS,
  ...STEP_MOCK_3_READING_QUESTIONS,
  ...STEP_MOCK_3_LISTENING_QUESTIONS,
  ...STEP_MOCK_3_GRAMMAR_QUESTIONS,
  ...STEP_MOCK_3_WRITING_QUESTIONS,
  ...STEP_MOCK_4_READING_QUESTIONS,
  ...STEP_MOCK_4_LISTENING_QUESTIONS,
  ...STEP_MOCK_4_GRAMMAR_QUESTIONS,
  ...STEP_MOCK_4_WRITING_QUESTIONS,
  ...STEP_MOCK_5_READING_QUESTIONS,
  ...STEP_MOCK_5_LISTENING_QUESTIONS,
  ...STEP_MOCK_5_GRAMMAR_QUESTIONS,
  ...STEP_MOCK_5_WRITING_QUESTIONS,
];

describe("skills map", () => {
  it("has unique ids and valid prerequisites without cycles", () => {
    expect(SKILL_BY_ID.size).toBe(SKILLS.length);
    for (const skill of SKILLS) {
      for (const pre of skill.prerequisites)
        expect(SKILL_BY_ID.has(pre), `${skill.id} -> ${pre}`).toBe(true);
    }
    const visiting = new Set<string>();
    const done = new Set<string>();
    const visit = (id: string) => {
      if (done.has(id)) return;
      expect(visiting.has(id), `cycle at ${id}`).toBe(false);
      visiting.add(id);
      SKILL_BY_ID.get(id)!.prerequisites.forEach(visit);
      visiting.delete(id);
      done.add(id);
    };
    SKILLS.forEach((skill) => visit(skill.id));
  });

  it("maps every tag in the question bank to a skill of the same section family", () => {
    const unmapped: string[] = [];
    for (const q of QUESTIONS) {
      const ids = skillsForTags(q.section as SkillSection, q.tags);
      if (ids.length === 0) unmapped.push(q.id);
    }
    expect(unmapped).toEqual([]);
  });

  it("gives every question-type skill at least one question in the bank", () => {
    const strategy = new Set(["rd-asma", "ls-preview", "gr-strategy"]);
    const covered = new Set<string>();
    for (const q of QUESTIONS) {
      for (const id of skillsOfQuestion(q)) covered.add(id);
    }
    const empty = SKILLS.filter(
      (skill) =>
        skill.section !== "vocabulary" &&
        !strategy.has(skill.id) &&
        !covered.has(skill.id),
    ).map((skill) => skill.id);
    expect(empty).toEqual([]);
  });
});
