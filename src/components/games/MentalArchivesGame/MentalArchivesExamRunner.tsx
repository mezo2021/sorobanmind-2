// src/components/games/MentalArchivesGame/MentalArchivesExamRunner.tsx
import React, { useState, useEffect, useRef } from 'react';
import { KyuExamData } from './data/exams/examTypes';
import { useProgressStore } from '@/store/progressStore';
import { Num } from '@/components/Num';
import { useGameLang } from '../gamesI18n';
import { Timer, ArrowRight, CheckCircle2, XCircle, Home, Printer, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { tUI } from './gameUI';
import RelicKeypad from './ui/RelicKeypad';

import logoImg from '@/assets/logo.webp'; // ✅ تأكد من مسار اللوجو

interface Props {
  examData: KyuExamData;
  mode: 'training' | 'exam';
  onExit: () => void;
}

export default function MentalArchivesExamRunner({ examData, mode, onExit }: Props) {
  const { dir, isAr } = useGameLang();
  const recordResult = useProgressStore((s) => s.recordMentalExam);

  const allQuestions = examData.sections.flatMap((sec, sIdx) => 
    sec.questions.map((q, qIdx) => ({ ...q, sectionIndex: sIdx, points: sec.pointsPerQuestion }))
  );

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answersRef = useRef<Record<string, string>>({}); 
  
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(examData.timeLimitSeconds);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const activeCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (mode === 'training' || isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, isFinished]);

  const handleKeypadChange = (newVal: string) => {
    if (isFinished) return;
    const qId = allQuestions[activeIndex].id;
    setAnswers((prev) => ({ ...prev, [qId]: newVal }));
  };

  const nextQuestion = () => {
    if (activeIndex < allQuestions.length - 1) setActiveIndex(activeIndex + 1);
  };
  const prevQuestion = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleSubmit = (force = false) => {
    if (!force) {
      if (!window.confirm(tUI('confirmFinishMsg'))) return;
    }
    if (isSubmitting || isFinished) return;
    setIsSubmitting(true);

    let score = 0;
    const currentAnswers = answersRef.current;

    examData.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const userAnswer = currentAnswers[q.id];
        if (userAnswer && parseInt(userAnswer) === q.answer) {
          score += sec.pointsPerQuestion;
        }
      });
    });

    let grade = undefined;
    const passed = mode === 'exam' && score >= examData.passingScore;

    if (examData.gradeThresholds) {
      for (const th of examData.gradeThresholds) {
        if (score >= th.score) {
          grade = th.grade;
          break;
        }
      }
    }

    recordResult(examData.id, {
      score,
      totalMarks: examData.totalMarks,
      passed,
      grade,
      mode,
      completedAt: Date.now(),
    });

    setIsFinished(true);
    setIsSubmitting(false);
  };

  const getOperator = (type: string) => {
    if (type === 'multiplication') return '×';
    if (type === 'division') return '÷';
    if (type === 'subtraction') return '-';
    return '+';
  };

  // ═══ شاشة النتائج وسجل التصحيح ═══
  if (isFinished) {
    let score = 0;
    examData.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const userAnswer = answersRef.current[q.id];
        if (userAnswer && parseInt(userAnswer) === q.answer) {
          score += sec.pointsPerQuestion;
        }
      });
    });
    
    const isExamMode = mode === 'exam';
    const passed = isExamMode && score >= examData.passingScore;
    const earnedGrade = examData.gradeThresholds?.find(th => score >= th.score)?.grade;

    let trainMessage = '';
    if (!isExamMode) {
      if (score >= 400) trainMessage = tUI('trainReadyL7');
      else if (score >= 350) trainMessage = tUI('trainNeedL8');
      else if (score >= 300) trainMessage = tUI('trainNeedL9');
      else if (score >= 250) trainMessage = tUI('trainNeedL10');
      else trainMessage = tUI('trainNeedMore');
    }

    if (showReview) {
      return (
        <div className="min-h-screen bg-[#060a12] text-white p-4 md:p-8" dir={dir}>
          <style>{`
            @media print {
              body { background: white !important; color: black !important; }
              .print-hidden { display: none !important; }
              .print-page { 
                padding: 0; 
                max-width: 100%; 
                box-shadow: none !important; 
                border: none !important;
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
              }
              .print-card { page-break-inside: avoid; }
            }
          `}</style>

          <div className="max-w-4xl mx-auto print-page">
            
            <div className="hidden print:flex flex-col items-center justify-center mb-8 text-center border-b-2 border-amber-500 pb-6">
              <img src={logoImg} alt="Academy Logo" className="w-24 h-24 mb-2 object-contain" />
              <h1 className="text-2xl font-black text-black mb-1">أكاديمية السوروبان الدولية</h1>
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-widest">International Soroban Academy</h2>
              <p className="text-xs text-gray-500 mt-2">{isAr ? 'ورقة تدريب' : 'Training Paper'}</p>
            </div>

            <div className="flex justify-between items-center mb-6 print-hidden">
              <button onClick={() => setShowReview(false)} className="flex items-center gap-2 text-amber-400 font-bold hover:text-amber-300">
                <ArrowRight className={`w-5 h-5 ${isAr ? '' : 'rotate-180'}`} />
                {tUI('backToExamsList')}
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 transition">
                <Printer className="w-4 h-4 text-emerald-400" />
                {tUI('printPaper')}
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 print:border-none print:bg-white print:text-black">
              <div className="text-center mb-8 border-b border-slate-700 print:border-black pb-6">
                <h1 className="text-2xl font-black text-amber-400 print:text-black mb-2 print:hidden">
                  {tUI('printTitle')}
                </h1>
                <div className="flex justify-center gap-6 text-sm text-slate-400 print:text-gray-800 font-bold">
                  <span>{tUI('finalScore')}: <strong className="text-emerald-400 print:text-green-700"><Num>{score}</Num> / <Num>{examData.totalMarks}</Num></strong></span>
                  <span>{isAr ? 'الوضع' : 'Mode'}: <strong className="text-amber-400 print:text-black">{isExamMode ? tUI('examMode') : tUI('examTraining')}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allQuestions.map((q, idx) => {
                  const userAnswer = answersRef.current[q.id];
                  const isCorrect = userAnswer && parseInt(userAnswer) === q.answer;
                  
                  return (
                    <div key={q.id} className={`print-card p-4 rounded-xl border-2 flex flex-col gap-2
                      ${isCorrect ? 'border-emerald-500/50 bg-emerald-900/20 print:border-green-600 print:bg-green-50' : ''}
                      ${!isCorrect ? 'border-rose-500/50 bg-rose-900/20 print:border-red-600 print:bg-red-50' : ''}
                    `}>
                      <div className="flex justify-between items-center text-xs text-slate-400 print:text-gray-600 border-b border-slate-700/50 print:border-gray-300 pb-2 mb-1">
                        <span>{tUI('question')} <Num>{idx + 1}</Num></span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-green-600" />}
                        {!isCorrect && <XCircle className="w-4 h-4 text-rose-400 print:text-red-600" />}
                      </div>
                      
                      <div className="flex flex-col items-center font-mono my-2 text-lg print:text-black">
                        {q.numbers.map((num, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span><Num>{num}</Num></span>
                            {i < q.numbers.length - 1 && <span className="text-xs opacity-50">{getOperator(q.type)}</span>}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between text-sm mt-2 pt-2 border-t border-slate-700/50 print:border-gray-300">
                        <span className="text-slate-400 print:text-gray-700 font-bold">{tUI('yourAnswer')}:</span>
                        <span className={`font-bold ${isCorrect ? 'text-emerald-400 print:text-green-700' : 'text-rose-400 print:text-red-700'}`}>
                          {userAnswer ? <Num>{userAnswer}</Num> : <span className="text-slate-500 print:text-gray-500">{tUI('notAnswered')}</span>}
                        </span>
                      </div>
                      
                      {!isCorrect && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400 print:text-gray-700 font-bold">{tUI('correctAnswer')}:</span>
                          <span className="font-bold text-emerald-400 print:text-green-700"><Num>{q.answer}</Num></span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="hidden print:flex justify-between items-end mt-12 pt-8 border-t border-gray-300 text-black">
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-600">تصميم البرنامج</p>
                  <p className="font-black text-lg mt-6">{isAr ? 'مصطفى علي اكر' : 'Mustafa Ali Eker'}</p>
                </div>
                
                <div className="text-center">
                  <img src={logoImg} alt="Seal" className="w-16 h-16 opacity-50 mx-auto mb-2 grayscale" />
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold text-gray-600">تاريخ الإصدار</p>
                  <p className="font-bold mt-6 font-mono" dir="ltr">
                    {new Date().toLocaleDateString('en-GB').replace(/\//g, ' / ')}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#060a12] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden" dir={dir}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] pointer-events-none ${!isExamMode ? 'bg-amber-500/10' : passed ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}></div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="max-w-md w-full bg-slate-900/85 border-2 border-slate-700 rounded-[2rem] p-8 text-center shadow-2xl backdrop-blur-xl relative z-10"
        >
          {!isExamMode ? (
            <div className="w-24 h-24 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-12 h-12 text-amber-400 animate-pulse" />
            </div>
          ) : passed ? (
            <div className="w-24 h-24 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <ShieldCheck className="w-12 h-12 text-emerald-400" />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto bg-rose-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.4)]">
              <XCircle className="w-12 h-12 text-rose-400" />
            </div>
          )}
          
          <h2 className="text-3xl font-black mb-2">
            {!isExamMode 
              ? (isAr ? 'انتهى التدريب بنجاح' : 'Training Finished') 
              : (passed ? tUI('passedTitle') : tUI('failedTitle'))}
          </h2>
          <p className="text-slate-400 mb-6">{tUI('finalScore')}</p>

          <div className="text-6xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 mb-2 drop-shadow-md">
            <Num>{score}</Num>
          </div>
          <p className="text-slate-500 mb-6 text-xl font-bold">/ <Num>{examData.totalMarks}</Num></p>

          {!isExamMode ? (
            <div className="bg-amber-900/20 border border-amber-500/40 rounded-2xl p-4 mb-8">
              <p className="text-lg font-bold text-amber-300 leading-relaxed">
                {trainMessage}
              </p>
            </div>
          ) : earnedGrade && passed ? (
            <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-2xl p-4 mb-8">
              <p className="text-sm text-emerald-300 mb-1">{tUI('gradeEarned')}</p>
              <p className="text-2xl font-black text-emerald-400">
                {earnedGrade}
              </p>
            </div>
          ) : null}

          <div className="space-y-3">
            <button onClick={() => setShowReview(true)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition border border-slate-700">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              {tUI('reviewAnswers')}
            </button>
            <button onClick={onExit} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-lg text-slate-950">
              <Home className="w-5 h-5" />
              {tUI('backToExamsList')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ شاشة الامتحان والتدريب الرئيسية ═══
  const currentQ = allQuestions[activeIndex];
  const answeredCount = Object.values(answers).filter(v => v !== '').length;

  return (
    <div className="min-h-screen bg-[#060a12] text-white flex flex-col relative select-none" dir={dir}>
      
      <div className="flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <button onClick={() => handleSubmit(false)} className="px-5 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-xl text-sm font-bold border border-rose-500/30 transition">
          {tUI('finishExam')}
        </button>
        
        {mode === 'exam' && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg border ${timeLeft < 60 ? 'bg-rose-900/50 text-rose-400 border-rose-500/50 animate-pulse' : 'bg-slate-950 text-amber-400 border-slate-700'}`}>
            <Timer className="w-5 h-5" />
            <span>
              <Num>{Math.floor(timeLeft / 60)}</Num>:<Num>{(timeLeft % 60).toString().padStart(2, '0')}</Num>
            </span>
          </div>
        )}

        <div className="text-sm font-bold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-emerald-400"><Num>{answeredCount}</Num></span> / <Num>{allQuestions.length}</Num>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-[350px] scroll-smooth" style={{ scrollPaddingBottom: '350px' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allQuestions.map((q, idx) => {
            const isActive = idx === activeIndex;
            const val = answers[q.id];
            const isAnswered = !!val && val !== '';

            return (
              <div 
                key={q.id}
                ref={isActive ? activeCardRef : null}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer scroll-mb-[350px] ${
                  isActive 
                    ? 'border-amber-400 bg-slate-800/90 shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-[1.02] z-10 ring-2 ring-amber-400/50 animate-pulse' 
                    : isAnswered 
                      ? 'border-emerald-500/40 bg-slate-900' 
                      : 'border-slate-800 bg-slate-900/50 opacity-85'
                }`}
              >
                <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-md ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                  <Num>{idx + 1}</Num>
                </div>

                <div className="flex flex-col items-center mt-3 text-xl font-mono font-bold text-slate-200" dir="ltr">
                  {q.numbers.map((num, i) => (
                    <div key={i} className="flex items-center justify-center w-16 relative">
                      <span><Num>{num}</Num></span>
                      {i < q.numbers.length - 1 && <span className="absolute -right-2 text-sm text-amber-500/70">{getOperator(q.type)}</span>}
                    </div>
                  ))}
                </div>
                
                <div className="w-full h-px bg-slate-700/50 my-3"></div>
                
                <div className={`w-full text-center py-2 rounded-xl text-xl font-mono font-bold border transition-colors ${
                  isActive 
                    ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]' 
                    : isAnswered 
                      ? 'bg-slate-950 text-amber-300 border-emerald-500/30' 
                      : 'bg-slate-950/50 text-slate-600 border-transparent'
                }`}>
                  <Num>{val || '?'}</Num>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-4 pb-6 z-30 shadow-[0_-15px_50px_rgba(0,0,0,0.7)]">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          
          <div className="flex gap-2">
            <button onClick={prevQuestion} disabled={activeIndex === 0} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl font-bold flex justify-center items-center gap-2 transition text-sm border border-slate-700">
              <ArrowRight className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
              {tUI('back')}
            </button>
            <button onClick={nextQuestion} disabled={activeIndex === allQuestions.length - 1} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl font-bold flex justify-center items-center gap-2 transition text-sm border border-slate-700">
              {tUI('next')}
              <ArrowLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
            </button>
          </div>

          <RelicKeypad 
            value={answers[currentQ.id] || ''}
            onChange={handleKeypadChange}
            maxLen={6}
            disabled={isFinished}
          />

        </div>
      </div>
    </div>
  );
}