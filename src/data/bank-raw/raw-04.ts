// src/data/bank-raw/raw-04.ts
// الأسئلة 141-200 — أقسام 8-10

import type { RawQuestion } from "./types";
import { SECTIONS } from "./types";

export const RAW_QUESTIONS_04: RawQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // القسم الثامن: الفواصل العشرية (141-160)
  // ═══════════════════════════════════════════════════════════
  { id: 141, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.2 × 0.8", solution: "K1=0, K2=0 → K=0. الضرب: 2 × 8 = 16. نضع الفاصلة قبل رقمين.", result: "0.16" },
  { id: 142, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.04 × 0.7", solution: "K1=-1, K2=0 → K=-1. الضرب: 4 × 7 = 28. صفر بعد الفاصلة.", result: "0.028" },
  { id: 143, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.03 × 0.09", solution: "K1=-1, K2=-1 → K=-2. الضرب: 3 × 9 = 27. صفرين بعد الفاصلة.", result: "0.0027" },
  { id: 144, section: SECTIONS.S8, targetTime: [5000, 8000], question: "1.5 × 0.04", solution: "K1=1, K2=-1 → K=0. الضرب: 15 × 4 = 60.", result: "0.06" },
  { id: 145, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.25 × 0.6", solution: "K1=0, K2=0 → K=0. الضرب: 25 × 6 = 150.", result: "0.15" },
  { id: 146, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.36 ÷ 0.4", solution: "K1=0, K2=0 → K=0. القسمة: 36 ÷ 4 = 9.", result: "0.9" },
  { id: 147, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.081 ÷ 0.09", solution: "K1=-1, K2=-1 → K=0. القسمة: 81 ÷ 9 = 9.", result: "0.9" },
  { id: 148, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.0042 ÷ 0.06", solution: "K1=-2, K2=-1 → K=-1. القسمة: 42 ÷ 6 = 7.", result: "0.07" },
  { id: 149, section: SECTIONS.S8, targetTime: [5000, 8000], question: "3.6 ÷ 0.04", solution: "K1=1, K2=-1 → K=2. القسمة: 36 ÷ 4 = 9. موقع الخانة 2 = عددين صحيحين.", result: "90" },
  { id: 150, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.225 ÷ 1.5", solution: "K1=0, K2=1 → K=-1. القسمة: 225 ÷ 15 = 15.", result: "0.15" },
  { id: 151, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.7 × 0.9", solution: "K1=0, K2=0 → K=0. الضرب: 7 × 9 = 63.", result: "0.63" },
  { id: 152, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.06 × 0.8", solution: "K1=-1, K2=0 → K=-1. الضرب: 6 × 8 = 48.", result: "0.048" },
  { id: 153, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.05 × 0.03", solution: "K1=-1, K2=-1 → K=-2. الضرب: 5 × 3 = 15.", result: "0.0015" },
  { id: 154, section: SECTIONS.S8, targetTime: [5000, 8000], question: "2.4 × 0.05", solution: "K1=1, K2=-1 → K=0. الضرب: 24 × 5 = 120.", result: "0.12" },
  { id: 155, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.45 × 0.2", solution: "K1=0, K2=0 → K=0. الضرب: 45 × 2 = 90.", result: "0.09" },
  { id: 156, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.56 ÷ 0.7", solution: "K1=0, K2=0 → K=0. القسمة: 56 ÷ 7 = 8.", result: "0.8" },
  { id: 157, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.064 ÷ 0.08", solution: "K1=-1, K2=-1 → K=0. القسمة: 64 ÷ 8 = 8.", result: "0.8" },
  { id: 158, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.0054 ÷ 0.09", solution: "K1=-2, K2=-1 → K=-1. القسمة: 54 ÷ 9 = 6.", result: "0.06" },
  { id: 159, section: SECTIONS.S8, targetTime: [5000, 8000], question: "4.8 ÷ 0.06", solution: "K1=1, K2=-1 → K=2. القسمة: 48 ÷ 6 = 8.", result: "80" },
  { id: 160, section: SECTIONS.S8, targetTime: [5000, 8000], question: "0.196 ÷ 1.4", solution: "K1=0, K2=1 → K=-1. القسمة: 196 ÷ 14 = 14.", result: "0.14" },

  // ═══════════════════════════════════════════════════════════
  // القسم التاسع: الجذور التربيعية (161-180)
  // ═══════════════════════════════════════════════════════════
  { id: 161, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(169)", solution: "الزوج الأول 1 → الناتج 1. الباقي 69. المزدوج 2. 69 ÷ 23 = 3.", result: "13" },
  { id: 162, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(196)", solution: "الزوج الأول 1 → الناتج 1. الباقي 96. المزدوج 2. 96 ÷ 24 = 4.", result: "14" },
  { id: 163, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(225)", solution: "الزوج الأول 2 → أقرب مربع 1. الباقي 125. المزدوج 2. 125 ÷ 25 = 5.", result: "15" },
  { id: 164, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(289)", solution: "الزوج الأول 2 → أقرب مربع 1. الباقي 189. المزدوج 2. 189 ÷ 27 = 7.", result: "17" },
  { id: 165, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(324)", solution: "الزوج الأول 3 → أقرب مربع 1. الباقي 224. المزدوج 2. 224 ÷ 28 = 8.", result: "18" },
  { id: 166, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(441)", solution: "الزوج الأول 4 → أقرب مربع 4. الباقي 41. المزدوج 4. 41 ÷ 41 = 1.", result: "21" },
  { id: 167, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(529)", solution: "الزوج الأول 5 → أقرب مربع 4. الباقي 129. المزدوج 4. 129 ÷ 43 = 3.", result: "23" },
  { id: 168, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(784)", solution: "الزوج الأول 7 → أقرب مربع 4. الباقي 384. المزدوج 4. 384 ÷ 48 = 8.", result: "28" },
  { id: 169, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(961)", solution: "الزوج الأول 9 → أقرب مربع 9. الباقي 61. المزدوج 6. 61 ÷ 61 = 1.", result: "31" },
  { id: 170, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(1156)", solution: "الزوج الأول 11 → أقرب مربع 9. الباقي 256. المزدوج 6. 256 ÷ 64 = 4.", result: "34" },
  { id: 171, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(1296)", solution: "الزوج الأول 12 → أقرب مربع 9. الباقي 396. المزدوج 6. 396 ÷ 66 = 6.", result: "36" },
  { id: 172, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(1521)", solution: "الزوج الأول 15 → أقرب مربع 9. الباقي 621. المزدوج 6. 621 ÷ 69 = 9.", result: "39" },
  { id: 173, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(1764)", solution: "الزوج الأول 17 → أقرب مربع 16. الباقي 164. المزدوج 8. 164 ÷ 82 = 2.", result: "42" },
  { id: 174, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(2304)", solution: "الزوج الأول 23 → أقرب مربع 16. الباقي 704. المزدوج 8. 704 ÷ 88 = 8.", result: "48" },
  { id: 175, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(2916)", solution: "الزوج الأول 29 → أقرب مربع 25. الباقي 416. المزدوج 10. 416 ÷ 104 = 4.", result: "54" },
  { id: 176, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(3364)", solution: "الزوج الأول 33 → أقرب مربع 25. الباقي 864. المزدوج 10. 864 ÷ 108 = 8.", result: "58" },
  { id: 177, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(3844)", solution: "الزوج الأول 38 → أقرب مربع 36. الباقي 244. المزدوج 12. 244 ÷ 122 = 2.", result: "62" },
  { id: 178, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(4624)", solution: "الزوج الأول 46 → أقرب مربع 36. الباقي 1024. المزدوج 12. 1024 ÷ 128 = 8.", result: "68" },
  { id: 179, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(5329)", solution: "الزوج الأول 53 → أقرب مربع 49. الباقي 429. المزدوج 14. 429 ÷ 143 = 3.", result: "73" },
  { id: 180, section: SECTIONS.S9, targetTime: [6000, 10000], question: "جذر(6889)", solution: "الزوج الأول 68 → أقرب مربع 64. الباقي 489. المزدوج 16. 489 ÷ 163 = 3.", result: "83" },

  // ═══════════════════════════════════════════════════════════
  // القسم العاشر: الجذور التكعيبية (181-200)
  // ═══════════════════════════════════════════════════════════
  { id: 181, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(2197)", solution: "المجموعة الأولى 2 → أقرب مكعب 1. الآحاد 7 → آحاده 3.", result: "13" },
  { id: 182, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(2744)", solution: "المجموعة الأولى 2 → أقرب مكعب 1. الآحاد 4 → آحاده 4.", result: "14" },
  { id: 183, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(3375)", solution: "المجموعة الأولى 3 → أقرب مكعب 1. الآحاد 5 → آحاده 5.", result: "15" },
  { id: 184, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(4913)", solution: "المجموعة الأولى 4 → أقرب مكعب 1. الآحاد 3 → آحاده 7.", result: "17" },
  { id: 185, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(5832)", solution: "المجموعة الأولى 5 → أقرب مكعب 1. الآحاد 2 → آحاده 8.", result: "18" },
  { id: 186, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(9261)", solution: "المجموعة الأولى 9 → أقرب مكعب 8. الآحاد 1 → آحاده 1.", result: "21" },
  { id: 187, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(12167)", solution: "المجموعة الأولى 12 → أقرب مكعب 8. الآحاد 7 → آحاده 3.", result: "23" },
  { id: 188, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(21952)", solution: "المجموعة الأولى 21 → أقرب مكعب 8. الآحاد 2 → آحاده 8.", result: "28" },
  { id: 189, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(29791)", solution: "المجموعة الأولى 29 → أقرب مكعب 27. الآحاد 1 → آحاده 1.", result: "31" },
  { id: 190, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(39304)", solution: "المجموعة الأولى 39 → أقرب مكعب 27. الآحاد 4 → آحاده 4.", result: "34" },
  { id: 191, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(50653)", solution: "المجموعة الأولى 50 → أقرب مكعب 27. الآحاد 3 → آحاده 7.", result: "37" },
  { id: 192, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(68921)", solution: "المجموعة الأولى 68 → أقرب مكعب 64. الآحاد 1 → آحاده 1.", result: "41" },
  { id: 193, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(79507)", solution: "المجموعة الأولى 79 → أقرب مكعب 64. الآحاد 7 → آحاده 3.", result: "43" },
  { id: 194, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(103823)", solution: "المجموعة الأولى 103 → أقرب مكعب 64. الآحاد 3 → آحاده 7.", result: "47" },
  { id: 195, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(140608)", solution: "المجموعة الأولى 140 → أقرب مكعب 125. الآحاد 8 → آحاده 2.", result: "52" },
  { id: 196, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(185193)", solution: "المجموعة الأولى 185 → أقرب مكعب 125. الآحاد 3 → آحاده 7.", result: "57" },
  { id: 197, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(238328)", solution: "المجموعة الأولى 238 → أقرب مكعب 216. الآحاد 8 → آحاده 2.", result: "62" },
  { id: 198, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر_تكعيبي(300763)", solution: "المجموعة الأولى 300 → أقرب مكعب 216. الآحاد 3 → آحاده 7.", result: "67" },
  { id: 199, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر(26)", solution: "أقرب مربع 25 (جذره 5). الباقي 1. الصيغة: 5 + (1/10).", result: "5.099" },
  { id: 200, section: SECTIONS.S10, targetTime: [5000, 12000], question: "جذر(37)", solution: "أقرب مربع 36 (جذره 6). الباقي 1. الصيغة: 6 + (1/12).", result: "6.083" },
];