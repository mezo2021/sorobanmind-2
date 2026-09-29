
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
- ✅ **جلسة علاجية** (بلا درجات — إظهار الحل فورًا)

---

## 📚 المنهج — 8 مستويات / 20 درس

| المستوى | الاسم | الدروس | القسم |
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

**الصيغة**: `SRB-L{مستوى}-S{درس}-m{مهارة}-{B/A}{تسلسل}`

**أمثلة**:
```

SRB-L0-S01-m1-B001   ← أول سؤال، درس S01، مهارة m1
SRB-L0-S01-m2-B003   ← ثالث سؤال، درس S01، مهارة m2
SRB-L1-S03-m1-A001   ← أول سؤال متقدم، درس S03، مهارة m1

```

| الجزء | المعنى |
|---|---|
| `SRB` | بادئة بنك السوروبان |
| `L0..L7` | المستوى |
| `S01..S20` | الدرس (بخانتين) |
| `m1..m99` | المهارة (بحرف صغير) |
| `B / A` | أساسي (basic) / متقدم (advanced) |
| `001..N` | التسلسل (3 أرقام) |

### 🎯 بنية m (المهارات الفرعية)

**القاعدة الذهبية**: كل درس S يُعيد ترقيم m من `m1`.

**السبب**: `S` جزء من ID → لا تضارب.

**أمثلة تطبيقية**:

| الدرس | المهارات (m) |
|---|---|
| **S01** (تمثيل 0-9) | m1 (0-4) · m2 (5) · m3 (6-9) · m4 (انتقال) |
| **S02** (قيمة مكانية) | m1 (آحاد) · m2 (عشرات) · m3 (مئات) · m4 (آلاف) |
| **S10** (ضرب 1×2) | m1 (منزلة × 2 منازل) |
| **S11** (ضرب 2×2) | m1 (منزلة × 3) · m2 (منزلتين × 2) |
| **S12** (ضرب متقدم) | m1 (منزلة × 4) · m2 (منزلتين × 3-4) · m3 (3×3) |

### 📏 القواعد الصارمة

| # | القاعدة |
|---|---|
| 1 | `digit_count_max` = عدد خانات `result` (لا المضروب) |
| 2 | `operand_count` = عدد الأرقام في السؤال (وليس الجواب) |
| 3 | `difficulty_score` يتصاعد بانتظام |
| 4 | `solution` نظيف — بلا مسودات ولا "تصحيح:" |
| 5 | `next_if_fail` يرجع 3 خطوات داخل نفس الدرس |
| 6 | `mastery_threshold` = 0.85 للأساسي · 0.8 للمتقدم |
| 7 | `stage` = basic (L0–L3) · advanced (L4–L7) |
| 8 | `target_time_ms` = [min, max] حيث max = min × 1.5 |
| 9 | **8-10 أسئلة مثالي لكل m** — لا تتجاوز 15 |
| 10 | **لا تكرار** في الجلسة الواحدة |
| 11 | **الأسئلة من نفس الدرس S + نفس المستوى L** |

### 🎯 نظام المراحل (Phases)

**⚠️ المراحل لا تُدرج في ID** — بل في حقل منفصل `allowed_phases`.

| الرمز | الاسم | الوصف | يُسجَّل؟ |
|---|---|---|---|
| **E** | شاهد (Explain) | عرض تفاعلي | ❌ |
| **T** | جرّب (Try) | محاولة تعليمية | ❌ |
| **P** | تمرّن (Practice) | تقييم — 5 أسئلة | ✅ |
| **ANZ-V** | أنزان بصري عادي | سؤال مكتوب + TTS | ✅ |
| **ANZ-F** | أنزان بصري Flash | الأرقام واحدًا واحدًا | ✅ |
| **ANZ-A** | أنزان سمعي | TTS فقط | ✅ |
| **X** | اختبار المستوى | تقييم نهائي — 10 أسئلة | ✅ |
| **CE** | امتحان القسم | امتحان كبير — 20/40 | ✅ |
| **PT** | تحديد المستوى | 40 سؤالًا | ✅ |
| **EN** | الإثراء | محتوى جانبي | ❌ |

