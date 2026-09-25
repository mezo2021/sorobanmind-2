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
import PlacementTestScreen from './screens/PlacementTestScreen';
import PracticeScreen from './screens/PracticeScreen';
import AnzanScreen from './screens/AnzanScreen';
import AudioAnzanScreen from './screens/AudioAnzanScreen';

// ═══ Debug ═══
import { DebugOverlay } from './components/DebugOverlay';

// ═══ Types ═══
type AppScreen = V1Screen | 'loading';

// ═══ Constants ═══
const WELCOME_STORAGE_KEY = 'soroban_welcome_seen';
const WELCOME_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

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

// ═══ Coming Soon ═══
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

function getComingSoonTitle(screen: string): string {
  const titles: Record<string, string> = {
    quests: 'المغامرات',
    soroban: 'السوروبان التفاعلي',
    multiplication: 'درس الضرب',
    secrets: 'الأسرار السحرية',
    'cross-multiplication': 'الضرب التقاطعي',
    division: 'القسمة',
    certificate: 'الشهادة',
    'final-exam': 'الامتحان النهائي',
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
  const { burst: _burst } = useConfetti();

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

  // ═══ Placement Test Handler ═══
const handlePlacementComplete = (
  recommendedLevel: string,
  weakSkills: string[],
) => {
  try {
    const LEVEL_ORDER = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
    const recommendedIdx = LEVEL_ORDER.indexOf(recommendedLevel);

    // ✅ 1. المستويات السابقة → مكتملة (A)
    const previousLevels = recommendedIdx > 0
      ? LEVEL_ORDER.slice(0, recommendedIdx)
      : [];

    // ✅ 2. إضافة recommendedLevel أيضاً (C — يُفتح كـ "ابدأ")
    const newCompletedLevels = [...previousLevels];

    localStorage.setItem(
      'soroban_completed_levels',
      JSON.stringify(newCompletedLevels),
    );

    // ✅ 3. حفظ المهارات الضعيفة (C)
    localStorage.setItem(
      'soroban_placement_weak_skills',
      JSON.stringify(weakSkills),
    );

    // ✅ 4. حفظ المستوى المُوصى به
    localStorage.setItem(
      'soroban_placement_recommended',
      recommendedLevel,
    );

    // ✅ 5. حفظ النتيجة كاملة
    localStorage.setItem(
      'soroban_placement_result',
      JSON.stringify({
        recommendedLevel,
        weakSkills,
        date: Date.now(),
      }),
    );

    // ✅ 6. حفظ آخر محاولة
    localStorage.setItem(
      'soroban_placement_last_attempt',
      String(Date.now()),
    );
  } catch { /* ignore */ }

  const isKids = ['L0', 'L1', 'L2', 'L3'].includes(recommendedLevel);
  setScreen(isKids ? 'category-kids' : 'category-teens');
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

      // ═══ Placement Test ═══
      case 'placement-test':
        return (
          <PlacementTestScreen
            onBack={handleBackToHero}
            onComplete={handlePlacementComplete}
            playSound={handleSound}
          />
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
              /* TODO */
            }}
          />
        );

      // ═══ Practice (0-7) ═══
      case 'practice-0':
      case 'practice-1':
      case 'practice-2':
      case 'practice-3':
      case 'practice-4':
      case 'practice-5':
      case 'practice-6':
      case 'practice-7': {
        const practiceNum = parseInt(screen.replace('practice-', ''), 10);

        return (
          <PracticeScreen
            levelNum={practiceNum}
            onBack={() =>
              handleBackToCategory(practiceNum <= 3 ? 'kids' : 'teens')
            }
            onComplete={(passed, _score) => {
              if (passed) {
                try {
                  const raw = localStorage.getItem('soroban_passed_practice');
                  const arr = raw ? JSON.parse(raw) : [];
                  if (!arr.includes(practiceNum)) {
                    arr.push(practiceNum);
                    localStorage.setItem(
                      'soroban_passed_practice',
                      JSON.stringify(arr),
                    );
                  }
                } catch { /* ignore */ }
              }
            }}
            playSound={handleSound}
            onXP={(amount) => console.log('XP:', amount)}
            burst={_burst}
          />
        );
      }

      // ═══ Anzan بصري (0-7) ═══
      case 'anzan-0':
      case 'anzan-1':
      case 'anzan-2':
      case 'anzan-3':
      case 'anzan-4':
      case 'anzan-5':
      case 'anzan-6':
      case 'anzan-7': {
        const anzanNum = parseInt(screen.replace('anzan-', ''), 10);

        return (
          <AnzanScreen
            levelNum={anzanNum}
            onBack={() =>
              handleBackToCategory(anzanNum <= 3 ? 'kids' : 'teens')
            }
            playSound={handleSound}
            onXP={(amount) => console.log('XP:', amount)}
            burst={_burst}
          />
        );
      }

      // ═══ Anzan سمعي (0-7) ═══
      case 'audio-anzan-0':
      case 'audio-anzan-1':
      case 'audio-anzan-2':
      case 'audio-anzan-3':
      case 'audio-anzan-4':
      case 'audio-anzan-5':
      case 'audio-anzan-6':
      case 'audio-anzan-7': {
        const anzanNum = parseInt(screen.replace('audio-anzan-', ''), 10);

        return (
          <AudioAnzanScreen
            levelNum={anzanNum}
            onBack={() =>
              handleBackToCategory(anzanNum <= 3 ? 'kids' : 'teens')
            }
            playSound={handleSound}
            onXP={(amount) => console.log('XP:', amount)}
            burst={_burst}
          />
        );
      }

      // ═══ Coming Soon ═══
      case 'quests':
      case 'soroban':
      case 'multiplication':
      case 'secrets':
      case 'cross-multiplication':
      case 'division':
      case 'certificate':
      case 'final-exam':
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

      {import.meta.env.DEV && <DebugOverlay />}
    </>
  );
}