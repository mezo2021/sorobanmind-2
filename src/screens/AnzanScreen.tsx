// src/screens/AnzanScreen.tsx
// ✅ SRB: wrongSkillsRef يحفظ skillId كامل ("L2-S07-m1") بدل "m1"
// ✅ SRB: weakSkills = union(أخطاء + بطيئات من performances)
// ✅ SRB: يمنح شارة الأنزان البصري عند اجتياز الجلسة (≥ 70%)
// ✅ عرض المعادلة في سطر واحد (مع تصغير تلقائي)
// ✅ الشارات تُمنح فقط عند نجاح الجلسة (pendingBadgesRef)
// ✅ زر "إنهاء" يخرج بلا تقييم
// 📅 آخر تحديث: SRB Migration — Phase 3

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, CheckCircle2, XCircle, Clock,
  Trophy, RotateCcw, Play, Brain, Zap, Eye, AlertCircle, Square,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { SorobanaCompanion } from '@/components/SorobanaCompanion';
import { AdaptiveFeedback, type SkillPerformance } from '@/components/AdaptiveFeedback';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useSpeech } from '@/hooks/useSpeech';
import {
  useProgressStore,
  type AnzanBadges,
} from '@/store/progressStore';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { useMasteryBadgesStore, classifySpeed } from '@/store/masteryBadgesStore';
import { formatText, formatNumber } from '@/utils/numberStyle';
import { numberToArabicWordsDecimal } from '@/utils/arabicNumbers';

import {
  getAnzanQuestions,
  saveSectionGrade,
  countModulesInLevel,
  type SRBLevel,
  type SRBSection,
  type SRBQuestion,
  type SRBModule,
} from '@/data/srb-adapter';

type Phase = 'intro' | 'showing' | 'answering' | 'reveal' | 'result' | 'empty';
type Mode = 'flash' | 'normal';

