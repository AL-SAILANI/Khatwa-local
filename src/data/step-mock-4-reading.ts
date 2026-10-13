import type { ReadingPassage } from "@/types/question";
import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/**
 * Mock exam 4 - READING: 10 original passages (about 120-170 words), 4
 * questions each. Topics: tides, the heart, the Haramain railway, breakfast,
 * the pyramids, glass, emperor penguins, social media, Alexander Fleming and
 * desalination.
 */

const pid = (n: number) => `passage-sm4-${n}`;
const qid = (n: number) => `sm4-reading-${n}`;
const ids = (from: number) => [0, 1, 2, 3].map((i) => qid(from + i));

export const STEP_MOCK_4_READING_PASSAGES: ReadingPassage[] = [
  {
    id: pid(1),
    title: "How Tides Work",
    body: "Anyone who has spent a day at the beach has seen the sea rise and fall. These movements are called tides, and they are caused mainly by the Moon. The Moon's gravity pulls on the Earth, and because water can move freely, the oceans bulge slightly toward the Moon. As the Earth turns, a given coast passes through these bulges and experiences high tide roughly twice a day, with low tide between them. The Sun also pulls on the oceans, although its effect is smaller because it is much farther away. When the Sun, Moon and Earth line up, at full moon and new moon, their combined pull creates especially large tides known as spring tides. Fishermen and sailors have always studied tide tables, because a boat can be trapped on the sand at low tide. Today, engineers are even building power stations that use the moving water to generate electricity without burning fuel.",
    questionIds: ids(1),
  },
  {
    id: pid(2),
    title: "The Human Heart",
    body: "The heart is a muscle about the size of a fist, and it never rests. Beating around seventy times a minute, it pumps blood through a network of vessels that would stretch for tens of thousands of kilometres if laid end to end. The right side of the heart sends blood to the lungs, where it picks up oxygen. The left side then pumps this oxygen-rich blood to the rest of the body. Four valves act like one-way doors, ensuring that blood flows in the correct direction. A healthy heart can adapt to demands: during exercise it beats faster so that the muscles receive more oxygen. Doctors say that the best way to protect it is a combination of regular exercise, a diet low in salt and fat, and avoiding smoking. Small habits such as walking daily may add years to a person's life.",
    questionIds: ids(5),
  },
  {
    id: pid(3),
    title: "The Haramain High-Speed Railway",
    body: "The Haramain High-Speed Railway links the holy cities of Makkah and Madinah, with stops at Jeddah and King Abdullah Economic City. Opened in 2018, the line is about 450 kilometres long, and its trains travel at speeds of up to 300 kilometres per hour. Before the railway, the journey between the two cities by road took around five hours; by train it takes about two and a half. The stations were designed with the needs of pilgrims in mind, with wide halls, clear signs in several languages, and prayer rooms. Because the trains run on electricity, they produce less pollution than the cars and buses that would otherwise carry the same passengers. The project also created thousands of jobs during construction. Officials hope that the railway will encourage more visitors to see the region, and that it will serve as a model for future transport projects in the kingdom.",
    questionIds: ids(9),
  },
  {
    id: pid(4),
    title: "Why Breakfast Matters",
    body: "Many students skip breakfast because they are in a hurry, but nutrition experts say this is a mistake. After a night without food, the body's energy supply is low, and a meal in the morning refills it. Studies have found that students who eat breakfast usually concentrate better in class and remember more of what they learn. A good breakfast does not need to be complicated: whole-grain bread, eggs, yoghurt, fruit and milk provide energy that lasts for hours, while sugary cereals and pastries give a quick boost that fades fast and leaves people hungry again. Some people argue that they simply do not feel hungry in the morning. In that case, a small snack such as a banana is better than nothing. The writer concludes that a few minutes at breakfast is among the cheapest ways to improve both health and school results.",
    questionIds: ids(13),
  },
  {
    id: pid(5),
    title: "The Great Pyramid of Giza",
    body: "The Great Pyramid of Giza was built around 2500 BCE as the tomb of the pharaoh Khufu. It is made of more than two million blocks of stone, some weighing as much as a small truck, and for about 3,800 years it was the tallest structure on Earth. Historians once believed that the pyramid was built by slaves, but discoveries of workers' villages near the site suggest that the builders were paid labourers who were fed well and given medical care. The workers probably moved the heavy blocks on wooden sledges, pouring water on the sand in front of them to make it easier to drag. When it was finished, the pyramid was covered with smooth white limestone that shone in the sun. Most of this outer layer has since been removed or has fallen away, which is why the monument looks rough today.",
    questionIds: ids(17),
  },
  {
    id: pid(6),
    title: "How Glass Is Made",
    body: "Glass has been made for more than four thousand years, but the basic recipe has hardly changed. The main ingredient is sand, which is mixed with soda ash and limestone and heated in a furnace to about 1,500 degrees Celsius until it melts into a glowing liquid. In the past, craftsmen shaped this liquid by blowing air through a long pipe, a technique that is still used for decorative glassware. Modern factories prefer a different method: the molten glass is poured onto a bath of melted tin, where it spreads out evenly and forms perfectly flat sheets for windows. One of the most useful qualities of glass is that it can be recycled again and again without losing its quality, so old bottles are crushed and melted to make new ones, which saves both energy and raw materials.",
    questionIds: ids(21),
  },
  {
    id: pid(7),
    title: "Emperor Penguins",
    body: "Emperor penguins live in Antarctica, where winter temperatures can fall below minus forty degrees Celsius and winds blow at more than a hundred kilometres per hour. To survive, they gather in huge groups called huddles, standing so close together that they share their body heat. Penguins on the windy outside edge slowly move toward the warmer centre, while those in the middle take their turn at the edge, so that no single bird suffers the cold for long. The mother lays one egg and goes to sea to feed, while the father balances the egg on his feet, under a warm fold of skin, for about two months without eating. When the chick hatches, the mother returns with food. Scientists admire this cooperation, which shows how a species can survive extreme conditions by working as a team.",
    questionIds: ids(25),
  },
  {
    id: pid(8),
    title: "Teenagers and Social Media",
    body: "Few teenagers can imagine life without social media, and there is no doubt that it has benefits. It allows them to keep in touch with relatives abroad, share ideas with people who have the same interests, and even learn new skills from online videos. However, I believe that many young people spend far too long on their screens. Studies suggest that those who check their phones constantly sleep less and find it harder to concentrate on homework. Another problem is comparison: when teenagers see only the best moments of other people's lives, they may feel that their own lives are boring. I am not suggesting that social media should be banned. Instead, families should agree on simple rules, such as switching off phones during meals and an hour before bedtime. With these limits, technology can remain a useful tool rather than a harmful habit.",
    questionIds: ids(29),
  },
  {
    id: pid(9),
    title: "The Discovery of Penicillin",
    body: "In 1928, the Scottish scientist Alexander Fleming returned from a holiday to his untidy laboratory in London and noticed something strange. A dish of bacteria he had forgotten to clean was covered with mould, and around the mould the bacteria had died. Fleming realised that the mould was producing a substance that could kill harmful germs, and he named it penicillin. However, he was unable to produce enough of the substance to treat patients. It was more than ten years later that two other scientists, Howard Florey and Ernst Chain, found a way to make penicillin in large quantities, just in time to treat wounded soldiers in the Second World War. In 1945, all three men shared the Nobel Prize. Penicillin was the first of many antibiotics that have since saved millions of lives.",
    questionIds: ids(33),
  },
  {
    id: pid(10),
    title: "Fresh Water from the Sea",
    body: "Saudi Arabia has very little rainfall and no permanent rivers, so it relies heavily on desalination, the process of removing salt from seawater. The kingdom produces more desalinated water than any other country in the world, and many cities, including Riyadh, receive part of their drinking water from plants on the coast. There are two main methods. In thermal plants, seawater is heated until it turns into vapour, leaving the salt behind; the vapour is then cooled into fresh water. In reverse osmosis plants, powerful pumps push seawater through very fine filters that block the salt. Reverse osmosis uses less energy, so most new plants use it. Desalination is expensive, however, and the salty water left over must be returned carefully to the sea so that it does not harm marine life. For this reason, engineers are working on cheaper, cleaner technology, including plants that run on solar power.",
    questionIds: ids(37),
  },
];

