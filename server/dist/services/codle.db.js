var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getWordsObject } from '../models/codle.model.js';
import firestore from './firestore.js';
const collection = firestore.collection('codle');
const getDailyWord = () => {
    const unixEpochSeconds = Math.round(Date.now() / 1000);
    const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
    collection.get();
};
export const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const wordsData = getWordsObject();
    const weekdays = collection.doc('wordList');
    yield weekdays.set(wordsData, { merge: true });
});
