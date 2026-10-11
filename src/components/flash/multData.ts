// src/components/flash/multData.ts
// ✖️ بيانات دروس الضرب — من اليسار لليمين · معدادان
// ⚠️ فهارس الأعمدة:
//   المضروب (3 أعمدة): 0=مئات · 1=عشرات · 2=آحاد
//   الناتج 2×1 (3 أعمدة): 0=مئات · 1=عشرات · 2=آحاد
//   الناتج 2×2 (4 أعمدة): 0=آلاف · 1=مئات · 2=عشرات · 3=آحاد

import type { FlashCategory, FlashLesson } from './types';

// ═══════════════════════════════════════════════════════════
// ✖️ S05 — الضرب 2×1 (3 أعمدة)
// ═══════════════════════════════════════════════════════════

// m1 — 32 × 3 = 96
const MULT_2X1_M1: FlashLesson = {
  id: 'mult-2x1-m1',
  title: 'الضرب — البسيط',
  subtitle: '32 × 3',
  operation: 'multiplication',
  category: 'mult-1',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  multiplicand: 32,
  multiplier: 3,
  steps: [
    { id: 's1', dividendValue: 32, resultValue: 0, badgeLines: ['32 × 3'], caption: 'نضع المضروب 32 على العداد الأيسر', ttsText: 'نضع المضروب اثنين وَثَلَاثِينَ.', durationMs: 4000 },
    { id: 's2', dividendValue: 32, resultValue: 90, highlightDividend: [1], highlightResult: [1], badgeLines: ['3 × 3 = 9'], caption: '3 عشرات × 3 = 9 عشرات', ttsText: 'ثلاثة في ثلاثة يساوي تسعة. نضع تسعة في العشرات.', durationMs: 8000 },
    { id: 's3', dividendValue: 32, resultValue: 96, highlightDividend: [2], highlightResult: [2], badgeLines: ['2 × 3 = 6'], caption: '2 آحاد × 3 = 6 آحاد', ttsText: 'اثنان في ثلاثة يساوي ستة. نضع ستة في الآحاد.', durationMs: 8000 },
    { id: 's4', dividendValue: 32, resultValue: 96, blurDividend: [1, 2], badgeLines: ['✅ الناتج = 96'], caption: 'انتهت العملية! الناتج: 96', ttsText: 'انتهت العملية. الناتج ستة وَتِسْعُونَ.', durationMs: 5000 },
  ],
};

// m2 — 18 × 3 = 54
const MULT_2X1_M2: FlashLesson = {
  id: 'mult-2x1-m2',
  title: 'الضرب — أصدقاء 5',
  subtitle: '18 × 3',
  operation: 'multiplication',
  category: 'mult-1',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  multiplicand: 18,
  multiplier: 3,
  steps: [
    { id: 's1', dividendValue: 18, resultValue: 0, badgeLines: ['18 × 3'], caption: 'نضع المضروب 18 على العداد الأيسر', ttsText: 'نضع المضروب ثمانية عشر.', durationMs: 4000 },
    { id: 's2', dividendValue: 18, resultValue: 30, highlightDividend: [1], highlightResult: [1], badgeLines: ['1 × 3 = 3'], caption: '1 عشرة × 3 = 3 عشرات', ttsText: 'واحد في ثلاثة يساوي ثلاثة. نضع ثلاثة في العشرات.', durationMs: 8000 },
    { id: 's3', dividendValue: 18, resultValue: 54, highlightDividend: [2], highlightResult: [1, 2], badgeLines: ['8 × 3 = 24'], caption: '8 آحاد × 3 = 24 · يُضاف → 54', ttsText: 'ثمانية في ثلاثة يساوي أربعة وَعِشْرِينَ. نضيف فيصبح أربعة وَخَمْسِينَ.', durationMs: 9000 },
    { id: 's4', dividendValue: 18, resultValue: 54, blurDividend: [1, 2], badgeLines: ['✅ الناتج = 54'], caption: 'انتهت العملية! الناتج: 54', ttsText: 'انتهت العملية. الناتج أربعة وَخَمْسُونَ.', durationMs: 5000 },
  ],
};