const P = pid;
const RC = "reading-comprehension";

const specs: QuestionSpec[] = [
  // 1 tides
  { id: qid(1), passageId: P(1), prompt: "In the passage, the word 'bulge' is closest in meaning to", correct: "swell outward", wrong: ["shrink inward", "freeze solid", "move quickly away"], why: "The oceans swell slightly toward the Moon because of its gravity.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(2), passageId: P(1), prompt: "Why is the Sun's effect on the tides smaller than the Moon's?", correct: "It is much farther away.", wrong: ["It is much smaller than the Moon.", "It does not have gravity.", "It only shines during the day."], why: "The passage says its effect is smaller 'because it is much farther away'.", level: "easy", tags: [RC, "detail"] },
  { id: qid(3), passageId: P(1), prompt: "In the passage, 'its' in 'although its effect is smaller' refers to", correct: "the Sun", wrong: ["the Moon", "the Earth", "the tide"], why: "'The Sun also pulls on the oceans, although its effect is smaller...'", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(4), passageId: P(1), prompt: "Why have sailors always studied tide tables?", correct: "A boat can be trapped on the sand at low tide.", wrong: ["Tides decide the price of fish.", "Tide tables show where the Moon is.", "Spring tides only happen at sea."], why: "Knowing the tide times helps them avoid being stuck on the sand at low tide.", level: "medium", tags: [RC, "inference"] },

  // 2 heart
  { id: qid(5), passageId: P(2), prompt: "In the passage, the word 'adapt' is closest in meaning to", correct: "adjust to new conditions", wrong: ["stop working altogether", "grow much larger", "become weaker and slower"], why: "During exercise the heart changes its speed to meet the body's needs.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(6), passageId: P(2), prompt: "Which side of the heart sends blood to the lungs?", correct: "The right side", wrong: ["The left side", "The valves", "The vessels"], why: "The passage states that the right side sends blood to the lungs.", level: "easy", tags: [RC, "detail"] },
  { id: qid(7), passageId: P(2), prompt: "In the passage, 'it' in 'it beats faster' refers to", correct: "a healthy heart", wrong: ["the exercise itself", "the blood vessels", "the oxygen supply"], why: "'A healthy heart can adapt to demands: during exercise it beats faster...'", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(8), passageId: P(2), prompt: "What is the best title for the passage?", correct: "How the Heart Works and How to Protect It", wrong: ["The History of Heart Surgery in Modern Medicine", "Why Human Blood Is Red and Where It Comes From", "The Best Sports for Children to Play"], why: "The passage describes how the heart works and then how to look after it.", level: "easy", tags: [RC, "main-idea"] },

  // 3 railway
  { id: qid(9), passageId: P(3), prompt: "In the passage, the word 'pilgrims' is closest in meaning to", correct: "people who travel to a holy place", wrong: ["workers who build stations", "tourists who visit museums", "drivers of trains"], why: "Pilgrims travel to Makkah and Madinah for religious reasons.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(10), passageId: P(3), prompt: "How long does the train journey between the two cities take?", correct: "About two and a half hours", wrong: ["About five hours, as before", "About one hour and a half", "About four hours by train"], why: "The passage says the road journey took about five hours but the train takes about two and a half.", level: "easy", tags: [RC, "detail"] },
  { id: qid(11), passageId: P(3), prompt: "In the passage, 'it' in 'it will serve as a model' refers to", correct: "the railway", wrong: ["the road", "the region", "the pollution"], why: "Officials hope the railway will serve as a model for future projects.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(12), passageId: P(3), prompt: "What is the writer's main purpose?", correct: "To describe the railway and its benefits", wrong: ["To compare cars and buses", "To explain how electricity works", "To advertise train tickets"], why: "The passage lists the railway's route, speed, design and advantages.", level: "medium", tags: [RC, "main-idea"] },

  // 4 breakfast
  { id: qid(13), passageId: P(4), prompt: "In the passage, the word 'boost' is closest in meaning to", correct: "a sudden increase in energy", wrong: ["a long delay before breakfast", "a heavy meal in the evening", "a sad feeling in the morning"], why: "Sugary foods give a quick increase in energy that fades fast.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(14), passageId: P(4), prompt: "Which food provides energy that lasts for hours?", correct: "Whole-grain bread", wrong: ["Sugary breakfast cereal", "Pastries from the bakery", "Sweet cakes and biscuits"], why: "Whole-grain bread is listed among foods that give lasting energy; sugary cereals and pastries do not.", level: "easy", tags: [RC, "detail"] },
  { id: qid(15), passageId: P(4), prompt: "In the passage, 'this' in 'say this is a mistake' refers to", correct: "skipping breakfast", wrong: ["eating in a hurry", "being a student", "refilling energy"], why: "Students skip breakfast, and experts say this (skipping it) is a mistake.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(16), passageId: P(4), prompt: "What does the writer think about breakfast?", correct: "It is a cheap way to improve health and school results.", wrong: ["It is too complicated for students.", "It is unnecessary for people who are not hungry.", "It should always include sugary cereal."], why: "The writer concludes that a few minutes at breakfast is among the cheapest ways to improve health and results.", level: "medium", tags: [RC, "author-opinion"] },

  // 5 pyramid
  { id: qid(17), passageId: P(5), prompt: "In the passage, the word 'labourers' is closest in meaning to", correct: "workers who do physical jobs", wrong: ["rulers of a large country", "priests who served the pharaoh", "visitors who came from abroad"], why: "The builders were paid workers who did the heavy physical work.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(18), passageId: P(5), prompt: "How did the workers probably move the heavy blocks?", correct: "On wooden sledges over wet sand", wrong: ["With strong horses and ropes", "On boats down the river Nile", "With metal wheels and carts"], why: "They probably used wooden sledges and poured water on the sand to ease the dragging.", level: "medium", tags: [RC, "detail"] },
  { id: qid(19), passageId: P(5), prompt: "In the passage, 'this outer layer' refers to", correct: "the white limestone covering", wrong: ["the sand in front of the sledges", "the workers' villages nearby", "the heavy stone blocks inside"], why: "The pyramid was covered with smooth white limestone; most of this outer layer has gone.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(20), passageId: P(5), prompt: "What do the discoveries of workers' villages suggest?", correct: "The builders were paid and looked after.", wrong: ["The pyramid was built by slaves.", "The workers lived inside the pyramid.", "The pyramid was built very quickly."], why: "The villages suggest the builders were paid, well fed and given medical care.", level: "hard", tags: [RC, "inference"] },

  // 6 glass
  { id: qid(21), passageId: P(6), prompt: "In the passage, the word 'decorative' is closest in meaning to", correct: "used to make things look attractive", wrong: ["used to heat large buildings in winter", "used to carry water to the fields", "used to hide mistakes in the work"], why: "Decorative glassware is made to look beautiful.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(22), passageId: P(6), prompt: "Why is molten glass poured onto melted tin?", correct: "So that it spreads out into flat sheets.", wrong: ["So that it cools more slowly and safely.", "So that it changes colour as it spreads.", "So that it can be recycled again later."], why: "On the tin bath the glass spreads out evenly and forms perfectly flat sheets.", level: "medium", tags: [RC, "detail"] },
  { id: qid(23), passageId: P(6), prompt: "In the passage, 'ones' in 'to make new ones' refers to", correct: "bottles", wrong: ["furnaces", "craftsmen", "windows"], why: "Old bottles are melted to make new bottles.", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(24), passageId: P(6), prompt: "The passage is mainly about", correct: "how glass is made and reused", wrong: ["why glass breaks easily", "the history of window design", "how sand is collected"], why: "It describes the ingredients, the methods of shaping and the recycling of glass.", level: "easy", tags: [RC, "main-idea"] },

  // 7 penguins
  { id: qid(25), passageId: P(7), prompt: "In the passage, the word 'extreme' is closest in meaning to", correct: "very severe", wrong: ["very quiet", "slightly warm", "rather common"], why: "Antarctic winters are described as below minus forty degrees with strong winds.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(26), passageId: P(7), prompt: "How do emperor penguins avoid suffering the cold for long?", correct: "They take turns at the windy outer edge.", wrong: ["They dig holes in the ice.", "They swim to warmer seas.", "They sleep for most of the winter."], why: "Birds move from the edge to the centre and back, so none stays at the edge for long.", level: "medium", tags: [RC, "detail"] },
  { id: qid(27), passageId: P(7), prompt: "In the passage, 'those' in 'those in the middle' refers to", correct: "penguins", wrong: ["winds", "chicks", "mothers"], why: "Penguins on the edge move to the centre while those (penguins) in the middle take their turn at the edge.", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(28), passageId: P(7), prompt: "What do scientists admire about the penguins?", correct: "Their cooperation", wrong: ["Their great speed", "Their large size", "Their bright colour"], why: "The passage says scientists admire this cooperation.", level: "easy", tags: [RC, "author-opinion"] },

  // 8 social media
  { id: qid(29), passageId: P(8), prompt: "In the passage, the word 'constantly' is closest in meaning to", correct: "all the time", wrong: ["rarely", "suddenly", "by accident"], why: "Teenagers who check their phones constantly check them again and again.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(30), passageId: P(8), prompt: "According to the writer, why may teenagers feel their own lives are boring?", correct: "They see only the best moments of other people's lives.", wrong: ["They have too much homework to do every night.", "They are not allowed to use phones at school.", "They never see their relatives who live abroad."], why: "The writer says comparison with other people's best moments can make their own lives seem boring.", level: "medium", tags: [RC, "detail"] },
  { id: qid(31), passageId: P(8), prompt: "In the passage, 'those' in 'those who check their phones constantly' refers to", correct: "teenagers", wrong: ["relatives", "studies", "parents"], why: "The sentence is about young people who check their phones all the time.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(32), passageId: P(8), prompt: "What is the writer's position on social media?", correct: "It should be used with sensible limits.", wrong: ["It should be banned for all teenagers.", "It has no benefits at all for young people.", "It is always better than reading books."], why: "The writer rejects a ban and suggests simple family rules instead.", level: "medium", tags: [RC, "author-opinion"] },

  // 9 penicillin
  { id: qid(33), passageId: P(9), prompt: "In the passage, the word 'untidy' is closest in meaning to", correct: "not neat", wrong: ["very large", "brand new", "well known"], why: "Fleming forgot to clean a dish, which suggests his laboratory was not neat.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(34), passageId: P(9), prompt: "What did Fleming notice in the dish?", correct: "The bacteria had died around the mould.", wrong: ["The mould had turned blue and then died.", "The bacteria had grown much larger in size.", "The dish had been broken in the laboratory."], why: "Around the mould the bacteria had died.", level: "easy", tags: [RC, "detail"] },
  { id: qid(35), passageId: P(9), prompt: "In the passage, 'it' in 'he named it penicillin' refers to", correct: "the substance made by the mould", wrong: ["the untidy laboratory in London", "the dish that he had forgotten", "the holiday that he had just taken"], why: "He realised the mould produced a substance that kills germs and named that substance penicillin.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(36), passageId: P(9), prompt: "Why was penicillin not used to treat patients at once?", correct: "Fleming could not make enough of it.", wrong: ["Doctors refused to try it.", "It harmed the patients.", "It was too expensive to buy."], why: "The passage says he was unable to produce enough of the substance.", level: "hard", tags: [RC, "inference"] },

  // 10 desalination
  { id: qid(37), passageId: P(10), prompt: "In the passage, the word 'permanent' is closest in meaning to", correct: "lasting all the time", wrong: ["very large and wide", "fast-flowing and strong", "happening only sometimes"], why: "A permanent river flows all year round, and Saudi Arabia has none.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(38), passageId: P(10), prompt: "What happens in a reverse osmosis plant?", correct: "Pumps push seawater through filters that block the salt.", wrong: ["Seawater is heated until it turns into vapour.", "Salt is burned off in a very hot furnace.", "Fresh water is mixed with salt to clean it."], why: "Powerful pumps push seawater through very fine filters that block the salt.", level: "medium", tags: [RC, "detail"] },
  { id: qid(39), passageId: P(10), prompt: "In the passage, 'it' in 'so it relies heavily on desalination' refers to", correct: "Saudi Arabia", wrong: ["rainfall", "desalination", "seawater"], why: "Saudi Arabia has little rain, so it (the kingdom) relies on desalination.", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(40), passageId: P(10), prompt: "What does the passage suggest engineers want to develop?", correct: "Cheaper and cleaner technology", wrong: ["Larger rivers for the whole kingdom", "Stronger pumps that use more energy", "More coastal cities near the sea"], why: "Because desalination is expensive and leaves salty water, engineers are working on cheaper, cleaner technology.", level: "hard", tags: [RC, "author-opinion"] },
];

export const STEP_MOCK_4_READING_QUESTIONS = buildQuestions("reading", "step-mock-4", specs);
