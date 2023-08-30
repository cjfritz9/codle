import request from 'supertest';
import '@jest/globals';

import app from '../src/app.js';
import firestore from '../src/services/firestore.js';
import { Timestamp } from 'firebase-admin/firestore';

const collection = firestore.collection('codle');
const dailyWordRef = collection.doc('dailyWord');
const nextDailyWordRef = collection.doc('nextDailyWord');
const wordListRef = collection.doc('wordList');
const fullListRef = collection.doc('fullWordList');

const currentDate = new Date(new Date().toUTCString());
const userDate = new Date();
const offset = userDate.getTimezoneOffset();

describe('Codle Words API', () => {
  afterAll(async () => {
    await collection.listDocuments().then((refs) => {
      refs.map((doc) => {
        doc.delete();
      });
    });
  });
  describe('GET /word', () => {
    test('It should respond with the daily Codle word', async () => {
      await dailyWordRef.set({
        word: 'test1',
        updatedAt: currentDate.toUTCString()
      });
      await nextDailyWordRef.set({
        word: 'test2',
        updatedAt: currentDate.toUTCString()
      });
      const response = await request(app).get(
        '/codle/word?timezoneOffset=' + offset
      );

      expect(response.status).toBe(200);
      expect(response.body?.codleWord).toBe('test1');
    });
  });
  describe('GET /word?timezoneOffset=360', () => {
    test('It should get the correct word of the day', async () => {
      const UTCDate = new Date(new Date().toUTCString());
      UTCDate.setHours(UTCDate.getHours() + offset / 60);
      const response = await request(app).get(
        '/codle/word?timezoneOffset=' + offset
      );
      if (UTCDate.getDate() !== userDate.getDate()) {
        expect(response.body?.codleWord).toBe('test2');
      } else {
        expect(response.body?.codleWord).toBe('test1');
      }
    });
  });
});
