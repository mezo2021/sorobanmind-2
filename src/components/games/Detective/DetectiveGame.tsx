// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/Detective/DetectiveGame.tsx — Production Ready
// ═══════════════════════════════════════════════════════════════════
// [FIX NAME] — اسم الطفل صوتياً في handleStartGame — 2026-10-13
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Home, Trophy, Crown, Search, CheckCircle2, Lightbulb, ShieldAlert } from 'lucide-react';
import { GameCompanion, type HeroMood } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import { useProgressStore } from '@/store/progressStore';
import type { CharacterType } from '@/types';

const SESSION_SECONDS = 45;
const GAME_ID = 'detective-game';
const HERO_ID: CharacterType = 'joud';

interface ProblemTemplate {
  expression: string;
  correctValue: number;
  distortedValue: number;
  ruleCategory: 'direct' | 'friends5' | 'friends10' | 'combined';
  hint: string;
}

const PROBLEM_BANK: ProblemTemplate[] = [
  // 🟢 1. الجمع والطرح المباشر (Direct)
  { expression: '2 + 2 = ?', correctValue: 4, distortedValue: 3, ruleCategory: 'direct', hint: 'ارْفَعْ 4 خَرَزَاتٍ سُفْلِيَّةٍ مِباشَرَةً!' },
  { expression: '1 + 3 = ?', correctValue: 4, distortedValue: 2, ruleCategory: 'direct', hint: 'ارْفَعْ خَرَزَةً سُفْلِيَّةً إِضَافِيَّةً!' },
  { expression: '5 + 3 = ?', correctValue: 8, distortedValue: 7, ruleCategory: 'direct', hint: 'أَنْزِلْ الخَمْسَةَ العُلْوِيَّةَ وَارْفَعْ 3 سُفْلِيَّةً!' },
  { expression: '9 - 4 = ?', correctValue: 5, distortedValue: 6, ruleCategory: 'direct', hint: 'ابْعِدْ 4 خَرَزَاتٍ سُفْلِيَّةٍ عَنْ المِحْوَرِ!' },
  { expression: '8 - 3 = ?', correctValue: 5, distortedValue: 6, ruleCategory: 'direct', hint: 'اخْصِمْ 3 خَرَزَاتٍ سُفْلِيَّةٍ!' },
  { expression: '1 + 5 + 2 = ?', correctValue: 8, distortedValue: 7, ruleCategory: 'direct', hint: 'تَأَكَّدْ مِنْ إنْزَالِ الخَرَزَةِ العُلْوِيَّةِ 5!' },
  { expression: '7 - 2 = ?', correctValue: 5, distortedValue: 6, ruleCategory: 'direct', hint: 'ابْعِدْ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ!' },
  { expression: '3 + 5 = ?', correctValue: 8, distortedValue: 9, ruleCategory: 'direct', hint: 'الخَمْسَةُ العُلْوِيَّةُ مَعَ 3 سُفْلِيَّةٍ تُسَاوِي 8!' },
  { expression: '6 + 2 = ?', correctValue: 8, distortedValue: 7, ruleCategory: 'direct', hint: 'ارْفَعْ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ إِضَافِيَّتَيْنِ!' },
  { expression: '4 - 3 = ?', correctValue: 1, distortedValue: 2, ruleCategory: 'direct', hint: 'اتْرُكْ خَرَزَةً سُفْلِيَّةً وَاحِدَةً فَقَطْ!' },

  // 🟡 2. أصدقاء 5 (Small Friends)
  { expression: '4 + 4 = ?', correctValue: 8, distortedValue: 9, ruleCategory: 'friends5', hint: 'صَدِيقُ 4 هُوَ 1! (+5 - 1)' },
  { expression: '3 + 3 = ?', correctValue: 6, distortedValue: 7, ruleCategory: 'friends5', hint: 'صَدِيقُ 3 هُوَ 2! (+5 - 2)' },
  { expression: '2 + 4 = ?', correctValue: 6, distortedValue: 5, ruleCategory: 'friends5', hint: 'صَدِيقُ 4 هُوَ 1! (+5 - 1)' },
  { expression: '4 + 1 = ?', correctValue: 5, distortedValue: 4, ruleCategory: 'friends5', hint: 'صَدِيقُ 1 هُوَ 4! (+5 - 4)' },
  { expression: '3 + 4 = ?', correctValue: 7, distortedValue: 8, ruleCategory: 'friends5', hint: 'أَضِفْ 5 وَاطْرَحْ صَدِيقَ 4 وَهُوَ 1!' },
  { expression: '5 - 1 = ?', correctValue: 4, distortedValue: 3, ruleCategory: 'friends5', hint: 'ارْفَعْ الخَمْسَةَ وَارْفَعْ 4 سُفْلِيَّةً! (-5 + 4)' },
  { expression: '6 - 2 = ?', correctValue: 4, distortedValue: 5, ruleCategory: 'friends5', hint: 'اطْرَحْ 5 وَأَضِفْ صَدِيقَ 2 وَهُوَ 3!' },
  { expression: '7 - 3 = ?', correctValue: 4, distortedValue: 5, ruleCategory: 'friends5', hint: 'اطْرَحْ 5 وَأَضِفْ صَدِيقَ 3 وَهُوَ 2!' },
  { expression: '8 - 4 = ?', correctValue: 4, distortedValue: 3, ruleCategory: 'friends5', hint: 'اطْرَحْ 5 وَأَضِفْ صَدِيقَ 4 وَهُوَ 1!' },
  { expression: '2 + 3 = ?', correctValue: 5, distortedValue: 6, ruleCategory: 'friends5', hint: 'صَدِيقُ 3 هُوَ 2! (+5 - 2)' },

  // 🟠 3. أصدقاء 10 (Big Friends)
  { expression: '9 + 1 = ?', correctValue: 10, distortedValue: 11, ruleCategory: 'friends10', hint: 'صَدِيقُ 1 هُوَ 9! (+10 - 9)' },
  { expression: '8 + 2 = ?', correctValue: 10, distortedValue: 9, ruleCategory: 'friends10', hint: 'صَدِيقُ 2 هُوَ 8! (+10 - 8)' },
  { expression: '7 + 5 = ?', correctValue: 12, distortedValue: 13, ruleCategory: 'friends10', hint: 'صَدِيقُ 5 هُوَ 5! (+10 - 5)' },
  { expression: '8 + 8 = ?', correctValue: 16, distortedValue: 15, ruleCategory: 'friends10', hint: 'صَدِيقُ 8 هُوَ 2! (+10 - 2)' },
  { expression: '6 + 9 = ?', correctValue: 15, distortedValue: 14, ruleCategory: 'friends10', hint: 'صَدِيقُ 9 هُوَ 1! (+10 - 1)' },
  { expression: '5 + 5 = ?', correctValue: 10, distortedValue: 11, ruleCategory: 'friends10', hint: 'صَدِيقُ 5 هُوَ 5! (+10 - 5)' },
  { expression: '9 + 4 = ?', correctValue: 13, distortedValue: 12, ruleCategory: 'friends10', hint: 'صَدِيقُ 4 هُوَ 6! (+10 - 6)' },
  { expression: '7 + 7 = ?', correctValue: 14, distortedValue: 15, ruleCategory: 'friends10', hint: 'صَدِيقُ 7 هُوَ 3! (+10 - 3)' },
  { expression: '10 - 1 = ?', correctValue: 9, distortedValue: 8, ruleCategory: 'friends10', hint: 'اطْرَحْ 10 وَأَضِفْ صَدِيقَ 1 وَهُوَ 9!' },
  { expression: '12 - 5 = ?', correctValue: 7, distortedValue: 6, ruleCategory: 'friends10', hint: 'اطْرَحْ 10 وَأَضِفْ صَدِيقَ 5 وَهُوَ 5!' },

  // 🔴 4. القواعد المركبة وسلاسل العمليات (Combined)
  { expression: '5 + 6 = ?', correctValue: 11, distortedValue: 12, ruleCategory: 'combined', hint: 'أَضِفْ 10 وَاطْرَحْ 5!' },
  { expression: '6 + 7 = ?', correctValue: 13, distortedValue: 14, ruleCategory: 'combined', hint: 'أَضِفْ 10، اطْرَحْ 5 وَأَضِفْ 2!' },
  { expression: '7 + 6 = ?', correctValue: 13, distortedValue: 12, ruleCategory: 'combined', hint: 'أَضِفْ 10، اطْرَحْ 5 وَأَضِفْ 1!' },
  { expression: '8 + 6 = ?', correctValue: 14, distortedValue: 15, ruleCategory: 'combined', hint: 'أَضِفْ 10، اطْرَحْ 5 وَأَضِفْ 1!' },
  { expression: '4 + 4 + 3 = ?', correctValue: 11, distortedValue: 10, ruleCategory: 'combined', hint: 'احْسُبْ السِّلْسِلَةَ وَتَأَكَّدْ مِنْ أَعْمِدَةِ العَشَرَاتِ!' },
  { expression: '8 + 7 - 5 = ?', correctValue: 10, distortedValue: 11, ruleCategory: 'combined', hint: 'طَبِّقْ صَدِيقَ 7 ثُمَّ اخْصِمْ الخَمْسَةَ!' },
  { expression: '6 + 8 = ?', correctValue: 14, distortedValue: 13, ruleCategory: 'combined', hint: 'أَضِفْ 10، اطْرَحْ 5 وَأَضِفْ 3!' },
  { expression: '5 + 7 = ?', correctValue: 12, distortedValue: 11, ruleCategory: 'combined', hint: 'أَضِفْ 10 وَاطْرَحْ 3!' },
  { expression: '9 + 6 = ?', correctValue: 15, distortedValue: 16, ruleCategory: 'combined', hint: 'أَضِفْ 10 وَاطْرَحْ 4!' },
  { expression: '13 - 6 = ?', correctValue: 7, distortedValue: 8, ruleCategory: 'combined', hint: 'اطْرَحْ 10، أَضِفْ 5 وَاطْرَحْ 1!' },
];

