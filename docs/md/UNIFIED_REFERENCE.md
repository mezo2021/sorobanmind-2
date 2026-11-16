# UNIFIED_REFERENCE — SorobanMind-2
**الإصدار:** v2.0 | **التاريخ:** 16 نوفمبر 2026
**الحالة:** محدّث بعد إغلاق Phase 1 + P2-03

---

## 1. Risk Register (سجل المخاطر)

### 1.1 P1 — حرجة

#### 🟢 P1-01 — فشل اعتماد الحساب وتلوث البيانات
- **الحالة:** ✅ مغلق تصميمياً (16 نوفمبر 2026)
- **النطاق:** `src/lib/cloudSync.ts` + `src/components/AuthModal.tsx`
- **المصدر:** تحليل + فحص الكود (GPT, D, E)
- **القرارات المعمارية:**
  - عقد `adoptUser`: `{success: true, changed}` + throw عند الفشل.
  - `pullProgress` → Fetch-only.
  - قفلان: `authFlowInProgress` + `adoptionInProgress` + Web Locks.
  - `CloudSyncError` + ترجمة في `AuthModal`.
  - `applyLocalIdentityVerified` مسار صارم للاعتماد فقط.
  - `avatar_id` غير صالح → تحويل محلي إلى `null`.
  - LOCAL WINS عند `changed=false`.
- **الاختبارات:** C1-C20 معتمدة.
- **القيود المعروفة:** Rollback لا يحمي من إغلاق الصفحة القسري.

---

### 1.2 P2 — متوسطة

#### 🔴 P2-01 — عدم تسجيل فشل مزامنة الشخصية
- **الحالة:** ⏳ قيد التخطيط (Phase 3)
- **الملف:** `ProfileScreen.tsx`
- **المصدر:** تحليل GPT
- **الوصف:** عند فشل `setMyAvatar`، لا يُكتب `soroban_avatar_pending_upload = '1'`، فلا يعرف `retryPendingAvatar` بإعادة المحاولة.

#### 🔴 P2-02 — بقاء `soroban_child_full_name` بعد Reset/Logout
- **الحالة:** ⏳ قيد التخطيط (Phase 3)
- **الملف:** `GuardianDashboard.tsx` + مسار Logout
- **المصدر:** تحليل GPT + فحص حي
- **الوصف:** PII لا يُمسح بعد Reset/Logout.

#### 🟢 P2-03 — عزل `srb_progress` خارج نظام العزل
- **الحالة:** ✅ مغلق تصميمياً (16 نوفمبر 2026)
- **النطاق:** `src/data/srb/progress.ts` + `src/main.tsx`
- **المستبعد:** `src/data/srb-adapter.ts` (لا تعديل)
- **القرارات المعمارية:**
  - Migration: `srb_progress` → `local:srb_progress`.
  - علم: `soroban_srb_migrated = "1"`.
  - ترتيب: نسخ → تحقق → علم → حذف المصدر أخيراً.
  - QuotaExceeded: حظر كتابة + قراءة read-only.
  - `getMode()` مباشرة (لا null افتراضي).
  - Conflict/Corrupted/ModeUnavailable: أخطاء مخصصة.
- **الاختبارات:** C21-C37 معتمدة.
- **القيود المعروفة:** ErrorBoundary لا يلتقط أخطاء `onClick`/`useEffect`/`async` → UX مؤجل لـ P3-04.

#### 🔴 P2-04 — جلسات الدروس مشتركة بين Local/Cloud
- **الحالة:** ⏳ المرحلة التالية (Phase 2)
- **الملف المتوقع:** `LessonScreen.tsx`
- **المصدر:** تحليل GPT
- **القرار المعماري (Q2):** وضع فقط (لا `userId` في المفتاح)، لا مسح جلسات Local عند Logout.
- **الوصف:** `soroban_lesson_session_*` بلا بادئة وضع → مشتركة.

