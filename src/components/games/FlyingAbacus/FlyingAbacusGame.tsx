// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/FlyingAbacus/FlyingAbacusGame.tsx — v3.2
// ═══════════════════════════════════════════════════════════════════
//
// ما تغيّر عن v3.1 (إصلاح الأداء الثقيل):
//   1. ❌ إزالة Ghost تماماً (كان يخلق Soroban2D5 مزدوجاً = كارثة أداء)
//   2. ✅ تثبيت Soroban2D5 — لا يُعاد mount مع كل سؤال (useAnimate imperative)
//   3. ✅ Placeholder مدمج · لا AnimatePresence mode="wait" للعداد
//   4. ✅ Spring أخف (300/24 بدل 500/30)
//   5. ✅ إزاحة أصغر (±30/40)
//
// النتيجة: أخف بكثير على الموبايل · نفس الجمال · بلا jank
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimate } from 'framer-motion';
import { ArrowRight, RotateCcw, Home, Zap, Sparkles } from 'lucide-react';
import { GameCompanion, type HeroMood } from '../GameCompanion';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import { useProgressStore } from '@/store/progressStore';
import type { CharacterType } from '@/types';

// ═══ ثوابت ═══
const SESSION_SECONDS = 60;
const VALID_HEROES: CharacterType[] = ['sham', 'rayan', 'bana', 'joud'];
type TrajectoryDirection = 'top' | 'left' | 'right' | 'bottom';

// ═══ أنواع ═══
interface Problem {
  id: number;
  value: number;
  options: number[];
  showMs: number;
  direction: TrajectoryDirection;
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
  const directions: TrajectoryDirection[] = ['top', 'left', 'right', 'bottom'];
  const direction = directions[Math.floor(Math.random() * directions.length)];

  return {
    id: Date.now() + Math.random(),
    value,
    options,
    showMs,
    direction,
  };
}

