// ═══════════════════════════════════════════════════════════════════
// 📊 src/data/srb/progress.ts — طبقة تخزين تقدّم SRB
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - حفظ درجات كل درس (5 مراحل)
//   - قراءة التقدّم لكل درس / مستوى
//   - تحديد المواضيع الضعيفة (m)
//   - قرار الجلسة العلاجية
//
// 🔑 مفتاح التخزين: srb_progress
// ⚠️ منفصل تمامًا عن المفاتيح القديمة — لا تعارض
//
// 📊 البنية:
//   {
//     "L0-S01": {
//       practice: { grade: 85, attempts: 2, passed: true, weakModules: ["m3"] },
//       anzanVisualNormal: { grade: 90, ... },
//       anzanVisualFlash: { grade: 75, ... },
//       anzanAudio: { grade: 80, ... },
//       test: { grade: null, ... }
//     },
//     "L0-S02": { ... }
//   }
//
// ═══════════════════════════════════════════════════════════════════

import type {
  SRBLevel,
  SRBSection,
  SRBModule,
} from "./types";

import { getModulesBySection } from "./modules";

// ═══════════════════════════════════════════════════════════
// 🔑 مفتاح التخزين
// ═══════════════════════════════════════════════════════════

const STORAGE_KEY = "srb_progress";

// ═══════════════════════════════════════════════════════════
// 📝 الأنواع
// ═══════════════════════════════════════════════════════════

/**
 * وضع التقييم — 5 أنواع لكل درس.
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

  /** المواضيع الضعيفة (m) */
  weakModules: SRBModule[];

  /** أعلى درجة سابقة */
  bestGrade?: number;
}

/**
 * تقدّم درس واحد.
 */
export interface SectionProgress {
  practice?: GradeRecord;
  anzanVisualNormal?: GradeRecord;
  anzanVisualFlash?: GradeRecord;
  anzanAudio?: GradeRecord;
  test?: GradeRecord;
}

/**
 * خريطة كل الدروس.
 * المفتاح: "L0-S01"
 */
export type SectionProgressMap = Record<string, SectionProgress>;

// ═══════════════════════════════════════════════════════════
// 🛠️ أدوات مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * تكوين مفتاح الدرس.
 */
export function makeSectionKey(
  level: SRBLevel,
  section: SRBSection,
): string {
  return `${level}-${section}`;
}

/**
 * فك مفتاح الدرس.
 */
export function parseSectionKey(
  key: string,
): { level: SRBLevel; section: SRBSection } | null {
  const match = /^(L[0-7])-(S\d{2})$/.exec(key);
  if (!match) return null;

  return {
    level: match[1] as SRBLevel,
    section: match[2] as SRBSection,
  };
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
 *
 * @returns خريطة كل الدروس مع تقدّمها
 */
export function loadAllProgress(): SectionProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};

    return parsed as SectionProgressMap;
  } catch {
    return {};
  }
}

/**
 * تحميل تقدّم درس محدد.
 */
export function loadSectionProgress(
  level: SRBLevel,
  section: SRBSection,
): SectionProgress {
  const all = loadAllProgress();
  return all[makeSectionKey(level, section)] ?? {};
}

/**
 * تحميل درجة محددة.
 */
export function loadGrade(
  level: SRBLevel,
  section: SRBSection,
  mode: SRBGradeMode,
): GradeRecord | null {
  const progress = loadSectionProgress(level, section);
  return progress[mode] ?? null;
}

/**
 * هل نجح في وضع معين؟
 */
export function hasPassed(
  level: SRBLevel,
  section: SRBSection,
  mode: SRBGradeMode,
): boolean {
  const grade = loadGrade(level, section, mode);
  return grade?.passed ?? false;
}

/**
 * هل أكمل كل المراحل؟
 */
export function isSectionFullyCompleted(
  level: SRBLevel,
  section: SRBSection,
): boolean {
  const modes: SRBGradeMode[] = [
    "practice",
    "anzanVisualNormal",
    "anzanVisualFlash",
    "anzanAudio",
  ];

  return modes.every((m) => hasPassed(level, section, m));
}

/**
 * متوسط كل المراحل الأربع لدرس.
 *
 * @returns المتوسط (0-100) أو null إذا لم تكتمل كل المراحل
 */
