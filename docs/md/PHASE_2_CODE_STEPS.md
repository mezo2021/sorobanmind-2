# PHASE_2_CODE_STEPS.md — ورقة عمل الكود: عزل البيانات واستقرار التقدم

> يُقرأ مع `PHASE_2_EXECUTION.md`. الترتيب: **P2-03 ← P2-04 ← P2-05 ← P2-07**، Commit لكل بند، `npm run build` بعده.
> الأكواد **مقترحة غير مجرَّبة** (لا بناء في بيئتي): راجعها ضد GitHub وأصلح أي خطأ `tsc` قبل الـ Commit.
> مجمّد: `App.tsx`، `utils/storage.ts`، `progressStore.ts`، `srb-adapter.ts`، SQL. لا حذف لبيانات المستخدمين.

---

## P2-03 — `src/data/srb/progress.ts` ← **تعديل كود مطلوب**

**مطابقة GitHub:** `const STORAGE_KEY = "srb_progress";` (L35) وأن `STORAGE_KEY` يُستخدم في 4 مواضع فقط (L130، L252، L263، L272). نفّذ `grep srb_progress src` ← لا قارئ خارج هذا الملف.
**`main.tsx`: أبقِه دون تغيير** (الـ ErrorBoundary الحالي يلتقط أخطاء render؛ لا تعدّله إلا بموافقتك بعد إثبات حاجة).

1. **استبدل** السطر `const STORAGE_KEY = "srb_progress";` **بـ**:
```ts
import { getMode } from "../../utils/appMode";

const OLD_KEY = "srb_progress";
const MIGRATED_FLAG = "soroban_srb_migrated";
export type SrbMigrationStatus =
  | "ok" | "blocked" | "conflict" | "corrupted" | "mode-unavailable";

let migrationDone = false; // نخزّن النجاح فقط؛ الفشل يُعاد تقييمه (C30)

function migrateOnce(): SrbMigrationStatus {
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
    localStorage.setItem(MIGRATED_FLAG, "1");           // العلم بعد التحقق فقط
    if (localStorage.getItem(MIGRATED_FLAG) !== "1") return "blocked";
    migrationDone = true; return "ok";                  // المفتاح القديم يبقى (لا حذف)
  } catch { return "blocked"; }
}

/** مفتاح الوضع الحالي، أو null إن لم يكتمل الترحيل/الوضع غير معروف */
function activeKey(): string | null {
  const mode = getMode();
  return mode && migrateOnce() === "ok" ? `${mode}:${OLD_KEY}` : null;
}
```
2. **في `loadAllProgress`** **استبدل** `const raw = localStorage.getItem(STORAGE_KEY);` **بـ**:
```ts
    const key = activeKey();
    // فشل الترحيل (غير ok): قراءة القديم للقراءة فقط؛ الوضع null: لا شيء
    const raw = key ? localStorage.getItem(key)
      : getMode() ? localStorage.getItem(OLD_KEY) : null;
```
3. **في `saveLevelGrade`** **استبدل** `localStorage.setItem(STORAGE_KEY, JSON.stringify(all));` **بـ**:
```ts
    const key = activeKey();
    if (!key) return; // لا كتابة أثناء فشل الترحيل أو الوضع null
    localStorage.setItem(key, JSON.stringify(all));
```
4. **في `clearLevelProgress`**: نفس الاستبدال في السطر `localStorage.setItem(STORAGE_KEY, JSON.stringify(all));`.
5. **في `clearAllProgress`** **استبدل** `localStorage.removeItem(STORAGE_KEY);` **بـ**:
```ts
    const key = activeKey();
    if (key) localStorage.removeItem(key);
```
6. **أبقِ دون تغيير:** كل ما بعد `clearAllProgress` (L286+) وتوقيعات التصدير. **لا تحذف** `srb_progress` القديم.
7. بعد الاستبدالات لا يبقى استخدام لـ`STORAGE_KEY` (تحقق: `grep STORAGE_KEY` في الملف ← صفر) وإلا خطأ `noUnusedLocals`/مرجع مفقود.

**ملاحظة سلوك:** `wipeLocalProgress` (cloudSync) يحذف `cloud:*` المطابق `^(srb…)` فيشمل `cloud:srb_progress` تلقائياً ✔.

---

## P2-04 — `src/screens/LessonScreen.tsx` ← **تعديل كود مطلوب**

**مطابقة GitHub:** `LESSON_SESSION_PREFIX` (L46)، `loadSession/saveSession/clearSession` (L141–160)، تأثير الاستعادة `[lessonId]` (L314–352)، تأثير الحفظ (L370–381)، `sessionLoaded` (L295). `lessonId` من النوع `string` (غير null) ← بند «`lessonId===null`» غير قابل للحدوث هنا؛ لا تضف معالجته.

1. **أضف** تحت `import { useProgressStore } from '@/store/progressStore';` (L36): `import { getMode } from '@/utils/appMode';`
2. **استبدل** الدوال الثلاث (L141–160) **بـ**:
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
  } catch { return {}; }
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
3. **أضف** بعد `const [sessionLoaded, setSessionLoaded] = useState(false);` (L295):
`const [loadedLessonId, setLoadedLessonId] = useState<string | null>(null);`
4. **في تأثير الاستعادة** **أضف** سطراً مباشرة بعد `setSessionLoaded(true);`: `setLoadedLessonId(lessonId);`
5. **في تأثير الحفظ** **استبدل** `if (!sessionLoaded || !lesson) return;` **بـ** `if (!sessionLoaded || !lesson || loadedLessonId !== lessonId) return;` **واستبدل** مصفوفة التبعيات بـ:
`[lessonId, solved, attempts, activeModuleId, tryIdx, tab, exampleIdx, sessionLoaded, loadedLessonId]`
6. **أبقِ دون تغيير:** منطق الدرس المكتمل (`completedLessons` + `setSolved`)، استدعاءات `clearSession` عند الإكمال (L429، L772)، التأثير L397، `SessionData` (لا `completed`).
7. **لا تُضِف:** Web Locks، Versioning، Migration للمفاتيح القديمة (تبقى وتُتجاهل).

**السبب المثبت:** بدون الخطوات 3–5 يعمل الحفظ في نفس دورة تغيّر `lessonId` بحالة الدرس السابق ويكتبها تحت المعرف الجديد.

---

## P2-05 — `src/screens/MagicSecretsScreen.tsx` ← **تعديل كود مطلوب**

**مطابقة GitHub:** `QUESTIONS_PER_EXAM = 7` (L32)، `SECRETS` (L117)، `BEST_SCORES_KEY` (L239)، حالة `bestScores` (L254)، تأثير القراءة (L259–261)، `saveBestScore` (L266–273).
1. **أضف** للاستيرادات: `import { getMode } from '@/utils/appMode';`
2. **أضف** بعد `const MAX_ATTEMPTS = 2;` (خارج المكوّن):
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
  if (typeof navigator === 'undefined' || !navigator.locks) return null; // لا ترحيل/كتابة بلا قفل
  return navigator.locks.request(LOCK_NAME, async () => fn());
}

