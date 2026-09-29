// ═══════════════════════════════════════════════════════════════════
// 🏗️ src/data/bank-v2/types.ts — أنواع وأدوات بنك الأسئلة v2
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يُعرِّف BankQuestion (بنية السؤال الحديثة)
//   - يوفّر makeId() و makeQuestion() لبناء الأسئلة
//   - يوفّر TIMING_PROFILES (20 مهارة × 5 صعوبات)
//   - يوفّر adaptTiming() للسياقات المختلفة (P / ANZ / X)
//   - يوفّر classifyAdd/Sub (منطق الحركة على السوروبان)
//
// ✅ حالة ممتازة: متوافق مع SRB بنسبة 80%
//
// 📥 الاعتماديات:
//   - ../../curriculum/types (MovementType)
//
// 📤 الصادرات الرئيسية:
//
//   الأنواع:
//     - BankOperation · Difficulty · QuestionTiming · BankQuestion
//
//   بناء:
//     - makeId() · makeQuestion()
//
//   التوقيت:
//     - TIMING_PROFILES · getDefaultTiming() · adaptTiming()
//     - applyAdaptiveSpeed()
//
//   أدوات:
//     - createRng() · randInt() · shuffle()
//     - getDigits() · hasCarry() · hasBorrow()
//     - complementTo5() · complementTo10()
//     - classifyAdd() · classifySub()
//
// 🎯 التوافق مع SRB:
//
//   | العنصر في v2          | SRB المقابل              | الحالة |
//   |-----------------------|--------------------------|--------|
//   | id: "L0-S1-001"       | "SRB-L0-S01-M01-B001"    | ⚠️ يحتاج تحويل |
//   | skillId: "S1"         | "S01"                    | ⚠️ خانة واحدة |
//   | timing.answerMs       | target_time_ms[0]        | ✅ متوافق |
//   | timing.maxMs          | target_time_ms[1]        | ✅ متوافق |
//   | maxMs = answerMs×1.5  | نفس القاعدة              | ✅ مطابق! |
//
// 🔗 خطة الاستبدال بـ SRB (المرحلة 5):
//
//   الخطوة 1: إنشاء src/data/srb/types.ts
//     - نسخ BankQuestion
//     - إضافة: moduleId, allowed_phases, prerequisite_id
//     - إضافة: next_if_success, next_if_fail, difficulty_score
//
//   الخطوة 2: تحديث makeId() لصيغة SRB
//     - من: "L0-S1-001"
//     - إلى: "SRB-L0-S01-M01-B001"
//
//   الخطوة 3: نقل classifyAdd/Sub إلى SRB
//     - منطق السوروبان ثابت
//
//   الخطوة 4: نقل TIMING_PROFILES إلى SRB
//     - 20 مهارة × 5 صعوبات = 100 قيمة
//
//   الخطوة 5: تحديث المستوردين (bank-linked → srb)
//
// ⚠️ قواعد حرجة:
//   1. لا تغيّر TIMING_PROFILES (100 قيمة مختبرة)
//   2. لا تغيّر classifyAdd/Sub (منطق السوروبان)
//   3. لا تغيّر قاعدة maxMs × 1.5
//   4. حافظ على adaptTiming (4 سياقات)
//
// آخر تحديث: 2026-09-29
//   - إضافة توثيق شامل + تحليل التوافق مع SRB
//   - لا تغيير في المنطق
//
// ═══════════════════════════════════════════════════════════════════

// src/data/bank-v2/types.ts
import type { MovementType } from "../../curriculum/types";

// ═══════════════════════════════════════════════════════════
// 📝 الأنواع (Types)
// ═══════════════════════════════════════════════════════════

export type BankOperation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "build"
  | "read";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

/**
 * توقيتات السؤال.
 *
 * 🔗 SRB-MIGRATION: يتحول إلى target_time_ms في SRB
 */
