📄 PROJECT_PLAN.md — النسخة المحدثة


```markdown
# 📘 SorobanMind v2 — Master Plan
## الخطة الرئيسية للمشروع

> **آخر تحديث:** 2026-09-24 (الجلسة 1)
> **الحالة:** 🟢 التطبيق يعمل — الهيكل الكامل جاهز
> **الرابط:** https://mezo2021.github.io/sorobanmind-2
> **المستودع:** https://github.com/mezo2021/sorobanmind-2

---

## 🎯 1. الرؤية (Vision)

**SorobanMind** = تطبيق تعليمي عربي تفاعلي لتعلّم **السوروبان الياباني** و**الحساب الذهني**.

### 🎯 الهدف:
> **أن يصبح العقل أسرع من الآلة الحاسبة**

### 👥 الجمهور المستهدف:

| الفئة | العمر | الأسلوب |
|-------|-------|---------|
| 🧒 المستوى الأول | 5-12 سنة | مرح، قصص، ألعاب، سوروبانا |
| 🧑 المستوى الثاني | 13+ سنة | جدي، رسمي، إتقان |

### 🌍 اللغات:
- **العربية** (أساسية) — i18n كامل
- **الإنجليزية** (ثانوية)

---

## 🏗️ 2. المعمارية العامة

### 📊 نموذج "Fusion" (v1 + v2 + GPT)

```
┌────────────────────────────────────────────────────┐
│              SorobanMind v2                         │
├────────────────────────────────────────────────────┤
│                                                     │
│  [Welcome Screen]  ← كل 7 أيام                     │
│         ↓                                           │
│  [Role Selection]  ← البطل / ولي الأمر             │
│         ↓                                           │
│  ┌──────────────┬─────────────────┐                │
│  │              │                 │                │
│  ▼              ▼                 ▼                │
│ [Hero]      [Guardian]      [Category]            │
│  │              │                 │                │
│  ▼              ▼                 ▼                │
│ Dashboards  Stats Panel    [Curriculum v2]        │
│                              └── L00-L20          │
│                                                     │
└────────────────────────────────────────────────────┘
```

### 🔗 الطبقات:

| الطبقة | الوصف | المصدر |
|--------|-------|--------|
| **v1 (Base)** | الشاشات، الشخصيات، الأصوات، الألعاب | تطبيقك الأصلي |
| **v2 (New)** | محرك السوروبان، المنهج، i18n | بناء جديد |
| **GPT (Engine)** | التعليم التكيفي، mastery | من ChatGPT |
| **Fusion (UI)** | الدمج بين v1 + v2 | تم الآن ✅ |

---

## 🎓 3. المنهج الدراسي

### 🧒 المستوى الأول (5-12 سنة)

```
📖 الإثراء
├── E1: رياضيات الأصابع (Finger Math)
├── E2: أسرار جدول الضرب (Magic Secrets)
└── E3: الضرب الفيدي (للمستوى الثاني فقط)

        ↓

