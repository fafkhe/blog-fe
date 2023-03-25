import mongoose, { Schema } from "mongoose";

const RateSchema = Schema(
  {
    rate: {
      type: Number,
      min: [1, "a valid score is between 1-5"],
      max: 5,
    },
    userId: String,
    blogId: String,
    creatorId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Rate", RateSchema);
