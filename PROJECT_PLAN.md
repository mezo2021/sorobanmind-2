# 📘 SorobanMind v2 — Master Plan
## الخطة الرئيسية للمشروع

> **آخر تحديث:** 2026-09-24
> **الحالة:** قيد التطوير — الجلسة 1
> **الرابط:** https://mezo2021.github.io/sorobanmind-2

---

## 🎯 1. الرؤية (Vision)

**SorobanMind** = تطبيق تعليمي عربي تفاعلي لتعلّم **السوروبان الياباني** و**الحساب الذهني**.

### 🎯 الهدف:
> **أن يصبح العقل أسرع من الآلة الحاسبة**

### 👥 الجمهور المستهدف (فئتان):

| الفئة | العمر | الأسلوب |
|-------|-------|---------|
| 🧒 **المستوى الأول** | 5-12 سنة | مرح، قصص، ألعاب، سوروبانا |
| 🧑 **المستوى الثاني** | 13+ سنة | جدي، رسمي، إتقان |

### 🌍 اللغات:
- **العربية** (أساسية) — i18n كامل
- **الإنجليزية** (ثانوية) — قابلة للتفعيل

---

## 🏗️ 2. المعمارية العامة

### 📊 نموذج "Fusion"

```
┌────────────────────────────────────────────────────┐
│              SorobanMind v2                         │
├────────────────────────────────────────────────────┤
│                                                     │
│  [Role Selection]  ← البطل / ولي الأمر             │
│         ↓                                           │
│  [Category Selection]  ← 5-12 / 13+                │
│         ↓                                           │
│  [Welcome Screen]  ← كل 7 أيام (مع سوروبانا)       │
│         ↓                                           │
│  [Hero Dashboard]  ← الصفحة الرئيسية               │
│         ↓                                           │
│  ┌──────────────┬──────────────┬──────────────┐    │
│  │              │              │              │    │
│  ▼              ▼              ▼              ▼    │
│ [Learn v1]  [Curriculum v2] [Enrichment] [Anzan]  │
│ 14 درساً    20 مستوى        E1/E2/E3      بصري+سمعي│
│              │              │              │      │
│              └──────┬───────┴──────────────┘      │
│                     ▼                              │
│              [Adaptive Engine]                     │
│              يتكيّف مع مستوى كل طالب              │
│                                                    │
└────────────────────────────────────────────────────┘
```

### 🔗 الطبقات:

| الطبقة | الوصف | المصدر |
|--------|-------|--------|
| **v1 (Base)** | الشاشات، الأصوات، الشخصيات، الألعاب | تطبيقك الأصلي |
| **v2 (New)** | محرك السوروبان، المنهج الـ20، i18n | بناء جديد |
| **GPT (Engine)** | التعليم التكيفي، mastery tracking | من ChatGPT |
| **Fusion (UI)** | الدمج بين v1 + v2 | الآن |

---

## 🎓 3. المنهج الدراسي

### 🧒 المستوى الأول (5-12 سنة)

**الترتيب:**
```
📖 المقدمة (الإثراء)
├── E1: رياضيات الأصابع (Finger Math)
└── E2: أسرار جدول الضرب (Magic Secrets)

        ↓
        
🎓 المنهج الأساسي (منهج GPT — 20 مستوى)
├── L00: التعرّف على السوروبان
├── L01: الأرقام 0-9
├── L02: القيمة المكانية
├── L03: الجمع المباشر
├── L04: مكملات الخمسة — جمع
├── L05: مكملات الخمسة — طرح
├── L06: مكملات العشرة — جمع
├── L07: مكملات العشرة — طرح
├── L08: الجمع متعدد الخانات
├── L09: الطرح متعدد الخانات
├── L10: العمليات المختلطة
├── L11: التخزين الذهني
├── L12: الأنزان البصري
├── L13: الأنزان السمعي
├── L14: الفلاش أنزان
├── L15: الضرب على السوروبان
├── L16: القسمة على السوروبان
├── L17: الكسور العشرية
├── L18: Mitori-zan
├── L19: المنافسات
└── L20: الشهادة الدولية
```

### 🧑 المستوى الثاني (13+ سنة)

**الترتيب:**
```
📖 المقدمة (الإثراء)
└── E3: الضرب الفيدي (Vedic Multiplication)

        ↓
        
🎓 نفس المنهج الأساسي (L00-L20)
   لكن بأسلوب رسمي — بدون سوروبانا
```

### 🔑 الفرق بين المستويين:

