import mongoose, { Schema } from "mongoose";

const blogSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "write a title for blog"],
    },
    content: {
      type: String,
    },
    imgurl: {
      type: String,
    },
    userId: {
      type: String,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.methods = {
  _checkIfImAuthor: function (thisUser) {
    if (String(thisUser._id) !== this.userId) throw new Error("unathorized");
  },
  _calculateBlogRate: async function () {
    const allRates = await mongoose
      .model("Rate")
      .find({ blogId: String(this._id) });
    let total = 0;
    for (const thisRate of allRates) {
      total += thisRate.rate;
    }

    const averageScore = total / allRates.length;
    this.averageScore = averageScore.toFixed(2);
    await this.save();
  },
};

export default mongoose.model("Blog", blogSchema);

// title: String,
// content: String,
// imgurl: String,
// userId: String,
