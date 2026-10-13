import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/**
 * Mock exam 5 - LISTENING: 8 original clips, 20 questions. The transcript is
 * the audio script and the fallback text until recorded audio is uploaded.
 */

const flat =
  "Agent: Good morning, Sunrise Properties.\nCaller: Hello, I saw your advert for the two-bedroom flat near the university.\nAgent: Yes, it's still available. The rent is three thousand riyals a month, including water but not electricity.\nCaller: And is it furnished?\nAgent: Partly. The kitchen has a fridge and a cooker, but the bedrooms are empty.\nCaller: Can I see it this week?\nAgent: The owner is free on Thursday after two o'clock, or on Saturday morning.\nCaller: Thursday works. I'll bring my father with me.";

const sleep =
  "Lecturer: Sleep is divided into stages that repeat during the night. In light sleep, the body relaxes and the heartbeat slows. Deep sleep follows, and this is when the body repairs muscles and strengthens the immune system. The most famous stage is REM sleep, when most dreams occur and the brain is almost as active as when awake. A full cycle takes about ninety minutes, so adults go through four or five cycles in a night.\nStudent: Is it true that teenagers need more sleep?\nLecturer: Yes. They need between eight and ten hours, but many get far less, which affects memory and mood.";

const car =
  "Clerk: Welcome to FastCar.\nCustomer: I'd like to rent a small car for four days.\nClerk: Certainly. A small car is one hundred and twenty riyals a day, and a medium car is one hundred and eighty.\nCustomer: The small one, please. Is insurance included?\nClerk: Basic insurance is included, but full insurance is thirty riyals extra per day.\nCustomer: I'll take the basic one.\nClerk: Then please show me your driving licence and leave a deposit of five hundred riyals, which we return when you bring the car back.";

const trip =
  "Principal: Good morning, students. The class trip to the science museum will take place on Wednesday the fifth. The buses will leave the school at eight, not eight-thirty as announced earlier, because the museum opens at nine-thirty and the journey takes one hour. Please bring a packed lunch, since the museum café is closed for repairs. Parents must sign the permission form by Monday, and students without a form cannot join the trip.";

const restaurant =
  "Host: Good evening, Olive Garden restaurant.\nCaller: Hello, I'd like to book a table for six on Friday evening.\nHost: What time would you like?\nCaller: Around eight o'clock.\nHost: I'm sorry, we're fully booked at eight, but we have a table at seven or at nine.\nCaller: Seven is too early for my guests. Nine, then.\nHost: Certainly. May I have a name?\nCaller: Al-Harbi. And please, we need one high chair for a baby.\nHost: No problem.";

const tutor =
  "Tutor: Your essay is well organised, Omar, but you have a problem with tenses.\nOmar: Which part?\nTutor: In the second paragraph you describe last summer, yet you switch to the present tense.\nOmar: Oh, I see. Should I rewrite the whole essay?\nTutor: No, just correct the verbs and add a conclusion.\nOmar: How many words should the conclusion be?\nTutor: About fifty. Bring it back on Sunday and we'll check it together.";

const glaciers =
  "Professor: Glaciers are huge rivers of ice that move very slowly down valleys. They form where more snow falls in winter than melts in summer. Over many years, the snow is squeezed into ice. As a glacier moves, it carves valleys and carries rocks, leaving behind features that geologists can still see after the ice has gone. Today, about ten percent of the world's land is covered by glacial ice, mostly in Antarctica and Greenland.\nStudent: Are glaciers shrinking?\nProfessor: Many are, because of rising temperatures. Melting ice adds water to the oceans, which is one reason sea levels are rising.";

const taif =
  "Hamad: Are we still going to Taif on Thursday?\nYazeed: I'm afraid not. My father needs the car on Thursday, so I suggested Friday.\nHamad: Friday is fine, but the roads will be crowded in the morning.\nYazeed: Then let's leave after the noon prayer, at about one. We can have dinner there.\nHamad: Good. How many of us are going?\nYazeed: I thought five, but Khalid can't come, so we'll be four.\nHamad: Then one car is enough. I'll pay for the fuel.";

const LC = "listening-comprehension";
const LI = "listening-inference";

