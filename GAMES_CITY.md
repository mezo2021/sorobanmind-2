
# 🎪 مدينة الألعاب — Games City

> **آخر تحديث:** 2026-10-12
> **الحالة:** 🟢 البناء أخضر · 4 من 5 ألعاب مكتملة
> **المرجع:** SorobanMind v2 — قسم الألعاب التعليمية
> **⚠️ مصدر الحقيقة:** هذا الملف + PROJECT_STATE.md

---

## 📋 فهرس

1. الرؤية والغرض
2. البنية المعمارية
3. البنية الاقتصادية (XP ↔ التذاكر)
4. الألعاب الخمس (الحالة الفعلية)
5. المكونات المشتركة (3 معادات)
6. نظام الأصوات والاهتزاز
7. نظام البطل المرافق
8. المعاينة الكاملة (Preview Mode)
9. ملفات الفلاشات التعليمية
10. إضافة لعبة جديدة — دليل خطوة بخطوة
11. قرارات تصميمية محسومة
12. سجل الأخطاء المُصلَحة
13. قيود وحمايات
14. المتبقي — جزيرة الأنزان

---

## 1️⃣ الرؤية والغرض

### 🎯 الهدف

**مدينة الألعاب** قسم تعليمي ترفيهي في تطبيق SorobanMind يقدّم **5 ألعاب قصيرة** (45-90 ثانية) تربط التعليم بالمتعة، وتستخدم المعداد كمحرك مركزي.

### 📖 الفكرة التربوية

- **Learn-then-Play:** الطفل يجمع XP من الدروس → يشتري تذاكر → يلعب
- **Scarcity (النُدرة):** موارد محدودة (تذكرة واحدة) → قيمة أعلى للعبة
- **Session Control:** جلسات قصيرة → لا إدمان · لا إرهاق بصري
- **Loop:** درس → XP → تذكرة → لعبة → XP → درس...

### 🎓 المخرجات المتوقعة

- تقوية مفاهيم السوروبان (Subitizing · الأصدقاء · الجدة · العملاق)
- تحفيز الطفل على إتمام الدروس (XP بوابة للألعاب)
- توفير متنفّس ممتع بعد الجهد الدراسي
- تحضير الطفل للأنزان (الحساب الذهني الخالص)

---

## 2️⃣ البنية المعمارية

### 📁 شجرة المجلدات الفعلية

```

src/components/games/
├── gamesData.ts                     📋 بيانات الألعاب الخمس
├── GamesListScreen.tsx              📋 قائمة + ماكينة تذاكر
├── GameCompanion.tsx                🎭 البطل داخل الألعاب
├── HighScoreBadge.tsx               🏆 شارة الرقم القياسي
├── highScoreStore.ts                💾 تخزين السجل القياسي (شهري)
│
├── FlyingAbacus/                    🛸 اللعبة 1
│   └── FlyingAbacusGame.tsx
│
├── Detective/                       🔍 اللعبة 2
│   └── DetectiveGame.tsx
│
├── Friends/                         🥋 اللعبة 3
│   ├── FriendsGame.tsx
│   ├── LaserAbacus.tsx              (معداد SVG · عمودان)
│   └── bank.ts                      (40 تمرين جمع/طرح)
│
└── Pirates/                         🏴‍☠️ اللعبة 4
├── PirateRaceGame.tsx
├── MultiRodAbacus.tsx           (معداد SVG · 5 أعمدة · عرض)
├── PirateScene.tsx              (SVG البحر · سفينتان)
├── seaSfx.ts                    (WebAudio)
└── mulEngine.ts                 (محرك الضرب · كوجيما)

```

**ملفات خارج `games/` (مُعدَّلة):**

| الملف | التعديل |
|---|---|
| `src/store/progressStore.ts` | نظام التذاكر + `ticketXP` + migration v9 |
| `src/screens/HeroDashboard.tsx` | زر مدينة الألعاب + زر القفل |
| `src/screens/GuardianDashboard.tsx` | زر تصفير السجل · زر المعاينة |
| `src/screens/PlacementTestScreen.tsx` | الزمن 10 دقائق |
| `src/screens/CategoryScreen.tsx` | فتح L7 الموصى به |
| `src/hooks/useCharacterVoice.ts` | v2 (pitch مُحسَّن + voicesReady) |
| `src/utils/previewMode.ts` | المعاينة (يُفعَّل من Guardian) |

