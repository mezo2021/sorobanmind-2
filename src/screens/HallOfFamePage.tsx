import { useState, useEffect } from 'react';
import { HallOfFameScreen, type LeaderboardUser, type TabType, type TimeFilter } from '@/components/HallOfFameScreen';
import { supabase } from '@/lib/supabase';
import { useGameLang } from '@/components/games/gamesI18n'; // أو مكان دالة اللغة عندك

export default function HallOfFamePage({ onBack }: { onBack: () => void }) {
  const { isAr } = useGameLang();
  
  const [activeTab, setActiveTab] = useState<TabType>('levels');
  const [subFilter, setSubFilter] = useState<string>('level_0');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  
  const [players, setPlayers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // دالة جلب البيانات من السحابة
  useEffect(() => {
    let isMounted = true;
    async function fetchScores() {
      setLoading(true);
      try {
        const period = timeFilter === 'all' ? 'all' : 'month';
        const { data, error } = await supabase.rpc('get_hall_of_fame', {
          p_game_id: subFilter,
          p_period: period,
          p_limit: 10
        });

        if (!error && data && isMounted) {
          const mapped: LeaderboardUser[] = data.map((s: any) => {
            // حساب الوقت
            const mins = s.time_ms ? Math.floor(s.time_ms / 60000) : 0;
            const secs = s.time_ms ? Math.floor((s.time_ms % 60000) / 1000) : 0;
            const timeStr = s.time_ms ? `${mins}:${String(secs).padStart(2, '0')}` : '--:--';

            return {
              id: `sb-${s.pos}-${s.display_name}`, // معرف فريد
              rank: s.pos,
              name: s.display_name, // الاسم المقنع من السحابة (مثل: محمد.ع)
              score: s.score,
              time: timeStr,
              accuracy: 100, // غير متوفر حالياً في السحابة، نضعه 100 مؤقتاً
              isMe: s.is_me // لمعرفة هل هذا اللاعب هو المستخدم الحالي
            };
          });

          setPlayers(mapped);
          
          // استخراج بيانات اللاعب الحالي إذا كان موجوداً في القائمة
          const me = mapped.find(p => (p as any).isMe === true);
          setCurrentUser(me);
        } else {
          setPlayers([]);
          setCurrentUser(undefined);
        }
      } catch (err) {
        console.error(err);
        setPlayers([]);
      }
      setLoading(false);
    }
    
    fetchScores();
    return () => { isMounted = false; };
  }, [subFilter, timeFilter]);

  // دوال التمرير للمكون
  const handleTabChange = (tab: TabType, sub: string) => {
    setActiveTab(tab);
    setSubFilter(sub);
  };

  const handleTimeChange = (time: TimeFilter) => {
    setTimeFilter(time);
  };

  return (
    <div className="relative min-h-screen">
      {/* زر الرجوع */}
      <button 
        onClick={onBack} 
        className="absolute top-6 left-6 rtl:right-6 rtl:left-auto z-50 p-2 bg-slate-800/80 rounded-full hover:bg-slate-700 text-white transition"
      >
        {/* أيقونة رجوع (يمكنك استخدام ArrowRight من lucide-react) */}
        <span className="text-xl">→</span>
      </button>

      {/* المكون الذي صممه جيميني */}
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