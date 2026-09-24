// src/data/bank-raw/raw-02.ts
// الأسئلة 61-100 — أقسام 4-5

import type { RawQuestion } from "./types";
import { SECTIONS } from "./types";

export const RAW_QUESTIONS_02: RawQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // القسم الرابع: القواعد المركبة (61-80)
  // ═══════════════════════════════════════════════════════════
  { id: 61, section: SECTIONS.S4, targetTime: [4000, 6000], question: "6 + 6", solution: "نضيف 10 في العشرات، ولطرح 4 من الآحاد نطرح 5 ونضيف 1 (+10 - 5 + 1).", result: "12" },
  { id: 62, section: SECTIONS.S4, targetTime: [4000, 6000], question: "7 + 6", solution: "نضيف 10 في العشرات، ولطرح 4 من الآحاد نطرح 5 ونضيف 1 (+10 - 5 + 1).", result: "13" },
  { id: 63, section: SECTIONS.S4, targetTime: [4000, 6000], question: "8 + 6", solution: "نضيف 10 في العشرات، ولطرح 4 من الآحاد نطرح 5 ونضيف 1 (+10 - 5 + 1).", result: "14" },
  { id: 64, section: SECTIONS.S4, targetTime: [4000, 6000], question: "6 + 7", solution: "نضيف 10 في العشرات، ولطرح 3 من الآحاد نطرح 5 ونضيف 2 (+10 - 5 + 2).", result: "13" },
  { id: 65, section: SECTIONS.S4, targetTime: [4000, 6000], question: "7 + 7", solution: "نضيف 10 في العشرات، ولطرح 3 من الآحاد نطرح 5 ونضيف 2 (+10 - 5 + 2).", result: "14" },
  { id: 66, section: SECTIONS.S4, targetTime: [4000, 6000], question: "8 + 7", solution: "نضيف 10 في العشرات، ولطرح 3 من الآحاد نطرح 5 ونضيف 2 (+10 - 5 + 2).", result: "15" },
  { id: 67, section: SECTIONS.S4, targetTime: [4000, 6000], question: "6 + 8", solution: "نضيف 10 في العشرات، ولطرح 2 من الآحاد نطرح 5 ونضيف 3 (+10 - 5 + 3).", result: "14" },
  { id: 68, section: SECTIONS.S4, targetTime: [4000, 6000], question: "7 + 8", solution: "نضيف 10 في العشرات، ولطرح 2 من الآحاد نطرح 5 ونضيف 3 (+10 - 5 + 3).", result: "15" },
  { id: 69, section: SECTIONS.S4, targetTime: [4000, 6000], question: "6 + 9", solution: "نضيف 10 في العشرات، ولطرح 1 من الآحاد نطرح 5 ونضيف 4 (+10 - 5 + 4).", result: "15" },
  { id: 70, section: SECTIONS.S4, targetTime: [4000, 6000], question: "7 + 9", solution: "نضيف 10 في العشرات، ولطرح 1 من الآحاد نطرح 5 ونضيف 4 (+10 - 5 + 4).", result: "16" },
  { id: 71, section: SECTIONS.S4, targetTime: [4000, 6000], question: "13 - 6", solution: "نطرح 10 من العشرات، ولإضافة 4 في الآحاد نضيف 5 ونطرح 1 (-10 + 5 - 1).", result: "7" },
  { id: 72, section: SECTIONS.S4, targetTime: [4000, 6000], question: "14 - 6", solution: "نطرح 10 من العشرات، ولإضافة 4 في الآحاد نضيف 5 ونطرح 1 (-10 + 5 - 1).", result: "8" },
  { id: 73, section: SECTIONS.S4, targetTime: [4000, 6000], question: "12 - 7", solution: "نطرح 10 من العشرات، ولإضافة 3 في الآحاد نضيف 5 ونطرح 2 (-10 + 5 - 2).", result: "5" },
  { id: 74, section: SECTIONS.S4, targetTime: [4000, 6000], question: "13 - 7", solution: "نطرح 10 من العشرات، ولإضافة 3 في الآحاد نضيف 5 ونطرح 2 (-10 + 5 - 2).", result: "6" },
  { id: 75, section: SECTIONS.S4, targetTime: [4000, 6000], question: "14 - 7", solution: "نطرح 10 من العشرات، ولإضافة 3 في الآحاد نضيف 5 ونطرح 2 (-10 + 5 - 2).", result: "7" },
  { id: 76, section: SECTIONS.S4, targetTime: [4000, 6000], question: "12 - 8", solution: "نطرح 10 من العشرات، ولإضافة 2 في الآحاد نضيف 5 ونطرح 3 (-10 + 5 - 3).", result: "4" },
  { id: 77, section: SECTIONS.S4, targetTime: [4000, 6000], question: "13 - 8", solution: "نطرح 10 من العشرات، ولإضافة 2 في الآحاد نضيف 5 ونطرح 3 (-10 + 5 - 3).", result: "5" },
  { id: 78, section: SECTIONS.S4, targetTime: [4000, 6000], question: "14 - 8", solution: "نطرح 10 من العشرات، ولإضافة 2 في الآحاد نضيف 5 ونطرح 3 (-10 + 5 - 3).", result: "6" },
  { id: 79, section: SECTIONS.S4, targetTime: [4000, 6000], question: "12 - 9", solution: "نطرح 10 من العشرات، ولإضافة 1 في الآحاد نضيف 5 ونطرح 4 (-10 + 5 - 4).", result: "3" },
  { id: 80, section: SECTIONS.S4, targetTime: [4000, 6000], question: "13 - 9", solution: "نطرح 10 من العشرات، ولإضافة 1 في الآحاد نضيف 5 ونطرح 4 (-10 + 5 - 4).", result: "4" },

  // ═══════════════════════════════════════════════════════════
  // القسم الخامس: الضرب متعدد الخانات (81-100)
  // ═══════════════════════════════════════════════════════════
  { id: 81, section: SECTIONS.S5, targetTime: [5000, 8000], question: "18 × 3", solution: "10 × 3 = 30، 8 × 3 = 24. الجمع على العداد: 30 + 24.", result: "54" },
  { id: 82, section: SECTIONS.S5, targetTime: [5000, 8000], question: "27 × 4", solution: "20 × 4 = 80، 7 × 4 = 28. الجمع على العداد: 80 + 28.", result: "108" },
  { id: 83, section: SECTIONS.S5, targetTime: [5000, 8000], question: "36 × 5", solution: "30 × 5 = 150، 6 × 5 = 30. الجمع على العداد: 150 + 30.", result: "180" },
  { id: 84, section: SECTIONS.S5, targetTime: [5000, 8000], question: "48 × 6", solution: "40 × 6 = 240، 8 × 6 = 48. الجمع على العداد: 240 + 48.", result: "288" },
  { id: 85, section: SECTIONS.S5, targetTime: [5000, 8000], question: "59 × 4", solution: "50 × 4 = 200، 9 × 4 = 36. الجمع على العداد: 200 + 36.", result: "236" },
  { id: 86, section: SECTIONS.S5, targetTime: [5000, 8000], question: "64 × 7", solution: "60 × 7 = 420، 4 × 7 = 28. الجمع على العداد: 420 + 28.", result: "448" },
  { id: 87, section: SECTIONS.S5, targetTime: [5000, 8000], question: "73 × 8", solution: "70 × 8 = 560، 3 × 8 = 24. الجمع على العداد: 560 + 24.", result: "584" },
  { id: 88, section: SECTIONS.S5, targetTime: [5000, 8000], question: "82 × 9", solution: "80 × 9 = 720، 2 × 9 = 18. الجمع على العداد: 720 + 18.", result: "738" },
  { id: 89, section: SECTIONS.S5, targetTime: [5000, 8000], question: "91 × 6", solution: "90 × 6 = 540، 1 × 6 = 6. الجمع على العداد: 540 + 6.", result: "546" },
  { id: 90, section: SECTIONS.S5, targetTime: [5000, 8000], question: "142 × 3", solution: "100 × 3 = 300، 40 × 3 = 120، 2 × 3 = 6. الجمع: 300 + 120 + 6.", result: "426" },
  { id: 91, section: SECTIONS.S5, targetTime: [5000, 8000], question: "235 × 4", solution: "200 × 4 = 800، 30 × 4 = 120، 5 × 4 = 20. الجمع: 800 + 120 + 20.", result: "940" },
  { id: 92, section: SECTIONS.S5, targetTime: [5000, 8000], question: "316 × 5", solution: "300 × 5 = 1500، 10 × 5 = 50، 6 × 5 = 30. الجمع: 1500 + 50 + 30.", result: "1580" },
  { id: 93, section: SECTIONS.S5, targetTime: [5000, 8000], question: "427 × 6", solution: "400 × 6 = 2400، 20 × 6 = 120، 7 × 6 = 42. الجمع: 2400 + 120 + 42.", result: "2562" },
  { id: 94, section: SECTIONS.S5, targetTime: [5000, 8000], question: "518 × 7", solution: "500 × 7 = 3500، 10 × 7 = 70، 8 × 7 = 56. الجمع: 3500 + 70 + 56.", result: "3626" },
  { id: 95, section: SECTIONS.S5, targetTime: [5000, 8000], question: "609 × 8", solution: "600 × 8 = 4800، 0 × 8 = 0، 9 × 8 = 72. الجمع: 4800 + 72.", result: "4872" },
  { id: 96, section: SECTIONS.S5, targetTime: [5000, 8000], question: "23 × 12", solution: "23 × 10 = 230، 23 × 2 = 46. الجمع على العداد: 230 + 46.", result: "276" },
  { id: 97, section: SECTIONS.S5, targetTime: [5000, 8000], question: "35 × 24", solution: "35 × 20 = 700، 35 × 4 = 140. الجمع على العداد: 700 + 140.", result: "840" },
  { id: 98, section: SECTIONS.S5, targetTime: [5000, 8000], question: "46 × 31", solution: "46 × 30 = 1380، 46 × 1 = 46. الجمع على العداد: 1380 + 46.", result: "1426" },
  { id: 99, section: SECTIONS.S5, targetTime: [5000, 8000], question: "57 × 42", solution: "57 × 40 = 2280، 57 × 2 = 114. الجمع على العداد: 2280 + 114.", result: "2394" },
  { id: 100, section: SECTIONS.S5, targetTime: [5000, 8000], question: "68 × 53", solution: "68 × 50 = 3400، 68 × 3 = 204. الجمع على العداد: 3400 + 204.", result: "3604" },
];