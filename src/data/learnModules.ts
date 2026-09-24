// ============================================================
// learnModules.ts — دروس السوروبان (تُبنى تدريجياً)
// ============================================================

import type { LearnModule } from './types';

// ═══════════════════════════════════════════════════════════
// المستوى 0: رياضيات الأصابع
// ═══════════════════════════════════════════════════════════
const level0: LearnModule = {
  id: 0,
  title: 'Finger Math',
  titleAr: 'رياضيات الأصابع',
  description: 'Learn numbers with your hands before Soroban',
  descriptionAr: 'تعلّم الأعداد بأصابعك قبل السوروبان',
  status: 'available',
  beads: { upper: 0, lower: 0 },
  value: 0,
  concept: 'Thumb = 5, Other fingers = 1',
  conceptAr: 'الإبهام = 5، الأصابع الأخرى = 1',
  icon: 'Hand',
  audioText:
    'أهلاً بك في مملكة الأصابع! قبل أن نتعلم السوروبان، سنتعلم لغة سحرية بأصابعنا. يدك اليمنى تمثل الآحاد، ويدك اليسرى تمثل العشرات. الإبهام مثل الجدة 5، وباقي الأصابع مثل الأطفال كل واحد قيمته 1. هيا بنا نلعب مع الأعداد من 0 إلى 99!',
  rule: 'Right hand = units, Left hand = tens',
  ruleAr: 'اليد اليمنى = الآحاد، اليد اليسرى = العشرات',
  story:
    'في مملكة الأصابع، تعيش عائلتان صديقتان: عائلة اليد اليمنى المسؤولة عن الآحاد، وعائلة اليد اليسرى المسؤولة عن العشرات. في كل عائلة، الإبهام هو الجدة الحنونة التي قيمتها 5، والأصابع الأربعة أطفال صغار كل واحد قيمته 1. اجتمعوا معاً ليصنعوا كل الأعداد من 0 إلى 99!',
  storyAudioText:
    'في مملكة الأصابع، تعيش عائلتان صديقتان: عائلة اليد اليمنى المسؤولة عن الآحاد، وعائلة اليد اليسرى المسؤولة عن العشرات. في كل عائلة، الإبهام هو الجدة الحنونة التي قيمتها خمسة، والأصابع الأربعة أطفال صغار كل واحد قيمته واحد. اجتمعوا معاً ليصنعوا كل الأعداد من صفر إلى تسعة وتسعين.',
  targetAge: '5-6',

  tactileActivity: {
    titleAr: 'لعبة العائلات',
    materials: ['قفازان ورقيان', 'أقلام ملونة', 'ورقة كبيرة'],
    steps: [
      'لوّن الإبهام في القفازين بالأخضر (الجدة 5)',
      'لوّن الأصابع الأربعة بالبرتقالي (الأطفال 1)',
      'اكتب على القفاز الأيمن: عائلة الآحاد',
      'اكتب على القفاز الأيسر: عائلة العشرات',
      'العب مع طفلك: ارفع الإبهام في اليمين، اسأله كم؟',
    ],
    goal: 'ربط الجدة 5 بالإبهام في ذهن الطفل قبل رؤية السوروبان',
  },

  examples: [
    // مثال 1: الرقم 1
    {
      problemText: 'مثّل الرقم 1 بالأصابع',
      answer: 1,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'ارفع السبابة في يدك اليمنى',
          fingerUsed: 'index',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1],
          expectedValueAfter: 1,
        },
      ],
      explanation: 'طفل واحد من عائلة الآحاد وقف = 1',
      story:
        'استدعت الجدة طفلاً واحداً من الساحة، فرفع أصبعه عالياً وقال: أنا الرقم واحد!',
      storyAudioText:
        'استدعت الجدة طفلاً واحداً من الساحة، فرفع أصبعه عالياً وقال: أنا الرقم واحد.',
    },

    // مثال 2: الرقم 3
    {
      problemText: 'مثّل الرقم 3 بالأصابع',
      answer: 3,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'ارفع ثلاثة أصابع (السبابة، الوسطى، البنصر) في اليد اليمنى',
          fingerUsed: 'index',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1, 2, 3],
          expectedValueAfter: 3,
        },
      ],
      explanation: 'ثلاثة أطفال من اليد اليمنى = 3',
      story:
        'نادى الحارس ثلاثة أطفال، فرفعوا أصابعهم وقالوا بصوت واحد: ثلاثة!',
      storyAudioText:
        'نادى الحارس ثلاثة أطفال، فرفعوا أصابعهم وقالوا بصوت واحد: ثلاثة.',
    },

    // مثال 3: الرقم 5 (الجدة)
    {
      problemText: 'مثّل الرقم 5 بالأصابع',
      answer: 5,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'ارفع الإبهام في اليد اليمنى فقط',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
      ],
      explanation: 'الجدة 5 وحدها = 5',
      story:
        'رفعت الجدة إبهامها عالياً وقالت: أنا وحدي أُساوي خمسة! هذا سرّ الجدة 5.',
      storyAudioText:
        'رفعت الجدة إبهامها عالياً وقالت: أنا وحدي أساوي خمسة! هذا سر الجدة خمسة.',
    },

    // مثال 4: الرقم 7
    {
      problemText: 'مثّل الرقم 7 بالأصابع',
      answer: 7,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'ارفع الإبهام (5) في اليد اليمنى',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
        {
          stepIndex: 2,
          instructionText: 'ارفع السبابة والوسطى (2)',
          fingerUsed: 'index',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1, 2],
          expectedValueAfter: 7,
        },
      ],
      explanation: '5 + 2 = 7 (الجدة + طفلان)',
      story:
        'رفعت الجدة إبهامها أولاً، ثم انضم إليها طفلان صغيران. صار المجموع: 5 + 2 = 7!',
      storyAudioText:
        'رفعت الجدة إبهامها أولاً، ثم انضم إليها طفلان صغيران. صار المجموع خمسة زائد اثنان يساوي سبعة.',
    },

    // مثال 5: الرقم 9
    {
      problemText: 'مثّل الرقم 9 بالأصابع',
      answer: 9,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'ارفع الإبهام في اليد اليمنى (5)',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
        {
          stepIndex: 2,
          instructionText: 'ارفع الأصابع الأربعة كلها (4)',
          fingerUsed: 'index',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1, 2, 3, 4],
          expectedValueAfter: 9,
        },
      ],
      explanation: '5 + 4 = 9 (الجدة + كل الأطفال)',
      story:
        'هيا نلعب! رفعت الجدة إبهامها، فصفّق الحارس، فصعد الأطفال الأربعة للمشاركة. الجميع هنا: 5 + 4 = 9!',
      storyAudioText:
        'هيا نلعب! رفعت الجدة إبهامها، فصفق الحارس، فصعد الأطفال الأربعة للمشاركة. الجميع هنا: خمسة زائد أربعة يساوي تسعة.',
    },

    // مثال 6: الرقم 10
    {
      problemText: 'مثّل الرقم 10 بالأصابع',
      answer: 10,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'أغلق يدك اليمنى كلها (0 آحاد)',
          fingerUsed: 'index',
          direction: 'down',
          targetColumn: 'units',
          beadsAffected: [],
          expectedValueAfter: 0,
        },
        {
          stepIndex: 2,
          instructionText: 'ارفع السبابة في اليد اليسرى (10)',
          fingerUsed: 'index',
          direction: 'up',
          targetColumn: 'tens',
          beadsAffected: [1],
          expectedValueAfter: 10,
        },
      ],
      explanation: 'عشرة = 1 في العشرات و 0 في الآحاد',
      story:
        'عندما يجتمع 10 أطفال، ينتقلون إلى قاعة العشرات! الآن صاروا عائلة كبيرة: 10',
      storyAudioText:
        'عندما يجتمع عشرة أطفال، ينتقلون إلى قاعة العشرات! الآن صاروا عائلة كبيرة: عشرة.',
    },

    // مثال 7: الرقم 27
    {
      problemText: 'مثّل الرقم 27 بالأصابع',
      answer: 27,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'اليد اليمنى (الآحاد): ارفع الإبهام + طفلين = 7',
          fingerUsed: 'both_pinch',
          direction: 'pinch_in',
          targetColumn: 'units',
          beadsAffected: [5, 1, 2],
          expectedValueAfter: 7,
        },
        {
          stepIndex: 2,
          instructionText: 'اليد اليسرى (العشرات): ارفع طفلين = 20',
          fingerUsed: 'index',
          direction: 'up',
          targetColumn: 'tens',
          beadsAffected: [1, 2],
          expectedValueAfter: 27,
        },
      ],
      explanation: '20 + 7 = 27',
      story:
        'قالت عائلة اليسرى: نحن عشرون! وقالت عائلة اليمنى: نحن سبعة! اجتمعوا معاً: 27',
      storyAudioText:
        'قالت عائلة اليسرى: نحن عشرون! وقالت عائلة اليمنى: نحن سبعة! اجتمعوا معاً: سبعة وعشرون.',
    },

    // مثال 8: الرقم 99 (الأكبر)
    {
      problemText: 'مثّل الرقم 99 بالأصابع',
      answer: 99,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'اليد اليمنى: 5 + 4 = 9',
          fingerUsed: 'both_pinch',
          direction: 'pinch_in',
          targetColumn: 'units',
          beadsAffected: [5, 1, 2, 3, 4],
          expectedValueAfter: 9,
        },
        {
          stepIndex: 2,
          instructionText: 'اليد اليسرى: 50 + 40 = 90',
          fingerUsed: 'both_pinch',
          direction: 'pinch_in',
          targetColumn: 'tens',
          beadsAffected: [5, 1, 2, 3, 4],
          expectedValueAfter: 99,
        },
      ],
      explanation: '90 + 9 = 99',
      story:
        'أكبر عدد في مملكة الأصابع! كل الأصابع مرفوعة، حتى الإبهامين: 99! الجميع يهتف: تسعة وتسعون!',
      storyAudioText:
        'أكبر عدد في مملكة الأصابع! كل الأصابع مرفوعة، حتى الإبهامين: تسعة وتسعون. الجميع يهتف: تسعة وتسعون.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// مصفوفة الدروس — سيُضاف كل مستوى هنا تدريجياً
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// المستوى 1: تعريف السوروبان
// ═══════════════════════════════════════════════════════════
const level1: LearnModule = {
  id: 1,
  title: 'Introduction to Soroban',
  titleAr: 'تعريف السوروبان',
  description: 'What is Soroban, its parts and benefits',
  descriptionAr: 'ما هو السوروبان؟ أجزاؤه وفوائده',
  status: 'locked',
  beads: { upper: 1, lower: 4 },
  value: 0,
  concept: 'Soroban = 4 lower beads (1) + 1 upper bead (5)',
  conceptAr: 'السوروبان = 4 خرزات سفلية (1) + خرزة علوية (5)',
  icon: 'Info',
  audioText:
    'مرحباً بكم في عالم السوروبان! السوروبان آلة حساب يابانية عمرها أكثر من 400 سنة. اخترعه اليابانيون لتنشيط الدماغ وتقوية الذاكرة. جسر أفقي يقسم المعداد، وتحته 4 خرزات كل واحدة تساوي 1، وفوقه خرزة واحدة تساوي 5.',
  rule: 'Upper bead = 5, Lower beads = 1 each',
  ruleAr: 'الخرزة العلوية = 5، السفلية = 1',
  story:
    'في يوم مشمس، وصل ثلاثة أبطال صغار — شام وريان وبانة — إلى بوابة خشبية ضخمة نُقش عليها: قلعة السوروبان — من يدخلها يصبح سيد الأرقام. دقّوا الجرس، فانفتح الباب، وظهر حارس القلعة: رجل خشبي اسمه الإطار. قال مبتسماً: في هذه القلعة تسكن عائلة غريبة: أربعة أطفال نشيطون في الطابق السفلي، كل واحد قيمته واحد. وفوق الجسر تسكن الجدة الحنونة، قيمتها خمسة.',
  storyAudioText:
    'في يوم مشمس، وصل ثلاثة أبطال صغار إلى بوابة خشبية ضخمة نُقش عليها: قلعة السوروبان، من يدخلها يصبح سيد الأرقام. دقوا الجرس، فانفتح الباب، وظهر حارس القلعة: رجل خشبي اسمه الإطار. قال مبتسماً: في هذه القلعة تسكن عائلة غريبة: أربعة أطفال نشيطون في الطابق السفلي، كل واحد قيمته واحد. وفوق الجسر تسكن الجدة الحنونة، قيمتها خمسة.',
  targetAge: '6-7',
  requiresAllPrevious: true,

  // ✨ إعدادات التفاعل
  interactionMode: 'number-input',
  maxAttempts: 5,

  tactileActivity: {
    titleAr: 'نشاط بناء السوروبان',
    materials: ['إطار من الكرتون', '10 خرزات خشبية', 'أعواد أسنان'],
    steps: [
      'اصنع إطاراً من الكرتون على شكل مستطيل',
      'اقسمه بجسر أفقي إلى قسمين',
      'أدخل 4 خرزات في القسم السفلي',
      'أدخل خرزة واحدة في القسم العلوي',
      'أعط الجدة الخرزة العلوية، والأطفال الخرزات السفلية',
    ],
    goal: 'فهم البنية الفيزيائية للسوروبان قبل التعلم النظري',
  },

  // ═══════════════════════════════════════════════════════════
  // 9 أسئلة متنوعة — كل سؤال يختبر مفهوماً مختلفاً
  // ═══════════════════════════════════════════════════════════
  examples: [
    // 1) قيمة الخرزة العلوية (الجدة)
    {
      problemText: 'ما قيمة الخرزة العلوية (الجدة)؟',
      answer: 5,
      ruleCategory: 'direct',
      steps: [],
      explanation:
        'الخرزة العلوية وحدها تساوي 5. نسميها الجدة 5، لأنها تجلس فوق الجسر في الطابق العلوي.',
      story:
        'الجدة تجلس وحدها في الطابق العلوي، وقيمتها خمسة كاملة. هذا سرّ الجدة!',
      storyAudioText:
        'الجدة تجلس وحدها في الطابق العلوي، وقيمتها خمسة كاملة. هذا سر الجدة.',
    },

    // 2) قيمة الخرزة السفلية (الطفل)
    {
      problemText: 'ما قيمة كل خرزة سفلية (طفل)؟',
      answer: 1,
      ruleCategory: 'direct',
      steps: [],
      explanation:
        'كل خرزة سفلية تساوي 1. نسميها طفلاً، لأن الأربعة أطفال يسكنون تحت الجسر في الطابق السفلي.',
      story:
        'تحت الجسر يسكن أربعة أطفال نشيطون، كل واحد قيمته واحد فقط.',
      storyAudioText:
        'تحت الجسر يسكن أربعة أطفال نشيطون، كل واحد قيمته واحد فقط.',
    },

    // 3) الجدة + طفلان
    {
      problemText: 'الجدة + طفلان = كم؟',
      answer: 7,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'أنزل الجدة (5)',
          fingerUsed: 'index',
          direction: 'down',
          targetColumn: 'units',
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
        {
          stepIndex: 2,
          instructionText: 'ارفع طفلين (2)',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1, 2],
          expectedValueAfter: 7,
        },
      ],
      explanation: '5 + 2 = 7 (الجدة + طفلان)',
      story:
        'نزلت الجدة من طابقها لترى الأطفال، فانضم إليها طفلان صغيران. صار المجموع: 5 + 2 = 7',
      storyAudioText:
        'نزلت الجدة من طابقها لترى الأطفال، فانضم إليها طفلان صغيران. صار المجموع خمسة زائد اثنين يساوي سبعة.',
    },

    // 4) عدد الخرزات السفلية
    {
      problemText: 'كم خرزة سفلية في العمود الواحد؟',
      answer: 4,
      ruleCategory: 'direct',
      steps: [],
      explanation:
        'في كل عمود أربع خرزات سفلية، كل واحدة قيمتها 1. إذاً الأربعة أطفال مجموعهم 4.',
      story:
        'عدّ الأطفال في الطابق السفلي: واحد، اثنان، ثلاثة، أربعة!',
      storyAudioText:
        'عد الأطفال في الطابق السفلي: واحد، اثنان، ثلاثة، أربعة!',
    },

    // 5) عدد الخرزات الكلي
    {
      problemText: 'كم خرزة كلياً في العمود الواحد؟',
      answer: 5,
      ruleCategory: 'direct',
      steps: [],
      explanation:
        'في العمود الواحد: 4 خرزات سفلية + 1 خرزة علوية = 5 خرزات. الجدة + الأربعة أطفال = 5 أفراد.',
      story:
        'عائلة السوروبان في كل عمود: الجدة + 4 أطفال = 5 أفراد!',
      storyAudioText:
        'عائلة السوروبان في كل عمود: الجدة زائد أربعة أطفال يساوي خمسة أفراد.',
    },

    // 6) الجدة + كل الأطفال
    {
      problemText: 'الجدة + كل الأطفال الأربعة = كم؟',
      answer: 9,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'أنزل الجدة (5)',
          fingerUsed: 'index',
          direction: 'down',
          targetColumn: 'units',
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
        {
          stepIndex: 2,
          instructionText: 'ارفع الأربعة أطفال (4)',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1, 2, 3, 4],
          expectedValueAfter: 9,
        },
      ],
      explanation: '5 + 4 = 9 (الجدة + كل الأطفال)',
      story:
        'صفّقت الجدة بيديها، فصعد الأطفال الأربعة كلهم للمشاركة. صار المجموع: 5 + 4 = 9',
      storyAudioText:
        'صفقت الجدة بيديها، فصعد الأطفال الأربعة كلهم للمشاركة. صار المجموع خمسة زائد أربعة يساوي تسعة.',
    },

    // 7) عدد الأعمدة
    {
      problemText: 'كم عموداً عادة في السوروبان؟',
      answer: 13,
      ruleCategory: 'direct',
      steps: [],
      explanation:
        'السوروبان التقليدي فيه 13 عموداً، لكن قد تجد أنواعاً بـ 11 أو 15 أو 27 عموداً.',
      story:
        'تخيل 13 برجاً في قلعة السوروبان، كل برج فيه عائلة كاملة (جدة + 4 أطفال)!',
      storyAudioText:
        'تخيل ثلاثة عشر برجاً في قلعة السوروبان، كل برج فيه عائلة كاملة: جدة وأربعة أطفال.',
    },

    // 8) عدد الأصابع المستخدمة
    {
      problemText: 'كم إصبعاً نستخدم لتحريك الخرزات؟',
      answer: 2,
      ruleCategory: 'direct',
      steps: [],
      explanation:
        'نستخدم إصبعين فقط: الإبهام (للرفع) والسبابة (للإنزال). الإبهام مسؤول عن الأطفال، والسبابة عن الجدة.',
      story:
        'قال الحارس: لا تحتاج كل أصابعك! فقط الإبهام والسبابة — هما المفتاح السحري.',
      storyAudioText:
        'قال الحارس: لا تحتاج كل أصابعك! فقط الإبهام والسبابة، هما المفتاح السحري.',
    },

    // 9) سؤال حسابي بسيط
    {
      problemText: '6 + 2 = كم؟',
      answer: 8,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'مثّل 6: الجدة + طفل',
          fingerUsed: 'both_pinch',
          direction: 'pinch_in',
          targetColumn: 'units',
          beadsAffected: [5, 1],
          expectedValueAfter: 6,
        },
        {
          stepIndex: 2,
          instructionText: 'أضف 2: ارفع طفلين',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [2, 3],
          expectedValueAfter: 8,
        },
      ],
      explanation: '6 + 2 = 8 (الجدة + طفل + طفلان)',
      story:
        'الجدة وطفل واحد في الساحة، فانضم طفلان آخران. المجموع: 6 + 2 = 8',
      storyAudioText:
        'الجدة وطفل واحد في الساحة، فانضم طفلان آخران. المجموع ستة زائد اثنين يساوي ثمانية.',
    },
  ],
};


