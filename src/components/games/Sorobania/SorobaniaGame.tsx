// ═══════════════════════════════════════════════════════════════════
// src/components/games/Sorobania/SorobaniaGame.tsx
// 🏝️ جزيرة سوروبانيا — الملف الرئيسي (منطق اللعبة والشاشات)
// ═══════════════════════════════════════════════════════════════════
// الدور: العقل المدبّر. يربط القطع ببعضها:
//   • الحالة: الشاشة الحالية · التقدّم · الجولة الجارية · السلسلة · المشاعل
//   • معالجة الإجابات (صحيح / خطأ / انتهاء الوقت) والانتقال بين الأسئلة
//   • نهاية المرحلة: النجوم · XP · الأرقام القياسية · فتح المناطق
//   • التذاكر (selectHasTicket / buyTicket / consumeTicket)
//   • عرض شاشات: الخريطة · الدرس · اللعب · الفوز · الخسارة · الأرقام القياسية
//
// الملفات المساندة (نفس المجلد):
//   • sorobaniaData.ts   : ثوابت · أنواع · مراحل · أسئلة · حفظ التقدّم
//   • sorobaniaSfx.ts    : الأصوات
//   • SorobaniaScenes.tsx: الرسوم (SVG) والاحتفالات
//   • SorobaniaUI.tsx    : Hud · بانة · الفتيل · الدروس
//
// الملف الوحيد الذي تستورده gamesData / GamesListScreen (export default).
//
// متى تعدّله؟ لتغيير قواعد اللعب (حيوات · نجوم · إشعال مشعل · مكافآت).
//
// [FIX A1] — isPreviewMode → isPreviewMode() في ensureTicket — 2026-10-13
// [FIX A2] — استيراد dispose + استدعاؤه في useEffect التنظيف — 2026-10-13
// ═══════════════════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Flame, Lock, RotateCcw, Trophy, X } from 'lucide-react';

import { useProgressStore, selectHasTicket } from '@/store/progressStore';
import { isPreviewMode } from '@/utils/previewMode';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { useGameVoice } from '@/hooks/useGameVoice';
import { gt, lt, useGameLang } from '../gamesI18n';

import {
  GAME_ID,
  SPEED_GAME_ID,
  HERO_ID,
  PROGRESS_KEY,
  MUTE_KEY,
  MAX_TORCHES,
  ROOTS_UNLOCK_AT,
  SQUARE_TIME,
  ROOT_TIME,
  CHEERS,
  OOPS,
  pick,
  getLocalChildName,
  STAGES,
  nextStageOf,
  isUnlocked,
  lockReason,
  suggestStage,
  buildDeck,
  loadProgress,
} from './sorobaniaData';
import type {
  LessonId,
  Screen,
  Question,
  StageDef,
  Progress,
  Run,
  Result,
  BurstState,
} from './sorobaniaData';
import { sfx, setSoundOn, dispose } from './sorobaniaSfx';
import {
  PlayScene,
  starPoints,
  MapScene,
  Confetti,
  Burst,
  StarsRow,
} from './SorobaniaScenes';
import {
  Hud,
  BanaCorner,
  FuseTimer,
  LessonScreen,
} from './SorobaniaUI';
import { Num } from '@/components/Num';

interface SorobaniaGameProps {
  onBack: () => void;
}

