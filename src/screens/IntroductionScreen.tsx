// src/screens/IntroductionScreen.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

import { getLessonById } from '@/curriculum/lessons';
import { FloatingCompanion } from '@/components/FloatingCompanion';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

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
  const { lang, dir } = useT();
  const lesson = getLessonById(lessonId);
  const [currentPage, setCurrentPage] = useState(0);
  const sorobana = useSorobanaVoice();

  if (!lesson || !lesson.introPages || lesson.introPages.length === 0) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-6 text-center max-w-md">
          <p className="text-white/60 mb-4">
            {pickLang({ ar: 'الدرس غير موجود', en: 'Lesson not found' }, lang)}
          </p>
          <button onClick={onBack} className="btn-primary w-full">
            {pickLang({ ar: 'رجوع', en: 'Back' }, lang)}
          </button>
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

  const isInteractive = page.imageSvg === 'soroban-interactive';

  return (
    <div dir={dir} className="min-h-screen pb-36">
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
              {pickLang(lesson.title, lang)}
            </h1>
            <p className="text-[10px] text-white/50">
              {pickLang({ ar: 'المقدمة · صفحة', en: 'Introduction · Page' }, lang)} {currentPage + 1} {pickLang({ ar: 'من', en: 'of' }, lang)} {pages.length}
            </p>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6">
        {isInteractive ? (
          /* صفحة تفاعلية — بلا motion wrapper */
          <div className="glass-card p-5 sm:p-7 mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white mb-4">
              {pickLang(page.title, lang)}
            </h2>
            <div className="text-sm sm:text-base text-white/80 font-body leading-relaxed whitespace-pre-line">
              {pickLang(page.content, lang)}
            </div>

            <div
              style={{
                margin: '24px auto 0',
                padding: '12px',
                borderRadius: 16,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)',
                maxWidth: 320,
                pointerEvents: 'auto',
                touchAction: 'manipulation',
                position: 'relative',
                zIndex: 10,
              }}
            >
              <Soroban2D5
                columns={3}
                size="sm"
                interactive={true}
                showValue={true}
                revealValue={true}
                autoBeadSize={false}
              />
            </div>
          </div>
        ) : (
          /* صفحات الصور — مع motion */
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
                {pickLang(page.title, lang)}
              </h2>
              <div className="text-sm sm:text-base text-white/80 font-body leading-relaxed whitespace-pre-line">
                {pickLang(page.content, lang)}
              </div>

              {page.imageSvg && (
                <div className="mt-6 p-3 rounded-2xl bg-black/20 border border-white/10 overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${page.imageSvg}.svg`}
                    alt={pickLang(page.imageAlt, lang)}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

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
            {pickLang({ ar: 'السابق', en: 'Previous' }, lang)}
          </button>

          {!isLast ? (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              {pickLang({ ar: 'التالي', en: 'Next' }, lang)}
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              {pickLang({ ar: 'أكملت المقدمة', en: 'Completed Intro' }, lang)}
            </button>
          )}
        </div>
      </div>

      <FloatingCompanion playSound={playSound} />
    </div>
  );
}

export default IntroductionScreen;