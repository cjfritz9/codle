import fs from 'fs';
import path from 'path';

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

let firestore: Firestore;

const DEV_MODE = process.env.DEV_MODE === 'true';

if (DEV_MODE) {
  const result = fs.readFileSync(
    path.join('server', 'src', 'secrets', 'gcp-service-account.json'),
    'utf-8'
  );
  const cred = JSON.parse(result);
  initializeApp({ credential: cert(cred) });
  firestore = getFirestore('testing-copy');
} else {
  initializeApp({ credential: applicationDefault() });
  firestore = getFirestore();
}

export default firestore;
