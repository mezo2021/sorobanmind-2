// src/data/bank-raw/types.ts
// أنواع بنك الأسئلة الخام — النسخة الموسّعة
// يدعم: الأسئلة الأصلية (200) + الأسئلة المتقدمة (200)

// ═══════════════════════════════════════════════════════════
// معرّفات الأقسام
// ═══════════════════════════════════════════════════════════

/**
 * كل أقسام بنك الأسئلة الخام.
 *
 * ├── الأقسام الأصلية (S1-S10): 200 سؤال
 * └── الأقسام المتقدمة (ADV_*): 200 سؤال
 */
export const SECTIONS = {
  // ─── الأقسام الأصلية (من كتاب تاكاشي الأساسي) ───
  S1: "S1", // جمع/طرح بسيط
  S2: "S2", // أصدقاء العدد 5
  S3: "S3", // أصدقاء العدد 10
  S4: "S4", // قواعد مركبة (5 و 10)
  S5: "S5", // الضرب
  S6: "S6", // القسمة
  S7: "S7", // الأعداد السالبة
  S8: "S8", // الفواصل العشرية
  S9: "S9", // الجذور التربيعية
  S10: "S10", // الجذور التكعيبية

  // ─── الأقسام المتقدمة (من ملفات التمارين المتقدمة) ───
  /** Part 1 — جمع/طرح مركب (1-40) */
  ADV_MIXED: "ADV_MIXED",
  /** Part 1 — متعدد الخانات والأسطر (41-80) */
  ADV_MULTI: "ADV_MULTI",
  /** Part 2 — ضرب متقدم (81-120) */
  ADV_MUL: "ADV_MUL",
  /** Part 2 — قسمة متقدمة (121-160) */
  ADV_DIV: "ADV_DIV",
  /** Part 3 — عشرية (161-175) */
  ADV_DEC: "ADV_DEC",
  /** Part 3 — سالبة (176-185) */
  ADV_NEG: "ADV_NEG",
  /** Part 3 — جذر تربيعي (186-200) */
  ADV_ROOT: "ADV_ROOT",
} as const;

/**
 * نوع معرّف القسم.
 */
export type SectionId = (typeof SECTIONS)[keyof typeof SECTIONS];

/**
 * هل القسم من الأقسام المتقدمة؟
 */
export function isAdvancedSection(section: SectionId): boolean {
  return section.startsWith("ADV_");
}

// ═══════════════════════════════════════════════════════════
// السؤال الخام
// ═══════════════════════════════════════════════════════════

/**
 * سؤال خام في بنك الأسئلة.
 *
 * يدعم بنيتين:
 * 1. الأسئلة الأصلية (S1-S10):
 *    - `solution`: الحل النصي
 *    - `targetTime`: [min, max] بالمللي ثانية
 *    - `timeText`: غير مستخدم
 *
 * 2. الأسئلة المتقدمة (ADV_*):
 *    - `note` أو `solutionSteps`: تفاصيل الحل
 *    - `timeText`: "25 ثانية"
 *    - `targetTime`: مصفوفة محسوبة من timeText
 */
export interface RawQuestion {
  /** معرّف فريد (1-400) */
  id: number;

  /** القسم */
  section: SectionId;

  /**
   * الزمن المتوقع بالمللي ثانية [min, max].
   * للأصلية: يُحدَّد يدوياً.
   * للمتقدمة: يُحسب من `timeText` عند التحويل.
   */
  targetTime: [number, number];

  /** نص السؤال */
  question: string;

  /** الحل النصي (للأصلية) — اختياري للمتقدمة */
  solution: string;

  /** الإجابة الصحيحة (نص) */
  result: string;

  // ─────────────────────────────────────────────────────
  // حقول اختيارية للأسئلة المتقدمة
  // ─────────────────────────────────────────────────────

  /** ملاحظة إضافية (للأسئلة المتقدمة) */
  note?: string;

  /** خطوات الحل المفصّلة (للأسئلة المتقدمة Part 1) */
  solutionSteps?: string[];

  /** الزمن بصيغة نص (مثل "25 ثانية") — للأسئلة المتقدمة */
  timeText?: string;
}

// ═══════════════════════════════════════════════════════════
// أدوات مساعدة للتحويل
// ═══════════════════════════════════════════════════════════

/**
 * تحويل نص الزمن ("25 ثانية") إلى مصفوفة [min, max].
 *
 * القاعدة:
 * - min = الزمن المعلن
 * - max = min × 1.5 (هامش 50%)
 */
export function parseTimeText(
  timeText: string | undefined,
  fallback: [number, number] = [30000, 45000],
): [number, number] {
  if (!timeText) return fallback;

  // استخراج الرقم من نص عربي مثل "25 ثانية"
  const match = timeText.match(/(\d+(?:\.\d+)?)/);
  if (!match) return fallback;

  const seconds = parseFloat(match[1]);
  if (!Number.isFinite(seconds) || seconds <= 0) return fallback;

  const minMs = Math.round(seconds * 1000);
  const maxMs = Math.round(minMs * 1.5);

  return [minMs, maxMs];
}

/**
 * استخراج الخطوات من `solutionSteps` أو `note`.
 */
export function extractSolutionText(question: RawQuestion): string {
  if (question.solution && question.solution.trim().length > 0) {
    return question.solution;
  }
  if (question.solutionSteps && question.solutionSteps.length > 0) {
    return question.solutionSteps.join(" ");
  }
  if (question.note && question.note.trim().length > 0) {
    return question.note;
  }
  return "";
}