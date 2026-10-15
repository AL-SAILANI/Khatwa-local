import type { Question } from "@/types/question";

/**
 * Question-type layer. Existing questions carry coarse tags (listening has
 * only "listening-comprehension" / "listening-inference"; reading has no
 * agreement tag), so the specific type is derived from the question stem.
 * Explicit specific tags always win; derivation only fills the generic ones.
 * Works for any question source (seed data, Firestore, Supabase, CMS).
 */

/** Tags that name a bank or a whole section rather than a skill. */
const BANK_TAG = /^(lesson-practice|grammar-extra|step-mock(-\d+)?)$/;
const GENERIC_TAGS = new Set([
  "reading-comprehension",
  "listening-comprehension",
  "detail",
]);
/** A "what does X mean" stem is a term question even when authored as inference. */
const TERM_TAG = "listening-term";

export function isBankTag(tag: string): boolean {
  return BANK_TAG.test(tag);
}

/** Listening types in precedence order: the first match wins. */
const LISTENING_RULES: [string, RegExp][] = [
  [
    "listening-term",
    /\bmean(s)? by\b|closest in meaning|what does .{1,60} mean\b|\bexpression\b/,
  ],
  [
    "listening-main-idea",
    /mainly about|main (idea|topic|point)|best title|\btitle\b|topic of|what is the (lecture|talk|discussion|conversation) about/,
  ],
  [
    "listening-important-idea",
    /most important|key (point|idea)|important (point|idea|information|detail)|emphasi[sz]/,
  ],
  ["listening-evidence", /\b(supports?|evidence|proves?)\b/],
  [
    "listening-opinion",
    /\b(opinion|thinks?|believes?|feels?|attitude|views?|agrees?)\b/,
  ],
  ["listening-reason", /^why\b|\breason\b|^how come\b/],
  [
    "listening-number",
    /^(how (much|many|long|old|far|often)\b|what time\b|when\b|what day\b|which day\b|what date\b|what (is|was|are|were) the (price|cost|fee|number|date|time|total|amount|duration))/,
  ],
];

const READING_AGREEMENT =
  /\bexcept\b|\bnot (true|mentioned|stated)\b|\b(is|are) (true|false|correct|incorrect)\b|which (statement|of the following)[^?]{0,40}\b(true|false|correct|incorrect)\b/;

/** Reading tags that already say what the question is about. */
const READING_SPECIFIC = new Set([
  "pronoun-reference",
  "vocabulary",
  "main-idea",
  "author-opinion",
  "purpose",
  "inference",
  "agreement",
]);

const LISTENING_SPECIFIC = new Set([
  "listening-inference",
  ...LISTENING_RULES.map(([tag]) => tag),
]);

function stem(question: Question): string {
  return question.prompt.trim().toLowerCase();
}

/** Specific type tag derived from the stem, or null when none applies. */
export function deriveTypeTag(question: Question): string | null {
  if (question.section === "listening") {
    const text = stem(question);
    const explicit = question.tags.filter((tag) => LISTENING_SPECIFIC.has(tag));
    if (explicit.length > 0) {
      const onlyInference = explicit.every(
        (tag) => tag === "listening-inference",
      );
      const isTerm = LISTENING_RULES.find(
        ([tag]) => tag === TERM_TAG,
      )?.[1].test(text);
      return onlyInference && isTerm ? TERM_TAG : null;
    }
    return (
      LISTENING_RULES.find(([, pattern]) => pattern.test(text))?.[0] ?? null
    );
  }
  if (question.section === "reading") {
    if (
      question.tags.some(
        (tag) => READING_SPECIFIC.has(tag) && tag !== "agreement",
      )
    ) {
      return null;
    }
    return READING_AGREEMENT.test(stem(question)) ? "agreement" : null;
  }
  return null;
}

/**
 * The tags used for skills and reports: the stored tags plus the derived
 * type, with the generic comprehension tags dropped once a specific type is
 * known (so one answer is never counted under both "detail" and its type).
 */
export function effectiveTags(question: Question): string[] {
  const derived = deriveTypeTag(question);
  if (!derived) return question.tags;
  return [
    ...question.tags.filter(
      (tag) =>
        !GENERIC_TAGS.has(tag) &&
        !(derived === TERM_TAG && tag === "listening-inference"),
    ),
    derived,
  ];
}

/** Tags worth reporting as a weak skill: no bank tags, and no generic tag
 * when a more specific one exists on the same question. */
export function reportableTags(question: Question): string[] {
  const tags = effectiveTags(question).filter((tag) => !isBankTag(tag));
  const specific = tags.filter((tag) => !GENERIC_TAGS.has(tag));
  return specific.length > 0 ? specific : tags;
}
