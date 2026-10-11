// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/HighScoreBadge.tsx — ملف جديد
// ═══════════════════════════════════════════════════════════════════
//
// ما يضيفه:
//   - شارة عرض الرقم القياسي (full + compact)
//   - عرض الشهر الحالي
//   - عرض كل السجلات (top 3) في full
//   - حالات فارغة مع رسالة تشجيعية
//
// لا يلمس أي ملف موجود.
// ═══════════════════════════════════════════════════════════════════

import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Sparkles } from 'lucide-react';
import {
  getTopScores,
  getHighScore,
  getCurrentMonthLabel,
  formatRecordAge,
  type HighScoreEntry,
} from './highScoreStore';
import { useEffect, useState } from 'react';

// ═══ الأنواع ═══
interface HighScoreBadgeProps {
  gameId: string;
  variant?: 'full' | 'compact';
}

// ═══ شارة مضغوطة (للبطاقة في القائمة) ═══
function CompactBadge({ gameId }: { gameId: string }) {
  const [high, setHigh] = useState<HighScoreEntry | null>(null);

  useEffect(() => {
    setHigh(getHighScore(gameId));
  }, [gameId]);

  if (!high) return null;

  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-bold">
      <Trophy className="w-3 h-3" />
      <span className="tabular-nums">{high.value}</span>
    </span>
  );
}

// ═══ أيقونة الترتيب ═══
function RankIcon({ rank }: { rank: number }) {
  if (rank === 0) return <Crown className="w-4 h-4 text-amber-400" />;
  if (rank === 1) return <Medal className="w-4 h-4 text-slate-300" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-amber-700" />;
  return <Sparkles className="w-4 h-4 text-white/40" />;
}

// ═══ شارة كاملة (لشاشة البداية) ═══
function FullBadge({ gameId }: { gameId: string }) {
  const [scores, setScores] = useState<HighScoreEntry[]>([]);
  const [monthLabel, setMonthLabel] = useState('');

  useEffect(() => {
    setScores(getTopScores(gameId, 3));
    setMonthLabel(getCurrentMonthLabel());
  }, [gameId]);

  // ═══ حالة فارغة ═══
  if (scores.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-xs mx-auto rounded-2xl border border-dashed border-amber-400/40 bg-amber-500/5 p-4 text-center"
      >
        <Trophy className="w-6 h-6 text-amber-300/60 mx-auto mb-2" />
        <p className="text-sm font-bold text-amber-200">
          🏆 كُنِ الأَوَّل!
        </p>
        <p className="text-[10px] text-white/50 mt-1">
          لا يوجد رقم قياسي بعد
        </p>
        <p className="text-[10px] text-white/30 mt-0.5">
          📅 سِجِلُّ {monthLabel}
        </p>
      </motion.div>
    );
  }

  // ═══ عرض السجلات ═══
  const top = scores[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-xs mx-auto rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent p-4 shadow-lg shadow-amber-500/10"
    >
      {/* الرأس */}
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <Trophy className="w-5 h-5 text-amber-400" />
        <span className="text-xs font-bold text-amber-200">
          الرَّقَمُ القِيَاسِيُّ
        </span>
        <span className="text-[10px] text-white/40 mr-1">
          · {monthLabel}
        </span>
      </div>

      {/* السجل الأول (الأكبر) */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Crown className="w-6 h-6 text-amber-400" />
        </motion.div>
        <span className="text-4xl font-black font-display text-amber-300 tabular-nums">
          {top.value}
        </span>
      </div>

      <div className="text-center mb-3">
        <p className="text-sm font-bold text-white">
          {top.name}
        </p>
        <p className="text-[10px] text-white/40">
          {formatRecordAge(top.date)}
        </p>
      </div>

      {/* السجلات 2-3 (إن وُجدت) */}
      {scores.length > 1 && (
        <>
          <div className="h-px bg-white/10 my-3" />
          <div className="space-y-1.5">
            {scores.slice(1).map((entry, idx) => (
              <div
                key={`${entry.name}-${entry.date}`}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <RankIcon rank={idx + 1} />
                  <span className="text-white/70 truncate">
                    {entry.name}
                  </span>
                </div>
                <span className="font-bold text-white/60 tabular-nums shrink-0">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

// ═══ المكوّن الرئيسي ═══
export function HighScoreBadge({
  gameId,
  variant = 'full',
}: HighScoreBadgeProps) {
  if (variant === 'compact') {
    return <CompactBadge gameId={gameId} />;
  }
  return <FullBadge gameId={gameId} />;
}

export default HighScoreBadge;