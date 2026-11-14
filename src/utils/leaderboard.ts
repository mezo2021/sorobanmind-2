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

// دالة مساعدة لفلترة الراسبين (النجاح 400 في الكيو، 80 في الباقي)
export function isExamPassed(examId: string, score: number): boolean {
  if (examId.startsWith('exam_')) return score >= 400;
  if (examId.startsWith('level_')) return score >= 80;
  if (examId.startsWith('cat_')) return score >= 80;
  return true; // افتراضي
}

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

// تم تحديث الأشباح لتتطابق تماماً مع HallOfFamePage
const GHOST_SEEDS = [
  // exam_10_7
  { id: 101, examId: 'exam_10_7', score: 480, timeSec: 540 },
  { id: 102, examId: 'exam_10_7', score: 460, timeSec: 600 },
  { id: 103, examId: 'exam_10_7', score: 440, timeSec: 630 },
  { id: 104, examId: 'exam_10_7', score: 420, timeSec: 660 },
  { id: 105, examId: 'exam_10_7', score: 405, timeSec: 690 },
  // exam_6
  { id: 201, examId: 'exam_6', score: 480, timeSec: 540 },
  { id: 202, examId: 'exam_6', score: 460, timeSec: 600 },
  { id: 203, examId: 'exam_6', score: 440, timeSec: 630 },
  { id: 204, examId: 'exam_6', score: 420, timeSec: 660 },
  { id: 205, examId: 'exam_6', score: 405, timeSec: 690 },
  // exam_5
  { id: 301, examId: 'exam_5', score: 480, timeSec: 540 },
  { id: 302, examId: 'exam_5', score: 460, timeSec: 600 },
  { id: 303, examId: 'exam_5', score: 440, timeSec: 630 },
  { id: 304, examId: 'exam_5', score: 420, timeSec: 660 },
  { id: 305, examId: 'exam_5', score: 405, timeSec: 690 },
  // exam_4
  { id: 401, examId: 'exam_4', score: 480, timeSec: 540 },
  { id: 402, examId: 'exam_4', score: 460, timeSec: 600 },
  { id: 403, examId: 'exam_4', score: 440, timeSec: 630 },
  { id: 404, examId: 'exam_4', score: 420, timeSec: 660 },
  { id: 405, examId: 'exam_4', score: 405, timeSec: 690 },
  // exam_3
  { id: 501, examId: 'exam_3', score: 480, timeSec: 540 },
  { id: 502, examId: 'exam_3', score: 460, timeSec: 600 },
  { id: 503, examId: 'exam_3', score: 440, timeSec: 630 },
  { id: 504, examId: 'exam_3', score: 420, timeSec: 660 },
  { id: 505, examId: 'exam_3', score: 405, timeSec: 690 },
  // exam_2
  { id: 601, examId: 'exam_2', score: 480, timeSec: 540 },
  { id: 602, examId: 'exam_2', score: 460, timeSec: 600 },
  { id: 603, examId: 'exam_2', score: 440, timeSec: 630 },
  { id: 604, examId: 'exam_2', score: 420, timeSec: 660 },
  { id: 605, examId: 'exam_2', score: 405, timeSec: 690 },
  // exam_1
  { id: 701, examId: 'exam_1', score: 480, timeSec: 540 },
  { id: 702, examId: 'exam_1', score: 460, timeSec: 600 },
  { id: 703, examId: 'exam_1', score: 440, timeSec: 630 },
  { id: 704, examId: 'exam_1', score: 420, timeSec: 660 },
  { id: 705, examId: 'exam_1', score: 405, timeSec: 690 },
];

const GHOST_RECORDS: LeaderRecord[] = GHOST_SEEDS.map((ghost, index) => {
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