### 🔗 نقاط الدخول

```

HeroDashboard
├── زر "🎬 الفلاشات التعليمية"   → FlashListScreen
├── زر "🎪 مدينة الألعاب"         → GamesListScreen  ← قسمنا
└── زر "🎯 امتحان تحديد المستوى"  → PlacementTestScreen (مرة واحدة)

GuardianDashboard
├── زر "👁️ وضع المعاينة"         → soroban_dev_preview
└── زر "🗑️ تصفير"               → يحفظ الاسم · البطل · السجل

```

**لا تعديل على `App.tsx`** — القسم يدير نفسه داخلياً (نمط `ActiveView`).

---

## 3️⃣ البنية الاقتصادية (XP ↔ التذاكر)

### 💰 رصيدان منفصلان

| الرصيد | الغرض | السقف | المتغير |
|---|---|---|---|
| **totalXP** | التقدم في المستويات · التقارير | بلا سقف | `totalXP` |
| **ticketXP** | شراء التذاكر فقط | 20 | `ticketXP` |
| **التذاكر** | رصيد اللعب | 1 | `tickets` |

### 🔄 الحلقة الكاملة

```

📚 إجابة صحيحة → +5 XP
├── totalXP = totalXP + 5       (بلا سقف)
└── ticketXP = min(20, ticketXP + 5)
↓
ticketXP ≥ 10 → زر "🎟️ اشترِ تذكرة"
↓
ضغط → ticketXP -= 10 · tickets = 1
↓
دخول مدينة الألعاب → الضغط على لعبة
↓
tickets -= 1 (استهلاك)
↓
اللعب → 45-90 ث → XP مكافأة (2-5)
↓
العودة للدروس

```

### ⚙️ الثوابت (`progressStore.ts`)

```tsx
export const TICKET_COST = 10;       // 10 XP = تذكرة
export const TICKET_XP_CAP = 20;     // سقف ticketXP
export const TICKETS_MAX = 1;        // تذكرة واحدة في الجيب
```

📊 معدل الاكتساب

النشاط XP لكل إجابة
PracticeScreen +5
AnzanScreen +5
AudioAnzanScreen +5
لعبة العداد الطائر +2 إلى +5 (نهاية)
لعبة المحقق +2 إلى +5 (نهاية)
دوجو السوروبان +2 إلى +5 (نهاية)
سباق القراصنة +2 إلى +5 (نهاية)

ملاحظة: الدروس لا تُعطي XP لكل إجابة · بل بعد الإتمام.

🔑 دوال المتجر

```tsx
useProgressStore.getState().addXP(5);         // يُحدّث الرصيدين
useProgressStore.getState().buyTicket();       // يخصم 10 من ticketXP
useProgressStore.getState().consumeTicket();   // يخصم 1 من tickets

// Selectors
useProgressStore((s) => s.ticketXP);
useProgressStore((s) => s.tickets);
useProgressStore((s) => s.totalXP);
```

---

4️⃣ الألعاب الخمس — الحالة الفعلية

# اللعبة id المدة البطل الحالة
1 🛸 العداد الطائر flying-abacus 60 ث المختار (default: ريان) ✅ مكتمل
2 🔍 المحقق الرقمي detective 45 ث جود ✅ مكتمل
3 🥋 دوجو السوروبان friends 90 ث شام ✅ مكتمل
4 🏴‍☠️ سباق القراصنة pirate-race 90 ث ريان ✅ مكتمل
5 🏝️ جزيرة الأنزان anzan-island 60 ث شام · ريان ⏳ قيد التصميم

🛸 العداد الطائر — flying-abacus ✅

· المهارة: القراءة البصرية السريعة (Subitizing)
· الآلية: يظهر المعداد لثوانٍ → يختفي → 3 أزرار للإجابة
· منحنى W-Shape:
  · 0-10 ث: أرقام 2-5 · تظهر 1800ms
  · 10-25 ث: أرقام 6-13 · تظهر 1200ms
  · 25-40 ث: أرقام 10-19 · تظهر 900ms
  · 40-50 ث: أرقام 4-7 · تظهر 1500ms
  · 50-60 ث: أرقام 20-44 · تظهر 700ms
· Gold Mode: عند 3 صح متتالي (لون ذهبي + نبض)
· الميزات الإضافية:
  · Adaptive Engine: خطأان متتاليان → +35% وقت ظهور + نطاق أرقام أنصف
  · 71 عبارة عربية متنوعة (بدء · تفكير · سؤال · صح · خطأ · نهاية)
  · الرقم القياسي الشهري
