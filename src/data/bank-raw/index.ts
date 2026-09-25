// src/data/bank-raw/index.ts
// فهرس بنك الأسئلة الخام — 400 سؤال
// ├── 200 أصلي (raw-01 → raw-04)
// └── 200 متقدم (raw-05 → raw-07)

import type { RawQuestion } from "./types";
import { RAW_QUESTIONS_01 } from "./raw-01";
import { RAW_QUESTIONS_02 } from "./raw-02";
import { RAW_QUESTIONS_03 } from "./raw-03";
import { RAW_QUESTIONS_04 } from "./raw-04";
import { RAW_QUESTIONS_05 } from "./raw-05";
import { RAW_QUESTIONS_06 } from "./raw-06";
import { RAW_QUESTIONS_07 } from "./raw-07";

// ═══════════════════════════════════════════════════════════
// إعادة تصدير الأنواع والأدوات
// ═══════════════════════════════════════════════════════════

export type { RawQuestion, SectionId } from "./types";

export {
  SECTIONS,
  isAdvancedSection,
  parseTimeText,
  extractSolutionText,
} from "./types";

// ═══════════════════════════════════════════════════════════
// البنك الكامل — 400 سؤال
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
 */
export const RAW_COUNT = RAW_QUESTIONS.length;

/**
 * إحصاءات البنك الخام.
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
// دوال الاستعلام
// ═══════════════════════════════════════════════════════════

/**
 * الحصول على سؤال بالمعرّف.
 */
export function getRawQuestion(id: number): RawQuestion | undefined {
  return RAW_QUESTIONS.find((q) => q.id === id);
}

/**
 * الحصول على أسئلة قسم معين.
 */
export function getRawQuestionsBySection(
  section: string,
): RawQuestion[] {
  return RAW_QUESTIONS.filter((q) => q.section === section);
}

/**
 * الحصول على الأسئلة الأصلية فقط (200).
 */
export function getStandardRawQuestions(): RawQuestion[] {
  return RAW_QUESTIONS.filter(
    (q) => !q.section.startsWith("ADV_") && Number(q.section.replace("S", "")) <= 10,
  );
}

/**
 * الحصول على الأسئلة المتقدمة فقط (200).
 */
export function getAdvancedRawQuestions(): RawQuestion[] {
  const num = (s: string) => Number(s.replace("S", ""));
  return RAW_QUESTIONS.filter((q) => {
    if (q.section.startsWith("ADV_")) return true;
    return num(q.section) >= 11;
  });
}