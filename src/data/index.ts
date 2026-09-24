// src/data/index.ts — v1 data (LEARN_MODULES, LEVELS, QUESTS, BADGES)

import type {
  LevelNode,
  import type { LevelNode, Quest, PracticeQuestion, ChainExercise } from '../types';

// ═══════════════════════════════════════════════════════════
// المستويات
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
// الدروس — من ملف منفصل
// ═══════════════════════════════════════════════════════════
export { LEARN_MODULES } from './learnModules';

// ═══════════════════════════════════════════════════════════
// المهام (Quests)
// ═══════════════════════════════════════════════════════════
export const QUESTS: Quest[] = [
  { id: 1, title: 'Daily Practice', titleAr: 'التدريب اليومي', description: 'Complete 10', descriptionAr: 'أكمل ١٠ مسائل', xpReward: 30, progress: 0, target: 10, icon: 'Swords', color: 'from-purple-500 to-electric-500', type: 'practice' },
  { id: 2, title: 'Anzan Apprentice', titleAr: 'متدرب الأنزان', description: 'Score 20', descriptionAr: 'احصل على ٢٠ نقطة', xpReward: 40, progress: 0, target: 20, icon: 'Eye', color: 'from-electric-500 to-emerald2-500', type: 'anzan' },
  { id: 3, title: 'Perfect Streak', titleAr: 'سلسلة مثالية', description: '5-day streak', descriptionAr: 'حافظ على ٥ أيام', xpReward: 80, progress: 0, target: 5, icon: 'Flame', color: 'from-gold-400 to-gold-600', type: 'streak' },
  { id: 4, title: 'Lesson Explorer', titleAr: 'مستكشف الدروس', description: 'Complete 3', descriptionAr: 'أكمل ٣ دروس', xpReward: 50, progress: 0, target: 3, icon: 'BookOpen', color: 'from-emerald2-400 to-emerald2-600', type: 'lessons' },
  { id: 5, title: 'Addition Master', titleAr: 'سيد الجمع', description: '5 additions', descriptionAr: '٥ مسائل جمع', xpReward: 50, progress: 0, target: 5, icon: 'Plus', color: 'from-purple-400 to-purple-600', type: 'addition' },
  { id: 6, title: 'Subtraction Hero', titleAr: 'بطل الطرح', description: '5 subtractions', descriptionAr: '٥ مسائل طرح', xpReward: 50, progress: 0, target: 5, icon: 'Minus', color: 'from-electric-400 to-electric-600', type: 'subtraction' },
  { id: 7, title: 'Multiplication Pro', titleAr: 'محترف الضرب', description: '5 multiplications', descriptionAr: '٥ مسائل ضرب', xpReward: 80, progress: 0, target: 5, icon: 'X', color: 'from-pink-400 to-pink-600', type: 'multiplication' },
  { id: 8, title: 'Division Expert', titleAr: 'خبير القسمة', description: '5 divisions', descriptionAr: '٥ مسائل قسمة', xpReward: 80, progress: 0, target: 5, icon: 'Divide', color: 'from-gold-400 to-gold-600', type: 'division' },
  { id: 9, title: 'Anzan Expert', titleAr: 'خبير الأنزان', description: 'Score 50', descriptionAr: '٥٠ نقطة في الأنزان', xpReward: 80, progress: 0, target: 50, icon: 'Eye', color: 'from-emerald2-400 to-emerald2-600', type: 'anzanHighScore' },
];

// ═══════════════════════════════════════════════════════════
// أسئلة التدريب + السلاسل (فارغة حالياً)
// ═══════════════════════════════════════════════════════════
export const PRACTICE_QUESTIONS: PracticeQuestion[] = [];
export const CHAIN_EXERCISES: ChainExercise[] = [];

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

// ═══════════════════════════════════════════════════════════
// الشارات (Badges)
// ═══════════════════════════════════════════════════════════
export type BadgeRequirement =
  | { type: 'lessons'; count: number }
  | { type: 'anzan_badge'; badge: 'master_addition' | 'master_multiplication' | 'master_division' | 'master_mixed' }
  | { type: 'all_anzan_badges' }
  | { type: 'exam_passed' }
  | { type: 'all_lessons' }
  | { type: 'xp'; count: number };

export interface Badge {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  xpRequired: number;
  requirement: BadgeRequirement;
  descriptionAr: string;
}

export const BADGES: Badge[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    nameAr: 'مبتدئ',
    icon: 'Star',
    xpRequired: 100,
    requirement: { type: 'lessons', count: 3 },
    descriptionAr: 'أكمل ٣ دروس',
  },
  {
    id: 'trainee',
    name: 'Trainee',
    nameAr: 'متدرب',
    icon: 'Target',
    xpRequired: 300,
    requirement: { type: 'lessons', count: 5 },
    descriptionAr: 'أكمل ٥ دروس',
  },
  {
    id: 'anzan-master',
    name: 'Anzan Master',
    nameAr: 'سيد الأنزان',
    icon: 'Eye',
    xpRequired: 500,
    requirement: { type: 'anzan_badge', badge: 'master_addition' },
    descriptionAr: 'احصل على شارة "خبير جمع وطرح"',
  },
  {
    id: 'skilled',
    name: 'Skilled',
    nameAr: 'ماهر',
    icon: 'Award',
    xpRequired: 800,
    requirement: { type: 'lessons', count: 8 },
    descriptionAr: 'أكمل ٨ دروس',
  },
  {
    id: 'soroban-expert',
    name: 'Soroban Expert',
    nameAr: 'خبير السوروبان',
    icon: 'Award',
    xpRequired: 1200,
    requirement: { type: 'exam_passed' },
    descriptionAr: 'اجتز الامتحان النهائي',
  },
  {
    id: 'professional',
    name: 'Professional',
    nameAr: 'محترف',
    icon: 'Diamond',
    xpRequired: 2000,
    requirement: { type: 'all_anzan_badges' },
    descriptionAr: 'احصل على شارات الأنزان الأربعة',
  },
  {
    id: 'legend',
    name: 'Legend',
    nameAr: 'أسطورة',
    icon: 'Crown',
    xpRequired: 3000,
    requirement: { type: 'all_lessons' },
    descriptionAr: 'أكمل جميع دروس المستويات',
  },
  {
    id: 'eternal-legend',
    name: 'Eternal Legend',
    nameAr: 'أسطورة خالدة',
    icon: 'Crown',
    xpRequired: 5000,
    requirement: { type: 'xp', count: 5000 },
    descriptionAr: 'اجمع ٥٠٠٠ نقطة خبرة',
  },
];