· XP: 2 أساسي + 1/2/3 (سقف 5)
· الألقاب: ⚡ برق (15+) · 🌟 نجم (10+) · 🔍 باحث (5+) · 🌱 صاعد

🔍 المحقق الرقمي — detective ✅

· المهارة: قراءة المعداد · اكتشاف الأخطاء
· الآلية: يُعرض حساب + معداد بقيمة خاطئة → الطفل يُعدّل الخرزات
· البنك: 40 تمرين قسمة (من sorobanDivisionData) + تلميحات ذكية
· البطل: جود (المحلل الذكي)
· الميزات:
  · شرح خطأ نوعي (استلاف · صفر مفقود · قلب · إزاحة)
  · تكيف ذكي: خطأان → مسألة أسهل + تخطّي بعد 3 أخطاء
  · التحقق يدوي عبر زر "إغلاق الملف"
· XP: 2-5
· الألقاب: 🔎 متدرب · 🕵️ ذكي · 🎯 محترف · 🏆 أسطوري

🥋 دوجو السوروبان — friends ✅

· المهارة: قواعد أصدقاء 5 و 10 (منهجية كوجيما)
· الآلية: معداد SVG تفاعلي (LaserAbacus) بمحرك تسلسل خطوة-بخطوة
· البنك: 40 تمرين في bank.ts:
  · أصدقاء 5 · جمع (10)
  · أصدقاء 5 · طرح (5)
  · أصدقاء 10 · جمع (10)
  · أصدقاء 10 · طرح (5)
  · مركّب · جمع (5)
  · مركّب · طرح (5)
· البطل: شام (المعلمة الذكية)
· الميزات:
  · محرك كشف الخطأ: يرفض أي حركة تُبعد عن الهدف
  · وميض أحمر + اهتزاز + شرح عند الخطأ
  · إرجاع تلقائي بعد 0.85 ث
  · سلّم تلميحات: نص ← أشباح زرقاء ← أسهم الإصبع
  · نجوم 1-3 لكل مسألة (3 بلا خطأ)
  · سلسلة كومبو (streak)
  · تدريب تكيفي — القاعدة الأضعف تظهر أكثر
  · الأحزمة: 🥋 أبيض → أزرق → أخضر → بني → أسود
  · معدادان تفاعليان: عشرات (يسار) · آحاد (يمين)
· XP: 2-5
· الألقاب: الحزام حسب الأداء (5 مستويات)

🏴‍☠️ سباق القراصنة — pirate-race ✅

· المهارة: سرعة الضرب (كوجيما)
· الآلية: مسائل ضرب + 3 خيارات · شريط فجوة 0-100%
· البطل: ريان (السريع)
· الميزات:
  · محرك الضرب mulEngine.ts (اختُبر على 20 ألف حالة):
    · ترتيب كوجيما: من اليسار لليمين (A×C → B×C → A×D → B×D)
    · ناتج رقمين = منزلتان دائماً (3×2 = "06")
    · المشتّتات الذكية (أخطاء حقيقية): shift · padding · carry · missed · swap
  · شريط الفجوة: صح +6 · خطأ −12 · انتهى الوقت −15
  · فجوة ≥ 3 صح متتالي: +10 (بدل +6)
  · المؤقت المتكيف: 8-16 ث حسب المستوى · +2 بعد خطأين · لا ينزل عن 6
  · 3 حالات جوية: صافي (≥60%) · مطر (30-60%) · عاصفة (<30%)
  · المشهد SVG: 3 طبقات أمواج · سفينتان · جزيرة تنمو
  · رمية حبل ريان: عند فجوة < 30 · مرة واحدة · يحذف خياراً خاطئاً
  · بطاقة الخطأ: تنزلق فوق السؤال · تعرض خطوات الحل على MultiRodAbacus (5 أعمدة)
  · أصوات WebAudio: موج · رعد · بوق نجاح/فشل
· XP: 2-5
· النهاية: 🏝️ وصول للجزيرة · أو 🏴‍☠️ القبض الكاريكاتيري

🏝️ جزيرة الأنزان — anzan-island ⏳

