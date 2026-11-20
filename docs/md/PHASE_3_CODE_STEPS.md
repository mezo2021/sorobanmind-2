# PHASE_3_CODE_STEPS.md — ورقة عمل الكود: الخصوصية والحماية واستمرارية المزامنة

> يُقرأ مع `PHASE_3_EXECUTION.md`. الترتيب: **P2-01 ← P2-02 ← P2-06 ← P2-06b**، Commit لكل بند، `npm run build` بعده.
> الأكواد **مقترحة غير مجرَّبة**؛ طابق GitHub وصحّح أخطاء `tsc` قبل الـ Commit.
> مجمّد: `App.tsx`، `utils/storage.ts` (الكتابة تبقى `localStorage` مباشراً)، SQL، `CertificateScreen`، `KidsCertificateScreen`. لا حذف لتقدم الطفل.

---

## P2-01 — `src/screens/ProfileScreen.tsx` ← **تعديل كود مطلوب**

**مطابقة GitHub:** السطر 2 `import React, { useEffect, useState } from 'react';`، `isSaving` (L48)، `handleSave` (L132–170)، `isCloudMode` (L~36). `cloudSync.ts`: **لا تعديل** (`retryPendingAvatar` يقارن `soroban_hero_key` قبل حذف العلم أصلاً ← يغطي C103؛ يُختبر فقط).

1. **استبدل** سطر الاستيراد بـ `import React, { useEffect, useRef, useState } from 'react';`
2. **أضف** بعد `const [isSaving, setIsSaving] = useState(false);`: `const savingRef = useRef(false);`
3. **استبدل** `handleSave` بالكامل **بـ** (الجزء المحلي والرسائل كما هي):
```ts
  const handleSave = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);

    try {
      // 1. الحفظ المحلي (دائماً) — بلا تغيير
      localStorage.setItem('soroban_theme_key', selectedTheme);
      localStorage.setItem('soroban_hero_key', selectedAvatarId);

      const displayName = resolveDisplayName(selectedAvatarId, lang);
      if (displayName) {
        localStorage.setItem('soroban_child_name', displayName);
      }

      if (onSave) {
        onSave({ theme_key: selectedTheme });
      }

      // 2. المزامنة السحابية (Cloud فقط)
      if (isCloudMode) {
        // علم الانتظار قبل الرفع؛ فشل كتابته لا يمنع المحاولة
        try { localStorage.setItem('soroban_avatar_pending_upload', '1'); } catch { /* ignore */ }

        const synced = await cloudSync.setMyAvatar(selectedAvatarId);

        if (!synced) {
          // العلم يبقى لإعادة المحاولة لاحقاً
          alert(
            lang === 'ar'
              ? 'تعذر حفظ الشخصية في السحابة. تم الاحتفاظ بالحفظ المحلي. تحقق من الاتصال وحاول مجدداً.'
              : 'Failed to sync your avatar to the cloud. Your local changes were preserved. Check your connection and try again.'
          );
          return;
        }

        // لا نحذف العلم إلا إن كانت الشخصية الحالية هي التي رُفعت
        if (localStorage.getItem('soroban_hero_key') === selectedAvatarId) {
          try { localStorage.removeItem('soroban_avatar_pending_upload'); } catch { /* ignore */ }
        }
      }

      // 3. رسالة النجاح — بعد نجاح كلا الحفظين فقط
      alert(lang === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
      if (onBack) onBack();
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };
```
4. **أبقِ دون تغيير:** كتابة `soroban_theme_key` (تُعالج في P3-01 كتوثيق فقط)، `onSave/onBack`، وضع Local (لا علم ولا رفع).
5. **ملاحظة تفسير C108:** فشل كتابة العلم + نجاح الرفع = نجاح حقيقي؛ فشل الاثنين = تنبيه الفشل (لا رسالة نجاح). قل إن أردت تفسيراً آخر.
6. **ممنوع:** سجل تاريخي، تعديل `setMyAvatar/adoptUser`، SQL.

---

## P2-02 — ثلاثة ملفات ← **تعديل كود مطلوب (أسطر صغيرة)**

### أ) `GuardianDashboard.tsx` — `handleReset` (L572)
**استبدل** في نهاية مصفوفة `localProgressKeys` السطر `'soroban_certificates_history',` **بـ**:
```ts
  'soroban_certificates_history',

  // الاسم الكامل للطفل (يُكتب من شاشات الشهادات) — يُحذف عند التصفير
  'soroban_child_full_name',
```
(Reset يعمل Local فقط حالياً؛ وضع Cloud محجوب بتنبيه — لا تغيّر ذلك.)

### ب) `RoleSelection.tsx` — `handleLogout` (L77–97)
**أضف** سطراً مباشرة **بعد** `localStorage.removeItem(NAME_STORAGE_KEY);` (L95، أي بعد نجاح الخروج أو الخروج الإجباري):
```ts
    try { localStorage.removeItem('soroban_child_full_name'); } catch { /* ignore */ }
```
**أبقِ** مسار الإلغاء (`if (!confirmLeave) return;`) دون تغيير ← الاسم يبقى.

### ج) `src/lib/cloudSync.ts` — `adoptUser` (داخل `if (different) {`، بعد `localStorage.removeItem('soroban_child_name');`)
**أضف**:
```ts
      // الاسم الكامل يخص الهوية السابقة: يُحذف عند تبديل حساب فعلي فقط
      // (ليس عند أول دخول owner === null ولا عند الحساب نفسه)
      if (owner && owner !== user.id) {
        localStorage.removeItem('soroban_child_full_name');
      }
```
بلا `try/catch` عمداً: أي فشل ينتقل إلى `catch` الخارجي ← Rollback (Snapshot يشمل المفتاح) ← خطأ ظاهر (C117). **قرار محسوم** في الملحق: `owner && owner !== user.id`.

