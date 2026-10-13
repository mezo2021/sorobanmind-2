📋 PROJECT_MASTER.md — الإصدار الجديد (v10.0)

البناء: مشروع SorobanMind v2 · المرجع الموحّد الوحيد
آخر تحديث: 2026-10-13
الحالة: 🟢 البناء أخضر · هجرة SRB قيد التنفيذ
القاعدة الذهبية: لا حذف إلا ما أُلغي صريحًا · لا مصدران للحقيقة
المصادر المعتمدة: README + FLASH_SECTION + GAMES_SECTION + Audit v8 + Audit v9
الأرشيف: v5 · AL-ISLAH · AL-ISLAH-V2 — مهجورة · لا تُعتمد

---

<div dir="rtl">

🧮 SorobanMind v2 — المرجع الموحّد

آخر تحديث: 2026-10-13
الحالة: 🟢 البناء أخضر · التطبيق منشور · Bank A و B مكتملان
المرجع الأساسي: هذا الملف — مصدر الحقيقة الوحيد
القاعدة الذهبية: لا حذف إلا ما أُلغي صريحًا · لا مصدران للحقيقة
الوثائق المؤرشفة: AL-ISLAH.md · AL-ISLAH-V2.md — لا تُعتمد

---

📑 فهرس المرجع

الجزء الأول — تعريف المشروع

1. نظرة عامة
2. الرؤية والأهداف
3. الفئتان العمريتان
4. الميزات الأساسية
5. البنية التقنية
6. الروابط والمطوّر
7. وثائق المشروع

الجزء الثاني — قسم الفلاشات التعليمية

8. الرؤية والأهداف
9. البنية العامة
10. الملفات والمكونات
11. Props الجديدة
12. الدروس المتوفرة
13. التمارين المتوفرة
14. نظام الألوان
15. قاعدة كوجيما
16. ميثاق عدم اللمس
17. آلية FlashScreen
18. آلية TwoAbacusSolver
19. آلية MultSolver
20. نظام TTS مع التشكيل
21. التنقل والربط
22. بنية البيانات

الجزء الثالث — قسم مدينة الألعاب

23. الرؤية والغرض
24. البنية المعمارية
25. البنية الاقتصادية
26. الألعاب الخمس
27. المكونات المشتركة
28. نظام الأصوات والاهتزاز
29. نظام البطل المرافق
30. وضع المعاينة
31. إضافة لعبة جديدة
32. قرارات تصميمية محسومة
33. قيود وحمايات

الجزء الرابع — نتائج الفحص الشامل (v8 + v9)

34. ملخص Audit v8 + v9
35. البنوك والمحركات
36. المتاجر الأربعة
37. المفاتيح والتخزين
38. الاستيرادات والخريطة
39. المشاكل المؤكدة
40. أهداف الإصلاح

الجزء الخامس — خطة الإصلاح الجديدة

41. الخطة الجديدة — قيد الكتابة

الملاحق

· أ. القواعد الذهبية
· ب. المصادر والمراجع
· ج. سجل التعديلات

---

🔵 الجزء الأول — تعريف المشروع

1. نظرة عامة

العنصر التفاصيل
الاسم SorobanMind v2 (أكاديمية السوروبان الدولية)
النوع تطبيق تعليمي عربي تفاعلي
الهدف تعليم السوروبان الياباني (منهج تاكاشي كوجيما) للأطفال والكبار
العمر 6 أشهر
الحالة 🟢 البناء أخضر · التطبيق منشور · هجرة SRB نصف مكتملة

الموقع الحالي:

· 📱 تطبيق ويب تفاعلي
· 🌍 يعمل بالعربية (مع بنية للإنجليزية)
· 📴 يعمل بدون إنترنت (offline PWA)
· 🚫 بدون إعلانات
· 🔒 خصوصية كاملة (كل البيانات على جهاز المستخدم)

---

2. الرؤية والأهداف

🎯 الرؤية

تعليم السوروبان الياباني الأصيل بالعربية — بتعليم تكيفي يكتشف نقاط ضعف الطالب ويبني له مسارًا مخصصًا.

🎯 الأهداف

1. تعليمي: نقل منهج كوجيما الياباني إلى العربية بجودة عالية.
2. تكيفي: بناء نظام تعليمي يتكيف مع قدرات كل طفل.
3. ممتع: ربط التعليم بالتسلية (فلاشات + ألعاب).
4. خصوصية: حماية بيانات الأطفال — لا سيرفر · لا تتبع.
5. مجاني: بدون إعلانات · بدون اشتراكات · بدون قيود.

---

3. الفئتان العمريتان

الفئة العمر المستويات
🧒 الأبطال الصغار 5-12 سنة L0-L3
🧑 الأبطال الكبار 13+ سنة L4-L7

