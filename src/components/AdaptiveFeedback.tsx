// src/components/AdaptiveFeedback.tsx
// Adaptive learning feedback component
// ✅ separates historical skills by current level / other levels
// ✅ SRB: reads from progressStore.skillProgress directly
// 📅 Last update: SRB Migration — Phase 3
// [FIX AF1] — simplify weakness: any error = weakness (instead of a complex formula)
// [FIX AF2] — display threshold: > 0 (instead of ≥ 50)
// [FIX AF3] — remove the attempts < 3 condition (errors are counted from the first attempt)

import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  CheckCircle2, AlertTriangle, TrendingUp, Lightbulb,
  Trophy, Clock, Target,
} from "lucide-react";

import { useT } from "@/i18n/useTranslation";
import { pickLang } from "@/i18n/pickLang";
import { translateDynamic } from "@/utils/translateDynamic";

import { useMasteryBadgesStore } from "@/store/masteryBadgesStore";
import { useProgressStore } from "@/store/progressStore";
import { getModuleName } from "@/data/srb/modules";
import type {
  SRBLevel,
  SRBSection,
  SRBModule,
} from "@/data/srb/types";
import { useNumberStyleStore } from "@/store/numberStyleStore";
import { formatNumber } from "@/utils/numberStyle";

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

export interface SkillPerformance {
  skillId: string;
  correct: number;
  attempts: number;
  avgTimeMs: number;
  answerMs: number;
  speedClass: "mastery" | "accepted" | "slow";
}

interface AdaptiveFeedbackProps {
  performances: SkillPerformance[];
  sectionLabel: string;
  /** Current level number (0-7) — to split skills */
  levelNum?: number;
}

interface WeakRecord {
  skillId: string;
  weaknessScore: number;
}

// ═══════════════════════════════════════════════════════════
// Helpers — parseSkillId · label · weaknessScore
// ═══════════════════════════════════════════════════════════

interface ParsedSkillId {
  level: SRBLevel;
  section: SRBSection;
  module: SRBModule;
}

function parseSkillId(skillId: string): ParsedSkillId | null {
  const parts = skillId.split("-");
  if (parts.length !== 3) return null;

  const [level, section, module] = parts;
  if (!/^L\d$/.test(level)) return null;
  if (!/^S\d{2}$/.test(section)) return null;
  if (!/^m\d$/.test(module)) return null;

  return {
    level: level as SRBLevel,
    section: section as SRBSection,
    module: module as SRBModule,
  };
}

function getSkillLabel(skillId: string): string {
  const parsed = parseSkillId(skillId);
  if (!parsed) return skillId;
  return getModuleName(parsed.section, parsed.module);
}

function getLevelOfSkill(skillId: string): number | null {
  const parsed = parseSkillId(skillId);
  if (!parsed) return null;
  return Number(parsed.level.slice(1));
}

/**
 * [FIX AF1] — Any error = weakness.
 *
 * Rule:
 *   - 0 attempts → 0
 *   - Otherwise → (1 - accuracy) × 100
 *
 * Result:
 *   - All correct     → 0
 *   - One error       → 20 (for 5 attempts)
 *   - All wrong       → 100
 */
function computeWeaknessScore(params: {
  attempts: number;
  correct: number;
}): number {
  const { attempts, correct } = params;
  if (attempts === 0) return 0;

  const accuracy = correct / attempts;
  return Math.round((1 - accuracy) * 100);
}

// ═══════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════

