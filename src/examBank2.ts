// ============================================================
// examBank2.ts — بنك أسئلة الامتحان النهائي
// يشمل: امتحان جمع وطرح + امتحان ضرب وقسمة
// ============================================================

export interface ExamQuestion {
  operations: Array<{ value: number; operator: '+' | '-' | '×' | '÷' }>;
  answer: number;
}

// ============================================================
// 1. امتحان جمع وطرح — 25 سؤالاً (5 من كل مستوى)
// ============================================================
export const ADDITION_SUBTRACTION_EXAM: ExamQuestion[] = [
  // المستوى 1 — 4 أرقام، مجموع ≤ 15 (5 أسئلة)
  { operations: [{ value: 3, operator: '+' }, { value: 4, operator: '+' }, { value: 5, operator: '+' }, { value: 2, operator: '+' }], answer: 14 },
  { operations: [{ value: 4, operator: '+' }, { value: 5, operator: '+' }, { value: 3, operator: '+' }, { value: 1, operator: '+' }], answer: 13 },
  { operations: [{ value: 6, operator: '+' }, { value: 2, operator: '+' }, { value: 4, operator: '+' }, { value: 3, operator: '+' }], answer: 15 },
  { operations: [{ value: 5, operator: '+' }, { value: 3, operator: '+' }, { value: 4, operator: '+' }, { value: 2, operator: '+' }], answer: 14 },
  { operations: [{ value: 2, operator: '+' }, { value: 6, operator: '+' }, { value: 4, operator: '+' }, { value: 3, operator: '+' }], answer: 15 },

  // المستوى 2 — 5 أرقام، منها 1 من منزلتين، مع طرح (5 أسئلة)
  { operations: [{ value: 7, operator: '+' }, { value: 12, operator: '+' }, { value: 4, operator: '+' }, { value: 3, operator: '-' }, { value: 5, operator: '+' }], answer: 25 },
  { operations: [{ value: 8, operator: '+' }, { value: 15, operator: '+' }, { value: 6, operator: '-' }, { value: 4, operator: '+' }, { value: 2, operator: '-' }], answer: 19 },
  { operations: [{ value: 9, operator: '+' }, { value: 11, operator: '+' }, { value: 3, operator: '+' }, { value: 5, operator: '-' }, { value: 7, operator: '+' }], answer: 25 },
  { operations: [{ value: 6, operator: '+' }, { value: 13, operator: '+' }, { value: 4, operator: '-' }, { value: 8, operator: '+' }, { value: 2, operator: '+' }], answer: 25 },
  { operations: [{ value: 5, operator: '+' }, { value: 14, operator: '+' }, { value: 7, operator: '-' }, { value: 3, operator: '+' }, { value: 6, operator: '+' }], answer: 21 },

  // المستوى 3 — 6 أرقام، منها 2 من منزلتين (5 أسئلة)
  { operations: [{ value: 25, operator: '+' }, { value: 8, operator: '+' }, { value: 14, operator: '-' }, { value: 3, operator: '+' }, { value: 6, operator: '+' }, { value: 2, operator: '-' }], answer: 26 },
  { operations: [{ value: 18, operator: '+' }, { value: 7, operator: '-' }, { value: 12, operator: '+' }, { value: 5, operator: '+' }, { value: 9, operator: '-' }, { value: 4, operator: '+' }], answer: 31 },
  { operations: [{ value: 30, operator: '+' }, { value: 6, operator: '-' }, { value: 15, operator: '+' }, { value: 4, operator: '+' }, { value: 8, operator: '-' }, { value: 3, operator: '+' }], answer: 40 },
  { operations: [{ value: 22, operator: '+' }, { value: 9, operator: '+' }, { value: 13, operator: '-' }, { value: 7, operator: '+' }, { value: 5, operator: '-' }, { value: 6, operator: '+' }], answer: 32 },
  { operations: [{ value: 16, operator: '+' }, { value: 11, operator: '-' }, { value: 8, operator: '+' }, { value: 14, operator: '+' }, { value: 3, operator: '-' }, { value: 5, operator: '+' }], answer: 41 },

  // المستوى 4 — 7 أرقام، مع طرح متعدد (5 أسئلة)
  { operations: [{ value: 30, operator: '+' }, { value: 15, operator: '-' }, { value: 8, operator: '+' }, { value: 12, operator: '-' }, { value: 4, operator: '+' }, { value: 6, operator: '+' }, { value: 3, operator: '-' }], answer: 44 },
  { operations: [{ value: 25, operator: '+' }, { value: 10, operator: '-' }, { value: 18, operator: '+' }, { value: 5, operator: '-' }, { value: 7, operator: '+' }, { value: 12, operator: '-' }, { value: 4, operator: '+' }], answer: 41 },
  { operations: [{ value: 40, operator: '+' }, { value: 8, operator: '-' }, { value: 15, operator: '+' }, { value: 6, operator: '-' }, { value: 9, operator: '+' }, { value: 3, operator: '-' }, { value: 5, operator: '+' }], answer: 52 },
  { operations: [{ value: 35, operator: '+' }, { value: 12, operator: '+' }, { value: 7, operator: '-' }, { value: 20, operator: '+' }, { value: 4, operator: '-' }, { value: 8, operator: '+' }, { value: 3, operator: '-' }], answer: 47 },
  { operations: [{ value: 28, operator: '+' }, { value: 14, operator: '-' }, { value: 6, operator: '+' }, { value: 10, operator: '+' }, { value: 5, operator: '-' }, { value: 9, operator: '+' }, { value: 7, operator: '-' }], answer: 45 },

  // المستوى 5 — 8 أرقام، أرقام أكبر (5 أسئلة)
  { operations: [{ value: 42, operator: '+' }, { value: 18, operator: '-' }, { value: 7, operator: '+' }, { value: 25, operator: '-' }, { value: 13, operator: '+' }, { value: 8, operator: '-' }, { value: 5, operator: '+' }, { value: 6, operator: '-' }], answer: 58 },
  { operations: [{ value: 35, operator: '+' }, { value: 20, operator: '+' }, { value: 8, operator: '-' }, { value: 15, operator: '+' }, { value: 12, operator: '-' }, { value: 6, operator: '+' }, { value: 9, operator: '-' }, { value: 4, operator: '+' }], answer: 69 },
  { operations: [{ value: 50, operator: '+' }, { value: 14, operator: '-' }, { value: 22, operator: '+' }, { value: 6, operator: '-' }, { value: 18, operator: '+' }, { value: 7, operator: '-' }, { value: 10, operator: '+' }, { value: 3, operator: '-' }], answer: 80 },
  { operations: [{ value: 48, operator: '+' }, { value: 12, operator: '+' }, { value: 6, operator: '-' }, { value: 20, operator: '-' }, { value: 15, operator: '+' }, { value: 8, operator: '+' }, { value: 4, operator: '-' }, { value: 5, operator: '+' }], answer: 98 },
  { operations: [{ value: 60, operator: '+' }, { value: 18, operator: '-' }, { value: 7, operator: '+' }, { value: 25, operator: '+' }, { value: 10, operator: '-' }, { value: 14, operator: '+' }, { value: 6, operator: '-' }, { value: 8, operator: '+' }], answer: 122 },
];

// ============================================================
// 2. امتحان ضرب وقسمة — 25 سؤالاً (8 ضرب + 7 قسمة + 10 مختلط)
// ============================================================
export const MULT_DIV_EXAM: ExamQuestion[] = [
  // === 8 أسئلة ضرب (من بسيط إلى متقدم) ===
  { operations: [{ value: 6, operator: '×' }, { value: 7, operator: '×' }], answer: 42 },
  { operations: [{ value: 23, operator: '×' }, { value: 4, operator: '×' }], answer: 92 },
  { operations: [{ value: 312, operator: '×' }, { value: 3, operator: '×' }], answer: 936 },
  { operations: [{ value: 12, operator: '×' }, { value: 15, operator: '×' }], answer: 180 },
  { operations: [{ value: 13, operator: '×' }, { value: 21, operator: '×' }], answer: 273 },
  { operations: [{ value: 32, operator: '×' }, { value: 12, operator: '×' }], answer: 384 },
  { operations: [{ value: 14, operator: '×' }, { value: 23, operator: '×' }], answer: 322 },
  { operations: [{ value: 24, operator: '×' }, { value: 31, operator: '×' }], answer: 744 },

  // === 7 أسئلة قسمة ===
  { operations: [{ value: 84, operator: '÷' }, { value: 2, operator: '÷' }], answer: 42 },
  { operations: [{ value: 96, operator: '÷' }, { value: 4, operator: '÷' }], answer: 24 },
  { operations: [{ value: 88, operator: '÷' }, { value: 22, operator: '÷' }], answer: 4 },
  { operations: [{ value: 135, operator: '÷' }, { value: 27, operator: '÷' }], answer: 5 },
  { operations: [{ value: 828, operator: '÷' }, { value: 36, operator: '÷' }], answer: 23 },
  { operations: [{ value: 675, operator: '÷' }, { value: 25, operator: '÷' }], answer: 27 },
  { operations: [{ value: 936, operator: '÷' }, { value: 39, operator: '÷' }], answer: 24 },

  // === 10 أسئلة مختلط ===
  { operations: [{ value: 6, operator: '×' }, { value: 4, operator: '×' }, { value: 3, operator: '÷' }], answer: 8 },
  { operations: [{ value: 8, operator: '×' }, { value: 5, operator: '×' }, { value: 4, operator: '÷' }], answer: 10 },
  { operations: [{ value: 9, operator: '×' }, { value: 2, operator: '×' }, { value: 3, operator: '÷' }], answer: 6 },
  { operations: [{ value: 12, operator: '×' }, { value: 3, operator: '×' }, { value: 4, operator: '÷' }], answer: 9 },
  { operations: [{ value: 5, operator: '×' }, { value: 6, operator: '×' }, { value: 2, operator: '÷' }], answer: 15 },
  { operations: [{ value: 7, operator: '×' }, { value: 4, operator: '×' }, { value: 2, operator: '÷' }], answer: 14 },
  { operations: [{ value: 16, operator: '÷' }, { value: 4, operator: '÷' }, { value: 3, operator: '×' }], answer: 12 },
  { operations: [{ value: 20, operator: '÷' }, { value: 5, operator: '÷' }, { value: 6, operator: '×' }], answer: 24 },
  { operations: [{ value: 9, operator: '×' }, { value: 4, operator: '×' }, { value: 6, operator: '÷' }], answer: 6 },
  { operations: [{ value: 18, operator: '÷' }, { value: 6, operator: '÷' }, { value: 5, operator: '×' }], answer: 15 },
];

// ============================================================
// دوال مساعدة
// ============================================================
export function pickAdditionExam(): ExamQuestion[] {
  return [...ADDITION_SUBTRACTION_EXAM].sort(() => Math.random() - 0.5);
}

export function pickMultDivExam(): ExamQuestion[] {
  return [...MULT_DIV_EXAM].sort(() => Math.random() - 0.5);
}

// ============================================================
// شارات الأنزان
// ============================================================
export const ANZAN_BADGES_KEY = 'soroban_anzan_badges';

export interface AnzanBadges {
  master_addition?: boolean;
  master_multiplication?: boolean;
  master_division?: boolean;
  master_mixed?: boolean;
}

export function loadAnzanBadges(): AnzanBadges {
  try {
    const raw = localStorage.getItem(ANZAN_BADGES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAnzanBadges(badges: AnzanBadges): void {
  try {
    localStorage.setItem(ANZAN_BADGES_KEY, JSON.stringify(badges));
  } catch { /* ignore */ }
}

export function hasAnzanBadge(badge: keyof AnzanBadges): boolean {
  return !!loadAnzanBadges()[badge];
}