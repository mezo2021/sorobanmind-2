// src/screens/EnrichmentScreen.tsx

import { motion } from "framer-motion";
import {
  ArrowRight,
  Hand,
  Wand2,
  Hash,
  Lock,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useT } from "../i18n/useTranslation";
import { useProgressStore } from "../store/progressStore";
import { getEnrichmentByCategory } from "../data/enrichment";
import type { Category } from "../curriculum/types";

const ICONS = {
  Hand,
  Wand2,
  Hash,
} as const;

interface Props {
  category: Category;
  onBack: () => void;
  onOpenModule: (id: string) => void;
}

export default function EnrichmentScreen({
  category,
  onBack,
  onOpenModule,
}: Props) {
  const { t, dir } = useT();
  const completedEnrichment = useProgressStore(
    (s) => s.completedEnrichment,
  );

  const modules = getEnrichmentByCategory(category);

  return (
    <div dir={dir} className="min-h-screen p-4 pb-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-amber-400">
              {t("enrichment.title")}
            </h1>
            <p className="text-sm text-purple-200">
              {t("enrichment.subtitle")}
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 gap-4">
          {modules.map((mod, i) => {
            const Icon = ICONS[mod.icon as keyof typeof ICONS] || Hand;
            const isDone = completedEnrichment.includes(mod.id);

            return (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenModule(mod.id)}
                className="relative group overflow-hidden rounded-3xl border border-white/10 bg-purple-950/40 p-5 text-right transition-all hover:border-amber-400/40"
              >
                <div
                  className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${mod.gradient} opacity-20 blur-2xl`}
                />

                <div className="relative flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center shrink-0 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-black text-white truncate">
                        {t(
                          `enrichment.${mod.id === "E1" ? "fingerMath" : mod.id === "E2" ? "magicSecrets" : "vedicMultiplication"}.title` as Parameters<typeof t>[0],
                        )}
                      </h3>
                      {isDone && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-purple-300 mb-2">
                      {t(
                        `enrichment.${mod.id === "E1" ? "fingerMath" : mod.id === "E2" ? "magicSecrets" : "vedicMultiplication"}.rule` as Parameters<typeof t>[0],
                      )}
                    </p>

                    <p className="text-sm text-purple-200 leading-relaxed mb-3">
                      {t(
                        `enrichment.${mod.id === "E1" ? "fingerMath" : mod.id === "E2" ? "magicSecrets" : "vedicMultiplication"}.desc` as Parameters<typeof t>[0],
                      )}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-purple-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{mod.estimatedMinutes} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🎯</span>
                        <span>
                          {mod.targetAge[0]}-{mod.targetAge[1]} سنة
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-12 text-purple-300">
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد دروس إثراء متاحة لهذه الفئة</p>
          </div>
        )}
      </div>
    </div>
  );
}