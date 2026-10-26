// src/components/flash/FlashListScreen.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Film, Sparkles, Hand } from 'lucide-react';
import { FLASH_CATEGORIES, getFlashLessonById } from './flashData';
import { MULT_CATEGORIES, getMultLessonById } from './multData';
import { CHAIN_CATEGORY, getChainLessonById } from './chainsData';
import { getDivisionProblemById, getProblemIdForLesson } from './sorobanDivisionData';
import { FlashScreen } from './FlashScreen';
import { MultSolver } from './MultSolver';
import { ChainSolver } from './ChainSolver';
import { TwoAbacusSolver } from './TwoAbacusSolver';
import type { FlashCategory, FlashLesson } from './types';
import { Num } from '@/components/Num';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import { translateDynamic } from '@/utils/translateDynamic';

interface FlashListScreenProps {
  onBack: () => void;
  onOpenFlash?: (lessonId: string) => void;
}

type ActiveView =
  | { kind: 'flash'; lessonId: string }
  | { kind: 'mult'; lessonId: string }
  | { kind: 'chain'; lessonId: string }
  | { kind: 'practice'; problemId: string }
  | null;

const CATEGORY_GRADIENTS: Record<string, string> = {
  basics: 'from-emerald-500 to-teal-700',
  chains: 'from-cyan-500 to-blue-700',
  'div-1': 'from-blue-500 to-indigo-700',
  'div-2': 'from-purple-500 to-violet-700',
  'mult-1': 'from-amber-500 to-orange-700',
  'mult-2': 'from-rose-500 to-red-700',
};

// ⚠️ الترتيب: basics → chains → div → mult
const ALL_CATEGORIES: FlashCategory[] = [
  ...FLASH_CATEGORIES.slice(0, 1),   // basics
  CHAIN_CATEGORY,                     // chains (جديد)
  ...FLASH_CATEGORIES.slice(1),       // div-1 · div-2
  ...MULT_CATEGORIES,                 // mult-1 · mult-2
];

export function FlashListScreen({ onBack }: FlashListScreenProps) {
  const [active, setActive] = useState<ActiveView>(null);
  const { lang, dir, isAr } = useT();

  // 🎬 شاهد
  if (active?.kind === 'flash') {
    const lesson =
      getFlashLessonById(active.lessonId) ??
      getMultLessonById(active.lessonId) ??
      getChainLessonById(active.lessonId);
    if (!lesson) { setActive(null); return null; }
    return <FlashScreen lesson={lesson} onBack={() => setActive(null)} />;
  }

  // 🖐️ جرّب — ضرب
  if (active?.kind === 'mult') {
    const lesson = getMultLessonById(active.lessonId);
    if (!lesson) { setActive(null); return null; }
    return <MultSolver lesson={lesson} onBack={() => setActive(null)} onComplete={() => setActive(null)} />;
  }

  // 🖐️ جرّب — سلاسل
  if (active?.kind === 'chain') {
    const lesson = getChainLessonById(active.lessonId);
    if (!lesson) { setActive(null); return null; }
    return <ChainSolver lesson={lesson} onBack={() => setActive(null)} onComplete={() => setActive(null)} />;
  }

  // 🖐️ جرّب — قسمة
  if (active?.kind === 'practice') {
    const problem = getDivisionProblemById(active.problemId);
    if (!problem) { setActive(null); return null; }
    return <TwoAbacusSolver problem={problem} onBack={() => setActive(null)} onComplete={() => setActive(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pb-10" dir={dir}>
      <div className="flex items-center gap-3 p-4 sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0">
          <ArrowRight className={`w-6 h-6 ${isAr ? '' : 'rotate-180'}`} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-amber-300 flex items-center gap-2">
            <Film className="w-5 h-5 sm:w-6 sm:h-6" /> {pickLang({ ar: 'الفلاشات التعليمية', en: 'Learning Flashes' }, lang)}
          </h1>
          <p className="text-xs text-white/60 mt-0.5">{pickLang({ ar: 'شروحات قصيرة · تطبيق عملي', en: 'Short explainers · hands-on practice' }, lang)}</p>
        </div>
        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
      </div>

      <div className="px-4 sm:px-6 pt-6 space-y-8 max-w-3xl mx-auto">
        {ALL_CATEGORIES.map((cat, idx) => (
          <CategorySection
            key={cat.id}
            category={cat}
            index={idx}
            onOpenFlash={(id) => setActive({ kind: 'flash', lessonId: id })}
            onOpenMult={(id) => setActive({ kind: 'mult', lessonId: id })}
            onOpenChain={(id) => setActive({ kind: 'chain', lessonId: id })}
            onOpenPractice={(id) => setActive({ kind: 'practice', problemId: id })}
          />
        ))}
      </div>
    </div>
  );
}

function CategorySection({
  category, index, onOpenFlash, onOpenMult, onOpenChain, onOpenPractice,
}: {
  category: FlashCategory; index: number;
  onOpenFlash: (id: string) => void;
  onOpenMult: (id: string) => void;
  onOpenChain: (id: string) => void;
  onOpenPractice: (id: string) => void;
}) {
  const { lang } = useT();
  const gradient = CATEGORY_GRADIENTS[category.id] ?? 'from-purple-500 to-violet-700';
  const isEmpty = category.lessons.length === 0;
  const isMult = category.id === 'mult-1' || category.id === 'mult-2';
  const isChain = category.id === 'chains';
  const isDivision = !isMult && !isChain && category.id !== 'basics';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <span className="text-xl">{category.emoji}</span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">{translateDynamic(category, lang, 'title')}</h2>
          <p className="text-xs text-white/50">{translateDynamic(category, lang, 'description')}</p>
        </div>
        {!isEmpty && (
          <span className="text-xs text-amber-300 font-bold px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30">
            <Num>{category.lessons.length}</Num>
          </span>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-white/40">🚧 {pickLang({ ar: 'قيد الإعداد — قريباً', en: 'Under construction — coming soon' }, lang)}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {category.lessons.map((lesson, i) => {
            const problemId = isDivision ? getProblemIdForLesson(lesson.id) : null;
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                gradient={gradient}
                index={i}
                isMult={isMult}
                isChain={isChain}
                hasPractice={problemId !== null}
                onOpenFlash={() => onOpenFlash(lesson.id)}
                onOpenMult={() => onOpenMult(lesson.id)}
                onOpenChain={() => onOpenChain(lesson.id)}
                onOpenPractice={problemId ? () => onOpenPractice(problemId) : undefined}
              />
            );
          })}
        </div>
      )}
    </motion.section>
  );
}

