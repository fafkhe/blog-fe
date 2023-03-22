import Models from "@models";
import AppError from "@lib/appError";

const { Blog } = Models;

export default {
  createBlog: async (req, res, next) => {
    flr("popopopopopopopo");
    const newBlog = await Blog.create(req.body);

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
    console.log("pop*******************");
    console.log(req.params);
    const singleBlog = await Blog.findById(req.params._id);
    console.log("after single");
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
};
