
# 📋 AL-ISLAH-V2.md
# وثيقة الإصلاح الشاملة — مبنية على فحص فعلي

> **آخر تحديث:** 2026-10-07 (ج) — بعد تنفيذ P4 (ربط Bank B) + اعتماد PLAN_v3
> **الطريقة:** فحص آلي شامل (audit-report-v5) + قراءة يدوية لأكثر من 20 ملفًا
> **القاعدة:** لا تخمين · كل سطر له دليل من الكود
> **الحالة:** البناء أخضر · 51,573 سطرًا · 119 ملفًا · ~92% مكتمل
> **الخطة التنفيذية:** [`PLAN_v3.md`](./PLAN_v3.md) — المرجع للتسلسل والمراحل
> **المرجع التاريخي:** [`AL-ISLAH.md`](./AL-ISLAH.md) — وثيقة الحماية الأصلية

---

## 🔗 0. الوثائق المرجعية

| الملف | الغرض |
|---|---|
| `AL-ISLAH-V2.md` | **هذا الملف** — الجرد الفعلي + الأخطاء |
| **`PLAN_v3.md`** | **الخطة التنفيذية (P1-P16) — الأولوية للتسلسل** |
| `PROJECT_MASTER.md` | المرجع التقني الموحّد |
| `ACHIEVEMENTS.md` | سجل الجلسات |
| `AL-ISLAH.md` | وثيقة الحماية الأصلية (مرجعية) |
| `GEMINI_PLAYBOOK.md` | دليل بناء Bank B |
| `README.md` | نظرة عامة للمستخدمين |

**⬅️ للقواعد والقرارات المعمارية:** اقرأ `PLAN_v3.md` أولًا.
**⬅️ للأخطاء والجرد الفعلي:** اقرأ هذا الملف.

---

## 📖 1. الخلاصة التنفيذية

**التطبيق يعمل · يستخدمه أطفال · 92% مكتمل فعليًا.**

**المشكلة الحقيقية:** نظامان يعملان بالتوازي (قديم + جديد) → هجرة معمارية نصف مكتملة.

**السبب:** المنهاج تغيّر (20 درسًا → 15 درسًا · كوجيما الأصلي). بُني SRB جديد · لكن القديم لم يُحذف · الشاشات لم تُحدَّث كليًا.

**ما تم إنجازه في الجلسة الأخيرة:**
- ✅ `srb/exam/index.ts` — Bank B مُجمَّع + CE + PT
- ✅ ربط `CategoryExamScreen` بـ`srb/exam`
- ✅ ربط `PlacementTestScreen` بـ`srb/exam`
- ✅ إصلاح العشرية في PT
- ✅ `recordAttempt` مُفعَّل في 3 شاشات (Practice · Anzan · AudioAnzan)
- ✅ زر "اختبار حقيقي" في CE1 · CE2
- ✅ `PLAN_v3.md` — خطة GPT + قرارات المطوّر

**الحل:** إكمال التوصيل · لا إعادة بناء.

---

## 🏦 2. البنوك — الوضع الفعلي

### 2.1 Bank A — التمارين والأنزان

| البند | القيمة |
|---|---|
| المسار | `src/data/srb/questions/` |
| الحجم الفعلي | **275 سؤالًا** (283 نتيجة grep − 8 ترويسات) |
| `variant` | "A" |
| `primary_phase` | "P" |
| `allowed_phases` | E · T · P · ANZ-V · ANZ-F · ANZ-A · X |
| `anzan_time_ms` | > 0 (مستخدم) |
| `solution` | شرح تربوي غني |
| **الدور** | تقويم تكويني |
| **الحالة** | ✅ **يعمل** |

**المسار الفعلي:**
```

PracticeScreen · AnzanScreen · AudioAnzanScreen · RemediationScreen
↓
srb-adapter → srb/index → srb/questions (Bank A)

```

### 2.2 Bank B — التقييم الختامي

| البند | القيمة |
|---|---|
| المسار | `src/data/srb/exam/` |
| الحجم الفعلي | **666 سؤالًا** (674 نتيجة grep − 8 ترويسات) |
| `variant` | "B" |
| `primary_phase` | "CE" |
| `allowed_phases` | CE · PT · X |
| `anzan_time_ms` | 0 (غير مطلوب) |
| `solution` | معادلة مباشرة |
| **الدور** | تقييم ختامي (CE1 · CE2 · PT) |
| **الحالة** | ✅ **مربوط (جلسة 24)** |

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

**ملاحظة:** البحث `grep -c "makeQuestion"` يعطي 674 — الفرق 8 ناتج عن تعليق في رأس كل ملف.