ملاحظة: العمر مذكور في وصف التطبيق فقط — لا يُذكر في نصوص الدروس.

---

4. الميزات الأساسية

4.1 المنهج

· منهج ياباني أصيل (Takashi Kojima + Japan Soroban Association).
· 8 مستويات (L0-L7).
· 15 درسًا عبر المستويات.
· ~51 مهارة دقيقة.
· دروس نصية بـSVG متحركة.
· سوروبان تفاعلي 2D5.

4.2 البنوك

· Bank A — 275 سؤالًا للتمارين والأنزان.
· Bank B — 666 سؤالًا للامتحانات وتحديد المستوى.
· بنوك قديمة (bank-v2 · bank-raw · bank-linked) — قيد الترحيل.

4.3 الأنظمة

· نظام القفل المتسلسل — لا يُفتح مستوى قبل اجتياز السابق.
· نظام التقييم — 4 أقسام لكل مستوى (تمرّن · أنزان بصري · فلاش · سمعي).
· نظام الشارات — 4 أنظمة متوازية (mastery · anzan · audio · BADGES).
· نظام الجلسات العلاجية — تلقائي عند الضعف.
· نظام تحديد المستوى — للطلاب الجدد.

4.4 الأقسام التعليمية الإضافية (جديد)

· 🎬 قسم الفلاشات التعليمية — مشاهدة خطوة بخطوة + تطبيق.
· 🎪 مدينة الألعاب — 5 ألعاب قصيرة (45-90 ث).

4.5 الأبطال الأربعة

· 🦸‍♀️ شام — الذكية
· 🦸‍♂️ ريان — السريع
· 🦸‍♀️ بانة — الهادئة
· 🦸‍♂️ جود — الذكي

4.6 الشهادات

· KidsCertificateScreen — للأطفال.
· CertificateScreen — للكبار.
· تصميم رسمي · رقم شهادة · رابط تحقق.

4.7 الإثراء التفاعلي

· أسرار سحرية (جدول الضرب).
· رياضيات الأصابع.
· رياضيات فيدية.

4.8 وضع المعاينة 👁️

· أداة موحّدة للمطوّر.
· فتح كل المستويات والأقسام.
· تجاوز فترة الانتظار.
· درجات افتراضية للشهادات.

---

5. البنية التقنية

5.1 Stack

العنصر التقنية
اللغة TypeScript 5.5
إطار الواجهة React 18
أداة البناء Vite 5
التنسيق Tailwind CSS
إدارة الحالة Zustand 4 (persist + localStorage)
الحركات Framer Motion
الأيقونات lucide-react
النشر GitHub Pages (GitHub Actions)
التخزين localStorage
الأصوات Web Speech API (إنجليزي) + MP3 (عربي)
الاختبارات vitest (مُعدّ · لا اختبارات بعد)

5.2 بيئة التشغيل

· ✅ يعمل offline — PWA.
· ✅ بدون سيرفر — ملفات ثابتة.
· ✅ بدون قاعدة بيانات — البيانات على الجهاز.
· ✅ خصوصية كاملة — لا تتبع · لا تحليلات.

5.3 قرار صوتي

العربية: Sorobana MP3 (قصة مسجلة).
الإنجليزية: Web Speech API (صوت المتصفح).

السبب في اختيار Web Speech بدل Edge TTS:

المعيار Web Speech Edge TTS
مجاني ✅ ✅
يعمل offline ✅ ❌
يحتاج API خارجي ❌ ✅
CORS لا مشكلة مشكلة حاسمة
رسمي ✅ ⚠️
يعمل في PWA ✅ ⚠️

التبديل: عند تغيير اللغة إلى الإنجليزية → يتوقف كل صوت Sorobana تلقائيًا.

---

6. الروابط والمطوّر

6.1 الروابط

العنصر الرابط
الموقع 
المستودع 
Actions 

6.2 المطوّر

مصطفى علي أكر (@mezo2021)

---

7. وثائق المشروع

الملف الغرض الحالة
README.md نظرة عامة للمستخدمين ✅ معتمد
PROJECT_MASTER.md هذا الملف — المرجع التقني الموحّد ✅ معتمد
FLASH_SECTION.md قسم الفلاشات التعليمية ✅ مُدمج
GAMES_SECTION.md قسم مدينة الألعاب ✅ مُدمج
STATE_OF_THE_PROJECT.md مصدر حالة المشروع ✅ معتمد
REPAIR_PLAN.md خطة الإصلاح (سيُعاد كتابتها) 🟡 لاحقًا
ACHIEVEMENTS.md سجل الجلسات + التقييم ✅ معتمد
GEMINI_PLAYBOOK.md دليل بناء Bank B ✅ معتمد
~~AL-ISLAH.md~~ ~~وثيقة الفحص الأولية~~ 🗄️ مؤرشف
~~AL-ISLAH-V2.md~~ ~~الفحص الشامل v5~~ 🗄️ مؤرشف
~~PLAN_v3.md~~ ~~الخطة القديمة P1-P16~~ 🗄️ مؤرشف
audit-v8.md نتائج الفحص AST ✅ معتمد
audit-v9.md نتائج الفحص Bash ✅ معتمد

