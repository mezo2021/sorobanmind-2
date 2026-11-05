// src/components/games/MentalArchivesGame/competition/compMath.ts
// مولّد أسئلة للمنافسات (ميتوري جمع) + تنسيق مشترك.
export interface CompQuestion { id: string; numbers: number[]; answer: number }

const ri = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

export function genQuestion(level: 1 | 2 | 3): CompQuestion {
  let numbers: number[];
  if (level === 1) numbers = [ri(1, 9), ri(1, 9), ri(1, 9)];
  else if (level === 2) numbers = [ri(10, 49), ri(10, 49), ri(1, 9), ri(1, 9)];
  else {
    do { numbers = [ri(100, 399), ri(100, 399), ri(10, 99)]; } while (numbers.reduce((a, b) => a + b, 0) > 999);
  }
  return { id: Math.random().toString(36).slice(2, 9), numbers, answer: numbers.reduce((a, b) => a + b, 0) };
}

export const genSet = (n: number, level: 1 | 2 | 3) => Array.from({ length: n }, () => genQuestion(level));

export function useVibrate() {
  return (ms: number | number[]) => { try { navigator.vibrate?.(ms); } catch { /* noop */ } };
}
