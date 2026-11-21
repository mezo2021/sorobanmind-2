# PHASE_2_EXECUTION.md — بطاقات Phase 2

مرتبة حسب الخطر الفعلي على المستخدم. كل تعديل: فرع ← PR ← CI أخضر ← دمج. الأكواد مقترحة غير مجرَّبة: عند فشل CI يُصلَح السبب فقط ولا يُوسَّع النطاق. مجمّد: `App.tsx`، `utils/storage.ts`، `progressStore.ts`، `srb-adapter.ts`، SQL. بعد بطاقة E1 (Phase 1) يصير سطر استيراد `GuardianDashboard` L20 هو `import { cloudSync, UNSCOPED_CHILD_KEYS } from '../lib/cloudSync';`.

---

## بطاقة 1 — تشغيل CI عند الـ push إلى main (E2)

**التغيير:** `.github/workflows/ci-build.yml` L2–4.
**كود قديم:**
```yaml
on:
  pull_request:
  workflow_dispatch:
```
**كود جديد:**
```yaml
on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:
```
**الاختبار من الهاتف:** نعم (تبويب Actions)
**Commit message:** `ci: run CI build on push to main`
**الوقت المتوقع:** 2 دقيقة
**مخاطر:** `deploy.yml` يعمل عند الـ push أيضاً ولا ينتظر CI؛ فالـ CI هنا إنذار لا حاجز.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 2 — P2-04: جلسات الدروس (حالة درس تُحفظ تحت درس آخر)

**الملف:** `src/screens/LessonScreen.tsx`
**الخطر المثبت:** تأثير الاستعادة (L314–352) وتأثير الحفظ (L369–381) يعملان في نفس الدورة عند تغيّر `lessonId`، و`sessionLoaded` يبقى `true` ← تُكتب حالة الدرس السابق تحت معرّف الدرس الجديد. والمفاتيح بلا وضع (Local/Cloud يختلطان).

**1) استيراد — أضف بعد L36 `import { useProgressStore } …`:**
```ts
import { getMode } from '@/utils/appMode';
```
**2) L141–160 — استبدل الدوال الثلاث (القديمة تستخدم `LESSON_SESSION_PREFIX + lessonId` مباشرة) بـ:**
```ts
function sessionKey(lessonId: string): string | null {
  const mode = getMode();
  return mode ? `${mode}:${LESSON_SESSION_PREFIX}${lessonId}` : null;
}

function loadSession(lessonId: string): SessionData {
  try {
    const key = sessionKey(lessonId);
    if (!key) return {};
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSession(lessonId: string, data: SessionData): void {
  try {
    const key = sessionKey(lessonId);
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
}

function clearSession(lessonId: string): void {
  try {
    const key = sessionKey(lessonId);
    if (!key) return;
    localStorage.removeItem(key);
  } catch { /* ignore */ }
}
```
**3) أضف بعد L295 `const [sessionLoaded, setSessionLoaded] = useState(false);`:**
```ts
  const [loadedLessonId, setLoadedLessonId] = useState<string | null>(null);
```
**4) L346 — بعد `setSessionLoaded(true);` أضف:**
```ts
    setLoadedLessonId(lessonId);
```
**5) L371 و L380 (تأثير الحفظ):**
قديم: `if (!sessionLoaded || !lesson) return;` ← جديد: `if (!sessionLoaded || !lesson || loadedLessonId !== lessonId) return;`
قديم: `[lessonId, solved, attempts, activeModuleId, tryIdx, tab, exampleIdx, sessionLoaded]` ← جديد: `[lessonId, solved, attempts, activeModuleId, tryIdx, tab, exampleIdx, sessionLoaded, loadedLessonId]`

**أبقِ دون تغيير:** تأثير L397، استدعاءات `clearSession` عند الإكمال (L429، L772)، `SessionData`، منطق `completedLessons`. لا Migration للمفاتيح القديمة (تُترك وتُتجاهل). لا Web Locks. `lessonId` من النوع `string` فلا حاجة لمعالجة `null`.
**الاختبار من الهاتف:** لا (BLOCKED) — مكوّن React وبيئة CI `node`. يُراجع بالـ diff + CI أخضر. `NOT RUN` لـ C41–C60.
**Commit message:** `fix(lesson): isolate lesson sessions by mode and guard lessonId`
**الوقت المتوقع:** 15 دقيقة
**مخاطر:** منخفض؛ جلسات الدروس القديمة تُهمل (مقبول في التصميم).
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 3 — P2-07: الاستعادة من السحابة تدمج ولا تستبدل

