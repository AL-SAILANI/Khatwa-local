# STEP reading: question types and lesson plan

Source of the framework: a third-party Arabic video course on the STEP reading section (shared by the project
owner; not an official source; received: the course introduction and five lessons: pronouns, vocabulary,
information and inference, graphs, text agreement). Only the framework and routines are summarised, in our own
words. Practice passages and questions must be original.

## What the course says about the format
- 60 minutes, 40 questions, about 13 passages, 1 to 6 questions per passage (about 90 seconds per question, which
  is not enough to read every passage in full).
- The passage and its questions share one screen (passage on one side, questions on the other); some passages have
  no title.
- Passages are long (6 to 15 numbered paragraphs); questions often name a paragraph ("in paragraph 5...").
- Answers are not necessarily in passage order, but search in an orderly way (paragraph 1, then 2, ...), never at
  random. Some answers are not written and must be inferred. Unlike listening, questions can be skipped and revisited.
- Do not read the whole passage first: read one question, find the answer, then move to the next. Main-idea and
  title questions are best answered last.
- Some passages come with a chart or a table instead of, or beside, text.
- Golden rules: read the questions first; do not read the whole text; do not rely on word-for-word matches; do not
  spend time on a hard question; look for implied meaning when the words are not there.

## Question types and routines
| # | Type | Core routine |
|---|---|---|
| 1 | Pronoun reference | Decide singular/plural and person/thing/gender; the answer is almost always in the same or the previous sentence; confirm by substituting; "this/that" can refer to a whole idea; the nearest noun is not always the referent. |
| 2 | Vocabulary in context | Find the word, read the whole sentence (then the one before/after), look for clue types: similarity, contrast, definition, result (cause and effect), example; test each option by substitution; the first meaning you know is not always the right one. Word parts help: un-, in-, im-, il-, ir-, dis- (negation), re- (again), over-, mis-; -ful, -less. |
| 3 | Information and inference | Underline the question keywords, look for them and their synonyms, scan paragraph by paragraph, read only the surrounding lines. Direct information is stated; indirect information needs a small calculation; inference is not written but follows from the text. |
| 4 | Graphs and tables | Title, unit, axes, key/legend, then the exact part the question asks about; do not use outside knowledge; typical traps: wrong unit, mixing categories without the key. Chart kinds: single and grouped bars, horizontal bars, stacked bars, pie, table, line. Trend words: rise/increase/climb/grow/peak/double/triple; fall/decrease/decline/drop/collapse; compare words: highest, lowest, more/less than, approximately. |
| 5 | Text agreement (true / not true / not mentioned) | Read the stem to see which of the three is asked; take the options one at a time and check each against the text; "not true" contradicts the text, "not mentioned" is never discussed; match meaning, not words (synonyms). |
| 6 | Main idea / title | Answered last, after the other questions have shown what the passage is about (lesson not received). |
| 7 | Author's opinion | Intermediate level; lesson not received. |
| 8 | Linking and comparing two texts | Advanced level and the least frequent; lesson not received. |

Course levels: basic = pronouns, vocabulary, information and inference, graphs (the answer sits in a small part of the
text or graphic); intermediate = text agreement, main idea and title, author's opinion (needs more reading);
advanced = two-text questions.

## Worked-practice series (second source, same third-party style)
Four videos that solve whole recalled passages question by question (a short history text, a world-language chart,
a travel-history text, a mystery text, a country-history text, an astronomy text, a landmark text, a food text, a
prize text, a life-expectancy chart). What they add:
- **Search for the idea, not the word**: "old name" is found through "formerly known as"; "how many fields" through a
  list; the question and the passage often share no words. Capitalised words (names, places) are anchors.
- **Order of work inside a passage**: answer detail, pronoun and vocabulary questions as you meet them (each needs a
  sentence or two); leave "which of these is mentioned", text-type and title questions to the end, when you have seen
  most of the passage; mark skipped questions so none is forgotten. The presenter tries both orders for titles.
- **Title and paragraph main idea**: a correct title covers the whole passage; one detail or one paragraph is too
  narrow, a whole field is too broad; for "main idea of paragraph N" the right option summarises the paragraph and
  the wrong ones are single details from it.
