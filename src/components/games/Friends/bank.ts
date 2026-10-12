// ═══════════════════════════════════════════════════════════════════
// 🥋 src/components/games/Friends/bank.ts
// ═══════════════════════════════════════════════════════════════════
//
// بنك 40 تمريناً — من S03 + S04 (منهجية كوجيما)
//   - أصدقاء 5 (جمع 10 · طرح 5)
//   - أصدقاء 10 (جمع 10 · طرح 5)
//   - مركّب (جمع 5 · طرح 5)
//
// لا Direct · لا كماشة (بحسب القرار النهائي)
// ═══════════════════════════════════════════════════════════════════

export interface AbacusState {
  tensUpper: boolean;
  tensLower: number;   // 0-4
  onesUpper: boolean;
  onesLower: number;   // 0-4
}

export interface StepInstruction {
  targetState: AbacusState;
  instructionText: string;
  fingerSymbol: string;
}

export interface MultiStepProblem {
  id: string;
  expression: string;
  rule: 'f5' | 'f10' | 'combined';
  initialState: AbacusState;
  steps: StepInstruction[];
  finalValue: number;
  hint: string;
}

// ═══ مساعد — حالة المعداد الفارغة ═══
const EMPTY: AbacusState = {
  tensUpper: false, tensLower: 0,
  onesUpper: false, onesLower: 0,
};

// ═══════════════════════════════════════════════════════════════════
// القسم 1 — أصدقاء 5 · جمع (10 تمارين)
// ═══════════════════════════════════════════════════════════════════
export const FRIENDS_5_ADD: MultiStepProblem[] = [
  {
    id: 'f5-add-1',
    expression: '1 + 4 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 1 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 0 },
      instructionText: 'نزول مزدوج بالسبابة: انزل الجدة 5 نحو العارضة وابعد 1 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 5,
    hint: 'صديق 4 هو 1',
  },
  {
    id: 'f5-add-2',
    expression: '2 + 3 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 2 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 0 },
      instructionText: 'نزول مزدوج: انزل الجدة 5 نحو العارضة وابعد 2 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 5,
    hint: 'صديق 3 هو 2',
  },
  {
    id: 'f5-add-3',
    expression: '3 + 2 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 3 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 0 },
      instructionText: 'نزول مزدوج: انزل الجدة 5 نحو العارضة وابعد 3 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 5,
    hint: 'صديق 2 هو 3',
  },
  {
    id: 'f5-add-4',
    expression: '4 + 1 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 4 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 0 },
      instructionText: 'نزول مزدوج: انزل الجدة 5 نحو العارضة وابعد 4 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 5,
    hint: 'صديق 1 هو 4',
  },
  {
    id: 'f5-add-5',
    expression: '2 + 4 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 2 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 1 },
      instructionText: 'نزول مزدوج: انزل الجدة 5 نحو العارضة وابعد 1 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 6,
    hint: 'صديق 4 هو 1',
  },
  {
    id: 'f5-add-6',
    expression: '3 + 3 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 3 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 1 },
      instructionText: 'نزول مزدوج: انزل الجدة 5 نحو العارضة وابعد 2 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 6,
    hint: 'صديق 3 هو 2',
  },
  {
    id: 'f5-add-7',
    expression: '4 + 2 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 4 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 1 },
      instructionText: 'نزول مزدوج: انزل الجدة 5 نحو العارضة وابعد 3 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 6,
    hint: 'صديق 2 هو 3',
  },
  {
    id: 'f5-add-8',
    expression: '3 + 4 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 3 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 2 },
      instructionText: 'نزول مزدوج: انزل الجدة 5 نحو العارضة وابعد 1 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 7,
    hint: 'صديق 4 هو 1',
  },
  {
    id: 'f5-add-9',
    expression: '4 + 3 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 4 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 2 },
      instructionText: 'نزول مزدوج: انزل الجدة 5 نحو العارضة وابعد 2 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 7,
    hint: 'صديق 3 هو 2',
  },
  {
    id: 'f5-add-10',
    expression: '4 + 4 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesLower: 4 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 3 },
      instructionText: 'نزول مزدوج: انزل الجدة 5 نحو العارضة وابعد 1 بعيداً عن العارضة',
      fingerSymbol: '⬇️⬇️',
    }],
    finalValue: 8,
    hint: 'صديق 4 هو 1',
  },
];

