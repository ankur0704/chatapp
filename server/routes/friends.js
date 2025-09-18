import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { sendFriendRequest } from '../controllers/friendController.js';

const router = express.Router();

router.post('/request', authenticate, sendFriendRequest);

export default router;


