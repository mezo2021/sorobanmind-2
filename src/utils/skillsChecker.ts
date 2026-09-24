// src/utils/skillsChecker.ts — حساب المهارات الأربع للطفل

const ANZAN_KEY = 'soroban_anzan_stats';
const PRACTICE_KEY = 'soroban_practice_stats';
const AUDIO_ANZAN_KEY = 'soroban_anzan_audio_badges';

interface AnzanStats {
  highScore: number;
  totalRounds: number;
  totalCorrect: number;
}

interface PracticeStats {
  totalProblems: number;
  correctAnswers: number;
  additionProblems: number;
  subtractionProblems: number;
  multiplicationProblems: number;
  divisionProblems: number;
}

interface AudioAnzanBadges {
  master_addition_audio?: boolean;
  master_multiplication_audio?: boolean;
  master_division_audio?: boolean;
}

function loadAnzanStats(): AnzanStats {
  try {
    const raw = localStorage.getItem(ANZAN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        highScore: typeof parsed.highScore === 'number' ? parsed.highScore : 0,
        totalRounds: typeof parsed.totalRounds === 'number' ? parsed.totalRounds : 0,
        totalCorrect: typeof parsed.totalCorrect === 'number' ? parsed.totalCorrect : 0,
      };
    }
  } catch { /* ignore */ }
  return { highScore: 0, totalRounds: 0, totalCorrect: 0 };
}

function loadPracticeStats(): PracticeStats {
  try {
    const raw = localStorage.getItem(PRACTICE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        totalProblems: typeof parsed.totalProblems === 'number' ? parsed.totalProblems : 0,
        correctAnswers: typeof parsed.correctAnswers === 'number' ? parsed.correctAnswers : 0,
        additionProblems: typeof parsed.additionProblems === 'number' ? parsed.additionProblems : 0,
        subtractionProblems: typeof parsed.subtractionProblems === 'number' ? parsed.subtractionProblems : 0,
        multiplicationProblems: typeof parsed.multiplicationProblems === 'number' ? parsed.multiplicationProblems : 0,
        divisionProblems: typeof parsed.divisionProblems === 'number' ? parsed.divisionProblems : 0,
      };
    }
  } catch { /* ignore */ }
  return {
    totalProblems: 0,
    correctAnswers: 0,
    additionProblems: 0,
    subtractionProblems: 0,
    multiplicationProblems: 0,
    divisionProblems: 0,
  };
}

function loadAudioAnzanBadges(): AudioAnzanBadges {
  try {
    const raw = localStorage.getItem(AUDIO_ANZAN_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export interface SkillResult {
  id: string;
  nameAr: string;
  descriptionAr: string;
  percentage: number;
  available: boolean;
  note?: string;
}

export function calculateSkills(): SkillResult[] {
  const anzan = loadAnzanStats();
  const practice = loadPracticeStats();
  const audioBadges = loadAudioAnzanBadges();

  const concentrationRaw = Math.min(100, (anzan.totalRounds / 50) * 100);

  const visualizationRaw = anzan.totalRounds > 0
    ? Math.min(100, (anzan.totalCorrect / anzan.totalRounds) * 100)
    : 0;

  const observationRaw = practice.totalProblems > 0
    ? Math.min(100, (practice.correctAnswers / practice.totalProblems) * 100)
    : 0;

  const audioBadgesEarned = [
    audioBadges.master_addition_audio,
    audioBadges.master_multiplication_audio,
    audioBadges.master_division_audio,
  ].filter(Boolean).length;
  const listeningRaw = Math.min(100, (audioBadgesEarned / 3) * 100);

  return [
    {
      id: 'concentration',
      nameAr: 'التركيز والانتباه',
      descriptionAr: 'قدرة الطفل على البقاء مركّزاً خلال الجلسات',
      percentage: Math.round(concentrationRaw),
      available: true,
    },
    {
      id: 'visualization',
      nameAr: 'التخيل والتصور',
      descriptionAr: 'قدرة الطفل على تخيل المعداد في عقله (الأنزان)',
      percentage: Math.round(visualizationRaw),
      available: true,
    },
    {
      id: 'observation',
      nameAr: 'دقة الملاحظة',
      descriptionAr: 'قدرة الطفل على حل المسائل من المحاولة الأولى',
      percentage: Math.round(observationRaw),
      available: true,
    },
    {
      id: 'listening',
      nameAr: 'الاستماع والانتباه السمعي',
      descriptionAr: 'قدرة الطفل على الحساب من خلال السماع',
      percentage: Math.round(listeningRaw),
      available: true,
    },
  ];
}