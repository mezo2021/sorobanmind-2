// src/components/AuthModal.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, KeyRound, User, Baby, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

import { useT } from '../i18n/useTranslation';
import { pickLang } from '../i18n/pickLang';
import { cloudSync } from '../lib/cloudSync';

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

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

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
      showMsg(e.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className="relative w-full max-w-md my-auto"
      >
        {/* خلفية صلبة تماماً (غير شفافة) */}
        <div className="bg-[#0b1020] p-6 sm:p-8 border-2 border-purple-500/40 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-5 relative z-10">
            <h3 className="text-2xl font-extrabold font-display text-white">
              {isRegister
                ? pickLang({ ar: 'إنشاء حساب جديد', en: 'Create New Account' }, lang)
                : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang)}
            </h3>
            <p className="text-xs text-white/60 font-body mt-1">
              {pickLang({ ar: 'سجّل لفتح الشاشتين', en: 'Register to unlock both screens' }, lang)}
            </p>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                placeholder={pickLang({ ar: 'البريد الإلكتروني', en: 'Email' }, lang)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition"
                dir="ltr"
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                placeholder={pickLang({ ar: 'كلمة المرور (6+ خانات)', en: 'Password (6+ chars)' }, lang)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition"
                dir="ltr"
              />
            </div>

            {isRegister && (
              <>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder={pickLang({ ar: 'اسم ولي الأمر', en: 'Parent Name' }, lang)}
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>

                <div className="relative">
                  <Baby className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder={pickLang({ ar: 'اسم الطفل الثلاثي', en: 'Child Full Name (3 words)' }, lang)}
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
              </>
            )}
          </div>

          {msg && (
            <div className={`mt-4 p-3 rounded-xl border text-sm flex items-center gap-2 relative z-10 ${
              msg.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                : 'bg-red-500/20 border-red-500/50 text-red-200'
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
            disabled={loading}
            className="btn-primary w-full !py-3 mt-5 relative z-10"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRegister ? (
              <UserPlus className="w-5 h-5" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {isRegister
              ? pickLang({ ar: 'إنشاء حساب', en: 'Register' }, lang)
              : pickLang({ ar: 'دخول', en: 'Login' }, lang)}
          </button>

          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="w-full text-center text-xs text-purple-300 hover:text-purple-200 mt-3 transition relative z-10"
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