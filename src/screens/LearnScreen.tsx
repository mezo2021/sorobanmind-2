// src/screens/LearnScreen.tsx
// 📖 Level lessons list (Level → Lessons)
// Displays the level lessons (Introduction, S1, S2…) with sequential locking

import { motion } from 'framer-motion';
import {
  Home, BookOpen, CheckCircle2, Lock, Star, Type, ChevronRight,
} from 'lucide-react';

import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import { translateDynamic } from '@/utils/translateDynamic';

import { getLessonsByLevel } from '@/curriculum/lessons';
import { FloatingCompanion } from '@/components/FloatingCompanion';
import { useGameStats } from '@/hooks/useGameStats';
import { useProgressStore } from '@/store/progressStore';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatText, formatNumber } from '@/utils/numberStyle';

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

interface LearnScreenProps {
  levelId: string;
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
  playSound: (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => void;
}

// ═══════════════════════════════════════════════════════════
// Level display data
// ═══════════════════════════════════════════════════════════

const LEVEL_META: Record<string, {
  number: number;
  title: string;
  titleEn: string;
  gradient: string;
}> = {
  L0: { number: 0, title: 'التمهيدي', titleEn: 'Foundation', gradient: 'from-emerald-500 to-teal-700' },
  L1: { number: 1, title: 'الجمع والطرح', titleEn: 'Add & Subtract', gradient: 'from-blue-500 to-cyan-700' },
  L2: { number: 2, title: 'الضرب', titleEn: 'Multiplication', gradient: 'from-amber-500 to-orange-700' },
  L3: { number: 3, title: 'القسمة', titleEn: 'Division', gradient: 'from-blue-500 to-indigo-700' },
  L4: { number: 4, title: 'سلاسل الجمع والطرح', titleEn: 'Add & Sub Chains', gradient: 'from-purple-500 to-violet-700' },
  L5: { number: 5, title: 'ضرب وقسمة متقدم', titleEn: 'Advanced Mul & Div', gradient: 'from-purple-500 to-fuchsia-700' },
  L6: { number: 6, title: 'الكسور العشرية', titleEn: 'Decimals', gradient: 'from-amber-500 to-rose-700' },
  L7: { number: 7, title: 'الجذور', titleEn: 'Roots', gradient: 'from-rose-500 to-purple-700' },
};

// ═══════════════════════════════════════════════════════════
// Screen
// ═══════════════════════════════════════════════════════════

export function LearnScreen({
  levelId,
  onBack,
  onOpenLesson,
  playSound,
}: LearnScreenProps) {
  const { lang, dir } = useT();

  const meta = LEVEL_META[levelId];
  const lessons = getLessonsByLevel(levelId);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const { stats } = useGameStats();
  const { style: numberStyle, toggleStyle } = useNumberStyleStore();

  // ─── Guard ───
  if (!meta) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-6 text-center max-w-md">
          <p className="text-white/60 mb-4">
            {pickLang({ ar: 'المستوى غير موجود', en: 'Level not found' }, lang)}
          </p>
          <button onClick={onBack} className="btn-primary w-full">
            {pickLang({ ar: 'رجوع', en: 'Back' }, lang)}
          </button>
        </div>
      </div>
    );
  }

  // ⚠️ TEMP-DEV-PREVIEW: remove when development is complete
  // Reason: bypasses the lesson lock in developer mode
  // Removal: search for "TEMP-DEV-PREVIEW" in the project
  const isPreviewMode =
    typeof window !== 'undefined' &&
    localStorage.getItem('soroban_dev_preview') === 'true';

  const isLessonDone = (id: string) => completedLessons.includes(id);
  const isLessonUnlocked = (idx: number) =>
    isPreviewMode || idx === 0 || isLessonDone(lessons[idx - 1].id);

  const doneCount = lessons.filter((l) => isLessonDone(l.id)).length;
  const progressPct = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0;

  const goHome = () => {
    playSound('click');
    onBack();
  };

  return (
    <div dir={dir} className="min-h-screen pb-32">
      {/* ───── Header ───── */}
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-slate-900/70 border-b border-white/10 px-3 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button
            onClick={goHome}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            aria-label={pickLang({ ar: 'رجوع', en: 'Back' }, lang)}
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white truncate">
              📖 {pickLang({ ar: 'دروس', en: 'Lessons' }, lang)}{' '}
              {formatNumber(meta.number, numberStyle)} —{' '}
              {pickLang({ ar: meta.title, en: meta.titleEn }, lang)}
            </h1>
            <p className="text-[10px] text-white/50 truncate">
              {meta.titleEn} · {formatNumber(doneCount, numberStyle)}/
              {formatNumber(lessons.length, numberStyle)}{' '}
              {pickLang({ ar: 'مكتمل', en: 'completed' }, lang)}
            </p>
          </div>
          <button
            onClick={() => { playSound('click'); toggleStyle(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            aria-label={pickLang({ ar: 'تبديل نمط الأرقام', en: 'Toggle number style' }, lang)}
          >
            <Type className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-5">
        {/* ───── Hero Card ───── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 mb-5 overflow-hidden relative"
        >
          <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${meta.gradient} opacity-20 blur-3xl`} />
          <div className="relative">
            <h2 className="text-lg font-extrabold text-white mb-2">
              {formatText(
                pickLang({ ar: meta.title, en: meta.titleEn }, lang),
                numberStyle,
              )}
            </h2>
            <p className="text-xs text-white/60 mb-3">
              {pickLang(
                {
                  ar: 'أكمل الدروس بالترتيب لفتح التمرّن والأنزان',
                  en: 'Complete the lessons in order to unlock Practice and Anzan',
                },
                lang,
              )}
            </p>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">
                {pickLang({ ar: 'التقدم:', en: 'Progress:' }, lang)}
              </span>
              <span className="text-sm font-bold text-gold-300">
                {formatNumber(progressPct, numberStyle)}٪
              </span>
            </div>

            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* ───── Lessons list ───── */}
        <div className="space-y-3">
          {lessons.map((lesson, idx) => {
            const unlocked = isLessonUnlocked(idx);
            const done = isLessonDone(lesson.id);

            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={unlocked ? { scale: 1.02 } : {}}
                whileTap={unlocked ? { scale: 0.98 } : {}}
                onClick={() => {
                  if (!unlocked) { playSound('whoosh'); return; }
                  playSound('click');
                  onOpenLesson(lesson.id);
                }}
                disabled={!unlocked}
                className={`glass-card p-4 w-full text-start flex items-center gap-3 ${
                  !unlocked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0 ${!unlocked ? 'grayscale' : ''}`}>
                  {!unlocked ? (
                    <Lock className="w-5 h-5 text-white" />
                  ) : done ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Star className="w-6 h-6 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white truncate">
                    {lesson.isTheoretical ? '🎬 ' : '📝 '}
                    {formatText(
                      translateDynamic({ value: lesson.title.ar }, lang, 'value'),
                      numberStyle,
                    )}
                  </h3>
                  <p className="text-[10px] text-white/40 truncate mt-0.5">
                    {lesson.skillId ?? pickLang({ ar: 'مقدمة', en: 'Intro' }, lang)} ·{' '}
                    {formatNumber(lesson.estimatedMinutes, numberStyle)}{' '}
                    {pickLang({ ar: 'دقيقة', en: 'min' }, lang)}
                  </p>
                </div>

                {done ? (
                  <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 font-bold shrink-0">
                    ✓
                  </span>
                ) : unlocked ? (
                  <ChevronRight className="w-5 h-5 text-white/40 shrink-0" />
                ) : null}
              </motion.button>
            );
          })}
        </div>

        {/* ───── No lessons ───── */}
        {lessons.length === 0 && (
          <div className="glass-card p-6 text-center">
            <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60 text-sm">
              {pickLang(
                { ar: 'دروس هذا المستوى قيد الإعداد', en: 'Lessons for this level are being prepared' },
                lang,
              )}
            </p>
          </div>
        )}
      </div>

      {/* ───── Companion ───── */}
      <FloatingCompanion playSound={playSound} />
    </div>
  );
}

export default LearnScreen;