- **Calculated information**: ages or durations from two dates, counts from a list, totals from "five planes plus
  one search plane".
- **Passage type** question ("what kind of text is this?": description, argument, story, opinion): decide after
  reading; a text with facts and no opinion or persuasion is a description.
- **Vocabulary**: stay in the sentence, use the neighbouring synonym or opposite, use word forms (bright to brighter
  means "more shining"), read all options before choosing, and note how much plain vocabulary matters.
- **"Not mentioned / not used" questions**: go through the passage paragraph by paragraph ticking options off.
- **Charts**: unit first (years, millions of users), then which panel (men left, women right), which colour in the key,
  then read the value; estimate between grid lines ("past the 50 line but short of 60 means under 10, so 9"); in
  multi-year charts make sure you are on the year asked.

## Gap against what the app has
- New question families seen here and not yet in the bank: passage type, "which paragraph discusses...", main idea
  of a given paragraph, calculated information, two-panel charts.
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

---

# Addendum: reading-section guide video (third-party)

Source: a complete guide to the STEP reading section with worked passages, from the same third-party Arabic course
(shared by the project owner; not official). Notes are in our own words. The transcript was read to about line 2000,
so the last passages may be missing.

## Facts the course gives
- 9 to 13 passages (varies) with 40 questions in total, worth 40 points, in 60 minutes: about 1.5 minutes per question.
- A passage can carry 1 to 8 questions. Total questions stay at 40 however many passages appear.
- Reading each passage fully costs 2 to 3 minutes; with 13 passages that wastes 30 to 40 minutes, leaving 30 to
  50 seconds per question. So do not read the passage first.
- Passages usually have no title; some questions ask you to choose the best title.

## Method
1. Read the first question and its options.
2. Pick a keyword (a name, number, rare word). Prefer a word that appears once or twice, not one that appears in
   every sentence (not blood group when every sentence says blood group; choose antigens).
3. Skim the passage for that keyword. Questions follow the order of the information, so start from the beginning for
   question 1, then continue from where the last answer was found; if the answer is not there, look a little above or below.
4. Read only the sentence around the keyword (a fuller sentence, then the one before or after if the meaning is
   unclear).
5. Match meaning, not words: the passage may use a synonym or a different word form (owns for has; nothing for not
   any; negative on both sides).
6. Repeat for each question. A question asking for the main idea or title comes last, because the other answers have
   already shown the passage.
7. If the option wording is not helpful, the keyword may sit in the options (a list of horses, five horses, ten
   horses points to a question about the number of horses).

## Question types in the guide
| Type | Notes |
|---|---|
| Pronoun | The pronoun is marked (underlined or shaded); the answer is usually in the same sentence or the one before. Example: he refers to the first-mentioned male noun. |
| Term / vocabulary | The word is marked and the paragraph number may be given. Answer in the same sentence or the next. Test each option by substitution in the sentence; reject the meaning that does not make sense (greedy fire means hungry for trees, not poor or rich). Transition words (for example, however) ask for a replacement word. A "why was this term used" or "what does it refer to" question also exists. |
| Information | The most common type. Either the answer is stated directly (born in 1960) or needs a small inference (born 1960 and died 2020 means age 60). Choose a keyword and scan. |
| Main idea / title | The text as a whole, or one paragraph; asked last. |
| Not mentioned | Which option does not appear? Check each option against the passage; the one never mentioned or contradicted is the answer. Beware of near-misses (a term similar to the one in the passage but not the same). |
| Does not agree | Which option contradicts the text, sometimes limited to one paragraph. |
| Author's opinion | Asks what the writer thinks about something. |
| Audience / text type | Who the text is written for; whether it is scientific, medical or historical. |

- The course also mentions short examples such as a firefighter passage: job, term meaning, a cause (why the rescue
  failed), a pronoun, an action taken (a fire break), a reason for being happy.
- Practice sources named: a site with explained passages and practice questions and a larger set of about 30
  passages in the same order as the solved set.

## Gaps this adds
- The keyword choice drill (rarest word, not the topic word) is new.
- The "order of questions follows the passage" rule can be used in the lesson tags and in item generation.
- Types listed here: pronoun, term, information (direct and inferred), main idea/title, not mentioned, does not agree,
  author opinion, audience, text type. The earlier reading doc already has most; add audience and text-type questions.

