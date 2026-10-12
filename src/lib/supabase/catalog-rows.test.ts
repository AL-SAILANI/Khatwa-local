import { describe, expect, it } from "vitest";
import { SAMPLE_COURSES, SAMPLE_LESSONS } from "@/data/sample-courses";
import { SAMPLE_QUESTIONS, SAMPLE_READING_PASSAGES } from "@/data/sample-questions";
import { SAMPLE_VOCAB_WORDS } from "@/data/sample-vocabulary";
import { ACHIEVEMENTS } from "@/data/achievements";
import { toAchievement, toCourse, toLesson, toPassage, toQuestion, toVocabWord } from "./catalog";
import { achievementToRow, courseToRow, lessonToRow, passageToRow, questionToRow, vocabWordToRow } from "./catalog-rows";

/** Writes (…ToRow) and reads (to…) must be exact inverses on real content, or
 * something an admin saves would come back different. */
const stripUndefined = <T extends object>(o: T) => JSON.parse(JSON.stringify(o)) as T;

describe("catalog row builders round-trip with the read mappers", () => {
  it("courses", () => {
    for (const c of SAMPLE_COURSES) expect(stripUndefined(toCourse(courseToRow(c)))).toEqual(stripUndefined(c));
  });
  it("lessons", () => {
    for (const l of SAMPLE_LESSONS) expect(stripUndefined(toLesson(lessonToRow(l)))).toEqual(stripUndefined(l));
  });
  it("questions", () => {
    for (const q of SAMPLE_QUESTIONS) expect(stripUndefined(toQuestion(questionToRow(q)))).toEqual(stripUndefined(q));
  });
  it("reading passages", () => {
    for (const p of SAMPLE_READING_PASSAGES) expect(stripUndefined(toPassage(passageToRow(p)))).toEqual(stripUndefined(p));
  });
  it("vocab words", () => {
    for (const w of SAMPLE_VOCAB_WORDS) expect(stripUndefined(toVocabWord(vocabWordToRow(w)))).toEqual(stripUndefined(w));
  });
  it("achievements", () => {
    for (const a of ACHIEVEMENTS) expect(stripUndefined(toAchievement(achievementToRow(a)))).toEqual(stripUndefined(a));
  });
});
