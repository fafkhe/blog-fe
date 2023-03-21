import { Router } from "express";
import blogController from "../@controllers/blogController";
// import catchAsync from "@lib/catchAsync";

const router = Router();

router.post("/createblog", blogController.createBlog)


module.exports = router;
