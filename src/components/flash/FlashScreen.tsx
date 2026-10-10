// src/components/flash/FlashScreen.tsx
// 🎬 شاشة الفلاش التعليمي — عرض كامل
// [FIX 10-10] صوت: user gesture + مصدر واحد + ttsRef ثابت
//
// القواعد:
//  - ▶️ ابدأ = user gesture + قراءة الخطوة الحالية
//  - ⏸️ = يوقف autoPlay + stop
//  - ▶️ استئناف = autoPlay + قراءة الخطوة الحالية + durationMs من الصفر
//  - تلقائي = goNext يقرأ الخطوة التالية فقط
//  - ⏭️/⏮️ يدوي = بلا قراءة · Badge يُعاد
//  - 🔄 في النهاية = إعادة كاملة
//  - useEffect = Badge + timers + displayValue فقط (لا صوت)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Pause, ChevronLeft, ChevronRight, RotateCcw,
} from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { MentalBadge } from './MentalBadge';
import type { FlashLesson } from './types';

interface FlashScreenProps {
  lesson: FlashLesson;
  onBack: () => void;
  onComplete?: () => void;
}

export function FlashScreen({ lesson, onBack, onComplete }: FlashScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(true);
  const [displayValue, setDisplayValue] = useState(
    lesson.steps[0]?.sorobanValue ?? 0,
  );

  // ═══ TTS — مرجع ثابت (لا يُسبب re-runs) ═══
  const tts = useSpeech();
  const ttsRef = useRef(tts);
  useEffect(() => {
    ttsRef.current = tts;
  }, [tts]);

  const timersRef = useRef<number[]>([]);
  const lastAnimatedStepRef = useRef(-1);

  const step = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;
  const isFirstStep = stepIndex === 0;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // ═══ goNext — صوت + تقدّم تلقائي ═══
  const goNext = useCallback(() => {
    if (isLastStep) {
      setAutoPlay(false);
      ttsRef.current.stop();
      onComplete?.();
      return;
    }
    const nextIdx = stepIndex + 1;
    setStepIndex(nextIdx);
    if (autoPlay) {
      const nextStep = lesson.steps[nextIdx];
      if (nextStep?.ttsText) {
        ttsRef.current.speak(nextStep.ttsText);
      }
    }
  }, [stepIndex, isLastStep, autoPlay, lesson.steps, onComplete]);

  const goPrev = useCallback(() => {
    if (isFirstStep) return;
    ttsRef.current.stop();
    setStepIndex((i) => i - 1);
  }, [isFirstStep]);

  // ═══ أزرار التشغيل — user gestures ═══
  const handleStart = () => {
    setHasStarted(true);
    setAutoPlay(true);
    const s = lesson.steps[stepIndex];
    if (s?.ttsText) {
      ttsRef.current.speak(s.ttsText);
    }
  };

  const handlePause = () => {
    setAutoPlay(false);
    ttsRef.current.stop();
  };

  const handleResume = () => {
    setAutoPlay(true);
    const s = lesson.steps[stepIndex];
    if (s?.ttsText) {
      ttsRef.current.speak(s.ttsText);
    }
  };

  const restart = useCallback(() => {
    clearTimers();
    ttsRef.current.stop();
    lastAnimatedStepRef.current = -1;
    setStepIndex(0);
    setAutoPlay(false);
    setHasStarted(false);
    setDisplayValue(lesson.steps[0]?.sorobanValue ?? 0);
  }, [clearTimers, lesson.steps]);

  // ═══ effect: Badge + timers + displayValue (بلا صوت) ═══
  useEffect(() => {
    if (!step) return;
    clearTimers();

    const isNewStep = lastAnimatedStepRef.current !== stepIndex;

    if (isNewStep) {
      lastAnimatedStepRef.current = stepIndex;
      setBadgeVisible(true);

      const badgeRevealDuration = Math.max(0, step.badgeLines.length - 1) * 800;
      const tUpdate = window.setTimeout(() => {
        setDisplayValue(step.sorobanValue);
      }, badgeRevealDuration);
      timersRef.current.push(tUpdate);
    }

    if (autoPlay) {
      const tNext = window.setTimeout(() => {
        goNext();
      }, step.durationMs);
      timersRef.current.push(tNext);
    }

    return () => clearTimers();
  }, [stepIndex, autoPlay, step, goNext, clearTimers]);

  // ═══ تنظيف عند الخروج ═══
  useEffect(() => {
    return () => {
      ttsRef.current.stop();
      clearTimers();
    };
  }, [clearTimers]);

  if (!step) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>لا توجد خطوات</p>
      </div>
    );
  }

  const isEnded = isLastStep && !autoPlay && hasStarted;
  const playLabel = !hasStarted ? 'ابدأ' : autoPlay ? 'إيقاف' : 'استئناف';
  const PlayIcon = autoPlay ? Pause : Play;
  const onPlayClick = !hasStarted
    ? handleStart
    : autoPlay
    ? handlePause
    : handleResume;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col"
      dir="rtl"
    >
      {/* ═══ Header ═══ */}
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

      {/* ═══ Progress ═══ */}
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

      {/* ═══ Soroban + Badge ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        <div className="relative w-full max-w-md">
          <MentalBadge
            lines={step.badgeLines}
            visible={badgeVisible}
            lineDelayMs={800}
          />
        </div>

        <motion.div
          key={`${stepIndex}-${displayValue}`}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-16"
        >
          <Soroban2D5
            columns={lesson.columns}
            demoValue={displayValue}
            activeRodIndex={
              step.activeRodIndex >= 0 ? step.activeRodIndex : undefined
            }
            interactive={false}
            showValue={true}
            autoBeadSize={true}
            hideTitle={true}
          />
        </motion.div>
      </div>

      {/* ═══ Caption ═══ */}
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

      {/* ═══ Controls ═══ */}
      <div className="p-4 pb-6 flex items-center justify-center gap-3">
        <button
          onClick={goPrev}
          disabled={isFirstStep}
          className={`p-3 rounded-full transition ${
            isFirstStep
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {!isEnded && (
          <button
            onClick={onPlayClick}
            className={`rounded-full font-bold flex items-center gap-2 transition ${
              autoPlay
                ? 'bg-red-500/30 border border-red-400 text-red-200 px-6 py-3'
                : hasStarted
                ? 'bg-gradient-to-l from-purple-600 to-amber-500 text-white px-6 py-3'
                : 'bg-gradient-to-l from-purple-600 to-amber-500 text-white px-8 py-4 text-lg shadow-lg shadow-amber-500/30'
            }`}
          >
            <PlayIcon className="w-5 h-5" /> {playLabel}
          </button>
        )}

        <button
          onClick={goNext}
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

      {/* ═══ Restart ═══ */}
      {isEnded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-6 text-center"
        >
          <button
            onClick={restart}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> إعادة من البداية
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default FlashScreen;