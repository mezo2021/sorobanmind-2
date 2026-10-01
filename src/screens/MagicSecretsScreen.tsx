import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X, Check, Grid3X3, Lock, Star, Timer, Trophy, Volume2, Square } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { FloatingCompanion } from '@/components/FloatingCompanion';

// ===== النص الصوتي (قصة الدرس) =====
const LESSON_STORY =
  'في غرفة الحكيم معداد، صندوق ذهبي قديم يحوي أسراراً لجدول الضرب. كل سر منها يفتح باباً لعالم من السرعة والذكاء. سيخبرنا الحكيم كيف نضرب في ٥ بخفة، وفي ٩ بلعبة الأصابع، وفي ١١ بقاعدة الجيران. هل أنتم مستعدون لفتح الصندوق؟';

// ===== بيانات الجدول المختصر =====
const SHORT_TABLE: Record<number, Array<{ a: number; b: number; r: number }>> = {};
for (let i = 1; i <= 9; i++) {
  SHORT_TABLE[i] = [];
  for (let j = i; j <= 9; j++) SHORT_TABLE[i].push({ a: i, b: j, r: i * j });
}

// ===== أوقات الأسرار =====
const SECRET_TIMES: Record<number, number> = {
  5: 5, 6: 6, 7: 8, 8: 8, 9: 5,
  10: 6, 11: 10, 12: 6, 13: 10, 14: 12,
  15: 12, 16: 10, 17: 18, 18: 18, 19: 15, 20: 18,
};
function getTimeForSecret(id: number): number { return SECRET_TIMES[id] || 10; }

const QUESTIONS_PER_EXAM = 7;

// ===== توليد الأسئلة =====
type Question = { q: string; a: number };

function generateQuestions(secretId: number): Question[] {
  const questions: Question[] = [];
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

  if (secretId === 5) shuffle([3,4,6,7,8,9,12,14,16,18]).slice(0,QUESTIONS_PER_EXAM).forEach(n => questions.push({ q:`5 × ${n}`, a:5*n }));
  else if (secretId === 6) shuffle([2,4,6,8,12,14,16,18,22,24]).slice(0,QUESTIONS_PER_EXAM).forEach(n => questions.push({ q:`6 × ${n}`, a:6*n }));
  else if (secretId === 7) shuffle([2,3,4,5,6,7,8,9,11,12]).slice(0,QUESTIONS_PER_EXAM).forEach(n => questions.push({ q:`7 × ${n}`, a:7*n }));
  else if (secretId === 8) shuffle([2,3,4,5,6,7,8,9,11,12]).slice(0,QUESTIONS_PER_EXAM).forEach(n => questions.push({ q:`8 × ${n}`, a:8*n }));
  else if (secretId === 9) shuffle([2,3,4,5,6,7,8,9,11,12]).slice(0,QUESTIONS_PER_EXAM).forEach(n => questions.push({ q:`9 × ${n}`, a:9*n }));
  else if (secretId === 10) shuffle([3,5,6,7,9,11,12,13,14]).slice(0,QUESTIONS_PER_EXAM).forEach(n => {
    const is4 = Math.random() > 0.5;
    if (is4) questions.push({ q:`${n} × 4`, a:n*4 }); else questions.push({ q:`${n} × 8`, a:n*8 });
  });
  else if (secretId === 11) {
    const pairs: [number,number][] = [];
    for (let i=6;i<=9;i++) for (let j=6;j<=9;j++) pairs.push([i,j]);
    shuffle(pairs).slice(0,QUESTIONS_PER_EXAM).forEach(([a,b]) => questions.push({ q:`${a} × ${b}`, a:a*b }));
  }
  else if (secretId === 12) shuffle([12,23,34,45,51,62,71,82,91,153,220,132]).slice(0,QUESTIONS_PER_EXAM).forEach(n => questions.push({ q:`${n} × 11`, a:n*11 }));
  else if (secretId === 13) shuffle([3,5,7,12,25,34,46,55,62,78,87,91]).slice(0,QUESTIONS_PER_EXAM).forEach(n => questions.push({ q:`${n} × 99`, a:n*99 }));
  else if (secretId === 14) shuffle([2,3,5,7,12,20,45,76,33,88,55,66]).slice(0,QUESTIONS_PER_EXAM).forEach(n => questions.push({ q:`${n} × 999`, a:n*999 }));
  else if (secretId === 15) {
    const pairs: [number,number][] = [];
    for (let i=90;i<=99;i++) for (let j=90;j<=99;j++) pairs.push([i,j]);
    shuffle(pairs).slice(0,QUESTIONS_PER_EXAM).forEach(([a,b]) => questions.push({ q:`${a} × ${b}`, a:a*b }));
  }
  else if (secretId === 16) {
    const pairs: [number,number][] = [];
    for (let i=101;i<=108;i++) for (let j=101;j<=108;j++) pairs.push([i,j]);
    shuffle(pairs).slice(0,QUESTIONS_PER_EXAM).forEach(([a,b]) => questions.push({ q:`${a} × ${b}`, a:a*b }));
  }
  else if (secretId === 17) {
    const pairs: [number,number][] = [];
    for (let i=900;i<=999;i+=3) for (let j=900;j<=999;j+=7) pairs.push([i,j]);
    shuffle(pairs).slice(0,QUESTIONS_PER_EXAM).forEach(([a,b]) => questions.push({ q:`${a} × ${b}`, a:a*b }));
  }
  else if (secretId === 18) {
    const pairs: [number,number][] = [];
    for (let i=1001;i<=1050;i+=3) for (let j=1001;j<=1050;j+=5) pairs.push([i,j]);
    shuffle(pairs).slice(0,QUESTIONS_PER_EXAM).forEach(([a,b]) => questions.push({ q:`${a} × ${b}`, a:a*b }));
  }
  else if (secretId === 19) {
    const pairs: [number,number][] = [];
    for (let i=40;i<=65;i+=2) for (let j=40;j<=65;j+=3) pairs.push([i,j]);
    shuffle(pairs).slice(0,QUESTIONS_PER_EXAM).forEach(([a,b]) => questions.push({ q:`${a} × ${b}`, a:a*b }));
  }
  else if (secretId === 20) {
    const pairs: [number,number][] = [];
    for (let i=450;i<=550;i+=7) for (let j=450;j<=550;j+=9) pairs.push([i,j]);
    shuffle(pairs).slice(0,QUESTIONS_PER_EXAM).forEach(([a,b]) => questions.push({ q:`${a} × ${b}`, a:a*b }));
  }
  return questions;
}

