import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../src/store/progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().reset();
  });

  it('addXP يزيد totalXP ويسجل النقاط في dailyXP', () => {
    useProgressStore.getState().addXP(10);
    const s = useProgressStore.getState();
    expect(s.totalXP).toBeGreaterThan(0);
    const dailyTotal = Object.values(s.dailyXP).reduce((a, b) => a + b, 0);
    expect(dailyTotal).toBeGreaterThan(0);
  });

  it('reset يعيد totalXP إلى الصفر', () => {
    useProgressStore.getState().addXP(10);
    useProgressStore.getState().reset();
    expect(useProgressStore.getState().totalXP).toBe(0);
  });
});