import type { ReadingPassage } from "@/types/question";
import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/**
 * Mock exam 2 - READING: 10 original passages (about 130-170 words) with 4
 * questions each (40 questions). Topics are general-interest and Saudi-context
 * subjects typical of STEP reading; all text and questions are original.
 * Every passage mixes a vocabulary-in-context item, a detail item, a pronoun or
 * inference item, and a main-idea / opinion item.
 */

const pid = (n: number) => `passage-sm2-${n}`;
const qid = (n: number) => `sm2-reading-${n}`;

export const STEP_MOCK_2_READING_PASSAGES: ReadingPassage[] = [
  {
    id: pid(1),
    title: "How Coral Reefs Form",
    body: "Coral reefs look like underwater gardens, but they are built by animals. Each coral polyp is a tiny, soft creature that produces a hard skeleton of limestone around its body. When polyps die, their skeletons remain, and new polyps grow on top of them. Over thousands of years, these layers pile up into enormous structures. The Great Barrier Reef in Australia, for example, stretches for more than two thousand kilometres and can be seen from space. Reefs grow best in warm, clear, shallow water, because the algae living inside the polyps need sunlight to make food. In return, the algae give the corals their bright colours. Although reefs cover less than one percent of the ocean floor, they shelter about a quarter of all marine species. Sadly, rising sea temperatures cause corals to push out their algae, turning the reef white. This process, called bleaching, can kill an entire reef if the water stays warm for too long. Scientists therefore argue that protecting reefs must begin with limiting the heat that humans add to the planet.",
    questionIds: [1, 2, 3, 4].map(qid),
  },
  {
    id: pid(2),
    title: "The Silk Road",
    body: "The Silk Road was not a single road but a network of trade routes linking China with the Mediterranean. It began to flourish around 130 BCE, when Chinese emperors sought strong horses from Central Asia. Merchants rarely travelled the entire distance. Instead, goods passed from trader to trader, and each one added a profit before selling them onward. Silk, spices, and paper moved west, while glass, gold, and wool moved east. However, goods were not the only things that travelled. Religions, languages, and ideas moved along the same routes, and so did diseases. Buddhism, for instance, spread from India into China, carried by monks who joined the caravans. Cities such as Samarkand grew rich because they stood at the crossroads where routes met. When sea travel became faster and cheaper in the fifteenth century, the overland routes slowly declined. Yet historians agree that the exchange of knowledge along the Silk Road did more to shape the world than any single cargo of silk.",
    questionIds: [5, 6, 7, 8].map(qid),
  },
  {
    id: pid(3),
    title: "The Story of the Bicycle",
    body: "The first bicycle appeared in Germany in 1817. Karl von Drais built a wooden machine with two wheels, but it had no pedals; riders pushed along the ground with their feet. Fifty years later, French inventors attached pedals to the front wheel, and the \"boneshaker\" got its name from the rough ride its iron wheels produced. The next design, the high-wheeler, had an enormous front wheel that made it faster but dangerous, because riders sat high above the ground and fell forward if they hit a stone. In the 1880s the \"safety bicycle\" solved the problem. It had two wheels of equal size and a chain that drove the back wheel, so the rider sat low and stable. Rubber tyres filled with air arrived soon afterwards and made the ride much smoother. Because bicycles were cheap, they gave ordinary people, especially women, a new freedom to travel without depending on horses or trains.",
    questionIds: [9, 10, 11, 12].map(qid),
  },
  {
    id: pid(4),
    title: "Why Young People Should Volunteer",
    body: "Many teenagers believe that volunteering is something to do only when school work is finished. I disagree. Giving a few hours each week to a local charity or neighbourhood project is among the best investments a young person can make. First, volunteers learn practical skills such as teamwork, planning, and communication, which no textbook can fully teach. Second, helping others builds confidence, because the results are visible immediately. Third, many universities and employers notice applicants who have served their communities, so volunteering can open doors later. Critics say that students are already too busy, and they have a point: nobody should sacrifice sleep or study. Nevertheless, even one afternoon a week is enough to make a difference. Schools should therefore make time for community service instead of treating it as an optional extra.",
    questionIds: [13, 14, 15, 16].map(qid),
  },
  {
    id: pid(5),
    title: "The Date Palm in Arabian Life",
    body: "The date palm has been part of life in Arabia for thousands of years. Its fruit is rich in sugar and fibre, which gave travellers energy during long journeys across the desert. Nothing from the tree is wasted: the leaves are woven into baskets and mats, the trunk is used as timber for roofs, and even the date stones are ground and fed to animals. A mature tree can produce more than a hundred kilograms of fruit each year, although it takes several years after planting to bear its first crop. Date palms also help the environment. Their shade protects smaller crops from the harsh sun, and their roots hold the soil together in oases. Today Saudi Arabia is one of the world's largest producers of dates, with hundreds of varieties grown across the kingdom. Each variety differs in colour, size and sweetness, and many families still have a favourite that they serve to guests.",
    questionIds: [17, 18, 19, 20].map(qid),
  },
  {
    id: pid(6),
    title: "How Vaccines Work",
    body: "A vaccine teaches the body to defend itself without making a person ill. It contains a harmless piece or a weakened form of a germ, which is enough for the immune system to recognise as an intruder. The body responds by producing antibodies, special proteins that attach to the germ and help destroy it. Crucially, the immune system also creates memory cells that remain in the blood for years. If the real germ ever enters the body, these cells recognise it quickly and trigger a fast response, often before any symptoms appear. Some vaccines need booster doses because the memory fades over time. When most people in a community are vaccinated, the disease has difficulty spreading, and this protects even those who cannot be vaccinated, such as newborn babies. Doctors call this \"community immunity\". Smallpox, which once killed millions, was completely wiped out in 1980 through worldwide vaccination.",
    questionIds: [21, 22, 23, 24].map(qid),
  },
  {
    id: pid(7),
    title: "Why the World Has Time Zones",
    body: "Before the late nineteenth century, every town set its clocks by the sun, so noon in one city could differ from noon in a city only fifty kilometres away. This caused little trouble until railways appeared. Timetables became confusing, and travellers sometimes missed trains simply because two stations kept different times. In 1884, delegates from twenty-five countries met in Washington and agreed to divide the world into twenty-four time zones, each roughly fifteen degrees wide, with Greenwich in London as the starting point. Most countries gradually adopted the system, although some chose unusual arrangements. China, which is geographically as wide as five zones, uses a single time across the whole country. Saudi Arabia keeps the same time everywhere, three hours ahead of Greenwich. Although the system is not perfect, it allows airlines, banks and families in different countries to plan their days with confidence.",
    questionIds: [25, 26, 27, 28].map(qid),
  },
  {
    id: pid(8),
    title: "Camels: Survivors of the Desert",
    body: "Camels have lived in the deserts of Arabia for thousands of years, and their bodies are well designed for the harsh conditions. Contrary to popular belief, a camel's hump does not store water; it stores fat, which the animal can use as energy when food is scarce. A camel can drink up to a hundred litres of water in only a few minutes, and it can then travel for days without drinking. Its thick eyelashes and closable nostrils keep out blowing sand, and wide feet stop it from sinking into soft ground. Camels also lose very little water through sweat, because their body temperature is allowed to rise during the day before cooling at night. For centuries Bedouin families depended on camels for transport, milk and wool. Although cars have replaced them for most journeys, camels remain a proud symbol of the region, and they are still raced and bred across the kingdom.",
    questionIds: [29, 30, 31, 32].map(qid),
  },
  {
    id: pid(9),
    title: "The Printing Press",
    body: "Before the fifteenth century, books were copied by hand, a slow process that could take a monk many months to finish a single volume. As a result, books were extremely expensive, and only the church and the very rich owned them. Around 1440, a German goldsmith named Johannes Gutenberg developed a printing press that used movable metal letters. The letters could be arranged into a page, inked, pressed onto paper, and then rearranged for the next page. Within fifty years, printing presses operated in more than two hundred European cities, and millions of books had been produced. Prices fell sharply, so ordinary families could afford them. Literacy rates rose, new ideas travelled faster, and scientists could share discoveries and correct each other's mistakes. Some rulers feared the new technology because they could no longer control what people read. Historians often rank the printing press among the most influential inventions in history.",
    questionIds: [33, 34, 35, 36].map(qid),
  },
  {
    id: pid(10),
    title: "The Rise of Solar Power",
    body: "Solar panels convert sunlight directly into electricity using thin layers of silicon. When light strikes the silicon, it knocks electrons loose, and these electrons flow through wires as an electric current. Because the process has no moving parts and burns no fuel, a panel can work quietly for twenty-five years or more. Twenty years ago, solar power was too expensive for most people, but improved manufacturing has reduced the price of panels by roughly ninety percent. The Arabian Peninsula, with its clear skies and long days, receives some of the strongest sunlight on Earth, which makes it an ideal place for large solar farms. Saudi Arabia has announced projects capable of powering millions of homes. Nevertheless, solar power has limits. Panels produce nothing at night, so engineers are developing better batteries to store the extra energy created during the day. Until storage becomes cheaper, solar power will probably work alongside other energy sources rather than replace them.",
    questionIds: [37, 38, 39, 40].map(qid),
  },
];

