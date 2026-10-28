import { useState, useEffect, useCallback } from 'react';
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
  
  // حالات الاتصال
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  // دالة الفحص الحقيقية للإنترنت (Ping to Supabase)
  const checkConnection = useCallback(async (): Promise<boolean> => {
    // إذا كان المتصفح يعرف مسبقاً أن هناك انقطاعاً، لا داعي للطلب
    if (!navigator.onLine) {
      setIsOnline(false);
      setIsChecking(false);
      return false;
    }

    setIsChecking(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const url = `${supabaseUrl}/auth/v1/health`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { apikey: supabaseKey },
        cache: 'no-store',
        signal: controller.signal,
      });

      const body = await response.json();
      
      // التحقق من هوية الرد (GoTrue هو خادم المصادقة في Supabase)
      const isValid = response.ok && body?.name === 'GoTrue';
      setIsOnline(isValid);
      return isValid;
    } catch (error) {
      // أي خطأ (شبكة، timeout، أو رد غير متوقع)
      setIsOnline(false);
      return false;
    } finally {
      clearTimeout(timeoutId);
      setIsChecking(false);
    }
  }, []);

  // فحص أولي عند فتح الشاشة + الاستماع لأحداث المتصفح
  useEffect(() => {
    checkConnection();

    const handleOnline = () => void checkConnection();
    const handleOffline = () => {
      setIsOnline(false);
      setIsChecking(false);
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
    if (isChecking) return;

    // 1. الفحص النهائي قبل إرسال أي طلب (حاجز الأمان)
    const reachable = await checkConnection();
    if (!reachable) {
      showMsg(pickLang({ ar: '❌ لا يوجد اتصال. يرجى التحقق من الشبكة والمحاولة مرة أخرى.', en: '❌ No connection. Please check your network and try again.' }, lang), 'error');
      return;
    }

    const err = validate();
    if (err) {
      showMsg(err, 'error');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await cloudSync.registerParent(email, password, parentName, childName);
        showMsg(pickLang({ ar: 'تم إنشاء الحساب بنجاح!', en: 'Account created successfully!' }, lang), 'success');
      } else {
        await cloudSync.loginParent(email, password);
        showMsg(pickLang({ ar: 'تم تسجيل الدخول!', en: 'Logged in successfully!' }, lang), 'success');
      }
      setTimeout(() => onSuccess(), 1200);
    } catch (e: any) {
      // التعامل مع أخطاء الشبكة المحتملة إذا انقطع الاتصال بعد الفحص
      const errorMsg = e.message?.toLowerCase().includes('network') || e.message?.toLowerCase().includes('fetch')
        ? pickLang({ ar: '❌ لا يوجد اتصال. يرجى التحقق من الشبكة والمحاولة مرة أخرى.', en: '❌ No connection. Please check your network and try again.' }, lang)
        : e.message;
      showMsg(errorMsg, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className="relative w-full max-w-md my-auto"
      >
        {/* خلفية صلبة "أسود فحمي" */}
        <div className="bg-[#0c0c0e] p-6 sm:p-8 border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/90">
          {/* لمسة فخامة (توهج بنفسجي خافت) */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 🎯 مؤشر الاتصال الفخم (المعدل بثلاث حالات) */}
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

          {/* رسالة استباقية عند انقطاع الإنترنت */}
          {!isOnline && !isChecking && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 relative z-10"
            >
              <p className="text-xs text-amber-200 font-body leading-relaxed text-center">
                {pickLang({ 
                  ar: '📶 يبدو أنك غير متصل. يرجى الاتصال بالإنترنت لإنشاء حسابك. بعدها، ستعمل جميع الدروس والألعاب بدون إنترنت.', 
                  en: '📶 It seems you are offline. Please connect to the internet to create your account. After that, all lessons and games will work offline.' 
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
            disabled={loading || isChecking || !isOnline}
            className="btn-primary w-full !py-3.5 mt-6 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRegister ? (
              <UserPlus className="w-5 h-5" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {isChecking
              ? pickLang({ ar: 'جاري التحقق...', en: 'Checking...' }, lang)
              : !isOnline
                ? pickLang({ ar: 'لا يوجد اتصال', en: 'No connection' }, lang)
                : isRegister
                  ? pickLang({ ar: 'إنشاء حساب', en: 'Register' }, lang)
                  : pickLang({ ar: 'دخول', en: 'Login' }, lang)}
          </button>

          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
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