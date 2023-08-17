import { DocumentData, Timestamp } from 'firebase-admin/firestore';

export interface DailyWordDocument {
  dailyWord: string;
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
