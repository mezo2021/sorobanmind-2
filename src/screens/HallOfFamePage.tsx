import { useState, useEffect } from 'react';
import { HallOfFameScreen, type LeaderboardUser, type TabType, type TimeFilter } from '@/components/HallOfFameScreen';
import { supabase } from '@/lib/supabase';
import { useGameLang } from '@/components/games/gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import { maskName } from '@/utils/maskName';

export default function HallOfFamePage({ onBack }: { onBack: () => void }) {
  const { isAr } = useGameLang();
  const childName = useProgressStore((s) => s.childName) || 'بطل';
  
  const [subFilter, setSubFilter] = useState<string>('level_0');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  
  const [players, setPlayers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      setLoading(true);
      try {
        const period = timeFilter === 'all' ? 'all' : 'month';
        
        const { data: topData, error: topError } = await supabase.rpc('get_hall_of_fame', {
          p_game_id: subFilter,
          p_period: period,
          p_limit: 10
        });

        const { data: myData, error: myError } = await supabase.rpc('get_my_rank_details', {
          p_game_id: subFilter,
          p_period: period
        });

        if (!topError && topData && isMounted) {
          const mapped: LeaderboardUser[] = topData.map((s: any) => {
            const mins = s.time_ms != null ? Math.floor(s.time_ms / 60000) : 0;
            const secs = s.time_ms != null ? Math.floor((s.time_ms % 60000) / 1000) : 0;
            return {
              id: `sb-${s.pos}-${s.display_name}`,
              rank: s.pos,
              name: s.display_name,
              score: s.score,
              time: s.time_ms != null ? `${mins}:${String(secs).padStart(2, '0')}` : '--:--',
              accuracy: 100,
              isMe: s.is_me
            };
          });
          setPlayers(mapped);
        } else if (isMounted) {
          setPlayers([]);
        }

        if (!myError && myData && myData.length > 0 && isMounted) {
          const mine = myData[0];
          const mins = mine.time_ms != null ? Math.floor(mine.time_ms / 60000) : 0;
          const secs = mine.time_ms != null ? Math.floor((mine.time_ms % 60000) / 1000) : 0;
          
          setCurrentUser({
            id: 'me',
            rank: Number(mine.player_rank),
            name: maskName(childName),
            score: mine.score,
            time: mine.time_ms != null ? `${mins}:${String(secs).padStart(2, '0')}` : '--:--',
            accuracy: 100
          });
        } else if (isMounted) {
          setCurrentUser(undefined);
        }

      } catch (err) {
        console.error('Hall of Fame fetch error:', err);
        
        // 🆕 مسح البيانات عند حدوث خطأ (كلاود #2)
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
    return () => { isMounted = false; };
  }, [subFilter, timeFilter, childName]);

  // 🆕 إضافة _tab لتجنب تحذير ESLint (كلاود #1)
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