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
