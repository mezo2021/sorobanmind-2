// ═══════════════════════════════════════════════════════════════════
// 🔑 src/data/index.ts — مركز التصدير المركزي للبيانات
// ═══════════════════════════════════════════════════════════════════
//
// ⚠️ ملف حرج — لا يُحذف أبدًا
//
// الوظيفة:
//   - يجمع كل تصديرات مجلد data في مكان واحد
//   - يسمح بالاستيراد المختصر: import { X } from '../data'
//
// القواعد الإلزامية:
//   1. قبل حذف أي ملف في data → ابحث عن تصديره هنا أولًا
//   2. عند إضافة ملف جديد → أضف تصديره هنا
//   3. لا تحذف سطرًا من هنا إلا بعد التأكد أن لا أحد يستورده
//   4. أي تعديل هنا قد يكسر المشروع — اختبر فورًا
//
// آخر تحديث: 2026-10-16
//   - حذف QUESTS (انتقل إلى achievements في useQuests)
//   - حذف BADGES + Badge + BadgeRequirement (نظام قديم)
//
// ═══════════════════════════════════════════════════════════════════

import type {
  LevelNode,
  PracticeQuestion,
  ChainExercise,
} from '../types';

// ═══════════════════════════════════════════════════════════
// المستويات (10 مستويات — v1 قديمة)
// ═══════════════════════════════════════════════════════════
export const LEVELS: LevelNode[] = [
  { id: 0, name: 'Finger Math', nameAr: 'رياضيات الأصابع', status: 'available', icon: 'Hand', xpRequired: 0 },
  { id: 1, name: 'Soroban Intro', nameAr: 'تعريف السوروبان', status: 'locked', icon: 'Info', xpRequired: 100 },
  { id: 2, name: 'Number Representation', nameAr: 'تمثيل الأعداد', status: 'locked', icon: 'Hash', xpRequired: 250 },
  { id: 3, name: 'Direct Operations', nameAr: 'العمليات المباشرة', status: 'locked', icon: 'Plus', xpRequired: 500 },
  { id: 4, name: 'Small Friends - Addition', nameAr: 'متممات الخمسة — جمع', status: 'locked', icon: 'Combine', xpRequired: 900 },
  { id: 5, name: 'Small Friends - Subtraction', nameAr: 'متممات الخمسة — طرح', status: 'locked', icon: 'Minus', xpRequired: 1400 },
  { id: 6, name: 'Big Friends - Addition', nameAr: 'مكملات العشرة — جمع', status: 'locked', icon: 'Sigma', xpRequired: 2200 },
  { id: 7, name: 'Big Friends - Subtraction', nameAr: 'مكملات العشرة — طرح', status: 'locked', icon: 'Sigma', xpRequired: 3000 },
  { id: 8, name: 'Magic Merge', nameAr: 'الاندماج السحري', status: 'locked', icon: 'Brain', xpRequired: 4000 },
  { id: 9, name: 'Chain Challenge', nameAr: 'تحدي السلاسل', status: 'locked', icon: 'List', xpRequired: 5200 },
];

// ═══════════════════════════════════════════════════════════
// أسئلة التدريب (فارغة)
// ═══════════════════════════════════════════════════════════
export const PRACTICE_QUESTIONS: PracticeQuestion[] = [];

// ═══════════════════════════════════════════════════════════
// تمارين السلاسل (فارغة)
// ═══════════════════════════════════════════════════════════
export const CHAIN_EXERCISES: ChainExercise[] = [];

// ═══════════════════════════════════════════════════════════
// Aliases للتوافق
// ═══════════════════════════════════════════════════════════
export const ADDITION_QUESTIONS = PRACTICE_QUESTIONS.filter((q) =>
  q.question.includes('+')
);

export const SUBTRACTION_QUESTIONS = PRACTICE_QUESTIONS.filter(
  (q) => q.question.includes('-') && !q.question.includes('÷')
);

export const MULTIPLICATION_QUESTIONS = PRACTICE_QUESTIONS.filter((q) =>
  q.question.includes('×')
);

export const DIVISION_QUESTIONS = PRACTICE_QUESTIONS.filter((q) =>
  q.question.includes('÷')
);