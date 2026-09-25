// src/screens/CategoryScreen.tsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Lock, CheckCircle2, BookOpen, Dumbbell, Eye,
  Volume2, Trophy, Sparkles, Play, Star,
  type LucideIcon,
} from 'lucide-react';

import type { Screen, CategoryId, LevelId } from '@/types';
import Header from './Header';
import { useGameStats } from '@/hooks/useGameStats';

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

interface CategoryScreenProps {
  category: CategoryId;
  onNavigate: (screen: Screen) => void;
  playSound: (type: 'click' | 'whoosh') => void;
}

interface LevelItem {
  id: LevelId;
  number: number;
  titleAr: string;
  titleEn: string;
  desc: string;
  icon: LucideIcon;
  gradient: string;
}

interface EnrichmentItem {
  title: string;
  desc: string;
  screen: Screen;
  icon: LucideIcon;
  gradient: string;
}

interface CategoryData {
  titleAr: string;
  titleEn: string;
  ageRange: string;
  gradient: string;
  levels: LevelItem[];
  enrichment: EnrichmentItem[];
  practiceRange: [number, number];
  anzanRange: [number, number];
  examScreen: Screen;
  examTitle: string;
}

// ═══════════════════════════════════════════════════════════
// بيانات القسمين
// ═══════════════════════════════════════════════════════════

const CATEGORY_DATA: Record<CategoryId, CategoryData> = {
  kids: {
    titleAr: 'الأبطال الصغار',
    titleEn: 'Young Heroes',
    ageRange: '٥ - ١٢ سنة',
    gradient: 'from-emerald-500 to-teal-700',
    practiceRange: [0, 3],
    anzanRange: [0, 3],
    examScreen: 'category-exam-1',
    examTitle: 'الامتحان النهائي — القسم الأول',
    enrichment: [
      {
        title: 'أسرار الضرب السحرية',
        desc: '٢٠ سراً لجدول الضرب',
        screen: 'secrets',
        icon: Sparkles,
        gradient: 'from-amber-500 to-rose-600',
      },
      {
        title: 'رياضيات الأصابع',
        desc: 'تعلّم الأعداد بأصابعك',
        screen: 'enrichment-1',
        icon: Star,
        gradient: 'from-pink-500 to-purple-600',
      },
    ],
    levels: [
      {
        id: 'L0',
        number: 0,
        titleAr: 'التمهيدي',
        titleEn: 'Foundation',
        desc: 'التعرّف على السوروبان + الأرقام + القيمة المكانية',
        icon: Star,
        gradient: 'from-emerald-500 to-teal-700',
      },
      {
        id: 'L1',
        number: 1,
        titleAr: 'الجمع والطرح',
        desc: 'جمع وطرح بسيط + مكملات 5 + مكملات 10',
        titleEn: 'Add & Subtract',
        icon: BookOpen,
        gradient: 'from-blue-500 to-cyan-700',
      },
      {
        id: 'L2',
        number: 2,
        titleAr: 'الضرب',
        titleEn: 'Multiplication',
        desc: 'الضرب على السوروبان',
        icon: Dumbbell,
        gradient: 'from-purple-500 to-violet-700',
      },
      {
        id: 'L3',
        number: 3,
        titleAr: 'القسمة',
        titleEn: 'Division',
        desc: 'القسمة على السوروبان',
        icon: Dumbbell,
        gradient: 'from-amber-500 to-orange-700',
      },
    ],
  },

  teens: {
    titleAr: 'الأبطال الكبار',
    titleEn: 'Champion Heroes',
    ageRange: '١٣+ سنة',
    gradient: 'from-purple-500 to-indigo-700',
    practiceRange: [4, 7],
    anzanRange: [4, 7],
    examScreen: 'category-exam-2',
    examTitle: 'الامتحان النهائي — القسم الثاني',
    enrichment: [
      {
        title: 'الضرب التقاطعي',
        desc: 'الضرب الفيدي المتقدم',
        screen: 'cross-multiplication',
        icon: Sparkles,
        gradient: 'from-cyan-500 to-blue-700',
      },
    ],
    levels: [
      {
        id: 'L4',
        number: 4,
        titleAr: 'جمع وطرح متقدم',
        titleEn: 'Advanced Add & Sub',
        desc: 'متعدد الخانات + عمليات مركبة',
        icon: BookOpen,
        gradient: 'from-blue-500 to-indigo-700',
      },
      {
        id: 'L5',
        number: 5,
        titleAr: 'ضرب وقسمة متقدم',
        titleEn: 'Advanced Mul & Div',
        desc: 'الضرب والقسمة بطرق متقدمة',
        icon: Dumbbell,
        gradient: 'from-purple-500 to-fuchsia-700',
      },
      {
        id: 'L6',
        number: 6,
        titleAr: 'الكسور العشرية',
        titleEn: 'Decimals',
        desc: 'العمليات على الأعداد العشرية',
        icon: Star,
        gradient: 'from-amber-500 to-rose-700',
      },
      {
        id: 'L7',
        number: 7,
        titleAr: 'الجذور',
        titleEn: 'Roots',
        desc: 'الجذور التربيعية والتكعيبية',
        icon: Sparkles,
        gradient: 'from-rose-500 to-purple-700',
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

/**
 * ✅ قراءة التقدم من localStorage.
 *
 * مُوسَّع ليشمل:
 *   - weakSkills (من Placement Test)
 *   - recommendedLevel (من Placement Test)
 */
function loadProgress() {
  try {
    const completedRaw = localStorage.getItem('soroban_completed_levels');
    const practiceRaw = localStorage.getItem('soroban_passed_practice');
    const anzanVRaw = localStorage.getItem('soroban_passed_anzan_visual');
    const anzanARaw = localStorage.getItem('soroban_passed_anzan_audio');
    const exam1Raw = localStorage.getItem('soroban_exam1_passed');
    const exam2Raw = localStorage.getItem('soroban_exam2_passed');
    const weakSkillsRaw = localStorage.getItem('soroban_placement_weak_skills');
    const recommendedRaw = localStorage.getItem('soroban_placement_recommended');

    return {
      completedLevels: completedRaw ? JSON.parse(completedRaw) : [],
      passedPractice: practiceRaw ? JSON.parse(practiceRaw) : [],
      passedAnzanVisual: anzanVRaw ? JSON.parse(anzanVRaw) : [],
      passedAnzanAudio: anzanARaw ? JSON.parse(anzanARaw) : [],
      exam1Passed: exam1Raw ? JSON.parse(exam1Raw) : false,
      exam2Passed: exam2Raw ? JSON.parse(exam2Raw) : false,
      // ✅ جديد: للتعليم التكيفي
      weakSkills: weakSkillsRaw ? JSON.parse(weakSkillsRaw) : [],
      recommendedLevel: recommendedRaw || null,
    };
  } catch {
    return {
      completedLevels: [],
      passedPractice: [],
      passedAnzanVisual: [],
      passedAnzanAudio: [],
      exam1Passed: false,
      exam2Passed: false,
      weakSkills: [],
      recommendedLevel: null,
    };
  }
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function CategoryScreen({ category, onNavigate, playSound }: CategoryScreenProps) {
  const data = CATEGORY_DATA[category];
  const [progress, setProgress] = useState(loadProgress());

  // ✅ لـ Header
  const { stats, toggleSound } = useGameStats();

  useEffect(() => {
    setProgress(loadProgress());
  }, [category]);

  const handleNav = (screen: Screen) => {
    playSound('click');
    onNavigate(screen);
  };

  const goHome = () => {
    playSound('click');
    onNavigate('hero-dashboard');
  };

  const isLevelUnlocked = (levelId: LevelId, index: number): boolean => {
    if (index === 0) return true;
    const prevLevel = data.levels[index - 1];
    return progress.completedLevels.includes(prevLevel.id);
  };

  const isLevelCompleted = (levelId: LevelId): boolean => {
    return progress.completedLevels.includes(levelId);
  };

  const isPracticeUnlocked = (levelIndex: number): boolean => {
    const level = data.levels[levelIndex];
    return progress.completedLevels.includes(level.id);
  };

  const isPracticePassed = (levelIndex: number): boolean => {
    const practiceNum = data.practiceRange[0] + levelIndex;
    return progress.passedPractice.includes(practiceNum);
  };

  const isAnzanVisualUnlocked = (levelIndex: number): boolean => {
    return isPracticePassed(levelIndex);
  };

  const isAnzanVisualPassed = (levelIndex: number): boolean => {
    const anzanNum = data.anzanRange[0] + levelIndex;
    return progress.passedAnzanVisual.includes(anzanNum);
  };

  const isAnzanAudioUnlocked = (levelIndex: number): boolean => {
    return isAnzanVisualPassed(levelIndex);
  };

  const isAnzanAudioPassed = (levelIndex: number): boolean => {
    const anzanNum = data.anzanRange[0] + levelIndex;
    return progress.passedAnzanAudio.includes(anzanNum);
  };

  const isExamUnlocked = (): boolean => {
    return data.levels.every((_, idx) =>
      isLevelCompleted(data.levels[idx].id) &&
      isPracticePassed(idx) &&
      isAnzanVisualPassed(idx) &&
      isAnzanAudioPassed(idx)
    );
  };

  const isExamPassed = category === 'kids' ? progress.exam1Passed : progress.exam2Passed;

  // ═══════════════════════════════════════════════════════
  // Render Level Card
  // ═══════════════════════════════════════════════════════

  const renderLevelCard = (level: LevelItem, idx: number) => {
    const Icon = level.icon;
    const unlocked = isLevelUnlocked(level.id, idx);
    const completed = isLevelCompleted(level.id);
    const practiceUnlocked = isPracticeUnlocked(idx);
    const practicePassed = isPracticePassed(idx);
    const anzanVUnlocked = isAnzanVisualUnlocked(idx);
    const anzanVPassed = isAnzanVisualPassed(idx);
    const anzanAUnlocked = isAnzanAudioUnlocked(idx);
    const anzanAPassed = isAnzanAudioPassed(idx);

    const practiceNum = data.practiceRange[0] + idx;
    const anzanNum = data.anzanRange[0] + idx;

    // ✅ المستوى المُوصى به من Placement Test
    const isRecommended = progress.recommendedLevel === level.id;

    return (
      <div
        key={level.id}
        className={`glass-card p-4 sm:p-5 overflow-hidden transition-all ${
          !unlocked ? 'opacity-60' : ''
        } ${
          isRecommended
            ? 'border-2 border-gold-400/60 shadow-lg shadow-gold-500/20'
            : ''
        }`}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${level.gradient} flex items-center justify-center shadow-lg ${!unlocked ? 'grayscale' : ''}`}>
            {unlocked ? <Icon className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base sm:text-lg font-extrabold font-display text-white">
                {toArabicNumber(level.number)} — {level.titleAr}
              </h4>
              {completed && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isRecommended && (
                <span className="px-2 py-0.5 rounded-lg bg-gold-400/30 text-gold-100 text-[10px] font-bold whitespace-nowrap">
                  🎯 ابدأ هنا
                </span>
              )}
            </div>
            <p className="text-[10px] text-white/40 font-body">
              {level.titleEn}
            </p>
            <p className="text-xs text-white/60 font-body mt-1 leading-snug">
              {level.desc}
            </p>
          </div>
        </div>

        {unlocked && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {/* زر الدرس */}
            <button
              type="button"
              onClick={() => handleNav(`lesson-${level.id}` as Screen)}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                completed
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                  : 'bg-gradient-to-l ' + level.gradient + ' text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {completed ? 'مراجعة' : 'الدرس'}
            </button>

            {/* زر تمرّن */}
            <button
              type="button"
              onClick={() => practiceUnlocked && handleNav(`practice-${practiceNum}` as Screen)}
              disabled={!practiceUnlocked}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                practicePassed
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                  : practiceUnlocked
                    ? 'bg-blue-500/20 text-blue-200 border border-blue-400/40'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              }`}
            >
              {!practiceUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Dumbbell className="w-3.5 h-3.5" />}
              تمرّن {toArabicNumber(practiceNum)}
            </button>

            {/* زر أنزان بصري */}
            <button
              type="button"
              onClick={() => anzanVUnlocked && handleNav(`anzan-${anzanNum}` as Screen)}
              disabled={!anzanVUnlocked}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                anzanVPassed
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                  : anzanVUnlocked
                    ? 'bg-purple-500/20 text-purple-200 border border-purple-400/40'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              }`}
            >
              {!anzanVUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              أنزان بصري
            </button>

            {/* زر أنزان سمعي */}
            <button
              type="button"
              onClick={() => anzanAUnlocked && handleNav(`audio-anzan-${anzanNum}` as Screen)}
              disabled={!anzanAUnlocked}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                anzanAPassed
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                  : anzanAUnlocked
                    ? 'bg-rose-500/20 text-rose-200 border border-rose-400/40'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              }`}
            >
              {!anzanAUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              أنزان سمعي
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ✅ Header كامل */}
      <Header
        xp={stats.xp}
        streak={stats.streak}
        level={stats.level}
        soundEnabled={stats.soundEnabled}
        onToggleSound={toggleSound}
        onHome={goHome}
      />

      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {data.titleAr}
          </h2>
          <p className="text-sm text-white/50 font-body">
            {data.ageRange} · {data.titleEn}
          </p>
        </div>

        {/* Enrichment Section */}
        {data.enrichment.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold-300" />
              <h3 className="text-lg font-bold text-white/80 font-display">
                إثراء ممتع
              </h3>
              <span className="text-[10px] text-white/40 font-body">(مفتوح دائماً)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.enrichment.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.screen}
                    type="button"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNav(item.screen)}
                    className="group relative glass-card p-4 text-right overflow-hidden flex items-center gap-3"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                    <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 relative">
                      <h4 className="text-sm font-bold font-display text-white">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-white/50 font-body mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Lessons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-white/60" />
            <h3 className="text-lg font-bold text-white/80 font-display">
              المستويات
            </h3>
            <span className="text-[10px] text-white/40 font-body">
              (متسلسلة — كل مستوى يُفتح بعد السابق)
            </span>
          </div>

          <div className="space-y-4">
            {data.levels.map((level, idx) => renderLevelCard(level, idx))}
          </div>
        </motion.div>

        {/* Exam Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 overflow-hidden relative"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/15 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl shadow-gold-500/40 ${!isExamUnlocked() ? 'grayscale' : ''}`}>
              {isExamUnlocked() ? <Trophy className="w-7 h-7 text-white" /> : <Lock className="w-7 h-7 text-white" />}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-extrabold font-display text-white">
                {data.examTitle}
              </h3>
              <p className="text-xs text-white/60 font-body mt-0.5">
                {isExamUnlocked()
                  ? isExamPassed
                    ? '✅ نجحت في هذا الامتحان'
                    : '🎯 جاهز للامتحان! بدرجة نجاح ٨٠٪'
                  : '🔒 يُفتح بعد إتمام كل المستويات + تمرّن + أنزان'}
              </p>
            </div>
          </div>

          {isExamUnlocked() && !isExamPassed && (
            <button
              type="button"
              onClick={() => handleNav(data.examScreen)}
              className="relative mt-4 w-full py-3 rounded-2xl bg-gradient-to-l from-gold-400 to-amber-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 transition-shadow"
            >
              <Play className="w-5 h-5" />
              ابدأ الامتحان
            </button>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default CategoryScreen;