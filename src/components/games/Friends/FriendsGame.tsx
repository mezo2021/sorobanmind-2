// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/Friends/FriendsGame.tsx — Shami Voice Edition
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, RotateCcw, Home, Trophy, Crown, Lightbulb,
  ArrowDown, ArrowUp, Sparkles, Award, Hand,
} from 'lucide-react';
import { GameCompanion, type HeroMood } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import { useProgressStore } from '@/store/progressStore';
import type { CharacterType } from '@/types';

// ═══ ثوابت ═══
const SESSION_SECONDS = 90;
const GAME_ID = 'friends';
const HERO_ID: CharacterType = 'sham';

type MovementType = 'pinch' | 'double_down' | 'double_up';
type FriendRule = 'f5' | 'f10' | 'combined';

interface DojoMasterProblem {
  id: string;
  expression: string;
  correct: number;
  rule: FriendRule;
  movement: MovementType;
  movementName: string;
  explain: string;
  hint: string;
  fingerInstruction: string;
}

// ═══════════════════════════════════════════════════════════════════
// بنك المسائل المكتمل والموثق (40 مسألة)
// ═══════════════════════════════════════════════════════════════════
const MASTER_PROBLEM_BANK: DojoMasterProblem[] = [
  // 🟢 1. أصدقاء الجدة 5 — بسيطة (0-15 ثانية)
  { id: 'f5-1', expression: '3 + 4 = ?', correct: 7, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 1', hint: 'صديق 4 هو 1 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 1 بالسبابة عن العارضة' },
  { id: 'f5-2', expression: '4 + 3 = ?', correct: 7, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 2', hint: 'صديق 3 هو 2 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 2 بالسبابة عن العارضة' },
  { id: 'f5-3', expression: '4 + 2 = ?', correct: 6, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 3', hint: 'صديق 2 هو 3 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 3 بالسبابة عن العارضة' },
  { id: 'f5-4', expression: '4 + 1 = ?', correct: 5, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 4', hint: 'صديق 1 هو 4 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 4 بالسبابة عن العارضة' },
  { id: 'f5-5', expression: '2 + 3 = ?', correct: 5, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 2', hint: 'صديق 3 هو 2 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 2 بالسبابة عن العارضة' },
  { id: 'f5-6', expression: '3 + 3 = ?', correct: 6, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 2', hint: 'صديق 3 هو 2 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 2 بالسبابة عن العارضة' },
  { id: 'f5-7', expression: '4 + 4 = ?', correct: 8, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 1', hint: 'صديق 4 هو 1 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 1 بالسبابة عن العارضة' },
  { id: 'f5-8', expression: '2 + 4 = ?', correct: 6, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 1', hint: 'صديق 4 هو 1 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 1 بالسبابة عن العارضة' },
  { id: 'f5-9', expression: '1 + 4 = ?', correct: 5, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 4', hint: 'صديق 1 هو 4 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 4 بالسبابة عن العارضة' },
  { id: 'f5-10', expression: '3 + 2 = ?', correct: 5, rule: 'f5', movement: 'double_down', movementName: 'النزول المزدوج بالسبابة ⚡', explain: '+5 − 3', hint: 'صديق 2 هو 3 مع الجدة 5', fingerInstruction: 'أنزل الجدة 5 نحو العارضة وأبعد 3 بالسبابة عن العارضة' },

  // 🟡 2. أصدقاء الجدة 5 — متنوعة وطرح (15-35 ثانية)
  { id: 'f5-11', expression: '6 − 2 = ?', correct: 4, rule: 'f5', movement: 'double_up', movementName: 'الصعود المزدوج بالإبهام والسبابة 🚀', explain: '−5 + 3', hint: 'صديق 2 هو 3 مع الجدة 5', fingerInstruction: 'ارفع الجدة 5 بالسبابة بعيداً عن العارضة وارفع 3 بالإبهام نحو العارضة' },
  { id: 'f5-12', expression: '7 − 3 = ?', correct: 4, rule: 'f5', movement: 'double_up', movementName: 'الصعود المزدوج بالإبهام والسبابة 🚀', explain: '−5 + 2', hint: 'صديق 3 هو 2 مع الجدة 5', fingerInstruction: 'ارفع الجدة 5 بالسبابة بعيداً عن العارضة وارفع 2 بالإبهام نحو العارضة' },
  { id: 'f5-13', expression: '8 − 4 = ?', correct: 4, rule: 'f5', movement: 'double_up', movementName: 'الصعود المزدوج بالإبهام والسبابة 🚀', explain: '−5 + 1', hint: 'صديق 4 هو 1 مع الجدة 5', fingerInstruction: 'ارفع الجدة 5 بالسبابة بعيداً عن العارضة وارفع 1 بالإبهام نحو العارضة' },
  { id: 'f5-14', expression: '5 − 1 = ?', correct: 4, rule: 'f5', movement: 'double_up', movementName: 'الصعود المزدوج بالإبهام والسبابة 🚀', explain: '−5 + 4', hint: 'صديق 1 هو 4 مع الجدة 5', fingerInstruction: 'ارفع الجدة 5 بالسبابة بعيداً عن العارضة وارفع 4 بالإبهام نحو العارضة' },
  { id: 'f5-15', expression: '6 − 3 = ?', correct: 3, rule: 'f5', movement: 'double_up', movementName: 'الصعود المزدوج بالإبهام والسبابة 🚀', explain: '−5 + 2', hint: 'صديق 3 هو 2 مع الجدة 5', fingerInstruction: 'ارفع الجدة 5 بالسبابة بعيداً عن العارضة وارفع 2 بالإبهام نحو العارضة' },
  { id: 'f5-16', expression: '7 − 2 = ?', correct: 5, rule: 'f5', movement: 'double_up', movementName: 'الصعود المزدوج بالإبهام والسبابة 🚀', explain: '−5 + 3', hint: 'صديق 2 هو 3 مع الجدة 5', fingerInstruction: 'ارفع الجدة 5 بالسبابة بعيداً عن العارضة وارفع 3 بالإبهام نحو العارضة' },
  { id: 'f5-17', expression: '8 − 3 = ?', correct: 5, rule: 'f5', movement: 'double_up', movementName: 'الصعود المزدوج بالإبهام والسبابة 🚀', explain: '−5 + 2', hint: 'صديق 3 هو 2 مع الجدة 5', fingerInstruction: 'ارفع الجدة 5 بالسبابة بعيداً عن العارضة وارفع 2 بالإبهام نحو العارضة' },
  { id: 'f5-18', expression: '5 − 2 = ?', correct: 3, rule: 'f5', movement: 'double_up', movementName: 'الصعود المزدوج بالإبهام والسبابة 🚀', explain: '−5 + 3', hint: 'صديق 2 هو 3 مع الجدة 5', fingerInstruction: 'ارفع الجدة 5 بالسبابة بعيداً عن العارضة وارفع 3 بالإبهام نحو العارضة' },

  // 🟠 3. أصدقاء العملاق 10 (35-55 ثانية)
  { id: 'f10-1', expression: '8 + 3 = ?', correct: 11, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 7', hint: 'صديق 3 هو 7 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد 7 في الآحاد بعيداً عن العارضة' },
  { id: 'f10-2', expression: '9 + 2 = ?', correct: 11, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 8', hint: 'صديق 2 هو 8 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد 8 في الآحاد بعيداً عن العارضة' },
  { id: 'f10-3', expression: '7 + 5 = ?', correct: 12, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 5', hint: 'صديق 5 هو 5 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد الجدة 5 بعيداً عن العارضة' },
  { id: 'f10-4', expression: '9 + 3 = ?', correct: 12, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 7', hint: 'صديق 3 هو 7 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد 7 بعيداً عن العارضة' },
  { id: 'f10-5', expression: '8 + 4 = ?', correct: 12, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 6', hint: 'صديق 4 هو 6 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد 6 بعيداً عن العارضة' },
  { id: 'f10-6', expression: '9 + 4 = ?', correct: 13, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 6', hint: 'صديق 4 هو 6 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد 6 بعيداً عن العارضة' },
  { id: 'f10-7', expression: '8 + 5 = ?', correct: 13, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 5', hint: 'صديق 5 هو 5 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد الجدة 5 بعيداً عن العارضة' },
  { id: 'f10-8', expression: '7 + 6 = ?', correct: 13, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 4', hint: 'صديق 6 هو 4 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد 4 بعيداً عن العارضة' },
  { id: 'f10-9', expression: '9 + 5 = ?', correct: 14, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 5', hint: 'صديق 5 هو 5 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد الجدة 5 بعيداً عن العارضة' },
  { id: 'f10-10', expression: '8 + 6 = ?', correct: 14, rule: 'f10', movement: 'double_down', movementName: 'معركة العملاق 10 🧡', explain: '+10 − 4', hint: 'صديق 6 هو 4 مع العملاق 10', fingerInstruction: 'أضف 1 للعملاق 10 بالعشرات وأبعد 4 بعيداً عن العارضة' },

  // 🔴 4. القواعد المركبة والحركات الخاطفة (70-90 ثانية)
  { id: 'comb-1', expression: '0 + 7 = ?', correct: 7, rule: 'combined', movement: 'pinch', movementName: 'الكماشة المغلقة 🤌', explain: '+5 + 2', hint: 'قرص المباشر بالسبابة والإبهام', fingerInstruction: 'اقرص الجدة 5 بالسبابة نزولاً مع خرزتين بالإبهام صعوداً نحو العارضة' },
  { id: 'comb-2', expression: '0 + 6 = ?', correct: 6, rule: 'combined', movement: 'pinch', movementName: 'الكماشة المغلقة 🤌', explain: '+5 + 1', hint: 'قرص المباشر بالسبابة والإبهام', fingerInstruction: 'اقرص الجدة 5 بالسبابة نزولاً مع خرزة واحدة بالإبهام صعوداً نحو العارضة' },
  { id: 'comb-3', expression: '0 + 8 = ?', correct: 8, rule: 'combined', movement: 'pinch', movementName: 'الكماشة المغلقة 🤌', explain: '+5 + 3', hint: 'قرص المباشر بالسبابة والإبهام', fingerInstruction: 'اقرص الجدة 5 بالسبابة نزولاً مع 3 خرزات بالإبهام صعوداً نحو العارضة' },
  { id: 'comb-4', expression: '0 + 9 = ?', correct: 9, rule: 'combined', movement: 'pinch', movementName: 'الكماشة المغلقة 🤌', explain: '+5 + 4', hint: 'قرص المباشر بالسبابة والإبهام', fingerInstruction: 'اقرص الجدة 5 بالسبابة نزولاً مع 4 خرزات بالإبهام صعوداً نحو العارضة' },
  { id: 'comb-5', expression: '6 + 7 = ?', correct: 13, rule: 'combined', movement: 'double_down', movementName: 'التركيب المزدوج مع العملاق 👑', explain: '+10 − 5 + 2', hint: 'العملاق 10 مع الجدة 5', fingerInstruction: 'أضف 1 للعملاق 10، أنزل الجدة 5 نحو العارضة وأبعد 2 عن العارضة' },
  { id: 'comb-6', expression: '5 + 6 = ?', correct: 11, rule: 'combined', movement: 'double_down', movementName: 'التركيب المزدوج مع العملاق 👑', explain: '+10 − 5 + 1', hint: 'العملاق 10 مع الجدة 5', fingerInstruction: 'أضف 1 للعملاق 10، أنزل الجدة 5 نحو العارضة وأبعد 1 عن العارضة' },
  { id: 'comb-7', expression: '7 + 7 = ?', correct: 14, rule: 'combined', movement: 'double_down', movementName: 'التركيب المزدوج مع العملاق 👑', explain: '+10 − 5 + 2', hint: 'العملاق 10 مع الجدة 5', fingerInstruction: 'أضف 1 للعملاق 10، أنزل الجدة 5 نحو العارضة وأبعد 2 عن العارضة' },
  { id: 'comb-8', expression: '8 + 7 = ?', correct: 15, rule: 'combined', movement: 'double_down', movementName: 'التركيب المزدوج مع العملاق 👑', explain: '+10 − 5 + 2', hint: 'العملاق 10 مع الجدة 5', fingerInstruction: 'أضف 1 للعملاق 10، أنزل الجدة 5 نحو العارضة وأبعد 2 عن العارضة' },
  { id: 'comb-9', expression: '9 + 6 = ?', correct: 15, rule: 'combined', movement: 'double_down', movementName: 'التركيب المزدوج مع العملاق 👑', explain: '+10 − 5 + 1', hint: 'العملاق 10 مع الجدة 5', fingerInstruction: 'أضف 1 للعملاق 10، أنزل الجدة 5 نحو العارضة وأبعد 1 عن العارضة' },
  { id: 'comb-10', expression: '8 + 8 = ?', correct: 16, rule: 'combined', movement: 'double_down', movementName: 'التركيب المزدوج مع العملاق 👑', explain: '+10 − 5 + 3', hint: 'العملاق 10 مع الجدة 5', fingerInstruction: 'أضف 1 للعملاق 10، أنزل الجدة 5 نحو العارضة وأبعد 3 عن العارضة' },
  { id: 'comb-11', expression: '9 + 7 = ?', correct: 16, rule: 'combined', movement: 'double_down', movementName: 'التركيب المزدوج مع العملاق 👑', explain: '+10 − 5 + 2', hint: 'العملاق 10 مع الجدة 5', fingerInstruction: 'أضف 1 للعملاق 10، أنزل الجدة 5 نحو العارضة وأبعد 2 عن العارضة' },
  { id: 'comb-12', expression: '9 + 8 = ?', correct: 17, rule: 'combined', movement: 'double_down', movementName: 'التركيب المزدوج مع العملاق 👑', explain: '+10 − 5 + 3', hint: 'العملاق 10 مع الجدة 5', fingerInstruction: 'أضف 1 للعملاق 10، أنزل الجدة 5 نحو العارضة وأبعد 3 عن العارضة' },
];

// ═══════════════════════════════════════════════════════════════════
// 🗣️ حوارات شام الموسعة باللهجة الشامية الأصيلة والمشكولة
// ═══════════════════════════════════════════════════════════════════
const SHAM_START_PHRASES = [
  'أَهْلاً بِكَ بِدُوجُو السُّورُوبَانِ! جَاهِزٌ لِنَكْشِفَ أَسْرَارَ الجَدَّةِ 5 وَالعِمْلَاقِ 10؟',
  'اليَوْمَ رَحْ نَصِيرُ أَبْطَالاً حَقِيقِيِّينَ بِحَرَكَاتِ الكَمَّاشَةِ وَالصُّعُودِ المُزْدَوِجِ!',
  'الأَرْقَامُ رَفَقَاتُنَا.. يَلَّا نَبْلُشَ رَقْصَةَ الأَصَابِعِ عِنْدَ العَارِضَةِ!',
  'لَكْ يَا أَهْلاً بِالبَطَلِ! افْتَحْ عُيُونَكَ مْنِيحْ، وَخَلِّينَا نَبْدَأُ الدَّرْسَ!',
  'هَيَّا يَا ذَكِيُّ! الجَدَّةُ 5 بْتِنْتَظِرُكَ عِنْدَ العَارِضَةِ لِنَلْعَبَ كَذَا لَغْزاً!',
];

const SHAM_THINKING_PHRASES = [
  'فَكِّرْ مْنِيحْ.. شُو الحَرَكَةُ الصَّحِيحَةُ عِنْدَ العَارِضَةِ؟',
  'وَيْنَ صَدِيقُ الرَّقَمِ؟ اسْتَعِنْ بِالجَدَّةِ 5 أَوْ العِمْلَاقِ 10!',
  'رَكِّزْ بِرَقْصَةِ الأَصَابِعِ وَاكْتَشِفِ السِّرَّ يَا بَطَلُ!',
  'تَذَكَّرْ مْنِيحْ: لَمَّا العَارِضَةُ بْتُقْفَلُ، بْنُنَادِي لِلصَّدِيقِ فَوْراً!',
  'حَرِّكْ عَقْلَكَ المُمَيَّزَ! الكَمَّاشَةُ وَلاَّ النُّزُولُ المُزْدَوِجُ؟',
  'عَيْنَكَ عَلَى العَارِضَةِ.. الصَّدِيقُ المَخْفِيُّ قَرِيبٌ كَتِيرْ!',
];

const SHAM_CORRECT_PHRASES = [
  'يَا عَيْنِي عَلَيْكَ! حَرَكَةٌ أُصُولِيَّةٌ بْتُطَيِّرُ العَقْلَ!',
  'بَرَافُو! ضَبَطْتَ الحَرَكَةَ عِنْدَ العَارِضَةِ تَمَاماً!',
  'مُمْتَازٌ كَتِيرْ! عَقْلُكَ شَغَّالٌ مِثْلَ الأَلْمَاسِ اليَابَانِيِّ!',
  'يَا سَلاَمْ عَلَى هَالعَبْقَرِيَّةِ! إِجَابَةٌ شَامِيَّةٌ عِزَّ الرَّفْعِ!',
  'صَحِيحٌ مِيَّة بِالمِيَّةِ! الأَصْدِقَاءُ فَرِحِينَ فِيكَ كَتِيرْ!',
  'تَحْلِيلٌ خَارِقٌ! صَرْتَ تَعْرِفُ مَكَانَ الجَدَّةِ وَالعِمْلَاقِ كَأُسْتَاذٍ!',
];

const SHAM_MILESTONE_PHRASES: Record<number, string> = {
  3: 'تَلاَتُ إِجَابَاتٍ صَحِيحَةٍ! صَرْتَ تُتْقِنُ رَقْصَةَ الكَمَّاشَةِ بَرَافُو!',
  5: 'خَمْسَةٌ صَحَّ! الحِزَامُ الأَخْضَرُ صَارَ بِإِيدَكَ يَا بَطَلُ!',
  9: 'تِسْعَةٌ صَحَّ! مَا شَاءَ اللَّهُ عَلَيْكَ.. أَدَاءُ أُسْتَاذِ دُوجُو المُمَيَّزِ!',
  13: 'تَلاَتَعْشْ! أَنْتَ أُسْطُورَةُ السُّورُوبَانِ اليَابَانِيِّ بِلاَ مُنَازِعٍ!',
};

const SHAM_ERROR_PHRASES = [
  'قَرِيبٌ كَتِيرْ! رَكِّزْ وَيْنَ اتِّجَاهُ الخَرَزَاتِ بِالنِّسْبَةِ لِلْعَارِضَةِ.',
  'بَسِيطَةٌ يَا شَرِيكِي! أَعِدِ الحِسَابَ وَشُوفْ وَيْنَ الجَدَّةُ 5.',
  'لاَ تَأْكُلْ هَمَّاً! الأَصْدِقَاءُ بِدُّهُمْ طُولَةَ بَالٍ وَتَرْكِيزاً.',
  'قَرُبْتَ كَتِيرْ! جَرِّبْ مَرَّةً ثَانِيَةً وَتَأَكَّدْ مِنْ أُصْبُعِ السَّبَّابَةِ.',
];

function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try { navigator.vibrate(pattern); } catch { /* Fallback */ }
}

function pickUniquePhrase(phrases: string[], used: Set<string>): string {
  const available = phrases.filter((p) => !used.has(p));
  if (available.length === 0) {
    used.clear();
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  const picked = available[Math.floor(Math.random() * available.length)];
  used.add(picked);
  return picked;
}

function readChildName(): string {
  if (typeof window === 'undefined') return 'بطل';
  try { return localStorage.getItem('soroban_child_name')?.trim() || 'بطل'; } catch { return 'بطل'; }
}

function getDojoMasterBelt(correct: number): { title: string; color: string } {
  if (correct >= 13) return { title: '🥋 الحزام الأسود (أستاذ السوروبان)', color: 'text-amber-300 border-amber-400/60 bg-amber-950/50' };
  if (correct >= 9) return { title: '🥋 الحزام البني (خبير العارضة)', color: 'text-orange-300 border-orange-400/60 bg-orange-950/50' };
  if (correct >= 5) return { title: '🥋 الحزام الأخضر (مبتكر الكماشة)', color: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/50' };
  if (correct >= 2) return { title: '🥋 الحزام الأزرق (صديق الجدة والعملاق)', color: 'text-sky-300 border-sky-500/60 bg-sky-950/50' };
  return { title: '🥋 الحزام الأبيض (متدرب الدوجو)', color: 'text-slate-300 border-slate-500/60 bg-slate-900' };
}

function generateOptions(correct: number): number[] {
  const wrongs = new Set<number>();
  const candidates = [correct + 1, correct - 1, correct + 2, correct - 2];
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  for (const c of shuffled) {
    if (wrongs.size >= 2) break;
    if (c > 0 && c !== correct) wrongs.add(c);
  }
  return [correct, ...wrongs].sort(() => Math.random() - 0.5);
}

interface ActiveDojoProblem extends DojoMasterProblem {
  options: number[];
  internalId: number;
}

export function FriendsGame({ onBack }: { onBack: () => void }) {
  const { speak } = useCharacterVoice(HERO_ID);
  const addXP = useProgressStore((s) => s.addXP);

  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [currentProblem, setCurrentProblem] = useState<ActiveDojoProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCheckSuccess, setIsCheckSuccess] = useState<boolean | null>(null);
  const [showDojoExplanation, setShowDojoExplanation] = useState(false);
  const [sameProblemErrors, setSameProblemErrors] = useState(0);

  const [heroMood, setHeroMood] = useState<HeroMood>('idle');
  const [heroText, setHeroText] = useState('جاهز لدخول دوجو السوروبان؟');

  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [childName] = useState<string>(readChildName);
  const [previousHigh, setPreviousHigh] = useState<HighScoreEntry | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const usedProblemsRef = useRef<Set<string>>(new Set());
  const usedPhrasesRef = useRef<Set<string>>(new Set());
  const usedThinkingRef = useRef<Set<string>>(new Set());
  const usedCorrectRef = useRef<Set<string>>(new Set());
  const usedErrorRef = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearAllTimeouts]);

  useEffect(() => {
    setPreviousHigh(getHighScore(GAME_ID));
  }, []);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const timer = setInterval(() => {
      setSessionTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    if (sessionTimeLeft === 0 && isPlaying && !isGameOver) {
      // eslint-disable-next-line no-use-before-define
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTimeLeft, isPlaying, isGameOver]);

  // ═══ جلب المسألة القادمة وفق منحنى W-Shape الموزون على 90 ثانية ═══
  const fetchNextProblem = useCallback((overrideRule?: FriendRule) => {
    const elapsed = SESSION_SECONDS - sessionTimeLeft;
    let targetRule: FriendRule = overrideRule || 'f5';

    if (!overrideRule) {
      if (elapsed <= 15) {
        targetRule = 'f5';
      } else if (elapsed <= 35) {
        targetRule = 'f5';
      } else if (elapsed <= 55) {
        targetRule = 'f10';
      } else if (elapsed <= 70) {
        targetRule = 'f5';
      } else {
        targetRule = 'combined';
      }
    }

    let candidatePool = MASTER_PROBLEM_BANK.filter(
      (p) => p.rule === targetRule && !usedProblemsRef.current.has(p.id)
    );

    if (candidatePool.length === 0) {
      candidatePool = MASTER_PROBLEM_BANK.filter((p) => p.rule === targetRule);
      if (candidatePool.length === 0) candidatePool = [...MASTER_PROBLEM_BANK];
      usedProblemsRef.current.clear();
    }

    const selected = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    usedProblemsRef.current.add(selected.id);

    const activeProblem: ActiveDojoProblem = {
      ...selected,
      options: generateOptions(selected.correct),
      internalId: Date.now() + Math.random(),
    };

    setCurrentProblem(activeProblem);
    setSelectedAnswer(null);
    setIsCheckSuccess(null);
    setShowDojoExplanation(false);
    setSameProblemErrors(0);
    setHeroMood('thinking');

    const thinkMsg = pickUniquePhrase(SHAM_THINKING_PHRASES, usedThinkingRef.current);
    setHeroText(thinkMsg);
  }, [sessionTimeLeft]);

  const endGame = useCallback(() => {
    setIsGameOver(true);
    setIsPlaying(false);
    clearAllTimeouts();

    const earned = correctCount >= 10 ? 5 : correctCount >= 5 ? 3 : 2;
    setXpEarned(earned);
    addXP(earned);

    const recordResult = addScore(GAME_ID, childName, correctCount, HERO_ID);
    if (recordResult.isNewRecord) {
      setIsNewRecord(true);
      setPreviousHigh(recordResult.previousTop);
      speak('رقم قياسي أسطوري في دوجو السوروبان!');
    } else {
      setIsNewRecord(false);
      const endMsg = 'أداء ياباني باهر يرفع الراس يا بطل!';
      setHeroText(endMsg);
      speak(endMsg);
    }

    setHeroMood('celebrating');
    vibrate([0, 40, 40, 40, 40, 80]);
  }, [correctCount, addXP, speak, clearAllTimeouts, childName]);

  const handleStartGame = useCallback(() => {
    clearAllTimeouts();
    usedProblemsRef.current.clear();
    usedPhrasesRef.current.clear();
    usedThinkingRef.current.clear();
    usedCorrectRef.current.clear();
    usedErrorRef.current.clear();

    setIsPlaying(true);
    setIsGameOver(false);
    setIsNewRecord(false);
    setSessionTimeLeft(SESSION_SECONDS);
    setCorrectCount(0);
    setSameProblemErrors(0);
    setXpEarned(0);
    setHeroMood('excited');

    const startMsg = pickUniquePhrase(SHAM_START_PHRASES, usedPhrasesRef.current);
    setHeroText(startMsg);
    speak(startMsg);
    vibrate(50);

    addTimeout(() => {
      fetchNextProblem();
    }, 1200);
  }, [addTimeout, fetchNextProblem, speak, clearAllTimeouts]);

  const handleAnswer = useCallback((answer: number) => {
    if (selectedAnswer !== null || !currentProblem || isCheckSuccess !== null) return;
    setSelectedAnswer(answer);

    const isCorrect = answer === currentProblem.correct;

    if (isCorrect) {
      vibrate(40);
      setIsCheckSuccess(true);
      const newCount = correctCount + 1;
      setCorrectCount(newCount);
      setHeroMood('celebrating');

      const correctMsg = pickUniquePhrase(SHAM_CORRECT_PHRASES, usedCorrectRef.current);
      setHeroText(correctMsg);

      const milestone = SHAM_MILESTONE_PHRASES[newCount];
      if (milestone) {
        setHeroText(milestone);
        speak(milestone);
      } else if (newCount % 3 === 0) {
        speak(correctMsg);
      }

      addTimeout(() => {
        fetchNextProblem();
      }, 800);
    } else {
      vibrate([0, 30, 30, 30]);
      setIsCheckSuccess(false);
      setHeroMood('sad');

      const newErrorCount = sameProblemErrors + 1;
      setSameProblemErrors(newErrorCount);
      setShowDojoExplanation(true);

      const errorMsg = pickUniquePhrase(SHAM_ERROR_PHRASES, usedErrorRef.current);
      setHeroText(errorMsg);

      if (newErrorCount >= 3) {
        addTimeout(() => {
          fetchNextProblem('f5');
        }, 1800);
      } else {
        addTimeout(() => {
          setIsCheckSuccess(null);
          setSelectedAnswer(null);
          setShowDojoExplanation(false);
        }, 2000);
      }
    }
  }, [selectedAnswer, currentProblem, isCheckSuccess, correctCount, sameProblemErrors, fetchNextProblem, speak, addTimeout]);

  const handleReplay = useCallback(() => {
    const state = useProgressStore.getState();
    if (state.tickets >= 1) {
      state.consumeTicket();
      handleStartGame();
    } else if (state.ticketXP >= 10) {
      state.buyTicket();
      useProgressStore.getState().consumeTicket();
      handleStartGame();
    } else {
      onBack();
    }
  }, [handleStartGame, onBack]);

  const currentBelt = getDojoMasterBelt(correctCount);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/40 to-slate-950 text-white flex flex-col select-none font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* ═══ الرأس العلوي ═══ */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 sticky top-0 z-20 bg-slate-900/85 backdrop-blur-md border-b border-emerald-500/30">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0"
          style={{ touchAction: 'manipulation' }}
          aria-label="رجوع"
        >
          <ArrowRight className="w-6 h-6 text-emerald-400" />
        </button>

        <div className="flex-1 flex justify-center">
          <GameCompanion heroId={HERO_ID} mood={heroMood} customText={heroText} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 font-bold text-sm flex items-center gap-1">
            ⏳ <span className="tabular-nums">{sessionTimeLeft}</span>
          </div>
          <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center gap-1">
            🤝 <span className="tabular-nums">{correctCount}</span>
          </div>
        </div>
      </div>

      {/* ═══ شاشة البداية ═══ */}
      {!isPlaying && !isGameOver && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="w-28 h-28 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-6xl shadow-2xl shadow-emerald-500/30">
              🥋
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-400">
              دُوجُو السُّورُوبَانِ اليَابَانِيِّ
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xs leading-relaxed">
              تعلم أسرار الجدة 5 والعملاق 10، وأتقن الكماشة المغلقة والصعود المزدوج عند العارضة!
            </p>
          </motion.div>

          <HighScoreBadge gameId={GAME_ID} variant="full" />

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleStartGame}
            className="w-full max-w-xs bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xl py-4 rounded-2xl shadow-xl shadow-emerald-500/30 active:scale-95 transition"
            style={{ touchAction: 'manipulation' }}
          >
            ▶️ ادْخُلِ الدُّوجُو
          </motion.button>
        </div>
      )}

      {/* ═══ منطقة اللعب ═══ */}
      {isPlaying && currentProblem && (
        <div className="flex-1 flex flex-col items-center justify-between gap-4 px-4 py-4 max-w-md mx-auto w-full">
          {/* بطاقة السؤال ورتبة الحزام */}
          <motion.div
            key={`q-${currentProblem.internalId}`}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-900/90 border-2 border-emerald-500/40 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2"
          >
            <div className="flex justify-between items-center w-full mb-1">
              <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-md ${currentBelt.color}`}>
                <Award className="w-4 h-4 text-amber-400" />
                <span>{currentBelt.title}</span>
              </div>
              <div className="px-2.5 py-1 rounded-full border border-sky-500/40 bg-sky-950/80 text-sky-300 text-[11px] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>{currentProblem.movementName}</span>
              </div>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-amber-300 tracking-wider font-mono my-2">
              {currentProblem.expression}
            </div>
          </motion.div>

          {/* الخيارات الثلاثة */}
          <div className="w-full space-y-3">
            {currentProblem.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentProblem.correct;
              const showAsCorrect = isSelected && isCorrect && isCheckSuccess === true;
              const showAsWrong = isSelected && !isCorrect;

              let cls =
                'w-full py-5 rounded-2xl font-black text-3xl text-white border-2 transition shadow-lg flex items-center justify-center tabular-nums active:scale-[0.98]';

              if (showAsCorrect) {
                cls += ' bg-emerald-500 border-emerald-300 shadow-emerald-500/50 scale-[1.02]';
              } else if (showAsWrong) {
                cls += ' bg-rose-600 border-rose-300 shadow-rose-500/50';
              } else if (selectedAnswer !== null) {
                cls += ' bg-white/5 border-white/10 text-white/40';
              } else {
                cls += ' bg-gradient-to-l from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 border-emerald-400/40';
              }

              return (
                <motion.button
                  key={opt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * currentProblem.options.indexOf(opt) }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(opt)}
                  disabled={selectedAnswer !== null}
                  className={cls}
                  style={{ touchAction: 'manipulation' }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {/* بطاقة الشرح الحركي البصري (تظهر عند الخطأ فقط صامتاً) */}
          <AnimatePresence>
            {showDojoExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="w-full bg-amber-950/60 border-2 border-amber-400/70 rounded-2xl p-4 shadow-2xl flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 border-b border-amber-400/30 pb-2">
                  <Lightbulb className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span className="text-sm font-bold text-amber-200">
                    شرح القاعدة اليابانية: {currentProblem.hint}
                  </span>
                </div>

                <div className="flex items-center justify-between my-1 bg-black/40 p-2.5 rounded-xl border border-amber-500/30">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {currentProblem.movement === 'pinch' ? '🤌' : currentProblem.movement === 'double_down' ? '⚡' : '🚀'}
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      {currentProblem.movementName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2" dir="ltr">
                    <ArrowDown className="w-4 h-4 text-emerald-400" />
                    <span className="text-lg font-black text-emerald-300 font-mono">
                      {currentProblem.explain}
                    </span>
                    <ArrowUp className="w-4 h-4 text-rose-400" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-amber-200 font-semibold bg-amber-900/40 p-2 rounded-lg">
                  <Hand className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>توجيه العارضة: {currentProblem.fingerInstruction}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ═══ مودال النهاية ═══ */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-4 border-2 ${
                isNewRecord
                  ? 'bg-gradient-to-br from-amber-900/40 via-slate-800 to-amber-900/40 border-amber-400/70'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className="text-5xl">🥋</div>

              {isNewRecord ? (
                <>
                  <h2 className="text-2xl font-black text-amber-300">🎉 رقم قياسي في الدوجو!</h2>
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-amber-400/30 p-4 flex flex-col gap-2">
                    {previousHigh && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-slate-400" />
                          كنت:
                        </span>
                        <span className="text-slate-300 font-bold tabular-nums">
                          {previousHigh.value} ({previousHigh.name})
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-base">
                      <span className="text-amber-300 flex items-center gap-1.5 font-bold">
                        <Trophy className="w-4 h-4" />
                        الآن:
                      </span>
                      <span className="text-amber-300 font-black text-lg tabular-nums">
                        {correctCount} ({childName})
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-emerald-400">انتهى تدريب الدوجو!</h2>
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-4 flex flex-col gap-2">
                    <p className="text-slate-400 text-xs">الرتبة المحققة:</p>
                    <p className="text-amber-400 font-black text-base">{currentBelt.title}</p>
                    <div className="h-px bg-slate-700/50 my-1" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">الإجابات الصحيحة:</span>
                      <span className="text-emerald-400 font-bold text-base tabular-nums">
                        {correctCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">طاقة XP:</span>
                      <span className="text-amber-400 font-bold text-base tabular-nums">
                        +{xpEarned} XP
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3 w-full mt-1">
                <button
                  onClick={handleReplay}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                  style={{ touchAction: 'manipulation' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  إعادة التدريب
                </button>
                <button
                  onClick={onBack}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2"
                  style={{ touchAction: 'manipulation' }}
                >
                  <Home className="w-4 h-4" />
                  مدينة الألعاب
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FriendsGame;
