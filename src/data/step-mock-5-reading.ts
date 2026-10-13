import type { ReadingPassage } from "@/types/question";
import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/**
 * Mock exam 5 - READING: 10 original passages (about 120-170 words), 4
 * questions each. Topics: the Empty Quarter, the history of clocks, elephants,
 * reading for pleasure, Mount Everest, Al-Balad in Jeddah, bridges, fast
 * fashion, Ibn Battuta and artificial intelligence.
 */

const pid = (n: number) => `passage-sm5-${n}`;
const qid = (n: number) => `sm5-reading-${n}`;
const ids = (from: number) => [0, 1, 2, 3].map((i) => qid(from + i));

export const STEP_MOCK_5_READING_PASSAGES: ReadingPassage[] = [
  {
    id: pid(1),
    title: "The Empty Quarter",
    body: "The Empty Quarter, or Rub' al Khali, is the largest continuous sand desert in the world. It covers about 650,000 square kilometres across Saudi Arabia, Oman, the United Arab Emirates and Yemen, an area larger than France. Giant dunes, some more than 250 metres high, roll across the landscape like frozen waves. Rain may not fall for years, and summer temperatures often pass 50 degrees Celsius, yet life survives. Small animals such as sand cats and desert lizards hide in burrows by day and hunt at night, while tough plants send their roots deep to find hidden water. For centuries, only Bedouin guides who knew the stars and the wind could cross the desert safely. Today, scientists use satellites to study it, and the oil industry has built roads and camps in parts of the sand. Despite this, most of the Empty Quarter remains almost untouched.",
    questionIds: ids(1),
  },
  {
    id: pid(2),
    title: "A Short History of Clocks",
    body: "Long before mechanical clocks, people measured time with the sun. The ancient Egyptians used tall stone pillars whose shadows moved during the day, and later sundials divided the day into hours. Sundials were useless at night or on cloudy days, so inventors looked for other methods. Water clocks measured time by the steady flow of water from one container to another, while candles marked hours as they burned down. In the fourteenth century, European craftsmen built the first mechanical clocks driven by falling weights; they were enormous and were placed in church towers. The big breakthrough came in 1656, when the Dutch scientist Christiaan Huygens used a swinging pendulum to regulate the movement, making clocks far more accurate. Smaller springs later allowed people to carry watches in their pockets. Today, atomic clocks lose less than a second in millions of years.",
    questionIds: ids(5),
  },
  {
    id: pid(3),
    title: "The Intelligence of Elephants",
    body: "Elephants are the largest land animals on Earth, and they are also among the most intelligent. An African elephant's brain weighs about five kilograms, several times heavier than a human brain, and it controls an enormous range of skills. Elephants live in family groups led by the oldest female, called the matriarch. She remembers where water and food can be found during droughts, and she leads the herd there, sometimes over hundreds of kilometres. Researchers have also observed elephants gathering around an animal that has died, touching the body gently with their trunks, which suggests that they feel grief. In recent decades, hunting for ivory has greatly reduced their numbers. Many countries now protect them, and tourists who watch elephants in national parks help to pay for this protection. Scientists hope that, with continued care, these remarkable animals will survive for future generations.",
    questionIds: ids(9),
  },
  {
    id: pid(4),
    title: "The Power of Reading for Pleasure",
    body: "Reading for pleasure is one of the best habits a student can develop. First, it widens vocabulary: people who read regularly meet thousands of new words in context, and they learn their meaning without memorising lists. Second, it improves writing, because readers absorb how good authors build sentences and paragraphs. Third, reading is relaxing; just six minutes with a book can lower stress levels, according to one study. Fourth, it trains concentration, a skill that is becoming rarer in a world of constant notifications. Teachers often recommend starting with books on subjects you already enjoy, such as football, space or cooking, and choosing a level that is slightly easy. If a book is too difficult, you will lose interest and stop. Even twenty minutes before bed is enough. Over a year, this small habit adds up to many books and a noticeably stronger command of the language.",
    questionIds: ids(13),
  },
  {
    id: pid(5),
    title: "Mount Everest",
    body: "Mount Everest, on the border between Nepal and Tibet, is the highest mountain above sea level at 8,849 metres. It is named after Sir George Everest, a British surveyor, although local people have long used the names Sagarmatha in Nepali and Chomolungma in Tibetan. In 1953, Edmund Hillary of New Zealand and the Sherpa guide Tenzing Norgay became the first climbers confirmed to reach the summit. Since then, thousands have followed. Climbers face freezing temperatures, powerful winds and thin air, which contains only about a third of the oxygen found at sea level, so most carry bottled oxygen. Sherpa guides, who live in the region and are used to altitude, carry equipment and fix ropes, but their work is dangerous and often unrecognised. In recent years, the large number of climbers has also left rubbish on the slopes, and clean-up expeditions now collect tonnes of waste.",
    questionIds: ids(17),
  },
  {
    id: pid(6),
    title: "Al-Balad: The Historic Heart of Jeddah",
    body: "Al-Balad, the historic centre of Jeddah, has been a trading port on the Red Sea for more than a thousand years. Pilgrims arriving by ship passed through its gates on their way to Makkah, and merchants from India, Egypt and Africa filled its markets with spices, cloth and coffee. The district is famous for its tall houses built from coral stone, a light material cut from the sea. These buildings have wooden balconies called rawasheen, whose carved screens let sea breezes inside while keeping the rooms private and shaded. In 2014, UNESCO listed Al-Balad as a World Heritage Site. Since then, a restoration programme has repaired many damaged houses, and old shops now sell traditional crafts to visitors. Local people hope that this attention will protect the area from neglect and fires, which have destroyed some historic buildings in the past.",
    questionIds: ids(21),
  },
  {
    id: pid(7),
    title: "How Bridges Carry Weight",
    body: "A bridge must support its own weight and the weight of everything that crosses it. Engineers choose a design according to the distance it must cover. The simplest type, the beam bridge, is a flat structure resting on supports at each end; it is cheap but suitable only for short distances. An arch bridge curves upward and pushes the load outward and downward into the ground at both ends, which allows it to span longer distances using stone or concrete. For very long crossings, engineers build suspension bridges, in which a roadway hangs from strong steel cables strung between tall towers. The Golden Gate Bridge in San Francisco is a famous example. Cable-stayed bridges are similar, but the cables run directly from the towers to the road. Whatever the type, designers must also consider wind, earthquakes and the effect of heavy traffic over many decades.",
    questionIds: ids(25),
  },
  {
    id: pid(8),
    title: "The Hidden Cost of Fast Fashion",
    body: "In the past, people bought clothes a few times a year and expected them to last. Today, \"fast fashion\" companies produce cheap clothes in huge quantities and put new styles in shops every few weeks. Customers enjoy the low prices and the variety, but the system has serious costs. Making a single cotton shirt can use thousands of litres of water, and many synthetic fabrics release tiny plastic fibres when washed, which end up in rivers and oceans. Because the clothes are not made to last, millions of tonnes are thrown away each year. I think shoppers have more power than they realise. If we buy fewer items, choose better quality, repair what we own and pass unwanted clothes to others, the demand for endless new products will fall. Fashion should be about enjoying what we wear, not about replacing it constantly.",
    questionIds: ids(29),
  },
  {
    id: pid(9),
    title: "Ibn Battuta: The Great Traveller",
    body: "Ibn Battuta was born in Tangier, Morocco, in 1304 into a family of legal scholars. At the age of twenty-one he left home to perform Hajj in Makkah, intending to return within a few years. Instead, he spent almost thirty years travelling, covering around 120,000 kilometres across North Africa, the Middle East, India, China and parts of Africa south of the Sahara. He travelled by camel, ship and on foot, joined caravans for protection, and survived shipwrecks and robbers. Wherever he went, he met rulers and scholars, and he often worked as a judge, because of his religious education. When he finally returned home, the ruler of Morocco asked him to dictate an account of his journeys. This book, the Rihla, is still read today and is valuable to historians because it describes cities and customs that were rarely recorded by other writers.",
    questionIds: ids(33),
  },
  {
    id: pid(10),
    title: "Artificial Intelligence in Daily Life",
    body: "Artificial intelligence, or AI, is no longer something found only in science fiction. Every time a phone suggests the next word in a message, or a map application chooses the fastest route, AI is at work. These systems learn by studying enormous amounts of data and finding patterns that humans might miss. In medicine, AI programs can examine thousands of X-ray images and help doctors spot early signs of disease. In schools, some applications adapt exercises to a student's level, giving extra practice where it is needed. However, AI also raises concerns. Systems can make mistakes, and they may be unfair if the data they learn from is incomplete. There are also worries about privacy, because AI often relies on personal information. Experts therefore argue that people should treat AI as a helpful assistant, check important results themselves, and support clear rules about how the technology may be used.",
    questionIds: ids(37),
  },
];