### 2.3 بنية `srb/exam/`

```

src/data/srb/exam/
├── L0.ts (503)
├── L1.ts (4347)
├── L2.ts (1554)
├── L3.ts (1552)
├── L4.ts (1552)
├── L5.ts (1232)
├── L6.ts (778)
├── L7.ts (421)
└── index.ts (352) ← ملف واحد يجمع + buildExam1/2 + PT

```

### 2.4 البنوك القديمة — للقطع

| الملف | الحجم | يُستخدم من |
|---|---|---|
| `bank-v2/` | 583 سؤالًا | bank-linked فقط |
| `bank-raw/` | ~600 سؤالًا | bank-v2/bank-exam |
| `bank-linked.ts` | 475 | engine (adaptiveEngine · problemGenerator) |
| `bank-adapter.ts` | 375 | bank-linked |
| `bank.ts` | **1200** | ❌ لا أحد |

**الوضع الفعلي (من التقرير v5):**
- `bank-v2` يُستورد فقط من `bank-linked`
- `bank-linked` يُستورد فقط من `engine/adaptiveEngine` + `engine/problemGenerator`
- `engine/` **معزول بالكامل** عن الشاشات

**القرار:** تُحذف بعد ترحيل `adaptiveEngine` (المرحلة P9).

---

## 📁 3. الكود الميت — مؤكد بالدليل (تقرير v5)

| # | الملف | الأسطر | الدليل | الحالة |
|:-:|---|:-:|---|---|
| 1 | `data/bank.ts` | 1,200 | صفر استيراد | 🔴 حذف |
| 2 | `data/curriculum.ts` | 312 | صفر استيراد | 🔴 حذف |
| 3 | `data/index.ts` | 189 | **يحتوي BADGES** | ⏸️ لاحقًا (P3) |
| 4 | `utils/skillsChecker.ts` | 176 | صفر استيراد | 🔴 حذف |
| 5 | `utils/numerals.ts` | 126 | صفر استيراد (نسخة قديمة) | 🔴 حذف |
| 6 | `utils/audioAnzanBadges.ts` | 27 | صفر استيراد | 🔴 حذف |
| 7 | `utils/anzanBadges.ts` | 34 | يُستورد من badgeChecker (معزول) | 🔴 حذف |
| 8 | `utils/badgeChecker.ts` | 112 | يُستورد فقط من useGameStats | ⚠️ يُفحص |
| **المجموع** | | **~2,176** | | |

**⚠️ ملاحظات:**
- `badgeChecker.ts` **ليس ميتًا تمامًا** — يُستورد من `useGameStats.ts:14`
- `data/index.ts` يحتوي **BADGES الـ8** — يُربط في P3
- `anzanBadges.ts` + `audioAnzanBadges.ts` — نسخ قديمة من `progressStore.anzanBadges`

---

## 🐛 4. الأخطاء المؤكدة والملغاة

### ✅ 4.1 ملغى — `getAnzanBadgeKey` **صحيح**

**كان مذكورًا كخطأ · لكن الكود الحالي صحيح:**

```ts
S03·S04 → master_addition       ✅ (L1 · جمع وطرح)
S05·S06 → master_multiplication ✅ (L2 · ضرب)
S07·S08 → master_division       ✅ (L3 · قسمة)
S09·S10 → master_chains         ✅ (L4 · سلاسل)
S11·S12 → master_mixed          ✅ (L5 · مختلط)
```

يطابق srb/questions/L2.ts · L3.ts · L4.ts الفعلية.

السبب: الوثيقة القديمة اعتمدت على ترتيب GEMINI_PLAYBOOK المهجور.

✅ 4.2 مُصلَح — recordAttempt يعمل في 3 شاشات

```
src/screens/PracticeScreen.tsx:308:  useProgressStore.getState().recordAttempt(attempt);
src/screens/AnzanScreen.tsx:402:    useProgressStore.getState().recordAttempt(attempt);
src/screens/AudioAnzanScreen.tsx:343:  useProgressStore.getState().recordAttempt(attempt);
```

متبقٍ (P7):

· CategoryExamScreen.tsx — يحتاج إضافة
· PlacementTestScreen.tsx — يحتاج إضافة

✅ 4.3 مُصلَح — srb/exam مربوط

```
src/screens/PlacementTestScreen.tsx:28:  from '@/data/srb/exam';
src/screens/CategoryExamScreen.tsx:34:    from '@/data/srb/exam';
```

bank-v2 لم يعد يُستورد من الشاشات.

🔴 4.4 قائم — فجوة UI في GuardianDashboard

