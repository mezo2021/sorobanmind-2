// src/data/enrichment.ts

import type { Category, LocalizedText } from "../curriculum/types";

/**
 * وصف درس إثراء.
 */
export interface EnrichmentInfo {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  rule: LocalizedText;
  category: Category | "both";
  icon: string;
  gradient: string;
  order: number;
  estimatedMinutes: number;
  targetAge: [number, number];
}

/**
 * كل دروس الإثراء.
 *
 * هذه الدروس **تحضيرية** قبل المنهج — لا تُختبر في امتحانات المنهج.
 */
export const ENRICHMENT_MODULES: EnrichmentInfo[] = [
  // ═══ للأطفال (5-12) ═══
  {
    id: "E1",
    name: {
      ar: "رياضيات الأصابع",
      en: "Finger Math",
    },
    description: {
      ar: "تعلّم الأعداد بأصابعك قبل السوروبان",
      en: "Learn numbers with your hands before Soroban",
    },
    rule: {
      ar: "الإبهام = ٥ · الأصابع = ١",
      en: "Thumb = 5 · Fingers = 1",
    },
    category: "kids",
    icon: "Hand",
    gradient: "from-rose-500 to-pink-600",
    order: 1,
    estimatedMinutes: 30,
    targetAge: [5, 12],
  },
  {
    id: "E2",
    name: {
      ar: "أسرار جدول الضرب",
      en: "Magic Multiplication Secrets",
    },
    description: {
      ar: "حِيَل ذكية تحفظ جدول الضرب بلا تكرار",
      en: "Smart tricks to master the times table without repetition",
    },
    rule: {
      ar: "٢٠ سراً لجدول الضرب",
      en: "20 secrets for the times table",
    },
    category: "kids",
    icon: "Wand2",
    gradient: "from-amber-500 to-rose-600",
    order: 2,
    estimatedMinutes: 60,
    targetAge: [8, 12],
  },

  // ═══ للشباب (13+) ═══
  {
    id: "E3",
    name: {
      ar: "الضرب الفيدي",
      en: "Vedic Multiplication",
    },
    description: {
      ar: "طريقة الضرب التقاطعي — أسرع بمرتين",
      en: "The criss-cross method — twice as fast",
    },
    rule: {
      ar: "التقاطع العمودي والأفقي",
      en: "Vertical and horizontal cross-product",
    },
    category: "teens",
    icon: "Hash",
    gradient: "from-cyan-500 to-blue-700",
    order: 1,
    estimatedMinutes: 60,
    targetAge: [13, 99],
  },
];

/**
 * الحصول على دروس الإثراء لفئة معينة.
 */
export function getEnrichmentByCategory(
  category: Category,
): EnrichmentInfo[] {
  return ENRICHMENT_MODULES.filter(
    (e) => e.category === category || e.category === "both",
  ).sort((a, b) => a.order - b.order);
}

/**
 * الحصول على درس إثراء.
 */
export function getEnrichment(
  enrichmentId: string,
): EnrichmentInfo | undefined {
  return ENRICHMENT_MODULES.find((e) => e.id === enrichmentId);
}

/**
 * عدد دروس الإثراء.
 */
export const TOTAL_ENRICHMENT = ENRICHMENT_MODULES.length;