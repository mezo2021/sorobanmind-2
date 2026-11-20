# PHASE_1_EXECUTION.md — P1-01 سلامة اعتماد الهوية والمزامنة

> مبني على فحص فعلي لـ `sorobanmind-2-main نسخة ٢٠ت٢` (الأرشيف). **ليس بالضرورة مطابقاً لـ GitHub الحالي** → الخطوة 0 إلزامية.
> لا تعديل على: `src/App.tsx`، `src/utils/storage.ts`، SQL/Supabase. لا حذف لبيانات مستخدمين.

## 1. الحالة الفعلية (من الكود)

الملف: `src/lib/cloudSync.ts` (858 سطراً). المسار الفعلي `src/lib/` (وليس `src/utils/`).

| العنصر | الموضع | الحالة في الكود |
|---|---|---|
| `CloudSyncErrorCode` (10 رموز) + `CloudSyncError` | L8–28 | موجود |
| `AUTH_LOCK_NAME='soroban-auth-adoption'` + `authFlowInProgress` + `withAuthLock` | L30–64 | موجود. بدون `navigator.locks` ← `AUTH_FLOW_BUSY`؛ وإذا كان `authFlowInProgress` ← `AUTH_FLOW_BUSY` |
| `createLocalStateSnapshot` / `restoreLocalStateSnapshot` | L109–190 | موجودان (غير مُصدَّرين) |
| `wipeLocalProgress` | L234 | **يرمي الخطأ الآن** (`LOCAL_STATE_WIPE_FAILED`) ويتحقق من الحذف — A-7-2 منفذ |
| `pullProgress` | L273 | جلب فقط، ويحذف `childName/parentName` |
| `retryPendingAvatar` | L322 | داخل `withAuthLock`؛ تحقق من المالك عبر `getUser()` قبل RPC، وإعادة تحقق (OWNER + hero_key + pending) قبل حذف العلم |
| `adoptUser` | L382 | جلب ← Snapshot ← تطبيق ← `OWNER_KEY` آخراً؛ Rollback؛ يحافظ على رمز `CloudSyncError` الأصلي |
| `restorePreviousSession` | L486 | `setSession` أو `signOut({scope:'local'})` |
| `loginParent` / `verifyOtp` | L545 / L603 | داخل `withAuthLock`، يحفظون الجلسة السابقة ويستعيدونها عند الفشل؛ `upsert(..., {onConflict:'user_id', ignoreDuplicates:true})` موجود |
| `AuthModal.tsx` | L80–125 | خريطة رسائل لكل الرموز العشرة + `resolveAuthErrorMessage`؛ مستدعو `loginParent/verifyOtp` هما `AuthModal` فقط |
| `adoptionInProgress` | — | **غير موجود** (أُزيل بعد TS2304) |

**الحسم الموثق:** لا يُعاد `adoptionInProgress`. الحماية = `authFlowInProgress` (نفس التبويب) + Web Lock (بين التبويبات). `adoptUser` لا يُستدعى إلا من `loginParent`/`verifyOtp` (تحقق بـ grep، الخطوة 0.3).
### ملاحظات توثيقية إضافية (توثيق فقط)
- **التقدم الفعلي مقابل بوابة الإغلاق:** التعديلات الأساسية في `src/lib/cloudSync.ts` و`AuthModal.tsx` ونجاح `Build` واختبارات واجهة الدخول الأولية أُنجزت سابقاً؛ لكن إغلاق المرحلة يبقى مرتبطاً باختبارات `C1–C20` وتوثيق نتائجها الفعلية (`PASS` / `FAIL` / `BLOCKED` / `NOT RUN`).
- **بنود مؤجلة/خارج نطاق P1-01 داخل `cloudSync.ts`:** عدم لمس منطق `loadFromCloud()` (يتبع `P2-07` في Phase 2) أو `logoutParent()` ضمن `P1-01` إلا بقرار مستقل.
- **ملاحظة بيئة الهاتف:** إذا تعذر تشغيل `vitest` على هاتف Android، تُسجَّل الاختبارات المعتمدة عليه كـ `BLOCKED` أو `NOT RUN` مع ذكر السبب، ولا تُسجَّل كـ `PASS`.