⚠️ ملاحظة مهمة

الوثائق القديمة (AL-ISLAH · AL-ISLAH-V2 · PLAN_v3) مؤرشفة ولا تُعتمد.
السبب: مبنية على v5 الذي تجاوزته الأحداث.

المرجع الموحد الآن:

· هذا الملف (PROJECT_MASTER.md) — لكل التعريفات.
· STATE_OF_THE_PROJECT.md — لحالة المشروع الآنية.
· audit-v8 + audit-v9 — للتشخيص التقني.
· REPAIR_PLAN.md — الخطة (قيد الكتابة).

---

🎬 الجزء الثاني — قسم الفلاشات التعليمية

8. الفلاشات — الرؤية والأهداف

🎯 الهدف الأساسي

توفير بديل عملي للدروس السلبية، يُتيح للطفل:

· مشاهدة شرح خطوة بخطوة.
· تطبيق بنفسه على معدادين متزامنين.
· فهم دور كل رقم في الحل.

📖 الفجوة التي نعالجها

الوضع السابق الوضع الجديد
معداد واحد (ناتج فقط) معدادان متزامنان
الطفل يحفظ الإجراء الطفل يفهم المنطق
لا ربط بالأنزان جسر مباشر نحو الأنزان

🎓 المخرجات المتوقعة

· ✅ فهم دور المقسوم/المضروب في الحل.
· ✅ إدراك كيف ينمو الناتج منزلة بمنزلة.
· ✅ أساس قوي لـ الأنزان.

---

9. الفلاشات — البنية العامة

```text
🏠 Hero Dashboard
      ↓ زر "🎬 الفلاشات التعليمية"
📋 FlashListScreen (القائمة)
      ↓
├── 🎬 زر "شاهد" → FlashScreen (مشاهدة)
│        ↓ رجوع → FlashListScreen
│
├── 🖐️ زر "جرّب" (قسمة) → TwoAbacusSolver
│        ↓ رجوع → FlashListScreen
│
└── 🖐️ زر "جرّب" (ضرب) → MultSolver
         ↓ رجوع → FlashListScreen
```

🔑 مبدأ التصميم

FlashListScreen يدير التنقل داخليًا — App.tsx لا يتغير.

---

10. الفلاشات — الملفات والمكونات

📂 قائمة الملفات

# الملف الوظيفة الحالة
1 types.ts أنواع FlashStep / FlashLesson ✅
2 flashData.ts بيانات الفلاشات (أساسيات + قسمة) ✅
3 multData.ts بيانات دروس الضرب ✅
4 FlashListScreen.tsx قائمة + تنقل داخلي ✅
5 FlashScreen.tsx عرض الفلاش (مشاهدة + TTS) ✅
6 MentalBadge.tsx شارة المعادلة (متعددة الأسطر) ✅
7 sorobanDivisionData.ts بيانات تمارين القسمة + جدول الربط ✅
8 TwoAbacusSolver.tsx تمرين القسمة (معدادان) ✅
9 MultSolver.tsx تمرين الضرب (معدادان) ✅
10 Soroban2D5.tsx المعداد 🟡 معدَّل (props)
11 Rod2D5.tsx عمود واحد 🟡 معدَّل (props)

المسار: src/components/flash/

---

11. الفلاشات — Props الجديدة

🆕 في Soroban2D5

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

12. الفلاشات — الدروس المتوفرة

🎬 الفلاشات

# القسم الدروس الأسئلة
1 أساسيات 3 دروس أجزاء السوروبان · الخرزة العلوية · الخرزات السفلية
2 قسمة ÷1 (S07) 4 دروس 84÷2 · 54÷3 · 152÷8 · 216÷8
3 قسمة ÷2 (S08) 4 دروس 484÷22 · 572÷22 · 350÷14 · 234÷18
4 ضرب 2×1 (S05) 4 دروس حسب multData
5 ضرب 2×2 (S06) 4 دروس حسب multData

الإجمالي: 19 درسًا فلاشيًا.

---

13. الفلاشات — التمارين المتوفرة

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

8 دروس: mult-2x1-m1..m4 + mult-2x2-m1..m4.

---

14. الفلاشات — نظام الألوان

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

15. الفلاشات — قاعدة كوجيما

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

16. الفلاشات — ميثاق عدم اللمس

🔒 ممنوع تمامًا

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

