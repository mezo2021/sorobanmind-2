// ═══════════════════════════════════════════════════════════════════
// 📚 src/data/srb/curriculum.ts — المنهج الكامل (15 درسًا)
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يُعرِّف 8 مستويات (L0-L7)
//   - يُعرِّف 15 درسًا (S01-S15)
//   - الربط: level → sections
//   - الفئة: kids (5-12) / teens (13+)
//
// 📅 آخر تحديث: 2026-09-30 — الجلسة 10
// ═══════════════════════════════════════════════════════════════════

import type { SRBLevel, SRBSection } from "./types";

// ═══════════════════════════════════════════════════════════
// 🎯 المستويات (8)
// ═══════════════════════════════════════════════════════════

export interface SRBLevelDef {
  id: SRBLevel;
  name: string;
  nameEn: string;
  description: string;
  category: "kids" | "teens";
  sections: SRBSection[];
  hasCertificate: boolean;
  order: number;
}

export const SRB_LEVELS: readonly SRBLevelDef[] = Object.freeze([
  {
    id: "L0",
    name: "التمهيدي",
    nameEn: "Introduction",
    description: "تمثيل الأرقام والقيمة المكانية",
    category: "kids",
    sections: ["S01", "S02"],
    hasCertificate: false,
    order: 0,
  },
  {
    id: "L1",
    name: "الجمع والطرح",
    nameEn: "Addition & Subtraction",
    description: "الجمع والطرح بأصدقاء 5 و10",
    category: "kids",
    sections: ["S03", "S04"],
    hasCertificate: true,
    order: 1,
  },
  {
    id: "L2",
    name: "سلاسل الجمع والطرح",
    nameEn: "Add & Sub Chains",
    description: "سلاسل الجمع والطرح المتعددة",
    category: "kids",
    sections: ["S05", "S06"],
    hasCertificate: true,
    order: 2,
  },
  {
    id: "L3",
    name: "الضرب",
    nameEn: "Multiplication",
    description: "الضرب المتدرج (1×2 · 2×2)",
    category: "kids",
    sections: ["S07", "S08"],
    hasCertificate: true,
    order: 3,
  },
  {
    id: "L4",
    name: "القسمة",
    nameEn: "Division",
    description: "القسمة المتدرجة (÷1 · ÷2)",
    category: "teens",
    sections: ["S09", "S10"],
    hasCertificate: true,
    order: 4,
  },
  {
    id: "L5",
    name: "ضرب وقسمة متقدم",
    nameEn: "Advanced Mul & Div",
    description: "الضرب (2×3) والقسمة المتقدمة",
    category: "teens",
    sections: ["S11", "S12"],
    hasCertificate: true,
    order: 5,
  },
  {
    id: "L6",
    name: "الكسور العشرية",
    nameEn: "Decimals",
    description: "الأعداد العشرية (جمع · طرح · ضرب · قسمة)",
    category: "teens",
    sections: ["S13", "S14"],
    hasCertificate: true,
    order: 6,
  },
  {
    id: "L7",
    name: "الجذور",
    nameEn: "Roots",
    description: "الجذور التربيعية الكاملة",
    category: "teens",
    sections: ["S15"],
    hasCertificate: true,
    order: 7,
  },
]);

// ═══════════════════════════════════════════════════════════
// 📖 الدروس (15)
// ═══════════════════════════════════════════════════════════

export interface SRBSectionDef {
  id: SRBSection;
  level: SRBLevel;
  name: string;
  nameEn: string;
  description: string;
  moduleCount: number;   // عدد المهارات الفرعية (m)
  order: number;         // الترتيب داخل المستوى
}

