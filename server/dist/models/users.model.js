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
const collection = firestore.collection('users');
export const getUserData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield collection.doc(id).get();
    if (!result.exists) {
        return addNewUser();
    }
    const { updatedAt, didWin, guesses, guessMap } = result.data();
    return {
        id,
        updatedAt: updatedAt.toDate(),
        didWin,
        guesses,
        guessMap
    };
});
export const addNewUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const unixEpochSeconds = Math.round(Date.now() / 1000);
    const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
    const updatedAt = new Timestamp(unixEpochSeconds, unixEpochNanoseconds);
    const data = {
        updatedAt,
        didWin: false,
        guesses: [],
        guessMap: '[]'
    };
    const result = yield collection.add(data);
    return {
        id: result.id,
        updatedAt: updatedAt.toDate(),
        didWin: data.didWin,
        guesses: data.guesses,
        guessMap: data.guessMap
    };
});
export const updateUserData = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const unixEpochSeconds = Math.round(Date.now() / 1000);
    const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
    const updatedAt = new Timestamp(unixEpochSeconds, unixEpochNanoseconds);
    yield collection.doc(id).update(Object.assign({ updatedAt }, data), { exists: false });
    return Object.assign({ id, updatedAt: updatedAt.toDate() }, data);
});
