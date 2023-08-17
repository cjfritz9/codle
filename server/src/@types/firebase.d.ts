import { DocumentData, Timestamp } from 'firebase-admin/firestore';

export type DailyWordDocument = {
  dailyWord: string;
  updatedAt: Timestamp;
};

export type WordListDocument = {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
};
