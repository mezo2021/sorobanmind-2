📄 ملف 1 — GAMES_CITY.md 

# 🎪 مدينة الألعاب — Games City

> **آخر تحديث:** 2026-10-11
> **الحالة:** 🟢 يعمل — اللعبة الأولى (العداد الطائر) مكتملة
> **المرجع:** SorobanMind v2 — قسم الألعاب التعليمية

---

## 📋 فهرس

1. الرؤية والغرض
2. البنية المعمارية
3. البنية الاقتصادية (XP ↔ التذاكر)
4. الألعاب الخمس
5. الملفات والمسؤوليات
6. نظام الأصوات والاهتزاز
7. نظام البطل المرافق
8. المعاينة الكاملة (Preview Mode)
9. إضافة لعبة جديدة — دليل خطوة بخطوة
10. قرارات تصميمية محسومة
11. القيود والحمايات

---

## 1️⃣ الرؤية والغرض

### 🎯 الهدف

**مدينة الألعاب** قسم تعليمي ترفيهي في تطبيق SorobanMind يقدّم 5 ألعاب قصيرة (30-90 ثانية) تربط التعليم بالمتعة.

### 📖 الفكرة التربوية

- **Learn-then-Play:** الطفل يجمع XP من الدروس → يشتري تذاكر → يلعب
- **Scarcity (النُدرة):** موارد محدودة → قيمة أعلى للعبة
- **Session Control:** جلسات قصيرة → لا إدمان · لا إرهاق
- **Loop:** درس → XP → تذكرة → لعبة → درس...

### 🎓 المخرجات المتوقعة

- تقوية مفاهيم السوروبان بصرياً
- تحفيز الطفل على إتمام الدروس
- توفير متنفّس ممتع بعد الجهد
- تحضير الطفل للأنزان (الحساب الذهني)

---

## 2️⃣ البنية المعمارية

### 📁 شجرة المجلدات

```

src/
├── components/
│   └── games/                    🎮 مجلد الألعاب
│       ├── gamesData.ts          📋 بيانات الألعاب الخمس
│       ├── GameCompanion.tsx     🎭 البطل داخل الألعاب
│       ├── GamesListScreen.tsx   📋 شاشة قائمة الألعاب
│       │
│       ├── FlyingAbacus/         🛸 اللعبة 1
│       │   └── FlyingAbacusGame.tsx
│       │
│       ├── Detective/            🔍 اللعبة 2 (قادم)
│       ├── Friends/              🤝 اللعبة 3 (قادم)
│       ├── Pirate/               🏴‍☠️ اللعبة 4 (قادم)
│       └── Anzan/                🏝️ اللعبة 5 (قادم)
│
├── store/
│   └── progressStore.ts          💾 نظام التذاكر + XP
│
└── screens/
└── HeroDashboard.tsx         🏠 زر "مدينة الألعاب"

```

### 🔗 نقاط الدخول

```

HeroDashboard
├── زر "🎬 الفلاشات التعليمية"     → FlashListScreen
└── زر "🎪 مدينة الألعاب"          → GamesListScreen  ← قسمنا

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
ticketXP ≥ 10 → يظهر زر "🎟️ اشترِ تذكرة"
↓
ضغط الزر → ticketXP -= 10 · tickets = 1
↓
دخول مدينة الألعاب → الضغط على لعبة
↓
tickets -= 1 (استهلاك)
↓
اللعب → 60 ثانية → XP مكافأة (2-5)
↓
العودة للدروس

```

### ⚙️ الثوابت (في `progressStore.ts`)

```tsx
export const TICKET_COST = 10;       // 10 XP = تذكرة
export const TICKET_XP_CAP = 20;     // سقف رصيد التذاكر
export const TICKETS_MAX = 1;        // تذكرة واحدة في الجيب
```

📊 معدل الاكتساب

النشاط XP لكل إجابة
PracticeScreen +5
AnzanScreen +5
AudioAnzanScreen +5
لعبة العداد الطائر +2 إلى +5 (نهاية)

ملاحظة: الدروس لا تُعطي XP لكل إجابة · بل بعد الإتمام.

🔑 دوال المتجر

```tsx
// إضافة XP (يحدّث الرصيدين)
useProgressStore.getState().addXP(5);

// شراء تذكرة (يفحص الرصيد · السقف)
useProgressStore.getState().buyTicket();

// استهلاك تذكرة (عند فتح لعبة)
useProgressStore.getState().consumeTicket();

// Selectors
useProgressStore((s) => s.ticketXP);   // الرصيد الحالي
useProgressStore((s) => s.tickets);    // عدد التذاكر
```

