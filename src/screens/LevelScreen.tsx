// src/screens/LevelScreen.tsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ArrowRight, BookOpen, Lightbulb, Dumbbell, Eye, Volume2,
  Lock, CheckCircle2, Trophy, Play, Star,
  type LucideIcon,
} from 'lucide-react';

import type { Screen, LevelId } from '@/types';

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

interface LevelScreenProps {
  levelId: LevelId;
  onNavigate?: (screen: Screen) => void;
  onBack?: () => void;
  playSound?: (type: 'click' | 'whoosh') => void;
}

interface LevelInfo {
  id: LevelId;
  number: number;
  titleAr: string;
  titleEn: string;
  desc: string;
  gradient: string;
  categoryId: 'kids' | 'teens';
  categoryScreen: Screen;
  practiceNum: number;
  anzanNum: number;
}

// ═══════════════════════════════════════════════════════════
// بيانات المستويات L0-L7
// ═══════════════════════════════════════════════════════════

const LEVELS_DATA: Record<LevelId, LevelInfo> = {
  L0: {
    id: 'L0', number: 0,
    titleAr: 'التمهيدي',
    titleEn: 'Foundation',
    desc: 'التعرّف على السوروبان والأرقام من ٠ إلى ٩ والقيمة المكانية',
    gradient: 'from-emerald-500 to-teal-700',
    categoryId: 'kids', categoryScreen: 'category-kids',
    practiceNum: 0, anzanNum: 0,
  },
  L1: {
    id: 'L1', number: 1,
    titleAr: 'الجمع والطرح',
    titleEn: 'Addition & Subtraction',
    desc: 'جمع وطرح بسيط + مكملات ٥ + مكملات ١٠ + عمليات مختلطة',
    gradient: 'from-blue-500 to-cyan-700',
    categoryId: 'kids', categoryScreen: 'category-kids',
    practiceNum: 1, anzanNum: 1,
  },
  L2: {
    id: 'L2', number: 2,
    titleAr: 'الضرب',
    titleEn: 'Multiplication',
    desc: 'الضرب على السوروبان بطريقة تاكاشي',
    gradient: 'from-purple-500 to-violet-700',
    categoryId: 'kids', categoryScreen: 'category-kids',
    practiceNum: 2, anzanNum: 2,
  },
  L3: {
    id: 'L3', number: 3,
    titleAr: 'القسمة',
    titleEn: 'Division',
    desc: 'القسمة على السوروبان — التقدير والطرح المتتالي',
    gradient: 'from-amber-500 to-orange-700',
    categoryId: 'kids', categoryScreen: 'category-kids',
    practiceNum: 3, anzanNum: 3,
  },
  L4: {
    id: 'L4', number: 4,
    titleAr: 'جمع وطرح متقدم',
    titleEn: 'Advanced Add & Sub',
    desc: 'متعدد الخانات والسلاسل المركبة',
    gradient: 'from-blue-500 to-indigo-700',
    categoryId: 'teens', categoryScreen: 'category-teens',
    practiceNum: 4, anzanNum: 4,
  },
  L5: {
    id: 'L5', number: 5,
    titleAr: 'ضرب وقسمة متقدم',
    titleEn: 'Advanced Mul & Div',
    desc: 'الضرب والقسمة بطرق تاكاشي المتقدمة',
    gradient: 'from-purple-500 to-fuchsia-700',
    categoryId: 'teens', categoryScreen: 'category-teens',
    practiceNum: 5, anzanNum: 5,
  },
  L6: {
    id: 'L6', number: 6,
    titleAr: 'الكسور العشرية',
    titleEn: 'Decimals',
    desc: 'العمليات على الأعداد العشرية',
    gradient: 'from-amber-500 to-rose-700',
    categoryId: 'teens', categoryScreen: 'category-teens',
    practiceNum: 6, anzanNum: 6,
  },
  L7: {
    id: 'L7', number: 7,
    titleAr: 'الجذور',
    titleEn: 'Roots',
    desc: 'الجذور التربيعية والتكعيبية',
    gradient: 'from-rose-500 to-purple-700',
    categoryId: 'teens', categoryScreen: 'category-teens',
    practiceNum: 7, anzanNum: 7,
  },
};

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

