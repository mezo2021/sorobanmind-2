// src/components/cosmic/WarpFlash.tsx
// وميض "ثقب دودي" عند تغيّر المشهد: scale + opacity فقط.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export default function WarpFlash({ trigger, color = '#a78bfa' }: { trigger: string | number; color?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <AnimatePresence>
      <motion.div
        key={trigger}
        className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="w-[40vmin] h-[40vmin] rounded-full"
          style={{ background: `radial-gradient(circle, transparent 35%, ${color}cc 55%, transparent 72%)` }}
          initial={{ scale: 0.1, rotate: 0 }}
          animate={{ scale: 5, rotate: 120 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
