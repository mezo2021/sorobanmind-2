// ═══════════════════════════════════════════════════════════════════
// 📊 src/data/srb/progress.ts — طبقة تخزين تقدّم SRB (على مستوى)
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - حفظ درجات كل مستوى (5 مراحل)
//   - قراءة التقدّم لكل مستوى
//   - تحديد المهارات الضعيفة (skill IDs)
//   - قرار الجلسة العلاجية
//
// 🔑 مفتاح التخزين: srb_progress
//
// 📊 البنية الجديدة (2026-09-30):
//   {
//     "L0": {
//       practice: { grade: 85, attempts: 2, passed: true, weakSkills: ["SRB-L0-S01-m3"] },
//       anzanVisualNormal: { grade: 90, ... },
//       anzanVisualFlash: { grade: 75, ... },
//       anzanAudio: { grade: 80, ... },
//       test: { grade: null, ... }
//     },
//     "L1": { ... }
//   }
//
// ⚠️ لا يوجد section في المفاتيح — الجلسة على مستوى كامل.
//
// ═══════════════════════════════════════════════════════════════════

import type { SRBLevel } from "./types";

// ═══════════════════════════════════════════════════════════
// 🔑 مفتاح التخزين
// ═══════════════════════════════════════════════════════════

const STORAGE_KEY = "srb_progress";

// ═══════════════════════════════════════════════════════════
// 📝 الأنواع
// ═══════════════════════════════════════════════════════════

/**
 * وضع التقييم — 5 أنواع لكل مستوى.
 */
export type SRBGradeMode =
  | "practice"           // ✏️ تمرّن
  | "anzanVisualNormal"  // 🧠 أنزان بصري عادي
  | "anzanVisualFlash"   // ⚡ أنزان Flash
  | "anzanAudio"         // 🎧 أنزان سمعي
  | "test";              // 🎓 اختبار

/**
 * سجل درجة واحد.
 */
export interface GradeRecord {
  /** الدرجة (0-100) */
  grade: number;

  /** عدد المحاولات */
  attempts: number;

  /** آخر محاولة (timestamp) */
  lastAttempt: number;

  /** هل نجح؟ (≥ 70%) */
  passed: boolean;

  /**
   * المهارات الضعيفة (skill IDs).
   * صيغة: "SRB-L0-S01-m1"
   */
  weakSkills: string[];

  /** أعلى درجة سابقة */
  bestGrade?: number;
}

/**
 * تقدّم مستوى واحد.
 */
export interface LevelProgress {
  practice?: GradeRecord;
  anzanVisualNormal?: GradeRecord;
  anzanVisualFlash?: GradeRecord;
  anzanAudio?: GradeRecord;
  test?: GradeRecord;
}

/**
 * خريطة كل المستويات.
 * المفتاح: "L0", "L1", ...
 */
export type LevelProgressMap = Record<string, LevelProgress>;

// ═══════════════════════════════════════════════════════════
// 🛠️ أدوات مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * تكوين مفتاح المستوى.
 */
export function makeLevelKey(level: SRBLevel): string {
  return level;
}

/**
 * فك مفتاح المستوى.
 */
export function parseLevelKey(key: string): SRBLevel | null {
  const match = /^(L[0-7])$/.exec(key);
  if (!match) return null;
  return match[1] as SRBLevel;
}

/**
 * هل النتيجة ناجحة؟ (≥ 70%)
 */
function isPassed(grade: number): boolean {
  return grade >= 70;
}

// ═══════════════════════════════════════════════════════════
// 📥 قراءة
// ═══════════════════════════════════════════════════════════

/**
 * تحميل كل التقدّم.
 */
export function loadAllProgress(): LevelProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};

    return parsed as LevelProgressMap;
  } catch {
    return {};
  }
}

/**
 * تحميل تقدّم مستوى محدد.
 */
export function loadLevelProgress(
  level: SRBLevel,
): LevelProgress {
  const all = loadAllProgress();
  return all[makeLevelKey(level)] ?? {};
}

/**
 * تحميل درجة محددة.
 */
export function loadGrade(
  level: SRBLevel,
  mode: SRBGradeMode,
): GradeRecord | null {
  const progress = loadLevelProgress(level);
  return progress[mode] ?? null;
}

/**
 * هل نجح في وضع معين؟
 */
export function hasPassed(
  level: SRBLevel,
  mode: SRBGradeMode,
): boolean {
  const grade = loadGrade(level, mode);
  return grade?.passed ?? false;
}

/**
 * هل أكمل كل المراحل (P + ANZ-V + ANZ-F + ANZ-A)؟
 */
