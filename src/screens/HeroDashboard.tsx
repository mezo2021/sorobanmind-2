// src/screens/HeroDashboard.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Sparkles, Flame, Brain, Zap, Palette, Trash2,
  Unlock, X, Award, Users, Trophy,
  type LucideIcon,
} from 'lucide-react';

import type { Screen, CharacterType } from '@/types';
import { Companion } from '@/components/Companion';
import { CharacterSelector } from '@/components/CharacterSelector';

interface HeroDashboardProps {
  onNavigate: (screen: Screen) => void;
  playSound: (type: 'click' | 'whoosh') => void;
  xp: number;
  streak: number;
  earnedBadges: string[];
}

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

const CHARACTER_INFO: Record<
  CharacterType,
  { name: string; title: string; message: string; color: string; lightColor: string }
> = {
  sham: {
    name: 'شام',
    title: 'البطلة الذكية',
    message: 'لنكتشف اليوم طريقة جديدة للحساب!',
    color: 'from-violet-500 to-purple-700',
    lightColor: 'text-violet-300',
  },
  rayan: {
    name: 'ريان',
    title: 'البطل السريع',
    message: 'هل أنت مستعد لتحدٍ جديد؟ هيا نبدأ!',
    color: 'from-blue-500 to-indigo-700',
    lightColor: 'text-blue-300',
  },
  bana: {
    name: 'بانة',
    title: 'البطلة الهادئة',
    message: 'التركيز الهادئ يصنع نتائج رائعة.',
    color: 'from-teal-400 to-emerald-700',
    lightColor: 'text-teal-300',
  },
  joud: {
    name: 'جود',
    title: 'البطل الذكي',
    message: 'أحب التفكير والتحليل — هيا نحل معًا!',
    color: 'from-indigo-500 to-purple-700',
    lightColor: 'text-indigo-300',
  },
};

// ═══════════════════════════════════════════════════════════
// بطاقتا القسمين
// ═══════════════════════════════════════════════════════════