| العنصر | 5-12 | 13+ |
|--------|------|-----|
| الشخصية | سوروبانا | لا شيء |
| الأصوات | MP3 طفولية | TTS رسمي |
| الألوان | بنفسجي/ذهبي | أزرق/نيلي |
| التغذية الراجعة | "يا بطل!" | "أحسنت، تقدم ملحوظ" |
| الجلسة | 10-15 دقيقة | 25-40 دقيقة |
| المكافآت | نجوم، مغامرات، XP | شهادات، مستويات KYU |
| الإثراء | الأصابع + الأسرار | الضرب الفيدي |

---

## 🧠 4. محرك التعليم التكيّفي (Adaptive Engine)

> **من ChatGPT — أهم ميزة جديدة**

### 🎯 الفكرة:

**بدلاً من أن جميع الطلاب يرون نفس الأسئلة، كل طالب يرى أسئلة مخصّصة حسب:**

1. **مستواه** (Mastery)
2. **نقاط ضعفه** (Weak Skills)
3. **سرعته** (Avg Time)
4. **دقته** (Accuracy)

### 📊 المكوّنات:

#### أ) `masteryTracker.ts`
**يتتبع إتقان كل مهارة:**

```ts
interface SkillProgress {
  skillId: string;
  attempts: number;
  correct: number;
  consecutiveCorrect: number;  // سلسلة صحيحة
  avgTimeMs: number;            // متوسط الزمن
  masteredAt?: string;
}

interface MasteryCriteria {
  minCorrect: number;           // عدد صحيح أدنى
  accuracy: number;              // نسبة دقة
  maxTimePerProblem: number;    // زمن أقصى
  consecutiveCorrect: number;   // سلسلة إجبارية
}
```

#### ب) `problemGenerator.ts`
**يولّد مسائل وفق قواعد السوروبان:**

```ts
interface ProblemGeneratorSpec {
  type: 'numbers' | 'add-subtract' | 'build-soroban';
  constraints: {
    min: number;
    max: number;
    movement?: MovementType;   // direct, five-friend, ...
    seed?: number;              // لإعادة إنتاج نفس التسلسل
  };
}

// يستخدم `sorobanEngine` للتحقق من صحة المسألة تربوياً
```

#### ج) `adaptiveEngine.ts`
**يقرر الأسئلة التالية:**

```ts
// خوارزمية بسيطة:
// - 70% من مهارات ضعيفة
// - 30% من مهارات جديدة
// - إذا كانت السلسلة صحيحة، تزيد الصعوبة تلقائياً
```

### 🎯 الفائدة:

- كل طالب يرى أسئلة مختلفة
- التقدم تلقائي عند الإتقان
- لا ملل من التكرار
- لا إحباط من الصعوبة

---

## 📁 5. البنية المعمارية الكاملة

