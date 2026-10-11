// src/components/flash/chainsData.ts
// 🧮 سلاسل الجمع والطرح

import type { FlashCategory, FlashLesson } from './types';

const CHAIN_SIMPLE: FlashLesson = {
  id: 'chain-simple',
  title: 'السلسلة البسيطة',
  subtitle: '+2 +1 +1 −2',
  operation: 'chains',
  category: 'chains',
  columns: 2,
  layout: 'single',
  steps: [
    { id: 's1', sorobanValue: 0, badgeLines: ['+2 +1 +1 −2'], caption: 'نبدأ بمعداد فارغ', ttsText: 'نبدأ بمعداد فارغ.', durationMs: 3000 },
    { id: 's2', sorobanValue: 2, highlightColumns: [1], badgeLines: ['+2'], caption: 'ارفع خرزتين سفليتين بالإبهام', ttsText: 'نضيف اثنين. نرفع خرزتين سفليتين بالإبهام.', durationMs: 5000 },
    { id: 's3', sorobanValue: 3, highlightColumns: [1], badgeLines: ['+1'], caption: 'ارفع خرزة سفلية واحدة بالإبهام', ttsText: 'نضيف واحداً. نرفع خرزة سفلية بالإبهام.', durationMs: 5000 },
    { id: 's4', sorobanValue: 4, highlightColumns: [1], badgeLines: ['+1'], caption: 'ارفع خرزة سفلية واحدة بالإبهام', ttsText: 'نضيف واحداً. نرفع خرزة سفلية بالإبهام.', durationMs: 5000 },
    { id: 's5', sorobanValue: 2, highlightColumns: [1], badgeLines: ['−2'], caption: 'أنزل خرزتين سفليتين بالسبابة', ttsText: 'نطرح اثنين. ننزل خرزتين سفليتين بالسبابة.', durationMs: 5000 },
    { id: 's6', sorobanValue: 2, isFinal: true, badgeLines: ['✅ الناتج = 2'], caption: 'انتهت السلسلة! الناتج: 2', ttsText: 'انتهت السلسلة. الناتج اثنان.', durationMs: 5000 },
  ],
};

const CHAIN_FRIENDS5: FlashLesson = {
  id: 'chain-friends5',
  title: 'سلسلة أصدقاء 5',
  subtitle: '+4 +1 +50 −11',
  operation: 'chains',
  category: 'chains',
  columns: 2,
  layout: 'single',
  steps: [
    { id: 's1', sorobanValue: 0, badgeLines: ['+4 +1 +50 −11'], caption: 'نبدأ بمعداد فارغ', ttsText: 'نبدأ بمعداد فارغ.', durationMs: 3000 },
    { id: 's2', sorobanValue: 4, highlightColumns: [1], badgeLines: ['+4'], caption: 'ارفع 4 خرزات سفلية بالإبهام', ttsText: 'نضيف أربعة. نرفع أربع خرزات سفلية بالإبهام.', durationMs: 5000 },
    { id: 's3', sorobanValue: 5, highlightColumns: [1], movement: 'doubleDrop', badgeLines: ['+1', 'صديق 5'], caption: 'نزول مزدوج: أنزل 5 وارفع 4', ttsText: 'نضيف واحداً بأصدقاء خمسة. ننزل الخرزة العلوية، ونرفع أربع خرزات سفلية.', durationMs: 6000 },
    { id: 's4', sorobanValue: 55, highlightColumns: [0], badgeLines: ['+50'], caption: 'أضف 5 في العشرات بالإبهام', ttsText: 'نضيف خمسين. ننزل الخرزة العلوية في العشرات.', durationMs: 5000 },
    { id: 's5', sorobanValue: 44, highlightColumns: [0, 1], movement: 'doubleLift', badgeLines: ['−11'], caption: 'اطرح 10 عشرات، ثم 1 برفع مزدوج', ttsText: 'نطرح أحد عشر. نطرح عشرة في العشرات، وواحداً برفع مزدوج.', durationMs: 7000 },
    { id: 's6', sorobanValue: 44, isFinal: true, badgeLines: ['✅ الناتج = 44'], caption: 'انتهت السلسلة! الناتج: 44', ttsText: 'انتهت السلسلة. الناتج أربعة وأربعون.', durationMs: 5000 },
  ],
};

