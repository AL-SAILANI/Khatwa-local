# STEP reading: question types and lesson plan

Source of the framework: a third-party Arabic video course on the STEP reading section (shared by the project
owner; not an official source; received: the course introduction and five lessons: pronouns, vocabulary,
information and inference, graphs, text agreement). Only the framework and routines are summarised, in our own
words. Practice passages and questions must be original.

## What the course says about the format
- 60 minutes, 40 questions, about 13 passages, 1 to 6 questions per passage (about 90 seconds per question, which
  is not enough to read every passage in full).
- The passage and its questions share one screen (passage on one side, questions on the other); some passages have
  no title.
- Passages are long (6 to 15 numbered paragraphs); questions often name a paragraph ("in paragraph 5...").
- Answers are not necessarily in passage order, but search in an orderly way (paragraph 1, then 2, ...), never at
  random. Some answers are not written and must be inferred. Unlike listening, questions can be skipped and revisited.
- Do not read the whole passage first: read one question, find the answer, then move to the next. Main-idea and
  title questions are best answered last.
- Some passages come with a chart or a table instead of, or beside, text.
- Golden rules: read the questions first; do not read the whole text; do not rely on word-for-word matches; do not
  spend time on a hard question; look for implied meaning when the words are not there.

## Question types and routines
| # | Type | Core routine |
|---|---|---|
| 1 | Pronoun reference | Decide singular/plural and person/thing/gender; the answer is almost always in the same or the previous sentence; confirm by substituting; "this/that" can refer to a whole idea; the nearest noun is not always the referent. |
| 2 | Vocabulary in context | Find the word, read the whole sentence (then the one before/after), look for clue types: similarity, contrast, definition, result (cause and effect), example; test each option by substitution; the first meaning you know is not always the right one. Word parts help: un-, in-, im-, il-, ir-, dis- (negation), re- (again), over-, mis-; -ful, -less. |
| 3 | Information and inference | Underline the question keywords, look for them and their synonyms, scan paragraph by paragraph, read only the surrounding lines. Direct information is stated; indirect information needs a small calculation; inference is not written but follows from the text. |
| 4 | Graphs and tables | Title, unit, axes, key/legend, then the exact part the question asks about; do not use outside knowledge; typical traps: wrong unit, mixing categories without the key. Chart kinds: single and grouped bars, horizontal bars, stacked bars, pie, table, line. Trend words: rise/increase/climb/grow/peak/double/triple; fall/decrease/decline/drop/collapse; compare words: highest, lowest, more/less than, approximately. |
| 5 | Text agreement (true / not true / not mentioned) | Read the stem to see which of the three is asked; take the options one at a time and check each against the text; "not true" contradicts the text, "not mentioned" is never discussed; match meaning, not words (synonyms). |
| 6 | Main idea / title | Answered last, after the other questions have shown what the passage is about (lesson not received). |
| 7 | Author's opinion | Intermediate level; lesson not received. |
| 8 | Linking and comparing two texts | Advanced level and the least frequent; lesson not received. |

Course levels: basic = pronouns, vocabulary, information and inference, graphs (the answer sits in a small part of the
text or graphic); intermediate = text agreement, main idea and title, author's opinion (needs more reading);
advanced = two-text questions.

## Worked-practice series (second source, same third-party style)
Four videos that solve whole recalled passages question by question (a short history text, a world-language chart,
a travel-history text, a mystery text, a country-history text, an astronomy text, a landmark text, a food text, a
prize text, a life-expectancy chart). What they add:
- **Search for the idea, not the word**: "old name" is found through "formerly known as"; "how many fields" through a
  list; the question and the passage often share no words. Capitalised words (names, places) are anchors.
- **Order of work inside a passage**: answer detail, pronoun and vocabulary questions as you meet them (each needs a
  sentence or two); leave "which of these is mentioned", text-type and title questions to the end, when you have seen
  most of the passage; mark skipped questions so none is forgotten. The presenter tries both orders for titles.
- **Title and paragraph main idea**: a correct title covers the whole passage; one detail or one paragraph is too
  narrow, a whole field is too broad; for "main idea of paragraph N" the right option summarises the paragraph and
  the wrong ones are single details from it.
- **Calculated information**: ages or durations from two dates, counts from a list, totals from "five planes plus
  one search plane".
- **Passage type** question ("what kind of text is this?": description, argument, story, opinion): decide after
  reading; a text with facts and no opinion or persuasion is a description.
- **Vocabulary**: stay in the sentence, use the neighbouring synonym or opposite, use word forms (bright to brighter
  means "more shining"), read all options before choosing, and note how much plain vocabulary matters.
