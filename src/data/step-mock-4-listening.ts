import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/**
 * Mock exam 4 - LISTENING: 8 original clips, 20 questions. The transcript is
 * the audio script and the fallback text until recorded audio is uploaded.
 */

const club =
  "Student: Hi, I'd like to join the photography club.\nOrganiser: Great! We meet every Wednesday at five in Room 204, and the membership fee is sixty riyals for the whole year.\nStudent: Do I need my own camera?\nOrganiser: Not at the beginning. The club has six cameras that members can borrow, but you must return them the same day.\nStudent: And when is the first trip?\nOrganiser: We're planning a visit to the old town next month, on the second Saturday.\nStudent: Perfect. Where do I pay?\nOrganiser: At the student services office, and bring the receipt to the next meeting.";

const photosynthesis =
  "Lecturer: Plants make their own food through a process called photosynthesis. Their leaves contain a green substance called chlorophyll, which absorbs sunlight. Using this energy, the plant combines water from the soil with carbon dioxide from the air to make sugar. As a by-product, it releases oxygen, which animals and humans breathe.\nStudent: So do plants stop working at night?\nLecturer: Photosynthesis needs light, so it slows down in the dark. That's why plants in a very dim room grow slowly and look weak. Remember: no light, no sugar.";

const bank =
  "Clerk: Welcome to National Bank. How can I help?\nCustomer: I'd like to open a savings account.\nClerk: Of course. Do you have your ID and a proof of address?\nCustomer: I have my ID, but my address document is at home.\nClerk: Then you can open the account today, and bring the document within seven days. The minimum opening deposit is five hundred riyals.\nCustomer: That's fine. Will I get a card?\nClerk: A debit card will be sent to your home in about a week.";

const tour =
  "Agent: Desert Tours, good morning.\nCaller: Hi, I booked the Friday morning tour to the red dunes, but I'd like to change it.\nAgent: What day suits you?\nCaller: Saturday, if possible, because my cousins are arriving on Friday night.\nAgent: The Saturday tour is full in the morning, but there's one at three in the afternoon.\nCaller: In the afternoon is better, actually, because it's cooler.\nAgent: Great, I've moved your booking. The price stays the same, one hundred and fifty riyals per person.";

const station =
  "Announcement: May I have your attention please. The ten-fifteen bus to Abha has been cancelled because of a mechanical problem. Passengers holding tickets for this bus can use the eleven o'clock service from the same bay, or ask for a full refund at the ticket office. Please remember that the eleven o'clock bus is already half full, so we recommend choosing your seat quickly.";

const doctor =
  "Doctor: Come in. What seems to be the problem?\nPatient: I've had a sore throat and a cough for three days, and last night I had a fever.\nDoctor: Let me check... Your throat is red, but your chest sounds clear. I think it's a virus, so antibiotics won't help. Drink plenty of water, rest, and take these tablets twice a day after meals.\nPatient: Should I go to work tomorrow?\nDoctor: I'd stay at home for two days. If the fever returns, come back immediately.";

const industrial =
  "Professor: The Industrial Revolution began in Britain in the late eighteenth century. Before it, most goods were made by hand in homes and small workshops. The invention of the steam engine changed everything, because factories could now be built anywhere, not only beside fast rivers. Cities grew rapidly as people left farms to find work. However, life in the new factories was hard: workers, including children, often laboured for twelve hours a day for low pay. Over time, new laws limited working hours and improved safety.\nStudent: Did the revolution spread beyond Britain?\nProfessor: Yes, within a century it reached Europe and North America.";

const study =
  "Nada: So we're meeting at the library on Monday to revise for the chemistry test?\nSalma: Actually, Monday won't work, because the library closes early for maintenance. How about Tuesday at four?\nNada: Tuesday is perfect for me. Should we study the whole book?\nSalma: No, the teacher said the test covers only chapters five to eight.\nNada: Great, that's much easier. I'll bring my notes.\nSalma: And I'll bring snacks, but please remind Laila, because she often forgets.";

const LC = "listening-comprehension";
const LI = "listening-inference";

