import { useState } from 'react';
import { useT } from '../i18n/useTranslation';
import { pickLang } from '../i18n/pickLang';
import { cloudSync } from '../lib/cloudSync';
import { Cloud, LogIn, UserPlus, Loader2, KeyRound, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function CloudSyncSection({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { lang } = useT();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isRegistering, setIsRegistering] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 5000);
  };

  const handleAuth = async () => {
    if (!email || !password) return showMsg(pickLang({ ar: 'أدخل البريد وكلمة المرور', en: 'Enter email and password' }, lang), 'error');
    if (isRegistering && !parentName.trim()) return showMsg(pickLang({ ar: 'أدخل اسم ولي الأمر', en: 'Enter parent name' }, lang), 'error');
    if (isRegistering && childName.trim().split(/\s+/).length !== 3) return showMsg(pickLang({ ar: 'اسم الطفل يجب أن يكون 3 كلمات', en: 'Child name must be 3 words' }, lang), 'error');

    setLoading(true);
    try {
      if (isRegistering) {
        await cloudSync.registerParent(email, password, parentName, childName);
        await cloudSync.fetchChildren();
        showMsg(pickLang({ ar: 'تم إنشاء الحساب!', en: 'Account created!' }, lang), 'success');
      } else {
        await cloudSync.loginParent(email, password);
        await cloudSync.fetchChildren();
        showMsg(pickLang({ ar: 'تم الدخول!', en: 'Logged in!' }, lang), 'success');
      }
      setTimeout(() => onLoginSuccess(), 1000);
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-2 border-purple-500/40 w-full">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Cloud className="w-8 h-8 text-purple-400" />
        <h3 className="text-2xl font-extrabold font-display text-white">
          {isRegistering ? pickLang({ ar: 'سجل لفتح الشاشتين', en: 'Register to unlock' }, lang) : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang)}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input type="email" placeholder={pickLang({ ar: 'البريد الإلكتروني', en: 'Email' }, lang)} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white" dir="ltr" />
        <input type="password" placeholder={pickLang({ ar: 'كلمة المرور', en: 'Password' }, lang)} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white" dir="ltr" />
        {isRegistering && (
          <>
            <input type="text" placeholder={pickLang({ ar: 'اسم ولي الأمر', en: 'Parent Name' }, lang)} value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white" />
            <input type="text" placeholder={pickLang({ ar: 'اسم الطفل الثلاثي', en: 'Child Full Name (3 parts)' }, lang)} value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white" />
          </>
        )}
      </div>

      <button onClick={handleAuth} disabled={loading} className="btn-primary w-full !py-3">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />)}
        {isRegistering ? pickLang({ ar: 'إنشاء وفتح', en: 'Register & Unlock' }, lang) : pickLang({ ar: 'دخول', en: 'Login' }, lang)}
      </button>

      <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-purple-300 w-full mt-3">
        {isRegistering ? pickLang({ ar: 'لديك حساب؟ سجل دخول', en: 'Have account? Login' }, lang) : pickLang({ ar: 'حساب جديد؟', en: 'New account?' }, lang)}
      </button>

      {msg && (
        <div className={`mt-4 p-3 rounded-xl border text-sm flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-red-500/10 border-red-500/30 text-red-200'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}
    </motion.div>
  );
}