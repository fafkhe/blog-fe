import Models from "@models";
import AppError from "@lib/appError";

const { User } = Models;

export default async (user) => {
  if (!user || !user._id) throw new AppError("unathorized", 401);

  const thisUser = await User.findById(user._id, { __v: 0, password: 0 });

  if (!thisUser) throw new AppError("unathorized", 401);

  return thisUser;
};



