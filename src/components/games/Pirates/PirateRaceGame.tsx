// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/PirateRaceGame.tsx — v2
// ═══════════════════════════════════════════════════════════════════
//
// سباق القراصنة · 90 ثانية · ضرب السوروبان
//
// ما تغيّر عن v1:
//   1. ساعة لعب واحدة (interval 100ms · dt محسوب) بدل setTimeout داخل setState
//      ← لا عقوبة مضاعفة في StrictMode · ويتوقف الزمن تلقائياً أثناء المراجعة.
//   2. الجولة تنتهي بـ 90 ثانية: الفوز = gap > 0 عندها. gap يُسقَّف عند 100.
//   3. شدّ الحبل: القراصنة يقتربون وحدهم (1 كل 3 ث بعد إحماء 20 ث)،
//      مدافعهم تقلّص وقت المسألة إذا gap > 80، وحبل ريان إذا gap < 30.
//   4. handleRope بدل useRayanRope.
//   5. المستويات: كل 3 صحيحات · سقف 3 قبل الثانية 60 · المستوى 4 ≤ ثلث المسائل.
//   6. الجسر التعليمي: بعد الخطأ/المهلة فقط · 0.8 ث/خطوة · تخطٍّ باللمس ·
//      يُبرز الخطوة الخاطئة عبر option.stepIndex القادم من المحرّك.
//   7. إصلاح عرض المعداد: activeRods = 4 − onesRod (الأعمدة من اليسار).
//   8. مسألة ذهبية مرتين في الجولة (نقاط ×2 · بلا عقوبة) + كومبو + مدفع ريان.
//   9. النجوم من gap الأخير · وصندوق الكنز على شاشة النصر.
//  10. ضرب + قسمة عبر quizFactory (QuizProblem المشترك).
//  11. الجسر التعليمي = SolutionPlayer (تفاعلي · كل الخطوات ظاهرة).
//
// [FIX NAME] — اسم الطفل صوتياً في startRace — 2026-10-13
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, RotateCcw, Home, Trophy, Crown, Hand, Star,
  Volume2, VolumeX,
} from 'lucide-react';
import { GameCompanion, type HeroMood } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import { useProgressStore } from '@/store/progressStore';
import { isPreviewMode } from '@/utils/previewMode';
import type { CharacterType } from '@/types';
import SolutionPlayer from './SolutionPlayer';
import PirateScene from './PirateScene';
import { seaSfx } from './seaSfx';
import { adaptiveTime, type MulLevel } from './mulEngine';
import type { QuizProblem, QuizOption, ReviewInfo } from './quizTypes';
import { generateQuiz, pickOp } from './quizFactory';

const Scene = React.memo(PirateScene);

// ═══ ثوابت ═══
const SESSION_SECONDS = 90;
const GAME_ID = 'pirate-race';
const HERO_ID: CharacterType = 'rayan';
const SOUND_KEY = 'pirate_sound_v1';

const GAP_START = 60;
const GAP_MAX = 100;
const DRAG_PER_SEC = 1 / 3;     // القراصنة يقتربون 1 كل 3 ث
const WARMUP_SEC = 20;          // لا سحب في أول 20 ث
const WARMUP_LEVEL_SEC = 30;    // سقف المستوى 2 قبل الثانية 30
const LEVEL4_MIN_SEC = 60;
const ROPE_THRESHOLD = 30;
const CANNON_THRESHOLD = 80;
const LOSS_WRONG = 12;
const LOSS_TIMEOUT = 15;
const REVEAL_MS = 450;

// ═══ أنواع ═══
type Phase = 'welcome' | 'ready' | 'playing' | 'reveal' | 'review' | 'caught' | 'victory' | 'defeat';
type Weather = 'sunny' | 'rain' | 'storm';

interface PirateRaceGameProps {
  onBack: () => void;
}

interface Hud {
  gap: number;
  elapsed: number;
  left: number;
  max: number;
}

// ═══ عبارات ═══
const WRONG_PHRASES = [
  'لا بَأْس! تَعَلَّمْ مِنَ الخُطُوَات.',
  'قَرِيب! انْظُرْ أَيْنَ الخَطَأ.',
  'القَرَاصِنَةُ تَقَدَّمُوا... هَيَّا نَلْحَق!',
];

// ═══ أدوات ═══
function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try { navigator.vibrate(pattern); } catch { /* iOS */ }
}

function readChildName(): string {
  if (typeof window === 'undefined') return 'بطل';
  try { return useProgressStore.getState().childName?.trim() || 'بطل'; } catch { return 'بطل'; }
}

