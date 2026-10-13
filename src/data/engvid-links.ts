import type { LessonResource } from "@/types/course";

/**
 * Optional extra video explanations from engVid (engvid.com, LearnVid Inc.),
 * attached to grammar lessons as plain outbound links. They open on engvid.com
 * in a new tab; nothing is embedded or re-hosted. Embedding in the app needs
 * written permission from EngVid first (see docs/CURRICULUM.md).
 */
const ENGVID_BASE = "https://www.engvid.com/";

const link = (slug: string, title: string): LessonResource => ({
  type: "link",
  url: `${ENGVID_BASE}${slug}/`,
  title,
  provider: "engVid",
});

export const ENGVID_LINKS: Record<string, LessonResource[]> = {
  "lesson-grammar-1": [
    link("subject-verb-agreement", "Subject-verb agreement"),
    link("learn-english-tenses-review", "Tenses review"),
  ],
  "lesson-grammar-2": [
    link("learn-english-grammar-active-passive", "Active and passive voice"),
    link("english-grammar-modal-verbs-of-certainty", "Modal verbs of certainty"),
  ],
  "lesson-grammar-3": [
    link("english-grammar-causative-verbs", "Causative verbs"),
    link("english-grammar-inversion", "Inversion"),
  ],
  "lesson-grammar-4": [
    link("mixed-verb-tenses-in-english-conditionals-and-if-clauses", "Mixed conditionals and if-clauses"),
    link("advanced-english-grammar-word-order-inversions", "Word order and inversions"),
  ],
  "lesson-grammar-5": [
    link("so-such", "So and such"),
    link("english-grammar-modifying-comparatives", "Modifying comparatives"),
  ],
  "lesson-grammar-6": [
    link("the-passive-when-why-and-how-to-use-it", "The passive: when, why and how"),
    link("easy-introduction-to-passive", "Introduction to the passive"),
  ],
  "lesson-grammar-7": [
    link("advanced-english-grammar-noun-clauses", "Noun clauses"),
    link("easy-english-conversation-suggest-recommend", "Suggest and recommend"),
  ],
  "lesson-grammar-8": [link("english-grammar-correlative-conjunctions", "Correlative conjunctions")],
  "lesson-grammar-9": [
    link("learn-english-grammar-the-4-conditionals", "The four conditionals"),
    link("learn-english-grammar-3rd-conditional", "The third conditional"),
  ],
  "lesson-grammar-10": [
    link("english-resource/comparative-superlative-adjectives-in-english", "Comparative and superlative adjectives"),
    link("english-grammar-superlative-adjectives", "Superlative adjectives"),
  ],
  "lesson-grammar-11": [
    link("how-prepositions-actually-work-english-grammar", "How prepositions work"),
    link("how-to-express-opposing-ideas-in-english", "Expressing opposing ideas"),
  ],
  "lesson-grammar-12": [
    link("gerund-or-infinitive", "Gerund or infinitive"),
    link("advanced-english-grammar-participles", "Participles"),
  ],
  "lesson-grammar-13": [
    link("master-english-time-perfect-tenses", "Perfect tenses"),
    link("learn-english-grammar-indirect-speech-reported-speech", "Reported speech"),
  ],
  "lesson-grammar-14": [
    link("learn-english-grammar-the-adjective-clause-relative-clause", "Relative clauses"),
    link("english-grammar-tag-questions", "Tag questions"),
  ],
  "lesson-grammar-15": [
    link("countable-uncountable-nouns", "Countable and uncountable nouns"),
    link("learn-english-grammar-few-little-a-few-a-little", "Few, little, a few, a little"),
  ],
  "lesson-grammar-16": [
    link("speaking-english-i-wish-i-had", "I wish I had..."),
    link("wish-subjunctive", "Wish and the subjunctive"),
  ],
  "lesson-grammar-17": [
    link("i-used-to-i-got-used-to-im-used-to-whats-the-difference", "Used to, get used to, be used to"),
    link("used-to-be-used-to-get-used-to", "Used to vs be used to vs get used to"),
  ],
};
