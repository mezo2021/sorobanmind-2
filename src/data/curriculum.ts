// src/data/curriculum.ts
// المنهج الجديد — 8 مستويات (L0-L7) في قسمين

import type {
  Category,
  CurriculumGroup,
  LevelStatus,
  LocalizedText,
} from "../curriculum/types";

import type { LevelId } from "../store/progressStore";

// ═══════════════════════════════════════════════════════════
// المجموعات (للتوافق مع الكود القديم)
// ═══════════════════════════════════════════════════════════

export interface CurriculumGroupInfo {
  id: CurriculumGroup;
  titleKey: string;
  descKey: string;
  icon: string;
  gradient: string;
  levelIds: LevelId[];
}

export const CURRICULUM_GROUPS: CurriculumGroupInfo[] = [
  {
    id: "fundamentals",
    titleKey: "curriculum.fundamentals",
    descKey: "curriculum.fundamentals.desc",
    icon: "BookOpen",
    gradient: "from-emerald-500 to-teal-700",
    levelIds: ["L0", "L1"],
  },
  {
    id: "majorOps",
    titleKey: "curriculum.majorOps",
    descKey: "curriculum.majorOps.desc",
    icon: "Calculator",
    gradient: "from-amber-500 to-orange-700",
    levelIds: ["L2", "L3"],
  },
  {
    id: "expansion",
    titleKey: "curriculum.expansion",
    descKey: "curriculum.expansion.desc",
    icon: "TrendingUp",
    gradient: "from-blue-500 to-cyan-700",
    levelIds: ["L4", "L5"],
  },
  {
    id: "mastery",
    titleKey: "curriculum.mastery",
    descKey: "curriculum.mastery.desc",
    icon: "Trophy",
    gradient: "from-yellow-500 to-amber-700",
    levelIds: ["L6", "L7"],
  },
];

// ═══════════════════════════════════════════════════════════
// وصف المستوى
// ═══════════════════════════════════════════════════════════

export interface LevelInfo {
  id: LevelId;
  number: number;
  name: LocalizedText;
  description: LocalizedText;
  group: CurriculumGroup | "enrichment";
  category: Category | "both";
  icon: string;
  gradient: string;
  prerequisites: LevelId[];
  estimatedHours: number;
  targetAge: [number, number];
}

// ═══════════════════════════════════════════════════════════
// المستويات الثمانية (L0-L7)
// ═══════════════════════════════════════════════════════════

export const CURRICULUM_LEVELS: LevelInfo[] = [
  // ═══ القسم 1 (5-12): L0-L3 ═══
  {
    id: "L0",
    number: 0,
    name: { ar: "التمهيدي", en: "Foundation" },
    description: {
      ar: "التعرّف على السوروبان والأرقام ٠-٩ والقيمة المكانية",
      en: "Meet the soroban, numbers 0-9, place value",
    },
    group: "fundamentals",
    category: "kids",
    icon: "Info",
    gradient: "from-emerald-500 to-teal-700",
    prerequisites: [],
    estimatedHours: 2,
    targetAge: [5, 12],
  },
  {
    id: "L1",
    number: 1,
    name: { ar: "الجمع والطرح", en: "Addition & Subtraction" },
    description: {
      ar: "جمع وطرح بسيط + مكملات ٥ + مكملات ١٠ + مختلط",
      en: "Direct add/sub + friends of 5 + friends of 10 + mixed",
    },
    group: "fundamentals",
    category: "kids",
    icon: "Plus",
    gradient: "from-blue-500 to-cyan-700",
    prerequisites: ["L0"],
    estimatedHours: 6,
    targetAge: [5, 12],
  },
  {
    id: "L2",
    number: 2,
    name: { ar: "الضرب", en: "Multiplication" },
    description: {
      ar: "الضرب على السوروبان بطريقة تاكاشي",
      en: "Multiplication on soroban (Takashi method)",
    },
    group: "majorOps",
    category: "kids",
    icon: "X",
    gradient: "from-purple-500 to-violet-700",
    prerequisites: ["L1"],
    estimatedHours: 5,
    targetAge: [7, 12],
  },
  {
    id: "L3",
    number: 3,
    name: { ar: "القسمة", en: "Division" },
    description: {
      ar: "القسمة على السوروبان — التقدير والطرح المتتالي",
      en: "Division on soroban — estimation and repeated subtraction",
    },
    group: "majorOps",
    category: "kids",
    icon: "Divide",
    gradient: "from-amber-500 to-orange-700",
    prerequisites: ["L2"],
    estimatedHours: 5,
    targetAge: [8, 12],
  },

  // ═══ القسم 2 (13+): L4-L7 ═══
  {
    id: "L4",
    number: 4,
    name: { ar: "جمع وطرح متقدم", en: "Advanced Add & Sub" },
    description: {
      ar: "متعدد الخانات والسلاسل المركبة",
      en: "Multi-digit and combined chains",
    },
    group: "expansion",
    category: "teens",
    icon: "Layers",
    gradient: "from-blue-500 to-indigo-700",
    prerequisites: ["L3"],
    estimatedHours: 5,
    targetAge: [13, 99],
  },
  {
    id: "L5",
    number: 5,
    name: { ar: "ضرب وقسمة متقدم", en: "Advanced Mul & Div" },
    description: {
      ar: "الضرب والقسمة بطرق تاكاشي المتقدمة",
      en: "Advanced multiplication and division",
    },
    group: "expansion",
    category: "teens",
    icon: "Zap",
    gradient: "from-purple-500 to-fuchsia-700",
    prerequisites: ["L4"],
    estimatedHours: 6,
    targetAge: [13, 99],
  },
  {
    id: "L6",
    number: 6,
    name: { ar: "الكسور العشرية", en: "Decimals" },
    description: {
      ar: "العمليات على الأعداد العشرية",
      en: "Operations on decimal numbers",
    },
    group: "mastery",
    category: "teens",
    icon: "CircleDot",
    gradient: "from-amber-500 to-rose-700",
    prerequisites: ["L5"],
    estimatedHours: 5,
    targetAge: [13, 99],
  },
  {
    id: "L7",
    number: 7,
    name: { ar: "الجذور", en: "Roots" },
    description: {
      ar: "الجذور التربيعية والتكعيبية",
      en: "Square and cube roots",
    },
    group: "mastery",
    category: "teens",
    icon: "Award",
    gradient: "from-rose-500 to-purple-700",
    prerequisites: ["L6"],
    estimatedHours: 6,
    targetAge: [13, 99],
  },
];

