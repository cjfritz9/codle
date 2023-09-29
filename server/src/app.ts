import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import codleRouter from './routes/codle.router.js';
import usersRouter from './routes/users.router.js';
import devRouter from './routes/dev.router.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: '*'
  })
);

app.use(morgan('combined'));
app.use(express.json());

app.use('/codle', codleRouter);
app.use('/users', usersRouter);
app.use('/dev-testing', devRouter);
app.get('/*', (req, res) => {
  const reqUrl = req.url;
  res.status(404).send(`No page found at ${reqUrl}`);
});

export default app;
