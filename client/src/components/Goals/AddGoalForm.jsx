import React, { useState } from "react";
import { 
  FaBullseye, 
  FaCalendarAlt, 
  FaCoins, 
  FaTags, 
  FaAlignLeft 
} from "react-icons/fa";

const AddGoalForm = ({ onAddGoal }) => {
  const [goalData, setGoalData] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    category: "Savings",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData({
      ...goalData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddGoal(goalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
          <FaBullseye className="mr-2 text-blue-600" />
          Goal Title
        </label>
        <input
          type="text"
          name="title"
          value={goalData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., New Car, Emergency Fund"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
            <FaCoins className="mr-2 text-blue-600" />
            Target Amount
          </label>
          <input
            type="number"
            name="targetAmount"
            value={goalData.targetAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
            <FaCoins className="mr-2 text-blue-600" />
            Starting Amount (if any)
          </label>
          <input
            type="number"
            name="currentAmount"
            value={goalData.currentAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={goalData.deadline}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
            <FaTags className="mr-2 text-blue-600" />
            Category
          </label>
          <select
            name="category"
            value={goalData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Savings">Savings</option>
            <option value="Investment">Investment</option>
            <option value="Debt">Debt Repayment</option>
            <option value="Purchase">Major Purchase</option>
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
            <option value="Home">Home</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
          <FaAlignLeft className="mr-2 text-blue-600" />
          Description (Optional)
        </label>
        <textarea
          name="description"
          value={goalData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add details about your goal"
          rows="3"
        ></textarea>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-2"
        >
          Add Goal
        </button>
      </div>
    </form>
  );
};

export default AddGoalForm;
