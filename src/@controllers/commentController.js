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

  geComment: async (req, res, next) => {
    const page = req.query.page || 0;
    const limit = req.query.limit || 2;

    console.log(req.query);

    const findOption = { blogId: req.params._id };

    const [total, result] = await Promise.all([
      Comment.find(findOption).countDocuments(),
      Comment.find(findOption)
        .skip(page * limit)
        .limit(limit),
    ]);
    res.status(201).json({
      status: "success",
      data: {
       total, result
      }
    })
  },
};
