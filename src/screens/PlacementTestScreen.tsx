// src/screens/PlacementTestScreen.tsx
// شاشة امتحان تحديد المستوى (Placement Test)
// 40 سؤالاً — 20 دقيقة — 200 نقطة
// ✅ الإجابة على السوروبان
// ✅ زر إنهاء + السابق + التالي
// ✅ لا يوجد تقييم فوري (الانتقال فوري)
// ✅ يدعم نمط الأرقام (عربي / لاتيني)
// ✅ الأعمدة = max(السلسلة، الناتج) + عرض بصري

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Clock, Trophy, CheckCircle2, XCircle,
  Target, Sparkles, Play, Type, LogOut, Grid3X3,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatText, formatNumber } from '@/utils/numberStyle';

import {
  buildPlacementTest,
  evaluatePlacementTest,
  getLevelName,
  type PlacementQuestion,
  type PlacementResult,
} from '@/data/bank-v2';

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

type Phase = 'intro' | 'running' | 'result';

interface PlacementTestScreenProps {
  onBack: () => void;
  onComplete: (recommendedLevel: string, weakSkills: string[]) => void;
  playSound: (type: 'click' | 'success' | 'error' | 'whoosh' | 'levelup') => void;
}

// ═══════════════════════════════════════════════════════════
// الثوابت
// ═══════════════════════════════════════════════════════════

const TOTAL_TIME_SEC = 20 * 60;
const LOW_SCORE_THRESHOLD = 7;

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * ✅ حساب الأعمدة من max(السلسلة، الناتج)
 * (بدل الاعتماد على الناتج فقط)
 */
function getColumnsForQuestion(question: PlacementQuestion): number {
  // ✅ استخراج الأرقام من نص السؤال (لأن PlacementQuestion لا يحتوي على operands)
  const nums = (question.prompt.match(/\d+/g) ?? []).map(Number);
  const candidates: number[] = [
    Math.abs(question.correctAnswer),
    ...nums.map(Math.abs),
  ];
  const maxAbs = Math.max(...candidates, 0);

  if (maxAbs < 1000) return 3;
  if (maxAbs < 1_000_000) return 6;
  if (maxAbs < 1_000_000_000) return 9;
  return 13;
}

