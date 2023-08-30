var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import getDailyWord, { addWord, getDuplicates, getList, isListValid, removeDuplicates } from '../models/codle.model.js';
export const httpGetCodleWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let timezoneOffset = (_a = req.query.timezoneOffset) !== null && _a !== void 0 ? _a : '240';
    let word = yield getDailyWord(+timezoneOffset);
    let errorCounter = 0;
    while (errorCounter < 5 && !word) {
        word = yield getDailyWord(+timezoneOffset);
        errorCounter++;
    }
    if (errorCounter >= 5 && !word) {
        return res.status(500).send({ error: 'Internal Application Error' });
    }
    else {
        return res.status(200).send({ codleWord: word });
    }
});
export const httpAddWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { word } = req.body;
    if (!word) {
        return res
            .status(400)
            .send({ error: 'Missing request data: Word to add to database' });
    }
    const result = yield addWord(word);
    if (!result) {
        return res.status(500).send({ error: 'Internal Application Error' });
    }
    if (result.error) {
        return res.status(410).send(result);
    }
    return res.status(201).send(result);
});
export const httpValidateData = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield getList();
    if (!list) {
        return res.status(500).send({ error: 'Internal Application Error' });
    }
    const result = isListValid(list);
    return res.status(200).send({ ok: 'Check complete', result });
});
export const httpRemoveDuplicates = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield getList();
    if (!list) {
        return res.status(500).send({ error: 'Internal Application Error' });
    }
    const duplicates = getDuplicates(list);
    const updatedList = removeDuplicates(list);
    const difference = list.length - updatedList.length;
    return res.status(200).send({
        ok: 'Clean up complete',
        duplicates,
        difference
    });
});