export function getSectionAverage(
  level: SRBLevel,
  section: SRBSection,
): number | null {
  const modes: SRBGradeMode[] = [
    "practice",
    "anzanVisualNormal",
    "anzanVisualFlash",
    "anzanAudio",
  ];

  const grades = modes.map((m) => loadGrade(level, section, m));

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
 * يُحدّث: attempts, lastAttempt, grade, passed, weakModules.
 * يحفظ bestGrade (أعلى درجة).
 */
export function saveSectionGrade(
  level: SRBLevel,
  section: SRBSection,
  mode: SRBGradeMode,
  grade: number,
  weakModules: SRBModule[] = [],
): void {
  try {
    const all = loadAllProgress();
    const key = makeSectionKey(level, section);

    const sectionProgress: SectionProgress = all[key] ?? {};
    const existing = sectionProgress[mode];

    const newRecord: GradeRecord = {
      grade: Math.max(0, Math.min(100, Math.round(grade))),
      attempts: (existing?.attempts ?? 0) + 1,
      lastAttempt: Date.now(),
      passed: isPassed(grade),
      weakModules,
      bestGrade: Math.max(
        existing?.bestGrade ?? 0,
        Math.round(grade),
      ),
    };

    sectionProgress[mode] = newRecord;
    all[key] = sectionProgress;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

/**
 * حذف تقدّم درس (لإعادة البدء).
 */
export function clearSectionProgress(
  level: SRBLevel,
  section: SRBSection,
): void {
  try {
    const all = loadAllProgress();
    delete all[makeSectionKey(level, section)];
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
 * الحصول على قوة/ضعف موضوع معين (m).
 *
 * @returns 0 (ممتاز) إلى 100 (ضعيف جدًا)
 */
export function getModuleWeakness(
  level: SRBLevel,
  section: SRBSection,
  module: SRBModule,
): number {
  const progress = loadSectionProgress(level, section);
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

    // إذا كانت m ضمن weakModules → ضعيف
    if (record.weakModules.includes(module)) {
      weakness += record.grade < 50 ? 100 : 70;
    } else if (record.grade < 70) {
      weakness += 60;
    } else if (record.grade < 85) {
      weakness += 30;
    } else {
      weakness += 0;
    }
  }

  return count === 0 ? 0 : Math.round(weakness / count);
}

/**
 * قائمة المواضيع الضعيفة في درس.
 */
export function getWeakModules(
  level: SRBLevel,
  section: SRBSection,
): SRBModule[] {
  const progress = loadSectionProgress(level, section);
  const weakSet = new Set<SRBModule>();

  const modes: SRBGradeMode[] = [
    "practice",
    "anzanVisualNormal",
    "anzanVisualFlash",
    "anzanAudio",
  ];

  for (const mode of modes) {
    const record = progress[mode];
    if (!record) continue;
    record.weakModules.forEach((m) => weakSet.add(m));
  }

  return Array.from(weakSet);
}

// ═══════════════════════════════════════════════════════════
// 🎯 قرار الجلسة العلاجية
// ═══════════════════════════════════════════════════════════

export interface RemediationCheck {
  /** هل يحتاج جلسة علاجية؟ */
  shouldRemediate: boolean;

  /** المواضيع الضعيفة */
  weakModules: SRBModule[];

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
 *   2. weakModules غير فارغة.
 *   3. 3 محاولات بدون تحسّن.
 */
export function shouldRemediate(
  level: SRBLevel,
  section: SRBSection,
): RemediationCheck {
  const progress = loadSectionProgress(level, section);

  const modes: SRBGradeMode[] = [
    "practice",
    "anzanVisualNormal",
    "anzanVisualFlash",
    "anzanAudio",
  ];

  // جمع weakModules
  const allWeak = new Set<SRBModule>();
  let lowestGrade: number | null = null;
  let maxAttempts = 0;

  for (const mode of modes) {
    const record = progress[mode];
    if (!record) continue;

    record.weakModules.forEach((m) => allWeak.add(m));
    maxAttempts = Math.max(maxAttempts, record.attempts);

    if (lowestGrade === null || record.grade < lowestGrade) {
      lowestGrade = record.grade;
    }
  }

  const weakModules = Array.from(allWeak);
  const shouldRemediate =
    (lowestGrade !== null && lowestGrade < 70) ||
    weakModules.length > 0;

  let reason = "";
  if (weakModules.length > 0) {
    reason = `مواضيع ضعيفة: ${weakModules.join(", ")}`;
  } else if (lowestGrade !== null && lowestGrade < 70) {
    reason = `درجة منخفضة: ${lowestGrade}%`;
  } else if (maxAttempts >= 3) {
    reason = `محاولات متعددة بدون تحسّن`;
  } else {
    reason = "لا حاجة لجلسة علاجية";
  }

  return {
    shouldRemediate,
    weakModules,
    currentGrade: lowestGrade,
    attempts: maxAttempts,
    reason,
  };
}

/**
 * قائمة كل الدروس التي تحتاج جلسات علاجية في مستوى معين.
 */
export function getSectionsNeedingRemediation(
  level: SRBLevel,
): SRBSection[] {
  const all = loadAllProgress();
  const sections: SRBSection[] = [];

  for (const [key, progress] of Object.entries(all)) {
    const parsed = parseSectionKey(key);
    if (!parsed || parsed.level !== level) continue;

    // جمع weakModules لكل المراحل
    const weakSet = new Set<SRBModule>();
    const modes: SRBGradeMode[] = [
      "practice",
      "anzanVisualNormal",
      "anzanVisualFlash",
      "anzanAudio",
    ];

    for (const mode of modes) {
      const record = progress[mode];
      if (!record) continue;
      record.weakModules.forEach((m) => weakSet.add(m));
    }

    if (weakSet.size > 0) {
      sections.push(parsed.section);
    }
  }

  return sections;
}

// ═══════════════════════════════════════════════════════════
// 📊 إحصائيات
// ═══════════════════════════════════════════════════════════

export interface LevelProgressStats {
  level: SRBLevel;
  sections: Array<{
    section: SRBSection;
    practice: GradeRecord | null;
    anzanVisualNormal: GradeRecord | null;
    anzanVisualFlash: GradeRecord | null;
    anzanAudio: GradeRecord | null;
    test: GradeRecord | null;
    average: number | null;
    fullyCompleted: boolean;
  }>;
  /** متوسط المستوى (0-100) */
  levelAverage: number | null;
  /** عدد الدروس المكتملة */
  completedSections: number;
  /** عدد الدروس الكلي */
  totalSections: number;
}

/**
 * إحصائيات مستوى معين.
 */
export function getLevelStats(level: SRBLevel): LevelProgressStats {
  const all = loadAllProgress();
  const sections: LevelProgressStats["sections"] = [];

  for (const [key, progress] of Object.entries(all)) {
    const parsed = parseSectionKey(key);
    if (!parsed || parsed.level !== level) continue;

    const average = getSectionAverage(parsed.level, parsed.section);
    const fullyCompleted =
      progress.practice?.passed === true &&
      progress.anzanVisualNormal?.passed === true &&
      progress.anzanVisualFlash?.passed === true &&
      progress.anzanAudio?.passed === true;

    sections.push({
      section: parsed.section,
      practice: progress.practice ?? null,
      anzanVisualNormal: progress.anzanVisualNormal ?? null,
      anzanVisualFlash: progress.anzanVisualFlash ?? null,
      anzanAudio: progress.anzanAudio ?? null,
      test: progress.test ?? null,
      average,
      fullyCompleted,
    });
  }

  // متوسط المستوى
  const averages = sections
    .map((s) => s.average)
    .filter((a): a is number => a !== null);

  const levelAverage = averages.length === 0
    ? null
    : Math.round(
        averages.reduce((sum, a) => sum + a, 0) / averages.length,
      );

  const completedSections = sections.filter((s) => s.fullyCompleted).length;

  return {
    level,
    sections,
    levelAverage,
    completedSections,
    totalSections: sections.length,
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

  if (stats.sections.length === 0) return null;

  // متوسط المراحل الأربع لكل درس
  const sectionAverages = stats.sections
    .map((s) => s.average)
    .filter((a): a is number => a !== null);

  if (sectionAverages.length === 0) return null;

  const practiceAnzanAverage = Math.round(
    sectionAverages.reduce((sum, a) => sum + a, 0) /
      sectionAverages.length,
  );

  // اختبار المستوى (إذا موجود)
  const testRecords = stats.sections
    .map((s) => s.test)
    .filter((t): t is GradeRecord => t !== null);

  if (testRecords.length === 0) {
    // لا يوجد اختبار — نُرجع المتوسط فقط
    return practiceAnzanAverage;
  }

  const testAverage = Math.round(
    testRecords.reduce((sum, t) => sum + t.grade, 0) /
      testRecords.length,
  );

  // المعادلة: 70% اختبار + 30% متوسط
  return Math.round(0.7 * testAverage + 0.3 * practiceAnzanAverage);
}