import mongoose, { Schema } from "mongoose";

const commentSchema = Schema(
  {
    text: String,
    userId: String,
    blogId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("comment", commentSchema);
