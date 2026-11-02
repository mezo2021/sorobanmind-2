// src/components/games/MentalArchivesGame/gameFlowTypes.ts
import { GameQuestion, SolvedExample } from './gameTypes'; // نستخدم الأنواع القديمة للأسئلة

export type ChapterId = 'intro' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6' | 'level7' | 'level8';

export type CharacterId = 'jud' | 'aseel' | 'sorobana';

export type Line = {
  character: CharacterId;
  textAr: string;
  textEn: string;
};

export type Scene =
  | { kind: 'dialogue'; id: string; lines: Line[] }
  | { kind: 'example'; id: string; example: SolvedExample }
  | { kind: 'challenge'; id: string; questions: GameQuestion[]; timePerQuestionMs: number; requiredCorrect: number };

export type Chapter = {
  id: ChapterId;
  titleAr: string;
  titleEn: string;
  requires: ChapterId[];      // الفصول التي يجب إكمالها لفتح هذا الفصل
  next?: ChapterId;           // الفصل التالي
  scenes: Scene[];            // مشاهد هذا الفصل
};