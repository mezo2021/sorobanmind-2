// ═══════════════════════════════════════════════════════════════════
// 📋 src/screens/LessonsListScreen.tsx — قائمة دروس المرحلة
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - عرض قائمة دروس المستوى
//   - لكل درس: حالة (مقفل / متاح / ناجح بدرجة)
//   - عند الاختيار → onSelectSection(section)
//
// 📊 تُستخدم لـ 4 مراحل:
//   - practice (تمرّن)
//   - anzan-visual-normal (أنزان بصري عادي)
//   - anzan-visual-flash (أنزان بصري Flash)
//   - anzan-audio (أنزان سمعي)
//
// ═══════════════════════════════════════════════════════════════════

import { motion } from 'framer-motion';
import {
  ArrowRight, Lock, CheckCircle2, Play, RotateCcw,
  Dumbbell, Eye, Zap, Volume2, GraduationCap,
  type LucideIcon,
} from 'lucide-react';

import {
  type SRBLevel,
  type SRBSection,
  type SRBSectionDef,
  type SRBGradeMode,
  getSectionsByLevel,
  getSectionDef,
  loadGrade,
  hasPassed,
} from '@/data/srb-adapter';

import { formatNumber } from '@/utils/numberStyle';
import { useNumberStyleStore } from '@/store/numberStyleStore';

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

export type LessonsListMode =
  | 'practice'
  | 'anzan-visual-normal'
  | 'anzan-visual-flash'
  | 'anzan-audio';

interface LessonsListScreenProps {
  level: SRBLevel;
  mode: LessonsListMode;
  onBack: () => void;
  onSelectSection: (section: SRBSection) => void;
  playSound: (type: 'click' | 'whoosh') => void;
}

// ═══════════════════════════════════════════════════════════
// إعدادات المراحل
// ═══════════════════════════════════════════════════════════

interface ModeConfig {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  gradeMode: SRBGradeMode;
  passThreshold: number;
}

const MODE_CONFIG: Record<LessonsListMode, ModeConfig> = {
  'practice': {
    title: 'تمرّن',
    subtitle: 'أسئلة تقييمية — 5 أسئلة',
    icon: Dumbbell,
    gradient: 'from-blue-500 to-cyan-700',
    gradeMode: 'practice',
    passThreshold: 70,
  },
  'anzan-visual-normal': {
    title: 'أنزان بصري — عادي',
    subtitle: 'السؤال يظهر كاملاً + يُقرأ صوتياً',
    icon: Eye,
    gradient: 'from-purple-500 to-violet-700',
    gradeMode: 'anzanVisualNormal',
    passThreshold: 70,
  },
  'anzan-visual-flash': {
    title: 'أنزان بصري — Flash',
    subtitle: 'الأرقام تظهر واحداً واحداً (2 ثانية)',
    icon: Zap,
    gradient: 'from-fuchsia-500 to-pink-700',
    gradeMode: 'anzanVisualFlash',
    passThreshold: 70,
  },
  'anzan-audio': {
    title: 'أنزان سمعي',
    subtitle: 'اسمع الأرقام واحسب ذهنياً',
    icon: Volume2,
    gradient: 'from-rose-500 to-pink-700',
    gradeMode: 'anzanAudio',
    passThreshold: 70,
  },
};

// ═══════════════════════════════════════════════════════════
// بطاقة درس
// ═══════════════════════════════════════════════════════════

interface LessonCardProps {
  sectionDef: SRBSectionDef;
  mode: SRBGradeMode;
  index: number;
  previousCompleted: boolean;
  onSelect: () => void;
  playSound: (type: 'click' | 'whoosh') => void;
}

