// src/components/games/MentalArchivesGame/MentalArchivesExams.tsx
import React, { useState } from 'react';
import { useGameLang } from '../gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import { Num } from '@/components/Num';
import { ArrowRight, Lock, Play, Timer, GraduationCap, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import MentalArchivesExamRunner from './MentalArchivesExamRunner';
import { EXAM_10_7 } from './data/exams/exam10_7';
import { ChapterId } from './gameFlowTypes';
import { tUI } from './gameUI';

interface ExamMeta {
  id: string;
  nameAr: string;
  nameEn: string;
  questions: number;
  marks: number;
  minutes: number;
  requiresChapter?: ChapterId[];
  requiresExamPass?: string;
  isReady: boolean;
}

const EXAMS: ExamMeta[] = [
  { id: 'exam_10_7', nameAr: '10-7 كيو (ورقة مشتركة)', nameEn: '10-7 Kyu (Combined)', questions: 50, marks: 500, minutes: 12, requiresChapter: ['level1', 'level2'], isReady: true },
  { id: 'exam_6', nameAr: '6 كيو', nameEn: '6 Kyu', questions: 80, marks: 500, minutes: 12, requiresExamPass: 'exam_10_7', isReady: false },
  { id: 'exam_5_4', nameAr: '5-4 كيو (ورقة مشتركة)', nameEn: '5-4 Kyu (Combined)', questions: 80, marks: 500, minutes: 12, requiresExamPass: 'exam_6', isReady: false },
  { id: 'exam_3_2_1', nameAr: '3-2-1 كيو (ورقة مشتركة)', nameEn: '3-2-1 Kyu (Combined)', questions: 80, marks: 500, minutes: 12, requiresExamPass: 'exam_5_4', isReady: false },
];

export default function MentalArchivesExams({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [mode, setMode] = useState<'training' | 'exam'>('exam');
  const [isRunning, setIsRunning] = useState(false);

  const progress = useProgressStore((s) => s.mentalArchivesProgress);
  const examResults = useProgressStore((s) => s.mentalArchivesExams);

  const isExamUnlocked = (exam: ExamMeta): boolean => {
    if (exam.requiresChapter) return exam.requiresChapter.every(ch => !!progress[ch]);
    if (exam.requiresExamPass) return examResults[exam.requiresExamPass]?.passed || false;
    return false;
  };

  const selectedExam = EXAMS.find(e => e.id === selectedExamId) || null;

  if (isRunning && selectedExamId === 'exam_10_7') {
    return (
      <MentalArchivesExamRunner 
        examData={EXAM_10_7} 
        mode={mode} 
        onExit={() => { setIsRunning(false); setSelectedExamId(null); }} 
      />
    );
  }

  // ═══ 1. قائمة الامتحانات ═══
  if (!selectedExamId) {
    return (
      <div className="min-h-screen bg-[#060a12] text-white p-6 relative overflow-hidden" dir={dir}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <button onClick={onBack} className="mb-8 text-amber-400 font-bold flex items-center gap-2 hover:text-amber-300 transition group">
            <ArrowRight className={`w-5 h-5 transition-transform group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} />
            {tUI('backToMap')}
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <GraduationCap className="w-10 h-10 text-slate-950" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100">
                {tUI('examsTitle')}
              </h1>
              <p className="text-sm text-emerald-200/60 mt-1">{tUI('examsSubtitle')}</p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl mb-8 flex items-start gap-3 backdrop-blur-sm">
            <span className="text-2xl">💡</span>
            <p className="text-sm text-amber-200/90 leading-relaxed">
              {tUI('examTip')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXAMS.map((exam, idx) => {
              const unlocked = isExamUnlocked(exam);
              const best = examResults[exam.id] || null;
              const isReady = exam.isReady;

              return (
                <motion.div 
                  key={exam.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => (unlocked && isReady) ? setSelectedExamId(exam.id) : null}
                  className={`relative p-6 rounded-3xl border-2 transition-all duration-300 backdrop-blur-md overflow-hidden flex flex-col justify-between min-h-[180px]
                    ${unlocked && isReady 
                      ? 'border-amber-400/80 bg-gradient-to-br from-slate-800/80 to-slate-900/90 hover:border-amber-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.4)] cursor-pointer' 
                      : unlocked && !isReady
                        ? 'border-slate-600 bg-slate-800/40 opacity-90 cursor-not-allowed'
                        : 'border-slate-800 bg-slate-900/40 opacity-70 cursor-not-allowed'}
                  `}
                >
                  {unlocked && isReady && (
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
                  )}

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className={`font-black text-xl mb-1 ${unlocked && isReady ? 'text-amber-300' : unlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                        {isAr ? exam.nameAr : exam.nameEn}
                      </h3>
                    </div>
                    {!unlocked ? (
                      <Lock className="w-5 h-5 text-slate-600" />
                    ) : !isReady ? (
                      <span className="text-[10px] bg-amber-900/40 text-amber-300 px-2 py-1 rounded-md border border-amber-500/30 whitespace-nowrap">
                        {tUI('comingSoon')}
                      </span>
                    ) : (
                      <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300 font-medium relative z-10">
                    <div className="flex items-center gap-1.5 bg-slate-950/50 px-2 py-1 rounded-lg">
                      <span className="text-emerald-400 font-bold"><Num>{exam.questions}</Num></span> {isAr ? 'سؤال' : 'Q'}
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/50 px-2 py-1 rounded-lg">
                      <Timer className="w-3.5 h-3.5 text-amber-400" />
                      <Num>{exam.minutes}</Num> {isAr ? 'د' : 'm'}
                    </div>
                  </div>

                  {best && (
                    <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center relative z-10">
                      <span className="text-xs text-slate-400">{tUI('examBest')}</span>
                      <span className={`font-mono font-bold ${best.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <Num>{best.score}</Num> / <Num>{best.totalMarks}</Num>
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══ 2. إعداد الامتحان المحدد ═══
  return (
    <div className="min-h-screen bg-[#060a12] text-white p-6 relative overflow-hidden flex flex-col justify-center" dir={dir}>
       <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-2xl mx-auto w-full relative z-10">
        <button onClick={() => setSelectedExamId(null)} className="mb-6 text-amber-400 font-bold flex items-center gap-2 hover:text-amber-300 transition group">
          <ArrowRight className={`w-5 h-5 transition-transform group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} />
          {tUI('backToExams')}
        </button>

        <div className="bg-slate-900/80 border border-amber-400/50 shadow-[0_0_40px_rgba(168,85,247,0.2)] p-8 rounded-[2rem] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2">
              {isAr ? selectedExam?.nameAr : selectedExam?.nameEn}
            </h2>
            <p className="text-sm text-slate-400">{tUI('fullSimulation')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-950/50 p-4 rounded-2xl text-center border border-slate-800">
              <p className="text-xs text-slate-500 mb-1">{tUI('examQuestions')}</p>
              <p className="text-2xl font-black text-emerald-400"><Num>{selectedExam?.questions}</Num></p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl text-center border border-slate-800">
              <p className="text-xs text-slate-500 mb-1">{tUI('examMarks')}</p>
              <p className="text-2xl font-black text-emerald-400"><Num>{selectedExam?.marks}</Num></p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl text-center border border-slate-800">
              <p className="text-xs text-slate-500 mb-1">{tUI('examTime')}</p>
              <p className="text-2xl font-black text-amber-400"><Num>{selectedExam?.minutes}</Num>m</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl text-center border border-slate-800">
              <p className="text-xs text-slate-500 mb-1">{tUI('examPass')}</p>
              <p className="text-2xl font-black text-emerald-400"><Num>400</Num></p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-bold text-slate-300 mb-3">{isAr ? 'اختر الوضع:' : 'Choose mode:'}</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setMode('training')} 
                className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group
                  ${mode === 'training' 
                    ? 'border-slate-400 bg-slate-800 shadow-[0_0_20px_rgba(148,163,184,0.2)]' 
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/80'}`}
              >
                <BookOpen className={`w-8 h-8 ${mode === 'training' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="font-bold text-lg">{tUI('examTraining')}</span>
                <span className="text-[10px] text-slate-400 text-center leading-tight">{tUI('examTrainingDesc')}</span>
              </button>
              
              <button 
                onClick={() => setMode('exam')} 
                className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 relative overflow-hidden group
                  ${mode === 'exam' 
                    ? 'border-emerald-500 bg-emerald-900/40 shadow-[0_0_25px_rgba(16,185,129,0.3)]' 
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/80'}`}
              >
                {mode === 'exam' && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>}
                <Timer className={`w-8 h-8 relative z-10 ${mode === 'exam' ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className={`font-bold text-lg relative z-10 ${mode === 'exam' ? 'text-emerald-300' : ''}`}>{tUI('examMode')}</span>
                <span className={`text-[10px] text-center leading-tight relative z-10 ${mode === 'exam' ? 'text-emerald-400/80' : 'text-slate-400'}`}>{tUI('examModeDesc')}</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => setIsRunning(true)} 
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xl shadow-[0_0_30px_rgba(168,85,247,0.6)] flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <Play className="w-7 h-7 fill-current" />
            {tUI('startExam')}
          </button>
        </div>
      </div>
    </div>
  );
}