## 2. النطاق

**مسموح تعديله (إن لزم فقط):** `src/lib/cloudSync.ts`، `src/components/AuthModal.tsx`.
**مجمّد:** `App.tsx`، `storage.ts`، `progressStore.ts`، `RoleSelection.tsx`، `GuardianDashboard.tsx`، `ProfileScreen.tsx`، أي SQL.
**لا تُصلَح ضمن P1-01:** اسم `Active Squirrel` بالإنجليزية في الترحيب (مؤجل منفصل).

## 3. خطوات التنفيذ

### الخطوة 0 — مطابقة (بلا تعديل)
1. افتح `src/lib/cloudSync.ts` في GitHub وقارن بالجدول أعلاه (الأسماء والمواضع التقريبية).
2. تأكد من الدوال: `withAuthLock`, `retryPendingAvatar`, `adoptUser`, `restorePreviousSession`.
3. ابحث (Search في GitHub) عن `adoptUser(` ← يجب أن يظهر داخل `cloudSync.ts` فقط، وعن `adoptionInProgress` ← لا نتائج.
4. إن اختلف أي بند: **توقف** وأبلغ، ولا تنفذ.

### الخطوة 1 — بلا تعديل كود (المتوقع)
الكود يغطي A-1…A-7-3 والمطلوب في D/E. **لا تكتب شيئاً** إلا إذا أظهرت الخطوة 0 فرقاً. أبقِ كل الدوال أعلاه دون تغيير.

### الخطوة 2 — تصحيح وثائق فقط (لا كود)
- في `TEST_PLAN.md` عدّل صياغة **C3** من «وجود adoptionInProgress» إلى «رفض عملية اعتماد متزامنة في نفس التبويب برمز `AUTH_FLOW_BUSY` عبر `authFlowInProgress`».
- أضف في `UNIFIED_REFERENCE.md` §2.1: «`adoptionInProgress` أُلغي؛ يغطيه `authFlowInProgress` + Web Lock».

### الخطوة 3 — نقاط تصميم تحتاج قرارك (لا تُنفَّذ تلقائياً)
| # | الملاحظة | الأثر |
|---|---|---|
| D1 | `navigator.locks.request` بدون `ifAvailable` ← عبر التبويبات **ينتظر** ولا يفشل | C6 («فشل الحصول على القفل») لا يحدث طبيعياً؛ يُختبر بمحاكاة فقط |
| D2 | متصفح بلا Web Locks ← الدخول مرفوض كلياً (`AUTH_FLOW_BUSY`) | سلوك آمن لكنه قد يمنع دخول متصفحات قديمة |
| D3 | `logoutParent` خارج القفل | خارج نطاق P1-01؛ سجّله للمراجعة لاحقاً |
| D4 | `wipeLocalProgress` يحذف مفاتيح `cloud:` فقط؛ `srb_progress` بلا بادئة | لا يُمسح عند تبديل الحساب ← يعالجه P2-03 |

أي تغيير على D1/D2 = قرار تصميمي جديد يتطلب موافقتك.

## 4. اختبارات القبول C1–C20

كل الحالات الآن **NOT RUN**. «مدعوم بالكود» تعني مراجعة منطق فقط، وليست PASS.