type MigrationResult = 'migrated' | 'empty' | 'skipped' | 'failed';
function migrateSecrets(): MigrationResult {
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
    localStorage.setItem(MIGRATED_FLAG, '1');            // بعد التحقق فقط
    return Object.keys(old).length ? 'migrated' : 'empty'; // المفتاح القديم يبقى
  } catch { return 'failed'; }
}
```
3. **أضف** حالة: `const [migratedMsg, setMigratedMsg] = useState(false);`
4. **استبدل** تأثير القراءة (L259–261) **بـ**:
```ts
  useEffect(() => {
    const key = scoresKey();
    if (!key) return; // mode === null: ذاكرة فقط، لا قراءة ولا ترحيل
    const p = withScoresLock(() => {
      const status = migrateSecrets();
      return { status, scores: readScores(key) };
    });
    if (!p) { setBestScores(readScores(key)); return; } // بلا Web Locks: قراءة فقط
    let alive = true;
    p.then(({ status, scores }) => {
      if (!alive) return;
      setBestScores(scores);
      if (status === 'migrated') setMigratedMsg(true);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
```
5. **استبدل** `saveBestScore` (L266–273) **بـ**:
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
6. **رسالة الترحيل (مرة واحدة):** أضف داخل الـ JSX عنصراً شرطياً `{migratedMsg && (<div …>{pickLang({ ar: 'تم نقل أفضل نتائجك القديمة إلى هذا الجهاز ✅', en: 'Your previous best scores were moved to this device ✅' }, lang)}</div>)}` — **الموضع يحتاج تحديداً** (أول عنصر داخل الحاوية الجذرية لـ`return` الرئيسي) بعد فتح الملف؛ لا تضف مؤشر تحميل.
7. **أبقِ دون تغيير:** `SECRETS`، `QUESTIONS_PER_EXAM`، `doneSecrets`، بقية الشاشة.
8. **ممنوع:** Supabase، `userId`، `progress_data`، `extractPureState`، Versioning.

---

## P2-07 — `src/lib/cloudSync.ts` + `src/screens/GuardianDashboard.tsx` ← **تعديل كود مطلوب**

### أ) `cloudSync.ts`
**مطابقة GitHub:** `async loadFromCloud()` (L706). Snapshot موجود ويحتاج تصديراً.
1. **⚠️ قرار معلّق (موافقتك):** تصدير الدالتين. **استبدل** `interface LocalStateSnapshot {` بـ `export interface LocalStateSnapshot {`، و`function createLocalStateSnapshot()` بـ `export function createLocalStateSnapshot()`، و`function restoreLocalStateSnapshot(` بـ `export function restoreLocalStateSnapshot(`. (الـ Snapshot الحالي أوسع من المواصفة: كل مفاتيح `OUR_PREFIX` + Zustand — أكثر أماناً.)
2. **استبدل** جسم `loadFromCloud` بالكامل **بـ**:
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
3. **أبقِ دون تغيير:** `pullProgress`، `adoptUser`، `saveToCloud`. لا Rollback داخل الدالة.

### ب) `GuardianDashboard.tsx`
**مطابقة GitHub:** `import { cloudSync } from '../lib/cloudSync';` (L20)؛ `useRef` مستورد (L8)؛ `handleCloudLoad` (L314).
1. **عدّل** سطر L20 **إلى:** `import { cloudSync, createLocalStateSnapshot, restoreLocalStateSnapshot, type LocalStateSnapshot } from '../lib/cloudSync';`
2. **استبدل** `handleCloudLoad` **بـ**:
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
          ? pickLang({ ar: 'فشلت الاستعادة وتعذّر التراجع؛ حالة البيانات غير مؤكدة. لا تُغلق التطبيق وحاول مجدداً.', en: 'Restore failed and rollback failed; data state is uncertain. Try again.' }, lang)
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
3. **زر Cloud المحمي (داخل الشرط، ~L944):** **أضف** الخاصية `disabled={isRestoring}` إلى `<button … onClick={handleCloudLoad}`.
4. **احذف** الكتلة المكررة الواقعة **بعد** إغلاق الشرط `)}` (~L951–955):
```tsx
        <button type="button" onClick={handleCloudLoad}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-100 text-xs font-body">
          <Cloud className="w-4 h-4" />
          <span>{pickLang({ ar: 'استعادة من السحابة', en: 'Load from Cloud' }, lang)}</span>
        </button>
```
   (**تحقق** أن المحذوف هو النسخة الخارجة عن شرط Cloud، وأن النسخة داخل الشرط باقية.)
5. **أبقِ دون تغيير:** `handleRestore` (JSON)، `handleReset`، `handleBackup`.

---

## ⚠️ قرارات معلّقة
1. تصدير Snapshot من `cloudSync.ts` (P2-07 أ-1).
2. `main.tsx` لا يُلمس في P2-03 ما لم يثبت أن خطأ SRB لا يلتقطه الـ ErrorBoundary.
3. موضع رسالة الترحيل في P2-05.
4. توحيد ترقيم الاختبارات (المعتمد جداول `TEST_PLAN.md`).
5. بلا Web Locks لا يُحفظ أفضل رقم في التخزين (يبقى بالذاكرة) — وفق المواصفة؛ قل إن أردت خلاف ذلك.

## Commit
`P2-03: isolate srb_progress per mode` ← `P2-04: isolate lesson sessions` ← `P2-05: isolate secrets best scores` ← `P2-07: replace shallow merge in loadFromCloud`. كل واحد: build ثم اختبارات `TEST_PLAN.md`. التراجع `git revert` فقط (المفاتيح القديمة باقية). كل الاختبارات `NOT RUN` حتى تُنفَّذ.
