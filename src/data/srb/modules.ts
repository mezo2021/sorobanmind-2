// ═══════════════════════════════════════════════════════════════════
// 🎯 src/data/srb/modules.ts — المهارات الفرعية (m)
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يُعرِّف المهارات الفرعية (m1-m99) لكل درس
//   - لكل درس: قائمة m بأسماء واضحة
//   - الأسماء للعرض فقط — ID يستخدم m1, m2, ...
//
// 🔑 قاعدة:
//   - m مرتبط بـ S (إعادة ترقيم في كل درس)
//   - كل S يُعيد الترقيم من m1
//
// ═══════════════════════════════════════════════════════════════════

import type { SRBSection, SRBModule, SRBLevel } from "./types";

// ═══════════════════════════════════════════════════════════
// 📋 تعريف المهارة (Module Definition)
// ═══════════════════════════════════════════════════════════

export interface SRBModuleDef {
  id: SRBModule;
  section: SRBSection;
  level: SRBLevel;
  name: string;
  description: string;
  order: number;
}

// ═══════════════════════════════════════════════════════════
// 📚 قائمة المهارات الكاملة
// ═══════════════════════════════════════════════════════════

export const SRB_MODULES: readonly SRBModuleDef[] = Object.freeze([
  // ═══════════════ L0 — التمهيدي ═══════════════

  // ─── S01: تمثيل الأرقام 0-9 ───
  {
    id: "m1",
    section: "S01",
    level: "L0",
    name: "تمثيل 0-4",
    description: "الخرزات السفلية فقط",
    order: 1,
  },
  {
    id: "m2",
    section: "S01",
    level: "L0",
    name: "تمثيل 5",
    description: "الخرزة العلوية فقط",
    order: 2,
  },
  {
    id: "m3",
    section: "S01",
    level: "L0",
    name: "تمثيل 6-9",
    description: "مزيج من العلوية والسفلية",
    order: 3,
  },
  {
    id: "m4",
    section: "S01",
    level: "L0",
    name: "الانتقال بين الأرقام",
    description: "قراءة وبناء الأرقام من 0-9 بسرعة",
    order: 4,
  },

  // ─── S02: القيمة المكانية ───
  {
    id: "m1",
    section: "S02",
    level: "L0",
    name: "الآحاد",
    description: "العمود الأيمن (المنزلة الأولى)",
    order: 1,
  },
  {
    id: "m2",
    section: "S02",
    level: "L0",
    name: "العشرات",
    description: "العمود الثاني من اليمين",
    order: 2,
  },
  {
    id: "m3",
    section: "S02",
    level: "L0",
    name: "المئات",
    description: "العمود الثالث من اليمين",
    order: 3,
  },
  {
    id: "m4",
    section: "S02",
    level: "L0",
    name: "الآلاف",
    description: "العمود الرابع من اليمين",
    order: 4,
  },

  // ═══════════════ L1 — الجمع والطرح ═══════════════

  // ─── S03: الجمع المباشر ───
  {
    id: "m1",
    section: "S03",
    level: "L1",
    name: "جمع بدون حمل",
    description: "الجمع المباشر على نفس العمود",
    order: 1,
  },
  {
    id: "m2",
    section: "S03",
    level: "L1",
    name: "جمع مع حمل",
    description: "الجمع مع نقل إلى المنزلة التالية",
    order: 2,
  },

  // ─── S04: الطرح المباشر ───
  {
    id: "m1",
    section: "S04",
    level: "L1",
    name: "طرح بدون استلاف",
    description: "الطرح المباشر من نفس العمود",
    order: 1,
  },
  {
    id: "m2",
    section: "S04",
    level: "L1",
    name: "طرح مع استلاف",
    description: "الطرح مع استلاف من المنزلة الأعلى",
    order: 2,
  },

  // ─── S05: أصدقاء 5 — جمع ───
  {
    id: "m1",
    section: "S05",
    level: "L1",
    name: "أصدقاء 5 — جمع",
    description: "استخدام مكمّلات الخمسة في الجمع",
    order: 1,
  },

  // ─── S06: أصدقاء 5 — طرح ───
  {
    id: "m1",
    section: "S06",
    level: "L1",
    name: "أصدقاء 5 — طرح",
    description: "استخدام مكمّلات الخمسة في الطرح",
    order: 1,
  },

  // ─── S07: أصدقاء 10 — جمع ───
  {
    id: "m1",
    section: "S07",
    level: "L1",
    name: "أصدقاء 10 — جمع",
    description: "استخدام مكمّلات العشرة في الجمع",
    order: 1,
  },

  // ─── S08: أصدقاء 10 — طرح ───
  {
    id: "m1",
    section: "S08",
    level: "L1",
    name: "أصدقاء 10 — طرح",
    description: "استخدام مكمّلات العشرة في الطرح",
    order: 1,
  },

  // ─── S09: جمع/طرح مختلط ───
  {
    id: "m1",
    section: "S09",
    level: "L1",
    name: "سلسلة مختلطة",
    description: "سلاسل جمع وطرح بالتتابع",
    order: 1,
  },
  {
    id: "m2",
    section: "S09",
    level: "L1",
    name: "عمليات مركّبة",
    description: "سلاسل 4+ حدود",
    order: 2,
  },

  // ═══════════════ L2 — الضرب ═══════════════

  // ─── S10: الضرب 1×2 ───
  {
    id: "m1",
    section: "S10",
    level: "L2",
    name: "منزلة × منزلتين",
    description: "ضرب 1 × 2 (مثل 3 × 12)",
    order: 1,
  },

  // ─── S11: الضرب 2×2 ───
  {
    id: "m1",
    section: "S11",
    level: "L2",
    name: "منزلة × 3 منازل",
    description: "ضرب 1 × 3 (مثل 4 × 123)",
    order: 1,
  },
  {
    id: "m2",
    section: "S11",
    level: "L2",
    name: "منزلتين × منزلتين",
    description: "ضرب 2 × 2 (مثل 12 × 15)",
    order: 2,
  },

  // ─── S12: الضرب المتقدم ───
  {
    id: "m1",
    section: "S12",
    level: "L2",
    name: "منزلة × 4 منازل",
    description: "ضرب 1 × 4 (مثل 5 × 1234)",
    order: 1,
  },
  {
    id: "m2",
    section: "S12",
    level: "L2",
    name: "منزلتين × (3 و 4) منازل",
    description: "ضرب 2 × 3 و 2 × 4",
    order: 2,
  },
  {
    id: "m3",
    section: "S12",
    level: "L2",
    name: "3 منازل × 3 منازل",
    description: "ضرب 3 × 3 (مثل 123 × 456)",
    order: 3,
  },

  // ═══════════════ L3 — القسمة ═══════════════

  // ─── S13: القسمة ÷ 1 ───
  {
    id: "m1",
    section: "S13",
    level: "L3",
    name: "قسمة تامة ÷ 1",
    description: "قسمة على رقم واحد بدون باقي",
    order: 1,
  },
  {
    id: "m2",
    section: "S13",
    level: "L3",
    name: "قسمة بباقي ÷ 1",
    description: "قسمة على رقم واحد مع باقي",
    order: 2,
  },

  // ─── S14: القسمة ÷ 2 ───
  {
    id: "m1",
    section: "S14",
    level: "L3",
    name: "قسمة تامة ÷ 2",
    description: "قسمة على رقمين بدون باقي",
    order: 1,
  },
  {
    id: "m2",
    section: "S14",
    level: "L3",
    name: "قسمة بباقي ÷ 2",
    description: "قسمة على رقمين مع باقي",
    order: 2,
  },

  // ─── S15: القسمة ÷ 3 ───
  {
    id: "m1",
    section: "S15",
    level: "L3",
    name: "قسمة تامة ÷ 3",
    description: "قسمة على ثلاثة أرقام بدون باقي",
    order: 1,
  },
  {
    id: "m2",
    section: "S15",
    level: "L3",
    name: "قسمة بباقي ÷ 3",
    description: "قسمة على ثلاثة أرقام مع باقي",
    order: 2,
  },

  // ═══════════════ L4 — جمع وطرح متقدم ═══════════════

  // ─── S16: جمع/طرح متقدم ───
  {
    id: "m1",
    section: "S16",
    level: "L4",
    name: "سلاسل ≤ 999",
    description: "سلاسل مركّبة بأرقام ≤ 999",
    order: 1,
  },
  {
    id: "m2",
    section: "S16",
    level: "L4",
    name: "سلاسل 1000-9999",
    description: "سلاسل مركّبة بأرقام 4 خانات",
    order: 2,
  },
  {
    id: "m3",
    section: "S16",
    level: "L4",
    name: "سلاسل 5+ حدود",
    description: "سلاسل طويلة (5+ أرقام)",
    order: 3,
  },

  // ═══════════════ L5 — ضرب وقسمة متقدم ═══════════════

  // ─── S17: ضرب/قسمة متقدم ───
  {
    id: "m1",
    section: "S17",
    level: "L5",
    name: "الضرب المتقدم",
    description: "ضرب بأرقام كبيرة (3×3 · 4×3)",
    order: 1,
  },
  {
    id: "m2",
    section: "S17",
    level: "L5",
    name: "القسمة المتقدمة",
    description: "قسمة بأرقام كبيرة (÷ 3-4)",
    order: 2,
  },

  // ═══════════════ L6 — الكسور العشرية ═══════════════

  // ─── S18: الأعداد العشرية ───
  {
    id: "m1",
    section: "S18",
    level: "L6",
    name: "جمع/طرح عشري",
    description: "جمع وطرح الأعداد العشرية",
    order: 1,
  },
  {
    id: "m2",
    section: "S18",
    level: "L6",
    name: "ضرب عشري",
    description: "ضرب الأعداد العشرية",
    order: 2,
  },

  // ═══════════════ L7 — الجذور ═══════════════

  // ─── S19: الجذور التربيعية ───
  {
    id: "m1",
    section: "S19",
    level: "L7",
    name: "جذور تربيعية كاملة",
    description: "√121 · √144 · √169 (مربعات كاملة)",
    order: 1,
  },

  // ─── S20: الجذور التكعيبية ───
  {
    id: "m1",
    section: "S20",
    level: "L7",
    name: "جذور تكعيبية كاملة",
    description: "∛125 · ∛216 · ∛343 (مكعبات كاملة)",
    order: 1,
  },
]);

// ═══════════════════════════════════════════════════════════
// 🛠️ دوال مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * الحصول على كل مهارات درس معين.
 */
export function getModulesBySection(
  section: SRBSection,
): SRBModuleDef[] {
  return SRB_MODULES.filter((m) => m.section === section).sort(
    (a, b) => a.order - b.order,
  );
}

/**
 * الحصول على تعريف مهارة محددة.
 */
export function getModuleDef(
  section: SRBSection,
  module: SRBModule,
): SRBModuleDef | undefined {
  return SRB_MODULES.find(
    (m) => m.section === section && m.id === module,
  );
}

/**
 * الحصول على اسم مهارة (للعرض).
 */
export function getModuleName(
  section: SRBSection,
  module: SRBModule,
): string {
  const def = getModuleDef(section, module);
  return def?.name ?? module;
}

/**
 * عدد المهارات في درس.
 */
export function getModuleCount(section: SRBSection): number {
  return getModulesBySection(section).length;
}

/**
 * كل مهارات مستوى معين.
 */
export function getModulesByLevel(level: SRBLevel): SRBModuleDef[] {
  return SRB_MODULES.filter((m) => m.level === level);
}

/**
 * إجمالي عدد المهارات.
 */
export const TOTAL_MODULES = SRB_MODULES.length;

/**
 * التحقق: هل (section, module) موجودان؟
 */
export function isValidModule(
  section: SRBSection,
  module: SRBModule,
): boolean {
  return SRB_MODULES.some(
    (m) => m.section === section && m.id === module,
  );
}