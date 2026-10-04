📄 PROJECT_MASTER.md — النسخة المحدّثة والمتوافقة مع AL-ISLAH.md

```markdown
<div dir="rtl">

# 🧮 SorobanMind v2 — المرجع الموحّد

> **آخر تحديث:** 2026-10-04 — بعد الفحص الشامل (GPT · Claude · فحص يدوي)
> **الحالة:** 🟢 البناء #684 أخضر · التطبيق منشور · AL-ISLAH.md مرجع الحماية
> **القاعدة الذهبية:** لا حذف إلا ما أُلغي صريحًا
> **المرجع الأساسي:** [`AL-ISLAH.md`](./AL-ISLAH.md) — وثيقة الحماية والإصلاح

---

## 📑 فهرس المرجع

1. [نظرة عامة](#1-نظرة-عامة)
2. [الرؤية والأهداف](#2-الرؤية-والأهداف)
3. [القواعد الذهبية](#3-القواعد-الذهبية)
4. [المنهج](#4-المنهج)
5. [بنك SRB](#5-بنك-srb)
6. [البنية التقنية](#6-البنية-التقنية)
7. [بنية الملفات ووظائفها](#7-بنية-الملفات-ووظائفها)
8. [التخزين](#8-التخزين)
9. [نظام التقييم](#9-نظام-التقييم)
10. [نظام القفل والفتح](#10-نظام-القفل-والفتح)
11. [خريطة الترابط](#11-خريطة-الترابط)
12. [**Attempt Record — الحلقة المفقودة**](#12-attempt-record)
13. [**قواعد العشرية**](#13-قواعد-العشرية)
14. [الحالة الحالية](#14-الحالة-الحالية)
15. [خطة العمل — 12 مرحلة](#15-خطة-العمل)
16. [المشاكل المعروفة](#16-المشاكل-المعروفة)
17. [المصادر والمراجع](#17-المصادر-والمراجع)

---

## 1. نظرة عامة

| العنصر | التفاصيل |
|---|---|
| **الاسم** | SorobanMind v2 (أكاديمية السوروبان الدولية) |
| **النوع** | تطبيق تعليمي عربي تفاعلي |
| **الهدف** | تعليم السوروبان الياباني (منهج تاكاشي كوجيما) للأطفال والكبار |

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
| `AL-ISLAH.md` | ⚠️ **وثيقة الحماية والإصلاح — اقرأها أولًا** |
| `ACHIEVEMENTS.md` | سجل الجلسات |
| `PROJECT_PLAN.md` | المخطط المعماري للانتقال |

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
- **تعليم تكيفي** — يكشف نقاط الضعف ويبني جلسات علاجية
- **بنك SRB الموحّد** — كل الأسئلة مصنّفة بدقة
- **4 رفقاء** (شام · ريان · جود · بانة)
- **نظام شارات** (🥉 برونزية · 🥈 فضية · 🥇 ذهبية)
- **إثراء تفاعلي** (أسرار سحرية · رياضيات الأصابع · رياضيات فيدية)
- **شهادات** بعد اجتياز الامتحانات
- **تحديد مستوى ذكي** للطلاب الجدد
- **سوروبان تفاعلي 2D5**
- **درس مقدمة بصور SVG متحركة**
- **بنية ترجمة للدروس** (`LocalizableText`)

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

### القواعد الحرجة (11-14) — من AL-ISLAH

11. ❌ **حذف سطر من AL-ISLAH.md بدون دليل مصور**.
12. ❌ **إصلاحات بنيوية دون قراءة قسم "مقصود"** في AL-ISLAH.
13. ❌ **حذف `badgeChecker.ts` · `useQuests.ts`** قبل إعادة كتابة الشارات على `progressStore`.
14. ❌ **حذف/استبدال/إعادة بناء `progressStore.ts`** — يبقى دائمًا.

### 📌 حقائق مؤكدة (بأدلة مصورة — 24 دليلًا)

- **37 مفتاح localStorage** (لا 35).
- **بنك bank-v2 = 583 سؤالًا** (لا 935).
- **bank-exam = 370 سؤالًا** (180 + 190).
- **4 مفاتيح يتيمة** (تُقرأ ولا تُكتب).
- **`src/engine/` = 5 ملفات** = أساس المستقبل — لم يُبنَ بعد.

---

## 4. المنهج

### البنية الحالية

**8 مستويات · 15 درسًا · 51 مهارة (m)**

| المستوى | الاسم | الدروس | عدد m | الفئة |
|---|---|---|---|---|
| **L0** | التمهيدي | intro · S01 · S02 | 5 | 🧒 |
| **L1** | الجمع والطرح | S03 · S04 | 8 | 🧒 |
| **L2** | الضرب | S07 · S08 | 8 | 🧒 |
| **L3** | القسمة | S09 · S10 | 8 | 🧒 |
| **L4** | سلاسل الجمع والطرح | S05 · S06 | 8 | 🧑 |
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
- **S07** (ضرب 1×2): m1-m4
- **S08** (ضرب 2×2): m1-m4

**L3 — القسمة:**
- **S09** (÷1): m1-m4
- **S10** (÷2): m1-m4

**L4 — سلاسل:**
- **S05** (سلاسل الجمع): m1-m4
- **S06** (سلاسل الطرح): m1-m4

**L5 — ضرب وقسمة متقدم:**
- **S11** (ضرب 2×3): m1-m4
- **S12** (قسمة متقدمة): m1-m4

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

## 5. بنك SRB

### الفكرة

بنك الأسئلة الوحيد المعتمد — كل سؤال مصنّف بدقة.

### الصيغة

```text
SRB-L{0-7}-S{01-15}-m{n}-A{001}
```

مثال: SRB-L0-S01-m1-A001

البنية

```text
src/data/srb/
├── types.ts              ✅ الأنواع
├── generateId.ts         ✅ مولّد ID
├── curriculum.ts         ✅ 8 مستويات
├── modules.ts            ✅ 51 m
├── sessionBuilder.ts     ✅ مولّد الجلسات
├── progress.ts           ✅ تخزين srb_progress
├── remediation.ts        ✅ الجلسة العلاجية
├── index.ts              ✅ نقطة الوصول
├── questions/
│   └── L0.ts → L7.ts     ✅ 8 ملفات — 275 سؤالًا
└── exams/                🔴 لم يُبنَ بعد
    ├── CE1.ts            (امتحان القسم 1 — قيد البناء)
    ├── CE2.ts            (امتحان القسم 2 — قيد البناء)
    └── PT.ts             (تحديد المستوى — قيد البناء)
