import { Router } from "express";
import catchAsync from "@lib/catchAsync";
import userController from "@controllers/user";
import user from "../@controllers/user";
const router = Router();

router.get("/", catchAsync(userController.getAllUser));

router.post("/signUp", catchAsync(userController.signUp));
router.post("/login", catchAsync(userController.login));
router.post("/me", catchAsync(userController.me));
router.patch("/edit", catchAsync(userController.updateMe));
router.get("/:_id", catchAsync(userController.singleUser));

export default router;
