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

## Addendum: listening course introduction and information-questions lesson (third-party course, not official)

### Course design
- Goals: reach 70+ on listening, build real listening skill, and grow general English.
- Lesson order: three basic types (information, inference from context, terms and expressions), four intermediate
  types (speaker's main point, speaker opinions, main idea, best title), two advanced types (why something was
  mentioned, evidence or support; the rarest).
- Practice format: clip on one side, questions on the other, a notes area. Instructions first, then 15 seconds per
  question, one automatic play, no going back, no replay, answers not in clip order, some answers only implied.
- Golden rules: use the preview to read questions and options, never match word for word, never assume order, stop
  reading once the audio starts, notes are allowed but not advised.

### Information questions (most frequent type)
- Direct facts, no inference; the difficulty is speed and focus.
- Asked items: time, number, year, name, price, place, duration (how long), distance (how far), the part someone
  did not understand.
- Three steps: (1) read the question and predict the kind of answer, from the question or the options; (2) pick the
  keyword and its likely synonyms; (3) watch for corrections and never lock in the first value.
- Difficulty tiers: easy (clear lead-in to the fact), medium (fact arrives with no lead-in), hard (several numbers,
  corrections, rephrasing, fast speech).
- Typical traps: similar sounds (13 vs 30, Tuesday vs Thursday), number reading order (years said in two halves,
  such as nineteen eighty-seven), self-corrections (time or price changed mid-speech), several numbers where only one
  answers the question, a changed decision (the final choice wins).
- Correction signals: actually, I mean, sorry, no, hold on; confirmation signals: let me repeat, just to confirm.
- Five rules: read the question first; wait for the end before committing; watch correction words; long numbers
  such as room numbers or codes are slow, so capture them at once; with two similar items, ask which one the
  question wants.
- Practice cases seen: meeting day and room corrected (Thursday to Friday, room 14 to 40, 2 pm to 3 pm), test date
  plus number of units, page range changed, test moved from Tuesday to Thursday.
- "Important idea" questions belong to a later lesson (not yet received).

### Gaps this adds
- Skill candidates: ls-info-numbers (similar-sounding numbers, dates, prices), ls-info-corrections (self-correction
  and changed-decision clips), predict-the-answer-type drill in the preview step.
- Mock clips should carry difficulty tags (easy, medium, hard) and a correction flag.
- The existing 15-second preview and single play already match the course format.

## Addendum: listening lessons 2 to 6 (third-party course, not official)

Lesson order in the course: 1 information, 2 inference from context, 3 terms and expressions, 4 important idea
(first intermediate lesson), 5 speaker opinions, 6 main idea. Lessons 7 to 9 (best title, reason for mentioning,
evidence or support) have not arrived yet. Each lesson follows one template: question wording, steps, difficulty
tiers, sub-types, golden rules, common mistakes, practice clips.

### Lesson 2: inference from context
- The answer is not said directly; it is built from word choice, tone, the situation, and the relation between
  speakers. If the answer is said directly, the question is really an information question.
- Question wording: where is the conversation, what is the relationship, what does the speaker imply, how does the
  person feel, what will happen next, what can be understood.
- Steps: do not hunt for a literal match or translate word by word; follow how the conversation develops; lock on
  keywords tied to the place or situation.
- Tiers: easy (clear clues), medium (combine several clues), hard (very implicit, many distractors, a decision
  changes, feeling not stated).
- Sub-types and clue sets:
  - Place: airport (gate, flight, boarding, passport, luggage), restaurant (menu, order, waiter, reservation, table),
    hotel (key, room, check in, check out, reception), school or university (assignment, class, lecture, deadline,
    semester, homework). The place can be inferred even when never named.
  - Relationship (teacher and student, doctor and patient, manager and employee, customer and seller): judge by
    politeness level, orders, requests and the kind of questions asked. Sometimes infer the place first, then the
    relationship.
  - Feeling: tone, word choice and how the other person replies (sympathy or comforting suggests sadness; effort
    that ended in failure suggests frustration even if "sad" is never said).
  - Implied meaning: the question asks what the speaker suggests; the idea is hinted, never stated.
  - What happens next: rely on suggestions, agreements and the final decision.
