import { Request, Response } from 'express';
import getDailyWord, {
  getDuplicates,
  getList,
  isListValid,
  removeDuplicates
} from '../models/codle.model.js';
import { seedDatabase } from '../models/codle.model.js';

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
  const result = await seedDatabase();
  res.status(200).send({ ok: 'Finished', result });
};

export const httpValidateData = async (_req: Request, res: Response) => {
  const list = await getList();
  if (!list) {
    return res.status(500).send({ error: 'Internal Application Error' });
  }
  const result = isListValid(list);
  return res.status(200).send({ ok: 'Check complete', result });
};

export const httpRemoveDuplicates = async (_req: Request, res: Response) => {
  const list = await getList();
  if (!list) {
    return res.status(500).send({ error: 'Internal Application Error' });
  }
  const duplicates = getDuplicates(list);
  const updatedList = removeDuplicates(list);
  const difference = list.length - updatedList.length;

  return res.status(200).send({
    ok: 'Clean up complete',
    duplicates,
    difference,
  });
};

export default httpGetCodleWord;