const JOUD_START_PHRASES = [
  'أَهْلاً بِالشَّرِيكِ! لَدَيْنَا قَضَايَا حِسَابِيَّةٌ بِحَاجَةٍ لِلْحَلِّ!',
  'افْتَحْ مَلَفَّ القَضِيَّةِ، هَيَّا نَبْحَثُ عَنِ الخَطَأِ!',
  'المُحَقِّقُ جُود جَاهِزٌ.. اسْتَعِدَّ لِتَفْكِيكِ الشَّفْرَةِ!',
];

const JOUD_THINKING_PHRASES = [
  'حَلِّلِ المِعْدَادَ جَيِّداً.. أَيْن الخَلَلُ؟',
  'تَذَكَّرْ قَوَاعِدَ الأَصْدِقَاءِ.. انْظُرْ لِلْخَرَزَاتِ!',
  'ابْحَثْ عَنِ القَاعِدَةِ المَفْقُودَةِ..',
];

const JOUD_CORRECT_PHRASES = [
  'قَضِيَّةٌ أُخْرَى مُغْلَقَةٌ بِنَجَاحٍ! ذَكِيٌّ جِدّاً!',
  'تَحْلِيلٌ عَبْقَرِيٌّ! المِعْدَادُ مَضْبُوطٌ الآنَ!',
  'أَحْسَنْتَ يَا شَرِيكِي فِي التَّحْقِيقِ!',
];

