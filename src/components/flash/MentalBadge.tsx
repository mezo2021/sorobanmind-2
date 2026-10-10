// src/components/flash/MentalBadge.tsx
// 💭 شارة التفكير الذهني — تظهر فوق العداد

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MentalBadgeProps {
  primary: string;
  secondary?: string;
  showSecondary: boolean;
  visible: boolean;
}

export function MentalBadge({
  primary,
  secondary,
  showSecondary,
  visible,
}: MentalBadgeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center bg-slate-900/95 border-2 border-amber-500 px-4 py-1.5 rounded-xl shadow-2xl backdrop-blur-md"
          dir="rtl"
        >
          <span className="text-amber-300 font-bold text-sm sm:text-base tracking-wide whitespace-nowrap">
            {primary}
          </span>
          <AnimatePresence>
            {showSecondary && secondary && (
              <motion.span
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-emerald-400 font-semibold text-xs sm:text-sm mt-0.5 border-t border-slate-700 pt-0.5 w-full text-center whitespace-nowrap"
              >
                {secondary}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MentalBadge;