---

4️⃣ الألعاب الخمس

📋 الجدول الكامل

# اللعبة id المدة البطل المقترح الحالة
1 🛸 العداد الطائر flying-abacus 60 ث ريان ✅ مكتمل
2 🔍 المحقق الرقمي detective 45 ث جود 🚧 قيد التطوير
3 🤝 أصدقاء 5 و 10 friends 90 ث شام 🚧 قيد التطوير
4 🏴‍☠️ سباق القراصنة pirate-race 90 ث ريان 🚧 قيد التطوير
5 🏝️ جزيرة الأنزان anzan-island 60 ث شام/ريان 🚧 قيد التطوير

🎮 تفاصيل كل لعبة

🛸 العداد الطائر — flying-abacus

· المهارة: القراءة البصرية السريعة (Subitizing)
· الآلية: يظهر المعداد لثوانٍ · يختفي · يُختار الرقم الصحيح
· منحنى W-Shape:
  · 0-10 ث: أرقام 2-5 · تظهر 1800ms
  · 10-25 ث: أرقام 6-13 · تظهر 1200ms
  · 25-40 ث: أرقام 10-19 · تظهر 900ms
  · 40-50 ث: أرقام 4-7 · تظهر 1500ms
  · 50-60 ث: أرقام 20-44 · تظهر 700ms
· Gold Mode: عند 3 صح متتالي
· XP: 2 أساسي + 1/2/3 (سقف 5)
· ألقاب: ⚡ برق (15+) · 🌟 نجم (10+) · 🔍 باحث (5+) · 🌱 صاعد

🔍 المحقق الرقمي — detective (قادم)

· المهارة: قراءة المعداد · اكتشاف الأخطاء
· الآلية: يُعرض معداد بقيمة خاطئة · الطفل يُعدّل الخرزات

🤝 أصدقاء 5 و 10 — friends (قادم)

· المهارة: قواعد المكملات
· الآلية: خرزات العنبر تومض + أسهم مغناطيسية

🏴‍☠️ سباق القراصنة — pirate-race (قادم)

· المهارة: سرعة القسمة
· الآلية: عاصفة متدرجة · وقت 10→8→7 · مسائل من sorobanDivisionData

🏝️ جزيرة الأنزان — anzan-island (قادم)

· المهارة: الحساب الذهني
· الآلية: سلاسل عمليات · إدخال رقمي · لقب "🧙 الساحر"

---

5️⃣ الملفات والمسؤوليات

📂 قائمة الملفات

الملف الوظيفة الحالة
gamesData.ts بنية GameMeta + قائمة GAMES ✅
GameCompanion.tsx البطل المرافق (بصري فقط) ✅
GamesListScreen.tsx قائمة + ماكينة تذاكر + توجيه ✅
FlyingAbacus/FlyingAbacusGame.tsx اللعبة الأولى الكاملة ✅
progressStore.ts نظام التذاكر + XP ✅ معدَّل
HeroDashboard.tsx زر الدخول ✅ معدَّل

🎭 GameCompanion.tsx

· Props: heroId · mood · customText · size
· Moods: idle · thinking · excited · celebrating · sad
· بلا صوت: TTS يُدار من اللعبة (لا المكوّن)
· الأبطال: sham · rayan · bana · joud
· الصور: src/assets/avatars/

📋 GamesListScreen.tsx

· يقلّد FlashListScreen (نمط ActiveView)
· يدير شاشة اللعبة داخلياً
· يعرض ماكينة التذاكر
· يفحص tickets ≥ 1 قبل الفتح

---

6️⃣ نظام الأصوات والاهتزاز

🔊 الأصوات (TTS)

التقنية: useCharacterVoice(character) — Web Speech API

لكل بطل نبرته:

```tsx
sham: { pitch: 1.25, rate: 0.95, preferGender: 'female' }
rayan: { pitch: 1.05, rate: 1.10, preferGender: 'male' }
bana: { pitch: 1.15, rate: 0.90, preferGender: 'female' }
joud: { pitch: 0.95, rate: 1.00, preferGender: 'male' }
```

نظام الطبقات (الكلام فقط في 6 لحظات):