· المهارة: الحساب الذهني الخالص (بلا معداد)
· الآلية: سلاسل عمليات سريعة (+2 +5 -1 = ?)
· البطل: شام · ريان (اختياري في البداية — لعبة الأضخم)
· الميزات المقترحة:
  · سلسلة عمليات سريعة (flash)
  · إدخال رقمي
  · Gold Mode
  · لقب "🧙 الساحر" (5 تتابعات)
  · مصدر البيانات: chainsData أو بنك جديد
· الحالة: في انتظار التصميم

---

5️⃣ المكونات المشتركة (3 معادات)

⚠️ مشكلة معروفة: 3 مكونات معداد مختلفة. التوحيد مؤجَّل لجلسة بعد الأنزان.

# المكون الاستخدام الأعمدة التفاعل
1 Soroban2D5.tsx الدروس · التمارين · الفلاشات · المحقق · العداد الطائر N ✅ تفاعلي
2 Friends/LaserAbacus.tsx دوجو السوروبان 2 ✅ تفاعلي + ليزر
3 Pirates/MultiRodAbacus.tsx سباق القراصنة 5 ❌ للعرض فقط

القرار: نبقيها حتى إكمال الأنزان · ثم جلسة توحيد كاملة.

🎨 الاختلافات البصرية

العنصر Soroban2D5 LaserAbacus MultiRodAbacus
الأعمدة N (2-13) 2 5
الخرزات شكل بيضوي شكل معيني شكل بيضوي
الليزر ❌ ✅ ✅
العارضة بسيطة ذهبية بارزة ذهبية بارزة
الاستخدام عام دوجو عرض فقط

---

6️⃣ نظام الأصوات والاهتزاز

🔊 الأصوات (TTS)

التقنية: useCharacterVoice(character) — Web Speech API

```tsx
import { useCharacterVoice } from '@/hooks/useCharacterVoice';

const { speak, stop, isSpeaking, isSupported } = useCharacterVoice('sham');
speak('نص مشكّل');
```

لكل بطل نبرته:

```tsx
sham: { pitch: 1.40, rate: 0.95, preferGender: 'female' }
rayan: { pitch: 0.70, rate: 1.15, preferGender: 'male' }
bana: { pitch: 1.25, rate: 0.90, preferGender: 'female' }
joud: { pitch: 0.80, rate: 1.05, preferGender: 'male' }
```

📢 نظام طبقات الكلام

اللحظة متى مثال
بدء اللعبة user gesture "مستعد؟ انطلق!"
Gold Mode (3 صح) عند التفعيل "السرعة القصوى!"
5 صح متتالي عند التفعيل "كفو!"
خطأ عند الخطأ "بسيطة، ركّز!"
نهاية اللعبة عند النهاية "أحسنت! انتهى التحدي!"

⚠️ القاعدة الذهبية:

· البطل يصمت أثناء التفكير — لا تشتيت
· TTS في لحظات محددة فقط — لا كل إجابة
· دوجو السوروبان: يستخدم TTS خارجياً (كل milestone)
· سباق القراصنة: يستخدم seaSfx (WebAudio · بلا TTS)

📳 الاهتزاز (Vibration API)

```tsx
try { navigator.vibrate(pattern); } catch { /* iOS */ }
```

الحالة النمط
إجابة صحيحة 30
إجابة خاطئة [0, 40, 40, 40]
Gold Mode [0, 20, 20, 20, 20, 60]
بدء اللعبة 50
نهاية اللعبة [0, 40, 40, 40, 40, 80]

⚠️ iOS Safari: يتجاهل بأمان.

🎵 أصوات سباق القراصنة (WebAudio)

الملف: Pirates/seaSfx.ts

الصوت الوصف
موج دائم ضوضاء بيضاء مُفلترة (lowpass 400Hz)
رعد sawtooth ينزل 60 → 20 Hz
بوق نجاح 330 → 440 → 554 Hz
بوق فشل 180 → 110 Hz
اهتزاز navigator.vibrate

بلا ملفات mp3 — كل شيء مُولَّد.

---

7️⃣ نظام البطل المرافق

🎭 الأبطال الأربعة

البطل الصفة الملف الصوت
شام الذكية sham.png أنثوي · pitch 1.40
ريان السريع rayan.png ذكوري · pitch 0.70
بانة الهادئة bana.png أنثوي · pitch 1.25
جود الذكي joud2.png ⚠️ ذكوري · pitch 0.80

المسار: src/assets/avatars/

🎯 كيف يُختار البطل؟

