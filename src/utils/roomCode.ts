// src/utils/roomCode.ts
// رمز غرفة من 4 أرقام (1000-9999).
import { toLatinDigits } from '@/utils/numberStyle';

export function generateRoomCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function isValidRoomCode(code: string): boolean {
  return /^[1-9]\d{3}$/.test(code);
}

/** يقبل أرقاماً عربية/لاتينية ويُرجع حتى 4 أرقام لاتينية */
export function normalizeRoomCode(input: string): string {
  return toLatinDigits(input).replace(/\D/g, '').slice(0, 4);
}
