import express from 'express';
import { httpDevTesting } from '../controllers/dev.controller.js';
const devRouter = express.Router();
devRouter.get('/', httpDevTesting);
export default devRouter;
