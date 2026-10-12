// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/PirateRaceGame.tsx — v1
// ═══════════════════════════════════════════════════════════════════
//
// لعبة سباق القراصنة · 90 ثانية · ضرب السوروبان
//
// الإصلاحات عن نسخة جيميني (8 أخطاء حرجة + 4 منطقية):
//   1. isPreviewMode() بدل isPreview
//   2. mood صحيحة فقط ('thinking' | 'excited' | 'celebrating' | 'sad' | 'idle')
//   3. HighScoreBadge بـ gameId + variant (لا entry)
//   4. useCharacterVoice(HERO_ID) مع وسيط
//   5. MulProblem/MulOption من mulEngine (لا محلية)
//   6. buyTicket() لا يُعيد boolean
//   7. readChildName() محلية (لا 'البطل')
//   8. عرض خطوات الخطأ على MultiRodAbacus بدل خطوة ثابتة
//   9. اسم الطفل الصحيح
//   10. selectHasTicket من progressStore
//   11. رمية ريان بعد فحص gap (لا زر دائم)
//   12. cleanup شامل
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, RotateCcw, Home, Trophy, Crown, Zap, Hand, Star,
} from 'lucide-react';
import { GameCompanion, type HeroMood } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import { useProgressStore } from '@/store/progressStore';
import { isPreviewMode } from '@/utils/previewMode';
import type { CharacterType } from '@/types';
import MultiRodAbacus from './MultiRodAbacus';
import PirateScene from './PirateScene';
import { seaSfx } from './seaSfx';
import {
  generateMulProblem,
  type MulProblem,
  type MulOption,
  type MulLevel,
} from './mulEngine';

// ═══ ثوابت ═══
const SESSION_SECONDS = 90;
const GAME_ID = 'pirate-race';
const HERO_ID: CharacterType = 'rayan';
const GAP_START = 60;
const ROPE_THRESHOLD = 30;

// ═══ أنواع ═══
type GameState = 'welcome' | 'playing' | 'error_review' | 'victory' | 'defeat';
type Weather = 'sunny' | 'rain' | 'storm';

interface PirateRaceGameProps {
  onBack: () => void;
}

interface ErrorDetails {
  wrongOption: MulOption;
  correctAnswer: number;
}

// ═══ أدوات ═══
function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined') return;
  if (!('vibrate' in navigator)) return;
  try { navigator.vibrate(pattern); } catch { /* iOS */ }
}

function readChildName(): string {
  if (typeof window === 'undefined') return 'بطل';
  try {
    return localStorage.getItem('soroban_child_name')?.trim() || 'بطل';
  } catch {
    return 'بطل';
  }
}

/** يحوّل رقماً إلى مصفوفة أرقام (بعدد أعمدة محدد · من اليسار) */
function rodsFromNumber(n: number, cols = 5): number[] {
  const safe = Math.max(0, Math.floor(n));
  const str = String(safe).padStart(cols, '0');
  return str.slice(-cols).split('').map(Number);
}

/** يحسب الوقت الأساسي حسب المستوى + التكيف */
function getBaseTimer(level: MulLevel, errorStreak: number): number {
  let base: number;
  switch (level) {
    case 1: base = 8; break;
    case 2: base = 10; break;
    case 3: base = 12; break;
    case 4: base = 16; break;
    default: base = 8;
  }
  if (errorStreak >= 2) base += 2;
  return Math.max(6, base);
}

function getWeather(gap: number): Weather {
  if (gap >= 60) return 'sunny';
  if (gap >= 30) return 'rain';
  return 'storm';
}

function getHeroBubble(
  gap: number,
  streak: number,
  ropeUsed: boolean,
  gameState: GameState,
): string {
  if (gameState === 'victory') return 'وصلنا للجزيرة! 🏝️';
  if (gameState === 'defeat') return 'أمسكوا بنا! نحاول مرة أخرى.';
  if (gap < 30 && !ropeUsed) return 'خُذ حبل الإنقاذ! 🤝';
  if (gap < 40) return 'القراصنة يقتربون!';
  if (streak >= 3) return 'أنت أسطورة! 🔥';
  return 'أسرع يا بطل!';
}

// ═══════════════════════════════════════════════════════════════════
// المكوّن
// ═══════════════════════════════════════════════════════════════════
export function PirateRaceGame({ onBack }: PirateRaceGameProps) {
  const { speak } = useCharacterVoice(HERO_ID);
  const addXP = useProgressStore((s) => s.addXP);
  const tickets = useProgressStore((s) => s.tickets);
  const buyTicket = useProgressStore((s) => s.buyTicket);
  const consumeTicket = useProgressStore((s) => s.consumeTicket);

  // ═══ حالة الجلسة ═══
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [gap, setGap] = useState<number>(GAP_START);
  const [level, setLevel] = useState<MulLevel>(1);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [errorStreak, setErrorStreak] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isLightning, setIsLightning] = useState<boolean>(false);
  const [ropeUsed, setRopeUsed] = useState<boolean>(false);

  // ═══ حالة السؤال ═══
  const [currentProblem, setCurrentProblem] = useState<MulProblem | null>(null);
  const [displayOptions, setDisplayOptions] = useState<MulOption[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(8);
  const [timerMax, setTimerMax] = useState<number>(8);

  // ═══ حالة البطل ═══
  const [heroMood, setHeroMood] = useState<HeroMood>('idle');

  // ═══ حالة الخطأ ═══
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [reviewStepIndex, setReviewStepIndex] = useState<number>(0);

  // ═══ الرقم القياسي ═══
  const [childName] = useState<string>(readChildName);
  const [previousHigh, setPreviousHigh] = useState<HighScoreEntry | null>(null);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // ═══ مراجع ═══
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const problemTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lightningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const clearAllIntervals = useCallback(() => {
    if (problemTimerRef.current) {
      clearInterval(problemTimerRef.current);
      problemTimerRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    if (lightningTimerRef.current) {
      clearTimeout(lightningTimerRef.current);
      lightningTimerRef.current = null;
    }
  }, []);

  // ═══ تنظيف عند unmount ═══
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      clearAllIntervals();
      seaSfx.dispose();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearAllTimeouts, clearAllIntervals]);

  // ═══ قراءة الرقم القياسي عند mount ═══
  useEffect(() => {
    setPreviousHigh(getHighScore(GAME_ID));
  }, []);

  // ═══════════════════════════════════════════════════════════
  // منطق اللعبة
  // ═══════════════════════════════════════════════════════════

  const loadNextProblem = useCallback((lvl: MulLevel, errs: number) => {
    const prob = generateMulProblem(lvl);
    setCurrentProblem(prob);
    // نُخزّن الخيارات مرتّبة عشوائياً
    const shuffled = [...prob.options].sort(() => Math.random() - 0.5);
    setDisplayOptions(shuffled);
    const t = getBaseTimer(lvl, errs);
    setTimerMax(t);
    setTimeLeft(t);
    setReviewStepIndex(0);
    setHeroMood('thinking');
  }, []);

  const startRace = useCallback(() => {
    // فحص التذكرة (إن لم تكن المعاينة)
    if (!isPreviewMode()) {
      if (tickets < 1) {
        buyTicket();
        // بعد buyTicket · نتحقق مرة أخرى
        const after = useProgressStore.getState().tickets;
        if (after < 1) return;
      }
      consumeTicket();
    }

    clearAllTimeouts();
    clearAllIntervals();
    seaSfx.init();

    setGap(GAP_START);
    setScoreCount(0);
    setStreak(0);
    setErrorStreak(0);
    setLevel(1);
    setElapsedSec(0);
    setRopeUsed(false);
    setIsNewRecord(false);
    setErrorDetails(null);
    setHeroMood('excited');

    const msg = 'أسرع يا بطل! القراصنة خلفنا!';
    speak(msg);
    vibrate(50);

    addTimeout(() => {
      loadNextProblem(1, 0);
      setGameState('playing');
    }, 900);
  }, [
    tickets, buyTicket, consumeTicket, speak,
    clearAllTimeouts, clearAllIntervals, addTimeout, loadNextProblem,
  ]);

  const finishGame = useCallback(
    (endState: 'victory' | 'defeat') => {
      clearAllTimeouts();
      clearAllIntervals();
      setGameState(endState);
      seaSfx.playTrumpet(endState === 'victory');

      // XP: 2 + 1/2/3 حسب الأداء (سقف 5)
      let earnedXP = 2;
      if (scoreCount >= 15) earnedXP += 3;
      else if (scoreCount >= 10) earnedXP += 2;
      else if (scoreCount >= 5) earnedXP += 1;
      if (earnedXP > 5) earnedXP = 5;
      addXP(earnedXP);

      // الرقم القياسي
      const result = addScore(GAME_ID, childName, scoreCount, HERO_ID);
      if (result.isNewRecord) {
        setIsNewRecord(true);
        setPreviousHigh(result.previousTop);
        setHeroMood('celebrating');
        const msg = endState === 'victory'
          ? 'وصلت للجزيرة! رقم قياسي جديد!'
          : 'رقم قياسي جديد!';
        speak(msg);
      } else {
        setIsNewRecord(false);
        setHeroMood(endState === 'victory' ? 'celebrating' : 'sad');
        const msg = endState === 'victory'
          ? 'وصلت للجزيرة! أحسنت!'
          : 'أمسك بنا القراصنة! حاول مجدداً.';
        speak(msg);
      }

      if (endState === 'defeat') {
        vibrate([0, 40, 40, 80]);
      } else {
        vibrate([0, 40, 40, 40, 40, 80]);
      }
    },
    [scoreCount, addXP, speak, childName, clearAllTimeouts, clearAllIntervals],
  );

  // ═══ معالجة الإجابة ═══
  const handleAnswer = useCallback(
    (opt: MulOption) => {
      if (!currentProblem || gameState !== 'playing') return;

      if (opt.kind === 'correct') {
        seaSfx.playTrumpet(true);
        vibrate(30);

        const newStreak = streak + 1;
        const newScore = scoreCount + 1;
        const bonus = newStreak >= 3 ? 10 : 6;
        const newGap = Math.min(100, gap + bonus);

        setStreak(newStreak);
        setScoreCount(newScore);
        setErrorStreak(0);
        setGap(newGap);
        setHeroMood('excited');

        if (newGap >= 100) {
          finishGame('victory');
          return;
        }

        // ترقية المستوى كل 5 إجابات
        const newLevel = Math.min(4, Math.floor(newScore / 5) + 1) as MulLevel;
        setLevel(newLevel);

        addTimeout(() => loadNextProblem(newLevel, 0), 500);
      } else {
        seaSfx.playTrumpet(false);
        vibrate([0, 50, 30, 50]);

        const newGap = Math.max(0, gap - 12);
        const newErrorStreak = errorStreak + 1;

        setErrorStreak(newErrorStreak);
        setStreak(0);
        setGap(newGap);
        setHeroMood('sad');

        if (newGap <= 0) {
          finishGame('defeat');
          return;
        }

        setErrorDetails({ wrongOption: opt, correctAnswer: currentProblem.answer });
        setReviewStepIndex(0);
        setGameState('error_review');
      }
    },
    [
      currentProblem, gameState, streak, scoreCount, gap, errorStreak,
      finishGame, addTimeout, loadNextProblem,
    ],
  );

  // ═══ انتهاء وقت المسألة ═══
  const handleTimeout = useCallback(() => {
    if (!currentProblem || gameState !== 'playing') return;

    seaSfx.playTrumpet(false);
    vibrate([0, 50, 30, 50]);

    const newGap = Math.max(0, gap - 15);
    setGap(newGap);
    setStreak(0);
    const newErrorStreak = errorStreak + 1;
    setErrorStreak(newErrorStreak);
    setHeroMood('sad');

    if (newGap <= 0) {
      finishGame('defeat');
      return;
    }

    // عرض الإجابة الصحيحة (لكن لا نُسمّيه خطأ · فقط انتهى الوقت)
    const timeoutOption: MulOption = {
      value: -1,
      kind: 'near',
      why: 'انتهى الوقت! إليك الحل الصحيح.',
    };
    setErrorDetails({ wrongOption: timeoutOption, correctAnswer: currentProblem.answer });
    setReviewStepIndex(0);
    setGameState('error_review');
  }, [currentProblem, gameState, gap, errorStreak, finishGame]);

  // ═══ المؤقت لكل مسألة ═══
  useEffect(() => {
    if (gameState !== 'playing') return;

    problemTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // نُوقف المؤقت · ثم نعالج
          if (problemTimerRef.current) {
            clearInterval(problemTimerRef.current);
            problemTimerRef.current = null;
          }
          // نُشغّل قبل انتهاء useEffect
          setTimeout(() => handleTimeout(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (problemTimerRef.current) {
        clearInterval(problemTimerRef.current);
        problemTimerRef.current = null;
      }
    };
  }, [gameState, currentProblem, handleTimeout]);

  // ═══ مؤقت الزمن المنقضي (للجزيرة) ═══
  useEffect(() => {
    if (gameState !== 'playing') return;

    elapsedTimerRef.current = setInterval(() => {
      setElapsedSec((s) => Math.min(SESSION_SECONDS, s + 1));
    }, 1000);

    return () => {
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
    };
  }, [gameState]);

  // ═══ البرق في العاصفة ═══
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (gap >= ROPE_THRESHOLD) return;

    const scheduleLightning = () => {
      const delay = 7000 + Math.random() * 5000;
      lightningTimerRef.current = setTimeout(() => {
        setIsLightning(true);
        seaSfx.playThunder();
        addTimeout(() => setIsLightning(false), 300);
        scheduleLightning();
      }, delay);
    };

    scheduleLightning();

    return () => {
      if (lightningTimerRef.current) {
        clearTimeout(lightningTimerRef.current);
        lightningTimerRef.current = null;
      }
    };
  }, [gameState, gap, addTimeout]);

  // ═══ رمية حبل ريان ═══
  const useRayanRope = useCallback(() => {
    if (ropeUsed || gap >= ROPE_THRESHOLD || !currentProblem) return;
    setRopeUsed(true);
    vibrate(40);

    // نحذف خياراً خاطئاً واحداً
    const wrongOptions = displayOptions.filter((o) => o.kind !== 'correct');
    if (wrongOptions.length > 0) {
      const toRemove = wrongOptions[0];
      setDisplayOptions((prev) => prev.filter((o) => o !== toRemove));
    }
    seaSfx.playTrumpet(true);
  }, [ropeUsed, gap, currentProblem, displayOptions]);

  // ═══ متابعة بعد عرض الخطأ ═══
  const handleContinueReview = useCallback(() => {
    setErrorDetails(null);
    setReviewStepIndex(0);
    setGameState('playing');
    loadNextProblem(level, errorStreak);
  }, [level, errorStreak, loadNextProblem]);

  // ═══ إعادة اللعب ═══
  const handleReplay = useCallback(() => {
    startRace();
  }, [startRace]);

  // ═══ الحالة الجوية ═══
  const weather: Weather = getWeather(gap);
  const islandElapsed = Math.min(elapsedSec, SESSION_SECONDS);

  // ═══════════════════════════════════════════════════════════
  // شاشة البداية
  // ═══════════════════════════════════════════════════════════
  if (gameState === 'welcome') {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950/40 to-slate-950 text-white flex flex-col"
      >
        <div className="flex items-center gap-2 p-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            aria-label="رجوع"
          >
            <ArrowRight className="w-6 h-6 text-rose-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="w-28 h-28 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-6xl shadow-2xl shadow-rose-500/30">
              🏴‍☠️
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-rose-400">
              سِبَاقُ القَرَاصِنَة
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xs leading-relaxed">
              أَسْرِعْ بِإِجَابَاتِكَ الصَّحِيحَة لِتَسْبِقَ سَفِينَةَ القَرَاصِنَة!
            </p>
          </motion.div>

          <HighScoreBadge gameId={GAME_ID} variant="full" />

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={startRace}
            className="w-full max-w-xs bg-gradient-to-l from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-xl py-4 rounded-2xl shadow-xl shadow-rose-500/30 active:scale-95 transition"
            style={{ touchAction: 'manipulation' }}
          >
            ▶️ ابْدَأِ السِّبَاق
          </motion.button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // شاشة النصر
  // ═══════════════════════════════════════════════════════════
  if (gameState === 'victory') {
    const stars = Math.floor(scoreCount / 3);
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-4 border-2 ${
            isNewRecord
              ? 'bg-gradient-to-br from-amber-900/40 via-slate-800 to-amber-900/40 border-amber-400/70'
              : 'bg-slate-800 border-emerald-700'
          }`}
        >
          <div className="text-5xl">🏝️</div>
          <h2 className={`text-2xl font-black ${isNewRecord ? 'text-amber-300' : 'text-emerald-400'}`}>
            {isNewRecord ? '🎉 رَقَمٌ قِيَاسِيٌّ جَدِيد!' : 'وَصَلْتَ لِلجَزِيرَة!'}
          </h2>

          <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">العَمَلِيَّاتُ الصَّحِيحَة:</span>
              <span className="text-rose-300 font-bold text-base tabular-nums">{scoreCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">النُّجُوم:</span>
              <span className="text-amber-300 font-bold tabular-nums">
                {'⭐'.repeat(Math.min(stars, 5))} {stars}
              </span>
            </div>
            {previousHigh && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  {isNewRecord ? <Crown className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5 text-amber-300" />}
                  {isNewRecord ? 'كُنْتَ:' : 'الرَّقَم:'}
                </span>
                <span className="text-amber-300 font-bold tabular-nums">
                  {previousHigh.value} ({previousHigh.name})
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full mt-1">
            <button
              onClick={handleReplay}
              className={`w-full font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2 ${
                isNewRecord
                  ? 'bg-gradient-to-l from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <RotateCcw className="w-4 h-4" />
              إِعَادَةُ السِّبَاق
            </button>
            <button
              onClick={onBack}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2"
              style={{ touchAction: 'manipulation' }}
            >
              <Home className="w-4 h-4" />
              مَدِينَةُ الأَلْعَاب
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // شاشة الهزيمة
  // ═══════════════════════════════════════════════════════════
  if (gameState === 'defeat') {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 text-white flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className="w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-4 bg-slate-800 border-2 border-rose-700"
        >
          <div className="text-5xl">🏴‍☠️</div>
          <h2 className="text-2xl font-black text-rose-500">
            أَمْسَكَ بِكَ القَرَاصِنَة!
          </h2>
          <p className="text-slate-400 text-sm">
            لا بأس يا بطل · سَنَسْتَعِيدُ الكَنْز مَعاً. مُحَاوَلَة أُخْرَى؟
          </p>

          <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">العَمَلِيَّاتُ الصَّحِيحَة:</span>
              <span className="text-rose-300 font-bold text-base tabular-nums">{scoreCount}</span>
            </div>
            {previousHigh && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  الرَّقَم:
                </span>
                <span className="text-amber-300 font-bold tabular-nums">
                  {previousHigh.value} ({previousHigh.name})
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full mt-1">
            <button
              onClick={handleReplay}
              className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-500/20 active:scale-95 transition flex items-center justify-center gap-2"
              style={{ touchAction: 'manipulation' }}
            >
              <RotateCcw className="w-4 h-4" />
              🔄 حَاوِلْ مُجَدَّداً
            </button>
            <button
              onClick={onBack}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2"
              style={{ touchAction: 'manipulation' }}
            >
              <Home className="w-4 h-4" />
              مَدِينَةُ الأَلْعَاب
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // شاشة اللعب + مراجعة الخطأ
  // ═══════════════════════════════════════════════════════════
  const problemTimerPct = timerMax > 0 ? (timeLeft / timerMax) * 100 : 0;
  const timerColor =
    problemTimerPct > 50
      ? 'bg-sky-400'
      : problemTimerPct > 25
      ? 'bg-amber-400'
      : 'bg-rose-500';

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/60 to-slate-950 text-white flex flex-col select-none"
      style={{ touchAction: 'manipulation' }}
    >
      {/* ═══ الرأس ═══ */}
      <div className="sticky top-0 z-20 bg-slate-900/85 backdrop-blur-md border-b border-rose-500/20">
        <div className="flex items-center justify-between gap-2 p-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0"
            aria-label="رجوع"
          >
            <ArrowRight className="w-5 h-5 text-rose-400" />
          </button>

          <div className="flex-1 flex justify-center min-w-0">
            <GameCompanion heroId={HERO_ID} mood={heroMood} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-950/80 px-2 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1">
              🎯 <span className="tabular-nums">{scoreCount}</span>
            </div>
            <div className="bg-slate-950/80 px-2 py-1.5 rounded-lg border border-sky-500/30 text-sky-300 font-bold text-xs flex items-center gap-1">
              ⏱️ <span className="tabular-nums">{timeLeft}</span>
            </div>
          </div>
        </div>
        {/* شريط المؤقت */}
        <div className="h-1.5 bg-slate-800">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${timerColor}`}
            style={{ width: `${problemTimerPct}%` }}
          />
        </div>
      </div>

      {/* ═══ المشهد ═══ */}
      <div className="px-3 pt-3 pb-1">
        <PirateScene
          gap={gap}
          elapsedSec={islandElapsed}
          isLightning={isLightning}
          weather={weather}
        />
      </div>

      {/* ═══ السؤال + الأزرار ═══ */}
      {currentProblem && (
        <div className="flex-1 flex flex-col justify-between px-3 pb-3 gap-2">
          <div className="bg-slate-900/90 border-2 border-rose-500/40 rounded-2xl p-3 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold text-slate-300 bg-black/40 px-2 py-1 rounded-full border border-white/10">
                المُسْتَوَى {level}
              </div>
              {gap < ROPE_THRESHOLD && !ropeUsed && (
                <button
                  onClick={useRayanRope}
                  className="px-2.5 py-1 rounded-full border border-amber-400/60 bg-amber-950/80 text-amber-300 text-[11px] font-extrabold flex items-center gap-1 active:scale-95 transition"
                  style={{ touchAction: 'manipulation' }}
                >
                  <Hand className="w-3.5 h-3.5" />
                  رَمْيَة رَيَّان
                </button>
              )}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-300 text-center font-mono">
              {currentProblem.a} × {currentProblem.b} = ؟
            </div>
          </div>

          {/* الأزرار */}
          <div className="grid grid-cols-3 gap-2 my-2">
            {displayOptions.map((opt, i) => (
              <motion.button
                key={`${opt.value}-${i}`}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleAnswer(opt)}
                className="h-16 rounded-2xl font-black text-2xl text-amber-50 shadow-lg active:scale-95 transition flex items-center justify-center"
                style={{
                  backgroundColor: '#7c4a1e',
                  borderWidth: 2,
                  borderColor: '#b45309',
                  touchAction: 'manipulation',
                }}
              >
                {opt.value}
              </motion.button>
            ))}
          </div>

          {/* فقاعة ريان */}
          <div className="bg-slate-900/85 border border-amber-500/20 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-md">
            <span className="text-xl shrink-0">👦</span>
            <span className="text-xs font-bold text-amber-200/90 leading-snug">
              رَيَّان: "{getHeroBubble(gap, streak, ropeUsed, gameState)}"
            </span>
          </div>
        </div>
      )}

      {/* ═══ بطاقة الخطأ ═══ */}
      <AnimatePresence>
        {gameState === 'error_review' && currentProblem && errorDetails && (
          <ErrorReviewCard
            key={currentProblem.id}
            problem={currentProblem}
            errorDetails={errorDetails}
            stepIndex={reviewStepIndex}
            setStepIndex={setReviewStepIndex}
            onContinue={handleContinueReview}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// بطاقة الخطأ · منفصلة لتنظيف المنطق
// ═══════════════════════════════════════════════════════════════════
function ErrorReviewCard({
  problem,
  errorDetails,
  stepIndex,
  setStepIndex,
  onContinue,
}: {
  problem: MulProblem;
  errorDetails: ErrorDetails;
  stepIndex: number;
  setStepIndex: (n: number) => void;
  onContinue: () => void;
}) {
  const steps = problem.steps;
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const isLastStep = stepIndex >= steps.length - 1;
  const [autoPlay, setAutoPlay] = useState(true);

  // الانتقال التلقائي بين الخطوات
  useEffect(() => {
    if (!autoPlay) return;
    if (isLastStep) {
      setAutoPlay(false);
      return;
    }
    const t = setTimeout(() => setStepIndex(stepIndex + 1), 1200);
    return () => clearTimeout(t);
  }, [stepIndex, isLastStep, autoPlay, setStepIndex]);

  const handleNext = () => {
    setAutoPlay(false);
    if (!isLastStep) setStepIndex(stepIndex + 1);
  };

  const runningValue = currentStep?.running ?? problem.answer;
  const digits = rodsFromNumber(runningValue, 5);
  const activeRods = currentStep
    ? [currentStep.onesRod, currentStep.tensRod]
    : [0, 0];
  const arcValue = currentStep?.product ?? 0;

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4"
    >
      {/* رأس البطاقة */}
      <div className="w-full max-w-md flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <Zap className="w-5 h-5" />
          <span>تَصْحِيحُ المَسَار</span>
        </div>
        <div className="text-[11px] text-slate-400">
          خُطُوَة {Math.min(stepIndex + 1, steps.length)} / {steps.length}
        </div>
      </div>

      {/* الشرح */}
      <div className="w-full max-w-md bg-slate-900/85 border border-rose-500/30 rounded-2xl p-3 text-center text-xs text-rose-100 font-bold leading-relaxed">
        {errorDetails.wrongOption.why}
      </div>

      {/* المعداد */}
      <div className="w-full max-w-md">
        <MultiRodAbacus
          digits={digits}
          activeRods={activeRods}
          unitRodIndex={4}
          arcValue={arcValue}
          runningTotal={runningValue}
          columns={5}
        />
      </div>

      {/* نص الخطوة */}
      {currentStep?.text && (
        <div className="w-full max-w-md bg-slate-900/85 border border-amber-500/30 rounded-2xl p-2.5 text-center text-xs text-amber-200 font-bold leading-snug">
          {currentStep.text}
        </div>
      )}

      {/* الإجابة النهائية */}
      <div className="text-sm font-bold text-amber-300">
        الإِجَابَةُ الصَّحِيحَة: <span className="text-base">{problem.answer}</span>
      </div>

      {/* الأزرار */}
      <div className="w-full max-w-md flex gap-2">
        {!isLastStep ? (
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black shadow-lg active:scale-95 transition"
            style={{ touchAction: 'manipulation' }}
          >
            الخُطُوَةُ التَّالِيَة
          </button>
        ) : (
          <button
            onClick={onContinue}
            className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg active:scale-95 transition"
            style={{ touchAction: 'manipulation' }}
          >
            ▶️ مُتَابَعَةُ السِّبَاق
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default PirateRaceGame;