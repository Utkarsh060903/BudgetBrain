import React, { useEffect, useState } from "react";
import { LucidePlus } from "lucide-react";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "@/utils/helper";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    console.log("transactions data:", transactions);

    if (Array.isArray(transactions) && transactions.length > 0) {
      const result = prepareIncomeBarChartData(transactions);
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
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your expenses over time and analyze your income trends.
          </p>
        </div>

        <button className="add-btn" onClick={onAddIncome}>
        <LucidePlus className="text-lg" /> Add Income 
        </button>
      </div>

      <div className="mt-10">
        <CustomBarChart data={chartData} style={{ height: "300px" }} />
      </div>
    </div>
  );
};

export default IncomeOverview;
