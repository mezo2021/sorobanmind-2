// src/curriculum/levels/level-01.ts

import type { LevelContent } from "./types";

export const level01: LevelContent = {
  id: "L01",
  number: 1,
  category: "both",
  interactionMode: "abacus-representation",

  conceptAr: "الأرقام من ٠ إلى ٩ على عمود واحد",
  conceptEn: "Numbers 0 to 9 on a single column",

  audioTextAr:
    "الآن سنتعلم تمثيل الأرقام من صفر إلى تسعة. الخرزة التي تلمس الجسر فقط هي التي تُحسب. الأرقام من ١ إلى ٤ نستخدم لها الخرزات السفلية. الرقم ٥ نستخدم له الخرزة العلوية. والأرقام من ٦ إلى ٩ نمزج بين العلوية والسفلية.",

  audioTextEn:
    "Now we learn to represent numbers 0 to 9. Only the bead touching the beam counts. For numbers 1 to 4 we use lower beads. For 5 we use the upper bead. For 6 to 9 we combine upper and lower beads.",

  ruleAr: "٠-٤ = سفلية · ٥ = علوية · ٦-٩ = علوية + سفلية",
  ruleEn: "0–4 = lower · 5 = upper · 6–9 = upper + lower",

  ruleTable: [
    { formula: "٠", result: "لا شيء" },
    { formula: "١-٤", result: "خرزات سفلية" },
    { formula: "٥", result: "العلوية" },
    { formula: "٦", result: "٥ + ١" },
    { formula: "٧", result: "٥ + ٢" },
    { formula: "٨", result: "٥ + ٣" },
    { formula: "٩", result: "٥ + ٤" },
  ],

  storyAr:
    "قال حارس القلعة: تذكّروا القاعدة الذهبية — الخرزة التي تلمس الجسر هي التي تُحسب! الباقي نائم لا قيمة له. الآن ستمثّلون الأرقام بأيديكم على المعداد، وستصبحون سادة الأرقام!",

  storyEn:
    "The castle guard said: Remember the golden rule — only the bead touching the beam counts! The rest are sleeping and have no value. Now you will represent numbers with your own hands on the abacus, and become masters of numbers!",

  tactileActivity: {
    titleAr: "نشاط الأصابع الخمسة",
    titleEn: "Five Fingers Activity",
    materials: ["يداك", "بطاقات أرقام"],
    steps: [
      "استخدم يدك اليمنى لتمثيل الأرقام من ٠ إلى ٥",
      "السبابة تنزل الخرزة العلوية (٥)",
      "الإبهام يرفع الخرزات السفلية (١-٤)",
      "امزج بينهما لتمثيل ٦-٩",
    ],
    goalAr: "ربط الأصابع بحركات المعداد قبل التعلم الرقمي",
    goalEn: "Connect fingers to abacus movements",
  },

  examples: [
    {
      id: "L01.E1",
      problemText: "مثّل الرقم ٠ على السوروبان",
      answer: 0,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "لا توجد خرزة تلمس الجسر = ٠.",
      explanationEn: "No bead touching the beam = 0.",
    },
    {
      id: "L01.E2",
      problemText: "مثّل الرقم ١ على السوروبان",
      answer: 1,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "خرزة سفلية واحدة = ١.",
      explanationEn: "One lower bead = 1.",
    },
    {
      id: "L01.E3",
      problemText: "مثّل الرقم ٣ على السوروبان",
      answer: 3,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "ثلاث خرزات سفلية = ٣.",
      explanationEn: "Three lower beads = 3.",
    },
    {
      id: "L01.E4",
      problemText: "مثّل الرقم ٥ على السوروبان",
      answer: 5,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "الخرزة العلوية = ٥.",
      explanationEn: "The upper bead = 5.",
    },
    {
      id: "L01.E5",
      problemText: "مثّل الرقم ٦ على السوروبان",
      answer: 6,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٥ (علوية) + ١ (سفلية) = ٦.",
      explanationEn: "5 (upper) + 1 (lower) = 6.",
    },
    {
      id: "L01.E6",
      problemText: "مثّل الرقم ٧ على السوروبان",
      answer: 7,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٥ + ٢ = ٧.",
      explanationEn: "5 + 2 = 7.",
    },
    {
      id: "L01.E7",
      problemText: "مثّل الرقم ٨ على السوروبان",
      answer: 8,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٥ + ٣ = ٨.",
      explanationEn: "5 + 3 = 8.",
    },
    {
      id: "L01.E8",
      problemText: "مثّل الرقم ٩ على السوروبان",
      answer: 9,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٥ + ٤ = ٩.",
      explanationEn: "5 + 4 = 9.",
    },
    {
      id: "L01.E9",
      problemText: "ما الرقم المعروض؟ (علوية + ٢ سفلية)",
      answer: 7,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٥ + ٢ = ٧.",
      explanationEn: "5 + 2 = 7.",
    },
    {
      id: "L01.E10",
      problemText: "ما الرقم المعروض؟ (٤ سفلية فقط)",
      answer: 4,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٤ خرزات سفلية = ٤.",
      explanationEn: "Four lower beads = 4.",
    },
  ],

  estimatedMinutes: 45,
};

export default level01;