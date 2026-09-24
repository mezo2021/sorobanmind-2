// src/data/bank-raw/index.ts
// فهرس بنك الأسئلة الخام — 200 سؤال

import type { RawQuestion } from "./types";
import { RAW_QUESTIONS_01 } from "./raw-01";
import { RAW_QUESTIONS_02 } from "./raw-02";
import { RAW_QUESTIONS_03 } from "./raw-03";
import { RAW_QUESTIONS_04 } from "./raw-04";

export type { RawQuestion } from "./types";
export { SECTIONS, type SectionId } from "./types";

/**
 * كل الأسئلة الخام (200 سؤال).
 */
export const RAW_QUESTIONS: readonly RawQuestion[] = Object.freeze([
  ...RAW_QUESTIONS_01,
  ...RAW_QUESTIONS_02,
  ...RAW_QUESTIONS_03,
  ...RAW_QUESTIONS_04,
]);

/**
 * عدد الأسئلة.
 */
export const RAW_COUNT = RAW_QUESTIONS.length;

/**
 * الحصول على سؤال بالمعرّف.
 */
export function getRawQuestion(id: number): RawQuestion | undefined {
  return RAW_QUESTIONS.find((q) => q.id === id);
}

/**
 * الحصول على أسئلة قسم معين.
 */
export function getRawQuestionsBySection(section: string): RawQuestion[] {
  return RAW_QUESTIONS.filter((q) => q.section === section);
}