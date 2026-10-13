import type { ReadingPassage } from "@/types/question";
import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/**
 * Mock exam 3 - READING: 10 original passages (about 130-170 words) with 4
 * questions each (40 questions). Topics: astronomy, aviation, health, online
 * safety, Saudi heritage, the water cycle, wildlife, economy, biography and the
 * environment. Each passage mixes vocabulary, detail, pronoun and
 * inference / opinion / main-idea items.
 */

const pid = (n: number) => `passage-sm3-${n}`;
const qid = (n: number) => `sm3-reading-${n}`;
const ids = (from: number) => [0, 1, 2, 3].map((i) => qid(from + i));

export const STEP_MOCK_3_READING_PASSAGES: ReadingPassage[] = [
  {
    id: pid(1),
    title: "Why the Moon Seems to Change Shape",
    body: "The Moon does not produce any light of its own. What we see is sunlight bouncing off its surface. Because the Moon travels around the Earth once every twenty-nine and a half days or so, the part of its lit side that faces us keeps changing. When the Moon sits between the Earth and the Sun, its lit side faces away from us, and we see almost nothing; this is called the new moon. A week later, we see half of the lit side, and a week after that the whole face shines as a full moon. Then the cycle runs backwards until the Moon disappears again. Many people believe that the phases are caused by the Earth's shadow falling on the Moon, but this is a mistake. The Earth's shadow only covers the Moon during a lunar eclipse, which is rare. For centuries, the cycle of the Moon has guided calendars, and the Islamic calendar still begins each month with the sighting of the new crescent.",
    questionIds: ids(1),
  },
  {
    id: pid(2),
    title: "How Aeroplanes Stay in the Air",
    body: "An aeroplane weighs many tonnes, yet it rises into the sky because of its wings. A wing is curved on top and flatter underneath. As the plane rushes forward, the wing's shape and slight tilt guide the air downward, and the pressure above the wing becomes lower than the pressure below it. The higher pressure beneath pushes the wing upward. This upward force is called lift. To move forward fast enough to create lift, a plane needs thrust, which is produced by powerful engines. Pilots control the plane by adjusting small moving parts on the wings and tail, which change the way air flows around them. Contrary to what many people think, the engines do not hold the aeroplane up; if they stop in flight, a plane can still glide for a long distance. Because lift depends on speed, planes need long runways to build up enough speed before take-off.",
    questionIds: ids(5),
  },
  {
    id: pid(3),
    title: "Understanding Stress",
    body: "Stress is the body's natural reaction to pressure. When we face a difficult exam or a sudden danger, the brain releases chemicals that make the heart beat faster and the muscles tighten. In short bursts this response is helpful, because it gives us extra energy and focus. The problem begins when stress continues for weeks or months. Long-term stress can cause headaches, poor sleep, and difficulty concentrating, and it may weaken the body's ability to fight illness. Doctors recommend several simple ways to manage it. Regular exercise burns off the extra energy, while a fixed sleeping routine helps the body recover. Talking to a friend or family member can also lighten the burden, since a problem shared often feels smaller. Students in particular should break large tasks into small steps instead of leaving everything to the last night. Although stress cannot be removed from life completely, learning to control it can protect both health and performance.",
    questionIds: ids(9),
  },
  {
    id: pid(4),
    title: "Staying Safe Online",
    body: "Every day, millions of people log in to websites that hold their private information, so a strong password is the first line of defence. A good password is long, at least twelve characters, and mixes letters, numbers and symbols. It should not contain personal details such as a birthday or a pet's name, because attackers try these first. Experts also warn against using the same password on several sites; if one site is hacked, criminals can open every other account. Because remembering many complicated passwords is difficult, a password manager, a program that stores them safely, can help. Another important protection is two-step verification, which sends a code to your phone before allowing access. Finally, be careful with messages that ask you to click a link and enter your details. These \"phishing\" messages look real, but their purpose is to steal your information. When in doubt, go to the website directly instead.",
    questionIds: ids(13),
  },
  {
    id: pid(5),
    title: "Diriyah: Birthplace of the Saudi State",
    body: "Diriyah, on the edge of Riyadh, is often called the birthplace of the Saudi state. In 1727, Imam Muhammad bin Saud became its ruler, and from here the first Saudi state grew across much of the Arabian Peninsula. The city's most famous district, At-Turaif, was built in the traditional Najdi style, using mud brick that keeps interiors cool in the summer heat. Thick walls, small windows and shaded courtyards were all designed to protect people from the sun. In 2010, UNESCO added At-Turaif to its list of World Heritage Sites, recognising its value for all humanity. Today, visitors can walk through restored palaces, learn about the history of the kingdom in its museums, and enjoy traditional food in the old streets. The restoration project aims to protect the buildings while welcoming large numbers of visitors, so that future generations can understand where their country began.",
    questionIds: ids(17),
  },
  {
    id: pid(6),
    title: "The Water Cycle",
    body: "The water on Earth is constantly moving in a cycle that has no beginning or end. The Sun heats the surface of oceans, lakes and rivers, and some of the water turns into an invisible gas called water vapour. This process is known as evaporation. Plants add to the supply by releasing water through their leaves. As the vapour rises, the air around it becomes colder, and the vapour condenses into tiny drops that gather to form clouds. When the drops grow heavy, they fall as rain, snow or hail. Some of this water flows into rivers and returns to the sea, while some sinks into the ground and is stored as groundwater. In dry countries such as Saudi Arabia, this underground water is extremely precious, because rain is rare and the water takes thousands of years to be replaced once it is used.",
    questionIds: ids(21),
  },
  {
    id: pid(7),
    title: "Sea Turtles in Danger",
    body: "Sea turtles have swum in the world's oceans for more than a hundred million years, but today six of the seven species are considered threatened. Female turtles return to the same beach where they were born to lay their eggs, often travelling thousands of kilometres to reach it. A mother digs a hole in the sand, lays about a hundred eggs, covers them, and returns to the sea. After about two months, the baby turtles hatch at night and crawl toward the brightest horizon, which is normally the moonlit sea. Unfortunately, artificial lights on modern beaches confuse them, and many head inland instead and die. Plastic bags are another danger, because turtles mistake them for jellyfish and eat them. Conservation groups protect nests with cages, switch off lights near beaches during hatching season, and teach visitors not to leave rubbish behind. Their work shows that small changes in human behaviour can save an ancient species.",
    questionIds: ids(25),
  },
  {
    id: pid(8),
    title: "The Rise of Online Shopping",
    body: "Twenty years ago, most people bought clothes, books and electronics in physical shops. Today, a growing number of customers prefer to click a button and wait for a delivery. The main reason is convenience: shoppers can compare prices from home at any hour, read reviews written by other buyers, and return items if they are not satisfied. For small businesses, the internet offers a way to reach customers in distant cities without paying for an expensive shop. However, online shopping has disadvantages. Buyers cannot touch or try products before paying, and some items arrive different from the pictures. There is also growing concern about the packaging waste created by millions of deliveries. Many experts expect traditional shops to survive by offering something websites cannot, such as personal advice and a chance to experience products directly. In the future, the most successful companies will probably combine both methods.",
    questionIds: ids(29),
  },
  {
    id: pid(9),
    title: "Marie Curie: A Scientist Against the Odds",
    body: "Marie Curie was born in Warsaw in 1867. As a young woman she could not study at her local university, because women were not admitted, so she saved money for years and moved to Paris. There she studied physics and mathematics, working long hours in a small, cold room. She later married Pierre Curie, a fellow scientist, and together they studied the strange rays given off by certain minerals. Marie named this property radioactivity and discovered two new elements, polonium and radium. In 1903 she shared the Nobel Prize in Physics, and in 1911 she won the Nobel Prize in Chemistry on her own, becoming the first person to win in two different sciences. During the First World War she helped build mobile X-ray units that were driven close to the battlefields, and these units helped doctors treat wounded soldiers. She died in 1934, probably as a result of her long exposure to radiation, whose dangers were not understood at the time.",
    questionIds: ids(33),
  },
  {
    id: pid(10),
    title: "Why Recycling Matters",
    body: "Every year, people throw away billions of tonnes of rubbish, and much of it ends up in landfills, where it can take decades or even centuries to break down. Recycling reduces this problem by turning old materials into new products. Paper, for example, can be pulped and made into fresh sheets several times, which saves trees and uses less water and energy than producing paper from wood. Metals such as aluminium are even more valuable, because they can be melted and reused again and again without losing quality. Plastic is more difficult, since many types cannot be mixed, and some can only be recycled once. For this reason, experts say that recycling alone is not enough; we must also reduce the amount we use and reuse what we already have. A simple habit, such as carrying a cloth bag to the shop, prevents hundreds of plastic bags from entering the environment over a lifetime.",
    questionIds: ids(37),
  },
];

