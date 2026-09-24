// src/screens/CategorySelectScreen.tsx

import { motion } from "framer-motion";
import { Baby, GraduationCap, ChevronLeft } from "lucide-react";
import { useT } from "../i18n/useTranslation";
import { useProgressStore } from "../store/progressStore";
import { ALL_CATEGORIES } from "../data/modes";
import type { Category } from "../curriculum/types";

const ICONS = {
  Baby,
  GraduationCap,
} as const;

interface Props {
  onSelect: (category: Category) => void;
}

export default function CategorySelectScreen({ onSelect }: Props) {
  const { t, dir } = useT();
  const setCategory = useProgressStore((s) => s.setCategory);

  const handleChoose = (category: Category) => {
    setCategory(category);
    onSelect(category);
  };

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 max-w-lg"
      >
        <div className="text-6xl mb-4">🧮</div>
        <h1 className="text-3xl sm:text-4xl font-black text-amber-400 mb-2">
          {t("category.title")}
        </h1>
        <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
          {t("category.subtitle")}
        </p>
      </motion.div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
        {ALL_CATEGORIES.map((mode, i) => {
          const Icon = ICONS[mode.icon as keyof typeof ICONS] || Baby;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChoose(mode.id)}
              className="relative group overflow-hidden rounded-3xl border border-white/10 bg-purple-950/40 p-6 text-right transition-all hover:border-amber-400/40"
            >
              {/* Background glow */}
              <div
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${mode.gradient} opacity-20 blur-3xl group-hover:opacity-40 transition-all`}
              />

              {/* Content */}
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-black text-white mb-1">
                  {t(mode.titleKey as Parameters<typeof t>[0])}
                </h2>

                <p className="text-sm text-amber-300 font-bold mb-3">
                  {t(mode.rangeKey as Parameters<typeof t>[0])}
                </p>

                <p className="text-sm text-purple-200 leading-relaxed mb-4">
                  {t(mode.descKey as Parameters<typeof t>[0])}
                </p>

                <div className="flex items-center justify-end gap-2 text-amber-400 font-bold text-sm group-hover:gap-3 transition-all">
                  <span>{t("category.choose")}</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-xs text-purple-400 text-center"
      >
        {t("app.tagline")}
      </motion.p>
    </div>
  );
}