البصري: Store فيه 5 شارات · UI يعرض 4 → master_chains مفقود.
السمعي: Store فيه 5 شارات · UI يعرض 3 → master_chains_audio + master_mixed_audio مفقودان.

الحل: إضافة 3 أسطر في anzanBadgeList + audioAnzanBadgeList.

⬅️ مؤجل حسب قرار المطوّر: "كل الشارات تعمل · لا نُنشئ جديد".

🟡 4.5 قائم — BADGES الـ8 معزولة

8 شارات جاهزة في data/index.ts:
مبتدئ · متدرب · سيد الأنزان · ماهر · خبير السوروبان · محترف · أسطورة · أسطورة خالدة.

useGameStats.ts:14 يستورد getAllEarnedBadges من badgeChecker — الذي يقرأ BADGES لكن لا يمنحها.

الحل (P3 · لاحقًا): ربط منطق المنح في useGameStats أو progressStore.

🔴 4.6 قائم — 5 مفاتيح يتيمة (تُقرأ ولا تُكتب)

المفتاح القارئ
soroban_passed_level_tests LevelScreen:139
soroban_exam_result HeroDashboard:142
soroban_placement_recommended CategoryScreen:178
soroban_placement_last_attempt ❌
soroban_placement_result ❌

---

🔒 5. المحمي — لا يُلمس

الملف السبب
store/progressStore.ts قلب المشروع · 26 action · version 5
curriculum/types.ts 12 مستوردًا · عقد أساسي
data/srb/generateId.ts صيغة ID موحّدة
data/srb/types.ts نموذج البيانات
utils/numberStyle.ts 14 مستوردًا
engine/sorobanEngine.ts المحرك الرياضي
engine/sorobanMoves.ts قواعد الحركات
utils/certificateGenerator.ts 3 مستخدمين
data/srb-adapter.ts يُصلح 3 دوال فقط · لا يُعاد كتابة
store/masteryBadgesStore.ts كل الشارات تعمل
src/engine/adaptiveEngine.ts لا يُعاد كتابة · يُرحَّل (P9)
src/engine/masteryTracker.ts لا يُعاد كتابة
src/engine/problemGenerator.ts لا يُعاد كتابة

---

🎯 6. Attempt Record — الحالة الفعلية

6.1 القطع الجاهزة

القطعة المكان الحالة
SRBQuestion srb/types.ts ✅
skillId generateId.getSkillId() ✅
createAttempt() masteryTracker.ts:177 ✅
recordAttempt() progressStore.ts:394 ✅
skillProgress progressStore (state) ✅
masteryTracker engine/masteryTracker.ts ✅
adaptiveEngine engine/adaptiveEngine.ts ⚠️ على bank-linked
استدعاء recordAttempt 3 شاشات ✅ مربوط

6.2 الشاشات — الحالة

الشاشة الحالة
PracticeScreen.tsx ✅ مُفعَّل (سطر 308)
AnzanScreen.tsx ✅ مُفعَّل (سطر 402)
AudioAnzanScreen.tsx ✅ مُفعَّل (سطر 343)
CategoryExamScreen.tsx 🔴 مفقود
PlacementTestScreen.tsx 🔴 مفقود

6.3 التصميم المعتمد

```ts
// في handleCheck · بعد حساب isCorrect:
const attempt = {
  skillId: `${currentQ.level}-${currentQ.section}-${currentQ.module}`,
  correct: isCorrect,
  timeMs: elapsedMs,
  timestamp: Date.now(),
};
useProgressStore.getState().recordAttempt(attempt);
```

---

🌍 7. نظام الترجمة

المكوّن الحالة
i18n/ar.ts (311) 💀 ميت · جاهز
i18n/en.ts (311) 💀 ميت · جاهز
i18n/useTranslation.ts (41) 💀 ميت
i18n/index.ts (29) 💀 ميت
setLanguage في progressStore ⏳ موجود · غير مستخدم
LanguageToggle ❌ غير موجود
lessons/types.ts ✅ BilingualText · resolveLocalized
numberStyle.ts ✅ 14 مستوردًا
arabicNumbers.ts ✅ للنطق

الجاهزية: 65%.

⬅️ مؤجل حسب قرار المطوّر: الترجمة تبدأ بعد استقرار القلب (P13-P14 في PLAN_v3).

---

🖥️ 8. الشاشات — 22 شاشة

8.1 المربوطة في App.tsx (21 حالة)

```
welcome · role · hero-dashboard · guardian-dashboard
placement-test · soroban
category-exam-1 · category-exam-2
category-kids · category-teens
lesson-L0 … L7 (8 حالات)
practice-0 … 7 (8 حالات)
anzan-0 … 7 (8 حالات)
audio-anzan-0 … 7 (8 حالات)
quests · multiplication · secrets · cross-multiplication · division · final-exam
kids-certificate · certificate
```

8.2 الشاشات الـ22

# الشاشة الحالة
1 WelcomeScreen ✅
2 RoleSelection ✅
3 HeroDashboard ✅
4 GuardianDashboard ✅
5 CategoryScreen ✅
6 LevelScreen ✅
7 LearnScreen ✅
8 LessonScreen ✅
9 IntroductionScreen ✅
10 LevelTestScreen 🟡 يستخدم buildL0Test
11 FingerMathScreen ✅
12 MagicSecretsScreen ✅
13 PracticeScreen ✅
14 AnzanScreen ✅
15 AudioAnzanScreen ✅
16 PlacementTestScreen ✅ (مربوط بـBank B)
17 CategoryExamScreen ✅ (مربوط بـBank B)
18 SorobanPlayground ✅
19 Header ✅
20 CertificateScreen ✅
21 KidsCertificateScreen ✅
22 RemediationScreen ✅

---

📊 9. المفاتيح — خريطة كاملة (35 مفتاحًا)

9.1 الكاتب والقارئ

# المفتاح الكاتب القارئ
1 sorobanmind-v2-progress progressStore (persist) progressStore
2 sorobanmind-v2-lang progressStore progressStore
3 soroban_mastery_badges masteryBadgesStore masteryBadgesStore
4 srb_progress srb/progress:252,263 srb/progress:130
5 soroban_companion HeroDashboard · RoleSelection FloatingCompanion · HeroDashboard · RoleSelection
6 soroban_child_name RoleSelection · HeroDashboard App:462
7 soroban_child_full_name CertificateScreen · KidsCertificateScreen نفسها
8 soroban_completed_lessons App:309,353 App:305,349
9 soroban_completed_levels LevelTestScreen:148 · CategoryExamScreen:239 LevelTestScreen:144
10 soroban_passed_practice App:587 App:583
11 soroban_passed_level_tests ❌ LevelScreen:139
12 soroban_exam1_passed CategoryExamScreen:231 (ديناميكي) CategoryScreen:179
13 soroban_exam2_passed CategoryExamScreen:231 (ديناميكي) CategoryScreen:180 · HeroDashboard:115
14 soroban_exam1_score CategoryExamScreen:232 (ديناميكي) CertificateScreen:54
15 soroban_exam2_score CategoryExamScreen:232 (ديناميكي) CertificateScreen:59
16 soroban_exam1_last_attempt CategoryExamScreen:233 CategoryExamScreen:149
17 soroban_exam2_last_attempt CategoryExamScreen:233 CategoryExamScreen:149
18 soroban_exam_result ❌ HeroDashboard:142
19 soroban_section2_unlocked CategoryExamScreen:245 · App:497 غير مفحوص
20 soroban_kids_certificate_ready CategoryExamScreen:246 غير مفحوص
21 soroban_placement_weak_skills bank-v2/placement-engine · srb/exam/index:276 CategoryScreen:177
22 soroban_placement_recommended ❌ CategoryScreen:178
23 soroban_placement_last_attempt ❌ ❌
24 soroban_placement_result ❌ ❌
25 soroban_weak_skills_v2 bank-v2/index · placement-engine · srb/exam/index bank-v2/index:319
26 soroban_anzan_badges utils/anzanBadges:26 utils/anzanBadges:17 (معزول)
27 soroban_anzan_audio_badges utils/audioAnzanBadges:22 utils/audioAnzanBadges:13 (ميت)
28 soroban_number_style numerals:125 · numberStyle:81 numerals:117 · numberStyle:73
29 soroban_dev_preview previewMode:22 previewMode:12
30 soroban_welcome_seen App:74 App:62
31 soroban_passed_practice App:587 App:583
32 LESSON_SESSION_PREFIX + lessonId LessonScreen:83 LessonScreen:74
33 LESSON_PROGRESS_KEY LessonScreen:281,598 LessonScreen:277,594
34 L0_TEST_LAST_ATTEMPT_KEY LevelTestScreen:136 LevelTestScreen:79
35 L0_TEST_STORAGE_KEY LevelTestScreen:142 LevelTestScreen:138

9.2 مفاتيح يتيمة (تُقرأ ولا تُكتب)

· soroban_passed_level_tests
· soroban_exam_result
· soroban_placement_recommended
· soroban_placement_last_attempt
· soroban_placement_result