// ═══════════════════════════════════════════════════════════════════
// القسم 2 — أصدقاء 5 · طرح (5 تمارين)
// ═══════════════════════════════════════════════════════════════════
export const FRIENDS_5_SUB: MultiStepProblem[] = [
  {
    id: 'f5-sub-1',
    expression: '5 − 1 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesUpper: true },
    steps: [{
      targetState: { ...EMPTY, onesLower: 4 },
      instructionText: 'صعود مزدوج (سبابة + إبهام): ارفع الجدة 5 بعيداً عن العارضة وارفع 4 نحو العارضة',
      fingerSymbol: '⬆️⬆️',
    }],
    finalValue: 4,
    hint: 'صديق 1 هو 4',
  },
  {
    id: 'f5-sub-2',
    expression: '6 − 2 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 1 },
    steps: [{
      targetState: { ...EMPTY, onesLower: 4 },
      instructionText: 'صعود مزدوج: ارفع الجدة 5 بعيداً وارفع 3 نحو العارضة',
      fingerSymbol: '⬆️⬆️',
    }],
    finalValue: 4,
    hint: 'صديق 2 هو 3',
  },
  {
    id: 'f5-sub-3',
    expression: '7 − 3 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 2 },
    steps: [{
      targetState: { ...EMPTY, onesLower: 4 },
      instructionText: 'صعود مزدوج: ارفع الجدة 5 بعيداً وارفع 2 نحو العارضة',
      fingerSymbol: '⬆️⬆️',
    }],
    finalValue: 4,
    hint: 'صديق 3 هو 2',
  },
  {
    id: 'f5-sub-4',
    expression: '8 − 4 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 3 },
    steps: [{
      targetState: { ...EMPTY, onesLower: 4 },
      instructionText: 'صعود مزدوج: ارفع الجدة 5 بعيداً وارفع 1 نحو العارضة',
      fingerSymbol: '⬆️⬆️',
    }],
    finalValue: 4,
    hint: 'صديق 4 هو 1',
  },
  {
    id: 'f5-sub-5',
    expression: '5 − 4 = ?',
    rule: 'f5',
    initialState: { ...EMPTY, onesUpper: true },
    steps: [{
      targetState: { ...EMPTY, onesLower: 1 },
      instructionText: 'صعود مزدوج: ارفع الجدة 5 بعيداً وارفع 1 نحو العارضة',
      fingerSymbol: '⬆️⬆️',
    }],
    finalValue: 1,
    hint: 'صديق 4 هو 1',
  },
];

// ═══════════════════════════════════════════════════════════════════
// القسم 3 — أصدقاء 10 · جمع (10 تمارين)
// ═══════════════════════════════════════════════════════════════════
export const FRIENDS_10_ADD: MultiStepProblem[] = [
  {
    id: 'f10-add-1',
    expression: '9 + 1 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 4 },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات بالإبهام · وابعد 9 من الآحاد بالسبابة',
      fingerSymbol: '🧡',
    }],
    finalValue: 10,
    hint: 'صديق 1 هو 9 مع العملاق 10',
  },
  {
    id: 'f10-add-2',
    expression: '8 + 2 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 3 },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات · وابعد 8 من الآحاد',
      fingerSymbol: '🧡',
    }],
    finalValue: 10,
    hint: 'صديق 2 هو 8 مع العملاق 10',
  },
  {
    id: 'f10-add-3',
    expression: '7 + 3 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 2 },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات · وابعد 7 من الآحاد',
      fingerSymbol: '🧡',
    }],
    finalValue: 10,
    hint: 'صديق 3 هو 7 مع العملاق 10',
  },
  {
    id: 'f10-add-4',
    expression: '6 + 4 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 1 },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات · وابعد 6 من الآحاد',
      fingerSymbol: '🧡',
    }],
    finalValue: 10,
    hint: 'صديق 4 هو 6 مع العملاق 10',
  },
  {
    id: 'f10-add-5',
    expression: '5 + 5 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات · وابعد الجدة 5 من الآحاد',
      fingerSymbol: '🧡',
    }],
    finalValue: 10,
    hint: 'صديق 5 هو 5 مع العملاق 10',
  },
  {
    id: 'f10-add-6',
    expression: '8 + 3 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 3 },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1, onesLower: 1 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات · وابعد 7 من الآحاد',
      fingerSymbol: '🧡',
    }],
    finalValue: 11,
    hint: 'صديق 3 هو 7 مع العملاق 10',
  },
  {
    id: 'f10-add-7',
    expression: '7 + 4 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 2 },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1, onesLower: 1 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات · وابعد 6 من الآحاد',
      fingerSymbol: '🧡',
    }],
    finalValue: 11,
    hint: 'صديق 4 هو 6 مع العملاق 10',
  },
  {
    id: 'f10-add-8',
    expression: '9 + 3 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 4 },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1, onesLower: 2 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات · وابعد 7 من الآحاد',
      fingerSymbol: '🧡',
    }],
    finalValue: 12,
    hint: 'صديق 3 هو 7 مع العملاق 10',
  },
  {
    id: 'f10-add-9',
    expression: '8 + 5 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 3 },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1, onesLower: 3 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات · وابعد الجدة 5 من الآحاد',
      fingerSymbol: '🧡',
    }],
    finalValue: 13,
    hint: 'صديق 5 هو 5 مع العملاق 10',
  },
  {
    id: 'f10-add-10',
    expression: '9 + 5 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 4 },
    steps: [{
      targetState: { ...EMPTY, tensLower: 1, onesLower: 4 },
      instructionText: 'العملاق 10: ارفع 1 في العشرات · وابعد الجدة 5 من الآحاد',
      fingerSymbol: '🧡',
    }],
    finalValue: 14,
    hint: 'صديق 5 هو 5 مع العملاق 10',
  },
];

// ═══════════════════════════════════════════════════════════════════
// القسم 4 — أصدقاء 10 · طرح (5 تمارين)
// ═══════════════════════════════════════════════════════════════════
export const FRIENDS_10_SUB: MultiStepProblem[] = [
  {
    id: 'f10-sub-1',
    expression: '10 − 1 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, tensLower: 1 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 4 },
      instructionText: 'أزل 1 من العشرات (−10) · وأنزل الجدة 5 وارفع 4 في الآحاد (+9)',
      fingerSymbol: '⬇️🧡',
    }],
    finalValue: 9,
    hint: 'صديق 1 هو 9 مع العملاق 10',
  },
  {
    id: 'f10-sub-2',
    expression: '10 − 2 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, tensLower: 1 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 3 },
      instructionText: 'أزل 1 من العشرات (−10) · وأنزل الجدة 5 وارفع 3 في الآحاد (+8)',
      fingerSymbol: '⬇️🧡',
    }],
    finalValue: 8,
    hint: 'صديق 2 هو 8 مع العملاق 10',
  },
  {
    id: 'f10-sub-3',
    expression: '10 − 3 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, tensLower: 1 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 2 },
      instructionText: 'أزل 1 من العشرات · وأنزل الجدة 5 وارفع 2 في الآحاد (+7)',
      fingerSymbol: '⬇️🧡',
    }],
    finalValue: 7,
    hint: 'صديق 3 هو 7 مع العملاق 10',
  },
  {
    id: 'f10-sub-4',
    expression: '10 − 4 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, tensLower: 1 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 1 },
      instructionText: 'أزل 1 من العشرات · وأنزل الجدة 5 وارفع 1 في الآحاد (+6)',
      fingerSymbol: '⬇️🧡',
    }],
    finalValue: 6,
    hint: 'صديق 4 هو 6 مع العملاق 10',
  },
  {
    id: 'f10-sub-5',
    expression: '12 − 5 = ?',
    rule: 'f10',
    initialState: { ...EMPTY, tensLower: 1, onesLower: 2 },
    steps: [{
      targetState: { ...EMPTY, onesUpper: true, onesLower: 2 },
      instructionText: 'أزل 1 من العشرات · وأنزل الجدة 5 في الآحاد (+5)',
      fingerSymbol: '⬇️🧡',
    }],
    finalValue: 7,
    hint: 'صديق 5 هو 5 مع العملاق 10',
  },
];

