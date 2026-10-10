// src/components/flash/FlashScreen.tsx
// 🎬 شاشة الفلاش — دعم single + split · manual advance only

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ChevronLeft, ChevronRight, RotateCcw, Volume2,
} from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { MentalBadge } from './MentalBadge';
import type { FlashLesson } from './types';

const TTS_RATE = 0.7;
const BADGE_LINE_MS = 800;

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function toAr(value: number): string {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

interface FlashScreenProps {
  lesson: FlashLesson;
  onBack: () => void;
  onComplete?: () => void;
}

export function FlashScreen({ lesson, onBack, onComplete }: FlashScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [badgeVisible, setBadgeVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [displayResult, setDisplayResult] = useState<number>(
    lesson.steps[0]?.resultValue ?? 0,
  );
  const [displayDividend, setDisplayDividend] = useState<number>(
    lesson.steps[0]?.dividendValue ?? 0,
  );

  const tts = useSpeech();
  const ttsRef = useRef(tts);
  useEffect(() => {
    ttsRef.current = tts;
  }, [tts]);

  const isSplit = lesson.layout === 'split';
  const step = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;
  const isFirstStep = stepIndex === 0;

  const speakStep = useCallback((s: typeof step) => {
    if (!s?.ttsText) return;
    ttsRef.current.speak(s.ttsText, { rate: TTS_RATE });
  }, []);

  useEffect(() => {
    if (!step) return;
    if (isSplit) {
      setDisplayResult(step.resultValue ?? 0);
      setDisplayDividend(step.dividendValue ?? 0);
    }
    setBadgeVisible(true);
  }, [stepIndex, step, isSplit]);

  useEffect(() => {
    return () => {
      ttsRef.current.stop();
    };
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    const s = lesson.steps[stepIndex];
    if (s) speakStep(s);
  };

  const handleReplayAudio = () => {
    const s = lesson.steps[stepIndex];
    if (s) speakStep(s);
  };

  const handleNext = () => {
    if (isLastStep) return;
    ttsRef.current.stop();
    const nextIdx = stepIndex + 1;
    setStepIndex(nextIdx);
    const s = lesson.steps[nextIdx];
    if (s) speakStep(s);
  };

  const handlePrev = () => {
    if (isFirstStep) return;
    ttsRef.current.stop();
    const prevIdx = stepIndex - 1;
    setStepIndex(prevIdx);
    const s = lesson.steps[prevIdx];
    if (s) speakStep(s);
  };

  const handleRestart = () => {
    ttsRef.current.stop();
    setStepIndex(0);
    setHasStarted(false);
    setBadgeVisible(true);
    if (isSplit) {
      setDisplayResult(lesson.steps[0]?.resultValue ?? 0);
      setDisplayDividend(lesson.steps[0]?.dividendValue ?? 0);
    }
  };

  if (!step) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>لا توجد خطوات</p>
      </div>
    );
  }

  const isEnded = isLastStep && hasStarted;

  const badgeVariant: 'amber' | 'emerald' | 'red' = step.highlightDividend?.length
    ? 'red'
    : step.highlightResult?.length
    ? 'emerald'
    : 'amber';

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 gap-2">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-sm sm:text-lg font-bold text-amber-300">
            {lesson.title}
          </h1>
          <p className="text-xs text-white/60">{lesson.subtitle}</p>
        </div>
        <div className="w-10 shrink-0" />
      </div>

      {/* Progress */}
      <div className="px-6 mb-2">
        <div className="flex justify-center gap-1">
          {lesson.steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIndex
                  ? 'w-6 bg-amber-400'
                  : i < stepIndex
                  ? 'w-1.5 bg-amber-400/50'
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-white/40 mt-2">
          الخطوة {stepIndex + 1} من {lesson.steps.length}
        </p>
      </div>

      {/* Badge */}
      <div className="px-4 mb-3">
        <MentalBadge
          lines={step.badgeLines}
          visible={badgeVisible}
          lineDelayMs={BADGE_LINE_MS}
          variant={badgeVariant}
        />
      </div>

      {/* Abacus area */}
      <div className="flex-1 flex items-center justify-center px-3">
        {isSplit ? (
          <SplitView
            lesson={lesson}
            resultValue={displayResult}
            dividendValue={displayDividend}
            highlightResult={step.highlightResult ?? []}
            highlightDividend={step.highlightDividend ?? []}
            isEnded={isEnded}
          />
        ) : (
          <SingleView lesson={lesson} step={step} />
        )}
      </div>

      {/* Caption */}
      <div className="px-6 mb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-800/90 border border-slate-700 px-4 py-3 rounded-xl text-slate-200 text-sm text-center shadow-lg max-w-md mx-auto"
          >
            {step.caption}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-4 pb-6 flex flex-col gap-3">
        {!hasStarted ? (
          <button
            onClick={handleStart}
            className="mx-auto px-8 py-4 rounded-full font-bold flex items-center gap-2 transition bg-gradient-to-l from-purple-600 to-amber-500 text-white text-lg shadow-lg shadow-amber-500/30"
          >
            ▶️ ابدأ
          </button>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handlePrev}
                disabled={isFirstStep}
                className={`p-3 rounded-full transition ${
                  isFirstStep
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                onClick={handleReplayAudio}
                className="px-5 py-3 rounded-full font-bold flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/30 transition"
              >
                <Volume2 className="w-5 h-5" /> إعادة الصوت
              </button>

              <button
                onClick={handleNext}
                disabled={isLastStep}
                className={`p-3 rounded-full transition ${
                  isLastStep
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {isEnded && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleRestart}
                className="mx-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> إعادة من البداية
              </motion.button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Split View (division / multiplication)
// ═══════════════════════════════════════════════════════════

function SplitView({
  lesson,
  resultValue,
  dividendValue,
  highlightResult,
  highlightDividend,
  isEnded,
}: {
  lesson: FlashLesson;
  resultValue: number;
  dividendValue: number;
  highlightResult: number[];
  highlightDividend: number[];
  isEnded: boolean;
}) {
  const resultColumns = lesson.resultColumns ?? 3;
  const dividendColumns = lesson.dividendColumns ?? 4;
  const finalPulse = isEnded;

  return (
    <div className="flex items-start justify-center gap-2 w-full max-w-md">
      {/* المقسوم (right in RTL) */}
      <div className="flex flex-col items-center flex-1 min-w-0">
        <div className="text-xs text-red-300 mb-1 flex items-center gap-1.5 font-bold">
          <span>🔴</span>
          <span>المقسوم:</span>
          <span className="text-red-100 font-mono tabular-nums">
            {toAr(dividendValue)}
          </span>
        </div>
        <Soroban2D5
          columns={dividendColumns}
          demoValue={dividendValue}
          interactive={false}
          showValue={false}
          autoBeadSize={true}
          hideTitle={true}
          rodTint="red"
          highlightColumns={highlightDividend}
        />
      </div>

      {/* Divider */}
      <div className="w-px self-stretch bg-slate-600/60 my-2" />

      {/* الناتج (left in RTL) */}
      <div className="flex flex-col items-center flex-1 min-w-0">
        <div className="text-xs text-emerald-300 mb-1 flex items-center gap-1.5 font-bold">
          <span>🟢</span>
          <span>الناتج:</span>
          <span className="text-emerald-100 font-mono tabular-nums">
            {toAr(resultValue)}
          </span>
        </div>
        <Soroban2D5
          columns={resultColumns}
          demoValue={resultValue}
          interactive={false}
          showValue={false}
          autoBeadSize={true}
          hideTitle={true}
          rodTint="emerald"
          highlightColumns={finalPulse ? [] : highlightResult}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Single View (basics)
// ═══════════════════════════════════════════════════════════

function SingleView({
  lesson,
  step,
}: {
  lesson: FlashLesson;
  step: any;
}) {
  const displayValue = step.sorobanValue ?? 0;
  return (
    <Soroban2D5
      columns={lesson.columns}
      demoValue={displayValue}
      activeRodIndex={step.activeRodIndex >= 0 ? step.activeRodIndex : undefined}
      beamHighlight={step.highlightBeam === true}
      interactive={false}
      showValue={true}
      autoBeadSize={true}
      hideTitle={true}
    />
  );
}

export default FlashScreen;