📄 AL-ISLAH.md — المسودة الأولية

بناءً على فحص فعلي + أدلة مصورة. جاهز للنسخ.

---

```markdown
# 🛡️ AL-ISLAH.md
# وثيقة حماية مشروع SorobanMind v2

> ⚠️ اقرأ هذا الملف كاملًا قبل أي اقتراح أو تعديل.
> يمنع هدم المشروع من أي مساعد قادم.
> **القاعدة العليا:** ⛔ لا نبدأ من الصفر. لا نعيد البناء. لا نُعيد الكتابة.

**آخر تحديث:** 2026-10-04
**الحالة:** البناء #684 ✅ يعمل · التطبيق منشور
**مصادر التحقق:** فحص يدوي (screenshots) · تحليل GPT (50 سؤالًا) · قيد الانتظار: Claude

---

## 📖 1. اقرأ أولًا — تحذير

أنت أمام مشروع **مكتمل ~80%**، عمره ٦ أشهر، يعمل ويستخدمه أطفال.

**سترى فوضى ظاهرية — لن تكون فوضى:**
- `bank-v2/` · `bank-raw/` = حوض انتقالي (مقصود)
- `adaptiveEngine` · `problemGenerator` = معزولة قصديًا (ليست ميتة)
- `L00-L20` في LevelId = بنوك الامتحانات الحالية
- 35 مفتاح localStorage = مرحلة انتقالية

**قبل أي اقتراح — أجب ذهنيًا:**
1. هل هذا في **قسم 3 (مقصود)**؟
2. هل هو في **قسم 5 (أخطاء مؤكدة)**؟
3. هل اقتراحي **إصلاح جراحي** أم **إعادة بناء**؟
4. هل يمكن تنفيذه **دون حذف**؟

**إذا (3) = إعادة بناء → توقف.**

---

## 🎯 2. الحقيقة الكاملة

### يعمل فعلًا
- المنهج: 8 مستويات · 15 درسًا · 51 مهارة
- SRB: 275 سؤالًا
- L0 · L1 دروس · المقدمة · التمرّن · الأنزان الثلاثي · السوروبان 2D5 · القفل · الشهادات · النتيجة الموزونة
- `getPracticeQuestions` · `getAnzanQuestions` · `getAudioAnzanQuestions` · **`getTestQuestions`** · **`getPlacementTestQuestions`** — كلها جاهزة في `srb-adapter.ts`
- GitHub Pages (#684) أخضر

### مقصود ومؤقت — لا يُحذف
- `bank-v2/` (595) · `bank-raw/` (400) · `bank-linked.ts` · `bank-adapter.ts`
- `adaptiveEngine` · `problemGenerator` · `masteryTracker`
- `L00-L20` في LevelId
- 35 مفتاح localStorage
- `srb_progress` (سيُفعَّل في P1)

---

## 🔒 3. خط أحمر — لا يُلمس

| العنصر | السبب |
|---|---|
| `curriculum/types.ts` | 14 مستوردًا |
| `sorobanEngine.ts` · `sorobanMoves.ts` | المنطق الرياضي |
| SRB — بنك وحيد للأسئلة الجديدة | قاعدة #5 |
| منهج 15 درسًا | قرار جلسة 12 |
| الوزن: 70+10+5+5+10 | قرار جلسة 15 |
| `getTestQuestions` · `getPlacementTestQuestions` · `buildSession` | جاهزة، لا تُعاد كتابتها |

---

## 🩹 4. أخطاء مؤكدة بالدليل

### 🔴 P-1 (إصلاح فوري · ~30 سطرًا)

| # | الخطأ | الدليل | الإصلاح |
|---|---|---|---|
| **B1** | `reload()` = `reset()` — دالة ميتة (0 استدعاء) | `progressStore.ts:471-473` | حذف `reload` |
| **B2** | `handleEnd` يمسح `pendingBadgesRef` بلا حفظ | `PracticeScreen.tsx:414` · `AnzanScreen.tsx:522` | حفظ بدل مسح |
| **B4** | `progressStore` يقبل OR · `AnzanScreen` يشترط AND | `progressStore.ts:316` × `AnzanScreen.tsx:469` | توحيد على OR |
| **B5** | `markAnzanVisualPassed(Number(level.slice(1)))` — L00 يتصادم مع L0 | `progressStore.ts:22-27` × `AnzanScreen.tsx:470` | فحص صريح |

### 🔴 P2 (بعد P-1 · إصلاح سطري)

| # | الخطأ | الدليل | الإصلاح |
|---|---|---|---|
| **V4** | `LevelTestScreen` يستخدم `buildL0Test` لكل المستويات — بينما `getTestQuestions(level)` موجودة | `LevelTestScreen.tsx:8,123` × `srb-adapter.ts` | تغيير استيراد + استدعاء واحد |
| **N11** | `EXAM_COOLDOWN_MS = 48h` بينما الواجهة تعرض 24h | `srb-adapter.ts:آخر` × `LevelTestScreen.tsx:189` | توحيد الثابت |
| **N19** | `passedLevelTests` يُقرأ في render بلا اشتراك | `LevelScreen.tsx:135` | نقله إلى `progressStore` |

### 🟡 P3 (تنظيف)

| # | الخطأ | الدليل |
|---|---|---|
| **B6** | `srb_progress` يُكتب (`saveSectionGrade`) ولا تقرأه أي شاشة | `srb-adapter.ts` + صفر استيراد خارج الجسر |
| **B7** | `CertificateScreen` بلا مستدعٍ | `App.tsx:397-405` |
| **B8** | شاشتا الشهادات تقرآن من مصدرين مختلفين | Kids: store · Adults: localStorage |
| **N4** | `setGrade` لا تسمح بتخفيض الدرجة | `progressStore.ts` |
| **N7** | `SkillProgress` بلا `errorType`/`movement`/`phase` | `recordAttempt` |
| **N20** | مفتاح `soroban_dev_preview` مخفي | `LevelScreen.tsx:220` |

### ❌ مرفوض بالدليل
| # | الادعاء | سبب الرفض |
|---|---|---|
| B3 | `saveSectionGrade` S03 فقط | `srb-adapter.ts:332-345` — يتجاهل section، الجلسة على مستوى كامل |
| N36 | العشريات معطوبة | Screenshot runtime يظهر التلميح "مثّل بدون فاصلة" |

---

## 🚫 5. قواعد لأي مساعد قادم

### يُمنع منعًا مطلقًا
1. ❌ إعادة بناء من الصفر
2. ❌ حذف البنوك القديمة قبل النقل
3. ❌ حذف `L00-L20` قبل Migration
4. ❌ إعادة كتابة المحرك التكيفي
5. ❌ توحيد التخزين قبل نقل الامتحانات
6. ❌ اعتبار `adaptiveEngine` "ميتًا"
7. ❌ إضافة نظام تخزين رابع
8. ❌ حزمة تعديلات دفعة واحدة
9. ❌ اعتبار README/PROJECT_MASTER "مصدر الحالة"
10. ❌ إعادة كتابة دوال `srb-adapter` الجاهزة

### يُطلب من كل مساعد
1. ✅ اقرأ هذا الملف أولًا
2. ✅ اسأل "هل هذا مقصود؟"
3. ✅ إصلاح جراحي — لا بنيوي
4. ✅ ملف واحد — ثم اختبار
5. ✅ نسخة احتياطية قبل أي تعديل

---

## 🗺️ 6. خارطة التنفيذ

```