export interface QuestionTiming {
  displayMs?: number;   // زمن العرض (للأنزان)
  answerMs: number;     // 🔗 SRB: target_time_ms[0]
  maxMs: number;        // 🔗 SRB: target_time_ms[1]
}

/**
 * السؤال الحديث (v2).
 *
 * 🔗 SRB-MIGRATION: سيصبح SRBQuestion مع حقول إضافية
 */
export interface BankQuestion {
  id: string;                    // 🔗 SRB: SRB-L0-S01-M01-B001
  levelId: string;               // ✅ متوافق: L0-L7
  skillId: string;               // ⚠️ SRB: S01 بدلاً من S1
  prompt: string;
  operands: number[];
  operation: BankOperation;
  correctAnswer: number;
  movement: MovementType;
  difficulty: Difficulty;
  timing: QuestionTiming;        // 🔗 SRB: target_time_ms + display_ms
  explanation?: string;
  tags?: string[];
  // 🔗 SRB سيضيف: moduleId, allowed_phases, prerequisite_id,
  //             next_if_success, next_if_fail, difficulty_score
}

// ═══════════════════════════════════════════════════════════
// 🏗️ بناء الأسئلة
// 🔗 SRB-MIGRATION: ستُحدَّث لصيغة SRB
// ═══════════════════════════════════════════════════════════

/**
 * إنشاء معرّف السؤال.
 *
 * الصيغة الحالية: "L0-S1-001"
 *
 * 🔗 SRB-MIGRATION: سيصبح "SRB-L0-S01-M01-B001"
 */
export function makeId(levelId: string, skillNum: number, seq: number): string {
  return `${levelId}-S${skillNum}-${String(seq).padStart(3, "0")}`;
}

/**
 * إنشاء سؤال كامل مع التوقيت المناسب.
 *
 * 🔗 SRB-MIGRATION: SRB.makeQuestion()
 */
export function makeQuestion(params: {
  levelId: string;
  skillNum: number;
  seq: number;
  prompt: string;
  operands: number[];
  operation: BankOperation;
  correctAnswer: number;
  movement: MovementType;
  difficulty: Difficulty;
  expectedTimeMs?: number;
  timing?: Partial<QuestionTiming>;
  explanation?: string;
  tags?: string[];
}): BankQuestion {
  const id = makeId(params.levelId, params.skillNum, params.seq);

  let timing: QuestionTiming;

  if (params.timing) {
    const answerMs = params.timing.answerMs ?? params.expectedTimeMs ?? 8000;
    const maxMs = params.timing.maxMs ?? Math.round(answerMs * 1.5);
    timing = {
      displayMs: params.timing.displayMs,
      answerMs,
      maxMs,
    };
  } else {
    const defaultTiming = getDefaultTiming(params.skillNum, params.difficulty);
    timing = defaultTiming;

    if (params.expectedTimeMs) {
      timing = {
        ...timing,
        answerMs: params.expectedTimeMs,
        maxMs: Math.round(params.expectedTimeMs * 1.5),  // 🔗 SRB: قاعدة #8
      };
    }
  }

  return {
    id,
    levelId: params.levelId,
    skillId: `S${params.skillNum}`,      // ⚠️ SRB: S01, S02, ...
    prompt: params.prompt,
    operands: params.operands,
    operation: params.operation,
    correctAnswer: params.correctAnswer,
    movement: params.movement,
    difficulty: params.difficulty,
    timing,
    explanation: params.explanation,
    tags: params.tags,
  };
}

// ═══════════════════════════════════════════════════════════
// ⏱️ ملفات التوقيت (Timing Profiles)
// 🔗 SRB-MIGRATION: تنتقل إلى SRB كما هي
// ═══════════════════════════════════════════════════════════

interface TimingProfile {
  /** [difficulty 1, 2, 3, 4, 5] */
  answerMs: [number, number, number, number, number];
  displayMs: number;
}