- **"Not mentioned / not used" questions**: go through the passage paragraph by paragraph ticking options off.
- **Charts**: unit first (years, millions of users), then which panel (men left, women right), which colour in the key,
  then read the value; estimate between grid lines ("past the 50 line but short of 60 means under 10, so 9"); in
  multi-year charts make sure you are on the year asked.

## Gap against what the app has
- New question families seen here and not yet in the bank: passage type, "which paragraph discusses...", main idea
  of a given paragraph, calculated information, two-panel charts.
- Skills today: `rd-detail`, `rd-vocab-context`, `rd-pronoun-ref`, `rd-main-idea`, `rd-inference`,
  `rd-purpose-opinion`, `rd-asma`. Missing: graph/table reading, text agreement (true / not true / not mentioned),
  and a separate information-vs-inference split.
- Content: reading passages are text only. There is **no chart or table question type** and no chart component, so
  one of the course's reading question families cannot be practised or tested yet.
- The exam runner shows one passage with its questions; paragraph numbers and "paragraph N" references need numbered
  paragraphs in passage bodies.

## Proposed build (not started)
1. A small chart/table block for passages (bar, grouped bar, line, pie, table) rendered from data, with title, unit,
   axes and key; original datasets only.
2. Skills `rd-graph`, `rd-agreement` and an explicit `rd-scanning`; tags per question type.
3. Numbered paragraphs in new passages and "in paragraph N" question stems.
4. Lessons in the course order (pronouns, vocabulary, information and inference, graphs, text agreement, main idea),
   each with a worked example, guided practice and an exit card.

---

# Addendum: reading-section guide video (third-party)

Source: a complete guide to the STEP reading section with worked passages, from the same third-party Arabic course
(shared by the project owner; not official). Notes are in our own words. The transcript was read to about line 2000,
so the last passages may be missing.

## Facts the course gives
- 9 to 13 passages (varies) with 40 questions in total, worth 40 points, in 60 minutes: about 1.5 minutes per question.
- A passage can carry 1 to 8 questions. Total questions stay at 40 however many passages appear.
- Reading each passage fully costs 2 to 3 minutes; with 13 passages that wastes 30 to 40 minutes, leaving 30 to
  50 seconds per question. So do not read the passage first.
- Passages usually have no title; some questions ask you to choose the best title.

## Method
1. Read the first question and its options.
2. Pick a keyword (a name, number, rare word). Prefer a word that appears once or twice, not one that appears in
   every sentence (not blood group when every sentence says blood group; choose antigens).
3. Skim the passage for that keyword. Questions follow the order of the information, so start from the beginning for
   question 1, then continue from where the last answer was found; if the answer is not there, look a little above or below.
4. Read only the sentence around the keyword (a fuller sentence, then the one before or after if the meaning is
   unclear).
5. Match meaning, not words: the passage may use a synonym or a different word form (owns for has; nothing for not
   any; negative on both sides).
6. Repeat for each question. A question asking for the main idea or title comes last, because the other answers have
   already shown the passage.
7. If the option wording is not helpful, the keyword may sit in the options (a list of horses, five horses, ten
   horses points to a question about the number of horses).

## Question types in the guide
| Type | Notes |
|---|---|
| Pronoun | The pronoun is marked (underlined or shaded); the answer is usually in the same sentence or the one before. Example: he refers to the first-mentioned male noun. |
| Term / vocabulary | The word is marked and the paragraph number may be given. Answer in the same sentence or the next. Test each option by substitution in the sentence; reject the meaning that does not make sense (greedy fire means hungry for trees, not poor or rich). Transition words (for example, however) ask for a replacement word. A "why was this term used" or "what does it refer to" question also exists. |
| Information | The most common type. Either the answer is stated directly (born in 1960) or needs a small inference (born 1960 and died 2020 means age 60). Choose a keyword and scan. |
| Main idea / title | The text as a whole, or one paragraph; asked last. |
| Not mentioned | Which option does not appear? Check each option against the passage; the one never mentioned or contradicted is the answer. Beware of near-misses (a term similar to the one in the passage but not the same). |
| Does not agree | Which option contradicts the text, sometimes limited to one paragraph. |
| Author's opinion | Asks what the writer thinks about something. |
| Audience / text type | Who the text is written for; whether it is scientific, medical or historical. |

- The course also mentions short examples such as a firefighter passage: job, term meaning, a cause (why the rescue
  failed), a pronoun, an action taken (a fire break), a reason for being happy.
- Practice sources named: a site with explained passages and practice questions and a larger set of about 30
  passages in the same order as the solved set.

## Gaps this adds
- The keyword choice drill (rarest word, not the topic word) is new.
- The "order of questions follows the passage" rule can be used in the lesson tags and in item generation.
- Types listed here: pronoun, term, information (direct and inferred), main idea/title, not mentioned, does not agree,
  author opinion, audience, text type. The earlier reading doc already has most; add audience and text-type questions.