interface CategoryCard {
  screen: Screen;
  title: string;
  titleEn: string;
  ageRange: string;
  desc: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
  levels: string[];
  levelsAr: string;
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    screen: 'category-kids',
    title: 'الأبطال الصغار',
    titleEn: 'Young Heroes',
    ageRange: '٥ - ١٢ سنة',
    desc: 'التأسيس: التعرّف على السوروبان، الأرقام، الجمع والطرح، الضرب والقسمة',
    icon: Users,
    gradient: 'from-emerald-500 to-teal-700',
    glow: 'shadow-emerald-500/40',
    levels: ['L0', 'L1', 'L2', 'L3'],
    levelsAr: '٠ · ١ · ٢ · ٣',
  },
  {
    screen: 'category-teens',
    title: 'الأبطال الكبار',
    titleEn: 'Champion Heroes',
    ageRange: '١٣+ سنة',
    desc: 'المتقدم: العمليات المركبة، الضرب والقسمة المتقدمة، الأعداد العشرية والجذور',
    icon: Trophy,
    gradient: 'from-purple-500 to-indigo-700',
    glow: 'shadow-purple-500/40',
    levels: ['L4', 'L5', 'L6', 'L7'],
    levelsAr: '٤ · ٥ · ٦ · ٧',
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
  earnedBadges: _earnedBadges,
}: HeroDashboardProps) {
  const [companion, setCompanion] = useState<CharacterType>('sham');
  const [showSelector, setShowSelector] = useState(false);
  const [childName, setChildName] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [examPassed, setExamPassed] = useState(false);

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

    try {
      const raw = localStorage.getItem('soroban_exam_result');
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.passed === true) setExamPassed(true);
      }
    } catch { /* ignore */ }
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

  const handleTestUnlock = () => {
    try {
      localStorage.setItem(
        'soroban_exam_result',
        JSON.stringify({ score: 100, passed: true, date: Date.now() }),
      );
      localStorage.setItem(
        'soroban_exam2_result',
        JSON.stringify({ score: 100, passed: true, date: Date.now() }),
      );
      localStorage.setItem(
        'soroban-completed-lessons',
        JSON.stringify(['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7']),
      );
      localStorage.setItem(
        'soroban_anzan_badges',
        JSON.stringify({
          master_addition: true,
          master_multiplication: true,
          master_division: true,
          master_mixed: true,
        }),
      );
      localStorage.setItem(
        'soroban_anzan_audio_badges',
        JSON.stringify({
          master_addition_audio: true,
          master_multiplication_audio: true,
          master_division_audio: true,
        }),
      );

      setExamPassed(true);
      playSound('click');
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      window.alert('خطأ: ' + String(err));
    }
  };

  const handleReset = () => {
    const keysToKeep = ['soroban_companion', 'soroban_child_name'];
    Object.keys(localStorage).forEach((key) => {
      if (!keysToKeep.includes(key)) localStorage.removeItem(key);
    });
    playSound('whoosh');
    setShowResetConfirm(false);
    window.location.reload();
  };

  const characterInfo = CHARACTER_INFO[companion];

  return (
    <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-6xl mx-auto">
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
                أكاديمية الأبطال الصغار
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              مرحباً يا {childName || 'أيها البطل'}!
            </h2>
            <p className="text-white/60 font-body text-sm mt-1">
              واصل رحلتك في إتقان الحساب الذهني بالسوروبان
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-center px-4 py-2 rounded-2xl bg-purple-500/15 border border-purple-400/20">
              <p className="text-2xl font-extrabold text-purple-300 font-display">
                {toArabicNumber(xp)}
              </p>
              <p className="text-[10px] text-white/50 font-body">نقطة خبرة</p>
            </div>

            <div className="text-center px-4 py-2 rounded-2xl bg-orange-500/15 border border-orange-400/20">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-300" />
                <p className="text-2xl font-extrabold text-orange-300 font-display">
                  {toArabicNumber(streak)}
                </p>
              </div>
              <p className="text-[10px] text-white/50 font-body">أيام متتالية</p>
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
            <span>تغيير الرفيق</span>
          </button>

          <button
            type="button"
            onClick={handleTestUnlock}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/30 transition-all text-xs font-bold font-body"
            title="فتح كل الدروس والامتحانات للاختبار"
          >
            <Unlock className="w-4 h-4" />
            <span>فتح الكل</span>
          </button>

          <button
            type="button"
            onClick={() => { playSound('click'); setShowResetConfirm(true); }}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500/20 transition-all text-xs font-body"
          >
            <Trash2 className="w-4 h-4" />
            <span>تصفير</span>
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

          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-400/20 mb-2">
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span className="text-xs font-bold text-violet-200 font-body">رفيق رحلتك</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black font-display text-white">{characterInfo.name}</h3>
            <p className={`text-sm font-bold font-body mt-1 ${characterInfo.lightColor}`}>{characterInfo.title}</p>
            <p className="text-sm text-white/60 font-body mt-3 leading-relaxed">{characterInfo.message}</p>

            <div className="flex items-center justify-center md:justify-start gap-2 mt-4 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Brain className="w-4 h-4 text-purple-300" />
                <span className="text-xs text-white/60 font-body">تدريب العقل</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Zap className="w-4 h-4 text-gold-300" />
                <span className="text-xs text-white/60 font-body">تطوير السرعة</span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col gap-2 justify-center">
            <button
              type="button"
              onClick={() => { playSound('click'); setShowSelector(true); }}
              className="flex-1 md:flex-none px-4 py-3 rounded-2xl bg-violet-500/15 border border-violet-400/20 text-violet-200 hover:bg-violet-500/25 transition-all text-xs font-bold font-body"
            >
              تغيير الرفيق
            </button>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-lg font-black text-gold-300 font-display">{toArabicNumber(xp)}</p>
              <p className="text-[10px] text-white/40 font-body">خبرة البطل</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CATEGORY CARDS (2 بطاقات كبيرة) */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white/80 font-display mb-3 text-center">
          اختر قسمك
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
                transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNav(card.screen)}
                className="group relative glass-card p-5 sm:p-6 text-right overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />

                <div className="relative flex items-start gap-4">
                  <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-xl ${card.glow}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-black font-display text-white">
                      {card.title}
                    </h4>
                    <p className="text-xs text-white/40 font-body">
                      {card.titleEn}
                    </p>
                    <p className={`text-sm font-bold font-body mt-2 bg-gradient-to-l ${card.gradient} bg-clip-text text-transparent`}>
                      {card.ageRange}
                    </p>
                    <p className="text-xs sm:text-sm text-white/60 font-body mt-2 leading-relaxed">
                      {card.desc}
                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="text-xs text-white/40 font-body">المستويات:</span>
                      <span className="text-sm font-bold text-white/80 font-display">
                        {card.levelsAr}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 self-center text-white/40 group-hover:text-white/80 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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
                aria-label="إغلاق"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
              <CharacterSelector onSelectCharacter={handleCompanionChange} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESET CONFIRMATION */}
      <AnimatePresence>
        {showResetConfirm && (
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
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-red-500/30 text-center"
              dir="rtl"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-300" />
              </div>
              <h3 className="text-xl font-extrabold font-display text-white mb-2">تصفير التقدم؟</h3>
              <p className="text-sm text-white/60 font-body mb-6 leading-relaxed">
                سيتم حذف جميع نقاط الخبرة، الشارات، والدروس المكتملة.
                <br />
                <span className="text-emerald-300">الرفيق والاسم سيُحفظان.</span>
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-primary flex-1 !bg-gradient-to-br !from-red-500 !to-red-700"
                >
                  نعم، صفّر
                </button>
                <button
                  type="button"
                  onClick={() => { playSound('click'); setShowResetConfirm(false); }}
                  className="btn-ghost flex-1"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeroDashboard;