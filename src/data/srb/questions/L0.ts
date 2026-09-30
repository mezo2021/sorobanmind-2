// ═══════════════════════════════════════════════════════════════════
// 📚 src/data/srb/questions/L0.ts — أسئلة المستوى التمهيدي
// ═══════════════════════════════════════════════════════════════════
//
// 📅 آخر تحديث: 2026-09-30 — الجلسة 10
//   - رفع الأزمنة (واقعية للطفل)
//   - تبسيط صياغات m2
//   - أرقام أصغر في S02-m2
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
    question: "مثل العدد 0 على العداد.",
    operands: [0], operation: "build", result: 0,
    solution: "لا ترفع أي خرزة سفلية. لا تُنزل الخرزة العلوية. جميع الخرزات بعيدة عن العارضة الفاصلة. العداد يمثل 0.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "zero", "0-4"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m1", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 1 على العداد.",
    operands: [1], operation: "build", result: 1,
    solution: "ارفع خرزة سفلية واحدة بالإبهام نحو العارضة. العداد يمثل 1.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "0-4"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m1", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 2 على العداد.",
    operands: [2], operation: "build", result: 2,
    solution: "ارفع خرزتين سفليتين معًا بالإبهام. العداد يمثل 2.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "0-4"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m1", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 3 على العداد.",
    operands: [3], operation: "build", result: 3,
    solution: "ارفع 3 خرزات سفلية معًا بالإبهام. العداد يمثل 3.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5500, expected_anzan_ms: 3300,
    tags: ["representation", "0-4"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m1", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 4 على العداد.",
    operands: [4], operation: "build", result: 4,
    solution: "ارفع 4 خرزات سفلية معًا بالإبهام. العداد يمثل 4.",
    movement: "direct", difficulty: 1,
    expected_time_ms: 5500, expected_anzan_ms: 3300,
    tags: ["representation", "0-4"],
  }),

  // ─── m2: تمثيل 5 ───

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 1, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 5 على العداد.",
    operands: [5], operation: "build", result: 5,
    solution: "أنزل الخرزة العلوية بالسبابة نحو العارضة. اترك الخرزات السفلية بعيدة. العداد يمثل 5.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "five"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 5 على العداد.",
    operands: [5], operation: "build", result: 5,
    solution: "أنزل الخرزة العلوية بالسبابة نحو العارضة. العداد يمثل 5.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["representation", "five"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "أنزل الخرزة العلوية في الآحاد. ما الرقم الممثل؟",
    operands: [5], operation: "read", result: 5,
    solution: "الخرزة العلوية الملامسة للعارضة = 5. القيمة 5.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 5000, expected_anzan_ms: 3000,
    tags: ["reading", "five"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "العداد يمثل 5. أعده إلى الصفر.",
    operands: [5, 0], operation: "build", result: 0,
    solution: "ارفع الخرزة العلوية بالسبابة بعيدًا عن العارضة. العداد يمثل 0.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 5500, expected_anzan_ms: 3300,
    tags: ["transition", "five"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m2", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 5 على العداد.",
    operands: [5], operation: "build", result: 5,
    solution: "أنزل الخرزة العلوية بالسبابة. العداد يمثل 5.",
    movement: "direct", difficulty: 2,
    expected_time_ms: 4500, expected_anzan_ms: 2700,
    tags: ["representation", "five"],
  }),

  // ─── m3: تمثيل 6-9 ───

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 1, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 6 على العداد.",
    operands: [6], operation: "build", result: 6,
    solution: "حركة القرص: أنزل العلوية (5) وارفع خرزة سفلية (1) معًا. العداد يمثل 6.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 6000, expected_anzan_ms: 3600,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 7 على العداد.",
    operands: [7], operation: "build", result: 7,
    solution: "حركة القرص: أنزل العلوية (5) وارفع خرزتين سفليتين (2) معًا. العداد يمثل 7.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 6500, expected_anzan_ms: 3900,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 8 على العداد.",
    operands: [8], operation: "build", result: 8,
    solution: "حركة القرص: أنزل العلوية (5) وارفع 3 سفليات (3) معًا. العداد يمثل 8.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 6500, expected_anzan_ms: 3900,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 9 على العداد.",
    operands: [9], operation: "build", result: 9,
    solution: "حركة القرص: أنزل العلوية (5) وارفع 4 سفليات (4) معًا. العداد يمثل 9.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 7000, expected_anzan_ms: 4200,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S01", module: "m3", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 7 على العداد.",
    operands: [7], operation: "build", result: 7,
    solution: "حركة القرص: أنزل العلوية (5) وارفع خرزتين سفليتين (2) معًا. العداد يمثل 7.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 6000, expected_anzan_ms: 3600,
    tags: ["representation", "six-nine", "pinch"],
  }),

  // ═══════════════════════════════════════════════════════════
  // 📖 S02 — القيمة المكانية
  // ═══════════════════════════════════════════════════════════

  // ─── m1: آحاد وعشرات (0-99) ───

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 1, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 40 على العداد.",
    operands: [40], operation: "build", result: 40,
    solution: "في العشرات: ارفع 4 سفليات بالإبهام = 40. في الآحاد: اتركه فارغًا (0).",
    movement: "direct", difficulty: 3,
    expected_time_ms: 7000, expected_anzan_ms: 4200,
    tags: ["place-value", "tens"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 25 على العداد.",
    operands: [25], operation: "build", result: 25,
    solution: "العشرات: ارفع خرزتين سفليتين = 20. الآحاد: أنزل العلوية = 5. النتيجة 25.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 7000, expected_anzan_ms: 4200,
    tags: ["place-value", "tens"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 63 على العداد.",
    operands: [63], operation: "build", result: 63,
    solution: "العشرات: قرص = العلوية (5) + سفليه (1) = 60. الآحاد: 3 سفليات. النتيجة 63.",
    movement: "direct", difficulty: 3,
    expected_time_ms: 8000, expected_anzan_ms: 4800,
    tags: ["place-value", "tens", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 19 على العداد.",
    operands: [19], operation: "build", result: 19,
    solution: "العشرات: سفليه واحدة = 10. الآحاد: قرص = علوية (5) + 4 سفليات = 9. النتيجة 19.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 8000, expected_anzan_ms: 4800,
    tags: ["place-value", "tens", "pinch"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m1", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 87 على العداد.",
    operands: [87], operation: "build", result: 87,
    solution: "العشرات: قرص = 5 + 3 = 80. الآحاد: قرص = 5 + 2 = 7. النتيجة 87.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 9000, expected_anzan_ms: 5400,
    tags: ["place-value", "tens", "pinch"],
  }),

  // ─── m2: مئات وآلاف (100-9999) ───

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 1, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 100 على العداد.",
    operands: [100], operation: "build", result: 100,
    solution: "في المئات: ارفع خرزة سفلية واحدة = 100. باقي الأعمدة فارغة.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 9000, expected_anzan_ms: 5400,
    tags: ["place-value", "hundreds"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 2, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 300 على العداد.",
    operands: [300], operation: "build", result: 300,
    solution: "في المئات: ارفع 3 سفليات = 300. باقي الأعمدة فارغة.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 9000, expected_anzan_ms: 5400,
    tags: ["place-value", "hundreds"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 3, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 500 على العداد.",
    operands: [500], operation: "build", result: 500,
    solution: "في المئات: أنزل العلوية = 500.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 8000, expected_anzan_ms: 4800,
    tags: ["place-value", "hundreds"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 4, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 1000 على العداد.",
    operands: [1000], operation: "build", result: 1000,
    solution: "في الآلاف: ارفع خرزة سفلية واحدة = 1000. باقي الأعمدة فارغة.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 9000, expected_anzan_ms: 5400,
    tags: ["place-value", "thousands"],
  }),

  makeQuestion({
    level: "L0", section: "S02", module: "m2", sequence: 5, variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 1500 على العداد.",
    operands: [1500], operation: "build", result: 1500,
    solution: "الآلاف: سفليه واحدة = 1000. المئات: أنزل العلوية = 500. النتيجة 1500.",
    movement: "direct", difficulty: 4,
    expected_time_ms: 10000, expected_anzan_ms: 6000,
    tags: ["place-value", "thousands"],
  }),
];

export default L0_QUESTIONS;