interface AnzanScreenProps {
  level: SRBLevel;
  /** ⚠️ للتوافق — يُتجاهل، يُستخرج من currentQ.section */
  section?: SRBSection;
  initialMode?: Mode;
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

// 🆕 حجم الخط حسب طول النص (لضمان بقائه في سطر واحد)
function displayTextSize(len: number, isBuildOrRead: boolean): string {
  if (isBuildOrRead) {
    if (len > 22) return 'text-2xl sm:text-3xl';
    if (len > 16) return 'text-3xl sm:text-4xl';
    return 'text-3xl sm:text-5xl';
  }
  if (len > 22) return 'text-2xl sm:text-3xl';
  if (len > 16) return 'text-3xl sm:text-4xl';
  return 'text-5xl sm:text-7xl';
}

// 🆕 خريطة section → مفتاح شارة الأنزان البصري
function getAnzanBadgeKey(section: SRBSection): keyof AnzanBadges | null {
  switch (section) {
    case 'S03':
    case 'S04':
    case 'S05':
    case 'S06':
      return 'master_addition';
    case 'S07':
    case 'S08':
      return 'master_multiplication';
    case 'S09':
    case 'S10':
      return 'master_division';
    case 'S11':
    case 'S12':
      return 'master_mixed';
    default:
      // S13, S14, S15 → تجاهل حاليًا
      return null;
  }
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

function buildDisplayTerms(q: SRBQuestion): string[] {
  const { operands, operation, question } = q;

  if (operation === 'build' || operation === 'read') {
    return [question];
  }

  if (operation === 'multiplication') {
    return [String(operands[0]), `×${Math.abs(operands[1])}`];
  }
  if (operation === 'division') {
    return [String(operands[0]), `÷${Math.abs(operands[1])}`];
  }

  return operands.map((op, i) => {
    if (i === 0) return String(op);
    if (op >= 0) return String(op);
    return `-${Math.abs(op)}`;
  });
}

function buildFullQuestionText(q: SRBQuestion): string {
  const { operands, operation } = q;

  if (operation === 'multiplication') {
    return `${operands[0]} × ${Math.abs(operands[1])}`;
  }
  if (operation === 'division') {
    return `${operands[0]} ÷ ${Math.abs(operands[1])}`;
  }

  let text = String(operands[0]);
  for (let i = 1; i < operands.length; i++) {
    const op = operands[i];
    if (op >= 0) text += ` + ${op}`;
    else text += ` − ${Math.abs(op)}`;
  }
  return text;
}

function buildFullQuestionSpeech(q: SRBQuestion): string {
  const { operands, operation, question } = q;

  if (operation === 'build' || operation === 'read') {
    return question;
  }

  if (operation === 'multiplication') {
    return `${numberToArabicWordsDecimal(operands[0])} في ${numberToArabicWordsDecimal(Math.abs(operands[1]))}، يساوي`;
  }
  if (operation === 'division') {
    return `${numberToArabicWordsDecimal(operands[0])} على ${numberToArabicWordsDecimal(Math.abs(operands[1]))}، يساوي`;
  }

  const parts: string[] = [numberToArabicWordsDecimal(operands[0])];
  for (let i = 1; i < operands.length; i++) {
    const op = operands[i];
    if (op >= 0) parts.push(`زائد ${numberToArabicWordsDecimal(op)}`);
    else parts.push(`ناقص ${numberToArabicWordsDecimal(Math.abs(op))}`);
  }
  return parts.join('، ') + '، يساوي';
}

export function AnzanScreen({
  level,
  initialMode = 'flash',
  onBack,
  onComplete,
  playSound,
  onXP,
  burst,
}: AnzanScreenProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [mode, setMode] = useState<Mode>(initialMode);
  const [questions, setQuestions] = useState<SRBQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentTermIdx, setCurrentTermIdx] = useState(0);
  const [abacusValue, setAbacusValue] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [savedTimeMs, setSavedTimeMs] = useState<number | null>(null);
  const [performances, setPerformances] = useState<SkillPerformance[]>([]);
  const [justEarnedBadges, setJustEarnedBadges] = useState<string[]>([]);

  const sorobana = useSorobanaVoice();
  const { speak, stop: stopSpeech, isSpeaking, isSupported } = useSpeech();

  const addXP = useProgressStore((s) => s.addXP);
  const updateStreak = useProgressStore((s) => s.updateStreak);

  const anzanBadges = useProgressStore((s) => s.anzanBadges);
  const setAnzanBadge = useProgressStore((s) => s.setAnzanBadge);

  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic';

  const awardBadge = useMasteryBadgesStore((s) => s.awardBadge);
  const setGrade = useProgressStore((s) => s.setGrade);
  const setPendingRemediation = useProgressStore((s) => s.setPendingRemediation);
  const markAnzanVisualPassed = useProgressStore((s) => s.markAnzanVisualPassed);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const perfRef = useRef<Map<string, PerfStats>>(new Map());
  const wrongSkillsRef = useRef<Set<string>>(new Set());
  const pendingBadgesRef = useRef<Array<{ skillId: string; timeMs: number; answerMs: number }>>([]);

  const expectedQuestionCount = useMemo(
    () => Math.max(countModulesInLevel(level), 5),
    [level],
  );

  const currentQ = questions[currentIdx];
  const maxMs = currentQ ? getMaxMs(currentQ) : 30000;
  const warningAtMs = maxMs * WARNING_RATIO;
  const isWarning = elapsedMs >= warningAtMs;
  const progressPct = Math.min(100, (elapsedMs / maxMs) * 100);

  const displayTerms = currentQ ? buildDisplayTerms(currentQ) : [];

  const startSession = useCallback(() => {
    const qs = getAnzanQuestions(level, mode, Date.now(), []);
    if (qs.length === 0) {
      playSound('error');
      setPhase('empty');
      return;
    }
    perfRef.current = new Map();
    wrongSkillsRef.current = new Set();
    pendingBadgesRef.current = [];
    setQuestions(qs);
    setCurrentIdx(0);
    setCurrentTermIdx(0);
    setAbacusValue(0);
    setFeedback('idle');
    setScore(0);
    setElapsedMs(0);
    setSavedTimeMs(null);
    setPerformances([]);
    setJustEarnedBadges([]);
    setPhase('showing');
    playSound('click');
  }, [level, mode, playSound]);

  useEffect(() => {
    if (phase !== 'showing') return;
    if (!currentQ) return;

    const digits = currentQ.digit_count_max ?? 1;
    const displayMs = digits <= 1 ? 2000 : 3000;

    if (mode === 'normal') {
      if (isSupported) {
        const speech = buildFullQuestionSpeech(currentQ);
        speak(speech, { rate: 0.9 });
      }
      const t = setTimeout(() => {
        stopSpeech();
        setPhase('answering');
      }, displayMs);
      return () => {
        clearTimeout(t);
        stopSpeech();
      };
    }

    if (currentTermIdx >= displayTerms.length) {
      const t = setTimeout(() => setPhase('answering'), 300);
      return () => clearTimeout(t);
    }

    displayTimerRef.current = setTimeout(() => {
      setCurrentTermIdx((i) => i + 1);
    }, displayMs);

    return () => {
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentTermIdx, displayTerms.length, mode, isSupported, currentQ]);

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
        if (cls === 'mastery') {
          pendingBadgesRef.current.push({ skillId, timeMs, answerMs });
        }
      } else {
        wrongSkillsRef.current.add(skillId);
      }
    },
    [currentQ, level],
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

