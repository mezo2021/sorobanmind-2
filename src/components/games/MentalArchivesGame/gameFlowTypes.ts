// src/components/games/MentalArchivesGame/gameFlowTypes.ts

export type ChapterId = 'intro' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6' | 'level7' | 'level8';

export type CharacterId = 'jud' | 'aseel' | 'sorobana';

export type Line = {
  character: CharacterId;
  textAr: string;
  textEn: string;
};

export interface SolvedExample {
  titleAr: string;
  titleEn: string;
  problem: string;
  steps: { textAr: string; textEn: string; }[];
}

export type GameQuestion =
  | { type: 'direct'; numbers: number[]; answer: number }
  | { type: 'complement5'; numbers: number[]; answer: number }
  | { type: 'complement10'; numbers: number[]; answer: number }
  | { type: 'mitori'; numbers: number[]; answer: number }
  | { type: 'multiplication'; numbers: number[]; answer: number }
  | { type: 'division'; numbers: number[]; answer: number }
  | { type: 'subtraction'; numbers: number[]; answer: number };

export type Scene =
  | { kind: 'dialogue'; id: string; lines: Line[] }
  // 👇 التعديل هنا: examples مصفوفة بدلاً من example مفرد
  | { kind: 'example'; id: string; examples: SolvedExample[] }
  | { kind: 'challenge'; id: string; questions: GameQuestion[]; timePerQuestionMs: number; requiredCorrect: number };

export type Chapter = {
  id: ChapterId;
  titleAr: string;
  titleEn: string;
  requires: ChapterId[];      
  next?: ChapterId;           
  scenes: Scene[];            
};