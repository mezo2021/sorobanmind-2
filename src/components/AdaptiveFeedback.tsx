// src/components/AdaptiveFeedback.tsx
// مكوّن عرض ملاحظات التعليم التكيفي
// ✅ فصل المهارات التاريخية حسب المستوى الحالي / مستويات أخرى

import { motion } from "framer-motion";
import {
  CheckCircle2, AlertTriangle, TrendingUp, Lightbulb,
  Trophy, Clock, Target,
} from "lucide-react";

import {
  useMasteryBadgesStore,
  classifySpeed,
} from "@/store/masteryBadgesStore";
import { loadWeakSkills } from "@/data/bank-v2";
import { useNumberStyleStore } from "@/store/numberStyleStore";
import { formatNumber } from "@/utils/numberStyle";

// ═══════════════════════════════════════════════════════════
// الأنواع
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
  /** رقم المستوى الحالي (0-7) — لفصل المهارات */
  levelNum?: number;
}

// ═══════════════════════════════════════════════════════════
// خريطة المستوى → المهارات
// ═══════════════════════════════════════════════════════════

const LEVEL_SKILLS: Record<number, string[]> = {
  0: ['S1', 'S2'],
  1: ['S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'],
  2: ['S10', 'S11', 'S12'],
  3: ['S13', 'S14', 'S15'],
  4: ['S16'],
  5: ['S17'],
  6: ['S18'],
  7: ['S19', 'S20'],
};

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function getSkillLabel(skillId: string): string {
  const map: Record<string, string> = {
    S1: "تمثيل 0-9",
    S2: "القيمة المكانية",
    S3: "الجمع المباشر",
    S4: "الطرح المباشر",
    S5: "أصدقاء 5 — جمع",
    S6: "أصدقاء 5 — طرح",
    S7: "أصدقاء 10 — جمع",
    S8: "أصدقاء 10 — طرح",
    S9: "جمع/طرح مختلط",
    S10: "ضرب 2 منازل × 1",
    S11: "ضرب 2 منازل × 2",
    S12: "ضرب متقدم",
    S13: "قسمة ÷ 1",
    S14: "قسمة ÷ 2",
    S15: "قسمة ÷ 3",
    S16: "جمع/طرح متقدم",
    S17: "ضرب/قسمة متقدم",
    S18: "الكسور العشرية",
    S19: "جذر تربيعي",
    S20: "جذر تكعيبي",
  };
  return map[skillId] ?? skillId;
}

/** معرفة المستوى من معرف المهارة */
function getLevelOfSkill(skillId: string): number | null {
  for (const [level, skills] of Object.entries(LEVEL_SKILLS)) {
    if (skills.includes(skillId)) return Number(level);
  }
  return null;
}

// ═══════════════════════════════════════════════════════════
// المكوّن
// ═══════════════════════════════════════════════════════════

