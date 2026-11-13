// src/components/Leaderboard.tsx
import { useMemo, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Trophy, Timer, Medal } from 'lucide-react';
import { useGameLang } from '@/components/games/gamesI18n';
import { Num } from '@/components/Num';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import { maskName } from '@/utils/maskName';
import { EXAM_LABELS, LeaderRecord, examLabel, fmtTime, getRecords } from '@/utils/leaderboard';
import { cloudSync } from '@/lib/cloudSync';
import { AVATARS } from '@/data/avatars';

const PODIUM = [
  { rank: 2, h: 'h-24', color: '#cbd5e1', bg: 'from-slate-300/30 to-slate-500/10', icon: '🥈' },
  { rank: 1, h: 'h-32', color: '#fbbf24', bg: 'from-amber-300/40 to-amber-600/10', icon: '🥇' },
  { rank: 3, h: 'h-16', color: '#d97706', bg: 'from-orange-400/30 to-orange-700/10', icon: '🥉' },
];

function getCloudPlayerName(
  avatarId: string | null,
  sequentialNumber: number | null,
  isAr: boolean
): string {
  const avatar = AVATARS.find((item) => item.id === avatarId);
  const emoji = avatar?.emoji ?? '🏅';

  const characterName = avatar
    ? (isAr ? avatar.nameAr : avatar.nameEn)
    : isAr ? 'بطل' : 'Champion';

  return `${emoji} ${characterName} #${sequentialNumber ?? '—'}`;
}

function getRecordDisplayName(
  record: LeaderRecord,
  isAr: boolean
): string {
  // اللاعبون الحقيقيون القادمون من السحابة
  if (record.id.startsWith('sb-')) {
    return record.name;
  }

  // الأشباح المحلية: شخصية ورقم افتراضي ثابت
  if (record.id.startsWith('ghost-')) {
    const ghostId = Number(record.id.replace('ghost-', ''));

    if (Number.isFinite(ghostId) && AVATARS.length > 0) {
      const avatar = AVATARS[ghostId % AVATARS.length];

      const characterName = isAr
        ? avatar.nameAr
        : avatar.nameEn;

      const virtualNumber = 9000 + ghostId - 101;

      return `${avatar.emoji} ${characterName} #${virtualNumber}`;
    }

    return isAr ? '🏅 بطل افتراضي' : '🏅 Virtual Champion';
  }

  // النتائج المحلية الحقيقية تبقى مقنّعة كما كانت
  return maskName(record.name);
}

function Sparks({ color }: { color: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ background: color, left: `${15 + i * 14}%`, top: '10%' }}
          animate={{ y: [0, -26, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2 + (i % 3) * 0.5, repeat: Infinity, delay: i * 0.35 }}
        />
      ))}
    </>
  );
}

