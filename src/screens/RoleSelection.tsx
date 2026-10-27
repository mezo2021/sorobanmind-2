// src/screens/RoleSelection.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Swords, Shield, Star, TrendingUp, Brain, ArrowRight, Languages, Lock, Loader2 } from 'lucide-react';

import { useT, useLangStore } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

import type { Role, CharacterType } from '@/types';
import { CharacterSelector } from '@/components/CharacterSelector';
import { NameInputModal } from '@/components/NameInputModal';
import { CloudSyncSection } from '@/components/CloudSyncSection';
import { useProgressStore } from '@/store/progressStore';
import { cloudSync } from '@/lib/cloudSync';

interface RoleSelectionProps {
  onSelect: (role: Role) => void;
  playSound: (type: 'click' | 'whoosh') => void;
}

const COMPANION_STORAGE_KEY = 'soroban_companion';
const NAME_STORAGE_KEY = 'soroban_child_name';

type Step = 'idle' | 'name' | 'companion';

export function RoleSelection({ onSelect, playSound }: RoleSelectionProps) {
  const { lang, dir } = useT();
  const setLang = useLangStore((s) => s.setLang);
  const storeChildName = useProgressStore((s) => s.childName);

  const [step, setStep] = useState<Step>('idle');
  const [pendingRole, setPendingRole] = useState<Role>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await cloudSync.getCurrentUser();
        if (user) {
          setIsLoggedIn(true); // المستخدم مسجل
          try {
            await cloudSync.fetchChildren();
          } catch (fetchErr) {
            console.warn('فشل جلب الأطفال:', fetchErr);
          }
        }
      } catch (e) {
        // لا يوجد مستخدم
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleSelect = (role: Role) => {
    if (!isLoggedIn) {
      return; // البطاقات مقفلة
    }

    if (role === 'hero') {
      const savedCompanion = localStorage.getItem(COMPANION_STORAGE_KEY);
      const savedName = storeChildName || localStorage.getItem(NAME_STORAGE_KEY);

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
    const trimmedName = name.trim();
    localStorage.setItem(NAME_STORAGE_KEY, trimmedName);
    useProgressStore.getState().setChildName(trimmedName);

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

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1020]">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div dir={dir} className="relative min-h-screen flex flex-col items-center justify-center px-3 sm:px-6 py-8 sm:py-12">
      
      {/* أزرار اللغة */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-50">
        <button
          type="button"
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition text-white shadow-lg backdrop-blur-md"
        >
          <Languages className="w-4 h-4 text-white/80" />
          <span className="text-xs font-bold" dir="ltr">
            <span className={lang === 'ar' ? 'text-emerald-300' : 'text-white/40'}>AR</span>
            <span className="text-white/30"> | </span>
            <span className={lang === 'en' ? 'text-blue-300' : 'text-white/40'}>EN</span>
          </span>
        </button>
      </div>

      {/* العنوان */}
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8 mt-8">
        <motion.div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-purple-500 to-electric-500 shadow-2xl shadow-purple-500/40 mb-5">
          <Brain className="w-14 h-14 sm:w-20 sm:h-20 text-white" />
        </motion.div>
        <h1 className="text-5xl sm:text-7xl font-extrabold font-display shimmer-text mb-3">SorobanMind</h1>
      </motion.div>

      {/* البطاقات (مقفلة إذا لم يسجل) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 w-full max-w-5xl mb-8 relative">
        
        {/* قفل البطاقات إذا لم يسجل */}
        {!isLoggedIn && (
          <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center border border-white/5">
            <Lock className="w-16 h-16 text-white/50 mb-4" />
            <p className="text-white/80 font-bold text-lg">{pickLang({ ar: 'الشاشات مقفلة', en: 'Screens Locked' }, lang)}</p>
          </div>
        )}

        {/* Hero */}
        <motion.button
          onClick={() => handleSelect('hero')}
          disabled={!isLoggedIn}
          className={`group relative glass-card p-7 sm:p-10 overflow-hidden ${lang === 'ar' ? 'text-right' : 'text-left'} ${!isLoggedIn ? 'opacity-50' : ''}`}
        >
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl mb-6">
            <Swords className="w-11 h-11 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white mb-2">{pickLang({ ar: 'البطل', en: 'Hero' }, lang)}</h2>
          <p className="text-xl text-purple-300/90 font-body mb-4 font-semibold">Hero (Child)</p>
          <div className="flex items-center gap-2 text-purple-300 font-bold text-base group-hover:gap-3 transition-all">
            <span>{pickLang({ ar: 'ابدأ المغامرة', en: 'Start the adventure' }, lang)}</span>
            <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </div>
        </motion.button>

        {/* Guardian */}
        <motion.button
          onClick={() => handleSelect('guardian')}
          disabled={!isLoggedIn}
          className={`group relative glass-card p-7 sm:p-10 overflow-hidden ${lang === 'ar' ? 'text-right' : 'text-left'} ${!isLoggedIn ? 'opacity-50' : ''}`}
        >
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald2-500 to-gold-500 flex items-center justify-center shadow-xl mb-6">
            <Shield className="w-11 h-11 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white mb-2">{pickLang({ ar: 'ولي الأمر', en: 'Guardian' }, lang)}</h2>
          <p className="text-xl text-emerald2-300/90 font-body mb-4 font-semibold">Guardian (Parent)</p>
          <div className="flex items-center gap-2 text-emerald2-300 font-bold text-base group-hover:gap-3 transition-all">
            <span>{pickLang({ ar: 'لوحة المتابعة', en: 'Dashboard' }, lang)}</span>
            <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </div>
        </motion.button>
      </div>

      {/* شريط التسجيل العريض (يظهر فقط إذا لم يسجل) */}
      {!isLoggedIn && (
        <div className="w-full max-w-5xl">
          <CloudSyncSection onLoginSuccess={() => setIsLoggedIn(true)} />
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {step === 'name' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
            <NameInputModal onSave={handleNameSaved} onSkip={() => handleNameSaved('البطل')} />
          </motion.div>
        )}

        {step === 'companion' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl p-5 max-w-2xl w-full">
              <CharacterSelector onSelectCharacter={handleCompanionSelected} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RoleSelection;