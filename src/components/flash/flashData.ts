// src/components/flash/flashData.ts
// 📊 بيانات الفلاشات التعليمية المحدثة مع تصحيح نطق الـ TTS للقسمة على رقمين

import type { FlashCategory, FlashLesson } from './types';

const BASICS_1: FlashLesson = {
  id: 'basics-parts',
  title: 'أجزاء السوروبان',
  subtitle: 'تعرف على الأجزاء',
  operation: 'basics',
  category: 'basics',
  columns: 3,
  layout: 'single',
  steps: [
    { id: 's1', sorobanValue: 0, activeRodIndex: -1, badgeLines: ['👋 مرحباً'], caption: 'سنتعلم أجزاء السوروبان', ttsText: 'مرحباً يا بطل.', durationMs: 2500 },
    { id: 's2', sorobanValue: 0, activeRodIndex: 1, badgeLines: ['الأعمدة'], caption: 'الخطوط الرأسية', ttsText: 'هذه هي الأعمدة.', durationMs: 3000 },
    { id: 's3', sorobanValue: 0, activeRodIndex: -1, highlightBeam: true, badgeLines: ['العارضة'], caption: 'الخط الأفقي في المنتصف', ttsText: 'هذه هي العارضة.', durationMs: 3000 },
    { id: 's4', sorobanValue: 5, activeRodIndex: 1, badgeLines: ['5', 'الخرزة العلوية'], caption: 'الخرزة العلوية = 5', ttsText: 'الخرزة العلوية قيمتها خمسة.', durationMs: 3000 },
    { id: 's5', sorobanValue: 4, activeRodIndex: 1, badgeLines: ['4', 'الخرزات السفلية'], caption: 'كل خرزة سفلية = 1', ttsText: 'كل خرزة سفلية تساوي واحد.', durationMs: 3000 },
  ],
};

// ═══════════════════════════════════════════════════════════
// ➗ S07 — القسمة ÷1
// ═══════════════════════════════════════════════════════════

const DIV_1X1_M1: FlashLesson = {
  id: 'div-1x1-m1',
  title: 'القسمة البسيطة',
  subtitle: '837 ÷ 3',
  operation: 'division',
  category: 'div-1',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  steps: [
    { id: 's1', resultValue: 0, dividendValue: 837, badgeLines: ['837 ÷ 3'], caption: 'نضع المقسوم 837 على العداد', ttsText: 'نضع المقسوم ثمانمائة وسبعة وثلاثين.', durationMs: 4000 },
    { id: 's2', resultValue: 200, dividendValue: 837, highlightResult: [0], highlightDividend: [0], badgeLines: ['8 ÷ 3 = 2'], caption: 'نقسم 8 مئات على 3 → 2 في مئات الناتج', ttsText: 'ثمانية مئات تقسيم ثلاثة يساوي اثنين مئات.', durationMs: 7000 },
    { id: 's3', resultValue: 200, dividendValue: 237, highlightDividend: [0], badgeLines: ['8 − 6 = 2'], caption: 'نطرح 2×3 = 6 · يبقى 2 في المئات', ttsText: 'نطرح ستة من ثمانية، يبقى اثنان.', durationMs: 7000 },
    { id: 's4', resultValue: 270, dividendValue: 237, highlightResult: [1], highlightDividend: [0, 1], badgeLines: ['23 ÷ 3 = 7'], caption: 'نأخذ (23) · 23 ÷ 3 = 7 → 7 في عشرات الناتج', ttsText: 'ثلاثة وعشرون تقسيم ثلاثة يساوي سبعة.', durationMs: 7000 },
    { id: 's5', resultValue: 270, dividendValue: 27, highlightDividend: [0, 1], badgeLines: ['23 − 21 = 2'], caption: 'نطرح 7×3 = 21 · يبقى 2 عشرة', ttsText: 'نطرح واحداً وعشرين، يبقى عشرتان.', durationMs: 7000 },
    { id: 's6', resultValue: 279, dividendValue: 27, highlightResult: [2], highlightDividend: [1, 2], badgeLines: ['27 ÷ 3 = 9'], caption: 'نأخذ (27) · 27 ÷ 3 = 9 → 9 في آحاد الناتج', ttsText: 'سبعة وعشرون تقسيم ثلاثة يساوي تسعة.', durationMs: 7000 },
    { id: 's7', resultValue: 279, dividendValue: 0, highlightDividend: [1, 2], badgeLines: ['27 − 27 = 0'], caption: 'نطرح 9×3 = 27 · يبقى صفر', ttsText: 'نطرح سبعة وعشرين، يبقى صفر.', durationMs: 7000 },
    { id: 's8', resultValue: 279, dividendValue: 0, badgeLines: ['✅ الناتج = 279'], caption: 'انتهت القسمة! الناتج: 279', ttsText: 'انتهت القسمة. الناتج مئتان وتسعة وسبعون.', durationMs: 5000 },
  ],
};