  const handleCheck = useCallback(() => {
    if (!currentQ || feedback !== 'idle') return;
    if (timerRef.current) clearInterval(timerRef.current);

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

      if (passed) {
        const uniqueSections = new Set(questions.map((q) => q.section));
        const earned: string[] = [];

        uniqueSections.forEach((section) => {
          const key = getAnzanBadgeKey(section);
          if (key && !anzanBadges[key]) {
            setAnzanBadge(key, true);
            earned.push(key);
          }
        });

        if (earned.length > 0) {
          setJustEarnedBadges(earned);
        }
      }

      const perf = buildPerformances();
      const weakSkillIds = new Set<string>([
        ...wrongSkillsRef.current,
        ...perf
          .filter((p) => p.speedClass === 'slow' || p.correct < p.attempts)
          .map((p) => p.skillId),
      ]);

      const gradeMode = mode === 'flash' ? 'anzanVisualFlash' : 'anzanVisualNormal';
      const firstSection = questions[0]?.section ?? 'S01';

      saveSectionGrade(
        level, firstSection, gradeMode, percentage,
        Array.from(weakSkillIds),
      );

      // ✅ حفظ الدرجة في progressStore
      setGrade(level, gradeMode, percentage);

      // ✅ تسجيل نجاح الأنزان البصري — فقط بعد نجاح النوعين (عادي + Flash)
      if (passed) {
        const lg = useProgressStore.getState().grades[level];
        const normalOk =
          lg?.anzanVisualNormal !== null && lg?.anzanVisualNormal !== undefined;
        const flashOk =
          lg?.anzanVisualFlash !== null && lg?.anzanVisualFlash !== undefined;
        if (normalOk && flashOk) {
          markAnzanVisualPassed(Number(level.slice(1)));
        }
      }

      // ✅ منح الشارات فقط عند نجاح الجلسة
      if (passed) {
        pendingBadgesRef.current.forEach((b) => {
          awardBadge(b.skillId, b.timeMs, b.answerMs);
        });
      }
      pendingBadgesRef.current = [];

      // ✅ جلسة علاجية إجبارية عند وجود مهارات ضعيفة
      if (weakSkillIds.size > 0) {
        setPendingRemediation({
          level,
          phase: gradeMode,
          skills: Array.from(weakSkillIds),
          outcome: passed ? 'passed' : 'failed',
        });
      }

      return passed;
    },
    [
      level, mode, questions, anzanBadges, setAnzanBadge, buildPerformances,
      setGrade, setPendingRemediation, markAnzanVisualPassed, awardBadge,
    ],
  );

  const nextQuestion = useCallback(() => {
    sorobana.stop();
    stopSpeech();
    setAbacusValue(0);
    setFeedback('idle');
    setElapsedMs(0);
    setSavedTimeMs(null);
    setCurrentTermIdx(0);
    if (currentIdx + 1 >= questions.length) {
      const passed = saveGrade(score, questions.length);
      setPerformances(buildPerformances());
      setPhase('result');
      playSound(passed ? 'levelup' : 'whoosh');
      onComplete?.(passed, score);
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('showing');
    }
  }, [
    currentIdx, questions.length, score, playSound,
    sorobana, stopSpeech, onComplete, buildPerformances, saveGrade,
  ]);

