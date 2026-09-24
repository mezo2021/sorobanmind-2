// src/components/SorobanaCompanion.tsx
import { motion } from 'framer-motion';
import mainImg from '@/assets/sorobana/sorobana-main.webp';
import pointingImg from '@/assets/sorobana/sorobana-teaching-pointing.webp';

type LessonMode = 'watch' | 'try';
type SorobanaVariant = 'main' | 'pointing';

interface SorobanaCompanionProps {
  isSpeaking: boolean;
  onClick?: () => void;
  mode?: LessonMode;
  variant?: SorobanaVariant;
  sizeOverride?: number;
  offsetBottom?: string;
  clickThrough?: boolean;
}

export function SorobanaCompanion({
  isSpeaking,
  onClick,
  mode = 'watch',
  variant = 'main',
  sizeOverride,
  offsetBottom = '12rem',
  clickThrough = false,
}: SorobanaCompanionProps) {
  let size: number;
  if (sizeOverride) {
    size = sizeOverride;
  } else if (mode === 'try') {
    size = 90;
  } else {
    size = 180;
  }

  const img = variant === 'pointing' ? pointingImg : mainImg;

  return (
    <motion.button
      type="button"
      onClick={clickThrough ? undefined : onClick}
      aria-label="سوروبانا — المعلمة"
      className="fixed z-[55] select-none focus:outline-none"
      style={{
        bottom: offsetBottom,
        right: '0.25rem',
        padding: 0,
        background: 'transparent',
        border: 'none',
        pointerEvents: clickThrough ? 'none' : 'auto',
        width: size,
      }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      whileTap={clickThrough ? undefined : { scale: 0.95 }}
    >
      <motion.img
        src={img}
        alt="سوروبانا"
        className="w-full pointer-events-none"
        style={{
          objectFit: 'contain',
          objectPosition: 'right bottom',
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
        }}
        draggable={false}
        animate={{
          y: isSpeaking ? [0, -6, 0, -6, 0] : [0, -12, 0],
        }}
        transition={{
          duration: isSpeaking ? 0.8 : 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
}

export default SorobanaCompanion;