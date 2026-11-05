// src/utils/leaderboard.ts
// سجل الأبطال المحلي — المفتاح: sorobanmind-leaderboard-v1
export const LEADERBOARD_KEY = 'sorobanmind-leaderboard-v1';

export interface LeaderRecord {
  id: string;
  name: string;      // الاسم الكامل (يُقنَّع عند العرض فقط عبر maskName)
  examId: string;    // exam_10_7 | exam_6 ...
  score: number;
  timeSec: number;   // الزمن المستغرق بالثواني
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

export function examLabel(examId: string, isAr: boolean): string {
  const l = EXAM_LABELS[examId];
  return l ? (isAr ? l.ar : l.en) : examId;
}

export function getRecords(): LeaderRecord[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((r) => r && typeof r.name === 'string' && typeof r.timeSec === 'number') : [];
  } catch {
    return [];
  }
}

export function addRecord(r: Omit<LeaderRecord, 'id' | 'at'>): void {
  try {
    const all = getRecords();
    
    // نبحث عن سجل سابق لنفس اللاعب في نفس الامتحان
    const existingIndex = all.findIndex(item => item.name === r.name && item.examId === r.examId);
    
    const newRecord = { 
      ...r, 
      id: existingIndex !== -1 ? all[existingIndex].id : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, 
      at: Date.now() 
    };

    if (existingIndex !== -1) {
      const existing = all[existingIndex];
      // نقوم بتحديث السجل فقط إذا كانت الدرجة الجديدة أعلى، أو نفس الدرجة بوقت أسرع
      if (newRecord.score > existing.score || (newRecord.score === existing.score && newRecord.timeSec < existing.timeSec)) {
        all[existingIndex] = newRecord;
      }
    } else {
      all.push(newRecord);
    }

    // ترتيب السجلات: الدرجة الأعلى أولاً، ثم الوقت الأسرع
    all.sort((a, b) => b.score - a.score || a.timeSec - b.timeSec);
    
    // نحفظ أفضل 200 سجل فقط
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