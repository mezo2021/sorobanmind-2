
📄 PROJECT_PLAN.md — النسخة المحدثة 


```markdown
# 📘 SorobanMind v2 — Master Plan

> **آخر تحديث:** 2026-09-24 (الجلسة مكتملة)
> **الحالة:** 🟢 التطبيق يعمل + بنك أسئلة تكيفي (700 سؤال)
> **الرابط:** https://mezo2021.github.io/sorobanmind-2
> **المستودع:** https://github.com/mezo2021/sorobanmind-2

---

## 🎯 1. الرؤية

**SorobanMind** = تطبيق تعليمي عربي تفاعلي لتعلّم السوروبان الياباني.

### الأهداف:
1. **منهج ياباني أصيل** (Takashi Kojima)
2. **تعليم تكيفي** — كل طالب يحصل على أسئلة مخصّصة
3. **فئتان:** 🧒 5-12 و 🧑 13+

### الميزة التنافسية:
> **محرك تكيفي حقيقي** يفهم مهارات الطفل، يحدد نقاط ضعفه، ويولّد له أسئلة علاجية تلقائياً.

---

## 🧠 2. محرك التعليم التكيفي (Adaptive Engine)

### 📊 الفكرة:

```
الطفل يجيب سؤالاً
     ↓
bank.ts يعرف:
  - skillId (المهارة)
  - ruleId (القاعدة)
  - movement (نوع الحركة)
  - expectedTimeMs (الزمن المتوقع)
     ↓
masteryTracker يقيس:
  - هل الإجابة صحيحة؟
  - كم استغرق؟
  - هل هي متتالية؟
     ↓
adaptiveEngine يقرر:
  - 70% من مهارات ضعيفة
  - 30% من مهارات جديدة
  - صعوبة تتصاعد تلقائياً
```

### المكونات:

| # | الملف | الوظيفة |
|---|-------|---------|
| 1 | `engine/masteryTracker.ts` | يتتبع إتقان كل مهارة |
| 2 | `engine/problemGenerator.ts` | يختار ويولّد الأسئلة |
| 3 | `engine/adaptiveEngine.ts` | يتخذ القرارات التعليمية |
| 4 | `data/bank.ts` | بنك الأسئلة (بيانات فقط) |

---

## 📚 3. بنك الأسئلة — 700 سؤال

### 📁 البنية:

```
src/data/
├── bank.ts                    ← API الرئيسي
├── bank-adapter.ts            ← المحوّل الذكي
└── bank-raw/                  ← البيانات الخام
    ├── types.ts
    ├── raw-01.ts              ← 60 سؤال (أقسام 1-3)
    ├── raw-02.ts              ← 40 سؤال (أقسام 4-5)
    ├── raw-03.ts              ← 40 سؤال (أقسام 6-7)
    ├── raw-04.ts              ← 60 سؤال (أقسام 8-10)
    └── index.ts               ← الفهرس
```

### 📊 التوزيع:

| القسم | المستوى | عدد الأسئلة | الزمن |
|-------|---------|-------------|-------|
| S1: جمع/طرح بسيط | L03 | 20 | 2-3s |
| S2: أصدقاء 5 | L06 | 20 | 3-4s |
| S3: أصدقاء 10 | L08 | 20 | 3-5s |
| S4: قواعد مركبة | L10 | 20 | 4-6s |
| S5: الضرب | L15 | 20 | 5-8s |
| S6: القسمة | L16 | 20 | 6-10s |
| S7: الأعداد السالبة | L13 | 20 | 6-8s |
| S8: العشرية (K) | L17 | 20 | 5-8s |
| S9: الجذور التربيعية | L18 | 20 | 6-10s |
| S10: الجذور التكعيبية | L19 | 20 | 5-12s |

**المجموع:** 200 سؤال مصنّف + 500 سؤال مُبرمج = **700 سؤال**

---

## 🔒 4. القاعدة الذهبية — ما لا يُغيَّر

### ⚠️ هذه الملفات "مجمّدة" — لا تعدّلها:

| # | الملف | السبب |
|---|-------|-------|
| 1 | `data/bank-raw/types.ts` | بنية السؤال الخام |
| 2 | `data/bank-adapter.ts` | خريطة التصنيف |
| 3 | `engine/masteryTracker.ts` | خوارزمية القياس |
| 4 | `engine/adaptiveEngine.ts` | خوارزمية القرار |
| 5 | `curriculum/types.ts` | العقد بين الطبقات |

### 🎯 لماذا؟

> **هذه الملفات تفهم "شكل" السؤال، لا "محتواه".**
>
> **يمكنك إضافة أسئلة جديدة، لكن لا تغيّر حقولها.**

---

## 🎯 5. كيف تستخدم البنك؟

### 🅰️ في الامتحان النهائي:

```ts
import { createPlacementTest, evaluatePlacementTest } from '@/engine/adaptiveEngine';

