import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Mail, KeyRound, User, Baby, LogIn, UserPlus, 
  Loader2, AlertCircle, CheckCircle2, Wifi, WifiOff, Sparkles 
} from 'lucide-react';

import { useT } from '../i18n/useTranslation';
import { pickLang } from '../i18n/pickLang';
import { cloudSync } from '../lib/cloudSync';
import { supabaseUrl, supabaseKey } from '../lib/supabase';
import sorobanaImg from '@/assets/sorobana/sorobana-teaching-pointing.webp';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { lang, dir } = useT();

  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // لمنع تحديث الحالة إذا تم إغلاق المكون أثناء الطلب
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const showMsg = (text: string, type: 'success' | 'error') => {
    if (!isMounted.current) return;
    setMsg({ text, type });
    setTimeout(() => {
      if (isMounted.current) setMsg(null);
    }, 4000);
  };

  // دالة ترجمة أخطاء Supabase التقنية إلى رسائل ودية
  const getFriendlyError = (errorMsg: string): string => {
    const msg = errorMsg.toLowerCase();
    if (msg.includes('invalid login credentials')) {
      return pickLang({ ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', en: 'Invalid email or password.' }, lang);
    }
    if (msg.includes('user already registered')) {
      return pickLang({ ar: 'هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول.', en: 'Email already registered. You can login.' }, lang);
    }
    if (msg.includes('password should be at least')) {
      return pickLang({ ar: 'كلمة المرور قصيرة جداً (6 خانات على الأقل).', en: 'Password is too short (minimum 6 characters).' }, lang);
    }
    if (msg.includes('email not confirmed')) {
      return pickLang({ ar: 'يرجى تأكيد بريدك الإلكتروني أولاً من خلال الرسالة المرسلة إليك.', en: 'Please confirm your email first.' }, lang);
    }
    if (msg.includes('failed to fetch') || msg.includes('network')) {
      return pickLang({ ar: 'تعذر الاتصال بالخادم. يرجى التحقق من الشبكة.', en: 'Failed to connect to server. Check network.' }, lang);
    }
    return errorMsg;
  };

  // فحص الاتصال الحقيقي (مرن)
  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) {
      if (isMounted.current) {
        setIsOnline(false);
        setIsChecking(false);
      }
      return false;
    }

    if (isMounted.current) setIsChecking(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const url = `${supabaseUrl}/rest/v1/`;
      const response = await fetch(url, {
        method: 'HEAD',
        headers: { apikey: supabaseKey },
        cache: 'no-store',
        signal: controller.signal,
      });
      
      const isValid = response.status < 500;
      if (isMounted.current) setIsOnline(isValid);
      return isValid;
    } catch (error) {
      if (isMounted.current) setIsOnline(false);
      return false;
    } finally {
      clearTimeout(timeoutId);
      if (isMounted.current) setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();

    const handleOnline = () => void checkConnection();
    const handleOffline = () => {
      if (isMounted.current) {
        setIsOnline(false);
        setIsChecking(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);

  const validate = (): string | null => {
    if (!email || !email.includes('@')) {
      return pickLang({ ar: 'يرجى إدخال بريد إلكتروني صحيح', en: 'Please enter a valid email' }, lang);
    }
    if (!password || password.length < 6) {
      return pickLang({ ar: 'كلمة المرور يجب أن تكون 6 خانات على الأقل', en: 'Password must be at least 6 characters' }, lang);
    }
    if (!/^[A-Za-z0-9]+$/.test(password)) {
      return pickLang({ ar: 'كلمة المرور بالأحرف الإنجليزية والأرقام فقط', en: 'Password must be English letters and numbers only' }, lang);
    }
    if (isRegister) {
      if (!parentName.trim()) {
        return pickLang({ ar: 'يرجى إدخال اسم ولي الأمر', en: 'Please enter parent name' }, lang);
      }
      const parts = childName.trim().split(/\s+/);
      if (parts.length !== 3) {
        return pickLang({ ar: 'اسم الطفل يجب أن يكون ثلاثياً (3 كلمات)', en: 'Child name must be exactly 3 words' }, lang);
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    if (loading) return;

    const err = validate();
    if (err) {
      showMsg(err, 'error');
      return;
    }

    setLoading(true);
    if (msg) setMsg(null);

    try {
      if (isRegister) {
        await cloudSync.registerParent(email, password, parentName, childName);
        showMsg(pickLang({ ar: 'تم إنشاء الحساب بنجاح!', en: 'Account created successfully!' }, lang), 'success');
      } else {
        await cloudSync.loginParent(email, password);
        showMsg(pickLang({ ar: 'تم تسجيل الدخول!', en: 'Logged in successfully!' }, lang), 'success');
      }
      
      if (isMounted.current) setIsOnline(true);
      
      setTimeout(() => {
        if (isMounted.current) onSuccess();
      }, 1200);

    } catch (e: any) {
      const friendlyMsg = getFriendlyError(e.message || 'Unknown error');
      showMsg(friendlyMsg, 'error');
      
      if (e.message?.toLowerCase().includes('fetch') || e.message?.toLowerCase().includes('network')) {
        if (isMounted.current) setIsOnline(false);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setMsg(null);
    setPassword('');
  };

  return (
    <div dir={dir} className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className="relative w-full max-w-md my-auto"
      >
        <div className="bg-[#0c0c0e]/95 p-6 sm:p-8 border border-amber-500/20 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/90">
          
          {/* تأثيرات الإضاءة الخلفية الفاخرة */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition z-30 border border-white/5 backdrop-blur-md"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 👩‍🏫 شخصية سوروبانا الترحيبية (تمت إضافة مسافة علوية لمنع التداخل) */}
          <div className={`flex items-center gap-3 mb-5 mt-6 px-2 relative z-10 ${dir === 'ltr' ? 'flex-row-reverse' : 'flex-row'}`}>
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-amber-500/5"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img 
                src={sorobanaImg} 
                alt="Sorobana" 
                className="w-12 h-16 object-cover object-top scale-125 translate-y-2 pointer-events-none" 
                draggable={false}
              />
            </motion.div>
            
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 relative backdrop-blur-sm">
              <p className={`text-xs text-white/90 font-body leading-relaxed ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
                {isRegister
                  ? pickLang({ ar: 'أهلاً بك! أنشئ حسابك لنبدأ رحلة الإبداع في السوروبان معاً.', en: 'Welcome! Create your account to start Soroban together.' }, lang)
                  : pickLang({ ar: 'مرحباً مجدداً! جاهز لتحطيم أرقام قياسية جديدة اليوم؟', en: 'Welcome back! Ready to break new records today?' }, lang)}
              </p>
            </div>
          </div>

          {/* 🎯 مؤشر الاتصال الفخم والمطوّر */}
          <div className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium mx-auto w-fit mb-5 shadow-sm transition-all duration-300 relative z-10 ${
            isChecking
              ? 'border-amber-500/30 bg-amber-950/40 text-amber-300 shadow-amber-900/20'
              : isOnline
                ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300 shadow-emerald-900/20'
                : 'border-rose-500/30 bg-rose-950/40 text-rose-300 shadow-rose-900/20'
          }`}>
            {isChecking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10 opacity-90" />
            ) : isOnline ? (
              <Wifi className="w-3.5 h-3.5 relative z-10 opacity-90" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 relative z-10 opacity-90" />
            )}

            <span className="relative z-10 tracking-wide font-bold">
              {isChecking
                ? pickLang({ ar: 'جاري التحقق...', en: 'Checking...' }, lang)
                : isOnline
                  ? pickLang({ ar: 'متصل بخوادم التقييم', en: 'Connected to servers' }, lang)
                  : pickLang({ ar: 'غير متصل بالإنترنت', en: 'Offline' }, lang)}
            </span>

            <span className="relative flex h-2 w-2 z-10">
              {isChecking ? (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
              ) : isOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
              )}
            </span>
          </div>

          <div className="text-center mb-5 relative z-10">
            <h3 className="text-2xl font-black font-display text-white tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {isRegister
                ? pickLang({ ar: 'إنشاء حساب جديد', en: 'Create New Account' }, lang)
                : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang)}
            </h3>
            <p className="text-xs text-white/50 font-body mt-1.5 leading-relaxed px-2">
              {pickLang({ 
                ar: 'لضمان تجربة تعليمية آمنة، نحتاج اسم الطالب واسم ولي الأمر. بياناتك محمية تماماً.', 
                en: 'To ensure a safe learning experience, we need student & parent names. Data is fully secure.' 
              }, lang)}
            </p>
          </div>

          {!isOnline && !isChecking && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 relative z-10 backdrop-blur-sm"
            >
              <p className="text-xs text-amber-200 font-body leading-relaxed text-center">
                {pickLang({ 
                  ar: '📶 يبدو أنك غير متصل حالياً. يمكنك المحاولة وسيتم الفحص عند الضغط على الزر.', 
                  en: '📶 You seem offline. You can try and it will check upon clicking.' 
                }, lang)}
              </p>
            </motion.div>
          )}

          <div className="space-y-3 relative z-10">
            <div className="relative group">
              <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
              <input
                type="email"
                placeholder={pickLang({ ar: 'البريد الإلكتروني', en: 'Email' }, lang)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition-all text-sm shadow-inner"
                dir="ltr"
              />
            </div>

            <div className="relative group">
              <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
              <input
                type="password"
                placeholder={pickLang({ ar: 'كلمة المرور (6+ خانات)', en: 'Password (6+ chars)' }, lang)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition-all text-sm shadow-inner"
                dir="ltr"
              />
            </div>

            {isRegister && (
              <>
                <div className="relative group">
                  <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type="text"
                    placeholder={pickLang({ ar: 'اسم ولي الأمر', en: 'Parent Name' }, lang)}
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition-all text-sm shadow-inner"
                  />
                </div>

                <div className="relative group">
                  <Baby className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    type="text"
                    placeholder={pickLang({ ar: 'اسم الطفل الثلاثي', en: 'Child Full Name (3 words)' }, lang)}
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition-all text-sm shadow-inner"
                  />
                </div>
              </>
            )}
          </div>

          {msg && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-4 p-3 rounded-2xl border text-xs sm:text-sm flex items-center gap-2.5 relative z-10 backdrop-blur-md ${
                msg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-500/5'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-lg shadow-rose-500/5'
              }`}
            >
              {msg.type === 'success'
                ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              <span className="leading-relaxed font-medium">{msg.text}</span>
            </motion.div>
          )}

          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 text-white font-bold text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRegister ? (
              <UserPlus className="w-5 h-5" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span>
              {loading
                ? pickLang({ ar: 'جاري المعالجة...', en: 'Processing...' }, lang)
                : isRegister
                  ? pickLang({ ar: 'إنشاء حساب', en: 'Register' }, lang)
                  : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang)}
            </span>
          </motion.button>

          <button
            type="button"
            onClick={toggleMode}
            className="w-full text-center text-xs text-amber-200/70 hover:text-amber-300 mt-5 transition relative z-10 font-medium py-1"
          >
            {isRegister
              ? pickLang({ ar: 'لديك حساب بالفعل؟ سجّل الدخول', en: 'Already have an account? Login' }, lang)
              : pickLang({ ar: 'ليس لديك حساب بعد؟ أنشئ حساباً جديداً', en: "Don't have an account? Register" }, lang)}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthModal;