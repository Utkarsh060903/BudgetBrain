import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const FinanceOverview = ({totalBalance, totalExpense, totalIncome}) => {
    const COLORS = ["#875CF5" , "#FF0000", "#FF6900"]

    const balanceData = [
        {
            name: "Total Balance",
            amount: totalBalance,

        },
        {
            name: "Total Expense",
            amount: totalExpense,
   
        },
        {
            name: "Total Income",
            amount: totalIncome,
        }
    ]
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5>Financial Overview</h5>
      </div>

      <CustomPieChart data={balanceData} label="Toal Balance" totalAmount={`$${totalBalance}`} colors={COLORS} showTextAnchor />
    </div>
  )
}

export default FinanceOverview