- Golden rules: the answer is usually not stated word for word; for place, watch place words; for feeling, watch
  tone, words and reaction; for next action, watch plans, promises, suggestions and decisions; the correct option is
  supported by evidence, never a guess built on assumptions.
- Common mistake: choosing something logical that the recording does not support.
- Practice patterns seen: job applicant and secretary at a business office; a restaurant order where both people
  say they are hungry (the option "both are hungry" is the inference); manager and secretary booking the largest
  meeting room; a phone call where email and fax both fail so the next step is sending an email (the last
  agreement wins); a language lesson where the student reveals he knows Arabic and English; a delayed flight
  announcement where the departure city is the airport location; a customer talking to a travel agent with date
  correction (13th confirmed over 30th); a teacher hinting that a student will be very busy ("has a lot on his
  plate next week").
- Method note from the clips: option elimination works; options not mentioned at all are wrong.

### Lesson 3: terms and expressions
- Asks for the meaning of a word, phrase or idiom from context, or why it was used. Wording: what does X mean, what
  does the speaker mean by X, which is closest in meaning to X.
- Steps: identify the target; scan the options; follow the situation of each speaker; watch the other person's
  reaction, which often gives away the meaning.
- Tiers: easy (familiar word, clear context), medium (unfamiliar word, clear context), hard (several possible
  meanings).
- Types: idioms (break the ice, under the weather meaning mildly ill, hit the books meaning study hard, get cold
  feet meaning hesitate at the last moment); phrasal verbs (give up, look for, look after, find out); multi-meaning
  words (issue = topic, to release, or a problem; charge = fee, to power a battery, an accusation, responsibility;
  figure = number, important person, shape, or "figure out"; point = idea, to indicate, score, purpose).
- Strategy: look for a definition or restatement in the next sentences (a contract "terminated" then "canceled");
  watch the reply (sympathy after "I'm under the weather" shows a negative meaning); never translate literally;
  use the whole situation (finance means fee, law means accusation, teamwork means responsibility).
- Rules: no literal translation; hear the full sentence before and after the target; ask what the speaker intends,
  not what the words say.
- Mistakes: literal translation; choosing a true meaning of the word that does not fit this context (light as
  lamp vs not heavy).
- Practice patterns seen: "she will not come back" via a move to another city; "blew me away" (thrilled);
  "think it over" then "turn down" (refused); "don't keep me in suspense" (tell me now); "it's anyone's guess"
  (nobody knows); focus as concentrate; "came up with" as thought of or invented.

### Lesson 4: important idea (first intermediate lesson)
- Asks which idea the speaker stressed most when several are mentioned. Wording: which point does the speaker make
  about X, which information is most important, which factor is most important, which detail is mentioned, what
  does the speaker emphasize.
- Steps: notice where the speaker explains longer or gives more examples; listen for emphasis words; do not take
  the first idea you hear.
- Tiers: easy (clearly stated), medium (several important ideas, one stressed more), hard (every option was
  mentioned and all seem right).
- Ways a speaker shows importance: repeats or elaborates the idea; emphasis phrases (most importantly, more
  important, the key point, the main issue, the main problem; these words have other uses too, and need not appear).
- How it differs from neighbours: information questions have a direct answer (when does it start); important-idea
  questions need weighing among mentioned items; opinion questions ask what the speaker believes (next lesson).
- Rules: the important idea gets more time, more examples, more numbers and emphasis words; on a tie pick the one
  explained longer; the answer is not always first, since the speaker may build toward it; statistics are strong
  evidence of importance.
- Mistake: a true statement from the recording that is not the emphasized one.
- Practice patterns seen: exercise helps weight loss, mood and sleep, but "most important" is heart health; a
  company's success: the common beliefs are packaging and product range, but experts point to advertising (the
  "something else" signal), plus an Olympic sponsorship date and a can-introduction year as information items;
  athletes' food: the key point is energy supply; experts struggle to explain simply; a self-correction ("groups,
  actually in pairs"); a reading page that was corrected from 7 to 13; a tuesday or monday rumour denied.
- Exam note from the course: question pairs often share one clip, and 30 seconds are given to read two questions.

### Lesson 5: speaker opinions
- Asks what the speaker thinks or feels about a topic. Wording: what does the speaker think about X, how does the
  speaker feel about X, what is the teacher's view, what does the professor believe, what is the speaker's attitude.
