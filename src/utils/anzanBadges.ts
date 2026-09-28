// ============================================================
// anzanBadges.ts — شارات الأنزان (منطق مستقل)
// تم فصله من examBank2.ts لتنظيف البنية
// ============================================================

export const ANZAN_BADGES_KEY = 'soroban_anzan_badges';

export interface AnzanBadges {
  master_addition?: boolean;
  master_multiplication?: boolean;
  master_division?: boolean;
  master_mixed?: boolean;
}

export function loadAnzanBadges(): AnzanBadges {
  try {
    const raw = localStorage.getItem(ANZAN_BADGES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAnzanBadges(badges: AnzanBadges): void {
  try {
    localStorage.setItem(ANZAN_BADGES_KEY, JSON.stringify(badges));
  } catch {
    /* ignore */
  }
}

export function hasAnzanBadge(badge: keyof AnzanBadges): boolean {
  return !!loadAnzanBadges()[badge];
}
