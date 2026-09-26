// src/screens/AnzanScreen.tsx
// شاشة الأنزان البصري — Flash + عادي
// ✅ Flash: 2s لكل رقم
// ✅ عادي: عرض السؤال كاملاً + TTS + عدّاد تصاعدي
// ✅ الأعمدة من أكبر قيمة في السؤال
// ✅ زر إنهاء + توهّج 70%
// ✅ AdaptiveFeedback + Mastery Badges

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, CheckCircle2, XCircle, Clock,
  Trophy, RotateCcw, Play, Brain, Zap, Eye, AlertCircle, Square,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { SorobanaCompanion } from '@/components/SorobanaCompanion';
import { AdaptiveFeedback, type SkillPerformance } from '@/components/AdaptiveFeedback';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useSpeech } from '@/hooks/useSpeech';
import { useProgressStore } from '@/store/progressStore';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { useMasteryBadgesStore, classifySpeed } from '@/store/masteryBadgesStore';
import { formatText, formatNumber } from '@/utils/numberStyle';
import { numberToArabicWords } from '@/utils/arabicNumbers';

import {
  getAnzanVisualQuestions,
  recordWeaknessAttempt,
  type BankQuestion,
} from '@/data/bank-v2';

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

type Phase = 'intro' | 'showing' | 'answering' | 'reveal' | 'result';
type Mode = 'flash' | 'عادي';

interface AnzanScreenProps {
  levelNum: number;
  onBack: () => void;
  onComplete?: (passed: boolean, score: number) => void;
  playSound: (type: 'click' | 'success' | 'error' | 'whoosh' | 'levelup') => void;
  onXP?: (amount: number) => void;
  burst?: (x?: number, y?: number) => void;
}

interface PerfStats {
  correct: number;
  attempts: number;
  totalTimeMs: number;
  answerMs: number;
}

// ═══════════════════════════════════════════════════════════
// الثوابت
// ═══════════════════════════════════════════════════════════

const XP_PER_CORRECT = 5;
const PASS_THRESHOLD = 75;
const DISPLAY_MS_PER_TERM = 2000;   // ✅ 2 ثانية لكل رقم
const WARNING_RATIO = 0.7;          // ✅ توهّج عند 70%

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

/** ✅ الأعمدة = max(أكبر رقم في السلسلة، الناتج) */
function getColumnsForQuestion(question: BankQuestion): number {
  const candidates: number[] = [
    Math.abs(question.correctAnswer),
    ...question.operands.map((op) => Math.abs(op)),
  ];
  const maxAbs = Math.max(...candidates);

  if (maxAbs < 1000) return 3;
  if (maxAbs < 1_000_000) return 6;
  if (maxAbs < 1_000_000_000) return 9;
  return 13;
}

/** ✅ Flash: ترميز كل رقم مع إشارته */
function buildDisplayTerms(question: BankQuestion): string[] {
  const { operands, operation } = question;

  if (operation === "multiplication") {
    return [String(operands[0]), `× ${Math.abs(operands[1])}`];
  }
  if (operation === "division") {
    return [String(operands[0]), `÷ ${Math.abs(operands[1])}`];
  }

  return operands.map((op, i) => {
    if (i === 0) return String(op);
    if (op >= 0) return String(op);
    return `-${Math.abs(op)}`;
  });
}

/** ✅ عرض السؤال كاملاً (للـ عادي) */
function buildFullQuestionText(question: BankQuestion): string {
  const { operands, operation } = question;

  if (operation === "multiplication") {
    return `${operands[0]} × ${Math.abs(operands[1])}`;
  }
  if (operation === "division") {
    return `${operands[0]} ÷ ${Math.abs(operands[1])}`;
  }

  let text = String(operands[0]);
  for (let i = 1; i < operands.length; i++) {
    const op = operands[i];
    if (op >= 0) text += ` + ${op}`;
    else text += ` − ${Math.abs(op)}`;
  }
  return text;
}