// ═══════════════════════════════════════════════════════════
// مصفوفة الدروس
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// المستوى 2: تمثيل الأعداد على السوروبان
// ═══════════════════════════════════════════════════════════
const level2: LearnModule = {
  id: 2,
  title: 'Number Representation',
  titleAr: 'تمثيل الأعداد على السوروبان',
  description: 'Represent numbers from 0 to 9999',
  descriptionAr: 'مثّل الأعداد من 0 إلى 9999',
  status: 'locked',
  beads: { upper: 1, lower: 4 },
  value: 0,
  concept: 'Each column represents one digit',
  conceptAr: 'كل عمود يمثل منزلة رقمية',
  icon: 'Hash',
  audioText:
    'الآن سنتعلم كيف نمثّل الأعداد على السوروبان. كل عمود يمثل منزلة: الآحاد، العشرات، المئات، الآلاف. الخرزة التي تلمس الجسر هي التي لها قيمة! الباقي نائم لا قيمة له.',
  rule: 'Bead touching the bridge = active',
  ruleAr: 'الخرزة التي تلمس الجسر = مُفعّلة',
  story:
    'قال حارس القلعة: تذكّروا القاعدة الذهبية — الخرزة التي تلمس الجسر هي التي تُحسب! الباقي نائم لا قيمة له. الآن ستمثّلون الأعداد بأيديكم على المعداد، وستصبحون سادة الأرقام!',
  storyAudioText:
    'قال حارس القلعة: تذكروا القاعدة الذهبية — الخرزة التي تلمس الجسر هي التي تحسب. الباقي نائم لا قيمة له. الآن ستمثلون الأعداد بأيديكم على المعداد، وستصبحون سادة الأرقام.',
  targetAge: '6-8',
  requiresAllPrevious: true,

  interactionMode: 'abacus-representation',
  maxAttempts: 10,

  tactileActivity: {
    titleAr: 'نشاط البيوت الثلاثة',
    materials: ['3 صناديق صغيرة', 'بطاقات أرقام 0-9', 'قلم'],
    steps: [
      'سمّ الصندوق الأول: الآحاد',
      'سمّ الصندوق الثاني: العشرات',
      'سمّ الصندوق الثالث: المئات',
      'ضع في كل صندوق عدداً من 0 إلى 9',
      'اسأل طفلك: ما الرقم الذي يمثله هذا الترتيب؟',
    ],
    goal: 'فهم مفهوم المنازل (آحاد، عشرات، مئات) قبل تطبيقه على المعداد',
  },

  examples: [
    // 1) الرقم 0
    {
      problemText: 'مثّل الرقم 0 على السوروبان',
      answer: 0,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'تأكد أن جميع الخرزات بعيدة عن الجسر',
          fingerUsed: 'index',
          direction: 'down',
          targetColumn: 'units',
          beadsAffected: [],
          expectedValueAfter: 0,
        },
      ],
      explanation: 'لا توجد خرزة تلمس الجسر = 0',
      story: 'الجميع نائم! لا أحد يلمس الجسر، فالرقم صفر.',
      storyAudioText: 'الجميع نائم! لا أحد يلمس الجسر، فالرقم صفر.',
    },

    // 2) الرقم 3
    {
      problemText: 'مثّل الرقم 3 على السوروبان',
      answer: 3,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'ارفع ثلاثة أطفال بالإبهام في عمود الآحاد',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1, 2, 3],
          expectedValueAfter: 3,
        },
      ],
      explanation: 'ثلاثة أطفال لمسوا الجسر = 3',
      story: 'استدعت الجدة ثلاثة أطفال، فرفعوا أصابعهم ولامسوا الجسر.',
      storyAudioText: 'استدعت الجدة ثلاثة أطفال، فرفعوا أصابعهم ولامسوا الجسر.',
    },

    // 3) الرقم 5
    {
      problemText: 'مثّل الرقم 5 على السوروبان',
      answer: 5,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'أنزل الجدة 5 بالسبابة في عمود الآحاد',
          fingerUsed: 'index',
          direction: 'down',
          targetColumn: 'units',
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
      ],
      explanation: 'الجدة وحدها لمست الجسر = 5',
      story: 'سمعت الجدة ضحكات الأطفال، فنزلت لتراهم. الجدة وحدها تساوي 5!',
      storyAudioText:
        'سمعت الجدة ضحكات الأطفال، فنزلت لتراهم. الجدة وحدها تساوي خمسة.',
    },

    // 4) الرقم 7
    {
      problemText: 'مثّل الرقم 7 على السوروبان',
      answer: 7,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'أنزل الجدة 5 بالسبابة في عمود الآحاد',
          fingerUsed: 'index',
          direction: 'down',
          targetColumn: 'units',
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
        {
          stepIndex: 2,
          instructionText: 'ارفع طفلين بالإبهام',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1, 2],
          expectedValueAfter: 7,
        },
      ],
      explanation: '5 + 2 = 7 (الجدة + طفلان)',
      story: 'نزلت الجدة، وانضم إليها طفلان. صار المجموع 5 + 2 = 7',
      storyAudioText:
        'نزلت الجدة، وانضم إليها طفلان. صار المجموع خمسة زائد اثنين يساوي سبعة.',
    },

    // 5) الرقم 9
    {
      problemText: 'مثّل الرقم 9 على السوروبان',
      answer: 9,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'أنزل الجدة 5 بالسبابة',
          fingerUsed: 'index',
          direction: 'down',
          targetColumn: 'units',
          beadsAffected: [5],
          expectedValueAfter: 5,
        },
        {
          stepIndex: 2,
          instructionText: 'ارفع الأربعة أطفال بالإبهام',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1, 2, 3, 4],
          expectedValueAfter: 9,
        },
      ],
      explanation: '5 + 4 = 9 (الجدة + كل الأطفال)',
      story:
        'صفّقت الجدة بيديها، فصعد الأطفال الأربعة كلهم. ممتلئ! 5 + 4 = 9',
      storyAudioText:
        'صفقت الجدة بيديها، فصعد الأطفال الأربعة كلهم. ممتلئ! خمسة زائد أربعة يساوي تسعة.',
    },

    // 6) الرقم 10
    {
      problemText: 'مثّل الرقم 10 على السوروبان',
      answer: 10,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'ارفع خرزة واحدة في عمود العشرات بالإبهام',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'tens',
          beadsAffected: [1],
          expectedValueAfter: 10,
        },
      ],
      explanation: '10 = 1 في العشرات و 0 في الآحاد',
      story:
        'عندما نصل إلى 10، ننتقل إلى بيت العشرات! خرزة واحدة هناك تساوي 10.',
      storyAudioText:
        'عندما نصل إلى عشرة، ننتقل إلى بيت العشرات. خرزة واحدة هناك تساوي عشرة.',
    },

    // 7) الرقم 25
    {
      problemText: 'مثّل الرقم 25 على السوروبان',
      answer: 25,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'في العشرات: ارفع طفلين بالإبهام',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'tens',
          beadsAffected: [1, 2],
          expectedValueAfter: 20,
        },
        {
          stepIndex: 2,
          instructionText: 'في الآحاد: أنزل الجدة 5 بالسبابة',
          fingerUsed: 'index',
          direction: 'down',
          targetColumn: 'units',
          beadsAffected: [5],
          expectedValueAfter: 25,
        },
      ],
      explanation: '20 + 5 = 25 (عشرتان + الجدة)',
      story:
        'عشرتان في بيت العشرات + الجدة في بيت الآحاد = 25',
      storyAudioText:
        'عشرتان في بيت العشرات زائد الجدة في بيت الآحاد يساوي خمسة وعشرين.',
    },

    // 8) الرقم 47
    {
      problemText: 'مثّل الرقم 47 على السوروبان',
      answer: 47,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'في العشرات: ارفع 4 أطفال (4 عشرات = 40)',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'tens',
          beadsAffected: [1, 2, 3, 4],
          expectedValueAfter: 40,
        },
        {
          stepIndex: 2,
          instructionText: 'في الآحاد: أنزل الجدة 5 + ارفع طفلين (7)',
          fingerUsed: 'both_pinch',
          direction: 'pinch_in',
          targetColumn: 'units',
          beadsAffected: [5, 1, 2],
          expectedValueAfter: 47,
        },
      ],
      explanation: '40 + 7 = 47',
      story: 'أربع عشرات + سبعة آحاد = 47',
      storyAudioText:
        'أربع عشرات زائد سبعة آحاد يساوي سبعة وأربعين.',
    },

    // 9) الرقم 100
    {
      problemText: 'مثّل الرقم 100 على السوروبان',
      answer: 100,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'ارفع خرزة واحدة في عمود المئات بالإبهام',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'hundreds',
          beadsAffected: [1],
          expectedValueAfter: 100,
        },
      ],
      explanation: 'مائة = خرزة واحدة في خانة المئات',
      story: 'عندما نصل إلى 100، ننتقل إلى بيت المئات! هذا بيت العائلة الكبيرة.',
      storyAudioText:
        'عندما نصل إلى مائة، ننتقل إلى بيت المئات. هذا بيت العائلة الكبيرة.',
    },

    // 10) الرقم 134
    {
      problemText: 'مثّل الرقم 134 على السوروبان',
      answer: 134,
      ruleCategory: 'direct',
      steps: [
        {
          stepIndex: 1,
          instructionText: 'في المئات: ارفع خرزة واحدة (100)',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'hundreds',
          beadsAffected: [1],
          expectedValueAfter: 100,
        },
        {
          stepIndex: 2,
          instructionText: 'في العشرات: ارفع 3 أطفال (30)',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'tens',
          beadsAffected: [1, 2, 3],
          expectedValueAfter: 130,
        },
        {
          stepIndex: 3,
          instructionText: 'في الآحاد: ارفع 4 أطفال (4)',
          fingerUsed: 'thumb',
          direction: 'up',
          targetColumn: 'units',
          beadsAffected: [1, 2, 3, 4],
          expectedValueAfter: 134,
        },
      ],
      explanation: '100 + 30 + 4 = 134',
      story:
        'مائة + ثلاثون + أربعة = 134. كل منزلة تجلس في بيتها!',
      storyAudioText:
        'مائة زائد ثلاثون زائد أربعة يساوي مائة وأربعة وثلاثين. كل منزلة تجلس في بيتها.',
    },
  ],
};
// ═══════════════════════════════════════════════════════════
// المستوى 3: العمليات المباشرة
// ═══════════════════════════════════════════════════════════
const level3: LearnModule = {
  id: 3,
  title: 'Direct Operations',
  titleAr: 'العمليات المباشرة',
  description: 'Add and subtract without rules — from left to right',
  descriptionAr: 'اجمع واطرح بلا قواعد — من اليسار إلى اليمين',
  status: 'locked',
  beads: { upper: 1, lower: 4 },
  value: 0,
  concept: 'No rules needed — just move beads directly',
  conceptAr: 'بلا قواعد — فقط حرّك الخرزات مباشرة',
  icon: 'Plus',
  audioText:
    'الآن نتعلم العمليات المباشرة! لا نحتاج أي قاعدة. القاعدة الذهبية: من اليسار إلى اليمين! نبدأ من العشرات قبل الآحاد، ومن المئات قبل العشرات.',
  rule: 'Add = thumb up, Subtract = index down, order = LEFT → RIGHT',
  ruleAr: 'الجمع = رفع بالإبهام، الطرح = إنزال بالسبابة، الترتيب = من اليسار إلى اليمين',
  story:
    'قال حارس القلعة: تذكّروا القاعدة الذهبية — عندما تتعاملون مع أعداد كبيرة، ابدؤوا من البيوت الكبيرة قبل الصغيرة. هذا سرّ السرعة في السوروبان!',
  storyAudioText:
    'قال حارس القلعة: تذكروا القاعدة الذهبية — عندما تتعاملون مع أعداد كبيرة، ابدؤوا من البيوت الكبيرة قبل الصغيرة. هذا سر السرعة في السوروبان.',
  targetAge: '7-9',
  requiresAllPrevious: true,
  interactionMode: 'abacus-representation',
  maxAttempts: 10,
  examples: [
    {
      problemText: '1 + 2 = ؟',
      answer: 3,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'ارفع خرزة واحدة (1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 1 },
        { stepIndex: 2, instructionText: 'ارفع خرزتين إضافيتين (2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [2, 3], expectedValueAfter: 3 },
      ],
      explanation: '1 + 2 = 3 (لا نحتاج قاعدة)',
      story: 'طفل واحد، ثم انضم طفلان. صاروا ثلاثة!',
      storyAudioText: 'طفل واحد، ثم انضم طفلان. صاروا ثلاثة.',
    },
    {
      problemText: '5 + 3 = ؟',
      answer: 8,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'أنزل الجدة 5 بالسبابة', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
        { stepIndex: 2, instructionText: 'ارفع 3 أطفال بالإبهام', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 8 },
      ],
      explanation: '5 + 3 = 8 (الجدة + 3 أطفال)',
      story: 'نزلت الجدة، وانضم إليها ثلاثة أطفال: 5 + 3 = 8',
      storyAudioText: 'نزلت الجدة، وانضم إليها ثلاثة أطفال: خمسة زائد ثلاثة يساوي ثمانية.',
    },
    {
      problemText: '9 - 5 = ؟',
      answer: 4,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9: الجدة + 4 أطفال', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: 'ارفع الجدة 5 بالسبابة (طرح 5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 4 },
      ],
      explanation: '9 - 5 = 4',
      story: 'صعدت الجدة لتستريح، فبقي أربعة أطفال فقط.',
      storyAudioText: 'صعدت الجدة لتستريح، فبقي أربعة أطفال فقط.',
    },
    {
      problemText: '8 - 3 = ؟',
      answer: 5,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8: الجدة + 3 أطفال', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: 'أنزل 3 أطفال بالسبابة (طرح 3)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 5 },
      ],
      explanation: '8 - 3 = 5 (الجدة تبقى وحدها)',
      story: 'ثلاثة أطفال ذهبوا للنوم، فبقيت الجدة وحدها: 5',
      storyAudioText: 'ثلاثة أطفال ذهبوا للنوم، فبقيت الجدة وحدها: خمسة.',
    },
    {
      problemText: '12 + 21 = ؟',
      answer: 33,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 12: عشرات (1) ثم آحاد (2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 10 },
        { stepIndex: 2, instructionText: 'ثم آحاد (2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 12 },
        { stepIndex: 3, instructionText: 'أضف 21: أولاً عشرات (2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'tens', beadsAffected: [2, 3], expectedValueAfter: 32 },
        { stepIndex: 4, instructionText: 'ثم آحاد (1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [3], expectedValueAfter: 33 },
      ],
      explanation: '12 + 21 = 33 (من اليسار: عشرات ثم آحاد)',
      story: 'البيوت الكبيرة أولاً! العشرات قبل الآحاد. النتيجة: 33',
      storyAudioText: 'البيوت الكبيرة أولاً! العشرات قبل الآحاد. النتيجة: ثلاثة وثلاثون.',
    },
    {
      problemText: '47 - 25 = ؟',
      answer: 22,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 47: عشرات (4) وآحاد (7)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'tens', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 40 },
        { stepIndex: 2, instructionText: 'آحاد: الجدة + 2', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2], expectedValueAfter: 47 },
        { stepIndex: 3, instructionText: 'اطرح 25: أولاً عشرات (2)', fingerUsed: 'index', direction: 'down', targetColumn: 'tens', beadsAffected: [3, 4], expectedValueAfter: 27 },
        { stepIndex: 4, instructionText: 'ثم آحاد (5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 22 },
      ],
      explanation: '47 - 25 = 22 (من اليسار)',
      story: 'نطرح العشرات أولاً، ثم الآحاد. النتيجة: 22',
      storyAudioText: 'نطرح العشرات أولاً، ثم الآحاد. النتيجة: اثنان وعشرون.',
    },
    {
      problemText: '123 + 101 = ؟',
      answer: 224,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 123: مئات (1)، عشرات (2)، آحاد (3)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'hundreds', beadsAffected: [1], expectedValueAfter: 100 },
        { stepIndex: 2, instructionText: 'عشرات (2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'tens', beadsAffected: [1, 2], expectedValueAfter: 120 },
        { stepIndex: 3, instructionText: 'آحاد (3)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 123 },
        { stepIndex: 4, instructionText: 'أضف 101: مئات (1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'hundreds', beadsAffected: [2], expectedValueAfter: 223 },
        { stepIndex: 5, instructionText: 'آحاد (1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [4], expectedValueAfter: 224 },
      ],
      explanation: '123 + 101 = 224 (من اليسار)',
      story: 'كل عائلة تجلس في مكانها: المئات أولاً، ثم العشرات، ثم الآحاد.',
      storyAudioText: 'كل عائلة تجلس في مكانها: المئات أولاً، ثم العشرات، ثم الآحاد.',
    },
    {
      problemText: '3333 - 1111 = ؟',
      answer: 2222,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 3333 في 4 خانات', fingerUsed: 'thumb', direction: 'up', targetColumn: 'thousands', beadsAffected: [1, 2, 3], expectedValueAfter: 3000 },
        { stepIndex: 2, instructionText: 'أضف 333', fingerUsed: 'thumb', direction: 'up', targetColumn: 'hundreds', beadsAffected: [1, 2, 3], expectedValueAfter: 3333 },
        { stepIndex: 3, instructionText: 'اطرح 1111: آلاف (1)', fingerUsed: 'index', direction: 'down', targetColumn: 'thousands', beadsAffected: [3], expectedValueAfter: 2333 },
        { stepIndex: 4, instructionText: 'مئات (1)', fingerUsed: 'index', direction: 'down', targetColumn: 'hundreds', beadsAffected: [3], expectedValueAfter: 2233 },
        { stepIndex: 5, instructionText: 'عشرات (1)', fingerUsed: 'index', direction: 'down', targetColumn: 'tens', beadsAffected: [3], expectedValueAfter: 2133 },
        { stepIndex: 6, instructionText: 'آحاد (1)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [3], expectedValueAfter: 2133 },
      ],
      explanation: '3333 - 1111 = 2222 (من اليسار)',
      story: 'الطرح من اليسار يعطينا سرعة خارقة!',
      storyAudioText: 'الطرح من اليسار يعطينا سرعة خارقة.',
    },
    {
      problemText: '2 + 2 + 5 - 1 = ؟',
      answer: 8,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'ارفع 2', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 2 },
        { stepIndex: 2, instructionText: 'أضف 2', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [3, 4], expectedValueAfter: 4 },
        { stepIndex: 3, instructionText: 'أنزل الجدة (+5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 9 },
        { stepIndex: 4, instructionText: 'أنزل طفلاً واحداً (-1)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 8 },
      ],
      explanation: '2 + 2 + 5 - 1 = 8',
      story: 'كل العمليات مباشرة! لا نحتاج أي قاعدة.',
      storyAudioText: 'كل العمليات مباشرة! لا نحتاج أي قاعدة.',
    },
    {
      problemText: '123 + 55 - 30 = ؟',
      answer: 148,
      ruleCategory: 'direct',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 123', fingerUsed: 'thumb', direction: 'up', targetColumn: 'hundreds', beadsAffected: [1], expectedValueAfter: 100 },
        { stepIndex: 2, instructionText: 'عشرات (2) وآحاد (3)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'tens', beadsAffected: [1, 2], expectedValueAfter: 123 },
        { stepIndex: 3, instructionText: 'أضف 55 (5 عشرات + 5 آحاد)', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [5, 1], expectedValueAfter: 178 },
        { stepIndex: 4, instructionText: 'اطرح 30 (3 عشرات)', fingerUsed: 'index', direction: 'down', targetColumn: 'tens', beadsAffected: [1, 2, 3], expectedValueAfter: 148 },
      ],
      explanation: '123 + 55 - 30 = 148',
      story: 'سلسلة بأرقام كبيرة — من اليسار دائماً!',
      storyAudioText: 'سلسلة بأرقام كبيرة — من اليسار دائماً.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// المستوى 4: متممات الخمسة — جمع
// ═══════════════════════════════════════════════════════════
const level4: LearnModule = {
  id: 4,
  title: 'Small Friends — Addition',
  titleAr: 'متممات الخمسة — جمع',
  description: 'Use Grandma 5 when lower beads are full',
  descriptionAr: 'استعن بالجدة 5 عندما تمتلئ خرزات الأسفل',
  status: 'locked',
  beads: { upper: 1, lower: 4 },
  value: 5,
  concept: 'Add N = +5 - (5-N)',
  conceptAr: 'لجمع N: أنزل الجدة 5 واطرح متممها',
  icon: 'Combine',
  audioText:
    'وصلنا إلى غرفة الجدة 5! عندما نريد جمع رقم ولا نجد مكاناً في الأسفل، نستدعي الجدة 5 للنزول، لكنها تشترط خروج صديق الرقم. صديق 1 هو 4، وصديق 2 هو 3، وصديق 3 هو 2، وصديق 4 هو 1.',
  rule: '+N = +5 - (5-N)',
  ruleAr: 'لجمع N: أنزل الجدة 5، ثم اطرح متممها (5-N)',
  ruleTable: [
    { formula: '+1', result: '+5 - 4' },
    { formula: '+2', result: '+5 - 3' },
    { formula: '+3', result: '+5 - 2' },
    { formula: '+4', result: '+5 - 1' },
  ],
  story:
    'وصل الأبطال إلى غرفة الجدة 5. أرادوا إضافة طفل واحد، لكن الساحة ممتلئة! ظهرت الجدة 5 وقالت: لا تقلقوا، أنا أستطيع المساعدة، لكن لي شرط: إذا دخلت أنا (+5)، يجب أن يخرج صديق الرقم الذي تريدونه.',
  storyAudioText:
    'وصل الأبطال إلى غرفة الجدة خمسة. أرادوا إضافة طفل واحد، لكن الساحة ممتلئة. ظهرت الجدة خمسة وقالت: لا تقلقوا، أنا أستطيع المساعدة، لكن لي شرط: إذا دخلت أنا، يجب أن يخرج صديق الرقم الذي تريدونه.',
  targetAge: '7-9',
  requiresAllPrevious: true,
  interactionMode: 'abacus-representation',
  maxAttempts: 10,
  tactileActivity: {
    titleAr: 'نشاط علبة الجدة 5',
    materials: ['علبة صغيرة', '5 أزرار', 'بطاقة الجدة 5'],
    steps: [
      'ضع 4 أزرار في العلبة (تمثل 4)',
      'أضف زراً واحداً (تريد الوصول إلى 5)',
      'العلبة ممتلئة! استعن ببطاقة الجدة 5',
      'الجدة تشترط: ضع زراً واحداً + ارفع 4 أزرار',
    ],
    goal: 'فهم أن +1 = +5 - 4 بملموسية',
  },
  examples: [
    {
      problemText: '4 + 1 = ؟',
      answer: 5,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 4: ارفع 4 أطفال', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 4 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5 بالسبابة', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 9 },
        { stepIndex: 3, instructionText: 'أنزل 4 أطفال (متمم 1 = 4)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 5 },
      ],
      explanation: '4 + 1 = 5 (القاعدة: +1 = +5 - 4)',
      story: 'أربعة أطفال في الساحة، أراد واحد الانضمام. الساحة ممتلئة! نزلت الجدة 5، وخرج صديق 1 وهو 4 أطفال. النتيجة: 5',
      storyAudioText: 'أربعة أطفال في الساحة، أراد واحد الانضمام. الساحة ممتلئة. نزلت الجدة خمسة، وخرج صديق الواحد وهو أربعة أطفال. النتيجة خمسة.',
    },
    {
      problemText: '3 + 2 = ؟',
      answer: 5,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 3', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 3 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 8 },
        { stepIndex: 3, instructionText: 'أنزل 3 أطفال (متمم 2 = 3)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 5 },
      ],
      explanation: '3 + 2 = 5 (القاعدة: +2 = +5 - 3)',
      story: 'ثلاثة أطفال يريدون 2 أصدقاء. نزلت الجدة 5، وخرج صديق 2 وهو 3. النتيجة: 5',
      storyAudioText: 'ثلاثة أطفال يريدون صديقين. نزلت الجدة خمسة، وخرج صديق الاثنين وهو ثلاثة. النتيجة خمسة.',
    },
    {
      problemText: '2 + 3 = ؟',
      answer: 5,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 2', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 2 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 7 },
        { stepIndex: 3, instructionText: 'أنزل طفلين (متمم 3 = 2)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 5 },
      ],
      explanation: '2 + 3 = 5 (القاعدة: +3 = +5 - 2)',
      story: 'طفلان يريدان 3 أصدقاء. نزلت الجدة 5، وخرج صديق 3 وهو 2. النتيجة: 5',
      storyAudioText: 'طفلان يريدان ثلاثة أصدقاء. نزلت الجدة خمسة، وخرج صديق الثلاثة وهو اثنان. النتيجة خمسة.',
    },
    {
      problemText: '1 + 4 = ؟',
      answer: 5,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 1', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 1 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 6 },
        { stepIndex: 3, instructionText: 'أنزل طفلاً واحداً (متمم 4 = 1)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 5 },
      ],
      explanation: '1 + 4 = 5 (القاعدة: +4 = +5 - 1)',
      story: 'طفل واحد يريد 4 أصدقاء. نزلت الجدة 5، وخرج صديق 4 وهو 1. النتيجة: 5',
      storyAudioText: 'طفل واحد يريد أربعة أصدقاء. نزلت الجدة خمسة، وخرج صديق الأربعة وهو واحد. النتيجة خمسة.',
    },
    {
      problemText: '4 + 2 = ؟',
      answer: 6,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 4', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 4 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 9 },
        { stepIndex: 3, instructionText: 'أنزل 3 أطفال (متمم 2 = 3)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 6 },
      ],
      explanation: '4 + 2 = 6 (القاعدة: +2 = +5 - 3)',
      story: 'أربعة أطفال يريدون 2 أصدقاء. نزلت الجدة 5، وخرج 3 أطفال. النتيجة: 6',
      storyAudioText: 'أربعة أطفال يريدون صديقين. نزلت الجدة خمسة، وخرج ثلاثة أطفال. النتيجة ستة.',
    },
    {
      problemText: '3 + 3 = ؟',
      answer: 6,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 3', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 3 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 8 },
        { stepIndex: 3, instructionText: 'أنزل طفلين (متمم 3 = 2)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 6 },
      ],
      explanation: '3 + 3 = 6 (القاعدة: +3 = +5 - 2)',
      story: 'ثلاثة أطفال يريدون 3 أصدقاء. نزلت الجدة 5، وخرج صديق 3 وهو 2. النتيجة: 6',
      storyAudioText: 'ثلاثة أطفال يريدون ثلاثة أصدقاء. نزلت الجدة خمسة، وخرج صديق الثلاثة وهو اثنان. النتيجة ستة.',
    },
    {
      problemText: '4 + 3 = ؟',
      answer: 7,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 4', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 4 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 9 },
        { stepIndex: 3, instructionText: 'أنزل طفلين (متمم 3 = 2)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 7 },
      ],
      explanation: '4 + 3 = 7 (القاعدة: +3 = +5 - 2)',
      story: 'أربعة أطفال يريدون 3 أصدقاء. نزلت الجدة 5، وخرج صديق 3 وهو 2. النتيجة: 7',
      storyAudioText: 'أربعة أطفال يريدون ثلاثة أصدقاء. نزلت الجدة خمسة، وخرج صديق الثلاثة وهو اثنان. النتيجة سبعة.',
    },
    {
      problemText: '2 + 4 = ؟',
      answer: 6,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 2', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 2 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 7 },
        { stepIndex: 3, instructionText: 'أنزل طفلاً واحداً (متمم 4 = 1)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 6 },
      ],
      explanation: '2 + 4 = 6 (القاعدة: +4 = +5 - 1)',
      story: 'طفلان يريدان 4 أصدقاء. نزلت الجدة 5، وخرج صديق 4 وهو 1. النتيجة: 6',
      storyAudioText: 'طفلان يريدان أربعة أصدقاء. نزلت الجدة خمسة، وخرج صديق الأربعة وهو واحد. النتيجة ستة.',
    },
    {
      problemText: '3 + 4 = ؟',
      answer: 7,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 3', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 3 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 8 },
        { stepIndex: 3, instructionText: 'أنزل طفلاً واحداً (متمم 4 = 1)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 7 },
      ],
      explanation: '3 + 4 = 7 (القاعدة: +4 = +5 - 1)',
      story: 'ثلاثة أطفال يريدون 4 أصدقاء. نزلت الجدة 5، وخرج صديق 4 وهو 1. النتيجة: 7',
      storyAudioText: 'ثلاثة أطفال يريدون أربعة أصدقاء. نزلت الجدة خمسة، وخرج صديق الأربعة وهو واحد. النتيجة سبعة.',
    },
    {
      problemText: '4 + 4 = ؟',
      answer: 8,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 4', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 4 },
        { stepIndex: 2, instructionText: 'أنزل الجدة 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 9 },
        { stepIndex: 3, instructionText: 'أنزل طفلاً واحداً (متمم 4 = 1)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 8 },
      ],
      explanation: '4 + 4 = 8 (القاعدة: +4 = +5 - 1)',
      story: 'أربعة أطفال يريدون 4 أصدقاء. نزلت الجدة 5، وخرج صديق 4 وهو 1. النتيجة: 8',
      storyAudioText: 'أربعة أطفال يريدون أربعة أصدقاء. نزلت الجدة خمسة، وخرج صديق الأربعة وهو واحد. النتيجة ثمانية.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// المستوى 5: متممات الخمسة — طرح
// ═══════════════════════════════════════════════════════════
const level5: LearnModule = {
  id: 5,
  title: 'Small Friends — Subtraction',
  titleAr: 'متممات الخمسة — طرح',
  description: 'Subtract using Grandma 5 when no lower bead',
  descriptionAr: 'اطرح باستخدام الجدة 5 عند نقص الآحاد',
  status: 'locked',
  beads: { upper: 1, lower: 4 },
  value: 5,
  concept: 'Subtract N = -5 + (5-N)',
  conceptAr: 'لطرح N: ارفع الجدة 5 ثم أضف متممها',
  icon: 'Minus',
  audioText:
    'الآن نتعلم الطرح بمتممات الخمسة! عندما نريد طرح رقم ولا توجد خرزة سفلية، تصعد الجدة 5 وتستريح، لكنها تترك مكانها لأصدقاء الرقم.',
  rule: '-N = -5 + (5-N)',
  ruleAr: 'لطرح N: ارفع الجدة 5، ثم أضف متممها (5-N)',
  ruleTable: [
    { formula: '-1', result: '-5 + 4' },
    { formula: '-2', result: '-5 + 3' },
    { formula: '-3', result: '-5 + 2' },
    { formula: '-4', result: '-5 + 1' },
  ],
  story:
    'قالت الجدة 5: أنا أستطيع الطرح أيضاً! عندما تريدون طرح رقم، أصعد أنا لتستريح (-5)، لكن أترك أصدقائي الأطفال يلعبون في الساحة (+ متمم الرقم).',
  storyAudioText:
    'قالت الجدة خمسة: أنا أستطيع الطرح أيضاً. عندما تريدون طرح رقم، أصعد أنا لتستريح، لكن أترك أصدقائي الأطفال يلعبون في الساحة.',
  targetAge: '7-9',
  requiresAllPrevious: true,
  interactionMode: 'abacus-representation',
  maxAttempts: 10,
  examples: [
    {
      problemText: '5 - 1 = ؟',
      answer: 4,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 5: أنزل الجدة', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
        { stepIndex: 2, instructionText: 'ارفع الجدة 5 (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 0 },
        { stepIndex: 3, instructionText: 'ارفع 4 أطفال (+4 = متمم 1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 4 },
      ],
      explanation: '5 - 1 = 4 (القاعدة: -1 = -5 + 4)',
      story: 'الجدة 5 وحدها. أرادت طرح 1. صعدت الجدة، ونزل 4 أطفال. النتيجة: 4',
      storyAudioText: 'الجدة خمسة وحدها. أرادت طرح واحد. صعدت الجدة، ونزل أربعة أطفال. النتيجة أربعة.',
    },
    {
      problemText: '5 - 2 = ؟',
      answer: 3,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
        { stepIndex: 2, instructionText: 'ارفع الجدة (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 0 },
        { stepIndex: 3, instructionText: 'ارفع 3 أطفال (متمم 2 = 3)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 3 },
      ],
      explanation: '5 - 2 = 3 (القاعدة: -2 = -5 + 3)',
      story: 'صعدت الجدة 5، ونزل 3 أطفال. النتيجة: 3',
      storyAudioText: 'صعدت الجدة خمسة، ونزل ثلاثة أطفال. النتيجة ثلاثة.',
    },
    {
      problemText: '5 - 3 = ؟',
      answer: 2,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
        { stepIndex: 2, instructionText: 'ارفع الجدة (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 0 },
        { stepIndex: 3, instructionText: 'ارفع طفلين (متمم 3 = 2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 2 },
      ],
      explanation: '5 - 3 = 2 (القاعدة: -3 = -5 + 2)',
      story: 'صعدت الجدة 5، ونزل طفلان. النتيجة: 2',
      storyAudioText: 'صعدت الجدة خمسة، ونزل طفلان. النتيجة اثنان.',
    },
    {
      problemText: '5 - 4 = ؟',
      answer: 1,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
        { stepIndex: 2, instructionText: 'ارفع الجدة (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 0 },
        { stepIndex: 3, instructionText: 'ارفع طفلاً واحداً (متمم 4 = 1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 1 },
      ],
      explanation: '5 - 4 = 1 (القاعدة: -4 = -5 + 1)',
      story: 'صعدت الجدة 5، ونزل طفل واحد. النتيجة: 1',
      storyAudioText: 'صعدت الجدة خمسة، ونزل طفل واحد. النتيجة واحد.',
    },
    {
      problemText: '6 - 2 = ؟',
      answer: 4,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 6: الجدة + طفل', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1], expectedValueAfter: 6 },
        { stepIndex: 2, instructionText: 'ارفع الجدة (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 1 },
        { stepIndex: 3, instructionText: 'ارفع طفلين (متمم 2 = 3? لا، متمم 2 من 5 = 3)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [2, 3], expectedValueAfter: 4 },
      ],
      explanation: '6 - 2 = 4 (القاعدة: -2 = -5 + 3) — 5+1-5+3 = 4',
      story: 'الجدة + طفل. نريد طرح 2. صعدت الجدة، ودخل 3 أطفال. النتيجة: 4',
      storyAudioText: 'الجدة زائد طفل. نريد طرح اثنين. صعدت الجدة، ودخل ثلاثة أطفال. النتيجة أربعة.',
    },
    {
      problemText: '7 - 3 = ؟',
      answer: 4,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 7: الجدة + طفلان', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2], expectedValueAfter: 7 },
        { stepIndex: 2, instructionText: 'ارفع الجدة (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 2 },
        { stepIndex: 3, instructionText: 'ارفع طفلين (متمم 3 = 2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [3, 4], expectedValueAfter: 4 },
      ],
      explanation: '7 - 3 = 4 (القاعدة: -3 = -5 + 2)',
      story: 'الجدة + طفلان. نريد طرح 3. صعدت الجدة، ودخل طفلان. النتيجة: 4',
      storyAudioText: 'الجدة زائد طفلان. نريد طرح ثلاثة. صعدت الجدة، ودخل طفلان. النتيجة أربعة.',
    },
    {
      problemText: '8 - 4 = ؟',
      answer: 4,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8: الجدة + 3 أطفال', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: 'ارفع الجدة (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 3 },
        { stepIndex: 3, instructionText: 'ارفع طفلاً واحداً (متمم 4 = 1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [4], expectedValueAfter: 4 },
      ],
      explanation: '8 - 4 = 4 (القاعدة: -4 = -5 + 1)',
      story: 'الجدة + 3 أطفال. نريد طرح 4. صعدت الجدة، ودخل طفل واحد. النتيجة: 4',
      storyAudioText: 'الجدة زائد ثلاثة أطفال. نريد طرح أربعة. صعدت الجدة، ودخل طفل واحد. النتيجة أربعة.',
    },
    {
      problemText: '7 - 4 = ؟',
      answer: 3,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 7: الجدة + طفلان', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2], expectedValueAfter: 7 },
        { stepIndex: 2, instructionText: 'ارفع الجدة (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 2 },
        { stepIndex: 3, instructionText: 'ارفع طفلاً واحداً (متمم 4 = 1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [3], expectedValueAfter: 3 },
      ],
      explanation: '7 - 4 = 3 (القاعدة: -4 = -5 + 1)',
      story: 'الجدة + طفلان. نريد طرح 4. صعدت الجدة، ودخل طفل واحد. النتيجة: 3',
      storyAudioText: 'الجدة زائد طفلان. نريد طرح أربعة. صعدت الجدة، ودخل طفل واحد. النتيجة ثلاثة.',
    },
    {
      problemText: '6 - 4 = ؟',
      answer: 2,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 6: الجدة + طفل', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1], expectedValueAfter: 6 },
        { stepIndex: 2, instructionText: 'ارفع الجدة (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 1 },
        { stepIndex: 3, instructionText: 'ارفع طفلاً واحداً (متمم 4 = 1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [2], expectedValueAfter: 2 },
      ],
      explanation: '6 - 4 = 2 (القاعدة: -4 = -5 + 1)',
      story: 'الجدة + طفل. نريد طرح 4. صعدت الجدة، ودخل طفل واحد. النتيجة: 2',
      storyAudioText: 'الجدة زائد طفل. نريد طرح أربعة. صعدت الجدة، ودخل طفل واحد. النتيجة اثنان.',
    },
    {
      problemText: '8 - 3 = ؟',
      answer: 5,
      ruleCategory: 'small_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8: الجدة + 3 أطفال', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: 'ارفع الجدة (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 3 },
        { stepIndex: 3, instructionText: 'ارفع طفلين (متمم 3 = 2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [4, 5], expectedValueAfter: 5 },
      ],
      explanation: '8 - 3 = 5 (القاعدة: -3 = -5 + 2)',
      story: 'الجدة + 3 أطفال. نريد طرح 3. صعدت الجدة، ودخل طفلان. النتيجة: 5',
      storyAudioText: 'الجدة زائد ثلاثة أطفال. نريد طرح ثلاثة. صعدت الجدة، ودخل طفلان. النتيجة خمسة.',
    },
  ],
};
// ═══════════════════════════════════════════════════════════
// المستوى 6: مكملات العشرة — جمع (العملاق 10)
// ═══════════════════════════════════════════════════════════
const level6: LearnModule = {
  id: 6,
  title: 'Big Friends — Addition',
  titleAr: 'مكملات العشرة — جمع (العملاق 10)',
  description: 'Call the Giant 10 when units column is full',
  descriptionAr: 'استعن بالعملاق 10 عندما يمتلئ عمود الآحاد',
  status: 'locked',
  beads: { upper: 1, lower: 4 },
  value: 10,
  concept: 'Add N = +10 - (10-N)',
  conceptAr: 'لجمع N: أضف 10 ثم اطرح متممها',
  icon: 'Sigma',
  audioText:
    'وصلنا إلى عملاق العشرات 10! عندما تمتلئ الآحاد ولا نجد مكاناً، نستدعي العملاق 10 من عمود العشرات، لكنه يطرح متمم الرقم من الآحاد. متمم 9 هو 1، ومتمم 8 هو 2، وهكذا.',
  rule: '+N = +10 - (10-N)',
  ruleAr: 'لجمع N: أضف 10، ثم اطرح متممها (10-N)',
  ruleTable: [
    { formula: '+1', result: '+10 - 9' },
    { formula: '+2', result: '+10 - 8' },
    { formula: '+3', result: '+10 - 7' },
    { formula: '+4', result: '+10 - 6' },
    { formula: '+5', result: '+10 - 5' },
    { formula: '+6', result: '+10 - 4' },
    { formula: '+7', result: '+10 - 3' },
    { formula: '+8', result: '+10 - 2' },
    { formula: '+9', result: '+10 - 1' },
  ],
  story:
    'عندما كبرت الأرقام، لم تعد الجدة 5 تكفي! ظهر عملاق العشرات 10 في العمود الثاني على اليسار. قال: أنا أتدخل عندما يكتظ عمود الآحاد! نادوا عليّ (+10)، وسأطرح متمم الرقم من الآحاد.',
  storyAudioText:
    'عندما كبرت الأرقام، لم تعد الجدة خمسة تكفي. ظهر عملاق العشرات عشرة في العمود الثاني على اليسار. قال: أنا أتدخل عندما يكتظ عمود الآحاد. نادوا عليّ، وسأطرح متمم الرقم من الآحاد.',
  targetAge: '8-10',
  requiresAllPrevious: true,
  interactionMode: 'abacus-representation',
  maxAttempts: 10,
  examples: [
    // ✅ ترتيب متنوع في "جرّب"
    {
      problemText: '8 + 5 = ؟',
      answer: 13,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8: الجدة + 3 أطفال', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: 'ارفع خرزة عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 18 },
        { stepIndex: 3, instructionText: 'أنزل الجدة 5 (-5 = متمم 5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 13 },
      ],
      explanation: '8 + 5 = 13 (القاعدة: +5 = +10 - 5)',
      story: 'الآحاد شبه ممتلئة. يستدعي البطل العملاق 10، فيدخل، ويخرج متمم 5 وهو 5. النتيجة: 13',
      storyAudioText: 'الآحاد شبه ممتلئة. يستدعي البطل العملاق عشرة، فيدخل، ويخرج متمم خمسة وهو خمسة. النتيجة ثلاثة عشر.',
    },
    {
      problemText: '9 + 9 = ؟',
      answer: 18,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9: الجدة + 4 أطفال', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: 'ارفع خرزة عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 19 },
        { stepIndex: 3, instructionText: 'أنزل طفلاً واحداً (-1 = متمم 9)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 18 },
      ],
      explanation: '9 + 9 = 18 (القاعدة: +9 = +10 - 1)',
      story: '9 + 9. العملاق يدخل، ويخرج 1. النتيجة: 18',
      storyAudioText: 'تسعة زائد تسعة. العملاق يدخل، ويخرج واحد. النتيجة ثمانية عشر.',
    },
    {
      problemText: '9 + 1 = ؟',
      answer: 10,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: 'ارفع خرزة عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 19 },
        { stepIndex: 3, instructionText: 'أنزل 9 (-9 = متمم 1)', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 10 },
      ],
      explanation: '9 + 1 = 10 (القاعدة: +1 = +10 - 9)',
      story: 'الآحاد ممتلئة (9). العملاق يدخل، ويخرج 9. النتيجة: 10',
      storyAudioText: 'الآحاد ممتلئة. العملاق يدخل، ويخرج تسعة. النتيجة عشرة.',
    },
    {
      problemText: '8 + 8 = ؟',
      answer: 16,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: 'ارفع خرزة عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 18 },
        { stepIndex: 3, instructionText: 'أنزل طفلين (-2 = متمم 8)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 16 },
      ],
      explanation: '8 + 8 = 16 (القاعدة: +8 = +10 - 2)',
      story: '8 + 8. العملاق يدخل، ويخرج 2. النتيجة: 16',
      storyAudioText: 'ثمانية زائد ثمانية. العملاق يدخل، ويخرج اثنان. النتيجة ستة عشر.',
    },
    {
      problemText: '9 + 5 = ؟',
      answer: 14,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 19 },
        { stepIndex: 3, instructionText: 'أنزل الجدة 5 (-5 = متمم 5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 14 },
      ],
      explanation: '9 + 5 = 14 (القاعدة: +5 = +10 - 5)',
      story: 'العملاق يدخل، ويخرج 5. النتيجة: 14',
      storyAudioText: 'العملاق يدخل، ويخرج خمسة. النتيجة أربعة عشر.',
    },
    {
      problemText: '9 + 3 = ؟',
      answer: 12,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 19 },
        { stepIndex: 3, instructionText: 'أنزل 7 (-7 = متمم 3)', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'units', beadsAffected: [5, 1, 2], expectedValueAfter: 12 },
      ],
      explanation: '9 + 3 = 12 (القاعدة: +3 = +10 - 7)',
      story: 'العملاق يدخل، ويخرج 7. النتيجة: 12',
      storyAudioText: 'العملاق يدخل، ويخرج سبعة. النتيجة اثنا عشر.',
    },
    {
      problemText: '9 + 7 = ؟',
      answer: 16,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 19 },
        { stepIndex: 3, instructionText: 'أنزل 3 (-3 = متمم 7)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 16 },
      ],
      explanation: '9 + 7 = 16 (القاعدة: +7 = +10 - 3)',
      story: 'العملاق يدخل، ويخرج 3. النتيجة: 16',
      storyAudioText: 'العملاق يدخل، ويخرج ثلاثة. النتيجة ستة عشر.',
    },
    {
      problemText: '8 + 3 = ؟',
      answer: 11,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 18 },
        { stepIndex: 3, instructionText: 'أنزل 7 (-7 = متمم 3)', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'units', beadsAffected: [5, 1, 2], expectedValueAfter: 11 },
      ],
      explanation: '8 + 3 = 11 (القاعدة: +3 = +10 - 7)',
      story: 'العملاق يدخل، ويخرج 7. النتيجة: 11',
      storyAudioText: 'العملاق يدخل، ويخرج سبعة. النتيجة أحد عشر.',
    },
    {
      problemText: '9 + 6 = ؟',
      answer: 15,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 19 },
        { stepIndex: 3, instructionText: 'أنزل 4 (-4 = متمم 6)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 15 },
      ],
      explanation: '9 + 6 = 15 (القاعدة: +6 = +10 - 4)',
      story: 'العملاق يدخل، ويخرج 4. النتيجة: 15',
      storyAudioText: 'العملاق يدخل، ويخرج أربعة. النتيجة خمسة عشر.',
    },
    {
      problemText: '8 + 9 = ؟',
      answer: 17,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 18 },
        { stepIndex: 3, instructionText: 'أنزل 1 (-1 = متمم 9)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 17 },
      ],
      explanation: '8 + 9 = 17 (القاعدة: +9 = +10 - 1)',
      story: 'العملاق يدخل، ويخرج 1. النتيجة: 17',
      storyAudioText: 'العملاق يدخل، ويخرج واحد. النتيجة سبعة عشر.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// المستوى 7: مكملات العشرة — طرح (العملاق 10)
// ═══════════════════════════════════════════════════════════
const level7: LearnModule = {
  id: 7,
  title: 'Big Friends — Subtraction',
  titleAr: 'مكملات العشرة — طرح (العملاق 10)',
  description: 'Subtract using Giant 10 when units column is empty',
  descriptionAr: 'اطرح باستخدام العملاق 10 عند نقص الآحاد',
  status: 'locked',
  beads: { upper: 1, lower: 4 },
  value: 10,
  concept: 'Subtract N = -10 + (10-N)',
  conceptAr: 'لطرح N: اطرح 10 ثم أضف متممها',
  icon: 'Sigma',
  audioText:
    'العملاق 10 يستطيع الطرح أيضاً! عندما لا تكفي الآحاد، يغادر العملاق (-10)، ويدخل متمم الرقم في الآحاد (+ متمم).',
  rule: '-N = -10 + (10-N)',
  ruleAr: 'لطرح N: اطرح 10، ثم أضف متممها (10-N)',
  ruleTable: [
    { formula: '-1', result: '-10 + 9' },
    { formula: '-2', result: '-10 + 8' },
    { formula: '-3', result: '-10 + 7' },
    { formula: '-4', result: '-10 + 6' },
    { formula: '-5', result: '-10 + 5' },
    { formula: '-6', result: '-10 + 4' },
    { formula: '-7', result: '-10 + 3' },
    { formula: '-8', result: '-10 + 2' },
    { formula: '-9', result: '-10 + 1' },
  ],
  story:
    'قال العملاق 10: أنا أستطيع الطرح! عندما لا تكفي الآحاد، أغادر أنا (-10)، ويدخل متمم الرقم للآحاد.',
  storyAudioText:
    'قال العملاق عشرة: أنا أستطيع الطرح. عندما لا تكفي الآحاد، أغادر أنا، ويدخل متمم الرقم للآحاد.',
  targetAge: '8-10',
  requiresAllPrevious: true,
  interactionMode: 'abacus-representation',
  maxAttempts: 10,
  examples: [
    // ✅ ترتيب متنوع في "جرّب"
    {
      problemText: '14 − 9 = ؟',
      answer: 5,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 14: عشرات (1) + 4 آحاد', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 14 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 4 },
        { stepIndex: 3, instructionText: 'ارفع 1 (+1 = متمم 9)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
      ],
      explanation: '14 − 9 = 5 (القاعدة: -9 = -10 + 1)',
      story: 'العملاق يغادر، ويدخل 1. النتيجة: 5',
      storyAudioText: 'العملاق يغادر، ويدخل واحد. النتيجة خمسة.',
    },
    {
      problemText: '11 − 9 = ؟',
      answer: 2,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 11', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 11 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 1 },
        { stepIndex: 3, instructionText: 'ارفع 1 (+1 = متمم 9)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [2], expectedValueAfter: 2 },
      ],
      explanation: '11 − 9 = 2 (القاعدة: -9 = -10 + 1)',
      story: 'العملاق يغادر، ويدخل 1. النتيجة: 2',
      storyAudioText: 'العملاق يغادر، ويدخل واحد. النتيجة اثنان.',
    },
    {
      problemText: '17 − 9 = ؟',
      answer: 8,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 17', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 17 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 7 },
        { stepIndex: 3, instructionText: 'ارفع 1 (+1 = متمم 9)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [3], expectedValueAfter: 8 },
      ],
      explanation: '17 − 9 = 8 (القاعدة: -9 = -10 + 1)',
      story: 'العملاق يغادر، ويدخل 1. النتيجة: 8',
      storyAudioText: 'العملاق يغادر، ويدخل واحد. النتيجة ثمانية.',
    },
    {
      problemText: '15 − 5 = ؟',
      answer: 10,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 15', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 15 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 5 },
        { stepIndex: 3, instructionText: 'أنزل الجدة 5 (+5 = متمم 5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 10 },
      ],
      explanation: '15 − 5 = 10 (القاعدة: -5 = -10 + 5)',
      story: 'العملاق يغادر، والجدة تدخل. النتيجة: 10',
      storyAudioText: 'العملاق يغادر، والجدة تدخل. النتيجة عشرة.',
    },
    {
      problemText: '13 − 9 = ؟',
      answer: 4,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 13', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 13 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 3 },
        { stepIndex: 3, instructionText: 'ارفع 1 (+1 = متمم 9)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [4], expectedValueAfter: 4 },
      ],
      explanation: '13 − 9 = 4 (القاعدة: -9 = -10 + 1)',
      story: 'العملاق يغادر، ويدخل 1. النتيجة: 4',
      storyAudioText: 'العملاق يغادر، ويدخل واحد. النتيجة أربعة.',
    },
    {
      problemText: '18 − 9 = ؟',
      answer: 9,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 18', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 18 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 8 },
        { stepIndex: 3, instructionText: 'ارفع 1 (+1 = متمم 9)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [4], expectedValueAfter: 9 },
      ],
      explanation: '18 − 9 = 9 (القاعدة: -9 = -10 + 1)',
      story: 'العملاق يغادر، ويدخل 1. النتيجة: 9',
      storyAudioText: 'العملاق يغادر، ويدخل واحد. النتيجة تسعة.',
    },
    {
      problemText: '12 − 9 = ؟',
      answer: 3,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 12', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 12 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 2 },
        { stepIndex: 3, instructionText: 'ارفع 1 (+1 = متمم 9)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [3], expectedValueAfter: 3 },
      ],
      explanation: '12 − 9 = 3 (القاعدة: -9 = -10 + 1)',
      story: 'العملاق يغادر، ويدخل 1. النتيجة: 3',
      storyAudioText: 'العملاق يغادر، ويدخل واحد. النتيجة ثلاثة.',
    },
    {
      problemText: '16 − 5 = ؟',
      answer: 11,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 16', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 16 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 6 },
        { stepIndex: 3, instructionText: 'أنزل الجدة 5 (+5 = متمم 5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 11 },
      ],
      explanation: '16 − 5 = 11 (القاعدة: -5 = -10 + 5)',
      story: 'العملاق يغادر، والجدة تدخل. النتيجة: 11',
      storyAudioText: 'العملاق يغادر، والجدة تدخل. النتيجة أحد عشر.',
    },
    {
      problemText: '15 − 9 = ؟',
      answer: 6,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 15', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 15 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 5 },
        { stepIndex: 3, instructionText: 'ارفع 1 (+1 = متمم 9)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 6 },
      ],
      explanation: '15 − 9 = 6 (القاعدة: -9 = -10 + 1)',
      story: 'العملاق يغادر، ويدخل 1. النتيجة: 6',
      storyAudioText: 'العملاق يغادر، ويدخل واحد. النتيجة ستة.',
    },
    {
      problemText: '16 − 9 = ؟',
      answer: 7,
      ruleCategory: 'big_friends',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 16', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 16 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 6 },
        { stepIndex: 3, instructionText: 'ارفع 1 (+1 = متمم 9)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [2], expectedValueAfter: 7 },
      ],
      explanation: '16 − 9 = 7 (القاعدة: -9 = -10 + 1)',
      story: 'العملاق يغادر، ويدخل 1. النتيجة: 7',
      storyAudioText: 'العملاق يغادر، ويدخل واحد. النتيجة سبعة.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// المستوى 8: الاندماج السحري (المركب)
// ═══════════════════════════════════════════════════════════
const level8: LearnModule = {
  id: 8,
  title: 'Magic Merge (Combined Operations)',
  titleAr: 'الاندماج السحري (العمليات المركبة)',
  description: 'Combine Grandma 5 and Giant 10 together',
  descriptionAr: 'اجمع الجدة 5 والعملاق 10 معاً',
  status: 'locked',
  beads: { upper: 1, lower: 4 },
  value: 10,
  concept: 'Add N (6-9) = +10 - 5 + (N-5)',
  conceptAr: 'لجمع 6-9: +10 - 5 + (N-5)',
  icon: 'Brain',
  audioText:
    'في المسائل الصعبة، نستدعي العملاق 10 والجدة 5 معاً! لجمع 6: نضيف 10، نطرح 5، ثم نضيف 1. عملية واحدة بثلاث حركات سحرية!',
  rule: 'Add N (6-9): +10 - 5 + (N-5)',
  ruleAr: 'لجمع N من 6 إلى 9: أضف 10، اطرح 5، أضف (N-5)',
  ruleTable: [
    { formula: '+6', result: '+10 - 5 + 1' },
    { formula: '+7', result: '+10 - 5 + 2' },
    { formula: '+8', result: '+10 - 5 + 3' },
    { formula: '+9', result: '+10 - 5 + 4' },
    { formula: '-6', result: '-10 + 5 - 1' },
    { formula: '-7', result: '-10 + 5 - 2' },
    { formula: '-8', result: '-10 + 5 - 3' },
    { formula: '-9', result: '-10 + 5 - 4' },
  ],
  story:
    'وصل الأبطال إلى العرش المزدوج حيث تلتقي الجدة 5 مع العملاق 10. في بعض المسائل الصعبة، يحتاج الطفل للاتصال بالعملاق 10 والجدة 5 في نفس اللحظة!',
  storyAudioText:
    'وصل الأبطال إلى العرش المزدوج حيث تلتقي الجدة خمسة مع العملاق عشرة. في بعض المسائل الصعبة، يحتاج الطفل للاتصال بالعملاق عشرة والجدة خمسة في نفس اللحظة.',
  targetAge: '9-11',
  requiresAllPrevious: true,
  interactionMode: 'abacus-representation',
  maxAttempts: 10,
  examples: [
    // ✅ ترتيب متنوع
    {
      problemText: '5 + 6 = ؟',
      answer: 11,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 5: أنزل الجدة', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 15 },
        { stepIndex: 3, instructionText: 'ارفع الجدة 5 (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 10 },
        { stepIndex: 4, instructionText: 'ارفع طفلاً واحداً (+1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 11 },
      ],
      explanation: '5 + 6 = 11 (القاعدة: +6 = +10 - 5 + 1)',
      story: 'الجدة في الساحة. العملاق يدخل (+10)، الجدة تصعد (-5)، طفل يدخل (+1). النتيجة: 11',
      storyAudioText: 'الجدة في الساحة. العملاق يدخل، الجدة تصعد، طفل يدخل. النتيجة أحد عشر.',
    },
    {
      problemText: '5 + 9 = ؟',
      answer: 14,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 15 },
        { stepIndex: 3, instructionText: 'ارفع الجدة 5 (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 10 },
        { stepIndex: 4, instructionText: 'ارفع 4 أطفال (+4)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 14 },
      ],
      explanation: '5 + 9 = 14 (القاعدة: +9 = +10 - 5 + 4)',
      story: 'العملاق يدخل، الجدة تصعد، 4 أطفال يدخلون. النتيجة: 14',
      storyAudioText: 'العملاق يدخل، الجدة تصعد، أربعة أطفال يدخلون. النتيجة أربعة عشر.',
    },
    {
      problemText: '16 − 6 = ؟',
      answer: 10,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 16: عشرات + 6', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 16 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 6 },
        { stepIndex: 3, instructionText: 'أنزل الجدة 5 (+5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 11 },
        { stepIndex: 4, instructionText: 'أنزل طفلاً واحداً (-1)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 10 },
      ],
      explanation: '16 − 6 = 10 (القاعدة: -6 = -10 + 5 - 1)',
      story: 'العملاق يغادر، الجدة تدخل، طفل يغادر. النتيجة: 10',
      storyAudioText: 'العملاق يغادر، الجدة تدخل، طفل يغادر. النتيجة عشرة.',
    },
    {
      problemText: '6 + 7 = ؟',
      answer: 13,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 6: الجدة + 1', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1], expectedValueAfter: 6 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 16 },
        { stepIndex: 3, instructionText: 'ارفع الجدة 5 (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 11 },
        { stepIndex: 4, instructionText: 'ارفع طفلين (+2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [2, 3], expectedValueAfter: 13 },
      ],
      explanation: '6 + 7 = 13 (القاعدة: +7 = +10 - 5 + 2)',
      story: 'العملاق يدخل، الجدة تصعد، طفلان يدخلان. النتيجة: 13',
      storyAudioText: 'العملاق يدخل، الجدة تصعد، طفلان يدخلان. النتيجة ثلاثة عشر.',
    },
    {
      problemText: '14 − 7 = ؟',
      answer: 7,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 14', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 14 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 4 },
        { stepIndex: 3, instructionText: 'أنزل الجدة 5 (+5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 9 },
        { stepIndex: 4, instructionText: 'أنزل طفلين (-2)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 7 },
      ],
      explanation: '14 − 7 = 7 (القاعدة: -7 = -10 + 5 - 2)',
      story: 'العملاق يغادر، الجدة تدخل، طفلان يغادران. النتيجة: 7',
      storyAudioText: 'العملاق يغادر، الجدة تدخل، طفلان يغادران. النتيجة سبعة.',
    },
    {
      problemText: '5 + 7 = ؟',
      answer: 12,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 5', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 15 },
        { stepIndex: 3, instructionText: 'ارفع الجدة 5 (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 10 },
        { stepIndex: 4, instructionText: 'ارفع طفلين (+2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 12 },
      ],
      explanation: '5 + 7 = 12 (القاعدة: +7 = +10 - 5 + 2)',
      story: 'العملاق يدخل، الجدة تصعد، طفلان يدخلان. النتيجة: 12',
      storyAudioText: 'العملاق يدخل، الجدة تصعد، طفلان يدخلان. النتيجة اثنا عشر.',
    },
    {
      problemText: '13 − 8 = ؟',
      answer: 5,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 13', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 13 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 3 },
        { stepIndex: 3, instructionText: 'أنزل الجدة 5 (+5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 8 },
        { stepIndex: 4, instructionText: 'أنزل 3 أطفال (-3)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 5 },
      ],
      explanation: '13 − 8 = 5 (القاعدة: -8 = -10 + 5 - 3)',
      story: 'العملاق يغادر، الجدة تدخل، 3 أطفال يغادرون. النتيجة: 5',
      storyAudioText: 'العملاق يغادر، الجدة تدخل، ثلاثة أطفال يغادرون. النتيجة خمسة.',
    },
    {
      problemText: '6 + 9 = ؟',
      answer: 15,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 6: الجدة + 1', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1], expectedValueAfter: 6 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 16 },
        { stepIndex: 3, instructionText: 'ارفع الجدة 5 (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 11 },
        { stepIndex: 4, instructionText: 'ارفع 4 أطفال (+4)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 15 },
      ],
      explanation: '6 + 9 = 15 (القاعدة: +9 = +10 - 5 + 4)',
      story: 'العملاق يدخل، الجدة تصعد، 4 أطفال يدخلون. النتيجة: 15',
      storyAudioText: 'العملاق يدخل، الجدة تصعد، أربعة أطفال يدخلون. النتيجة خمسة عشر.',
    },
    {
      problemText: '12 − 9 = ؟',
      answer: 3,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 12', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 12 },
        { stepIndex: 2, instructionText: 'أنزل عشرات (-10)', fingerUsed: 'left_index', direction: 'down', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 2 },
        { stepIndex: 3, instructionText: 'أنزل الجدة 5 (+5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 7 },
        { stepIndex: 4, instructionText: 'أنزل 4 أطفال (-4)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 3 },
      ],
      explanation: '12 − 9 = 3 (القاعدة: -9 = -10 + 5 - 4)',
      story: 'العملاق يغادر، الجدة تدخل، 4 أطفال يغادرون. النتيجة: 3',
      storyAudioText: 'العملاق يغادر، الجدة تدخل، أربعة أطفال يغادرون. النتيجة ثلاثة.',
    },
    {
      problemText: '7 + 9 = ؟',
      answer: 16,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 7: الجدة + طفلان', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2], expectedValueAfter: 7 },
        { stepIndex: 2, instructionText: 'ارفع عشرات (+10)', fingerUsed: 'left_index', direction: 'up', targetColumn: 'tens', beadsAffected: [1], expectedValueAfter: 17 },
        { stepIndex: 3, instructionText: 'ارفع الجدة 5 (-5)', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 12 },
        { stepIndex: 4, instructionText: 'ارفع 4 أطفال (+4)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 16 },
      ],
      explanation: '7 + 9 = 16 (القاعدة: +9 = +10 - 5 + 4)',
      story: 'العملاق يدخل، الجدة تصعد، 4 أطفال يدخلون. النتيجة: 16',
      storyAudioText: 'العملاق يدخل، الجدة تصعد، أربعة أطفال يدخلون. النتيجة ستة عشر.',
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// المستوى 9: تحدي السلاسل
// ═══════════════════════════════════════════════════════════
const level9: LearnModule = {
  id: 9,
  title: 'Chain Challenge',
  titleAr: 'تحدي السلاسل',
  description: 'Solve long chains of 4-10 operations',
  descriptionAr: 'حل سلاسل طويلة من 4 إلى 10 عمليات',
  status: 'locked',
  beads: { upper: 1, lower: 4 },
  value: 0,
  concept: 'Apply the correct rule at each step',
  conceptAr: 'طبّق القاعدة المناسبة في كل خطوة',
  icon: 'List',
  audioText:
    'الآن نواجه التحدي الأكبر! سلاسل من 4 إلى 10 عمليات متتالية. نطبّق كل ما تعلمناه: المباشر، الجدة 5، العملاق 10، والمركب. كل سطر نُطبّق قاعدته المناسبة!',
  rule: 'Apply the right rule for each step',
  ruleAr: 'طبّق القاعدة الصحيحة لكل خطوة',
  story:
    'وصل الأبطال إلى ساحة التحديات الكبرى. على لوح خشبي، صفّت الأرقام في سلاسل طويلة. قال كبير الفرسان: من يحل السلسلة كاملة يصبح فارساً!',
  storyAudioText:
    'وصل الأبطال إلى ساحة التحديات الكبرى. على لوح خشبي، صفت الأرقام في سلاسل طويلة. قال كبير الفرسان: من يحل السلسلة كاملة يصبح فارساً.',
  targetAge: '10-12',
  requiresAllPrevious: true,
  interactionMode: 'abacus-representation',
  maxAttempts: 10,
  examples: [
    {
      problemText: '5 − 4 + 7 + 8 = ؟',
      answer: 16,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 5: الجدة', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
        { stepIndex: 2, instructionText: 'اطرح 4: -5 + 1', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 1 },
        { stepIndex: 3, instructionText: 'ارفع 1 (+1 = متمم 4)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 1 },
        { stepIndex: 4, instructionText: 'أضف 7: -5 + 2 (الجدة تعود)', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2], expectedValueAfter: 8 },
        { stepIndex: 5, instructionText: 'أضف 8: +10 - 2', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 2], expectedValueAfter: 16 },
      ],
      explanation: '5 − 4 + 7 + 8 = 16',
      story: 'سلسلة من 4 عمليات. النتيجة: 16',
      storyAudioText: 'سلسلة من أربع عمليات. النتيجة ستة عشر.',
    },
    {
      problemText: '3 + 60 − 12 + 66 = ؟',
      answer: 117,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 3', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 3 },
        { stepIndex: 2, instructionText: 'أضف 60: 5 + 1 عشرات', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [5, 1], expectedValueAfter: 63 },
        { stepIndex: 3, instructionText: 'اطرح 12: 1 عشرات + 2 آحاد', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 1, 2], expectedValueAfter: 51 },
        { stepIndex: 4, instructionText: 'أضف 66: 6 عشرات + 6 آحاد', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 5, 1, 5, 1], expectedValueAfter: 117 },
      ],
      explanation: '3 + 60 − 12 + 66 = 117',
      story: 'سلسلة بأرقام كبيرة. النتيجة: 117',
      storyAudioText: 'سلسلة بأرقام كبيرة. النتيجة مائة وسبعة عشر.',
    },
    {
      problemText: '8 + 3 + 1 + 8 + 9 = ؟',
      answer: 29,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: '+3 مباشر', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [4], expectedValueAfter: 11 },
        { stepIndex: 3, instructionText: '+1 مباشر', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 12 },
        { stepIndex: 4, instructionText: '+8: +10 - 2', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 2], expectedValueAfter: 20 },
        { stepIndex: 5, instructionText: '+9: +10 - 1', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1], expectedValueAfter: 29 },
      ],
      explanation: '8 + 3 + 1 + 8 + 9 = 29',
      story: 'سلسلة من 5 عمليات. النتيجة: 29',
      storyAudioText: 'سلسلة من خمس عمليات. النتيجة تسعة وعشرون.',
    },
    {
      problemText: '9 + 6 − 5 + 9 − 8 = ؟',
      answer: 11,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: '+6: +10 - 4', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1, 2], expectedValueAfter: 15 },
        { stepIndex: 3, instructionText: '-5: ارفع الجدة', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 10 },
        { stepIndex: 4, instructionText: '+9: +10 - 1', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1], expectedValueAfter: 19 },
        { stepIndex: 5, instructionText: '-8: -10 + 2', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 11 },
      ],
      explanation: '9 + 6 − 5 + 9 − 8 = 11',
      story: 'سلسلة من 5 عمليات. النتيجة: 11',
      storyAudioText: 'سلسلة من خمس عمليات. النتيجة أحد عشر.',
    },
    {
      problemText: '7 − 3 + 2 + 5 − 8 = ؟',
      answer: 3,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 7', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2], expectedValueAfter: 7 },
        { stepIndex: 2, instructionText: '-3: -5 + 2', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 4 },
        { stepIndex: 3, instructionText: '+2 مباشر', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [2], expectedValueAfter: 6 },
        { stepIndex: 4, instructionText: '+5 مباشر (الجدة)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 11 },
        { stepIndex: 5, instructionText: '-8: -10 + 2', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 3 },
      ],
      explanation: '7 − 3 + 2 + 5 − 8 = 3',
      story: 'سلسلة من 5 عمليات. النتيجة: 3',
      storyAudioText: 'سلسلة من خمس عمليات. النتيجة ثلاثة.',
    },
    {
      problemText: '6 + 7 − 8 + 9 + 5 − 7 = ؟',
      answer: 12,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 6', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1], expectedValueAfter: 6 },
        { stepIndex: 2, instructionText: '+7: +10 - 3', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1, 2, 3], expectedValueAfter: 13 },
        { stepIndex: 3, instructionText: '-8: -10 + 2', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 5 },
        { stepIndex: 4, instructionText: '+9: +10 - 1', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1], expectedValueAfter: 14 },
        { stepIndex: 5, instructionText: '+5 مباشر', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 19 },
        { stepIndex: 6, instructionText: '-7: -10 + 3', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 1, 2, 3], expectedValueAfter: 12 },
      ],
      explanation: '6 + 7 − 8 + 9 + 5 − 7 = 12',
      story: 'سلسلة من 6 عمليات. النتيجة: 12',
      storyAudioText: 'سلسلة من ست عمليات. النتيجة اثنا عشر.',
    },
    {
      problemText: '8 + 9 + 6 − 4 − 8 + 7 − 5 = ؟',
      answer: 13,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: '+9: +10 - 1', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1], expectedValueAfter: 17 },
        { stepIndex: 3, instructionText: '+6: +10 - 4', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1, 2], expectedValueAfter: 23 },
        { stepIndex: 4, instructionText: '-4 مباشر', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [3], expectedValueAfter: 19 },
        { stepIndex: 5, instructionText: '-8: -10 + 2', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 11 },
        { stepIndex: 6, instructionText: '+7: +10 - 3', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1, 2, 3], expectedValueAfter: 18 },
        { stepIndex: 7, instructionText: '-5: -10 + 5', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 1], expectedValueAfter: 13 },
      ],
      explanation: '8 + 9 + 6 − 4 − 8 + 7 − 5 = 13',
      story: 'سلسلة من 7 عمليات. النتيجة: 13',
      storyAudioText: 'سلسلة من سبع عمليات. النتيجة ثلاثة عشر.',
    },
    {
      problemText: '9 − 3 + 8 − 4 + 6 − 7 + 5 = ؟',
      answer: 14,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: '-3: -5 + 2', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 6 },
        { stepIndex: 3, instructionText: '+8: +10 - 2', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 14 },
        { stepIndex: 4, instructionText: '-4 مباشر', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [3], expectedValueAfter: 10 },
        { stepIndex: 5, instructionText: '+6: +10 - 4', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 16 },
        { stepIndex: 6, instructionText: '-7: -10 + 3', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 1, 2, 3], expectedValueAfter: 9 },
        { stepIndex: 7, instructionText: '+5 مباشر', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 14 },
      ],
      explanation: '9 − 3 + 8 − 4 + 6 − 7 + 5 = 14',
      story: 'سلسلة من 7 عمليات. النتيجة: 14',
      storyAudioText: 'سلسلة من سبع عمليات. النتيجة أربعة عشر.',
    },
    {
      problemText: '9 + 6 − 5 + 9 − 8 − 8 + 6 + 1 + 8 − 3 = ؟',
      answer: 15,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 9', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3, 4], expectedValueAfter: 9 },
        { stepIndex: 2, instructionText: '+6: +10 - 4', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1, 2], expectedValueAfter: 15 },
        { stepIndex: 3, instructionText: '-5 مباشر', fingerUsed: 'index', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 10 },
        { stepIndex: 4, instructionText: '+9: +10 - 1', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1], expectedValueAfter: 19 },
        { stepIndex: 5, instructionText: '-8: -10 + 2', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 11 },
        { stepIndex: 6, instructionText: '-8: -10 + 2', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 3 },
        { stepIndex: 7, instructionText: '+6: +10 - 4', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 9 },
        { stepIndex: 8, instructionText: '+1 مباشر', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 10 },
        { stepIndex: 9, instructionText: '+8: +10 - 2', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 2], expectedValueAfter: 18 },
        { stepIndex: 10, instructionText: '-3 مباشر', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 15 },
      ],
      explanation: '9 + 6 − 5 + 9 − 8 − 8 + 6 + 1 + 8 − 3 = 15',
      story: 'السلسلة الأطول! 10 عمليات كاملة. النتيجة: 15',
      storyAudioText: 'السلسلة الأطول! عشر عمليات كاملة. النتيجة خمسة عشر.',
    },
    {
      problemText: '8 + 3 + 1 + 8 + 9 + 8 − 3 + 6 − 4 + 1 = ؟',
      answer: 37,
      ruleCategory: 'combined',
      steps: [
        { stepIndex: 1, instructionText: 'مثّل 8', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'units', beadsAffected: [5, 1, 2, 3], expectedValueAfter: 8 },
        { stepIndex: 2, instructionText: '+3 مباشر', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [4], expectedValueAfter: 11 },
        { stepIndex: 3, instructionText: '+1 مباشر', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 12 },
        { stepIndex: 4, instructionText: '+8: +10 - 2', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 2], expectedValueAfter: 20 },
        { stepIndex: 5, instructionText: '+9: +10 - 1', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 1], expectedValueAfter: 29 },
        { stepIndex: 6, instructionText: '+8: +10 - 2', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 2], expectedValueAfter: 37 },
        { stepIndex: 7, instructionText: '-3: -10 + 7', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 34 },
        { stepIndex: 8, instructionText: '+6: +10 - 4', fingerUsed: 'both_pinch', direction: 'pinch_in', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 40 },
        { stepIndex: 9, instructionText: '-4: -10 + 6', fingerUsed: 'both_pinch', direction: 'pinch_out', targetColumn: 'tens', beadsAffected: [1, 5, 1], expectedValueAfter: 36 },
        { stepIndex: 10, instructionText: '+1 مباشر', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 37 },
      ],
      explanation: '8 + 3 + 1 + 8 + 9 + 8 − 3 + 6 − 4 + 1 = 37',
      story: 'سلسلة من 10 عمليات. النتيجة: 37',
      storyAudioText: 'سلسلة من عشر عمليات. النتيجة سبعة وثلاثون.',
    },
  ],
};
export const LEARN_MODULES: LearnModule[] = [
  level0,
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
];