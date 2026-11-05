// src/components/games/MentalArchivesGame/competition/ResultModal.tsx
// شاشة نتائج سينمائية موحّدة: duel | relay | ghost
import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RotateCcw, Home } from 'lucide-react';
import { useGameLang } from '../../gamesI18n';
import { Num } from '@/components/Num';
import { maskName } from '@/utils/maskName';

export interface DuelSide { name: string; score: number; accuracy: number; timeSec: number; streak: number }
export interface RelayPlayer { name: string; points: number; correct: number; total: number }
export interface GhostData { playerTimeSec: number; ghostTimeSec: number; deltas: number[]; isPB: boolean; ghostLabel: string }

export type ResultProps =
  | { mode: 'duel'; a: DuelSide; b: DuelSide; onRematch: () => void; onExit: () => void }
  | { mode: 'relay'; players: RelayPlayer[]; teamScore: number; syncRounds: number; rounds: number; onRematch: () => void; onExit: () => void }
  | { mode: 'ghost'; data: GhostData; onRematch: () => void; onExit: () => void };

const fmt = (s: number) => s.toFixed(1);

function burst(strong: boolean, reduce: boolean | null) {
  try {
    confetti({ particleCount: reduce ? 20 : strong ? 160 : 60, spread: strong ? 100 : 60, origin: { y: 0.55 }, colors: ['#FBBF24', '#F59E0B', '#FDE68A', '#a78bfa', '#38bdf8'] });
  } catch { /* noop */ }
}

export function teamTitle(avgAcc: number, syncRatio: number, isAr: boolean) {
  if (syncRatio >= 0.6) return isAr ? 'فريق عواصف السوروبان' : 'Soroban Storm Team';
  if (avgAcc >= 0.8) return isAr ? 'فريق برق الحدود' : 'Border Lightning Team';
  if (avgAcc >= 0.5) return isAr ? 'فريق مستكشفي الثقوب' : 'Wormhole Explorers';
  return isAr ? 'فريق الأبطال الصاعدين' : 'Rising Heroes';
}

export default function ResultModal(props: ResultProps) {
  const { dir, isAr } = useGameLang();
  const reduce = useReducedMotion();

  const victory =
    props.mode === 'duel' ? props.a.score !== props.b.score
    : props.mode === 'ghost' ? props.data.playerTimeSec < props.data.ghostTimeSec
    : true;

  useEffect(() => { if (victory) burst(true, reduce); }, [victory, reduce]);

  const shell = (children: React.ReactNode) => (
    <motion.div className="fixed inset-0 z-[90] bg-[#04050d]/92 backdrop-blur-md flex items-center justify-center p-4 overflow-auto" dir={dir} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div initial={{ scale: 0.85, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-slate-900/80 p-5 text-center shadow-[0_0_40px_rgba(168,85,247,0.35)]">
        {children}
        <div className="mt-5 flex gap-2">
          <button onClick={props.onRematch} className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" />{isAr ? 'إعادة التحدي' : 'Rematch'}</button>
          <button onClick={props.onExit} className="flex-1 py-3 rounded-2xl font-bold bg-slate-800 border border-slate-600 flex items-center justify-center gap-2"><Home className="w-4 h-4" />{isAr ? 'خروج' : 'Exit'}</button>
        </div>
      </motion.div>
    </motion.div>
  );

  // ═══ 1v1: انقسام الزمكان ═══
  if (props.mode === 'duel') {
    const { a, b } = props;
    const aWins = a.score > b.score;
    const tie = a.score === b.score;
    const rows: [string, string, string][] = [
      [isAr ? 'الزمن الكلي' : 'Total time', `${fmt(a.timeSec)}s`, `${fmt(b.timeSec)}s`],
      [isAr ? 'الدقة' : 'Accuracy', `${Math.round(a.accuracy * 100)}%`, `${Math.round(b.accuracy * 100)}%`],
      [isAr ? 'أطول سلسلة' : 'Best streak', String(a.streak), String(b.streak)],
    ];
    return shell(
      <>
        <h2 className="text-2xl font-black text-amber-300 mb-3">{isAr ? 'انقسام الزمكان' : 'Spacetime Split'}</h2>
        <div className="relative grid grid-cols-2 rounded-2xl overflow-hidden mb-3">
          {[a, b].map((p, i) => {
            const win = !tie && (i === 0 ? aWins : !aWins);
            return (
              <motion.div key={i} initial={{ opacity: 0.3 }} animate={{ opacity: win || tie ? 1 : 0.55 }} className="py-5 px-2"
                style={{ background: win ? 'radial-gradient(circle, #fbbf2455, transparent 70%)' : i === 0 ? 'radial-gradient(circle, #38bdf833, transparent 70%)' : 'radial-gradient(circle, #f472b633, transparent 70%)' }}>
                <div className="text-3xl">{win ? '👑' : tie ? '🤝' : '🌟'}</div>
                <div className="font-black truncate">{maskName(p.name)}</div>
                <div className="text-3xl font-mono font-black text-amber-200"><Num>{p.score}</Num></div>
              </motion.div>
            );
          })}
        </div>
        <div className="space-y-1.5 text-sm">
          {rows.map(([l, x, y]) => (
            <div key={l} className="flex justify-between bg-white/5 rounded-lg px-3 py-1.5 font-mono"><span><Num>{x}</Num></span><span className="font-sans text-slate-400 text-xs">{l}</span><span><Num>{y}</Num></span></div>
          ))}
        </div>
        <p className="mt-3 text-emerald-300 font-bold text-sm">
          {tie ? (isAr ? 'تعادل أسطوري! كلاكما بطل 🌠' : 'A legendary tie! Both are heroes 🌠')
            : isAr ? `مبارك ${maskName((aWins ? a : b).name)}! وللمنافس: أداء رائع، الجولة القادمة لك! 💪` : `Congrats ${maskName((aWins ? a : b).name)}! And to the runner-up: great run, next round is yours! 💪`}
        </p>
      </>
    );
  }

  // ═══ تتابع جماعي: شبكة الهولوغرام ═══
  if (props.mode === 'relay') {
    const { players, teamScore, syncRounds, rounds } = props;
    const totalPts = Math.max(1, players.reduce((s, p) => s + p.points, 0));
    const ranked = [...players].sort((a, b) => b.points - a.points);
    const acc = players.reduce((s, p) => s + p.correct, 0) / Math.max(1, players.reduce((s, p) => s + p.total, 0));
    const title = teamTitle(acc, syncRounds / Math.max(1, rounds), isAr);
    const heights = ['h-24', 'h-16', 'h-12'];
    const order = [ranked[1], ranked[0], ranked[2]];
    const hOrder = [heights[1], heights[0], heights[2]];
    const colors = ['#cbd5e1', '#fbbf24', '#d97706'];
    return shell(
      <>
        <h2 className="text-2xl font-black text-cyan-300 mb-1">{isAr ? 'شبكة الهولوغرام' : 'Hologram Grid'}</h2>
        <div className="inline-block px-4 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/50 text-fuchsia-200 font-black text-sm mb-3">🏅 {title}</div>
        <div className="flex items-end justify-center gap-2 mb-3" dir="ltr" style={{ perspective: 600 }}>
          {order.map((p, i) => p && (
            <motion.div key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 * i }} className="flex-1 text-center">
              <div className="text-xs font-bold truncate" style={{ color: colors[i] }}>{maskName(p.name)}</div>
              <div className={`${hOrder[i]} rounded-t-xl border-t-2 bg-gradient-to-b from-white/15 to-transparent`} style={{ borderColor: colors[i], boxShadow: `0 0 18px ${colors[i]}66`, transform: 'rotateX(12deg)' }}>
                <div className="pt-1 font-mono font-black text-amber-200"><Num>{p.points}</Num></div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="space-y-2 text-xs text-right">
          {players.map((p, i) => {
            const pct = Math.round((p.points / totalPts) * 100);
            return (
              <div key={i}>
                <div className="flex justify-between"><span className="font-bold">{maskName(p.name)}</span><span className="font-mono"><Num>{pct}</Num>%</span></div>
                <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden" dir="ltr">
                  <motion.div className="h-full rounded-full" style={{ background: ['#38bdf8', '#f472b6', '#a78bfa'][i % 3], transformOrigin: 'left' }} initial={{ scaleX: 0 }} animate={{ scaleX: pct / 100 }} transition={{ duration: 0.9, delay: 0.2 * i }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-amber-200 font-bold">{isAr ? 'نقاط الفريق' : 'Team score'}: <Num>{teamScore}</Num> · {isAr ? 'جولات متزامنة' : 'Synced rounds'}: <Num>{syncRounds}</Num>/<Num>{rounds}</Num></p>
      </>
    );
  }

  // ═══ الشبح: مرآة الزمن ═══
  const { data } = props;
  const won = data.playerTimeSec < data.ghostTimeSec;
  const closePct = Math.min(99, Math.round((data.ghostTimeSec / Math.max(0.1, data.playerTimeSec)) * 100));
  const maxAbs = Math.max(1, ...data.deltas.map((d) => Math.abs(d)));
  return shell(
    <>
      <h2 className="text-2xl font-black text-violet-300 mb-1">{isAr ? 'مرآة الزمن' : 'Time Mirror'}</h2>
      <p className="text-xs text-slate-400 mb-3">{data.ghostLabel}</p>
      <div className="flex justify-around mb-3 font-mono">
        <div><div className="text-3xl font-black text-sky-300"><Num>{fmt(data.playerTimeSec)}</Num>s</div><div className="text-[11px] font-sans text-slate-400">{isAr ? 'أنت' : 'You'}</div></div>
        <div><div className="text-3xl font-black text-violet-300/80"><Num>{fmt(data.ghostTimeSec)}</Num>s</div><div className="text-[11px] font-sans text-slate-400">{isAr ? 'الشبح' : 'Ghost'}</div></div>
      </div>
      {/* مخطط: أين ربحت/خسرت الوقت (أخضر = ربح، وردي = خسارة) */}
      <div className="flex items-center justify-center gap-1 h-24 bg-white/5 rounded-xl px-2" dir="ltr">
        {data.deltas.map((d, i) => {
          const h = Math.max(6, (Math.abs(d) / maxAbs) * 40);
          return (
            <div key={i} className="flex-1 h-full flex flex-col justify-center items-center">
              <div className="flex-1 w-full flex items-end justify-center">{d < 0 && <motion.div className="w-full max-w-[14px] rounded-t bg-emerald-400" initial={{ height: 0 }} animate={{ height: h }} transition={{ delay: 0.05 * i }} />}</div>
              <div className="h-px w-full bg-slate-600" />
              <div className="flex-1 w-full flex items-start justify-center">{d >= 0 && <motion.div className="w-full max-w-[14px] rounded-b bg-rose-400" initial={{ height: 0 }} animate={{ height: h }} transition={{ delay: 0.05 * i }} />}</div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-500 mt-1">{isAr ? 'أخضر: ربحتَ وقتاً · وردي: خسرتَ وقتاً' : 'Green: gained · Pink: lost'}</p>
      <p className={`mt-3 font-black ${won ? 'text-emerald-300' : 'text-amber-300'}`}>
        {won ? (isAr ? 'لقد فتحت ثقباً زمنياً جديداً!' : 'You opened a new time wormhole!')
          : isAr ? `اقتربت بنسبة ${closePct}% من سجل الشبح` : `You got ${closePct}% close to the ghost's record`}
      </p>
      {data.isPB && <p className="text-xs text-fuchsia-300 mt-1">⭐ {isAr ? 'رقم شخصي جديد!' : 'New personal best!'}</p>}
    </>
  );
}
