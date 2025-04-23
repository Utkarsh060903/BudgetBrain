// import { LucideArrowRight } from 'lucide-react'
// import moment from 'moment'
// import React from 'react'
// import TransactionInfoCard from '../Cards/TransactionInfoCard'

// const RecentTransactions = ({ transactions, onSeeMore}) => {
//   return (
//     <div className='card'>
//       <div className='flex items-center justify-between'>
//         <h5 className='text-lg'>Recent Transactions</h5>
//         <button className='card-btn' onClick={onSeeMore}>
//           See All <LucideArrowRight className='text-base' />
//         </button>
//       </div>

//       <div className='mt-6'> 
//         {transactions?.slice(0, 5).map((item) => (
//           <TransactionInfoCard key={item.id}
//             title={item.type === 'expense' ? item.category : item.source}
//             icon={item.icon}
//             amount={item.amount}
//             date={moment(item.date).format('DD MMM YYYY')}
//             type={item.type}
//             hideDeleteBtn
//           />

          
//         ))} 
//       </div>
//     </div>
//   )
// }

// export default RecentTransactions

import { LucideArrowRight } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import TransactionInfoCard from '../Cards/TransactionInfoCard'

const RecentTransactions = ({ transactions, onSeeMore }) => {
  console.log('Transactions received:', transactions);
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Recent Transactions</h5>
        <button className='card-btn' onClick={onSeeMore}>
          See All <LucideArrowRight className='text-base' />
        </button>
      </div>

      <div className='mt-6'> 
        {/* Check if there are transactions */}
        {transactions?.length > 0 ? (
          transactions.slice(0, 5).map((item) => (
            <TransactionInfoCard 
              key={item._id}
              title={item.type === 'expense' ? item.category : item.source}
              icon={item.icon}
              amount={item.amount}
              date={moment(item.date).format('DD MMM YYYY')}
              type={item.type}
              hideDeleteBtn
            />
          ))
        ) : (
          <p>No transactions available.</p>
        )}
      </div>
    </div>
  )
}

export default RecentTransactions

