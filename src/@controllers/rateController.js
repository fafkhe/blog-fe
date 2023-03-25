import Models from "@models";
import AppError from "@lib/appError";
import authorizeUser from "@lib/auth/authorize-user";
import User from "../@models/User";

const { Rate, Blog } = Models;

export default {
  submitRate: async (req, res, next) => {
    const [thisUser, thisBlog] = await Promise.all([
      authorizeUser(req.user),
      Blog.findById(blogId),
    ]);
    // const thisUser = await authorizeUser(req.user);
    // const thisBlog = await Blog.findById(blogId);
    if (!thisBlog) throw new AppError("bad request: no such blog found", 404);

    const { blogId, score } = req.body;
    if (!blogId || !score)
      throw new AppError("you probebly forgot the id or score");

    // const Rate = awa

    const [targetUser, thisRate] = await Promise.all([
      User.findById(thisBlog.userId),
      Rate.findOne({
        creatorId: String(thisUser._id),
        blogId: String(thisBlog._id),
      })
    ])

    // const targetUser = await User.findById(thisBlog.userId);
    // const thisRate = await Rate.findOne({
    //   creatorId: String(thisUser._id),
    //   blogId: String(thisBlog._id),
    // });

    if (thisRate) throw new AppError("you have already rate the blog");

    await Rate.create({
      rate: score,
      userId: thisBlog.userId,
      blogId: String(thisBlog._id),
      creatorId: String(thisUser._id),
    });

    // calculate user rate

    // await targetUser._calculateUserRate();

    // // calculate blog rate

    // await thisBlog._calculateBlogRate();

    await Promise.all([
      targetUser._calculateUserRate(),
      thisBlog._calculateBlogRate(),
    ]);

    res.status(200).json({
      msg: "ok",
    });
  },
};
