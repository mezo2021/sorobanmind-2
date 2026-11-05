// src/components/RecordTicker.tsx
import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGameLang } from '@/components/games/gamesI18n';
import { Num } from '@/components/Num';
import { maskName } from '@/utils/maskName';
import { examLabel, fastest, fmtTime, getRecords } from '@/utils/leaderboard';

export default function RecordTicker() {
  const { dir, isAr } = useGameLang();
  const reduce = useReducedMotion();
  
  // 🆕 فلترة التكرار: نضمن ظهور كل اسم مرة واحدة لكل امتحان في الشريط
  const top = useMemo(() => {
    const all = fastest(getRecords(), 50); 
    const seen = new Set();
    return all.filter(r => {
      const key = `${r.name}-${r.examId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);
  }, []);

  const cta = isAr ? 'هل يمكنك التغلب على هؤلاء الأبطال؟' : 'Can you beat these champions?';

  const items = (
    <>
      {top.map((r) => (
        <span key={r.id} className="inline-flex items-center gap-2 px-5 text-sm whitespace-nowrap">
          <span className="text-amber-300">🏆</span>
          <span className="font-bold text-white">{maskName(r.name)}</span>
          <span className="text-slate-500">·</span>
          <span className="text-cyan-300">{examLabel(r.examId, isAr)}</span>
          <span className="text-slate-500">·</span>
          <span className="font-mono text-amber-200"><Num>{fmtTime(r.timeSec)}</Num></span>
        </span>
      ))}
      <span className="px-6 text-sm font-black text-fuchsia-300 whitespace-nowrap">⚡ {cta}</span>
    </>
  );

  if (top.length === 0) {
    return <div className="w-full text-center text-xs text-fuchsia-300 py-2 bg-slate-950/70 border-y border-fuchsia-500/20" dir={dir}>⚡ {cta}</div>;
  }
  return (
    <div className="w-full overflow-hidden bg-slate-950/70 border-y border-amber-500/20 py-2 backdrop-blur-md" dir="ltr" aria-label="records">
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: Math.max(18, top.length * 5), repeat: Infinity, ease: 'linear' }}
      >
        <div className="flex">{items}</div>
        <div className="flex" aria-hidden>{items}</div>
      </motion.div>
    </div>
  );
}