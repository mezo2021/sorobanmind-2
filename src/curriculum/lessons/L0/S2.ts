// src/curriculum/lessons/L0/S2.ts
// 📖 درس S2: القيمة المكانية وبناء الأعداد

import type { LessonNode, LessonExample, TryQuestion } from '../types';

// ═══════════════════════════════════════════════════════════
// 📝 الأمثلة المحلولة (10 — "تعلّم" — متسلسل)
// ═══════════════════════════════════════════════════════════

const EXAMPLES: LessonExample[] = [
  {
    id: 'L0-S2-E1',
    problemText: 'مثّل الرقم 10',
    answer: 10,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في العشرات: ارفع خرزة واحدة (10)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'tens',
        beadsAffected: [1],
        expectedValueAfter: 10,
      },
    ],
    explanation: 'خرزة عشرات واحدة = 10، والآحاد فارغ.',
  },
  {
    id: 'L0-S2-E2',
    problemText: 'مثّل الرقم 23',
    answer: 23,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في الآحاد: ارفع ثلاث خرزات (3)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'units',
        beadsAffected: [1, 2, 3],
        expectedValueAfter: 3,
      },
      {
        stepIndex: 2,
        instructionText: 'في العشرات: ارفع خرزتين (20)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'tens',
        beadsAffected: [1, 2],
        expectedValueAfter: 23,
      },
    ],
    explanation: '23 = 20 + 3.',
  },
  {
    id: 'L0-S2-E3',
    problemText: 'مثّل الرقم 45',
    answer: 45,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في الآحاد: أنزل العلوية (5)',
        fingerUsed: 'index',
        direction: 'down',
        targetColumn: 'units',
        beadsAffected: [5],
        expectedValueAfter: 5,
      },
      {
        stepIndex: 2,
        instructionText: 'في العشرات: ارفع أربع خرزات (40)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'tens',
        beadsAffected: [1, 2, 3, 4],
        expectedValueAfter: 45,
      },
    ],
    explanation: '45 = 40 + 5.',
  },
  {
    id: 'L0-S2-E4',
    problemText: 'مثّل الرقم 68',
    answer: 68,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في الآحاد: أنزل العلوية + ارفع 3 (8)',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'units',
        beadsAffected: [5, 1, 2, 3],
        expectedValueAfter: 8,
      },
      {
        stepIndex: 2,
        instructionText: 'في العشرات: أنزل العلوية + ارفع 1 (60)',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'tens',
        beadsAffected: [5, 1],
        expectedValueAfter: 68,
      },
    ],
    explanation: '68 = 60 + 8.',
  },
  {
    id: 'L0-S2-E5',
    problemText: 'مثّل الرقم 99',
    answer: 99,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في الآحاد: 9 (علوية + أربع سفلية)',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'units',
        beadsAffected: [5, 1, 2, 3, 4],
        expectedValueAfter: 9,
      },
      {
        stepIndex: 2,
        instructionText: 'في العشرات: 9 (علوية + أربع سفلية)',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'tens',
        beadsAffected: [5, 1, 2, 3, 4],
        expectedValueAfter: 99,
      },
    ],
    explanation: '99 = أقصى عدد بخانتين.',
  },
  {
    id: 'L0-S2-E6',
    problemText: 'مثّل الرقم 100',
    answer: 100,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في المئات: ارفع خرزة واحدة (100)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'hundreds',
        beadsAffected: [1],
        expectedValueAfter: 100,
      },
    ],
    explanation: '100 = خرزة واحدة في المئات.',
  },
  {
    id: 'L0-S2-E7',
    problemText: 'مثّل الرقم 234',
    answer: 234,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في الآحاد: ارفع أربع خرزات (4)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'units',
        beadsAffected: [1, 2, 3, 4],
        expectedValueAfter: 4,
      },
      {
        stepIndex: 2,
        instructionText: 'في العشرات: ارفع ثلاث خرزات (30)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'tens',
        beadsAffected: [1, 2, 3],
        expectedValueAfter: 34,
      },
      {
        stepIndex: 3,
        instructionText: 'في المئات: ارفع خرزتين (200)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'hundreds',
        beadsAffected: [1, 2],
        expectedValueAfter: 234,
      },
    ],
    explanation: '234 = 200 + 30 + 4.',
  },
  {
    id: 'L0-S2-E8',
    problemText: 'مثّل الرقم 507',
    answer: 507,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في الآحاد: أنزل العلوية + ارفع 2 (7)',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'units',
        beadsAffected: [5, 1, 2],
        expectedValueAfter: 7,
      },
      {
        stepIndex: 2,
        instructionText: 'في العشرات: صفر — لا خرزة',
        fingerUsed: 'index',
        direction: 'down',
        targetColumn: 'tens',
        beadsAffected: [],
        expectedValueAfter: 7,
      },
      {
        stepIndex: 3,
        instructionText: 'في المئات: أنزل العلوية (500)',
        fingerUsed: 'index',
        direction: 'down',
        targetColumn: 'hundreds',
        beadsAffected: [5],
        expectedValueAfter: 507,
      },
    ],
    explanation: '507 = 500 + 0 + 7. الصفر في العشرات مهم.',
  },
  {
    id: 'L0-S2-E9',
    problemText: 'مثّل الرقم 999',
    answer: 999,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في الآحاد: 9',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'units',
        beadsAffected: [5, 1, 2, 3, 4],
        expectedValueAfter: 9,
      },
      {
        stepIndex: 2,
        instructionText: 'في العشرات: 9',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'tens',
        beadsAffected: [5, 1, 2, 3, 4],
        expectedValueAfter: 99,
      },
      {
        stepIndex: 3,
        instructionText: 'في المئات: 9',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'hundreds',
        beadsAffected: [5, 1, 2, 3, 4],
        expectedValueAfter: 999,
      },
    ],
    explanation: '999 = أقصى عدد بثلاث خانات.',
  },
  {
    id: 'L0-S2-E10',
    problemText: 'مثّل الرقم 1000',
    answer: 1000,
    ruleCategory: 'build',
    steps: [
      {
        stepIndex: 1,
        instructionText: 'في الآلاف: ارفع خرزة واحدة (1000)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'thousands',
        beadsAffected: [1],
        expectedValueAfter: 1000,
      },
    ],
    explanation: '1000 = خرزة واحدة في الآلاف.',
  },
];

