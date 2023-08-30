import request from 'supertest';
import '@jest/globals';
import dotenv from 'dotenv';

import app from '../src/app.js';
import firestore from '../src/services/firestore.js';
import { Timestamp } from 'firebase-admin/firestore';

const collection = firestore.collection('users');

const currentDate = new Date(new Date().toUTCString());

describe('Codle Users API', () => {
  afterAll(async () => {
    await collection.listDocuments().then((refs) => {
      refs.map((doc) => {
        doc.delete();
      });
    });
  });
  describe('GET /users/:id', () => {
    test('It should respond with the correct user and data', async () => {
      const userRef = await collection.add({
        didWin: false,
        guessMap: '[]',
        guesses: [],
        updatedAt: currentDate.toUTCString()
      });
      const response = await request(app).get(`/users/${userRef.id}`);

      console.log(userRef.id);
      expect(response.status).toBe(200);
      expect(response.body?.didWin).toBe(false);
      expect(response.body?.guessMap).toBe('[]');
      expect(response.body?.guesses).toStrictEqual([]);
      expect(response.body?.updatedAt).toBe(currentDate.toUTCString());
    });
  });
});