---

## 🎓 نظام التقييم

### 📊 المصطلحات الرسمية

| # | المصطلح | المعنى |
|---|---|---|
| 1 | **الزمن المعياري** | `answerMs` — الزمن المتوقع للسؤال |
| 2 | **النسبة القياسية** | 40% · 70% · 80% |
| 3 | **الزمن الفعلي** | `timeMs` — ما استغرقه الطالب |
| 4 | **النسبة الفعلية** | `timeMs ÷ answerMs` |

### 📊 تقييم الإجابة (حسب النسبة الفعلية)

| النتيجة | النسبة الفعلية | التقييم | الرمز |
|---|---|---|---|
| صحيح | ≤ 40% | 🥇 ممتاز | `EXCELLENT` |
| صحيح | 40-70% | 🥈 جيد | `GOOD` |
| صحيح | 70-80% | 🥉 مقبول | `ACCEPTABLE` |
| صحيح | 80-100% | ⚠️ بطيء | `SLOW` |
| خطأ | أي | ❌ خطأ | `WRONG` |

**⚠️ الزمن الأقصى = 100%** (لا يوجد أكثر).

### 🚨 تشخيص الأخطاء (4 مستويات)

| # | الشرط | المستوى | العلاج |
|---|---|---|---|
| 1 | 3 أخطاء في m واحد | m (مهارة) | إعادة المهارة |
| 2 | 3 أخطاء في S واحد | S (درس) | إعادة الدرس |
| 3 | 3 أخطاء متتالية بأي شكل | عام | تنبيه + تهدئة |
| 4 | 5 أخطاء كلها خاطئة في L | L (مستوى) | العودة لمستوى أدنى |

### 📊 عتبات السياقات المختلفة

| السياق | العدد | العتبة |
|---|---|---|
| جلسة تمرّن P | 5 أسئلة | 60% أخطاء = مشكلة |
| جلسة أنزان ANZ | 5 أسئلة | 60% أخطاء = مشكلة |
| اختبار X | 10 أسئلة | نجاح 80% |
| امتحان قسم CE-1 | 20 سؤالًا | نجاح 80% |
| امتحان قسم CE-2 | 40 سؤالًا | نجاح 80% |
| تحديد مستوى PT | 40 سؤالًا | نجاح 75% لكل مستوى |

### 🏅 علامة المستوى النهائية

```

العلامة النهائية = 70% × اختبار + 30% × متوسط(تمرن + ANZ-V + ANZ-F + ANZ-A)

```

**4 عناصر** في المتوسط.

### ⚡ Adaptive Speed

```

كل 5 إجابات صحيحة متتالية → -5% من الزمن المعياري
الحد الأدنى: 50% من الأصلي

```

### 🎯 حفظ الدرجات (5 حقول لكل درس)

```typescript
interface SectionProgress {
  practice: GradeRecord;           // ✏️ تمرّن
  anzanVisualNormal: GradeRecord;  // 🧠 أنزان عادي
  anzanVisualFlash: GradeRecord;   // ⚡ أنزان Flash
  anzanAudio: GradeRecord;         // 🎧 أنزان سمعي
  test: GradeRecord;               // 🎓 اختبار
}

interface GradeRecord {
  grade: number;           // 0-100
  attempts: number;
  lastAttempt: number;
  passed: boolean;
  weakModules: SRBModule[];
}
```

مفتاح التخزين الجديد: srb_progress

🩺 الجلسة العلاجية (Remediation)

الخصائص:

· بلا درجات.
· إظهار الحل فورًا بعد كل سؤال.
· تُبنى من weak_modules في srb_progress.
· لا تُغلق عند ضعف الطالب.
· مخصصة لـ m ضعيف.

