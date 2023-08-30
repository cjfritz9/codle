import { Timestamp } from 'firebase-admin/firestore';

export interface DailyWordDocument {
  word: string;
  updatedAt: Timestamp;
}

export interface WordListDocument {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface FullWordListDocument {
  list: string[];
}

export interface UserDataDocument {
  updatedAt: Timestamp;
  guesses: string[];
  guessMap: string;
  didWin: boolean;
}

export interface UserDataParams {
  guesses: any[];
  guessMap: string;
  didWin: boolean;
}

export interface UserData {
  id: string;
  updatedAt: Date;
  guesses: string[];
  guessMap: string;
  didWin: boolean;
}
