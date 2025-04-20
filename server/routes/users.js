import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateProfile,
  updateStatus
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/profile', updateProfile);
router.put('/status', updateStatus);

export default router;