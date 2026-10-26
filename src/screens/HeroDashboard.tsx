// src/screens/HeroDashboard.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, lazy, Suspense } from 'react';
import {
  Sparkles, Flame, Brain, Zap, Palette,
  X, Users, Trophy, Target, Grid3X3, Film,
  Gamepad2, CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

import type { Screen, CharacterType } from '@/types';
import { Companion } from '@/components/Companion';
import { CharacterSelector } from '@/components/CharacterSelector';
const GamesListScreen = lazy(() => import('@/components/games/GamesListScreen').then(m => ({ default: m.GamesListScreen })));
import { useProgressStore } from '@/store/progressStore';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatNumber } from '@/utils/numberStyle';

import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import { translateDynamic } from '@/utils/translateDynamic';

interface HeroDashboardProps {
  onNavigate: (screen: Screen) => void;
  playSound: (type: 'click' | 'whoosh') => void;
  xp: number;
  streak: number;
}

// 🔢 Follows the number-style toggle (Arabic ٠١٢٣ ↔ Latin 0123) — name preserved for compatibility
function toArabicNumber(value: number | string): string {
  return formatNumber(value, useNumberStyleStore.getState().style);
}

const CHARACTER_INFO: Record<
  CharacterType,
  { name: string; nameEn: string; title: string; titleEn: string; message: string; messageEn: string; color: string; lightColor: string }
> = {
  sham: {
    name: 'شام',
    nameEn: 'Sham',
    title: 'البطلة الذكية',
    titleEn: 'The Smart Heroine',
    message: 'لنكتشف اليوم طريقة جديدة للحساب!',
    messageEn: "Let's discover a new calculation method today!",
    color: 'from-violet-500 to-purple-700',
    lightColor: 'text-violet-300',
  },
  rayan: {
    name: 'ريان',
    nameEn: 'Rayan',
    title: 'البطل السريع',
    titleEn: 'The Fast Hero',
    message: 'هل أنت مستعد لتحدٍ جديد؟ هيا نبدأ!',
    messageEn: 'Are you ready for a new challenge? Let\'s start!',
    color: 'from-blue-500 to-indigo-700',
    lightColor: 'text-blue-300',
  },
  bana: {
    name: 'بانة',
    nameEn: 'Bana',
    title: 'البطلة الهادئة',
    titleEn: 'The Calm Heroine',
    message: 'التركيز الهادئ يصنع نتائج رائعة.',
    messageEn: 'Calm focus produces amazing results.',
    color: 'from-teal-400 to-emerald-700',
    lightColor: 'text-teal-300',
  },
  joud: {
    name: 'جود',
    nameEn: 'Joud',
    title: 'البطل الذكي',
    titleEn: 'The Smart Hero',
    message: 'أحب التفكير والتحليل — هيا نحل معًا!',
    messageEn: 'I love thinking and analysis — let\'s solve together!',
    color: 'from-indigo-500 to-purple-700',
    lightColor: 'text-indigo-300',
  },
};

interface CategoryCard {
  screen: Screen;
  title: string;
  titleEn: string;
  ageRange: string;
  ageRangeEn: string;
  desc: string;
  descEn: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
  levels: number[];
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    screen: 'category-kids',
    title: 'الأبطال الصغار',
    titleEn: 'Young Heroes',
    ageRange: '٥ - ١٢ سنة',
    ageRangeEn: 'Ages 5 - 12',
    desc: 'التأسيس: التعرّف على السوروبان، الأرقام، الجمع والطرح، الضرب والقسمة',
    descEn: 'Foundation: Discover the soroban, numbers, addition & subtraction, multiplication & division',
    icon: Users,
    gradient: 'from-emerald-500 to-teal-700',
    glow: 'shadow-emerald-500/40',
    levels: [0, 1, 2, 3],
  },
  {
    screen: 'category-teens',
    title: 'الأبطال الكبار',
    titleEn: 'Champion Heroes',
    ageRange: '١٣+ سنة',
    ageRangeEn: 'Ages 13+',
    desc: 'المتقدم: العمليات المركبة، الضرب والقسمة المتقدمة، الأعداد العشرية والجذور',
    descEn: 'Advanced: Compound operations, advanced multiplication & division, decimals and roots',
    icon: Trophy,
    gradient: 'from-purple-500 to-indigo-700',
    glow: 'shadow-purple-500/40',
    levels: [4, 5, 6, 7],
  },
];

