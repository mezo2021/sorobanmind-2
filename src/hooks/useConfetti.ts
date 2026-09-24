// src/hooks/useConfetti.ts
import confetti from 'canvas-confetti';
import { useCallback } from 'react';

export function useConfetti() {
  const burst = useCallback((x = 0.5, y = 0.5) => {
    const colors = ['#a855f7', '#3b82f6', '#10b981', '#fbbf24', '#f472b6'];
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x, y },
      colors,
      startVelocity: 35,
      gravity: 0.8,
      scalar: 1.1,
    });
  }, []);

  const celebrate = useCallback(() => {
    const colors = ['#a855f7', '#3b82f6', '#10b981', '#fbbf24', '#f472b6'];
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return { burst, celebrate };
}