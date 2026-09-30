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
// ═══════════════════════════════════════════════════════════════════

import { makeQuestion } from "../generateId";
import type { SRBQuestion } from "../types";

export const L0_QUESTIONS: SRBQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // 📖 S01 — تمثيل الأرقام 0-9
  // ═══════════════════════════════════════════════════════════

  // ─── m1: تمثيل 0-4 (خرزات سفلية) ───

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m1",
    sequence: 1,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 0 على العداد.",
    operands: [0],
    operation: "build",
    result: 0,
    solution:
      "سبب الاختيار: تمثيل الصفر (لا خرزات ملامسة للعارضة). لا ترفع أي خرزة سفلية. لا تُنزل الخرزة العلوية. جميع الخرزات بعيدة عن العارضة الفاصلة. العداد يمثل 0.",
    movement: "direct",
    difficulty: 1,
    expected_time_ms: 3000,
    expected_anzan_ms: 2000,
    tags: ["representation", "zero", "0-4"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m1",
    sequence: 2,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 1 على العداد.",
    operands: [1],
    operation: "build",
    result: 1,
    solution:
      "سبب الاختيار: عدد صغير (1-4) يُرفع بالخرزات السفلية فقط. ارفع خرزة سفلية واحدة بالإبهام نحو العارضة الفاصلة. العداد يمثل 1.",
    movement: "direct",
    difficulty: 1,
    expected_time_ms: 3000,
    expected_anzan_ms: 2000,
    tags: ["representation", "0-4"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m1",
    sequence: 3,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 2 على العداد.",
    operands: [2],
    operation: "build",
    result: 2,
    solution:
      "سبب الاختيار: عدد صغير (1-4) يُرفع بالخرزات السفلية. ارفع خرزتين سفليتين معًا بالإبهام نحو العارضة الفاصلة. العداد يمثل 2.",
    movement: "direct",
    difficulty: 1,
    expected_time_ms: 3000,
    expected_anzan_ms: 2000,
    tags: ["representation", "0-4"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m1",
    sequence: 4,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 3 على العداد.",
    operands: [3],
    operation: "build",
    result: 3,
    solution:
      "سبب الاختيار: عدد صغير (1-4) يُرفع بالخرزات السفلية. ارفع 3 خرزات سفلية معًا بالإبهام نحو العارضة الفاصلة. العداد يمثل 3.",
    movement: "direct",
    difficulty: 1,
    expected_time_ms: 3500,
    expected_anzan_ms: 2200,
    tags: ["representation", "0-4"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m1",
    sequence: 5,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 4 على العداد.",
    operands: [4],
    operation: "build",
    result: 4,
    solution:
      "سبب الاختيار: أكبر عدد في الخرزات السفلية (1-4). ارفع 4 خرزات سفلية معًا بالإبهام نحو العارضة الفاصلة. العداد يمثل 4.",
    movement: "direct",
    difficulty: 1,
    expected_time_ms: 3500,
    expected_anzan_ms: 2200,
    tags: ["representation", "0-4"],
  }),

  // ─── m2: تمثيل 5 (الخرزة العلوية) ───

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m2",
    sequence: 1,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 5 على العداد.",
    operands: [5],
    operation: "build",
    result: 5,
    solution:
      "سبب الاختيار: العدد 5 يمثله الخرزة العلوية فقط. أنزل الخرزة العلوية بالسبابة نحو العارضة الفاصلة. اترك الخرزات السفلية بعيدة عن العارضة. العداد يمثل 5.",
    movement: "direct",
    difficulty: 2,
    expected_time_ms: 3000,
    expected_anzan_ms: 2000,
    tags: ["representation", "five", "upper-bead"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m2",
    sequence: 2,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "العداد يمثل العدد 5. أعده إلى 0.",
    operands: [5, 0],
    operation: "build",
    result: 0,
    solution:
      "سبب الاختيار: إرجاع الخرزة العلوية إلى مكانها. ارفع الخرزة العلوية بالسبابة بعيدًا عن العارضة الفاصلة. العداد يمثل 0.",
    movement: "direct",
    difficulty: 2,
    expected_time_ms: 3000,
    expected_anzan_ms: 2000,
    tags: ["transition", "five", "zero"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m2",
    sequence: 3,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "العداد يمثل العدد 2. حوّله إلى 5.",
    operands: [2, 5],
    operation: "build",
    result: 5,
    solution:
      "سبب الاختيار: انتقال من السفلي إلى العلوي. 1) ارفع الخرزتين السفليتين بالإبهام بعيدًا عن العارضة (-2). 2) أنزل الخرزة العلوية بالسبابة نحو العارضة (+5). العداد يمثل 5.",
    movement: "direct",
    difficulty: 2,
    expected_time_ms: 4000,
    expected_anzan_ms: 2500,
    tags: ["transition", "five"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m2",
    sequence: 4,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "العداد يمثل العدد 4. حوّله إلى 5.",
    operands: [4, 5],
    operation: "build",
    result: 5,
    solution:
      "سبب الاختيار: انتقال من السفلي إلى العلوي. 1) ارفع 4 خرزات سفلية بالإبهام بعيدًا عن العارضة (-4). 2) أنزل الخرزة العلوية بالسبابة نحو العارضة (+5). العداد يمثل 5.",
    movement: "direct",
    difficulty: 2,
    expected_time_ms: 4000,
    expected_anzan_ms: 2500,
    tags: ["transition", "five"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m2",
    sequence: 5,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "أنزل الخرزة العلوية في الآحاد. ما القيمة الممثلة؟",
    operands: [5],
    operation: "read",
    result: 5,
    solution:
      "سبب الاختيار: التعرف على قيمة الخرزة العلوية. الخرزة العلوية الملامسة للعارضة تساوي 5. لا توجد خرزات سفلية ملامسة. القيمة الكلية هي 5.",
    movement: "direct",
    difficulty: 2,
    expected_time_ms: 3000,
    expected_anzan_ms: 2000,
    tags: ["reading", "five"],
  }),

  // ─── m3: تمثيل 6-9 (مزيج علوية + سفلية) ───

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m3",
    sequence: 1,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 6 على العداد.",
    operands: [6],
    operation: "build",
    result: 6,
    solution:
      "سبب الاختيار: عدد مركب (5+1). استخدم حركة القرص: أنزل الخرزة العلوية بالسبابة (5) وارفع خرزة سفلية واحدة بالإبهام (1) معًا نحو العارضة. العداد يمثل 6.",
    movement: "direct",
    difficulty: 3,
    expected_time_ms: 3500,
    expected_anzan_ms: 2200,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m3",
    sequence: 2,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 7 على العداد.",
    operands: [7],
    operation: "build",
    result: 7,
    solution:
      "سبب الاختيار: عدد مركب (5+2). استخدم حركة القرص: أنزل الخرزة العلوية بالسبابة (5) وارفع خرزتين سفليتين بالإبهام (2) معًا نحو العارضة. العداد يمثل 7.",
    movement: "direct",
    difficulty: 3,
    expected_time_ms: 4000,
    expected_anzan_ms: 2500,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m3",
    sequence: 3,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 8 على العداد.",
    operands: [8],
    operation: "build",
    result: 8,
    solution:
      "سبب الاختيار: عدد مركب (5+3). استخدم حركة القرص: أنزل الخرزة العلوية بالسبابة (5) وارفع 3 خرزات سفلية بالإبهام (3) معًا نحو العارضة. العداد يمثل 8.",
    movement: "direct",
    difficulty: 3,
    expected_time_ms: 4000,
    expected_anzan_ms: 2500,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m3",
    sequence: 4,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 9 على العداد.",
    operands: [9],
    operation: "build",
    result: 9,
    solution:
      "سبب الاختيار: أكبر عدد في عمود واحد (5+4). استخدم حركة القرص: أنزل الخرزة العلوية بالسبابة (5) وارفع 4 خرزات سفلية بالإبهام (4) معًا نحو العارضة. العداد يمثل 9.",
    movement: "direct",
    difficulty: 3,
    expected_time_ms: 4500,
    expected_anzan_ms: 3000,
    tags: ["representation", "six-nine", "pinch"],
  }),

  makeQuestion({
    level: "L0",
    section: "S01",
    module: "m3",
    sequence: 5,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "العداد يمثل العدد 5. حوّله إلى 8.",
    operands: [5, 8],
    operation: "build",
    result: 8,
    solution:
      "سبب الاختيار: إضافة سفلية إلى العلوية المفعّلة. الخرزة العلوية (5) مفعّلة. ارفع 3 خرزات سفلية بالإبهام نحو العارضة. 5 + 3 = 8.",
    movement: "direct",
    difficulty: 3,
    expected_time_ms: 3500,
    expected_anzan_ms: 2200,
    tags: ["transition", "six-nine"],
  }),

  // ═══════════════════════════════════════════════════════════
  // 📖 S02 — القيمة المكانية
  // ═══════════════════════════════════════════════════════════

  // ─── m1: الآحاد والعشرات (0-99) ───

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m1",
    sequence: 1,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 40 على العداد.",
    operands: [40],
    operation: "build",
    result: 40,
    solution:
      "سبب الاختيار: عشرات نظيفة (آحاد = 0). 1) في عمود العشرات: ارفع 4 خرزات سفلية بالإبهام = 40. 2) في عمود الآحاد: اتركه فارغًا (0). العداد يمثل 40.",
    movement: "direct",
    difficulty: 3,
    expected_time_ms: 5000,
    expected_anzan_ms: 3000,
    tags: ["place-value", "tens"],
  }),

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m1",
    sequence: 2,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 25 على العداد.",
    operands: [25],
    operation: "build",
    result: 25,
    solution:
      "سبب الاختيار: عشرات + آحاد بخمسة. 1) في العشرات: ارفع خرزتين سفليتين بالإبهام = 20. 2) في الآحاد: أنزل الخرزة العلوية بالسبابة = 5. العداد يمثل 25.",
    movement: "direct",
    difficulty: 3,
    expected_time_ms: 5000,
    expected_anzan_ms: 3000,
    tags: ["place-value", "tens"],
  }),

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m1",
    sequence: 3,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 63 على العداد.",
    operands: [63],
    operation: "build",
    result: 63,
    solution:
      "سبب الاختيار: كل عمود يستخدم حركة القرص. 1) في العشرات: أنزل العلوية (5) وارفع خرزة سفلية (1) معًا = 60. 2) في الآحاد: ارفع 3 خرزات سفلية بالإبهام = 3. العداد يمثل 63.",
    movement: "direct",
    difficulty: 3,
    expected_time_ms: 5500,
    expected_anzan_ms: 3500,
    tags: ["place-value", "tens", "pinch"],
  }),

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m1",
    sequence: 4,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 19 على العداد.",
    operands: [19],
    operation: "build",
    result: 19,
    solution:
      "سبب الاختيار: آحاد مركبة (9). 1) في العشرات: ارفع خرزة سفلية واحدة بالإبهام = 10. 2) في الآحاد: استخدم حركة القرص = أنزل العلوية (5) وارفع 4 سفليات (4) معًا نحو العارضة. العداد يمثل 19.",
    movement: "direct",
    difficulty: 4,
    expected_time_ms: 5500,
    expected_anzan_ms: 3500,
    tags: ["place-value", "tens", "pinch"],
  }),

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m1",
    sequence: 5,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 87 على العداد.",
    operands: [87],
    operation: "build",
    result: 87,
    solution:
      "سبب الاختيار: استخدام حركة القرص في العمودين. 1) في العشرات: أنزل العلوية (5) وارفع 3 سفليات (3) معًا = 80. 2) في الآحاد: أنزل العلوية (5) وارفع خرزتين سفليتين (2) معًا = 7. العداد يمثل 87.",
    movement: "direct",
    difficulty: 4,
    expected_time_ms: 6000,
    expected_anzan_ms: 4000,
    tags: ["place-value", "tens", "pinch"],
  }),

  // ─── m2: المئات والآلاف (100-9999) ───

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m2",
    sequence: 1,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 305 على العداد.",
    operands: [305],
    operation: "build",
    result: 305,
    solution:
      "سبب الاختيار: يحتوي على صفر في العشرات. 1) في المئات: ارفع 3 خرزات سفلية بالإبهام = 300. 2) في العشرات: اتركه فارغًا (0). 3) في الآحاد: أنزل الخرزة العلوية بالسبابة = 5. العداد يمثل 305.",
    movement: "direct",
    difficulty: 4,
    expected_time_ms: 5500,
    expected_anzan_ms: 3500,
    tags: ["place-value", "hundreds", "zero-middle"],
  }),

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m2",
    sequence: 2,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 5000 على العداد.",
    operands: [5000],
    operation: "build",
    result: 5000,
    solution:
      "سبب الاختيار: عدد يبدأ بـ 5 فقط. 1) في الآلاف: أنزل الخرزة العلوية بالسبابة = 5000. 2) اترك أعمدة المئات والعشرات والآحاد فارغة (000). العداد يمثل 5000.",
    movement: "direct",
    difficulty: 4,
    expected_time_ms: 5000,
    expected_anzan_ms: 3000,
    tags: ["place-value", "thousands", "upper-bead"],
  }),

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m2",
    sequence: 3,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 1420 على العداد.",
    operands: [1420],
    operation: "build",
    result: 1420,
    solution:
      "سبب الاختيار: آحاد = 0. 1) في الآلاف: ارفع خرزة سفلية واحدة بالإبهام = 1000. 2) في المئات: ارفع 4 سفليات بالإبهام = 400. 3) في العشرات: ارفع خرزتين سفليتين بالإبهام = 20. 4) في الآحاد: اتركه فارغًا. العداد يمثل 1420.",
    movement: "direct",
    difficulty: 4,
    expected_time_ms: 6500,
    expected_anzan_ms: 4500,
    tags: ["place-value", "thousands"],
  }),

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m2",
    sequence: 4,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 9061 على العداد.",
    operands: [9061],
    operation: "build",
    result: 9061,
    solution:
      "سبب الاختيار: يحتوي على صفر في المئات. 1) في الآلاف: أنزل العلوية (5) وارفع 4 سفليات (4) معًا = 9000. 2) في المئات: اتركه فارغًا (0). 3) في العشرات: أنزل العلوية (5) وارفع خرزة سفلية (1) معًا = 60. 4) في الآحاد: ارفع خرزة سفلية واحدة بالإبهام = 1. العداد يمثل 9061.",
    movement: "direct",
    difficulty: 5,
    expected_time_ms: 6500,
    expected_anzan_ms: 4500,
    tags: ["place-value", "thousands", "zero-middle", "pinch"],
  }),

  makeQuestion({
    level: "L0",
    section: "S02",
    module: "m2",
    sequence: 5,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "مثل العدد 7892 على العداد.",
    operands: [7892],
    operation: "build",
    result: 7892,
    solution:
      "سبب الاختيار: كل الأعمدة غير فارغة. 1) في الآلاف: أنزل العلوية (5) وارفع خرزتين (2) معًا = 7000. 2) في المئات: أنزل العلوية (5) وارفع 3 سفليات (3) معًا = 800. 3) في العشرات: أنزل العلوية (5) وارفع 4 سفليات (4) معًا = 90. 4) في الآحاد: ارفع خرزتين سفليتين بالإبهام = 2. العداد يمثل 7892.",
    movement: "direct",
    difficulty: 5,
    expected_time_ms: 7000,
    expected_anzan_ms: 5000,
    tags: ["place-value", "thousands", "pinch"],
  }),
];

export default L0_QUESTIONS;