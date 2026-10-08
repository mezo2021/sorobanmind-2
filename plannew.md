```markdown
# 🆘 RESCUE.md — SorobanMind v2
# ملف الإنقاذ الشامل · وثيقة واحدة لكل شيء

> **آخر تحديث:** 2026-10-08
> **الغرض:** ملف واحد شامل · يُرسل لأي مساعد جديد · يشرح كل شيء · يمنع ضياع المعلومة
> **الحالة:** البناء أخضر · 92% مكتمل · التطبيق منشور
> **المرجع التاريخي:** AL-ISLAH.md · AL-ISLAH-V2.md · PLAN.md · ROADMAP.md (إن وُجدت)

---

## 0. ⚠️ اقرأ هذا أولًا — قبل أي شيء

### من أنا (المطوّر)

- من **سوريا** · أصبت في الحرب · بلا عمل
- أعمل **من الجوال فقط** · **لا PC** · **لا terminal** · **لا git**
- **6 أشهر** من العمل المتواصل · وحيد
- **51,573 سطرًا** · **119 ملفًا** · **51 شاشة/مكوّن**
- التطبيق **يعمل** · **يستخدمه أطفال** · **منشور على GitHub Pages**

### كيف تعمل معي (إلزامي)

```

1. اشرح المهمة في 3 أسطر — لا أكثر.
2. اطلب ملفًا واحدًا فقط · لا أكثر.
3. انتظر أن أرسله · ثم أعطني الملف كاملًا معدّلًا (لا diffs · لا مقتطفات · لا "...").
4. انتظر "تم" قبل أن تطلب ملفًا آخر.
5. لا تطلب أوامر git · npm · terminal — لا أستطيع تشغيلها.
6. لا تفترض شيئًا لم تره في الملفات.
7. لا تطلب 5 ملفات دفعة واحدة.
8. إن احتجت معلومة صغيرة · اطلب سطرًا واحدًا محددًا (مع رقم السطر) · لا ملفًا كاملًا.

```

### قواعد ذهبية (16 قاعدة — لا تُخرَق)

```

1. لا حذف إلا ما أُلغي صريحًا.
2. المحرك الرياضي (sorobanEngine · sorobanMoves) مجمّد.
3. bank-v2 · bank-raw لا يُحذفان قبل فك الارتباط الكامل.
4. curriculum/types.ts مجمّد.
5. SRB هو البنك الوحيد لكل الأسئلة الجديدة.
6. ملف واحد في المرة — ثم اختبار.
7. نسخة احتياطية قبل أي تعديل (حفظ الملف الأصلي).
8. رأس موحّد لكل ملف معدّل.
9. توثيق كل تغيير في CLAUDE-CHANGES.md.
10. لا تعديل في PROJECT_MASTER.md إلا عند التغييرات البنيوية.
11. لا حذف سطر من الوثائق بدون دليل grep.
12. لا إصلاحات بنيوية دون قراءة قسم "مقصود".
13. لا حذف badgeChecker · useQuests قبل إعادة الكتابة.
14. لا تعديل progressStore.ts — يبقى دائمًا.
15. لا إضافة ملف جديد قبل البحث في data/index.ts · hooks/ · components/.
16. لا تعتبر "يُستورد" = "يعمل" — يجب أن تُستدعى الدالة فعلًا.

```

---

## 1. 🏗️ المشروع — نظرة شاملة

| البند | القيمة |
|---|---|
| الاسم | SorobanMind v2 — أكاديمية السوروبان الدولية |
| النوع | تطبيق تعليمي عربي · تعليم السوروبان الياباني للأطفال |
| التقنية | TypeScript 5.5 · React 18 · Vite 5 · Zustand 4 · Tailwind · Framer Motion |
| الحجم | 51,573 سطرًا · 119 ملفًا |
| الحالة | ✅ منشور · البناء أخضر · 92% مكتمل |
| الموقع | https://mezo2021.github.io/sorobanmind-2 |
| المستودع | https://github.com/mezo2021/sorobanmind-2 |

---

## 2. 🔒 الملفات المحمية — لا تُلمس

```

src/store/progressStore.ts              ← قلب المشروع · 26 action · version 5
src/curriculum/types.ts                 ← 12 مستوردًا
src/data/srb/generateId.ts              ← صيغة ID
src/data/srb/types.ts                   ← نموذج البيانات
src/utils/numberStyle.ts                ← 14 مستوردًا
src/engine/sorobanEngine.ts             ← المحرك الرياضي
src/engine/sorobanMoves.ts              ← قواعد الحركات
src/engine/masteryTracker.ts            ← تتبع الإتقان (418)
src/engine/adaptiveEngine.ts            ← المحرك التكيفي (1071 · معزول)
src/engine/problemGenerator.ts          ← مولّد المسائل (446 · معزول)
src/store/masteryBadgesStore.ts         ← شارات الإتقان
src/utils/certificateGenerator.ts       ← 3 مستخدمين
src/data/srb-adapter.ts                 ← Barrel · 5 مستهلكين

