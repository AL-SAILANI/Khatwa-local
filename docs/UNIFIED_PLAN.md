# Unified build plan (from the third-party course review)

Status: PLAN ONLY. Nothing below is built. Build starts when the owner says "ابدأ". PR #35 is merged only when the
owner says "ادمج". All content we write is original, aligned with the `step-prep-curriculum` skill; the third-party
material is used for structure and gap-finding, never copied.

## What the course taught that the product lacks (the gaps)
1. **Question-type awareness.** The course organizes everything by question type (listening 9, reading 8, grammar
   by rule). Our questions carry loose tags but no controlled type or rule field, so reports cannot say "you are
   weak at inference" or "weak at gr-conditionals".
2. **A routine per type.** Each type has steps, difficulty tiers, a golden-rules list and a common-mistakes list
   (our lessons have a template but not this per-type routine).
3. **Graphs and tables** (six chart types, unit and legend reading). We have no chart block.
4. **Reading question families:** true / false / not mentioned, vocabulary by context clue, pronoun reference,
   information vs inference, main idea and title, author's opinion, two-text linking.
5. **Missing grammar skills:** future continuous and perfect, present and past perfect continuous, time clauses,
   habit (used to / be used to), word forms, tag questions, modal perfect forms, verb-pattern split, dialogue-reply
   items, punctuation split by mark, capitalization split into lists.
6. **Listening distractor tags** (correction, rejected view, example vs main) and clip difficulty.
7. **Level and score bands** (A1 to C2 mapped to score ranges; an uncalibrated estimate).

## Phases (each its own PR, smallest valuable first)

### Phase 1 - Taxonomy and tagging (foundation, low risk)
- Add a controlled vocabulary: `qtype` per section (listening: information, inference, term, important-idea,
  opinion, main-idea, title, reason, evidence; reading: pronoun, term, information, inference, graph,
  agreement-true, agreement-false, not-mentioned, main-idea, title, author-opinion, two-text; grammar and writing:
  one `rule` id from `skills.ts`).
- Add optional `difficulty` (easy, medium, hard) and distractor tag fields.
- Tag the existing banks (mock exams 1 to 5, extras, level test); add a test that fails when a question has no
  `qtype` or no valid `rule`.
- Extend `skills.ts` with the new skill ids from gap 5 and one skill per listening and reading type.

### Phase 2 - Reports by type and rule (the visible payoff)
- Results page and study coach: weakest question types and weakest rules, each linking to its lesson.
- Predicted level band shown as an estimate with a clear "not official" label.
- Daily challenge picks the weakest type, not only the weakest section.

### Phase 3 - Chart and table block + graph questions
- A passage block that renders bar (single, multi, stacked, horizontal), line, pie and table from data, with title,
  unit, axis labels and legend; accessible text fallback.
- Number paragraphs in passages so "in paragraph 3" questions work; a "locate the paragraph" review aid.
- New reading item templates: agreement families, graph reading, vocabulary-by-clue, pronoun reference, with
  answer-location metadata (same sentence, previous sentence, paragraph n).

### Phase 4 - Lessons by type, in course order
- Listening: 9 lessons (information, inference, terms, important idea, opinions, main idea, title, reason,
  evidence) using the per-type routine, correction-word list, number-trap drills, and place-word clusters.
- Reading: pronouns, terms and clue families, information and inference (scanning), graphs, agreement families,
  main idea and title, author's opinion, two-text linking. The course material for the last three was not
  received, so those lessons come from the skill and general method, flagged as such.
- Grammar: rule routines plus a "read the options first" drill, the 12-tense map with 8 passive tenses, time-connector
  table, conditionals four-case table, relative-pronoun detection, verb-pattern split, capitalization lists,
  punctuation by mark.
- Arabic explanations with English examples; every string in `messages/ar.json` first with the English key present.

### Phase 5 - Original content growth, by frequency
- Grammar first (largest share: verb forms and patterns, comparison, modals, connectors, quantifiers, conditionals),
  then information-type listening clips with number and date traps (about a third of listening), then reading
  agreement and information items. Always with a script, an answer and a one-line explanation quoting the support.
- Listening audio stays our own generated audio (existing edge-tts pipeline); no third-party recordings.

### Phase 6 - Optional polish (only if wanted)
- A "more practice" Arabic page linking external sites by skill (see PRACTICE_SOURCES.md).
- Placement test refresh using the band table; study plan by days and hours.
- Optional unscored fourth mixed section; a note that it is experimental.

## Recommended order
Phase 1 then Phase 2 (together as the first PR pair), then Phase 3, then Phase 4 in slices (listening, reading,
grammar), with Phase 5 running alongside lessons. Reason: tagging unlocks reports at no content cost, and every later
item plugs into the same tags.

## Risks and caveats
- Course transcripts were auto-generated and several were truncated, so details may be incomplete; verify against
  the skill before writing a lesson.
- Source answer keys can be wrong (see SOURCE_ERRATA.md); every item we write is re-derived from its own passage.
- Score bands are an estimate and must stay labelled as such.
- Rights: no copying of third-party questions, scripts or audio.

## Decisions needed (defaults assumed if the owner just says ابدأ)
1. Start with Phases 1 and 2 as the first PR. Default: yes.
2. Predicted level band shown in results. Default: yes, labelled as an estimate.
3. Fourth mixed section. Default: skip for now.
4. Lessons in Arabic with English examples. Default: yes.
5. Keep PR #35 as the docs-and-planning PR and open new PRs from fresh branches off the default branch.
   Default: yes, after "ادمج".
