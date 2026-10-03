// src/screens/IntroductionScreen.tsx
// 🎬 شاشة المقدمة: عرض صفحات الدرس النظري (تمرير)

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

import { getLessonById } from '@/curriculum/lessons';
import { FloatingCompanion } from '@/components/FloatingCompanion';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';

interface IntroductionScreenProps {
  lessonId: string;
  onBack: () => void;
  onComplete: () => void;
  playSound: (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => void;
}

export function IntroductionScreen({
  lessonId,
  onBack,
  onComplete,
  playSound,
}: IntroductionScreenProps) {
  const lesson = getLessonById(lessonId);
  const [currentPage, setCurrentPage] = useState(0);
  const sorobana = useSorobanaVoice();

  if (!lesson || !lesson.introPages || lesson.introPages.length === 0) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-6 text-center max-w-md">
          <p className="text-white/60 mb-4">الدرس غير موجود</p>
          <button onClick={onBack} className="btn-primary w-full">رجوع</button>
        </div>
      </div>
    );
  }

  const pages = lesson.introPages;
  const page = pages[currentPage];
  const isFirst = currentPage === 0;
  const isLast = currentPage === pages.length - 1;

  const handlePrev = () => {
    if (isFirst) return;
    playSound('click');
    setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (isLast) return;
    playSound('click');
    setCurrentPage((p) => p + 1);
  };

  const handleComplete = () => {
    playSound('success');
    onComplete();
  };

  const handleHome = () => {
    playSound('click');
    sorobana.stop();
    onBack();
  };

  return (
    <div dir="rtl" className="min-h-screen pb-36">
      {/* Header ثابت */}
      <div className="sticky top-0 z-20 backdrop-blur-lg bg-slate-900/70 border-b border-white/10 px-3 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={handleHome}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            aria-label="رجوع للقائمة"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">
              {lesson.title.ar}
            </h1>
            <p className="text-[10px] text-white/50">
              المقدمة · صفحة {currentPage + 1} من {pages.length}
            </p>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={page.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="glass-card p-5 sm:p-7 mb-6"
          >
            <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white mb-4">
              {page.title}
            </h2>
            <div className="text-sm sm:text-base text-white/80 font-body leading-relaxed whitespace-pre-line">
              {page.content}
            </div>

            {page.imageSvg === 'soroban-interactive' ? (
              <div className="mt-6 p-3 rounded-2xl bg-black/20 border border-white/10 overflow-hidden">
                <div className="mx-auto" style={{ maxWidth: 260 }}>
                  <Soroban2D5
                    columns={3}
                    size="sm"
                    interactive={true}
                    showValue={false}
                    autoBeadSize={true}
                  />
                </div>
              </div>
            ) : page.imageSvg ? (
              <div className="mt-6 p-3 rounded-2xl bg-black/20 border border-white/10 overflow-hidden">
                <img
                  src={`/images/${page.imageSvg}.svg`}
                  alt={page.imageAlt || ''}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* نقاط التقدم */}
        <div className="flex justify-center gap-1.5 mb-6">
          {pages.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentPage
                  ? 'w-6 bg-gold-400'
                  : i < currentPage
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* أزرار التنقل */}
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </button>

          {!isLast ? (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              أكملت المقدمة
            </button>
          )}
        </div>
      </div>

      {/* البطل العائم */}
      <FloatingCompanion playSound={playSound} />
    </div>
  );
}

export default IntroductionScreen;