# PHASE_1_EXECUTION.md — بطاقات Phase 1 (P1-01)

مرتبة حسب الخطر الفعلي على المستخدم (الأخطر أولاً). كل تعديل: فرع ← PR ← CI أخضر ← دمج.

---

## بطاقة 1 — تأكيد وجود `src/lib/supabase.ts`

**التغيير:** لا تغيير. افتح GitHub ← `src/lib/` ← تأكد أن `supabase.ts` موجود. (الأرشيف يحوي فقط `.trashed-…-supabase.ts.txt`، أي نسخة محذوفة من الهاتف؛ والملف مستورد في `cloudSync.ts` و`AuthModal.tsx` و`RoleSelection.tsx` و`useRealtimeDuel.ts`.)
**إن كان موجوداً:** انتهت البطاقة.
**إن كان غائباً:** أنشئ `src/lib/supabase.ts` بمحتوى الملف المحذوف نفسه (3 أسطر: `createClient` + تصدير `supabaseUrl` و`supabaseKey` و`supabase`).
**الاختبار من الهاتف:** نعم (متصفح GitHub فقط)
**Commit message:** `fix(supabase): restore src/lib/supabase.ts` (فقط إن كان غائباً)
**الوقت المتوقع:** 2 دقيقة
**مخاطر:** إن غاب الملف يفشل `tsc` وكل البناء. المفتاح publishable (عام بطبيعته).
**الحالة:** `[x] مغلقة (N/A — الملف موجود في GitHub)`

---

## بطاقة 2 — CI لا يعمل عند الـ push

**التغيير:** لا تغيير كود. `ci-build.yml` يعمل على `pull_request` و`workflow_dispatch` فقط. لذا لا تُحرّر `main` مباشرة. في GitHub Web Editor اختر **Create a new branch + Propose changes**، ثم افتح PR، وانتظر ✅ في تبويب Checks، ثم ادمج. (`deploy.yml` يعمل عند الـ push إلى `main`، فالدمج هو الذي ينشر.)
**الاختبار من الهاتف:** نعم
**Commit message:** — (لا Commit)
**الوقت المتوقع:** 1 دقيقة (مرة واحدة)
**مخاطر:** Commit مباشر على `main` ينشر دون أن يمر بأي اختبار.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 3 — اختبار آلي لقفل المصادقة (C2–C6)

**التغيير:** **أنشئ** ملفاً جديداً `tests/cloudSync.auth.test.ts` بالمحتوى التالي كاملاً (لا تعدّل `src`). البيئة `node` (لا `localStorage`)، لذا نحاكي `appMode` و`supabase` و`navigator`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));

vi.mock('../src/lib/supabase', () => ({
  supabase: { auth: { getSession, signOut: vi.fn(async () => ({ error: null })) } },
}));
vi.mock('../src/utils/appMode', () => ({ getMode: () => 'cloud' }));

async function load() {
  vi.resetModules();
  return (await import('../src/lib/cloudSync')).cloudSync;
}

