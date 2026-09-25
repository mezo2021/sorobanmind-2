// src/data/bank-linked.ts
// يربط البنوك الثلاثة + Bridge لترجمة L01-L07 → L0-L7

import { SOROBAN_BANK as PROGRAMMATIC_BANK } from "./bank";
import { adaptAllRawQuestions } from "./bank-adapter";
import type { BankQuestion } from "./bank";

// ═══════════════════════════════════════════════════════════
// إعادة تصدير الأنواع والدوال من bank.ts
// ═══════════════════════════════════════════════════════════

export type {
  BankQuestion,
  BankOperation,
  Difficulty,
  PlaceValue,
  SorobanRule,
  QuestionEvaluation,
} from "./bank";

export {
  bankQuestionToProblem,
  evaluateBankAnswer,
} from "./bank";

// ═══════════════════════════════════════════════════════════
// Bridge: ترجمة المستويات القديمة (L01-L07) → الجديدة (L0-L7)
// ═══════════════════════════════════════════════════════════

/**
 * خريطة ترجمة مستوى bank.ts (القديم) → curriculum.ts (الجديد)
 *
 * bank.ts يستخدم L01-L07 (بصيغة قديمة)
 * المنهج الجديد يستخدم L0-L7
 */
const LEVEL_BRIDGE: Record<string, string> = {
  // bank.ts (قديم) → المنهج الجديد
  L01: "L1",  // جمع/طرح مباشر → L1
  L02: "L1",  // أصدقاء 5 جمع → L1
  L03: "L1",  // أصدقاء 10 جمع → L1
  L04: "L4",  // قواعد مركبة → L4
  L05: "L4",  // كبير/متعدد → L4
  L06: "L2",  // الضرب → L2
  L07: "L3",  // القسمة → L3
};

/**
 * ترجمة مستوى إلى المستوى المعياري الجديد.
 */
function bridgeLevel(levelId: string): string {
  return LEVEL_BRIDGE[levelId] ?? levelId;
}

/**
 * تطبيق الجسر على سؤال.
 */
function applyBridge(question: BankQuestion): BankQuestion {
  const bridged = bridgeLevel(question.levelId);

  if (bridged === question.levelId) return question;

  return {
    ...question,
    levelId: bridged,
    skillId: question.skillId.replace(/^L\d+/, bridged),
    ruleId: question.ruleId.replace(/^L\d+/, bridged),
    tags: [...question.tags, `bridged-from-${question.levelId}`],
  };
}

// ═══════════════════════════════════════════════════════════
// بناء البنوك الفرعية
// ═══════════════════════════════════════════════════════════

/** البنك الخام المحوَّل (200) */
const RAW_BANK: BankQuestion[] = adaptAllRawQuestions();

/** البنك المولَّد (500) مع ترجمة المستوى */
const BRIDGED_PROGRAMMATIC: BankQuestion[] = PROGRAMMATIC_BANK.map(applyBridge);

// ═══════════════════════════════════════════════════════════
// البنك الكامل الموحّد
// ═══════════════════════════════════════════════════════════

export const SOROBAN_BANK: readonly BankQuestion[] = Object.freeze([
  ...RAW_BANK,
  ...BRIDGED_PROGRAMMATIC,
]);

/**
 * عدد الأسئلة الكلي.
 */
export const BANK_SIZE = SOROBAN_BANK.length;

/**
 * إحصاءات البنك.
 */
export const BANK_STATS = {
  raw: RAW_BANK.length,
  programmatic: BRIDGED_PROGRAMMATIC.length,
  total: SOROBAN_BANK.length,
} as const;

// ═══════════════════════════════════════════════════════════
// دوال الاستعلام
// ═══════════════════════════════════════════════════════════

export function getQuestionById(id: string): BankQuestion | undefined {
  return SOROBAN_BANK.find((q) => q.id === id);
}

export function getQuestionsByLevel(levelId: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.levelId === levelId);
}

export function getQuestionsBySkill(skillId: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.skillId === skillId);
}

export function getQuestionsByRule(ruleId: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.ruleId === ruleId);
}

export function getQuestionsByMovement(movement: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.movement === movement);
}

// ═══════════════════════════════════════════════════════════
// فلترة شاملة (لأقسام: تمرّن، أنزان، امتحان)
// ═══════════════════════════════════════════════════════════

export interface BankFilter {
  levelIds?: string[];
  skillIds?: string[];
  ruleIds?: string[];
  movements?: string[];
  difficulties?: number[];
  excludeIds?: string[];
}

/**
 * فلترة البنك.
 */
export function filterBank(filter: BankFilter): BankQuestion[] {
  let result: BankQuestion[] = [...SOROBAN_BANK];

  if (filter.levelIds?.length) {
    const set = new Set(filter.levelIds);
    result = result.filter((q) => set.has(q.levelId));
  }

  if (filter.skillIds?.length) {
    const set = new Set(filter.skillIds);
    result = result.filter((q) => set.has(q.skillId));
  }

  if (filter.ruleIds?.length) {
    const set = new Set(filter.ruleIds);
    result = result.filter((q) => set.has(q.ruleId));
  }

  if (filter.movements?.length) {
    const set = new Set(filter.movements);
    result = result.filter((q) => set.has(q.movement));
  }

  if (filter.difficulties?.length) {
    const set = new Set(filter.difficulties);
    result = result.filter((q) => set.has(q.difficulty));
  }

  if (filter.excludeIds?.length) {
    const set = new Set(filter.excludeIds);
    result = result.filter((q) => !set.has(q.id));
  }

  return result;
}

/**
 * سحب عشوائي موزون من البنك.
 * يُستخدم في الامتحانات والأنزان.
 */
export function sampleFromBank(
  filter: BankFilter,
  count: number,
  seed = Date.now(),
): BankQuestion[] {
  const pool = filterBank(filter);
  if (pool.length === 0) return [];

  // RNG قابل لإعادة الإنتاج
  let value = seed >>> 0;
  const rng = (): number => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}