// ═══════════════════════════════════════════════════════════════════
// 🏦 src/data/bank-v2/index.ts — الفهرس الموحّد لبنك v2
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يجمع: PART_01 + PART_02 + PART_03 + PART_04
//   - يُعيد تصدير: types + bank-exam + placement-engine
//   - يوفّر: دوال استعلام، فلترة، تتبع ضعف، امتحانات قسم
//
// ✅ حالة جيدة: يستخدم S1-S20 و L0-L7 — متوافق جزئيًا مع SRB
//
// 📥 الاعتماديات:
//   - ./types (BankQuestion + أدوات)
//   - ./part-01 → ./part-04 (PART_XX)
//
// 📤 الصادرات:
//
//   ثوابت التمرّن:
//     - PRACTICE_QUESTION_COUNT (5)
//     - ANZAN_VISUAL_COUNT · ANZAN_AUDIO_COUNT (5)
//     - WEAK_SKILL_RATIO (0.7) · WEAK_SKILL_THRESHOLD (50)
//
//   البنك:
//     - SOROBAN_BANK_V2 · BANK_V2_SIZE · BANK_V2_STATS
//
//   الاستعلام:
//     - getQuestionById · getQuestionsByLevel · getQuestionsBySkill
//     - getQuestionsByMovement · getQuestionsByLevelSkill
//
//   الفلترة:
//     - BankFilterV2 · filterBankV2 · sampleFromBankV2
//
//   تتبّع الضعف:
//     - WeakSkillRecord · loadWeakSkills · recordWeaknessAttempt
//     - getWeakSkills · getWeakestSkill · getSkillWeakness · clearWeakSkills
//
//   الشاشات:
//     - getSkillsForPracticeNum · getPracticeQuestions
//     - getAnzanVisualQuestions · getAnzanAudioQuestions
//
//   امتحانات القسم:
//     - EXAM1_QUESTION_COUNT (20) · EXAM2_QUESTION_COUNT (40)
//     - EXAM1_TIME_SEC (600) · EXAM2_TIME_SEC (1200)
//     - EXAM_PASS_THRESHOLD (80) · EXAM_MAX_ATTEMPTS (2)
//     - EXAM_COOLDOWN_MS (48 ساعة)
//     - buildExam1Category · buildExam2Category
//
// 🎯 التوافق مع SRB:
//
//   | العنصر في v2                    | SRB المقابل              | الحالة |
//   |---------------------------------|--------------------------|--------|
//   | SOROBAN_BANK_V2                 | SRB.getAll()             | 🔄 |
//   | skillIds: "S1"                  | "S01"                    | ⚠️ يحتاج تحويل |
//   | soroban_weak_skills_v2          | srb_weak_skills          | 🔄 |
//   | PRACTICE_QUESTION_COUNT (5)     | SRB.PRACTICE_COUNT       | ✅ |
//   | WEAK_SKILL_RATIO (0.7)          | SRB.WEAK_RATIO           | ✅ |
//   | WEAK_SKILL_THRESHOLD (50)       | SRB.WEAK_THRESHOLD       | ✅ |
//   | EXAM1_DISTRIBUTION              | SRB.EXAM1_DIST           | ✅ |
//   | EXAM2_DISTRIBUTION              | SRB.EXAM2_DIST           | ✅ |
//
// 🔗 خطة الاستبدال بـ SRB (المرحلة 5):
//
//   الخطوة 1: SRB.getAll() بدل SOROBAN_BANK_V2
//   الخطوة 2: تحديث skillIds إلى S01-S20
//   الخطوة 3: نقل تتبّع الضعف إلى progressStore
//   الخطوة 4: تحديث المفاتيح (soroban_weak_skills_v2 → srb_weak_skills)
//   الخطوة 5: اختبار شامل + حذف bank-v2/
//
// ⚠️ قواعد حرجة:
//   1. لا تغيّر توزيعات الامتحانات (EXAM1_DISTRIBUTION · EXAM2_DISTRIBUTION)
//   2. لا تغيّر عتبات (PASS_THRESHOLD · MAX_ATTEMPTS · COOLDOWN)
//   3. لا تغيّر WEAK_SKILL_RATIO (0.7) — قرار تعليمي
//   4. لا تغيّر منطق pickHardest (اختيار الأصعب)
//
// آخر تحديث: 2026-09-29
//   - إضافة توثيق شامل + تحليل توافق SRB
//   - لا تغيير في المنطق
//
// ═══════════════════════════════════════════════════════════════════

