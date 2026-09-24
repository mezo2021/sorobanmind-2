// src/curriculum/levels/level-04.ts

import type { LevelContent } from "./types";

export const level04: LevelContent = {
  id: "L04",
  number: 4,
  category: "both",
  interactionMode: "abacus-representation",

  conceptAr: "مكملات الخمسة — الجمع — استعن بالجدة ٥",
  conceptEn: "Friends of 5 — Addition — call the Grandmother 5",

  audioTextAr:
    "وصلنا إلى غرفة الجدة ٥! عندما نريد جمع رقم ولا نجد مكاناً في الأسفل، نستدعي الجدة ٥ للنزول، لكنها تشترط خروج صديق الرقم. صديق ١ هو ٤، وصديق ٢ هو ٣، وصديق ٣ هو ٢، وصديق ٤ هو ١.",

  audioTextEn:
    "We've reached Grandmother 5's room! When we want to add a number and there's no space below, we call Grandmother 5 to come down — but she requires the friend of the number to leave. Friend of 1 is 4, friend of 2 is 3, friend of 3 is 2, friend of 4 is 1.",

  ruleAr: "لجمع N: أنزل الجدة ٥ ثم اطرح متممها (٥-N)",
  ruleEn: "To add N: lower 5 then subtract its complement (5-N)",

  ruleTable: [
    { formula: "+1", result: "+5 − 4" },
    { formula: "+2", result: "+5 − 3" },
    { formula: "+3", result: "+5 − 2" },
    { formula: "+4", result: "+5 − 1" },
  ],

  storyAr:
    "وصل الأبطال إلى غرفة الجدة ٥. أرادوا إضافة طفل واحد، لكن الساحة ممتلئة! ظهرت الجدة ٥ وقالت: لا تقلقوا، أنا أستطيع المساعدة، لكن لي شرط: إذا دخلت أنا (+5)، يجب أن يخرج صديق الرقم الذي تريدونه.",

  storyEn:
    "The heroes reached Grandmother 5's room. They wanted to add one child, but the yard was full! Grandmother 5 appeared and said: Don't worry, I can help, but I have a condition: if I enter (+5), the friend of the number you want must leave.",

  tactileActivity: {
    titleAr: "نشاط علبة الجدة ٥",
    titleEn: "Grandmother 5 Box Activity",
    materials: ["علبة صغيرة", "٥ أزرار", "بطاقة الجدة ٥"],
    steps: [
      "ضع ٤ أزرار في العلبة (تمثل ٤)",
      "أضف زراً واحداً (تريد الوصول إلى ٥)",
      "العلبة ممتلئة! استعن ببطاقة الجدة ٥",
      "الجدة تشترط: ضع زراً واحداً + ارفع ٤ أزرار",
    ],
    goalAr: "فهم أن +1 = +5 − 4 بملموسية",
    goalEn: "Understand that +1 = +5 − 4 tangibly",
  },

  examples: [
    {
      id: "L04.E1",
      problemText: "٤ + ١ = ؟",
      answer: 5,
      ruleCategory: "five-friend-add",
      steps: [
        {
          stepIndex: 1,
          instructionAr: "مثّل ٤: ارفع ٤ أطفال",
          instructionEn: "Represent 4: raise 4 children",
          fingerUsed: "thumb",
          direction: "up",
          targetColumn: "units",
          beadsAffected: [1, 2, 3, 4],
          expectedValueAfter: 4,
        },
        {
          stepIndex: 2,
          instructionAr: "أنزل الجدة ٥ (+5)",
          instructionEn: "Lower Grandmother 5 (+5)",
          fingerUsed: "index",
          direction: "down",
          targetColumn: "units",
          beadsAffected: [5],
          expectedValueAfter: 9,
        },
        {
          stepIndex: 3,
          instructionAr: "أنزل ٤ أطفال (−4 = متمم ١)",
          instructionEn: "Lower 4 children (−4 = complement of 1)",
          fingerUsed: "index",
          direction: "down",
          targetColumn: "units",
          beadsAffected: [1, 2, 3, 4],
          expectedValueAfter: 5,
        },
      ],
      explanationAr: "٤ + ١ = ٥ (القاعدة: +1 = +5 − 4).",
      explanationEn: "4 + 1 = 5 (rule: +1 = +5 − 4).",
    },
    {
      id: "L04.E2",
      problemText: "٣ + ٢ = ؟",
      answer: 5,
      ruleCategory: "five-friend-add",
      steps: [],
      explanationAr: "٣ + ٢ = ٥ (القاعدة: +2 = +5 − 3).",
      explanationEn: "3 + 2 = 5 (rule: +2 = +5 − 3).",
    },
    {
      id: "L04.E3",
      problemText: "٢ + ٣ = ؟",
      answer: 5,
      ruleCategory: "five-friend-add",
      steps: [],
      explanationAr: "٢ + ٣ = ٥ (القاعدة: +3 = +5 − 2).",
      explanationEn: "2 + 3 = 5 (rule: +3 = +5 − 2).",
    },
    {
      id: "L04.E4",
      problemText: "١ + ٤ = ؟",
      answer: 5,
      ruleCategory: "five-friend-add",
      steps: [],
      explanationAr: "١ + ٤ = ٥ (القاعدة: +4 = +5 − 1).",
      explanationEn: "1 + 4 = 5 (rule: +4 = +5 − 1).",
    },
    {
      id: "L04.E5",
      problemText: "٤ + ٢ = ؟",
      answer: 6,
      ruleCategory: "five-friend-add",
      steps: [],
      explanationAr: "٤ + ٢ = ٦ (القاعدة: +2 = +5 − 3).",
      explanationEn: "4 + 2 = 6 (rule: +2 = +5 − 3).",
    },
    {
      id: "L04.E6",
      problemText: "٣ + ٣ = ؟",
      answer: 6,
      ruleCategory: "five-friend-add",
      steps: [],
      explanationAr: "٣ + ٣ = ٦ (القاعدة: +3 = +5 − 2).",
      explanationEn: "3 + 3 = 6 (rule: +3 = +5 − 2).",
    },
    {
      id: "L04.E7",
      problemText: "٤ + ٣ = ؟",
      answer: 7,
      ruleCategory: "five-friend-add",
      steps: [],
      explanationAr: "٤ + ٣ = ٧ (القاعدة: +3 = +5 − 2).",
      explanationEn: "4 + 3 = 7 (rule: +3 = +5 − 2).",
    },
    {
      id: "L04.E8",
      problemText: "٢ + ٤ = ؟",
      answer: 6,
      ruleCategory: "five-friend-add",
      steps: [],
      explanationAr: "٢ + ٤ = ٦ (القاعدة: +4 = +5 − 1).",
      explanationEn: "2 + 4 = 6 (rule: +4 = +5 − 1).",
    },
    {
      id: "L04.E9",
      problemText: "٣ + ٤ = ؟",
      answer: 7,
      ruleCategory: "five-friend-add",
      steps: [],
      explanationAr: "٣ + ٤ = ٧ (القاعدة: +4 = +5 − 1).",
      explanationEn: "3 + 4 = 7 (rule: +4 = +5 − 1).",
    },
    {
      id: "L04.E10",
      problemText: "٤ + ٤ = ؟",
      answer: 8,
      ruleCategory: "five-friend-add",
      steps: [],
      explanationAr: "٤ + ٤ = ٨ (القاعدة: +4 = +5 − 1).",
      explanationEn: "4 + 4 = 8 (rule: +4 = +5 − 1).",
    },
  ],

  estimatedMinutes: 60,
};

export default level04;