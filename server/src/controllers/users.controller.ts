import { Request, Response } from 'express';
import {
  addNewUser,
  getUserData,
  updateUserData
} from '../models/users.model.js';

export const httpGetUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ error: 'No user ID supplied' });
  }

  const user = await getUserData(id);
  return res.status(200).send(user);
};

export const httpAddUser = async (_req: Request, res: Response) => {
  const user = await addNewUser();
  return res.status(201).send(user);
};

export const httpUpdateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { didWin, guesses, guessMap } = req.body;

  if (!id) {
    return res.status(400).send({ error: 'No user ID supplied' });
  }

  const user = await updateUserData(id, { didWin, guesses, guessMap });
  return res.status(200).send(user);
};
