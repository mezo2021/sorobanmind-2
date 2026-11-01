// src/components/games/MentalArchivesGame/level1Data.ts

export const LEVEL_1_DATA = {
  id: "level-1-ebla-mari",
  title: "المستوى الأول: رفوف الذاكرة",
  location: "إبلا وماري (الألف الثالث ق.م)",
  timePerQuestionMs: 14400, // 14.4 ثانية
  requiredCorrect: 3, // نحتاج 3 إجابات صحيحة من أصل 4 للنجاح
  
  story: [
    { character: "sorobana", text: "أهلاً بكما في أرشيف إبلا الرقمي. الطيف الصفري يمحو الروابط بين الألواح الطينية." },
    { character: "jud", text: "الأرقام موجودة، لكن المجاميع غير متصلة بالسجلات!" },
    { character: "aseel", text: "سنصلحها. جود، تذكر أن المعداد هنا هو محاكاة تعليمية من المستقبل، وليس أداة أثرية." }
  ],
  
  example: {
    title: "المثال المحلول (جمع مباشر)",
    problem: "2 + 3 + 1 = ؟",
    steps: [
      "نمثل الرقم 2: نرفع خرزتين سفليتين في خانة الآحاد.",
      "نضيف 3: نرفع ثلاث خرزات سفلية (المجموع أصبح 5).",
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