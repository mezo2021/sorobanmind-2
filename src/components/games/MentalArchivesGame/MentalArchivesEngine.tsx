// src/components/games/MentalArchivesGame/MentalArchivesEngine.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Chapter, CharacterId, Scene, GameQuestion } from './gameFlowTypes'; 
import { tUI } from './gameUI';
import { useGameLang } from '../gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import { SkipForward, ArrowRight, Sparkles, Award, Play, Volume2, Square, Home } from 'lucide-react';

import Num from '@/components/Num';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import WarpFlash from '@/components/cosmic/WarpFlash';
import ChapterTitleCard from './ui/ChapterTitleCard';
import { getTheme } from './ui/chapterThemes';
import { parseInput } from '@/utils/numberStyle';
import RelicKeypad from './ui/RelicKeypad';
import TimeDial from './ui/TimeDial';
import SpeechCrystal from './ui/SpeechCrystal';
import introVideo from './intro.mp4';
import joudImg from './joud.png';
import aseelImg from './aseel.png';
import sorobanaImg from './sorobana.png';

const GLOWS: { id: CharacterId; bg: string }[] = [
  { id: 'jud', bg: 'radial-gradient(circle at 50% 75%, rgba(56,189,248,0.5), transparent 60%)' },
  { id: 'aseel', bg: 'radial-gradient(circle at 50% 75%, rgba(244,114,182,0.5), transparent 60%)' },
  { id: 'sorobana', bg: 'radial-gradient(circle at 50% 75%, rgba(167,139,250,0.5), transparent 60%)' },
];

