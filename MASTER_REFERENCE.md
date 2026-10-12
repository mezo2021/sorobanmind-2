🌹 افهم — هذا آخر ملف سأكتبه لك

📄 MASTER_REFERENCE.md — انسخه · احفظه على GitHub

هذا كل ما أعرفه. أكمل النواقص لاحقاً.

---

```markdown
# 🧭 MASTER_REFERENCE.md — مرجع المشروع الشامل

> **الغرض:** ملف واحد يجمع كل شيء. أي مساعد يقرأه — يفهم المشروع في 15 دقيقة.
> **آخر تحديث:** 2026-10-12
> **الحالة:** 🟢 البناء أخضر · 4 ألعاب · يحتاج توثيق نواقص

---

## 🏗️ 1. Stack المشروع

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** framer-motion
- **Icons:** lucide-react
- **State:** zustand + persist
- **اللغة:** عربي · RTL
- **المسار:** GitHub Pages (`mezo2021.github.io/sorobanmind-2`)

---

## 📁 2. بنية المجلدات

```

src/
├── components/
│   ├── games/
│   │   ├── gamesData.ts
│   │   ├── GamesListScreen.tsx
│   │   ├── GameCompanion.tsx
│   │   ├── HighScoreBadge.tsx
│   │   ├── highScoreStore.ts
│   │   ├── FlyingAbacus/FlyingAbacusGame.tsx
│   │   ├── Detective/DetectiveGame.tsx
│   │   ├── Friends/
│   │   │   ├── FriendsGame.tsx
│   │   │   ├── LaserAbacus.tsx
│   │   │   └── bank.ts
│   │   └── Pirates/
│   │       ├── PirateRaceGame.tsx
│   │       ├── MultiRodAbacus.tsx
│   │       ├── PirateScene.tsx
│   │       ├── seaSfx.ts
│   │       └── mulEngine.ts
│   │
│   ├── flash/
│   │   ├── types.ts · flashData.ts · multData.ts · chainsData.ts
│   │   ├── FlashScreen.tsx · FlashListScreen.tsx
│   │   ├── TwoAbacusSolver.tsx · MultSolver.tsx · ChainSolver.tsx
│   │   ├── MentalBadge.tsx
│   │   └── sorobanDivisionData.ts
│   │
│   ├── soroban2d5/
│   │   ├── Soroban2D5.tsx          ← المعداد الأساسي (محمي)
│   │   ├── Rod2D5.tsx              ← العمود (محمي)
│   │   ├── Bead2D5.tsx             ← الخرزة (محمي)
│   │   ├── useSorobanLogic.ts      ← منطق الخرزات (محمي)
│   │   ├── useBeadSound.ts
│   │   └── useBeadHaptics.ts
│   │
│   ├── avatars/ImageAvatar.tsx
│   ├── Companion.tsx · FloatingCompanion.tsx
│   └── CharacterSelector.tsx
│
├── store/
│   ├── progressStore.ts            ← XP · تذاكر · إنجازات
│   ├── masteryBadgesStore.ts
│   └── numberStyleStore.ts
│
├── hooks/
│   ├── useSpeech.ts                ← TTS عام
│   ├── useCharacterVoice.ts        ← TTS لكل بطل
│   ├── useSorobanaVoice.ts         ← mp3 (معطل)
│   ├── useGameStats.ts
│   └── useQuests.ts
│
├── screens/
│   ├── WelcomeScreen.tsx · RoleSelection.tsx
│   ├── HeroDashboard.tsx · GuardianDashboard.tsx
│   ├── CategoryScreen.tsx · LevelScreen.tsx
│   ├── LearnScreen.tsx · LessonScreen.tsx
│   ├── PracticeScreen.tsx · AnzanScreen.tsx · AudioAnzanScreen.tsx
│   ├── PlacementTestScreen.tsx · LevelTestScreen.tsx
│   ├── CategoryExamScreen.tsx · RemediationScreen.tsx
│   ├── SorobanPlayground.tsx
│   ├── FingerMathScreen.tsx · MagicSecretsScreen.tsx
│   ├── KidsCertificateScreen.tsx · CertificateScreen.tsx
│   └── Header.tsx
│
├── data/
│   ├── srb/                        ← بنك الأسئلة (L0-L7)
│   │   ├── questions/ · exam/ · modules.ts · curriculum.ts
│   │   ├── progress.ts · sessionBuilder.ts · remediation.ts
│   │   └── types.ts · index.ts
│   ├── bank-v2/ · bank-raw/ · bank.ts
│   ├── curriculum.ts · srb-adapter.ts
│   └── index.ts
│
├── engine/
│   ├── sorobanMoves.ts             ← تصنيف الحركات
│   ├── sorobanEngine.ts · adaptiveEngine.ts
│   └── problemGenerator.ts · masteryTracker.ts
│
├── curriculum/
│   ├── lessons/L0/ · L1/ · L2/ · L3/
│   ├── lessons/index.ts
│   └── types.ts
│
├── utils/
│   ├── previewMode.ts              ← المعاينة
│   ├── badgeChecker.ts · skillsChecker.ts
│   ├── anzanBadges.ts · audioAnzanBadges.ts
│   ├── numberStyle.ts · numerals.ts · arabicNumbers.ts
│   └── certificateGenerator.ts
│
├── i18n/ (ar.ts · en.ts · useTranslation.ts)
├── assets/avatars/ (sham.png · rayan.png · bana.png · joud2.png)
├── types.ts
└── App.tsx                         ← التنقل الرئيسي

