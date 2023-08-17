import { Timestamp } from 'firebase-admin/firestore';

import firestore from '../services/firestore.js';
import {
  DailyWordDocument,
  FullWordListDocument,
  WordListDocument
} from '../@types/firebase.js';

const collection = firestore.collection('codle');
const dailyWordRef = collection.doc('dailyWord');
const wordListRef = collection.doc('wordList');
const fullListRef = collection.doc('fullWordList');

const getDailyWord = async () => {
  const unixEpochSeconds = Math.round(Date.now() / 1000);
  const unixEpochNanoseconds = Math.round(Date.now() / 1000000);

  const dailyWordDoc = await dailyWordRef.get();
  if (!dailyWordDoc.exists) return;

  const wordData = dailyWordDoc.data() as DailyWordDocument;
  if (!wordData) return;

  const { dailyWord, updatedAt } = wordData;
  if (!dailyWord || !updatedAt) return;

  const databaseDay = updatedAt.toDate().getDay();
  const currentDay = new Date().getDay();
  const isWordOfDay = databaseDay === currentDay;

  if (isWordOfDay) {
    return dailyWord;
  } else {
    const wordList = (await wordListRef.get()).data() as WordListDocument;

    const newWord = getNewDailyWord(wordList, currentDay);
    if (!newWord) return;
    
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
  const wordsData = await getWordsObject();

  if (!wordsData) {
    return {
      ok: 'Finished',
      message: 'Getting words document failed'
    };
  }

  const listData = await getList();
  if (!listData) {
    return {
      ok: 'Finished',
      message: 'Getting full list document failed'
    };
  }

  const weekdays = wordListRef;
  await weekdays.set(wordsData, { merge: true });
  await fullListRef.set({ list: listData });

  return {
    ok: 'Finished',
    weekdays: wordsData,
    fullList: listData
  };
};

export const getList = async () => {
  const wordListSnap = await fullListRef.get();

  if (!wordListSnap.exists) return;

  const { list } = wordListSnap.data() as FullWordListDocument;

  return list;
};

export const isListValid = (list: string[]) => {
  const invalidItems = list.filter((word) => word.length !== 5);

  if (hasDuplicates(list)) {
    const duplicates = getDuplicates(list);
    return {
      error: 'List contains duplicate items',
      cause: { duplicates }
    };
  }

  if (invalidItems.length !== 0) {
    return {
      error: 'Invalid word(s) in list',
      cause: { invalidItems }
    };
  }

  return {
    success: 'List validation complete'
  };
};

const hasDuplicates = (list: string[]) => {
  if ([...new Set(list)].length !== list.length) {
    return true;
  } else {
    return false;
  }
};

export const getDuplicates = (list: string[]) => {
  return list.filter((word, i) => list.indexOf(word) !== i);
};

export const removeDuplicates = (list: string[]) => {
  return list.filter((word, i) => list.indexOf(word) === i);
};

const getNewDailyWord = (
  wordList: WordListDocument,
  currentDay: number
): string | undefined => {
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

  return newWord;
};

export const getWordsObject = async () => {
  const wordListDoc = await wordListRef.get();
  if (!wordListDoc.exists) return;
  const wordList = wordListDoc.data() as WordListDocument;
  return wordList;
};

export default getDailyWord;