🎓 المنهج الأساسي (منهج GPT)
├── L00: التعرّف على السوروبان       ✅ مبني
├── L01: الأرقام 0-9                  ✅ مبني
├── L02: القيمة المكانية              ✅ مبني
├── L03: الجمع المباشر                ✅ مبني
├── L04: مكملات الخمسة — جمع          ✅ مبني
├── L05: مكملات الخمسة — طرح          ✅ مبني
├── L06: مكملات العشرة — جمع          ⏳ قادم
├── L07: مكملات العشرة — طرح          ⏳ قادم
├── L08: الجمع متعدد الخانات           ⏳ قادم
├── L09: الطرح متعدد الخانات           ⏳ قادم
├── L10: العمليات المختلطة             ⏳ قادم
├── L11: التخزين الذهني               ⏳ قادم
├── L12: الأنزان البصري                ⏳ قادم
├── L13: الأنزان السمعي                ⏳ قادم
├── L14: الفلاش أنزان                  ⏳ قادم
├── L15: الضرب على السوروبان           ⏳ قادم
├── L16: القسمة على السوروبان          ⏳ قادم
├── L17: الكسور العشرية                ⏳ قادم
├── L18: Mitori-zan                    ⏳ قادم
├── L19: المنافسات                     ⏳ قادم
└── L20: الشهادة الدولية               ⏳ قادم
```

---

## 🧠 4. محرك التعليم التكيّفي (Adaptive Engine)

> **من ChatGPT — الميزة التنافسية القادمة**

### 🎯 الفكرة:

**كل طالب يرى أسئلة مخصّصة حسب:**
1. مستواه (Mastery)
2. نقاط ضعفه (Weak Skills)
3. سرعته (Avg Time)
4. دقته (Accuracy)

### 📊 المكوّنات المطلوبة:

#### أ) `masteryTracker.ts` ⏳
يتتبع إتقان كل مهارة عبر:
- عدد المحاولات
- الإجابات الصحيحة المتتالية
- متوسط الزمن
- نسبة الدقة

#### ب) `problemGenerator.ts` ⏳
يولّد مسائل وفق قواعد السوروبان:
- `direct` / `five-friend-add` / `ten-friend-add` / `carry`
- مع دعم seed للتكرار

#### ج) `adaptiveEngine.ts` ⏳
يقرر الأسئلة التالية:
- 70% مهارات ضعيفة
- 30% مهارات جديدة
- صعوبة تتصاعد تلقائياً

---

## 📁 5. البنية المعمارية الكاملة

```
src/
│
├── 📄 App.tsx                          ✅ (v1+v2 unified)
├── 📄 main.tsx                          ✅
├── 📄 index.css                         ✅ (v1 styles)
├── 📄 vite-env.d.ts                     ✅
├── 📄 types.ts                          ✅ (v1 types)
├── 📄 examBank2.ts                      ✅ (exam questions)
│
├── 📁 i18n/                             ✅ (4 ملفات)
│   ├── ar.ts
│   ├── en.ts
│   ├── index.ts
│   └── useTranslation.ts
│
├── 📁 curriculum/                       ✅
│   ├── types.ts
│   └── levels/
│       ├── types.ts                     ✅
│       ├── level-00.ts → level-05.ts    ✅ (6 مستويات)
│       └── index.ts                     ✅
│
├── 📁 engine/                           ✅
│   ├── sorobanMoves.ts                  ✅
│   ├── sorobanEngine.ts                 ✅
│   ├── problemGenerator.ts              ⏳ GPT
│   ├── masteryTracker.ts                ⏳ GPT
│   └── adaptiveEngine.ts                ⏳ GPT
│
├── 📁 store/                            ✅
│   └── progressStore.ts                 (Zustand)
│
├── 📁 data/                             ✅
│   ├── modes.ts                         (فئات kids/teens)
│   ├── curriculum.ts                    (فهرس L00-L20)
│   ├── enrichment.ts                    (E1-E3)
│   ├── index.ts                         (v1 data)
│   └── learnModules.ts                  (v1: 10 دروس)
│
├── 📁 hooks/                            ✅
│   ├── useSpeech.ts                     ✅
│   ├── useSorobanaVoice.ts              ✅ (MP3)
│   ├── useQuests.ts                     ✅
│   ├── useGameStats.ts                  ✅
│   ├── useCharacterVoice.ts             ✅
│   ├── useSound.ts                      ✅
│   └── useConfetti.ts                   ✅
│
├── 📁 utils/                            ✅
│   ├── audioAnzanBadges.ts              ✅
│   ├── badgeChecker.ts                  ✅
│   ├── skillsChecker.ts                 ✅
│   └── certificateGenerator.ts          ✅
│
├── 📁 components/
│   ├── 📁 soroban2d5/                   ✅ (6 ملفات)
│   ├── 📁 avatars/
│   │   └── ImageAvatar.tsx              ✅
│   ├── Companion.tsx                    ✅
│   ├── CharacterSelector.tsx            ✅
│   ├── FloatingCompanion.tsx            ✅
│   ├── SorobanaCompanion.tsx            ✅
│   ├── NameInputModal.tsx               ✅
│   ├── BadgeModal.tsx                   ✅
│   ├── DebugOverlay.tsx                 ✅
│   ├── SpeechButton.tsx                 ⏳
│   ├── CertificateLogo.tsx              ⏳
│   └── CertificateMedal.tsx             ⏳
│
├── 📁 screens/
│   ├── 📌 v2 (منهج GPT)                 ✅
│   │   ├── CategorySelectScreen.tsx     ✅
│   │   ├── CurriculumScreen.tsx         ✅
│   │   ├── EnrichmentScreen.tsx         ✅
│   │   └── LevelScreen.tsx              ✅
│   │
│   ├── 📌 v1 (الواجهات)                 ✅
│   │   ├── Header.tsx                   ✅
│   │   ├── WelcomeScreen.tsx            ✅
│   │   ├── RoleSelection.tsx            ✅
│   │   ├── HeroDashboard.tsx            ✅
│   │   └── GuardianDashboard.tsx        ✅
│   │
│   └── 📌 v1 (قيد النقل)                ⏳
│       ├── LearnScreen.tsx              ⏳
│       ├── PracticeScreen.tsx           ⏳
│       ├── AnzanScreen.tsx              ⏳
│       ├── AudioAnzanScreen.tsx         ⏳
│       ├── QuestsScreen.tsx             ⏳
│       ├── FinalExam.tsx                ⏳
│       ├── CertificateScreen.tsx        ⏳
│       ├── MultiplicationScreen.tsx     ⏳
│       ├── MagicSecretsScreen.tsx       ⏳
│       ├── CrossMultiplicationScreen.tsx ⏳
│       └── DivisionScreen.tsx           ⏳
│
├── 📁 assets/                           ✅
│   ├── logo-header.png                  ✅
│   ├── logo-intro.webp                  ✅
│   ├── logo-certificate.webp            ✅
│   ├── sorobana/ (2 صور)                ✅
│   └── avatars/ (4 صور)                 ✅
│
└── 📁 public/
    └── audio/                           ✅ (21 ملف MP3)
        ├── greeting/teaching/correct/wrong  ✅
        └── stories/ (story-0 → story-9)     ✅
