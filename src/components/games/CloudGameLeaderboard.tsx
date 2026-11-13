import { useState, useEffect } from 'react';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import { AVATARS } from '@/data/avatars';
import { cloudSync } from '@/lib/cloudSync';
import { Trophy, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Num } from '@/components/Num';

interface Props {
  gameId: string;
}

interface PlayerScore {
  pos: number;
  avatar_id: string | null;
  sequential_number: number | null;
  score: number;
  time_ms: number | null;
  is_me: boolean;
  is_ghost: boolean;
}

interface GhostScore {
  score: number;
  time_ms: number | null;
}

// نقاط الأشباح الأصلية محفوظة كما هي
const GAME_GHOSTS: Record<string, GhostScore[]> = {
  'flying-abacus': [
    { score: 22, time_ms: null },
    { score: 18, time_ms: null },
    { score: 15, time_ms: null },
    { score: 12, time_ms: null },
    { score: 10, time_ms: null },
    { score: 8, time_ms: null },
    { score: 6, time_ms: null },
    { score: 5, time_ms: null },
  ],
  detective: [
    { score: 15, time_ms: null },
    { score: 12, time_ms: null },
    { score: 10, time_ms: null },
    { score: 8, time_ms: null },
    { score: 6, time_ms: null },
  ],
  'sorobania-island': [
    { score: 12, time_ms: null },
    { score: 8, time_ms: null },
    { score: 5, time_ms: null },
    { score: 4, time_ms: null },
    { score: 3, time_ms: null },
    { score: 2, time_ms: null },
  ],
  'sorobania-island-speed': [
    { score: 70, time_ms: null },
    { score: 55, time_ms: null },
    { score: 40, time_ms: null },
    { score: 32, time_ms: null },
    { score: 25, time_ms: null },
    { score: 18, time_ms: null },
  ],
  default: [
    { score: 20, time_ms: null },
    { score: 15, time_ms: null },
    { score: 12, time_ms: null },
    { score: 10, time_ms: null },
    { score: 8, time_ms: null },
    { score: 5, time_ms: null },
  ],
};