**الملفان:** `src/lib/cloudSync.ts` + `src/screens/GuardianDashboard.tsx` (Commit واحد؛ مترابطان).
**الخطر المثبت:** `loadFromCloud` (L706–~763) يدمج سطحياً، و`{}` لا يعيد الحالة إلى الافتراضي. و`handleCloudLoad` (L314) بلا تأكيد ولا Snapshot ولا قفل نقر. وزر الاستعادة مكرر (L951–955 خارج شرط Cloud).

### أ) `cloudSync.ts`
**1) صدّر الـ Snapshot (قرار معتمد بالتنفيذ هنا):** أضف `export` قبل `interface LocalStateSnapshot` و`function createLocalStateSnapshot` و`function restoreLocalStateSnapshot` (L109–190).
**2) استبدل جسم `async loadFromCloud() { … },` كاملاً (L706 حتى `},` السابق لـ `async setMyAvatar` L765) بـ:**
```ts
  async loadFromCloud() {
    requireCloudMode();

    const user = await this.getCurrentUser();
    if (!user) throw new CloudSyncError('Must be logged in', 'AUTH_REQUIRED');

    const { data, error } = await supabase
      .from('soroban_progress')
      .select('progress_data')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw new CloudSyncError('Failed to fetch cloud progress', 'PROGRESS_FETCH_FAILED');

    const pd = data?.progress_data as unknown;
    // لا صف أو null أو غير كائن ← رفض قبل أي تغيير. {} صالح.
    if (!pd || typeof pd !== 'object' || Array.isArray(pd)) {
      throw new CloudSyncError('No valid cloud backup found', 'PROGRESS_FETCH_FAILED');
    }

    const { data: profile, error: profileError } = await supabase
      .from('public_profiles')
      .select('avatar_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (profileError) throw new CloudSyncError('Failed to fetch account profile', 'PROFILE_FETCH_FAILED');

    const { childName: _c, parentName: _p, ...safePd } = pd as Record<string, unknown>;

    useProgressStore.getState().reset();   // استبدال كامل لا دمج
    useProgressStore.setState(safePd);

    if (profile?.avatar_id) localStorage.setItem('soroban_hero_key', profile.avatar_id);
    applyLocalIdentity();
    return true;
  },
```
**أبقِ:** `pullProgress`، `adoptUser`، `saveToCloud`. لا Rollback داخل الدالة.

### ب) `GuardianDashboard.tsx`
**1) L20:** أضف إلى الاستيراد `createLocalStateSnapshot, restoreLocalStateSnapshot, type LocalStateSnapshot`:
```ts
import { cloudSync, UNSCOPED_CHILD_KEYS, createLocalStateSnapshot, restoreLocalStateSnapshot, type LocalStateSnapshot } from '../lib/cloudSync';
```
**2) L314–324 — استبدل `handleCloudLoad` (القديم: `try { await cloudSync.loadFromCloud(); … } catch (e) { setCloudMsg({ text: e.message … }) }`) بـ:**
```ts
  const restoringRef = useRef(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleCloudLoad = async () => {
    if (restoringRef.current) return;
    const confirmed = window.confirm(pickLang({
      ar: 'سيتم استبدال تقدمك المحلي ببيانات السحابة. هل تريد المتابعة؟',
      en: 'Your local progress will be replaced by cloud data. Continue?',
    }, lang));
    if (!confirmed) return;

    restoringRef.current = true;
    setIsRestoring(true);
    let snapshot: LocalStateSnapshot | null = null;
    try {
      snapshot = createLocalStateSnapshot();
      await cloudSync.loadFromCloud();
      setCloudMsg({ text: pickLang({ ar: 'تم الاستعادة ☁️ جاري التحديث...', en: 'Restored ☁️ Reloading...' }, lang), type: 'success' });
      setTimeout(() => window.location.reload(), 1200);
    } catch (e: any) {
      let rollbackFailed = false;
      if (snapshot) {
        try { restoreLocalStateSnapshot(snapshot); } catch { rollbackFailed = true; }
      }
      setCloudMsg({
        text: rollbackFailed
          ? pickLang({ ar: 'فشلت الاستعادة وتعذّر التراجع؛ حالة البيانات غير مؤكدة. حاول مجدداً.', en: 'Restore failed and rollback failed; data state is uncertain. Try again.' }, lang)
          : (e?.message ?? 'Restore failed'),
        type: 'error',
      });
      setTimeout(() => setCloudMsg(null), 3000);
    } finally {
      restoringRef.current = false;
      setIsRestoring(false);
    }
  };
```
**3)** الزر داخل شرط Cloud (~L944): أضف `disabled={isRestoring}` إلى `<button … onClick={handleCloudLoad}`.
**4) احذف** الكتلة المكررة الواقعة بعد إغلاق الشرط `)}` (L951–955):
```tsx
        <button type="button" onClick={handleCloudLoad}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-100 text-xs font-body">
          <Cloud className="w-4 h-4" />
          <span>{pickLang({ ar: 'استعادة من السحابة', en: 'Load from Cloud' }, lang)}</span>
        </button>
```
(تحقق أن النسخة داخل شرط Cloud باقية.) **أبقِ:** `handleRestore`، `handleReset`.
**الاختبار من الهاتف:** لا (BLOCKED) — يحتاج حساب اختبار وسحابة. `NOT RUN` لـ C82–C99؛ CI يتحقق من الأنواع فقط.
**Commit message:** `fix(restore): replace instead of merge in loadFromCloud with confirm and rollback`
**الوقت المتوقع:** 25 دقيقة
**مخاطر:** متوسط — الاستعادة تستبدل التقدم المحلي (بتأكيد ونقطة رجوع). جرّب بحساب اختبار فقط.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 4 — P2-03: `srb_progress` يتسرب بين الحسابات