export function AdaptiveFeedback({
  performances,
  sectionLabel,
  levelNum,
}: AdaptiveFeedbackProps) {
  const { lang } = useT();
  const { style: numberStyle } = useNumberStyleStore();
  const hasBadge = useMasteryBadgesStore((s) => s.hasBadge);
  const allBadges = useMasteryBadgesStore((s) => s.getAllBadges);
  const skillProgress = useProgressStore((s) => s.skillProgress);

  // Localized skill label wrapper (dynamic — flows through translateDynamic)
  const localizeSkillLabel = (skillId: string): string =>
    translateDynamic({ value: getSkillLabel(skillId) }, lang, "value");

  // ─── Classify this session's performance ───
  const masteredSkills = performances.filter(
    (p) => p.speedClass === "mastery" && p.correct === p.attempts,
  );

  const acceptedSkills = performances.filter(
    (p) => p.speedClass === "accepted" && p.correct === p.attempts,
  );

  const weakSkills = performances.filter(
    (p) => p.speedClass === "slow" || p.correct < p.attempts,
  );

  // ─── [FIX AF1 + AF2] Historical weak skills ───
  const allHistoricalWeak: WeakRecord[] = useMemo(
    () =>
      Object.values(skillProgress)
        .map((sp) => ({
          skillId: sp.skillId,
          weaknessScore: computeWeaknessScore({
            attempts: sp.attempts,
            correct: sp.correct,
          }),
        }))
        .filter((r) => r.weaknessScore > 0)
        .sort((a, b) => b.weaknessScore - a.weaknessScore),
    [skillProgress],
  );

  // ─── Split by level ───
  const isInCurrentLevel = (skillId: string): boolean => {
    if (levelNum === undefined) return false;
    return getLevelOfSkill(skillId) === levelNum;
  };

  const historicalThisLevel =
    levelNum !== undefined
      ? allHistoricalWeak.filter((r) => isInCurrentLevel(r.skillId))
      : [];

  const historicalOtherLevels =
    levelNum !== undefined
      ? allHistoricalWeak.filter((r) => !isInCurrentLevel(r.skillId))
      : allHistoricalWeak;

  // ─── If nothing to show — render nothing ───
  if (
    masteredSkills.length === 0 &&
    acceptedSkills.length === 0 &&
    weakSkills.length === 0 &&
    historicalThisLevel.length === 0 &&
    historicalOtherLevels.length === 0
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* ─── Header ─── */}
      <div className="glass-card p-4 border-2 border-purple-400/30">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-purple-300" />
          <h3 className="text-sm font-bold text-purple-200 font-display">
            {pickLang(
              {
                ar: "📊 ملاحظات التعليم التكيفي",
                en: "📊 Adaptive Learning Notes",
              },
              lang,
            )}
          </h3>
        </div>
        <p className="text-[10px] text-white/50 font-body">
          {sectionLabel} — {pickLang({ ar: "تحليل الأداء", en: "Performance Analysis" }, lang)}
        </p>
      </div>

      {/* ─── Mastered skills ─── */}
      {masteredSkills.length > 0 && (
        <div className="glass-card p-4 border border-emerald-400/40 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-gold-300" />
            <h4 className="text-sm font-bold text-gold-200 font-display">
              {pickLang(
                {
                  ar: "✅ مهارات أتقنتها بزمن قياسي",
                  en: "✅ Skills you mastered in record time",
                },
                lang,
              )}
            </h4>
          </div>

          <div className="space-y-2">
            {masteredSkills.map((p) => (
              <div
                key={p.skillId}
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg">🏅</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">
                      {p.skillId} — {localizeSkillLabel(p.skillId)}
                    </p>
                    <p className="text-[10px] text-emerald-300">
                      {p.correct}/{p.attempts} ·{" "}
                      {formatNumber(Math.round(p.avgTimeMs / 1000), numberStyle)}s
                    </p>
                  </div>
                </div>
                {hasBadge(p.skillId) && (
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-gold-400/30 text-gold-100 font-bold shrink-0">
                    🏅 {pickLang({ ar: "شارة", en: "Badge" }, lang)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Accepted skills ─── */}
      {acceptedSkills.length > 0 && (
        <div className="glass-card p-4 border border-blue-400/40">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-blue-300" />
            <h4 className="text-sm font-bold text-blue-200 font-display">
              {pickLang(
                {
                  ar: "👍 مهارات جيدة (زمن مقبول)",
                  en: "👍 Good skills (accepted time)",
                },
                lang,
              )}
            </h4>
          </div>

          <div className="space-y-2">
            {acceptedSkills.map((p) => (
              <div
                key={p.skillId}
                className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 border border-blue-400/30"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Clock className="w-4 h-4 text-blue-300 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">
                      {p.skillId} — {localizeSkillLabel(p.skillId)}
                    </p>
                    <p className="text-[10px] text-blue-300">
                      {p.correct}/{p.attempts} ·{" "}
                      {formatNumber(Math.round(p.avgTimeMs / 1000), numberStyle)}s
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-white/50 font-body mt-3">
            {pickLang(
              {
                ar: "💡 لتحصل على الشارة، حاول الوصول للزمن القياسي (أسرع).",
                en: "💡 To earn the badge, try to reach the record time (faster).",
              },
              lang,
            )}
          </p>
        </div>
      )}

      {/* ─── Weak skills (this session) ─── */}
      {weakSkills.length > 0 && (
        <div className="glass-card p-4 border border-amber-400/40 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <h4 className="text-sm font-bold text-amber-200 font-display">
              {pickLang(
                {
                  ar: "⚠️ مهارات تحتاج تقوية",
                  en: "⚠️ Skills needing reinforcement",
                },
                lang,
              )}
            </h4>
          </div>

          <div className="space-y-2">
            {weakSkills.map((p) => (
              <div
                key={p.skillId}
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Target className="w-4 h-4 text-amber-300 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">
                      {p.skillId} — {localizeSkillLabel(p.skillId)}
                    </p>
                    <p className="text-[10px] text-amber-300">
                      {p.correct}/{p.attempts} ·{" "}
                      {formatNumber(Math.round(p.avgTimeMs / 1000), numberStyle)}s
                      {p.speedClass === "slow" &&
                        ` · ${pickLang({ ar: "بطيء", en: "slow" }, lang)}`}
                      {p.correct < p.attempts &&
                        ` · ${pickLang({ ar: "دقة منخفضة", en: "low accuracy" }, lang)}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-200 font-body leading-relaxed">
                <strong>{pickLang({ ar: "التوصية:", en: "Recommendation:" }, lang)}</strong>{" "}
                {pickLang(
                  {
                    ar: "أعد جلسة على المهارات أعلاه. سيقترح عليك النظام أسئلة علاجية مخصصة تلقائياً.",
                    en: "Retake a session on the skills above. The system will automatically suggest customized remedial questions.",
                  },
                  lang,
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── [FIX AF2] Historical skills — this level ─── */}
      {historicalThisLevel.length > 0 && (
        <div className="glass-card p-4 border border-red-400/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-red-300" />
            <h4 className="text-sm font-bold text-red-200 font-display">
              {pickLang(
                {
                  ar: "📉 مهارات هذا المستوى تحتاج مراجعة",
                  en: "📉 Skills from this level need review",
                },
                lang,
              )}
            </h4>
            {levelNum !== undefined && (
              <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-200 font-bold">
                L{levelNum}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {historicalThisLevel.slice(0, 8).map((r) => (
              <span
                key={r.skillId}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-400/40 text-red-200 text-[10px] font-bold"
                title={localizeSkillLabel(r.skillId)}
              >
                {r.skillId} · {localizeSkillLabel(r.skillId)} ·{" "}
                {formatNumber(Math.round(r.weaknessScore), numberStyle)}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── Historical skills — other levels ─── */}
      {historicalOtherLevels.length > 0 && (
        <div className="glass-card p-4 border border-purple-400/30 bg-purple-500/5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-300" />
            <h4 className="text-sm font-bold text-purple-200 font-display">
              {pickLang(
                {
                  ar: "📚 مهارات من مستويات أخرى تحتاج مراجعة",
                  en: "📚 Skills from other levels need review",
                },
                lang,
              )}
            </h4>
            <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 font-bold">
              {pickLang({ ar: "مراجعة عامة", en: "General Review" }, lang)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {historicalOtherLevels.slice(0, 8).map((r) => {
              const skillLevel = getLevelOfSkill(r.skillId);
              return (
                <span
                  key={r.skillId}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-200 text-[10px] font-bold flex items-center gap-1"
                  title={localizeSkillLabel(r.skillId)}
                >
                  {r.skillId}
                  {skillLevel !== null && (
                    <span className="text-[8px] opacity-70">· L{skillLevel}</span>
                  )}
                  <span className="opacity-70">
                    · {formatNumber(Math.round(r.weaknessScore), numberStyle)}%
                  </span>
                </span>
              );
            })}
          </div>

          <p className="text-[9px] text-purple-200/60 font-body mt-2">
            {pickLang(
              {
                ar: "💡 هذه مهارات من دروس سابقة — راجعها عند العودة لتلك المستويات.",
                en: "💡 These are skills from previous lessons — review them when returning to those levels.",
              },
              lang,
            )}
          </p>
        </div>
      )}

      {/* ─── Total ─── */}
      <div className="glass-card p-4 text-center">
        <p className="text-[10px] text-white/50 font-body">
          {pickLang({ ar: "إجمالي الشارات:", en: "Total Badges:" }, lang)}{" "}
          <strong className="text-gold-300">
            {formatNumber(allBadges.length, numberStyle)}
          </strong>{" "}
          / {formatNumber(20, numberStyle)}
        </p>
      </div>
    </motion.div>
  );
}

export default AdaptiveFeedback;