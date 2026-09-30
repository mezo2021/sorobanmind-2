// ═══════════════════════════════════════════════════════════════════
// 📚 src/data/srb/questions/L0.ts — أسئلة المستوى التمهيدي
// ═══════════════════════════════════════════════════════════════════
//
// 📊 يحتوي:
//   - S01 (تمثيل الأرقام 0-9): m1 (0-4), m2 (5), m3 (6-9) = 15 سؤالًا
//   - S02 (القيمة المكانية): m1 (آحاد/عشرات), m2 (مئات/آلاف) = 10 أسئلة
//
// الإجمالي: 25 سؤالًا
//
// 📅 آخر تحديث: 2026-09-30 — الجلسة 10
//   - كل الأسئلة تبدأ من الصفر
//   - نوعان من الأسئلة: build / action-read
// ═══════════════════════════════════════════════════════════════════

import { makeQuestion } from "../generateId";
import type { SRBQuestion } from "../types";

export const L0_QUESTIONS: SRBQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // 📖 S01 — تمثيل الأرقام 0-9
  // ═══════════════════════════════════════════════════════════

  // ─── m1: تمثيل 0-4 ───

  makeQuestion({
    level: "L0", section: "S01", module: "m1", sequence: 1, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 0 على العداد",
    operands: [0], operation: "build", result: 0,
    solution: "سبب الاختيار: تمثيل الصفر. لا ترفع أي خرزة سفلية، ولا تُنزل الخرزة العلوية. جميع الخرزات بعيدة عن العارضة الفاصلة.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "zero", "0-4"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m1", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "ارفع خرزة سفلية واحدة. ماذا تمثل؟",
    operands: [1], operation: "read", result: 1,
    solution: "سبب الاختيار: حركة واحدة من الصفر. ارفع خرزة سفلية واحدة بالإبهام نحو العارضة. الخرزة السفلية الواحدة تمثل 1.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "0-4", "action-read"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m1", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 2 على العداد",
    operands: [2], operation: "build", result: 2,
    solution: "سبب الاختيار: عدد صغير (1-4) يُرفع بالخرزات السفلية. ارفع خرزتين سفليتين معًا بالإبهام نحو العارضة.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "0-4"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m1", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "ارفع 3 خرزات سفلية. ماذا تمثل؟",
    operands: [3], operation: "read", result: 3,
    solution: "سبب الاختيار: حركة من الصفر. ارفع 3 خرزات سفلية معًا بالإبهام. الثلاث خرزات تمثل 3.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5500, expected_anzan_ms: 3300,
    tags: ["representation", "0-4", "action-read"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m1", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 4 على العداد",
    operands: [4], operation: "build", result: 4,
    solution: "سبب الاختيار: أكبر عدد في الخرزات السفلية (1-4). ارفع 4 خرزات سفلية معًا بالإبهام نحو العارضة.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5500, expected_anzan_ms: 3300,
    tags: ["representation", "0-4"],
  }),

  // ─── m2: تمثيل 5 ───

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 1, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "أنزل الخرزة العلوية. ماذا تمثل؟",
    operands: [5], operation: "read", result: 5,
    solution: "سبب الاختيار: حركة واحدة من الصفر. أنزل الخرزة العلوية بالسبابة نحو العارضة. الخرزة العلوية الملامسة للعارضة تمثل 5.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "five", "action-read"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "كم تمثل الخرزة العلوية في عمود الآحاد؟",
    operands: [5], operation: "read", result: 5,
    solution: "سبب الاختيار: سؤال مفهومي عن قيمة الخرزة العلوية. الخرزة العلوية في أي عمود = 5. لا ترفع أي سفلية.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["concept", "five"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 5 على العداد",
    operands: [5], operation: "build", result: 5,
    solution: "سبب الاختيار: تمثيل 5 بالخرزة العلوية. أنزل الخرزة العلوية بالسبابة. اترك الخرزات السفلية بعيدة عن العارضة.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "five"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "أنزل الخرزة العلوية بالسبابة. ما القيمة الممثلة؟",
    operands: [5], operation: "read", result: 5,
    solution: "سبب الاختيار: تأكيد حركة العلوية. أنزل الخرزة العلوية بالسبابة نحو العارضة. القيمة الممثلة هي 5.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "five", "action-read"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 5 على العداد",
    operands: [5], operation: "build", result: 5,
    solution: "سبب الاختيار: تثبيت تمثيل 5. أنزل الخرزة العلوية بالسبابة. لا ترفع أي خرزة سفلية.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 4500, expected_anzan_ms: 2700,
    tags: ["representation", "five"],
  }),

  // ─── m3: تمثيل 6-9 ───

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 1, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 6 على العداد",
    operands: [6], operation: "build", result: 6,
    solution: "سبب الاختيار: عدد مركب (5+1). حركة القرص: أنزل الخرزة العلوية (5) وارفع خرزة سفلية واحدة (1) معًا نحو العارضة.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 6000, expected_anzan_ms: 3600,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "أنزل العلوية وارفع خرزتين. ماذا تمثل؟",
    operands: [7], operation: "read", result: 7,
    solution: "سبب الاختيار: حركة القرص من الصفر. أنزل الخرزة العلوية (5) وارفع خرزتين سفليتين (2) معًا. النتيجة 5+2 = 7.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 6500, expected_anzan_ms: 3900,
    tags: ["representation", "six-nine", "pinch", "action-read"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 8 على العداد",
    operands: [8], operation: "build", result: 8,
    solution: "سبب الاختيار: عدد مركب (5+3). حركة القرص: أنزل الخرزة العلوية (5) وارفع 3 خرزات سفلية (3) معًا.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 6500, expected_anzan_ms: 3900,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "أنزل العلوية وارفع 4 سفليات. ماذا تمثل؟",
    operands: [9], operation: "read", result: 9,
    solution: "سبب الاختيار: حركة القرص من الصفر. أنزل الخرزة العلوية (5) وارفع 4 خرزات سفلية (4) معًا. النتيجة 5+4 = 9.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 7000, expected_anzan_ms: 4200,
    tags: ["representation", "six-nine", "pinch", "action-read"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "أنزل العلوية وارفع سفليه. ماذا تمثل؟",
    operands: [6], operation: "read", result: 6,
    solution: "سبب الاختيار: تأكيد حركة القرص. أنزل الخرزة العلوية (5) وارفع خرزة سفلية واحدة (1) معًا. النتيجة 5+1 = 6.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 6000, expected_anzan_ms: 3600,
    tags: ["representation", "six-nine", "pinch", "action-read"],
  }),

  // ═══════════════════════════════════════════════════════════
  // 📖 S02 — القيمة المكانية
  // ═══════════════════════════════════════════════════════════

  // ─── m1: الآحاد والعشرات (0-99) ───

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 1, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 40 على العداد",
    operands: [40], operation: "build", result: 40,
    solution: "سبب الاختيار: عشرات نظيفة (آحاد = 0). في عمود العشرات: ارفع 4 خرزات سفلية بالإبهام. اترك عمود الآحاد فارغًا.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 7000, expected_anzan_ms: 4200,
    tags: ["place-value", "tens"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 25 على العداد",
    operands: [25], operation: "build", result: 25,
    solution: "سبب الاختيار: عشرات + آحاد بخمسة. في العشرات: ارفع خرزتين سفليتين = 20. في الآحاد: أنزل الخرزة العلوية = 5.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 7000, expected_anzan_ms: 4200,
    tags: ["place-value", "tens"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 63 على العداد",
    operands: [63], operation: "build", result: 63,
    solution: "سبب الاختيار: كل عمود يستخدم حركة القرص. العشرات: قرص = العلوية (5) + سفليه (1) = 60. الآحاد: 3 سفليات = 3.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 8000, expected_anzan_ms: 4800,
    tags: ["place-value", "tens", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 19 على العداد",
    operands: [19], operation: "build", result: 19,
    solution: "سبب الاختيار: آحاد مركبة (9). العشرات: سفليه واحدة = 10. الآحاد: قرص = علوية (5) + 4 سفليات = 9.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 8000, expected_anzan_ms: 4800,
    tags: ["place-value", "tens", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 87 على العداد",
    operands: [87], operation: "build", result: 87,
    solution: "سبب الاختيار: حركة القرص في العمودين. العشرات: قرص = 5 + 3 = 80. الآحاد: قرص = 5 + 2 = 7.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 9000, expected_anzan_ms: 5400,
    tags: ["place-value", "tens", "pinch"],
  }),

  // ─── m2: المئات والآلاف (100-9999) ───

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 1, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 100 على العداد",
    operands: [100], operation: "build", result: 100,
    solution: "سبب الاختيار: مئات نظيفة. في المئات: ارفع خرزة سفلية واحدة = 100. اترك باقي الأعمدة فارغة.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 8000, expected_anzan_ms: 4800,
    tags: ["place-value", "hundreds"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 300 على العداد",
    operands: [300], operation: "build", result: 300,
    solution: "سبب الاختيار: مئات نظيفة. في المئات: ارفع 3 خرزات سفلية بالإبهام = 300. باقي الأعمدة فارغة.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 8000, expected_anzan_ms: 4800,
    tags: ["place-value", "hundreds"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 500 على العداد",
    operands: [500], operation: "build", result: 500,
    solution: "سبب الاختيار: يستخدم الخرزة العلوية في المئات. في المئات: أنزل الخرزة العلوية بالسبابة = 500.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 8000, expected_anzan_ms: 4800,
    tags: ["place-value", "hundreds", "upper-bead"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 1000 على العداد",
    operands: [1000], operation: "build", result: 1000,
    solution: "سبب الاختيار: آلاف نظيفة. في الآلاف: ارفع خرزة سفلية واحدة بالإبهام = 1000. باقي الأعمدة فارغة.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 9000, expected_anzan_ms: 5400,
    tags: ["place-value", "thousands"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 1500 على العداد",
    operands: [1500], operation: "build", result: 1500,
    solution: "سبب الاختيار: آلاف + مئات. الآلاف: ارفع سفليه واحدة = 1000. المئات: أنزل الخرزة العلوية = 500.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 10000, expected_anzan_ms: 6000,
    tags: ["place-value", "thousands"],
  }),
];

export default L0_QUESTIONS;