**الملف:** `src/data/srb/progress.ts` (و`tests/srbProgress.test.ts` جديد). **`main.tsx` لا يُلمس.**
**الخطر المثبت:** `STORAGE_KEY = "srb_progress"` (L35) بلا بادئة وضع؛ يُقرأ L130 ويُكتب L252/L263 ويُحذف L272، ولا يمسحه `wipeLocalProgress`.

**1) L35 — قديم:** `const STORAGE_KEY = "srb_progress";` **← جديد:**
```ts
import { getMode } from "../../utils/appMode";

const OLD_KEY = "srb_progress";
const MIGRATED_FLAG = "soroban_srb_migrated";

let migrationDone = false; // يُخزَّن النجاح فقط؛ الفشل يُعاد تقييمه

function migrateOnce(): "ok" | "blocked" | "conflict" | "corrupted" | "mode-unavailable" {
  if (migrationDone) return "ok";
  if (!getMode()) return "mode-unavailable";
  try {
    if (localStorage.getItem(MIGRATED_FLAG) === "1") { migrationDone = true; return "ok"; }
    const raw = localStorage.getItem(OLD_KEY);
    if (raw === null) {
      localStorage.setItem(MIGRATED_FLAG, "1");
      if (localStorage.getItem(MIGRATED_FLAG) !== "1") return "blocked";
      migrationDone = true; return "ok";
    }
    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch { return "corrupted"; }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return "corrupted";
    const destKey = `local:${OLD_KEY}`;
    const dest = localStorage.getItem(destKey);
    if (dest !== null && dest !== raw) return "conflict"; // لا دمج ولا استبدال
    if (dest === null) {
      localStorage.setItem(destKey, raw);
      if (localStorage.getItem(destKey) !== raw) return "blocked";
    }
    localStorage.setItem(MIGRATED_FLAG, "1");             // العلم بعد التحقق فقط
    if (localStorage.getItem(MIGRATED_FLAG) !== "1") return "blocked";
    migrationDone = true; return "ok";                    // المفتاح القديم يبقى
  } catch { return "blocked"; }
}

function activeKey(): string | null {
  const mode = getMode();
  return mode && migrateOnce() === "ok" ? `${mode}:${OLD_KEY}` : null;
}
```
**2) L130 — قديم:** `const raw = localStorage.getItem(STORAGE_KEY);` **← جديد:**
```ts
    const key = activeKey();
    // فشل الترحيل: قراءة القديم للقراءة فقط؛ الوضع null: لا شيء
    const raw = key ? localStorage.getItem(key)
      : getMode() ? localStorage.getItem(OLD_KEY) : null;
```
**3) L252 و L263 — قديم:** `localStorage.setItem(STORAGE_KEY, JSON.stringify(all));` **← جديد (في الموضعين):**
```ts
    const key = activeKey();
    if (!key) return; // لا كتابة أثناء فشل الترحيل أو الوضع null
    localStorage.setItem(key, JSON.stringify(all));
```
**4) L272 — قديم:** `localStorage.removeItem(STORAGE_KEY);` **← جديد:**
```ts
    const key = activeKey();
    if (key) localStorage.removeItem(key);
```
**5)** تأكد `grep STORAGE_KEY` في الملف = صفر. لا تحذف `srb_progress` القديم. أبقِ ما بعد L286.