اللحظة النص
بدء اللعبة "مستعد؟ انطلق!"
3 صح متتالي (Gold) "السرعة القصوى!"
5 صح متتالي "كفو!"
خطأ "بسيطة، ركّز!"
نهاية اللعبة "أحسنت! انتهى التحدي!"

⚠️ البطل يصمت أثناء التفكير — لا كلام بين المسائل.

📳 الاهتزاز (Vibration API)

الواجهة: navigator.vibrate(pattern)

الحالة النمط
إجابة صحيحة 30
إجابة خاطئة [0, 40, 40, 40]
Gold Mode [0, 20, 20, 20, 20, 60]
بدء اللعبة 50
نهاية اللعبة [0, 40, 40, 40, 40, 80]

⚠️ iOS Safari: يتجاهل بأمان (try/catch).

---

7️⃣ نظام البطل المرافق

🎭 الأبطال الأربعة

البطل الصفة الملف الصوت
شام الذكية sham.png أنثوي · pitch 1.25
ريان السريع rayan.png ذكوري · pitch 1.05
بانة الهادئة bana.png أنثوي · pitch 1.15
جود الذكي joud2.png ⚠️ ذكوري · pitch 0.95

🎯 كيف يُختار البطل؟

· من localStorage.getItem('soroban_companion')
· عند عدم وجوده → rayan (افتراضي)
· كل لعبة لها بطل مقترح في gamesData.ts

🖼️ حالة المزاج (5 حالات)

الحالة الأنيميشن
idle طوفان رأسي · 2.5 ث
thinking ميلان يمين-يسار · 2 ث
excited قفز + تكبير · 0.6 ث
celebrating قفز + تكبير · 0.6 ث
sad انكماش خفيف · 0.6 ث

---

8️⃣ المعاينة الكاملة (Preview Mode)

🎯 الغرض

لولي الأمر / المطور: الدخول للألعاب بدون تذاكر أو XP لاختبار التجربة الكاملة.

🔧 آلية التفعيل

· المفتاح: soroban_dev_preview في localStorage
· القيمة: 'true'
· الملف المسؤول: src/utils/previewMode.ts

🎛️ كيف يعمل؟

عند تفعيل المعاينة:

· GamesListScreen يفحص isPreviewMode()
· إذا true:
  · لا يفحص التذاكر
  · لا يستهلك تذكرة
  · يفتح اللعبة مباشرة
· عند انتهاء اللعبة:
  · لا يُضاف XP (لا يتغير totalXP)

🔒 حماية

· المعاينة مخفية عن الطفل
· تظهر فقط في GuardianDashboard
· زر "إنهاء المعاينة" يعيد الوضع الطبيعي

---

9️⃣ إضافة لعبة جديدة — دليل خطوة بخطوة

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

يستقبل:

```tsx
interface NewGameProps {
  onBack: () => void;    // العودة لـ GamesListScreen
  heroId?: CharacterType;
}
```

4️⃣ اربطه في GamesListScreen.tsx

```tsx
import { NewGame } from './NewGame/NewGame';

// داخل ActiveView
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

🔟 قرارات تصميمية محسومة

✅ ثابتة

1. لا لمس App.tsx — القسم يدير نفسه
2. لا لمس Soroban2D5 — نستخدم props فقط
3. جلسات قصيرة: 45-90 ثانية
4. البطل يصمت أثناء التفكير — لا تشتيت
5. نظام طبقات الكلام — 5-6 لحظات فقط
6. اهتزاز خفيف — لا عنيف
7. Gold Mode — 3 صح متتالي · يزول عند أول خطأ
8. XP محدود: 2-5 لكل لعبة (لا حلقة لا نهائية)
9. تجربة واحدة — لا تفريع حسب العمر
10. لا Console مطلوب — كل شيء تلقائي

❌ مؤجَّلة للنسخة 2

· Hyper-Speed Burst (3 إجابات < 800ms)
· خريطة مغامرة للأنزان
· تفريع حسب العمر
· صور SVG للأبطال (حالياً PNG)

---

1️⃣1️⃣ القيود والحمايات

🔒 ملفات محمية (لا تُلمس)

الملف السبب
useSorobanLogic.ts منطق الخرزات
Bead2D5.tsx رسم الخرزة
Soroban2D5.tsx المعداد
FlashListScreen.tsx نمط مرجعي
App.tsx التنقل الرئيسي

✅ المسموح

· ملفات جديدة في src/components/games/
· Props اختيارية في المكونات
· تعديل progressStore.ts (بإضافة حقول جديدة فقط)
· تعديل HeroDashboard.tsx (بإضافة زر فقط)

🧪 اختبار إلزامي بعد أي تعديل

1. 🎮 SorobanPlayground — يعمل
2. 📚 LessonScreen — يعمل
3. ✍️ PracticeScreen — يعمل
4. 🧠 AnzanScreen — يعمل
5. 🎬 FlashListScreen — يعمل
6. 🎪 GamesListScreen — يعمل

---

📌 ملاحظات للمساعد القادم (AI)

عند العمل على هذا القسم:

1. اقرأ هذا الملف كاملاً — يفهم البنية في 10 دقائق
2. لا تفترض React Native — المشروع React Web
3. Stack ثابت: Vite + Tailwind + framer-motion + lucide-react + zustand
4. المسارات المهمة:
   · @/components/soroban2d5/Soroban2D5 (المعداد)
   · @/hooks/useCharacterVoice (الصوت)
   · @/store/progressStore (التذاكر + XP)
5. Props المعداد الحقيقية:
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
6. إذا كان في شك — اسأل قبل التنفيذ

---

آخر تحديث: 2026-10-11
الحالة: 🟢 البناء يعمل · اللعبة الأولى مكتملة
المرجع: RESCUE.md + هذا الملف

```

