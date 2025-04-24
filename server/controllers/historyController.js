// controllers/historyController.js
import Income from '../models/Income.js';
import Expense from '../models/Expense.js';

/**
 * Get monthly summary of income and expenses
 */
export const getMonthlyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [earliestIncome] = await Income.find({ userId })
      .sort({ date: 1 })
      .limit(1);
      
    const [earliestExpense] = await Expense.find({ userId })
      .sort({ date: 1 })
      .limit(1);
    
    let startDate;
    if (earliestIncome && earliestExpense) {
      startDate = new Date(Math.min(
        new Date(earliestIncome.date).getTime(),
        new Date(earliestExpense.date).getTime()
      ));
    } else if (earliestIncome) {
      startDate = new Date(earliestIncome.date);
    } else if (earliestExpense) {
      startDate = new Date(earliestExpense.date);
    } else {
      return res.status(200).json({ monthlyData: [] });
    }
    
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endDate = new Date();
    
    const monthlyData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);
      
      const incomeForMonth = await Income.find({
        userId,
        date: {
          $gte: firstDay,
          $lte: lastDay
        }
      });
      
      const expensesForMonth = await Expense.find({
        userId,
        date: {
          $gte: firstDay,
          $lte: lastDay
        }
      });
      
      const totalIncome = incomeForMonth.reduce((sum, item) => sum + item.amount, 0);
      const totalExpense = expensesForMonth.reduce((sum, item) => sum + item.amount, 0);
      
      monthlyData.push({
        month: firstDay.toLocaleString('default', { month: 'long' }),
        year,
        totalIncome,
        totalExpense
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    monthlyData.sort((a, b) => {
      const dateA = new Date(`${a.month} 1, ${a.year}`);
      const dateB = new Date(`${b.month} 1, ${b.year}`);
      return dateB - dateA;
    });
    
    return res.status(200).json({ monthlyData });
  } catch (error) {
    console.error("Error fetching monthly history:", error);
    return res.status(500).json({ 
      message: "Error fetching monthly history",
      error: error.message 
    });
  }
};

/**
 * Get detailed transactions for a specific month
 */
export const getMonthDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.params;
    
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    const yearNum = parseInt(year);
    
    if (isNaN(monthIndex) || isNaN(yearNum)) {
      return res.status(400).json({ message: "Invalid month or year format" });
    }
    
    const firstDay = new Date(yearNum, monthIndex, 1);
    const lastDay = new Date(yearNum, monthIndex + 1, 0, 23, 59, 59, 999);
    
    const income = await Income.find({
      userId,
      date: {
        $gte: firstDay,
        $lte: lastDay
      }
    }).sort({ date: -1 });
    
    const expenses = await Expense.find({
      userId,
      date: {
        $gte: firstDay,
        $lte: lastDay
      }
    }).sort({ date: -1 });
    
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    return res.status(200).json({
      month,
      year: yearNum,
      totalIncome,
      totalExpense,
      income,
      expenses
    });
  } catch (error) {
    console.error("Error fetching month details:", error);
    return res.status(500).json({ 
      message: "Error fetching month details",
      error: error.message 
    });
  }
};
