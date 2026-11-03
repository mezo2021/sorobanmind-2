// src/components/games/MentalArchivesGame/MentalArchivesManager.tsx
import React, { useState } from 'react';
import MentalArchivesEngine from './MentalArchivesEngine';
import MentalArchivesExams from './MentalArchivesExams';
import { INTRO_DATA } from './data/introData';
import { LEVEL_1_DATA } from './data/level1Data';
import { LEVEL_2_DATA } from './data/level2Data';
import { Chapter, ChapterId, Scene } from './gameFlowTypes';
import { addScore } from '../highScoreStore';
import { useProgressStore } from '@/store/progressStore';
import { useGameLang } from '../gamesI18n';
import { tUI } from './gameUI';
import { Num } from '@/components/Num';
import { GraduationCap } from 'lucide-react';

const CHAPTERS: Record<ChapterId, Chapter> = {
  intro: INTRO_DATA,
  level1: LEVEL_1_DATA,
  level2: LEVEL_2_DATA,
} as Record<ChapterId, Chapter>;

export default function MentalArchivesManager({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const [activeChapterId, setActiveChapterId] = useState<ChapterId | null>(null);
  const [showExams, setShowExams] = useState(false);

  const progress = useProgressStore((s) => s.mentalArchivesProgress);
  const completeChapter = useProgressStore((s) => s.completeMentalChapter);
  const childName = useProgressStore((s) => s.childName) || tUI('champion');

  const handleComplete = (score: number) => {
    if (activeChapterId) {
      const chapter = CHAPTERS[activeChapterId];
      const challengeScene = chapter.scenes.find((s): s is Extract<Scene, { kind: 'challenge' }> => s.kind === 'challenge');
      const isSuccess = challengeScene ? score >= challengeScene.requiredCorrect : true;
      
      if (isSuccess) {
        completeChapter(activeChapterId, score);
        const updatedProgress = useProgressStore.getState().mentalArchivesProgress;
        const totalScore = Object.values(updatedProgress).reduce((sum, ch) => sum + (ch?.bestScore || 0), 0);
        addScore('mental-archives', childName, totalScore, 'joud');
      }
      setActiveChapterId(null);
    }
  };

  // ═══ شاشة الامتحانات ═══
  if (showExams) {
    return <MentalArchivesExams onBack={() => setShowExams(false)} />;
  }

  // ═══ شاشة اللعب (المحرك) ═══
  if (activeChapterId) {
    return (
      <MentalArchivesEngine 
        key={activeChapterId} 
        chapter={CHAPTERS[activeChapterId]} 
        onComplete={handleComplete} 
        onBack={() => setActiveChapterId(null)} 
      />
    );
  }

  // ═══ شاشة الخريطة ═══
  // شرط فتح الامتحانات: إكمال المستوى 1 و 2
  const canAccessExams = !!progress['level1'] && !!progress['level2'];

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

        {/* 👇 زر الامتحانات */}
        <div className="mb-6">
          <button
            onClick={() => canAccessExams && setShowExams(true)}
            disabled={!canAccessExams}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
              canAccessExams
                ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 hover:from-emerald-800/50 hover:to-teal-800/50 cursor-pointer shadow-lg'
                : 'border-slate-800 bg-slate-900/50 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${canAccessExams ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                <GraduationCap className={`w-6 h-6 ${canAccessExams ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>
              <div className="text-right">
                <h3 className={`font-bold text-lg ${canAccessExams ? 'text-emerald-300' : 'text-slate-400'}`}>
                  {isAr ? 'قسم الامتحانات (كيو)' : 'Kyu Exams'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'محاكاة رسمية لامتحانات نيشورين' : 'Official Nishuren simulation'}
                </p>
              </div>
            </div>
            {!canAccessExams && (
              <span className="text-xs text-slate-500 font-bold">
                {isAr ? 'أكمل المستوى 1 و 2' : 'Finish Level 1 & 2'}
              </span>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(CHAPTERS).map((chapter) => {
            const isCompleted = !!progress[chapter.id];
            const isUnlocked = chapter.requires.every(req => !!progress[req]);
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
                    {hasChallenge && (
                      <span>
                        {' '}({tUI('statusBestScore')}: <Num>{progress[chapter.id]?.bestScore}</Num>)
                      </span>
                    )}
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