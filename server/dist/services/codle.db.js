var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getList, getWordsObject } from '../models/codle.model.js';
import firestore from './firestore.js';
import { Timestamp } from 'firebase-admin/firestore';
const collection = firestore.collection('codle');
const dailyWordRef = collection.doc('dailyWord');
const getDailyWord = () => __awaiter(void 0, void 0, void 0, function* () {
    const unixEpochSeconds = Math.round(Date.now() / 1000);
    const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
    const dailyWordDoc = yield dailyWordRef.get();
    const wordData = dailyWordDoc.data();
    if (!wordData)
        return;
    const { dailyWord, updatedAt } = wordData;
    const databaseDay = updatedAt.toDate().getDay();
    const currentDay = new Date().getDay();
    const isWordOfDay = databaseDay === currentDay;
    if (isWordOfDay) {
        return dailyWord;
    }
    else {
        const wordList = (yield collection.doc('wordList').get()).data();
        if (!wordList)
            return;
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
    const wordsData = getWordsObject();
    const weekdays = collection.doc('wordList');
    const fullList = collection.doc('fullWordList');
    yield weekdays.set(wordsData, { merge: true });
    yield fullList.set({ list: getList() });
});
export default getDailyWord;
