import type { Question } from "@/types/question";

export const STEP_MOCK_LISTENING_QUESTIONS: Question[] = [
  // ---- Dialogue 1: Booking a test date (sm-listening-1 to 3) ----
  {
    id: "sm-listening-1",
    section: "listening",
    transcript:
      "Teacher: That's all for today, everyone. Please study well for your final exams. Does anyone have any questions before we finish?\nStudent: Yes, Mrs. Smith. When exactly is our final exam?\nTeacher: It's on Monday, the 26th of December.\nStudent: Will the exam cover all six units we have studied?\nTeacher: No, not all of them. Only the last two units will be on the test.\nStudent: Only two units? That's great news. Thank you, teacher.\nTeacher: You're welcome. Study hard and good luck to all of you.",
    prompt: "When will the students have their final exam?",
    options: [
      { id: "a", text: "Next Monday" },
      { id: "b", text: "Next Friday" },
      { id: "c", text: "In two weeks" },
      { id: "d", text: "In a month" },
    ],
    correctOptionId: "a",
    explanation: "The teacher tells the class that the final exam is on Monday, the 26th of December, which is the coming Monday.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-2",
    section: "listening",
    transcript:
      "Teacher: That's all for today, everyone. Please study well for your final exams. Does anyone have any questions before we finish?\nStudent: Yes, Mrs. Smith. When exactly is our final exam?\nTeacher: It's on Monday, the 26th of December.\nStudent: Will the exam cover all six units we have studied?\nTeacher: No, not all of them. Only the last two units will be on the test.\nStudent: Only two units? That's great news. Thank you, teacher.\nTeacher: You're welcome. Study hard and good luck to all of you.",
    prompt: "How many units will the final exam cover?",
    options: [
      { id: "a", text: "Two units" },
      { id: "b", text: "Four units" },
      { id: "c", text: "Six units" },
      { id: "d", text: "Only one unit" },
    ],
    correctOptionId: "a",
    explanation: "The teacher says the exam will not cover all six units; only the last two units will be on the test.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-3",
    section: "listening",
    transcript:
      "Teacher: That's all for today, everyone. Please study well for your final exams. Does anyone have any questions before we finish?\nStudent: Yes, Mrs. Smith. When exactly is our final exam?\nTeacher: It's on Monday, the 26th of December.\nStudent: Will the exam cover all six units we have studied?\nTeacher: No, not all of them. Only the last two units will be on the test.\nStudent: Only two units? That's great news. Thank you, teacher.\nTeacher: You're welcome. Study hard and good luck to all of you.",
    prompt: "How does the student feel when she hears that only the last two units are on the exam?",
    options: [
      { id: "a", text: "Surprised and relieved" },
      { id: "b", text: "Annoyed that the exam is too easy" },
      { id: "c", text: "Confused about the exam date" },
      { id: "d", text: "Worried that she has not studied enough" },
    ],
    correctOptionId: "a",
    explanation: "The student reacts with surprise and says it is great news, which shows she is relieved that there is less material to study.",
    difficulty: "medium",
    tags: ["listening-inference"],
  },

  // ---- Dialogue 2: Seasonal affective disorder (SAD) (sm-listening-4 to 6) ----
  {
    id: "sm-listening-4",
    section: "listening",
    transcript:
      "Lecturer: Our lecture today is about SAD, which stands for Seasonal Affective Disorder, a kind of depression that appears at certain times of the year. Before I continue, do you have any questions?\nStudent: Yes, sir. Why is SAD considered a seasonal disorder?\nLecturer: Because it happens during the dark months, when the days become shorter and the sky is usually cloudy.\nStudent: And what actually causes SAD?\nLecturer: Honestly, no one really knows what causes it. But fortunately, there is a treatment called light box therapy. It can relieve the symptoms, and sometimes it works better when combined with other medication.\nStudent: Is that treatment widely available now?\nLecturer: Not yet. Scientists are still testing the light boxes to make sure they are safe and effective.",
    prompt: "What information proves that SAD is a seasonal disorder?",
    options: [
      { id: "a", text: "It only affects people in hot countries" },
      { id: "b", text: "It happens in the dark months of the year" },
      { id: "c", text: "It is caused by eating too much sugar" },
      { id: "d", text: "It lasts for a whole decade" },
    ],
    correctOptionId: "b",
    explanation: "The lecturer explains that SAD occurs during the dark months, when days become shorter and the sky is usually cloudy.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-5",
    section: "listening",
    transcript:
      "Lecturer: Our lecture today is about SAD, which stands for Seasonal Affective Disorder, a kind of depression that appears at certain times of the year. Before I continue, do you have any questions?\nStudent: Yes, sir. Why is SAD considered a seasonal disorder?\nLecturer: Because it happens during the dark months, when the days become shorter and the sky is usually cloudy.\nStudent: And what actually causes SAD?\nLecturer: Honestly, no one really knows what causes it. But fortunately, there is a treatment called light box therapy. It can relieve the symptoms, and sometimes it works better when combined with other medication.\nStudent: Is that treatment widely available now?\nLecturer: Not yet. Scientists are still testing the light boxes to make sure they are safe and effective.",
    prompt: "What does the professor think is the reason for differences in SAD symptoms?",
    options: [
      { id: "a", text: "The patient's diet" },
      { id: "b", text: "The climate in the region" },
      { id: "c", text: "Unknown, since no one knows what starts the disorder" },
      { id: "d", text: "The amount of medication taken" },
    ],
    correctOptionId: "c",
    explanation: "The professor says no one really knows what causes SAD, which is why the differences in symptoms remain unexplained.",
    difficulty: "hard",
    tags: ["listening-inference"],
  },
  {
    id: "sm-listening-6",
    section: "listening",
    transcript:
      "Lecturer: Our lecture today is about SAD, which stands for Seasonal Affective Disorder, a kind of depression that appears at certain times of the year. Before I continue, do you have any questions?\nStudent: Yes, sir. Why is SAD considered a seasonal disorder?\nLecturer: Because it happens during the dark months, when the days become shorter and the sky is usually cloudy.\nStudent: And what actually causes SAD?\nLecturer: Honestly, no one really knows what causes it. But fortunately, there is a treatment called light box therapy. It can relieve the symptoms, and sometimes it works better when combined with other medication.\nStudent: Is that treatment widely available now?\nLecturer: Not yet. Scientists are still testing the light boxes to make sure they are safe and effective.",
    prompt: "What does the professor say about the light box treatment?",
    options: [
      { id: "a", text: "It is still being tested by scientists" },
      { id: "b", text: "It has already been banned" },
      { id: "c", text: "It works for every patient immediately" },
      { id: "d", text: "It is too expensive to buy" },
    ],
    correctOptionId: "a",
    explanation: "The professor says the light boxes are not widely available yet because scientists are still testing them.",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },

  // ---- Dialogue 3: Booking train tickets (sm-listening-7 to 9) ----
  {
    id: "sm-listening-7",
    section: "listening",
    transcript:
      "Customer: Good morning. I'd like a train ticket from Sydney to Melbourne, please.\nTicket Seller: Good morning, sir. Which day would you like to travel?\nCustomer: Tuesday, the 18th of November.\nTicket Seller: Would you like a one-way ticket or a round-trip ticket?\nCustomer: A round-trip ticket, please.\nTicket Seller: I'm sorry, sir, but there are no round-trip tickets left for Tuesday.\nCustomer: Hmm. What about Wednesday, then?\nTicket Seller: Let me check... Yes, we do have round-trip tickets available on Wednesday.\nCustomer: Perfect. Please book me a seat for Wednesday.\nTicket Seller: Certainly. That will be $120 in total.\nCustomer: Here you are. Thank you.\nTicket Seller: Here are your ticket and receipt. The train departs at 6:15 in the morning, so please arrive at the station thirty minutes before.",
    prompt: "When does the customer originally want to travel?",
    options: [
      { id: "a", text: "On Monday" },
      { id: "b", text: "On Friday" },
      { id: "c", text: "On Saturday" },
      { id: "d", text: "On Tuesday" },
    ],
    correctOptionId: "d",
    explanation: "The customer asks for a ticket for Tuesday, the 18th of November.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-8",
    section: "listening",
    transcript:
      "Customer: Good morning. I'd like a train ticket from Sydney to Melbourne, please.\nTicket Seller: Good morning, sir. Which day would you like to travel?\nCustomer: Tuesday, the 18th of November.\nTicket Seller: Would you like a one-way ticket or a round-trip ticket?\nCustomer: A round-trip ticket, please.\nTicket Seller: I'm sorry, sir, but there are no round-trip tickets left for Tuesday.\nCustomer: Hmm. What about Wednesday, then?\nTicket Seller: Let me check... Yes, we do have round-trip tickets available on Wednesday.\nCustomer: Perfect. Please book me a seat for Wednesday.\nTicket Seller: Certainly. That will be $120 in total.\nCustomer: Here you are. Thank you.\nTicket Seller: Here are your ticket and receipt. The train departs at 6:15 in the morning, so please arrive at the station thirty minutes before.",
    prompt: "What type of ticket does the customer buy?",
    options: [
      { id: "a", text: "A one-way ticket" },
      { id: "b", text: "A season ticket" },
      { id: "c", text: "A first-class ticket" },
      { id: "d", text: "A round-trip ticket" },
    ],
    correctOptionId: "d",
    explanation: "The customer asks for a round-trip ticket, and the seller confirms round-trip tickets are available on Wednesday.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-9",
    section: "listening",
    transcript:
      "Customer: Good morning. I'd like a train ticket from Sydney to Melbourne, please.\nTicket Seller: Good morning, sir. Which day would you like to travel?\nCustomer: Tuesday, the 18th of November.\nTicket Seller: Would you like a one-way ticket or a round-trip ticket?\nCustomer: A round-trip ticket, please.\nTicket Seller: I'm sorry, sir, but there are no round-trip tickets left for Tuesday.\nCustomer: Hmm. What about Wednesday, then?\nTicket Seller: Let me check... Yes, we do have round-trip tickets available on Wednesday.\nCustomer: Perfect. Please book me a seat for Wednesday.\nTicket Seller: Certainly. That will be $120 in total.\nCustomer: Here you are. Thank you.\nTicket Seller: Here are your ticket and receipt. The train departs at 6:15 in the morning, so please arrive at the station thirty minutes before.",
    prompt: "The customer actually books a seat for which day?",
    options: [
      { id: "a", text: "Wednesday" },
      { id: "b", text: "Thursday" },
      { id: "c", text: "Tuesday" },
      { id: "d", text: "Friday" },
    ],
    correctOptionId: "a",
    explanation: "Because no round-trip tickets were left for Tuesday, the customer books the seat for Wednesday instead.",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },

  // ---- Dialogue 4: Pizza special offer (sm-listening-10 to 11) ----
  {
    id: "sm-listening-10",
    section: "listening",
    transcript:
      "Customer: Good morning. I heard you are running special offers at the moment.\nSeller: Good morning, sir. Yes, we have a different special offer every day.\nCustomer: What is today's offer?\nSeller: Today's offer costs only $65. For that price, you get two medium pizzas and two cans of soda.\nCustomer: That sounds like a great deal. I'll take it.\nSeller: What kind of pizza would you like?\nCustomer: Two pepperoni pizzas, please.\nSeller: Sure. Your pizzas and soda will be ready to pick up in about an hour from Jack's Pizza Place.\nCustomer: Wonderful. Thank you very much.\nSeller: You're most welcome.",
    prompt: "How much does today's special offer cost?",
    options: [
      { id: "a", text: "Twenty-five dollars" },
      { id: "b", text: "Fifty dollars" },
      { id: "c", text: "Sixty-five dollars" },
      { id: "d", text: "Ninety-five dollars" },
    ],
    correctOptionId: "c",
    explanation: "The seller says today's offer costs $65, which includes two medium pizzas and two cans of soda.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-11",
    section: "listening",
    transcript:
      "Customer: Good morning. I heard you are running special offers at the moment.\nSeller: Good morning, sir. Yes, we have a different special offer every day.\nCustomer: What is today's offer?\nSeller: Today's offer costs only $65. For that price, you get two medium pizzas and two cans of soda.\nCustomer: That sounds like a great deal. I'll take it.\nSeller: What kind of pizza would you like?\nCustomer: Two pepperoni pizzas, please.\nSeller: Sure. Your pizzas and soda will be ready to pick up in about an hour from Jack's Pizza Place.\nCustomer: Wonderful. Thank you very much.\nSeller: You're most welcome.",
    prompt: "Where and when will the customer's order most likely be ready?",
    options: [
      { id: "a", text: "Delivered to his office within the hour" },
      { id: "b", text: "Cooked only on weekends" },
      { id: "c", text: "Available only at the downtown branch" },
      { id: "d", text: "Ready to pick up in about an hour from Jack's Pizza Place" },
    ],
    correctOptionId: "d",
    explanation: "The seller says the pizzas and soda will be ready to pick up in about an hour from Jack's Pizza Place.",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },

  // ---- Dialogue 5: The octopus (sm-listening-12 to 14) ----
  {
    id: "sm-listening-12",
    section: "listening",
    transcript:
      "Son: Hi, Mom!\nMom: Hi, Adam. How was school today?\nSon: Great! We had a biology lesson, and we learned some really interesting facts about octopuses.\nMom: That sounds interesting. Tell me more.\nSon: Did you know that an octopus can squeeze into very tight spaces?\nMom: How is that possible?\nSon: Because it has no internal or external skeleton, so its body can fit through tiny openings.\nMom: Wow, that's amazing.\nSon: And here is another fact. All kinds of octopuses are venomous.\nMom: Really? Can any of them kill a person?\nSon: Yes, but only the blue-ringed octopus has been known to kill humans.\nMom: Wow, I had no idea.",
    prompt: "Why can an octopus squeeze into tight spaces?",
    options: [
      { id: "a", text: "Because its muscles are extremely small" },
      { id: "b", text: "Because it produces a slippery oil" },
      { id: "c", text: "Because it can flatten its body in water" },
      { id: "d", text: "Because it has no internal or external skeleton" },
    ],
    correctOptionId: "d",
    explanation: "Adam explains that the octopus can fit through tiny openings because it has no internal or external skeleton.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-13",
    section: "listening",
    transcript:
      "Son: Hi, Mom!\nMom: Hi, Adam. How was school today?\nSon: Great! We had a biology lesson, and we learned some really interesting facts about octopuses.\nMom: That sounds interesting. Tell me more.\nSon: Did you know that an octopus can squeeze into very tight spaces?\nMom: How is that possible?\nSon: Because it has no internal or external skeleton, so its body can fit through tiny openings.\nMom: Wow, that's amazing.\nSon: And here is another fact. All kinds of octopuses are venomous.\nMom: Really? Can any of them kill a person?\nSon: Yes, but only the blue-ringed octopus has been known to kill humans.\nMom: Wow, I had no idea.",
    prompt: "All octopuses are venomous, but what is true about their danger to humans?",
    options: [
      { id: "a", text: "Only the blue-ringed octopus has been known to kill humans" },
      { id: "b", text: "The giant octopus is the most deadly" },
      { id: "c", text: "No octopus can ever harm a person" },
      { id: "d", text: "Their venom always causes instant death" },
    ],
    correctOptionId: "a",
    explanation: "Adam says that although all octopuses are venomous, only the blue-ringed octopus has been known to kill humans.",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-14",
    section: "listening",
    transcript:
      "Son: Hi, Mom!\nMom: Hi, Adam. How was school today?\nSon: Great! We had a biology lesson, and we learned some really interesting facts about octopuses.\nMom: That sounds interesting. Tell me more.\nSon: Did you know that an octopus can squeeze into very tight spaces?\nMom: How is that possible?\nSon: Because it has no internal or external skeleton, so its body can fit through tiny openings.\nMom: Wow, that's amazing.\nSon: And here is another fact. All kinds of octopuses are venomous.\nMom: Really? Can any of them kill a person?\nSon: Yes, but only the blue-ringed octopus has been known to kill humans.\nMom: Wow, I had no idea.",
    prompt: "Where did Adam learn about octopuses?",
    options: [
      { id: "a", text: "In a biology lesson at school" },
      { id: "b", text: "From a nature documentary" },
      { id: "c", text: "From a book at home" },
      { id: "d", text: "From his mother" },
    ],
    correctOptionId: "a",
    explanation: "Adam tells his mother that he learned the facts during a biology lesson at school.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },

  // ---- Dialogue 6: Time management (sm-listening-15 to 17) ----
  {
    id: "sm-listening-15",
    section: "listening",
    transcript:
      "Teacher: Good morning, everyone. In our writing class today, we are going to talk about time management. Does anyone have an idea that can help people manage their time better?\nStudent: Yes, sir, I do.\nTeacher: Great. Go ahead and share it with us.\nStudent: I think schedules are very important. They help people organize their tasks and use their time well.\nTeacher: That's an excellent idea, and it will be the topic of our writing task today.\nStudent: So what are we going to write?\nTeacher: You are going to write a time management schedule. You have thirty minutes starting now.\nStudent: Thank you, sir.",
    prompt: "What important point does one of the students mention?",
    options: [
      { id: "a", text: "Sleeping early is the best way to save time" },
      { id: "b", text: "Schedules are important for managing time" },
      { id: "c", text: "Taking long breaks improves work" },
      { id: "d", text: "Eating healthy food saves time" },
    ],
    correctOptionId: "b",
    explanation: "The student says that schedules are very important because they help people organize their tasks and use their time well.",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-16",
    section: "listening",
    transcript:
      "Teacher: Good morning, everyone. In our writing class today, we are going to talk about time management. Does anyone have an idea that can help people manage their time better?\nStudent: Yes, sir, I do.\nTeacher: Great. Go ahead and share it with us.\nStudent: I think schedules are very important. They help people organize their tasks and use their time well.\nTeacher: That's an excellent idea, and it will be the topic of our writing task today.\nStudent: So what are we going to write?\nTeacher: You are going to write a time management schedule. You have thirty minutes starting now.\nStudent: Thank you, sir.",
    prompt: "What should the students start writing?",
    options: [
      { id: "a", text: "An essay about their hobbies" },
      { id: "b", text: "A letter to a friend" },
      { id: "c", text: "A short story" },
      { id: "d", text: "A time management schedule" },
    ],
    correctOptionId: "d",
    explanation: "The teacher tells the students that they are going to write a time management schedule.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-17",
    section: "listening",
    transcript:
      "Teacher: Good morning, everyone. In our writing class today, we are going to talk about time management. Does anyone have an idea that can help people manage their time better?\nStudent: Yes, sir, I do.\nTeacher: Great. Go ahead and share it with us.\nStudent: I think schedules are very important. They help people organize their tasks and use their time well.\nTeacher: That's an excellent idea, and it will be the topic of our writing task today.\nStudent: So what are we going to write?\nTeacher: You are going to write a time management schedule. You have thirty minutes starting now.\nStudent: Thank you, sir.",
    prompt: "How much time do the students have for the writing task?",
    options: [
      { id: "a", text: "Ten minutes" },
      { id: "b", text: "Twenty minutes" },
      { id: "c", text: "Thirty minutes" },
      { id: "d", text: "Forty-five minutes" },
    ],
    correctOptionId: "c",
    explanation: "The teacher gives the students thirty minutes to complete the writing task.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },

  // ---- Dialogue 7: Jane Austen (sm-listening-18 to 20) ----
  {
    id: "sm-listening-18",
    section: "listening",
    transcript:
      "Professor: Good morning, everyone.\nStudents: Good morning, sir.\nProfessor: Today we are going to talk about a famous writer who produced some of the best classic novels in English literature.\nStudent 1: Which novel is her most famous one?\nProfessor: Pride and Prejudice.\nStudent 2: That must be Jane Austen.\nProfessor: Well done. Did you know that Jane Austen was taught how to write by her father?\nStudent 3: Really? I always thought she was self-taught.\nProfessor: Actually, her father recognized her talent early and encouraged her writing from a young age.\nStudent 2: That's fascinating.\nProfessor: It is. And there is another interesting fact. When she published her novels, she had to hide her identity, because at that time women writers were not taken seriously.\nStudent 1: That's so unfair.\nProfessor: It certainly was. Yet despite these challenges, she became one of the most beloved writers in English literature. She passed away in 1817, but her books are still read and loved today.",
    prompt: "Who taught Jane Austen how to write?",
    options: [
      { id: "a", text: "Her mother" },
      { id: "b", text: "A private tutor" },
      { id: "c", text: "Her father" },
      { id: "d", text: "She was self-taught" },
    ],
    correctOptionId: "c",
    explanation: "The professor says Jane Austen was taught how to write by her father, who recognized her talent early and encouraged her.",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "sm-listening-19",
    section: "listening",
    transcript:
      "Professor: Good morning, everyone.\nStudents: Good morning, sir.\nProfessor: Today we are going to talk about a famous writer who produced some of the best classic novels in English literature.\nStudent 1: Which novel is her most famous one?\nProfessor: Pride and Prejudice.\nStudent 2: That must be Jane Austen.\nProfessor: Well done. Did you know that Jane Austen was taught how to write by her father?\nStudent 3: Really? I always thought she was self-taught.\nProfessor: Actually, her father recognized her talent early and encouraged her writing from a young age.\nStudent 2: That's fascinating.\nProfessor: It is. And there is another interesting fact. When she published her novels, she had to hide her identity, because at that time women writers were not taken seriously.\nStudent 1: That's so unfair.\nProfessor: It certainly was. Yet despite these challenges, she became one of the most beloved writers in English literature. She passed away in 1817, but her books are still read and loved today.",
    prompt: "What is the most important point mentioned about Jane Austen's career?",
    options: [
      { id: "a", text: "She had to hide her identity when publishing her novels" },
      { id: "b", text: "She wrote only short stories" },
      { id: "c", text: "Her novels were never published" },
      { id: "d", text: "She studied literature at university" },
    ],
    correctOptionId: "a",
    explanation: "The professor emphasizes that Austen had to hide her identity when publishing, because women writers were not taken seriously at the time.",
    difficulty: "hard",
    tags: ["listening-inference"],
  },
  {
    id: "sm-listening-20",
    section: "listening",
    transcript:
      "Professor: Good morning, everyone.\nStudents: Good morning, sir.\nProfessor: Today we are going to talk about a famous writer who produced some of the best classic novels in English literature.\nStudent 1: Which novel is her most famous one?\nProfessor: Pride and Prejudice.\nStudent 2: That must be Jane Austen.\nProfessor: Well done. Did you know that Jane Austen was taught how to write by her father?\nStudent 3: Really? I always thought she was self-taught.\nProfessor: Actually, her father recognized her talent early and encouraged her writing from a young age.\nStudent 2: That's fascinating.\nProfessor: It is. And there is another interesting fact. When she published her novels, she had to hide her identity, because at that time women writers were not taken seriously.\nStudent 1: That's so unfair.\nProfessor: It certainly was. Yet despite these challenges, she became one of the most beloved writers in English literature. She passed away in 1817, but her books are still read and loved today.",
    prompt: "In which year did Jane Austen die?",
    options: [
      { id: "a", text: "1812" },
      { id: "b", text: "1817" },
      { id: "c", text: "1827" },
      { id: "d", text: "1871" },
    ],
    correctOptionId: "b",
    explanation: "The professor states that Jane Austen passed away in 1817, yet her works are still read and admired today.",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
];