// ===== بطاقات الأسرار =====
const SECRETS = [
  { id:5, title:'سر جدول الـ 5', icon:'✋', color:'from-cyan-500 to-blue-600',
    rule:'الآحاد: زوجي = 0، فردي = 5', rule2:'العشرات: نصف الرقم (بدون كسور)',
    examples:[
      { q:'5 × 7', a:'35', steps:'7 فردي ← 5 | نصف 7 = 3 → 35' },
      { q:'5 × 8', a:'40', steps:'8 زوجي ← 0 | نصف 8 = 4 → 40' },
      { q:'5 × 6', a:'30', steps:'6 زوجي ← 0 | نصف 6 = 3 → 30' },
    ]},
  { id:6, title:'سر جدول الـ 6', icon:'🎲', color:'from-purple-500 to-pink-600',
    rule:'للأعداد الزوجية فقط', rule2:'الآحاد: نفس الرقم | العشرات: نصفه',
    examples:[
      { q:'6 × 4', a:'24', steps:'4 زوجي → آحاد 4 | نصف 4 = 2 → 24' },
      { q:'6 × 8', a:'48', steps:'8 زوجي → آحاد 8 | نصف 8 = 4 → 48' },
      { q:'6 × 2', a:'12', steps:'2 زوجي → آحاد 2 | نصف 2 = 1 → 12' },
    ], note:'مع الأعداد الفردية استخدم طريقة أخرى!' },
  { id:7, title:'لغز الرقم 7', icon:'🔮', color:'from-amber-500 to-orange-600',
    rule:'الآحاد: اطرح 3 في كل مرة (مع الدوران عند 10)', rule2:'العشرات: تتصاعد وتتوقف عند 2 و 4 مرتين',
    examples:[
      { q:'7 × 1', a:'07', steps:'آحاد: 7 | عشرات: 0' },
      { q:'7 × 3', a:'21', steps:'آحاد: 7→4→1 | عشرات: 2' },
      { q:'7 × 6', a:'42', steps:'آحاد: 7→4→1→8→5→2 | عشرات: 4' },
    ]},
  { id:8, title:'سر جدول الـ 8', icon:'🎯', color:'from-emerald-500 to-teal-600',
    rule:'الآحاد: اطرح 2 في كل مرة (مع الدوران عند 10)', rule2:'العشرات: تتصاعد، وتتوقف عند 4 مرتين',
    examples:[
      { q:'8 × 1', a:'08', steps:'آحاد: 8 | عشرات: 0' },
      { q:'8 × 5', a:'40', steps:'آحاد: 8→6→4→2→0 | عشرات: 4' },
      { q:'8 × 7', a:'56', steps:'آحاد: 8→6→4→2→0→8→6 | عشرات: 5' },
    ]},
  { id:9, title:'سر جدول الـ 9', icon:'✨', color:'from-rose-500 to-red-600',
    rule:'الآحاد: صديق العدد الكبير (مكمّله إلى 10)', rule2:'العشرات: أكمل العدّ إلى 9 | المجموع = 9',
    examples:[
      { q:'9 × 1', a:'09', steps:'صديق 1 = 9 (آحاد) | 9−9 = 0 (عشرات)' },
      { q:'9 × 4', a:'36', steps:'صديق 4 = 6 (آحاد) | 9−6 = 3 (عشرات)' },
      { q:'9 × 7', a:'63', steps:'صديق 7 = 3 (آحاد) | 9−3 = 6 (عشرات)' },
    ]},
  { id:10, title:'سر المضاعفة', icon:'➗', color:'from-teal-500 to-cyan-600',
    rule:'للضرب في 4: ضاعف الرقم مرتين', rule2:'للضرب في 8: ضاعف الرقم ثلاث مرات',
    examples:[
      { q:'6 × 4', a:'24', steps:'6 ← 12 ← 24' },
      { q:'6 × 8', a:'48', steps:'6 ← 12 ← 24 ← 48' },
      { q:'7 × 4', a:'28', steps:'7 ← 14 ← 28' },
    ]},
  { id:11, title:'سر أصابع الضرب', icon:'🖐️', color:'from-orange-500 to-amber-600',
    rule:'الأصابع بالترتيب: الخنصر = 6، البنصر = 7، الوسطى = 8، السبابة = 9، الإبهام = 10',
    rule2:'الأصابع المرفوعة: نضربها ببعض (للآحاد) | الأصابع المضمومة: نجمعها ونضرب في 10 (للعشرات)',
    examples:[
      { q:'7 × 8', a:'56', steps:'المرفوعة (آحاد): 3 × 2 = 6 | المضمومة (عشرات): (2 + 3) × 10 = 50 | المجموع: 6 + 50 = 56' },
      { q:'6 × 7', a:'42', steps:'المرفوعة (آحاد): 4 × 3 = 12 | المضمومة (عشرات): (1 + 2) × 10 = 30 | المجموع: 12 + 30 = 42' },
      { q:'8 × 9', a:'72', steps:'المرفوعة (آحاد): 2 × 1 = 2 | المضمومة (عشرات): (3 + 4) × 10 = 70 | المجموع: 2 + 70 = 72' },
    ]},
  { id:12, title:'الضرب في 11', icon:'🔢', color:'from-violet-500 to-purple-600',
    rule:'الطرفان كما هما، والوسط حاصل جمع الجيران', rule2:'مع الحمل: إذا كان الجمع > 9 → نحمل للرقم التالي',
    examples:[
      { q:'34 × 11', a:'374', steps:'3 _ 4 → 3+4=7 → 374' },
      { q:'153 × 11', a:'1683', steps:'1 _ _ 3 → 5+3=8، 1+5=6 → 1683' },
      { q:'556 × 11', a:'6116', steps:'5 _ _ 6 → مع الحمل → 6116' },
    ]},
  { id:13, title:'الضرب في 99', icon:'9️⃣', color:'from-rose-600 to-pink-700',
    rule:'اطرح 1 من الرقم → ثم اطرح الناتج من 99', rule2:'ينفع فقط للأعداد ≤ 99',
    examples:[
      { q:'12 × 99', a:'1188', steps:'12−1=11، 99−11=88 → 1188' },
      { q:'25 × 99', a:'2475', steps:'25−1=24، 99−24=75 → 2475' },
      { q:'55 × 99', a:'5445', steps:'55−1=54، 99−54=45 → 5445' },
    ]},
  { id:14, title:'الضرب في 999', icon:'9️⃣9️⃣', color:'from-fuchsia-600 to-purple-700',
    rule:'اطرح 1 من الرقم → ثم اطرح الناتج من 999', rule2:'نفس فكرة 99 لكن مع 3 منازل',
    examples:[
      { q:'20 × 999', a:'19980', steps:'20−1=19، 999−019=980 → 19980' },
      { q:'76 × 999', a:'75924', steps:'76−1=75، 999−075=924 → 75924' },
      { q:'50 × 999', a:'49950', steps:'50−1=49، 999−049=950 → 49950' },
    ]},
  { id:15, title:'أصدقاء المئة (تحت 100)', icon:'💯', color:'from-blue-600 to-indigo-700',
    rule:'١) احسب بُعد كل رقم عن 100 (100 − الرقم)',
    rule2:'٢) اضرب البُعدين → الجزء الأيمن | ٣) اجمع البُعدين، ثم اطرح مجموعهما من 100 → الجزء الأيسر',
    examples:[
      { q:'96 × 97', a:'9312', steps:'بُعد 96 = 4، بُعد 97 = 3 | الجزء الأيمن: 4 × 3 = 12 | مجموع البُعدين: 4 + 3 = 7 | الجزء الأيسر: 100 − 7 = 93 | الناتج: 93 | 12 → 9312' },
      { q:'95 × 98', a:'9310', steps:'بُعد 95 = 5، بُعد 98 = 2 | الجزء الأيمن: 5 × 2 = 10 | مجموع البُعدين: 5 + 2 = 7 | الجزء الأيسر: 100 − 7 = 93 | الناتج: 93 | 10 → 9310' },
      { q:'92 × 97', a:'8924', steps:'بُعد 92 = 8، بُعد 97 = 3 | الجزء الأيمن: 8 × 3 = 24 | مجموع البُعدين: 8 + 3 = 11 | الجزء الأيسر: 100 − 11 = 89 | الناتج: 89 | 24 → 8924' },
    ]},
  { id:16, title:'الأعداد فوق 100', icon:'🔼', color:'from-emerald-600 to-green-700',
    rule:'١) اضرب آحاد الرقمين → الجزء الأيمن (منزلتين)',
    rule2:'٢) اجمع الآحادين + 100 → الجزء الأيسر | ٣) ادمج الجزئين',
    examples:[
      { q:'104 × 103', a:'10712', steps:'آحاد: 4 و 3 | الجزء الأيمن: 4 × 3 = 12 | الجزء الأيسر: 4 + 3 + 100 = 107 | الناتج: 107 | 12 → 10712' },
      { q:'105 × 104', a:'10920', steps:'آحاد: 5 و 4 | الجزء الأيمن: 5 × 4 = 20 | الجزء الأيسر: 5 + 4 + 100 = 109 | الناتج: 109 | 20 → 10920' },
      { q:'106 × 103', a:'10918', steps:'آحاد: 6 و 3 | الجزء الأيمن: 6 × 3 = 18 | الجزء الأيسر: 6 + 3 + 100 = 109 | الناتج: 109 | 18 → 10918' },
    ]},
  { id:17, title:'الأعداد تحت 1000', icon:'🔽', color:'from-cyan-700 to-blue-800',
    rule:'١) احسب بُعد كل رقم عن 1000 (1000 − الرقم)',
    rule2:'٢) اضرب البُعدين → الجزء الأيمن (3 منازل) | ٣) 1000 − مجموع البُعدين → الجزء الأيسر',
    examples:[
      { q:'988 × 997', a:'985036', steps:'بُعد 988 = 12، بُعد 997 = 3 | الجزء الأيمن: 12 × 3 = 036 | مجموع البُعدين: 12 + 3 = 15 | الجزء الأيسر: 1000 − 15 = 985 | الناتج: 985 | 036 → 985036' },
      { q:'995 × 990', a:'985050', steps:'بُعد 995 = 5، بُعد 990 = 10 | الجزء الأيمن: 5 × 10 = 050 | مجموع البُعدين: 5 + 10 = 15 | الجزء الأيسر: 1000 − 15 = 985 | الناتج: 985 | 050 → 985050' },
      { q:'985 × 992', a:'977120', steps:'بُعد 985 = 15، بُعد 992 = 8 | الجزء الأيمن: 15 × 8 = 120 | مجموع البُعدين: 15 + 8 = 23 | الجزء الأيسر: 1000 − 23 = 977 | الناتج: 977 | 120 → 977120' },
    ]},
  { id:18, title:'الأعداد فوق 1000', icon:'⏫', color:'from-green-600 to-emerald-700',
    rule:'١) احسب آحاد الرقمين (الرقم − 1000)',
    rule2:'٢) اضرب الآحادين → الجزء الأيمن (3 منازل) | ٣) اجمع الآحادين + 1000 → الجزء الأيسر',
    examples:[
      { q:'1012 × 1013', a:'1025156', steps:'آحاد: 12 و 13 | الجزء الأيمن: 12 × 13 = 156 | الجزء الأيسر: 12 + 13 + 1000 = 1025 | الناتج: 1025 | 156 → 1025156' },
      { q:'1005 × 1004', a:'1009020', steps:'آحاد: 5 و 4 | الجزء الأيمن: 5 × 4 = 020 | الجزء الأيسر: 5 + 4 + 1000 = 1009 | الناتج: 1009 | 020 → 1009020' },
      { q:'1011 × 1004', a:'1015044', steps:'آحاد: 11 و 4 | الجزء الأيمن: 11 × 4 = 044 | الجزء الأيسر: 11 + 4 + 1000 = 1015 | الناتج: 1015 | 044 → 1015044' },
    ]},
  { id:19, title:'الأعداد القريبة من 50', icon:'🎯', color:'from-orange-600 to-red-700',
    rule:'١) احسب بُعد كل رقم عن 50 (الرقم − 50)',
    rule2:'٢) الجزء الأول: 50 + مجموع البُعدين | ٣) الجزء الثاني: حاصل ضرب البُعدين | ٤) (الجزء الأول × 100) ÷ 2 + الجزء الثاني',
    examples:[
      { q:'62 × 63', a:'3906', steps:'بُعد 62 = 12، بُعد 63 = 13 | الجزء الأول: 50 + (12+13) = 75 | الجزء الثاني: 12 × 13 = 156 | (75 × 100) ÷ 2 = 3750 | 3750 + 156 = 3906' },
      { q:'52 × 53', a:'2756', steps:'بُعد 52 = 2، بُعد 53 = 3 | الجزء الأول: 50 + (2+3) = 55 | الجزء الثاني: 2 × 3 = 6 | (55 × 100) ÷ 2 = 2750 | 2750 + 6 = 2756' },
      { q:'48 × 47', a:'2256', steps:'بُعد 48 = -2، بُعد 47 = -3 | الجزء الأول: 50 + (-2-3) = 45 | الجزء الثاني: (-2) × (-3) = 6 | (45 × 100) ÷ 2 = 2250 | 2250 + 6 = 2256' },
    ]},
  { id:20, title:'الأعداد القريبة من 500', icon:'🎪', color:'from-pink-600 to-rose-700',
    rule:'١) احسب بُعد كل رقم عن 500 (الرقم − 500)',
    rule2:'٢) الجزء الأول: 500 + مجموع البُعدين | ٣) الجزء الثاني: حاصل ضرب البُعدين | ٤) (الجزء الأول × 1000) ÷ 2 + الجزء الثاني',
    examples:[
      { q:'512 × 498', a:'254976', steps:'بُعد 512 = 12، بُعد 498 = -2 | الجزء الأول: 500 + (12-2) = 510 | الجزء الثاني: 12 × (-2) = -24 | (510 × 1000) ÷ 2 = 255000 | 255000 − 24 = 254976' },
      { q:'503 × 508', a:'255524', steps:'بُعد 503 = 3، بُعد 508 = 8 | الجزء الأول: 500 + (3+8) = 511 | الجزء الثاني: 3 × 8 = 24 | (511 × 1000) ÷ 2 = 255500 | 255500 + 24 = 255524' },
      { q:'515 × 505', a:'260075', steps:'بُعد 515 = 15، بُعد 505 = 5 | الجزء الأول: 500 + (15+5) = 520 | الجزء الثاني: 15 × 5 = 75 | (520 × 1000) ÷ 2 = 260000 | 260000 + 75 = 260075' },
    ]},
];

