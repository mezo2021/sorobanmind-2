// src/screens/RoleSelection.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Swords, Shield, Star, TrendingUp, Brain, ArrowRight, Languages, Wrench, Cloud, Lock, KeyRound, X, LogOut } from 'lucide-react';

import { useT, useLangStore } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

import type { Role, CharacterType } from '@/types';
import { CharacterSelector } from '@/components/CharacterSelector';
import { NameInputModal } from '@/components/NameInputModal';
import { AuthModal } from '@/components/AuthModal';
import { useProgressStore } from '@/store/progressStore';
import { cloudSync } from '@/lib/cloudSync';

interface RoleSelectionProps {
  onSelect: (role: Role) => void;
  playSound: (type: 'click' | 'whoosh') => void;
}

const COMPANION_STORAGE_KEY = 'soroban_companion';
const NAME_STORAGE_KEY = 'soroban_child_name';
const DEV_PASSWORD = '19871987';

type Step = 'idle' | 'name' | 'companion';

export function RoleSelection({ onSelect, playSound }: RoleSelectionProps) {
  const { lang, dir } = useT();
  const setLang = useLangStore((s) => s.setLang);

  const [step, setStep] = useState<Step>('idle');
  const [pendingRole, setPendingRole] = useState<Role>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showDevPassword, setShowDevPassword] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const [devPasswordError, setDevPasswordError] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. اقرأ الجلسة محلياً (تعمل بدون إنترنت)
        const session = await cloudSync.getSession();
        
        if (session) {
          setIsLoggedIn(true);
          setShowAuth(false);
          
          // 2. تحقق في الخلفية (لا يؤثر على الواجهة)
          cloudSync.getCurrentUser().catch((err) => {
            // إذا كان الخطأ 401 (جلسة منتهية) → أخرج المستخدم
            if (err?.status === 401 || err?.message?.includes('JWT')) {
              cloudSync.logoutParent();
              setIsLoggedIn(false);
              setShowAuth(true);
            }
            // إذا كان خطأ شبكة → ابقَ مفتوحاً (أوفلاين)
          });
        } else {
          setIsLoggedIn(false);
          setShowAuth(true);
        }
      } catch (e) {
        setIsLoggedIn(false);
        setShowAuth(true);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, []);

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    playSound('click');
    await cloudSync.logoutParent();
    
    // مسح الأسماء من المتجر والذاكرة المحلية
    useProgressStore.getState().setChildName('');
    useProgressStore.getState().setParentName('');
    localStorage.removeItem(NAME_STORAGE_KEY);
    
    setIsLoggedIn(false);
    setShowAuth(true); // إعادة فتح نافذة التسجيل
  };

  const handleSelect = (role: Role) => {
    if (role === 'guardian') {
      playSound('click');
      setShowDevPassword(true);
      return;
    }

    if (role === 'hero') {
      if (!isLoggedIn) return;
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
    }
  };

  const handleDevPasswordSubmit = () => {
    if (devPassword === DEV_PASSWORD) {
      setShowDevPassword(false);
      setDevPassword('');
      setDevPasswordError(false);
      playSound('whoosh');
      onSelect('guardian');
    } else {
      setDevPasswordError(true);
      setDevPassword('');
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
        <div className="text-purple-400 text-2xl">...</div>
      </div>
    );
  }

  return (
    <div dir={dir} className="relative min-h-screen flex flex-col items-center justify-center px-3 sm:px-6 py-8 sm:py-12">
      
      {/* أزرار المطور، الحساب/الخروج، واللغة */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => { playSound('click'); setShowDevPassword(true); }}
          title={pickLang({ ar: 'وضع المطور', en: 'Developer Mode' }, lang)}
          className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 transition"
        >
          <Wrench className="w-4 h-4" />
        </button>

        {/* زر الحساب أو الخروج */}
        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-white shadow-lg backdrop-blur-md transition"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            <span className="text-xs font-bold">
              {pickLang({ ar: 'خروج', en: 'Logout' }, lang)}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { playSound('click'); setShowAuth(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-white shadow-lg backdrop-blur-md transition"
          >
            <Cloud className="w-4 h-4 text-purple-300" />
            <span className="text-xs font-bold">
              {pickLang({ ar: 'حسابي', en: 'Account' }, lang)}
            </span>
          </button>
        )}

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
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="text-center mb-8 sm:mb-14 mt-8">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }} className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-purple-500 to-electric-500 shadow-2xl shadow-purple-500/40 mb-5">
          <Brain className="w-14 h-14 sm:w-20 sm:h-20 text-white" />
        </motion.div>
        <h1 className="text-5xl sm:text-7xl font-extrabold font-display shimmer-text mb-3">SorobanMind</h1>
        <p className="text-2xl sm:text-4xl text-white/90 font-body font-bold mb-3">
          {pickLang({ ar: 'أكاديمية السوروبان', en: 'Soroban Academy' }, lang)}
        </p>
      </motion.div>

      {/* البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 w-full max-w-5xl relative">
        
        {!isLoggedIn && (
          <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center border border-white/5">
            <Lock className="w-16 h-16 text-white/50 mb-4" />
            <p className="text-white/80 font-bold text-lg">
              {pickLang({ ar: 'الشاشات مقفلة', en: 'Screens Locked' }, lang)}
            </p>
            <p className="text-white/50 text-xs mt-1">
              {pickLang({ ar: 'سجّل الدخول من زر "حسابي"', en: 'Login from "Account" button' }, lang)}
            </p>
          </div>
        )}

        {/* Hero */}
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect('hero')}
          disabled={!isLoggedIn}
          className={`group relative glass-card p-7 sm:p-10 overflow-hidden ${lang === 'ar' ? 'text-right' : 'text-left'} ${!isLoggedIn ? 'opacity-50' : ''}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-electric-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl shadow-purple-500/40 mb-6">
            <Swords className="w-11 h-11 sm:w-14 sm:h-14 text-white" />
            <motion.div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center shadow-lg" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
              <Star className="w-4 h-4 text-gold-900" />
            </motion.div>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-2">
            {pickLang({ ar: 'البطل', en: 'Hero' }, lang)}
          </h2>
          <p className="text-xl text-purple-300/90 font-body mb-4 font-semibold">Hero (Child)</p>
          <p className="text-base text-white/70 font-body mb-6 leading-relaxed">
            {pickLang({ ar: 'تدرب على السوروبان، العب ألعاب الأنزان، اكسب نقاط الخبرة، وارتقِ في المستويات', en: 'Practice the soroban, play Anzan games, earn XP, and level up' }, lang)}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              pickLang({ ar: 'تعلّم', en: 'Learn' }, lang),
              pickLang({ ar: 'تدرّب', en: 'Practice' }, lang),
              pickLang({ ar: 'أنزان', en: 'Anzan' }, lang),
              pickLang({ ar: 'مغامرات', en: 'Adventures' }, lang),
            ].map((tag) => (
              <span key={tag} className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-body text-white/80">{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-purple-300 font-bold text-base group-hover:gap-3 transition-all">
            <span>{pickLang({ ar: 'ابدأ المغامرة', en: 'Start the adventure' }, lang)}</span>
            <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
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
          className={`group relative glass-card p-7 sm:p-10 overflow-hidden ${lang === 'ar' ? 'text-right' : 'text-left'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald2-500/20 via-transparent to-gold-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald2-500 to-gold-500 flex items-center justify-center shadow-xl shadow-emerald2-500/40 mb-6">
            <Shield className="w-11 h-11 sm:w-14 sm:h-14 text-white" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mb-2">
            {pickLang({ ar: 'ولي الأمر', en: 'Guardian' }, lang)}
          </h2>
          <p className="text-xl text-emerald2-300/90 font-body mb-4 font-semibold">Guardian (Parent)</p>
          <p className="text-base text-white/70 font-body mb-6 leading-relaxed">
            {pickLang({ ar: 'تابع تقدم طفلك، اطلع على الإحصائيات، وشجعه على الاستمرار في رحلة التعلم', en: "Track your child's progress, view statistics, and encourage them to continue the learning journey" }, lang)}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              pickLang({ ar: 'تقارير', en: 'Reports' }, lang),
              pickLang({ ar: 'إحصائيات', en: 'Statistics' }, lang),
              pickLang({ ar: 'متابعة', en: 'Tracking' }, lang),
              pickLang({ ar: 'تقدم', en: 'Progress' }, lang),
            ].map((tag) => (
              <span key={tag} className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-body text-white/80">{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-emerald2-300 font-bold text-base group-hover:gap-3 transition-all">
            <Lock className="w-4 h-4" />
            <span>{pickLang({ ar: 'محمي بكلمة سر', en: 'Password Protected' }, lang)}</span>
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-3 mt-10 sm:mt-14 text-white/50 text-sm sm:text-base font-body text-center px-4">
        <TrendingUp className="w-5 h-5 shrink-0" />
        <span>{pickLang({ ar: 'منصة تعليمية تفاعلية للحساب الذهني بالعداد الياباني', en: 'An interactive educational platform for mental arithmetic with the Japanese abacus' }, lang)}</span>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); setIsLoggedIn(true); }} />
        )}

        {showDevPassword && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0c0c0e] p-6 w-full max-w-sm relative border border-amber-500/30 rounded-3xl shadow-2xl">
              <button onClick={() => { setShowDevPassword(false); setDevPassword(''); setDevPasswordError(false); }} className="absolute top-3 left-3 p-1.5 rounded-full bg-white/5 text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-3 shadow-lg">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-extrabold font-display text-white">
                  {pickLang({ ar: 'وضع المطور', en: 'Developer Mode' }, lang)}
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  {pickLang({ ar: 'أدخل كلمة السر للدخول', en: 'Enter password to continue' }, lang)}
                </p>
              </div>
              <input type="password" value={devPassword} onChange={(e) => { setDevPassword(e.target.value); setDevPasswordError(false); }} onKeyDown={(e) => e.key === 'Enter' && handleDevPasswordSubmit()} className={`w-full bg-white/5 border rounded-xl py-3 px-3 text-white text-center font-mono tracking-widest focus:outline-none transition ${devPasswordError ? 'border-red-400' : 'border-white/10 focus:border-amber-400'}`} placeholder="••••••••" dir="ltr" autoFocus />
              {devPasswordError && (
                <p className="text-red-400 text-xs mt-2 text-center">{pickLang({ ar: 'كلمة السر خاطئة', en: 'Wrong password' }, lang)}</p>
              )}
              <button onClick={handleDevPasswordSubmit} className="btn-primary w-full !py-3 mt-4">
                {pickLang({ ar: 'دخول', en: 'Enter' }, lang)}
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
            <NameInputModal onSave={handleNameSaved} onSkip={() => handleNameSaved(pickLang({ ar: 'البطل', en: 'Hero' }, lang))} />
          </motion.div>
        )}

        {step === 'companion' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
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