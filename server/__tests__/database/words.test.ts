import request from 'supertest';
import '@jest/globals';

import getDailyWord from '../../dist/models/codle.model.js';

const currentDate = new Date(new Date().toUTCString());
const userDate = new Date();
const offset = userDate.getTimezoneOffset();
// const offset = 720;

describe('Codle Words API', () => {
  describe('DB Get Daily Word', () => {
    test('It should respond with the daily Codle word', async () => {
      const clientDate = new Date(currentDate);
      console.log('cd', clientDate)
      clientDate.setUTCHours(currentDate.getUTCHours() - offset / 60);

      const dailyWord = await getDailyWord(offset);
      console.log(dailyWord);
      console.log(clientDate.getUTCHours(), currentDate.getUTCHours());
      if (clientDate.getUTCDate() !== currentDate.getUTCDate()) {
        expect(dailyWord).toBe('test2');
      } else {
        expect(dailyWord).toBe('test1');
      }
    });
  });
  // describe('GET /word?timezoneOffset=360', () => {
  //   test('It should get the correct word of the day', async () => {
  //     const UTCDate = new Date(new Date().toUTCString());
  //     UTCDate.setHours(UTCDate.getHours() + offset / 60);
  //     const response = await request(app).get(
  //       '/codle/word?timezoneOffset=' + offset
  //     );
  //     if (UTCDate.getDate() !== userDate.getDate()) {
  //       expect(response.body?.codleWord).toBe('test2');
  //     } else {
  //       expect(response.body?.codleWord).toBe('test1');
  //     }
  //     expect(new Date(response.body.updatedAt).getHours()).toBe(
  //       currentDate.getHours() - offset / 60
  //     );
  //   });
  // });
});
