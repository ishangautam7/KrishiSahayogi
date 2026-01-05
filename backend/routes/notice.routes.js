
import express from 'express';
import { getNotices } from '../controllers/notice.controller.js';

const router = express.Router();

router.get('/', getNotices);

export default router;
