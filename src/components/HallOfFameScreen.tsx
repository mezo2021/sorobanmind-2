import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Timer, 
  Layers, 
  BookOpen, 
  Award, 
  Calendar, 
  Globe, 
  Sparkles,
  Loader2
} from 'lucide-react';

// --- Types ---
export type TabType = 'levels' | 'categories' | 'kyu';
export type TimeFilter = 'all' | 'monthly';

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  score: number;
  time: string;
  badge?: string;
}

export interface HallOfFameProps {
  isAr: boolean;
  players: LeaderboardUser[];
  currentUser?: LeaderboardUser;
  loading: boolean;
  onTabChange: (tab: TabType, subFilter: string) => void;
  onTimeChange: (time: TimeFilter) => void;
}

function getPlayerDisplayName(player: LeaderboardUser): string {
  return player.name.replace(/^\S+\s+/, '');
}

export const HallOfFameScreen: React.FC<HallOfFameProps> = ({
  isAr,
  players,
  currentUser,
  loading,
  onTabChange,
  onTimeChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('levels');
  const [subFilter, setSubFilter] = useState<string>('level_0');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const getSubFilters = (tab: TabType) => {
    switch (tab) {
      case 'levels':
        return Array.from({ length: 8 }, (_, i) => ({
          id: `level_${i}`,
          label: isAr ? `مستوى ${i}` : `Level ${i}`,
        }));
      case 'categories':
        return [
          { id: 'cat_ce1', label: isAr ? 'الأبطال الصغار (٥-١٢ سنة)' : 'Young Heroes (Ages 5-12)' },
          { id: 'cat_ce2', label: isAr ? 'الأبطال الكبار (+١٣ سنة)' : 'Champion Heroes (Ages 13+)' },
        ];
      case 'kyu':
        return [
          { id: 'exam_10_7', label: isAr ? 'كيو 10-7' : 'Kyu 10-7' },
          { id: 'exam_6', label: isAr ? 'كيو 6' : 'Kyu 6' },
          { id: 'exam_5', label: isAr ? 'كيو 5' : 'Kyu 5' },
          { id: 'exam_4', label: isAr ? 'كيو 4' : 'Kyu 4' },
          { id: 'exam_3', label: isAr ? 'كيو 3' : 'Kyu 3' },
          { id: 'exam_2', label: isAr ? 'كيو 2' : 'Kyu 2' },
          { id: 'exam_1', label: isAr ? 'كيو 1' : 'Kyu 1' },
        ];
    }
  };

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    const defaultSub = getSubFilters(tab)[0].id;
    setSubFilter(defaultSub);
    onTabChange(tab, defaultSub);
  };

  const handleSubSwitch = (subId: string) => {
    setSubFilter(subId);
    onTabChange(activeTab, subId);
  };

  const handleTimeSwitch = (time: TimeFilter) => {
    setTimeFilter(time);
    onTimeChange(time);
  };

  const top1 = players.find(p => p.rank === 1);
  const top2 = players.find(p => p.rank === 2);
  const top3 = players.find(p => p.rank === 3);
  const restPlayers = players.filter(p => p.rank > 3);

  // توحيد وحدة القياس بناءً على اللغة
  const scoreUnit = isAr ? 'درجة' : 'pts';

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-slate-100 p-4 md:p-8 font-sans pb-28 ${isAr ? 'rtl' : 'ltr'}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      <header className="max-w-4xl mx-auto mb-6 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{isAr ? 'قاعة النخبة والدوجو الأكاديمي' : 'Academic Dojo Elite Hall'}</span>
        </motion.div>
        
        <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-tight mb-2">
          {isAr ? 'قاعة المشاهير' : 'Hall of Fame'}
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          {isAr 
            ? 'سجل شرف أبطال الحساب الذهني والسوروبان بروح الإتقان الياباني' 
            : 'Honoring mental math masters with Japanese soroban mastery'}
        </p>
      </header>

      <div className="max-w-4xl mx-auto mb-6 relative z-10">
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl">
          {[
            { id: 'levels', icon: Layers, label: isAr ? 'المستويات (0-7)' : 'Levels (0-7)' },
            { id: 'categories', icon: BookOpen, label: isAr ? 'الأقسام' : 'Categories' },
            { id: 'kyu', icon: Award, label: isAr ? 'امتحانات الكيو (أنزان)' : 'Kyu Exams' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id as TabType)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                  isActive ? 'text-amber-300 shadow-lg' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-amber-500/30 to-amber-600/20 rounded-xl border border-amber-500/40"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {getSubFilters(activeTab).map((sf) => (
            <button
              key={sf.id}
              onClick={() => handleSubSwitch(sf.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                subFilter === sf.id
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {sf.label}
            </button>
          ))}
        </div>

        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-end md:self-auto">
          <button
            onClick={() => handleTimeSwitch('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeFilter === 'all' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            {isAr ? 'كل الأوقات' : 'All Time'}
          </button>
          <button
            onClick={() => handleTimeSwitch('monthly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeFilter === 'monthly' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {isAr ? 'هذا الشهر' : 'This Month'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="max-w-4xl mx-auto py-24 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
          <p className="text-slate-400 text-sm">
            {isAr ? 'جاري تحميل لوحة الشرف...' : 'Loading Hall of Fame...'}
          </p>
        </div>
      ) : players.length === 0 ? (
        <div className="max-w-4xl mx-auto py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            {isAr ? 'لا توجد بيانات مسجلة لهذا القسم حتى الآن.' : 'No champions recorded for this category yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="max-w-4xl mx-auto mb-10 relative z-10">
            <div className="grid grid-cols-3 gap-2 md:gap-6 items-end justify-center pt-8 px-1">
              
              {top2 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center order-1"
                >
                  <div className="relative mb-2">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-slate-400 to-slate-100 p-0.5 shadow-lg shadow-slate-400/20">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl md:text-4xl">
                        {top2.avatar ?? '🏅'}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                      <span className="bg-slate-300 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full shadow border border-white">
                        #2
                      </span>
                    </div>
                  </div>

                  <div className="text-center my-2 w-full px-1">
                    <h3 className="font-bold text-[10px] md:text-xs text-slate-200 leading-tight break-words line-clamp-2">
                      {getPlayerDisplayName(top2)}
                    </h3>
                    <p className="text-slate-400 text-[10px] md:text-[11px] font-mono mt-1">{top2.score} {scoreUnit}</p>
                    <div className="flex items-center justify-center gap-1 text-[9px] md:text-[10px] text-amber-400/80 mt-0.5">
                      <Timer className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      <span>{top2.time}</span>
                    </div>
                  </div>

                  <div className="w-full h-32 md:h-40 rounded-t-2xl bg-gradient-to-b from-slate-400/20 via-slate-800/80 to-slate-950/90 border-t-2 border-slate-300/40 p-3 flex flex-col justify-between items-center shadow-xl backdrop-blur-md">
                    <Medal className="w-6 h-6 md:w-8 md:h-8 text-slate-300 mt-2" />
                    <span className="text-slate-400 font-serif text-[10px] md:text-xs tracking-widest uppercase">
                      {isAr ? 'فضي' : 'Silver'}
                    </span>
                  </div>
                </motion.div>
              )}

              {top1 && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center order-2 relative"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    className="absolute -top-10 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                  >
                    <Crown className="w-8 h-8 md:w-10 md:h-10 fill-amber-400" />
                  </motion.div>

                  <div className="relative mb-2 mt-4">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 p-1 shadow-xl shadow-amber-500/30 ring-4 ring-amber-500/20">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-4xl md:text-5xl border border-amber-400/30">
                        {top1.avatar ?? '🏅'}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                      <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs md:text-sm px-3 py-0.5 rounded-full shadow-lg border border-amber-200">
                        #1
                      </span>
                    </div>
                  </div>

                  <div className="text-center my-2 w-full px-1">
                    <h3 className="font-extrabold text-[11px] md:text-sm text-amber-300 leading-tight break-words line-clamp-2">
                      {getPlayerDisplayName(top1)}
                    </h3>
                    {top1.badge && (
                      <span className="inline-block bg-amber-500/10 text-amber-400 text-[9px] px-1.5 py-0.5 rounded border border-amber-500/30 mb-1 mt-1">
                        {top1.badge}
                      </span>
                    )}
                    <p className="text-amber-200/90 font-mono font-bold text-[11px] md:text-xs mt-1">{top1.score} {scoreUnit}</p>
                    <div className="flex items-center justify-center gap-1 text-[9px] md:text-[10px] text-slate-300 mt-0.5">
                      <Timer className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-400" />
                      <span>{top1.time}</span>
                    </div>
                  </div>

                  <div className="w-full h-44 md:h-56 rounded-t-2xl bg-gradient-to-b from-amber-500/30 via-slate-800/90 to-slate-950/95 border-t-4 border-amber-400 p-3 flex flex-col justify-between items-center shadow-2xl shadow-amber-500/10 backdrop-blur-md">
                    <Trophy className="w-8 h-8 md:w-12 md:h-12 text-amber-400 mt-2 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    <span className="text-amber-400/80 font-serif text-[10px] md:text-sm tracking-widest font-bold uppercase">
                      {isAr ? 'البطل' : 'Champion'}
                    </span>
                  </div>
                </motion.div>
              )}

              {top3 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center order-3"
                >
                  <div className="relative mb-2">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-amber-800 to-amber-600 p-0.5 shadow-lg shadow-amber-900/30">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl md:text-4xl">
                        {top3.avatar ?? '🏅'}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                      <span className="bg-amber-700 text-amber-100 font-black text-xs px-2 py-0.5 rounded-full shadow border border-amber-500">
                        #3
                      </span>
                    </div>
                  </div>

                  <div className="text-center my-2 w-full px-1">
                    <h3 className="font-bold text-[10px] md:text-xs text-slate-200 leading-tight break-words line-clamp-2">
                      {getPlayerDisplayName(top3)}
                    </h3>
                    <p className="text-slate-400 text-[10px] md:text-[11px] font-mono mt-1">{top3.score} {scoreUnit}</p>
                    <div className="flex items-center justify-center gap-1 text-[9px] md:text-[10px] text-amber-400/80 mt-0.5">
                      <Timer className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      <span>{top3.time}</span>
                    </div>
                  </div>

                  <div className="w-full h-24 md:h-32 rounded-t-2xl bg-gradient-to-b from-amber-900/30 via-slate-800/80 to-slate-950/90 border-t-2 border-amber-700/60 p-3 flex flex-col justify-between items-center shadow-xl backdrop-blur-md">
                    <Medal className="w-6 h-6 md:w-8 md:h-8 text-amber-600 mt-2" />
                    <span className="text-amber-700/80 font-serif text-[10px] md:text-xs tracking-widest uppercase">
                      {isAr ? 'برونزي' : 'Bronze'}
                    </span>
                  </div>
                </motion.div>
              )}

            </div>
          </div>

          {restPlayers.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-2.5 relative z-10 pb-6">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
                {isAr ? 'بقية قائمة المتصدرين (4 - 10)' : 'Top Contenders (4 - 10)'}
              </h2>

              <AnimatePresence mode="wait">
                {restPlayers.map((player, idx) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 backdrop-blur-md group"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="w-7 text-center font-mono font-bold text-slate-400 text-sm md:text-base group-hover:text-amber-400 transition-colors">
                        #{player.rank}
                      </span>

                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl md:text-2xl">
                        {player.avatar ?? '🏅'}
                      </div>

                      <div>
                        <h4 className="font-semibold text-xs md:text-sm text-slate-200 group-hover:text-white transition-colors">
                          {getPlayerDisplayName(player)}
                        </h4>
                      </div>
                    </div>

                    <div className="text-left rtl:text-right flex items-center gap-4">
                      <div className="text-right rtl:text-left">
                        <div className="font-mono font-bold text-xs md:text-sm text-slate-100">
                          {player.score.toLocaleString()} <span className="text-[10px] text-slate-400">{scoreUnit}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 justify-end rtl:justify-start">
                          <Timer className="w-3 h-3 text-slate-500" />
                          <span>{player.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {currentUser && (
        <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-slate-800 p-3 md:p-4 backdrop-blur-xl z-20 shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xl">
                {currentUser.avatar ?? '🏅'}
              </div>
              <div>
                <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider block">
                  {isAr ? 'مركزك الحالي' : 'Your Rank'}
                </span>
                <h5 className="text-xs md:text-sm font-bold text-white">
                  {getPlayerDisplayName(currentUser)}
                </h5>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right rtl:text-left">
                <span className="text-xs font-mono font-bold text-amber-400 block">#{currentUser.rank}</span>
                <span className="text-[10px] text-slate-400">{currentUser.score.toLocaleString()} {scoreUnit}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallOfFameScreen;