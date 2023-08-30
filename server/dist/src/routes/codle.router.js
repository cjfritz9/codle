import express from 'express';
import { httpGetCodleWord, httpAddWord, httpValidateData, httpRemoveDuplicates } from '../controllers/codle.controller.js';
const codleRouter = express.Router();
codleRouter.get('/word', httpGetCodleWord);
codleRouter.post('/add-word', httpAddWord);
codleRouter.get('/validate', httpValidateData);
codleRouter.get('/cleanup', httpRemoveDuplicates);
export default codleRouter;