// 1. عند بدء الامتحان
const questions = createPlacementTest(
  SOROBAN_BANK,    // البنك الكامل
  30,              // 30 سؤالاً
  Date.now()       // seed
);

// 2. عرض الأسئلة على الطفل واحداً واحداً
// 3. تسجيل الإجابات

// 4. بعد الإجابة
const result = evaluatePlacementTest(questions, answers);
// result.recommendedLevelId → المستوى المقترح
// result.weakSkills → المهارات الضعيفة
// result.remediationQuestionIds → أسئلة علاجية
```

### 🅱️ في التدريب العادي:

```ts
import { generateSession } from '@/engine/problemGenerator';

// جلسة من مهارة محددة
const session = generateSession('L06.S01', 10);
// → 10 أسئلة من L06 (أصدقاء 5)
```

### 🅲️ في التدريب العلاجي:

```ts
import { buildRemediationSession } from '@/engine/adaptiveEngine';

// عندما يخطئ الطفل في سؤال معين
const remedial = buildRemediationSession(
  'BANK-021',   // سؤال أخطأ فيه (3 + 4)
  5             // 5 أسئلة مشابهة
);
// → 5 أسئلة من نفس المهارة/القاعدة
```

---

## 📊 6. قواعد احتساب الزمن

### القاعدة الحالية (من الكتاب):

| المستوى | expectedTimeMs | maxTimeMs |
|---------|----------------|-----------|
| L03 (جمع مباشر) | 2000-3000ms | 2× |
| L06 (أصدقاء 5) | 3000-4000ms | 2× |
| L08 (أصدقاء 10) | 3000-5000ms | 2× |
| L10 (مركبة) | 4000-6000ms | 2× |
| L15 (ضرب) | 5000-8000ms | 2× |
| L16 (قسمة) | 6000-10000ms | 2× |
| L17 (عشرية) | 5000-8000ms | 2× |
| L18 (جذور 2) | 6000-10000ms | 2× |
| L19 (جذور 3) | 5000-12000ms | 2× |

### 🎯 القاعدة الرياضية المقترحة (للتطوير المستقبلي):

```ts
expectedTimeMs = baseTime × complexityFactor

baseTime = 3000ms
complexityFactor =
  1 +
  (digits - 1) × 0.5 +
  (hasCarry ? 0.3 : 0) +
  (hasBorrow ? 0.3 : 0) +
  (movement === 'mixed' ? 0.5 : 0)
```

---

## 🏗️ 7. البنية الكاملة للمشروع

```
src/
├── App.tsx                          ✅
├── types.ts                         ✅ (v1)
├── examBank2.ts                     ✅
│
├── curriculum/                      ✅
│   ├── types.ts                     ✅
│   └── levels/ (L00-L05 + L18)      ✅
│
├── engine/                          ✅
│   ├── sorobanMoves.ts              ✅
│   ├── sorobanEngine.ts             ✅
│   ├── masteryTracker.ts            ✅
│   ├── problemGenerator.ts          ✅
│   └── adaptiveEngine.ts            ✅
│
├── data/                            ✅
│   ├── bank.ts                      ✅
│   ├── bank-adapter.ts              ✅ (جديد!)
│   ├── bank-raw/                    ✅ (جديد!)
│   │   ├── types.ts                 ✅
│   │   ├── raw-01.ts                ✅
│   │   ├── raw-02.ts                ✅
│   │   ├── raw-03.ts                ✅
│   │   ├── raw-04.ts                ✅
│   │   └── index.ts                 ✅
│   ├── modes.ts                     ✅
│   ├── curriculum.ts                ✅
│   ├── enrichment.ts                ✅
│   ├── index.ts                     ✅
│   └── learnModules.ts              ✅
│
├── store/                           ✅
│   └── progressStore.ts             ✅
│
├── hooks/                           ✅ (7 hooks)
├── utils/                           ✅ (4 utils)
├── components/                      ✅
│
└── screens/                         ✅
    ├── CategorySelectScreen.tsx     ✅
    ├── CurriculumScreen.tsx         ✅
    ├── EnrichmentScreen.tsx         ✅
    ├── LevelScreen.tsx              ✅
    ├── Header.tsx                   ✅
    ├── WelcomeScreen.tsx            ✅
    ├── RoleSelection.tsx            ✅
    ├── HeroDashboard.tsx            ✅
    ├── GuardianDashboard.tsx        ✅
    └── (11 screen قادمة)            ⏳
