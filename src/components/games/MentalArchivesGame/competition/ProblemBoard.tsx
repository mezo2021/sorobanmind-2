// src/components/games/MentalArchivesGame/competition/ProblemBoard.tsx
// لوح المسألة + شاشة الإدخال (مشترك بين أنماط المنافسة).
import { Num } from '@/components/Num';

export default function ProblemBoard({ numbers, value, placeholder = '؟', glow = '#f59e0b' }: { numbers: number[]; value: string; placeholder?: string; glow?: string }) {
  return (
    <div className="rounded-2xl border-2 bg-white/5 backdrop-blur-md p-3 text-center w-full" style={{ borderColor: `${glow}88`, boxShadow: `0 0 18px ${glow}33` }}>
      <div className="flex flex-wrap justify-center items-center gap-x-3 text-3xl font-mono font-bold text-amber-100" dir="ltr">
        {numbers.map((n, i) => (
          <span key={i} className="flex items-center gap-3">
            <Num>{n}</Num>
            {i < numbers.length - 1 && <span className="text-amber-500/80 text-2xl">+</span>}
          </span>
        ))}
      </div>
      <div dir="ltr" className="mt-2 mx-auto h-12 w-40 rounded-xl bg-slate-950/80 border border-amber-500/40 flex items-center justify-center text-4xl font-mono font-bold text-amber-200">
        <Num>{value || placeholder}</Num>
      </div>
    </div>
  );
}