⚠️ الحالة: شاشة موجودة (RemediationScreen.tsx)، لكن لم تُربط بعد بلوحات التمرن/الأنزان.

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
│   ├── types.ts                     🔑 العقد الأساسي (14 مستورد)
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
│   ├── bank.ts                      ⚠️ v1 — معزول (0 مستورد)
│   ├── bank-v2/                     ⚠️ مستخدم عبر Fallback
│   ├── bank-raw/                    ⚠️ مستخدم (داخلي)
│   ├── bank-linked.ts               ✅ موثّق (2 مستوردين)
│   ├── bank-adapter.ts              ✅ موثّق (1 مستورد)
│   ├── curriculum.ts                ✅ 8 مستويات
│   ├── modes.ts                     ✅ أنماط اللعب
│   ├── srb/                         ✅ SRB Logic (17 ملفًا)
│   │   ├── types.ts                 ✅
│   │   ├── generateId.ts            ✅
│   │   ├── curriculum.ts            ✅
│   │   ├── modules.ts               ✅
│   │   ├── questions/L0/S01/        ✅ m1-m4
│   │   ├── questions/L0/S02/        ✅ m1-m4
│   │   ├── index.ts                 ✅
│   │   ├── sessionBuilder.ts        ✅
│   │   ├── progress.ts              ✅
│   │   └── remediation.ts           ✅
│   └── srb-adapter.ts               ✅ Fallback نشط
│
├── store/                           📦 المتاجر
│   ├── progressStore.ts             ✅ الأساسي (7 مستوردين)
│   ├── masteryBadgesStore.ts        ⚠️ مكرر
│   └── numberStyleStore.ts          ⚠️ يُدمج
│
├── utils/                           🛠️ الأدوات
│   ├── numberStyle.ts               ✅
│   ├── arabicNumbers.ts             ✅
│   ├── numerals.ts                  ✅
│   ├── audioAnzanBadges.ts          ✅
│   ├── anzanBadges.ts               ✅
│   ├── badgeChecker.ts              ✅ محدَّث
│   ├── certificateGenerator.ts      ✅ غير مربوط
│   └── skillsChecker.ts             ✅ موثّق
│
├── hooks/                           🪝 Hooks (7)
│
├── components/                      🧩 المكونات
│   ├── AdaptiveFeedback.tsx         🔴 يستورد من bank-v2
│   └── soroban2d5/                  ✅ السوروبان التفاعلي
│
└── screens/                         📱 الشاشات
├── CategoryScreen.tsx           ✅ يستورد من bank-v2
├── LevelScreen.tsx              ✅ يستورد من bank-v2
├── LessonScreen.tsx             ✅
├── PracticeScreen.tsx           ✅ SRB + Fallback
├── AnzanScreen.tsx              ✅ SRB + Fallback
├── AudioAnzanScreen.tsx         ✅ SRB + Fallback
├── CategoryExamScreen.tsx       🔴 يستورد من bank-v2
├── LevelTestScreen.tsx          🔴 (يحتاج فحص)
├── PlacementTestScreen.tsx      🔴 يستورد من bank-v2
├── RemediationScreen.tsx        ✅ موجود (غير مربوط)
└── (12 شاشة أخرى)               ✅