· Props جديدة اختيارية في Soroban2D5 وRod2D5.
· ملفات جديدة كليًا.
· جدول الربط في sorobanDivisionData.ts.

🛡️ ضمانات

· أي prop جديدة → default = undefined.
· لا تُستدعى من الوضع الطبيعي.
· اختبار إلزامي على 4 أوضاع بعد أي تعديل:
  · 🎮 Playground · 📚 درس · ✍️ تمرين · 🧠 أنزان

---

17. الفلاشات — آلية FlashScreen

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

18. الفلاشات — آلية TwoAbacusSolver

🖐️ نفس المسألة — 2-3 مراحل

مثال: 837 ÷ 3

المرحلة المقسوم الناتج التعليمات
1 837 → 237 0 → 200 8 ÷ 3
2 237 → 27 200 → 270 23 ÷ 3
3 27 → 0 270 → 279 27 ÷ 3

🔄 الفرق عن الفلاش

البند الفلاش التمرين
الوحدات 8 حركات 2-3 مراحل
الطفل يشاهد يُنفّذ
التعديل تلقائي يدوي
التحقق لا ✅ زر
TTS تلقائي 🔊 زر "إعادة الصوت"

🎯 خطوات المرحلة الواحدة

1. الطفل يُعدّل المعدادين.
2. يضغط 🔍 تحقق من الإجابة.
3. النظام يقارن:
   · ✅ الاثنان صحيحان → "أحسنت" → زر "المرحلة التالية".
   · ⚠️ خطأ في الناتج → "معداد الناتج (🟢) غير صحيح".
   · ⚠️ خطأ في المقسوم → "معداد المقسوم (🔴) غير صحيح".
   · ⚠️ الاثنان → "المعدادان يحتاجان تعديلًا".
4. لا انتقال تلقائي — الطفل يقود.

---

19. الفلاشات — آلية MultSolver

🖐️ نفس البنية — معدادان بترتيب مختلف

العنصر القسمة الضرب
🟢 الناتج يمين · يتعّمّر يمين · يتعّمّر
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

· الضرب: المضروب يبقى ثم يُطمس تدريجيًا (يُستهلك رمزيًا).
· القسمة: المقسوم يتناقص فعليًا مع كل طرح.

⚠️ عدد الأعمدة

المسألة الأعمدة
2×1 (32 × 3) 3 (مئات · عشرات · آحاد)
2×2 (23 × 33) 4 (آلاف · مئات · عشرات · آحاد)

---

20. الفلاشات — نظام TTS مع التشكيل

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

21. الفلاشات — التنقل والربط

🎯 آلية التنقل

مبدأ: FlashListScreen يدير كل شيء داخليًا.

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

· ❌ App.tsx — لا تعديل.
· ❌ HeroDashboard — لا تعديل.
· ❌ LessonScreen — لا تعديل.

الزر يظهر تلقائيًا في FlashListScreen.

---

22. الفلاشات — بنية البيانات

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

🔗 جدول LESSON_TO_PROBLEM

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

📌 ملاحظات للمساعد القادم — الفلاشات

🎯 لإضافة فلاش قسمة

1. أضف FlashLesson في flashData.ts.
2. أضف DivisionProblem في sorobanDivisionData.ts.
3. اربطهما في LESSON_TO_PROBLEM.

🎯 لإضافة فلاش ضرب

1. أضف FlashLesson في multData.ts.
2. لا حاجة لجدول ربط.

🎯 لإضافة ميزة جديدة

1. PropTypes اختيارية فقط.
2. اختبار على 4 أوضاع.
3. توثيق في plannew.md.

---

🎬 الفلاشات — دروس مستفادة

🔴 مشاكل واجهناها وحلها

# المشكلة الحل الملف
1 TTS لا يعمل في useEffect user gesture + زر "ابدأ" FlashScreen · MultSolver
2 الصوت يُقطع onEnd + fallback 10s FlashScreen
3 tts في deps → re-runs ttsRef ثابت FlashScreen · MultSolver
4 Badge يُقطع من الأعلى mx-auto بدل absolute MentalBadge
5 ألوان تغطي الخلفية CSS filter على الخرزات فقط Rod2D5
6 حلقة على كل عمود حلقة فقط عند tint='white' Rod2D5
7 electric-500 غير موجود استبدال بـviolet-700 FlashListScreen
8 "عشرون" تُلفظ "عشر" تشكيل موجَّه flashData · multData
9 أخطاء رياضية في S08 مراجعة يدوية multData
10 زر "شاهد" لا يعمل للضرب ?? getMultLessonById FlashListScreen

🎓 قواعد ذهبية

1. ttsRef — مرجع ثابت للـuseSpeech.
2. onEnd — لا انتقال بدون انتهاء الصوت.
3. user gesture — أول تشغيل TTS يحتاج زر "ابدأ".
4. default undefined — كل prop جديدة اختيارية.
5. one source of truth — مصدر واحد للصوت (handler).
6. blurDividend + dimColumns — طمس تدريجي (ضرب).
7. تشكيل موجَّه — الكلمات المُشكِلة فقط (TTS).
8. ?? getMultLessonById — للتمييز بين القسمة والضرب.

---

🚀 الفلاشات — التوسّع المستقبلي

🎯 أفكار مؤجلة

# الفكرة الوصف
🅰️ الطرح المتسلسل للقسمة على 3+ أرقام
🅱️ Ghost Abacus جسر نحو الأنزان
🅲️ Adaptive Mastery الانتقال التلقائي بين الأنماط
🅳️ Anzan Metrics قياس سرعة التفاعل
🅴️ قسمة على 3 أرقام S09+
🅵️ L4-L7 المنهج الكامل

📋 خطوات التوسّع

1. إضافة درس قسمة جديد:
   · أضف FlashLesson في flashData.ts.
   · أضف DivisionProblem في sorobanDivisionData.ts.
   · اربطهما في LESSON_TO_PROBLEM.
2. إضافة درس ضرب جديد:
   · أضف FlashLesson في multData.ts.
   · لا حاجة لجدول ربط.
3. مستويات جديدة (L4-L7):
   · نفس البنية.

🎪 الجزء الثالث — قسم مدينة الألعاب

23. الألعاب — الرؤية والغرض

🎯 الهدف

مدينة الألعاب قسم تعليمي ترفيهي في تطبيق SorobanMind يقدّم 5 ألعاب قصيرة (45-90 ثانية) تربط التعليم بالمتعة، وتستخدم المعداد كمحرك مركزي.

📖 الفكرة التربوية

· Learn-then-Play: الطفل يجمع XP من الدروس → يشتري تذاكر → يلعب.
· Scarcity: موارد محدودة → قيمة أعلى للعبة.
· Session Control: جلسات قصيرة → لا إدمان · لا إرهاق بصري.
· Loop: درس → XP → تذكرة → لعبة → XP → درس...

🎓 المخرجات المتوقعة

· تقوية مفاهيم السوروبان (Subitizing · الأصدقاء · الجدة · العملاق · المربعات · الجذور).
· تحفيز الطفل على إتمام الدروس (XP بوابة للألعاب).
· توفير متنفّس ممتع بعد الجهد الدراسي.
· تحضير الطفل للأنزان (الحساب الذهني الخالص).

---

24. الألعاب — البنية المعمارية

📁 شجرة المجلدات

```text
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
│   ├── LaserAbacus.tsx
│   └── bank.ts
│
├── Pirates/                         🏴‍☠️ اللعبة 4
│   ├── PirateRaceGame.tsx
│   ├── PirateScene.tsx
│   ├── MultiRodAbacus.tsx
│   ├── SolutionPlayer.tsx
│   ├── mulEngine.ts
│   ├── divEngine.ts
│   ├── quizTypes.ts
│   ├── quizFactory.ts
│   ├── timeModel.ts
│   └── seaSfx.ts
│
└── Sorobania/                       🏝️ اللعبة 5
    ├── SorobaniaGame.tsx            (منطق · شاشات · export default)
    ├── sorobaniaData.ts             (ثوابت · أنواع · مراحل · حفظ)
    ├── sorobaniaSfx.ts              (WebAudio)
    ├── SorobaniaScenes.tsx          (SVG · احتفالات)
    └── SorobaniaUI.tsx              (Hud · بانة · فتيل · دروس)
```

🔗 نقاط الدخول

```text
HeroDashboard
├── زر "🎬 الفلاشات التعليمية"   → FlashListScreen
├── زر "🎪 مدينة الألعاب"         → GamesListScreen
└── زر "🎯 امتحان تحديد المستوى"  → PlacementTestScreen

GuardianDashboard
├── زر "👁️ وضع المعاينة"         → soroban_dev_preview
├── زر "💾 حفظ نسخة"            → handleBackup
├── زر "📥 استعادة"             → handleRestore
└── زر "🗑️ تصفير"               → handleReset
```

لا تعديل على App.tsx — القسم يدير نفسه داخليًا.

---

25. الألعاب — البنية الاقتصادية (XP ↔ التذاكر)

💰 رصيدان منفصلان

الرصيد الغرض السقف المتغير
totalXP التقدم في المستويات بلا سقف totalXP
ticketXP شراء التذاكر 50 ticketXP
التذاكر رصيد اللعب 5 tickets

🔄 الحلقة الكاملة

