// src/components/AppGate.tsx
import React, { useEffect, useState } from 'react';
import { AppModeSelection } from './AppModeSelection';
import { HeroNamePicker } from './HeroNamePicker';
import { getHeroDisplayName } from '@/data/heroNames';
import { getMode, setMode, type AppMode } from '@/utils/appMode';
import { useProgressStore } from '@/store/progressStore';

interface Props {
  children: React.ReactNode;
}

export function AppGate({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [mode, setModeState] = useState<AppMode | null>(null);
  const [hasHero, setHasHero] = useState(false);

  useEffect(() => {
    setModeState(getMode());
    setHasHero(!!localStorage.getItem('soroban_hero_key'));
    setReady(true);
  }, []);

  const handleModeSelect = (m: AppMode) => {
    setMode(m);
    if (m === 'local') {
      window.location.reload();
    } else {
      setModeState('cloud');
    }
  };

  const handleHeroSave = (heroKey: string) => {
    const displayName = getHeroDisplayName(heroKey, 'ar');
    try {
      localStorage.setItem('soroban_hero_key', heroKey);
      localStorage.setItem('soroban_child_name', displayName);
    } catch { /* ignore */ }
    try {
      useProgressStore.getState().setChildName(displayName);
    } catch { /* ignore */ }
    window.location.reload();
  };

  if (!ready) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (!mode) {
    return <AppModeSelection onSelect={handleModeSelect} />;
  }

  if (mode === 'local' && !hasHero) {
    return <HeroNamePicker onSave={handleHeroSave} />;
  }

  return <>{children}</>;
}

export default AppGate;