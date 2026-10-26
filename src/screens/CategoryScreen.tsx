// src/screens/CategoryScreen.tsx
// [FIX 7] — unified preview check via utility
// [FIX N69] — display Visual Anzan (average) and Audio grades on the buttons
// [SURGICAL FIX] — rely on exam grades (>=80%) to unlock levels and show the completion mark

import { motion } from 'framer-motion';
import {
  Lock, CheckCircle2, BookOpen, Dumbbell, Eye,
  Volume2, Trophy, Sparkles, Play, Star,
  type LucideIcon,
} from 'lucide-react';

import type { Screen, CategoryId, LevelId } from '@/types';
import type { SRBLevel } from '@/data/srb-adapter';
import Header from './Header';
import { useGameStats } from '@/hooks/useGameStats';
import { useProgressStore } from '@/store/progressStore';
import { getLessonsByLevel } from '@/curriculum/lessons';

// [FIX 7] — preview tool
import { isPreviewMode } from '@/utils/previewMode';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatNumber } from '@/utils/numberStyle';

// 🌍 i18n
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import { translateDynamic } from '@/utils/translateDynamic';

// ═══════════════════════════════════════════════════════════
// Types
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
// Category data
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
        title: 'أسرار الضرب',
        desc: '٢٠ سراً لجدول الضرب',
        screen: 'magic-secrets',
        icon: Sparkles,
        gradient: 'from-amber-500 to-rose-600',
      },
      {
        title: 'رياضيات الأصابع',
        desc: 'تعلّم الأعداد بأصابعك',
        screen: 'finger-math',
        icon: Star,
        gradient: 'from-pink-500 to-purple-600',
      },
    ],
    levels: [
      {
        id: 'L0', number: 0,
        titleAr: 'التمهيدي', titleEn: 'Foundation',
        desc: 'التعرّف على السوروبان + الأرقام + القيمة المكانية',
        icon: Star, gradient: 'from-emerald-500 to-teal-700',
      },
      {
        id: 'L1', number: 1,
        titleAr: 'الجمع والطرح', titleEn: 'Add & Subtract',
        desc: 'جمع وطرح بسيط + أصدقاء 5 + أصدقاء 10',
        icon: BookOpen, gradient: 'from-blue-500 to-cyan-700',
      },
      {
        id: 'L2', number: 2,
        titleAr: 'الضرب', titleEn: 'Multiplication',
        desc: 'الضرب على السوروبان بطريقة تاكاشي',
        icon: Dumbbell, gradient: 'from-amber-500 to-orange-700',
      },
      {
        id: 'L3', number: 3,
        titleAr: 'القسمة', titleEn: 'Division',
        desc: 'القسمة على السوروبان — التقدير والطرح المتتالي',
        icon: Dumbbell, gradient: 'from-blue-500 to-indigo-700',
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
        id: 'L4', number: 4,
        titleAr: 'سلاسل الجمع والطرح', titleEn: 'Add & Sub Chains',
        desc: 'سلاسل الجمع والطرح المتعددة',
        icon: BookOpen, gradient: 'from-purple-500 to-violet-700',
      },
      {
        id: 'L5', number: 5,
        titleAr: 'ضرب وقسمة متقدم', titleEn: 'Advanced Mul & Div',
        desc: 'الضرب والقسمة بطرق متقدمة',
        icon: Dumbbell, gradient: 'from-purple-500 to-fuchsia-700',
      },
      {
        id: 'L6', number: 6,
        titleAr: 'الكسور العشرية', titleEn: 'Decimals',
        desc: 'العمليات على الأعداد العشرية',
        icon: Star, gradient: 'from-amber-500 to-rose-700',
      },
      {
        id: 'L7', number: 7,
        titleAr: 'الجذور', titleEn: 'Roots',
        desc: 'الجذور التربيعية الكاملة',
        icon: Sparkles, gradient: 'from-rose-500 to-purple-700',
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════

// 🔢 Follows the number-style toggle (Arabic ٠١٢٣ ↔ Latin 0123) — name preserved for compatibility
function toArabicNumber(value: number | string): string {
  return formatNumber(value, useNumberStyleStore.getState().style);
}

function loadPlacementData() {
  try {
    const weakSkillsRaw = localStorage.getItem('soroban_placement_weak_skills');
    const recommendedRaw = localStorage.getItem('soroban_placement_recommended');
    
    // Read pass state from the store (single source of truth)
    const store = useProgressStore.getState();

    return {
      weakSkills: weakSkillsRaw ? JSON.parse(weakSkillsRaw) : [],
      recommendedLevel: recommendedRaw || null,
      exam1Passed: store.exam1Passed,
      exam2Passed: store.exam2Passed,
    };
  } catch {
    return { weakSkills: [], recommendedLevel: null, exam1Passed: false, exam2Passed: false };
  }
}

// ═══════════════════════════════════════════════════════════
// Main Screen
// ═══════════════════════════════════════════════════════════

export function CategoryScreen({ category, onNavigate, playSound }: CategoryScreenProps) {
  const { lang, dir } = useT();

  useNumberStyleStore((s) => s.style); // 🔢 re-render on number-style toggle
  const data = CATEGORY_DATA[category];
  const { stats, toggleSound } = useGameStats();

  // ─── progressStore ───
  const completedLevels = useProgressStore((s) => s.completedLevels);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const passedPractice = useProgressStore((s) => s.passedPractice);
  const passedAnzanVisual = useProgressStore((s) => s.passedAnzanVisual);
  const passedAnzanAudio = useProgressStore((s) => s.passedAnzanAudio);
  const grades = useProgressStore((s) => s.grades);
  const pendingRemediation = useProgressStore((s) => s.pendingRemediation);

  // ─── placement / exams (localStorage temporarily) ───
  const placement = loadPlacementData();

  const handleNav = (screen: Screen) => {
    playSound('click');
    onNavigate(screen);
  };

  const goHome = () => {
    playSound('click');
    onNavigate('hero-dashboard');
  };

  // [FIX 7] — use the preview tool
  const inPreview = isPreviewMode();

  // ✅ [SURGICAL FIX] — a level unlocks only if the previous level's test grade is >= 80%
  const isLevelUnlocked = (levelId: LevelId, index: number): boolean => {
    if (inPreview) return true;
    if (placement.recommendedLevel === levelId) return true;
    if (index === 0) return true;

    const prevLevel = data.levels[index - 1];
    const prevGrade = grades[prevLevel.id];
    
    return prevGrade && prevLevel && grades[prevLevel.id]?.levelTest !== null && grades[prevLevel.id]!.levelTest! >= 80;
  };

  // ✅ A level is "completed" (for unlocking Practice) = all its lessons are complete
  const isLevelCompleted = (levelId: LevelId): boolean => {
    if (inPreview) return true;
    const lessons = getLessonsByLevel(levelId as string);
    if (lessons.length === 0) {
      return completedLevels.includes(levelId);
    }
    return lessons.every((l) => completedLessons.includes(l.id));
  };

  const isPracticeUnlocked = (levelIndex: number): boolean => {
    return isLevelCompleted(data.levels[levelIndex].id);
  };

  const isPracticePassed = (levelIndex: number): boolean => {
    if (inPreview) return false;
    const practiceNum = data.practiceRange[0] + levelIndex;
    return passedPractice.includes(`L${practiceNum}` as SRBLevel);
  };

  const isLevelBlocked = (levelId: string): boolean =>
    pendingRemediation !== null && pendingRemediation.level === levelId;

  const isAnzanVisualUnlocked = (levelIndex: number): boolean => {
    if (inPreview) return true;
    return isPracticePassed(levelIndex);
  };

  const isAnzanVisualPassed = (levelIndex: number): boolean => {
    if (inPreview) return false;
    const anzanNum = data.anzanRange[0] + levelIndex;
    return passedAnzanVisual.includes(`L${anzanNum}` as SRBLevel);
  };

  const isAnzanAudioUnlocked = (levelIndex: number): boolean => {
    if (inPreview) return true;
    return isAnzanVisualPassed(levelIndex);
  };

  const isAnzanAudioPassed = (levelIndex: number): boolean => {
    if (inPreview) return false;
    const anzanNum = data.anzanRange[0] + levelIndex;
    return passedAnzanAudio.includes(`L${anzanNum}` as SRBLevel);
  };

  // ✅ [SURGICAL FIX] — the final exam requires passing each level's test (>= 80%)
  const isExamUnlocked = (): boolean => {
    if (inPreview) return true;
    return data.levels.every((_, idx) => {
      const levelId = data.levels[idx].id;
      const grade = grades[levelId];
      const isTestPassed = grade && grade.levelTest !== null && grade.levelTest >= 80;

      return (
        isLevelCompleted(levelId) &&
        isPracticePassed(idx) &&
        isAnzanVisualPassed(idx) &&
        isAnzanAudioPassed(idx) &&
        isTestPassed
      );
    });
  };

  const isExamPassed = category === 'kids' ? placement.exam1Passed : placement.exam2Passed;

  const renderLevelCard = (level: LevelItem, idx: number) => {
    const Icon = level.icon;
    const unlocked = isLevelUnlocked(level.id, idx);
    
    // ✅ [SURGICAL FIX] — the "completed" mark appears only if the test is passed
    const grade = grades[level.id];
    const isTestPassed = grade && grade.levelTest !== null && grade.levelTest >= 80;
    const completed = isLevelCompleted(level.id) && isTestPassed;

    const practiceUnlocked = isPracticeUnlocked(idx);
    const practicePassed = isPracticePassed(idx);
    const anzanVUnlocked = isAnzanVisualUnlocked(idx);
    const anzanVPassed = isAnzanVisualPassed(idx);
    const anzanAUnlocked = isAnzanAudioUnlocked(idx);
    const anzanAPassed = isAnzanAudioPassed(idx);

    const practiceNum = data.practiceRange[0] + idx;
    const anzanNum = data.anzanRange[0] + idx;

    const isRecommended = placement.recommendedLevel === level.id;

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
                {toArabicNumber(level.number)} — {pickLang({ ar: level.titleAr, en: level.titleEn }, lang)}
              </h4>
              {completed && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isRecommended && (
                <span className="px-2 py-0.5 rounded-lg bg-gold-400/30 text-gold-100 text-[10px] font-bold whitespace-nowrap">
                  {pickLang({ ar: '🎯 ابدأ هنا', en: '🎯 Start here' }, lang)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-white/40 font-body">
              {pickLang({ ar: level.titleEn, en: level.titleAr }, lang)}
            </p>
            <p className="text-xs text-white/60 font-body mt-1 leading-snug">
              {translateDynamic(level, lang, 'desc')}
            </p>
          </div>
        </div>

        {unlocked && (
          <div className="grid grid-cols-2 gap-2 mt-3">
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
              {completed
                ? pickLang({ ar: 'مراجعة', en: 'Review' }, lang)
                : pickLang({ ar: 'الدرس', en: 'Lesson' }, lang)}
            </button>

            <button
              type="button"
              onClick={() => practiceUnlocked && !practicePassed && !isLevelBlocked(level.id) && handleNav(`practice-${practiceNum}` as Screen)}
              disabled={!practiceUnlocked || practicePassed || isLevelBlocked(level.id)}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                practicePassed
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                  : practiceUnlocked
                    ? 'bg-blue-500/20 text-blue-200 border border-blue-400/40'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              }`}
            >
              {!practiceUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Dumbbell className="w-3.5 h-3.5" />}
              {practicePassed && grades[level.id]?.practice !== null && grades[level.id]?.practice !== undefined
                ? pickLang({
                    ar: `تمرّن ✓ ${toArabicNumber(grades[level.id]!.practice!)}٪`,
                    en: `Practice ✓ ${toArabicNumber(grades[level.id]!.practice!)}%`
                  }, lang)
                : pickLang({
                    ar: `تمرّن ${toArabicNumber(practiceNum)}`,
                    en: `Practice ${toArabicNumber(practiceNum)}`
                  }, lang)}
            </button>

            <button
              type="button"
              onClick={() => anzanVUnlocked && !anzanVPassed && !isLevelBlocked(level.id) && handleNav(`anzan-${anzanNum}` as Screen)}
              disabled={!anzanVUnlocked || anzanVPassed || isLevelBlocked(level.id)}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                anzanVPassed
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                  : anzanVUnlocked
                    ? 'bg-purple-500/20 text-purple-200 border border-purple-400/40'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              }`}
            >
              {!anzanVUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {anzanVPassed &&
               grades[level.id]?.anzanVisualNormal !== null &&
               grades[level.id]?.anzanVisualNormal !== undefined &&
               grades[level.id]?.anzanVisualFlash !== null &&
               grades[level.id]?.anzanVisualFlash !== undefined
                ? pickLang({
                    ar: `بصري ✓ ${toArabicNumber(Math.round((grades[level.id]!.anzanVisualNormal! + grades[level.id]!.anzanVisualFlash!) / 2))}٪`,
                    en: `Visual ✓ ${toArabicNumber(Math.round((grades[level.id]!.anzanVisualNormal! + grades[level.id]!.anzanVisualFlash!) / 2))}%`
                  }, lang)
                : pickLang({ ar: 'أنزان بصري', en: 'Visual Anzan' }, lang)}
            </button>

            <button
              type="button"
              onClick={() => anzanAUnlocked && !anzanAPassed && !isLevelBlocked(level.id) && handleNav(`audio-anzan-${anzanNum}` as Screen)}
              disabled={!anzanAUnlocked || anzanAPassed || isLevelBlocked(level.id)}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition ${
                anzanAPassed
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                  : anzanAUnlocked
                    ? 'bg-rose-500/20 text-rose-200 border border-rose-400/40'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              }`}
            >
              {!anzanAUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {anzanAPassed &&
               grades[level.id]?.anzanAudio !== null &&
               grades[level.id]?.anzanAudio !== undefined
                ? pickLang({
                    ar: `سمعي ✓ ${toArabicNumber(grades[level.id]!.anzanAudio!)}٪`,
                    en: `Audio ✓ ${toArabicNumber(grades[level.id]!.anzanAudio!)}%`
                  }, lang)
                : pickLang({ ar: 'أنزان سمعي', en: 'Audio Anzan' }, lang)}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Header
        xp={stats.xp}
        streak={stats.streak}
        level={stats.level}
        soundEnabled={stats.soundEnabled}
        onToggleSound={toggleSound}
        onHome={goHome}
      />

      <div dir={dir} className="px-3 sm:px-6 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {pickLang({ ar: data.titleAr, en: data.titleEn }, lang)}
          </h2>
          <p className="text-sm text-white/50 font-body">
            {translateDynamic(data, lang, 'ageRange')} · {pickLang({ ar: data.titleEn, en: data.titleAr }, lang)}
          </p>
        </div>

        {data.enrichment.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold-300" />
              <h3 className="text-lg font-bold text-white/80 font-display">
                {pickLang({ ar: 'إثراء ممتع', en: 'Fun Enrichment' }, lang)}
              </h3>
              <span className="text-[10px] text-white/40 font-body">
                {pickLang({ ar: '(مفتوح دائماً)', en: '(Always open)' }, lang)}
              </span>
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
                    className="group relative glass-card p-4 text-start overflow-hidden flex items-center gap-3"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                    <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 relative">
                      <h4 className="text-sm font-bold font-display text-white">
                        {translateDynamic(item, lang, 'title')}
                      </h4>
                      <p className="text-[11px] text-white/50 font-body mt-0.5">
                        {translateDynamic(item, lang, 'desc')}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-white/60" />
            <h3 className="text-lg font-bold text-white/80 font-display">
              {pickLang({ ar: 'المستويات', en: 'Levels' }, lang)}
            </h3>
            <span className="text-[10px] text-white/40 font-body">
              {pickLang({ ar: '(متسلسلة — كل مستوى يُفتح بعد السابق)', en: '(Sequential — each level unlocks after the previous)' }, lang)}
            </span>
          </div>

          <div className="space-y-4">
            {data.levels.map((level, idx) => renderLevelCard(level, idx))}
          </div>
        </motion.div>

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
                {translateDynamic(data, lang, 'examTitle')}
              </h3>
              <p className="text-xs text-white/60 font-body mt-0.5">
                {isExamUnlocked()
                  ? isExamPassed
                    ? pickLang({ ar: '✅ نجحت في هذا الامتحان', en: '✅ You passed this exam' }, lang)
                    : pickLang({ ar: '🎯 جاهز للامتحان! بدرجة نجاح ٨٠٪', en: '🎯 Ready for the exam! Passing grade 80%' }, lang)
                  : pickLang({ ar: '🔒 يُفتح بعد إتمام كل المستويات + تمرّن + أنزان', en: '🔒 Unlocks after completing all levels + practice + anzan' }, lang)}
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
              {pickLang({ ar: 'ابدأ الامتحان', en: 'Start Exam' }, lang)}
            </button>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default CategoryScreen;