// src/components/AdaptiveFeedback.tsx
// مكوّن عرض ملاحظات التعليم التكيفي
// ✅ تصفية حسب المستوى الحالي (لا تظهر مهارات مستويات أخرى)
// ✅ تشخيص دقيق: خطأ/بطء/استعجال

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

/** ✅ جديد: نوع الضعف */
type WeaknessType = 'careless' | 'accuracy' | 'speed' | 'both' | 'none';

interface AdaptiveFeedbackProps {
  performances: SkillPerformance[];
  sectionLabel: string;
  /** ✅ جديد: رقم المستوى (0-7) للتصفية */
  levelNum?: number;
}

// ═══════════════════════════════════════════════════════════
// خريطة المستويات → المهارات
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
// أدوات مساعدة
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

/** ✅ تشخيص نوع الضعف */
function getWeaknessType(p: SkillPerformance): WeaknessType {
  const hasAccuracyIssue = p.correct < p.attempts;
  const hasSpeedIssue = p.speedClass === 'slow';
  
  if (hasAccuracyIssue && hasSpeedIssue) return 'both';
  if (hasAccuracyIssue && !hasSpeedIssue) {
    // خطأ + سريع = استعجال
    return p.speedClass === 'mastery' ? 'careless' : 'accuracy';
  }
  if (!hasAccuracyIssue && hasSpeedIssue) return 'speed';
  return 'none';
}

function getWeaknessHint(type: WeaknessType): string {
  switch (type) {
    case 'careless': return '⚡ استعجلت — ركّز قبل الإجابة';
    case 'accuracy': return '🎯 أخطأت — أعد الدرس';
    case 'speed': return '🐢 صحيح لكن بطيء — تدرّب على السرعة';
    case 'both': return '📚 يحتاج مراجعة شاملة';
    default: return '';
  }
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

  // ─── تصنيف المهارات ───
  const masteredSkills = performances.filter(
    (p) => p.speedClass === "mastery" && p.correct === p.attempts,
  );

  const acceptedSkills = performances.filter(
    (p) => p.speedClass === "accepted" && p.correct === p.attempts,
  );

  const weakSkills = performances.filter(
    (p) => p.speedClass === "slow" || p.correct < p.attempts,
  );

  // ─── المهارات الضعيفة من البنك (تاريخياً) ───
  // ✅ تصفية حسب المستوى الحالي فقط
  const relevantSkillIds = levelNum !== undefined
    ? (LEVEL_SKILLS[levelNum] ?? [])
    : null;

  const historicalWeak = loadWeakSkills();
  const historicalWeakSkills = Object.values(historicalWeak)
    .filter((r) => {
      if (r.weaknessScore < 50) return false;
      // لو لم يُحدَّد المستوى → نعرض الكل (سلوك قديم)
      if (relevantSkillIds && !relevantSkillIds.includes(r.skillId)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.weaknessScore - a.weaknessScore);

  // ─── إذا لا يوجد شيء — لا نعرض ───
  if (
    masteredSkills.length === 0 &&
    acceptedSkills.length === 0 &&
    weakSkills.length === 0 &&
    historicalWeakSkills.length === 0
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

      {/* ─── المهارات الضعيفة ─── */}
      {weakSkills.length > 0 && (
        <div className="glass-card p-4 border border-amber-400/40 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <h4 className="text-sm font-bold text-amber-200 font-display">
              ⚠️ مهارات تحتاج تقوية
            </h4>
          </div>

          <div className="space-y-2">
            {weakSkills.map((p) => {
              const weaknessType = getWeaknessType(p);
              const hint = getWeaknessHint(weaknessType);
              return (
                <div
                  key={p.skillId}
                  className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30"
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-300 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">
                        {p.skillId} — {getSkillLabel(p.skillId)}
                      </p>
                      <p className="text-[10px] text-amber-300">
                        {p.correct}/{p.attempts} · {formatNumber(Math.round(p.avgTimeMs / 1000), numberStyle)}s
                      </p>
                    </div>
                  </div>
                  {hint && (
                    <p className="text-[10px] text-amber-200 font-body mt-1.5 mr-6">
                      {hint}
                    </p>
                  )}
                </div>
              );
            })}
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

      {/* ─── المهارات الضعيفة تاريخياً (مُصفَّاة) ─── */}
      {historicalWeakSkills.length > 0 && (
        <div className="glass-card p-4 border border-red-400/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-red-300" />
            <h4 className="text-sm font-bold text-red-200 font-display">
              📉 مهارات تحتاج مراجعة (من جلسات سابقة)
            </h4>
            {levelNum !== undefined && (
              <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-200 font-bold">
                L{levelNum}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {historicalWeakSkills.slice(0, 8).map((r) => (
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