// src/components/games/MentalArchivesGame/ui/ChapterTitleCard.tsx
// بطاقة افتتاح سينمائية لكل مستوى (تختفي تلقائياً أو بالنقر).
import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { ChapterTheme } from './chapterThemes';

type Props = { show: boolean; onDone: () => void; theme: ChapterTheme; title: string; isAr: boolean };

export default function ChapterTitleCard({ show, onDone, theme, title, isAr }: Props) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
  className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 bg-[#04050d]"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
  onClick={onDone}
>
  <motion.div
    className="absolute w-[70vmin] h-[70vmin] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${theme.accent}66, transparent 65%)` }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
          <motion.div className="text-7xl mb-4 relative" initial={{ y: 20, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 160, damping: 14 }}>
            {theme.emoji}
          </motion.div>
          <motion.p className="relative text-sm tracking-widest text-amber-300/90 mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            📍 {isAr ? theme.placeAr : theme.placeEn}
          </motion.p>
          <motion.h2 className="relative text-2xl sm:text-3xl font-black text-white max-w-xl leading-snug" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            {title}
          </motion.h2>
          <motion.p className="relative mt-4 text-slate-300 italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            “{isAr ? theme.taglineAr : theme.taglineEn}”
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
