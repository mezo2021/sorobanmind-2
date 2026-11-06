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

// 🆕 الأبطال الافتراضيون (Ghosts)
// أسماء ثلاثية لكي يعمل عليها قناع maskName، وأزمنة ودرجات متفاوتة لتحفيز الطفل
const GHOST_RECORDS: LeaderRecord[] = [
  // امتحان 10-7 كيو
  { id: 'ghost-101', name: 'سارة أحمد علي', examId: 'exam_10_7', score: 500, timeSec: 250, at: Date.now() },
  { id: 'ghost-102', name: 'عمر خالد محمود', examId: 'exam_10_7', score: 490, timeSec: 280, at: Date.now() },
  { id: 'ghost-103', name: 'ليان سامر يوسف', examId: 'exam_10_7', score: 480, timeSec: 310, at: Date.now() },
  { id: 'ghost-104', name: 'يوسف ماهر حسن', examId: 'exam_10_7', score: 470, timeSec: 340, at: Date.now() },
  { id: 'ghost-105', name: 'نور وائل كريم', examId: 'exam_10_7', score: 450, timeSec: 390, at: Date.now() },
  
  // امتحان 6 كيو
  { id: 'ghost-201', name: 'آدم طارق فؤاد', examId: 'exam_6', score: 480, timeSec: 400, at: Date.now() },
  { id: 'ghost-202', name: 'مريم حسن سعيد', examId: 'exam_6', score: 460, timeSec: 450, at: Date.now() },
  { id: 'ghost-203', name: 'زياد عمر فاروق', examId: 'exam_6', score: 430, timeSec: 500, at: Date.now() },
  
  // امتحان 5 كيو
  { id: 'ghost-301', name: 'جنى محمد رامي', examId: 'exam_5', score: 490, timeSec: 420, at: Date.now() },
  { id: 'ghost-302', name: 'علي سامي ناصر', examId: 'exam_5', score: 450, timeSec: 480, at: Date.now() },
  
  // باقي الامتحانات
  { id: 'ghost-401', name: 'حمزة وليد أيمن', examId: 'exam_4', score: 470, timeSec: 460, at: Date.now() },
  { id: 'ghost-501', name: 'لمى فادي جمال', examId: 'exam_3', score: 480, timeSec: 440, at: Date.now() },
  { id: 'ghost-601', name: 'كرم رامي عصام', examId: 'exam_2', score: 460, timeSec: 500, at: Date.now() },
  { id: 'ghost-701', name: 'تالا مازن سليم', examId: 'exam_1', score: 490, timeSec: 550, at: Date.now() },
];

export function examLabel(examId: string, isAr: boolean): string {
  const l = EXAM_LABELS[examId];
  return l ? (isAr ? l.ar : l.en) : examId;
}

// دالة داخلية لجلب السجلات الحقيقية فقط من المتصفح
function getLocalRecords(): LeaderRecord[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((r) => r && typeof r.name === 'string' && typeof r.timeSec === 'number') : [];
  } catch {
    return [];
  }
}

// الدالة العامة التي تُرجع السجلات الحقيقية + الأشباح
export function getRecords(): LeaderRecord[] {
  return [...getLocalRecords(), ...GHOST_RECORDS];
}

export function addRecord(r: Omit<LeaderRecord, 'id' | 'at'>): void {
  try {
    // 🆕 نستخدم getLocalRecords هنا لكي لا نحفظ الأشباح في ذاكرة المتصفح ونكررها
    const all = getLocalRecords();
    
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

    // ترتيب السجلات الحقيقية: الدرجة الأعلى أولاً، ثم الوقت الأسرع
    all.sort((a, b) => b.score - a.score || a.timeSec - b.timeSec);
    
    // نحفظ أفضل 200 سجل حقيقي فقط
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