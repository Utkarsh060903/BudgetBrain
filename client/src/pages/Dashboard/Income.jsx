import AddIncomeForm from "@/components/Dashboard/AddIncomeForm";
import IncomeList from "@/components/Dashboard/IncomeList";
import IncomeOverview from "@/components/Dashboard/IncomeOverview";
import DeleteAlert from "@/components/DeleteAlert";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Modal from "@/components/Modal";
import { useUserAuth } from "@/hooks/useUserAuth";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [OpenAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  const fetchIncomeDetails = async () => {
    if (loading) return;

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );
      console.log("API Response:", response.data);

      if (response.data && response.data.income) {
        // Set the income array specifically
        setIncomeData(response.data.income);
        console.log(
          "Setting income data:",
          response.data.income.length,
          "items"
        );
      }
    } catch (err) {
      console.log("something went wrong", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const {source, amount, date, icon} = income

    if(!source.trim()){
      toast.error("source is required")
      return 
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should be a valid Number")
      return 
    }

    if(!date){
      toast.error("Date is required")
    }

    try{
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon
      })

      setOpenAddIncomeModal(false)
      toast.success("Income added successfully")
      fetchIncomeDetails()
    } catch(err){
      console.log("something went wrong", err)
    }
  };

  const deleteIncome = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))

      setOpenDeleteAlert({ show: false, data: null})
      toast.success("Income Details deleted successfully")
      fetchIncomeDetails()
    } catch(err) {
      console.log("something went wrong" ,err)
    }
  };

  useEffect(() => {
    fetchIncomeDetails();

    return () => {};
  }, []);

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.hrf = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log("something went wrong", err);
      toast.error("Error downloading income details")
    }
  };
  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList transactions={incomeData} onDelete={(id) => {
            setOpenDeleteAlert({ show: true, data: id})
          }} onDownload={handleDownloadIncomeDetails} />
        </div>

        <Modal
          isOpen={OpenAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show: false, data: null})}
          title="Delete Income">
            <DeleteAlert content="Are you sure you want to delete this income source?" onDelete={() => deleteIncome(openDeleteAlert.data)} />
          </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
