# 📋 AL-ISLAH-V2.md
# وثيقة الإصلاح الشاملة — مبنية على فحص فعلي

> **آخر تحديث:** 2026-10-07
> **الطريقة:** فحص آلي كامل (GitHub Actions) + قراءة يدوية لأكثر من 15 ملفًا
> **القاعدة:** لا تخمين · كل سطر له دليل
> **الحالة:** البناء أخضر · 51,181 سطرًا · 119 ملفًا

---

## 📖 1. الخلاصة التنفيذية

**التطبيق يعمل · يستخدمه أطفال · 92% مكتمل فعليًا.**

**المشكلة الحقيقية:** نظامان يعملان بالتوازي (قديم + جديد) → فوضى هجينة.

**السبب:** المنهاج تغيّر (20 درسًا → 15 درسًا · كوجيما الأصلي). بُني SRB جديد · لكن القديم لم يُحذف · الشاشات لم تُحدَّث كليًا.

**الحل:** إكمال التوصيل · لا إعادة بناء.

---

## 🏦 2. البنوك — الوضع الفعلي

### 2.1 Bank A — التمارين والأنزان

| البند | القيمة |
|---|---|
| المسار | `src/data/srb/questions/` |
| الحجم | **275 سؤالًا** |
| `variant` | "A" |
| `primary_phase` | "P" |
| `allowed_phases` | E · T · P · ANZ-V · ANZ-F · ANZ-A · X |
| `anzan_time_ms` | > 0 (مستخدم) |
| `solution` | شرح تربوي غني |
| **الدور** | تقويم تكويني |
| **الحالة** | ✅ **يعمل** |

**المسار:**
```

PracticeScreen · AnzanScreen · AudioAnzanScreen · RemediationScreen
↓
srb-adapter → srb/index → srb/questions (Bank A)

```

### 2.2 Bank B — التقييم الختامي

| البند | القيمة |
|---|---|
| المسار | `src/data/srb/exam/` |
| الحجم | **666 سؤالًا** |
| `variant` | "B" |
| `primary_phase` | "CE" |
| `allowed_phases` | CE · PT · X |
| `anzan_time_ms` | 0 (غير مطلوب) |
| `solution` | معادلة مباشرة |
| **الدور** | تقييم ختامي |
| **الحالة** | 🔴 **معزول** |

**التوزيع الفعلي:**
| المستوى | الأسئلة |
|---|---|
| L0 | 42 |
| L1 | 227 |
| L2 | 80 |
| L3 | 80 |
| L4 | 80 |
| L5 | 80 |
| L6 | 50 |
| L7 | 27 |
| **المجموع** | **666** |

### 2.3 bank-v2 + bank-raw — للقطع

| الملف | الحجم | يُستخدم من |
|---|---|---|
| `bank-v2/` | 583 سؤالًا | CategoryExamScreen · PlacementTestScreen |
| `bank-raw/` | ~600 سؤالًا | bank-v2/bank-exam |
| `bank-linked.ts` | 475 | engine (معزول) |
| `bank-adapter.ts` | 375 | bank-linked |
| `bank.ts` | **1200** | ❌ لا أحد |

**القرار:** تُعزل عن الشاشات (Phase 2) · ثم تُحذف (Phase 6).

---

## 📁 3. الكود الميت — مؤكد بالدليل

| الملف | الأسطر | الدليل | الحالة |
|---|---|---|---|
| `src/data/bank.ts` | 1,200 | صفر استيراد | 🔴 حذف |
| `src/data/curriculum.ts` | 312 | صفر استيراد | 🔴 حذف |
| `src/data/index.ts` | 189 | **يحتوي BADGES** | ⚠️ يُفحص قبل الحذف |
| `src/utils/skillsChecker.ts` | 176 | صفر استيراد | 🔴 حذف |
| `src/utils/numerals.ts` | 126 | صفر استيراد | 🔴 حذف |
| `src/utils/audioAnzanBadges.ts` | 27 | صفر استيراد | 🔴 حذف |
| `src/utils/anzanBadges.ts` | 34 | يُستورد من badgeChecker (ميت) | 🔴 حذف |
| `src/utils/badgeChecker.ts` | 112 | صفر استيراد | 🔴 حذف |
| **المجموع** | **~2,176** | | |

**⚠️ قبل الحذف:**
- فحص `data/index.ts` — قد يحتوي BADGES (مؤكد)
- فحص استيراد ديناميكي (`import(...)`)

---

## 🐛 4. الأخطاء المؤكدة

### 4.1 🔴 خطأ فادح — `getAnzanBadgeKey` في `AnzanScreen:103`

**الكود الحالي:**
```ts
S03·S04 → master_addition       ✅ صحيح
S05·S06 → master_multiplication ❌ خطأ
S07·S08 → master_division       ❌ خطأ
S09·S10 → master_chains         ❌ خطأ
S11·S12 → master_mixed          ✅ صحيح
```

الصحيح (حسب المنهاج):

```ts
S03·S04 → master_addition       (L1: جمع وطرح)
S05·S06 → master_chains         (L4: سلاسل)
S07·S08 → master_multiplication (L2: ضرب)
S09·S10 → master_division       (L3: قسمة)
S11·S12 → master_mixed          (L5: مختلط)
```

الأثر:

· طفل L2 (ضرب) → يحصل على شارة قسمة
· طفل L3 (قسمة) → يحصل على شارة سلاسل
· طفل L4 (سلاسل) → يحصل على شارة ضرب

نفس الخطأ محتمل في AudioAnzanScreen:87 — يحتاج فحصًا.

4.2 🔴 recordAttempt لا يُستدعى

```
=== كيف يُستدعى recordAttempt في الشاشات ===
(فارغ)
```

الأثر: skillProgress فارغ · adaptiveEngine معزول · لا تعليم تكيفي.

الحل: إضافة 4 أسطر في 5 شاشات.

4.3 🔴 srb-adapter فيه 3 دوال معطوبة

```ts
getTestQuestions → buildSession(phase: "X") → Bank A (خطأ)
getPlacementTestQuestions → buildSession(phase: "PT") → Bank A (فارغ)
getExamQuestions → ❌ غير موجودة
```

الأثر: Bank B معزول · الامتحانات على bank-v2 القديم.

4.4 🔴 فجوة UI — 3 شارات مفقودة

البصري: Store فيه 5 · UI يعرض 4 → master_chains مفقود
السمعي: Store فيه 5 · UI يعرض 3 → master_chains_audio + master_mixed_audio مفقودان

الحل: إضافة 3 أسطر في GuardianDashboard.anzanBadgeList + audioAnzanBadgeList.

4.5 🟡 BADGES معزولة في data/index.ts

8 شارات جاهزة: مبتدئ · متدرب · سيد الأنزان · ماهر · خبير السوروبان · محترف · أسطورة · أسطورة خالدة.

لا تُعرض في أي مكان حاليًا.

الحل: ربطها في GuardianDashboard (لا ملفات جديدة).

---

🔒 5. المحمي — لا يُلمس

الملف السبب
store/progressStore.ts قلب المشروع · 26 action
curriculum/types.ts 12 مستوردًا
data/srb/generateId.ts صيغة ID موحّدة
data/srb/types.ts نموذج البيانات
utils/numberStyle.ts 14 مستوردًا
engine/sorobanEngine.ts المحرك الرياضي
engine/sorobanMoves.ts قواعد الحركات
utils/certificateGenerator.ts 3 مستخدمين
data/srb-adapter.ts يُصلح 3 دوال فقط · لا يُعاد كتابة
src/engine/adaptiveEngine.ts لا يُعاد كتابة · يُرحَّل
src/engine/masteryTracker.ts لا يُعاد كتابة
src/engine/problemGenerator.ts لا يُعاد كتابة

---

🎯 6. الحلقة المفقودة — Attempt Record

القطع الجاهزة

القطعة المكان الحالة
SRBQuestion srb/types.ts ✅
skillId generateId.getSkillId() ✅
createAttempt() masteryTracker.ts:177 ✅
recordAttempt() progressStore.ts:394 ✅
skillProgress progressStore (state) ✅
masteryTracker engine/masteryTracker.ts ✅
adaptiveEngine engine/adaptiveEngine.ts ⚠️ على bank-linked
استدعاء recordAttempt الشاشات ❌ مفقود

الحل (4 أسطر × 5 شاشات)

```ts
import { createAttempt } from '@/engine/masteryTracker';
import { useProgressStore } from '@/store/progressStore';

const attempt = createAttempt(skillId, userAnswer, correctAnswer, timeMs);
useProgressStore.getState().recordAttempt(attempt);
```

الشاشات: PracticeScreen · AnzanScreen · AudioAnzanScreen · CategoryExamScreen · PlacementTestScreen.

---

🌍 7. نظام الترجمة

البنية

المكون الحالة
i18n/ar.ts (311) 💀 ميت · جاهز
i18n/en.ts (311) 💀 ميت · جاهز
i18n/useTranslation.ts (41) 💀 ميت
i18n/index.ts (29) 💀 ميت
setLanguage في progressStore ⏳ موجود
LanguageToggle ❌ غير موجود
lessons/types.ts ✅ BilingualText · resolveLocalized
numberStyle.ts ✅ 14 مستوردًا
arabicNumbers.ts ✅ للنطق

الجاهزية: 65%.

---

🖥️ 8. الشاشات

المربوطة (13)

HeroDashboard · RoleSelection · WelcomeScreen · CategoryScreen · LevelScreen · LevelTestScreen · PracticeScreen · AnzanScreen · AudioAnzanScreen · RemediationScreen · LearnScreen · LessonScreen · IntroductionScreen · CertificateScreen · KidsCertificateScreen · MagicSecretsScreen · FingerMathScreen · SorobanPlayground · GuardianDashboard

