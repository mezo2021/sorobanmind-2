# 🌹 SESSION 2026-10-13 — سجل الجلسة

> **الغرض:** استئناف العمل بعد هذه الجلسة.
> **الحالة:** 🟢 البناء أخضر · تعديلات P0 رُفعت جزئياً.

---

## 1. تعديلات رُفعت

| # | الملف | التعديل |
|:-:|---|---|
| 1 | `GamesListScreen.tsx` | العنوان: `مَحْفَظَةُ النِّقَاط: {ticketXP}` (بلا `/10`) |
| 2 | `GamesListScreen.tsx` | الشريط السفلي: `dir="ltr"` على `{ticketXP} / {TICKET_COST}` |
| 3 | `GamesListScreen.tsx` | النص السفلي: "📚 اذهب إلى دروسك · اجمع N نقاط · وعد" |
| 4 | `GuardianDashboard.tsx` | `handleReset` — 4 → 11 مفتاح (إضافة `sorobania_progress_v2`) |
| 5 | `GuardianDashboard.tsx` | `handleBackup` — إزالة الفلتر |
| 6 | `GuardianDashboard.tsx` | `handleRestore` — مسح قبل الكتابة |
| 7 | `progressStore.ts` | `TICKET_XP_CAP: 20 → 50` · `TICKETS_MAX: 1 → 5` |
| 8 | `Sorobania/` | تقسيم إلى 5 ملفات |

---

## 2. القائمة النهائية لـ`keysToKeep`

```

soroban_companion
soroban_child_name
soroban_child_full_name
soroban_high_scores_v1
soroban_high_scores_month
sorobanmind-v2-progress
soroban_mastery_badges
sorobanmind-v2-lang
srb_progress
soroban_number_style
sorobania_progress_v2        ← أُضيف

```

---

## 3. تعديلات مقترحة · لم تُنفَّذ

### 🔴 Sorobania

| # | الملف | التعديل |
|:-:|---|---|
| 1 | `Sorobania/SorobaniaGame.tsx` | `isPreviewMode` → `isPreviewMode()` |
| 2 | `Sorobania/sorobaniaSfx.ts` | إضافة `dispose()` |
| 3 | `Sorobania/SorobaniaGame.tsx` | استيراد `dispose` + استدعاؤها |

### 🟢 اسم الطفل صوتياً — 4 ملفات

| # | الملف |
|:-:|---|
| 4 | `Pirates/PirateRaceGame.tsx` |
| 5 | `Detective/DetectiveGame.tsx` |
| 6 | `Friends/FriendsGame.tsx` |
| 7 | `FlyingAbacus/FlyingAbacusGame.tsx` |

---

## 4. بنية Sorobania

```

src/components/games/Sorobania/
├── SorobaniaGame.tsx       1057 سطر
├── sorobaniaData.ts         377 سطر
├── sorobaniaSfx.ts          133 سطر
├── SorobaniaScenes.tsx      608 سطر
└── SorobaniaUI.tsx          407 سطر

```

---

## 5. مشاكل مؤجلة

| # | المشكلة | القرار |
|:-:|---|---|
| 1 | استهلاك التذكرة عند الفتح | مؤجل |
| 2 | `ticketPaidRef` لا يُصفَّر | مؤجل |
| 3 | XP Sorobania = 2-4 (لا 2-5) | مقبول |

---

## 6. الجلسة القادمة

1. رفع تعديلات Sorobania (3)
2. اختبار اسم الطفل في 4 ألعاب
3. إضافة اسم الطفل في 4 ملفات
4. قرار استهلاك التذاكر

---

## 7. قواعد ثابتة

- لا لمس `App.tsx` · `LessonScreen` · `PracticeScreen` · `AnzanScreen`.
- لا لمس `useSorobanLogic` · `Bead2D5` · `Soroban2D5` (فقط props).
- لا حذف ملفات قبل reverse deps.
- كل تعديل · اختبار · ثم التالي.

---

**آخر تحديث:** 2026-10-13
**الحالة:** 🟢 البناء أخضر
```