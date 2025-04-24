// routes/goalRoutes.js
import express from "express";
import { 
  getAllGoals, 
  createGoal, 
  getGoalById, 
  updateGoal, 
  deleteGoal,
  downloadGoals
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all routes

// Goal routes
router.get("/", protect, getAllGoals);
router.post("/", protect, createGoal); 
router.get("/download", protect, downloadGoals);
router.get("/:id", protect, getGoalById);
router.put("/:id", protect, updateGoal);
router.delete("/:id", protect, deleteGoal);

export default router;