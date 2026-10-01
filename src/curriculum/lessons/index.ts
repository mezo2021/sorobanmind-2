// src/curriculum/lessons/index.ts
// الواجهة الموحّدة لدروس المنهاج

import type { LessonNode } from "./types";

// ─────── L0 ───────
import { L0_INTRO } from "./L0/intro";
import { L0_S01 } from "./L0/S01";
import { L0_S02 } from "./L0/S02";

// ─────── L1 ───────
import { S03_LESSON } from "./L1/S03";
import { S04_LESSON } from "./L1/S04";

// ═══════════════════════════════════════════════════════════
// 📚 Registry
// ═══════════════════════════════════════════════════════════

export const LESSONS_BY_LEVEL: Record<string, LessonNode[]> = {
  L0: [L0_INTRO, L0_S01, L0_S02],
  L1: [S03_LESSON, S04_LESSON],
};

export const ALL_LESSONS: LessonNode[] = Object.values(LESSONS_BY_LEVEL).flat();

// ═══════════════════════════════════════════════════════════
// 🔍 دوال الاستعلام (كما كانت + جديدة)
// ═══════════════════════════════════════════════════════════

export function getLessonsByLevel(levelId: string): LessonNode[] {
  const lessons = LESSONS_BY_LEVEL[levelId] ?? [];
  return [...lessons].sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): LessonNode | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getLessonCount(levelId: string): number {
  return (LESSONS_BY_LEVEL[levelId] ?? []).length;
}

export function getFirstLesson(levelId: string): LessonNode | undefined {
  return getLessonsByLevel(levelId)[0];
}

export function getNextLesson(currentId: string): LessonNode | undefined {
  const current = getLessonById(currentId);
  if (!current) return undefined;
  const levelLessons = getLessonsByLevel(current.levelId);
  const idx = levelLessons.findIndex((l) => l.id === currentId);
  if (idx === -1 || idx >= levelLessons.length - 1) return undefined;
  return levelLessons[idx + 1];
}

export function getPreviousLesson(currentId: string): LessonNode | undefined {
  const current = getLessonById(currentId);
  if (!current) return undefined;
  const levelLessons = getLessonsByLevel(current.levelId);
  const idx = levelLessons.findIndex((l) => l.id === currentId);
  if (idx <= 0) return undefined;
  return levelLessons[idx - 1];
}

export function getSkillsByLevel(levelId: string): LessonNode[] {
  return getLessonsByLevel(levelId).filter((l) => l.skillId !== null);
}

// ═══════════════════════════════════════════════════════════
// 🎯 Re-exports
// ═══════════════════════════════════════════════════════════

export * from "./types";

export { L0_INTRO } from "./L0/intro";
export { L0_S01 } from "./L0/S01";
export { L0_S02 } from "./L0/S02";
export { S03_LESSON } from "./L1/S03";
export { S04_LESSON } from "./L1/S04";