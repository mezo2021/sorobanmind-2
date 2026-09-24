// src/utils/badgeChecker.ts — التحقق من استحقاق الشارات
import { BADGES, type Badge, type BadgeRequirement } from '../data';
import { loadAnzanBadges } from '../examBank2';

const COMPLETED_KEY = 'soroban-completed-lessons';
const STATS_KEY = 'sorobanmind-stats';
const EXAM_KEY = 'soroban_exam_result';

function getCompletedLessons(): number[] {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getXP(): number {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return typeof parsed.xp === 'number' ? parsed.xp : 0;
  } catch {
    return 0;
  }
}

function isExamPassed(): boolean {
  try {
    const raw = localStorage.getItem(EXAM_KEY);
    if (!raw) return false;
    return JSON.parse(raw).passed === true;
  } catch {
    return false;
  }
}

function checkRequirement(req: BadgeRequirement): boolean {
  switch (req.type) {
    case 'lessons': {
      const completed = getCompletedLessons();
      return completed.length >= req.count;
    }
    case 'anzan_badge': {
      const badges = loadAnzanBadges();
      return !!badges[req.badge];
    }
    case 'all_anzan_badges': {
      const badges = loadAnzanBadges();
      return (
        !!badges.master_addition &&
        !!badges.master_multiplication &&
        !!badges.master_division &&
        !!badges.master_mixed
      );
    }
    case 'exam_passed': {
      return isExamPassed();
    }
    case 'all_lessons': {
      const completed = getCompletedLessons();
      const all = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      return all.every((id) => completed.includes(id));
    }
    case 'xp': {
      return getXP() >= req.count;
    }
    default:
      return false;
  }
}

export function getAllEarnedBadges(): string[] {
  const earned: string[] = [];
  for (const badge of BADGES) {
    if (checkRequirement(badge.requirement)) {
      earned.push(badge.id);
    }
  }
  return earned;
}

export function isBadgeEarned(badge: Badge): boolean {
  return checkRequirement(badge.requirement);
}

export function getNextBadge(): Badge | undefined {
  return BADGES.find((b) => !checkRequirement(b.requirement));
}

export function getBadgeProgress(): number {
  const next = getNextBadge();
  if (!next) return 100;

  switch (next.requirement.type) {
    case 'lessons': {
      const completed = getCompletedLessons().length;
      return Math.min(100, (completed / next.requirement.count) * 100);
    }
    case 'xp': {
      const xp = getXP();
      return Math.min(100, (xp / next.requirement.count) * 100);
    }
    case 'anzan_badge':
    case 'all_anzan_badges':
    case 'exam_passed':
    case 'all_lessons': {
      return 0;
    }
    default:
      return 0;
  }
}