## Addendum: reading course (third-party course, not official), introduction and pronoun lesson

### Course introduction
- Goals: pass with 70+, master reading comprehension, develop English, build a base beyond the exam.
- How to use it: go in order (easy to hard, each level builds on the previous), pause and answer practice items before
  hearing the explanation, then use the practice sites listed in the description for more volume.
- Section facts restated: 60 minutes, 40 questions, about 13 passages, one to six questions per passage.
- Eight core question types, in lesson order: 1 pronouns, 2 terms, 3 information and inference, 4 graphs and charts;
  those four are the basic tier and test surface understanding (find the detail or make a simple inference).
  Then the medium tier: 5 matching or agreement with the text, 6 main idea and title, 7 author's opinion. These need
  more reading. Finally the advanced tier: 8 linking and comparing two texts (hardest, least frequent).
- Screen layout: passage on the left, its questions on the right; some passages have no title.
- Warnings: about 1.5 minutes per question, so reading the whole text is not affordable (use smart strategies);
  answers are not in passage order; some answers are not stated and must be inferred; skipping and returning is
  allowed.
- Golden rules: read the questions first; do not read the whole passage; do not depend on literal matches (questions
  paraphrase); do not assume order but search in an orderly way from paragraph 1 onward rather than at random; skip
  hard questions and return; when no literal answer exists, look for the implied meaning.

### Lesson 1: pronoun questions
- Task: name the word, person or thing a pronoun points to. It tests how ideas connect, tracking information in
  context, and knowing what the writer is talking about; it does not test the pronoun's own meaning.
- Wording: "The pronoun X in paragraph 5 refers to ...", "The word this in paragraph 2 refers to ...", "The
  underlined word it refers to ...".
- Steps:
  1. Identify the pronoun and classify it: singular or plural, masculine or feminine, person or thing. Eliminate
     options that do not fit.
  2. Read the sentence that holds the pronoun and the sentence before it. Most answers are there; rarely in the
     next sentence; never search the whole passage or go back to the start of the paragraph.
  3. Test by substitution: put your choice in place of the pronoun and check the sentence is logical.
- Agreement reference: he, him, his for a masculine singular person; she, her, hers for a feminine singular person;
  it, its for a singular thing, animal or concept; they, them, their for plurals; this, that for a singular idea,
  thing or situation already mentioned; these, those for plural things, ideas or situations already mentioned.
- Match-and-eliminate worked patterns: they or their means the answer must be plural (a city or teacher is out,
  dolphins or students stay); it or its needs a singular non-human (doctors are out as plural, Sarah is out as a
  person, a company or a report stay); he or his needs a singular male, she or her a singular female (animals,
  systems and plurals are out; a professor or Dr. Smith stays if the text gives the right gender).
- Rules: classify first, since this may remove half the options; the answer is usually in the same or previous
  sentence; test by substitution; this and that may refer to a whole idea or situation rather than one word; the
  noun closest to the pronoun is not always right, check the logic.
- Mistakes: automatically choosing the nearest noun without checking logic; ignoring singular or plural agreement.
- Practice method shown: do not read the passage first; read the question, answer it, move to the next; leave
  main-idea and title questions for last because they need a feel for the whole text.
- Worked passages seen (original topics, paraphrased): overhunting and its effect on ecosystems (the pronoun they
  points to the animal species that reproduce, since "overhunting" and "ecosystem" are singular); bone broth (the
  pronoun they points to minerals, found by reading the previous sentence and substituting; minerals contribute to
  the broth's nutrition); fish (a "resemble" vocabulary item solved by reading the contrast "some look like worms,
  others like stones", so the answer is "look like"; the pronoun it in paragraph 2 points to oxygen in water; an
  information item says scientists are expected to find more fish species, since the paragraph says new species
  are found every year).
- Further question types met inside these practice passages: vocabulary-in-context (use the sentence and neighbours
  for the meaning, for example "lacking" means missing), information (go to the stated paragraph, read it, rule out
  the options it never mentions), and main-idea questions saved for last.

### Gaps this adds
- Reading skill candidates: rd-pronoun-reference (with an agreement drill and elimination routine), rd-vocab-context.
- Question tags: type, difficulty tier (basic, medium, advanced), plus "answer location" (same sentence, previous
  sentence) to train the "look nearby" habit.
- Passage UI ideas: highlight the sentence that holds the target pronoun and the one before it in review mode.
- Truncation note: the pronoun-lesson transcript was readable only up to the fish passage's main-idea question.
- Still missing from the reading course: lessons 2 to 8 (terms, information and inference, graphs, matching, main idea
  and title, author's opinion, two-text linking).

## Addendum: reading lessons 2 to 5 (third-party course, not official)

Lessons in the course order: 1 pronouns (recorded earlier), 2 terms, 3 information and inference, 4 graphs and
tables, 5 agreement with the text (first medium-tier lesson). Lessons 6 to 8 (main idea and title, author's opinion,
two-text linking) are still missing.

### Lesson 2: vocabulary questions
- Tests inferring meaning from context, not memorized word lists. Always verify the meaning in context even for a
  word you know, because many English words have several meanings (watch as "to view" or as a wrist watch).
- Four question shapes: the meaning of a word (or closest in meaning); a replaceable word (which word could replace
  "for example" without changing meaning); the meaning of a phrase or expression; why the writer used a word.
- Steps: identify the target and what is asked (synonym, opposite, replacement, purpose of use); read the whole
  sentence and its neighbours; if unclear read the previous and next sentence, since writers often explain or give
  an example; eliminate options that clash with the context; put the chosen option into the sentence and check that
  it still reads logically.
- Prefix help: negation prefixes (un-, in-, im-, ir-, il-, dis-): unscheduled, inactive, impossible, irresponsible,
  illegal, disagree; re- means again (rebuild, rewrite); over- means too much (overuse, overstate); mis- means wrong
  (misunderstand, misplace, misuse).
- Suffix help: -ful means full of (helpful, harmful); -less means without (hopeless, careless).
- Five context-clue families, with signal words:
  1. Similarity clues (similarly, like, just like, as): a calm lake "like the quiet sea" makes the unknown adjective
     close to calm; a diligent new employee "just like her hard-working colleague".
  2. Contrast clues (but, unlike, however, although): "the old system was complex but the new one was intuitive"
     shows opposites; "the test seemed difficult, however it was straightforward".
  3. Definition clues (is, means, which is, refers to): carnivore defined in the next sentence as an animal that eats
     meat; photosynthesis defined as the process of turning sunlight into food; peninsula defined as land surrounded
     by water on three sides.
  4. Result clues (because, so, therefore, as a result, consequently): "he was lethargic because he had not slept for
     two days"; "she was hungry, so she ate two large meals"; a medicine "alleviated the pain, as a result she felt
     better".
  5. Example clues (such as, for example, including, like): nocturnal explained by owls and bats being active at
     night; celestial bodies explained by sun, moon and stars; citrus fruits explained by oranges, lemons, grapefruit;
     predators explained by lions, wolves and eagles that hunt other animals.
- Rules: never pick the first meaning you know; look for a clue in the same sentence first and then the neighbours;
  substitute your choice and ask whether the sentence is logical.
- Mistakes: choosing a meaning without returning to context (light can be lamp light or not heavy); ignoring the
  surrounding sentences.
- Worked examples: "bioluminescent" solved as "able to produce light"; "sufficient" tried against important, extra,
  enough, different by substitution, where "important" and "extra" fail on amount versus importance and "enough"
  wins; "maintain" in "vitamin A helps maintain good vision" means keep; "shelter" from the nearby word protection;
  "broke out" for a fire means started, tied to "recovers slowly after a fire".

### Lesson 3: information and inference questions
- Information (direct): the fact is in the text word for word or paraphrased ("Ahmed is 20" then "how old is Ahmed").
- Information (needs a step): the fact is present only through a calculation or link, for example born 1304 and died
  1368 means the age at death is 64.
- Inference: the answer is not written but can be understood ("Ahmed was too sick to go to school yesterday" so he
  stayed home).
- Wording: how old was X when Y, according to paragraph 2 why do countries invest in renewables, what can be inferred
  about X.
- Steps: (1) pick the unique keywords in the question, rare words that do not repeat in the text; (2) search the text
  for the keyword and its synonyms, without reading the whole text and without random jumping (go paragraph 1, then
  2, then 3); (3) read the lines around the keyword, normally not back to the paragraph start.
- Scanning strategy: read the question first and decide exactly what to find; choose the most distinctive word;
  hunt for synonyms too (the text may say "pleased" for "happy"); read only the surrounding context.
- Question word to synonym families (examples given): happy, pleased; difficult, hard, complex, challenging,
  demanding; important, key, essential, crucial, vital; say, state, mention, explain, claim; start, begin, launch,
  found, establish, create; show, prove, indicate, reveal, demonstrate, suggest; use, apply, utilize, adopt,
  implement, employ.
- Matching-by-paraphrase examples: "when did the company start" found as "was founded in 1990"; "what does the data
  show" found as "the data reveal that sleep is important for retaining information"; "what method did they use"
  found as "employed".
- Rules: do not read the whole text, read the question first and scan; hunt for synonyms, not only the keyword; the
  answer must be supported by the text even when it is not written verbatim.
- Mistakes: choosing a true fact from outside the text; reading the whole text for every question; searching only for
  the exact keyword and ignoring synonyms.
- Question flavors seen in practice passages: a number or count (oral presentations, readings per course length such
  as 15 weekly readings), a duration (class length found in a Monday and Wednesday paragraph), "two things that cannot
  be done" (paralegals cannot appear in court or give legal advice), an abbreviation question (organisation names
  given as acronyms, found by locating the acronyms in a later paragraph), "which two ..." items, a "how many times
  larger" (fivefold organic strawberry production from a date range in the seventh paragraph), a plant-pathogen item
  solved by finding a rare term and its synonym ("cause plants to wilt and die" for "harm"), an effect-of-fire item
  with a negative consequence (another plant grows in its place), a vocabulary item (shelter means protection), a
  phrasal verb (broke out means started), a factual list (tobacco contains nicotine and alkaloids), the leaf type in
  cigars (binder leaf and wrapper leaf), most-tobacco-growing countries (China and the United States), arrival dates
  and reasons for immigration (economic opportunity), an immigrant-count range with a range of years, a trend that
  contradicted predictions (online retail growth did not replace stores; the dot-com crash), the share of shoppers who
  research online before buying (80 percent, with a nearby 62 percent distractor and an 11 percent growth distractor),
  and an example of brick-and-mortar (store names).
