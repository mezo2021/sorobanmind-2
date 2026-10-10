// src/components/flash/sorobanDivisionData.ts
// 📊 بيانات مسائل القسمة للتمرين التفاعلي
// ⚠️ فهارس الأعمدة: 0=مئات · 1=عشرات · 2=آحاد

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
        activeDividendRods: [1, 0],
        activeResultRod: 1,
      },
      {
        stepIndex: 2,
        instructionTitle: 'قسمة الآحاد (27 ÷ 3)',
        instructionDetail: 'نأخذ (27) — نضع 9 في آحاد الناتج، ونطرح 27.',
        expectedDividend: 0,
        expectedResult: 279,
        activeDividendRods: [2, 1],
        activeResultRod: 2,
      },
    ],
  },
  {
    id: 'prob_2',
    dividend: 428,
    divisor: 2,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (4 ÷ 2)',
        instructionDetail: '4 ÷ 2 = 2 — نضع 2 في مئات الناتج، ونطرح 4.',
        expectedDividend: 28,
        expectedResult: 200,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة العشرات (2 ÷ 2)',
        instructionDetail: '2 ÷ 2 = 1 — نضع 1 في عشرات الناتج، ونطرح 2.',
        expectedDividend: 8,
        expectedResult: 210,
        activeDividendRods: [1],
        activeResultRod: 1,
      },
      {
        stepIndex: 2,
        instructionTitle: 'قسمة الآحاد (8 ÷ 2)',
        instructionDetail: '8 ÷ 2 = 4 — نضع 4 في آحاد الناتج، ونطرح 8.',
        expectedDividend: 0,
        expectedResult: 214,
        activeDividendRods: [2],
        activeResultRod: 2,
      },
    ],
  },
  {
    id: 'prob_3',
    dividend: 639,
    divisor: 3,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (6 ÷ 3)',
        instructionDetail: '6 ÷ 3 = 2 — نضع 2 في مئات الناتج، ونطرح 6.',
        expectedDividend: 39,
        expectedResult: 200,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة العشرات (3 ÷ 3)',
        instructionDetail: '3 ÷ 3 = 1 — نضع 1 في عشرات الناتج، ونطرح 3.',
        expectedDividend: 9,
        expectedResult: 210,
        activeDividendRods: [1],
        activeResultRod: 1,
      },
      {
        stepIndex: 2,
        instructionTitle: 'قسمة الآحاد (9 ÷ 3)',
        instructionDetail: '9 ÷ 3 = 3 — نضع 3 في آحاد الناتج، ونطرح 9.',
        expectedDividend: 0,
        expectedResult: 213,
        activeDividendRods: [2],
        activeResultRod: 2,
      },
    ],
  },
  {
    id: 'prob_4',
    dividend: 963,
    divisor: 3,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (9 ÷ 3)',
        instructionDetail: '9 ÷ 3 = 3 — نضع 3 في مئات الناتج، ونطرح 9.',
        expectedDividend: 63,
        expectedResult: 300,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة العشرات (6 ÷ 3)',
        instructionDetail: '6 ÷ 3 = 2 — نضع 2 في عشرات الناتج، ونطرح 6.',
        expectedDividend: 3,
        expectedResult: 320,
        activeDividendRods: [1],
        activeResultRod: 1,
      },
      {
        stepIndex: 2,
        instructionTitle: 'قسمة الآحاد (3 ÷ 3)',
        instructionDetail: '3 ÷ 3 = 1 — نضع 1 في آحاد الناتج، ونطرح 3.',
        expectedDividend: 0,
        expectedResult: 321,
        activeDividendRods: [2],
        activeResultRod: 2,
      },
    ],
  },
  {
    id: 'prob_5',
    dividend: 525,
    divisor: 5,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (5 ÷ 5)',
        instructionDetail: '5 ÷ 5 = 1 — نضع 1 في مئات الناتج، ونطرح 5. المقسوم يصبح 25.',
        expectedDividend: 25,
        expectedResult: 100,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة الآحاد (25 ÷ 5)',
        instructionDetail: '2 أصغر من 5 — نأخذ الرقمين (25) · 25 ÷ 5 = 5 — نضع 5 في آحاد الناتج، ونطرح 25.',
        expectedDividend: 0,
        expectedResult: 105,
        activeDividendRods: [2, 1],
        activeResultRod: 2,
      },
    ],
  },
  {
    id: 'prob_6',
    dividend: 749,
    divisor: 7,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (7 ÷ 7)',
        instructionDetail: '7 ÷ 7 = 1 — نضع 1 في مئات الناتج، ونطرح 7. المقسوم يصبح 49.',
        expectedDividend: 49,
        expectedResult: 100,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة الآحاد (49 ÷ 7)',
        instructionDetail: '4 أصغر من 7 — نأخذ الرقمين (49) · 49 ÷ 7 = 7 — نضع 7 في آحاد الناتج، ونطرح 49.',
        expectedDividend: 0,
        expectedResult: 107,
        activeDividendRods: [2, 1],
        activeResultRod: 2,
      },
    ],
  },
  {
    id: 'prob_7',
    dividend: 848,
    divisor: 4,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (8 ÷ 4)',
        instructionDetail: '8 ÷ 4 = 2 — نضع 2 في مئات الناتج، ونطرح 8.',
        expectedDividend: 48,
        expectedResult: 200,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة العشرات (4 ÷ 4)',
        instructionDetail: '4 ÷ 4 = 1 — نضع 1 في عشرات الناتج، ونطرح 4.',
        expectedDividend: 8,
        expectedResult: 210,
        activeDividendRods: [1],
        activeResultRod: 1,
      },
      {
        stepIndex: 2,
        instructionTitle: 'قسمة الآحاد (8 ÷ 4)',
        instructionDetail: '8 ÷ 4 = 2 — نضع 2 في آحاد الناتج، ونطرح 8.',
        expectedDividend: 0,
        expectedResult: 212,
        activeDividendRods: [2],
        activeResultRod: 2,
      },
    ],
  },
  {
    id: 'prob_8',
    dividend: 936,
    divisor: 3,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (9 ÷ 3)',
        instructionDetail: '9 ÷ 3 = 3 — نضع 3 في مئات الناتج، ونطرح 9.',
        expectedDividend: 36,
        expectedResult: 300,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة العشرات (3 ÷ 3)',
        instructionDetail: '3 ÷ 3 = 1 — نضع 1 في عشرات الناتج، ونطرح 3.',
        expectedDividend: 6,
        expectedResult: 310,
        activeDividendRods: [1],
        activeResultRod: 1,
      },
      {
        stepIndex: 2,
        instructionTitle: 'قسمة الآحاد (6 ÷ 3)',
        instructionDetail: '6 ÷ 3 = 2 — نضع 2 في آحاد الناتج، ونطرح 6.',
        expectedDividend: 0,
        expectedResult: 312,
        activeDividendRods: [2],
        activeResultRod: 2,
      },
    ],
  },
  {
    id: 'prob_9',
    dividend: 618,
    divisor: 2,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (6 ÷ 2)',
        instructionDetail: '6 ÷ 2 = 3 — نضع 3 في مئات الناتج، ونطرح 6. المقسوم يصبح 18.',
        expectedDividend: 18,
        expectedResult: 300,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة الآحاد (18 ÷ 2)',
        instructionDetail: '1 أصغر من 2 — نأخذ الرقمين (18) · 18 ÷ 2 = 9 — نضع 9 في آحاد الناتج، ونطرح 18.',
        expectedDividend: 0,
        expectedResult: 309,
        activeDividendRods: [2, 1],
        activeResultRod: 2,
      },
    ],
  },
  {
    id: 'prob_10',
    dividend: 484,
    divisor: 4,
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'قسمة المئات (4 ÷ 4)',
        instructionDetail: '4 ÷ 4 = 1 — نضع 1 في مئات الناتج، ونطرح 4.',
        expectedDividend: 84,
        expectedResult: 100,
        activeDividendRods: [0],
        activeResultRod: 0,
      },
      {
        stepIndex: 1,
        instructionTitle: 'قسمة العشرات (8 ÷ 4)',
        instructionDetail: '8 ÷ 4 = 2 — نضع 2 في عشرات الناتج، ونطرح 8.',
        expectedDividend: 4,
        expectedResult: 120,
        activeDividendRods: [1],
        activeResultRod: 1,
      },
      {
        stepIndex: 2,
        instructionTitle: 'قسمة الآحاد (4 ÷ 4)',
        instructionDetail: '4 ÷ 4 = 1 — نضع 1 في آحاد الناتج، ونطرح 4.',
        expectedDividend: 0,
        expectedResult: 121,
        activeDividendRods: [2],
        activeResultRod: 2,
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
// كل درس فلاش يمكن أن يكون له تمرين مقابل.
// عند إضافة درس جديد: أضف سطراً هنا.
export const LESSON_TO_PROBLEM: Record<string, string> = {
  'div-1x1-m1': 'prob_1',   // 837 ÷ 3
  // 'div-1x1-m2': 'prob_2',   ← عند إضافة الدرس
  // 'div-1x1-m3': 'prob_3',
  // 'div-1x1-m4': 'prob_4',
};

/** يُرجع problemId المرتبط بـ lessonId · أو null إذا لم يوجد */
export function getProblemIdForLesson(lessonId: string): string | null {
  return LESSON_TO_PROBLEM[lessonId] ?? null;
}