```text
📚 إجابة صحيحة → +5 XP
   ├── totalXP = totalXP + 5       (بلا سقف)
   └── ticketXP = min(50, ticketXP + 5)
        ↓
ticketXP ≥ 10 → زر "🎟️ اشترِ تذكرة"
        ↓
ضغط → ticketXP -= 10 · tickets += 1
        ↓
دخول مدينة الألعاب → الضغط على لعبة
        ↓
tickets -= 1 (استهلاك عند الفتح)
        ↓
اللعب → 45-90 ث → XP مكافأة (2-5)
        ↓
العودة للدروس
```

⚙️ الثوابت (progressStore.ts)

```tsx
export const TICKET_COST = 10;       // 10 XP = تذكرة
export const TICKET_XP_CAP = 50;     // سقف ticketXP
export const TICKETS_MAX = 5;        // 5 تذاكر في الجيب
```

📊 معدل الاكتساب

النشاط XP لكل إجابة
PracticeScreen +5
AnzanScreen +5
AudioAnzanScreen +5
الألعاب الخمس +2 إلى +5 (نهاية)

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

26. الألعاب — الألعاب الخمس

📋 الجدول العام

# اللعبة id المدة البطل الحالة
1 🛸 العداد الطائر flying-abacus 60 ث المختار (default: ريان) ✅
2 🔍 المحقق الرقمي detective 45 ث جود ✅
3 🥋 دوجو السوروبان friends 90 ث شام ✅
4 🏴‍☠️ سباق القراصنة pirate-race 90 ث ريان ✅
5 🏝️ جزيرة سوروبانيا sorobania-island 60 ث بانة ✅

🛸 26.1 — العداد الطائر (flying-abacus) ✅

البند القيمة
المهارة القراءة البصرية السريعة (Subitizing)
الآلية يظهر المعداد لثوانٍ → يختفي → 3 أزرار للإجابة
البطل المختار (default: ريان)
XP 2-5

منحنى W-Shape:

الوقت الأرقام مدة الظهور
0-10 ث 2-5 1800ms
10-25 ث 6-13 1200ms
25-40 ث 10-19 900ms
40-50 ث 4-7 1500ms
50-60 ث 20-44 700ms

الميزات:

· Gold Mode: عند 3 صح متتالي.
· Adaptive Engine: خطأان → +35% وقت + نطاق أنصف.

🔍 26.2 — المحقق الرقمي (detective) ✅

البند القيمة
المهارة قراءة المعداد · اكتشاف الأخطاء
الآلية يُعرض حساب + معداد بقيمة خاطئة → الطفل يُعدّل
البنك 40 تمرين قسمة
البطل جود
XP 2-5

الميزات:

· شرح خطأ نوعي (استلاف · صفر مفقود · قلب · إزاحة).
· تكيف ذكي · تخطّي بعد 3 أخطاء.

🥋 26.3 — دوجو السوروبان (friends) ✅

البند القيمة
المهارة قواعد أصدقاء 5 و 10
الآلية معداد SVG تفاعلي + محرك خطوة-بخطوة
البنك 40 تمرين
البطل شام
XP 2-5

الميزات:

· محرك كشف الخطأ.
· وميض أحمر + اهتزاز.
· إرجاع تلقائي 0.85 ث.
· أشباح زرقاء + أسهم.
· نجوم 1-3 · سلسلة كومبو · تكيف.
· أحزمة 5 مستويات.

🏴‍☠️ 26.4 — سباق القراصنة (pirate-race) ✅

البند القيمة
المهارة الضرب والقسمة (كوجيما)
الآلية مسائل + 3 خيارات · شريط فجوة 0-100%
البطل ريان
XP 2-5

الميزات:

· mulEngine.ts · divEngine.ts.
· SolutionPlayer.tsx — جسر تعليمي (معدادان للقسمة).
· شريط الفجوة: صح +6 · خطأ −12 · مهلة −15.
· 3 حالات جوية.
· المشهد SVG: أمواج · سفينتان · جزيرة.
· رمية حبل ريان (gap < 30).

🏝️ 26.5 — جزيرة سوروبانيا (sorobania-island) ✅

البند القيمة
المهارة المربعات (1-25 + منتهية بـ5) والجذور التربيعية
البطل بانة
البنية 5 ملفات
XP 2-4
الحفظ sorobania_progress_v2

الآلية:

· المرحلة 1: مربعات · 3 خيارات · 10 ث.
· المرحلة 2: جذور · كيبورد رقمي · 15 ث.

الميزات:

· 4 مشاعل = 4 حيوات.
· 8 مناطق على الخريطة.
· كل 3 صح → إشعال مشعل.
· 10 إجابات صحيحة → فتح الجذور.
· درسان (سرّ الخمسات · طريقة الأزواج).
· رقم قياسي: أطول سلسلة + أسرع متوسط.

---

27. الألعاب — المكونات المشتركة (3 معادات)

