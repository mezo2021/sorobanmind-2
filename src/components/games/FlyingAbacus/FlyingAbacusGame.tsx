// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/FlyingAbacus/FlyingAbacusGame.tsx — v2 Expanded+ HS
// ═══════════════════════════════════════════════════════════════════
//
// ما تغيّر عن v2 Expanded+:
//   1. استيراد HighScoreBadge + addScore + getHighScore
//   2. قراءة اسم الطفل + الرقم القياسي
//   3. عرض HighScoreBadge في شاشة البداية
//   4. حفظ الرقم عند endGame + كشف الرقم الجديد
//   5. احتفال في مودال النهاية عند كسر الرقم
//
// لا يلمس منطق اللعبة · لا يلمس الواجهة الحالية.
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Home, Trophy, Crown } from 'lucide-react';
import { GameCompanion, type HeroMood } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import {
  addScore,
  getHighScore,
  type HighScoreEntry,
} from '../highScoreStore';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import { useProgressStore } from '@/store/progressStore';
import type { CharacterType } from '@/types';

// ═══ ثوابت ═══
const SESSION_SECONDS = 60;
const VALID_HEROES: CharacterType[] = ['sham', 'rayan', 'bana', 'joud'];
const GAME_ID = 'flying-abacus';

// ═══════════════════════════════════════════════════════════════════
// مكتبات العبارات (كما هي)
// ═══════════════════════════════════════════════════════════════════

const START_PHRASES = [
  'مُسْتَعِدٌّ؟ انْطَلِقْ!',
  'هَيَّا يَا بَطَل!',
  'انْطَلِقْ بِسُرْعَة!',
  'هَيَّا نَبْدَأ!',
  'هَيَّا نَرَى قُوَّتَك!',
  'اسْتَعِدْ لِلطَّيَرَان!',
  'هَيَّا نُلَاعِبُ الأَرْقَام!',
  'أَنَا مَعَك، هَيَّا!',
  'اسْتَعِدْ... انْطَلِق!',
  'هَيَّا نُثْبِتُ سُرْعَتَنَا!',
];

const THINKING_PHRASES = [
  'رَكِّزْ جَيِّداً...',
  'رَاقِبْ بِعِنَايَة...',
  'انْظُرْ بِتَرْكِيز...',
  'تَمَهَّلْ قَلِيلاً...',
  'انْتَبِهْ لِلْخَرَزَات...',
  'انْظُرْ بِدِقَّة...',
  'رَاقِبِ المِعْدَاد...',
  'كُنْ مُنْتَبِهاً...',
];

const ASK_PHRASES = [
  'مَا هِيَ القِيمَةُ؟',
  'كَمْ تُسَاوِي؟',
  'مَا الرَّقَمُ؟',
  'مَا القِيمَةُ الَّتِي رَأَيْتَهَا؟',
  'كَمْ عَدَدُ الخَرَزَات؟',
  'مَا النَّاتِج؟',
  'أَخْبِرْنِي بِالْقِيمَة!',
  'مَا هَذَا الرَّقَم؟',
];

const CORRECT_PHRASES = [
  'أَحْسَنْتَ!',
  'جَيِّد!',
  'مُمْتَاز!',
  'رَائِع!',
  'بَرَافُو!',
  'عَمَلٌ رَائِع!',
  'سَرِيعٌ كَالْبَرْق!',
  'إِجَابَةٌ صَحِيحَة!',
  'مَا شَاءَ الله!',
  'أَنْتَ ذَكِيّ!',
  'أَحْسَنْتَ يَا بَطَل!',
  'رَائِع جِدّاً!',
];

const ERROR_PHRASES = [
  'بَسِيطَةٌ، رَكِّزْ!',
  'لَا بَأْسَ، حَاوِلْ مُجَدَّداً!',
  'رَكِّزْ قَلِيلاً!',
  'المُحَاوَلَةُ القَادِمَة!',
  'هَيَّا، رَكِّزْ أَكْثَر!',
  'لَا تَسْتَعْجِلْ!',
  'انْتَبِهْ لِلْمِعْدَاد!',
  'قَرِيب! حَاوِلْ مَرَّةً أُخْرَى!',
  'لَا بَأْس، المُهِمُّ المُحَاوَلَة!',
  'خُذْ نَفَساً، ثُمَّ حَاوِلْ!',
  'المَرَّةُ القَادِمَة أَفْضَل!',
  'رَكِّزْ أَكْثَر، أَنْتَ تَقْدِر!',
];

const STREAK_PHRASES: Record<number, string> = {
  3: 'ثَلَاثَة! السُّرْعَةُ القُصْوَى!',
  5: 'خَمْسَة! كَفُو!',
  8: 'ثَمَانِيَة! مُمْتَاز!',
  10: 'عَشَرَة! رَائِع!',
  12: 'اثْنَا عَشَر! خَارِق!',
  15: 'خَمْسَةَ عَشَر! عَبْقَرِي!',
  18: 'ثَمَانِيَةَ عَشَر! مُذْهِل!',
  20: 'عِشْرُونَ! أُسْطُورِي!',
  25: 'خَمْسَةٌ وَعِشْرُونَ! لَا يُوصَف!',
};

const END_PHRASES_HIGH = [
  'مُمْتَاز! أَنْتَ بَطَلٌ حَقِيقِيّ!',
  'رَائِع! أَدَاءٌ خَارِق!',
  'أَنْتَ نَجْمُ السُّورُوبَان!',
];
const END_PHRASES_MID = [
  'أَحْسَنْتَ! أَدَاءٌ رَائِع!',
  'عَمَلٌ جَيِّد!',
  'أَنْتَ تَتَحَسَّن!',
];
const END_PHRASES_LOW = [
  'جَيِّد! وَاصِل التَّدْرِيب!',
  'مُحَاوَلَةٌ طَيِّبَة!',
  'أَنْتَ عَلَى الطَّرِيقِ الصَّحِيح!',
];
const END_PHRASES_NONE = [
  'لَا بَأْسَ، المُحَاوَلَةُ القَادِمَة!',
  'هَيَّا نُحَاوِلُ مَرَّةً أُخْرَى!',
  'التَّدْرِيبُ يَصْنَعُ الأَبْطَال!',
];

// ═══ 🆕 دوال مساعدة ═══
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
  try {
    return localStorage.getItem('soroban_child_name')?.trim() || 'بطل';
  } catch {
    return 'بطل';
  }
}

// ═══ الأنواع ═══
interface Problem {
  id: number;
  value: number;
  options: number[];
  showMs: number;
}

interface FlyingAbacusGameProps {
  onBack: () => void;
  heroId?: CharacterType;
}

// ═══ أدوات ═══
function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined') return;
  if (!('vibrate' in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* iOS Safari يتجاهل بأمان */
  }
}

function readSelectedHero(): CharacterType {
  if (typeof window === 'undefined') return 'rayan';
  const saved = localStorage.getItem('soroban_companion');
  if (saved && VALID_HEROES.includes(saved as CharacterType)) {
    return saved as CharacterType;
  }
  return 'rayan';
}

function getPhaseConfig(elapsedSec: number): {
  minVal: number;
  maxVal: number;
  showMs: number;
} {
  if (elapsedSec <= 10) {
    return { minVal: 2, maxVal: 9, showMs: 1800 };
  } else if (elapsedSec <= 25) {
    return { minVal: 10, maxVal: 29, showMs: 1200 };
  } else if (elapsedSec <= 40) {
    return { minVal: 30, maxVal: 59, showMs: 900 };
  } else if (elapsedSec <= 50) {
    return { minVal: 5, maxVal: 19, showMs: 1500 };
  } else {
    return { minVal: 60, maxVal: 99, showMs: 700 };
  }
}

function pickUnusedValue(minVal: number, maxVal: number, used: Set<number>): number {
  const range = maxVal - minVal + 1;
  for (let i = 0; i < 30; i++) {
    const candidate = minVal + Math.floor(Math.random() * range);
    if (!used.has(candidate)) return candidate;
  }
  for (let v = minVal; v <= maxVal; v++) {
    used.delete(v);
  }
  return minVal + Math.floor(Math.random() * range);
}

function generateWrongOptions(correct: number): number[] {
  const offsets = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
  const pool = offsets
    .map((o) => correct + o)
    .filter((v) => v >= 1 && v <= 99 && v !== correct);
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

function generateProblem(elapsedSec: number, used: Set<number>): Problem {
  const { minVal, maxVal, showMs } = getPhaseConfig(elapsedSec);
  const value = pickUnusedValue(minVal, maxVal, used);
  used.add(value);

  const wrongs = generateWrongOptions(value);
  const set = new Set<number>([value, ...wrongs]);
  let safety = 0;
  while (set.size < 3 && safety < 50) {
    const fallback = Math.max(1, Math.min(99, value + (Math.floor(Math.random() * 10) - 5)));
    if (fallback !== value) set.add(fallback);
    safety++;
  }

  const options = Array.from(set).slice(0, 3).sort(() => Math.random() - 0.5);

  return {
    id: Date.now() + Math.random(),
    value,
    options,
    showMs,
  };
}

function getTitleForScore(correct: number): string {
  if (correct >= 15) return '⚡ برق السوروبان';
  if (correct >= 10) return '🌟 نجم العداد';
  if (correct >= 5) return '🔍 الباحث الذكي';
  return '🌱 البطل الصاعد';
}

function getXpForScore(correct: number): number {
  let xp = 2;
  if (correct >= 15) xp += 3;
  else if (correct >= 10) xp += 2;
  else if (correct >= 5) xp += 1;
  return xp;
}

// ═══ المكوّن الرئيسي ═══
export function FlyingAbacusGame({ onBack, heroId: propHero }: FlyingAbacusGameProps) {
  const heroId: CharacterType = propHero ?? readSelectedHero();
  const { speak } = useCharacterVoice(heroId);
  const addXP = useProgressStore((s) => s.addXP);

  // حالة الجلسة
  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // حالة المسألة
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [isAbacusVisible, setIsAbacusVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // حالة البطل
  const [streak, setStreak] = useState(0);
  const [isGoldMode, setIsGoldMode] = useState(false);
  const [heroMood, setHeroMood] = useState<HeroMood>('idle');
  const [heroText, setHeroText] = useState('مُسْتَعِدٌّ لِلتَّحَدِّي؟');

  // نتائج
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  // 🆕 الرقم القياسي
  const [childName] = useState<string>(readChildName);
  const [previousHigh, setPreviousHigh] = useState<HighScoreEntry | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const usedValuesRef = useRef<Set<number>>(new Set());
  const usedStartRef = useRef<Set<string>>(new Set());
  const usedThinkingRef = useRef<Set<string>>(new Set());
  const usedAskRef = useRef<Set<string>>(new Set());
  const usedCorrectRef = useRef<Set<string>>(new Set());
  const usedErrorRef = useRef<Set<string>>(new Set());
  const usedEndRef = useRef<Set<string>>(new Set());

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  // تنظيف
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearAllTimeouts]);

  // 🆕 قراءة الرقم القياسي عند الدخول
  useEffect(() => {
    setPreviousHigh(getHighScore(GAME_ID));
  }, []);

  // مؤقت
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const timer = setInterval(() => {
      setSessionTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver]);

  // نهاية
  useEffect(() => {
    if (sessionTimeLeft === 0 && isPlaying && !isGameOver) {
      // eslint-disable-next-line no-use-before-define
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTimeLeft, isPlaying, isGameOver]);

  // بدء مسألة
  const startNextProblem = useCallback((elapsed: number) => {
    const problem = generateProblem(elapsed, usedValuesRef.current);
    setCurrentProblem(problem);
    setSelectedAnswer(null);
    setIsAbacusVisible(true);
    setHeroMood('thinking');
    setHeroText(pickUniquePhrase(THINKING_PHRASES, usedThinkingRef.current));

    addTimeout(() => {
      setIsAbacusVisible(false);
      setHeroText(pickUniquePhrase(ASK_PHRASES, usedAskRef.current));
    }, problem.showMs);
  }, [addTimeout]);

  // ═══ إنهاء اللعبة ═══
  const endGame = useCallback(() => {
    setIsGameOver(true);
    setIsPlaying(false);
    setIsAbacusVisible(false);
    clearAllTimeouts();

    const earned = getXpForScore(correctCount);
    setXpEarned(earned);
    addXP(earned);

    // 🆕 حفظ الرقم القياسي
    const recordResult = addScore(GAME_ID, childName, correctCount, heroId);
    if (recordResult.isNewRecord) {
      setIsNewRecord(true);
      setPreviousHigh(recordResult.previousTop);
      speak('رَقَمٌ قِيَاسِيٌّ جَدِيد!');
    } else {
      setIsNewRecord(false);
      const endPool =
        correctCount >= 15 ? END_PHRASES_HIGH
        : correctCount >= 10 ? END_PHRASES_MID
        : correctCount >= 5 ? END_PHRASES_LOW
        : END_PHRASES_NONE;
      const endMsg = pickUniquePhrase(endPool, usedEndRef.current);
      setHeroText(endMsg);
      speak(endMsg);
    }

    setHeroMood('celebrating');
    vibrate([0, 40, 40, 40, 40, 80]);
  }, [correctCount, addXP, speak, clearAllTimeouts, childName, heroId]);

  // بدء اللعبة
  const handleStartGame = useCallback(() => {
    clearAllTimeouts();
    usedValuesRef.current = new Set();
    usedStartRef.current = new Set();
    usedThinkingRef.current = new Set();
    usedAskRef.current = new Set();
    usedCorrectRef.current = new Set();
    usedErrorRef.current = new Set();
    usedEndRef.current = new Set();

    setIsPlaying(true);
    setIsGameOver(false);
    setIsNewRecord(false);
    setSessionTimeLeft(SESSION_SECONDS);
    setCorrectCount(0);
    setXpEarned(0);
    setStreak(0);
    setIsGoldMode(false);
    setHeroMood('excited');

    const startMsg = pickUniquePhrase(START_PHRASES, usedStartRef.current);
    setHeroText(startMsg);
    speak(startMsg);
    vibrate(50);

    addTimeout(() => {
      startNextProblem(0);
    }, 1200);
  }, [addTimeout, startNextProblem, speak, clearAllTimeouts]);

  // معالجة الإجابة
  const handleAnswer = useCallback((ans: number) => {
    if (selectedAnswer !== null || isAbacusVisible || !currentProblem) return;
    setSelectedAnswer(ans);

    const elapsedNow = SESSION_SECONDS - sessionTimeLeft;
    const isCorrect = ans === currentProblem.value;

    if (isCorrect) {
      vibrate(30);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectCount((c) => c + 1);

      const milestone = STREAK_PHRASES[newStreak];

      if (milestone) {
        setHeroText(milestone);
        speak(milestone);

        if (newStreak === 3) {
          setIsGoldMode(true);
          setHeroMood('excited');
          vibrate([0, 20, 20, 20, 20, 60]);
        } else if (!isGoldMode) {
          setHeroMood('celebrating');
        }
      } else {
        const correctMsg = pickUniquePhrase(CORRECT_PHRASES, usedCorrectRef.current);
        setHeroText(correctMsg);
        if (!isGoldMode) setHeroMood('celebrating');
      }

      addTimeout(() => {
        startNextProblem(elapsedNow);
      }, 650);
    } else {
      vibrate([0, 40, 40, 40]);
      setStreak(0);
      setIsGoldMode(false);
      setHeroMood('sad');

      const errMsg = pickUniquePhrase(ERROR_PHRASES, usedErrorRef.current);
      setHeroText(errMsg);
      speak(errMsg);

      addTimeout(() => {
        startNextProblem(elapsedNow);
      }, 1000);
    }
  }, [
    selectedAnswer,
    isAbacusVisible,
    currentProblem,
    sessionTimeLeft,
    streak,
    isGoldMode,
    addTimeout,
    startNextProblem,
    speak,
  ]);

  // إعادة اللعب
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

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col select-none"
      style={{ touchAction: 'manipulation' }}
    >
      {/* ═══ الرأس ═══ */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 sticky top-0 z-20 bg-slate-900/85 backdrop-blur-md border-b border-white/10">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0"
          style={{ touchAction: 'manipulation' }}
          aria-label="رجوع"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        <div className="flex-1 flex justify-center">
          <GameCompanion heroId={heroId} mood={heroMood} customText={heroText} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 font-bold text-sm flex items-center gap-1">
            ⏳ <span className="tabular-nums">{sessionTimeLeft}</span>
          </div>
          <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center gap-1">
            🎯 <span className="tabular-nums">{correctCount}</span>
          </div>
        </div>
      </div>

      {/* ═══ شاشة البداية ═══ */}
      {!isPlaying && !isGameOver && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-24 h-24 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-5xl shadow-2xl shadow-sky-500/30">
              🛸
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sky-400 text-center">
              العِدَادُ الطَّائِرُ
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xs text-center leading-relaxed">
              اقْرَأْ قِيمَةَ المِعْدَادِ قَبْلَ أَنْ يَخْتَفِيَ!
            </p>
          </motion.div>

          {/* 🆕 الرقم القياسي */}
          <HighScoreBadge gameId={GAME_ID} variant="full" />

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleStartGame}
            className="w-full max-w-xs bg-gradient-to-l from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xl py-4 rounded-2xl shadow-xl shadow-sky-500/30 active:scale-95 transition"
            style={{ touchAction: 'manipulation' }}
          >
            ▶️ ابْدَأِ التَّحَدِّي
          </motion.button>
        </div>
      )}

      {/* ═══ منطقة اللعب ═══ */}
      {isPlaying && (
        <div className="flex-1 flex flex-col items-center justify-around gap-4 px-4 py-6">
          <div className="flex items-center justify-center min-h-[260px] w-full">
            <AnimatePresence mode="wait">
              {isAbacusVisible && currentProblem ? (
                <motion.div
                  key={`abacus-${currentProblem.id}`}
                  initial={{ y: 40, opacity: 0, scale: 0.85 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`p-3 rounded-2xl transition-shadow ${
                    isGoldMode
                      ? 'bg-amber-900/20 border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-pulse'
                      : 'bg-slate-800/80 border border-slate-700 shadow-xl'
                  }`}
                >
                  <Soroban2D5
                    columns={3}
                    size="sm"
                    autoBeadSize
                    demoValue={currentProblem.value}
                    interactive={false}
                    showValue={false}
                    hideTitle
                    rodTint={isGoldMode ? 'amber' : 'white'}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="hidden"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-36 h-36 rounded-3xl bg-slate-800/50 border-2 border-dashed border-slate-600 flex items-center justify-center"
                >
                  <span className="text-5xl text-sky-400 animate-bounce">❓</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full max-w-sm min-h-[80px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isAbacusVisible && currentProblem ? (
                <motion.div
                  key={`options-${currentProblem.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-row gap-4 w-full justify-center"
                >
                  {currentProblem.options.map((opt) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrect = opt === currentProblem.value;
                    let cls =
                      'flex-1 h-16 rounded-2xl font-black text-2xl text-white border-2 shadow-lg active:scale-95 transition flex items-center justify-center';
                    if (isSelected) {
                      cls += isCorrect
                        ? ' bg-emerald-500 border-emerald-300 shadow-emerald-500/50 scale-110'
                        : ' bg-rose-500 border-rose-300 shadow-rose-500/50';
                    } else if (isGoldMode) {
                      cls += ' bg-amber-600 hover:bg-amber-500 border-amber-300';
                    } else {
                      cls += ' bg-sky-600 hover:bg-sky-500 border-sky-400/50';
                    }
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className={cls}
                        style={{ touchAction: 'manipulation' }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.p
                  key="wait"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-500 italic text-sm"
                >
                  رَاقِبِ المِعْدَادَ جَيِّداً...
                </motion.p>
              )}
            </AnimatePresence>
          </div>
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
              {/* الأيقونة */}
              {isNewRecord ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-5xl"
                  >
                    🏆
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-amber-400/30 blur-xl"
                  />
                </motion.div>
              ) : (
                <div className="text-5xl">🏆</div>
              )}

              {/* العنوان */}
              {isNewRecord ? (
                <>
                  <h2 className="text-2xl font-black text-amber-300">
                    🎉 رَقَمٌ قِيَاسِيٌّ جَدِيد!
                  </h2>

                  {/* مقارنة */}
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-amber-400/30 p-4 flex flex-col gap-2">
                    {previousHigh && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-slate-400" />
                          كُنْتَ:
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
                    <div className="h-px bg-amber-400/30 my-1" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">طَاقَةُ XP:</span>
                      <span className="text-amber-400 font-bold tabular-nums">
                        +{xpEarned} XP
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-sky-400">
                    انْتَهَى التَّحَدِّي!
                  </h2>

                  <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-4 flex flex-col gap-2">
                    <p className="text-slate-400 text-xs">اللَّقَبُ:</p>
                    <p className="text-amber-400 font-black text-lg">
                      {getTitleForScore(correctCount)}
                    </p>
                    <div className="h-px bg-slate-700/50 my-1" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">الإِجَابَاتُ الصَّحِيحَةُ:</span>
                      <span className="text-emerald-400 font-bold text-base tabular-nums">
                        {correctCount}
                      </span>
                    </div>
                    {previousHigh && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-amber-300" />
                          الرَّقَمُ:
                        </span>
                        <span className="text-amber-300 font-bold tabular-nums">
                          {previousHigh.value} ({previousHigh.name})
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">طَاقَةُ XP:</span>
                      <span className="text-amber-400 font-bold text-base tabular-nums">
                        +{xpEarned} XP
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* الأزرار */}
              <div className="flex flex-col gap-3 w-full mt-1">
                <button
                  onClick={handleReplay}
                  className={`w-full font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2 ${
                    isNewRecord
                      ? 'bg-gradient-to-l from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  إِعَادَةُ التَّحَدِّي
                </button>
                <button
                  onClick={onBack}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2"
                  style={{ touchAction: 'manipulation' }}
                >
                  <Home className="w-4 h-4" />
                  مَدِينَةُ الأَلْعَابِ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FlyingAbacusGame;