#### 🟢 P2-05 — أفضل نتائج Magic Secrets مشتركة
- **الحالة:** ✅ محسوم (16 نوفمبر 2026)
- **القرار:** (د) Local-only في Phase 2.
- **الملف:** `MagicSecretsScreen.tsx`
- **القرارات:**
  - Local: `local:soroban_secrets_best_scores`.
  - Cloud: `cloud:soroban_secrets_best_scores` (لكن **ليس** مزامنة سحابية).
  - **لا Supabase، لا SQL** في Phase 2.
- **المؤجل:** مزامنة Cloud حقيقية → مرحلة مستقلة لاحقة (RPC جديد).
- **السبب:** لا يوجد RPC مناسب للقراءة من `scores` (RLS + 0 policies).

#### 🔴 P2-06 — بقاء Recovery PIN السابق صالحاً
- **الحالة:** ⏳ قيد التخطيط (Phase 3)
- **الملف:** `LocalPinGuard.tsx`
- **المصدر:** فحص GPT
- **الوصف:** بعد نجاح الاسترداد، رمز الاسترداد القديم لا يُمسح إلا عند حفظ PIN جديد.

#### 🔴 P2-07 — Shallow Merge في `loadFromCloud`
- **الحالة:** ⏳ قيد التخطيط (Phase 2)
- **الملف المتوقع:** `cloudSync.ts` + `GuardianDashboard.tsx`
- **المصدر:** تحليل GPT
- **القرار المعماري (Q5):**
  - تأكيد + Snapshot + Rollback (~40 سطر).
  - الهدف: `loadFromCloud` تصل لمستوى أمان `handleRestore` (JSON).
  - المؤجل: preview + schema validator.
- **الوصف:** `loadFromCloud` تستخدم `{...state, ...safePd}` بدل استبدال كامل.

#### ❌ P2-08 — استعادة سحابية يدوية
- **الحالة:** ❌ **ملغى (16 نوفمبر 2026)**
- **السبب:** `handleRestore` (JSON) و `loadFromCloud` (السحابة) موجودتان أصلاً كمسارين للاستعادة. كلتاهما استبدال كامل.
- **القرار البديل:** لا ميزة جديدة. Migration Wizard (مستقبلاً) يحل الانتقائية.
- **مصدر القرار:** Q4 (P2 Design Decisions).

---

### 1.3 P3 — منخفضة

#### 🔴 P3-01 — `soroban_theme_key` مفتاح ميت
- **الحالة:** ⏳ قيد التخطيط (Phase 4)
- **الملف:** `ProfileScreen.tsx`
- **الوصف:** يُكتب، لا يُقرأ (Soroban2D5 يقرأ `soroban2d5-theme`).

#### 🔴 P3-02 — نسختان من `LEGACY_CHARACTER_MAP`
- **الحالة:** ⏳ قيد التخطيط (Phase 4)
- **الملف:** `types.ts` + `HeroDashboard.tsx`
- **الوصف:** `types.ts` يحتوي `aya: 'joud'`، `HeroDashboard` لا يحتويها.

#### 🔴 P3-03 — `mask_name` دالة ميتة في Supabase
- **الحالة:** ⏳ قيد التخطيط (Phase 4)
- **الملف:** Supabase → `public.mask_name`
- **الوصف:** موجودة، لا اعتماديات (`pg_depend = 0`)، `handle_new_profile` لا يستدعيها.

#### 🆕 🔴 P3-04 — Migration Failure UX
- **الحالة:** ⏳ جديد (Phase 5)
- **النطاق المتوقع:** `progress.ts` (helper) + ملف UI واحد (يُحسم)
- **الوصف:** إظهار حالات `blocked`/`conflict`/`corrupted`/`mode-unavailable` للطفل.
- **المؤجل من:** P2-03 (قصور مقبول).
- **مصدر القرار:** P2-03 Negotiation.

---

## 2. Phase Structure (هيكل المراحل)

### 🟢 Phase 1 — سلامة الهوية والمزامنة الحرجة
- **الحالة:** ✅ مغلق تصميمياً
- **البنود:** P1-01
- **الملفات:** `cloudSync.ts`, `AuthModal.tsx`
- **الاختبارات:** C1-C20

