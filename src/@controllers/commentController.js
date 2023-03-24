import Models from "@models";
import AppError from "@lib/appError";
import authorizeUser from "@lib/auth/authorize-user";

const { Comment } = Models;

export default {
  submitComments: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);

    await Comment.create({
      text: req.body.text,
      blogId: req.body.blogId,
      userId: String(thisUser._id),
    });

  
    res.status(201).json({
      status: "success",
    });
  },
};