export const SRB_SECTIONS: readonly SRBSectionDef[] = Object.freeze([
  // ─── L0 — التمهيدي ───
  {
    id: "S01",
    level: "L0",
    name: "تمثيل الأرقام 0-9",
    nameEn: "Number Representation 0-9",
    description: "قراءة وبناء الأرقام من 0 إلى 9 على السوروبان",
    moduleCount: 3,
    order: 1,
  },
  {
    id: "S02",
    level: "L0",
    name: "القيمة المكانية",
    nameEn: "Place Value",
    description: "الآحاد والعشرات والمئات والآلاف",
    moduleCount: 2,
    order: 2,
  },

  // ─── L1 — الجمع والطرح ───
  {
    id: "S03",
    level: "L1",
    name: "الجمع",
    nameEn: "Addition",
    description: "الجمع: بسيط · أصدقاء 5 · أصدقاء 10 · مركب",
    moduleCount: 4,
    order: 1,
  },
  {
    id: "S04",
    level: "L1",
    name: "الطرح",
    nameEn: "Subtraction",
    description: "الطرح: بسيط · أصدقاء 5 · أصدقاء 10 · مركب",
    moduleCount: 4,
    order: 2,
  },

  // ─── L2 — سلاسل الجمع والطرح ───
  {
    id: "S05",
    level: "L2",
    name: "سلاسل الجمع",
    nameEn: "Addition Chains",
    description: "سلاسل الجمع المتعددة الحدود",
    moduleCount: 4,
    order: 1,
  },
  {
    id: "S06",
    level: "L2",
    name: "سلاسل الطرح",
    nameEn: "Subtraction Chains",
    description: "سلاسل الطرح المتعددة الحدود",
    moduleCount: 4,
    order: 2,
  },

  // ─── L3 — الضرب ───
  {
    id: "S07",
    level: "L3",
    name: "ضرب 1 × 2",
    nameEn: "Multiplication 1×2",
    description: "ضرب عدد منزلة واحدة × عدد منزلتين",
    moduleCount: 4,
    order: 1,
  },
  {
    id: "S08",
    level: "L3",
    name: "ضرب 2 × 2",
    nameEn: "Multiplication 2×2",
    description: "ضرب عدد منزلتين × عدد منزلتين",
    moduleCount: 4,
    order: 2,
  },

  // ─── L4 — القسمة ───
  {
    id: "S09",
    level: "L4",
    name: "القسمة ÷ 1",
    nameEn: "Division ÷1",
    description: "القسمة على رقم واحد",
    moduleCount: 4,
    order: 1,
  },
  {
    id: "S10",
    level: "L4",
    name: "القسمة ÷ 2",
    nameEn: "Division ÷2",
    description: "القسمة على رقمين",
    moduleCount: 4,
    order: 2,
  },

  // ─── L5 — ضرب وقسمة متقدم ───
  {
    id: "S11",
    level: "L5",
    name: "ضرب 2 × 3",
    nameEn: "Multiplication 2×3",
    description: "ضرب عدد منزلتين × عدد 3 منازل",
    moduleCount: 4,
    order: 1,
  },
  {
    id: "S12",
    level: "L5",
    name: "القسمة المتقدمة",
    nameEn: "Advanced Division",
    description: "القسمة على 2-3 منازل",
    moduleCount: 4,
    order: 2,
  },

  // ─── L6 — الكسور العشرية ───
  {
    id: "S13",
    level: "L6",
    name: "جمع/طرح العشري",
    nameEn: "Decimal Add/Sub",
    description: "جمع وطرح الأعداد العشرية",
    moduleCount: 3,
    order: 1,
  },
  {
    id: "S14",
    level: "L6",
    name: "ضرب/قسمة العشري",
    nameEn: "Decimal Mul/Div",
    description: "ضرب وقسمة الأعداد العشرية",
    moduleCount: 2,
    order: 2,
  },

  // ─── L7 — الجذور ───
  {
    id: "S15",
    level: "L7",
    name: "الجذور التربيعية",
    nameEn: "Square Roots",
    description: "الجذور التربيعية الكاملة",
    moduleCount: 1,
    order: 1,
  },
]);

// ═══════════════════════════════════════════════════════════
// 🛠️ دوال مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * الحصول على تعريف مستوى.
 */
export function getLevelDef(level: SRBLevel): SRBLevelDef | undefined {
  return SRB_LEVELS.find((l) => l.id === level);
}

/**
 * الحصول على تعريف درس.
 */
export function getSectionDef(
  section: SRBSection,
): SRBSectionDef | undefined {
  return SRB_SECTIONS.find((s) => s.id === section);
}

/**
 * الحصول على المستوى من الدرس.
 */
export function getLevelBySection(
  section: SRBSection,
): SRBLevel | undefined {
  return getSectionDef(section)?.level;
}

/**
 * الحصول على دروس مستوى معين.
 */
export function getSectionsByLevel(level: SRBLevel): SRBSectionDef[] {
  return SRB_SECTIONS.filter((s) => s.level === level);
}

/**
 * الحصول على المستوى السابق.
 */
export function getPreviousLevel(
  level: SRBLevel,
): SRBLevel | null {
  const current = getLevelDef(level);
  if (!current || current.order === 0) return null;

  const prev = SRB_LEVELS.find((l) => l.order === current.order - 1);
  return prev?.id ?? null;
}

/**
 * الحصول على المستوى التالي.
 */
export function getNextLevel(level: SRBLevel): SRBLevel | null {
  const current = getLevelDef(level);
  if (!current) return null;

  const next = SRB_LEVELS.find((l) => l.order === current.order + 1);
  return next?.id ?? null;
}

/**
 * الحصول على الدرس التالي.
 */
export function getNextSection(
  section: SRBSection,
): SRBSection | null {
  const current = getSectionDef(section);
  if (!current) return null;

  const sameLevel = getSectionsByLevel(current.level);
  const nextInLevel = sameLevel.find((s) => s.order === current.order + 1);
  if (nextInLevel) return nextInLevel.id;

  // آخر درس في المستوى → أول درس في المستوى التالي
  const nextLevel = getNextLevel(current.level);
  if (!nextLevel) return null;

  const nextLevelSections = getSectionsByLevel(nextLevel);
  return nextLevelSections[0]?.id ?? null;
}

/**
 * كل المستويات للمرحلة (kids / teens).
 */
export function getLevelsByCategory(
  category: "kids" | "teens",
): SRBLevelDef[] {
  return SRB_LEVELS.filter((l) => l.category === category);
}

/**
 * هل المستوى بلا شهادة؟
 */
export function isLevelWithoutCertificate(level: SRBLevel): boolean {
  const def = getLevelDef(level);
  return def ? !def.hasCertificate : false;
}

/**
 * عدد الدروس في مستوى.
 */
export function getSectionCountForLevel(level: SRBLevel): number {
  return getSectionsByLevel(level).length;
}

/**
 * إجمالي عدد الدروس.
 */
export const TOTAL_SECTIONS = SRB_SECTIONS.length;

/**
 * إجمالي عدد المستويات.
 */
export const TOTAL_LEVELS = SRB_LEVELS.length;