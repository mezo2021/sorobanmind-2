// src/screens/Header.tsx
// الشريط العلوي — مع أزرار: تحديث، خروج، نمط الأرقام، صوت، رجوع

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Volume2, VolumeX, RefreshCw, LogOut, Type,
} from "lucide-react";

import { useNumberStyleStore } from "@/store/numberStyleStore";

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

interface HeaderProps {
  xp?: number;
  streak?: number;
  level?: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onHome?: () => void;
  /** إخفاء زر الرجوع إذا كان في الرئيسية */
  hideHome?: boolean;
}

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

// ═══════════════════════════════════════════════════════════
// المكوّن
// ═══════════════════════════════════════════════════════════

export function Header({
  xp = 0,
  streak = 0,
  level = 0,
  soundEnabled = true,
  onToggleSound,
  onHome,
  hideHome = false,
}: HeaderProps) {
  const { style, toggleStyle } = useNumberStyleStore();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isArabic = style === "arabic";

  // ─── تحديث الصفحة ───
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // ─── محاولة الخروج ───
  const handleExit = () => {
    try {
      window.close();
      // إذا لم يُغلق — نُظهر تعليمات
      setTimeout(() => {
        setShowExitConfirm(false);
      }, 1000);
    } catch {
      setShowExitConfirm(false);
    }
  };

  return (
    <>
      <header
        dir="rtl"
        className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* يسار: XP + Streak */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-400/30">
                <span className="text-xs text-purple-300 font-bold">XP</span>
                <span className="text-sm font-black text-purple-200">
                  {isArabic ? toArabicNumber(xp) : xp}
                </span>
              </div>

              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-400/30">
                  <span className="text-xs">🔥</span>
                  <span className="text-sm font-black text-orange-200">
                    {isArabic ? toArabicNumber(streak) : streak}
                  </span>
                </div>
              )}

              {level > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30">
                  <span className="text-xs text-emerald-300 font-bold">L</span>
                  <span className="text-sm font-black text-emerald-200">
                    {isArabic ? toArabicNumber(level) : level}
                  </span>
                </div>
              )}
            </div>

            {/* يمين: الأزرار */}
            <div className="flex items-center gap-1.5 mr-auto flex-wrap">
              {/* زر الرجوع للرئيسية */}
              {!hideHome && onHome && (
                <button
                  type="button"
                  onClick={onHome}
                  title="الرئيسية"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition"
                >
                  <Home className="w-4 h-4 text-white/70" />
                </button>
              )}

              {/* زر تبديل نمط الأرقام */}
              <button
                type="button"
                onClick={toggleStyle}
                title={isArabic ? "التبديل إلى الأرقام اللاتينية" : "التبديل إلى الأرقام العربية"}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition"
              >
                <Type className="w-4 h-4 text-white/70" />
                <span className="text-xs font-bold text-white">
                  {isArabic ? (
                    <span className="text-emerald-300">١٢٣</span>
                  ) : (
                    <span className="text-blue-300">123</span>
                  )}
                </span>
              </button>

              {/* زر الصوت */}
              {onToggleSound && (
                <button
                  type="button"
                  onClick={onToggleSound}
                  title={soundEnabled ? "إسكات" : "تشغيل الصوت"}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-red-300" />
                  )}
                </button>
              )}

              {/* زر تحديث الصفحة */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="تحديث الصفحة"
                className="p-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 transition disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 text-blue-300 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>

              {/* زر الخروج */}
              <button
                type="button"
                onClick={() => setShowExitConfirm(true)}
                title="خروج من التطبيق"
                className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 transition"
              >
                <LogOut className="w-4 h-4 text-red-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* نافذة تأكيد الخروج */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowExitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-red-500/30 text-center"
              dir="rtl"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center">
                <LogOut className="w-8 h-8 text-red-300" />
              </div>

              <h3 className="text-xl font-extrabold font-display text-white mb-2">
                الخروج من التطبيق؟
              </h3>

              <p className="text-sm text-white/60 font-body mb-6 leading-relaxed">
                سيُحفظ تقدّمك تلقائياً.
                <br />
                <span className="text-amber-300">
                  ملاحظة: بعض المتصفحات قد لا تدعم الإغلاق المباشر — يمكنك
                  استخدام زر الرجوع للخلف أو إغلاق التبويب.
                </span>
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleExit}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white font-bold"
                >
                  نعم، اخرج
                </button>
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/10 text-white/80 font-bold"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;