const JOUD_MILESTONE_PHRASES: Record<number, string> = {
  3: 'ثَلَاثُ قَضَايَا مَكْشُوفَةٍ! بَرَافُو!',
  5: 'خَمْسُ قَضَايَا مُغْلَقَةٍ! أَنْتَ مُحَقِّقٌ ذَكِيٌّ!',
  9: 'تِسْعُ قَضَايَا! أَدَاءٌ مُحْتَرِفٌ جِدّاً!',
  13: 'ثَلَاثَ عَشْرَةَ قَضِيَّةً! أَنْتَ أُسْطُورَةُ التَّحْقِيقِ!',
};

const JOUD_ERROR_PHRASES = [
  'دَلِيلٌ خَاطِئٌ! أَعِدْ فَحْصَ القَاعِدَةِ!',
  'لا بَأْسَ، المِحْقَقُونَ لا يَسْتَسْلِمُونَ! رَكِّزْ!',
  'اقْتَرَبْتَ جِدّاً مِنْ حَلِّ اللَّغْزِ!',
];

function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try { navigator.vibrate(pattern); } catch { /* Fallback */ }
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
  try { return useProgressStore.getState().childName?.trim() || 'بطل'; } catch { return 'بطل'; }
}

function getDetectiveTitle(solvedCount: number): string {
  if (solvedCount >= 13) return '🏆 المُحَقِّقُ الأُسْطُورِيُّ';
  if (solvedCount >= 9) return '🎯 المُحَقِّقُ المَحْتَرِفُ';
  if (solvedCount >= 5) return '🕵️ المُحَقِّقُ الذَّكِيُّ';
  return '🔎 مُحَقِّقٌ مُتَدَرِّبٌ';
}

