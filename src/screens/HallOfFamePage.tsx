import { useState, useEffect } from 'react';
import {
  HallOfFameScreen,
  type LeaderboardUser,
  type TabType,
  type TimeFilter,
} from '@/components/HallOfFameScreen';
import { cloudSync } from '@/lib/cloudSync';
import { useGameLang } from '@/components/games/gamesI18n';
import { pickLang } from '@/i18n/pickLang';
import { AVATARS } from '@/data/avatars';

interface GhostScore {
  score: number;
  time_ms: number | null;
}

type RankedPlayer = LeaderboardUser & {
  isGhost: boolean;
  timeMs: number | null;
};

// نقاط الأشباح الأصلية من CloudGameLeaderboard
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

function formatTime(timeMs: number | null): string {
  if (timeMs == null) return '--:--';

  const mins = Math.floor(timeMs / 60000);
  const secs = Math.floor((timeMs % 60000) / 1000);

  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function getPlayerIdentity(
  avatarId: string | null,
  sequentialNumber: number | null,
  isAr: boolean
): { name: string; avatar: string } {
  const avatar = AVATARS.find((item) => item.id === avatarId);

  const emoji = avatar?.emoji ?? '🏅';
  const characterName = avatar
    ? pickLang(
        { ar: avatar.nameAr, en: avatar.nameEn },
        isAr ? 'ar' : 'en'
      )
    : isAr
      ? 'بطل'
      : 'Champion';

  const number = sequentialNumber ?? '—';

  return {
    avatar: emoji,
    name: `${emoji} ${characterName} #${number}`,
  };
}

export default function HallOfFamePage({
  onBack,
}: {
  onBack: () => void;
}) {
  const { isAr } = useGameLang();

  const [subFilter, setSubFilter] = useState<string>('level_0');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const [players, setPlayers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);

      try {
        const period = timeFilter === 'all' ? 'all' : 'month';

        const [topResult, myResult] = await Promise.all([
          cloudSync.getHallOfFame(subFilter, period, 10),
          cloudSync.getMyRankDetails(subFilter, period),
        ]);

        if (!isMounted) return;

        // قائمة المتصدرين: لاعبون حقيقيون + أشباح افتراضية
        if (topResult.success) {
          // 1. اللاعبون الحقيقيون
          const realPlayers: RankedPlayer[] = topResult.entries
            .slice(0, 10)
            .map((entry) => {
              const identity = getPlayerIdentity(
                entry.avatar_id,
                entry.sequential_number,
                isAr
              );

              return {
                id: `player-${entry.pos}`,
                rank: entry.pos,
                name: identity.name,
                avatar: identity.avatar,
                score: entry.score,
                time: formatTime(entry.time_ms),
                accuracy: 100,
                isGhost: false,
                timeMs: entry.time_ms,
              };
            });

          // 2. إكمال القائمة بالأشباح حتى 10
          const ghosts = GAME_GHOSTS[subFilter] ?? GAME_GHOSTS.default;
          const needed = Math.max(0, 10 - realPlayers.length);

          const ghostPlayers: RankedPlayer[] = ghosts
            .slice(0, needed)
            .map((ghost, index) => {
              const avatar = AVATARS.length
                ? AVATARS[index % AVATARS.length]
                : undefined;

              const identity = getPlayerIdentity(
                avatar?.id ?? null,
                9000 + index,
                isAr
              );

              return {
                id: `ghost-${subFilter}-${index}`,
                rank: 0,
                name: identity.name,
                avatar: identity.avatar,
                score: ghost.score,
                time: formatTime(ghost.time_ms),
                accuracy: 100,
                isGhost: true,
                timeMs: ghost.time_ms,
              };
            });

          // 3. الدمج والترتيب: الحقيقي يسبق الشبح عند التعادل
          const combined = [...realPlayers, ...ghostPlayers]
            .sort(
              (a, b) =>
                b.score - a.score ||
                Number(a.isGhost) - Number(b.isGhost) ||
                (a.timeMs ?? Infinity) - (b.timeMs ?? Infinity)
            )
            .map((player, index) => ({
              id: player.id,
              rank: index + 1,
              name: player.name,
              avatar: player.avatar,
              score: player.score,
              time: player.time,
              accuracy: player.accuracy,
            }));

          setPlayers(combined);
        } else {
          console.error('Hall of Fame list error:', topResult.error);
          setPlayers([]);
        }

        // ترتيب اللاعب الحالي
        if (myResult.success && myResult.data.length > 0) {
          const mine = myResult.data[0];

          const identity = getPlayerIdentity(
            mine.avatar_id,
            mine.sequential_number,
            isAr
          );

          setCurrentUser({
            id: 'me',
            rank: Number(mine.player_rank),
            name: identity.name,
            avatar: identity.avatar,
            score: mine.score,
            time: formatTime(mine.time_ms),
            accuracy: 100,
          });
        } else {
          if (!myResult.success) {
            console.error('My rank details error:', myResult.error);
          }

          setCurrentUser(undefined);
        }
      } catch (err) {
        console.error('Hall of Fame fetch error:', err);

        if (isMounted) {
          setPlayers([]);
          setCurrentUser(undefined);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [subFilter, timeFilter, isAr]);

  const handleTabChange = (_tab: TabType, sub: string) => {
    setSubFilter(sub);
  };

  const handleTimeChange = (time: TimeFilter) => {
    setTimeFilter(time);
  };

  return (
    <div className="relative min-h-screen">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 rtl:right-6 rtl:left-auto z-50 p-2 bg-slate-800/80 rounded-full hover:bg-slate-700 text-white transition"
      >
        <span className="text-xl">→</span>
      </button>

      <HallOfFameScreen
        isAr={isAr}
        players={players}
        currentUser={currentUser}
        loading={loading}
        onTabChange={handleTabChange}
        onTimeChange={handleTimeChange}
      />
    </div>
  );
}