// m3 — 17 × 6 = 102
const MULT_2X1_M3: FlashLesson = {
  id: 'mult-2x1-m3',
  title: 'الضرب — أصدقاء 10',
  subtitle: '17 × 6',
  operation: 'multiplication',
  category: 'mult-1',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  multiplicand: 17,
  multiplier: 6,
  steps: [
    { id: 's1', dividendValue: 17, resultValue: 0, badgeLines: ['17 × 6'], caption: 'نضع المضروب 17 على العداد الأيسر', ttsText: 'نضع المضروب سبعة عشر.', durationMs: 4000 },
    { id: 's2', dividendValue: 17, resultValue: 60, highlightDividend: [1], highlightResult: [1], badgeLines: ['1 × 6 = 6'], caption: '1 عشرة × 6 = 6 عشرات', ttsText: 'واحد في ستة يساوي ستة. نضع ستة في العشرات.', durationMs: 8000 },
    { id: 's3', dividendValue: 17, resultValue: 102, highlightDividend: [2], highlightResult: [0, 1, 2], badgeLines: ['7 × 6 = 42'], caption: '7 آحاد × 6 = 42 · يُضاف مع حمل → 102', ttsText: 'سبعة في ستة يساوي اثنين وَأَرْبَعِينَ. نضيف مع حمل فيصبح مئة وَاثْنَيْنِ.', durationMs: 9000 },
    { id: 's4', dividendValue: 17, resultValue: 102, blurDividend: [1, 2], badgeLines: ['✅ الناتج = 102'], caption: 'انتهت العملية! الناتج: 102', ttsText: 'انتهت العملية. الناتج مئة وَاثْنَانِ.', durationMs: 5000 },
  ],
};

// m4 — 18 × 8 = 144
const MULT_2X1_M4: FlashLesson = {
  id: 'mult-2x1-m4',
  title: 'الضرب — مركبة',
  subtitle: '18 × 8',
  operation: 'multiplication',
  category: 'mult-1',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  multiplicand: 18,
  multiplier: 8,
  steps: [
    { id: 's1', dividendValue: 18, resultValue: 0, badgeLines: ['18 × 8'], caption: 'نضع المضروب 18 على العداد الأيسر', ttsText: 'نضع المضروب ثمانية عشر.', durationMs: 4000 },
    { id: 's2', dividendValue: 18, resultValue: 80, highlightDividend: [1], highlightResult: [1], badgeLines: ['1 × 8 = 8'], caption: '1 عشرة × 8 = 8 عشرات', ttsText: 'واحد في ثمانية يساوي ثمانية. نضع ثمانية في العشرات.', durationMs: 8000 },
    { id: 's3', dividendValue: 18, resultValue: 144, highlightDividend: [2], highlightResult: [0, 1, 2], badgeLines: ['8 × 8 = 64'], caption: '8 آحاد × 8 = 64 · يُضاف مع حمل → 144', ttsText: 'ثمانية في ثمانية يساوي أربعة وَسِتِّينَ. نضيف مع حمل فيصبح مئة وَأَرْبَعَةً وَأَرْبَعِينَ.', durationMs: 9000 },
    { id: 's4', dividendValue: 18, resultValue: 144, blurDividend: [1, 2], badgeLines: ['✅ الناتج = 144'], caption: 'انتهت العملية! الناتج: 144', ttsText: 'انتهت العملية. الناتج مئة وَأَرْبَعَةٌ وَأَرْبَعُونَ.', durationMs: 5000 },
  ],
};

// ═══════════════════════════════════════════════════════════
// ✖️ S06 — الضرب 2×2 (4 أعمدة)
// ═══════════════════════════════════════════════════════════

