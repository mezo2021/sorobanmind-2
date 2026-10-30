// src/screens/PlacementTestScreen.tsx
// [FIX N60-ب] — معامل عشري للأسئلة العشرية
// [FIX TIME] — تقليص الزمن إلى 10 دقائق
// شاشة امتحان تحديد المستوى (Placement Test)
// 40 سؤالاً — 10 دقائق — 200 نقطة
// ✅ الإجابة على السوروبان
// ✅ زر إنهاء + السابق + التالي
// ✅ لا يوجد تقييم فوري (الانتقال فوري)
// ✅ يدعم نمط الأرقام (عربي / لاتيني)
// ✅ الأعمدة = max(السلسلة، الناتج) + عرض بصري
// [ADDED] — تسجيل المهارات (recordAttempt) في المتجر لتغذية الإحصائيات

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Clock, Trophy, CheckCircle2, XCircle,
  Target, Sparkles, Play, Type, LogOut, Grid3X3,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { useProgressStore } from '@/store/progressStore'; // ✅ [ADDED]
import { formatText, formatNumber } from '@/utils/numberStyle';

import {
  buildPlacementTest,
  evaluatePlacementTest,
  getLevelName,
  type PlacementQuestion,
  type PlacementResult,
} from '@/data/srb/exam';

// 🌍 i18n
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import { translateDynamic } from '@/utils/translateDynamic';

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

// 🆕 [FIX TIME] — تقليص الزمن من 20 دقيقة إلى 10 دقائق
const TOTAL_TIME_SEC = 10 * 60;
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
 */
function getColumnsForQuestion(question: PlacementQuestion, lang: string = 'ar'): number {
  // ✅ الإصلاح: التحقق من نوع السؤال
  const rawQ = question.question as any;
  const qStr = typeof rawQ === 'string'
    ? rawQ
    : (rawQ && typeof rawQ === 'object'
        ? (rawQ[lang] || rawQ.ar || rawQ.en || '')
        : '');

  const nums = (qStr.match(/\d+/g) ?? []).map(Number);
  const candidates: number[] = [
    Math.abs(Math.round(question.result * (question.result % 1 !== 0 ? 100 : 1))),
    ...nums.map(Math.abs),
  ];
  const maxAbs = Math.max(...candidates, 0);

  if (maxAbs < 1000) return 3;
  if (maxAbs < 1_000_000) return 6;
  if (maxAbs < 1_000_000_000) return 9;
  return 13;
}