---

🏅 10. الشارات — 4 أنظمة متوازية

# النظام المصدر مانح قارئ الحالة
1 masteryBadgesStore soroban_mastery_badges PracticeScreen:397 · AnzanScreen:497 · AudioAnzanScreen:434 AdaptiveFeedback · GuardianDashboard · useGameStats ✅ يعمل
2 progressStore.anzanBadges sorobanmind-v2-progress AnzanScreen:452 GuardianDashboard:278 ✅ يعمل
3 progressStore.anzanAudioBadges نفس المفتاح AudioAnzanScreen:394 GuardianDashboard ✅ يعمل
4 BADGES (8) data/index.ts badgeChecker (يقرأ فقط) useGameStats:14 🟡 معزول

العلاقة بـAdaptiveFeedback:

```
src/components/AdaptiveFeedback.tsx:15  ← useMasteryBadgesStore
src/components/AdaptiveFeedback.tsx:18  ← useProgressStore (skillProgress)
src/components/AdaptiveFeedback.tsx:41  ← SkillPerformance (من performances prop)
```

لا تعارض · تكامل.

⚠️ قرار المطوّر (2026-10-07)

"كل ما هو موجود من شارات يعمل. لن ننشئ جديد. انتهينا. لاحقًا نضيف ما نحتاج."

يعني:

· ❌ إلغاء master_mixed
· ❌ شرط 100% + mastery
· ❌ تقسيم عادي/فلاش
· ❌ ربط BADGES الـ8

كل هذه القرارات مؤجلة للمرحلة B (في PLAN_v3).

---

🗺️ 11. الخطة — راجع PLAN_v3.md

التسلسل التنفيذي (P1-P16):

· P1 · P2 · P3 · P4 · P5 · P6 — مؤجلة
· P7 — إكمال recordAttempt في شاشتين (الأولوية 2)
· P8 — masteryTracker (يُغذّى تلقائيًا)
· P9 — نقل adaptiveEngine (الأولوية 1)
· P10 — اختبار Adaptive
· P11 → P16 — مؤجلة

⬅️ التفاصيل الكاملة في PLAN_v3.md.

---

🚫 12. القواعد لأي مساعد قادم

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
12. اعتبار "يُستورد" = "يعمل" — يجب أن تُستدعى الدالة فعلًا
13. إضافة نظام شارات جديد (كل الموجود يعمل · راجع PLAN_v3)
14. الانتقال إلى IndexedDB أو Backend (مؤجل)

مطلوب من كل مساعد

1. اقرأ AL-ISLAH-V2.md + PLAN_v3.md كاملًا
2. تحقّق من الكود الفعلي (grep · قراءة)
3. اسأل "هل هذا مقصود؟"
4. إصلاح جراحي · ملف واحد · اختبار
5. نسخة احتياطية قبل كل مرحلة
6. أضف — لا تحذف
7. قبل اقتراح ملف جديد: ابحث
8. قبل أي تعديل · أجب على 4 أسئلة PLAN_v3:
   · ما المصدر الحالي؟
   · لماذا لا يكفي؟
   · ما الملف الذي سيصبح مصدر الحقيقة؟
   · كيف سنثبت عدم وجود مصدر ثانٍ؟

---

📅 13. سجل التعديلات

التاريخ الإضافة
2026-10-07 (أ) إنشاء الوثيقة · جرد أول · 5 أخطاء مزعومة · خطة 7 مراحل
2026-10-07 (ب) تصحيح getAnzanBadgeKey (ملغى) · ربط srb/exam · recordAttempt في 3 شاشات · recordAttempt في PT · إصلاح العشرية
2026-10-07 (ج) تقرير v5 — جرد كامل للبنوك · المفاتيح · الشارات · المتاجر · المحرك · i18n
2026-10-07 (د) اعتماد PLAN_v3.md · ربط الوثيقتين · إضافة قرارات المطوّر

---

🔗 14. أدوات التحقق

Workflow: .github/workflows/audit.yml
الإصدار: v5 (شامل · 9 أقسام)
التشغيل: Actions → Audit → Run workflow
المخرج: audit-report-v5

يُشغَّل قبل كل مرحلة للتأكد من عدم تغيّر الحالة.

---

آخر مراجعة: 2026-10-07 — بناءً على تقرير v5 + تعديلات جلسة 24 + PLAN_v3.
هذه الوثيقة تراكمية.

```

---

## 🎬 بعد الاستبدال

**Commit:**
```

docs: link AL-ISLAH-V2 to PLAN_v3 · add developer decisions

```