export function CloudGameLeaderboard({ gameId }: Props) {
  const { lang } = useT();
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchScores() {
      setLoading(true);
      setScores([]);
      setExpanded(false);
      setLoadError(false);

      try {
        // 1. جلب نتيجة لوحة الشرف V2
        const result = await cloudSync.getHallOfFame(
          gameId,
          'all',
          10
        );

        if (!isMounted) return;

        // 2. فشل الاتصال: لا نعرض الأشباح
        if (!result.success) {
          setLoadError(true);
          console.warn('Leaderboard unavailable:', result.error);
          return;
        }

        // 3. نجاح الاتصال: استخراج اللاعبين الحقيقيين
        const realPlayers: PlayerScore[] = result.entries
          .slice(0, 10)
          .map((p) => ({
            pos: p.pos,
            avatar_id: p.avatar_id,
            sequential_number: p.sequential_number,
            score: p.score,
            time_ms: p.time_ms,
            is_me: p.is_me === true,
            is_ghost: false,
          }));

        // 4. إكمال القائمة بالأشباح حتى 10
        const ghosts = GAME_GHOSTS[gameId] ?? GAME_GHOSTS.default;
        const needed = Math.max(0, 10 - realPlayers.length);

        const ghostPlayers: PlayerScore[] = ghosts
          .slice(0, needed)
          .map((g, index) => {
            const avatar = AVATARS[index % AVATARS.length];

            return {
              pos: 0,
              avatar_id: avatar.id,
              sequential_number: 9000 + index,
              score: g.score,
              time_ms: g.time_ms,
              is_me: false,
              is_ghost: true,
            };
          });

        // 5. الدمج والترتيب
        const combined = [...realPlayers, ...ghostPlayers]
          .sort((a, b) =>
            b.score - a.score ||
            Number(a.is_ghost) - Number(b.is_ghost) ||
            (a.time_ms ?? Infinity) - (b.time_ms ?? Infinity)
          )
          .map((p, index) => ({
            ...p,
            pos: index + 1,
          }));

        setScores(combined);

      } catch (err) {
        console.error('Leaderboard fetch failed:', err);

        if (isMounted) {
          setLoadError(true);
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

  const getAvatar = (avatarId: string | null) =>
    AVATARS.find((avatar) => avatar.id === avatarId);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4 text-sky-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-3 bg-slate-800/30 rounded-xl border border-red-500/30">
        <p className="text-slate-400 text-xs">
          {pickLang(
            {
              ar: 'تعذر تحميل لوحة الشرف. تحقق من اتصال الإنترنت وحاول مجدداً.',
              en: 'Could not load the leaderboard. Check your internet connection and try again.',
            },
            lang
          )}
        </p>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <p className="text-slate-400 text-xs">
          {pickLang({ ar: '🏆 كن الأول! لا يوجد رقم قياسي بعد.', en: '🏆 Be the first! No records yet.' }, lang)}
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
          {pickLang({ ar: 'أبطال هذه اللعبة', en: 'Game Champions' }, lang)}
        </h3>
      </div>

      <div className="p-2 space-y-1">
        {top3.map((s, i) => (
          <div key={s.pos} className={`flex justify-between items-center px-2 py-1.5 rounded-lg ${s.is_me ? 'bg-amber-500/20 border border-amber-500/30' : 'hover:bg-white/5'}`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black w-5 text-center">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </span>
              <span className={`text-xs font-bold ${
                s.is_me ? 'text-amber-300' :
                s.is_ghost ? 'text-slate-500' : 'text-slate-300'
              }`}>
                {(() => {
                  const avatar = getAvatar(s.avatar_id);
                  return (
                    <span className="inline-flex items-center gap-1">
                      <span className="text-base">{avatar?.emoji ?? '🏅'}</span>
                      <span>
                        {avatar
                          ? pickLang({ ar: avatar.nameAr, en: avatar.nameEn }, lang)
                          : pickLang({ ar: 'بطل', en: 'Champion' }, lang)}
                      </span>
                      {s.sequential_number !== null && (
                        <span className="text-[10px] opacity-70">#{s.sequential_number}</span>
                      )}
                    </span>
                  );
                })()}
                {s.is_me && ` (${pickLang({ ar: 'أنت', en: 'You' }, lang)})`}
                {s.is_ghost && (
                  <span className="text-[9px] text-slate-500 font-normal ml-1">
                    {pickLang({ ar: 'تحدٍّ افتراضي', en: 'Virtual challenge' }, lang)}
                  </span>
                )}
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
              ? pickLang({ ar: 'إخفاء القائمة', en: 'Hide List' }, lang)
              : pickLang({ ar: 'عرض المراكز 4 - 10', en: 'Show Ranks 4 - 10' }, lang)}
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
                      <span className={`text-xs ${
                        s.is_me ? 'text-amber-300 font-bold' :
                        s.is_ghost ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {(() => {
                          const avatar = getAvatar(s.avatar_id);
                          return (
                            <span className="inline-flex items-center gap-1">
                              <span className="text-base">{avatar?.emoji ?? '🏅'}</span>
                              <span>
                                {avatar
                                  ? pickLang({ ar: avatar.nameAr, en: avatar.nameEn }, lang)
                                  : pickLang({ ar: 'بطل', en: 'Champion' }, lang)}
                              </span>
                              {s.sequential_number !== null && (
                                <span className="text-[10px] opacity-70">#{s.sequential_number}</span>
                              )}
                            </span>
                          );
                        })()}
                        {s.is_me && ` (${pickLang({ ar: 'أنت', en: 'You' }, lang)})`}
                        {s.is_ghost && (
                          <span className="text-[9px] ml-1">
                            ({pickLang({ ar: 'افتراضي', en: 'Virtual' }, lang)})
                          </span>
                        )}
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