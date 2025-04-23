import AddExpenseForm from "@/components/Dashboard/AddExpenseForm";
import ExpenseList from "@/components/Dashboard/ExpenseList";
import ExpenseOverview from "@/components/Dashboard/ExpenseOverview";
import DeleteAlert from "@/components/DeleteAlert";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Modal from "@/components/Modal";
import { useUserAuth } from "@/hooks/useUserAuth";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [OpenAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const fetchExpenseDetails = async () => {
    if (loading) return;

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );
      console.log("API Response:", response.data);

      if (response.data && response.data.expense) {
        // Set the Expense array specifically
        setExpenseData(response.data.expense);
        console.log(
          "Setting Expense data:",
          response.data.expense.length,
          "items"
        );
      }
    } catch (err) {
      console.log("something went wrong", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error("category is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid Number");
      return;
    }

    if (!date) {
      toast.error("Date is required");
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (err) {
      console.log("something went wrong", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense Details deleted successfully");
      fetchExpenseDetails();
    } catch (err) {
      console.log("something went wrong", err);
    }
  };

  useEffect(() => {
    fetchExpenseDetails();

    return () => {};
  }, []);

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.hrf = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log("something went wrong", err);
      toast.error("Error downloading expense details")
    }
  };
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={OpenAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this Expense source?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
