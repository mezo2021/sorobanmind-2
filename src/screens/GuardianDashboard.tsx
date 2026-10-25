// src/screens/GuardianDashboard.tsx
// ✅ SRB-first: يقرأ من progressStore + masteryBadgesStore
// [SURGICAL FIX] — حساب المستوى المكتمل بناءً على درجة الاختبار (>=80%) فقط + عرض L1 بدلاً من 1
// [FEATURE] — عرض النشاط اليومي الحقيقي وتصحيح أعمدة الرسم البياني + إضافة بطاقة الأنزان السمعي
// 📅 2026-10-20

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useRef } from 'react';
import {
  ArrowRight, TrendingUp, Target, Award,
  Brain, Calendar, Zap, CheckCircle2, BarChart3,
  Star, Eye, Crown, Diamond, Trophy, Lock as LockBadge,
  Swords, ShieldCheck, Circle, Lock, Volume2, RefreshCw,
  Home, Sparkles, PlayCircle, Timer, Lightbulb,
  Upload, Download, Trash2, Unlock,
  type LucideIcon,
} from 'lucide-react';

import { useQuests } from '../hooks/useQuests';

import { isPreviewMode, togglePreviewMode } from '@/utils/previewMode';

// ═══ SRB Stores ═══
import { useProgressStore, selectObservationAccuracy } from '../store/progressStore';
import { useMasteryBadgesStore } from '../store/masteryBadgesStore';

// ═══ SRB Data ═══
import { SRB_LEVELS } from '../data/srb/curriculum';
import { getModuleName } from '../data/srb/modules';
import type { SRBLevel, SRBSection, SRBModule } from '../data/srb/types';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatNumber } from '@/utils/numberStyle';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import { translateDynamic } from '@/utils/translateDynamic';

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

// 🔢 يتبع زر تبديل الأرقام (عربي ٠١٢٣ ↔ لاتيني 0123) — الاسم محفوظ للتوافق
function toArabicNumber(value: number | string): string {
  return formatNumber(value, useNumberStyleStore.getState().style);
}

interface ParsedSkillId {
  level: SRBLevel;
  section: SRBSection;
  module: SRBModule;
}

