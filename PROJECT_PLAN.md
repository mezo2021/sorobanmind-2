<div dir="rtl">

# 🧮 SorobanMind v2 — المرجع الموحّد

> **آخر تحديث:** 2026-10-07 (د) — بعد اعتماد `PLAN_v3` + ربط Bank B
> **الحالة:** 🟢 البناء أخضر · التطبيق منشور · البنكان A و B مكتملان · المرحلة P9 قادمة
> **القاعدة الذهبية:** لا حذف إلا ما أُلغي صريحًا · لا مصدران للحقيقة
> **المرجع الأساسي:** [`AL-ISLAH-V2.md`](./AL-ISLAH-V2.md) — وثيقة الفحص الشامل
> **الخطة التنفيذية:** [`PLAN_v3.md`](./PLAN_v3.md) — الخطة المعتمدة (P1-P16)
> **المرجع التاريخي:** [`AL-ISLAH.md`](./AL-ISLAH.md) — وثيقة الحماية الأصلية

---

## 📑 فهرس المرجع

1. [نظرة عامة](#1-نظرة-عامة)
2. [الرؤية والأهداف](#2-الرؤية-والأهداف)
3. [القواعد الذهبية — 16 قاعدة](#3-القواعد-الذهبية)
4. [المنهج](#4-المنهج)
5. [بنك SRB — A و B](#5-بنك-srb--a-و-b)
6. [البنية التقنية](#6-البنية-التقنية)
7. [بنية الملفات ووظائفها](#7-بنية-الملفات-ووظائفها)
8. [التخزين — 35 مفتاحًا](#8-التخزين)
9. [نظام التقييم](#9-نظام-التقييم)
10. [نظام القفل والفتح + وضع المعاينة](#10-نظام-القفل-والفتح)
11. [خريطة الترابط](#11-خريطة-الترابط)
12. [Attempt Record — الحلقة المفقودة](#12-attempt-record)
13. [قواعد العشرية](#13-قواعد-العشرية)
14. [الحالة الحالية](#14-الحالة-الحالية)
15. [الخطة — P1-P16](#15-الخطة--p1-p16)
16. [المشاكل المعروفة](#16-المشاكل-المعروفة)
17. [المصادر والمراجع](#17-المصادر-والمراجع)

---

## 1. نظرة عامة

| العنصر | التفاصيل |
|---|---|
| **الاسم** | SorobanMind v2 (أكاديمية السوروبان الدولية) |
| **النوع** | تطبيق تعليمي عربي تفاعلي |
| **الهدف** | تعليم السوروبان الياباني (منهج تاكاشي كوجيما) للأطفال والكبار |
| **الحجم** | 51,573 سطرًا · 119 ملفًا |
| **العمر** | 6 أشهر |

**الميزات الأساسية:**
- بدون إنترنت (offline)
- بدون إعلانات
- خصوصية كاملة (البيانات على جهاز المستخدم)

**الروابط:**
- الموقع: <https://mezo2021.github.io/sorobanmind-2>
- المستودع: <https://github.com/mezo2021/sorobanmind-2>
- Actions: <https://github.com/mezo2021/sorobanmind-2/actions>

**المطوّر:** مصطفى علي أكر ([@mezo2021](https://github.com/mezo2021))

**وثائق المشروع:**
| الملف | الغرض |
|---|---|
| `README.md` | نظرة عامة للمستخدمين |
| `PROJECT_MASTER.md` | هذا الملف — المرجع التقني الموحّد |
| **`PLAN_v3.md`** | **⭐ الخطة المعتمدة — الأولوية للتسلسل التنفيذي** |
| **`AL-ISLAH-V2.md`** | ⚠️ **وثيقة الفحص الشامل — الجرد + الأخطاء** |
| `AL-ISLAH.md` | وثيقة الحماية الأصلية (مرجعية) |
| `ACHIEVEMENTS.md` | سجل الجلسات + التقييم |
| `GEMINI_PLAYBOOK.md` | دليل بناء Bank B |

**⬅️ للقواعد والقرارات المعمارية:** اقرأ `PLAN_v3.md` أولًا.
**⬅️ للأخطاء والجرد الفعلي:** اقرأ `AL-ISLAH-V2.md`.

---

## 2. الرؤية والأهداف

### الرؤية

تعليم السوروبان الياباني الأصيل بالعربية — بتعليم تكيفي يكتشف نقاط ضعف الطالب ويبني له مسارًا مخصصًا.

### الفئتان العمريتان

- 🧒 **الأبطال الصغار** (5-12 سنة) → L0-L3
- 🧑 **الأبطال الكبار** (13+ سنة) → L4-L7

> **ملاحظة:** العمر مذكور في وصف التطبيق فقط — **لا يُذكر في نصوص الدروس**.

### الميزات

- **منهج ياباني أصيل** (Takashi Kojima + Japan Soroban Association)
- **تعليم تكيفي** — البنية جاهزة · التفعيل في P9-P10
- **بنك SRB الموحّد** — بنكان (A + B) مصنّفان بدقة
- **4 رفقاء** (شام · ريان · جود · بانة)
- **نظام شارات** — 4 أنظمة متوازية (كلها تعمل · لا تُلمس)
- **إثراء تفاعلي** (أسرار سحرية · رياضيات الأصابع · رياضيات فيدية)
- **شهادات** بعد اجتياز الامتحانات — **Kids + Adults مربوطتان**
- **تحديد مستوى ذكي** للطلاب الجدد
- **سوروبان تفاعلي 2D5**
- **درس مقدمة بصور SVG متحركة**
- **بنية ترجمة للدروس** (`LocalizableText`)
- **👁️ وضع المعاينة** — أداة موحّدة للمطوّر (FIX 7)

---

## 3. القواعد الذهبية

> هذه القواعد **لا تُخرَق** أبدًا:

### القواعد الأصلية (1-7)

1. **لا حذف** إلا ما أُلغي صريحًا.
2. **المحرك الرياضي مجمّد** (`sorobanEngine.ts` + `sorobanMoves.ts`) — لا يُلمس.
3. **`bank-v2/` + `bank-raw/`** لا يُحذفان قبل فك ارتباط CE1 · CE2 · PT.
4. **`curriculum/types.ts`** مجمَّد — عقد أساسي (12 مستوردًا).
5. **SRB هو البنك الوحيد** لكل الأسئلة الجديدة.
6. **ملف واحد في المرة** — ثم اختبار.
7. **نسخة احتياطية قبل أي تعديل.**

### القواعد المعتمدة (8-10)

8. **رأس موحّد لكل ملف معدّل** — يوثّق: التعديل · الوظيفة · الجلسة · الحالة.
9. **قيد `ACHIEVEMENTS.md` في نهاية الجلسة فقط**.
10. **تحديث `PROJECT_MASTER.md`** عند التعديلات البنيوية فقط.

### القواعد الحرجة (11-16) — من AL-ISLAH-V2 + PLAN_v3

11. ❌ **حذف سطر من `AL-ISLAH-V2.md` بدون دليل مصور**.
12. ❌ **إصلاحات بنيوية دون قراءة قسم "مقصود"**.
13. ❌ **إضافة ملف جديد قبل البحث في `data/index.ts` · `hooks/` · `components/`**.
14. ❌ **اعتبار "يُستورد" = "يعمل"** — يجب أن تُستدعى الدالة فعلًا.
15. ❌ **إضافة نظام شارات جديد** — كل الموجود يعمل · راجع `PLAN_v3`.
16. ❌ **الانتقال إلى IndexedDB أو Backend** — مؤجل حسب `PLAN_v3`.

### 📌 حقائق مؤكدة (بأدلة — تقرير v5)

- **Bank A = 275 سؤالًا** · `srb/questions/` · تقويم تكويني · يعمل.
- **Bank B = 666 سؤالًا** · `srb/exam/` · تقييم ختامي · مربوط.
- **~2,176 سطر كود ميت** مؤكد بالدليل.
- **`recordAttempt` مُفعَّل في 3 شاشات** (Practice · Anzan · AudioAnzan).
- **`getAnzanBadgeKey` صحيح** (لا خطأ · ملغى سابقًا).
- **`BADGES` (8 شارات)** موجودة في `data/index.ts` — معزولة · لاحقًا.
- **`srb-adapter`** فيه 3 دوال معطوبة (تحتاج إصلاحًا في P9).
- **الترجمة 65% جاهزة** · بلا زر · مؤجلة لـP13-P14.
- **`numberStyle.ts`** 14 مستوردًا.
- **`LevelScreen` + `LevelTestScreen`** مربوطتان.
- **35 مفتاح localStorage** · 5 منها يتيمة.

---

## 4. المنهج

### البنية الحالية

**8 مستويات · 15 درسًا · 51 مهارة (m)**

| المستوى | الاسم | الدروس | عدد m | الفئة |
|---|---|---|---|---|
| **L0** | التمهيدي | intro · S01 · S02 | 5 | 🧒 |
| **L1** | الجمع والطرح | S03 · S04 | 8 | 🧒 |
| **L2** | الضرب | S05 · S06 | 8 | 🧒 |
| **L3** | القسمة | S07 · S08 | 8 | 🧒 |
| **L4** | سلاسل الجمع والطرح | S09 · S10 | 8 | 🧑 |
| **L5** | ضرب وقسمة متقدم | S11 · S12 | 8 | 🧑 |
| **L6** | الكسور العشرية | S13 · S14 | 5 | 🧑 |
| **L7** | الجذور | S15 | 1 | 🧑 |

### تفصيل الدروس والمهارات

**L0 — التمهيدي:**
- **intro** (نظري): 7 صفحات · `skillId: null` · SVG متحركة · سوروبان تفاعلي في p5
- **S01** (تمثيل الأرقام 0-9): m1 (0-4) · m2 (5) · m3 (6-9)
- **S02** (القيمة المكانية): m1 (آحاد) · m2 (عشرات)

**L1 — الجمع والطرح:**
- **S03** (الجمع): m1 (بسيط) · m2 (أصدقاء 5) · m3 (أصدقاء 10) · m4 (مركب)
- **S04** (الطرح): نفس البنية

**L2 — الضرب:**
- **S05** (ضرب 1×2): m1-m4
- **S06** (ضرب 2×2): m1-m4

**L3 — القسمة:**
- **S07** (÷1): m1-m4
- **S08** (÷2): m1-m4

**L4 — سلاسل:**
- **S09** (سلاسل الجمع): m1-m4
- **S10** (سلاسل الطرح): m1-m4

**L5 — ضرب وقسمة متقدم:**
- **S11** (ضرب 2×3): m1-m4
- **S12** (قسمة ÷3): m1-m4

**L6 — الكسور العشرية:**
- **S13** (عشري جمع/طرح): m1 · m2 · m3
- **S14** (عشري ضرب/قسمة): m1 · m2

**L7 — الجذور:**
- **S15** (الجذور التربيعية): m1

### ⚠️ حالة الدروس الفعلية

| الملف | الحالة |
|---|---|
| `curriculum/lessons/L0/intro.ts` | ✅ موجود |
| `curriculum/lessons/L0/S01.ts` | ✅ موجود |
| `curriculum/lessons/L0/S02.ts` | ✅ موجود |
| `curriculum/lessons/L1/S03.ts` | ✅ موجود |
| `curriculum/lessons/L1/S04.ts` | ✅ موجود |
| `curriculum/lessons/L2-L7/` | 🔴 **لم تُبنَ** |

**⬅️ 4 دروس فعلية + intro — الباقي قيد البناء (P14).**

---

### 4.1 قواعد الأصابع — كوجيما

**من كتاب Kojima — The Japanese Abacus (1954):**

| الإصبع | الوظيفة |
|---|---|
| **الإبهام** | يرفع الخرزات السفلية (1-4) نحو العارضة |
| **السبابة** | يُنزل الخرزة العلوية (5) · ويُبعد الخرزات السفلية عند التصفير |
| **التقريص** (Pinch) | الإبهام والسبابة **معًا** لتشكيل 6-9 |

**الدليل (ص 29):**
> *"Push LOWER beads UP (thumb) and an UPPER bead DOWN (finger) simultaneously. We call this move the pinch."*

---

## 5. بنك SRB — A و B

### 5.1 الفكرة

بنكان مستقلان بغرضين مختلفين — كلاهما مصنّف بدقة.

### 5.2 التمييز الفلسفي

| البند | **Bank A** | **Bank B** |
|---|---|---|
| الاسم | تقويم تكويني (Formative) | تقييم ختامي (Summative) |
| المسار | `srb/questions/` | `srb/exam/` |
| الحجم | **275 سؤالًا** | **666 سؤالًا** |
| `variant` | "A" | "B" |
| `primary_phase` | "P" | "CE" |
| `allowed_phases` | E · T · P · ANZ-V · ANZ-F · ANZ-A · X | CE · PT · X |
| `anzan_time_ms` | > 0 (يُستخدم) | 0 (غير مطلوب) |
| `solution` | شرح تربوي غني | معادلة مباشرة |
| **الحالة** | ✅ **يعمل** | ✅ **مربوط (جلسة 24)** |
| **الدور** | قرارات لحظية · تكيّف | حكم نهائي · شهادة |

### 5.3 الصيغة

```text
SRB-L{0-7}-S{01-15}-m{n}-A{001}     ← Bank A
SRB-L{0-7}-S{01-15}-m{n}-B{001}     ← Bank B
```

مثال: SRB-L0-S01-m1-A001

5.4 البنية

```text
src/data/srb/
├── types.ts              ✅ الأنواع (257)
├── generateId.ts         ✅ مولّد ID (283)
├── curriculum.ts         ✅ 8 مستويات (396)
├── modules.ts            ✅ 51 m (526)
├── sessionBuilder.ts     ✅ مولّد الجلسات (445)
├── progress.ts           ✅ تخزين srb_progress (540)
├── remediation.ts        ✅ الجلسة العلاجية (151)
├── index.ts              ✅ نقطة الوصول (282 · SOROBAN_BANK = Bank A)
├── questions/            ✅ Bank A · 275 سؤالًا
│   └── L0.ts → L7.ts
└── exam/                 ✅ Bank B · 666 سؤالًا
    ├── L0.ts → L7.ts
    └── index.ts (352)   ✅ **مُجمَّع + CE1/CE2/PT**
```

5.5 Bank B — التوزيع الفعلي

المستوى الأقسام العدد
L0 S01 · S02 42
L1 S03 · S04 227
L2 S05 · S06 80
L3 S07 · S08 80
L4 S09 · S10 80
L5 S11 · S12 80
L6 S13 · S14 50
L7 S15 27
 المجموع 666

ملاحظة: grep -c "makeQuestion" يعطي 674 — الفرق 8 (ترويسات).

5.6 نظام المراحل (Phases)

الرمز الاسم يُسجَّل؟
E شاهد ❌
T جرّب ❌
P تمرّن ✅
ANZ-V أنزان بصري عادي ✅
ANZ-F أنزان Flash ✅
ANZ-A أنزان سمعي ✅
X اختبار المستوى ✅
CE امتحان القسم ⚠️ في Bank B
PT تحديد المستوى ⚠️ في Bank B
EN الإثراء ❌

5.7 بنية السؤال

```ts
{
  id: "SRB-L1-S03-m1-A001",
  level: "L1",
  section: "S03",
  module: "m1",
  sequence: 1,
  variant: "A",
  primary_phase: "P",
  allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
  question: "...",
  operands: [...],
  operation: "...",
  result: ...,
  solution: "...",
  movement: "direct",
  difficulty: 2,
  target_time_ms: [8000, 12000],
  anzan_time_ms: [5000, 7500],
  tags: [...]
}
```

قواعد:

· 5 أسئلة لكل (L, S, m) على الأقل.
· التسلسل يُعاد ترقيمه لكل (L, S, m).
· variant: A = تدريب · B = امتحان.

5.8 الحركات (movements)

القيمة المعنى
direct حركة مباشرة
five-friend-add صديق 5 (جمع)
five-friend-sub صديق 5 (طرح)
ten-friend-add صديق 10 (جمع)
ten-friend-sub صديق 10 (طرح)
compound-add مركّب جمع (جديد)
compound-sub مركّب طرح (جديد)
carry حمل
borrow استلاف
mixed مختلط

5.9 قاعدة الجلسة

```text
عدد الأسئلة = max(عدد m في المستوى، 5)
```

· لا تكرار داخل الجلسة.

---

6. البنية التقنية

6.1 التقنيات

العنصر التقنية
اللغة TypeScript 5.5
إطار الواجهة React 18
أداة البناء Vite 5
التنسيق Tailwind CSS
إدارة الحالة Zustand 4 (persist + localStorage)
النشر GitHub Pages (GitHub Actions)
التخزين localStorage (مستقبلًا: قد يُدرس IndexedDB)
الحركات Framer Motion
الأصوات Web Speech API (إنجليزية) + MP3 (عربية)
الاختبارات vitest (مُعدّ · لا اختبارات بعد)

6.2 بيئة التشغيل

· يعمل offline — PWA.
· بدون سيرفر — ملفات ثابتة.
· بدون قاعدة بيانات — البيانات على الجهاز.

6.3 قرار صوتي

· العربية: Sorobana MP3 (قصة مسجلة).
· الإنجليزية: Web Speech API (صوت المتصفح).

السبب في اختيار Web Speech بدل Edge TTS:

المعيار Web Speech Edge TTS
مجاني ✅ ✅
يعمل offline ✅ ❌
يحتاج API خارجي ❌ ✅
CORS لا مشكلة مشكلة حاسمة
رسمي ✅ ⚠️
يعمل في PWA ✅ ⚠️

التبديل: عند تغيير اللغة إلى الإنجليزية → يتوقف كل صوت Sorobana تلقائيًا.

---

7. بنية الملفات ووظائفها

7.1 الجذر

```text
sorobanmind-2/
├── public/
│   ├── audio/            12 ملف صوتي
│   ├── images/           9 ملفات SVG متحركة
│   └── stories/          10 ملفات قصص
├── src/
├── .github/workflows/
│   ├── audit.yml         ← فحص آلي
│   └── deploy.yml        ← نشر تلقائي
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── README.md
├── PROJECT_MASTER.md     ← هذا الملف
├── PLAN_v3.md            ← ⭐ الخطة المعتمدة (P1-P16)
├── AL-ISLAH-V2.md        ← وثيقة الفحص الشامل
├── AL-ISLAH.md           ← وثيقة الحماية (مرجعية)
├── ACHIEVEMENTS.md       ← سجل الجلسات
└── GEMINI_PLAYBOOK.md    ← دليل بناء Bank B
```

7.2 البنية العامة لـsrc/

```text
src/
├── App.tsx                       ← البوابة الرئيسية
├── types.ts                      ← الأنواع العامة
├── i18n/                         ← الترجمة (جاهز · معزول)
├── curriculum/                   ← المنهج (الدروس النصية)
├── engine/                       ← المحرك (5 ملفات · معزول بقرار)
├── data/                         ← البيانات (SRB + البنوك القديمة)
├── store/                        ← المتاجر (Zustand · 3)
├── utils/                        ← الأدوات المساعدة
│   └── previewMode.ts            ← [FIX 7] أداة المعاينة
├── hooks/                        ← الخطافات
├── components/                   ← المكوّنات
└── screens/                      ← الشاشات (22)
```

7.3 src/i18n/

```text
i18n/
├── ar.ts                         ← القاموس العربي (311)
├── en.ts                         ← القاموس الإنجليزي (311)
├── index.ts                      ← translate + Language type (29)
└── useTranslation.ts             ← useT hook (41)
```

الحالة:

· 🔴 صفر استيراد خارجي — معزول.
· useTranslation يُستورد فقط من SorobanEngineDebug (المعزول).
· الجاهزية: 65%.
· ⬅️ مؤجل لـP13-P14 (راجع PLAN_v3).

7.4 src/curriculum/

```text
curriculum/
├── types.ts                      ← عقد أساسي — مجمّد (510)
└── lessons/
    ├── index.ts                  ← الفهرس الموحّد (78)
    ├── types.ts                  ← أنواع الدروس — BilingualText (309)
    ├── L0/
    │   ├── intro.ts              ← مقدمة L0 (158)
    │   ├── S01.ts                ← تمثيل الأرقام (100)
    │   ├── S02.ts                ← القيمة المكانية (90)
    │   └── test-pool.ts          ← أسئلة اختبار L0 (69)
    └── L1/
        ├── S03.ts                ← الجمع (254)
        └── S04.ts                ← الطرح (217)
```

الحالة:

· ✅ L0 + L1 مكتملان (6 ملفات).
· 🔴 L2-L7 مفقودة.

7.5 src/engine/ — 5 ملفات

```text
engine/
├── sorobanMoves.ts               ← قواعد الحركات — 🔒 مجمّد (250)
├── sorobanEngine.ts              ← محرك الحساب — 🔒 مجمّد (249)
├── masteryTracker.ts             ← تتبع الإتقان — معزول (418)
├── problemGenerator.ts           ← مولّد المسائل — معزول (446)
└── adaptiveEngine.ts             ← المحرك التكيفي — معزول (1071)
```

الحالة:

· adaptiveEngine يستورد من bank-linked (القديم).
· masteryTracker يُستخدم من adaptiveEngine (داخليًا).
· sorobanMoves + sorobanEngine يُستخدمان من SorobanEngineDebug.

القرار:

· 🔒 sorobanEngine + sorobanMoves مجمّدان.
· ⏳ adaptiveEngine + problemGenerator يحتاجان ترحيلًا (P9).

7.6 src/data/

```text
data/
├── srb/                          ← النظام الموحّد الجديد
│   ├── types.ts (257)
│   ├── generateId.ts (283)
│   ├── curriculum.ts (396)
│   ├── modules.ts (526)
│   ├── sessionBuilder.ts (445)
│   ├── progress.ts (540)
│   ├── remediation.ts (151)
│   ├── index.ts (282)
│   ├── questions/                ← Bank A (275)
│   └── exam/                     ← Bank B (666) + index.ts (352) ✅
│
├── srb-adapter.ts                ← Barrel file · 5 مستوردين (360)
│
├── bank.ts                       ← 🔴 ميت (1200)
├── bank-linked.ts                ← 🟡 معزول (475)
├── bank-adapter.ts               ← 🟡 معزول (375)
├── bank-v2/                      ← 🟡 للقطع (583 سؤالًا)
├── bank-raw/                     ← 🟡 للقطع (~600)
├── curriculum.ts                 ← 🔴 ميت (312)
├── modes.ts                      ← نشط (76)
└── index.ts                      ← 🟡 معزول (189 — يحتوي BADGES)
```

7.7 src/store/ — 3 متاجر

```text
store/
├── progressStore.ts              ← المتجر الرئيسي (561) — يبقى
├── masteryBadgesStore.ts         ← شارات الإتقان (123) — يبقى
└── numberStyleStore.ts           ← نمط الأرقام (29) — يبقى
```

الحالة:

· ✅ progressStore — مصدر موحّد · 26 action · version 5.
· ✅ masteryBadgesStore — يعمل · 3 شاشات.
· ✅ numberStyleStore — 15 ملفًا.
· ⬅️ لا يُضاف متجر رابع (قاعدة 15).

7.8 src/utils/

```text
utils/
├── numberStyle.ts                ← تنسيق الأرقام · 14 مستوردًا ✅ (82)
├── arabicNumbers.ts              ← كلمات عربية · للصوت ✅ (163)
├── numerals.ts                   ← 🔴 نسخة قديمة (126)
├── previewMode.ts                ← [FIX 7] ✅ (32)
├── anzanBadges.ts                ← 🔴 يُستورد من badgeChecker (34)
├── audioAnzanBadges.ts           ← 🔴 ميت (27)
├── badgeChecker.ts               ← 🟡 يُستورد من useGameStats (112)
├── skillsChecker.ts              ← 🔴 ميت (176)
└── certificateGenerator.ts       ← ✅ 3 مستخدمين (127)
```

المطلوب (P16):

· حذف 6 ملفات ميتة (~1,600 سطرًا).
· فحص badgeChecker قبل الحذف.

7.9 src/hooks/

```text
hooks/
├── useGameStats.ts               ← Adapter SRB ✅ (98)
├── useSound.ts                   ← ✅ (85)
├── useConfetti.ts                ← ✅ (42)
├── useSpeech.ts                  ← ✅ (102)
├── useSorobanaVoice.ts           ← ✅ (396)
├── useQuests.ts                  ← 🟡 مفاتيح قديمة (148)
└── useCharacterVoice.ts          ← ✅ (94)
```

7.10 src/screens/ — 22 شاشة

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
16 PlacementTestScreen ✅ مربوط بـ@/data/srb/exam
17 CategoryExamScreen ✅ مربوط بـ@/data/srb/exam
18 SorobanPlayground ✅
19 Header ✅
20 CertificateScreen ✅ مربوط
21 KidsCertificateScreen ✅
22 RemediationScreen ✅

---

8. التخزين

8.1 التصنيف — 4 فئات (راجع PLAN_v3 · P1)

الفئة المحتوى المصدر المستهدف
A — بيانات الطفل التعليمية progress · grades · skillProgress · completed · anzan achievements · XP · streak progressStore
B — شارات الإتقان MasteryBadge لكل مهارة masteryBadgesStore (مؤقتًا)
C — SRB internal srb_progress srb/progress.ts
D — إعدادات التطبيق numberStyle · language · welcomeSeen · previewMode تبقى منفصلة

8.2 خريطة المفاتيح (35 مفتاحًا)

المجموعة 1 — نظيفة ✅

1. sorobanmind-v2-progress (progressStore)
2. sorobanmind-v2-lang
3. soroban_mastery_badges
4. srb_progress

المجموعة 2 — مكررة 🟡

5. soroban_child_name · soroban_child_full_name
6. soroban_companion · CHARACTER_STORAGE_KEY
7. soroban_number_style

المجموعة 3 — التقدم الرئيسية 🔴

8. soroban_completed_lessons
9. soroban_completed_levels
10. soroban_passed_practice
11. soroban_passed_anzan_visual
12. soroban_passed_anzan_audio

المجموعة 4 — الامتحانات 🔴

13. soroban_passed_level_tests
14. soroban_exam1_passed · soroban_exam2_passed
15. soroban_exam1_score · soroban_exam2_score
16. soroban_exam1_last_attempt · soroban_exam2_last_attempt
17. soroban_exam_result
18. soroban_weak_skills_v2
19. soroban_section2_unlocked

المجموعة 5 — إحصاءات وشارات 🔴

20. soroban_anzan_stats
21. soroban_practice_stats
22. soroban_anzan_badges
23. soroban_anzan_audio_badges

المجموعة 6 — ثانوية ✅

24. soroban_unlocked_secrets · soroban_secrets_best_scores
25. soroban_welcome_seen
26. soroban_completed_enrichment

المجموعة 7 — مؤقتة 🟡

27. soroban_placement_recommended
28. soroban_placement_weak_skills
29. soroban_placement_last_attempt
30. soroban_placement_result
31. soroban_level_test_last_attempt_L0
32. soroban_lesson_session_*

🚨 المفاتيح الحرجة:

33. soroban_kids_certificate_ready — يُكتب ولا يُقرأ
34. soroban_dev_preview — ✅ أداة موحّدة (FIX 7)
35. soroban_exam_result — مفتاح ثالث

⬅️ 5 مفاتيح يتيمة (تُقرأ ولا تُكتب):

· soroban_passed_level_tests
· soroban_exam_result
· soroban_placement_recommended
· soroban_placement_last_attempt
· soroban_placement_result

8.3 الإصلاح — مؤجل لـP6 (راجع PLAN_v3)

المبدأ: مصدر واحد لكل نوع بيانات (لا مفتاح واحد لكل التطبيق).

الترتيب:

· P1 · P6 — تصنيف المفاتيح · تحديد Canonical
· P7 — إكمال recordAttempt في 5 شاشات
· P16 — تنظيف Legacy بعد Audit

---

9. نظام التقييم

9.1 نظرة عامة

كل مستوى يُقيَّم بأربعة أقسام منفصلة. كل قسم له درجة كاملة = 100.

القسم الدرجة الكاملة النجاح
✏️ تمرّن (P) 100 70%
🧠 أنزان بصري عادي (ANZ-V) 100 70%
⚡ أنزان بصري فلاش (ANZ-F) 100 70%
🎧 أنزان سمعي (ANZ-A) 100 70%
🎓 اختبار المستوى (X) 100 80%

9.2 التسلسل الكامل

```text
1. تعلّم (الدروس النصية)
        ↓
2. "أنهيت المستوى" — عند آخر "جرّب" في آخر درس
        ↓
3. يُفتح: تمرّن + أنزان (بصري عادي · بصري فلاش · سمعي)
        ↓
4. عند نجاح كل قسم (70%) → شارة
   · لا إعادة بعد النجاح
        ↓
5. عند نجاح التمرّن + كل أقسام الأنزان → يُفتح اختبار المستوى
        ↓
6. عند نجاح الاختبار (80%) → الشهادة
```

9.3 توزيع العلامة النهائية

```text
العلامة النهائية =
    (درجة الاختبار × 70%)
  + (درجة التمرّن × 10%)
  + (درجة الأنزان البصري × 10%)  ← متوسط (عادي + فلاش) ÷ 2
  + (درجة الأنزان السمعي × 10%)
  = 100%
```

⬅️ الأنزان البصري = متوسط حسابي (عادي + فلاش) ÷ 2.
⬅️ علامة الفتح: يشترط الاثنين (AND) — عادي + فلاش.

9.4 قواعد النجاح والإعادة

الحالة القاعدة
نجاح تمرّن لا إعادة
نجاح أنزان (كل الأنواع) لا إعادة
نجاح اختبار المستوى لا إعادة
رسوب اختبار إعادة بعد فترة انتظار

⬅️ فترة الانتظار:

· اختبار مستوى (X): 24 ساعة (L0_TEST_COOLDOWN_MS).
· امتحان قسم + Placement: 48 ساعة (EXAM_COOLDOWN_MS).

9.5 الشهادات

الوضع الحالي:

· ✅ KidsCertificateScreen — مربوط.
· ✅ CertificateScreen — مربوط (جلسة 20).

المحتوى: اسم الطفل · الدرجات · العلامة النهائية · الميدالية · رقم الشهادة · التاريخ + رابط التحقق.
🆕 وضع المعاينة: درجات افتراضية (95% · 92%).

9.6 تصنيف الميداليات

العلامة الميدالية التصنيف
95-100 🥇 ذهبية ممتاز
90-94 🥈 فضية ممتاز مرتفع
85-89 🥉 برونزية جيد جدًا
80-84 🎖️ نجاح جيد
< 80 ❌ لا شهادة —

9.7 شارات السرعة (Mastery Badges)

الشارة الشرط
🥇 ذهبية (mastery) إجابة ≤ 50% من الزمن المعياري
👍 مقبول (accepted) إجابة ≤ 75%
🐢 بطيء (slow) إجابة > 75%

9.8 الجلسة العلاجية

المعادلة:

```text
الضعف = (1 - accuracy) × 60
      + 20 إذا accuracy < 50%
      + 20 إذا avgTimeMs > 15000

عتبة "ضعيف" = 50
نسبة الأسئلة العلاجية = 70%
```

الخصائص: بلا درجات · إظهار الحل فورًا · مخصصة لـm ضعيف.

---

10. نظام القفل والفتح + وضع المعاينة

10.1 التسلسل

```text
داخل الدرس:
    أكمل "شاهد" + "جرّب" → يُفتح الدرس التالي
        ↓
    آخر "جرّب" → "أنهيت المستوى"
        ↓
داخل المستوى:
    يُفتح: تمرّن + أنزان
        ↓
    نجاح التمرّن (70%) + كل أنزان (70%) → يُفتح الاختبار
        ↓
    نجاح الاختبار (80%) → يُفتح المستوى التالي
        ↓
التنقل: L0 → L1 → L2 → ... → L7
```

10.2 مصادر القفل

العنصر المفتاح
فتح الدروس progressStore.completedLessons
فتح تمرّن progressStore.completedLessons
فتح أنزان progressStore.completedLessons
فتح اختبار progressStore.passedPractice + passedAnzan*
فتح المستوى التالي progressStore.completedLevels

10.3 👁️ وضع المعاينة (FIX 7)

```text
GuardianDashboard → زر toggle
    ↓
"👁️ وضع المعاينة" / "🚪 خروج من المعاينة"
    ↓
localStorage: soroban_dev_preview = 'true'/'false'
    ↓
كل شيء يفتح:
    · Levels: كل الأقسام مفتوحة
    · Category: كل المستويات مفتوحة
    · CategoryExam: تجاوز cooldown
    · Certificates: درجات افتراضية (95% · 92%)
    · CE1 · CE2: زر "🎯 اختبار حقيقي"
    ↓
"🚪 خروج" → كل شيء يعود للحالة الأصلية
```

أداة موحّدة: src/utils/previewMode.ts

```ts
export function isPreviewMode(): boolean;
export function setPreviewMode(on: boolean): void;
export function togglePreviewMode(): boolean;
```

الملفات المعدّلة (7):

1. utils/previewMode.ts (جديد)
2. screens/GuardianDashboard.tsx
3. screens/LevelScreen.tsx
4. screens/CategoryScreen.tsx
5. screens/CategoryExamScreen.tsx
6. screens/CertificateScreen.tsx
7. screens/KidsCertificateScreen.tsx

---

11. خريطة الترابط

11.1 خريطة الملفات

📚 المنهج:

· curriculum/types.ts ← 12 مستوردًا (مجمّد).
· curriculum/lessons/types.ts ← 5 مستوردين.
· curriculum/lessons/index.ts ← 4 شاشات.

🏦 بنك SRB (مستقل ✅):

· data/srb/ ← 10 ملفات + 16 ملف أسئلة.
· data/srb-adapter.ts ← 5 شاشات.

🏦 البنوك القديمة:

· data/bank-v2/ ← عبر bank-linked فقط.
· data/bank-raw/ ← عبر bank-v2/bank-exam + bank-adapter.
· data/bank-linked.ts ← engine/adaptiveEngine + engine/problemGenerator.

🧠 المحرك (5 ملفات — معزولة):

· استخدام داخلي بين الملفات نفسها.

📦 المتاجر (3):

· progressStore.ts ← 16 مستوردًا.
· masteryBadgesStore.ts ← 6 مستوردين.
· numberStyleStore.ts ← 15 ملفًا.

11.2 خريطة البنوك

```text
bank-raw/ (~600 سؤال — 7 ملفات)
        ↓
bank-v2/ (583 سؤال — 4 parts + امتحانات)
        ↓
bank-linked.ts ← يجمع v2 + raw
        ↓
engine/adaptiveEngine.ts + engine/problemGenerator.ts (معزول)
```

من يستورد bank-v2:

· bank-linked.ts:60 فقط.

من يستورد bank-linked:

· engine/adaptiveEngine.ts:62
· engine/problemGenerator.ts:59

بنك SRB مستقل تمامًا:

· srb-adapter.ts يستورد من ./srb فقط ✅

---

12. Attempt Record — الحلقة المفقودة

12.1 ما هو؟

سجل محاولة واحدة · سطر واحد لكل إجابة.

مثال:

```json
{
  "attemptId": "A-000184",
  "timestamp": 1760000000000,
  "level": "L1",
  "section": "S03",
  "skill": "SRB-L1-S03-m2",
  "questionId": "SRB-L1-S03-m2-A017",
  "phase": "P",
  "correct": false,
  "timeMs": 6200
}
```

12.2 الحالة الحالية

موجود:

العنصر الموقع الحالة
نوع Attempt curriculum/types.ts ✅
createAttempt() engine/masteryTracker.ts:177 ✅
recordAttempt() store/progressStore.ts:394 ✅
skillProgress progressStore (state) ✅
masteryTracker engine/masteryTracker.ts ✅
استدعاء recordAttempt 3 شاشات ✅ مُفعَّل

مفقود:

العنصر الشاشات
recordAttempt CategoryExamScreen · PlacementTestScreen

12.3 الحلقة الكاملة

```text
1. الطفل يحل سؤالًا
        ↓
2. Attempt Record يُنشأ
        ↓
3. recordAttempt يحفظه في skillProgress
        ↓
4. masteryTracker يحلّل
        ↓
5. adaptiveEngine يختار السؤال التالي
        ↓
   (يعود إلى 1)
```

12.4 التصميم المعتمد (من AudioAnzanScreen)

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

الشاشات المُفعَّلة:

· ✅ PracticeScreen.tsx (سطر 308)
· ✅ AnzanScreen.tsx (سطر 402)
· ✅ AudioAnzanScreen.tsx (سطر 343)

الشاشات المتبقية (P7):

· ⏳ CategoryExamScreen.tsx
· ⏳ PlacementTestScreen.tsx

---

13. قواعد العشرية

13.1 القواعد

قاعدة 1 — تحديد الحالة:

· result % 1 === 0 → عدد صحيح → عرض كما هو.
· result % 1 !== 0 → عشري → عرض برقمين بعد الفاصلة.

قاعدة 2 — العرض:

· صحيح: 4 → 4.
· عشري: 3.8 → 3.80.

قاعدة 3 — الإدخال:

· صحيح: 4 → 4.
· عشري: 3.80 → 380.
· عشري: 0.48 → 48.

قاعدة 4 — الأعمدة:

· صحيح: عدد خانات الناتج.
· عشري: عدد خانات الجزء الصحيح + 2.

قاعدة 5 — المقارنة:

```ts
const factor = result % 1 !== 0 ? 100 : 1;
const targetValue = Math.round(result * factor);
const isCorrect = abacusValue === targetValue;
```

قاعدة 6 — القسمة:

· كل أسئلة القسمة بدون باقٍ.
· إذا الناتج صحيح → يُعرض صحيحًا.
· إذا الناتج عشري → يُعرض برقمين.

13.2 الملفات

# الملف الحالة
~~1~~ ~~CategoryExamScreen.tsx~~ ✅ تم (N60)
~~2~~ ~~PlacementTestScreen.tsx~~ ✅ تم (N60-ب)
3 srb/questions/L6.ts ⏳ (الأسئلة الـ25)
4 AnzanScreen.getColumnsForQuestion ⏳
5 PracticeScreen ⏳
6 AudioAnzanScreen ⏳ يحتاج فحصًا
7 LevelTestScreen ⏳ بعد نقل X إلى Bank B

---

14. الحالة الحالية

14.1 ما يعمل ✅

العنصر الحالة
Bank A (تمارين · أنزان) ✅ 275 سؤالًا · يعمل
Bank B (امتحانات · PT) ✅ 666 سؤالًا · مربوط (جلسة 24)
المنهج (بنية) ✅ 8 مستويات · 15 درسًا · 51 m
درس المقدمة ✅ 7 صفحات · SVG متحركة
القفل المتتابع ✅ يعمل
التمرّن والأنزان ✅ يعملان من Bank A
التنقل بين المستويات ✅ يعمل
الجلسة العلاجية ✅ مربوطة
GuardianDashboard ✅ يقرأ من progressStore
النسخ الاحتياطي (JSON) ✅ يعمل
وضع المعاينة ✅ يعمل (FIX 7)
زر "اختبار حقيقي" CE1 · CE2 ✅ يعمل
البناء ✅ أخضر
الشهادات ✅ Kids + Adults
XP ✅ يعمل
العشرية ✅ في CE1 · CE2 · PT
الأنزان البصري (AND) ✅ موحّد
LevelId ✅ آمن

14.2 أخطاء مؤكدة (تقرير v5)

# الخطأ الملف الأثر
1 recordAttempt مفقود CategoryExamScreen · PlacementTestScreen skillProgress ناقص
2 srb-adapter 3 دوال srb-adapter.ts يحتاج إصلاحًا في P9
3 فجوة UI (3 شارات) GuardianDashboard شارات مخفية (مؤجل)
4 BADGES معزولة data/index.ts 8 شارات مخفية (مؤجل)
5 دروس L2-L7 مفقودة curriculum/lessons/ محتوى (P14)

✅ مُصلَح:

· ~~getAnzanBadgeKey خطأ~~ (ملغى · الكود صحيح)
· ~~recordAttempt لا يُستدعى~~ (3 شاشات مُفعَّلة)
· ~~bank-v2 يُستورد من الشاشات~~ (مربوط بـsrb/exam)

14.3 ما لم يُبنَ بعد

العنصر الحالة
adaptiveEngine مربوط بـsrb-adapter 🔴 (P9)
masteryTracker يستقبل بيانات ⏳ يُغذّى تلقائيًا
قاعدة 70/30 ⏳ (P10)
دروس L2-L7 🔴
recordAttempt في CE · PT 🔴 (P7)
الترجمة الكاملة 🟡 65% · (P13-P14)
TTS للإنجليزية 🟡 مؤجل

14.4 ✅ ما أُنجز في جلسات 20-24

جلسة 20 — 8 إصلاحات P-1:

· ✅ N42 · B9 · B1 · B4 · B5 · N60 · N60-ب
· ✅ FIX 7 — وضع المعاينة (7 ملفات)
· ✅ ربط CertificateScreen (5 تعديلات)

جلسات 21-22 — إصلاحات P2:

· ✅ N62 · N63 · N68 · N69 · N61

جلسة 23 — Bank B:

· ✅ N70 · N71-N74 — Bank B كامل (666 سؤالًا)

جلسة 24 — الفحص + الربط:

· ✅ audit.yml v5 — فحص آلي شامل
· ✅ 5 تقارير فحص
· ✅ AL-ISLAH-V2.md — الوثيقة الشاملة
· ✅ srb/exam/index.ts — يُجمّع Bank B + CE + PT
· ✅ ربط CategoryExamScreen · PlacementTestScreen بـsrb/exam
· ✅ إصلاح العشرية في PT
· ✅ recordAttempt في 3 شاشات
· ✅ زر "اختبار حقيقي" في CE1 · CE2
· ✅ PLAN_v3.md — الخطة المعتمدة (P1-P16)

---

15. الخطة — P1-P16

⬅️ التفاصيل الكاملة في PLAN_v3.md.

المرحلة المهمة الحالة
P1 تثبيت نموذج البيانات ✅ (PLAN_v3)
P2 Badge Registry ⏸️ لاحقًا
P3 ربط BADGES الـ8 ⏸️ لاحقًا
P4 توحيد Anzan Badges ⏸️ لاحقًا
P5 إغلاق mastery duplication ⏸️ لا تكرار فعلي
P6 تصنيف 35 Key ⏸️ لاحقًا
P7 إكمال recordAttempt (CE · PT) ⏳
P8 ربط masteryTracker ⏳ يُغذّى تلقائيًا
P9 نقل adaptiveEngine إلى SRB ⏳ الأولوية 1
P10 اختبار Adaptive ⏳
P11-P16 Badges UI · i18n · Translation · Export/Import · Audit ⏸️ لاحقًا

الأولويات الفورية

الأولوية المرحلة الوقت
1 P9 — ربط adaptiveEngine 1 ساعة
2 P7 — recordAttempt في CE · PT 1 ساعة
3 P10 — اختبار Adaptive بعد P9 · P7

---

16. المشاكل المعروفة

16.1 حرجة — لم تُحلّ

# المشكلة
1 recordAttempt مفقود في CategoryExamScreen · PlacementTestScreen
2 srb-adapter 3 دوال معطوبة (تُصلح في P9)
3 دروس L2-L7 مفقودة
4 adaptiveEngine على bank-linked

16.2 متوسطة

# المشكلة
5 LevelTestScreen يستخدم buildL0Test
6 5 مفاتيح يتيمة
7 badgeChecker · useQuests — مفاتيح ميتة
8 فجوة UI (3 شارات)

16.3 بسيطة

# المشكلة
9 SRBModule محدود بـm1-m10
10 i18n مفاتيح قديمة
11 LessonScreen لا يقرأ اللغة

✅ مُصلحة (جلسات 20-24)

· ~~XP مفقود (N42)~~ ✅
· ~~B1 · B4 · B5 · B9~~ ✅
· ~~N60 · N60-ب — العشرية~~ ✅
· ~~زر "فتح الكل"~~ ✅
· ~~CertificateScreen غير مستدعى~~ ✅
· ~~N62 · N63 · N68 · N69 · N61~~ ✅
· ~~getAnzanBadgeKey خطأ~~ ✅ (ملغى)
· ~~recordAttempt لا يُستدعى~~ ✅ (3 شاشات)
· ~~bank-v2 يُستورد من الشاشات~~ ✅

---

17. المصادر والمراجع

مصادر المنهج

· Takashi Kojima — The Japanese Abacus: Its Use and Theory.
· Japan Soroban Association — المنهج الرسمي.

مصادر التقريص (Pinch)

من الكتاب (Kojima, 1954, ص 29):

"Push LOWER beads UP (thumb) and an UPPER bead DOWN (finger) simultaneously. We call this move the pinch."

مراجع المشروع

الملف الغرض
README.md نظرة عامة للمستخدمين
PROJECT_MASTER.md هذا الملف — المرجع التقني
PLAN_v3.md ⭐ الخطة المعتمدة (P1-P16)
AL-ISLAH-V2.md وثيقة الفحص الشامل
AL-ISLAH.md وثيقة الحماية (مرجعية)
ACHIEVEMENTS.md سجل الجلسات + التقييم
GEMINI_PLAYBOOK.md دليل بناء Bank B

الروابط

العنصر الرابط
الموقع 
المستودع 
Actions 

المطوّر

· مصطفى علي أكر (@mezo2021)

---

📌 ملاحظات أخيرة

قبل أي تعديل

1. نسخة احتياطية (Tag).
2. مراجعة PLAN_v3.md + AL-ISLAH-V2.md — كاملًا.
3. اسأل قبل التنفيذ — لا افتراضات.

القواعد الذهبية — 16 قاعدة

```text
1. لا حذف إلا ما أُلغي صريحًا.
2. المحرك الرياضي مجمّد.
3. bank-v2/ + bank-raw/ لا يُحذفان قبل فك ارتباط CE1 · CE2 · PT.
4. curriculum/types.ts مجمّد.
5. SRB هو البنك الوحيد.
6. ملف واحد في المرة — ثم اختبار.
7. نسخة احتياطية قبل أي تعديل.
8. رأس موحّد لكل ملف معدّل.
9. قيد ACHIEVEMENTS.md في نهاية الجلسة فقط.
10. تحديث PROJECT_MASTER.md عند التعديلات البنيوية.
11. لا حذف سطر من AL-ISLAH-V2.md بدون دليل مصور.
12. لا إصلاحات بنيوية دون قراءة قسم "مقصود".
13. لا إضافة ملف جديد قبل البحث في data/index.ts · hooks/ · components/.
14. لا تعتبر "يُستورد" = "يعمل" — يجب أن تُستدعى الدالة فعلًا.
15. لا إضافة نظام شارات جديد (راجع PLAN_v3).
16. لا انتقال إلى IndexedDB أو Backend (مؤجل).
```

مبدأ التعامل

· الكود الفعلي هو الحقيقة — لا الملفات النصية.
· PLAN_v3.md = الخطة الرسمية.
· AL-ISLAH-V2.md = الدرع الحامي.
· اسأل قبل التنفيذ.
· الخطة أهم من البناء السريع.

4 أسئلة قبل أي تعديل (من PLAN_v3)

1. ما المصدر الحالي لهذه المعلومة؟
2. لماذا لا يكفي؟
3. ما الملف الذي سيصبح مصدر الحقيقة بعد التعديل؟
4. كيف سنثبت عدم وجود مصدر ثانٍ؟

إذا لم توجد إجابة موثقة → لا يُضاف الكود.

رأس الملف الموحّد (قالب)

```ts
// src/path/to/file.ts
//
// 📝 التعديل: [وصف مختصر]
// 🎯 الوظيفة: [لماذا هذا التعديل]
// 📅 الجلسة: [رقم]
// ✅ الحالة: البناء أخضر
```

---

<div align="center">

🧮 SorobanMind v2

صُنع بحب لأطفال العالم العربي 🌍

آخر تحديث: 2026-10-07 (د) — نهاية الجلسة 24

الحالة: 🟢 البناء أخضر · Bank A و B مكتملان · PLAN_v3 معتمد · P9 قادمة

المرجع الأساسي: AL-ISLAH-V2.md

الخطة التنفيذية: PLAN_v3.md

</div>

</div>
```