```

نظام المراحل (Phases)

الرمز الاسم يُسجَّل؟
E شاهد ❌
T جرّب ❌
P تمرّن ✅
ANZ-V أنزان بصري عادي ✅
ANZ-F أنزان Flash ✅
ANZ-A أنزان سمعي ✅
X اختبار المستوى ✅
CE امتحان القسم ⚠️ نوع موجود · تطبيق قيد البناء
PT تحديد المستوى ⚠️ نوع موجود · تطبيق قيد البناء
EN الإثراء ❌

بنية السؤال

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
· variant: A = أساسي · B = متقدم (للمستقبل).

الـ movements الممكنة

القيمة المعنى
direct حركة مباشرة
five-friend-add صديق 5 (جمع)
five-friend-sub صديق 5 (طرح)
ten-friend-add صديق 10 (جمع)
ten-friend-sub صديق 10 (طرح)
carry حمل
borrow استلاف
mixed مختلط

قاعدة الجلسة

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
│   ├── images/           6 ملفات SVG متحركة
│   └── stories/          10 ملفات قصص
├── src/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── README.md
├── PROJECT_MASTER.md     ← هذا الملف
├── AL-ISLAH.md           ← وثيقة الحماية
├── PROJECT_PLAN.md       ← المخطط المعماري
└── ACHIEVEMENTS.md       ← سجل الجلسات
```

7.1.1 public/images/ — ملفات SVG

