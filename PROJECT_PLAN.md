<div dir="rtl">

# 🧮 SorobanMind v2 — المرجع الموحّد

> **آخر تحديث:** 2026-10-04 — نهاية الجلسة 14
> **الحالة:** 🟢 البناء أخضر · المقدمة مكتملة · الترجمة بدأت · S01 جاهز للاختبار
> **القاعدة الذهبية:** لا حذف إلا ما أُلغي صريحًا

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
12. [الحالة الحالية](#12-الحالة-الحالية)
13. [خطة العمل](#13-خطة-العمل)
14. [المشاكل المعروفة](#14-المشاكل-المعروفة)
15. [المصادر والمراجع](#15-المصادر-والمراجع)

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

---

## 2. الرؤية والأهداف

### الرؤية

تعليم السوروبان الياباني الأصيل بالعربية — بتعليم تكيفي يكتشف نقاط ضعف الطالب ويبني له مسارًا مخصصًا.

### الفئتان العمريتان

- 🧒 **الأبطال الصغار** (5-12 سنة) → L0-L3
- 🧑 **الأبطال الكبار** (13+ سنة) → L4-L7

> **ملاحظة الجلسة 14:** العمر مذكور في وصف التطبيق فقط — **لا يُذكر في نصوص الدروس**. الدروس موجّهة للعمر كله.

### الميزات

- **منهج ياباني أصيل** (Takashi Kojima + Japan Soroban Association)
- **تعليم تكيفي** — يكشف نقاط الضعف ويبني جلسات علاجية
- **بنك SRB الموحّد** — كل الأسئلة مصنّفة بدقة
- **4 رفقاء** (شام · ريان · جود · بانة)
- **نظام شارات** (🥉 برونزية · 🥈 فضية · 🥇 ذهبية)
- **إثراء تفاعلي:**
  - 🧒 للصغار: أسرار سحرية + رياضيات الأصابع
  - 🧑 للكبار: أسرار سحرية + رياضيات فيدية (الضرب التقاطعي)
- **شهادة** بعد اجتياز الامتحانات (يحتاج ربطًا)
- **تحديد مستوى ذكي** للطلاب الجدد
- **سوروبان تفاعلي 2D5**
- **درس مقدمة (L0-intro) بصور SVG متحركة** ← جديد جلسة 14
- **بنية ترجمة للدروس** (`LocalizableText`) ← جديد جلسة 14

---

## 3. القواعد الذهبية

> هذه القواعد **لا تُخرَق** أبدًا:

1. **لا حذف** إلا ما أُلغي صريحًا.
2. **المحرك الرياضي مجمّد** (`engine/` — `sorobanEngine.ts` + `sorobanMoves.ts`) — لا يُلمس.
3. **`bank-v2/` + `bank-raw/`** لا يُحذفان قبل فك ارتباط CE1 · CE2 · PT بهما.
4. **`curriculum/types.ts`** مجمَّد — عقد أساسي (14 مستورد).
5. **SRB هو البنك الوحيد** لكل الأسئلة الجديدة.
6. **ملف واحد في المرة** — ثم اختبار.
7. **نسخة احتياطية قبل أي تعديل.**

### قواعد جديدة (اعتُمدت جلسة 14)

8. **رأس موحّد لكل ملف معدّل** — يوثّق: التعديل · الوظيفة · الجلسة · الحالة.
9. **قيد `ACHIEVEMENTS.md` في نهاية الجلسة فقط** — لا مع كل تعديل.
10. **تحديث `PROJECT_MASTER.md`** عند التعديلات البنيوية فقط.

---

## 4. المنهج

### البنية الحالية

**8 مستويات · 15 درسًا · 51 مهارة (m)**

| المستوى | الاسم | الدروس | عدد m | الفئة |
|---|---|---|---|---|
| **L0** | التمهيدي | S01, S02 | 5 | 🧒 |
| **L1** | الجمع والطرح | S03, S04 | 8 | 🧒 |
| **L2** | الضرب | S07, S08 | 8 | 🧒 |
| **L3** | القسمة | S09, S10 | 8 | 🧒 |
| **L4** | سلاسل الجمع والطرح | S05, S06 | 8 | 🧑 |
| **L5** | ضرب وقسمة متقدم | S11, S12 | 8 | 🧑 |
| **L6** | الكسور العشرية | S13, S14 | 5 | 🧑 |
| **L7** | الجذور | S15 | 1 | 🧑 |

### تفصيل الدروس والمهارات

**L0 — التمهيدي:**

- **intro** (مقدمة — نظري): 7 صفحات · بدون مهارة (skillId: null) · صورة SVG متحركة لكل صفحة · سوروبان تفاعلي في p5
- **S01** (تمثيل الأرقام 0-9): m1 (0-4) · m2 (5) · m3 (6-9)
- **S02** (القيمة المكانية): m1 (آحاد) · m2 (عشرات)

**L1 — الجمع والطرح:**

- **S03** (الجمع): m1 (بسيط) · m2 (أصدقاء 5) · m3 (أصدقاء 10) · m4 (مركب)
- **S04** (الطرح): نفس البنية (m1-m4)

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

- **S13** (عشري جمع/طرح): m1 (بسيط) · m2 (أصدقاء 5و10) · m3 (مركب)
- **S14** (عشري ضرب/قسمة): m1 (ضرب) · m2 (قسمة)

**L7 — الجذور:**

- **S15** (الجذور التربيعية): m1

> ⚠️ **ملاحظة:** الدروس `L2-L7` النصية **مفقودة** في `curriculum/lessons/` — المجلد يحوي `L0` و `L1` فقط.

---

### 4.1 قواعد الأصابع — كوجيما (محدث جلسة 14)

**من كتاب Kojima — The Japanese Abacus (1954):**

| الإصبع | الوظيفة |
|---|---|
| **الإبهام** (Thumb) | يرفع الخرزات السفلية (1-4) نحو العارضة |
| **السبابة** (Index) | يُنزل الخرزة العلوية (5) · ويُبعد الخرزات السفلية عند التصفير |
| **التقريص** (Pinch) | الإبهام والسبابة **معًا في وقت واحد** لتشكيل 6-9 |

**الدليل من الكتاب (ص 29):**
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
    ├── CE1.ts            (امتحان القسم 1)
    ├── CE2.ts            (امتحان القسم 2)
    └── PT.ts             (تحديد المستوى)
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
CE امتحان القسم ✅
PT تحديد المستوى ✅
EN الإثراء ❌

بنية السؤال

الصيغة: SRB-L{L}-S{S}-m{m}-{V}{NNN}

مثال: SRB-L1-S03-m1-A001

قواعد:

· 5 أسئلة لكل (L, S, m) على الأقل.
· التسلسل يعاد ترقيمه لكل (L, S, m).
· variant: A = أساسي · B = متقدم (للمستقبل).
· allowed_phases: E · T · P · ANZ-V · ANZ-F · ANZ-A · X.

الـ movements الممكنة:

القيمة المعنى
direct حركة مباشرة
five-friend-add صديق 5 (جمع)
five-friend-sub صديق 5 (طرح)
ten-friend-add صديق 10 (جمع)
ten-friend-sub صديق 10 (طرح)
carry حمل
borrow استلاف
mixed مختلط

قاعدة الجلسة:

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
الأصوات Web Speech API (للإنجليزية) + MP3 (للعربية)

6.2 بيئة التشغيل

· يعمل offline — PWA.
· بدون سيرفر — ملفات ثابتة.
· بدون قاعدة بيانات — البيانات على الجهاز.

6.3 قرار صوتي (جلسة 14)

للغة العربية: Sorobana MP3 (كما هو — قصة مسجلة).

للغة الإنجليزية: Web Speech API — صوت المتصفح المدمج.

السبب في اختيار Web Speech بدل Edge TTS:

المعيار Web Speech Edge TTS
مجاني ✅ ✅
يعمل offline ✅ ❌
يحتاج API خارجي ❌ ✅
CORS لا مشكلة مشكلة حاسمة
رسمي ✅ ⚠️ غير موثّق
يعمل في PWA ✅ ⚠️

التبديل: عند تغيير اللغة إلى الإنجليزية → يتوقف كل صوت Sorobana تلقائيًا.

---

7. بنية الملفات ووظائفها

7.1 الجذر

```text
sorobanmind-2/
├── public/
│   ├── audio/            12 ملف صوتي
│   ├── images/           ← جديد جلسة 14 (6 ملفات SVG متحركة)
│   └── stories/          10 ملفات قصص
├── src/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── README.md
├── PROJECT_MASTER.md     ← هذا الملف
└── ACHIEVEMENTS.md       ← سجل الجلسات
```

7.1.1 public/images/ — ملفات SVG (جديد جلسة 14)

```text
public/images/
├── soroban-13.svg                        (قديم — للتوافق)
├── soroban-welcome-animated.svg          ✅ (p1)
├── soroban-story-animated.svg            ✅ (p2)
├── soroban-parts-animated.svg            ✅ (p3)
├── soroban-rule-animated.svg             ✅ (p4)
├── soroban-benefits-animated.svg         ✅ (p6)
└── soroban-ready-animated.svg            ✅ (p7)
```

ملاحظة مهمة: جميع الصور تُستدعى عبر import.meta.env.BASE_URL — إصلاح جلسة 14 لمشكلة المسار على GitHub Pages.

7.2 البنية العامة لـ src/

```text
src/
├── App.tsx                       ← البوابة الرئيسية
├── types.ts                      ← الأنواع العامة
├── i18n/                         ← الترجمة
├── curriculum/                   ← المنهج (الدروس النصية)
├── engine/                       ← المحرك الرياضي (مجمّد)
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
    │   ├── intro.ts              ← مقدمة L0 (معدّل جلسة 14)
    │   ├── S01.ts                ← تمثيل الأرقام (معاد كتابته جلسة 14)
    │   ├── S02.ts                ← القيمة المكانية
    │   └── test-pool.ts          ← أسئلة اختبار L0
    └── L1/
        ├── S03.ts                ← الجمع
        └── S04.ts                ← الطرح
```

الحالة:

· ✅ L0 مكتمل.
· ✅ L1 مكتمل.
· 🔴 L2-L7 مفقودة.

7.4.1 lessons/types.ts — تعديل جلسة 14

إضافة نوع جديد:

```ts
export type LocalizableText = string | BilingualText;
```

تعديل IntroPage:

```ts
export interface IntroPage {
  id: string;
  title: LocalizableText;      // ← كان: string
  content: LocalizableText;    // ← كان: string
  imageSvg?: string;
  imageAlt?: LocalizableText;  // ← كان: string
}
```

إضافة دالة:

```ts
export function resolveLocalized(
  value: LocalizableText | undefined,
  lang: "ar" | "en" = "ar",
): string
```

الغرض: تمكين الترجمة دون كسر البناء الحالي.

7.4.2 lessons/L0/intro.ts — تعديل جلسة 14

التغييرات:

· إضافة imageSvg لكل صفحة (7 صفحات).
· p5 → imageSvg: 'soroban-interactive' (مكوّن تفاعلي).
· إزالة ذكر «13 عمودًا».

7.5 src/engine/

```text
engine/
├── sorobanMoves.ts               ← قواعد الحركات — 🔒 معزول
├── sorobanEngine.ts              ← محرك الحساب — 🔒 معزول
├── masteryTracker.ts             ← تتبع الإتقان — ✅ نظيف · معزول
├── problemGenerator.ts           ← مولّد المسائل — 🟡 يعتمد على bank
└── adaptiveEngine.ts             ← المحرك التكيفي — 🟡 يعتمد على bank
```

الحقيقة:
src/engine/ كلها معزولة — لا أحد يستدعيها.

الملف مُستخدَم؟ يستورد من bank؟
sorobanMoves.ts ❌ ❌
sorobanEngine.ts ❌ ❌
masteryTracker.ts ❌ ❌
problemGenerator.ts ❌ ✅ bank-linked
adaptiveEngine.ts ❌ ✅ bank-linked

السبب:

· السوروبان التفاعلي (Soroban2D5.tsx) يحسب بنفسه.
· التمارين والأنزان تُبنى من SRB مباشرة.

القرار:

· 🔒 مجمّد حاليًا.
· 📌 يُدمج مع SRB لاحقًا — بعد إصلاح التخزين الشامل.
· المنطق الرياضي لا يُلمس — فقط الاستيرادات.

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
│   ├── questions/
│   │   └── L0.ts → L7.ts         (8 ملفات — 275 سؤالًا)
│   └── exams/                    🔴 لم يُبنَ
│       ├── CE1.ts
│       ├── CE2.ts
│       └── PT.ts
│
├── srb-adapter.ts                ← واجهة موحّدة SRB ✅ مستقل
│
├── bank.ts                       ← v1 — معزول تمامًا
├── bank-linked.ts                ← يربط v2 + raw — 🟡
├── bank-adapter.ts               ← مربوط بـ bank-linked
├── bank-v2/                      ← ~935 سؤالًا — 🟡 للامتحانات
├── bank-raw/                     ← 400 سؤال — 🟡 لتحديد المستوى
├── curriculum.ts                 ← بيانات المنهج القديم
├── modes.ts                      ← أنماط اللعب
└── index.ts                      ← نقطة الوصول
```

الحالة:

· ✅ SRB مكتمل ومستقل تمامًا (srb-adapter يستورد من ./srb فقط).
· 🔴 srb/exams/ لم يُبنَ.
· 🟡 البنوك القديمة تنتظر فك الارتباط.

7.7 src/store/

```text
store/
├── progressStore.ts              ← المتجر الرئيسي
├── masteryBadgesStore.ts         ← شارات الإتقان
└── numberStyleStore.ts           ← نمط الأرقام
```

الحالة:

· ✅ progressStore موجود — مصدر موحّد نظريًا.
· ✅ عمليًا — يُكتب فيه من 12 شاشة (جلسة 13).

7.8 src/utils/

```text
utils/
├── numberStyle.ts                ← تنسيق الأرقام ✅
├── arabicNumbers.ts              ← تحويل الرقم لكلمات ✅
├── numerals.ts                   ← أدوات الأرقام ✅
├── anzanBadges.ts                ← 🟡 للتنظيف
├── audioAnzanBadges.ts           ← 🟡 للتنظيف
├── badgeChecker.ts               ← 🟡 للتنظيف (فيه خطأ - × _)
├── skillsChecker.ts              ← 🟡 للتنظيف
└── certificateGenerator.ts       ← 🔴 غير مربوط
```

7.9 src/hooks/

```text
hooks/
├── useGameStats.ts               ← Adapter فوق progressStore ✅
├── useSound.ts                   ← تشغيل الأصوات ✅
├── useConfetti.ts                ← الاحتفالات ✅
├── useSpeech.ts                  ← النطق الصوتي ✅
├── useSorobanaVoice.ts           ← صوت سوروبانا ✅
├── useQuests.ts                  ← 🟡 يعتمد على مفاتيح قديمة
└── (2 خطافات أخرى)
```

7.10 src/components/

```text
components/
├── AdaptiveFeedback.tsx          ← 🔴 يستورد من bank-v2
├── SorobanaCompanion.tsx         ← رفيق سوروبانا ✅
├── FloatingCompanion.tsx         ← الرفيق العائم ✅
├── DebugOverlay.tsx              ← لوحة المطور ✅
├── soroban2d5/                   ← السوروبان التفاعلي ✅
│   ├── Soroban2D5.tsx
│   ├── Rod2D5.tsx
│   ├── Bead2D5.tsx
│   ├── useSorobanLogic.ts
│   ├── useBeadSound.ts
│   └── useBeadHaptics.ts
└── (~15 مكوّن آخر)
```

7.11 src/screens/ — 22 شاشة

# الشاشة الحالة
1 WelcomeScreen ✅
2 RoleSelection ✅
3 HeroDashboard ✅ (يزر "فتح الكل")
4 GuardianDashboard ✅ (SRB-first)
5 CategoryScreen ⚠️ يقرأ من localStorage قديم
6 LevelScreen ⚠️ يقرأ من localStorage قديم
7 LearnScreen ✅
8 LessonScreen ✅ (معدّل جلسة 14)
9 IntroductionScreen ✅ (معدّل جلسة 14)
10 LevelTestScreen 🔴 يحتاج ربطًا بـ SRB
11 FingerMathScreen ✅
12 MagicSecretsScreen ✅
13 PracticeScreen ⚠️ يكتب في localStorage قديم
14 AnzanScreen ⚠️ يكتب في localStorage قديم
15 AudioAnzanScreen ⚠️ يكتب في localStorage قديم
16 PlacementTestScreen 🔴 يستورد من bank-v2
17 CategoryExamScreen 🔴 يستورد من bank-v2
18 SorobanPlayground ✅
19 CrossMultiplicationScreen 🔴 غير مربوط
20 CertificateScreen 🔴 غير مربوط
21 RemediationScreen ✅ (مربوط بـ PracticeScreen)
22 Header ✅ مكوّن

7.11.1 IntroductionScreen.tsx — تعديل جلسة 14

التغييرات:

· إصلاح المسار: import.meta.env.BASE_URL بدل /images/.
· إضافة Soroban2D5 لعرض المعداد التفاعلي في p5.
· إضافة دالة localize() لتحويل LocalizableText إلى string.

7.11.2 LessonScreen.tsx — تعديل جلسة 14

التغييرات:

· إضافة دالة localize().
· إصلاح خطأ dangerouslySetInnerHTML → استخدام <img> مع BASE_URL.
· إصلاح أخطاء TS2322 السبعة.

---

8. التخزين

8.1 المشكلة الأساسية

3 أنظمة تخزين متوازية:

المعلومة progressStore localStorage قديم utils/*.ts
اسم الطفل ✅ childName ✅ soroban_child_name —
المستويات المكتملة ✅ completedLevels ✅ soroban_completed_levels —
الدروس المكتملة ✅ completedLessons ⚠️ soroban_completed_lessons —
تمارين ناجحة ✅ passedPractice ✅ soroban_passed_practice —
أنزان بصري ✅ passedAnzanVisual ✅ soroban_passed_anzan_visual ✅ soroban_anzan_stats
أنزان سمعي ✅ passedAnzanAudio ✅ soroban_passed_anzan_audio —
شارات الأنزان ✅ anzanBadges ✅ soroban_anzan_badges ✅ anzanBadges.ts
شارات الأنزان السمعي ✅ anzanAudioBadges ✅ soroban_anzan_audio_badges ✅ audioAnzanBadges.ts
شارات الإتقان ✅ masteryBadgesStore ✅ soroban_mastery_badges —
XP ✅ totalXP ✅ sorobanmind-stats —
الستريك ✅ currentStreak ✅ sorobanmind-stats —
الدرجات ✅ grades — —
الجلسة العلاجية ✅ pendingRemediation — —
سجل العلاجي ✅ remediationHistory — —

النتيجة: المعلومات موزعة على 2-3 أماكن.

8.2 الأعراض

· الكتابة في مكان، القراءة من مكان آخر.
· لا مزامنة.
· مثال: عند إكمال درس → يُكتب في localStorage، لكن progressStore يبقى فارغًا.
· GuardianDashboard يقرأ من progressStore → 0%.

8.3 خريطة المفاتيح (28 مفتاحًا)

المجموعة 1 — نظيفة ✅

# المفتاح
1 sorobanmind-v2-progress
2 sorobanmind-v2-lang
3 soroban_mastery_badges
4 srb_progress

المجموعة 2 — مكررة 🟡

# المفتاح
5 soroban_child_name
6 soroban_companion
7 soroban_number_style

المجموعة 3 — التقدم الرئيسية 🔴

# المفتاح يُكتب من يُقرأ من
8 soroban_completed_lessons LessonScreen LearnScreen · LevelScreen
9 soroban_completed_levels HeroDashboard · CategoryExamScreen CategoryScreen · LevelScreen
10 soroban_passed_practice HeroDashboard · App.tsx CategoryScreen · LevelScreen
11 soroban_passed_anzan_visual HeroDashboard CategoryScreen · LevelScreen
12 soroban_passed_anzan_audio HeroDashboard CategoryScreen · LevelScreen

المجموعة 4 — الامتحانات 🔴

# المفتاح
13 soroban_passed_level_tests
14 soroban_exam1_passed · soroban_exam2_passed
15 soroban_exam_result
16 soroban_weak_skills_v2
17 soroban_section2_unlocked

المجموعة 5 — إحصاءات وشارات 🔴

# المفتاح
18 soroban_anzan_stats
19 soroban_practice_stats
20 soroban_anzan_badges
21 soroban_anzan_audio_badges

المجموعة 6 — ثانوية ✅

# المفتاح
22 soroban_unlocked_secrets
23 soroban_welcome_seen

المجموعة 7 — مؤقتة 🟡

# المفتاح
24 soroban_placement_recommended
25 soroban_placement_weak_skills
26 soroban_level_test_last_attempt_L0

🚨 المجموعة 8 — خطيرة

# المفتاح المشكلة
27 soroban-completed-lessons (بـ -) 🔴 مكرر خطأً — يبحث فيه badgeChecker + useQuests
28 sorobanmind-stats 🔴 قديم — موجود في badgeChecker + useQuests

8.4 الإصلاح الشامل

المبدأ: progressStore + srb_progress = المصدران الوحيدان.

الخطوات:

1. إضافة completedLessons إلى srb_progress.
2. تعديل App.tsx — الكتابة في progressStore.
3. تعديل LevelScreen — القراءة من progressStore.
4. تعديل CategoryScreen — القراءة من progressStore.
5. تعديل LessonScreen — الكتابة في progressStore.
6. تعديل PracticeScreen → markPracticePassed.
7. تعديل AnzanScreen → markAnzanVisualPassed + setAnzanBadge.
8. تعديل AudioAnzanScreen → markAnzanAudioPassed + setAnzanAudioBadge.
9. إصلاح - × _ في badgeChecker + useQuests.
10. إصلاح زر "فتح الكل" — يكتب في progressStore.
11. ربط awardBadge — عند الإجابة بزمن قياسي.

---

9. نظام التقييم

9.1 نظرة عامة

كل مستوى يُقيَّم بأربعة أقسام منفصلة. كل قسم له درجة كاملة = ١٠٠.

القسم الدرجة الكاملة النجاح
✏️ تمرّن (P) ١٠٠ ٧٠٪
🧠 أنزان بصري عادي (ANZ-V) ١٠٠ ٧٠٪
⚡ أنزان بصري فلاش (ANZ-F) ١٠٠ ٧٠٪
🎧 أنزان سمعي (ANZ-A) ١٠٠ ٧٠٪
🎓 اختبار المستوى (X) ١٠٠ ٨٠٪

9.2 التسلسل الكامل

```text
١. تعلّم (الدروس النصية)
        ↓
٢. "أنهيت المستوى" — عند آخر "جرّب" في آخر درس
        ↓
٣. يُفتح: تمرّن + أنزان (بصري عادي · بصري فلاش · سمعي)
        ↓
٤. عند نجاح كل قسم (٧٠٪) → شارة "مجتاز بدرجة كذا"
   · لا إعادة بعد النجاح
        ↓
٥. عند نجاح التمرّن + كل أقسام الأنزان → يُفتح اختبار المستوى
        ↓
٦. عند نجاح الاختبار (٨٠٪) → الشهادة
```

9.3 توزيع العلامة النهائية (الشهادة)

```text
العلامة النهائية =
    (درجة الاختبار        × ٧٠٪)
  + (درجة التمرّن         × ١٠٪)
  + (درجة الأنزان البصري  × ١٠٪)
  + (درجة الأنزان السمعي  × ١٠٪)
  = ١٠٠٪
```

الأنزان البصري = متوسط (عادي + فلاش) ÷ ٢.

9.4 قواعد التقريب

· كل درجة تُقرَّب لأقرب ١ دون كسور.
· النسبة النهائية تُقرَّب لأقرب ١ دون كسور.

9.5 قواعد النجاح والإعادة

الحالة القاعدة
نجاح تمرّن لا إعادة
نجاح أنزان بصري عادي لا إعادة
نجاح أنزان بصري فلاش لا إعادة
نجاح أنزان سمعي لا إعادة
نجاح اختبار المستوى لا إعادة
رسوب اختبار إعادة بعد فترة انتظار

⚠️ فترة الانتظار: الكود الحالي = ٤٨ ساعة (EXAM_COOLDOWN_MS)، الواجهة تعرض ٢٤ ساعة. يحتاج توحيد.

9.6 الشهادات

الوضع الحالي:

· شاشة CertificateScreen موجودة — غير مربوطة.
· الشهادة الحالية للقسم الأخير.

المطلوب:

· شهادة قسم الصغار — تصميم جديد (L0-L3).
· شهادة قسم الكبار — موجودة، تحتاج ربطًا (L4-L7).

المحتوى:

· اسم الطفل.
· الدرجات الأربعة (اختبار · تمرّن · بصري · سمعي).
· العلامة النهائية.
· الميدالية.
· رقم الشهادة.
· التاريخ + رابط التحقق.

9.7 تصنيف الميداليات

العلامة الميدالية التصنيف
٩٥-١٠٠ 🥇 ذهبية ممتاز
٩٠-٩٤ 🥈 فضية ممتاز مرتفع
٨٥-٨٩ 🥉 برونزية جيد جدًا
٨٠-٨٤ 🎖️ نجاح جيد
< ٨٠ ❌ لا شهادة

9.8 شارات السرعة (Mastery Badges)

الشارة الشرط
🥇 ذهبية (mastery) إجابة ≤ ٥٠٪ من الزمن المعياري
👍 مقبول (accepted) إجابة ≤ ٧٥٪
🐢 بطيء (slow) إجابة > ٧٥٪

9.9 Adaptive Speed

```text
كل ٥ إجابات صحيحة متتالية → -٥٪ من الزمن المعياري
الحد الأدنى: ٥٠٪ من الأصلي
```

9.10 الجلسة العلاجية

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
· إظهار الحل فورًا بعد كل سؤال.
· مخصصة لـ m ضعيف.

التصنيفات:

· 🏆 أتقنتها بزمن قياسي (≤ ٥٠٪)
· 👍 جيدة (زمن مقبول ≤ ٧٥٪)
· ⚠️ تحتاج تقوية (> ٧٥٪ أو خطأ)

ملاحظة: movement غير مطبَّق حاليًا — مؤجل.

---

10. نظام القفل والفتح

10.1 التسلسل الحقيقي (يعمل ✅)

```text
داخل الدرس:
    أكمل "شاهد" + "جرّب" → يُفتح الدرس التالي
        ↓
    آخر "جرّب" → "أنهيت المستوى"
        ↓
داخل المستوى:
    يُفتح: تمرّن + أنزان (بصري عادي · فلاش · سمعي)
        ↓
    نجاح التمرّن (٧٠٪) + كل أنزان (٧٠٪) → يُفتح الاختبار
        ↓
    نجاح الاختبار (٨٠٪) → يُفتح المستوى التالي
        ↓
التنقل:
    L0 → L1 → L2 → ... → L7
```

10.2 مصادر القفل

العنصر المفتاح
فتح الدروس progressStore.completedLessons
فتح تمرّن progressStore.completedLessons
فتح أنزان progressStore.completedLessons
فتح اختبار progressStore.passedPractice + passedAnzan*
فتح المستوى التالي progressStore.completedLevels
فتح القسم 2 progressStore (جديد)

✅ تم توحيدها في جلسة 13.

10.3 زر "فتح الكل" (GuardianDashboard)

يكتب في:

· progressStore.completedLevels
· progressStore.passedPractice
· progressStore.passedAnzanVisual
· progressStore.passedAnzanAudio
· progressStore.completedLessons ← جديد جلسة 13

يمسح:

· soroban_exam1_passed
· soroban_exam2_passed
· soroban_exam_result
· soroban_anzan_badges
· soroban_anzan_audio_badges

---

11. خريطة الترابط

11.1 خريطة الملفات

📚 المنهج:

· curriculum/types.ts ← 14 مستوردًا (مجمّد)
· curriculum/lessons/types.ts ← 5 مستوردين (قابل للتعديل — معدّل جلسة 14)
· curriculum/lessons/index.ts ← LearnScreen · LessonScreen · App.tsx · IntroductionScreen

🏦 بنك SRB (مستقل ✅):

· data/srb/ ← 9 ملفات + 8 ملفات أسئلة
· data/srb-adapter.ts ← 5 شاشات

🏦 البنوك القديمة:

· data/bank-v2/ ← CategoryExam · PlacementTest
· data/bank-raw/ ← bank-v2/bank-exam + bank-adapter
· data/bank-linked.ts ← adaptiveEngine · problemGenerator (معزولة)

🧠 المحرك (معزول):

· كل الملفات معزولة — لا أحد يستدعيها.

📦 المتاجر:

· progressStore.ts ← 7+ مستوردين
· masteryBadgesStore.ts ← GuardianDashboard · useGameStats
· numberStyleStore.ts ← كل الشاشات

11.2 خريطة البنوك

```text
bank-raw/ (400 سؤال — 7 ملفات)
    raw-01 → S1-S3
    raw-02 → S4-S5
    raw-03 → S6-S7
    raw-04 → S8-S10
    raw-05 → S11-S12
    raw-06 → S13-S14
    raw-07 → S15-S17
        ↓
bank-v2/ (~935 سؤال — 4 parts + امتحانات)
    part-01 → L0-L1
    part-02 → L2-L3
    part-03 → L4-L5
    part-04 → L6-L7
    bank-exam.ts → EXAM_POOL_1 + EXAM_POOL_2
    placement-engine.ts → يستهلك Pools
        ↓
bank-linked.ts ← يجمع v2 + raw
        ↓
adaptiveEngine.ts · problemGenerator.ts (معزولة)
```

من يستورد من bank-v2:

· CategoryExamScreen.tsx
· PlacementTestScreen.tsx

من يستورد من bank-linked:

· adaptiveEngine.ts (معزول)
· problemGenerator.ts (معزول)

بنك SRB مستقل تمامًا:

· srb-adapter.ts يستورد من ./srb فقط ✅

---

12. الحالة الحالية

نهاية الجلسة 14

12.1 ما يعمل ✅

العنصر الحالة
بنك SRB ✅ 275 سؤالًا
المنهج (بنية) ✅ 8 مستويات · 15 درسًا · 51 m
درس المقدمة (L0-intro) ✅ 7 صفحات · صور متحركة · سوروبان تفاعلي
القفل المتتابع ✅ يعمل (L0 · L1)
التمرّن والأنزان ✅ يعملان
التنقل بين المستويات ✅ يعمل
الجلسة العلاجية ✅ مربوطة بزر
التعليم التكيفي ✅ يعمل
GuardianDashboard ✅ يقرأ من progressStore
النسخ الاحتياطي ✅ يعمل (JSON)
وضع المعاينة ✅ يعمل
البناء ✅ أخضر

12.2 ما يحتاج إصلاحًا 🔴

العنصر المشكلة
زر "فتح الكل" تم إصلاحه في جلسة 13
الشارات لا تُمنح (تعارض - × _) — يحتاج فحصًا
المهارات الأربع في GuardianDashboard 0% — يحتاج فحصًا
الدروس L2-L7 مفقودة
الامتحانات تعتمد على bank-v2
الشهادات غير مربوطة
28 مفتاح localStorage موزّعة، مكررة، بعضها ميت
TTS للإنجليزية لم يُنفَّذ بعد
lesson.story.ar يُستخدم مباشرة في LessonScreen (بلا localize)
lesson.concept.ar · lesson.rule.ar نفس المشكلة

12.3 ما لم يُبنَ بعد 🟡

العنصر الحالة
srb/exams/ 🔴 لم يُبنَ
دروس L2-L7 🔴 لم تُبنَ
شهادة قسم الصغار 🔴 لم تُصمَّم
CrossMultiplicationScreen 🟡 غير مربوط
تعليم تكيفي حسب movement 🟡 مؤجل
دمج المحرك مع SRB 🟡 مؤجل
ترجمة L0-intro 🟡 البنية جاهزة · الترجمة لم تبدأ
ترجمة S01 🟡 S01 يحتاج اختبارًا أولًا
TTS للإنجليزية 🟡 القرار متخذ · التنفيذ مؤجل

12.4 ما أُنجز في جلسة 14 (جديد) ✅

العنصر الحالة
6 ملفات SVG متحركة ✅ في public/images/
إصلاح مسار BASE_URL ✅ يعمل على GitHub Pages
السوروبان التفاعلي في p5 ✅ يعمل
بنية LocalizableText ✅ في lessons/types.ts
دالة localize() ✅ في IntroductionScreen + LessonScreen
إصلاح خطأ dangerouslySetInnerHTML ✅
إصلاح 7 أخطاء TS2322 ✅ البناء أخضر
S01 — إعادة كتابة (قيد الاختبار) 🟡
قرار صوت TTS ✅ Web Speech API
قواعد توثيق جديدة ✅ رأس موحّد + قيد نهاية جلسة

---

13. خطة العمل

المرحلة 1 — إصلاح التخزين الشامل ✅ مكتملة (جلسة 13)

الهدف: توحيد 28 مفتاحًا في 4 مفاتيح.

الخطوات:

1. ✅ إضافة completedLessons إلى srb_progress.
2. ✅ تعديل App.tsx — الكتابة في progressStore.
3. ✅ تعديل LevelScreen — القراءة من progressStore.
4. ✅ تعديل CategoryScreen — القراءة من progressStore.
5. ✅ تعديل LessonScreen — الكتابة في progressStore.
6. ✅ تعديل PracticeScreen → markPracticePassed.
7. ✅ تعديل AnzanScreen → markAnzanVisualPassed.
8. ✅ تعديل AudioAnzanScreen → markAnzanAudioPassed.
9. ⏳ إصلاح خطأ - × _ في badgeChecker + useQuests.
10. ✅ إصلاح زر "فتح الكل".
11. ⏳ ربط awardBadge.

المرحلة 1.5 — المقدمة والترجمة (جلسة 14)

1.5.1 — درس المقدمة ✅ مكتمل

· ✅ 6 ملفات SVG متحركة.
· ✅ إصلاح BASE_URL.
· ✅ السوروبان التفاعلي في p5.

1.5.2 — الأساس البنيوي للترجمة ✅ مكتمل

· ✅ LocalizableText في lessons/types.ts.
· ✅ localize() في IntroductionScreen + LessonScreen.
· ✅ إصلاح 7 أخطاء البناء.

1.5.3 — S01 🟡 قيد الاختبار

· ✅ إعادة كتابة شاملة.
· ✅ حركة التقريص (Pinch).
· ⏳ اختبار في التطبيق.

المرحلة 2 — ترجمة الدروس ⏳

الخطوات:

1. ترجمة L0-intro (7 صفحات × 3 حقول = 21 نصًا).
2. تعديل LessonScreen لدعم تبديل اللغة.
3. تفعيل TTS للإنجليزية (Web Speech API).
4. ترجمة S01 · S02 · S03 · S04.
5. ترجمة باقي الدروس عند بنائها.

المرحلة 3 — بناء srb/exams/ 🔴

الخطوات:

1. إنشاء src/data/srb/exams/:
   · index.ts · constants.ts · CE1.ts · CE2.ts · PT.ts
2. الجسر المؤقت: export from bank-v2.
3. تعديل الشاشتين — استيراد من srb/exams.
4. النقل التدريجي لأسئلة bank-raw + bank-v2 → SRB.
5. حذف البنوك القديمة.

المرحلة 4 — بناء دروس L2-L7 🔴

الخطوات:

1. البحث في sorobanmind-platform-2026 عن دروس قديمة.
2. بناء البنية لكل مستوى.
3. تأليف المحتوى (شرح + أمثلة + قصة + تمارين).
4. تحديث curriculum/lessons/index.ts.

المرحلة 5 — الشهادات 🟡

الخطوات:

1. تصميم شهادة قسم الصغار.
2. ربط CertificateScreen بالعلامة النهائية.
3. اختبار.

المرحلة 6 — تنظيف 🟢

الخطوات:

1. حذف الملفات الميتة:
   · utils/anzanBadges.ts · audioAnzanBadges.ts · skillsChecker.ts · badgeChecker.ts
   · hooks/useQuests.ts (أو تحديثه)
2. توحيد فترة الانتظار (٢٤ أم ٤٨).
3. تنظيف CategoryScreen.

المرحلة 7 — دمج المحرك (مؤجل) 🟡

1. نقل problemGenerator + adaptiveEngine → srb-adapter.
2. ربط masteryTracker.
3. إضافة movement للتعليم التكيفي.

المرحلة 8 — النشر 🟢

1. PWA.
2. APK.

---

14. المشاكل المعروفة

14.1 حرجة (تُكسر وظائف)

# المشكلة
1 تعارض soroban-completed-lessons × soroban_completed_lessons — يحتاج فحصًا
2 progressStore لا يُكتب فيه من بعض الشاشات
3 زر "فتح الكل" — تم إصلاحه (تحتاج تحققًا)
4 دروس L2-L7 مفقودة

14.2 متوسطة

# المشكلة
5 sorobanmind-stats موجود رغم أن README يقول حُذف
6 HeroDashboard يمسح مفاتيح لكن لا يُحدّث store
7 CategoryScreen dual-write
8 useQuests يعتمد على مفاتيح قديمة
9 EXAM_COOLDOWN_MS = ٤٨ ساعة · الواجهة ٢٤ ساعة
10 LessonScreen لا يقرأ اللغة (lesson.story.ar مباشرة)
11 lesson.concept.ar · lesson.rule.ar — بلا localize
12 LessonScreen السطر 335 — type خطأ محتمل

14.3 بسيطة

# المشكلة
13 SRBModule محدود بـ m1-m10
14 SRBSection محدود بـ S01-S15
15 i18n مفاتيح قديمة
16 certificateGenerator يحتاج مراجعة
17 CrossMultiplicationScreen غير مربوط

---

15. المصادر والمراجع

مصادر المنهج

· Takashi Kojima — The Japanese Abacus: Its Use and Theory.
· Japan Soroban Association — المنهج الرسمي.

مصادر التقريص (Pinch)

دليل من الكتاب (Kojima, 1954, ص 29):

"Push LOWER beads UP (thumb) and an UPPER bead DOWN (finger) simultaneously. We call this move the pinch."

مصادر مستقلة تؤكد:

· "When both top and bottom beads are required simultaneously, they are 'pinched' between thumb and forefinger. eg to set numbers 6-9."
· "Pinching together one heaven bead and two earth beads sets a value of 7."

مراجع المشروع

· PROJECT_MASTER.md — هذا الملف.
· ACHIEVEMENTS.md — سجل الجلسات.
· README.md — نظرة عامة.

روابط

العنصر الرابط
الموقع 
المستودع 
Actions 
المستودع القديم  (مهجور)

المطوّر

· مصطفى علي أكر (@mezo2021)

---

📌 ملاحظات أخيرة

قبل أي تعديل

1. نسخة احتياطية (ZIP).
2. مراجعة هذا المرجع.
3. اسأل قبل التنفيذ — لا افتراضات.

القواعد الذهبية

1. لا حذف إلا ما أُلغي صريحًا.
2. المحرك الرياضي مجمّد.
3. bank-v2/ + bank-raw/ لا يُحذفان قبل فك ارتباط CE1 · CE2 · PT.
4. curriculum/types.ts مجمّد.
5. SRB هو البنك الوحيد.
6. ملف واحد في المرة — ثم اختبار.
7. نسخة احتياطية قبل أي تعديل.
8. رأس موحّد لكل ملف معدّل (جلسة 14).
9. قيد ACHIEVEMENTS.md في نهاية الجلسة فقط (جلسة 14).
10. تحديث PROJECT_MASTER.md عند التعديلات البنيوية (جلسة 14).

مبدأ التعامل

· الكود هو الحقيقة — لا الملفات النصية.
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

آخر تحديث: 2026-10-04 — نهاية الجلسة 14

الحالة: 🟢 البناء أخضر · المقدمة مكتملة · الترجمة بدأت · S01 جاهز للاختبار

</div>

</div>