· من localStorage.getItem('soroban_companion')
· عند عدم وجوده → rayan (افتراضي)
· كل لعبة لها بطل مقترح في gamesData.ts

🎭 توزيع الأبطال على الألعاب

اللعبة البطل النمط
العداد الطائر المختار من localStorage
المحقق الرقمي جود ثابت (تحليلي)
دوجو السوروبان شام ثابت (معلمة)
سباق القراصنة ريان ثابت (سريع)
جزيرة الأنزان شام · ريان اختياري في البداية

⚠️ التوحيد الكامل للبطل — مؤجَّل لجلسة خاصة.

🖼️ حالات المزاج (5)

الحالة الأنيميشن
idle طوفان رأسي · 2.5 ث
thinking ميلان يمين-يسار · 2 ث
excited قفز + تكبير · 0.6 ث
celebrating قفز + تكبير · 0.6 ث
sad انكماش خفيف · 0.6 ث

---

8️⃣ المعاينة الكاملة (Preview Mode)

🎯 الغرض

لولي الأمر / المطور: دخول الألعاب بدون تذاكر أو XP لاختبار التجربة الكاملة.

🔧 آلية التفعيل

· المفتاح: soroban_dev_preview في localStorage
· القيمة: 'true'
· الملف: src/utils/previewMode.ts
· الزر: في GuardianDashboard

🎛️ كيف تعمل؟

عند التفعيل:

· ✅ كل الألعاب مفتوحة (حتى building)
· ❌ لا تذاكر مطلوبة
· ❌ لا استهلاك تذكرة
· ❌ لا XP يُضاف

الدوال:

```typescript
import { isPreviewMode } from '@/utils/previewMode';
if (isPreviewMode()) { /* ... */ }
```

🔒 حماية

· المعاينة مخفية عن الطفل
· تظهر فقط في GuardianDashboard
· زر "🚪 خروج من المعاينة" يُعيد الوضع الطبيعي

---

9️⃣ ملفات الفلاشات التعليمية (مرجع)

قسم منفصل · لا يُلمس.

الملف الوظيفة
flash/types.ts أنواع FlashStep · FlashLesson
flash/flashData.ts فلاشات القسمة
flash/multData.ts فلاشات الضرب
flash/chainsData.ts السلاسل
flash/FlashScreen.tsx عرض الفلاش (TTS + أزرار)
flash/FlashListScreen.tsx قائمة الفلاشات
flash/TwoAbacusSolver.tsx تمرين القسمة (معدادان)
flash/MultSolver.tsx تمرين الضرب (معدادان)
flash/ChainSolver.tsx تمرين السلاسل
flash/MentalBadge.tsx الشارة الذهنية
flash/sorobanDivisionData.ts بنك مسائل القسمة

⚠️ يُستخدم من: DetectiveGame (يستورد getDivisionProblemById).

---

🔟 إضافة لعبة جديدة — دليل خطوة بخطوة

📋 5 خطوات

1️⃣ أضف GameMeta في gamesData.ts

```tsx
{
  id: 'new-game-id',
  title: 'اسم اللعبة',
  subtitle: 'وصف قصير',
  icon: '🎮',
  gradient: 'from-color-500 to-color-700',
  recommendHero: 'sham',
  duration: '60 ثانية',
  status: 'building',   // أو 'ready'
}
```

2️⃣ أنشئ المجلد والملف

```
src/components/games/NewGame/
└── NewGame.tsx
```

3️⃣ اكتب المكوّن

```tsx
interface NewGameProps {
  onBack: () => void;
}

export default function NewGame({ onBack }: NewGameProps) {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-900 text-white">
      {/* ... */}
    </div>
  );
}
```

4️⃣ اربطه في GamesListScreen.tsx

```tsx
import { NewGame } from './NewGame/NewGame';

// داخل render عند ActiveView
if (active?.kind === 'game') {
  if (active.gameId === 'flying-abacus') {
    return <FlyingAbacusGame onBack={() => setActive(null)} />;
  }
  if (active.gameId === 'new-game-id') {              // 🆕
    return <NewGame onBack={() => setActive(null)} />;
  }
  // ... الألعاب الأخرى
}
```

5️⃣ حدّث status في gamesData.ts

```tsx
status: 'ready',   // من 'building' إلى 'ready'
```

---

1️⃣1️⃣ قرارات تصميمية محسومة

✅ ثابتة

