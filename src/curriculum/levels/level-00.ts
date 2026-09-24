// src/curriculum/levels/level-00.ts

import type { LevelContent } from "./types";

export const level00: LevelContent = {
  id: "L00",
  number: 0,
  category: "both",
  interactionMode: "read-soroban",

  conceptAr: "السوروبان آلة حساب يابانية عمرها أكثر من ٤٠٠ سنة",
  conceptEn: "The soroban is a Japanese calculating tool over 400 years old",

  audioTextAr:
    "مرحباً بكم في عالم السوروبان! السوروبان آلة حساب يابانية عمرها أكثر من أربعمائة سنة. اخترعه اليابانيون لتنشيط الدماغ وتقوية الذاكرة. جسر أفقي يقسم المعداد، وتحته أربع خرزات كل واحدة تساوي واحد، وفوقه خرزة واحدة تساوي خمسة.",

  audioTextEn:
    "Welcome to the world of the soroban! The soroban is a Japanese calculating tool over four hundred years old. It has a horizontal beam, below it four beads each worth one, and above it one bead worth five.",

  ruleAr: "الخرزة العلوية = ٥ · كل خرزة سفلية = ١",
  ruleEn: "Upper bead = 5 · Each lower bead = 1",

  ruleTable: [
    { formula: "العلوية", result: "٥" },
    { formula: "السفلية", result: "١" },
    { formula: "العمود", result: "٥ + ٤ = ٩" },
  ],

  storyAr:
    "في يوم مشمس، وصل ثلاثة أبطال صغار إلى بوابة خشبية ضخمة نُقش عليها: قلعة السوروبان — من يدخلها يصبح سيد الأرقام. دقّوا الجرس، فانفتح الباب، وظهر حارس القلعة: رجل خشبي اسمه الإطار. قال مبتسماً: في هذه القلعة تسكن عائلة غريبة — أربعة أطفال نشيطون في الطابق السفلي، كل واحد قيمته واحد. وفوق الجسر تسكن الجدة الحنونة، قيمتها خمسة.",

  storyEn:
    "On a sunny day, three young heroes reached a giant wooden gate engraved with: Castle of the Soroban — whoever enters becomes master of numbers. They rang the bell, the gate opened, and the castle guard appeared: a wooden man named the Frame. He said with a smile: In this castle lives a strange family — four active children downstairs, each worth one. Above the beam lives the kind grandmother, worth five.",

  tactileActivity: {
    titleAr: "نشاط بناء السوروبان",
    titleEn: "Build Your Soroban",
    materials: ["إطار من الكرتون", "١٠ خرزات خشبية", "أعواد أسنان"],
    steps: [
      "اصنع إطاراً من الكرتون على شكل مستطيل",
      "اقسمه بجسر أفقي إلى قسمين",
      "أدخل ٤ خرزات في القسم السفلي",
      "أدخل خرزة واحدة في القسم العلوي",
      "أعط الجدة الخرزة العلوية، والأطفال الخرزات السفلية",
    ],
    goalAr: "فهم البنية الفيزيائية للسوروبان قبل التعلم النظري",
    goalEn: "Understand the physical structure of the soroban",
  },

  examples: [
    {
      id: "L00.E1",
      problemText: "ما قيمة الخرزة العلوية (الجدة)؟",
      answer: 5,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "الخرزة العلوية وحدها تساوي ٥.",
      explanationEn: "The upper bead alone is worth 5.",
    },
    {
      id: "L00.E2",
      problemText: "ما قيمة كل خرزة سفلية (طفل)؟",
      answer: 1,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "كل خرزة سفلية تساوي ١.",
      explanationEn: "Each lower bead is worth 1.",
    },
    {
      id: "L00.E3",
      problemText: "كم خرزة سفلية في العمود الواحد؟",
      answer: 4,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "في كل عمود أربع خرزات سفلية.",
      explanationEn: "Each column has four lower beads.",
    },
    {
      id: "L00.E4",
      problemText: "كم خرزة كلياً في العمود الواحد؟",
      answer: 5,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٤ سفلية + ١ علوية = ٥ خرزات.",
      explanationEn: "4 lower + 1 upper = 5 beads.",
    },
    {
      id: "L00.E5",
      problemText: "الجدة (٥) + طفلان = ؟",
      answer: 7,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٥ + ٢ = ٧.",
      explanationEn: "5 + 2 = 7.",
    },
    {
      id: "L00.E6",
      problemText: "الجدة + كل الأطفال = ؟",
      answer: 9,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٥ + ٤ = ٩.",
      explanationEn: "5 + 4 = 9.",
    },
    {
      id: "L00.E7",
      problemText: "كم عموداً عادة في السوروبان؟",
      answer: 13,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "السوروبان التقليدي فيه ١٣ عموداً.",
      explanationEn: "A traditional soroban has 13 rods.",
    },
    {
      id: "L00.E8",
      problemText: "كم إصبعاً نستخدم لتحريك الخرزات؟",
      answer: 2,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "الإبهام للرفع، والسبابة للإنزال.",
      explanationEn: "Thumb to push up, index finger to push down.",
    },
  ],

  estimatedMinutes: 30,
};

export default level00;