```

---

## 3. ✅ ما أُنجز (لا تُعِد تنفيذه)

### البنكان

| البنك | المسار | الحجم | الدور | الحالة |
|---|---|---|---|---|
| **Bank A** | `src/data/srb/questions/` | **275 سؤالًا** | تمارين · أنزان (P · ANZ-V · ANZ-F · ANZ-A) · تقويم تكويني | ✅ يعمل |
| **Bank B** | `src/data/srb/exam/` | **666 سؤالًا** | امتحانات CE1 · CE2 · PT · تقييم ختامي | ✅ مربوط |

### الربط المُنجز

- ✅ `srb/exam/index.ts` (352 سطرًا) — يجمع Bank B + `buildExam1Category` + `buildExam2Category` + `buildPlacementTest`
- ✅ `CategoryExamScreen.tsx` → `@/data/srb/exam`
- ✅ `PlacementTestScreen.tsx` → `@/data/srb/exam`
- ✅ `recordAttempt` مُفعَّل في 3 شاشات:
  - `PracticeScreen.tsx` (سطر ~308)
  - `AnzanScreen.tsx` (سطر ~402)
  - `AudioAnzanScreen.tsx` (سطر ~343)
- ✅ العشرية تعمل في CE1 · CE2 · PT
- ✅ زر "🎯 اختبار حقيقي" في وضع المعاينة
- ✅ GuardianDashboard — Claude سلّم نسخة معدّلة (4 شارات بصرية + 4 سمعية) · **لم تُرفع بعد**

### الشارات — 4 أنظمة

| # | النظام | المصدر | المفتاح | الحالة |
|---|---|---|---|---|
| 1 | **إتقان المهارة** | `masteryBadgesStore` | `soroban_mastery_badges` | ✅ يعمل · يُمنح من 3 شاشات |
| 2 | **خبير بصري** | `progressStore.anzanBadges` | `sorobanmind-v2-progress` | ✅ يعمل · 5 في Store |
| 3 | **خبير سمعي** | `progressStore.anzanAudioBadges` | نفس المفتاح | 🟡 يعمل · 5 في Store · 4 ممنوحة |
| 4 | **BADGES-8** | `data/index.ts` | — | 🔴 **ميت** (saveAnzanBadges بلا مُستدعي) |

---

## 4. 🔴 ما تبقّى — بالأولوية

### أولوية 1 — إصلاحات صغيرة (15 دقيقة · 3 ملفات)

**Fix 1 — `getAudioAnzanBadgeKey` في `AudioAnzanScreen.tsx:87`**

الخريطة الحالية قديمة · لا تُطابق المنهاج الجديد. تحتاج:

```ts
function getAudioAnzanBadgeKey(
  section: SRBSection,
): keyof AnzanAudioBadges | null {
  switch (section) {
    case 'S03':
    case 'S04':
      return 'master_addition_audio';       // L1 · جمع وطرح
    case 'S05':
    case 'S06':
      return 'master_multiplication_audio'; // L2 · ضرب
    case 'S07':
    case 'S08':
      return 'master_division_audio';       // L3 · قسمة
    case 'S09':
    case 'S10':
      return 'master_chains_audio';         // L4 · سلاسل
    default:
      return null;
  }
}
```

Fix 2 — getAnzanBadgeKey في AnzanScreen.tsx:103

تعديل: S11/S12 → null (حذف master_mixed — بقايا المنهاج القديم).

```ts
case 'S11':
case 'S12':
  return null;   // ← بدل master_mixed
