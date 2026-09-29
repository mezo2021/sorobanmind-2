// ═══════════════════════════════════════════════════════════════════
// 🧪 src/screens/SRBTestScreen.tsx — شاشة اختبار SRB
// ═══════════════════════════════════════════════════════════════════
//
// ⚠️ شاشة اختبار فقط — تُستخدم للتحقق من SRB
//    لا تُستخدم في الإنتاج
//
// ═══════════════════════════════════════════════════════════════════

import { motion } from 'framer-motion';
import { ArrowRight, Dumbbell, Eye, Zap, Volume2, Stethoscope } from 'lucide-react';

import {
  SRB_LEVELS,
  getSectionsByLevel,
  loadGrade,
  hasPassed,
  type SRBLevel,
  type SRBSection,
  type SRBGradeMode,
} from '@/data/srb-adapter';

interface SRBTestScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  playSound: (type: 'click') => void;
}

export function SRBTestScreen({
  onBack,
  onNavigate,
  playSound,
}: SRBTestScreenProps) {
  const go = (screen: string) => {
    playSound('click');
    onNavigate(screen);
  };

  const getGradeDisplay = (
    level: SRBLevel,
    section: SRBSection,
    mode: SRBGradeMode,
  ): string => {
    const grade = loadGrade(level, section, mode);
    if (!grade) return '—';
    return `${grade.grade}%${grade.passed ? ' ✓' : ''}`;
  };

  return (
    <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold font-display text-white">
            🧪 اختبار SRB
          </h2>
          <p className="text-sm text-white/50 font-body">
            روابط مباشرة لكل درس ومرحلة
          </p>
        </div>
      </div>

      {/* Levels */}
      <div className="space-y-6">
        {SRB_LEVELS.map((level) => {
          const sections = getSectionsByLevel(level.id);
          if (sections.length === 0) return null;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5"
            >
              <h3 className="text-lg font-bold font-display text-white mb-3">
                {level.id} — {level.name}
              </h3>

              <div className="space-y-4">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <h4 className="text-sm font-bold text-white mb-2">
                      {section.id} — {section.name}
                    </h4>

                    {/* Grades row */}
                    <div className="flex flex-wrap gap-2 mb-3 text-[10px] text-white/50 font-mono">
                      <span>P: {getGradeDisplay(level.id, section.id, 'practice')}</span>
                      <span>ANZ-V: {getGradeDisplay(level.id, section.id, 'anzanVisualNormal')}</span>
                      <span>ANZ-F: {getGradeDisplay(level.id, section.id, 'anzanVisualFlash')}</span>
                      <span>ANZ-A: {getGradeDisplay(level.id, section.id, 'anzanAudio')}</span>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <button
                        type="button"
                        onClick={() => go(`practice-srb-${level.id}-${section.id}`)}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold hover:bg-blue-500/30 transition"
                      >
                        <Dumbbell className="w-3 h-3" />
                        تمرّن
                      </button>

                      <button
                        type="button"
                        onClick={() => go(`anzan-srb-${level.id}-${section.id}-normal`)}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-bold hover:bg-purple-500/30 transition"
                      >
                        <Eye className="w-3 h-3" />
                        عادي
                      </button>

                      <button
                        type="button"
                        onClick={() => go(`anzan-srb-${level.id}-${section.id}-flash`)}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-200 text-xs font-bold hover:bg-fuchsia-500/30 transition"
                      >
                        <Zap className="w-3 h-3" />
                        Flash
                      </button>

                      <button
                        type="button"
                        onClick={() => go(`audio-anzan-srb-${level.id}-${section.id}`)}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-bold hover:bg-rose-500/30 transition"
                      >
                        <Volume2 className="w-3 h-3" />
                        سمعي
                      </button>

                      <button
                        type="button"
                        onClick={() => go(`remediation-${level.id}-${section.id}`)}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold hover:bg-amber-500/30 transition"
                      >
                        <Stethoscope className="w-3 h-3" />
                        علاجي
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Reset button */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            if (confirm('حذف كل تقدّم SRB؟')) {
              localStorage.removeItem('srb_progress');
              window.location.reload();
            }
          }}
          className="text-xs text-red-300 hover:text-red-200 underline"
        >
          🗑️ حذف كل تقدّم SRB
        </button>
      </div>
    </div>
  );
}

export default SRBTestScreen;