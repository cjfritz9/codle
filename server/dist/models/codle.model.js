import { FieldValue } from 'firebase-admin/firestore';
import firestore from '../services/firestore.js';
const collection = firestore.collection('codle');
const dailyWordRef = collection.doc('dailyWord');
const nextDailyWordRef = collection.doc('nextDailyWord');
const wordListRef = collection.doc('wordList');
const fullListRef = collection.doc('fullWordList');
const currentDate = new Date(new Date().toUTCString());
const getDailyWord = async (timezoneOffset = 240) => {
    const offsetHours = timezoneOffset / 60;
    try {
        const dailyWordDoc = await dailyWordRef.get();
        const wordData = dailyWordDoc.data();
        const { word: dailyWord, updatedAt: updateTime } = wordData;
        const updatedAt = new Date(updateTime);
        const clientDate = new Date(currentDate.toUTCString());
        clientDate.setUTCHours(clientDate.getUTCHours() - offsetHours);
        const isWordOfDay = updatedAt.getUTCFullYear() === clientDate.getUTCFullYear() &&
            updatedAt.getUTCMonth() === clientDate.getUTCMonth() &&
            updatedAt.getUTCDate() === clientDate.getUTCDate();
        const resetDate = new Date(clientDate);
        resetDate.setHours(resetDate.getHours() - 11);
        resetDate.setMinutes(resetDate.getMinutes() - 59);
        if (isWordOfDay) {
            return dailyWord;
        }
        const shouldUpdateWords = updatedAt.getUTCFullYear() < resetDate.getUTCFullYear() ||
            updatedAt.getUTCMonth() < resetDate.getUTCMonth() ||
            updatedAt.getUTCDate() < resetDate.getUTCDate();
        if (shouldUpdateWords) {
            const nextWordDoc = await nextDailyWordRef.get();
            const nextWordData = nextWordDoc.data();
            const { word } = nextWordData;
            const nextWord = await getNewDailyWord(currentDate.getDay());
            await dailyWordRef.set({
                word,
                updatedAt: currentDate.toUTCString()
            });
            await nextDailyWordRef.set({
                word: nextWord,
                updatedAt: currentDate.toUTCString()
            });
            return word;
        }
        const nextWordDoc = await nextDailyWordRef.get();
        const nextWordData = nextWordDoc.data();
        const { word } = nextWordData;
        return word;
    }
    catch (error) {
        console.error(error);
        return 'react';
    }
};
export const getFullWordList = async () => {
    const wordListSnap = await fullListRef.get();
    if (!wordListSnap.exists)
        return;
    const { list } = wordListSnap.data();
    return list;
};
export const getWordList = async () => {
    const wordListSnap = await wordListRef.get();
    if (!wordListSnap.exists)
        return;
    return wordListSnap.data();
};
export const addWord = async (word) => {
    const list = await getFullWordList();
    if (!list)
        return;
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
export const isListValid = (list) => {
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
const hasDuplicates = (list) => {
    if ([...new Set(list)].length !== list.length) {
        return true;
    }
    else {
        return false;
    }
};
export const getDuplicates = (list) => {
    return list.filter((word, i) => list.indexOf(word) !== i);
};
export const removeDuplicates = (list) => {
    return list.filter((word, i) => list.indexOf(word) === i);
};
const getNewDailyWord = async (currentDay, useToday = false) => {
    const wordList = (await getWordList());
    const orderedWordList = [
        wordList.monday,
        wordList.tuesday,
        wordList.wednesday,
        wordList.thursday,
        wordList.friday,
        wordList.saturday,
        wordList.sunday
    ];
    currentDay--;
    const nextDay = currentDay < 6 ? currentDay + 1 : 0;
    const dailyWordList = Object.values(orderedWordList)[useToday ? currentDay : nextDay];
    const newWord = dailyWordList[Math.floor(Math.random() * dailyWordList.length)];
    return newWord;
};
export const getWordsObject = async () => {
    const wordListDoc = await wordListRef.get();
    if (!wordListDoc.exists)
        return;
    const wordList = wordListDoc.data();
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
// BACK-DOOR FUNCTIONS FOR JEST TESTS
const testingSetup = async () => {
    const dailyWordRef = collection.doc('dailyWord');
    const nextDailyWordRef = collection.doc('nextDailyWord');
    await dailyWordRef.set({
        word: 'test1',
        updatedAt: currentDate.toUTCString()
    });
    await nextDailyWordRef.set({
        word: 'test2',
        updatedAt: currentDate.toUTCString()
    });
};
const testingTeardown = async () => {
    const dailyWordRef = collection.doc('dailyWord');
    const nextDailyWordRef = collection.doc('nextDailyWord');
    await dailyWordRef.set({
        word: await getNewDailyWord(currentDate.getUTCDay(), true),
        updatedAt: currentDate.toUTCString()
    });
    await nextDailyWordRef.set({
        word: await getNewDailyWord(currentDate.getUTCDay()),
        updatedAt: currentDate.toUTCString()
    });
};
const testingGetDailyWord = async () => {
    const dailyWordDoc = await dailyWordRef.get();
    const wordData = dailyWordDoc.data();
    const { word, updatedAt } = wordData;
    return { word, updatedAt };
};
const testingGetNextDailyWord = async () => {
    const nextDailyWordDoc = await nextDailyWordRef.get();
    const wordData = nextDailyWordDoc.data();
    const { word, updatedAt } = wordData;
    return { word, updatedAt };
};
const testingUpdateDailyWords = async () => {
    const dummyTimestamp = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, currentDate.getUTCDate() - 2);
    const { word } = await testingGetDailyWord();
    const { word: nextWord } = await testingGetNextDailyWord();
    await dailyWordRef.set({
        word,
        updatedAt: dummyTimestamp.toUTCString()
    });
    await nextDailyWordRef.set({
        word: nextWord,
        updatedAt: dummyTimestamp.toUTCString()
    });
};
export const JEST_BACKDOOR = {
    setup: testingSetup,
    teardown: testingTeardown,
    getDailyWord: testingGetDailyWord,
    getNextDailyWord: testingGetNextDailyWord,
    updateDailyWords: testingUpdateDailyWords
};
export default getDailyWord;
