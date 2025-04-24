import Goals from "../models/Goals.js";
import ExcelJS from "exceljs";

export const getAllGoals = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const goals = await Goals.find({ userId }).sort({ createdAt: -1 });
  
      return res.status(200).json({
        success: true,
        goals,
      });
    } catch (error) {
      console.error("Error fetching goals:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch goals",
      });
    }
  };

export const createGoal = async (req, res) => {
    try {
      const userId = req.user._id;  // Get the user ID from req.user
      const { title, targetAmount, currentAmount, deadline, category, description } = req.body;
  
      // Basic validation
      if (!title || !targetAmount || !deadline) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields",
        });
      }
  
      const goal = await Goals.create({
        userId,
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        deadline: new Date(deadline),
        category,
        description,
      });
  
      return res.status(201).json({
        success: true,
        goal,
        message: "Goal created successfully",
      });
    } catch (error) {
      console.error("Error creating goal:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create goal",
      });
    }
  };

// Get a single goal by ID
export const getGoalById = async (req, res) => {
    try {
      const userId = req.user._id;
      const { id } = req.params;
  
      const goal = await Goals.findOne({ _id: id, userId });
  
      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        goal,
      });
    } catch (error) {
      console.error("Error fetching goal:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch goal",
      });
    }
  };

// Update a goal
export const updateGoal = async (req, res) => {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const updates = req.body;
  
      // Find the goal first to ensure it belongs to the user
      const goal = await Goals.findOne({ _id: id, userId });
  
      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }
  
      // Handle numeric fields
      if (updates.targetAmount) {
        updates.targetAmount = parseFloat(updates.targetAmount);
      }
      
      if (updates.currentAmount !== undefined) {
        updates.currentAmount = parseFloat(updates.currentAmount);
      }
  
      // Update the goal
      const updatedGoal = await Goals.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
  
      return res.status(200).json({
        success: true,
        goal: updatedGoal,
        message: "Goal updated successfully",
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update goal",
      });
    }
  };
// Delete a goal
export const deleteGoal = async (req, res) => {
    try {
      const userId = req.user._id;
      const { id } = req.params;
  
      // Find the goal first to ensure it belongs to the user
      const goal = await Goals.findOne({ _id: id, userId });
  
      if (!goal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }
  
      await Goals.findByIdAndDelete(id);
  
      return res.status(200).json({
        success: true,
        message: "Goal deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting goal:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete goal",
      });
    }
  };
// Download goals as Excel
export const downloadGoals = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch goals for the user
    const goals = await Goals.find({ userId }).sort({ createdAt: -1 });

    if (!goals || goals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No goals found to download",
      });
    }

    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Goals");

    // Set up columns
    worksheet.columns = [
      { header: "Goal Title", key: "title", width: 25 },
      { header: "Category", key: "category", width: 15 },
      { header: "Target Amount", key: "targetAmount", width: 15 },
      { header: "Current Amount", key: "currentAmount", width: 15 },
      { header: "Progress (%)", key: "progress", width: 15 },
      { header: "Deadline", key: "deadline", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created On", key: "createdAt", width: 15 },
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Add data rows
    goals.forEach((goal) => {
      const progress = goal.targetAmount > 0 
        ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2)
        : "0.00";
      
      const today = new Date();
      let status = "In Progress";
      
      if (goal.completed || goal.currentAmount >= goal.targetAmount) {
        status = "Completed";
      } else if (new Date(goal.deadline) < today) {
        status = "Overdue";
      }

      worksheet.addRow({
        title: goal.title,
        category: goal.category || "General",
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        progress: `${progress}%`,
        deadline: new Date(goal.deadline).toLocaleDateString(),
        status,
        createdAt: new Date(goal.createdAt).toLocaleDateString(),
      });
    });

    // Format numbers as currency
    worksheet.getColumn("targetAmount").numFmt = "$#,##0.00";
    worksheet.getColumn("currentAmount").numFmt = "$#,##0.00";

    // Set content type and headers for Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=goals_report.xlsx"
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error downloading goals:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to download goals",
    });
  }
};