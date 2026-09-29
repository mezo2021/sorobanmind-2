// ═══════════════════════════════════════════════════════════════════
// 📚 src/data/srb/curriculum.ts — المنهج الكامل
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يُعرِّف 8 مستويات (L0-L7)
//   - يُعرِّف 20 درسًا (S01-S20)
//   - الربط: level → sections
//   - الفئة: kids (5-12) / teens (13+)
//
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
  hasCertificate: boolean;   // L0 فقط = false
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
    description: "الجمع والطرح المباشر + أصدقاء 5 و 10",
    category: "kids",
    sections: ["S03", "S04", "S05", "S06", "S07", "S08", "S09"],
    hasCertificate: true,
    order: 1,
  },
  {
    id: "L2",
    name: "الضرب",
    nameEn: "Multiplication",
    description: "الضرب المتدرج (2×1 · 2×2 · متقدم)",
    category: "kids",
    sections: ["S10", "S11", "S12"],
    hasCertificate: true,
    order: 2,
  },
  {
    id: "L3",
    name: "القسمة",
    nameEn: "Division",
    description: "القسمة المتدرجة (÷1 · ÷2 · ÷3)",
    category: "kids",
    sections: ["S13", "S14", "S15"],
    hasCertificate: true,
    order: 3,
  },
  {
    id: "L4",
    name: "جمع وطرح متقدم",
    nameEn: "Advanced Add & Sub",
    description: "السلاسل المركّبة والأعداد الكبيرة",
    category: "teens",
    sections: ["S16"],
    hasCertificate: true,
    order: 4,
  },
  {
    id: "L5",
    name: "ضرب وقسمة متقدم",
    nameEn: "Advanced Mul & Div",
    description: "الضرب والقسمة المتقدمة",
    category: "teens",
    sections: ["S17"],
    hasCertificate: true,
    order: 5,
  },
  {
    id: "L6",
    name: "الكسور العشرية",
    nameEn: "Decimals",
    description: "جمع وطرح وضرب الأعداد العشرية",
    category: "teens",
    sections: ["S18"],
    hasCertificate: true,
    order: 6,
  },
  {
    id: "L7",
    name: "الجذور",
    nameEn: "Roots",
    description: "الجذور التربيعية والتكعيبية",
    category: "teens",
    sections: ["S19", "S20"],
    hasCertificate: true,
    order: 7,
  },
]);

// ═══════════════════════════════════════════════════════════
// 📖 الدروس (20)
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
    moduleCount: 4,
    order: 1,
  },
  {
    id: "S02",
    level: "L0",
    name: "القيمة المكانية",
    nameEn: "Place Value",
    description: "الآحاد والعشرات والمئات والآلاف",
    moduleCount: 4,
    order: 2,
  },

  // ─── L1 — الجمع والطرح ───
  {
    id: "S03",
    level: "L1",
    name: "الجمع المباشر",
    nameEn: "Direct Addition",
    description: "الجمع بدون حمل",
    moduleCount: 2,
    order: 1,
  },
  {
    id: "S04",
    level: "L1",
    name: "الطرح المباشر",
    nameEn: "Direct Subtraction",
    description: "الطرح بدون استلاف",
    moduleCount: 2,
    order: 2,
  },
  {
    id: "S05",
    level: "L1",
    name: "أصدقاء 5 — جمع",
    nameEn: "Five Friends — Add",
    description: "استخدام مكمّلات الخمسة في الجمع",
    moduleCount: 1,
    order: 3,
  },
  {
    id: "S06",
    level: "L1",
    name: "أصدقاء 5 — طرح",
    nameEn: "Five Friends — Sub",
    description: "استخدام مكمّلات الخمسة في الطرح",
    moduleCount: 1,
    order: 4,
  },
  {
    id: "S07",
    level: "L1",
    name: "أصدقاء 10 — جمع",
    nameEn: "Ten Friends — Add",
    description: "استخدام مكمّلات العشرة في الجمع",
    moduleCount: 1,
    order: 5,
  },
  {
    id: "S08",
    level: "L1",
    name: "أصدقاء 10 — طرح",
    nameEn: "Ten Friends — Sub",
    description: "استخدام مكمّلات العشرة في الطرح",
    moduleCount: 1,
    order: 6,
  },
  {
    id: "S09",
    level: "L1",
    name: "جمع/طرح مختلط",
    nameEn: "Mixed Add/Sub",
    description: "سلاسل مختلطة من الجمع والطرح",
    moduleCount: 2,
    order: 7,
  },

  // ─── L2 — الضرب ───
  {
    id: "S10",
    level: "L2",
    name: "الضرب — منزلة × 2",
    nameEn: "Multiplication 1×2",
    description: "ضرب منزلة واحدة × منزلتين",
    moduleCount: 1,
    order: 1,
  },
  {
    id: "S11",
    level: "L2",
    name: "الضرب — 2×2",
    nameEn: "Multiplication 2×2",
    description: "ضرب منزلتين × منزلتين أو 3",
    moduleCount: 2,
    order: 2,
  },
  {
    id: "S12",
    level: "L2",
    name: "الضرب المتقدم",
    nameEn: "Advanced Multiplication",
    description: "ضرب متعدد المنازل (3×3 · 4×2 · 2×4)",
    moduleCount: 3,
    order: 3,
  },

  // ─── L3 — القسمة ───
  {
    id: "S13",
    level: "L3",
    name: "القسمة ÷ 1",
    nameEn: "Division ÷1",
    description: "القسمة على رقم واحد",
    moduleCount: 2,
    order: 1,
  },
  {
    id: "S14",
    level: "L3",
    name: "القسمة ÷ 2",
    nameEn: "Division ÷2",
    description: "القسمة على رقمين",
    moduleCount: 2,
    order: 2,
  },
  {
    id: "S15",
    level: "L3",
    name: "القسمة ÷ 3",
    nameEn: "Division ÷3",
    description: "القسمة على ثلاثة أرقام",
    moduleCount: 2,
    order: 3,
  },

  // ─── L4 — جمع وطرح متقدم ───
  {
    id: "S16",
    level: "L4",
    name: "جمع/طرح متقدم",
    nameEn: "Advanced Add/Sub",
    description: "سلاسل مركّبة وأعداد كبيرة",
    moduleCount: 3,
    order: 1,
  },

  // ─── L5 — ضرب وقسمة متقدم ───
  {
    id: "S17",
    level: "L5",
    name: "ضرب/قسمة متقدم",
    nameEn: "Advanced Mul/Div",
    description: "ضرب متقدم + قسمة متقدمة",
    moduleCount: 2,
    order: 1,
  },

  // ─── L6 — الكسور العشرية ───
  {
    id: "S18",
    level: "L6",
    name: "الأعداد العشرية",
    nameEn: "Decimals",
    description: "جمع/طرح/ضرب الأعداد العشرية",
    moduleCount: 2,
    order: 1,
  },

  // ─── L7 — الجذور ───
  {
    id: "S19",
    level: "L7",
    name: "الجذور التربيعية",
    nameEn: "Square Roots",
    description: "الجذور التربيعية الكاملة",
    moduleCount: 1,
    order: 1,
  },
  {
    id: "S20",
    level: "L7",
    name: "الجذور التكعيبية",
    nameEn: "Cube Roots",
    description: "الجذور التكعيبية الكاملة",
    moduleCount: 1,
    order: 2,
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