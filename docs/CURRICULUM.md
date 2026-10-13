# Khatwa curriculum blueprint

Audience: Saudi high-school students preparing for the STEP test that universities require.
All lessons, passages and questions are original Khatwa content; third-party booklets and sites are used for
structure, technique ideas and links only, never copied (see `.opencode/skills/step-prep-curriculum/SKILL.md`).

## 1. Exam facts (verified)

| Fact | Value | Source |
|---|---|---|
| Sections | Reading 40%, grammar structures 40% (grammar 30% + writing analysis 10%), listening 20% | etec.gov.sa (official) |
| Delivery | Digital only, no calculator | etec.gov.sa |
| Fee | 150 SAR in the Kingdom, 200 SAR abroad; edit or cancel up to 48 h before | etec.gov.sa |
| Results | 3 to 5 working days; valid 3 years | etec.gov.sa |
| Sessions | Open all year (2026) | etec.gov.sa |
| Size and timing | About 100 questions: 20 listening in 25 min, 40 reading in 60 min, 40 grammar block in 30 min (about 45 s per question) | dalilk booklet (third party) |
| Score bands | Under 40 foundation, 40-60 beginner, 60-80 intermediate, 80-100 advanced | dalilk booklet (third party) |
| Skills not tested | No speaking and no essay writing (the official page says "four skills" generically; the section list above is what is tested) | etec.gov.sa, dalilk |

Treat the "third-party" rows as approximations until Qiyas publishes them.

## 2. Tracks

1. **Reading** (40%): five question types (meaning, pronoun, detail, topic, opinion), solved in that order, plus a
   four-step passage routine (first lines, question keywords, locate, eliminate). Timed passages.
2. **Grammar** (30%): rules in order of exam frequency: comparison, countable/uncountable, prepositions, modals,
   present/past/future tenses, gerund vs infinitive, passive, pronouns, conditionals, conjunctions, wish, used to,
   question tags. Drill at 45 s per question; "read the options first, guess the rule, spot keywords, eliminate".
3. **Writing analysis** (10%): punctuation, capitalisation, sentence meaning, ordering, error spotting.
4. **Listening** (20%): 15 s question preview routine (read the question, extract the gist, skim options for
   keywords), paraphrase awareness, do not take notes, never dwell on a missed question.
5. **Vocabulary**: the 600 most frequent words in three levels, spaced repetition, word-in-context quizzes.
6. **Strategy**: time per question, never leave an answer blank, mock-exam review loop.

## 3. Learner flow

1. **Placement test** (30 questions, 35 min, official weights, 40/40/20 easy/medium/hard mix; reading by whole
   passage). Gives estimated score, band and the sections where the most points are lost.
2. **Plan** of 7, 15 or 30 days from the goal and the gap (`recommendDuration`, `buildStudyPath`).
3. **Daily path** interleaving the tracks, 30 minutes a day, weakest sections first.
4. **Mock exams**: full length (100 questions, 25 + 60 + 30 minutes), report with weak skills and next lessons.
5. **Retest** with a new placement or mock exam; the trend card shows progress.

## 4. Gaps and build order

Current content: 356 questions (reading 127, listening 106, grammar 75, writing analysis 48), 55 lessons,
626 words, one full mock exam.

| Step | Work | Status |
|---|---|---|
| 1 | Blueprint and placement test (balanced difficulty, reading by passage, band + focus report) | done |
| 2 | Plan path ordered by placement result: weakest track first, strong tracks skip the easiest lesson (`buildStudyPath`) | done |
| 3 | Reading lessons for the five question types (3) and listening 15-second routine + paraphrase lessons (2) | done |
| 4 | Grammar lessons per rule in exam order (countable/uncountable, wish, used to added; question tags practice added to the tags lesson) | done |
| 5 | Four more full mock exams (about 400 new original questions): exams 2, 3, 4 and 5 done (100 questions each) | done |
| 6 | Video layer: `lesson_videos` table, embedded players with credit and link-out | after 4 |

## 5. External resources

Link or embed through the owner's official player only. Never download, re-host or copy text.

| Skill | Resource | How | Check before launch |
|---|---|---|---|
| Grammar | EngVid grammar lessons (LearnVid Inc.) | Done as outbound links: 1-2 per grammar lesson (`src/data/engvid-links.ts`), opening on engvid.com in a new tab, nothing embedded or re-hosted | Embedding inside the app needs EngVid's written permission for a commercial app; ask before switching |
| Listening | VOA Learning English (US government work, generally public domain) | Embed or link graded news audio | Confirm each item's rights notice; some partner content is not public domain |
| Listening | BBC Learning English (6 Minute English) | Link out only | BBC terms do not allow re-hosting |
| Vocabulary | Tatoeba example sentences (CC BY 2.0 FR) | Optional extra sentences with attribution | Keep attribution; review quality |
| Reading | Own passages only | Write original passages on the expected topics | None |

## 6. Quality rules

- Each question has exactly one defensible answer, an explanation and a tag naming the rule or skill.
- Listening scripts are longer and faster than the third-party booklets: the real test is not a verbatim match.
- No question or passage copied from a booklet; new items cover the same topics with new wording.

## Content review log

- **Answer-length bias (mock exams 2-5):** in reading and listening the correct option was the single longest in about 66% of questions (chance is 25%), so test-wise students could guess it. 104 questions had distractors rewritten to be plausible and similar in length; the share is now about 39%. Grammar and writing-analysis were already balanced (about 15%/13%).
- Grammar and writing-analysis items of exams 2-5 were re-read for answer correctness and ambiguity; no errors found.
- Still needed before launch: a review by a qualified English teacher (accent/usage, level fit, distractor plausibility).
