// src/curriculum/levels/level-02.ts

import type { LevelContent } from "./types";

export const level02: LevelContent = {
  id: "L02",
  number: 2,
  category: "both",
  interactionMode: "abacus-representation",

  conceptAr: "كل عمود يمثل منزلة: الآحاد، العشرات، المئات",
  conceptEn: "Each column represents a place: units, tens, hundreds",

  audioTextAr:
    "كل عمود على السوروبان يمثل منزلة رقمية. العمود الأول على اليمين للآحاد، الثاني للعشرات، الثالث للمئات، الرابع للآلاف. عندما نكتب ٢٥، الخرزتان في عمود العشرات تساويان ٢٠، والخمسة في عمود الآحاد تساوي ٥.",

  audioTextEn:
    "Each rod on the soroban represents a place value. The first rod on the right is units, second is tens, third is hundreds, fourth is thousands. When we write 25, the two beads in the tens column equal 20, and the five in the units column equals 5.",

  ruleAr: "من اليمين: آحاد ← عشرات ← مئات ← آلاف",
  ruleEn: "From right: units → tens → hundreds → thousands",

  ruleTable: [
    { formula: "العمود ١", result: "آحاد" },
    { formula: "العمود ٢", result: "عشرات" },
    { formula: "العمود ٣", result: "مئات" },
    { formula: "العمود ٤", result: "آلاف" },
  ],

  storyAr:
    "قال الحارس: انظروا إلى الأعمدة — كل عمود هو بيت لعائلة. البيت الأول على اليمين يسكنه الآحاد. البيت الثاني يسكنه العشرات. البيت الثالث للمئات. عندما تجتمع العائلات، تصنع الأعداد الكبيرة!",

  storyEn:
    "The guard said: Look at the columns — each column is a house for a family. The first house on the right is home to the units. The second is for the tens. The third is for the hundreds. When families gather, they form big numbers!",

  tactileActivity: {
    titleAr: "نشاط البيوت الثلاثة",
    titleEn: "Three Houses Activity",
    materials: ["٣ صناديق صغيرة", "بطاقات أرقام ٠-٩"],
    steps: [
      "سمّ الصندوق الأول: الآحاد",
      "سمّ الصندوق الثاني: العشرات",
      "سمّ الصندوق الثالث: المئات",
      "ضع في كل صندوق عدداً من ٠ إلى ٩",
      "اسأل طفلك: ما الرقم الذي يمثله هذا الترتيب؟",
    ],
    goalAr: "فهم مفهوم المنازل قبل تطبيقه على المعداد",
    goalEn: "Understand place value before applying to abacus",
  },

  examples: [
    {
      id: "L02.E1",
      problemText: "مثّل الرقم ١٠",
      answer: 10,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "١ في العشرات + ٠ في الآحاد = ١٠.",
      explanationEn: "1 in tens + 0 in units = 10.",
    },
    {
      id: "L02.E2",
      problemText: "مثّل الرقم ٢٥",
      answer: 25,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٢ في العشرات + ٥ في الآحاد = ٢٥.",
      explanationEn: "2 in tens + 5 in units = 25.",
    },
    {
      id: "L02.E3",
      problemText: "مثّل الرقم ٤٧",
      answer: 47,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٤ في العشرات + ٧ في الآحاد = ٤٧.",
      explanationEn: "4 in tens + 7 in units = 47.",
    },
    {
      id: "L02.E4",
      problemText: "مثّل الرقم ١٠٠",
      answer: 100,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "١ في المئات = ١٠٠.",
      explanationEn: "1 in hundreds = 100.",
    },
    {
      id: "L02.E5",
      problemText: "مثّل الرقم ١٣٤",
      answer: 134,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "١ مئات + ٣ عشرات + ٤ آحاد = ١٣٤.",
      explanationEn: "1 hundreds + 3 tens + 4 units = 134.",
    },
    {
      id: "L02.E6",
      problemText: "ما الرقم؟ (١ مئات + ٢ عشرات + ٣ آحاد)",
      answer: 123,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "١٢٣.",
      explanationEn: "123.",
    },
    {
      id: "L02.E7",
      problemText: "ما الرقم؟ (٥ عشرات + ٠ آحاد)",
      answer: 50,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٥٠.",
      explanationEn: "50.",
    },
    {
      id: "L02.E8",
      problemText: "ما الرقم؟ (٩ مئات + ٩ عشرات + ٩ آحاد)",
      answer: 999,
      ruleCategory: "direct",
      steps: [],
      explanationAr: "٩٩٩.",
      explanationEn: "999.",
    },
  ],

  estimatedMinutes: 45,
};

export default level02;