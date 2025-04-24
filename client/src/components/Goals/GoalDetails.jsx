import React, { useState } from "react";
import { formatCurrency } from "@/utils/helper";
import { 
  FaCalendarAlt, 
  FaCoins, 
  FaTags, 
  FaClock,
  FaEdit 
} from "react-icons/fa";

const GoalDetails = ({ goal, onUpdateProgress }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(goal.currentAmount);

  const handleSaveProgress = () => {
    onUpdateProgress(goal._id, parseFloat(currentAmount));
    setIsEditing(false);
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();
  const progressPercentage = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(0);
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

  // Determine goal status
  const getGoalStatus = () => {
    if (goal.currentAmount >= goal.targetAmount) {
      return {
        label: "Completed",
        color: "bg-green-100 text-green-800"
      };
    } else if (daysRemaining < 0) {
      return {
        label: "Overdue",
        color: "bg-red-100 text-red-800"
      };
    } else {
      return {
        label: "In Progress",
        color: "bg-blue-100 text-blue-800"
      };
    }
  };

  const goalStatus = getGoalStatus();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{goal.title}</h3>
          <div className="flex items-center mt-2">
            <span 
              className={`${goalStatus.color} text-xs font-medium px-2.5 py-0.5 rounded-full`}
            >
              {goalStatus.label}
            </span>
          </div>
        </div>
        
        {goal.currentAmount < goal.targetAmount && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaEdit className="mr-1" /> Update Progress
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Amount
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
            <button
              onClick={handleSaveProgress}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentAmount(goal.currentAmount);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Progress:</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className={`h-2.5 rounded-full ${
                progressPercentage >= 100 ? "bg-green-600" : "bg-blue-600"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaCoins className="text-blue-600 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Current Amount:</p>
                <p className="font-semibold">
                  {formatCurrency(goal.currentAmount)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCoins className="text-blue-600 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Target Amount:</p>
                <p className="font-semibold">
                  {formatCurrency(goal.targetAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center">
          <FaCalendarAlt className="text-blue-600 mr-2" />
          <div>
            <p className="text-xs text-gray-500">Deadline:</p>
            <p className="font-medium">
              {new Date(goal.deadline).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <FaClock className="text-blue-600 mr-2" />
          <div>
            <p className="text-xs text-gray-500">Time Remaining:</p>
            <p className="font-medium">
              {daysRemaining > 0 
                ? `${daysRemaining} days left` 
                : daysRemaining === 0 
                  ? "Due today" 
                  : `${Math.abs(daysRemaining)} days overdue`}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <FaTags className="text-blue-600 mr-2" />
          <div>
            <p className="text-xs text-gray-500">Category:</p>
            <p className="font-medium">{goal.category || "General"}</p>
          </div>
        </div>
      </div>

      {goal.description && (
        <div>
          <h4 className="font-medium mb-2">Description:</h4>
          <p className="text-gray-700">{goal.description}</p>
        </div>
      )}

      {goal.currentAmount < goal.targetAmount && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">To reach your goal:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                You still need: <span className="font-semibold">{formatCurrency(remainingAmount)}</span>
              </p>
            </div>
            {daysRemaining > 0 && (
              <div>
                <p className="text-sm text-gray-600">
                  Daily saving needed: <span className="font-semibold">{formatCurrency(remainingAmount / daysRemaining)}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalDetails;