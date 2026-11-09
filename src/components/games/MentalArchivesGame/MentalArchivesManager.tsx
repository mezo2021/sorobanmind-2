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
import { GraduationCap, Trophy, Swords, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import CosmicBackground, { CosmicHost } from '@/components/cosmic/CosmicBackground';
import TiltCard from '@/components/cosmic/TiltCard';
import RecordTicker from '@/components/RecordTicker';
import Leaderboard from '@/components/Leaderboard';
import CompetitionHub from './competition/CompetitionHub';
import { getTheme } from './ui/chapterThemes';
import { isPreviewMode } from '@/utils/previewMode';
import { cloudSync } from '@/lib/cloudSync'; // 🆕 استيراد السحابة

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
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showCompetition, setShowCompetition] = useState(false);

  const progress = useProgressStore((s) => s.mentalArchivesProgress);
  const completeChapter = useProgressStore((s) => s.completeMentalChapter);
  const childName = useProgressStore((s) => s.childName) || tUI('champion');

  const addXP = useProgressStore((s) => s.addXP);
  const totalXP = useProgressStore((s) => s.totalXP);

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
      return; 
    }

    const challengeScene = chapter.scenes.find((s): s is Extract<Scene, { kind: 'challenge' }> => s.kind === 'challenge');
    const isSuccess = challengeScene ? score >= challengeScene.requiredCorrect : true;

    if (isSuccess) {
      const wasCompleted = !!progress[activeChapterId];
      const previousBest = progress[activeChapterId]?.bestScore ?? 0;

      completeChapter(activeChapterId, score);
      const updatedProgress = useProgressStore.getState().mentalArchivesProgress;
      const totalScore = Object.values(updatedProgress).reduce((sum, ch) => sum + (ch?.bestScore || 0), 0);
      
      // الحفظ المحلي
      addScore('mental-archives', childName, totalScore, 'joud');

      // 🆕 الحفظ السحابي (فقط إذا كانت النتيجة أكبر من صفر)
      if (totalScore > 0) {
        void cloudSync.submitScore('mental-archives', totalScore, null);
      }

      if (!wasCompleted) {
        addXP(20);
      } else if (score > previousBest) {
        addXP(10);
      }
    }
    setActiveChapterId(null);
  };

  const view = ((): { key: string; node: React.ReactNode } => {
  if (showLeaderboard) return { key: 'leaderboard', node: <Leaderboard onBack={() => setShowLeaderboard(false)} /> };
  if (showCompetition) return { key: 'competition', node: <CompetitionHub onBack={() => setShowCompetition(false)} /> };
  if (showExams) return { key: 'exams', node: <MentalArchivesExams onBack={() => setShowExams(false)} /> };

  if (activeChapterId) {
    const chapter = CHAPTERS[activeChapterId];
    if (!chapter) return { key: 'none', node: null };
    return {
      key: `chapter-${activeChapterId}`,
      node: (
        <MentalArchivesEngine
          key={activeChapterId}
          chapter={chapter}
          onComplete={handleComplete}
          onBack={() => setActiveChapterId(null)}
        />
      ),
    };
  }

  const canAccessExams = preview || EXAM_PORTAL_PREREQ_CHAPTERS.every((id) => !!progress[id]);

  return {
    key: 'home',
    node: (
    <div className="relative min-h-screen text-white overflow-hidden" dir={dir}>
      <CosmicBackground />
      <div className="relative z-10"><RecordTicker /></div>
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <button onClick={onBack} className="mb-8 text-amber-400 font-bold flex items-center gap-2 hover:text-amber-300 transition">
          <span className={isAr ? 'ml-2' : 'mr-2 rotate-180'}>←</span>
          {tUI('backToGamesCity')}
        </button>
        
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-black text-amber-400 drop-shadow-[0_0_16px_rgba(251,191,36,0.55)]">
            {tUI('gameTitle')}
          </h1>
          <div className="flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/40 rounded-full py-1.5 px-3 text-sm font-black text-purple-300 shrink-0">
            <Sparkles className="w-4 h-4" />
            <Num>{totalXP}</Num>
            <span className="text-xs font-bold opacity-90">{isAr ? 'نقطة' : 'XP'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <TiltCard glow="#f59e0b" pulse onClick={() => setShowLeaderboard(true)} className="p-3">
            <div className="flex items-center gap-2"><Trophy className="w-6 h-6 text-amber-300" /><span className="font-black text-amber-200">{isAr ? 'لوحة الأبطال' : 'Champions'}</span></div>
          </TiltCard>
          <TiltCard glow="#38bdf8" pulse onClick={() => setShowCompetition(true)} className="p-3">
            <div className="flex items-center gap-2"><Swords className="w-6 h-6 text-sky-300" /><span className="font-black text-sky-200">{isAr ? 'ساحات المنافسة' : 'Arenas'}</span></div>
          </TiltCard>
        </div>

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
            const isUnlocked = preview || chapter.requires.every(req => !!progress[req]);
            const challengeScene = chapter.scenes.find((s): s is Extract<Scene, { kind: 'challenge' }> => s.kind === 'challenge');
            const hasChallenge = !!challengeScene;
            const totalQuestions = challengeScene?.questions.length ?? 0;

            const th = getTheme(chapter.id);
            return (
              <TiltCard
                key={chapter.id}
                glow={th.accent}
                pulse={isUnlocked && !isCompleted}
                disabled={!isUnlocked}
                onClick={() => setActiveChapterId(chapter.id)}
                className="p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{isUnlocked ? th.emoji : '🔒'}</span>
                  <h2 className="text-xl font-bold">{isAr ? chapter.titleAr : chapter.titleEn}</h2>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">📍 {isAr ? th.placeAr : th.placeEn}</p>

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
              </TiltCard>
            );
          })}
        </div>
      </div>
    </div>
    ),
  };
  })();

  return (
    <CosmicHost>
      <motion.div
        key={view.key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22 }}
        className="min-h-screen"
      >
        {view.node}
      </motion.div>
    </CosmicHost>
  );
}