```

---

## 🎯 6. القرارات التصميمية (Decision Log)

| # | القرار | السبب |
|---|--------|-------|
| 1 | **اسم `assets`** (بدون حرف e زائد) | تصحيح إملائي |
| 2 | **v1 types في `src/types.ts`** | منفصلة عن v2 curriculum |
| 3 | **`learnModules.ts` v1 محفوظ** | للإثراء + الاستعارة |
| 4 | **دمج v1 + v2 في `App.tsx`** | استفادة قصوى |
| 5 | **`@/` alias** (tsconfig + vite) | أنظف imports |
| 6 | **`vite-env.d.ts` للأصول** | ضروري للصور والأصوات |
| 7 | **`Screen` type موحّد** | إدارة مركزية |
| 8 | **فئتان: kids + teens** | تلبية الجمهورين |
| 9 | **زر "التعلّم" → Curriculum v2** | يحفظ منهج GPT |
| 10 | **منهج GPT أولوية** | لا يتغير أبداً |

---

## 🗺️ 7. خارطة الطريق (Roadmap)

### ✅ المرحلة 1 — التأسيس (مكتملة)
- [x] إنشاء مستودع
- [x] رفع 20 ملف أساسي
- [x] محرك السوروبان
- [x] i18n كامل
- [x] Zustand store
- [x] GitHub Actions

### ✅ المرحلة 2 — الأصول (مكتملة)
- [x] 21 ملف صوتي MP3
- [x] 8 صور (سوروبانا + أفاتار + شعارات)
- [x] `vite-env.d.ts`
- [x] إصلاح `@/` alias

### ✅ المرحلة 3 — المنهج v2 (مكتملة جزئياً)
- [x] 6 مستويات (L00-L05)
- [x] CategorySelectScreen
- [x] CurriculumScreen
- [x] EnrichmentScreen
- [x] LevelScreen

### ✅ المرحلة 4 — نقل v1 الأساسي (مكتملة)
- [x] types.ts (v1)
- [x] data/index.ts
- [x] data/learnModules.ts
- [x] examBank2.ts
- [x] DebugOverlay.tsx
- [x] ImageAvatar.tsx
- [x] Companion.tsx
- [x] CharacterSelector.tsx
- [x] FloatingCompanion.tsx
- [x] NameInputModal.tsx
- [x] BadgeModal.tsx
- [x] utils/ (4 ملفات)
- [x] hooks/ (5 ملفات جديدة)
- [x] Header.tsx
- [x] RoleSelection.tsx
- [x] WelcomeScreen.tsx
- [x] HeroDashboard.tsx
- [x] GuardianDashboard.tsx
- [x] App.tsx (unified)

### 🎯 المرحلة 5 — إكمال نقل v1 (الجلسة القادمة)
- [ ] نقل `LearnScreen.tsx` (كمرجع، غير مرتبط)
- [ ] نقل `PracticeScreen.tsx` + ربطه
- [ ] نقل `AnzanScreen.tsx` + `AudioAnzanScreen.tsx`
- [ ] نقل `QuestsScreen.tsx`
- [ ] نقل `FinalExam.tsx`
- [ ] نقل `CertificateScreen.tsx` + Logo + Medal
- [ ] نقل `MultiplicationScreen.tsx`
- [ ] نقل `MagicSecretsScreen.tsx`
- [ ] نقل `CrossMultiplicationScreen.tsx`
- [ ] نقل `DivisionScreen.tsx`
- [ ] نقل `SpeechButton.tsx`

### 🎯 المرحلة 6 — محرك GPT (Adaptive)
- [ ] `masteryTracker.ts`
- [ ] `problemGenerator.ts`
- [ ] `adaptiveEngine.ts`
- [ ] ربطها بـ `LevelScreen`

### 🎯 المرحلة 7 — إكمال المنهج
- [ ] L06 → L20 (15 مستوى)
- [ ] اختبارات المستويات
- [ ] Mitori-zan screen

### 🎯 المرحلة 8 — التلميع
- [ ] ضغط الصور (WebP)
- [ ] PWA (offline)
- [ ] اختبار على أجهزة مختلفة
- [ ] تحسينات الأداء

### 🎯 المرحلة 9 — النشر
- [ ] Google Play (APK)
- [ ] تحسينات SEO
- [ ] تسويق

---

## 📊 8. حالة الملفات الحالية

### ✅ مكتملة (61+ ملف):

| المجموعة | العدد |
|----------|-------|
| i18n | 4 |
| curriculum/levels | 8 |
| engine | 2 |
| store | 1 |
| data | 5 |
| hooks | 7 |
| utils | 4 |
| components (main) | 7 |
| components/soroban2d5 | 6 |
| components/avatars | 1 |
| screens | 9 |
| examBank2 | 1 |
| assets | 8 |
| audio | 21 |
| **المجموع** | **~84 ملف** |

### ⏳ متبقية:

| المجموعة | العدد |
|----------|-------|
| screens (v1 قيد النقل) | 11 |
| components (شهادة) | 3 |
| engine (adaptive) | 3 |
| curriculum levels (L06-L20) | 15 |
| **المجموع** | **32 ملف** |

### 🎯 الإجمالي:
- **مكتمل:** 84 ملف (72%)
- **متبقي:** 32 ملف (28%)

---

## 🔧 9. التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| React | 18.3.1 | UI |
| TypeScript | 5.5.3 | اللغة |
| Vite | 5.3.3 | البناء |
| Tailwind CSS | 3.4.4 | التنسيق |
| Framer Motion | 11.0.8 | الحركات |
| Zustand | 4.5.2 | الحالة |
| lucide-react | 0.400.0 | الأيقونات |
| canvas-confetti | 1.9.3 | الاحتفالات |
| GitHub Actions | — | النشر |
| GitHub Pages | — | الاستضافة |

---

## 🎨 10. الهوية البصرية

### 🎨 الألوان:

| اللون | Hex | الاستخدام |
|-------|-----|-----------|
| Purple | #a855f7 | أساسي |
| Electric | #3b82f6 | ثانوي |
| Emerald | #10b981 | نجاح |
| Gold | #fbbf24 | تمييز |
| Ink | #0a0a1a | خلفية |

### ✍️ الخطوط:
- **Baloo 2** — عناوين (display)
- **Cairo** — نصوص (body)

### 🎭 الأنماط:
- `glass-card` — بطاقات زجاجية
- `glass-strong` — زجاج قوي (للـHeader)
- `btn-primary` — أزرار رئيسية
- `btn-ghost` — أزرار ثانوية
- `shimmer-text` — عناوين متلألئة

---

## ⚠️ 11. قواعد ذهبية للتطوير

1. **منهج GPT لا يُلمس** — أولوية قصوى
2. **v1 types منفصل** عن v2 curriculum types
3. **`learnModules.ts` v1 محفوظ** — للإثراء
4. **زر "التعلّم" → Curriculum v2** (وليس LearnScreen v1)
5. **`@/` alias** لكل import من `src/`
6. **لا تحذف شيئاً** من v1 بدون نسخة احتياطية

---

## 🔗 12. روابط مهمة

| الرابط | الوصف |
|--------|-------|
| [Live Demo](https://mezo2021.github.io/sorobanmind-2) | التطبيق المباشر |
| [GitHub Repo](https://github.com/mezo2021/sorobanmind-2) | المستودع |
| [Actions](https://github.com/mezo2021/sorobanmind-2/actions) | سجل البناء |
| [v1 القديم](https://github.com/mezo2021/sorobanmind-platform_2026) | المصدر الأصلي |

---

## 📅 13. سجل الجلسات

### 🗓️ الجلسة 1 (2026-09-24) — ✅ مكتملة

**الأهداف:**
- إنشاء المستودع
- محرك السوروبان
- i18n
- رفع الأصول
- 6 مستويات
- نقل v1 الأساسي

**الإنجازات:**
- ✅ 84 ملف مكتمل
- ✅ 21 ملف صوتي
- ✅ 8 صور
- ✅ GitHub Actions يعمل
- ✅ التطبيق منشور ويعمل
- ✅ Welcome → Role → Dashboard → Curriculum
- ✅ Hero + Guardian Dashboards كاملة
- ✅ 5 Hooks جديدة
- ✅ 4 Utils
- ✅ App.tsx موحّد

### 🗓️ الجلسة 2 (قادمة)

**الأهداف:**
1. نقل باقي شاشات v1 (11 ملف)
2. ربطها بـ HeroDashboard
3. بدء محرك GPT التكيفي

**الملفات المستهدفة:**
- `PracticeScreen.tsx`
- `AnzanScreen.tsx` + `AudioAnzanScreen.tsx`
- `QuestsScreen.tsx`
- `FinalExam.tsx`
- `CertificateScreen.tsx` + Logo + Medal
- `MultiplicationScreen.tsx`
- `MagicSecretsScreen.tsx`
- `CrossMultiplicationScreen.tsx`
- `DivisionScreen.tsx`

---

## 🎯 14. الأولويات الحالية

### 🔴 أولوية قصوى (الجلسة القادمة):
1. **نقل 11 شاشة v1** (Practice, Anzan, Quests, Exam, Certificate, ...)
2. **ربطها بـ HeroDashboard**

### 🟡 أولوية متوسطة (بعدها):
3. **محرك GPT** (masteryTracker + problemGenerator + adaptiveEngine)
4. **L06-L20** (15 مستوى)

### 🟢 أولوية منخفضة:
5. **PWA**
6. **APK (Google Play)**
7. **تلميع نهائي**

---

## 📞 15. ملاحظات المطوّر

**المطوّر:** مصطفى علي أكر ([@mezo2021](https://github.com/mezo2021))

**المرجع المنهجي:**
- Takashi Kojima — "The Japanese Abacus"
- Japan Soroban Association (日本珠算連盟)
- ChatGPT — للتعليم التكيفي والمنهج

**الشكر:**
- مجتمع السوروبان العربي
- كل من ساهم في اختبار التطبيق

---

<div align="center">

## 🧮 SorobanMind

**صُنع بحب لأطفال العالم العربي** 🌍

**حيث يصبح العقل أسرع من الآلة الحاسبة** 🚀

---

*آخر تحديث: 2026-09-24 — نهاية الجلسة 1*
*الحالة: 🟢 التطبيق يعمل — 72% مكتمل*

</div>
```