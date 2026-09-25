// src/screens/PracticeScreen.tsx
// شاشة التمرين — 5 أسئلة من bank-v2
// ✅ يدعم نمط الأرقام + AdaptiveFeedback + Mastery Badges

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Trophy, RotateCcw, XCircle,
  Clock, BookOpen, AlertCircle, Play,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { SorobanaCompanion } from '@/components/SorobanaCompanion';
import { AdaptiveFeedback, type SkillPerformance } from '@/components/AdaptiveFeedback';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useProgressStore } from '@/store/progressStore';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { useMasteryBadgesStore, classifySpeed } from '@/store/masteryBadgesStore';
import { formatText, formatNumber } from '@/utils/numberStyle';

import {
  getPracticeQuestions,
  recordWeaknessAttempt,
  type BankQuestion,
} from '@/data/bank-v2';

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

type Phase = 'intro' | 'running' | 'result';

interface PracticeScreenProps {
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

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function getColumnsForValue(value: number): number {
  const abs = Math.abs(value);
  if (abs < 1000) return 3;
  if (abs < 1_000_000) return 6;
  return 9;
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function PracticeScreen({
  levelNum,
  onBack,
  onComplete,
  playSound,
  onXP,
  burst,
}: PracticeScreenProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [abacusValue, setAbacusValue] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [performances, setPerformances] = useState<SkillPerformance[]>([]);

  const sorobana = useSorobanaVoice();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const perfRef = useRef<Map<string, PerfStats>>(new Map());

  // ✅ progressStore
  const addXP = useProgressStore((s) => s.addXP);
  const markPracticePassed = useProgressStore((s) => s.markPracticePassed);
  const updateStreak = useProgressStore((s) => s.updateStreak);

  // ✅ نمط الأرقام
  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic';

  // ✅ شارات المهارات
  const awardBadge = useMasteryBadgesStore((s) => s.awardBadge);

  const currentQ = questions[currentIdx];

  // ═══════════════════════════════════════════════════════
  // بدء الجلسة
  // ═══════════════════════════════════════════════════════
  const startSession = useCallback(() => {
    const qs = getPracticeQuestions(levelNum, Date.now(), []);
    if (qs.length === 0) {
      playSound('error');
      return;
    }

    // ✅ تصفير تتبّع الأداء
    perfRef.current = new Map();

    setQuestions(qs);
    setCurrentIdx(0);
    setAbacusValue(0);
    setFeedback('idle');
    setScore(0);
    setPerformances([]);
    setTimeLeft(Math.round(qs[0].timing.maxMs / 1000));
    setPhase('running');
    playSound('click');
  }, [levelNum, playSound]);

  // ═══════════════════════════════════════════════════════
  // العدّاد
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (phase !== 'running' || !currentQ) return;
    if (feedback !== 'idle') return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft, feedback, currentQ]);

