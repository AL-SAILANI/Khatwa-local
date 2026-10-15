# Curriculum architecture

Design for the next curriculum generation (replaces the linear course list with a skill graph).
Exam facts live in `docs/CURRICULUM.md`; this file is the learning design.

## Exam model (what STEP measures)

Recognition skills only (no speaking, no essay), all multiple choice, timed.
Reading 40%, structure 30%, listening 20%, compositional analysis 10%.
Levers for score: vocabulary coverage (feeds reading and listening), grammar fluency at about
45 s per item, and test technique (ASMA, AGDA, 15-second preview).

## Principles

| Method | Rule in Khatwa |
|---|---|
| Backward design | Every lesson derives from a skill the exam measures |
| Mastery learning | A skill counts as mastered at 80% or more on the exit card |
| Spaced retrieval | Review cards scheduled per learner (`review_cards`) |
| Interleaving | Practice mixes the new skill with earlier ones |
| Explicit instruction | Lesson template: diagnose, explain, worked examples, guided, independent, exit card |
| Diagnostic feedback | Each wrong option maps to a known error and is explained |
| Adaptive path | Next skill = highest (exam weight x learner gap) whose prerequisites are ready |
| Microlearning | Units of 10 to 15 minutes |

## Skill graph

`src/data/skills.ts`: section > domain > skill, with prerequisites, CEFR level and exam frequency.
`skillsForTags()` maps every existing question tag to a skill (test guarantees full coverage of the bank).
Tables in `supabase/migrations/0007_skill_graph.sql` (`skills`, `question_skills`,
`user_skill_mastery`, `review_cards`). Prerequisites are a soft gate (recommended, not locked).

## Lesson types

Concept, strategy, timed drill, spaced review, error clinic, checkpoint, simulation.

## Session engine (replaces the linear lock)

Daily session = due reviews (about 5 min) + one new skill + timed mixed practice.
Phases: diagnose, foundation, technique and speed, simulation, final review of weak skills.

## Build order

| Phase | Work | Status |
|---|---|---|
| A | Skill map in code + migration file | skill map done; migration written, not yet applied |
| B | Lesson player with blocks (explain, video, worked example, guided practice, technique, exit card, review); blocks derived from existing notes and questions, no schema change | built; exit card needs 80% (retry or continue anyway) |
| C | Session engine using mastery and due reviews | after B |
| D | Re-tag lessons and questions to skills in the database | after A is applied |
| E | Item analytics (difficulty, discrimination) and predicted score | after real usage |
