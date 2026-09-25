// src/App.tsx
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStats } from './hooks/useGameStats';
import { useSound } from './hooks/useSound';
import { useConfetti } from './hooks/useConfetti';
import type { Screen as V1Screen, Role } from './types';
import type { LevelId } from './store/progressStore';

// ═══ Screens ═══
import WelcomeScreen from './screens/WelcomeScreen';
import RoleSelection from './screens/RoleSelection';
import HeroDashboard from './screens/HeroDashboard';
import GuardianDashboard from './screens/GuardianDashboard';
import Header from './screens/Header';

// ═══ Category + Level ═══
import CategoryScreen from './screens/CategoryScreen';
import LevelScreen from './screens/LevelScreen';
import EnrichmentScreen from './screens/EnrichmentScreen';

// ═══ Debug ═══
import { DebugOverlay } from './components/DebugOverlay';

// ═══ Types ═══
type AppScreen = V1Screen | 'loading';

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

// ═══ Title Helper for Coming Soon ═══
function getComingSoonTitle(screen: string): string {
  const titles: Record<string, string> = {
    'practice': 'تمرّن',
    'anzan': 'أنزان',
    'quests': 'المغامرات',
    'soroban': 'السوروبان التفاعلي',
    'multiplication': 'درس الضرب',
    'secrets': 'الأسرار السحرية',
    'cross-multiplication': 'الضرب التقاطعي',
    'division': 'القسمة',
    'certificate': 'الشهادة',
    'final-exam': 'الامتحان النهائي',
    'placement-test': 'اختبار تحديد المستوى',
    'category-exam-1': 'امتحان القسم الأول',
    'category-exam-2': 'امتحان القسم الثاني',
  };
  return titles[screen] || 'قيد التطوير';
}

// ═══ Main App ═══
export default function App() {
  const [screen, setScreen] = useState<AppScreen>('loading');
  const [role, setRole] = useState<Role>(null);
  const [activeLevelId, setActiveLevelId] = useState<LevelId | null>(null);
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
    setActiveLevelId(levelId as LevelId);
    setScreen(`lesson-${levelId}` as AppScreen);
  };

  const handleBackToCategory = (category: 'kids' | 'teens') => {
    setScreen(category === 'kids' ? 'category-kids' : 'category-teens');
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
              childName={localStorage.getItem('soroban_child_name') || 'البطل'}
              childXP={stats.xp}
              childStreak={stats.streak}
              childLevel={stats.level}
              onSwitchToHero={handleSwitchToHero}
              onShowWelcome={handleShowWelcome}
            />
          </>
        );

      // ═══ Categories ═══
      case 'category-kids':
        return (
          <CategoryScreen
            category="kids"
            onNavigate={(target) => handleNavigate(target as AppScreen)}
            playSound={handleSound}
          />
        );

      case 'category-teens':
        return (
          <CategoryScreen
            category="teens"
            onNavigate={(target) => handleNavigate(target as AppScreen)}
            playSound={handleSound}
          />
        );

      // ═══ Levels (L0-L7) ═══
      case 'lesson-L0':
      case 'lesson-L1':
      case 'lesson-L2':
      case 'lesson-L3':
      case 'lesson-L4':
      case 'lesson-L5':
      case 'lesson-L6':
      case 'lesson-L7': {
        const levelId = screen.replace('lesson-', '') as LevelId;
        const isKids = ['L0', 'L1', 'L2', 'L3'].includes(levelId);

        return (
          <LevelScreen
            levelId={levelId}
            onNavigate={(target) => handleNavigate(target as AppScreen)}
            onBack={() => handleBackToCategory(isKids ? 'kids' : 'teens')}
            playSound={handleSound}
          />
        );
      }

      // ═══ Enrichment ═══
      case 'enrichment-1':
      case 'enrichment-2':
        return (
          <EnrichmentScreen
            category={screen === 'enrichment-1' ? 'kids' : 'teens'}
            onBack={() =>
              handleBackToCategory(screen === 'enrichment-1' ? 'kids' : 'teens')
            }
            onOpenModule={() => {
              /* TODO: open enrichment module */
            }}
          />
        );

      // ═══ Coming Soon (سيبني لاحقاً) ═══
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
      case 'placement-test':
      case 'category-exam-1':
      case 'category-exam-2':
        return (
          <ComingSoonScreen
            onBack={handleBackToHero}
            title={getComingSoonTitle(screen)}
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