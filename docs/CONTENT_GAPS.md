# Question-bank coverage by skill (after Phase 1 typing)

Counts are questions per skill across all banks (1,023 unique questions), measured after question types were derived
from stems (`src/data/question-types.ts`). Use this to decide where original questions are needed (Phase 5).

## Thin (write these first)
| Skill | Questions | Note |
|---|---|---|
| ls-evidence | 1 | evidence and support (rare in the exam, so low priority) |
| ls-important-idea | 1 | the most important idea |
| ls-idiom (terms and expressions) | 1 | terms and idioms |
| ls-opinion | 3 | speaker opinions |
| ls-gist (main idea and title) | 4 | main idea, best title |
| rd-agreement | 4 | true, false, not mentioned, EXCEPT |
| gr-time-clauses | 1 | before, after, when, while, by the time, until |

## Healthy
ls-numbers 51, ls-reason 41, ls-inference 40, ls-detail 117; rd-detail 302, rd-main-idea 43, rd-pronoun-ref 49,
rd-vocab-context 71, rd-inference 22, rd-purpose-opinion 24; gr-tag-questions 15, gr-habit 14.

## Not yet possible
- Graph and table reading (no chart component yet, Phase 3).
- Two-text linking (no question format yet).

## Method note
Types are derived from the question wording with regular expressions, so a few edge questions may land in the generic
detail bucket. New questions should carry an explicit specific tag (for example `listening-opinion`, `agreement`); an
explicit tag always wins over derivation.
