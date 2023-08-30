import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import serviceAccount from '../secrets/gcp-service-account.json' assert { type: 'json' };
dotenv.config();
const DEV_MODE = process.env.DEV_MODE === 'true';
const config = {
    credential: DEV_MODE
        ? cert(serviceAccount)
        : applicationDefault(),
    dbName: DEV_MODE ? 'testing-copy' : 'default'
};
initializeApp({ credential: config.credential });
const firestore = getFirestore(config.dbName);
export default firestore;
