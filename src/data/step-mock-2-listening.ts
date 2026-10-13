import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/**
 * Mock exam 2 - LISTENING: 8 original clips (dialogues and mini-lectures),
 * 20 questions. Scripts are played as audio; the transcript doubles as the
 * fallback text until recorded audio is uploaded. Each clip mixes detail,
 * inference and "changed information" items, like the real test.
 */

const registration =
  "Clerk: Good morning. How can I help you?\nStudent: Hi. I'd like to register for the evening English course that starts next month.\nClerk: Of course. The course meets on Sundays and Tuesdays from six to eight. The registration fee is four hundred and fifty riyals.\nStudent: Is it possible to pay in two parts?\nClerk: Yes, you can pay half now and half before the third week. But registration closes this Thursday, so please don't wait too long.\nStudent: That's fine. Do I need to bring anything?\nClerk: A copy of your ID and one passport-size photo. You can email the ID copy if you prefer.\nStudent: Great. I'll come back tomorrow with the photo and pay the first half then.\nClerk: Perfect. See you tomorrow.";

const volcano =
  "Lecturer: Today we will look at how volcanoes form. A volcano is an opening in the Earth's crust through which hot melted rock, called magma, escapes to the surface. Most volcanoes are found where two of the Earth's plates meet. The best-known example is the so-called Ring of Fire around the Pacific Ocean, which contains about three quarters of the world's active volcanoes.\nStudent: Does that mean volcanoes are always dangerous?\nLecturer: Not necessarily. Some erupt gently, and the lava simply flows down the slopes. The dangerous ones are those where gas is trapped inside the magma, because the pressure builds until the volcano explodes. Interestingly, volcanic soil is very rich, which is why many farmers choose to live near them despite the risk.";

const dentist =
  "Receptionist: Dr. Hassan's clinic, how can I help?\nCaller: Hello, this is Khalid Omar. I have an appointment on Monday at ten, but I'm afraid I have to change it. My brother is getting married and I'll be travelling.\nReceptionist: I see. Congratulations! Would Wednesday at half past four work?\nCaller: Wednesday is fine, but I finish work at four and the clinic is far from my office. Could we make it five o'clock?\nReceptionist: Let me check... yes, five o'clock is free on Wednesday.\nCaller: Perfect. Thank you.\nReceptionist: I'll send you a text message to confirm.";

const project =
  "Sara: Have you finished your part of the presentation, Noura?\nNoura: Almost. I've done the slides about the history, but I still need the pictures.\nSara: I can find those. I'm good at searching online. What about the graphs?\nNoura: Hanan said she would make them, but she has been ill all week.\nSara: Oh no. Then I'll do the graphs too, and you can practise the speech. We present on Tuesday, so we have four days.\nNoura: That would be a huge help. Thanks, Sara.";

const airport =
  "Announcement: Attention please, passengers travelling to Cairo on flight two-one-eight. Due to a technical check, your flight is now delayed by forty minutes. The original departure time was ten thirty, so the new departure time is ten past eleven. Please note that the gate has also changed from gate twelve to gate twenty. Passengers who would like a meal may collect a free voucher from the information desk near gate fifteen. We apologise for the inconvenience.";

const library =
  "Librarian: Welcome to the university library. You can borrow up to five books at a time for two weeks. If you need more time, you can renew them once online, unless someone else has reserved them. Late books cost one riyal per day.\nStudent: What about reference books, like dictionaries?\nLibrarian: Those can't leave the library, but you can photocopy a few pages.\nStudent: And the quiet study rooms?\nLibrarian: They must be booked in advance at the desk, and you can use a room for a maximum of two hours.";

const coffee =
  "Professor: Today I'd like to talk about coffee. According to legend, coffee was discovered in Ethiopia, when a goat herder noticed that his goats became very energetic after eating the berries of a certain bush. By the fifteenth century coffee was being grown in Yemen, and from there it spread through the Arabian Peninsula to Cairo, Istanbul and eventually Europe. In Makkah and other cities, coffee houses became popular meeting places where people discussed the news and played chess. Some rulers were suspicious of these houses, fearing that people would talk about politics, and they tried to ban them. Of course, the bans did not last, because coffee was simply too popular.";

