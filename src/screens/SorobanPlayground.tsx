// src/screens/SorobanPlayground.tsx
// شاشة السوروبان التفاعلي
// ✅ زر 🏠 الرئيسية بدل ↩ الرجوع
// ✅ حل الشاشة السوداء: window.scrollTo + تأخير بسيط

import { useState } from 'react';
import { ArrowRight, RefreshCw, Sparkles, Grid3X3, Home } from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatNumber } from '@/utils/numberStyle';

interface SorobanPlaygroundProps {
  onBack: () => void;
  playSound: (type: 'click' | 'success' | 'error' | 'whoosh' | 'levelup') => void;
}

interface ColumnOption {
  columns: number;
  labelAr: string;
  labelEn: string;
  rangeAr: string;
}

const COLUMN_OPTIONS: ColumnOption[] = [
  { columns: 3, labelAr: '٣ أعمدة', labelEn: 'Columns 3', rangeAr: '٠ — ٩٩٩' },
  { columns: 6, labelAr: '٦ أعمدة', labelEn: 'Columns 6', rangeAr: '٠ — ٩٩٩٩٩٩' },
  { columns: 9, labelAr: '٩ أعمدة', labelEn: 'Columns 9', rangeAr: '٠ — ٩٩٩٩٩٩٩٩٩' },
  { columns: 13, labelAr: '١٣ عموداً', labelEn: 'Columns 13', rangeAr: 'حتى تريليونات' },
];

export function SorobanPlayground({
  onBack,
  playSound,
}: SorobanPlaygroundProps) {
  const [selectedColumns, setSelectedColumns] = useState<number>(3);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic';

  // ─── 🏠 العودة للرئيسية ───
  const handleHome = () => {
    playSound('click');
    // ✅ حل الشاشة السوداء
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setTimeout(() => onBack(), 30);
  };

  // ─── 🔄 تحديث الصفحة ───
  const handleRefresh = () => {
    playSound('click');
    window.location.reload();
  };

  // ─── تغيير الأعمدة ───
  const handleColumnsChange = (columns: number) => {
    playSound('click');
    setSelectedColumns(columns);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-3xl mx-auto">
      {/* ═══ الشريط العلوي ═══ */}
      <div className="flex items-center gap-3 mb-6">
        {/* ✅ زر الرئيسية 🏠 */}
        <button
          type="button"
          onClick={handleHome}
          title="الرئيسية"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Home className="w-6 h-6 text-white" />
        </button>

        <div className="flex-1">
          <h2 className="text-2xl font-extrabold font-display text-white">
            السوروبان التفاعلي
          </h2>
          <p className="text-xs text-white/50 font-body">
            Soroban Playground
          </p>
        </div>

        {/* ✅ زر تحديث 🔄 */}
        <button
          type="button"
          onClick={handleRefresh}
          title="تحديث الصفحة"
          className="p-2 rounded-full bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 transition"
        >
          <RefreshCw className="w-5 h-5 text-blue-300" />
        </button>
      </div>

      {/* ═══ بطاقة الترحيب ═══ */}
      <div className="glass-card p-5 mb-5 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl shadow-purple-500/40">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-extrabold font-display text-white">
              العب و استكشف
            </h3>
            <p className="text-xs text-white/50 font-body">
              Explore & Play
            </p>
            <p className="text-[11px] text-white/60 font-body mt-1 leading-relaxed">
              💡 حرّك الخرزات بحرية، وجرّب أي رقم — لا يوجد سؤال أو مؤقت.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ اختيار الأعمدة ═══ */}
      <div className="glass-card p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="w-5 h-5 text-gold-300" />
          <div>
            <h4 className="text-base font-extrabold font-display text-white">
              اختر عدد الأعمدة
            </h4>
            <p className="text-[10px] text-white/40 font-body">
              Choose Columns Count
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {COLUMN_OPTIONS.map((opt) => {
            const isSelected = selectedColumns === opt.columns;
            return (
              <button
                key={opt.columns}
                type="button"
                onClick={() => handleColumnsChange(opt.columns)}
                className={`relative flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-500/30 to-electric-500/30 border-purple-400/60 shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <span
                  className={`text-2xl font-black font-display ${
                    isSelected ? 'text-white' : 'text-white/70'
                  }`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {formatNumber(opt.columns, numberStyle)}
                </span>

                <span
                  className={`text-[11px] font-bold font-body ${
                    isSelected ? 'text-purple-200' : 'text-white/50'
                  }`}
                >
                  {opt.labelAr}
                </span>

                <span className="text-[9px] text-white/40 font-body">
                  {opt.labelEn}
                </span>

                <span
                  className={`text-[9px] font-body mt-0.5 ${
                    isSelected ? 'text-gold-300' : 'text-white/30'
                  }`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {formatNumber(opt.rangeAr, numberStyle)}
                </span>

                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold-400 text-gold-900 text-[10px] font-black flex items-center justify-center shadow-lg">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ السوروبان ═══ */}
      <div key={refreshKey} className="glass-card p-4 sm:p-6 mb-5">
        <div className="flex items-center justify-center">
          <Soroban2D5
            columns={selectedColumns}
            autoBeadSize={true}
            interactive={true}
            showValue={true}
          />
        </div>
      </div>

      {/* ═══ ملاحظة سفلية ═══ */}
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30">
        <p className="text-[11px] text-amber-200 font-body leading-relaxed text-center">
          💡 الخرزة العلوية = <strong>{formatNumber(5, numberStyle)}</strong>،
          السفلية = <strong>{formatNumber(1, numberStyle)}</strong>.
          استخدم زر <strong>↺ إعادة الكل</strong> للتصفير.
        </p>
        <p className="text-[9px] text-amber-200/60 font-body text-center mt-1">
          Top bead = 5 · Bottom bead = 1 · Reset button clears all
        </p>
      </div>
    </div>
  );
}

export default SorobanPlayground;