// ═══════════════════════════════════════════════════════════════════
// القسم 5 — مركّب · جمع (5 تمارين) — ثلاث خطوات
// ═══════════════════════════════════════════════════════════════════
export const COMBINED_ADD: MultiStepProblem[] = [
  {
    id: 'comb-add-1',
    expression: '5 + 6 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, onesUpper: true },
    steps: [
      {
        targetState: { ...EMPTY, tensLower: 1, onesUpper: true },
        instructionText: 'الخطوة 1: ارفع 1 في العشرات بالإبهام (+10)',
        fingerSymbol: '🧡',
      },
      {
        targetState: { ...EMPTY, tensLower: 1 },
        instructionText: 'الخطوة 2: ارفع الجدة 5 بالسبابة بعيداً عن العارضة (−5)',
        fingerSymbol: '⬆️',
      },
      {
        targetState: { ...EMPTY, tensLower: 1, onesLower: 1 },
        instructionText: 'الخطوة 3: ارفع خرزة سفلية بالإبهام نحو العارضة (+1)',
        fingerSymbol: '👍',
      },
    ],
    finalValue: 11,
    hint: 'مركّب: +10 · −5 · +1',
  },
  {
    id: 'comb-add-2',
    expression: '5 + 7 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, onesUpper: true },
    steps: [
      {
        targetState: { ...EMPTY, tensLower: 1, onesUpper: true },
        instructionText: 'الخطوة 1: ارفع 1 في العشرات (+10)',
        fingerSymbol: '🧡',
      },
      {
        targetState: { ...EMPTY, tensLower: 1 },
        instructionText: 'الخطوة 2: ارفع الجدة 5 بعيداً (−5)',
        fingerSymbol: '⬆️',
      },
      {
        targetState: { ...EMPTY, tensLower: 1, onesLower: 2 },
        instructionText: 'الخطوة 3: ارفع خرزتين بالسبابة والإبهام نحو العارضة (+2)',
        fingerSymbol: '👍',
      },
    ],
    finalValue: 12,
    hint: 'مركّب: +10 · −5 · +2',
  },
  {
    id: 'comb-add-3',
    expression: '6 + 7 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 1 },
    steps: [
      {
        targetState: { ...EMPTY, tensLower: 1, onesUpper: true, onesLower: 1 },
        instructionText: 'الخطوة 1: ارفع 1 في العشرات (+10)',
        fingerSymbol: '🧡',
      },
      {
        targetState: { ...EMPTY, tensLower: 1, onesLower: 1 },
        instructionText: 'الخطوة 2: ارفع الجدة 5 بعيداً (−5)',
        fingerSymbol: '⬆️',
      },
      {
        targetState: { ...EMPTY, tensLower: 1, onesLower: 3 },
        instructionText: 'الخطوة 3: ارفع خرزتين بالإبهام نحو العارضة (+2)',
        fingerSymbol: '👍',
      },
    ],
    finalValue: 13,
    hint: 'مركّب: +10 · −5 · +2',
  },
  {
    id: 'comb-add-4',
    expression: '7 + 6 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 2 },
    steps: [
      {
        targetState: { ...EMPTY, tensLower: 1, onesUpper: true, onesLower: 2 },
        instructionText: 'الخطوة 1: ارفع 1 في العشرات (+10)',
        fingerSymbol: '🧡',
      },
      {
        targetState: { ...EMPTY, tensLower: 1, onesLower: 2 },
        instructionText: 'الخطوة 2: ارفع الجدة 5 بعيداً (−5)',
        fingerSymbol: '⬆️',
      },
      {
        targetState: { ...EMPTY, tensLower: 1, onesLower: 3 },
        instructionText: 'الخطوة 3: ارفع خرزة سفلية بالإبهام نحو العارضة (+1)',
        fingerSymbol: '👍',
      },
    ],
    finalValue: 13,
    hint: 'مركّب: +10 · −5 · +1',
  },
  {
    id: 'comb-add-5',
    expression: '6 + 8 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, onesUpper: true, onesLower: 1 },
    steps: [
      {
        targetState: { ...EMPTY, tensLower: 1, onesUpper: true, onesLower: 1 },
        instructionText: 'الخطوة 1: ارفع 1 في العشرات (+10)',
        fingerSymbol: '🧡',
      },
      {
        targetState: { ...EMPTY, tensLower: 1, onesLower: 1 },
        instructionText: 'الخطوة 2: ارفع الجدة 5 بعيداً (−5)',
        fingerSymbol: '⬆️',
      },
      {
        targetState: { ...EMPTY, tensLower: 1, onesLower: 4 },
        instructionText: 'الخطوة 3: ارفع 3 خرزات بالإبهام نحو العارضة (+3)',
        fingerSymbol: '👍',
      },
    ],
    finalValue: 14,
    hint: 'مركّب: +10 · −5 · +3',
  },
];

