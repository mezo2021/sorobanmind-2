# PHASE_3_EXECUTION.md — بطاقات Phase 3

مرتبة حسب الخطر الفعلي. كل تعديل: فرع ← PR ← CI أخضر ← دمج. الأكواد مقترحة غير مجرَّبة. مجمّد: `App.tsx`، `utils/storage.ts`، SQL، `CertificateScreen`، `KidsCertificateScreen`. شاشات الواجهة (`LocalPinGuard`، `ProfileScreen`، `GuardianDashboard`) لا يمكن اختبارها في CI (بيئة `node`) ← اختباراتها **BLOCKED/NOT RUN** وتُراجع بالـ diff + CI أخضر. لا تبدأ قبل إغلاق بوابة Phase 2.

---

## بطاقة 1 — P2-06b: حفظ PIN جديد قد يترك PIN تالفاً

**الملف:** `src/components/LocalPinGuard.tsx` (Commit منفصل بعد البطاقة 2).
**الخطر المثبت:** `saveNewPin` (L173–185) يكتب أربعة مفاتيح بالتتابع بلا Snapshot؛ فشل بعد `pinHash` وقبل `pinSalt` ← هاش جديد بملح قديم ← PIN لا يُقبل أبداً. يُستدعى من L215 (إعداد أول) وL316 (PIN جديد).
> **ترتيب التنفيذ:** نفّذ البطاقة 2 (P2-06) أولاً ثم هذه؛ لأن تصميم الـ Snapshot يفترض أن رمز الاسترداد المستهلك محذوف.

**كود قديم (L173–185):**
```ts
  async function saveNewPin(value: string) {
    const pinData = await createHash(value);
    const newRecovery = generateRecoveryCode();
    const recoveryData = await createHash(newRecovery);
    localStorage.setItem(KEYS.pinHash, pinData.hash);
    localStorage.setItem(KEYS.pinSalt, pinData.salt);
    localStorage.setItem(KEYS.recoveryHash, recoveryData.hash);
    localStorage.setItem(KEYS.recoverySalt, recoveryData.salt);
    setRecoveryCode(newRecovery);
    …
```
**كود جديد (استبدل الأسطر الأربعة `localStorage.setItem` فقط، وأبقِ ما قبلها وما بعدها كما هو):**
```ts
    const writes: Array<[string, string]> = [
      [KEYS.pinSalt, pinData.salt],
      [KEYS.pinHash, pinData.hash],
      [KEYS.recoverySalt, recoveryData.salt],
      [KEYS.recoveryHash, recoveryData.hash],
    ];
    // Snapshot قبل الكتابة (بعد P2-06 تكون قيم الاسترداد المستهلك null ← لا يُعاد تفعيلها)
    const prev = writes.map(([k]) => [k, localStorage.getItem(k)] as [string, string | null]);
    try {
      for (const [k, v] of writes) localStorage.setItem(k, v);
      for (const [k, v] of writes) {
        if (localStorage.getItem(k) !== v) throw new Error('verify');
      }
    } catch {
      let rolledBack = true;
      try {
        for (const [k, v] of prev) {
          if (v === null) localStorage.removeItem(k);
          else localStorage.setItem(k, v);
        }
        for (const [k, v] of prev) {
          if (localStorage.getItem(k) !== v) rolledBack = false;
        }
      } catch {
        rolledBack = false;
      }
      throw new Error(rolledBack ? 'PIN_SAVE_FAILED' : 'PIN_SAVE_FAILED_UNCERTAIN');
    }
```
**المستدعيان — L217 قديم:**
```ts
      setError(t('تعذر إنشاء الحماية. تحقق من المتصفح.', 'Could not create protection. Check your browser.'));
```
**جديد (وبنفس الصيغة في L318 مع رسالتها الأصلية `'تعذر حفظ PIN الجديد.'`):** غيّر `catch {` المحيط إلى `catch (e) {` ثم:
```ts
      setError(
        e instanceof Error && e.message === 'PIN_SAVE_FAILED_UNCERTAIN'
          ? t('حالة التخزين غير مؤكدة. أعد المحاولة أو أعد ضبط PIN.', 'Storage state is uncertain. Retry or reset the PIN.')
          : t('تعذر إنشاء الحماية. تحقق من المتصفح.', 'Could not create protection. Check your browser.'),
      );
```
**أبقِ:** `createHash`، `generateRecoveryCode`، `setRecoveryCode/setMode`، `handleRecoverySaved`. لا رسالة نجاح عند الفشل، ولا ادعاء نجاح Rollback دون تحقق.
**الاختبار من الهاتف:** لا (BLOCKED) — مكوّن React. `NOT RUN` لـ C139–C145.
**Commit message:** `fix(pin): snapshot and rollback on partial PIN write failure`
**الوقت المتوقع:** 15 دقيقة
**مخاطر:** منخفض؛ يضيف حماية فقط، ومسار النجاح يكتب القيم نفسها (بترتيب ملح ثم هاش).
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 2 — P2-06: رمز الاسترداد لا يُبطل + تسجيل رمز الطوارئ