---

💾 3. مفاتيح localStorage (مصدر حقيقة!)

💰 الرصيد والتقدم

المفتاح الوصف الشكل
sorobanmind-v2-progress المتجر الرئيسي (zustand persist) JSON + version: 9
soroban_high_scores_v1 السجلات القياسية (أعلى 3) {gameId: [{name, value, date, heroId}]}
soroban_high_scores_month آخر شهر زيارة (للتنظيف) "2026-10"
soroban_mastery_badges شارات الإتقان zustand persist

🎭 الطفل

المفتاح الوصف
soroban_child_name اسم الطفل
soroban_companion البطل المختار (sham · rayan · bana · joud)
soroban_child_full_name الاسم الكامل (للشهادات)
soroban_welcome_seen آخر ظهور لشاشة الترحيب (timestamp)

🎓 المستوى والاختبارات

المفتاح الوصف
soroban_completed_lessons مصفوفة IDs الدروس المكتملة
soroban_completed_levels مصفوفة المستويات المكتملة
soroban_passed_practice مصفوفة أرقام التمارين الناجحة
soroban_passed_level_tests مصفوفة اختبارات المستوى
soroban_placement_recommended "L7" · توصية امتحان تحديد المستوى
soroban_placement_weak_skills مصفوفة نقاط الضعف
soroban_placement_last_attempt timestamp
soroban_exam1_passed / soroban_exam2_passed boolean
soroban_exam_result نتيجة الامتحان
soroban_exam1_score / soroban_exam2_score النقاط
soroban_section2_unlocked 'true' بعد امتحان القسم 1
soroban_kids_certificate_ready 'true'

🧠 الأنزان والشارات

المفتاح الوصف
soroban_anzan_badges شارات الأنزان البصري
soroban_anzan_audio_badges شارات الأنزان السمعي
soroban_placement_weak_skills نقاط الضعف (للتكرار)

⚙️ الإعدادات

المفتاح الوصف
soroban_number_style 'arabic' أو 'latin'
soroban_dev_preview 'true' للمعاينة
soroban_friends_symbol_seen_v1 'true' إذا رأى الرموز
soroban_friends_weak_v1 عدد الأخطاء لكل قاعدة
soroban_laser_theme_v1 'blue' أو 'red'

📂 مفاتيح أخرى

المفتاح الوصف
srb_progress تقدم SRB (بنك الأسئلة)
soroban_lesson_session_L0-S01 جلسة درس (مثال)
soroban_lesson_progress تقدم الدروس
sorobanmind-stats إحصائيات قديمة

---

🎮 4. الألعاب الأربع

🛸 العداد الطائر — flying-abacus

· البطل: المختار (default: rayan)
· المدة: 60 ثانية
· الآلية: يظهر المعداد → يختفي → 3 أزرار
· W-Shape:
  · 0-10 ث: 2-5 · 1800ms
  · 10-25 ث: 6-13 · 1200ms
  · 25-40 ث: 10-19 · 900ms
  · 40-50 ث: 4-7 · 1500ms
  · 50-60 ث: 20-44 · 700ms
· الميزات: Adaptive · 71 عبارة · Gold Mode · رقم قياسي
· XP: 2-5
· الحالة: ✅ يعمل

🔍 المحقق الرقمي — detective

· البطل: joud (ثابت)
· المدة: 45 ثانية
· الآلية: يُعرض حساب خاطئ → الطفل يُعدّل معداد → "إغلاق الملف"
· البنك: 40 مسألة قسمة من sorobanDivisionData
· الميزات: شرح خطأ نوعي · تكيف · تخطّي بعد 3 أخطاء
· XP: 2-5
· الحالة: ✅ يعمل

