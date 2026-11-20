# PHASE_1_EXECUTION.md — بطاقات P1-01 (الأخطر أولاً)

قواعد: لا تعديل على `src/App.tsx` ولا `src/utils/storage.ts` ولا SQL. CI = `npm run test:run` ثم `npm run build` (من `ci-build.yml`).
المسار الفعلي: `src/lib/cloudSync.ts`. مبني على أرشيف ٢٠ت٢ — البطاقة 1 تتحقق أنه يطابق GitHub.

---

## البطاقة 1 — بوابة المطابقة (لا Commit)
**التغيير:** لا شيء. افتح `src/lib/cloudSync.ts` في GitHub وابحث عن العناصر أدناه.
| ابحث عن | المتوقع |
|---|---|
| `AUTH_LOCK_NAME` | `'soroban-auth-adoption'` |
| `withAuthLock` | يُستخدم في `loginParent` و`verifyOtp` و`retryPendingAvatar` |
| `localStorage.setItem(OWNER_KEY` | داخل `adoptUser`، **آخر خطوة** |
| `Failed to remove` | داخل `wipeLocalProgress` (يرمي ولا يبتلع) |
| `adoptionInProgress` | **لا نتائج** (صحيح) |

**الاختبار من الهاتف:** نعم (قراءة فقط)
**Commit message:** — (لا Commit)
**الوقت المتوقع:** 5 دقائق
**مخاطر:** إن اختلف أي بند → أوقف Phase 1 وأرسل الفرق.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## البطاقة 2 — اختبار آلي للقفل (C3–C5) في CI
**التغيير:** أنشئ ملفاً جديداً `tests/cloudSync.auth.test.ts` (خارج `src`، لا يمس الإنتاج). **يحتاج موافقتك.**
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mem = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => { mem.set(k, v); },
  removeItem: (k: string) => { mem.delete(k); },
  key: (i: number) => [...mem.keys()][i] ?? null,
  get length() { return mem.size; },
});

vi.mock('../src/lib/supabase', () => ({
  supabase: { auth: {
    getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
    signInWithPassword: vi.fn(() => new Promise(() => {})), // لا يكتمل أبداً
    signOut: vi.fn(async () => ({ error: null })),
  } },
}));
vi.mock('../src/utils/appMode', () => ({ getMode: () => 'cloud' }));
vi.mock('../src/store/progressStore', () => ({
  useProgressStore: { getState: () => ({ reset() {} }), setState() {} },
}));

