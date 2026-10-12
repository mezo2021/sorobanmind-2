// ═══════════════════════════════════════════════════════════════════
// 🏰 src/components/games/Sorobania/SorobaniaGame.tsx
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Flame,
  KeyRound,
  Sparkles,
  RotateCcw,
  Lock
} from 'lucide-react';

import { useProgressStore, selectHasTicket } from '@/store/progressStore';
import { isPreviewMode } from '@/utils/previewMode';
import { GameCompanion } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import type { CharacterType } from '@/types';

interface SorobaniaGameProps {
  onBack: () => void;
}

const GAME_ID = 'sorobania-island';
const HERO_ID: CharacterType = 'bana';
const STORAGE_KEY = 'sorobania_progress_v1';

// ═══ دالة محلية للحصول على اسم الطفل ═══
const getLocalChildName = (): string => {
  try {
    const savedName = localStorage.getItem('soroban_child_name');
    if (savedName) return savedName;
  } catch (e) {
    // إهمال الخطأ في حال تعذر الوصول إلى التخزين المحلي
  }
  return 'البطل';
};

// ═══ بنك 1: المربعات (1 إلى 25 + أعداد آحادها 5) ═══
const SQUARES_BANK = [
  ...Array.from({ length: 25 }, (_, i) => {
    const num = i + 1;
    return { num, ans: num * num };
  }),
  { num: 35, ans: 1225 },
  { num: 45, ans: 2025 },
  { num: 55, ans: 3025 },
  { num: 65, ans: 4225 },
  { num: 75, ans: 5625 },
  { num: 85, ans: 7225 },
  { num: 95, ans: 9025 },
];

// ═══ بنك 2: الجذور (الـ 27 مسألة الدقيقة) ═══
const ROOTS_BANK = [
  { val: 100, ans: 10, pair1: '1', pair2: '00' },
  { val: 144, ans: 12, pair1: '1', pair2: '44' },
  { val: 225, ans: 15, pair1: '2', pair2: '25' },
  { val: 256, ans: 16, pair1: '2', pair2: '56' },
  { val: 400, ans: 20, pair1: '4', pair2: '00' },
  { val: 441, ans: 21, pair1: '4', pair2: '41' },
  { val: 625, ans: 25, pair1: '6', pair2: '25' },
  { val: 784, ans: 28, pair1: '7', pair2: '84' },
  { val: 900, ans: 30, pair1: '9', pair2: '00' },
  { val: 1024, ans: 32, pair1: '10', pair2: '24' },
  { val: 1225, ans: 35, pair1: '12', pair2: '25' },
  { val: 1521, ans: 39, pair1: '15', pair2: '21' },
  { val: 1600, ans: 40, pair1: '16', pair2: '00' },
  { val: 1849, ans: 43, pair1: '18', pair2: '49' },
  { val: 2025, ans: 45, pair1: '20', pair2: '25' },
  { val: 2500, ans: 50, pair1: '25', pair2: '00' },
  { val: 2916, ans: 54, pair1: '29', pair2: '16' },
  { val: 3364, ans: 58, pair1: '33', pair2: '64' },
  { val: 3600, ans: 60, pair1: '36', pair2: '00' },
  { val: 3969, ans: 63, pair1: '39', pair2: '69' },
  { val: 4225, ans: 65, pair1: '42', pair2: '25' },
  { val: 4900, ans: 70, pair1: '49', pair2: '00' },
  { val: 5184, ans: 72, pair1: '51', pair2: '84' },
  { val: 6400, ans: 80, pair1: '80', pair2: '00' },
  { val: 7225, ans: 85, pair1: '72', pair2: '25' },
  { val: 8100, ans: 90, pair1: '81', pair2: '00' },
  { val: 9801, ans: 99, pair1: '98', pair2: '01' },
];

type GameState = 'welcome' | 'tutorial' | 'playing' | 'defeat' | 'victory';

