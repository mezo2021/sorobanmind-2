// src/components/flash/sorobanDivisionData.ts
// 📊 بيانات مسائل القسمة للتمرين التفاعلي
// ⚠️ فهارس الأعمدة: 0=مئات · 1=عشرات · 2=آحاد
// 🎯 كل الأعمدة = 3 (مئات · عشرات · آحاد)

export interface DivisionStep {
  stepIndex: number;
  instructionTitle: string;
  instructionDetail: string;
  expectedDividend: number;
  expectedResult: number;
  activeDividendRods: number[];
  activeResultRod: number;
}

export interface DivisionProblem {
  id: string;
  dividend: number;
  divisor: number;
  steps: DivisionStep[];
}

export const divisionProblems: DivisionProblem[] = [
  // ═══════════════════════════════════════════════════════════
  // ➗ prob_1 — 837 ÷ 3 = 279  (div-1x1-m1)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'prob_1',
    dividend: 837,
    divisor: 3,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (8 ÷ 3)',
        instructionDetail: '8 أكبر من 3 — نضع 2 في مئات الناتج، ونطرح 6 من مئات المقسوم.',
        expectedDividend: 237,
        expectedResult: 200,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة العشرات (23 ÷ 3)',
        instructionDetail: 'نأخذ رقمين (23) — نضع 7 في عشرات الناتج، ونطرح 21.',
        expectedDividend: 27,
        expectedResult: 270,
        activeDividendRods: [0, 1],
        activeResultRod: 1,
      },
      {
        stepIndex: 2,
        instructionTitle: 'قسمة الآحاد (27 ÷ 3)',
        instructionDetail: 'نأخذ (27) — نضع 9 في آحاد الناتج، ونطرح 27.',
        expectedDividend: 0,
        expectedResult: 279,
        activeDividendRods: [1, 2],
        activeResultRod: 2,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ➗ prob_2 — 54 ÷ 3 = 18  (div-1x1-m2 — أصدقاء 5)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'prob_2',
    dividend: 54,
    divisor: 3,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة العشرات (5 ÷ 3)',
        instructionDetail: '5 ÷ 3 = 1 — نضع 1 في عشرات الناتج، ونطرح 3. المقسوم يصبح 24.',
        expectedDividend: 24,
        expectedResult: 10,
        activeDividendRods: [1],
        activeResultRod: 1,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة الآحاد (24 ÷ 3)',
        instructionDetail: '24 ÷ 3 = 8 — نضع 8 في آحاد الناتج، ونطرح 24.',
        expectedDividend: 0,
        expectedResult: 18,
        activeDividendRods: [1, 2],
        activeResultRod: 2,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ➗ prob_3 — 152 ÷ 8 = 19  (div-1x1-m3 — أصدقاء 10)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'prob_3',
    dividend: 152,
    divisor: 8,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (15 ÷ 8)',
        instructionDetail: '1 أصغر من 8 — نأخذ رقمين (15) · 15 ÷ 8 = 1 — نضع 1 في عشرات الناتج، ونطرح 8. المقسوم يصبح 72.',
        expectedDividend: 72,
        expectedResult: 10,
        activeDividendRods: [0, 1],
        activeResultRod: 1,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة العشرات والآحاد (72 ÷ 8)',
        instructionDetail: '72 ÷ 8 = 9 — نضع 9 في آحاد الناتج، ونطرح 72.',
        expectedDividend: 0,
        expectedResult: 19,
        activeDividendRods: [1, 2],
        activeResultRod: 2,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ➗ prob_4 — 216 ÷ 8 = 27  (div-1x1-m4 — استعارة 10)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'prob_4',
    dividend: 216,
    divisor: 8,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (21 ÷ 8)',
        instructionDetail: '2 أصغر من 8 — نأخذ رقمين (21) · 21 ÷ 8 = 2 — نضع 2 في عشرات الناتج، ونطرح 16. المقسوم يصبح 56.',
        expectedDividend: 56,
        expectedResult: 20,
        activeDividendRods: [0, 1],
        activeResultRod: 1,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة العشرات والآحاد (56 ÷ 8)',
        instructionDetail: '56 ÷ 8 = 7 — نضع 7 في آحاد الناتج، ونطرح 56.',
        expectedDividend: 0,
        expectedResult: 27,
        activeDividendRods: [1, 2],
        activeResultRod: 2,
      },
