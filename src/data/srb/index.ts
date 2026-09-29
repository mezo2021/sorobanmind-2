// ═══════════════════════════════════════════════════════════════════
// 🏦 src/data/srb/index.ts — الفهرس الرئيسي لبنك SRB
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يجمع كل أسئلة SRB
//   - يُصدّر SOROBAN_BANK
//   - دوال استعلام: byId, byLevel, bySection, byModule, byPhase
//   - فلترة: filter, sample
//   - إحصائيات: stats
//
// ═══════════════════════════════════════════════════════════════════

import type {
  SRBQuestion,
  SRBLevel,
  SRBSection,
  SRBModule,
  SRBPhase,
  SRBFilter,
  SRBStats,
  SRBStage,
} from "./types";

// ═══════════════════════════════════════════════════════════
// 📥 استيراد الأسئلة
// ═══════════════════════════════════════════════════════════

// L0 — S01
import { S01_M1 } from "./questions/L0/S01/m1";
import { S01_M2 } from "./questions/L0/S01/m2";
import { S01_M3 } from "./questions/L0/S01/m3";
import { S01_M4 } from "./questions/L0/S01/m4";

// L0 — S02
import { S02_M1 } from "./questions/L0/S02/m1";
import { S02_M2 } from "./questions/L0/S02/m2";
import { S02_M3 } from "./questions/L0/S02/m3";
import { S02_M4 } from "./questions/L0/S02/m4";

// ═══════════════════════════════════════════════════════════
// 🏦 البنك الرئيسي
// ═══════════════════════════════════════════════════════════

export const SOROBAN_BANK: readonly SRBQuestion[] = Object.freeze([
  ...S01_M1,
  ...S01_M2,
  ...S01_M3,
  ...S01_M4,
  ...S02_M1,
  ...S02_M2,
  ...S02_M3,
  ...S02_M4,
]);

export const BANK_SIZE = SOROBAN_BANK.length;

// ═══════════════════════════════════════════════════════════
// 🔍 دوال الاستعلام
// ═══════════════════════════════════════════════════════════

export function getQuestionById(id: string): SRBQuestion | undefined {
  return SOROBAN_BANK.find((q) => q.id === id);
}

export function getQuestionsByLevel(level: SRBLevel): SRBQuestion[] {
  return SOROBAN_BANK.filter((q) => q.level === level);
}

export function getQuestionsBySection(
  section: SRBSection,
): SRBQuestion[] {
  return SOROBAN_BANK.filter((q) => q.section === section);
}

export function getQuestionsByModule(
  section: SRBSection,
  module: SRBModule,
): SRBQuestion[] {
  return SOROBAN_BANK.filter(
    (q) => q.section === section && q.module === module,
  );
}

export function getQuestionsByPhase(phase: SRBPhase): SRBQuestion[] {
  return SOROBAN_BANK.filter((q) =>
    q.allowed_phases.includes(phase),
  );
}

export function getQuestionsByStage(stage: SRBStage): SRBQuestion[] {
  return SOROBAN_BANK.filter((q) => q.stage === stage);
}

// ═══════════════════════════════════════════════════════════
// 🔍 الفلترة
// ═══════════════════════════════════════════════════════════

export function filterBank(filter: SRBFilter): SRBQuestion[] {
  let result: SRBQuestion[] = [...SOROBAN_BANK];

  if (filter.levels?.length) {
    const set = new Set(filter.levels);
    result = result.filter((q) => set.has(q.level));
  }
  if (filter.sections?.length) {
    const set = new Set(filter.sections);
    result = result.filter((q) => set.has(q.section));
  }
  if (filter.modules?.length) {
    const set = new Set(filter.modules);
    result = result.filter((q) => set.has(q.module));
  }
  if (filter.phases?.length) {
    result = result.filter((q) =>
      filter.phases!.some((p) => q.allowed_phases.includes(p)),
    );
  }
  if (filter.difficulties?.length) {
    const set = new Set(filter.difficulties);
    result = result.filter((q) => set.has(q.difficulty));
  }
  if (filter.operations?.length) {
    const set = new Set(filter.operations);
    result = result.filter((q) => set.has(q.operation));
  }
  if (filter.movements?.length) {
    const set = new Set(filter.movements);
    result = result.filter((q) => set.has(q.movement));
  }
  if (filter.stage) {
    result = result.filter((q) => q.stage === filter.stage);
  }
  if (filter.in_curriculum !== undefined) {
    result = result.filter(
      (q) => q.in_curriculum === filter.in_curriculum,
    );
  }
  if (filter.excludeIds?.length) {
    const set = new Set(filter.excludeIds);
    result = result.filter((q) => !set.has(q.id));
  }

  return result;
}

// ═══════════════════════════════════════════════════════════
// 🎲 عشوائي
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

export function sampleFromBank(
  filter: SRBFilter,
  count: number,
  seed = Date.now(),
  usedIds: string[] = [],
): SRBQuestion[] {
  const pool = filterBank({
    ...filter,
    excludeIds: [...(filter.excludeIds ?? []), ...usedIds],
  });

  if (pool.length === 0) return [];

  const rng = createRng(seed);
  const shuffled = shuffle([...pool], rng);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ═══════════════════════════════════════════════════════════
// 📊 الإحصائيات
// ═══════════════════════════════════════════════════════════

export function getStats(): SRBStats {
  const byLevel: Record<SRBLevel, number> = {
    L0: 0, L1: 0, L2: 0, L3: 0,
    L4: 0, L5: 0, L6: 0, L7: 0,
  };

  const bySection: Partial<Record<SRBSection, number>> = {};

  const byStage: Record<SRBStage, number> = {
    basic: 0,
    advanced: 0,
  };

  for (const q of SOROBAN_BANK) {
    byLevel[q.level] += 1;
    bySection[q.section] = (bySection[q.section] ?? 0) + 1;
    byStage[q.stage] += 1;
  }

  return {
    total: SOROBAN_BANK.length,
    byLevel,
    bySection,
    byStage,
  };
}

// ═══════════════════════════════════════════════════════════
// 📤 إعادة تصدير الأنواع
// ═══════════════════════════════════════════════════════════

export type {
  SRBQuestion,
  SRBLevel,
  SRBSection,
  SRBModule,
  SRBPhase,
  SRBFilter,
  SRBStats,
  SRBStage,
  SRBEvaluation,
  SRBPerformance,
  SRBIssue,
  SRBWeakSkillRecord,
} from "./types";

export {
  generateSrbId,
  parseSrbId,
  isValidSrbId,
  getLevelNumber,
  getSectionNumber,
  getModuleNumber,
  getSkillId,
  getSectionId,
  makeQuestion,
  toArabicDigits,
  toArabicSrbId,
} from "./generateId";

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
} from "./curriculum";

export type { SRBLevelDef, SRBSectionDef } from "./curriculum";

export {
  SRB_MODULES,
  getModulesBySection,
  getModuleDef,
  getModuleName,
  getModuleCount,
  getModulesByLevel,
  isValidModule,
  TOTAL_MODULES,
} from "./modules";

export type { SRBModuleDef } from "./modules";