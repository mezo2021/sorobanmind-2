// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/SolutionPlayer.tsx
// ═══════════════════════════════════════════════════════════════════
//
// مشغّل الحل التفاعلي (الجسر التعليمي) — يعمل للضرب والقسمة.
//
//   ┌ 24 × 7                          اخترتَ 148 ┐
//   │ سبب الخطأ                                   │
//   │ تدرّج الحل:  0 ← 140 ← 168   (شرائح تُلمس)  │
//   │ المعداد: أرقام فوق الأعمدة · شرائح +2 +8    │
//   │ ⏮ ◀ ▶/⏸ ▶⏭   الخطوة 2 / 2                  │
//   │ ✔ 1  2 × 7 = 14            140              │
//   │ ● 2  4 × 7 = 28            168   ← الحالية  │
//   │ [متابعة السباق]                              │
//   └─────────────────────────────────────────────┘
//
// • كل الخطوات ظاهرة دائماً · الحالية مضيئة ومشروحة · اللمس على أي خطوة ينقلك إليها
// • تشغيل تلقائي بطيء (1.3 ث/خطوة) يتوقف عند أول تفاعل
// • الزمن متوقف طوال العرض (الطور 'review' خارج ساعة اللعب)
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Check } from 'lucide-react';
import MultiRodAbacus, { type RodChip } from './MultiRodAbacus';
import { rodsFromNumber } from './mulEngine';
import { carriesFor, type QuizProblem, type ReviewInfo } from './quizTypes';

const COLS = 5;
const AUTO_FIRST_MS = 600;
const AUTO_STEP_MS = 1300;

const ROD_NAMES = ['الآحَاد', 'العَشَرَات', 'المِئَات', 'الأُلُوف', 'عَشَرَاتِ الأُلُوف'];
const rodName = (i: number) => ROD_NAMES[i] ?? `المَنْزِلَة ${i + 1}`;

function errorLabel(info: ReviewInfo, op: 'mul' | 'div'): string {
  switch (info.kind) {
    case 'missed': return 'هَذَا الجُزْءُ الَّذِي نَسِيتَه';
    case 'carry': return 'هُنَا يَجِبُ الحَمْل';
    case 'padding': return op === 'div' ? 'هُنَا يُكْتَبُ الصِّفْر' : 'هُنَا نَسِيتَ الصِّفْر';
    case 'bringdown': return 'هُنَا نَسِيتَ إِنْزَالَ رَقْم';
    case 'estimate': return 'هُنَا قَدَّرْتَ الرَّقْمَ خَطَأً';
    default: return 'هُنَا مَوْضِعُ الخَطَأ';
  }
}

interface Props {
  problem: QuizProblem;
  info: ReviewInfo;
  onContinue: () => void;
}

export function SolutionPlayer({ problem, info, onContinue }: Props) {
  const steps = problem.steps;
  const last = steps.length - 1;

  const [idx, setIdx] = useState(-1);          // -1 = معداد فارغ
  const [playing, setPlaying] = useState(true);

  // تشغيل تلقائي حتى أول تفاعل
  useEffect(() => {
    if (!playing) return;
    if (idx >= last) { setPlaying(false); return; }
    const t = setTimeout(() => setIdx((i) => i + 1), idx === -1 ? AUTO_FIRST_MS : AUTO_STEP_MS);
    return () => clearTimeout(t);
  }, [playing, idx, last]);

  const goto = (i: number) => {
    setPlaying(false);
    setIdx(Math.max(-1, Math.min(last, i)));
  };
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    if (idx >= last) setIdx(-1);
    setPlaying(true);
  };
  const restart = () => { setIdx(-1); setPlaying(true); };

  // ═══ ما يُعرض الآن ═══
  const step = idx >= 0 ? steps[idx] : null;
  const prevRunning = idx > 0 ? steps[idx - 1].running : 0;
  const running = step ? step.running : 0;
  const digits = rodsFromNumber(running, COLS);
  const prevDigits = rodsFromNumber(prevRunning, COLS);

  const changedRods = step
    ? digits.map((d, i) => (d !== prevDigits[i] ? i : -1)).filter((i) => i >= 0)
    : [];
  const chips: RodChip[] = step?.add
    ? step.add.map((a) => ({ rod: COLS - 1 - a.rod, text: `+${a.digit}`, dim: a.digit === 0 }))
    : [];
  const activeRods = step ? step.rods.map((r) => COLS - 1 - r) : [];
  const carryRods = step?.add ? carriesFor(prevDigits, step.add) : [];

  // سلسلة التدرّج: 0 ← 140 ← 168
  const chain = [0, ...steps.map((s) => s.running)];

  const atEnd = idx >= last;

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md overflow-y-auto"
      dir="rtl"
    >
      <div className="min-h-full w-full max-w-md mx-auto flex flex-col gap-2.5 px-4 pt-3">
        {/* الرأس */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-rose-400 font-bold text-sm">⚡ تَصْحِيحُ المَسَار</span>
          <span className="text-[11px] text-slate-400">⏸ الوَقْتُ مُتَوَقِّف</span>
        </div>

        {/* المسألة + اختيار الطفل */}
        <div className="flex items-center justify-between">
          <div className="text-3xl font-black text-amber-300 font-mono tabular-nums" dir="ltr">
            {problem.a} {problem.symbol} {problem.b}
          </div>
          {info.wrongValue !== null && (
            <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-500/30 rounded-full px-3 py-1">
              اخْتَرْتَ <span className="font-black tabular-nums">{info.wrongValue}</span>
            </div>
          )}
        </div>

        {/* سبب الخطأ */}
        <div className="bg-slate-900/85 border border-rose-500/30 rounded-xl px-3 py-2 text-center text-[11px] text-rose-100 font-bold leading-relaxed">
          {info.why}
        </div>

        {/* تدرّج الحل */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" dir="ltr">
          {chain.map((v, j) => {
            const active = j - 1 === idx;
            const done = j - 1 < idx;
            return (
              <div key={j} className="flex items-center gap-1.5 shrink-0">
                {j > 0 && <span className="text-slate-600 text-xs">→</span>}
                <button
                  onClick={() => goto(j - 1)}
                  className={`px-2.5 py-1 rounded-full text-xs font-black font-mono tabular-nums border transition ${
                    active
                      ? 'bg-sky-500 text-white border-sky-300 shadow-lg shadow-sky-500/30'
                      : done
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                  aria-label={`الانتقال إلى ${v}`}
                >
                  {v}
                </button>
              </div>
            );
          })}
        </div>

        {/* المعداد */}
        <MultiRodAbacus
          digits={digits}
          activeRods={activeRods}
          unitRodIndex={COLS - 1}
          columns={COLS}
          chips={chips}
          arcText={step?.arcText}
          changedRods={changedRods}
          carryRods={carryRods}
        />

        {/* أزرار التحكم */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-slate-400 tabular-nums shrink-0">
            الخُطْوَة <span className="text-sky-300 font-black">{Math.max(idx + 1, 0)}</span> / {steps.length}
          </div>

          <div className="flex items-center gap-1.5" dir="ltr">
            <CtrlBtn label="إعادة من البداية" onClick={restart}><RotateCcw className="w-4 h-4" /></CtrlBtn>
            <CtrlBtn label="الخطوة السابقة" onClick={() => goto(idx - 1)} disabled={idx < 0}>
              <SkipBack className="w-4 h-4" />
            </CtrlBtn>
            <CtrlBtn label={playing ? 'إيقاف' : 'تشغيل'} onClick={togglePlay} primary>
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </CtrlBtn>
            <CtrlBtn label="الخطوة التالية" onClick={() => goto(idx + 1)} disabled={atEnd}>
              <SkipForward className="w-4 h-4" />
            </CtrlBtn>
          </div>
        </div>

        {/* كل الخطوات ظاهرة · اللمس ينقلك إليها */}
        <div className="flex flex-col gap-2">
          {steps.map((s, i) => {
            const current = i === idx;
            const done = i < idx;
            const isErr = info.stepIndex === i;
            return (
              <button
                key={i}
                onClick={() => goto(i)}
                className={`text-right rounded-2xl px-3 py-2 transition border-2 ${
                  isErr
                    ? 'border-dashed border-rose-400 bg-rose-950/50'
                    : current
                    ? 'border-sky-400 bg-sky-950/60 shadow-lg shadow-sky-500/20'
                    : done
                    ? 'border-emerald-700/50 bg-slate-900/70'
                    : 'border-slate-800 bg-slate-900/50 opacity-60'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                      done ? 'bg-emerald-500 text-slate-950' : current ? 'bg-sky-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  <span className="flex-1 text-sm font-black text-amber-200 font-mono text-right" dir="ltr">
                    {s.formula ?? ''}
                  </span>
                  <span className="text-xs font-black text-sky-300 tabular-nums font-mono" dir="ltr">
                    = {s.running}
                  </span>
                </div>

                {isErr && (
                  <div className="mt-1 text-[11px] font-black text-rose-300">🔴 {errorLabel(info, problem.op)}</div>
                )}

                {/* الخطوة الحالية: الشرح الكامل + أين يُكتب كل رقم */}
                {current && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5">
                    <p className="text-[11px] text-sky-100 font-bold leading-relaxed">{s.text}</p>
                    {s.add && (
                      <p className="mt-1 text-[11px] text-amber-200 font-bold">
                        {s.add.map((a) => `${a.digit} عَلَى ${rodName(a.rod)}`).join('  ·  ')}
                      </p>
                    )}
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        {/* النتيجة النهائية */}
        <motion.div
          animate={{ opacity: atEnd ? 1 : 0.35, scale: atEnd ? 1 : 0.97 }}
          className="text-center text-sm font-bold text-amber-300"
        >
          الإِجَابَةُ الصَّحِيحَة: <span className="text-lg font-mono tabular-nums">{problem.answer}</span>
          {atEnd && <span className="mr-1">✔</span>}
        </motion.div>

        {/* زر المتابعة ثابت أسفل الشاشة */}
        <div className="sticky bottom-0 -mx-4 mt-auto px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
          <button
            onClick={onContinue}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg active:scale-95 transition"
            style={{ touchAction: 'manipulation' }}
          >
            ▶️ مُتَابَعَةُ السِّبَاق
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CtrlBtn({
  children, onClick, disabled, primary, label,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`w-10 h-10 rounded-full flex items-center justify-center border transition active:scale-90 disabled:opacity-30 ${
        primary
          ? 'bg-sky-500 border-sky-300 text-white shadow-lg shadow-sky-500/30 w-12 h-12'
          : 'bg-slate-800 border-slate-600 text-slate-200'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
    </button>
  );
}

export default SolutionPlayer;
