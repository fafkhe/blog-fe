import { Router } from "express";
import blogController from "../@controllers/blogController";
import catchAsync from "@lib/catchAsync";

const router = Router();

router.post("/createblog", catchAsync(blogController.createBlog));
router.get("/getAllBlogs", catchAsync(blogController.getAllBlogs));
router.get("/getmyblogs", catchAsync(blogController.getMyBlogs));
router.get("/topblogs", catchAsync(blogController.topBlogs));
router.post("/by-user", catchAsync(blogController.blogsByUsers))
router.delete("/:_id", catchAsync(blogController.deleteBlog));
router.post("/:_id", catchAsync(blogController.updateBlog));
router.get("/:_id", catchAsync(blogController.getSingleBlog));

module.exports = router;
