import MonthlyHistory from '@/components/History/MonthlyHistory'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { useUserAuth } from '@/hooks/useUserAuth'
import React from 'react'

const History = () => {
    useUserAuth()
  return (
    <DashboardLayout activeMenu="History">
      <div className="my-5 mx-auto">
        <MonthlyHistory />
      </div>
    </DashboardLayout>
  )
}

export default History