```text
public/images/
├── soroban-13.svg                        (قديم — للتوافق)
├── soroban-welcome-animated.svg          ✅ (p1)
├── soroban-story-animated.svg            ✅ (p2)
├── soroban-parts-animated.svg            ✅ (p3)
├── soroban-rule-animated.svg             ✅ (p4)
├── soroban-benefits-animated.svg         ✅ (p6)
├── soroban-ready-animated.svg            ✅ (p7)
├── soroban-numbers-0-4-animated.svg      ✅ (جلسة 15)
├── soroban-number-5-animated.svg         ✅ (جلسة 15)
└── soroban-pinch-animated.svg            ✅ (جلسة 15)
```

ملاحظة: جميع الصور تُستدعى عبر import.meta.env.BASE_URL — إصلاح جلسة 14.

7.2 البنية العامة لـ src/

```text
src/
├── App.tsx                       ← البوابة الرئيسية
├── types.ts                      ← الأنواع العامة
├── i18n/                         ← الترجمة
├── curriculum/                   ← المنهج (الدروس النصية)
├── engine/                       ← المحرك (5 ملفات · أساس المستقبل)
├── data/                         ← البيانات (SRB + البنوك)
├── store/                        ← المتاجر (Zustand)
├── utils/                        ← الأدوات المساعدة
├── hooks/                        ← الخطافات
├── components/                   ← المكوّنات
└── screens/                      ← الشاشات (22)
```

7.3 src/i18n/

```text
i18n/
├── ar.ts                         ← القاموس العربي (~312 سطرًا)
├── en.ts                         ← القاموس الإنجليزي
├── index.ts                      ← translate + Language type
└── useTranslation.ts             ← useT hook + useLangStore
```

الحالة:

· ✅ البنية سليمة (واجهة فقط).
· ⚠️ لا يدعم نصوص الدروس — يحتاج بناء منفصل.
· ⚠️ مفاتيح قديمة (level.15 إلى level.20) تحتاج مراجعة.

7.4 src/curriculum/

```text
curriculum/
├── types.ts                      ← عقد أساسي — مجمّد
└── lessons/
    ├── index.ts                  ← الفهرس الموحّد
    ├── types.ts                  ← أنواع الدروس (معدّل جلسة 14)
    ├── L0/
    │   ├── intro.ts              ← مقدمة L0
    │   ├── S01.ts                ← تمثيل الأرقام
    │   ├── S02.ts                ← القيمة المكانية
    │   └── test-pool.ts          ← أسئلة اختبار L0
    └── L1/
        ├── S03.ts                ← الجمع
        └── S04.ts                ← الطرح
```

الحالة:

· ✅ L0 مكتمل (4 ملفات).
· ✅ L1 مكتمل (2 ملفين).
· 🔴 L2-L7 مفقودة.

7.5 src/engine/ — 5 ملفات (أساس المستقبل)

```text
engine/
├── sorobanMoves.ts               ← قواعد الحركات — 🔒 مجمّد
├── sorobanEngine.ts              ← محرك الحساب — 🔒 مجمّد
├── masteryTracker.ts             ← تتبع الإتقان — أساس المستقبل
├── problemGenerator.ts           ← مولّد المسائل — أساس المستقبل
└── adaptiveEngine.ts             ← المحرك التكيفي — أساس المستقبل
```

الحالة:

· أساس المستقبل — لم يُبنَ بالكامل.
· masteryTracker مستخدم من adaptiveEngine:71 (استخدام داخلي).
· sorobanMoves مستخدم من sorobanEngine:15 + SorobanEngineDebug:18.
· لا يمس التدريبات أو الأنزان.

القرار:

· 🔒 مجمّد حاليًا.
· 📌 يُدمج مع SRB بعد Attempt Record (المرحلة 9).

7.6 src/data/

