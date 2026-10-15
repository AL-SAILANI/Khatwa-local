import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/** Extra writing-analysis practice for lessons 1-8 (five questions per lesson), outside the mock banks. */
const specs: QuestionSpec[] = [
  {
    id: "lp-writing-1-1",
    prompt:
      'Identify the error: "Neither the teacher nor the students was ready for the fire drill."',
    correct: '"was" should be "were"',
    wrong: [
      '"Neither" should be "Either"',
      '"nor" should be "or"',
      '"for" should be "to"',
    ],
    why: 'With "neither ... nor", the verb agrees with the nearer subject ("students"), so "were" is needed.',
    level: "medium",
    tags: ["error-identification", "subject-verb-agreement"],
  },
  {
    id: "lp-writing-1-2",
    prompt: 'Identify the error: "She has lived in Riyadh since five years."',
    correct: '"since" should be "for"',
    wrong: [
      '"has lived" should be "is living"',
      '"in" should be "at"',
      '"five" should be "fifth"',
    ],
    why: '"For" is used with a period of time; "since" needs a starting point.',
    level: "easy",
    tags: ["error-identification", "tenses"],
  },
  {
    id: "lp-writing-1-3",
    prompt: 'Identify the error: "He gave me an advice about the exam."',
    correct: '"an advice" should be "advice"',
    wrong: [
      '"gave" should be "give"',
      '"me" should be "I"',
      '"the exam" should be "exam"',
    ],
    why: '"Advice" is uncountable, so it cannot take "an".',
    level: "easy",
    tags: ["error-identification", "countable-uncountable"],
  },
  {
    id: "lp-writing-1-4",
    prompt:
      'Identify the error: "If I will see him tomorrow, I will give him your message."',
    correct: '"will see" should be "see"',
    wrong: [
      '"will give" should be "give"',
      '"him" should be "he"',
      '"your" should be "you"',
    ],
    why: 'After "if" in a first conditional we use the present simple, not "will".',
    level: "medium",
    tags: ["error-identification", "conditionals"],
  },
  {
    id: "lp-writing-1-5",
    prompt: 'Identify the error: "The children is playing in the garden."',
    correct: '"is" should be "are"',
    wrong: [
      '"children" should be "childs"',
      '"playing" should be "played"',
      '"in" should be "at"',
    ],
    why: '"Children" is plural, so the verb must be "are".',
    level: "easy",
    tags: ["error-identification", "subject-verb-agreement"],
  },
  {
    id: "lp-writing-2-1",
    prompt:
      'Identify the error: "The coach told the players to stretch, to drink water, and warming up before the match."',
    correct: '"warming up" should be "to warm up"',
    wrong: [
      '"to stretch" should be "stretching"',
      '"drink" should be "drinking"',
      '"told" should be "tell"',
    ],
    why: "Items in a list must have the same form: to stretch, to drink, to warm up.",
    level: "medium",
    tags: ["error-identification", "parallel-structure"],
  },
  {
    id: "lp-writing-2-2",
    prompt:
      'Identify the error: "My sister and me went to the market yesterday."',
    correct: '"me" should be "I"',
    wrong: [
      '"went" should be "go"',
      '"and" should be "or"',
      '"market" should be "markets"',
    ],
    why: '"I" is the subject form; "me" is for objects.',
    level: "easy",
    tags: ["error-identification", "pronoun-case"],
  },
  {
    id: "lp-writing-2-3",
    prompt:
      'Identify the error: "The manager gave the extra tickets to Salem and I."',
    correct: '"I" should be "me"',
    wrong: [
      '"gave" should be "give"',
      '"to" should be "for"',
      '"tickets" should be "ticket"',
    ],
    why: 'After a preposition we use the object form: "to Salem and me".',
    level: "medium",
    tags: ["error-identification", "pronoun-case"],
  },
  {
    id: "lp-writing-2-4",
    prompt:
      'Identify the error: "She is not only talented but also works hard."',
    correct: '"works hard" should be "hardworking"',
    wrong: [
      '"is" should be "was"',
      '"but also" should be "and also"',
      '"talented" should be "talent"',
    ],
    why: '"Not only ... but also" must join two parallel forms: talented / hardworking.',
    level: "hard",
    tags: ["error-identification", "parallel-structure"],
  },
  {
    id: "lp-writing-2-5",
    prompt:
      'Identify the error: "Between you and I, the plan will probably fail."',
    correct: '"I" should be "me"',
    wrong: [
      '"Between" should be "Among"',
      '"will" should be "would"',
      '"fail" should be "failing"',
    ],
    why: 'A preposition is followed by the object form: "between you and me".',
    level: "medium",
    tags: ["error-identification", "pronoun-case"],
  },
  {
    id: "lp-writing-3-1",
    prompt:
      'Identify the error: "I don\'t have no time to waste on this problem."',
    correct: '"no" should be "any"',
    wrong: [
      '"don\'t" should be "doesn\'t"',
      '"waste" should be "wasting"',
      '"on" should be "in"',
    ],
    why: 'A negative verb already carries the negation, so "any" is used (no double negative).',
    level: "easy",
    tags: ["error-identification", "double-negative"],
  },
  {
    id: "lp-writing-3-2",
    prompt: 'Identify the error: "The students books were left on the desk."',
    correct: '"students" should be "students\'"',
    wrong: [
      '"were" should be "was"',
      '"left" should be "leaving"',
      '"on" should be "at"',
    ],
    why: "Plural possession needs an apostrophe after the s: students' books.",
    level: "medium",
    tags: ["error-identification", "possessives"],
  },
  {
    id: "lp-writing-3-3",
    prompt:
      'Identify the error: "Its a beautiful day, so let\'s walk to school."',
    correct: '"Its" should be "It\'s"',
    wrong: [
      '"so" should be "because"',
      '"let\'s" should be "lets"',
      '"walk" should be "walking"',
    ],
    why: '"It\'s" means "it is"; "its" shows possession.',
    level: "easy",
    tags: ["error-identification", "possessives"],
  },
  {
    id: "lp-writing-3-4",
    prompt:
      'Identify the error: "The company announced it\'s new policy yesterday."',
    correct: '"it\'s" should be "its"',
    wrong: [
      '"announced" should be "announce"',
      '"new" should be "newly"',
      '"policy" should be "policies"',
    ],
    why: '"Its" (no apostrophe) is the possessive; "it\'s" means "it is".',
    level: "easy",
    tags: ["error-identification", "possessives"],
  },
  {
    id: "lp-writing-3-5",
    prompt:
      'Identify the error: "She can\'t hardly hear the speaker from the back row."',
    correct: '"can\'t" should be "can"',
    wrong: [
      '"hear" should be "hears"',
      '"from" should be "at"',
      '"speaker" should be "speakers"',
    ],
    why: '"Hardly" is already negative, so "can\'t hardly" is a double negative.',
    level: "medium",
    tags: ["error-identification", "double-negative"],
  },
  {
    id: "lp-writing-4-1",
    prompt:
      'Identify the error: "The exam was difficult, many students finished early."',
    correct: 'The comma after "difficult" should be a semicolon',
    wrong: [
      '"many" should be "much"',
      '"finished" should be "finish"',
      '"early" should be "earlier"',
    ],
    why: "Two complete sentences cannot be joined by a comma alone (comma splice).",
    level: "medium",
    tags: ["error-identification", "comma-splice"],
  },
  {
    id: "lp-writing-4-2",
    prompt: 'Identify the error: "I like coffee, my brother prefers tea."',
    correct: 'The comma after "coffee" should be a semicolon',
    wrong: [
      '"like" should be "likes"',
      '"prefers" should be "prefer"',
      '"tea" should be "teas"',
    ],
    why: "A comma splice joins two independent clauses with only a comma.",
    level: "medium",
    tags: ["error-identification", "comma-splice"],
  },
  {
    id: "lp-writing-4-3",
    prompt:
      'Identify the error: "She studied all night she still failed the test."',
    correct: 'A comma and "but" are needed after "night"',
    wrong: [
      '"studied" should be "studying"',
      '"still" should be "stills"',
      '"failed" should be "fail"',
    ],
    why: "Two clauses run together without punctuation form a run-on sentence.",
    level: "medium",
    tags: ["error-identification", "comma-splice"],
  },
  {
    id: "lp-writing-4-4",
    prompt:
      'Identify the error: "The bus was late, we missed the first lesson."',
    correct: 'The comma after "late" should be a period',
    wrong: [
      '"was" should be "were"',
      '"missed" should be "miss"',
      '"first" should be "firstly"',
    ],
    why: "A comma cannot join two complete sentences; use a period, semicolon or conjunction.",
    level: "easy",
    tags: ["error-identification", "comma-splice"],
  },
  {
    id: "lp-writing-4-5",
    prompt:
      'Identify the error: "Omar likes football his sister likes swimming."',
    correct: 'A semicolon is needed after "football"',
    wrong: [
      '"likes" should be "like"',
      '"his" should be "her"',
      '"swimming" should be "swim"',
    ],
    why: "Two independent clauses need a semicolon, period or conjunction between them.",
    level: "hard",
    tags: ["error-identification", "comma-splice"],
  },
  {
    id: "lp-writing-5-1",
    prompt:
      'Identify the error: "The new law will effect everyone who drives a car."',
    correct: '"effect" should be "affect"',
    wrong: [
      '"will" should be "would"',
      '"who" should be "which"',
      '"drives" should be "drive"',
    ],
    why: '"Affect" is the verb meaning to influence; "effect" is usually a noun.',
    level: "medium",
    tags: ["error-identification", "commonly-confused-words"],
  },
  {
    id: "lp-writing-5-2",
    prompt:
      'Identify the error: "A large amount of people attended the lecture."',
    correct: '"amount" should be "number"',
    wrong: [
      '"large" should be "big"',
      '"attended" should be "attend"',
      '"lecture" should be "lectures"',
    ],
    why: '"Number" is used with countable nouns such as people.',
    level: "medium",
    tags: [
      "error-identification",
      "commonly-confused-words",
      "countable-uncountable",
    ],
  },
  {
    id: "lp-writing-5-3",
    prompt: 'Identify the error: "Her score was higher then mine."',
    correct: '"then" should be "than"',
    wrong: [
      '"was" should be "were"',
      '"higher" should be "highest"',
      '"mine" should be "my"',
    ],
    why: '"Than" is used in comparisons; "then" refers to time.',
    level: "easy",
    tags: ["error-identification", "commonly-confused-words"],
  },
  {
    id: "lp-writing-5-4",
    prompt:
      'Identify the error: "There are less students in the class this year."',
    correct: '"less" should be "fewer"',
    wrong: [
      '"are" should be "is"',
      '"in" should be "at"',
      '"this" should be "these"',
    ],
    why: '"Fewer" is used with countable plural nouns.',
    level: "easy",
    tags: [
      "error-identification",
      "commonly-confused-words",
      "countable-uncountable",
    ],
  },
  {
    id: "lp-writing-5-5",
    prompt: 'Identify the error: "Their going to travel to Madinah next week."',
    correct: '"Their" should be "They\'re"',
    wrong: [
      '"going" should be "goes"',
      '"to travel" should be "traveling"',
      '"next" should be "last"',
    ],
    why: '"They\'re" means "they are"; "their" shows possession.',
    level: "easy",
    tags: ["error-identification", "commonly-confused-words"],
  },
  {
    id: "lp-writing-6-1",
    prompt: 'Identify the error: "The students forgot his books on the bus."',
    correct: '"his" should be "their"',
    wrong: [
      '"forgot" should be "forget"',
      '"books" should be "book"',
      '"on" should be "in"',
    ],
    why: 'A plural antecedent ("students") needs a plural pronoun.',
    level: "easy",
    tags: ["error-identification", "pronoun-agreement"],
  },
  {
    id: "lp-writing-6-2",
    prompt:
      'Identify the error: "The tourists enjoyed the trip, and he took many photos."',
    correct: '"he" should be "they"',
    wrong: [
      '"enjoyed" should be "enjoy"',
      '"took" should be "take"',
      '"many" should be "much"',
    ],
    why: 'The pronoun must match its plural antecedent "tourists".',
    level: "easy",
    tags: ["error-identification", "pronoun-agreement"],
  },
  {
    id: "lp-writing-6-3",
    prompt:
      'Identify the error: "The workers asked for a raise because it had not been paid on time."',
    correct: '"it" should be "they"',
    wrong: [
      '"asked" should be "ask"',
      '"for" should be "to"',
      '"had not been" should be "has not been"',
    ],
    why: '"Workers" is plural, so the pronoun must be "they".',
    level: "medium",
    tags: ["error-identification", "pronoun-agreement"],
  },
  {
    id: "lp-writing-6-4",
    prompt:
      'Identify the error: "I invited my cousins, and I gave him a gift."',
    correct: '"him" should be "them"',
    wrong: [
      '"invited" should be "invite"',
      '"gave" should be "give"',
      '"cousins" should be "cousin"',
    ],
    why: 'The pronoun must be plural to match "cousins".',
    level: "medium",
    tags: ["error-identification", "pronoun-agreement"],
  },
  {
    id: "lp-writing-6-5",
    prompt:
      'Identify the error: "These shoes are expensive, but I bought it anyway."',
    correct: '"it" should be "them"',
    wrong: [
      '"are" should be "is"',
      '"but" should be "so"',
      '"bought" should be "buy"',
    ],
    why: '"Shoes" is plural, so the object pronoun is "them".',
    level: "easy",
    tags: ["error-identification", "pronoun-agreement"],
  },
  {
    id: "lp-writing-7-1",
    prompt: "Which sentence is written correctly?",
    correct: '"Walking to school, Sami noticed that the rain had started."',
    wrong: [
      '"Walking to school, the rain started to fall on Sami."',
      '"Walking to school, the rain made everything wet."',
      '"The rain started, walking to school."',
    ],
    why: 'The phrase "Walking to school" must describe the subject that follows it (Sami), not the rain.',
    level: "medium",
    tags: ["dangling-modifiers"],
  },
  {
    id: "lp-writing-7-2",
    prompt: "Which sentence is written correctly?",
    correct:
      '"After finishing the exam, the students handed their papers to the teacher."',
    wrong: [
      '"After finishing the exam, the papers were handed to the teacher."',
      '"After finishing the exam, the teacher\'s desk was full."',
      '"Finishing the exam, the bell rang."',
    ],
    why: 'The students finished the exam, so "students" must be the subject right after the phrase.',
    level: "medium",
    tags: ["dangling-modifiers"],
  },
  {
    id: "lp-writing-7-3",
    prompt:
      'Identify the error: "The course teaches students how to read quickly, write clearly, and speaking confidently."',
    correct: '"speaking" should be "speak"',
    wrong: [
      '"read" should be "reading"',
      '"teaches" should be "teach"',
      '"how" should be "what"',
    ],
    why: 'After "how to", all verbs in the list use the base form: read, write, speak.',
    level: "medium",
    tags: ["error-identification", "parallelism"],
  },
  {
    id: "lp-writing-7-4",
    prompt:
      'Identify the error: "He is known for his honesty, his kindness, and because he works hard."',
    correct: '"because he works hard" should be "his hard work"',
    wrong: [
      '"known" should be "knowing"',
      '"for" should be "to"',
      '"honesty" should be "honest"',
    ],
    why: "The list must use parallel noun phrases: his honesty, his kindness, his hard work.",
    level: "hard",
    tags: ["error-identification", "parallelism"],
  },
  {
    id: "lp-writing-7-5",
    prompt: "Which sentence is written correctly?",
    correct: '"Having missed the bus, Huda had to walk to work."',
    wrong: [
      '"Having missed the bus, the walk to work was long."',
      '"Having missed the bus, the walk made Huda tired."',
      '"Having missed the bus, it was necessary to walk."',
    ],
    why: "The person who missed the bus (Huda) must be the subject of the main clause.",
    level: "hard",
    tags: ["dangling-modifiers"],
  },
  {
    id: "lp-writing-8-1",
    prompt:
      'Identify the error: "The box of old photographs were found in the attic."',
    correct: '"were" should be "was"',
    wrong: [
      '"of" should be "from"',
      '"found" should be "find"',
      '"in" should be "on"',
    ],
    why: 'The subject is "box" (singular), not "photographs".',
    level: "medium",
    tags: ["error-identification", "subject-verb-agreement"],
  },
  {
    id: "lp-writing-8-2",
    prompt:
      'Identify the error: "The list of requirements are posted on the door."',
    correct: '"are" should be "is"',
    wrong: [
      '"of" should be "for"',
      '"posted" should be "posting"',
      '"on" should be "in"',
    ],
    why: 'The subject is "list" (singular), so the verb is "is".',
    level: "medium",
    tags: ["error-identification", "subject-verb-agreement"],
  },
  {
    id: "lp-writing-8-3",
    prompt: 'Identify the error: "Mathematics are my favourite subject."',
    correct: '"are" should be "is"',
    wrong: [
      '"my" should be "me"',
      '"favourite" should be "favourites"',
      '"subject" should be "subjects"',
    ],
    why: "Names of school subjects ending in -s (mathematics, physics) take a singular verb.",
    level: "easy",
    tags: ["error-identification", "subject-verb-agreement"],
  },
  {
    id: "lp-writing-8-4",
    prompt:
      'Identify the error: "The news about the exams were disappointing."',
    correct: '"were" should be "was"',
    wrong: [
      '"about" should be "for"',
      '"exams" should be "exam"',
      '"disappointing" should be "disappointed"',
    ],
    why: '"News" is uncountable and takes a singular verb.',
    level: "easy",
    tags: [
      "error-identification",
      "subject-verb-agreement",
      "countable-uncountable",
    ],
  },
  {
    id: "lp-writing-8-5",
    prompt:
      'Identify the error: "The students, as well as their teacher, is excited about the trip."',
    correct: '"is" should be "are"',
    wrong: [
      '"as well as" should be "also"',
      '"excited" should be "exciting"',
      '"about" should be "for"',
    ],
    why: '"As well as" does not change the subject: "students" is plural, so "are".',
    level: "hard",
    tags: ["error-identification", "subject-verb-agreement"],
  },
];

