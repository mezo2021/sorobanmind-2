// ═══════════════════════════════════════════════════════════════════
// 🥋 src/components/games/Friends/FriendsGame.tsx   (v2 · ليزر)
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, RotateCcw, Home, Trophy, Crown, Award, Zap,
  X, BookOpen, Sparkles, Star, Flame,
} from 'lucide-react';
import { GameCompanion, type HeroMood } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { useGameVoice } from '@/hooks/useGameVoice';
import { gt, lt, useGameLang } from '../gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import type { CharacterType } from '@/types';
import {
  MASTER_40_BANK,
  type MultiStepProblem,
  type AbacusState,
} from './bank';
import { LaserAbacus, mismatch, diffBeadKeys, rodValue, type LaserTheme } from './LaserAbacus';
import { Num } from '@/components/Num';

// ═══ ثوابت ═══
const SESSION_SECONDS = 90;
const GAME_ID = 'friends';
const HERO_ID: CharacterType = 'sham';
const SYMBOL_SEEN_KEY = 'soroban_friends_symbol_seen_v1';
const WEAK_KEY = 'soroban_friends_weak_v1';
const THEME_KEY = 'soroban_laser_theme_v1';
const IDLE_HINT_MS = 6000;
const REVERT_MS = 850;
const EMPTY_STATE: AbacusState = { tensUpper: false, tensLower: 0, onesUpper: false, onesLower: 0 };

const RULE_LABEL: Record<MultiStepProblem['rule'], string> = {
  f5: 'أَصْدِقَاءُ 5',
  f10: 'أَصْدِقَاءُ 10',
  combined: 'مُرَكَّب',
};

// ═══ حوارات شام ═══
const SHAM_START_PHRASES = [
  'أَهْلاً بِكَ فِي دُوجُو السُّورُوبَان! جَاهِزْ؟',
  'هَيَّا نَكْتَشِفُ الأَصْدِقَاءَ الخَفِيِّينَ!',
  'اليَوْمَ سَنُحَرِّكُ الخَرَزَاتِ كَأَبْطَالٍ!',
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
  'لا بَأْسَ، أَرْجِعِ الخَرَزَاتِ وَحَاوِلْ!',
  'قَرِيب! رَكِّزْ عَلَى الأَصَابِع!',
  'تَمَهَّلْ قَلِيلاً... العَارِضَةُ تُرْشِدُكَ.',
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

// صوت خفيف بدون ملفات
let audioCtx: AudioContext | null = null;
function beep(freq: number, dur = 0.07, type: OscillatorType = 'sine', gain = 0.05, delay = 0): void {
  if (typeof window === 'undefined') return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    audioCtx = audioCtx ?? new Ctx();
    const t0 = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch { /* ignore */ }
}
const sfxTick = () => beep(520, 0.04, 'triangle', 0.04);
const sfxStep = () => { beep(660, 0.08); beep(880, 0.1, 'sine', 0.05, 0.08); };
const sfxDone = () => { beep(660, 0.1); beep(880, 0.1, 'sine', 0.05, 0.1); beep(1175, 0.18, 'sine', 0.06, 0.2); };
const sfxError = () => beep(160, 0.22, 'sawtooth', 0.045);

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
  if (typeof window === 'undefined') return gt('بطل');
  try { return useProgressStore.getState().childName?.trim() || gt('بطل'); } catch { return gt('بطل'); }
}
function hasSeenSymbols(): boolean {
  if (typeof window === 'undefined') return true;
  try { return localStorage.getItem(SYMBOL_SEEN_KEY) === 'true'; } catch { return true; }
}
function markSymbolsSeen(): void {
  try { localStorage.setItem(SYMBOL_SEEN_KEY, 'true'); } catch { /* ignore */ }
}
function loadWeak(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(WEAK_KEY) || '{}') as Record<string, number>; } catch { return {}; }
}
function saveWeak(w: Record<string, number>): void {
  try { localStorage.setItem(WEAK_KEY, JSON.stringify(w)); } catch { /* ignore */ }
}
function loadTheme(): LaserTheme {
  try { return localStorage.getItem(THEME_KEY) === 'red' ? 'red' : 'blue'; } catch { return 'blue'; }
}

