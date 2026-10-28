import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Mail, KeyRound, User, Baby, LogIn, UserPlus, 
  Loader2, AlertCircle, CheckCircle2, Wifi, WifiOff 
} from 'lucide-react';

import { useT } from '../i18n/useTranslation';
import { pickLang } from '../i18n/pickLang';
import { cloudSync } from '../lib/cloudSync';
import { supabaseUrl, supabaseKey } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { lang } = useT();

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
    return errorMsg; // إذا لم نجد ترجمة، نعرض الخطأ الأصلي
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
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7 ثواني مهلة

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
      // 1. محاولة الدخول الفعلية (هذا هو الفحص الحقيقي)
      if (isRegister) {
        await cloudSync.registerParent(email, password, parentName, childName);
        showMsg(pickLang({ ar: 'تم إنشاء الحساب بنجاح!', en: 'Account created successfully!' }, lang), 'success');
      } else {
        await cloudSync.loginParent(email, password);
        showMsg(pickLang({ ar: 'تم تسجيل الدخول!', en: 'Logged in successfully!' }, lang), 'success');
      }
      
      // إذا نجح الدخول، تأكد من تحويل المؤشر إلى أخضر (لأن الفحص المسبق ربما فشل)
      if (isMounted.current) setIsOnline(true);
      
      setTimeout(() => {
        if (isMounted.current) onSuccess();
      }, 1200);

    } catch (e: any) {
      // 2. في حال الفشل، ترجمة الخطأ وعرضه
      const friendlyMsg = getFriendlyError(e.message || 'Unknown error');
      showMsg(friendlyMsg, 'error');
      
      // إذا كان الخطأ بسبب الشبكة، قم بتحديث المؤشر إلى أحمر
      if (e.message?.toLowerCase().includes('fetch') || e.message?.toLowerCase().includes('network')) {
        if (isMounted.current) setIsOnline(false);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // تنظيف الرسائل عند التبديل بين الدخول والإنشاء
  const toggleMode = () => {
    setIsRegister(!isRegister);
    setMsg(null);
    setPassword(''); // مسح كلمة المرور لأسباب أمنية
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className="relative w-full max-w-md my-auto"
      >
        <div className="bg-[#0c0c0e] p-6 sm:p-8 border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/90">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 🎯 مؤشر الاتصال الفخم */}
          <div className={`group relative flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs font-medium mx-auto w-fit mb-4 shadow-sm transition-all duration-300 relative z-10 ${
            isChecking
              ? 'border-amber-500/20 bg-amber-950/30 text-amber-400 shadow-amber-900/20 hover:border-amber-500/40'
              : isOnline
                ? 'border-emerald-500/20 bg-emerald-950/30 text-emerald-400 shadow-emerald-900/20 hover:border-emerald-500/40'
                : 'border-red-500/20 bg-red-950/30 text-red-400 shadow-red-900/20 hover:border-red-500/40'
          }`}>
            <div className={`absolute inset-0 rounded-full blur-sm transition-opacity ${
              isChecking ? 'bg-amber-500/5 group-hover:bg-amber-500/10' : isOnline ? 'bg-emerald-500/5 group-hover:bg-emerald-500/10' : 'bg-red-500/5 group-hover:bg-red-500/10'
            }`} />

            {isChecking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10 opacity-90" />
            ) : isOnline ? (
              <Wifi className="w-3.5 h-3.5 relative z-10 opacity-90" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 relative z-10 opacity-90" />
            )}

            <span className="relative z-10 tracking-wide">
              {isChecking
                ? pickLang({ ar: 'جاري التحقق...', en: 'Checking...' }, lang)
                : isOnline
                  ? pickLang({ ar: 'متصل بخوادم التقييم', en: 'Connected to servers' }, lang)
                  : pickLang({ ar: 'غير متصل بالإنترنت', en: 'Offline' }, lang)}
            </span>

            <span className="relative flex h-2 w-2 z-10">
              {isChecking ? (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
              ) : isOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              )}
            </span>
          </div>

          <div className="text-center mb-6 relative z-10">
            <h3 className="text-2xl font-extrabold font-display text-white">
              {isRegister
                ? pickLang({ ar: 'إنشاء حساب جديد', en: 'Create New Account' }, lang)
                : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang)}
            </h3>
            <p className="text-xs text-white/60 font-body mt-2 leading-relaxed px-4">
              {pickLang({ 
                ar: 'لضمان تجربة تعليمية آمنة، نحتاج اسم الطالب واسم ولي الأمر. بياناتك محمية ولا يراها أحد سواك.', 
                en: 'To ensure a safe learning experience, we need the student\'s name and parent\'s name. Your data is protected and only visible to you.' 
              }, lang)}
            </p>
          </div>

          {!isOnline && !isChecking && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 relative z-10"
            >
              <p className="text-xs text-amber-200 font-body leading-relaxed text-center">
                {pickLang({ 
                  ar: '📶 يبدو أنك غير متصل. يمكنك المحاولة، وسيتم الفحص عند الضغط على الزر.', 
                  en: '📶 It seems you are offline. You can try, and it will be checked when you click the button.' 
                }, lang)}
              </p>
            </motion.div>
          )}

          <div className="space-y-3 relative z-10">
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                placeholder={pickLang({ ar: 'البريد الإلكتروني', en: 'Email' }, lang)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition"
                dir="ltr"
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                placeholder={pickLang({ ar: 'كلمة المرور (6+ خانات)', en: 'Password (6+ chars)' }, lang)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition"
                dir="ltr"
              />
            </div>

            {isRegister && (
              <>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder={pickLang({ ar: 'اسم ولي الأمر', en: 'Parent Name' }, lang)}
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>

                <div className="relative">
                  <Baby className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder={pickLang({ ar: 'اسم الطفل الثلاثي', en: 'Child Full Name (3 words)' }, lang)}
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
              </>
            )}
          </div>

          {msg && (
            <div className={`mt-4 p-3 rounded-xl border text-sm flex items-center gap-2 relative z-10 ${
              msg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              {msg.type === 'success'
                ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                : <AlertCircle className="w-4 h-4 shrink-0" />}
              {msg.text}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading} // ✅ الزر مفعل دائماً إلا إذا كان جاري الإرسال
            className="btn-primary w-full !py-3.5 mt-6 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRegister ? (
              <UserPlus className="w-5 h-5" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {loading
              ? pickLang({ ar: 'جاري المعالجة...', en: 'Processing...' }, lang)
              : isRegister
                ? pickLang({ ar: 'إنشاء حساب', en: 'Register' }, lang)
                : pickLang({ ar: 'دخول', en: 'Login' }, lang)}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="w-full text-center text-xs text-purple-300 hover:text-purple-200 mt-4 transition relative z-10"
          >
            {isRegister
              ? pickLang({ ar: 'لديك حساب؟ سجّل الدخول', en: 'Have an account? Login' }, lang)
              : pickLang({ ar: 'ليس لديك حساب؟ أنشئ حساباً', en: "Don't have an account? Register" }, lang)}
          </button>
        </div>
      </motion.div>
    </div>
  );
}