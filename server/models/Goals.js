// models/Goal.js
import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [0, "Target amount cannot be negative"],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, "Current amount cannot be negative"],
    },
    deadline: {
      type: Date,
      required: [true, "Goal deadline is required"],
    },
    category: {
      type: String,
      default: "Savings",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to check if goal is completed
goalSchema.pre("save", function (next) {
  if (this.currentAmount >= this.targetAmount && !this.completed) {
    this.completed = true;
  } else if (this.currentAmount < this.targetAmount && this.completed) {
    this.completed = false;
  }
  next();
});

const Goals = mongoose.models.Goal || mongoose.model("Goals", goalSchema);

export default Goals;