export default function Leaderboard({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const [exam, setExam] = useState<string>('all');
  const [sort, setSort] = useState<'score' | 'time'>('score');
  
  // جلب اللاعبين الحقيقيين من السحابة
  const [cloudRecords, setCloudRecords] = useState<LeaderRecord[]>([]);
  const localRecords = useMemo(() => getRecords(), []);

  useEffect(() => {
    let isMounted = true;

    async function fetchFromCloud() {
      if (exam === 'all') {
        setCloudRecords([]);
        return;
      }

      try {
        const result = await cloudSync.getHallOfFame(exam, 'all', 10);

        if (!isMounted) return;

        if (!result.success) {
          console.error('Wormhole leaderboard error:', result.error);
          setCloudRecords([]);
          return;
        }

        const mapped: LeaderRecord[] = result.entries.map((entry) => ({
          id: `sb-${entry.sequential_number ?? entry.pos}`,
          name: getCloudPlayerName(
            entry.avatar_id,
            entry.sequential_number,
            isAr
          ),
          score: entry.score,
          timeSec: entry.time_ms == null
            ? 0
            : Math.round(entry.time_ms / 1000),
          examId: exam,
          at: 0, // مطلوب من قبل LeaderRecord
        }));

        setCloudRecords(mapped);
      } catch (error) {
        console.error('Wormhole leaderboard fetch error:', error);
        if (isMounted) setCloudRecords([]);
      }
    }

    fetchFromCloud();

    return () => {
      isMounted = false;
    };
  }, [exam, isAr]);

  // الدمج الذكي (السحابة + الأشباح) والترتيب بناءً على الزر المختار
  const list: LeaderRecord[] = useMemo(() => {
    const localFiltered = exam === 'all' ? localRecords : localRecords.filter((r) => r.examId === exam);
    
    // نبدأ بلاعبي السحابة الحقيقيين
    const combined = [...cloudRecords];
    
    // نضيف الأشباح فقط إذا لم يكونوا موجودين في السحابة
    localFiltered.forEach(localRec => {
      if (!combined.some(c => c.name === localRec.name)) {
        combined.push(localRec);
      }
    });

    // الترتيب النهائي
    return [...combined]
      .sort((a, b) => (sort === 'score' ? b.score - a.score || a.timeSec - b.timeSec : a.timeSec - b.timeSec || b.score - a.score))
      .slice(0, 10);
  }, [localRecords, cloudRecords, exam, sort]);

  const top3 = list.slice(0, 3);
  const rest = list.slice(3);
  const order = [top3[1], top3[0], top3[2]];

  return (
    <div className="relative min-h-[100dvh] text-white overflow-hidden" dir={dir}>
      <CosmicBackground accent="#f59e0b" accent2="#6366f1" />
      <div className="relative z-10 max-w-2xl mx-auto p-4 pb-10">
        <button onClick={onBack} className="mb-4 text-amber-400 font-bold flex items-center gap-2">
          <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
          {isAr ? 'رجوع' : 'Back'}
        </button>
        <h1 className="text-3xl font-black text-amber-300 mb-1 flex items-center gap-2 drop-shadow-[0_0_14px_rgba(251,191,36,0.6)]">
          <Trophy className="w-8 h-8" /> {isAr ? 'لوحة الأبطال' : 'Hall of Champions'}
        </h1>
        <p className="text-slate-400 text-sm mb-4">{isAr ? 'أبطال عبروا الثقب الدودي بأسرع الأزمنة' : 'Heroes who crossed the wormhole fastest'}</p>

        <div className="flex flex-wrap gap-2 mb-5 text-xs">
          <select value={exam} onChange={(e) => setExam(e.target.value)} className="bg-slate-900/80 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-200">
            <option value="all">{isAr ? 'كل المستويات' : 'All levels'}</option>
            {Object.keys(EXAM_LABELS).map((id) => <option key={id} value={id}>{examLabel(id, isAr)}</option>)}
          </select>
          {(['score', 'time'] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} className={`px-3 py-2 rounded-xl border flex items-center gap-1 ${sort === s ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'border-slate-700 text-slate-400'}`}>
              {s === 'score' ? <Medal className="w-3.5 h-3.5" /> : <Timer className="w-3.5 h-3.5" />}
              {s === 'score' ? (isAr ? 'الدرجة' : 'Score') : (isAr ? 'الزمن' : 'Time')}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-slate-700/60 rounded-3xl backdrop-blur-md">
            <div className="text-5xl mb-3">🌌</div>
            <p className="text-slate-300 font-bold">{isAr ? 'لا أبطال بعد… كن الأول!' : 'No champions yet… be the first!'}</p>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-center gap-2 mb-6" dir="ltr">
              {PODIUM.map((p, i) => {
                const r = order[i];
                return (
                  <motion.div
                    key={p.rank}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 * i, type: 'spring', stiffness: 120, damping: 14 }}
                    className="flex-1 max-w-[9.5rem] text-center"
                  >
                    {r && (
                      <div className="mb-2">
                        <div className="text-3xl">{p.icon}</div>
                        <div className="font-black text-sm truncate" style={{ color: p.color }}>{getRecordDisplayName(r, isAr)}</div>
                        <div className="text-[11px] text-slate-400">{examLabel(r.examId, isAr)}</div>
                        <div className="text-xs font-mono text-amber-200"><Num>{sort === 'score' ? r.score : fmtTime(r.timeSec)}</Num></div>
                      </div>
                    )}
                    <div className={`relative ${p.h} rounded-t-2xl bg-gradient-to-b ${p.bg} border-t-2 overflow-hidden backdrop-blur-md`} style={{ borderColor: p.color, boxShadow: `0 0 24px ${p.color}55` }}>
                      <Sparks color={p.color} />
                      <div className="absolute inset-x-0 bottom-2 text-4xl font-black opacity-40" style={{ color: p.color }}><Num>{p.rank}</Num></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {rest.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                  className="flex items-center justify-between bg-white/5 border border-slate-700/60 rounded-xl px-4 py-3 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-300 text-sm font-bold flex items-center justify-center"><Num>{i + 4}</Num></span>
                    <span className="font-bold">{getRecordDisplayName(r, isAr)}</span>
                  </div>
                  <div className="text-xs text-slate-300 flex gap-3">
                    <span>{examLabel(r.examId, isAr)}</span>
                    <span className="font-mono text-amber-200"><Num>{r.score}</Num></span>
                    <span className="font-mono"><Num>{fmtTime(r.timeSec)}</Num></span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}