```

---

✅ ما تم إنجازه في جلسة 2026-09-29

📋 العمليات الناجحة

# العملية الحالة
1 بناء SRB Logic كامل (17 ملفًا) ✅
2 SRB L0 كامل (S01 + S02 بـ 8 m) ✅
3 Fallback في srb-adapter ✅
4 دمج SRB في PracticeScreen + AnzanScreen + AudioAnzanScreen ✅
5 حذف 5 ملفات زائدة: PracticeScreenSRB · AnzanScreenSRB · AudioAnzanScreenSRB · LessonsListScreen · SRBTestScreen ✅
6 تصحيح buildSession — فلترة level + section ✅
7 تصحيح m4 — allowed_phases (أسئلة القراءة في Flash) ✅
8 البناء يعمل + اختبار حي في L0 ناجح ✅

❌ ما تم حذفه

# الملف السبب
1 src/screens/PracticeScreenSRB.tsx مدموج في PracticeScreen
2 src/screens/AnzanScreenSRB.tsx مدموج في AnzanScreen
3 src/screens/AudioAnzanScreenSRB.tsx مدموج في AudioAnzanScreen
4 src/screens/LessonsListScreen.tsx غير مستخدم
5 src/screens/SRBTestScreen.tsx شاشة اختبار مؤقتة
6 src/examBank2.ts (سابقًا)
7 src/data/learnModules.ts (سابقًا)

---

🔴 المهام المؤجّلة للخطة القادمة

📋 قائمة المهام المؤجّلة (بترتيب الأولوية)

# المهمة السبب الأولوية
1 تصحيح m1.ts — allowed_phases أسئلة "قراءة" في التمرن 🔴 عالية
2 تصحيح m2.ts — نفس التعديل — 🔴 عالية
3 تصحيح m3.ts — نفس التعديل — 🔴 عالية
4 فحص S02/m1-m4.ts — نفس المشكلة؟ — 🟠 متوسطة
5 ربط RemediationScreen بلوحات التمرن/الأنزان مود علاجي جديد 🟠 متوسطة
6 تحسين مظهر السؤال في Flash (ضبط × و ÷) — 🟡 منخفضة
7 بناء SRB لـ L1 (S03-S09) الترحيل التدريجي 🟠 متوسطة
8 تعديل LevelScreen — أزرار ذكية بـ level+section — 🟡 منخفضة
9 تعديل AdaptiveFeedback — استيراد من srb-adapter — 🟡 منخفضة

---

🎯 الخطة القادمة (المرحلة)

📋 المرحلة ① — تصحيح allowed_phases (نصف ساعة)

# المهمة
1 تصحيح m1.ts
2 تصحيح m2.ts
3 تصحيح m3.ts
4 فحص S02/m1-m4.ts

النتيجة: التمرن في L0 يعرض فقط الأسئلة المناسبة.

---

📋 المرحلة ② — ربط الجلسة العلاجية (ساعة)

# المهمة
1 إضافة mode: "remedial" في PracticeScreen
2 إضافة زر "🩺 جلسة علاجية" في LevelScreen
3 اختبار حي

النتيجة: الطفل الضعيف يدخل جلسة علاجية بضغطة.

---

📋 المرحلة ③ — بناء SRB لـ L1 (أسابيع)

# المهمة
1 كتابة أسئلة S03 (جمع مباشر)
2 كتابة أسئلة S04 (طرح مباشر)
3 كتابة أسئلة S05-S08 (أصدقاء 5 و 10)
4 كتابة أسئلة S09 (مختلط)
5 اختبار + Fallback يتوقف تلقائيًا

النتيجة: L1 يعمل عبر SRB.

---

📋 المرحلة ④ — باقي المستويات (أسابيع)

# المستوى الدروس
1 L2 (الضرب) S10-S12
2 L3 (القسمة) S13-S15
3 L4-L7 S16-S20

---

📋 المرحلة ⑤ — بناء الدروس (أسابيع)

⚠️ ملاحظة: الدروس (شاهد + جرّب) موجودة فقط لـ L0.

· L1-L7 بلا دروس.
· تحتاج كتابة محتوى تعليمي.

---

📋 المرحلة ⑥ — التوحيد النهائي (لاحقًا)

# المهمة
1 حذف bank-v2/ (بعد SRB كامل)
2 حذف bank-raw/
3 حذف bank-linked.ts
4 حذف bank-adapter.ts
5 حذف bank.ts
6 توحيد مفاتيح localStorage في srb_progress

---

🔗 خريطة الاعتماديات

🎯 المستوردون الحقيقيون

# الملف المصدر المستوردون العدد
1 bank-linked.ts adaptiveEngine.ts · problemGenerator.ts 2
2 bank-v2/index.ts AdaptiveFeedback · bank-linked · srb-adapter (Fallback) 3
3 bank-raw/index.ts bank-v2/bank-exam.ts · bank-adapter.ts 2
4 bank-adapter.ts bank-linked.ts 1
5 bank.ts ❌ معزول 0
6 srb-adapter.ts PracticeScreen · AnzanScreen · AudioAnzanScreen 3

---

🔑 سجل مفاتيح localStorage

# المفتاح الوصف
1 sorobanmind-v2-progress متجر Zustand
2 soroban_completed_levels مستويات مكتملة
3 soroban_completed_lessons دروس مكتملة
4 soroban_passed_practice تمارين ناجحة
5 soroban_passed_anzan_visual أنزان بصري
6 soroban_passed_anzan_audio أنزان سمعي
7 soroban_passed_level_tests اختبارات المستوى
8 soroban_exam1_passed · soroban_exam2_passed امتحانات القسم
9 soroban_weak_skills_v2 مهارات الضعف
10 soroban_placement_* تحديد المستوى
11 soroban_section2_unlocked فتح القسم 2
12 soroban_anzan_stats · soroban_practice_stats إحصاءات
13 srb_progress SRB الجديد

الخطة: توحيد كل شيء في srb_progress (لاحقًا).

---

🏦 البنوك — نظرة شاملة

# الملف الحجم الاستخدام الحالي
1 bank.ts 500 ⚠️ معزول
2 bank-v2/ ~935 ✅ Fallback (L1-L7)
3 bank-raw/ 400 ✅ مستخدم (داخلي)
4 bank-linked.ts موحّد ✅ AdaptiveEngine + ProblemGenerator
5 srb/ ~100 ✅ L0

---

📏 قواعد إلزامية

# القاعدة
1 🛡️ نسخة احتياطية قبل أي تعديل
2 ملف واحد في المرة — ثم اختبار
3 لا تلمس المحرك الرياضي (sorobanMoves.ts + sorobanEngine.ts)
4 SRB هو البنك الوحيد النهائي
5 الـ ID موحّد: SRB-L{level}-S{sec}-m{module}-{B/A}{seq}
6 المراحل في allowed_phases — ليس في ID
7 digit_count_max = خانات result
8 operand_count = أرقام السؤال
9 solution نظيف — بلا مسودات
10 كل درس ≥ 15 سؤالًا
11 لا كود قبل توثيق
12 m مرتبط بـ S — إعادة ترقيم في كل درس
13 8-10 أسئلة مثالي لكل m — لا تتجاوز 15
14 لا تكرار في الجلسة الواحدة
15 الأسئلة من نفس الدرس S + المستوى L

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
```

