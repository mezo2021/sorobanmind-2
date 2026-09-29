// ═══════════════════════════════════════════════════════════════════
// 🎲 src/data/srb/sessionBuilder.ts — مولّد الجلسات
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - بناء جلسة عادية (P · ANZ-V · ANZ-F · ANZ-A)
//   - بناء جلسة علاجية (Remediation)
//   - ضمان عدم التكرار في الجلسة الواحدة
//   - اختيار عشوائي موزون
//
// 📊 القواعد:
//   - الأسئلة من نفس الدرس S + نفس المستوى L
//   - 5 أسئلة لكل جلسة عادية
//   - 5 أسئلة للجلسة العلاجية (قابلة للتوسع)
//   - لا تكرار داخل الجلسة
//
// 🔧 التعديل (2026-09-29):
//   - إضافة فلترة level + section في getAvailableQuestions
//   - إضافة فلترة level + section + module في getAvailableByModule
//   - تمرير level في buildSession و buildRemediationSession
//
// ═══════════════════════════════════════════════════════════════════

import type {
  SRBQuestion,
  SRBLevel,
  SRBSection,
  SRBModule,
  SRBPhase,
} from "./types";

import {
  getQuestionsBySection,
  getQuestionsByModule,
} from "./index";

// ═══════════════════════════════════════════════════════════
// 📝 الأنواع
// ═══════════════════════════════════════════════════════════

/**
 * مواصفات بناء جلسة عادية.
 */
export interface SessionSpec {
  /** المستوى */
  level: SRBLevel;

  /** الدرس */
  section: SRBSection;

  /** المرحلة */
  phase: SRBPhase;

  /** عدد الأسئلة (افتراضيًا 5) */
  count?: number;

  /** مُولّد رقم (اختياري — للاختبار) */
  seed?: number;
}

/**
 * مواصفات بناء جلسة علاجية.
 */
export interface RemediationSpec {
  /** المستوى */
  level: SRBLevel;

  /** الدرس */
  section: SRBSection;

  /** المواضيع الضعيفة (m) */
  weakModules: SRBModule[];

  /** عدد الأسئلة (افتراضيًا 5) */
  count?: number;

  /** مُولّد رقم */
  seed?: number;
}

/**
 * نتيجة بناء الجلسة.
 */
export interface SessionResult {
  questions: SRBQuestion[];
  /** هل الجلسة كاملة العدد؟ */
  isComplete: boolean;
  /** العدد المطلوب */
  requestedCount: number;
  /** العدد الفعلي */
  actualCount: number;
}

// ═══════════════════════════════════════════════════════════
// 🎲 أدوات عشوائية
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

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ═══════════════════════════════════════════════════════════
// 🔍 فلترة (مع level)
// ═══════════════════════════════════════════════════════════

/**
 * الأسئلة المتاحة لدرس + مرحلة.
 *
 * ⚠️ يُصفّي حسب: level + section + phase
 */
function getAvailableQuestions(
  level: SRBLevel,
  section: SRBSection,
  phase: SRBPhase,
): SRBQuestion[] {
  const all = getQuestionsBySection(section);
  return all.filter(
    (q) => q.level === level && q.allowed_phases.includes(phase),
  );
}

/**
 * الأسئلة المتاحة لموضوع معين + مرحلة.
 *
 * ⚠️ يُصفّي حسب: level + section + module + phase
 */
function getAvailableByModule(
  level: SRBLevel,
  section: SRBSection,
  module: SRBModule,
  phase: SRBPhase,
): SRBQuestion[] {
  const all = getQuestionsByModule(section, module);
  return all.filter(
    (q) => q.level === level && q.allowed_phases.includes(phase),
  );
}

// ═══════════════════════════════════════════════════════════
// 🎯 بناء الجلسة العادية
// ═══════════════════════════════════════════════════════════

/**
 * بناء جلسة عادية (P · ANZ-V · ANZ-F · ANZ-A).
 *
 * @param spec - المواصفات
 * @returns نتيجة الجلسة
 *
 * @example
 * buildSession({
 *   level: "L0",
 *   section: "S01",
 *   phase: "P",
 *   count: 5,
 * });
 */
