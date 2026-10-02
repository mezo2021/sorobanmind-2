📝 PROJECT_MASTER.md — الملف الكامل (النسخة النهائية)

```markdown
# 🧮 SorobanMind v2 — المرجع الموحّد

> **آخر تحديث:** 2026-10-02 — بداية الجلسة 13
> **الحالة:** 🟢 البناء أخضر · SRB مكتمل · يحتاج إصلاح تخزين + بناء L2-L7
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

**الاسم:** SorobanMind v2 (أكاديمية السوروبان الدولية)
**النوع:** تطبيق تعليمي عربي تفاعلي
**الهدف:** تعليم السوروبان الياباني (منهج تاكاشي كوجيما) للأطفال والكبار
**الميزات الأساسية:**
- بدون إنترنت (offline)
- بدون إعلانات
- خصوصية كاملة (البيانات على جهاز المستخدم)

**الروابط:**
- الموقع: https://mezo2021.github.io/sorobanmind-2
- المستودع: https://github.com/mezo2021/sorobanmind-2
- Actions: https://github.com/mezo2021/sorobanmind-2/actions

**المطوّر:** مصطفى علي أكر (@mezo2021)

---

## 2. الرؤية والأهداف

### الرؤية
تعليم السوروبان الياباني الأصيل بالعربية — بتعليم تكيفي يكتشف نقاط ضعف الطالب ويبني له مسارًا مخصصًا.

### الفئتان العمريتان
- 🧒 **الأبطال الصغار** (5-12 سنة) → L0-L3
- 🧑 **الأبطال الكبار** (13+ سنة) → L4-L7

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

---

## 3. القواعد الذهبية

هذه القواعد **لا تُخرَق** أبدًا:

1. **لا حذف** إلا ما أُلغي صريحًا.
2. **المحرك الرياضي مجمّد** (`engine/` — `sorobanEngine.ts` + `sorobanMoves.ts`) — لا يُلمس.
3. **`bank-v2/` + `bank-raw/`** لا يُحذفان قبل فك ارتباط CE1 · CE2 · PT بهما.
4. **`curriculum/types.ts`** مجمَّد — عقد أساسي (14 مستورد).
5. **SRB هو البنك الوحيد** لكل الأسئلة الجديدة.
6. **ملف واحد في المرة** — ثم اختبار.
7. **نسخة احتياطية قبل أي تعديل.**

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

⚠️ **ملاحظة:** الدروس `L2-L7` النصية **مفقودة** في `curriculum/lessons/` — المجلد يحوي `L0` و `L1` فقط.

---

## 5. بنك SRB

### الفكرة
بنك الأسئلة الوحيد المعتمد — كل سؤال مصنّف بدقة.

### الصيغة
```

SRB-L{0-7}-S{01-15}-m{n}-A{001}

```

**مثال:** `SRB-L0-S01-m1-A001`

### البنية
```

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
│   ├── L0.ts → L7.ts     ✅ 8 ملفات — 275 سؤالًا
└── exams/                🔴 لم يُبنَ بعد
├── CE1.ts            (امتحان القسم 1)
├── CE2.ts            (امتحان القسم 2)
└── PT.ts             (تحديد المستوى)

```

### نظام المراحل (Phases)

| الرمز | الاسم | يُسجَّل؟ |
|---|---|---|
| E | شاهد | ❌ |
| T | جرّب | ❌ |
| P | تمرّن | ✅ |
| ANZ-V | أنزان بصري عادي | ✅ |
| ANZ-F | أنزان Flash | ✅ |
| ANZ-A | أنزان سمعي | ✅ |
| X | اختبار المستوى | ✅ |
| CE | امتحان القسم | ✅ |
| PT | تحديد المستوى | ✅ |
| EN | الإثراء | ❌ |

### بنية السؤال

**الصيغة:** `SRB-L{L}-S{S}-m{m}-{V}{NNN}`

**مثال:** `SRB-L1-S03-m1-A001`

**قواعد:**
- **5 أسئلة** لكل (L, S, m) على الأقل.
- التسلسل يعاد ترقيمه لكل (L, S, m).
- `variant`: **A** = أساسي · **B** = متقدم (للمستقبل).
- `allowed_phases`: E · T · P · ANZ-V · ANZ-F · ANZ-A · X.

**الـ movements الممكنة:**
- `direct` — حركة مباشرة
- `five-friend-add` — صديق 5 (جمع)
- `five-friend-sub` — صديق 5 (طرح)
- `ten-friend-add` — صديق 10 (جمع)
- `ten-friend-sub` — صديق 10 (طرح)
- `carry` — حمل
- `borrow` — استلاف
- `mixed` — مختلط

**قاعدة الجلسة:**
```

عدد الأسئلة = max(عدد m في المستوى، 5)

· لا تكرار داخل الجلسة.

```

```markdown
---

## 6. البنية التقنية

### 6.1 التقنيات

| العنصر | التقنية |
|---|---|
| اللغة | TypeScript 5.5 |
| إطار الواجهة | React 18 |
| أداة البناء | Vite 5 |
| التنسيق | Tailwind CSS |
| إدارة الحالة | Zustand 4 (persist + localStorage) |
| النشر | GitHub Pages (GitHub Actions) |
| التخزين | localStorage (مستقبلًا: IndexedDB) |

### 6.2 بيئة التشغيل
- يعمل offline — PWA.
- بدون سيرفر — ملفات ثابتة.
- بدون قاعدة بيانات — البيانات على الجهاز.

---

## 7. بنية الملفات ووظائفها

### 7.1 الجذر
```

sorobanmind-2/
├── public/
│   ├── audio/            12 ملف صوتي
│   └── stories/          10 ملفات قصص
├── src/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── README.md
└── PROJECT_MASTER.md     ← هذا الملف

```

### 7.2 البنية العامة لـ `src/`
```

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

### 7.3 `src/i18n/`
```

i18n/
├── ar.ts                         ← القاموس العربي (~312 سطرًا)
├── en.ts                         ← القاموس الإنجليزي
├── index.ts                      ← translate + Language type
└── useTranslation.ts             ← useT hook + useLangStore

```

**الحالة:**
- ✅ البنية سليمة.
- ⚠️ مفاتيح قديمة (`level.15` إلى `level.20`) تحتاج مراجعة.

### 7.4 `src/curriculum/`
```

curriculum/
├── types.ts                      ← عقد أساسي — مجمّد
└── lessons/
├── index.ts                  ← الفهرس الموحّد
├── types.ts                  ← أنواع الدروس
├── L0/
│   ├── intro.ts              ← مقدمة L0
│   ├── S01.ts                ← تمثيل الأرقام
│   ├── S02.ts                ← القيمة المكانية
│   └── test-pool.ts          ← أسئلة اختبار L0
└── L1/
├── S03.ts                ← الجمع
└── S04.ts                ← الطرح

```

**الحالة:**
- ✅ L0 مكتمل.
- ✅ L1 مكتمل.
- 🔴 L2-L7 **مفقودة**.

### 7.5 `src/engine/`
```

engine/
├── sorobanMoves.ts               ← قواعد الحركات — 🔒 معزول
├── sorobanEngine.ts              ← محرك الحساب — 🔒 معزول
├── masteryTracker.ts             ← تتبع الإتقان — ✅ نظيف · معزول
├── problemGenerator.ts           ← مولّد المسائل — 🟡 يعتمد على bank
└── adaptiveEngine.ts             ← المحرك التكيفي — 🟡 يعتمد على bank

```

**الحقيقة:**
**`src/engine/` كلها معزولة — لا أحد يستدعيها.**

| الملف | مُستخدَم؟ | يستورد من bank؟ |
|---|---|---|
| `sorobanMoves.ts` | ❌ | ❌ |
| `sorobanEngine.ts` | ❌ | ❌ |
| `masteryTracker.ts` | ❌ | ❌ |
| `problemGenerator.ts` | ❌ | ✅ `bank-linked` |
| `adaptiveEngine.ts` | ❌ | ✅ `bank-linked` |

**السبب:**
- السوروبان التفاعلي (`Soroban2D5.tsx`) يحسب بنفسه.
- التمارين والأنزان تُبنى من SRB مباشرة.

**القرار:**
- 🔒 مجمّد حاليًا.
- 📌 يُدمج مع SRB **لاحقًا** — بعد إصلاح التخزين الشامل.
- **المنطق الرياضي لا يُلمس** — فقط الاستيرادات.

### 7.6 `src/data/`
```

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

**الحالة:**
- ✅ **SRB مكتمل ومستقل تمامًا** (`srb-adapter` يستورد من `./srb` فقط).
- 🔴 `srb/exams/` لم يُبنَ.
- 🟡 البنوك القديمة تنتظر فك الارتباط.

