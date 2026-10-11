// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/highScoreStore.ts — ملف جديد
// ═══════════════════════════════════════════════════════════════════
//
// ما يضيفه:
//   - تخزين السجلات القياسية لكل لعبة (localStorage)
//   - تنظيف تلقائي في أول كل شهر ميلادي
//   - أعلى 3 سجلات لكل لعبة
//   - تصفير كلي أو لكل لعبة
//
// لا يلمس أي ملف موجود.
// ═══════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'soroban_high_scores_v1';
const MONTH_KEY = 'soroban_high_scores_month';
const MAX_RECORDS_PER_GAME = 3;

// ═══ الأنواع ═══
export interface HighScoreEntry {
  name: string;
  value: number;
  date: number;
  heroId?: string;
}

type HighScoresMap = Record<string, HighScoreEntry[]>;

// ═══ 🆕 أدوات الشهر ═══
function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// ═══ قراءة/كتابة ═══
function readAll(): HighScoresMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed as HighScoresMap;
  } catch {
    return {};
  }
}

function writeAll(map: HighScoresMap): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    // 🆕 سجّل الشهر الحالي بعد الكتابة
    localStorage.setItem(MONTH_KEY, getCurrentMonthKey());
  } catch {
    /* ignore */
  }
}

// ═══ 🆕 التنظيف الشهري ═══
/**
 * يتحقق إن كان الشهر قد تغيّر منذ آخر زيارة.
 * إذا نعم → يمسح كل السجلات تلقائياً.
 */
function checkMonthlyReset(): void {
  if (typeof window === 'undefined') return;
  try {
    const savedMonth = localStorage.getItem(MONTH_KEY);
    const currentMonth = getCurrentMonthKey();

    if (savedMonth !== currentMonth) {
      // شهر جديد → صفّر السجلات
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(MONTH_KEY, currentMonth);
    }
  } catch {
    /* ignore */
  }
}

// ═══ قراءة السجلات ═══
export function getTopScores(
  gameId: string,
  count = MAX_RECORDS_PER_GAME,
): HighScoreEntry[] {
  checkMonthlyReset();       // 🆕 فحص الشهر أولاً
  const all = readAll();
  const entries = all[gameId] ?? [];
  return entries.slice(0, count);
}

export function getHighScore(gameId: string): HighScoreEntry | null {
  const top = getTopScores(gameId, 1);
  return top[0] ?? null;
}

export function hasAnyRecord(gameId: string): boolean {
  return getHighScore(gameId) !== null;
}

// ═══ كتابة سجل جديد ═══
export interface AddScoreResult {
  isNewRecord: boolean;
  previousTop: HighScoreEntry | null;
}

export function addScore(
  gameId: string,
  name: string,
  value: number,
  heroId?: string,
): AddScoreResult {
  checkMonthlyReset();       // 🆕 فحص الشهر أولاً

  const previousTop = getHighScore(gameId);

  if (value <= 0) {
    return { isNewRecord: false, previousTop };
  }

  const isRecord = !previousTop || value > previousTop.value;

  if (!isRecord) {
    return { isNewRecord: false, previousTop };
  }

  const all = readAll();
  const entries = all[gameId] ?? [];

  const newEntry: HighScoreEntry = {
    name: name.trim() || 'بطل',
    value,
    date: Date.now(),
    heroId,
  };

  // أضف · رتّب تنازلياً · احتفظ بأعلى 3
  const updated = [newEntry, ...entries]
    .sort((a, b) => b.value - a.value)
    .slice(0, MAX_RECORDS_PER_GAME);

  all[gameId] = updated;
  writeAll(all);

  return { isNewRecord: true, previousTop };
}

// ═══ التصفير اليدوي ═══
export function resetAll(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(MONTH_KEY, getCurrentMonthKey());
  } catch {
    /* ignore */
  }
}

export function resetGame(gameId: string): void {
  const all = readAll();
  delete all[gameId];
  writeAll(all);
}

// ═══ أدوات ═══
export function formatRecordAge(timestamp: number): string {
  const days = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
  if (days === 0) return 'اليوم';
  if (days === 1) return 'أمس';
  if (days < 7) return `منذ ${days} أيام`;
  if (days < 30) return `منذ ${Math.floor(days / 7)} أسابيع`;
  return `منذ ${Math.floor(days / 30)} أشهر`;
}

// 🆕
export function getCurrentMonthLabel(): string {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}