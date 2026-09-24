// src/App.tsx
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStats } from './hooks/useGameStats';
import { useSound } from './hooks/useSound';
import { useConfetti } from './hooks/useConfetti';
import type { Screen as V1Screen, Role } from './types';

// ═══ v1 Screens ═══
import WelcomeScreen from './screens/WelcomeScreen';
import RoleSelection from './screens/RoleSelection';
import HeroDashboard from './screens/HeroDashboard';
import GuardianDashboard from './screens/GuardianDashboard';
import Header from './screens/Header';

// ═══ v2 Screens ═══
import CategorySelectScreen from './screens/CategorySelectScreen';
import CurriculumScreen from './screens/CurriculumScreen';
import EnrichmentScreen from './screens/EnrichmentScreen';
import LevelScreen from './screens/LevelScreen';

// ═══ Debug ═══
import { DebugOverlay } from './components/DebugOverlay';

// ═══ Types ═══
type AppScreen =
  | V1Screen
  | 'category-select'
  | 'curriculum'
  | 'enrichment'
  | 'level'
  | 'loading';

// ═══ Constants ═══
const WELCOME_STORAGE_KEY = 'soroban_welcome_seen';
const WELCOME_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ═══ Helpers ═══
function shouldShowWelcome(): boolean {
  try {
    const raw = localStorage.getItem(WELCOME_STORAGE_KEY);
    if (!raw) return true;
    const lastSeen = parseInt(raw, 10);
    if (isNaN(lastSeen)) return true;
    return Date.now() - lastSeen > WELCOME_INTERVAL_MS;
  } catch {
    return true;
  }
}

function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_STORAGE_KEY, String(Date.now()));
  } catch { /* ignore */ }
}

// ═══ Coming Soon Placeholder ═══
function ComingSoonScreen({
  onBack,
  title = 'قيد التطوير',
}: {
  onBack: () => void;
  title?: string;
}) {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong p-8 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl">
          <span className="text-4xl">🚧</span>
        </div>
        <h2 className="text-2xl font-extrabold font-display text-white mb-2">
          {title}
        </h2>
        <p className="text-white/60 font-body mb-6 leading-relaxed">
          هذه الشاشة قيد التطوير حالياً — سنكملها في الجلسات القادمة
        </p>
        <button onClick={onBack} className="btn-primary w-full justify-center">
          رجوع
        </button>
      </motion.div>
    </div>
  );
}

