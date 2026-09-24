// src/curriculum/levels/index.ts

import type { LevelContent } from "./types";
import level00 from "./level-00";
import level01 from "./level-01";
import level02 from "./level-02";
import level03 from "./level-03";
import level04 from "./level-04";
import level05 from "./level-05";

/**
 * كل المستويات المتوفرة حالياً (L00-L05).
 *
 * يُضاف كل مستوى جديد هنا عند إنشائه.
 */
export const LEVELS: Record<string, LevelContent> = {
  L00: level00,
  L01: level01,
  L02: level02,
  L03: level03,
  L04: level04,
  L05: level05,
};

/**
 * الحصول على محتوى مستوى.
 */
export function getLevelContent(
  levelId: string,
): LevelContent | undefined {
  return LEVELS[levelId];
}

/**
 * التحقق من وجود محتوى مستوى.
 */
export function hasLevelContent(levelId: string): boolean {
  return levelId in LEVELS;
}

/**
 * كل المستويات كمصفوفة.
 */
export function getAllLevelContents(): LevelContent[] {
  return Object.values(LEVELS);
}

/**
 * عدد المستويات المبنية.
 */
export const TOTAL_BUILT_LEVELS = Object.keys(LEVELS).length;