// src/screens/CategoryExamScreen.tsx
// امتحان القسم (1 للصغار / 2 للكبار)
// ✅ 20 / 40 سؤالاً — 10 / 20 دقيقة
// ✅ محاولتان لكل سؤال (نقطة كاملة / نصف نقطة)
// ✅ تقييم فوري بين المحاولتين
// ✅ أسهم تنقل + زر إنهاء
// ✅ شارة عدد الأعمدة
// ✅ 80% للنجاح + 48 ساعة انتظار بعد الفشل

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Clock, Trophy, CheckCircle2, XCircle,
  Target, Sparkles, Play, Type, LogOut, Grid3X3, AlertTriangle,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatText, formatNumber } from '@/utils/numberStyle';

import {
  buildExam1Category,
  buildExam2Category,
  EXAM1_TIME_SEC,
  EXAM2_TIME_SEC,
  EXAM_PASS_THRESHOLD,
  EXAM_MAX_ATTEMPTS,
  EXAM_COOLDOWN_MS,
  type BankQuestion,
} from '@/data/bank-v2';

type Phase = 'intro' | 'cooldown' | 'running' | 'result';

interface CategoryExamScreenProps {
  category: 'kids' | 'teens';
  onBack: () => void;
  onComplete: (passed: boolean, score: number) => void;
  playSound: (type: 'click' | 'success' | 'error' | 'whoosh' | 'levelup') => void;
}

interface QuestionAttempt {
  value: number;
  attempts: number;
  correct: boolean;
  points: number; // 0 / 0.5 / 1
}

const EXAM_CONFIG = {
  kids: {
    questionCount: 20,
    totalTimeSec: EXAM1_TIME_SEC,
    title: 'امتحان القسم الأول',
    subtitle: 'الأبطال الصغار (٥-١٢)',
    gradient: 'from-emerald-400 to-teal-600',
    storageKey: 'soroban_exam1',
  },
  teens: {
    questionCount: 40,
    totalTimeSec: EXAM2_TIME_SEC,
    title: 'امتحان القسم الثاني',
    subtitle: 'الأبطال الكبار (١٣+)',
    gradient: 'from-purple-400 to-indigo-600',
    storageKey: 'soroban_exam2',
  },
} as const;

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getColumnsForQuestion(q: BankQuestion): number {
  const candidates: number[] = [Math.abs(q.correctAnswer)];
  q.operands.forEach((op) => candidates.push(Math.abs(op)));
  const maxAbs = Math.max(...candidates);
  if (maxAbs < 1000) return 3;
  if (maxAbs < 1_000_000) return 6;
  if (maxAbs < 1_000_000_000) return 9;
  return 13;
}

function getColumnsLabel(columns: number, isArabic: boolean): string {
  const map: Record<number, { ar: string; en: string }> = {
    3: { ar: '٣ أعمدة', en: '3 Columns' },
    6: { ar: '٦ أعمدة', en: '6 Columns' },
    9: { ar: '٩ أعمدة', en: '9 Columns' },
    13: { ar: '١٣ عموداً', en: '13 Columns' },
  };
  const entry = map[columns];
  if (!entry) return `${columns}`;
  return isArabic ? entry.ar : entry.en;
}

function formatTimeLeft(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  return `${hrs} ساعة و ${mins} دقيقة`;
}