const camping =
  "Ali: So, are we all going to the desert camp on Friday?\nFaisal: Yes, but I checked the forecast, and it will be very windy, so I think Saturday is better.\nAli: Saturday? I can't, I have football training in the afternoon.\nFaisal: Training starts at four, right? We can leave in the morning and be back by three.\nAli: Hmm, that's tight, but all right. Who's bringing the tent?\nFaisal: My uncle has a big one, and he said we can borrow it. You bring the food, and Majed will bring the stove.\nAli: Okay. I'll buy sandwiches and fruit.\nFaisal: And don't forget water!\nAli: Of course.";

const LC = "listening-comprehension";
const LI = "listening-inference";

const specs: QuestionSpec[] = [
  // Clip 1: registration
  { id: "sm2-listening-1", transcript: registration, prompt: "On which days does the course meet?", correct: "Sundays and Tuesdays", wrong: ["Mondays and Wednesdays", "Thursdays and Fridays", "Every weekday"], why: "The clerk says the course meets on Sundays and Tuesdays from six to eight.", level: "easy", tags: [LC] },
  { id: "sm2-listening-2", transcript: registration, prompt: "When does registration close?", correct: "This Thursday", wrong: ["Tomorrow", "Next month", "Before the third week"], why: "The clerk warns that registration closes this Thursday.", level: "easy", tags: [LC] },
  { id: "sm2-listening-3", transcript: registration, prompt: "What will the student probably do tomorrow?", correct: "Bring a photo and pay half of the fee", wrong: ["Email a copy of his ID to the office only", "Pay the full fee online before the class", "Attend the first class and pay later"], why: "He says he will return tomorrow with the photo and pay the first half.", level: "medium", tags: [LC, LI] },

  // Clip 2: volcano lecture
  { id: "sm2-listening-4", transcript: volcano, prompt: "What is the main topic of the lecture?", correct: "How and where volcanoes form", wrong: ["The history of the Pacific Ocean", "How farmers choose their land", "How to predict eruptions"], why: "The lecturer opens with how volcanoes form and where they are found.", level: "easy", tags: [LC] },
  { id: "sm2-listening-5", transcript: volcano, prompt: "What makes some volcanoes explode?", correct: "Trapped gas that raises the pressure", wrong: ["Heavy rain that falls on the slopes", "Very cold lava that flows too slowly", "Fast-moving plates beneath the ocean"], why: "Dangerous volcanoes trap gas in the magma, and the pressure builds until they explode.", level: "medium", tags: [LC] },
  { id: "sm2-listening-6", transcript: volcano, prompt: "Why do some farmers live near volcanoes?", correct: "The soil is very rich.", wrong: ["Eruptions are easy to predict.", "The land is cheap.", "The air is cleaner."], why: "The lecturer says volcanic soil is very rich, which is why farmers live nearby despite the risk.", level: "medium", tags: [LC, LI] },

  // Clip 3: dentist
  { id: "sm2-listening-7", transcript: dentist, prompt: "Why does the caller want to change his appointment?", correct: "He will travel for his brother's wedding.", wrong: ["He is feeling much better and does not need it.", "He has an important meeting at his work.", "The clinic is closed on Monday morning."], why: "He says his brother is getting married and he will be travelling.", level: "easy", tags: [LC] },
  { id: "sm2-listening-8", transcript: dentist, prompt: "What is the new appointment time?", correct: "Wednesday at five", wrong: ["Monday at ten", "Wednesday at half past four", "Wednesday at four"], why: "The receptionist first offers half past four, but the caller asks for five and she confirms it.", level: "medium", tags: [LC] },

  // Clip 4: project
  { id: "sm2-listening-9", transcript: project, prompt: "What has Noura already finished?", correct: "The slides about the history", wrong: ["The graphs about the results", "The pictures for the last slides", "The speech for the presentation"], why: "Noura says she has done the slides about the history but still needs the pictures.", level: "easy", tags: [LC] },
  { id: "sm2-listening-10", transcript: project, prompt: "What will Sara do?", correct: "Find the pictures and make the graphs", wrong: ["Practise the whole speech again", "Present on Tuesday alone", "Visit Hanan to ask for help"], why: "Sara offers to find the pictures and then takes over the graphs too.", level: "medium", tags: [LC] },

  // Clip 5: airport
  { id: "sm2-listening-11", transcript: airport, prompt: "What is the new departure time?", correct: "11:10", wrong: ["10:30", "11:00", "11:40"], why: "The flight was due at 10:30 and is delayed by forty minutes, so it leaves at ten past eleven.", level: "medium", tags: [LC] },
  { id: "sm2-listening-12", transcript: airport, prompt: "How can passengers get a free meal voucher?", correct: "Go to the information desk near gate fifteen", wrong: ["Show their tickets at the desk by gate twenty", "Call the airline from the departure hall", "Wait at gate twelve for an announcement"], why: "The announcement says vouchers are available from the information desk near gate fifteen.", level: "easy", tags: [LC] },

  // Clip 6: library
  { id: "sm2-listening-13", transcript: library, prompt: "What is the rule about reference books?", correct: "They cannot be taken out of the library.", wrong: ["They can be borrowed for two weeks.", "They cost one riyal per day.", "They must be booked in advance."], why: "The librarian says reference books can't leave the library, though pages can be photocopied.", level: "easy", tags: [LC] },
  { id: "sm2-listening-14", transcript: library, prompt: "How long can a student use a study room?", correct: "Two hours", wrong: ["Two weeks", "One hour", "As long as he likes"], why: "A room can be used for a maximum of two hours.", level: "easy", tags: [LC] },

  // Clip 7: coffee lecture
  { id: "sm2-listening-15", transcript: coffee, prompt: "According to the legend, how was coffee discovered?", correct: "A herder noticed his goats' energy after they ate berries.", wrong: ["Monks tested it as a medicine for tired travellers.", "Travellers found it growing wild in Yemen.", "A king ordered his servants to search for it."], why: "The legend says a goat herder noticed that his goats became energetic after eating the berries.", level: "medium", tags: [LC] },
  { id: "sm2-listening-16", transcript: coffee, prompt: "Why did some rulers dislike coffee houses?", correct: "They feared people would discuss politics.", wrong: ["The houses were too noisy for the neighbours.", "Coffee was far too expensive for most people.", "Playing chess in the houses was forbidden."], why: "Some rulers were suspicious, fearing that people would talk about politics.", level: "medium", tags: [LC] },
  { id: "sm2-listening-17", transcript: coffee, prompt: "What does the professor imply about the bans?", correct: "They failed because people loved coffee.", wrong: ["They were completely successful.", "They were never announced.", "They applied only in Europe."], why: "He says the bans did not last because coffee was too popular.", level: "hard", tags: [LC, LI] },

  // Clip 8: camping plans
  { id: "sm2-listening-18", transcript: camping, prompt: "When will the friends go to the camp?", correct: "On Saturday morning", wrong: ["On Friday", "On Saturday evening", "On Sunday"], why: "Faisal moves the trip from Friday to Saturday because of wind and suggests leaving in the morning.", level: "medium", tags: [LC] },
  { id: "sm2-listening-19", transcript: camping, prompt: "Why does Faisal suggest leaving early?", correct: "So Ali can be back for training", wrong: ["To avoid the heat", "Because the tent must be returned", "Because the stove is needed at noon"], why: "Training starts at four, so they should be back by three.", level: "medium", tags: [LC, LI] },
  { id: "sm2-listening-20", transcript: camping, prompt: "Who will bring the stove?", correct: "Majed", wrong: ["Ali", "Faisal", "Faisal's uncle"], why: "Faisal says Majed will bring the stove.", level: "hard", tags: [LC] },
];

export const STEP_MOCK_2_LISTENING_QUESTIONS = buildQuestions("listening", "step-mock-2", specs);
