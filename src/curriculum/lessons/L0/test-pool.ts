// src/curriculum/lessons/L0/test-pool.ts
// بنك أسئلة اختبار L0 — كلها صعبة، الزمن 60 ثانية

export interface L0TestQuestion {
  id: string;
  skillId: 'S01' | 'S02';
  type: 'read' | 'build';
  prompt: string;
  expectedValue: number;
  choices?: number[];
  answerMs: number;
}

// ═══════════════════════════════════════════════════════════
// S1 — 10 أسئلة
// ═══════════════════════════════════════════════════════════

const S1_POOL: L0TestQuestion[] = [
  {
    id: 'SRB-L0-S01-X-001',
    skillId: 'S01',
    type: 'read',
    prompt: 'اقرأ الرقم المثبت',
    expectedValue: 9,
    choices: [9, 8, 7, 6],
    answerMs: 6000,
  },
  {
    id: 'SRB-L0-S01-X-002',
    skillId: 'S01',
    type: 'read',
    prompt: 'اقرأ الرقم المثبت',
    expectedValue: 8,
    choices: [8, 7, 9, 6],
    answerMs: 6000,
  },
  {
    id: 'SRB-L0-S01-X-003',
    skillId: 'S01',
    type: 'read',
    prompt: 'اقرأ الرقم المثبت',
    expectedValue: 7,
    choices: [7, 6, 8, 5],
    answerMs: 6000,
  },
  {
    id: 'SRB-L0-S01-X-004',
    skillId: 'S01',
    type: 'read',
    prompt: 'اقرأ الرقم المثبت',
    expectedValue: 6,
    choices: [6, 5, 7, 4],
    answerMs: 6000,
  },
  {
    id: 'SRB-L0-S01-X-005',
    skillId: 'S01',
    type: 'build',
    prompt: 'مثل الرقم 9',
    expectedValue: 9,
    answerMs: 6000,
  },
  {
    id: 'SRB-L0-S01-X-006',
    skillId: 'S01',
    type: 'build',
    prompt: 'مثل الرقم 8',
    expectedValue: 8,
    answerMs: 6000,
  },
  {
    id: 'SRB-L0-S01-X-007',
    skillId: 'S01',
    type: 'build',
    prompt: 'مثل الرقم 7',
    expectedValue: 7,
    answerMs: 6000,
  },
  {
    id: 'SRB-L0-S01-X-008',
    skillId: 'S01',
    type: 'build',
    prompt: 'مثل الرقم 6',
    expectedValue: 6,
    answerMs: 6000,
  },
  {
    id: 'SRB-L0-S01-X-009',
    skillId: 'S01',
    type: 'read',
    prompt: 'أقصى قيمة في عمود واحد',
    expectedValue: 9,
    choices: [9, 8, 7, 10],
    answerMs: 6000,
  },
  {
    id: 'SRB-L0-S01-X-010',
    skillId: 'S01',
    type: 'read',
    prompt: 'العلوية + كل السفلية',
    expectedValue: 9,
    choices: [9, 8, 5, 10],
    answerMs: 6000,
  },
];

// ═══════════════════════════════════════════════════════════
// S2 — 20 سؤال
// ═══════════════════════════════════════════════════════════

const S2_NUMBERS: number[] = [
  1024, 2350, 4007, 3056, 7008,
  10230, 20405, 50006, 80070, 12345,
  98765, 30560, 40007, 60800, 50204,
  99999, 10001, 50005, 90807, 78012,
];

const S2_POOL: L0TestQuestion[] = [];
for (let i = 0; i < S2_NUMBERS.length; i++) {
  const num = S2_NUMBERS[i];
  S2_POOL.push({
    id: 'SRB-L0-S02-X-' + String(i + 1).padStart(3, '0'),
    skillId: 'S02',
    type: 'build',
    prompt: 'مثل الرقم ' + num,
    expectedValue: num,
    answerMs: 6000,
  });
}

// ═══════════════════════════════════════════════════════════
// البنك الكامل
// ═══════════════════════════════════════════════════════════

export const L0_TEST_POOL: L0TestQuestion[] = S1_POOL.concat(S2_POOL);

// ═══════════════════════════════════════════════════════════
// خلط عشوائي
// ═══════════════════════════════════════════════════════════

function shuffle<T>(arr: T[]): T[] {
  const out: T[] = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

// ═══════════════════════════════════════════════════════════
// بناء الاختبار
// ═══════════════════════════════════════════════════════════

export function buildL0Test(): L0TestQuestion[] {
  const s1Picked = shuffle(S1_POOL).slice(0, 3);
  const s2Picked = shuffle(S2_POOL).slice(0, 7);
  return shuffle(s1Picked.concat(s2Picked));
}

// ═══════════════════════════════════════════════════════════
// الإعدادات
// ═══════════════════════════════════════════════════════════

export const L0_TEST_TOTAL_SEC = 60;
export const L0_TEST_PASS_THRESHOLD = 80;
export const L0_TEST_COOLDOWN_MS = 24 * 60 * 60 * 1000;
export const L0_TEST_STORAGE_KEY = 'soroban_passed_level_tests';
export const L0_TEST_LAST_ATTEMPT_KEY = 'soroban_level_test_last_attempt_L0';