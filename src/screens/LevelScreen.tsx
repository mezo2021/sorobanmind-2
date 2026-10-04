// src/screens/LevelScreen.tsx
//
// 📝 التعديل: إضافة computeFinalScore + عرض الدرجة التراكمية في قسم "نجاح كامل" + زر "تابع للمستوى التالي"
// 🎯 الوظيفة: إظهار النتيجة الموزونة (اختبار ٧٠٪ + تمرّن ١٠٪ + بصري ١٠٪ + سمعي ١٠٪) عند اجتياز المستوى
// 📅 الجلسة: 14
// ✅ الحالة: البناء أخضر
// [FIX 7] — استخدام أداة المعاينة

import { motion } from 'framer-motion';
import {
  BookOpen, Dumbbell, Eye, Volume2,
  Lock, CheckCircle2, Trophy, Play, Star, GraduationCap,
  type LucideIcon,
} from 'lucide-react';

import type { Screen } from '@/types';
import type { LevelId } from '@/store/progressStore';
import Header from './Header';
import { useGameStats } from '@/hooks/useGameStats';
import { useProgressStore } from '@/store/progressStore';
import { getLessonsByLevel } from '@/curriculum/lessons';

// [FIX 7] — استخدام أداة المعاينة
import { isPreviewMode } from '@/utils/previewMode';

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

const LEVELS_DATA: Record<string, LevelInfo> = {
  L0: {
    id: 'L0', number: 0,
    titleAr: 'التمهيدي',
    titleEn: 'Foundation',
    desc: 'التعرّف على السوروبان والأرقام من ٠ إلى ٩ والقيمة المكانية',
    gradient: 'from-emerald-500 to-teal-700',
    categoryId: 'kids', categoryScreen: 'hero-dashboard',
    practiceNum: 0, anzanNum: 0,
  },
  L1: {
    id: 'L1', number: 1,
    titleAr: 'الجمع والطرح',
    titleEn: 'Addition & Subtraction',
    desc: 'جمع وطرح بسيط + أصدقاء ٥ + أصدقاء ١٠ + عمليات مركّبة',
    gradient: 'from-blue-500 to-cyan-700',
    categoryId: 'kids', categoryScreen: 'hero-dashboard',
    practiceNum: 1, anzanNum: 1,
  },
  L2: {
    id: 'L2', number: 2,
    titleAr: 'الضرب',
    titleEn: 'Multiplication',
    desc: 'الضرب المتدرّج (١×٢ · ٢×٢) على السوروبان',
    gradient: 'from-amber-500 to-orange-700',
    categoryId: 'kids', categoryScreen: 'hero-dashboard',
    practiceNum: 2, anzanNum: 2,
  },
  L3: {
    id: 'L3', number: 3,
    titleAr: 'القسمة',
    titleEn: 'Division',
    desc: 'القسمة المتدرّجة (÷١ · ÷٢) — التقدير والطرح المتتالي',
    gradient: 'from-blue-500 to-indigo-700',
    categoryId: 'kids', categoryScreen: 'hero-dashboard',
    practiceNum: 3, anzanNum: 3,
  },
  L4: {
    id: 'L4', number: 4,
    titleAr: 'سلاسل الجمع والطرح',
    titleEn: 'Add & Sub Chains',
    desc: 'سلاسل الجمع والطرح المتعددة الحدود',
    gradient: 'from-purple-500 to-violet-700',
    categoryId: 'teens', categoryScreen: 'hero-dashboard',
    practiceNum: 4, anzanNum: 4,
  },
  L5: {
    id: 'L5', number: 5,
    titleAr: 'ضرب وقسمة متقدم',
    titleEn: 'Advanced Mul & Div',
    desc: 'الضرب (٢×٣) والقسمة المتقدمة بطرق تاكاشي',
    gradient: 'from-purple-500 to-fuchsia-700',
    categoryId: 'teens', categoryScreen: 'hero-dashboard',
    practiceNum: 5, anzanNum: 5,
  },
  L6: {
    id: 'L6', number: 6,
    titleAr: 'الكسور العشرية',
    titleEn: 'Decimals',
    desc: 'العمليات على الأعداد العشرية (جمع · طرح · ضرب · قسمة)',
    gradient: 'from-amber-500 to-rose-700',
    categoryId: 'teens', categoryScreen: 'hero-dashboard',
    practiceNum: 6, anzanNum: 6,
  },
  L7: {
    id: 'L7', number: 7,
    titleAr: 'الجذور',
    titleEn: 'Roots',
    desc: 'الجذور التربيعية الكاملة',
    gradient: 'from-rose-500 to-purple-700',
    categoryId: 'teens', categoryScreen: 'hero-dashboard',
    practiceNum: 7, anzanNum: 7,
  },
};

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