export default function SorobaniaGame({ onBack }: SorobaniaGameProps) {
  const { addXP, buyTicket, consumeTicket } = useProgressStore();
  const { speak } = useCharacterVoice(HERO_ID);

  const [mode, setMode] = useState<'squares' | 'roots'>('squares');
  const [gameState, setGameState] = useState<GameState>('welcome');

  // إحصائيات ولعب
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [bestSpeedTime, setBestSpeedTime] = useState<number>(999);
  const [torches, setTorches] = useState<number>(4); // 4 حيوات / مشاعل

  // استرجاع التقدم التراكمي للمربعات من localStorage
  const [cumulativeSquares, setCumulativeSquares] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // تفاصيل السؤال الحالي
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [qStartTime, setQStartTime] = useState<number>(0);

  // شاشة اكتشاف السر (Aha! Tutorial)
  const [ahaStep, setAhaStep] = useState<number>(1);

  // لوحة الشرف
  const [highScore, setHighScore] = useState<HighScoreEntry | null>(null);
  const [, setIsNewHighScore] = useState<boolean>(false);

  useEffect(() => {
    const existing = getHighScore(GAME_ID);
    if (existing) setHighScore(existing);
  }, []);

  // حفظ التقدم التراكمي عند تغيره
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(cumulativeSquares));
    } catch (e) {
      // إهمال أخطاء التخزين
    }
  }, [cumulativeSquares]);

  // دالة توليد مشتتات ذكية ومخصصة
  const generateSmartDistractors = (num: number, ans: number) => {
    if (num <= 7) {
      const wrong1 = Math.pow(Math.max(1, num - 1), 2);
      const wrong2 = Math.pow(num + 1, 2);
      return [ans, wrong1, wrong2].filter((v, i, arr) => arr.indexOf(v) === i).sort(() => Math.random() - 0.5);
    }
    if (num >= 35 && num % 10 === 5) {
      const wrong1 = ans - 100;
      const wrong2 = ans + 200;
      return [ans, wrong1, wrong2].sort(() => Math.random() - 0.5);
    }
    const diff = Math.floor(Math.random() * 30) + 15;
    const wrong1 = ans + diff;
    const wrong2 = Math.max(1, ans - diff);
    return [ans, wrong1, wrong2].sort(() => Math.random() - 0.5);
  };

  // تحميل سؤال جديد
  const loadNewQuestion = useCallback((selectedMode: 'squares' | 'roots') => {
    setInputAnswer('');
    setQStartTime(Date.now());

    if (selectedMode === 'squares') {
      const q = SQUARES_BANK[Math.floor(Math.random() * SQUARES_BANK.length)];
      const opts = generateSmartDistractors(q.num, q.ans);
      setCurrentQuestion(q);
      setOptions(opts);
      setTimeLeft(10);
    } else {
      const q = ROOTS_BANK[Math.floor(Math.random() * ROOTS_BANK.length)];
      setCurrentQuestion(q);
      setTimeLeft(15);
    }
  }, []);

  // إنهاء الحفظ وسجل النتائج
  const handleFinishScore = useCallback((finalScore: number) => {
    const earnedXP = Math.min(5, 2 + Math.floor(finalScore / 5));
    addXP(earnedXP);

    const childName = getLocalChildName();
    const existing = getHighScore(GAME_ID);
    const bestVal = existing?.value ?? 0;
    if (finalScore > bestVal) {
      addScore(GAME_ID, childName, finalScore, HERO_ID);
      setIsNewHighScore(true);
      setHighScore({ name: childName, value: finalScore, heroId: HERO_ID, date: Date.now() });
    }
  }, [addXP]);

  // معالجة الخطأ أو انتهاء المهلة (خصم مشعل / حياة)
  const handleWrongAnswer = useCallback(() => {
    setTorches((prevTorches) => {
      const remainingTorches = prevTorches - 1;
      if (remainingTorches <= 0) {
        handleFinishScore(bestStreak);
        speak('انتهت المشاعل!');
        setGameState('defeat');
      } else {
        speak('لا بأس، حاول مجدداً!');
        loadNewQuestion(mode);
      }
      return remainingTorches;
    });
    setStreak(0);
  }, [mode, bestStreak, handleFinishScore, loadNewQuestion, speak]);

  // مؤقت التنازلي التلقائي لكل سؤال
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleWrongAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentQuestion, handleWrongAnswer]);

  // بدء اللعب لفحص التذاكر
  const startGame = (selectedMode: 'squares' | 'roots') => {
    const hasTicket = selectHasTicket(useProgressStore.getState());
    if (!isPreviewMode && !hasTicket) {
      buyTicket();
      const recheck = selectHasTicket(useProgressStore.getState());
      if (!recheck) return;
    }
    if (!isPreviewMode) {
      consumeTicket();
    }

    setMode(selectedMode);
    setStreak(0);
    setBestStreak(0);
    setTorches(4);
    setIsNewHighScore(false);
    loadNewQuestion(selectedMode);
    setGameState('playing');
    speak('أهلاً بك في معبد سوروبانيا!');
  };

  // معالجة الإجابة الصحيحة
  const handleCorrectAnswer = () => {
    const duration = (Date.now() - qStartTime) / 1000;
    if (duration < bestSpeedTime) {
      setBestSpeedTime(Number(duration.toFixed(1)));
    }

    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > bestStreak) setBestStreak(newStreak);

    if (mode === 'squares') {
      const newCum = cumulativeSquares + 1;
      setCumulativeSquares(newCum);
    }

    // شرط الفوز: الوصول لسلسلة 10 إجابات صحيحة
    if (newStreak >= 10) {
      handleFinishScore(newStreak);
      speak('انتصار مذهل! فككت شفرة المعبد!');
      setGameState('victory');
      return;
    }

    speak('رائع جداً!');
    loadNewQuestion(mode);
  };

  // التحقق من إدخال الكيبورد للجذور
  const handleKeyInput = (digit: string) => {
    if (inputAnswer.length >= 3) return;
    const nextVal = inputAnswer + digit;
    setInputAnswer(nextVal);

    if (currentQuestion && Number(nextVal) === currentQuestion.ans) {
      setTimeout(() => handleCorrectAnswer(), 250);
    } else if (currentQuestion && nextVal.length >= String(currentQuestion.ans).length) {
      setTimeout(() => handleWrongAnswer(), 250);
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[90vh] max-w-md mx-auto p-4 bg-slate-950 text-white rounded-3xl shadow-2xl relative overflow-hidden select-none">

      {/* ═══ 1. رأس الشاشة ═══ */}
      <div className="flex justify-between items-center h-12 z-10 border-b border-slate-800/80 pb-2">
        <button onClick={onBack} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800">
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-black">
          {/* الحيوات (المشاعل الأربعة) */}
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl text-amber-400">
            <span>🔥 {torches}/4</span>
          </div>
          {/* السلسلة */}
          <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-xl text-purple-300">
            <Flame className="w-3.5 h-3.5 fill-purple-300" />
            <span>السلسلة: {streak}</span>
          </div>
        </div>
      </div>

      {/* ═══ 2. المشهد البصري: معبد سوروبانيا ورفيق اللعبة (بانة) ═══ */}
      <div className="relative h-44 w-full my-2 rounded-2xl overflow-hidden border border-amber-500/20 shadow-xl bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-950/40 flex items-center justify-between px-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-amber-400">جزيرة سوروبانيا</h2>
          <p className="text-[11px] text-slate-300 max-w-[170px]">فك شفرة المعبد واجمع القوة الذهنية مع بانة!</p>
        </div>
        <div className="scale-90 origin-right">
          <GameCompanion heroId={HERO_ID} mood={streak >= 3 ? 'excited' : 'idle'} />
        </div>

        {/* مؤشر الوقت التنازلي البصري أثناء اللعب */}
        {gameState === 'playing' && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-950">
            <motion.div
              className={`h-full ${timeLeft <= 3 ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}`}
              style={{ width: `${(timeLeft / (mode === 'squares' ? 10 : 15)) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* ═══ 3. شاشة الترحيب الرئيسية ═══ */}
      {gameState === 'welcome' && (
        <div className="flex flex-col items-center my-auto gap-4 py-2 text-center">
          {highScore && (
            <div className="w-full mb-1">
              <HighScoreBadge gameId={GAME_ID} variant="full" />
            </div>
          )}

          <div className="flex flex-col gap-3 w-full max-w-xs my-2">
            <button
              onClick={() => startGame('squares')}
              className="py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-between px-6 text-base"
            >
              <span>✨ مربعات الأعداد</span>
              <span className="text-xs bg-slate-950/20 px-2 py-1 rounded-lg">10 ثوانٍ</span>
            </button>

            {/* زر الجذور (مغلق إذا لم يصل المستخدم إلى 10 إجابات صحيحة تراكمية في المربعات) */}
            {cumulativeSquares < 10 ? (
              <div className="py-3.5 px-6 bg-slate-900/80 border border-slate-800 rounded-2xl text-slate-400 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>أسرار الجذور التربيعية</span>
                </span>
                <span className="font-mono text-amber-400 font-bold">{cumulativeSquares}/10 مربعات</span>
              </div>
            ) : (
              <button
                onClick={() => startGame('roots')}
                className="py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-between px-6 text-base border border-sky-400/30"
              >
                <span>🔑 أسرار الجذور</span>
                <KeyRound className="w-5 h-5 text-sky-300" />
              </button>
            )}

            <button
              onClick={() => setGameState('tutorial')}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>اكتشف سرّ أعداد الآحاد 5 (Aha! Moment)</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══ 4. مهمة اكتشاف السرّ (Aha! Tutorial) ═══ */}
      {gameState === 'tutorial' && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 my-auto flex flex-col items-center text-center gap-3 shadow-2xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>سرّ الحساب السحري مع بانة!</span>
          </div>

          {ahaStep === 1 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-slate-200">
                لاحظ معنا: <span className="text-amber-300 font-bold">35² = 1225</span>
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                انظر للعشرات (3): نضربها في العدد الذي يليها مباشرة <span className="text-amber-400 font-bold">3 × 4 = 12</span>، ثم نضع بجانبها <span className="text-sky-300 font-bold">25</span> فوراً!
              </div>
              <button
                onClick={() => setAhaStep(2)}
                className="py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs"
              >
                جرب اكتشاف القادم ←
              </button>
            </div>
          )}

          {ahaStep === 2 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-slate-200">
                فلنكتشف معاً: كم سيكون الناتج لـ <span className="text-amber-300 font-bold">45²</span>؟
              </p>
              <div className="text-xs text-slate-400">اضرب العشرات (4) في العدد الذي يليها (5):</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => alert('خطأ بسيط، اضرب 4 × 5 = 20!')}
                  className="py-2 bg-slate-800 text-white rounded-xl text-xs border border-slate-700"
                >
                  1625
                </button>
                <button
                  onClick={() => setAhaStep(3)}
                  className="py-2 bg-emerald-600 text-white font-black rounded-xl text-xs border border-emerald-500"
                >
                  2025 🎉 (اكتشفت السرّ!)
                </button>
              </div>
            </div>
          )}

          {ahaStep === 3 && (
            <div className="flex flex-col gap-3">
              <div className="text-sm font-black text-amber-400">أنت الآن ماهر في السحر العددي!</div>
              <p className="text-xs text-slate-300">يمكنك الآن خوض التحدي الحقيقي في معبد سوروبانيا.</p>
              <button
                onClick={() => {
                  setAhaStep(1);
                  setGameState('welcome');
                }}
                className="py-2.5 bg-sky-500 text-slate-950 font-black rounded-xl text-xs"
              >
                العودة للقائمة الرئيسية 🏰
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ 5. شاشة اللعب الأساسية ═══ */}
      {gameState === 'playing' && currentQuestion && (
        <div className="flex flex-col items-center my-auto w-full gap-4">

          {/* بطاقة السؤال */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 w-full text-center shadow-inner relative">
            <div className="text-xs text-slate-400 mb-1">
              {mode === 'squares' ? 'احسب المربع الذهبي:' : 'فك جذر المعبد بنظام الأزواج:'}
            </div>

            <div className="text-3xl font-black text-amber-300 tracking-wider">
              {mode === 'squares' ? `${currentQuestion.num}² = ؟` : `√${currentQuestion.val} = ؟`}
            </div>

            {mode === 'roots' && (
              <div className="flex justify-center gap-2 mt-2 text-xs font-mono text-sky-400">
                <span className="bg-sky-950 border border-sky-800 px-2 py-0.5 rounded">({currentQuestion.pair1})</span>
                <span className="bg-sky-950 border border-sky-800 px-2 py-0.5 rounded">({currentQuestion.pair2})</span>
              </div>
            )}
          </div>

          {/* النمط الأول: 3 خيارات ذكية للمربعات */}
          {mode === 'squares' && (
            <div className="grid grid-cols-3 gap-2 w-full">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (opt === currentQuestion.ans) handleCorrectAnswer();
                    else handleWrongAnswer();
                  }}
                  className="h-16 bg-[#7c4a1e] hover:bg-[#925422] active:scale-95 text-xl font-black text-amber-100 rounded-2xl border border-amber-600/50 shadow-lg flex items-center justify-center transition-transform"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* النمط الثاني: الكيبورد الرقمي المباشر للجذور */}
          {mode === 'roots' && (
            <div className="flex flex-col items-center w-full gap-3">
              <div className="w-full h-12 bg-slate-900 border border-sky-500/50 rounded-xl flex items-center justify-center text-2xl font-black text-sky-300 font-mono tracking-widest">
                {inputAnswer || '_'}
              </div>

              <div className="grid grid-cols-3 gap-2 w-full">
                {['1','2','3','4','5','6','7','8','9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeyInput(digit)}
                    className="h-12 bg-slate-800 hover:bg-slate-700 active:scale-95 text-lg font-bold text-white rounded-xl border border-slate-700 shadow"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={() => setInputAnswer('')}
                  className="h-12 bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold rounded-xl text-xs border border-rose-800 flex items-center justify-center"
                >
                  مسح
                </button>
                <button
                  onClick={() => handleKeyInput('0')}
                  className="h-12 bg-slate-800 hover:bg-slate-700 text-lg font-bold text-white rounded-xl border border-slate-700 shadow"
                >
                  0
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ 6. شاشة الهزيمة (انطفاء المشاعل الأربعة) ═══ */}
      {gameState === 'defeat' && (
        <div className="flex flex-col items-center my-auto gap-4 text-center">
          <div className="text-5xl">🏰🔥</div>
          <h3 className="text-2xl font-black text-rose-400">انطفأت مشاعل المعبد!</h3>
          <p className="text-xs text-slate-300 max-w-xs">
            أحسنت محاولتك يا بطل. حققت سلسلة إجابات: <span className="text-amber-400 font-bold">{bestStreak}</span>
          </p>

          <button
            onClick={() => startGame(mode)}
            className="py-3.5 px-8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-xl flex items-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>حاول مجدداً</span>
          </button>
        </div>
      )}

      {/* ═══ 7. شاشة الانتصار (الوصول لسلسلة 10) ═══ */}
      {gameState === 'victory' && (
        <div className="flex flex-col items-center my-auto gap-4 text-center">
          <div className="text-5xl">🏆✨</div>
          <h3 className="text-2xl font-black text-emerald-400">انتصار مذهل!</h3>
          <p className="text-xs text-slate-300 max-w-xs">
            تمكنت من فك شفرة معبد سوروبانيا وإشعال كافة المشاعل بنجاح!
          </p>
          <div className="bg-slate-900 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs text-emerald-300 font-bold">
            السلسلة الذهبية: {bestStreak} إجابات متتالية
          </div>

          <button
            onClick={() => setGameState('welcome')}
            className="py-3.5 px-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl shadow-xl flex items-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>العودة للقائمة</span>
          </button>
        </div>
      )}

      {/* ═══ 8. فقاعة رفيق اللعبة (بانة) في الأسفل ═══ */}
      <div className="h-12 bg-slate-900/80 border border-amber-500/20 rounded-2xl px-4 flex items-center gap-3 shadow-md mt-2">
        <div className="text-xl">👩‍🦰</div>
        <div className="text-xs font-bold text-amber-200 truncate">
          بانة: "{streak >= 3 ? 'حسابات ذهنية خارقة!' : 'ركّز في القواعد وسوف تبدع!'}"
        </div>
      </div>
    </div>
  );
}