### 7.7 `src/store/`
```

store/
├── progressStore.ts              ← المتجر الرئيسي
├── masteryBadgesStore.ts         ← شارات الإتقان
└── numberStyleStore.ts           ← نمط الأرقام

```

**الحالة:**
- ✅ progressStore موجود — مصدر موحّد نظريًا.
- ⚠️ عمليًا — لا أحد يكتب فيه من الشاشات (ما عدا XP و streak).

### 7.8 `src/utils/`
```

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

### 7.9 `src/hooks/`
```

hooks/
├── useGameStats.ts               ← Adapter فوق progressStore ✅
├── useSound.ts                   ← تشغيل الأصوات ✅
├── useConfetti.ts                ← الاحتفالات ✅
├── useSpeech.ts                  ← النطق الصوتي ✅
├── useSorobanaVoice.ts           ← صوت سوروبانا ✅
├── useQuests.ts                  ← 🟡 يعتمد على مفاتيح قديمة
└── (2 خطافات أخرى)

```

### 7.10 `src/components/`
```

components/
├── AdaptiveFeedback.tsx          ← 🔴 يستورد من bank-v2
├── SorobanaCompanion.tsx         ← رفيق سوروبانا ✅
├── FloatingCompanion.tsx         ← الرفيق العائم ✅
├── DebugOverlay.tsx              ← لوحة المطور ✅
├── soroban2d5/                   ← السوروبان التفاعلي ✅
└── (~15 مكوّن آخر)