🥋 دوجو السوروبان — friends

· البطل: sham (ثابتة)
· المدة: 90 ثانية
· الآلية: معداد SVG تفاعلي · محرك تسلسل خطوة-بخطوة
· البنك: 40 تمرين (أصدقاء 5/10 · مركّب)
· الميزات:
  · محرك كشف الخطأ (لا تقدّم إن أخطأ)
  · وميض أحمر + اهتزاز + شرح
  · إرجاع تلقائي (0.85 ث)
  · أشباح زرقاء + أسهم الإصبع
  · نجوم 1-3 · سلسلة كومبو · تدريب تكيفي
  · أحزمة 5 مستويات
· XP: 2-5
· الحالة: ✅ يعمل

🏴‍☠️ سباق القراصنة — pirate-race

· البطل: rayan (ثابت)
· المدة: 90 ثانية
· الآلية: مسائل ضرب + 3 خيارات + شريط فجوة 0-100%
· البنك: mulEngine.ts (Claude بناه · 20 ألف اختبار)
  · ترتيب كوجيما
  · ناتج رقمين = منزلتان
  · مشتّتات ذكية (shift · padding · carry · missed · swap)
· الميزات: 3 حالات جواء · رمية ريان · معداد بعد الخطأ
· XP: 2-5
· الحالة: ⚠️ يحتاج مراجعة
  · المشكلة: لا يُدرّب على المعداد الحقيقي
  · السبب: أزرار اختيار بلا لمس الخرزات
  · القرار: إعادة تصميم أو حذف

---

🧮 5. قواعد السوروبان (من تعليم المستخدم)

🎯 الأساسيات

· العارضة: الفاصل الأفقي · "قاضي الحساب"
· الخرزة الملامسة للعارضة = مفعّلة
· الجدة 5: الخرزة العلوية (قيمة 5)
· العملاق 10: عمود العشرات
· الخرزات السفلية: 4 (كل واحدة = 1)

🎯 الأصدقاء

أصدقاء 5:

الرقم الصديق
1 4
2 3
3 2
4 1

أصدقاء 10:

الرقم الصديق
1 9
2 8
3 7
4 6
5 5
6 4
7 3
8 2
9 1

🎯 الحركات الفيزيائية

1. النزول المزدوج ⬇️⬇️

· سبابة واحدة
· تُنزل الجدة نحو العارضة + تُبعد السفليات بعيداً
· تُستخدم في: جمع أصدقاء 5

2. الصعود المزدوج ⬆️⬆️

· سبابة + إبهام
· سبابة ترفع الجدة بعيداً + إبهام يرفع السفليات نحو العارضة
· تُستخدم في: طرح أصدقاء 5

3. الكماشة المغلقة 🤌

· إبهام يرفع سفليات + سبابة تُنزل الجدة
· في نفس اللحظة
· تُستخدم في: تمثيل 6-9 من الصفر

4. حركة العملاق 🧡

· إبهام يرفع العشرات + سبابة تُبعد الآحاد
· تُستخدم في: أصدقاء 10

🎯 قواعد العمليات

الجمع:

```
أضف N:
  إذا السفليات تكفي → مباشر
  إذا الجدة متاحة → +5 وأبعد (5−N)
  إذا الجدة مشغولة → +10 وأبعد (10−N)
```

الطرح:

```
اطرح N:
  إذا السفليات تكفي → مباشر
  إذا الجدة مفعّلة → −5 وأضف (5−N)
  إذا الجدة فارغة → −10 وأضف (10−N)
```

الضرب (كوجيما):

```
- من اليسار لليمين
- A×C · B×C · A×D · B×D
- ناتج رقمين = منزلتان ("06")
- منزلة الآحاد = منزلة A + منزلة B
```

---

🎭 6. الأبطال

البطل الصفة الصورة الصوت
شام الذكية sham.png أنثوي · pitch 1.40
ريان السريع rayan.png ذكوري · pitch 0.70
بانة الهادئة bana.png أنثوي · pitch 1.25
جود الذكي joud2.png ذكوري · pitch 0.80

المسار: src/assets/avatars/

البطل المختار: يُحفظ في soroban_companion

---

🔊 7. الأصوات والاهتزاز

TTS

```typescript
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
const { speak, stop, isSpeaking } = useCharacterVoice('sham');
speak('نص مشكّل');
```

قاعدة: TTS في لحظات محددة فقط.

الاهتزاز

```typescript
try { navigator.vibrate(pattern); } catch { /* iOS */ }
```

