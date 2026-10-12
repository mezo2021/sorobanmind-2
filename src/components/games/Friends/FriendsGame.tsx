// ═══════════════════════════════════════════════════════════════════
// 🥋 src/components/games/Friends/FriendsGame.tsx
// ═══════════════════════════════════════════════════════════════════
//
// ما يميز هذه النسخة:
//   1. معداد بصري مخصص (عمودان: عشرات + آحاد)
//   2. محرك تسلسل خطوة-بخطوة
//   3. بنك 40 تمريناً مصحّحاً (من bank.ts)
//   4. شاشة رموز تمهيدية (5 رموز)
//   5. البطلة شام
//   6. الرقم القياسي
//   7. التذاكر
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, RotateCcw, Home, Trophy, Crown, Award, Zap,
  X, BookOpen,
} from 'lucide-react';
import { GameCompanion, type HeroMood } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import { useProgressStore } from '@/store/progressStore';
import type { CharacterType } from '@/types';
import {
  MASTER_40_BANK,
  type MultiStepProblem,
  type AbacusState,
} from './bank';

// ═══ ثوابت ═══
const SESSION_SECONDS = 90;
const GAME_ID = 'friends';
const HERO_ID: CharacterType = 'sham';
const SYMBOL_SEEN_KEY = 'soroban_friends_symbol_seen_v1';

// ═══════════════════════════════════════════════════════════════════
// حوارات شام
// ═══════════════════════════════════════════════════════════════════
const SHAM_START_PHRASES = [
  'أَهْلاً بِكَ فِي دُوجُو السُّورُوبَان! جَاهِزْ؟',
  'هَيَّا نَكْتَشِفُ الأَصْدِقَاءَ الخَفِيِّينَ!',
  'اليَوْمَ سَنُحَرِّكُ الخَرَزَاتِ كَأَبْطَالٍ!',
];

const SHAM_THINKING_PHRASES = [
  'رَكِّزْ عَلَى الحَرَكَةِ...',
  'تَأَمَّلْ المِعْدَادَ جَيِّداً...',
  'اتْبَعِ الخُطُوَةَ بِهُدُوءٍ...',
  'تَذَكَّرِ العَارِضَة!',
];

const SHAM_CORRECT_PHRASES = [
  'أَحْسَنْتَ! حَرَكَةٌ أُصُولِيَّة!',
  'بَرَافُو! رَائِع!',
  'مُمْتَاز! اتِّجَاهٌ صَحِيح!',
  'يَا بَطَلُ!',
];

const SHAM_MILESTONE_PHRASES: Record<number, string> = {
  3: 'ثَلَاثَة! أَنْتَ نَجْمُ الدُّوجُو!',
  5: 'خَمْسَة! الحِزَامُ الأَخْضَرُ لَكَ!',
  8: 'ثَمَانِيَة! أُسْتَاذُ السُّورُوبَان!',
  12: 'اثْنَا عَشَر! أَنْتَ أُسْطُورَة!',
};

const SHAM_ERROR_PHRASES = [
  'لا بَأْسَ، حَاوِلْ مَرَّةً أُخْرَى!',
  'قَرِيب! رَكِّزْ عَلَى الأَصَابِع!',
  'تَمَهَّلْ قَلِيلاً...',
];

const END_PHRASES_HIGH = ['مُمْتَاز! أَنْتَ مُحَقِّقٌ رَائِع!', 'أَحْسَنْتَ! أَدَاءٌ خَارِق!'];
const END_PHRASES_MID = ['جَيِّدٌ جِدّاً!', 'عَمَلٌ رَائِع!'];
const END_PHRASES_LOW = ['وَاصِلِ التَّدْرِيب!', 'أَنْتَ عَلَى الطَّرِيق!'];

