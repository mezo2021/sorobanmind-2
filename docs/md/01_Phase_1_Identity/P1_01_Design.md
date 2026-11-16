📘 P1_01_Design.md — التصميم النهائي المعتمد

انسخ النص التالي إلى docs/md/01_Phase_1_Identity/P1_01_Design.md.

---

```markdown
# P1_01 — Identity Contamination Fix (Design)

**التصنيف:** P1 (Critical)
**الحالة:** ✅ مغلق تصميمياً (16 نوفمبر 2026)
**المرجع:** `UNIFIED_REFERENCE.md` — قسم `Phase 1`
**النطاق:** `src/lib/cloudSync.ts` + تعديل محدود في `src/components/AuthModal.tsx`
**الكود:** مؤجل إلى المرحلة 7 (Final Implementation)

---

## 1. المشكلة — لماذا هذا الإصلاح ضروري؟

### 1.1 السياق

عندما يسجل مستخدم الدخول (أو يؤكد OTP) في الوضع السحابي، تمر العملية عبر سلسلة:
`AuthModal → loginParent/verifyOtp → supabase.auth → adoptUser → pullProgress → wipeLocalProgress → كتابة OWNER_KEY`.

المشكلة أن هذه السلسلة **لا تتوقف عند الفشل**، بل تُكمل وكأن كل شيء نجح.

### 1.2 مسار الفشل الحالي (تفصيل)

**الخطوة 1:** `signInWithPassword` تنجح. جلسة Supabase تتغير فوراً إلى الحساب الجديد (B). هذا يحدث **قبل** أي تحقق.

**الخطوة 2:** `adoptUser(data.user)` تبدأ:
- تقرأ `public_profiles.avatar_id` — إن فشل → `return false` (بدون throw).
- تقرأ `soroban_progress` عبر `pullProgress` — **لكن `pullProgress` تفحص `data` فقط ولا تفحص `error`**.
  - إذا فشلت الشبكة، Supabase تُرجع `{data: null, error: Error}` — لكن الكود يأخذ `data` ويتجاهل `error`.
  - لا يحدث استثناء، لذا `catch` حول `pullProgress` لا يستفيد.

**الخطوة 3:** `wipeLocalProgress()` تُنفَّذ **قبل** الجلب في الكود الحالي:
- تحذف مفاتيح `cloud:*` من الحساب السابق (A).
- تُصفّر Zustand عبر `reset()`.

**الخطوة 4:** `adoptUser` تُكمل رغم فشل الجلب، وتكتب `OWNER_KEY = B`.

**الخطوة 5:** `loginParent` تُعيد `data.user` لـ `AuthModal` — وكأن كل شيء نجح.

**الخطوة 6:** `AuthModal` تستدعي `onSuccess()` ويفتح التطبيق.

### 1.3 النتيجة النهائية

- المستخدم B يرى **تقدماً فارغاً** (لأن بيانات A مُسحت، وبيانات B لم تُجلب).
- `OWNER_KEY = B` يُثبّت هذه الحالة السيئة.
- لا يوجد أي خطأ ظاهر للمستخدم — يظن أنه بدأ من الصفر.
- **قد يتفاقم الأمر:** إذا حدث هذا لأحد المستخدمين الحقيقيين، سيفقد تقدمه بلا رجعة.

### 1.4 الأثر على الفحص الحي

في فحص Phase 0، وجدنا 5 مستخدمين حقيقيين (4 مؤكدين). **لم يُثبت أن أي منهم تأثر بهذا الخلل بعد** — لكن هذا مجرد حظ. أي مستخدم جديد قد يتأثر من أول تسجيل دخول.

---

## 2. القرارات المعمارية الخمسة (الأساس)

### 2.1 القرار D1 — عقد جديد لـ `adoptUser`

**المشكلة الحالية:** `adoptUser` تُرجع `Promise<boolean>`. لكن `false` تعني **حالتين مختلفتين**:
- "الحساب نفسه — لا يوجد تغيير" (نجاح).
- "فشل جلب `public_profiles`" (فشل).

هذا **يُعطّل أي منطق يعتمد على القيمة**، لأن `loginParent` لا تستطيع التمييز بين "نجاح بلا تغيير" و"فشل".

**العقد الجديد:**
```

adoptUser(user: User): Promise<{ success: true; changed: boolean }>