- Steps: name the topic; spot opinion words (I think, I believe, in my opinion, to me, it seems to me, frankly,
  personally, I agree, I do not agree, I doubt, I am not convinced); read tone and word choice (enthusiastic,
  angry, critical, unconvinced); separate fact from opinion; watch corrections and comparisons.
- Tiers: easy (opinion stated plainly), medium (opinion implied by words and tone), hard (several opinions,
  hesitation, a changed position, sarcasm).
- Fact vs opinion: a fact can be checked and proven (research shows, data indicate, a 30 percent increase); an
  opinion is a personal judgement (I think, I feel, in my view, it seems).
- Certainty levels: hesitant (might, could), neutral (may, can suggest a wider trend), supportive (probably, likely)
  and enthusiastic (definitely, certainly).
- Rules: do not assume the speaker agrees with every idea mentioned, since he may only be explaining it; look for
  opinion words and confirm what you pick is an opinion, not a fact.
- Mistakes: choosing a fact where an opinion is asked; mixing the asked person's opinion with someone else's
  (teacher vs student); the speaker states a common view first and then gives the personal one.
- Practice patterns seen: online learning (researchers argue it is as good, but "I personally believe face to face
  is essential", so the answer is "not as good as in person"); retirement age (some say fine, others say raise it,
  the speaker says "a little too low"; older people work to support family; firms hire them for experience, with
  savings and kindness named by others as the rejected beliefs); solar power (the speaker's best solution, more
  public awareness is the point they are certain about).

### Lesson 6: main idea
- One of the most frequent listening types. It asks for the single overall idea of the recording, the whole thing
  in one sentence. Wording: what is the lecture mainly about, what is the main idea of the recording.
- Steps: focus on the overall topic; weigh the introduction and the conclusion; find what all the details serve.
- Where to find it: the introduction (today we will look at, in this lecture I want to discuss); the conclusion
  (in conclusion); repeated ideas; the common thread connecting all the details.
- Tiers: easy (one idea only), medium (several subtopics), hard (many details, main idea never stated directly).
- Scope check: too narrow answers cover only one example or part; too general answers could fit hundreds of
  lectures. The right answer fits this whole recording and nothing wider.
- Rules: the right answer suits the whole recording; test each option (does it describe this recording or any
  recording); introduction and conclusion are the strongest evidence; an option naming one person, number or place
  is probably too narrow; the repeated idea linking everything is the main idea even if the introduction does not
  say it; the main idea is a full sentence summarizing everything said.
- Mistakes: picking an answer that is too narrow, or too general.
- Practice patterns seen: transport in several cities (right answer: how cities develop public transport and its
  benefits; Amsterdam bikes and Singapore cards are single examples); a person with a health problem (the
  difference between a stated non-cause such as work, family or supervisor, and the real cause, health); reasons
  people are vegetarian; stress harms the body; how birds find their way (magnetic field and a protein, rather than
  migration distance); effects of TV violence (the answer topic is the effect; the speaker's view is "may have an
  effect, but not strong enough proof"); three laws of motion; product portfolio analysis (the named methods are
  only examples).
- Link to opinion question in same recording: a main-idea question and a speaker-feeling question often share one
  clip.

### Gaps this adds
- Skill candidates in the listening family: ls-inference-place, ls-inference-relationship, ls-inference-feeling,
  ls-inference-next-action, ls-terms-idioms, ls-terms-phrasal-verbs, ls-terms-multi-meaning, ls-important-idea,
  ls-opinion, ls-fact-vs-opinion, ls-main-idea, ls-scope-check (narrow vs general).
- Question tags for mock clips: type (information, inference, term, important idea, opinion, main idea) and
  difficulty (easy, medium, hard), plus distractor tags (correction, rejected view, example vs main).
- The product already supports shared clips with several questions; add a type tag per question for the report.
- Drill ideas: word-cluster place guessing, fact-or-opinion sorting, "too narrow, too general, just right" scope
  game, and "which meaning fits this sentence" for multi-meaning words.
- Truncation note: the opinions, inference and important-idea transcripts were cut off near their ends, and the
  main-idea file stopped in the last practice item.
