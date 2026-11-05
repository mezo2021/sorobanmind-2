// src/components/games/MentalArchivesGame/MentalArchivesManager.tsx
import React, { useState, useEffect } from 'react';
import MentalArchivesEngine from './MentalArchivesEngine';
import MentalArchivesExams from './MentalArchivesExams';
import { INTRO_DATA } from './data/introData';
import { LEVEL_1_DATA } from './data/level1Data';
import { LEVEL_2_DATA } from './data/level2Data';
import { LEVEL_3_DATA } from './data/level3Data';
import { LEVEL_4_DATA } from './data/level4Data';
import { LEVEL_5_DATA } from './data/level5Data';
import { LEVEL_6_DATA } from './data/level6Data';
import { LEVEL_7_DATA } from './data/level7Data';
import { LEVEL_8_DATA } from './data/level8Data';
import { Chapter, ChapterId, Scene } from './gameFlowTypes';
import { addScore } from '../highScoreStore';
import { useProgressStore } from '@/store/progressStore';
import { useGameLang } from '../gamesI18n';
import { tUI } from './gameUI';
import { Num } from '@/components/Num';
import { GraduationCap } from 'lucide-react';
import { isPreviewMode } from '@/utils/previewMode';

const CHAPTERS: Partial<Record<ChapterId, Chapter>> = {
  intro: INTRO_DATA,
  level1: LEVEL_1_DATA,
  level2: LEVEL_2_DATA,
  level3: LEVEL_3_DATA,
  level4: LEVEL_4_DATA,
  level5: LEVEL_5_DATA,
  level6: LEVEL_6_DATA,
  level7: LEVEL_7_DATA,
  level8: LEVEL_8_DATA,
};

const EXAM_PORTAL_PREREQ_CHAPTERS: ChapterId[] = ['level1', 'level2'];

export default function MentalArchivesManager({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const [activeChapterId, setActiveChapterId] = useState<ChapterId | null>(null);
  const [showExams, setShowExams] = useState(false);

  const progress = useProgressStore((s) => s.mentalArchivesProgress);
  const completeChapter = useProgressStore((s) => s.completeMentalChapter);
  const childName = useProgressStore((s) => s.childName) || tUI('champion');

  const preview = isPreviewMode();

  useEffect(() => {
    if (activeChapterId && !CHAPTERS[activeChapterId]) {
      setActiveChapterId(null);
    }
  }, [activeChapterId]);

  const handleComplete = (score: number) => {
    if (!activeChapterId) return;
    const chapter = CHAPTERS[activeChapterId];
    if (!chapter) return;

    if (preview) {
      setActiveChapterId(null);
      return; // 🆕 منع حفظ التقدم في المعاينة
    }

    const challengeScene = chapter.scenes.find((s): s is Extract<Scene, { kind: 'challenge' }> => s.kind === 'challenge');
    const isSuccess = challengeScene ? score >= challengeScene.requiredCorrect : true;

    if (isSuccess) {
      completeChapter(activeChapterId, score);
      const updatedProgress = useProgressStore.getState().mentalArchivesProgress;
      const totalScore = Object.values(updatedProgress).reduce((sum, ch) => sum + (ch?.bestScore || 0), 0);
      addScore('mental-archives', childName, totalScore, 'joud');
    }
    setActiveChapterId(null);
  };

  if (showExams) {
    return <MentalArchivesExams onBack={() => setShowExams(false)} />;
  }

  if (activeChapterId) {
    const chapter = CHAPTERS[activeChapterId];
    if (!chapter) return null;
    return (
      <MentalArchivesEngine 
        key={activeChapterId} 
        chapter={chapter} 
        onComplete={handleComplete} 
        onBack={() => setActiveChapterId(null)} 
      />
    );
  }

  // 🆕 تفعيل المعاينة لبوابة الامتحانات
  const canAccessExams = preview || EXAM_PORTAL_PREREQ_CHAPTERS.every((id) => !!progress[id]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 text-amber-400 font-bold flex items-center gap-2 hover:text-amber-300 transition">
          <span className={isAr ? 'ml-2' : 'mr-2 rotate-180'}>←</span>
          {tUI('backToGamesCity')}
        </button>
        
        <h1 className="text-3xl font-black text-amber-400 mb-8 drop-shadow-lg">
          {tUI('gameTitle')}
        </h1>

        <div className="mb-6">
          <button
            onClick={() => canAccessExams && setShowExams(true)}
            disabled={!canAccessExams}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
              canAccessExams
                ? 'border-purple-500/50 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-800/50 hover:to-indigo-800/50 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                : 'border-slate-800 bg-slate-900/50 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${canAccessExams ? 'bg-purple-500/20' : 'bg-slate-800'}`}>
                <GraduationCap className={`w-6 h-6 ${canAccessExams ? 'text-purple-400' : 'text-slate-500'}`} />
              </div>
              <div className="text-right">
                <h3 className={`font-bold text-lg ${canAccessExams ? 'text-amber-300' : 'text-slate-400'}`}>
                  {isAr ? 'قسم الامتحانات (كيو)' : 'Kyu Exams'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'محاكاة رسمية لامتحانات نيشورين' : 'Official Nishuren simulation'}
                </p>
              </div>
            </div>
            {!canAccessExams && (
              <span className="text-xs text-slate-500 font-bold">
                {isAr ? `أكمل ${EXAM_PORTAL_PREREQ_CHAPTERS.length} مستويات` : `Finish ${EXAM_PORTAL_PREREQ_CHAPTERS.length} levels`}
              </span>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(Object.values(CHAPTERS).filter((c): c is Chapter => c !== undefined)).map((chapter) => {
            const isCompleted = !!progress[chapter.id];
            const isUnlocked = preview || chapter.requires.every(req => !!progress[req]); // 🆕 تفعيل المعاينة للمستويات
            const challengeScene = chapter.scenes.find((s): s is Extract<Scene, { kind: 'challenge' }> => s.kind === 'challenge');
            const hasChallenge = !!challengeScene;
            const totalQuestions = challengeScene?.questions.length ?? 0;

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
                        {' '}({tUI('statusBestScore')}: <Num>{progress[chapter.id]?.bestScore}</Num> / <Num>{totalQuestions}</Num>)
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