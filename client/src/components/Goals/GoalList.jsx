import React from "react";
import { FaTrash, FaEye } from "react-icons/fa";
import { formatCurrency } from "@/utils/helper";

const GoalList = ({ goals, onDelete, onView }) => {
  // Function to determine card color based on goal status
  const getCardColor = (goal) => {
    const deadline = new Date(goal.deadline);
    const today = new Date();
    
    // If goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
      return "bg-yellow-50 border-yellow-200"; // Yellow for completed
    }
    // If goal is overdue
    else if (deadline < today) {
      return "bg-red-50 border-red-200"; // Red for overdue
    }
    // If goal is in progress
    else {
      return "bg-white border-gray-200"; // White for in progress
    }
  };

  // Function to calculate progress percentage
  const calculateProgress = (current, target) => {
    const progress = (current / target) * 100;
    return Math.min(progress, 100).toFixed(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Goals</h2>
      
      {goals.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No goals found. Start by adding a goal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progressPercentage = calculateProgress(goal.currentAmount, goal.targetAmount);
            const cardColorClass = getCardColor(goal);

            return (
              <div
                key={goal._id}
                className={`${cardColorClass} border rounded-lg p-5 cursor-pointer transition-shadow hover:shadow-lg`}
                onClick={() => onView(goal)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold truncate" title={goal.title}>
                    {goal.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(goal._id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-gray-500 mb-1">Category: {goal.category || "General"}</p>
                  <p className="text-gray-500">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        progressPercentage >= 100
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm font-medium mt-1">
                    {progressPercentage}% achieved
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(goal);
                    }} 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FaEye className="mr-1" /> View details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalList;
