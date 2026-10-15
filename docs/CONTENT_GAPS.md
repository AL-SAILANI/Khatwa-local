# Question-bank coverage by skill

Counts are questions per skill across all banks (1,109 unique questions), measured with the question types derived
from stems (`src/data/question-types.ts`). Phase 5 added `type-practice` (33 + 8 listening, 12 reading, 8 grammar,
8 writing) and `graph-practice` (17 reading).

## Before and after Phase 5
| Skill | Before | After |
|---|---|---|
| ls-opinion (speaker opinion) | 3 | 8 |
| ls-important-idea | 1 | 4 |
| ls-gist (main idea and title) | 4 | 13 |
| ls-idiom (terms and expressions) | 1 | 9 |
| ls-evidence | 1 | 4 |
| rd-agreement (true, false, not mentioned) | 4 | 16 |
| rd-graph (graphs and tables) | 0 | 17 |
| gr-time-clauses | 1 | 9 |
| wa-capitalization | 7 | 11 |
| wa-punctuation | 11 | 22 |

## Still thin
- ls-evidence 4, ls-important-idea 4 (both rare in the exam, so acceptable).
- Two-text linking: no question format yet.
- Listening items use the browser voice from a transcript; recorded audio exists only for some mock clips.

## Healthy
ls-numbers 56, ls-reason 47, ls-inference 40, ls-detail 119; rd-detail 302, rd-main-idea 43, rd-pronoun-ref 49,
rd-vocab-context 71, rd-inference 22, rd-purpose-opinion 24; gr-tag-questions 15, gr-habit 14.

## Method note
Types are derived from the question wording with regular expressions, so a few edge questions may land in the generic
detail bucket. New questions should carry an explicit specific tag (for example `listening-opinion`, `agreement`,
`graph`); an explicit tag always wins over derivation.
