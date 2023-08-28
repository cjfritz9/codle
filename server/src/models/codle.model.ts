import { FieldValue, Timestamp } from 'firebase-admin/firestore';

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

const getDailyWord = async (timezoneOffset = 240) => {
  const unixEpochSeconds = Math.round(Date.now() / 1000);
  const unixEpochNanoseconds = Math.round(Date.now() / 1000000);

  const dailyWordDoc = await dailyWordRef.get();
  if (!dailyWordDoc.exists) return;

  const wordData = dailyWordDoc.data() as DailyWordDocument;
  if (!wordData) return;

  const { dailyWord, updatedAt } = wordData;
  if (!dailyWord || !updatedAt) return;

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - timezoneOffset / 60);
  const clientDay = currentDate.getDay();

  const isWordOfDay =
    updatedAt.toDate().getFullYear() === currentDate.getFullYear() &&
    updatedAt.toDate().getMonth() === currentDate.getMonth() &&
    updatedAt.toDate().getDate() === currentDate.getDate();

  if (isWordOfDay) {
    return dailyWord;
  } else {
    const wordList = (await wordListRef.get()).data() as WordListDocument;

    const newWord = getNewDailyWord(wordList, clientDay);
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

export const getList = async () => {
  const wordListSnap = await fullListRef.get();

  if (!wordListSnap.exists) return;

  const { list } = wordListSnap.data() as FullWordListDocument;

  return list;
};

export const addWord = async (word: string) => {
  const list = await getList();

  if (!list) return;

  if (list.includes(word)) {
    return {
      error: `List already contains ${word}`,
      cause: { wordIndex: list.indexOf(word) }
    };
  }

  await fullListRef.update({
    list: FieldValue.arrayUnion(word)
  });

  return {
    success: 'Word added to word list'
  };
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
    success: 'Word list is valid'
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

export const getDate = ({ tomorrow = false }) => {
  const date = new Date();
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  if (tomorrow) {
    return new Date(date.setDate(date.getDate() + 1));
  }
  return date;
};

export default getDailyWord;
