// src/screens/GuardianDashboard.tsx
// ✅ SRB-first: يقرأ من progressStore + masteryBadgesStore
// ✅ Props محفوظة للتوافق مع App.tsx (لكن تُتجاهل قيمها)

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  ArrowRight, TrendingUp, Target, Clock, Award,
  Brain, Calendar, Zap, CheckCircle2, BarChart3,
  Star, Eye, Crown, Diamond, Trophy, Lock as LockBadge,
  Swords, ShieldCheck, Circle, Lock, Volume2, RefreshCw,
  Home, Sparkles, PlayCircle,
  type LucideIcon,
} from 'lucide-react';

import { useQuests } from '../hooks/useQuests';

// ═══ SRB Stores ═══
import { useProgressStore } from '../store/progressStore';
import { useMasteryBadgesStore } from '../store/masteryBadgesStore';

// ═══ SRB Data ═══
import { SRB_LEVELS } from '../data/srb/curriculum';
import { getModuleName } from '../data/srb/modules';
import type { SRBLevel, SRBSection, SRBModule } from '../data/srb/types';

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
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

function getSkillLabel(skillId: string): string {
  const parsed = parseSkillId(skillId);
  if (!parsed) return skillId;
  return getModuleName(parsed.section, parsed.module);
}

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
  /** @deprecated — يُقرأ الآن من progressStore.totalXP */
  childXP?: number;
  /** @deprecated — يُقرأ الآن من progressStore.currentStreak */
  childStreak?: number;
  /** @deprecated — يُحسب الآن من totalXP */
  childLevel?: number;
  onSwitchToHero?: () => void;
  onShowWelcome?: () => void;
}

type LevelStatus = 'completed' | 'available' | 'locked';

interface LevelNodeData {
  id: number;
  nameAr: string;
  status: LevelStatus;
  xpRequired: number;
}

// ═══════════════════════════════════════════════════════════
// LevelNodeButton
// ═══════════════════════════════════════════════════════════

