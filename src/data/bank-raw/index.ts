// ═══════════════════════════════════════════════════════════════════
// 📚 src/data/bank-raw/index.ts — فهرس بنك الأسئلة الخام
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يجمع 400 سؤال خام من 7 ملفات (raw-01 → raw-07)
//   - يُعيد تصدير الأنواع والأدوات من ./types
//   - يوفّر دوال استعلام (byId · bySection · standard · advanced)
//
// ✅ حالة جيدة: يستخدم ترقيم S1-S17 — يحتاج تحويل إلى S01-S20
//
// 📥 الاعتماديات:
//   - ./types (RawQuestion, SectionId, SECTIONS, ...)
//   - ./raw-01 → ./raw-07 (RAW_QUESTIONS_XX)
//
// 📤 الصادرات:
//   - RAW_QUESTIONS · RAW_COUNT · RAW_STATS
//   - getRawQuestion() · getRawQuestionsBySection()
//   - getStandardRawQuestions() · getAdvancedRawQuestions()
//   - إعادة تصدير: RawQuestion · SectionId · SECTIONS · 3 دوال
//
// 📊 التوزيع الحالي (400 سؤال):
//
//   | الملف   | النطاق    | الأقسام        | العدد |
//   |---------|-----------|----------------|-------|
//   | raw-01  | 1-60      | S1-S3          | 60    |
//   | raw-02  | 61-100    | S4-S5          | 40    |
//   | raw-03  | 101-140   | S6-S7          | 40    |
//   | raw-04  | 141-200   | S8-S10         | 60    |
//   | raw-05  | 201-280   | S11-S12        | 80    |
//   | raw-06  | 281-360   | S13-S14        | 80    |
//   | raw-07  | 361-400   | S15-S17        | 40    |
//   |─────────────────────────────────────────────|
//   | المجموع | 400 سؤال  | S1-S17         | 400   |
//
// 🔗 خطة الاستبدال بـ SRB (المرحلة 5):
//
//   الخطوة 1: SRB.getAll() يحل محل RAW_QUESTIONS
//   الخطوة 2: SRB.getBySection() يحل محل getRawQuestionsBySection()
//   الخطوة 3: التحويل S1-S17 → S01-S20 يتم في srb-adapter.ts
//   الخطوة 4: اختبار شامل + حذف bank-raw/
//
// ⚠️ قواعد حرجة:
//   1. لا تغيّر ترتيب RAW_QUESTIONS (المعرفات تعتمد عليه)
//   2. لا تحذف RAW_STATS (يُستخدم في التقارير)
//   3. أي إضافة ملف raw-XX = تحديث هذا الملف
//
// آخر تحديث: 2026-09-29
//   - إضافة توثيق شامل + علامات SRB
//   - لا تغيير في المنطق
//
// ═══════════════════════════════════════════════════════════════════

// src/data/bank-raw/index.ts
// فهرس بنك الأسئلة الخام — 400 سؤال
// ├── 200 أصلي (raw-01 → raw-04)
// └── 200 متقدم (raw-05 → raw-07)

import type { RawQuestion } from "./types";

// 🔗 SRB-MIGRATION: ستُستبدل بـ SRB.rawQuestions أو SRB.getAll()
import { RAW_QUESTIONS_01 } from "./raw-01";  // 60 سؤال
import { RAW_QUESTIONS_02 } from "./raw-02";  // 40 سؤال
import { RAW_QUESTIONS_03 } from "./raw-03";  // 40 سؤال
import { RAW_QUESTIONS_04 } from "./raw-04";  // 60 سؤال
import { RAW_QUESTIONS_05 } from "./raw-05";  // 80 سؤال
import { RAW_QUESTIONS_06 } from "./raw-06";  // 80 سؤال
import { RAW_QUESTIONS_07 } from "./raw-07";  // 40 سؤال

// ═══════════════════════════════════════════════════════════
// 🔄 إعادة تصدير الأنواع والأدوات
// ═══════════════════════════════════════════════════════════

export type { RawQuestion, SectionId } from "./types";

export {
  SECTIONS,              // 🔗 SRB: SRB.sections
  isAdvancedSection,     // 🔗 SRB: SRB.isAdvanced()
  parseTimeText,         // 🔗 SRB: SRB.parseTime()
  extractSolutionText,   // 🔗 SRB: SRB.extractSolution()
} from "./types";

// ═══════════════════════════════════════════════════════════
// 🏦 البنك الكامل — 400 سؤال
// 🔗 SRB-MIGRATION: سيُستبدل بـ SRB.getAll()
// ═══════════════════════════════════════════════════════════

/**
 * كل الأسئلة الخام (400 سؤال).
 *
 * التوزيع:
 * - raw-01: 1-60    (S1-S3 أصلي)
 * - raw-02: 61-100  (S4-S5 أصلي)
 * - raw-03: 101-140 (S6-S7 أصلي)
 * - raw-04: 141-200 (S8-S10 أصلي)
 * - raw-05: 201-280 (S11-S12 متقدم)
 * - raw-06: 281-360 (S13-S14 متقدم)
 * - raw-07: 361-400 (S15-S17 متقدم)
 *
 * 🔗 SRB-MIGRATION: SRB.getAll()
 */
export const RAW_QUESTIONS: readonly RawQuestion[] = Object.freeze([
  ...RAW_QUESTIONS_01, // 60
  ...RAW_QUESTIONS_02, // 40
  ...RAW_QUESTIONS_03, // 40
  ...RAW_QUESTIONS_04, // 60
  ...RAW_QUESTIONS_05, // 80
  ...RAW_QUESTIONS_06, // 80
  ...RAW_QUESTIONS_07, // 40
]);

/**
 * عدد الأسئلة الكلي.
 *
 * 🔗 SRB-MIGRATION: SRB.size()
 */
export const RAW_COUNT = RAW_QUESTIONS.length;

/**
 * إحصاءات البنك الخام.
 *
 * 🔗 SRB-MIGRATION: SRB.stats()
 */
export const RAW_STATS = {
  raw01: RAW_QUESTIONS_01.length,
  raw02: RAW_QUESTIONS_02.length,
  raw03: RAW_QUESTIONS_03.length,
  raw04: RAW_QUESTIONS_04.length,
  raw05: RAW_QUESTIONS_05.length,
  raw06: RAW_QUESTIONS_06.length,
  raw07: RAW_QUESTIONS_07.length,
  total: RAW_QUESTIONS.length,
} as const;

// ═══════════════════════════════════════════════════════════
// 🔍 دوال الاستعلام
// 🔗 SRB-MIGRATION: SRB.get*()
// ═══════════════════════════════════════════════════════════

/**
 * الحصول على سؤال بالمعرّف.
 *
 * 🔗 SRB-MIGRATION: SRB.getById(id)
 */
export function getRawQuestion(id: number): RawQuestion | undefined {
  return RAW_QUESTIONS.find((q) => q.id === id);
}

/**
 * الحصول على أسئلة قسم معين.
 *
 * 🔗 SRB-MIGRATION: SRB.getBySection(section)
 */
export function getRawQuestionsBySection(
  section: string,
): RawQuestion[] {
  return RAW_QUESTIONS.filter((q) => q.section === section);
}

/**
 * الحصول على الأسئلة الأصلية فقط (200).
 *
 * 🔗 SRB-MIGRATION: SRB.getStandard()
 */
export function getStandardRawQuestions(): RawQuestion[] {
  return RAW_QUESTIONS.filter(
    (q) => !q.section.startsWith("ADV_") && Number(q.section.replace("S", "")) <= 10,
  );
}

/**
 * الحصول على الأسئلة المتقدمة فقط (200).
 *
 * 🔗 SRB-MIGRATION: SRB.getAdvanced()
 */
export function getAdvancedRawQuestions(): RawQuestion[] {
  const num = (s: string) => Number(s.replace("S", ""));
  return RAW_QUESTIONS.filter((q) => {
    if (q.section.startsWith("ADV_")) return true;
    return num(q.section) >= 11;
  });
}