```text
data/
├── srb/                          ← بنك الأسئلة الجديد (المعتمد)
│   ├── types.ts
│   ├── generateId.ts
│   ├── curriculum.ts
│   ├── modules.ts
│   ├── sessionBuilder.ts
│   ├── progress.ts
│   ├── remediation.ts
│   ├── index.ts
│   ├── questions/                (8 ملفات — 275 سؤالًا)
│   └── exams/                    🔴 قيد البناء
│
├── srb-adapter.ts                ← واجهة موحّدة SRB ✅ مستقل
│
├── bank.ts                       ← v1 — معزول تمامًا
├── bank-linked.ts                ← يربط v2 + raw — 🟡
├── bank-adapter.ts               ← مربوط بـ bank-linked
├── bank-v2/                      ← 583 سؤالًا — 🟡 للامتحانات
├── bank-raw/                     ← 400 سؤال — 🟡 لتحديد المستوى
├── curriculum.ts                 ← بيانات المنهج القديم
├── modes.ts                      ← أنماط اللعب
└── index.ts                      ← نقطة الوصول
```

الحالة:

· ✅ SRB مكتمل ومستقل تمامًا.
· 🔴 srb/exams/ قيد البناء.
· 🟡 البنوك القديمة تنتظر النقل.

7.7 src/store/

```text
store/
├── progressStore.ts              ← المتجر الرئيسي — يبقى دائمًا
├── masteryBadgesStore.ts         ← شارات الإتقان
└── numberStyleStore.ts           ← نمط الأرقام
```

الحالة:

· ✅ progressStore موجود — مصدر موحّد.
· ✅ 7+ مستوردين.
· ⚠️ 12 شاشة تكتب فيه (جلسة 13).

7.8 src/utils/

```text
utils/
├── numberStyle.ts                ← تنسيق الأرقام ✅
├── arabicNumbers.ts              ← تحويل الرقم لكلمات ✅
├── numerals.ts                   ← أدوات الأرقام ✅
├── anzanBadges.ts                ← 🟡 مصدر قديم معزول
├── audioAnzanBadges.ts           ← 🔴 ملف ميت — صفر استيراد
├── badgeChecker.ts               ← 🟡 مستخدم · يقرأ من مصدر مهجور
├── skillsChecker.ts              ← 🔴 ملف ميت — صفر استيراد
└── certificateGenerator.ts       ← ✅ مستخدم من 3 ملفات
```

المطلوب (المرحلة 11):

· حذف audioAnzanBadges.ts · skillsChecker.ts (ميتان).
· إعادة كتابة badgeChecker.ts على progressStore.
· توحيد AnzanBadges (3 تعريفات → 1).

7.9 src/hooks/

```text
hooks/
├── useGameStats.ts               ← Adapter فوق progressStore ✅
├── useSound.ts                   ← تشغيل الأصوات ✅
├── useConfetti.ts                ← الاحتفالات ✅
├── useSpeech.ts                  ← النطق الصوتي ✅
├── useSorobanaVoice.ts           ← صوت سوروبانا ✅
├── useQuests.ts                  ← 🟡 يستخدم مفاتيح قديمة
└── (2 خطافات أخرى)
```

المطلوب (المرحلة 11):

· إعادة كتابة useQuests على progressStore.

7.10 src/components/

```text
components/
├── AdaptiveFeedback.tsx          ← 🔴 يقرأ من skillProgress (فارغ)
├── SorobanaCompanion.tsx         ← رفيق سوروبانا ✅
├── FloatingCompanion.tsx         ← الرفيق العائم ✅
├── DebugOverlay.tsx              ← لوحة المطور ✅
├── SorobanEngineDebug.tsx        ← لوحة المحرك ✅
├── soroban2d5/                   ← السوروبان التفاعلي ✅
│   ├── Soroban2D5.tsx
│   ├── Rod2D5.tsx
│   ├── Bead2D5.tsx
│   ├── useSorobanLogic.ts
│   ├── useBeadSound.ts
│   └── useBeadHaptics.ts
├── CertificateLogo.tsx           ← ✅
├── CertificateMedal.tsx          ← ✅
└── (~12 مكوّن آخر)
```

7.11 src/screens/ — 22 شاشة