| ID | الدعم في الكود | وسيلة التحقق | الحالة |
|---|---|---|---|
| C1 | نعم | دخول حساب اختبار جديد من هاتف | NOT RUN |
| C2 | نعم (`authFlowInProgress`) | اختبار آلي vitest بمحاكاة `navigator.locks` | NOT RUN |
| C3 | نعم بعد تعديل الصياغة (خطوة 2) | نفس C2 | NOT RUN |
| C4 | نعم | آلي: استدعاءان متداخلان ← الثاني `AUTH_FLOW_BUSY` | NOT RUN |
| C5 | نعم (يُرفض الدخول) | آلي: حذف `navigator.locks` | NOT RUN |
| C6 | محاكاة فقط (D1) | آلي: `locks.request` يرمي | NOT RUN / BLOCKED على الهاتف |
| C7–C9 | نعم | آلي بمحاكاة `supabase.auth` | NOT RUN |
| C10–C11 | نعم (`scope:'local'`) | مراجعة كود + آلي | NOT RUN |
| C12–C13 | نعم (الجلب قبل لمس الحالة) | آلي: فشل `from()` | NOT RUN |
| C14–C15 | نعم (`different=false` ← لا جلب) | حسابا اختبار على هاتف | NOT RUN |
| C16–C17 | نعم (`OWNER_KEY` آخراً داخل try) | آلي: فشل تطبيق الهوية | NOT RUN |
| C18–C19 | نعم (إعادة تحقق + `withAuthLock`) | آلي | NOT RUN |
| C20 | نعم (10 رموز) | تُراجع بشرياً؛ اختبار فعلي لكل رمز لم يؤكده المستخدم | NOT RUN |

**ممنوع:** اختبار C2–C6 بفتح حسابين في متصفحين أو بالضغط السريع. استخدم vitest فقط.
**اختياري (يحتاج موافقتك — ملف جديد خارج `src`):** `tests/cloudSync.auth.test.ts` بمحاكاة `supabase` و`navigator.locks` (المشروع يستخدم vitest: `npm run test:run`).

## 5. Commit والتراجع والإغلاق
- إن لم يظهر فرق في الخطوة 0: **لا Commit كود**. Commit واحد للوثائق فقط (خطوة 2).
- إن عُدّل كود: Commit مستقل `P1-01: <وصف>` ← `npm run build` (= `tsc && vite build`) ← الاختبارات.
- التراجع: `git revert <hash>` فقط. لا مسح لـ localStorage أو بيانات المستخدمين.
- **بوابة الإغلاق (Phase 1 → 2):** C1–C20 كلها PASS (أو BLOCKED موثقة بالسبب والبديل)، Build ناجح، تحديث سجل النتائج في `TEST_PLAN.md` §5. لا تبدأ Phase 2 قبل ذلك.


## ملحق — Phase 1
- شرط البدء: مطابقة `src/lib/cloudSync.ts` و`AuthModal.tsx` مع نسخة GitHub الحالية (الحالة الفعلية في `TEST_PLAN.md` §5 و`PROJECT_CONTROL.md`).
- قرارات محسومة: عدم إعادة `adoptionInProgress`؛ الاكتفاء بـ `authFlowInProgress` + `withAuthLock` (`soroban-auth-adoption`)؛ `retryPendingAvatar()` محمية بالقفل والتحقق من المالك والهوية؛ عدم لمس `loadFromCloud()` أو `logoutParent()` ضمن `P1-01`.
- قرارات معلّقة (تتطلب موافقة): حسم سلوك `D1` (انتظار القفل عبر التبويبات بدون `ifAvailable`) و`D2` (رفض الدخول عند غياب `navigator.locks`) في `TEST_PLAN.md`.
- بيئة الاختبار: تشغيل `vitest` (`npm run test:run`) عبر GitHub Codespaces أو GitHub Actions من المتصفح لاختبارات التزامن والمحاكاة؛ ما لم يُنفَّذ فعلياً = `NOT RUN` أو `BLOCKED` ببديل «مراجعة كود» ولا يُسجَّل `PASS`.
- Commit/تراجع: Commit مستقل للوثائق أو الكود عند الحاجة؛ التراجع عبر `git revert` فقط دون مساس بـ `localStorage` أو بيانات المستخدمين.

| البند | الملفات | الاختبارات (انظر `TEST_PLAN.md`) |
|---|---|---|
| P1-01 | `src/lib/cloudSync.ts`، `src/components/AuthModal.tsx` | C1–C20 |

