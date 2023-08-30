import { FieldValue } from 'firebase-admin/firestore';
import firestore from '../services/firestore.js';
const collection = firestore.collection('codle');
const dailyWordRef = collection.doc('dailyWord');
const nextDailyWordRef = collection.doc('nextDailyWord');
const wordListRef = collection.doc('wordList');
const fullListRef = collection.doc('fullWordList');
const getDailyWord = async (timezoneOffset = 240) => {
    const currentDate = new Date(new Date().toUTCString());
    try {
        const dailyWordDoc = await dailyWordRef.get();
        const wordData = dailyWordDoc.data();
        const { word: dailyWord, updatedAt: updateTime } = wordData;
        const updatedAt = new Date(updateTime);
        const clientDate = new Date(currentDate.toUTCString());
        clientDate.setUTCHours(clientDate.getUTCHours() - timezoneOffset / 60);
        const isWordOfDay = updatedAt.getUTCFullYear() === clientDate.getUTCFullYear() &&
            updatedAt.getUTCMonth() === clientDate.getUTCMonth() &&
            updatedAt.getUTCDate() === clientDate.getUTCDate();
        if (isWordOfDay) {
            return dailyWord;
        }
        const resetDate = new Date();
        resetDate.setHours(resetDate.getHours() - 11);
        resetDate.setMinutes(resetDate.getMinutes() - 59);
        console.log({
            clientTimestamp: clientDate,
            wordTimestamp: updatedAt,
            currentTimestamp: currentDate,
            resetDate: resetDate
        });
        console.log({
            clientHours: clientDate.getUTCHours(),
            wordHours: updatedAt.getUTCHours(),
            currentHours: currentDate.getUTCHours(),
            resetDateHours: resetDate.getUTCHours()
        });
        const shouldUpdateWords = updatedAt.getFullYear() < resetDate.getFullYear() ||
            updatedAt.getMonth() < resetDate.getMonth() ||
            updatedAt.getDate() < resetDate.getDate();
        if (shouldUpdateWords) {
            const nextWordDoc = await nextDailyWordRef.get();
            const wordListDoc = await wordListRef.get();
            const nextWordData = nextWordDoc.data();
            const wordList = wordListDoc.data();
            const { word } = nextWordData;
            await dailyWordRef.set({
                word,
                updatedAt: currentDate.toUTCString()
            });
            await nextDailyWordRef.set({
                word: getNewDailyWord(wordList, currentDate.getDay()),
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
export const getList = async () => {
    const wordListSnap = await fullListRef.get();
    if (!wordListSnap.exists)
        return;
    const { list } = wordListSnap.data();
    return list;
};
export const addWord = async (word) => {
    const list = await getList();
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
const getNewDailyWord = (wordList, currentDay) => {
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
export const testingSetup = async () => {
    // await 
};
export const testingTeardown = async () => {
};
export default getDailyWord;
