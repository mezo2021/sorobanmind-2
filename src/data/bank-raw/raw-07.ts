// src/data/bank-raw/raw-07.ts
// الأسئلة المتقدمة 361-400 — تمارين متقدمة Part 3
// ├── القسم S15 (ADV_DEC): 361-375 — الأعداد العشرية
// ├── القسم S16 (ADV_NEG): 376-385 — الأعداد السالبة
// └── القسم S17 (ADV_ROOT): 386-400 — الجذور التربيعية

import type { RawQuestion } from "./types";
import { SECTIONS } from "./types";

export const RAW_QUESTIONS_07: RawQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // القسم S15 — العمليات على الأعداد العشرية (361-375)
  // ═══════════════════════════════════════════════════════════
  { id: 361, section: SECTIONS.ADV_DEC, timeText: "30 ثانية", targetTime: [30000, 45000], question: "48.75 + 39.68 - 25.43", result: "63.00", solution: "نحدد عمود الآحاد (Unit Point)." },
  { id: 362, section: SECTIONS.ADV_DEC, timeText: "30 ثانية", targetTime: [30000, 45000], question: "156.4 - 89.75 + 43.82", result: "110.47", solution: "موازنة المراتب العشرية عبر عمود الفاصلة." },
  { id: 363, section: SECTIONS.ADV_DEC, timeText: "35 ثانية", targetTime: [35000, 52500], question: "74.8 × 3.6", result: "269.28", solution: "ضرب عشري (عدد خانات الصحيح = 2+1 = 3)." },
  { id: 364, section: SECTIONS.ADV_DEC, timeText: "35 ثانية", targetTime: [35000, 52500], question: "82.5 × 0.47", result: "38.775", solution: "ضرب في أجزاء من مئة." },
  { id: 365, section: SECTIONS.ADV_DEC, timeText: "35 ثانية", targetTime: [35000, 52500], question: "9.36 × 5.8", result: "54.288", solution: "تجميع خانات اليمين العشرية." },
  { id: 366, section: SECTIONS.ADV_DEC, timeText: "35 ثانية", targetTime: [35000, 52500], question: "147.25 ÷ 3.8", result: "38.75", solution: "قسمة عشرية بإزاحة الفاصلة." },
  { id: 367, section: SECTIONS.ADV_DEC, timeText: "35 ثانية", targetTime: [35000, 52500], question: "589.76 ÷ 7.6", result: "77.6", solution: "تحديد موضع الخارج بالنسبة لنقطة الفاصلة." },
  { id: 368, section: SECTIONS.ADV_DEC, timeText: "30 ثانية", targetTime: [30000, 45000], question: "34.56 × 1.25", result: "43.2", solution: "اختصار الأصفار العشرية النهائية." },
  { id: 369, section: SECTIONS.ADV_DEC, timeText: "30 ثانية", targetTime: [30000, 45000], question: "812.7 - 438.95 + 165.48", result: "539.23", solution: "جمع وطرح الأجزاء العشرية." },
  { id: 370, section: SECTIONS.ADV_DEC, timeText: "35 ثانية", targetTime: [35000, 52500], question: "67.84 ÷ 0.64", result: "106", solution: "القسمة على عدد أصغر من 1 (زيادة المراتب)." },
  { id: 371, section: SECTIONS.ADV_DEC, timeText: "30 ثانية", targetTime: [30000, 45000], question: "0.825 × 6.4", result: "5.28", solution: "التموضع للأعداد دون الواحد الصحيح." },
  { id: 372, section: SECTIONS.ADV_DEC, timeText: "30 ثانية", targetTime: [30000, 45000], question: "98.42 - 57.89 + 13.67 - 24.15", result: "30.05", solution: "تتابع 4 عمليات عشرية." },
  { id: 373, section: SECTIONS.ADV_DEC, timeText: "35 ثانية", targetTime: [35000, 52500], question: "254.16 ÷ 4.8", result: "52.95", solution: "قسمة عشرية معقدة." },
  { id: 374, section: SECTIONS.ADV_DEC, timeText: "30 ثانية", targetTime: [30000, 45000], question: "7.29 × 8.5", result: "61.965", solution: "ضرب الأجزاء من ألف." },
  { id: 375, section: SECTIONS.ADV_DEC, timeText: "35 ثانية", targetTime: [35000, 52500], question: "412.8 ÷ 0.86", result: "480", solution: "قسمة عشري لتحويل الناتج لعدد صحيح." },

  // ═══════════════════════════════════════════════════════════
  // القسم S16 — الأعداد السالبة (376-385)
  // ═══════════════════════════════════════════════════════════
  { id: 376, section: SECTIONS.ADV_NEG, timeText: "25 ثانية", targetTime: [25000, 37500], question: "145 - 280", result: "-135", solution: "القراءة الظاهرة 999...865 → المكمل 865 لـ1000 = 135 مع إشارة (-)." },
  { id: 377, section: SECTIONS.ADV_NEG, timeText: "25 ثانية", targetTime: [25000, 37500], question: "382 - 750", result: "-368", solution: "القراءة المتممة: 999...632 → المكمل -368." },
  { id: 378, section: SECTIONS.ADV_NEG, timeText: "30 ثانية", targetTime: [30000, 45000], question: "520 - 894 + 120", result: "-254", solution: "520-894=-374، ثم إضافة 120 → -254." },
  { id: 379, section: SECTIONS.ADV_NEG, timeText: "25 ثانية", targetTime: [25000, 37500], question: "84 - 310 + 95", result: "-131", solution: "تحول القيمة للسالب ثم تقليص السالب بالجمع." },
  { id: 380, section: SECTIONS.ADV_NEG, timeText: "25 ثانية", targetTime: [25000, 37500], question: "215 - 640", result: "-425", solution: "تحويل مكملات خرزات السوروبان." },
  { id: 381, section: SECTIONS.ADV_NEG, timeText: "30 ثانية", targetTime: [30000, 45000], question: "430 - 915 + 280", result: "-205", solution: "عمليات مركبة مع الناتج السالب." },
  { id: 382, section: SECTIONS.ADV_NEG, timeText: "25 ثانية", targetTime: [25000, 37500], question: "175 - 500 + 140", result: "-185", solution: "قراءة المكمل المباشر." },
  { id: 383, section: SECTIONS.ADV_NEG, timeText: "25 ثانية", targetTime: [25000, 37500], question: "620 - 1250", result: "-630", solution: "طرح يتجاوز الألف للسالب." },
  { id: 384, section: SECTIONS.ADV_NEG, timeText: "25 ثانية", targetTime: [25000, 37500], question: "95 - 430 + 115", result: "-220", solution: "التوازن بين الاستعارة والجمع." },
  { id: 385, section: SECTIONS.ADV_NEG, timeText: "30 ثانية", targetTime: [30000, 45000], question: "310 - 850 + 290", result: "-250", solution: "قراءة مكملات الأعمدة الثلاثة." },

  // ═══════════════════════════════════════════════════════════
  // القسم S17 — الجذور التربيعية (386-400)
  // ═══════════════════════════════════════════════════════════
  { id: 386, section: SECTIONS.ADV_ROOT, timeText: "35 ثانية", targetTime: [35000, 52500], question: "√529", result: "23", solution: "التقسيم 5/29 → أقرب مربع 2 (4)، الباقي 129، المكرر 4، 129÷40≈3." },
  { id: 387, section: SECTIONS.ADV_ROOT, timeText: "35 ثانية", targetTime: [35000, 52500], question: "√1024", result: "32", solution: "التقسيم 10/24 → المربع 3 (9)، الباقي 124، المكرر 6، 124÷60≈2." },
  { id: 388, section: SECTIONS.ADV_ROOT, timeText: "35 ثانية", targetTime: [35000, 52500], question: "√2025", result: "45", solution: "التقسيم 20/25، الرقم الأول 4 (16)، الباقي 425، المكرر 85×5=425." },
  { id: 389, section: SECTIONS.ADV_ROOT, timeText: "35 ثانية", targetTime: [35000, 52500], question: "√3969", result: "63", solution: "التقسيم 39/69، الأول 6 (36)، الباقي 369، الاختبار 123×3=369." },
  { id: 390, section: SECTIONS.ADV_ROOT, timeText: "35 ثانية", targetTime: [35000, 52500], question: "√5476", result: "74", solution: "التقسيم 54/76، الأول 7 (49)، الباقي 576، الاختبار 144×4=576." },
  { id: 391, section: SECTIONS.ADV_ROOT, timeText: "35 ثانية", targetTime: [35000, 52500], question: "√7921", result: "89", solution: "التقسيم 79/21، الأول 8 (64)، الباقي 1521، الاختبار 169×9=1521." },
  { id: 392, section: SECTIONS.ADV_ROOT, timeText: "35 ثانية", targetTime: [35000, 52500], question: "√9604", result: "98", solution: "التقسيم 96/04، الأول 9 (81)، الباقي 1504، الاختبار 188×8=1504." },
  { id: 393, section: SECTIONS.ADV_ROOT, timeText: "45 ثانية", targetTime: [45000, 67500], question: "√15129", result: "123", solution: "جذر لعدد من 5 أرقام (التقسيم 1/51/29)، خروج جذر من 3 أرقام." },
  { id: 394, section: SECTIONS.ADV_ROOT, timeText: "45 ثانية", targetTime: [45000, 67500], question: "√35721", result: "189", solution: "تقسيم ثلاثي (3/57/21) وتطبيق المكرر مرتين على السوروبان." },
  { id: 395, section: SECTIONS.ADV_ROOT, timeText: "45 ثانية", targetTime: [45000, 67500], question: "√56169", result: "237", solution: "استخراج جذر ثلاثي الخانات." },
  { id: 396, section: SECTIONS.ADV_ROOT, timeText: "45 ثانية", targetTime: [45000, 67500], question: "√94864", result: "308", solution: "وجود صفر في وسط خرزات جذر الناتج (308)." },
  { id: 397, section: SECTIONS.ADV_ROOT, timeText: "50 ثانية", targetTime: [50000, 75000], question: "√165649", result: "407", solution: "جذر لعدد من 6 أرقام (التقسيم 16/56/49)." },
  { id: 398, section: SECTIONS.ADV_ROOT, timeText: "50 ثانية", targetTime: [50000, 75000], question: "√389376", result: "624", solution: "طروح المربعات المتتالية على السوروبان." },
  { id: 399, section: SECTIONS.ADV_ROOT, timeText: "50 ثانية", targetTime: [50000, 75000], question: "√576081", result: "759", solution: "تطبيق خوارزمية تاكاشي للجذور الضخمة." },
  { id: 400, section: SECTIONS.ADV_ROOT, timeText: "50 ثانية", targetTime: [50000, 75000], question: "√988036", result: "994", solution: "جذر متقدم رفيع المستوى يختتم بنك الأسئلة الشامل." },
];