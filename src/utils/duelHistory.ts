// src/utils/duelHistory.ts
// سجل مباريات الأونلاين المحلي: sorobanmind-duels-v1 (آخر 20 مباراة). لا يلمس progressStore ولا لوحة الامتحانات.
import { isPreviewMode } from '@/utils/previewMode';

export const DUELS_KEY = 'sorobanmind-duels-v1';
const MAX = 20;

export interface DuelMatch {
  id: string;
  mode: 'live' | 'blitz' | 'ghost';
  myScore: number;
  opponentScore: number;
  result: 'win' | 'lose' | 'draw';
  durationSec: number;
  at: number;
  training?: boolean; // مباريات الشبح تدريب: لا تُحتسب في فزت/خسرت
}

interface Store { matches: DuelMatch[] }

function read(): Store {
  try {
    const raw = JSON.parse(localStorage.getItem(DUELS_KEY) || 'null');
    return raw && Array.isArray(raw.matches) ? raw : { matches: [] };
  } catch {
    return { matches: [] };
  }
}

export function getMatches(): DuelMatch[] {
  return read().matches;
}

export function addMatch(m: Omit<DuelMatch, 'id' | 'at' | 'training'>): void {
  if (isPreviewMode()) return;
  try {
    const s = read();
    s.matches.push({ ...m, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now(), training: m.mode === 'ghost' });
    localStorage.setItem(DUELS_KEY, JSON.stringify({ matches: s.matches.slice(-MAX) }));
  } catch { /* ignore */ }
}

export function getStats(): { win: number; lose: number; draw: number } {
  const counted = getMatches().filter((m) => !m.training);
  return {
    win: counted.filter((m) => m.result === 'win').length,
    lose: counted.filter((m) => m.result === 'lose').length,
    draw: counted.filter((m) => m.result === 'draw').length,
  };
}
