import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/**
 * Practice questions for the wish / used to / question-tag lessons. They are
 * kept out of the mock-exam banks so a learner can drill the rule without
 * seeing mock questions beforehand.
 */
const specs: QuestionSpec[] = [
  { id: "gx-grammar-1", prompt: "I wish I ___ taller; then I could reach the top shelf.", correct: "were", wrong: ["am", "will be", "have been"], why: "A wish about an unreal present uses the past simple, and 'were' is used for all subjects.", level: "medium", tags: ["wish"] },
  { id: "gx-grammar-2", prompt: "She wishes she ___ the invitation yesterday.", correct: "had accepted", wrong: ["accepted", "would accept", "accepts"], why: "A regret about the past needs the past perfect after 'wish'.", level: "hard", tags: ["wish"] },
  { id: "gx-grammar-3", prompt: "I wish the neighbours ___ making so much noise.", correct: "would stop", wrong: ["stop", "have stopped", "stopping"], why: "'Wish' + would + base verb expresses annoyance at a current situation and a wish for change.", level: "medium", tags: ["wish"] },
  { id: "gx-grammar-4", prompt: "My grandfather ___ get up at five every day, but now he sleeps later.", correct: "used to", wrong: ["is used to", "was used to", "uses to"], why: "'Used to' + base verb describes a past habit that has stopped ('but now...').", level: "medium", tags: ["used-to"] },
  { id: "gx-grammar-5", prompt: "I'm not used to ___ in such cold weather.", correct: "living", wrong: ["live", "lived", "be living"], why: "'Be used to' means 'accustomed to' and is followed by a noun or an -ing form.", level: "medium", tags: ["used-to"] },
  { id: "gx-grammar-6", prompt: "It took me a month to get used to ___ the new schedule.", correct: "following", wrong: ["follow", "followed", "be followed"], why: "'Get used to' (become accustomed to) is followed by an -ing form.", level: "medium", tags: ["used-to"] },
  { id: "gx-grammar-7", prompt: "Sara can swim, ___?", correct: "can't she", wrong: ["can she", "isn't she", "doesn't she"], why: "A positive statement takes a negative tag with the same auxiliary: can't she?", level: "easy", tags: ["question-tags"] },
  { id: "gx-grammar-8", prompt: "They never arrive on time, ___?", correct: "do they", wrong: ["don't they", "did they", "are they"], why: "'Never' makes the statement negative, so the tag is positive: do they?", level: "hard", tags: ["question-tags"] },
];

export const GRAMMAR_EXTRA_QUESTIONS = buildQuestions("grammar", "grammar-extra", specs);
