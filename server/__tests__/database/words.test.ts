import request from 'supertest';
import '@jest/globals';

import getDailyWord, { JEST_BACKDOOR } from '../../dist/models/codle.model.js';

const currentDate = new Date(new Date().toUTCString());
const userDate = new Date();
const offset = userDate.getTimezoneOffset();
const offsetHours = offset / 60;

describe('Codle Words DB', () => {
  beforeAll(async () => {
    await JEST_BACKDOOR.setup();
  });
  afterAll(async () => {
    await JEST_BACKDOOR.teardown();
  });
  test('It should respond with the correct word', async () => {
    const clientDate = new Date(currentDate);
    clientDate.setUTCHours(clientDate.getUTCHours() - offsetHours);

    const dailyWord = await getDailyWord(offset);
    const { updatedAt } = await JEST_BACKDOOR.getDailyWord();
    const updateDate = new Date(updatedAt);

    updateDate.setUTCHours(updateDate.getUTCHours() - offsetHours);

    const isClientWordOfDay =
      updateDate.getUTCFullYear() === clientDate.getUTCFullYear() &&
      updateDate.getUTCMonth() === clientDate.getUTCMonth() &&
      updateDate.getUTCDate() === clientDate.getUTCDate();

    if (isClientWordOfDay) {
      expect(dailyWord).toBe('test1');
    } else {
      expect(dailyWord).toBe('test2');
    }
  });

  test('It should update words and return the updated daily word', async () => {
    const { word: prevDailyWord } = await JEST_BACKDOOR.getDailyWord();
    const { word: prevNextWord } = await JEST_BACKDOOR.getNextDailyWord();
    await JEST_BACKDOOR.updateDailyWords();

    const dailyWord = await getDailyWord(offset);
    const { word: nextWord } = await JEST_BACKDOOR.getNextDailyWord();

    console.log(dailyWord, prevDailyWord);
    console.log(nextWord, prevNextWord);
    expect(dailyWord).toBe(prevNextWord);
    expect(dailyWord).not.toBe(prevDailyWord);
    expect(nextWord).not.toBe(prevNextWord);
  });
});
