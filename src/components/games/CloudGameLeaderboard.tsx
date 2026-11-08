import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useGameLang } from './gamesI18n';
import { Trophy, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Num } from '@/components/Num';

interface Props {
  gameId: string;
}

interface PlayerScore {
  pos: number;
  display_name: string;
  score: number;
  is_me: boolean;
}

// 🆕 أشباح واقعية لكل لعبة (أرقام قريبة من قدرات الأطفال الفعلية)
const GAME_GHOSTS: Record<string, { name: string; score: number }[]> = {
  'flying-abacus': [
    { name: 'سارة.ع', score: 22 },
    { name: 'عمر.م', score: 18 },
    { name: 'ليان.ي', score: 15 },
    { name: 'آدم.ف', score: 12 },
    { name: 'جنى.ر', score: 10 },
    { name: 'لمى.ج', score: 8 },
    { name: 'يوسف.ح', score: 6 },
    { name: 'نور.ك', score: 5 },
  ],
  'detective': [
    { name: 'عمر.م', score: 15 },
    { name: 'سارة.ع', score: 12 },
    { name: 'آدم.ف', score: 10 },
    { name: 'ليان.ي', score: 8 },
    { name: 'جنى.ر', score: 6 },
  ],
  'default': [
    { name: 'سارة.ع', score: 20 },
    { name: 'عمر.م', score: 15 },
    { name: 'ليان.ي', score: 12 },
    { name: 'آدم.ف', score: 10 },
    { name: 'جنى.ر', score: 8 },
    { name: 'لمى.ج', score: 5 },
  ]
};

export function CloudGameLeaderboard({ gameId }: Props) {
  const { isAr } = useGameLang();
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchScores() {
      setLoading(true);
      setScores([]);
      setExpanded(false);

      try {
        // 1. جلب اللاعبين الحقيقيين من السحابة
        const { data, error } = await supabase.rpc('get_hall_of_fame', {
          p_game_id: gameId,
          p_period: 'all',
          p_limit: 10
        });

        if (!isMounted) return;

        let realPlayers: PlayerScore[] = [];
        if (!error && data) {
          realPlayers = data;
        }

        // 2. جلب الأشباح الخاصة بهذه اللعبة
        const ghosts = GAME_GHOSTS[gameId] || GAME_GHOSTS['default'];
        const ghostPlayers: PlayerScore[] = ghosts.map(g => ({
          pos: 0, // سيتم تحديثه بعد الترتيب
          display_name: g.name,
          score: g.score,
          is_me: false
        }));

        // 3. الدمج والترتيب التنازلي حسب النقاط
        let combined = [...realPlayers, ...ghostPlayers];
        
        // ترتيب: الأعلى نقاطاً أولاً
        combined.sort((a, b) => b.score - a.score);

        // إعادة تعيين المراكز والأخذ بأفضل 10 فقط
        combined = combined.map((p, idx) => ({ ...p, pos: idx + 1 })).slice(0, 10);

        setScores(combined);
      } catch (err) {
        console.error('Leaderboard fetch failed:', err);
        if (isMounted) {
          setScores([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchScores();

    return () => {
      isMounted = false;
    };
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4 text-sky-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <p className="text-slate-400 text-xs">
          {isAr ? '🏆 كن الأول! لا يوجد رقم قياسي بعد.' : '🏆 Be the first! No records yet.'}
        </p>
      </div>
    );
  }

  const top3 = scores.slice(0, 3);
  const rest = scores.slice(3);

  return (
    <div className="w-full max-w-sm bg-slate-900/60 rounded-2xl border border-sky-500/20 overflow-hidden backdrop-blur-sm">
      <div className="bg-sky-500/10 p-2 text-center border-b border-sky-500/20 flex justify-center items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-sky-200">
          {isAr ? 'أبطال هذه اللعبة' : 'Game Champions'}
        </h3>
      </div>

      <div className="p-2 space-y-1">
        {top3.map((s, i) => (
          <div key={s.pos} className={`flex justify-between items-center px-2 py-1.5 rounded-lg ${s.is_me ? 'bg-amber-500/20 border border-amber-500/30' : 'hover:bg-white/5'}`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black w-5 text-center">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </span>
              <span className={`text-xs font-bold ${s.is_me ? 'text-amber-300' : 'text-slate-300'}`}>
                {s.display_name} {s.is_me && `(${isAr ? 'أنت' : 'You'})`}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-sky-300">
              <Num>{s.score}</Num>
            </span>
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-1.5 flex items-center justify-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded 
              ? (isAr ? 'إخفاء القائمة' : 'Hide List') 
              : (isAr ? 'عرض المراكز 4 - 10' : 'Show Ranks 4 - 10')}
          </button>
          
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-slate-900/80 border-t border-slate-800"
              >
                {rest.map((s) => (
                  <div key={s.pos} className={`flex justify-between items-center px-3 py-1.5 border-b border-slate-800/50 last:border-0 ${s.is_me ? 'bg-amber-500/10' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 w-4">#{s.pos}</span>
                      <span className={`text-xs ${s.is_me ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                        {s.display_name}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      <Num>{s.score}</Num>
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}