// src/components/flash/FingerMovementIcon.tsx
// 🖐️ أيقونة حركة الإصبع — SVG بسيط مع أنيميشن

import { motion } from 'framer-motion';
import type { MovementType } from './types';

interface Props {
  type: MovementType;
  size?: number;
}

export function FingerMovementIcon({ type, size = 36 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      {/* العارضة */}
      <line x1="6" y1="30" x2="54" y2="30" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />

      {/* ⬇️⬇️ نزول مزدوج */}
      {type === 'doubleDrop' && (
        <>
          <motion.circle cx="30" cy="18" r="6" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5"
            animate={{ cy: [15, 24, 15] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.circle cx="30" cy="42" r="6" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5"
            animate={{ cy: [42, 51, 42] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.g animate={{ y: [0, 4, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
            <line x1="12" y1="14" x2="12" y2="22" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            <path d="M 8 18 L 12 22 L 16 18" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
          <motion.g animate={{ y: [0, 4, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}>
            <line x1="48" y1="14" x2="48" y2="22" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            <path d="M 44 18 L 48 22 L 52 18" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        </>
      )}

      {/* ⬆️⬆️ رفع مزدوج */}
      {type === 'doubleLift' && (
        <>
          <motion.circle cx="30" cy="26" r="6" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5"
            animate={{ cy: [24, 15, 24] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.circle cx="30" cy="50" r="6" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5"
            animate={{ cy: [51, 42, 51] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.g animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
            <line x1="12" y1="38" x2="12" y2="46" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            <path d="M 8 42 L 12 38 L 16 42" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
          <motion.g animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}>
            <line x1="48" y1="38" x2="48" y2="46" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            <path d="M 44 42 L 48 38 L 52 42" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        </>
      )}

      {/* 🗜️ كماشة مغلقة */}
      {type === 'closedPinch' && (
        <>
          <motion.circle cx="30" cy="20" r="6" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5"
            animate={{ cy: [16, 24, 16] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.circle cx="30" cy="40" r="6" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5"
            animate={{ cy: [44, 36, 44] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.g animate={{ y: [0, 4, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
            <line x1="12" y1="18" x2="12" y2="26" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            <path d="M 8 22 L 12 26 L 16 22" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
          <motion.g animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}>
            <line x1="48" y1="34" x2="48" y2="42" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            <path d="M 44 38 L 48 34 L 52 38" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        </>
      )}
    </svg>
  );
}

export default FingerMovementIcon;