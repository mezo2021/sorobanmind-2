// src/components/games/MentalArchivesGame/competition/CompetitionHub.tsx
// بوابة أنماط المنافسة الثلاثة + إعداد الأسماء والصعوبة.
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useGameLang } from '../../gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import TiltCard from '@/components/cosmic/TiltCard';
import DuelMode from './DuelMode';
import RelayMode from './RelayMode';
import GhostMode, { GhostSource } from './GhostMode';
import OnlineDuelLobby from '@/components/competition/OnlineDuelLobby';

type View = 'hub' | 'duel' | 'relay' | 'ghost' | 'online';

export default function CompetitionHub({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const childName = useProgressStore((s) => s.childName);
  const [view, setView] = useState<View>('hub');
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [src, setSrc] = useState<GhostSource>('pb');
  const [n, setN] = useState<string[]>([childName || (isAr ? 'لاعب ١' : 'Player 1'), isAr ? 'لاعب ٢' : 'Player 2', isAr ? 'لاعب ٣' : 'Player 3']);
  const setName = (i: number, v: string) => setN((p) => p.map((x, k) => (k === i ? v : x)));
  const back = () => setView('hub');

  const body = (() => {
    if (view === 'duel') return <DuelMode names={[n[0] || '—', n[1] || '—']} level={level} onExit={back} />;
    if (view === 'relay') return <RelayMode names={[n[0] || '—', n[1] || '—', n[2] || '—']} onExit={back} />;
    if (view === 'online') return <OnlineDuelLobby onBack={back} />;
    if (view === 'ghost') return <GhostMode source={src} level={level} onExit={back} />;
    const cards: { id: View; icon: string; glow: string; ta: string; te: string; da: string; de: string }[] = [
      { id: 'duel', icon: '⚔️', glow: '#38bdf8', ta: 'تحدي انقسام الزمكان', te: 'Spacetime Split Duel', da: 'مواجهة بين شخصين بأشرطة زخم حيّة', de: '1v1 with live momentum bars' },
      { id: 'relay', icon: '🌐', glow: '#a78bfa', ta: 'تحالف الثقوب الدودية', te: 'Wormhole Alliance', da: '٣ لاعبين: آحاد وعشرات ومئات', de: '3 players: ones, tens, hundreds' },
      { id: 'ghost', icon: '👻', glow: '#22d3ee', ta: 'تحدي مرآة الزمن', te: 'Time Mirror vs Ghost', da: 'تغلّب على شبحك أو أسرع بطل', de: 'Beat your ghost or the top champion' },
    ];
    return (
      <div className="relative min-h-[100dvh] text-white" dir={dir}>
        <CosmicBackground />
        <div className="relative z-10 max-w-xl mx-auto p-4">
          <button onClick={onBack} className="mb-4 text-amber-400 font-bold flex items-center gap-2"><ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />{isAr ? 'رجوع' : 'Back'}</button>
          <h1 className="text-3xl font-black text-amber-300 mb-4 drop-shadow-[0_0_14px_rgba(251,191,36,0.5)]">{isAr ? 'ساحات المنافسة' : 'Arenas'}</h1>

          <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
            {n.map((v, i) => (
              <input key={i} value={v} onChange={(e) => setName(i, e.target.value)} maxLength={30} className="bg-slate-900/70 border border-slate-700 rounded-xl px-2 py-2 text-center text-white" aria-label={`player ${i + 1}`} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4 text-xs items-center">
            <span className="text-slate-400">{isAr ? 'الصعوبة:' : 'Level:'}</span>
            {([1, 2, 3] as const).map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={`px-3 py-1.5 rounded-full border ${level === l ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'border-slate-700 text-slate-400'}`}>{l === 1 ? (isAr ? 'سهل' : 'Easy') : l === 2 ? (isAr ? 'متوسط' : 'Medium') : (isAr ? 'صعب' : 'Hard')}</button>
            ))}
            <span className="text-slate-400 mx-1">{isAr ? 'الشبح:' : 'Ghost:'}</span>
            {(['pb', 'top'] as const).map((s) => (
              <button key={s} onClick={() => setSrc(s)} className={`px-3 py-1.5 rounded-full border ${src === s ? 'bg-violet-500/20 border-violet-400 text-violet-200' : 'border-slate-700 text-slate-400'}`}>{s === 'pb' ? (isAr ? 'رقمي الشخصي' : 'My PB') : (isAr ? 'أسرع بطل' : 'Top champ')}</button>
            ))}
          </div>

          <div className="space-y-3">
            <TiltCard glow="#22c55e" pulse onClick={() => setView('online')} className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🌐</span>
                <div><h3 className="font-black text-lg text-emerald-300">{isAr ? 'تحدي أونلاين 🌐' : 'Online Duel 🌐'}</h3><p className="text-xs text-slate-300">{isAr ? 'سباق مباشر ضد صديق على جهاز آخر' : 'Live race vs a friend on another device'}</p></div>
              </div>
            </TiltCard>
            {cards.map((c) => (
              <TiltCard key={c.id} glow={c.glow} pulse onClick={() => setView(c.id)} className="p-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{c.icon}</span>
                  <div><h3 className="font-black text-lg" style={{ color: c.glow }}>{isAr ? c.ta : c.te}</h3><p className="text-xs text-slate-300">{isAr ? c.da : c.de}</p></div>
                </div>
              </TiltCard>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-4">{isAr ? 'تنبيه: وضع الثنائي والجماعي يُلعبان بالتناوب على نفس الجهاز.' : 'Note: duel and relay are played by turns on one device.'}</p>
        </div>
      </div>
    );
  })();

  // انتقال "الثقب الدودي" بين الشاشات
  return (
    <AnimatePresence mode="wait">
      <motion.div key={view} initial={{ opacity: 0, scale: 0.94, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.06, rotate: 1 }} transition={{ duration: 0.35 }}>
        {body}
      </motion.div>
    </AnimatePresence>
  );
}
