import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Modal from "@/components/Modal";
import DeleteAlert from "@/components/DeleteAlert";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useUserAuth } from "@/hooks/useUserAuth";
import toast from "react-hot-toast";
import GoalOverview from "@/components/Goals/GoalOverview";
import GoalList from "@/components/Goals/GoalList";
import AddGoalForm from "@/components/Goals/AddGoalForm";
import GoalDetails from "@/components/Goals/GoalDetails";

const Goals = () => {
  useUserAuth();
  const [goalsData, setGoalsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddGoalModal, setOpenAddGoalModal] = useState(false);
  const [openGoalDetailsModal, setOpenGoalDetailsModal] = useState({
    show: false,
    data: null,
  });

  const fetchGoalDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.GOALS.GET_ALL_GOALS}`
      );
      console.log("API Response:", response.data);

      if (response.data && response.data.goals) {
        setGoalsData(response.data.goals);
        console.log(
          "Setting goals data:",
          response.data.goals.length,
          "items"
        );
      }
    } catch (err) {
      console.log("Something went wrong", err);
      toast.error("Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (goal) => {
    const { title, targetAmount, currentAmount, deadline, category, description } = goal;

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!targetAmount || isNaN(targetAmount) || Number(targetAmount) <= 0) {
      toast.error("Target Amount should be a valid number");
      return;
    }

    if (!deadline) {
      toast.error("Deadline is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.GOALS.ADD_GOAL, {
        title,
        targetAmount,
        currentAmount: currentAmount || 0,
        deadline,
        category,
        description,
        createdAt: new Date().toISOString(),
      });

      setOpenAddGoalModal(false);
      toast.success("Goal added successfully");
      fetchGoalDetails();
    } catch (err) {
      console.log("Something went wrong", err);
      toast.error("Failed to add goal");
    }
  };

  const updateGoalProgress = async (id, currentAmount) => {
    try {
      await axiosInstance.put(API_PATHS.GOALS.UPDATE_GOAL(id), {
        currentAmount,
      });

      toast.success("Goal progress updated successfully");
      fetchGoalDetails();
      setOpenGoalDetailsModal({ show: false, data: null });
    } catch (err) {
      console.log("Something went wrong", err);
      toast.error("Failed to update goal progress");
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.GOALS.DELETE_GOAL(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Goal deleted successfully");
      fetchGoalDetails();
    } catch (err) {
      console.log("Something went wrong", err);
      toast.error("Failed to delete goal");
    }
  };

  useEffect(() => {
    fetchGoalDetails();
    return () => {};
  }, []);

  const handleViewGoalDetails = (goal) => {
    setOpenGoalDetailsModal({ show: true, data: goal });
  };

  return (
    <DashboardLayout activeMenu="Goals">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <GoalOverview
              goals={goalsData}
              onAddGoal={() => setOpenAddGoalModal(true)}
            />
          </div>

          <GoalList 
            goals={goalsData} 
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onView={handleViewGoalDetails}
          />
        </div>

        <Modal
          isOpen={openAddGoalModal}
          onClose={() => setOpenAddGoalModal(false)}
          title="Add Goal"
        >
          <AddGoalForm onAddGoal={handleAddGoal} />
        </Modal>

        <Modal
          isOpen={openGoalDetailsModal.show}
          onClose={() => setOpenGoalDetailsModal({ show: false, data: null })}
          title="Goal Details"
        >
          {openGoalDetailsModal.data && (
            <GoalDetails 
              goal={openGoalDetailsModal.data} 
              onUpdateProgress={updateGoalProgress}
            />
          )}
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Goal"
        >
          <DeleteAlert
            content="Are you sure you want to delete this goal?"
            onDelete={() => deleteGoal(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Goals;
