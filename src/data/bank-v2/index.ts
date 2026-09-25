// src/data/bank-v2/index.ts
// بنك الأسئلة v2 — الفهرس الموحّد
// يجمع: bank-v2 الأقسام + bank-exam

import type { BankQuestion } from "./types";
import { createRng, shuffle } from "./types";
import { PART_01 } from "./part-01";
import { PART_02 } from "./part-02";
import { PART_03 } from "./part-03";
import { PART_04 } from "./part-04";

// ═══════════════════════════════════════════════════════════
// إعادة تصدير الأنواع والأدوات
// ═══════════════════════════════════════════════════════════

export type {
  BankQuestion,
  BankOperation,
  Difficulty,
  QuestionTiming,
} from "./types";

export {
  makeId,
  makeQuestion,
  createRng,
  randInt,
  shuffle,
  getDigits,
  hasCarry,
  hasBorrow,
  complementTo5,
  complementTo10,
  classifyAdd,
  classifySub,
  getDefaultTiming,
  adaptTiming,
  applyAdaptiveSpeed,
} from "./types";

export type { ExamQuestion } from "./bank-exam";

export {
  EXAM_POOL_1,
  EXAM_POOL_2,
  EXAM_STATS,
  buildExam1,
  buildExam2,
} from "./bank-exam";

// ═══════════════════════════════════════════════════════════
// البنك الأساسي (للتمرّن والأنزان)
// ═══════════════════════════════════════════════════════════

export const SOROBAN_BANK_V2: readonly BankQuestion[] = Object.freeze([
  ...PART_01,
  ...PART_02,
  ...PART_03,
  ...PART_04,
]);

export const BANK_V2_SIZE = SOROBAN_BANK_V2.length;

export const BANK_V2_STATS = {
  part01: PART_01.length,
  part02: PART_02.length,
  part03: PART_03.length,
  part04: PART_04.length,
  total: SOROBAN_BANK_V2.length,
} as const;

// ═══════════════════════════════════════════════════════════
// دوال الاستعلام الأساسية
// ═══════════════════════════════════════════════════════════

export function getQuestionById(id: string): BankQuestion | undefined {
  return SOROBAN_BANK_V2.find((q) => q.id === id);
}

export function getQuestionsByLevel(levelId: string): BankQuestion[] {
  return SOROBAN_BANK_V2.filter((q) => q.levelId === levelId);
}

export function getQuestionsBySkill(skillId: string): BankQuestion[] {
  return SOROBAN_BANK_V2.filter((q) => q.skillId === skillId);
}

export function getQuestionsByMovement(movement: string): BankQuestion[] {
  return SOROBAN_BANK_V2.filter((q) => q.movement === movement);
}

export function getQuestionsByLevelSkill(
  levelId: string,
  skillId: string,
): BankQuestion[] {
  return SOROBAN_BANK_V2.filter(
    (q) => q.levelId === levelId && q.skillId === skillId,
  );
}

// ═══════════════════════════════════════════════════════════
// الفلترة الشاملة
// ═══════════════════════════════════════════════════════════

export interface BankFilterV2 {
  levelIds?: string[];
  skillIds?: string[];
  movements?: string[];
  difficulties?: number[];
  operations?: string[];
  excludeIds?: string[];
}

export function filterBankV2(filter: BankFilterV2): BankQuestion[] {
  let result: BankQuestion[] = [...SOROBAN_BANK_V2];

  if (filter.levelIds?.length) {
    const set = new Set(filter.levelIds);
    result = result.filter((q) => set.has(q.levelId));
  }
  if (filter.skillIds?.length) {
    const set = new Set(filter.skillIds);
    result = result.filter((q) => set.has(q.skillId));
  }
  if (filter.movements?.length) {
    const set = new Set(filter.movements);
    result = result.filter((q) => set.has(q.movement));
  }
  if (filter.difficulties?.length) {
    const set = new Set(filter.difficulties);
    result = result.filter((q) => set.has(q.difficulty));
  }
  if (filter.operations?.length) {
    const set = new Set(filter.operations);
    result = result.filter((q) => set.has(q.operation));
  }
  if (filter.excludeIds?.length) {
    const set = new Set(filter.excludeIds);
    result = result.filter((q) => !set.has(q.id));
  }

  return result;
}

/**
 * سحب عشوائي موزون.
 *
 * @param filter معايير الفلترة
 * @param count العدد المطلوب
 * @param seed البذرة
 * @param usedIds معرفات مستخدمة (لمنع التكرار في نفس الجلسة)
 */
export function sampleFromBankV2(
  filter: BankFilterV2,
  count: number,
  seed = Date.now(),
  usedIds: string[] = [],
): BankQuestion[] {
  // استثنِ المستخدم
  const pool = filterBankV2({
    ...filter,
    excludeIds: [...(filter.excludeIds ?? []), ...usedIds],
  });

  if (pool.length === 0) return [];

  const rng = createRng(seed);
  const shuffled = shuffle([...pool], rng);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ═══════════════════════════════════════════════════════════
// دوال مساعدة للشاشات
// ═══════════════════════════════════════════════════════════

/**
 * تحديد المهارات من رقم تمرّن (0-7).
 */
export function getSkillsForPracticeNum(num: number): string[] {
  const map: Record<number, string[]> = {
    0: ["S1", "S2"],
    1: ["S3", "S4", "S5", "S6", "S7", "S8", "S9"],
    2: ["S10", "S11", "S12"],
    3: ["S13", "S14", "S15"],
    4: ["S16"],
    5: ["S17"],
    6: ["S18"],
    7: ["S19", "S20"],
  };
  return map[num] ?? [];
}

/**
 * أسئلة تمرّن حسب رقم المستوى (0-7).
 */
export function getPracticeQuestions(
  num: number,
  count: number,
  seed = Date.now(),
  usedIds: string[] = [],
): BankQuestion[] {
  const skills = getSkillsForPracticeNum(num);
  if (skills.length === 0) return [];

  return sampleFromBankV2({ skillIds: skills }, count, seed, usedIds);
}

/**
 * أسئلة أنزان حسب رقم المستوى (0-7).
 *
 * يستخدم نفس منطق التمرّن لكن مع timing مناسب للأنزان.
 */
export function getAnzanQuestions(
  num: number,
  count: number,
  seed = Date.now(),
  usedIds: string[] = [],
): BankQuestion[] {
  // نفس المصدر — الفرق في طريقة العرض
  return getPracticeQuestions(num, count, seed, usedIds);
}