// src/components/flash/ChainSolver.tsx
// 🧮 تمرين السلاسل — معداد واحد · TTS · أيقونة الحركة

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, RotateCcw, Lightbulb, CheckCircle2, AlertTriangle, Volume2 } from 'lucide-react';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useSpeech } from '@/hooks/useSpeech';
import { FingerMovementIcon } from './FingerMovementIcon';
import type { FlashLesson } from './types';

const TTS_RATE = 0.7;
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function toAr(v: number): string {
  return String(v).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

interface ChainSolverProps {
  lesson: FlashLesson;
  onBack: () => void;
  onComplete?: () => void;
}

type Status = 'idle' | 'success' | 'error';

export function ChainSolver({ lesson, onBack, onComplete }: ChainSolverProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [userVal, setUserVal] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const userRef = useRef(0);
  const step = lesson.steps[stepIdx];
  const isLastStep = stepIdx === lesson.steps.length - 1;
  const isFinal = step?.isFinal === true;

  const tts = useSpeech();
  const ttsRef = useRef(tts);
  useEffect(() => { ttsRef.current = tts; }, [tts]);

  const speakStep = useCallback((s: typeof step) => {
    if (!s?.ttsText) return;
    ttsRef.current.speak(s.ttsText, { rate: TTS_RATE });
  }, []);

  useEffect(() => { userRef.current = userVal; }, [userVal]);

  useEffect(() => {
    if (!step) return;
    setStatus('idle');
    setErrorMsg('');
    setShowHint(false);
  }, [stepIdx, step]);

  const handleStart = () => {
    setHasStarted(true);
    speakStep(lesson.steps[0]);
  };

  const handleReplay = () => { speakStep(step); };

  const handleVerify = () => {
    const expected = step.sorobanValue ?? 0;
    if (userRef.current === expected) {
      setStatus('success');
      setErrorMsg('');
    } else {
      setStatus('error');
      setErrorMsg(`القيمة الحالية (${toAr(userRef.current)}) · المطلوب: ${toAr(expected)}`);
    }
  };

  const handleNext = () => {
    if (isLastStep) { onComplete?.(); return; }
    ttsRef.current.stop();
    const n = stepIdx + 1;
    setStepIdx(n);
    const s = lesson.steps[n];
    if (s && hasStarted) speakStep(s);
  };

  const handleReset = () => {
    ttsRef.current.stop();
    setUserVal(0);
    userRef.current = 0;
    setStepIdx(0);
    setStatus('idle');
    setShowHint(false);
    setErrorMsg('');
    setHasStarted(false);
    setResetKey((k) => k + 1);
  };

  useEffect(() => { return () => { ttsRef.current.stop(); }; }, []);

  const handleChange = (v: number) => {
    setUserVal(v);
    if (status !== 'idle') setStatus('idle');
  };

  const isWrong = status === 'error' && userVal !== (step.sorobanValue ?? 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col select-none" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 gap-2 border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <button onClick={onBack} className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition shrink-0">
          <ArrowRight className="w-5 h-5 text-amber-300" />
        </button>
        <div className="flex-1 text-center">
          <div className="text-base sm:text-lg font-black text-amber-300 tabular-nums tracking-wider">
            {lesson.subtitle}
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

      {/* Instruction */}
      <div className="px-4 mb-3">
        <AnimatePresence mode="wait">
          <motion.div key={step.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`bg-slate-900/90 border-2 rounded-2xl p-4 text-center shadow-xl ${
              isFinal ? 'border-emerald-500/60' : 'border-amber-500/40'
            }`}>
            <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
              {step.movement && (
                <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/40 rounded-xl px-2 py-1">
                  <FingerMovementIcon type={step.movement} size={36} />
                </div>
              )}
              {step.badgeLines.map((line, i) => (
                <span key={i} className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                  isFinal ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>{line}</span>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{step.caption}</p>
            {showHint && !isFinal && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-slate-700 text-xs text-amber-300 font-bold flex items-center justify-center gap-1.5 bg-amber-950/40 p-2 rounded-xl">
                <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
                <span>القيمة المطلوبة: {toAr(step.sorobanValue ?? 0)}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Abacus */}
      <div className="flex-1 px-4 flex items-center justify-center my-1">
        <div className="w-full max-w-sm bg-slate-900/50 p-4 rounded-3xl border border-white/10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isFinal ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`text-xs font-bold ${isFinal ? 'text-emerald-300' : 'text-amber-300'}`}>
              {isFinal ? '✅ الناتج النهائي' : 'القيمة الحالية'}
            </span>
          </div>
          <div className={`px-6 py-1.5 rounded-2xl font-mono font-black text-2xl tabular-nums mb-3 min-w-[110px] text-center transition-all shadow-inner ${
            isWrong ? 'bg-red-500/30 border-2 border-red-400 text-red-50 animate-pulse'
            : status === 'success' ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-50'
            : isFinal ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-50'
            : 'bg-amber-500/20 border border-amber-400/40 text-amber-50'
          }`}>{toAr(userVal)}</div>
          <div className="w-full flex justify-center">
            <Soroban2D5
              key={`chain-${resetKey}`}
              columns={lesson.columns ?? 2}
              initialValue={0}
              onValueChange={handleChange}
              interactive={!isFinal}
              showValue={false}
              autoBeadSize={true}
              hideTitle={true}
              rodTint={isFinal ? 'emerald' : undefined}
              highlightColumns={isFinal ? [] : (step.highlightColumns ?? [])}
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="px-4 my-2 min-h-[52px]">
        <AnimatePresence mode="wait">
          {status === 'error' && !isFinal && (
            <motion.div key="e" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-red-950/90 border-2 border-red-500/60 rounded-2xl p-3 text-center text-xs sm:text-sm font-bold text-red-200 flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" /><span>{errorMsg}</span>
            </motion.div>
          )}
          {status === 'success' && !isFinal && (
            <motion.div key="s" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-emerald-950/90 border-2 border-emerald-500/60 rounded-2xl p-3 text-center text-xs sm:text-sm font-bold text-emerald-200 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /><span>أحسنت! القيمة صحيحة</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-4 pb-6 flex flex-col gap-3 bg-slate-900/60 backdrop-blur-md border-t border-white/10">
        {!hasStarted ? (
          <button onClick={handleStart}
            className="mx-auto px-8 py-4 rounded-full font-bold flex items-center gap-2 transition bg-gradient-to-l from-purple-600 to-amber-500 text-white text-lg shadow-lg shadow-amber-500/30">
            ▶️ ابدأ
          </button>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowHint((s) => !s)} disabled={isFinal}
                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition shrink-0 ${
                  isFinal ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                  : showHint ? 'bg-amber-500/30 border border-amber-400 text-amber-100'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}>
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">تلميح</span>
              </button>
              <button onClick={handleReplay}
                className="px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/30 transition shrink-0">
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">إعادة الصوت</span>
              </button>
            </div>

            {!isFinal && status !== 'success' ? (
              <button onClick={handleVerify}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-amber-500 to-orange-600 text-white font-black shadow-lg text-sm sm:text-base tracking-wide active:scale-[0.98] transition flex items-center justify-center gap-2 border border-amber-400/30">
                🔍 تحقق من الإجابة
              </button>
            ) : (
              <button onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 text-white font-black shadow-lg text-sm sm:text-base tracking-wide active:scale-[0.98] transition flex items-center justify-center gap-2 border border-emerald-400/30">
                <span>{isLastStep ? '🏆 إنهاء' : 'المرحلة التالية'}</span>
                {!isLastStep && <ChevronLeft className="w-5 h-5" />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ChainSolver;