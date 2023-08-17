var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import getDailyWord from '../services/codle.db.js';
import { seedDatabase } from '../services/codle.db.js';
const httpGetCodleWord = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let word = yield getDailyWord();
    let errorCounter = 0;
    while (errorCounter < 5 && !word) {
        word = yield getDailyWord();
        errorCounter++;
    }
    if (errorCounter >= 5 && !word) {
        return res.status(500).send({ error: 'Internal Application Error' });
    }
    else {
        return res.status(200).send({ codleWord: word });
    }
});
export const httpSeedData = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield seedDatabase();
    res.status(200).send('Finished');
});
export default httpGetCodleWord;