تحتاج نقلة (Phase 2)

· CategoryExamScreen (→ Bank B)
· PlacementTestScreen (→ Bank B)
· LevelTestScreen (→ Bank B)

---

📊 9. المفاتيح

الرئيسي: sorobanmind-v2-progress (progressStore · version 5)
الشارات: soroban_mastery_badges (masteryBadgesStore)
الأرقام: soroban_number_style
المرافق: soroban_companion · soroban_child_name

مفاتيح مبعثرة: ~32.

مفاتيح ميتة: soroban_anzan_badges · soroban_anzan_audio_badges (من الملفات الميتة).

---

🗺️ 10. الخطة — 7 مراحل

Phase 0 — التوثيق (مكتمل)

· ✅ جرد كامل
· ✅ هذه الوثيقة
· ✅ tag احتياطي

Phase 1 — التنظيف الآمن (يومان)

حذف مؤكد:

· data/bank.ts (1200)
· data/curriculum.ts (312)
· utils/skillsChecker.ts (176)
· utils/numerals.ts (126)
· utils/audioAnzanBadges.ts (27)
· utils/anzanBadges.ts (34)
· utils/badgeChecker.ts (112)

فحص قبل الحذف:

· data/index.ts (189 — يحتوي BADGES)

المجموع: ~2,000 سطر محذوف.

Phase 2 — إصلاح الأخطاء (يومان)

1. إصلاح getAnzanBadgeKey في AnzanScreen:103
2. إصلاح نفس الخطأ في AudioAnzanScreen:87
3. إضافة 3 شارات لـUI في GuardianDashboard
4. ربط BADGES الـ8 في GuardianDashboard (بلا ملف جديد)

Phase 3 — Attempt Record (أسبوع)

1. إضافة 4 أسطر في 5 شاشات
2. اختبار skillProgress يمتلئ
3. تفعيل masteryTracker

Phase 4 — ربط Bank B (أسبوع)

1. بناء srb/exam/index.ts — يجمع L0-L7 → EXAM_BANK
2. بناء srb/exam/examBuilder.ts — CE1 · CE2
3. إصلاح 3 دوال في srb-adapter.ts
4. ربط 3 شاشات
5. Parity Test
6. قطع bank-v2 (الملفات تبقى)

Phase 5 — ترحيل adaptiveEngine (أسبوع)

1. تعديل adaptiveEngine.ts: bank-linked → srb-adapter
2. تعديل problemGenerator.ts: نفس الشيء
3. تطبيق 70/30
4. اختبار

Phase 6 — إكمال الترجمة (أسبوع)

1. زر LanguageToggle (بلا ملف جديد — مكان في Header)
2. ربط useT في الشاشات تدريجيًا
3. ترحيل النصوص

Phase 7 — التنظيف النهائي (أسبوع)

1. حذف bank-v2 · bank-raw · bank-linked · bank-adapter
2. حذف data/index.ts (بعد فحص)
3. حذف numerals.ts (بعد الترجمة)
4. PWA · اختبار · نشر

المجموع: ~6 أسابيع.

---

🚫 11. القواعد لأي مساعد قادم

ممنوع مطلقًا

1. إعادة بناء من الصفر
2. حذف البنوك قبل النقل
3. حذف L00-L20 قبل Migration
4. إعادة كتابة engine/
5. توحيد التخزين قبل نقل الامتحانات
6. اعتبار adaptiveEngine ميتًا
7. إضافة ملفات جديدة قبل البحث في data/index.ts · hooks/ · components/
8. اعتبار README/PROJECT_MASTER مصدر حالة
9. إعادة كتابة دوال srb-adapter.ts
10. حذف سطر من الوثيقة بدون دليل
11. حذف progressStore.ts
12. اعتبار "يُستورد" = "يعمل"

مطلوب من كل مساعد

1. اقرأ AL-ISLAH-V2.md كاملًا
2. تحقّق من الكود الفعلي (grep · قراءة)
3. اسأل "هل هذا مقصود؟"
4. إصلاح جراحي · ملف واحد · اختبار
5. نسخة احتياطية قبل كل مرحلة
6. أضف — لا تحذف
7. قبل اقتراح ملف جديد: ابحث

---

📅 12. سجل التعديلات

التاريخ الإضافة
2026-10-07 إنشاء الوثيقة · جرد كامل · 5 أخطاء مؤكدة · خطة 7 مراحل

---

🔗 13. أدوات التحقق

Workflow: .github/workflows/audit.yml
التشغيل: Actions → Audit → Run workflow
المخرج: audit-report-v4.txt

يُشغَّل قبل كل مرحلة للتأكد من عدم تغيّر الحالة.

---

آخر مراجعة: 2026-10-07 — بناءً على فحص فعلي.
هذه الوثيقة تراكمية.

```