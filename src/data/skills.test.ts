import { describe, expect, it } from "vitest";
import { SAMPLE_QUESTIONS } from "./sample-questions";
import { STEP_MOCK_READING_QUESTIONS } from "./step-mock-reading";
import { STEP_MOCK_LISTENING_QUESTIONS } from "./step-mock-listening";
import { STEP_MOCK_GRAMMAR_QUESTIONS, STEP_MOCK_WRITING_QUESTIONS } from "./step-mock-grammar-writing";
import { SKILLS, SKILL_BY_ID, skillsForTags, type SkillSection } from "./skills";

const QUESTIONS = [
  ...SAMPLE_QUESTIONS,
  ...STEP_MOCK_READING_QUESTIONS,
  ...STEP_MOCK_LISTENING_QUESTIONS,
  ...STEP_MOCK_GRAMMAR_QUESTIONS,
  ...STEP_MOCK_WRITING_QUESTIONS,
];

describe("skills map", () => {
  it("has unique ids and valid prerequisites without cycles", () => {
    expect(SKILL_BY_ID.size).toBe(SKILLS.length);
    for (const skill of SKILLS) {
      for (const pre of skill.prerequisites) expect(SKILL_BY_ID.has(pre), `${skill.id} -> ${pre}`).toBe(true);
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
});
