import { describe, it, expect } from 'vitest';
import { classifySpeed } from '../src/store/masteryBadgesStore';

describe('classifySpeed', () => {
  it('نسبة ≤ 0.5 = mastery', () => {
    expect(classifySpeed(500, 1000)).toBe('mastery');
    expect(classifySpeed(100, 1000)).toBe('mastery');
  });
  it('0.5 < نسبة ≤ 0.75 = accepted', () => {
    expect(classifySpeed(501, 1000)).toBe('accepted');
    expect(classifySpeed(750, 1000)).toBe('accepted');
  });
  it('نسبة > 0.75 = slow', () => {
    expect(classifySpeed(751, 1000)).toBe('slow');
    expect(classifySpeed(5000, 1000)).toBe('slow');
  });
  it('زمن الإجابة صفر أو سالب = accepted', () => {
    expect(classifySpeed(100, 0)).toBe('accepted');
    expect(classifySpeed(100, -5)).toBe('accepted');
  });
});