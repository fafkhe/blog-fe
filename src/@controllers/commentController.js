import Models from "@models";
import AppError from "@lib/appError";
import authorizeUser from "@lib/auth/authorize-user";

const { Comment, Blog, User } = Models;

const appendUser = async (comments) => {
  const preuserIds = comments.map((item) => item.userId);
  const userIds = [...new Set(preuserIds)];
  const theseUsers = await User.find(
    { _id: { $in: userIds } },
    { password: 0 }
  );

  const cache = {};

  theseUsers.forEach((user) => (cache[String(user._id)] = user));

  for (const thisComment of comments) {
    const thisUser = cache[thisComment.userId];

    thisComment.user = thisUser;
  }

  return comments;
};

export default {
  submitComments: async (req, res, next) => {
    console.log(req.body);
    const { text, blogId } = req.body;
    if (!text || !blogId) throw new AppError("bad input", 400);

    const [thisUser, thisBlog] = await Promise.all([
      authorizeUser(req.user),
      Blog.findById(blogId),
    ]);

    if (!thisBlog) throw new AppError("bad request: no such blog found", 404);

    await Comment.create({
      text,
      blogId,
      userId: String(thisUser._id),
    });

    res.status(201).json({
      status: "success",
    });
  },

  geComment: async (req, res, next) => {
    if (!req.params._id) throw new AppError("bad input", 400);
    const thisBlog = await Blog.findById(req.params._id);
    if (!thisBlog) throw new AppError("no such blog found ", 404);
    const page = req.query.page || 0;
    const limit = req.query.limit || 10;

    const findOption = { blogId: req.params._id };

    const [total, result] = await Promise.all([
      Comment.find(findOption).countDocuments(),
      Comment.find(findOption)
        .skip(page * limit)
        .limit(limit)
        .lean(),
    ]);

    const comments = await appendUser(result);

    console.log(comments);

    res.status(200).json({
      status: "success",
      data: {
        total,
        result: comments,
      },
    });
  },
};
