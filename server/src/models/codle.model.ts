import { FieldValue, Timestamp } from 'firebase-admin/firestore';

import firestore from '../services/firestore.js';
import {
  DailyWordDocument,
  FullWordListDocument,
  WordListDocument
} from '../@types/firebase.js';

const collection = firestore.collection('codle');
const dailyWordRef = collection.doc('dailyWord');
const nextDailyWordRef = collection.doc('nextDailyWord');
const wordListRef = collection.doc('wordList');
const fullListRef = collection.doc('fullWordList');

const getDailyWord = async(timezoneOffset = 240) => {
  try {
    const unixEpochSeconds = Math.round(Date.now() / 1000);
    const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
    const timestamp = new Timestamp(unixEpochSeconds, unixEpochNanoseconds);

    const dailyWordDoc = await dailyWordRef.get();
    const wordData = dailyWordDoc.data() as DailyWordDocument;
    const { word: dailyWord, updatedAt } = wordData;

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - timezoneOffset / 60);

    const isWordOfDay =
      updatedAt.toDate().getUTCFullYear() === currentDate.getFullYear() &&
      updatedAt.toDate().getUTCMonth() === currentDate.getMonth() &&
      updatedAt.toDate().getUTCDate() === currentDate.getDate();

    console.log('is word of day?', isWordOfDay);
    console.log('doc date', updatedAt.toDate().toISOString());
    console.log('server date', currentDate.toISOString());
    console.log({
      CURR_DATE: currentDate.toISOString(),
      DOC_DATE: updatedAt.toDate().toISOString(),
      YEARS: [updatedAt.toDate().getUTCFullYear(), currentDate.getFullYear()],
      MONTHS: [updatedAt.toDate().getUTCMonth(), currentDate.getMonth()],
      DAYS: [updatedAt.toDate().getUTCDate(), currentDate.getDate()],
      WEEKDAY: [updatedAt.toDate().getUTCDay(), currentDate.getDay()],
      WORD_OF_DAY: isWordOfDay
    });

    if (isWordOfDay) {
      return dailyWord;
    }

    const resetDate = new Date();
    resetDate.setHours(resetDate.getHours() - 11);
    resetDate.setMinutes(resetDate.getMinutes() - 59);

    const shouldUpdateWords =
      updatedAt.toDate().getFullYear() < resetDate.getFullYear() ||
      updatedAt.toDate().getMonth() < resetDate.getMonth() ||
      updatedAt.toDate().getDate() < resetDate.getDate();

    if (shouldUpdateWords) {
      console.log('should update?');
      const nextWordDoc = await nextDailyWordRef.get();
      const wordListDoc = await wordListRef.get();
      const nextWordData = nextWordDoc.data() as DailyWordDocument;
      const wordList = wordListDoc.data() as WordListDocument;
      const { word } = nextWordData;

      dailyWordRef.set({
        word,
        updatedAt: timestamp
      });
      nextDailyWordRef.set({
        word: getNewDailyWord(wordList, currentDate.getDay()),
        updatedAt: timestamp
      });

      return word;
    }

    const nextWordDoc = await nextDailyWordRef.get();
    const nextWordData = nextWordDoc.data() as DailyWordDocument;
    const { word } = nextWordData;
    console.log(word);

    return word;
  } catch (error) {
    console.error(error);
    return 'react';
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
  const nextDay = currentDay < 6 ? currentDay + 1 : 0;

  const dailyWordList = Object.values(orderedWordList)[nextDay];
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
