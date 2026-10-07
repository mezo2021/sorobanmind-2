```markdown
<div dir="rtl">

# 🧮 SorobanMind v2 — المرجع الموحّد

> **آخر تحديث:** 2026-10-07 — نهاية الجلسة 24 (الفحص الشامل)
> **الحالة:** 🟢 البناء أخضر · التطبيق منشور · البنكان A و B مكتملان
> **القاعدة الذهبية:** لا حذف إلا ما أُلغي صريحًا
> **المرجع الأساسي:** [`AL-ISLAH-V2.md`](./AL-ISLAH-V2.md) — وثيقة الفحص الشامل
> **المرجع التاريخي:** [`AL-ISLAH.md`](./AL-ISLAH.md) — وثيقة الحماية الأصلية

---

## 📑 فهرس المرجع

1. [نظرة عامة](#1-نظرة-عامة)
2. [الرؤية والأهداف](#2-الرؤية-والأهداف)
3. [القواعد الذهبية — 14 قاعدة](#3-القواعد-الذهبية)
4. [المنهج](#4-المنهج)
5. [بنك SRB — A و B](#5-بنك-srb--a-و-b)
6. [البنية التقنية](#6-البنية-التقنية)
7. [بنية الملفات ووظائفها](#7-بنية-الملفات-ووظائفها)
8. [التخزين — 37 مفتاحًا](#8-التخزين)
9. [نظام التقييم](#9-نظام-التقييم)
10. [نظام القفل والفتح + وضع المعاينة](#10-نظام-القفل-والفتح)
11. [خريطة الترابط](#11-خريطة-الترابط)
12. [Attempt Record — الحلقة المفقودة](#12-attempt-record)
13. [قواعد العشرية](#13-قواعد-العشرية)
14. [الحالة الحالية](#14-الحالة-الحالية)
15. [الخطة — 7 مراحل](#15-الخطة--7-مراحل)
16. [المشاكل المعروفة](#16-المشاكل-المعروفة)
17. [المصادر والمراجع](#17-المصادر-والمراجع)

---

## 1. نظرة عامة

| العنصر | التفاصيل |
|---|---|
| **الاسم** | SorobanMind v2 (أكاديمية السوروبان الدولية) |
| **النوع** | تطبيق تعليمي عربي تفاعلي |
| **الهدف** | تعليم السوروبان الياباني (منهج تاكاشي كوجيما) للأطفال والكبار |
| **الحجم** | 51,181 سطرًا · 119 ملفًا |
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
| **`AL-ISLAH-V2.md`** | ⚠️ **وثيقة الفحص الشامل — اقرأها أولًا** |
| `AL-ISLAH.md` | وثيقة الحماية الأصلية (مرجعية) |
| `ACHIEVEMENTS.md` | سجل الجلسات + التقييم |
| `GEMINI_PLAYBOOK.md` | دليل بناء Bank B |

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
- **تعليم تكيفي** — البنية جاهزة · التفعيل في المرحلة 5
- **بنك SRB الموحّد** — بنكان (A + B) مصنّفان بدقة
- **4 رفقاء** (شام · ريان · جود · بانة)
- **نظام شارات** — 4 أنظمة متوازية (تفصيلها في AL-ISLAH-V2)
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
4. **`curriculum/types.ts`** مجمَّد — عقد أساسي (14 مستورد).
5. **SRB هو البنك الوحيد** لكل الأسئلة الجديدة.
6. **ملف واحد في المرة** — ثم اختبار.
7. **نسخة احتياطية قبل أي تعديل.**

### القواعد المعتمدة (8-10)

8. **رأس موحّد لكل ملف معدّل** — يوثّق: التعديل · الوظيفة · الجلسة · الحالة.
9. **قيد `ACHIEVEMENTS.md` في نهاية الجلسة فقط**.
10. **تحديث `PROJECT_MASTER.md`** عند التعديلات البنيوية فقط.

### القواعد الحرجة (11-14) — من AL-ISLAH-V2

11. ❌ **حذف سطر من AL-ISLAH-V2.md بدون دليل مصور**.
12. ❌ **إصلاحات بنيوية دون قراءة قسم "مقصود"**.
13. ❌ **إضافة ملف جديد قبل البحث في `data/index.ts` · `hooks/` · `components/`**.
14. ❌ **اعتبار "يُستورد" = "يعمل"** — يجب أن تُستدعى الدالة فعلًا.

### 📌 حقائق مؤكدة (بأدلة — جلسة 24)

- **Bank A = 275 سؤالًا** · `srb/questions/` · تقويم تكويني.
- **Bank B = 666 سؤالًا** · `srb/exam/` · تقييم ختامي · معزول.
- **~2,176 سطر كود ميت** مؤكد بالدليل.
- **`recordAttempt` لا يُستدعى** من أي شاشة.
- **`getAnzanBadgeKey` فيه خطأ فادح** (S05-S10).
- **`BADGES` (8 شارات)** موجودة في `data/index.ts` — معزولة.
- **`srb-adapter`** فيه 3 دوال معطوبة.
- **الترجمة 65% جاهزة** · بلا زر.
- **`numberStyle.ts`** 14 مستوردًا.
- **`LevelScreen` + `LevelTestScreen`** مربوطتان.

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
| `curriculum/lessons/L0/S01.ts` | ✅ موجود (قيد إعادة الكتابة) |
| `curriculum/lessons/L0/S02.ts` | ✅ موجود (قيد إعادة البناء) |
| `curriculum/lessons/L1/S03.ts` | ✅ موجود |
| `curriculum/lessons/L1/S04.ts` | ✅ موجود |
| `curriculum/lessons/L2-L7/` | 🔴 **لم تُبنَ** |

**⬅️ 4 دروس فعلية + intro — الباقي قيد البناء.**

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
| **الحالة** | ✅ **يعمل** | 🔴 **معزول** |
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
├── types.ts              ✅ الأنواع
├── generateId.ts         ✅ مولّد ID (صيغة موحّدة)
├── curriculum.ts         ✅ 8 مستويات
├── modules.ts            ✅ 51 m
├── sessionBuilder.ts     ✅ مولّد الجلسات
├── progress.ts           ✅ تخزين srb_progress
├── remediation.ts        ✅ الجلسة العلاجية
├── index.ts              ✅ نقطة الوصول (SOROBAN_BANK = Bank A)
├── questions/            ✅ Bank A · 275 سؤالًا
│   └── L0.ts → L7.ts
└── exam/                 🔴 Bank B · 666 سؤالًا (بلا طبقات)
    ├── L0.ts → L7.ts
    ├── types.ts               ⏳ متبقٍ
    ├── constants.ts           ⏳ متبقٍ
    ├── examBuilder.ts         ⏳ متبقٍ
    ├── placementEngine.ts     ⏳ متبقٍ
    └── index.ts               ⏳ متبقٍ
```