export function buildSession(spec: SessionSpec): SessionResult {
  const {
    level,
    section,
    phase,
    count = 5,
    seed = Date.now(),
  } = spec;

  // 1. جلب الأسئلة المتاحة (level + section + phase)
  const pool = getAvailableQuestions(level, section, phase);

  // 2. خلط
  const rng = createRng(seed);
  const shuffled = shuffle([...pool], rng);

  // 3. اختيار أول count بلا تكرار
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return {
    questions: selected,
    isComplete: selected.length >= count,
    requestedCount: count,
    actualCount: selected.length,
  };
}

// ═══════════════════════════════════════════════════════════
// 🩺 بناء الجلسة العلاجية
// ═══════════════════════════════════════════════════════════

/**
 * بناء جلسة علاجية.
 *
 * ⚠️ الفرق عن الجلسة العادية:
 *   - لا تُسجّل درجات.
 *   - تُظهر الحل بعد كل سؤال.
 *   - تُبنى من مواضيع ضعيفة (m).
 *
 * @param spec - المواصفات
 * @returns نتيجة الجلسة
 */
export function buildRemediationSession(
  spec: RemediationSpec,
): SessionResult {
  const {
    level,
    section,
    weakModules,
    count = 5,
    seed = Date.now(),
  } = spec;

  // 1. جلب أسئلة كل موضوع ضعيف
  const allWeakQuestions: SRBQuestion[] = [];

  for (const module of weakModules) {
    const moduleQs = getAvailableByModule(level, section, module, "P");
    allWeakQuestions.push(...moduleQs);
  }

  // 2. إذا لم نجد أسئلة، نعود لكل أسئلة الدرس
  let pool = allWeakQuestions;
  if (pool.length === 0) {
    pool = getAvailableQuestions(level, section, "P");
  }

  // 3. خلط
  const rng = createRng(seed);
  const shuffled = shuffle([...pool], rng);

  // 4. اختيار بلا تكرار
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return {
    questions: selected,
    isComplete: selected.length >= count,
    requestedCount: count,
    actualCount: selected.length,
  };
}

// ═══════════════════════════════════════════════════════════
// 🔀 إعادة ترتيب الخيارات (للاختبارات)
// ═══════════════════════════════════════════════════════════

/**
 * إعادة ترتيب خيارات الإجابة لسؤال.
 *
 * ⚠️ ملاحظة: هذا يحتاج دعماً من بنية السؤال.
 *    حالياً البنك يستخدم إدخال مباشر (إباكوس) — لا خيارات.
 *    عند إضافة أسئلة متعددة الخيارات، تُستخدم هذه الدالة.
 */
export function shuffleAnswerOptions(
  correctAnswer: number,
  distractors: number[],
  seed: number = Date.now(),
): {
  options: number[];
  correctIndex: number;
} {
  const rng = createRng(seed);
  const all = [correctAnswer, ...distractors];

  const shuffled = shuffle([...all], rng);
  const correctIndex = shuffled.indexOf(correctAnswer);

  return {
    options: shuffled,
    correctIndex,
  };
}

// ═══════════════════════════════════════════════════════════
// 📊 تحليلات
// ═══════════════════════════════════════════════════════════

/**
 * عدد الأسئلة المتاحة لدرس + مرحلة.
 *
 * ⚠️ يحتاج level الآن.
 */
export function countAvailableQuestions(
  level: SRBLevel,
  section: SRBSection,
  phase: SRBPhase,
): number {
  return getAvailableQuestions(level, section, phase).length;
}

/**
 * هل يمكن بناء جلسة كاملة؟
 *
 * ⚠️ يحتاج level الآن.
 */
export function canBuildSession(
  level: SRBLevel,
  section: SRBSection,
  phase: SRBPhase,
  count: number = 5,
): boolean {
  return countAvailableQuestions(level, section, phase) >= count;
}

/**
 * قائمة المراحل المتاحة لكل درس (في مستوى معين).
 *
 * ⚠️ يحتاج level الآن.
 */
export function getAvailablePhases(
  level: SRBLevel,
  section: SRBSection,
): SRBPhase[] {
  const questions = getQuestionsBySection(section).filter(
    (q) => q.level === level,
  );
  const phases = new Set<SRBPhase>();

  for (const q of questions) {
    q.allowed_phases.forEach((p) => phases.add(p));
  }

  return Array.from(phases);
}

// ═══════════════════════════════════════════════════════════
// 📤 إعادة تصدير
// ═══════════════════════════════════════════════════════════

export type {
  SRBQuestion,
  SRBLevel,
  SRBSection,
  SRBModule,
  SRBPhase,
};