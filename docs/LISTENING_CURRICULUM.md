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