```

**القواعد:**
- عند النجاح → `{ success: true, changed: <boolean> }`.
- عند الفشل → **`throw CloudSyncError`** (لا `return false`).
- `changed = (OWNER_KEY !== user.id)` — يعكس فقط هل تغير الحساب.

**المبرر:** فصل مسؤولية "النجاح/الفشل" عن مسؤولية "هل تغير الحساب" — قراران مستقلان تماماً.

### 2.2 القرار D2 — قفلان + Web Locks

**المشكلة:** الضغط المزدوج على "تسجيل الدخول" يبدأ عمليتي `adoptUser` متوازيتين، فتفشل الأولى وتُنشئ حالة جزئية، ثم تفشل الثانية بعد أن يكون `Snapshot` الأول قد أُفسد.

**الحل المزدوج:**

| القفل | مكانه | النطاق |
|-------|-------|--------|
| `authFlowInProgress` | متغير ملف في `cloudSync.ts` | يمنع مصادقة مزدوجة (`loginParent`/`verifyOtp`) |
| `adoptionInProgress` | متغير ملف في `cloudSync.ts` | دفاع إضافي داخل `adoptUser` |
| **Web Locks** (`sorobanmind-auth-adoption`) | `navigator.locks` | يمنع التزامن بين تبويبات |

**سياسة الفشل:**
- إذا كان Web Locks **غير متوفر**: **رفض العملية** بـ `AUTH_FLOW_BUSY` — لا ادعاء بحماية وهمية.
- إذا كان القفل **مشغولاً**: **رفض فوري**، لا انتظار (بيانات الجلسة قد تتغير أثناء الانتظار).

**المبرر:** تزامن المصادقة (تغيير جلسة Supabase) مختلف عن تزامن الاعتماد (تعديل التخزين المحلي) — يحتاج كل مستوى حماية مستقلة.

### 2.3 القرار D3 — استعادة الجلسة السابقة

**المشكلة:** `signInWithPassword` يُغيّر جلسة Supabase **قبل** أن تبدأ `adoptUser`. إذا فشلت `adoptUser`:
- المستخدم يبقى بجلسة Supabase للحساب الجديد.
- لكن بياناته المحلية هي بيانات الحساب السابق.
- تناقض تام بين الجلسة والحالة المحلية.

**الحل:**
1. **قبل** `signInWithPassword`: احفظ `access_token`, `refresh_token`, `userId` في **الذاكرة فقط**.
2. **عند الفشل**: استدعِ `supabase.auth.setSession({access_token, refresh_token})`.
3. **التحقق**: `getSession().user.id === previousUserId`.
4. **Fallback عند فشل الاستعادة**: `signOut({scope: 'local'})` (لا يؤثر على الأجهزة الأخرى).

**لماذا لا نستخدم `signOut()` العام؟** لأنه يُخرج المستخدم من كل الأجهزة (هاتف + تابلت + كمبيوتر) — إجراء مدمّر لا داعي له.

**لماذا لا نحفظ الرموز في `localStorage`؟** لأنها بيانات اعتماد حساسة، ولا حاجة لحفظها بعد انتهاء العملية. Supabase Auth يدير تخزينها بنفسه.

### 2.4 القرار D4 — Helper محلي للتحقق من الكتابة

**المشكلة:** `storage.ts` يبتلع أخطاء `localStorage.setItem` داخل `try/catch`. لذلك `progressStore.persist` قد يبدو ناجحاً بينما الكتابة فشلت (QuotaExceeded مثلاً).

**الحل:** إضافة helper في `cloudSync.ts` فقط:
```

writeLocalValueVerified(key, value): void

```
يُعيد القراءة بعد الكتابة، ويقارن. إن اختلفت → `throw`.

**لماذا لا نعدل `storage.ts`؟** لأنه مشترك مع Zustand persist، الإعدادات، اللغة، الثيم — أي تعديل يُغيّر سلوك كل هذه المسارات.

### 2.5 القرار D5 — أخطاء منظمة (`CloudSyncError`)

**المشكلة:** إذا رمزنا `new Error("network failed")` بالإنجليزية، سيراها الطفل بالإنجليزية في `AuthModal`.

**الحل:**
```typescript
class CloudSyncError extends Error {
  code: CloudSyncErrorCode;
  message: string; // تقنية داخلية آمنة
}
```

الرموز المعتمدة:

الرمز المعنى
AUTH_FLOW_BUSY عملية مصادقة أخرى جارية
PROFILE_FETCH_FAILED فشل جلب الملف الشخصي
PROGRESS_FETCH_FAILED فشل جلب التقدم
INVALID_PROGRESS_DATA بيانات التقدم غير صالحة
PERSIST_VERIFY_FAILED فشل التحقق من الحفظ
ADOPTION_ROLLBACK_FAILED فشل استعادة البيانات المحلية
SESSION_RESTORE_FAILED فشل استعادة جلسة Auth
ADOPTION_SESSION_LOST فشل الاعتماد وفقدان الجلسة

الترجمة: في AuthModal.tsx، يُترجم الرمز عبر pickLang إلى رسالة عربية أو إنجليزية مناسبة.

---

3. المراحل الخمس لـ adoptUser (Adoption Process)

3.1 Stage 1 — Snapshot

الهدف: حفظ الحالة السابقة قبل أي تعديل — لتكون شبكة الأمان للـ Rollback.

ما يُحفظ:

العنصر مصدره
حالة progressStore كاملة (بدون الدوال) useProgressStore.getState()
مفاتيح cloud:* التي سيحذفها wipeLocalProgress localStorage
OWNER_KEY localStorage
soroban_hero_key localStorage
soroban_child_name localStorage
soroban_avatar_pending_upload localStorage

المكان: الذاكرة فقط (متغيرات محلية في adoptUser).

القاعدة الصارمة: لا حذف، لا reset، لا كتابة OWNER_KEY في هذه المرحلة.

3.2 Stage 2 — Fetch

الهدف: جلب بيانات الحساب الجديد من Supabase دون لمس الحالة المحلية.

ما يُجلب:

المطلوب الطريقة
avatar_id supabase.from('public_profiles').select('avatar_id').eq('user_id', user.id)
progress_data supabase.from('soroban_progress').select('progress_data').eq('user_id', user.id) — فقط إذا changed=true

قواعد إلزامية:

· فحص error صريحاً لكل استعلام (لا const {data} = ... فقط).
· لا useProgressStore.setState ولا reset ولا localStorage.removeItem.
· إذا كان changed=false → لا نجلب التقدم (لأن LOCAL WINS — التقدم المحلي أحدث).

لماذا لا pullProgress بصيغتها الحالية؟ لأنها تخلط الجلب مع التطبيق. يجب فصلها لتصبح Fetch-only.

3.3 Stage 3 — Validate

الهدف: إثبات أن البيانات المسترجعة قابلة للاعتماد قبل لمس أي شيء محلي.

قواعد التحقق:

حالة progress_data القرار
error موجود فشل (PROGRESS_FETCH_FAILED)
لا صف (data === null) حساب جديد → حالة ابتدائية
صف بـ {} حالة ابتدائية
صف ببيانات صالحة (كائن غير فارغ) اعتماد البيانات
صف بـ null أو غير كائن فشل (INVALID_PROGRESS_DATA) — لا نُحوّله لحساب جديد بصمت

قاعدة avatar_id غير صالح: إذا كانت قيمة غير موجودة في allowed_avatars → تحويل محلي إلى null، واستخدام الشخصية الافتراضية. لا نرفض الاعتماد، ولا نكتب null في القاعدة تلقائياً.

القاعدة الذهبية: أي فشل في Stage 3 → throw قبل لمس أي بيانات محلية.

3.4 Stage 4 — Commit

الهدف: استبدال حالة الحساب السابق بحالة الحساب الجديد، بشكل قابل للتراجع.

الترتيب الصارم:

1. removeCloudKeysVerified(...) — حذف مفاتيح cloud:* مع التحقق من اختفائها.
2. progressStore.reset() — إعادة Zustand إلى initialState في الذاكرة.
3. applyFetchedProgress(...) — تطبيق بيانات الحساب الجديد، مع استبعاد childName و parentName (يجب ألا يأتيا من السحابة).
4. تطبيق هوية البطل والشخصية (من avatar_id + soroban_avatar_pending_upload).
5. verifyPersistedProgress(...) — قراءة localStorage.getItem('cloud:sorobanmind-v2-progress') ومقارنة state مع useProgressStore.getState() (بعد تجريد childName/parentName).
6. writeLocalValueVerified('OWNER_KEY', user.id) — آخر خطوة، بعد التحقق من كل ما سبق.
7. التحقق من أن OWNER_KEY === user.id.

قاعدة: أي فشل قبل الخطوة 6 → restoreAdoptionSnapshot(snapshot) — Rollback كامل.

3.5 Stage 5 — Finalize

الهدف: إعلان النجاح فقط بعد أن أصبح الحساب الجديد المالك المحلي المؤكد.

الشروط:

· جميع خطوات Commit نجحت.
· OWNER_KEY === user.id (تحقق نهائي).
· إذا كان changed=true → إعادة تحميل الصفحة (بعد الاعتماد، لا قبله).

النتيجة: return { success: true, changed }.

عند فشل Commit:

· إذا نجح Rollback → throw الخطأ الأصلي (يُفهم أن البيانات محمية).
· إذا فشل Rollback → throw ADOPTION_ROLLBACK_FAILED (خطأ مركّب يوضح الكارثة المزدوجة).

---

4. تفاصيل loginParent الجديدة

4.1 التوقيع

```
loginParent(email: string, password: string): Promise<User>
```

نُبقي على User كقيمة إرجاع لتجنب تعديل AuthModal (فقط CloudSyncError هي التغيير المرئي).

4.2 التسلسل

```
1. requireCloudMode() — إذا ليس Cloud، throw.
2. الحصول على Web Lock (أو رفض بـ AUTH_FLOW_BUSY).
3. التحقق من authFlowInProgress → إذا مشغول، رفض.
4. set authFlowInProgress = true (داخل try/finally).
5. await captureAuthSession() — حفظ الجلسة السابقة في الذاكرة.
6. await supabase.auth.signInWithPassword({email, password}).
   - إذا error → throw (لا rollback مطلوب، لم تتغير الجلسة).