```
src/
│
├── 📄 App.tsx                          # نقطة الدخول + Screen routing
├── 📄 main.tsx                          # تهيئة React
├── 📄 index.css                         # أنماط v1 (glass, btn-primary)
├── 📄 vite-env.d.ts                     # أنواع الملفات الثابتة
│
├── 📁 i18n/                             # الترجمة (v2)
│   ├── ar.ts                            # ~180 مفتاح عربي
│   ├── en.ts                            # ~180 مفتاح إنجليزي
│   ├── index.ts                         # نظام الترجمة
│   └── useTranslation.ts                # hook الترجمة
│
├── 📁 curriculum/                       # المنهج (v2)
│   ├── types.ts                         # أنواع CurriculumLevel, Skill
│   └── levels/
│       ├── types.ts                     # LevelContent
│       ├── level-00.ts                  # ✅ مبني
│       ├── level-01.ts                  # ✅ مبني
│       ├── level-02.ts                  # ✅ مبني
│       ├── level-03.ts                  # ✅ مبني
│       ├── level-04.ts                  # ✅ مبني
│       ├── level-05.ts                  # ✅ مبني
│       ├── level-06.ts → level-20.ts    # ⏳ لاحقاً
│       └── index.ts                     # فهرس المستويات
│
├── 📁 engine/                           # المحرك (v2)
│   ├── sorobanMoves.ts                  # ✅ حركات الخرزات
│   ├── sorobanEngine.ts                 # ✅ محرك السوروبان
│   ├── problemGenerator.ts              # ⏳ من GPT
│   ├── masteryTracker.ts                # ⏳ من GPT
│   └── adaptiveEngine.ts                # ⏳ من GPT
│
├── 📁 store/                            # الحالة (v2)
│   └── progressStore.ts                 # Zustand + localStorage
│
├── 📁 data/
│   ├── modes.ts                         # ✅ فئات (kids, teens)
│   ├── curriculum.ts                    # ✅ فهرس L00-L20
│   ├── enrichment.ts                    # ✅ فهرس الإثراء
│   └── legacy/                          # v1 (منفصل)
│       ├── types.ts                     # v1 types
│       ├── data.ts                      # v1 levels + quests
│       └── learnModules.ts              # v1's 14 lessons
│
├── 📁 hooks/
│   ├── useSpeech.ts                     # ✅ TTS
│   ├── useSorobanaVoice.ts              # ✅ MP3
│   ├── useSorobanLogic.ts               # ✅ منطق السوروبان
│   ├── useBeadSound.ts                  # ✅ صوت الخرزات
│   ├── useBeadHaptics.ts                # ✅ اهتزاز
│   ├── useQuests.ts                     # ⏳ من v1
│   ├── useGameStats.ts                  # ⏳ من v1
│   ├── useCharacterVoice.ts             # ⏳ من v1
│   ├── useSound.ts                      # ⏳ من v1
│   └── useConfetti.ts                   # ⏳ من v1
│
├── 📁 utils/
│   ├── audioAnzanBadges.ts              # ⏳ من v1
│   ├── badgeChecker.ts                  # ⏳ من v1
│   ├── skillsChecker.ts                 # ⏳ من v1
│   └── certificateGenerator.ts          # ⏳ من v1
│
├── 📁 components/
│   ├── soroban2d5/                      # ✅ السوروبان التفاعلي
│   │   ├── Soroban2D5.tsx
│   │   ├── Rod2D5.tsx
│   │   ├── Bead2D5.tsx
│   │   ├── useSorobanLogic.ts
│   │   ├── useBeadSound.ts
│   │   └── useBeadHaptics.ts
│   │
│   ├── avatars/
│   │   └── ImageAvatar.tsx              # ⏳ من v1
│   │
│   ├── SorobanaCompanion.tsx            # ✅ الشخصية الصوتية
│   ├── Companion.tsx                    # ⏳ من v1
│   ├── CharacterSelector.tsx            # ⏳ من v1
│   ├── FloatingCompanion.tsx            # ⏳ من v1
│   ├── NameInputModal.tsx               # ⏳ من v1
│   ├── BadgeModal.tsx                   # ⏳ من v1
│   ├── SpeechButton.tsx                 # ⏳ من v1
│   ├── CertificateLogo.tsx              # ⏳ من v1
│   ├── CertificateMedal.tsx             # ⏳ من v1
│   └── DebugOverlay.tsx                 # ⏳ من v1
│
├── 📁 screens/
│   ├── RoleSelection.tsx                # ⏳ من v1 (مُعدّل)
│   ├── WelcomeScreen.tsx                # ⏳ من v1
│   ├── Header.tsx                       # ⏳ من v1
│   ├── HeroDashboard.tsx                # ⏳ من v1 (مُعدّل)
│   ├── GuardianDashboard.tsx            # ⏳ من v1
│   ├── CategorySelectScreen.tsx         # ✅ v2
│   ├── CurriculumScreen.tsx             # ✅ v2
│   ├── EnrichmentScreen.tsx             # ✅ v2
│   ├── LevelScreen.tsx                  # ✅ v2
│   ├── LearnScreen.tsx                  # ⏳ من v1
│   ├── PracticeScreen.tsx               # ⏳ من v1
│   ├── AnzanScreen.tsx                  # ⏳ من v1
│   ├── AudioAnzanScreen.tsx             # ⏳ من v1
│   ├── QuestsScreen.tsx                 # ⏳ من v1
│   ├── FinalExam.tsx                    # ⏳ من v1
│   ├── CertificateScreen.tsx            # ⏳ من v1
│   ├── MultiplicationScreen.tsx         # ⏳ من v1
│   ├── MagicSecretsScreen.tsx           # ⏳ من v1
│   ├── CrossMultiplicationScreen.tsx    # ⏳ من v1
│   └── DivisionScreen.tsx               # ⏳ من v1
│
├── 📄 examBank2.ts                      # ⏳ بنك أسئلة الامتحانات
├── 📄 types.ts                          # re-export من data/legacy/types
│
├── 📁 assets/
│   ├── logo-header.png                  ✅
│   ├── logo-intro.webp                  ✅
│   ├── logo-certificate.webp            ✅
│   ├── sorobana/
│   │   ├── sorobana-main.webp           ✅
│   │   └── sorobana-teaching-pointing.webp ✅
│   └── avatars/
│       ├── sham.png                     ✅
│       ├── rayan.png                    ✅
│       ├── bana.png                     ✅
│       └── joud2.png                    ✅
│
└── 📁 public/
    └── audio/
        ├── greeting-1/2/3.mp3           ✅
        ├── teaching-1/2/3.mp3           ✅
        ├── correct-1/2.mp3              ✅
        ├── wrong-1/2.mp3                ✅
        ├── end-lesson.mp3               ✅
        ├── welcome-sorobana.mp3         ✅
        └── stories/
            └── story-0 → story-9.mp3    ✅
```

