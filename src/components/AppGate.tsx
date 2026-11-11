// src/components/AppGate.tsx
import React, { useEffect, useState } from 'react';
import { AppModeSelection } from './AppModeSelection';
import { HeroNamePicker } from './HeroNamePicker';
import { resolveDisplayName } from '@/utils/resolveDisplayName';
import { getMode, setMode, type AppMode } from '@/utils/appMode';
import { useProgressStore } from '@/store/progressStore';

interface Props { children: React.ReactNode; }

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
    window.location.reload();
  };

  const handleHeroSave = (heroKey: string) => {
    const displayName = resolveDisplayName(heroKey);

    if (!displayName) {
      console.warn('Unknown hero key:', heroKey);
      return;
    }

    try {
      localStorage.setItem('soroban_hero_key', heroKey);
      localStorage.setItem('soroban_child_name', displayName);
    } catch {
      return;
    }

    try {
      useProgressStore.getState().setChildName(displayName);
    } catch {
      // ignore
    }

    window.location.reload();
  };

  if (!ready) return <div className="min-h-screen bg-slate-950" />;
  if (!mode) return <AppModeSelection onSelect={handleModeSelect} />;

  if (!hasHero) {
    return <HeroNamePicker onSave={handleHeroSave} />;
  }

  return <>{children}</>;
}

export default AppGate;