const LEGACY_CHARACTER_MAP: Record<string, CharacterType> = {
  fox: 'sham',
  owl: 'bana',
  panda: 'joud',
  rabbit: 'rayan',
};

export function HeroDashboard({
  onNavigate,
  playSound,
  xp,
  streak,
}: HeroDashboardProps) {
  const { lang, dir } = useT();
  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic'; // 🆕 Added here to fix the error
  const [showGames, setShowGames] = useState(false);

  const placementAttempts = useProgressStore((s) => s.placementAttempts);
  const [recommendedLevel, setRecommendedLevel] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('soroban_placement_recommended');
      if (raw) setRecommendedLevel(raw);
    } catch { /* ignore */ }
  }, []);

  const hasTakenPlacement = placementAttempts > 0 || recommendedLevel !== null;

  const [companion, setCompanion] = useState<CharacterType>('sham');
  const [showSelector, setShowSelector] = useState(false);
  const [childName, setChildName] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('soroban_companion');
    if (saved === 'sham' || saved === 'rayan' || saved === 'bana' || saved === 'joud') {
      setCompanion(saved as CharacterType);
    } else if (saved && LEGACY_CHARACTER_MAP[saved]) {
      const migrated = LEGACY_CHARACTER_MAP[saved];
      localStorage.setItem('soroban_companion', migrated);
      setCompanion(migrated);
    } else {
      localStorage.setItem('soroban_companion', 'sham');
      setCompanion('sham');
      setShowSelector(true);
    }

    const savedName = localStorage.getItem('soroban_child_name');
    if (savedName) setChildName(savedName);
  }, []);

  const handleCompanionChange = (character: CharacterType) => {
    setCompanion(character);
    localStorage.setItem('soroban_companion', character);
    setShowSelector(false);
  };

  const handleNav = (screen: Screen) => {
    playSound('click');
    onNavigate(screen);
  };

  if (showGames) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white/70 text-lg font-bold">
          {pickLang({ ar: 'جارٍ تحميل مدينة الألعاب... 🎮', en: 'Loading Games City... 🎮' }, lang)}
        </div>
      }>
        <GamesListScreen
          onBack={() => {
            playSound('click');
            setShowGames(false);
          }}
        />
      </Suspense>
    );
  }

  const characterInfo = CHARACTER_INFO[companion];

  return (
    <div dir={dir} className="px-3 sm:px-6 py-6 max-w-6xl mx-auto">
      {/* WELCOME HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 sm:p-6 mb-6 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-electric-500/10 rounded-full blur-3xl" />

        <div className="relative flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-gold-300" />
              <span className="text-xs text-gold-300 font-bold font-body">
                {pickLang({ ar: 'أكاديمية الأبطال الصغار', en: 'Young Heroes Academy' }, lang)}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {pickLang({ ar: 'مرحباً يا', en: 'Welcome,' }, lang)}{' '}
              {childName 
                ? translateDynamic({ value: childName }, lang, 'value') 
                : pickLang({ ar: 'أيها البطل', en: 'Hero' }, lang)}!
            </h2>
            <p className="text-white/60 font-body text-sm mt-1">
              {pickLang({ ar: 'واصل رحلتك في إتقان الحساب الذهني بالسوروبان', en: 'Continue your journey to master mental math with the soroban' }, lang)}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-center px-4 py-2 rounded-2xl bg-purple-500/15 border border-purple-400/20">
              <p className="text-2xl font-extrabold text-purple-300 font-display">
                {toArabicNumber(xp)}
              </p>
              <p className="text-[10px] text-white/50 font-body">
                {pickLang({ ar: 'نقطة خبرة', en: 'XP' }, lang)}
              </p>
            </div>

            <div className="text-center px-4 py-2 rounded-2xl bg-orange-500/15 border border-orange-400/20">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-300" />
                <p className="text-2xl font-extrabold text-orange-300 font-display">
                  {toArabicNumber(streak)}
                </p>
              </div>
              <p className="text-[10px] text-white/50 font-body">
                {pickLang({ ar: 'أيام متتالية', en: 'Streak Days' }, lang)}
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-2 mt-4 flex-wrap">
          <button
            type="button"
            onClick={() => { playSound('click'); setShowSelector(true); }}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-br from-purple-500/20 to-electric-500/20 border border-purple-400/30 text-purple-200 hover:from-purple-500/30 hover:to-electric-500/30 transition-all text-xs font-body"
          >
            <Palette className="w-4 h-4" />
            <span>{pickLang({ ar: 'تغيير الرفيق', en: 'Change Companion' }, lang)}</span>
          </button>
        </div>
      </motion.div>

      {/* HERO COMPANION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-5 sm:p-6 mb-6 overflow-hidden relative"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-electric-500/10 blur-3xl" />

        <div className="relative grid grid-cols-1 md:grid-cols-[260px_1fr_auto] items-center gap-5">
          <div className="relative flex justify-center">
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-3xl scale-75" />
              <div className={`relative w-60 h-72 sm:w-64 sm:h-76 rounded-[2.5rem] bg-gradient-to-br ${characterInfo.color} flex items-end justify-center shadow-2xl border border-white/20 overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative w-full h-full flex items-end justify-center">
                  <Companion
                    character={companion}
                    xp={xp}
                    variant="inline"
                    imageClassName="w-full h-full object-contain object-bottom drop-shadow-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center md:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-400/20 mb-2">
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span className="text-xs font-bold text-violet-200 font-body">
                {pickLang({ ar: 'رفيق رحلتك', en: 'Your Journey Companion' }, lang)}
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
              {pickLang({ ar: characterInfo.name, en: characterInfo.nameEn }, lang)}
            </h3>
            <p className={`text-sm font-bold font-body mt-1 ${characterInfo.lightColor}`}>
              {pickLang({ ar: characterInfo.title, en: characterInfo.titleEn }, lang)}
            </p>
            <p className="text-sm text-white/60 font-body mt-3 leading-relaxed">
              {pickLang({ ar: characterInfo.message, en: characterInfo.messageEn }, lang)}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-2 mt-4 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Brain className="w-4 h-4 text-purple-300" />
                <span className="text-xs text-white/60 font-body">
                  {pickLang({ ar: 'تدريب العقل', en: 'Mind Training' }, lang)}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Zap className="w-4 h-4 text-gold-300" />
                <span className="text-xs text-white/60 font-body">
                  {pickLang({ ar: 'تطوير السرعة', en: 'Speed Development' }, lang)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col gap-2 justify-center">
            <button
              type="button"
              onClick={() => { playSound('click'); setShowSelector(true); }}
              className="flex-1 md:flex-none px-4 py-3 rounded-2xl bg-violet-500/15 border border-violet-400/20 text-violet-200 hover:bg-violet-500/25 transition-all text-xs font-bold font-body"
            >
              {pickLang({ ar: 'تغيير الرفيق', en: 'Change Companion' }, lang)}
            </button>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-lg font-black text-gold-300 font-display">{toArabicNumber(xp)}</p>
              <p className="text-[10px] text-white/40 font-body">
                {pickLang({ ar: 'خبرة البطل', en: 'Hero XP' }, lang)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PLACEMENT TEST CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <motion.button
          type="button"
          whileHover={!hasTakenPlacement ? { scale: 1.01, y: -3 } : {}}
          whileTap={!hasTakenPlacement ? { scale: 0.99 } : {}}
          onClick={() => {
            if (hasTakenPlacement) return;
            handleNav('placement-test' as Screen);
          }}
          disabled={hasTakenPlacement}
          className={`group relative glass-card p-5 sm:p-6 text-start overflow-hidden w-full border-2 transition-all ${
            hasTakenPlacement
              ? 'border-emerald-400/40 opacity-80 cursor-not-allowed'
              : 'border-gold-400/40'
          }`}
        >
          <div
            className={`absolute inset-0 ${
              hasTakenPlacement
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                : 'bg-gradient-to-br from-gold-400 to-amber-600'
            } opacity-10 ${!hasTakenPlacement ? 'group-hover:opacity-20' : ''} transition-opacity duration-500`}
          />
          <div
            className={`absolute -top-20 -right-20 w-48 h-48 blur-3xl ${
              hasTakenPlacement ? 'bg-emerald-500/30' : 'bg-gold-500/30'
            }`}
          />

          <div className="relative flex items-center gap-4">
            <div
              className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                hasTakenPlacement
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/50'
                  : 'bg-gradient-to-br from-gold-400 to-amber-600 shadow-gold-500/50'
              }`}
            >
              {hasTakenPlacement ? (
                <CheckCircle2 className="w-8 h-8 text-white" />
              ) : (
                <Target className="w-8 h-8 text-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="text-xl font-black font-display text-white">
                  {hasTakenPlacement
                    ? pickLang({ ar: 'تم تحديد مستواك', en: 'Your level has been determined' }, lang)
                    : pickLang({ ar: 'امتحان تحديد المستوى', en: 'Placement Test' }, lang)}
                </h4>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap ${
                    hasTakenPlacement
                      ? 'bg-emerald-400/30 text-emerald-100'
                      : 'bg-gold-400/30 text-gold-100'
                  }`}
                >
                  {hasTakenPlacement 
                    ? pickLang({ ar: '✅ مكتمل', en: '✅ Completed' }, lang) 
                    : pickLang({ ar: 'جديد', en: 'New' }, lang)}
                </span>
              </div>
              <p className="text-xs text-white/60 font-body leading-relaxed">
                {hasTakenPlacement
                  ? pickLang({
                      ar: `المستوى الموصى به: ${recommendedLevel ?? 'L0'} — تحدّث مع وليّ الأمر للتغيير`,
                      en: `Recommended level: ${recommendedLevel ?? 'L0'} — talk to the guardian to change`
                    }, lang)
                  : pickLang({ ar: '٤٠ سؤالاً — ١٠ دقيقة — يحدد نقطة البداية المثالية', en: '40 questions — 10 minutes — determines your ideal starting point' }, lang)}
              </p>
              <p
                className={`text-xs font-body mt-1 ${
                  hasTakenPlacement ? 'text-emerald-300' : 'text-gold-300'
                }`}
              >
                {hasTakenPlacement
                  ? pickLang({ ar: '🔒 لا يمكن إعادة الامتحان', en: '🔒 The test cannot be retaken' }, lang)
                  : pickLang({ ar: '🎯 مفتوح دائماً', en: '🎯 Always open' }, lang)}
              </p>
            </div>

            <div
              className={`shrink-0 self-center transition-colors ${
                hasTakenPlacement
                  ? 'text-emerald-300'
                  : 'text-gold-300 group-hover:text-gold-100'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={dir === 'rtl' ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* SOROBAN PLAYGROUND CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mb-6"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.01, y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => handleNav('soroban' as Screen)}
          className="group relative glass-card p-5 sm:p-6 text-start overflow-hidden w-full border-2 border-purple-400/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-electric-500 opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/30 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl shadow-purple-500/50">
              <Grid3X3 className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-black font-display text-white">
                  {pickLang({ ar: 'السوروبان التفاعلي', en: 'Interactive Soroban' }, lang)}
                </h4>
                <span className="px-2 py-0.5 rounded-lg bg-purple-400/30 text-purple-100 text-[10px] font-bold">
                  {pickLang({ ar: 'جديد', en: 'New' }, lang)}
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-body">
                Soroban Playground
              </p>
              <p className="text-xs text-white/60 font-body leading-relaxed mt-1">
                {pickLang({ ar: 'العب بالمعداد بحرية — اختر عدد الأعمدة (٣ / ٦ / ٩ / ١٣)', en: 'Play with the abacus freely — choose the number of columns (3 / 6 / 9 / 13)' }, lang)}
              </p>
              <p className="text-xs text-purple-300 font-body mt-1">
                {pickLang({ ar: '🎮 وضع حر — بلا أسئلة ولا مؤقت', en: '🎮 Free mode — no questions, no timer' }, lang)}
              </p>
            </div>

            <div className="shrink-0 self-center text-purple-300 group-hover:text-purple-100 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={dir === 'rtl' ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* FLASH LESSONS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13 }}
        className="mb-6"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.01, y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => handleNav('flash-list' as Screen)}
          className="group relative glass-card p-5 sm:p-6 text-start overflow-hidden w-full border-2 border-amber-400/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-rose-500 opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/30 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center shadow-xl shadow-amber-500/50">
              <Film className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-black font-display text-white">
                  {pickLang({ ar: 'الفلاشات التعليمية', en: 'Flash Lessons' }, lang)}
                </h4>
                <span className="px-2 py-0.5 rounded-lg bg-amber-400/30 text-amber-100 text-[10px] font-bold">
                  {pickLang({ ar: 'جديد', en: 'New' }, lang)}
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-body">
                Flash Lessons
              </p>
              <p className="text-xs text-white/60 font-body leading-relaxed mt-1">
                {pickLang({ ar: 'شروحات قصيرة — خطوة بخطوة مع الصوت والصورة', en: 'Short explanations — step by step with audio and visuals' }, lang)}
              </p>
              <p className="text-xs text-amber-300 font-body mt-1">
                {pickLang({ ar: '🎬 أساسيات · ضرب · قسمة', en: '🎬 Basics · Multiplication · Division' }, lang)}
              </p>
            </div>

            <div className="shrink-0 self-center text-amber-300 group-hover:text-amber-100 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={dir === 'rtl' ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* GAMES CITY CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="mb-6"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.01, y: -3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => { playSound('click'); setShowGames(true); }}
          className="group relative glass-card p-5 sm:p-6 text-start overflow-hidden w-full border-2 border-sky-400/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-fuchsia-500 opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-sky-500/30 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-sky-500/50">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-black font-display text-white">
                  {pickLang({ ar: 'مدينة الألعاب', en: 'Games City' }, lang)}
                </h4>
                <span className="px-2 py-0.5 rounded-lg bg-sky-400/30 text-sky-100 text-[10px] font-bold">
                  {pickLang({ ar: 'جديد', en: 'New' }, lang)}
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-body">
                Games City
              </p>
              <p className="text-xs text-white/60 font-body leading-relaxed mt-1">
                {pickLang({ ar: 'اجمع XP من الدروس → اشترِ تذكرة → العب', en: 'Collect XP from lessons → Buy a ticket → Play' }, lang)}
              </p>
              <p className="text-xs text-sky-300 font-body mt-1">
                {pickLang({ ar: '🎟️ 10 XP = تذكرة', en: '🎟️ 10 XP = Ticket' }, lang)}
              </p>
            </div>

            <div className="shrink-0 self-center text-sky-300 group-hover:text-sky-100 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={dir === 'rtl' ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* CATEGORY CARDS */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white/80 font-display mb-3 text-center">
          {pickLang({ ar: 'اختر قسمك', en: 'Choose your category' }, lang)}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORY_CARDS.map((card, i) => {
            const Icon = card.icon;

            return (
              <motion.button
                key={card.screen}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNav(card.screen)}
                className="group relative glass-card p-5 sm:p-6 text-start overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />

                <div className="relative flex items-start gap-4">
                  <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-xl ${card.glow}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-black font-display text-white">
                      {pickLang({ ar: card.title, en: card.titleEn }, lang)}
                    </h4>
                    {lang === 'ar' && (
                      <p className="text-xs text-white/40 font-body">
                        {card.titleEn}
                      </p>
                    )}
                    <p className={`text-sm font-bold font-body mt-2 bg-gradient-to-l ${card.gradient} bg-clip-text text-transparent`}>
                      {pickLang({ ar: card.ageRange, en: card.ageRangeEn }, lang)}
                    </p>
                    <p className="text-xs sm:text-sm text-white/60 font-body mt-2 leading-relaxed">
                      {pickLang({ ar: card.desc, en: card.descEn }, lang)}
                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="text-xs text-white/40 font-body">
                        {pickLang({ ar: 'المستويات:', en: 'Levels:' }, lang)}
                      </span>
                      <span className="text-sm font-bold text-white/80 font-display" dir={isArabic ? 'rtl' : 'ltr'}>
                        {card.levels.map((lvl) => formatNumber(lvl, numberStyle)).join(' · ')}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 self-center text-white/40 group-hover:text-white/80 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={dir === 'rtl' ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* CHARACTER SELECTOR MODAL */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-7 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
            >
              <button
                type="button"
                onClick={() => { playSound('click'); setShowSelector(false); }}
                className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                aria-label={pickLang({ ar: 'إغلاق', en: 'Close' }, lang)}
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
              <CharacterSelector onSelectCharacter={handleCompanionChange} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeroDashboard;