// src/curriculum/lessons/L0/S1.ts
// 📖 درس S1: تمثيل الأرقام من 0 إلى 9 على السوروبان

import type { LessonNode, LessonExample, TryQuestion } from '../types';

const EXAMPLES: LessonExample[] = [
  {
    id: 'L0-S1-E1',
    problemText: 'مثّل الرقم 0',
    answer: 0,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'اترك الخرزات بعيدة عن العارضة', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [], expectedValueAfter: 0 },
    ],
    explanation: 'لا توجد خرزة تلمس العارضة — الرقم صفر.',
  },
  {
    id: 'L0-S1-E2',
    problemText: 'مثّل الرقم 1',
    answer: 1,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'ارفع خرزة سفلية واحدة نحو العارضة بالإبهام', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 1 },
    ],
    explanation: 'خرزة سفلية واحدة = 1.',
  },
  {
    id: 'L0-S1-E3',
    problemText: 'مثّل الرقم 5',
    answer: 5,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'أنزل الخرزة العلوية نحو العارضة بالسبابة', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
    ],
    explanation: 'الخرزة العلوية وحدها = 5 (الجدة).',
  },
  {
    id: 'L0-S1-E4',
    problemText: 'مثّل الرقم 2',
    answer: 2,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'ارفع خرزتين سفليتين نحو العارضة', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 2 },
    ],
    explanation: 'خرزتان سفليتان = 2.',
  },
  {
    id: 'L0-S1-E5',
    problemText: 'مثّل الرقم 6',
    answer: 6,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'أنزل الخرزة العلوية (5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
      { stepIndex: 2, instructionText: 'ارفع خرزة سفلية واحدة (1)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1], expectedValueAfter: 6 },
    ],
    explanation: '5 + 1 = 6 (الجدة + طفل).',
  },
  {
    id: 'L0-S1-E6',
    problemText: 'مثّل الرقم 3',
    answer: 3,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'ارفع ثلاث خرزات سفلية نحو العارضة', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 3 },
    ],
    explanation: 'ثلاث خرزات سفلية = 3.',
  },
  {
    id: 'L0-S1-E7',
    problemText: 'مثّل الرقم 7',
    answer: 7,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'أنزل الخرزة العلوية (5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
      { stepIndex: 2, instructionText: 'ارفع خرزتين سفليتين (2)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2], expectedValueAfter: 7 },
    ],
    explanation: '5 + 2 = 7 (الجدة + طفلان).',
  },
  {
    id: 'L0-S1-E8',
    problemText: 'مثّل الرقم 4',
    answer: 4,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'ارفع الأربع خرزات السفلية نحو العارضة', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 4 },
    ],
    explanation: 'كل الخرزات السفلية = 4.',
  },
  {
    id: 'L0-S1-E9',
    problemText: 'مثّل الرقم 8',
    answer: 8,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'أنزل الخرزة العلوية (5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
      { stepIndex: 2, instructionText: 'ارفع ثلاث خرزات سفلية (3)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3], expectedValueAfter: 8 },
    ],
    explanation: '5 + 3 = 8.',
  },
  {
    id: 'L0-S1-E10',
    problemText: 'مثّل الرقم 9',
    answer: 9,
    ruleCategory: 'build',
    steps: [
      { stepIndex: 1, instructionText: 'أنزل الخرزة العلوية (5)', fingerUsed: 'index', direction: 'down', targetColumn: 'units', beadsAffected: [5], expectedValueAfter: 5 },
      { stepIndex: 2, instructionText: 'ارفع الأربع خرزات السفلية (4)', fingerUsed: 'thumb', direction: 'up', targetColumn: 'units', beadsAffected: [1, 2, 3, 4], expectedValueAfter: 9 },
    ],
    explanation: '5 + 4 = 9 (الجدة + كل الأطفال).',
  },
];

const TRY_QUESTIONS: TryQuestion[] = [
  { id: 'L0-S1-T1', type: 'read', prompt: 'اقرأ الرقم المثبت: لا توجد خرزة تلامس العارضة', expectedValue: 0 },
  { id: 'L0-S1-T2', type: 'read', prompt: 'اقرأ الرقم المثبت: خرزة سفلية واحدة نحو العارضة', expectedValue: 1 },
  { id: 'L0-S1-T3', type: 'read', prompt: 'اقرأ الرقم المثبت: الخرزة العلوية نحو العارضة', expectedValue: 5 },
  { id: 'L0-S1-T4', type: 'read', prompt: 'اقرأ الرقم المثبت: خرزتان سفليتان نحو العارضة', expectedValue: 2 },
  { id: 'L0-S1-T5', type: 'read', prompt: 'اقرأ الرقم المثبت: الخرزة العلوية + خرزة سفلية واحدة', expectedValue: 6 },
  { id: 'L0-S1-T6', type: 'read', prompt: 'اقرأ الرقم المثبت: ثلاث خرزات سفلية نحو العارضة', expectedValue: 3 },
  { id: 'L0-S1-T7', type: 'read', prompt: 'اقرأ الرقم المثبت: الخرزة العلوية + خرزتان سفليتان', expectedValue: 7 },
  { id: 'L0-S1-T8', type: 'read', prompt: 'اقرأ الرقم المثبت: أربع خرزات سفلية نحو العارضة', expectedValue: 4 },
  { id: 'L0-S1-T9', type: 'read', prompt: 'اقرأ الرقم المثبت: الخرزة العلوية + ثلاث خرزات سفلية', expectedValue: 8 },
  { id: 'L0-S1-T10', type: 'read', prompt: 'اقرأ الرقم المثبت: الخرزة العلوية + أربع خرزات سفلية', expectedValue: 9 },
];

export const L0_S1: LessonNode = {
  id: 'L0-S1',
  skillId: 'S1',
  levelId: 'L0',
  order: 2,

  title: { ar: 'تمثيل الأرقام من 0 إلى 9', en: 'Representing Numbers 0-9' },

  story: {
    ar: 'في يوم مشمس، وصل ثلاثة أبطال صغار — شام وريان وبانة — إلى بوابة خشبية ضخمة نُقش عليها: قلعة السوروبان، من يدخلها يصبح سيد الأرقام. دقّوا الجرس، فانفتح الباب، وظهر حارس القلعة: رجل خشبي اسمه الإطار. قال مبتسماً: في هذه القلعة تسكن عائلة غريبة — أربعة أطفال نشيطون في الطابق السفلي، كل واحد قيمته واحد. وفوق الجسر تسكن الجدة الحنونة، قيمتها خمسة.',
    en: 'On a sunny day, three young heroes reached a giant wooden gate engraved with: Castle of the Soroban. They rang the bell, and the castle guard — a wooden man named the Frame — appeared. He said with a smile: In this castle lives a strange family — four active children downstairs, each worth one. Above the beam lives the kind grandmother, worth five.',
  },
  storyAudioId: 1,

  concept: {
    ar: 'الخرزة العلوية (الجدة) قيمتها 5، وكل خرزة سفلية (طفل) قيمتها 1. الخرزة التي تلمس العارضة فقط هي التي تُحسب.',
    en: 'The upper bead (grandmother) is worth 5. Each lower bead (child) is worth 1. Only beads touching the beam are counted.',
  },

  rule: {
    ar: 'لتمثيل رقم من 0 إلى 9: استخدم الخرزة العلوية للخمسة، والخرزات السفلية للأرقام 1-4.',
    en: 'To represent 0-9: use the upper bead for 5, and lower beads for 1-4.',
  },
  ruleTable: [
    { formula: '0', result: 'لا خرزة' },
    { formula: '1', result: 'خرزة سفلية' },
    { formula: '2', result: 'خرزتان سفليتان' },
    { formula: '3', result: '3 خرزات سفلية' },
    { formula: '4', result: '4 خرزات سفلية' },
    { formula: '5', result: 'الخرزة العلوية' },
    { formula: '6', result: '5 + 1' },
    { formula: '7', result: '5 + 2' },
    { formula: '8', result: '5 + 3' },
    { formula: '9', result: '5 + 4' },
  ],

  examples: EXAMPLES,
  tryQuestions: TRY_QUESTIONS,

  estimatedMinutes: 10,
  xpReward: 10,
  isTheoretical: false,
};

export default L0_S1;