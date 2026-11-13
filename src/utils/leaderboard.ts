// src/utils/leaderboard.ts
export const LEADERBOARD_KEY = 'sorobanmind-leaderboard-v1';

export interface LeaderRecord {
  id: string;
  name: string;
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

const GHOST_RECORDS: LeaderRecord[] = [
  { id: 'ghost-101', name: 'سارة أحمد علي', examId: 'exam_10_7', score: 500, timeSec: 250, at: Date.now() },
  { id: 'ghost-102', name: 'عمر خالد محمود', examId: 'exam_10_7', score: 490, timeSec: 280, at: Date.now() },
  { id: 'ghost-103', name: 'ليان سامر يوسف', examId: 'exam_10_7', score: 480, timeSec: 310, at: Date.now() },
  { id: 'ghost-104', name: 'يوسف ماهر حسن', examId: 'exam_10_7', score: 470, timeSec: 340, at: Date.now() },
  { id: 'ghost-105', name: 'نور وائل كريم', examId: 'exam_10_7', score: 450, timeSec: 390, at: Date.now() },
  { id: 'ghost-201', name: 'آدم طارق فؤاد', examId: 'exam_6', score: 480, timeSec: 400, at: Date.now() },
  { id: 'ghost-202', name: 'مريم حسن سعيد', examId: 'exam_6', score: 460, timeSec: 450, at: Date.now() },
  { id: 'ghost-203', name: 'زياد عمر فاروق', examId: 'exam_6', score: 430, timeSec: 500, at: Date.now() },
  { id: 'ghost-301', name: 'جنى محمد رامي', examId: 'exam_5', score: 490, timeSec: 420, at: Date.now() },
  { id: 'ghost-302', name: 'علي سامي ناصر', examId: 'exam_5', score: 450, timeSec: 480, at: Date.now() },
  { id: 'ghost-401', name: 'حمزة وليد أيمن', examId: 'exam_4', score: 470, timeSec: 460, at: Date.now() },
  { id: 'ghost-501', name: 'لمى فادي جمال', examId: 'exam_3', score: 480, timeSec: 440, at: Date.now() },
  { id: 'ghost-601', name: 'كرم رامي عصام', examId: 'exam_2', score: 460, timeSec: 500, at: Date.now() },
  { id: 'ghost-701', name: 'تالا مازن سليم', examId: 'exam_1', score: 490, timeSec: 550, at: Date.now() },
];

export function examLabel(examId: string, isAr: boolean): string {
  const l = EXAM_LABELS[examId];
  return l ? (isAr ? l.ar : l.en) : examId;
}

const LEGACY_CLEANUP_KEY = 'sorobanmind-leaderboard-v1-cleaned';

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
    return Array.isArray(arr) ? arr.filter((r) => r && typeof r.name === 'string' && typeof r.timeSec === 'number') : [];
  } catch {
    return [];
  }
}

export function getRecords(): LeaderRecord[] {
  return [...getLocalRecords(), ...GHOST_RECORDS];
}

export function addRecord(r: Omit<LeaderRecord, 'id' | 'at'>): void {
  try {
    const all = getLocalRecords();
    const existingIndex = all.findIndex(item => item.name === r.name && item.examId === r.examId);
    
    const newRecord = { 
      ...r, 
      id: existingIndex !== -1 ? all[existingIndex].id : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, 
      at: Date.now() 
    };

    if (existingIndex !== -1) {
      const existing = all[existingIndex];
      if (newRecord.score > existing.score || (newRecord.score === existing.score && newRecord.timeSec < existing.timeSec)) {
        all[existingIndex] = newRecord;
      }
    } else {
      all.push(newRecord);
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