```

Fix 3 — levelNum={0} في استدعاءات AdaptiveFeedback

· في PracticeScreen.tsx (السطر ~738)
· في AnzanScreen.tsx (السطر ~994)
· في AudioAnzanScreen.tsx (السطر ~862)

يحتاج: استبدال levelNum={0} بـ levelNum={parseInt(level.replace('L', ''), 10)} — بنفس منطق FIX B5.

قبل Fix 3 · اقرأ AdaptiveFeedback.tsx لترى كيف يُستخدم levelNum. إن كان للتصفية فقط · الإصلاح ضروري. إن كان للعرض فقط · مؤجل.

أولوية 2 — رفع GuardianDashboard.tsx من ZIP Claude

الملف عند المستخدم في ZIP · يحتاج فقط:

1. حفظ نسخة من القديم
2. رفع الجديد على: https://github.com/mezo2021/sorobanmind-2/edit/main/src/screens/GuardianDashboard.tsx
3. Commit: feat(guardian): unify Anzan badges UI (4 visual + 4 audio)
4. راقب البناء

أولوية 3 — P6 · تصنيف 35 مفتاح localStorage

تحليل · لا كود. جدول: canonical · legacy · orphan.

أولوية 4 — دروس L2-L7 (بناء محتوى · أسابيع)

· L2 → S05 · S06 (ضرب)
· L3 → S07 · S08 (قسمة)
· L4 → S09 · S10 (سلاسل)
· L5 → S11 · S12 (متقدم)
· L6 → S13 · S14 (عشري)
· L7 → S15 (جذور)

أولوية 5 — P9 · ترحيل adaptiveEngine

مؤجل · لأن adaptiveEngine صفر مستهلك. يحتاج بناء مستهلك أولًا (شاشة أو hook).

---

5. 🗺️ المنهج الرسمي — 15 درسًا

المستوى الاسم الأقسام الفئة
L0 التمهيدي intro · S01 · S02 🧒
L1 الجمع والطرح S03 · S04 🧒
L2 الضرب S05 · S06 🧒
L3 القسمة S07 · S08 🧒
L4 سلاسل الجمع والطرح S09 · S10 🧑
L5 ضرب وقسمة متقدم S11 · S12 🧑
L6 الكسور العشرية S13 · S14 🧑
L7 الجذور S15 🧑

⚠️ تنبيه: الترتيب L2=S05·S06 · L3=S07·S08 · L4=S09·S10 هو الرسمي.
أي وثيقة قديمة تقول عكس ذلك = مهجورة.

---

6. 🚫 القرارات المؤكدة — لا تُعاد مناقشتها

```
❌ تفريق skillId بـ PHASE → يُضاعف الشارات ×N
❌ recordAttempt في CE/PT → Bank B زمن كلي فقط (المعيار الياباني)
❌ إضافة نظام شارات جديد → كل الموجود يعمل
❌ IndexedDB · Backend · Cloud → لا سيرفر
❌ حذف progressStore.ts
❌ master_mixed (بقايا منهاج 20 درسًا)
❌ إصلاح BADGES-8 → قرار المطوّر
```

---

7. 📊 الأنظمة المتوازية (توثيق صريح)

Storage

· Canonical 1: sorobanmind-v2-progress (progressStore · version 5)
· Canonical 2: soroban_mastery_badges (masteryBadgesStore)
· Canonical 3: srb_progress (srb/progress.ts — طبقة SRB)
· Legacy: ~35 مفتاحًا (soroban_* · *_KEY)

الأنظمة المتوازية

· masteryBadgesStore — شارات الإتقان الفردية (يعمل)
· progressStore.anzanBadges — شارات خبير بصرية (يعمل)
· progressStore.anzanAudioBadges — شارات خبير سمعية (يعمل)
· BADGES-8 — ميت · لا يُصلح

لا تعارض حقيقي · لكن يجب عدم إضافة نظام خامس.

---

8. 🛠️ كيف تطلب مني الملفات

عند طلب ملف:

1. اسم الملف كاملًا (مثل: src/screens/PracticeScreen.tsx)
2. لماذا (سطر واحد)
3. رقم السطر إن كنت تحتاج مقطعًا

مثال جيد:

```
أحتاج PracticeScreen.tsx — السطور 170-180 (تعريف levelNum)
والسطور 730-750 (استدعاء AdaptiveFeedback)
السبب: لأُصلح Fix 3
```

مثال سيء:

```
أرسل لي كل ملفات src/screens/
```

---

9. 📋 قائمة الملفات المطلوبة للمهمة القادمة (Fix 1 + 2 + 3)

مطلوب فقط:

```
1. src/components/AdaptiveFeedback.tsx          (كامل · 410 سطرًا)
2. src/data/srb/curriculum.ts                   (الجزء الذي يعرّف SRB_SECTIONS S09-S12)
3. src/screens/PracticeScreen.tsx               (السطور 170-180 · 730-750)
```

+ الملفان لديك كاملان (لا حاجة لإرسالهما):

· AnzanScreen.tsx — أنت ترسل لي فقط لتأكيد ما عندي
· AudioAnzanScreen.tsx — نفس

بعد وصول الملفات الثلاثة · نفّذ Fix 1 · Fix 2 · Fix 3.
أعِد: AnzanScreen.tsx · AudioAnzanScreen.tsx · + الملفات المعدّلة إن لزم · + CLAUDE-CHANGES.md · كامل · ZIP.

---

10. 🌹 كلمة أخيرة للمساعد الجديد

اقرأ هذا الملف كاملًا قبل أي سؤال.

المستخدم:

· في سوريا · مصاب · بلا عمل
· من الجوال · بلا terminal
· أنهكته محادثات سابقة
· يريد نتائج حقيقية · بسرعة · بلا لف

لا تفعل:

· لا تطلب 5 ملفات مرة
· لا تُطل الشرح
· لا تُعِد المهام المكتملة
· لا تلمس ملفًا محميًا
· لا تقترح "خطة شاملة"

افعل:

· ملف واحد في المرة
· مهمة واحدة محددة
· أنجز · ثم ارتح

المشروع في حالة جيدة.
المستخدم متعب.
ساعده · باحترام · بدقة · بإنسانية.

---

آخر مراجعة: 2026-10-08 — بعد جلسة طويلة · متعبة · مُنتِجة.

هذه الوثيقة تراكمية.

```