# STEP reading: question types and lesson plan

Source of the framework: a third-party Arabic video course on the STEP reading section (shared by the project
owner; not an official source; five lessons received so far: pronouns, vocabulary, information and inference,
graphs, text agreement; the main-idea and title lesson was not received). Only the framework and routines are
summarised, in our own words. Practice passages and questions must be original.

## What the course says about the format
- Passages are long (6 to 15 numbered paragraphs); questions often name a paragraph ("in paragraph 5...").
- Questions generally follow the order of the passage; main-idea and title questions are best answered last.
- Do not read the whole passage first: read one question, find the answer, then move to the next.
- Some passages come with a chart or a table instead of, or beside, text.

## Question types and routines
| # | Type | Core routine |
|---|---|---|
| 1 | Pronoun reference | Decide singular/plural and person/thing/gender; the answer is almost always in the same or the previous sentence; confirm by substituting; "this/that" can refer to a whole idea; the nearest noun is not always the referent. |
| 2 | Vocabulary in context | Find the word, read the whole sentence (then the one before/after), look for clue types: similarity, contrast, definition, result (cause and effect), example; test each option by substitution; the first meaning you know is not always the right one. Word parts help: un-, in-, im-, il-, ir-, dis- (negation), re- (again), over-, mis-; -ful, -less. |
| 3 | Information and inference | Underline the question keywords, look for them and their synonyms, scan paragraph by paragraph, read only the surrounding lines. Direct information is stated; indirect information needs a small calculation; inference is not written but follows from the text. |
| 4 | Graphs and tables | Title, unit, axes, key/legend, then the exact part the question asks about; do not use outside knowledge; typical traps: wrong unit, mixing categories without the key. Chart kinds: single and grouped bars, horizontal bars, stacked bars, pie, table, line. Trend words: rise/increase/climb/grow/peak/double/triple; fall/decrease/decline/drop/collapse; compare words: highest, lowest, more/less than, approximately. |
| 5 | Text agreement (true / not true / not mentioned) | Read the stem to see which of the three is asked; take the options one at a time and check each against the text; "not true" contradicts the text, "not mentioned" is never discussed; match meaning, not words (synonyms). |
| 6 | Main idea / title | Answered last, after the other questions have shown what the passage is about (lesson not received). |

## Gap against what the app has
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