```

---

## 🗺️ 8. خارطة الطريق

### ✅ الجلسة 1 — التأسيس (مكتملة)
- محرك السوروبان
- i18n كامل
- 6 مستويات
- Welcome → Role → Dashboard

### ✅ الجلسة 2 — البنك التكيفي (مكتملة)
- محرك GPT (`masteryTracker` + `problemGenerator` + `adaptiveEngine`)
- بنك 200 سؤال مصنّف
- `bank-adapter.ts` للتحويل الذكي
- 4 أقسام في `bank-raw/`

### 🎯 الجلسة 3 — الشاشات المتبقية
- نقل 11 شاشة من v1
- `PracticeScreen`, `AnzanScreen`, `QuestsScreen`
- `FinalExam`, `CertificateScreen`
- `PlacementTestScreen` (جديد)

### 🎯 الجلسة 4 — الأنزان المتقدم
- `MitoriScreen` (L18)
- `FlashAnzanScreen` (L14)
- ربط الأنزان بالمحرك التكيفي

### 🎯 الجلسة 5 — الإكمال
- L06-L17 (باقي المستويات)
- PWA (offline)
- APK (Google Play)

---

## 🎨 9. التقنيات

| التقنية | الإصدار |
|---------|---------|
| React | 18.3.1 |
| TypeScript | 5.5.3 |
| Vite | 5.3.3 |
| Tailwind CSS | 3.4.4 |
| Framer Motion | 11.0.8 |
| Zustand | 4.5.2 |
| canvas-confetti | 1.9.3 |
| GitHub Actions | — |

---

## 📅 10. سجل الجلسات

### 🗓️ الجلسة 1 — ✅
- 84 ملف
- محرك السوروبان
- 6 مستويات
- i18n كامل

### 🗓️ الجلسة 2 — ✅ (اليوم)
- 7 ملفات جديدة
- 200 سؤال مصنّف
- محرك GPT التكيفي
- `bank-adapter.ts` الذكي

### 🗓️ الجلسة 3 — قادمة
- 11 شاشة v1
- PlacementTest
- Remediation

---

## 📊 11. الإحصائيات

| المقياس | القيمة |
|---------|--------|
| **الملفات المكتملة** | 91 ملف |
| **الملفات المتبقية** | ~25 ملف |
| **نسبة الإنجاز** | **~78%** |
| **أسئلة البنك** | 700 سؤال |
| **المستويات المبنية** | 7 (L00-L05 + L18) |
| **Hooks** | 7 |
| **Utils** | 4 |
| **Components** | 8 |

---

## 🔗 12. روابط مهمة

| الرابط | الوصف |
|--------|-------|
| [Live Demo](https://mezo2021.github.io/sorobanmind-2) | التطبيق |
| [GitHub Repo](https://github.com/mezo2021/sorobanmind-2) | المستودع |
| [Actions](https://github.com/mezo2021/sorobanmind-2/actions) | سجل البناء |
| [v1](https://github.com/mezo2021/sorobanmind-platform_2026) | المصدر |

---

## 📞 13. ملاحظات المطوّر

**المطوّر:** مصطفى علي أكر ([@mezo2021](https://github.com/mezo2021))

**المرجع:**
- Takashi Kojima
- Japan Soroban Association
- ChatGPT — للتعليم التكيفي

---

<div align="center">

## 🧮 SorobanMind

**صُنع بحب لأطفال العالم العربي** 🌍

---

*آخر تحديث: 2026-09-24 — نهاية الجلسة 2*
*الحالة: 🟢 يعمل + بنك أسئلة تكيفي (78% مكتمل)*

</div>
```