```

### 7.11 `src/screens/` — 22 شاشة

| # | الشاشة | الحالة |
|---|---|---|
| 1 | WelcomeScreen | ✅ |
| 2 | RoleSelection | ✅ |
| 3 | HeroDashboard | ✅ (يزر "فتح الكل") |
| 4 | GuardianDashboard | ✅ (SRB-first) |
| 5 | CategoryScreen | ⚠️ يقرأ من localStorage قديم |
| 6 | LevelScreen | ⚠️ يقرأ من localStorage قديم |
| 7 | LearnScreen | ✅ |
| 8 | LessonScreen | ⚠️ يكتب في localStorage قديم |
| 9 | IntroductionScreen | ✅ |
| 10 | LevelTestScreen | 🔴 يحتاج ربطًا بـ SRB |
| 11 | FingerMathScreen | ✅ |
| 12 | MagicSecretsScreen | ✅ |
| 13 | PracticeScreen | ⚠️ يكتب في localStorage قديم |
| 14 | AnzanScreen | ⚠️ يكتب في localStorage قديم |
| 15 | AudioAnzanScreen | ⚠️ يكتب في localStorage قديم |
| 16 | PlacementTestScreen | 🔴 يستورد من bank-v2 |
| 17 | CategoryExamScreen | 🔴 يستورد من bank-v2 |
| 18 | SorobanPlayground | ✅ |
| 19 | CrossMultiplicationScreen | 🔴 غير مربوط |
| 20 | CertificateScreen | 🔴 غير مربوط |
| 21 | RemediationScreen | ✅ (مربوط بـ PracticeScreen) |
| 22 | Header | ✅ مكوّن |

---

## 8. التخزين

### 8.1 المشكلة الأساسية

**3 أنظمة تخزين متوازية:**

| المعلومة | progressStore | localStorage قديم | utils/*.ts |
|---|---|---|---|
| اسم الطفل | ✅ `childName` | ✅ `soroban_child_name` | — |
| المستويات المكتملة | ✅ `completedLevels` | ✅ `soroban_completed_levels` | — |
| الدروس المكتملة | ❌ | ✅ `soroban_completed_lessons` | — |
| تمارين ناجحة | ✅ `passedPractice` | ✅ `soroban_passed_practice` | — |
| أنزان بصري | ✅ `passedAnzanVisual` | ✅ `soroban_passed_anzan_visual` | ✅ `soroban_anzan_stats` |
| أنزان سمعي | ✅ `passedAnzanAudio` | ✅ `soroban_passed_anzan_audio` | — |
| شارات الأنزان | ✅ `anzanBadges` | ✅ `soroban_anzan_badges` | ✅ `anzanBadges.ts` |
| شارات الأنزان السمعي | ✅ `anzanAudioBadges` | ✅ `soroban_anzan_audio_badges` | ✅ `audioAnzanBadges.ts` |
| شارات الإتقان | ✅ `masteryBadgesStore` | ✅ `soroban_mastery_badges` | — |
| XP | ✅ `totalXP` | ✅ `sorobanmind-stats` | — |
| الستريك | ✅ `currentStreak` | ✅ `sorobanmind-stats` | — |

**النتيجة:** المعلومات موزعة على 2-3 أماكن.

### 8.2 الأعراض

- **الكتابة** في مكان، **القراءة** من مكان آخر.
- **لا مزامنة**.
- مثال: عند إكمال درس → يُكتب في localStorage، لكن `progressStore` يبقى فارغًا.
- GuardianDashboard يقرأ من `progressStore` → 0%.

### 8.3 خريطة المفاتيح (28 مفتاحًا)

#### المجموعة 1 — نظيفة ✅
| # | المفتاح |
|---|---|
| 1 | `sorobanmind-v2-progress` |
| 2 | `sorobanmind-v2-lang` |
| 3 | `soroban_mastery_badges` |
| 4 | `srb_progress` |

#### المجموعة 2 — مكررة 🟡
| # | المفتاح |
|---|---|
| 5 | `soroban_child_name` |
| 6 | `soroban_companion` |
| 7 | `soroban_number_style` |

#### المجموعة 3 — التقدم الرئيسية 🔴
| # | المفتاح | يُكتب من | يُقرأ من |
|---|---|---|---|
| 8 | `soroban_completed_lessons` | LessonScreen | LearnScreen · LevelScreen |
| 9 | `soroban_completed_levels` | HeroDashboard · CategoryExamScreen | CategoryScreen · LevelScreen |
| 10 | `soroban_passed_practice` | HeroDashboard · App.tsx | CategoryScreen · LevelScreen |
| 11 | `soroban_passed_anzan_visual` | HeroDashboard | CategoryScreen · LevelScreen |
| 12 | `soroban_passed_anzan_audio` | HeroDashboard | CategoryScreen · LevelScreen |

#### المجموعة 4 — الامتحانات 🔴
| # | المفتاح |
|---|---|
| 13 | `soroban_passed_level_tests` |
| 14 | `soroban_exam1_passed` · `soroban_exam2_passed` |
| 15 | `soroban_exam_result` |
| 16 | `soroban_weak_skills_v2` |
| 17 | `soroban_section2_unlocked` |

#### المجموعة 5 — إحصاءات وشارات 🔴
| # | المفتاح |
|---|---|
| 18 | `soroban_anzan_stats` |
| 19 | `soroban_practice_stats` |
| 20 | `soroban_anzan_badges` |
| 21 | `soroban_anzan_audio_badges` |

#### المجموعة 6 — ثانوية ✅
| # | المفتاح |
|---|---|
| 22 | `soroban_unlocked_secrets` |
| 23 | `soroban_welcome_seen` |

#### المجموعة 7 — مؤقتة 🟡
| # | المفتاح |
|---|---|
| 24 | `soroban_placement_recommended` |
| 25 | `soroban_placement_weak_skills` |
| 26 | `soroban_level_test_last_attempt_L0` |

#### 🚨 المجموعة 8 — خطيرة
| # | المفتاح | المشكلة |
|---|---|---|
| 27 | `soroban-completed-lessons` (بـ `-`) | 🔴 مكرر خطأً — يبحث فيه `badgeChecker` + `useQuests` |
| 28 | `sorobanmind-stats` | 🔴 قديم — موجود في `badgeChecker` + `useQuests` |

### 8.4 الإصلاح الشامل

**المبدأ:** `progressStore` + `srb_progress` = المصدران الوحيدان.

**الخطوات:**
1. إضافة `completedLessons` إلى `srb_progress`.
2. تعديل `App.tsx` — الكتابة في `progressStore`.
3. تعديل `LevelScreen` — القراءة من `progressStore`.
4. تعديل `CategoryScreen` — القراءة من `progressStore`.
5. تعديل `LessonScreen` — الكتابة في `progressStore`.
6. تعديل `PracticeScreen` → `markPracticePassed`.
7. تعديل `AnzanScreen` → `markAnzanVisualPassed` + `setAnzanBadge`.
8. تعديل `AudioAnzanScreen` → `markAnzanAudioPassed` + `setAnzanAudioBadge`.
9. **إصلاح `-` × `_`** في `badgeChecker` + `useQuests`.
10. **إصلاح زر "فتح الكل"** — يكتب في `progressStore`.
11. ربط `awardBadge` — عند الإجابة بزمن قياسي.

---