function parseSkillId(skillId: string): ParsedSkillId | null {
  const parts = skillId.split('-');
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

function getSkillLabel(skillId: string, lang: string): string {
  const parsed = parseSkillId(skillId);
  if (!parsed) return skillId;
  const arName = getModuleName(parsed.section, parsed.module);
  return translateDynamic({ nameAr: arName }, lang, 'name');
}

// ═══════════════════════════════════════════════════════════
// ثوابت
// ═══════════════════════════════════════════════════════════

const LEVEL_GRADIENTS: Record<string, string> = {
  L0: 'from-emerald-500 to-teal-700',
  L1: 'from-blue-500 to-cyan-700',
  L2: 'from-amber-500 to-orange-700',
  L3: 'from-blue-500 to-indigo-700',
  L4: 'from-purple-500 to-violet-700',
  L5: 'from-purple-500 to-fuchsia-700',
  L6: 'from-amber-500 to-rose-700',
  L7: 'from-rose-500 to-purple-700',
};

const LEVEL_ICONS: LucideIcon[] = [
  Star, Star, Target, Target, Award, Award, Crown, Diamond,
];

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

interface GuardianDashboardProps {
  onBack: () => void;
  playSound: (type: 'click' | 'whoosh') => void;
  childName?: string;
  childXP?: number;
  childStreak?: number;
  childLevel?: number;
  onSwitchToHero?: () => void;
  onShowWelcome?: () => void;
}

type LevelStatus = 'completed' | 'available' | 'locked';

interface LevelNodeData {
  id: number;
  nameAr: string;
  nameEn: string;
  status: LevelStatus;
  xpRequired: number;
}

// ═══════════════════════════════════════════════════════════
// LevelNodeButton
// ═══════════════════════════════════════════════════════════

function LevelNodeButton({
  level,
  index,
}: {
  level: LevelNodeData;
  index: number;
}) {
  const { lang } = useT();
  const isOdd = index % 2 === 1;
  const Icon =
    level.status === 'locked' ? Lock
    : level.status === 'completed' ? CheckCircle2
    : Circle;

  const statusColor =
    level.status === 'completed' ? 'from-emerald2-400 to-emerald2-600'
    : level.status === 'available' ? 'from-purple-400 to-electric-500'
    : 'from-gray-600 to-gray-800';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 15 }}
      className={`relative flex flex-col items-center gap-2 ${isOdd ? 'mt-12' : ''}`}
    >
      <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${statusColor} flex items-center justify-center shadow-xl`}>
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gold-400 text-gold-900 text-xs font-extrabold flex items-center justify-center shadow-lg">
          {toArabicNumber(level.id)}
        </span>
      </div>
      <div className="text-center max-w-[90px]">
        <p className={`text-xs sm:text-sm font-bold font-body ${level.status === 'locked' ? 'text-white/30' : 'text-white/80'}`}>
          {pickLang({ ar: level.nameAr, en: level.nameEn }, lang)}
        </p>
        {level.status === 'completed' && (
          <p className="text-[10px] text-emerald-300 font-body mt-0.5 font-bold">
            {pickLang({ ar: '✓ مكتمل', en: '✓ Completed' }, lang)}
          </p>
        )}
        {level.status === 'available' && (
          <p className="text-[10px] text-purple-300 font-body mt-0.5 font-bold">
            {pickLang({ ar: '🟣 متاح', en: '🟣 Available' }, lang)}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// الشاشة
// ═══════════════════════════════════════════════════════════

export function GuardianDashboard({
  onBack,
  playSound,
  childName,
  onSwitchToHero,
  onShowWelcome,
}: GuardianDashboardProps) {
  const { lang, dir } = useT();
  useNumberStyleStore((s) => s.style); // 🔢 إعادة الرسم عند تبديل نمط الأرقام
  // ═══ progressStore (SRB) ═══
  const storedName = useProgressStore((s) => s.childName);
  const totalXP = useProgressStore((s) => s.totalXP);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const passedPractice = useProgressStore((s) => s.passedPractice);
  const passedAnzanVisual = useProgressStore((s) => s.passedAnzanVisual);
  const passedAnzanAudio = useProgressStore((s) => s.passedAnzanAudio);
  const grades = useProgressStore((s) => s.grades);
  const anzanBadges = useProgressStore((s) => s.anzanBadges);
  const anzanAudioBadges = useProgressStore((s) => s.anzanAudioBadges);
  const remediationHistory = useProgressStore((s) => s.remediationHistory);
  const dailyXP = useProgressStore((s) => s.dailyXP); // 🆕 قراءة سجل النقاط اليومية

  // ═══ masteryBadgesStore ═══
  const masteryBadges = useMasteryBadgesStore((s) => s.badges);

  // ═══ الإنجازات (v10 — 12 إنجازاً) ═══
  const quests = useQuests();

  // ═══ الأزرار الإدارية ═══
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAllRemediation, setShowAllRemediation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inPreview = isPreviewMode();

  // ═══ الجلسات العلاجية (آخر 7 أيام) ═══
  const recentRemediation = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return remediationHistory.filter((s) => s.completedAt >= cutoff);
  }, [remediationHistory]);

  const remediationSummary = useMemo(() => {
    const map = new Map<string, {
      skillId: string;
      count: number;
      lastAt: number;
    }>();

    recentRemediation.forEach((s) => {
      s.skills.forEach((skillId) => {
        const existing = map.get(skillId);
        if (existing) {
          existing.count += 1;
          existing.lastAt = Math.max(existing.lastAt, s.completedAt);
        } else {
          map.set(skillId, { skillId, count: 1, lastAt: s.completedAt });
        }
      });
    });

    return Array.from(map.values()).sort((a, b) => b.lastAt - a.lastAt);
  }, [recentRemediation]);

  // ═══ اسم الطفل ═══
  const savedName = storedName || childName || pickLang({ ar: 'البطل', en: 'Hero' }, lang);

  // ═══ مشتقات ═══
  const totalLevelsCount = SRB_LEVELS.length;

  // ✅ [SURGICAL FIX] — المستويات المكتملة هي التي درجة اختبارها 80% أو أكثر
  const effectiveCompletedLevels = useMemo(() => {
    return SRB_LEVELS
      .filter((lv) => {
        const grade = grades[lv.id];
        return grade && grade.levelTest !== null && grade.levelTest >= 80;
      })
      .map((lv) => lv.id);
  }, [grades]);

  const effectiveCompletedCount = effectiveCompletedLevels.length;

  // ✅ [SURGICAL FIX] — المستوى الحالي يعتمد على عدد المستويات المكتملة (بحد أقصى 7)
  const childLevel = Math.min(effectiveCompletedCount, 7);

  const isLegend =
    effectiveCompletedCount === totalLevelsCount && totalLevelsCount > 0;

  // ═══ شارات إنجاز المستوى ═══
  const levelBadges = useMemo(
    () =>
      SRB_LEVELS.map((lv, idx) => ({
        id: lv.id,
        label: lv.name,
        labelEn: lv.nameEn,
        order: lv.order,
        Icon: LEVEL_ICONS[idx] ?? Star,
        gradient: LEVEL_GRADIENTS[lv.id] ?? 'from-purple-500 to-electric-500',
        earned: effectiveCompletedLevels.includes(lv.id),
      })),
    [effectiveCompletedLevels],
  );

  const earnedLevelBadges = levelBadges.filter((b) => b.earned).length;

  // ═══ شارات إتقان المهارات ═══
  const masteryBadgesList = useMemo(
    () => Object.values(masteryBadges).sort((a, b) => b.masteredAt - a.masteredAt),
    [masteryBadges],
  );

  // ═══ شارات الأنزان البصري — 7 شارات ═══
  const anzanBadgeList = useMemo(
    () => [
      { id: 'master_addition', label: pickLang({ ar: 'خبير جمع وطرح', en: 'Addition Expert' }, lang), icon: '🧠', color: 'from-cyan-500 to-blue-700', earned: !!anzanBadges.master_addition },
      { id: 'master_multiplication', label: pickLang({ ar: 'خبير ضرب', en: 'Multiplication Expert' }, lang), icon: '✖️', color: 'from-indigo-500 to-purple-700', earned: !!anzanBadges.master_multiplication },
      { id: 'master_division', label: pickLang({ ar: 'خبير قسمة', en: 'Division Expert' }, lang), icon: '➗', color: 'from-blue-500 to-cyan-700', earned: !!anzanBadges.master_division },
      { id: 'master_chains', label: pickLang({ ar: 'خبير سلاسل', en: 'Chains Expert' }, lang), icon: '🔗', color: 'from-teal-500 to-cyan-700', earned: !!anzanBadges.master_chains },
      { id: 'master_advanced', label: pickLang({ ar: 'خبير المتقدم', en: 'Advanced Expert' }, lang), icon: '🎯', color: 'from-fuchsia-500 to-purple-700', earned: !!anzanBadges.master_advanced },
      { id: 'master_decimals', label: pickLang({ ar: 'خبير العشريات', en: 'Decimals Expert' }, lang), icon: '🔢', color: 'from-rose-500 to-pink-700', earned: !!anzanBadges.master_decimals },
      { id: 'master_roots', label: pickLang({ ar: 'خبير الجذور', en: 'Roots Expert' }, lang), icon: '√', color: 'from-slate-500 to-gray-700', earned: !!anzanBadges.master_roots },
    ],
    [anzanBadges, lang],
  );

  const earnedAnzanCount = anzanBadgeList.filter((b) => b.earned).length;

  // ═══ شارات الأنزان السمعي — 7 شارات ═══
  const audioAnzanBadgeList = useMemo(
    () => [
      { id: 'master_addition_audio', label: pickLang({ ar: 'خبير جمع وطرح سماعي', en: 'Audio Addition Expert' }, lang), icon: '🎤', color: 'from-cyan-500 to-blue-700', earned: !!anzanAudioBadges.master_addition_audio },
      { id: 'master_multiplication_audio', label: pickLang({ ar: 'خبير ضرب سماعي', en: 'Audio Multiplication Expert' }, lang), icon: '🎤', color: 'from-indigo-500 to-purple-700', earned: !!anzanAudioBadges.master_multiplication_audio },
      { id: 'master_division_audio', label: pickLang({ ar: 'خبير قسمة سماعية', en: 'Audio Division Expert' }, lang), icon: '🎤', color: 'from-blue-500 to-cyan-700', earned: !!anzanAudioBadges.master_division_audio },
      { id: 'master_chains_audio', label: pickLang({ ar: 'خبير سلاسل سماعي', en: 'Audio Chains Expert' }, lang), icon: '🎤', color: 'from-teal-500 to-cyan-700', earned: !!anzanAudioBadges.master_chains_audio },
      { id: 'master_advanced_audio', label: pickLang({ ar: 'خبير المتقدم سماعي', en: 'Audio Advanced Expert' }, lang), icon: '🎤', color: 'from-fuchsia-500 to-purple-700', earned: !!anzanAudioBadges.master_advanced_audio },
      { id: 'master_decimals_audio', label: pickLang({ ar: 'خبير العشريات سماعي', en: 'Audio Decimals Expert' }, lang), icon: '🎤', color: 'from-rose-500 to-pink-700', earned: !!anzanAudioBadges.master_decimals_audio },
      { id: 'master_roots_audio', label: pickLang({ ar: 'خبير الجذور سماعي', en: 'Audio Roots Expert' }, lang), icon: '🎤', color: 'from-slate-500 to-gray-700', earned: !!anzanAudioBadges.master_roots_audio },
    ],
    [anzanAudioBadges, lang],
  );

  const earnedAudioCount = audioAnzanBadgeList.filter((b) => b.earned).length;

  // ═══ المهارات الأربع ═══
  const observation = useProgressStore(selectObservationAccuracy);

  const skills = useMemo(() => {
    const concentration = Math.min(100, Math.round((passedPractice.length / totalLevelsCount) * 100));
    const visualization = Math.min(100, Math.round((passedAnzanVisual.length / totalLevelsCount) * 100));
    const listening = Math.min(100, Math.round((passedAnzanAudio.length / totalLevelsCount) * 100));

    return [
      { 
        id: 'concentration', 
        name: pickLang({ ar: 'التركيز والانتباه', en: 'Concentration & Focus' }, lang), 
        description: pickLang({ ar: 'قدرة الطفل على البقاء مركّزاً خلال الجلسات', en: 'Child ability to stay focused during sessions' }, lang), 
        percentage: concentration, 
        available: true 
      },
      { 
        id: 'visualization', 
        name: pickLang({ ar: 'التخيل والتصور', en: 'Visualization & Soroban' }, lang), 
        description: pickLang({ ar: 'قدرة الطفل على تخيل المعداد في عقله (الأنزان)', en: 'Child ability to visualize the abacus in mind' }, lang), 
        percentage: visualization, 
        available: true 
      },
      { 
        id: 'observation', 
        name: pickLang({ ar: 'دقة الملاحظة', en: 'Observation Accuracy' }, lang), 
        description: pickLang({ ar: 'قدرة الطفل على حل المسائل من المحاولة الأولى', en: 'Child ability to solve problems on first try' }, lang), 
        percentage: observation, 
        available: true 
      },
      { 
        id: 'listening', 
        name: pickLang({ ar: 'الاستماع والانتباه السمعي', en: 'Listening & Auditory Focus' }, lang), 
        description: pickLang({ ar: 'قدرة الطفل على الحساب من خلال السماع', en: 'Child ability to calculate through listening' }, lang), 
        percentage: listening, 
        available: true 
      },
    ];
  }, [passedPractice, passedAnzanVisual, passedAnzanAudio, totalLevelsCount, observation, lang]);

  // ═══ خارطة المستويات ═══
  const levelNodes: LevelNodeData[] = useMemo(
    () =>
      SRB_LEVELS.map((lv, idx) => {
        const isCompleted = effectiveCompletedLevels.includes(lv.id);
        const prevCompleted =
          idx === 0 || effectiveCompletedLevels.includes(SRB_LEVELS[idx - 1].id);

        const status: LevelStatus = isCompleted
          ? 'completed'
          : prevCompleted ? 'available' : 'locked';

        return {
          id: lv.order,
          nameAr: lv.name,
          nameEn: lv.nameEn,
          status,
          xpRequired: (lv.order + 1) * 100,
        };
      }),
    [effectiveCompletedLevels],
  );

  // ═══ نشاط الأسبوع ═══
  // ✅ [SURGICAL FIX] — جلب بيانات السجل اليومي الحقيقية ومطابقتها مع أيام الأسبوع
  const weeklyXP = useMemo(() => {
    const days = [
      pickLang({ ar: 'السبت', en: 'Sat' }, lang),
      pickLang({ ar: 'الأحد', en: 'Sun' }, lang),
      pickLang({ ar: 'الاثنين', en: 'Mon' }, lang),
      pickLang({ ar: 'الثلاثاء', en: 'Tue' }, lang),
      pickLang({ ar: 'الأربعاء', en: 'Wed' }, lang),
      pickLang({ ar: 'الخميس', en: 'Thu' }, lang),
      pickLang({ ar: 'الجمعة', en: 'Fri' }, lang),
    ];
    const today = new Date();
    const jsDay = today.getDay(); // 0 = الأحد، 6 = السبت
    const daysSinceSat = (jsDay + 1) % 7; 
    
    const lastSaturday = new Date(today);
    lastSaturday.setDate(today.getDate() - daysSinceSat);

    return days.map((dayName, idx) => {
      const d = new Date(lastSaturday);
      d.setDate(lastSaturday.getDate() + idx);
      const dateStr = d.toISOString().split('T')[0];
      return {
        day: dayName,
        xp: dailyXP[dateStr] || 0
      };
    });
  }, [dailyXP, lang]);

  const maxWeeklyXP = Math.max(...weeklyXP.map((d) => d.xp), 1);

  // ═══ الإحصائيات العلوية ═══
  const stats = [
    { label: pickLang({ ar: 'نقاط الخبرة', en: 'XP Points' }, lang), labelEn: 'XP Points', value: toArabicNumber(totalXP), icon: Zap, gradient: 'from-gold-400 to-gold-600', glow: 'shadow-gold-500/30' },
    { label: pickLang({ ar: 'المستوى', en: 'Level' }, lang), labelEn: 'Level', value: `L${childLevel}`, icon: Award, gradient: 'from-purple-500 to-purple-700', glow: 'shadow-purple-500/30' },
    { label: pickLang({ ar: 'الأيام المتتالية', en: 'Day Streak' }, lang), labelEn: 'Day Streak', value: toArabicNumber(currentStreak), icon: TrendingUp, gradient: 'from-orange-500 to-red-500', glow: 'shadow-orange-500/30' },
    { label: pickLang({ ar: 'المهارات المتقنة', en: 'Mastered' }, lang), labelEn: 'Mastered', value: toArabicNumber(masteryBadgesList.length), icon: Target, gradient: 'from-emerald2-500 to-emerald2-700', glow: 'shadow-emerald2-500/30' },
  ];

  // ═══ Refresh ═══
  const handleRefresh = () => {
    playSound('click');
    window.location.reload();
  };

  // ═══ الأزرار الإدارية ═══
  const handlePreviewToggle = () => {
    togglePreviewMode();
    playSound('click');
    setTimeout(() => window.location.reload(), 300);
  };

  const handleReset = () => {
    const keysToKeep = [
      'soroban_companion',
      'soroban_child_name',
      'soroban_child_full_name',
      'soroban_high_scores_v1',
      'soroban_high_scores_month',
      'sorobanmind-v2-progress',
      'soroban_mastery_badges',
      'sorobanmind-v2-lang',
      'srb_progress',
      'soroban_number_style',
      'sorobania_progress_v2',
    ];
    Object.keys(localStorage).forEach((key) => {
      if (!keysToKeep.includes(key)) localStorage.removeItem(key);
    });
    playSound('whoosh');
    setShowResetConfirm(false);
    window.location.reload();
  };

  const handleBackup = () => {
    try {
      const data: Record<string, string> = {};
      Object.keys(localStorage).forEach((key) => {
        data[key] = localStorage.getItem(key) || '';
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sorobanmind-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      playSound('click');
    } catch (err) {
      window.alert(pickLang({ ar: 'خطأ: ', en: 'Error: ' }, lang) + String(err));
    }
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, value as string);
        });
        playSound('click');
        setTimeout(() => window.location.reload(), 300);
      } catch (err) {
        window.alert(pickLang({ ar: 'ملف غير صالح: ', en: 'Invalid file: ' }, lang) + String(err));
      }
    };
    reader.readAsText(file);
  };

  // ═══════════════════════════════════════════════════════════
  // JSX
  // ═══════════════════════════════════════════════════════════