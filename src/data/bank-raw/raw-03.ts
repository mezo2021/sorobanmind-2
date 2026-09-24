// src/data/bank-raw/raw-03.ts
// الأسئلة 101-140 — أقسام 6-7

import type { RawQuestion } from "./types";
import { SECTIONS } from "./types";

export const RAW_QUESTIONS_03: RawQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // القسم السادس: القسمة والتخمين (101-120)
  // ═══════════════════════════════════════════════════════════
  { id: 101, section: SECTIONS.S6, targetTime: [6000, 10000], question: "96 ÷ 3", solution: "9 ÷ 3 = 3 (في العشرات)، نطرح 90. المتبقي 6 ÷ 3 = 2 (في الآحاد)، نطرح 6.", result: "32" },
  { id: 102, section: SECTIONS.S6, targetTime: [6000, 10000], question: "144 ÷ 6", solution: "14 ÷ 6 = 2 (في العشرات)، نطرح 120، المتبقي 24 ÷ 6 = 4 (في الآحاد)، نطرح 24.", result: "24" },
  { id: 103, section: SECTIONS.S6, targetTime: [6000, 10000], question: "215 ÷ 5", solution: "21 ÷ 5 = 4 (في العشرات)، نطرح 200، المتبقي 15 ÷ 5 = 3 (في الآحاد)، نطرح 15.", result: "43" },
  { id: 104, section: SECTIONS.S6, targetTime: [6000, 10000], question: "336 ÷ 7", solution: "33 ÷ 7 = 4 (في العشرات)، نطرح 280، المتبقي 56 ÷ 7 = 8 (في الآحاد)، نطرح 56.", result: "48" },
  { id: 105, section: SECTIONS.S6, targetTime: [6000, 10000], question: "504 ÷ 8", solution: "50 ÷ 8 = 6 (في العشرات)، نطرح 480، المتبقي 24 ÷ 8 = 3 (في الآحاد)، نطرح 24.", result: "63" },
  { id: 106, section: SECTIONS.S6, targetTime: [6000, 10000], question: "657 ÷ 9", solution: "65 ÷ 9 = 7 (في العشرات)، نطرح 630، المتبقي 27 ÷ 9 = 3 (في الآحاد)، نطرح 27.", result: "73" },
  { id: 107, section: SECTIONS.S6, targetTime: [6000, 10000], question: "828 ÷ 4", solution: "8 ÷ 4 = 2 (في المئات)، 2 ÷ 4 = 0 (في العشرات)، 28 ÷ 4 = 7 (في الآحاد).", result: "207" },
  { id: 108, section: SECTIONS.S6, targetTime: [6000, 10000], question: "952 ÷ 7", solution: "9 ÷ 7 = 1 (في المئات)، نطرح 700، 25 ÷ 7 = 3 (في العشرات)، نطرح 210، 42 ÷ 7 = 6 (في الآحاد).", result: "136" },
  { id: 109, section: SECTIONS.S6, targetTime: [6000, 10000], question: "1176 ÷ 12", solution: "التخمين الأول 117 ÷ 12 = 9، نطرح 1080، المتبقي 96 ÷ 12 = 8، نطرح 96.", result: "98" },
  { id: 110, section: SECTIONS.S6, targetTime: [6000, 10000], question: "1425 ÷ 15", solution: "التخمين الأول 142 ÷ 15 = 9، نطرح 1350، المتبقي 75 ÷ 15 = 5، نطرح 75.", result: "95" },
  { id: 111, section: SECTIONS.S6, targetTime: [6000, 10000], question: "1728 ÷ 18", solution: "172 ÷ 18 = 9، نطرح 1620، المتبقي 108 ÷ 18 = 6، نطرح 108.", result: "96" },
  { id: 112, section: SECTIONS.S6, targetTime: [6000, 10000], question: "2112 ÷ 22", solution: "211 ÷ 22 = 9، نطرح 1980، المتبقي 132 ÷ 22 = 6، نطرح 132.", result: "96" },
  { id: 113, section: SECTIONS.S6, targetTime: [6000, 10000], question: "2808 ÷ 26", solution: "280 ÷ 26 = 1 (في المئات)، نطرح 2600، المتبقي 208 ÷ 26 = 8 (في الآحاد).", result: "108" },
  { id: 114, section: SECTIONS.S6, targetTime: [6000, 10000], question: "3410 ÷ 31", solution: "341 ÷ 31 = 11، نطرح 3410 المتبقي 0.", result: "110" },
  { id: 115, section: SECTIONS.S6, targetTime: [6000, 10000], question: "4185 ÷ 45", solution: "418 ÷ 45 = 9، نطرح 4050، المتبقي 135 ÷ 45 = 3، نطرح 135.", result: "93" },
  { id: 116, section: SECTIONS.S6, targetTime: [6000, 10000], question: "5376 ÷ 56", solution: "537 ÷ 56 = 9، نطرح 5040، المتبقي 336 ÷ 56 = 6، نطرح 336.", result: "96" },
  { id: 117, section: SECTIONS.S6, targetTime: [6000, 10000], question: "6272 ÷ 64", solution: "627 ÷ 64 = 9، نطرح 5760، المتبقي 512 ÷ 64 = 8، نطرح 512.", result: "98" },
  { id: 118, section: SECTIONS.S6, targetTime: [6000, 10000], question: "7128 ÷ 72", solution: "712 ÷ 72 = 9، نطرح 6480، المتبقي 648 ÷ 72 = 9، نطرح 648.", result: "99" },
  { id: 119, section: SECTIONS.S6, targetTime: [6000, 10000], question: "8019 ÷ 81", solution: "801 ÷ 81 = 9، نطرح 7290، المتبقي 729 ÷ 81 = 9، نطرح 729.", result: "99" },
  { id: 120, section: SECTIONS.S6, targetTime: [6000, 10000], question: "9108 ÷ 92", solution: "910 ÷ 92 = 9، نطرح 8280، المتبقي 828 ÷ 92 = 9، نطرح 828.", result: "99" },

  // ═══════════════════════════════════════════════════════════
  // القسم السابع: الأعداد السالبة (121-140)
  // ═══════════════════════════════════════════════════════════
  { id: 121, section: SECTIONS.S7, targetTime: [6000, 8000], question: "20 - 35", solution: "القيمة على العداد تصبح 85 (بعد استعارة 100). مكمل 85 بالنسبة لـ 100 هو 15.", result: "-15" },
  { id: 122, section: SECTIONS.S7, targetTime: [6000, 8000], question: "32 - 70", solution: "القيمة على العداد تصبح 62 (بعد استعارة 100). مكمل 62 بالنسبة لـ 100 هو 38.", result: "-38" },
  { id: 123, section: SECTIONS.S7, targetTime: [6000, 8000], question: "15 - 48", solution: "القيمة على العداد تصبح 67 (بعد استعارة 100). مكمل 67 بالنسبة لـ 100 هو 33.", result: "-33" },
  { id: 124, section: SECTIONS.S7, targetTime: [6000, 8000], question: "50 - 92", solution: "القيمة على العداد تصبح 58 (بعد استعارة 100). مكمل 58 بالنسبة لـ 100 هو 42.", result: "-42" },
  { id: 125, section: SECTIONS.S7, targetTime: [6000, 8000], question: "18 - 82", solution: "القيمة على العداد تصبح 36 (بعد استعارة 100). مكمل 36 بالنسبة لـ 100 هو 64.", result: "-64" },
  { id: 126, section: SECTIONS.S7, targetTime: [6000, 8000], question: "40 - 115", solution: "القيمة تصبح 925 (بعد استعارة 1000). مكمل 925 بالنسبة لـ 1000 هو 75.", result: "-75" },
  { id: 127, section: SECTIONS.S7, targetTime: [6000, 8000], question: "85 - 200", solution: "القيمة تصبح 885 (بعد استعارة 1000). مكمل 885 بالنسبة لـ 1000 هو 115.", result: "-115" },
  { id: 128, section: SECTIONS.S7, targetTime: [6000, 8000], question: "140 - 320", solution: "القيمة تصبح 820 (بعد استعارة 1000). مكمل 820 بالنسبة لـ 1000 هو 180.", result: "-180" },
  { id: 129, section: SECTIONS.S7, targetTime: [6000, 8000], question: "250 - 600", solution: "القيمة تصبح 650 (بعد استعارة 1000). مكمل 650 بالنسبة لـ 1000 هو 350.", result: "-350" },
  { id: 130, section: SECTIONS.S7, targetTime: [6000, 8000], question: "410 - 850", solution: "القيمة تصبح 560 (بعد استعارة 1000). مكمل 560 بالنسبة لـ 1000 هو 440.", result: "-440" },
  { id: 131, section: SECTIONS.S7, targetTime: [6000, 8000], question: "22 - 65", solution: "القيمة تصبح 57 (بعد استعارة 100). مكمل 57 لـ 100 هو 43.", result: "-43" },
  { id: 132, section: SECTIONS.S7, targetTime: [6000, 8000], question: "14 - 90", solution: "القيمة تصبح 24 (بعد استعارة 100). مكمل 24 لـ 100 هو 76.", result: "-76" },
  { id: 133, section: SECTIONS.S7, targetTime: [6000, 8000], question: "63 - 140", solution: "القيمة تصبح 923 (بعد استعارة 1000). مكمل 923 لـ 1000 هو 77.", result: "-77" },
  { id: 134, section: SECTIONS.S7, targetTime: [6000, 8000], question: "88 - 150", solution: "القيمة تصبح 938 (بعد استعارة 1000). مكمل 938 لـ 1000 هو 62.", result: "-62" },
  { id: 135, section: SECTIONS.S7, targetTime: [6000, 8000], question: "105 - 300", solution: "القيمة تصبح 805 (بعد استعارة 1000). مكمل 805 لـ 1000 هو 195.", result: "-195" },
  { id: 136, section: SECTIONS.S7, targetTime: [6000, 8000], question: "215 - 500", solution: "القيمة تصبح 715 (بعد استعارة 1000). مكمل 715 لـ 1000 هو 285.", result: "-285" },
  { id: 137, section: SECTIONS.S7, targetTime: [6000, 8000], question: "330 - 720", solution: "القيمة تصبح 610 (بعد استعارة 1000). مكمل 610 لـ 1000 هو 390.", result: "-390" },
  { id: 138, section: SECTIONS.S7, targetTime: [6000, 8000], question: "450 - 900", solution: "القيمة تصبح 550 (بعد استعارة 1000). مكمل 550 لـ 1000 هو 450.", result: "-450" },
  { id: 139, section: SECTIONS.S7, targetTime: [6000, 8000], question: "60 - 240", solution: "القيمة تصبح 820 (بعد استعارة 1000). مكمل 820 لـ 1000 هو 180.", result: "-180" },
  { id: 140, section: SECTIONS.S7, targetTime: [6000, 8000], question: "125 - 400", solution: "القيمة تصبح 725 (بعد استعارة 1000). مكمل 725 لـ 1000 هو 275.", result: "-275" },
];