export default function SorobaniaGame({ onBack }: SorobaniaGameProps) {
  const { dir } = useGameLang();
  const { addXP, buyTicket, consumeTicket } = useProgressStore();
  const { speak } = useGameVoice(HERO_ID);

  const [screen, setScreen] = useState<Screen>('map');
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const progressRef = useRef<Progress>(progress);
  const [selectedId, setSelectedId] = useState<string>(() => suggestStage(progressRef.current));
  const [lesson, setLesson] = useState<{ id: LessonId; stageId: string | null } | null>(null);

  const [run, setRun] = useState<Run | null>(null);
  const runRef = useRef<Run | null>(null);
  const [streak, setStreakState] = useState<number>(0);
  const streakRef = useRef<number>(0);
  const bestStreakRef = useRef<number>(0);
  const [result, setResult] = useState<Result | null>(null);

  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [banaMsg, setBanaMsg] = useState<string>('اختر منطقة وابدأ المغامرة!');
  const [burst, setBurst] = useState<BurstState>({ key: 0, colors: ['#ffd45a'], count: 0, radius: 0 });
  const [recordsOpen, setRecordsOpen] = useState<boolean>(false);
  const [streakEntry, setStreakEntry] = useState<HighScoreEntry | null>(null);
  const [speedEntry, setSpeedEntry] = useState<HighScoreEntry | null>(null);
  const [scoreVersion, setScoreVersion] = useState<number>(0);

  const questionStartRef = useRef<number>(0);
  const advanceTimer = useRef<number | null>(null);
  const noticeTimer = useRef<number | null>(null);
  const ticketPaidRef = useRef<boolean>(false);
  const newStreakFlagRef = useRef<boolean>(false);
  const rootsCrossedRef = useRef<boolean>(false);

  // ─── الصوت ───
  useEffect(() => {
    setSoundOn(!muted);
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      // تجاهل
    }
  }, [muted]);

  // ─── الأرقام القياسية الحالية ───
  useEffect(() => {
    setStreakEntry(getHighScore(GAME_ID) ?? null);
    setSpeedEntry(getHighScore(SPEED_GAME_ID) ?? null);
  }, []);

  // ─── مساعدات الحالة ───
  const updateProgress = useCallback((fn: (p: Progress) => Progress) => {
    const next = fn(progressRef.current);
    progressRef.current = next;
    setProgress(next);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    } catch {
      // تجاهل
    }
  }, []);

  const commitRun = useCallback((r: Run | null) => {
    runRef.current = r;
    setRun(r);
  }, []);

  const setStreak = useCallback((n: number) => {
    streakRef.current = n;
    setStreakState(n);
  }, []);

  const showNotice = useCallback((text: string) => {
    setNotice(text);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2800);
  }, []);

  const clearAdvance = useCallback(() => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  // حفظ رقم السلسلة القياسي فوراً (يُستدعى عند كسر السلسلة ونهاية المرحلة والخروج)
  const commitStreakRecord = useCallback((): boolean => {
    const best = bestStreakRef.current;
    if (best <= 0) return false;
    const existingValue = getHighScore(GAME_ID)?.value ?? 0;
    if (best <= existingValue) return false;
    const name = getLocalChildName();
    addScore(GAME_ID, name, best, HERO_ID);
    setStreakEntry({ name, value: best, heroId: HERO_ID, date: Date.now() });
    setScoreVersion((v) => v + 1);
    updateProgress((p) => ({ ...p, bestStreak: Math.max(p.bestStreak, best) }));
    return true;
  }, [updateProgress]);

  useEffect(
    () => () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
      commitStreakRecord();
      dispose();
    },
    [commitStreakRecord],
  );

  useEffect(() => {
    if (screen !== 'win' || !result) return;
    const ids = Array.from({ length: result.stars }, (_, i) => window.setTimeout(() => sfx.star(i), 500 + i * 380));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [screen, result]);

  const triggerBurst = (kind: 'right' | 'relight' | 'wrong') => {
    if (kind === 'right') {
      setBurst({ key: Date.now(), colors: ['#ffd45a', '#ffe9a8', '#7ef0c0'], count: 14, radius: 90 });
    } else if (kind === 'relight') {
      setBurst({ key: Date.now(), colors: ['#ff7a1a', '#ffb02e', '#ffe27a', '#fff3c4'], count: 26, radius: 140 });
    } else {
      setBurst({ key: Date.now(), colors: ['#ff5d6c', '#7a1f3a', '#3a2a4a'], count: 12, radius: 70 });
    }
  };

  // ─── التذكرة ───
  const ensureTicket = (): boolean => {
    if (isPreviewMode() || ticketPaidRef.current) return true;
    if (!selectHasTicket(useProgressStore.getState())) {
      buyTicket();
      if (!selectHasTicket(useProgressStore.getState())) return false;
    }
    consumeTicket();
    ticketPaidRef.current = true;
    return true;
  };

  // ─── نهاية المرحلة ───
  const finishStage = (won: boolean) => {
    const r = runRef.current;
    if (!r) return;
    clearAdvance();
    const stage = r.stage;
    const name = getLocalChildName();
    const stars = won ? (r.mistakes === 0 ? 3 : r.mistakes === 1 ? 2 : 1) : 0;
    const enough = r.times.length >= 4;
    const avgSec = r.times.length > 0 ? r.times.reduce((a, b) => a + b, 0) / r.times.length : null;
    let speedPts = 0;
    let newSpeed = false;
    let unlockedStage: StageDef | null = null;

    if (won) {
      const prevStars = progressRef.current.stars[stage.id] ?? 0;
      updateProgress((p) => ({
        ...p,
        stars: { ...p.stars, [stage.id]: Math.max(p.stars[stage.id] ?? 0, stars) },
        bestSpeedSec:
          avgSec !== null && enough ? Math.min(p.bestSpeedSec ?? 999, Number(avgSec.toFixed(1))) : p.bestSpeedSec,
      }));
      const nxt = nextStageOf(stage);
      if (prevStars === 0 && nxt) unlockedStage = nxt;
      addXP(1 + stars);

      // رقم السرعة القياسي: نقاط أعلى = أسرع
      if (avgSec !== null && enough) {
        speedPts = Math.round(100 / Math.max(0.5, avgSec));
        const bestSpeed = getHighScore(SPEED_GAME_ID)?.value ?? 0;
        if (speedPts > bestSpeed) {
          addScore(SPEED_GAME_ID, name, speedPts, HERO_ID);
          newSpeed = true;
          setSpeedEntry({ name, value: speedPts, heroId: HERO_ID, date: Date.now() });
        }
      }
      sfx.fanfare();
      speak(lt(`مبروك يا ${name}! انفتح باب المعبد!`, `Congratulations ${name}! The temple gate is open!`));
      setBanaMsg(stars === 3 ? gt('ثلاث نجوم! أنت أسطورة!') : gt('انتصار رائع! حاول جمع كل النجوم.'));
    } else {
      sfx.lose();
      speak(gt('انطفأت المشاعل، لكنك ستعود أقوى!'));
      setBanaMsg(gt('لا بأس! كل محاولة تجعلك أسرع.'));
    }

    const newStreak = commitStreakRecord() || newStreakFlagRef.current;
    setScoreVersion((v) => v + 1);
    const rootsUnlocked = rootsCrossedRef.current;
    rootsCrossedRef.current = false;

    setResult({
      won,
      stageId: stage.id,
      stars,
      correct: r.correct,
      total: r.deck.length,
      avgSec,
      speedPts,
      newSpeed,
      newStreak,
      streakBest: bestStreakRef.current,
      unlockedStage,
      rootsUnlocked,
    });
    setScreen(won ? 'win' : 'lose');
  };

  // ─── الانتقال للسؤال التالي ───
  const advance = () => {
    const r = runRef.current;
    if (!r) return;
    if (r.torches <= 0) {
      finishStage(false);
      return;
    }
    if (r.index + 1 >= r.deck.length) {
      finishStage(true);
      return;
    }
    commitRun({ ...r, index: r.index + 1, feedback: null, picked: null, input: '', relit: false });
    questionStartRef.current = Date.now();
  };

  const scheduleAdvance = (ms: number) => {
    clearAdvance();
    advanceTimer.current = window.setTimeout(advance, ms);
  };

  // ─── معالجة الإجابة ───
  const resolve = (kind: 'right' | 'wrong' | 'timeout', picked: number | null) => {
    const r = runRef.current;
    if (!r || r.feedback) return;
    const q = r.deck[r.index];
    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const name = getLocalChildName();

    if (kind === 'right') {
      const newStreak = streakRef.current + 1;
      setStreak(newStreak);
      if (newStreak > bestStreakRef.current) bestStreakRef.current = newStreak;
      const relight = newStreak % 3 === 0 && r.torches < MAX_TORCHES;

      commitRun({
        ...r,
        feedback: 'right',
        picked,
        correct: r.correct + 1,
        times: [...r.times, elapsed],
        torches: relight ? r.torches + 1 : r.torches,
        relit: relight,
      });

      if (q.kind === 'squares') {
        const before = progressRef.current.squaresCorrect;
        updateProgress((p) => ({ ...p, squaresCorrect: p.squaresCorrect + 1 }));
        if (before < ROOTS_UNLOCK_AT && before + 1 >= ROOTS_UNLOCK_AT) {
          rootsCrossedRef.current = true;
          window.setTimeout(() => {
            sfx.unlock();
            showNotice(gt('🔑 فُتحت أسرار الجذور! ستجدها على الخريطة.'));
          }, 500);
        }
      }

      sfx.correct(newStreak);
      if (relight) {
        sfx.relight();
        triggerBurst('relight');
        setBanaMsg(gt('أشعلت مشعلاً جديداً! 🔥'));
        speak(`${gt(pick(CHEERS))} ${gt('أشعلت مشعلاً!')}`);
      } else {
        triggerBurst('right');
        setBanaMsg(newStreak >= 3 ? lt(`سلسلة ${newStreak}! حسابات خارقة!`, `Streak ${newStreak}! Amazing math!`) : pick(CHEERS));
        if (newStreak % 3 === 0) speak(`${pick(CHEERS)} ${name}!`);
      }
      scheduleAdvance(relight ? 1250 : 850);
      return;
    }

    // خطأ أو انتهاء الوقت: يُطفأ مشعل ولا تنتهي اللعبة فوراً
    const hadStreak = streakRef.current;
    if (hadStreak > 0) {
      if (commitStreakRecord()) newStreakFlagRef.current = true;
    }
    setStreak(0);
    commitRun({
      ...r,
      feedback: kind,
      picked,
      torches: Math.max(0, r.torches - 1),
      mistakes: r.mistakes + 1,
      relit: false,
    });
    sfx.wrong();
    triggerBurst('wrong');
    setBanaMsg(kind === 'timeout' ? gt('انتهى الوقت! انظر للجواب.') : pick(OOPS));
    if (r.torches - 1 <= 0) speak(gt('آخر مشعل انطفأ!'));
    scheduleAdvance(1700);
  };

  const pickOption = (value: number) => {
    const r = runRef.current;
    if (!r || r.feedback) return;
    const q = r.deck[r.index];
    if (q.kind !== 'squares') return;
    resolve(value === q.ans ? 'right' : 'wrong', value);
  };

  const pressDigit = (d: string) => {
    const r = runRef.current;
    if (!r || r.feedback) return;
    const q = r.deck[r.index];
    if (q.kind !== 'roots' || r.input.length >= 2) return;
    const nextInput = r.input + d;
    commitRun({ ...r, input: nextInput });
    if (nextInput.length >= 2) {
      const value = Number(nextInput);
      resolve(value === q.ans ? 'right' : 'wrong', value);
    } else {
      sfx.click();
    }
  };

  const pressBackspace = () => {
    const r = runRef.current;
    if (!r || r.feedback || r.input.length === 0) return;
    commitRun({ ...r, input: r.input.slice(0, -1) });
    sfx.click();
  };

  const clearInput = () => {
    const r = runRef.current;
    if (!r || r.feedback || r.input.length === 0) return;
    commitRun({ ...r, input: '' });
    sfx.click();
  };

  // ─── بدء مرحلة ───
  const beginStage = (stage: StageDef) => {
    if (!ensureTicket()) {
      showNotice(gt('تحتاج إلى تذكرة لدخول المعبد'));
      setScreen('map');
      return;
    }
    clearAdvance();
    newStreakFlagRef.current = false;
    rootsCrossedRef.current = false;
    setResult(null);
    commitRun({
      stage,
      deck: buildDeck(stage),
      index: 0,
      torches: MAX_TORCHES,
      mistakes: 0,
      correct: 0,
      times: [],
      feedback: null,
      picked: null,
      input: '',
      relit: false,
    });
    questionStartRef.current = Date.now();
    setSelectedId(stage.id);
    setScreen('play');
    sfx.click();
    setBanaMsg(gt('٣ إجابات متتالية تُشعل مشعلاً!'));
    speak(lt(`أهلاً ${getLocalChildName()}! لنبدأ ${stage.name}`, `Hello ${getLocalChildName()}! Let us start ${gt(stage.name)}`));
  };

  const launchStage = (stageId: string) => {
    const stage = STAGES.find((s) => s.id === stageId);
    if (!stage) return;
    if (!isUnlocked(stage, progressRef.current)) {
      sfx.wrong();
      showNotice(gt(lockReason(stage, progressRef.current)));
      return;
    }
    if (stage.lesson && !progressRef.current.seen[stage.lesson]) {
      sfx.click();
      setLesson({ id: stage.lesson, stageId: stage.id });
      setScreen('lesson');
      return;
    }
    beginStage(stage);
  };

  const openLesson = (id: LessonId) => {
    sfx.click();
    setLesson({ id, stageId: null });
    setScreen('lesson');
  };

  const finishLesson = () => {
    if (!lesson) return;
    updateProgress((p) => ({ ...p, seen: { ...p.seen, [lesson.id]: true } }));
    const stage = lesson.stageId ? STAGES.find((s) => s.id === lesson.stageId) : undefined;
    setLesson(null);
    if (stage) beginStage(stage);
    else setScreen('map');
  };

  const toMap = () => {
    clearAdvance();
    commitStreakRecord();
    setStreak(0);
    setSelectedId(suggestStage(progressRef.current));
    setBanaMsg(gt('اختر منطقة وابدأ المغامرة!'));
    setScreen('map');
  };

  const handleBack = () => {
    if (screen === 'map') {
      commitStreakRecord();
      onBack();
      return;
    }
    if (screen === 'lesson') {
      setLesson(null);
      setScreen('map');
      return;
    }
    toMap();
  };

  const toggleMute = () => setMuted((m) => !m);

  // ═════════════════════════════════════════════════════════════════
  // العرض
  // ═════════════════════════════════════════════════════════════════

  const totalStars = STAGES.reduce((sum, s) => sum + (progress.stars[s.id] ?? 0), 0);
  const sel = STAGES.find((s) => s.id === selectedId) ?? STAGES[0];
  const selUnlocked = isUnlocked(sel, progress);
  const selStars = progress.stars[sel.id] ?? 0;
  const rootsOpen = progress.squaresCorrect >= ROOTS_UNLOCK_AT;

  const inGame = (screen === 'play' || screen === 'win' || screen === 'lose') && run !== null;
  const q: Question | null = run ? run.deck[run.index] : null;
  const pos = screen === 'win' ? 8 : run ? Math.min(8, run.index + (run.feedback === 'right' ? 1 : 0)) : 0;
  const shake = run?.feedback === 'wrong' || run?.feedback === 'timeout';
  const pips = '●'.repeat(streak % 3) + '○'.repeat(3 - (streak % 3));

  const resultStage = result ? STAGES.find((s) => s.id === result.stageId) ?? null : null;
  const resultNext = resultStage ? nextStageOf(resultStage) : null;
  const canGoNext = !!resultNext && isUnlocked(resultNext, progress);

  return (
    <div dir={dir} className="fixed inset-0 z-[60] flex select-none justify-center bg-[#07051a] text-white [touch-action:manipulation]">
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-[#140f33]">
        {/* ═══════════ الخريطة ═══════════ */}
        {screen === 'map' && (
          <>
            <Hud
              title={gt('جزيرة سوروبانيا')}
              subtitle={lt(`النجوم ${totalStars} من ${STAGES.length * 3}`, `Stars ${totalStars} of ${STAGES.length * 3}`)}
              onBack={handleBack}
              muted={muted}
              onToggleMute={toggleMute}
              right={
                <button
                  type="button"
                  aria-label={gt('الأرقام القياسية')}
                  onClick={() => {
                    sfx.click();
                    setRecordsOpen(true);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 active:scale-95"
                >
                  <Trophy className="h-5 w-5" />
                </button>
              }
            />

            <div className="relative min-h-0 flex-[6] overflow-hidden bg-gradient-to-b from-[#120d36] via-[#173a73] to-[#0d5a78]">
              <MapScene
                progress={progress}
                selectedId={selectedId}
                onSelect={(id) => {
                  sfx.click();
                  setSelectedId(id);
                  const st = STAGES.find((s) => s.id === id);
                  if (st && !isUnlocked(st, progressRef.current)) showNotice(gt(lockReason(st, progressRef.current)));
                }}
              />
              <BanaCorner excited={totalStars >= 3} message={gt(banaMsg)} />
            </div>

            <div className="flex min-h-0 flex-[4] flex-col justify-center gap-2.5 overflow-y-auto bg-gradient-to-b from-[#1d1546] to-[#120c2e] px-4 pb-4 pt-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-2xl font-black text-amber-200">{gt(sel.name)}</div>
                  <div className="truncate text-sm font-bold text-white/65">{gt(sel.blurb)}</div>
                </div>
                <div className="flex shrink-0 gap-1" dir="ltr" aria-label={lt(`${selStars} من 3 نجوم`, `${selStars} of 3 stars`)}>
                  {[0, 1, 2].map((i) => (
                    <svg key={i} viewBox="0 0 24 24" className="h-8 w-8">
                      <polygon
                        points={starPoints}
                        fill={i < selStars ? '#ffd45a' : '#ffffff'}
                        fillOpacity={i < selStars ? 1 : 0.2}
                      />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-extrabold text-white/70">
                <span>{rootsOpen ? gt('🔑 الجذور مفتوحة') : gt('🔑 مفتاح الجذور')}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-sky-300 to-emerald-300 transition-all"
                    style={{ width: `${Math.min(100, (progress.squaresCorrect / ROOTS_UNLOCK_AT) * 100)}%` }}
                  />
                </div>
                <span dir="ltr">
                  <Num>{Math.min(progress.squaresCorrect, ROOTS_UNLOCK_AT)}/{ROOTS_UNLOCK_AT}</Num>
                </span>
              </div>

              {selUnlocked ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => launchStage(sel.id)}
                    className="h-16 flex-1 rounded-2xl border-b-8 border-[#a4620f] bg-gradient-to-b from-amber-300 to-amber-500 text-2xl font-black text-[#2b1808] active:translate-y-1 active:border-b-4"
                  >
                    {selStars > 0 ? gt('العب مرة أخرى') : gt('ابدأ المرحلة')}
                  </button>
                  {sel.lesson && (
                    <button
                      type="button"
                      aria-label={gt('الدرس')}
                      onClick={() => openLesson(sel.lesson as LessonId)}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border-b-8 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] active:translate-y-1 active:border-b-4"
                    >
                      <BookOpen className="h-7 w-7" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex h-16 items-center gap-3 rounded-2xl border-2 border-white/10 bg-white/5 px-4 text-sm font-extrabold leading-snug text-white/80">
                  <Lock className="h-6 w-6 shrink-0 text-amber-300" />
                  <span>{gt(lockReason(sel, progress))}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════ الدرس ═══════════ */}
        {screen === 'lesson' && lesson && (
          <LessonScreen
            lessonId={lesson.id}
            finishLabel={lesson.stageId ? gt('ابدأ المرحلة') : gt('العودة للخريطة')}
            onDone={finishLesson}
            onBack={handleBack}
            muted={muted}
            onToggleMute={toggleMute}
          />
        )}

        {/* ═══════════ اللعب والنتيجة ═══════════ */}
        {inGame && run && (
          <>
            <Hud
              title={gt(run.stage.name)}
              subtitle={screen === 'play' ? lt(`سؤال ${run.index + 1} من ${run.deck.length}   ${pips}`, `Question ${run.index + 1} of ${run.deck.length}   ${pips}`) : undefined}
              onBack={handleBack}
              muted={muted}
              onToggleMute={toggleMute}
              right={
                <div className="flex h-11 items-center gap-1 rounded-xl bg-purple-500/20 px-2.5 text-lg font-black text-purple-200">
                  <Flame className="h-5 w-5 fill-purple-300" />
                  <span dir="ltr"><Num>{streak}</Num></span>
                </div>
              }
            />

            {/* المشهد: 60% من الشاشة */}
            <div className="relative min-h-0 flex-[6] overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={shake ? { x: [0, -12, 12, -9, 9, -4, 0] } : { x: 0 }}
                transition={{ duration: 0.45 }}
              >
                <PlayScene stage={run.stage} pos={pos} torches={run.torches} />

                {screen === 'play' && q && (
                  <div className="absolute inset-x-3 top-2 z-10">
                    <motion.div
                      key={q.id}
                      initial={{ y: -22, opacity: 0, scale: 0.96 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="rounded-3xl border-4 border-[#a8814f] bg-gradient-to-b from-[#f6e7c1] to-[#e8cf9b] px-3 pb-2 pt-1.5 text-center text-[#3a2410] shadow-[0_6px_0_#6b4a26,0_14px_30px_rgba(0,0,0,0.45)]"
                    >
                      <div className="h-5 text-sm font-extrabold">
                        {run.feedback === 'right' ? (
                          <span className="text-emerald-700">{gt('صحيح!')}</span>
                        ) : run.feedback ? (
                          <span className="text-rose-700">{gt('الجواب')}: <Num>{q.ans}</Num></span>
                        ) : (
                          <span className="text-[#6b4a26]">
                            {q.kind === 'squares' ? gt('ما مربّع هذا العدد؟') : gt('ما جذر هذا العدد؟')}
                          </span>
                        )}
                      </div>
                      <div dir="ltr" className="text-5xl font-black leading-tight tracking-wide">
                        {q.kind === 'squares' ? lt(`${q.num}² = ؟`, `${q.num}² = ?`) : lt(`√${q.val} = ؟`, `√${q.val} = ?`)}
                      </div>
                      {q.kind === 'roots' && (
                        <div dir="ltr" className="mt-0.5 flex items-center justify-center gap-2 text-xl font-black">
                          <span className="rounded-lg bg-[#3a2410]/15 px-2.5"><Num>{q.pair1}</Num></span>
                          <span className="text-[#6b4a26]">|</span>
                          <span className="rounded-lg bg-[#3a2410]/15 px-2.5"><Num>{q.pair2}</Num></span>
                        </div>
                      )}
                      <div className="mt-1.5">
                        <FuseTimer
                          total={q.kind === 'squares' ? SQUARE_TIME : ROOT_TIME}
                          frozen={run.feedback !== null}
                          onExpire={() => resolve('timeout', null)}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}

                {screen === 'lose' && <div className="absolute inset-0 bg-black/35" />}
              </motion.div>

              {shake && (
                <motion.div
                  key={`flash-${run.index}`}
                  className="pointer-events-none absolute inset-0 z-20 bg-rose-600/35"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {run.relit && run.feedback === 'right' && (
                <motion.div
                  key={`relit-${run.index}`}
                  className="pointer-events-none absolute inset-0 z-20 bg-amber-400/30"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}

              <Burst burst={burst} />

              {run.relit && run.feedback === 'right' && (
                <motion.div
                  key={`relit-banner-${run.index}`}
                  className="pointer-events-none absolute inset-x-0 top-[44%] z-20 flex justify-center"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.4, 1.15, 1], opacity: [0, 1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="rounded-2xl bg-amber-400 px-5 py-2 text-2xl font-black text-[#3a1f04] shadow-xl">
                    🔥 {gt('مشعل جديد!')}
                  </div>
                </motion.div>
              )}

              {screen === 'win' && result && (
                <>
                  <Confetti />
                  <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      className="rounded-3xl bg-[#140f33]/70 px-6 py-2 text-center backdrop-blur-sm"
                    >
                      <div className="text-3xl font-black text-amber-300">{gt('انفتح باب المعبد!')}</div>
                      <StarsRow earned={result.stars} />
                    </motion.div>
                  </div>
                </>
              )}

              {screen === 'lose' && (
                <div className="pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-3xl bg-black/55 px-6 py-3 text-center"
                  >
                    <div className="text-3xl font-black text-rose-300">{gt('انطفأت المشاعل')}</div>
                    <div className="mt-1 text-base font-bold text-white/80">{lt(`أجبت ${result?.correct ?? 0} من ${run.deck.length} بشكل صحيح`, `You answered ${result?.correct ?? 0} of ${run.deck.length} correctly`)}</div>
                  </motion.div>
                </div>
              )}

              <BanaCorner excited={streak >= 3 || screen === 'win'} message={gt(banaMsg)} />
            </div>

            {/* اللوحة السفلية */}
            <div className="flex min-h-0 flex-[4] flex-col justify-center gap-2 overflow-y-auto bg-gradient-to-b from-[#1d1546] to-[#120c2e] px-3 pb-3 pt-3">
              {/* خيارات المربعات */}
              {screen === 'play' && q && q.kind === 'squares' && (
                <div className="grid grid-cols-3 gap-3">
                  {q.options.map((opt) => {
                    const isAns = opt === q.ans;
                    const isPicked = run.picked === opt;
                    let cls = 'border-[#6b4a26] bg-gradient-to-b from-[#c9a06a] to-[#a67b44] text-[#2b1808]';
                    if (run.feedback) {
                      if (isAns) cls = 'border-emerald-800 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white';
                      else if (isPicked) cls = 'border-rose-900 bg-gradient-to-b from-rose-400 to-rose-600 text-white';
                      else cls = 'border-[#3a2a1a] bg-[#6b5a48]/60 text-white/40';
                    }
                    return (
                      <motion.button
                        key={opt}
                        type="button"
                        disabled={run.feedback !== null}
                        whileTap={{ scale: 0.94, y: 4 }}
                        onClick={() => pickOption(opt)}
                        dir="ltr"
                        className={`h-28 rounded-2xl border-b-8 text-3xl font-black shadow-lg ${cls}`}
                      >
                        <Num>{opt}</Num>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* كيبورد الجذور */}
              {screen === 'play' && q && q.kind === 'roots' && (
                <div className="flex min-h-0 flex-1 flex-col gap-2">
                  <div dir="ltr" className="flex h-14 shrink-0 items-center justify-center gap-3">
                    {[0, 1].map((i) => {
                      const ch = run.input[i] ?? '';
                      const bad = run.feedback && run.feedback !== 'right';
                      return (
                        <div
                          key={i}
                          className={`flex h-14 w-14 items-center justify-center rounded-xl border-4 text-4xl font-black ${
                            run.feedback === 'right'
                              ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200'
                              : bad
                                ? 'border-rose-400 bg-rose-500/30 text-rose-200'
                                : 'border-sky-400/60 bg-[#0e2a55] text-sky-200'
                          }`}
                        >
                          {ch}
                        </div>
                      );
                    })}
                  </div>
                  <div dir="ltr" className="grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-2">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                      <motion.button
                        key={d}
                        type="button"
                        whileTap={{ scale: 0.93, y: 3 }}
                        disabled={run.feedback !== null}
                        onClick={() => pressDigit(d)}
                        className="min-h-[2.6rem] rounded-2xl border-b-4 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] text-2xl font-black"
                      >
                        <Num>{d}</Num>
                      </motion.button>
                    ))}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.93, y: 3 }}
                      onClick={clearInput}
                      aria-label={gt('مسح')}
                      className="min-h-[2.6rem] rounded-2xl border-b-4 border-rose-950 bg-gradient-to-b from-rose-500 to-rose-700 text-lg font-black"
                    >
                      {gt('مسح')}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.93, y: 3 }}
                      disabled={run.feedback !== null}
                      onClick={() => pressDigit('0')}
                      className="min-h-[2.6rem] rounded-2xl border-b-4 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] text-2xl font-black"
                    >
                      0
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.93, y: 3 }}
                      onClick={pressBackspace}
                      aria-label={gt('حذف رقم')}
                      className="min-h-[2.6rem] rounded-2xl border-b-4 border-[#5a3a0c] bg-gradient-to-b from-amber-500 to-amber-700 text-2xl font-black"
                    >
                      ⌫
                    </motion.button>
                  </div>
                </div>
              )}

              {/* نتيجة الفوز */}
              {screen === 'win' && result && (
                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-2 text-center text-sm font-extrabold">
                    <div className="rounded-xl bg-white/10 px-2 py-2">
                      {gt('صحيحة')} <span className="text-lg text-emerald-300" dir="ltr"><Num>{result.correct}/{result.total}</Num></span>
                    </div>
                    <div className="rounded-xl bg-white/10 px-2 py-2">
                      {gt('متوسط الزمن')}{' '}
                      <span className="text-lg text-amber-300" dir="ltr">
                        {result.avgSec !== null ? `${result.avgSec.toFixed(1)}${gt('ث')}` : '—'}
                      </span>
                    </div>
                  </div>

                  {(result.newStreak || result.newSpeed) && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.2, type: 'spring' }}
                      className="rounded-xl border-2 border-amber-300 bg-amber-400/20 px-3 py-1.5 text-center text-sm font-black text-amber-200"
                    >
                      {result.newStreak && <div>🏆 {gt('رقم قياسي جديد: أطول سلسلة')} {result.streakBest}</div>}
                      {result.newSpeed && <div>⚡ {gt('رقم قياسي جديد: السرعة')} {result.speedPts} {gt('نقطة')}</div>}
                    </motion.div>
                  )}

                  {(result.unlockedStage || result.rootsUnlocked) && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.6 }}
                      className="rounded-xl border-2 border-sky-300/60 bg-sky-400/15 px-3 py-1.5 text-center text-sm font-black text-sky-200"
                    >
                      {result.unlockedStage && <div>🗺️ {gt('منطقة جديدة')}: {gt(result.unlockedStage.name)}</div>}
                      {result.rootsUnlocked && <div>🔑 {gt('فُتحت أسرار الجذور على الخريطة')}</div>}
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => (canGoNext && resultNext ? launchStage(resultNext.id) : toMap())}
                      className="h-14 flex-1 rounded-2xl border-b-8 border-[#a4620f] bg-gradient-to-b from-amber-300 to-amber-500 text-xl font-black text-[#2b1808] active:translate-y-1 active:border-b-4"
                    >
                      {canGoNext ? gt('المنطقة التالية') : gt('الخريطة')}
                    </button>
                    {result.stars < 3 && (
                      <button
                        type="button"
                        aria-label={gt('أعد المرحلة')}
                        onClick={() => resultStage && launchStage(resultStage.id)}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border-b-8 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] active:translate-y-1 active:border-b-4"
                      >
                        <RotateCcw className="h-6 w-6" />
                      </button>
                    )}
                    {canGoNext && (
                      <button
                        type="button"
                        onClick={toMap}
                        className="h-14 rounded-2xl border-b-8 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] px-4 text-base font-black active:translate-y-1 active:border-b-4"
                      >
                        {gt('الخريطة')}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* نتيجة الخسارة */}
              {screen === 'lose' && result && (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl bg-white/10 px-3 py-2 text-center text-base font-extrabold">
                    {gt('أطول سلسلة لك في هذه الجولة')} <span className="text-amber-300" dir="ltr"><Num>{result.streakBest}</Num></span>
                  </div>
                  {result.newStreak && (
                    <div className="rounded-xl border-2 border-amber-300 bg-amber-400/20 px-3 py-1.5 text-center text-sm font-black text-amber-200">
                      🏆 {gt('رقم قياسي جديد: أطول سلسلة')} {result.streakBest}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => resultStage && launchStage(resultStage.id)}
                    className="flex h-16 items-center justify-center gap-2 rounded-2xl border-b-8 border-[#a4620f] bg-gradient-to-b from-amber-300 to-amber-500 text-2xl font-black text-[#2b1808] active:translate-y-1 active:border-b-4"
                  >
                    <RotateCcw className="h-6 w-6" />
                    <span>{gt('حاول مجدداً')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={toMap}
                    className="h-12 rounded-2xl bg-white/10 text-lg font-black active:scale-95"
                  >
                    {gt('الخريطة')}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════ تنبيه عائم ═══════════ */}
        <AnimatePresence>
          {notice && (
            <motion.div
              key={notice}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="pointer-events-none absolute inset-x-4 top-16 z-50 rounded-2xl bg-white px-4 py-3 text-center text-sm font-black leading-snug text-[#2b1a55] shadow-2xl"
              role="status"
            >
              {notice}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════ الأرقام القياسية ═══════════ */}
        <AnimatePresence>
          {recordsOpen && (
            <motion.div
              className="absolute inset-0 z-50 flex items-end bg-black/65"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRecordsOpen(false)}
            >
              <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                exit={{ y: 80 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="max-h-[85%] w-full overflow-y-auto rounded-t-3xl bg-[#1d1546] p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xl font-black text-amber-300">
                    <Trophy className="h-6 w-6" />
                    <span>{gt('الأرقام القياسية')}</span>
                  </div>
                  <button
                    type="button"
                    aria-label={gt('إغلاق')}
                    onClick={() => setRecordsOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 text-sm font-extrabold text-white/70">
                      {gt('أطول سلسلة إجابات صحيحة')} {streakEntry ? `· ${streakEntry.value}` : ''}
                    </div>
                    <HighScoreBadge key={`streak-${scoreVersion}`} gameId={GAME_ID} variant="full" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-extrabold text-white/70">
                      {gt('نقاط السرعة')} {speedEntry ? `· ${speedEntry.value}` : ''}
                      {progress.bestSpeedSec !== null ? ` · ${gt('أسرع متوسط')} ${progress.bestSpeedSec}${gt('ث')}` : ''}
                    </div>
                    <HighScoreBadge key={`speed-${scoreVersion}`} gameId={SPEED_GAME_ID} variant="full" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}