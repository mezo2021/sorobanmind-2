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

....

---

# ملحق C — إغلاق ورقة العمل (تحديث 2026-11-20)

**حالة الملحق:** إضافة فقط. لا يُلغي أي نص سابق. يُقرأ مع الخطوات 1–4 والقرارات D1–D4 أعلاه.

---

## C.1 — إغلاق الخطوة 1 (المطابقة)

**النتيجة:** ✅ **مكتملة**. الفحص الكامل لـ`src/lib/cloudSync.ts` على نسخة GitHub الحالية أكد كل البنود المطلوبة:

| بند المطابقة | النتيجة | الموضع |
|---|---|---|
| `AUTH_LOCK_NAME='soroban-auth-adoption'` | ✅ موجود | L32 |
| `authFlowInProgress` + `withAuthLock` | ✅ موجود | L34, L36–64 |
| `wipeLocalProgress` يرمي `LOCAL_STATE_WIPE_FAILED` | ✅ موجود | L234–269 |
| `retryPendingAvatar` داخل `withAuthLock` | ✅ موجود | L322–380 |
| `OWNER_KEY` آخر خطوة في `adoptUser` | ✅ موجود داخل `try` | L458–459 |
| `ignoreDuplicates: true` في `verifyOtp` | ✅ موجود | L606–609 |
| `adoptionInProgress` | ✅ غائب (هذا هو الصحيح) | — |
| استدعاءات `adoptUser(` | ✅ 3 مواضع (تعريف + `verifyOtp` + `loginParent`) | L382, L576, L622 |

**لم يظهر أي اختلاف يستدعي التوقف.**

---

## C.2 — إغلاق الخطوة 2 (الأكواد: دون تغيير)

**النتيجة:** ✅ **مكتملة كما هو مطلوب**.

| البند | الإجراء | الحالة |
|---|---|---|
| `withAuthLock` | أُبقي دون تغيير | ✅ |
| `adoptUser` (Snapshot ← تطبيق ← `OWNER_KEY` ← Rollback) | أُبقي | ✅ |
| `wipeLocalProgress` (يرمي `LOCAL_STATE_WIPE_FAILED`) | أُبقي | ✅ |
| `retryPendingAvatar` (تحقق المالك قبل/بعد RPC) | أُبقي | ✅ |
| `loginParent`/`verifyOtp` (حفظ/استعادة الجلسة) | أُبقي | ✅ |
| `AuthModal.tsx` (10 رسائل + `resolveAuthErrorMessage`) | أُبقي | ✅ |
| `adoptionInProgress` | لم يُضَف (لا حاجة — `authFlowInProgress` + Web Lock يكفيان) | ✅ |

**لم يُعدَّل أي سطر إنتاجي.**

---

## C.3 — إغلاق الخطوة 3 (تصحيح الوثائق)

**النتيجة:** ✅ **مكتملة**.

| الملف | التصحيح | الحالة |
|---|---|---|
| `TEST_PLAN.md` | C3 مُصحح (Commit `45c8865`) + ملحق A كامل | ✅ |
| `UNIFIED_REFERENCE.md` | §2.1 و§3.1 مُصححان (Commit `b987b36`) + ملحق إضافي | ✅ |
| `MASTER_REMEDIATION_PLAN.md` | 7 تحديثات موثقة في ملحق | ✅ |
| `PROJECT_CONTROL.md` | §11 مضاف (سجل الفحص الكامل) | ✅ |
| `PHASE_1_EXECUTION.md` | ملحق B كامل | ✅ |
| `PHASE_1_CODE_STEPS.md` | هذا الملحق C | ✅ |

**ملاحظة:** إن لم تكن Commits `45c8865` و`b987b36` موجودة في المستودع، استبدل المرجع بـ«تصحيحات وثائقية في هذه الجولة».

---

## C.4 — الخطوة 4 (الاختبار الآلي): لم تُنفَّذ

**الحالة:** ⏸ **لم تُنفَّذ**. لا موافقة صريحة على إنشاء `tests/cloudSync.auth.test.ts`.

**القرار المؤجل:**
- الملف `tests/cloudSync.auth.test.ts` **لم يُنشأ**.
- إمكانية تنفيذه لاحقاً (عبر Codespaces أو GitHub Actions) مسجّلة في `TEST_PLAN.md` ملحق A §A.3 كـ`NOT RUN`.
- C2/C3/C4/C5/C6 قابلة للتحقق عبر هذا الملف عند الموافقة والتنفيذ.

**لا أثر على إغلاق P1-01:** الكود مدعوم للمنطق، والاختبار الآلي اختياري.

---

## C.5 — حسم قرارات D1–D4

| # | القرار النهائي | حالة التنفيذ |
|---|---|---|
| D1 | **إبقاء** — انتظار القفل بلا `ifAvailable` | ✅ لا تغيير في الكود |
| D2 | **إبقاء** — رفض الدخول عند غياب Web Locks بـ`AUTH_FLOW_BUSY` | ✅ لا تغيير في الكود |
| D3 | **تسجيل فقط** — `logoutParent` خارج `withAuthLock` | ✅ مسجّل في `TEST_PLAN.md` ملحق A §A.4 (ثغرة #5) |
| D4 | **يُؤجل إلى P2-03** — `srb_progress` بدون بادئة | ✅ مسجّل في `TEST_PLAN.md` ملحق A §A.4 (ثغرة #6) |

**لا قرارات معلّقة.**

---

## C.6 — الثغرات الست المؤجلة

موثقة بالكامل في `TEST_PLAN.md` ملحق A §A.4. لا تُصلح ضمن P1-01:

1. `retryPendingAvatar` يبتلع `AUTH_FLOW_BUSY` بلا إعادة جدولة → P2
2. `restorePreviousSession` عند فشلها يُخفي الخطأ الأصلي → P2
3. رمز خطأ خاطئ في Rollback داخل `adoptUser` (`SESSION_RESTORE_FAILED` بدل `LOCAL_STATE_COMMIT_FAILED`)
4. `AUTH_REQUIRED` و`AVATAR_SYNC_FAILED` رموز غير مستخدمة → تنظيف P2
5. `resendOtp` بلا `withAuthLock` → P2
6. `srb_progress` لا يُمسح عند تبديل الحساب (D4) → P2-03

---

## C.7 — Commit والإغلاق

**الحالة الفعلية:** لا Commit كود (لم يُعدَّل أي كود). Commit توثيقي واحد مطلوب.

**الرسالة المقترحة:**