7. await adoptUser(data.user).
   - إذا throw CloudSyncError:
     a. استدعِ restoreAuthSession(previousSession).
     b. إذا نجح → أعد رمي الخطأ الأصلي.
     c. إذا فشل → fallback: signOut({scope: 'local'}) → رمي SESSION_RESTORE_FAILED.
8. return data.user.
9. finally: set authFlowInProgress = false + release Web Lock.
```

نقطة حرجة: captureAuthSession() يُستدعى بـ await مباشرة قبل signInWithPassword — لا شيء بينهما (لا كتابة، لا إعادة تحميل، لا async آخر).

---

5. تفاصيل verifyOtp الجديدة

5.1 التوقيع (بدون تغيير)

```
verifyOtp(email, token, type: 'signup' | 'recovery'): Promise<OTPData>
```

5.2 التسلسل

```
1. requireCloudMode().
2. الحصول على Web Lock (نفسه، مشترك مع loginParent).
3. captureAuthSession().
4. تنظيف token (تحويل الأرقام العربية إلى لاتينية).
5. supabase.auth.verifyOtp(...).
6. إذا error → throw.
7. إذا لا data.session → return data (لا اعتماد مطلوب).
8. adoptUser(data.session.user).
   - نجاح → في signup: محاولة upsert {} (لكن لا يعتمد نجاح الاعتماد عليه).
   - فشل → restoreAuthSession أو fallback.
9. return data.
```

ملاحظة: verifyOtp لا تحتاج changed — يكفيها throw مقابل return.

---

6. تفاصيل pullProgress (تحويل جذري)

6.1 التوقيع الجديد

```
pullProgress(userId): Promise<ProgressFetchResult>
```

6.2 ProgressFetchResult

```
{
  rowExists: boolean;
  progressData: Record<string, unknown> | null;
}
```

6.3 القواعد

· Fetch-only — لا تعديل Zustand، لا تعديل localStorage.
· فحص error صريحاً — throw PROGRESS_FETCH_FAILED عند أي خطأ.
· تمييز بين rowExists=false (حساب جديد) و rowExists=true, progressData={} (سجل فارغ).

6.4 المستدعي الوحيد

· adoptUser (السطر 192 في الكود الحالي).

لا يوجد مستدعٍ آخر — مؤكد بالفحص.

---

7. التحقق من Zustand (تفاصيل تقنية)

7.1 لماذا rehydrate() مرفوض

rehydrate() تستبدل الحالة الحالية في الذاكرة بما هو مخزّن في localStorage. إذا كان localStorage قديماً (من الحساب A)، سيعيد rehydrate بيانات A فوق بيانات B — كارثة.

7.2 البديل: قراءة مباشرة ومقارنة عميقة

```
1. اقرأ raw = localStorage.getItem('cloud:sorobanmind-v2-progress').
2. إذا null → throw PERSIST_VERIFY_FAILED (KEY_MISSING).
3. parse JSON → إذا فشل → throw PERSIST_VERIFY_FAILED (JSON_INVALID).
4. استخرج { state, version }.
5. إذا version !== 14 → throw PERSIST_VERIFY_FAILED (VERSION_MISMATCH).
6. خذ expected = useProgressStore.getState() — لكن استبعد:
   - childName, parentName (يجب ألا تُسلسل للـ cloud).
   - أي دوال.
