📄 الملف الأول: FLASH_SECTION.md

# 🎬 قسم الفلاشات التعليمية

> **آخر تحديث:** 2026-10-13
> **الحالة:** 🟢 مستقر · قسمة + ضرب مكتملان
> **المرجع:** SorobanMind v2 — قسم الفلاشات
> **⚠️ مصدر الحقيقة:** هذا الملف + STATE_OF_THE_PROJECT.md

---

## 📋 فهرس

### الجزء الأول — تعريفي
1. الرؤية والأهداف
2. البنية العامة
3. الملفات والمكونات
4. Props الجديدة
5. الدروس المتوفرة
6. التمارين المتوفرة
7. نظام الألوان
8. قاعدة كوجيما
9. ميثاق عدم اللمس

### الجزء الثاني — الآلية والربط
10. آلية عمل FlashScreen (مشاهدة)
11. آلية عمل TwoAbacusSolver (قسمة)
12. آلية عمل MultSolver (ضرب)
13. نظام TTS مع التشكيل
14. التنقل والربط
15. بنية البيانات
16. جدول LESSON_TO_PROBLEM

---

# 📖 الجزء الأول — تعريفي

## 1️⃣ الرؤية والأهداف

### 🎯 الهدف الأساسي

توفير **بديل عملي** للدروس السلبية، يُتيح للطفل:
- **مشاهدة** شرح خطوة بخطوة
- **تطبيق** بنفسه على معدادين متزامنين
- **فهم** دور كل رقم في الحل

### 📖 الفجوة التي نعالجها

| الوضع السابق | الوضع الجديد |
|---|---|
| معداد واحد (ناتج فقط) | معدادان متزامنان |
| الطفل يحفظ الإجراء | الطفل يفهم المنطق |
| لا ربط بالأنزان | جسر مباشر نحو الأنزان |

### 🎓 المخرجات المتوقعة

- ✅ فهم **دور المقسوم/المضروب** في الحل
- ✅ إدراك **كيف ينمو الناتج** منزلة بمنزلة
- ✅ أساس قوي لـ **الأنزان**

---

## 2️⃣ البنية العامة

```

🏠 Hero Dashboard
↓ زر "🎬 الفلاشات التعليمية"
📋 FlashListScreen (القائمة)
↓
├── 🎬 زر "شاهد"  → FlashScreen (مشاهدة)
│         ↓ رجوع → FlashListScreen
│
├── 🖐️ زر "جرّب" (قسمة) → TwoAbacusSolver
│         ↓ رجوع → FlashListScreen
│
└── 🖐️ زر "جرّب" (ضرب) → MultSolver
↓ رجوع → FlashListScreen

```

### 🔑 مبدأ التصميم

**`FlashListScreen` يدير التنقل داخلياً** — `App.tsx` لا يتغير.

---

## 3️⃣ الملفات والمكونات

### 📂 قائمة الملفات

| # | الملف | الوظيفة | الحالة |
|---|---|---|---|
| 1 | `types.ts` | أنواع FlashStep/FlashLesson | ✅ |
| 2 | `flashData.ts` | بيانات الفلاشات (أساسيات + قسمة) | ✅ |
| 3 | `multData.ts` | بيانات دروس الضرب | ✅ |
| 4 | `FlashListScreen.tsx` | قائمة + تنقل داخلي | ✅ |
| 5 | `FlashScreen.tsx` | عرض الفلاش (مشاهدة + TTS) | ✅ |
| 6 | `MentalBadge.tsx` | شارة المعادلة (متعددة الأسطر) | ✅ |
| 7 | `sorobanDivisionData.ts` | بيانات تمارين القسمة + جدول الربط | ✅ |
| 8 | `TwoAbacusSolver.tsx` | تمرين القسمة (معدادان) | ✅ |
| 9 | `MultSolver.tsx` | تمرين الضرب (معدادان) | ✅ |
| 10 | `Soroban2D5.tsx` | المعداد | 🟡 معدَّل (props) |
| 11 | `Rod2D5.tsx` | عمود واحد | 🟡 معدَّل (props) |

**المسار:** `src/components/flash/`

---

## 4️⃣ Props الجديدة

### 🆕 في `Soroban2D5`