1. لا لمس App.tsx — القسم يدير نفسه
2. لا لمس Soroban2D5 — نستخدم props فقط
3. جلسات قصيرة: 45-90 ثانية
4. البطل يصمت أثناء التفكير — لا تشتيت
5. لا نقاط — فقط "عدد الإجابات الصحيحة" أو "قضايا مغلقة"
6. الرقم القياسي شهري — تنظيف تلقائي في أول كل شهر ميلادي
7. تصفير Guardian يحفظ الاسم · البطل · السجل · الرقم القياسي
8. امتحان تحديد المستوى = 10 دقائق · مرة واحدة فقط
9. L7 يُفتح للموصى به (بدون خيار الأهل)
10. TTS كل 3 صح (لا كل صح) · باستثناء العداد الطائر
11. Gold Mode — 3 صح متتالي · يزول عند أول خطأ
12. XP محدود: 2-5 لكل لعبة (لا حلقة لا نهائية)
13. تجربة واحدة — لا تفريع حسب العمر
14. لا Console مطلوب — كل شيء تلقائي

❌ مؤجَّلة للنسخة 2

· Hyper-Speed Burst (3 إجابات < 800ms)
· خريطة مغامرة للأنزان
· تفريع حسب العمر
· صور SVG للأبطال (حالياً PNG)
· توحيد المكونات الثلاثة
· لوحة صدارة عالمية (Supabase)
· الببغاء الثرثار (Mimic Parrot)

---

1️⃣2️⃣ سجل الأخطاء المُصلَحة

🐛 في progressStore.ts

# الخطأ الإصلاح
1 ticketXP يُصفَّر عند الترقية migration v9 — يُمنح 20 XP للقادمين
2 tickets لا تُحفظ migration v9
3 تصفير Guardian يُفقد السجل إضافة soroban_high_scores_v1 و _month إلى keysToKeep

🐛 في GamesListScreen.tsx

# الخطأ الإصلاح
1 استهلاك تذكرة على building if (game.status !== 'ready') return;
2 زر يُفعَّل لـ building disabled={!canOpen}

🐛 في MultiRodAbacus.tsx

# الخطأ الإصلاح
1 الخرزات تقفز من y=0 initial={false} على كل motion.g
2 القوس يعبر الإطار 172/182 بدل 178/195
3 AnimatePresence في SVG استبدال بـ key + motion.text

🐛 في PirateScene.tsx

# الخطأ الإصلاح
1 preserveAspectRatio="none" يمدد المشهد حُذف
2 transform scale يدفع الموجة amplitude في path data
3 السفن: transform + motion يتعارضان <g> خارجي + <motion.g> داخلي
4 الجزيرة: transformOrigin بلا transformBox static transform
5 البرق: موضع ثابت useMemo لموضع عشوائي

🐛 في PirateRaceGame.tsx

# الخطأ الإصلاح
1 isPreview بدل isPreviewMode تصحيح
2 mood="happy" mood: 'idle' \| 'thinking' \| ...
3 <HighScoreBadge entry={...} /> gameId={...} variant="full"
4 useCharacterVoice() بلا وسيط useCharacterVoice('rayan')
5 HighScoreEntry بحقول خاطئة {name, value, date, heroId}
6 options: number[] MulOption[]
7 buyTicket() يعيد boolean void
8 اسم الطفل 'البطل' readChildName()
9 عرض خطوة ثابتة عند الخطأ عرض كل الخطوات
10 زر رمية ريان دائم يظهر عند gap < 30 فقط
11 seaSfx.ts مفقود ملف جديد
12 mulEngine.ts مفقود ملف من Claude

🐛 في CategoryScreen.tsx

# الخطأ الإصلاح
1 L7 الموصى به مقفل if (placement.recommendedLevel === levelId) return true;

🐛 في PlacementTestScreen.tsx

# الخطأ الإصلاح
1 الزمن 20 دقيقة 10 دقائق (TOTAL_TIME_SEC = 10 * 60)

🐛 في useCharacterVoice.ts

# الخطأ الإصلاح
1 كل الأبطال بنفس الصوت pitch متضخم (0.70 → 1.40)
2 Chrome لا يحمّل الأصوات voicesReady state

---

1️⃣3️⃣ قيود وحمايات

🔒 ملفات محمية (لا تُلمس)

