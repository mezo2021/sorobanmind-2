// src/components/games/MentalArchivesGame/level1Data.ts

export const ASSETS = {
  introVideo: '/assets/mental-archives/intro.mp4',
  joud: '/assets/mental-archives/joud.png',
  aseel: '/assets/mental-archives/aseel.png',
  sorobana: '/assets/mental-archives/sorobana.png',
};

export const GAME_ID = 'mental-archives';
export const DEFAULT_HERO = 'joud'; // البطل الافتراضي لهذه اللعبة

export const LEVEL_1_DATA = {
  titleAr: 'المستوى الأول: رفوف الذاكرة',
  titleEn: 'Level 1: Memory Shelves',
  locationAr: 'إبلا وماري (الألف الثالث ق.م)',
  timePerQuestionMs: 14400, // 14.4 ثانية
  requiredCorrect: 3, // نحتاج 3 إجابات صحيحة للنجاح
  
  story: [
    { character: "sorobana", textAr: "أهلاً بكما في أرشيف إبلا الرقمي. الطيف الصفري يمحو الروابط بين الألواح الطينية.", textEn: "Welcome to the Ebla digital archive. The Zero Spectrum is erasing links between clay tablets." },
    { character: "jud", textAr: "الأرقام موجودة، لكن المجاميع غير متصلة بالسجلات!", textEn: "The numbers are there, but the sums aren't connected to the records!" },
    { character: "aseel", textAr: "سنصلحها. جود، تذكر أن المعداد هنا هو محاكاة تعليمية من المستقبل، وليس أداة أثرية.", textEn: "We'll fix them. Jud, remember the abacus here is a future educational simulation, not an ancient tool." }
  ],
  
  example: {
    titleAr: "المثال المحلول (جمع مباشر)",
    titleEn: "Solved Example (Direct Addition)",
    problem: "2 + 3 + 1 = ؟",
    stepsAr: [
      "نمثل الرقم 2: نرفع خرزتين سفليتين في خانة الآحاد.",
      "نضيف 3: نرفع ثلاث خرزات سفلية (المجموع أصبح 5).",
      "نضيف 1: نرفع خرزة سفلية واحدة.",
      "النتيجة النهائية: 6."
    ],
    stepsEn: [
      "Represent 2: Move two lower beads up in the ones column.",
      "Add 3: Move three lower beads up (sum becomes 5).",
      "Add 1: Move one lower bead up.",
      "Final result: 6."
    ]
  },
  
  questions: [
    { id: "q1", type: "direct", numbers: [3, 2, 4], answer: 9 },
    { id: "q2", type: "direct", numbers: [1, 5, 2], answer: 8 },
    { id: "q3", type: "complement5", numbers: [3, 4, 1], answer: 8 },
    { id: "q4", type: "complement5", numbers: [2, 3, 4], answer: 9 }
  ]
};