# المكون الاستخدام الأعمدة التفاعل
1 Soroban2D5.tsx الدروس · التمارين · الفلاشات · المحقق · العداد الطائر N ✅
2 Friends/LaserAbacus.tsx دوجو السوروبان 2 ✅ + ليزر
3 Pirates/MultiRodAbacus.tsx سباق القراصنة 5 ❌ للعرض
4 Pirates/MultiRodAbacus.tsx v2 القراصنة (عرض + title + ألوان) 3-5 ❌ للعرض

القرار: التوحيد مؤجَّل.

---

28. الألعاب — نظام الأصوات والاهتزاز

🔊 TTS

```tsx
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
const { speak, stop, isSpeaking, isSupported } = useCharacterVoice('sham');
speak('نص مشكّل');
```

نبرة كل بطل:

البطل pitch rate gender
شام 1.40 0.95 female
ريان 0.70 1.15 male
بانة 1.25 0.90 female
جود 0.80 1.05 male

📢 طبقات الكلام

اللحظة متى
بدء اللعبة user gesture
Gold Mode عند التفعيل
5 صح متتالي عند التفعيل
خطأ عند الخطأ
نهاية اللعبة عند النهاية

قاعدة: TTS في لحظات محددة · البطل يصمت أثناء التفكير.

📳 الاهتزاز

الحالة النمط
صح 30
خطأ [0, 40, 40, 40]
Gold [0, 20, 20, 20, 20, 60]
بدء 50
نهاية [0, 40, 40, 40, 40, 80]

🎵 أصوات القراصنة (seaSfx.ts)

· موج دائم (ضوضاء بيضاء lowpass 400Hz).
· رعد (sawtooth ينزل 60 → 20 Hz).
· بوق نجاح (330 → 440 → 554 Hz).
· بوق فشل (180 → 110 Hz).

🎶 أصوات Sorobania (sorobaniaSfx.ts)

· click · correct · wrong · tick.
· relight · star · fanfare · lose · unlock.
· setSoundOn(on) للتحكم.

بلا ملفات mp3 — كل شيء مُولَّد.

---

29. الألعاب — نظام البطل المرافق

🎭 الأبطال الأربعة

البطل الصفة الملف الصوت
شام الذكية sham.png أنثوي · 1.40
ريان السريع rayan.png ذكوري · 0.70
بانة الهادئة bana.png أنثوي · 1.25
جود الذكي joud2.png ذكوري · 0.80

المسار: src/assets/avatars/
البطل المختار: soroban_companion

🎭 توزيع الأبطال

اللعبة البطل
العداد الطائر المختار
المحقق الرقمي جود
دوجو السوروبان شام
سباق القراصنة ريان
جزيرة سوروبانيا بانة

🖼️ حالات المزاج

الحالة الأنيميشن
idle طوفان رأسي · 2.5 ث
thinking ميلان يمين-يسار · 2 ث
excited قفز + تكبير · 0.6 ث
celebrating قفز + تكبير · 0.6 ث
sad انكماش خفيف · 0.6 ث

---

30. الألعاب — وضع المعاينة الكامل (Preview Mode)

· المفتاح: soroban_dev_preview
· القيمة: 'true'
· الملف: src/utils/previewMode.ts
· الزر: في GuardianDashboard

عند التفعيل:

· ✅ كل الألعاب مفتوحة.
· ❌ لا تذاكر.
· ❌ لا استهلاك.
· ❌ لا XP.

```typescript
import { isPreviewMode } from '@/utils/previewMode';
if (isPreviewMode()) { /* ... */ }
```

---

31. الألعاب — إضافة لعبة جديدة (دليل خطوة بخطوة)

1️⃣ gamesData.ts

```tsx
{
  id: 'new-game-id',
  title: 'اسم اللعبة',
  subtitle: 'وصف',
  icon: '🎮',
  gradient: 'from-color-500 to-color-700',
  recommendHero: 'sham',
  duration: '60 ثانية',
  status: 'ready',
}
```

2️⃣ مجلد جديد

```text
src/components/games/NewGame/
└── NewGame.tsx
```

3️⃣ المكوّن

```tsx
export default function NewGame({ onBack }: { onBack: () => void }) {
  return <div dir="rtl">{/* ... */}</div>;
}
```

4️⃣ الربط في GamesListScreen.tsx

```tsx
import { NewGame } from './NewGame/NewGame';

if (active.gameId === 'new-game-id') {
  return <NewGame onBack={() => setActive(null)} />;
}
```

---

32. الألعاب — قرارات تصميمية محسومة

✅ ثابتة

1. لا لمس App.tsx.
2. لا لمس Soroban2D5 (فقط props).
3. جلسات 45-90 ثانية.
4. البطل يصمت أثناء التفكير.
5. الرقم القياسي شهري.
6. تصفير Guardian يحفظ 11 مفتاحًا.
7. امتحان تحديد المستوى = 10 دقائق.
8. L7 يُفتح للموصى به.
9. Gold Mode — 3 صح · يزول بأول خطأ.
10. XP: 2-5 لكل لعبة.
11. لا تفريع حسب العمر.
12. TICKET_XP_CAP = 50.
13. TICKETS_MAX = 5.

