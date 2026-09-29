// ═══════════════════════════════════════════════════════════════════
// 🔌 src/data/srb-adapter.ts — الواجهة الموحّدة لـ SRB
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - تُصدّر كل ما تحتاجه الشاشات من SRB
//   - بنفس أسماء bank-v2 (لتسهيل التبديل)
//   - مع توقيعات جديدة تقبل level + section
//
// 🎯 الفرق عن bank-v2:
//   - bank-v2: getPracticeQuestions(levelNum)
//   - srb-adapter: getPracticeQuestions(level, section)
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
  SectionProgress,
  SectionProgressMap,
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
  getAvailablePhases,
} from "./srb/sessionBuilder";

// ═══════════════════════════════════════════════════════════
// 📊 التقدّم
// ═══════════════════════════════════════════════════════════

export {
  makeSectionKey,
  parseSectionKey,
  loadAllProgress,
  loadSectionProgress,
  loadGrade,
  hasPassed,
  isSectionFullyCompleted,
  getSectionAverage,
  saveSectionGrade,
  clearSectionProgress,
  clearAllProgress,
  getModuleWeakness,
  getWeakModules,
  shouldRemediate,
  getSectionsNeedingRemediation,
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
// 🛠️ دالة مساعدة للشاشات — تمرّن
// ═══════════════════════════════════════════════════════════

import { buildSession } from "./srb/sessionBuilder";
import type {
  SRBLevel,
  SRBSection,
  SRBQuestion,
} from "./srb/types";

/**
 * أسئلة جلسة تمرّن (P).
 *
 * @example
 * const questions = getPracticeQuestions("L0", "S01");
 */
export function getPracticeQuestions(
  level: SRBLevel,
  section: SRBSection,
  seed?: number,
  usedIds: string[] = [],
): SRBQuestion[] {
  const result = buildSession({
    level,
    section,
    phase: "P",
    count: 5,
    seed: seed ?? Date.now(),
  });

  // استبعاد الأسئلة المستخدمة
  if (usedIds.length === 0) return result.questions;

  const usedSet = new Set(usedIds);
  return result.questions.filter((q) => !usedSet.has(q.id));
}

/**
 * أسئلة جلسة أنزان بصري.
 *
 * @param mode - "normal" (عادي) أو "flash" (سريع)
 */
export function getAnzanQuestions(
  level: SRBLevel,
  section: SRBSection,
  mode: "normal" | "flash" = "normal",
  seed?: number,
  usedIds: string[] = [],
): SRBQuestion[] {
  const phase = mode === "flash" ? "ANZ-F" : "ANZ-V";

  const result = buildSession({
    level,
    section,
    phase,
    count: 5,
    seed: seed ?? Date.now(),
  });

  if (usedIds.length === 0) return result.questions;

  const usedSet = new Set(usedIds);
  return result.questions.filter((q) => !usedSet.has(q.id));
}

/**
 * أسئلة جلسة أنزان سمعي.
 */
export function getAudioAnzanQuestions(
  level: SRBLevel,
  section: SRBSection,
  seed?: number,
  usedIds: string[] = [],
): SRBQuestion[] {
  const result = buildSession({
    level,
    section,
    phase: "ANZ-A",
    count: 5,
    seed: seed ?? Date.now(),
  });

  if (usedIds.length === 0) return result.questions;

  const usedSet = new Set(usedIds);
  return result.questions.filter((q) => !usedSet.has(q.id));
}

// ═══════════════════════════════════════════════════════════
// 🔗 إعادة تصدير من types (compatibility)
// ═══════════════════════════════════════════════════════════

export type BankQuestion = SRBQuestion;
export type LevelId = SRBLevel;

// ═══════════════════════════════════════════════════════════
// 📋 ثوابت الامتحانات (من bank-v2 — مؤقتًا)
// ═══════════════════════════════════════════════════════════

export const EXAM_MAX_ATTEMPTS = 2;
export const EXAM_COOLDOWN_MS = 48 * 60 * 60 * 1000;
export const EXAM_PASS_THRESHOLD = 80;
export const PRACTICE_PASS_THRESHOLD = 70;