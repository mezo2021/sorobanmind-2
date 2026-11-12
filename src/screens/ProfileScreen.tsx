// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Globe, Check, Sparkles, Palette
} from 'lucide-react';

import { useT } from '@/i18n/useTranslation';
import { resolveDisplayName } from '@/utils/resolveDisplayName';
import { AVATARS } from '@/data/avatars';

// الألوان التي تبقى للخلفية فقط
export const APP_GRADIENTS = [
  { key: 'theme_cosmic', class: 'from-purple-950 via-indigo-900 to-slate-950', labelAr: 'كوني', labelEn: 'Cosmic' },
  { key: 'theme_candy', class: 'from-pink-900 via-purple-950 to-slate-950', labelAr: 'حلوى', labelEn: 'Candy' },
  { key: 'theme_ocean', class: 'from-blue-950 via-teal-900 to-slate-950', labelAr: 'محيط', labelEn: 'Ocean' },
  { key: 'theme_forest', class: 'from-emerald-950 via-teal-950 to-slate-950', labelAr: 'غابة', labelEn: 'Forest' },
  { key: 'theme_sunset', class: 'from-amber-950 via-rose-950 to-slate-950', labelAr: 'غروب', labelEn: 'Sunset' },
  { key: 'theme_neon', class: 'from-fuchsia-950 via-cyan-950 to-slate-950', labelAr: 'نيون', labelEn: 'Neon' },
  { key: 'theme_royal', class: 'from-violet-950 via-purple-900 to-slate-950', labelAr: 'ملكي', labelEn: 'Royal' },
  { key: 'theme_midnight', class: 'from-slate-900 via-gray-950 to-black', labelAr: 'منتصف الليل', labelEn: 'Midnight' },
];

interface ProfileScreenProps {
  onBack?: () => void;
  onSave?: (data: Record<string, string>) => void;
  initialData?: Record<string, string>;
}

export default function ProfileScreen({ onBack, onSave, initialData }: ProfileScreenProps) {
  const { lang, dir } = useT();
  const isRTL = lang === 'ar';

  // قراءة الشخصية الحالية من soroban_hero_key
  const [selectedAvatarId, setSelectedAvatarId] = useState(() => {
    return localStorage.getItem('soroban_hero_key') || AVATARS[0]?.id || 'rabbit_fast';
  });

  const [selectedTheme, setSelectedTheme] = useState(initialData?.theme_key || 'theme_cosmic');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const currentAvatar = AVATARS.find(a => a.id === selectedAvatarId) || AVATARS[0];

  const filteredAvatars = activeCategory === 'all' 
    ? AVATARS 
    : AVATARS.filter(a => a.category === activeCategory);

  const categoriesList = [
    { id: 'all', nameAr: 'الكل', nameEn: 'All' },
    { id: 'animals', nameAr: 'حيوانات', nameEn: 'Animals' },
    { id: 'heroes', nameAr: 'أبطال', nameEn: 'Heroes' },
    { id: 'space', nameAr: 'فضاء', nameEn: 'Space' },
    { id: 'mythical', nameAr: 'أسطوري', nameEn: 'Mythical' },
  ];

  const handleSave = () => {
    // 1. حفظ المظهر فقط (الخلفية)
    localStorage.setItem('soroban_theme_key', selectedTheme);

    // 2. حفظ معرف الشخصية (المفتاح الموحد soroban_hero_key)
    localStorage.setItem('soroban_hero_key', selectedAvatarId);

    // 3. تحديث اسم العرض بناءً على اللغة (ar/en)
    const displayName = resolveDisplayName(selectedAvatarId, lang);
    if (displayName) {
      localStorage.setItem('soroban_child_name', displayName);
    }

    if (onSave) {
      onSave({ theme_key: selectedTheme });
    }
    
    alert(lang === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
    if (onBack) onBack();
  };

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className={`min-h-screen w-full bg-gradient-to-b ${
        APP_GRADIENTS.find(t => t.key === selectedTheme)?.class || APP_GRADIENTS[0].class
      } text-white font-sans pb-32 transition-colors duration-500`}
    >
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/50 border-b border-white/10 px-4 py-3.5 flex items-center justify-between shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 transition px-3.5 py-2 rounded-2xl border border-white/15"
        >
          {isRTL ? <ArrowRight className="w-5 h-5 text-cyan-400" /> : <ArrowLeft className="w-5 h-5 text-cyan-400" />}
          <span className="text-sm font-bold">{isRTL ? 'الرجوع' : 'Back'}</span>
        </button>

        <h1 className="text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
          {isRTL ? 'الملف الشخصي' : 'Profile'}
        </h1>

        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-2 rounded-2xl text-xs font-bold border border-white/15 shadow-sm">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ar' ? 'عربي' : 'English'}</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-6 flex flex-col gap-6">

        {/* بطاقة الرمز (Avatar) */}
        <section className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base font-bold text-white">
              {isRTL ? 'رمز البروفايل' : 'Avatar'}
            </h2>
          </div>

          {/* معاينة الشخصية الحالية */}
          <div className="flex flex-col items-center justify-center bg-slate-900/40 rounded-2xl p-6 border border-white/10 mb-5">
            <motion.div 
              key={selectedAvatarId}
              initial={{ scale: 0.7, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-4 border-white/25 bg-slate-800"
            >
              {currentAvatar?.emoji || '⭐'}
            </motion.div>
            <span className="mt-3 text-lg font-bold text-cyan-300 tracking-wider">
              {isRTL ? currentAvatar?.nameAr : currentAvatar?.nameEn}
            </span>
          </div>

          {/* فلاتر التصنيفات */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                }`}
              >
                {isRTL ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>

          {/* شبكة الشخصيات الـ 100 */}
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5 max-h-60 overflow-y-auto p-2 bg-slate-950/40 rounded-2xl border border-white/10">
            {filteredAvatars.map((item) => {
              const isSelected = selectedAvatarId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedAvatarId(item.id)}
                  className={`relative aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 active:scale-90 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-pink-500/50 to-cyan-500/50 border-2 border-cyan-300 scale-105 shadow-xl' 
                      : 'bg-white/5 hover:bg-white/15 border border-white/5'
                  }`}
                >
                  <span>{item.emoji}</span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center text-slate-950 shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* المظهر (الخلفية فقط) */}
        <section className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-pink-400" />
            <h2 className="text-base font-bold text-white">
              {isRTL ? 'المظهر' : 'Appearance'}
            </h2>
          </div>

          <label className="text-xs font-medium text-white/70 mb-2.5 block">
            {isRTL ? 'تدرج الخلفية:' : 'Background:'}
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {APP_GRADIENTS.map((theme) => (
              <button
                key={theme.key}
                onClick={() => setSelectedTheme(theme.key)}
                className={`h-11 rounded-xl bg-gradient-to-br ${theme.class} border-2 transition-all active:scale-95 flex items-center justify-center ${
                  selectedTheme === theme.key ? 'border-cyan-400 scale-105 shadow-md' : 'border-white/15'
                }`}
                title={isRTL ? theme.labelAr : theme.labelEn}
              >
                {selectedTheme === theme.key && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* زر الحفظ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 shadow-2xl">
        <div className="max-w-xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 text-slate-950 font-black text-base shadow-xl flex items-center justify-center gap-2.5 tracking-wide"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>{isRTL ? 'حفظ التغييرات' : 'Save Changes'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}