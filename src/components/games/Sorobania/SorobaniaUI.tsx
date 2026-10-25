// ═══════════════════════════════════════════════════════════════════
// src/components/games/Sorobania/SorobaniaUI.tsx
// 🧩 مكوّنات الواجهة المساعدة + الدروس التفاعلية
// ═══════════════════════════════════════════════════════════════════
// الدور: قطع واجهة صغيرة قابلة لإعادة الاستخدام:
//   • Hud          : الشريط العلوي (رجوع · عنوان · كتم الصوت)
//   • BanaCorner   : بانة (GameCompanion) مع فقاعة الكلام
//   • FuseTimer    : فتيل الوقت أسفل لوحة السؤال
//   • LessonScreen : درسا "سرّ الخمسات" و"طريقة الأزواج" (خطوات + أسئلة)
//
// يستورده: SorobaniaGame
// يعتمد على: sorobaniaData · sorobaniaSfx · GameCompanion · framer-motion
//
// متى تعدّله؟ لتغيير نص درس أو شكل الشريط العلوي أو فقاعة بانة.
// ═══════════════════════════════════════════════════════════════════

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

import { GameCompanion } from '../GameCompanion';
import { sfx } from './sorobaniaSfx';
import {
  HERO_ID,
} from './sorobaniaData';
import type {
  LessonId,
} from './sorobaniaData';
import { Num } from '@/components/Num';

// ═══════════════════════════════════════════════════════════════════
// مكوّنات الواجهة
// ═══════════════════════════════════════════════════════════════════

export const Hud: React.FC<{
  title: string;
  subtitle?: string;
  onBack: () => void;
  muted: boolean;
  onToggleMute: () => void;
  right?: React.ReactNode;
}> = ({ title, subtitle, onBack, muted, onToggleMute, right }) => (
  <div className="z-20 flex h-14 shrink-0 items-center gap-2 border-b border-white/10 bg-[#140f33] px-3">
    <button
      type="button"
      aria-label="رجوع"
      onClick={onBack}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:scale-95"
    >
      <ArrowRight className="h-5 w-5" />
    </button>
    <div className="min-w-0 flex-1 text-center leading-tight">
      <div className="truncate text-base font-black text-amber-200">{title}</div>
      {subtitle && <div className="truncate text-xs text-white/60">{subtitle}</div>}
    </div>
    {right}
    <button
      type="button"
      aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
      onClick={onToggleMute}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:scale-95"
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  </div>
);

