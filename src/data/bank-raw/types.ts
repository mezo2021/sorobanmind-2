// src/data/bank-raw/types.ts
// أنواع بنك الأسئلة الخام — النسخة النهائية
// يدعم: الأسئلة الأصلية (S1-S10) + المتقدمة (S11-S17)

// ═══════════════════════════════════════════════════════════
// معرّفات الأقسام
// ═══════════════════════════════════════════════════════════

/**
 * كل أقسام بنك الأسئلة الخام.
 *
 * ├── S1-S10: الأقسام الأصلية (200 سؤال)
 * └── S11-S17: الأقسام المتقدمة (200 سؤال)
 *
 * ملاحظة: ADV_* أسماء بديلة (aliases) للأقسام المتقدمة.
 */
export const SECTIONS = {
  // ─── الأقسام الأصلية (من كتاب تاكاشي الأساسي) ───
  S1: "S1",   // جمع/طرح بسيط
  S2: "S2",   // أصدقاء العدد 5
  S3: "S3",   // أصدقاء العدد 10
  S4: "S4",   // قواعد مركبة (5 و 10)
  S5: "S5",   // الضرب
  S6: "S6",   // القسمة
  S7: "S7",   // الأعداد السالبة
  S8: "S8",   // الفواصل العشرية
  S9: "S9",   // الجذور التربيعية
  S10: "S10", // الجذور التكعيبية

  // ─── الأقسام المتقدمة (أسماء موازية) ───
  S11: "S11", // جمع/طرح مركب (Part 1)
  S12: "S12", // متعدد الأرقام والأسطر (Part 1)
  S13: "S13", // ضرب متقدم (Part 2)
  S14: "S14", // قسمة متقدمة (Part 2)
  S15: "S15", // عشرية متقدمة (Part 3)
  S16: "S16", // سالبة متقدمة (Part 3)
  S17: "S17", // جذور متقدمة (Part 3)

  // ─── أسماء بديلة (aliases) ───
  ADV_MIXED: "S11",
  ADV_MULTI: "S12",
  ADV_MUL: "S13",
  ADV_DIV: "S14",
  ADV_DEC: "S15",
  ADV_NEG: "S16",
  ADV_ROOT: "S17",
} as const;

/**
 * نوع معرّف القسم.
 * القيم: "S1" | "S2" | ... | "S17"
 */
export type SectionId = (typeof SECTIONS)[keyof typeof SECTIONS];

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
 *
 * 2. الأسئلة المتقدمة (S11-S17):
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

  /** ملاحظة إضافية */
  note?: string;

  /** خطوات الحل المفصّلة */
  solutionSteps?: string[];

  /** الزمن بصيغة نص (مثل "25 ثانية") */
  timeText?: string;
}

// ═══════════════════════════════════════════════════════════
// أدوات مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * هل القسم من الأقسام المتقدمة؟
 *
 * المتقدم: S11 → S17
 * الأصلي: S1 → S10
 */
export function isAdvancedSection(section: SectionId): boolean {
  const match = /^S(\d+)$/.exec(section);
  if (!match) return false;
  return Number(match[1]) >= 11;
}

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

  const match = timeText.match(/(\d+(?:\.\d+)?)/);
  if (!match) return fallback;

  const seconds = parseFloat(match[1]);
  if (!Number.isFinite(seconds) || seconds <= 0) return fallback;

  const minMs = Math.round(seconds * 1000);
  const maxMs = Math.round(minMs * 1.5);

  return [minMs, maxMs];
}

/**
 * استخراج نص الحل من أي حقل متاح.
 *
 * الأولوية:
 * 1. solution (كامل)
 * 2. solutionSteps (مجموعة)
 * 3. note (ملاحظة قصيرة)
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