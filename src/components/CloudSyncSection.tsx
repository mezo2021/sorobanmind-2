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
  const [isRegistering, setIsRegistering] = useState(true); // يبدأ على وضع "حساب جديد"

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 5000);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      return showMsg(pickLang({ ar: 'يرجى إدخال البريد وكلمة المرور', en: 'Please enter email and password' }, lang), 'error');
    }

    if (isRegistering) {
      if (!parentName.trim()) {
        return showMsg(pickLang({ ar: 'يرجى إدخال اسم ولي الأمر', en: 'Please enter parent name' }, lang), 'error');
      }
      
      // التحقق من اسم الطفل الثلاثي (3 مقاطع بالضبط)
      const childParts = childName.trim().split(/\s+/);
      if (childParts.length !== 3) {
        return showMsg(
          pickLang({ ar: 'يجب أن يكون اسم الطفل ثلاثياً (3 أسماء)', en: 'Child name must be exactly 3 parts' }, lang), 
          'error'
        );
      }
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await cloudSync.registerParent(email, password, parentName, childName);
        showMsg(pickLang({ ar: 'تم إنشاء الحساب بنجاح! جاري فتح الشاشات...', en: 'Account created! Unlocking screens...' }, lang), 'success');
        setTimeout(() => onLoginSuccess(), 1500);
      } else {
        await cloudSync.loginParent(email, password);
        // نتحقق من وجود اسم الطفل في المتجر السحابي
        await cloudSync.loadFromCloud(); 
        showMsg(pickLang({ ar: 'تم تسجيل الدخول بنجاح!', en: 'Logged in successfully!' }, lang), 'success');
        setTimeout(() => onLoginSuccess(), 1500);
      }
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-8 border-2 border-purple-500/40 relative overflow-hidden w-full shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-center gap-3 mb-6">
        <Cloud className="w-8 h-8 text-purple-400" />
        <h3 className="text-2xl font-extrabold font-display text-white text-center">
          {isRegistering 
            ? pickLang({ ar: 'سجل الآن لفتح الشاشتين', en: 'Register now to unlock screens' }, lang) 
            : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang)}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/40">
            <User className="w-5 h-5" />
          </div>
          <input type="email" placeholder={pickLang({ ar: 'البريد الإلكتروني', en: 'Email' }, lang)} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white focus:outline-none focus:border-purple-400 transition" dir="ltr" />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/40">
            <KeyRound className="w-5 h-5" />
          </div>
          <input type="password" placeholder={pickLang({ ar: 'كلمة المرور', en: 'Password' }, lang)} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white focus:outline-none focus:border-purple-400 transition" dir="ltr" />
        </div>

        {isRegistering && (
          <>
            <input type="text" placeholder={pickLang({ ar: 'اسم ولي الأمر', en: 'Parent Name' }, lang)} value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white focus:outline-none focus:border-purple-400 transition" />
            <input type="text" placeholder={pickLang({ ar: 'اسم الطفل الثلاثي', en: 'Child Full Name (3 parts)' }, lang)} value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white focus:outline-none focus:border-purple-400 transition" />
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={handleAuth} disabled={loading} className="btn-primary flex-1 !py-3 shadow-lg shadow-purple-500/20">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />)}
          {isRegistering ? pickLang({ ar: 'إنشاء الحساب وفتح الشاشات', en: 'Register & Unlock' }, lang) : pickLang({ ar: 'دخول', en: 'Login' }, lang)}
        </button>
        
        <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-purple-300 hover:text-purple-200 transition">
          {isRegistering ? pickLang({ ar: 'لديك حساب؟ سجل دخولك', en: 'Have an account? Login' }, lang) : pickLang({ ar: 'حساب جديد؟', en: 'New account?' }, lang)}
        </button>
      </div>

      {msg && (
        <div className={`mt-4 p-3 rounded-xl border text-sm flex items-center gap-2 justify-center ${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-red-500/10 border-red-500/30 text-red-200'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {msg.text}
        </div>
      )}
    </motion.div>
  );
}