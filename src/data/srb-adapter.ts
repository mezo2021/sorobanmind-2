// ═══════════════════════════════════════════════════════════════════
// 🔌 src/data/srb-adapter.ts — الواجهة الموحّدة لـ SRB
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - تُصدّر كل ما تحتاجه الشاشات من SRB
//   - مع Fallback لـ bank-v2 (L1-L7 لم تُبنَ في SRB بعد)
//
// 🎯 الفائدة:
//   - L0 → SRB
//   - L1-L7 → bank-v2 (مؤقتًا)
//   - عند بناء SRB لـ L1 → يتحول تلقائيًا
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
// 🔄 Fallback — البنك القديم (bank-v2)
// ═══════════════════════════════════════════════════════════

import {
  getPracticeQuestions as oldGetPracticeQuestions,
  getAnzanVisualQuestions as oldGetAnzanVisualQuestions,
  getAnzanAudioQuestions as oldGetAnzanAudioQuestions,
  type BankQuestion as BankQuestionV2,
} from "./bank-v2";

import { buildSession } from "./srb/sessionBuilder";
import type {
  SRBLevel,
  SRBSection,
  SRBModule,
  SRBQuestion,
} from "./srb/types";

// ═══════════════════════════════════════════════════════════
// 🛠️ أدوات Fallback
// ═══════════════════════════════════════════════════════════

function levelToNum(level: SRBLevel): number {
  return parseInt(level.replace("L", ""), 10);
}

function padSection(skillId: string): SRBSection {
  const match = /S(\d+)/.exec(skillId);
  const num = match ? parseInt(match[1], 10) : 1;
  return `S${String(num).padStart(2, "0")}` as SRBSection;
}

function oldToSRB(q: BankQuestionV2, level: SRBLevel): SRBQuestion {
  const section = padSection(q.skillId);
  const module = "m1" as SRBModule;
  const id = `${q.id}-as-srb`;
  const digitCount = String(Math.abs(Math.trunc(q.correctAnswer))).length;
  const levelNum = levelToNum(level);

  return {
    id,
    level,
    section,
    module,
    sequence: 1,
    variant: "B",
    primary_phase: "P",
    allowed_phases: ["P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    stage: levelNum <= 3 ? "basic" : "advanced",
    difficulty: q.difficulty,
    difficulty_score: q.difficulty,
    in_curriculum: true,
    question: q.prompt,
    operands: q.operands,
    operation: q.operation,
    result: q.correctAnswer,
    digit_count_max: digitCount,
    operand_count: q.operands.length,
    solution: q.explanation ?? "",
    movement: q.movement,
    movement_explanation: "",
    note: undefined,
    target_time_ms: [q.timing.answerMs, q.timing.maxMs],
    mastery_threshold: 0.85,
    prerequisite_id: null,
    next_if_success: null,
    next_if_fail: null,
    original_bank_id: null,
    original_bank_section: null,
    classification_note: "from-bank-v2-fallback",
    tags: q.tags ?? [],
    place_values: [],
    has_carry: false,
    has_borrow: false,
  };
}

// ═══════════════════════════════════════════════════════════
// 🛠️ دوال مساعدة للشاشات — مع Fallback
// ═══════════════════════════════════════════════════════════

export function getPracticeQuestions(
  level: SRBLevel,
  section: SRBSection,
  seed?: number,
  usedIds: string[] = [],
): SRBQuestion[] {
  // 1. SRB
  const result = buildSession({
    level,
    section,
    phase: "P",
    count: 5,
    seed: seed ?? Date.now(),
  });

  let questions = result.questions;

  if (usedIds.length > 0) {
    const usedSet = new Set(usedIds);
    questions = questions.filter((q) => !usedSet.has(q.id));
  }

  if (questions.length > 0) return questions;

  // 2. Fallback — bank-v2
  try {
    const levelNum = levelToNum(level);
    const oldQs = oldGetPracticeQuestions(levelNum, seed ?? Date.now(), usedIds);
    return oldQs.map((q) => oldToSRB(q, level));
  } catch {
    return [];
  }
}

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

  let questions = result.questions;

  if (usedIds.length > 0) {
    const usedSet = new Set(usedIds);
    questions = questions.filter((q) => !usedSet.has(q.id));
  }

  if (questions.length > 0) return questions;

  try {
    const levelNum = levelToNum(level);
    const oldQs = oldGetAnzanVisualQuestions(levelNum, seed ?? Date.now(), usedIds);
    return oldQs.map((q) => oldToSRB(q, level));
  } catch {
    return [];
  }
}

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

  let questions = result.questions;

  if (usedIds.length > 0) {
    const usedSet = new Set(usedIds);
    questions = questions.filter((q) => !usedSet.has(q.id));
  }

  if (questions.length > 0) return questions;

  try {
    const levelNum = levelToNum(level);
    const oldQs = oldGetAnzanAudioQuestions(levelNum, seed ?? Date.now(), usedIds);
    return oldQs.map((q) => oldToSRB(q, level));
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
// 🔗 Compatibility Types
// ═══════════════════════════════════════════════════════════

export type BankQuestion = SRBQuestion;
export type LevelId = SRBLevel;

// ═══════════════════════════════════════════════════════════
// 📋 ثوابت
// ═══════════════════════════════════════════════════════════

export const EXAM_MAX_ATTEMPTS = 2;
export const EXAM_COOLDOWN_MS = 48 * 60 * 60 * 1000;
export const EXAM_PASS_THRESHOLD = 80;
export const PRACTICE_PASS_THRESHOLD = 70;