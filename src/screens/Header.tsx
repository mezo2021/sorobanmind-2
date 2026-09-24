// src/screens/Header.tsx
import { motion } from 'framer-motion';
import { Sparkles, Flame, Volume2, VolumeX, Brain } from 'lucide-react';

interface HeaderProps {
  xp: number;
  streak: number;
  level: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onHome: () => void;
}

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

export function Header({
  xp,
  streak,
  level,
  soundEnabled,
  onToggleSound,
  onHome,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="sticky top-0 z-50 px-2 sm:px-6 py-2 sm:py-3"
    >
      <div className="glass-strong mx-auto max-w-6xl px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Logo / Title */}
        <button
          onClick={onHome}
          className="flex items-center gap-2 sm:gap-3 group shrink-0"
        >
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-lg shadow-purple-500/40"
          >
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gold-400"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="text-right">
            <h1 className="text-base sm:text-xl font-extrabold font-display leading-tight shimmer-text">
              SorobanMind
            </h1>
            <p className="text-[10px] sm:text-xs text-white/60 font-body">
              أكاديمية السوروبان
            </p>
          </div>
        </button>

        {/* Stats Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Level Badge */}
          <div className="badge bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-400/30 !px-2.5 sm:!px-4 !py-1.5 sm:!py-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
            <span className="text-purple-200 text-sm sm:text-base font-bold">
              {toArabicNumber(level)}
            </span>
          </div>

          {/* XP Badge */}
          <motion.div
            key={xp}
            initial={{ scale: 1 }}
            animate={{ scale: xp > 0 ? [1, 1.15, 1] : 1 }}
            className="badge bg-gradient-to-r from-gold-400/20 to-gold-500/20 border-gold-400/30 !px-2.5 sm:!px-4 !py-1.5 sm:!py-2"
          >
            <span className="text-gold-300 font-extrabold text-sm sm:text-base">
              {toArabicNumber(xp)}
            </span>
            <span className="text-gold-200/70 text-[10px] sm:text-xs font-bold">
              XP
            </span>
          </motion.div>

          {/* Streak Counter */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            className="badge bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30 !px-2.5 sm:!px-4 !py-1.5 sm:!py-2"
          >
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            <span className="text-orange-200 text-sm sm:text-base font-bold">
              {toArabicNumber(streak)}
            </span>
          </motion.div>

          {/* Sound Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleSound}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center transition-colors hover:bg-white/15 shrink-0"
            aria-label="تبديل الصوت"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald2-400" />
            ) : (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white/40" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;