// src/data/bank-v2/index.ts
// بنك الأسئلة v2 — الفهرس الموحّد
// يجمع: bank-v2 الأقسام + bank-exam + منطق تتبّع الضعف

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
// تتبّع الضعف (Weakness Tracking)
// ═══════════════════════════════════════════════════════════
//
// يستخدم من: PracticeScreen + AnzanScreen
//   - كل إجابة تُسجَّل هنا
//   - الضعف يُحدَّد تلقائياً
//   - يُحفظ في localStorage
//

const WEAK_SKILLS_KEY = "soroban_weak_skills_v2";

export interface WeakSkillRecord {
  /** معرّف المهارة (S3) */
  skillId: string;
  /** عدد المحاولات */
  attempts: number;
  /** الإجابات الصحيحة */
  correct: number;
  /** الإجابات الخاطئة */
  wrong: number;
  /** متوسط الزمن (ms) */
  avgTimeMs: number;
  /** آخر محاولة */
  lastAttempt: number;
  /** درجة الضعف (0-100) — الأعلى أضعف */
  weaknessScore: number;
}

/**
 * حساب درجة الضعف.
 *
 *   0   = متقن تماماً
 *   100 = ضعيف جداً
 */
function computeWeaknessScore(record: {
  attempts: number;
  correct: number;
  avgTimeMs: number;
}): number {
  if (record.attempts === 0) return 0;

  const accuracy = record.correct / record.attempts; // 0-1
  const accuracyPenalty = (1 - accuracy) * 60; // 0-60

  // عقوبة الخطأ المتتالي (إذا أقل من 50%)
  const streakPenalty = accuracy < 0.5 ? 20 : 0;

  // عقوبة البطء
  const timePenalty = record.avgTimeMs > 15000 ? 20 : 0;

  return Math.min(100, accuracyPenalty + streakPenalty + timePenalty);
}

/**
 * قراءة سجل الضعف.
 */
export function loadWeakSkills(): Record<string, WeakSkillRecord> {
  try {
    const raw = localStorage.getItem(WEAK_SKILLS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * حفظ سجل الضعف.
 */
function saveWeakSkills(data: Record<string, WeakSkillRecord>): void {
  try {
    localStorage.setItem(WEAK_SKILLS_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

/**
 * تسجيل إجابة.
 *
 * ⚠️ يُستخدم في: تمرّن + أنزان (فقط)
 * ❌ لا يُستخدم في الامتحان
 */
export function recordWeaknessAttempt(
  skillId: string,
  correct: boolean,
  timeMs: number,
): void {
  const all = loadWeakSkills();
  const current = all[skillId] ?? {
    skillId,
    attempts: 0,
    correct: 0,
    wrong: 0,
    avgTimeMs: 0,
    lastAttempt: 0,
    weaknessScore: 0,
  };

  const newAttempts = current.attempts + 1;
  const newCorrect = current.correct + (correct ? 1 : 0);
  const newWrong = current.wrong + (correct ? 0 : 1);

  // متوسط زمني تراكمي
  const newAvgTime =
    current.attempts === 0
      ? timeMs
      : Math.round(
          (current.avgTimeMs * current.attempts + timeMs) / newAttempts,
        );

  const newWeakness = computeWeaknessScore({
    attempts: newAttempts,
    correct: newCorrect,
    avgTimeMs: newAvgTime,
  });

  all[skillId] = {
    skillId,
    attempts: newAttempts,
    correct: newCorrect,
    wrong: newWrong,
    avgTimeMs: newAvgTime,
    lastAttempt: Date.now(),
    weaknessScore: newWeakness,
  };

  saveWeakSkills(all);
}

/**
 * الحصول على المهارات الضعيفة (مرتبة).
 *
 * يُستخدم في:
 *   - adaptiveEngine (لتقديم أسئلة علاجية)
 *   - لوحة ولي الأمر
 */
export function getWeakSkills(): WeakSkillRecord[] {
  const all = loadWeakSkills();
  return Object.values(all)
    .filter((r) => r.attempts >= 3) // ← بعد 3 محاولات على الأقل
    .sort((a, b) => b.weaknessScore - a.weaknessScore);
}

/**
 * الحصول على المهارة الأضعف (للتدريب الفوري).
 */
export function getWeakestSkill(): WeakSkillRecord | null {
  const weak = getWeakSkills();
  return weak[0] ?? null;
}

/**
 * الحصول على سجل مهارة محددة.
 */
export function getSkillWeakness(skillId: string): WeakSkillRecord | null {
  const all = loadWeakSkills();
  return all[skillId] ?? null;
}

/**
 * تصفير سجل الضعف.
 */
export function clearWeakSkills(): void {
  try {
    localStorage.removeItem(WEAK_SKILLS_KEY);
  } catch { /* ignore */ }
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
 *
 * ⚙️ منطق خاص:
 *   1. إذا كانت المهارة ضعيفة (weaknessScore ≥ 50) → تُعطى الأولوية
 *   2. وإلا → عشوائي من المهارات
 */
export function getPracticeQuestions(
  num: number,
  count: number,
  seed = Date.now(),
  usedIds: string[] = [],
): BankQuestion[] {
  const skills = getSkillsForPracticeNum(num);
  if (skills.length === 0) return [];

  // ─── الخطوة 1: تحقق من الضعف ───
  const weak = loadWeakSkills();
  const weakInThisLevel = skills
    .map((s) => weak[s])
    .filter((r) => r && r.weaknessScore >= 50)
    .sort((a, b) => (b?.weaknessScore ?? 0) - (a?.weaknessScore ?? 0));

  const questions: BankQuestion[] = [];

  // ─── الخطوة 2: 70% من المهارات الضعيفة ───
  if (weakInThisLevel.length > 0) {
    const weakCount = Math.ceil(count * 0.7);
    const weakSkillIds = weakInThisLevel.map((r) => r!.skillId);

    const weakQs = sampleFromBankV2(
      { skillIds: weakSkillIds },
      weakCount,
      seed,
      usedIds,
    );
    questions.push(...weakQs);
  }

  // ─── الخطوة 3: 30% من المهارات العادية ───
  const remaining = count - questions.length;
  if (remaining > 0) {
    const usedSoFar = [...usedIds, ...questions.map((q) => q.id)];
    const otherQs = sampleFromBankV2(
      { skillIds: skills },
      remaining,
      seed + 1,
      usedSoFar,
    );
    questions.push(...otherQs);
  }

  // خلط نهائي
  const rng = createRng(seed + 2);
  return shuffle(questions, rng);
}

/**
 * أسئلة أنزان حسب رقم المستوى (0-7).
 */
export function getAnzanQuestions(
  num: number,
  count: number,
  seed = Date.now(),
  usedIds: string[] = [],
): BankQuestion[] {
  return getPracticeQuestions(num, count, seed, usedIds);
}