const P = pid;
const RC = "reading-comprehension";

const specs: QuestionSpec[] = [
  // 1 Empty Quarter
  { id: qid(1), passageId: P(1), prompt: "In the passage, the word 'continuous' is closest in meaning to", correct: "without a break", wrong: ["very old", "extremely hot", "partly hidden"], why: "The largest continuous sand desert is one unbroken area of sand.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(2), passageId: P(1), prompt: "How do small desert animals survive?", correct: "They hide in burrows by day and hunt at night.", wrong: ["They travel to the coast every summer.", "They sleep through the whole year.", "They drink from the dunes."], why: "The passage says sand cats and lizards hide in burrows by day and hunt at night.", level: "easy", tags: [RC, "detail"] },
  { id: qid(3), passageId: P(1), prompt: "In the passage, 'it' in 'scientists use satellites to study it' refers to", correct: "the desert", wrong: ["the satellite", "the sand cat", "the oil industry"], why: "Scientists study the desert with satellites.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(4), passageId: P(1), prompt: "Why were Bedouin guides needed to cross the desert?", correct: "Crossing it was dangerous without knowledge of the stars and the wind.", wrong: ["The desert was full of roads.", "Travellers were not allowed to enter alone.", "Water was easy to find."], why: "Only guides who knew the stars and the wind could cross it safely.", level: "medium", tags: [RC, "inference"] },

  // 2 Clocks
  { id: qid(5), passageId: P(2), prompt: "In the passage, the word 'regulate' is closest in meaning to", correct: "control", wrong: ["break", "paint", "hide"], why: "The pendulum controlled the speed of the clock's movement, making it more accurate.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(6), passageId: P(2), prompt: "Why were sundials limited?", correct: "They did not work at night or on cloudy days.", wrong: ["They were too heavy to move.", "They could not show hours.", "They were only used in Europe."], why: "The passage says sundials were useless at night or on cloudy days.", level: "easy", tags: [RC, "detail"] },
  { id: qid(7), passageId: P(2), prompt: "In the passage, 'they' in 'they were enormous' refers to", correct: "the first mechanical clocks", wrong: ["church towers", "European craftsmen", "falling weights"], why: "'...built the first mechanical clocks driven by falling weights; they were enormous...'", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(8), passageId: P(2), prompt: "What is the best title for the passage?", correct: "The Development of Timekeeping", wrong: ["The Life of Christiaan Huygens", "How to Make a Sundial", "Why Clocks Are Expensive"], why: "The passage follows the ways of measuring time from shadows to atomic clocks.", level: "easy", tags: [RC, "main-idea"] },

  // 3 Elephants
  { id: qid(9), passageId: P(3), prompt: "In the passage, the word 'remarkable' is closest in meaning to", correct: "unusual and impressive", wrong: ["common and dull", "small and weak", "new and untested"], why: "The writer admires elephants as unusual and impressive animals.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(10), passageId: P(3), prompt: "Why does the matriarch lead the herd to water?", correct: "She remembers where water can be found in droughts.", wrong: ["She is the youngest elephant.", "She is chased by hunters.", "She follows tourists."], why: "The matriarch remembers where water and food can be found during droughts.", level: "medium", tags: [RC, "detail"] },
  { id: qid(11), passageId: P(3), prompt: "In the passage, 'she' in 'She remembers where water and food can be found' refers to", correct: "the matriarch", wrong: ["a researcher", "the youngest calf", "a tourist"], why: "The sentence continues the description of the matriarch.", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(12), passageId: P(3), prompt: "What does the behaviour of elephants around a dead animal suggest?", correct: "Elephants may feel grief.", wrong: ["Elephants are hungry.", "Elephants dislike their trunks.", "Elephants cannot see well."], why: "The passage says this behaviour suggests that they feel grief.", level: "hard", tags: [RC, "inference"] },

  // 4 Reading
  { id: qid(13), passageId: P(4), prompt: "In the passage, the word 'absorb' is closest in meaning to", correct: "take in and learn", wrong: ["push away", "count carefully", "forget quickly"], why: "Readers take in how good authors build sentences and paragraphs.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(14), passageId: P(4), prompt: "Why do teachers recommend starting with subjects you enjoy?", correct: "You are less likely to lose interest.", wrong: ["The books are shorter.", "The books are cheaper.", "They are always easier."], why: "If a book is too difficult or dull, you lose interest and stop.", level: "medium", tags: [RC, "detail"] },
  { id: qid(15), passageId: P(4), prompt: "In the passage, 'this small habit' refers to", correct: "reading for about twenty minutes before bed", wrong: ["watching football", "checking notifications", "choosing difficult books"], why: "The previous sentence says even twenty minutes before bed is enough.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(16), passageId: P(4), prompt: "Which advice would the writer most likely give?", correct: "Read a little every day, choosing suitable books.", wrong: ["Read only difficult books.", "Read only before an exam.", "Memorise word lists instead."], why: "The writer recommends short daily reading with books at a comfortable level.", level: "medium", tags: [RC, "author-opinion"] },

  // 5 Everest
  { id: qid(17), passageId: P(5), prompt: "In the passage, the word 'summit' is closest in meaning to", correct: "the highest point", wrong: ["the lowest valley", "the starting camp", "the nearest village"], why: "Climbers reach the summit at the top of the mountain.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(18), passageId: P(5), prompt: "Why do most climbers carry bottled oxygen?", correct: "The air at that height has only about a third of the oxygen at sea level.", wrong: ["The mountain has no air at all.", "Oxygen helps them keep warm.", "Sherpa guides require it."], why: "The thin air contains only about a third of the oxygen found at sea level.", level: "medium", tags: [RC, "detail"] },
  { id: qid(19), passageId: P(5), prompt: "In the passage, 'It' in 'It is named after Sir George Everest' refers to", correct: "Mount Everest", wrong: ["Nepal", "Tibet", "the summit"], why: "The mountain is named after the British surveyor.", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(20), passageId: P(5), prompt: "What does the writer suggest about Sherpa guides?", correct: "Their dangerous work deserves more recognition.", wrong: ["They are not used to altitude.", "They climb only for money.", "They cause the waste on the slopes."], why: "Their work is described as dangerous and often unrecognised.", level: "hard", tags: [RC, "author-opinion"] },

  // 6 Al-Balad
  { id: qid(21), passageId: P(6), prompt: "In the passage, the word 'neglect' is closest in meaning to", correct: "lack of care", wrong: ["great wealth", "fast growth", "careful planning"], why: "Attention protects the area from being left without care.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(22), passageId: P(6), prompt: "What is the purpose of the carved screens on the rawasheen?", correct: "To let breezes in while keeping rooms private and shaded", wrong: ["To keep the rain out", "To show the owner's wealth", "To hold the roof up"], why: "The screens let sea breezes inside while keeping the rooms private and shaded.", level: "medium", tags: [RC, "detail"] },
  { id: qid(23), passageId: P(6), prompt: "In the passage, 'this attention' in the last sentence refers to", correct: "the UNESCO listing and restoration work", wrong: ["the fires in the district", "the merchants from India", "the sea breezes"], why: "The listing in 2014 and the restoration programme are the attention the area has received.", level: "hard", tags: [RC, "pronoun-reference"] },
  { id: qid(24), passageId: P(6), prompt: "The passage is mainly about", correct: "the history, architecture and protection of Al-Balad", wrong: ["how coral is cut from the sea", "the trade routes of the Red Sea", "the life of Jeddah's merchants"], why: "It covers Al-Balad's past, its buildings and the work to preserve it.", level: "easy", tags: [RC, "main-idea"] },

  // 7 Bridges
  { id: qid(25), passageId: P(7), prompt: "In the passage, the word 'span' is closest in meaning to", correct: "stretch across", wrong: ["fall down", "cut into pieces", "paint over"], why: "An arch bridge can stretch across longer distances.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(26), passageId: P(7), prompt: "Which type of bridge is used for very long crossings?", correct: "A suspension bridge", wrong: ["A beam bridge", "An arch bridge", "A stone bridge"], why: "For very long crossings engineers build suspension bridges.", level: "easy", tags: [RC, "detail"] },
  { id: qid(27), passageId: P(7), prompt: "In the passage, 'it' in 'it is cheap but suitable only for short distances' refers to", correct: "the beam bridge", wrong: ["the arch bridge", "the support", "the distance"], why: "The sentence describes the beam bridge.", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(28), passageId: P(7), prompt: "The passage mainly explains", correct: "how different bridge designs suit different distances", wrong: ["why bridges collapse", "who built the Golden Gate Bridge", "how steel is made"], why: "Each type is matched to the distance it can cover.", level: "medium", tags: [RC, "main-idea"] },

  // 8 Fast fashion
  { id: qid(29), passageId: P(8), prompt: "In the passage, the word 'synthetic' is closest in meaning to", correct: "artificial", wrong: ["natural", "expensive", "colourful"], why: "Synthetic fabrics are man-made, unlike natural cotton.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(30), passageId: P(8), prompt: "What environmental problem do washed synthetic fabrics cause?", correct: "Tiny plastic fibres end up in rivers and oceans.", wrong: ["They use thousands of litres of water.", "They produce smoke.", "They make rivers warmer."], why: "Many synthetic fabrics release tiny plastic fibres when washed, which reach rivers and oceans.", level: "medium", tags: [RC, "detail"] },
  { id: qid(31), passageId: P(8), prompt: "In the passage, 'they' in 'more power than they realise' refers to", correct: "shoppers", wrong: ["companies", "clothes", "rivers"], why: "'I think shoppers have more power than they realise.'", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(32), passageId: P(8), prompt: "What is the writer's main message?", correct: "Shoppers can reduce the harm by buying less and choosing quality.", wrong: ["Clothes should never be washed.", "Companies should stop making clothes.", "Fashion is a waste of time."], why: "The writer asks shoppers to buy fewer items, choose quality and repair clothes.", level: "medium", tags: [RC, "author-opinion"] },

  // 9 Ibn Battuta
  { id: qid(33), passageId: P(9), prompt: "In the passage, the word 'dictate' is closest in meaning to", correct: "say aloud for someone to write down", wrong: ["read silently", "draw a map of", "copy from a book"], why: "He told the story of his travels so that a scribe could record it.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(34), passageId: P(9), prompt: "Why did he often work as a judge?", correct: "Because of his religious education", wrong: ["Because rulers feared him", "Because he needed a boat", "Because he was born in India"], why: "The passage says he worked as a judge because of his religious education.", level: "easy", tags: [RC, "detail"] },
  { id: qid(35), passageId: P(9), prompt: "In the passage, 'This book' refers to", correct: "the Rihla", wrong: ["the Hajj", "the caravan", "the ruler's order"], why: "The ruler asked him to dictate an account; the resulting book is the Rihla.", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(36), passageId: P(9), prompt: "Why is the Rihla valuable to historians?", correct: "It describes cities and customs few others recorded.", wrong: ["It is the shortest travel book.", "It was written by a ruler.", "It lists the prices of goods."], why: "The passage says it describes places and customs rarely recorded by other writers.", level: "medium", tags: [RC, "inference"] },

  // 10 AI
  { id: qid(37), passageId: P(10), prompt: "In the passage, the word 'incomplete' is closest in meaning to", correct: "missing some parts", wrong: ["completely correct", "very recent", "easy to read"], why: "Data that is incomplete lacks some of the information.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(38), passageId: P(10), prompt: "How can AI help doctors?", correct: "By examining many X-ray images to help spot early signs of disease", wrong: ["By replacing hospital staff", "By cooking meals for patients", "By writing prescriptions alone"], why: "AI programs can examine thousands of X-ray images and help doctors spot early signs of disease.", level: "medium", tags: [RC, "detail"] },
  { id: qid(39), passageId: P(10), prompt: "In the passage, 'they' in 'they may be unfair' refers to", correct: "AI systems", wrong: ["doctors", "students", "patterns"], why: "'Systems can make mistakes, and they may be unfair if the data...'", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(40), passageId: P(10), prompt: "What do the experts in the passage advise about AI?", correct: "Treat it as a helpful assistant and check important results.", wrong: ["Avoid it completely.", "Trust every result.", "Use it only in schools."], why: "They argue that people should treat AI as a helpful assistant and check important results themselves.", level: "hard", tags: [RC, "author-opinion"] },
];

export const STEP_MOCK_5_READING_QUESTIONS = buildQuestions("reading", "step-mock-5", specs);
