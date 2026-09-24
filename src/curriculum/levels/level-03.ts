// src/curriculum/levels/level-03.ts

import type { LevelContent } from "./types";

export const level03: LevelContent = {
  id: "L03",
  number: 3,
  category: "both",
  interactionMode: "abacus-representation",

  conceptAr: "الجمع المباشر — دون قواعد — من اليسار لليمين",
  conceptEn: "Direct addition — no rules — left to right",

  audioTextAr:
    "الآن نتعلم العمليات المباشرة! لا نحتاج أي قاعدة. القاعدة الذهبية: من اليسار إلى اليمين! نبدأ من العشرات قبل الآحاد، ومن المئات قبل العشرات. هذا سر السرعة في السوروبان.",

  audioTextEn:
    "Now we learn direct operations! No rules needed. The golden rule: from left to right! We start with tens before units, and hundreds before tens. This is the secret of soroban speed.",

  ruleAr: "الجمع = إبهام للأعلى · الطرح = سبابة للأسفل · من اليسار",
  ruleEn: "Add = thumb up · Subtract = index down · Left to right",

  ruleTable: [
    { formula: "١ + ٢", result: "٣" },
    { formula: "٥ + ٣", result: "٨" },
    { formula: "٩ - ٥", result: "٤" },
    { formula: "١٢ + ٢١", result: "٣٣" },
  ],

  storyAr:
    "قال حارس القلعة: عندما تتعاملون مع الأعداد الكبيرة، ابدؤوا من البيوت الكبيرة قبل الصغيرة. هذا سرّ السرعة في السوروبان!",

  storyEn:
    "The guard said: When dealing with big numbers, start with the bigger houses before the smaller ones. This is the secret of soroban speed!",

  tactileActivity: {
    titleAr: "نشاط الأعمدة الوهمية",
    titleEn: "Virtual Columns Activity",
    materials: ["ورقة", "قلم"],
    steps: [
      "ارسم عمودين: عشرات وآحاد",
      "اكتب ١٢ في العمودين",
      "أضف ٢١: أضف ٢ إلى العشرات أولاً",
      "ثم أضف ١ إلى الآحاد",
      "اقرأ النتيجة: ٣٣",
    ],
    goalAr: "فهم ترتيب العمليات من اليسار لليمين",
    goalEn: "Understand left-to-right operation order",
  },

  examples: [
    {
      id: "L03.E1",
      problemText: "١ + ٢ = ؟",
      answer: 3,
      ruleCategory: "direct",
      steps: [
        {
          stepIndex: 1,
          instructionAr: "ارفع خرزة واحدة",
          instructionEn: "Raise one bead",
          fingerUsed: "thumb",
          direction: "up",
          targetColumn: "units",
          beadsAffected: [1],
          expectedValueAfter: 1,
        },
        {
          stepIndex: 2,
          instructionAr: "ارفع خرزتين إضافيتين",
          instructionEn: "Raise two more beads",
          fingerUsed: "thumb",
          direction: "up",
          targetColumn: "units",
          beadsAffected: [2, 3],
          expectedValueAfter: 3,
        },
      ],
      explanationAr: "١ + ٢ = ٣ (لا نحتاج قاعدة).",
      explanationEn: "1 + 2 = 3 (no rule needed).",
    },
    {
      id: "L03.E2",
      problemText: "٥ + ٣ = ؟",
      answer: 8,
      ruleCategory: "direct",
      steps: [
        {
          stepIndex: 1,
          instructionAr: "أنزل الجدة ٥",
          instructionEn: "Lower the grandmother 5",
          fingerUsed: "index",
          direction: "down",
          targetColumn: "units",
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
        {
          stepIndex: 2,
          instructionAr: "ارفع ٣ أطفال",
          instructionEn: "Raise 3 children",
          fingerUsed: "thumb",
          direction: "up",
          targetColumn: "units",
          beadsAffected: [1, 2, 3],
          expectedValueAfter: 8,
        },
      ],
      explanationAr: "٥ + ٣ = ٨.",
      explanationEn: "5 + 3 = 8.",
    },
    {
      id: "L03.E3",
      problemText: "٩ - ٥ = ؟",
      answer: 4,
      ruleCategory: "direct",
      steps: [
        {
          stepIndex: 1,
          instructionAr: "مثّل ٩",
          instructionEn: "Represent 9",
          fingerUsed: "both_pinch",
          direction: "pinch_in",
          targetColumn: "units",
          beadsAffected: [5, 1, 2, 3, 4],
          expectedValueAfter: 9,
        },
        {
          stepIndex: 2,
          instructionAr: "ارفع الجدة ٥",
          instructionEn: "Raise grandmother 5",
          fingerUsed: "index",
          direction: "up",
          targetColumn: "units",
          beadsAffected: [5],
          expectedValueAfter: 4,
        },
      ],
      explanationAr: "٩ - ٥ = ٤.",
      explanationEn: "9 - 5 = 4.",
    },
    {
      id: "L03.E4",
      problemText: "٨ - ٣ = ؟",
      answer: 5,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٨ - ٣ = ٥ (الجدة تبقى وحدها).",
      explanationEn: "8 - 3 = 5 (grandmother stays alone).",
    },
    {
      id: "L03.E5",
      problemText: "١٢ + ٢١ = ؟",
      answer: 33,
      ruleCategory: "direct",
      steps: [
        {
          stepIndex: 1,
          instructionAr: "مثّل ١٢: عشرات أولاً ثم آحاد",
          instructionEn: "Represent 12: tens then units",
          fingerUsed: "thumb",
          direction: "up",
          targetColumn: "tens",
          beadsAffected: [1],
          expectedValueAfter: 10,
        },
        {
          stepIndex: 2,
          instructionAr: "أضف ٢ آحاد",
          instructionEn: "Add 2 units",
          fingerUsed: "thumb",
          direction: "up",
          targetColumn: "units",
          beadsAffected: [1, 2],
          expectedValueAfter: 12,
        },
        {
          stepIndex: 3,
          instructionAr: "أضف ٢١: أولاً عشرات",
          instructionEn: "Add 21: tens first",
          fingerUsed: "thumb",
          direction: "up",
          targetColumn: "tens",
          beadsAffected: [2, 3],
          expectedValueAfter: 32,
        },
        {
          stepIndex: 4,
          instructionAr: "ثم ١ آحاد",
          instructionEn: "Then 1 unit",
          fingerUsed: "thumb",
          direction: "up",
          targetColumn: "units",
          beadsAffected: [3],
          expectedValueAfter: 33,
        },
      ],
      explanationAr: "١٢ + ٢١ = ٣٣ (من اليسار).",
      explanationEn: "12 + 21 = 33 (from left).",
    },
    {
      id: "L03.E6",
      problemText: "٤٧ - ٢٥ = ؟",
      answer: 22,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٤٧ - ٢٥ = ٢٢.",
      explanationEn: "47 - 25 = 22.",
    },
    {
      id: "L03.E7",
      problemText: "١٢٣ + ١٠١ = ؟",
      answer: 224,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "١٢٣ + ١٠١ = ٢٢٤.",
      explanationEn: "123 + 101 = 224.",
    },
    {
      id: "L03.E8",
      problemText: "٢ + ٢ + ٥ - ١ = ؟",
      answer: 8,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٢ + ٢ + ٥ - ١ = ٨.",
      explanationEn: "2 + 2 + 5 - 1 = 8.",
    },
    {
      id: "L03.E9",
      problemText: "١٢٣ + ٥٥ - ٣٠ = ؟",
      answer: 148,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "١٢٣ + ٥٥ - ٣٠ = ١٤٨.",
      explanationEn: "123 + 55 - 30 = 148.",
    },
    {
      id: "L03.E10",
      problemText: "٣٣٣٣ - ١١١١ = ؟",
      answer: 2222,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٣٣٣٣ - ١١١١ = ٢٢٢٢.",
      explanationEn: "3333 - 1111 = 2222.",
    },
  ],

  estimatedMinutes: 60,
};

export default level03;