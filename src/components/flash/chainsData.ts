// src/components/flash/chainsData.ts
// 🧮 سلاسل الجمع والطرح — معداد واحد
// 📖 الإبهام 👍 = يرفع 1-4 سفلية لتلامس العارضة
// 📖 السبابة ☝️ = تنزل 1-4 بعيداً · ترفع/تنزل 5
// فهارس: 0=عشرات · 1=آحاد

import type { FlashCategory, FlashLesson } from './types';

// ═══════════════════════════════════════════════════════════
// 🧮 السلسلة 1 — البسيطة (+2 +1 +1 −2 = 2)
// ═══════════════════════════════════════════════════════════
const CHAIN_SIMPLE: FlashLesson = {
  id: 'chain-simple',
  title: 'السلسلة البسيطة', titleEn: 'Simple Chain',
  subtitle: '+2 +1 +1 −2',
  operation: 'chains',
  category: 'chains',
  columns: 2,
  layout: 'single',
  steps: [
    { id: 's1', sorobanValue: 0, badgeLines: ['+2 +1 +1 −2'], caption: 'نبدأ بمعداد فارغ', captionEn: 'Start with an empty abacus', ttsText: 'نبدأ بمعداد فارغ.', durationMs: 3000 },
    { id: 's2', sorobanValue: 2, highlightColumns: [1], badgeLines: ['+2'], caption: '👍 إبهام: ارفع خرزتين سفلية لتلامسا العارضة', captionEn: '👍 Thumb: lift 2 lower beads to touch the bar', ttsText: 'نضيف اثنين. نرفع خرزتين سفلية بالإبهام لتلامسا العارضة.', durationMs: 5000 },
    { id: 's3', sorobanValue: 3, highlightColumns: [1], badgeLines: ['+1'], caption: '👍 إبهام: ارفع خرزة سفلية لتلامس العارضة', captionEn: '👍 Thumb: lift 1 lower bead to touch the bar', ttsText: 'نضيف واحداً. نرفع خرزة سفلية بالإبهام لتلامس العارضة.', durationMs: 5000 },
    { id: 's4', sorobanValue: 4, highlightColumns: [1], badgeLines: ['+1'], caption: '👍 إبهام: ارفع خرزة سفلية لتلامس العارضة', captionEn: '👍 Thumb: lift 1 lower bead to touch the bar', ttsText: 'نضيف واحداً. نرفع خرزة سفلية بالإبهام لتلامس العارضة.', durationMs: 5000 },
    { id: 's5', sorobanValue: 2, highlightColumns: [1], badgeLines: ['−2'], caption: '☝️ سبابة: أنزل خرزتين سفلية بعيداً عن العارضة', captionEn: '☝️ Index: lower 2 lower beads away from the bar', ttsText: 'نطرح اثنين. ننزل خرزتين سفلية بالسبابة بعيداً عن العارضة.', durationMs: 5000 },
    { id: 's6', sorobanValue: 2, isFinal: true, badgeLines: ['✅ الناتج = 2'], caption: 'انتهت السلسلة! الناتج: 2', captionEn: 'Chain complete! Result: 2', ttsText: 'انتهت السلسلة. الناتج اثنان.', durationMs: 5000 },
  ],
};