  // ═══════════════════════════════════════════════════════
  // تسجيل الأداء (داخلي)
  // ═══════════════════════════════════════════════════════
  const trackPerformance = useCallback(
    (isCorrect: boolean, timeMs: number) => {
      if (!currentQ) return;

      const skillId = currentQ.skillId;
      const existing = perfRef.current.get(skillId) ?? {
        correct: 0,
        attempts: 0,
        totalTimeMs: 0,
        answerMs: currentQ.timing.answerMs,
      };

      existing.attempts += 1;
      if (isCorrect) existing.correct += 1;
      existing.totalTimeMs += timeMs;

      perfRef.current.set(skillId, existing);

      // ✅ شارة إذا قياسي
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
  // عند انتهاء الوقت
  // ═══════════════════════════════════════════════════════
  const handleTimeout = useCallback(() => {
    if (!currentQ) return;

    const timeMs = currentQ.timing.maxMs;

    recordWeaknessAttempt(currentQ.skillId, false, timeMs);
    trackPerformance(false, timeMs);

    playSound('error');
    setFeedback('wrong');
    sorobana.speakWrong();

    setTimeout(() => nextQuestion(false), 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, playSound, sorobana, trackPerformance]);

  // ═══════════════════════════════════════════════════════
  // التحقق
  // ═══════════════════════════════════════════════════════
  const handleCheck = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;

    const timeMs = (Math.round(currentQ.timing.maxMs / 1000) - timeLeft) * 1000;
    const isCorrect = abacusValue === currentQ.correctAnswer;

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
      setTimeout(() => nextQuestion(true), 1200);
    } else {
      setFeedback('wrong');
      playSound('error');
      sorobana.speakWrong();
      setTimeout(() => nextQuestion(false), 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, abacusValue, timeLeft, feedback, playSound, sorobana, onXP, burst, addXP, updateStreak, trackPerformance]);

  // ═══════════════════════════════════════════════════════
  // بناء قائمة الأداء النهائية
  // ═══════════════════════════════════════════════════════
  const buildPerformances = useCallback((): SkillPerformance[] => {
    const list: SkillPerformance[] = [];
    perfRef.current.forEach((stats, skillId) => {
      const avgTimeMs = stats.attempts === 0 ? 0 : stats.totalTimeMs / stats.attempts;
      list.push({
        skillId,
        correct: stats.correct,
        attempts: stats.attempts,
        avgTimeMs,
        answerMs: stats.answerMs,
        speedClass: classifySpeed(avgTimeMs, stats.answerMs),
      });
    });
    return list;
  }, []);

  // ═══════════════════════════════════════════════════════
  // السؤال التالي
  // ═══════════════════════════════════════════════════════
  const nextQuestion = useCallback(
    (wasCorrect: boolean) => {
      sorobana.stop();
      setAbacusValue(0);
      setFeedback('idle');

      const newScore = wasCorrect ? score + 1 : score;

      if (currentIdx + 1 >= questions.length) {
        const passed = (newScore / questions.length) * 100 >= PASS_THRESHOLD;
        setScore(newScore);
        setPerformances(buildPerformances());
        setPhase('result');
        playSound(passed ? 'levelup' : 'whoosh');

        if (passed) {
          markPracticePassed(levelNum);
        }

        onComplete?.(passed, newScore);
      } else {
        const nextQ = questions[currentIdx + 1];
        setCurrentIdx((i) => i + 1);
        setScore(newScore);
        setTimeLeft(Math.round(nextQ.timing.maxMs / 1000));
      }
    },
    [currentIdx, questions, score, playSound, sorobana, onComplete, buildPerformances, markPracticePassed, levelNum],
  );

  // ═══════════════════════════════════════════════════════
  // المرحلة: intro
  // ═══════════════════════════════════════════════════════
  if (phase === 'intro') {
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onBack();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold font-display text-white">
              تمرّن {formatNumber(levelNum, numberStyle)}
            </h2>
            <p className="text-sm text-white/50 font-body">
              {formatNumber(5, numberStyle)} أسئلة من هذا المستوى
            </p>
          </div>
          <BookOpen className="w-6 h-6 text-purple-300" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl shadow-purple-500/40 mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-xl font-extrabold font-display text-white text-center mb-4">
            قبل أن تبدأ
          </h3>

          <div className="space-y-3 text-sm text-white/80 font-body">
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">
                {formatNumber(1, numberStyle)}.
              </span>
              <p>{formatNumber(5, numberStyle)} أسئلة من مهارات هذا المستوى</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">
                {formatNumber(2, numberStyle)}.
              </span>
              <p>محاولة واحدة فقط لكل سؤال</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">
                {formatNumber(3, numberStyle)}.
              </span>
              <p>وقت محدد لكل سؤال — إذا انتهى ينتقل تلقائياً</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">
                {formatNumber(4, numberStyle)}.
              </span>
              <p>{formatNumber(75, numberStyle)}٪ للنّجاح</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">
                {formatNumber(5, numberStyle)}.
              </span>
              <p>{formatNumber(5, numberStyle)} نقاط خبرة لكل إجابة صحيحة</p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 font-body leading-relaxed">
                💡 الإجابة بزمن قياسي (< ٥٠٪) تمنحك <strong>شارة المهارة</strong> 🏅
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
  // المرحلة: running
  // ═══════════════════════════════════════════════════════
  if (phase === 'running' && currentQ) {
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const timeWarning = timeLeft <= 5;
    const columns = getColumnsForValue(currentQ.correctAnswer);

    const formattedPrompt = formatText(
      currentQ.prompt.replace(/ = ؟$/, ''),
      numberStyle,
    );

    const formattedAnswer = formatNumber(currentQ.correctAnswer, numberStyle);

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-xs text-white/50 font-body">
              {currentQ.skillId} · صعوبة {formatNumber(currentQ.difficulty, numberStyle)}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
              timeWarning
                ? 'bg-red-500/20 border-red-500/50'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <Clock
              className={`w-4 h-4 ${
                timeWarning ? 'text-red-300' : 'text-amber-300'
              }`}
            />
            <span
              className={`font-bold font-mono ${
                timeWarning ? 'text-red-300' : 'text-white'
              }`}
            >
              {formatNumber(timeLeft, numberStyle)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-electric-500"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white/70 font-body">
            {formatNumber(score, numberStyle)} / {formatNumber(currentIdx + 1, numberStyle)}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="glass-card p-5 sm:p-6 mb-5"
          >
            <p className="text-center text-white/40 font-body text-sm mb-3">
              مثّل الناتج على السوروبان
            </p>
            <p
              className="text-center text-4xl sm:text-5xl font-black font-display text-white mb-6"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {formattedPrompt} = ؟
            </p>

            {feedback === 'correct' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-center mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-300 font-bold">
                  أحسنت! إجابة صحيحة 🎉
                </p>
              </motion.div>
            )}

            {feedback === 'wrong' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-red-500/15 border border-red-400/40 text-center mb-4"
              >
                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-white/70 mb-1">الإجابة الصحيحة:</p>
                <p
                  className="text-3xl font-black text-red-300 font-display"
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {formattedAnswer}
                </p>
              </motion.div>
            )}

            {feedback === 'idle' && (
              <div className="flex flex-col items-center gap-3">
                <Soroban2D5
                  key={`practice-${currentIdx}`}
                  columns={columns}
                  autoBeadSize={true}
                  interactive={true}
                  showValue={true}
                  onValueChange={setAbacusValue}
                />

                <p className="text-xs text-white/50 font-body text-center">
                  💡 حرّك الخرزات لتمثيل الإجابة، ثم اضغط "تحقق"
                </p>

                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={abacusValue === 0}
                  className="btn-primary !py-3 !px-8 disabled:opacity-40"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  تحقق
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

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
          <div
            className={`absolute -top-24 -right-24 w-64 h-64 blur-3xl ${
              passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'
            }`}
          />

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
              {passed
                ? 'لقد أتقنت هذا المستوى'
                : 'ستُعاد الأسئلة البطيئة قريباً'}
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <p className="text-sm text-white/60 font-body">النتيجة</p>
              <p
                className="text-5xl font-black font-display text-white mt-1"
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                {formatNumber(score, numberStyle)} / {formatNumber(questions.length, numberStyle)}
              </p>
              <p
                className={`text-lg font-bold font-body mt-1 ${
                  passed ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
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

        {/* ✅ ملاحظات التعليم التكيفي */}
        {performances.length > 0 && (
          <AdaptiveFeedback
            performances={performances}
            sectionLabel="تمرّن"
          />
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              startSession();
            }}
            className="btn-primary w-full !py-3"
          >
            <RotateCcw className="w-5 h-5" />
            جلسة جديدة
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onBack();
            }}
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

export default PracticeScreen;