function LessonCard({
  sectionDef,
  mode,
  index,
  previousCompleted,
  onSelect,
  playSound,
}: LessonCardProps) {
  const numberStyle = useNumberStyleStore((s) => s.style);

  const grade = loadGrade(sectionDef.level, sectionDef.id, mode);
  const passed = hasPassed(sectionDef.level, sectionDef.id, mode);

  // القفل: الدرس الأول مفتوح، والباقي يعتمد على السابق
  const isLocked = !previousCompleted && index > 0;

  const handleClick = () => {
    if (isLocked) {
      playSound('whoosh');
      return;
    }
    playSound('click');
    onSelect();
  };

  return (
    <motion.button
      type="button"
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={handleClick}
      disabled={isLocked}
      className={`glass-card p-4 text-right w-full relative overflow-hidden ${
        isLocked ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* الأيقونة */}
        <div
          className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
            isLocked
              ? 'bg-white/10'
              : passed
                ? 'bg-gradient-to-br from-emerald-400 to-teal-600'
                : 'bg-gradient-to-br from-blue-500 to-cyan-700'
          }`}
        >
          {isLocked ? (
            <Lock className="w-6 h-6 text-white" />
          ) : passed ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-bold font-display text-white">
              {sectionDef.id} — {sectionDef.name}
            </h4>
            {passed && (
              <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-200 font-bold">
                ✓
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 font-body mt-0.5 leading-snug">
            {sectionDef.description}
          </p>

          {/* درجة سابقة */}
          {grade && !isLocked && (
            <div className="mt-2 flex items-center gap-2">
              {passed ? (
                <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 font-bold">
                  ناجح — {formatNumber(grade.grade, numberStyle)}٪
                </span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-lg bg-amber-500/20 text-amber-200 font-bold">
                  يحتاج تحسين — {formatNumber(grade.grade, numberStyle)}٪
                </span>
              )}
              <span className="text-[10px] text-white/40 font-body">
                محاولات: {formatNumber(grade.attempts, numberStyle)}
              </span>
            </div>
          )}

          {/* حالة مقفل */}
          {isLocked && (
            <p className="text-xs text-white/40 font-body mt-2">
              🔒 أكمل الدرس السابق أولًا
            </p>
          )}
        </div>

        {/* أيقونة الإجراء */}
        {!isLocked && (
          <div className="shrink-0 self-center">
            {passed ? (
              <RotateCcw className="w-5 h-5 text-white/40" />
            ) : (
              <ArrowRight className="w-5 h-5 text-white/40 rotate-180" />
            )}
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function LessonsListScreen({
  level,
  mode,
  onBack,
  onSelectSection,
  playSound,
}: LessonsListScreenProps) {
  const numberStyle = useNumberStyleStore((s) => s.style);
  const config = MODE_CONFIG[mode];
  const Icon = config.icon;

  const sections = getSectionsByLevel(level);

  // فحص: هل الدرس السابق مكتمل؟
  const isPreviousCompleted = (index: number): boolean => {
    if (index === 0) return true;
    const prevSection = sections[index - 1];
    return hasPassed(level, prevSection.id, config.gradeMode);
  };

  const handleBack = () => {
    playSound('click');
    onBack();
  };

  const handleSelect = (section: SRBSection) => {
    onSelectSection(section);
  };

  return (
    <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white truncate">
            {config.title}
          </h2>
          <p className="text-xs text-white/50 font-body">
            المستوى {level} · {config.subtitle}
          </p>
        </div>
        <Icon className="w-6 h-6 text-white/60" />
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 mb-6 overflow-hidden relative"
      >
        <div
          className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${config.gradient} opacity-20 blur-3xl`}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold font-display text-white">
                اختر الدرس
              </h3>
              <p className="text-xs text-white/50 font-body">
                {formatNumber(sections.length, numberStyle)} دروس متاحة
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sections list */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <LessonCard
            key={section.id}
            sectionDef={section}
            mode={config.gradeMode}
            index={index}
            previousCompleted={isPreviousCompleted(index)}
            onSelect={() => handleSelect(section.id)}
            playSound={playSound}
          />
        ))}
      </div>

      {/* Empty state */}
      {sections.length === 0 && (
        <div className="glass-card p-8 text-center">
          <GraduationCap className="w-12 h-12 text-white/30 mx-auto mb-3" />
          <p className="text-white/60 font-body">
            لا توجد دروس في هذا المستوى بعد
          </p>
        </div>
      )}
    </div>
  );
}

export default LessonsListScreen;