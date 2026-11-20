# PHASE_3_EXECUTION.md — الخصوصية والحماية واستمرارية المزامنة

> الترتيب: **P2-01 ← P2-02 ← P2-06 ← P2-06b**، كل بند Commit مستقل (`P2-06b` منفصل عن `P2-06`).
> لا تبدأ قبل إغلاق بوابة Phase 2. الخطوة 0 (مطابقة GitHub) إلزامية لكل بند.
> **مجمّد:** `App.tsx`، `utils/storage.ts` (الكتابة تبقى بـ `localStorage` المباشر كما هو الحالي)، SQL، `CertificateScreen`، `KidsCertificateScreen`.

---

## P2-01 — Avatar Pending Upload

### الحالة الفعلية
- `ProfileScreen.tsx` `handleSave` (L132–170): يكتب `soroban_hero_key` محلياً ثم في Cloud يستدعي `setMyAvatar`. عند الفشل: `alert` + `return` **بلا كتابة `soroban_avatar_pending_upload`** ← لا إعادة محاولة لاحقاً (الفجوة الفعلية).
- القفل `isSaving` حالة React (`useState`) فقط ← سباق نقر مزدوج ممكن.
- العلم يُكتب حالياً في `RoleSelection.tsx` L138 و`AppGate.tsx` L39 فقط (لا تُمس).
- `cloudSync.retryPendingAvatar` (L322) يقارن `soroban_hero_key` الحالي بـ`keyAtStart` قبل حذف العلم ← **يحقق شرط «لا يحذف علم B بنجاح A» أصلاً**؛ يُعاد فحصه فقط (C103).
- `setMyAvatar` (L765) يرجع `boolean` ويبتلع الأخطاء. `retryPendingAvatar` غير مُصدَّر ويُشغَّل من `getSession()`.

### الملفات
مسموح: `src/screens/ProfileScreen.tsx`. `cloudSync.ts`: **بلا تعديل متوقع** (عدّله فقط إن أثبت C103 ثغرة).

### الخطوات
1. أضف `const savingRef = useRef(false);` (استورد `useRef` إن لم يكن مستورداً). أول `handleSave`: `if (savingRef.current) return; savingRef.current = true;` وفي `finally` أعدها `false` مع `setIsSaving(false)`. أبقِ `isSaving` للواجهة.
2. في فرع `if (isCloudMode)` **قبل** `await cloudSync.setMyAvatar(selectedAvatarId)`: `try { localStorage.setItem('soroban_avatar_pending_upload','1'); } catch { /* فشل التخزين */ }` ولا تُعلن نجاح المزامنة إن فشلت كتابة العلم (C108: أظهر تنبيهاً بدل رسالة نجاح).
3. بعد `synced === true`: `localStorage.removeItem('soroban_avatar_pending_upload')` **بشرط** `localStorage.getItem('soroban_hero_key') === selectedAvatarId`.
4. عند الفشل: أبقِ العلم (لا تحذفه) واحتفظ بالتنبيه الحالي.
5. وضع Local: لا كتابة علم ولا رفع (C106).
6. **أبقِ دون تغيير:** كتابة `soroban_theme_key` (تُعالج في P3-01)، `onSave/onBack`، خوارزمية الشخصية.
7. **ممنوع:** سجل تاريخي للشخصيات، تغيير SQL/Schema، تعديل `setMyAvatar/adoptUser`.

### الاختبارات C100–C109 — NOT RUN
C100 العلم قبل الرفع، C101 حذفه عند النجاح، C102 بقاؤه عند الفشل، C103 تغيير الشخصية أثناء الرفع، C104 `retryPendingAvatar` يرفع الأحدث، C105 لا pending ← لا رفع، C106 Local، C107 نقر مزدوج، C108 فشل تخزين العلم، C109 نطاق `git diff`.
Commit: `P2-01: persist pending avatar flag before upload`. تراجع `git revert`.

---

## P2-02 — تنظيف `soroban_child_full_name`

### الحالة الفعلية
- المفتاح يُكتب/يُقرأ في `CertificateScreen` (L50/65/77) و`KidsCertificateScreen` (L72/82/94) فقط، ومستثنى من التصدير في `GuardianDashboard` L168.
- `GuardianDashboard.handleReset` (L572): Local فقط؛ قائمة `localProgressKeys` **لا تتضمن** المفتاح.
- `RoleSelection.handleLogout` (L77–97): `logoutParent()`؛ عند الفشل `confirm`؛ الإلغاء ← `return` (الاسم يبقى ✔)؛ ثم `localStorage.removeItem(NAME_STORAGE_KEY)` (= `soroban_child_name`) فقط.
- `cloudSync.adoptUser` L420: ضمن `if (different)` يحذف `soroban_child_name` و`hero_key`؛ الاسم الكامل غير محذوف. وSnapshot يلتقطه (بادئة `soroban`) فيعيده Rollback ✔.

### الملفات
`GuardianDashboard.tsx`، `RoleSelection.tsx`، `cloudSync.ts`.

