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
        updatedAt,
        didWin,
        guesses,
        guessMap
    };
};
export const addNewUser = async () => {
    const currentDate = new Date(new Date().toUTCString());
    const data = {
        updatedAt: currentDate.toUTCString(),
        didWin: false,
        guesses: [],
        guessMap: '[]'
    };
    const result = await collection.add(data);
    return {
        id: result.id,
        updatedAt: currentDate.toUTCString(),
        didWin: data.didWin,
        guesses: data.guesses,
        guessMap: data.guessMap
    };
};
export const updateUserData = async (id, data) => {
    const currentDate = new Date(new Date().toUTCString());
    await collection.doc(id).set({
        updatedAt: currentDate.toUTCString(),
        ...data
    });
    return {
        id,
        updatedAt: currentDate.toUTCString(),
        ...data
    };
};
