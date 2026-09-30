// src/screens/AudioAnzanScreen.tsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, CheckCircle2, XCircle, Clock,
  Trophy, RotateCcw, Play, Volume2, AlertCircle, Square,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { SorobanaCompanion } from '@/components/SorobanaCompanion';
import { AdaptiveFeedback, type SkillPerformance } from '@/components/AdaptiveFeedback';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useSpeech } from '@/hooks/useSpeech';
import { useProgressStore } from '@/store/progressStore';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { useMasteryBadgesStore, classifySpeed } from '@/store/masteryBadgesStore';
import { formatText, formatNumber } from '@/utils/numberStyle';
import { numberToArabicWordsDecimal } from '@/utils/arabicNumbers';

import {
  getAudioAnzanQuestions,
  saveSectionGrade,
  countModulesInLevel,
  type SRBLevel,
  type SRBSection,
  type SRBQuestion,
  type SRBModule,
} from '@/data/srb-adapter';

type Phase = 'intro' | 'listening' | 'answering' | 'reveal' | 'result' | 'empty';

interface AudioAnzanScreenProps {
  level: SRBLevel;
  /** ⚠️ للتوافق — يُتجاهل، يُستخرج من currentQ.section */
  section?: SRBSection;
  onBack: () => void;
  onComplete?: (passed: boolean, score: number) => void;
  playSound: (type: 'click' | 'success' | 'error' | 'whoosh' | 'levelup') => void;
  onXP?: (amount: number) => void;
  burst?: (x?: number, y?: number) => void;
}

interface PerfStats {
  correct: number;
  attempts: number;
  totalTimeMs: number;
  answerMs: number;
}

const XP_PER_CORRECT = 5;
const PASS_THRESHOLD = 70;
const DELAY_BETWEEN_TERMS_MS = 800;
const WARNING_RATIO = 0.7;

// 1) helper (مرة واحدة أعلى الملف)
function getDecimalFactor(q: SRBQuestion): number {
  const decimals = [q.result, ...q.operands].map((n) => {
    const str = Math.abs(n).toString();
    const dotIdx = str.indexOf('.');
    return dotIdx === -1 ? 0 : str.length - dotIdx - 1;
  });
  return Math.pow(10, Math.max(...decimals, 0));
}

// 🆕 استخراج التلميح من بداية solution إن وُجد
function extractHint(q: SRBQuestion | undefined): string | null {
  if (!q?.solution) return null;
  const m = q.solution.match(/^تلميح:\s*(.+?)(?:\.\s|$)/);
  return m ? m[1].trim() : null;
}

function getColumnsForQuestion(q: SRBQuestion): number {
  const candidates: number[] = [
    Math.abs(q.result),
    ...q.operands.map((op) => Math.abs(op)),
  ];
  const maxAbs = Math.max(...candidates);
  if (maxAbs < 1000) return 3;
  if (maxAbs < 1_000_000) return 6;
  if (maxAbs < 1_000_000_000) return 9;
  return 13;
}

function getMaxMs(q: SRBQuestion): number {
  return q.target_time_ms[1];
}

function getAnswerMs(q: SRBQuestion): number {
  return q.target_time_ms[0];
}

function buildSkillId(level: SRBLevel, section: SRBSection, module: SRBModule): string {
  return `${level}-${section}-${module}`;
}

function buildSpeechSequence(q: SRBQuestion): string[] {
  const { operands, operation, question } = q;

  if (operation === 'build' || operation === 'read') {
    return [question];
  }

  const parts: string[] = [];

  if (operation === 'multiplication') {
    parts.push(numberToArabicWordsDecimal(operands[0]));
    parts.push(`في ${numberToArabicWordsDecimal(Math.abs(operands[1]))}`);
    return parts;
  }

  if (operation === 'division') {
    parts.push(numberToArabicWordsDecimal(operands[0]));
    parts.push(`على ${numberToArabicWordsDecimal(Math.abs(operands[1]))}`);
    return parts;
  }

  operands.forEach((op, i) => {
    if (i === 0) {
      parts.push(numberToArabicWordsDecimal(op));
    } else if (op >= 0) {
      parts.push(numberToArabicWordsDecimal(op));
    } else {
      parts.push(`ناقص ${numberToArabicWordsDecimal(Math.abs(op))}`);
    }
  });

  return parts;
}