/**
 * ملفات التوقيت لكل مهارة (S1-S20).
 *
 * القاعدة: كل مهارة لها 5 قيم (حسب الصعوبة 1-5).
 *
 * 🔗 SRB-MIGRATION: SRB.TIMING_PROFILES
 */
const TIMING_PROFILES: Record<number, TimingProfile> = {
  1: { answerMs: [5000, 4500, 4000, 3500, 3000], displayMs: 3000 },
  2: { answerMs: [7000, 6000, 5500, 5000, 4500], displayMs: 3000 },
  3: { answerMs: [5000, 4500, 4000, 3500, 3000], displayMs: 2000 },
  4: { answerMs: [5000, 4500, 4000, 3500, 3000], displayMs: 2000 },
  5: { answerMs: [8000, 7000, 6000, 5500, 5000], displayMs: 2000 },
  6: { answerMs: [8000, 7000, 6000, 5500, 5000], displayMs: 2000 },
  7: { answerMs: [8000, 7000, 6000, 5500, 5000], displayMs: 2000 },
  8: { answerMs: [8000, 7000, 6000, 5500, 5000], displayMs: 2000 },
  9: { answerMs: [12000, 11000, 10000, 9000, 8000], displayMs: 2500 },
  10: { answerMs: [15000, 14000, 13000, 12000, 11000], displayMs: 3000 },
  11: { answerMs: [25000, 23000, 21000, 19000, 17000], displayMs: 3000 },
  12: { answerMs: [35000, 33000, 30000, 28000, 25000], displayMs: 4000 },
  13: { answerMs: [15000, 14000, 13000, 12000, 11000], displayMs: 3500 },
  14: { answerMs: [30000, 28000, 26000, 24000, 22000], displayMs: 3500 },
  15: { answerMs: [45000, 42000, 40000, 38000, 35000], displayMs: 4000 },
  16: { answerMs: [25000, 23000, 21000, 19000, 17000], displayMs: 3000 },
  17: { answerMs: [45000, 42000, 40000, 38000, 35000], displayMs: 4000 },
  18: { answerMs: [30000, 28000, 26000, 24000, 22000], displayMs: 4000 },
  19: { answerMs: [35000, 33000, 31000, 29000, 27000], displayMs: 5000 },
  20: { answerMs: [45000, 42000, 40000, 38000, 35000], displayMs: 5000 },
};

/**
 * التوقيت الافتراضي لمهارة وصعوبة.
 *
 * 🔗 SRB-MIGRATION: SRB.getDefaultTiming()
 */
export function getDefaultTiming(
  skillNum: number,
  difficulty: Difficulty,
): QuestionTiming {
  const profile = TIMING_PROFILES[skillNum] ?? TIMING_PROFILES[3];
  const answerMs = profile.answerMs[difficulty - 1];

  return {
    displayMs: profile.displayMs,
    answerMs,
    maxMs: Math.round(answerMs * 1.5),   // 🔗 SRB: قاعدة #8
  };
}

/**
 * تعديل التوقيت حسب السياق.
 *
 * 4 سياقات:
 *   - practice: +20% وقت، +30% max (أوسع)
 *   - anzan-visual: -20% وقت (أسرع)
 *   - anzan-audio: -30% عرض، -20% وقت
 *   - exam: كما هو
 *
 * 🔗 SRB-MIGRATION: SRB.adaptTiming()
 */
export function adaptTiming(
  timing: QuestionTiming,
  context: "practice" | "anzan-visual" | "anzan-audio" | "exam",
): QuestionTiming {
  switch (context) {
    case "practice":
      return {
        ...timing,
        answerMs: Math.round(timing.answerMs * 1.2),
        maxMs: Math.round(timing.maxMs * 1.3),
      };
    case "anzan-visual":
      return {
        displayMs: timing.displayMs ?? 2000,
        answerMs: Math.round(timing.answerMs * 0.8),
        maxMs: Math.round(timing.answerMs * 0.8 * 1.2),
      };
    case "anzan-audio":
      return {
        displayMs: Math.round((timing.displayMs ?? 2000) * 0.7),
        answerMs: Math.round(timing.answerMs * 0.8),
        maxMs: Math.round(timing.answerMs * 0.8 * 1.2),
      };
    case "exam":
    default:
      return timing;
  }
}

