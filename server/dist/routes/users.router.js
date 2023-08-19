import express from 'express';
import { httpGetUser, httpAddUser, httpUpdateUser } from '../controllers/users.controller.js';
const usersRouter = express.Router();
usersRouter.get('/:id', httpGetUser);
usersRouter.post('/', httpAddUser);
usersRouter.patch('/', httpUpdateUser);
export default usersRouter;