/** ✅ اسم وصفي لعدد الأعمدة */
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

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function PlacementTestScreen({
  onBack,
  onComplete,
  playSound,
}: PlacementTestScreenProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [abacusValue, setAbacusValue] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SEC);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ نمط الأرقام
  const { style: numberStyle, toggleStyle } = useNumberStyleStore();
  const isArabic = numberStyle === 'arabic';

  const currentQ = questions[currentIdx];

  // ─── بدء الامتحان ───
  const startTest = useCallback(() => {
    const qs = buildPlacementTest();
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers(new Map());
    setAbacusValue(0);
    setTimeLeft(TOTAL_TIME_SEC);
    setResult(null);
    setShowEndConfirm(false);
    setPhase('running');
    playSound('click');
  }, [playSound]);

  // ─── العدّاد ───
  useEffect(() => {
    if (phase !== 'running') return;
    if (timeLeft <= 0) {
      const res = evaluatePlacementTest(questions, answers);
      setResult(res);
      setPhase('result');
      playSound('levelup');
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  // ─── إنهاء الامتحان ───
  const confirmEndExam = useCallback(() => {
    const res = evaluatePlacementTest(questions, answers);
    setResult(res);
    setShowEndConfirm(false);
    setPhase('result');
    playSound('levelup');
  }, [questions, answers, playSound]);

  // ─── التنقل ───
  const goToQuestion = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= questions.length) return;
      setCurrentIdx(idx);
      const targetQ = questions[idx];
      if (targetQ) {
        setAbacusValue(answers.get(targetQ.placementId) ?? 0);
      }
    },
    [questions, answers],
  );

  // ─── تحقق ───
  const handleCheck = useCallback(() => {
    if (!currentQ) return;

    const newAnswers = new Map(answers);
    newAnswers.set(currentQ.placementId, abacusValue);
    setAnswers(newAnswers);
    playSound('click');

    if (currentIdx + 1 < questions.length) {
      const nextIdx = currentIdx + 1;
      const nextQ = questions[nextIdx];
      setCurrentIdx(nextIdx);
      setAbacusValue(newAnswers.get(nextQ.placementId) ?? 0);
    } else {
      const res = evaluatePlacementTest(questions, newAnswers);
      setResult(res);
      setPhase('result');
      playSound('levelup');
    }
  }, [currentQ, currentIdx, questions, answers, abacusValue, playSound]);

  // ─── السابق ───
  const handlePrevious = useCallback(() => {
    if (currentIdx === 0) return;
    playSound('click');
    goToQuestion(currentIdx - 1);
  }, [currentIdx, goToQuestion, playSound]);

  // ─── التالي ───
  const handleNext = useCallback(() => {
    if (currentIdx + 1 >= questions.length) return;
    playSound('click');
    goToQuestion(currentIdx + 1);
  }, [currentIdx, questions.length, goToQuestion, playSound]);

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
              امتحان تحديد المستوى
            </h2>
            <p className="text-sm text-white/50 font-body">
              اختبار شامل من {formatNumber(40, numberStyle)} سؤالاً
            </p>
          </div>
          <Target className="w-6 h-6 text-gold-300" />
        </div>

        <div className="glass-card p-4 mb-6">
          <p className="text-xs text-white/60 font-body mb-3 text-center">
            اختر نمط الأرقام
          </p>
          <div className="flex gap-2 bg-white/5 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => { playSound('click'); if (!isArabic) toggleStyle(); }}
              className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
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
              className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
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
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center shadow-xl shadow-gold-500/40 mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-xl font-extrabold font-display text-white text-center mb-4">
            كيف يعمل الامتحان؟
          </h3>

          <div className="space-y-3 text-sm text-white/80 font-body">
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(1, numberStyle)}.
              </span>
              <p>{formatNumber(40, numberStyle)} سؤالاً من كل المستويات (L0 → L7)</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(2, numberStyle)}.
              </span>
              <p>الزمن الإجمالي: {formatNumber(20, numberStyle)} دقيقة فقط</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(3, numberStyle)}.
              </span>
              <p>الإجابة على السوروبان — مثّل الناتج على العداد</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(4, numberStyle)}.
              </span>
              <p>يمكنك التنقل (السابق/التالي) في أي وقت</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(5, numberStyle)}.
              </span>
              <p>لا يوجد تقييم فوري — ينتقل مباشرة للسؤال التالي</p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <p className="text-xs text-amber-200 font-body leading-relaxed">
              💡 <strong>ملاحظة:</strong> الأسئلة غير المُجابة تُحتسب صفراً.
              يمكنك إنهاء الامتحان في أي وقت بزر "إنهاء الاختبار".
            </p>
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
    const columns = getColumnsForQuestion(currentQ);  // ✅ max(السلسلة، الناتج)
    const isLastQuestion = currentIdx === questions.length - 1;
    const isFirstQuestion = currentIdx === 0;

    const formattedPrompt = formatText(
      currentQ.prompt.replace(/ = ؟$/, ''),
      numberStyle,
    );

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-4 max-w-2xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white truncate">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-[10px] text-white/50 font-body truncate">
              {getLevelName(currentQ.levelId)} · {currentQ.skillId}
            </p>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); toggleStyle(); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition"
            title="تبديل نمط الأرقام"
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

        {/* Progress */}
        <div className="mb-4">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-amber-600"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 sm:p-6 w-full text-center mb-4"
          >
            {/* ✅ شارة عدد الأعمدة */}
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

            <div className="flex justify-center mb-3">
              <Soroban2D5
                key={`q-${currentQ.placementId}-${answers.get(currentQ.placementId) ?? 0}-${columns}`}
                columns={columns}
                initialValue={answers.get(currentQ.placementId) ?? 0}
                autoBeadSize={true}
                interactive={true}
                showValue={true}
                onValueChange={setAbacusValue}
              />
            </div>
          </motion.div>
        </div>

        {/* ──── أزرار التنقل ──── */}
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
              className="py-3 rounded-2xl bg-gradient-to-l from-gold-400 to-amber-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition"
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

        {/* Modal: تأكيد الإنهاء */}
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
                  <br />
                  النتيجة النهائية = مجموع الإجابات الصحيحة فقط.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={confirmEndExam}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold"
                  >
                    نعم، أنهِ الامتحان
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
  if (phase === 'result' && result) {
    const isLowScore = result.totalScore < LOW_SCORE_THRESHOLD;
    const recommendedLevel = isLowScore ? 'L0' : result.recommendedLevel;
    const isNewL0 = isLowScore && result.recommendedLevel !== 'L0';

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 overflow-hidden relative"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/20 blur-3xl" />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-gold-500/40 mx-auto mb-4"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-2xl font-extrabold font-display text-white mb-2">
              نتيجة تحديد المستوى
            </h2>

            <div className="my-6">
              <p className="text-sm text-white/60 font-body mb-1">المستوى المُوصى به</p>
              <p className="text-5xl font-black font-display shimmer-text">
                {recommendedLevel}
              </p>
              <p className="text-lg font-bold text-gold-300 font-body mt-1">
                {getLevelName(recommendedLevel)}
              </p>

              {isNewL0 && (
                <p className="text-xs text-amber-300 font-body mt-2 bg-amber-500/10 border border-amber-400/30 rounded-xl px-3 py-2 inline-block">
                  📌 نوصي بالبدء من المستوى التمهيدي الجديد (L0)
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <p className="text-sm text-white/60 font-body">النتيجة الكلية</p>
              <p className="text-4xl font-black text-white font-display mt-1">
                {formatNumber(result.totalScore, numberStyle)}٪
              </p>
            </div>
          </div>
        </motion.div>

        <div className="glass-card p-5 mb-6">
          <h3 className="text-sm font-bold text-amber-300 mb-4">📊 تفصيل المستويات</h3>

          <div className="space-y-2">
            {result.levels.map((lvl) => (
              <div
                key={lvl.levelId}
                className={`p-3 rounded-xl border ${
                  lvl.passed
                    ? 'bg-emerald-500/10 border-emerald-400/30'
                    : 'bg-red-500/10 border-red-400/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {lvl.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="font-bold text-white text-sm">
                      {lvl.levelId} — {getLevelName(lvl.levelId)}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${
                    lvl.passed ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {formatNumber(lvl.correct, numberStyle)}/{formatNumber(lvl.total, numberStyle)} · {formatNumber(lvl.percentage, numberStyle)}٪
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      lvl.passed
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                        : 'bg-gradient-to-r from-red-400 to-rose-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${lvl.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {result.weakSkills.length > 0 && (
          <div className="glass-card p-5 mb-6">
            <h3 className="text-sm font-bold text-amber-300 mb-3">
              📌 مهارات تحتاج مراجعة
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.weakSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/60 font-body mt-3">
              💡 سيُركّز التدريب على هذه المهارات أولاً
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onComplete(recommendedLevel, result.weakSkills);
            }}
            className="btn-primary w-full !py-4 !text-lg"
          >
            <Sparkles className="w-6 h-6" />
            ابدأ من {recommendedLevel} — {getLevelName(recommendedLevel)}
          </button>

          <button
            type="button"
            onClick={() => { playSound('click'); onBack(); }}
            className="btn-ghost w-full"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default PlacementTestScreen;