export function AdaptiveFeedback({
  performances,
  sectionLabel,
  levelNum,
}: AdaptiveFeedbackProps) {
  const { style: numberStyle } = useNumberStyleStore();
  const hasBadge = useMasteryBadgesStore((s) => s.hasBadge);
  const allBadges = useMasteryBadgesStore((s) => s.getAllBadges);

  // ─── تصنيف أداء هذه الجلسة ───
  const masteredSkills = performances.filter(
    (p) => p.speedClass === "mastery" && p.correct === p.attempts,
  );

  const acceptedSkills = performances.filter(
    (p) => p.speedClass === "accepted" && p.correct === p.attempts,
  );

  const weakSkills = performances.filter(
    (p) => p.speedClass === "slow" || p.correct < p.attempts,
  );

  // ─── المهارات الضعيفة تاريخياً ───
  const historicalWeak = loadWeakSkills();
  const allHistoricalWeak = Object.values(historicalWeak)
    .filter((r) => r.weaknessScore >= 50)
    .sort((a, b) => b.weaknessScore - a.weaknessScore);

  // ✅ فصل حسب المستوى
  const currentLevelSkillIds = levelNum !== undefined
    ? (LEVEL_SKILLS[levelNum] ?? [])
    : null;

  const historicalThisLevel = currentLevelSkillIds
    ? allHistoricalWeak.filter((r) => currentLevelSkillIds.includes(r.skillId))
    : [];

  const historicalOtherLevels = currentLevelSkillIds
    ? allHistoricalWeak.filter((r) => !currentLevelSkillIds.includes(r.skillId))
    : allHistoricalWeak;

  // ─── إذا لا يوجد شيء — لا نعرض ───
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
            📊 ملاحظات التعليم التكيفي
          </h3>
        </div>
        <p className="text-[10px] text-white/50 font-body">
          {sectionLabel} — تحليل الأداء
        </p>
      </div>

      {/* ─── المهارات المُتقنة ─── */}
      {masteredSkills.length > 0 && (
        <div className="glass-card p-4 border border-emerald-400/40 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-gold-300" />
            <h4 className="text-sm font-bold text-gold-200 font-display">
              ✅ مهارات أتقنتها بزمن قياسي
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
                      {p.skillId} — {getSkillLabel(p.skillId)}
                    </p>
                    <p className="text-[10px] text-emerald-300">
                      {p.correct}/{p.attempts} · {formatNumber(Math.round(p.avgTimeMs / 1000), numberStyle)}s
                    </p>
                  </div>
                </div>
                {hasBadge(p.skillId) && (
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-gold-400/30 text-gold-100 font-bold shrink-0">
                    🏅 شارة
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── مهارات مقبولة ─── */}
      {acceptedSkills.length > 0 && (
        <div className="glass-card p-4 border border-blue-400/40">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-blue-300" />
            <h4 className="text-sm font-bold text-blue-200 font-display">
              👍 مهارات جيدة (زمن مقبول)
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
                      {p.skillId} — {getSkillLabel(p.skillId)}
                    </p>
                    <p className="text-[10px] text-blue-300">
                      {p.correct}/{p.attempts} · {formatNumber(Math.round(p.avgTimeMs / 1000), numberStyle)}s
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-white/50 font-body mt-3">
            💡 لتحصل على الشارة، حاول الوصول للزمن القياسي (أسرع).
          </p>
        </div>
      )}

      {/* ─── المهارات الضعيفة (هذه الجلسة) ─── */}
      {weakSkills.length > 0 && (
        <div className="glass-card p-4 border border-amber-400/40 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <h4 className="text-sm font-bold text-amber-200 font-display">
              ⚠️ مهارات تحتاج تقوية
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
                      {p.skillId} — {getSkillLabel(p.skillId)}
                    </p>
                    <p className="text-[10px] text-amber-300">
                      {p.correct}/{p.attempts} · {formatNumber(Math.round(p.avgTimeMs / 1000), numberStyle)}s
                      {p.speedClass === "slow" && " · بطيء"}
                      {p.correct < p.attempts && " · دقة منخفضة"}
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
                <strong>التوصية:</strong> أعد جلسة على المهارات أعلاه.
                سيقترح عليك النظام أسئلة علاجية مخصّصة تلقائياً.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── المهارات التاريخية — هذا المستوى ─── */}
      {historicalThisLevel.length > 0 && (
        <div className="glass-card p-4 border border-red-400/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-red-300" />
            <h4 className="text-sm font-bold text-red-200 font-display">
              📉 مهارات هذا المستوى تحتاج مراجعة
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
                title={getSkillLabel(r.skillId)}
              >
                {r.skillId} · {formatNumber(Math.round(r.weaknessScore), numberStyle)}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── المهارات التاريخية — مستويات أخرى ─── */}
      {historicalOtherLevels.length > 0 && (
        <div className="glass-card p-4 border border-purple-400/30 bg-purple-500/5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-300" />
            <h4 className="text-sm font-bold text-purple-200 font-display">
              📚 مهارات من مستويات أخرى تحتاج مراجعة
            </h4>
            <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 font-bold">
              مراجعة عامة
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {historicalOtherLevels.slice(0, 8).map((r) => {
              const skillLevel = getLevelOfSkill(r.skillId);
              return (
                <span
                  key={r.skillId}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-200 text-[10px] font-bold flex items-center gap-1"
                  title={getSkillLabel(r.skillId)}
                >
                  {r.skillId}
                  {skillLevel !== null && (
                    <span className="text-[8px] opacity-70">· L{skillLevel}</span>
                  )}
                  <span className="opacity-70">· {formatNumber(Math.round(r.weaknessScore), numberStyle)}%</span>
                </span>
              );
            })}
          </div>

          <p className="text-[9px] text-purple-200/60 font-body mt-2">
            💡 هذه مهارات من دروس سابقة — راجعها عند العودة لتلك المستويات.
          </p>
        </div>
      )}

      {/* ─── الإجمالي ─── */}
      <div className="glass-card p-4 text-center">
        <p className="text-[10px] text-white/50 font-body">
          إجمالي الشارات: <strong className="text-gold-300">{formatNumber(allBadges.length, numberStyle)}</strong> / {formatNumber(20, numberStyle)}
        </p>
      </div>
    </motion.div>
  );
}

export default AdaptiveFeedback;