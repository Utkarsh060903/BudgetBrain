import { prepareExpenseLineChartData } from '@/utils/helper';
import { LucidePlus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import CustomLineChart from '../Charts/CustomLineChart';

const ExpenseOverview = ({transactions, onAddExpense}) => {
 const [chartData, setChartData] = useState([]);
 
   useEffect(() => {
     console.log("transactions data:", transactions);
 
     if (Array.isArray(transactions) && transactions.length > 0) {
       const result = prepareExpenseLineChartData(transactions);
       setChartData(result);
     } else {
       // Handle empty data case
       setChartData([]);
     }
 
     return () => {};
   }, [transactions]);
   return (
     <div className="card">
       <div className="flex items-center justify-between">
         <div>
           <h5 className="text-lg">Expense Overview</h5>
           <p className="text-xs text-gray-400 mt-0.5">
             Track your expenses over time and analyze your Expense trends.
           </p>
         </div>
 
         <button className="add-btn" onClick={onAddExpense}>
         <LucidePlus className="text-lg" /> Add Expense 
         </button>
       </div>
 
       <div className="mt-10">
         <CustomLineChart data={chartData} style={{ height: "300px" }} />
       </div>
     </div>
   );
}

export default ExpenseOverview
