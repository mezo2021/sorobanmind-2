// src/components/HeroNamePicker.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { HERO_NAMES } from '@/data/heroNames';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

interface HeroNamePickerProps {
  onSave: (heroKey: string) => void;
}

export function HeroNamePicker({ onSave }: HeroNamePickerProps) {
  const { lang, dir } = useT();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSave = () => {
    if (selected) onSave(selected);
  };

  return (
    <div dir={dir} className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* العنوان */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {pickLang({ ar: 'اختر اسم بطلك', en: 'Choose your hero name' }, lang)}
          </h2>
          <p className="text-sm text-white/50">
            {pickLang({
              ar: 'اختر اسماً واحداً فقط، سيبقى معك',
              en: 'Choose one name, it will stay with you',
            }, lang)}
          </p>
        </div>

        {/* شبكة 30 اسم */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
          {HERO_NAMES.map((hero) => {
            const isSelected = selected === hero.key;
            return (
              <button
                key={hero.key}
                type="button"
                onClick={() => setSelected(hero.key)}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-2 border-purple-400 scale-105 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{hero.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold text-white/80">
                  {lang === 'ar' ? hero.nameAr : hero.nameEn}
                </span>
                {isSelected && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* زر التأكيد */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
            selected
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg active:scale-95'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {pickLang({ ar: 'ابدأ المغامرة!', en: 'Start the adventure!' }, lang)}
        </button>
      </motion.div>
    </div>
  );
}

export default HeroNamePicker;