### 🔴 Phase 2 — عزل البيانات واستقرار التقدم
- **الحالة:** ⏳ جارٍ (P2-03 مغلق، P2-05 مغلق)
- **البنود:** P2-03 🟢, P2-04 🔴, P2-05 🟢, P2-07 🔴
- **الملفات:** `progress.ts`, `main.tsx`, `LessonScreen.tsx`, `MagicSecretsScreen.tsx`, `cloudSync.ts`, `GuardianDashboard.tsx`

### 🔴 Phase 3 — الخصوصية والحماية
- **الحالة:** ⏳ لم يبدأ
- **البنود:** P2-01, P2-02, P2-06
- **الملفات المتوقعة:** `ProfileScreen.tsx`, `GuardianDashboard.tsx`, `RoleSelection.tsx`, `LocalPinGuard.tsx`

### 🔴 Phase 4 — التنظيف والتوافق
- **الحالة:** ⏳ لم يبدأ
- **البنود:** P3-01, P3-02, P3-03
- **الملفات المتوقعة:** `ProfileScreen.tsx`, `types.ts`, `HeroDashboard.tsx`, Supabase (SQL)

### 🆕 🔴 Phase 5 — Migration Failure UX
- **الحالة:** ⏳ جديد
- **البنود:** P3-04
- **الملفات المتوقعة:** `progress.ts`, ملف UI واحد
- **السبب:** P2-03 لا يعالج UX (قصور مقبول)، ويحتاج مرحلة مستقلة بعد Phase 2.

---

## 3. Commit Strategy

### قاعدة عامة
- كل Commit يمثل وحدة إصلاح مستقلة، مكتملة، قابلة للاختبار والتراجع.
- ملف واحد → Commit → Build ناجح → الملف التالي (مع استثناء الملفات المترابطة).

### 🟢 Commits المؤكدة (بعد التفكيك)

| البند | Commit Message (مقترح) | الملفات | الحالة |
|-------|------------------------|---------|--------|
| Phase 1 | `fix(auth): adoptUser session safety + CloudSyncError` | `cloudSync.ts`, `AuthModal.tsx` | 🟢 ✅ مؤكد |
| P2-03 | `fix(srb): progress isolation + safe migration` | `progress.ts`, `main.tsx` | 🟢 ✅ مؤكد |

### 🔴 Commits غير المؤكدة نهائياً (عند تفكيك المرحلة)

| البند | الملفات المتوقعة | الحالة |
|-------|------------------|--------|
| P2-04 | `LessonScreen.tsx` (؟) | 🔴 ⏳ عند تفكيك P2-04 |
| P2-07 | `cloudSync.ts`, `GuardianDashboard.tsx` | 🔴 ⏳ عند تفكيك P2-07 |
| Phase 3 (P2-01) | `ProfileScreen.tsx` | 🔴 ⏳ عند تفكيك Phase 3 |
| Phase 3 (P2-02) | `GuardianDashboard.tsx`, `RoleSelection.tsx` | 🔴 ⏳ عند تفكيك Phase 3 |
| Phase 3 (P2-06) | `LocalPinGuard.tsx` | 🔴 ⏳ عند تفكيك Phase 3 |
| Phase 4 (P3-01) | `ProfileScreen.tsx` | 🔴 ⏳ عند تفكيك Phase 4 |
| Phase 4 (P3-02) | `types.ts`, `HeroDashboard.tsx` | 🔴 ⏳ عند تفكيك Phase 4 |
| Phase 4 (P3-03) | Supabase SQL | 🔴 ⏳ عند تفكيك Phase 4 |
| Phase 5 (P3-04) | `progress.ts`, ملف UI | 🔴 ⏳ عند تفكيك Phase 5 |

**ملاحظة:** الصفوف الحمراء قد تتغير عند تفكيك كل بند (قد تظهر ملفات إضافية، أو تُلغى ملفات متوقعة).

---

## 4. File Freeze List (قائمة الملفات المجمّدة)

