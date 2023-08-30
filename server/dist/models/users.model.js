import { Timestamp } from 'firebase-admin/firestore';
import firestore from '../services/firestore.js';
const collection = firestore.collection('users');
export const getUserData = async (id) => {
    const result = await collection.doc(id).get();
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
};
export const addNewUser = async () => {
    const unixEpochSeconds = Math.round(Date.now() / 1000);
    const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
    const updatedAt = new Timestamp(unixEpochSeconds, unixEpochNanoseconds);
    const data = {
        updatedAt,
        didWin: false,
        guesses: [],
        guessMap: '[]'
    };
    const result = await collection.add(data);
    return {
        id: result.id,
        updatedAt: updatedAt.toDate(),
        didWin: data.didWin,
        guesses: data.guesses,
        guessMap: data.guessMap
    };
};
export const updateUserData = async (id, data) => {
    const unixEpochSeconds = Math.round(Date.now() / 1000);
    const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
    const updatedAt = new Timestamp(unixEpochSeconds, unixEpochNanoseconds);
    await collection.doc(id).set({
        updatedAt,
        ...data
    });
    return {
        id,
        updatedAt: updatedAt.toDate(),
        ...data
    };
};
