// src/screens/RoleSelection.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Swords, Shield, Star, TrendingUp, Brain, ArrowRight } from 'lucide-react';
import type { Role, CharacterType } from '@/types';
import { CharacterSelector } from '@/components/CharacterSelector';
import { NameInputModal } from '@/components/NameInputModal';

interface RoleSelectionProps {
  onSelect: (role: Role) => void;
  playSound: (type: 'click' | 'whoosh') => void;
}

const COMPANION_STORAGE_KEY = 'soroban_companion';
const NAME_STORAGE_KEY = 'soroban_child_name';

type Step = 'idle' | 'name' | 'companion';

export function RoleSelection({ onSelect, playSound }: RoleSelectionProps) {
  const [step, setStep] = useState<Step>('idle');
  const [pendingRole, setPendingRole] = useState<Role>(null);

  const handleSelect = (role: Role) => {
    if (role === 'hero') {
      const savedCompanion = localStorage.getItem(COMPANION_STORAGE_KEY);
      const savedName = localStorage.getItem(NAME_STORAGE_KEY);

      if (savedCompanion && savedName) {
        playSound('whoosh');
        onSelect(role);
      } else if (!savedName) {
        playSound('click');
        setPendingRole(role);
        setStep('name');
      } else {
        playSound('click');
        setPendingRole(role);
        setStep('companion');
      }
    } else {
      playSound('whoosh');
      onSelect(role);
    }
  };

  const handleNameSaved = (name: string) => {
    localStorage.setItem(NAME_STORAGE_KEY, name);
    const savedCompanion = localStorage.getItem(COMPANION_STORAGE_KEY);
    if (savedCompanion) {
      setStep('idle');
      if (pendingRole) {
        playSound('whoosh');
        onSelect(pendingRole);
      }
    } else {
      setStep('companion');
    }
  };

  const handleCompanionSelected = (companion: CharacterType) => {
    localStorage.setItem(COMPANION_STORAGE_KEY, companion);
    setStep('idle');
    if (pendingRole) {
      playSound('whoosh');
      onSelect(pendingRole);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-6 py-8 sm:py-12">
      {/* العنوان */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center mb-8 sm:mb-14"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-purple-500 to-electric-500 shadow-2xl shadow-purple-500/40 mb-5"
        >
          <Brain className="w-14 h-14 sm:w-20 sm:h-20 text-white" />
        </motion.div>

        <h1 className="text-5xl sm:text-7xl font-extrabold font-display shimmer-text mb-3">
          SorobanMind
        </h1>
        <p className="text-2xl sm:text-4xl text-white/90 font-body font-bold mb-3">
          أكاديمية السوروبان
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-base sm:text-xl text-white/60 mt-2 font-body max-w-md mx-auto leading-relaxed"
        >
          اختر شخصيتك وابدأ مغامرة الحساب الذهني
        </motion.p>
      </motion.div>

      {/* البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 w-full max-w-5xl">
        {/* Hero */}
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect('hero')}
          className="group relative glass-card p-7 sm:p-10 overflow-hidden text-right"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-electric-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl shadow-purple-500/40 mb-6"
          >
            <Swords className="w-11 h-11 sm:w-14 sm:h-14 text-white" />
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Star className="w-4 h-4 text-gold-900" />
            </motion.div>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-2">
            البطل
          </h2>
          <p className="text-xl text-purple-300/90 font-body mb-4 font-semibold">
            Hero (Child)
          </p>
          <p className="text-base text-white/70 font-body mb-6 leading-relaxed">
            تدرب على السوروبان، العب ألعاب الأنزان، اكسب نقاط الخبرة، وارتقِ في المستويات
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {['تعلّم', 'تدرّب', 'أنزان', 'مغامرات'].map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-body text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-purple-300 font-bold text-base group-hover:gap-3 transition-all">
            <span>ابدأ المغامرة</span>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </div>
        </motion.button>

        {/* Guardian */}
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.4 }}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect('guardian')}
          className="group relative glass-card p-7 sm:p-10 overflow-hidden text-right"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald2-500/20 via-transparent to-gold-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald2-500 to-gold-500 flex items-center justify-center shadow-xl shadow-emerald2-500/40 mb-6"
          >
            <Shield className="w-11 h-11 sm:w-14 sm:h-14 text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-2">
            ولي الأمر
          </h2>
          <p className="text-xl text-emerald2-300/90 font-body mb-4 font-semibold">
            Guardian (Parent)
          </p>
          <p className="text-base text-white/70 font-body mb-6 leading-relaxed">
            تابع تقدم طفلك، اطلع على الإحصائيات، وشجعه على الاستمرار في رحلة التعلم
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {['تقارير', 'إحصائيات', 'متابعة', 'تقدم'].map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-body text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-emerald2-300 font-bold text-base group-hover:gap-3 transition-all">
            <span>لوحة المتابعة</span>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </div>
        </motion.button>
      </div>

      {/* ملاحظة سفلية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-3 mt-10 sm:mt-14 text-white/50 text-sm sm:text-base font-body text-center px-4"
      >
        <TrendingUp className="w-5 h-5 shrink-0" />
        <span>منصة تعليمية تفاعلية للحساب الذهني بالعداد الياباني</span>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {step === 'name' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <NameInputModal
              onSave={handleNameSaved}
              onSkip={() => handleNameSaved('البطل')}
            />
          </motion.div>
        )}

        {step === 'companion' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
              <CharacterSelector onSelectCharacter={handleCompanionSelected} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RoleSelection;