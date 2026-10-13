import type { LessonResource } from "@/types/course";

/**
 * Extra video explanations from engVid (engvid.com, LearnVid Inc.) attached to
 * grammar lessons. Each engVid lesson is a YouTube video: `video` entries are
 * embedded in the lesson page through YouTube's own player (the video stays on
 * YouTube, with a link back to the engVid lesson). Embedding in a commercial
 * app should be cleared with EngVid first (see docs/CURRICULUM.md).
 */
const ENGVID_BASE = "https://www.engvid.com/";

const video = (slug: string, youtubeId: string, title: string): LessonResource => ({
  type: "youtube",
  url: `${ENGVID_BASE}${slug}/`,
  title,
  provider: "engVid",
  youtubeId,
});

export const ENGVID_LINKS: Record<string, LessonResource[]> = {
  "lesson-grammar-1": [
    video("subject-verb-agreement", "wq7RYyhwfBA", "Singular or Plural? Subject-Verb Agreement in English Grammar"),
    video("learn-english-tenses-review", "aUJO_0phvbw", "Learn English Tenses: Review of ALL 12 TENSES in English"),
  ],
  "lesson-grammar-2": [
    video("learn-english-grammar-active-passive", "fDnXWxXZekw", "Learn English Grammar: What's the difference between ACTIVE & PASSIVE?"),
    video("english-grammar-modal-verbs-of-certainty", "wdhps_l-5d8", "English Grammar: Modal Verbs of Certainty – MIGHT, MAY, MUST, CAN"),
  ],
  "lesson-grammar-3": [
    video("english-grammar-causative-verbs", "ZyfLxDTlsOQ", "English Grammar: Causative Verbs: Make, Have, Let, Get, Help"),
    video("english-grammar-inversion", "4K0npnSYjJE", "English Grammar – Inversion: “Had I known…”, “Should you need…”"),
  ],
  "lesson-grammar-4": [
    video("mixed-verb-tenses-in-english-conditionals-and-if-clauses", "hk1AvFgOsSo", "Mixed Verb Tenses in English: Conditionals and IF clauses"),
    video("advanced-english-grammar-word-order-inversions", "TO2CtYcFYWg", "Advanced English Grammar: Word Order Inversions"),
  ],
  "lesson-grammar-5": [
    video("so-such", "T86QtX2XZeg", "Conversational English – So & Such"),
    video("english-grammar-modifying-comparatives", "Fr83ObluJ2A", "English Grammar: Modifying Comparatives"),
  ],
  "lesson-grammar-6": [
    video("the-passive-when-why-and-how-to-use-it", "C6pHfjH0Efg", "The Passive: When, why, and how to use it"),
    video("easy-introduction-to-passive", "QTQb42w7oig", "Easy Introduction to PASSIVE"),
  ],
  "lesson-grammar-7": [
    video("advanced-english-grammar-noun-clauses", "9SrEEPt4MQA", "Advanced English Grammar: Noun Clauses"),
    video("easy-english-conversation-suggest-recommend", "OIqDAF8szq4", "Easy English Conversation: SUGGEST & RECOMMEND"),
  ],
  "lesson-grammar-8": [
    video("english-grammar-correlative-conjunctions", "XYYUXskbX_c", "English Grammar: Correlative Conjunctions (NEITHER & NOR, EITHER & OR, BOTH & AND…)"),
  ],
  "lesson-grammar-9": [
    video("learn-english-grammar-the-4-conditionals", "veTo6eWJQrM", "Learn English Grammar: The 4 Conditionals"),
    video("learn-english-grammar-3rd-conditional", "-VkYM6SyJSE", "Learn English Grammar: The 3rd Conditional"),
  ],
  "lesson-grammar-10": [
    video("english-grammar-comparative-adjectives", "HqueToxC4d4", "English Grammar – Comparative Adjectives"),
    video("english-grammar-superlative-adjectives", "uMhE2dp1rko", "Learn English Grammar: Superlative Adjectives"),
  ],
  "lesson-grammar-11": [
    video("how-prepositions-actually-work-english-grammar", "ee9MGLIBl-A", "How Prepositions Actually Work | English Grammar"),
    video("how-to-express-opposing-ideas-in-english", "UFuxlnUeGmg", "How to express opposing ideas in English: despite, although, nevertheless, in spite of…"),
  ],
  "lesson-grammar-12": [
    video("gerund-or-infinitive", "zPzjJHKyNwc", "English Grammar – Gerund or Infinitive?"),
    video("advanced-english-grammar-participles", "eWvkSp16VFY", "Advanced English Grammar: Participles"),
  ],
  "lesson-grammar-13": [
    video("master-english-time-perfect-tenses", "IA2jZAA7JjM", "Master English Time: HAVE, HAVE HAD, HAD HAD, WILL HAVE HAD"),
    video("learn-english-grammar-indirect-speech-reported-speech", "cgHZvDzi78U", "Learn English Grammar: INDIRECT SPEECH (REPORTED SPEECH)"),
  ],
  "lesson-grammar-14": [
    video("learn-english-grammar-the-adjective-clause-relative-clause", "GpV39YEmh5k", "Learn English Grammar: The Adjective Clause (Relative Clause)"),
    video("english-grammar-tag-questions", "jY46m3rhxwk", "English Grammar – Tag Questions"),
  ],
  "lesson-grammar-15": [
    video("countable-uncountable-nouns", "YsagocS1wGo", "English Grammar Tricks – Countable & Uncountable Nouns"),
    video("learn-english-grammar-few-little-a-few-a-little", "kjzr-hTNqdQ", "Learn English Grammar: FEW, LITTLE, A FEW, A LITTLE"),
  ],
  "lesson-grammar-16": [
    video("speaking-english-i-wish-i-had", "T4c0J8BiVvg", "Speaking English – “I wish I had…”"),
    video("wish-subjunctive", "-vefS0B1DIY", "English Grammar – “I wish…” – Subjunctive"),
  ],
  "lesson-grammar-17": [
    video("i-used-to-i-got-used-to-im-used-to-whats-the-difference", "DmLVH5Y096Q", "“I USED TO”, “I GOT USED TO”, “I’M USED TO”: What’s the difference?!"),
    video("used-to-be-used-to-get-used-to", "ymq-OAaSK08", "USED TO, BE USED TO, GET USED TO: When and How to Use Them"),
  ],
};