export const LESSON_PRACTICE_WRITING_QUESTIONS = buildQuestions(
  "writingAnalysis",
  "lesson-practice",
  specs,
);

export const LESSON_PRACTICE_WRITING_IDS: Record<string, string[]> = {
  "lesson-writingAnalysis-1": [
    "lp-writing-1-1",
    "lp-writing-1-2",
    "lp-writing-1-3",
    "lp-writing-1-4",
    "lp-writing-1-5",
  ],
  "lesson-writingAnalysis-2": [
    "lp-writing-2-1",
    "lp-writing-2-2",
    "lp-writing-2-3",
    "lp-writing-2-4",
    "lp-writing-2-5",
  ],
  "lesson-writingAnalysis-3": [
    "lp-writing-3-1",
    "lp-writing-3-2",
    "lp-writing-3-3",
    "lp-writing-3-4",
    "lp-writing-3-5",
  ],
  "lesson-writingAnalysis-4": [
    "lp-writing-4-1",
    "lp-writing-4-2",
    "lp-writing-4-3",
    "lp-writing-4-4",
    "lp-writing-4-5",
  ],
  "lesson-writingAnalysis-5": [
    "lp-writing-5-1",
    "lp-writing-5-2",
    "lp-writing-5-3",
    "lp-writing-5-4",
    "lp-writing-5-5",
  ],
  "lesson-writingAnalysis-6": [
    "lp-writing-6-1",
    "lp-writing-6-2",
    "lp-writing-6-3",
    "lp-writing-6-4",
    "lp-writing-6-5",
  ],
  "lesson-writingAnalysis-7": [
    "lp-writing-7-1",
    "lp-writing-7-2",
    "lp-writing-7-3",
    "lp-writing-7-4",
    "lp-writing-7-5",
  ],
  "lesson-writingAnalysis-8": [
    "lp-writing-8-1",
    "lp-writing-8-2",
    "lp-writing-8-3",
    "lp-writing-8-4",
    "lp-writing-8-5",
  ],
};
