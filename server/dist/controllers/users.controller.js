var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addNewUser, getUserData, updateUserData } from '../models/users.model.js';
export const httpGetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: 'No user ID supplied' });
    }
    const user = yield getUserData(id);
    return res.status(200).send(user);
});
export const httpAddUser = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield addNewUser();
    return res.status(201).send(user);
});
export const httpUpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, didWin, guesses, guessMap } = req.body;
    if (!id) {
        return res.status(400).send({ error: 'No user ID supplied' });
    }
    const user = yield updateUserData(id, { didWin, guesses, guessMap });
    return res.status(200).send(user);
});
