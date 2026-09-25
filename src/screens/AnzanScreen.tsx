// src/screens/AnzanScreen.tsx
// شاشة الأنزان البصري (Flash + Regular)
// ═══════════════════════════════════════════════════════════
// - 5 أسئلة من bank-v2
// - Flash Mode: الأرقام تظهر واحداً واحداً (3s/رقم)
// - Regular Mode: السؤال كاملاً
// - عدّاد تصاعدي + توهج عند 60%
// - زر "تحقق" دائم
// - زر "التالي" يدوي
// - تسجيل الضعف + progressStore
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, CheckCircle2, XCircle, Clock,
  Trophy, RotateCcw, Play, Brain, Zap, Eye, AlertCircle,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { SorobanaCompanion } from '@/components/SorobanaCompanion';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useProgressStore } from '@/store/progressStore';

import {
  getAnzanVisualQuestions,
  recordWeaknessAttempt,
  type BankQuestion,
} from '@/data/bank-v2';

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

type Phase = 'intro' | 'showing' | 'answering' | 'reveal' | 'result';
type Mode = 'flash' | 'regular';

interface AnzanScreenProps {
  levelNum: number;
  onBack: () => void;
  onComplete?: (passed: boolean, score: number) => void;
  playSound: (type: 'click' | 'success' | 'error' | 'whoosh' | 'levelup') => void;
  onXP?: (amount: number) => void;
  burst?: (x?: number, y?: number) => void;
}

// ═══════════════════════════════════════════════════════════
// الثوابت
// ═══════════════════════════════════════════════════════════

const XP_PER_CORRECT = 5;
const PASS_THRESHOLD = 75;
const DISPLAY_MS_PER_TERM = 3000;
const WARNING_RATIO = 0.6;

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

function getColumnsForValue(value: number): number {
  const abs = Math.abs(value);
  if (abs < 1000) return 3;
  if (abs < 1_000_000) return 6;
  return 9;
}

