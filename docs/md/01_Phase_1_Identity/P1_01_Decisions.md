# P1-01 — جدول الأسئلة والقرارات النهائية

| # | السؤال (مختصر) | القرار النهائي | السبب المختصر |
|---|----------------|----------------|----------------|
| 1 | نطاق الملفات في Phase 1 | `cloudSync.ts` هو الملف الأساسي الوحيد؛ الباقي مجمّد ما لم يثبت اختبار الفوضى ضرورة (عُدّل لاحقاً: تعديل محدود في `AuthModal.tsx`، انظر #34) | حصر النطاق ومنع توسع الإصلاح |
| 2 | ترتيب عملية اعتماد الحساب | خمس مراحل: Snapshot ← Fetch ← Validate ← Commit ← Finalize | لا مسح قبل نجاح الجلب والتحقق |
| 3 | التمييز بين حساب جديد وفشل الشبكة | `error` موجود = إيقاف دون مسح؛ لا خطأ و`data=null` = تقدم فارغ؛ سجل صالح = تحقق ثم تطبيق | غياب البيانات وحده ليس دليل نجاح الجلب |
| 4 | هل نستدعي `pullProgress` في Stage 2 أم 4؟ | لا نستخدمها بصيغتها الحالية؛ نفصلها إلى Fetch-only (Stage 2) وتطبيق منفصل (Stage 4) | الدالة الحالية تجمع الجلب والتعديل وتدمج دمجاً سطحياً |
| 5 | إلغاء الجلسة: `signOut()` أم أقل تدخلاً؟ | استعادة الجلسة السابقة بـ`setSession`، وإلا `signOut({ scope: 'local' })` | `signOut()` الافتراضي عالمي وينهي جلسات الأجهزة الأخرى |
| 6 | توقيع `adoptUser` | تعديل العقد: يعيد `{ success: true, changed }` ويرمي خطأ عند الفشل | `false` كانت تعني أحياناً "نفس الحساب" وأحياناً "فشل" |
| 7 | التحقق من الكتابة: `storage.ts` أم محلياً؟ | مساعد محلي داخل `cloudSync.ts` دون تعديل `storage.ts` | `storage.ts` Adapter عام يستخدمه Zustand والإعدادات وغيرها |
| 8 | Q1: مستدعو `adoptUser` | تعريف `cloudSync.ts:156`، استدعاءان فقط: `verifyOtp` (:274) و`loginParent` (:289)؛ `AuthModal` يستدعي `verifyOtp` (156، 210) و`loginParent` (170) | الاستدعاء عند :192 هو `pullProgress` وليس `adoptUser` |
| 9 | Q1: تغيير كل مستدعٍ بعد العقد الجديد | `loginParent`: استعادة الجلسة عند الفشل وإعادة `User`؛ `verifyOtp`: حفظ الجلسة ثم الاعتماد ثم استعادة عند الفشل، وشكل الإرجاع كما هو | تقليل نطاق التعديل وعدم المساس بواجهة `AuthModal` |
| 10 | Q1: هل تستخدم `verifyOtp` قيمة `changed`؟ | لا؛ نجاحها يعتمد على عدم رمي `adoptUser`؛ وإعادة التحميل مسؤولية Finalize داخل `adoptUser` | فصل المسؤوليات |
| 11 | Q2: ماذا نحفظ من الجلسة السابقة وأين | `getSession()` قبل الدخول؛ نحفظ `accessToken` و`refreshToken` و`userId` في متغير ذاكرة محلي فقط؛ فشل القراءة = لا نبدأ الدخول | الرموز حساسة ولا حاجة لنسخة دائمة |
| 12 | Q2: كيف نستعيد الجلسة (Supabase v2) | `supabase.auth.setSession({ access_token, refresh_token })` مع فحص `error` و`data.session` و`data.user` | الاستدعاء دون فحص النتيجة لا يثبت النجاح |
| 13 | Q2: كيف نكتشف فشل الاستعادة | فشل إذا: `error`، أو لا session، أو لا user، أو `user.id` مختلف، أو فشل `getUser()`؛ لا نرفض بسبب انتهاء `access_token` فقط | قد يكون `refresh_token` صالحاً |
| 14 | Q2: الـ Fallback | `signOut({ scope: 'local' })` فقط | لا ينهي جلسات الأجهزة الأخرى |
| 15 | Q2: معايير نجاح الاستعادة | `getSession().user.id` و`getUser().data.user.id` يساويان `previous.userId`؛ لا نقارن الرموز حرفياً | الرمز قد يُحدَّث أثناء الاستعادة |
| 16 | Q2: هل ينطبق على `verifyOtp` | نعم (signup وrecovery)؛ لا استعادة إذا لم تُرجع OTP جلسة | كلاهما قد ينتج جلسة جديدة |
| 17 | Q3: `storage.getItem` أم `rehydrate()` | قراءة مباشرة `localStorage.getItem('cloud:sorobanmind-v2-progress')` | `getItem` يبتلع الأخطاء و`rehydrate` لا يثبت أن آخر Commit كُتب |
| 18 | Q3: ماذا نقارن | غلاف persist (`state` + `version`)؛ مقارنة عميقة بعد توحيد ترتيب المفاتيح مع استبعاد الدوال | ترتيب المفاتيح قد يختلف دون اختلاف البيانات |
| 19 | Q3: عند فشل التحقق | رمي خطأ ← Rollback؛ وفشل Rollback يرمي خطأ مركباً | لا إخفاء للفشل ولا كتابة `OWNER_KEY` |
| 20 | Q3: حالة `{}` / لا صف | لا صف أو `{}` = حالة ابتدائية؛ نتحقق من حفظ `initialState` الكامل؛ صف بـ`null` أو غير كائن = رفض | النجاح يعني حفظ الحالة الابتدائية لا وجود `{}` |
| 21 | Q4: الدوال الجديدة | `captureAuthSession`, `restoreAuthSession`, `captureAdoptionSnapshot`, `snapshotCloudKeys`, `fetchProfile`, `validateFetchedData`, `removeCloudKeysVerified`, `restoreAdoptionSnapshot`, `writeLocalValueVerified`, `verifyPersistedProgress`, `applyFetchedProgress`, `finalizeAdoption` | تثبيت المسؤوليات |
| 22 | Q4: الدوال المعدّلة | `adoptUser`, `loginParent`, `verifyOtp`, `pullProgress`, `wipeLocalProgress` | تدخل مباشرة في مسار الاعتماد |
| 23 | Q4: الدوال التي تبقى | `registerParent`, `logoutParent`, `getSession`, `getCurrentUser`, `saveToCloud`, `loadFromCloud`, `retryPendingAvatar`, `applyLocalIdentity`, `setMyAvatar` | ليست جزءاً من P1-01 |
| 24 | Q4: نفس الحساب أم مختلف | `changed = !owner \|\| owner !== user.id`؛ إذا `false`: لا مسح ولا Reset ولا سحب من السحابة | حماية تقدم محلي أحدث من السحابة |
| 25 | Q4: تسلسل `loginParent` | `requireCloudMode` ← `captureAuthSession` ← `signInWithPassword` ← `adoptUser` ← عند الفشل `restoreAuthSession` وإعادة رمي الخطأ ← إرجاع `data.user` | rollback للجلسة فقط بعد نجاح الدخول وفشل الاعتماد |
| 26 | Q4: تسلسل `verifyOtp` | `requireCloudMode` ← `captureAuthSession` ← تنظيف الرمز ← `verifyOtp` ← (إن وُجدت جلسة) `adoptUser` ← استعادة عند الفشل ← إرجاع `data` | الحفاظ على شكل الإرجاع الحالي |
| 27 | Q4: تسلسل `adoptUser` | Snapshot ثم Fetch (دون تعديل) ثم Validate ثم Commit (مسح ← Reset ← تطبيق ← تحقق ← كتابة `OWNER_KEY` أخيراً ← تحقق) ثم Finalize؛ Rollback عند أي فشل | الالتزام بعد التجهيز والتحقق فقط |
| 28 | ن1: Race condition | قفلان: `authFlowInProgress` (في `loginParent`/`verifyOtp`) و`adoptionInProgress` (في `adoptUser`)؛ Web Locks باسم `sorobanmind-auth-adoption` مع رفض العملية الثانية لا انتظارها؛ عند غياب Web Locks رفض آمن | قفل `adoptUser` وحده لا يحمي تغيير الجلسة |
| 29 | ن2: هل `reset()` يحتاج تحققاً | لا؛ نتحقق من كتابة persist بعده | `reset()` متزامن في الذاكرة، والخطر في `storage.setItem` |
| 30 | ن3: `changed=false` وفشل `saveToCloud` | LOCAL WINS؛ تسجيل P2-Future: تحديث يدوي من السحابة خارج Phase 1 | المحلي قد يكون أحدث؛ والزر يفتح مساراً لإدارة التعارض |
| 31 | ن4: توقيت `captureAuthSession` | القفل ← `requireCloudMode` ← `await captureAuthSession()` ← مباشرة `signInWithPassword` دون أي شيء بينهما | التقاط آخر جلسة مستقرة قبل تغييرها |
| 32 | ن5: رسائل الخطأ | `CloudSyncError` برمز ثابت (`code`, `message`, `reason`)؛ الترجمة عربي/إنجليزي في `AuthModal` عبر `getFriendlyError` و`pickLang` | طبقة المصادقة لا تعرف اللغة |
| 33 | ن6: حالة `AuthModal` بعد الفشل | لا Reset شامل؛ تبقى المدخلات وتعود الشاشة تفاعلية | الاحتفاظ بالمدخلات يسهّل إعادة المحاولة |
| 34 | ن6: هل نكسر تجميد `AuthModal.tsx` | نعم، تعديل محدود: ترجمة الرموز + تعطيل الرجوع/تعديل البريد أثناء العملية | سببان محددان فقط |
| 35 | ن7: استدعاءات `pullProgress` | تعريف :109 واستدعاء وحيد :192 داخل `adoptUser`؛ تتحول إلى Fetch-only؛ `loadFromCloud` تبقى | إصلاح `loadFromCloud` يسحب P2-07 إلى Phase 1 |
| 36 | ن8: `verifyOtp` والقفل | يستخدم قفل المصادقة نفسه؛ OTP أثناء Login جارٍ يُرفض بـ`AUTH_FLOW_BUSY` دون طابور | الطابور قد يعمل على جلسة تغيّرت |
| 37 | ن9: أنواع فشل `verifyPersistedProgress` | رمز عام `PERSIST_VERIFY_FAILED` + سبب داخلي (`KEY_MISSING`, `JSON_INVALID`, `VERSION_MISMATCH`, `STATE_MISMATCH`, `READ_EXCEPTION`) | للمستخدم كلها تعني عدم إثبات الحفظ |
| 38 | ن10: `avatar_id` غير صالح | الخيار (ب): تحويله محلياً إلى `null` وإكمال الاعتماد مع تحذير داخلي؛ لا كتابة `null` إلى القاعدة | الشخصية لا تمنع وصول الطفل لتقدمه |
| 39 | ن11: رسالة فشل التراجع المزدوج (C11) | رسالة: "تعذر إكمال تسجيل الدخول، ولم نتمكن من استعادة الجلسة السابقة. تم تسجيل الخروج من هذا الجهاز لحماية بياناتك. يرجى المحاولة مجدداً."؛ وإضافة C11 | "مشكلة اتصال" ليست دقيقة دائماً |
| 40 | ن12: `applyLocalIdentity` | مسار صارم `applyLocalIdentityVerified` داخل الاعتماد فقط دون تغيير بقية المستدعين | `getSession` و`getCurrentUser` تستدعيانها |
| 41 | ن13: تزامن persist والإصدار 14 | الكتابة متزامنة فالتحقق مباشر؛ الإصدار 14 ترحيل فعلي متوقع ولا P2 جديد | لا انتظار مؤجل ولا دليل على حالة ملوثة |
| 42 | ن14: `retryPendingAvatar` أثناء `adoptUser` | تأكيد الاسم (والمتغير `retryingAvatar` هو القفل الداخلي)؛ يجب أن تتحقق من قفلي المصادقة/الاعتماد وتخضع لقفل Web Locks وتعيد قراءة المفاتيح بعد الانتظار | تُستدعى من `getSession()` في `App.tsx` و`RoleSelection.tsx` فقد ترفع شخصية A للحساب B |
| 43 | ن15: `onAuthStateChange` | غير موجود في المصدر؛ لا حاجة لتعطيل مستمع؛ يبقى `restoreAuthSession` داخل التدفق المقفول | تم التحقق بالبحث |
| 44 | ن16: `OWNER_KEY=A` والتقدم المحلي فارغ | لا سحب تلقائي؛ يبقى LOCAL WINS؛ إضافة C20 وبند P2-08 (استعادة يدوية) | لا نميز بين خلل سابق وتصفير مقصود |
| 45 | ن17: الحسابات الخمسة | الخيار (ب): إبقاؤها وفحصها للقراءة فقط دون حذف؛ اختبارات الفشل على بيانات/حساب اختبار معزول | لا دليل أنها كلها تجريبية، والحذف لا يحسّن الاختبار |
| 46 | ن18: مكان قفل `adoptionInProgress` | متغيرات على مستوى الملف + Web Locks بين التبويبات؛ ليس `localStorage` ولا `sessionStorage`؛ نفترض الحاجة لحماية Cross-Tab | `localStorage` قد يعلق، و`sessionStorage` لا ينسق بين التبويبات |
| 47 | سؤال استراتيجي: كتابة الكود الآن؟ | لا؛ نثبت التصميم ونؤجل الكود الكامل حتى تخطيط المراحل 2–4: دفعة A الآن (الجلسة، Snapshot، التحقق، Finalize، الأقفال)، B بعد Phase 2، C بعد Phase 3 | تجنب إعادة كتابة دوال مشتركة مع مراحل لاحقة |