/** ✅ اسم وصفي لعدد الأعمدة */
function getColumnsLabel(columns: number, lang: string): string {
  const map: Record<number, { ar: string; en: string }> = {
    3: { ar: '٣ أعمدة', en: '3 Columns' },
    6: { ar: '٦ أعمدة', en: '6 Columns' },
    9: { ar: '٩ أعمدة', en: '9 Columns' },
    13: { ar: '١٣ عموداً', en: '13 Columns' },
  };
  const entry = map[columns];
  if (!entry) return `${columns}`;
  return pickLang(entry, lang as any);
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function PlacementTestScreen({
  onBack,
  onComplete,
  playSound,
}: PlacementTestScreenProps) {
  const { lang, dir } = useT();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [abacusValue, setAbacusValue] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SEC);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  
  // ✅ [ADDED] — لقياس زمن السؤال وتسجيله في skillProgress
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ نمط الأرقام
  const { style: numberStyle, toggleStyle } = useNumberStyleStore();

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
    setQuestionStartTime(Date.now()); // ✅ [ADDED]
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
      setQuestionStartTime(Date.now()); // ✅ [ADDED]
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

    // ✅ [ADDED] — تسجيل المحاولة في المتجر (skillProgress)
    const isDecimal = currentQ.result % 1 !== 0;
    const factor = isDecimal ? 100 : 1;
    const targetValue = Math.round(currentQ.result * factor);
    const isCorrect = abacusValue === targetValue;
    
    const timeMs = Date.now() - questionStartTime;
    const attempt = {
      skillId: (currentQ as any).skillId || `${currentQ.level}-${currentQ.section}-${(currentQ as any).module || 'm1'}`,
      correct: isCorrect,
      timeMs: timeMs,
      timestamp: Date.now(),
    };
    useProgressStore.getState().recordAttempt(attempt);

    const newAnswers = new Map(answers);
    newAnswers.set(currentQ.placementId, abacusValue);
    setAnswers(newAnswers);
    playSound('click');

    if (currentIdx + 1 < questions.length) {
      const nextIdx = currentIdx + 1;
      const nextQ = questions[nextIdx];
      setCurrentIdx(nextIdx);
      setAbacusValue(newAnswers.get(nextQ.placementId) ?? 0);
      setQuestionStartTime(Date.now()); // ✅ [ADDED]
    } else {
      const res = evaluatePlacementTest(questions, newAnswers);
      setResult(res);
      setPhase('result');
      playSound('levelup');
    }
  }, [currentQ, currentIdx, questions, answers, abacusValue, playSound, questionStartTime]);

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
      <div dir={dir} className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
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
              {pickLang({ ar: 'امتحان تحديد المستوى', en: 'Placement Test' }, lang)}
            </h2>
            <p className="text-sm text-white/50 font-body">
              {pickLang({
                ar: `اختبار شامل من ${formatNumber(40, numberStyle)} سؤالاً`,
                en: `Comprehensive test of ${formatNumber(40, numberStyle)} questions`
              }, lang)}
            </p>
          </div>
          <Target className="w-6 h-6 text-gold-300" />
        </div>

        <div className="glass-card p-4 mb-6">
          <p className="text-xs text-white/60 font-body mb-3 text-center">
            {pickLang({ ar: 'اختر نمط الأرقام', en: 'Choose number style' }, lang)}
          </p>
          <div className="flex gap-2 bg-white/5 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => { playSound('click'); if (numberStyle !== 'arabic') toggleStyle(); }}
              className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                numberStyle === 'arabic'
                  ? 'bg-gradient-to-l from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="text-2xl">١ ٢ ٣</span>
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); if (numberStyle === 'arabic') toggleStyle(); }}
              className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                numberStyle !== 'arabic'
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
            {pickLang({ ar: 'كيف يعمل الامتحان؟', en: 'How does the exam work?' }, lang)}
          </h3>

          <div className="space-y-3 text-sm text-white/80 font-body">
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(1, numberStyle)}.
              </span>
              <p>
                {pickLang({
                  ar: `${formatNumber(40, numberStyle)} سؤالاً من كل المستويات (L0 → L7)`,
                  en: `${formatNumber(40, numberStyle)} questions from all levels (L0 → L7)`
                }, lang)}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(2, numberStyle)}.
              </span>
              {/* 🆕 [FIX TIME] — 10 دقائق */}
              <p>
                {pickLang({
                  ar: `الزمن الإجمالي: ${formatNumber(10, numberStyle)} دقائق فقط`,
                  en: `Total time: ${formatNumber(10, numberStyle)} minutes only`
                }, lang)}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(3, numberStyle)}.
              </span>
              <p>
                {pickLang({ ar: 'الإجابة على السوروبان — مثّل الناتج على العداد', en: 'Answer on the soroban — represent the result on the abacus' }, lang)}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(4, numberStyle)}.
              </span>
              <p>
                {pickLang({ ar: 'يمكنك التنقل (السابق/التالي) في أي وقت', en: 'You can navigate (Previous/Next) at any time' }, lang)}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(5, numberStyle)}.
              </span>
              <p>
                {pickLang({ ar: 'لا يوجد تقييم فوري — ينتقل مباشرة للسؤال التالي', en: 'No instant feedback — it moves directly to the next question' }, lang)}
              </p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <p className="text-xs text-amber-200 font-body leading-relaxed">
              {pickLang({
                ar: '💡 ملاحظة: الأسئلة غير المُجابة تُحتسب صفراً. يمكنك إنهاء الامتحان في أي وقت بزر "إنهاء الاختبار".',
                en: '💡 Note: Unanswered questions count as zero. You can end the exam at any time with the "End Exam" button.'
              }, lang)}
            </p>
          </div>
        </motion.div>

        <button
          type="button"
          onClick={startTest}
          className="btn-primary w-full !py-4 !text-lg"
        >
          <Play className="w-6 h-6" />
          {pickLang({ ar: 'ابدأ الامتحان', en: 'Start Exam' }, lang)}
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
    const columns = getColumnsForQuestion(currentQ, lang);
    const isLastQuestion = currentIdx === questions.length - 1;
    const isFirstQuestion = currentIdx === 0;

    const baseQuestion = translateDynamic(currentQ, lang, 'question') ?? currentQ.question;
    const intro = (currentQ as any).operation === 'build'
      ? pickLang({ ar: 'ابنِ', en: 'Build' }, lang)
      : (currentQ as any).operation === 'read'
        ? pickLang({ ar: 'اقرأ', en: 'Read' }, lang)
        : null;
    const translatedQuestion = intro ? `${intro} ${baseQuestion}` : baseQuestion;

    const formattedPrompt = formatText(
      translatedQuestion.replace(/\s*=\s*[؟?]\s*$/u, ''),
      numberStyle,
    );

    return (
      <div dir={dir} className="px-3 sm:px-6 py-4 max-w-2xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white truncate">
              {pickLang({
                ar: `السؤال ${formatNumber(currentIdx + 1, numberStyle)} / ${formatNumber(questions.length, numberStyle)}`,
                en: `Question ${formatNumber(currentIdx + 1, numberStyle)} / ${formatNumber(questions.length, numberStyle)}`
              }, lang)}
            </h2>
            <p className="text-[10px] text-white/50 font-body truncate">
              {translateDynamic({ text: getLevelName(currentQ.level) }, lang, 'text')} · {translateDynamic({ text: currentQ.section }, lang, 'text')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); toggleStyle(); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition"
            title={pickLang({ ar: 'تبديل نمط الأرقام', en: 'Toggle number style' }, lang)}
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
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-200 text-xs font-bold">
                <Grid3X3 className="w-3.5 h-3.5" />
                {getColumnsLabel(columns, lang)}
              </span>
            </div>

            <p
              className="text-3xl sm:text-4xl font-black font-display text-white mb-5"
              dir={dir}
            >
              {formattedPrompt} = {pickLang({ ar: '؟', en: '?' }, lang)}
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
              {pickLang({ ar: 'السابق', en: 'Previous' }, lang)}
            </button>

            <button
              type="button"
              onClick={handleCheck}
              className="py-3 rounded-2xl bg-gradient-to-l from-gold-400 to-amber-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              {pickLang({ ar: 'تحقق', en: 'Check' }, lang)}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isLastQuestion}
              className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              {pickLang({ ar: 'التالي', en: 'Next' }, lang)}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); setShowEndConfirm(true); }}
            className="w-full py-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-200 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            {pickLang({ ar: 'إنهاء الاختبار', en: 'End Exam' }, lang)}
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
                dir={dir}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-amber-300" />
                </div>

                <h3 className="text-xl font-extrabold font-display text-white mb-2">
                  {pickLang({ ar: 'إنهاء الاختبار؟', en: 'End Exam?' }, lang)}
                </h3>

                <p className="text-sm text-white/60 font-body mb-6 leading-relaxed">
                  {pickLang({
                    ar: 'ستُحتسب الأسئلة غير المُجابة صفراً. النتيجة النهائية = مجموع الإجابات الصحيحة فقط.',
                    en: 'Unanswered questions will be counted as zero. Final score = sum of correct answers only.'
                  }, lang)}
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={confirmEndExam}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold"
                  >
                    {pickLang({ ar: 'نعم، أنهِ الامتحان', en: 'Yes, end the exam' }, lang)}
                  </button>
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setShowEndConfirm(false); }}
                    className="flex-1 py-3 rounded-2xl bg-white/10 text-white/80 font-bold"
                  >
                    {pickLang({ ar: 'متابعة', en: 'Continue' }, lang)}
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
      <div dir={dir} className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
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
              {pickLang({ ar: 'نتيجة تحديد المستوى', en: 'Placement Test Result' }, lang)}
            </h2>

            <div className="my-6">
              <p className="text-sm text-white/60 font-body mb-1">
                {pickLang({ ar: 'المستوى المُوصى به', en: 'Recommended Level' }, lang)}
              </p>
              <p className="text-5xl font-black font-display shimmer-text">
                {recommendedLevel}
              </p>
              <p className="text-lg font-bold text-gold-300 font-body mt-1">
                {translateDynamic({ text: getLevelName(recommendedLevel) }, lang, 'text')}
              </p>

              {isNewL0 && (
                <p className="text-xs text-amber-300 font-body mt-2 bg-amber-500/10 border border-amber-400/30 rounded-xl px-3 py-2 inline-block">
                  {pickLang({ ar: '📌 نوصي بالبدء من المستوى التمهيدي الجديد (L0)', en: '📌 We recommend starting from the new foundation level (L0)' }, lang)}
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <p className="text-sm text-white/60 font-body">
                {pickLang({ ar: 'النتيجة الكلية', en: 'Total Score' }, lang)}
              </p>
              <p className="text-4xl font-black text-white font-display mt-1">
                {formatNumber(result.totalScore, numberStyle)}%
              </p>
            </div>
          </div>
        </motion.div>

        <div className="glass-card p-5 mb-6">
          <h3 className="text-sm font-bold text-amber-300 mb-4">
            {pickLang({ ar: '📊 تفصيل المستويات', en: '📊 Levels Breakdown' }, lang)}
          </h3>

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
                      {lvl.levelId} — {translateDynamic({ text: getLevelName(lvl.levelId) }, lang, 'text')}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${
                    lvl.passed ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {formatNumber(lvl.correct, numberStyle)}/{formatNumber(lvl.total, numberStyle)} · {formatNumber(lvl.percentage, numberStyle)}%
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
              {pickLang({ ar: '📌 مهارات تحتاج مراجعة', en: '📌 Skills to Review' }, lang)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.weakSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold"
                >
                  {translateDynamic({ text: skill }, lang, 'text')}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/60 font-body mt-3">
              {pickLang({ ar: '💡 سيُركّز التدريب على هذه المهارات أولاً', en: '💡 Training will focus on these skills first' }, lang)}
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
            {pickLang({
              ar: `ابدأ من ${recommendedLevel} — ${translateDynamic({ text: getLevelName(recommendedLevel) }, lang, 'text')}`,
              en: `Start from ${recommendedLevel} — ${translateDynamic({ text: getLevelName(recommendedLevel) }, lang, 'text')}`
            }, lang)}
          </button>

          <button
            type="button"
            onClick={() => { playSound('click'); onBack(); }}
            className="btn-ghost w-full"
          >
            {pickLang({ ar: 'العودة للرئيسية', en: 'Back to Home' }, lang)}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default PlacementTestScreen;