const BEST_SCORES_KEY = 'soroban_secrets_best_scores';
const MAX_ATTEMPTS = 2;

interface Props {
  onBack: () => void;
  onComplete?: (stars: number) => void;
  onXP?: (amount: number) => void;
  playSound?: (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => void;
}

const MagicSecretsScreen: React.FC<Props> = ({ onBack, onComplete, onXP, playSound }) => {
  const [tab, setTab] = useState<'table'|'secrets'>('table');
  const [openSecret, setOpenSecret] = useState<number|null>(null);
  const [doneSecrets, setDoneSecrets] = useState<number[]>([]);
  const [bestScores, setBestScores] = useState<Record<number,number>>({});
  const [practiceSecretId, setPracticeSecretId] = useState<number|null>(null);

  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  useEffect(() => {
    try { const raw = localStorage.getItem(BEST_SCORES_KEY); if (raw) setBestScores(JSON.parse(raw)); } catch {}
  }, []);

  useEffect(() => {
    return () => { stop(); };
  }, [tab, openSecret, practiceSecretId, stop]);

  const saveBestScore = (secretId: number, score: number) => {
    const current = bestScores[secretId] || 0;
    if (score > current) {
      const updated = { ...bestScores, [secretId]: score };
      setBestScores(updated);
      try { localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(updated)); } catch {}
    }
  };

