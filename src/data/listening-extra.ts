import type { Question } from "@/types/question";

export const SAMPLE_LISTENING_QUESTIONS_EXTRA: Question[] = [
  // ---- Dialogue 1: Booking a test/exam appointment (q-listening-63 to 65) ----
  {
    id: "q-listening-63",
    section: "listening",
    transcript:
      "Receptionist: Hello, English Testing Center, how can I help you?\nStudent: Hello, I'd like to book a seat for the English placement test on Saturday.\nReceptionist: Certainly. We have two sessions, one at nine in the morning and another at two in the afternoon. Which do you prefer?\nStudent: The morning session, please, because I have a training course in the afternoon. Is that the one that costs two hundred riyals?\nReceptionist: Actually, both sessions cost two hundred riyals, and you only pay a fifty riyal deposit today. So, Saturday at nine it is.\nStudent: Perfect, that works for me. Please confirm the booking.",
    audioUrl: "/audio/listening/q-listening-63.mp3",
    prompt: "How much does the English placement test cost?",
    options: [
      { id: "a", text: "Fifty riyals" },
      { id: "b", text: "Two hundred riyals" },
      { id: "c", text: "Two hundred and fifty riyals" },
      { id: "d", text: "Twenty riyals" },
    ],
    correctOptionId: "b",
    explanation: "The receptionist says, \"both sessions cost two hundred riyals,\" and only the deposit is fifty riyals.",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-64",
    section: "listening",
    transcript:
      "Receptionist: Hello, English Testing Center, how can I help you?\nStudent: Hello, I'd like to book a seat for the English placement test on Saturday.\nReceptionist: Certainly. We have two sessions, one at nine in the morning and another at two in the afternoon. Which do you prefer?\nStudent: The morning session, please, because I have a training course in the afternoon. Is that the one that costs two hundred riyals?\nReceptionist: Actually, both sessions cost two hundred riyals, and you only pay a fifty riyal deposit today. So, Saturday at nine it is.\nStudent: Perfect, that works for me. Please confirm the booking.",
    audioUrl: "/audio/listening/q-listening-63.mp3",
    prompt: "Why does the student choose the morning session?",
    options: [
      { id: "a", text: "Because the afternoon session is full" },
      { id: "b", text: "Because the morning session is cheaper" },
      { id: "c", text: "Because he has a training course in the afternoon" },
      { id: "d", text: "Because the center closes at noon" },
    ],
    correctOptionId: "c",
    explanation: "The student says he prefers the morning session \"because I have a training course in the afternoon.\"",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-65",
    section: "listening",
    transcript:
      "Receptionist: Hello, English Testing Center, how can I help you?\nStudent: Hello, I'd like to book a seat for the English placement test on Saturday.\nReceptionist: Certainly. We have two sessions, one at nine in the morning and another at two in the afternoon. Which do you prefer?\nStudent: The morning session, please, because I have a training course in the afternoon. Is that the one that costs two hundred riyals?\nReceptionist: Actually, both sessions cost two hundred riyals, and you only pay a fifty riyal deposit today. So, Saturday at nine it is.\nStudent: Perfect, that works for me. Please confirm the booking.",
    audioUrl: "/audio/listening/q-listening-63.mp3",
    prompt: "What is the student's final decision about the test?",
    options: [
      { id: "a", text: "He will book the afternoon session" },
      { id: "b", text: "He will take the test at nine o'clock on Saturday" },
      { id: "c", text: "He will cancel the booking" },
      { id: "d", text: "He will pay the full fee today" },
    ],
    correctOptionId: "b",
    explanation: "After learning both sessions cost the same, the student keeps the morning booking, and the receptionist confirms \"Saturday at nine it is.\"",
    difficulty: "medium",
    tags: ["listening-inference"],
  },

  // ---- Dialogue 2: Eating habits (q-listening-66 to 68) ----
  {
    id: "q-listening-66",
    section: "listening",
    transcript:
      "Woman: You always seem tired after lunch. What do you usually eat?\nMan: I grab a burger and fries with a large soft drink almost every day.\nWoman: That's a lot of sugar and fat. Maybe you should try grilled chicken with salad instead.\nMan: But I love fast food. Doesn't the protein in a burger help?\nWoman: Some, but the extra sugar and salt outweigh the benefit. Try to add one salad a week and drink more water.\nMan: Okay, I'll start with the salad every Thursday and see how I feel.",
    audioUrl: "/audio/listening/q-listening-66.mp3",
    prompt: "What does the man eat for lunch almost every day?",
    options: [
      { id: "a", text: "Grilled chicken with salad" },
      { id: "b", text: "A burger and fries with a large soft drink" },
      { id: "c", text: "Fish with vegetables" },
      { id: "d", text: "A salad with water" },
    ],
    correctOptionId: "b",
    explanation: "The man says he grabs \"a burger and fries with a large soft drink almost every day.\"",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-67",
    section: "listening",
    transcript:
      "Woman: You always seem tired after lunch. What do you usually eat?\nMan: I grab a burger and fries with a large soft drink almost every day.\nWoman: That's a lot of sugar and fat. Maybe you should try grilled chicken with salad instead.\nMan: But I love fast food. Doesn't the protein in a burger help?\nWoman: Some, but the extra sugar and salt outweigh the benefit. Try to add one salad a week and drink more water.\nMan: Okay, I'll start with the salad every Thursday and see how I feel.",
    audioUrl: "/audio/listening/q-listening-66.mp3",
    prompt: "Why does the woman say the burger is not a good choice?",
    options: [
      { id: "a", text: "Because the restaurant is too far" },
      { id: "b", text: "Because the extra sugar and salt outweigh the benefit" },
      { id: "c", text: "Because burgers are too expensive" },
      { id: "d", text: "Because the man is allergic to meat" },
    ],
    correctOptionId: "b",
    explanation: "The woman says the protein helps a little, \"but the extra sugar and salt outweigh the benefit.\"",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-68",
    section: "listening",
    transcript:
      "Woman: You always seem tired after lunch. What do you usually eat?\nMan: I grab a burger and fries with a large soft drink almost every day.\nWoman: That's a lot of sugar and fat. Maybe you should try grilled chicken with salad instead.\nMan: But I love fast food. Doesn't the protein in a burger help?\nWoman: Some, but the extra sugar and salt outweigh the benefit. Try to add one salad a week and drink more water.\nMan: Okay, I'll start with the salad every Thursday and see how I feel.",
    audioUrl: "/audio/listening/q-listening-66.mp3",
    prompt: "What will the man most likely do after this conversation?",
    options: [
      { id: "a", text: "Eat a salad every Thursday and drink more water" },
      { id: "b", text: "Stop eating fast food completely" },
      { id: "c", text: "Give up soft drinks entirely" },
      { id: "d", text: "Order grilled chicken every day" },
    ],
    correctOptionId: "a",
    explanation: "The man agrees to \"start with the salad every Thursday and see how I feel.\"",
    difficulty: "medium",
    tags: ["listening-inference"],
  },

  // ---- Dialogue 3: Seasonal affective disorder (SAD) (q-listening-69 to 71) ----
  {
    id: "q-listening-69",
    section: "listening",
    transcript:
      "Student: Doctor, every winter I feel exhausted and I want to sleep all day.\nDoctor: How long has this been happening?\nStudent: It started about three years ago, always around November and December.\nDoctor: This pattern sounds like seasonal affective disorder, or SAD. Many patients feel much better when they get more morning sunlight.\nStudent: I usually stay indoors all day, so would a special lamp help?\nDoctor: Yes, light therapy works well, and so does a short walk outside. I suggest the morning walk first, then a lamp if you still need it.",
    audioUrl: "/audio/listening/q-listening-69.mp3",
    prompt: "Around which months do the student's symptoms usually appear?",
    options: [
      { id: "a", text: "January and February" },
      { id: "b", text: "November and December" },
      { id: "c", text: "June and July" },
      { id: "d", text: "All year long" },
    ],
    correctOptionId: "b",
    explanation: "The student says the problem \"started about three years ago, always around November and December.\"",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-70",
    section: "listening",
    transcript:
      "Student: Doctor, every winter I feel exhausted and I want to sleep all day.\nDoctor: How long has this been happening?\nStudent: It started about three years ago, always around November and December.\nDoctor: This pattern sounds like seasonal affective disorder, or SAD. Many patients feel much better when they get more morning sunlight.\nStudent: I usually stay indoors all day, so would a special lamp help?\nDoctor: Yes, light therapy works well, and so does a short walk outside. I suggest the morning walk first, then a lamp if you still need it.",
    audioUrl: "/audio/listening/q-listening-69.mp3",
    prompt: "Why does the student ask about buying a special lamp?",
    options: [
      { id: "a", text: "Because the doctor ordered him to buy one" },
      { id: "b", text: "Because he usually stays indoors and gets little sunlight" },
      { id: "c", text: "Because the clinic is too dark" },
      { id: "d", text: "Because walks are not allowed in his area" },
    ],
    correctOptionId: "b",
    explanation: "The student explains, \"I usually stay indoors all day, so would a special lamp help?\"",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-71",
    section: "listening",
    transcript:
      "Student: Doctor, every winter I feel exhausted and I want to sleep all day.\nDoctor: How long has this been happening?\nStudent: It started about three years ago, always around November and December.\nDoctor: This pattern sounds like seasonal affective disorder, or SAD. Many patients feel much better when they get more morning sunlight.\nStudent: I usually stay indoors all day, so would a special lamp help?\nDoctor: Yes, light therapy works well, and so does a short walk outside. I suggest the morning walk first, then a lamp if you still need it.",
    audioUrl: "/audio/listening/q-listening-69.mp3",
    prompt: "What will the student most likely do first, according to the doctor?",
    options: [
      { id: "a", text: "Buy a lamp immediately" },
      { id: "b", text: "Take medicine every day" },
      { id: "c", text: "Start with a short morning walk" },
      { id: "d", text: "Move to a warmer country" },
    ],
    correctOptionId: "c",
    explanation: "The doctor suggests \"the morning walk first, then a lamp if you still need it.\"",
    difficulty: "hard",
    tags: ["listening-inference"],
  },

  // ---- Dialogue 4: Investment portfolio (q-listening-72 to 74) ----
  {
    id: "q-listening-72",
    section: "listening",
    transcript:
      "Man: I want to invest my savings, but I'm worried about risk.\nAgent: How long can you leave the money untouched?\nMan: Maybe five years, because I plan to buy an apartment after that. But what if the market drops?\nAgent: Over five years the ups and downs usually balance out. A moderate portfolio works: sixty percent in stocks and forty percent in bonds.\nMan: That still sounds risky to me. Can we add some cash to make it safer?\nAgent: Yes, we can make it fifty percent stocks, thirty percent bonds, and twenty percent cash, and that becomes your final plan.",
    audioUrl: "/audio/listening/q-listening-72.mp3",
    prompt: "How much of the final portfolio is kept in cash?",
    options: [
      { id: "a", text: "Ten percent" },
      { id: "b", text: "Twenty percent" },
      { id: "c", text: "Thirty percent" },
      { id: "d", text: "Fifty percent" },
    ],
    correctOptionId: "b",
    explanation: "The agent confirms the final plan includes \"twenty percent cash.\"",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-73",
    section: "listening",
    transcript:
      "Man: I want to invest my savings, but I'm worried about risk.\nAgent: How long can you leave the money untouched?\nMan: Maybe five years, because I plan to buy an apartment after that. But what if the market drops?\nAgent: Over five years the ups and downs usually balance out. A moderate portfolio works: sixty percent in stocks and forty percent in bonds.\nMan: That still sounds risky to me. Can we add some cash to make it safer?\nAgent: Yes, we can make it fifty percent stocks, thirty percent bonds, and twenty percent cash, and that becomes your final plan.",
    audioUrl: "/audio/listening/q-listening-72.mp3",
    prompt: "Why does the man want to add cash to the portfolio?",
    options: [
      { id: "a", text: "Because he needs the cash for an apartment now" },
      { id: "b", text: "Because he thinks the plan sounds risky and wants it safer" },
      { id: "c", text: "Because the bank refuses to buy stocks" },
      { id: "d", text: "Because cash gives the highest returns" },
    ],
    correctOptionId: "b",
    explanation: "The man says, \"That still sounds risky to me. Can we add some cash to make it safer?\"",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-74",
    section: "listening",
    transcript:
      "Man: I want to invest my savings, but I'm worried about risk.\nAgent: How long can you leave the money untouched?\nMan: Maybe five years, because I plan to buy an apartment after that. But what if the market drops?\nAgent: Over five years the ups and downs usually balance out. A moderate portfolio works: sixty percent in stocks and forty percent in bonds.\nMan: That still sounds risky to me. Can we add some cash to make it safer?\nAgent: Yes, we can make it fifty percent stocks, thirty percent bonds, and twenty percent cash, and that becomes your final plan.",
    audioUrl: "/audio/listening/q-listening-72.mp3",
    prompt: "What is the man's final decision about his portfolio?",
    options: [
      { id: "a", text: "Sixty percent stocks and forty percent bonds" },
      { id: "b", text: "Fifty percent stocks, thirty percent bonds, and twenty percent cash" },
      { id: "c", text: "All of his savings in cash" },
      { id: "d", text: "All of his savings in stocks" },
    ],
    correctOptionId: "b",
    explanation: "At the end the agent states the final plan is \"fifty percent stocks, thirty percent bonds, and twenty percent cash,\" and the man accepts it.",
    difficulty: "hard",
    tags: ["listening-inference"],
  },

  // ---- Dialogue 5: Time management (q-listening-75 to 77) ----
  {
    id: "q-listening-75",
    section: "listening",
    transcript:
      "Student: Professor, I can't finish all my assignments on time. There is simply never enough time.\nProfessor: Let me see your weekly schedule. How many hours do you manage to study each day?\nStudent: About three hours, but I waste an hour on my phone every evening.\nProfessor: Then the problem is not a lack of time. Plan your day the night before, and study only two subjects a day, with a ten minute break between them.\nStudent: Okay, I'll start planning tonight and limit my phone time to half an hour.",
    audioUrl: "/audio/listening/q-listening-75.mp3",
    prompt: "How much time does the student waste on his phone every evening?",
    options: [
      { id: "a", text: "About thirty minutes" },
      { id: "b", text: "About one hour" },
      { id: "c", text: "About two hours" },
      { id: "d", text: "About three hours" },
    ],
    correctOptionId: "b",
    explanation: "The student says, \"I waste an hour on my phone every evening.\"",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-76",
    section: "listening",
    transcript:
      "Student: Professor, I can't finish all my assignments on time. There is simply never enough time.\nProfessor: Let me see your weekly schedule. How many hours do you manage to study each day?\nStudent: About three hours, but I waste an hour on my phone every evening.\nProfessor: Then the problem is not a lack of time. Plan your day the night before, and study only two subjects a day, with a ten minute break between them.\nStudent: Okay, I'll start planning tonight and limit my phone time to half an hour.",
    audioUrl: "/audio/listening/q-listening-75.mp3",
    prompt: "According to the professor, why does the student fall behind?",
    options: [
      { id: "a", text: "Because the subjects are too difficult" },
      { id: "b", text: "Because the professor gives too many assignments" },
      { id: "c", text: "Because he wastes time and does not plan, not because there is too little time" },
      { id: "d", text: "Because he sleeps too many hours" },
    ],
    correctOptionId: "c",
    explanation: "The professor says, \"the problem is not a lack of time,\" but rather poor planning and wasted time.",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-77",
    section: "listening",
    transcript:
      "Student: Professor, I can't finish all my assignments on time. There is simply never enough time.\nProfessor: Let me see your weekly schedule. How many hours do you manage to study each day?\nStudent: About three hours, but I waste an hour on my phone every evening.\nProfessor: Then the problem is not a lack of time. Plan your day the night before, and study only two subjects a day, with a ten minute break between them.\nStudent: Okay, I'll start planning tonight and limit my phone time to half an hour.",
    audioUrl: "/audio/listening/q-listening-75.mp3",
    prompt: "What does the student finally agree to do?",
    options: [
      { id: "a", text: "Study every subject every day" },
      { id: "b", text: "Plan his schedule tonight and limit his phone time to half an hour" },
      { id: "c", text: "Stop doing the assignments" },
      { id: "d", text: "Buy a new phone" },
    ],
    correctOptionId: "b",
    explanation: "The student agrees, \"I'll start planning tonight and limit my phone time to half an hour.\"",
    difficulty: "medium",
    tags: ["listening-inference"],
  },

  // ---- Dialogue 6: Pizza offers (q-listening-78 to 80) ----
  {
    id: "q-listening-78",
    section: "listening",
    transcript:
      "Salesperson: Good evening, Pizza Palace. We have two special offers tonight: a large pizza with one topping for thirty riyals, or two medium pizzas for fifty riyals.\nMan: We are only three people, so one large is not enough, and two mediums seem like a lot.\nSalesperson: Then how about a large pizza with two toppings for thirty-five riyals? It is big enough for four people.\nMan: That sounds better. Do you deliver to Al-Noor Street?\nSalesperson: Yes, delivery is free tonight for any order over thirty riyals.\nMan: Great, I will take the large pizza with two toppings, please.",
    audioUrl: "/audio/listening/q-listening-78.mp3",
    prompt: "How much does the large pizza with two toppings cost?",
    options: [
      { id: "a", text: "Thirty riyals" },
      { id: "b", text: "Thirty-five riyals" },
      { id: "c", text: "Fifty riyals" },
      { id: "d", text: "Forty riyals" },
    ],
    correctOptionId: "b",
    explanation: "The salesperson offers \"a large pizza with two toppings for thirty-five riyals.\"",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-79",
    section: "listening",
    transcript:
      "Salesperson: Good evening, Pizza Palace. We have two special offers tonight: a large pizza with one topping for thirty riyals, or two medium pizzas for fifty riyals.\nMan: We are only three people, so one large is not enough, and two mediums seem like a lot.\nSalesperson: Then how about a large pizza with two toppings for thirty-five riyals? It is big enough for four people.\nMan: That sounds better. Do you deliver to Al-Noor Street?\nSalesperson: Yes, delivery is free tonight for any order over thirty riyals.\nMan: Great, I will take the large pizza with two toppings, please.",
    audioUrl: "/audio/listening/q-listening-78.mp3",
    prompt: "Why doesn't the man choose the two medium pizzas?",
    options: [
      { id: "a", text: "Because they are too expensive" },
      { id: "b", text: "Because two mediums seem like a lot for only three people" },
      { id: "c", text: "Because delivery is extra for mediums" },
      { id: "d", text: "Because he prefers small pizzas" },
    ],
    correctOptionId: "b",
    explanation: "The man says \"two mediums seem like a lot\" for a group of three.",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-80",
    section: "listening",
    transcript:
      "Salesperson: Good evening, Pizza Palace. We have two special offers tonight: a large pizza with one topping for thirty riyals, or two medium pizzas for fifty riyals.\nMan: We are only three people, so one large is not enough, and two mediums seem like a lot.\nSalesperson: Then how about a large pizza with two toppings for thirty-five riyals? It is big enough for four people.\nMan: That sounds better. Do you deliver to Al-Noor Street?\nSalesperson: Yes, delivery is free tonight for any order over thirty riyals.\nMan: Great, I will take the large pizza with two toppings, please.",
    audioUrl: "/audio/listening/q-listening-78.mp3",
    prompt: "What will the man most likely do after this conversation?",
    options: [
      { id: "a", text: "Order the two medium pizzas" },
      { id: "b", text: "Order the large pizza with two toppings and wait for delivery" },
      { id: "c", text: "Cook dinner at home" },
      { id: "d", text: "Cancel the order because delivery is not free" },
    ],
    correctOptionId: "b",
    explanation: "The man says \"I will take the large pizza with two toppings,\" and delivery is free for orders over thirty riyals.",
    difficulty: "medium",
    tags: ["listening-inference"],
  },

  // ---- Dialogue 7: The teaching profession (q-listening-81 to 83) ----
  {
    id: "q-listening-81",
    section: "listening",
    transcript:
      "Man: You've been a teacher for ten years now. What made you choose this profession in the first place?\nWoman: Honestly, my high school English teacher inspired me. She made every lesson interesting.\nMan: Is the salary as low as people say?\nWoman: The salary is average, but I get long holidays and a short working day. For me, the flexible hours matter more.\nMan: Would you still choose teaching if you could start again?\nWoman: Without a doubt. I feel I make a real difference in my students' lives every single day.",
    audioUrl: "/audio/listening/q-listening-81.mp3",
    prompt: "Who inspired the woman to become a teacher?",
    options: [
      { id: "a", text: "Her mother" },
      { id: "b", text: "Her high school English teacher" },
      { id: "c", text: "A colleague at work" },
      { id: "d", text: "A famous writer" },
    ],
    correctOptionId: "b",
    explanation: "The woman says, \"my high school English teacher inspired me.\"",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-82",
    section: "listening",
    transcript:
      "Man: You've been a teacher for ten years now. What made you choose this profession in the first place?\nWoman: Honestly, my high school English teacher inspired me. She made every lesson interesting.\nMan: Is the salary as low as people say?\nWoman: The salary is average, but I get long holidays and a short working day. For me, the flexible hours matter more.\nMan: Would you still choose teaching if you could start again?\nWoman: Without a doubt. I feel I make a real difference in my students' lives every single day.",
    audioUrl: "/audio/listening/q-listening-81.mp3",
    prompt: "Why does the woman stay in teaching despite the average salary?",
    options: [
      { id: "a", text: "Because the salary is actually very high" },
      { id: "b", text: "Because she has no other job options" },
      { id: "c", text: "Because she gets long holidays and a short working day, and she values flexible hours" },
      { id: "d", text: "Because she only works in summer" },
    ],
    correctOptionId: "c",
    explanation: "The woman explains she values \"long holidays and a short working day,\" and that \"the flexible hours matter more.\"",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-83",
    section: "listening",
    transcript:
      "Man: You've been a teacher for ten years now. What made you choose this profession in the first place?\nWoman: Honestly, my high school English teacher inspired me. She made every lesson interesting.\nMan: Is the salary as low as people say?\nWoman: The salary is average, but I get long holidays and a short working day. For me, the flexible hours matter more.\nMan: Would you still choose teaching if you could start again?\nWoman: Without a doubt. I feel I make a real difference in my students' lives every single day.",
    audioUrl: "/audio/listening/q-listening-81.mp3",
    prompt: "What can be inferred about the woman's feelings toward her job?",
    options: [
      { id: "a", text: "She regrets becoming a teacher" },
      { id: "b", text: "She loves her job and feels she makes a real difference" },
      { id: "c", text: "She plans to quit teaching soon" },
      { id: "d", text: "She thinks the salary is the best part of her job" },
    ],
    correctOptionId: "b",
    explanation: "She says she would choose teaching again \"without a doubt\" because she makes \"a real difference in my students' lives.\"",
    difficulty: "hard",
    tags: ["listening-inference"],
  },

  // ---- Dialogue 8: Digital newspapers (q-listening-84 to 86) ----
  {
    id: "q-listening-84",
    section: "listening",
    transcript:
      "Man: Do you still buy newspapers? Everyone I know reads the news on their phones now.\nWoman: I do subscribe to one printed paper, but I mostly read digital news on my tablet.\nMan: Is there any real advantage to the digital version?\nWoman: Yes, it is updated all day, I can search old articles in seconds, and it only costs twenty-five riyals a month.\nMan: So why keep the printed subscription at all?\nWoman: Because my father prefers paper, even though it costs forty riyals a month. I keep it mainly for him.",
    audioUrl: "/audio/listening/q-listening-84.mp3",
    prompt: "How much does the woman pay for the printed newspaper each month?",
    options: [
      { id: "a", text: "Twenty-five riyals" },
      { id: "b", text: "Forty riyals" },
      { id: "c", text: "Fifteen riyals" },
      { id: "d", text: "Fifty riyals" },
    ],
    correctOptionId: "b",
    explanation: "The woman says the printed paper \"costs forty riyals a month.\"",
    difficulty: "easy",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-85",
    section: "listening",
    transcript:
      "Man: Do you still buy newspapers? Everyone I know reads the news on their phones now.\nWoman: I do subscribe to one printed paper, but I mostly read digital news on my tablet.\nMan: Is there any real advantage to the digital version?\nWoman: Yes, it is updated all day, I can search old articles in seconds, and it only costs twenty-five riyals a month.\nMan: So why keep the printed subscription at all?\nWoman: Because my father prefers paper, even though it costs forty riyals a month. I keep it mainly for him.",
    audioUrl: "/audio/listening/q-listening-84.mp3",
    prompt: "Why does the woman keep the printed subscription?",
    options: [
      { id: "a", text: "Because the digital version is not available" },
      { id: "b", text: "Because her father prefers paper" },
      { id: "c", text: "Because printed papers are free" },
      { id: "d", text: "Because she dislikes reading on a tablet" },
    ],
    correctOptionId: "b",
    explanation: "The woman says \"my father prefers paper,\" so she keeps it \"mainly for him.\"",
    difficulty: "medium",
    tags: ["listening-comprehension"],
  },
  {
    id: "q-listening-86",
    section: "listening",
    transcript:
      "Man: Do you still buy newspapers? Everyone I know reads the news on their phones now.\nWoman: I do subscribe to one printed paper, but I mostly read digital news on my tablet.\nMan: Is there any real advantage to the digital version?\nWoman: Yes, it is updated all day, I can search old articles in seconds, and it only costs twenty-five riyals a month.\nMan: So why keep the printed subscription at all?\nWoman: Because my father prefers paper, even though it costs forty riyals a month. I keep it mainly for him.",
    audioUrl: "/audio/listening/q-listening-84.mp3",
    prompt: "What is the man most likely to do after this conversation?",
    options: [
      { id: "a", text: "Cancel his printed paper and switch to digital" },
      { id: "b", text: "Buy a subscription to both papers" },
      { id: "c", text: "Stop reading the news entirely" },
      { id: "d", text: "Ask the woman to print articles for him" },
    ],
    correctOptionId: "a",
    explanation: "The man asks about the digital advantages and why the printed one is kept, showing he is thinking of switching to digital.",
    difficulty: "hard",
    tags: ["listening-inference"],
  },
];