5.5 Bank A — التوزيع

المستوى العدد
L0 42
L1 227
L2 80
L3 80
L4 80
L5 80
L6 50
L7 27
المجموع 666

ملاحظة: التوزيع المذكور أعلاه لـBank B. Bank A موزّع على نفس المستويات ولكن بحجم 275 إجمالي.

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
  expected_time_ms: 12000,
  expected_anzan_ms: 7000,
  tags: [...]
}
```

قواعد:

· 5 أسئلة لكل (L, S, m) على الأقل.
· التسلسل يُعاد ترقيمه لكل (L, S, m).
· variant: A = أساسي · B = امتحان.

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
التخزين localStorage (مستقبلًا: IndexedDB)
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
├── i18n/                         ← الترجمة
├── curriculum/                   ← المنهج (الدروس النصية)
├── engine/                       ← المحرك (5 ملفات · معزول بقرار)
├── data/                         ← البيانات (SRB + البنوك القديمة)
├── store/                        ← المتاجر (Zustand)
├── utils/                        ← الأدوات المساعدة
│   └── previewMode.ts            ← [FIX 7] أداة المعاينة
├── hooks/                        ← الخطافات
├── components/                   ← المكوّنات
└── screens/                      ← الشاشات (22)
```

7.3 src/i18n/

```text
i18n/
├── ar.ts                         ← القاموس العربي (311 سطرًا)
├── en.ts                         ← القاموس الإنجليزي (311)
├── index.ts                      ← translate + Language type (29)
└── useTranslation.ts             ← useT hook (41)
```

الحالة:

· 🔴 صفر استيراد — معزول تمامًا.
· useTranslation يُستورد فقط من SorobanEngineDebug (المعزول).
· الجاهزية: 65%.

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

7.5 src/engine/ — 5 ملفات (معزولة بقرار)

```text
engine/
├── sorobanMoves.ts               ← قواعد الحركات — 🔒 مجمّد (250)
├── sorobanEngine.ts              ← محرك الحساب — 🔒 مجمّد (249)
├── masteryTracker.ts             ← تتبع الإتقان — معزول (418)
├── problemGenerator.ts           ← مولّد المسائل — معزول (446)
└── adaptiveEngine.ts             ← المحرك التكيفي — معزول (1071)
```

الحالة:

· adaptiveEngine ما زال على bank-linked (القديم).
· masteryTracker يُستخدم من adaptiveEngine (داخليًا).
· sorobanMoves + sorobanEngine يُستخدمان من SorobanEngineDebug.

القرار:

· 🔒 sorobanEngine + sorobanMoves مجمّدان.
· 🔴 adaptiveEngine + problemGenerator يحتاجان ترحيلًا (المرحلة 5).

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
│   │   └── L0.ts → L7.ts
│   └── exam/                     ← Bank B (666)
│       └── L0.ts → L7.ts
│
├── srb-adapter.ts                ← Barrel file · 5 مستوردين
│
├── bank.ts                       ← 🔴 ميت (1200)
├── bank-linked.ts                ← 🟡 معزول (475)
├── bank-adapter.ts               ← 🟡 معزول (375)
├── bank-v2/                      ← 🟡 للقطع (583 سؤالًا)
├── bank-raw/                     ← 🟡 للقطع (~600)
├── curriculum.ts                 ← 🔴 ميت (312)
├── modes.ts                      ← نشط (76)
└── index.ts                      ← 🔴 معزول (189 — يحتوي BADGES)
```

7.7 src/store/

```text
store/
├── progressStore.ts              ← المتجر الرئيسي (561) — يبقى
├── masteryBadgesStore.ts         ← شارات الإتقان (123)
└── numberStyleStore.ts           ← نمط الأرقام (29)
```

الحالة:

· ✅ progressStore — مصدر موحّد · 26 action · version 5.
· ✅ masteryBadgesStore — يعمل · 3 شاشات.
· ✅ numberStyleStore — 15 ملفًا.

7.8 src/utils/

```text
utils/
├── numberStyle.ts                ← تنسيق الأرقام · 14 مستوردًا ✅ (82)
├── arabicNumbers.ts              ← كلمات عربية · للصوت ✅ (163)
├── numerals.ts                   ← 🔴 نسخة قديمة (126)
├── previewMode.ts                ← [FIX 7] ✅ (32)
├── anzanBadges.ts                ← 🔴 يُستورد من badgeChecker (34)
├── audioAnzanBadges.ts           ← 🔴 ميت (27)
├── badgeChecker.ts               ← 🔴 ميت (112)
├── skillsChecker.ts              ← 🔴 ميت (176)
└── certificateGenerator.ts       ← ✅ 3 مستخدمين (127)
```

المطلوب (المرحلة 1):

· حذف 7 ملفات ميتة (~2,176 سطرًا).

7.9 src/hooks/

```text
hooks/
├── useGameStats.ts               ← Adapter SRB ✅ (98)
├── useSound.ts                   ← ✅ (85)
├── useConfetti.ts                ← ✅ (42)
├── useSpeech.ts                  ← ✅ (102)
├── useSorobanaVoice.ts           ← ✅ (396)
├── useQuests.ts                  ← 🟡 مفاتيح قديمة (148)
├── useCharacterVoice.ts          ← ✅ (94)
└── useQuests.ts                  ← 🟡
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
16 PlacementTestScreen 🔴 يستورد من bank-v2
17 CategoryExamScreen 🔴 يستورد من bank-v2
18 SorobanPlayground ✅
19 Header ✅
20 CertificateScreen ✅ مربوط
21 KidsCertificateScreen ✅
22 RemediationScreen ✅

