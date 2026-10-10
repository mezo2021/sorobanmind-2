// src/components/flash/FlashListScreen.tsx
// 🎬 شاشة قائمة الفلاشات — تعرض كل الفئات والدروس

import { motion } from 'framer-motion';
import { ArrowRight, Play, Film, Sparkles } from 'lucide-react';
import { FLASH_CATEGORIES } from './flashData';
import type { FlashCategory, FlashLesson } from './types';

interface FlashListScreenProps {
  onBack: () => void;
  onOpenFlash: (lessonId: string) => void;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  basics: 'from-emerald-500 to-teal-700',
  'div-1': 'from-blue-500 to-indigo-700',
  'div-2': 'from-purple-500 to-violet-700',
  mult: 'from-amber-500 to-orange-700',
};

export function FlashListScreen({ onBack, onOpenFlash }: FlashListScreenProps) {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pb-10"
      dir="rtl"
    >
      {/* ═══ Header ═══ */}
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
            شروحات قصيرة — خطوة بخطوة
          </p>
        </div>
        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
      </div>

      {/* ═══ Categories ═══ */}
      <div className="px-4 sm:px-6 pt-6 space-y-8 max-w-3xl mx-auto">
        {FLASH_CATEGORIES.map((cat, catIdx) => (
          <CategorySection
            key={cat.id}
            category={cat}
            index={catIdx}
            onOpenFlash={onOpenFlash}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// قسم الفئة الواحدة
// ═══════════════════════════════════════════════════════════

function CategorySection({
  category,
  index,
  onOpenFlash,
}: {
  category: FlashCategory;
  index: number;
  onOpenFlash: (lessonId: string) => void;
}) {
  const gradient = CATEGORY_GRADIENTS[category.id] ?? 'from-purple-500 to-violet-700';
  const isEmpty = category.lessons.length === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      {/* رأس الفئة */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
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

      {/* قائمة الدروس */}
      {isEmpty ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-white/40">
            🚧 قيد الإعداد — قريباً
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {category.lessons.map((lesson, i) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              gradient={gradient}
              index={i}
              onOpen={() => onOpenFlash(lesson.id)}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

// ═══════════════════════════════════════════════════════════
// بطاقة درس واحد
// ═══════════════════════════════════════════════════════════

function LessonCard({
  lesson,
  gradient,
  index,
  onOpen,
}: {
  lesson: FlashLesson;
  gradient: string;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all text-right group"
    >
      {/* أيقونة التشغيل */}
      <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition`}>
        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
      </div>

      {/* النصوص */}
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

      {/* سهم */}
      <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-amber-300 transition shrink-0 rotate-180" />
    </motion.button>
  );
}

export default FlashListScreen;