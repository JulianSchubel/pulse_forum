import { CommentsController } from "@/controllers";
import { asyncHandler } from "@/middleware";
import { Router } from "express";

const router = Router();

router.route("/")
    .get(asyncHandler(CommentsController.readMany))
    .post(asyncHandler(CommentsController.create));

export {
    router as CommentsRouter
};