```tsx
rodTint?: 'red' | 'emerald' | 'white' | 'amber';   // لون الخرزات
highlightColumns?: number[];                        // أعمدة بإضاءة بيضاء
dimColumns?: number[];                              // أعمدة مطموسة (ضرب)
activeRodIndex?: number;                            // عمود نشط (أساسيات)
beamHighlight?: boolean;                            // إضاءة العارضة
hideTitle?: boolean;                                // إخفاء العنوان
```

⚠️ كلها اختيارية — لا تؤثر على الوضع الطبيعي.

🆕 في Rod2D5

```tsx
tint?: RodTint;          // لون الخرزات (red/emerald/white/amber)
isDimmed?: boolean;      // طمس (opacity 0.25 + grayscale)
isActive?: boolean;      // حلقة ذهبية نابضة
beamHighlight?: boolean; // إضاءة العارضة
```

---

5️⃣ الدروس المتوفرة

🎬 الفلاشات

# القسم الدروس الأسئلة
1 أساسيات 3 دروس أجزاء السوروبان · الخرزة العلوية · الخرزات السفلية
2 قسمة ÷1 (S07) 4 دروس 84÷2 · 54÷3 · 152÷8 · 216÷8
3 قسمة ÷2 (S08) 4 دروس 484÷22 · 572÷22 · 350÷14 · 234÷18
4 ضرب 2×1 (S05) 4 دروس حسب multData
5 ضرب 2×2 (S06) 4 دروس حسب multData

الإجمالي: 19 درساً فلاشياً.

---

6️⃣ التمارين المتوفرة

🖐️ تمارين القسمة (TwoAbacusSolver)

8 مسائل:

id المسألة القسمة على
prob_1 837 ÷ 3 3
prob_2 54 ÷ 3 3
prob_3 152 ÷ 8 8
prob_4 216 ÷ 8 8
prob_5 484 ÷ 22 22
prob_6 572 ÷ 22 22
prob_7 350 ÷ 14 14
prob_8 234 ÷ 18 18

🖐️ تمارين الضرب (MultSolver)

8 دروس (mult-2x1-m1..m4 + mult-2x2-m1..m4).

---

7️⃣ نظام الألوان

اللون الرمز الاستخدام النوع
أحمر 🔴 المقسوم/المضروب لون الخرزات
أخضر 🟢 الناتج لون الخرزات
أبيض ⚪ العمود المُعدَّل الآن حلقة نابضة
ذهبي 🟡 العمود في الأساسيات حلقة نابضة
رمادي 🌫️ عمود مطموس (بعد الاستهلاك) opacity 0.25 + grayscale

🖌️ التنفيذ

```tsx
const beadFilter = isDimmed 
  ? 'grayscale(1) brightness(0.7)' 
  : getBeadFilter(tint);
```

⚠️ اللون يُطبَّق على الخرزات فقط — لا على الخلفية.

---

8️⃣ قاعدة كوجيما

📐 القسمة — موقع الناتج

الحالة القاعدة مثال
المقسوم ≥ المقسوم عليه فاصل عمود 8 ÷ 3 → 2 في المئات
المقسوم < المقسوم عليه يأخذ رقمين 2 < 3 → نأخذ 23

📐 الضرب — الترتيب من اليسار لليمين

الترتيب (2×2):

1. عشرات × عشرات → المنزلة الأعلى
2. عشرات × آحاد → المنزلة التالية
3. آحاد × عشرات → إضافة للمنزلة
4. آحاد × آحاد → المنزلة الأدنى

---

9️⃣ ميثاق عدم اللمس

🔒 ممنوع تماماً

الملف السبب
useSorobanLogic.ts منطق الخرزات — العمود الفقري
Bead2D5.tsx رسم الخرزة
LessonScreen.tsx الدروس
PracticeScreen.tsx التمارين
AnzanScreen.tsx الأنزان
PlacementTestScreen.tsx اختبار المستوى
RemediationScreen.tsx العلاجي
SorobanPlayground.tsx الوضع الحر

✅ المسموح

· Props جديدة اختيارية في Soroban2D5 وRod2D5
· ملفات جديدة كلياً
· جدول الربط في sorobanDivisionData.ts

🛡️ ضمانات

· أي prop جديدة → default = undefined
· لا تُستدعى من الوضع الطبيعي
· اختبار إلزامي على 4 أوضاع بعد أي تعديل:
  · 🎮 Playground · 📚 درس · ✍️ تمرين · 🧠 أنزان

---

⚙️ الجزء الثاني — الآلية والربط

🔟 آلية عمل FlashScreen (مشاهدة)