describe('withAuthLock عبر loginParent', () => {
  beforeEach(() => {
    getSession.mockReset();
    vi.stubGlobal('navigator', {
      locks: { request: (_n: string, cb: () => unknown) => cb() },
    });
  });

  it('C2/C3/C4: عملية ثانية متزامنة ← AUTH_FLOW_BUSY', async () => {
    getSession.mockReturnValue(new Promise(() => {})); // الأولى لا تنتهي
    const sync = await load();
    void sync.loginParent('a@b.c', 'x').catch(() => {});
    await expect(sync.loginParent('a@b.c', 'x')).rejects.toMatchObject({
      code: 'AUTH_FLOW_BUSY',
    });
    expect(getSession).toHaveBeenCalledTimes(1);
  });

  it('C5: لا Web Locks ← AUTH_FLOW_BUSY وبلا اعتماد', async () => {
    vi.stubGlobal('navigator', {});
    const sync = await load();
    await expect(sync.loginParent('a@b.c', 'x')).rejects.toMatchObject({
      code: 'AUTH_FLOW_BUSY',
    });
    expect(getSession).not.toHaveBeenCalled();
  });

  it('C6: فشل الحصول على القفل ← لا متابعة', async () => {
    vi.stubGlobal('navigator', {
      locks: { request: () => Promise.reject(new Error('lock failed')) },
    });
    const sync = await load();
    await expect(sync.loginParent('a@b.c', 'x')).rejects.toThrow('lock failed');
    expect(getSession).not.toHaveBeenCalled();
  });
});
```

**تنبيه للمنفّذ:** الاختبار غير مجرَّب. إن فشل CI فأصلح **الاختبار** فقط، ولا تُعدِّل `cloudSync.ts` لإنجاحه.
**الاختبار من الهاتف:** نعم عبر CI (خطوة `Tests` في `ci-build.yml`)
**Commit message:** `test(auth): cover AUTH_FLOW_BUSY and lock failure paths`
**الوقت المتوقع:** 10 دقائق
**مخاطر:** لا شيء (ملف اختبار جديد فقط). فشله يُسجَّل FAIL ويُفحص، ولا يُخفى.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 4 — تصحيح نص الوثائق (C3/C5 و`adoptionInProgress`)

**التغيير:** تعديل نصوص فقط في `docs/md/هام/`:
- `TEST_PLAN.md`: **استبدل** `| C3 | وجود adoptionInProgress | رفض العملية المتزامنة |` **بـ** `| C3 | عملية اعتماد ثانية أثناء الأولى (authFlowInProgress) | رفضها برمز AUTH_FLOW_BUSY |`
- `TEST_PLAN.md`: **استبدل** نتيجة C5 `عدم حدوث اعتماد متزامن غير آمن` **بـ** `رفض الدخول برمز AUTH_FLOW_BUSY`
- `UNIFIED_REFERENCE.md` §2.1: **احذف** سطر ``- `adoptionInProgress`: …`` وعدّل «ثلاث آليات» إلى «آليتين (`authFlowInProgress` + Web Locks)».
- `UNIFIED_REFERENCE.md` §3.1: **استبدل** ``استخدام `authFlowInProgress` و`adoptionInProgress`.`` **بـ** ``استخدام `authFlowInProgress` مع Web Lock (أُلغي `adoptionInProgress`).``
**الاختبار من الهاتف:** نعم (قراءة)
**Commit message:** `docs(p1): align C3/C5 and drop adoptionInProgress`
**الوقت المتوقع:** 5 دقائق
**مخاطر:** لا شيء
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 5 — حذف مفاتيح التخزين غير المعزولة عند تبديل الحساب (P1-01: Identity Contamination)

**التغيير:** عند `different === true` في `adoptUser`، وعند Reset، تُحذف 5 مفاتيح بلا بادئة وضع تخص الطفل السابق. قائمة واحدة مُصدَّرة من `cloudSync.ts` ويستوردها `GuardianDashboard.tsx`. **حذف لا عزل.** عند `different === false` لا تُمس (LOCAL WINS).

**أرقام الأسطر الفعلية (الأرشيف ٢١ت٢، طابقها مع GitHub):**
- `cloudSync.ts` L221 `const OWNER_KEY = 'soroban_progress_owner';` ← نضيف القائمة تحته.
- L226 `OUR_PREFIX` يطابق المفاتيح الخمسة كلها، وL124–135 (إنشاء Snapshot) وL162–170 (استعادته) يغطيانها ← فشل الاعتماد يُرجعها (Rollback).
- L234 `wipeLocalProgress` يحذف مفاتيح `cloud:` فقط (L243 `startsWith('cloud:')`) ← **لا يمس المفاتيح الخمسة** (هذا هو سبب التلوث).
- L382 `adoptUser`، L386 `const different = !owner || owner !== user.id;`، **L421–426** كتلة الحذف (L421 `if (different) {`، L422 `wipeLocalProgress();`، L424–426 ثلاث `removeItem`).
- `GuardianDashboard.tsx` L20 الاستيراد، L598 `const localProgressKeys = [`، L629 `'soroban_certificates_history',` ثم `];`، L634 حلقة `removeItem`.

### أ) `src/lib/cloudSync.ts`

**كود قديم (L221):**
```ts
const OWNER_KEY = 'soroban_progress_owner';
```
**كود جديد (أبقِ السطر وأضف تحته):**
```ts
const OWNER_KEY = 'soroban_progress_owner';

// مفاتيح بلا بادئة وضع تخص الطفل السابق: تُحذف عند تبديل الحساب وعند Reset
export const UNSCOPED_CHILD_KEYS = [
  'sorobania_progress_v2',
  'sorobania_progress_v1',
  'soroban_friends_weak_v1',
  'sorobanmind-ghost-v1',
  'soroban_companion',
] as const;
```

**كود قديم (L424–426 داخل `if (different) {`):**
```ts
      localStorage.removeItem('soroban_avatar_pending_upload');
      localStorage.removeItem('soroban_hero_key');
      localStorage.removeItem('soroban_child_name');
```
**كود جديد (أبقِ الثلاثة وأضف بعدها، قبل `if (cloudProgress) {`):**
```ts
      for (const k of UNSCOPED_CHILD_KEYS) {
        localStorage.removeItem(k);
        if (localStorage.getItem(k) !== null) {
          throw new CloudSyncError(
            'Failed to clear previous account data',
            'LOCAL_STATE_WIPE_FAILED',
          );
        }
      }
```
(الرمي داخل `try` ← `restoreLocalStateSnapshot` ← خطأ ظاهر بالرمز نفسه. لا تضف شيئاً في فرع `different === false`.)

### ب) `src/screens/GuardianDashboard.tsx`

**كود قديم (L20):**
```ts
import { cloudSync } from '../lib/cloudSync';
```
**كود جديد:**
```ts
import { cloudSync, UNSCOPED_CHILD_KEYS } from '../lib/cloudSync';
```
**كود قديم (L629–630):**
```ts
  'soroban_certificates_history',
];
```
**كود جديد:**
```ts
  'soroban_certificates_history',

  // مفاتيح الطفل غير المعزولة (قائمة موحّدة من cloudSync)
  ...UNSCOPED_CHILD_KEYS,
];
```

### ج) الاختبار — ملف جديد `tests/adoptUser.cleanup.test.ts`

```ts
import { describe, it, expect, vi } from 'vitest';

const { auth } = vi.hoisted(() => ({
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    setSession: vi.fn(async () => ({ error: null })),
    signOut: vi.fn(async () => ({ error: null })),
  },
}));

