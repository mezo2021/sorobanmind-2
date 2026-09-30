// ═══════════════════════════════════════════════════════════════════
// 🎲 src/data/srb/sessionBuilder.ts — مولّد الجلسات (بناء على مستوى)
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - بناء جلسة عادية (P · ANZ-V · ANZ-F · ANZ-A)
//   - بناء جلسة علاجية (Remediation)
//   - ضمان عدم التكرار في الجلسة الواحدة
//
// 📊 القواعد:
//   - الجلسة تُبنى على **مستوى كامل**
//   - سؤال واحد من كل m في المستوى
//   - إذا عدد m < 5 → نرفع إلى 5 بأسئلة عشوائية
//   - لا تكرار داخل الجلسة
//
// 📅 آخر تحديث: 2026-10-01 — SRB Migration Phase 1
//   - parseSkillId يقبل "SRB-L0-S01-m1" و "L0-S01-m1"
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
  getQuestionsByLevel,
  getQuestionsByModule,
} from "./index";

import { getSectionsByLevel, getLevelDef } from "./curriculum";
import { getModulesBySection } from "./modules";

// ═══════════════════════════════════════════════════════════
// 📝 الأنواع
// ═══════════════════════════════════════════════════════════

/**
 * مواصفات بناء جلسة عادية (على مستوى).
 */
export interface SessionSpec {
  /** المستوى */
  level: SRBLevel;

  /** المرحلة */
  phase: SRBPhase;

  /** الحد الأدنى لعدد الأسئلة (افتراضيًا 5) */
  count?: number;

  /** مُولّد رقم (اختياري — للاختبار) */
  seed?: number;
}

/**
 * مواصفات بناء جلسة علاجية (على مستوى).
 *
 * ⚠️ تستقبل skill IDs (مثل "SRB-L0-S01-m1" أو "L0-S01-m1").
 */
export interface RemediationSpec {
  /** المستوى */
  level: SRBLevel;

  /** المهارات الضعيفة (skill IDs) */
  weakSkills: string[];