function loadProgress() {
  try {
    return {
      completedLevels: JSON.parse(localStorage.getItem('soroban_completed_levels') || '[]'),
      passedPractice: JSON.parse(localStorage.getItem('soroban_passed_practice') || '[]'),
      passedAnzanVisual: JSON.parse(localStorage.getItem('soroban_passed_anzan_visual') || '[]'),
      passedAnzanAudio: JSON.parse(localStorage.getItem('soroban_passed_anzan_audio') || '[]'),
    };
  } catch {
    return {
      completedLevels: [],
      passedPractice: [],
      passedAnzanVisual: [],
      passedAnzanAudio: [],
    };
  }
}

// ═══════════════════════════════════════════════════════════
// المكون
// ═══════════════════════════════════════════════════════════

interface SectionCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  locked: boolean;
  completed: boolean;
  progress?: number;
  onClick: () => void;
  playSound: (type: 'click' | 'whoosh') => void;
}

function SectionCard({
  title, subtitle, icon: Icon, gradient,
  locked, completed, progress = 0, onClick, playSound,
}: SectionCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={!locked ? { scale: 1.02, y: -2 } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      onClick={() => {
        if (locked) { playSound('whoosh'); return; }
        onClick();
      }}
      disabled={locked}
      className={`group relative glass-card p-4 text-right overflow-hidden w-full ${
        locked ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />

      <div className="relative flex items-start gap-3">
        <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${locked ? 'grayscale' : ''}`}>
          {locked ? <Lock className="w-6 h-6 text-white" /> : <Icon className="w-6 h-6 text-white" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold font-display text-white">{title}</h4>
            {completed && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          </div>
          <p className="text-xs text-white/50 font-body mt-0.5 leading-snug">{subtitle}</p>

          {!locked && progress > 0 && (
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {!locked && (
          <div className="shrink-0 self-center text-white/40 group-hover:text-white/80 transition-colors">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function LevelScreen({ levelId, onNavigate, playSound }: LevelScreenProps) {
  const level = LEVELS_DATA[levelId];
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    setProgress(loadProgress());
  }, [levelId]);

  const handleNav = (screen: Screen) => {
    playSound('click');
    onNavigate(screen);
  };

  const goBack = () => {
    playSound('click');
    onNavigate(level.categoryScreen);
  };

  const isLessonCompleted = progress.completedLevels.includes(levelId);
  const isPracticePassed = progress.passedPractice.includes(level.practiceNum);
  const isAnzanVisualPassed = progress.passedAnzanVisual.includes(level.anzanNum);
  const isAnzanAudioPassed = progress.passedAnzanAudio.includes(level.anzanNum);

  // منطق القفل
  const practiceLocked = !isLessonCompleted;
  const anzanVisualLocked = !isPracticePassed;
  const anzanAudioLocked = !isAnzanVisualPassed;

  const completionPct =
    ([isLessonCompleted, isPracticePassed, isAnzanVisualPassed, isAnzanAudioPassed]
      .filter(Boolean).length / 4) * 100;

  return (
    <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={goBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Star className={`w-5 h-5 text-gold-300`} />
            <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white truncate">
              {toArabicNumber(level.number)} — {level.titleAr}
            </h2>
          </div>
          <p className="text-xs text-white/50 font-body mt-0.5">
            {level.titleEn}
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 mb-6 overflow-hidden relative"
      >
        <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${level.gradient} opacity-20 blur-3xl`} />

        <div className="relative">
          <p className="text-sm text-white/70 font-body leading-relaxed mb-4">
            {level.desc}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold-300" />
              <span className="text-xs text-white/60 font-body">التقدم:</span>
              <span className="text-sm font-bold text-gold-300 font-display">
                {toArabicNumber(Math.round(completionPct))}٪
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isLessonCompleted && <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 font-bold">درس ✓</span>}
              {isPracticePassed && <span className="text-[10px] px-2 py-1 rounded-lg bg-blue-500/20 text-blue-200 font-bold">تمرّن ✓</span>}
              {isAnzanVisualPassed && <span className="text-[10px] px-2 py-1 rounded-lg bg-purple-500/20 text-purple-200 font-bold">بصري ✓</span>}
              {isAnzanAudioPassed && <span className="text-[10px] px-2 py-1 rounded-lg bg-rose-500/20 text-rose-200 font-bold">سمعي ✓</span>}
            </div>
          </div>

          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${level.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-3">
        {/* 📖 تعلّم */}
        <SectionCard
          title="📖 تعلّم"
          subtitle="القصة + المفهوم + الأمثلة المحلولة"
          icon={BookOpen}
          gradient={level.gradient}
          locked={false}
          completed={isLessonCompleted}
          onClick={() => handleNav(`lesson-${levelId}` as Screen)}
          playSound={playSound}
        />

        {/* 💡 جرّب */}
        <SectionCard
          title="💡 جرّب"
          subtitle="أمثلة بدون حل — بلا مؤقّت"
          icon={Lightbulb}
          gradient="from-pink-500 to-rose-600"
          locked={false}
          completed={false}
          onClick={() => handleNav(`lesson-${levelId}` as Screen)}
          playSound={playSound}
        />

        {/* ✏️ تمرّن */}
        <SectionCard
          title={`✏️ تمرّن ${toArabicNumber(level.practiceNum)}`}
          subtitle={
            practiceLocked
              ? '🔒 يُفتح بعد إنهاء الدرس'
              : isPracticePassed
                ? '✅ نجحت في هذا التمرّن'
                : 'أسئلة تكيفية من البنك'
          }
          icon={Dumbbell}
          gradient="from-blue-500 to-cyan-700"
          locked={practiceLocked}
          completed={isPracticePassed}
          onClick={() => handleNav(`practice-${level.practiceNum}` as Screen)}
          playSound={playSound}
        />

        {/* 🧠 أنزان بصري */}
        <SectionCard
          title="🧠 أنزان بصري"
          subtitle={
            anzanVisualLocked
              ? '🔒 يُفتح بعد النجاح في تمرّن'
              : isAnzanVisualPassed
                ? '✅ نجحت في الأنزان البصري'
                : 'أرقام تومض — احسب بذهنك'
          }
          icon={Eye}
          gradient="from-purple-500 to-violet-700"
          locked={anzanVisualLocked}
          completed={isAnzanVisualPassed}
          onClick={() => handleNav(`anzan-${level.anzanNum}` as Screen)}
          playSound={playSound}
        />

        {/* 🎧 أنزان سمعي */}
        <SectionCard
          title="🎧 أنزان سمعي"
          subtitle={
            anzanAudioLocked
              ? '🔒 يُفتح بعد النجاح في الأنزان البصري'
              : isAnzanAudioPassed
                ? '✅ نجحت في الأنزان السمعي'
                : 'اسمع الأرقام واحسب ذهنياً'
          }
          icon={Volume2}
          gradient="from-rose-500 to-pink-700"
          locked={anzanAudioLocked}
          completed={isAnzanAudioPassed}
          onClick={() => handleNav(`anzan-${level.anzanNum}` as Screen)}
          playSound={playSound}
        />
      </div>

      {/* نجاح كامل */}
      {isLessonCompleted && isPracticePassed && isAnzanVisualPassed && isAnzanAudioPassed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 glass-card p-5 text-center overflow-hidden relative"
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold-500/20 blur-3xl" />
          <div className="relative">
            <Trophy className="w-12 h-12 text-gold-300 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold font-display text-white mb-1">
              🎉 أتممت هذا المستوى!
            </h3>
            <p className="text-sm text-white/60 font-body mb-4">
              يمكنك الانتقال للمستوى التالي
            </p>
            <button
              type="button"
              onClick={goBack}
              className="btn-primary w-full"
            >
              <Play className="w-5 h-5" />
              العودة إلى القسم
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default LevelScreen;