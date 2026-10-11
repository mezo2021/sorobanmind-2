// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/GamesListScreen.tsx — ملف جديد
// ═══════════════════════════════════════════════════════════════════
//
// ما يضيفه:
//   - قائمة الألعاب الخمس
//   - ماكينة تذاكر (شريط تقدم ticketXP/10)
//   - منطق الأقفال (بدون تذكرة = مقفل)
//   - زر شراء تذكرة
//   - ActiveView داخلي (نفس نمط FlashListScreen)
//   - عند فتح لعبة → "🚧 قيد التطوير" مؤقتاً
//
// لا يلمس أي ملف موجود · لا يؤثر على الدروس.
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Ticket, Lock, Play, Sparkles } from 'lucide-react';
import { GAMES, type GameId, type GameMeta } from './gamesData';
import { useProgressStore, TICKET_COST } from '../../store/progressStore';

interface GamesListScreenProps {
  onBack: () => void;
}

type ActiveView =
  | { kind: 'game'; gameId: GameId }
  | null;

export function GamesListScreen({ onBack }: GamesListScreenProps) {
  const [active, setActive] = useState<ActiveView>(null);

  const ticketXP = useProgressStore((s) => s.ticketXP);
  const tickets = useProgressStore((s) => s.tickets);
  const totalXP = useProgressStore((s) => s.totalXP);
  const buyTicket = useProgressStore((s) => s.buyTicket);
  const consumeTicket = useProgressStore((s) => s.consumeTicket);

  const hasTicket = tickets >= 1;
  const canBuy = !hasTicket && ticketXP >= TICKET_COST;
  const progressPct = Math.min(100, (ticketXP / TICKET_COST) * 100);

  const handleOpenGame = (game: GameMeta) => {
    if (!hasTicket) return;
    consumeTicket();
    setActive({ kind: 'game', gameId: game.id });
  };

  if (active?.kind === 'game') {
    return (
      <div
        className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6"
        dir="rtl"
      >
        <h2 className="text-2xl font-black text-amber-300 mb-4">
          🚧 قيد التطوير
        </h2>
        <p className="text-slate-400 mb-8 text-center">
          هذه اللعبة ستُضاف في الجلسة القادمة
        </p>
        <button
          onClick={() => setActive(null)}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          ← العودة للألعاب
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pb-10"
      dir="rtl"
    >
      <div className="flex items-center gap-3 p-4 sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0"
          style={{ touchAction: 'manipulation' }}
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-amber-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> مدينة الألعاب
          </h1>
          <p className="text-xs text-white/60 mt-0.5">العب · تعلّم · استمتع</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4 max-w-3xl mx-auto">
        <TicketMachine
          ticketXP={ticketXP}
          hasTicket={hasTicket}
          canBuy={canBuy}
          progressPct={progressPct}
          onBuy={buyTicket}
          totalXP={totalXP}
        />

        <div className="space-y-3">
          {GAMES.map((game, idx) => (
            <GameCard
              key={game.id}
              game={game}
              index={idx}
              unlocked={hasTicket}
              onOpen={() => handleOpenGame(game)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 🎟️ ماكينة التذاكر
// ═══════════════════════════════════════════════════════════════════

function TicketMachine({
  ticketXP,
  hasTicket,
  canBuy,
  progressPct,
  onBuy,
  totalXP,
}: {
  ticketXP: number;
  hasTicket: boolean;
  canBuy: boolean;
  progressPct: number;
  onBuy: () => void;
  totalXP: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold text-white">تذاكرك</span>
        </div>
        <span className="text-xs text-white/50">XP الكلي: {totalXP}</span>
      </div>

      {hasTicket && (
        <div className="flex items-center justify-center gap-2 py-2">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-3xl"
          >
            🎟️
          </motion.div>
          <span className="text-emerald-400 font-bold text-lg">
            لديك تذكرة · اختر لعبة!
          </span>
        </div>
      )}

      {canBuy && (
        <div className="space-y-3">
          <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
              className="absolute top-0 right-0 h-full bg-gradient-to-l from-amber-400 to-amber-600"
            />
          </div>
          <button
            onClick={onBuy}
            className="w-full py-3 rounded-xl bg-gradient-to-l from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            style={{ touchAction: 'manipulation' }}
          >
            <Ticket className="w-5 h-5" />
            🎟️ اشترِ تذكرة بـ 10 XP
          </button>
        </div>
      )}

      {!hasTicket && !canBuy && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>التقدم نحو التذكرة</span>
            <span className="font-bold text-amber-300">
              {ticketXP} / {TICKET_COST}
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
              className="absolute top-0 right-0 h-full bg-gradient-to-l from-sky-400 to-blue-600"
            />
          </div>
          <p className="text-xs text-white/50 text-center pt-1">
            اجمع {TICKET_COST - ticketXP} XP إضافية للحصول على تذكرة
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 🎮 بطاقة لعبة
// ═══════════════════════════════════════════════════════════════════

function GameCard({
  game,
  index,
  unlocked,
  onOpen,
}: {
  game: GameMeta;
  index: number;
  unlocked: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl border p-3 sm:p-4 transition ${
        unlocked
          ? 'bg-white/5 border-white/10'
          : 'bg-white/[0.02] border-white/5 opacity-60'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-lg`}
        >
          <span className="text-2xl">{game.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-bold text-white truncate">
            {game.title}
          </p>
          <p className="text-xs text-white/50 mt-0.5 truncate">
            {game.subtitle}
          </p>
          <p className="text-[10px] text-amber-300/80 mt-1">
            ⏱️ {game.duration}
          </p>
        </div>
        <button
          onClick={onOpen}
          disabled={!unlocked}
          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition ${
            unlocked
              ? 'bg-gradient-to-br ' + game.gradient + ' shadow-lg active:scale-90'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          {unlocked ? (
            <Play className="w-5 h-5 fill-white text-white" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default GamesListScreen;