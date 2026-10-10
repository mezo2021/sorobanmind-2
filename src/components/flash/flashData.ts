// src/components/flash/flashData.ts
import type { FlashCategory, FlashLesson } from './types';

const BASICS_1: FlashLesson = {
  id: 'basics-parts',
  title: 'أجزاء السوروبان',
  subtitle: 'تعرف على الأجزاء',
  operation: 'basics',
  category: 'basics',
  columns: 3,
  steps: [
    {
      id: 's1',
      sorobanValue: 0,
      activeRodIndex: -1,
      badgeLines: ['👋 مرحباً'],
      caption: 'سنتعلم أجزاء السوروبان',
      ttsText: 'مرحباً يا بطل.',
      durationMs: 2500,
    },
    {
      id: 's2',
      sorobanValue: 0,
      activeRodIndex: 1,
      badgeLines: ['الأعمدة'],
      caption: 'الخطوط الرأسية',
      ttsText: 'هذه هي الأعمدة.',
      durationMs: 3000,
    },
    {
      id: 's3',
      sorobanValue: 0,
      activeRodIndex: -1,
      highlightBeam: true,
      badgeLines: ['العارضة'],
      caption: 'الخط الأفقي في المنتصف',
      ttsText: 'هذه هي العارضة.',
      durationMs: 3000,
    },
    {
      id: 's4',
      sorobanValue: 5,
      activeRodIndex: 1,
      badgeLines: ['5', 'الخرزة العلوية'],
      caption: 'الخرزة العلوية = 5',
      ttsText: 'الخرزة العلوية قيمتها خمسة.',
      durationMs: 3000,
    },
    {
      id: 's5',
      sorobanValue: 4,
      activeRodIndex: 1,
      badgeLines: ['4', 'الخرزات السفلية'],
      caption: 'كل خرزة سفلية = 1',
      ttsText: 'كل خرزة سفلية تساوي واحد.',
      durationMs: 3000,
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// ➗ div-1x1-m1 — 837 ÷ 3 = 279 (5 خطوات)
// ═══════════════════════════════════════════════════════════
const DIV_1X1_M1: FlashLesson = {
  id: 'div-1x1-m1',
  title: 'القسمة البسيطة',
  subtitle: '837 ÷ 3',
  operation: 'division',
  category: 'div-1',
  columns: 7,
  steps: [
    {
      id: 's1',
      sorobanValue: 837,
      activeRodIndex: 4,
      badgeLines: ['837 ÷ 3'],
      caption: 'نضع المقسوم 837 على يمين العداد',
      ttsText: 'نضع المقسوم ثمانمائة وسبعة وثلاثين.',
      durationMs: 3000,
    },
    {
      id: 's2',
      sorobanValue: 200237,
      activeRodIndex: 1,
      badgeLines: ['8 ÷ 3 = 2', '2 × 3 = 6', '8 − 6 = 2'],
      caption: 'نقسم 8، نطرح 6، نسجّل 2 في الناتج',
      ttsText: 'ثمانية تقسيم ثلاثة يساوي اثنين. اثنان في ثلاثة يساوي ستة. نطرح ستة، نسجل اثنين.',
      durationMs: 5000,
    },
    {
      id: 's3',
      sorobanValue: 270027,
      activeRodIndex: 2,
      badgeLines: ['23 ÷ 3 = 7', '7 × 3 = 21', '23 − 21 = 2'],
      caption: 'نقسم 23، نطرح 21، نسجّل 7 في الناتج',
      ttsText: 'ثلاثة وعشرون تقسيم ثلاثة يساوي سبعة. سبعة في ثلاثة يساوي واحداً وعشرين. نطرح، نسجل سبعة.',
      durationMs: 5000,
    },
    {
      id: 's4',
      sorobanValue: 279000,
      activeRodIndex: 3,
      badgeLines: ['27 ÷ 3 = 9', '9 × 3 = 27', '27 − 27 = 0'],
      caption: 'نقسم 27، نطرح 27، نسجّل 9 في الناتج',
      ttsText: 'سبعة وعشرون تقسيم ثلاثة يساوي تسعة. تسعة في ثلاثة يساوي سبعة وعشرين. نطرح، نسجل تسعة.',
      durationMs: 5000,
    },
    {
      id: 's5',
      sorobanValue: 279000,
      activeRodIndex: -1,
      badgeLines: ['✅ الناتج = 279'],
      caption: 'انتهت القسمة! الناتج: 279',
      ttsText: 'انتهت القسمة. الناتج مئتان وتسعة وسبعون.',
      durationMs: 4000,
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