const DIV_1X1_M2: FlashLesson = {
  id: 'div-1x1-m2',
  title: 'القسمة — أصدقاء 5',
  subtitle: '54 ÷ 3',
  operation: 'division',
  category: 'div-1',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  steps: [
    { id: 's1', resultValue: 0, dividendValue: 54, badgeLines: ['54 ÷ 3'], caption: 'نضع المقسوم 54 على العداد', ttsText: 'نضع المقسوم أربعة وخمسين.', durationMs: 4000 },
    { id: 's2', resultValue: 10, dividendValue: 54, highlightResult: [1], highlightDividend: [1], badgeLines: ['5 ÷ 3 = 1'], caption: '5 عشرات ÷ 3 = 1 → 1 في عشرات الناتج', ttsText: 'خمسة عشرات تقسيم ثلاثة يساوي عشرة.', durationMs: 7000 },
    { id: 's3', resultValue: 10, dividendValue: 24, highlightDividend: [1], badgeLines: ['5 − 3 = 2'], caption: 'نطرح 1×3 = 3 · يبقى 2 عشرات', ttsText: 'نطرح ثلاثة من خمسة، يبقى عشرتان.', durationMs: 7000 },
    { id: 's4', resultValue: 18, dividendValue: 24, highlightResult: [2], highlightDividend: [1, 2], badgeLines: ['24 ÷ 3 = 8'], caption: 'نأخذ (24) · 24 ÷ 3 = 8 → 8 في آحاد الناتج', ttsText: 'أربعة وعشرون تقسيم ثلاثة يساوي ثمانية.', durationMs: 7000 },
    { id: 's5', resultValue: 18, dividendValue: 0, highlightDividend: [1, 2], badgeLines: ['24 − 24 = 0'], caption: 'نطرح 8×3 = 24 · يبقى صفر', ttsText: 'نطرح أربعة وعشرين، يبقى صفر.', durationMs: 7000 },
    { id: 's6', resultValue: 18, dividendValue: 0, badgeLines: ['✅ الناتج = 18'], caption: 'انتهت القسمة! الناتج: 18', ttsText: 'انتهت القسمة. الناتج ثمانية عشر.', durationMs: 5000 },
  ],
};

const DIV_1X1_M3: FlashLesson = {
  id: 'div-1x1-m3',
  title: 'القسمة — أصدقاء 10',
  subtitle: '152 ÷ 8',
  operation: 'division',
  category: 'div-1',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  steps: [
    { id: 's1', resultValue: 0, dividendValue: 152, badgeLines: ['152 ÷ 8'], caption: 'نضع المقسوم 152 على العداد', ttsText: 'نضع المقسوم مئة واثنين وخمسين.', durationMs: 4000 },
    { id: 's2', resultValue: 10, dividendValue: 152, highlightResult: [1], highlightDividend: [0, 1], badgeLines: ['15 ÷ 8 = 1'], caption: '1 أصغر من 8 · نأخذ (15) · 15 ÷ 8 = 1 → 1 في عشرات الناتج', ttsText: 'خمسة عشر تقسيم ثمانية يساوي عشرة.', durationMs: 7000 },
    { id: 's3', resultValue: 10, dividendValue: 72, highlightDividend: [1, 2], badgeLines: ['15 − 8 = 7'], caption: 'نطرح 1×8 = 8 · المقسوم الآن 72', ttsText: 'نطرح ثمانية. المقسوم الآن اثنان وسبعون.', durationMs: 7000 },
    { id: 's4', resultValue: 19, dividendValue: 72, highlightResult: [2], highlightDividend: [1, 2], badgeLines: ['72 ÷ 8 = 9'], caption: 'نأخذ (72) · 72 ÷ 8 = 9 → 9 في آحاد الناتج', ttsText: 'اثنان وسبعون تقسيم ثمانية يساوي تسعة.', durationMs: 7000 },
    { id: 's5', resultValue: 19, dividendValue: 0, highlightDividend: [1, 2], badgeLines: ['72 − 72 = 0'], caption: 'نطرح 9×8 = 72 · يبقى صفر', ttsText: 'نطرح اثنين وسبعين، يبقى صفر.', durationMs: 7000 },
    { id: 's6', resultValue: 19, dividendValue: 0, badgeLines: ['✅ الناتج = 19'], caption: 'انتهت القسمة! الناتج: 19', ttsText: 'انتهت القسمة. الناتج تسعة عشر.', durationMs: 5000 },
  ],
};

