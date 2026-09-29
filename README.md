
<div align="center">

# 🧮 SorobanMind

### تعليم السوروبان الياباني بالعربية — للأطفال والكبار

**منهج تاكاشي كوجيما · بدون إنترنت · بدون إعلانات · خصوصية كاملة**

🌐 [الموقع المباشر](https://mezo2021.github.io/sorobanmind-2) · 💻 [المستودع](https://github.com/mezo2021/sorobanmind-2) · 🟡 قيد البناء

</div>

---

## 🎯 الفكرة في سطر واحد

> **تعليم السوروبان الياباني (منهج تاكاشي كوجيما) بالعربية — للأطفال والكبار — بدون إنترنت، بدون إعلانات، وبخصوصية كاملة.**

---

## ✨ الميزات

- ✅ **تطبيق عربي** بتجربة تفاعلية كاملة
- ✅ **منهج ياباني أصيل** (Takashi Kojima + Japan Soroban Association)
- ✅ **بدون إعلانات** — للأبد
- ✅ **بدون إنترنت** — يعمل offline
- ✅ **خصوصية كاملة** — البيانات على جهاز المستخدم
- ✅ **محرك تكيفي** يفهم مهارات الطفل ويحدد نقاط ضعفه
- ✅ **سوروبان تفاعلي 2D5** — للتمثيل البصري والتفاعل
- ✅ **4 رفقاء** (شام · ريان · جود · بانة) لتشجيع الطفل
- ✅ **نظام شارات وإنجازات** (🥉 برونزي · 🥈 فضي · 🥇 ذهبي)
- ✅ **تحديد مستوى ذكي** (40 سؤالًا — 5 لكل مستوى)
- ✅ **نظام مراحل** (شاهد · جرّب · تمرّن · أنزان · اختبار · امتحان قسم · تحديد مستوى)

---

## 📚 المنهج — 8 مستويات / 20 مهارة

| المستوى | الاسم | المهارات | القسم |
|---|---|---|---|
| **L0** | التمهيدي | S01 تمثيل 0-9 · S02 القيمة المكانية | 🧒 |
| **L1** | الجمع والطرح | S03 جمع مباشر · S04 طرح مباشر · S05 أصدقاء 5 جمع · S06 أصدقاء 5 طرح · S07 أصدقاء 10 جمع · S08 أصدقاء 10 طرح · S09 مختلط | 🧒 |
| **L2** | الضرب | S10 (2×1) · S11 (2×2) · S12 متقدم | 🧒 |
| **L3** | القسمة | S13 (÷1) · S14 (÷2) · S15 (÷3) | 🧒 |
| **L4** | جمع وطرح متقدم | S16 | 🧑 |
| **L5** | ضرب وقسمة متقدم | S17 | 🧑 |
| **L6** | الكسور العشرية | S18 | 🧑 |
| **L7** | الجذور | S19 جذر تربيعي · S20 جذر تكعيبي | 🧑 |

### 🔄 بنية كل مستوى

```

📖 تعلّم (شاهد + جرّب) → ✏️ تمرّن → 🧠 أنزان → 🎓 اختبار → 📜 شهادة

```

**ملاحظة L0**: درسان فقط (S01, S02) + اختبار — **بلا شهادة**.
**ملاحظة**: الصغار من L0 → L3 · الكبار من L4 → L7.

---

## 💎 بنك الأسئلة SRB — البنك الوحيد المستقبلي

### 🔑 نظام الـ ID

**الصيغة**: `SRB-L{مستوى}-S{مهارة}-M{موضوع}-{B/A}{تسلسل}`

**أمثلة**:
```

SRB-L0-S01-M01-B001   ← أول سؤال، تمثيل 0-4
SRB-L0-S01-M02-B003   ← ثالث سؤال، تمثيل 5
SRB-L1-S03-M01-A001   ← أول سؤال متقدم، جمع مباشر

```

| الجزء | المعنى |
|---|---|
| `SRB` | بادئة بنك السوروبان |
| `L0..L7` | المستوى |
| `S01..S20` | المهارة (بخانتين) |
| `M01..M99` | الموضوع الفرعي (بخانتين) |
| `B / A` | أساسي (basic) / متقدم (advanced) |
| `001..N` | التسلسل (3 أرقام) |

### 📏 القواعد الصارمة

| # | القاعدة |
|---|---|
| 1 | `digit_count_max` = عدد خانات `result` (لا المضروب) |
| 2 | `operand_count` = عدد الأرقام في السؤال (وليس الجواب) |
| 3 | `difficulty_score` يتصاعد بانتظام |
| 4 | `solution` نظيف — بلا مسودات ولا "تصحيح:" |
| 5 | `next_if_fail` يرجع 3 خطوات داخل نفس القسم |
| 6 | `mastery_threshold` = 0.85 للأساسي · 0.8 للمتقدم |
| 7 | `stage` = basic (L0–L3) · advanced (L4–L7) |
| 8 | `target_time_ms` = [min, max] حيث max = min × 1.5 |

### 🎯 نظام المراحل (Phases)

**⚠️ المراحل لا تُدرج في ID** — بل في حقل منفصل `allowed_phases`.

| الرمز | الاسم | الوصف | يُسجَّل؟ |
|---|---|---|---|
| **E** | شاهد (Explain) | عرض تفاعلي | ❌ |
| **T** | جرّب (Try) | محاولة تعليمية | ❌ |
| **P** | تمرّن (Practice) | تقييم — 5 أسئلة | ✅ |
| **ANZ-V** | أنزان بصري | عرض سريع | ✅ |
| **ANZ-F** | أنزان فلاش | ثانيتان للرقم | ✅ |
| **ANZ-A** | أنزان سمعي | TTS فقط | ✅ |
| **X** | اختبار المستوى | تقييم نهائي — 10 أسئلة | ✅ |
| **CE** | امتحان القسم | امتحان كبير — 20/40 | ✅ |
| **PT** | تحديد المستوى | 40 سؤالًا | ✅ |
| **EN** | الإثراء | محتوى جانبي | ❌ |

**القاعدة**: السؤال الواحد يمكن أن يظهر في عدة مراحل عبر `allowed_phases`:
```json
{
  "id": "SRB-L0-S01-M01-B001",
  "allowed_phases": ["T", "P", "ANZ-V", "X"],
  "primary_phase": "T"
}
```

---

🎓 نظام التقييم

📊 تقييم الإجابة (حسب الزمن)

النتيجة الزمن التقييم الرمز
صحيح ≤ 40% 🥇 ممتاز EXCELLENT
صحيح 40-70% 🥈 جيد GOOD
صحيح 70-80% 🥉 مقبول ACCEPTABLE
صحيح 80-100% ⚠️ بطيء SLOW
خطأ أي ❌ خطأ WRONG

⚠️ الزمن الأقصى = 100% (لا يوجد أكثر).

🚨 تشخيص الأخطاء (4 مستويات)

# الشرط المستوى العلاج
1 3 أخطاء في M واحد M (موضوع) إعادة الموضوع
2 3 أخطاء في S واحد S (درس) إعادة الدرس
3 3 أخطاء متتالية بأي شكل عام تنبيه + تهدئة
4 5 أخطاء كلها خاطئة في L L (مستوى) العودة لمستوى أدنى

📊 عتبات السياقات المختلفة

السياق العدد العتبة
جلسة تمرّن P 5 أسئلة 60% أخطاء = مشكلة
جلسة أنزان ANZ 5 أسئلة 60% أخطاء = مشكلة
اختبار X 10 أسئلة نجاح 80%
امتحان قسم CE-1 20 سؤالًا نجاح 80%
امتحان قسم CE-2 40 سؤالًا نجاح 80%
تحديد مستوى PT 40 سؤالًا نجاح 75% لكل مستوى

⚠️ ملاحظة: في الاختبارات الطويلة (10+ أسئلة)، التوزيع موزون عبر المواضيع — فلا يمكن أن يأتي أكثر من 3 أسئلة من M واحد.

---

🏗️ البنية التقنية

العنصر التقنية
اللغة TypeScript 5.5
إطار الواجهة React 18
أداة البناء Vite 5
التنسيق Tailwind CSS
إدارة الحالة Zustand 4
النشر GitHub Pages
التخزين localStorage → IndexedDB (مستقبلًا)

---

📂 بنية الملفات الحالية

```

src/
├── App.tsx                          ✅ البوابة الرئيسية
├── types.ts                         ✅ الأنواع العامة
│
├── i18n/                            ✅ الترجمة (ar / en)
│
├── curriculum/                      📖 المنهج
│   ├── types.ts                     🔑 العقد الأساسي
│   └── lessons/L0/                  ✅ 3 دروس
│
├── engine/                          🧠 المحرك الرياضي
│   ├── sorobanMoves.ts              🔒 مجمّد
│   ├── sorobanEngine.ts             🔒 مجمّد
│   ├── masteryTracker.ts            ✅ موثّق
│   ├── problemGenerator.ts          ✅ موثّق + SRB-MIGRATION
│   └── adaptiveEngine.ts            ✅ موثّق + SRB-MIGRATION
│
├── data/                            💾 البيانات
│   ├── bank.ts                      ⚠️ v1 — قيد الاستبدال
│   ├── bank-v2/                     ⚠️ 4 بنوك + امتحانات (SRB)
│   │   ├── types.ts                 ✅ موثّق
│   │   ├── index.ts                 ✅ موثّق
│   │   ├── part-01 → part-04.ts    ✅ بنية مؤكدة
│   │   ├── bank-exam.ts             ✅ موثّق
│   │   └── placement-engine.ts      ✅ موثّق
│   ├── bank-raw/                    ⚠️ 400 سؤال ياباني (SRB)
│   │   ├── types.ts                 ✅ موثّق
│   │   ├── index.ts                 ✅ موثّق
│   │   ├── raw-01 → raw-07.ts      ✅ بنية مؤكدة
│   │   └── (S1-S17)
│   ├── bank-linked.ts               ✅ موثّق + SRB-MIGRATION
│   ├── bank-adapter.ts              ✅ موثّق + SRB-MIGRATION
│   ├── curriculum.ts                ✅ 8 مستويات
│   ├── modes.ts                     ✅ أنماط اللعب
│   ├── srb/                         🆕 الهدف
│   └── srb-adapter.ts               🆕 سيُبنى
│
├── store/                           📦 المتاجر
│   ├── progressStore.ts             ✅ الأساسي
│   ├── masteryBadgesStore.ts        ⚠️ مكرر
│   └── numberStyleStore.ts          ⚠️ يُدمج
│
├── utils/                           🛠️ الأدوات
│   ├── numberStyle.ts               ✅
│   ├── arabicNumbers.ts             ✅
│   ├── numerals.ts                  ✅
│   ├── audioAnzanBadges.ts          ✅
│   ├── anzanBadges.ts               ✅ جديد (بدل examBank2)
│   ├── badgeChecker.ts              ✅ يستورد من anzanBadges
│   ├── certificateGenerator.ts      ✅ غير مربوط
│   └── skillsChecker.ts             ✅ موثّق
│
├── hooks/                           🪝 Hooks (7)
│
├── components/                      🧩 المكونات
│   └── soroban2d5/                  ✅ السوروبان التفاعلي
│
└── screens/                         📱 الشاشات
├── LessonScreen.tsx             ✅
├── PracticeScreen.tsx           🔴 يحتاج مراجعة
├── AnzanScreen.tsx              🔴 يحتاج مراجعة
├── AudioAnzanScreen.tsx         🔴 يحتاج مراجعة
├── CategoryExamScreen.tsx       🔴 يحتاج مراجعة
├── LevelTestScreen.tsx          🔴 يحتاج مراجعة
├── PlacementTestScreen.tsx      🔴 يحتاج مراجعة
└── (14 شاشة أخرى)               ✅

```

---

🔑 سجل مفاتيح localStorage

# المفتاح الوصف من يكتب؟ من يقرأ؟
1 soroban-completed-lessons الدروس المكتملة progressStore badgeChecker · GuardianDashboard
2 sorobanmind-stats إحصائيات اللعب progressStore · useGameStats badgeChecker · GuardianDashboard
3 soroban_exam_result نتيجة الامتحان CategoryExamScreen badgeChecker
4 soroban_anzan_stats إحصائيات الأنزان البصري AnzanScreen skillsChecker · GuardianDashboard
5 soroban_practice_stats إحصائيات التمرّن PracticeScreen skillsChecker · GuardianDashboard
6 soroban_anzan_audio_badges شارات الأنزان السمعي AudioAnzanScreen skillsChecker
7 soroban_anzan_badges شارات الأنزان العام anzanBadges.ts badgeChecker · GuardianDashboard
8 soroban_weak_skills_v2 مهارات الضعف adaptiveEngine · bank-v2/index · placement-engine نفسها

🎯 الخطة: توحيد كل المفاتيح تحت بادئة srb_* عند بناء SRB.

---

🏦 البنوك الأربعة — نظرة شاملة

# الملف الحجم المصدر نظام الترقيم الحالة
1 bank.ts 500 مولَّد برمجيًا L01-L07 ⚠️ قيد الاستبدال
2 bank-v2/part-01 → 04 ~935 نظام حديث L0-L7 / S1-S20 ✅ مستخدم
3 bank-raw/raw-01 → 07 400 منهج كوجيما S1-S17 ✅ مستخدم
4 bank-linked.ts موحّد v2 + raw مختلط ⚠️ قيد الاستبدال

🚨 التعارض الحقيقي: 3 أنظمة ترقيم

الملف المستوى المهارة القسم
bank.ts L01-L07 L01.S01 —
bank-v2/ L0-L7 S1-S20 —
bank-raw/ — — S1-S17
bank-adapter.ts L03-L20 L03.S01 S1-S17
SRB L0-L7 S01-S20 M01-M99

⚠️ هذا التعارض هو السبب الجذري لفشل توحيد IDs سابقًا.

---

📊 حالة البناء الحالية

🎯 بنك الأسئلة SRB

المستوى المصدر الحالي عدد الأسئلة جاهزية SRB
L0 part-01 + bank-raw/raw-01 40 + 20 ✅ جاهز للتحويل
L1 part-01 + bank-raw/raw-01 → 02 80 + 40 ✅ جاهز للتحويل
L2 part-02 + bank-raw/raw-02 ~36 ⏸️ جزئي
L3 part-02 + bank-raw/raw-03 — ⏳ في الانتظار
L4 part-03 + bank-raw/raw-03 — ⏳ في الانتظار
L5 part-03 + bank-raw/raw-05 60 ✅ جاهز
L6 part-04 + bank-raw/raw-04 — ⏳ في الانتظار
L7 part-04 + bank-raw/raw-07 — ⏳ في الانتظار

📋 الملفات الموثّقة (من جلسة التنظيف)

# الملف الحالة
1 src/utils/anzanBadges.ts ✅ جديد
2 src/utils/badgeChecker.ts ✅ مستورد محدَّث
3 src/screens/GuardianDashboard.tsx ✅ مستورد محدَّث
4 src/utils/skillsChecker.ts ✅ موثّق
5 src/engine/masteryTracker.ts ✅ موثّق
6 src/engine/adaptiveEngine.ts ✅ موثّق
7 src/engine/problemGenerator.ts ✅ موثّق
8 src/data/bank-raw/types.ts ✅ موثّق
9 src/data/bank-raw/index.ts ✅ موثّق
10 src/data/bank-v2/types.ts ✅ موثّق
11 src/data/bank-v2/index.ts ✅ موثّق
12 src/data/bank-v2/bank-exam.ts ✅ موثّق
13 src/data/bank-v2/placement-engine.ts ✅ موثّق

✅ الملفات المحذوفة

# الملف السبب
1 src/examBank2.ts مختلط (شارات + امتحانات) — نُقلت الشارات إلى anzanBadges.ts
2 src/data/learnModules.ts كان مربوطًا خطأً — تم فصله وحذفه

📋 الملفات المتعارضة المتبقية

الفئة العدد الملفات
البنك 4 bank.ts · bank-linked.ts · bank-adapter.ts · data/index.ts
التمرّن والأنزان 6 PracticeScreen · AnzanScreen · AudioAnzanScreen · CategoryExamScreen · LevelTestScreen · PlacementTestScreen
المتاجر والشارات 3 masteryBadgesStore.ts · numberStyleStore.ts · skillsChecker.ts
الشهادة 1 CertificateScreen.tsx

---

🚀 خطة الانطلاق (Launch Plan)

🧭 المبدأ الأساسي

لا حذف قبل قطع الارتباط · لا قطع قبل الفحص · لا فحص قبل النسخ الاحتياطي.

✅ ما تم إنجازه (جلسة 2026-09-28/29)

# العملية الحالة
1 إنشاء anzanBadges.ts ✅
2 تحديث badgeChecker.ts ✅
3 تحديث GuardianDashboard.tsx ✅
4 حذف examBank2.ts ✅
5 تنظيف data/index.ts ✅
6 حذف learnModules.ts ✅
7 توثيق skillsChecker.ts ✅
8 توثيق masteryTracker.ts ✅
9 توثيق adaptiveEngine.ts ✅
10 توثيق problemGenerator.ts ✅
11 توثيق bank-raw/types.ts ✅
12 توثيق bank-raw/index.ts ✅
13 توثيق bank-v2/types.ts ✅
14 توثيق bank-v2/index.ts ✅
15 توثيق bank-v2/bank-exam.ts ✅
16 توثيق bank-v2/placement-engine.ts ✅

🎯 المرحلة القادمة — بناء SRB

# المهمة الحالة
1 بناء src/data/srb/types.ts ⏳
2 بناء src/data/srb/generateId.ts ⏳
3 بناء src/data/srb/modules.ts (المواضيع الفرعية) ⏳
4 بناء src/data/srb/questions/L0/ ⏳
5 بناء src/data/srb/questions/L1/ ⏳
6 بناء src/data/srb/index.ts ⏳
7 بناء src/data/srb-adapter.ts ⏳
8 توصيل SRB بـ problemGenerator ⏳
9 توصيل SRB بـ adaptiveEngine ⏳
10 تطبيق SRB على L0 ⏳
11 اختبار L0 حيًّا ⏳
12 حفظ ZIP احتياطي ⏳

🗺️ المراحل الكبرى

المرحلة الوصف الحالة
① تنظيف الملفات المختلطة ✅
② توثيق الملفات الحرجة ✅
③ بناء SRB ⏳
④ توصيل SRB بالمحرك ⏳
⑤ تطبيق SRB على L0 → L1 ⏳
⑥ حذف البنوك القديمة ⏳
⑦ توحيد المتاجر ⏳
⑧ إصلاح App.tsx ⏳
⑨ PWA + APK ⏳

---

📏 قواعد إلزامية

# القاعدة
1 🛡️ نسخة احتياطية قبل أي تعديل
2 ملف واحد في المرة — ثم اختبار
3 لا تلمس المحرك الرياضي (sorobanMoves.ts + sorobanEngine.ts)
4 SRB هو البنك الوحيد النهائي
5 الـ ID موحّد: SRB-L{level}-S{sec}-M{module}-{B/A}{seq}
6 المراحل في allowed_phases — ليس في ID
7 digit_count_max = خانات result
8 operand_count = أرقام السؤال
9 solution نظيف — بلا مسودات
10 كل قسم ≥ 15 سؤالًا
11 لا كود قبل توثيق

🔍 نقاط المراجعة السبع (لكل مستوى جديد)

1. صحة البيانات — لا digit_count_max خاطئ
2. تسلسل الـ ID — B001 → B002 بلا فراغات
3. الشجرة — prerequisite / next_if_success / next_if_fail
4. الرياضيات — الجواب والشرح صحيحان
5. التغطية — كل قسم ≥ 15 سؤالًا
6. التوافق — الحقول المطلوبة للمحركات موجودة
7. السلامة النصية — لا مسودات، لا "تصحيح:"

---

🏅 نظام الشارات

الشارة XP الحفظ الشرط
🥉 برونزية 0 ⏳ مؤقتة (شهر) إجابة ≤ 50% من المعياري
🥈 فضية 0 ⏳ مؤقتة (شهر) إجابة ≤ 40% من المعياري
🥇 ذهبية +100 XP ✅ للأبد إجابة ≤ 30% من المعياري

الشرط: 5 إجابات متتالية بنفس الجلسة (P / Anzan).
في الاختبار (X): 7 إجابات بنفس الاختبار → 🥇 ذهبية.

---

🎯 نظام التتبّع التكيفي

```typescript
interface WeakSkillRecord {
  skillId: string;
  attempts: number;
  correct: number;
  wrong: number;
  avgTimeMs: number;
  lastAttempt: number;
  weaknessScore: number;  // 0-100
}
```

القاعدة:

```
الضعف = (1 - accuracy) × 60
       + 20 إذا كانت accuracy < 50%
       + 20 إذا كان avgTimeMs > 15000

عتبة "ضعيف" = 50
نسبة الأسئلة العلاجية = 70%
```

مفتاح localStorage: soroban_weak_skills_v2 → srb_weak_skills

---

🔒 منطق القفل والفتح

العنصر يُفتح بعد
🎨 الإثراء مفتوح دائمًا
📖 L0 مفتوح
✏️ T (جرّب) مفتوح دائمًا
📖 E (شاهد) مفتوح دائمًا
📖 S التالي إتمام S الحالي
✏️ تمرّن P إتمام أول درس في المستوى
🧠 أنزان إتمام أول درس في المستوى
🎓 اختبار X إتمام كل دروس المستوى
📜 الشهادة نجاح الاختبار (L1+)
🏆 امتحان القسم 1 إتمام L0-L3 كاملًا
🎓 القسم 2 (L4) نجاح 80% في امتحان القسم 1

---

⚠️ ملاحظات حرجة

1. 🛡️ نسخة احتياطية إلزامية قبل أي تعديل
2. لا تعديل على أكثر من ملف واحد في المرة
3. اختبار فوري بعد كل تعديل
4. App.tsx يعتمد على split('-') — يُصلح لاحقًا
5. الشهادات — certificateGenerator.ts غير مربوط بعد
6. 👑 أسطورة + 🏆 خبير — مؤجَّلان
7. بنك bank.ts — في مرحلة انتقالية، ليس مهجورًا
8. 3 أنظمة ترقيم — مصدر التعارض الحقيقي

---

📎 روابط أساسية

العنصر المسار
الموقع https://mezo2021.github.io/sorobanmind-2
المستودع https://github.com/mezo2021/sorobanmind-2
المحرك src/engine/sorobanMoves.ts + sorobanEngine.ts
المتجر الأساسي src/store/progressStore.ts
دروس L0 src/curriculum/lessons/L0/
البنك الحديث src/data/bank-v2/
البنك الخام src/data/bank-raw/

---

📖 المصادر

· Takashi Kojima — المرجع الياباني الأصلي
· Japan Soroban Association — المنهج الرسمي

---

<div align="center">

🧮 SorobanMind

صُنع بحب لأطفال العالم العربي 🌍

المطوّر: مصطفى علي أكر (@mezo2021)

آخر تحديث: 2026-09-29

الحالة: 🟡 قيد البناء — التطبيق يعمل، والبنية جاهزة لـ SRB

الخطوة التالية: 🎯 بناء src/data/srb/ + تطبيق على L0

</div>