const specs: QuestionSpec[] = [
  { id: "sm4-listening-1", transcript: club, prompt: "When does the club meet?", correct: "Every Wednesday at five", wrong: ["Every Saturday at five", "Every Tuesday at six", "Once a month"], why: "The organiser says they meet every Wednesday at five in Room 204.", level: "easy", tags: [LC] },
  { id: "sm4-listening-2", transcript: club, prompt: "What is the rule about the club's cameras?", correct: "Members must return them the same day.", wrong: ["Members can keep them for a week.", "Only teachers may use them.", "They are free to buy."], why: "Members can borrow the cameras but must return them the same day.", level: "medium", tags: [LC] },
  { id: "sm4-listening-3", transcript: club, prompt: "What must the student do after paying?", correct: "Bring the receipt to the next meeting", wrong: ["Choose a camera from the club", "Email the organiser about the trip", "Book a seat on the bus for the trip"], why: "The organiser says to bring the receipt to the next meeting.", level: "medium", tags: [LC] },

  { id: "sm4-listening-4", transcript: photosynthesis, prompt: "What is the lecture mainly about?", correct: "How plants make food", wrong: ["How animals breathe", "Why leaves fall in autumn", "How soil is formed"], why: "The lecturer explains photosynthesis, the way plants make food.", level: "easy", tags: [LC] },
  { id: "sm4-listening-5", transcript: photosynthesis, prompt: "What does chlorophyll do?", correct: "It absorbs sunlight.", wrong: ["It carries water to the roots.", "It releases carbon dioxide.", "It protects the plant from insects."], why: "Chlorophyll is the green substance that absorbs sunlight.", level: "medium", tags: [LC] },
  { id: "sm4-listening-6", transcript: photosynthesis, prompt: "What can be inferred about plants in a dim room?", correct: "They grow slowly because they get little light.", wrong: ["They grow faster than normal in the shade.", "They no longer need water or food.", "They produce more oxygen than in bright light."], why: "Photosynthesis slows without light, so such plants grow slowly and look weak.", level: "medium", tags: [LC, LI] },

  { id: "sm4-listening-7", transcript: bank, prompt: "What does the customer not have with him?", correct: "A proof of address", wrong: ["His ID card", "Enough money", "His phone number"], why: "He has his ID, but his address document is at home.", level: "easy", tags: [LC] },
  { id: "sm4-listening-8", transcript: bank, prompt: "How will the customer receive his card?", correct: "It will be sent to his home.", wrong: ["He will collect it today.", "It will be emailed.", "A friend will bring it."], why: "A debit card will be sent to his home in about a week.", level: "medium", tags: [LC] },

  { id: "sm4-listening-9", transcript: tour, prompt: "Why does the caller want to change the day?", correct: "His cousins are arriving on Friday night.", wrong: ["The tour is too expensive for his family.", "He is ill and cannot travel.", "The dunes are closed on that day."], why: "He says his cousins arrive on Friday night.", level: "easy", tags: [LC] },
  { id: "sm4-listening-10", transcript: tour, prompt: "What is the new tour time?", correct: "Saturday at three in the afternoon", wrong: ["Friday morning as booked before", "Saturday morning, as he asked first", "Friday at three in the afternoon"], why: "The Saturday morning tour is full, so the booking is moved to three in the afternoon.", level: "medium", tags: [LC] },

  { id: "sm4-listening-11", transcript: station, prompt: "Why was the bus cancelled?", correct: "There was a mechanical problem.", wrong: ["The weather was bad.", "The driver was ill.", "There were too few passengers."], why: "The announcement gives a mechanical problem as the reason.", level: "easy", tags: [LC] },
  { id: "sm4-listening-12", transcript: station, prompt: "What can passengers do?", correct: "Take the eleven o'clock bus or get a refund", wrong: ["Wait for the ten-fifteen bus to be repaired", "Take a taxi to Abha for free", "Exchange the ticket for a hotel room"], why: "They can use the eleven o'clock service or ask for a full refund.", level: "medium", tags: [LC] },

  { id: "sm4-listening-13", transcript: doctor, prompt: "What does the doctor think is wrong?", correct: "A viral infection", wrong: ["A chest infection", "An allergy", "A broken tooth"], why: "He says it is a virus and that the chest sounds clear.", level: "easy", tags: [LC] },
  { id: "sm4-listening-14", transcript: doctor, prompt: "What must the patient do if the fever returns?", correct: "Come back to the doctor immediately", wrong: ["Take antibiotics for three days", "Go to work as normal", "Stop taking the tablets at once"], why: "The doctor says to come back immediately if the fever returns.", level: "medium", tags: [LC] },

  { id: "sm4-listening-15", transcript: industrial, prompt: "Where did the Industrial Revolution begin?", correct: "In Britain", wrong: ["In North America", "In France", "In Germany"], why: "The professor says it began in Britain.", level: "easy", tags: [LC] },
  { id: "sm4-listening-16", transcript: industrial, prompt: "Why did the steam engine change factories?", correct: "Factories no longer needed to be beside rivers.", wrong: ["Factories became smaller than workshops.", "Workers no longer needed to be paid.", "Goods could be made by hand."], why: "Factories could be built anywhere, not only beside fast rivers.", level: "medium", tags: [LC] },
  { id: "sm4-listening-17", transcript: industrial, prompt: "What does the professor imply about early factory work?", correct: "It was hard and poorly paid.", wrong: ["It was easy and well paid.", "It was done only by adults.", "It was safe from the start."], why: "Workers, including children, laboured twelve hours a day for low pay.", level: "hard", tags: [LC, LI] },

  { id: "sm4-listening-18", transcript: study, prompt: "When will they meet?", correct: "On Tuesday at four", wrong: ["On Monday at four", "On Tuesday at five", "On Wednesday"], why: "Monday is not possible, so Salma suggests Tuesday at four and Nada agrees.", level: "medium", tags: [LC] },
  { id: "sm4-listening-19", transcript: study, prompt: "Why can't they meet on Monday?", correct: "The library closes early.", wrong: ["Nada has a test.", "Salma is travelling.", "The teacher is absent."], why: "The library closes early for maintenance on Monday.", level: "easy", tags: [LC] },
  { id: "sm4-listening-20", transcript: study, prompt: "Which chapters are in the test?", correct: "Chapters five to eight", wrong: ["Chapters one to four", "Chapters five to ten", "The whole book"], why: "The teacher said the test covers only chapters five to eight.", level: "hard", tags: [LC] },
];

export const STEP_MOCK_4_LISTENING_QUESTIONS = buildQuestions("listening", "step-mock-4", specs);
