import { LucideDownload } from 'lucide-react'
import React from 'react'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const IncomeList = ({transactions, onDelete, onDownload}) => {
  return (
    <div className='card'>
      <div className="flex incomes-center justify-between">
          <h5 className="text-lg">Income Overview</h5>


        <button className="card-btn" onClick={onDownload}>
        <LucideDownload className="text-base" />  Download
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2'>
        {transactions?.map((income) => (
            <TransactionInfoCard 
            key={income._id}
            title={income.source}
            icon={income.icon}
            amount={income.amount}
            date={moment(income.date).format('DD MMM YYYY')}
            type="income"
            onDelete={() => onDelete(income._id)}
          />
        ))}
      </div>
    </div>
  )
}

export default IncomeList
