// src/components/AppModeSelection.tsx
import { motion } from 'framer-motion';
import { Sparkles, Cloud, HardDrive, ArrowLeft, ArrowRight } from 'lucide-react';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import type { AppMode } from '@/utils/appMode';

interface Props {
  onSelect: (mode: AppMode) => void;
}

export function AppModeSelection({ onSelect }: Props) {
  const { lang, dir } = useT();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div dir={dir} className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {pickLang({ ar: 'مرحباً بك في SorobanMind', en: 'Welcome to SorobanMind' }, lang)}
          </h1>
          <p className="text-sm text-white/50">
            {pickLang({ ar: 'اختر طريقة الاستخدام', en: 'Choose how to use the app' }, lang)}
          </p>
        </div>

        <div className="space-y-3">
          {/* الوضع المحلي */}
          <button
            type="button"
            onClick={() => onSelect('local')}
            className="w-full p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/40 hover:border-emerald-400 transition-all active:scale-[0.98] text-start"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center shrink-0">
                <HardDrive className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-white mb-1">
                  {pickLang({ ar: 'الوضع المحلي', en: 'Local Mode' }, lang)}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {pickLang({
                    ar: 'تقدمك محفوظ على جهازك فقط. لا يحتاج إنترنت. خصوصية كاملة.',
                    en: 'Your progress is saved on your device only. No internet needed. Full privacy.',
                  }, lang)}
                </p>
                <div className="flex items-center gap-1 mt-2 text-emerald-300 text-xs font-bold">
                  {pickLang({ ar: 'الأنسب الآن', en: 'Recommended now' }, lang)}
                  <Arrow className="w-3 h-3" />
                </div>
              </div>
            </div>
          </button>

          {/* الوضع السحابي */}
          <button
            type="button"
            onClick={() => onSelect('cloud')}
            className="w-full p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/40 hover:border-blue-400 transition-all active:scale-[0.98] text-start"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center shrink-0">
                <Cloud className="w-6 h-6 text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-white mb-1">
                  {pickLang({ ar: 'الوضع السحابي', en: 'Cloud Mode' }, lang)}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {pickLang({
                    ar: 'حساب + حفظ سحابي + قاعة الشرف. يحتاج إنترنت.',
                    en: 'Account + cloud sync + leaderboard. Requires internet.',
                  }, lang)}
                </p>
                <div className="flex items-center gap-1 mt-2 text-blue-300 text-xs font-bold">
                  {pickLang({ ar: 'تسجيل مطلوب', en: 'Sign-up required' }, lang)}
                  <Arrow className="w-3 h-3" />
                </div>
              </div>
            </div>
          </button>
        </div>

        <p className="text-[10px] text-white/30 text-center mt-6">
          {pickLang({
            ar: 'يمكنك تغيير هذا لاحقاً من الإعدادات',
            en: 'You can change this later in settings',
          }, lang)}
        </p>
      </motion.div>
    </div>
  );
}

export default AppModeSelection;