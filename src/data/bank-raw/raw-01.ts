// src/data/bank-raw/raw-01.ts
// الأسئلة 1-60 — أقسام 1-3

import type { RawQuestion } from "./types";
import { SECTIONS } from "./types";

export const RAW_QUESTIONS_01: RawQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // القسم الأول: الجمع والطرح البسيط (1-20)
  // ═══════════════════════════════════════════════════════════
  { id: 1, section: SECTIONS.S1, targetTime: [2000, 3000], question: "1 + 2 + 5 - 3", solution: "نرفع 1 بالإبهام، نضيف 2 بالإبهام، ننزل 5 بالسبابة، نطرح 3 بالسبابة.", result: "5" },
  { id: 2, section: SECTIONS.S1, targetTime: [2000, 3000], question: "3 + 1 - 2 + 5", solution: "نرفع 3 بالإبهام، نضيف 1 بالإبهام، نطرح 2 بالسبابة، ننزل 5 بالسبابة.", result: "7" },
  { id: 3, section: SECTIONS.S1, targetTime: [2000, 3000], question: "2 + 2 - 1 + 5", solution: "نرفع 2 بالإبهام، نضيف 2 بالإبهام، نطرح 1 بالسبابة، ننزل 5 بالسبابة.", result: "8" },
  { id: 4, section: SECTIONS.S1, targetTime: [2000, 3000], question: "5 + 3 - 1 + 2", solution: "ننزل 5 بالسبابة، نضيف 3 بالإبهام، نطرح 1 بالسبابة، نضيف 2 بالإبهام.", result: "9" },
  { id: 5, section: SECTIONS.S1, targetTime: [2000, 3000], question: "7 - 2 + 3 - 5", solution: "نُمثل 7 (5 علوية و2 سفلية)، نطرح 2 بالسبابة، نضيف 3 بالإبهام، نطرح 5 بالسبابة.", result: "3" },
  { id: 6, section: SECTIONS.S1, targetTime: [2000, 3000], question: "8 - 5 + 1 + 5", solution: "نُمثل 8، نطرح 5 بالسبابة، نضيف 1 بالإبهام، ننزل 5 بالسبابة.", result: "9" },
  { id: 7, section: SECTIONS.S1, targetTime: [2000, 3000], question: "6 + 2 - 3 + 1", solution: "نُمثل 6 (5 علوية و1 سفلي)، نضيف 2 بالإبهام، نطرح 3 بالسبابة، نضيف 1 بالإبهام.", result: "6" },
  { id: 8, section: SECTIONS.S1, targetTime: [2000, 3000], question: "9 - 4 + 2 - 5", solution: "نُمثل 9، نطرح 4 بالسبابة، نضيف 2 بالإبهام، نطرح 5 بالسبابة.", result: "2" },
  { id: 9, section: SECTIONS.S1, targetTime: [2000, 3000], question: "4 - 3 + 5 + 2", solution: "نرفع 4 بالإبهام، نطرح 3 بالسبابة، ننزل 5 بالسبابة، نضيف 2 بالإبهام.", result: "8" },
  { id: 10, section: SECTIONS.S1, targetTime: [2000, 3000], question: "12 + 2 + 5 - 4", solution: "نُمثل 12 (1 عشرات و2 آحاد)، نضيف 2 في الآحاد، ننزل 5 بالسبابة، نطرح 4.", result: "15" },
  { id: 11, section: SECTIONS.S1, targetTime: [2000, 3000], question: "11 + 3 + 5 - 2", solution: "نُمثل 11، نضيف 3 في الآحاد بالإبهام، ننزل 5 بالسبابة، نطرح 2.", result: "17" },
  { id: 12, section: SECTIONS.S1, targetTime: [2000, 3000], question: "16 - 5 + 3 - 2", solution: "نُمثل 16، نطرح 5 من الآحاد، نضيف 3 بالإبهام، نطرح 2 بالسبابة.", result: "12" },
  { id: 13, section: SECTIONS.S1, targetTime: [2000, 3000], question: "18 - 6 + 2 + 5", solution: "نُمثل 18، نطرح 6 (5 و1)، نضيف 2 بالإبهام، ننزل 5 بالسبابة.", result: "19" },
  { id: 14, section: SECTIONS.S1, targetTime: [2000, 3000], question: "21 + 3 + 5 - 4", solution: "نُمثل 21، نضيف 3 في الآحاد، ننزل 5، نطرح 4.", result: "25" },
  { id: 15, section: SECTIONS.S1, targetTime: [2000, 3000], question: "32 + 2 + 5 - 1", solution: "نُمثل 32، نضيف 2 في الآحاد، ننزل 5 بالسبابة، نطرح 1 بالسبابة.", result: "38" },
  { id: 16, section: SECTIONS.S1, targetTime: [2000, 3000], question: "43 - 2 + 5 - 1", solution: "نُمثل 43، نطرح 2 بالسبابة، ننزل 5 بالسبابة، نطرح 1 بالسبابة.", result: "45" },
  { id: 17, section: SECTIONS.S1, targetTime: [2000, 3000], question: "51 + 3 + 5 - 4", solution: "نُمثل 51، نضيف 3، ننزل 5، نطرح 4.", result: "55" },
  { id: 18, section: SECTIONS.S1, targetTime: [2000, 3000], question: "62 + 2 - 1 + 5", solution: "نُمثل 62، نضيف 2 بالإبهام، نطرح 1 بالسبابة، ننزل 5 بالسبابة.", result: "68" },
  { id: 19, section: SECTIONS.S1, targetTime: [2000, 3000], question: "74 - 3 + 1 + 5", solution: "نُمثل 74، نطرح 3 بالسبابة، نضيف 1 بالإبهام، ننزل 5 بالسبابة.", result: "77" },
  { id: 20, section: SECTIONS.S1, targetTime: [2000, 3000], question: "85 + 3 - 2 + 1", solution: "نُمثل 85، نضيف 3 في الآحاد، نطرح 2 بالسبابة، نضيف 1 بالإبهام.", result: "87" },

  // ═══════════════════════════════════════════════════════════
  // القسم الثاني: أصدقاء العدد 5 (21-40)
  // ═══════════════════════════════════════════════════════════
  { id: 21, section: SECTIONS.S2, targetTime: [3000, 4000], question: "3 + 4", solution: "لإضافة 4، ننزل القائد 5 بالسبابة ونطرح الصديق 1 بالسبابة (+5 - 1).", result: "7" },
  { id: 22, section: SECTIONS.S2, targetTime: [3000, 4000], question: "2 + 3", solution: "لإضافة 3، ننزل القائد 5 ونطرح الصديق 2 (+5 - 2).", result: "5" },
  { id: 23, section: SECTIONS.S2, targetTime: [3000, 4000], question: "1 + 4", solution: "لإضافة 4، ننزل القائد 5 ونطرح الصديق 1 (+5 - 1).", result: "5" },
  { id: 24, section: SECTIONS.S2, targetTime: [3000, 4000], question: "4 + 3", solution: "لإضافة 3، ننزل القائد 5 ونطرح الصديق 2 (+5 - 2).", result: "7" },
  { id: 25, section: SECTIONS.S2, targetTime: [3000, 4000], question: "3 + 2", solution: "لإضافة 2، ننزل القائد 5 ونطرح الصديق 3 (+5 - 3).", result: "5" },
  { id: 26, section: SECTIONS.S2, targetTime: [3000, 4000], question: "8 - 4", solution: "لطرح 4 من 8، نرفع الصديق 1 سفلي ونرفع الخمسة العلوية (+1 - 5).", result: "4" },
  { id: 27, section: SECTIONS.S2, targetTime: [3000, 4000], question: "7 - 3", solution: "لطرح 3 من 7، نرفع الصديق 2 سفلي ونرفع الخمسة العلوية (+2 - 5).", result: "4" },
  { id: 28, section: SECTIONS.S2, targetTime: [3000, 4000], question: "6 - 2", solution: "لطرح 2 من 6، نرفع الصديق 3 سفلي ونرفع الخمسة العلوية (+3 - 5).", result: "4" },
  { id: 29, section: SECTIONS.S2, targetTime: [3000, 4000], question: "5 - 4", solution: "لطرح 4 من 5، نرفع الصديق 1 سفلي ونرفع الخمسة العلوية (+1 - 5).", result: "1" },
  { id: 30, section: SECTIONS.S2, targetTime: [3000, 4000], question: "5 - 3", solution: "لطرح 3 من 5، نرفع الصديق 2 سفلي ونرفع الخمسة العلوية (+2 - 5).", result: "2" },
  { id: 31, section: SECTIONS.S2, targetTime: [3000, 4000], question: "14 + 3 - 4", solution: "14 + 3 (+5 - 2 = 17)، ثم لطرح 4 نطرح 5 ونضيف 1 (+1 - 5).", result: "13" },
  { id: 32, section: SECTIONS.S2, targetTime: [3000, 4000], question: "23 + 4", solution: "نُمثل 23، نضيف 4 في الآحاد عبر تنزيل 5 وطرح 1 (+5 - 1).", result: "27" },
  { id: 33, section: SECTIONS.S2, targetTime: [3000, 4000], question: "34 + 2", solution: "نُمثل 34، نضيف 2 في الآحاد عبر تنزيل 5 وطرح 3 (+5 - 3).", result: "36" },
  { id: 34, section: SECTIONS.S2, targetTime: [3000, 4000], question: "41 + 4", solution: "نُمثل 41، نضيف 4 في الآحاد عبر تنزيل 5 وطرح 1 (+5 - 1).", result: "45" },
  { id: 35, section: SECTIONS.S2, targetTime: [3000, 4000], question: "25 - 3", solution: "نُمثل 25، لطرح 3 نرفع 2 بالإبهام ونرفع 5 بالسبابة (+2 - 5).", result: "22" },
  { id: 36, section: SECTIONS.S2, targetTime: [3000, 4000], question: "35 - 2", solution: "نُمثل 35، لطرح 2 نرفع 3 بالإبهام ونرفع 5 بالسبابة (+3 - 5).", result: "33" },
  { id: 37, section: SECTIONS.S2, targetTime: [3000, 4000], question: "45 - 4", solution: "نُمثل 45، لطرح 4 نرفع 1 بالإبهام ونرفع 5 بالسبابة (+1 - 5).", result: "41" },
  { id: 38, section: SECTIONS.S2, targetTime: [3000, 4000], question: "13 + 3 + 3", solution: "13 + 3 (+5 - 2 = 16)، ثم + 3 إضافة مباشرة.", result: "19" },
  { id: 39, section: SECTIONS.S2, targetTime: [3000, 4000], question: "22 + 4 - 3", solution: "22 + 4 (+5 - 1 = 26)، ثم - 3 طرح مباشر من الخرزات السفلية.", result: "23" },
  { id: 40, section: SECTIONS.S2, targetTime: [3000, 4000], question: "33 + 4 - 2", solution: "33 + 4 (+5 - 1 = 37)، ثم - 2 طرح مباشر من الآحاد.", result: "35" },

  // ═══════════════════════════════════════════════════════════
  // القسم الثالث: أصدقاء العدد 10 (41-60)
  // ═══════════════════════════════════════════════════════════
  { id: 41, section: SECTIONS.S3, targetTime: [3000, 5000], question: "8 + 3", solution: "نضيف 1 في العشرات ونطرح صديق 3 وهو 7 من الآحاد (+10 - 7).", result: "11" },
  { id: 42, section: SECTIONS.S3, targetTime: [3000, 5000], question: "7 + 4", solution: "نضيف 1 في العشرات ونطرح صديق 4 وهو 6 من الآحاد (+10 - 6).", result: "11" },
  { id: 43, section: SECTIONS.S3, targetTime: [3000, 5000], question: "6 + 5", solution: "نضيف 1 في العشرات ونطرح صديق 5 وهو 5 من الآحاد (+10 - 5).", result: "11" },
  { id: 44, section: SECTIONS.S3, targetTime: [3000, 5000], question: "9 + 4", solution: "نضيف 1 في العشرات ونطرح صديق 4 وهو 6 من الآحاد (+10 - 6).", result: "13" },
  { id: 45, section: SECTIONS.S3, targetTime: [3000, 5000], question: "8 + 5", solution: "نضيف 1 في العشرات ونطرح صديق 5 وهو 5 من الآحاد (+10 - 5).", result: "13" },
  { id: 46, section: SECTIONS.S3, targetTime: [3000, 5000], question: "7 + 6", solution: "نضيف 1 في العشرات ونطرح صديق 6 وهو 4 من الآحاد (+10 - 4).", result: "13" },
  { id: 47, section: SECTIONS.S3, targetTime: [3000, 5000], question: "9 + 8", solution: "نضيف 1 في العشرات ونطرح صديق 8 وهو 2 من الآحاد (+10 - 2).", result: "17" },
  { id: 48, section: SECTIONS.S3, targetTime: [3000, 5000], question: "8 + 8", solution: "نضيف 1 في العشرات ونطرح صديق 8 وهو 2 من الآحاد (+10 - 2).", result: "16" },
  { id: 49, section: SECTIONS.S3, targetTime: [3000, 5000], question: "7 + 7", solution: "نضيف 1 في العشرات ونطرح صديق 7 وهو 3 من الآحاد (+10 - 3).", result: "14" },
  { id: 50, section: SECTIONS.S3, targetTime: [3000, 5000], question: "6 + 6", solution: "نضيف 1 في العشرات ونطرح صديق 6 وهو 4 من الآحاد (+10 - 4).", result: "12" },
  { id: 51, section: SECTIONS.S3, targetTime: [3000, 5000], question: "11 - 3", solution: "نطرح 10 من العشرات ونضيف صديق 3 وهو 7 في الآحاد (-10 + 7).", result: "8" },
  { id: 52, section: SECTIONS.S3, targetTime: [3000, 5000], question: "12 - 4", solution: "نطرح 10 من العشرات ونضيف صديق 4 وهو 6 في الآحاد (-10 + 6).", result: "8" },
  { id: 53, section: SECTIONS.S3, targetTime: [3000, 5000], question: "13 - 6", solution: "نطرح 10 من العشرات ونضيف صديق 6 وهو 4 في الآحاد (-10 + 4).", result: "7" },
  { id: 54, section: SECTIONS.S3, targetTime: [3000, 5000], question: "14 - 8", solution: "نطرح 10 من العشرات ونضيف صديق 8 وهو 2 في الآحاد (-10 + 2).", result: "6" },
  { id: 55, section: SECTIONS.S3, targetTime: [3000, 5000], question: "15 - 9", solution: "نطرح 10 من العشرات ونضيف صديق 9 وهو 1 في الآحاد (-10 + 1).", result: "6" },
  { id: 56, section: SECTIONS.S3, targetTime: [3000, 5000], question: "16 - 7", solution: "نطرح 10 من العشرات ونضيف صديق 7 وهو 3 في الآحاد (-10 + 3).", result: "9" },
  { id: 57, section: SECTIONS.S3, targetTime: [3000, 5000], question: "17 - 8", solution: "نطرح 10 من العشرات ونضيف صديق 8 وهو 2 في الآحاد (-10 + 2).", result: "9" },
  { id: 58, section: SECTIONS.S3, targetTime: [3000, 5000], question: "18 - 9", solution: "نطرح 10 من العشرات ونضيف صديق 9 وهو 1 في الآحاد (-10 + 1).", result: "9" },
  { id: 59, section: SECTIONS.S3, targetTime: [3000, 5000], question: "29 + 3", solution: "نضيف 10 في العشرات (تصبح 30) ونطرح 7 من الآحاد (+10 - 7).", result: "32" },
  { id: 60, section: SECTIONS.S3, targetTime: [3000, 5000], question: "45 - 8", solution: "نطرح 10 من العشرات (تصبح 30) ونضيف 2 في الآحاد (-10 + 2).", result: "37" },
];