import mongoose, { Schema } from "mongoose";

const blogSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "write a title for blog"],
      // maxlength: [40, "a blog name have less or equal then 40  characters"],
      // minlength: [10, "a blog name have more or equal then 10  characters"],
    },
    content: {
      type: String,
      // minlength: [100, " content have more or equal then 40  characters"],
      // maxlength: [2000, " content have less or equal then 100  characters"],
    },
    imgurl: {
      type: String,
    },
    userId: {
      type: String,
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
};

export default mongoose.model("Blog", blogSchema);

// title: String,
// content: String,
// imgurl: String,
// userId: String,
