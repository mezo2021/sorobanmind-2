import { useState, useEffect } from 'react';
import { useT } from '../i18n/useTranslation';
import { pickLang } from '../i18n/pickLang';
import { cloudSync } from '../lib/cloudSync';
import { Cloud, LogIn, UserPlus, Save, DownloadCloud, LogOut, CheckCircle2, AlertCircle, Loader2, KeyRound, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function CloudSyncSection() {
  const { lang } = useT();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');

  useEffect(() => {
    cloudSync.getCurrentUser().then(setUser);
  }, []);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 5000);
  };

  const handleAuth = async () => {
    if (!email || !password) return showMsg(pickLang({ ar: 'يرجى إدخال البريد وكلمة المرور', en: 'Please enter email and password' }, lang), 'error');
    if (isRegistering && (!parentName || !childName)) return showMsg(pickLang({ ar: 'يرجى إدخال اسم ولي الأمر واسم الطفل', en: 'Please enter parent and child names' }, lang), 'error');

    setLoading(true);
    try {
      if (isRegistering) {
        const u = await cloudSync.registerParent(email, password, parentName, childName);
        setUser(u);
        showMsg(pickLang({ ar: 'تم إنشاء الحساب وربطه بالسحابة!', en: 'Account created and linked to cloud!' }, lang), 'success');
      } else {
        const u = await cloudSync.loginParent(email, password);
        setUser(u);
        showMsg(pickLang({ ar: 'تم تسجيل الدخول بنجاح!', en: 'Logged in successfully!' }, lang), 'success');
      }
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await cloudSync.saveToCloud();
      showMsg(pickLang({ ar: 'تم حفظ التقدم في السحابة بنجاح ✅', en: 'Progress saved to cloud ✅' }, lang), 'success');
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
    setLoading(false);
  };

  const handleLoad = async () => {
    setLoading(true);
    try {
      await cloudSync.loadFromCloud();
      showMsg(pickLang({ ar: 'تم استعادة التقدم بنجاح ☁️ جاري التحديث...', en: 'Progress restored ☁️ Reloading...' }, lang), 'success');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e: any) {
      showMsg(e.message, 'error');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await cloudSync.logoutParent();
    setUser(null);
    showMsg(pickLang({ ar: 'تم تسجيل الخروج', en: 'Logged out' }, lang), 'success');
  };

  if (user) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 sm:p-6 mb-6 border border-emerald-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-extrabold font-display text-white">
            {pickLang({ ar: 'المزامنة السحابية', en: 'Cloud Sync' }, lang)}
          </h3>
        </div>
        <p className="text-sm text-emerald-300 font-body mb-4 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" />
          {pickLang({ ar: `مرحباً، ${user.email}`, en: `Welcome, ${user.email}` }, lang)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <button onClick={handleSave} disabled={loading} className="btn-primary w-full !bg-gradient-to-br !from-emerald-500 !to-teal-600">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {pickLang({ ar: 'حفظ في السحابة', en: 'Save to Cloud' }, lang)}
          </button>
          <button onClick={handleLoad} disabled={loading} className="btn-primary w-full !bg-gradient-to-br !from-blue-500 !to-indigo-600">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <DownloadCloud className="w-5 h-5" />}
            {pickLang({ ar: 'استعادة من السحابة', en: 'Restore from Cloud' }, lang)}
          </button>
        </div>
        <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1 mx-auto">
          <LogOut className="w-3.5 h-3.5" />
          {pickLang({ ar: 'تسجيل خروج ولي الأمر', en: 'Logout Parent' }, lang)}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 sm:p-6 mb-6 border border-purple-500/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="flex items-center gap-2 mb-2">
        <Cloud className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-extrabold font-display text-white">
          {pickLang({ ar: 'ربط حساب ولي الأمر', en: 'Parent Account Link' }, lang)}
        </h3>
      </div>
      <p className="text-sm text-white/60 font-body mb-5 leading-relaxed">
        {pickLang({ 
          ar: 'سجّل الدخول لحفظ تقدم طفلك في السحابة. يمكنك استعادة التقدم على أي جهاز آخر (كلمات المرور والأسماء تُحفظ بأمان في سيرفرات Supabase).', 
          en: 'Log in to save your child\'s progress in the cloud. You can restore progress on any device (passwords and names are safely stored in Supabase).' 
        }, lang)}
      </p>

      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/40">
            <User className="w-5 h-5" />
          </div>
          <input type="email" placeholder={pickLang({ ar: 'البريد الإلكتروني لولي الأمر', en: 'Parent Email' }, lang)} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition" dir="ltr" />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/40">
            <KeyRound className="w-5 h-5" />
          </div>
          <input type="password" placeholder={pickLang({ ar: 'كلمة المرور', en: 'Password' }, lang)} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition" dir="ltr" />
        </div>

        {isRegistering && (
          <>
            <input type="text" placeholder={pickLang({ ar: 'اسم ولي الأمر الثلاثي', en: 'Parent Full Name' }, lang)} value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition" />
            <input type="text" placeholder={pickLang({ ar: 'اسم الطفل الثلاثي', en: 'Child Full Name' }, lang)} value={childName} onChange={(e) => setChildName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition" />
          </>
        )}

        <div className="flex gap-2 pt-2">
          <button onClick={handleAuth} disabled={loading} className="btn-primary flex-1 !py-3">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />)}
            {isRegistering ? pickLang({ ar: 'إنشاء حساب جديد', en: 'Register' }, lang) : pickLang({ ar: 'تسجيل الدخول', en: 'Login' }, lang)}
          </button>
        </div>

        <button onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-purple-300 hover:text-purple-200 transition text-center w-full mt-2">
          {isRegistering ? pickLang({ ar: 'لديك حساب بالفعل؟ سجل دخولك', en: 'Already have an account? Login' }, lang) : pickLang({ ar: 'ليس لديك حساب؟ أنشئ حساباً جديداً', en: "Don't have an account? Register" }, lang)}
        </button>
      </div>

      {msg && (
        <div className={`mt-4 p-3 rounded-xl border text-sm flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-red-500/10 border-red-500/30 text-red-200'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {msg.text}
        </div>
      )}
    </motion.div>
  );
}