// ═══════════════════════════════════════════════════════════════════
// القسم 6 — مركّب · طرح (5 تمارين) — ثلاث خطوات
// ═══════════════════════════════════════════════════════════════════
export const COMBINED_SUB: MultiStepProblem[] = [
  {
    id: 'comb-sub-1',
    expression: '13 − 6 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, tensLower: 1, onesLower: 3 },
    steps: [
      {
        targetState: { ...EMPTY, onesLower: 3 },
        instructionText: 'الخطوة 1: أزل 1 من العشرات (−10) بالإبهام',
        fingerSymbol: '⬇️',
      },
      {
        targetState: { ...EMPTY, onesUpper: true, onesLower: 3 },
        instructionText: 'الخطوة 2: أنزل الجدة 5 نحو العارضة بالسبابة (+5)',
        fingerSymbol: '👇',
      },
      {
        targetState: { ...EMPTY, onesUpper: true, onesLower: 2 },
        instructionText: 'الخطوة 3: أزل خرزة سفلية بعيداً عن العارضة (−1)',
        fingerSymbol: '⬇️',
      },
    ],
    finalValue: 7,
    hint: 'مركّب: −10 · +5 · −1',
  },
  {
    id: 'comb-sub-2',
    expression: '12 − 6 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, tensLower: 1, onesLower: 2 },
    steps: [
      {
        targetState: { ...EMPTY, onesLower: 2 },
        instructionText: 'الخطوة 1: أزل 1 من العشرات (−10)',
        fingerSymbol: '⬇️',
      },
      {
        targetState: { ...EMPTY, onesUpper: true, onesLower: 2 },
        instructionText: 'الخطوة 2: أنزل الجدة 5 نحو العارضة (+5)',
        fingerSymbol: '👇',
      },
      {
        targetState: { ...EMPTY, onesUpper: true, onesLower: 1 },
        instructionText: 'الخطوة 3: أزل خرزة سفلية بعيداً (−1)',
        fingerSymbol: '⬇️',
      },
    ],
    finalValue: 6,
    hint: 'مركّب: −10 · +5 · −1',
  },
  {
    id: 'comb-sub-3',
    expression: '11 − 6 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, tensLower: 1, onesLower: 1 },
    steps: [
      {
        targetState: { ...EMPTY, onesLower: 1 },
        instructionText: 'الخطوة 1: أزل 1 من العشرات (−10)',
        fingerSymbol: '⬇️',
      },
      {
        targetState: { ...EMPTY, onesUpper: true, onesLower: 1 },
        instructionText: 'الخطوة 2: أنزل الجدة 5 نحو العارضة (+5)',
        fingerSymbol: '👇',
      },
      {
        targetState: { ...EMPTY, onesUpper: true },
        instructionText: 'الخطوة 3: أزل خرزة سفلية بعيداً (−1)',
        fingerSymbol: '⬇️',
      },
    ],
    finalValue: 5,
    hint: 'مركّب: −10 · +5 · −1',
  },
  {
    id: 'comb-sub-4',
    expression: '13 − 7 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, tensLower: 1, onesLower: 3 },
    steps: [
      {
        targetState: { ...EMPTY, onesLower: 3 },
        instructionText: 'الخطوة 1: أزل 1 من العشرات (−10)',
        fingerSymbol: '⬇️',
      },
      {
        targetState: { ...EMPTY, onesUpper: true, onesLower: 3 },
        instructionText: 'الخطوة 2: أنزل الجدة 5 نحو العارضة (+5)',
        fingerSymbol: '👇',
      },
      {
        targetState: { ...EMPTY, onesUpper: true, onesLower: 1 },
        instructionText: 'الخطوة 3: أزل خرزتين سفليتين بعيداً (−2)',
        fingerSymbol: '⬇️',
      },
    ],
    finalValue: 6,
    hint: 'مركّب: −10 · +5 · −2',
  },
  {
    id: 'comb-sub-5',
    expression: '12 − 7 = ?',
    rule: 'combined',
    initialState: { ...EMPTY, tensLower: 1, onesLower: 2 },
    steps: [
      {
        targetState: { ...EMPTY, onesLower: 2 },
        instructionText: 'الخطوة 1: أزل 1 من العشرات (−10)',
        fingerSymbol: '⬇️',
      },
      {
        targetState: { ...EMPTY, onesUpper: true, onesLower: 2 },
        instructionText: 'الخطوة 2: أنزل الجدة 5 نحو العارضة (+5)',
        fingerSymbol: '👇',
      },
      {
        targetState: { ...EMPTY, onesUpper: true },
        instructionText: 'الخطوة 3: أزل خرزتين سفليتين بعيداً (−2)',
        fingerSymbol: '⬇️',
      },
    ],
    finalValue: 5,
    hint: 'مركّب: −10 · +5 · −2',
  },
];

// ═══════════════════════════════════════════════════════════════════
// البنك الموحّد — 40 تمريناً
// ═══════════════════════════════════════════════════════════════════
export const MASTER_40_BANK: MultiStepProblem[] = [
  ...FRIENDS_5_ADD,      // 10
  ...FRIENDS_5_SUB,      // 5
  ...FRIENDS_10_ADD,     // 10
  ...FRIENDS_10_SUB,     // 5
  ...COMBINED_ADD,       // 5
  ...COMBINED_SUB,       // 5
];

// ═══ إجمالي: 40 تمريناً ═══