// src/components/flash/flashData.ts
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
// ➗ div-1x1-m1 — 837 ÷ 3 = 279 (8 خطوات)
// ═══════════════════════════════════════════════════════════
const DIV_1X1_M1: FlashLesson = {
  id: 'div-1x1-m1',
  title: 'القسمة البسيطة',
  subtitle: '837 ÷ 3',
  operation: 'division',
  category: 'div-1',
  columns: 7,
  layout: 'split',
  resultColumns: 3,
  dividendColumns: 4,
  steps: [
    // s1 — الإعداد
    {
      id: 's1',
      resultValue: 0,
      dividendValue: 837,
      badgeLines: ['837 ÷ 3'],
      caption: 'نضع المقسوم 837 على العداد الأيمن',
      ttsText: 'نضع المقسوم ثمانمائة وسبعة وثلاثين على العداد الأيمن.',
      durationMs: 4000,
    },
    // s2 — إضافة 2 للمئات في الناتج
    {
      id: 's2',
      resultValue: 200,
      dividendValue: 837,
      highlightResult: [0],
      highlightDividend: [1],
      badgeLines: ['8 ÷ 3 = 2'],
      caption: 'نقسم 8 مئات على 3 → 2 مئات في الناتج',
      ttsText: 'ثمانية مئات تقسيم ثلاثة يساوي اثنين مئات. نضع اثنين في منزلة المئات بالناتج.',
      durationMs: 7000,
    },
    // s3 — طرح 6 من المئات
    {
      id: 's3',
      resultValue: 200,
      dividendValue: 237,
      highlightDividend: [1],
      badgeLines: ['8 − 6 = 2'],
      caption: 'نطرح 2×3 = 6، يبقى 2 في المئات',
      ttsText: 'اثنان في ثلاثة يساوي ستة. نطرح ستة من ثمانية، يبقى اثنان في منزلة المئات.',
      durationMs: 7000,
    },
    // s4 — إضافة 7 للعشرات
    {
      id: 's4',
      resultValue: 270,
      dividendValue: 237,
      highlightResult: [1],
      highlightDividend: [2],
      badgeLines: ['23 ÷ 3 = 7'],
      caption: 'نقسم 23 عشرة على 3 → 7 عشرات',
      ttsText: 'ثلاثة وعشرون عشرة تقسيم ثلاثة يساوي سبعة عشرات. نضع سبعة في منزلة العشرات بالناتج.',
      durationMs: 7000,
    },
    // s5 — طرح 21 من العشرات
    {
      id: 's5',
      resultValue: 270,
      dividendValue: 27,
      highlightDividend: [2],
      badgeLines: ['23 − 21 = 2'],
      caption: 'نطرح 7×3 = 21، يبقى 2 عشرة',
      ttsText: 'سبعة في ثلاثة يساوي واحداً وعشرين. نطرح، يبقى عشرتان.',
      durationMs: 7000,
    },
    // s6 — إضافة 9 للآحاد
    {
      id: 's6',
      resultValue: 279,
      dividendValue: 27,
      highlightResult: [2],
      highlightDividend: [3],
      badgeLines: ['27 ÷ 3 = 9'],
      caption: 'نقسم 27 على 3 → 9 آحاد',
      ttsText: 'سبعة وعشرون تقسيم ثلاثة يساوي تسعة. نضع تسعة في منزلة الآحاد بالناتج.',
      durationMs: 7000,
    },
    // s7 — طرح 27 من الآحاد
    {
      id: 's7',
      resultValue: 279,
      dividendValue: 0,
      highlightDividend: [3],
      badgeLines: ['27 − 27 = 0'],
      caption: 'نطرح 9×3 = 27، يبقى صفر',
      ttsText: 'تسعة في ثلاثة يساوي سبعة وعشرين. نطرح، يبقى صفر.',
      durationMs: 7000,
    },
    // s8 — النتيجة النهائية
    {
      id: 's8',
      resultValue: 279,
      dividendValue: 0,
      badgeLines: ['✅ الناتج = 279'],
      caption: 'انتهت القسمة! الناتج: 279',
      ttsText: 'انتهت القسمة. الناتج مئتان وتسعة وسبعون.',
      durationMs: 5000,
    },
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
    lessons: [DIV_1X1_M1],
  },
  {
    id: 'div-2',
    title: 'القسمة على رقمين',
    emoji: '➗',
    description: 'القسمة ÷ 2 (S08) — قريباً',
    lessons: [],
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