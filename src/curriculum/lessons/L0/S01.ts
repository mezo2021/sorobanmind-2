
// src/curriculum/lessons/L0/S01.ts
import type { LessonNode } from "../types";

export const L0_S01: LessonNode = {
  id: "L0-S01",
  skillId: "S01",
  levelId: "L0",
  order: 2,
  title: { ar: "تمثيل الأرقام من 0 إلى 9", en: "Representing Numbers 0-9" },
  emoji: "🔢",
  tags: ["build", "read", "kids", "L0"],

  story: {
    ar: "في يوم مشمس، وصل ثلاثة أبطال صغار — شام وريان وبانة — إلى بوابة خشبية ضخمة نُقش عليها: قلعة السوروبان، من يدخلها يصبح سيد الأرقام. دقّوا الجرس، فانفتح الباب، وظهر حارس القلعة: رجل خشبي اسمه الإطار. قال مبتسماً: في هذه القلعة تسكن عائلة غريبة — أربعة أطفال نشيطون في الطابق السفلي، كل واحد قيمته واحد. وفوق الجسر تسكن الجدة الحنونة، قيمتها خمسة.",
    en: "In the Castle of Soroban, four children live below the beam, each worth 1. Above the beam lives the kind grandmother, worth 5.",
  },
  storyAudioId: 1,

  modules: [
    {
      id: "m1",
      ruleCategory: "build",
      title: "تمثيل 0-4",
      titleEn: "Representing 0-4",
      emoji: "🧒",
      rule: { description: "لتمثيل 0-4: ارفع من 0 إلى 4 خرزات سفلية بالإبهام نحو العارضة." },
      condition: { formula: "0 ≤ n ≤ 4", explanation: "الأطفال الأربعة يكفون لتمثيل الأرقام من 0 إلى 4." },
      discrimination: {
        steps: [{
          question: "هل الرقم المطلوب بين 0 و 4؟",
          type: "yes-no",
          answer: "نعم → استخدم الأطفال (الخرزات السفلية)",
          hint: "0 = لا خرزات · 1 = خرزة · 2 = خرزتان · 3 = ثلاث · 4 = أربع",
        }],
        decision: "ارفع عددًا من الخرزات السفلية يساوي الرقم!",
      },
      watchPhase: {
        examples: [
          { id: "S01-m1-E1", question: "مثّل الرقم 0", discrimination: "لا خرزة تلامس العارضة = 0.", rule: "0 = لا خرزات", fingerMovement: "السبابة تُبعد كل الخرزات عن العارضة ⬇️", steps: ["المعداد مصفّر", "الخرزات بعيدة عن العارضة", "الناتج: 0"], result: 0, beadVisual: "صفر خرزات" },
          { id: "S01-m1-E2", question: "مثّل الرقم 1", discrimination: "الأطفال متوفّرون → طفل واحد يكفي.", rule: "1 = خرزة سفلية", fingerMovement: "الإبهام يرفع خرزة سفلية ⬆️", steps: ["ارفع خرزة سفلية بالإبهام ⬆️", "الناتج: 1"], result: 1, beadVisual: "خرزة سفلية واحدة" },
          { id: "S01-m1-E3", question: "مثّل الرقم 2", discrimination: "المطلوب 2 → الأطفال متوفّرون.", rule: "2 = خرزتان", fingerMovement: "الإبهام يرفع خرزتين ⬆️", steps: ["ارفع خرزتين بالإبهام ⬆️", "الناتج: 2"], result: 2, beadVisual: "خرزتان سفليتان" },
          { id: "S01-m1-E4", question: "مثّل الرقم 3", discrimination: "المطلوب 3 → الأطفال متوفّرون.", rule: "3 = ثلاث خرزات", fingerMovement: "الإبهام يرفع ثلاث خرزات ⬆️", steps: ["ارفع ثلاث خرزات بالإبهام ⬆️", "الناتج: 3"], result: 3, beadVisual: "ثلاث خرزات" },
          { id: "S01-m1-E5", question: "مثّل الرقم 4", discrimination: "المطلوب 4 → كل الأطفال.", rule: "4 = الأربع خرزات", fingerMovement: "الإبهام يرفع الأربع خرزات ⬆️", steps: ["ارفع الأربع خرزات بالإبهام ⬆️", "الناتج: 4"], result: 4, beadVisual: "أربع خرزات (العائلة كاملة)" },
        ],
      },
      tryPhase: {
        exercises: [
          { id: "S01-m1-T1", question: "مثّل 2", discrimination: "2 ≤ 4", steps: ["ارفع خرزتين بالإبهام ⬆️", "الناتج: 2"], result: 2 },
          { id: "S01-m1-T2", question: "مثّل 4", discrimination: "4 = كل الأطفال", steps: ["ارفع الأربع خرزات ⬆️", "الناتج: 4"], result: 4 },
          { id: "S01-m1-T3", question: "مثّل 1", discrimination: "1 = طفل", steps: ["ارفع خرزة واحدة ⬆️", "الناتج: 1"], result: 1 },
          { id: "S01-m1-T4", question: "مثّل 3", discrimination: "3 = ثلاثة أطفال", steps: ["ارفع ثلاث خرزات ⬆️", "الناتج: 3"], result: 3 },
        ],
      },
    },
    {
      id: "m2",
      ruleCategory: "build",
      title: "تمثيل 5-9",
      titleEn: "Representing 5-9",
      emoji: "👵",
      rule: { formula: "5 + k (حيث k = n − 5)", description: "أنزل الجدة 5 بالسبابة، ثم ارفع k خرزة سفلية بالإبهام." },
      condition: { formula: "5 ≤ n ≤ 9", explanation: "الجدة 5 + k خرزة سفلية." },
      discrimination: {
        steps: [
          { question: "هل الرقم بين 5 و 9؟", type: "yes-no", answer: "نعم → الجدة + أطفال" },
          { question: "كم طفلاً (k = n − 5)؟", type: "value", answer: "ارفع k خرزات", hint: "5=0 · 6=1 · 7=2 · 8=3 · 9=4" },
        ],
        decision: "أنزل 5 بالسبابة ⬇️، ارفع k بالإبهام ⬆️!",
      },
      watchPhase: {
        examples: [
          { id: "S01-m2-E1", question: "مثّل 5", discrimination: "5 = الجدة وحدها.", rule: "5 = العلوية", fingerMovement: "السبابة تُنزل العلوية ⬇️", steps: ["أنزل العلوية ⬇️", "الناتج: 5"], result: 5, beadVisual: "العلوية = 5" },
          { id: "S01-m2-E2", question: "مثّل 6", discrimination: "6 = 5+1.", rule: "6 = العلوية + 1", fingerMovement: "السبابة 5 ⬇️، الإبهام 1 ⬆️", steps: ["أنزل 5 ⬇️", "ارفع 1 ⬆️", "الناتج: 6"], result: 6, beadVisual: "5+1 = 6" },
          { id: "S01-m2-E3", question: "مثّل 7", discrimination: "7 = 5+2.", rule: "7 = العلوية + 2", fingerMovement: "5 ⬇️ ثم 2 ⬆️", steps: ["أنزل 5 ⬇️", "ارفع 2 ⬆️", "الناتج: 7"], result: 7, beadVisual: "5+2 = 7" },
          { id: "S01-m2-E4", question: "مثّل 8", discrimination: "8 = 5+3.", rule: "8 = العلوية + 3", fingerMovement: "5 ⬇️ ثم 3 ⬆️", steps: ["أنزل 5 ⬇️", "ارفع 3 ⬆️", "الناتج: 8"], result: 8, beadVisual: "5+3 = 8" },
          { id: "S01-m2-E5", question: "مثّل 9", discrimination: "9 = 5+4.", rule: "9 = العلوية + 4", fingerMovement: "5 ⬇️ ثم 4 ⬆️", steps: ["أنزل 5 ⬇️", "ارفع 4 ⬆️", "الناتج: 9"], result: 9, beadVisual: "5+4 = 9" },
        ],
      },
      tryPhase: {
        exercises: [
          { id: "S01-m2-T1", question: "مثّل 6", discrimination: "6 = 5+1", steps: ["5 ⬇️", "1 ⬆️", "الناتج: 6"], result: 6 },
          { id: "S01-m2-T2", question: "مثّل 8", discrimination: "8 = 5+3", steps: ["5 ⬇️", "3 ⬆️", "الناتج: 8"], result: 8 },
          { id: "S01-m2-T3", question: "مثّل 7", discrimination: "7 = 5+2", steps: ["5 ⬇️", "2 ⬆️", "الناتج: 7"], result: 7 },
          { id: "S01-m2-T4", question: "مثّل 9", discrimination: "9 = 5+4", steps: ["5 ⬇️", "4 ⬆️", "الناتج: 9"], result: 9 },
        ],
      },
    },
  ],

  outro: {
    summary: "أتقنت تمثيل الأرقام من 0 إلى 9!",
    encouragement: "🎉 أنت الآن تعرف لغة السوروبان الأولى!",
    totalExamples: 10,
  },

  estimatedMinutes: 15,
  xpReward: 10,
};

export default L0_S01;