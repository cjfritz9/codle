import { getWordsObject } from '../models/codle.model.js';
import firestore from './firestore.js';
import { Timestamp } from 'firebase-admin/firestore';

const collection = firestore.collection('codle');

const getDailyWord = () => {
  const unixEpochSeconds = Math.round(Date.now() / 1000);
  const unixEpochNanoseconds = Math.round(Date.now() / 1000000);

  collection.get();
};

export const seedDatabase = async () => {
  const wordsData = getWordsObject();

  const weekdays = collection.doc('wordList');

  await weekdays.set(wordsData, { merge: true });
};