// ═══════════════════════════════════════════════════════════
// ✏️ أسئلة "جرّب" (10 — عشوائية)
// ═══════════════════════════════════════════════════════════

const TRY_QUESTIONS: TryQuestion[] = [
  {
    id: 'L0-S2-T01',
    type: 'build-value',
    prompt: 'ما قيمة الرقم ٣ في العدد ٣٥؟ ابنها على المعداد',
    expectedValue: 30,
    steps: [
      {
        stepIndex: 1,
        instructionText: 'الرقم ٣ في عمود العشرات، ارفع ثلاث خرزات هناك',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'tens',
        beadsAffected: [1, 2, 3],
        expectedValueAfter: 30,
      },
    ],
    explanation: '٣ في العشرات = ٣ × ١٠ = ٣٠.',
  },
  {
    id: 'L0-S2-T02',
    type: 'build-value',
    prompt: 'ما قيمة الرقم ٧ في العدد ٧٢؟ ابنها على المعداد',
    expectedValue: 70,
    steps: [
      {
        stepIndex: 1,
        instructionText: '٧ في العشرات = علوية + خرزتين',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'tens',
        beadsAffected: [5, 1, 2],
        expectedValueAfter: 70,
      },
    ],
    explanation: '٧ في العشرات = ٧ × ١٠ = ٧٠.',
  },
  {
    id: 'L0-S2-T03',
    type: 'build-value',
    prompt: 'ما قيمة الرقم ٥ في العدد ٣٥؟ ابنها على المعداد',
    expectedValue: 5,
    steps: [
      {
        stepIndex: 1,
        instructionText: '٥ في الآحاد = أنزل الخرزة العلوية',
        fingerUsed: 'index',
        direction: 'down',
        targetColumn: 'units',
        beadsAffected: [5],
        expectedValueAfter: 5,
      },
    ],
    explanation: '٥ في الآحاد = ٥.',
  },
  {
    id: 'L0-S2-T04',
    type: 'build-value',
    prompt: 'ما قيمة الرقم ٥ في العدد ٥٠٧؟ ابنها على المعداد',
    expectedValue: 500,
    steps: [
      {
        stepIndex: 1,
        instructionText: '٥ في المئات = أنزل الخرزة العلوية هناك',
        fingerUsed: 'index',
        direction: 'down',
        targetColumn: 'hundreds',
        beadsAffected: [5],
        expectedValueAfter: 500,
      },
    ],
    explanation: '٥ في المئات = ٥ × ١٠٠ = ٥٠٠.',
  },
  {
    id: 'L0-S2-T05',
    type: 'compare',
    prompt: 'أيّهما أكبر؟',
    expectedValue: 340,
    choices: [340, 304],
    explanation: 'العشرات: 340 فيه 4، و304 فيه 0. لذلك 340 أكبر.',
  },
  {
    id: 'L0-S2-T06',
    type: 'sequence',
    prompt: 'رتّب الأرقام تصاعدياً',
    expectedValue: 125,
    choices: [152, 125, 215],
    explanation: 'الترتيب: 125 ثم 152 ثم 215.',
  },
  {
    id: 'L0-S2-T07',
    type: 'build',
    prompt: 'مثّل العدد ٤٢٦ على المعداد',
    expectedValue: 426,
    steps: [
      {
        stepIndex: 1,
        instructionText: 'الآحاد: ٦ = علوية + خرزة',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'units',
        beadsAffected: [5, 1],
        expectedValueAfter: 6,
      },
      {
        stepIndex: 2,
        instructionText: 'العشرات: ٢',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'tens',
        beadsAffected: [1, 2],
        expectedValueAfter: 26,
      },
      {
        stepIndex: 3,
        instructionText: 'المئات: ٤',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'hundreds',
        beadsAffected: [1, 2, 3, 4],
        expectedValueAfter: 426,
      },
    ],
    explanation: '426 = 4 مئات + 2 عشرات + 6 آحاد.',
  },
  {
    id: 'L0-S2-T08',
    type: 'build',
    prompt: 'مثّل العدد ٧٣ على المعداد',
    expectedValue: 73,
    steps: [
      {
        stepIndex: 1,
        instructionText: 'الآحاد: ارفع ٣',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'units',
        beadsAffected: [1, 2, 3],
        expectedValueAfter: 3,
      },
      {
        stepIndex: 2,
        instructionText: 'العشرات: علوية + خرزتين (٧)',
        fingerUsed: 'both_pinch',
        direction: 'pinch_in',
        targetColumn: 'tens',
        beadsAffected: [5, 1, 2],
        expectedValueAfter: 73,
      },
    ],
    explanation: '73 = 0 مئات + 7 عشرات + 3 آحاد.',
  },
  {
    id: 'L0-S2-T09',
    type: 'build',
    prompt: 'مثّل العدد ٣٠٥٠ على المعداد',
    expectedValue: 3050,
    steps: [
      {
        stepIndex: 1,
        instructionText: 'العشرات: أنزل العلوية (٥٠)',
        fingerUsed: 'index',
        direction: 'down',
        targetColumn: 'tens',
        beadsAffected: [5],
        expectedValueAfter: 50,
      },
      {
        stepIndex: 2,
        instructionText: 'الآلاف: ارفع ٣ (٣٠٠٠)',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'thousands',
        beadsAffected: [1, 2, 3],
        expectedValueAfter: 3050,
      },
    ],
    explanation: '3050 = 3000 + 0 + 50 + 0.',
  },
  {
    id: 'L0-S2-T10',
    type: 'build',
    prompt: 'مثّل العدد ١٠٢٤ على المعداد',
    expectedValue: 1024,
    steps: [
      {
        stepIndex: 1,
        instructionText: 'الآحاد: ارفع ٤',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'units',
        beadsAffected: [1, 2, 3, 4],
        expectedValueAfter: 4,
      },
      {
        stepIndex: 2,
        instructionText: 'العشرات: ارفع ٢',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'tens',
        beadsAffected: [1, 2],
        expectedValueAfter: 24,
      },
      {
        stepIndex: 3,
        instructionText: 'الآلاف: ارفع ١',
        fingerUsed: 'thumb',
        direction: 'up',
        targetColumn: 'thousands',
        beadsAffected: [1],
        expectedValueAfter: 1024,
      },
    ],
    explanation: '1024 = 1000 + 0 + 20 + 4.',
  },
];