  /** الحد الأدنى للعدد (افتراضيًا 5) */
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
// 🔍 فلترة
// ═══════════════════════════════════════════════════════════

/**
 * كل أسئلة المستوى في مرحلة معينة.
 */
function getAvailableQuestionsByLevel(
  level: SRBLevel,
  phase: SRBPhase,
): SRBQuestion[] {
  const all = getQuestionsByLevel(level);
  return all.filter((q) => q.allowed_phases.includes(phase));
}

/**
 * أسئلة موضوع محدد في مستوى + مرحلة.
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
// 🧩 جمع كل (section, module) في المستوى
// ═══════════════════════════════════════════════════════════

interface SectionModulePair {
  section: SRBSection;
  module: SRBModule;
}

/**
 * كل أزواج (section, module) في المستوى.
 */
function collectModulesInLevel(level: SRBLevel): SectionModulePair[] {
  const sections = getSectionsByLevel(level);
  const pairs: SectionModulePair[] = [];

  for (const s of sections) {
    const modules = getModulesBySection(s.id);
    for (const m of modules) {
      pairs.push({ section: s.id, module: m.id });
    }
  }

  return pairs;
}

// ═══════════════════════════════════════════════════════════
// 🔑 تحليل skill ID
// ═══════════════════════════════════════════════════════════

/**
 * استخراج (section, module) من skill ID.
 *
 * ✅ يقبل الشكلين:
 *   - "SRB-L0-S01-m1"
 *   - "L0-S01-m1"
 *
 * مثال: "L0-S01-m1" → { section: "S01", module: "m1" }
 */
function parseSkillId(
  skillId: string,
): { section: SRBSection; module: SRBModule } | null {
  const match = /^(?:SRB-)?(L[0-7])-(S\d{2})-(m\d{1,2})$/.exec(skillId);
  if (!match) return null;

  return {
    section: match[2] as SRBSection,
    module: match[3] as SRBModule,
  };
}

// ═══════════════════════════════════════════════════════════
// 🎯 بناء الجلسة العادية
// ═══════════════════════════════════════════════════════════

/**
 * بناء جلسة عادية على مستوى كامل.
 *
 * الآلية:
 *   1. اجمع كل (section, module) في المستوى.
 *   2. لكل m → اختر سؤالًا واحدًا عشوائيًا.
 *   3. إذا عدد الأسئلة < count → أضف أسئلة عشوائية من المستوى.
 *   4. اخلط الأسئلة النهائية.
 *
 * @example
 * buildSession({ level: "L0", phase: "P" });  // → 5 أسئلة
 * buildSession({ level: "L1", phase: "P" });  // → 8 أسئلة
 * buildSession({ level: "L7", phase: "P" });  // → 5 أسئلة (1 m + 4 عشوائية)
 */
export function buildSession(spec: SessionSpec): SessionResult {
  const {
    level,
    phase,
    count = 5,
    seed = Date.now(),
  } = spec;

  const rng = createRng(seed);

  // 1. جمع كل (section, module) في المستوى
  const pairs = collectModulesInLevel(level);

  // 2. اختيار سؤال واحد من كل m (بلا تكرار)
  const picked: SRBQuestion[] = [];
  const usedIds = new Set<string>();

  for (const { section, module } of pairs) {
    const pool = getAvailableByModule(level, section, module, phase);
    const available = pool.filter((q) => !usedIds.has(q.id));

    if (available.length === 0) continue;

    const idx = Math.floor(rng() * available.length);
    const chosen = available[idx];

    picked.push(chosen);
    usedIds.add(chosen.id);
  }

  // 3. إذا عدد الأسئلة < count → أضف عشوائيًا
  if (picked.length < count) {
    const allLevelQs = getAvailableQuestionsByLevel(level, phase)
      .filter((q) => !usedIds.has(q.id));

    const shuffled = shuffle([...allLevelQs], rng);
    const needed = count - picked.length;

    for (let i = 0; i < needed && i < shuffled.length; i += 1) {
      picked.push(shuffled[i]);
      usedIds.add(shuffled[i].id);
    }
  }

  // 4. خلط نهائي
  const finalQuestions = shuffle(picked, rng);

  return {
    questions: finalQuestions,
    isComplete: finalQuestions.length >= count,
    requestedCount: count,
    actualCount: finalQuestions.length,
  };
}

// ═══════════════════════════════════════════════════════════
// 🩺 بناء الجلسة العلاجية
// ═══════════════════════════════════════════════════════════

/**
 * بناء جلسة علاجية على مستوى كامل.
 *
 * ⚠️ الفرق:
 *   - تُبنى من skill IDs محددة (مثل "L0-S01-m1" أو "SRB-L0-S01-m1").
 *   - لا تُسجّل درجات.
 *   - تُظهر الحل بعد كل سؤال.
 *
 * @param spec - المواصفات
 * @returns نتيجة الجلسة
 */
export function buildRemediationSession(
  spec: RemediationSpec,
): SessionResult {
  const {
    level,
    weakSkills,
    count = 5,
    seed = Date.now(),
  } = spec;

  const rng = createRng(seed);

  // 1. استخراج (section, module) من skill IDs
  const parsedSkills = weakSkills
    .map(parseSkillId)
    .filter((p): p is { section: SRBSection; module: SRBModule } => p !== null);

  // 2. اجمع كل (section, module) في المستوى
  const allPairs = collectModulesInLevel(level);

  // 3. فلترة: الأزواج الضعيفة فقط
  const targetPairs = allPairs.filter((p) =>
    parsedSkills.some(
      (ps) => ps.section === p.section && ps.module === p.module,
    ),
  );

  // 4. اختيار سؤال من كل m ضعيف
  const picked: SRBQuestion[] = [];
  const usedIds = new Set<string>();

  for (const { section, module } of targetPairs) {
    const pool = getAvailableByModule(level, section, module, "P");
    const available = pool.filter((q) => !usedIds.has(q.id));

    if (available.length === 0) continue;

    const idx = Math.floor(rng() * available.length);
    const chosen = available[idx];

    picked.push(chosen);
    usedIds.add(chosen.id);
  }

  // 5. إذا قل العدد → أضف من باقي المستوى
  if (picked.length < count) {
    const allLevelQs = getAvailableQuestionsByLevel(level, "P")
      .filter((q) => !usedIds.has(q.id));

    const shuffled = shuffle([...allLevelQs], rng);
    const needed = count - picked.length;

    for (let i = 0; i < needed && i < shuffled.length; i += 1) {
      picked.push(shuffled[i]);
      usedIds.add(shuffled[i].id);
    }
  }

  // 6. خلط نهائي
  const finalQuestions = shuffle(picked, rng);

  return {
    questions: finalQuestions,
    isComplete: finalQuestions.length >= count,
    requestedCount: count,
    actualCount: finalQuestions.length,
  };
}

// ═══════════════════════════════════════════════════════════
// 🔀 إعادة ترتيب الخيارات (للاختبارات)
// ═══════════════════════════════════════════════════════════

/**
 * إعادة ترتيب خيارات الإجابة لسؤال.
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
 * عدد الأسئلة المتاحة لمستوى + مرحلة.
 */
export function countAvailableQuestions(
  level: SRBLevel,
  phase: SRBPhase,
): number {
  return getAvailableQuestionsByLevel(level, phase).length;
}

/**
 * هل يمكن بناء جلسة كاملة؟
 */
export function canBuildSession(
  level: SRBLevel,
  phase: SRBPhase,
  count: number = 5,
): boolean {
  return countAvailableQuestions(level, phase) >= count;
}

/**
 * عدد m في المستوى.
 */
export function countModulesInLevel(level: SRBLevel): number {
  return collectModulesInLevel(level).length;
}

/**
 * قائمة المراحل المتاحة لمستوى.
 */
export function getAvailablePhases(level: SRBLevel): SRBPhase[] {
  const questions = getQuestionsByLevel(level);
  const phases = new Set<SRBPhase>();

  for (const q of questions) {
    q.allowed_phases.forEach((p) => phases.add(p));
  }

  return Array.from(phases);
}

/**
 * هل المستوى موجود في SRB؟
 */
export function isLevelAvailable(level: SRBLevel): boolean {
  const def = getLevelDef(level);
  if (!def) return false;

  const questions = getQuestionsByLevel(level);
  return questions.length > 0;
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