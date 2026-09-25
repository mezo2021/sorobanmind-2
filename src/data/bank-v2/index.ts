// src/data/bank-v2/index.ts
// بنك الأسئلة v2 — الموحّد
// يجمع الأقسام الأربعة:
//   - PART_01: L0-L1 (S1-S9)
//   - PART_02: L2-L3 (S10-S15)
//   - PART_03: L4-L5 (S16-S17)
//   - PART_04: L6-L7 (S18-S20)
// المجموع: ~585 سؤال

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
} from "./types";

// ═══════════════════════════════════════════════════════════
// البنك الموحّد
// ═══════════════════════════════════════════════════════════

/**
 * كل الأسئلة — مرتبة حسب المستوى ثم المهارة.
 */
export const SOROBAN_BANK_V2: readonly BankQuestion[] = Object.freeze([
  ...PART_01,  // L0-L1: S1-S9
  ...PART_02,  // L2-L3: S10-S15
  ...PART_03,  // L4-L5: S16-S17
  ...PART_04,  // L6-L7: S18-S20
]);

/**
 * عدد الأسئلة الكلي.
 */
export const BANK_V2_SIZE = SOROBAN_BANK_V2.length;

/**
 * إحصاءات البنك.
 */
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

/**
 * الحصول على سؤال بالمعرّف.
 */
export function getQuestionById(id: string): BankQuestion | undefined {
  return SOROBAN_BANK_V2.find((q) => q.id === id);
}

/**
 * الحصول على أسئلة مستوى.
 */
export function getQuestionsByLevel(levelId: string): BankQuestion[] {
  return SOROBAN_BANK_V2.filter((q) => q.levelId === levelId);
}

/**
 * الحصول على أسئلة مهارة.
 */
export function getQuestionsBySkill(skillId: string): BankQuestion[] {
  return SOROBAN_BANK_V2.filter((q) => q.skillId === skillId);
}

/**
 * الحصول على أسئلة حركة.
 */
export function getQuestionsByMovement(movement: string): BankQuestion[] {
  return SOROBAN_BANK_V2.filter((q) => q.movement === movement);
}

/**
 * الحصول على أسئلة مستوى + مهارة (الأكثر استخداماً).
 */
export function getQuestionsByLevelSkill(
  levelId: string,
  skillId: string,
): BankQuestion[] {
  return SOROBAN_BANK_V2.filter(
    (q) => q.levelId === levelId && q.skillId === skillId,
  );
}

// ═══════════════════════════════════════════════════════════
// فلترة شاملة
// ═══════════════════════════════════════════════════════════

export interface BankFilterV2 {
  /** مستوى واحد أو أكثر (L0-L7) */
  levelIds?: string[];
  /** مهارة واحدة أو أكثر (S1-S20) */
  skillIds?: string[];
  /** حركات محددة */
  movements?: string[];
  /** صعوبات محددة (1-5) */
  difficulties?: number[];
  /** عمليات محددة */
  operations?: string[];
  /** أسئلة مستثناة */
  excludeIds?: string[];
}

/**
 * فلترة البنك.
 */
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
 * يُستخدم في:
 *   - تمرّن
 *   - أنزان
 *   - امتحان 1 / 2
 */
export function sampleFromBankV2(
  filter: BankFilterV2,
  count: number,
  seed = Date.now(),
): BankQuestion[] {
  const pool = filterBankV2(filter);
  if (pool.length === 0) return [];

  const rng = createRng(seed);
  const shuffled = shuffle([...pool], rng);

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ═══════════════════════════════════════════════════════════
// دوال مساعدة لشاشات التمرّن والأنزان
// ═══════════════════════════════════════════════════════════

/**
 * تحديد المهارة من رقم تمرّن/أنزان (0-7).
 *
 * تربط رقم التمرّن (0-7) بمهاراته في المستوى.
 */
export function getSkillsForPracticeNum(num: number): string[] {
  const map: Record<number, string[]> = {
    0: ["S1", "S2"],                    // L0: تمثيل
    1: ["S3", "S4", "S5", "S6", "S7", "S8", "S9"], // L1: جمع/طرح كامل
    2: ["S10", "S11", "S12"],           // L2: الضرب
    3: ["S13", "S14", "S15"],           // L3: القسمة
    4: ["S16"],                          // L4: جمع/طرح متقدم
    5: ["S17"],                          // L5: ضرب/قسمة متقدم
    6: ["S18"],                          // L6: عشرية
    7: ["S19", "S20"],                   // L7: جذور
  };
  return map[num] ?? [];
}

/**
 * الحصول على أسئلة تمرّن حسب رقم المستوى.
 */
export function getPracticeQuestions(
  num: number,
  count: number,
  seed = Date.now(),
): BankQuestion[] {
  const skills = getSkillsForPracticeNum(num);
  if (skills.length === 0) return [];

  return sampleFromBankV2({ skillIds: skills }, count, seed);
}

/**
 * الحصول على أسئلة امتحان القسم.
 *
 * القسم 1: L0-L3 (S1-S15)
 * القسم 2: L4-L7 (S16-S20)
 */
export function getCategoryExamQuestions(
  category: "category-1" | "category-2",
  count: number,
  seed = Date.now(),
): BankQuestion[] {
  const filter: BankFilterV2 =
    category === "category-1"
      ? { levelIds: ["L0", "L1", "L2", "L3"] }
      : { levelIds: ["L4", "L5", "L6", "L7"] };

  return sampleFromBankV2(filter, count, seed);
}