// ═══ الرموز الخمسة ═══
const SYMBOLS = [
  { icon: '⬇️⬇️', name: 'نُزُولٌ مُزْدَوَج', desc: 'سبابة واحدة تُنزل الجدة نحو العارضة وتُبعد الخرزات السفلية' },
  { icon: '⬆️⬆️', name: 'صُعُودٌ مُزْدَوَج', desc: 'سبابة ترفع الجدة + إبهام يرفع الخرزات السفلية نحو العارضة' },
  { icon: '🧡',      name: 'حَرَكَةُ العِمْلَاق 10', desc: 'إبهام يرفع العشرات + سبابة تُبعد الآحاد' },
  { icon: '👍',      name: 'الإِبْهَام', desc: 'يرفع الخرزات السفلية نحو العارضة' },
  { icon: '👇',      name: 'السَّبَّابَة', desc: 'تُحرّك الجدة والخرزات السفلية' },
];

// ═══ أدوات ═══
function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try { navigator.vibrate(pattern); } catch { /* iOS fallback */ }
}

function pickUniquePhrase(phrases: string[], used: Set<string>): string {
  const available = phrases.filter((p) => !used.has(p));
  if (available.length === 0) {
    used.clear();
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  const picked = available[Math.floor(Math.random() * available.length)];
  used.add(picked);
  return picked;
}

function readChildName(): string {
  if (typeof window === 'undefined') return 'بطل';
  try { return localStorage.getItem('soroban_child_name')?.trim() || 'بطل'; } catch { return 'بطل'; }
}

function hasSeenSymbols(): boolean {
  if (typeof window === 'undefined') return true;
  try { return localStorage.getItem(SYMBOL_SEEN_KEY) === 'true'; } catch { return true; }
}

function markSymbolsSeen(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(SYMBOL_SEEN_KEY, 'true'); } catch { /* ignore */ }
}

