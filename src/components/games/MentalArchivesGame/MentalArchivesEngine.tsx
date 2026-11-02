// src/components/games/MentalArchivesGame/MentalArchivesEngine.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Chapter, CharacterId } from './gameFlowTypes'; 
import { tUI } from './gameUI';
import { useGameLang } from '../gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import { SkipForward, ArrowRight, Sparkles, Award, Play, Volume2, Square, Home } from 'lucide-react';

import introVideo from './intro.mp4';
import joudImg from './joud.png';
import aseelImg from './aseel.png';
import sorobanaImg from './sorobana.png';

interface Props {
  chapter: Chapter; 
  onComplete: (score: number) => void; 
  onBack: () => void;
}

export default function MentalArchivesEngine({ chapter, onComplete, onBack }: Props) {
  const { dir, isAr } = useGameLang();
  const shouldReduceMotion = useReducedMotion();
  
  const [sceneIndex, setSceneIndex] = useState(0);
  const currentScene = chapter.scenes[sceneIndex];

  const [videoState, setVideoState] = useState<'start' | 'playing' | 'done'>(
    chapter.id === 'intro' ? 'start' : 'done'
  );

  const [phase, setPhase] = useState<'playing' | 'success'>('playing');

  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [exampleIndex, setExampleIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const [qIndex, setQIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(currentScene?.kind === 'challenge' ? currentScene.timePerQuestionMs : 0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const childName = useProgressStore((s) => s.childName) || tUI('champion');

  const speakCustom = useCallback((characterId: CharacterId, text: string, onDone?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onDone) onDone();
      return;
    }
    
    window.speechSynthesis.cancel();
    
    let finalText = text;
    if (!isAr && childName) {
      const firstName = childName.split(/\s+/)[0];
      const nameDict: Record<string, string> = {
        'مصطفى': 'Mustafa', 'ميمو': 'Mezo', 'محمد': 'Mohammed', 'جود': 'Joud', 'أسيل': 'Aseel', 'سوروبانا': 'Sorobana'
      };
      const translatedName = nameDict[firstName] || firstName;
      finalText = finalText.replace(new RegExp(childName, 'g'), translatedName);
      finalText = finalText.replace(/؟/g, '?').replace(/،/g, ',');
    }

    const utterance = new SpeechSynthesisUtterance(finalText);
    utterance.lang = isAr ? 'ar-SA' : 'en-US';
    utterance.rate = isAr ? 0.8 : 0.7;
    utterance.pitch = characterId === 'jud' ? 0.8 : characterId === 'aseel' ? 1.4 : 1.25;
    
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = isAr ? 'ar' : 'en';
    const bestVoice = voices.find(v => v.lang.startsWith(langPrefix));
    if (bestVoice) utterance.voice = bestVoice;

    if (onDone) utterance.onend = onDone;
    window.speechSynthesis.speak(utterance);
  }, [isAr, childName]);

  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    return () => stopAllAudio();
  }, [sceneIndex, phase]);

  useEffect(() => {
    setExampleIndex(0);
    setActiveStepIndex(null);
    stopAllAudio();
  }, [sceneIndex]);

  const getCharacterData = (char: CharacterId) => {
    switch (char) {
      case 'jud': return { name: isAr ? 'جود' : 'Joud', img: joudImg, color: 'text-cyan-400' };
      case 'aseel': return { name: isAr ? 'أسيل' : 'Aseel', img: aseelImg, color: 'text-rose-400' };
      case 'sorobana': return { name: isAr ? 'سوروبانا' : 'Sorobana', img: sorobanaImg, color: 'text-purple-400' };
      default: return { name: '', img: joudImg, color: '' };
    }
  };

  // ═══ Kinetic 2.5D: التمييز البصري الصريح للمتحدث ═══
  const getCharacterMotion = (char: CharacterId, isActive: boolean) => {
    const glowColor =
      char === 'jud'
        ? 'rgba(56,189,248,0.55)'
        : char === 'aseel'
          ? 'rgba(244,63,94,0.55)'
          : 'rgba(168,85,247,0.55)';

    if (shouldReduceMotion) {
      return {
        animate: {
          scale: isActive ? 1.05 : 0.88,
          opacity: isActive ? 1 : 0.35,
          filter: isActive ? `drop-shadow(0 0 20px ${glowColor})` : 'grayscale(100%)',
        },
        transition: { duration: 0.35, ease: 'easeOut' as const },
      };
    }

    // المتحدث: تنفس خفيف (scale فقط، بدون قفز)
    if (isActive) {
      return {
        animate: {
          scale: [1.03, 1.06, 1.03],
          opacity: 1,
          filter: `drop-shadow(0 0 20px ${glowColor})`,
        },
        transition: {
          duration: 2.8,
          repeat: Infinity,
          repeatType: 'mirror' as const,
          ease: 'easeInOut' as const,
        },
      };
    }

    // غير المتحدث: ساكن تماماً، رمادي، بلا حركة
    return {
      animate: {
        scale: 0.88,
        opacity: 0.35,
        filter: 'grayscale(100%)',
      },
      transition: { duration: 0.35, ease: 'easeOut' as const },
    };
  };

  useEffect(() => {
    if (videoState !== 'done' || phase !== 'playing') return;
    
    if (currentScene?.kind === 'dialogue') {
      const line = currentScene.lines[lineIndex];
      if (!line) return;
      
      const fullText = isAr ? line.textAr : line.textEn;
      
      setDisplayedText('');
      setIsTyping(true);
      
      stopAllAudio();
      speakCustom(line.character, fullText);

      let i = 0;
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText(fullText.slice(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30);

      return () => {
        clearInterval(interval);
        stopAllAudio();
      };
    }
  }, [lineIndex, sceneIndex, isAr, videoState, phase]);

  useEffect(() => {
    if (currentScene?.kind === 'challenge') {
      setTimeLeft(currentScene.timePerQuestionMs);
      stopAllAudio();
    }
  }, [qIndex, sceneIndex, currentScene]);

  useEffect(() => {
    if (currentScene?.kind !== 'challenge' || feedback !== 'none' || phase !== 'playing' || timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      if (timeLeft <= 100) {
        setTimeLeft(0);
        handleAnswer(false);
      } else {
        setTimeLeft(timeLeft - 100);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [timeLeft, currentScene, qIndex, feedback, phase]);

  const handleFinishChapter = () => {
    setPhase('success');
    stopAllAudio();
    const msg = isAr ? `${tUI('successMsg')} يا ${childName}!` : `${tUI('successMsg')} ${childName}!`;
    speakCustom('jud', msg);
    try { confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } }); } catch (e) {}
  };

  const nextScene = () => {
    stopAllAudio();
    if (sceneIndex < chapter.scenes.length - 1) {
      setSceneIndex(s => s + 1);
      setLineIndex(0);
      setQIndex(0);
    } else {
      handleFinishChapter();
    }
  };

  const handleAnswer = (isManualSubmit: boolean) => {
    if (currentScene?.kind !== 'challenge' || feedback !== 'none') return;
    
    const q = currentScene.questions[qIndex];
    const actualCorrect = isManualSubmit ? parseInt(userInput) === q.answer : false;

    if (actualCorrect) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      
      const msg = isAr ? `أحسنت يا ${childName}!` : `Well done ${childName}!`;
      
      try { confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 }, colors: ['#F59E0B', '#10B981', '#38BDF8'] }); } catch (e) {}
      
      speakCustom('jud', msg, () => {
        if (qIndex < currentScene.questions.length - 1) {
          setQIndex(prev => prev + 1);
          setUserInput('');
          setFeedback('none');
        } else {
          setFeedback('none');
          nextScene();
        }
      });
    } else {
      setFeedback('wrong');
      
      const msg = isAr ? `حاول مرة أخرى يا ${childName}!` : `Try again ${childName}!`;
      
      speakCustom('jud', msg, () => {
        if (qIndex < currentScene.questions.length - 1) {
          setQIndex(prev => prev + 1);
          setUserInput('');
          setFeedback('none');
        } else {
          setFeedback('none');
          nextScene();
        }
      });
    }
  };

  const toggleExampleAudio = () => {
    if (activeStepIndex !== null) {
      setActiveStepIndex(null);
      stopAllAudio();
      return;
    }

    if (currentScene?.kind !== 'example') return;
    const currentExample = currentScene.examples[exampleIndex];
    if (!currentExample) return;

    let index = 0;
    const playStep = () => {
      if (index >= currentExample.steps.length) {
        setActiveStepIndex(null);
        return;
      }
      setActiveStepIndex(index);
      const textToSpeak = isAr ? currentExample.steps[index].textAr : currentExample.steps[index].textEn;
      
      speakCustom('sorobana', textToSpeak, () => {
        index++;
        playStep();
      });
    };
    playStep();
  };

  const getTopBarImage = () => {
    if (currentScene?.kind === 'example') return sorobanaImg;
    if (currentScene?.kind === 'challenge') return joudImg;
    return joudImg;
  };

  const TopBar = () => (
    <div className="flex items-center justify-between gap-2 p-3 sm:p-4 sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 shadow-lg">
      <button onClick={() => { stopAllAudio(); onBack(); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0">
        <ArrowRight className={`w-6 h-6 text-amber-400 ${isAr ? '' : 'rotate-180'}`} />
      </button>
      <div className="flex-1 flex justify-center items-center gap-2">
        <div className={`w-12 h-12 rounded-full border-2 overflow-hidden shadow-lg flex items-center justify-center bg-slate-900 ${feedback === 'correct' ? 'border-emerald-400' : 'border-amber-400'}`}>
          <img src={getTopBarImage()} alt="Companion" className="w-full h-full object-cover" />
        </div>
        <span className="text-amber-200 font-bold text-sm sm:text-base hidden sm:inline">
          {isAr ? chapter.titleAr : chapter.titleEn}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {currentScene?.kind === 'challenge' && phase === 'playing' && (
          <div className="relative flex items-center justify-center w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" className="text-slate-800 fill-none" />
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" className={`fill-none transition-all duration-100 ${timeLeft < 3000 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`} strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - timeLeft / currentScene.timePerQuestionMs)} />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-amber-200">{(timeLeft / 1000).toFixed(0)}s</span>
          </div>
        )}
      </div>
    </div>
  );

  if (phase === 'success') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-950 text-white p-6" dir={dir}>
        <TopBar />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10 max-w-lg bg-slate-900/90 border border-amber-500/40 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="text-6xl mb-4 animate-bounce">🏛️✨</div>
          <h2 className="text-3xl font-extrabold text-amber-400 mb-3">{tUI('successMsg')}</h2>
          <p className="text-slate-300 mb-8">{isAr ? chapter.titleAr : chapter.titleEn}</p>
          <button onClick={() => onComplete(correctCount)} className="w-full py-4 mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl font-bold text-lg shadow-lg transition flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            {tUI('returnToGames')}
          </button>
        </motion.div>
      </div>
    );
  }

  if (videoState === 'start') {
    return (
      <div className="relative w-full h-[100dvh] bg-black flex flex-col items-center justify-center overflow-hidden" dir={dir}>
        <motion.img
          src={joudImg}
          alt="Joud"
          initial={{ scale: 1.1, opacity: 0.6 }}
          animate={
            shouldReduceMotion
              ? { scale: 1.1, opacity: 0.6 }
              : {
                  scale: [1.1, 1.12, 1.1],
                  opacity: [0.6, 0.66, 0.6],
                }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.2 }
              : {
                  duration: 6,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }
          }
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>
        <div className="z-10 flex flex-col items-center gap-6 mt-32">
          <button onClick={() => setVideoState('playing')} className="flex items-center gap-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 px-8 py-4 rounded-full font-extrabold text-xl sm:text-2xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95">
            <Play fill="currentColor" className="w-6 h-6" /> {tUI('startJourney')}
          </button>
        </div>
      </div>
    );
  }

  if (videoState === 'playing') {
    return (
      <div className="relative w-full h-[100dvh] bg-black flex flex-col items-center justify-center" dir={dir}>
        <video 
          src={introVideo} 
          autoPlay 
          playsInline 
          controls 
          className="w-full h-full object-contain"
          onEnded={() => setVideoState('done')}
        />
        <button onClick={() => setVideoState('done')} className="absolute bottom-20 right-6 bg-slate-800/80 hover:bg-slate-700 text-white px-6 py-3 rounded-full flex items-center gap-2 backdrop-blur-md transition-all z-50 border border-slate-600">
          <span>{tUI('skipIntro')}</span>
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (currentScene?.kind === 'dialogue') {
    const line = currentScene.lines[lineIndex];
    const charData = getCharacterData(line.character);

    return (
      <div className="relative flex flex-col justify-between min-h-[100dvh] bg-gradient-to-b from-stone-950 via-indigo-950 to-slate-950 text-white overflow-hidden" dir={dir}>
        <TopBar />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        <div className="flex-1 relative w-full max-w-4xl mx-auto flex justify-center items-end mb-6 z-10 gap-2 sm:gap-6 pt-20 overflow-hidden">
          <motion.img
            src={aseelImg}
            alt={isAr ? 'أسيل' : 'Aseel'}
            {...getCharacterMotion('aseel', line.character === 'aseel')}
            className="w-32 sm:w-44 object-contain origin-bottom will-change-transform"
          />

          <motion.img
            src={joudImg}
            alt={isAr ? 'جود' : 'Joud'}
            {...getCharacterMotion('jud', line.character === 'jud')}
            className="w-40 sm:w-56 object-contain origin-bottom z-20 will-change-transform"
          />

          <motion.img
            src={sorobanaImg}
            alt={isAr ? 'سوروبانا' : 'Sorobana'}
            {...getCharacterMotion('sorobana', line.character === 'sorobana')}
            className="w-36 sm:w-48 object-contain origin-bottom will-change-transform"
          />
        </div>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={() => { if (isTyping) { setDisplayedText(isAr ? line.textAr : line.textEn); setIsTyping(false); } }} className="relative w-full max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 rounded-t-3xl border-t-2 border-amber-500/30 shadow-2xl z-20 cursor-pointer">
          <div className="flex items-center gap-2 mb-3">
            <span className={`font-extrabold text-lg sm:text-xl ${charData.color}`}>{charData.name}</span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{tUI('archiveGuide')}</span>
          </div>
          <p className="text-lg sm:text-xl leading-relaxed mb-6 min-h-[4rem] text-slate-100 font-medium">
            {displayedText}{isTyping && <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse"></span>}
          </p>
          <button onClick={(e) => { e.stopPropagation(); if (isTyping) { setDisplayedText(isAr ? line.textAr : line.textEn); setIsTyping(false); return; } if (lineIndex < currentScene.lines.length - 1) setLineIndex(l => l + 1); else nextScene(); }} className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl font-extrabold text-lg transition-all shadow-lg flex items-center justify-center gap-2">
            <span>{isTyping ? tUI('showFullText') : tUI('continueStory')}</span><Sparkles className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (currentScene?.kind === 'example') {
    const currentExample = currentScene.examples[exampleIndex];
    if (!currentExample) return null;

    return (
      <div className="relative flex flex-col items-center justify-start min-h-[100dvh] bg-slate-950 text-white p-6 pt-24 overflow-y-auto" dir={dir}>
        <TopBar />
        
        <div className="max-w-2xl w-full mb-6 bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl text-center z-10 shadow-lg">
          <p className="text-amber-200 font-bold text-sm sm:text-base leading-relaxed">
            {isAr ? currentScene.ruleAr : currentScene.ruleEn}
          </p>
        </div>

        <div className="max-w-2xl bg-slate-900/90 border border-amber-500/30 p-8 rounded-3xl shadow-2xl w-full z-10 backdrop-blur-md">
          
          <div className="flex justify-between items-center mb-6 gap-2 overflow-x-auto pb-2">
            {currentScene.examples.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => { setExampleIndex(idx); setActiveStepIndex(null); stopAllAudio(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${exampleIndex === idx ? 'bg-amber-600 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {isAr ? `مثال ${idx + 1}` : `Example ${idx + 1}`}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-amber-300">{isAr ? currentExample.titleAr : currentExample.titleEn}</h2>
            </div>
            <button onClick={toggleExampleAudio} className={`p-3 rounded-full flex items-center justify-center transition-all ${activeStepIndex !== null ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30'}`}>
              {activeStepIndex !== null ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="text-3xl sm:text-4xl text-center font-mono bg-stone-900 border border-amber-500/20 py-4 rounded-2xl mb-6 text-amber-400 tracking-wider shadow-inner" dir="ltr">
            {isAr ? currentExample.problem : currentExample.problem.replace(/؟/g, '?')}
          </div>
          
          <ul className="space-y-4 mb-8">
            {currentExample.steps.map((step, idx) => (
              <li key={idx} className={`flex items-start p-3 rounded-xl border transition-all duration-300 ${activeStepIndex === idx ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-[1.02]' : 'bg-slate-800/50 border-slate-700/50'}`}>
                <span className={`rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold ml-3 mt-0.5 shrink-0 transition-colors ${activeStepIndex === idx ? 'bg-amber-500 text-slate-950' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>{idx + 1}</span>
                <span className="text-base sm:text-lg text-slate-200">{isAr ? step.textAr : step.textEn}</span>
              </li>
            ))}
          </ul>
          
          <button onClick={() => { if (exampleIndex < currentScene.examples.length - 1) { setExampleIndex(prev => prev + 1); setActiveStepIndex(null); stopAllAudio(); } else { nextScene(); } }} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2">
            <span>{exampleIndex < currentScene.examples.length - 1 ? (isAr ? 'المثال التالي' : 'Next Example') : tUI('readyForChallenge')}</span>
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (currentScene?.kind === 'challenge') {
    const q = currentScene.questions[qIndex];
    return (
      <div className="relative flex flex-col min-h-[100dvh] bg-slate-950 text-white overflow-hidden" dir={dir}>
        <TopBar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 z-10 w-full max-w-md mx-auto pb-12">
          <div className="w-full flex justify-between items-center text-sm font-bold text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
            <span>{tUI('question')} {qIndex + 1} / {currentScene.questions.length}</span>
            <span className="text-amber-400 font-mono">⚡ {tUI('archSpeedChallenge')}</span>
          </div>
          <div className="bg-stone-900/90 border-2 border-amber-500/40 p-8 rounded-3xl shadow-2xl w-full text-center relative backdrop-blur-md">
            <div className="absolute -top-3 right-6 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30">{tUI('digitalTablet')}</div>
            <div className="flex flex-col items-center text-5xl font-mono mb-8 pt-4" dir="ltr">
              {q.numbers.map((num: number, i: number) => (
                <div key={i} className="flex items-center justify-center w-36 relative my-1">
                  <span className="w-16 text-center text-amber-100 drop-shadow-md">{num}</span>
                  {i < q.numbers.length - 1 && (
                    <span className="absolute -right-4 text-amber-500/80 text-3xl font-bold">
                      {q.type === 'multiplication' ? '×' : q.type === 'division' ? '÷' : '+'}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="h-px w-3/4 bg-amber-500/30 mx-auto mb-6"></div>
            <input type="number" value={userInput} onChange={(e) => setUserInput(e.target.value)} disabled={feedback !== 'none'} className={`w-44 mx-auto text-center text-5xl font-bold bg-slate-950 border-2 rounded-2xl p-4 outline-none transition-all shadow-inner ${feedback === 'correct' ? 'border-emerald-500 text-emerald-400 shadow-emerald-500/20' : feedback === 'wrong' ? 'border-red-500 text-red-400 shadow-red-500/20' : 'border-amber-500/40 focus:border-amber-400 text-amber-200'}`} placeholder={isAr ? '؟' : '?'} autoFocus />
          </div>
          <button onClick={() => handleAnswer(true)} disabled={!userInput || feedback !== 'none'} className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 rounded-2xl font-extrabold text-xl transition-all shadow-lg text-slate-950 flex items-center justify-center gap-2">
            <span>{tUI('confirmAnswer')}</span><Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}