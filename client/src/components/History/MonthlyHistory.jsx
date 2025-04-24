import React, { useState, useEffect } from "react";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import Modal from "../Modal";
import CustomLineChart from "../Charts/CustomLineChart";
import CustomBarChart from "../Charts/CustomBarChart";

const MonthlyHistoryCard = ({
  month,
  year,
  income,
  expense,
  onViewDetails,
}) => {
  return (
    <div className="card p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {month} {year}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Income</p>
          <p className="text-lg font-medium text-green-600">
            ₹{income.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Expense</p>
          <p className="text-lg font-medium text-red-600">
            ₹{expense.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-500">Balance</p>
        <p
          className={`text-lg font-medium ${
            income - expense >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          ₹{(income - expense).toLocaleString()}
        </p>
      </div>
      <button
        className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        onClick={() => onViewDetails(month, year)}
      >
        See Details
      </button>
    </div>
  );
};

const MonthlyHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonthDetails, setSelectedMonthDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchMonthlyHistory();
  }, []);

  const fetchMonthlyHistory = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.HISTORY.GET_MONTHLY_HISTORY
      );

      if (response.data && response.data.monthlyData) {
        setHistoryData(response.data.monthlyData);
      }
    } catch (err) {
      console.log("Something went wrong fetching history", err);
      toast.error("Failed to fetch history data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (month, year) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.HISTORY.GET_MONTH_DETAILS(month, year)
      );

      if (response.data) {
        setSelectedMonthDetails(response.data);
        setShowDetailsModal(true);
      }
    } catch (err) {
      console.log("Error fetching month details", err);
      toast.error("Failed to load month details");
    }
  };

  const handleDownloadMonthlyReport = async (month, year) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.HISTORY.DOWNLOAD_MONTHLY_REPORT(month, year),
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${month}_${year}_report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (err) {
      console.log("Error downloading report", err);
      toast.error("Failed to download report");
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMonthDetails(null);
  };

  return (
    <div className="my-5 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Monthly History</h2>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <p>Loading history data...</p>
        </div>
      ) : historyData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyData.map((item, index) => (
            <MonthlyHistoryCard
              key={index}
              month={item.month}
              year={item.year}
              income={item.totalIncome}
              expense={item.totalExpense}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>No history data available</p>
        </div>
      )}

      {/* {showDetailsModal && selectedMonthDetails && (
        <Modal
          isOpen={showDetailsModal}
          onClose={closeDetailsModal}
          title={`${selectedMonthDetails.month} ${selectedMonthDetails.year} Details`}
        >
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-lg font-medium text-green-600">
                    ₹{selectedMonthDetails.totalIncome.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Expense</p>
                  <p className="text-lg font-medium text-red-600">
                    ₹{selectedMonthDetails.totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Income</h3>
              {selectedMonthDetails.income.length > 0 ? (
                <div className="space-y-3">
                  {selectedMonthDetails.income.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.icon}
                          alt={item.source}
                          className="w-8 h-8 mr-3"
                        />
                        <div>
                          <p className="font-medium">{item.source}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-green-600">
                        ₹{item.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No income transactions for this month</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Expenses</h3>
              {selectedMonthDetails.expenses.length > 0 ? (
                <div className="space-y-3">
                  {selectedMonthDetails.expenses.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.icon}
                          alt={item.category}
                          className="w-8 h-8 mr-3"
                        />
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">
                        ₹{item.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No expense transactions for this month</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  handleDownloadMonthlyReport(
                    selectedMonthDetails.month,
                    selectedMonthDetails.year
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Download Report
              </button>
            </div>
          </div>
        </Modal>
      )} */}
      {showDetailsModal && selectedMonthDetails && (
        <Modal
          isOpen={showDetailsModal}
          onClose={closeDetailsModal}
          title={`${selectedMonthDetails.month} ${selectedMonthDetails.year} Details`}
        >
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-lg font-medium text-green-600">
                    ₹{selectedMonthDetails.totalIncome.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Expense</p>
                  <p className="text-lg font-medium text-red-600">
                    ₹{selectedMonthDetails.totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Income Chart Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Income Visualization
              </h3>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <CustomBarChart
                  data={selectedMonthDetails.income.map((item) => ({
                    month: new Date(item.date).toLocaleDateString("en-US", {
                      day: "numeric",
                    }),
                    category: item.source,
                    amount: item.amount,
                  }))}
                />
              </div>
            </div>

            {/* Expense Chart Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Expense Visualization
              </h3>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <CustomLineChart
                  data={selectedMonthDetails.expenses.map((item) => ({
                    month: new Date(item.date).toLocaleDateString("en-US", {
                      day: "numeric",
                    }),
                    category: item.category,
                    amount: item.amount,
                  }))}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Income</h3>
              {selectedMonthDetails.income.length > 0 ? (
                <div className="space-y-3">
                  {selectedMonthDetails.income.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.icon}
                          alt={item.source}
                          className="w-8 h-8 mr-3"
                        />
                        <div>
                          <p className="font-medium">{item.source}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-green-600">
                        ₹{item.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No income transactions for this month</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Expenses</h3>
              {selectedMonthDetails.expenses.length > 0 ? (
                <div className="space-y-3">
                  {selectedMonthDetails.expenses.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.icon}
                          alt={item.category}
                          className="w-8 h-8 mr-3"
                        />
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">
                        ₹{item.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No expense transactions for this month</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  handleDownloadMonthlyReport(
                    selectedMonthDetails.month,
                    selectedMonthDetails.year
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Download Report
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MonthlyHistory;
