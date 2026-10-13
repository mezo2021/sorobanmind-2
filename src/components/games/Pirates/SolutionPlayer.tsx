// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/SolutionPlayer.tsx  (v2)
// ═══════════════════════════════════════════════════════════════════
//
// مشغّل الحل التفاعلي (الجسر التعليمي) عند الخطأ أو انتهاء الوقت.
//
//   الضرب  : معداد واحد (الناتج يُبنى جزءاً جزءاً)
//   القسمة : معدادان كما في دروس القسمة
//            🔴 المقسوم (يسار) يتناقص   ·   🟢 الناتج (يمين) ينمو
//
// خطوات الشرح = نفس بنية الدروس:  البداية ← خطوات العمل ← الختام
//   القسمة: لكل رقم "نأخذ ونقسم" ثم "نطرح"      (837 ÷ 3 = 8 خطوات)
//   الضرب : لكل ضرب رقمين جزء                    (3 × 32 = 4 خطوات)
//
// • كل الخطوات ظاهرة · اللمس على أي خطوة أو أي رقم في السلسلة ينقلك إليها
// • تشغيل تلقائي بطيء يتوقف عند أول تفاعل · الزمن متوقف طوال العرض
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Check } from 'lucide-react';
import MultiRodAbacus, { type RodChip, type AbacusTone } from './MultiRodAbacus';
import { rodsFromNumber } from './mulEngine';
import { carriesFor, type QuizProblem, type QuizStep, type ReviewInfo } from './quizTypes';

const AUTO_FIRST_MS = 700;
const AUTO_STEP_MS = 1500;

const ROD_NAMES = ['الآحَاد', 'العَشَرَات', 'المِئَات', 'الأُلُوف', 'عَشَرَاتِ الأُلُوف'];
const rodName = (i: number) => ROD_NAMES[i] ?? `المَنْزِلَة ${i + 1}`;

function errorLabel(info: ReviewInfo, op: 'mul' | 'div'): string {
  switch (info.kind) {
    case 'missed': return 'هَذَا الجُزْءُ الَّذِي نَسِيتَه';
    case 'carry': return 'هُنَا يَجِبُ الحَمْل';
    case 'padding': return op === 'div' ? 'هُنَا يُكْتَبُ الصِّفْر' : 'هُنَا نَسِيتَ الصِّفْر';
    case 'bringdown': return 'هُنَا نَسِيتَ إِنْزَالَ رَقْم';
    case 'estimate': return 'هُنَا قَدَّرْتَ الرَّقْمَ خَطَأً';
    case 'shift': return 'هُنَا المَنْزِلَةُ خَاطِئَة';
    case 'swap': return 'هُنَا قَلَبْتَ الرَّقْمَيْن';
    default: return 'هُنَا مَوْضِعُ الخَطَأ';
  }
}

const PHASE_ICON: Record<string, string> = { divide: '➗', subtract: '➖', zero: '0️⃣', partial: '✖️' };

interface Props {
  problem: QuizProblem;
  info: ReviewInfo;
  onContinue: () => void;
}

export function SolutionPlayer({ problem, info, onContinue }: Props) {
  const isDiv = problem.op === 'div';
  const steps = problem.steps;
  const n = steps.length;
  const cols = isDiv ? Math.max(2, String(problem.a).length) : 5;

  // idx: -1 = البداية · 0..n-1 = الخطوات · n = الختام
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    if (idx >= n) { setPlaying(false); return; }
    const t = setTimeout(() => setIdx((i) => i + 1), idx === -1 ? AUTO_FIRST_MS : AUTO_STEP_MS);
    return () => clearTimeout(t);
  }, [playing, idx, n]);

  const goto = (i: number) => {
    setPlaying(false);
    setIdx(Math.max(-1, Math.min(n, i)));
  };
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    if (idx >= n) setIdx(-1);
    setPlaying(true);
  };
  const restart = () => { setIdx(-1); setPlaying(true); };

  // ═══ حالة المعدادات عند خطوة معيّنة ═══
  const view = (i: number): { running: number; auxValue: number; step: QuizStep | null } => {
    if (i < 0 || n === 0) return { running: 0, auxValue: problem.a, step: null };
    const st = steps[Math.min(i, n - 1)];
    return { running: st.running, auxValue: st.aux ? st.aux.value : problem.a, step: i >= n ? null : st };
  };
  const cur = view(idx);
  const prev = view(idx - 1);
  const step = cur.step;

  const mainDigits = rodsFromNumber(cur.running, cols);
  const mainPrev = rodsFromNumber(prev.running, cols);
  const mainChanged = idx >= 0 && idx < n
    ? mainDigits.map((d, i) => (d !== mainPrev[i] ? i : -1)).filter((i) => i >= 0)
    : [];
  const mainChips: RodChip[] = step?.add
    ? step.add.map((a) => ({ rod: cols - 1 - a.rod, text: `+${a.digit}`, dim: a.digit === 0 }))
    : [];
  const mainActive = step ? step.rods.map((r) => cols - 1 - r) : [];
  const mainCarry = step?.add ? carriesFor(mainPrev, step.add) : [];

  const auxDigits = rodsFromNumber(cur.auxValue, cols);
  const auxPrev = rodsFromNumber(prev.auxValue, cols);
  const auxChanged = idx >= 0 && idx < n
    ? auxDigits.map((d, i) => (d !== auxPrev[i] ? i : -1)).filter((i) => i >= 0)
    : [];
  const auxChips: RodChip[] = step?.aux
    ? step.aux.chips.map((c) => ({ rod: cols - 1 - c.rod, text: c.text, dim: c.dim }))
    : [];
  const auxActive = step?.aux ? step.aux.rods.map((r) => cols - 1 - r) : [];

  // ═══ سلاسل التدرّج ═══
  const mulChain = [
    { v: 0, at: -1 },
    ...steps.map((s, i) => ({ v: s.running, at: i })),
  ];
  const divRed = [
    { v: problem.a, at: -1 },
    ...steps.flatMap((s, i) => (s.phase === 'subtract' && s.aux ? [{ v: s.aux.value, at: i }] : [])),
  ];
  const divGreen = [
    { v: 0, at: -1 },
    ...steps.flatMap((s, i) => (s.phase === 'divide' || s.phase === 'zero' ? [{ v: s.running, at: i }] : [])),
  ];

  // ═══ الشرح الحالي ═══
  const introText = isDiv
    ? `نَضَعُ المَقْسُومَ ${problem.a} عَلَى المِعْدَادِ الأَحْمَر، وَنَقْسِمُ عَلَى ${problem.b} مِنَ اليَسَار. رَقْمُ القِسْمَةِ يُكْتَبُ فِي مَنْزِلَةِ آخِرِ رَقْمٍ أَخَذْنَاهُ.`
    : `نَبْدَأُ بِمِعْدَادٍ فَارِغ · نَضْرِبُ كُلَّ رَقْمٍ مِنَ ${problem.a} فِي كُلِّ رَقْمٍ مِنَ ${problem.b} مِنَ اليَسَار. نَاتِجُ رَقْمَيْنِ يَشْغَلُ مَنْزِلَتَيْنِ دَائِماً.`;
  const finalText = isDiv
    ? `انْتَهَتِ القِسْمَة! النَّاتِج: ${problem.answer} · البَاقِي صِفْر`
    : `انْتَهَتِ العَمَلِيَّة! النَّاتِج: ${problem.answer}`;
  const caption = idx < 0 ? introText : idx >= n ? finalText : steps[idx].text;
  const captionErr = idx >= 0 && idx < n && info.stepIndex === idx;

  const atEnd = idx >= n;
  const totalCards = n + 2;
  const progress = Math.round(((idx + 1) / (totalCards - 1)) * 100);

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

        {/* شريط التقدّم */}
        <div className="h-1 rounded-full bg-slate-800 overflow-hidden" dir="ltr">
          <div className="h-full bg-sky-400 transition-all duration-300" style={{ width: `${Math.max(0, progress)}%` }} />
        </div>

        {/* سلاسل التدرّج */}
        {isDiv ? (
          <div className="flex flex-col gap-1.5">
            <Chain label="🔴 المقسوم" tone="red" items={divRed} idx={idx} onPick={goto} />
            <Chain label="🟢 الناتج" tone="green" items={divGreen} idx={idx} onPick={goto} />
          </div>
        ) : (
          <Chain label="الناتج" tone="blue" items={mulChain} idx={idx} onPick={goto} />
        )}

        {/* المعدادات */}
        {isDiv ? (
          <div className="grid grid-cols-2 gap-2" dir="ltr">
            <Panel title="🔴 المقسوم" value={cur.auxValue} tone="red">
              <MultiRodAbacus
                digits={auxDigits} columns={cols} compact tone="red"
                activeRods={auxActive} chips={auxChips} arcText={step?.aux?.arcText}
                changedRods={auxChanged}
              />
            </Panel>
            <Panel title="🟢 الناتج" value={cur.running} tone="green">
              <MultiRodAbacus
                digits={mainDigits} columns={cols} compact tone="green"
                activeRods={mainActive} chips={mainChips} arcText={step?.arcText}
                changedRods={mainChanged} carryRods={mainCarry}
              />
            </Panel>
          </div>
        ) : (
          <MultiRodAbacus
            digits={mainDigits} columns={cols} tone="blue"
            activeRods={mainActive} chips={mainChips} arcText={step?.arcText}
            changedRods={mainChanged} carryRods={mainCarry}
          />
        )}

        {/* شرح الخطوة الحالية (كما في الدروس) */}
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`min-h-[56px] rounded-2xl px-3 py-2.5 text-center text-[12px] font-bold leading-relaxed flex flex-col items-center justify-center gap-0.5 ${
            captionErr
              ? 'bg-rose-950/70 border-2 border-dashed border-rose-400 text-rose-100'
              : 'bg-slate-900/90 border border-sky-500/40 text-sky-100'
          }`}
        >
          {captionErr && <span className="text-rose-300 font-black">🔴 {errorLabel(info, problem.op)}</span>}
          <span>{caption}</span>
          {step?.add && !isDiv && (
            <span className="text-amber-200 text-[11px]">
              {step.add.map((a) => `${a.digit} عَلَى ${rodName(a.rod)}`).join('  ·  ')}
            </span>
          )}
        </motion.div>

        {/* التحكم */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-slate-400 tabular-nums shrink-0">
            الخُطْوَة <span className="text-sky-300 font-black">{idx + 2}</span> / {totalCards}
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

        {/* كل الخطوات ظاهرة */}
        <div className="flex flex-col gap-1.5">
          <StepCard
            label="0" icon="🏁" mono={`${problem.a} ${problem.symbol} ${problem.b}`}
            state={idx === -1 ? 'current' : 'done'} onClick={() => goto(-1)}
          />
          {steps.map((s, i) => (
            <StepCard
              key={i}
              label={`${i + 1}`}
              icon={PHASE_ICON[s.phase ?? 'partial']}
              mono={s.formula ?? ''}
              right={s.phase === 'subtract' && s.aux ? `المقسوم ${s.aux.value}` : `الناتج ${s.running}`}
              rightTone={s.phase === 'subtract' ? 'red' : isDiv ? 'green' : 'blue'}
              state={i === idx ? 'current' : i < idx ? 'done' : 'todo'}
              error={info.stepIndex === i ? errorLabel(info, problem.op) : undefined}
              onClick={() => goto(i)}
            />
          ))}
          <StepCard
            label="✓" icon="🏆" mono={`= ${problem.answer}`}
            state={atEnd ? 'current' : 'todo'} onClick={() => goto(n)}
          />
        </div>

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

// ═══════════════════════════════════════════════════════════════════
// مكوّنات مساعدة
// ═══════════════════════════════════════════════════════════════════
const TONE_CHIP: Record<AbacusTone, { on: string; done: string; label: string }> = {
  blue:  { on: 'bg-sky-500 text-white border-sky-300 shadow-lg shadow-sky-500/30', done: 'bg-sky-950/60 text-sky-300 border-sky-700/50', label: 'text-sky-300' },
  red:   { on: 'bg-rose-500 text-white border-rose-300 shadow-lg shadow-rose-500/30', done: 'bg-rose-950/60 text-rose-300 border-rose-700/50', label: 'text-rose-300' },
  green: { on: 'bg-emerald-500 text-white border-emerald-300 shadow-lg shadow-emerald-500/30', done: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50', label: 'text-emerald-300' },
};

function Chain({
  label, tone, items, idx, onPick,
}: {
  label: string;
  tone: AbacusTone;
  items: { v: number; at: number }[];
  idx: number;
  onPick: (i: number) => void;
}) {
  const C = TONE_CHIP[tone];
  // الشريحة الحالية = آخر عنصر تحقق (at ≤ idx)
  let currentAt = items[0].at;
  for (const it of items) if (it.at <= idx) currentAt = it.at;
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" dir="ltr">
      {items.map((it, j) => {
        const active = it.at === currentAt;
        const done = it.at < currentAt;
        return (
          <div key={j} className="flex items-center gap-1.5 shrink-0">
            {j > 0 && <span className="text-slate-600 text-xs">→</span>}
            <button
              onClick={() => onPick(it.at)}
              className={`px-2.5 py-1 rounded-full text-xs font-black font-mono tabular-nums border transition ${
                active ? C.on : done ? C.done : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
              style={{ touchAction: 'manipulation' }}
              aria-label={`الانتقال إلى ${it.v}`}
            >
              {it.v}
            </button>
          </div>
        );
      })}
      <span className={`text-[10px] font-bold shrink-0 mr-1 ${C.label}`} dir="rtl">{label}</span>
    </div>
  );
}

function Panel({ title, value, tone, children }: { title: string; value: number; tone: AbacusTone; children: ReactNode }) {
  const C = TONE_CHIP[tone];
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-1.5 min-w-0">
      <div className="flex items-center justify-between px-1 pb-1" dir="rtl">
        <span className={`text-[11px] font-black ${C.label}`}>{title}</span>
        <span className="text-sm font-black text-amber-200 font-mono tabular-nums">{value}</span>
      </div>
      {children}
    </div>
  );
}

function StepCard({
  label, icon, mono, right, rightTone = 'blue', state, error, onClick,
}: {
  label: string;
  icon: string;
  mono: string;
  right?: string;
  rightTone?: AbacusTone;
  state: 'done' | 'current' | 'todo';
  error?: string;
  onClick: () => void;
}) {
  const C = TONE_CHIP[rightTone];
  return (
    <button
      onClick={onClick}
      className={`text-right rounded-2xl px-3 py-2 transition border-2 ${
        error
          ? 'border-dashed border-rose-400 bg-rose-950/50'
          : state === 'current'
          ? 'border-sky-400 bg-sky-950/60 shadow-lg shadow-sky-500/20'
          : state === 'done'
          ? 'border-emerald-700/50 bg-slate-900/70'
          : 'border-slate-800 bg-slate-900/50 opacity-60'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
            state === 'done' ? 'bg-emerald-500 text-slate-950' : state === 'current' ? 'bg-sky-400 text-slate-950' : 'bg-slate-700 text-slate-300'
          }`}
        >
          {state === 'done' ? <Check className="w-3.5 h-3.5" /> : label}
        </span>
        <span className="text-sm shrink-0">{icon}</span>
        <span className="flex-1 text-sm font-black text-amber-200 font-mono text-right" dir="ltr">{mono}</span>
        {right && <span className={`text-[11px] font-black tabular-nums shrink-0 ${C.label}`}>{right}</span>}
      </div>
      {error && <div className="mt-1 text-[11px] font-black text-rose-300">🔴 {error}</div>}
    </button>
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
      className={`rounded-full flex items-center justify-center border transition active:scale-90 disabled:opacity-30 ${
        primary
          ? 'bg-sky-500 border-sky-300 text-white shadow-lg shadow-sky-500/30 w-12 h-12'
          : 'bg-slate-800 border-slate-600 text-slate-200 w-10 h-10'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
    </button>
  );
}

export default SolutionPlayer;
