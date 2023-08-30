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

const unixEpochSeconds = Math.round(Date.now() / 1000);
const unixEpochNanoseconds = Math.round(Date.now() / 1000000);
const timestamp = new Timestamp(unixEpochSeconds, unixEpochNanoseconds);
const userDate = new Date();
const offset = userDate.getTimezoneOffset();

describe('Codle Words API', () => {
  describe('GET /word', () => {
    test('It should respond with the daily Codle word', async () => {
      await dailyWordRef.set({
        word: 'test1',
        updatedAt: timestamp
      });
      await nextDailyWordRef.set({
        word: 'test2',
        updatedAt: timestamp
      });
      const response = await request(app).get('/codle/word?timezoneOffset=-'+ offset);

      expect(response.status).toBe(200);
      expect(response.body?.codleWord).toBe('test1');
    });
  });
  describe('GET /word?timezoneOffset=360', () => {
    test('It should get the correct word of the day', async () => {
      const UTCDate = new Date();
      UTCDate.setHours(UTCDate.getHours() + offset / 60);
      const response = await request(app).get('/codle/word?timezoneOffset=360');
      if (UTCDate.getDate() !== userDate.getDate()) {
        expect(response.body?.codleWord).toBe('test2');
      } else {
        expect(response.body?.codleWord).toBe('test1');
      }
    });
  });
});
