// src/components/BadgeModal.tsx
import { AnimatePresence, motion } from 'framer-motion';
import {
  Star,
  Eye,
  Award,
  Crown,
  Target,
  Diamond,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { Badge } from '../types';

/** تحويل الأرقام إلى أرقام عربية */
function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

interface BadgeModalProps {
  badge: Badge | null;
  onClose: () => void;
}

const BADGE_ICONS: Record<string, LucideIcon> = {
  Star,
  Eye,
  Award,
  Crown,
  Target,
  Diamond,
};

const BADGE_GRADIENTS: Record<string, string> = {
  beginner: 'from-emerald2-400 to-emerald2-600',
  trainee: 'from-electric-400 to-electric-600',
  'anzan-master': 'from-electric-400 to-electric-600',
  skilled: 'from-purple-400 to-purple-600',
  'soroban-expert': 'from-purple-400 to-purple-600',
  professional: 'from-pink-400 to-pink-600',
  legend: 'from-gold-400 to-gold-600',
  'eternal-legend': 'from-gold-400 to-gold-600',
};

export function BadgeModal({ badge, onClose }: BadgeModalProps) {
  if (!badge) return null;

  const Icon = BADGE_ICONS[badge.icon] || Star;
  const gradient = BADGE_GRADIENTS[badge.id] || 'from-purple-400 to-electric-500';

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card relative w-full max-w-sm p-6 sm:p-8 text-center overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-3 left-3 text-white/50 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />

            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl`}
            >
              <Icon className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-white/40"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            </motion.div>

            <p className="text-sm text-white/50 font-body mb-1">شارة جديدة!</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-2">
              {badge.nameAr}
            </h3>
            <p className="text-white/60 font-body mb-6">
              وصلت إلى {toArabicNumber(badge.xpRequired)} نقطة خبرة. أنت بطل حقيقي! 🎉
            </p>

            <button onClick={onClose} className="btn-primary w-full justify-center">
              رائع!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BadgeModal;