function AmbientGlow({ speaker, reduce }: { speaker: CharacterId; reduce: boolean | null }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
      {GLOWS.map((g) => (
        <motion.div
          key={g.id}
          className="absolute inset-0"
          style={{ background: g.bg }}
          initial={false}
          animate={{ opacity: speaker === g.id ? 0.6 : 0 }}
          transition={{ duration: reduce ? 0 : 0.6 }}
        />
      ))}
    </div>
  );
}

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

  const challengeScene = chapter.scenes.find((s): s is Extract<Scene, { kind: 'challenge' }> => s.kind === 'challenge');
  const requiredCorrect = challengeScene?.requiredCorrect ?? 0;

  const [videoState, setVideoState] = useState<'start' | 'playing' | 'done'>(
    chapter.id === 'intro' ? 'start' : 'done'
  );

  const [phase, setPhase] = useState<'playing' | 'success'>('playing');
  const theme = getTheme(chapter.id);
  const [showTitle, setShowTitle] = useState(true);
  const closeTitle = useCallback(() => setShowTitle(false), []);

  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [exampleIndex, setExampleIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const [qIndex, setQIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState('');
  const [ghost, setGhost] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<number | null>(null);
  const [speaker, setSpeaker] = useState<CharacterId>('jud');
  const [inputMode, setInputMode] = useState<'keypad' | 'dial'>('keypad');
  const handleAnswerRef = useRef<(m: boolean) => void>(() => {});
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const successHandledRef = useRef(false);
  const typingRef = useRef<number | null>(null); // 🆕 لحل مشكلة وميض الآلة الكاتبة

  const childName = useProgressStore((s) => s.childName) || tUI('champion');

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const ss = window.speechSynthesis;
    const pick = () => {
      voiceRef.current = ss.getVoices().find(v => v.lang.startsWith(isAr ? 'ar' : 'en')) || null;
    };
    pick();
    ss.addEventListener('voiceschanged', pick);
    
    const warm = new SpeechSynthesisUtterance('a');
    warm.volume = 0;
    warm.lang = isAr ? 'ar-SA' : 'en-US';
    try { if (!ss.speaking) ss.speak(warm); } catch {}
    
    return () => ss.removeEventListener('voiceschanged', pick);
  }, [isAr]);

  const speakCustom = useCallback((characterId: CharacterId, text: string, onDone?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onDone) onDone();
      return;
    }
    
    const ss = window.speechSynthesis;
    const wasBusy = ss.speaking || ss.pending;
    if (wasBusy) ss.cancel();
    
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

    const ttsText = finalText
      .replace(/←/g, '، ثُمَّ ')
      .replace(/\+/g, ' زَائِد ')
      .replace(/-/g, ' نَاقِص ')
      .replace(/×/g, ' فِي ')
      .replace(/÷/g, ' عَلَى ')
      .replace(/=/g, ' يُسَاوِي ');

    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.lang = isAr ? 'ar-SA' : 'en-US';
    utterance.rate = isAr ? 0.8 : 0.7;
    utterance.pitch = characterId === 'jud' ? 0.8 : characterId === 'aseel' ? 1.4 : 1.25;
    
    if (voiceRef.current) utterance.voice = voiceRef.current;
    if (onDone) utterance.onend = onDone;
    
    if (wasBusy) window.setTimeout(() => ss.speak(utterance), 80);
    else ss.speak(utterance);
  }, [isAr, childName]);

  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // 🆕 دالة تخطي الآلة الكاتبة
  const skipTyping = (fullText: string) => {
    if (typingRef.current) { 
      clearInterval(typingRef.current); 
      typingRef.current = null; 
    }
    setDisplayedText(fullText);
    setIsTyping(false);
  };

  useEffect(() => {
    return () => stopAllAudio();
  }, [sceneIndex, phase]);

  useEffect(() => {
    setExampleIndex(0);
    setActiveStepIndex(null);
    stopAllAudio();
  }, [sceneIndex]);

  useEffect(() => {
    if (currentScene?.kind === 'challenge') {
      setTimeLeft(currentScene.timePerQuestionMs);
    }
  }, [sceneIndex, qIndex, currentScene]);

  useEffect(() => {
    if (currentScene?.kind !== 'challenge' || feedback !== 'none' || phase !== 'playing' || timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          handleAnswer(false);
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [timeLeft, currentScene, qIndex, feedback, phase]);

  useEffect(() => {
    if (currentScene?.kind !== 'challenge' || phase !== 'playing' || feedback !== 'none') return;
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) setUserInput((p) => (p.length < 6 ? p + e.key : p));
      else if (e.key === 'Backspace') setUserInput((p) => p.slice(0, -1));
      else if (e.key === 'Enter' && userInput) handleAnswerRef.current(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentScene, phase, feedback, userInput]);

  const getCharacterData = (char: CharacterId) => {
    switch (char) {
      case 'jud': return { name: isAr ? 'جود' : 'Joud', img: joudImg, color: 'text-cyan-400' };
      case 'aseel': return { name: isAr ? 'أسيل' : 'Aseel', img: aseelImg, color: 'text-rose-400' };
      case 'sorobana': return { name: isAr ? 'سوروبانا' : 'Sorobana', img: sorobanaImg, color: 'text-purple-400' };
      default: return { name: '', img: joudImg, color: '' };
    }
  };

  const getCharacterMotion = (char: CharacterId, isActive: boolean) => {
    const glow =
      char === 'jud' ? 'drop-shadow(0 0 25px rgba(56,189,248,0.7))'
      : char === 'aseel' ? 'drop-shadow(0 0 25px rgba(244,63,94,0.7))'
      : 'drop-shadow(0 0 25px rgba(168,85,247,0.7))';

    const inactiveFilter = 'grayscale(90%) contrast(80%) drop-shadow(0 0 0px rgba(0,0,0,0))';
    const activeFilter = `grayscale(0%) contrast(100%) ${glow}`;

    if (!isActive) {
      return {
        animate: { scale: 0.82, y: 0, opacity: 0.35, filter: inactiveFilter },
        transition: { duration: 0.3, ease: 'easeOut' as const },
      };
    }
    if (shouldReduceMotion) {
      return {
        animate: { scale: 1.05, y: 0, opacity: 1, filter: activeFilter },
        transition: { duration: 0.2 },
      };
    }
    const loop = { duration: 3, repeat: Infinity, repeatType: 'mirror' as const, ease: 'easeInOut' as const };
    return {
      // 🆕 تكبير الشخصية عند التحدث
      animate: { scale: [1.06, 1.12, 1.06], y: [0, -4, 0], opacity: 1, filter: activeFilter },
      transition: { scale: loop, y: loop, opacity: { duration: 0.25 }, filter: { duration: 0.25 } },
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
      
      speakCustom(line.character, fullText);

      let i = 0;
      // 🆕 استخدام window.setInterval وحفظه في ref لمنع الوميض
      const interval = window.setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText(fullText.slice(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30);
      
      typingRef.current = interval;

      return () => {
        clearInterval(interval);
        if (typingRef.current === interval) typingRef.current = null;
        stopAllAudio();
      };
    }
  }, [lineIndex, sceneIndex, isAr, videoState, phase]);

  const handleFinishChapter = () => {
    setPhase('success');
    stopAllAudio();
  };

  useEffect(() => {
    if (phase !== 'success') return;
    if (successHandledRef.current) return;
    successHandledRef.current = true;

    const isWin = !challengeScene || correctCount >= requiredCorrect;

    if (isWin) {
      const msg = isAr ? `${tUI('successMsg')} يا ${childName}!` : `${tUI('successMsg')} ${childName}!`;
      speakCustom('jud', msg);
      try { confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } }); } catch (e) {}
    } else {
      speakCustom('sorobana', tUI('needMoreSpeed'));
    }
  }, [phase, correctCount, requiredCorrect, challengeScene, isAr, childName, speakCustom]);

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

  const resetQuestion = () => {
    setUserInput('');
    setFeedback('none');
    setAttempts(0);
    setHint('');
    setGhost(null);
    setRevealed(null);
    setSpeaker('jud');
  };

  const speakThen = (who: CharacterId, text: string, minMs: number, cb: () => void) => {
    const start = Date.now();
    setSpeaker(who);
    speakCustom(who, text, () => {
      window.setTimeout(cb, Math.max(0, minMs - (Date.now() - start)));
    });
  };

  const buildHint = (q: GameQuestion, n: number) => {
    if (n >= 2) {
      const ans = String(Math.abs(q.answer));
      return tUI('hintDigits').replace('{n}', String(ans.length)).replace('{d}', ans[0]);
    }
    const explicitTip = isAr ? q.tipAr : q.tipEn;
    if (explicitTip) return explicitTip;

    const map: Record<string, Parameters<typeof tUI>[0]> = {
      direct: 'hintDirect', complement5: 'hintComplement5', complement10: 'hintComplement10',
      combined: 'hintCombined',
      mitori: 'hintMitori', multiplication: 'hintMultiplication', division: 'hintDivision', subtraction: 'hintSubtraction',
    };
    return tUI(map[q.type] || 'hintDirect');
  };

  const handleAnswer = (isManualSubmit: boolean) => {
    if (currentScene?.kind !== 'challenge' || feedback !== 'none') return;
    if (isManualSubmit && !userInput) return;

    const q = currentScene.questions[qIndex];
    const guess = isManualSubmit ? parseInput(userInput) : NaN;
    const actualCorrect = guess === q.answer;

    const advance = () => {
      if (qIndex < currentScene.questions.length - 1) {
        setQIndex(prev => prev + 1);
        resetQuestion();
      } else {
        resetQuestion();
        nextScene();
      }
    };

    if (actualCorrect) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      const msg = isAr ? `أَحْسَنْتَ يا ${childName}!` : `Well done ${childName}!`;
      try { confetti({ particleCount: shouldReduceMotion ? 15 : 40, spread: 60, origin: { y: 0.7 }, colors: ['#F59E0B', '#FBBF24', '#FDE68A'] }); } catch (e) {}
      speakThen('jud', msg, 900, advance);
      return;
    }

    if (isManualSubmit && attempts < 2) {
      const n = attempts + 1;
      const hintText = buildHint(q, n);
      setFeedback('wrong');
      setGhost(guess);
      setAttempts(n);
      setHint(hintText);
      const msg = (n === 1 ? tUI('encourage1') : tUI('encourage2')) + (isAr ? ` يا ${childName}` : ` ${childName}`);
      speakThen('aseel', msg, 1100, () => {
        setFeedback('none');
        setUserInput('');
        setGhost(null);
        speakThen('sorobana', hintText, 0, () => {});
      });
      return;
    }

    setFeedback('wrong');
    setRevealed(q.answer);
    setGhost(isManualSubmit ? guess : null);
    const msg = tUI('revealMsg').replace('{a}', String(q.answer));
    speakThen('jud', msg, 1800, advance);
  };
  handleAnswerRef.current = handleAnswer;

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

  const cinematic = (
    <>
      <ChapterTitleCard show={showTitle && videoState === 'done' && phase === 'playing'} onDone={closeTitle} theme={theme} title={isAr ? chapter.titleAr : chapter.titleEn} isAr={isAr} />
      <WarpFlash trigger={`${sceneIndex}-${phase}`} color={theme.accent} />
    </>
  );

  const getTopBarImage = () => {
    if (currentScene?.kind === 'example') return sorobanaImg;
    if (currentScene?.kind === 'challenge') return joudImg;
    return joudImg;
  };

  const TopBar = () => (
    // 🆕 إضافة w-full لإصلاح المستطيل الأسود
    <div className="flex items-center justify-between gap-2 p-3 sm:p-4 sticky top-0 z-30 bg-slate-950 border-b border-amber-500/20 shadow-lg w-full">
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
            <span className="absolute text-xs font-mono font-bold text-amber-200"><Num>{(timeLeft / 1000).toFixed(0)}</Num>s</span>
          </div>
        )}
      </div>
    </div>
  );

  if (phase === 'success') {
    const isWin = !challengeScene || correctCount >= requiredCorrect;
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-950 text-white p-6" dir={dir}>
        <CosmicBackground accent={theme.accent} accent2={theme.accent2} />
        {TopBar()}
        {cinematic}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10 max-w-lg bg-slate-900/90 border border-amber-500/40 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="text-6xl mb-4 animate-bounce">
            {isWin ? '🏛️✨' : '⏳💡'}
          </div>
          <h2 className={`text-3xl font-extrabold mb-3 ${isWin ? 'text-amber-400' : 'text-rose-400'}`}>
            {isWin ? tUI('successMsg') : tUI('needMoreSpeed')}
          </h2>
          <p className="text-slate-300 mb-8">
            {isWin ? (isAr ? chapter.titleAr : chapter.titleEn) : tUI('needMoreSpeedDesc')}
          </p>
          <button onClick={() => onComplete(correctCount)} className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg shadow-lg transition flex items-center justify-center gap-2 ${isWin ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500' : 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500'}`}>
            <Home className="w-5 h-5" />
            {isWin ? tUI('returnToGames') : tUI('backToGamesCity')}
          </button>
        </motion.div>
      </div>
    );
  }

  if (videoState === 'start') {
    return (
      <div className="relative w-full h-[100dvh] bg-black flex flex-col items-center justify-center overflow-hidden" dir={dir}>
        <img src={joudImg} alt="Joud" className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm scale-110" />
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
        {TopBar()}
        {cinematic}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        <CosmicBackground accent={theme.accent} accent2={theme.accent2} />
        <AmbientGlow speaker={line.character} reduce={shouldReduceMotion} />
        
        {/* 🆕 تعديل أحجام الشخصيات لتصبح أكبر وأكثر واقعية */}
        <div className="flex-1 min-h-0 relative w-full max-w-5xl mx-auto flex justify-center items-end mb-4 z-10 pt-16 gap-1 sm:gap-4">
          <motion.img
            src={aseelImg}
            alt={isAr ? 'أسيل' : 'Aseel'}
            initial={false}
            {...getCharacterMotion('aseel', line.character === 'aseel')}
            className="h-[30vh] sm:h-[44vh] w-auto object-contain origin-bottom shrink-0 -mx-2"
          />
          <motion.img
            src={joudImg}
            alt={isAr ? 'جود' : 'Joud'}
            initial={false}
            {...getCharacterMotion('jud', line.character === 'jud')}
            className="h-[38vh] sm:h-[54vh] w-auto object-contain origin-bottom z-20 shrink-0"
          />
          <motion.img
            src={sorobanaImg}
            alt={isAr ? 'سوروبانا' : 'Sorobana'}
            initial={false}
            {...getCharacterMotion('sorobana', line.character === 'sorobana')}
            className="h-[33vh] sm:h-[48vh] w-auto object-contain origin-bottom shrink-0 -mx-2"
          />
        </div>
        
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={() => { if (isTyping) skipTyping(isAr ? line.textAr : line.textEn); }} className="relative w-full max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 rounded-t-3xl border-t-2 border-amber-500/30 shadow-2xl z-20 cursor-pointer shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <span className={`font-extrabold text-lg sm:text-xl ${charData.color}`}>{charData.name}</span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{tUI('archiveGuide')}</span>
    <span className="text-xs text-amber-300/80">📍 {isAr ? theme.placeAr : theme.placeEn}</span>
          </div>
          
          <div className="h-24 sm:h-28 mb-6 overflow-y-auto custom-scrollbar flex items-start">
            <p className="text-lg sm:text-xl leading-relaxed text-slate-100 font-medium w-full">
              <Num>{displayedText}</Num>{isTyping && <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse"></span>}
            </p>
          </div>

          {/* 🆕 استخدام skipTyping عند الضغط على الزر */}
          <button onClick={(e) => { e.stopPropagation(); if (isTyping) { skipTyping(isAr ? line.textAr : line.textEn); return; } if (lineIndex < currentScene.lines.length - 1) setLineIndex(l => l + 1); else nextScene(); }} className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl font-extrabold text-lg transition-all shadow-lg flex items-center justify-center gap-2">
            <span>{isTyping ? tUI('showFullText') : tUI('continueStory')}</span><Sparkles className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (currentScene?.kind === 'example') {
    const currentExample = currentScene.examples[exampleIndex];
    if (!currentExample) return null;

    const exampleTip = isAr ? currentExample.tipAr : currentExample.tipEn;

    return (
      // 🆕 إصلاح المسافات لتجنب المستطيل الأسود
      <div className="relative flex flex-col items-center justify-start min-h-[100dvh] bg-slate-950 text-white px-6 pb-6 pt-0 overflow-y-auto" dir={dir}>
        <CosmicBackground fixed accent={theme.accent} accent2={theme.accent2} intensity={0.8} />
        <div className="-mx-6 w-[calc(100%+3rem)] mb-4">{TopBar()}</div>
        {cinematic}
        
        <div className="max-w-2xl w-full mb-6 bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl text-center z-10 shadow-lg">
          <p className="text-amber-200 font-bold text-sm sm:text-base leading-relaxed">
            <Num>{isAr ? currentScene.ruleAr : currentScene.ruleEn}</Num>
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
                {isAr ? 'مثال ' : 'Example '}<Num>{idx + 1}</Num>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-400 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-amber-300">
                  {isAr ? currentExample.ruleTitleAr : currentExample.ruleTitleEn}
                </h2>
              </div>
              <div className="text-sm text-amber-100/90 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 leading-relaxed">
                <Num>{isAr ? currentExample.ruleDescAr : currentExample.ruleDescEn}</Num>
              </div>
            </div>
            <button onClick={toggleExampleAudio} className={`p-3 rounded-full flex items-center justify-center transition-all ${activeStepIndex !== null ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30'}`}>
              {activeStepIndex !== null ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          
          <div className={`text-3xl sm:text-4xl text-center font-mono bg-stone-900 border border-amber-500/20 py-4 rounded-2xl text-amber-400 tracking-wider shadow-inner ${exampleTip ? 'mb-3' : 'mb-6'}`} dir="ltr">
            <Num>{isAr ? currentExample.problem : currentExample.problem.replace(/؟/g, '?')}</Num>
          </div>

          {exampleTip && (
            <div className="flex items-start gap-2 text-sm text-amber-200/95 bg-amber-950/30 border border-amber-500/25 p-3 rounded-xl mb-6">
              <span className="shrink-0 text-base leading-none pt-0.5">💡</span>
              <span className="leading-relaxed"><Num>{exampleTip}</Num></span>
            </div>
          )}
          
          <ul className="space-y-4 mb-8">
            {currentExample.steps.map((step, idx) => (
              <li key={idx} className={`flex items-start p-3 rounded-xl border transition-all duration-300 ${activeStepIndex === idx ? 'bg-amber-900/40 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-[1.02]' : 'bg-slate-800/50 border-slate-700/50'}`}>
                <span className={`rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold ml-3 mt-0.5 shrink-0 transition-colors ${activeStepIndex === idx ? 'bg-amber-500 text-slate-950' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}><Num>{idx + 1}</Num></span>
                <span className="text-base sm:text-lg text-slate-200"><Num>{isAr ? step.textAr : step.textEn}</Num></span>
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
    const locked = feedback !== 'none';
    const shownValue = revealed !== null ? String(revealed) : userInput;
    return (
      <div className="relative flex flex-col min-h-[100dvh] bg-slate-950 text-white overflow-hidden" dir={dir}>
        <CosmicBackground accent={theme.accent} accent2={theme.accent2} />
        <AmbientGlow speaker={speaker} reduce={shouldReduceMotion} />
        {TopBar()}
        {cinematic}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 gap-3 z-10 w-full max-w-md mx-auto pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="w-full flex justify-between items-center text-sm font-bold text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
            <span>{tUI('question')} <Num>{qIndex + 1} / {currentScene.questions.length}</Num></span>
            <span className="text-amber-400 font-mono">⚡ {tUI('archSpeedChallenge')}</span>
          </div>

          <motion.div
            animate={feedback === 'wrong' && !shouldReduceMotion ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-stone-900/90 border-2 border-amber-500/40 p-5 rounded-3xl shadow-2xl w-full text-center relative backdrop-blur-md"
          >
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ boxShadow: '0 0 40px 6px rgba(251,191,36,0.7) inset' }}
              initial={false}
              animate={{ opacity: feedback === 'correct' ? 1 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
            />
            <div className="absolute -top-3 right-6 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30">{tUI('digitalTablet')}</div>
            <div className="flex flex-col items-center text-4xl font-mono mb-3 pt-3" dir="ltr">
              {q.numbers.map((num: number, i: number) => (
                <div key={i} className="flex items-center justify-center w-36 relative my-0.5">
                  <span className="w-16 text-center text-amber-100 drop-shadow-md"><Num>{num}</Num></span>
                  {i < q.numbers.length - 1 && (
                    <span className="absolute -right-4 text-amber-500/80 text-2xl font-bold">
                      {q.type === 'multiplication' ? '×' : q.type === 'division' ? '÷' : (q.numbers[i + 1] < 0 ? '' : '+')}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="h-px w-3/4 bg-amber-500/30 mx-auto mb-3"></div>

            <div className="relative h-16 w-44 mx-auto flex items-center justify-center bg-slate-950 border-2 rounded-2xl overflow-hidden"
              style={{ borderColor: feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : 'rgba(245,158,11,0.4)' }}>
              {ghost !== null && (
                <motion.span
                  key={`ghost-${attempts}-${ghost}`}
                  className="absolute text-5xl font-mono font-bold text-sky-300 pointer-events-none"
                  initial={{ opacity: 0.45 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 1.2 }}
                  dir="ltr"
                ><Num>{ghost}</Num></motion.span>
              )}
              <span dir="ltr" className={`text-5xl font-mono font-bold ${revealed !== null ? 'text-sky-300' : feedback === 'correct' ? 'text-emerald-400' : 'text-amber-200'}`}>
                <Num>{shownValue || (isAr ? '؟' : '?')}</Num>
              </span>
            </div>
            <div className="min-h-[40px] mt-2 text-xs sm:text-sm text-violet-300 leading-snug"><Num>{hint}</Num></div>
          </motion.div>

          <div className="flex items-center gap-2 text-xs">
            {(['keypad', 'dial'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setInputMode(m)}
                className={`px-3 py-1 rounded-full border ${inputMode === m ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'border-slate-700 text-slate-400'}`}>
                {tUI(m === 'keypad' ? 'keypadMode' : 'dialMode')}
              </button>
            ))}
          </div>

          {inputMode === 'keypad' ? (
            <RelicKeypad value={userInput} onChange={setUserInput} disabled={locked} reduceMotion={shouldReduceMotion} />
          ) : (
            <TimeDial
              disabled={locked}
              reduceMotion={shouldReduceMotion}
              onStamp={(d) => setUserInput((p) => (p.length < 6 ? p + d : p))}
              onBack={() => setUserInput((p) => p.slice(0, -1))}
              onClear={() => setUserInput('')}
            />
          )}

          <div className="w-full flex items-start gap-3">
            <SpeechCrystal
              lang={isAr ? 'ar' : 'en'}
              disabled={locked}
              reduceMotion={shouldReduceMotion}
              onStart={stopAllAudio}
              onNumber={(n) => setUserInput(String(n).slice(0, 6))}
            />
            <button onClick={() => handleAnswer(true)} disabled={!userInput || locked} className="flex-1 h-16 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 rounded-2xl font-extrabold text-xl transition-all shadow-lg text-slate-950 flex items-center justify-center gap-2">
              <span>{tUI('confirmAnswer')}</span><Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}