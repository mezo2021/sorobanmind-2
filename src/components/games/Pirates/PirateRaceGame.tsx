// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/PirateRaceGame.tsx
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  XCircle, 
  RotateCcw 
} from 'lucide-react';

import MultiRodAbacus from './MultiRodAbacus';
import PirateScene from './PirateScene';
import { seaSfx } from './seaSfx';
import { generateMulProblem } from './mulEngine';
import { useProgressStore } from '@/store/progressStore';
import GameCompanion from '../GameCompanion';
import HighScoreBadge from '../HighScoreBadge';
import { addScore, getHighScore, HighScoreEntry } from '../highScoreStore';
import useCharacterVoice from '@/hooks/useCharacterVoice';
import { CharacterType } from '@/types';
import { isPreviewMode } from '@/utils/previewMode';

interface PirateRaceGameProps {
  onBack: () => void;
}

const SESSION_SECONDS = 90;
const GAME_ID = 'pirate-race';
const HERO_ID: CharacterType = 'rayan';

type GameState = 'welcome' | 'playing' | 'error_review' | 'victory' | 'defeat' | 'timeout';

interface MulOption {
  value: number;
  kind: 'correct' | 'near' | 'flip' | 'table_error' | 'random';
  why: string;
}

interface Problem {
  id: string;
  num1: number;
  num2: number;
  answer: number;
  options: MulOption[];
  why?: string;
  steps?: Array<{
    running: number;
    onesRod: number;
    tensRod: number;
    product: number;
    text?: string;
  }>;
}

const rodsFromNumber = (n: number): number[] => {
  return String(Math.abs(n)).split('').map(Number);
};

