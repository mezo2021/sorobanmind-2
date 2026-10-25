// src/curriculum/lessons/L0/intro.ts
// 🎬 درس المقدمة: التعرّف على السوروبان (نظري — بلا مهارة)

import type { LessonNode } from '../types';

export const L0_INTRO: LessonNode = {
  id: 'L0-intro',
  skillId: null,
  levelId: 'L0',
  order: 1,

  title: {
    ar: 'التعرّف على السوروبان',
    en: 'Getting to Know the Soroban',
  },

  story: {
    ar: 'مرحباً يا بطل! اليوم سنلتقي بالسوروبان ونتعلم كيف تتحدث خرزاته بلغة الأرقام.',
    en: 'Hello, little hero! Today we will meet the soroban and learn how its beads speak the language of numbers.',
  },
  storyAudioId: null,

  concept: {
    ar: 'السوروبان هو المعداد الياباني المستخدم لتعلّم الحساب. في كل عمود توجد خرزة علوية قيمتها 5، وأربع خرزات سفلية قيمة كل واحدة منها 1. العارضة الأفقية تفصل بينهما. القاعدة الأساسية: الخرزة التي تلامس العارضة هي التي نحسب قيمتها، والخرزة البعيدة عن العارضة لا تُحسب.',
    en: 'The soroban is the Japanese abacus used for learning calculation. Each column has one upper bead worth 5 and four lower beads worth 1 each. The horizontal beam separates them. The basic rule: a bead touching the beam is counted; a bead away from the beam is not counted.',
  },

  isTheoretical: true,

  examples: [],
  tryQuestions: [],

  introPages: [
    {
      id: 'L0-intro-p1',
      title: '🧮 السوروبان | 🧮 The Soroban',
      content:
        'مرحباً يا بطل! 🌟\n\n' +
        'هذا هو السوروبان، المعداد الياباني.\n\n' +
        'سنستخدمه لنتعلم الأرقام والحساب بطريقة سهلة وممتعة.\n\n' +
        'السوروبان ليس مجرد خرزات؛ كل خرزة لها مكان وقيمة، وأنت ستتعلم كيف تجعلها تمثّل الأرقام.\n\n' +
        ' | \n\n' +
        'Hello hero! 🌟\n\n' +
        'This is the Soroban, the Japanese abacus.\n\n' +
        'We will use it to learn numbers and math in an easy and fun way.\n\n' +
        'The Soroban is not just beads; every bead has a place and a value, and you will learn how to make them represent numbers.',
      imageSvg: 'soroban-welcome-animated',
      imageAlt: 'مرحباً بك في عالم السوروبان | Welcome to the world of Soroban',
    },
    {
      id: 'L0-intro-p2',
      title: '📜 قصة السوروبان | 📜 Story of the Soroban',
      content:
        'استخدم الناس المعداد منذ زمن بعيد ليساعدهم على العد والحساب.\n\n' +
        'وصلت أدوات العد إلى اليابان، ثم تطوّر المعداد الياباني حتى أصبح السوروبان الذي نتعلم عليه اليوم.\n\n' +
        'السوروبان الذي ستستخدمه يحتوي على خرزة علوية قيمتها 5، وأربع خرزات سفلية قيمة كل واحدة منها 1.\n\n' +
        'والآن، لنترك القصة ونبدأ بالتعرّف إلى خرزات السوروبان! 👀\n\n' +
        ' | \n\n' +
        'People have used the abacus for a long time to help them count and calculate.\n\n' +
        'Counting tools reached Japan, and the Japanese abacus evolved into the Soroban we learn on today.\n\n' +
        'The Soroban you will use has one upper bead worth 5, and four lower beads worth 1 each.\n\n' +
        'Now, let\'s leave the story and start getting to know the Soroban beads! 👀',
      imageSvg: 'soroban-story-animated',
      imageAlt: 'رحلة السوروبان عبر الزمن | The Soroban journey through time',
    },
    {
      id: 'L0-intro-p3',
      title: '🔍 تعرّف على السوروبان | 🔍 Get to Know the Soroban',
      content:
        'انظر إلى السوروبان جيداً. 👀\n\n' +
        'ستجد فيه:\n\n' +
        '• الإطار: الجزء الذي يمسك السوروبان.\n' +
        '• العارضة: الخط الأفقي في المنتصف.\n' +
        '• الأعمدة: الخطوط الرأسية التي تتحرك عليها الخرزات.\n' +
        '• خرزة علوية واحدة في كل عمود: قيمتها 5.\n' +
        '• أربع خرزات سفلية في كل عمود: قيمة كل واحدة 1.\n\n' +
        'لا تحتاج إلى حفظ كل شيء الآن. المهم أن تعرف مكان العارضة والخرزات.\n\n' +
        ' | \n\n' +
        'Look closely at the Soroban. 👀\n\n' +
        'You will find:\n\n' +
        '• The Frame: The part that holds the Soroban.\n' +
        '• The Beam: The horizontal line in the middle.\n' +
        '• The Rods: The vertical lines on which beads move.\n' +
        '• One upper bead in each rod: Worth 5.\n' +
        '• Four lower beads in each rod: Each worth 1.\n\n' +
        'You don\'t need to memorize everything now. It\'s important to know where the beam and beads are.',
      imageSvg: 'soroban-parts-animated',
      imageAlt: 'أجزاء السوروبان المتحركة | Animated Soroban parts',
    },
    {
      id: 'L0-intro-p4',
      title: '🔑 القاعدة الذهبية | 🔑 The Golden Rule',
      content:
        'تذكّر هذه القاعدة جيداً:\n\n' +
        '✨ الخرزة التي تلامس العارضة هي التي تُحسب.\n\n' +
        'أما الخرزة البعيدة عن العارضة فلا تُحسب.\n\n' +
        'مثلاً:\n' +
        '• خرزة سفلية تلامس العارضة = 1\n' +
        '• خرزة سفلية بعيدة عن العارضة = 0\n' +
        '• الخرزة العلوية تلامس العارضة = 5\n' +
        '• الخرزة العلوية بعيدة عن العارضة = 0\n\n' +
        'هذه القاعدة سترافقك في كل دروس السوروبان. 🧠\n\n' +
        ' | \n\n' +
        'Remember this rule well:\n\n' +
        '✨ The bead touching the beam is counted.\n\n' +
        'The bead away from the beam is not counted.\n\n' +
        'For example:\n' +
        '• Lower bead touching the beam = 1\n' +
        '• Lower bead away from the beam = 0\n' +
        '• Upper bead touching the beam = 5\n' +
        '• Upper bead away from the beam = 0\n\n' +
        'This rule will accompany you in all Soroban lessons. 🧠',
      imageSvg: 'soroban-rule-animated',
      imageAlt: 'القاعدة الذهبية: الخرزة التي تلامس العارضة تُحسب | The Golden Rule: Bead touching the beam is counted',
    },
    {
      id: 'L0-intro-p5',
      title: '🖐️ حرّك الخرزات | 🖐️ Move the Beads',
      content:
        'الآن جرّب بيدك على السوروبان.\n\n' +
        'حرّك خرزة سفلية إلى العارضة.\n' +
        'ماذا حدث؟ أصبحت قيمتها 1. ✨\n\n' +
        'ثم أبعدها عن العارضة.\n' +
        'ماذا حدث؟ أصبحت قيمتها 0.\n\n' +
        'جرّب الآن الخرزة العلوية.\n' +
        'عندما تلامس العارضة تكون قيمتها 5.\n\n' +
        'تذكّر:\n' +
        'نحن لا نحسب الخرزة لمجرد وجودها؛ نحسبها عندما تلامس العارضة.\n\n' +
        ' | \n\n' +
        'Now try with your hand on the Soroban.\n\n' +
        'Move a lower bead to the beam.\n' +
        'What happened? It became 1. ✨\n\n' +
        'Then push it away from the beam.\n' +
        'What happened? It became 0.\n\n' +
        'Now try the upper bead.\n' +
        'When it touches the beam, its value is 5.\n\n' +
        'Remember:\n' +
        'We don\'t count a bead just because it exists; we count it when it touches the beam.',
      imageSvg: 'soroban-interactive',
      imageAlt: 'سوروبان تفاعلي | Interactive Soroban',
    },
    {
      id: 'L0-intro-p6',
      title: '🌟 لماذا نتعلم السوروبان؟ | 🌟 Why Do We Learn the Soroban?',
      content:
        'السوروبان يساعدك على التدريب على:\n\n' +
        '1. التركيز والانتباه 👀\n' +
        '2. فهم قيمة الأرقام 🔢\n' +
        '3. ترتيب الأعداد بطريقة واضحة\n' +
        '4. تحريك الخرزات بدقة وسرعة\n' +
        '5. تذكّر صور الأعداد على السوروبان\n' +
        '6. الانتقال تدريجياً من السوروبان الحقيقي إلى الحساب الذهني 🧠\n\n' +
        'لن نحاول أن نتعلم كل شيء في يوم واحد.\n' +
        'سنتعلم خطوة صغيرة، ثم نتدرب عليها حتى تصبح سهلة.\n\n' +
        ' | \n\n' +
        'The Soroban helps you train:\n\n' +
        '1. Focus and attention 👀\n' +
        '2. Understanding number value 🔢\n' +
        '3. Organizing numbers clearly\n' +
        '4. Moving beads precisely and quickly\n' +
        '5. Remembering number images on the Soroban\n' +
        '6. Gradually transitioning from the physical Soroban to mental math 🧠\n\n' +
        'We won\'t try to learn everything in one day.\n' +
        'We will learn a small step, then practice it until it becomes easy.',
      imageSvg: 'soroban-benefits-animated',
      imageAlt: 'فوائد تعلّم السوروبان | Benefits of learning the Soroban',
    },
    {
      id: 'L0-intro-p7',
      title: '🎯 هل أنت مستعد؟ | 🎯 Are You Ready?',
      content:
        'رائع يا بطل! 🎉\n\n' +
        'أصبحت تعرف الآن:\n\n' +
        '• أن السوروبان أداة يابانية للحساب.\n' +
        '• مكان العارضة.\n' +
        '• أن لكل عمود خرزة علوية وأربع خرزات سفلية.\n' +
        '• أن الخرزة العلوية قيمتها 5.\n' +
        '• أن كل خرزة سفلية قيمتها 1.\n' +
        '• أن الخرزة التي تلامس العارضة هي التي تُحسب.\n\n' +
        'في الدرس القادم ستتعلم كيف تمثّل الأعداد من 0 إلى 9 على السوروبان.\n\n' +
        'هيا بنا! 🚀\n\n' +
        ' | \n\n' +
        'Awesome hero! 🎉\n\n' +
        'You now know:\n\n' +
        '• That the Soroban is a Japanese tool for calculation.\n' +
        '• Where the beam is.\n' +
        '• That each rod has one upper bead and four lower beads.\n' +
        '• That the upper bead is worth 5.\n' +
        '• That each lower bead is worth 1.\n' +
        '• That the bead touching the beam is counted.\n\n' +
        'In the next lesson, you will learn how to represent numbers from 0 to 9 on the Soroban.\n\n' +
        'Let\'s go! 🚀',
      imageSvg: 'soroban-ready-animated',
      imageAlt: 'أنت مستعد يا بطل | You are ready hero',
    },
  ],

  estimatedMinutes: 5,
  xpReward: 0,
};

export default L0_INTRO;