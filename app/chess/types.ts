export enum GameMode {
  PvP = 'PvP',
  PvAI = 'PvAI',
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface MoveHistoryItem {
  white: string;
  black?: string;
  number: number;
}

export interface GameStats {
  status: 'active' | 'checkmate' | 'draw' | 'stalemate' | 'check';
  turn: 'w' | 'b';
  winner?: 'w' | 'b';
}