---

## 🎯 6. القرارات التصميمية (Decision Log)

| # | القرار | التاريخ | السبب |
|---|--------|---------|-------|
| 1 | استخدام `assets` (بدون حرف e زائد) | 2026-09-24 | تصحيح إملائي |
| 2 | فصل v1 types في `data/legacy/` | 2026-09-24 | تجنّب التعارض مع v2 |
| 3 | الإبقاء على `learnModules.ts` v1 | 2026-09-24 | كنز من 14 درساً |
| 4 | دمج v1 + v2 تحت `HeroDashboard` | 2026-09-24 | استفادة قصوى |
| 5 | استخدام `@/` alias (tsconfig + vite) | 2026-09-24 | أنظف imports |
| 6 | رفع `vite-env.d.ts` لدعم الملفات الثابتة | 2026-09-24 | ضروري للأصول |
| 7 | `Screen` type موحّد في `App.tsx` | 2026-09-24 | إدارة مركزية |
| 8 | الفئتان: kids (5-12) + teens (13+) | 2026-09-24 | تلبية الجمهورين |
| 9 | الإثراء منفصل حسب الفئة | 2026-09-24 | منطق تربوي |
| 10 | تعليم تكيفي من GPT | 2026-09-24 | ميزة تنافسية |

---

## 🗺️ 7. خارطة الطريق (Roadmap)

### 🔷 المرحلة 1 — التأسيس ✅
- [x] إنشاء مستودع `sorobanmind-2`
- [x] رفع 20 ملف أساسي
- [x] محرك السوروبان (sorobanEngine, sorobanMoves)
- [x] i18n كامل (180 مفتاح)
- [x] Zustand store
- [x] GitHub Actions للنشر التلقائي
- [x] رفع الأصوات (21 ملف MP3)
- [x] رفع الصور (8 ملفات)
- [x] 6 مستويات (L00-L05)
- [x] CategorySelect + Curriculum + Enrichment
- [x] LevelScreen الأساسي

### 🔷 المرحلة 2 — نقل v1 (الجلسة الحالية)
- [ ] examBank2 + DebugOverlay + ImageAvatar
- [ ] Companion + CharacterSelector + FloatingCompanion
- [ ] NameInputModal + BadgeModal + SpeechButton
- [ ] CertificateLogo + CertificateMedal
- [ ] 5 Hooks (useQuests, useGameStats, useCharacterVoice, useSound, useConfetti)
- [ ] 4 Utils (audioAnzanBadges, badgeChecker, skillsChecker, certificateGenerator)
- [ ] 3 data legacy files (types, data, learnModules)
- [ ] 5 screens أساسية (RoleSelection, Welcome, Header, HeroDashboard, Guardian)
- [ ] 11 screens تعليمية (Learn, Practice, Anzan, AudioAnzan, Quests, FinalExam, Certificate, Multiplication, MagicSecrets, CrossMult, Division)
- [ ] App.tsx موحّد

### 🔷 المرحلة 3 — التعليم التكيفي (من GPT)
- [ ] masteryTracker.ts
- [ ] problemGenerator.ts
- [ ] adaptiveEngine.ts
- [ ] ربطها بـ LevelScreen

### 🔷 المرحلة 4 — إكمال المنهج
- [ ] L06 → L20 (15 مستوى)
- [ ] اختبارات المستويات
- [ ] Mitori-zan screen

### 🔷 المرحلة 5 — التلميع
- [ ] ضغط الصور
- [ ] PWA (offline)
- [ ] اختبار على أجهزة مختلفة
- [ ] تحسينات الأداء

### 🔷 المرحلة 6 — النشر
- [ ] Google Play (APK)
- [ ] تحسينات SEO
- [ ] تسويق

---

## 📊 8. حالة الملفات (File Status)

### ✅ مكتملة:

| المجموعة | العدد |
|----------|-------|
| i18n | 4 |
| curriculum (types + levels) | 8 |
| engine | 2 |
| store | 1 |
| data (v2) | 3 |
| components/soroban2d5 | 6 |
| components (main) | 2 |
| hooks | 5 |
| screens (v2) | 4 |
| **المجموع** | **35** |

