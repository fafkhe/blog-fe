import Models from "@models";
import AppError from "@lib/appError";
import authorizeUser from "@lib/auth/authorize-user";

const { Blog, User } = Models;

// lazy load

const appendUser = async (blogs) => {
  const preuserIds = blogs.map((item) => item.userId);
  const userIds = [...new Set(preuserIds)];
  const theseUsers = await User.find(
    { _id: { $in: userIds } },
    { password: 0 }
  );

  const cache = {};

  theseUsers.forEach((user) => (cache[String(user._id)] = user));

  for (const thisBlog of blogs) {
    const thisUser = cache[thisBlog.userId];

    thisBlog.user = thisUser;
  }

  return blogs;
};

export default {
  createBlog: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);
    const { title, content, imgurl } = req.body;
    if (!title || !content)
      throw new AppError("bad request: insufficient fields", 400);

    const newBlog = await Blog.create({
      title,
      content,
      imgurl,
      userId: String(thisUser._id),
    });

    const x = newBlog.toObject();

    const blog = (await appendUser([x]))[0];

    res.status(201).json({
      status: "success",
      data: {
        blog,
      },
    });
  },
  getAllBlogs: async (req, res, next) => {
    const page = req.query.page || 0;
    const limit = req.query.limit || 10;

    const findOption = {};

    const [total, result] = await Promise.all([
      Blog.find(findOption).countDocuments(),
      Blog.find(findOption)
        .skip(page * limit)
        .limit(limit)
        .lean(),
    ]);

    const blogs = await appendUser(result);

    res.status(201).json({
      status: "success",
      data: {
        total,
        result: blogs,
      },
    });
  },

  getSingleBlog: async (req, res, next) => {
    const singleBlog = await Blog.findById(req.params._id).lean();
    if (!singleBlog)
      return next(new AppError("No blog found with that ID", 404));

    const blog = (await appendUser([singleBlog]))[0];

    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  },
  updateBlog: async (req, res, next) => {
    const { title, content, imgurl } = req.body;
    if (!title || !content)
      throw new AppError("bad request: insufficient fields", 400);
    const [thisBlog, thisUser] = await Promise.all([
      Blog.findById(req.params._id),
      authorizeUser(req.user),
    ]);

    if (!thisBlog) throw new AppError("bad request: no such blog found", 404);

    thisBlog._checkIfImAuthor(thisUser);

    const newBlog = await Blog.findByIdAndUpdate(
      req.params._id,
      {
        title,
        content,
        imgurl,
      },
      {
        new: true,
      }
    );

    const x = newBlog.toObject();
    const blog = (await appendUser([x]))[0];

    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  },
  deleteBlog: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);
    const thisBlog = await Blog.findById(req.params._id);
    if (!thisBlog) throw new Error("no such blog exist");
    thisBlog._checkIfImAuthor(thisUser);
    await Blog.findByIdAndDelete(req.params._id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
  getMyBlogs: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);
    const page = req.query.page || 0;
    const limit = req.query.limit || 2;

    const findOption = { userId: String(thisUser._id) };

    const [total, result] = await Promise.all([
      Blog.find(findOption).countDocuments(),
      Blog.find(findOption)
        .skip(page * limit)
        .limit(limit)
        .lean(),
    ]);

    const blogs = await appendUser(result);

    res.status(200).json({
      status: "success",
      data: {
        total,
        result: blogs,
      },
    });
  },

  topBlogs: async (req, res, next) => {
    const topBlogs = await Blog.find({}).sort({ averageScore: -1 }).limit(3);
    res.status(201).json({
      data: {
        topBlogs,
      },
    });
  },
  blogByUsers: async (req, res, next) => {
    const { userId } = req.body;
    let thisUser;
    try {
      thisUser = await User.findById(userId);
    } catch {
      throw new AppError("bad request: no such user exists");
    }

    if (!thisUser) throw new AppError("bad request: no such user exists");

    const page = req.query.page || 0;
    const limit = req.query.limit || 10;

    const findOption = { userId };

    const [total, result] = await Promise.all([
      Blog.find(findOption).countDocuments(),
      Blog.find(findOption)
        .skip(page * limit)
        .limit(limit)
        .lean(),
    ]);
    const blogs = await appendUser(result);

    res.status(201).json({
      status: "success",
      data: {
        total,
        result: blogs,
      },
    });
  },
};