function LevelNodeButton({ level, index }: { level: LevelNodeData; index: number }) {
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
          {level.nameAr}
        </p>
        {level.status === 'available' && (
          <p className="text-[10px] text-purple-300 font-body mt-0.5">
            {toArabicNumber(level.xpRequired)} XP
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
  childName = 'البطل',
  onSwitchToHero,
  onShowWelcome,
}: GuardianDashboardProps) {
  // ═══ progressStore (SRB) ═══
  const storedName = useProgressStore((s) => s.childName);
  const totalXP = useProgressStore((s) => s.totalXP);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const completedLevels = useProgressStore((s) => s.completedLevels);
  const passedPractice = useProgressStore((s) => s.passedPractice);
  const passedAnzanVisual = useProgressStore((s) => s.passedAnzanVisual);
  const passedAnzanAudio = useProgressStore((s) => s.passedAnzanAudio);
  const anzanBadges = useProgressStore((s) => s.anzanBadges);
  const anzanAudioBadges = useProgressStore((s) => s.anzanAudioBadges);

  // ═══ masteryBadgesStore ═══
  const masteryBadges = useMasteryBadgesStore((s) => s.badges);

  // ═══ Quests ═══
  const quests = useQuests();

  // ═══ اسم الطفل ═══
  const savedName = storedName || childName;

  // ═══ مشتقات ═══
  const childLevel = Math.floor(totalXP / 100) + 1;
  const completedLevelsCount = completedLevels.length;

  // ═══ 🎓 شارات إنجاز المستوى (مشتقة من completedLevels) ═══
  const levelBadges = useMemo(() =>
    SRB_LEVELS.map((lv, idx) => ({
      id: lv.id,
      label: lv.name,
      labelEn: lv.nameEn,
      order: lv.order,
      Icon: LEVEL_ICONS[idx] ?? Star,
      gradient: LEVEL_GRADIENTS[lv.id] ?? 'from-purple-500 to-electric-500',
      earned: (completedLevels as unknown as string[]).includes(lv.id),
    })),
    [completedLevels],
  );

  const earnedLevelBadges = levelBadges.filter((b) => b.earned).length;

  // ═══ 🏅 شارات إتقان المهارات (SRB) ═══
  const masteryBadgesList = useMemo(
    () => Object.values(masteryBadges).sort((a, b) => b.masteredAt - a.masteredAt),
    [masteryBadges],
  );

  // ═══ 🧠 شارات الأنزان البصري ═══
  const anzanBadgeList = useMemo(() => [
    { id: 'master_addition', label: 'خبير جمع وطرح', icon: '🧠', color: 'from-cyan-500 to-blue-700', earned: !!anzanBadges.master_addition },
    { id: 'master_multiplication', label: 'خبير ضرب', icon: '✖️', color: 'from-indigo-500 to-purple-700', earned: !!anzanBadges.master_multiplication },
    { id: 'master_division', label: 'خبير قسمة', icon: '➗', color: 'from-blue-500 to-cyan-700', earned: !!anzanBadges.master_division },
    { id: 'master_mixed', label: 'خبير مختلط', icon: '🔀', color: 'from-pink-500 to-rose-700', earned: !!anzanBadges.master_mixed },
  ], [anzanBadges]);

  const earnedAnzanCount = anzanBadgeList.filter((b) => b.earned).length;

  // ═══ 🎧 شارات الأنزان السماعي ═══
  const audioAnzanBadgeList = useMemo(() => [
    { id: 'master_addition_audio', label: 'خبير جمع وطرح سماعي', icon: '🎤', color: 'from-cyan-500 to-blue-700', earned: !!anzanAudioBadges.master_addition_audio },
    { id: 'master_multiplication_audio', label: 'خبير ضرب سماعي', icon: '🎤', color: 'from-indigo-500 to-purple-700', earned: !!anzanAudioBadges.master_multiplication_audio },
    { id: 'master_division_audio', label: 'خبير قسمة سماعية', icon: '🎤', color: 'from-blue-500 to-cyan-700', earned: !!anzanAudioBadges.master_division_audio },
  ], [anzanAudioBadges]);

  const earnedAudioCount = audioAnzanBadgeList.filter((b) => b.earned).length;

  // ═══ 📊 المهارات (SRB) ═══
  const skills = useMemo(() => {
    const totalLevels = SRB_LEVELS.length;
    const concentration = Math.min(100, Math.round((passedPractice.length / totalLevels) * 100));
    const visualization = Math.min(100, Math.round((passedAnzanVisual.length / totalLevels) * 100));
    const masteryCount = Object.keys(masteryBadges).length;
    const observation = Math.min(100, Math.round((masteryCount / 20) * 100));
    const listening = Math.min(100, Math.round((passedAnzanAudio.length / totalLevels) * 100));

    return [
      { id: 'concentration', nameAr: 'التركيز والانتباه', descriptionAr: 'قدرة الطفل على البقاء مركّزاً خلال الجلسات', percentage: concentration, available: true },
      { id: 'visualization', nameAr: 'التخيل والتصور', descriptionAr: 'قدرة الطفل على تخيل المعداد في عقله (الأنزان)', percentage: visualization, available: true },
      { id: 'observation', nameAr: 'دقة الملاحظة', descriptionAr: 'قدرة الطفل على حل المسائل من المحاولة الأولى', percentage: observation, available: true },
      { id: 'listening', nameAr: 'الاستماع والانتباه السمعي', descriptionAr: 'قدرة الطفل على الحساب من خلال السماع', percentage: listening, available: true },
    ];
  }, [passedPractice, passedAnzanVisual, passedAnzanAudio, masteryBadges]);

  // ═══ 🗺️ خارطة المستويات ═══
  const levelNodes: LevelNodeData[] = useMemo(() =>
    SRB_LEVELS.map((lv, idx) => {
      const isCompleted = (completedLevels as unknown as string[]).includes(lv.id);
      const prevCompleted = idx === 0 ||
        (completedLevels as unknown as string[]).includes(SRB_LEVELS[idx - 1].id);
      const status: LevelStatus = isCompleted
        ? 'completed'
        : prevCompleted
          ? 'available'
          : 'locked';
      return {
        id: lv.order,
        nameAr: lv.name,
        status,
        xpRequired: (idx + 1) * 100,
      };
    }),
    [completedLevels],
  );

  // ═══ 📅 نشاط الأسبوع ═══
  const weeklyXP = useMemo(() => {
    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const today = new Date().getDay();
    return days.map((day, idx) => ({
      day,
      xp: idx === (today + 1) % 7 ? totalXP : 0,
    }));
  }, [totalXP]);

  const maxWeeklyXP = Math.max(...weeklyXP.map((d) => d.xp), 1);

  // ═══ 📈 الإحصائيات العلوية ═══
  const stats = [
    { label: 'نقاط الخبرة', labelEn: 'XP Points', value: toArabicNumber(totalXP), icon: Zap, gradient: 'from-gold-400 to-gold-600', glow: 'shadow-gold-500/30' },
    { label: 'المستوى', labelEn: 'Level', value: toArabicNumber(childLevel), icon: Award, gradient: 'from-purple-500 to-purple-700', glow: 'shadow-purple-500/30' },
    { label: 'الأيام المتتالية', labelEn: 'Day Streak', value: toArabicNumber(currentStreak), icon: TrendingUp, gradient: 'from-orange-500 to-red-500', glow: 'shadow-orange-500/30' },
    { label: 'المهارات المتقنة', labelEn: 'Mastered', value: toArabicNumber(masteryBadgesList.length), icon: Target, gradient: 'from-emerald2-500 to-emerald2-700', glow: 'shadow-emerald2-500/30' },
  ];

  // ═══ Refresh ═══
  const handleRefresh = () => {
    playSound('click');
    window.location.reload();
  };

  return (
    <div className="px-3 sm:px-6 py-6 max-w-5xl mx-auto" dir="rtl">
      {/* ═══ رأس الصفحة ═══ */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => { playSound('click'); onBack(); }}
          className="btn-ghost !px-3 !py-2"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="hidden sm:inline">تبديل الدور</span>
        </button>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-blue-500/15 border border-blue-400/30 text-blue-200 hover:bg-blue-500/25 transition-all text-sm font-body"
          title="إعادة تحميل الصفحة"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث الصفحة</span>
        </button>

        {onShowWelcome && (
          <button
            onClick={() => { playSound('click'); onShowWelcome(); }}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-200 hover:bg-amber-500/25 transition-all text-sm font-body"
          >
            <PlayCircle className="w-4 h-4" />
            <span>شاشة الترحيب</span>
          </button>
        )}

        {onSwitchToHero && (
          <button
            onClick={() => { playSound('click'); onSwitchToHero(); }}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-purple-500/15 border border-purple-400/30 text-purple-200 hover:bg-purple-500/25 transition-all text-sm font-body"
          >
            <Home className="w-4 h-4" />
            <span>وضع البطل</span>
          </button>
        )}

        <div className="flex-1" />

        <span className="text-[10px] text-white/40 font-body">SRB · محدّث آنياً</span>
      </div>

      {/* ═══ نظرة عامة على الطفل ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 sm:p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald2-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-4">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl shadow-purple-500/40 shrink-0"
          >
            <Brain className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-gold-300" />
              <p className="text-xs text-gold-300 font-body font-bold">تقدم الطفل</p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white truncate">
              {savedName}
            </h2>
            <p className="text-sm text-emerald2-300 font-body mt-0.5">
              مستوى {toArabicNumber(childLevel)} · {toArabicNumber(completedLevelsCount)}/{toArabicNumber(SRB_LEVELS.length)} دروس مكتملة
            </p>
          </div>
        </div>
      </motion.div>

      {/* ═══ الإحصائيات ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card p-4 sm:p-5 text-center"
            >
              <div className={`inline-flex w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} items-center justify-center shadow-lg ${stat.glow} mb-3`}>
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-0.5">{stat.value}</p>
              <p className="text-xs sm:text-sm text-white/60 font-body">{stat.label}</p>
              <p className="text-[10px] text-white/30 font-body">{stat.labelEn}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ المهارات ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-emerald2-300" />
          <h3 className="text-xl font-extrabold font-display text-white">المهارات</h3>
        </div>

        <div className="space-y-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className={`text-sm font-bold font-body ${skill.available ? 'text-white/80' : 'text-white/40'}`}>
                  {skill.nameAr}
                </p>
                <span className={`text-xs font-bold font-display ${
                  skill.percentage >= 70 ? 'text-emerald2-300' :
                  skill.percentage >= 40 ? 'text-gold-300' :
                  'text-red-300'
                }`}>
                  {toArabicNumber(skill.percentage)}٪
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    skill.percentage >= 70 ? 'bg-gradient-to-r from-emerald2-400 to-emerald2-600' :
                    skill.percentage >= 40 ? 'bg-gradient-to-r from-gold-400 to-gold-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.percentage}%` }}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.8 }}
                />
              </div>
              <p className="text-[10px] text-white/40 font-body mt-1.5">{skill.descriptionAr}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ 🎓 شارات إنجاز المستوى (SRB) ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="glass-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-300" />
            <h3 className="text-xl font-extrabold font-display text-white">🎓 شارات إنجاز المستوى</h3>
          </div>
          <span className="badge bg-gold-400/15 border-gold-400/20 text-gold-200 text-xs">
            {toArabicNumber(earnedLevelBadges)}/{toArabicNumber(levelBadges.length)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {levelBadges.map((badge, i) => {
            const Icon = badge.Icon;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${
                  badge.earned ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                  badge.earned ? `bg-gradient-to-br ${badge.gradient}` : 'bg-white/5'
                }`}>
                  {badge.earned ? <Icon className="w-7 h-7 text-white" /> : <LockBadge className="w-6 h-6 text-white/25" />}
                </div>
                <p className={`text-xs font-bold font-body text-center ${badge.earned ? 'text-white/80' : 'text-white/30'}`}>
                  {badge.label}
                </p>
                <p className="text-[10px] text-white/40 font-body text-center leading-tight">
                  {badge.labelEn}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ 🏅 شارات إتقان المهارات (SRB) ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.23 }}
        className="glass-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-300" />
            <h3 className="text-xl font-extrabold font-display text-white">🏅 شارات إتقان المهارات</h3>
          </div>
          <span className="badge bg-gold-400/15 border-gold-400/20 text-gold-200 text-xs">
            {toArabicNumber(masteryBadgesList.length)}
          </span>
        </div>

        {masteryBadgesList.length === 0 ? (
          <p className="text-center text-white/40 font-body text-sm py-6">
            🏅 لم يتقن الطفل أي مهارة بعد — أكمل بزمن قياسي للحصول على شارة!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {masteryBadgesList.slice(0, 10).map((badge) => {
              const parsed = parseSkillId(badge.skillId);
              const label = getSkillLabel(badge.skillId);
              const timeSec = Math.round(badge.bestTimeMs / 1000);
              return (
                <motion.div
                  key={badge.skillId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-l from-gold-400/10 to-transparent border border-gold-400/30"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {parsed ? `${parsed.level}-${parsed.section}-${parsed.module}` : badge.skillId}
                    </p>
                    <p className="text-[10px] text-gold-200 truncate">{label}</p>
                    <p className="text-[10px] text-white/50">
                      ⏱ {toArabicNumber(timeSec)}s (قياسي)
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {masteryBadgesList.length > 10 && (
          <p className="text-center text-white/40 font-body text-xs mt-3">
            و {toArabicNumber(masteryBadgesList.length - 10)} شارة أخرى...
          </p>
        )}
      </motion.div>

      {/* ═══ 🧠 شارات الأنزان البصري ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="glass-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-300" />
            <h3 className="text-xl font-extrabold font-display text-white">شارات الأنزان البصري</h3>
          </div>
          <span className="badge bg-purple-500/15 border-purple-400/20 text-purple-200 text-xs">
            {toArabicNumber(earnedAnzanCount)}/{toArabicNumber(anzanBadgeList.length)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {anzanBadgeList.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${
                badge.earned ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                badge.earned ? `bg-gradient-to-br ${badge.color}` : 'bg-white/5'
              }`}>
                {badge.earned ? (
                  <span className="text-2xl">{badge.icon}</span>
                ) : (
                  <LockBadge className="w-6 h-6 text-white/25" />
                )}
              </div>
              <p className={`text-xs font-bold font-body text-center ${
                badge.earned ? 'text-white/80' : 'text-white/30'
              }`}>
                {badge.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ 🎧 شارات الأنزان السماعي ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-300" />
            <h3 className="text-xl font-extrabold font-display text-white">شارات الأنزان السماعي</h3>
          </div>
          <span className="badge bg-purple-500/15 border-purple-400/20 text-purple-200 text-xs">
            {toArabicNumber(earnedAudioCount)}/{toArabicNumber(audioAnzanBadgeList.length)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {audioAnzanBadgeList.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${
                badge.earned ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                badge.earned ? `bg-gradient-to-br ${badge.color}` : 'bg-white/5'
              }`}>
                {badge.earned ? (
                  <span className="text-2xl">{badge.icon}</span>
                ) : (
                  <LockBadge className="w-6 h-6 text-white/25" />
                )}
              </div>
              <p className={`text-[10px] font-bold font-body text-center leading-tight ${
                badge.earned ? 'text-white/80' : 'text-white/30'
              }`}>
                {badge.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ 🗺️ خارطة المستويات ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="text-xl font-extrabold font-display text-white">خارطة المستويات</h3>
          </div>
          <span className="badge bg-purple-500/15 border-purple-400/20 text-purple-300 text-xs">
            {toArabicNumber(completedLevelsCount)}/{toArabicNumber(SRB_LEVELS.length)} مكتمل
          </span>
        </div>

        <div className="relative overflow-x-auto scrollbar-hide pb-4">
          <div className="flex items-start gap-3 sm:gap-5 min-w-max pr-2 pl-8">
            <div className="absolute top-8 right-0 left-0 h-1 bg-gradient-to-r from-purple-500/30 via-electric-500/30 to-white/5 rounded-full" />
            {levelNodes.map((node, i) => (
              <LevelNodeButton key={node.id} level={node} index={i} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══ 📅 نشاط الأسبوع ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-5 h-5 text-electric-400" />
          <h3 className="text-lg font-extrabold font-display text-white">نشاط الأسبوع</h3>
        </div>
        <div className="flex items-end justify-between gap-2 sm:gap-3 h-40">
          {weeklyXP.map((day, i) => {
            const height = (day.xp / maxWeeklyXP) * 100;
            return (
              <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.5 + i * 0.06, type: 'spring', stiffness: 100, damping: 15 }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-purple-600 to-electric-400 min-h-[4px] relative group"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white/0 group-hover:text-white/80 transition-colors whitespace-nowrap">
                    {toArabicNumber(day.xp)}
                  </span>
                </motion.div>
                <span className="text-[10px] sm:text-xs text-white/50 font-body">{day.day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ 📊 إحصائيات مفصلة ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald2-400" />
            <p className="text-sm text-white/60 font-body">تمارين ناجحة</p>
          </div>
          <p className="text-3xl font-extrabold font-display text-white">
            {toArabicNumber(passedPractice.length)}
          </p>
          <p className="text-xs text-emerald2-300 font-body mt-1">
            من {toArabicNumber(SRB_LEVELS.length)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-electric-400" />
            <p className="text-sm text-white/60 font-body">أنزان بصري ناجح</p>
          </div>
          <p className="text-3xl font-extrabold font-display text-white">
            {toArabicNumber(passedAnzanVisual.length)}
          </p>
          <p className="text-xs text-electric-300 font-body mt-1">
            من {toArabicNumber(SRB_LEVELS.length)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-gold-400" />
            <p className="text-sm text-white/60 font-body">إجمالي الشارات</p>
          </div>
          <p className="text-3xl font-extrabold font-display text-white">
            {toArabicNumber(
              earnedLevelBadges +
              masteryBadgesList.length +
              earnedAnzanCount +
              earnedAudioCount
            )}
          </p>
          <p className="text-xs text-gold-300 font-body mt-1">
            جميع الأنواع
          </p>
        </motion.div>
      </div>

      {/* ═══ 📈 تقدم المستويات ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="glass-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-extrabold font-display text-white">تقدم المستويات</h3>
        </div>
        <div className="space-y-2.5">
          {levelNodes.map((node, i) => {
            const pct = node.status === 'completed' ? 100 : node.status === 'available' ? 40 : 0;
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.04 }}
                className="flex items-center gap-3"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    node.status === 'completed' ? 'bg-emerald2-400'
                    : node.status === 'available' ? 'bg-purple-400 animate-pulse'
                    : 'bg-white/20'
                  }`}
                />
                <span className={`text-sm font-body w-28 sm:w-36 shrink-0 ${node.status === 'locked' ? 'text-white/30' : 'text-white/70'}`}>
                  {node.nameAr}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      node.status === 'completed' ? 'bg-gradient-to-r from-emerald2-400 to-emerald2-600'
                      : node.status === 'available' ? 'bg-gradient-to-r from-purple-400 to-electric-500'
                      : 'bg-white/10'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.8 + i * 0.04, duration: 0.6 }}
                  />
                </div>
                <span className="text-xs text-white/40 font-body w-8 text-left shrink-0">
                  {toArabicNumber(node.xpRequired)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ ⚔️ المغامرات النشطة ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5 sm:p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-gold-300" />
            <h3 className="text-xl font-extrabold font-display text-white">المغامرات النشطة</h3>
          </div>
        </div>

        <div className="space-y-3">
          {quests.slice(0, 3).map((quest, i) => {
            const pct = Math.min(100, (quest.progress / quest.target) * 100);
            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-white font-body text-sm">{quest.titleAr}</p>
                  <span className="text-xs font-bold text-gold-300">
                    +{toArabicNumber(quest.xpReward)} XP
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${quest.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xs text-white/50 font-body whitespace-nowrap">
                    {toArabicNumber(quest.progress)}/{toArabicNumber(quest.target)}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {quests.length === 0 && (
            <div className="text-center py-6 text-white/40 font-body text-sm">
              لا توجد مغامرات نشطة حالياً.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default GuardianDashboard;