function getXpForDetectiveScore(solvedCount: number): number {
  let xp = 2;
  if (solvedCount >= 13) xp += 3;
  else if (solvedCount >= 9) xp += 2;
  else if (solvedCount >= 5) xp += 1;
  return xp;
}

interface ActiveProblem extends ProblemTemplate {
  id: number;
}

export function DetectiveGame({ onBack }: { onBack: () => void }) {
  const { speak } = useCharacterVoice(HERO_ID);
  const addXP = useProgressStore((s) => s.addXP);

  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const [currentProblem, setCurrentProblem] = useState<ActiveProblem | null>(null);
  const [userAbacusValue, setUserAbacusValue] = useState<number>(0);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [isCheckSuccess, setIsCheckSuccess] = useState<boolean | null>(null);
  const [sameProblemErrors, setSameProblemErrors] = useState(0);

  const [heroMood, setHeroMood] = useState<HeroMood>('idle');
  const [heroText, setHeroText] = useState('المُحَقِّقُ جُود فِي الخِدْمَةِ!');

  const [solvedCasesCount, setSolvedCasesCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [childName] = useState<string>(readChildName);
  const [previousHigh, setPreviousHigh] = useState<HighScoreEntry | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const usedProblemsRef = useRef<Set<string>>(new Set());
  const usedPhrasesRef = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearAllTimeouts]);

  useEffect(() => {
    setPreviousHigh(getHighScore(GAME_ID));
  }, []);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const timer = setInterval(() => {
      setSessionTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    if (sessionTimeLeft === 0 && isPlaying && !isGameOver) {
      endGame();
    }
  }, [sessionTimeLeft, isPlaying, isGameOver]);

  const fetchNextProblem = useCallback((overrideCategory?: 'direct') => {
    const elapsed = SESSION_SECONDS - sessionTimeLeft;
    let targetCategory: 'direct' | 'friends5' | 'friends10' | 'combined' = overrideCategory || 'direct';

    if (!overrideCategory) {
      if (elapsed <= 8) targetCategory = 'direct';
      else if (elapsed <= 20) targetCategory = 'friends5';
      else if (elapsed <= 32) targetCategory = 'friends10';
      else if (elapsed <= 38) targetCategory = 'direct';
      else targetCategory = 'combined';
    }

    let candidatePool = PROBLEM_BANK.filter(
      (p) => p.ruleCategory === targetCategory && !usedProblemsRef.current.has(p.expression)
    );

    if (candidatePool.length === 0) {
      candidatePool = PROBLEM_BANK.filter((p) => p.ruleCategory === targetCategory);
      usedProblemsRef.current.clear();
    }

    const selectedTemplate = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    usedProblemsRef.current.add(selectedTemplate.expression);

    const activeProblem: ActiveProblem = {
      ...selectedTemplate,
      id: Date.now() + Math.random(),
    };

    setCurrentProblem(activeProblem);
    setUserAbacusValue(activeProblem.distortedValue);
    setIsCheckSuccess(null);
    setActiveHint(null);
    setSameProblemErrors(0);
    setHeroMood('thinking');

    const thinkMsg = pickUniquePhrase(JOUD_THINKING_PHRASES, usedPhrasesRef.current);
    setHeroText(thinkMsg);
  }, [sessionTimeLeft]);

  const endGame = useCallback(() => {
    setIsGameOver(true);
    setIsPlaying(false);
    clearAllTimeouts();

    const earned = getXpForDetectiveScore(solvedCasesCount);
    setXpEarned(earned);
    addXP(earned);

    const recordResult = addScore(GAME_ID, childName, solvedCasesCount, HERO_ID);
    if (recordResult.isNewRecord) {
      setIsNewRecord(true);
      setPreviousHigh(recordResult.previousTop);
      speak('رَقَمٌ قِيَاسِيٌّ جَدِيدٌ لِلْمُحَقِّقِ!');
    } else {
      setIsNewRecord(false);
      const endMsg = solvedCasesCount >= 8 ? 'أَدَاءٌ تَحْلِيلِيٌّ بَاهِرٌ!' : 'مُحَاوَلَةٌ طَيِّبَةٌ يَا شَرِيكِي!';
      setHeroText(endMsg);
      speak(endMsg);
    }

    setHeroMood('celebrating');
    vibrate([0, 40, 40, 40, 40, 80]);
  }, [solvedCasesCount, addXP, speak, clearAllTimeouts, childName]);

  const handleStartGame = useCallback(() => {
    clearAllTimeouts();
    usedProblemsRef.current.clear();
    usedPhrasesRef.current.clear();

    setIsPlaying(true);
    setIsGameOver(false);
    setIsNewRecord(false);
    setSessionTimeLeft(SESSION_SECONDS);
    setSolvedCasesCount(0);
    setSameProblemErrors(0);
    setXpEarned(0);
    setHeroMood('excited');

    const startMsg = pickUniquePhrase(JOUD_START_PHRASES, usedPhrasesRef.current);
    const greetMsg = `أهلاً ${childName}! ${startMsg}`;
    setHeroText(greetMsg);
    speak(greetMsg);
    vibrate(50);

    addTimeout(() => {
      fetchNextProblem();
    }, 1200);
  }, [addTimeout, fetchNextProblem, speak, clearAllTimeouts, childName]);

  const handleVerifyAnswer = useCallback(() => {
    if (!currentProblem || isCheckSuccess !== null) return;

    if (userAbacusValue === currentProblem.correctValue) {
      vibrate(40);
      setIsCheckSuccess(true);
      const newCount = solvedCasesCount + 1;
      setSolvedCasesCount(newCount);
      setHeroMood('celebrating');

      const correctMsg = pickUniquePhrase(JOUD_CORRECT_PHRASES, usedPhrasesRef.current);
      setHeroText(correctMsg);

      const milestoneSpeech = JOUD_MILESTONE_PHRASES[newCount];
      if (milestoneSpeech) {
        setHeroText(milestoneSpeech);
        speak(milestoneSpeech);
      } else if (newCount % 3 === 0) {
        speak(correctMsg);
      }

      addTimeout(() => {
        fetchNextProblem();
      }, 900);
    } else {
      vibrate([0, 30, 30, 30]);
      setIsCheckSuccess(false);
      setHeroMood('sad');

      const newErrorCount = sameProblemErrors + 1;
      setSameProblemErrors(newErrorCount);

      if (newErrorCount >= 3) {
        const skipMsg = 'لا بَأْسَ! انْتَقِلْ لِلْقَضِيَّةِ القَادِمَةِ!';
        setHeroText(skipMsg);
        speak(skipMsg);

        addTimeout(() => {
          fetchNextProblem('direct');
        }, 1200);
      } else {
        const errorMsg = pickUniquePhrase(JOUD_ERROR_PHRASES, usedPhrasesRef.current);
        setHeroText(errorMsg);
        setActiveHint(`💡 تَلْمِيحٌ: ${currentProblem.hint}`);

        addTimeout(() => {
          setIsCheckSuccess(null);
        }, 1000);
      }
    }
  }, [currentProblem, isCheckSuccess, userAbacusValue, solvedCasesCount, sameProblemErrors, fetchNextProblem, speak, addTimeout]);

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

  const getRuleBadge = (category: string) => {
    switch (category) {
      case 'direct': return { label: 'بَسِيطٌ 🟢', style: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' };
      case 'friends5': return { label: 'أَصْدِقَاءُ 5 🟡', style: 'bg-amber-950/80 border-amber-500/50 text-amber-300' };
      case 'friends10': return { label: 'أَصْدِقَاءُ 10 🟠', style: 'bg-orange-950/80 border-orange-500/50 text-orange-300' };
      case 'combined': return { label: 'مُرَكَّبٌ 🔴', style: 'bg-rose-950/80 border-rose-500/50 text-rose-300' };
      default: return { label: 'قَاعِدَةٌ 🔵', style: 'bg-sky-950/80 border-sky-500/50 text-sky-300' };
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col select-none font-sans"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 sticky top-0 z-20 bg-slate-900/85 backdrop-blur-md border-b border-sky-500/20">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0"
          style={{ touchAction: 'manipulation' }}
          aria-label="رجوع"
        >
          <ArrowRight className="w-6 h-6 text-sky-400" />
        </button>

        <div className="flex-1 flex justify-center">
          <GameCompanion heroId={HERO_ID} mood={heroMood} customText={heroText} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 font-bold text-sm flex items-center gap-1">
            ⏳ <span className="tabular-nums">{sessionTimeLeft}</span>
          </div>
          <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-sky-500/30 text-sky-300 font-bold text-sm flex items-center gap-1">
            🔍 <span className="tabular-nums">{solvedCasesCount}</span>
          </div>
        </div>
      </div>

      {!isPlaying && !isGameOver && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-28 h-28 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-6xl shadow-2xl shadow-sky-500/30">
              🔍
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-sky-400 text-center">
              المُحَقِّقُ الرقمي
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xs text-center leading-relaxed">
              اكْتَشِفِ الخَطَأَ فِي المِعْدَادِ وَأَصْلِحْ الخَرَزَاتِ لِإِغْلَاقِ القَضِيَّةِ!
            </p>
          </motion.div>

          <HighScoreBadge gameId={GAME_ID} variant="full" />

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleStartGame}
            className="w-full max-w-xs bg-gradient-to-l from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xl py-4 rounded-2xl shadow-xl shadow-sky-500/30 active:scale-95 transition"
            style={{ touchAction: 'manipulation' }}
          >
            ▶️ ابْدَأِ التَّحْقِيقَ
          </motion.button>
        </div>
      )}

      {isPlaying && currentProblem && (
        <div className="flex-1 flex flex-col items-center justify-between gap-4 px-4 py-4 max-w-md mx-auto w-full">
          <motion.div
            key={`card-${currentProblem.id}`}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-900/90 border-2 border-sky-500/40 rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2 relative overflow-hidden"
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
                <Search className="w-4 h-4" />
                <span>مَلَفُّ القَضِيَّةِ</span>
              </div>
              <div className={`px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${getRuleBadge(currentProblem.ruleCategory).style}`}>
                {getRuleBadge(currentProblem.ruleCategory).label}
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-wider font-mono my-1">
              {currentProblem.expression}
            </div>

            {activeHint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-amber-300 font-bold bg-amber-950/60 p-2 rounded-xl border border-amber-500/40 flex items-center gap-1.5 w-full"
              >
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span>{activeHint}</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            animate={isCheckSuccess === false ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-center w-full min-h-[220px] bg-slate-900/60 rounded-3xl border border-slate-800 p-4 relative shadow-inner overflow-hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-sky-400/10 to-transparent pointer-events-none"
            />

            <Soroban2D5
              key={currentProblem.id}
              columns={3}
              size="sm"
              autoBeadSize
              initialValue={currentProblem.distortedValue}
              onValueChange={setUserAbacusValue}
              interactive={true}
              showValue={false}
              hideTitle={true}
              rodTint="white"
            />
          </motion.div>

          <div className="w-full">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleVerifyAnswer}
              disabled={isCheckSuccess !== null}
              className={`w-full py-4 rounded-2xl font-black text-xl text-white shadow-xl flex items-center justify-center gap-2 transition ${
                isCheckSuccess === true
                  ? 'bg-emerald-500 border-2 border-emerald-300 shadow-emerald-500/40'
                  : isCheckSuccess === false
                  ? 'bg-rose-600 border-2 border-rose-300 shadow-rose-600/40'
                  : 'bg-gradient-to-l from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 border-2 border-sky-400/40 shadow-sky-500/20'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {isCheckSuccess === true ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-white" />
                  <span>تمَّ إِغْلَاقُ المَلَفِّ بِنَجَاحٍ!</span>
                </>
              ) : isCheckSuccess === false ? (
                <>
                  <ShieldAlert className="w-6 h-6 text-white" />
                  <span>المِعْدَادُ غَيْرُ مُصَحَّحٍ بَعْدُ!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span>إِغْلَاقُ المَلَفِّ (تَحَقَّقْ)</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}

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
              <div className="text-5xl">🕵️‍♂️</div>

              {isNewRecord ? (
                <>
                  <h2 className="text-2xl font-black text-amber-300">🎉 رَقَمٌ قِيَاسِيٌّ جَدِيدٌ!</h2>
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-amber-400/30 p-4 flex flex-col gap-2">
                    {previousHigh && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-slate-400" />
                          كُنْتَ:
                        </span>
                        <span className="text-slate-300 font-bold tabular-nums">
                          {previousHigh.value} قَضِيَّةً ({previousHigh.name})
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-base">
                      <span className="text-amber-300 flex items-center gap-1.5 font-bold">
                        <Trophy className="w-4 h-4" />
                        الآن:
                      </span>
                      <span className="text-amber-300 font-black text-lg tabular-nums">
                        {solvedCasesCount} ({childName})
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-sky-400">انْتَهَى التَّحْقِيقُ!</h2>
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-700/50 p-4 flex flex-col gap-2">
                    <p className="text-slate-400 text-xs">اللَّقَبُ المُكْتَسَبُ:</p>
                    <p className="text-amber-400 font-black text-lg">{getDetectiveTitle(solvedCasesCount)}</p>
                    <div className="h-px bg-slate-700/50 my-1" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">القَضَايَا المُغْلَقَةُ:</span>
                      <span className="text-emerald-400 font-bold text-base tabular-nums">
                        {solvedCasesCount}
                      </span>
                    </div>
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
                  className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition flex items-center justify-center gap-2"
                  style={{ touchAction: 'manipulation' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  إِعَادَةُ التَّحْقِيقِ
                </button>
                <button
                  onClick={onBack}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl active:scale-95 transition flex items-center justify-center gap-2"
                  style={{ touchAction: 'manipulation' }}
                >
                  <Home className="w-4 h-4" />
                  مَدِينَةُ الأَلْعَابِ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DetectiveGame;