describe('auth lock', () => {
  beforeEach(() => { vi.resetModules(); });

  it('C3/C4: second concurrent login → AUTH_FLOW_BUSY', async () => {
    vi.stubGlobal('navigator', { locks: { request: (_n: string, cb: () => unknown) => cb() } });
    const { cloudSync } = await import('../src/lib/cloudSync');
    void cloudSync.loginParent('a@b.c', 'x').catch(() => {});
    await new Promise((r) => setTimeout(r, 0));
    await expect(cloudSync.loginParent('a@b.c', 'x')).rejects.toMatchObject({ code: 'AUTH_FLOW_BUSY' });
  });

  it('C5: no Web Locks → AUTH_FLOW_BUSY', async () => {
    vi.stubGlobal('navigator', {});
    const { cloudSync } = await import('../src/lib/cloudSync');
    await expect(cloudSync.loginParent('a@b.c', 'x')).rejects.toMatchObject({ code: 'AUTH_FLOW_BUSY' });
  });
});
```
**الاختبار من الهاتف:** لا (BLOCKED على الهاتف؛ **يُنفَّذ في CI** ويظهر أخضر/أحمر في المتصفح)
**Commit message:** `test(auth): add lock tests for loginParent (C3-C5)`
**الوقت المتوقع:** 15 دقيقة + إعادة محاولة CI
**مخاطر:** الكود **غير مجرَّب**؛ قد يفشل CI بسبب الـ mock (بيئة الاختبار `node`). إن احمرّ: أرسل رسالة الخطأ كما هي ولا تغيّر `src`، ولا تعدّل الاختبار ليمرّ دون فهم السبب.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## البطاقة 3 — تحقق: لا نجاح وهمي بعد فشل الاعتماد (لا Commit)
**التغيير:** لا شيء. في `src/components/AuthModal.tsx` تأكد أن `onSuccess()` يأتي بعد `await` داخل `try`:
- ~L205: `await cloudSync.verifyOtp(email, otp, 'signup');` ثم `setTimeout(() => onSuccess(), 1500);`
- ~L219: `await cloudSync.loginParent(email, password);` ثم `setTimeout(() => onSuccess(), 1000);`

وأن `adoptUser` في `cloudSync.ts` من النوع `Promise<void>` وترمي عند الفشل (فينتقل التنفيذ إلى `catch`).
**الاختبار من الهاتف:** نعم (قراءة)
**Commit message:** — (لا Commit)
**الوقت المتوقع:** 5 دقائق
**مخاطر:** لا شيء (ثغرة قديمة موثقة: `loginParent` كانت تتجاهل القيمة المرجعة؛ أُصلحت في هذا الإصدار).
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## البطاقة 4 — اختبار آلي: استعادة الجلسة وعدم تعيين OWNER_KEY عند الفشل (C8, C9, C16)
**التغيير:** **مؤجلة حتى تخضر البطاقة 2.** تحتاج محاكاة سلسلة `supabase.from().select()` و`setSession`؛ تُكتب بعد أن تثبت بيئة الاختبار. أبلغني "تابع بطاقة 4" عندها.
**الاختبار من الهاتف:** لا (BLOCKED؛ CI فقط)
**Commit message:** `test(auth): rollback keeps previous session and OWNER_KEY (C8,C9,C16)`
**الوقت المتوقع:** 30 دقيقة
**مخاطر:** محاكاة معقدة؛ إن طالت فأبقِ C8/C9/C16 بحالة BLOCKED بدل اختبار هش.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## البطاقة 5 — تصحيح وثيقة C3 (نص فقط)
**التغيير:** في `docs/md/00_Foundation/TEST_PLAN.md` استبدل:
`| C3 | وجود adoptionInProgress | رفض العملية المتزامنة |`
بـ: `| C3 | استدعاء ثانٍ لدخول/اعتماد أثناء الأول في نفس التبويب | رفضه برمز AUTH_FLOW_BUSY (authFlowInProgress) |`
**الاختبار من الهاتف:** نعم
**Commit message:** `docs(tests): align C3 with authFlowInProgress`
**الوقت المتوقع:** 3 دقائق
**مخاطر:** لا شيء.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## البطاقة 6 — اختبار يدوي بحساب اختبار فقط (C1, C14)
**التغيير:** لا كود. بحساب **اختبار** (ليس من الحسابات الخمسة الحقيقية):
1. C1: دخول بحساب جديد → الشاشة الرئيسية.
2. C14: خروج ثم دخول بالحساب نفسه → التقدم المحلي كما هو.
3. C15 (لا تقدم محلي مع OWNER_KEY): لا وسيلة آمنة من الهاتف → BLOCKED.

**الاختبار من الهاتف:** نعم (C1، C14)؛ لا (C15 → BLOCKED)
**Commit message:** — (لا Commit)
**الوقت المتوقع:** 10 دقائق
**مخاطر:** لا تبدّل حسابات عشوائياً ولا بحسابات حقيقية؛ إن ظهرت بيانات حساب آخر → أوقف فوراً وأبلغ.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## البطاقة 7 — حالات تبقى BLOCKED (لا Commit)
**التغيير:** لا شيء. سجّلها BLOCKED بأسبابها ولا تسجّل PASS:
- C6: `locks.request` ينتظر ولا يفشل طبيعياً؛ يحتاج محاكاة.
- C10–C11: مراجعة كود فقط.
- C12–C13، C18–C19: تحتاج محاكاة supabase (بعد البطاقة 4 إن لزم).
- C20: اختبار فعلي لكل رمز من العشرة غير ممكن من الهاتف.

**الاختبار من الهاتف:** لا (BLOCKED)
**Commit message:** — (لا Commit)
**الوقت المتوقع:** 2 دقيقة
**مخاطر:** لا شيء.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## البطاقة 8 — بوابة إغلاق Phase 1
**التغيير:** لا كود. تُغلق Phase 1 عند: البطاقات 1 و3 و5 منفذة، البطاقة 2 خضراء في CI، C1/C14 نجحا يدوياً، الباقي BLOCKED بأسبابه، وCI أخضر (test + build).
**الاختبار من الهاتف:** نعم (رؤية CI)
**Commit message:** — (لا Commit)
**الوقت المتوقع:** 2 دقيقة
**مخاطر:** لا تبدأ Phase 2 قبل ذلك.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`
