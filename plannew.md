plannew.md


## 🎬 قسم الفلاشات — دروس مستفادة

### 🔴 مشاكل واجهناها وحلها

| # | المشكلة | الحل | الملف |
|:-:|---|---|---|
| 1 | TTS لا يعمل في useEffect | user gesture + زر "ابدأ" | FlashScreen · MultSolver |
| 2 | الصوت يُقطع | onEnd + fallback 10s | FlashScreen |
| 3 | tts في deps → re-runs | ttsRef ثابت | FlashScreen · MultSolver |
| 4 | Badge يُقطع من الأعلى | mx-auto بدل absolute | MentalBadge |
| 5 | ألوان تغطي الخلفية | CSS filter على الخرزات فقط | Rod2D5 |
| 6 | حلقة على كل عمود | حلقة فقط عند tint='white' | Rod2D5 |
| 7 | electric-500 غير موجود | استبدال بـ violet-700 | FlashListScreen |
| 8 | "عشرون" تُلفظ "عشر" | تشكيل موجَّه | flashData · multData |
| 9 | أخطاء رياضية في S08 | مراجعة يدوية | multData |
| 10 | زر "شاهد" لا يعمل للضرب | ?? getMultLessonById | FlashListScreen |

### 🎓 قواعد ذهبية

1. `ttsRef` — مرجع ثابت للـ`useSpeech`
2. `onEnd` — لا انتقال بدون انتهاء الصوت
3. **user gesture** — أول تشغيل TTS يحتاج زر "ابدأ"
4. `default undefined` — كل prop جديدة اختيارية
5. **one source of truth** — مصدر واحد للصوت (handler)
6. `blurDividend` + `dimColumns` — طمس تدريجي (ضرب)
7. **تشكيل موجَّه** — الكلمات المُشكِلة فقط (TTS)
8. `?? getMultLessonById` — للتمييز بين القسمة والضرب

---

## 🚀 قسم الفلاشات — التوسّع المستقبلي

### 🎯 أفكار مؤجلة

| # | الفكرة | الوصف |
|:-:|---|---|
| 🅰️ | **الطرح المتسلسل** | للقسمة على 3+ أرقام |
| 🅱️ | **Ghost Abacus** | جسر نحو الأنزان |
| 🅲️ | **Adaptive Mastery** | الانتقال التلقائي بين الأنماط |
| 🅳️ | **Anzan Metrics** | قياس سرعة التفاعل |
| 🅴 | **قسمة على 3 أرقام** | S09+ |
| 🅵 | **L4-L7** | المنهج الكامل |

### 📋 خطوات التوسّع

1. **إضافة درس قسمة جديد:**
   - أضف `FlashLesson` في `flashData.ts`
   - أضف `DivisionProblem` في `sorobanDivisionData.ts`
   - اربطهما في `LESSON_TO_PROBLEM`

2. **إضافة درس ضرب جديد:**
   - أضف `FlashLesson` في `multData.ts`
   - لا حاجة لجدول ربط

3. **مستويات جديدة (L4-L7):**
   - نفس البنية
```