function buildDisplayTerms(question: BankQuestion): string[] {
  const { operands, operation } = question;

  if (operation === "multiplication" || operation === "division") {
    const symbol = operation === "multiplication" ? "×" : "÷";
    return operands.map((op, i) => {
      if (i === 0) return String(op);
      return `${symbol} ${Math.abs(op)}`;
    });
  }

  return operands.map((op, i) => {
    if (i === 0) return String(op);
    if (op >= 0) return `+${op}`;
    return String(op);
  });
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function AnzanScreen({
  levelNum,
  onBack,
  onComplete,
  playSound,
  onXP,
  burst,
}: AnzanScreenProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [mode, setMode] = useState<Mode>('flash');
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentTermIdx, setCurrentTermIdx] = useState(0);
  const [abacusValue, setAbacusValue] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [savedTimeMs, setSavedTimeMs] = useState<number | null>(null);

  const sorobana = useSorobanaVoice();

  // ✅ progressStore
  const addXP = useProgressStore((s) => s.addXP);
  const markAnzanVisualPassed = useProgressStore((s) => s.markAnzanVisualPassed);
  const updateStreak = useProgressStore((s) => s.updateStreak);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQ = questions[currentIdx];
  const maxMs = currentQ ? currentQ.timing.maxMs : 30000;
  const warningAtMs = maxMs * WARNING_RATIO;
  const isWarning = elapsedMs >= warningAtMs;
  const progressPct = Math.min(100, (elapsedMs / maxMs) * 100);

  const displayTerms = currentQ ? buildDisplayTerms(currentQ) : [];

  // ═══════════════════════════════════════════════════════
  // بدء الجلسة
  // ═══════════════════════════════════════════════════════
  const startSession = useCallback(() => {
    const qs = getAnzanVisualQuestions(levelNum, Date.now(), []);
    if (qs.length === 0) {
      playSound('error');
      return;
    }

    setQuestions(qs);
    setCurrentIdx(0);
    setCurrentTermIdx(0);
    setAbacusValue(0);
    setFeedback('idle');
    setScore(0);
    setElapsedMs(0);
    setSavedTimeMs(null);

    setPhase('showing');
    playSound('click');
  }, [levelNum, playSound]);

  // ═══════════════════════════════════════════════════════
  // Flash: عرض الأرقام واحداً واحداً
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (phase !== 'showing') return;
    if (!currentQ) return;

    if (mode === 'regular') {
      setPhase('answering');
      return;
    }

    if (currentTermIdx >= displayTerms.length) {
      setTimeout(() => setPhase('answering'), 300);
      return;
    }

    displayTimerRef.current = setTimeout(() => {
      setCurrentTermIdx((i) => i + 1);
    }, DISPLAY_MS_PER_TERM);

    return () => {
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentTermIdx, displayTerms.length, mode]);

  // ═══════════════════════════════════════════════════════
  // العدّاد
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (phase !== 'answering') return;
    if (feedback !== 'idle') return;

    timerRef.current = setInterval(() => {
      setElapsedMs((ms) => {
        const next = ms + 100;
        if (next >= maxMs) {
          handleTimeout();
          return maxMs;
        }
        return next;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, feedback, maxMs]);

  // ═══════════════════════════════════════════════════════
  // انتهاء الوقت
  // ═══════════════════════════════════════════════════════
  const handleTimeout = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;
    if (timerRef.current) clearInterval(timerRef.current);

    recordWeaknessAttempt(currentQ.skillId, false, maxMs);
    playSound('error');
    setFeedback('wrong');
    setSavedTimeMs(maxMs);
    sorobana.speakWrong();
    setPhase('reveal');
  }, [currentQ, feedback, maxMs, playSound, sorobana]);

  // ═══════════════════════════════════════════════════════
  // التحقق
  // ═══════════════════════════════════════════════════════
  const handleCheck = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = abacusValue === currentQ.correctAnswer;
    const timeMs = elapsedMs;

    recordWeaknessAttempt(currentQ.skillId, isCorrect, timeMs);

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback('correct');
      playSound('success');
      sorobana.speakCorrect();
      onXP?.(XP_PER_CORRECT);
      // ✅ progressStore
      addXP(XP_PER_CORRECT);
      updateStreak();
      burst?.(0.5, 0.5);
    } else {
      setFeedback('wrong');
      playSound('error');
      sorobana.speakWrong();
    }

    setSavedTimeMs(timeMs);
    setPhase('reveal');
  }, [
    currentQ, abacusValue, elapsedMs, feedback, playSound, sorobana,
    onXP, burst, addXP, updateStreak,
  ]);

  // ═══════════════════════════════════════════════════════
  // السؤال التالي
  // ═══════════════════════════════════════════════════════
  const nextQuestion = useCallback(() => {
    sorobana.stop();
    setAbacusValue(0);
    setFeedback('idle');
    setElapsedMs(0);
    setSavedTimeMs(null);

    if (currentIdx + 1 >= questions.length) {
      const finalScore = score;
      const passed = (finalScore / questions.length) * 100 >= PASS_THRESHOLD;

      // ✅ تسجيل النجاح في progressStore
      if (passed) {
        markAnzanVisualPassed(levelNum);
      }

      setPhase('result');
      playSound(passed ? 'levelup' : 'whoosh');
      onComplete?.(passed, finalScore);
    } else {
      setCurrentIdx((i) => i + 1);
      setCurrentTermIdx(0);
      setPhase('showing');
    }
  }, [
    currentIdx, questions.length, score, levelNum,
    playSound, sorobana, onComplete, markAnzanVisualPassed,
  ]);

  // ═══════════════════════════════════════════════════════
  // المرحلة: intro
  // ═══════════════════════════════════════════════════════
  if (phase === 'intro') {
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold font-display text-white">
              الأنزان البصري
            </h2>
            <p className="text-sm text-white/50 font-body">
              ٥ أسئلة من هذا المستوى
            </p>
          </div>
          <Brain className="w-6 h-6 text-purple-300" />
        </div>

        <div className="flex gap-2 mb-5 bg-white/5 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { playSound('click'); setMode('flash'); }}
            className={`flex-1 py-3 rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 ${
              mode === 'flash' ? 'bg-purple-600 shadow-lg text-white' : 'text-white/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            Flash (تحدٍّ)
          </button>
          <button
            type="button"
            onClick={() => { playSound('click'); setMode('regular'); }}
            className={`flex-1 py-3 rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 ${
              mode === 'regular' ? 'bg-purple-600 shadow-lg text-white' : 'text-white/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            Regular
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl shadow-purple-500/40 mx-auto mb-4">
            {mode === 'flash' ? (
              <Zap className="w-10 h-10 text-white" />
            ) : (
              <Eye className="w-10 h-10 text-white" />
            )}
          </div>

          <h3 className="text-xl font-extrabold font-display text-white text-center mb-4">
            {mode === 'flash' ? 'الوضع السريع (Flash)' : 'الوضع العادي'}
          </h3>

          <div className="space-y-3 text-sm text-white/80 font-body">
            {mode === 'flash' ? (
              <>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">١.</span>
                  <p>الأرقام تظهر <strong>واحداً واحداً</strong> (٣ ثوانٍ لكل رقم)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">٢.</span>
                  <p>الرقم الأول بلا إشارة، والباقي مع إشاراته</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">٣.</span>
                  <p>بعد آخر رقم → عدّاد الإجابة</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">١.</span>
                  <p>السؤال يظهر <strong>كاملاً</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">٢.</span>
                  <p>لديك وقت أطول للإجابة</p>
                </div>
              </>
            )}

            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">٤.</span>
              <p>زر "تحقق" متاح دائماً</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">٥.</span>
              <p>٥ نقاط خبرة لكل إجابة صحيحة</p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 font-body leading-relaxed">
                💡 <strong>تحذير:</strong> سيُنبّهك العدّاد عند ٦٠٪ من الوقت.
              </p>
            </div>
          </div>
        </motion.div>

        <button
          type="button"
          onClick={startSession}
          className="btn-primary w-full !py-4 !text-lg"
        >
          <Play className="w-6 h-6" />
          ابدأ الجلسة
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // المرحلة: showing
  // ═══════════════════════════════════════════════════════
  if (phase === 'showing' && currentQ) {
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto min-h-screen flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">
              السؤال {toArabicNumber(currentIdx + 1)} / {toArabicNumber(questions.length)}
            </h2>
            <p className="text-xs text-white/50 font-body">
              {currentQ.skillId} · {mode === 'flash' ? 'Flash' : 'Regular'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-electric-500"
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentTermIdx < displayTerms.length ? (
              <motion.div
                key={currentTermIdx}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p
                  className="text-7xl sm:text-9xl font-black font-display text-white"
                  dir="ltr"
                >
                  {displayTerms[currentTermIdx]}
                </p>
                <p className="text-sm text-white/40 font-body mt-4">
                  {toArabicNumber(currentTermIdx + 1)} / {toArabicNumber(displayTerms.length)}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="blank"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-4xl font-display text-white/30"
              >
                ...
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-white/40 font-body text-center mt-6">
          💡 جهّز أصابعك — طبّق كل رقم فوراً على العداد
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // المرحلة: answering
  // ═══════════════════════════════════════════════════════
  if (phase === 'answering' && currentQ) {
    const columns = getColumnsForValue(currentQ.correctAnswer);

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">
              السؤال {toArabicNumber(currentIdx + 1)} / {toArabicNumber(questions.length)}
            </h2>
            <p className="text-xs text-white/50 font-body">
              مثّل الناتج على العداد
            </p>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
              isWarning
                ? 'bg-red-500/30 border-red-500/70 shadow-lg shadow-red-500/50 animate-pulse'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <Clock className={`w-4 h-4 ${isWarning ? 'text-red-300' : 'text-amber-300'}`} />
            <span className={`font-bold font-mono ${isWarning ? 'text-red-200' : 'text-white'}`}>
              {toArabicNumber((elapsedMs / 1000).toFixed(1))}s
            </span>
          </div>
        </div>

        <div className="mb-5">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                isWarning
                  ? 'bg-gradient-to-r from-red-500 to-rose-600'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500'
              }`}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white/70 font-body">
            {toArabicNumber(score)} / {toArabicNumber(currentIdx + 1)}
          </span>
        </div>

        <div className="glass-card p-5 mb-5">
          <div className="flex flex-col items-center gap-3">
            <Soroban2D5
              key={`anzan-${currentIdx}`}
              columns={columns}
              autoBeadSize={true}
              interactive={true}
              showValue={true}
              onValueChange={setAbacusValue}
            />

            <button
              type="button"
              onClick={handleCheck}
              className="btn-primary !py-3 !px-8"
            >
              <CheckCircle2 className="w-5 h-5" />
              تحقق
            </button>
          </div>
        </div>

        <SorobanaCompanion
          isSpeaking={sorobana.isSpeaking}
          onClick={() => sorobana.speakTeaching()}
          variant="pointing"
          sizeOverride={150}
          offsetBottom="8rem"
          clickThrough={true}
        />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // المرحلة: reveal
  // ═══════════════════════════════════════════════════════
  if (phase === 'reveal' && currentQ) {
    const isCorrect = feedback === 'correct';

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-6 overflow-hidden relative"
        >
          <div
            className={`absolute -top-20 -right-20 w-48 h-48 blur-3xl ${
              isCorrect ? 'bg-emerald-500/30' : 'bg-red-500/30'
            }`}
          />

          <div className="relative text-center">
            <div
              className={`w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 ${
                isCorrect
                  ? 'from-emerald-400 to-teal-600 shadow-xl shadow-emerald-500/40'
                  : 'from-red-400 to-rose-600 shadow-xl shadow-red-500/40'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </div>

            <h2 className="text-2xl font-extrabold font-display text-white mb-2">
              {isCorrect ? 'أحسنت! 🎉' : 'ليس بعد'}
            </h2>

            <div className="my-6">
              <p className="text-sm text-white/60 font-body mb-1">الإجابة الصحيحة</p>
              <p className="text-5xl font-black font-display text-white">
                {toArabicNumber(currentQ.correctAnswer)}
              </p>
            </div>

            {savedTimeMs !== null && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 inline-block">
                <p className="text-xs text-white/60 font-body">وقتك</p>
                <p
                  className={`text-xl font-bold font-mono ${
                    isCorrect ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {toArabicNumber((savedTimeMs / 1000).toFixed(1))}s
                </p>
              </div>
            )}

            {currentQ.explanation && (
              <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-400/30 text-right">
                <p className="text-xs text-blue-200 font-body leading-relaxed">
                  💡 {currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <button
          type="button"
          onClick={nextQuestion}
          className="btn-primary w-full !py-4 !text-lg"
        >
          {currentIdx + 1 < questions.length ? 'التالي' : 'إنهاء الجلسة'}
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // المرحلة: result
  // ═══════════════════════════════════════════════════════
  if (phase === 'result') {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= PASS_THRESHOLD;
    const xpEarned = score * XP_PER_CORRECT;

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-6 overflow-hidden relative"
        >
          <div className={`absolute -top-24 -right-24 w-64 h-64 blur-3xl ${
            passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'
          }`} />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-2xl mx-auto mb-4 ${
                passed
                  ? 'from-emerald-400 to-teal-600 shadow-emerald-500/40'
                  : 'from-amber-400 to-orange-600 shadow-amber-500/40'
              }`}
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-2xl font-extrabold font-display text-white mb-2">
              {passed ? 'أحسنت! نجحت 🎉' : 'حاول مرة أخرى 💪'}
            </h2>

            <p className="text-sm text-white/60 font-body mb-6">
              {mode === 'flash' ? 'الوضع السريع (Flash)' : 'الوضع العادي'}
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <p className="text-sm text-white/60 font-body">النتيجة</p>
              <p className="text-5xl font-black font-display text-white mt-1">
                {toArabicNumber(score)} / {toArabicNumber(questions.length)}
              </p>
              <p className={`text-lg font-bold font-body mt-1 ${
                passed ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {toArabicNumber(percentage)}٪
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-400/30">
              <p className="text-xs text-white/60 font-body">نقاط الخبرة</p>
              <p className="text-2xl font-black text-gold-300 font-display">
                +{toArabicNumber(xpEarned)} XP
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => { playSound('click'); startSession(); }}
            className="btn-primary w-full !py-3"
          >
            <RotateCcw className="w-5 h-5" />
            جلسة جديدة
          </button>

          <button
            type="button"
            onClick={() => { playSound('click'); onBack(); }}
            className="btn-ghost w-full"
          >
            رجوع
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default AnzanScreen;