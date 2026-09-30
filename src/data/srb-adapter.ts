// ═══════════════════════════════════════════════════════════════════
// 🔌 src/data/srb-adapter.ts — الواجهة الموحّدة لـ SRB
// ═══════════════════════════════════════════════════════════════════
//
// 📅 آخر تحديث: 2026-09-30 — الجلسة 11
//   - توحيد التوقيع: (level, ...) بدون section
//   - count ديناميكي عبر sessionBuilder
//   - إزالة دوال التوافق المُعقّدة
//
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 📤 إعادة تصدير الأنواع
// ═══════════════════════════════════════════════════════════

export type {
  SRBQuestion,
  SRBLevel,
  SRBSection,
  SRBModule,
  SRBPhase,
  SRBStage,
  SRBDifficulty,
  SRBOperation,
  SRBMovementType,
  SRBPlaceValue,
  SRBEvaluation,
  SRBPerformance,
  SRBIssue,
  SRBQuestionSpec,
  SRBFilter,
  SRBWeakSkillRecord,
  SRBStats,
} from "./srb/types";

export type {
  SRBGradeMode,
  GradeRecord,
  LevelProgress,
  LevelProgressMap,
  RemediationCheck,
  LevelProgressStats,
} from "./srb/progress";

export type {
  SessionSpec,
  RemediationSpec,
  SessionResult,
} from "./srb/sessionBuilder";

export type {
  RemediationPlan,
} from "./srb/remediation";

export type {
  SRBLevelDef,
  SRBSectionDef,
} from "./srb/curriculum";

export type {
  SRBModuleDef,
} from "./srb/modules";

// ═══════════════════════════════════════════════════════════
// 🏦 البنك
// ═══════════════════════════════════════════════════════════

export {
  SOROBAN_BANK,
  BANK_SIZE,
  getQuestionById,
  getQuestionsByLevel,
  getQuestionsBySection,
  getQuestionsByModule,
  getQuestionsByPhase,
  getQuestionsByStage,
  filterBank,
  sampleFromBank,
  getStats,
} from "./srb";

// ═══════════════════════════════════════════════════════════
// 📚 المنهج
// ═══════════════════════════════════════════════════════════

export {
  SRB_LEVELS,
  SRB_SECTIONS,
  getLevelDef,
  getSectionDef,
  getLevelBySection,
  getSectionsByLevel,
  getPreviousLevel,
  getNextLevel,
  getNextSection,
  getLevelsByCategory,
  isLevelWithoutCertificate,
  getSectionCountForLevel,
  TOTAL_SECTIONS,
  TOTAL_LEVELS,
} from "./srb/curriculum";

// ═══════════════════════════════════════════════════════════
// 🎯 المهارات (m)
// ═══════════════════════════════════════════════════════════

export {
  SRB_MODULES,
  getModulesBySection,
  getModuleDef,
  getModuleName,
  getModuleCount,
  getModulesByLevel,
  isValidModule,
  TOTAL_MODULES,
} from "./srb/modules";

// ═══════════════════════════════════════════════════════════
// 🎲 بناء الجلسات
// ═══════════════════════════════════════════════════════════

export {
  buildSession,
  buildRemediationSession,
  shuffleAnswerOptions,
  countAvailableQuestions,
  canBuildSession,
  countModulesInLevel,
  getAvailablePhases,
  isLevelAvailable,
} from "./srb/sessionBuilder";

// ═══════════════════════════════════════════════════════════
// 📊 التقدّم
// ═══════════════════════════════════════════════════════════

export {
  makeLevelKey,
  parseLevelKey,
  loadAllProgress,
  loadLevelProgress,
  loadGrade,
  hasPassed,
  isLevelFullyCompleted,
  getLevelAverage,
  saveLevelGrade,
  clearLevelProgress,
  clearAllProgress,
  getSkillWeakness,
  getWeakSkills,
  shouldRemediate,
  getLevelsNeedingRemediation,
  getLevelStats,
  computeLevelFinalScore,
} from "./srb/progress";

// ═══════════════════════════════════════════════════════════
// 🩺 الجلسة العلاجية
// ═══════════════════════════════════════════════════════════

export {
  buildRemediationPlan,
  getRemediationMessage,
  getRemediationButtonLabel,
  getRemediationTitle,
  getRemediationDescription,
} from "./srb/remediation";

// ═══════════════════════════════════════════════════════════
// 🛠️ دوال مساعدة للشاشات (الواجهة النظيفة)
// ═══════════════════════════════════════════════════════════

import { buildSession } from "./srb/sessionBuilder";
import { saveLevelGrade } from "./srb/progress";
import type {
  SRBLevel,
  SRBSection,
  SRBQuestion,
} from "./srb/types";
import type { SRBGradeMode } from "./srb/progress";

// ─── getPracticeQuestions ───

