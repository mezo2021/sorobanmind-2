// src/components/games/MentalArchivesGame/gameTypes.ts

export type CharacterId = 'jud' | 'aseel' | 'sorobana';

export interface StoryLine {
  character: CharacterId;
  textAr: string;
  textEn: string;
}

export interface SolvedExample {
  titleAr: string;
  titleEn: string;
  problem: string;
  steps: {
    textAr: string;
    textEn: string;
  }[];
}

// أنواع الأسئلة التي تغطي كل مستويات السوروبان (نيشورين)
export type GameQuestion =
  | { type: 'direct'; numbers: number[]; answer: number }
  | { type: 'complement5'; numbers: number[]; answer: number }
  | { type: 'complement10'; numbers: number[]; answer: number }
  | { type: 'mitori'; numbers: number[]; answer: number }
  | { type: 'multiplication'; numbers: number[]; answer: number }
  | { type: 'division'; numbers: number[]; answer: number }
  | { type: 'subtraction'; numbers: number[]; answer: number };

export interface LevelData {
  id: string;
  levelNumber: number;
  titleAr: string;
  titleEn: string;
  story: StoryLine[];
  example: SolvedExample;
  questions: GameQuestion[];
  timePerQuestionMs: number;
  requiredCorrect: number;
}