  // ✅ "إنهاء" — خروج بلا تقييم (لا حفظ درجة، لا شارات، لا علاجية)
  const handleEnd = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopSpeech();
    sorobana.stop();
    pendingBadgesRef.current = [];
    playSound('whoosh');
    onBack();
  }, [sorobana, stopSpeech, playSound, onBack]);

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
            <h2 className="text-2xl font-extrabold font-display text-white truncate">
              الأنزان البصري
            </h2>
            <p className="text-sm text-white/50 font-body">
              {level} — {formatNumber(expectedQuestionCount, numberStyle)} أسئلة
            </p>
          </div>
          <Brain className="w-6 h-6 text-purple-300" />
        </div>

        <div className="flex gap-2 mb-5 bg-white/5 p-1 rounded-2xl">
          <button type="button" onClick={() => { playSound('click'); setMode('flash'); }}
            className={`flex-1 py-3 rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 ${
              mode === 'flash' ? 'bg-purple-600 shadow-lg text-white' : 'text-white/60'
            }`}>
            <Zap className="w-4 h-4" />
            Flash (تحدٍّ)
          </button>
          <button type="button" onClick={() => { playSound('click'); setMode('normal'); }}
            className={`flex-1 py-3 rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 ${
              mode === 'normal' ? 'bg-purple-600 shadow-lg text-white' : 'text-white/60'
            }`}>
            <Eye className="w-4 h-4" />
            عادي
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-electric-500 flex items-center justify-center shadow-xl shadow-purple-500/40 mx-auto mb-4">
            {mode === 'flash' ? <Zap className="w-10 h-10 text-white" /> : <Eye className="w-10 h-10 text-white" />}
          </div>
          <h3 className="text-xl font-extrabold font-display text-white text-center mb-4">
            {mode === 'flash' ? 'الوضع السريع (Flash)' : 'الوضع العادي'}
          </h3>
          <div className="space-y-3 text-sm text-white/80 font-body">
            {mode === 'flash' ? (
              <>
                <div className="flex items-start gap-3"><span className="text-purple-300 font-bold shrink-0">1.</span><p>الأرقام تظهر <strong>واحداً واحداً</strong></p></div>
                <div className="flex items-start gap-3"><span className="text-purple-300 font-bold shrink-0">2.</span><p>الرقم الأول بلا إشارة، والباقي مع إشاراته</p></div>
                <div className="flex items-start gap-3"><span className="text-purple-300 font-bold shrink-0">3.</span><p>بعد آخر رقم → عدّاد الإجابة</p></div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3"><span className="text-purple-300 font-bold shrink-0">1.</span><p>السؤال يظهر <strong>كاملاً</strong> مع صوت</p></div>
                <div className="flex items-start gap-3"><span className="text-purple-300 font-bold shrink-0">2.</span><p>يختفي بعد 2-3 ثوان</p></div>
                <div className="flex items-start gap-3"><span className="text-purple-300 font-bold shrink-0">3.</span><p>ثم تبني الناتج</p></div>
              </>
            )}
            <div className="flex items-start gap-3"><span className="text-purple-300 font-bold shrink-0">4.</span><p>زر "تحقق" متاح، والانتقال يدوي بزر "التالي"</p></div>
            <div className="flex items-start gap-3"><span className="text-purple-300 font-bold shrink-0">5.</span><p>يمكنك إنهاء التدريب في أي لحظة</p></div>
          </div>
          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 font-body leading-relaxed">
                💡 <strong>تحذير:</strong> سيُنبّهك العدّاد عند {formatNumber(70, numberStyle)}٪ من الوقت.
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

  // ═══ 👁️ showing ═══
  if (phase === 'showing' && currentQ) {
    const isBuildOrRead = currentQ.operation === 'build' || currentQ.operation === 'read';

    // 🆕 نص العرض + حجم الخط
    const displayText = isBuildOrRead
      ? formatText(currentQ.question, numberStyle)
      : `${formatText(buildFullQuestionText(currentQ), numberStyle)} = ؟`;
    const sizeClass = displayTextSize(displayText.length, isBuildOrRead);

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto min-h-screen flex flex-col">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">
              السؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-xs text-white/50 font-body">
              {mode === 'flash' ? 'Flash' : 'عادي'}
            </p>
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
          {mode === 'flash' ? (
            <AnimatePresence mode="wait">
              {currentTermIdx < displayTerms.length ? (
                <motion.div key={currentTermIdx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.3 }}
                  className="text-center">
                  <p className={`font-black font-display text-white ${isBuildOrRead ? 'text-3xl sm:text-5xl' : 'text-7xl sm:text-9xl'}`}
                    dir={isArabic ? 'rtl' : 'ltr'}>
                    {formatText(displayTerms[currentTermIdx], numberStyle)}
                  </p>
                  <p className="text-sm text-white/40 font-body mt-4">
                    {formatNumber(currentTermIdx + 1, numberStyle)} / {formatNumber(displayTerms.length, numberStyle)}
                  </p>
                </motion.div>
              ) : (
                <motion.p key="blank" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-4xl font-display text-white/30">...</motion.p>
              )}
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full">
              <p className="text-sm text-white/50 font-body mb-4">اقرأ السؤال</p>
              {/* 🆕 سطر واحد — بلا كسر */}
              <p
                dir={isBuildOrRead ? (isArabic ? 'rtl' : 'ltr') : 'ltr'}
                className={`font-black font-display text-white ${sizeClass} whitespace-nowrap`}
              >
                {displayText}
              </p>
            </motion.div>
          )}
        </div>

        <p className="text-xs text-white/40 font-body text-center mt-6">
          {mode === 'flash' ? '💡 جهّز أصابعك — طبّق كل رقم فوراً' : '🎧 اسمع السؤال بتركيز'}
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

        <div className="flex items-center justify-center gap-2 mb-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white/70 font-body">
            {formatNumber(score, numberStyle)} / {formatNumber(currentIdx + 1, numberStyle)}
          </span>
        </div>

        <div className="glass-card p-5 mb-5">
          {hint && (
            <div className="mb-3 p-2 rounded-lg bg-purple-500/10 border border-purple-400/30">
              <p className="text-xs text-purple-200 font-body text-center">
                💡 <strong>تلميح:</strong> {hint}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <Soroban2D5 key={`anzan-${currentIdx}`} columns={columns}
              autoBeadSize={true} interactive={true} showValue={true}
              onValueChange={setAbacusValue} />
            <button type="button" onClick={handleCheck} className="btn-primary !py-3 !px-8">
              <CheckCircle2 className="w-5 h-5" />
              تحقق
            </button>
          </div>
        </div>

        <SorobanaCompanion isSpeaking={sorobana.isSpeaking}
          onClick={() => sorobana.speakTeaching()} variant="pointing"
          sizeOverride={150} offsetBottom="8rem" clickThrough={true} />
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
          <div className={`absolute -top-20 -right-20 w-48 h-48 blur-3xl ${
            isCorrect ? 'bg-emerald-500/30' : 'bg-red-500/30'
          }`} />
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
                <p className={`text-xl font-bold font-mono ${
                  isCorrect ? 'text-emerald-300' : 'text-red-300'
                }`}>
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

    const ANZAN_BADGE_LABELS: Record<string, string> = {
      master_addition: '🧠 خبير جمع وطرح',
      master_multiplication: '✖️ خبير ضرب',
      master_division: '➗ خبير قسمة',
      master_mixed: '🔀 خبير مختلط',
    };

    return (
      <div dir="rtl" className="px-3 sm:px-6 py-6 max-w-2xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 overflow-hidden relative">
          <div className={`absolute -top-24 -right-24 w-64 h-64 blur-3xl ${
            passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'
          }`} />
          <div className="relative text-center">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-2xl mx-auto mb-4 ${
                passed ? 'from-emerald-400 to-teal-600 shadow-emerald-500/40' : 'from-amber-400 to-orange-600 shadow-amber-500/40'
              }`}>
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-extrabold font-display text-white mb-2">
              {passed ? '🎉 اجتزت الأنزان البصري!' : '💪 حاول مرة أخرى'}
            </h2>
            {passed && (
              <p className="text-lg font-bold text-emerald-300 font-display mb-2">
                بدرجة {formatNumber(percentage, numberStyle)}٪
              </p>
            )}
            <p className="text-sm text-white/60 font-body mb-6">
              {mode === 'flash' ? 'الوضع السريع (Flash)' : 'الوضع العادي'}
              {passed && performances.some((p) => p.speedClass === 'slow' || p.correct < p.attempts) && (
                <> — 🔒 جلسة علاجية إجبارية</>
              )}
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <p className="text-sm text-white/60 font-body">النتيجة</p>
              <p className="text-5xl font-black font-display text-white mt-1" dir={isArabic ? 'rtl' : 'ltr'}>
                {formatNumber(score, numberStyle)} / {formatNumber(questions.length, numberStyle)}
              </p>
              <p className={`text-lg font-bold font-body mt-1 ${
                passed ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {formatNumber(percentage, numberStyle)}٪
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-400/30">
              <p className="text-xs text-white/60 font-body">نقاط الخبرة</p>
              <p className="text-2xl font-black text-gold-300 font-display">
                +{formatNumber(xpEarned, numberStyle)} XP
              </p>
            </div>

            {justEarnedBadges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-4 rounded-2xl bg-gradient-to-l from-gold-400/20 to-transparent border-2 border-gold-400/50"
              >
                <p className="text-sm font-bold text-gold-200 font-display mb-2">
                  🎉 حصلت على شارة جديدة!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {justEarnedBadges.map((key) => (
                    <span
                      key={key}
                      className="px-3 py-1.5 rounded-xl bg-gold-400/30 text-gold-100 text-xs font-bold"
                    >
                      {ANZAN_BADGE_LABELS[key] ?? key}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {performances.length > 0 && (
          <AdaptiveFeedback performances={performances} sectionLabel="أنزان بصري" levelNum={0} />
        )}

        <div className="space-y-3">
          <button type="button" onClick={() => { playSound('click'); startSession(); }}
            className="btn-primary w-full !py-3">
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

export default AnzanScreen;