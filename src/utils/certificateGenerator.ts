// src/utils/certificateGenerator.ts — مولّد بيانات الشهادة

export type CertificateLevel = 'gold' | 'silver' | 'bronze' | 'pass';

export interface CertificateData {
  studentName: string;
  exam1Score: number;
  exam2Score: number;
  averageScore: number;
  level: CertificateLevel;
  levelAr: string;
  levelEn: string;
  medalEmoji: string;
  appreciation: string;
  certificateNumber: string;
  issueDate: string;
  issueDateHijri: string;
  verificationUrl: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function generateCertificateNumber(seed: string): string {
  const year = new Date().getFullYear();
  const num = (hashCode(seed) % 900000) + 100000;
  return `ISA-${year}-${num}`;
}

function toHijriApprox(date: Date): string {
  const gregorianYear = date.getFullYear();
  const hijriYear = Math.floor(((gregorianYear - 622) * 33) / 32);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${hijriYear} / ${String(month).padStart(2, '0')} / ${String(day).padStart(2, '0')} هـ`;
}

export function getLevel(average: number): {
  level: CertificateLevel;
  levelAr: string;
  levelEn: string;
  medalEmoji: string;
  appreciation: string;
} {
  if (average >= 95) {
    return { level: 'gold', levelAr: 'ذهبي', levelEn: 'Gold', medalEmoji: '🥇', appreciation: 'ممتاز' };
  }
  if (average >= 85) {
    return { level: 'silver', levelAr: 'فضي', levelEn: 'Silver', medalEmoji: '🥈', appreciation: 'جيد جداً' };
  }
  if (average >= 75) {
    return { level: 'bronze', levelAr: 'برونزي', levelEn: 'Bronze', medalEmoji: '🥉', appreciation: 'جيد' };
  }
  return { level: 'pass', levelAr: 'مقبول', levelEn: 'Pass', medalEmoji: '🎖️', appreciation: 'مقبول' };
}

export function getCertificateData(
  studentName: string,
  exam1Score: number,
  exam2Score: number
): CertificateData {
  const safeName = studentName?.trim() || 'اكتب اسمك الثلاثي';
  const avg = (exam1Score + exam2Score) / 2;
  const averageScore = Math.round(avg * 10) / 10;
  const { level, levelAr, levelEn, medalEmoji, appreciation } = getLevel(averageScore);

  const now = new Date();
  const issueDate = `${now.getFullYear()} / ${String(now.getMonth() + 1).padStart(2, '0')} / ${String(now.getDate()).padStart(2, '0')} م`;
  const certificateNumber = generateCertificateNumber(safeName + exam1Score + exam2Score);

  const verificationUrl = `https://mezo2021.github.io/sorobanmind-2/#verify/${certificateNumber}`;

  return {
    studentName: safeName,
    exam1Score,
    exam2Score,
    averageScore,
    level,
    levelAr,
    levelEn,
    medalEmoji,
    appreciation,
    certificateNumber,
    issueDate,
    issueDateHijri: toHijriApprox(now),
    verificationUrl,
  };
}

export function getLevelColors(level: CertificateLevel) {
  switch (level) {
    case 'gold':
      return { primary: '#FFD700', dark: '#B8860B', light: '#FFF8DC', text: '#7B5D0A' };
    case 'silver':
      return { primary: '#C0C0C0', dark: '#808080', light: '#F5F5F5', text: '#4A4A4A' };
    case 'bronze':
      return { primary: '#CD7F32', dark: '#8B4513', light: '#F5E6D3', text: '#5D3A1A' };
    case 'pass':
    default:
      return { primary: '#4A90E2', dark: '#2C5AA0', light: '#E3F2FD', text: '#1A3D7A' };
  }
}

export function generateCertificatePDF(_data: CertificateData): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}