vi.mock('../src/lib/supabase', () => {
  const chain: any = {};
  chain.select = () => chain;
  chain.eq = () => chain;
  chain.maybeSingle = async () => ({ data: null, error: null });
  return { supabase: { auth, from: () => chain, rpc: async () => ({ error: null }) } };
});
vi.mock('../src/utils/appMode', () => ({ getMode: () => 'cloud' }));

const KEYS = [
  'sorobania_progress_v2', 'sorobania_progress_v1',
  'soroban_friends_weak_v1', 'sorobanmind-ghost-v1', 'soroban_companion',
];

function fakeStorage(initial: Record<string, string>) {
  const m = new Map(Object.entries(initial));
  return {
    get length() { return m.size; },
    key: (i: number) => Array.from(m.keys())[i] ?? null,
    getItem: (k: string) => (m.has(k) ? (m.get(k) as string) : null),
    setItem: (k: string, v: string) => { m.set(k, String(v)); },
    removeItem: (k: string) => { m.delete(k); },
  };
}

const seed = (owner: string) => ({
  soroban_progress_owner: owner,
  soroban_welcome_seen: '1',
  ...Object.fromEntries(KEYS.map((k) => [k, 'x'])),
});

async function loginAs(userId: string, initial: Record<string, string>) {
  const ls = fakeStorage(initial);
  vi.stubGlobal('localStorage', ls);
  vi.stubGlobal('window', { setTimeout: vi.fn(), location: { reload: vi.fn() } });
  vi.stubGlobal('navigator', { locks: { request: (_n: string, cb: () => unknown) => cb() } });
  auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
  auth.signInWithPassword.mockResolvedValue({ data: { user: { id: userId } }, error: null });
  vi.resetModules();
  const { cloudSync } = await import('../src/lib/cloudSync');
  await cloudSync.loginParent('a@b.c', 'x');
  return ls;
}

describe('adoptUser: مفاتيح الطفل غير المعزولة', () => {
  it('different=true ← تُحذف الخمسة وتبقى المفاتيح الأخرى', async () => {
    const ls = await loginAs('B', seed('A'));
    for (const k of KEYS) expect(ls.getItem(k)).toBeNull();
    expect(ls.getItem('soroban_welcome_seen')).toBe('1');
    expect(ls.getItem('soroban_progress_owner')).toBe('B');
  });

  it('different=false ← لا حذف (LOCAL WINS)', async () => {
    const ls = await loginAs('B', seed('B'));
    for (const k of KEYS) expect(ls.getItem(k)).toBe('x');
  });
});
```
**تنبيه للمنفّذ:** الاختبار غير مجرَّب (محاكاة `localStorage` و`window` لأن البيئة `node`). إن فشل CI فأصلح **الاختبار** فقط (المحاكاة)، لا منطق `adoptUser`.

**الاختبار من الهاتف:** جزء `adoptUser` عبر CI (خطوة `Tests`). جزء Reset (واجهة): **لا (BLOCKED)** — يبقى `NOT RUN`، ويُتحقق منه بالمراجعة: الاستيراد + `...UNSCOPED_CHILD_KEYS` فقط.
**Commit message:** `fix(auth): clear unscoped child keys on account switch and reset`
**الوقت المتوقع:** 15 دقيقة
**مخاطر:**
- ⚠️ `different` يكون `true` أيضاً عند `owner === null` (أول دخول على جهاز بلا مالك). حينها يُحذف تقدم ألعاب لعبها الطفل قبل التسجيل. تنفيذ طلبك حرفياً (`different`). **بديل أحمى للبيانات:** غيّر شرط الحلقة إلى `if (owner && owner !== user.id) {` (حساب سابق فعلي فقط). أخبرني إن أردته.
- بعد حذف `soroban_companion` يظهر اختيار الشخصية لهذا الطفل (سلوك `HeroDashboard` الحالي للقيمة الغائبة) — مقبول.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

**بوابة Phase 1 → 2:** بطاقات 1–5 مغلقة؛ `AuthModal.tsx` **دون تغيير**، و`cloudSync.ts` يتغير فقط بالبطاقة 5. C2–C6 وتنظيف المفاتيح (بطاقة 5) تُغلق بنجاح CI؛ بقية C1–C20 (تتطلب حسابات على الهاتف) تبقى **BLOCKED** ولا تُسجَّل PASS.