**الاختبار — ملف جديد `tests/srbProgress.test.ts`:**
```ts
import { describe, it, expect, vi } from 'vitest';

const mode = vi.hoisted(() => ({ value: 'cloud' as 'local' | 'cloud' | null }));
vi.mock('../src/utils/appMode', () => ({ getMode: () => mode.value }));

function fakeStorage(initial: Record<string, string>, failOn?: string) {
  const m = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (m.has(k) ? (m.get(k) as string) : null),
    setItem: (k: string, v: string) => { if (k === failOn) throw new Error('quota'); m.set(k, String(v)); },
    removeItem: (k: string) => { m.delete(k); },
  };
}
async function load(ls: ReturnType<typeof fakeStorage>) {
  vi.stubGlobal('localStorage', ls);
  vi.resetModules();
  return import('../src/data/srb/progress');
}
const OLD = JSON.stringify({});

describe('srb_progress migration', () => {
  it('C23/C32/C38: ينسخ إلى local ويبقي القديم، وCloud يبدأ فارغاً', async () => {
    mode.value = 'cloud';
    const ls = fakeStorage({ srb_progress: OLD });
    const { loadAllProgress } = await load(ls);
    expect(loadAllProgress()).toEqual({});
    expect(ls.getItem('local:srb_progress')).toBe(OLD);
    expect(ls.getItem('soroban_srb_migrated')).toBe('1');
    expect(ls.getItem('srb_progress')).toBe(OLD);
  });
  it('C26/C34: فشل الكتابة ← لا علم ويبقى المصدر', async () => {
    mode.value = 'local';
    const ls = fakeStorage({ srb_progress: OLD }, 'local:srb_progress');
    const { loadAllProgress } = await load(ls);
    loadAllProgress();
    expect(ls.getItem('soroban_srb_migrated')).toBeNull();
    expect(ls.getItem('srb_progress')).toBe(OLD);
  });
  it('C33: الوضع غير معروف ← لا كتابة', async () => {
    mode.value = null;
    const ls = fakeStorage({ srb_progress: OLD });
    const { loadAllProgress } = await load(ls);
    expect(loadAllProgress()).toEqual({});
    expect(ls.getItem('local:srb_progress')).toBeNull();
  });
});
```
(غير مجرَّب؛ عند الفشل أصلح الاختبار/الأنواع فقط.)
**الاختبار من الهاتف:** نعم عبر CI (3 اختبارات). بقية C21–C40 `NOT RUN`.
**Commit message:** `fix(srb): isolate srb_progress per mode with safe migration`
**الوقت المتوقع:** 20 دقيقة
**مخاطر:** منخفض-متوسط؛ المفتاح القديم يبقى دائماً (التراجع آمن).
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 5 — P2-05: أفضل نتائج لعبة الأسرار

**الملف:** `src/screens/MagicSecretsScreen.tsx`
**الخطر المثبت:** `BEST_SCORES_KEY` (L239) بلا وضع؛ القراءة L259–261 والحفظ L266–273 يعتمد على `bestScores` القديمة (قد يكتب فوق أفضل نتيجة).

