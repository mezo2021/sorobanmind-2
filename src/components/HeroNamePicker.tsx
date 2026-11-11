// src/components/HeroNamePicker.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { AVATARS, type AvatarCategory } from '@/data/avatars';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

interface HeroNamePickerProps {
  onSave: (heroKey: string) => void;
}

const CATEGORIES: { id: AvatarCategory; ar: string; en: string; emoji: string }[] = [
  { id: 'animals', ar: 'حيوانات', en: 'Animals', emoji: '🦁' },
  { id: 'heroes', ar: 'أبطال', en: 'Heroes', emoji: '🦸' },
  { id: 'space', ar: 'فضاء', en: 'Space', emoji: '🚀' },
  { id: 'mythical', ar: 'أساطير', en: 'Mythical', emoji: '🐉' },
];

export function HeroNamePicker({ onSave }: HeroNamePickerProps) {
  const { lang, dir } = useT();
  const [selected, setSelected] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('animals');

  const handleSave = () => {
    if (selected) onSave(selected);
  };

  const filteredAvatars = AVATARS.filter((a) => a.category === activeCategory);

  return (
    <div dir={dir} className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-slate-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {pickLang({ ar: 'اختر بطلك', en: 'Choose your hero' }, lang)}
          </h2>
          <p className="text-sm text-white/50">
            {pickLang({ ar: 'اختر شخصيتك المفضلة، ستبقى معك', en: 'Choose your favorite character, it will stay with you' }, lang)}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeCategory === cat.id ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}>
              {cat.emoji} {lang === 'ar' ? cat.ar : cat.en}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
          {filteredAvatars.map((avatar) => {
            const isSelected = selected === avatar.id;
            return (
              <button key={avatar.id} type="button" onClick={() => setSelected(avatar.id)}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 p-1 transition-all active:scale-95 ${
                  isSelected ? 'bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-2 border-purple-400 scale-105 shadow-lg' : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}>
                <span className="text-3xl sm:text-4xl">{avatar.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold text-white/80 text-center leading-tight">
                  {lang === 'ar' ? avatar.nameAr : avatar.nameEn}
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

        <button type="button" onClick={handleSave} disabled={!selected}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
            selected ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg active:scale-95' : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}>
          {pickLang({ ar: 'ابدأ المغامرة!', en: 'Start the adventure!' }, lang)}
        </button>
      </motion.div>
    </div>
  );
}

export default HeroNamePicker;