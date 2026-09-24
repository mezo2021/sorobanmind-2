// src/components/soroban2d5/useBeadHaptics.ts
import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'double' | 'error' | 'success';

const PATTERNS: Record<HapticType, number | number[]> = {
  light: 8,
  medium: 15,
  heavy: 30,
  double: [10, 40, 10],
  error: [30, 20, 30, 20, 30],
  success: [10, 30, 10, 30, 10, 30, 20],
};

export function useBeadHaptics() {
  return useCallback((type: HapticType) => {
    if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
    if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) return;
    navigator.vibrate(PATTERNS[type]);
  }, []);
}