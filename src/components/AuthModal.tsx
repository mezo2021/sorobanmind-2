// src/components/AuthModal.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Mail, KeyRound, User, Baby, LogIn, UserPlus, 
  Loader2, AlertCircle, CheckCircle2, Wifi, WifiOff, Sparkles,
  ShieldCheck, Calendar
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

export interface ParentalConsent {
  childAge: number;
  agreedGuardian: boolean;
  agreedData: boolean;
  agreedPrivacy: boolean;
  timestamp: string;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { lang, dir } = useT();

  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  
  const [childAge, setChildAge] = useState('');
  const [agreeGuardian, setAgreeGuardian] = useState(false);
  const [agreeData, setAgreeData] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [awaitingVerification, setAwaitingVerification] = useState(false); // 🆕 حالة التحقق

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isChecking, setIsChecking] = useState<boolean>(true);

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

  const getFriendlyError = (errorMsg: string): string => {
    const msg = errorMsg.toLowerCase();
    if (msg.includes('invalid login credentials')) return pickLang({ ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', en: 'Invalid email or password.' }, lang);
    if (msg.includes('user already registered')) return pickLang({ ar: 'هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول.', en: 'Email already registered. You can login.' }, lang);
    if (msg.includes('password should be at least')) return pickLang({ ar: 'كلمة المرور قصيرة جداً (6 خانات على الأقل).', en: 'Password is too short (minimum 6 characters).' }, lang);
    if (msg.includes('email not confirmed')) return pickLang({ ar: 'يرجى تأكيد بريدك الإلكتروني أولاً من خلال الرسالة المرسلة إليك.', en: 'Please confirm your email first.' }, lang);
    if (msg.includes('failed to fetch') || msg.includes('network')) return pickLang({ ar: 'تعذر الاتصال بالخادم. يرجى التحقق من الشبكة.', en: 'Failed to connect to server. Check network.' }, lang);
    return errorMsg;
  };

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) { if (isMounted.current) { setIsOnline(false); setIsChecking(false); } return false; }
    if (isMounted.current) setIsChecking(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, { method: 'HEAD', headers: { apikey: supabaseKey }, cache: 'no-store', signal: controller.signal });
      const isValid = response.status < 500;
      if (isMounted.current) setIsOnline(isValid);
      return isValid;
    } catch { if (isMounted.current) setIsOnline(false); return false; } 
    finally { clearTimeout(timeoutId); if (isMounted.current) setIsChecking(false); }
  }, []);

  useEffect(() => {
    checkConnection();
    const handleOnline = () => void checkConnection();
    const handleOffline = () => { if (isMounted.current) { setIsOnline(false); setIsChecking(false); } };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, [checkConnection]);

  const validate = (): string | null => {
    if (!email || !email.includes('@')) return pickLang({ ar: 'يرجى إدخال بريد إلكتروني صحيح', en: 'Please enter a valid email' }, lang);
    if (!password || password.length < 6) return pickLang({ ar: 'كلمة المرور يجب أن تكون 6 خانات على الأقل', en: 'Password must be at least 6 characters' }, lang);
    if (!/^[A-Za-z0-9]+$/.test(password)) return pickLang({ ar: 'كلمة المرور بالأحرف الإنجليزية والأرقام فقط', en: 'Password must be English letters and numbers only' }, lang);
    
    if (isRegister) {
      if (!parentName.trim()) return pickLang({ ar: 'يرجى إدخال اسم ولي الأمر', en: 'Please enter parent name' }, lang);
      if (childName.trim().split(/\s+/).length !== 3) return pickLang({ ar: 'اسم الطفل يجب أن يكون ثلاثياً (3 كلمات)', en: 'Child name must be exactly 3 words' }, lang);
      const ageNum = parseInt(childAge, 10);
      if (!childAge || isNaN(ageNum) || ageNum < 3 || ageNum > 18) return pickLang({ ar: 'يرجى إدخال عمر الطفل (بين 3 و 18 سنة)', en: 'Please enter a valid child age (3-18 years)' }, lang);
      if (!agreeGuardian || !agreeData || !agreePrivacy) return pickLang({ ar: 'يجب الموافقة على جميع الشروط للمتابعة.', en: 'You must agree to all terms to continue.' }, lang);
    }
    return null;
  };

  const handleSubmit = async () => {
    if (loading) return;
    const err = validate();
    if (err) { showMsg(err, 'error'); return; }

    setLoading(true);
    if (msg) setMsg(null);

    try {
      if (isRegister) {
        const consent: ParentalConsent = {
          childAge: parseInt(childAge, 10),
          agreedGuardian: agreeGuardian,
          agreedData: agreeData,
          agreedPrivacy: agreePrivacy,
          timestamp: new Date().toISOString(),
        };

        const result = await cloudSync.registerParent(email, password, parentName, childName, consent);
        
        // 🆕 فحص إذا كان يحتاج لتفعيل البريد
        if (!result.session) {
          setAwaitingVerification(true);
          setLoading(false);
          return;
        }
        
        showMsg(pickLang({ ar: 'تم إنشاء الحساب بنجاح!', en: 'Account created successfully!' }, lang), 'success');
      } else {
        await cloudSync.loginParent(email, password);
        showMsg(pickLang({ ar: 'تم تسجيل الدخول!', en: 'Logged in successfully!' }, lang), 'success');
      }
      
      if (isMounted.current) setIsOnline(true);
      setTimeout(() => { if (isMounted.current) onSuccess(); }, 1200);

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
    setAwaitingVerification(false); // إعادة تصفير الحالة
  };

  // 🆕 شاشة انتظار تفعيل البريد
  if (awaitingVerification) {
    return (
      <div dir={dir} className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md bg-[#0c0c0e]/95 p-8 border border-emerald-500/30 rounded-3xl text-center shadow-2xl relative">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-24 h-24 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <Mail className="w-12 h-12 text-emerald-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            {pickLang({ ar: 'تحقق من بريدك الإلكتروني', en: 'Check your email' }, lang)}
          </h3>
          
          <p className="text-sm text-slate-300 mb-8 leading-relaxed">
            {pickLang({ 
              ar: `أرسلنا رابط تفعيل إلى بريدك:`, 
              en: `We sent a verification link to:` 
            }, lang)}
            <br/>
            <span className="font-bold text-amber-300 font-mono text-base mt-2 block">{email}</span>
          </p>
          
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 mb-8 text-xs text-slate-400">
            {pickLang({ 
              ar: 'يرجى الضغط على الرابط في البريد لتفعيل حساب طفلك. بعد التفعيل، يمكنك العودة هنا وتسجيل الدخول.', 
              en: "Please click the link in the email to activate your child's account. After verification, you can return here to login." 
            }, lang)}
          </div>

          <button onClick={toggleMode} className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-600 transition">
            {pickLang({ ar: 'العودة لتسجيل الدخول', en: 'Back to Login' }, lang)}
          </button>
        </motion.div>
      </div>
    );
  }

  // الشاشة الأصلية
  return (
    <div dir={dir} className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 250, damping: 25 }} className="relative w-full max-w-md my-auto">
        <div className="bg-[#0c0c0e]/95 p-6 sm:p-8 border border-amber-500/20 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/90">
          
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <button onClick={onClose} className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition z-30 border border-white/5 backdrop-blur-md">
            <X className="w-5 h-5" />
          </button>

          <div className={`flex items-center gap-3 mb-5 mt-6 px-2 relative z-10 ${dir === 'ltr' ? 'flex-row-reverse' : 'flex-row'}`}>
            <motion.div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-amber-500/5" animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
              <img src={sorobanaImg} alt="Sorobana" className="w-12 h-16 object-cover object-top scale-125 translate-y-2 pointer-events-none" draggable={false} />
            </motion.div>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 relative backdrop-blur-sm">
              <p className={`text-xs text-white/90 font-body leading-relaxed ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
                {isRegister ? pickLang({ ar: 'أهلاً بك! أنشئ حسابك لنبدأ رحلة الإبداع في السوروبان معاً.', en: 'Welcome! Create your account to start Soroban together.' }, lang) : pickLang({ ar: 'مرحباً مجدداً! جاهز لتحطيم أرقام قياسية جديدة اليوم؟', en: 'Welcome back! Ready to break new records today?' }, lang)}
              </p>
            </div>
          </div>

          <div className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium mx-auto w-fit mb-5 shadow-sm transition-all duration-300 relative z-10 ${isChecking ? 'border-amber-500/30 bg-amber-950/40 text-amber-300' : isOnline ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300' : 'border-rose-500/30 bg-rose-950/40 text-rose-300'}`}>
            {isChecking ? <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10 opacity-90" /> : isOnline ? <Wifi className="w-3.5 h-3.5 relative z-10 opacity-90" /> : <WifiOff className="w-3.5 h-3.5 relative z-10 opacity-90" />}
            <span className="relative z-10 tracking-wide font-bold">
              {isChecking ? pickLang({ ar: 'جاري التحقق...', en: 'Checking...' }, lang) : isOnline ? pickLang({ ar: 'متصل بخوادم التقييم', en: 'Connected to servers' }, lang) : pickLang({ ar: 'غير متصل بالإنترنت', en: 'Offline' }, lang)}
            </span>
          </div>

          <div className="text-center mb-5 relative z-10">
            <h3 className="text-2xl font-black font-display text-white tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {isRegister ? pickLang({ ar: 'إنشاء حساب جديد', en: 'Create New Account' }, lang) : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang)}
            </h3>
            <p className="text-xs text-white/50 font-body mt-1.5 leading-relaxed px-2">
              {pickLang({ ar: 'لضمان تجربة تعليمية آمنة، نحتاج اسم الطالب واسم ولي الأمر. بياناتك محمية تماماً.', en: 'To ensure a safe learning experience, we need student & parent names. Data is fully secure.' }, lang)}
            </p>
          </div>

          {!isOnline && !isChecking && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 relative z-10 backdrop-blur-sm">
              <p className="text-xs text-amber-200 font-body leading-relaxed text-center">
                {pickLang({ ar: '📶 يبدو أنك غير متصل حالياً. يمكنك المحاولة وسيتم الفحص عند الضغط على الزر.', en: '📶 You seem offline. You can try and it will check upon clicking.' }, lang)}
              </p>
            </motion.div>
          )}

          <div className="space-y-3 relative z-10">
            <div className="relative group">
              <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
              <input type="email" placeholder={pickLang({ ar: 'البريد الإلكتروني', en: 'Email' }, lang)} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition-all text-sm shadow-inner" dir="ltr" />
            </div>

            <div className="relative group">
              <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
              <input type="password" placeholder={pickLang({ ar: 'كلمة المرور (6+ خانات)', en: 'Password (6+ chars)' }, lang)} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition-all text-sm shadow-inner" dir="ltr" />
            </div>

            {isRegister && (
              <>
                <div className="relative group">
                  <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
                  <input type="text" placeholder={pickLang({ ar: 'اسم ولي الأمر', en: 'Parent Name' }, lang)} value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition-all text-sm shadow-inner" />
                </div>

                <div className="relative group">
                  <Baby className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
                  <input type="text" placeholder={pickLang({ ar: 'اسم الطفل الثلاثي', en: 'Child Full Name (3 words)' }, lang)} value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition-all text-sm shadow-inner" />
                </div>

                <div className="relative group">
                  <Calendar className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
                  <input type="number" min="3" max="18" placeholder={pickLang({ ar: 'عمر الطفل (3-18)', en: 'Child Age (3-18)' }, lang)} value={childAge} onChange={(e) => setChildAge(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition-all text-sm shadow-inner" dir="ltr" />
                </div>

                <div className="mt-4 space-y-3 p-4 bg-black/40 border border-white/10 rounded-2xl shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 start-0 w-1 h-full bg-amber-500/50 rounded-full" />
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">{pickLang({ ar: 'الموافقة الأبوية (إلزامي)', en: 'Parental Consent (Required)' }, lang)}</span>
                  </div>
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={agreeGuardian} onChange={(e) => setAgreeGuardian(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                    <span className="text-[11px] text-white/70 leading-relaxed font-body group-hover:text-white/90 transition">{pickLang({ ar: 'أقر بأنني ولي أمر هذا الطفل، وعمري 18 عاماً أو أكثر.', en: 'I confirm I am the guardian of this child and I am 18 or older.' }, lang)}</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={agreeData} onChange={(e) => setAgreeData(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                    <span className="text-[11px] text-white/70 leading-relaxed font-body group-hover:text-white/90 transition">{pickLang({ ar: 'أوافق على جمع اسم طفلي ونتائجه داخل التطبيق لأغراض تعليمية بحتة.', en: "I agree to collect my child's name and results for educational purposes only." }, lang)}</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                    <span className="text-[11px] text-white/70 leading-relaxed font-body group-hover:text-white/90 transition">{pickLang({ ar: 'أوافق على سياسة الخصوصية وشروط الاستخدام.', en: 'I agree to the Privacy Policy and Terms of Service.' }, lang)}</span>
                  </label>
                </div>
              </>
            )}
          </div>

          {msg && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`mt-4 p-3 rounded-2xl border text-xs sm:text-sm flex items-center gap-2.5 relative z-10 backdrop-blur-md ${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
              {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              <span className="leading-relaxed font-medium">{msg.text}</span>
            </motion.div>
          )}

          <motion.button type="button" onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 text-white font-bold text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            <span>{loading ? pickLang({ ar: 'جاري المعالجة...', en: 'Processing...' }, lang) : isRegister ? pickLang({ ar: 'إنشاء حساب', en: 'Register' }, lang) : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang)}</span>
          </motion.button>

          <button type="button" onClick={toggleMode} className="w-full text-center text-xs text-amber-200/70 hover:text-amber-300 mt-5 transition relative z-10 font-medium py-1">
            {isRegister ? pickLang({ ar: 'لديك حساب بالفعل؟ سجّل الدخول', en: 'Already have an account? Login' }, lang) : pickLang({ ar: 'ليس لديك حساب بعد؟ أنشئ حساباً جديداً', en: "Don't have an account? Register" }, lang)}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthModal;