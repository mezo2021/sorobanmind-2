// src/data/srb/exam/index.ts
// ✅ جمع Bank B في ملف واحد
// ✅ buildExam1Category · buildExam2Category (منقول حرفيًا من bank-v2)
// ✅ يعمل مباشرة على SRBQuestion — لا محوّل
// ⚠️ PT مؤجل لخطوة لاحقة (يحتاج bank-v2/placement-engine.ts)

import type { SRBQuestion } from "../types";

import { L0_EXAM_QUESTIONS } from "./L0";
import { L1_EXAM_QUESTIONS } from "./L1";
import { L2_EXAM_QUESTIONS } from "./L2";
import { L3_EXAM_QUESTIONS } from "./L3";
import { L4_EXAM_QUESTIONS } from "./L4";
import { L5_EXAM_QUESTIONS } from "./L5";
import { L6_EXAM_QUESTIONS } from "./L6";
import { L7_EXAM_QUESTIONS } from "./L7";

// ═══════════════════════════════════════════════════════════
// 📋 الثوابت (مطابقة لـ bank-v2 · لا تغيير)
// ═══════════════════════════════════════════════════════════

export const EXAM1_QUESTION_COUNT = 20;
export const EXAM2_QUESTION_COUNT = 40;
export const EXAM1_TIME_SEC = 10 * 60;   // 600 ثانية
export const EXAM2_TIME_SEC = 20 * 60;   // 1200 ثانية
export const EXAM_PASS_THRESHOLD = 80;
export const EXAM_MAX_ATTEMPTS = 2;
export const EXAM_COOLDOWN_MS = 48 * 60 * 60 * 1000;

// ═══════════════════════════════════════════════════════════
// 🏦 Bank B الكامل
// ═══════════════════════════════════════════════════════════

export const ALL_EXAM_QUESTIONS: SRBQuestion[] = [
  ...L0_EXAM_QUESTIONS,
  ...L1_EXAM_QUESTIONS,
  ...L2_EXAM_QUESTIONS,
  ...L3_EXAM_QUESTIONS,
  ...L4_EXAM_QUESTIONS,
  ...L5_EXAM_QUESTIONS,
  ...L6_EXAM_QUESTIONS,
  ...L7_EXAM_QUESTIONS,
];

export const EXAM_BANK_SIZE = ALL_EXAM_QUESTIONS.length;

// ═══════════════════════════════════════════════════════════
// 🔍 الاستعلام
// ═══════════════════════════════════════════════════════════

export function getExamQuestionsByLevel(level: string): SRBQuestion[] {
  return ALL_EXAM_QUESTIONS.filter((q) => q.level === level);
}

export function getExamQuestionsByLevels(levels: string[]): SRBQuestion[] {
  const set = new Set(levels);
  return ALL_EXAM_QUESTIONS.filter((q) => set.has(q.level));
}

// ═══════════════════════════════════════════════════════════
// 🛠️ أدوات داخلية (منقولة من bank-v2)
// ═══════════════════════════════════════════════════════════

function createRng(seed: number): () => number {
  let value = seed >>> 0;
  return (): number => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function digitCount(value: number): number {
  const abs = Math.abs(value);
  if (abs === 0) return 1;
  return String(abs).length;
}

/**
 * اختيار الأصعب — منطق منقول حرفيًا من bank-v2.
 * ⚠️ SRBQuestion يستخدم `result` بدل `correctAnswer`.
 */
function pickHardest(
  pool: SRBQuestion[],
  count: number,
  rng: () => number,
): SRBQuestion[] {
  if (pool.length === 0) return [];

  const sorted = [...pool].sort((a, b) => {
    // 1. عدد الحدود
    const termDiff = b.operands.length - a.operands.length;
    if (termDiff !== 0) return termDiff;

    // 2. الصعوبة
    const diffDiff = b.difficulty - a.difficulty;
    if (diffDiff !== 0) return diffDiff;

    // 3. عدد المنازل
    return digitCount(b.result) - digitCount(a.result);
  });

  const topPool = sorted.slice(0, Math.min(count * 3, sorted.length));
  return shuffleArray(topPool, rng).slice(0, count);
}

// ═══════════════════════════════════════════════════════════
// 📊 التوزيعات (منقولة حرفيًا من bank-v2)
// ═══════════════════════════════════════════════════════════

const EXAM1_DISTRIBUTION: Record<string, number> = {
  L0: 3,
  L1: 7,
  L2: 5,
  L3: 5,
};

const EXAM2_DISTRIBUTION: Record<string, number> = {
  L4: 10,
  L5: 10,
  L6: 10,
  L7: 10,
};

// ═══════════════════════════════════════════════════════════
// 🎓 بناء الامتحانات (نفس السلوك · نفس البذرة)
// ═══════════════════════════════════════════════════════════

export function buildExam1Category(seed = Date.now()): SRBQuestion[] {
  const rng = createRng(seed);
  const questions: SRBQuestion[] = [];

  for (const [levelId, count] of Object.entries(EXAM1_DISTRIBUTION)) {
    const pool = getExamQuestionsByLevel(levelId);
    if (pool.length === 0) continue;
    questions.push(...pickHardest(pool, count, rng));
  }

  return shuffleArray(questions, rng);
}

export function buildExam2Category(seed = Date.now()): SRBQuestion[] {
  const rng = createRng(seed);
  const questions: SRBQuestion[] = [];

  for (const [levelId, count] of Object.entries(EXAM2_DISTRIBUTION)) {
    const pool = getExamQuestionsByLevel(levelId);
    if (pool.length === 0) continue;
    questions.push(...pickHardest(pool, count, rng));
  }

  return shuffleArray(questions, rng);
}