// بانة: كل ما يخص GameCompanion في مكان واحد
export const BanaCorner: React.FC<{ excited: boolean; message: string }> = ({ excited, message }) => (
  <div className="pointer-events-none absolute bottom-1 right-1 z-10 flex flex-col items-end gap-1">
    <AnimatePresence mode="popLayout">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-[170px] rounded-2xl rounded-br-sm bg-white px-3 py-1.5 text-xs font-extrabold leading-snug text-[#2b1a55] shadow-lg"
      >
        {message}
      </motion.div>
    </AnimatePresence>
    <div className="h-24 w-24 origin-bottom-right scale-90">
      <GameCompanion heroId={HERO_ID} mood={excited ? 'excited' : 'idle'} />
    </div>
  </div>
);

export const FuseTimer: React.FC<{ total: number; frozen: boolean; onExpire: () => void }> = ({ total, frozen, onExpire }) => {
  const [remaining, setRemaining] = useState<number>(total);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (frozen) return;
    const t0 = performance.now();
    let fired = false;
    let lastWhole = Math.ceil(total);
    const id = window.setInterval(() => {
      const rem = Math.max(0, total - (performance.now() - t0) / 1000);
      setRemaining(rem);
      const whole = Math.ceil(rem);
      if (whole !== lastWhole) {
        lastWhole = whole;
        if (whole > 0 && whole <= 3) sfx.tick();
      }
      if (rem <= 0 && !fired) {
        fired = true;
        window.clearInterval(id);
        expireRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [frozen, total]);

  const pct = (remaining / total) * 100;
  const color = pct > 55 ? '#f59e0b' : pct > 28 ? '#ea580c' : '#dc2626';

  return (
    <div className="flex w-full items-center gap-2" role="timer" aria-label="الوقت المتبقي">
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#3a2410]/25">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color, transition: 'width 100ms linear' }} />
      </div>
      <span className="w-6 text-center text-sm font-black" style={{ color }}>
        <Num>{Math.ceil(remaining)}</Num>
      </span>
    </div>
  );
};

const Chip: React.FC<{ tone?: 'gold' | 'sky' | 'jade' | 'rose'; children: React.ReactNode }> = ({ tone = 'gold', children }) => {
  const map = {
    gold: 'bg-amber-400/20 border-amber-300/60 text-amber-200',
    sky: 'bg-sky-400/20 border-sky-300/60 text-sky-200',
    jade: 'bg-emerald-400/20 border-emerald-300/60 text-emerald-200',
    rose: 'bg-rose-400/20 border-rose-300/60 text-rose-200',
  } as const;
  return <span className={`inline-block rounded-xl border-2 px-3 py-1 ${map[tone]}`}>{children}</span>;
};

// ═══════════════════════════════════════════════════════════════════
// الدروس: سرّ الخمسات · طريقة الأزواج
// ═══════════════════════════════════════════════════════════════════

interface LessonStepData {
  title: string;
  body: React.ReactNode;
  quiz?: { prompt: string; options: string[]; correct: number; why: string };
}

const buildLessonSteps = (id: LessonId): LessonStepData[] => {
  if (id === 'five') {
    return [
      {
        title: 'سرّ الأعداد التي تنتهي بـ 5',
        body: (
          <div className="space-y-4 text-center">
            <div dir="ltr" className="flex flex-wrap items-center justify-center gap-2 text-3xl font-black text-amber-200">
              <span>35²</span>
              <span>=</span>
              <Chip tone="gold">3 × 4 = 12</Chip>
              <Chip tone="sky">25</Chip>
              <span>=</span>
              <span>1225</span>
            </div>
            <p className="text-lg font-bold leading-8 text-white/90">
              خذ رقم العشرات (3) واضربه في الرقم الذي يليه (4) فيكون الناتج 12، ثم اكتب 25 بجانبه.
            </p>
          </div>
        ),
      },
      {
        title: 'جرّب بنفسك',
        body: (
          <p className="text-center text-lg font-bold leading-8 text-white/90">
            العشرات في 45 هي 4، والعدد الذي يليها 5. اضربهما ثم ألصق 25.
          </p>
        ),
        quiz: {
          prompt: 'ما قيمة 45² ؟',
          options: ['1625', '2025', '2425'],
          correct: 1,
          why: '4 × 5 = 20، ثم 25 فيكون 2025',
        },
      },
      {
        title: 'مرة أخرى',
        body: (
          <p className="text-center text-lg font-bold leading-8 text-white/90">
            العشرات في 75 هي 7، والعدد الذي يليها 8.
          </p>
        ),
        quiz: {
          prompt: 'ما قيمة 75² ؟',
          options: ['4925', '5625', '6425'],
          correct: 1,
          why: '7 × 8 = 56، ثم 25 فيكون 5625',
        },
      },
      {
        title: 'أصبحت تعرف السرّ!',
        body: (
          <p className="text-center text-lg font-bold leading-8 text-white/90">
            كل عدد ينتهي بـ 5 يمكنك تربيعه في ثانيتين. هيا إلى بوابة الخمسات!
          </p>
        ),
      },
    ];
  }
  return [
    {
      title: 'الخطوة 1: قسّم إلى أزواج',
      body: (
        <div className="space-y-4 text-center">
          <div dir="ltr" className="flex items-center justify-center gap-2 text-3xl font-black text-sky-200">
            <span>√1521</span>
            <span>→</span>
            <Chip tone="sky">15</Chip>
            <span>|</span>
            <Chip tone="gold">21</Chip>
          </div>
          <p className="text-lg font-bold leading-8 text-white/90">
            قسّم العدد إلى أزواج من اليمين. الزوج الأول (15) يعطيك عشرات الجذر: أكبر مربع لا يزيد على 15 هو 9، أي 3². إذن العشرات 3.
          </p>
        </div>
      ),
    },
    {
      title: 'الخطوة 2: انظر إلى الآحاد',
      body: (
        <div className="space-y-3 text-center">
          <p className="text-lg font-bold leading-8 text-white/90">
            آخر رقم في العدد يحدد آحاد الجذر:
          </p>
          <div dir="ltr" className="mx-auto grid max-w-xs grid-cols-2 gap-2 text-xl font-black">
            <Chip tone="gold">ينتهي بـ 1 → 1 أو 9</Chip>
            <Chip tone="sky">ينتهي بـ 4 → 2 أو 8</Chip>
            <Chip tone="jade">ينتهي بـ 6 → 4 أو 6</Chip>
            <Chip tone="rose">ينتهي بـ 9 → 3 أو 7</Chip>
          </div>
          <p className="text-base font-bold text-white/70">وما ينتهي بـ 0 أو 5 فجذره ينتهي بـ 0 أو 5.</p>
        </div>
      ),
      quiz: {
        prompt: '√1521 ينتهي بـ 1. ما الرقم الآخر الذي مربعه ينتهي بـ 1؟',
        options: ['3', '7', '9'],
        correct: 2,
        why: '9 × 9 = 81 وينتهي بـ 1',
      },
    },
    {
      title: 'الخطوة 3: قارن لتختار',
      body: (
        <div className="space-y-3 text-center">
          <div dir="ltr" className="flex flex-wrap items-center justify-center gap-2 text-2xl font-black text-amber-200">
            <Chip tone="gold">3 × 4 = 12</Chip>
            <span>و</span>
            <Chip tone="sky">15</Chip>
          </div>
          <p className="text-lg font-bold leading-8 text-white/90">
            احسب العشرات × العدد الذي يليها (3 × 4 = 12). إن كان الزوج الأول أكبر منه أو يساويه (15 ≥ 12) فاختر الآحاد الأكبر: 39. وإن كان أصغر فاختر الأصغر.
          </p>
        </div>
      ),
    },
    {
      title: 'الآن دورك',
      body: (
        <p className="text-center text-lg font-bold leading-8 text-white/90">
          √2916 ← الأزواج 29 | 16. العشرات 5 (لأن 25 ≤ 29). الآحاد 4 أو 6. احسب 5 × 6 = 30 وقارن بـ 29.
        </p>
      ),
      quiz: {
        prompt: 'ما قيمة √2916 ؟',
        options: ['54', '56'],
        correct: 0,
        why: '29 أصغر من 30 فنختار الآحاد الأصغر: 54',
      },
    },
    {
      title: 'فككت شفرة الجذور!',
      body: (
        <p className="text-center text-lg font-bold leading-8 text-white/90">
          أزواج، ثم عشرات، ثم آحاد، ثم مقارنة. هيا إلى كهف الجذور!
        </p>
      ),
    },
  ];
};

export const LessonScreen: React.FC<{
  lessonId: LessonId;
  finishLabel: string;
  onDone: () => void;
  onBack: () => void;
  muted: boolean;
  onToggleMute: () => void;
}> = ({ lessonId, finishLabel, onDone, onBack, muted, onToggleMute }) => {
  const steps = useMemo(() => buildLessonSteps(lessonId), [lessonId]);
  const [step, setStep] = useState<number>(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState<boolean>(false);

  const cur = steps[step];
  const isLast = step === steps.length - 1;
  const canNext = !cur.quiz || solved;

  const goNext = () => {
    sfx.click();
    if (isLast) {
      onDone();
      return;
    }
    setStep((s) => s + 1);
    setPicked(null);
    setSolved(false);
  };

  const choose = (i: number) => {
    if (solved || !cur.quiz) return;
    setPicked(i);
    if (i === cur.quiz.correct) {
      setSolved(true);
      sfx.correct(3);
    } else {
      sfx.wrong();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[#1d1546] to-[#0d0926]">
      <Hud
        title={lessonId === 'five' ? 'سرّ الخمسات' : 'طريقة الأزواج'}
        subtitle={`الخطوة ${step + 1} من ${steps.length}`}
        onBack={onBack}
        muted={muted}
        onToggleMute={onToggleMute}
      />
      <div className="flex shrink-0 justify-center gap-2 py-3" aria-hidden="true">
        {steps.map((_, i) => (
          <span key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-amber-300' : i < step ? 'w-2 bg-amber-300/70' : 'w-2 bg-white/20'}`} />
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 border-amber-300/30 bg-[#241a5c]/80 p-5 shadow-xl"
        >
          <h2 className="mb-4 text-center text-2xl font-black text-amber-300">{cur.title}</h2>
          {cur.body}

          {cur.quiz && (
            <div className="mt-5 space-y-3">
              <div className="text-center text-xl font-black">{cur.quiz.prompt}</div>
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cur.quiz.options.length}, minmax(0, 1fr))` }}>
                {cur.quiz.options.map((opt, i) => {
                  const isRight = solved && i === cur.quiz!.correct;
                  const isWrong = picked === i && i !== cur.quiz!.correct;
                  return (
                    <motion.button
                      key={opt}
                      type="button"
                      onClick={() => choose(i)}
                      animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                      transition={{ duration: 0.35 }}
                      whileTap={{ scale: 0.95 }}
                      dir="ltr"
                      className={`h-20 rounded-2xl border-b-8 text-3xl font-black ${
                        isRight
                          ? 'border-emerald-800 bg-emerald-500 text-white'
                          : isWrong
                            ? 'border-rose-900 bg-rose-500 text-white'
                            : 'border-[#6b4a26] bg-gradient-to-b from-[#c9a06a] to-[#a67b44] text-[#2b1808]'
                      }`}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
              <div className="min-h-[2.5rem] text-center text-base font-extrabold">
                {solved && <span className="text-emerald-300">صحيح! {cur.quiz.why}</span>}
                {!solved && picked !== null && <span className="text-rose-300">ليس تماماً، فكّر وجرّب مرة أخرى</span>}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="shrink-0 px-4 pb-4">
        <button
          type="button"
          disabled={!canNext}
          onClick={goNext}
          className={`h-14 w-full rounded-2xl border-b-8 text-xl font-black transition ${
            canNext
              ? 'border-[#a4620f] bg-gradient-to-b from-amber-300 to-amber-500 text-[#2b1808] active:translate-y-1 active:border-b-4'
              : 'border-white/10 bg-white/10 text-white/40'
          }`}
        >
          {isLast ? finishLabel : 'التالي'}
        </button>
      </div>
    </div>
  );
};
