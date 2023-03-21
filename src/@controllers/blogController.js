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
};
