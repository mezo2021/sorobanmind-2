// src/components/flash/FlashListScreen.tsx
// 🎬 قائمة الفلاشات — تدير FlashScreen و TwoAbacusSolver داخلياً

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Film, Sparkles, Hand } from 'lucide-react';
import { FLASH_CATEGORIES, getFlashLessonById } from './flashData';
import {
  getDivisionProblemById,
  getProblemIdForLesson,
} from './sorobanDivisionData';
import { FlashScreen } from './FlashScreen';
import { TwoAbacusSolver } from './TwoAbacusSolver';
import type { FlashCategory, FlashLesson } from './types';

interface FlashListScreenProps {
  onBack: () => void;
  /** @deprecated — للتوافق مع App.tsx · غير مستخدم (التنقل داخلي) */
  onOpenFlash?: (lessonId: string) => void;
}

type ActiveView =
  | { kind: 'flash'; lessonId: string }
  | { kind: 'practice'; problemId: string }
  | null;

const CATEGORY_GRADIENTS: Record<string, string> = {
  basics: 'from-emerald-500 to-teal-700',
  'div-1': 'from-blue-500 to-indigo-700',
  'div-2': 'from-purple-500 to-violet-700',
  mult: 'from-amber-500 to-orange-700',
};

export function FlashListScreen({ onBack }: FlashListScreenProps) {
  const [active, setActive] = useState<ActiveView>(null);

  // ═══ عرض FlashScreen داخلياً ═══
  if (active?.kind === 'flash') {
    const lesson = getFlashLessonById(active.lessonId);
    if (!lesson) {
      setActive(null);
      return null;
    }
    return (
      <FlashScreen
        lesson={lesson}
        onBack={() => setActive(null)}
      />
    );
  }

  // ═══ عرض TwoAbacusSolver داخلياً ═══
  if (active?.kind === 'practice') {
    const problem = getDivisionProblemById(active.problemId);
    if (!problem) {
      setActive(null);
      return null;
    }
    return (
      <TwoAbacusSolver
        problem={problem}
        onBack={() => setActive(null)}
        onComplete={() => setActive(null)}
      />
    );
  }

  // ═══ عرض القائمة ═══
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pb-10"
      dir="rtl"
    >
      <div className="flex items-center gap-3 p-4 sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-amber-300 flex items-center gap-2">
            <Film className="w-5 h-5 sm:w-6 sm:h-6" />
            الفلاشات التعليمية
          </h1>
          <p className="text-xs text-white/60 mt-0.5">
            شروحات قصيرة · تطبيق عملي
          </p>
        </div>
        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
      </div>

      <div className="px-4 sm:px-6 pt-6 space-y-8 max-w-3xl mx-auto">
        {FLASH_CATEGORIES.map((cat, catIdx) => (
          <CategorySection
            key={cat.id}
            category={cat}
            index={catIdx}
            onOpenFlash={(lessonId) => setActive({ kind: 'flash', lessonId })}
            onOpenPractice={(problemId) =>
              setActive({ kind: 'practice', problemId })
            }
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// قسم الفئة
// ═══════════════════════════════════════════════════════════

function CategorySection({
  category,
  index,
  onOpenFlash,
  onOpenPractice,
}: {
  category: FlashCategory;
  index: number;
  onOpenFlash: (lessonId: string) => void;
  onOpenPractice: (problemId: string) => void;
}) {
  const gradient =
    CATEGORY_GRADIENTS[category.id] ?? 'from-purple-500 to-violet-700';
  const isEmpty = category.lessons.length === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <span className="text-xl">{category.emoji}</span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">{category.title}</h2>
          <p className="text-xs text-white/50">{category.description}</p>
        </div>
        {!isEmpty && (
          <span className="text-xs text-amber-300 font-bold px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30">
            {category.lessons.length}
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-white/40">🚧 قيد الإعداد — قريباً</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {category.lessons.map((lesson, i) => {
            const problemId = getProblemIdForLesson(lesson.id);
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                gradient={gradient}
                index={i}
                hasPractice={problemId !== null}
                onOpenFlash={() => onOpenFlash(lesson.id)}
                onOpenPractice={
                  problemId ? () => onOpenPractice(problemId) : undefined
                }
              />
            );
          })}
        </div>
      )}
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════
// بطاقة درس
// ═══════════════════════════════════════════════════════════

function LessonCard({
  lesson,
  gradient,
  index,
  hasPractice,
  onOpenFlash,
  onOpenPractice,
}: {
  lesson: FlashLesson;
  gradient: string;
  index: number;
  hasPractice: boolean;
  onOpenFlash: () => void;
  onOpenPractice?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <span className="text-xl sm:text-2xl">➗</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-bold text-white truncate">
            {lesson.title}
          </p>
          <p className="text-xs sm:text-sm text-amber-300 font-mono truncate mt-0.5">
            {lesson.subtitle}
          </p>
          <p className="text-[10px] sm:text-xs text-white/40 mt-1">
            {lesson.steps.length} خطوة · {lesson.columns} أعمدة
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onOpenFlash}
          className={`flex-1 py-2.5 rounded-xl bg-gradient-to-l ${gradient} text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg`}
        >
          <Play className="w-4 h-4 fill-white" />
          شاهد
        </motion.button>

        {hasPractice && onOpenPractice && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onOpenPractice}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500/25 border-2 border-emerald-400/50 text-emerald-100 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-500/35 transition"
          >
            <Hand className="w-4 h-4" />
            جرّب بنفسك
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default FlashListScreen;