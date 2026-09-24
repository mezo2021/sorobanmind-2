// src/data/modes.ts

import type { Category } from "../curriculum/types";

/**
 * وصف كل فئة (نمط) في التطبيق.
 */
export interface CategoryMode {
  /** المعرّف */
  id: Category;

  /** مفتاح الترجمة للعنوان */
  titleKey: string;

  /** مفتاح الترجمة للفئة العمرية */
  rangeKey: string;

  /** مفتاح الترجمة للوصف */
  descKey: string;

  /** الأيقونة (Lucide icon name) */
  icon: string;

  /** تدرّج الألوان (Tailwind) */
  gradient: string;

  /** اللون الأساسي */
  primaryColor: string;

  /** اللون الثانوي */
  accentColor: string;

  /** خلفية الصفحة */
  background: string;
}

/**
 * الفئات المتاحة.
 */
export const CATEGORY_MODES: Record<Category, CategoryMode> = {
  kids: {
    id: "kids",
    titleKey: "category.kids.title",
    rangeKey: "category.kids.range",
    descKey: "category.kids.desc",
    icon: "Baby",
    gradient: "from-purple-500 to-pink-600",
    primaryColor: "#a855f7",
    accentColor: "#fbbf24",
    background:
      "radial-gradient(ellipse at top, #4c1d95 0%, #1e1b4b 60%, #0f0a2e 100%)",
  },
  teens: {
    id: "teens",
    titleKey: "category.teens.title",
    rangeKey: "category.teens.range",
    descKey: "category.teens.desc",
    icon: "GraduationCap",
    gradient: "from-blue-500 to-indigo-700",
    primaryColor: "#3b82f6",
    accentColor: "#06b6d4",
    background:
      "radial-gradient(ellipse at top, #1e293b 0%, #0f172a 60%, #020617 100%)",
  },
};

/**
 * الحصول على نمط الفئة.
 */
export function getCategoryMode(category: Category): CategoryMode {
  return CATEGORY_MODES[category];
}

/**
 * كل الفئات كمصفوفة.
 */
export const ALL_CATEGORIES: CategoryMode[] = Object.values(CATEGORY_MODES);