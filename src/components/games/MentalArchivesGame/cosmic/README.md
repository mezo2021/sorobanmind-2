# 🌌 Cosmic UI Components — Sorobanmind

هذا المجلد يحتوي على المكونات الكونية (Cosmic UI) لتطوير لعبة **بوابة الثقب الدودي**.

## 📂 المحتويات

- `CosmicBackground.tsx` — خلفية كونية بنجوم وسدم متحركة.
- `TiltCard.tsx` — بطاقات زجاجية بميل 3D.
- `WarpFlash.tsx` — تأثير وميض الثقب الدودي.
- `chapterThemes.ts` — هوية بصرية لكل مستوى.
- `ChapterTitleCard.tsx` — بطاقة افتتاح سينمائية.

## 🛠️ الاستخدام

```tsx
import { CosmicBackground } from '@/components/cosmic/CosmicBackground';
import { TiltCard } from '@/components/cosmic/TiltCard';

<CosmicBackground>
  <TiltCard>محتوى البطاقة</TiltCard>
</CosmicBackground>