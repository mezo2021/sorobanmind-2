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
  // 🆕 إضافة حقول النصيحة
  tipAr?: string;
  tipEn?: string;
  // 👇 هذه الحقول ضرورية لكي يعمل level1Data.ts
  ruleTitleAr?: string;
  ruleDescAr?: string;
  ruleTitleEn?: string;
  ruleDescEn?: string;
  steps: { textAr: string; textEn: string; }[];
}

export type GameQuestion =
  | { type: 'direct'; numbers: number[]; answer: number; tipAr?: string; tipEn?: string; }
  | { type: 'complement5'; numbers: number[]; answer: number; tipAr?: string; tipEn?: string; }
  | { type: 'complement10'; numbers: number[]; answer: number; tipAr?: string; tipEn?: string; }
  | { type: 'combined'; numbers: number[]; answer: number; tipAr?: string; tipEn?: string; }
  | { type: 'mitori'; numbers: number[]; answer: number; tipAr?: string; tipEn?: string; }
  | { type: 'multiplication'; numbers: number[]; answer: number; tipAr?: string; tipEn?: string; }
  | { type: 'division'; numbers: number[]; answer: number; tipAr?: string; tipEn?: string; }
  | { type: 'subtraction'; numbers: number[]; answer: number; tipAr?: string; tipEn?: string; };

export type Scene =
  | { kind: 'dialogue'; id: string; lines: Line[] }
  | { kind: 'example'; id: string; examples: SolvedExample[]; ruleAr?: string; ruleEn?: string }
  | { kind: 'challenge'; id: string; questions: GameQuestion[]; timePerQuestionMs: number; requiredCorrect: number };

export type Chapter = {
  id: ChapterId;
  titleAr: string;
  titleEn: string;
  requires: ChapterId[];      
  next?: ChapterId;           
  scenes: Scene[];            
};