  const handleLearnSecret = (id: number) => {
    if (!doneSecrets.includes(id)) {
      const next = [...doneSecrets, id];
      setDoneSecrets(next);
      if (next.length === SECRETS.length && onComplete) onComplete(3);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 text-white p-4 pb-32" dir="rtl">
      <div className="flex items-center justify-between mb-4 gap-2">
        <button onClick={() => { stop(); onBack(); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0">
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-sm sm:text-lg font-bold bg-gradient-to-r from-amber-300 to-purple-400 bg-clip-text text-transparent">
          الأسرار السحرية
        </h1>
        <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-l from-pink-500/15 to-purple-500/15 border border-pink-400/30 rounded-2xl p-4 mb-4"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📖</span>
            <span className="text-xs font-bold text-pink-300">القصة:</span>
          </div>
          {isSupported && (
            <button
              onClick={() => {
                if (isSpeaking) { stop(); }
                else { speak(LESSON_STORY); }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isSpeaking
                  ? 'bg-red-500/30 border border-red-400/50 text-red-200'
                  : 'bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30'
              }`}
            >
              {isSpeaking ? (
                <><Square className="w-3.5 h-3.5" /> إيقاف</>
              ) : (
                <><Volume2 className="w-3.5 h-3.5" /> اسمع قصتي</>
              )}
            </button>
          )}
        </div>
        <p className="text-sm text-pink-100 font-body leading-relaxed">
          {LESSON_STORY}
        </p>
      </motion.div>

      <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-2xl">
        <button onClick={()=>{stop(); setTab('table');}} className={`flex-1 py-3 rounded-xl font-bold transition text-sm ${tab==='table'?'bg-purple-600 shadow-lg':'text-white/60'}`}>
          <Grid3X3 className="w-4 h-4 inline ml-1" /> الجدول المختصر
        </button>
        <button onClick={()=>{stop(); setTab('secrets');}} className={`flex-1 py-3 rounded-xl font-bold transition text-sm ${tab==='secrets'?'bg-purple-600 shadow-lg':'text-white/60'}`}>
          <Sparkles className="w-4 h-4 inline ml-1" /> الأسرار
        </button>
      </div>

      {tab==='table' && (
        <div className="space-y-4">
          <p className="text-center text-white/70 text-sm mb-2">الجدول بدون تكرار — تعلّم نصف الجدول فقط! 🎉</p>
          {[1,2,3,4,5,6,7,8,9].map(col => (
            <motion.div key={col} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:col*0.05}}
              className="bg-gradient-to-l from-emerald-900/40 to-slate-800/60 rounded-2xl p-4 border border-emerald-500/20">
              <h3 className="font-bold text-emerald-300 mb-3">
                <span className="bg-emerald-500 text-black rounded-lg px-3 py-1 text-sm">الضرب في {col}</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {SHORT_TABLE[col].map(({a,b,r}) => (
                  <div key={`${a}-${b}`} className="bg-slate-900/60 rounded-xl px-3 py-2 text-center border border-white/5">
                    <span className="text-white/80">{a} × {b} = </span><span className="text-amber-300 font-bold">{r}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab==='secrets' && (
        <div className="space-y-4">
          {SECRETS.map(s => {
            const best = bestScores[s.id] || 0;
            return (
              <motion.button key={s.id} onClick={()=>setOpenSecret(s.id)} whileTap={{scale:0.97}}
                className={`w-full p-4 rounded-2xl bg-gradient-to-l ${s.color} text-right shadow-lg flex items-center gap-3`}>
                <span className="text-3xl">{s.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-xs opacity-90">{s.rule}</p>
                  {best>0 && <p className="text-[10px] mt-1 opacity-90">🏆 أفضل نتيجة: {best}/{QUESTIONS_PER_EXAM}</p>}
                </div>
                {doneSecrets.includes(s.id) ? <Check className="w-6 h-6 text-white" /> : <Lock className="w-5 h-5 opacity-70" />}
              </motion.button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {openSecret !== null && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={()=>{stop(); setOpenSecret(null);}}>
            <motion.div initial={{scale:0.8,y:50}} animate={{scale:1,y:0}} exit={{scale:0.8,y:50}}
              onClick={e=>e.stopPropagation()}
              className="bg-slate-900 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-white/10">
              {(() => {
                const s = SECRETS.find(x => x.id === openSecret)!;
                const best = bestScores[s.id] || 0;
                return (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div><span className="text-4xl">{s.icon}</span><h2 className="text-2xl font-bold mt-2">{s.title}</h2></div>
                      <button onClick={()=>{stop(); setOpenSecret(null);}} className="p-2 rounded-full bg-white/10"><X className="w-5 h-5" /></button>
                    </div>
                    <div className={`rounded-2xl p-4 bg-gradient-to-l ${s.color} mb-4`}>
                      <p className="font-bold mb-1">🔑 القاعدة:</p>
                      <p className="text-sm mb-1">{s.rule}</p>
                      <p className="text-sm">{s.rule2}</p>
                    </div>
                    <h3 className="font-bold mb-3 text-amber-300">أمثلة محلولة:</h3>
                    <div className="space-y-3">
                      {s.examples.map((ex, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-3">
                          <div className="flex justify-between mb-1"><span className="font-bold text-lg">{ex.q} = {ex.a}</span></div>
                          <p className="text-xs text-white/60">{ex.steps}</p>
                        </div>
                      ))}
                    </div>
                    {s.note && <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-sm">⚠️ {s.note}</div>}
                    <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-center flex items-center justify-center gap-2">
                      <Timer className="w-4 h-4 text-amber-300" />
                      <span className="text-white/70">{QUESTIONS_PER_EXAM} أسئلة — {getTimeForSecret(s.id)} ثوان لكل سؤال</span>
                    </div>
                    {best>0 && <div className="mt-3 p-3 bg-gold-400/10 border border-gold-400/30 rounded-xl text-sm text-center">🏆 أفضل نتيجة لك: {best}/{QUESTIONS_PER_EXAM}</div>}
                    <div className="mt-6 flex gap-2">
                      <button onClick={()=>{handleLearnSecret(s.id); stop(); setOpenSecret(null); setPracticeSecretId(s.id);}}
                        className="flex-1 py-3 bg-gradient-to-l from-emerald-500 to-teal-600 rounded-2xl font-bold flex items-center justify-center gap-2">
                        <Timer className="w-5 h-5" /> تمرّن
                      </button>
                      <button onClick={()=>{handleLearnSecret(s.id); stop(); setOpenSecret(null);}}
                        className="flex-1 py-3 bg-gradient-to-l from-purple-600 to-amber-500 rounded-2xl font-bold flex items-center justify-center gap-2">
                        <Star className="w-5 h-5" /> فهمت
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {practiceSecretId !== null && (
          <PracticeModal secretId={practiceSecretId} onClose={()=>setPracticeSecretId(null)}
            onFinish={score => { saveBestScore(practiceSecretId, score); if (onXP && score>0) onXP(score*2); }} />
        )}
      </AnimatePresence>

      <FloatingCompanion playSound={playSound ?? (() => {})} />
    </div>
  );
};

interface PracticeModalProps { secretId: number; onClose: () => void; onFinish: (score: number) => void; }

const PracticeModal: React.FC<PracticeModalProps> = ({ secretId, onClose, onFinish }) => {
  const secret = SECRETS.find(s => s.id === secretId)!;
  const timePerQuestion = getTimeForSecret(secretId);
  const [questions] = useState<Question[]>(() => generateQuestions(secretId));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<'ok'|'no'|'timeout'|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentQ = questions[idx];
  const total = questions.length;

  useEffect(() => {
    if (finished || feedback === 'ok' || !currentQ) return;
    if (timeLeft <= 0) { setFeedback('timeout'); setTimeout(() => advance(), 1200); return; }
    const t = setTimeout(() => setTimeLeft(x => x-1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished, feedback, currentQ]);

  useEffect(() => { if (inputRef.current && !finished) inputRef.current.focus(); }, [idx, finished]);

  const advance = () => {
    if (idx+1 >= questions.length) { setFinished(true); setTimeout(() => onFinish(score), 100); }
    else { setIdx(idx+1); setInput(''); setAttempts(0); setTimeLeft(timePerQuestion); setFeedback(null); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) return;
    setInput(val);
    if (val === '' || !currentQ) return;
    const num = Number(val);
    if (num === currentQ.a) { setFeedback('ok'); setScore(s => s+1); setTimeout(() => advance(), 800); }
    else if (val.length >= String(currentQ.a).length) {
      const n = attempts + 1; setAttempts(n);
      if (n >= MAX_ATTEMPTS) { setFeedback('no'); setTimeout(() => advance(), 1000); }
      else { setFeedback('no'); setTimeout(() => { setInput(''); setFeedback(null); }, 500); }
    }
  };

  if (!currentQ) return null;
  const progressPct = ((idx+1)/total)*100;

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{scale:0.9,y:30}} animate={{scale:1,y:0}} className="bg-slate-900 rounded-3xl p-5 max-w-md w-full border border-white/10">
        {!finished ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2"><span className="text-2xl">{secret.icon}</span><span className="text-sm font-bold">{secret.title}</span></div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/10"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-purple-500 to-amber-500" initial={{width:0}} animate={{width:`${progressPct}%`}} />
              </div>
              <span className="text-xs text-white/60">{idx+1}/{total}</span>
            </div>
            <div className={`mb-4 p-2 rounded-xl text-center flex items-center justify-center gap-2 ${timeLeft <= 3 ? 'bg-red-500/20 border border-red-500/50' : 'bg-white/5 border border-white/10'}`}>
              <Timer className={`w-4 h-4 ${timeLeft <= 3 ? 'text-red-400' : 'text-amber-300'}`} />
              <span className={`font-bold ${timeLeft <= 3 ? 'text-red-300' : 'text-white'}`}>{timeLeft} ثانية</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 text-center mb-4">
              <p className="text-xs text-white/50 mb-3">السؤال {idx+1}</p>
              <p className="text-4xl font-black" dir="ltr">{currentQ.q} = <span className="text-amber-300">؟</span></p>
            </div>
            <input ref={inputRef} type="text" inputMode="numeric" value={input} onChange={handleChange}
              disabled={feedback === 'ok' || feedback === 'timeout'}
              className={`w-full bg-slate-800 border-2 rounded-2xl px-4 py-3 text-center text-2xl font-bold outline-none transition ${
                feedback === 'ok' ? 'border-emerald-500 text-emerald-300'
                : feedback === 'no' ? 'border-red-500'
                : feedback === 'timeout' ? 'border-red-500 text-red-300'
                : 'border-purple-500/50 focus:border-amber-400 text-white'}`}
              placeholder="اكتب الإجابة" dir="ltr" />
            <div className="mt-3 h-6 text-center">
              {feedback === 'ok' && <p className="text-emerald-400 font-bold text-sm">✅ إجابة صحيحة!</p>}
              {feedback === 'no' && attempts === 1 && <p className="text-amber-400 font-bold text-sm">⚠️ حاول مرة أخرى!</p>}
              {feedback === 'no' && attempts >= MAX_ATTEMPTS && <p className="text-red-400 font-bold text-sm">❌ الإجابة: {currentQ.a}</p>}
              {feedback === 'timeout' && <p className="text-red-400 font-bold text-sm">⏱️ انتهى الوقت! الإجابة: {currentQ.a}</p>}
            </div>
            <p className="text-center text-xs text-white/50 mt-4">النقاط: {score}/{total}</p>
          </>
        ) : (
          <div className="text-center py-6">
            <Trophy className="w-16 h-16 text-gold-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">انتهى التمرين!</h2>
            <p className="text-5xl font-black text-amber-300 mb-4">{score}/{total}</p>
            <p className="text-sm text-white/60 mb-6">
              {score === total ? '🏆 ممتاز! أنت بطل!' : score >= total*0.6 ? '👏 جيد جداً! استمر!' : '💪 حاول مرة أخرى!'}
            </p>
            <button onClick={onClose} className="w-full py-3 bg-gradient-to-l from-purple-600 to-amber-500 rounded-2xl font-bold">إغلاق</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MagicSecretsScreen;
