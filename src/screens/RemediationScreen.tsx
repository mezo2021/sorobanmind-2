// ═══════════════════════════════════════════════════════════════════
// 🩺 src/screens/RemediationScreen.tsx — الجلسة العلاجية
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - جلسة علاجية مخصصة
//   - بلا درجات — تُظهر الحل بعد كل سؤال
//   - تُبنى من المواضيع الضعيفة (m)
//
// 📊 الفرق عن الجلسات العادية:
//   - لا تُسجَّل درجات
//   - تُظهر "اشرح لي" و"الحل" بعد كل سؤال
//   - زر "تخطّي" متاح دائمًا
//
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, CheckCircle2, XCircle, Clock,
  Lightbulb, Play, RotateCcw, Square, BookOpen,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { SorobanaCompanion } from '@/components/SorobanaCompanion';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatText, formatNumber } from '@/utils/numberStyle';

import {
  type SRBLevel,
  type SRBSection,
  type SRBQuestion,
  buildRemediationPlan,
  getRemediationTitle,
  getRemediationDescription,
} from '@/data/srb-adapter';

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

type Phase = 'intro' | 'running' | 'reveal' | 'done';

interface RemediationScreenProps {
  level: SRBLevel;
  section: SRBSection;
  onBack: () => void;
  playSound: (type: 'click' | 'success' | 'error' | 'whoosh') => void;
}

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function getColumnsForQuestion(q: SRBQuestion): number {
  const candidates: number[] = [
    Math.abs(q.result),
    ...q.operands.map((op) => Math.abs(op)),
  ];
  const maxAbs = Math.max(...candidates);
  if (maxAbs < 1000) return 3;
  if (maxAbs < 1_000_000) return 6;
  if (maxAbs < 1_000_000_000) return 9;
  return 13;
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function RemediationScreen({
  level,
  section,
  onBack,
  playSound,
}: RemediationScreenProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<SRBQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [abacusValue, setAbacusValue] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);

  const sorobana = useSorobanaVoice();
  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic';

  const currentQ = questions[currentIdx];

  // ═══ بناء الجلسة ═══
  const startSession = useCallback(() => {
    const plan = buildRemediationPlan(level, section, 5);

    if (!plan.shouldStart || plan.questions.length === 0) {
      playSound('error');
      return;
    }

    setQuestions(plan.questions);
    setCurrentIdx(0);
    setAbacusValue(0);
    setFeedback('idle');
    setShowHint(false);
    setPhase('running');
    playSound('click');
  }, [level, section, playSound]);

  // ═══ التحقق ═══
  const handleCheck = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;

    const isCorrect = abacusValue === currentQ.result;

    if (isCorrect) {
      setFeedback('correct');
      playSound('success');
      sorobana.speakCorrect();
    } else {
      setFeedback('wrong');
      playSound('error');
      sorobana.speakWrong();
      setShowHint(true);
    }

    setPhase('reveal');
  }, [currentQ, abacusValue, feedback, playSound, sorobana]);

  // ═══ السؤال التالي ═══
  const nextQuestion = useCallback(() => {
    sorobana.stop();
    setAbacusValue(0);
    setFeedback('idle');
    setShowHint(false);

    if (currentIdx + 1 >= questions.length) {
      setPhase('done');
      playSound('whoosh');
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('running');
    }
  }, [currentIdx, questions.length, sorobana, playSound]);

  // ═══ إنهاء ═══
  const handleEnd = useCallback(() => {
    sorobana.stop();
    setPhase('done');
    playSound('whoosh');
  }, [sorobana, playSound]);

  // ═══ intro ═══
  if (phase === 'intro') {
    const plan = buildRemediationPlan(level, section, 5);

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
              {getRemediationTitle()}
            </h2>
            <p className="text-sm text-white/50 font-body">
              {level} · {section}
            </p>
          </div>
          <BookOpen className="w-6 h-6 text-amber-300" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/40 mx-auto mb-4">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-extrabold font-display text-white text-center mb-4">
            جلسة علاجية مخصصة
          </h3>
          <p className="text-sm text-white/80 font-body text-center mb-6">
            {getRemediationDescription()}
          </p>

          {plan.shouldStart ? (
            <div className="space-y-3 text-sm text-white/80 font-body">
              <div className="flex items-start gap-3">
                <span className="text-amber-300 font-bold shrink-0">1.</span>
                <p>عدد الأسئلة: {formatNumber(plan.questions.length, numberStyle)}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-300 font-bold shrink-0">2.</span>
                <p>المواضيع: {plan.weakModules.join(' · ')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-300 font-bold shrink-0">3.</span>
                <p>بلا درجات — فقط تعلّم 🎯</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-300 font-bold shrink-0">4.</span>
                <p>تُظهر الحل والشرح بعد كل سؤال</p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
              <p className="text-sm text-emerald-200 font-body">
                {plan.message}
              </p>
            </div>
          )}
        </motion.div>

        {plan.shouldStart ? (
          <button
            type="button"
            onClick={startSession}
            className="btn-primary w-full !py-4 !text-lg"
          >
            <Play className="w-6 h-6" />
            ابدأ الجلسة العلاجية
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { playSound('click'); onBack(); }}
            className="btn-ghost w-full"
          >
            رجوع
          </button>
        )}
      </div>
    );
  }

  // ═══ running ═══
  if (phase === 'running' && currentQ) {
    const columns = getColumnsForQuestion(currentQ);
    const formattedPrompt = formatText(
      currentQ.question.replace(/ = ؟$/, ''),
      numberStyle,
    );

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-xs text-white/50 font-body">
              🩺 جلسة علاجية — {currentQ.module}
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

        {/* Progress */}
        <div className="mb-5">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="glass-card p-5 sm:p-6 mb-5">
          <p className="text-center text-white/40 font-body text-sm mb-3">
            مثّل الناتج على السوروبان
          </p>
          <p
            className="text-center text-4xl sm:text-5xl font-black font-display text-white mb-6"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {formattedPrompt} = ؟
          </p>

          <div className="flex flex-col items-center gap-3">
            <Soroban2D5
              key={`remediation-${currentIdx}`}
              columns={columns}
              autoBeadSize={true}
              interactive={true}
              showValue={true}
              onValueChange={setAbacusValue}
            />

            {/* زر التلميح */}
            {showHint && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  playSound('click');
                  sorobana.speakTeaching();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold"
              >
                <Lightbulb className="w-4 h-4" />
                اشرح لي
              </motion.button>
            )}

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

  // ═══ reveal ═══
  if (phase === 'reveal' && currentQ) {
    const isCorrect = feedback === 'correct';
    const formattedAnswer = formatNumber(currentQ.result, numberStyle);

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-6 overflow-hidden relative"
        >
          <div className={`absolute -top-20 -right-20 w-48 h-48 blur-3xl ${
            isCorrect ? 'bg-emerald-500/30' : 'bg-amber-500/30'
          }`} />
          <div className="relative text-center">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 ${
              isCorrect
                ? 'from-emerald-400 to-teal-600 shadow-xl shadow-emerald-500/40'
                : 'from-amber-400 to-orange-600 shadow-xl shadow-amber-500/40'
            }`}>
              {isCorrect ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-extrabold font-display text-white mb-2">
              {isCorrect ? 'أحسنت! 🎉' : 'لا بأس — لنتعلّم 💡'}
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

            {/* شرح الحل */}
            {currentQ.solution && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-right">
                <p className="text-xs text-blue-200 font-body leading-relaxed">
                  💡 <strong>الشرح:</strong> {formatText(currentQ.solution, numberStyle)}
                </p>
              </div>
            )}

            {/* الحركة */}
            {currentQ.movement && (
              <div className="mt-3 p-3 rounded-xl bg-purple-500/10 border border-purple-400/30 text-right">
                <p className="text-xs text-purple-200 font-body">
                  🎯 <strong>الحركة:</strong> {currentQ.movement}
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

  // ═══ done ═══
  if (phase === 'done') {
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 overflow-hidden relative"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 blur-3xl" />
          <div className="relative text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold font-display text-white mb-2">
              أحسنت! 🎉
            </h2>
            <p className="text-sm text-white/60 font-body mb-6">
              أكملت الجلسة العلاجية
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <p className="text-sm text-white/60 font-body">تم التدريب على</p>
              <p className="text-2xl font-black font-display text-amber-300 mt-1">
                {level} · {section}
              </p>
            </div>
            <p className="text-xs text-white/40 font-body">
              💡 أعد الاختبار لقياس تحسّنك
            </p>
          </div>
        </motion.div>

        <div className="space-y-3 mt-6">
          <button
            type="button"
            onClick={() => { playSound('click'); startSession(); }}
            className="btn-primary w-full !py-3"
          >
            <RotateCcw className="w-5 h-5" />
            جلسة علاجية جديدة
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

export default RemediationScreen;