const DIV_1X1_M4: FlashLesson = {
  id: 'div-1x1-m4',
  title: 'القسمة — مركبة',
  subtitle: '216 ÷ 8',
  operation: 'division',
  category: 'div-1',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  steps: [
    { id: 's1', resultValue: 0, dividendValue: 216, badgeLines: ['216 ÷ 8'], caption: 'نضع المقسوم 216 على العداد', ttsText: 'نضع المقسوم مئتين وستة عشر.', durationMs: 4000 },
    { id: 's2', resultValue: 20, dividendValue: 216, highlightResult: [1], highlightDividend: [0, 1], badgeLines: ['21 ÷ 8 = 2'], caption: '2 أصغر من 8 · نأخذ (21) · 21 ÷ 8 = 2 → 2 في عشرات الناتج', ttsText: 'واحد وعشرون تقسيم ثمانية يساوي عشرين.', durationMs: 7000 },
    { id: 's3', resultValue: 20, dividendValue: 56, highlightDividend: [1, 2], badgeLines: ['21 − 16 = 5'], caption: 'نطرح 2×8 = 16 · المقسوم الآن 56', ttsText: 'نطرح ستة عشر. المقسوم الآن ستة وخمسون.', durationMs: 7000 },
    { id: 's4', resultValue: 27, dividendValue: 56, highlightResult: [2], highlightDividend: [1, 2], badgeLines: ['56 ÷ 8 = 7'], caption: 'نأخذ (56) · 56 ÷ 8 = 7 → 7 في آحاد الناتج', ttsText: 'ستة وخمسون تقسيم ثمانية يساوي سبعة.', durationMs: 7000 },
    { id: 's5', resultValue: 27, dividendValue: 0, highlightDividend: [1, 2], badgeLines: ['56 − 56 = 0'], caption: 'نطرح 7×8 = 56 · يبقى صفر', ttsText: 'نطرح ستة وخمسين، يبقى صفر.', durationMs: 7000 },
    { id: 's6', resultValue: 27, dividendValue: 0, badgeLines: ['✅ الناتج = 27'], caption: 'انتهت القسمة! الناتج: 27', ttsText: 'انتهت القسمة. الناتج سبعة وعشرون.', durationMs: 5000 },
  ],
};

// ═══════════════════════════════════════════════════════════
// ➗ S08 — القسمة ÷2
// ═══════════════════════════════════════════════════════════

// m1 — 484 ÷ 22 = 22
const DIV_1X2_M1: FlashLesson = {
  id: 'div-1x2-m1',
  title: 'القسمة على رقمين',
  subtitle: '484 ÷ 22',
  operation: 'division',
  category: 'div-2',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  steps: [
    { id: 's1', resultValue: 0, dividendValue: 484, badgeLines: ['484 ÷ 22'], caption: 'نضع المقسوم 484 على العداد', ttsText: 'نضع المقسوم أربعمائة وأربعة وثمانين.', durationMs: 4000 },
    { id: 's2', resultValue: 20, dividendValue: 484, highlightResult: [1], highlightDividend: [0, 1], badgeLines: ['48 ÷ 22 = 2'], caption: '48 ÷ 22 = 2 → 2 في عشرات الناتج (= 20)', ttsText: 'ثمانية وأربعون تقسيم اثنين وعشرين يساوي عشرين. نضع اثنين في العشرات.', durationMs: 8000 },
    { id: 's3', resultValue: 20, dividendValue: 44, highlightDividend: [0, 1], badgeLines: ['20 × 22 = 440', '484 − 440 = 44'], caption: 'نطرح 440 (4 من المئات + 4 من العشرات)', ttsText: 'عشرون في اثنين وعشرين يساوي أربعمائة وأربعين. نطرح، يبقى أربعة وأربعين.', durationMs: 8000 },
    { id: 's4', resultValue: 22, dividendValue: 44, highlightResult: [2], highlightDividend: [1, 2], badgeLines: ['44 ÷ 22 = 2'], caption: '44 ÷ 22 = 2 → 2 في آحاد الناتج', ttsText: 'أربعة وأربعون تقسيم اثنين وعشرين يساوي اثنين. نضع اثنين في الآحاد.', durationMs: 8000 },
    { id: 's5', resultValue: 22, dividendValue: 0, highlightDividend: [1, 2], badgeLines: ['2 × 22 = 44', '44 − 44 = 0'], caption: 'نطرح 44 (4 من العشرات + 4 من الآحاد)', ttsText: 'اثنان في اثنين وعشرين يساوي أربعة وأربعين. نطرح، يبقى صفر.', durationMs: 8000 },
    { id: 's6', resultValue: 22, dividendValue: 0, badgeLines: ['✅ الناتج = 22'], caption: 'انتهت القسمة! الناتج: 22', ttsText: 'انتهت القسمة. الناتج اثنان وعشرون.', durationMs: 5000 },
  ],
};