/**
 * تقليص الوقت تدريجيًا مع تتابع الإجابات الصحيحة.
 *
 * القاعدة:
 *   - كل 5 إجابات صحيحة متتالية → -5% وقت
 *   - الحد الأدنى: 50% من الوقت الأصلي
 *
 * 🔗 SRB-MIGRATION: SRB.applyAdaptiveSpeed()
 */
export function applyAdaptiveSpeed(
  timing: QuestionTiming,
  correctStreak: number,
): QuestionTiming {
  const reductionSteps = Math.floor(correctStreak / 5);
  const reductionFactor = Math.max(0.5, 1 - reductionSteps * 0.05);

  return {
    displayMs: timing.displayMs
      ? Math.round(timing.displayMs * reductionFactor)
      : undefined,
    answerMs: Math.round(timing.answerMs * reductionFactor),
    maxMs: Math.round(timing.maxMs * reductionFactor),
  };
}

// ═══════════════════════════════════════════════════════════
// 🎲 أدوات عشوائية
// ═══════════════════════════════════════════════════════════

export function createRng(seed: number): () => number {
  let value = seed >>> 0;
  return (): number => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ═══════════════════════════════════════════════════════════
// 🔢 أدوات رياضية
// ═══════════════════════════════════════════════════════════

export function getDigits(value: number): number {
  const abs = Math.abs(Math.trunc(value));
  if (abs === 0) return 1;
  return String(abs).length;
}

export function hasCarry(a: number, b: number): boolean {
  const maxDigits = Math.max(getDigits(a), getDigits(b));
  for (let p = 0; p < maxDigits; p += 1) {
    const d = Math.pow(10, p);
    if (Math.floor(a / d) % 10 + Math.floor(b / d) % 10 >= 10) return true;
  }
  return false;
}

export function hasBorrow(a: number, b: number): boolean {
  const maxDigits = Math.max(getDigits(a), getDigits(b));
  for (let p = 0; p < maxDigits; p += 1) {
    const d = Math.pow(10, p);
    if (Math.floor(a / d) % 10 < Math.floor(b / d) % 10) return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════
// 🧮 أدوات السوروبان (مكملات + تصنيف حركة)
// 🔗 SRB-MIGRATION: منطق ثابت — ينتقل كما هو
// ═══════════════════════════════════════════════════════════

/**
 * مكمل العدد 5.
 * مثال: complementTo5(3) = 2
 */
export function complementTo5(d: number): number {
  return 5 - d;
}

/**
 * مكمل العدد 10.
 * مثال: complementTo10(7) = 3
 */
export function complementTo10(d: number): number {
  return 10 - d;
}

/**
 * تصنيف حركة الجمع على السوروبان.
 *
 * 🔗 SRB-MIGRATION: SRB.classifyAdd() — منطق ثابت
 */
export function classifyAdd(current: number, delta: number): MovementType {
  const lower = current % 5;
  const hasUpper = current >= 5;

  if (delta >= 5) {
    return current + delta < 10 ? "five-friend-add" : "ten-friend-add";
  }
  if (lower + delta <= 4) return "direct";
  if (!hasUpper && current + delta < 10) return "five-friend-add";
  return "ten-friend-add";
}

/**
 * تصنيف حركة الطرح على السوروبان.
 *
 * 🔗 SRB-MIGRATION: SRB.classifySub() — منطق ثابت
 */
export function classifySub(current: number, delta: number): MovementType {
  const lower = current % 5;
  const hasUpper = current >= 5;

  if (delta < 5 && lower >= delta) return "direct";
  if (delta < 5 && hasUpper) return "five-friend-sub";
  return "ten-friend-sub";
}