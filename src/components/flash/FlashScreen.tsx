// src/components/flash/FlashScreen.tsx
// 🎬 شاشة الفلاش التعليمي — عرض كامل

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
  const [badgeVisible, setBadgeVisible] = useState(true);
  const [displayValue, setDisplayValue] = useState(
    lesson.steps[0]?.sorobanValue ?? 0,
  );

  const tts = useSpeech();
  const timersRef = useRef<number[]>([]);

  const step = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;
  const isFirstStep = stepIndex === 0;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // ⭐ منطق الانتقال التلقائي
  const goNext = useCallback(() => {
    if (isLastStep) {
      setAutoPlay(false);
      setBadgeVisible(false);
      onComplete?.();
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [isLastStep, onComplete]);

  const goPrev = useCallback(() => {
    if (!isFirstStep) {
      setStepIndex((i) => i - 1);
    }
  }, [isFirstStep]);

  const restart = useCallback(() => {
    setStepIndex(0);
    setAutoPlay(false);
    tts.stop();
    setDisplayValue(lesson.steps[0]?.sorobanValue ?? 0);
  }, [tts, lesson]);

  // ⭐ التأثير الرئيسي لكل خطوة
  useEffect(() => {
    if (!step) return;

    clearTimers();
    tts.stop();
    setBadgeVisible(true);

    // TTS
    if (step.ttsText) {
      tts.speak(step.ttsText);
    }

    // تأخير تحديث العداد حتى تظهر كل أسطر Badge
    const badgeRevealDuration = Math.max(0, step.badgeLines.length - 1) * 800;
    const tUpdate = window.setTimeout(() => {
      setDisplayValue(step.sorobanValue);
    }, badgeRevealDuration);
    timersRef.current.push(tUpdate);

    // Auto-advance
    if (autoPlay) {
      const tNext = window.setTimeout(() => {
        goNext();
      }, step.durationMs);
      timersRef.current.push(tNext);
    }

    return () => clearTimers();
  }, [stepIndex, autoPlay, step, tts, goNext, clearTimers]);

  // تنظيف عند الخروج
  useEffect(() => {
    return () => {
      tts.stop();
      clearTimers();
    };
  }, [tts, clearTimers]);

  if (!step) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>لا توجد خطوات</p>
      </div>
    );
  }

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
        {/* Mental Badge */}
        <div className="relative w-full max-w-md">
          <MentalBadge
            lines={step.badgeLines}
            visible={badgeVisible}
            lineDelayMs={800}
          />
        </div>

        {/* Soroban */}
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
            activeRodIndex={step.activeRodIndex >= 0 ? step.activeRodIndex : undefined}
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

        <button
          onClick={() => setAutoPlay((p) => !p)}
          className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition ${
            autoPlay
              ? 'bg-red-500/30 border border-red-400 text-red-200'
              : 'bg-gradient-to-l from-purple-600 to-amber-500 text-white'
          }`}
        >
          {autoPlay ? (
            <>
              <Pause className="w-5 h-5" /> إيقاف
            </>
          ) : (
            <>
              <Play className="w-5 h-5" /> تشغيل
            </>
          )}
        </button>

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

      {/* ═══ Restart (يظهر في النهاية) ═══ */}
      {isLastStep && !autoPlay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-6 text-center"
        >
          <button
            onClick={restart}
            className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> إعادة من البداية
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default FlashScreen;