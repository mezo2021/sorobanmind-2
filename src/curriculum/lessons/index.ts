// src/curriculum/lessons/index.ts
// الواجهة الموحّدة لدروس المنهاج

import type { LessonNode } from './types';

// ─────── الاستيرادات ───────
import { L0_INTRO } from './L0/intro';
import { L0_S1 } from './L0/S1';
import { L0_S2 } from './L0/S2';

// ═══════════════════════════════════════════════════════════
// 📚 Registry الرئيسي: مستوى → دروس
// ═══════════════════════════════════════════════════════════

export const LESSONS_BY_LEVEL: Record<string, LessonNode[]> = {
  L0: [L0_INTRO, L0_S1, L0_S2],
  // L1 - L7 ستُضاف لاحقاً
};

// ═══════════════════════════════════════════════════════════
// 📋 قائمة كل الدروس (مسطّحة)
// ═══════════════════════════════════════════════════════════

export const ALL_LESSONS: LessonNode[] = Object.values(
  LESSONS_BY_LEVEL,
).flat();

// ═══════════════════════════════════════════════════════════
// 🔍 دوال الاستعلام
// ═══════════════════════════════════════════════════════════

/** الحصول على دروس مستوى معين (مرتبة) */
export function getLessonsByLevel(levelId: string): LessonNode[] {
  const lessons = LESSONS_BY_LEVEL[levelId] ?? [];
  return [...lessons].sort((a, b) => a.order - b.order);
}

/** الحصول على درس بـ id */
export function getLessonById(id: string): LessonNode | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

/** عدد دروس مستوى */
export function getLessonCount(levelId: string): number {
  return (LESSONS_BY_LEVEL[levelId] ?? []).length;
}

/** أول درس في مستوى */
export function getFirstLesson(levelId: string): LessonNode | undefined {
  return getLessonsByLevel(levelId)[0];
}

/** الدرس التالي في نفس المستوى */
export function getNextLesson(currentId: string): LessonNode | undefined {
  const current = getLessonById(currentId);
  if (!current) return undefined;
  const levelLessons = getLessonsByLevel(current.levelId);
  const currentIndex = levelLessons.findIndex((l) => l.id === currentId);
  if (currentIndex === -1 || currentIndex >= levelLessons.length - 1) {
    return undefined;
  }
  return levelLessons[currentIndex + 1];
}

/** الدرس السابق في نفس المستوى */
export function getPreviousLesson(currentId: string): LessonNode | undefined {
  const current = getLessonById(currentId);
  if (!current) return undefined;
  const levelLessons = getLessonsByLevel(current.levelId);
  const currentIndex = levelLessons.findIndex((l) => l.id === currentId);
  if (currentIndex <= 0) return undefined;
  return levelLessons[currentIndex - 1];
}

/** الحصول على مهارة مستوى (الدروس التي لها skillId) */
export function getSkillsByLevel(levelId: string): LessonNode[] {
  return getLessonsByLevel(levelId).filter((l) => l.skillId !== null);
}

// ═══════════════════════════════════════════════════════════
// 🎯 Re-exports
// ═══════════════════════════════════════════════════════════

export type {
  LessonNode,
  LessonStep,
  LessonExample,
  TryQuestion,
  IntroPage,
  TactileActivity,
  RuleTableRow,
  BilingualText,
  FingerUsed,
  Direction,
  TargetColumn,
  RuleCategory,
  TryQuestionType,
} from './types';

export {
  getStoryAudioPath,
  hasExamples,
  hasTryQuestions,
  isPureIntro,
} from './types';

export { L0_INTRO } from './L0/intro';
export { L0_S1 } from './L0/S1';
export { L0_S2 } from './L0/S2';