الحالة النمط
صح 30
خطأ [0, 40, 40, 40]
Gold [0, 20, 20, 20, 20, 60]

---

💰 8. البنية الاقتصادية

الثوابت

```typescript
export const TICKET_COST = 10;
export const TICKET_XP_CAP = 20;
export const TICKETS_MAX = 1;
```

الحلقة

```
درس → +5 XP
  ↓
totalXP (بلا سقف)
ticketXP (سقف 20)
  ↓
ticketXP ≥ 10 → زر "اشترِ تذكرة"
  ↓
10 XP → tickets = 1
  ↓
لعبة → tickets -= 1 → +2..5 XP
```

دوال المتجر

```typescript
useProgressStore.getState().addXP(amount);
useProgressStore.getState().buyTicket();
useProgressStore.getState().consumeTicket();
```

---

🎯 9. المعاينة

· المفتاح: soroban_dev_preview
· القيمة: 'true'
· الزر: في GuardianDashboard
· التأثير: فتح كل الألعاب · لا تذاكر · لا XP
· الاستيراد:
  ```typescript
  import { isPreviewMode } from '@/utils/previewMode';
  ```

---

⚠️ 10. المشاكل الحالية

🚨 1. سباق القراصنة لا يُدرّب السوروبان

· المشكلة: أزرار اختيار · لا لمس المعداد
· التأثير: الطفل يتعلم رياضيات لا سوروبان
· القرار المقترح: إعادة تصميم · المعداد تفاعلي

🚨 2. ثلاثة مكونات معداد

· Soroban2D5 (الدروس)
· LaserAbacus (دوجو)
· MultiRodAbacus (قراصنة · عرض)
· القرار: توحيد مؤجَّل

🚨 3. التوثيق ناقص

· الملفات متشعبة (20+)
· لا مصدر حقيقة موحد
· القرار: هذا الملف + GAMES_CITY.md

---

🎯 11. المتبقي

🏝️ جزيرة الأنزان

· id: anzan-island
· البطل: شام · ريان (اختياري في البداية)
· المهارة: الحساب الذهني البحت
· الحالة: ⏳ في انتظار التصميم

---

📋 12. قواعد للمساعد القادم

⚠️ قبل أي عمل

1. اقرأ هذا الملف + GAMES_CITY.md كاملاً
2. تحقق من وجود الملف فعلياً على GitHub
3. لا تفترض React Native — المشروع React Web
4. إذا في شك — اسأل قبل التنفيذ

🚫 ممنوع

· لمس useSorobanLogic.ts
· لمس Bead2D5.tsx
· لمس Soroban2D5.tsx (فقط props جديدة)
· لمس App.tsx
· لمس LessonScreen.tsx · PracticeScreen.tsx · AnzanScreen.tsx

✅ مسموح

· ملفات جديدة في src/components/games/
· Props اختيارية
· تعديل progressStore.ts (إضافة حقول)
· تعديل HeroDashboard.tsx (إضافة زر)

🚨 عند الفشل

1. لا تُعِد البناء من الصفر
2. افحص الملفات الفعلية
3. تحقق من أسماء الملفات (حرف خفي يسبب فشل البناء)
4. اسأل قبل التخمين

---

🎯 13. الأولويات للجلسة القادمة

1. قرار القراصنة — إعادة تصميم أو حذف؟
2. اختبار الألعاب الثلاث — العداد · المحقق · دوجو
3. جزيرة الأنزان — بعد الاتفاق

---

آخر تحديث: 2026-10-12
الحالة: 🟢 البناء أخضر · 4/5 ألعاب
الملفات المرجعية: هذا الملف + GAMES_CITY.md

```

---

## 🌹 خطواتك الآن

1. **افتح `MASTER_REFERENCE.md`** على GitHub
2. **الصق كل ما فوق**
3. **Commit**
4. **افتح محادثة جديدة**
5. **الصق هذه البداية:**

---

**نص بداية المحادثة الجديدة:**

> أنا صاحب SorobanMind.
> 
> **قبل أي عمل:**
> - اقرأ `MASTER_REFERENCE.md`
> - اقرأ `GAMES_CITY.md`
> 
> **قواعد صارمة:**
> - **لا تنفّذ دون نقاش**
> - نتناقش → نتفق → تنفّذ
> - لا تكتب كوداً بلا موافقتي
> 
> **المشكلة الحالية:**
> سباق القراصنة لا يُدرّب السوروبان (أزرار بلا معداد).
> نحتاج قرارك حول إعادة التصميم.
> 
> **ابدأ بسؤالي:** ما الذي تريد مناقشته أولاً؟