# الشاشة الحالة
1 WelcomeScreen ✅
2 RoleSelection ✅
3 HeroDashboard ✅ (يقرأ exam2Passed — ميت)
4 GuardianDashboard ✅ (يقرأ من progressStore)
5 CategoryScreen ✅
6 LevelScreen ✅
7 LearnScreen ✅
8 LessonScreen ✅
9 IntroductionScreen ✅
10 LevelTestScreen 🔴 يستخدم buildL0Test لكل المستويات
11 FingerMathScreen ✅
12 MagicSecretsScreen ✅
13 PracticeScreen ✅ (يحتاج Attempt Record)
14 AnzanScreen ✅ (يحتاج Attempt Record)
15 AudioAnzanScreen ✅ (يحتاج Attempt Record)
16 PlacementTestScreen 🔴 يستورد من bank-v2
17 CategoryExamScreen 🔴 يستورد من bank-v2
18 SorobanPlayground ✅
19 CrossMultiplicationScreen 🟡 غير مربوط
20 CertificateScreen 🟡 غير مستدعى
21 KidsCertificateScreen ✅ (جلسة 15)
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

# المفتاح
1 sorobanmind-v2-progress
2 sorobanmind-v2-lang
3 soroban_mastery_badges
4 srb_progress

المجموعة 2 — مكررة 🟡

# المفتاح
5 soroban_child_name · soroban_child_full_name
6 soroban_companion · CHARACTER_STORAGE_KEY
7 soroban_number_style

المجموعة 3 — التقدم الرئيسية 🔴

# المفتاح يُكتب من يُقرأ من
8 soroban_completed_lessons App · LessonScreen App · useQuests · badgeChecker
9 soroban_completed_levels HeroDashboard · CategoryExamScreen CategoryScreen · LevelScreen
10 soroban_passed_practice HeroDashboard · App.tsx CategoryScreen · LevelScreen
11 soroban_passed_anzan_visual HeroDashboard CategoryScreen · LevelScreen
12 soroban_passed_anzan_audio HeroDashboard CategoryScreen · LevelScreen

المجموعة 4 — الامتحانات 🔴

# المفتاح
13 soroban_passed_level_tests
14 soroban_exam1_passed · soroban_exam2_passed
15 soroban_exam1_score · soroban_exam2_score
16 soroban_exam1_last_attempt · soroban_exam2_last_attempt
17 soroban_exam_result
18 soroban_weak_skills_v2
19 soroban_section2_unlocked

المجموعة 5 — إحصاءات وشارات 🔴

# المفتاح
20 soroban_anzan_stats
21 soroban_practice_stats
22 soroban_anzan_badges
23 soroban_anzan_audio_badges

المجموعة 6 — ثانوية ✅

# المفتاح
24 soroban_unlocked_secrets · soroban_secrets_best_scores
25 soroban_welcome_seen
26 soroban_completed_enrichment

المجموعة 7 — مؤقتة 🟡

# المفتاح
27 soroban_placement_recommended
28 soroban_placement_weak_skills
29 soroban_placement_last_attempt
30 soroban_placement_result
31 soroban_level_test_last_attempt_L0
32 soroban_lesson_session_*

🚨 المفاتيح الحرجة:

# المفتاح المشكلة
33 soroban-kids_certificate_ready يُكتب ولا يُقرأ
34 soroban_dev_preview مفتاح مخفي
35 soroban-completed-lessons (بـ -) مكرر خطأً — يبحث فيه badgeChecker + useQuests
36 sorobanmind-stats قديم — موجود في badgeChecker + useQuests
37 soroban_exam_result مفتاح ثالث لحالة الامتحان

⬅️ 4 مفاتيح يتيمة (تُقرأ ولا تُكتب):

· soroban_anzan_stats
· soroban_practice_stats
· sorobanmind-stats
· soroban_exam_result

8.3 الإصلاح الشامل (المرحلة 11)

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
9. توحيد AnzanBadges (N55).

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

· KidsCertificateScreen — موجود (جلسة 15) · يحتاج ربط.
· CertificateScreen — موجود · غير مستدعى.

المطلوب:

· شهادة قسم الصغار (L0-L3).
· شهادة قسم الكبار (L4-L7).

المحتوى:

· اسم الطفل.
· الدرجات الأربعة.
· العلامة النهائية.
· الميدالية.
· رقم الشهادة.
· التاريخ + رابط التحقق.

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
· مخصصة لـ m ضعيف.
· يجب إعادة قياس Accuracy · Speed · Consecutive قبل إزالة الضعف.

