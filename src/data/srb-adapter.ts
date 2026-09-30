// ═══════════════════════════════════════════════════════════════════
// 🔌 src/data/srb-adapter.ts — الواجهة الموحّدة لـ SRB
// ═══════════════════════════════════════════════════════════════════
//
// 📅 آخر تحديث: 2026-09-30 — الجلسة 10
//   - دوال توافق مؤقتة (تقبل توقيعين)
//   - دعم weakSkills + saveSectionGrade wrapper
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
// 🛠️ دوال مساعدة للشاشات (مع توافق مزدوج)
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
 * ⚠️ يقبل شكلين للتوافق:
 *   - getPracticeQuestions(level, seed?, usedIds?)
 *   - getPracticeQuestions(level, section, seed, usedIds)  ← section يُتجاهل
 */
export function getPracticeQuestions(
  level: SRBLevel,
  sectionOrSeed?: SRBSection | number,
  seedOrUsed?: number | string[],
  usedIds?: string[],
): SRBQuestion[] {
  let seed = Date.now();
  let used: string[] = [];

  if (typeof sectionOrSeed === "number") {
    seed = sectionOrSeed;
    if (Array.isArray(seedOrUsed)) used = seedOrUsed;
  } else if (typeof seedOrUsed === "number") {
    seed = seedOrUsed;
    if (Array.isArray(usedIds)) used = usedIds;
  } else if (Array.isArray(seedOrUsed)) {
    used = seedOrUsed;
  } else if (Array.isArray(usedIds)) {
    used = usedIds;
  }

  const result = buildSession({
    level,
    phase: "P",
    count: 5,
    seed,
  });

  if (used.length === 0) return result.questions;

  const usedSet = new Set(used);
  return result.questions.filter((q) => !usedSet.has(q.id));
}

// ─── getAnzanQuestions ───

/**
 * أسئلة جلسة أنزان بصري.
 *
 * ⚠️ يقبل شكلين للتوافق:
 *   - getAnzanQuestions(level, mode?, seed?, usedIds?)
 *   - getAnzanQuestions(level, section, mode, seed, usedIds)  ← section يُتجاهل
 */
export function getAnzanQuestions(
  level: SRBLevel,
  sectionOrMode?: SRBSection | "normal" | "flash",
  modeOrSeed?: "normal" | "flash" | number,
  seedOrUsed?: number | string[],
  usedIds?: string[],
): SRBQuestion[] {
  let mode: "normal" | "flash" = "normal";
  let seed = Date.now();
  let used: string[] = [];

  // تحديد mode
  if (sectionOrMode === "normal" || sectionOrMode === "flash") {
    mode = sectionOrMode;
  } else if (modeOrSeed === "normal" || modeOrSeed === "flash") {
    mode = modeOrSeed;
  }

  // تحديد seed
  if (typeof modeOrSeed === "number") {
    seed = modeOrSeed;
  } else if (typeof seedOrUsed === "number") {
    seed = seedOrUsed;
  }

  // تحديد usedIds
  if (Array.isArray(seedOrUsed)) {
    used = seedOrUsed;
  } else if (Array.isArray(usedIds)) {
    used = usedIds;
  }

  const phase = mode === "flash" ? "ANZ-F" : "ANZ-V";

  const result = buildSession({
    level,
    phase,
    count: 5,
    seed,
  });

  if (used.length === 0) return result.questions;

  const usedSet = new Set(used);
  return result.questions.filter((q) => !usedSet.has(q.id));
}

// ─── getAudioAnzanQuestions ───

/**
 * أسئلة جلسة أنزان سمعي.
 *
 * ⚠️ يقبل شكلين للتوافق:
 *   - getAudioAnzanQuestions(level, seed?, usedIds?)
 *   - getAudioAnzanQuestions(level, section, seed, usedIds)  ← section يُتجاهل
 */
export function getAudioAnzanQuestions(
  level: SRBLevel,
  sectionOrSeed?: SRBSection | number,
  seedOrUsed?: number | string[],
  usedIds?: string[],
): SRBQuestion[] {
  let seed = Date.now();
  let used: string[] = [];

  if (typeof sectionOrSeed === "number") {
    seed = sectionOrSeed;
    if (Array.isArray(seedOrUsed)) used = seedOrUsed;
  } else if (typeof seedOrUsed === "number") {
    seed = seedOrUsed;
    if (Array.isArray(usedIds)) used = usedIds;
  } else if (Array.isArray(seedOrUsed)) {
    used = seedOrUsed;
  } else if (Array.isArray(usedIds)) {
    used = usedIds;
  }

  const result = buildSession({
    level,
    phase: "ANZ-A",
    count: 5,
    seed,
  });

  if (used.length === 0) return result.questions;

  const usedSet = new Set(used);
  return result.questions.filter((q) => !usedSet.has(q.id));
}

// ─── getTestQuestions ───

/**
 * أسئلة اختبار المستوى (X).
 */
export function getTestQuestions(
  level: SRBLevel,
  count: number = 10,
  seed?: number,
): SRBQuestion[] {
  const result = buildSession({
    level,
    phase: "X",
    count,
    seed: seed ?? Date.now(),
  });

  return result.questions;
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