function LessonCard({
  lesson, gradient, index, isMult, isChain, hasPractice,
  onOpenFlash, onOpenMult, onOpenChain, onOpenPractice,
}: {
  lesson: FlashLesson; gradient: string; index: number;
  isMult: boolean; isChain: boolean; hasPractice: boolean;
  onOpenFlash: () => void;
  onOpenMult: () => void;
  onOpenChain: () => void;
  onOpenPractice?: () => void;
}) {
  const { lang } = useT();
  const isBasics = lesson.operation === 'basics';
  const icon = isMult ? '✖️' : isChain ? '🧮' : isBasics ? '📖' : '➗';

  const onPracticeClick = isMult ? onOpenMult : isChain ? onOpenChain : onOpenPractice;
  const practiceDisabled = !isMult && !isChain && !hasPractice;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-bold text-white truncate">{translateDynamic(lesson, lang, 'title')}</p>
          <p className="text-xs sm:text-sm text-amber-300 font-mono truncate mt-0.5">{translateDynamic(lesson, lang, 'subtitle')}</p>
          <p className="text-[10px] sm:text-xs text-white/40 mt-1">
            {lang === 'en'
              ? (<><Num>{lesson.steps.length}</Num> steps · <Num>{lesson.columns}</Num> columns</>)
              : (<><Num>{lesson.steps.length}</Num> خطوة · <Num>{lesson.columns}</Num> أعمدة</>)}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onOpenFlash}
          className={`flex-1 py-2.5 rounded-xl bg-gradient-to-l ${gradient} text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg`}
        >
          <Play className="w-4 h-4 fill-white" /> {pickLang({ ar: 'شاهد', en: 'Watch' }, lang)}
        </motion.button>

        {!isBasics && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onPracticeClick}
            disabled={practiceDisabled}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              practiceDisabled
                ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                : 'bg-emerald-500/25 border-2 border-emerald-400/50 text-emerald-100 hover:bg-emerald-500/35'
            }`}
          >
            <Hand className="w-4 h-4" /> {pickLang({ ar: 'جرّب بنفسك', en: 'Try it yourself' }, lang)}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default FlashListScreen;