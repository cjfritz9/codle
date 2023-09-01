import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../secrets/gcp-service-account.json' assert { type: 'json' };
initializeApp({ credential: cert(serviceAccount) });
const devFirestore = getFirestore('testing-copy');
export default devFirestore;