🎬 مثال: 837 ÷ 3 (8 حركات)

# Badge المقسوم 🔴 الناتج 🟢 ملاحظة
s1 837 ÷ 3 837 0 إعداد
s2 8 ÷ 3 = 2 837 200 🟢 إضافة
s3 8 − 6 = 2 237 200 🔴 طرح
s4 23 ÷ 3 = 7 237 270 🟢 إضافة
s5 23 − 21 = 2 27 270 🔴 طرح
s6 27 ÷ 3 = 9 27 279 🟢 إضافة
s7 27 − 27 = 0 0 279 🔴 طرح
s8 ✅ الناتج = 279 0 279 نتيجة

🎮 تحكم المستخدم

الزر الوظيفة
▶️ ابدأ user gesture · يُشغّل TTS
⏭ التالي انتقال يدوي
⏮ السابق رجوع
🔊 إعادة الصوت يُعيد TTS للخطوة
🔄 إعادة عند النهاية

---

1️⃣1️⃣ آلية عمل TwoAbacusSolver (قسمة)

🖐️ نفس المسألة — 2-3 مراحل

مثال: 837 ÷ 3

المرحلة المقسوم الناتج التعليمات
1 837 → 237 0 → 200 8 ÷ 3
2 237 → 27 200 → 270 23 ÷ 3
3 27 → 0 270 → 279 27 ÷ 3

🔄 الفرق عن الفلاش

 الفلاش التمرين
الوحدات 8 حركات 2-3 مراحل
الطفل يشاهد يُنفّذ
التعديل تلقائي يدوي
التحقق لا ✅ زر
TTS تلقائي 🔊 زر "إعادة الصوت"

🎯 خطوات المرحلة الواحدة

1. الطفل يُعدّل المعدادين
2. يضغط 🔍 تحقق من الإجابة
3. النظام يقارن:
   · ✅ الاثنان صحيحان → "أحسنت" → زر "المرحلة التالية"
   · ⚠️ خطأ في الناتج → "معداد الناتج (🟢) غير صحيح"
   · ⚠️ خطأ في المقسوم → "معداد المقسوم (🔴) غير صحيح"
   · ⚠️ الاثنان → "المعدادان يحتاجان تعديلاً"
4. لا انتقال تلقائي — الطفل يقود

---

1️⃣2️⃣ آلية عمل MultSolver (ضرب)

🖐️ نفس البنية — معدادان بترتيب مختلف

العنصر القسمة الضرب
🟢 الناتج يمين · يتعمّر يمين · يتعمّر
🔴 المضروب/المقسوم يسار · يتناقص يسار · ثابت ثم يُطمس
المنهج القسمة الطويلة كوجيما (A×C → A×D → B×C → B×D)

🎯 مثال: 23 × 33 = 759

# العملية 🔴 المضروب 🟢 الناتج طمس
s1 إعداد 23 0 —
s2 2×3=6 → مئات 23 600 —
s3 2×3=6 → عشرات 23 660 🔘 عشرات
s4 3×3=9 → +عشرات 3 750 —
s5 3×3=9 → آحاد 3 759 🔘 آحاد
s6 نتيجة 0 759 ✨

🔑 الفرق الجوهري

· الضرب: المضروب يبقى ثم يُطمس تدريجياً (يُستهلك رمزياً)
· القسمة: المقسوم يتناقص فعلياً مع كل طرح

⚠️ عدد الأعمدة

المسألة الأعمدة
2×1 (32 × 3) 3 (مئات · عشرات · آحاد)
2×2 (23 × 33) 4 (آلاف · مئات · عشرات · آحاد)

---

1️⃣3️⃣ نظام TTS مع التشكيل

🔊 التقنية

الملف: src/hooks/useSpeech.ts

```tsx
const { speak, stop, isSpeaking, isSupported } = useSpeech();
```

🎯 القاعدة الذهبية

```tsx
const tts = useSpeech();
const ttsRef = useRef(tts);  // مرجع ثابت
useEffect(() => { ttsRef.current = tts; }, [tts]);

const speakStep = (s) => {
  ttsRef.current.speak(s.ttsText, { rate: TTS_RATE });
};
```

TTS_RATE = 0.7 — بطيء مفهوم للأطفال.

🎨 التشكيل المُوجَّه

المشكلة: محركات TTS لا تفهم الإعراب · تنطق "عشرون" كـ "عشر".

