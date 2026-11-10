// src/screens/RoleSelection.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Swords, Shield, Star, TrendingUp, Brain, ArrowRight, Languages, Wrench, Cloud, Lock, KeyRound, X, LogOut, LogIn, Loader2 } from 'lucide-react';

import { useT, useLangStore } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import { supabase } from '../lib/supabase'; // 🆕 للتحقق من كلمة مرور ولي الأمر

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
const DEV_PASSWORD = 'mowalid-m';

type Step = 'idle' | 'name' | 'companion';
type PasswordMode = 'dev' | 'guardian';

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

  // 🆕 حالة الحماية
  const [passwordMode, setPasswordMode] = useState<PasswordMode>('guardian');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [lockUntil, setLockUntil] = useState<number>(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await cloudSync.getSession();
        setIsLoggedIn(!!session);
      } catch (e) {
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // 🆕 تحديث وقت القفل عند فتح المودال
  useEffect(() => {
    if (showDevPassword) {
      const savedLock = Number(localStorage.getItem('soroban_guardian_lock_until') || 0);
      setLockUntil(savedLock);
      setNow(Date.now());
    }
  }, [showDevPassword]);

  // 🆕 مؤقت لتحديث العد التنازلي أثناء القفل
  useEffect(() => {
    if (!showDevPassword || passwordMode !== 'guardian' || now >= lockUntil) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [showDevPassword, passwordMode, lockUntil, now]);

  const handleLogout = async () => {
    playSound('click');
    
    const ok = await cloudSync.logoutParent();
    
    if (!ok) {
      const confirmLeave = window.confirm(
        pickLang({
          ar: 'لم نتمكن من حفظ تقدمك في السحابة. هل تخرج على أي حال؟',
          en: "We couldn't save your progress to the cloud. Sign out anyway?",
        }, lang)
      );
      if (!confirmLeave) return;
      await cloudSync.logoutParent(true);
    }
    
    useProgressStore.getState().setChildName('');
    useProgressStore.getState().setParentName('');
    localStorage.removeItem(NAME_STORAGE_KEY);
    setIsLoggedIn(false);
  };

  const handleSelect = (role: Role) => {
    if (!isLoggedIn) {
      playSound('click');
      setShowAuth(true);
      return;
    }

    if (role === 'guardian') {
      playSound('click');
      setPasswordMode('guardian');
      setDevPassword('');
      setDevPasswordError(false);
      setShowDevPassword(true);
      return;
    }

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
    }
  };

  // 🆕 التحقق من كلمة المرور (مطور أو ولي أمر)
  const handleDevPasswordSubmit = async () => {
    if (passwordMode === 'dev') {
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
      return;
    }

    // Guardian Mode
    if (Date.now() < lockUntil) {
      return; // UI يُظهر القفل تلقائياً
    }

    setLoadingPassword(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: devPassword,
      });

      if (error) throw error;

      // ✅ النجاح: مسح المحاولات + استعادة الهوية
      localStorage.removeItem('soroban_guardian_attempts');
      localStorage.removeItem('soroban_guardian_lock_until');
      
      await cloudSync.getSession(); // 🆕 استعادة اسم البطل
      
      setShowDevPassword(false);
      setDevPassword('');
      setDevPasswordError(false);
      playSound('whoosh');
      onSelect('guardian');
    } catch (e) {
      // ❌ فشل: زيادة المحاولات
      let attempts = Number(localStorage.getItem('soroban_guardian_attempts') || 0);
      attempts++;
      localStorage.setItem('soroban_guardian_attempts', String(attempts));

      if (attempts >= 3) {
        const newLockUntil = Date.now() + 5 * 60 * 1000;
        localStorage.setItem('soroban_guardian_lock_until', String(newLockUntil));
        setLockUntil(newLockUntil);
        setNow(Date.now());
      }
      
      setDevPasswordError(true);
      setDevPassword('');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleNameSaved = (name: string) => {
    const trimmedName = name.trim();
    localStorage.setItem(NAME_STORAGE_KEY, trimmedName);
    useProgressStore.getState().setChildName(trimmedName);
    const savedCompanion = localStorage.getItem(COMPANION_STORAGE_KEY);
    if (savedCompanion) {
      setStep('idle');
      if (pendingRole) { playSound('whoosh'); onSelect(pendingRole); }
    } else {
      setStep('companion');
    }
  };

  const handleCompanionSelected = (companion: CharacterType) => {
    localStorage.setItem(COMPANION_STORAGE_KEY, companion);
    setStep('idle');
    if (pendingRole) { playSound('whoosh'); onSelect(pendingRole); }
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
      
      {/* شريط الأدوات العلوي */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => { playSound('click'); setPasswordMode('dev'); setDevPassword(''); setDevPasswordError(false); setShowDevPassword(true); }}
          className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 transition"
        >
          <Wrench className="w-4 h-4" />
        </button>

        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-white shadow-lg backdrop-blur-md transition"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            <span className="text-xs font-bold">{pickLang({ ar: 'خروج', en: 'Logout' }, lang)}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { playSound('click'); setShowAuth(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-white shadow-lg backdrop-blur-md transition"
          >
            <LogIn className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-bold">{pickLang({ ar: 'دخول / تسجيل', en: 'Login / Register' }, lang)}</span>
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
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6 mt-8">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="inline-flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-[2rem] bg-gradient-to-br from-purple-500 to-electric-500 shadow-2xl shadow-purple-500/40 mb-4">
          <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </motion.div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display shimmer-text mb-2">SorobanMind</h1>
        <p className="text-lg sm:text-2xl text-white/90 font-body font-bold">
          {pickLang({ ar: 'أكاديمية السوروبان', en: 'Soroban Academy' }, lang)}
        </p>
      </motion.div>

      {/* البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl">
        
        {/* البطل */}
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('hero')}
          className={`group relative glass-card p-6 sm:p-8 overflow-hidden ${lang === 'ar' ? 'text-right' : 'text-left'} ${!isLoggedIn ? 'opacity-75' : ''}`}
        >
          <div className="flex items-start gap-4 mb-4">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl shadow-purple-500/40 shrink-0">
              <Swords className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
              <motion.div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold-400 flex items-center justify-center shadow-lg" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                <Star className="w-4 h-4 text-gold-900" />
              </motion.div>
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-1">
                {pickLang({ ar: 'البطل', en: 'Hero' }, lang)}
              </h2>
              <p className="text-sm text-purple-300/90 font-body font-semibold">Hero (Child)</p>
            </div>
          </div>
          <p className="text-sm text-white/70 font-body mb-4 leading-relaxed">
            {pickLang({ ar: 'تعلّم، العب، اكسب نقاط الخبرة، وارتقِ في المستويات', en: 'Learn, play, earn XP, and level up' }, lang)}
          </p>
          <div className="flex items-center gap-2 text-purple-300 font-bold text-sm group-hover:gap-3 transition-all">
            <span>{pickLang({ ar: 'ادخل كلاعب', en: 'Enter as player' }, lang)}</span>
            <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </div>
        </motion.button>

        {/* ولي الأمر */}
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('guardian')}
          className={`group relative glass-card p-6 sm:p-8 overflow-hidden ${lang === 'ar' ? 'text-right' : 'text-left'}`}
        >
          <div className="flex items-start gap-4 mb-4">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald2-500 to-gold-500 flex items-center justify-center shadow-xl shadow-emerald2-500/40 shrink-0">
              <Shield className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-1">
                {pickLang({ ar: 'ولي الأمر', en: 'Guardian' }, lang)}
              </h2>
              <p className="text-sm text-emerald2-300/90 font-body font-semibold">Guardian (Parent)</p>
            </div>
          </div>
          <p className="text-sm text-white/70 font-body mb-4 leading-relaxed">
            {pickLang({ ar: 'تابع تقدم طفلك، واطلع على الإحصائيات', en: 'Track progress and view statistics' }, lang)}
          </p>
          <div className="flex items-center gap-2 text-emerald2-300 font-bold text-sm group-hover:gap-3 transition-all">
            <Lock className="w-4 h-4" />
            <span>{pickLang({ ar: 'محمي بكلمة سر', en: 'Password protected' }, lang)}</span>
          </div>
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mt-8 text-white/50 text-xs sm:text-sm font-body text-center px-4">
        <TrendingUp className="w-4 h-4 shrink-0" />
        <span>{pickLang({ ar: 'منصة تعليمية للحساب الذهني بالعداد الياباني', en: 'Educational platform for mental arithmetic' }, lang)}</span>
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
                  {passwordMode === 'dev' 
                    ? pickLang({ ar: 'وضع المطور', en: 'Developer Mode' }, lang)
                    : pickLang({ ar: 'دخول ولي الأمر', en: 'Guardian Access' }, lang)}
                </h3>
                {passwordMode === 'guardian' && (
                  <p className="text-xs text-white/60 mt-1">
                    {pickLang({ ar: 'أدخل كلمة مرور حسابك السحابي', en: 'Enter your cloud account password' }, lang)}
                  </p>
                )}
              </div>

              {passwordMode === 'guardian' && now < lockUntil ? (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4 text-center">
                  <p className="text-red-400 font-bold text-sm">
                    {pickLang({ ar: 'مقفل مؤقتاً', en: 'Temporarily Locked' }, lang)}
                  </p>
                  <p className="text-red-300 text-xs mt-1">
                    {pickLang({ ar: `حاول مجدداً بعد ${Math.ceil((lockUntil - now) / 60000)} دقائق`, en: `Try again in ${Math.ceil((lockUntil - now) / 60000)} minutes` }, lang)}
                  </p>
                </div>
              ) : (
                <>
                  <input 
                    type="password" 
                    value={devPassword} 
                    onChange={(e) => { setDevPassword(e.target.value); setDevPasswordError(false); }} 
                    onKeyDown={(e) => e.key === 'Enter' && handleDevPasswordSubmit()} 
                    className={`w-full bg-white/5 border rounded-xl py-3 px-3 text-white text-center font-mono tracking-widest focus:outline-none transition ${devPasswordError ? 'border-red-400' : 'border-white/10 focus:border-amber-400'}`} 
                    placeholder="••••••••" 
                    dir="ltr" 
                    autoFocus 
                    disabled={loadingPassword}
                  />
                  {devPasswordError && <p className="text-red-400 text-xs mt-2 text-center">{pickLang({ ar: 'كلمة السر خاطئة', en: 'Wrong password' }, lang)}</p>}
                  <button 
                    onClick={handleDevPasswordSubmit} 
                    disabled={loadingPassword}
                    className="btn-primary w-full !py-3 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loadingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {pickLang({ ar: 'دخول', en: 'Enter' }, lang)}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
            <NameInputModal onSave={handleNameSaved} onSkip={() => handleNameSaved(pickLang({ ar: 'البطل', en: 'Hero' }, lang))} />
          </motion.div>
        )}

        {step === 'companion' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
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