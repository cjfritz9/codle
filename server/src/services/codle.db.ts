import { DailyWordDocument, WordListDocument } from '../@types/firebase.js';
import { getWordsObject } from '../models/codle.model.js';
import firestore from './firestore.js';
import { Timestamp } from 'firebase-admin/firestore';

const collection = firestore.collection('codle');

const getDailyWord = async () => {
  const unixEpochSeconds = Math.round(Date.now() / 1000);
  const unixEpochNanoseconds = Math.round(Date.now() / 1000000);

  const dailyWordDoc = await collection.doc('dailyWord').get();

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
      dailyWordList[Math.floor(Math.random() * dailyWordList.length - 1)];

    console.log('')
    return {
      dbDay: databaseDay,
      day: currentDay,
      dailyWords: dailyWordList,
      newWord,
      wordList: orderedWordList
    };
  }
};

export const seedDatabase = async () => {
  const wordsData = getWordsObject();

  const weekdays = collection.doc('wordList');

  await weekdays.set(wordsData, { merge: true });
};

export default getDailyWord;
