# Source errata (third-party material)

Known mistakes found in third-party practice files. Never import answer keys from these sources without checking
each answer against the passage. Our own question bank is written independently and is not affected unless noted.

## Reading drills PDF ("solved" version, 100 pages)
- **Passage 4 (Ibn Sina), last question, page 17**: "Ibn Sina died when he was ...". The solved key highlights
  option a (50 years old). The passage's last sentence says he worked "until his death at the age of 56 years", so
  the correct answer is **b (56 years old)**. Reported by the project owner.
- Impact on this repo: none. Our Ibn Sina passage (`passage-sm-10` in `src/data/step-mock-reading.ts`) states
  "fifty-six" and has no question asking the age at death. The only age questions ask when he became a skilled
  physician (sixteen, correct).

## Files received (not imported)
- Grammar collection PDF (485 pages, about 950 items, no answer key): see the summary at the end of GRAMMAR_CURRICULUM.md.
- Reading drills, unsolved (100 pages) and solved (100 pages; same text, with an answer key): third-party, wording
  not ours, so only the structure is used as a reference, never copied.
- 50-question practice booklet (34 pages: listening, reading, grammar and writing analysis): reference only.

## Rule for any future import
- Re-derive each correct answer from the passage text; record a one-line explanation quoting where the passage
  supports it (our questions already carry an `explanation` field for this).