- Tip seen: several figures appear near the keyword; match the number to what the question asks, not to the first
  percentage you meet.

### Lesson 4: graphs, charts and tables
- Tests reading data: pulling numbers and values, understanding trends, comparing two or more values.
- Chart types met: single-series vertical bars (one colour); multi-series vertical bars (a colour per group, for
  example two companies over five months); horizontal bars (the same with sideways bars), single and multi-series;
  stacked horizontal bars (hardest: categories share bars and each colour is a category); pie chart; table; line
  chart.
- Reading steps: (1) read the title, which tells the data shown; (2) find the unit (percent, millions, gallons per
  person, barrels per day); (3) understand the axes (x often years or regions, y often values); (4) read the key
  or legend, which maps colours and symbols to categories or years; (5) read the question and decide exactly which
  part of the graph answers it.
- Vocabulary for rises: rise, increase, climb, grow, peak, reach a high, double, triple. For falls: fall, decrease,
  decline, collapse, drop, plunge. For comparison: highest, lowest, more than, less than. For approximation:
  approximately, about.
- Rules: start with the title, axes, unit and key; do not infer from outside the graph, choose the answer the graph
  supports.
- Mistakes: reading without checking the unit; confusing categories in multi-colour charts without reading the key.
- Worked patterns: a regional literacy chart with four coloured years, where "decline in the last five years" means
  compare the third and fourth bars (only one region fell); a table of year, sales and growth where the year with 14
  percent growth is found in the growth column; a birth-rate line (find the value between two year marks); social
  media usage by age band (choose the platform used more than 47 percent by ages 30 to 49); annual ticket sales by
  league (when one colour is above another, remembering axis starts); tourists to Japan by country (values in
  millions, with a 5 to 10 million band for 2017); coffee consumed in gallons per person by year (about 40 gallons
  in 1950, lowest near 1995); average monthly temperature by city (month with highest temperature, such as July);
  life expectancy by region (about 18 to 20 years of rise for one region between 1960 and 2010, about 45 years for
  another in 1970); commute shares by mode; mothers' ages at first birth in two years side by side (a 2016 age-20
  share, a most-common age near 19 in 1980); US crude oil imports in million barrels a day by country; retail
  digital ad spending in billions with a percent-change line; oil-palm area by owner in million hectares (convert
  500,000 hectares to 0.5 million before reading); water extraction versus consumption in agriculture, domestic
  and industry panels; a table of millionaires by country with change since 2015.
- Skill note: unit conversion (500,000 to 0.5 million) and reading approximate values between gridlines recur.
- Transcript note: only the first two thirds of the practice section were present.

### Lesson 5: agreement with the text (first medium-tier lesson)
- Three families: true statement (three options contradict or are unsupported, one is true), false or "not true"
  statement (three are true, one is not; sometimes the test says false, incorrect or not true instead), and "not
  mentioned" (three are present, one is absent).
- Wording: which of the following is true according to the passage, what does the passage say about X, what can be
  understood about viruses from paragraph 1, which is NOT true, which is NOT mentioned.
- Steps for all three: read the question and confirm which family it is; start at option A and locate it in the
  text or the stated paragraph; decide whether it is true, false or absent; eliminate and move on until the right
  option remains.
- Worked passages: social-media usage (the "most young adults use social media every day" option matches "about
  75 percent"; "only for entertainment" is false because other uses are listed; "experts say it always improves
  sleep" is false because experts warn of the opposite; "all adults use it every day" is false because only a share
  does); exercise (three true statements about heart, weight and moderate exercise, the false one says exercise has
  no health benefits); Amazon rainforest (three items are present, the fourth, 2,000 mm of rain a year, is not
  mentioned).
- Rules: look for meaning, not matching words (the text uses synonyms); separate a false idea (it contradicts the
  text) from a not-mentioned idea (the text never speaks about it).
- Mistakes: not focusing on what the question asks (true vs false vs not mentioned); reading the whole text for every
  option; looking for the exact sentence and missing paraphrases.
- Worked passages in practice: legal systems (common law and civil law; an item states that civil law is used by more
  countries; the civil-law paragraph contrasts it with common law relying on written codes); trademarks and brands
  (performance is a product attribute rather than a benefit; brand loyalty raises market share, so the option "brand
  loyalty helps increase market share" is correct; "all customers have brand loyalty" and "brand preference means
  brand quality" are not stated; "a strong brand must appeal emotionally" matches the final sentence of paragraph 1;
  the main idea of paragraph 2 is that customers have different levels of brand awareness); Yellowstone park (the
  oldest national park in the world; the lake is the highest mountain lake of its size in North America, and an
  option about a 54-mile gorge is false because the text says 19 miles; the mammal-count option with the wrong number
  of species is false).
- Tip: main idea and purpose questions inside the same passage are answered last, after the agreement items.
- Transcript note: the Yellowstone part was cut off before its damage question.

### Gaps this adds
- Reading skill candidates: rd-vocab-context-clues (five families), rd-affixes (negation, again, wrong, full,
  without), rd-scan-keywords (keyword and synonym drills), rd-info-direct, rd-info-calc (answer needs arithmetic),
  rd-inference, rd-graph-read (title, unit, axes, key, question), rd-graph-trend-vocab (rise, fall, compare words),
  rd-unit-convert, rd-true-statement, rd-false-statement, rd-not-mentioned (and the contradict versus absent
  distinction).
- Question tags: type, family (agreement true, false, not mentioned), chart type (single or multi bar, stacked,
  line, pie, table), and clue type for vocabulary items.
- The chart and table component planned earlier is confirmed as necessary for graph questions (six chart types plus
  table); needs a legend, units and axes, and approximate-value reading.
- Elimination drill UI: option-by-option "true / false / absent" marking in review mode to match how the course
  teaches the three agreement families.
- Remaining missing reading lessons: main idea and title, author's opinion, two-text linking.