**الملف:** `src/components/LocalPinGuard.tsx` (و`GuardianDashboard.tsx` للعرض — انظر القرار).
**الخطر المثبت:** `handleRecovery` (L253–286) عند النجاح يذهب إلى `newPin` **دون حذف** `recoveryHash/recoverySalt` ← الرمز "أحادي الاستخدام" يُعاد استخدامه. ولا يوجد تسجيل لاستخدام رمز الطوارئ.

**1) L2 — قديم:** `import { useEffect, useState } from 'react';` **← جديد:** `import { useEffect, useRef, useState } from 'react';`
**2) `KEYS` (L9–14) — أضف قبل `} as const;`:**
```ts
  emergencyUsedAt: 'soroban_emergency_used_at',
```
**3)** داخل المكوّن بجوار حالة `busy`: `const recoveringRef = useRef(false);`
**4) استبدل `handleRecovery` بالكامل (L253–286) بـ:**
```ts
  async function handleRecovery() {
    if (busy || isLocked() || recoveringRef.current) return;
    const value = recoveryInput.trim();
    if (!/^\d{8}$/.test(value)) {
      setError(t('أدخل رمزًا مكونًا من 8 أرقام.', 'Enter an 8-digit code.'));
      return;
    }
    recoveringRef.current = true;
    setBusy(true);
    try {
      const viaEmergency = value === EMERGENCY_CODE;
      let authorized = viaEmergency;
      if (!authorized) {
        const salt = localStorage.getItem(KEYS.recoverySalt);
        const savedHash = localStorage.getItem(KEYS.recoveryHash);
        if (salt && savedHash) {
          const candidate = await hashValue(value, salt);
          authorized = candidate === savedHash;
        }
      }
      if (!authorized) {
        setRecoveryInput('');
        registerRecFailure();
        return;
      }

      let warning = '';
      if (viaEmergency) {
        // آخر استخدام فقط (لا الرمز ولا المُدخل)؛ فشل التسجيل لا يمنع الاسترداد
        try {
          localStorage.setItem(KEYS.emergencyUsedAt, new Date().toISOString());
        } catch {
          warning = t('تعذر تسجيل وقت استخدام رمز الطوارئ.', 'Could not record the emergency code usage time.');
        }
      } else {
        // رمز الاسترداد العشوائي أحادي الاستخدام: أبطله وتحقق قبل المتابعة
        localStorage.removeItem(KEYS.recoveryHash);
        localStorage.removeItem(KEYS.recoverySalt);
        if (localStorage.getItem(KEYS.recoveryHash) !== null || localStorage.getItem(KEYS.recoverySalt) !== null) {
          setError(t('تعذر إبطال رمز الاسترداد. لم يتم تغيير PIN.', 'Could not invalidate the recovery code. PIN was not changed.'));
          return;
        }
      }

      clearAllFailures();
      setRecoveryInput('');
      setPin('');
      setFirstPin('');
      setError(warning);
      setMode('newPin');
    } catch {
      setError(t('تعذر التحقق من رمز الاسترداد.', 'Recovery verification failed.'));
    } finally {
      recoveringRef.current = false;
      setBusy(false);
    }
  }
```
**أبقِ دون تغيير:** `EMERGENCY_CODE = '19871987'` (قرار المالك)، `pinHash/pinSalt` (يبقيان حتى حفظ PIN جديد)، حالات القفل. لا Pending Recovery.

