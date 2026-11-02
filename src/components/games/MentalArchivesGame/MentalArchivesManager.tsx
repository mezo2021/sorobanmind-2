// src/components/games/MentalArchivesGame/MentalArchivesManager.tsx
import React, { useState } from 'react';
import MentalArchivesEngine from './MentalArchivesEngine';
import { INTRO_DATA } from './data/introData';
import { LEVEL_1_DATA } from './data/level1Data';

export default function MentalArchivesManager({ onBack }: { onBack: () => void }) {
  // نقرأ تقدم اللاعب من الـ localStorage (0 = التمهيد، 1 = المستوى الأول، 2 = الثاني...)
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    const saved = localStorage.getItem('mental_archives_max_level');
    return saved ? parseInt(saved) : 0;
  });

  const handleComplete = () => {
    // عند إكمال المستوى، ننتقل للمستوى التالي
    const nextLevel = currentLevel + 1;
    localStorage.setItem('mental_archives_max_level', nextLevel.toString());
    setCurrentLevel(nextLevel);
  };

  const getLevelData = () => {
    switch (currentLevel) {
      case 0: return INTRO_DATA;
      case 1: return LEVEL_1_DATA;
      // هنا سنضيف المستويات القادمة:
      // case 2: return LEVEL_2_DATA;
      // case 3: return LEVEL_3_DATA;
      default: return INTRO_DATA; // افتراضي
    }
  };

  return (
    <MentalArchivesEngine 
      levelData={getLevelData()} 
      onComplete={() => {
        if (currentLevel === 0) {
          // إذا كان تمهيد، ننتقل للمستوى الأول
          handleComplete();
        } else {
          // إذا كان مستوى عادي، نعود للقائمة
          onBack(); // أو تفتح واجهة المستوى التالي
        }
      }} 
      onBack={onBack} 
    />
  );
}