function loadSound(): boolean {
  try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch { return true; }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** المستوى: كل 3 صحيحات · سقف 3 · الرابع متأخر ونادر */
function pickLevel(score: number, elapsed: number): MulLevel {
  let lvl = Math.min(3, Math.floor(score / 3) + 1);
  if (elapsed < WARMUP_LEVEL_SEC) lvl = Math.min(lvl, 2);
  if (elapsed >= LEVEL4_MIN_SEC && score >= 9 && Math.random() < 1 / 3) lvl = 4;
  return lvl as MulLevel;
}

/** الطقس = الأسوأ بين مرحلة الزمن وحالة الفجوة */
function getWeather(gap: number, elapsed: number): Weather {
  const byTime = elapsed < 30 ? 0 : elapsed < 60 ? 1 : 2;
  const byGap = gap >= 60 ? 0 : gap >= 30 ? 1 : 2;
  return (['sunny', 'rain', 'storm'] as const)[Math.max(byTime, byGap)];
}

function starsFromGap(gap: number): number {
  return gap >= 75 ? 3 : gap >= 45 ? 2 : 1;
}

function defaultBubble(gap: number, streak: number, ropeAvail: boolean, elapsed: number): string {
  if (gap < ROPE_THRESHOLD && ropeAvail) return 'خُذْ حَبْلَ الإِنْقَاذ! 🤝';
  if (gap < 40) return 'القَرَاصِنَةُ يَقْتَرِبُون!';
  if (elapsed >= SESSION_SECONDS - 10) return 'الجَزِيرَةُ أَمَامَنَا! 🏝️';
  if (streak >= 3) return 'أَنْتَ أُسْطُورَة! 🔥';
  if (gap > CANNON_THRESHOLD) return 'نَحْنُ فِي المُقَدِّمَة!';
  return 'أَسْرِعْ يَا بَطَل!';
}

// ═══════════════════════════════════════════════════════════════════
// المكوّن الرئيسي
// ═══════════════════════════════════════════════════════════════════
export function PirateRaceGame({ onBack }: PirateRaceGameProps) {
  const { speak } = useCharacterVoice(HERO_ID);
  const addXP = useProgressStore((s) => s.addXP);
  const tickets = useProgressStore((s) => s.tickets);
  const buyTicket = useProgressStore((s) => s.buyTicket);
  const consumeTicket = useProgressStore((s) => s.consumeTicket);

  // ═══ الطور ═══
  const [phase, setPhaseState] = useState<Phase>('welcome');
  const phaseRef = useRef<Phase>('welcome');
  const goPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  // ═══ مصدر الحقيقة (مراجع) ═══
  const gapRef = useRef(GAP_START);
  const elapsedRef = useRef(0);
  const leftRef = useRef(8);
  const maxRef = useRef(8);
  const scoreRef = useRef(0);
  const pointsRef = useRef(0);
  const streakRef = useRef(0);
  const wrongStreakRef = useRef(0);
  const wrongCountRef = useRef(0);
  const ropeUsedRef = useRef(false);
  const answeredRef = useRef(true);
  const goldenRef = useRef(false);
  const goldenQueueRef = useRef<number[]>([]);
  const dangerWarnedRef = useRef(false);
  const finishedRef = useRef(false);
  const problemRef = useRef<QuizProblem | null>(null);
  const lastTickRef = useRef(0);
  const stepClockRef = useRef<(dt: number) => void>(() => {});

  // ═══ حالة العرض ═══
  const [hud, setHud] = useState<Hud>({ gap: GAP_START, elapsed: 0, left: 8, max: 8 });
  const [scoreCount, setScoreCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState<MulLevel>(1);
  const [ropeUsed, setRopeUsed] = useState(false);
  const [isGolden, setIsGolden] = useState(false);
  const [isLightning, setIsLightning] = useState(false);
  const [soundOn, setSoundOn] = useState<boolean>(loadSound);

  const [currentProblem, setCurrentProblem] = useState<QuizProblem | null>(null);
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [reveal, setReveal] = useState<{ picked: number | null; correct: number } | null>(null);
  const [review, setReview] = useState<ReviewInfo | null>(null);

  const [heroMood, setHeroMood] = useState<HeroMood>('idle');
  const [heroLine, setHeroLine] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  const [childName] = useState<string>(readChildName);
  const [previousHigh, setPreviousHigh] = useState<HighScoreEntry | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [finalStars, setFinalStars] = useState(0);
  const [finalWrong, setFinalWrong] = useState(0);

  // ═══ مؤقتات ═══
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useRef(prefersReducedMotion());

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const say = useCallback((text: string, ms = 2800) => {
    setHeroLine(text);
    if (sayTimerRef.current) clearTimeout(sayTimerRef.current);
    sayTimerRef.current = setTimeout(() => setHeroLine(null), ms);
  }, []);

  const showToast = useCallback((text: string) => {
    setToast({ id: Date.now(), text });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 1400);
  }, []);

  // تنظيف شامل
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (sayTimerRef.current) clearTimeout(sayTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      seaSfx.dispose();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearAllTimeouts]);

  useEffect(() => {
    setPreviousHigh(getHighScore(GAME_ID));
  }, []);

  const syncStats = useCallback(() => {
    setScoreCount(scoreRef.current);
    setPoints(pointsRef.current);
    setStreak(streakRef.current);
    setHud((h) => ({ ...h, gap: gapRef.current }));
  }, []);

  // ═══════════════════════════════════════════════════════════
  // نهاية الجولة
  // ═══════════════════════════════════════════════════════════
  const finish = useCallback((end: 'victory' | 'defeat') => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearAllTimeouts();

    const score = scoreRef.current;
    const stars = end === 'victory' ? starsFromGap(gapRef.current) : 0;
    setFinalStars(stars);
    setFinalWrong(wrongCountRef.current);
    setHud((h) => ({ ...h, gap: end === 'victory' ? gapRef.current : 0 }));

    // XP: 2 + حسب الأداء (سقف 5)
    let earned = 2;
    if (score >= 15) earned += 3;
    else if (score >= 10) earned += 2;
    else if (score >= 5) earned += 1;
    addXP(Math.min(5, earned + (end === 'victory' ? 1 : 0)));

    // الرقم القياسي (عدد الإجابات الصحيحة)
    const result = addScore(GAME_ID, childName, score, HERO_ID);
    setIsNewRecord(result.isNewRecord);
    if (result.isNewRecord) setPreviousHigh(result.previousTop);

    seaSfx.playTrumpet(end === 'victory');
    addTimeout(() => seaSfx.dispose(), 1800);

    if (end === 'victory') {
      setHeroMood('celebrating');
      speak(result.isNewRecord ? 'وَصَلْتَ لِلجَزِيرَةِ! رَقَمٌ قِيَاسِيٌّ جَدِيد!' : 'وَصَلْنَا لِلجَزِيرَة! أَحْسَنْتَ!');
      vibrate([0, 40, 40, 40, 40, 80]);
      goPhase('victory');
    } else {
      setHeroMood('sad');
      vibrate([0, 40, 40, 80]);
      goPhase('caught');
      addTimeout(() => {
        speak('لا بَأْس يَا بَطَل! سَنَسْتَعِيدُ الكَنْزَ مَعاً. مَرَّةً أُخْرَى؟');
        goPhase('defeat');
      }, 1900);
    }
  }, [addXP, addTimeout, childName, clearAllTimeouts, goPhase, speak]);

  // ═══════════════════════════════════════════════════════════
  // المسائل
  // ═══════════════════════════════════════════════════════════
  const loadNextProblem = useCallback(() => {
    const lvl = pickLevel(scoreRef.current, elapsedRef.current);
    const prob = generateQuiz(pickOp(elapsedRef.current), lvl);

    // مسألة ذهبية؟
    const queue = goldenQueueRef.current;
    const golden = queue.length > 0 && elapsedRef.current >= queue[0];
    if (golden) queue.shift();
    goldenRef.current = golden;

    // الوقت: تكيّف المحرك − ثانية إن كانت مدافعهم مفعّلة
    let t = adaptiveTime(prob.timeSec, wrongStreakRef.current, streakRef.current);
    if (gapRef.current > CANNON_THRESHOLD) t = Math.max(6, t - 1);
    maxRef.current = t;
    leftRef.current = t;
    answeredRef.current = false;
    problemRef.current = prob;

    setCurrentProblem(prob);
    setOptions(prob.options);
    setLevel(lvl);
    setIsGolden(golden);
    setReveal(null);
    setHeroMood(golden ? 'excited' : 'thinking');
    setHud((h) => ({ ...h, left: t, max: t }));
    if (golden) {
      showToast('🧰 مَسْأَلَةٌ ذَهَبِيَّة! نِقَاطٌ ×2 وَبِلَا خَسَارَة');
      seaSfx.playTrumpet(true);
    }
  }, [showToast]);

  /** فشل مسألة (خطأ أو مهلة) */
  const failProblem = useCallback((info: ReviewInfo, loss: number) => {
    const prob = problemRef.current;
    if (!prob) return;
    const golden = goldenRef.current;

    if (!golden) streakRef.current = 0;
    wrongStreakRef.current += 1;
    wrongCountRef.current += 1;
    gapRef.current = Math.max(0, gapRef.current - (golden ? 0 : loss));

    setReveal({ picked: info.wrongValue, correct: prob.answer });
    setHeroMood('sad');
    say(WRONG_PHRASES[Math.floor(Math.random() * WRONG_PHRASES.length)]);
    seaSfx.playTrumpet(false);
    vibrate([0, 50, 30, 50]);
    syncStats();
    goPhase('reveal');

    if (gapRef.current <= 0) {
      addTimeout(() => finish('defeat'), REVEAL_MS);
    } else {
      addTimeout(() => {
        setReview(info);
        goPhase('review');
      }, REVEAL_MS);
    }
  }, [addTimeout, finish, goPhase, say, syncStats]);

  const handleAnswer = useCallback((opt: QuizOption) => {
    const prob = problemRef.current;
    if (!prob || phaseRef.current !== 'playing' || answeredRef.current) return;
    answeredRef.current = true;

    if (opt.kind !== 'correct') {
      failProblem(
        { kind: opt.kind, why: opt.why, wrongValue: opt.value, stepIndex: opt.stepIndex },
        LOSS_WRONG,
      );
      return;
    }

    // ✅ صحيح
    const golden = goldenRef.current;
    streakRef.current += 1;
    wrongStreakRef.current = 0;
    scoreRef.current += 1;
    const st = streakRef.current;

    const fast = leftRef.current > maxRef.current * (2 / 3);
    const mult = st >= 5 ? 2 : st >= 3 ? 1.5 : 1;
    pointsRef.current += Math.round((10 + (fast ? 5 : 0)) * mult * (golden ? 2 : 1));

    let gain = golden ? 12 : st >= 3 ? 10 : 6;
    if (elapsedRef.current >= SESSION_SECONDS - 10) gain += 2;   // سباق الجزيرة
    if (st > 0 && st % 5 === 0) {
      gain += 8;
      showToast('💥 مِدْفَعُ رَيَّان!');
      say('مِدْفَعِي! ارْجِعُوا يَا قَرَاصِنَة!');
      speak('مِدْفَعِي!');
    } else if (st === 3) {
      showToast('🔥 الرِّيحُ مَعَنَا!');
    }
    gapRef.current = Math.min(GAP_MAX, gapRef.current + gain);

    setReveal({ picked: opt.value, correct: prob.answer });
    setHeroMood('excited');
    seaSfx.playTrumpet(true);
    vibrate(30);
    syncStats();

    addTimeout(() => {
      if (phaseRef.current === 'playing') loadNextProblem();
    }, REVEAL_MS);
  }, [addTimeout, failProblem, loadNextProblem, say, showToast, speak, syncStats]);

  const handleTimeout = useCallback(() => {
    if (!problemRef.current || answeredRef.current) return;
    answeredRef.current = true;
    failProblem({ kind: 'timeout', why: 'انْتَهَى الوَقْت! إِلَيْكَ الحَلُّ خُطْوَةً خُطْوَة.', wrongValue: null }, LOSS_TIMEOUT);
  }, [failProblem]);

  // ═══════════════════════════════════════════════════════════
  // ساعة اللعب الواحدة
  // ═══════════════════════════════════════════════════════════
  const stepClock = (dt: number) => {
    if (phaseRef.current !== 'playing') return;

    elapsedRef.current = Math.min(SESSION_SECONDS, elapsedRef.current + dt);

    // السحب البطيء
    if (elapsedRef.current > WARMUP_SEC) {
      gapRef.current = Math.max(0, gapRef.current - dt * DRAG_PER_SEC);
    }

    // مؤقت المسألة
    let timedOut = false;
    if (!answeredRef.current && problemRef.current) {
      leftRef.current = Math.max(0, leftRef.current - dt);
      if (leftRef.current <= 0) timedOut = true;
    }

    // تحذير الخطر مرة واحدة
    if (gapRef.current < ROPE_THRESHOLD && !dangerWarnedRef.current) {
      dangerWarnedRef.current = true;
      setHeroMood('thinking');
      say('القَرَاصِنَةُ يَقْتَرِبُون!', 2200);
    } else if (gapRef.current >= 40) {
      dangerWarnedRef.current = false;
    }

    setHud({
      gap: gapRef.current,
      elapsed: elapsedRef.current,
      left: leftRef.current,
      max: maxRef.current,
    });

    if (gapRef.current <= 0) { finish('defeat'); return; }
    if (elapsedRef.current >= SESSION_SECONDS) { finish('victory'); return; }
    if (timedOut) handleTimeout();
  };
  stepClockRef.current = stepClock;

  useEffect(() => {
    if (phase !== 'playing') return;
    lastTickRef.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = Math.min(0.25, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;
      stepClockRef.current(dt);
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  // ═══ البرق (العاصفة فقط · محترماً تقليل الحركة) ═══
  const sceneGap = phase === 'caught' ? 0 : Math.round(Math.min(99, hud.gap));
  const sceneElapsed = Math.floor(hud.elapsed);
  const weather = getWeather(sceneGap, sceneElapsed);
  const roundActive = phase === 'playing' || phase === 'reveal' || phase === 'review';

  useEffect(() => {
    if (!roundActive || weather !== 'storm' || reducedMotion.current) return;
    let id: ReturnType<typeof setTimeout>;
    const schedule = () => {
      id = setTimeout(() => {
        setIsLightning(true);
        addTimeout(() => setIsLightning(false), 300);
        addTimeout(() => seaSfx.playThunder(), 1000);   // الرعد بعد البرق بثانية ثابتة
        schedule();
      }, 7000 + Math.random() * 5000);
    };
    schedule();
    return () => clearTimeout(id);
  }, [roundActive, weather, addTimeout]);

  // ═══════════════════════════════════════════════════════════
  // البدء · الحبل · المتابعة
  // ═══════════════════════════════════════════════════════════
  const startRace = useCallback(() => {
    if (!isPreviewMode()) {
      if (tickets < 1) {
        buyTicket();
        if (useProgressStore.getState().tickets < 1) return;
      }
      consumeTicket();
    }

    clearAllTimeouts();
    gapRef.current = GAP_START;
    elapsedRef.current = 0;
    scoreRef.current = 0;
    pointsRef.current = 0;
    streakRef.current = 0;
    wrongStreakRef.current = 0;
    wrongCountRef.current = 0;
    ropeUsedRef.current = false;
    answeredRef.current = true;
    goldenRef.current = false;
    dangerWarnedRef.current = false;
    finishedRef.current = false;
    problemRef.current = null;
    const r = (a: number, b: number) => a + Math.random() * (b - a);
    goldenQueueRef.current = [r(15, 40), r(55, 80)];

    setHud({ gap: GAP_START, elapsed: 0, left: 8, max: 8 });
    setScoreCount(0);
    setPoints(0);
    setStreak(0);
    setLevel(1);
    setRopeUsed(false);
    setIsGolden(false);
    setIsNewRecord(false);
    setCurrentProblem(null);
    setReveal(null);
    setReview(null);
    setToast(null);
    setHeroMood('excited');
    const greetMsg = `أَسْرِعْ يَا ${childName}! القَرَاصِنَةُ خَلْفَنَا!`;
    say(greetMsg);
    speak(greetMsg);
    vibrate(50);

    seaSfx.setMute(!soundOn);
    seaSfx.init();                       // أول لمسة = مسموح بالصوت على الجوال

    goPhase('ready');
    addTimeout(() => {
      loadNextProblem();
      goPhase('playing');
    }, 900);
  }, [
    tickets, buyTicket, consumeTicket, clearAllTimeouts, say, speak,
    soundOn, goPhase, addTimeout, loadNextProblem, childName,
  ]);

  const handleRope = useCallback(() => {
    if (
      ropeUsedRef.current ||
      gapRef.current >= ROPE_THRESHOLD ||
      !problemRef.current ||
      answeredRef.current ||
      phaseRef.current !== 'playing'
    ) return;
    ropeUsedRef.current = true;
    setRopeUsed(true);
    vibrate(40);
    seaSfx.playTrumpet(true);
    showToast('🤝 حَبْلُ رَيَّان!');

    // نحذف خياراً خاطئاً واحداً (عشوائياً)
    setOptions((prev) => {
      const wrong = prev.filter((o) => o.kind !== 'correct');
      if (wrong.length === 0) return prev;
      const rm = wrong[Math.floor(Math.random() * wrong.length)];
      return prev.filter((o) => o !== rm);
    });
  }, [showToast]);

  const handleContinueReview = useCallback(() => {
    if (phaseRef.current !== 'review') return;
    setReview(null);
    goPhase('playing');
    loadNextProblem();
  }, [goPhase, loadNextProblem]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    seaSfx.setMute(!next);
    try { localStorage.setItem(SOUND_KEY, next ? 'on' : 'off'); } catch { /* ignore */ }
  };

  // ═══════════════════════════════════════════════════════════
  // شاشة البداية
  // ═══════════════════════════════════════════════════════════
  if (phase === 'welcome') {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950/40 to-slate-950 text-white flex flex-col">
        <div className="flex items-center gap-2 p-4">
          <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="رجوع">
            <ArrowRight className="w-6 h-6 text-rose-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="w-28 h-28 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-6xl shadow-2xl shadow-rose-500/30">
              🏴‍☠️
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-rose-400">سِبَاقُ القَرَاصِنَة</h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xs leading-relaxed">
              اضْرِبْ بِسُرْعَةٍ لِتَبْقَى أَمَامَ القَرَاصِنَة. اصْمُدْ 90 ثَانِيَةً حَتَّى تَصِلَ إِلَى الجَزِيرَة!
            </p>
          </motion.div>

          <HighScoreBadge gameId={GAME_ID} variant="full" />

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={startRace}
            className="w-full max-w-xs bg-gradient-to-l from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-xl py-4 rounded-2xl shadow-xl shadow-rose-500/30 active:scale-95 transition"
            style={{ touchAction: 'manipulation' }}
          >
            ▶️ ابْدَأِ السِّبَاق
          </motion.button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // شاشة النصر
  // ═══════════════════════════════════════════════════════════
  if (phase === 'victory') {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white flex flex-col items-center justify-center p-4 gap-3">
        <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-amber-400/40" style={{ aspectRatio: '360 / 220' }}>
          <Scene gap={100} elapsedSec={SESSION_SECONDS} isLightning={false} weather="sunny" />
        </div>

        <motion.div
          initial={{ scale: 0.9, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className={`w-full max-w-sm rounded-3xl p-5 text-center shadow-2xl flex flex-col items-center gap-3 border-2 ${
            isNewRecord
              ? 'bg-gradient-to-br from-amber-900/40 via-slate-800 to-amber-900/40 border-amber-400/70'
              : 'bg-slate-800 border-emerald-700'
          }`}
        >
          <h2 className={`text-2xl font-black ${isNewRecord ? 'text-amber-300' : 'text-emerald-400'}`}>
            {isNewRecord ? '🎉 رَقَمٌ قِيَاسِيٌّ جَدِيد!' : 'وَصَلْتَ لِلجَزِيرَة!'}
          </h2>

          {/* صندوق الكنز */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              initial={{ rotate: -8, scale: 0.8 }}
              animate={{ rotate: [-8, 8, 0], scale: [0.8, 1.15, 1] }}
              transition={{ duration: 1.2 }}
              className="text-5xl"
            >
              🧰
            </motion.div>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <motion.div
                  key={n}
                  initial={{ y: -30, opacity: 0, scale: 0 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + n * 0.25, type: 'spring', stiffness: 300, damping: 14 }}
                >
                  <Star className={`w-9 h-9 ${n <= finalStars ? 'text-amber-300 fill-amber-300' : 'text-slate-600'}`} />
                </motion.div>
              ))}
            </div>
            <p className="text-amber-200 text-xs font-bold">🪙 × {finalStars} قِطْعَةٌ ذَهَبِيَّة</p>
          </div>

          <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-3 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">الإِجَابَاتُ الصَّحِيحَة:</span>
              <span className="text-rose-300 font-bold tabular-nums">{scoreCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">الأَخْطَاء:</span>
              <span className="text-slate-300 font-bold tabular-nums">{finalWrong}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">النِّقَاط:</span>
              <span className="text-amber-300 font-bold tabular-nums">{points}</span>
            </div>
            {previousHigh && (
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  {isNewRecord ? <Crown className="w-3.5 h-3.5" /> : <Trophy className="w-3.5 h-3.5 text-amber-300" />}
                  {isNewRecord ? 'كُنْتَ:' : 'الرَّقَم:'}
                </span>
                <span className="text-amber-300 font-bold tabular-nums">{previousHigh.value} ({previousHigh.name})</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <button
              onClick={startRace}
              className="w-full font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2 bg-gradient-to-l from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
              style={{ touchAction: 'manipulation' }}
            >
              <RotateCcw className="w-4 h-4" />
              إِعَادَةُ السِّبَاق
            </button>
            <button
              onClick={onBack}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2"
              style={{ touchAction: 'manipulation' }}
            >
              <Home className="w-4 h-4" />
              مَدِينَةُ الأَلْعَاب
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // شاشة الهزيمة
  // ═══════════════════════════════════════════════════════════
  if (phase === 'defeat') {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 text-white flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className="w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center gap-4 bg-slate-800 border-2 border-rose-700"
        >
          <div className="text-5xl">🦜</div>
          <h2 className="text-2xl font-black text-rose-400">سَرَقُوا الكَنْز... مُؤَقَّتاً!</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            لا بَأْسَ يَا بَطَل · سَنَسْتَعِيدُهُ مَعاً. مَرَّةً أُخْرَى؟
          </p>

          <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-3 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">الإِجَابَاتُ الصَّحِيحَة:</span>
              <span className="text-rose-300 font-bold tabular-nums">{scoreCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">النِّقَاط:</span>
              <span className="text-amber-300 font-bold tabular-nums">{points}</span>
            </div>
            {previousHigh && (
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  الرَّقَم:
                </span>
                <span className="text-amber-300 font-bold tabular-nums">{previousHigh.value} ({previousHigh.name})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">🪙 قِطْعَةٌ لِلْمُحَاوَلَة:</span>
              <span className="text-amber-300 font-bold tabular-nums">1</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <button
              onClick={startRace}
              className="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-500/20 active:scale-95 transition flex items-center justify-center gap-2"
              style={{ touchAction: 'manipulation' }}
            >
              <RotateCcw className="w-4 h-4" />
              حَاوِلْ مُجَدَّداً
            </button>
            <button
              onClick={onBack}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2"
              style={{ touchAction: 'manipulation' }}
            >
              <Home className="w-4 h-4" />
              مَدِينَةُ الأَلْعَاب
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // شاشة اللعب (ready · playing · reveal · review · caught)
  // ═══════════════════════════════════════════════════════════
  const problemPct = hud.max > 0 ? (hud.left / hud.max) * 100 : 0;
  const timerColor = problemPct > 50 ? 'bg-sky-400' : problemPct > 25 ? 'bg-amber-400' : 'bg-rose-500';
  const raceLeft = Math.max(0, Math.ceil(SESSION_SECONDS - hud.elapsed));
  const secLeft = Math.ceil(hud.left);
  const showCountdown = phase === 'playing' && !reveal && secLeft <= 3;
  const ropeAvailable = !ropeUsed && hud.gap < ROPE_THRESHOLD;
  const bubble = heroLine ?? defaultBubble(hud.gap, streak, ropeAvailable, hud.elapsed);
  const danger = hud.gap < ROPE_THRESHOLD && roundActive;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/60 to-slate-950 text-white flex flex-col select-none"
      style={{ touchAction: 'manipulation' }}
    >
      {/* ═══ الرأس ═══ */}
      <div className="sticky top-0 z-20 bg-slate-900/85 backdrop-blur-md border-b border-rose-500/20">
        <div className="flex items-center justify-between gap-2 p-3">
          <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0" aria-label="رجوع">
            <ArrowRight className="w-5 h-5 text-rose-400" />
          </button>

          <div className="flex-1 flex justify-center min-w-0">
            <GameCompanion heroId={HERO_ID} mood={heroMood} />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              aria-label={soundOn ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-sky-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <div className="bg-slate-950/80 px-2 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1">
              🎯 <span className="tabular-nums">{scoreCount}</span>
            </div>
            <div className="bg-slate-950/80 px-2 py-1.5 rounded-lg border border-sky-500/30 text-sky-300 font-bold text-xs flex items-center gap-1">
              ⏳ <span className="tabular-nums">{raceLeft}</span>
            </div>
          </div>
        </div>
        {/* شريط وقت المسألة */}
        <div className="h-1.5 bg-slate-800">
          <div
            className={`h-full transition-[width] duration-100 ease-linear ${timerColor} ${showCountdown ? 'animate-pulse' : ''}`}
            style={{ width: `${phase === 'ready' ? 100 : problemPct}%` }}
          />
        </div>
      </div>

      {/* ═══ المشهد ═══ */}
      <div className="px-3 pt-3">
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            aspectRatio: '360 / 220',
            boxShadow: danger ? 'inset 0 0 40px 6px rgba(239,68,68,0.55)' : undefined,
          }}
        >
          <Scene gap={sceneGap} elapsedSec={sceneElapsed} isLightning={isLightning} weather={weather} />

          {/* فقاعة ريان */}
          <div className="absolute top-2 inset-x-3 flex justify-center pointer-events-none">
            <div className="max-w-full bg-slate-900/80 backdrop-blur-sm border border-amber-400/30 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-md">
              <span className="text-base shrink-0">👦</span>
              <span className="text-[11px] font-bold text-amber-100 truncate">{bubble}</span>
            </div>
          </div>

          {/* إشعار (كومبو · مدفع · ذهبية · حبل) */}
          <AnimatePresence>
            {toast && (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 14, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-x-0 top-1/2 flex justify-center pointer-events-none"
              >
                <span className="px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/40">
                  {toast.text}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* القبض */}
          <AnimatePresence>
            {phase === 'caught' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-rose-950/70 flex flex-col items-center justify-center gap-1"
              >
                <motion.div
                  animate={{ rotate: [-6, 6, -6, 6, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl"
                >
                  🏴‍☠️
                </motion.div>
                <p className="text-rose-100 font-black text-lg">أَمْسَكُوا بِنَا!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══ السؤال + الأزرار ═══ */}
      <div className="flex-1 flex flex-col justify-between px-3 pt-3 gap-3 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div
          className={`relative rounded-2xl p-3 shadow-xl border-2 ${
            isGolden ? 'bg-amber-950/80 border-amber-400/80' : 'bg-slate-900/90 border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="text-[11px] font-bold text-slate-300 bg-black/40 px-2 py-1 rounded-full border border-white/10">
                المُسْتَوَى {level}
              </div>
              {currentProblem && (
                <div className="text-[11px] font-bold text-sky-200 bg-sky-950/60 px-2 py-1 rounded-full border border-sky-500/30">
                  {currentProblem.op === 'div' ? '➗ قِسْمَة' : '✖️ ضَرْب'}
                </div>
              )}
              {isGolden && (
                <div className="text-[11px] font-black text-amber-300 bg-amber-900/70 px-2 py-1 rounded-full border border-amber-400/50">
                  🧰 ذَهَبِيَّة ×2
                </div>
              )}
              {streak >= 2 && (
                <div className="text-[11px] font-black text-orange-300 bg-orange-950/70 px-2 py-1 rounded-full border border-orange-400/50">
                  🔥 {streak}
                </div>
              )}
            </div>
            {ropeAvailable && phase === 'playing' && (
              <button
                onClick={handleRope}
                className="px-2.5 py-1 rounded-full border border-amber-400/60 bg-amber-950/80 text-amber-300 text-[11px] font-extrabold flex items-center gap-1 active:scale-95 transition"
                style={{ touchAction: 'manipulation' }}
              >
                <Hand className="w-3.5 h-3.5" />
                حَبْلُ رَيَّان
              </button>
            )}
          </div>

          {currentProblem ? (
            <div className="text-4xl font-black text-amber-300 text-center font-mono tabular-nums" dir="ltr">
              {currentProblem.a} {currentProblem.symbol} {currentProblem.b} = ؟
            </div>
          ) : (
            <div className="text-2xl font-black text-sky-300 text-center py-1 animate-pulse">⛵ اسْتَعِدّ!</div>
          )}

          {showCountdown && (
            <motion.div
              key={secLeft}
              initial={{ scale: 1.6, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-2 left-3 text-2xl font-black text-rose-400 tabular-nums"
            >
              {secLeft}
            </motion.div>
          )}
        </div>

        {/* الأزرار: خشبية محايدة قبل الاختيار */}
        <div className={`grid gap-2 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {currentProblem && options.map((opt) => {
            let bg = '#7c4a1e';
            let border = '#b45309';
            let opacity = 1;
            if (reveal) {
              if (opt.value === reveal.correct) { bg = '#15803d'; border = '#4ade80'; }
              else if (opt.value === reveal.picked) { bg = '#b91c1c'; border = '#fca5a5'; }
              else opacity = 0.45;
            }
            return (
              <motion.button
                key={`${currentProblem.id}-${opt.value}`}
                whileTap={{ scale: 0.94, y: 3 }}
                animate={reveal && opt.value === reveal.picked && opt.value !== reveal.correct ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleAnswer(opt)}
                disabled={phase !== 'playing' || !!reveal}
                className="h-[60px] rounded-2xl font-black text-2xl text-amber-50 shadow-lg flex items-center justify-center tabular-nums font-mono transition-colors duration-200"
                style={{
                  backgroundColor: bg,
                  borderWidth: 2,
                  borderColor: border,
                  opacity,
                  boxShadow: '0 4px 0 rgba(0,0,0,0.45)',
                  touchAction: 'manipulation',
                }}
              >
                {opt.value}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ═══ الجسر التعليمي ═══ */}
      <AnimatePresence>
        {phase === 'review' && currentProblem && review && (
          <SolutionPlayer
            key={currentProblem.id}
            problem={currentProblem}
            info={review}
            onContinue={handleContinueReview}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PirateRaceGame;