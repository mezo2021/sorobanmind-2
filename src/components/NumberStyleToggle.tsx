// src/components/NumberStyleToggle.tsx
// زر اختيار نمط الأرقام: عربي / لاتيني

import { motion } from "framer-motion";
import { useNumberStyleStore } from "@/store/numberStyleStore";
import type { NumberStyle } from "@/utils/numberStyle";

interface NumberStyleToggleProps {
  /** حجم مُصغّر */
  compact?: boolean;
  /** استدعاء بعد التبديل */
  onToggle?: (style: NumberStyle) => void;
}

export function NumberStyleToggle({
  compact = false,
  onToggle,
}: NumberStyleToggleProps) {
  const { style, setStyle } = useNumberStyleStore();

  const handleChange = (newStyle: NumberStyle) => {
    setStyle(newStyle);
    onToggle?.(newStyle);
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={() =>
          handleChange(style === "arabic" ? "latin" : "arabic")
        }
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-bold text-white"
        title="تبديل نمط الأرقام"
      >
        <span className={style === "arabic" ? "text-white" : "text-white/40"}>
          ١٢٣
        </span>
        <span className="text-white/30">|</span>
        <span className={style === "latin" ? "text-white" : "text-white/40"}>
          123
        </span>
      </button>
    );
  }

  return (
    <div className="glass-card p-4">
      <p className="text-xs text-white/60 font-body mb-3 text-center">
        اختر نمط الأرقام
      </p>

      <div className="flex gap-2 bg-white/5 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => handleChange("arabic")}
          className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
            style === "arabic"
              ? "bg-gradient-to-l from-emerald-500 to-teal-600 text-white shadow-lg"
              : "text-white/60 hover:text-white"
          }`}
        >
          <span className="text-2xl">١ ٢ ٣</span>
        </button>

        <button
          type="button"
          onClick={() => handleChange("latin")}
          className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
            style === "latin"
              ? "bg-gradient-to-l from-blue-500 to-indigo-600 text-white shadow-lg"
              : "text-white/60 hover:text-white"
          }`}
        >
          <span className="text-2xl">3 2 1</span>
        </button>
      </div>

      <motion.p
        key={style}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-[10px] text-white/40 font-body mt-3"
      >
        {style === "arabic"
          ? "ستظهر جميع الأرقام بالشكل: ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩"
          : "جميع الأرقام ستظهر بالشكل: 0 1 2 3 4 5 6 7 8 9"}
      </motion.p>
    </div>
  );
}

export default NumberStyleToggle;