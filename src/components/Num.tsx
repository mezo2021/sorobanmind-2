// src/components/Num.tsx
// 🔢 يعرض الأرقام حسب زر تبديل الأرقام (عربي ٠١٢٣ ↔ لاتيني 0123)
// الاستخدام:  <Num>{score}</Num>   أو   <Num>{a} + {b}</Num>
// يشترك في useNumberStyleStore ويتحدّث فورًا عند التبديل.

import { Children, type ReactNode } from 'react';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatText } from '@/utils/numberStyle';

export function Num({ children }: { children?: ReactNode }) {
  const style = useNumberStyleStore((s) => s.style);
  return (
    <>
      {Children.map(children, (c) =>
        typeof c === 'number' || typeof c === 'string' ? formatText(String(c), style) : c,
      )}
    </>
  );
}

export default Num;