P-1  إصلاح 4 أخطاء (B1 · B2 · B4 · B5)              ⏳ يومان
P0   تثبيت المنهج · المهارات · الحركات · التصنيف    ⏳ أسبوع
P1   توحيد سجل الأداء (Attempt Record)               ⏳ أسبوعان
+ إصلاح B6 · B7 · B8
P2   ربط SRB + المحرك التكيفي                        ⏳ 3 أسابيع
+ إصلاح V4 · N11 · N19
P3   Remediation التكيفي (إثبات الإتقان)             ⏳ أسبوع
P4   تفعيل getTestQuestions · getPlacementTestQuestions  ⏳ أسبوعان
P5   بناء دروس L2-L7                                 ⏳ أشهر
P6   الترجمة الكاملة (AR + EN)                       ⏳ شهر
P7   الشهادات + Guardian Profile                     ⏳ أسبوعان
P8   Migration + حذف البنوك القديمة                  ⏳ أسبوع

```

---

## 📌 7. القاعدة الأخيرة

> **README ليس مصدرًا للحالة.**
> **PROJECT_MASTER ليس مصدرًا للحالة.**
> **الكود الفعلي هو الحقيقة.**
> **هذه الوثيقة تحمي الكود.**

---

## 📝 8. سجل التعديلات

| الجلسة | الإضافة |
|---|---|
| 15 | الشهادات · النتيجة الموزونة · 3 SVG · فشل S01 |
| 16 | إنشاء AL-ISLAH.md · تصحيح B3 · اكتشاف جاهزية `getTestQuestions` |

---

**آخر مراجعة:** @mezo2021 — 2026-10-04
**قيد الانتظار:** مراجعة Claude (بعد استعادة الرصيد)
```

---

⏭️ ما تبقّى للفحص (نتابعه لاحقًا)

# البند الفحص المطلوب
1 L0/test-pool.ts قيمة L0_TEST_COOLDOWN_MS (48h أم 24h؟)
2 App.tsx كيف يستدعي onXP؟ (ازدواج N42؟)
3 srb/curriculum.ts القائمة الرسمية للدروس
4 srb/modules.ts القائمة الرسمية للـ51 مهارة
5 PROJECT_PLAN.md:700-715 هل خطة srb_progress قيد التنفيذ؟
6 RemediationScreen.tsx إثبات الإتقان (V11 من GPT)
7 bank-v2/placement-engine.ts تفاصيل Placement الحالي
8 srb/types.ts:39-49 allowed_phases الفعلية

كل فحص = 5 دقائق. 8 فحوص = 40 دقيقة. تُغلق 90% من الالتباس.

---