export default function PirateRaceGame({ onBack }: PirateRaceGameProps) {
  const { addXP, tickets, buyTicket, consumeTicket, readChildName, selectHasTicket } = useProgressStore();
  const { speak } = useCharacterVoice('rayan');

  const [gameState, setGameState] = useState<GameState>('welcome');
  const [level, setLevel] = useState<number>(1);
  const [gap, setGap] = useState<number>(60);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [errorStreak, setErrorStreak] = useState<number>(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [displayOptions, setDisplayOptions] = useState<MulOption[]>([]);
  
  const [timeLeft, setTimeLeft] = useState<number>(8);
  const [timerMax, setTimerMax] = useState<number>(8);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isLightning, setIsLightning] = useState<boolean>(false);
  
  const [ropeUsed, setRopeUsed] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<{ selected: number; explanation: string; step?: any } | null>(null);
  
  const [highScore, setHighScore] = useState<HighScoreEntry | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // تحميل الرقم القياسي عند التحميل
  useEffect(() => {
    const existing = getHighScore(GAME_ID);
    if (existing) {
      setHighScore(existing);
    }
  }, []);

  // حساب الوقت الأقصى حسب المستوى مع التكيف للأخطاء المتتالية
  const getBaseTimer = useCallback((lvl: number, errs: number) => {
    let t = 8;
    if (lvl === 2) t = 10;
    if (lvl === 3) t = 12;
    if (lvl === 4) t = 16;
    if (errs >= 2) {
      t += 2;
    }
    return Math.max(6, t);
  }, []);

  // توليد مسألة جديدة
  const loadNextProblem = useCallback((lvl: number, errs: number) => {
    const prob = generateMulProblem(lvl) as unknown as Problem;
    setCurrentProblem(prob);
    setDisplayOptions([...prob.options].sort(() => Math.random() - 0.5));
    const t = getBaseTimer(lvl, errs);
    setTimerMax(t);
    setTimeLeft(t);
  }, [getBaseTimer]);

  // بدء الجلسة
  const startRace = () => {
    const hasTicket = selectHasTicket(useProgressStore.getState());
    if (!isPreviewMode && !hasTicket) {
      buyTicket();
      const recheck = selectHasTicket(useProgressStore.getState());
      if (!recheck) return;
    }
    if (!isPreviewMode) {
      consumeTicket();
    }

    seaSfx.init();
    setGap(60);
    setScoreCount(0);
    setStreak(0);
    setErrorStreak(0);
    setLevel(1);
    setElapsedSec(0);
    setRopeUsed(false);
    setIsNewHighScore(false);
    setErrorDetails(null);

    loadNextProblem(1, 0);
    setGameState('playing');
  };

  // مؤقت اللعب لكل مسألة
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        handleTimeout();
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, currentProblem]);

  // مؤقت الوقت الإجمالي للجلسة (90 ثانية)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const sessionInterval = setInterval(() => {
      setElapsedSec((sec) => {
        const nextSec = sec + 1;
        if (nextSec >= SESSION_SECONDS) {
          handleSessionTimeout();
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(sessionInterval);
  }, [gameState]);

  // البرق العشوائي في العاصفة (gap < 30)
  useEffect(() => {
    if (gameState !== 'playing' || gap >= 30) return;

    const lightningInterval = setInterval(() => {
      setIsLightning(true);
      seaSfx.playThunder();
      setTimeout(() => setIsLightning(false), 300);
    }, Math.random() * 5000 + 7000);

    return () => clearInterval(lightningInterval);
  }, [gameState, gap]);

  // انتهاء وقت المسألة الفردية
  const handleTimeout = () => {
    seaSfx.playTrumpet(false);
    seaSfx.vibrate([0, 50, 30, 50]);
    const newGap = Math.max(0, gap - 15);
    setGap(newGap);

    if (newGap <= 0) {
      finishGame('defeat');
      return;
    }

    const defaultStep = currentProblem?.steps?.[0] || {
      running: currentProblem?.answer || 0,
      onesRod: 1,
      tensRod: 0,
      product: currentProblem?.answer || 0
    };

    setErrorDetails({
      selected: -99,
      explanation: currentProblem?.why || 'انتهى الوقت! حافظ على التركيز.',
      step: defaultStep
    });
    setErrorStreak((es) => es + 1);
    setStreak(0);
    setGameState('error_review');
  };

  const handleSessionTimeout = () => {
    finishGame('timeout');
  };

  // معالجة الإجابة
  const handleAnswer = (option: MulOption) => {
    if (!currentProblem) return;

    if (option.value === currentProblem.answer) {
      seaSfx.playTrumpet(true);
      seaSfx.vibrate(30);

      const newScore = scoreCount + 1;
      const newStreak = streak + 1;
      setScoreCount(newScore);
      setStreak(newStreak);
      setErrorStreak(0);

      const bonus = newStreak >= 3 ? 10 : 6;
      const newGap = Math.min(100, gap + bonus);
      setGap(newGap);

      if (newGap >= 100) {
        finishGame('victory');
        return;
      }

      const nextLevel = Math.min(4, Math.floor(newScore / 5) + 1);
      setLevel(nextLevel);

      loadNextProblem(nextLevel, errorStreak);
    } else {
      seaSfx.playTrumpet(false);
      seaSfx.vibrate([0, 50, 30, 50]);

      const newGap = Math.max(0, gap - 12);
      setGap(newGap);

      if (newGap <= 0) {
        finishGame('defeat');
        return;
      }

      const nextErrorStreak = errorStreak + 1;
      setErrorStreak(nextErrorStreak);
      setStreak(0);

      // اختيار الخطوة المطابقة للخطأ إن وجدت أو الخطوة الأولى
      const matchedStep = currentProblem.steps?.[Math.min(nextErrorStreak - 1, (currentProblem.steps?.length || 1) - 1)] || currentProblem.steps?.[0] || {
        running: option.value,
        onesRod: 1,
        tensRod: 0,
        product: option.value
      };

      setErrorDetails({
        selected: option.value,
        explanation: option.why || currentProblem.why || 'خطأ في عملية الضرب. راجع خطوات المعداد.',
        step: matchedStep
      });

      setGameState('error_review');
    }
  };

  // رمية حبل ريان (تحذف خياراً خاطئاً واحداً)
  const useRayanRope = () => {
    if (ropeUsed || !currentProblem) return;
    setRopeUsed(true);
    seaSfx.vibrate(40);

    const wrongOptions = displayOptions.filter((opt) => opt.value !== currentProblem.answer);
    if (wrongOptions.length > 0) {
      const optionToRemove = wrongOptions[0];
      setDisplayOptions(displayOptions.filter((opt) => opt !== optionToRemove));
    }
  };

  const finishGame = (endState: GameState) => {
    setGameState(endState);
    seaSfx.playTrumpet(endState === 'victory');

    let earnedXP = 2;
    if (scoreCount >= 15) earnedXP += 3;
    else if (scoreCount >= 10) earnedXP += 2;
    else if (scoreCount >= 5) earnedXP += 1;
    if (earnedXP > 5) earnedXP = 5;

    addXP(earnedXP);

    const childName = readChildName() || 'البطل';
    const existing = getHighScore(GAME_ID);
    const currentBest = existing?.value ?? 0;
    if (scoreCount > currentBest) {
      addScore(GAME_ID, childName, scoreCount, HERO_ID);
      setIsNewHighScore(true);
      setHighScore({ rank: 1, name: childName, value: scoreCount, heroId: HERO_ID, date: new Date().toISOString() });
    }
  };

  const weather = gap >= 60 ? 'sunny' : gap >= 30 ? 'rain' : 'storm';

  const getRayanBubbleText = () => {
    if (gameState === 'victory') return 'وصلنا للجزيرة! 🏝️';
    if (gameState === 'defeat' || gameState === 'timeout') return 'أمسكوا بنا! نحاول مرة أخرى.';
    if (!ropeUsed) return 'خُذ حبل الإنقاذ!';
    if (gap < 40) return 'القراصنة يقتربون!';
    if (streak >= 3) return 'أنت أسطورة!';
    return 'أسرع يا بطل!';
  };

  // شاشة الترحيب
  if (gameState === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-between min-h-[90vh] p-6 text-center bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-2xl max-w-md mx-auto relative overflow-hidden">
        <div className="w-full flex justify-start">
          <button 
            onClick={onBack}
            className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2 text-sm font-bold"
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة</span>
          </button>
        </div>

        <div className="flex flex-col items-center my-auto py-4">
          <div className="text-6xl mb-4 animate-bounce">🏴‍☠️⛵</div>
          <h1 className="text-3xl font-black text-amber-400 mb-2">سباق القراصنة</h1>
          <p className="text-slate-300 text-sm max-w-xs mb-6">
            أسرع بإجاباتك الصحيحة لتسبق سفينة القراصنة وتصل إلى جزيرة الكنز قبل نفاد الوقت!
          </p>

          <div className="mb-6 w-full">
            <HighScoreBadge gameId={GAME_ID} variant="full" />
          </div>

          <button
            onClick={startRace}
            className="w-full max-w-xs py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl shadow-xl transition-transform active:scale-95 text-lg flex items-center justify-center gap-2"
          >
            <span>▶️ ابدأ السباق</span>
          </button>
        </div>

        <div className="text-xs text-slate-500">
          منهجية السوروبان · تاكاشي كوجيما
        </div>
      </div>
    );
  }

  // شاشة النصر
  if (gameState === 'victory') {
    const starsCount = Math.floor(scoreCount / 3);
    let earnedXP = 2;
    if (scoreCount >= 15) earnedXP += 3;
    else if (scoreCount >= 10) earnedXP += 2;
    else if (scoreCount >= 5) earnedXP += 1;
    if (earnedXP > 5) earnedXP = 5;

    return (
      <div className="flex flex-col items-center justify-between min-h-[90vh] p-6 text-center bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl shadow-2xl max-w-md mx-auto">
        <div className="w-full flex justify-start">
          <button onClick={onBack} className="p-2 rounded-2xl bg-slate-800 text-slate-300">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center my-auto py-4">
          <div className="text-6xl mb-3 animate-bounce">🏝️🏆</div>
          <h2 className="text-3xl font-black text-emerald-400 mb-1">وصلت للجزيرة!</h2>
          <p className="text-slate-300 text-sm mb-4">أنت بحار ماهر بحق!</p>

          {isNewHighScore && (
            <div className="mb-4 bg-amber-500/20 border border-amber-500/50 px-4 py-2 rounded-xl text-amber-300 font-bold text-sm animate-pulse">
              🎉 رقم قياسي جديد!
            </div>
          )}

          <div className="bg-slate-900/80 border border-slate-800 w-full rounded-2xl p-4 mb-6 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">العمليات الصحيحة:</span>
              <span className="font-bold text-amber-400">{scoreCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">النجوم الذهبية:</span>
              <span className="font-bold text-amber-300">⭐ {starsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">نقاط الخبرة (XP):</span>
              <span className="font-bold text-purple-400">+{earnedXP} XP</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={startRace}
              className="py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>🔄 لعب مجدداً</span>
            </button>
            <button
              onClick={onBack}
              className="py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-colors"
            >
              ← مدينة الألعاب
            </button>
          </div>
        </div>
        <div />
      </div>
    );
  }

  // شاشة الهزيمة أو انتهاء الوقت
  if (gameState === 'defeat' || gameState === 'timeout') {
    return (
      <div className="flex flex-col items-center justify-between min-h-[90vh] p-6 text-center bg-gradient-to-b from-rose-950 via-slate-900 to-slate-950 text-white rounded-3xl shadow-2xl max-w-md mx-auto">
        <div className="w-full flex justify-start">
          <button onClick={onBack} className="p-2 rounded-2xl bg-slate-800 text-slate-300">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center my-auto py-4">
          <div className="text-6xl mb-3">🏴‍☠️⛓️</div>
          <h2 className="text-3xl font-black text-rose-500 mb-1">
            {gameState === 'defeat' ? 'أمسك بك القراصنة!' : 'انتهى الوقت!'}
          </h2>
          <p className="text-slate-300 text-sm mb-6">سأستعيده معك. مرة أخرى؟</p>

          <div className="bg-slate-900/80 border border-slate-800 w-full rounded-2xl p-4 mb-6 flex justify-between items-center text-sm">
            <span className="text-slate-400">العمليات الصحيحة:</span>
            <span className="font-bold text-amber-400">{scoreCount}</span>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={startRace}
              className="py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>🔄 حاول مجدداً</span>
            </button>
            <button
              onClick={onBack}
              className="py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-colors"
            >
              ← مدينة الألعاب
            </button>
          </div>
        </div>
        <div />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between min-h-[90vh] max-w-md mx-auto p-4 bg-slate-950 text-white rounded-3xl shadow-2xl relative overflow-hidden">
      {/* 56px — رأس (رجوع · ريان · ⏱️ · 🎯) + شريط مؤقت 6px */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex justify-between items-center h-12">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="scale-75 origin-center">
            <GameCompanion heroId={HERO_ID} mood="excited" />
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl text-amber-400">
              🎯 {scoreCount}
            </div>
            <div className="bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-xl text-sky-400">
              ⏱️ {timeLeft}ث
            </div>
          </div>
        </div>

        {/* شريط مؤقت 6px */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 via-amber-400 to-rose-500"
            style={{ width: `${(timeLeft / timerMax) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      </div>

      {/* 220px — مشهد البحر والسفن (PirateScene) */}
      <div className="h-[200px] w-full my-1">
        <PirateScene 
          gap={gap} 
          elapsedSec={elapsedSec} 
          isLightning={isLightning} 
          weather={weather} 
        />
      </div>

      {/* 112px — بطاقة السؤال */}
      {currentProblem && (
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-3 my-2 flex flex-col items-center justify-center shadow-inner relative">
          <div className="text-2xl font-black text-amber-300 tracking-wider mb-2">
            {currentProblem.num1} × {currentProblem.num2} = ؟
          </div>

          {/* زر حبل ريان (متاح طوال اللعبة وحتى استخدامه مرة واحدة) */}
          {!ropeUsed && (
            <button
              onClick={useRayanRope}
              className="absolute top-2 left-2 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>🤝 حبل ريان</span>
            </button>
          )}

          {/* الخيارات الثلاثة */}
          <div className="grid grid-cols-3 gap-2 w-full mt-1">
            {displayOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                style={{ touchAction: 'manipulation' }}
                className="h-[60px] bg-[#7c4a1e] hover:bg-[#925422] active:scale-95 text-xl font-black text-amber-100 rounded-2xl border border-amber-600/50 shadow-lg flex items-center justify-center transition-transform"
              >
                {opt.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* آخر 56px — فقاعة ريان */}
      <div className="h-[56px] bg-slate-900/80 border border-amber-500/20 rounded-2xl px-4 flex items-center gap-3 mt-1 shadow-md">
        <div className="text-xl">👦</div>
        <div className="text-xs font-bold text-amber-200/90 truncate">
          ريان: "{getRayanBubbleText()}"
        </div>
      </div>

      {/* بطاقة الخطأ المنزلقة (Error Review Modal) */}
      <AnimatePresence>
        {gameState === 'error_review' && currentProblem && errorDetails && (
          <motion.div
            initial={{ translateY: '100%', opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: '100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-4 flex flex-col items-center justify-between overflow-y-auto"
          >
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>تصحيح المسار (منهجية كوجيما)</span>
              </div>
              <span className="text-xs text-slate-400">إجابة خاطئة</span>
            </div>

            <div className="text-center text-xs text-slate-300 max-w-xs mb-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              {errorDetails.explanation}
            </div>

            {/* المعداد متعدد الأعمدة لعرض الخطوة الصحيحة */}
            <div className="my-1">
              <MultiRodAbacus
                digits={rodsFromNumber(currentProblem.answer)}
                runningTotal={errorDetails.step?.running ?? currentProblem.answer}
                activeRods={[errorDetails.step?.onesRod ?? 1, errorDetails.step?.tensRod ?? 0]}
                arcValue={errorDetails.step?.product ?? currentProblem.answer}
                columns={5}
              />
            </div>

            <div className="text-sm font-bold text-amber-300 my-2">
              الإجابة الصحيحة: {currentProblem.answer}
            </div>

            <button
              onClick={() => {
                setErrorDetails(null);
                setGameState('playing');
                loadNextProblem(level, errorStreak);
              }}
              style={{ touchAction: 'manipulation' }}
              className="w-full max-w-xs py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm mt-2"
            >
              <span>▶️ متابعة السباق</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
