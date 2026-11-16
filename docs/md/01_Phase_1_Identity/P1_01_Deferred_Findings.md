# P1-01 — القرارات الملغاة / المؤجلة والاكتشافات / التحذيرات

## أولاً: قرارات ملغاة أو مستبدلة

- جعل `false` تعني الفشل و`true` النجاح في `adoptUser`.
- إضافة غلاف `adoptUserOrFail()` فوق الدالة الحالية.
- استخدام `signOut()` الافتراضي (عالمي) كـ rollback.
- نسخ مفاتيح `sb-*` يدوياً لاستعادة الجلسة.
- تعديل `storage.ts` في Phase 1.
- استخدام `pullProgress()` بصيغتها الحالية (Fetch + Apply معاً).
- استخدام `persist.rehydrate()` أو `storage.getItem` وحده كوسيلة تحقق.
- رسائل عربية ثابتة داخل `cloudSync.ts` (استُبدلت بـ`CloudSyncError` برموز).
- قفل `adoptionInProgress` عبر `localStorage` أو `sessionStorage`.
- طابور انتظار لعملية OTP/Login الثانية (استُبدل بالرفض).
- خيارا الشخصية (أ) رفض الاعتماد و(ج) طلب إعادة الاختيار.
- سحب السحابة تلقائياً عند `OWNER_KEY=A` مع تقدم محلي فارغ.
- حذف المستخدمين الخمسة أو نسخهم ثم حذفهم.
- نص رسالة C11 المقترح ("مشكلة في الاتصال") استُبدل بنص أدق.
- كتابة الكود الكامل لكل الدوال الأربع عشرة الآن.
- تجميد `AuthModal.tsx` بالكامل (استُبدل بتعديل محدود).
- مجموعة C1–C7 → وُسّعت إلى C1–C10 ثم C1–C20.

## ثانياً: قرارات مؤجلة

- **P2-07**: إصلاح الدمج السطحي في `loadFromCloud`.
- **P2-Future**: زر/مسار تحديث يدوي من السحابة مع تحذير وSnapshot/Rollback.
- **P2-08**: استعادة تقدم الحساب نفسه بعد فقدان النسخة المحلية.
- **P2-02**: تأثيره المحتمل على `applyLocalIdentityVerified` (`soroban_child_full_name`).
- سجل معاملات/Journal دائم للتراجع بعد إغلاق الصفحة قسرياً (يحتاج قرار مستقل).
- دفعة الكود B بعد Phase 2: `snapshotCloudKeys`, `removeCloudKeysVerified`, `applyFetchedProgress`, `writeLocalValueVerified`, `safeSetItem`, `safeRemoveItem`, `pullProgress`.
- دفعة الكود C بعد Phase 3: `applyLocalIdentityVerified`، وتعديلات `finalizeAdoption` المرتبطة بالخصوصية.
- اختبار ترحيل بيانات إصدار أقدم من v14 (فقط إن كان ضمن نطاق الاختبار).
- مراجعة `App.tsx` و`RoleSelection.tsx` (مجمّدان إلا إن كشف الاختبار ضرورة).
- إعادة تصميم مزامنة الشخصية (رفع `set_my_avatar`) خارج Phase 1.
- مطابقة `cloudSync.ts` و`progressStore.ts` و`storage.ts` مع نسخة GitHub قبل التنفيذ.

## ثالثاً: اكتشافات وتحذيرات

- `adoptUser` تعيد `false` في حالتين مختلفتين: نفس الحساب، وفشل قراءة `public_profiles`.
- `loginParent` تتجاهل القيمة المرجعة فتُعرض رسالة نجاح ويُستدعى `onSuccess()` حتى مع فشل الاعتماد.
- `pullProgress` تستخرج `data` فقط ولا تفحص `error`، فلا يكتشف `catch` الفشل بالضرورة.
- `wipeLocalProgress` تتجاهل أخطاء الحذف، و`storage.setItem` يبتلع أخطاء الكتابة، و`getItem` يعيد `null` عند الخطأ.
- `signInWithPassword` يغيّر جلسة Supabase قبل بدء `adoptUser`، فمنع `onSuccess()` وحده لا يعيد الجلسة.
- `signOut()` بلا نطاق عالمي وقد ينهي جلسات الأجهزة الأخرى.
- لا يوجد دليل على أن بيانات الحساب السابق ستظهر دائماً؛ المؤكد هو غياب ضمان اكتمال الاستعادة.
- لم تُوجد في الأرشيف قائمة C1–C7 الأصلية؛ المقدَّمة إعادة بناء مقترحة.
- أرقام الأسطر من `source.zip` (15 نوفمبر 2026) وقد لا تطابق GitHub حرفياً.
- Snapshot في الذاكرة ليس معاملة ذرية ولا يحمي من إغلاق الصفحة أو انقطاع الطاقة وسط الالتزام (مخاطرة متبقية).
- `setSession` يستعيد الجلسة المحلية فقط ولا يعكس التحقق من OTP على الخادم.
- فشل `signOut({ scope: 'local' })` نفسه حالة أشد خطورة تحتاج اختباراً منفصلاً وعدم ادعاء أن الجهاز بلا جلسة.
- `upsert` سجل `{}` بعد OTP لا يفحص `error`؛ ولا يجب أن يعتمد نجاح الاعتماد عليه.
- `retryPendingAvatar` تُستدعى من `getSession()` في `App.tsx` و`RoleSelection.tsx` وليس عند بدء التطبيق فقط (خطر رفع شخصية الحساب السابق).
- `applyLocalIdentity` لا تكتب `soroban_hero_key` بل `soroban_child_name` في `try/catch` صامت، و`setChildName` يمر عبر persist الذي يبتلع الأخطاء.
- `logoutParent` عند `force=false` يعيد `false` دون `signOut` إذا فشل `saveToCloud`؛ لكن إغلاق التطبيق أو `logoutParent(true)` قد يترك المحلي أحدث من السحابة.
- قيد معروف: مستخدم بجهازين لا يرى تقدم B على A تلقائياً (LOCAL WINS).
- `loadFromCloud` لها جلبها المستقل (:365–400) وتطبق البيانات بنفسها.
- لا يوجد `onAuthStateChange` في `src`.
- لا يصح الاعتماد على قفل `localStorage` كقفل ذري؛ ويجب إثبات دعم Web Locks أو الرفض الآمن.
- طلب "14 دالة" يعني فعلياً 16 عنصراً مع القفل و`applyLocalIdentityVerified`.
- استعادة الجلسة السابقة تعتمد على صلاحية الرموز ويجب اختبارها فعلياً.
- يجب تنفيذ اختبارات الفوضى على حسابات/بيانات اختبار معزولة لا على الحسابات الخمسة.
- `adoptUser` مستخدمة في `verifyOtp` أيضاً، ويجب ألا يبقى أي مستدعٍ يتوقع Boolean.
