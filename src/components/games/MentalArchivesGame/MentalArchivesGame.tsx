// src/components/games/MentalArchivesGame/MentalArchivesGame.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { LEVEL_1_DATA, GAME_ID, DEFAULT_HERO } from './level1Data';
import { addScore } from '../highScoreStore';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import { gt, lt, useGameLang } from '../gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import { isPreviewMode } from '@/utils/previewMode';
import { SkipForward, ArrowRight, Sparkles, Award } from 'lucide-react';
import { Num } from '@/components/Num';

import introVideo from './intro.mp4';
import joudImg from './joud.png';
import aseelImg from './aseel.png';
import sorobanaImg from './sorobana.png';

type GamePhase = 'intro' | 'story' | 'example' | 'challenge' | 'failed' | 'success';

interface Props {
  onBack: () => void;
  onComplete?: () => void;
}

export default function MentalArchivesGame({ onBack, onComplete }: Props) {
  const { dir, isAr } = useGameLang();
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [storyIndex, setStoryIndex] = useState(0);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(LEVEL_1_DATA.timePerQuestionMs);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  
  // تأثير الآلة الكاتبة للنصوص
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { speak: speakJoud } = useCharacterVoice('joud');
  const { speak: speakAseel } = useCharacterVoice('bana'); 
  const { speak: speakSorobana } = useCharacterVoice('sham'); 

  const childName = useProgressStore((s) => s.childName) || gt('بطل');
  const addXP = useProgressStore((s) => s.addXP);
  
  const recordSaved = useRef(false);
  const [heroMood, setHeroMood] = useState<'idle' | 'thinking' | 'celebrating' | 'sad'>('idle');

  const getCharacterData = (char: string) => {
    switch (char) {
      case 'jud': return { name: gt('جود'), img: joudImg, color: 'text-cyan-400', speak: speakJoud };
      case 'aseel': return { name: gt('أسيل'), img: aseelImg, color: 'text-rose-400', speak: speakAseel };
      case 'sorobana': return { name: gt('سوروبانا'), img: sorobanaImg, color: 'text-purple-400', speak: speakSorobana };
      default: return { name: '', img: joudImg, color: '', speak: () => {} };
    }
  };

  const currentLine = LEVEL_1_DATA.story[storyIndex];
  const currentCharData = currentLine ? getCharacterData(currentLine.character) : null;

  // تأثير الآلة الكاتبة للحوارات
  useEffect(() => {
    if (phase === 'story' && currentCharData && currentLine) {
      const fullText = gt(currentLine.textAr);
      setDisplayedText('');
      setIsTyping(true);
      currentCharData.speak(fullText);

      let i = 0;
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText(prev => prev + fullText.charAt(i));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 25);

      return () => clearInterval(interval);
    }
  }, [storyIndex, phase]);

  // مؤقت التحدي
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'challenge' && feedback === 'none') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 100) {
            handleAnswer(false);
            return LEVEL_1_DATA.timePerQuestionMs;
          }
          return prev - 100;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [phase, currentQIndex, feedback]);

  const handleAnswer = (isManualSubmit: boolean) => {
    if (feedback !== 'none') return;
    const q = LEVEL_1_DATA.questions[currentQIndex];
    const actualCorrect = isManualSubmit ? parseInt(userInput) === q.answer : false;

    if (actualCorrect) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      setHeroMood('celebrating');
      speakJoud(gt('إِجَابَةٌ صَحِيحَة!'));
      
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#38BDF8']
      });

      setTimeout(() => advanceQuestion(), 1200);
    } else {
      setFeedback('wrong');
      setHeroMood('sad');
      speakJoud(gt('إِجَابَةٌ خَاطِئَة، حَاوِلْ أَسْرَع.'));
      setTimeout(() => advanceQuestion(), 1500);
    }
  };

  const advanceQuestion = () => {
    if (currentQIndex < LEVEL_1_DATA.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setUserInput('');
      setTimeLeft(LEVEL_1_DATA.timePerQuestionMs);
      setFeedback('none');
      setHeroMood('thinking');
    } else {
      const finalCorrect = correctCount + (feedback === 'correct' ? 1 : 0);
      endGame(finalCorrect >= LEVEL_1_DATA.requiredCorrect, finalCorrect);
    }
  };

  const endGame = (isSuccess: boolean, finalScore: number) => {
    if (recordSaved.current) return;
    recordSaved.current = true;

    addScore(GAME_ID, childName, finalScore, DEFAULT_HERO);
    if (!isPreviewMode()) addXP(isSuccess ? 5 : 2);
    if (isSuccess) {
      localStorage.setItem('mental_archives_max_level', '2');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }

    setPhase(isSuccess ? 'success' : 'failed');
    if (isSuccess) speakJoud(gt('عَبَرْتَ الْبَوَّابَةَ بِنَجَاح!'));
  };

  const handleRetry = () => {
    setFailedAttempts(prev => prev + 1);
    if (failedAttempts >= 2) return; 
    setCurrentQIndex(0);
    setCorrectCount(0);
    setUserInput('');
    setTimeLeft(LEVEL_1_DATA.timePerQuestionMs);
    setFeedback('none');
    setPhase('challenge');
    setHeroMood('idle');
    recordSaved.current = false;
  };

  const getTopBarImage = () => {
    if (phase === 'story' && currentLine) {
      return getCharacterData(currentLine.character).img;
    }
    return joudImg;
  };

  const TopBar = () => (
    <div className="flex items-center justify-between gap-2 p-3 sm:p-4 sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 shadow-lg">
      <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0">
        <ArrowRight className={`w-6 h-6 text-amber-400 ${isAr ? '' : 'rotate-180'}`} />
      </button>
      
      <div className="flex-1 flex justify-center items-center gap-2">
        <div className={`w-12 h-12 rounded-full border-2 overflow-hidden shadow-lg flex items-center justify-center bg-slate-900 ${phase === 'challenge' && feedback === 'correct' ? 'border-emerald-400' : 'border-amber-400'}`}>
          <img src={getTopBarImage()} alt="Companion" className="w-full h-full object-cover" />
        </div>
        <span className="text-amber-200 font-bold text-sm sm:text-base hidden sm:inline">{gt(LEVEL_1_DATA.titleAr)}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {phase === 'challenge' && (
          <div className="relative flex items-center justify-center w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" className="text-slate-800 fill-none" />
              <circle 
                cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" 
                className={`fill-none transition-all duration-100 ${timeLeft < 3000 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}
                strokeDasharray={125.6}
                strokeDashoffset={125.6 * (1 - timeLeft / LEVEL_1_DATA.timePerQuestionMs)}
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-amber-200">
              {(timeLeft / 1000).toFixed(0)}s
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (phase === 'intro') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white" dir={dir}>
        <video src={introVideo} autoPlay playsInline muted controls className="w-full h-full max-h-[100dvh] object-cover" onEnded={() => setPhase('story')} />
        <button onClick={() => setPhase('story')} className="absolute bottom-20 bg-slate-800/80 text-white px-6 py-3 rounded-full flex items-center gap-2 border border-slate-600 z-50 hover:bg-slate-700 transition">
          <span>{lt('تخطي المقدمة', 'Skip')}</span><SkipForward className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (phase === 'story' && currentCharData) {
    return (
      <div className="relative flex flex-col justify-between min-h-[100dvh] bg-gradient-to-b from-stone-950 via-indigo-950 to-slate-950 text-white overflow-hidden" dir={dir}>
        <TopBar />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

        <div className="flex-1 relative w-full max-w-4xl mx-auto flex justify-center items-end mb-6 z-10 gap-2 sm:gap-6 pt-20">
          <motion.img src={aseelImg} animate={{ scale: currentLine.character === 'aseel' ? 1.1 : 0.85, opacity: currentLine.character === 'aseel' ? 1 : 0.35, filter: currentLine.character === 'aseel' ? 'drop-shadow(0 0 15px rgba(244,63,94,0.4))' : 'grayscale(80%)' }} className="w-24 sm:w-36 object-contain origin-bottom transition-all duration-300" />
          <motion.img src={joudImg} animate={{ scale: currentLine.character === 'jud' ? 1.1 : 0.85, opacity: currentLine.character === 'jud' ? 1 : 0.35, filter: currentLine.character === 'jud' ? 'drop-shadow(0 0 15px rgba(56,189,248,0.4))' : 'grayscale(80%)' }} className="w-32 sm:w-44 object-contain origin-bottom z-20 transition-all duration-300" />
          <motion.img src={sorobanaImg} animate={{ scale: currentLine.character === 'sorobana' ? 1.1 : 0.85, opacity: currentLine.character === 'sorobana' ? 1 : 0.35, filter: currentLine.character === 'sorobana' ? 'drop-shadow(0 0 15px rgba(168,85,247,0.4))' : 'grayscale(80%)' }} className="w-28 sm:w-40 object-contain origin-bottom transition-all duration-300" />
        </div>

        {/* صندوق الحوار السينمائي مع ميزة التخطي عند النقر */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
          onClick={() => {
            if (isTyping && currentLine) {
              setDisplayedText(gt(currentLine.textAr));
              setIsTyping(false);
            }
          }}
          className="relative w-full max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 rounded-t-3xl border-t-2 border-amber-500/30 shadow-2xl z-20 cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className={`font-extrabold text-lg sm:text-xl ${currentCharData.color}`}>{currentCharData.name}</span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{lt('مرشد زمني', 'Archive Guide')}</span>
          </div>
          <p className="text-lg sm:text-xl leading-relaxed mb-6 min-h-[4rem] text-slate-100 font-medium">
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse"></span>}
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // منع تداخل النقرات مع الصندوق
              if (isTyping && currentLine) {
                setDisplayedText(gt(currentLine.textAr));
                setIsTyping(false);
                return;
              }
              if (storyIndex < LEVEL_1_DATA.story.length - 1) setStoryIndex(s => s + 1);
              else setPhase('example');
            }} 
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl font-extrabold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>{isTyping ? lt('عرض النص كاملاً', 'Show Full Text') : lt('متابعة الحكاية', 'Continue Story')}</span>
            <Sparkles className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'example') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-950 text-white p-6" dir={dir}>
        <TopBar />
        <div className="max-w-2xl bg-slate-900/90 border border-amber-500/30 p-8 mt-16 rounded-3xl shadow-2xl w-full z-10 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-amber-400" />
            <h2 className="text-2xl font-bold text-amber-300">{gt(LEVEL_1_DATA.example.titleAr)}</h2>
          </div>
          <div className="text-4xl text-center font-mono bg-stone-900 border border-amber-500/20 py-4 rounded-2xl mb-6 text-amber-400 tracking-wider shadow-inner" dir="ltr">
            {LEVEL_1_DATA.example.problem}
          </div>
          <ul className="space-y-4 mb-8">
            {LEVEL_1_DATA.example.stepsAr.map((step, idx) => (
              <li key={idx} className="flex items-start bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold ml-3 mt-0.5 shrink-0">{idx + 1}</span>
                <span className="text-base sm:text-lg text-slate-200">{gt(step)}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => setPhase('challenge')} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2">
            <span>{lt('أنا مستعد للتحدي الأثري', 'Ready for Challenge')}</span>
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'success') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-950 text-white p-6 overflow-hidden" dir={dir}>
        <TopBar />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950 to-slate-950 pointer-events-none"></div>
        
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10 max-w-lg bg-slate-900/90 border border-amber-500/40 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="text-6xl mb-4 animate-bounce">🏛️✨</div>
          <h2 className="text-3xl font-extrabold text-amber-400 mb-3">{lt('عبرت البوابة بنجاح!', 'Gate Crossed!')}</h2>
          <p className="text-slate-300 text-lg mb-6 leading-relaxed">{gt("لَقَدْ أَعَدْتَ رَبْطَ سِجِلَّاتِ إِبْلَا وَمَارِي وَحَفِظْتَ التَّارِيخَ مِنَ الطَّيْفِ الصِّفْرِيّ.")}</p>
          
          <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-4 mb-8 text-right shadow-inner">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1 text-sm">
              <span>📜</span>
              <span>{lt('بطاقة الأثر التاريخي: ألواح إبلا', 'Artifact Card: Ebla Tablets')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lt('اكتشفت أزيد من 17 ألف لوح مسماري في إبلا (سورية)، وهي تمثل أقدم أرشيف إداري مكتشف في تاريخ البشرية!', 'Over 17,000 cuneiform tablets were discovered in Ebla, representing the oldest administrative archive in human history!')}
            </p>
          </div>

          <button onClick={onBack} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-900/40 transition">
            {lt('العودة لمدينة الألعاب', 'Return to Games')}
          </button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'failed' && failedAttempts >= 2) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-950 text-white p-6" dir={dir}>
        <TopBar />
        <div className="max-w-md bg-slate-900/90 border border-amber-500/30 p-8 rounded-3xl text-center border-t-4 border-amber-500 w-full z-10 backdrop-blur-md shadow-2xl">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-amber-400 mb-3">{lt('تحتاج إلى مزيد من السرعة!', 'Need More Speed!')}</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">{gt('تَحْتَاجُ إِلَى مَزِيدٍ مِنَ السُّرْعَةِ لِلِامْتِحَان، تَدَرَّبْ جَيِّداً لِتَكُونَ جَاهِزاً.')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setPhase('example')} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition">{lt('مراجعة الشرح', 'Review')}</button>
            <button onClick={() => { setFailedAttempts(0); handleRetry(); }} className="flex-1 py-3.5 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold transition text-slate-950">{lt('تحدي جديد', 'Retry')}</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = LEVEL_1_DATA.questions[currentQIndex];
  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-slate-950 text-white overflow-hidden" dir={dir}>
      <TopBar />
      
      {/* البطل المرافق مع إخفاء ذكي في الشاشات الصغيرة جداً لمنع التداخل */}
      <div className="absolute bottom-2 left-2 z-0 pointer-events-none opacity-40 hidden sm:block sm:opacity-70">
        <img src={joudImg} alt="Hero Companion" className={`w-28 sm:w-36 object-contain transition-transform duration-300 ${heroMood === 'celebrating' ? 'scale-110' : heroMood === 'sad' ? 'rotate-6' : ''}`} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 z-10 w-full max-w-md mx-auto pb-12">
        <div className="w-full flex justify-between items-center text-sm font-bold text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
          <span>{lt('السؤال', 'Q')} {currentQIndex + 1} / {LEVEL_1_DATA.questions.length}</span>
          <span className="text-amber-400 font-mono">⚡ {gt('تحدي السرعة الأثرية')}</span>
        </div>

        <div className="bg-stone-900/90 border-2 border-amber-500/40 p-8 rounded-3xl shadow-2xl w-full text-center relative backdrop-blur-md">
          <div className="absolute -top-3 right-6 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30">
            {lt('لوح طيني رقمي', 'Digital Tablet')}
          </div>

          <div className="flex flex-col items-center text-5xl font-mono mb-8 pt-4" dir="ltr">
            {currentQ.numbers.map((num, i) => (
              <div key={i} className="flex items-center justify-center w-36 relative my-1">
                <span className="w-16 text-center text-amber-100 drop-shadow-md">{num}</span>
                {i < currentQ.numbers.length - 1 && (
                  <span className="absolute -right-4 text-amber-500/80 text-3xl font-bold">+</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="h-px w-3/4 bg-amber-500/30 mx-auto mb-6"></div>
          
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={feedback !== 'none'}
            className={`w-44 mx-auto text-center text-5xl font-bold bg-slate-950 border-2 rounded-2xl p-4 outline-none transition-all shadow-inner
              ${feedback === 'correct' ? 'border-emerald-500 text-emerald-400 shadow-emerald-500/20' : 
                feedback === 'wrong' ? 'border-red-500 text-red-400 shadow-red-500/20' : 'border-amber-500/40 focus:border-amber-400 text-amber-200'}`}
            placeholder="؟"
            autoFocus
          />
        </div>

        <button 
          onClick={() => handleAnswer(true)}
          disabled={!userInput || feedback !== 'none'}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 rounded-2xl font-extrabold text-xl transition-all shadow-lg text-slate-950 flex items-center justify-center gap-2"
        >
          <span>{lt('تأكيد الإجابة', 'Confirm')}</span>
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
