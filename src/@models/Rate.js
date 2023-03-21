import mongoose, { Schema } from "mongoose";

const RateSchema = Schema(
  {
    rate: Number,
    userId: String,
    blogId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Rate", RateSchema);