| الملف | الحالة عبر المراحل |
|-------|---------------------|
| `src/utils/storage.ts` | 🔒 مجمّد (مع استثناء للضرورة القصوى) |
| `src/store/progressStore.ts` | 🔒 مجمّد |
| `src/store/highScoreStore.ts` | 🔒 مجمّد |
| `src/store/masteryBadgesStore.ts` | 🔒 مجمّد |
| `src/App.tsx` | 🔒 مجمّد |
| `src/components/AppGate.tsx` | 🔒 مجمّد |
| `src/components/RoleSelection.tsx` | 🔒 مجمّد (يُفتح فقط عند تفكيك Phase 3) |
| `src/components/LocalPinGuard.tsx` | 🔒 مجمّد (يُفتح فقط عند تفكيك P2-06) |

**قاعدة الاستثناء:** أي حاجة لكسر التجميد تتطلب:
1. مبرر مكتوب.
2. تحديد نطاق التعديل بالضبط.
3. إعلان قبل التنفيذ.
4. مراجعة في بوابات القبول.

**استثناء `storage.ts`:** مجمّد، لكن يُسمح بتعديله فقط عند الضرورة القصوى المبررة كتابياً (لا استثناء نظري عام). القرار يُتخذ في وقت الحاجة، لا مسبقاً.

---

## 5. Rollback Strategy (استراتيجية التراجع)

### القاعدة الأساسية
- `git revert` (لا `git reset`) للتراجع عن Commit.
- حفظ تاريخ المشروع.
- لا نستخدم Reset أو تنظيف بيانات المستخدمين كوسيلة لمعالجة فشل إصلاح برمجي.

### نقاط الرجوع
- قبل كل Phase: تسجيل Commit الحالي كنقطة رجوع.
- قبل كل P2-XX منفصل: تسجيل Commit.
- عند فشل Build: توقف فوري، لا انتقال للتالي.

### عند ظهور خلل
| الحالة | الإجراء |
|--------|---------|
| فشل Build | توقف + إصلاح أو revert |
| خطأ في Zustand | تحديد المصدر قبل أي إجراء |
| فشل تسجيل الدخول | توقف + عودة لنقطة الرجوع |
| ظهور بيانات حساب سابق | توقف فوري + revert |

---

## 6. Dependencies (سجل التبعيات)

### P1-01 ← P2-07
- **مستقلان برمجياً.**
- **مترابطان اختبارياً:** بعد إصلاح P1-01، يجب اختبار `loadFromCloud`.

### P2-03 ← P2-04
- **مستقلان برمجياً.**
- **P2-03 يجب أن يُغلق أولاً** (تم 16 نوفمبر).

### P2-07 ← P2-03, P2-04
- **P2-07 يعتمد اختبارياً على P2-03 و P2-04** (يجب أن يكتمل العزل قبل إصلاح الدمج).

### P3-04 ← P2-03
- **P3-04 يعتمد على P2-03** (يحتاج حالات Migration كاملة).

---

## 7. Document Status

| البند | الحالة |
|-------|--------|
| Risk Register | 🟢 v2.0 |
| Phase 1 | 🟢 مغلق |
| Phase 2 | 🔴 جارٍ (P2-03 مغلق، P2-05 مغلق، P2-04/P2-07 قيد التخطيط) |
| Phase 3 | 🔴 لم يبدأ |
| Phase 4 | 🔴 لم يبدأ |
| Phase 5 | 🆕 🔴 لم يبدأ |
| Commits | 🟢 مؤكدة (2) + 🔴 غير مؤكدة (7+) |
| Freeze List | 🟢 محدد |

---

## 8. Q&A — القرارات المعمارية المعتمدة

| السؤال | القرار | التاريخ |
|--------|--------|---------|
| Q1 (P2-03) | نقل إلى `local:srb_progress` + flag | 16 نوفمبر |
| Q2 (P2-04) | وضع فقط (لا `userId`) | 16 نوفمبر |
| Q3 (P2-05) | Local-only في Phase 2 | 16 نوفمبر |
| Q4 (P2-08) | ❌ ملغى (ميزة موجودة) | 16 نوفمبر |
| Q5 (P2-07) | تأكيد + Snapshot + Rollback (~40 سطر) | 16 نوفمبر |

---

**نهاية UNIFIED_REFERENCE v2.0**