const CHAIN_FRIENDS10: FlashLesson = {
  id: 'chain-friends10',
  title: 'سلسلة أصدقاء 10',
  subtitle: '+4 +8 −1',
  operation: 'chains',
  category: 'chains',
  columns: 2,
  layout: 'single',
  steps: [
    { id: 's1', sorobanValue: 0, badgeLines: ['+4 +8 −1'], caption: 'نبدأ بمعداد فارغ', ttsText: 'نبدأ بمعداد فارغ.', durationMs: 3000 },
    { id: 's2', sorobanValue: 4, highlightColumns: [1], badgeLines: ['+4'], caption: 'ارفع 4 خرزات سفلية بالإبهام', ttsText: 'نضيف أربعة. نرفع أربع خرزات سفلية بالإبهام.', durationMs: 5000 },
    { id: 's3', sorobanValue: 12, highlightColumns: [0, 1], movement: 'doubleDrop', badgeLines: ['+8', 'صديق 10'], caption: 'أضف 1 للعشرات، وأنزل 2 من الآحاد', ttsText: 'نضيف ثمانية بأصدقاء عشرة. نرفع واحداً في العشرات، وننزل اثنين من الآحاد.', durationMs: 7000 },
    { id: 's4', sorobanValue: 11, highlightColumns: [1], badgeLines: ['−1'], caption: 'أنزل خرزة سفلية واحدة بالسبابة', ttsText: 'نطرح واحداً. ننزل خرزة سفلية بالسبابة.', durationMs: 5000 },
    { id: 's5', sorobanValue: 11, isFinal: true, badgeLines: ['✅ الناتج = 11'], caption: 'انتهت السلسلة! الناتج: 11', ttsText: 'انتهت السلسلة. الناتج أحد عشر.', durationMs: 5000 },
  ],
};

const CHAIN_COMPOUND: FlashLesson = {
  id: 'chain-compound',
  title: 'السلسلة المركبة',
  subtitle: '+6 +6 −1 −7',
  operation: 'chains',
  category: 'chains',
  columns: 2,
  layout: 'single',
  steps: [
    { id: 's1', sorobanValue: 0, badgeLines: ['+6 +6 −1 −7'], caption: 'نبدأ بمعداد فارغ', ttsText: 'نبدأ بمعداد فارغ.', durationMs: 3000 },
    { id: 's2', sorobanValue: 6, highlightColumns: [1], movement: 'closedPinch', badgeLines: ['+6'], caption: 'كماشة مغلقة: أنزل 5 وارفع 1', ttsText: 'نضيف ستة. ننزل الخرزة العلوية، ونرفع خرزة سفلية بالكماشة المغلقة.', durationMs: 6000 },
    { id: 's3', sorobanValue: 12, highlightColumns: [0, 1], movement: 'closedPinch', badgeLines: ['+6', 'مركبة'], caption: 'أضف 1 للعشرات، ثم أنزل 5 وارفع 1', ttsText: 'نضيف ستة بالقاعدة المركبة.', durationMs: 8000 },
    { id: 's4', sorobanValue: 11, highlightColumns: [1], badgeLines: ['−1'], caption: 'أنزل خرزة سفلية واحدة بالسبابة', ttsText: 'نطرح واحداً. ننزل خرزة سفلية بالسبابة.', durationMs: 5000 },
    { id: 's5', sorobanValue: 4, highlightColumns: [0, 1], movement: 'closedPinch', badgeLines: ['−7', 'مركبة'], caption: 'اطرح 1 عشرات، ثم أنزل 5 وارفع 2', ttsText: 'نطرح سبعة بالقاعدة المركبة.', durationMs: 8000 },
    { id: 's6', sorobanValue: 4, isFinal: true, badgeLines: ['✅ الناتج = 4'], caption: 'انتهت السلسلة! الناتج: 4', ttsText: 'انتهت السلسلة. الناتج أربعة.', durationMs: 5000 },
  ],
};

export const CHAIN_CATEGORY: FlashCategory = {
  id: 'chains',
  title: 'سلاسل جمع وطرح',
  emoji: '🧮',
  description: 'تدريب العمليات المتتالية',
  lessons: [CHAIN_SIMPLE, CHAIN_FRIENDS5, CHAIN_FRIENDS10, CHAIN_COMPOUND],
};

export const ALL_CHAIN_LESSONS: FlashLesson[] = CHAIN_CATEGORY.lessons;

export function getChainLessonById(id: string): FlashLesson | undefined {
  return ALL_CHAIN_LESSONS.find((l) => l.id === id);
}