### الخطوات
1. **GuardianDashboard `handleReset`:** أضف `'soroban_child_full_name'` إلى `localProgressKeys` (مع المفاتيح غير المسبوقة).
2. **RoleSelection `handleLogout`:** بعد نجاح الخروج (سواء `ok` أو بعد تأكيد `logoutParent(true)`) وبجانب `removeItem(NAME_STORAGE_KEY)` أضف `localStorage.removeItem('soroban_child_full_name');` داخل `try/catch`. مسار الإلغاء (`return`) **لا يُمس**.
3. **cloudSync `adoptUser`:** داخل `if (different)` بعد `removeItem('soroban_child_name')` أضف `localStorage.removeItem('soroban_child_full_name');`.
   - **قرار مطلوب (موافقتك):** `different` يكون `true` أيضاً عند `owner === null` (أول دخول على جهاز بلا مالك). المواصفة تقول «عند اختلاف الحساب» ← الأسلم تقييد الحذف بـ`owner && owner !== user.id`. بدون موافقتك طبّق **القيد** (الأكثر حفظاً للبيانات).
4. **أبقِ دون تغيير:** `hero name`، حذف التقدم والشهادات، اعتماد الحساب نفسه (لا حذف).
5. **ممنوع:** تغيير تدفق المصادقة، لمس `App.tsx/storage.ts/CertificateScreen/KidsCertificateScreen`.

### الاختبارات C110–C119 — NOT RUN
C110 Reset، C111/C114 الإلغاء يبقي الاسم، C112 Logout الإجباري، C113 Logout ناجح، C115 تبديل الحساب، C116 الحساب نفسه، C117 فشل التنظيف لا يُخفى، C118 لا حذف لمفاتيح أخرى، C119 نطاق `git diff`.
> C110/C112 ملاحظة: Reset يعمل Local فقط حالياً (Cloud محجوب بتنبيه) — اختبر Local.

Commit: `P2-02: clear child full name on reset/logout/account switch`.

---

## P2-06 — إبطال Recovery PIN وتسجيل رمز الطوارئ

### الحالة الفعلية (`src/components/LocalPinGuard.tsx`، 501 سطراً)
- `KEYS`: `pinHash/pinSalt/recoveryHash/recoverySalt` (L10–13)، `EMERGENCY_CODE='19871987'` (L22).
- `handleRecovery` (L254–285): `authorized = value === EMERGENCY_CODE` أو مقارنة الهاش. عند النجاح `setMode('newPin')` **دون حذف `recoveryHash/recoverySalt`** (الرمز يبقى صالحاً — الثغرة).
- لا `soroban_emergency_used_at`. القفل الوحيد `busy` (حالة React).
- `GuardianDashboard.tsx` لا يحتوي واجهة PIN/أمان ظاهرة (L170 فلتر تصدير فقط).

### الخطوات
1. أضف `const recoveringRef = useRef(false);` وفي `handleRecovery`: `if (recoveringRef.current) return; recoveringRef.current = true;` + إعادتها في `finally`.
2. أضف `emergencyUsedAt: 'soroban_emergency_used_at'` إلى `KEYS`.
3. في `handleRecovery` ميّز المصدر: `const viaEmergency = value === EMERGENCY_CODE;`
4. **رمز الطوارئ:** عند النجاح `try { localStorage.setItem(KEYS.emergencyUsedAt, new Date().toISOString()); } catch { setError(تحذير AR/EN: «تعذر تسجيل وقت الاستخدام»); }` ثم تابع إلى `newPin` (لا تمنع الاسترداد). لا تخزّن الرمز.
5. **رمز الاسترداد العشوائي:** بعد التحقق وقبل `setMode('newPin')`: `removeItem(recoveryHash)` و`removeItem(recoverySalt)` ثم تحقق أن القراءتين `null`؛ إن لم تتحقق ← `setError('تعذر إبطال رمز الاسترداد…')` و`return` دون الانتقال. أبقِ `pinHash/pinSalt` القديمين.
6. لا حالة Pending Recovery تستأنف بعد إغلاق التطبيق.
7. **GuardianDashboard (قرار مطلوب):** عرض «آخر استخدام» يحتاج موضعاً؛ لا يوجد قسم أمان. اقتراح: سطر صغير للقراءة فقط (قيمة غير موجودة ← «لا يوجد استخدام مسجل»؛ غير صالحة ← «قيمة غير صالحة» عبر `isNaN(Date.parse(v))` دون انهيار). حدّد الموضع بعد فحص الملف وموافقتك.
8. **ممنوع:** إزالة الرمز الثابت، رمز لكل جهاز، سجل تاريخي، زر مسح السجل، وصف الرمز بأنه سر آمن، المساس بتقدم الطفل.

### الاختبارات C120–C138 — NOT RUN
C120–C122 الطوارئ، C123–C127 الـ timestamp (فشل الحفظ ← يسمح مع تحذير)، C128–C129 رمز الاسترداد، C130–C132 الحذف/فشله/عدم إعادة الاستخدام، C133–C135 PIN القديم باقٍ/إغلاق التطبيق، C136 Enter متكرر، C137 لا مساس بتقدم الطفل، C138 نطاق `git diff`.
Commit: `P2-06: invalidate recovery code, log emergency use`.

