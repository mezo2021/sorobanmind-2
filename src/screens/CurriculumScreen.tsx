// src/screens/CurriculumScreen.tsx

import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  CheckCircle2,
  Play,
  BookOpen,
  Hand,
  TrendingUp,
  Brain,
  Calculator,
  Trophy,
  Info,
  Hash,
  Layers,
  Plus,
  Minus,
  Sigma,
  Combine,
  List,
  Eye,
  Volume2,
  Zap,
  X,
  Divide,
  CircleDot,
  Award,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useT } from "../i18n/useTranslation";
import { useProgressStore } from "../store/progressStore";
import {
  CURRICULUM_GROUPS,
  computeLevelStatus,
  getLevelsByGroup,
  type LevelInfo,
} from "../data/curriculum";
import type { Category } from "../curriculum/types";

// ═══════════════════════════════════════════════
// أيقونات المستويات
// ═══════════════════════════════════════════════
const LEVEL_ICONS: Record<string, LucideIcon> = {
  Info,
  Hash,
  Layers,
  Plus,
  Combine,
  Minus,
  Sigma,
  List,
  Eye,
  Volume2,
  Zap,
  X,
  Divide,
  CircleDot,
  Award,
};

// ═══════════════════════════════════════════════
// أيقونات المجموعات
// ═══════════════════════════════════════════════
const GROUP_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Hand,
  TrendingUp,
  Brain,
  Calculator,
  Trophy,
};

interface Props {
  category: Category;
  onBack: () => void;
  onOpenLevel: (levelId: string) => void;
  onOpenEnrichment: () => void;
}

export default function CurriculumScreen({
  category,
  onBack,
  onOpenLevel,
  onOpenEnrichment,
}: Props) {
  const { t, dir } = useT();
  const completedLevels = useProgressStore((s) => s.completedLevels);
  const completedEnrichment = useProgressStore(
    (s) => s.completedEnrichment,
  );

  return (
    <div dir={dir} className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-amber-400">
              {t("curriculum.title")}
            </h1>
            <p className="text-sm text-purple-200">
              {t("curriculum.subtitle")}
            </p>
          </div>
        </div>

        {/* Enrichment Banner */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenEnrichment}
          className="w-full mb-6 relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-l from-amber-500/10 to-purple-500/10 p-5 text-right transition-all hover:border-amber-400/60"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-400/20 blur-3xl" />

          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shrink-0 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-black text-white">
                  {t("enrichment.title")}
                </h3>
                {completedEnrichment.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    {completedEnrichment.length} مكتمل
                  </span>
                )}
              </div>
              <p className="text-sm text-purple-200">
                {t("enrichment.subtitle")}
              </p>
            </div>
          </div>
        </motion.button>

        {/* Curriculum Groups */}
        {CURRICULUM_GROUPS.map((group, groupIdx) => {
          const levels = getLevelsByGroup(group.id).filter(
            (l) => l.category === category || l.category === "both",
          );

          if (levels.length === 0) return null;

          const GroupIcon =
            GROUP_ICONS[group.icon] || BookOpen;

          const completedInGroup = levels.filter((l) =>
            completedLevels.includes(l.id),
          ).length;

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.1 }}
              className="mb-8"
            >
              {/* Group Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center shadow-lg shrink-0`}
                >
                  <GroupIcon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-black text-white truncate">
                    {t(group.titleKey as Parameters<typeof t>[0])}
                  </h2>
                  <p className="text-xs text-purple-300 truncate">
                    {t(group.descKey as Parameters<typeof t>[0])}
                  </p>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-sm font-bold text-amber-300">
                    {completedInGroup}/{levels.length}
                  </span>
                </div>
              </div>

              {/* Levels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {levels.map((level, idx) => (
                  <LevelCard
                    key={level.id}
                    level={level}
                    status={computeLevelStatus(
                      level,
                      completedLevels,
                    )}
                    onClick={() => onOpenLevel(level.id)}
                    index={idx}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// بطاقة المستوى
// ═══════════════════════════════════════════════
interface LevelCardProps {
  level: LevelInfo;
  status: "locked" | "available" | "inProgress" | "completed" | "mastered";
  onClick: () => void;
  index: number;
}

function LevelCard({ level, status, onClick, index }: LevelCardProps) {
  const { t } = useT();
  const Icon = LEVEL_ICONS[level.icon] || Info;
  const isLocked = status === "locked";
  const isCompleted = status === "completed" || status === "mastered";

  // مفاتيح الترجمة للمستوى
  const titleKey = `level.${String(level.number).padStart(2, "0")}.title` as Parameters<typeof t>[0];
  const descKey = `level.${String(level.number).padStart(2, "0")}.desc` as Parameters<typeof t>[0];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={!isLocked ? { scale: 1.02, y: -3 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isLocked}
      className={`relative group overflow-hidden rounded-2xl border p-4 text-right transition-all ${
        isLocked
          ? "border-white/5 bg-white/[0.02] opacity-60 cursor-not-allowed"
          : "border-white/10 bg-purple-950/40 hover:border-amber-400/40"
      }`}
    >
      {/* Glow */}
      {!isLocked && (
        <div
          className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${level.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-all`}
        />
      )}

      <div className="relative">
        {/* Icon + Status */}
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${level.gradient} flex items-center justify-center shadow-lg shrink-0 ${
              isLocked ? "grayscale" : ""
            }`}
          >
            {isLocked ? (
              <Lock className="w-5 h-5 text-white" />
            ) : (
              <Icon className="w-5 h-5 text-white" />
            )}
          </div>

          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : !isLocked ? (
            <Play className="w-4 h-4 text-amber-300 shrink-0" />
          ) : null}
        </div>

        {/* Number Badge */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-black px-2 py-0.5 rounded-lg ${
              isLocked
                ? "bg-white/5 text-white/40"
                : "bg-amber-400/20 text-amber-300"
            }`}
          >
            {level.id}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-base font-bold mb-1 ${
            isLocked ? "text-white/50" : "text-white"
          }`}
        >
          {t(titleKey)}
        </h3>

        {/* Description */}
        <p
          className={`text-xs leading-relaxed mb-3 ${
            isLocked ? "text-white/30" : "text-purple-300"
          }`}
        >
          {t(descKey)}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-[10px] text-purple-400">
          <span>⏱ {level.estimatedHours} ساعة</span>
          <span>
            👤 {level.targetAge[0]}+
          </span>
        </div>
      </div>
    </motion.button>
  );
}