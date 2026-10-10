// src/components/flash/flashData.ts
// 🎬 بيانات الفلاشات التعليمية

import type { FlashCategory, FlashLesson } from './types';

// ═══════════════════════════════════════════════════════════
// 🎬 الفلاش 1: أجزاء السوروبان (أساسيات)
// ═══════════════════════════════════════════════════════════
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
      badgePrimary: '👋 مرحباً',
      caption: 'سنتعلم أجزاء السوروبان',
      ttsText: 'مرحباً يا بطل. سنتعلم أجزاء السوروبان.',
      durationMs: 2500,
    },
    {
      id: 's2',
      sorobanValue: 0,
      activeRodIndex: 1,
      badgePrimary: 'الأعمدة',
      caption: 'الخطوط الرأسية التي تتحرك عليها الخرزات',
      ttsText: 'هذه هي الأعمدة، الخطوط الرأسية التي تتحرك عليها الخرزات.',
      durationMs: 3000,
    },
    {
      id: 's3',
      sorobanValue: 0,
      activeRodIndex: 1,
      badgePrimary: 'العارضة',
      caption: 'الخط الأفقي في المنتصف',
      ttsText: 'هذه هي العارضة، الخط الأفقي في المنتصف.',
      durationMs: 3000,
    },
    {
      id: 's4',
      sorobanValue: 5,
      activeRodIndex: 1,
      badgePrimary: '5',
      badgeSecondary: 'الخرزة العلوية',
      caption: 'الخرزة العلوية قيمتها 5',
      ttsText: 'الخرزة العلوية قيمتها خمسة.',
      durationMs: 3000,
    },
    {
      id: 's5',
      sorobanValue: 4,
      activeRodIndex: 1,
      badgePrimary: '4',
      badgeSecondary: 'الخرزات السفلية',
      caption: 'كل خرزة سفلية قيمتها 1',
      ttsText: 'كل خرزة سفلية قيمتها واحد.',
      durationMs: 3000,
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// 🎬 الفلاش 2: القسمة البسيطة — 84 ÷ 2 (S07-m1)
// ═══════════════════════════════════════════════════════════
const DIV_1X1_M1: FlashLesson = {
  id: 'div-1x1-m1',
  title: 'القسمة البسيطة',
  subtitle: '84 ÷ 2',
  operation: 'division',
  category: 'div-1',
  columns: 3,
  steps: [
    {
      id: 's1',
      sorobanValue: 84,
      activeRodIndex: 0,
      badgePrimary: '84 ÷ 2',
      caption: 'نبدأ بوضع المقسوم 84 على العداد',
      ttsText: 'نبدأ بوضع المقسوم أربعة وثمانين على العداد.',
      durationMs: 3000,
    },
    {
      id: 's2',
      sorobanValue: 84,
      activeRodIndex: 0,
      badgePrimary: '8 ÷ 2 = 4',
      badgeSecondary: '4 × 2 = 8',
      caption: 'نقسم 8 عشرات على 2، الناتج 4',
      ttsText: 'نقسم ثمانية على اثنين، الناتج أربعة.',
      durationMs: 3500,
    },
    {
      id: 's3',
      sorobanValue: 4,
      activeRodIndex: 0,
      badgePrimary: '8 − 8 = 0',
      caption: 'نطرح 8، يبقى 0. الناتج الجزئي: 4 عشرات',
      ttsText: 'نطرح ثمانية، يبقى صفر.',
      durationMs: 3000,
    },
    {
      id: 's4',
      sorobanValue: 4,
      activeRodIndex: 1,
      badgePrimary: '4 ÷ 2 = 2',
      badgeSecondary: '2 × 2 = 4',
      caption: 'نقسم 4 آحاد على 2، الناتج 2',
      ttsText: 'نقسم أربعة على اثنين، الناتج اثنان.',
      durationMs: 3500,
    },
    {
      id: 's5',
      sorobanValue: 42,
      activeRodIndex: 1,
      badgePrimary: '4 − 4 = 0',
      caption: 'نطرح 4، يبقى 0. الناتج النهائي: 42',
      ttsText: 'نطرح أربعة، يبقى صفر. الناتج النهائي اثنان وأربعون.',
      durationMs: 4000,
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// 🗂️ الفئات
// ═══════════════════════════════════════════════════════════
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