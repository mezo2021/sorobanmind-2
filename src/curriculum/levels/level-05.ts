// src/curriculum/levels/level-05.ts

import type { LevelContent } from "./types";

export const level05: LevelContent = {
  id: "L05",
  number: 5,
  category: "both",
  interactionMode: "abacus-representation",

  conceptAr: "مكملات الخمسة — الطرح — الجدة تصعد والأطفال يدخلون",
  conceptEn: "Friends of 5 — Subtraction — grandmother rises, children enter",

  audioTextAr:
    "الآن نتعلم الطرح بمكملات الخمسة! عندما نريد طرح رقم ولا توجد خرزة سفلية، تصعد الجدة ٥ وتستريح، لكنها تترك مكانها لأصدقاء الرقم.",

  audioTextEn:
    "Now we learn subtraction with friends of 5! When we want to subtract a number and there's no lower bead, Grandmother 5 rises to rest, but leaves her place for the number's friends.",

  ruleAr: "لطرح N: ارفع الجدة ٥ ثم أضف متممها (٥-N)",
  ruleEn: "To subtract N: raise 5 then add its complement (5-N)",

  ruleTable: [
    { formula: "−1", result: "−5 + 4" },
    { formula: "−2", result: "−5 + 3" },
    { formula: "−3", result: "−5 + 2" },
    { formula: "−4", result: "−5 + 1" },
  ],

  storyAr:
    "قالت الجدة ٥: أنا أستطيع الطرح أيضاً! عندما تريدون طرح رقم، أصعد أنا لتستريح (−5)، لكن أترك أصدقائي الأطفال يلعبون في الساحة (+ متمم الرقم).",

  storyEn:
    "Grandmother 5 said: I can also subtract! When you want to subtract a number, I rise to rest (−5), but I leave my friends the children playing in the yard (+ complement of the number).",

  tactileActivity: {
    titleAr: "نشاط الجدة تصعد",
    titleEn: "Grandmother Rises Activity",
    materials: ["يداك", "بطاقات ٥"],
    steps: [
      "مثّل ٥ بإبهامك",
      "أردنا طرح ١: ارفع الإبهام (الجدة صعدت)",
      "أدخل ٤ أطفال (المتمم)",
      "النتيجة: ٤",
    ],
    goalAr: "فهم قاعدة −1 = −5 + 4",
    goalEn: "Understand −1 = −5 + 4",
  },

  examples: [
    {
      id: "L05.E1",
      problemText: "٥ − ١ = ؟",
      answer: 4,
      ruleCategory: "five-friend-sub",
      steps: [
        {
          stepIndex: 1,
          instructionAr: "مثّل ٥: أنزل الجدة",
          instructionEn: "Represent 5: lower grandmother",
          fingerUsed: "index",
          direction: "down",
          targetColumn: "units",
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
        {
          stepIndex: 2,
          instructionAr: "ارفع الجدة (−5)",
          instructionEn: "Raise grandmother (−5)",
          fingerUsed: "index",
          direction: "up",
          targetColumn: "units",
          beadsAffected: [5],
          expectedValueAfter: 0,
        },
        {
          stepIndex: 3,
          instructionAr: "ارفع ٤ أطفال (+4)",
          instructionEn: "Raise 4 children (+4)",
          fingerUsed: "thumb",
          direction: "up",
          targetColumn: "units",
          beadsAffected: [1, 2, 3, 4],
          expectedValueAfter: 4,
        },
      ],
      explanationAr: "٥ − ١ = ٤ (القاعدة: −1 = −5 + 4).",
      explanationEn: "5 − 1 = 4 (rule: −1 = −5 + 4).",
    },
    {
      id: "L05.E2",
      problemText: "٥ − ٢ = ؟",
      answer: 3,
      ruleCategory: "five-friend-sub",
      steps: [],
      explanationAr: "٥ − ٢ = ٣ (القاعدة: −2 = −5 + 3).",
      explanationEn: "5 − 2 = 3 (rule: −2 = −5 + 3).",
    },
    {
      id: "L05.E3",
      problemText: "٥ − ٣ = ؟",
      answer: 2,
      ruleCategory: "five-friend-sub",
      steps: [],
      explanationAr: "٥ − ٣ = ٢ (القاعدة: −3 = −5 + 2).",
      explanationEn: "5 − 3 = 2 (rule: −3 = −5 + 2).",
    },
    {
      id: "L05.E4",
      problemText: "٥ − ٤ = ؟",
      answer: 1,
      ruleCategory: "five-friend-sub",
      steps: [],
      explanationAr: "٥ − ٤ = ١ (القاعدة: −4 = −5 + 1).",
      explanationEn: "5 − 4 = 1 (rule: −4 = −5 + 1).",
    },
    {
      id: "L05.E5",
      problemText: "٦ − ٢ = ؟",
      answer: 4,
      ruleCategory: "five-friend-sub",
      steps: [],
      explanationAr: "٦ − ٢ = ٤.",
      explanationEn: "6 − 2 = 4.",
    },
    {
      id: "L05.E6",
      problemText: "٧ − ٣ = ؟",
      answer: 4,
      ruleCategory: "five-friend-sub",
      steps: [],
      explanationAr: "٧ − ٣ = ٤.",
      explanationEn: "7 − 3 = 4.",
    },
    {
      id: "L05.E7",
      problemText: "٨ − ٤ = ؟",
      answer: 4,
      ruleCategory: "five-friend-sub",
      steps: [],
      explanationAr: "٨ − ٤ = ٤.",
      explanationEn: "8 − 4 = 4.",
    },
    {
      id: "L05.E8",
      problemText: "٧ − ٤ = ؟",
      answer: 3,
      ruleCategory: "five-friend-sub",
      steps: [],
      explanationAr: "٧ − ٤ = ٣.",
      explanationEn: "7 − 4 = 3.",
    },
    {
      id: "L05.E9",
      problemText: "٦ − ٤ = ؟",
      answer: 2,
      ruleCategory: "five-friend-sub",
      steps: [],
      explanationAr: "٦ − ٤ = ٢.",
      explanationEn: "6 − 4 = 2.",
    },
    {
      id: "L05.E10",
      problemText: "٨ − ٣ = ؟",
      answer: 5,
      ruleCategory: "five-friend-sub",
      steps: [],
      explanationAr: "٨ − ٣ = ٥.",
      explanationEn: "8 − 3 = 5.",
    },
  ],

  estimatedMinutes: 60,
};

export default level05;