// ═══ Main App ═══
export default function App() {
  const [screen, setScreen] = useState<AppScreen>('loading');
  const [role, setRole] = useState<Role>(null);
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const { stats, toggleSound } = useGameStats();
  const playSound = useSound(stats.soundEnabled);
  const { burst } = useConfetti();

  // ═══ Initialization ═══
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (shouldShowWelcome()) {
      setScreen('welcome');
    } else {
      setScreen('role');
    }
  }, [ready]);

  // ═══ Sound Wrapper ═══
  const handleSound = useCallback(
    (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => {
      if (stats.soundEnabled) playSound(type);
    },
    [stats.soundEnabled, playSound],
  );

  // ═══ Handlers ═══
  const handleWelcomeStart = () => {
    markWelcomeSeen();
    handleSound('click');
    setScreen('role');
  };

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    if (selectedRole === 'hero') {
      setScreen('hero-dashboard');
    } else if (selectedRole === 'guardian') {
      setScreen('guardian-dashboard');
    }
  };

  const handleNavigate = (target: AppScreen) => {
    // ✅ توجيه زر "التعلّم" القديم إلى منهج GPT الجديد
    if (target === 'learn') {
      setScreen('curriculum');
      return;
    }
    setScreen(target);
  };

  const handleSwitchToHero = () => {
    setRole('hero');
    setScreen('hero-dashboard');
  };

  const handleShowWelcome = () => {
    setScreen('welcome');
  };

  const handleBackToRole = () => {
    setRole(null);
    setScreen('role');
  };

  const handleBackToHero = () => {
    setRole('hero');
    setScreen('hero-dashboard');
  };

  const handleOpenLevel = (levelId: string) => {
    setActiveLevelId(levelId);
    setScreen('level');
  };

  const handleBackToCurriculum = () => {
    setScreen('curriculum');
  };

  const handleOpenEnrichment = () => {
    setScreen('enrichment');
  };

  const handleOpenEnrichmentModule = (_id: string) => {
    // TODO: open enrichment lesson
    console.log('Open enrichment module:', _id);
  };

  // ═══ Loading Screen ═══
  if (!ready || screen === 'loading') {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">🧮</div>
          <p className="text-xl text-amber-400 font-bold">جاري التحميل...</p>
        </motion.div>
      </div>
    );
  }

  // ═══ Screen Renderer ═══
  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onStart={handleWelcomeStart} />;

      case 'role':
        return (
          <RoleSelection onSelect={handleRoleSelect} playSound={handleSound} />
        );

      case 'hero-dashboard':
        return (
          <>
            <Header
              xp={stats.xp}
              streak={stats.streak}
              level={stats.level}
              soundEnabled={stats.soundEnabled}
              onToggleSound={toggleSound}
              onHome={handleBackToRole}
            />
            <HeroDashboard
              onNavigate={(target) => handleNavigate(target as AppScreen)}
              playSound={handleSound}
              xp={stats.xp}
              streak={stats.streak}
              earnedBadges={stats.earnedBadges}
            />
          </>
        );

      case 'guardian-dashboard':
        return (
          <>
            <Header
              xp={stats.xp}
              streak={stats.streak}
              level={stats.level}
              soundEnabled={stats.soundEnabled}
              onToggleSound={toggleSound}
              onHome={handleBackToRole}
            />
            <GuardianDashboard
              onBack={handleBackToRole}
              playSound={handleSound}
              childName={
                localStorage.getItem('soroban_child_name') || 'البطل'
              }
              childXP={stats.xp}
              childStreak={stats.streak}
              childLevel={stats.level}
              onSwitchToHero={handleSwitchToHero}
              onShowWelcome={handleShowWelcome}
            />
          </>
        );

      // ═══ v2 Curriculum Flow ═══
      case 'category-select':
        return <CategorySelectScreen onSelect={() => setScreen('curriculum')} />;

      case 'curriculum':
        return (
          <CurriculumScreen
            category="kids"
            onBack={handleBackToHero}
            onOpenLevel={handleOpenLevel}
            onOpenEnrichment={handleOpenEnrichment}
          />
        );

      case 'enrichment':
        return (
          <EnrichmentScreen
            category="kids"
            onBack={handleBackToCurriculum}
            onOpenModule={handleOpenEnrichmentModule}
          />
        );

      case 'level':
        if (!activeLevelId) {
          setScreen('curriculum');
          return null;
        }
        return (
          <LevelScreen
            levelId={activeLevelId}
            onBack={handleBackToCurriculum}
          />
        );

      // ═══ v1 Screens (قيد النقل) ═══
      case 'practice':
      case 'anzan':
      case 'quests':
      case 'soroban':
      case 'multiplication':
      case 'secrets':
      case 'cross-multiplication':
      case 'division':
      case 'certificate':
      case 'final-exam':
        return (
          <ComingSoonScreen
            onBack={handleBackToHero}
            title={
              screen === 'practice'
                ? 'التدريب'
                : screen === 'anzan'
                  ? 'الأنزان'
                  : screen === 'quests'
                    ? 'المغامرات'
                    : screen === 'soroban'
                      ? 'السوروبان التفاعلي'
                      : screen === 'multiplication'
                        ? 'درس الضرب'
                        : screen === 'secrets'
                          ? 'الأسرار السحرية'
                          : screen === 'cross-multiplication'
                            ? 'الضرب التقاطعي'
                            : screen === 'division'
                              ? 'القسمة'
                              : screen === 'certificate'
                                ? 'الشهادة'
                                : 'الامتحان النهائي'
            }
          />
        );

      default:
        return <ComingSoonScreen onBack={handleBackToRole} />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Debug Overlay (dev only) */}
      {import.meta.env.DEV && <DebugOverlay />}
    </>
  );
}