function getTitleForScore(correct: number): string {
  if (correct >= 15) return '⚡ برق السوروبان الخارق';
  if (correct >= 10) return '🌟 نجم العداد السريع';
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

  // 🆕 imperative animation للعداد (لا يُعاد mount)
  const [abacusScope, animateAbacus] = useAnimate();

  // حالة الجلسة
  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // حالة المسألة
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [isAbacusVisible, setIsAbacusVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);

  // تتبع سرعة الاستجابة
  const problemStartTimeRef = useRef<number>(0);
  const totalResponseTimeRef = useRef<number>(0);

  // حالة البطل
  const [streak, setStreak] = useState(0);
  const [isGoldMode, setIsGoldMode] = useState(false);
  const [heroMood, setHeroMood] = useState<HeroMood>('idle');
  const [heroText, setHeroText] = useState('مُسْتَعِدٌّ لِلتَّحَدِّي؟');

  // نتائج
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const usedValuesRef = useRef<Set<number>>(new Set());
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

  // 🆕 إزاحة أصغر — أخف
  const getInitialTrajectory = (dir?: TrajectoryDirection) => {
    switch (dir) {
      case 'top': return { y: -30, x: 0 };
      case 'left': return { x: -40, y: 0 };
      case 'right': return { x: 40, y: 0 };
      case 'bottom':
      default: return { y: 30, x: 0 };
    }
  };

  // 🆕 Animate abacus imperatively — لا remount
  useEffect(() => {
    if (!abacusScope.current) return;

    if (isAbacusVisible && currentProblem) {
      const start = getInitialTrajectory(currentProblem.direction);

      // 1. ضع الحالة الابتدائية بلا أنيميشن
      animateAbacus(
        abacusScope.current,
        { x: start.x, y: start.y, opacity: 0, scale: 0.85 },
        { duration: 0 }
      );

      // 2. أنيميشن إلى الظهور
      animateAbacus(
        abacusScope.current,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        { type: 'spring', stiffness: 300, damping: 24 }
      );
    } else {
      // إخفاء
      animateAbacus(
        abacusScope.current,
        { x: 0, y: 0, opacity: 0, scale: 0.85 },
        { duration: 0.18 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAbacusVisible, currentProblem?.id, animateAbacus, abacusScope]);

  // ═══ بدء مسألة جديدة ═══
  const startNextProblem = useCallback((elapsed: number) => {
    const problem = generateProblem(elapsed, usedValuesRef.current);
    setCurrentProblem(problem);
    setSelectedAnswer(null);
    setIsAbacusVisible(true);
    setShowSparkles(false);
    setHeroMood('thinking');
    setHeroText('رَكِّزْ جَيِّداً...');

    addTimeout(() => {
      setIsAbacusVisible(false);
      problemStartTimeRef.current = Date.now();
      setHeroText('مَا هِيَ القِيمَةُ؟');
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

    setHeroMood('celebrating');
    setHeroText('أَحْسَنْتَ! انْتَهَى التَّحَدِّي!');
    speak('أَحْسَنْتَ! انْتَهَى التَّحَدِّي!');

    vibrate([0, 40, 40, 40, 40, 80]);
  }, [correctCount, addXP, speak, clearAllTimeouts]);

  // ═══ بدء اللعبة ═══
  const handleStartGame = useCallback(() => {
    clearAllTimeouts();
    usedValuesRef.current = new Set();
    totalResponseTimeRef.current = 0;
    setIsPlaying(true);
    setIsGameOver(false);
    setSessionTimeLeft(SESSION_SECONDS);
    setCorrectCount(0);
    setXpEarned(0);
    setStreak(0);
    setIsGoldMode(false);
    setHeroMood('excited');

    const startMsg = 'مُسْتَعِدٌّ؟ انْطَلِقْ!';
    setHeroText(startMsg);
    speak(startMsg);
    vibrate(50);

    addTimeout(() => {
      startNextProblem(0);
    }, 900);
  }, [addTimeout, startNextProblem, speak, clearAllTimeouts]);

  // ═══ معالجة الإجابة ═══
  const handleAnswer = useCallback((ans: number) => {
    if (selectedAnswer !== null || isAbacusVisible || !currentProblem) return;
    setSelectedAnswer(ans);

    const elapsedNow = SESSION_SECONDS - sessionTimeLeft;
    const isCorrect = ans === currentProblem.value;

    if (isCorrect) {
      vibrate(30);
      setShowSparkles(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectCount((c) => c + 1);

      const responseTimeSec = (Date.now() - problemStartTimeRef.current) / 1000;
      totalResponseTimeRef.current += responseTimeSec;

      if (newStreak === 3 && !isGoldMode) {
        setIsGoldMode(true);
        setHeroMood('excited');
        setHeroText('🌟 السرعة القصوى!');
        speak('السُّرْعَةُ القُصْوَى!');
        vibrate([0, 20, 20, 20, 20, 60]);
      } else if (newStreak === 5) {
        setHeroText('كَفُو!');
        speak('كَفُو!');
      } else if (!isGoldMode) {
        setHeroMood('celebrating');
      }

      addTimeout(() => {
        startNextProblem(elapsedNow);
      }, 400);
    } else {
      vibrate([0, 40, 40, 40]);
      setStreak(0);
      setIsGoldMode(false);
      setHeroMood('sad');
      setHeroText('بَسِيطَةٌ، رَكِّزْ!');
      speak('بَسِيطَةٌ، رَكِّزْ!');

      addTimeout(() => {
        startNextProblem(elapsedNow);
      }, 750);
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

  const avgSpeed = correctCount > 0
    ? (totalResponseTimeRef.current / correctCount).toFixed(1)
    : '0';

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col select-none transition-colors duration-700 text-white ${
        isGoldMode
          ? 'bg-gradient-to-b from-amber-950 via-slate-900 to-amber-950'
          : 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900'
      }`}
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
        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-28 h-28 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-6xl shadow-2xl shadow-sky-500/30">
              🛸
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sky-400 text-center">
              العِدَادُ الطَّائِرُ
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xs text-center leading-relaxed">
              اقْرَأْ قِيمَةَ المِعْدَادِ قَبْلَ أَنْ يَخْتَفِيَ!
            </p>
          </motion.div>

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
          {/* منطقة المعداد — مُحسَّنة */}
          <div className="flex items-center justify-center min-h-[260px] w-full relative">
            {/* Placeholder (خلف · يُخفى بلطف) */}
            <div
              className={`absolute transition-opacity duration-200 ${
                isAbacusVisible ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="w-36 h-36 rounded-3xl bg-slate-800/50 border-2 border-dashed border-slate-600 flex items-center justify-center">
                <span className="text-5xl text-sky-400 animate-bounce">❓</span>
              </div>
            </div>

            {/* المعداد (دائم الوجود · يُحفَّز بـ useAnimate) */}
            <div
              ref={abacusScope}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                isGoldMode
                  ? 'bg-amber-950/40 border-2 border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.7)] animate-pulse'
                  : 'bg-slate-800/80 border border-slate-700 shadow-xl'
              }`}
              style={{ opacity: 0 }}
            >
              <Soroban2D5
                columns={3}
                size="sm"
                autoBeadSize
                demoValue={currentProblem?.value ?? 0}
                interactive={false}
                showValue={false}
                hideTitle
                rodTint={isGoldMode ? 'amber' : 'white'}
              />
            </div>
          </div>

          {/* منطقة الأزرار */}
          <div className="w-full max-w-sm min-h-[80px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {!isAbacusVisible && currentProblem ? (
                <motion.div
                  key={`options-${currentProblem.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-row gap-4 w-full justify-center relative"
                >
                  {currentProblem.options.map((opt) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrect = opt === currentProblem.value;
                    let cls =
                      'flex-1 h-16 rounded-2xl font-black text-2xl text-white border-2 shadow-lg active:scale-95 transition flex items-center justify-center relative';
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

                        {isSelected && isCorrect && showSparkles && (
                          <motion.div
                            initial={{ scale: 0, y: 0, opacity: 1 }}
                            animate={{ scale: 1.4, y: -40, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute -top-6 text-amber-300 font-extrabold text-sm flex items-center gap-0.5 pointer-events-none"
                          >
                            <Sparkles className="w-5 h-5 fill-amber-300" />
                            {streak >= 3 ? `+${streak}x` : '✨'}
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.p
                  key="wait"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
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
              className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-4"
            >
              <div className="text-5xl">🏆</div>
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
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">مُعَدَّلُ السُّرْعَةِ:</span>
                  <span className="text-sky-300 font-bold text-sm flex items-center gap-1 tabular-nums">
                    <Zap className="w-3.5 h-3.5 fill-sky-300" />
                    {avgSpeed} ث/مسألة
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">طَاقَةُ XP:</span>
                  <span className="text-amber-400 font-bold text-base tabular-nums">
                    +{xpEarned} XP
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full mt-1">
                <button
                  onClick={handleReplay}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition flex items-center justify-center gap-2"
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