export function CategoryExamScreen({
  category,
  onBack,
  onComplete,
  playSound,
}: CategoryExamScreenProps) {
  const cfg = EXAM_CONFIG[category];
  const { style: numberStyle, toggleStyle } = useNumberStyleStore();
  const isArabic = numberStyle === 'arabic';

  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [attempts, setAttempts] = useState<Map<string, QuestionAttempt>>(new Map());
  const [abacusValue, setAbacusValue] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState(cfg.totalTimeSec);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong' | 'reveal'>('idle');
  const [finalScore, setFinalScore] = useState(0);
  const [finalPassed, setFinalPassed] = useState(false);
  const [cooldownMs, setCooldownMs] = useState<number>(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQ = questions[currentIdx];

  // ─── فحص الـ cooldown عند البدء ───
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${cfg.storageKey}_last_attempt`);
      if (raw) {
        const lastTime = parseInt(raw, 10);
        if (!isNaN(lastTime)) {
          setLastAttemptTime(lastTime);
          const elapsed = Date.now() - lastTime;
          const remaining = EXAM_COOLDOWN_MS - elapsed;
          if (remaining > 0) {
            setCooldownMs(remaining);
            setPhase('cooldown');
            return;
          }
        }
      }
    } catch { /* ignore */ }
    setPhase('intro');
  }, [cfg.storageKey]);

  // ─── عدّاد الـ cooldown (للعرض فقط) ───
  useEffect(() => {
    if (phase !== 'cooldown') return;
    const interval = setInterval(() => {
      setCooldownMs((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(interval);
          setPhase('intro');
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // ─── بدء الامتحان ───
  const startTest = useCallback(() => {
    const qs = category === 'kids' ? buildExam1Category() : buildExam2Category();
    if (qs.length === 0) { playSound('error'); return; }

    setQuestions(qs);
    setCurrentIdx(0);
    setAttempts(new Map());
    setAbacusValue(0);
    setCurrentAttempt(1);
    setFeedback('idle');
    setTimeLeft(cfg.totalTimeSec);
    setPhase('running');
    playSound('click');
  }, [category, cfg.totalTimeSec, playSound]);

  // ─── عدّاد الوقت الكلي ───
  useEffect(() => {
    if (phase !== 'running') return;
    if (timeLeft <= 0) {
      finalizeExam(attempts);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  // ─── إنهاء الامتحان + الحساب ───
  const finalizeExam = useCallback((finalAttempts: Map<string, QuestionAttempt>) => {
    let totalPoints = 0;
    finalAttempts.forEach((rec) => {
      totalPoints += rec.points;
    });
    const score = Math.round((totalPoints / questions.length) * 100);
    const passed = score >= EXAM_PASS_THRESHOLD;

    setFinalScore(score);
    setFinalPassed(passed);

    // حفظ النتيجة
    try {
      localStorage.setItem(`${cfg.storageKey}_passed`, JSON.stringify(passed));
      localStorage.setItem(`${cfg.storageKey}_score`, JSON.stringify(score));
      localStorage.setItem(`${cfg.storageKey}_last_attempt`, String(Date.now()));
    } catch { /* ignore */ }

    // لو نجح Exam 1 → افتح L4
    if (passed && category === 'kids') {
      try {
        const raw = localStorage.getItem('soroban_completed_levels');
        const arr = raw ? JSON.parse(raw) : [];
        if (!arr.includes('L4')) {
          // لا نضعها كـ "completed" — بل نفتح القسم الثاني
        }
        // فتح القسم الثاني (يُدار عبر App)
        localStorage.setItem('soroban_section2_unlocked', JSON.stringify(true));
      } catch { /* ignore */ }
    }

    setPhase('result');
    playSound(passed ? 'levelup' : 'whoosh');
  }, [questions.length, cfg.storageKey, category, playSound]);

  // ─── التحقق ───
  const handleCheck = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;

    const isCorrect = abacusValue === currentQ.correctAnswer;
    const newAttempts = new Map(attempts);

    if (isCorrect) {
      const points = currentAttempt === 1 ? 1 : 0.5;
      newAttempts.set(currentQ.id, {
        value: abacusValue,
        attempts: currentAttempt,
        correct: true,
        points,
      });
      setAttempts(newAttempts);
      setFeedback('correct');
      playSound('success');

      setTimeout(() => {
        advanceToNext(newAttempts);
      }, 1200);
    } else {
      if (currentAttempt >= EXAM_MAX_ATTEMPTS) {
        // محاولة ثانية فاشلة
        newAttempts.set(currentQ.id, {
          value: abacusValue,
          attempts: currentAttempt,
          correct: false,
          points: 0,
        });
        setAttempts(newAttempts);
        setFeedback('reveal');
        playSound('error');

        setTimeout(() => {
          advanceToNext(newAttempts);
        }, 2000);
      } else {
        // محاولة أولى فاشلة → إعادة
        newAttempts.set(currentQ.id, {
          value: abacusValue,
          attempts: currentAttempt,
          correct: false,
          points: 0,
        });
        setAttempts(newAttempts);
        setFeedback('wrong');
        setCurrentAttempt(2);
        playSound('error');

        setTimeout(() => {
          setFeedback('idle');
          setAbacusValue(0);
        }, 1500);
      }
    }
  }, [currentQ, abacusValue, attempts, currentAttempt, feedback, playSound]);

  // ─── الانتقال للسؤال التالي ───
  const advanceToNext = useCallback((currentAttempts: Map<string, QuestionAttempt>) => {
    setFeedback('idle');
    setCurrentAttempt(1);

    if (currentIdx + 1 >= questions.length) {
      finalizeExam(currentAttempts);
    } else {
      const nextIdx = currentIdx + 1;
      const nextQ = questions[nextIdx];
      setCurrentIdx(nextIdx);
      setAbacusValue(currentAttempts.get(nextQ.id)?.value ?? 0);
    }
  }, [currentIdx, questions, finalizeExam]);

  // ─── التنقل ───
  const goToQuestion = useCallback((idx: number) => {
    if (idx < 0 || idx >= questions.length) return;
    setCurrentIdx(idx);
    setCurrentAttempt(1);
    setFeedback('idle');
    const targetQ = questions[idx];
    if (targetQ) {
      setAbacusValue(attempts.get(targetQ.id)?.value ?? 0);
    }
  }, [questions, attempts]);

  const handlePrevious = useCallback(() => {
    if (currentIdx === 0) return;
    playSound('click');
    goToQuestion(currentIdx - 1);
  }, [currentIdx, goToQuestion, playSound]);

  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= questions.length) return;
    playSound('click');
    goToQuestion(currentIdx + 1);
  }, [currentIdx, questions.length, goToQuestion, playSound]);

  const confirmEndExam = useCallback(() => {
    setShowEndConfirm(false);
    finalizeExam(attempts);
  }, [attempts, finalizeExam]);

  // ═══════════════════════════════════════════════════════
  // المرحلة: cooldown
  // ═══════════════════════════════════════════════════════
  if (phase === 'cooldown') {
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
              {cfg.title}
            </h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-2 border-amber-400/40"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-300" />
          </div>

          <h3 className="text-xl font-extrabold font-display text-white text-center mb-3">
            انتظر قليلاً
          </h3>

          <p className="text-sm text-white/70 font-body text-center leading-relaxed mb-4">
            يمكنك إعادة الامتحان بعد مرور <strong>٤٨ ساعة</strong> من المحاولة الأخيرة.
          </p>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-center">
            <p className="text-xs text-amber-200 font-body mb-1">
              الوقت المتبقي
            </p>
            <p className="text-2xl font-black text-amber-100 font-display">
              {formatTimeLeft(cooldownMs)}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

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
              {cfg.title}
            </h2>
            <p className="text-sm text-white/50 font-body">{cfg.subtitle}</p>
          </div>
          <Trophy className="w-6 h-6 text-gold-300" />
        </div>

        <div className="glass-card p-4 mb-6">
          <p className="text-xs text-white/60 font-body mb-3 text-center">
            اختر نمط الأرقام
          </p>
          <div className="flex gap-2 bg-white/5 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => { playSound('click'); if (!isArabic) toggleStyle(); }}
              className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center ${
                isArabic
                  ? 'bg-gradient-to-l from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="text-2xl">١ ٢ ٣</span>
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); if (isArabic) toggleStyle(); }}
              className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center ${
                !isArabic
                  ? 'bg-gradient-to-l from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="text-2xl">3 2 1</span>
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-xl mx-auto mb-4`}>
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-xl font-extrabold font-display text-white text-center mb-4">
            كيف يعمل الامتحان؟
          </h3>

          <div className="space-y-3 text-sm text-white/80 font-body">
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(1, numberStyle)}.</span>
              <p><strong>{formatNumber(cfg.questionCount, numberStyle)} سؤالاً</strong> من مستويات القسم</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(2, numberStyle)}.</span>
              <p>الزمن الإجمالي: <strong>{formatNumber(cfg.totalTimeSec / 60, numberStyle)} دقيقة</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(3, numberStyle)}.</span>
              <p><strong>محاولتان لكل سؤال</strong> — محاولة أولى = نقطة كاملة، ثانية = نصف نقطة</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(4, numberStyle)}.</span>
              <p>عتبة النجاح: <strong>{formatNumber(EXAM_PASS_THRESHOLD, numberStyle)}٪</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(5, numberStyle)}.</span>
              <p>يمكنك التنقل بين الأسئلة وإنهاء الاختبار في أي وقت</p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 font-body leading-relaxed">
                💡 بعد الفشل، يُعاد الامتحان بعد <strong>٤٨ ساعة</strong>.
              </p>
            </div>
          </div>
        </motion.div>

        <button
          type="button"
          onClick={startTest}
          className="btn-primary w-full !py-4 !text-lg"
        >
          <Play className="w-6 h-6" />
          ابدأ الامتحان
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // المرحلة: running
  // ═══════════════════════════════════════════════════════
  if (phase === 'running' && currentQ) {
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const timeWarning = timeLeft <= 60;
    const columns = getColumnsForQuestion(currentQ);
    const isLastQuestion = currentIdx === questions.length - 1;
    const isFirstQuestion = currentIdx === 0;

    const formattedPrompt = formatText(
      currentQ.prompt.replace(/ = ؟$/, ''),
      numberStyle,
    );

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-4 max-w-2xl mx-auto min-h-screen flex flex-col">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white truncate">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-[10px] text-white/50 font-body truncate">
              {currentQ.levelId} · {currentQ.skillId} · محاولة {formatNumber(currentAttempt, numberStyle)}/{formatNumber(EXAM_MAX_ATTEMPTS, numberStyle)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); toggleStyle(); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition"
          >
            <Type className="w-4 h-4 text-white/70" />
          </button>

          <div className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border ${
            timeWarning
              ? 'bg-red-500/20 border-red-500/50'
              : 'bg-white/5 border-white/10'
          }`}>
            <Clock className={`w-4 h-4 ${timeWarning ? 'text-red-300' : 'text-amber-300'}`} />
            <span className={`font-bold font-mono text-sm ${timeWarning ? 'text-red-300' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient}`}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 sm:p-6 w-full text-center mb-4"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-200 text-xs font-bold">
                <Grid3X3 className="w-3.5 h-3.5" />
                {getColumnsLabel(columns, isArabic)}
              </span>
            </div>

            <p
              className="text-3xl sm:text-4xl font-black font-display text-white mb-5"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {formattedPrompt} = ؟
            </p>

            {feedback === 'wrong' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3 rounded-xl bg-amber-500/15 border border-amber-400/40"
              >
                <p className="text-sm text-amber-200 font-bold">
                  ❌ إجابة خاطئة — حاول مرة أخرى
                </p>
                <p className="text-[10px] text-amber-200/70 font-body mt-1">
                  محاولتك الأخيرة — إجابة صحيحة = ½ نقطة
                </p>
              </motion.div>
            )}

            {feedback === 'correct' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/40"
              >
                <p className="text-sm text-emerald-200 font-bold">
                  ✅ أحسنت! {currentAttempt === 1 ? '(نقطة كاملة)' : '(½ نقطة)'}
                </p>
              </motion.div>
            )}

            {feedback === 'reveal' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3 rounded-xl bg-red-500/15 border border-red-400/40"
              >
                <p className="text-sm text-red-200 font-bold mb-1">
                  ❌ الإجابة الصحيحة:
                </p>
                <p className="text-2xl font-black text-red-300" dir={isArabic ? 'rtl' : 'ltr'}>
                  {formatNumber(currentQ.correctAnswer, numberStyle)}
                </p>
              </motion.div>
            )}

            {feedback !== 'reveal' && (
              <div className="flex justify-center mb-3">
                <Soroban2D5
                  key={`q-${currentQ.id}-${feedback}-${columns}`}
                  columns={columns}
                  initialValue={abacusValue}
                  autoBeadSize={true}
                  interactive={feedback === 'idle'}
                  showValue={true}
                  onValueChange={setAbacusValue}
                />
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ArrowRight className="w-4 h-4" />
              السابق
            </button>

            <button
              type="button"
              onClick={handleCheck}
              disabled={feedback !== 'idle'}
              className={`py-3 rounded-2xl bg-gradient-to-l ${cfg.gradient} text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg transition disabled:opacity-40`}
            >
              <CheckCircle2 className="w-4 h-4" />
              تحقق
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isLastQuestion}
              className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              التالي
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); setShowEndConfirm(true); }}
            className="w-full py-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-200 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            إنهاء الاختبار
          </button>
        </div>

        <AnimatePresence>
          {showEndConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowEndConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 30 }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-amber-500/30 text-center"
                dir="rtl"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-amber-300" />
                </div>

                <h3 className="text-xl font-extrabold font-display text-white mb-2">
                  إنهاء الاختبار؟
                </h3>

                <p className="text-sm text-white/60 font-body mb-6 leading-relaxed">
                  ستُحتسب الأسئلة غير المُجابة <span className="text-red-300 font-bold">صفراً</span>.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={confirmEndExam}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold"
                  >
                    نعم، أنهِ
                  </button>
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setShowEndConfirm(false); }}
                    className="flex-1 py-3 rounded-2xl bg-white/10 text-white/80 font-bold"
                  >
                    متابعة
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // المرحلة: result
  // ═══════════════════════════════════════════════════════
  if (phase === 'result') {
    const passed = finalPassed;

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              {passed ? 'مبروك! نجحت 🎉' : 'حاول مرة أخرى 💪'}
            </h2>

            <p className="text-sm text-white/60 font-body mb-6">{cfg.subtitle}</p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <p className="text-sm text-white/60 font-body">النتيجة</p>
              <p className="text-5xl font-black font-display text-white mt-1"
                dir={isArabic ? 'rtl' : 'ltr'}>
                {formatNumber(finalScore, numberStyle)}٪
              </p>
              <p className={`text-sm font-bold font-body mt-2 ${
                passed ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {passed
                  ? '🎓 انتقلت إلى القسم التالي!'
                  : `تحتاج ${formatNumber(EXAM_PASS_THRESHOLD, numberStyle)}٪ للنجاح`
                }
              </p>
            </div>

            {!passed && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30">
                <p className="text-xs text-amber-200 font-body">
                  ⏰ يمكنك إعادة الامتحان بعد <strong>٤٨ ساعة</strong>
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onComplete(passed, finalScore);
            }}
            className="btn-primary w-full !py-4 !text-lg"
          >
            <Sparkles className="w-6 h-6" />
            {passed ? 'متابعة الرحلة' : 'العودة'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default CategoryExamScreen;