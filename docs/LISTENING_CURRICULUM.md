# STEP listening: question types and lesson plan

Source of the framework: a third-party Arabic video course on the STEP listening section (shared by the project
owner; not an official source). Only the framework and the solving routines are summarised here, in our own words.
All practice clips and questions must be original.

## Exam format described by the course
- About 9 clips, 20 questions in total, 1 to 4 questions per clip, 25 minutes, 20 marks (20% of the exam).
- Before each clip: 15 seconds per question to read the questions and options; then the clip starts by itself.
- Each clip plays once; no way back to an earlier clip; answers are not necessarily heard in question order.
- The clip and its questions share one screen; a notes pad exists but the course advises against using it.
- Some answers are stated directly, others must be inferred.

## The nine question types
| Level | # | Type | Core routine |
|---|---|---|---|
| Basic | 1 | Information (detail) | Predict the kind of answer (number, name, reason); watch for corrections and changed information; do not take the first match. |
| Basic | 2 | Inference from context | Never look for a word-for-word answer; follow the whole conversation; use topic words (place), tone and relationship. Sub-types: place, relationship, feeling, implied meaning, what happens next. |
| Basic | 3 | Vocabulary and expressions | Locate the word, read the options, use context and the other speaker's reaction. Idioms, phrasal verbs, multi-meaning words. |
| Intermediate | 4 | Main point / most important idea | The idea that gets more explanation, repetition or emphasis words; do not pick the first idea heard. |
| Intermediate | 5 | Speaker's opinion | Separate fact from opinion; opinion markers (I think, in my view, I doubt); degrees of certainty (might, probably, definitely); the opinion of the asked speaker only. |
| Intermediate | 6 | Main idea of the whole clip | Introduction and conclusion, repeated idea, the thread joining all details; a full statement, neither too narrow nor too broad. |
| Intermediate | 7 | Best title | A short phrase covering all details; not a sentence, not one example, not a whole field. |
| Advanced | 8 | Why the information is mentioned | Ask "what job does this do?" (example, evidence, contrast, background, consequence, objection, surprise); look at what comes just before it. |
| Advanced | 9 | Evidence and support | Claim, evidence (numbers, studies, reliable sources), example (one case), detail (extra description); evidence proves the claim directly. |

The course advises mastering types 1 to 7 before types 8 and 9, which appear less often.

## Gap against what the app has
- Skills today: `ls-gist`, `ls-detail`, `ls-inference`, `ls-idiom`, `ls-preview`. Missing: opinion, main point,
  title, purpose, evidence. Types 4 and 6 and 7 overlap with `ls-gist` and need one skill each in practice.
- Question tags today only distinguish `listening-comprehension` and `listening-inference`.
- Exam runner: preview, single play and forward-only clips are implemented (see `docs/CURRICULUM.md`).

## Proposed build (not started)
1. Skills: add `ls-opinion`, `ls-main-point`, `ls-title`, `ls-purpose`, `ls-evidence` (prerequisites: detail before
   inference/opinion; gist before title/main point; main point and inference before purpose/evidence); keep
   `ls-preview` as the routine lesson.
2. Question tags per type so mastery is tracked per skill.
3. Lessons in the nine-type order with a worked clip, guided practice and an exit card, each with original clips
   of realistic length (the course's own drills are deliberately short and unrealistic; the exam clips are longer).
4. Mock-exam listening banks tagged by type so the report can show weak types.

---

# Addendum: listening-section orientation video (third-party)

Source: an introduction to the STEP listening section with four practice clips, from the same third-party Arabic
course (shared by the project owner; not official). Notes are in our own words.

## Facts the course gives about the section
- 7 to 10 recordings (varies); 20 questions fixed; 25 minutes; worth about 20 points (20% of the exam).
- Each recording has 1 to 4 questions. Before it starts, you get about 15 seconds per question to read the questions
  and answers (e.g. 30 seconds for two, 45 for three, 60 for four).
- Each recording plays once. No replay. No going back: after pressing Next you cannot return to earlier questions
  (unlike reading and grammar, where review is possible).
- Short and light section, but unforgiving: one chance to hear.

## Approach
1. Use the preview time to read the questions and answers and work out what each asks (a number, a person, a place, a
   price, an opinion, a procedure).
2. As soon as the recording starts, stop reading and listen. Anything missed cannot be heard again.
3. Pick an answer as soon as you hear it. If a question was not answered directly, decide by context after it ends.
4. Note-taking is not recommended in general: recordings are short, many answers can be picked as heard, some
   questions are answered by context (the meaning of a term, the setting of the dialogue), and writing while
   listening costs focus (an unknown spelling can derail you). The only exception: with three or more questions,
   write one or two key words per question during the preview to remember what to listen for.

## Question types seen in the four clips
- Direct information (a page number, a price, a number of pages, which format).
- Who (the person who will be in the lab).
- Advice or procedure (what to do if you do not understand).
- Details of a list (what a flat has, the rent with and without an air conditioner).
- Setting of the conversation (where it happens, inferred from clues such as food and a restaurant).
- Opinion about something (the food: good but expensive).
- Format specifications (spacing, title style, number position, margin size in the right unit).

## Pitfalls and checks
- Units: check pixels vs centimetres, per month vs per week, dollars vs another currency.
- Distractors: a first-mentioned value may be corrected later (a rent with an extra feature costs more; without it, less).
- A conversation setting is never stated; infer it from topic words.
- Answer options may all be about one topic (all spacing, all about format): the question asks which detail.
- Hearing the answer early does not end the clip; do not stop listening if other questions about the same clip remain.

## Gaps this adds
- Matches the clip model already built in the product (15 seconds per question, one play, forward-only).
- Skill candidates: preview-reading strategy (what is asked), keep-listening discipline, context questions (setting,
  attitude), number and unit questions.
- Mock clips should include correction distractors and setting questions.
