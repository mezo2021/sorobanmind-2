// src/components/AppGate.tsx
import React, { useEffect, useState } from 'react';
import { AppModeSelection } from './AppModeSelection';
import { HeroNamePicker } from './HeroNamePicker';
import { resolveDisplayName } from '@/utils/resolveDisplayName';
import { getMode, setMode, type AppMode } from '@/utils/appMode';
import { useProgressStore } from '@/store/progressStore';
import { useT } from '@/i18n/useTranslation';
import { cloudSync } from '@/lib/cloudSync';
import { supabase } from '@/lib/supabase';

interface Props { children: React.ReactNode; }

export function AppGate({ children }: Props) {
  const { lang } = useT();
  const [ready, setReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [mode, setModeState] = useState<AppMode | null>(null);
  const [hasHero, setHasHero] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const m = getMode();
    const heroExists = !!localStorage.getItem('soroban_hero_key');

    setModeState(m);
    setHasHero(heroExists);
    setReady(true);

    if (m !== 'cloud' || heroExists) {
      setCheckingSession(false);
      return;
    }

    (async () => {
      try {
        const session = await cloudSync.getSession();
        if (!session) return;

        if (!cancelled) setSignedIn(true);

        const { data: profile, error } = await supabase
          .from('public_profiles')
          .select('avatar_id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) return;

        if (profile?.avatar_id) {
          localStorage.setItem('soroban_hero_key', profile.avatar_id);
          // getSession() يستدعي applyLocalIdentity() داخلياً:
          // يكتب الاسم في localStorage والـ store
          await cloudSync.getSession();
          if (!cancelled) setHasHero(true);
        }
      } catch {
        // خطأ شبكة: نعتبره غير مسجل
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleModeSelect = (m: AppMode) => {
    setMode(m);
    window.location.reload();
  };

  const handleHeroSave = (heroKey: string) => {
    const displayName = resolveDisplayName(heroKey, lang);

    if (!displayName) {
      console.warn('Unknown hero key:', heroKey);
      return;
    }

    try {
      localStorage.setItem('soroban_hero_key', heroKey);
      localStorage.setItem('soroban_avatar_pending_upload', '1');
      localStorage.setItem('soroban_child_name', displayName);
    } catch {
      return;
    }

    try {
      useProgressStore.getState().setChildName(displayName);
    } catch {
      // ignore
    }

    if (signedIn) {
      void cloudSync
        .setMyAvatar(heroKey)
        .then((ok) => {
          if (ok) localStorage.removeItem('soroban_avatar_pending_upload');
        })
        .catch(() => {
          /* ignore */
        })
        .finally(() => window.location.reload());
      return;
    }

    window.location.reload();
  };

  if (!ready || checkingSession) return <div className="min-h-screen bg-slate-950" />;
  if (!mode) return <AppModeSelection onSelect={handleModeSelect} />;

  if (!hasHero) {
    return <HeroNamePicker onSave={handleHeroSave} />;
  }

  return <>{children}</>;
}

export default AppGate;