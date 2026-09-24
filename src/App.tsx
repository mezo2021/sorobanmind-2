// src/App.tsx

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "./i18n/useTranslation";
import { useProgressStore } from "./store/progressStore";
import { hasLevelContent } from "./curriculum/levels";
import type { Category } from "./curriculum/types";

// Screens
import CategorySelectScreen from "./screens/CategorySelectScreen";
import CurriculumScreen from "./screens/CurriculumScreen";
import EnrichmentScreen from "./screens/EnrichmentScreen";
import LevelScreen from "./screens/LevelScreen";
import { SorobanEngineDebug } from "./components/SorobanEngineDebug";

// ═══════════════════════════════════════════════
// الشاشات الممكنة
// ═══════════════════════════════════════════════
type Screen =
  | "loading"
  | "category-select"
  | "curriculum"
  | "enrichment"
  | "level"
  | "debug";

export default function App() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const { t, dir, lang } = useT();
  const category = useProgressStore((s) => s.category);

  // ═══════════════════════════════════════════════
  // التهيئة
  // ═══════════════════════════════════════════════
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  // ═══════════════════════════════════════════════
  // تحديد الشاشة الأولى
  // ═══════════════════════════════════════════════
  useEffect(() => {
    if (!ready) return;

    if (!category) {
      setScreen("category-select");
    } else {
      setScreen("curriculum");
    }
  }, [ready, category]);

  // ═══════════════════════════════════════════════
  // معالجات الأحداث
  // ═══════════════════════════════════════════════
  const handleCategorySelect = (_cat: Category) => {
    setScreen("curriculum");
  };

  const handleOpenLevel = (levelId: string) => {
    if (hasLevelContent(levelId)) {
      setActiveLevelId(levelId);
      setScreen("level");
    } else {
      // مستوى بدون محتوى بعد → Debug
      setActiveLevelId(levelId);
      setScreen("debug");
    }
  };

  const handleOpenEnrichment = () => {
    setScreen("enrichment");
  };

  const handleOpenEnrichmentModule = (id: string) => {
    // TODO: افتح درس الإثراء
    console.log("Open enrichment:", id);
  };

  const handleBackToCurriculum = () => {
    setScreen("curriculum");
  };

  const handleBackToCategory = () => {
    setScreen("category-select");
  };

  // ═══════════════════════════════════════════════
  // شاشة التحميل
  // ═══════════════════════════════════════════════
  if (!ready || screen === "loading") {
    return (
      <div
        dir={dir}
        className="min-h-screen flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">🧮</div>
          <p className="text-xl text-amber-400 font-bold">
            {t("app.loading")}
          </p>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // الشاشات
  // ═══════════════════════════════════════════════
  return (
    <AnimatePresence mode="wait">
      {screen === "category-select" && (
        <motion.div
          key="category-select"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CategorySelectScreen onSelect={handleCategorySelect} />
        </motion.div>
      )}

      {screen === "curriculum" && category && (
        <motion.div
          key="curriculum"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CurriculumScreen
            category={category}
            onBack={handleBackToCategory}
            onOpenLevel={handleOpenLevel}
            onOpenEnrichment={handleOpenEnrichment}
          />
        </motion.div>
      )}

      {screen === "enrichment" && category && (
        <motion.div
          key="enrichment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <EnrichmentScreen
            category={category}
            onBack={handleBackToCurriculum}
            onOpenModule={handleOpenEnrichmentModule}
          />
        </motion.div>
      )}

      {screen === "level" && activeLevelId && (
        <motion.div
          key="level"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LevelScreen
            levelId={activeLevelId}
            onBack={handleBackToCurriculum}
          />
        </motion.div>
      )}

      {screen === "debug" && (
        <motion.div
          key="debug"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen p-4"
        >
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBackToCurriculum}
              className="mb-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition"
            >
              ← {t("app.back")}
            </button>

            <div className="mb-6 text-center">
              <h1 className="text-2xl font-black text-amber-400 mb-2">
                🧪 {t("debug.title")}
              </h1>
              {activeLevelId && (
                <p className="text-sm text-purple-200">
                  المستوى:{" "}
                  <span className="font-bold">{activeLevelId}</span> — قيد
                  التطوير
                </p>
              )}
            </div>

            <SorobanEngineDebug />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}