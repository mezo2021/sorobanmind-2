// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Globe, Check, Sparkles, Palette
} from 'lucide-react';

import { useT } from '@/i18n/useTranslation';
import { resolveDisplayName } from '@/utils/resolveDisplayName';
import { AVATARS } from '@/data/avatars';
import { cloudSync } from '@/lib/cloudSync';
import { getMode } from '@/utils/appMode';

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

  const isCloudMode = getMode() === 'cloud';
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(isCloudMode);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [visibilityError, setVisibilityError] = useState('');

  const [selectedAvatarId, setSelectedAvatarId] = useState(() => {
    return localStorage.getItem('soroban_hero_key') || AVATARS[0]?.id || 'rabbit_fast';
  });

  const [selectedTheme, setSelectedTheme] = useState(initialData?.theme_key || 'theme_cosmic');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (!isCloudMode) return;

    let cancelled = false;

    const loadVisibility = async () => {
      setVisibilityLoading(true);
      setVisibilityError('');

      try {
        const visible = await cloudSync.getLeaderboardVisibility();

        if (!cancelled) {
          setShowOnLeaderboard(visible);
        }
      } catch (error) {
        console.error('Failed to load leaderboard visibility:', error);

        if (!cancelled) {
          setVisibilityError(
            isRTL
              ? 'تعذرت قراءة إعداد الظهور من السحابة.'
              : 'Could not load leaderboard visibility from the cloud.'
          );
        }
      } finally {
        if (!cancelled) {
          setVisibilityLoading(false);
        }
      }
    };

    loadVisibility();

    return () => {
      cancelled = true;
    };
  }, [isCloudMode, isRTL]);

  const handleLeaderboardVisibilityChange = async () => {
    if (!isCloudMode || visibilityLoading || visibilitySaving) return;

    const newValue = !showOnLeaderboard;

    setVisibilitySaving(true);
    setVisibilityError('');

    try {
      const success = await cloudSync.setLeaderboardVisibility(newValue);

      if (!success) {
        throw new Error('Failed to update leaderboard visibility');
      }

      setShowOnLeaderboard(newValue);
    } catch (error) {
      console.error('Failed to update leaderboard visibility:', error);

      setVisibilityError(
        isRTL
          ? 'تعذر حفظ التغيير. تحقق من الاتصال وحاول مجدداً.'
          : 'Could not save the change. Check your connection and try again.'
      );
    } finally {
      setVisibilitySaving(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      // 1. الحفظ المحلي (دائماً)
      localStorage.setItem('soroban_theme_key', selectedTheme);
      localStorage.setItem('soroban_hero_key', selectedAvatarId);

      const displayName = resolveDisplayName(selectedAvatarId, lang);
      if (displayName) {
        localStorage.setItem('soroban_child_name', displayName);
      }

      if (onSave) {
        onSave({ theme_key: selectedTheme });
      }

      // 2. المزامنة السحابية (فقط في وضع Cloud)
      if (isCloudMode) {
        const synced = await cloudSync.setMyAvatar(selectedAvatarId);

        if (!synced) {
          alert(
            lang === 'ar'
              ? 'تعذر حفظ الشخصية في السحابة. تم الاحتفاظ بالحفظ المحلي. تحقق من الاتصال وحاول مجدداً.'
              : 'Failed to sync your avatar to the cloud. Your local changes were preserved. Check your connection and try again.'
          );
          return;
        }
      }

      // 3. رسالة النجاح (فقط بعد نجاح كلا الحفظين)
      alert(lang === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
      if (onBack) onBack();
    } finally {
      setIsSaving(false);
    }
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

        <section className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base font-bold text-white">
              {isRTL ? 'رمز البروفايل' : 'Avatar'}
            </h2>
          </div>

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

        {isCloudMode && (
          <section className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-base font-bold text-white">
                  {isRTL ? 'الظهور في لوحة الشرف' : 'Hall of Fame Visibility'}
                </h2>
                <p className="text-xs text-white/70 mt-2">
                  {isRTL
                    ? 'اسم البطل وشخصيته ونتائجه ستظهر للاعبين الآخرين عند التفعيل.'
                    : 'Your hero identity and scores will be visible to other players when enabled.'}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={showOnLeaderboard}
                aria-label={isRTL ? 'السماح بالظهور في لوحة الشرف' : 'Allow Hall of Fame visibility'}
                disabled={visibilityLoading || visibilitySaving}
                onClick={() => void handleLeaderboardVisibilityChange()}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  showOnLeaderboard ? 'bg-emerald-500' : 'bg-gray-500'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    showOnLeaderboard ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {visibilityLoading && (
              <p className="mt-3 text-sm text-white/60">
                {isRTL ? 'جارٍ تحميل الإعداد...' : 'Loading setting...'}
              </p>
            )}

            {visibilitySaving && (
              <p className="mt-3 text-sm text-white/60">
                {isRTL ? 'جارٍ حفظ التغيير...' : 'Saving change...'}
              </p>
            )}

            {visibilityError && (
              <p role="alert" className="mt-3 text-sm text-red-400">
                {visibilityError}
              </p>
            )}

            {!visibilityLoading && !visibilityError && (
              <p className="mt-3 text-xs text-white/50">
                {showOnLeaderboard
                  ? (isRTL ? 'الظهور مفعّل.' : 'Visibility is enabled.')
                  : (isRTL ? 'الظهور متوقف.' : 'Visibility is disabled.')}
              </p>
            )}
          </section>
        )}

      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 shadow-2xl">
        <div className="max-w-xl mx-auto">
          <motion.button
            whileHover={isSaving ? undefined : { scale: 1.02 }}
            whileTap={isSaving ? undefined : { scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 text-slate-950 font-black text-base shadow-xl flex items-center justify-center gap-2.5 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>
              {isSaving
                ? (isRTL ? 'جارٍ الحفظ...' : 'Saving...')
                : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}