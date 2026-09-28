// ═══════════════════════════════════════════════════════════════════
// 📦 src/data/bank-raw/types.ts — أنواع بنك الأسئلة الخام
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يُعرِّف شكل السؤال الخام (RawQuestion)
//   - يُصدّر ثوابت الأقسام (SECTIONS)
//   - يوفّر 3 دوال مساعدة (isAdvancedSection, parseTimeText, extractSolutionText)
//
// ✅ حالة جيدة: لا يستورد من أي ملف (نظيف تمامًا)
//
// 📊 الأقسام المُعرَّفة:
//   - S1 → S10: الأقسام الأصلية (من كتاب تاكاشي الأساسي)
//   - S11 → S17: الأقسام المتقدمة (Part 2 + Part 3)
//   - ADV_*: أسماء بديلة (aliases)
//
// 🔗 خطة الاستبدال بـ SRB (المرحلة 5):
//
//   ⚠️ عدم التوافق مع SRB:
//      - bank-raw: S1-S17 (17 قسمًا)
//      - SRB:      S01-S20 (20 قسمًا)
//      - الفرق: 3 أقسام ناقصة + تسمية مختلفة
//
//   خريطة التحويل المقترحة (bank-raw → SRB):
//
//      | bank-raw | SRB    | الوصف                |
//      |----------|--------|----------------------|
//      | S1       | S03    | جمع/طرح مباشر        |
//      | S2       | S05    | أصدقاء 5             |
//      | S3       | S07    | أصدقاء 10            |
//      | S4       | S09    | قواعد مركبة          |
//      | S5       | S10    | الضرب                |
//      | S6       | S13    | القسمة               |
//      | S7       | S16    | السالبة              |
//      | S8       | S18    | العشرية              |
//      | S9       | S19    | الجذر التربيعي       |
//      | S10      | S20    | الجذر التكعيبي       |
//      | S11-S17  | يحتاج تدقيق | أقسام متقدمة      |
//
//   الخطوات:
//     1. عند بناء SRB، أنشئ أنواعًا موحّدة (SRBQuestion)
//     2. حدّث bank-adapter ليحوّل S1-S17 → S01-S20
//     3. بعد اختبار شامل، استبدل هذا الملف بـ srb/types.ts
//
// ⚠️ قواعد حرجة:
//   1. لا تغيّر أسماء SECTIONS (bank-adapter يعتمد عليها)
//   2. أي إضافة قسم جديد = تحديث SECTIONS + SectionId تلقائيًا
//   3. لا تحذف حقول RawQuestion (الأسئلة الفعلية تعتمد عليها)
//
// آخر تحديث: 2026-09-29
//   - إضافة توثيق شامل + خريطة SRB
//   - لا تغيير في المنطق
//
// ═══════════════════════════════════════════════════════════════════

// src/data/bank-raw/types.ts
// أنواع بنك الأسئلة الخام — النسخة النهائية
// يدعم: الأسئلة الأصلية (S1-S10) + المتقدمة (S11-S17)

// ═══════════════════════════════════════════════════════════
// 🗺️ معرّفات الأقسام
// 🔗 SRB-MIGRATION: ستُحوَّل إلى S01-S20
// ═══════════════════════════════════════════════════════════

/**
 * كل أقسام بنك الأسئلة الخام.
 *
 * ├── S1-S10: الأقسام الأصلية (200 سؤال)
 * └── S11-S17: الأقسام المتقدمة (200 سؤال)
 *
 * ملاحظة: ADV_* أسماء بديلة (aliases) للأقسام المتقدمة.
 *
 * 🔗 SRB-MIGRATION: الأسماء تبقى، لكن التحويل يتم في bank-adapter
 */
export const SECTIONS = {
  // ─── الأقسام الأصلية (من كتاب تاكاشي الأساسي) ───
  S1: "S1",   // 🔗 SRB: S03 — جمع/طرح بسيط
  S2: "S2",   // 🔗 SRB: S05 — أصدقاء العدد 5
  S3: "S3",   // 🔗 SRB: S07 — أصدقاء العدد 10
  S4: "S4",   // 🔗 SRB: S09 — قواعد مركبة (5 و 10)
  S5: "S5",   // 🔗 SRB: S10 — الضرب
  S6: "S6",   // 🔗 SRB: S13 — القسمة
  S7: "S7",   // 🔗 SRB: S16 — الأعداد السالبة
  S8: "S8",   // 🔗 SRB: S18 — الفواصل العشرية
  S9: "S9",   // 🔗 SRB: S19 — الجذور التربيعية
  S10: "S10", // 🔗 SRB: S20 — الجذور التكعيبية

  // ─── الأقسام المتقدمة (أسماء موازية) ───
  S11: "S11", // 🔗 SRB: يحتاج تدقيق — جمع/طرح مركب
  S12: "S12", // 🔗 SRB: يحتاج تدقيق — متعدد الأرقام
  S13: "S13", // 🔗 SRB: يحتاج تدقيق — ضرب متقدم
  S14: "S14", // 🔗 SRB: يحتاج تدقيق — قسمة متقدمة
  S15: "S15", // 🔗 SRB: يحتاج تدقيق — عشرية متقدمة
  S16: "S16", // 🔗 SRB: يحتاج تدقيق — سالبة متقدمة
  S17: "S17", // 🔗 SRB: يحتاج تدقيق — جذور متقدمة

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
 *
 * 🔗 SRB-MIGRATION: سيصبح "S01" | "S02" | ... | "S20"
 */
export type SectionId = (typeof SECTIONS)[keyof typeof SECTIONS];

// ═══════════════════════════════════════════════════════════
// 📝 السؤال الخام
// 🔗 SRB-MIGRATION: سيصبح SRBQuestion بنفس الشكل (تقريبًا)
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
  id: number;              // 🔗 SRB: سيُصبح srb_id نصي (SRB-L0-S01-B001)

  /** القسم */
  section: SectionId;      // 🔗 SRB: يبقى (مع التحويل)

  /**
   * الزمن المتوقع بالمللي ثانية [min, max].
   */
  targetTime: [number, number];  // 🔗 SRB: يبقى

  /** نص السؤال */
  question: string;        // 🔗 SRB: يبقى

  /** الحل النصي (للأصلية) — اختياري للمتقدمة */
  solution: string;        // 🔗 SRB: يبقى

  /** الإجابة الصحيحة (نص) */
  result: string;          // 🔗 SRB: يبقى

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
// 🛠️ أدوات مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * هل القسم من الأقسام المتقدمة؟
 *
 * المتقدم: S11 → S17
 * الأصلي: S1 → S10
 *
 * 🔗 SRB-MIGRATION: سيبقى كما هو (المفهوم ثابت)
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
 *
 * ✅ متوافق مع قاعدة SRB:
 *    target_time_ms = [min, max] حيث max = min × 1.5
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
 *
 * 🔗 SRB-MIGRATION: سيبقى (يُستخدم لتحليل الحركة)
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