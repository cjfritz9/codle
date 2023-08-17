var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Timestamp } from 'firebase-admin/firestore';
import firestore from '../services/firestore.js';
const collection = firestore.collection('codle');
const dailyWordRef = collection.doc('dailyWord');
const wordListRef = collection.doc('wordList');
const fullListRef = collection.doc('fullWordList');
const getDailyWord = () => __awaiter(void 0, void 0, void 0, function* () {
    const unixEpochSeconds = Math.round(Date.now() / 1000);
    const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
    const dailyWordDoc = yield dailyWordRef.get();
    if (!dailyWordDoc.exists)
        return;
    const wordData = dailyWordDoc.data();
    if (!wordData)
        return;
    const { dailyWord, updatedAt } = wordData;
    if (!dailyWord || !updatedAt)
        return;
    const databaseDay = updatedAt.toDate().getDay();
    const currentDay = new Date().getDay();
    const isWordOfDay = databaseDay === currentDay;
    if (isWordOfDay) {
        return dailyWord;
    }
    else {
        const wordList = (yield wordListRef.get()).data();
        if (!wordList)
            return;
        const newWord = getNewDailyWord(wordList, currentDay);
        const timestamp = new Timestamp(unixEpochSeconds, unixEpochNanoseconds);
        const result = yield dailyWordRef.set({
            dailyWord: newWord,
            updatedAt: timestamp
        });
        if (result.writeTime.toDate().getDay() === timestamp.toDate().getDay()) {
            return newWord;
        }
        return;
    }
});
export const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const wordsData = yield getWordsObject();
    if (!wordsData) {
        return {
            ok: 'Finished',
            message: 'Getting words document failed'
        };
    }
    const listData = yield getList();
    if (!listData) {
        return {
            ok: 'Finished',
            message: 'Getting full list document failed'
        };
    }
    const weekdays = wordListRef;
    yield weekdays.set(wordsData, { merge: true });
    yield fullListRef.set({ list: listData });
    return {
        ok: 'Finished',
        weekdays: wordsData,
        fullList: listData
    };
});
export const getList = () => __awaiter(void 0, void 0, void 0, function* () {
    const wordListSnap = yield fullListRef.get();
    if (!wordListSnap.exists)
        return;
    const { list } = wordListSnap.data();
    return list;
});
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
        success: 'List validation complete'
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
    const dailyWordList = Object.values(orderedWordList)[currentDay];
    const newWord = dailyWordList[Math.floor(Math.random() * dailyWordList.length)];
    return newWord;
};
export const getWordsObject = () => __awaiter(void 0, void 0, void 0, function* () {
    const wordListDoc = yield wordListRef.get();
    if (!wordListDoc.exists)
        return;
    const wordList = wordListDoc.data();
    return wordList;
});
export default getDailyWord;
