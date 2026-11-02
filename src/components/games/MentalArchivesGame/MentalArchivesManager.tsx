// src/components/games/MentalArchivesGame/MentalArchivesManager.tsx
import React, { useState } from 'react';
import MentalArchivesEngine from './MentalArchivesEngine';
import { INTRO_DATA } from './data/introData';
import { LEVEL_1_DATA } from './data/level1Data';

export default function MentalArchivesManager({ onBack }: { onBack: () => void }) {
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    const saved = localStorage.getItem('mental_archives_max_level');
    return saved ? parseInt(saved) : 0;
  });

  const handleComplete = () => {
    const nextLevel = currentLevel + 1;
    // إذا انتهت المستويات المتاحة حالياً، نعود للقائمة
    if (nextLevel > 1) { 
      onBack();
      return;
    }
    localStorage.setItem('mental_archives_max_level', nextLevel.toString());
    setCurrentLevel(nextLevel);
  };

  const getLevelData = () => {
    switch (currentLevel) {
      case 0: return INTRO_DATA;
      case 1: return LEVEL_1_DATA;
      default: return INTRO_DATA;
    }
  };

  return (
    <MentalArchivesEngine 
      key={currentLevel} // 👈 السر هنا: هذا السطر يجبر المحرك على إعادة التشغيل من الصفر
      levelData={getLevelData()} 
      onComplete={handleComplete} 
      onBack={onBack} 
    />
  );
}