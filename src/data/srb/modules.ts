// ═══════════════════════════════════════════════════════════════════
// 🎯 src/data/srb/modules.ts — المهارات الفرعية (m)
// ═══════════════════════════════════════════════════════════════════
//
// 🔑 الترتيب النهائي:
//   L0 = S01 · S02
//   L1 = S03 · S04
//   L2 = S05 · S06 (ضرب)
//   L3 = S07 · S08 (قسمة)
//   L4 = S09 · S10 (سلاسل)
//   L5 = S11 · S12
//   L6 = S13 · S14
//   L7 = S15
//
// 📅 آخر تحديث: 2026-10-06
// ═══════════════════════════════════════════════════════════════════

import type { SRBSection, SRBModule, SRBLevel } from "./types";

export interface SRBModuleDef {
  id: SRBModule;
  section: SRBSection;
  level: SRBLevel;
  name: string;
  description: string;
  order: number;
}

export const SRB_MODULES: readonly SRBModuleDef[] = Object.freeze([
  // ═══════════════ L0 — التمهيدي (4 m) ═══════════════

// ─── S01: تمثيل الأرقام 0-9 (2 m) ───
{
  id: "m1",
  section: "S01",
  level: "L0",
  name: "تمثيل 0-4",
  description: "الأرقام الصغيرة بالخرزات السفلية",
  order: 1,
},
{
  id: "m2",
  section: "S01",
  level: "L0",
  name: "تمثيل 5-9",
  description: "الخرزة العلوية (5) + السفلية (6-9)",
  order: 2,
},

// ─── S02: القيمة المكانية (2 m) ───
{
  id: "m1",
  section: "S02",
  level: "L0",
  name: "الآحاد والعشرات",
  description: "الأعداد من 0 إلى 99",
  order: 1,
},
{
  id: "m2",
  section: "S02",
  level: "L0",
  name: "المئات والآلاف",
  description: "الأعداد من 100 إلى 9999",
  order: 2,
},

  // ═══════════════ L1 — الجمع والطرح (8 m) ═══════════════

  // ─── S03: الجمع (4 m) ───
  {
    id: "m1",
    section: "S03",
    level: "L1",
    name: "جمع بسيط",
    description: "الإضافة مباشرة دون أصدقاء",
    order: 1,
  },
  {
    id: "m2",
    section: "S03",
    level: "L1",
    name: "جمع بأصدقاء 5",
    description: "+n = +5 - (5-n)",
    order: 2,
  },
  {
    id: "m3",
    section: "S03",
    level: "L1",
    name: "جمع بأصدقاء 10",
    description: "+n = +10 - (10-n)",
    order: 3,
  },
  {
    id: "m4",
    section: "S03",
    level: "L1",
    name: "جمع مركب",
    description: "أصدقاء 10 + أصدقاء 5",
    order: 4,
  },

  // ─── S04: الطرح (4 m) ───
  {
    id: "m1",
    section: "S04",
    level: "L1",
    name: "طرح بسيط",
    description: "الطرح مباشر دون أصدقاء",
    order: 1,
  },
  {
    id: "m2",
    section: "S04",
    level: "L1",
    name: "طرح بأصدقاء 5",
    description: "-n = -5 + (5-n)",
    order: 2,
  },
  {
    id: "m3",
    section: "S04",
    level: "L1",
    name: "طرح بأصدقاء 10",
    description: "-n = -10 + (10-n)",
    order: 3,
  },
  {
    id: "m4",
    section: "S04",
    level: "L1",
    name: "طرح مركب",
    description: "أصدقاء 10 + أصدقاء 5",
    order: 4,
  },

  // ═══════════════ L2 — الضرب (8 m) ═══════════════

  // ─── S05: ضرب 1×2 (4 m) ───
  {
    id: "m1",
    section: "S05",
    level: "L2",
    name: "ضرب بسيط",
    description: "إضافات مباشرة",
    order: 1,
  },
  {
    id: "m2",
    section: "S05",
    level: "L2",
    name: "ضرب بأصدقاء 5",
    description: "إضافة 1-4 إلى عمود فيه 1-4",
    order: 2,
  },
  {
    id: "m3",
    section: "S05",
    level: "L2",
    name: "ضرب بأصدقاء 10",
    description: "ترحيل بعد 9",
    order: 3,
  },
  {
    id: "m4",
    section: "S05",
    level: "L2",
    name: "ضرب مركب",
    description: "أصدقاء 10 + أصدقاء 5",
    order: 4,
  },

  // ─── S06: ضرب 2×2 (4 m) ───
  {
    id: "m1",
    section: "S06",
    level: "L2",
    name: "ضرب بسيط",
    description: "إضافات مباشرة",
    order: 1,
  },
  {
    id: "m2",
    section: "S06",
    level: "L2",
    name: "ضرب بأصدقاء 5",
    description: "إضافة 1-4 إلى عمود فيه 1-4",
    order: 2,
  },
  {
    id: "m3",
    section: "S06",
    level: "L2",
    name: "ضرب بأصدقاء 10",
    description: "ترحيل بعد 9",
    order: 3,
  },
  {
    id: "m4",
    section: "S06",
    level: "L2",
    name: "ضرب مركب",
    description: "أصدقاء 10 + أصدقاء 5",
    order: 4,
  },

  // ═══════════════ L3 — القسمة (8 m) ═══════════════

  // ─── S07: القسمة ÷1 (4 m) ───
  {
    id: "m1",
    section: "S07",
    level: "L3",
    name: "قسمة بسيطة",
    description: "طرح مباشر للنواتج الجزئية",
    order: 1,
  },
  {
    id: "m2",
    section: "S07",
    level: "L3",
    name: "قسمة بأصدقاء 5",
    description: "طرح باستخدام مكمّلات 5",
    order: 2,
  },
  {
    id: "m3",
    section: "S07",
    level: "L3",
    name: "قسمة بأصدقاء 10",
    description: "استعارة من العمود المجاور",
    order: 3,
  },
  {
    id: "m4",
    section: "S07",
    level: "L3",
    name: "قسمة مركبة",
    description: "أصدقاء 10 + أصدقاء 5",
    order: 4,
  },

  // ─── S08: القسمة ÷2 (4 m) ───
  {
    id: "m1",
    section: "S08",
    level: "L3",
    name: "قسمة بسيطة",
    description: "طرح مباشر للنواتج الجزئية",
    order: 1,
  },
  {
    id: "m2",
    section: "S08",
    level: "L3",
    name: "قسمة بأصدقاء 5",
    description: "طرح باستخدام مكمّلات 5",
    order: 2,
  },
  {
    id: "m3",
    section: "S08",
    level: "L3",
    name: "قسمة بأصدقاء 10",
    description: "استعارة من العمود المجاور",
    order: 3,
  },
  {
    id: "m4",
    section: "S08",
    level: "L3",
    name: "قسمة مركبة",
    description: "أصدقاء 10 + أصدقاء 5",
    order: 4,
  },

  // ═══════════════ L4 — سلاسل الجمع والطرح (8 m) ═══════════════

  // ─── S09: سلاسل الجمع (4 m) ───
  {
    id: "m1",
    section: "S09",
    level: "L4",
    name: "جمع بسيط (سلاسل)",
    description: "سلاسل جمع مباشرة",
    order: 1,
  },
  {
    id: "m2",
    section: "S09",
    level: "L4",
    name: "جمع بأصدقاء 5 (سلاسل)",
    description: "سلاسل جمع بأصدقاء 5",
    order: 2,
  },
  {
    id: "m3",
    section: "S09",
    level: "L4",
    name: "جمع بأصدقاء 10 (سلاسل)",
    description: "سلاسل جمع بأصدقاء 10",
    order: 3,
  },
  {
    id: "m4",
    section: "S09",
    level: "L4",
    name: "جمع مركب (سلاسل)",
    description: "سلاسل جمع مركّبة",
    order: 4,
  },

  // ─── S10: سلاسل الطرح (4 m) ───
  {
    id: "m1",
    section: "S10",
    level: "L4",
    name: "طرح بسيط (سلاسل)",
    description: "سلاسل طرح مباشرة",
    order: 1,
  },
  {
    id: "m2",
    section: "S10",
    level: "L4",
    name: "طرح بأصدقاء 5 (سلاسل)",
    description: "سلاسل طرح بأصدقاء 5",
    order: 2,
  },
  {
    id: "m3",
    section: "S10",
    level: "L4",
    name: "طرح بأصدقاء 10 (سلاسل)",
    description: "سلاسل طرح بأصدقاء 10",
    order: 3,
  },
  {
    id: "m4",
    section: "S10",
    level: "L4",
    name: "طرح مركب (سلاسل)",
    description: "سلاسل طرح مركّبة",
    order: 4,
  },

  // ═══════════════ L5 — ضرب وقسمة متقدم (8 m) ═══════════════

  // ─── S11: ضرب 2×3 (4 m) ───
  {
    id: "m1",
    section: "S11",
    level: "L5",
    name: "ضرب بسيط",
    description: "إضافات مباشرة",
    order: 1,
  },
  {
    id: "m2",
    section: "S11",
    level: "L5",
    name: "ضرب بأصدقاء 5",
    description: "إضافة 1-4 إلى عمود فيه 1-4",
    order: 2,
  },
  {
    id: "m3",
    section: "S11",
    level: "L5",
    name: "ضرب بأصدقاء 10",
    description: "ترحيل بعد 9",
    order: 3,
  },
  {
    id: "m4",
    section: "S11",
    level: "L5",
    name: "ضرب مركب",
    description: "أصدقاء 10 + أصدقاء 5",
    order: 4,
  },

  // ─── S12: القسمة المتقدمة (4 m) ───
  {
    id: "m1",
    section: "S12",
    level: "L5",
    name: "قسمة بسيطة",
    description: "طرح مباشر للنواتج الجزئية",
    order: 1,
  },
  {
    id: "m2",
    section: "S12",
    level: "L5",
    name: "قسمة بأصدقاء 5",
    description: "طرح باستخدام مكمّلات 5",
    order: 2,
  },
  {
    id: "m3",
    section: "S12",
    level: "L5",
    name: "قسمة بأصدقاء 10",
    description: "استعارة من العمود المجاور",
    order: 3,
  },
  {
    id: "m4",
    section: "S12",
    level: "L5",
    name: "قسمة مركبة",
    description: "أصدقاء 10 + أصدقاء 5",
    order: 4,
  },

  // ═══════════════ L6 — الكسور العشرية (5 m) ═══════════════

  // ─── S13: جمع/طرح العشري (3 m) ───
  {
    id: "m1",
    section: "S13",
    level: "L6",
    name: "جمع/طرح عشري بسيط",
    description: "عمليات مباشرة على الأعمدة العشرية",
    order: 1,
  },
  {
    id: "m2",
    section: "S13",
    level: "L6",
    name: "جمع/طرح بأصدقاء 5 و10",
    description: "استخدام مكمّلات 5 أو 10",
    order: 2,
  },
  {
    id: "m3",
    section: "S13",
    level: "L6",
    name: "جمع/طرح عشري مركب",
    description: "أصدقاء 10 + أصدقاء 5",
    order: 3,
  },

  // ─── S14: ضرب/قسمة العشري (2 m) ───
  {
    id: "m1",
    section: "S14",
    level: "L6",
    name: "ضرب عشري",
    description: "ضرب الأعداد مع محاذاة الفاصلة",
    order: 1,
  },
  {
    id: "m2",
    section: "S14",
    level: "L6",
    name: "قسمة عشرية",
    description: "قسمة مع تحريك الفاصلة",
    order: 2,
  },

  // ═══════════════ L7 — الجذور (1 m) ═══════════════

  // ─── S15: الجذور التربيعية (1 m) ───
  {
    id: "m1",
    section: "S15",
    level: "L7",
    name: "جذر تربيعي",
    description: "√121 · √144 · √169 (مربعات كاملة)",
    order: 1,
  },
]);

export function getModulesBySection(
  section: SRBSection,
): SRBModuleDef[] {
  return SRB_MODULES.filter((m) => m.section === section).sort(
    (a, b) => a.order - b.order,
  );
}

export function getModuleDef(
  section: SRBSection,
  module: SRBModule,
): SRBModuleDef | undefined {
  return SRB_MODULES.find(
    (m) => m.section === section && m.id === module,
  );
}

export function getModuleName(
  section: SRBSection,
  module: SRBModule,
): string {
  const def = getModuleDef(section, module);
  return def?.name ?? module;
}

export function getModuleCount(section: SRBSection): number {
  return getModulesBySection(section).length;
}

export function getModulesByLevel(level: SRBLevel): SRBModuleDef[] {
  return SRB_MODULES.filter((m) => m.level === level);
}

export const TOTAL_MODULES = SRB_MODULES.length;

export function isValidModule(
  section: SRBSection,
  module: SRBModule,
): boolean {
  return SRB_MODULES.some(
    (m) => m.section === section && m.id === module,
  );
}