## Addendum: reading course (third-party course, not official), introduction and pronoun lesson

### Course introduction
- Goals: pass with 70+, master reading comprehension, develop English, build a base beyond the exam.
- How to use it: go in order (easy to hard, each level builds on the previous), pause and answer practice items before
  hearing the explanation, then use the practice sites listed in the description for more volume.
- Section facts restated: 60 minutes, 40 questions, about 13 passages, one to six questions per passage.
- Eight core question types, in lesson order: 1 pronouns, 2 terms, 3 information and inference, 4 graphs and charts;
  those four are the basic tier and test surface understanding (find the detail or make a simple inference).
  Then the medium tier: 5 matching or agreement with the text, 6 main idea and title, 7 author's opinion. These need
  more reading. Finally the advanced tier: 8 linking and comparing two texts (hardest, least frequent).
- Screen layout: passage on the left, its questions on the right; some passages have no title.
- Warnings: about 1.5 minutes per question, so reading the whole text is not affordable (use smart strategies);
  answers are not in passage order; some answers are not stated and must be inferred; skipping and returning is
  allowed.
- Golden rules: read the questions first; do not read the whole passage; do not depend on literal matches (questions
  paraphrase); do not assume order but search in an orderly way from paragraph 1 onward rather than at random; skip
  hard questions and return; when no literal answer exists, look for the implied meaning.

### Lesson 1: pronoun questions
- Task: name the word, person or thing a pronoun points to. It tests how ideas connect, tracking information in
  context, and knowing what the writer is talking about; it does not test the pronoun's own meaning.
- Wording: "The pronoun X in paragraph 5 refers to ...", "The word this in paragraph 2 refers to ...", "The
  underlined word it refers to ...".
- Steps:
  1. Identify the pronoun and classify it: singular or plural, masculine or feminine, person or thing. Eliminate
     options that do not fit.
  2. Read the sentence that holds the pronoun and the sentence before it. Most answers are there; rarely in the
     next sentence; never search the whole passage or go back to the start of the paragraph.
  3. Test by substitution: put your choice in place of the pronoun and check the sentence is logical.
- Agreement reference: he, him, his for a masculine singular person; she, her, hers for a feminine singular person;
  it, its for a singular thing, animal or concept; they, them, their for plurals; this, that for a singular idea,
  thing or situation already mentioned; these, those for plural things, ideas or situations already mentioned.
- Match-and-eliminate worked patterns: they or their means the answer must be plural (a city or teacher is out,
  dolphins or students stay); it or its needs a singular non-human (doctors are out as plural, Sarah is out as a
  person, a company or a report stay); he or his needs a singular male, she or her a singular female (animals,
  systems and plurals are out; a professor or Dr. Smith stays if the text gives the right gender).
- Rules: classify first, since this may remove half the options; the answer is usually in the same or previous
  sentence; test by substitution; this and that may refer to a whole idea or situation rather than one word; the
  noun closest to the pronoun is not always right, check the logic.
- Mistakes: automatically choosing the nearest noun without checking logic; ignoring singular or plural agreement.
- Practice method shown: do not read the passage first; read the question, answer it, move to the next; leave
  main-idea and title questions for last because they need a feel for the whole text.
- Worked passages seen (original topics, paraphrased): overhunting and its effect on ecosystems (the pronoun they
  points to the animal species that reproduce, since "overhunting" and "ecosystem" are singular); bone broth (the
  pronoun they points to minerals, found by reading the previous sentence and substituting; minerals contribute to
  the broth's nutrition); fish (a "resemble" vocabulary item solved by reading the contrast "some look like worms,
  others like stones", so the answer is "look like"; the pronoun it in paragraph 2 points to oxygen in water; an
  information item says scientists are expected to find more fish species, since the paragraph says new species
  are found every year).
- Further question types met inside these practice passages: vocabulary-in-context (use the sentence and neighbours
  for the meaning, for example "lacking" means missing), information (go to the stated paragraph, read it, rule out
  the options it never mentions), and main-idea questions saved for last.

### Gaps this adds
- Reading skill candidates: rd-pronoun-reference (with an agreement drill and elimination routine), rd-vocab-context.
- Question tags: type, difficulty tier (basic, medium, advanced), plus "answer location" (same sentence, previous
  sentence) to train the "look nearby" habit.
- Passage UI ideas: highlight the sentence that holds the target pronoun and the one before it in review mode.
- Truncation note: the pronoun-lesson transcript was readable only up to the fish passage's main-idea question.
- Still missing from the reading course: lessons 2 to 8 (terms, information and inference, graphs, matching, main idea
  and title, author's opinion, two-text linking).