// ═══════════════════════════════════════════════════════════
// ➗ prob_5 — 484 ÷ 22 = 22  (div-1x2-m1)
// ═══════════════════════════════════════════════════════════
{
  id: 'prob_5',
  dividend: 484,
  divisor: 22,
  steps: [
    {
      stepIndex: 0,
      instructionTitle: 'قسمة المئات (48 ÷ 22)',
      instructionDetail: '48 ÷ 22 = 2 — نضع 2 في عشرات الناتج، ونطرح 20×22 = 440.',
      expectedDividend: 44,
      expectedResult: 20,
      activeDividendRods: [0, 1],
      activeResultRod: 1,
    },
    {
      stepIndex: 1,
      instructionTitle: 'قسمة العشرات والآحاد (44 ÷ 22)',
      instructionDetail: '44 ÷ 22 = 2 — نضع 2 في آحاد الناتج، ونطرح 2×22 = 44.',
      expectedDividend: 0,
      expectedResult: 22,
      activeDividendRods: [1, 2],
      activeResultRod: 2,
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// ➗ prob_6 — 572 ÷ 22 = 26  (div-1x2-m2)
// ═══════════════════════════════════════════════════════════
{
  id: 'prob_6',
  dividend: 572,
  divisor: 22,
  steps: [
    {
      stepIndex: 0,
      instructionTitle: 'قسمة المئات (57 ÷ 22)',
      instructionDetail: '57 ÷ 22 = 2 — نضع 2 في عشرات الناتج، ونطرح 20×22 = 440.',
      expectedDividend: 132,
      expectedResult: 20,
      activeDividendRods: [0, 1],
      activeResultRod: 1,
    },
    {
      stepIndex: 1,
      instructionTitle: 'قسمة العشرات والآحاد (132 ÷ 22)',
      instructionDetail: '132 ÷ 22 = 6 — نضع 6 في آحاد الناتج، ونطرح 6×22 = 132.',
      expectedDividend: 0,
      expectedResult: 26,
      activeDividendRods: [1, 2],
      activeResultRod: 2,
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// ➗ prob_7 — 350 ÷ 14 = 25  (div-1x2-m3)
// ═══════════════════════════════════════════════════════════
{
  id: 'prob_7',
  dividend: 350,
  divisor: 14,
  steps: [
    {
      stepIndex: 0,
      instructionTitle: 'قسمة المئات (35 ÷ 14)',
      instructionDetail: '35 ÷ 14 = 2 — نضع 2 في عشرات الناتج، ونطرح 20×14 = 280.',
      expectedDividend: 70,
      expectedResult: 20,
      activeDividendRods: [0, 1],
      activeResultRod: 1,
    },
    {
      stepIndex: 1,
      instructionTitle: 'قسمة العشرات والآحاد (70 ÷ 14)',
      instructionDetail: '70 ÷ 14 = 5 — نضع 5 في آحاد الناتج، ونطرح 5×14 = 70.',
      expectedDividend: 0,
      expectedResult: 25,
      activeDividendRods: [1, 2],
      activeResultRod: 2,
    },
  ],
},

// ═══════════════════════════════════════════════════════════
// ➗ prob_8 — 234 ÷ 18 = 13  (div-1x2-m4)
// ═══════════════════════════════════════════════════════════
{
  id: 'prob_8',
  dividend: 234,
  divisor: 18,
  steps: [
    {
      stepIndex: 0,
      instructionTitle: 'قسمة المئات (23 ÷ 18)',
      instructionDetail: '23 ÷ 18 = 1 — نضع 1 في عشرات الناتج، ونطرح 10×18 = 180.',
      expectedDividend: 54,
      expectedResult: 10,
      activeDividendRods: [0, 1],
      activeResultRod: 1,
    },
    {
      stepIndex: 1,
      instructionTitle: 'قسمة العشرات والآحاد (54 ÷ 18)',
      instructionDetail: '54 ÷ 18 = 3 — نضع 3 في آحاد الناتج، ونطرح 3×18 = 54.',
      expectedDividend: 0,
      expectedResult: 13,
      activeDividendRods: [1, 2],
      activeResultRod: 2,
    },
  ],
},
    ],
  },
];

export function getDivisionProblemById(id: string): DivisionProblem | undefined {
  return divisionProblems.find((p) => p.id === id);
}

// ═══════════════════════════════════════════════════════════
// 🔗 جدول الربط: lesson.id → problem.id
// ═══════════════════════════════════════════════════════════
export const LESSON_TO_PROBLEM: Record<string, string> = {
  'div-1x1-m1': 'prob_1',
  'div-1x1-m2': 'prob_2',
  'div-1x1-m3': 'prob_3',
  'div-1x1-m4': 'prob_4',
  'div-1x2-m1': 'prob_5',
  'div-1x2-m2': 'prob_6',
  'div-1x2-m3': 'prob_7',
  'div-1x2-m4': 'prob_8',
};

export function getProblemIdForLesson(lessonId: string): string | null {
  return LESSON_TO_PROBLEM[lessonId] ?? null;
}