# 🌀 بوابة الثقب الدودي: حكاية الخرز الذي حفظ الزمن
**وثيقة تصميم اللعبة (GDD) — الجزء الثالث: القمة وخريطة الطريق**
**الإصدار:** 6.0 (متوافق مع المرجع المعماري والكود الفعلي)
**آخر تحديث:** 2026-11-04

> **⚠️ ملاحظة حاسمة للمطور:** هذا المستند يحتوي على تفاصيل المستويات 5-8. هذه المستويات **غير منفذة حالياً في الكود**، وتُعد "خريطة طريق" معتمدة للمستقبل. بعض التفاصيل (خاصة أنماط الأسئلة وسرعات المؤقت) تحتاج إلى **مراجعة وتوثيق رسمي** من مواصفات نيشورين عند التنفيذ.

---

## 🗺️ المستويات من 5 إلى 8 (خريطة طريق — غير منفذة)

### 🚢 المستوى الخامس: ميناء الخانات — اللاذقية 2024 (الكيو 4)
*   **الهدف التاريخي:** العودة إلى الحاضر لإنقاذ سجلات الشحن في ميناء اللاذقية.
*   **المهارة الرياضية:** ميتوري (5 صفوف، كلها من خانتين = 10 خانات إجمالاً). الضرب (خانتين × خانة)، القسمة (3 أو 4 خانات ÷ خانة).
*   **سرعة التحدي:** 10.2 ثانية للسؤال (⚠️ تحتاج تأكيد).

### 🏙️ المستوى السادس: مكتبة الذاكرة — دمشق 2050 (الكيو 3)
*   **الهدف التاريخي:** إصلاح مسارات النقل الذكي في دمشق المستقبلية.
*   **المهارة الرياضية:** ميتوري (5 صفوف من 3 خانات = 15 خانة). الضرب (3 خانات × خانة)، القسمة (4 خانات ÷ خانة).
*   **سرعة التحدي:** 9.6 ثانية للسؤال (⚠️ تحتاج تأكيد).

### 🌐 المستوى السابع: شبكة النور — اللاذقية الذكية 2200 (الكيو 2)
*   **الهدف التاريخي:** إدارة أزمة الطاقة في اللاذقية السيبرانية.
*   **المهارة الرياضية:** ميتوري (7 صفوف من 3 خانات). الضرب (خانتين × خانتين). القسمة (4 خانات ÷ خانتين). **برمجة مرئية** (تحتاج هيكلة جديدة في `Scene`).
*   **سرعة التحدي:** 9.3 ثانية للسؤال (⚠️ تحتاج تأكيد).

### ❤️ المستوى الثامن: قلب الشبكة — الذروة (الكيو 1)
*   **الهدف التاريخي:** إصلاح الأرشيف المركزي وإنقاذ التاريخ البشري.
*   **المهارة الرياضية:** ميتوري (10 صفوف، **مع إدخال الطرح** لأول مرة). الضرب (3 خانات × خانتين). القسمة (5 خانات ÷ 2 أو 3).
*   **سرعة التحدي:** 9 ثوانٍ للسؤال (⚠️ تحتاج تأكيد).

---

## 🏆 الخاتمة: المفاجأة الكبرى والانتقال للامتحان
عند نجاح الطفل في التحدي الثامن، تتحول مسارات الطيف الصفري إلى خطوط مضيئة سليمة. تظهر سوروبانا وتقول:
> *"لقد أصلحتم البرنامج، لا المدينة وحدها. استعدنا الصلات، والاختلافات محفوظة. لقد تعلمتم كيف تحسبون في عقولكم. لقد أصبحتم جاهزين."*

تظهر شاشة احتفالية، ويظهر **زر كبير ومضيء** مكتوب عليه:
**«انتقل إلى قسم الامتحانات، لقد أصبحت جاهزاً»**

*(عند الضغط عليه، ينتقل الطفل إلى قسم الامتحانات لمحاكاة نيشورين الرسمية).*

---

## ⚙️ الملحق الأول: العقد البرمجي النهائي (TypeScript Contract)

هذا هو الشكل الفعلي (المطابق للكود) الذي تُبنى به ملفات البيانات في مجلد `data/`:

```typescript
// src/components/games/MentalArchivesGame/gameFlowTypes.ts

export type ChapterId = 'intro' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6' | 'level7' | 'level8';
export type CharacterId = 'jud' | 'aseel' | 'sorobana';

export type Line = { character: CharacterId; textAr: string; textEn: string; };

export interface SolvedExample {
  titleAr: string;
  titleEn: string;
  problem: string;
  ruleTitleAr?: string;
  ruleDescAr?: string;
  ruleTitleEn?: string;
  ruleDescEn?: string;
  steps: { textAr: string; textEn: string; }[];
}

export type GameQuestion =
  | { type: 'direct'; numbers: number[]; answer: number }
  | { type: 'complement5'; numbers: number[]; answer: number }
  | { type: 'complement10'; numbers: number[]; answer: number }
  | { type: 'combined'; numbers: number[]; answer: number } // تمت الإضافة
  | { type: 'mitori'; numbers: number[]; answer: number }
  | { type: 'multiplication'; numbers: number[]; answer: number }
  | { type: 'division'; numbers: number[]; answer: number }
  | { type: 'subtraction'; numbers: number[]; answer: number };

export type Scene =
  | { kind: 'dialogue'; id: string; lines: Line[] }
  | { kind: 'example'; id: string; ruleAr?: string; ruleEn?: string; examples: SolvedExample[] }
  | { kind: 'challenge'; id: string; questions: GameQuestion[]; timePerQuestionMs: number; requiredCorrect: number };

export type Chapter = {
  id: ChapterId;
  titleAr: string;
  titleEn: string;
  requires: ChapterId[];      
  next?: ChapterId;           
  scenes: Scene[];            
};
```

---

🛡️ الملحق الثاني: إدارة التقدم (المتجر المركزي)

تم حذف المتاجر المحلية القديمة (مثل mentalArchivesStore) نهائياً. اللعبة تعتمد الآن على المتجر المركزي فقط:

📂 الملف: src/store/progressStore.ts
🔑 المفتاح: sorobanmind-v2-progress

يحتوي المتجر على الحقول التالية الخاصة باللعبة:

· mentalArchivesProgress: تقدم القصة (أي مستوى أكمل).
· mentalArchivesExams: نتائج الامتحانات.
· الرقم القياسي: يُحفظ في highScoreStore (المفتاح soroban_high_scores_v1) عبر استدعاء addScore في المدير.

---

📚 الملحق الثالث: الدروس المستفادة (Lessons Learned)

الغرض: توثيق الأخطاء المعمارية التي واجهتنا وكيف تم حلها في المحرك (Engine)، لتجنب تكرارها (خاصة في ExamRunner).

المشكلة (Bug) السبب التقني الحل المعتمد (في المحرك)
تجميد التطبيق عند الإجابة مكتبة canvas-confetti ترمي خطأ. تغليف confetti() داخل try/catch.
قطع السؤال الأول فوراً تهيئة timeLeft بالصفر. تهيئتها بـ currentScene.timePerQuestionMs.
تداخل الأصوات الصوت السابق لا يتم إيقافه. استدعاء cancel() في speakCustom.
اختفاء الفيديو عدم وجود وسم <video> حقيقي. إضافة حالة videoState (start -> playing -> done).
اختفاء الحروف (Typewriter) استخدام setInterval مع الإضافة التراكمية. استخدام setDisplayedText(fullText.slice(0, i + 1)).
حفظ المستوى كمكتمل رغم الفشل onComplete تستدعى دون فحص. في المدير: نفحص score >= requiredCorrect قبل الحفظ.
المؤقت لا يتحرك شرط timeLeft > 0 يمنع التشغيل. إضافة timeLeft إلى مصفوفة الاعتماديات.
الأرقام العربية لا تُقبل parseInt لا تفهم الأرقام الهندية. استخدام parseInput من numberStyle.ts.
توهج الشخصية اختفى استبدال filter بحركة scale فقط. دمج filter مع الحركة في getCharacterMotion.

⚠️ ملاحظة للمطور (بناءً على مراجعة الكود):
هناك خطآن من القائمة أعلاه تم حلهما في المحرك (Engine) ولكنهما موجودان حالياً في شاشة الامتحان (ExamRunner):

1. مشكلة المؤقت (Timer) وحفظ الإجابات الفارغة عند انتهاء الوقت.
2. عدم عرض شاشة "فشل" حقيقية (الاكتفاء بعدم الحفظ في المدير).
   يجب تصحيحهما في ExamRunner ليتطابق مع سلوك المحرك.

```