const P = pid;
const RC = "reading-comprehension";

const specs: QuestionSpec[] = [
  // ---- 1: Moon ----
  { id: qid(1), passageId: P(1), prompt: "In the passage, the word 'sighting' is closest in meaning to", correct: "the act of seeing something", wrong: ["the act of hiding something", "the act of measuring something", "the act of drawing something"], why: "The Islamic month begins when the new crescent is seen, so 'sighting' means seeing it.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(2), passageId: P(1), prompt: "According to the passage, what causes the phases of the Moon?", correct: "The changing part of its lit side that faces the Earth", wrong: ["The Earth's shadow falling on it", "Clouds passing in front of it", "Light that the Moon produces itself"], why: "As the Moon orbits, the portion of its sunlit side that we can see changes.", level: "easy", tags: [RC, "detail"] },
  { id: qid(3), passageId: P(1), prompt: "In the passage, 'this' in 'but this is a mistake' refers to", correct: "the belief that the Earth's shadow causes the phases", wrong: ["the Moon travelling around the Earth", "the appearance of the new moon", "the use of the Moon in calendars"], why: "The sentence says many people believe the shadow causes the phases, 'but this is a mistake'.", level: "hard", tags: [RC, "pronoun-reference"] },
  { id: qid(4), passageId: P(1), prompt: "What is the best title for the passage?", correct: "Why the Moon Seems to Change Shape", wrong: ["The Islamic Calendar", "How Eclipses Are Predicted", "The Journey of the Sun"], why: "The passage explains the phases of the Moon and why they happen.", level: "easy", tags: [RC, "main-idea"] },

  // ---- 2: aeroplanes ----
  { id: qid(5), passageId: P(2), prompt: "In the passage, the word 'adjusting' is closest in meaning to", correct: "changing slightly", wrong: ["breaking completely", "painting", "measuring"], why: "Pilots make small changes to moving parts on the wings and tail.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(6), passageId: P(2), prompt: "According to the passage, what produces thrust?", correct: "Powerful engines", wrong: ["The curved tail", "Moving air above the wing", "The runway"], why: "The passage says thrust 'is produced by powerful engines'.", level: "easy", tags: [RC, "detail"] },
  { id: qid(7), passageId: P(2), prompt: "In the passage, 'they' in 'if they stop in flight' refers to", correct: "the engines", wrong: ["the pilots", "the wings", "the runways"], why: "'The engines do not hold the aeroplane up; if they stop in flight...'", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(8), passageId: P(2), prompt: "Why do planes need long runways?", correct: "They must reach enough speed to create lift.", wrong: ["Their engines work only on the ground.", "The wings need to be cooled.", "Pilots need time to adjust the tail."], why: "Lift depends on speed, so planes need distance to build up speed before take-off.", level: "medium", tags: [RC, "inference"] },

  // ---- 3: stress ----
  { id: qid(9), passageId: P(3), prompt: "In the passage, the word 'burden' is closest in meaning to", correct: "heavy load", wrong: ["quick reward", "small gift", "clear answer"], why: "Talking to someone 'lightens the burden', that is, makes a heavy load easier to carry.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(10), passageId: P(3), prompt: "According to the passage, when does stress become a problem?", correct: "When it continues for weeks or months", wrong: ["When it gives us extra energy", "When we face a sudden danger", "When we exercise regularly"], why: "The problem begins when stress continues for weeks or months.", level: "easy", tags: [RC, "detail"] },
  { id: qid(11), passageId: P(3), prompt: "In the passage, 'it' in 'and it may weaken the body's ability to fight illness' refers to", correct: "long-term stress", wrong: ["a fixed sleeping routine", "the heart", "extra energy"], why: "Long-term stress can cause headaches and poor sleep, and it may also weaken the body.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(12), passageId: P(3), prompt: "Which advice would the author most likely give a student?", correct: "Divide big tasks into small steps.", wrong: ["Avoid talking to friends about problems.", "Study mainly on the last night.", "Try to remove all stress from life."], why: "The passage recommends that students break large tasks into small steps.", level: "medium", tags: [RC, "author-opinion"] },

  // ---- 4: online safety ----
  { id: qid(13), passageId: P(4), prompt: "In the passage, the word 'defence' is closest in meaning to", correct: "protection", wrong: ["attack", "promise", "mistake"], why: "A strong password is the first line of defence, meaning the first protection.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(14), passageId: P(4), prompt: "Why should the same password not be used on several sites?", correct: "If one site is hacked, criminals can open the other accounts.", wrong: ["Passwords expire after a year.", "Websites refuse repeated passwords.", "It makes the password too long."], why: "The passage warns that a hacked site lets criminals open every other account with the same password.", level: "easy", tags: [RC, "detail"] },
  { id: qid(15), passageId: P(4), prompt: "In the passage, 'their' in 'their purpose is to steal your information' refers to", correct: "phishing messages", wrong: ["password managers", "strong passwords", "experts"], why: "'These \"phishing\" messages look real, but their purpose is to steal your information.'", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(16), passageId: P(4), prompt: "What is the main purpose of the passage?", correct: "To explain how to protect online accounts", wrong: ["To advertise a password manager", "To describe how criminals are caught", "To compare different phones"], why: "Every paragraph gives a way to keep accounts safe.", level: "medium", tags: [RC, "main-idea"] },

  // ---- 5: Diriyah ----
  { id: qid(17), passageId: P(5), prompt: "In the passage, the word 'restored' is closest in meaning to", correct: "repaired to its earlier condition", wrong: ["sold to a new owner", "removed from the city", "painted a new colour"], why: "Restored palaces have been repaired so that they look as they did originally.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(18), passageId: P(5), prompt: "According to the passage, why was mud brick used in Najdi buildings?", correct: "It keeps interiors cool in the summer heat.", wrong: ["It was cheaper than stone in the city.", "It allowed buildings to be taller.", "It protected the city against floods."], why: "The passage says mud brick 'keeps interiors cool in the summer heat'.", level: "easy", tags: [RC, "detail"] },
  { id: qid(19), passageId: P(5), prompt: "In the passage, 'its' in 'recognising its value for all humanity' refers to", correct: "At-Turaif", wrong: ["UNESCO", "Riyadh", "the list"], why: "UNESCO added At-Turaif to the list, recognising At-Turaif's value.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(20), passageId: P(5), prompt: "The passage is mainly about", correct: "the history of Diriyah and the protection of its heritage", wrong: ["how to build with mud brick", "the life of Imam Muhammad bin Saud", "tourism in modern Riyadh"], why: "The passage covers Diriyah's role in history and the restoration of At-Turaif.", level: "easy", tags: [RC, "main-idea"] },

  // ---- 6: water cycle ----
  { id: qid(21), passageId: P(6), prompt: "In the passage, the word 'precious' is closest in meaning to", correct: "extremely valuable", wrong: ["very old", "easy to find", "dangerous"], why: "Groundwater is described as precious because rain is rare and replacement is very slow.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(22), passageId: P(6), prompt: "What happens when water vapour rises and the air becomes colder?", correct: "It condenses into drops that form clouds.", wrong: ["It turns into groundwater.", "It is absorbed by plants.", "It evaporates again."], why: "The vapour condenses into tiny drops that gather to form clouds.", level: "medium", tags: [RC, "detail"] },
  { id: qid(23), passageId: P(6), prompt: "In the passage, 'they' in 'When the drops grow heavy, they fall' refers to", correct: "the drops", wrong: ["the clouds", "the rivers", "the plants"], why: "The heavy drops fall as rain, snow or hail.", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(24), passageId: P(6), prompt: "Why is underground water so valuable in Saudi Arabia?", correct: "Rain is rare and the water is replaced very slowly.", wrong: ["It is warmer than rainwater.", "It evaporates quickly.", "It comes directly from the sea."], why: "The passage says rain is rare there and the groundwater takes thousands of years to be replaced.", level: "hard", tags: [RC, "inference"] },

  // ---- 7: sea turtles ----
  { id: qid(25), passageId: P(7), prompt: "In the passage, the word 'hatch' is closest in meaning to", correct: "come out of an egg", wrong: ["fall from a tree", "dig a hole", "swim away"], why: "The baby turtles hatch after about two months, meaning they emerge from their eggs.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(26), passageId: P(7), prompt: "According to the passage, why do many baby turtles go inland?", correct: "Artificial lights confuse them.", wrong: ["They are looking for food.", "They are following their mother.", "The sea is too cold."], why: "Hatchlings head toward the brightest horizon, and artificial lights on beaches mislead them.", level: "easy", tags: [RC, "detail"] },
  { id: qid(27), passageId: P(7), prompt: "In the passage, 'it' in 'to reach it' refers to", correct: "the beach", wrong: ["the sea", "the nest", "the egg"], why: "Females travel thousands of kilometres to reach the beach where they were born.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(28), passageId: P(7), prompt: "What is the author's attitude to the work of conservation groups?", correct: "Positive, because it shows that small changes can help", wrong: ["Doubtful, because it costs too much", "Critical, because it harms tourism", "Neutral, because it has no effect"], why: "The last sentence says their work shows small changes in behaviour can save an ancient species.", level: "medium", tags: [RC, "author-opinion"] },

  // ---- 8: online shopping ----
  { id: qid(29), passageId: P(8), prompt: "In the passage, the word 'convenience' is closest in meaning to", correct: "ease and comfort", wrong: ["high cost", "bad quality", "long delay"], why: "Shoppers can buy from home at any hour, which is easy and comfortable.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(30), passageId: P(8), prompt: "All of the following are disadvantages of online shopping mentioned in the passage EXCEPT", correct: "higher prices than in shops", wrong: ["not being able to try products", "packaging waste", "products that look different from the pictures"], why: "Comparing prices is described as a benefit; higher prices are not mentioned as a drawback.", level: "medium", tags: [RC, "detail"] },
  { id: qid(31), passageId: P(8), prompt: "In the passage, 'they' in 'if they are not satisfied' refers to", correct: "shoppers", wrong: ["items", "small businesses", "prices"], why: "Shoppers can return items if they (the shoppers) are not satisfied.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(32), passageId: P(8), prompt: "What does the author predict about the future?", correct: "The most successful companies will combine online and shop selling.", wrong: ["Traditional shops will disappear.", "Online shopping will stop growing.", "Small businesses will close."], why: "The last sentence says the most successful companies will probably combine both methods.", level: "hard", tags: [RC, "author-opinion"] },

  // ---- 9: Marie Curie ----
  { id: qid(33), passageId: P(9), prompt: "In the passage, the word 'admitted' is closest in meaning to", correct: "allowed to enter", wrong: ["asked to leave", "paid for", "taught"], why: "Women were not allowed to enter the university, so she went abroad.", level: "medium", tags: [RC, "vocabulary"] },
  { id: qid(34), passageId: P(9), prompt: "Why did Marie Curie move to Paris?", correct: "Women were not admitted to her local university.", wrong: ["She wanted to marry Pierre Curie.", "She was offered a job in a hospital.", "Her family had moved there."], why: "She could not study at home because women were not admitted, so she saved money and moved to Paris.", level: "easy", tags: [RC, "detail"] },
  { id: qid(35), passageId: P(9), prompt: "In the passage, 'whose' in 'radiation, whose dangers were not understood' refers to", correct: "radiation", wrong: ["Marie Curie", "the First World War", "the X-ray units"], why: "The dangers of radiation were not understood at the time.", level: "medium", tags: [RC, "pronoun-reference"] },
  { id: qid(36), passageId: P(9), prompt: "What can be inferred about Marie Curie?", correct: "She was determined and hardworking.", wrong: ["She disliked working with others.", "She gave up science in 1911.", "She was unknown during her lifetime."], why: "She saved money for years, worked long hours and won two Nobel Prizes.", level: "medium", tags: [RC, "inference"] },

  // ---- 10: recycling ----
  { id: qid(37), passageId: P(10), prompt: "In the passage, the word 'decades' is closest in meaning to", correct: "periods of ten years", wrong: ["periods of one hundred years", "single days", "short seasons"], why: "A decade is ten years; the passage says rubbish can take decades or centuries to break down.", level: "easy", tags: [RC, "vocabulary"] },
  { id: qid(38), passageId: P(10), prompt: "Why is aluminium especially valuable for recycling?", correct: "It can be reused again and again without losing quality.", wrong: ["It is lighter than paper.", "It breaks down quickly in landfills.", "It can be mixed with any plastic."], why: "Metals such as aluminium can be melted and reused repeatedly without losing quality.", level: "medium", tags: [RC, "detail"] },
  { id: qid(39), passageId: P(10), prompt: "In the passage, 'it' in 'much of it ends up in landfills' refers to", correct: "rubbish", wrong: ["the year", "paper", "the environment"], why: "People throw away rubbish, and much of it (the rubbish) ends up in landfills.", level: "easy", tags: [RC, "pronoun-reference"] },
  { id: qid(40), passageId: P(10), prompt: "What does the author believe about recycling?", correct: "It helps, but reducing and reusing are also needed.", wrong: ["It solves the waste problem completely.", "It is not worth doing.", "It should replace all shops."], why: "The author says recycling alone is not enough; we must also reduce and reuse.", level: "hard", tags: [RC, "author-opinion"] },
];

export const STEP_MOCK_3_READING_QUESTIONS = buildQuestions("reading", "step-mock-3", specs);
