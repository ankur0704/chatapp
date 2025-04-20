import express from 'express';
import { 
  sendMessage, 
  getConversation, 
  getConversations,
  markAsRead
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:userId', getConversation);
router.put('/read', markAsRead);

export default router;