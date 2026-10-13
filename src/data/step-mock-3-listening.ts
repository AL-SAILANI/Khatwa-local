import { buildQuestions, type QuestionSpec } from "@/data/question-builder";

/**
 * Mock exam 3 - LISTENING: 8 original clips (conversations, an announcement
 * and two mini-lectures), 20 questions. The transcript is the audio script and
 * the fallback text until recorded audio is uploaded.
 */

const bookshop =
  "Customer: Excuse me, I'm looking for a book called The Desert Stars.\nAssistant: Let me check the computer... I'm sorry, we sold the last copy yesterday, but we can order it for you. It would arrive in about five days.\nCustomer: That's a bit long. Is there an electronic version?\nAssistant: Yes, the e-book costs twenty-eight riyals, while the printed book costs forty-five.\nCustomer: Then I'll buy the printed one, because I want to give it to my cousin as a birthday present. Her birthday is in ten days, so five days is fine.\nAssistant: Wonderful. Could I have your phone number? We'll call you when it arrives.";

const telephone =
  "Lecturer: In today's lecture we will look at how the telephone changed communication. In 1876, Alexander Graham Bell received the first patent for a working telephone. At first, only wealthy families and big businesses could afford one, and every call had to be connected by an operator who plugged wires into a board. By the 1960s, automatic exchanges allowed people to dial numbers themselves, and the number of telephones grew rapidly. The next revolution came with mobile phones in the 1980s. The first ones were as heavy as a bag of sugar and could talk for only half an hour.\nStudent: And when did smartphones appear?\nLecturer: The first true smartphones appeared in the 2000s, and they combined a phone, a camera and a computer in one small device.";

const advisor =
  "Student: Good morning. I'd like to talk about changing my major from biology to computer science.\nAdvisor: That's a big decision. Why do you want to change?\nStudent: I enjoy programming much more, and I've already taken two introductory courses online.\nAdvisor: I see. The problem is that the change must be requested before the end of this month, and you'll need a minimum grade of B in the introductory programming course here.\nStudent: I got a B-plus last semester.\nAdvisor: Then you qualify. Please fill in this form and bring it back with your transcript on Wednesday.";

const hotel =
  "Receptionist: Good afternoon, Palm Hotel.\nCaller: Hello. I'd like to book a double room for three nights, starting on the twelfth of March.\nReceptionist: I'm sorry, the double rooms are full on the twelfth. We have a twin room available, or we could offer a double from the thirteenth.\nCaller: I'll take the twin room for the first night and then change to a double. Is breakfast included?\nReceptionist: Yes, breakfast is included, but parking costs fifteen riyals a day.\nCaller: That's fine.";

const weather =
  "Presenter: And now the weather. Tomorrow morning will start sunny across the central region, with temperatures around twenty-two degrees. By the afternoon, clouds will gather in the west, and there is a strong chance of heavy rain in the mountains from four o'clock. Drivers are advised to avoid the valley roads in the evening because of the risk of floods. On Friday, the weather will become dry and warm again.";

const gym =
  "Member: Hi, I'd like some information about memberships.\nStaff: Sure. We have a monthly plan for two hundred riyals, or an annual plan for eighteen hundred.\nMember: That's quite a difference. How much would I save on the annual plan?\nStaff: Twelve months at two hundred would be twenty-four hundred, so you save six hundred riyals.\nMember: I'm only sure about staying for six months.\nStaff: Then the monthly plan is safer. If you pay month by month, you can stop at any time.\nMember: OK, I'll start with that and decide later.";

const bats =
  "Professor: Bats are the only mammals that can truly fly, and many of them hunt at night. Because it is too dark to see well, they use a system called echolocation. A bat sends out high-pitched sounds that humans cannot hear. When the sound hits an object, such as an insect, it bounces back as an echo, and the bat's brain measures how long the echo took to return. This tells the bat how far away the object is. Some bats can catch hundreds of mosquitoes in a single hour.\nStudent: Are bats dangerous to people?\nProfessor: Very rarely. Most bats are harmless and even helpful, because they control insects and some species pollinate flowers.";

const party =
  "Huda: We're planning the surprise party for Mona on Thursday, right?\nReem: Actually, I changed it to Friday, because her brother can only come after work on Friday.\nHuda: Oh, good idea. And the place?\nReem: We were going to use my house, but my mother has guests, so let's use Lama's garden instead.\nHuda: Lovely. I'll bring the cake.\nReem: Please don't bring chocolate. Mona is allergic to nuts, and most chocolate cakes in the shops contain them.\nHuda: Then I'll make a vanilla cake myself.\nReem: Perfect. And we should invite everyone for seven o'clock but tell Mona to come at eight.";

const LC = "listening-comprehension";
const LI = "listening-inference";