// ═══════════════════════════════════════════════════════════
// 🎯 الدرس الكامل
// ═══════════════════════════════════════════════════════════

export const L0_S2: LessonNode = {
  id: 'L0-S2',
  skillId: 'S2',
  levelId: 'L0',
  order: 3,

  title: {
    ar: 'القيمة المكانية وبناء الأعداد',
    en: 'Place Value and Building Numbers',
  },

  story: {
    ar: 'قال حارس القلعة: تذكّروا القاعدة الذهبية — الخرزة التي تلمس الجسر هي التي تُحسب، والباقي نائم لا قيمة له. كل عمود يمثّل منزلة: آحاد، وعشرات، ومئات، وآلاف.',
    en: 'The castle guard said: Remember the golden rule — only beads touching the beam are counted, the rest sleep with no value. Each column represents a place: units, tens, hundreds, and thousands.',
  },
  storyAudioId: 2,

  concept: {
    ar: 'كل عمود يمثّل منزلة عددية. الانتقال إلى العمود التالي يساراً يضرب القيمة في 10. الأعمدة من اليمين: آحاد ← عشرات ← مئات ← آلاف.',
    en: 'Each column represents a number place. Moving to the next column to the left multiplies the value by 10. From right: units → tens → hundreds → thousands.',
  },

  rule: {
    ar: 'لوضع رقم متعدد المراتب: ابدأ من الآحاد (يمين)، ثم العشرات، ثم المئات. أرقام الصفر لا تُحرّك أي خرزة.',
    en: 'To place a multi-digit number: start from units (right), then tens, then hundreds. Zero digits do not move any bead.',
  },

  examples: EXAMPLES,
  tryQuestions: TRY_QUESTIONS,

  estimatedMinutes: 15,
  xpReward: 10,
  isTheoretical: false,
};

export default L0_S2;