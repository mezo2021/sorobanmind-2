# PHASE_1_CODE_STEPS.md — ورقة عمل الكود: P1-01

> يُقرأ مع `PHASE_1_EXECUTION.md`. مبني على الأرشيف؛ **كل موضع يُطابَق مع GitHub قبل التنفيذ**.
> **النتيجة العامة: لا تعديل كود إنتاجي مطلوب في Phase 1.** المطلوب تحققات + تصحيح وثائق + (اختياري) اختبار آلي.
> مجمّد: `App.tsx`، `utils/storage.ts`، SQL.

## الخطوة 1 — مطابقة (بلا تعديل) — الملف: `src/lib/cloudSync.ts`

افتحه في GitHub وتأكد من وجود كل ما يلي (استخدم Search داخل الملف):

| ابحث عن | المتوقع |
|---|---|
| `const AUTH_LOCK_NAME = 'soroban-auth-adoption'` | موجود |
| `let authFlowInProgress = false;` + `async function withAuthLock` | موجود |
| `function wipeLocalProgress` ثم داخله `throw new Error(\`Failed to remove key` | موجود (A-7-2) |
| `async function retryPendingAvatar` ثم `await withAuthLock(` | موجود |
| `localStorage.setItem(OWNER_KEY, user.id);` | داخل `try` في `adoptUser`، **آخر خطوة** |
| `ignoreDuplicates: true` | داخل `verifyOtp` |
| `adoptionInProgress` | **لا نتائج** (هذا هو الصحيح) |
| `adoptUser(` | `cloudSync.ts` فقط (3 مواضع: تعريف + `verifyOtp` + `loginParent`) |

إن اختلف أي بند ← **توقف** وأبلغ؛ لا تنفذ.

## الخطوة 2 — الأكواد: **أبقِ كل شيء دون تغيير**

| البند | الملف/الدالة | الإجراء |
|---|---|---|
| قفل المصادقة | `withAuthLock` | **أبقِ** |
| الاعتماد | `adoptUser` (Snapshot ← تطبيق ← `OWNER_KEY` آخراً ← Rollback) | **أبقِ** |
| `wipeLocalProgress` | يرمي `LOCAL_STATE_WIPE_FAILED` | **أبقِ** |
| `retryPendingAvatar` | تحقق المالك قبل/بعد RPC | **أبقِ** |
| `loginParent/verifyOtp` | حفظ/استعادة الجلسة | **أبقِ** |
| `AuthModal.tsx` | 10 رسائل + `resolveAuthErrorMessage` | **أبقِ** |
| `adoptionInProgress` | غير موجود | **لا تُضِفه** (حسم موثق: `TS2304` سابقاً؛ يغطيه `authFlowInProgress` + Web Lock) |

## الخطوة 3 — تصحيح وثائق (تعديل نصوص فقط)

**`TEST_PLAN.md`** — في جدول Phase 1:
- **استبدل** `| C3 | وجود adoptionInProgress | رفض العملية المتزامنة |`
- **بـ** `| C3 | استدعاء ثانٍ لعملية اعتماد/دخول أثناء وجود الأولى في نفس التبويب (authFlowInProgress) | رفض الثانية برمز AUTH_FLOW_BUSY |`

**`UNIFIED_REFERENCE.md`:**
- §2.1 **احذف** السطر: ``- `adoptionInProgress`: يمنع تداخل عمليات تبنّي الحساب أو استعادة بياناته.``
- §2.1 **استبدل** «ثلاث آليات حماية متكاملة» بـ «آليتين متكاملتين (`authFlowInProgress` + Web Locks)».
- §3.1 **استبدل** ``استخدام `authFlowInProgress` و`adoptionInProgress`.`` بـ ``استخدام `authFlowInProgress` مع Web Lock (أُلغي `adoptionInProgress`).``

## الخطوة 4 — اختياري (يحتاج موافقتك: ملف جديد خارج `src`)

الملف: `tests/cloudSync.auth.test.ts`. الهدف: C2/C3/C4/C5 آلياً. **غير مجرَّب** — اضبط المسارات/بيئة vitest (jsdom أو `stubGlobal`) عند أول تشغيل.

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/lib/supabase', () => ({
  supabase: { auth: {
    getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
    signInWithPassword: vi.fn(() => new Promise(() => {})), // لا يكتمل أبداً
    signOut: vi.fn(async () => ({ error: null })),
  } },
}));
vi.mock('../src/utils/appMode', () => ({ getMode: () => 'cloud' }));

describe('withAuthLock via loginParent', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { locks: { request: (_n: string, cb: () => unknown) => cb() } });
  });

  it('C3/C4: second concurrent login is rejected with AUTH_FLOW_BUSY', async () => {
    const { cloudSync } = await import('../src/lib/cloudSync');
    void cloudSync.loginParent('a@b.c', 'x').catch(() => {});
    await expect(cloudSync.loginParent('a@b.c', 'x')).rejects.toMatchObject({ code: 'AUTH_FLOW_BUSY' });
  });

  it('C5: no Web Locks → AUTH_FLOW_BUSY', async () => {
    vi.stubGlobal('navigator', {});
    vi.resetModules();
    const { cloudSync } = await import('../src/lib/cloudSync');
    await expect(cloudSync.loginParent('a@b.c', 'x')).rejects.toMatchObject({ code: 'AUTH_FLOW_BUSY' });
  });
});
```
ملاحظات: `localStorage` يحتاج بيئة `jsdom` في `vite.config.ts`/vitest (تحقق). التنفيذ على هاتف غير ممكن ← يبقى `BLOCKED` ما لم تُشغَّل عبر GitHub Actions/Codespaces.

## ⚠️ قرارات معلّقة (موافقتك)
| # | القرار | الافتراضي |
|---|---|---|
| D1 | `navigator.locks.request` بلا `ifAvailable` (ينتظر عبر التبويبات) | **أبقِ** (لا تغيير تصميم) |
| D2 | متصفح بلا Web Locks ← رفض الدخول | **أبقِ** |
| D3 | `logoutParent` خارج القفل | سجّل فقط |
| D4 | `srb_progress` لا يُمسح عند تبديل الحساب | يعالجه P2-03 |

## Commit والإغلاق
- لا Commit كود. Commit واحد للوثائق: `docs(P1-01): align C3 and adoptionInProgress decision`.
- بعد التنفيذ: حدّث `TEST_PLAN.md` §5. لا PASS لأي من C1–C20 قبل تنفيذه فعلياً. بوابة الانتقال: انظر `PHASE_1_EXECUTION.md` §5.
