import { Router } from "express";
import blogController from "../@controllers/blogController";
import catchAsync from "@lib/catchAsync";

const router = Router();

router.post("/createblog", catchAsync(blogController.createBlog));
router.get("/getAllBlogs", catchAsync(blogController.getAllBlogs));

module.exports = router;
