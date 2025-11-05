import { AuthController } from "@/controllers";
import { asyncHandler } from "@/middleware";
import { Router } from "express";

const router = Router();

router.route("/register")
    .post(asyncHandler(AuthController.register));

router.route("/login")
    .post(asyncHandler(AuthController.login));

router.route("/logout")
    .post(asyncHandler(AuthController.logout));

export {
    router as AuthRouter
};
