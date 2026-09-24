// src/data/bank-linked.ts
// يربط البنوك الثلاثة:
// 1) bank-supplement (180) — البنك التكميلي (جديد)
// 2) bank-raw (200) — من الكتاب (خام)
// 3) bank (500) — البرمجي المولّد
//
// ⚠️ ملاحظة: المستوى في bank المولّد (L01-L07)
//    سيُعاد ترقيمه لاحقاً ليتوافق مع curriculum (L03-L16)
//    عبر طبقة bridge داخل هذا الملف.

import { SOROBAN_BANK as PROGRAMMATIC_BANK } from "./bank";
import { adaptAllRawQuestions } from "./bank-adapter";
import { SUPPLEMENT_BANK } from "./bank-supplement";
import type { BankQuestion } from "./bank";

// ═══════════════════════════════════════════════════════════
// إعادة تصدير الأنواع والدوال المساعدة من bank.ts
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
// طبقة ترجمة المستويات (Bridge)
// ═══════════════════════════════════════════════════════════
//
// bank المولّد يستخدم ترقيماً قديماً (L01-L07)
// curriculum يستخدم ترقيماً جديداً (L03-L16)
//
// هذه الخريطة تترجم المستوى القديم إلى المستوى الجديد
// حتى تظهر أسئلة البنك المولّد في الدرس الصحيح.

const LEVEL_BRIDGE: Record<string, string> = {
  // bank.ts (قديم) → curriculum (جديد)
  L01: "L03", // جمع/طرح مباشر → الجمع المباشر
  L02: "L04", // أصدقاء 5 جمع → مكملات 5 جمع
  L03: "L06", // أصدقاء 10 جمع → مكملات 10 جمع
  L04: "L10", // قواعد مركبة → عمليات مختلطة
  L05: "L08", // كبير/متعدد → جمع متعدد الخانات
  L06: "L15", // ضرب → الضرب
  L07: "L16", // قسمة → القسمة
};

/**
 * ترجمة مستوى إلى المستوى المعياري في curriculum.
 * إذا لم يكن في الخريطة، يُعاد كما هو.
 */
function bridgeLevel(levelId: string): string {
  return LEVEL_BRIDGE[levelId] ?? levelId;
}

/**
 * تطبيق الجسر على سؤال واحد.
 */
function applyBridge(question: BankQuestion): BankQuestion {
  const bridged = bridgeLevel(question.levelId);

  if (bridged === question.levelId) {
    return question;
  }

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

/** البنك التكميلي (180) — بدون ترجمة (مُصنَّف مسبقاً) */
const SUPPLEMENT: BankQuestion[] = [...SUPPLEMENT_BANK];

/** البنك الخام المحوّل (200) — بدون ترجمة */
const RAW_BANK: BankQuestion[] = adaptAllRawQuestions();

/** البنك المولّد (500) — مع ترجمة المستوى */
const BRIDGED_PROGRAMMATIC: BankQuestion[] = PROGRAMMATIC_BANK.map(applyBridge);

// ═══════════════════════════════════════════════════════════
// البنك الكامل الموحّد
// ═══════════════════════════════════════════════════════════
//
// الأولوية (من الأعلى إلى الأقل):
// 1) SUPPLEMENT (180) — أسئلة مخصّصة للفراغات
// 2) RAW (200) — أسئلة من الكتاب
// 3) PROGRAMMATIC (500) — أسئلة مولّدة
//
// المجموع = 880 سؤالاً

export const SOROBAN_BANK: readonly BankQuestion[] = Object.freeze([
  ...SUPPLEMENT,
  ...RAW_BANK,
  ...BRIDGED_PROGRAMMATIC,
]);

/**
 * عدد الأسئلة الكلي في البنك الموحّد.
 */
export const BANK_SIZE = SOROBAN_BANK.length;

/**
 * إحصاءات البنك (للاختبار).
 */
export const BANK_STATS = {
  supplement: SUPPLEMENT.length,
  raw: RAW_BANK.length,
  programmatic: BRIDGED_PROGRAMMATIC.length,
  total: SOROBAN_BANK.length,
} as const;

// ═══════════════════════════════════════════════════════════
// دوال الاستعلام (تعمل على البنك الكامل)
// ═══════════════════════════════════════════════════════════

/**
 * الحصول على سؤال بالمعرّف.
 */
export function getQuestionById(id: string): BankQuestion | undefined {
  return SOROBAN_BANK.find((q) => q.id === id);
}

/**
 * الحصول على أسئلة مستوى معين.
 *
 * يعمل بعد تطبيق الجسر — أي بوحدات curriculum.
 */
export function getQuestionsByLevel(levelId: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.levelId === levelId);
}

/**
 * الحصول على أسئلة مهارة معينة.
 */
export function getQuestionsBySkill(skillId: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.skillId === skillId);
}

/**
 * الحصول على أسئلة قاعدة معينة.
 */
export function getQuestionsByRule(ruleId: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.ruleId === ruleId);
}

/**
 * الحصول على أسئلة حركة معينة.
 */
export function getQuestionsByMovement(movement: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.movement === movement);
}

// ═══════════════════════════════════════════════════════════
// دوال مساعدة للفلترة المتقدمة
// ═══════════════════════════════════════════════════════════

/**
 * فلترة شاملة — للاستخدام في أقسام:
 * - تمرّن (Practice)
 * - أنزان (Anzan)
 * - امتحانات (Exams)
 */
export interface BankFilter {
  /** مستويات محددة */
  levelIds?: string[];

  /** مهارات محددة */
  skillIds?: string[];

  /** قواعد محددة */
  ruleIds?: string[];

  /** حركات محددة */
  movements?: string[];

  /** صعوبات محددة */
  difficulties?: number[];

  /** أسئلة يجب استثناؤها */
  excludeIds?: string[];

  /** مصدر محدد */
  sources?: Array<"supplement" | "raw" | "programmatic">;
}

/**
 * فلترة البنك وفق معايير.
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
 * يُستخدم في الامتحانات.
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