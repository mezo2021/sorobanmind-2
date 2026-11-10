// src/components/AuthModal.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Mail, KeyRound, LogIn, UserPlus, 
  Loader2, AlertCircle, CheckCircle2, Wifi, WifiOff, Sparkles,
  ShieldCheck, ShieldAlert, Pencil
} from 'lucide-react';

import { useT } from '../i18n/useTranslation';
import { pickLang } from '../i18n/pickLang';
import { cloudSync } from '../lib/cloudSync';
import { supabaseUrl, supabaseKey } from '../lib/supabase';
import sorobanaImg from '@/assets/sorobana/sorobana-teaching-pointing.webp';
import { toLatinDigits } from '@/utils/numberStyle';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export interface ParentalConsent {
  childAge?: number;
  agreedGuardian: boolean;
  agreedData?: boolean;
  agreedPrivacy: boolean;
  agreedLeaderboard?: boolean;
  timestamp: string;
}

type AuthStep = 'form' | 'signup-otp' | 'forgot-email' | 'forgot-otp' | 'reset-password';

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { lang, dir } = useT();

  const [isRegister, setIsRegister] = useState(true);
  const [step, setStep] = useState<AuthStep>('form');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 🆕 الموافقات
  const [agreeGuardian, setAgreeGuardian] = useState(false);
  const [agreeData, setAgreeData] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeLeaderboard, setAgreeLeaderboard] = useState(false);

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

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
    setTimeout(() => { if (isMounted.current) setMsg(null); }, 5000);
  };

  const getFriendlyError = (errorMsg: string): string => {
    const msg = errorMsg.toLowerCase();
    if (msg.includes('invalid login credentials')) return pickLang({ ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', en: 'Invalid email or password.' }, lang);
    if (msg.includes('user already registered')) return pickLang({ ar: 'هذا البريد مسجل بالفعل. يمكنك تسجيل الدخول.', en: 'Email already registered. You can login.' }, lang);
    if (msg.includes('password should be at least')) return pickLang({ ar: 'كلمة المرور قصيرة جداً (6 خانات على الأقل).', en: 'Password too short (min 6 characters).' }, lang);
    if (msg.includes('email not confirmed')) return pickLang({ ar: 'يرجى تأكيد بريدك الإلكتروني أولاً.', en: 'Please confirm your email first.' }, lang);
    if (msg.includes('invalid otp') || msg.includes('token has expired')) return pickLang({ ar: 'الرمز غير صحيح أو انتهت صلاحيته.', en: 'Invalid or expired code.' }, lang);
    if (msg.includes('rate limit') || msg.includes('security purposes')) return pickLang({ ar: 'محاولات كثيرة، انتظر دقيقة ثم أعد المحاولة.', en: 'Too many attempts, wait a minute.' }, lang);
    if (msg.includes('failed to fetch') || msg.includes('network')) return pickLang({ ar: 'تعذر الاتصال بالخادم. تحقق من الشبكة.', en: 'Network error. Check connection.' }, lang);
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

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateForm = (): string | null => {
    if (!email || !email.includes('@')) return pickLang({ ar: 'يرجى إدخال بريد إلكتروني صحيح', en: 'Please enter a valid email' }, lang);
    if (step === 'forgot-email') return null;
    
    if (!password || password.length < 6) return pickLang({ ar: 'كلمة المرور يجب أن تكون 6 خانات على الأقل', en: 'Password must be at least 6 characters' }, lang);
    if (!/^[A-Za-z0-9]+$/.test(password)) return pickLang({ ar: 'كلمة المرور بالأحرف الإنجليزية والأرقام فقط', en: 'Password must be English letters and numbers only' }, lang);
    
    if (isRegister) {
      // 🆕 الموافقات
      if (!agreeGuardian || !agreeData || !agreePrivacy) {
        return pickLang({ ar: 'يجب الموافقة على شروط الأهلية وجمع البيانات وسياسة الخصوصية', en: 'You must agree to guardian, data collection, and privacy terms' }, lang);
      }
    }
    return null;
  };

  const handleRegister = async () => {
    const err = validateForm();
    if (err) { showMsg(err, 'error'); return; }

    setLoading(true); setMsg(null);
    try {
      const consent: ParentalConsent = {
        agreedGuardian: agreeGuardian,
        agreedData: agreeData,
        agreedPrivacy: agreePrivacy,
        agreedLeaderboard: agreeLeaderboard,
        timestamp: new Date().toISOString(),
      };
      // ✅ الآن 3 أرجومنتات فقط
      await cloudSync.registerParent(email, password, consent);
      
      setStep('signup-otp');
      setResendTimer(60);
      showMsg(pickLang({ ar: 'تم إنشاء الحساب! يرجى إدخال الرمز المرسل لبريدك.', en: 'Account created! Please enter the code sent to your email.' }, lang), 'success');
    } catch (e: any) {
      showMsg(getFriendlyError(e.message), 'error');
    } finally { setLoading(false); }
  };

  const handleVerifySignup = async () => {
    if (otp.length < 6) { showMsg(pickLang({ ar: 'أدخل رمزاً مكوناً من 6 أرقام', en: 'Enter a 6-digit code' }, lang), 'error'); return; }
    setLoading(true); setMsg(null);
    try {
      await cloudSync.verifyOtp(email, otp, 'signup');
      showMsg(pickLang({ ar: 'تم تفعيل الحساب بنجاح!', en: 'Account verified successfully!' }, lang), 'success');
      setTimeout(() => onSuccess(), 1500);
    } catch (e: any) {
      showMsg(getFriendlyError(e.message), 'error');
    } finally { setLoading(false); }
  };

  const handleLogin = async () => {
    const err = validateForm();
    if (err) { showMsg(err, 'error'); return; }

    setLoading(true); setMsg(null);
    try {
      await cloudSync.loginParent(email, password);
      showMsg(pickLang({ ar: 'تم تسجيل الدخول!', en: 'Logged in successfully!' }, lang), 'success');
      setTimeout(() => onSuccess(), 1000);
    } catch (e: any) {
      const errMsg = e.message.toLowerCase();
      
      if (errMsg.includes('email not confirmed')) {
        try {
          await cloudSync.resendOtp(email, 'signup');
          setStep('signup-otp');
          setResendTimer(60);
          showMsg(pickLang({ ar: 'يرجى تأكيد بريدك. أعدنا إرسال الرمز إليك.', en: 'Please confirm your email. We resent the code.' }, lang), 'success');
        } catch (resendErr: any) {
          showMsg(getFriendlyError(resendErr.message), 'error');
        }
      } else {
        showMsg(getFriendlyError(e.message), 'error');
      }
    } finally { setLoading(false); }
  };

  const handleRequestReset = async () => {
    const err = validateForm();
    if (err) { showMsg(err, 'error'); return; }

    setLoading(true); setMsg(null);
    try {
      await cloudSync.requestPasswordReset(email);
      setStep('forgot-otp');
      setResendTimer(60);
      showMsg(pickLang({ ar: 'تم إرسال رمز الاستعادة إلى بريدك.', en: 'Recovery code sent to your email.' }, lang), 'success');
    } catch (e: any) {
      showMsg(getFriendlyError(e.message), 'error');
    } finally { setLoading(false); }
  };

  const handleVerifyRecovery = async () => {
    if (otp.length < 6) { showMsg(pickLang({ ar: 'أدخل رمزاً مكوناً من 6 أرقام', en: 'Enter a 6-digit code' }, lang), 'error'); return; }
    setLoading(true); setMsg(null);
    try {
      await cloudSync.verifyOtp(email, otp, 'recovery');
      setStep('reset-password');
    } catch (e: any) {
      showMsg(getFriendlyError(e.message), 'error');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) { showMsg(pickLang({ ar: 'كلمة المرور يجب أن تكون 6 خانات على الأقل', en: 'Password must be at least 6 characters' }, lang), 'error'); return; }
    if (newPassword !== confirmNewPassword) { showMsg(pickLang({ ar: 'كلمتا المرور غير متطابقتين', en: 'Passwords do not match' }, lang), 'error'); return; }
    
    setLoading(true); setMsg(null);
    try {
      await cloudSync.updatePassword(newPassword);
      showMsg(pickLang({ ar: 'تم تحديث كلمة المرور بنجاح!', en: 'Password updated successfully!' }, lang), 'success');
      setTimeout(() => onSuccess(), 1500);
    } catch (e: any) {
      showMsg(getFriendlyError(e.message), 'error');
    } finally { setLoading(false); }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      if (step === 'signup-otp') {
        await cloudSync.resendOtp(email, 'signup');
      } else {
        await cloudSync.requestPasswordReset(email);
      }
      setResendTimer(60);
      showMsg(pickLang({ ar: 'تم إعادة إرسال الرمز.', en: 'Code resent.' }, lang), 'success');
    } catch (e: any) {
      showMsg(getFriendlyError(e.message), 'error');
    } finally { setLoading(false); }
  };

  const handleBack = () => {
    setStep('form');
    setOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setMsg(null);
  };

  const handleEditEmail = () => {
    setStep('form');
    setOtp('');
    setMsg(null);
    setResendTimer(0);
  };

  const handleMainAction = () => {
    if (step === 'signup-otp') return handleVerifySignup();
    if (step === 'forgot-email') return handleRequestReset();
    if (step === 'forgot-otp') return handleVerifyRecovery();
    if (step === 'reset-password') return handleResetPassword();
    if (isRegister) return handleRegister();
    return handleLogin();
  };

  return (
    <div dir={dir} className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-md my-auto">
        <div className="bg-[#0c0c0e]/95 p-6 sm:p-8 border border-amber-500/20 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/90">
          
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <button onClick={onClose} className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition z-30 border border-white/5 backdrop-blur-md">
            <X className="w-5 h-5" />
          </button>

          {step === 'form' && (
            <div className={`flex items-center gap-3 mb-5 mt-6 px-2 relative z-10 ${dir === 'ltr' ? 'flex-row-reverse' : 'flex-row'}`}>
              <motion.div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-lg" animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <img src={sorobanaImg} alt="Sorobana" className="w-12 h-16 object-cover object-top scale-125 translate-y-2 pointer-events-none" draggable={false} />
              </motion.div>
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2 relative backdrop-blur-sm">
                <p className={`text-xs text-white/90 font-body leading-relaxed ${dir === 'ltr' ? 'text-left' : 'text-right'}`}>
                  {isRegister ? pickLang({ ar: 'أهلاً بك! أنشئ حسابك لنبدأ رحلة الإبداع معاً.', en: 'Welcome! Create your account to start.' }, lang) : pickLang({ ar: 'مرحباً مجدداً! جاهز لتحطيم أرقام قياسية؟', en: 'Welcome back! Ready to break records?' }, lang)}
                </p>
              </div>
            </div>
          )}

          <div className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium mx-auto w-fit mb-5 relative z-10 ${isChecking ? 'border-amber-500/30 bg-amber-950/40 text-amber-300' : isOnline ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300' : 'border-rose-500/30 bg-rose-950/40 text-rose-300'}`}>
            {isChecking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="tracking-wide font-bold">{isChecking ? pickLang({ ar: 'جاري التحقق...', en: 'Checking...' }, lang) : isOnline ? pickLang({ ar: 'متصل بخوادم التقييم', en: 'Connected to servers' }, lang) : pickLang({ ar: 'غير متصل بالإنترنت', en: 'Offline' }, lang)}</span>
          </div>

          <div className="text-center mb-5 relative z-10">
            <h3 className="text-2xl font-black font-display text-white flex items-center justify-center gap-2">
              {step === 'form' && <Sparkles className="w-5 h-5 text-amber-400" />}
              {step === 'signup-otp' && <Mail className="w-6 h-6 text-emerald-400" />}
              {step === 'forgot-email' && <ShieldAlert className="w-6 h-6 text-amber-400" />}
              {step === 'forgot-otp' && <KeyRound className="w-6 h-6 text-amber-400" />}
              {step === 'reset-password' && <ShieldCheck className="w-6 h-6 text-emerald-400" />}

              {step === 'form' && (isRegister ? pickLang({ ar: 'إنشاء حساب جديد', en: 'Create New Account' }, lang) : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang))}
              {step === 'signup-otp' && pickLang({ ar: 'تأكيد البريد', en: 'Verify Email' }, lang)}
              {step === 'forgot-email' && pickLang({ ar: 'نسيت كلمة المرور', en: 'Forgot Password' }, lang)}
              {step === 'forgot-otp' && pickLang({ ar: 'أدخل رمز الاستعادة', en: 'Enter Recovery Code' }, lang)}
              {step === 'reset-password' && pickLang({ ar: 'كلمة مرور جديدة', en: 'New Password' }, lang)}
            </h3>
            
            {step !== 'form' && (
              <p className="text-xs text-slate-400 mt-2">
                {pickLang({ ar: `تم الإرسال إلى: ${email}`, en: `Sent to: ${email}` }, lang)}
              </p>
            )}
          </div>

          <div className="space-y-3 relative z-10">
            
            {(step === 'form' || step === 'forgot-email') && (
              <div className="relative group">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400 transition-colors" />
                <input type="email" placeholder={pickLang({ ar: 'البريد الإلكتروني', en: 'Email' }, lang)} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 text-sm" dir="ltr" />
              </div>
            )}

            {step === 'form' && (
              <>
                <div className="relative group">
                  <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-400" />
                  <input type="password" placeholder={pickLang({ ar: 'كلمة المرور', en: 'Password' }, lang)} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 text-sm" dir="ltr" />
                </div>

                {isRegister && (
                  <div className="mt-4 space-y-3 p-4 bg-black/40 border border-white/10 rounded-2xl shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 start-0 w-1 h-full bg-amber-500/50 rounded-full" />
                    
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={agreeGuardian} onChange={(e) => setAgreeGuardian(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500 rounded" />
                      <span className="text-[11px] text-white/70 leading-relaxed">{pickLang({ ar: 'أقر بأنني ولي الأمر (18+).', en: 'I am the guardian (18+).' }, lang)}</span>
                    </label>
                    
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={agreeData} onChange={(e) => setAgreeData(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500 rounded" />
                      <span className="text-[11px] text-white/70 leading-relaxed">{pickLang({ ar: 'أوافق على جمع بيانات طفلي ومعالجتها للأغراض التعليمية.', en: "I agree to collect and process my child's data for educational purposes." }, lang)}</span>
                    </label>
                    
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500 rounded" />
                      <span className="text-[11px] text-white/70 leading-relaxed">{pickLang({ ar: 'أوافق على سياسة الخصوصية.', en: 'I agree to Privacy Policy.' }, lang)}</span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer border-t border-white/10 pt-3 mt-3">
                      <input type="checkbox" checked={agreeLeaderboard} onChange={(e) => setAgreeLeaderboard(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500 rounded" />
                      <span className="text-[11px] text-emerald-200/90 leading-relaxed font-medium">
                        {pickLang({ ar: 'أوافق على عرض اسم طفلي (بصيغة مقنّعة) ودرجاته في لوحات الشرف العامة داخل التطبيق.', en: "I agree to display my child's masked name and scores on public leaderboards in the app." }, lang)}
                      </span>
                    </label>
                  </div>
                )}
              </>
            )}

            {(step === 'signup-otp' || step === 'forgot-otp') && (
              <>
                <div className="relative group">
                  <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                  <input 
                    type="text" 
                    placeholder="• • • • • •" 
                    value={otp} 
                    onChange={(e) => setOtp(toLatinDigits(e.target.value).replace(/\D/g, ''))} 
                    className="w-full bg-slate-900 border-2 border-amber-500/50 rounded-2xl py-4 ps-12 pe-4 text-center tracking-[0.5em] text-2xl font-mono text-white placeholder-white/20 focus:outline-none focus:border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]" 
                    dir="ltr" 
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </div>
                
                <div className="flex justify-between items-center gap-2 mt-2">
                  <button 
                    onClick={handleResendCode} 
                    disabled={resendTimer > 0 || loading} 
                    className="text-xs text-amber-200/70 hover:text-amber-300 disabled:opacity-50"
                  >
                    {resendTimer > 0 
                      ? pickLang({ ar: `إعادة الإرسال بعد ${resendTimer} ث`, en: `Resend in ${resendTimer}s` }, lang)
                      : pickLang({ ar: 'إعادة إرسال الرمز', en: 'Resend Code' }, lang)}
                  </button>
                  
                  <button 
                    onClick={handleEditEmail} 
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    {pickLang({ ar: 'تعديل البريد', en: 'Edit email' }, lang)}
                  </button>
                </div>
              </>
            )}

            {step === 'reset-password' && (
              <>
                <div className="relative group">
                  <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="password" placeholder={pickLang({ ar: 'كلمة المرور الجديدة', en: 'New Password' }, lang)} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 text-sm" dir="ltr" />
                </div>
                <div className="relative group">
                  <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="password" placeholder={pickLang({ ar: 'تأكيد كلمة المرور', en: 'Confirm Password' }, lang)} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 text-sm" dir="ltr" />
                </div>
              </>
            )}
          </div>

          {msg && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-3 rounded-2xl border text-xs sm:text-sm flex items-center gap-2.5 relative z-10 ${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
              {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span className="leading-relaxed font-medium">{msg.text}</span>
            </motion.div>
          )}

          <motion.button onClick={handleMainAction} disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 relative z-10 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            <span>
              {step === 'form' && (isRegister ? pickLang({ ar: 'إنشاء حساب', en: 'Register' }, lang) : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang))}
              {(step === 'signup-otp' || step === 'forgot-otp') && pickLang({ ar: 'تأكيد الرمز', en: 'Verify Code' }, lang)}
              {step === 'forgot-email' && pickLang({ ar: 'إرسال الرمز', en: 'Send Code' }, lang)}
              {step === 'reset-password' && pickLang({ ar: 'حفظ كلمة المرور', en: 'Save Password' }, lang)}
            </span>
          </motion.button>

          {step === 'form' && (
            <div className="mt-4 flex flex-col gap-2 relative z-10">
              {!isRegister && (
                <button type="button" onClick={() => setStep('forgot-email')} className="text-xs text-amber-200/70 hover:text-amber-300 w-full text-center py-1">
                  {pickLang({ ar: 'نسيت كلمة المرور؟', en: 'Forgot password?' }, lang)}
                </button>
              )}
              <button type="button" onClick={() => { setIsRegister(!isRegister); setMsg(null); setPassword(''); setStep('form'); }} className="text-xs text-slate-400 hover:text-white w-full text-center py-1">
                {isRegister ? pickLang({ ar: 'لديك حساب؟ سجّل الدخول', en: 'Have an account? Login' }, lang) : pickLang({ ar: 'ليس لديك حساب؟ أنشئ حساباً', en: "Don't have an account? Register" }, lang)}
              </button>
            </div>
          )}

          {(step === 'signup-otp' || step === 'forgot-otp' || step === 'forgot-email') && (
            <button type="button" onClick={handleBack} className="mt-4 text-xs text-slate-500 hover:text-white w-full text-center relative z-10">
              {pickLang({ ar: 'الرجوع', en: 'Back' }, lang)}
            </button>
          )}

        </div>
      </motion.div>
    </div>
  );
}

export default AuthModal;