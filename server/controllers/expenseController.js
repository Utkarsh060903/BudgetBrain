import Expense from "../models/Expense.js";
import XLSX from "xlsx";

export const addExpense = async (req, res) => {
  const userId = req.user._id;

  try {
    const { icon, amount, category, date } = req.body;
    if (!amount || !category || !date) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const newExpense = await Expense.create({
      userId,
      icon,
      amount,
      category,
      date,
    });

    await newExpense.save();

    res.status(200).json({ expense: newExpense });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllExpense = async (req, res) => {
  const userId = req.user._id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json({ expense });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    // if (!expense) {
    //     return res.status(404).json({ message: "Expense not found" });
    // }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    //prepare the data for CSV
    const data = expense.map((item) => ({
      amount: item.amount,
      category: item.category,
      date: item.date.toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense");

    const filePath = `expense_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, filePath);

    res.download(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error downloading file" });
      }
      // Optionally delete the file after download
      // fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
