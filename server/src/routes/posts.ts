import { PostsController } from "@/controllers";
import { asyncHandler } from "@/middleware";
import { authenticationHandler } from "@/middleware/authentication_handler";
import { Router } from "express";

const router = Router();
router.route("/")
    .get(asyncHandler(PostsController.readMany))
    .post(authenticationHandler, asyncHandler(PostsController.create));
router.route("/like")
    .post(authenticationHandler, asyncHandler(PostsController.toggleLike));
router.route("/flag")
    .post(authenticationHandler, asyncHandler(PostsController.toggleFlag));

export {
    router as PostsRouter
}
