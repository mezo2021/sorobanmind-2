// src/utils/ghostCode.ts
// "كود الشبح": تسجيل جولة منفردة (الأسئلة + الأزمنة + النقاط) كنص قابل للمشاركة. يُتحقق منه بصرامة عند الاستيراد.
export const GHOST_PREFIX = 'SG1-';
export const GHOST_Q_SECONDS = 15;

export interface GhostData {
  v: 1;
  n: string;          // اسم صاحب الشبح (مقنَّع)
  q: number[][];      // أرقام كل سؤال
  t: number[];        // زمن كل سؤال بالمللي ثانية
  g: number[];        // نقاط كل سؤال
}

export const ghostScore = (d: GhostData) => d.g.reduce((a, b) => a + b, 0);
export const ghostTotalSec = (d: GhostData) => d.t.reduce((a, b) => a + b, 0) / 1000;

export function encodeGhost(d: GhostData): string {
  const json = JSON.stringify(d);
  const b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return GHOST_PREFIX + b64;
}

const isInt = (x: unknown, lo: number, hi: number) => typeof x === 'number' && Number.isInteger(x) && x >= lo && x <= hi;

export function decodeGhost(code: string): GhostData | null {
  try {
    const raw = code.trim();
    if (!raw.startsWith(GHOST_PREFIX) || raw.length > 4000) return null;
    const b64 = raw.slice(GHOST_PREFIX.length).replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))));
    const d = JSON.parse(json) as GhostData;
    if (d.v !== 1 || typeof d.n !== 'string' || d.n.length > 40) return null;
    const n = d.q?.length;
    if (!isInt(n, 1, 10) || d.t?.length !== n || d.g?.length !== n) return null;
    if (!d.q.every((row) => Array.isArray(row) && row.length >= 2 && row.length <= 6 && row.every((x) => isInt(x, 0, 999)))) return null;
    if (!d.t.every((x) => isInt(x, 0, GHOST_Q_SECONDS * 1000))) return null;
    if (!d.g.every((x) => isInt(x, 0, 150))) return null;
    return d;
  } catch {
    return null;
  }
}