### ⏳ في الانتظار:

| المجموعة | العدد |
|----------|-------|
| components (v1) | 8 |
| hooks (v1) | 5 |
| utils | 4 |
| data legacy | 3 |
| screens (v1) | 16 |
| examBank2 | 1 |
| engine (adaptive) | 3 |
| curriculum levels (L06-L20) | 15 |
| **المجموع** | **55** |

### 🎯 الإجمالي:
- **مكتمل:** 35 ملف (39%)
- **متبقي:** 55 ملف (61%)

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
| GitHub Actions | — | النشر |
| GitHub Pages | — | الاستضافة |

---

## 🎨 10. الهوية البصرية

### 🎨 الألوان:

| اللون | الاستخدام | Hex |
|-------|-----------|-----|
| Purple | أساسي | #a855f7 |
| Electric | ثانوي | #3b82f6 |
| Emerald | نجاح | #10b981 |
| Gold | تمييز | #fbbf24 |
| Ink | خلفية | #0a0a1a |

### ✍️ الخطوط:
- **Baloo 2** — عناوين (display)
- **Cairo** — نصوص (body)

### 🎭 الأنماط:
- `glass-card` — بطاقات زجاجية
- `btn-primary` — أزرار رئيسية
- `btn-ghost` — أزرار ثانوية
- `shimmer-text` — عناوين متلألئة

---

## 📝 11. ملاحظات للتطوير

### ⚠️ قواعد ذهبية:

1. **لا تحذف شيئاً** من v1 بدون نسخة احتياطية
2. **لا تُعدّل `learnModules.ts`** — كنز
3. **لا تستبدل** `localStorage` في v1 — يعمل
4. **لا تخلط** بين `types.ts` (v2) و `data/legacy/types.ts` (v1)
5. **استخدم `@/`** لكل import من `src/`

### 🎯 أهداف الجودة:

- [ ] زمن تحميل < 3 ثوان
- [ ] لا أخطاء console
- [ ] يعمل على Chrome, Safari, Firefox
- [ ] متجاوب مع الجوالات الصغيرة
- [ ] PWA قابل للتحميل

---

## 🔗 12. روابط مهمة

| الرابط | الوصف |
|--------|-------|
| [Live Demo](https://mezo2021.github.io/sorobanmind-2) | التطبيق المباشر |
| [GitHub Repo](https://github.com/mezo2021/sorobanmind-2) | المستودع |
| [Actions](https://github.com/mezo2021/sorobanmind-2/actions) | سجل البناء |
| [v1 القديم](https://github.com/mezo2021/sorobanmind-platform_2026) | المصدر |

---

## 📅 13. سجل الجلسات

### 🗓️ الجلسة 1 (2026-09-24)
**الأهداف:**
- إنشاء المستودع
- محرك السوروبان
- i18n
- رفع الأصول
- 6 مستويات
- شاشات v2 الأساسية

**الإنجازات:**
- ✅ 35 ملف مكتمل
- ✅ 21 ملف صوتي
- ✅ 8 صور
- ✅ GitHub Actions يعمل
- ✅ التطبيق منشور

**المتبقي:**
- ⏳ نقل v1
- ⏳ محرك GPT
- ⏳ L06-L20

---

## 🎯 14. الأولويات الحالية

### 🔴 أولوية قصوى (الآن):
1. **نقل v1** (كل الشاشات)
2. **examBank2 + DebugOverlay**
3. **App.tsx موحّد**

### 🟡 أولوية متوسطة (بعدها):
4. **محرك GPT** (Adaptive)
5. **L06-L20**

### 🟢 أولوية منخفضة:
6. **PWA**
7. **APK**
8. **تلميع نهائي**

---

## 📞 15. ملاحظات المطوّر

**المطوّر:** مصطفى علي أكر ([@mezo2021](https://github.com/mezo2021))

**المرجع المنهجي:**
- **Takashi Kojima** — "The Japanese Abacus: Its Use and Theory"
- **Japan Soroban Association** (日本珠算連盟)

**الشكر:**
- ChatGPT — للتعليم التكيفي والمنهج
- مجتمع السوروبان العربي

---

<div align="center">

## 🧮 SorobanMind

**صُنع بحب لأطفال العالم العربي** 🌍

**حيث يصبح العقل أسرع من الآلة الحاسبة** 🚀

---

*آخر تحديث: 2026-09-24 — الجلسة 1*

</div>
