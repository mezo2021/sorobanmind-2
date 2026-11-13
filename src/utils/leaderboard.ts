// src/utils/leaderboard.ts
import { AVATARS } from '@/data/avatars';

export const LEADERBOARD_KEY = 'sorobanmind-leaderboard-v1';
const LOCAL_PLAYER_ID_KEY = 'soroban_local_player_id';
const LEGACY_CLEANUP_KEY = 'sorobanmind-leaderboard-v1-cleaned';

export interface LeaderRecord {
  id: string;
  playerId: string;
  name?: string;
  avatar_id?: string | null;
  sequential_number?: number | null;
  examId: string;
  score: number;
  timeSec: number;
  at: number;
}

export const EXAM_LABELS: Record<string, { ar: string; en: string }> = {
  exam_10_7: { ar: '10-7 كيو', en: '10-7 Kyu' },
  exam_6: { ar: '6 كيو', en: '6 Kyu' },
  exam_5: { ar: '5 كيو', en: '5 Kyu' },
  exam_4: { ar: '4 كيو', en: '4 Kyu' },
  exam_3: { ar: '3 كيو', en: '3 Kyu' },
  exam_2: { ar: '2 كيو', en: '2 Kyu' },
  exam_1: { ar: '1 كيو', en: '1 Kyu' },
};

export function getLocalPlayerId(): string {
  const existing = localStorage.getItem(LOCAL_PLAYER_ID_KEY);
  if (existing) return existing;

  const newId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.floor(Math.random() * 16);
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });

  localStorage.setItem(LOCAL_PLAYER_ID_KEY, newId);
  return newId;
}

const GHOST_SEEDS = [
  { id: 101, examId: 'exam_10_7', score: 500, timeSec: 250 },
  { id: 102, examId: 'exam_10_7', score: 490, timeSec: 280 },
  { id: 103, examId: 'exam_10_7', score: 480, timeSec: 310 },
  { id: 104, examId: 'exam_10_7', score: 470, timeSec: 340 },
  { id: 105, examId: 'exam_10_7', score: 450, timeSec: 390 },
  { id: 201, examId: 'exam_6', score: 480, timeSec: 400 },
  { id: 202, examId: 'exam_6', score: 460, timeSec: 450 },
  { id: 203, examId: 'exam_6', score: 430, timeSec: 500 },
  { id: 301, examId: 'exam_5', score: 490, timeSec: 420 },
  { id: 302, examId: 'exam_5', score: 450, timeSec: 480 },
  { id: 401, examId: 'exam_4', score: 470, timeSec: 460 },
  { id: 501, examId: 'exam_3', score: 480, timeSec: 440 },
  { id: 601, examId: 'exam_2', score: 460, timeSec: 500 },
  { id: 701, examId: 'exam_1', score: 490, timeSec: 550 },
];

const GHOST_RECORDS: LeaderRecord[] = GHOST_SEEDS.map((ghost, index) => {
  // حماية صغيرة في حال كانت المصفوفة فارغة
  const avatar = AVATARS.length > 0 ? AVATARS[index % AVATARS.length] : null;

  return {
    id: `ghost-${ghost.id}`,
    playerId: `ghost-${ghost.id}`,
    name: undefined,
    avatar_id: avatar?.id ?? null,
    sequential_number: 9000 + index,
    examId: ghost.examId,
    score: ghost.score,
    timeSec: ghost.timeSec,
    at: 0,
  };
});

export function examLabel(examId: string, isAr: boolean): string {
  const l = EXAM_LABELS[examId];
  return l ? (isAr ? l.ar : l.en) : examId;
}

function cleanupLegacyLeaderboard(): void {
  if (typeof localStorage === 'undefined') return;
  if (localStorage.getItem(LEGACY_CLEANUP_KEY) === '1') return;
  localStorage.removeItem(LEADERBOARD_KEY);
  localStorage.setItem(LEGACY_CLEANUP_KEY, '1');
}

function getLocalRecords(): LeaderRecord[] {
  cleanupLegacyLeaderboard();
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr)
      ? arr.filter(
          (r) =>
            r &&
            typeof r.playerId === 'string' &&
            typeof r.examId === 'string' &&
            typeof r.score === 'number' &&
            typeof r.timeSec === 'number'
        )
      : [];
  } catch {
    return [];
  }
}

export function getRecords(): LeaderRecord[] {
  return [...getLocalRecords(), ...GHOST_RECORDS];
}

export function addRecord(
  r: Omit<LeaderRecord, 'id' | 'at' | 'playerId'>
): void {
  try {
    const playerId = getLocalPlayerId();
    const all = getLocalRecords();

    const existingIndex = all.findIndex(
      (item) => item.playerId === playerId && item.examId === r.examId
    );

    const now = Date.now();

    if (existingIndex !== -1) {
      const existing = all[existingIndex];
      const isBetter =
        r.score > existing.score ||
        (r.score === existing.score && r.timeSec < existing.timeSec);

      all[existingIndex] = {
        ...existing,
        ...r,
        playerId,
        id: existing.id,
        score: isBetter ? r.score : existing.score,
        timeSec: isBetter ? r.timeSec : existing.timeSec,
        at: now,
      };
    } else {
      all.push({
        ...r,
        playerId,
        id: `local-${playerId}-${r.examId}`,
        at: now,
      });
    }

    all.sort((a, b) => b.score - a.score || a.timeSec - b.timeSec);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(all.slice(0, 200)));
  } catch { /* ignore */ }
}

export function clearLeaderboard(): void {
  localStorage.removeItem(LEADERBOARD_KEY);
}

export function fastest(records: LeaderRecord[], n = 10): LeaderRecord[] {
  return [...records].sort((a, b) => a.timeSec - b.timeSec).slice(0, n);
}

export function fmtTime(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}