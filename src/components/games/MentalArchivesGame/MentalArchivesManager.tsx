// src/components/games/MentalArchivesGame/MentalArchivesManager.tsx
import React, { useState } from 'react';
import MentalArchivesEngine from './MentalArchivesEngine';
import { INTRO_DATA } from './data/introData';
import { LEVEL_1_DATA } from './data/level1Data';
import { Chapter, ChapterId, Scene } from './gameFlowTypes';
import { useProgressStore } from '@/store/progressStore';
import { useGameLang } from '../gamesI18n';
import { tUI } from './gameUI';

// تجميع الفصول المتاحة في كائن واحد
const CHAPTERS: Record<ChapterId, Chapter> = {
  intro: INTRO_DATA,
  level1: LEVEL_1_DATA,
} as Record<ChapterId, Chapter>;

export default function MentalArchivesManager({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const [activeChapterId, setActiveChapterId] = useState<ChapterId | null>(null);
  
  const mentalProgress = useProgressStore((s) => s.mentalArchivesProgress);
  const completeMentalChapter = useProgressStore((s) => s.completeMentalChapter);

  const handleComplete = (score: number) => {
    if (activeChapterId) {
      // 👇 إصلاح: نتأكد أولاً من نتيجة الطفل
      const chapter = CHAPTERS[activeChapterId];
      const challengeScene = chapter.scenes.find((s): s is Extract<Scene, { kind: 'challenge' }> => s.kind === 'challenge');
      
      // إذا كان هناك تحدي، نتحقق من النتيجة. إذا لم يكن (مثل التمهيد)، نعتبره ناجحاً.
      const isSuccess = challengeScene ? score >= challengeScene.requiredCorrect : true;
      
      if (isSuccess) {
        // حفظ التقدم فقط عند النجاح
        completeMentalChapter(activeChapterId, score);
      } else {
        // اختياري: يمكنك إظهار تنبيه أو رسالة إذا فشل الطفل
        console.log("لم يتم حفظ التقدم، الطفل لم يجتز التحدي.");
      }
      
      setActiveChapterId(null); // العودة لشاشة الخريطة
    }
  };

  // ═══ 1. شاشة اختيار المستويات (Level Map) ═══
  if (!activeChapterId) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6" dir={dir}>
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={onBack} 
            className="mb-8 text-amber-400 font-bold flex items-center gap-2 hover:text-amber-300 transition"
          >
            <span className={isAr ? 'ml-2' : 'mr-2 rotate-180'}>←</span>
            {tUI('backToGamesCity')}
          </button>
          
          {/* 👇 السطر الذي وعدتك بحفظه */}
          <h1 className="text-3xl font-black text-amber-400 mb-8 drop-shadow-lg">
            {tUI('gameTitle')}
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.values(CHAPTERS).map((chapter) => {
              const isCompleted = !!mentalProgress[chapter.id];
              const isUnlocked = chapter.requires.every(req => !!mentalProgress[req]);

              return (
                <div 
                  key={chapter.id}
                  onClick={() => isUnlocked && setActiveChapterId(chapter.id)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    isUnlocked 
                      ? 'border-amber-500/50 bg-slate-900 hover:bg-slate-800 hover:border-amber-400 cursor-pointer shadow-lg' 
                      : 'border-slate-800 bg-slate-900/50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <h2 className="text-xl font-bold mb-3">
                    {isAr ? chapter.titleAr : chapter.titleEn}
                  </h2>
                  
                  {isCompleted ? (
                    <span className="text-emerald-400 text-sm flex items-center gap-1">
                      ✅ {tUI('statusCompleted')} ({tUI('statusBestScore')}: {mentalProgress[chapter.id]?.bestScore})
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-amber-400 text-sm flex items-center gap-1">
                      ▶️ {tUI('statusAvailable')}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      🔒 {tUI('statusLocked')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══ 2. شاشة اللعب (المحرك) ═══
  return (
    <MentalArchivesEngine 
      key={activeChapterId} 
      chapter={CHAPTERS[activeChapterId]} 
      onComplete={handleComplete} 
      onBack={() => setActiveChapterId(null)} 
    />
  );
}