---

10. نظام القفل والفتح

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

10.3 زر "فتح الكل" (GuardianDashboard)

مشكلة حالية: الزر يُقفل الأقسام بدل فتحها — يعطّل المعاينة.

الحل (المرحلة 3):

· فصل "وضع المعاينة" عن الحالة الحقيقية.
· حالة preview مؤقتة.
· الخروج يرجع الحالة الأصلية.

---

11. خريطة الترابط

11.1 خريطة الملفات

📚 المنهج:

· curriculum/types.ts ← 14 مستوردًا (مجمّد).
· curriculum/lessons/types.ts ← 5 مستوردين.
· curriculum/lessons/index.ts ← 4 شاشات.

🏦 بنك SRB (مستقل ✅):

· data/srb/ ← 9 ملفات + 8 ملفات أسئلة.
· data/srb-adapter.ts ← 5 شاشات.

🏦 البنوك القديمة:

· data/bank-v2/ ← CategoryExam · PlacementTest.
· data/bank-raw/ ← bank-v2/bank-exam + bank-adapter.
· data/bank-linked.ts ← adaptiveEngine · problemGenerator.

🧠 المحرك (5 ملفات — أساس المستقبل):

· استخدام داخلي بين الملفات نفسها.

📦 المتاجر:

· progressStore.ts ← 7+ مستوردين.
· masteryBadgesStore.ts ← GuardianDashboard · useGameStats.
· numberStyleStore.ts ← كل الشاشات.

11.2 خريطة البنوك

```text
bank-raw/ (400 سؤال — 7 ملفات)
    raw-01 → S1-S3
    ...
    raw-07 → S15-S17
        ↓
bank-v2/ (583 سؤال — 4 parts + امتحانات)
    part-01 → L0-L1
    part-02 → L2-L3
    part-03 → L4-L5
    part-04 → L6-L7
    bank-exam.ts → 370 سؤالًا (180 + 190)
    placement-engine.ts → يستهلك Pools
        ↓
bank-linked.ts ← يجمع v2 + raw
        ↓
adaptiveEngine.ts · problemGenerator.ts (أساس المستقبل)
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
  "skill": "S03-m2",
  "questionId": "L1-S03-m2-017",
  "phase": "P",
  "correct": false,
  "timeMs": 6200
}
```

12.2 الحالة الحالية — الفجوة

موجود:

# العنصر الموقع
1 نوع Attempt curriculum/types.ts
2 دالة createAttempt() engine/masteryTracker.ts
3 دالة recordAttempt() store/progressStore.ts
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

12.4 التصميم في التمارين (3 أسطر)

