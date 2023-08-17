import { DailyWordDocument, WordListDocument } from '../@types/firebase.js';
import { getList, getWordsObject } from '../models/codle.model.js';
import firestore from './firestore.js';
import { Timestamp } from 'firebase-admin/firestore';

const collection = firestore.collection('codle');
const dailyWordRef = collection.doc('dailyWord');

const getDailyWord = async () => {
  const unixEpochSeconds = Math.round(Date.now() / 1000);
  const unixEpochNanoseconds = Math.round(Date.now() / 1000000);

  const dailyWordDoc = await dailyWordRef.get();

  const wordData = dailyWordDoc.data() as DailyWordDocument;
  if (!wordData) return;

  const { dailyWord, updatedAt } = wordData;
  const databaseDay = updatedAt.toDate().getDay();
  const currentDay = new Date().getDay();
  const isWordOfDay = databaseDay === currentDay;

  if (isWordOfDay) {
    return dailyWord;
  } else {
    const wordList = (
      await collection.doc('wordList').get()
    ).data() as WordListDocument;

    if (!wordList) return;

    const orderedWordList = [
      wordList.monday,
      wordList.tuesday,
      wordList.wednesday,
      wordList.thursday,
      wordList.friday,
      wordList.saturday,
      wordList.sunday
    ];

    const dailyWordList = Object.values(orderedWordList)[currentDay];
    const newWord =
      dailyWordList[Math.floor(Math.random() * dailyWordList.length)];

    const timestamp = new Timestamp(unixEpochSeconds, unixEpochNanoseconds);
    const result = await dailyWordRef.set({
      dailyWord: newWord,
      updatedAt: timestamp
    });

    if (result.writeTime.toDate().getDay() === timestamp.toDate().getDay()) {
      return newWord;
    }
    return;
  }
};

export const seedDatabase = async () => {
  const wordsData = getWordsObject();
  const listData = getList();

  const weekdays = collection.doc('wordList');

  const fullList = collection.doc('fullWordList');

  await weekdays.set(wordsData, { merge: true });

  await fullList.set({ list: listData });

  return {
    ok: 'Finished',
    weekdays: wordsData,
    fullList: listData
  }
};

export default getDailyWord;