**⚠️ قرار معلّق (عرض «آخر استخدام» في `GuardianDashboard.tsx`):** لا يوجد قسم أمان فيه (L170 فلتر تصدير فقط). التسجيل أعلاه يعمل وحده؛ **نفّذ العرض فقط بعد أن تحدد الموضع**. الكود جاهز:
```tsx
{(() => {
  let v: string | null = null;
  try { v = localStorage.getItem('soroban_emergency_used_at'); } catch { /* ignore */ }
  const text = !v
    ? pickLang({ ar: 'لا يوجد استخدام مسجل لرمز الطوارئ', en: 'No recorded emergency code use' }, lang)
    : Number.isNaN(Date.parse(v))
      ? pickLang({ ar: 'قيمة تسجيل غير صالحة', en: 'Invalid recorded value' }, lang)
      : pickLang({ ar: 'آخر استخدام لرمز الطوارئ: ', en: 'Last emergency code use: ' }, lang) + new Date(v).toLocaleString(lang === 'ar' ? 'ar' : 'en');
  return <p className="text-xs text-white/60">{text}</p>;
})()}
```
**الاختبار من الهاتف:** لا (BLOCKED). `NOT RUN` لـ C120–C138.
**Commit message:** `fix(pin): invalidate consumed recovery code and log emergency use`
**الوقت المتوقع:** 20 دقيقة
**مخاطر:** منخفض؛ لا يلمس تقدم الطفل. إن أُغلق التطبيق بعد استهلاك الرمز يبقى PIN القديم صالحاً.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 3 — P2-01: الشخصية لا تُرفع بعد فشل الرفع من الملف الشخصي

**الملف:** `src/screens/ProfileScreen.tsx` (`cloudSync.ts` بلا تعديل: `retryPendingAvatar` يقارن `soroban_hero_key` قبل حذف العلم أصلاً).
**الخطر المثبت:** `handleSave` (L132–170) عند فشل `setMyAvatar` يعرض تنبيهاً ويرجع **دون كتابة `soroban_avatar_pending_upload`** ← لا إعادة محاولة لاحقاً (يكتبها `RoleSelection` L138 و`AppGate` فقط). والقفل `isSaving` حالة React فقط (نقر مزدوج ممكن).

**1) L2 — قديم:** `import React, { useEffect, useState } from 'react';` **← جديد:** `import React, { useEffect, useRef, useState } from 'react';`
**2)** أضف بعد `const [isSaving, setIsSaving] = useState(false);` (L48): `const savingRef = useRef(false);`
**3) L133–135 — قديم:**
```ts
    if (isSaving) return;

    setIsSaving(true);
```
**جديد:**
```ts
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
```
**4) L155 — قديم:** `const synced = await cloudSync.setMyAvatar(selectedAvatarId);` **← جديد (استبدل هذا السطر بهذه الأسطر):**
```ts
        // علم الانتظار قبل الرفع؛ فشل كتابته لا يمنع المحاولة
        try { localStorage.setItem('soroban_avatar_pending_upload', '1'); } catch { /* ignore */ }
        const synced = await cloudSync.setMyAvatar(selectedAvatarId);
```
**5)** بعد كتلة `if (!synced) { … return; }` (L157–164) وقبل إغلاق `if (isCloudMode)` أضف:
```ts
        // لا نحذف العلم إلا إن كانت الشخصية الحالية هي التي رُفعت
        if (localStorage.getItem('soroban_hero_key') === selectedAvatarId) {
          try { localStorage.removeItem('soroban_avatar_pending_upload'); } catch { /* ignore */ }
        }
```
**6) `finally` (L168–170) — قديم:** `setIsSaving(false);` **← جديد:**
```ts
      savingRef.current = false;
      setIsSaving(false);
```
عند الفشل يبقى العلم (لا حذف). وضع Local: لا علم ولا رفع. **أبقِ:** كتابة `soroban_theme_key` (توثيق P3-01 فقط)، `onSave/onBack`.
**الاختبار من الهاتف:** لا (BLOCKED). `NOT RUN` لـ C100–C109.
**Commit message:** `fix(profile): persist pending avatar flag before upload and guard double save`
**الوقت المتوقع:** 10 دقائق
**مخاطر:** منخفض.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 4 — P2-02: الاسم الكامل للطفل يبقى بعد Reset/Logout/تبديل الحساب