7. مقارنة عميقة (deep equal) بين state المخزّن و expected بعد تجريد الحقول المذكورة.
8. إذا اختلفت → throw PERSIST_VERIFY_FAILED (STATE_MISMATCH).
```

7.3 حالة {} (حساب جديد)

لا نقارن مع {} مباشرة. بدلاً من ذلك:

· progressStore.reset() يُعيد initialState.
· Zustand persist يكتب initialState كاملاً (مع جميع الحقول الافتراضية).
· نتحقق من وجود state يحتوي على هذه الحقول الافتراضية.
· ليس "وجدنا {}" — بل "وجدنا الحالة الابتدائية الكاملة".

---

8. Helpers الجديدة (12)

# الاسم التوقيع المسؤولية
1 captureAuthSession (): Promise<PreviousAuthSession \| null> حفظ access/refresh/userId في الذاكرة
2 restoreAuthSession (prev: PreviousAuthSession \| null): Promise<void> استعادة أو fallback
3 captureAdoptionSnapshot (): AdoptionSnapshot حفظ progressStore + cloud:* + OWNER_KEY + الهوية
4 snapshotCloudKeys (): CloudKeySnapshot حفظ مفاتيح cloud:* مع قيمها
5 removeCloudKeysVerified (keys: string[]): void حذف + تحقق
6 restoreAdoptionSnapshot (snap: AdoptionSnapshot): Promise<void> Rollback
7 fetchProfile (userId: string): Promise<ProfileFetchResult> جلب avatar_id + فحص error
8 validateFetchedData (profile, progress): ValidatedData فحص البنية + تحويل avatar_id غير صالح
9 applyFetchedProgress (data: ProgressData): void تطبيق البيانات بعد reset
10 verifyPersistedProgress (expected: ProgressState): void قراءة localStorage + مقارنة عميقة
11 writeLocalValueVerified (key: string, value: string): void كتابة + قراءة تحقق
12 finalizeAdoption (result: {changed: boolean}): void إعادة تحميل + إرجاع
13 applyLocalIdentityVerified (display: string): void مسار صارم داخل adoptUser فقط

+ مساعد إضافي: throwCloudSyncError(code, message?) — لتوحيد رمي الأخطاء.

---

9. الملفات: داخل النطاق وخارجه

9.1 داخل النطاق (ملفان فقط)

الملف طبيعة التعديل
src/lib/cloudSync.ts تعديل جوهري (adoptUser + loginParent + verifyOtp + pullProgress + helpers + locks + CloudSyncError)
src/components/AuthModal.tsx محدود: إضافة استيراد CloudSyncError، وتحديث getFriendlyError لترجمة error.code

9.2 ملفات مجمّدة (لا تُلمس ما لم يثبت اختبار ضرورة)

· src/data/srb-adapter.ts — واجهة فقط، لا يلمس localStorage.
· src/store/progressStore.ts — يُستخدم كما هو.
· src/utils/storage.ts — لا تعديل شامل.
· src/App.tsx, AppGate.tsx, RoleSelection.tsx — تدفق التنقل.
· logoutParent, registerParent, saveToCloud, loadFromCloud, retryPendingAvatar, setMyAvatar, getSession, getCurrentUser — دوال لا علاقة لها بـ P1-01.

استثناء وحيد: إذا كشف اختبار C1-C20 ضرورة تعديل RoleSelection.tsx أو App.tsx (بسبب getSession بعد تغيير الجلسة)، يُعلن مسبقاً بنطاق واضح.

---

10. الاختبارات (C1 → C20)

# السيناريو النتيجة المطلوبة
C1 فشل قراءة public_profiles توقف + استعادة الجلسة السابقة + بقاء بيانات A
C2 انقطاع الشبكة أثناء soroban_progress لا مسح، لا اعتماد، خطأ صريح
C3 حساب جديد بلا سجل تقدم اعتماد بحالة ابتدائية نظيفة
C4 سجل موجود وprogress_data = {} اعتماد بحالة ابتدائية
C5 فشل الكتابة في Stage 4 Rollback كامل، لا تغيير في OWNER_KEY
C6 A → B → A بيانات مستقلة، لا خلط
C7 نجاح Auth + فشل Adoption لا onSuccess(), استعادة الجلسة السابقة أو fallback
C8 تسجيل دخول بالحساب نفسه LOCAL WINS, لا تحميل من السحابة
C9 فشل Rollback نفسه خطأ مركّب ADOPTION_ROLLBACK_FAILED واضح
C10 فشل setMyAvatar بعد Commit لا يفسد اعتماد التقدم، pending marker يبقى
C11 فشل adoptUser + setSession + signOut رسالة C11، لا جلسة، بيانات A محفوظة
C12 نقرتان على "تسجيل الدخول" الثانية مرفوضة بـ AUTH_FLOW_BUSY
C13 Login + OTP متزامنان واحدة فقط تبدأ
C14 Login في تبويبين (Web Locks) التبويب الثاني مرفوض
C15 avatar_id غير موجود في allowed_avatars تحويل إلى null، اعتماد ناجح
C16 فشل كتابة soroban_child_name Rollback
C17 فشل كتابة Zustand بعد reset Rollback
C18 تسجيل دخول بعد فشل مزامنة سابقة LOCAL WINS، لا استبدال سحابي
C19 retryPendingAvatar أثناء Login يجب أن يفحص authFlowInProgress
C20 OWNER_KEY=A + تقدم محلي مفقود لا استعادة تلقائية (P2-08 ملغى)، توثيق

قاعدة: تُنفَّذ على حسابات اختبار معزولة — لا على الخمسة الحاليين.

---

11. القيود المعروفة (Known Limitations)

القيد الأثر القرار
Snapshot في الذاكرة لا يحمي من إغلاق المتصفح القسري أثناء Stage 4 مقبول (موثق، مؤجل لـ P4)
Web Locks غير متوفرة رفض العملية (لا ادعاء حماية) Fail-safe صحيح
onAuthStateChange غير موجود لا حاجة لتعطيل مستمع مؤكد بالفحص
progressStore.persist متزامن لا حاجة لانتظار microtask مؤكد
إعادة التحميل بعد Finalize window.location.reload() — يحتاج تأكيد في التنفيذ TBD (لا يمنع التصميم)

---

12. نقاط تحقق مفتوحة (قبل التنفيذ في المرحلة 7)

☐ C1-C10 vs C1-C20: الجدول في هذا المستند يعتمد C1-C20. تأكد أن GPT لا يزال على نفس الفهم.
☐ Web Locks + الأقفال: رغم وجودها في هذا المستند، يجب التأكد أن مخطط GPT يشملها صراحةً.
☐ استبعاد childName/parentName من verifyPersistedProgress: يجب أن يوثّق صراحةً كيف يُستبعدان في المقارنة.
☐ آلية إعادة التحميل: window.location.reload() vs بديل — قرار تنفيذي، لا يمنع التصميم.
☐ مطابقة الكود الفعلي: قبل التنفيذ، قارن src/lib/cloudSync.ts وsrc/components/AuthModal.tsx على GitHub مع الأرشيف المستخدم في الفحص.

---

13. المرجعية (Cross-References)

· UNIFIED_REFERENCE.md — قسم Phase 1 — اعتماد التصميم.
· Risk_Register_SorobanMind_v1.md — البند P1-01.
· P1_01_Questions.md — أرشيف 18 سؤالاً وإجابتها (مرجع تاريخي).
· Master_Remediation_Plan.md — ترتيب P1-01 في خارطة التنفيذ (المرحلة 7).

---

نهاية المستند — P1_01_Design.md

```

---

## ✅ ملاحظات على المحتوى

1. **التوسّع في الشرح:** كل قرار يحتوي على "المبرر" صراحةً — لا قرار بدون سبب.
2. **لم أكتب أي كود تنفيذي:** فقط pseudocode + توقيعات + جداول.
3. **حلّ التناقضات:** اعتمدت **C1-C20** (لأنها النسخة النهائية المعتمدة في `UNIFIED_REFERENCE`).
4. **حلّ غياب الأقفال:** أضفت قسم 2.2 يشمل `authFlowInProgress` + `adoptionInProgress` + Web Locks.
5. **حلّ Zustand verification:** أوضحت في 7.2-7.3 كيف تُستبعد `childName`/`parentName` وكيف تُقارن الحالة.
6. **حلّ إعادة التحميل:** وضعتها كـ TBD (لا يمنع التصميم، قرار تنفيذي).
7. **قسم 12 "نقاط تحقق مفتوحة":** يضع علامات على نقاط تحتاج مراجعة قبل التنفيذ.

**هذا الملف يجب أن يكون كافياً لأي مبرمج أو مساعد AI ليُنفذ Phase 1 بأمان في المرحلة 7.**

