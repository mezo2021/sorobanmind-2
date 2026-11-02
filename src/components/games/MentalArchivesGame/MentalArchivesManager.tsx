// src/components/games/MentalArchivesGame/MentalArchivesManager.tsx
import React, { useState } from 'react';
import MentalArchivesEngine from './MentalArchivesEngine';
import { INTRO_DATA } from './data/introData';
import { LEVEL_1_DATA } from './data/level1Data';
import { Chapter, ChapterId, Scene } from './gameFlowTypes';
// 👇 استبدلنا progressStore بالمتجر المحلي الجديد
import { useMentalArchivesStore } from './mentalArchivesStore';
// 👇 استيراد دالة حفظ الرقم القياسي
import { addScore } from '../highScoreStore';
// 👇 نستخدم progressStore فقط لجلب اسم الطفل (للرقم القياسي)
import { useProgressStore } from '@/store/progressStore';
import { useGameLang } from '../gamesI18n';
import { tUI } from './gameUI';

const CHAPTERS: Record<ChapterId, Chapter> = {
  intro: INTRO_DATA,
  level1: LEVEL_1_DATA,
} as Record<ChapterId, Chapter>;

export default function MentalArchivesManager({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const [activeChapterId, setActiveChapterId] = useState<ChapterId | null>(null);
  
  // 👇 استخدام المتجر المحلي الجديد
  const progress = useMentalArchivesStore((s) => s.progress);
  const completeChapter = useMentalArchivesStore((s) => s.completeChapter);
  
  // 👇 اسم الطفل من المتجر المركزي (لحفظ الرقم القياسي باسمه)
  const childName = useProgressStore((s) => s.childName) || tUI('champion');

  const handleComplete = (score: number) => {
    if (activeChapterId) {
      const chapter = CHAPTERS[activeChapterId];
      const challengeScene = chapter.scenes.find((s): s is Extract<Scene, { kind: 'challenge' }> => s.kind === 'challenge');
      
      const isSuccess = challengeScene ? score >= challengeScene.requiredCorrect : true;
      
      if (isSuccess) {
        // 1. حفظ نتيجة الفصل في المتجر المحلي (لفتح الفصل التالي)
        completeChapter(activeChapterId, score);
        
        // 2. حساب المجموع الكلي لكل الفصول (للرقم القياسي في القائمة الخارجية)
        const updatedProgress = useMentalArchivesStore.getState().progress;
        const totalScore = Object.values(updatedProgress).reduce(
          (sum, ch) => sum + (ch?.bestScore || 0),
          0
        );
        
        // 3. حفظ المجموع الكلي في highScoreStore (يظهر في القائمة الخارجية)
        addScore('mental-archives', childName, totalScore, 'joud');
      }
      
      setActiveChapterId(null);
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
          
          <h1 className="text-3xl font-black text-amber-400 mb-8 drop-shadow-lg">
            {tUI('gameTitle')}
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.values(CHAPTERS).map((chapter) => {
              const isCompleted = !!progress[chapter.id];
              const isUnlocked = chapter.requires.every(req => !!progress[req]);
              // 👇 هل هذا الفصل يحتوي على تمرين؟
              const hasChallenge = chapter.scenes.some(s => s.kind === 'challenge');

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
                      ✅ {tUI('statusCompleted')}
                      {/* 👇 نعرض النتيجة فقط إذا كان هناك تمرين */}
                      {hasChallenge && ` (${tUI('statusBestScore')}: ${progress[chapter.id]?.bestScore})`}
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