```ts
const isCorrect = userAnswer === currentQ.result;
const timeMs = Date.now() - questionStartTime;

const attempt = {
  skillId: currentQ.skillId,
  questionId: currentQ.id,
  phase: "P",
  correct: isCorrect,
  timeMs,
  timestamp: Date.now(),
};

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

```
سؤال → إجابة → سؤال عشوائي
```

بعد:

```
سؤال → قياس → كشف ضعف → علاج → قياس → إتقان → تقدم
```

⬅️ التفاصيل الكاملة في AL-ISLAH.md — القسم 6.

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

# الملف السبب
1 srb/questions/L6.ts الأسئلة الـ25
2 AnzanScreen.getColumnsForQuestion القاعدة الجديدة
3 PracticeScreen القاعدة الجديدة
4 AudioAnzanScreen يحتاج فحص + القاعدة
5 CategoryExamScreen N60 + الأعمدة
6 PlacementTestScreen N60-ب + الأعمدة
7 LevelTestScreen بعد نقل X إلى SRB

⬅️ التفاصيل الكاملة في AL-ISLAH.md — القسم 2.

---

14. الحالة الحالية

14.1 ما يعمل ✅

العنصر الحالة
بنك SRB ✅ 275 سؤالًا
المنهج (بنية) ✅ 8 مستويات · 15 درسًا · 51 m
درس المقدمة ✅ 7 صفحات · SVG متحركة
القفل المتتابع ✅ يعمل
التمرّن والأنزان ✅ يعملان من SRB
التنقل بين المستويات ✅ يعمل
الجلسة العلاجية ✅ مربوطة
GuardianDashboard ✅ يقرأ من progressStore
النسخ الاحتياطي ✅ يعمل (JSON)
وضع المعاينة 🟡 يعمل — لكن يُقفل الأقسام
البناء ✅ #684 أخضر
صفحة الهبوط ✅ تعمل باحترافية

14.2 ما يحتاج إصلاحًا 🔴

العنصر المشكلة
XP مفقود 4 شاشات — onXP = console.log
زر "فتح الكل" يُقفل الأقسام بدل فتحها
الأنزان البصري computeFinalScore يقبل OR
Number(level.slice(1)) هشّ مع L00
recordPlacementAttempt ميت
العشرية N60 + N60-ب
الشهادات غير مربوطة
37 مفتاح localStorage موزّعة · مكررة · ميتة
badgeChecker · useQuests مفاتيح ميتة
TTS للإنجليزية لم يُنفَّذ

14.3 ما لم يُبنَ بعد 🟡

العنصر الحالة
srb/exams/ (CE1 · CE2 · PT) 🔴 قيد البناء
دروس L2-L7 🔴 لم تُبنَ
Attempt Record 🔴 غير مفعّل
masteryTracker 🔴 غير مربوط
adaptiveEngine 🔴 غير مفعّل
CrossMultiplicationScreen 🟡 غير مربوط
ترجمة L0 · L1 🟡 قيد التنفيذ
TTS للإنجليزية 🟡 مؤجل

14.4 ما أُنجز في جلسة 15 ✅

· KidsCertificateScreen.tsx — جديد.
· CertificateScreen.tsx — معدّل.
· types.ts — 'kids-certificate' مضاف.
· App.tsx — مسار الشهادة الجديد.
· CategoryExamScreen.tsx — علم soroban_kids_certificate_ready.
· LevelScreen.tsx — قسم «نجاح كامل» بالدرجة الموزونة.
· progressStore.ts — computeFinalScore موزونة.
· 3 SVG جديدة (numbers-0-4 · number-5 · pinch).
· lessons/types.ts — flashSvg · flashAlt · kidTip · *En.

❌ ما فشل:

· S01.ts (commits #682 · #683).

14.5 ما أُنجز في جلسة 16-19 ✅

· فحص شامل (GPT · Claude · 24 دليلًا مصورًا).
· إنشاء AL-ISLAH.md — وثيقة الحماية.
· اكتشاف 36 خطأ مؤكد + 7 مرفوض.
· تصحيح الأرقام: 37 مفتاحًا · 583 سؤالًا · 370 bank-exam.
· تحديد 12 مرحلة للتنفيذ.

---

15. خطة العمل — 12 مرحلة

المرحلة 0 — الحماية (يوم واحد)

# الخطوة
0.1 رفع AL-ISLAH.md إلى المستودع
0.2 Tag: baseline-2026-10-04
0.3 ZIP احتياطي على الجوال

المرحلة 1 — إصلاحات صغيرة (يومان)

# الإصلاح
1.1 N42 — XP مفقود في 4 شاشات
1.2 B1 — حذف reload() الميت
1.3 B4 — توحيد الأنزان البصري (AND + متوسط)
1.4 B5 — فحص LevelId
1.5 B9 — recordPlacementAttempt
1.6 N60 · N60-ب — دالة عشرية مشتركة

المرحلة 2 — توثيق ما يعمل (يوم)

المرحلة 3 — حل زر "فتح الكل" للمعاينة (يوم)

المرحلة 4 — إكمال المنهج (أسبوع)

# المهمة
4.1 إعادة بناء S02
4.2 ترجمة L0 كامل
4.3 ترجمة L1 كامل
4.4 بناء L2 · L3
4.5 بناء L4 · L5
4.6 بناء L6 · L7

المرحلة 5 — الشهادات (يوم)

المرحلة 6 — srb/exams/ (أسبوعان)

المرحلة 7 — Attempt Record (أسبوع)

المرحلة 8 — masteryTracker (يومان)

المرحلة 9 — adaptiveEngine (أسبوع)

المرحلة 10 — تنظيف البنوك القديمة (يومان)

المرحلة 11 — تنظيف عام (أسبوع)

المرحلة 12 — الإصدار (أسبوع)

⬅️ التفاصيل الكاملة في AL-ISLAH.md — القسم 7.

---

16. المشاكل المعروفة

16.1 حرجة (تُكسر وظائف)

# المشكلة
1 XP مفقود في 4 شاشات (N42)
2 زر "فتح الكل" يُقفل الأقسام
3 تعارض AND × OR (B4)
4 دروس L2-L7 مفقودة
5 srb/exams/ غير موجود
6 N60 · N60-ب (العشرية في الامتحانات)

16.2 متوسطة

# المشكلة
7 reload() = reset() (B1)
8 Number(level.slice(1)) (B5)
9 recordPlacementAttempt ميت (B9)
10 HeroDashboard يقرأ مفاتيح ميتة (N52)
11 useQuests يعتمد على مفاتيح قديمة
12 badgeChecker يقرأ من مصدر مهجور
13 4 مفاتيح يتيمة
14 LessonScreen لا يستخدم localize

16.3 بسيطة

# المشكلة
15 SRBModule محدود بـ m1-m10
16 SRBSection محدود بـ S01-S15
17 i18n مفاتيح قديمة
18 CrossMultiplicationScreen غير مربوط
19 CertificateScreen غير مستدعى

⬅️ التفاصيل الكاملة مع الأدلة في AL-ISLAH.md.

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
AL-ISLAH.md ⚠️ وثيقة الحماية — اقرأها أولًا
ACHIEVEMENTS.md سجل الجلسات
PROJECT_PLAN.md المخطط المعماري

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

1. نسخة احتياطية (ZIP).
2. مراجعة AL-ISLAH.md — كاملًا.
3. اسأل قبل التنفيذ — لا افتراضات.

القواعد الذهبية — مُحدَّثة (14 قاعدة)

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
11. لا حذف سطر من AL-ISLAH.md بدون دليل مصور.
12. لا إصلاحات بنيوية دون قراءة قسم "مقصود".
13. لا حذف badgeChecker · useQuests قبل إعادة الكتابة.
14. لا حذف/استبدال/إعادة بناء progressStore.ts.

مبدأ التعامل

· الكود الفعلي هو الحقيقة — لا الملفات النصية.
· AL-ISLAH.md = الدرع الحامي.
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

آخر تحديث: 2026-10-04 — بعد الفحص الشامل

الحالة: 🟢 البناء #684 أخضر · التطبيق منشور · AL-ISLAH.md مرجع الحماية

المرجع الأساسي: AL-ISLAH.md

</div>

</div>
```

---

✅ ملخص ما تم تعديله

# التعديل
1 إضافة مرجع AL-ISLAH.md في الرأس + 4 مواضع
2 تحديث الجلسة: 14 → 19
3 إضافة 4 قواعد ذهبية جديدة (11-14)
4 تحديث الأرقام: 37 مفتاحًا · 583 bank-v2 · 370 bank-exam · 4 يتيمة
5 تصحيح src/engine/ — "أساس المستقبل" لا "معزول"
6 إضافة قسم 12 — Attempt Record كامل
7 إضافة قسم 13 — قواعد العشرية
8 إعادة ترقيم الأقسام (14 → 17)
9 تحديث خارطة الطريق — 12 مرحلة
10 تصحيح B4 — AND + متوسط (لا OR)
11 تحديث الحالة (14.1-14.5)
12 إضافة سجل الجلسة 15-19
13 تحديث المشاكل المعروفة (16.1-16.3)
14 إضافة PROJECT_PLAN.md للمراجع
15 توحيد اللغة مع AL-ISLAH.md
16 إضافة 3 SVG جديدة للـimages
17 تحديث "5 ملفات engine" — مع تفاصيل

---
