// src/components/flash/TwoAbacusSolver.tsx
// 🖐️ تمرين تفاعلي احترافي — معدادان · تحقق يدوي ذكي وتجربة أطفال ممتازة

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, RotateCcw, Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import type { DivisionProblem } from './sorobanDivisionData';

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function toAr(v: number): string {
  return String(v).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

interface TwoAbacusSolverProps {
  problem: DivisionProblem;
  onBack: () => void;
  onComplete?: () => void;
}

type Status = 'idle' | 'success' | 'error';

export function TwoAbacusSolver({
  problem,
  onBack,
  onComplete,
}: TwoAbacusSolverProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [dividendVal, setDividendVal] = useState(problem.dividend);
  const [resultVal, setResultVal] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const dividendRef = useRef(problem.dividend);
  const resultRef = useRef(0);

  const step = problem.steps[stepIdx];
  const isLastStep = stepIdx === problem.steps.length - 1;

  // مزامنة المراجع الفورية
  useEffect(() => {
    dividendRef.current = dividendVal;
  }, [dividendVal]);
  useEffect(() => {
    resultRef.current = resultVal;
  }, [resultVal]);

  // إعادة ضبط التنبيهات عند تغيير الخطوة
  useEffect(() => {
    setStatus('idle');
    setErrorMessage('');
    setShowHint(false);
  }, [stepIdx]);

  const handleVerify = () => {
    const dv = dividendRef.current;
    const rv = resultRef.current;
    const okDividend = dv === step.expectedDividend;
    const okResult = rv === step.expectedResult;

    if (okDividend && okResult) {
      setStatus('success');
      setErrorMessage('');
    } else {
      setStatus('error');
      if (!okDividend && !okResult) {
        setErrorMessage('المعدادان بحاجة تعديل — راجع ناتج القسمة وباقي المقسوم بدقة');
      } else if (!okResult) {
        setErrorMessage('معداد الناتج الأخضر (🟢) يحتاج إلى تصحيح');
      } else {
        setErrorMessage('معداد المقسوم الأحمر (🔴) يحتاج إلى إتمام عملية الطرح');
      }
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
      return;
    }
    setStepIdx((i) => i + 1);
  };

  const handleReset = () => {
    setDividendVal(problem.dividend);
    setResultVal(0);
    dividendRef.current = problem.dividend;
    resultRef.current = 0;
    setStepIdx(0);
    setStatus('idle');
    setShowHint(false);
    setErrorMessage('');
    setResetKey((k) => k + 1);
  };

  const handleDividendChange = (v: number) => {
    setDividendVal(v);
    if (status !== 'idle') setStatus('idle');
  };
  
  const handleResultChange = (v: number) => {
    setResultVal(v);
    if (status !== 'idle') setStatus('idle');
  };

  const wrongDividend =
    status === 'error' && dividendVal !== step.expectedDividend;
  const wrongResult = status === 'error' && resultVal !== step.expectedResult;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col select-none"
      dir="rtl"
    >
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between p-4 gap-2 border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <button
          onClick={onBack}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition shrink-0 flex items-center justify-center"
          title="العودة"
        >
          <ArrowRight className="w-5 h-5 text-amber-300" />
        </button>
        
        <div className="flex-1 text-center">
          <div className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums tracking-wider">
            {toAr(problem.dividend)} ÷ {toAr(problem.divisor)}
          </div>
          <div className="text-xs text-white/60 mt-0.5 font-medium">
            المرحلة {toAr(stepIdx + 1)} من {toAr(problem.steps.length)}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition shrink-0 flex items-center justify-center"
          title="إعادة المسألة من البداية"
        >
          <RotateCcw className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* ═══ Progress Bar ═══ */}
      <div className="px-6 py-3">
        <div className="flex justify-center gap-1.5 max-w-xs mx-auto">
          {problem.steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === stepIdx
                  ? 'w-8 bg-amber-400 shadow-md shadow-amber-500/50'
                  : i < stepIdx
                  ? 'w-2 bg-amber-400/60'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ═══ Instruction Card ═══ */}
      <div className="px-4 mb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.stepIndex}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900/90 border-2 border-sky-500/40 rounded-2xl p-4 text-center shadow-xl backdrop-blur-sm"
          >
            <h3 className="text-base sm:text-lg font-black text-sky-300 mb-1">
              {step.instructionTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {step.instructionDetail}
            </p>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-slate-700 text-xs text-amber-300 font-bold flex items-center justify-center gap-1.5 bg-amber-950/40 p-2 rounded-xl"
              >
                <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  ضع {toAr(step.expectedResult)} في الناتج · واطرح حتى يصل المقسوم إلى {toAr(step.expectedDividend)}
                </span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═══ Two Abacuses Side-by-Side ═══ */}
      <div className="flex-1 px-2 flex items-center justify-center my-1">
        <div className="flex items-start justify-center gap-2 w-full max-w-lg">
          
          {/* 🟢 معداد الناتج (يمين بصرياً في RTL) */}
          <div className="flex-1 min-w-0 flex flex-col items-center bg-slate-900/40 p-2.5 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>الناتج التراكمي</span>
            </div>
            <div
              className={`px-4 py-1 rounded-xl font-mono font-black text-xl tabular-nums mb-2 min-w-[75px] text-center transition-all shadow-inner ${
                wrongResult
                  ? 'bg-red-500/30 border-2 border-red-400 text-red-50 animate-bounce'
                  : status === 'success'
                  ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-50'
                  : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-50'
              }`}
            >
              {toAr(resultVal)}
            </div>
            <div className="w-full flex justify-center scale-95 origin-top">
              <Soroban2D5
                key={`result-${resetKey}`}
                columns={3}
                initialValue={0}
                onValueChange={handleResultChange}
                interactive={true}
                showValue={false}
                autoBeadSize={true}
                hideTitle={true}
                rodTint="emerald"
                highlightColumns={[step.activeResultRod]}
              />
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-0.5 self-stretch bg-gradient-to-b from-transparent via-slate-500/50 to-transparent my-4" />

          {/* 🔴 معداد المقسوم (يسار بصرياً في RTL) */}
          <div className="flex-1 min-w-0 flex flex-col items-center bg-slate-900/40 p-2.5 rounded-2xl border border-rose-500/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              <span>المقسوم المتبقي</span>
            </div>
            <div
              className={`px-4 py-1 rounded-xl font-mono font-black text-xl tabular-nums mb-2 min-w-[75px] text-center transition-all shadow-inner ${
                wrongDividend
                  ? 'bg-red-500/30 border-2 border-red-400 text-red-50 animate-bounce'
                  : status === 'success'
                  ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-50'
                  : 'bg-rose-500/20 border border-rose-400/40 text-rose-50'
              }`}
            >
              {toAr(dividendVal)}
            </div>
            <div className="w-full flex justify-center scale-95 origin-top">
              <Soroban2D5
                key={`dividend-${resetKey}`}
                columns={3}
                initialValue={problem.dividend}
                onValueChange={handleDividendChange}
                interactive={true}
                showValue={false}
                autoBeadSize={true}
                hideTitle={true}
                rodTint="red"
                highlightColumns={step.activeDividendRods}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ═══ Status Bar Feedback ═══ */}
      <div className="px-4 my-2 min-h-[52px]">
        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-950/90 border-2 border-red-500/60 rounded-2xl p-3 text-center text-xs sm:text-sm font-bold text-red-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-950/90 border-2 border-emerald-500/60 rounded-2xl p-3 text-center text-xs sm:text-sm font-bold text-emerald-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>أحسنت! إجابة صحيحة وموفقة</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Bottom Controls ═══ */}
      <div className="p-4 pb-6 flex gap-3 bg-slate-900/60 backdrop-blur-md border-t border-white/10">
        <button
          onClick={() => setShowHint((s) => !s)}
          className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 text-sm font-bold transition shrink-0 flex items-center justify-center gap-1.5 border border-white/10"
          title="تلميح"
        >
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <span className="hidden sm:inline">تلميح</span>
        </button>

        {status !== 'success' ? (
          <button
            onClick={handleVerify}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-l from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black shadow-lg shadow-sky-900/40 text-sm sm:text-base tracking-wide active:scale-[0.98] transition flex items-center justify-center gap-2 border border-sky-400/30"
          >
            🔍 تحقق من الإجابة
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-900/40 text-sm sm:text-base tracking-wide active:scale-[0.98] transition flex items-center justify-center gap-2 border border-emerald-400/30"
          >
            <span>{isLastStep ? '🏆 إنهاء المسألة بنجاح' : 'المرحلة التالية'}</span>
            {!isLastStep && <ChevronLeft className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default TwoAbacusSolver;