const specs: QuestionSpec[] = [
  { id: "sm5-listening-1", transcript: flat, prompt: "What is included in the rent?", correct: "Water", wrong: ["Electricity", "Furniture", "Parking"], why: "The rent includes water but not electricity.", level: "easy", tags: [LC] },
  { id: "sm5-listening-2", transcript: flat, prompt: "What furniture does the flat have?", correct: "A fridge and a cooker", wrong: ["Beds and wardrobes", "A sofa and a table", "No furniture at all"], why: "The kitchen has a fridge and a cooker, but the bedrooms are empty.", level: "medium", tags: [LC] },
  { id: "sm5-listening-3", transcript: flat, prompt: "When will the caller see the flat?", correct: "On Thursday after two", wrong: ["On Saturday morning", "On Thursday morning", "This evening"], why: "The owner is free on Thursday after two o'clock, and the caller chooses Thursday.", level: "medium", tags: [LC] },

  { id: "sm5-listening-4", transcript: sleep, prompt: "What is the lecture mainly about?", correct: "The stages of sleep", wrong: ["How to cure dreams", "Why people snore", "How the heart works"], why: "The lecturer describes the stages of sleep and the sleep cycle.", level: "easy", tags: [LC] },
  { id: "sm5-listening-5", transcript: sleep, prompt: "When does the body repair its muscles?", correct: "During deep sleep", wrong: ["During REM sleep", "During light sleep", "While awake"], why: "Deep sleep is when the body repairs muscles and strengthens the immune system.", level: "medium", tags: [LC] },
  { id: "sm5-listening-6", transcript: sleep, prompt: "What does the lecturer say about teenagers?", correct: "They need eight to ten hours but often sleep less.", wrong: ["They need only five hours of sleep at night.", "They sleep much more than adults do.", "They never dream during the night."], why: "Teenagers need between eight and ten hours, but many get far less.", level: "medium", tags: [LC] },

  { id: "sm5-listening-7", transcript: car, prompt: "How much is a small car per day?", correct: "120 riyals", wrong: ["180 riyals", "150 riyals", "30 riyals"], why: "A small car costs one hundred and twenty riyals a day.", level: "easy", tags: [LC] },
  { id: "sm5-listening-8", transcript: car, prompt: "What must the customer give the clerk?", correct: "His licence and a deposit", wrong: ["His passport and a photograph", "Payment for full insurance", "A letter from his employer"], why: "The clerk asks for his driving licence and a deposit of five hundred riyals.", level: "medium", tags: [LC] },

  { id: "sm5-listening-9", transcript: trip, prompt: "What time will the buses leave?", correct: "At eight", wrong: ["At eight-thirty", "At nine", "At nine-thirty"], why: "The buses leave at eight, not eight-thirty as announced earlier.", level: "medium", tags: [LC] },
  { id: "sm5-listening-10", transcript: trip, prompt: "Why should students bring a packed lunch?", correct: "The museum café is closed.", wrong: ["Lunch is too expensive.", "The trip lasts all week.", "The buses have no seats."], why: "The museum café is closed for repairs.", level: "easy", tags: [LC] },

  { id: "sm5-listening-11", transcript: restaurant, prompt: "Why can't the caller have a table at eight?", correct: "The restaurant is fully booked.", wrong: ["The restaurant is closed.", "There is no table for six.", "It is too noisy."], why: "The host says they are fully booked at eight.", level: "easy", tags: [LC] },
  { id: "sm5-listening-12", transcript: restaurant, prompt: "What does the caller ask for?", correct: "A high chair for a baby", wrong: ["A cake for a birthday", "A table in a quiet corner", "A special menu for guests"], why: "He says they need one high chair for a baby.", level: "medium", tags: [LC] },

  { id: "sm5-listening-13", transcript: tutor, prompt: "What is the main problem in Omar's essay?", correct: "Mixed verb tenses", wrong: ["Poor organisation", "Spelling mistakes", "It is too short"], why: "He describes last summer but switches to the present tense.", level: "easy", tags: [LC] },
  { id: "sm5-listening-14", transcript: tutor, prompt: "What must Omar add?", correct: "A conclusion of about fifty words", wrong: ["A new title for the essay", "Two more paragraphs about summer", "A list of references at the end"], why: "The tutor asks him to correct the verbs and add a conclusion of about fifty words.", level: "medium", tags: [LC] },

  { id: "sm5-listening-15", transcript: glaciers, prompt: "How do glaciers form?", correct: "More snow falls than melts.", wrong: ["Rivers freeze in winter.", "Rain turns to ice at night.", "Mountains push up ice."], why: "They form where more snow falls in winter than melts in summer.", level: "medium", tags: [LC] },
  { id: "sm5-listening-16", transcript: glaciers, prompt: "Where is most glacial ice found?", correct: "In Antarctica and Greenland", wrong: ["In Africa and South America", "In the Arabian Peninsula", "In Europe and North America only"], why: "Glacial ice is mostly in Antarctica and Greenland.", level: "easy", tags: [LC] },
  { id: "sm5-listening-17", transcript: glaciers, prompt: "What does the professor imply about melting glaciers?", correct: "They contribute to rising sea levels.", wrong: ["They make oceans colder.", "They create new deserts.", "They have no effect on the oceans."], why: "Melting ice adds water to the oceans, which is one reason sea levels are rising.", level: "hard", tags: [LC, LI] },

  { id: "sm5-listening-18", transcript: taif, prompt: "Why was the trip moved from Thursday?", correct: "Yazeed's father needs the car.", wrong: ["It will rain on Thursday.", "Hamad is working.", "The roads are closed."], why: "Yazeed's father needs the car on Thursday.", level: "easy", tags: [LC] },
  { id: "sm5-listening-19", transcript: taif, prompt: "What time will they leave?", correct: "At about one o'clock", wrong: ["In the early morning", "At about noon", "At about five"], why: "They will leave after the noon prayer, at about one.", level: "medium", tags: [LC] },
  { id: "sm5-listening-20", transcript: taif, prompt: "How many people will go?", correct: "Four", wrong: ["Three", "Five", "Six"], why: "Yazeed first thought five, but Khalid cannot come, so they will be four.", level: "hard", tags: [LC, LI] },
];

export const STEP_MOCK_5_LISTENING_QUESTIONS = buildQuestions("listening", "step-mock-5", specs);
