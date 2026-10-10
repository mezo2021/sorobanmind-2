// src/components/flash/MultSolver.tsx
// ✖️ تمرين الضرب — معدادان · المضروب يسار · الناتج يمين

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, RotateCcw, Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import type { FlashLesson } from './types';

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function toAr(v: number): string {
  return String(v).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

interface MultSolverProps {
  lesson: FlashLesson;
  onBack: () => void;
  onComplete?: () => void;
}

type Status = 'idle' | 'success' | 'error';

export function MultSolver({ lesson, onBack, onComplete }: MultSolverProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [multVal, setMultVal] = useState(0);
  const [resultVal, setResultVal] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const multRef = useRef(0);
  const resultRef = useRef(0);

  const step = lesson.steps[stepIdx];
  const isLastStep = stepIdx === lesson.steps.length - 1;

  useEffect(() => { multRef.current = multVal; }, [multVal]);
  useEffect(() => { resultRef.current = resultVal; }, [resultVal]);

  // عند تغيّر الخطوة — نُحدّث القيم الابتدائية
  useEffect(() => {
    if (!step) return;
    setMultVal(step.dividendValue ?? 0);
    setResultVal(step.resultValue ?? 0);
    multRef.current = step.dividendValue ?? 0;
    resultRef.current = step.resultValue ?? 0;
    setStatus('idle');
    setErrorMsg('');
    setShowHint(false);
  }, [stepIdx]);

  const handleVerify = () => {
    const m = multRef.current;
    const r = resultRef.current;
    const okM = m === (step.dividendValue ?? 0);
    const okR = r === (step.resultValue ?? 0);

    if (okM && okR) {
      setStatus('success');
      setErrorMsg('');
    } else {
      setStatus('error');
      if (!okM && !okR) setErrorMsg('المعدادان يحتاجان تعديلاً');
      else if (!okR) setErrorMsg('معداد الناتج 🟢 يحتاج تصحيح');
      else setErrorMsg('معداد المضروب 🔴 يحتاج تصحيح');
    }
  };

  const handleNext = () => {
    if (isLastStep) { onComplete?.(); return; }
    setStepIdx((i) => i + 1);
  };

  const handleReset = () => {
    setMultVal(0);
    setResultVal(0);
    multRef.current = 0;
    resultRef.current = 0;
    setStepIdx(0);
    setStatus('idle');
    setShowHint(false);
    setErrorMsg('');
    setResetKey((k) => k + 1);
  };

  const handleMultChange = (v: number) => { setMultVal(v); if (status !== 'idle') setStatus('idle'); };
  const handleResultChange = (v: number) => { setResultVal(v); if (status !== 'idle') setStatus('idle'); };

  const wrongM = status === 'error' && multVal !== (step.dividendValue ?? 0);
  const wrongR = status === 'error' && resultVal !== (step.resultValue ?? 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col select-none" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 gap-2 border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition shrink-0">
          <ArrowRight className="w-5 h-5 text-amber-300" />
        </button>
        <div className="flex-1 text-center">
          <div className="text-lg sm:text-xl font-black text-amber-300 tabular-nums tracking-wider">
            {toAr(lesson.multiplicand ?? 0)} × {toAr(lesson.multiplier ?? 0)}
          </div>
          <div className="text-xs text-white/60 mt-0.5">
            المرحلة {toAr(stepIdx + 1)} من {toAr(lesson.steps.length)}
          </div>
        </div>
        <button onClick={handleReset} className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition shrink-0">
          <RotateCcw className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-6 py-3">
        <div className="flex justify-center gap-1.5 max-w-xs mx-auto">
          {lesson.steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
              i === stepIdx ? 'w-8 bg-amber-400 shadow-md shadow-amber-500/50'
              : i < stepIdx ? 'w-2 bg-amber-400/60'
              : 'w-2 bg-white/20'
            }`} />
          ))}
        </div>
      </div>

      {/* Instruction Card */}
      <div className="px-4 mb-3">
        <AnimatePresence mode="wait">
          <motion.div key={step.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 text-center shadow-xl">
            <div className="flex flex-wrap justify-center gap-1.5 mb-2">
              {step.badgeLines.map((line, i) => (
                <span key={i} className="bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-1 rounded-lg border border-amber-500/30">
                  {line}
                </span>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{step.caption}</p>
            {showHint && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-slate-700 text-xs text-amber-300 font-bold flex items-center justify-center gap-1.5 bg-amber-950/40 p-2 rounded-xl">
                <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
                <span>راجع الخطوة السابقة · القيمة المطلوبة على الناتج: {toAr(step.resultValue ?? 0)}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Two Abacuses */}
      <div className="flex-1 px-3 flex items-center justify-center my-1">
        <div className="flex items-start justify-center gap-2 w-full max-w-md">
          {/* 🟢 الناتج (يمين) */}
          <div className="flex-1 min-w-0 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold mb-0.5">
              <span>🟢</span><span>الناتج</span>
            </div>
            <div className={`px-3 py-0.5 rounded-lg font-mono font-black text-lg tabular-nums mb-1.5 min-w-[62px] text-center transition-all ${
              wrongR ? 'bg-red-500/30 border-2 border-red-400 text-red-50 animate-pulse'
              : status === 'success' ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-50'
              : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-50'
            }`}>{toAr(resultVal)}</div>
            <Soroban2D5
              key={`r-${resetKey}`}
              columns={lesson.resultColumns ?? 3}
              initialValue={0}
              onValueChange={handleResultChange}
              interactive={true}
              showValue={false}
              autoBeadSize={true}
              hideTitle={true}
              rodTint="emerald"
              highlightColumns={step.highlightResult ?? []}
            />
          </div>

          <div className="w-px self-stretch bg-slate-600/60 my-2" />

          {/* 🔴 المضروب (يسار) */}
          <div className="flex-1 min-w-0 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-bold mb-0.5">
              <span>🔴</span><span>المضروب</span>
            </div>
            <div className={`px-3 py-0.5 rounded-lg font-mono font-black text-lg tabular-nums mb-1.5 min-w-[62px] text-center transition-all ${
              wrongM ? 'bg-red-500/30 border-2 border-red-400 text-red-50 animate-pulse'
              : status === 'success' ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-50'
              : 'bg-rose-500/20 border border-rose-400/40 text-rose-50'
            }`}>{toAr(multVal)}</div>
            <Soroban2D5
              key={`m-${resetKey}`}
              columns={lesson.dividendColumns ?? 3}
              initialValue={lesson.multiplicand ?? 0}
              onValueChange={handleMultChange}
              interactive={true}
              showValue={false}
              autoBeadSize={true}
              hideTitle={true}
              rodTint="red"
              highlightColumns={step.highlightDividend ?? []}
              dimColumns={step.blurDividend ?? []}
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="px-4 my-2 min-h-[52px]">
        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.div key="e" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-red-950/90 border-2 border-red-500/60 rounded-2xl p-3 text-center text-xs sm:text-sm font-bold text-red-200 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" /><span>{errorMsg}</span>
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div key="s" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-emerald-950/90 border-2 border-emerald-500/60 rounded-2xl p-3 text-center text-xs sm:text-sm font-bold text-emerald-200 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /><span>أحسنت! القيمتان صحيحتان</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-4 pb-6 flex gap-3 bg-slate-900/60 backdrop-blur-md border-t border-white/10">
        <button onClick={() => setShowHint((s) => !s)}
          className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 text-sm font-bold transition shrink-0 flex items-center justify-center gap-1.5 border border-white/10">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </button>
        {status !== 'success' ? (
          <button onClick={handleVerify}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-600 text-white font-black shadow-lg text-sm sm:text-base tracking-wide active:scale-[0.98] transition flex items-center justify-center gap-2 border border-amber-400/30">
            🔍 تحقق من الإجابة
          </button>
        ) : (
          <button onClick={handleNext}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 text-white font-black shadow-lg text-sm sm:text-base tracking-wide active:scale-[0.98] transition flex items-center justify-center gap-2 border border-emerald-400/30">
            <span>{isLastStep ? '🏆 إنهاء' : 'المرحلة التالية'}</span>
            {!isLastStep && <ChevronLeft className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default MultSolver;