الملف السبب
useSorobanLogic.ts منطق الخرزات (العمود الفقري)
Bead2D5.tsx رسم الخرزة
Soroban2D5.tsx المعداد (فقط props جديدة)
FlashListScreen.tsx نمط مرجعي
App.tsx التنقل الرئيسي
LessonScreen.tsx الدروس
PracticeScreen.tsx التمارين
AnzanScreen.tsx الأنزان

✅ المسموح

· ملفات جديدة في src/components/games/
· Props اختيارية في Soroban2D5 و Rod2D5
· تعديل progressStore.ts (إضافة حقول فقط)
· تعديل HeroDashboard.tsx (إضافة زر)
· تعديل GamesListScreen.tsx (استيراد + ربط)
· تعديل gamesData.ts (تحديث status)

🧪 اختبار إلزامي بعد أي تعديل

1. 🎮 SorobanPlayground — يعمل
2. 📚 LessonScreen — يعمل
3. ✍️ PracticeScreen — يعمل
4. 🧠 AnzanScreen — يعمل
5. 🎬 FlashListScreen — يعمل
6. 🎪 GamesListScreen — يعمل

---

1️⃣4️⃣ المتبقي — جزيرة الأنزان 🏝️

📋 الحالة

· id: anzan-island
· المدة المقترحة: 60 ثانية
· البطل: شام · ريان (اختياري في البداية)
· المهارة: الحساب الذهني البحت (بلا معداد)

🎯 الآلية المقترحة

```
1. البطل يسأل: "من تختار؟ شام أم ريان؟"
2. تظهر عمليات متتالية بسرعة:
   +2  +5  -1  → ؟
3. كل عملية تظهر لثانية · ثم تختفي
4. الطفل يحسب ذهنياً
5. يُدخل الناتج (لوحة أرقام)
6. التحقق + النتيجة
```

🎁 المكافآت

· لقب "🧙 الساحر" عند 5 إجابات متتالية صحيحة
· Gold Mode عند 3 صح
· الرقم القياسي (GAME_ID = 'anzan-island')
· XP: 2-5

📁 الملفات المطلوبة

1. Anzan/AnzanIslandGame.tsx (جديد)
2. Anzan/anzanData.ts (بيانات السلاسل — أو استخدام chainsData)
3. تحديث gamesData.ts → status: 'ready'
4. تحديث GamesListScreen.tsx → استيراد + ربط

---

📌 ملاحظات للمساعد القادم (AI)

⚠️ قبل أي عمل

1. اقرأ هذا الملف كاملاً — يفهم البنية في 10 دقائق
2. تحقق من وجود الملف فعلياً على GitHub قبل تعديله
3. لا تفترض React Native — المشروع React Web
4. إذا كان في شك — اسأل قبل التنفيذ

📚 Stack ثابت

· Framework: React 18 + Vite
· Language: TypeScript
· Styling: Tailwind CSS
· Animation: framer-motion
· Icons: lucide-react
· State: zustand + persist

🔗 المسارات المهمة

```typescript
'@/components/soroban2d5/Soroban2D5'   // المعداد الأساسي
'@/hooks/useCharacterVoice'             // TTS
'@/store/progressStore'                 // XP + تذاكر
'@/utils/previewMode'                   // المعاينة
'@/types'                               // CharacterType
'@/components/games/GameCompanion'      // البطل
'@/components/games/HighScoreBadge'     // السجل
'@/components/games/highScoreStore'     // تخزين السجل
```

🎨 Props المعداد الحقيقية

```tsx
<Soroban2D5
  columns={3}
  size="sm"
  autoBeadSize
  demoValue={value}
  interactive={false}
  showValue={false}
  hideTitle
  rodTint="amber"
/>
```

🚨 عند الفشل

1. لا تُعِد البناء من الصفر
2. افحص الملفات الفعلية — لا تفترض
3. تحقق من أسماء الملفات — حرف خفي يسبب فشل البناء
4. اسأل قبل التخمين

📖 الملفات المرجعية

· PROJECT_STATE.md — مصدر الحقيقة
· GAMES_CITY.md — هذا الملف (الرؤية والبنية)
· RESCUE.md — المرجع الأساسي
· AL-ISLAH-V2.md — سجل الإصلاحات

---

آخر تحديث: 2026-10-12
الحالة: 🟢 البناء أخضر · 4 من 5 ألعاب مكتملة
المرجع: PROJECT_STATE.md + RESCUE.md + هذا الملف

```