---

8. التخزين

8.1 المشكلة الأساسية

3 أنظمة تخزين متوازية:

المعلومة progressStore localStorage قديم utils/*.ts
اسم الطفل ✅ ✅ —
المستويات المكتملة ✅ ✅ —
الدروس المكتملة ✅ ⚠️ —
تمارين ناجحة ✅ ✅ —
أنزان بصري ✅ ✅ ✅
أنزان سمعي ✅ ✅ —
شارات الأنزان ✅ ✅ ✅
شارات الأنزان السمعي ✅ ✅ ✅
شارات الإتقان ✅ ✅ —
XP ✅ ✅ —
الستريك ✅ ✅ —
الدرجات ✅ — —
الجلسة العلاجية ✅ — —
سجل العلاجي ✅ — —

النتيجة: المعلومات موزعة على 2-3 أماكن.

8.2 خريطة المفاتيح (37 مفتاحًا)

المجموعة 1 — نظيفة ✅

1. sorobanmind-v2-progress (progressStore الرئيسي)
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
35. soroban-completed-lessons (بـ -) — مكرر خطأً
36. sorobanmind-stats — قديم
37. soroban_exam_result — مفتاح ثالث

⬅️ 4 مفاتيح يتيمة (تُقرأ ولا تُكتب):

· soroban_anzan_stats
· soroban_practice_stats
· sorobanmind-stats
· soroban_exam_result

8.3 الإصلاح الشامل (المرحلة 7)

المبدأ: progressStore + srb_progress = المصدران الوحيدان.

الخطوات:

1. ترحيل soroban_completed_lessons → progressStore.
2. ترحيل soroban_passed_* → progressStore.
3. ترحيل soroban_anzan_badges → progressStore.
4. ترحيل soroban_placement_* → progressStore.
5. ترحيل soroban_exam* → progressStore.
6. إعادة كتابة badgeChecker على progressStore.
7. إعادة كتابة useQuests على progressStore.
8. حذف الملفات الميتة (audioAnzanBadges · skillsChecker).

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
نجاح أنزان بصري عادي لا إعادة
نجاح أنزان بصري فلاش لا إعادة
نجاح أنزان سمعي لا إعادة
نجاح اختبار المستوى لا إعادة
رسوب اختبار إعادة بعد فترة انتظار

⬅️ فترة الانتظار:

· اختبار مستوى (X): 24 ساعة (L0_TEST_COOLDOWN_MS).
· امتحان قسم + Placement: 48 ساعة (EXAM_COOLDOWN_MS).

9.5 الشهادات

الوضع الحالي:

· ✅ KidsCertificateScreen — مربوط.
· ✅ CertificateScreen — مربوط (جلسة 20).

المحتوى:

· اسم الطفل.
· الدرجات الأربعة.
· العلامة النهائية.
· الميدالية.
· رقم الشهادة.
· التاريخ + رابط التحقق.
· 🆕 وضع المعاينة — درجات افتراضية (95% · 92%).

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

الخصائص:

· بلا درجات.
· إظهار الحل فورًا.
· مخصصة لـm ضعيف.
· يجب إعادة قياس Accuracy · Speed · Consecutive قبل إزالة الضعف.

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

10.3 👁️ وضع المعاينة (FIX 7 — جلسة 20)

الحل الجديد — بدل زر "فتح الكل" القديم:

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
    · Exam: لا تُلمس بيانات الطفل الحقيقية
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

· data/srb/ ← 9 ملفات + 16 ملف أسئلة.
· data/srb-adapter.ts ← 5 شاشات.

🏦 البنوك القديمة:

· data/bank-v2/ ← CategoryExam · PlacementTest.
· data/bank-raw/ ← bank-v2/bank-exam + bank-adapter.
· data/bank-linked.ts ← adaptiveEngine · problemGenerator.

🧠 المحرك (5 ملفات — معزولة):

· استخدام داخلي بين الملفات نفسها.

📦 المتاجر:

· progressStore.ts ← 7+ مستوردين.
· masteryBadgesStore.ts ← GuardianDashboard · useGameStats.
· numberStyleStore.ts ← 15 شاشة.

11.2 خريطة البنوك

```text
bank-raw/ (~600 سؤال — 7 ملفات)
        ↓
bank-v2/ (583 سؤال — 4 parts + امتحانات)
        ↓
bank-linked.ts ← يجمع v2 + raw
        ↓
adaptiveEngine.ts · problemGenerator.ts (معزول)
```

من يستورد من bank-v2:

· CategoryExamScreen.tsx
· PlacementTestScreen.tsx

من يستورد من bank-linked:

· adaptiveEngine.ts
· problemGenerator.ts

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

12.2 الحالة الحالية — الفجوة

موجود:

# العنصر الموقع
1 نوع Attempt curriculum/types.ts
2 دالة createAttempt() engine/masteryTracker.ts:177
3 دالة recordAttempt() store/progressStore.ts:394
4 حقول skillProgress progressStore

مفقود:

# العنصر
1 استدعاء recordAttempt من الشاشات
2 استدعاء createAttempt عند كل إجابة

⬅️ النتيجة: skillProgress فارغ · التطبيق "أعمى" · لا تكييف.

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

12.4 التصميم في التمارين (4 أسطر)

```ts
const isCorrect = userAnswer === currentQ.result;
const timeMs = Date.now() - questionStartTime;

const attempt = createAttempt(currentQ.skillId, userAnswer, currentQ.result, timeMs);
useProgressStore.getState().recordAttempt(attempt);
```

⬅️ نفس المنطق في 5 شاشات:

· PracticeScreen.tsx — phase: "P"
· AnzanScreen.tsx — phase: "ANZ-V" / "ANZ-F"
· AudioAnzanScreen.tsx — phase: "ANZ-A"
· CategoryExamScreen.tsx — phase: "CE"
· PlacementTestScreen.tsx — phase: "PT"

12.5 الفائدة

قبل:

```text
سؤال → إجابة → سؤال عشوائي
```

بعد:

```text
سؤال → قياس → كشف ضعف → علاج → قياس → إتقان → تقدم
```

⬅️ التفاصيل الكاملة في AL-ISLAH-V2.md — القسم 12.

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

13.2 الملفات التي تحتاج تعديلًا

# الملف الحالة
~~1~~ ~~CategoryExamScreen.tsx~~ ✅ تم (N60)
~~2~~ ~~PlacementTestScreen.tsx~~ ✅ تم (N60-ب)
3 srb/questions/L6.ts ⏳ الأسئلة الـ25
4 AnzanScreen.getColumnsForQuestion ⏳ القاعدة الجديدة
5 PracticeScreen ⏳ القاعدة الجديدة
6 AudioAnzanScreen ⏳ يحتاج فحص
7 LevelTestScreen ⏳ بعد نقل X إلى Bank B

---

14. الحالة الحالية

14.1 ما يعمل ✅

العنصر الحالة
Bank A (تمارين · أنزان) ✅ 275 سؤالًا · يعمل
Bank B (امتحانات) 🟡 666 سؤالًا · معزول
المنهج (بنية) ✅ 8 مستويات · 15 درسًا · 51 m
درس المقدمة ✅ 7 صفحات · SVG متحركة
القفل المتتابع ✅ يعمل
التمرّن والأنزان ✅ يعملان من Bank A
التنقل بين المستويات ✅ يعمل
الجلسة العلاجية ✅ مربوطة
GuardianDashboard ✅ يقرأ من progressStore
النسخ الاحتياطي ✅ يعمل (JSON)
وضع المعاينة ✅ يعمل (FIX 7)
البناء ✅ أخضر
الشهادات ✅ Kids + Adults
XP ✅ يعمل في كل الشاشات
العشرية ✅ في CE1 · CE2 · PT
الأنزان البصري (AND) ✅ موحّد
LevelId ✅ آمن

14.2 أخطاء مؤكدة 🔴 (جلسة 24)

# الخطأ الملف الأثر
1 getAnzanBadgeKey خاطئ AnzanScreen:103 شارات خاطئة (S05-S10)
2 recordAttempt لا يُستدعى 5 شاشات skillProgress فارغ
3 srb-adapter 3 دوال معطوبة srb-adapter.ts Bank B معزول
4 فجوة UI — 3 شارات GuardianDashboard شارات مخفية
5 BADGES معزولة data/index.ts 8 شارات مخفية

14.3 ما يحتاج إصلاحًا 🟡

العنصر المشكلة
LevelTestScreen يستخدم buildL0Test
passedLevelTests غير تفاعلي
exam2Passed · examPassed ميتان في HeroDashboard
badgeChecker · useQuests مفاتيح ميتة
37 مفتاح localStorage موزّعة · مكررة · ميتة
audioAnzanBadges · skillsChecker ملفان ميتان
TTS للإنجليزية لم يُنفَّذ
LessonScreen لا يقرأ اللغة الحالية

14.4 ما لم يُبنَ بعد 🟡

العنصر الحالة
srb/exam/ الطبقات (constants · examBuilder · placementEngine · index) 🔴
ربط Bank B بالشاشات الثلاث 🔴
دروس L2-L7 🔴
Attempt Record 🔴
masteryTracker 🔴
adaptiveEngine 🔴
ترجمة كاملة + زر 🟡 65%
TTS للإنجليزية 🟡 مؤجل

14.5 ✅ ما أُنجز في جلسة 24

الفحص الشامل:

· ✅ audit.yml — فحص آلي عبر GitHub Actions.
· ✅ 4 تقارير فحص.
· ✅ جرد كامل للبنوك · الشاشات · المفاتيح · الأنظمة.
· ✅ اكتشاف Bank A vs Bank B.
· ✅ اكتشاف 5 أخطاء حرجة جديدة.
· ✅ توثيق ~2,176 سطر كود ميت.
· ✅ AL-ISLAH-V2.md — الوثيقة الشاملة.
· ✅ خطة 7 مراحل واضحة.

---

15. الخطة — 7 مراحل

⬅️ التفاصيل الكاملة في AL-ISLAH-V2.md — القسم 10.

المرحلة المهمة الوقت الحالة
0 التوثيق (AL-ISLAH-V2) يوم ✅ مكتمل
1 التنظيف الآمن (~2,176 سطر) يومان ⏳
2 إصلاح الأخطاء + ربط BADGES يومان ⏳
3 Attempt Record (4 أسطر × 5 شاشات) أسبوع ⏳
4 ربط Bank B بالشاشات أسبوع ⏳
5 ترحيل adaptiveEngine أسبوع ⏳
6 إكمال الترجمة أسبوع ⏳
7 التنظيف النهائي + الإصدار أسبوع ⏳

⬅️ المجموع: 6 أسابيع.

📋 تفاصيل المراحل

المرحلة 1 — التنظيف الآمن (يومان):

· حذف 7 ملفات ميتة (~2,176 سطرًا).
· فحص data/index.ts قبل الحذف (يحتوي BADGES).
· Tag احتياطي: pre-phase-1 → post-phase-1.

المرحلة 2 — إصلاح الأخطاء + BADGES (يومان):

· إصلاح getAnzanBadgeKey في AnzanScreen + AudioAnzanScreen.
· إصلاح فجوة UI (3 شارات).
· ربط BADGES الـ8 في GuardianDashboard (بلا ملف جديد).
· إضافة حقل earnedAchievements في progressStore.

المرحلة 3 — Attempt Record (أسبوع):

· 4 أسطر في 5 شاشات.
· اختبار skillProgress يمتلئ.
· تفعيل masteryTracker.

المرحلة 4 — ربط Bank B (أسبوع):

· بناء srb/exam/index.ts · constants.ts · examBuilder.ts · placementEngine.ts.
· إصلاح 3 دوال في srb-adapter.ts.
· ربط 3 شاشات.
· Parity Test.

المرحلة 5 — ترحيل adaptiveEngine (أسبوع):

· تعديل adaptiveEngine.ts: bank-linked → srb-adapter.
· تعديل problemGenerator.ts: نفس الشيء.
· تطبيق 70/30.

المرحلة 6 — إكمال الترجمة (أسبوع):

· زر LanguageToggle في Header.
· ربط useT في الشاشات.
· ترحيل النصوص.

المرحلة 7 — التنظيف النهائي (أسبوع):

· حذف bank-v2/ · bank-raw/ · bank-linked.ts · bank-adapter.ts.
· حذف data/index.ts (بعد فحص).
· PWA · اختبار · نشر.

---

16. المشاكل المعروفة

16.1 حرجة — لم تُحلّ

# المشكلة
1 getAnzanBadgeKey خطأ (S05-S10)
2 recordAttempt لا يُستدعى
3 srb-adapter 3 دوال معطوبة
4 فجوة UI — 3 شارات
5 BADGES معزولة
6 دروس L2-L7 مفقودة
7 srb/exam/ الطبقات ناقصة

16.2 متوسطة

# المشكلة
8 LevelTestScreen يستخدم buildL0Test
9 passedLevelTests غير تفاعلي
10 4 مفاتيح يتيمة
11 badgeChecker · useQuests — مفاتيح ميتة
12 5 أنماط لحالة الامتحان

16.3 بسيطة

# المشكلة
13 SRBModule محدود بـm1-m10
14 i18n مفاتيح قديمة
15 LessonScreen لا يقرأ اللغة

✅ مُصلحة في الجلسات 20-22

· ~~XP مفقود (N42)~~ ✅
· ~~B1 — reload() ميت~~ ✅
· ~~B4 — AND × OR~~ ✅
· ~~B5 — Number(level.slice(1))~~ ✅
· ~~B9 — recordPlacementAttempt ميت~~ ✅
· ~~N60 · N60-ب — العشرية~~ ✅
· ~~زر "فتح الكل"~~ ✅ (FIX 7)
· ~~CertificateScreen غير مستدعى~~ ✅
· ~~soroban_dev_preview مخفي~~ ✅
· ~~N62 — فصل الإتمام~~ ✅
· ~~N63 — الجلسة العلاجية~~ ✅
· ~~N68 — قفل الوضع~~ ✅
· ~~N69 — isMandatory~~ ✅
· ~~N61 — عرض الدرجات في Category~~ ✅

⬅️ التفاصيل الكاملة مع الأدلة في AL-ISLAH-V2.md.

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
AL-ISLAH-V2.md ⚠️ وثيقة الفحص الشامل
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
2. مراجعة AL-ISLAH-V2.md — كاملًا.
3. اسأل قبل التنفيذ — لا افتراضات.

القواعد الذهبية — 14 قاعدة

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
```

مبدأ التعامل

· الكود الفعلي هو الحقيقة — لا الملفات النصية.
· AL-ISLAH-V2.md = الدرع الحامي.
· اسأل قبل التنفيذ.
· الخطة أهم من البناء السريع.

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

آخر تحديث: 2026-10-07 — نهاية الجلسة 24

الحالة: 🟢 البناء أخضر · Bank A و B مكتملان · 5 أخطاء حرجة موثّقة · المرحلة 0 مكتملة

المرجع الأساسي: AL-ISLAH-V2.md

</div>

</div>
```