// m1 — 11 × 22 = 242
const MULT_2X2_M1: FlashLesson = {
  id: 'mult-2x2-m1',
  title: 'الضرب على رقمين — البسيط',
  subtitle: '11 × 22',
  operation: 'multiplication',
  category: 'mult-2',
  columns: 7,
  layout: 'split',
  resultColumns: 4,
  dividendColumns: 3,
  multiplicand: 11,
  multiplier: 22,
  steps: [
    { id: 's1', dividendValue: 11, resultValue: 0, badgeLines: ['11 × 22'], caption: 'نضع المضروب 11 على العداد الأيسر', ttsText: 'نضع المضروب أَحَدَ عَشَر.', durationMs: 4000 },
    { id: 's2', dividendValue: 11, resultValue: 200, highlightDividend: [1], highlightResult: [1], badgeLines: ['1 × 2 = 2'], caption: '1 عشرة × 2 عشرات = 2 مئات', ttsText: 'واحد في اثنين يساوي اثنين. نضع اثنين في المئات.', durationMs: 8000 },
    { id: 's3', dividendValue: 11, resultValue: 220, highlightDividend: [1], highlightResult: [2], blurDividend: [1], badgeLines: ['1 × 2 = 2'], caption: '1 عشرة × 2 = 2 عشرات · ثم نطمس عشرات المضروب', ttsText: 'واحد في اثنين يساوي اثنين. نضيف في العشرات. نطمس عشرات المضروب.', durationMs: 9000 },
    { id: 's4', dividendValue: 1, resultValue: 240, highlightDividend: [2], highlightResult: [2], blurDividend: [1], badgeLines: ['1 × 2 = 2'], caption: '1 آحاد × 2 عشرات = 2 عشرات (تُضاف)', ttsText: 'واحد في اثنين يساوي اثنين. نضيف في العشرات فيصبح أربع عَشَرَات.', durationMs: 8000 },
    { id: 's5', dividendValue: 1, resultValue: 242, highlightDividend: [2], highlightResult: [3], blurDividend: [1], badgeLines: ['1 × 2 = 2'], caption: '1 آحاد × 2 آحاد = 2 آحاد · نطمس آحاد المضروب', ttsText: 'واحد في اثنين يساوي اثنين. نضع في الآحاد. نطمس آحاد المضروب.', durationMs: 9000 },
    { id: 's6', dividendValue: 0, resultValue: 242, blurDividend: [1, 2], badgeLines: ['✅ الناتج = 242'], caption: 'انتهت العملية! الناتج: 242', ttsText: 'انتهت العملية. الناتج مئتان وَاثْنَانِ وَأَرْبَعُونَ.', durationMs: 5000 },
  ],
};

// m2 — 14 × 12 = 168
const MULT_2X2_M2: FlashLesson = {
  id: 'mult-2x2-m2',
  title: 'الضرب على رقمين — أصدقاء 5',
  subtitle: '14 × 12',
  operation: 'multiplication',
  category: 'mult-2',
  columns: 7,
  layout: 'split',
  resultColumns: 4,
  dividendColumns: 3,
  multiplicand: 14,
  multiplier: 12,
  steps: [
    { id: 's1', dividendValue: 14, resultValue: 0, badgeLines: ['14 × 12'], caption: 'نضع المضروب 14 على العداد الأيسر', ttsText: 'نضع المضروب أربعة عشر.', durationMs: 4000 },
    { id: 's2', dividendValue: 14, resultValue: 100, highlightDividend: [1], highlightResult: [1], badgeLines: ['1 × 1 = 1'], caption: '1 عشرة × 1 عشرة = 1 مئة', ttsText: 'واحد في واحد يساوي واحد. نضع واحداً في المئات.', durationMs: 8000 },
    { id: 's3', dividendValue: 14, resultValue: 120, highlightDividend: [1], highlightResult: [2], blurDividend: [1], badgeLines: ['1 × 2 = 2'], caption: '1 عشرة × 2 = 2 عشرات · ثم نطمس عشرات المضروب', ttsText: 'واحد في اثنين يساوي اثنين. نضيف في العشرات. نطمس عشرات المضروب.', durationMs: 9000 },
    { id: 's4', dividendValue: 4, resultValue: 160, highlightDividend: [2], highlightResult: [2], blurDividend: [1], badgeLines: ['4 × 1 = 4'], caption: '4 آحاد × 1 عشرة = 4 عشرات (تُضاف)', ttsText: 'أربعة في واحد يساوي أربعة. نضيف في العشرات.', durationMs: 8000 },
    { id: 's5', dividendValue: 4, resultValue: 168, highlightDividend: [2], highlightResult: [3], blurDividend: [1], badgeLines: ['4 × 2 = 8'], caption: '4 آحاد × 2 آحاد = 8 آحاد · نطمس آحاد المضروب', ttsText: 'أربعة في اثنين يساوي ثمانية. نضع في الآحاد. نطمس آحاد المضروب.', durationMs: 9000 },
    { id: 's6', dividendValue: 0, resultValue: 168, blurDividend: [1, 2], badgeLines: ['✅ الناتج = 168'], caption: 'انتهت العملية! الناتج: 168', ttsText: 'انتهت العملية. الناتج مئة وَثَمَانِيَةٌ وَسِتُّونَ.', durationMs: 5000 },
  ],
};

