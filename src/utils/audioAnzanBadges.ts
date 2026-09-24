// src/utils/audioAnzanBadges.ts — شارات الأنزان السماعي

export const AUDIO_ANZAN_BADGES_KEY = 'soroban_anzan_audio_badges';

export interface AudioAnzanBadges {
  master_addition_audio?: boolean;
  master_multiplication_audio?: boolean;
  master_division_audio?: boolean;
}

export function loadAudioAnzanBadges(): AudioAnzanBadges {
  try {
    const raw = localStorage.getItem(AUDIO_ANZAN_BADGES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAudioAnzanBadges(badges: AudioAnzanBadges): void {
  try {
    localStorage.setItem(AUDIO_ANZAN_BADGES_KEY, JSON.stringify(badges));
  } catch { /* ignore */ }
}

export function hasAudioAnzanBadge(badge: keyof AudioAnzanBadges): boolean {
  return !!loadAudioAnzanBadges()[badge];
}