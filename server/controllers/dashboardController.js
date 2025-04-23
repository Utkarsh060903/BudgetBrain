// import Income from "../models/Income.js";
// import Expense from "../models/Expense.js";
// import { isValidObjectId, Types } from "mongoose";

// export const getDashboardData = async (req, res) => {
//     try{
//         const userId = req.user._id; // Assuming req.user is populated by the auth middleware

//        const userObjectId = new Types.ObjectId(userId);

//        //fetch income and expense data
//          const totalIncome = await Income.aggregate([
//                 {
//                  $match: {
//                       userId: userObjectId,
//                  },
//                 },
//                 {
//                  $group: {
//                       _id: null,
//                       total: { $sum: "$amount" },
//                  },
//                 },
//           ]);

//           console.log
    
//           const totalExpense = await Expense.aggregate([
//                 {
//                  $match: {
//                       userId: userObjectId,
//                  },
//                 },
//                 {
//                  $group: {
//                       _id: null,
//                       total: { $sum: "$amount" },
//                  },
//                 },
//           ]);

//           //get income transactions in last 60 days
//             const last60DaysIncomeTransactions = await Income.find({
//                 userId: userObjectId,
//                 date: {
//                     $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
//                 },
//             }).sort({ date: -1 });

//             const incomeLast60Days = last60DaysIncomeTransactions.reduce(
//                 (sum, transaction) => sum + transaction.amount,
//                 0   
//             );
           
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }

//     const last30DaysIncomeTransactions = await Income.find({
//         userId: userObjectId,
//         date: {
//             $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
//         },
//     }).sort({ date: -1 });
//     const incomeLast30Days = last30DaysIncomeTransactions.reduce(
//         (sum, transaction) => sum + transaction.amount,
//         0
//     );

//     const last30DaysExpenseTransactions = await Expense.find({
//         userId: userObjectId,
//         date: {
//             $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
//         },
//     }).sort({ date: -1 });
//     const expenseLast30Days = last30DaysExpenseTransactions.reduce(
//         (sum, transaction) => sum + transaction.amount,
//         0
//     );

//     const last60DaysExpenseTransactions = await Expense.find({
//         userId: userObjectId,
//         date: {
//             $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
//         },
//     }).sort({ date: -1 });
//     const expenseLast60Days = last60DaysExpenseTransactions.reduce(
//         (sum, transaction) => sum + transaction.amount,
//         0
//     );

//     //fetch last 5 transactions(income and expense)
//     const lastTransactions = [
//         ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).map(
//             (txn) => ({
//                 ...txn.toObject(),
//                 type: "income",
//             })  
//         ), 
        
//         ...(await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5).map(
//             (txn) => ({
//                 ...txn.toObject(),
//                 type: "expense",
//             })
//         )

//     ].sort((a, b) => b.date - a.date)

//     res.json{
//         totalBalance: totalIncome[0]?.total || 0 - totalExpense[0]?.total || 0,
//         totalIncome: totalIncome[0]?.total || 0,
//         totalExpense: totalExpense[0]?.total || 0,
//         last30DaysExpenses: {
//             total: expenseLast30Days,
//             transactions: last30DaysExpenseTransactions,
//         },
//         last60DaysIncome: {
//             total: incomeLast60Days,
//             transactions: last60DaysIncomeTransactions,
//         },

//         recentTransactions: lastTransactions,
//     });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" }); 
//     }
// }

import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { isValidObjectId, Types } from "mongoose";

export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming req.user is populated by the auth middleware
        const userObjectId = new Types.ObjectId(userId);

        // Fetch income and expense data
        const totalIncome = await Income.aggregate([
            {
                $match: {
                    userId: userObjectId,
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]);

        const totalExpense = await Expense.aggregate([
            {
                $match: {
                    userId: userObjectId,
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]);

        // Get income transactions in last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: {
                $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
            },
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0   
        );

        const last30DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
        }).sort({ date: -1 });
        
        const incomeLast30Days = last30DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
        }).sort({ date: -1 });
        
        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        const last60DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: {
                $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
            },
        }).sort({ date: -1 });
        
        const expenseLast60Days = last60DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Fetch last 5 transactions (income and expense)
        const lastIncomeTransactions = await Income.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
            .lean();

        const incomeWithType = lastIncomeTransactions.map(txn => ({
            ...txn,
            type: "income"
        }));

        const lastExpenseTransactions = await Expense.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
            .lean();

        const expenseWithType = lastExpenseTransactions.map(txn => ({
            ...txn,
            type: "expense"
        }));

        const lastTransactions = [...incomeWithType, ...expenseWithType]
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);

        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysIncome: {
                total: incomeLast30Days,
                transactions: last30DaysIncomeTransactions
            },
            last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions
            },
            last60DaysExpenses: {
                total: expenseLast60Days,
                transactions: last60DaysExpenseTransactions
            },
            recentTransactions: lastTransactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
};