---

## P2-06b — حماية حفظ PIN الجديد

### الحالة الفعلية
`saveNewPin` (L173–185): أربع `setItem` متتالية بلا Snapshot (`pinHash, pinSalt, recoveryHash, recoverySalt`) ثم `setMode('showRecovery')`. فشل بعد `pinHash` وقبل `pinSalt` ← **PIN تالف** (هاش جديد بملح قديم). يُستدعى من موضعين: الإعداد الأول (L215) وPIN الجديد (L316). الاستدعاءان داخل `try/catch` يعرض «تعذر حفظ PIN الجديد».

### الخطوات (ملف `LocalPinGuard.tsx` فقط)
1. داخل `saveNewPin` بعد حساب الهاشات وقبل الكتابة: `const prev = KEY_LIST.map(k => [k, localStorage.getItem(k)])` (الأربعة).
2. اكتب بالترتيب: `pinSalt` ← `pinHash` ← `recoverySalt` ← `recoveryHash` داخل `try`.
3. بعد الكتابة تحقق بإعادة القراءة (الأربعة تطابق المكتوب).
4. عند أي فشل: Rollback = لكل مفتاح في `prev` أعد القيمة أو `removeItem` إن كانت `null`، ثم تحقق. **لا تعيد** `recoveryHash/recoverySalt` المستهلكين (يبقيان محذوفين من P2-06، فاستخدم لقطة ما بعد الاستهلاك).
5. فشل الكتابة ← ارمِ الخطأ (يعرض الرسالة الحالية) ولا `setMode('showRecovery')`. فشل Rollback أيضاً ← رسالة صريحة: «حالة التخزين غير مؤكدة، أعد المحاولة/أعد ضبط PIN». لا تدّعِ نجاح Rollback دون تحقق.
6. أبقِ `setRecoveryCode/clearAllFailures/setMode` بعد النجاح كما هي.

### الاختبارات C139–C145 — NOT RUN
C139 Snapshot، C140–C141 نجاح الكتابة، C142 فشل PIN، C143 فشل الاسترداد + Rollback، C144 فشل Rollback، C145 عدم استعادة الرمز المستهلك. المحاكاة: vitest بـ`localStorage.setItem` يرمي عند المفتاح N (لا تجرّب على جهاز فعلي بحسابات حقيقية).
Commit: `P2-06b: atomic-ish PIN save with rollback`.

---

## بوابة الإغلاق Phase 3 → 4
C100–C145 PASS أو BLOCKED موثقة، Build ناجح بعد كل Commit، PIN القديم لا يضيع عند الفشل، رمز الاسترداد المستهلك لا يعود، لا حذف لتقدم الطفل. حدّث `TEST_PLAN.md` §5.

.....
## ملحق — Phase 3
- شرط البدء: إغلاق بوابة Phase 2 (الحالة الفعلية في `TEST_PLAN.md` §5 و`PROJECT_CONTROL.md`).
- قرارات محسومة: الترتيب `P2-01 ← P2-02 ← P2-06 ← P2-06b`؛ كتابة `soroban_avatar_pending_upload` قبل رفع الشخصية؛ تنظيف `soroban_child_full_name` في `adoptUser()` عند تبديل الحساب فقط (`owner && owner !== user.id`) دون مسحه عند أول دخول؛ إبطال `recoveryHash/recoverySalt` والتحقق من حذفهما قبل تعيين PIN الجديد؛ أخذ Snapshot في `P2-06b` بعد استهلاك رمز الاسترداد وقبل كتابة PIN الجديد.
- قرارات معلّقة (تتطلب موافقة): تحديد موضع عرض «آخر استخدام لرمز الطوارئ» (`soroban_emergency_used_at`) للقراءة فقط داخل `GuardianDashboard.tsx` في `P2-06`.
- بيئة الاختبار: تشغيل `vitest` (`npm run test:run`) عبر GitHub Codespaces أو GitHub Actions لمحاكاة فشل الكتابة والـ Rollback؛ ما لم يُنفَّذ فعلياً = `NOT RUN` أو `BLOCKED` ببديل «مراجعة كود» ولا يُسجَّل `PASS`.
- Commit/تراجع: Commit مستقل لكل بند (بما في ذلك فصل `P2-06b` عن `P2-06`)؛ التراجع عبر `git revert` فقط.

| البند | الملفات | الاختبارات (انظر `TEST_PLAN.md`) |
|---|---|---|
| P2-01 | `src/screens/ProfileScreen.tsx` (`cloudSync.ts` عند الحاجة) | C100–C109 |
| P2-02 | `src/screens/GuardianDashboard.tsx`، `src/screens/RoleSelection.tsx`، `src/lib/cloudSync.ts` | C110–C119 |
| P2-06 | `src/components/LocalPinGuard.tsx`، `src/screens/GuardianDashboard.tsx` | C120–C138 |
| P2-06b | `src/components/LocalPinGuard.tsx` | C139–C145 |
