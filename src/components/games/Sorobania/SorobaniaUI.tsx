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
import { gt, lt, useGameLang } from '../gamesI18n';

// ═══════════════════════════════════════════════════════════════════
// مكوّنات الواجهة
// ═══════════════════════════════════════════════════════════════════

export const Hud: React.FC<{
  title: string;
  subtitle?: React.ReactNode;
  onBack: () => void;
  muted: boolean;
  onToggleMute: () => void;
  right?: React.ReactNode;
}> = ({ title, subtitle, onBack, muted, onToggleMute, right }) => (
  <div className="z-20 flex h-14 shrink-0 items-center gap-2 border-b border-white/10 bg-[#140f33] px-3">
    <button
      type="button"
      aria-label={gt('رجوع')}
      onClick={onBack}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:scale-95"
    >
      <ArrowRight className={`h-5 w-5 ${lt('', 'rotate-180')}`} />
    </button>
    <div className="min-w-0 flex-1 text-center leading-tight">
      <div className="truncate text-base font-black text-amber-200">{title}</div>
      {subtitle && <div className="truncate text-xs text-white/60">{subtitle}</div>}
    </div>
    {right}
    <button
      type="button"
      aria-label={muted ? gt('تشغيل الصوت') : gt('كتم الصوت')}
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
    <div className="flex w-full items-center gap-2" role="timer" aria-label={gt('الوقت المتبقي')}>
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
  title: React.ReactNode;
  body: React.ReactNode;
  quiz?: { prompt: React.ReactNode; options: React.ReactNode[]; correct: number; why: React.ReactNode };
}

const buildLessonSteps = (id: LessonId): LessonStepData[] => {
  if (id === 'five') {
    return [
      {
        title: <>{lt('سرّ الأعداد التي تنتهي بـ', 'The secret of numbers ending in')} <Num>5</Num></>,
        body: (
          <div className="space-y-4 text-center">
            <div dir="ltr" className="flex flex-wrap items-center justify-center gap-2 text-3xl font-black text-amber-200">
              <span><Num>35</Num>²</span>
              <span>=</span>
              <Chip tone="gold"><Num>3</Num> × <Num>4</Num> = <Num>12</Num></Chip>
              <Chip tone="sky"><Num>25</Num></Chip>
              <span>=</span>
              <span><Num>1225</Num></span>
            </div>
            <p className="text-lg font-bold leading-8 text-white/90">
              {lt(
                <>خذ رقم العشرات (<Num>3</Num>) واضربه في الرقم الذي يليه (<Num>4</Num>) فيكون الناتج <Num>12</Num>، ثم اكتب <Num>25</Num> بجانبه.</>,
                <>Take the tens digit (<Num>3</Num>) and multiply it by the next number (<Num>4</Num>) to get <Num>12</Num>, then write <Num>25</Num> next to it.</>
              )}
            </p>
          </div>
        ),
      },
      {
        title: gt('جرّب بنفسك'),
        body: (
          <p className="text-center text-lg font-bold leading-8 text-white/90">
            {lt(
              <>العشرات في <Num>45</Num> هي <Num>4</Num>، والعدد الذي يليها <Num>5</Num>. اضربهما ثم ألصق <Num>25</Num>.</>,
              <>The tens digit in <Num>45</Num> is <Num>4</Num>, and the next number is <Num>5</Num>. Multiply them, then attach <Num>25</Num>.</>
            )}
          </p>
        ),
        quiz: {
          prompt: <>{lt('ما قيمة', 'What is')} <Num>45</Num>² {lt('؟', '?')}</>,
          options: [<Num>1625</Num>, <Num>2025</Num>, <Num>2425</Num>],
          correct: 1,
          why: <><Num>4</Num> × <Num>5</Num> = <Num>20</Num>، {lt('ثم', 'then')} <Num>25</Num> {lt('فيكون', 'makes')} <Num>2025</Num></>,
        },
      },
      {
        title: gt('مرة أخرى'),
        body: (
          <p className="text-center text-lg font-bold leading-8 text-white/90">
            {lt(
              <>العشرات في <Num>75</Num> هي <Num>7</Num>، والعدد الذي يليها <Num>8</Num>.</>,
              <>The tens digit in <Num>75</Num> is <Num>7</Num>, and the next number is <Num>8</Num>.</>
            )}
          </p>
        ),
        quiz: {
          prompt: <>{lt('ما قيمة', 'What is')} <Num>75</Num>² {lt('؟', '?')}</>,
          options: [<Num>4925</Num>, <Num>5625</Num>, <Num>6425</Num>],
          correct: 1,
          why: <><Num>7</Num> × <Num>8</Num> = <Num>56</Num>، {lt('ثم', 'then')} <Num>25</Num> {lt('فيكون', 'makes')} <Num>5625</Num></>,
        },
      },
      {
        title: gt('أصبحت تعرف السرّ!'),
        body: (
          <p className="text-center text-lg font-bold leading-8 text-white/90">
            {lt(
              <>كل عدد ينتهي بـ <Num>5</Num> يمكنك تربيعه في ثانيتين. هيا إلى بوابة الخمسات!</>,
              <>Any number ending in <Num>5</Num> can be squared in two seconds. Off to the Gate of Fives!</>
            )}
          </p>
        ),
      },
    ];
  }
  return [
    {
      title: <>{lt('الخطوة', 'Step')} <Num>1</Num>: {lt('قسّم إلى أزواج', 'Split into pairs')}</>,
      body: (
        <div className="space-y-4 text-center">
          <div dir="ltr" className="flex items-center justify-center gap-2 text-3xl font-black text-sky-200">
            <span>√<Num>1521</Num></span>
            <span>→</span>
            <Chip tone="sky"><Num>15</Num></Chip>
            <span>|</span>
            <Chip tone="gold"><Num>21</Num></Chip>
          </div>
          <p className="text-lg font-bold leading-8 text-white/90">
            {lt(
              <>قسّم العدد إلى أزواج من اليمين. الزوج الأول (<Num>15</Num>) يعطيك عشرات الجذر: أكبر مربع لا يزيد على <Num>15</Num> هو <Num>9</Num>، أي <Num>3</Num>². إذن العشرات <Num>3</Num>.</>,
              <>Split the number into pairs from the right. The first pair (<Num>15</Num>) gives you the tens of the root: the largest square not greater than <Num>15</Num> is <Num>9</Num>, i.e. <Num>3</Num>². So the tens digit is <Num>3</Num>.</>
            )}
          </p>
        </div>
      ),
    },
    {
      title: <>{lt('الخطوة', 'Step')} <Num>2</Num>: {lt('انظر إلى الآحاد', 'Look at the units')}</>,
      body: (
        <div className="space-y-3 text-center">
          <p className="text-lg font-bold leading-8 text-white/90">
            {lt('آخر رقم في العدد يحدد آحاد الجذر:', 'The last digit of the number decides the units digit of the root:')}
          </p>
          <div dir="ltr" className="mx-auto grid max-w-xs grid-cols-2 gap-2 text-xl font-black">
            <Chip tone="gold">{lt('ينتهي بـ', 'Ends in')} <Num>1</Num> → <Num>1</Num> {lt('أو', 'or')} <Num>9</Num></Chip>
            <Chip tone="sky">{lt('ينتهي بـ', 'Ends in')} <Num>4</Num> → <Num>2</Num> {lt('أو', 'or')} <Num>8</Num></Chip>
            <Chip tone="jade">{lt('ينتهي بـ', 'Ends in')} <Num>6</Num> → <Num>4</Num> {lt('أو', 'or')} <Num>6</Num></Chip>
            <Chip tone="rose">{lt('ينتهي بـ', 'Ends in')} <Num>9</Num> → <Num>3</Num> {lt('أو', 'or')} <Num>7</Num></Chip>
          </div>
          <p className="text-base font-bold text-white/70">
            {lt(
              <>وما ينتهي بـ <Num>0</Num> أو <Num>5</Num> فجذره ينتهي بـ <Num>0</Num> أو <Num>5</Num>.</>,
              <>And what ends in <Num>0</Num> or <Num>5</Num> has a root that ends in <Num>0</Num> or <Num>5</Num>.</>
            )}
          </p>
        </div>
      ),
      quiz: {
        prompt: <>{lt('√', '√')}<Num>1521</Num> {lt('ينتهي بـ', 'ends in')} <Num>1</Num>. {lt('ما الرقم الآخر الذي مربعه ينتهي بـ', 'What other digit squared ends in')} <Num>1</Num> {lt('؟', '?')}</>,
        options: [<Num>3</Num>, <Num>7</Num>, <Num>9</Num>],
        correct: 2,
        why: <><Num>9</Num> × <Num>9</Num> = <Num>81</Num> {lt('وينتهي بـ', 'and ends in')} <Num>1</Num></>,
      },
    },
    {
      title: <>{lt('الخطوة', 'Step')} <Num>3</Num>: {lt('قارن لتختار', 'Compare to choose')}</>,
      body: (
        <div className="space-y-3 text-center">
          <div dir="ltr" className="flex flex-wrap items-center justify-center gap-2 text-2xl font-black text-amber-200">
            <Chip tone="gold"><Num>3</Num> × <Num>4</Num> = <Num>12</Num></Chip>
            <span>{lt('و', 'and')}</span>
            <Chip tone="sky"><Num>15</Num></Chip>
          </div>
          <p className="text-lg font-bold leading-8 text-white/90">
            {lt(
              <>احسب العشرات × العدد الذي يليها (<Num>3</Num> × <Num>4</Num> = <Num>12</Num>). إن كان الزوج الأول أكبر منه أو يساويه (<Num>15</Num> ≥ <Num>12</Num>) فاختر الآحاد الأكبر: <Num>39</Num>. وإن كان أصغر فاختر الأصغر.</>,
              <>Work out the tens × the next number (<Num>3</Num> × <Num>4</Num> = <Num>12</Num>). If the first pair is greater than or equal to it (<Num>15</Num> ≥ <Num>12</Num>), pick the larger units digit: <Num>39</Num>. If it is smaller, pick the smaller one.</>
            )}
          </p>
        </div>
      ),
    },
    {
      title: gt('الآن دورك'),
      body: (
        <p className="text-center text-lg font-bold leading-8 text-white/90">
          {lt(
            <>√<Num>2916</Num> ← الأزواج <Num>29</Num> | <Num>16</Num>. العشرات <Num>5</Num> (لأن <Num>25</Num> ≤ <Num>29</Num>). الآحاد <Num>4</Num> أو <Num>6</Num>. احسب <Num>5</Num> × <Num>6</Num> = <Num>30</Num> وقارن بـ <Num>29</Num>.</>,
            <>√<Num>2916</Num> ← pairs <Num>29</Num> | <Num>16</Num>. The tens digit is <Num>5</Num> (because <Num>25</Num> ≤ <Num>29</Num>). The units digit is <Num>4</Num> or <Num>6</Num>. Work out <Num>5</Num> × <Num>6</Num> = <Num>30</Num> and compare it with <Num>29</Num>.</>
          )}
        </p>
      ),
      quiz: {
        prompt: <>{lt('ما قيمة', 'What is')} √<Num>2916</Num> {lt('؟', '?')}</>,
        options: [<Num>54</Num>, <Num>56</Num>],
        correct: 0,
        why: <><Num>29</Num> {lt('أصغر من', 'is smaller than')} <Num>30</Num> {lt('فنختار الآحاد الأصغر:', 'so we pick the smaller units digit:')} <Num>54</Num></>,
      },
    },
    {
      title: gt('فككت شفرة الجذور!'),
      body: (
        <p className="text-center text-lg font-bold leading-8 text-white/90">
          {lt(
            'أزواج، ثم عشرات، ثم آحاد، ثم مقارنة. هيا إلى كهف الجذور!',
            'Pairs, then tens, then units, then comparison. Off to the Root Cave!'
          )}
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
  useGameLang(); // 🌐
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
        title={lessonId === 'five' ? gt('سرّ الخمسات') : gt('طريقة الأزواج')}
        subtitle={
          <span className="flex items-center justify-center gap-1">
            {lt('الخطوة', 'Step')} <Num>{step + 1}</Num> {lt('من', 'of')} <Num>{steps.length}</Num>
          </span>
        }
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
                      key={i}
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
                {solved && <span className="text-emerald-300">{gt('صحيح!')} {cur.quiz.why}</span>}
                {!solved && picked !== null && <span className="text-rose-300">{gt('ليس تماماً، فكّر وجرّب مرة أخرى')}</span>}
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
          {isLast ? gt(finishLabel) : gt('التالي')}
        </button>
      </div>
    </div>
  );
};