// m2 — 572 ÷ 22 = 26
const DIV_1X2_M2: FlashLesson = {
  id: 'div-1x2-m2',
  title: 'القسمة ÷2 — أصدقاء 5',
  subtitle: '572 ÷ 22',
  operation: 'division',
  category: 'div-2',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  steps: [
    { id: 's1', resultValue: 0, dividendValue: 572, badgeLines: ['572 ÷ 22'], caption: 'نضع المقسوم 572 على العداد', ttsText: 'نضع المقسوم خمسمائة واثنين وسبعين.', durationMs: 4000 },
    { id: 's2', resultValue: 20, dividendValue: 572, highlightResult: [1], highlightDividend: [0, 1], badgeLines: ['57 ÷ 22 = 2'], caption: '57 ÷ 22 = 2 → 2 في عشرات الناتج (= 20)', ttsText: 'سبعة وخمسون تقسيم اثنين وعشرين يساوي عشرين. نضع اثنين في العشرات.', durationMs: 8000 },
    { id: 's3', resultValue: 20, dividendValue: 132, highlightDividend: [0, 1, 2], badgeLines: ['20 × 22 = 440', '572 − 440 = 132'], caption: 'نطرح 440 · يبقى 132', ttsText: 'عشرون في اثنين وعشرين يساوي أربعمائة وأربعين. نطرح، يبقى مئة واثنين وثلاثين.', durationMs: 8000 },
    { id: 's4', resultValue: 26, dividendValue: 132, highlightResult: [2], highlightDividend: [0, 1, 2], badgeLines: ['132 ÷ 22 = 6'], caption: '132 ÷ 22 = 6 → 6 في آحاد الناتج', ttsText: 'مئة واثنان وثلاثون تقسيم اثنين وعشرين يساوي ستة. نضع ستة في الآحاد.', durationMs: 8000 },
    { id: 's5', resultValue: 26, dividendValue: 0, highlightDividend: [0, 1, 2], badgeLines: ['6 × 22 = 132', '132 − 132 = 0'], caption: 'نطرح 132 (1 مئات + 3 عشرات + 2 آحاد)', ttsText: 'ستة في اثنين وعشرين يساوي مئة واثنين وثلاثين. نطرح، يبقى صفر.', durationMs: 8000 },
    { id: 's6', resultValue: 26, dividendValue: 0, badgeLines: ['✅ الناتج = 26'], caption: 'انتهت القسمة! الناتج: 26', ttsText: 'انتهت القسمة. الناتج ستة وعشرون.', durationMs: 5000 },
  ],
};

// m3 — 350 ÷ 14 = 25
const DIV_1X2_M3: FlashLesson = {
  id: 'div-1x2-m3',
  title: 'القسمة ÷2 — أصدقاء 10',
  subtitle: '350 ÷ 14',
  operation: 'division',
  category: 'div-2',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  steps: [
    { id: 's1', resultValue: 0, dividendValue: 350, badgeLines: ['350 ÷ 14'], caption: 'نضع المقسوم 350 على العداد', ttsText: 'نضع المقسوم ثلاثمائة وخمسين.', durationMs: 4000 },
    { id: 's2', resultValue: 20, dividendValue: 350, highlightResult: [1], highlightDividend: [0, 1], badgeLines: ['35 ÷ 14 = 2'], caption: '35 ÷ 14 = 2 → 2 في عشرات الناتج (= 20)', ttsText: 'خمسة وثلاثون تقسيم أربعة عشر يساوي عشرين. نضع اثنين في العشرات.', durationMs: 8000 },
    { id: 's3', resultValue: 20, dividendValue: 70, highlightDividend: [1], badgeLines: ['20 × 14 = 280', '350 − 280 = 70'], caption: 'نطرح 280 (2 من المئات + 8 من العشرات)', ttsText: 'عشرون في أربعة عشر يساوي مئتين وثمانين. نطرح، يبقى سبعين.', durationMs: 8000 },
    { id: 's4', resultValue: 25, dividendValue: 70, highlightResult: [2], highlightDividend: [1], badgeLines: ['70 ÷ 14 = 5'], caption: '70 ÷ 14 = 5 → 5 في آحاد الناتج', ttsText: 'سبعون تقسيم أربعة عشر يساوي خمسة. نضع خمسة في الآحاد.', durationMs: 8000 },
    { id: 's5', resultValue: 25, dividendValue: 0, highlightDividend: [1], badgeLines: ['5 × 14 = 70', '70 − 70 = 0'], caption: 'نطرح 70 (7 من العشرات)', ttsText: 'خمسة في أربعة عشر يساوي سبعين. نطرح، يبقى صفر.', durationMs: 8000 },
    { id: 's6', resultValue: 25, dividendValue: 0, badgeLines: ['✅ الناتج = 25'], caption: 'انتهت القسمة! الناتج: 25', ttsText: 'انتهت القسمة. الناتج خمسة وعشرون.', durationMs: 5000 },
  ],
};

// m4 — 234 ÷ 18 = 13
const DIV_1X2_M4: FlashLesson = {
  id: 'div-1x2-m4',
  title: 'القسمة ÷2 — مركبة',
  subtitle: '234 ÷ 18',
  operation: 'division',
  category: 'div-2',
  columns: 6,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 3,
  steps: [
    { id: 's1', resultValue: 0, dividendValue: 234, badgeLines: ['234 ÷ 18'], caption: 'نضع المقسوم 234 على العداد', ttsText: 'نضع المقسوم مئتين وأربعة وثلاثين.', durationMs: 4000 },
    { id: 's2', resultValue: 10, dividendValue: 234, highlightResult: [1], highlightDividend: [0, 1], badgeLines: ['23 ÷ 18 = 1'], caption: '23 ÷ 18 = 1 → 1 في عشرات الناتج (= 10)', ttsText: 'ثلاثة وعشرون تقسيم ثمانية عشر يساوي عشرة. نضع واحداً في العشرات.', durationMs: 8000 },
    { id: 's3', resultValue: 10, dividendValue: 54, highlightDividend: [0, 1], badgeLines: ['10 × 18 = 180', '234 − 180 = 54'], caption: 'نطرح 180 (1 من المئات + 8 من العشرات)', ttsText: 'عشرة في ثمانية عشر يساوي مئة وثمانين. نطرح، يبقى أربعة وخمسين.', durationMs: 8000 },
    { id: 's4', resultValue: 13, dividendValue: 54, highlightResult: [2], highlightDividend: [1, 2], badgeLines: ['54 ÷ 18 = 3'], caption: '54 ÷ 18 = 3 → 3 في آحاد الناتج', ttsText: 'أربعة وخمسون تقسيم ثمانية عشر يساوي ثلاثة. نضع ثلاثة في الآحاد.', durationMs: 8000 },
    { id: 's5', resultValue: 13, dividendValue: 0, highlightDividend: [1, 2], badgeLines: ['3 × 18 = 54', '54 − 54 = 0'], caption: 'نطرح 54 (5 من العشرات + 4 من الآحاد)', ttsText: 'ثلاثة في ثمانية عشر يساوي أربعة وخمسين. نطرح، يبقى صفر.', durationMs: 8000 },
    { id: 's6', resultValue: 13, dividendValue: 0, badgeLines: ['✅ الناتج = 13'], caption: 'انتهت القسمة! الناتج: 13', ttsText: 'انتهت القسمة. الناتج ثلاثة عشر.', durationMs: 5000 },
  ],
};

export const FLASH_CATEGORIES: FlashCategory[] = [
  {
    id: 'basics',
    title: 'أساسيات السوروبان',
    emoji: '📖',
    description: 'تعرف على أجزاء العداد',
    lessons: [BASICS_1],
  },
  {
    id: 'div-1',
    title: 'القسمة على رقم واحد',
    emoji: '➗',
    description: 'القسمة ÷ 1 (S07)',
    lessons: [DIV_1X1_M1, DIV_1X1_M2, DIV_1X1_M3, DIV_1X1_M4],
  },
  {
    id: 'div-2',
    title: 'القسمة على رقمين',
    emoji: '➗',
    description: 'القسمة ÷ 2 (S08)',
    lessons: [DIV_1X2_M1, DIV_1X2_M2, DIV_1X2_M3, DIV_1X2_M4],
  },
  {
    id: 'mult',
    title: 'الضرب',
    emoji: '✖️',
    description: 'الضرب (S05 · S06) — قريباً',
    lessons: [],
  },
];

export const ALL_FLASH_LESSONS: FlashLesson[] = FLASH_CATEGORIES.flatMap(
  (c) => c.lessons,
);

export function getFlashLessonById(id: string): FlashLesson | undefined {
  return ALL_FLASH_LESSONS.find((l) => l.id === id);
}