// m3 — 23 × 33 = 759
const MULT_2X2_M3: FlashLesson = {
  id: 'mult-2x2-m3',
  title: 'الضرب على رقمين — أصدقاء 10',
  subtitle: '23 × 33',
  operation: 'multiplication',
  category: 'mult-2',
  columns: 7,
  layout: 'split',
  resultColumns: 4,
  dividendColumns: 3,
  multiplicand: 23,
  multiplier: 33,
  steps: [
    { id: 's1', dividendValue: 23, resultValue: 0, badgeLines: ['23 × 33'], caption: 'نضع المضروب 23 على العداد الأيسر', ttsText: 'نضع المضروب ثلاثة وَعِشْرِينَ.', durationMs: 4000 },
    { id: 's2', dividendValue: 23, resultValue: 600, highlightDividend: [1], highlightResult: [1], badgeLines: ['2 × 3 = 6'], caption: '2 عشرات × 3 عشرات = 6 مئات', ttsText: 'اثنان في ثلاثة يساوي ستة. نضع في المئات.', durationMs: 8000 },
    { id: 's3', dividendValue: 23, resultValue: 660, highlightDividend: [1], highlightResult: [2], blurDividend: [1], badgeLines: ['2 × 3 = 6'], caption: '2 عشرات × 3 = 6 عشرات · ثم نطمس عشرات المضروب', ttsText: 'اثنان في ثلاثة يساوي ستة. نضيف في العشرات. نطمس عشرات المضروب.', durationMs: 9000 },
    { id: 's4', dividendValue: 3, resultValue: 750, highlightDividend: [2], highlightResult: [1, 2], blurDividend: [1], badgeLines: ['3 × 3 = 9'], caption: '3 آحاد × 3 عشرات = 9 عشرات (تُضاف مع حمل) → 750', ttsText: 'ثلاثة في ثلاثة يساوي تسعة. نضيف مع حمل فيصبح سبعمائة وَخَمْسِينَ.', durationMs: 10000 },
    { id: 's5', dividendValue: 3, resultValue: 759, highlightDividend: [2], highlightResult: [3], blurDividend: [1], badgeLines: ['3 × 3 = 9'], caption: '3 آحاد × 3 = 9 آحاد · نطمس آحاد المضروب', ttsText: 'ثلاثة في ثلاثة يساوي تسعة. نضع في الآحاد. نطمس آحاد المضروب.', durationMs: 9000 },
    { id: 's6', dividendValue: 0, resultValue: 759, blurDividend: [1, 2], badgeLines: ['✅ الناتج = 759'], caption: 'انتهت العملية! الناتج: 759', ttsText: 'انتهت العملية. الناتج سبعمائة وَتِسْعَةٌ وَخَمْسُونَ.', durationMs: 5000 },
  ],
};

