// src/components/games/MentalArchivesGame/level1Data.ts

export const GAME_ID = 'mental-archives';
export const DEFAULT_HERO = 'joud';

export const LEVEL_1_DATA = {
  titleAr: 'المستوى الأول: رفوف الذاكرة',
  titleEn: 'Level 1: Memory Shelves',
  timePerQuestionMs: 14400,
  requiredCorrect: 3, 
  
  story: [
    // 👇 مشهد المقدمة في تركيا (مرسين)
    { 
      character: "jud", 
      textAr: "في ليلة هادئة على ساحل مرسين، كنا نراجع حساباتنا. فجأة، بدأت الخرزات في المعداد تلمع وتنزلق وحدها!" 
    },
    { 
      character: "aseel", 
      textAr: "جود، انظر! هذه ليست أداة عادية. هناك دوائر من الضوء تتشكل في الهواء، وكأنها بوابة!" 
    },
    { 
      character: "sorobana", 
      textAr: "مرحباً بكما. أنا سوروبانا، مرشدة أرشيفية من المستقبل (2125). الطيف الصفري يمحو الروابط بين السجلات الزمنية. إذا اختفت الصلات، لن يعرف أطفال المستقبل كيف تطورت الأرقام." 
    },
    { 
      character: "jud", 
      textAr: "كيف يمكننا مساعدتك؟" 
    },
    { 
      character: "sorobana", 
      textAr: "عبر هذه البوابة، ستسافران إلى أقدم السجلات. ابدآ من إبلا وماري. لكن تذكرا: المعداد الذي في يدكما هو أداة تعليمية مستقبلية، وليس أداة أثرية من ذلك العصر." 
    },
    // 👇 الانتقال إلى إبلا
    { 
      character: "aseel", 
      textAr: "وصلنا! هذه ألواح إبلا الطينية. الطيف الصفري يمسح الأرقام التي تربط السجلات!" 
    },
    { 
      character: "jud", 
      textAr: "الأرقام موجودة، لكن المجاميع غير متصلة. سنصلحها بالعد الذهني!" 
    }
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