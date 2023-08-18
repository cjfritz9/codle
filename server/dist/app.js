import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app = express();
app.use(cors({
    origin: 'https://cjfritz.dev'
}));
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(morgan('combined'));
app.use(express.json());
import httpGetCodleWord from './controllers/codle.controller.js';
app.get('/codle/word', httpGetCodleWord);
import { httpSeedData } from './controllers/codle.controller.js';
app.get('/codle/seed', httpSeedData);
import { httpValidateData } from './controllers/codle.controller.js';
app.get('/codle/validate', httpValidateData);
import { httpRemoveDuplicates } from './controllers/codle.controller.js';
app.get('/codle/cleanup', httpRemoveDuplicates);
app.get('/*', (req, res) => {
    const reqUrl = req.url;
    res.status(404).send(`No page found ${reqUrl}`);
});
export default app;
