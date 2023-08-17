import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({
    credential: applicationDefault()
});
const firestore = getFirestore();
export default firestore;
