import { Router } from "express";
import blogController from "../@controllers/blogController";
import catchAsync from "@lib/catchAsync";
import rateContriller from "../@controllers/rateController";

const router = Router();

router.post("/submitRate", catchAsync(rateContriller.submitRate));

export default router;