....

---

# ملحق B — إغلاق P1-01 (تحديث 2026-11-20)

**حالة الملحق:** إضافة فقط. لا يُلغي أي نص سابق. يُقرأ مع §§1–5 والملحق الأصلي أعلاه.

---

## B.1 — حالة المستند

- **آخر تحديث:** 20 نوفمبر 2026 — بعد فحص كامل لـ`src/lib/cloudSync.ts` و`src/components/AuthModal.tsx` على نسخة GitHub الحالية.
- **حالة P1-01:** الكود مكتمل. لا تعديل إنتاجي متبقٍ.
- **حالة المستند:** مكتمل. P1-01 جاهز للإغلاق بمجرد Commit توثيقي.

---

## B.2 — تأكيد §1 (جدول الحالة الفعلية) بأرقام الأسطر

كل صفوف جدول §1 تأكدت مطابقتها للكود الفعلي. الأدلة:

| العنصر | الموضع في `cloudSync.ts` | الحالة |
|---|---|---|
| `AUTH_LOCK_NAME='soroban-auth-adoption'` | L32 | ✅ |
| `authFlowInProgress` + حارس | L34, L45–50 | ✅ |
| `withAuthLock` (غياب locks ← `AUTH_FLOW_BUSY`) | L36–64 | ✅ |
| انتظار القفل بلا `ifAvailable` (D1) | L60–63 | ✅ |
| `pullProgress` fetch-only + تجريد `childName/parentName` | L273–307 | ✅ |
| `wipeLocalProgress` يرمي `LOCAL_STATE_WIPE_FAILED` | L234–269 | ✅ |
| `retryPendingAvatar` داخل `withAuthLock` + تحقق مالك قبل/بعد RPC | L322–380 | ✅ |
| `adoptUser` — `OWNER_KEY` آخر خطوة + Rollback | L382–480 | ✅ |
| `restorePreviousSession` — `scope:'local'` فقط | L486–518 | ✅ |
| `verifyOtp` — `ignoreDuplicates:true` | L600–612 | ✅ |
| `loginParent` — حفظ/استعادة الجلسة | L545–598 | ✅ |
| `adoptionInProgress` | غائب | ✅ |
| `CLOUD_SYNC_ERROR_MESSAGES` (10 رموز) | `AuthModal.tsx` L83–125 | ✅ |
| `resolveAuthErrorMessage` | `AuthModal.tsx` L127–133 | ✅ |
| موافقتا guardian/privacy إلزاميتان، leaderboard اختيارية | `AuthModal.tsx` L155–158, L268 | ✅ |

### إضافات مؤكدة على جدول §1

- `AUTH_REQUIRED` و`AVATAR_SYNC_FAILED`: معرّفان في `CloudSyncErrorCode` لكن **غير مستخدمين** في الكود (dead code). يُسجّل للمرحلة 2.
- `resendOtp` (`AuthModal.tsx` L244, L289): **لا يمر عبر `withAuthLock`**. يُسجّل للمرحلة 2.

---

## B.3 — إغلاق الخطوات 0 و1 و2

- **الخطوة 0 (المطابقة):** ✅ مكتملة. كل البنود طابقت. لم يظهر ما يستدعي التوقف.
- **الخطوة 1 (بلا تعديل كود):** ✅ مكتملة. الكود يغطي A-1…A-7-3 والمطلوب في D/E. لم يُكتب أي سطر كود في هذه المرحلة.
- **الخطوة 2 (تصحيح وثائق):** ✅ مكتملة عبر Commits:
  - `45c8865` — تصحيح C3 في `TEST_PLAN.md`.
  - `b987b36` — تصحيح §2.1 في `UNIFIED_REFERENCE.md`.
  - Commits إضافية لملاحق `PROJECT_CONTROL.md`، `MASTER_REMEDIATION_PLAN.md`، `UNIFIED_REFERENCE.md` (بأسلوب الإضافة فقط).

