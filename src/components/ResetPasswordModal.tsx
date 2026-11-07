import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cloudSync } from '../lib/cloudSync';
import { useT } from '../i18n/useTranslation';
import { pickLang } from '../i18n/pickLang';

export function ResetPasswordModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { lang, dir } = useT();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setMsg({ text: pickLang({ ar: 'كلمة المرور يجب أن تكون 6 خانات على الأقل', en: 'Password must be at least 6 characters' }, lang), type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setMsg({ text: pickLang({ ar: 'كلمتا المرور غير متطابقتين', en: 'Passwords do not match' }, lang), type: 'error' });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      await cloudSync.updatePassword(password);
      setMsg({ text: pickLang({ ar: 'تم تحديث كلمة المرور بنجاح!', en: 'Password updated successfully!' }, lang), type: 'success' });
      setTimeout(() => onSuccess(), 1500);
    } catch (error: any) {
      setMsg({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#0c0c0e]/95 p-6 sm:p-8 border border-amber-500/20 rounded-3xl relative shadow-2xl">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {pickLang({ ar: 'تعيين كلمة مرور جديدة', en: 'Set New Password' }, lang)}
          </h3>
          <p className="text-sm text-slate-400">
            {pickLang({ ar: 'أدخل كلمة المرور الجديدة لحسابك.', en: 'Enter the new password for your account.' }, lang)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="password"
              placeholder={pickLang({ ar: 'كلمة المرور الجديدة', en: 'New Password' }, lang)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
              dir="ltr"
            />
          </div>
          <div className="relative">
            <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="password"
              placeholder={pickLang({ ar: 'تأكيد كلمة المرور', en: 'Confirm Password' }, lang)}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 ps-11 pe-4 text-white placeholder-white/30 focus:border-amber-400 focus:outline-none"
              dir="ltr"
            />
          </div>

          {msg && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-sm ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
              {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {msg.text}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold flex justify-center items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : pickLang({ ar: 'حفظ كلمة المرور', en: 'Save Password' }, lang)}
          </button>
        </form>
        
        <button type="button" onClick={onClose} className="mt-4 text-xs text-slate-500 hover:text-white w-full text-center">
          {pickLang({ ar: 'تخطي والعودة', en: 'Skip and go back' }, lang)}
        </button>
      </motion.div>
    </div>
  );
}