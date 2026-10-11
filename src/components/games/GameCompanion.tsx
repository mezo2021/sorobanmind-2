// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/GameCompanion.tsx — ملف جديد
// ═══════════════════════════════════════════════════════════════════
//
// ما يضيفه:
//   - بطل مرافق داخل الألعاب (70x70)
//   - 5 حالات مزاج (idle · thinking · excited · celebrating · sad)
//   - فقاعة كلام
//   - لا يتكلم (TTS في الألعاب يُدار من الخارج)
//
// لا يلمس Companion.tsx · FloatingCompanion.tsx · ImageAvatar.tsx.
// ═══════════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion';
import shamImg from '../../assets/avatars/sham.png';
import rayanImg from '../../assets/avatars/rayan.png';
import banaImg from '../../assets/avatars/bana.png';
import joudImg from '../../assets/avatars/joud2.png';
import type { CharacterType } from '../../types';

export type HeroMood = 'idle' | 'thinking' | 'excited' | 'celebrating' | 'sad';

const HERO_IMAGES: Record<CharacterType, string> = {
  sham: shamImg,
  rayan: rayanImg,
  bana: banaImg,
  joud: joudImg,
};

interface GameCompanionProps {
  heroId: CharacterType;
  mood: HeroMood;
  customText?: string;
  size?: number;
}

export function GameCompanion({
  heroId,
  mood,
  customText,
  size = 70,
}: GameCompanionProps) {
  const animate = (() => {
    switch (mood) {
      case 'idle':
        return { y: [0, -4, 0] };
      case 'thinking':
        return { rotate: [0, -6, 6, 0] };
      case 'excited':
        return { y: [0, -12, 0], scale: [1, 1.15, 1] };
      case 'celebrating':
        return { y: [0, -18, 0], scale: [1, 1.2, 1] };
      case 'sad':
        return { scale: [1, 0.9, 1] };
    }
  })();

  const transition = (() => {
    switch (mood) {
      case 'idle':
        return { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const };
      case 'thinking':
        return { duration: 2, repeat: Infinity, ease: 'easeInOut' as const };
      default:
        return { duration: 0.6, ease: 'easeOut' as const };
    }
  })();

  return (
    <div className="flex flex-row items-center gap-2" dir="rtl">
      <motion.div
        key={mood}
        animate={animate}
        transition={transition}
        className="relative flex items-center justify-center rounded-full bg-slate-800 border-2 border-sky-400 shadow-lg overflow-hidden shrink-0"
        style={{ width: size, height: size }}
      >
        <img
          src={HERO_IMAGES[heroId]}
          alt={heroId}
          className="object-contain select-none pointer-events-none"
          style={{ width: size * 0.8, height: size * 0.8 }}
          draggable={false}
        />
      </motion.div>

      <AnimatePresence>
        {customText && (
          <motion.div
            key={customText}
            initial={{ opacity: 0, x: 12, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl max-w-[170px] text-center shadow-lg leading-tight"
          >
            {customText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GameCompanion;