مفتاح localStorage: soroban_weak_skills_v2 → srb_weak_skills (لاحقًا).

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
7. bank.ts معزول — يمكن أرشفته في أي وقت
8. 3 أنظمة ترقيم — مصدر التعارض الحقيقي
9. curriculum/types.ts عقد أساسي — 14 مستورد
10. ازدواجية localStorage — 13 مفتاحًا، سنُوحّدها في srb_progress
11. الدروس موجودة لـ L0 فقط — L1-L7 تحتاج كتابة
12. SRB موجود لـ L0 فقط — L1-L7 تعتمد على Fallback

---

📎 روابط أساسية

العنصر المسار
الموقع https://mezo2021.github.io/sorobanmind-2
المستودع https://github.com/mezo2021/sorobanmind-2
Actions https://github.com/mezo2021/sorobanmind-2/actions
المحرك src/engine/sorobanMoves.ts + sorobanEngine.ts
المتجر الأساسي src/store/progressStore.ts
دروس L0 src/curriculum/lessons/L0/
البنك الحديث src/data/bank-v2/
البنك الخام src/data/bank-raw/
العقد الأساسي src/curriculum/types.ts
SRB src/data/srb/
SRB Adapter src/data/srb-adapter.ts

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

الحالة: 🟢 SRB Logic كامل + Fallback نشط — التطبيق يعمل

الخطوة التالية: 🎯 تصحيح allowed_phases في m1-m3 + ربط الجلسة العلاجية

</div>