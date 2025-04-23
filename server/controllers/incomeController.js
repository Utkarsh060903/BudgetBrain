import Income from "../models/Income.js";
import XLSX from "xlsx";

const addIncome = async (req, res) => {
   const userId = req.user._id;

   try {
        const { icon, amount, source, date } = req.body;
        if(!amount || !source || !date) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const newIncome = await Income.create({
            userId,
            icon,
            amount,
            source,
            date,
        });

        await newIncome.save();

        res.status(200).json({income: newIncome});
   } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
   }
}; // Added missing closing brace here

const getAllIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json({ income });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findByIdAndDelete(req.params.id);
        // if (!income) {
        //     return res.status(404).json({ message: "Income not found" });
        // }
        res.status(200).json({ message: "Income deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const downloadIncomeExcel = async (req, res) => { // Fixed typo in function name
    const userId = req.user._id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        //prepare the data for CSV
        const data = income.map((item) => ({
            amount: item.amount,
            source: item.source,
            date: item.date.toISOString().split("T")[0],
        }));

       const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Income");

        const fileName = `income_${new Date().toISOString().split("T")[0]}.xlsx`;
        // res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
        // res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        XLSX.writeFile(wb, fileName);
        res.download(fileName);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel }; 