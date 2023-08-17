import { Request, Response } from 'express';
import getDailyWord from '../services/codle.db.js';
import { seedDatabase } from '../services/codle.db.js';

const httpGetCodleWord = async (_req: Request, res: Response) => {
  let word = await getDailyWord();
  let errorCounter = 0;

  while (errorCounter < 5 && !word) {
    word = await getDailyWord();
    errorCounter++;
  }

  if (errorCounter >= 5 && !word) {
    return res.status(500).send({ error: 'Internal Application Error' });
  } else {
    return res.status(200).send({ codleWord: word });
  }
};

export const httpSeedData = async (_req: Request, res: Response) => {
  await seedDatabase();
  res.status(200).send('Finished')
}

export default httpGetCodleWord;
