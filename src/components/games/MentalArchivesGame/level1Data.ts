// src/components/games/MentalArchivesGame/level1Data.ts

export const GAME_ID = 'mental-archives';
export const DEFAULT_HERO = 'joud';

export const LEVEL_1_DATA = {
  titleAr: 'المستوى الأول: رفوف الذاكرة',
  titleEn: 'Level 1: Memory Shelves',
  timePerQuestionMs: 14400, // 14.4 ثانية
  requiredCorrect: 3, // نحتاج 3 إجابات صحيحة
  
  story: [
    { character: "sorobana", textAr: "أهلاً بكما في أرشيف إبلا الرقمي. الطيف الصفري يمحو الروابط بين الألواح الطينية." },
    { character: "jud", textAr: "الأرقام موجودة، لكن المجاميع غير متصلة بالسجلات!" },
    { character: "aseel", textAr: "سنصلحها. جود، تذكر أن المعداد هنا هو محاكاة تعليمية من المستقبل، وليس أداة أثرية." }
  ],
  
  example: {
    titleAr: "المثال المحلول (جمع مباشر)",
    problem: "2 + 3 + 1 = ؟",
    stepsAr: [
      "نمثل الرقم 2: نرفع خرزتين سفليتين في خانة الآحاد.",
      "نضيف 3: لا توجد خرزات سفلية كافية، فنستخدم قاعدة (الصديق الصغير): ننزل الخرزة العلوية (+5) ونبعد خرزتين سفليتين (-2). المجموع أصبح 5.",
      "نضيف 1: نرفع خرزة سفلية واحدة.",
      "النتيجة النهائية: 6."
    ]
  },
  
  questions: [
    { id: "q1", type: "direct", numbers: [3, 2, 4], answer: 9 },
    { id: "q2", type: "direct", numbers: [1, 5, 2], answer: 8 },
    { id: "q3", type: "complement5", numbers: [3, 4, 1], answer: 8 },
    { id: "q4", type: "complement5", numbers: [2, 3, 4], answer: 9 }
  ]
};