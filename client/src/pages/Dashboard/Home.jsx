import InfoCard from "@/components/Cards/InfoCard";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useUserAuth } from "@/hooks/useUserAuth";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addThousandsSeperator } from "@/utils/helper";
import { MdCreditCard } from "react-icons/md";
import { LucideHandCoins, LucideWalletMinimal } from "lucide-react";
import RecentTransactions from "@/components/Dashboard/RecentTransactions";
import FinanceOverview from "@/components/Dashboard/FinanceOverview";
import ExpenseTransactions from "@/components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "@/components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "@/components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "@/components/Dashboard/RecentIncome";
import { UserContext } from "@/context/userContext";

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const {dashboardData, setDashboardData} = useContext(UserContext)
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      console.log("Fetching dashboard data...");
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      console.log("API response:", response);

      if (response.data) {
        setDashboardData(response.data);
        console.log("Fetched data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<MdCreditCard />}
            label="Total Balance"
            value={addThousandsSeperator(dashboardData?.totalBalance || 0)}
            color="bg-blue-500"
          />

          <InfoCard
            icon={<LucideWalletMinimal />}
            label="Total Income"
            value={addThousandsSeperator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LucideHandCoins />}
            label="Total Expense"
            value={addThousandsSeperator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />
          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalExpense={dashboardData?.totalExpense}
            totalIncome={dashboardData?.totalIncome}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentIncomeWithChart
            data={
              dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []
            }
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome  transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}  />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
