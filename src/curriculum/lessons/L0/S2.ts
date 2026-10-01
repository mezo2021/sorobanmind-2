// src/curriculum/lessons/L0/S02.ts
import type { LessonNode } from "../types";

export const L0_S02: LessonNode = {
  id: "L0-S02",
  skillId: "S02",
  levelId: "L0",
  order: 3,
  title: { ar: "القيمة المكانية وبناء الأعداد", en: "Place Value" },
  emoji: "🏠",
  tags: ["build", "read", "kids", "L0", "place-value"],

  // بلا نص (سنستخدم welcome-sorobana.mp3)
  story: { ar: "", en: "" },
  storyAudioId: "welcome",

  modules: [
    {
      id: "m1",
      ruleCategory: "build",
      title: "الآحاد والعشرات",
      titleEn: "Units and Tens",
      emoji: "🔟",
      rule: { description: "كل عمود في المعداد يمثّل منزلة: الآحاد (يمين) ثم العشرات (يسار)." },
      condition: { formula: "n = عشرات × 10 + آحاد", explanation: "ابدأ من العشرات ثم الآحاد." },
      discrimination: {
        steps: [
          { question: "هل العدد يحتوي على عشرات؟", type: "yes-no", answer: "نعم → مثّل العشرات في العمود الثاني من اليمين" },
          { question: "كم عدد الآحاد؟", type: "value", answer: "مثّل الآحاد في العمود الأول" },
        ],
        decision: "ابدأ بالعشرات، ثم الآحاد!",
      },
      watchPhase: {
        examples: [
          { id: "S02-m1-E1", question: "مثّل 10", discrimination: "10 = عشرات (1) + آحاد (0)", rule: "10 = خرزة في العشرات", fingerMovement: "الإبهام يرفع 1 في العشرات ⬆️", steps: ["ارفع 1 في العشرات بالإبهام ⬆️", "اترك الآحاد فارغًا", "الناتج: 10"], result: 10, beadVisual: "1 عشرات + 0 = 10" },
          { id: "S02-m1-E2", question: "مثّل 12", discrimination: "12 = عشرات (1) + آحاد (2)", rule: "12 = 1 + 2", fingerMovement: "الإبهام يرفع 1 في العشرات ثم 2 في الآحاد", steps: ["ارفع 1 في العشرات ⬆️", "ارفع 2 في الآحاد ⬆️", "الناتج: 12"], result: 12, beadVisual: "1 + 2 = 12" },
          { id: "S02-m1-E3", question: "مثّل 25", discrimination: "25 = 20 + 5", rule: "25 = 2 + 5", fingerMovement: "الإبهام يرفع 2 في العشرات، السبابة تُنزل 5 في الآحاد", steps: ["ارفع 2 في العشرات ⬆️", "أنزل 5 في الآحاد ⬇️", "الناتج: 25"], result: 25, beadVisual: "2 + 5 = 25" },
          { id: "S02-m1-E4", question: "مثّل 47", discrimination: "47 = 40 + 7", rule: "47 = 4 + 7", fingerMovement: "الإبهام يرفع 4 في العشرات، ثم 5 و2 في الآحاد", steps: ["ارفع 4 في العشرات ⬆️", "نزّل 5 وارفع 2 في الآحاد", "الناتج: 47"], result: 47, beadVisual: "4 + 7 = 47" },
          { id: "S02-m1-E5", question: "مثّل 99", discrimination: "99 = 90 + 9", rule: "99 = كل عمود ممتلئ", fingerMovement: "في كل عمود: نزّل 5 وارفع 4", steps: ["العشرات: 5+4 = 9", "الآحاد: 5+4 = 9", "الناتج: 99"], result: 99, beadVisual: "9 + 9 = 99" },
        ],
      },
      tryPhase: {
        exercises: [
          { id: "S02-m1-T1", question: "مثّل 10", discrimination: "10 = 1 في العشرات", steps: ["ارفع 1 في العشرات ⬆️", "الناتج: 10"], result: 10 },
          { id: "S02-m1-T2", question: "مثّل 12", discrimination: "12 = 1 + 2", steps: ["ارفع 1 في العشرات ⬆️", "ارفع 2 في الآحاد ⬆️", "الناتج: 12"], result: 12 },
          { id: "S02-m1-T3", question: "مثّل 35", discrimination: "35 = 3 + 5", steps: ["ارفع 3 في العشرات ⬆️", "أنزل 5 في الآحاد ⬇️", "الناتج: 35"], result: 35 },
          { id: "S02-m1-T4", question: "مثّل 68", discrimination: "68 = 6 + 8", steps: ["العشرات: 5+1 = 6", "الآحاد: 5+3 = 8", "الناتج: 68"], result: 68 },
        ],
      },
    },
    {
      id: "m2",
      ruleCategory: "build",
      title: "المئات والآلاف",
      titleEn: "Hundreds and Thousands",
      emoji: "💯",
      rule: { description: "عمود المئات × 100، وعمود الآلاف × 1000." },
      condition: { formula: "n = آلاف×1000 + مئات×100 + عشرات×10 + آحاد", explanation: "اقرأ من اليسار إلى اليمين." },
      discrimination: {
        steps: [{ question: "كم عدد المنازل؟", type: "value", answer: "ابدأ من أكبر منزلة", hint: "آلاف ← مئات ← عشرات ← آحاد" }],
        decision: "ابدأ من أكبر منزلة وانتقل يمينًا!",
      },
      watchPhase: {
        examples: [
          { id: "S02-m2-E1", question: "مثّل 100", discrimination: "100 = 1 في المئات", rule: "100 = خرزة في المئات", fingerMovement: "الإبهام يرفع 1 في المئات ⬆️", steps: ["ارفع 1 في المئات ⬆️", "الناتج: 100"], result: 100, beadVisual: "1 + 0 + 0 = 100" },
          { id: "S02-m2-E2", question: "مثّل 134", discrimination: "134 = 100 + 30 + 4", rule: "134 = 1 + 3 + 4", fingerMovement: "ارفع 1 في المئات، 3 في العشرات، 4 في الآحاد", steps: ["ارفع 1 في المئات ⬆️", "ارفع 3 في العشرات ⬆️", "ارفع 4 في الآحاد ⬆️", "الناتج: 134"], result: 134, beadVisual: "1 + 3 + 4 = 134" },
          { id: "S02-m2-E3", question: "مثّل 1000", discrimination: "1000 = 1 في الآلاف", rule: "1000 = خرزة في الآلاف", fingerMovement: "الإبهام يرفع 1 في الآلاف ⬆️", steps: ["ارفع 1 في الآلاف ⬆️", "الناتج: 1000"], result: 1000, beadVisual: "1 + 0 + 0 + 0 = 1000" },
        ],
      },
      tryPhase: {
        exercises: [
          { id: "S02-m2-T1", question: "مثّل 100", discrimination: "1 في المئات", steps: ["ارفع 1 في المئات ⬆️", "الناتج: 100"], result: 100 },
          { id: "S02-m2-T2", question: "مثّل 234", discrimination: "234 = 2+3+4", steps: ["ارفع 2 في المئات", "ارفع 3 في العشرات", "ارفع 4 في الآحاد", "الناتج: 234"], result: 234 },
          { id: "S02-m2-T3", question: "مثّل 1500", discrimination: "1500 = 1+5", steps: ["ارفع 1 في الآلاف ⬆️", "أنزل 5 في المئات ⬇️", "الناتج: 1500"], result: 1500 },
        ],
      },
    },
  ],

  outro: {
    summary: "أتقنت القيمة المكانية! تستطيع بناء أي عدد على المعداد.",
    encouragement: "🎉 أنت الآن ملك الأعداد الكبيرة!",
    totalExamples: 8,
  },

  estimatedMinutes: 15,
  xpReward: 10,
};

export default L0_S02;