/**
 * أسئلة جلسة تمرّن (P) لمستوى كامل.
 *
 * ✅ التوقيع الموحّد: (level, seed?, usedIds?)
 *    - عدد الأسئلة يُحدَّد تلقائيًا: max(عدد المهارات m، 5)
 *
 * @param level - المستوى
 * @param seed - مُولّد رقم (افتراضيًا Date.now())
 * @param usedIds - معرّفات مستبعدة (لتجنّب التكرار)
 */
export function getPracticeQuestions(
  level: SRBLevel,
  seed: number = Date.now(),
  usedIds: string[] = [],
): SRBQuestion[] {
  const result = buildSession({
    level,
    phase: "P",
    seed,
  });

  if (usedIds.length === 0) return result.questions;

  const usedSet = new Set(usedIds);
  return result.questions.filter((q) => !usedSet.has(q.id));
}

// ─── getAnzanQuestions ───

/**
 * أسئلة جلسة أنزان بصري.
 *
 * ✅ التوقيع الموحّد: (level, mode?, seed?, usedIds?)
 *    - mode: "normal" | "flash" (افتراضيًا "normal")
 *
 * @param level - المستوى
 * @param mode - "normal" أو "flash"
 * @param seed - مُولّد رقم
 * @param usedIds - معرّفات مستبعدة
 */
export function getAnzanQuestions(
  level: SRBLevel,
  mode: "normal" | "flash" = "normal",
  seed: number = Date.now(),
  usedIds: string[] = [],
): SRBQuestion[] {
  const phase = mode === "flash" ? "ANZ-F" : "ANZ-V";

  const result = buildSession({
    level,
    phase,
    seed,
  });

  if (usedIds.length === 0) return result.questions;

  const usedSet = new Set(usedIds);
  return result.questions.filter((q) => !usedSet.has(q.id));
}

// ─── getAudioAnzanQuestions ───

/**
 * أسئلة جلسة أنزان سمعي.
 *
 * ✅ التوقيع الموحّد: (level, seed?, usedIds?)
 *
 * @param level - المستوى
 * @param seed - مُولّد رقم
 * @param usedIds - معرّفات مستبعدة
 */
export function getAudioAnzanQuestions(
  level: SRBLevel,
  seed: number = Date.now(),
  usedIds: string[] = [],
): SRBQuestion[] {
  const result = buildSession({
    level,
    phase: "ANZ-A",
    seed,
  });

  if (usedIds.length === 0) return result.questions;

  const usedSet = new Set(usedIds);
  return result.questions.filter((q) => !usedSet.has(q.id));
}

// ─── getTestQuestions ───

/**
 * أسئلة اختبار المستوى (X).
 *
 * @param level - المستوى
 * @param seed - مُولّد رقم
 */
export function getTestQuestions(
  level: SRBLevel,
  seed: number = Date.now(),
): SRBQuestion[] {
  const result = buildSession({
    level,
    phase: "X",
    seed,
  });

  return result.questions;
}

// ─── getPlacementTestQuestions ───

/**
 * أسئلة اختبار تحديد المستوى (PT).
 *
 * @param levels - المستويات المطلوب توليد أسئلة منها
 * @param countPerLevel - عدد الأسئلة لكل مستوى (افتراضيًا 3)
 * @param seed - مُولّد رقم
 */
export function getPlacementTestQuestions(
  levels: SRBLevel[],
  countPerLevel: number = 3,
  seed: number = Date.now(),
): SRBQuestion[] {
  const all: SRBQuestion[] = [];
  let currentSeed = seed;

  for (const level of levels) {
    const result = buildSession({
      level,
      phase: "PT",
      seed: currentSeed,
    });

    // احتفظ بأول countPerLevel أسئلة
    const picked = result.questions.slice(0, countPerLevel);
    all.push(...picked);

    // غيّر seed للمستوى التالي
    currentSeed = currentSeed + 1;
  }

  return all;
}

// ═══════════════════════════════════════════════════════════
// 🔧 دوال توافق مؤقتة (للشاشات القديمة)
// ═══════════════════════════════════════════════════════════

/**
 * @deprecated توافق مؤقت.
 * الشاشات القديمة تستدعي: saveSectionGrade(level, section, mode, grade, weakSkills)
 * section يُتجاهل — الجلسة على مستوى كامل.
 */
export function saveSectionGrade(
  level: SRBLevel,
  _section: SRBSection,
  mode: SRBGradeMode,
  grade: number,
  weakSkills: string[] = [],
): void {
  saveLevelGrade(level, mode, grade, weakSkills);
}

// ═══════════════════════════════════════════════════════════
// 🔗 إعادة تصدير للتوافق
// ═══════════════════════════════════════════════════════════

export type BankQuestion = SRBQuestion;
export type LevelId = SRBLevel;

// ═══════════════════════════════════════════════════════════
// 📋 ثوابت الامتحانات
// ═══════════════════════════════════════════════════════════

export const EXAM_MAX_ATTEMPTS = 2;
export const EXAM_COOLDOWN_MS = 48 * 60 * 60 * 1000;
export const EXAM_PASS_THRESHOLD = 80;
export const PRACTICE_PASS_THRESHOLD = 70;