function loadPassedLevelTests(): string[] {
  try {
    const raw = localStorage.getItem('soroban_passed_level_tests');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
// SectionCard
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
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function LevelScreen({
  levelId,
  onNavigate,
  onBack,
  playSound,
}: LevelScreenProps) {
  const navigate = onNavigate || (() => {});
  const sound = playSound || (() => {});
  const back = onBack || (() => navigate('hero-dashboard'));

  const { stats, toggleSound } = useGameStats();

  const level = LEVELS_DATA[levelId];

  // ─── progressStore ───
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const passedPractice = useProgressStore((s) => s.passedPractice);
  const passedAnzanVisual = useProgressStore((s) => s.passedAnzanVisual);
  const passedAnzanAudio = useProgressStore((s) => s.passedAnzanAudio);
  const grades = useProgressStore((s) => s.grades);
  const pendingRemediation = useProgressStore((s) => s.pendingRemediation);
  const computeFinalScore = useProgressStore((s) => s.computeFinalScore);

  // ─── passedLevelTests (localStorage مؤقتًا) ───
  const passedLevelTests = loadPassedLevelTests();

  // ─── درجات المستوى الحالي ───
  const levelGrades = grades[levelId] ?? {
    practice: null,
    anzanVisualNormal: null,
    anzanVisualFlash: null,
    anzanAudio: null,
    levelTest: null,
  };

  if (!level) {
    return (
      <div dir="rtl" className="px-6 py-6 max-w-3xl mx-auto text-center">
        <div className="glass-card p-8">
          <p className="text-white/60 font-body mb-4">المستوى غير موجود</p>
          <button type="button" onClick={back} className="btn-primary">رجوع</button>
        </div>
      </div>
    );
  }

  const handleNav = (screen: Screen) => {
    sound('click');
    navigate(screen);
  };

  const goBack = () => {
    sound('click');
    back();
  };

  // [FIX 7] — استخدام أداة المعاينة
  const inPreview = isPreviewMode();

  const levelLessons = getLessonsByLevel(levelId as string);

  // [FIX 7] — في وضع المعاينة: كل شيء مفتوح
  const isLessonCompleted =
    inPreview ||
    (levelLessons.length > 0 &&
      levelLessons.every((l) => completedLessons.includes(l.id)));

  const isPracticePassed = inPreview || passedPractice.includes(level.practiceNum);
  const isAnzanVisualPassed = inPreview || passedAnzanVisual.includes(level.anzanNum);
  const isAnzanAudioPassed = inPreview || passedAnzanAudio.includes(level.anzanNum);
  const isLevelTestPassed = inPreview || passedLevelTests.includes(levelId);

  // 🩺 الجلسة العلاجية الإجبارية — إن كانت للمستوى الحالي
  const hasPendingRemediation =
    pendingRemediation !== null && pendingRemediation.level === levelId;

  // 🎯 منطق القفل الجديد:
  // - practiceLocked: يحتاج إنهاء الدروس + عدم وجود جلسة علاجية معلّقة
  const practiceLocked =
    !isLessonCompleted || hasPendingRemediation;

  // - anzanVisualLocked: يحتاج النجاح في التمرّن + عدم وجود جلسة علاجية
  const anzanVisualLocked =
    !isPracticePassed || hasPendingRemediation;

  // - anzanAudioLocked: يحتاج النجاح في الأنزان البصري + عدم وجود جلسة علاجية
  const anzanAudioLocked =
    !isAnzanVisualPassed || hasPendingRemediation;

  // - levelTestLocked: يحتاج النجاح في كل المسارات + عدم وجود جلسة علاجية
  const levelTestLocked =
    !isAnzanAudioPassed || hasPendingRemediation;

  // 🎯 المسار "التالي" لفتحه (لإظهار الجلسة العلاجية)
  const remediationTarget =
    hasPendingRemediation && pendingRemediation
      ? pendingRemediation.phase
      : null;

  const completionPct =
    ([isLessonCompleted, isPracticePassed, isAnzanVisualPassed, isAnzanAudioPassed, isLevelTestPassed]
      .filter(Boolean).length / 5) * 100;

  // 🏅 النتيجة التراكمية + المستوى التالي
  const finalScore = computeFinalScore(levelId);

  const nextLevelId: LevelId | null =
    levelId === 'L0' ? 'L1' :
    levelId === 'L1' ? 'L2' :
    levelId === 'L2' ? 'L3' :
    levelId === 'L3' ? 'L4' :
    levelId === 'L4' ? 'L5' :
    levelId === 'L5' ? 'L6' :
    levelId === 'L6' ? 'L7' : null;

  const goNext = () => {
    sound('click');
    if (nextLevelId) navigate(`lesson-${nextLevelId}` as Screen);
    else back();
  };

  return (
    <>
      <Header
        xp={stats.xp}
        streak={stats.streak}
        level={stats.level}
        soundEnabled={stats.soundEnabled}
        onToggleSound={toggleSound}
        onHome={goBack}
      />

      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-3xl mx-auto">
        {/* Level Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Star className="w-5 h-5 text-gold-300" />
            <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white truncate">
              {toArabicNumber(level.number)} — {level.titleAr}
            </h2>
          </div>
          <p className="text-xs text-white/50 font-body mt-0.5">{level.titleEn}</p>
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

              <div className="flex items-center gap-2 flex-wrap">
                {isLessonCompleted && <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 font-bold">درس ✓</span>}
                {isPracticePassed && <span className="text-[10px] px-2 py-1 rounded-lg bg-blue-500/20 text-blue-200 font-bold">تمرّن ✓</span>}
                {isAnzanVisualPassed && <span className="text-[10px] px-2 py-1 rounded-lg bg-purple-500/20 text-purple-200 font-bold">بصري ✓</span>}
                {isAnzanAudioPassed && <span className="text-[10px] px-2 py-1 rounded-lg bg-rose-500/20 text-rose-200 font-bold">سمعي ✓</span>}
                {isLevelTestPassed && <span className="text-[10px] px-2 py-1 rounded-lg bg-gold-400/20 text-gold-200 font-bold">اختبار ✓</span>}
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

        {/* 🩺 الجلسة العلاجية الإجبارية */}
        {hasPendingRemediation && remediationTarget && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-400/50 text-center"
          >
            <p className="text-sm font-bold text-amber-200 mb-3">
              ⚠️ يجب إتمام الجلسة العلاجية لفتح المسار التالي
            </p>
            <button
              type="button"
              onClick={() => handleNav(`remediation-${levelId}` as Screen)}
              className="w-full py-3 rounded-2xl bg-gradient-to-l from-amber-400 to-orange-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/40 animate-pulse"
            >
              🩺 ابدأ الجلسة العلاجية الإجبارية
            </button>
          </motion.div>
        )}

        {/* Sections */}
        <div className="space-y-3">
          {/* 1. تعلّم → قائمة الدروس */}
          <SectionCard
            title="📖 تعلّم"
            subtitle="القصة + المفهوم + الأمثلة المحلولة"
            icon={BookOpen}
            gradient={level.gradient}
            locked={false}
            completed={isLessonCompleted}
            onClick={() => handleNav(`learn-${levelId}` as Screen)}
            playSound={sound}
          />

          {/* 2. تمرّن */}
          <SectionCard
            title={`✏️ تمرّن ${toArabicNumber(level.practiceNum)}`}
            subtitle={
              hasPendingRemediation && remediationTarget === 'practice'
                ? '🔒 مقفل — جلسة علاجية إجبارية'
                : practiceLocked
                  ? '🔒 يُفتح بعد إنهاء الدروس'
                  : isPracticePassed
                    ? `✅ اجتزت بدرجة ${toArabicNumber(levelGrades.practice ?? 0)}٪`
                    : 'أسئلة تكيفية من البنك'
            }
            icon={Dumbbell}
            gradient="from-blue-500 to-cyan-700"
            locked={practiceLocked || isPracticePassed}
            completed={isPracticePassed}
            onClick={() => handleNav(`practice-${level.practiceNum}` as Screen)}
            playSound={sound}
          />

          {/* 3. أنزان بصري */}
          <SectionCard
            title="🧠 أنزان بصري"
            subtitle={
              hasPendingRemediation && (
                remediationTarget === 'anzanVisualNormal' ||
                remediationTarget === 'anzanVisualFlash'
              )
                ? '🔒 مقفل — جلسة علاجية إجبارية'
                : anzanVisualLocked
                  ? '🔒 يُفتح بعد النجاح في تمرّن'
                  : isAnzanVisualPassed
                    ? `✅ اجتزت بدرجة ${
                        levelGrades.anzanVisualNormal !== null && levelGrades.anzanVisualFlash !== null
                          ? toArabicNumber(Math.round(
                              (levelGrades.anzanVisualNormal + levelGrades.anzanVisualFlash) / 2,
                            ))
                          : toArabicNumber(
                              levelGrades.anzanVisualNormal ??
                              levelGrades.anzanVisualFlash ??
                              0,
                            )
                      }٪`
                    : 'أرقام تومض — احسب بذهنك'
            }
            icon={Eye}
            gradient="from-purple-500 to-violet-700"
            locked={anzanVisualLocked || isAnzanVisualPassed}
            completed={isAnzanVisualPassed}
            onClick={() => handleNav(`anzan-${level.anzanNum}` as Screen)}
            playSound={sound}
          />

          {/* 4. أنزان سمعي */}
          <SectionCard
            title="🎧 أنزان سمعي"
            subtitle={
              hasPendingRemediation && remediationTarget === 'anzanAudio'
                ? '🔒 مقفل — جلسة علاجية إجبارية'
                : anzanAudioLocked
                  ? '🔒 يُفتح بعد النجاح في الأنزان البصري'
                  : isAnzanAudioPassed
                    ? `✅ اجتزت بدرجة ${toArabicNumber(levelGrades.anzanAudio ?? 0)}٪`
                    : 'اسمع الأرقام واحسب ذهنياً'
            }
            icon={Volume2}
            gradient="from-rose-500 to-pink-700"
            locked={anzanAudioLocked || isAnzanAudioPassed}
            completed={isAnzanAudioPassed}
            onClick={() => handleNav(`audio-anzan-${level.anzanNum}` as Screen)}
            playSound={sound}
          />

          {/* 5. اختبار المستوى */}
          <SectionCard
            title={`🎓 اختبار ${toArabicNumber(level.number)}`}
            subtitle={
              hasPendingRemediation
                ? '🔒 مقفل — أتمّ الجلسة العلاجية أولًا'
                : levelTestLocked
                  ? '🔒 يُفتح بعد إتمام كل المسارات'
                  : isLevelTestPassed
                    ? `✅ اجتزت بدرجة ${toArabicNumber(levelGrades.levelTest ?? 0)}٪`
                    : '10 أسئلة صعبة — 60 ثانية — 80%'
            }
            icon={GraduationCap}
            gradient="from-gold-400 to-amber-600"
            locked={levelTestLocked || isLevelTestPassed}
            completed={isLevelTestPassed}
            onClick={() => handleNav(`level-test-${levelId}` as Screen)}
            playSound={sound}
          />
        </div>

        {/* 🏅 نجاح كامل — الدرجة التراكمية */}
        {isLessonCompleted && isPracticePassed && isAnzanVisualPassed && isAnzanAudioPassed && isLevelTestPassed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 glass-card p-5 text-center overflow-hidden relative"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold-500/20 blur-3xl" />
            <div className="relative">
              <Trophy className="w-12 h-12 text-gold-300 mx-auto mb-3" />
              <h3 className="text-lg font-extrabold font-display text-white mb-1">
                🏅 اجتزت المستوى بدرجة تراكمية {toArabicNumber(finalScore ?? 0)}٪ ✓
              </h3>
              <p className="text-sm text-white/60 font-body mb-4">
                {nextLevelId ? 'يمكنك الانتقال للمستوى التالي' : 'أتممت كل المستويات!'}
              </p>
              <button
                type="button"
                onClick={goNext}
                className="btn-primary w-full"
              >
                <Play className="w-5 h-5" />
                {nextLevelId ? 'تابع إلى المستوى التالي' : 'العودة إلى القسم'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default LevelScreen;