function getDojoMasterBelt(correct: number): { title: string; color: string } {
  if (correct >= 20) return { title: '🥋 الحِزَامُ الأَسْوَد', color: 'text-amber-300 border-amber-400/60 bg-amber-950/50' };
  if (correct >= 10) return { title: '🥋 الحِزَامُ البُنِّيّ', color: 'text-orange-300 border-orange-400/60 bg-orange-950/50' };
  if (correct >= 5)  return { title: '🥋 الحِزَامُ الأَخْضَر', color: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/50' };
  if (correct >= 2)  return { title: '🥋 الحِزَامُ الأَزْرَق', color: 'text-sky-300 border-sky-500/60 bg-sky-950/50' };
  return { title: '🥋 الحِزَامُ الأَبْيَض', color: 'text-slate-300 border-slate-500/60 bg-slate-900' };
}

function calcAbacusValue(s: AbacusState): number {
  const tens = (s.tensUpper ? 5 : 0) + s.tensLower;
  const ones = (s.onesUpper ? 5 : 0) + s.onesLower;
  return tens * 10 + ones;
}

function isStateEqual(a: AbacusState, b: AbacusState): boolean {
  return (
    a.tensUpper === b.tensUpper &&
    a.tensLower === b.tensLower &&
    a.onesUpper === b.onesUpper &&
    a.onesLower === b.onesLower
  );
}

// ═══════════════════════════════════════════════════════════════════
// شاشة الرموز
// ═══════════════════════════════════════════════════════════════════
function SymbolsScreen({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        className="w-full max-w-md bg-slate-800 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-black text-emerald-300">
            🥋 رُمُوزُ الدُّوجُو
          </h2>
        </div>

        <div className="space-y-2.5 mb-5">
          {SYMBOLS.map((s) => (
            <div
              key={s.icon}
              className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-emerald-500/20"
            >
              <span className="text-2xl shrink-0 bg-black/50 rounded-lg px-2.5 py-1 border border-white/10">
                {s.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-300">{s.name}</p>
                <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => { markSymbolsSeen(); onDismiss(); }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 text-white font-black shadow-lg active:scale-95 transition"
        >
          ▶️ فَهِمْتُ · ابْدَأ
        </button>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// المكوّن الرئيسي
// ═══════════════════════════════════════════════════════════════════
export function FriendsGame({ onBack }: { onBack: () => void }) {
  const { speak } = useCharacterVoice(HERO_ID);
  const addXP = useProgressStore((s) => s.addXP);

  const [showSymbols, setShowSymbols] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [currentProblem, setCurrentProblem] = useState<MultiStepProblem | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [abacusState, setAbacusState] = useState<AbacusState>({
    tensUpper: false, tensLower: 0, onesUpper: false, onesLower: 0,
  });

  const [heroMood, setHeroMood] = useState<HeroMood>('idle');
  const [heroText, setHeroText] = useState('جَاهِزٌ لِلدُّخُول؟');

  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [childName] = useState<string>(readChildName);
  const [previousHigh, setPreviousHigh] = useState<HighScoreEntry | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const usedProblemsRef = useRef<Set<string>>(new Set());
  const usedPhrasesRef = useRef<Set<string>>(new Set());
  const usedThinkingRef = useRef<Set<string>>(new Set());
  const usedCorrectRef = useRef<Set<string>>(new Set());
  const usedErrorRef = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  // تنظيف
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearAllTimeouts]);

  // فحص شاشة الرموز
  useEffect(() => {
    if (!hasSeenSymbols()) {
      setShowSymbols(true);
    }
  }, []);

  // قراءة الرقم القياسي
  useEffect(() => {
    setPreviousHigh(getHighScore(GAME_ID));
  }, []);

  // مؤقت الجلسة
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const timer = setInterval(() => {
      setSessionTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver]);

  // نهاية الجلسة
  useEffect(() => {
    if (sessionTimeLeft === 0 && isPlaying && !isGameOver) {
      // eslint-disable-next-line no-use-before-define
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTimeLeft, isPlaying, isGameOver]);

  // ═══ جلب مسألة جديدة ═══
  const fetchNextProblem = useCallback(() => {
    let pool = MASTER_40_BANK.filter((p) => !usedProblemsRef.current.has(p.id));
    if (pool.length === 0) {
      pool = [...MASTER_40_BANK];
      usedProblemsRef.current.clear();
    }
    const selected = pool[Math.floor(Math.random() * pool.length)];
    usedProblemsRef.current.add(selected.id);

    setCurrentProblem(selected);
    setCurrentStepIndex(0);
    setAbacusState(selected.initialState);
    setHeroMood('thinking');
    setHeroText(`اتْبَعِ الخُطُوَة: ${selected.steps[0].instructionText}`);
  }, []);

  // ═══ إنهاء اللعبة ═══
  const endGame = useCallback(() => {
    setIsGameOver(true);
    setIsPlaying(false);
    clearAllTimeouts();

    const earned = correctCount >= 10 ? 5 : correctCount >= 5 ? 3 : 2;
    setXpEarned(earned);
    addXP(earned);

    const result = addScore(GAME_ID, childName, correctCount, HERO_ID);
    if (result.isNewRecord) {
      setIsNewRecord(true);
      setPreviousHigh(result.previousTop);
      speak('رَقَمٌ قِيَاسِيٌّ جَدِيد!');
    } else {
      setIsNewRecord(false);
      const pool = correctCount >= 10 ? END_PHRASES_HIGH
        : correctCount >= 5 ? END_PHRASES_MID
        : END_PHRASES_LOW;
      const msg = pool[Math.floor(Math.random() * pool.length)];
      setHeroText(msg);
      speak(msg);
    }

    setHeroMood('celebrating');
    vibrate([0, 40, 40, 40, 40, 80]);
  }, [correctCount, addXP, speak, clearAllTimeouts, childName]);

  // ═══ بدء اللعبة ═══
  const handleStartGame = useCallback(() => {
    clearAllTimeouts();
    usedProblemsRef.current.clear();
    usedPhrasesRef.current.clear();
    usedThinkingRef.current.clear();
    usedCorrectRef.current.clear();
    usedErrorRef.current.clear();

    setIsPlaying(true);
    setIsGameOver(false);
    setIsNewRecord(false);
    setSessionTimeLeft(SESSION_SECONDS);
    setCorrectCount(0);
    setXpEarned(0);
    setHeroMood('excited');

    const msg = pickUniquePhrase(SHAM_START_PHRASES, usedPhrasesRef.current);
    setHeroText(msg);
    speak(msg);
    vibrate(50);

    addTimeout(() => { fetchNextProblem(); }, 1200);
  }, [addTimeout, fetchNextProblem, speak, clearAllTimeouts]);

  // ═══ مُحرّك التسلسل ═══
  const handleAbacusChange = useCallback((newState: AbacusState) => {
    if (!currentProblem) return;

    setAbacusState(newState);
    vibrate(30);

    const target = currentProblem.steps[currentStepIndex].targetState;

    if (isStateEqual(newState, target)) {
      vibrate([40, 40]);
      const nextStep = currentStepIndex + 1;

      if (nextStep < currentProblem.steps.length) {
        // خطوة داخلية
        setCurrentStepIndex(nextStep);
        setHeroText(`عَظِيم! تَابِع: ${currentProblem.steps[nextStep].instructionText}`);
      } else {
        // اكتملت المسألة
        vibrate([0, 40, 40, 80]);
        const newCount = correctCount + 1;
        setCorrectCount(newCount);
        setHeroMood('celebrating');

        const milestone = SHAM_MILESTONE_PHRASES[newCount];
        if (milestone) {
          setHeroText(milestone);
          speak(milestone);
        } else {
          const msg = pickUniquePhrase(SHAM_CORRECT_PHRASES, usedCorrectRef.current);
          setHeroText(msg);
          if (newCount % 3 === 0) speak(msg);
        }

        addTimeout(() => {
          setHeroMood('thinking');
          fetchNextProblem();
        }, 1200);
      }
    }
    // لم يطابق → لا شيء · الطفل يجرّب
  }, [currentProblem, currentStepIndex, correctCount, addTimeout, fetchNextProblem, speak]);

  // ═══ إعادة اللعب ═══
  const handleReplay = useCallback(() => {
    const state = useProgressStore.getState();
    if (state.tickets >= 1) {
      state.consumeTicket();
      handleStartGame();
    } else if (state.ticketXP >= 10) {
      state.buyTicket();
      useProgressStore.getState().consumeTicket();
      handleStartGame();
    } else {
      onBack();
    }
  }, [handleStartGame, onBack]);

  const currentBelt = getDojoMasterBelt(correctCount);
  const activeStep = currentProblem ? currentProblem.steps[currentStepIndex] : null;

  // ═══════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/40 to-slate-950 text-white flex flex-col select-none font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      {/* ═══ شاشة الرموز ═══ */}
      <AnimatePresence>
        {showSymbols && <SymbolsScreen onDismiss={() => setShowSymbols(false)} />}
      </AnimatePresence>

      {/* ═══ الرأس ═══ */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 sticky top-0 z-20 bg-slate-900/85 backdrop-blur-md border-b border-emerald-500/30">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition shrink-0"
          aria-label="رجوع"
        >
          <ArrowRight className="w-6 h-6 text-emerald-400" />
        </button>

        <div className="flex-1 flex justify-center">
          <GameCompanion heroId={HERO_ID} mood={heroMood} customText={heroText} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSymbols(true)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            aria-label="الرموز"
            title="الرموز"
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
          </button>
          <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 font-bold text-sm">
            ⏳ <span className="tabular-nums">{sessionTimeLeft}</span>
          </div>
          <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 font-bold text-sm">
            🤝 <span className="tabular-nums">{correctCount}</span>
          </div>
        </div>
      </div>

      {/* ═══ شاشة البداية ═══ */}
      {!isPlaying && !isGameOver && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="w-28 h-28 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-6xl shadow-2xl shadow-emerald-500/30 animate-pulse">
              🧮
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-400">
              دُوجُو السُّورُوبَان
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xs leading-relaxed">
              تَعَلَّمْ حَرَكَاتِ الأَصَابِعِ عِنْدَ العَارِضَةِ الأُصُولِيَّة
            </p>
          </motion.div>

          <HighScoreBadge gameId={GAME_ID} variant="full" />

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleStartGame}
            className="w-full max-w-xs bg-gradient-to-l from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xl py-4 rounded-2xl shadow-xl shadow-emerald-500/30 active:scale-95 transition"
          >
            ▶️ ابْدَأِ التَّدْرِيب
          </motion.button>
        </div>
      )}

      {/* ═══ منطقة اللعب ═══ */}
      {isPlaying && currentProblem && (
        <div className="flex-1 flex flex-col items-center justify-between gap-3 px-4 py-4 max-w-md mx-auto w-full">
          {/* بطاقة السؤال */}
          <motion.div
            key={`q-${currentProblem.id}`}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-900/90 border-2 border-emerald-500/40 rounded-2xl p-3 shadow-xl flex flex-col items-center gap-1.5"
          >
            <div className="flex justify-between items-center w-full mb-1">
              <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${currentBelt.color}`}>
                <Award className="w-4 h-4 text-amber-400" />
                <span className="truncate">{currentBelt.title}</span>
              </div>
              <div className="px-2.5 py-1 rounded-full border border-sky-500/40 bg-sky-950/80 text-sky-300 text-[11px] font-extrabold">
                خُطُوَة {currentStepIndex + 1} / {currentProblem.steps.length}
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">
              {currentProblem.expression}
            </div>

            <div className="text-[11px] font-bold text-slate-300 bg-black/40 px-3 py-1 rounded-full border border-white/10">
              {currentProblem.hint}
            </div>
          </motion.div>

          {/* ═══ المعداد البصري ═══ */}
          <div className="w-full bg-gradient-to-b from-amber-950 via-slate-900 to-amber-950 border-4 border-amber-700/90 rounded-3xl p-5 shadow-2xl relative flex flex-col items-center gap-3">
            {/* العارضة */}
            <div className="absolute top-[42%] left-3 right-3 h-3.5 bg-amber-500 border-y-2 border-amber-300 rounded-sm shadow-inner z-10 flex items-center justify-center">
              <span className="text-[8px] font-black text-amber-950 tracking-widest">
                العَارِضَة
              </span>
            </div>

            <div className="flex justify-around w-full relative z-20">
              {/* عمود العشرات */}
              <div className="flex flex-col items-center gap-6">
                <span className="text-xs font-bold text-amber-400">عَشَرَات</span>
                <div className="h-16 flex items-start">
                  <button
                    onClick={() =>
                      handleAbacusChange({ ...abacusState, tensUpper: !abacusState.tensUpper })
                    }
                    className={`w-14 h-8 rounded-full border-2 transition-transform duration-200 shadow-md ${
                      abacusState.tensUpper
                        ? 'bg-amber-400 border-amber-200 translate-y-7'
                        : 'bg-amber-700 border-amber-900'
                    }`}
                    aria-label="خرزة عشرات علوية"
                  />
                </div>
                <div className="flex flex-col gap-1.5 h-32 justify-end">
                  {[1, 2, 3, 4].map((idx) => {
                    const isActive = idx <= abacusState.tensLower;
                    return (
                      <button
                        key={`t-${idx}`}
                        onClick={() =>
                          handleAbacusChange({
                            ...abacusState,
                            tensLower: abacusState.tensLower === idx ? idx - 1 : idx,
                          })
                        }
                        className={`w-14 h-6 rounded-full border-2 transition-transform duration-200 shadow-md ${
                          isActive
                            ? 'bg-sky-400 border-sky-200 -translate-y-5'
                            : 'bg-sky-800 border-sky-950'
                        }`}
                        aria-label={`خرزة عشرات ${idx}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* عمود الآحاد */}
              <div className="flex flex-col items-center gap-6">
                <span className="text-xs font-bold text-emerald-400">آحَاد</span>
                <div className="h-16 flex items-start">
                  <button
                    onClick={() =>
                      handleAbacusChange({ ...abacusState, onesUpper: !abacusState.onesUpper })
                    }
                    className={`w-14 h-8 rounded-full border-2 transition-transform duration-200 shadow-md ${
                      abacusState.onesUpper
                        ? 'bg-amber-400 border-amber-200 translate-y-7'
                        : 'bg-amber-700 border-amber-900'
                    }`}
                    aria-label="خرزة آحاد علوية"
                  />
                </div>
                <div className="flex flex-col gap-1.5 h-32 justify-end">
                  {[1, 2, 3, 4].map((idx) => {
                    const isActive = idx <= abacusState.onesLower;
                    return (
                      <button
                        key={`o-${idx}`}
                        onClick={() =>
                          handleAbacusChange({
                            ...abacusState,
                            onesLower: abacusState.onesLower === idx ? idx - 1 : idx,
                          })
                        }
                        className={`w-14 h-6 rounded-full border-2 transition-transform duration-200 shadow-md ${
                          isActive
                            ? 'bg-emerald-400 border-emerald-200 -translate-y-5'
                            : 'bg-emerald-800 border-emerald-950'
                        }`}
                        aria-label={`خرزة آحاد ${idx}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* القيمة الحالية */}
            <div className="mt-1 px-4 py-1.5 bg-black/70 rounded-xl border border-amber-500/40 text-amber-300 font-extrabold text-lg font-mono flex items-center gap-2">
              <span>القِيمَة:</span>
              <span className="text-emerald-400 text-xl tabular-nums">
                {calcAbacusValue(abacusState)}
              </span>
            </div>
          </div>

          {/* الشبح التوجيهي */}
          <motion.div
            key={`hud-${currentStepIndex}-${currentProblem.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-900/90 border border-emerald-500/50 rounded-xl p-3 text-center text-xs text-amber-200 font-bold flex items-center justify-between gap-2 shadow-lg"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl bg-black/50 px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
                {activeStep?.fingerSymbol}
              </span>
              <span className="text-right leading-relaxed">{activeStep?.instructionText}</span>
            </div>
            <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          </motion.div>
        </div>
      )}

      {/* ═══ مودال النهاية ═══ */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-4 border-2 ${
                isNewRecord
                  ? 'bg-gradient-to-br from-amber-900/40 via-slate-800 to-amber-900/40 border-amber-400/70'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className="text-5xl">🥋</div>

              {isNewRecord ? (
                <>
                  <h2 className="text-2xl font-black text-amber-300">
                    🎉 رَقَمٌ قِيَاسِيٌّ جَدِيد!
                  </h2>
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-amber-400/30 p-4 flex flex-col gap-2">
                    {previousHigh && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5" />
                          كُنْتَ:
                        </span>
                        <span className="text-slate-300 font-bold tabular-nums">
                          {previousHigh.value} ({previousHigh.name})
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-base">
                      <span className="text-amber-300 flex items-center gap-1.5 font-bold">
                        <Trophy className="w-4 h-4" />
                        الآن:
                      </span>
                      <span className="text-amber-300 font-black text-lg tabular-nums">
                        {correctCount} ({childName})
                      </span>
                    </div>
                    <div className="h-px bg-amber-400/30 my-1" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">طَاقَةُ XP:</span>
                      <span className="text-amber-400 font-bold tabular-nums">
                        +{xpEarned} XP
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-emerald-400">
                    انْتَهَى التَّدْرِيب!
                  </h2>
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-4 flex flex-col gap-2">
                    <p className="text-slate-400 text-xs">الرُّتْبَة:</p>
                    <p className="text-amber-400 font-black text-base">
                      {currentBelt.title}
                    </p>
                    <div className="h-px bg-slate-700/50 my-1" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">العَمَلِيَّاتُ النَّاجِحَة:</span>
                      <span className="text-emerald-400 font-bold text-base tabular-nums">
                        {correctCount}
                      </span>
                    </div>
                    {previousHigh && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5 text-amber-300" />
                          الرَّقَمُ:
                        </span>
                        <span className="text-amber-300 font-bold tabular-nums">
                          {previousHigh.value} ({previousHigh.name})
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">طَاقَةُ XP:</span>
                      <span className="text-amber-400 font-bold text-base tabular-nums">
                        +{xpEarned} XP
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3 w-full mt-1">
                <button
                  onClick={handleReplay}
                  className={`w-full font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2 ${
                    isNewRecord
                      ? 'bg-gradient-to-l from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  إِعَادَةُ التَّدْرِيب
                </button>
                <button
                  onClick={onBack}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  مَدِينَةُ الأَلْعَاب
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* زر إغلاق شاشة الرموز من الرأس */}
      {showSymbols && (
        <button
          onClick={() => setShowSymbols(false)}
          className="fixed top-4 left-4 z-[60] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>
      )}
    </div>
  );
}

export default FriendsGame;