const specs: QuestionSpec[] = [
  { id: "sm3-listening-1", transcript: bookshop, prompt: "Why can't the assistant sell the book immediately?", correct: "The last copy was sold yesterday.", wrong: ["The book is not published yet.", "The computer is broken.", "The book is too expensive."], why: "The assistant says they sold the last copy yesterday.", level: "easy", tags: [LC] },
  { id: "sm3-listening-2", transcript: bookshop, prompt: "How much does the printed book cost?", correct: "45 riyals", wrong: ["28 riyals", "35 riyals", "48 riyals"], why: "The e-book is twenty-eight riyals and the printed book forty-five.", level: "medium", tags: [LC] },
  { id: "sm3-listening-3", transcript: bookshop, prompt: "Why does the customer decide to wait for the printed book?", correct: "It is a birthday present and the date is ten days away.", wrong: ["The e-book is not available.", "He wants a cheaper price.", "He will be travelling for five days."], why: "He wants it as a birthday present, and since her birthday is in ten days, five days is fine.", level: "medium", tags: [LC, LI] },

  { id: "sm3-listening-4", transcript: telephone, prompt: "What is the lecture mainly about?", correct: "How the telephone developed over time", wrong: ["Who invented the camera", "How operators are trained", "Why mobile phones are heavy"], why: "The lecturer follows the telephone from 1876 to smartphones.", level: "easy", tags: [LC] },
  { id: "sm3-listening-5", transcript: telephone, prompt: "How were calls connected at first?", correct: "By an operator using wires", wrong: ["By dialling numbers", "By satellite", "By computer"], why: "Every call was connected by an operator who plugged wires into a board.", level: "easy", tags: [LC] },
  { id: "sm3-listening-6", transcript: telephone, prompt: "What can be inferred about the first mobile phones?", correct: "They were large and could not talk for long.", wrong: ["They were cheap and light.", "They included cameras.", "They worked for many hours."], why: "They were as heavy as a bag of sugar and could talk for only half an hour.", level: "medium", tags: [LC, LI] },

  { id: "sm3-listening-7", transcript: advisor, prompt: "What does the student want to do?", correct: "Change his major to computer science", wrong: ["Leave the university", "Take an online course only", "Move to a different university"], why: "He wants to change his major from biology to computer science.", level: "easy", tags: [LC] },
  { id: "sm3-listening-8", transcript: advisor, prompt: "What must the student bring on Wednesday?", correct: "The form and his transcript", wrong: ["A letter from a teacher", "The online course certificate", "Payment for the course"], why: "The advisor asks him to fill in the form and bring it back with his transcript on Wednesday.", level: "medium", tags: [LC] },

  { id: "sm3-listening-9", transcript: hotel, prompt: "Why can't the caller have a double room on the twelfth?", correct: "All the double rooms are full.", wrong: ["The hotel is closed.", "The price is too high.", "He asked for too many nights."], why: "The receptionist says the double rooms are full on the twelfth.", level: "easy", tags: [LC] },
  { id: "sm3-listening-10", transcript: hotel, prompt: "What will the caller pay extra for?", correct: "Parking", wrong: ["Breakfast", "The twin room", "A late check-out"], why: "Breakfast is included, but parking costs fifteen riyals a day.", level: "medium", tags: [LC] },

  { id: "sm3-listening-11", transcript: weather, prompt: "When is rain expected in the mountains?", correct: "From four o'clock in the afternoon", wrong: ["In the morning", "On Friday", "At midnight"], why: "Heavy rain is likely in the mountains from four o'clock.", level: "medium", tags: [LC] },
  { id: "sm3-listening-12", transcript: weather, prompt: "What are drivers advised to do?", correct: "Avoid the valley roads in the evening", wrong: ["Stay at home on Friday", "Drive faster in the west", "Travel to the mountains early"], why: "They should avoid the valley roads in the evening because of the risk of floods.", level: "easy", tags: [LC] },

  { id: "sm3-listening-13", transcript: gym, prompt: "How much would the member save with the annual plan?", correct: "600 riyals", wrong: ["200 riyals", "1,800 riyals", "2,400 riyals"], why: "Twelve months at 200 riyals is 2,400, so the annual plan at 1,800 saves 600.", level: "medium", tags: [LC] },
  { id: "sm3-listening-14", transcript: gym, prompt: "Why does the member choose the monthly plan?", correct: "He is not sure he will stay for a year.", wrong: ["It is cheaper in total.", "The gym is closed in summer.", "He wants a free trial."], why: "He is only sure about six months, and the monthly plan lets him stop at any time.", level: "medium", tags: [LC, LI] },

  { id: "sm3-listening-15", transcript: bats, prompt: "What is echolocation?", correct: "Finding objects by listening to returning sounds", wrong: ["Seeing in the dark with bright eyes", "Sleeping upside down", "Flying very high"], why: "Bats send out sounds and use the returning echo to locate objects.", level: "easy", tags: [LC] },
  { id: "sm3-listening-16", transcript: bats, prompt: "What does the time the echo takes tell the bat?", correct: "How far away an object is", wrong: ["What colour an object is", "How fast the bat is flying", "Whether the object is alive"], why: "The brain measures how long the echo took and so knows the distance.", level: "medium", tags: [LC] },
  { id: "sm3-listening-17", transcript: bats, prompt: "What does the professor say about bats and people?", correct: "Most bats are harmless and useful.", wrong: ["Most bats attack humans.", "Bats cannot be helpful.", "Bats only live in caves."], why: "He says most bats are harmless and helpful because they control insects and pollinate flowers.", level: "hard", tags: [LC, LI] },

  { id: "sm3-listening-18", transcript: party, prompt: "When will the party be?", correct: "On Friday", wrong: ["On Thursday", "On Saturday", "On Wednesday"], why: "Reem changed the date from Thursday to Friday.", level: "medium", tags: [LC] },
  { id: "sm3-listening-19", transcript: party, prompt: "Where will the party take place?", correct: "In Lama's garden", wrong: ["At Reem's house", "At Huda's house", "At a restaurant"], why: "Reem's mother has guests, so they will use Lama's garden instead.", level: "medium", tags: [LC] },
  { id: "sm3-listening-20", transcript: party, prompt: "Why will Huda make a vanilla cake?", correct: "Mona is allergic to nuts.", wrong: ["Mona dislikes chocolate.", "Vanilla is cheaper.", "The shops are closed."], why: "Mona is allergic to nuts, which most shop chocolate cakes contain.", level: "hard", tags: [LC, LI] },
];

export const STEP_MOCK_3_LISTENING_QUESTIONS = buildQuestions("listening", "step-mock-3", specs);