**الملفات:** `GuardianDashboard.tsx`، `RoleSelection.tsx`، `cloudSync.ts` (Commit واحد).
**الخطر المثبت:** `soroban_child_full_name` يُكتب من شاشات الشهادات فقط ولا يُحذف في أي مسار (`handleReset` L598–629، `handleLogout` L95، `adoptUser` L424–426).

**أ) `GuardianDashboard.tsx` — L629** (بعد بطاقة E1 يوجد `...UNSCOPED_CHILD_KEYS,` في آخر القائمة؛ أضف قبله):
قديم: `  'soroban_certificates_history',`
جديد:
```ts
  'soroban_certificates_history',
  'soroban_child_full_name',
```
**ب) `RoleSelection.tsx` — بعد L95** `localStorage.removeItem(NAME_STORAGE_KEY);` أضف:
```ts
    try { localStorage.removeItem('soroban_child_full_name'); } catch { /* ignore */ }
```
(مسار إلغاء الخروج `if (!confirmLeave) return;` لا يُمس ← الاسم يبقى.)
**ج) `cloudSync.ts` — داخل `if (different) {` بعد حلقة `UNSCOPED_CHILD_KEYS` (بطاقة E1) أو بعد L426 إن لم تُنفَّذ بعد:**
```ts
      // الاسم الكامل يخص الهوية السابقة: يُحذف عند تبديل حساب فعلي فقط
      // (ليس عند أول دخول owner === null ولا عند الحساب نفسه)
      if (owner && owner !== user.id) {
        localStorage.removeItem('soroban_child_full_name');
      }
```
بلا `try/catch` عمداً (أي فشل ← Rollback ← خطأ ظاهر). **قرار محسوم:** الشرط `owner && owner !== user.id` (يحمي الاسم عند أول دخول).
**أبقِ:** اسم البطل، التقدم، الشهادات، اعتماد الحساب نفسه.
**اختبار CI (اختياري، يضاف إلى `tests/adoptUser.cleanup.test.ts` من Phase 1):** أضف `'soroban_child_full_name'` إلى `seed()`، وتأكد أنه `null` في حالة `seed('A')`→دخول B، و`'x'` في حالة `seed('B')`.
**الاختبار من الهاتف:** الجزء ج عبر CI (إن أضفت الاختبار)؛ أ وب: لا (BLOCKED). `NOT RUN` لباقي C110–C119.
**Commit message:** `fix(privacy): clear child full name on reset, logout and account switch`
**الوقت المتوقع:** 10 دقائق
**مخاطر:** منخفض؛ لا يُحذف عند الإلغاء ولا عند الحساب نفسه.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

**بوابة Phase 3 → 4:** بطاقات 1–4 مغلقة، CI أخضر بعد كل Commit، PIN القديم لا يضيع عند فشل الكتابة، الرمز المستهلك لا يعود، لا حذف لتقدم الطفل. اختبارات الواجهة تبقى **BLOCKED/NOT RUN** ولا تُسجَّل PASS.
