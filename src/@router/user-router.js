import { Router } from "express";
import catchAsync from "@lib/catchAsync";
import userController from "@controllers/user";
const router = Router();

router.get("/", (_, res) => res.send("hello from /users/"));

router.post("/signUp", catchAsync(userController.signUp));
router.post("/login", catchAsync(userController.login));
router.post("/me", catchAsync(userController.me));
router.patch("/edit", catchAsync(userController.updateMe));

export default router;