// m4 — 23 × 23 = 529
const MULT_2X2_M4: FlashLesson = {
  id: 'mult-2x2-m4',
  title: 'الضرب على رقمين — مركبة',
  subtitle: '23 × 23',
  operation: 'multiplication',
  category: 'mult-2',
  columns: 7,
  layout: 'split',
  resultColumns: 4,
  dividendColumns: 3,
  multiplicand: 23,
  multiplier: 23,
  steps: [
    { id: 's1', dividendValue: 23, resultValue: 0, badgeLines: ['23 × 23'], caption: 'نضع المضروب 23 على العداد الأيسر', ttsText: 'نضع المضروب ثلاثة وَعِشْرِينَ.', durationMs: 4000 },
    { id: 's2', dividendValue: 23, resultValue: 400, highlightDividend: [1], highlightResult: [1], badgeLines: ['2 × 2 = 4'], caption: '2 عشرات × 2 عشرات = 4 مئات', ttsText: 'اثنان في اثنين يساوي أربعة. نضع في المئات.', durationMs: 8000 },
    { id: 's3', dividendValue: 23, resultValue: 460, highlightDividend: [1], highlightResult: [2], blurDividend: [1], badgeLines: ['2 × 3 = 6'], caption: '2 عشرات × 3 = 6 عشرات · ثم نطمس عشرات المضروب', ttsText: 'اثنان في ثلاثة يساوي ستة. نضيف في العشرات. نطمس عشرات المضروب.', durationMs: 9000 },
    { id: 's4', dividendValue: 3, resultValue: 520, highlightDividend: [2], highlightResult: [1, 2], blurDividend: [1], badgeLines: ['3 × 2 = 6'], caption: '3 آحاد × 2 عشرات = 6 عشرات · يُضاف (6+6=12) مع حمل → 520', ttsText: 'ثلاثة في اثنين يساوي ستة. نضيف مع تحالف مركب فيصبح خمسمائة وَعِشْرِينَ.', durationMs: 10000 },
    { id: 's5', dividendValue: 3, resultValue: 529, highlightDividend: [2], highlightResult: [3], blurDividend: [1], badgeLines: ['3 × 3 = 9'], caption: '3 آحاد × 3 = 9 آحاد · نطمس آحاد المضروب', ttsText: 'ثلاثة في ثلاثة يساوي تسعة. نضع في الآحاد. نطمس آحاد المضروب.', durationMs: 9000 },
    { id: 's6', dividendValue: 0, resultValue: 529, blurDividend: [1, 2], badgeLines: ['✅ الناتج = 529'], caption: 'انتهت العملية! الناتج: 529', ttsText: 'انتهت العملية. الناتج خمسمائة وَتِسْعَةٌ وَعِشْرُونَ.', durationMs: 5000 },
  ],
};

// ═══════════════════════════════════════════════════════════
// 📚 الفئة
// ═══════════════════════════════════════════════════════════

export const MULT_CATEGORIES: FlashCategory[] = [
  {
    id: 'mult-1',
    title: 'الضرب على رقم واحد',
    emoji: '✖️',
    description: 'الضرب × 1 (S05)',
    lessons: [MULT_2X1_M1, MULT_2X1_M2, MULT_2X1_M3, MULT_2X1_M4],
  },
  {
    id: 'mult-2',
    title: 'الضرب على رقمين',
    emoji: '✖️',
    description: 'الضرب × 2 (S06)',
    lessons: [MULT_2X2_M1, MULT_2X2_M2, MULT_2X2_M3, MULT_2X2_M4],
  },
];

export const ALL_MULT_LESSONS: FlashLesson[] = MULT_CATEGORIES.flatMap(
  (c) => c.lessons,
);

export function getMultLessonById(id: string): FlashLesson | undefined {
  return ALL_MULT_LESSONS.find((l) => l.id === id);
}