// ═══════════════════════════════════════════════════════════
// 🧮 السلسلة 2 — أصدقاء 5 (+4 +1 +50 −11 = 44)
// ═══════════════════════════════════════════════════════════
const CHAIN_FRIENDS5: FlashLesson = {
  id: 'chain-friends5',
  title: 'سلسلة أصدقاء 5', titleEn: 'Friends of 5 Chain',
  subtitle: '+4 +1 +50 −11',
  operation: 'chains',
  category: 'chains',
  columns: 2,
  layout: 'single',
  steps: [
    { id: 's1', sorobanValue: 0, badgeLines: ['+4 +1 +50 −11'], caption: 'نبدأ بمعداد فارغ', captionEn: 'Start with an empty abacus', ttsText: 'نبدأ بمعداد فارغ.', durationMs: 3000 },
    { id: 's2', sorobanValue: 4, highlightColumns: [1], badgeLines: ['+4'], caption: '👍 إبهام: ارفع 4 خرزات سفلية لتلامس العارضة', captionEn: '👍 Thumb: lift 4 lower beads to touch the bar', ttsText: 'نضيف أربعة. نرفع أربع خرزات سفلية بالإبهام لتلامس العارضة.', durationMs: 5000 },
    { id: 's3', sorobanValue: 5, highlightColumns: [1], badgeLines: ['+1', 'صديق 5', '⬇️⬇️ نزول مزدوج'], caption: '☝️ سبابة ↓ 5 لتلامس العارضة + ☝️ سبابة ↓ 4 بعيداً عن العارضة (نزول مزدوج)', captionEn: '☝️ Index ↓ 5 to touch the bar + ☝️ Index ↓ 4 away from the bar (double descent)', ttsText: 'نضيف واحداً بأصدقاء خمسة. نزول مزدوج: ننزل خمسة بالسبابة لتلامس العارضة، وننزل أربع خرزات سفلية بعيداً عن العارضة.', durationMs: 7000 },
    { id: 's4', sorobanValue: 55, highlightColumns: [0], badgeLines: ['+50'], caption: '☝️ سبابة: أنزل 5 في العشرات لتلامس العارضة', captionEn: '☝️ Index: bring down 5 in the tens to touch the bar', ttsText: 'نضيف خمسين. ننزل الخرزة العلوية في العشرات لتلامس العارضة.', durationMs: 5000 },
    { id: 's5', sorobanValue: 44, highlightColumns: [0, 1], badgeLines: ['−11', 'مركبة', '⬆️⬆️ رفع مزدوج'], caption: 'على العشرات: ☝️ سبابة ↑ 5 بعيداً عن العارضة + 👍 إبهام ↑ 4 لتلامس العارضة · وعلى الآحاد نفس الحركة (رفع مزدوج)', captionEn: 'On the tens: ☝️ Index ↑ 5 away from the bar + 👍 Thumb ↑ 4 to touch the bar · and the same move on the units (double lift)', ttsText: 'نطرح أحد عشر. رفع مزدوج على العشرات والآحاد: نرفع الخرزة العلوية بالسبابة بعيداً عن العارضة، ونرفع أربع خرزات سفلية بالإبهام لتلامس العارضة.', durationMs: 8000 },
    { id: 's6', sorobanValue: 44, isFinal: true, badgeLines: ['✅ الناتج = 44'], caption: 'انتهت السلسلة! الناتج: 44', captionEn: 'Chain complete! Result: 44', ttsText: 'انتهت السلسلة. الناتج أربعة وأربعون.', durationMs: 5000 },
  ],
};

// ═══════════════════════════════════════════════════════════
// 🧮 السلسلة 3 — أصدقاء 10 (+4 +8 −1 = 11)
// ═══════════════════════════════════════════════════════════
const CHAIN_FRIENDS10: FlashLesson = {
  id: 'chain-friends10',
  title: 'سلسلة أصدقاء 10', titleEn: 'Friends of 10 Chain',
  subtitle: '+4 +8 −1',
  operation: 'chains',
  category: 'chains',
  columns: 2,
  layout: 'single',
  steps: [
    { id: 's1', sorobanValue: 0, badgeLines: ['+4 +8 −1'], caption: 'نبدأ بمعداد فارغ', captionEn: 'Start with an empty abacus', ttsText: 'نبدأ بمعداد فارغ.', durationMs: 3000 },
    { id: 's2', sorobanValue: 4, highlightColumns: [1], badgeLines: ['+4'], caption: '👍 إبهام: ارفع 4 خرزات سفلية لتلامس العارضة', captionEn: '👍 Thumb: lift 4 lower beads to touch the bar', ttsText: 'نضيف أربعة. نرفع أربع خرزات سفلية بالإبهام لتلامس العارضة.', durationMs: 5000 },
    { id: 's3', sorobanValue: 12, highlightColumns: [0, 1], badgeLines: ['+8', 'صديق 10'], caption: '👍 إبهام ↑ 1 عشرات لتلامس العارضة · ☝️ سبابة ↓ 2 آحاد بعيداً عن العارضة', captionEn: '👍 Thumb ↑ 1 ten to touch the bar · ☝️ Index ↓ 2 units away from the bar', ttsText: 'نضيف ثمانية بأصدقاء عشرة. نرفع واحداً في العشرات لتلامس العارضة، وننزل اثنين من الآحاد بعيداً عن العارضة.', durationMs: 7000 },
    { id: 's4', sorobanValue: 11, highlightColumns: [1], badgeLines: ['−1'], caption: '☝️ سبابة: أنزل خرزة سفلية بعيداً عن العارضة', captionEn: '☝️ Index: lower 1 lower bead away from the bar', ttsText: 'نطرح واحداً. ننزل خرزة سفلية بالسبابة بعيداً عن العارضة.', durationMs: 5000 },
    { id: 's5', sorobanValue: 11, isFinal: true, badgeLines: ['✅ الناتج = 11'], caption: 'انتهت السلسلة! الناتج: 11', captionEn: 'Chain complete! Result: 11', ttsText: 'انتهت السلسلة. الناتج أحد عشر.', durationMs: 5000 },
  ],
};

