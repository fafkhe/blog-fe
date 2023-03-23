import Models from "@models";
import AppError from "@lib/appError";
import authorizeUser from "@lib/auth/authorize-user";

const { Blog } = Models;

export default {
  createBlog: async (req, res, next) => {
    console.log("ghable auth");
    const thisUser = await authorizeUser(req.user);
    console.log("bade auth");
    const { title, content, imgurl } = req.body;
    if (!title || !content)
      throw new AppError("bad request: insufficient fields", 400);
    console.log("***************************************");
    console.log("bade if");

    const newBlog = await Blog.create({
      title,
      content,
      imgurl,
      userId: String(thisUser._id),
    });

    res.status(201).json({
      status: "success",
      data: {
        blog: newBlog,
      },
    });
  },
  getAllBlogs: async (req, res, next) => {
    const allblogs = await Blog.find({});

    res.status(201).json({
      status: "success",
      data: {
        All: allblogs,
      },
    });
  },

  getSingleBlog: async (req, res, next) => {
    console.log(req.params);
    const singleBlog = await Blog.findById(req.params._id);
    if (!singleBlog) {
      return next(new AppError("No blog found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        singleBlog,
      },
    });
  },
  updateBlog: async (req, res, next) => {
    const newBlog = await Blog.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    if (!newBlog) {
      return next(new AppError("No blog found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        blog: newBlog,
      },
    });
  },
  deleteBlog: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);
  },
};
