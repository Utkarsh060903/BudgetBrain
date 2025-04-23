import { LucideDownload } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const ExpenseList = ({transactions, onDelete, onDownload}) => {
    return (
        <div className='card'>
          <div className="flex expenses-center justify-between">
              <h5 className="text-lg">Expense Overview</h5>
            <button className="card-btn" onClick={onDownload}>
            <LucideDownload className="text-base" />  Download
            </button>
          </div>
    
          <div className='grid grid-cols-1 md:grid-cols-2'>
            {transactions?.map((expense) => (
                <TransactionInfoCard 
                key={expense._id}
                title={expense.category}
                icon={expense.icon}
                amount={expense.amount}
                date={moment(expense.date).format('DD MMM YYYY')}
                type="expense"
                onDelete={() => onDelete(expense._id)}
              />
            ))}
          </div>
        </div>
      )
}

export default ExpenseList