export function isLevelFullyCompleted(level: SRBLevel): boolean {
  const modes: SRBGradeMode[] = [
    "practice",
    "anzanVisualNormal",
    "anzanVisualFlash",
    "anzanAudio",
  ];

  return modes.every((m) => hasPassed(level, m));
}

/**
 * متوسط كل المراحل الأربع لمستوى.
 *
 * @returns المتوسط (0-100) أو null إذا لم تكتمل كل المراحل
 */
export function getLevelAverage(level: SRBLevel): number | null {
  const modes: SRBGradeMode[] = [
    "practice",
    "anzanVisualNormal",
    "anzanVisualFlash",
    "anzanAudio",
  ];

  const grades = modes.map((m) => loadGrade(level, m));

  // إذا واحدة ناقصة، نُرجع null
  if (grades.some((g) => g === null)) {
    return null;
  }

  const total = grades.reduce((sum, g) => sum + (g?.grade ?? 0), 0);
  return Math.round(total / modes.length);
}

// ═══════════════════════════════════════════════════════════
// 📤 كتابة
// ═══════════════════════════════════════════════════════════

/**
 * حفظ درجة جديدة.
 *
 * @param level - المستوى
 * @param mode - وضع التقييم
 * @param grade - الدرجة (0-100)
 * @param weakSkills - قائمة skill IDs (مثل ["SRB-L0-S01-m1"])
 */
export function saveLevelGrade(
  level: SRBLevel,
  mode: SRBGradeMode,
  grade: number,
  weakSkills: string[] = [],
): void {
  try {
    const all = loadAllProgress();
    const key = makeLevelKey(level);

    const levelProgress: LevelProgress = all[key] ?? {};
    const existing = levelProgress[mode];

    const newRecord: GradeRecord = {
      grade: Math.max(0, Math.min(100, Math.round(grade))),
      attempts: (existing?.attempts ?? 0) + 1,
      lastAttempt: Date.now(),
      passed: isPassed(grade),
      weakSkills,
      bestGrade: Math.max(
        existing?.bestGrade ?? 0,
        Math.round(grade),
      ),
    };

    levelProgress[mode] = newRecord;
    all[key] = levelProgress;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

/**
 * حذف تقدّم مستوى (لإعادة البدء).
 */
export function clearLevelProgress(level: SRBLevel): void {
  try {
    const all = loadAllProgress();
    delete all[makeLevelKey(level)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

/**
 * حذف كل التقدّم.
 */
export function clearAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════════════════
// 🩺 تحليل الضعف
// ═══════════════════════════════════════════════════════════

/**
 * هل skill معين ضعيف في مستوى؟
 *
 * @param skillId - مثل "SRB-L0-S01-m1"
 * @returns 0 (ممتاز) إلى 100 (ضعيف جدًا)
 */
export function getSkillWeakness(
  level: SRBLevel,
  skillId: string,
): number {
  const progress = loadLevelProgress(level);
  let weakness = 0;
  let count = 0;

  const modes: SRBGradeMode[] = [
    "practice",
    "anzanVisualNormal",
    "anzanVisualFlash",
    "anzanAudio",
  ];

  for (const mode of modes) {
    const record = progress[mode];
    if (!record) continue;

    count += 1;

    // إذا كان skillId ضمن weakSkills → ضعيف
    if (record.weakSkills.includes(skillId)) {
      weakness += record.grade < 50 ? 100 : 70;
    } else if (record.grade < 70) {
      weakness += 60;
    } else if (record.grade < 85) {
      weakness += 30;
    }
  }

  return count === 0 ? 0 : Math.round(weakness / count);
}

/**
 * قائمة كل المهارات الضعيفة في مستوى.
 */
export function getWeakSkills(level: SRBLevel): string[] {
  const progress = loadLevelProgress(level);
  const weakSet = new Set<string>();

  const modes: SRBGradeMode[] = [
    "practice",
    "anzanVisualNormal",
    "anzanVisualFlash",
    "anzanAudio",
  ];

  for (const mode of modes) {
    const record = progress[mode];
    if (!record) continue;
    record.weakSkills.forEach((s) => weakSet.add(s));
  }

  return Array.from(weakSet);
}

// ═══════════════════════════════════════════════════════════
// 🎯 قرار الجلسة العلاجية
// ═══════════════════════════════════════════════════════════

export interface RemediationCheck {
  /** هل يحتاج جلسة علاجية؟ */
  shouldRemediate: boolean;

  /** المهارات الضعيفة (skill IDs) */
  weakSkills: string[];

  /** الدرجة الحالية (إن وُجدت) */
  currentGrade: number | null;

  /** عدد المحاولات */
  attempts: number;

  /** سبب التوصية */
  reason: string;
}

/**
 * فحص: هل يحتاج الطالب جلسة علاجية؟
 *
 * القواعد:
 *   1. درجة أقل من 70% في أي مرحلة.
 *   2. weakSkills غير فارغة.
 *   3. 3 محاولات بدون تحسّن.
 */
export function shouldRemediate(level: SRBLevel): RemediationCheck {
  const progress = loadLevelProgress(level);

  const modes: SRBGradeMode[] = [
    "practice",
    "anzanVisualNormal",
    "anzanVisualFlash",
    "anzanAudio",
  ];

  const allWeak = new Set<string>();
  let lowestGrade: number | null = null;
  let maxAttempts = 0;

  for (const mode of modes) {
    const record = progress[mode];
    if (!record) continue;

    record.weakSkills.forEach((s) => allWeak.add(s));
    maxAttempts = Math.max(maxAttempts, record.attempts);

    if (lowestGrade === null || record.grade < lowestGrade) {
      lowestGrade = record.grade;
    }
  }

  const weakSkills = Array.from(allWeak);
  const shouldRemediate =
    (lowestGrade !== null && lowestGrade < 70) ||
    weakSkills.length > 0;

  let reason = "";
  if (weakSkills.length > 0) {
    reason = `مهارات ضعيفة: ${weakSkills.length}`;
  } else if (lowestGrade !== null && lowestGrade < 70) {
    reason = `درجة منخفضة: ${lowestGrade}%`;
  } else if (maxAttempts >= 3) {
    reason = `محاولات متعددة بدون تحسّن`;
  } else {
    reason = "لا حاجة لجلسة علاجية";
  }

  return {
    shouldRemediate,
    weakSkills,
    currentGrade: lowestGrade,
    attempts: maxAttempts,
    reason,
  };
}

/**
 * قائمة كل المستويات التي تحتاج جلسات علاجية.
 */
export function getLevelsNeedingRemediation(): SRBLevel[] {
  const all = loadAllProgress();
  const levels: SRBLevel[] = [];

  for (const [key, progress] of Object.entries(all)) {
    const parsed = parseLevelKey(key);
    if (!parsed) continue;

    const weakSet = new Set<string>();
    const modes: SRBGradeMode[] = [
      "practice",
      "anzanVisualNormal",
      "anzanVisualFlash",
      "anzanAudio",
    ];

    for (const mode of modes) {
      const record = progress[mode];
      if (!record) continue;
      record.weakSkills.forEach((s) => weakSet.add(s));
    }

    if (weakSet.size > 0) {
      levels.push(parsed);
    }
  }

  return levels;
}

// ═══════════════════════════════════════════════════════════
// 📊 إحصائيات
// ═══════════════════════════════════════════════════════════

export interface LevelProgressStats {
  level: SRBLevel;
  practice: GradeRecord | null;
  anzanVisualNormal: GradeRecord | null;
  anzanVisualFlash: GradeRecord | null;
  anzanAudio: GradeRecord | null;
  test: GradeRecord | null;
  /** متوسط المراحل الأربع (P + ANZ) */
  average: number | null;
  /** هل أكمل كل المراحل؟ */
  fullyCompleted: boolean;
  /** المهارات الضعيفة */
  weakSkills: string[];
}

/**
 * إحصائيات مستوى معين.
 */
export function getLevelStats(level: SRBLevel): LevelProgressStats {
  const progress = loadLevelProgress(level);

  const average = getLevelAverage(level);
  const fullyCompleted = isLevelFullyCompleted(level);
  const weakSkills = getWeakSkills(level);

  return {
    level,
    practice: progress.practice ?? null,
    anzanVisualNormal: progress.anzanVisualNormal ?? null,
    anzanVisualFlash: progress.anzanVisualFlash ?? null,
    anzanAudio: progress.anzanAudio ?? null,
    test: progress.test ?? null,
    average,
    fullyCompleted,
    weakSkills,
  };
}

// ═══════════════════════════════════════════════════════════
// 🎓 حساب العلامة النهائية للمستوى
// ═══════════════════════════════════════════════════════════

/**
 * حساب العلامة النهائية للمستوى.
 *
 * المعادلة:
 *   النهائية = 70% × اختبار + 30% × متوسط(تمرن + ANZ-V + ANZ-F + ANZ-A)
 *
 * @returns العلامة النهائية (0-100) أو null إذا لم تكتمل
 */
export function computeLevelFinalScore(
  level: SRBLevel,
): number | null {
  const stats = getLevelStats(level);

  if (stats.average === null) return null;

  if (stats.test === null) {
    // لا يوجد اختبار — نُرجع المتوسط فقط
    return stats.average;
  }

  // المعادلة: 70% اختبار + 30% متوسط
  return Math.round(
    0.7 * stats.test.grade + 0.3 * stats.average,
  );
}