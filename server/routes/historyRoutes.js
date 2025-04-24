// routes/historyRoutes.js
import express from 'express';
import { 
  getMonthlyHistory, 
  getMonthDetails, 
} from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes

// Get monthly history summary
router.get('/monthly', protect, getMonthlyHistory);

// Get details for a specific month
router.get('/details/:month/:year', protect, getMonthDetails);

// Download monthly report
// router.get('/download/:month/:year', protect, downloadMonthlyReport);

export default router;