---

## B.4 — حسم قرارات التصميم D1–D4 (§3 — الخطوة 3)

| # | القرار النهائي | المرجع |
|---|---|---|
| D1 | **إبقاء** — `navigator.locks.request` بلا `ifAvailable` (انتظار). لا تغيير تصميمي. | `UNIFIED_REFERENCE.md` §2.1 |
| D2 | **إبقاء** — رفض الدخول عند غياب Web Locks بـ`AUTH_FLOW_BUSY`. | `UNIFIED_REFERENCE.md` §3.1 |
| D3 | **تسجيل فقط** — `logoutParent` خارج `withAuthLock` يُراجع في Phase 2. | ثغرة #5 في `TEST_PLAN.md` ملحق A §A.4 |
| D4 | **يُؤجل إلى P2-03** — `srb_progress` بدون بادئة يُعالج ضمن إصلاح التخزين. | ثغرة #6 في `TEST_PLAN.md` ملحق A §A.4 |

**ملاحظة C6:** بحسب D1، C6 اختبار «محاكاة فشل `locks.request`» — لا «انشغال القفل». صياغتها في `TEST_PLAN.md` صحيحة.

**⛔ إشارة إلى الملحق الأصلي:** بند «قرارات معلّقة (تتطلب موافقة): حسم سلوك D1 وD2» **منقّح**. القراران محسومان أعلاه.

---

## B.5 — حالة اختبارات C1–C20 (§4)

- **لا PASS** لأي حالة. لم تُنفَّذ فعلياً.
- **التصنيف الحالي:**
  - `BLOCKED` (بيئة هاتف — تحتاج جهازاً/حسابين): C1، C14، C15.
  - `NOT RUN` (تحتاج vitest أو مراجعة بشرية): بقية الحالات.
- **الدعم الكودي:** ✅ مؤكد لجميع الحالات (مراجعة يدوية كاملة).
- **التفصيل الكامل:** `TEST_PLAN.md` ملحق A §A.3.

---

## B.6 — بوابة الإغلاق (§5)

| الشرط | الحالة | الدليل |
|---|---|---|
| الكود مطابق للتصميم | ✅ | مراجعة يدوية كاملة (B.2 أعلاه) |
| Build ناجح | ✅ | CI Build أخضر على `main` |
| C1–C20 مصنفة | ✅ | `TEST_PLAN.md` ملحق A §A.3 |
| سجل النتائج محدّث | ✅ | `TEST_PLAN.md` ملحق A §A.2 |
| لا تعديل كود متبقٍ | ✅ | P1-01 مكتمل برمجياً |
| Commit توثيقي نهائي | ⏳ متبقٍ | هذا الملحق + ملاحق الوثائق الأخرى |

**القرار:** بوابة P1-01 مفتوحة للإغلاق بمجرد Commit التوثيق. الانتقال لـPhase 2 مسموح بعد الـCommit، مع تصنيف `BLOCKED`/`NOT RUN` مقبولاً صراحة وفق §5.

---

## B.7 — الثغرات الست المؤجلة

موثقة بالكامل في `TEST_PLAN.md` ملحق A §A.4. لا تُصلح ضمن P1-01:

1. `retryPendingAvatar` يبتلع `AUTH_FLOW_BUSY` بلا إعادة جدولة → P2
2. `restorePreviousSession` عند فشلها يُخفي الخطأ الأصلي → P2
3. رمز خطأ خاطئ في Rollback داخل `adoptUser` (`SESSION_RESTORE_FAILED` بدل `LOCAL_STATE_COMMIT_FAILED`)
4. `AUTH_REQUIRED` و`AVATAR_SYNC_FAILED` رموز غير مستخدمة → تنظيف P2
5. `resendOtp` بلا `withAuthLock` → P2
6. `srb_progress` لا يُمسح عند تبديل الحساب (D4) → P2-03

---

**نهاية الملحق B.**
