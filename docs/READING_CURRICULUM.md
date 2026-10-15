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