**1)** أضف للاستيرادات: `import { getMode } from '@/utils/appMode';`
**2)** أضف بعد `const MAX_ATTEMPTS = 2;` (خارج المكوّن):
```ts
const MIGRATED_FLAG = 'soroban_secrets_best_scores_migrated';
const LOCK_NAME = 'soroban-secrets-best-scores';

function scoresKey(): string | null {
  const m = getMode();
  return m ? `${m}:${BEST_SCORES_KEY}` : null;
}

function sanitizeScores(raw: unknown): Record<number, number> | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const ids = new Set(SECRETS.map((s) => s.id));
  const out: Record<number, number> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const id = Number(k);
    if (!ids.has(id) || typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > QUESTIONS_PER_EXAM) continue;
    out[id] = v;
  }
  return out;
}

function readScores(key: string): Record<number, number> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? sanitizeScores(JSON.parse(raw)) ?? {} : {};
  } catch { return {}; }
}

function withScoresLock<T>(fn: () => T): Promise<T> | null {
  if (typeof navigator === 'undefined' || !navigator.locks) return null;
  return navigator.locks.request(LOCK_NAME, async () => fn());
}

function migrateSecrets(): 'migrated' | 'empty' | 'skipped' | 'failed' {
  try {
    if (localStorage.getItem(MIGRATED_FLAG) === '1') return 'skipped';
    const oldRaw = localStorage.getItem(BEST_SCORES_KEY);
    if (oldRaw === null) { localStorage.setItem(MIGRATED_FLAG, '1'); return 'empty'; }
    const old = sanitizeScores(JSON.parse(oldRaw));
    if (!old) return 'failed';
    const localKey = `local:${BEST_SCORES_KEY}`;
    const curRaw = localStorage.getItem(localKey);
    const cur = curRaw ? sanitizeScores(JSON.parse(curRaw)) : {};
    if (!cur) return 'failed';
    const merged: Record<number, number> = { ...cur };
    for (const [k, v] of Object.entries(old)) merged[+k] = Math.max(merged[+k] ?? 0, v);
    const json = JSON.stringify(merged);
    localStorage.setItem(localKey, json);
    if (localStorage.getItem(localKey) !== json) return 'failed';
    localStorage.setItem(MIGRATED_FLAG, '1');
    return Object.keys(old).length ? 'migrated' : 'empty';
  } catch { return 'failed'; }
}
```
**3)** أضف حالة: `const [migratedMsg, setMigratedMsg] = useState(false);`
**4) L259–261 — قديم:**
```ts
  useEffect(() => {
    try { const raw = localStorage.getItem(BEST_SCORES_KEY); if (raw) setBestScores(JSON.parse(raw)); } catch {}
  }, []);
```
**جديد:**
```ts
  useEffect(() => {
    const key = scoresKey();
    if (!key) return; // الوضع غير معروف: ذاكرة فقط
    const p = withScoresLock(() => ({ status: migrateSecrets(), scores: readScores(key) }));
    if (!p) { setBestScores(readScores(key)); return; } // بلا Web Locks: قراءة فقط، لا ترحيل
    let alive = true;
    p.then(({ status, scores }) => {
      if (!alive) return;
      setBestScores(scores);
      if (status === 'migrated') setMigratedMsg(true);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
```
**5) L266–273 — استبدل `saveBestScore` بـ:**
```ts
  const saveBestScore = (secretId: number, score: number) => {
    if (score <= (bestScores[secretId] || 0)) return;
    setBestScores((prev) => ({ ...prev, [secretId]: Math.max(prev[secretId] ?? 0, score) }));
    const key = scoresKey();
    if (!key) return;
    withScoresLock(() => {
      try {
        const stored = readScores(key);
        stored[secretId] = Math.max(stored[secretId] ?? 0, score);
        localStorage.setItem(key, JSON.stringify(stored));
      } catch { /* يبقى بالذاكرة */ }
    })?.catch(() => {});
  };
```
**6)** رسالة الترحيل (مرة واحدة): أول عنصر في الـ JSX الجذري: `{migratedMsg && (<div className="…">{pickLang({ ar: 'تم نقل أفضل نتائجك القديمة إلى هذا الجهاز ✅', en: 'Your previous best scores were moved to this device ✅' }, lang)}</div>)}` — **الموضع يُحدَّد بعد فتح الملف**.
**أبقِ:** `SECRETS`، `QUESTIONS_PER_EXAM`، `doneSecrets`. **ممنوع:** Supabase، `userId`، `progress_data`.
**الاختبار من الهاتف:** لا (BLOCKED) — مكوّن React. `NOT RUN` لـ C61–C81.
**Commit message:** `fix(secrets): isolate best scores per mode with locked migration`
**الوقت المتوقع:** 25 دقيقة
**مخاطر:** منخفض؛ بلا Web Locks لا تُحفظ النتيجة في التخزين (تبقى بالذاكرة) وفق التصميم.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

**بوابة Phase 2 → 3:** بطاقات 1–5 مغلقة، CI أخضر بعد كل Commit، لا فقدان بيانات محلية. اختبارات الواجهة (C41–C99 الواجهية) تبقى **BLOCKED/NOT RUN** ولا تُسجَّل PASS.