**أبقِ دون تغيير:** `hero name`، التقدم والشهادات، اعتماد الحساب نفسه.

---

## P2-06 — `src/components/LocalPinGuard.tsx` (+ `GuardianDashboard.tsx` للعرض) ← **تعديل كود مطلوب**

**مطابقة GitHub:** السطر 2 `import { useEffect, useState } from 'react';`، `KEYS` (L9–20)، `EMERGENCY_CODE` (L22)، `handleRecovery` (L254–285). الدوال المستخدمة موجودة: `t`، `setError`، `clearAllFailures`، `registerRecFailure`، `isLocked`.

1. **استبدل** الاستيراد بـ `import { useEffect, useRef, useState } from 'react';`
2. **أضف** إلى `KEYS` قبل `} as const;`: `emergencyUsedAt: 'soroban_emergency_used_at',`
3. **أضف** داخل المكوّن بجوار حالات `busy`: `const recoveringRef = useRef(false);`
4. **استبدل** `handleRecovery` بالكامل **بـ**:
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
        // نسجّل آخر استخدام فقط (لا الرمز ولا المُدخل)؛ فشل التسجيل لا يمنع الاسترداد
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
5. **أبقِ دون تغيير:** `EMERGENCY_CODE='19871987'`، `pinHash/pinSalt` (يبقيان حتى حفظ PIN جديد)، حالات القفل. **لا** حالة Pending Recovery.
6. **⚠️ قرار معلّق — عرض «آخر استخدام» في `GuardianDashboard.tsx`:** لا يوجد قسم أمان ظاهر (L170 فلتر تصدير فقط). المقترح: سطر قراءة فقط في أي بطاقة إعدادات موجودة، **حدّد الموضع بعد فتح الملف وموافقتك**. الكود:
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
7. **ممنوع:** إزالة الرمز الثابت، رمز لكل جهاز، سجل متعدد، زر مسح، وصفه بسر آمن، المساس بتقدم الطفل.

---

## P2-06b — `src/components/LocalPinGuard.tsx` فقط ← **تعديل كود مطلوب** (Commit منفصل بعد P2-06)

**مطابقة GitHub:** `saveNewPin` (L173–185) يُستدعى من `handleConfirm` (L215) و`handleConfirmNewPin` (L316).

1. **استبدل** `saveNewPin` **بـ**:
```ts
  async function saveNewPin(value: string) {
    const pinData = await createHash(value);
    const newRecovery = generateRecoveryCode();
    const recoveryData = await createHash(newRecovery);

    const writes: Array<[string, string]> = [
      [KEYS.pinSalt, pinData.salt],
      [KEYS.pinHash, pinData.hash],
      [KEYS.recoverySalt, recoveryData.salt],
      [KEYS.recoveryHash, recoveryData.hash],
    ];
    // Snapshot الحالة الحالية (بعد استهلاك رمز الاسترداد في P2-06 تكون قيمه null ← لا يُعاد تفعيله)
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

    setRecoveryCode(newRecovery);
    setPin('');
    setFirstPin('');
    clearAllFailures();
    setMode('showRecovery');
  }
```
2. **في `handleConfirm`** **استبدل** `catch {` الذي يعرض «تعذر إنشاء الحماية…» **بـ**:
```ts
    } catch (e) {
      setError(
        e instanceof Error && e.message === 'PIN_SAVE_FAILED_UNCERTAIN'
          ? t('حالة التخزين غير مؤكدة. أعد المحاولة أو أعد ضبط PIN.', 'Storage state is uncertain. Retry or reset the PIN.')
          : t('تعذر إنشاء الحماية. تحقق من المتصفح.', 'Could not create protection. Check your browser.')
      );
    } finally {
```
   (أبقِ `finally { setBusy(false); }` كما هو.)
3. **في `handleConfirmNewPin`** نفس الاستبدال لكن بالرسالة الأصلية `'تعذر حفظ PIN الجديد.'` / `'Could not save the new PIN.'` في الفرع الثاني.
4. **أبقِ دون تغيير:** `createHash`، `generateRecoveryCode`، مسار `showRecovery`، `handleRecoverySaved`.
5. لا رسالة نجاح عند فشل الكتابة؛ لا ادعاء نجاح Rollback دون التحقق.

---

## ⚠️ قرارات معلّقة
1. موضع عرض «آخر استخدام» في `GuardianDashboard` (P2-06).
2. تفسير C108 (انظر P2-01 خطوة 5).
3. مطابقة `LocalPinGuard` على GitHub (الأسماء والأسطر) قبل P2-06/06b — الملف يُستدعى من موضعين لـ`saveNewPin`.

## Commit والاختبار
`P2-01: persist pending avatar flag before upload` ← `P2-02: clear child full name on reset/logout/account switch` ← `P2-06: invalidate recovery code, log emergency use` ← `P2-06b: atomic PIN save with rollback`. كل واحد: build ثم `TEST_PLAN.md` (C100–C145). محاكاة فشل `localStorage` عبر vitest أو BLOCKED. لا PASS قبل التنفيذ. التراجع `git revert` فقط؛ لا مسح لبيانات المستخدمين.
