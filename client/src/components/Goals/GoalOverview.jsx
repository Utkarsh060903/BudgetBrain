import React from "react";
import { FaPlus } from "react-icons/fa";
import { 
  FaTrophy, 
  FaCheck, 
  FaHourglassHalf, 
  FaExclamationTriangle 
} from "react-icons/fa";

const GoalOverview = ({ goals, onAddGoal }) => {
  // Calculate summary statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => 
    goal.currentAmount >= goal.targetAmount
  ).length;
  const inProgressGoals = goals.filter(goal => 
    goal.currentAmount < goal.targetAmount && 
    new Date(goal.deadline) >= new Date()
  ).length;
  const overdueGoals = goals.filter(goal => 
    goal.currentAmount < goal.targetAmount && 
    new Date(goal.deadline) < new Date()
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Goal Overview</h2>
        <button
          onClick={onAddGoal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
          <div className="text-blue-600 mb-2">
            <FaTrophy size={28} />
          </div>
          <p className="text-gray-500">Total Goals</p>
          <h3 className="text-2xl font-bold">{totalGoals}</h3>
        </div>

        <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
          <div className="text-green-600 mb-2">
            <FaCheck size={28} />
          </div>
          <p className="text-gray-500">Completed</p>
          <h3 className="text-2xl font-bold">{completedGoals}</h3>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
          <div className="text-blue-600 mb-2">
            <FaHourglassHalf size={28} />
          </div>
          <p className="text-gray-500">In Progress</p>
          <h3 className="text-2xl font-bold">{inProgressGoals}</h3>
        </div>

        <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center">
          <div className="text-red-600 mb-2">
            <FaExclamationTriangle size={28} />
          </div>
          <p className="text-gray-500">Overdue</p>
          <h3 className="text-2xl font-bold">{overdueGoals}</h3>
        </div>
      </div>
    </div>
  );
};

export default GoalOverview;