/** ✅ TTS: قراءة السؤال كاملاً بالعربية */
function buildFullQuestionSpeech(question: BankQuestion): string {
  const { operands, operation } = question;

  if (operation === "multiplication") {
    return `${numberToArabicWords(operands[0])} في ${numberToArabicWords(Math.abs(operands[1]))}`;
  }
  if (operation === "division") {
    return `${numberToArabicWords(operands[0])} على ${numberToArabicWords(Math.abs(operands[1]))}`;
  }

  const parts: string[] = [numberToArabicWords(operands[0])];
  for (let i = 1; i < operands.length; i++) {
    const op = operands[i];
    if (op >= 0) parts.push(numberToArabicWords(op));
    else parts.push(`ناقص ${numberToArabicWords(Math.abs(op))}`);
  }
  return parts.join('، ');
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function AnzanScreen({
  levelNum, onBack, onComplete, playSound, onXP, burst,
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
  const [performances, setPerformances] = useState<SkillPerformance[]>([]);

  const sorobana = useSorobanaVoice();
  const { speak, stop: stopSpeech, isSpeaking, isSupported } = useSpeech();

  const addXP = useProgressStore((s) => s.addXP);
  const markAnzanVisualPassed = useProgressStore((s) => s.markAnzanVisualPassed);
  const updateStreak = useProgressStore((s) => s.updateStreak);

  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic';

  const awardBadge = useMasteryBadgesStore((s) => s.awardBadge);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const perfRef = useRef<Map<string, PerfStats>>(new Map());

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
    if (qs.length === 0) { playSound('error'); return; }

    perfRef.current = new Map();

    setQuestions(qs);
    setCurrentIdx(0);
    setCurrentTermIdx(0);
    setAbacusValue(0);
    setFeedback('idle');
    setScore(0);
    setElapsedMs(0);
    setSavedTimeMs(null);
    setPerformances([]);
    setPhase('showing');
    playSound('click');
  }, [levelNum, playSound]);

  // ═══════════════════════════════════════════════════════
  // مرحلة العرض
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (phase !== 'showing') return;
    if (!currentQ) return;

    // ─── الوضع العادي: عرض السؤال كاملاً + TTS ───
    if (mode === 'عادي') {
      if (!isSupported) {
        const t = setTimeout(() => setPhase('answering'), 3000);
        return () => clearTimeout(t);
      }
      const speech = buildFullQuestionSpeech(currentQ);
      speak(speech, {
        rate: 0.9,
        onEnd: () => setPhase('answering'),
      });
      return () => { stopSpeech(); };
    }

    // ─── Flash: عرض الأرقام واحداً واحداً ───
    if (currentTermIdx >= displayTerms.length) {
      const t = setTimeout(() => setPhase('answering'), 300);
      return () => clearTimeout(t);
    }

    displayTimerRef.current = setTimeout(() => {
      setCurrentTermIdx((i) => i + 1);
    }, DISPLAY_MS_PER_TERM);

    return () => {
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentTermIdx, displayTerms.length, mode, isSupported]);

  // ═══════════════════════════════════════════════════════
  // العدّاد (تصاعدي)
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (phase !== 'answering') return;
    if (feedback !== 'idle') return;
    timerRef.current = setInterval(() => {
      setElapsedMs((ms) => {
        const next = ms + 100;
        if (next >= maxMs) { handleTimeout(); return maxMs; }
        return next;
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, feedback, maxMs]);

  // ═══════════════════════════════════════════════════════
  // تسجيل الأداء
  // ═══════════════════════════════════════════════════════
  const trackPerformance = useCallback(
    (isCorrect: boolean, timeMs: number) => {
      if (!currentQ) return;
      const skillId = currentQ.skillId;
      const existing = perfRef.current.get(skillId) ?? {
        correct: 0, attempts: 0, totalTimeMs: 0, answerMs: currentQ.timing.answerMs,
      };
      existing.attempts += 1;
      if (isCorrect) existing.correct += 1;
      existing.totalTimeMs += timeMs;
      perfRef.current.set(skillId, existing);

      if (isCorrect) {
        const cls = classifySpeed(timeMs, currentQ.timing.answerMs);
        if (cls === 'mastery') {
          awardBadge(skillId, timeMs, currentQ.timing.answerMs);
        }
      }
    },
    [currentQ, awardBadge],
  );

  // ═══════════════════════════════════════════════════════
  // انتهاء الوقت
  // ═══════════════════════════════════════════════════════
  const handleTimeout = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;
    if (timerRef.current) clearInterval(timerRef.current);
    recordWeaknessAttempt(currentQ.skillId, false, maxMs);
    trackPerformance(false, maxMs);
    playSound('error');
    setFeedback('wrong');
    setSavedTimeMs(maxMs);
    sorobana.speakWrong();
    setPhase('reveal');
  }, [currentQ, feedback, maxMs, playSound, sorobana, trackPerformance]);

  // ═══════════════════════════════════════════════════════
  // التحقق
  // ═══════════════════════════════════════════════════════
  const handleCheck = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = abacusValue === currentQ.correctAnswer;
    const timeMs = elapsedMs;

    recordWeaknessAttempt(currentQ.skillId, isCorrect, timeMs);
    trackPerformance(isCorrect, timeMs);

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback('correct');
      playSound('success');
      sorobana.speakCorrect();
      onXP?.(XP_PER_CORRECT);
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
    onXP, burst, addXP, updateStreak, trackPerformance,
  ]);

  // ═══════════════════════════════════════════════════════
  // بناء قائمة الأداء
  // ═══════════════════════════════════════════════════════
  const buildPerformances = useCallback((): SkillPerformance[] => {
    const list: SkillPerformance[] = [];
    perfRef.current.forEach((stats, skillId) => {
      const avgTimeMs = stats.attempts === 0 ? 0 : stats.totalTimeMs / stats.attempts;
      list.push({
        skillId, correct: stats.correct, attempts: stats.attempts,
        avgTimeMs, answerMs: stats.answerMs,
        speedClass: classifySpeed(avgTimeMs, stats.answerMs),
      });
    });
    return list;
  }, []);

  // ═══════════════════════════════════════════════════════
  // السؤال التالي
  // ═══════════════════════════════════════════════════════
  const nextQuestion = useCallback(() => {
    sorobana.stop();
    stopSpeech();
    setAbacusValue(0);
    setFeedback('idle');
    setElapsedMs(0);
    setSavedTimeMs(null);
    setCurrentTermIdx(0);

    if (currentIdx + 1 >= questions.length) {
      const finalScore = score;
      const passed = (finalScore / questions.length) * 100 >= PASS_THRESHOLD;
      if (passed) markAnzanVisualPassed(levelNum);
      setPerformances(buildPerformances());
      setPhase('result');
      playSound(passed ? 'levelup' : 'whoosh');
      onComplete?.(passed, finalScore);
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('showing');
    }
  }, [
    currentIdx, questions.length, score, levelNum, playSound,
    sorobana, stopSpeech, onComplete, markAnzanVisualPassed, buildPerformances,
  ]);

  // ═══════════════════════════════════════════════════════
  // زر إنهاء التدريب
  // ═══════════════════════════════════════════════════════
  const handleEnd = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopSpeech();
    sorobana.stop();

    const finalScore = score;
    const passed = (finalScore / questions.length) * 100 >= PASS_THRESHOLD;

    if (passed) markAnzanVisualPassed(levelNum);

    setPerformances(buildPerformances());
    setPhase('result');
    playSound('whoosh');
    onComplete?.(passed, finalScore);
  }, [
    score, questions.length, levelNum, playSound, stopSpeech,
    sorobana, onComplete, markAnzanVisualPassed, buildPerformances,
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
              {formatNumber(5, numberStyle)} أسئلة من هذا المستوى
            </p>
          </div>
          <Brain className="w-6 h-6 text-purple-300" />
        </div>

        {/* اختيار الوضع */}
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
            onClick={() => { playSound('click'); setMode('عادي'); }}
            className={`flex-1 py-3 rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 ${
              mode === 'عادي' ? 'bg-purple-600 shadow-lg text-white' : 'text-white/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            عادي
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
                  <span className="text-purple-300 font-bold shrink-0">{formatNumber(1, numberStyle)}.</span>
                  <p>الأرقام تظهر <strong>واحداً واحداً</strong> ({formatNumber(2, numberStyle)} ثانيتين لكل رقم)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">{formatNumber(2, numberStyle)}.</span>
                  <p>الرقم الأول بلا إشارة، والباقي مع إشاراته</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">{formatNumber(3, numberStyle)}.</span>
                  <p>بعد آخر رقم → عدّاد الإجابة</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">{formatNumber(1, numberStyle)}.</span>
                  <p>السؤال يظهر <strong>كاملاً مكتوباً</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">{formatNumber(2, numberStyle)}.</span>
                  <p>يُقرأ السؤال صوتياً بالعربية</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-300 font-bold shrink-0">{formatNumber(3, numberStyle)}.</span>
                  <p>السؤال يبقى ظاهراً أثناء الإجابة</p>
                </div>
              </>
            )}

            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">{formatNumber(4, numberStyle)}.</span>
              <p>زر "تحقق" متاح دائماً، والانتقال يدوي بزر "التالي"</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">{formatNumber(5, numberStyle)}.</span>
              <p>يمكنك إنهاء التدريب في أي لحظة</p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 font-body leading-relaxed">
                💡 <strong>تحذير:</strong> سيُنبّهك العدّاد عند {formatNumber(70, numberStyle)}٪ من الوقت.
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
        {/* الشريط العلوي */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-xs text-white/50 font-body">
              {currentQ.skillId} · {mode === 'flash' ? 'Flash' : 'عادي'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleEnd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-200 text-xs font-bold transition"
          >
            <Square className="w-3.5 h-3.5" />
            إنهاء
          </button>
        </div>

        {/* شريط التقدم */}
        <div className="mb-6">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-electric-500"
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* المحتوى */}
        <div className="flex-1 flex items-center justify-center">
          {mode === 'flash' ? (
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
                    dir={isArabic ? 'rtl' : 'ltr'}
                  >
                    {formatText(displayTerms[currentTermIdx], numberStyle)}
                  </p>
                  <p className="text-sm text-white/40 font-body mt-4">
                    {formatNumber(currentTermIdx + 1, numberStyle)} / {formatNumber(displayTerms.length, numberStyle)}
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
          ) : (
            // الوضع العادي: عرض السؤال كاملاً
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-sm text-white/50 font-body mb-4">
                اسمع السؤال ثم مثّل الناتج
              </p>
              <p
                className="text-4xl sm:text-5xl font-black font-display text-white mb-6"
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                {formatText(buildFullQuestionText(currentQ), numberStyle)} = ؟
              </p>
              <motion.div
                animate={{ scale: isSpeaking ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
                className="inline-flex w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-electric-500 items-center justify-center shadow-xl"
              >
                <Brain className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>
          )}
        </div>

        <p className="text-xs text-white/40 font-body text-center mt-6">
          {mode === 'flash' ? '💡 جهّز أصابعك — طبّق كل رقم فوراً على العداد' : '🎧 اسمع السؤال بتركيز'}
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // المرحلة: answering
  // ═══════════════════════════════════════════════════════
  if (phase === 'answering' && currentQ) {
    const columns = getColumnsForQuestion(currentQ);

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        {/* الشريط العلوي */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-xs text-white/50 font-body">مثّل الناتج على العداد</p>
          </div>

          <button
            type="button"
            onClick={handleEnd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-200 text-xs font-bold transition"
          >
            <Square className="w-3.5 h-3.5" />
            إنهاء
          </button>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
            isWarning ? 'bg-red-500/30 border-red-500/70 shadow-lg shadow-red-500/50 animate-pulse' : 'bg-white/5 border-white/10'
          }`}>
            <Clock className={`w-4 h-4 ${isWarning ? 'text-red-300' : 'text-amber-300'}`} />
            <span className={`font-bold font-mono ${isWarning ? 'text-red-200' : 'text-white'}`}>
              {formatNumber((elapsedMs / 1000).toFixed(1), numberStyle)}s
            </span>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="mb-5">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                isWarning ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-emerald-400 to-teal-500'
              }`}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* السؤال يبقى ظاهراً في الوضع العادي فقط */}
        {mode === 'عادي' && (
          <div className="glass-card p-4 mb-4 text-center">
            <p
              className="text-2xl sm:text-3xl font-black font-display text-white"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {formatText(buildFullQuestionText(currentQ), numberStyle)} = ؟
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white/70 font-body">
            {formatNumber(score, numberStyle)} / {formatNumber(currentIdx + 1, numberStyle)}
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
    const formattedAnswer = formatNumber(currentQ.correctAnswer, numberStyle);

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-6 overflow-hidden relative"
        >
          <div className={`absolute -top-20 -right-20 w-48 h-48 blur-3xl ${
            isCorrect ? 'bg-emerald-500/30' : 'bg-red-500/30'
          }`} />

          <div className="relative text-center">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 ${
              isCorrect
                ? 'from-emerald-400 to-teal-600 shadow-xl shadow-emerald-500/40'
                : 'from-red-400 to-rose-600 shadow-xl shadow-red-500/40'
            }`}>
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
              <p
                className="text-5xl font-black font-display text-white"
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                {formattedAnswer}
              </p>
            </div>

            {savedTimeMs !== null && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 inline-block">
                <p className="text-xs text-white/60 font-body">وقتك</p>
                <p className={`text-xl font-bold font-mono ${
                  isCorrect ? 'text-emerald-300' : 'text-red-300'
                }`}>
                  {formatNumber((savedTimeMs / 1000).toFixed(1), numberStyle)}s
                </p>
              </div>
            )}

            {currentQ.explanation && (
              <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-400/30 text-right">
                <p className="text-xs text-blue-200 font-body leading-relaxed">
                  💡 {formatText(currentQ.explanation, numberStyle)}
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
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto space-y-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 overflow-hidden relative"
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
              <p
                className="text-5xl font-black font-display text-white mt-1"
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                {formatNumber(score, numberStyle)} / {formatNumber(questions.length, numberStyle)}
              </p>
              <p className={`text-lg font-bold font-body mt-1 ${
                passed ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {formatNumber(percentage, numberStyle)}٪
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-400/30">
              <p className="text-xs text-white/60 font-body">نقاط الخبرة</p>
              <p className="text-2xl font-black text-gold-300 font-display">
                +{formatNumber(xpEarned, numberStyle)} XP
              </p>
            </div>
          </div>
        </motion.div>

        {performances.length > 0 && (
          <AdaptiveFeedback
            performances={performances}
            sectionLabel="أنزان بصري"
          />
        )}

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