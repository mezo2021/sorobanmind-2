// src/screens/PlacementTestScreen.tsx
// شاشة امتحان تحديد المستوى (Placement Test)
// 40 سؤالاً — 20 دقيقة — 200 نقطة
// ✅ يدعم نمط الأرقام (عربي / لاتيني) + إدخال حر

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Clock, Trophy, CheckCircle2, XCircle,
  Target, Sparkles, Play, Type,
} from 'lucide-react';

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
// أدوات التحويل (آمنة من RTL)
// ═══════════════════════════════════════════════════════════

/**
 * فلترة الإدخال: يقبل فقط الأرقام (عربية أو لاتينية).
 * يستخدم Unicode escapes لتفادي مشكلة قلب الرموز في RTL.
 */
function filterDigits(value: string): string {
  // 0-9 (لاتينية) أو ٠-٩ (عربية)
  return value.replace(/[^0-9\u0660-\u0669]/g, '');
}

/**
 * تحويل الأرقام العربية إلى لاتينية.
 * ٠ = \u0660 → 0
 * ٥ = \u0665 → 5
 */
function arabicToLatin(value: string): string {
  return value.replace(/[\u0660-\u0669]/g, (d) =>
    String(d.charCodeAt(0) - 0x0660),
  );
}

/**
 * تحويل نص إلى رقم (بغض النظر عن النمط).
 */
function parseInput(value: string): number {
  const latin = arabicToLatin(value);
  const num = parseInt(latin, 10);
  return Number.isFinite(num) ? num : 0;
}

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

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SEC);
  const [result, setResult] = useState<PlacementResult | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ نمط الأرقام
  const { style: numberStyle, toggleStyle } = useNumberStyleStore();
  const isArabic = numberStyle === 'arabic';

  // ─── بدء الامتحان ───
  const startTest = useCallback(() => {
    const qs = buildPlacementTest();
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers(new Map());
    setUserInput('');
    setTimeLeft(TOTAL_TIME_SEC);
    setPhase('running');
    playSound('click');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, [playSound]);

  // ─── العدّاد ───
  useEffect(() => {
    if (phase !== 'running') return;
    if (timeLeft <= 0) {
      finishTest();
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  // ─── إنهاء الامتحان ───
  const finishTest = useCallback(() => {
    const res = evaluatePlacementTest(questions, answers);
    setResult(res);
    setPhase('result');
    playSound('levelup');
  }, [questions, answers, playSound]);

  // ─── إجابة ───
  const submitAnswer = useCallback(
    (answer: number) => {
      if (!questions[currentIdx]) return;

      const q = questions[currentIdx];
      const newAnswers = new Map(answers);
      newAnswers.set(q.placementId, answer);
      setAnswers(newAnswers);
      setUserInput('');
      playSound('click');

      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(currentIdx + 1);
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        const res = evaluatePlacementTest(questions, newAnswers);
        setResult(res);
        setPhase('result');
        playSound('levelup');
      }
    },
    [currentIdx, questions, answers, playSound],
  );

  // ─── معالجة الإدخال ───
  const handleSubmit = useCallback(() => {
    if (userInput === '') return;
    submitAnswer(parseInput(userInput));
  }, [userInput, submitAnswer]);

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

        {/* ✅ زر تبديل نمط الأرقام */}
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
              <p>{formatNumber(200, numberStyle)} نقطة كحد أقصى → {formatNumber(100, numberStyle)} درجة نهائية</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(4, numberStyle)}.
              </span>
              <p>عتبة النجاح لكل مستوى: {formatNumber(80, numberStyle)}٪</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">
                {formatNumber(5, numberStyle)}.
              </span>
              <p>المستوى المُوصى به = أول مستوى ترسب فيه</p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <p className="text-xs text-amber-200 font-body leading-relaxed">
              💡 <strong>ملاحظة مهمة:</strong> هذا الامتحان يُحدد نقطة البداية المثالية لك.
              كلما كانت إجاباتك أدق، كان مسارك التعليمي أفضل.
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
  if (phase === 'running') {
    const q = questions[currentIdx];
    if (!q) return null;

    const progress = ((currentIdx + 1) / questions.length) * 100;
    const timeWarning = timeLeft <= 60;

    // ✅ تنسيق السؤال حسب النمط
    const formattedPrompt = formatText(
      q.prompt.replace(/ = ؟$/, ''),
      numberStyle,
    );

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-xs text-white/50 font-body">
              {getLevelName(q.levelId)} · {q.skillId}
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

          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
            timeWarning
              ? 'bg-red-500/20 border-red-500/50'
              : 'bg-white/5 border-white/10'
          }`}>
            <Clock className={`w-4 h-4 ${timeWarning ? 'text-red-300' : 'text-amber-300'}`} />
            <span className={`font-bold font-mono ${timeWarning ? 'text-red-300' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
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
            className="glass-card p-6 sm:p-8 w-full text-center mb-6"
          >
            {/* ✅ السؤال — يتبع النمط والاتجاه */}
            <p
              className="text-4xl sm:text-5xl font-black font-display text-white mb-8"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {formattedPrompt} = ؟
            </p>

            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={userInput}
              onChange={(e) => {
                // ✅ يقبل الأرقام العربية واللاتينية معاً
                setUserInput(filterDigits(e.target.value));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userInput !== '') {
                  handleSubmit();
                }
              }}
              placeholder={isArabic ? 'أدخل الإجابة' : 'Enter answer'}
              dir={isArabic ? 'rtl' : 'ltr'}
              className="w-full bg-slate-800 border-2 border-gold-500/50 rounded-2xl px-4 py-4 text-center text-3xl font-bold text-white outline-none focus:border-gold-400 transition"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={userInput === ''}
              className="btn-primary w-full mt-4 disabled:opacity-40"
            >
              <CheckCircle2 className="w-5 h-5" />
              تأكيد الإجابة
            </button>
          </motion.div>

          <p className="text-xs text-white/40 font-body text-center">
            💡 لا توجد عقوبة على الخطأ — أجب بأسرع ما يمكن
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // المرحلة: result
  // ═══════════════════════════════════════════════════════
  if (phase === 'result' && result) {
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
                {result.recommendedLevel}
              </p>
              <p className="text-lg font-bold text-gold-300 font-body mt-1">
                {getLevelName(result.recommendedLevel)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <p className="text-sm text-white/60 font-body">النتيجة الكلية</p>
              <p className="text-4xl font-black text-white font-display mt-1">
                {formatNumber(result.totalScore, numberStyle)}٪
              </p>
            </div>
          </div>
        </motion.div>

        {/* تفصيل المستويات */}
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

        {/* المهارات الضعيفة */}
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

        {/* أزرار */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onComplete(result.recommendedLevel, result.weakSkills);
            }}
            className="btn-primary w-full !py-4 !text-lg"
          >
            <Sparkles className="w-6 h-6" />
            ابدأ من {result.recommendedLevel} — {getLevelName(result.recommendedLevel)}
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