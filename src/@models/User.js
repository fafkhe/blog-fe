import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import AppError from "@lib/appError";
import jwt from "jsonwebtoken";

dotenv.config();

const userSchema = Schema(
  {
    name: String,
    email: {
      type: String,
      unique: [true, "this email already exist"],
      required: [true, "provide a valid email"],
    },
    password: String,
    imgurl: {
      type: String,
      default: null,
    },
    bio: String,
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = genSaltSync(11);
  const hash = hashSync(this.password, salt);
  this.password = hash;

  next();
});

userSchema.methods = {
  _checkPassword: function (password) {
    if (!compareSync(password, this.password))
      throw new AppError("password doesnt match", 400);
  },
  _createToken: function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  },
  _calculateUserRate: async function () {
    const allRates = await mongoose
      .model("Rate")
      .find({ userId: String(this._id) });

    let total = 0;
    for (const thisRate of allRates) total += thisRate.rate;

    const averageScore = total / allRates.length;
    this.averageScore = averageScore.toFixed(2);
    await this.save();
  },
};

export default mongoose.model("User", userSchema);