const P = (n: number) => pid(n);
const RC = "reading-comprehension";

const specs: QuestionSpec[] = [
  // ---- Passage 1: coral reefs ----
  { id: qid(1), passageId: P(1), prompt: "In the passage, the word 'enormous' is closest in meaning to", correct: "huge", wrong: ["fragile", "colourful", "ancient"], why: "Layers piling up over thousands of years form very large structures, so 'enormous' means huge.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(2), passageId: P(1), prompt: "Why do reefs grow best in warm, clear, shallow water?", correct: "The algae inside the polyps need sunlight to make food.", wrong: ["Fish need warm water to lay their eggs on the reef.", "Limestone dissolves in cold water and weakens the coral.", "Polyps cannot survive anywhere below the surface of the sea."], why: "The passage says reefs grow best there 'because the algae living inside the polyps need sunlight to make food'.", level: "easy", tags: [RC, "detail"] },
  { id: qid(3), passageId: P(1), prompt: "In the passage, 'This process' refers to", correct: "corals pushing out their algae", wrong: ["the building of limestone skeletons", "the growth of new polyps", "the warming of the sea"], why: "The sentence before explains that corals push out their algae and turn white; that process is called bleaching.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(4), passageId: P(1), prompt: "Which statement best expresses the main idea of the passage?", correct: "Coral reefs are built by tiny animals and are threatened by warmer seas.", wrong: ["The Great Barrier Reef is the largest structure ever built on Earth.", "Algae are more important to the sea than the corals themselves.", "Reefs now cover most of the ocean floor in warm tropical regions."], why: "The passage explains how reefs are built and then how rising temperatures threaten them; the other options are details or false.", level: "medium", tags: [RC, "main-idea"] },

  // ---- Passage 2: Silk Road ----
  { id: qid(5), passageId: P(2), prompt: "In the passage, the word 'flourish' is closest in meaning to", correct: "thrive", wrong: ["decline", "begin slowly", "disappear"], why: "The routes grew busy and prosperous after 130 BCE, so 'flourish' means thrive.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(6), passageId: P(2), prompt: "According to the passage, why did goods pass from trader to trader?", correct: "Merchants rarely travelled the whole route.", wrong: ["Rulers forbade foreign trade.", "Silk was too heavy to carry far.", "Roads were closed in winter."], why: "The passage states that merchants rarely travelled the entire distance, so goods changed hands.", level: "easy", tags: [RC, "detail"] },
  { id: qid(7), passageId: P(2), prompt: "In the passage, 'each one' in 'each one added a profit' refers to", correct: "each trader", wrong: ["each emperor", "each road", "each city"], why: "Goods passed 'from trader to trader', and each trader added a profit.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(8), passageId: P(2), prompt: "Which statement would the historians mentioned in the passage most likely agree with?", correct: "The exchange of ideas mattered more than the goods.", wrong: ["Silk was the only valuable cargo.", "Sea routes were less useful than roads.", "Samarkand was the largest city in the world."], why: "The last sentence says historians agree that the exchange of knowledge did more to shape the world than any cargo of silk.", level: "hard", tags: [RC, "inference"] },

  // ---- Passage 3: bicycle ----
  { id: qid(9), passageId: P(3), prompt: "In the passage, the word 'stable' is closest in meaning to", correct: "steady", wrong: ["quick", "expensive", "noisy"], why: "A rider sitting low on equal-sized wheels is steady and unlikely to fall, which is what 'stable' means.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(10), passageId: P(3), prompt: "Why was the high-wheeler dangerous?", correct: "Riders sat high up and could fall forward over a stone.", wrong: ["Its chain often broke, which made riders lose control.", "It had no way of stopping once it started moving.", "Its wheels were made of wood and broke on rough roads."], why: "The passage says riders sat high above the ground and fell forward if they hit a stone.", level: "medium", tags: [RC, "detail"] },
  { id: qid(11), passageId: P(3), prompt: "In the passage, 'It' in 'It had two wheels of equal size' refers to", correct: "the safety bicycle", wrong: ["the chain", "the high-wheeler", "the boneshaker"], why: "The previous sentence introduces the 'safety bicycle' of the 1880s; the next sentence describes it.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(12), passageId: P(3), prompt: "What is the best title for the passage?", correct: "How the Bicycle Changed over Time", wrong: ["The Dangers of Cycling", "A German Inventor's Life", "Why Women Prefer Bicycles"], why: "The passage follows the bicycle's designs from 1817 to the safety bicycle, so the title should cover its development.", level: "easy", tags: [RC, "main-idea"] },

  // ---- Passage 4: volunteering ----
  { id: qid(13), passageId: P(4), prompt: "In the passage, the word 'visible' is closest in meaning to", correct: "easy to see", wrong: ["hard to explain", "slow to arrive", "costly to repair"], why: "Helping others gives results people can see at once, so 'visible' means easy to see.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(14), passageId: P(4), prompt: "All of the following are given as benefits of volunteering EXCEPT", correct: "earning a salary", wrong: ["learning teamwork", "gaining confidence", "impressing universities and employers"], why: "Skills, confidence and a better application are mentioned; nothing is said about being paid.", level: "medium", tags: [RC, "detail"] },
  { id: qid(15), passageId: P(4), prompt: "In the passage, 'they' in 'they have a point' refers to", correct: "critics", wrong: ["schools", "volunteers", "universities"], why: "'Critics say that students are already too busy, and they have a point.'", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(16), passageId: P(4), prompt: "What is the author's attitude toward volunteering by young people?", correct: "Supportive", wrong: ["Doubtful", "Indifferent", "Hostile"], why: "The author calls it one of the best investments and wants schools to make time for it.", level: "easy", tags: [RC, "author-opinion"] },

  // ---- Passage 5: date palm ----
  { id: qid(17), passageId: P(5), prompt: "In the passage, the word 'mature' is closest in meaning to", correct: "fully grown", wrong: ["very old", "newly planted", "badly damaged"], why: "A mature tree is one that has grown enough to produce a full crop.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(18), passageId: P(5), prompt: "According to the passage, how do date palms help the environment?", correct: "Their shade protects smaller crops from the sun.", wrong: ["They reduce the amount of rain that falls on the oasis.", "They remove salt from the sea water near the coast.", "They attract tourists to the desert every year."], why: "The passage says their shade protects smaller crops from the harsh sun (and their roots hold the soil).", level: "medium", tags: [RC, "detail"] },
  { id: qid(19), passageId: P(5), prompt: "In the passage, 'they' in the last sentence refers to", correct: "families", wrong: ["varieties", "guests", "oases"], why: "'Many families still have a favourite that they serve to guests' - the families do the serving.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(20), passageId: P(5), prompt: "The passage is mainly about", correct: "the many uses and importance of the date palm", wrong: ["how to grow dates successfully in a home garden", "the history of Bedouin travel across the desert", "the export of dates to countries abroad"], why: "Each paragraph describes a use or benefit of the date palm.", level: "easy", tags: [RC, "main-idea"] },

  // ---- Passage 6: vaccines ----
  { id: qid(21), passageId: P(6), prompt: "In the passage, the word 'intruder' is closest in meaning to", correct: "something that enters where it does not belong", wrong: ["a helpful visitor who is welcome in the body", "a type of medicine that fights germs", "a protective cell that guards the body"], why: "The immune system recognises the germ as foreign, something that enters the body where it does not belong.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(22), passageId: P(6), prompt: "Why do some vaccines need booster doses?", correct: "The body's memory of the germ fades over time.", wrong: ["The germs change every year.", "Babies cannot receive the first dose.", "Antibodies turn into memory cells."], why: "The passage says some vaccines need boosters 'because the memory fades over time'.", level: "medium", tags: [RC, "detail"] },
  { id: qid(23), passageId: P(6), prompt: "In the passage, 'this' in 'and this protects even those who cannot be vaccinated' refers to", correct: "most people in a community being vaccinated", wrong: ["memory cells staying in the blood", "the vaccine containing a weakened germ", "the immune system making antibodies"], why: "The sentence says that when most people are vaccinated the disease struggles to spread, and this protects the others.", level: "hard", tags: [RC, "pronoun-reference"] },
  { id: qid(24), passageId: P(6), prompt: "What can be inferred about smallpox from the passage?", correct: "Vaccination can remove a disease from the world.", wrong: ["It still kills millions today.", "It was the first disease ever studied.", "It never required booster doses."], why: "Smallpox was 'completely wiped out in 1980 through worldwide vaccination', so vaccination can eliminate a disease.", level: "medium", tags: [RC, "inference"] },

  // ---- Passage 7: time zones ----
  { id: qid(25), passageId: P(7), prompt: "In the passage, the word 'adopted' is closest in meaning to", correct: "started to use", wrong: ["refused to accept", "forgot about completely", "argued about openly"], why: "Most countries gradually began using the time-zone system.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(26), passageId: P(7), prompt: "Why did railways make local sun time a problem?", correct: "Stations kept different times, which confused timetables.", wrong: ["Trains were too fast for passengers to measure the time.", "Clocks stopped working when they were near the tracks.", "Travellers did not trust the new trains and avoided them."], why: "Timetables became confusing because two stations kept different times.", level: "easy", tags: [RC, "detail"] },
  { id: qid(27), passageId: P(7), prompt: "In the passage, 'This' in 'This caused little trouble until railways appeared' refers to", correct: "each town using its own local time", wrong: ["the meeting held in Washington", "the invention of the clock", "the distance between cities"], why: "The previous sentence says every town set its clocks by the sun, so times differed from place to place.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(28), passageId: P(7), prompt: "What is the author's main purpose in the passage?", correct: "To explain how and why standard time zones were created", wrong: ["To compare the clocks of China with those of Saudi Arabia", "To criticise the railway companies for causing confusion", "To describe the long history of the town of Greenwich"], why: "The passage moves from local sun time to the 1884 agreement and the system we use today.", level: "medium", tags: [RC, "main-idea"] },

  // ---- Passage 8: camels ----
  { id: qid(29), passageId: P(8), prompt: "In the passage, the word 'scarce' is closest in meaning to", correct: "hard to find", wrong: ["dangerous to eat", "plentiful and cheap", "tasty and sweet"], why: "Camels use stored fat when food is scarce, meaning when it is not easy to find.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(30), passageId: P(8), prompt: "According to the passage, what does a camel's hump store?", correct: "Fat", wrong: ["Water", "Milk", "Sand"], why: "The passage corrects the popular belief: the hump stores fat, not water.", level: "easy", tags: [RC, "detail"] },
  { id: qid(31), passageId: P(8), prompt: "In the passage, 'it' in 'it can then travel for days' refers to", correct: "the camel", wrong: ["the water", "the hump", "the desert"], why: "'A camel can drink... and it can then travel for days without drinking.'", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(32), passageId: P(8), prompt: "Which statement best reflects the author's view of camels?", correct: "They are admirable animals that are still valued in the region.", wrong: ["They are no longer useful to anyone in the modern region.", "They are dangerous to travellers who cross the desert.", "They are difficult to breed and expensive to keep."], why: "The author praises their design and calls them a proud symbol that is still raced and bred.", level: "medium", tags: [RC, "author-opinion"] },

  // ---- Passage 9: printing press ----
  { id: qid(33), passageId: P(9), prompt: "In the passage, the word 'influential' is closest in meaning to", correct: "having a strong effect on others", wrong: ["hard to understand for most people", "very old and no longer used", "easy to carry from place to place"], why: "Ranking the press among history's most influential inventions means it had a great effect on the world.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(34), passageId: P(9), prompt: "Why were books so expensive before the printing press?", correct: "They were copied by hand, which took months.", wrong: ["Paper was extremely rare and had to be imported.", "Kings taxed them heavily whenever they were sold.", "Few people could write well enough to copy them."], why: "Copying a single volume by hand could take a monk many months.", level: "easy", tags: [RC, "detail"] },
  { id: qid(35), passageId: P(9), prompt: "In the passage, 'they' in 'because they could no longer control what people read' refers to", correct: "rulers", wrong: ["scientists", "families", "monks"], why: "'Some rulers feared the new technology because they could no longer control...'", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(36), passageId: P(9), prompt: "What can be inferred about the effect of cheaper books?", correct: "More people were able to learn and share ideas.", wrong: ["Fewer people learned to read as books became common.", "Churches became much richer than they were before.", "Handwriting disappeared at once from every country."], why: "Prices fell, literacy rose, and ideas and discoveries travelled faster.", level: "medium", tags: [RC, "inference"] },

  // ---- Passage 10: solar power ----
  { id: qid(37), passageId: P(10), prompt: "In the passage, the word 'ideal' is closest in meaning to", correct: "most suitable", wrong: ["rather unusual", "very distant", "quite dangerous"], why: "Strong sunlight makes the peninsula the most suitable place for solar farms.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(38), passageId: P(10), prompt: "According to the passage, why are better batteries being developed?", correct: "Panels produce no electricity at night.", wrong: ["Panels are too expensive for most families to buy.", "Panels are too noisy for use near houses.", "Panels need extra fuel in order to work properly."], why: "Panels produce nothing at night, so extra daytime energy must be stored.", level: "easy", tags: [RC, "detail"] },
  { id: qid(39), passageId: P(10), prompt: "In the passage, 'them' in 'rather than replace them' refers to", correct: "other energy sources", wrong: ["the solar panels themselves", "the batteries in cars", "the engineers who work on them"], why: "Solar power will work alongside other sources rather than replace those sources.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(40), passageId: P(10), prompt: "What is the author's view of the future of solar power?", correct: "It will grow but probably work alongside other sources.", wrong: ["It will end the need for every other kind of energy.", "It will remain limited to Saudi Arabia for many years.", "It is too expensive to continue developing."], why: "The author is positive about solar power but says it will probably not replace other sources until storage improves.", level: "hard", tags: [RC, "author-opinion"] },
];

export const STEP_MOCK_2_READING_QUESTIONS = buildQuestions("reading", "step-mock-2", specs);