function getDojoMasterBelt(correct: number): { title: string; color: string } {
  if (correct >= 20) return { title: '🥋 الحِزَامُ الأَسْوَد', color: 'text-amber-300 border-amber-400/60 bg-amber-950/50' };
  if (correct >= 10) return { title: '🥋 الحِزَامُ البُنِّيّ', color: 'text-orange-300 border-orange-400/60 bg-orange-950/50' };
  if (correct >= 5)  return { title: '🥋 الحِزَامُ الأَخْضَر', color: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/50' };
  if (correct >= 2)  return { title: '🥋 الحِزَامُ الأَزْرَق', color: 'text-sky-300 border-sky-500/60 bg-sky-950/50' };
  return { title: '🥋 الحِزَامُ الأَبْيَض', color: 'text-slate-300 border-slate-500/60 bg-slate-900' };
}

function calcAbacusValue(s: AbacusState): number {
  return rodValue(s, 't') * 10 + rodValue(s, 'o');
}
function isStateEqual(a: AbacusState, b: AbacusState): boolean {
  return mismatch(a, b) === 0;
}

/** اختيار مسألة بوزن أعلى للقواعد التي أخطأ فيها الطفل سابقاً */
function pickWeighted(pool: MultiStepProblem[], weak: Record<string, number>): MultiStepProblem {
  const weights = pool.map((p) => 1 + Math.min(weak[p.rule] ?? 0, 10) * 0.4);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/** شرح الخطأ كما يفعل معلّم السوروبان */
function explainError(prev: AbacusState, next: AbacusState, target: AbacusState): string {
  const rodMis = (a: AbacusState, rod: 't' | 'o') =>
    rod === 't'
      ? (a.tensUpper !== target.tensUpper ? 1 : 0) + Math.abs(a.tensLower - target.tensLower)
      : (a.onesUpper !== target.onesUpper ? 1 : 0) + Math.abs(a.onesLower - target.onesLower);

  for (const rod of ['t', 'o'] as const) {
    if (rodMis(next, rod) > rodMis(prev, rod)) {
      const name = rod === 't' ? gt('العَشَرَات (يَسَار)') : gt('الآحَاد (يَمِين)');
      if (rodMis(prev, rod) === 0) {
        return lt(`عَمُودُ ${name} كَانَ صَحِيحاً! لا تَلْمِسْهُ.`, `The ${name} column was correct! Do not touch it.`);
      }
      const upperMoved = rod === 't' ? prev.tensUpper !== next.tensUpper : prev.onesUpper !== next.onesUpper;
      if (upperMoved) return gt('الجَدَّةُ (٥) تَحَرَّكَتْ بِالاتِّجَاهِ المُعَاكِس.');
      return gt('حَرَّكْتَ خَرَزَاتٍ أَكْثَرَ أَوْ أَقَلَّ مِمَّا يَلْزَم.');
    }
  }
  return gt('هَذِهِ الحَرَكَةُ تُبْعِدُكَ عَنِ الهَدَف.');
}

// ═══════════════════════════════════════════════════════════════════
// شاشة الرموز
// ═══════════════════════════════════════════════════════════════════
function SymbolsScreen({ onDismiss, dir }: { onDismiss: () => void; dir: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
      dir={dir}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        className="w-full max-w-md bg-slate-800 border-2 border-sky-500/50 rounded-3xl p-5 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-black text-sky-300">🥋 {gt('رُمُوزُ الدُّوجُو')}</h2>
        </div>

        <div className="space-y-2.5 mb-5">
          {SYMBOLS.map((s) => (
            <div key={s.icon} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-sky-500/20">
              <span className="text-2xl shrink-0 bg-black/50 rounded-lg px-2.5 py-1 border border-white/10">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-sky-300">{gt(s.name)}</p>
                <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">{gt(s.desc)}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => { markSymbolsSeen(); onDismiss(); }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-sky-500 to-blue-600 text-white font-black shadow-lg active:scale-95 transition"
        >
          ▶️ {gt('فَهِمْتُ')} · {gt('ابْدَأ')}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// المكوّن الرئيسي
// ═══════════════════════════════════════════════════════════════════
export function FriendsGame({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const { speak } = useGameVoice(HERO_ID);
  const addXP = useProgressStore((s) => s.addXP);

  const [showSymbols, setShowSymbols] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [currentProblem, setCurrentProblem] = useState<MultiStepProblem | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [abacusState, setAbacusState] = useState<AbacusState>(EMPTY_STATE);

  const [laserTheme, setLaserTheme] = useState<LaserTheme>(loadTheme);
  const [showGuide, setShowGuide] = useState(false);
  const [locked, setLockedState] = useState(false);
  const [errorBeads, setErrorBeads] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastStars, setLastStars] = useState<number | null>(null);

  const [heroMood, setHeroMood] = useState<HeroMood>('idle');
  const [heroText, setHeroText] = useState('جَاهِزٌ لِلدُّخُول؟');

  const [correctCount, setCorrectCount] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [childName] = useState<string>(readChildName);
  const [previousHigh, setPreviousHigh] = useState<HighScoreEntry | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // مراجع (لتفادي القيم القديمة داخل المؤقّتات)
  const correctRef = useRef(0);
  const perfectRef = useRef(0);
  const streakRef = useRef(0);
  const problemErrRef = useRef(0);
  const lockedRef = useRef(false);
  const weakRef = useRef<Record<string, number>>({});
  const usedProblemsRef = useRef<Set<string>>(new Set());
  const usedPhrasesRef = useRef<Set<string>>(new Set());
  const usedCorrectRef = useRef<Set<string>>(new Set());
  const usedErrorRef = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const setLocked = useCallback((v: boolean) => {
    lockedRef.current = v;
    setLockedState(v);
  }, []);

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

  // تحميل أولي
  useEffect(() => {
    if (!hasSeenSymbols()) setShowSymbols(true);
    setPreviousHigh(getHighScore(GAME_ID));
    weakRef.current = loadWeak();
  }, []);

  // مؤقت الجلسة
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const timer = setInterval(() => {
      setSessionTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver]);

  // ═══ إنهاء اللعبة ═══
  const endGame = useCallback(() => {
    setIsGameOver(true);
    setIsPlaying(false);
    setLocked(true);
    clearAllTimeouts();

    const correct = correctRef.current;
    const perfect = perfectRef.current;
    const earned = (correct >= 10 ? 5 : correct >= 5 ? 3 : 2) + (perfect >= 5 ? 1 : 0);
    setXpEarned(earned);
    addXP(earned);

    const result = addScore(GAME_ID, childName, correct, HERO_ID);
    if (result.isNewRecord) {
      setIsNewRecord(true);
      setPreviousHigh(result.previousTop);
      speak(gt('رَقَمٌ قِيَاسِيٌّ جَدِيد!'));
    } else {
      setIsNewRecord(false);
      const pool = correct >= 10 ? END_PHRASES_HIGH : correct >= 5 ? END_PHRASES_MID : END_PHRASES_LOW;
      const msg = pool[Math.floor(Math.random() * pool.length)];
      setHeroText(gt(msg)); // ✅ [Fix Sound AR/EN]
      speak(gt(msg)); // ✅ [Fix Sound AR/EN]
    }
    setHeroMood('celebrating');
    vibrate([0, 40, 40, 40, 40, 80]);
    sfxDone();
  }, [addXP, speak, clearAllTimeouts, childName, setLocked]);

  // نهاية الجلسة
  useEffect(() => {
    if (sessionTimeLeft === 0 && isPlaying && !isGameOver) endGame();
  }, [sessionTimeLeft, isPlaying, isGameOver, endGame]);

  // ═══ تلميح الخمول: يظهر الشبح الأزرق إن لم يتحرك الطفل ═══
  useEffect(() => {
    if (!isPlaying || !currentProblem || locked) return;
    const id = setTimeout(() => setShowGuide(true), IDLE_HINT_MS);
    return () => clearTimeout(id);
  }, [isPlaying, currentProblem, currentStepIndex, abacusState, locked]);

  // ═══ جلب مسألة جديدة ═══
  const fetchNextProblem = useCallback(() => {
    let pool = MASTER_40_BANK.filter((p) => !usedProblemsRef.current.has(p.id));
    if (pool.length === 0) {
      pool = [...MASTER_40_BANK];
      usedProblemsRef.current.clear();
    }
    const selected = pickWeighted(pool, weakRef.current);
    usedProblemsRef.current.add(selected.id);

    problemErrRef.current = 0;
    setCurrentProblem(selected);
    setCurrentStepIndex(0);
    setAbacusState(selected.initialState);
    setShowGuide(false);
    setErrorBeads(new Set());
    setErrorMsg(null);
    setLastStars(null);
    setLocked(false);
    setHeroMood('thinking');
    setHeroText(`${gt('اتْبَعِ الخُطُوَة')}: ${gt(selected.steps[0].instructionText)}`);
  }, [setLocked]);

  // ═══ بدء اللعبة ═══
  const handleStartGame = useCallback(() => {
    clearAllTimeouts();
    usedProblemsRef.current.clear();
    usedPhrasesRef.current.clear();
    usedCorrectRef.current.clear();
    usedErrorRef.current.clear();
    correctRef.current = 0;
    perfectRef.current = 0;
    streakRef.current = 0;
    problemErrRef.current = 0;
    weakRef.current = loadWeak();

    setIsPlaying(true);
    setIsGameOver(false);
    setIsNewRecord(false);
    setSessionTimeLeft(SESSION_SECONDS);
    setCorrectCount(0);
    setPerfectCount(0);
    setTotalErrors(0);
    setStreak(0);
    setXpEarned(0);
    setCurrentProblem(null);
    setLocked(true);
    setHeroMood('excited');

    const msg = pickUniquePhrase(SHAM_START_PHRASES, usedPhrasesRef.current);
    const greetMsg = `${gt('أهلاً')} ${childName}! ${gt(msg)}`;
    setHeroText(greetMsg);
    speak(greetMsg);
    vibrate(50);

    addTimeout(() => { fetchNextProblem(); }, 1200);
  }, [addTimeout, fetchNextProblem, speak, clearAllTimeouts, setLocked, childName]);

  // ═══ إتمام مسألة كاملة ═══
  const completeProblem = useCallback(() => {
    const errs = problemErrRef.current;
    const stars = errs === 0 ? 3 : errs === 1 ? 2 : 1;
    const newCount = correctRef.current + 1;
    correctRef.current = newCount;
    setCorrectCount(newCount);
    setLastStars(stars);
    setLocked(true);
    setHeroMood('celebrating');
    sfxDone();
    vibrate([0, 40, 40, 80]);

    if (errs === 0) {
      perfectRef.current += 1;
      streakRef.current += 1;
      setPerfectCount(perfectRef.current);
      setStreak(streakRef.current);
    } else {
      streakRef.current = 0;
      setStreak(0);
    }

    const milestone = SHAM_MILESTONE_PHRASES[newCount];
    if (milestone) {
      setHeroText(gt(milestone)); // ✅ [Fix Sound AR/EN]
      speak(gt(milestone)); // ✅ [Fix Sound AR/EN]
    } else {
      const msg = pickUniquePhrase(SHAM_CORRECT_PHRASES, usedCorrectRef.current);
      setHeroText(gt(msg)); // ✅ [Fix Sound AR/EN]
      if (newCount % 3 === 0) speak(gt(msg)); // ✅ [Fix Sound AR/EN]
    }

    addTimeout(() => { fetchNextProblem(); }, 1300);
  }, [addTimeout, fetchNextProblem, speak, setLocked]);

  // ═══ محرّك التسلسل + تصحيح الخطأ ═══
  const handleAbacusChange = useCallback((next: AbacusState) => {
    if (!currentProblem || lockedRef.current) return;

    const step = currentProblem.steps[currentStepIndex];
    const target = step.targetState;
    const prev = abacusState;

    setAbacusState(next);

    // ✅ وصل للهدف
    if (isStateEqual(next, target)) {
      setShowGuide(false);
      setErrorMsg(null);
      const nextStep = currentStepIndex + 1;
      if (nextStep < currentProblem.steps.length) {
        sfxStep();
        vibrate([40, 40]);
        setCurrentStepIndex(nextStep);
        setHeroText(`${gt('عَظِيم! تَابِع')}: ${gt(currentProblem.steps[nextStep].instructionText)}`);
      } else {
        completeProblem();
      }
      return;
    }

    // ❌ حركة تُبعد عن الهدف → تصحيح
    if (mismatch(next, target) > mismatch(prev, target)) {
      problemErrRef.current += 1;
      const errs = problemErrRef.current;
      const weak = weakRef.current;
      weak[currentProblem.rule] = (weak[currentProblem.rule] ?? 0) + 1;
      saveWeak(weak);

      streakRef.current = 0;
      setStreak(0);
      setTotalErrors((n) => n + 1);
      setErrorBeads(new Set(diffBeadKeys(prev, next)));
      setErrorMsg(`${explainError(prev, next, target)}  ·  ${gt(currentProblem.hint)}`);
      setLocked(true);
      sfxError();
      vibrate([60, 40, 60]);
      if (errs === 1) {
        const msg = pickUniquePhrase(SHAM_ERROR_PHRASES, usedErrorRef.current);
        setHeroText(gt(msg)); // ✅ [Fix Sound AR/EN]
        speak(gt(msg)); // ✅ [Fix Sound AR/EN]
      }

      // إرجاع الخرزات إلى ما قبل الخطأ (كما يفعل المعلّم)
      addTimeout(() => {
        setAbacusState(prev);
        setErrorBeads(new Set());
        setLocked(false);
        if (errs >= 2) setShowGuide(true);   // التلميح الأزرق بعد خطأين
      }, REVERT_MS);
      return;
    }

    // حركة وسطية سليمة
    sfxTick();
    vibrate(20);
    setErrorMsg(null);
  }, [currentProblem, currentStepIndex, abacusState, completeProblem, addTimeout, speak, setLocked]);

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

  const toggleTheme = () => {
    const next: LaserTheme = laserTheme === 'blue' ? 'red' : 'blue';
    setLaserTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
  };

  const currentBelt = getDojoMasterBelt(correctCount);
  const activeStep = currentProblem ? currentProblem.steps[currentStepIndex] : null;
  const accuracy = correctCount > 0 ? Math.round((perfectCount / correctCount) * 100) : 0;
  const weakest = Object.entries(weakRef.current).sort((a, b) => b[1] - a[1])[0];
  const timePct = (sessionTimeLeft / SESSION_SECONDS) * 100;

  // ═══════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════
  return (
    <div
      dir={dir}
      className="min-h-screen bg-gradient-to-b from-slate-950 via-sky-950/30 to-slate-950 text-white flex flex-col select-none font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      <AnimatePresence>
        {showSymbols && <SymbolsScreen onDismiss={() => setShowSymbols(false)} dir={dir} />}
      </AnimatePresence>

      {/* ═══ الرأس ═══ */}
      <div className="sticky top-0 z-20 bg-slate-900/85 backdrop-blur-md border-b border-sky-500/30">
        <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
          <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition shrink-0" aria-label={gt('رجوع')}>
            <ArrowRight className={`w-6 h-6 text-sky-400 ${isAr ? '' : 'rotate-180'}`} />
          </button>

          <div className="flex-1 flex justify-center">
            <GameCompanion heroId={HERO_ID} mood={heroMood} customText={gt(heroText)} />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              aria-label={gt('لون الليزر')}
              title={gt('لون الليزر')}
            >
              <Sparkles className={`w-4 h-4 ${laserTheme === 'blue' ? 'text-sky-400' : 'text-rose-400'}`} />
            </button>
            <button
              onClick={() => setShowSymbols(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              aria-label={gt('الرموز')}
            >
              <BookOpen className="w-4 h-4 text-sky-300" />
            </button>
            <div className="bg-slate-950/80 px-2 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 font-bold text-sm">
              ⏳ <span className="tabular-nums"><Num>{sessionTimeLeft}</Num></span>
            </div>
            <div className="bg-slate-950/80 px-2 py-1.5 rounded-lg border border-sky-500/30 text-sky-300 font-bold text-sm">
              🤝 <span className="tabular-nums"><Num>{correctCount}</Num></span>
            </div>
          </div>
        </div>
        {isPlaying && (
          <div className="h-1 bg-slate-800">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${timePct > 30 ? 'bg-sky-400' : 'bg-rose-500'}`}
              style={{ width: `${timePct}%` }}
            />
          </div>
        )}
      </div>

      {/* ═══ شاشة البداية ═══ */}
      {!isPlaying && !isGameOver && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="flex flex-col items-center gap-3 text-center w-full max-w-[240px]"
          >
            <LaserAbacus
              state={{ tensUpper: false, tensLower: 1, onesUpper: true, onesLower: 2 }}
              onChange={() => {}}
              locked
              compact
              theme={laserTheme}
            />
            <h1 className="text-3xl font-black text-sky-300 mt-1">{gt('دُوجُو السُّورُوبَان')}</h1>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              {gt('العَشَرَاتُ يَسَاراً')} · {gt('الآحَادُ يَمِيناً. تَعَلَّمْ حَرَكَاتِ الأَصْدِقَاءِ بِالأَصَابِع.')}
            </p>
          </motion.div>

          <HighScoreBadge gameId={GAME_ID} variant="full" />

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleStartGame}
            className="w-full max-w-xs bg-gradient-to-l from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xl py-4 rounded-2xl shadow-xl shadow-sky-500/30 active:scale-95 transition"
          >
            ▶️ {gt('ابْدَأِ التَّدْرِيب')}
          </motion.button>
        </div>
      )}

      {/* ═══ منطقة اللعب ═══ */}
      {isPlaying && !currentProblem && (
        <div className="flex-1 flex items-center justify-center text-sky-300 font-black text-lg animate-pulse">
          🥋 {gt('اسْتَعِدّ...')}
        </div>
      )}

      {isPlaying && currentProblem && (
        <div className="flex-1 flex flex-col items-center gap-3 px-4 py-3 max-w-md mx-auto w-full">
          {/* بطاقة السؤال */}
          <motion.div
            key={`q-${currentProblem.id}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-900/90 border-2 border-sky-500/40 rounded-2xl p-3 shadow-xl flex flex-col items-center gap-1.5"
          >
            <div className="flex justify-between items-center w-full mb-0.5">
              <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${currentBelt.color}`}>
                <Award className="w-4 h-4 text-amber-400" />
                <span className="truncate">{gt(currentBelt.title)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {streak >= 2 && (
                  <div className="px-2 py-1 rounded-full border border-orange-400/50 bg-orange-950/70 text-orange-300 text-[11px] font-extrabold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span className="tabular-nums"><Num>{streak}</Num></span>
                  </div>
                )}
                <div className="px-2.5 py-1 rounded-full border border-sky-500/40 bg-sky-950/80 text-sky-300 text-[11px] font-extrabold">
                  {gt(RULE_LABEL[currentProblem.rule])}
                </div>
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono" dir="ltr">
              <Num>{currentProblem.expression}</Num>
            </div>

            <div className="flex items-center gap-2 w-full justify-center">
              {currentProblem.steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i < currentStepIndex ? 'w-6 bg-emerald-400'
                    : i === currentStepIndex ? 'w-8 bg-sky-400'
                    : 'w-6 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* ═══ المعداد ═══ */}
          <motion.div
            animate={errorBeads.size > 0 ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-[340px] rounded-3xl border border-slate-700/80 bg-slate-950/70 p-3 shadow-2xl"
            style={{
              boxShadow: errorBeads.size > 0
                ? `0 0 38px ${laserTheme === 'blue' ? '#ef444466' : '#fde04766'}`
                : `0 0 34px ${laserTheme === 'blue' ? '#0ea5e933' : '#f43f5e33'}`,
            }}
          >
            <LaserAbacus
              state={abacusState}
              onChange={handleAbacusChange}
              target={activeStep?.targetState ?? null}
              showGuide={showGuide}
              errorBeads={errorBeads}
              locked={locked}
              theme={laserTheme}
            />
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400" dir="rtl">
              <span>{gt('القِيمَةُ')}:</span>
              <span className="text-sky-300 text-base font-black tabular-nums font-mono"><Num>{calcAbacusValue(abacusState)}</Num></span>
            </div>

            {/* نجوم المسألة */}
            <AnimatePresence>
              {lastStars !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-3xl bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2"
                >
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((n) => (
                      <motion.div
                        key={n}
                        initial={{ scale: 0, rotate: -40 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: n * 0.12, type: 'spring', stiffness: 300 }}
                      >
                        <Star className={`w-10 h-10 ${n <= lastStars ? 'text-amber-300 fill-amber-300' : 'text-slate-600'}`} />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-amber-200 font-black text-sm">
                    {lastStars === 3 ? gt('بِلا أَخْطَاء!') : lastStars === 2 ? gt('خَطَأٌ وَاحِد فَقَط') : gt('أَحْسَنْتَ المُحَاوَلَة')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ═══ المعلّم: تصحيح الخطأ أو توجيه الحركة ═══ */}
          <div className="w-full min-h-[84px]">
            <AnimatePresence mode="wait">
              {errorMsg ? (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full bg-rose-950/80 border border-rose-500/60 rounded-xl p-3 text-xs text-rose-200 font-bold leading-relaxed flex items-start gap-2 shadow-lg shadow-rose-900/30"
                >
                  <span className="text-lg shrink-0">🚫</span>
                  <span>{errorMsg}</span>
                </motion.div>
              ) : (
                <motion.div
                  key={`hud-${currentProblem.id}-${currentStepIndex}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full bg-slate-900/90 border border-sky-500/50 rounded-xl p-3 text-xs text-sky-100 font-bold flex items-center justify-between gap-2 shadow-lg"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl bg-black/50 px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
                      {activeStep?.fingerSymbol}
                    </span>
                    <span className="leading-relaxed">{gt(activeStep?.instructionText ?? '')}</span>
                  </div>
                  <Zap className="w-4 h-4 text-sky-400 shrink-0 animate-bounce" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            dir={dir}
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

              <h2 className={`text-2xl font-black ${isNewRecord ? 'text-amber-300' : 'text-sky-300'}`}>
                {isNewRecord ? gt('🎉 رَقَمٌ قِيَاسِيٌّ جَدِيد!') : gt('انْتَهَى التَّدْرِيب!')}
              </h2>

              <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-4 flex flex-col gap-2">
                <p className="text-amber-400 font-black text-base">{gt(currentBelt.title)}</p>
                <div className="h-px bg-slate-700/50 my-1" />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{gt('العَمَلِيَّاتُ النَّاجِحَة')}:</span>
                  <span className="text-sky-300 font-bold text-base tabular-nums"><Num>{correctCount}</Num></span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{gt('بِلا أَخْطَاء')} (⭐⭐⭐):</span>
                  <span className="text-emerald-300 font-bold tabular-nums"><Num>{perfectCount} · {accuracy}</Num>%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{gt('عَدَدُ الأَخْطَاء')}:</span>
                  <span className="text-rose-300 font-bold tabular-nums"><Num>{totalErrors}</Num></span>
                </div>
                {weakest && totalErrors > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{gt('تَحْتَاجُ تَدْرِيباً فِي')}:</span>
                    <span className="text-amber-300 font-bold">
                      {RULE_LABEL[weakest[0] as MultiStepProblem['rule']] ?? weakest[0]}
                    </span>
                  </div>
                )}
                {previousHigh && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      {isNewRecord ? <Crown className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5 text-amber-300" />}
                      {isNewRecord ? gt('كُنْتَ:') : gt('الرَّقَمُ:')}
                    </span>
                    <span className="text-amber-300 font-bold tabular-nums">
                      {previousHigh.value} ({gt(previousHigh.name)})
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{gt('طَاقَةُ')} XP:</span>
                  <span className="text-amber-400 font-bold text-base tabular-nums">+<Num>{xpEarned}</Num> XP</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full mt-1">
                <button
                  onClick={handleReplay}
                  className={`w-full font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2 ${
                    isNewRecord
                      ? 'bg-gradient-to-l from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  {gt('إِعَادَةُ التَّدْرِيب')}
                </button>
                <button
                  onClick={onBack}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  {gt('مَدِينَةُ الأَلْعَاب')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* زر إغلاق شاشة الرموز */}
      {showSymbols && (
        <button
          onClick={() => setShowSymbols(false)}
          className="fixed top-4 left-4 z-[60] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          aria-label={gt('إغلاق')}
        >
          <X className="w-5 h-5 text-white/70" />
        </button>
      )}
    </div>
  );
}

export default FriendsGame;
// ✅ [Fix Sound AR/EN] — تم فحص كل استدعاءات speak() و setBanaMsg() وإضافة gt() حيث لزم.