// src/data/bank-v2/index.ts
// بنك الأسئلة v2 — الفهرس الموحّد
// يجمع: bank-v2 + bank-exam + placement + منطق الضعف + امتحانات القسم

import type { BankQuestion } from "./types";
import { createRng, shuffle } from "./types";

// 🔗 SRB-MIGRATION: ستُستبدل بـ SRB.questions
import { PART_01 } from "./part-01";
import { PART_02 } from "./part-02";
import { PART_03 } from "./part-03";
import { PART_04 } from "./part-04";

// ═══════════════════════════════════════════════════════════
// 🔄 إعادة تصدير الأنواع والأدوات
// ═══════════════════════════════════════════════════════════

export type {
  BankQuestion,
  BankOperation,
  Difficulty,
  QuestionTiming,
} from "./types";

export {
  makeId,              // 🔗 SRB: SRB.makeId()
  makeQuestion,        // 🔗 SRB: SRB.makeQuestion()
  createRng,
  randInt,
  shuffle,
  getDigits,
  hasCarry,
  hasBorrow,
  complementTo5,
  complementTo10,
  classifyAdd,         // 🔗 SRB: SRB.classifyAdd()
  classifySub,         // 🔗 SRB: SRB.classifySub()
  getDefaultTiming,    // 🔗 SRB: SRB.getDefaultTiming()
  adaptTiming,         // 🔗 SRB: SRB.adaptTiming()
  applyAdaptiveSpeed,  // 🔗 SRB: SRB.applyAdaptiveSpeed()
} from "./types";

export type { ExamQuestion } from "./bank-exam";

export {
  EXAM_POOL_1,         // 🔗 SRB: SRB.getExamPool("EX1")
  EXAM_POOL_2,         // 🔗 SRB: SRB.getExamPool("EX2")
  EXAM_STATS,
  buildExam1,          // 🔗 SRB: SRB.buildExam1()
  buildExam2,          // 🔗 SRB: SRB.buildExam2()
} from "./bank-exam";

export type {
  PlacementQuestion,
  PlacementResult,
  LevelResult,
} from "./placement-engine";

export {
  buildPlacementTest,      // 🔗 SRB: SRB.buildPlacementTest()
  evaluatePlacementTest,   // 🔗 SRB: SRB.evaluatePlacementTest()
  canTakePlacementTest,    // 🔗 SRB: SRB.canTakePlacementTest()
  getLevelName,
  QUESTIONS_PER_LEVEL,
  POINTS_PER_QUESTION,
  POINTS_PER_LEVEL,
  PASS_THRESHOLD,          // 🔗 SRB: SRB.PLACEMENT_PASS
} from "./placement-engine";

// ═══════════════════════════════════════════════════════════
// 🔢 الإعدادات (Constants)
// 🔗 SRB-MIGRATION: تنتقل إلى SRB.config
// ═══════════════════════════════════════════════════════════

export const PRACTICE_QUESTION_COUNT = 5;   // 5 أسئلة لكل جلسة تمرّن
export const ANZAN_VISUAL_COUNT = 5;        // 5 أسئلة لكل جلسة أنزان بصري
export const ANZAN_AUDIO_COUNT = 5;         // 5 أسئلة لكل جلسة أنزان سمعي
export const WEAK_SKILL_RATIO = 0.7;        // 70% من الأسئلة للمهارات الضعيفة
export const WEAK_SKILL_THRESHOLD = 50;     // عتبة "ضعيف" = 50/100

// ═══════════════════════════════════════════════════════════
// 🏦 البنك الأساسي
// 🔗 SRB-MIGRATION: SRB.getAll()
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
// 🔍 دوال الاستعلام
// 🔗 SRB-MIGRATION: SRB.get*()
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
// 🔍 الفلترة
// 🔗 SRB-MIGRATION: SRB.filter() · SRB.sample()
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
// 📊 تتبّع الضعف (Weak Skills Tracking)
// 🔗 SRB-MIGRATION: ينتقل إلى progressStore
// ═══════════════════════════════════════════════════════════