// ═══════════════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * الحصول على معلومات مستوى.
 */
export function getLevelInfo(levelId: string): LevelInfo | undefined {
  return CURRICULUM_LEVELS.find((l) => l.id === levelId);
}

/**
 * الحصول على كل المستويات في مجموعة.
 */
export function getLevelsByGroup(group: CurriculumGroup): LevelInfo[] {
  return CURRICULUM_LEVELS.filter((l) => l.group === group);
}

/**
 * الحصول على كل المستويات لفئة معينة.
 */
export function getLevelsByCategory(category: Category): LevelInfo[] {
  return CURRICULUM_LEVELS.filter(
    (l) => l.category === category || l.category === "both",
  );
}

/**
 * حساب حالة مستوى حسب التقدم.
 */
export function computeLevelStatus(
  level: LevelInfo,
  completedLevels: string[],
): LevelStatus {
  if (completedLevels.includes(level.id)) {
    return "completed";
  }
  if (level.prerequisites.length === 0) {
    return "available";
  }
  const allPrerequisitesDone = level.prerequisites.every((p) =>
    completedLevels.includes(p),
  );
  return allPrerequisitesDone ? "available" : "locked";
}

/**
 * عدد المستويات الكلي.
 */
export const TOTAL_LEVELS = CURRICULUM_LEVELS.length;

// ═══════════════════════════════════════════════════════════
// بيانات القسمين (لشاشة HeroDashboard و CategoryScreen)
// ═══════════════════════════════════════════════════════════

export interface CategoryDefinition {
  id: Category;
  titleAr: string;
  titleEn: string;
  ageRange: string;
  description: string;
  gradient: string;
  icon: string;
  levelIds: LevelId[];
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "kids",
    titleAr: "الأبطال الصغار",
    titleEn: "Young Heroes",
    ageRange: "٥ - ١٢ سنة",
    description:
      "التأسيس: التعرّف على السوروبان، الأرقام، الجمع والطرح، الضرب والقسمة",
    gradient: "from-emerald-500 to-teal-700",
    icon: "Users",
    levelIds: ["L0", "L1", "L2", "L3"],
  },
  {
    id: "teens",
    titleAr: "الأبطال الكبار",
    titleEn: "Champion Heroes",
    ageRange: "١٣+ سنة",
    description:
      "المتقدم: العمليات المركبة، الضرب والقسمة المتقدمة، الأعداد العشرية والجذور",
    gradient: "from-purple-500 to-indigo-700",
    icon: "Trophy",
    levelIds: ["L4", "L5", "L6", "L7"],
  },
];

/**
 * الحصول على تعريف قسم.
 */
export function getCategory(categoryId: Category): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.id === categoryId);
}