export function AudioAnzanScreen({
  level, onBack, onComplete, playSound, onXP, burst,
}: AudioAnzanScreenProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<SRBQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [abacusValue, setAbacusValue] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [savedTimeMs, setSavedTimeMs] = useState<number | null>(null);
  const [replayUsed, setReplayUsed] = useState(false);
  const [performances, setPerformances] = useState<SkillPerformance[]>([]);

  const sorobana = useSorobanaVoice();
  const { speak, stop: stopSpeech, isSpeaking, isSupported } = useSpeech();

  const addXP = useProgressStore((s) => s.addXP);
  const updateStreak = useProgressStore((s) => s.updateStreak);

  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic';

  const awardBadge = useMasteryBadgesStore((s) => s.awardBadge);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioSequenceRef = useRef<number>(0);
  const perfRef = useRef<Map<string, PerfStats>>(new Map());
  const wrongModulesRef = useRef<Set<SRBModule>>(new Set());

  const expectedQuestionCount = useMemo(
    () => Math.max(countModulesInLevel(level), 5),
    [level],
  );

  const currentQ = questions[currentIdx];
  const maxMs = currentQ ? getMaxMs(currentQ) : 30000;
  const warningAtMs = maxMs * WARNING_RATIO;
  const isWarning = elapsedMs >= warningAtMs;
  const progressPct = Math.min(100, (elapsedMs / maxMs) * 100);

  const startSession = useCallback(() => {
    const qs = getAudioAnzanQuestions(level, Date.now(), []);
    if (qs.length === 0) {
      playSound('error');
      setPhase('empty');
      return;
    }
    perfRef.current = new Map();
    wrongModulesRef.current = new Set();
    setQuestions(qs);
    setCurrentIdx(0);
    setAbacusValue(0);
    setFeedback('idle');
    setScore(0);
    setElapsedMs(0);
    setSavedTimeMs(null);
    setReplayUsed(false);
    setPerformances([]);
    setPhase('listening');
    playSound('click');
  }, [level, playSound]);

  useEffect(() => {
    if (phase !== 'listening') return;
    if (!currentQ) return;
    if (!isSupported) { setPhase('answering'); return; }

    const seq = buildSpeechSequence(currentQ);
    const myGeneration = ++audioSequenceRef.current;
    let cancelled = false;

    const playAll = async () => {
      for (const term of seq) {
        if (cancelled || myGeneration !== audioSequenceRef.current) return;
        await new Promise<void>((resolve) => {
          speak(term, { rate: 0.9, onEnd: () => resolve() });
        });
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_TERMS_MS));
      }
      if (!cancelled && myGeneration === audioSequenceRef.current) {
        setPhase('answering');
      }
    };

    playAll();
    return () => { cancelled = true; stopSpeech(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQ, isSupported]);

  useEffect(() => {
    if (phase !== 'answering') return;
    if (feedback !== 'idle') return;
    timerRef.current = setInterval(() => {
      setElapsedMs((ms) => {
        const next = ms + 100;
        if (next >= maxMs) { handleTimeout(); return maxMs; }
        return next;
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, feedback, maxMs]);

  const trackPerformance = useCallback(
    (isCorrect: boolean, timeMs: number) => {
      if (!currentQ) return;
      const skillId = buildSkillId(level, currentQ.section, currentQ.module);
      const answerMs = getAnswerMs(currentQ);
      const existing = perfRef.current.get(skillId) ?? {
        correct: 0, attempts: 0, totalTimeMs: 0, answerMs,
      };
      existing.attempts += 1;
      if (isCorrect) existing.correct += 1;
      existing.totalTimeMs += timeMs;
      perfRef.current.set(skillId, existing);
      if (isCorrect) {
        const cls = classifySpeed(timeMs, answerMs);
        if (cls === 'mastery') awardBadge(skillId, timeMs, answerMs);
      } else {
        wrongModulesRef.current.add(currentQ.module);
      }
    },
    [currentQ, level, awardBadge],
  );

  const handleTimeout = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;
    if (timerRef.current) clearInterval(timerRef.current);
    trackPerformance(false, maxMs);
    playSound('error');
    setFeedback('wrong');
    setSavedTimeMs(maxMs);
    sorobana.speakWrong();
    setPhase('reveal');
  }, [currentQ, feedback, maxMs, playSound, sorobana, trackPerformance]);

  const handleReplay = useCallback(() => {
    if (replayUsed || !currentQ) return;
    setReplayUsed(true);
    playSound('click');
    setPhase('listening');
  }, [replayUsed, currentQ, playSound]);

  const handleCheck = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;
    if (timerRef.current) clearInterval(timerRef.current);

    // 2) في handleCheck
    const factor = getDecimalFactor(currentQ);
    const targetValue = Math.round(currentQ.result * factor);
    const isCorrect = abacusValue === targetValue;

    const timeMs = elapsedMs;
    trackPerformance(isCorrect, timeMs);
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback('correct');
      playSound('success');
      sorobana.speakCorrect();
      onXP?.(XP_PER_CORRECT);
      addXP(XP_PER_CORRECT);
      updateStreak();
      burst?.(0.5, 0.5);
    } else {
      setFeedback('wrong');
      playSound('error');
      sorobana.speakWrong();
    }
    setSavedTimeMs(timeMs);
    setPhase('reveal');
  }, [
    currentQ, abacusValue, elapsedMs, feedback, playSound, sorobana,
    onXP, burst, addXP, updateStreak, trackPerformance,
  ]);

  const buildPerformances = useCallback((): SkillPerformance[] => {
    const list: SkillPerformance[] = [];
    perfRef.current.forEach((stats, skillId) => {
      const avgTimeMs = stats.attempts === 0 ? 0 : stats.totalTimeMs / stats.attempts;
      list.push({
        skillId, correct: stats.correct, attempts: stats.attempts,
        avgTimeMs, answerMs: stats.answerMs,
        speedClass: classifySpeed(avgTimeMs, stats.answerMs),
      });
    });
    return list;
  }, []);

  const saveGrade = useCallback(
    (finalScore: number, totalQuestions: number): boolean => {
      const percentage = Math.round((finalScore / totalQuestions) * 100);
      const passed = percentage >= PASS_THRESHOLD;
      const firstSection = questions[0]?.section ?? 'S01';
      saveSectionGrade(
        level, firstSection, 'anzanAudio', percentage,
        Array.from(wrongModulesRef.current),
      );
      return passed;
    },
    [level, questions],
  );

  const nextQuestion = useCallback(() => {
    sorobana.stop();
    stopSpeech();
    setAbacusValue(0);
    setFeedback('idle');
    setElapsedMs(0);
    setSavedTimeMs(null);
    setReplayUsed(false);
    if (currentIdx + 1 >= questions.length) {
      const passed = saveGrade(score, questions.length);
      setPerformances(buildPerformances());
      setPhase('result');
      playSound(passed ? 'levelup' : 'whoosh');
      onComplete?.(passed, score);
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('listening');
    }
  }, [
    currentIdx, questions.length, score, playSound,
    sorobana, stopSpeech, onComplete, buildPerformances, saveGrade,
  ]);

  const handleEnd = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopSpeech();
    sorobana.stop();
    const passed = saveGrade(score, questions.length);
    setPerformances(buildPerformances());
    setPhase('result');
    playSound('whoosh');
    onComplete?.(passed, score);
  }, [
    score, questions.length, playSound, stopSpeech,
    sorobana, onComplete, buildPerformances, saveGrade,
  ]);

  // ═══ إذا المتصفح لا يدعم الصوت ═══
  if (!isSupported) {
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <Volume2 className="w-16 h-16 text-red-300 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">المتصفح لا يدعم الصوت</h2>
        <p className="text-white/60 text-center mb-6">جرّب متصفحاً آخر</p>
        <button onClick={() => { playSound('click'); onBack(); }} className="btn-primary">رجوع</button>
      </div>
    );
  }

  // ═══ 🚧 empty ═══
  if (phase === 'empty') {
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl mb-6">
          <span className="text-4xl">🚧</span>
        </div>
        <h2 className="text-2xl font-extrabold font-display text-white mb-3 text-center">
          هذا المستوى قيد البناء
        </h2>
        <p className="text-white/60 font-body text-center mb-8 leading-relaxed max-w-md">
          لم نُكمل أسئلة {level} بعد. جرّب L0 الآن — إنه جاهز!
        </p>
        <button
          type="button"
          onClick={() => { playSound('click'); onBack(); }}
          className="btn-primary"
        >
          رجوع
        </button>
      </div>
    );
  }

  // ═══ intro ═══
  if (phase === 'intro') {
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-extrabold font-display text-white truncate">الأنزان السمعي</h2>
            <p className="text-sm text-white/50 font-body">
              {level} — {formatNumber(expectedQuestionCount, numberStyle)} أسئلة
            </p>
          </div>
          <Volume2 className="w-6 h-6 text-purple-300" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl mx-auto mb-4">
            <Volume2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-extrabold font-display text-white text-center mb-4">🎧 كيف يعمل؟</h3>
          <div className="space-y-3 text-sm text-white/80 font-body">
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">1.</span>
              <p>ستسمع الأرقام <strong>واحداً واحداً</strong> بالعربية</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">2.</span>
              <p>الرقم الأول بلا إشارة، والباقي مع إشاراته</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">3.</span>
              <p>بعد آخر رقم → عدّاد الإجابة يبدأ</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">4.</span>
              <p>يمكنك إعادة السمع <strong>مرة واحدة</strong>، وإنهاء التدريب في أي لحظة</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-300 font-bold shrink-0">5.</span>
              <p>{formatNumber(XP_PER_CORRECT, numberStyle)} نقاط خبرة لكل إجابة صحيحة</p>
            </div>
          </div>
          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 font-body">
                💡 العدّاد يتوهج عند {formatNumber(70, numberStyle)}٪ من الوقت.
              </p>
            </div>
          </div>
        </motion.div>

        <button type="button" onClick={startSession} className="btn-primary w-full !py-4 !text-lg">
          <Play className="w-6 h-6" />
          ابدأ الجلسة
        </button>
      </div>
    );
  }

  // ═══ 🎧 listening ═══
  if (phase === 'listening' && currentQ) {
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto min-h-screen flex flex-col">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-xs text-white/50 font-body">أنزان سمعي</p>
          </div>
          <button type="button" onClick={handleEnd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-200 text-xs font-bold transition">
            <Square className="w-3.5 h-3.5" />
            إنهاء
          </button>
        </div>

        <div className="mb-6">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-electric-500"
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ scale: isSpeaking ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center"
          >
            <Volume2 className="w-16 h-16 text-white" />
          </motion.div>
        </div>

        <p className="text-xs text-white/40 font-body text-center mt-6">
          🎧 اسمع الأرقام وجهّز أصابعك...
        </p>
      </div>
    );
  }

  // ═══ ✍️ answering ═══
  if (phase === 'answering' && currentQ) {
    const columns = getColumnsForQuestion(currentQ);
    const hint = extractHint(currentQ);
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-xs text-white/50 font-body">مثّل الناتج على العداد</p>
          </div>
          <button type="button" onClick={handleEnd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-200 text-xs font-bold transition">
            <Square className="w-3.5 h-3.5" />
            إنهاء
          </button>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
            isWarning ? 'bg-red-500/30 border-red-500/70 shadow-lg shadow-red-500/50 animate-pulse' : 'bg-white/5 border-white/10'
          }`}>
            <Clock className={`w-4 h-4 ${isWarning ? 'text-red-300' : 'text-amber-300'}`} />
            <span className={`font-bold font-mono ${isWarning ? 'text-red-200' : 'text-white'}`}>
              {formatNumber((elapsedMs / 1000).toFixed(1), numberStyle)}s
            </span>
          </div>
        </div>

        <div className="mb-5">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div className={`h-full rounded-full transition-colors ${
              isWarning ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-emerald-400 to-teal-500'
            }`} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-white/70 font-body">
              {formatNumber(score, numberStyle)} / {formatNumber(currentIdx + 1, numberStyle)}
            </span>
          </div>
          <button type="button" onClick={handleReplay} disabled={replayUsed}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-bold hover:bg-purple-500/30 disabled:opacity-40">
            <Volume2 className="w-3.5 h-3.5" />
            {replayUsed ? 'لا يمكن الإعادة' : 'إعادة السمع'}
          </button>
        </div>

        <div className="glass-card p-5 mb-5">
          {/* 🆕 التلميح قبل المعداد */}
          {hint && (
            <div className="mb-3 p-2 rounded-lg bg-purple-500/10 border border-purple-400/30">
              <p className="text-xs text-purple-200 font-body text-center">
                💡 <strong>تلميح:</strong> {hint}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <Soroban2D5
              key={`audio-anzan-${currentIdx}`}
              columns={columns}
              autoBeadSize={true}
              interactive={true}
              showValue={true}
              onValueChange={setAbacusValue}
            />
            <button type="button" onClick={handleCheck} className="btn-primary !py-3 !px-8">
              <CheckCircle2 className="w-5 h-5" />
              تحقق
            </button>
          </div>
        </div>

        <SorobanaCompanion
          isSpeaking={sorobana.isSpeaking}
          onClick={() => sorobana.speakTeaching()}
          variant="pointing"
          sizeOverride={150}
          offsetBottom="8rem"
          clickThrough={true}
        />
      </div>
    );
  }

  // ═══ 🎯 reveal ═══
  if (phase === 'reveal' && currentQ) {
    const isCorrect = feedback === 'correct';
    const formattedAnswer = formatNumber(currentQ.result, numberStyle);
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-6 overflow-hidden relative">
          <div className={`absolute -top-20 -right-20 w-48 h-48 blur-3xl ${isCorrect ? 'bg-emerald-500/30' : 'bg-red-500/30'}`} />
          <div className="relative text-center">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 ${
              isCorrect ? 'from-emerald-400 to-teal-600 shadow-xl shadow-emerald-500/40' : 'from-red-400 to-rose-600 shadow-xl shadow-red-500/40'
            }`}>
              {isCorrect ? <CheckCircle2 className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
            </div>
            <h2 className="text-2xl font-extrabold font-display text-white mb-2">
              {isCorrect ? 'أحسنت! 🎉' : 'ليس بعد'}
            </h2>
            <div className="my-6">
              <p className="text-sm text-white/60 font-body mb-1">الإجابة الصحيحة</p>
              <p className="text-5xl font-black font-display text-white" dir={isArabic ? 'rtl' : 'ltr'}>
                {formattedAnswer}
              </p>
            </div>
            {savedTimeMs !== null && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 inline-block">
                <p className="text-xs text-white/60 font-body">وقتك</p>
                <p className={`text-xl font-bold font-mono ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                  {formatNumber((savedTimeMs / 1000).toFixed(1), numberStyle)}s
                </p>
              </div>
            )}
            {currentQ.solution && (
              <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-400/30 text-right">
                <p className="text-xs text-blue-200 font-body leading-relaxed">
                  💡 {formatText(currentQ.solution, numberStyle)}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <button type="button" onClick={nextQuestion} className="btn-primary w-full !py-4 !text-lg">
          {currentIdx + 1 < questions.length ? 'التالي' : 'إنهاء الجلسة'}
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // ═══ 🏆 result ═══
  if (phase === 'result') {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= PASS_THRESHOLD;
    const xpEarned = score * XP_PER_CORRECT;
    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 overflow-hidden relative">
          <div className={`absolute -top-24 -right-24 w-64 h-64 blur-3xl ${passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`} />
          <div className="relative text-center">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-2xl mx-auto mb-4 ${
                passed ? 'from-emerald-400 to-teal-600 shadow-emerald-500/40' : 'from-amber-400 to-orange-600 shadow-amber-500/40'
              }`}>
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-extrabold font-display text-white mb-2">
              {passed ? 'أحسنت! نجحت 🎉' : 'حاول مرة أخرى 💪'}
            </h2>
            <p className="text-sm text-white/60 font-body mb-6">الأنزان السمعي</p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <p className="text-sm text-white/60 font-body">النتيجة</p>
              <p className="text-5xl font-black font-display text-white mt-1" dir={isArabic ? 'rtl' : 'ltr'}>
                {formatNumber(score, numberStyle)} / {formatNumber(questions.length, numberStyle)}
              </p>
              <p className={`text-lg font-bold font-body mt-1 ${passed ? 'text-emerald-300' : 'text-amber-300'}`}>
                {formatNumber(percentage, numberStyle)}٪
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-400/30">
              <p className="text-xs text-white/60 font-body">نقاط الخبرة</p>
              <p className="text-2xl font-black text-gold-300 font-display">
                +{formatNumber(xpEarned, numberStyle)} XP
              </p>
            </div>
          </div>
        </motion.div>

        {performances.length > 0 && (
          <AdaptiveFeedback performances={performances} sectionLabel="أنزان سمعي" levelNum={0} />
        )}

        <div className="space-y-3">
          <button type="button" onClick={() => { playSound('click'); startSession(); }} className="btn-primary w-full !py-3">
            <RotateCcw className="w-5 h-5" />
            جلسة جديدة
          </button>
          <button type="button" onClick={() => { playSound('click'); onBack(); }} className="btn-ghost w-full">
            رجوع
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default AudioAnzanScreen;