const WEAK_SKILLS_KEY = "soroban_weak_skills_v2";  // 🔗 SRB: srb_weak_skills

export interface WeakSkillRecord {
  skillId: string;
  attempts: number;
  correct: number;
  wrong: number;
  avgTimeMs: number;
  lastAttempt: number;
  weaknessScore: number;   // 0-100
}

/**
 * حساب درجة الضعف.
 *
 * القاعدة:
 *   - (1 - accuracy) × 60
 *   - +20 إذا كانت accuracy < 50%
 *   - +20 إذا كان avgTimeMs > 15000
 *   - الحد الأقصى: 100
 */
function computeWeaknessScore(record: {
  attempts: number;
  correct: number;
  avgTimeMs: number;
}): number {
  if (record.attempts === 0) return 0;

  const accuracy = record.correct / record.attempts;
  const accuracyPenalty = (1 - accuracy) * 60;
  const streakPenalty = accuracy < 0.5 ? 20 : 0;
  const timePenalty = record.avgTimeMs > 15000 ? 20 : 0;

  return Math.min(100, accuracyPenalty + streakPenalty + timePenalty);
}

export function loadWeakSkills(): Record<string, WeakSkillRecord> {
  try {
    const raw = localStorage.getItem(WEAK_SKILLS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveWeakSkills(data: Record<string, WeakSkillRecord>): void {
  try {
    localStorage.setItem(WEAK_SKILLS_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

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

export function getWeakSkills(): WeakSkillRecord[] {
  const all = loadWeakSkills();
  return Object.values(all)
    .filter((r) => r.attempts >= 3)   // على الأقل 3 محاولات
    .sort((a, b) => b.weaknessScore - a.weaknessScore);
}

export function getWeakestSkill(): WeakSkillRecord | null {
  const weak = getWeakSkills();
  return weak[0] ?? null;
}

export function getSkillWeakness(skillId: string): WeakSkillRecord | null {
  const all = loadWeakSkills();
  return all[skillId] ?? null;
}

export function clearWeakSkills(): void {
  try {
    localStorage.removeItem(WEAK_SKILLS_KEY);
  } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════════════════
// 🎯 دوال مساعدة للشاشات (تمرّن + أنزان)
// 🔗 SRB-MIGRATION: SRB.getPracticeQuestions()
// ═══════════════════════════════════════════════════════════

/**
 * المهارات المرتبطة بكل مستوى.
 *
 * ⚠️ يستخدم S1-S20 (خانة واحدة) — SRB يستخدم S01-S20 (خانتان)
 */
export function getSkillsForPracticeNum(num: number): string[] {
  const map: Record<number, string[]> = {
    0: ["S1", "S2"],                              // 🔗 SRB: S01, S02
    1: ["S3", "S4", "S5", "S6", "S7", "S8", "S9"], // 🔗 SRB: S03-S09
    2: ["S10", "S11", "S12"],
    3: ["S13", "S14", "S15"],
    4: ["S16"],
    5: ["S17"],
    6: ["S18"],
    7: ["S19", "S20"],
  };
  return map[num] ?? [];
}

export function getPracticeQuestions(
  num: number,
  seed = Date.now(),
  usedIds: string[] = [],
): BankQuestion[] {
  const count = PRACTICE_QUESTION_COUNT;
  const skills = getSkillsForPracticeNum(num);
  if (skills.length === 0) return [];

  // تحميل المهارات الضعيفة
  const weak = loadWeakSkills();
  const weakInThisLevel = skills
    .map((s) => weak[s])
    .filter((r) => r && r.weaknessScore >= WEAK_SKILL_THRESHOLD)
    .sort((a, b) => (b?.weaknessScore ?? 0) - (a?.weaknessScore ?? 0));

  const questions: BankQuestion[] = [];

  // 70% من المهارات الضعيفة
  if (weakInThisLevel.length > 0) {
    const weakCount = Math.ceil(count * WEAK_SKILL_RATIO);
    const weakSkillIds = weakInThisLevel.map((r) => r!.skillId);

    const weakQs = sampleFromBankV2(
      { skillIds: weakSkillIds },
      weakCount,
      seed,
      usedIds,
    );
    questions.push(...weakQs);
  }

  // 30% من باقي المهارات
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

  const rng = createRng(seed + 2);
  return shuffle(questions, rng);
}

export function getAnzanVisualQuestions(
  num: number,
  seed = Date.now(),
  usedIds: string[] = [],
): BankQuestion[] {
  return getPracticeQuestions(num, seed, usedIds);
}

export function getAnzanAudioQuestions(
  num: number,
  seed = Date.now(),
  usedIds: string[] = [],
): BankQuestion[] {
  return getPracticeQuestions(num, seed, usedIds);
}

// ═══════════════════════════════════════════════════════════
// 🎓 امتحانات القسم (Category Exams)
// 🔗 SRB-MIGRATION: SRB.buildCategoryExam()
// ═══════════════════════════════════════════════════════════

/** ✅ عدد المنازل */
function digitCount(value: number): number {
  const abs = Math.abs(value);
  if (abs === 0) return 1;
  return String(abs).length;
}

/**
 * ✅ اختيار الأصعب من البنك:
 *   1. عدد الحدود (operands.length) — الأكثر = أصعب
 *   2. الصعوبة (difficulty)
 *   3. عدد المنازل (digitCount)
 * ثم خلط طفيف لتنويع الأسئلة بين الجلسات.
 */
function pickHardest(
  pool: BankQuestion[],
  count: number,
  rng: () => number,
): BankQuestion[] {
  if (pool.length === 0) return [];

  const sorted = [...pool].sort((a, b) => {
    // 1. عدد الحدود
    const termDiff = b.operands.length - a.operands.length;
    if (termDiff !== 0) return termDiff;

    // 2. الصعوبة
    const diffDiff = b.difficulty - a.difficulty;
    if (diffDiff !== 0) return diffDiff;

    // 3. عدد المنازل
    return digitCount(b.correctAnswer) - digitCount(a.correctAnswer);
  });

  // خذ أعلى 3× من المطلوب، ثم اخلط واختر
  const topPool = sorted.slice(0, Math.min(count * 3, sorted.length));
  const shuffled = shuffle(topPool, rng);
  return shuffled.slice(0, count);
}

/** توزيع Exam 1 (L0-L3) */
const EXAM1_DISTRIBUTION: Record<string, number> = {
  L0: 3,
  L1: 7,
  L2: 5,
  L3: 5,
};
// المجموع: 20 سؤال

/** توزيع Exam 2 (L4-L7) */
const EXAM2_DISTRIBUTION: Record<string, number> = {
  L4: 10,
  L5: 10,
  L6: 10,
  L7: 10,
};
// المجموع: 40 سؤال

export const EXAM1_QUESTION_COUNT = 20;
export const EXAM2_QUESTION_COUNT = 40;
export const EXAM1_TIME_SEC = 10 * 60;   // 10 دقائق
export const EXAM2_TIME_SEC = 20 * 60;   // 20 دقيقة
export const EXAM_PASS_THRESHOLD = 80;   // 80% للنجاح
export const EXAM_MAX_ATTEMPTS = 2;      // محاولتان
export const EXAM_COOLDOWN_MS = 48 * 60 * 60 * 1000;  // 48 ساعة

/**
 * ✅ بناء امتحان القسم 1 (L0-L3) — 20 سؤالاً — الأصعب من كل مستوى.
 */
export function buildExam1Category(seed = Date.now()): BankQuestion[] {
  const rng = createRng(seed);
  const questions: BankQuestion[] = [];

  for (const [levelId, count] of Object.entries(EXAM1_DISTRIBUTION)) {
    const pool = filterBankV2({ levelIds: [levelId] });
    if (pool.length === 0) continue;
    questions.push(...pickHardest(pool, count, rng));
  }

  return shuffle(questions, rng);
}

/**
 * ✅ بناء امتحان القسم 2 (L4-L7) — 40 سؤالاً — الأصعب من كل مستوى.
 */
export function buildExam2Category(seed = Date.now()): BankQuestion[] {
  const rng = createRng(seed);
  const questions: BankQuestion[] = [];

  for (const [levelId, count] of Object.entries(EXAM2_DISTRIBUTION)) {
    const pool = filterBankV2({ levelIds: [levelId] });
    if (pool.length === 0) continue;
    questions.push(...pickHardest(pool, count, rng));
  }

  return shuffle(questions, rng);
}