❌ مؤجَّلة للنسخة 2

· Hyper-Speed Burst.
· تفريع حسب العمر.
· توحيد المكونات الثلاثة.
· لوحة صدارة عالمية.
· الببغاء الثرثار.

---

33. الألعاب — قيود وحمايات

🔒 محمي

الملف السبب
useSorobanLogic.ts منطق الخرزات
Bead2D5.tsx رسم الخرزة
Soroban2D5.tsx props فقط
App.tsx التنقل
LessonScreen.tsx الدروس
PracticeScreen.tsx التمارين
AnzanScreen.tsx الأنزان

✅ مسموح

· ملفات جديدة في src/components/games/.
· props اختيارية في Soroban2D5 · Rod2D5.
· تعديل progressStore.ts (إضافة حقول).
· تعديل HeroDashboard.tsx (زر).
· تعديل GamesListScreen.tsx (ربط).
· تعديل gamesData.ts (status).

🧪 اختبار بعد أي تعديل

1. 🎮 SorobanPlayground
2. 📚 LessonScreen
3. ✍️ PracticeScreen
4. 🧠 AnzanScreen
5. 🎬 FlashListScreen
6. 🎪 GamesListScreen

---

34. الألعاب — بنية Sorobania

الملف الأسطر الدور
SorobaniaGame.tsx 1057 منطق · شاشات · export default
SorobaniaScenes.tsx 608 SVG · احتفالات
SorobaniaUI.tsx 407 Hud · بانة · فتيل · دروس
sorobaniaData.ts 377 ثوابت · أنواع · مراحل · حفظ
sorobaniaSfx.ts 133 WebAudio

الربط: GamesListScreen يستورد SorobaniaGame فقط.
الحفظ: sorobania_progress_v2 (11 مفتاحًا في keysToKeep).

---

📌 سجل الأخطاء المُصلَحة — الألعاب

في progressStore.ts

الخطأ الإصلاح
ticketXP يُصفَّر عند الترقية migration v9
tickets لا تُحفظ migration v9
TICKET_XP_CAP منخفض رُفع إلى 50
TICKETS_MAX = 1 رُفع إلى 5

في GuardianDashboard.tsx

الخطأ الإصلاح
تصفير يفقد السجل 11 مفتاحًا في keysToKeep
handleBackup يُخفي مفاتيح إزالة الفلتر
handleRestore يترك حالة هجينة مسح قبل الكتابة
sorobania_progress_v2 مفقود أُضيف

في GamesListScreen.tsx

الخطأ الإصلاح
العنوان: XP الكلي مَحْفَظَةُ النِّقَاط
الأرقام معكوسة (RTL) dir="ltr"
النص السفلي سلبي "📚 اذهب إلى دروسك"
استهلاك على building فحص game.status

في Sorobania

الخطأ الإصلاح
ملف واحد 2398 سطر قُسّم إلى 5 ملفات
bestStreakRef لا يُصفَّر أُضيف في beginStage

في PirateRaceGame.tsx

الخطأ الإصلاح
isPreview بدل isPreviewMode صُحح
mood="happy" قيمة صحيحة
<HighScoreBadge entry> gameId
useCharacterVoice() بلا وسيط 'rayan'
اسم الطفل 'البطل' readChildName()
عرض خطوة واحدة عند الخطأ كل الخطوات

في useCharacterVoice.ts

الخطأ الإصلاح
كل الأبطال بنفس الصوت pitch متضخم
Chrome لا يحمّل الأصوات voicesReady state

---

📚 مسارات الاستيراد — الألعاب

```typescript
'@/components/soroban2d5/Soroban2D5'
'@/hooks/useCharacterVoice'
'@/store/progressStore'
'@/utils/previewMode'
'@/types'
'@/components/games/GameCompanion'
'@/components/games/HighScoreBadge'
'@/components/games/highScoreStore'
```

---

🚨 عند الفشل — الألعاب

1. لا تُعِد البناء من الصفر.
2. افحص الملفات الفعلية.
3. تحقق من أسماء الملفات.
4. اسأل قبل التخمين.

---

📖 الملفات المرجعية — الألعاب

· STATE_OF_THE_PROJECT.md — مصدر الحقيقة.
· REPAIR_PLAN.md — خطة الإصلاح.
· SESSION_2026-10-13.md — سجل الجلسة.
· GAMES_CITY.md — (مُدمج في هذا الملف).
· FLASH_SECTION.md — (مُدمج في هذا الملف).


</div>