---

## 📄 ملف 2 — `GamesListScreen.tsx` (مع دعم المعاينة)

**التغيير:** فحص `isPreviewMode()` — يتجاوز التذاكر في وضع المعاينة.

```tsx
// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/GamesListScreen.tsx — v3
// ═══════════════════════════════════════════════════════════════════
//
// ما تغيّر عن v2:
//   - دعم وضع المعاينة (Preview Mode)
//   - في المعاينة: لا تذاكر مطلوبة · لا استهلاك
//
// لا يلمس أي ملف خارج games/.
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Ticket, Lock, Play, Sparkles, Eye } from 'lucide-react';
import { GAMES, type GameId, type GameMeta } from './gamesData';
import { FlyingAbacusGame } from './FlyingAbacus/FlyingAbacusGame';
import { useProgressStore, TICKET_COST } from '../../store/progressStore';

interface GamesListScreenProps {
  onBack: () => void;
}

type ActiveView =
  | { kind: 'game'; gameId: GameId }
  | null;

// ═══ فحص وضع المعاينة ═══
const PREVIEW_KEY = 'soroban_dev_preview';

function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(PREVIEW_KEY) === 'true';
  } catch {
    return false;
  }
}

export function GamesListScreen({ onBack }: GamesListScreenProps) {
  const [active, setActive] = useState<ActiveView>(null);
  const [preview, setPreview] = useState(false);

  const ticketXP = useProgressStore((s) => s.ticketXP);
  const tickets = useProgressStore((s) => s.tickets);
  const totalXP = useProgressStore((s) => s.totalXP);
  const buyTicket = useProgressStore((s) => s.buyTicket);
  const consumeTicket = useProgressStore((s) => s.consumeTicket);

  // فحص المعاينة عند التحميل
  useEffect(() => {
    setPreview(isPreviewMode());
  }, []);

  // في المعاينة: كل الألعاب مفتوحة دائمياً
  const hasTicket = preview ? true : tickets >= 1;
  const canBuy = preview ? false : !hasTicket && ticketXP >= TICKET_COST;
  const progressPct = Math.min(100, (ticketXP / TICKET_COST) * 100);

  const handleOpenGame = (game: GameMeta) => {
    if (!hasTicket) return;
    // في المعاينة: لا استهلاك
    if (!preview) {
      consumeTicket();
    }
    setActive({ kind: 'game', gameId: game.id });
  };

  // ═══ تشغيل لعبة ═══
  if (active?.kind === 'game') {
    if (active.gameId === 'flying-abacus') {
      return <FlyingAbacusGame onBack={() => setActive(null)} />;
    }

    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6"
      >
        <h2 className="text-2xl font-black text-amber-300 mb-4">
          🚧 قيد التطوير
        </h2>
        <p className="text-slate-400 mb-8 text-center">
          هذه اللعبة ستُضاف في الجلسة القادمة
        </p>
        <button
          onClick={() => setActive(null)}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition active:scale-95"
          style={{ touchAction: 'manipulation' }}
        >
          ← العودة للألعاب
        </button>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pb-10"
    >
      <div className="flex items-center gap-3 p-4 sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0"
          style={{ touchAction: 'manipulation' }}
          aria-label="رجوع"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-amber-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> مَدِينَةُ الأَلْعَابِ
          </h1>
          <p className="text-xs text-white/60 mt-0.5">العب · تعلّم · استمتع</p>
        </div>

        {/* شارة المعاينة */}
        {preview && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold">
            <Eye className="w-4 h-4" />
            <span>معاينة</span>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4 max-w-3xl mx-auto">
        {/* في المعاينة: نُخفي ماكينة التذاكر */}
        {!preview && (
          <TicketMachine
            ticketXP={ticketXP}
            hasTicket={hasTicket}
            canBuy={canBuy}
            progressPct={progressPct}
            onBuy={buyTicket}
            totalXP={totalXP}
          />
        )}

        {/* في المعاينة: رسالة توضيحية */}
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-amber-200">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-bold">
                وضع المعاينة الكاملة مُفعَّل
              </span>
            </div>
            <p className="text-xs text-amber-300/70 mt-1">
              جميع الألعاب مفتوحة · بلا تذاكر · بلا XP
            </p>
          </motion.div>
        )}

        <div className="space-y-3">
          {GAMES.map((game, idx) => (
            <GameCard
              key={game.id}
              game={game}
              index={idx}
              unlocked={hasTicket}
              onOpen={() => handleOpenGame(game)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 🎟️ ماكينة التذاكر (كما هي)
// ═══════════════════════════════════════════════════════════════════

function TicketMachine({
  ticketXP,
  hasTicket,
  canBuy,
  progressPct,
  onBuy,
  totalXP,
}: {
  ticketXP: number;
  hasTicket: boolean;
  canBuy: boolean;
  progressPct: number;
  onBuy: () => void;
  totalXP: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold text-white">تَذَاكِرُك</span>
        </div>
        <span className="text-xs text-white/50">XP الكلي: {totalXP}</span>
      </div>

      {hasTicket && (
        <div className="flex items-center justify-center gap-2 py-2">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-3xl"
          >
            🎟️
          </motion.div>
          <span className="text-emerald-400 font-bold text-lg">
            لَدَيْكَ تَذْكِرَة · اخْتَرْ لُعْبَة!
          </span>
        </div>
      )}

      {canBuy && (
        <div className="space-y-3">
          <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
              className="absolute top-0 right-0 h-full bg-gradient-to-l from-amber-400 to-amber-600"
            />
          </div>
          <button
            onClick={onBuy}
            className="w-full py-3 rounded-xl bg-gradient-to-l from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            style={{ touchAction: 'manipulation' }}
          >
            <Ticket className="w-5 h-5" />
            🎟️ اشْتَرِ تَذْكِرَة بِـ 10 XP
          </button>
        </div>
      )}

      {!hasTicket && !canBuy && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>التَّقَدُّمُ نَحْوَ التَّذْكِرَة</span>
            <span className="font-bold text-amber-300 tabular-nums">
              {ticketXP} / {TICKET_COST}
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
              className="absolute top-0 right-0 h-full bg-gradient-to-l from-sky-400 to-blue-600"
            />
          </div>
          <p className="text-xs text-white/50 text-center pt-1">
            اجْمَعْ {TICKET_COST - ticketXP} XP إِضَافِيَّة
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 🎮 بطاقة لعبة (كما هي)
// ═══════════════════════════════════════════════════════════════════

function GameCard({
  game,
  index,
  unlocked,
  onOpen,
}: {
  game: GameMeta;
  index: number;
  unlocked: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl border p-3 sm:p-4 transition ${
        unlocked
          ? 'bg-white/5 border-white/10'
          : 'bg-white/[0.02] border-white/5 opacity-60'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-lg`}
        >
          <span className="text-2xl">{game.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-bold text-white truncate">
            {game.title}
          </p>
          <p className="text-xs text-white/50 mt-0.5 truncate">
            {game.subtitle}
          </p>
          <p className="text-[10px] text-amber-300/80 mt-1">
            ⏱️ {game.duration}
          </p>
        </div>
        <button
          onClick={onOpen}
          disabled={!unlocked}
          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition ${
            unlocked
              ? 'bg-gradient-to-br ' + game.gradient + ' shadow-lg active:scale-90'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          {unlocked ? (
            <Play className="w-5 h-5 fill-white text-white" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default GamesListScreen;
```

---