الحل: تشكيل موجَّه — الكلمات المُشكِلة فقط:

الكلمة التشكيل
عشرون عِشْرُونَ
عشرين عِشْرِينَ
سبعون سَبْعُونَ
سبعين سَبْعِينَ
عشرتان عِشْرَتَان
عشرات عَشَرَات
خمسون خَمْسُونَ
خمسين خَمْسِينَ

⚠️ لا نُشكّل الملف كله — فقط الأرقام المُشكِلة (10-15 كلمة).

---

1️⃣4️⃣ التنقل والربط

🎯 آلية التنقل

مبدأ: FlashListScreen يدير كل شيء داخلياً.

```tsx
type ActiveView =
  | { kind: 'flash'; lessonId: string }
  | { kind: 'mult'; lessonId: string }
  | { kind: 'practice'; problemId: string }
  | null;

const [active, setActive] = useState<ActiveView>(null);
```

🔗 منطق القرار

```tsx
// في FlashListScreen
if (active?.kind === 'flash') {
  const lesson =
    getFlashLessonById(active.lessonId) ?? getMultLessonById(active.lessonId);
  // ← يبحث في القسمة أولاً · ثم الضرب
  return <FlashScreen lesson={lesson} onBack={() => setActive(null)} />;
}
```

🚫 ما لا يتغير

· ❌ App.tsx — لا تعديل
· ❌ HeroDashboard — لا تعديل
· ❌ LessonScreen — لا تعديل

الزر يظهر تلقائياً في FlashListScreen.

---

1️⃣5️⃣ بنية البيانات

📐 FlashStep (مشترك · قسمة + ضرب)

```ts
interface FlashStep {
  id: string;

  // للقسمة والضرب (معدادان)
  dividendValue?: number;
  resultValue?: number;
  highlightDividend?: number[];
  highlightResult?: number[];
  blurDividend?: number[];        // للضرب

  // للأساسيات (معداد واحد)
  sorobanValue?: number;
  activeRodIndex?: number;
  highlightColumns?: number[];
  highlightBeam?: boolean;

  // مشترك
  badgeLines: string[];
  caption: string;
  ttsText: string;
  durationMs: number;
}
```

📐 FlashLesson

```ts
interface FlashLesson {
  id: string;
  title: string;
  subtitle: string;
  operation: FlashOperation;
  category: FlashCategoryId;
  columns: number;
  layout?: FlashLayout;
  resultColumns?: number;
  dividendColumns?: number;
  multiplicand?: number;   // للضرب
  multiplier?: number;     // للضرب
  steps: FlashStep[];
}
```

⚠️ فهارس الأعمدة

مطابقة مع نظام Soroban2D5:

الفهرس 2×1 2×2
0 مئات آلاف
1 عشرات مئات
2 آحاد عشرات
3 — آحاد

---

1️⃣6️⃣ جدول LESSON_TO_PROBLEM

```ts
// في sorobanDivisionData.ts
export const LESSON_TO_PROBLEM: Record<string, string> = {
  'div-1x1-m1': 'prob_1',   // 837 ÷ 3
  'div-1x1-m2': 'prob_2',   // 54 ÷ 3
  'div-1x1-m3': 'prob_3',   // 152 ÷ 8
  'div-1x1-m4': 'prob_4',   // 216 ÷ 8
  'div-1x2-m1': 'prob_5',   // 484 ÷ 22
  'div-1x2-m2': 'prob_6',   // 572 ÷ 22
  'div-1x2-m3': 'prob_7',   // 350 ÷ 14
  'div-1x2-m4': 'prob_8',   // 234 ÷ 18
};
```

⚠️ الضرب لا يحتاج جدول ربط — نفس الـlesson يُستخدم في MultSolver.

---

📌 ملاحظات للمساعد القادم

🎯 لإضافة فلاش قسمة

1. أضف FlashLesson في flashData.ts
2. أضف DivisionProblem في sorobanDivisionData.ts
3. اربطهما في LESSON_TO_PROBLEM

🎯 لإضافة فلاش ضرب

1. أضف FlashLesson في multData.ts
2. لا حاجة لجدول ربط

🎯 لإضافة ميزة جديدة

1. PropTypes اختيارية فقط
2. اختبار على 4 أوضاع
3. توثيق في plannew.md

---

آخر تحديث: 2026-10-13
الحالة: 🟢 البناء أخضر · قسمة + ضرب مكتملان

```