// ═══════════════════════════════════════════════════════════
// 🧮 السلسلة 4 — المركبة (+6 +6 +1 −7 = 6)
// ═══════════════════════════════════════════════════════════
const CHAIN_COMPOUND: FlashLesson = {
  id: 'chain-compound',
  title: 'السلسلة المركبة', titleEn: 'Compound Chain',
  subtitle: '+6 +6 +1 −7',
  operation: 'chains',
  category: 'chains',
  columns: 2,
  layout: 'single',
  steps: [
    { id: 's1', sorobanValue: 0, badgeLines: ['+6 +6 +1 −7'], caption: 'نبدأ بمعداد فارغ', captionEn: 'Start with an empty abacus', ttsText: 'نبدأ بمعداد فارغ.', durationMs: 3000 },
    { id: 's2', sorobanValue: 6, highlightColumns: [1], badgeLines: ['+6', '🗜️ كماشة مغلقة'], caption: '☝️ سبابة ↓ 5 لتلامس العارضة + 👍 إبهام ↑ 1 لتلامس العارضة (كماشة مغلقة)', captionEn: '☝️ Index ↓ 5 to touch the bar + 👍 Thumb ↑ 1 to touch the bar (closed pinch)', ttsText: 'نضيف ستة. ننزل الخرزة العلوية لتلامس العارضة، ونرفع خرزة سفلية بالكماشة المغلقة.', durationMs: 7000 },
    { id: 's3', sorobanValue: 12, highlightColumns: [0, 1], badgeLines: ['+6', 'مركبة', '+6 = +10 − 4'], caption: '👍 إبهام ↑ 1 عشرات لتلامس العارضة · ☝️ سبابة ↑ 5 بعيداً + 👍 إبهام ↑ 1 لتلامس (رفع مزدوج على الآحاد)', captionEn: '👍 Thumb ↑ 1 ten to touch the bar · ☝️ Index ↑ 5 away + 👍 Thumb ↑ 1 to touch (double lift on the units)', ttsText: 'نضيف ستة بالقاعدة المركبة. نرفع واحداً في العشرات لتلامس العارضة، ثم رفع مزدوج في الآحاد: نرفع خمسة بالسبابة بعيداً عن العارضة، ونرفع واحداً بالإبهام لتلامس العارضة.', durationMs: 9000 },
    { id: 's4', sorobanValue: 13, highlightColumns: [1], badgeLines: ['+1'], caption: '👍 إبهام: ارفع خرزة سفلية لتلامس العارضة', captionEn: '👍 Thumb: lift 1 lower bead to touch the bar', ttsText: 'نضيف واحداً. نرفع خرزة سفلية بالإبهام لتلامس العارضة.', durationMs: 5000 },
    { id: 's5', sorobanValue: 6, highlightColumns: [0, 1], badgeLines: ['−7', 'مركبة'], caption: '☝️ سبابة ↓ 1 عشرات بعيداً عن العارضة · ثم ☝️ سبابة ↓ 5 آحاد لتلامس + ☝️ سبابة ↓ 2 آحاد بعيداً (نزول مزدوج)', captionEn: '☝️ Index ↓ 1 ten away from the bar · then ☝️ Index ↓ 5 units to touch + ☝️ Index ↓ 2 units away (double descent)', ttsText: 'نطرح سبعة بالقاعدة المركبة. ننزل واحداً في العشرات بعيداً عن العارضة، ثم ننزل خمسة في الآحاد لتلامس العارضة، وننزل اثنين بعيداً عن العارضة.', durationMs: 9000 },
    { id: 's6', sorobanValue: 6, isFinal: true, badgeLines: ['✅ الناتج = 6'], caption: 'انتهت السلسلة! الناتج: 6', captionEn: 'Chain complete! Result: 6', ttsText: 'انتهت السلسلة. الناتج ستة.', durationMs: 5000 },
  ],
};

export const CHAIN_CATEGORY: FlashCategory = {
  id: 'chains',
  title: 'سلاسل جمع وطرح', titleEn: 'Addition & Subtraction Chains',
  emoji: '🧮',
  description: 'تدريب العمليات المتتالية', descriptionEn: 'Practice successive operations',
  lessons: [CHAIN_SIMPLE, CHAIN_FRIENDS5, CHAIN_FRIENDS10, CHAIN_COMPOUND],
};

export const ALL_CHAIN_LESSONS: FlashLesson[] = CHAIN_CATEGORY.lessons;

export function getChainLessonById(id: string): FlashLesson | undefined {
  return ALL_CHAIN_LESSONS.find((l) => l.id === id);
}