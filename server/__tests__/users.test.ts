import request from 'supertest';
import '@jest/globals';
import dotenv from 'dotenv';

import app from '../src/app.js';
import firestore from '../src/services/firestore.js';
import { Timestamp } from 'firebase-admin/firestore';

const collection = firestore.collection('users');

const unixEpochSeconds = Math.round(Date.now() / 1000);
const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
const timestamp = new Timestamp(unixEpochSeconds, unixEpochNanoseconds);

describe('Codle Users API', () => {
  describe('GET /users/:id', () => {
    test('It should respond with the correct user and data', async () => {
      const userRef = await collection.add({
        didWin: false,
        guessMap: '[]',
        guesses: [],
        updatedAt: timestamp
      });
      const response = await request(app).get(`/users/${userRef.id}`);

      expect(response.status).toBe(200);
      expect(response.body?.didWin).toBe(false);
      expect(response.body?.guessMap).toBe('[]');
      expect(response.body?.guesses).toStrictEqual([]);
      expect(response.body?.updatedAt).toBe(timestamp.toDate().toISOString());
    });
  });
});
