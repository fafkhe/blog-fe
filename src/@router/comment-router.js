import { Router } from "express";
import catchAsync from "@lib/catchAsync";
import commentController from "../@controllers/commentController";



const router = Router();


router.post("/comment/submit" , catchAsync(commentController.submitComments))
router.get("/:_id", catchAsync(commentController.geComment))



module.exports = router;