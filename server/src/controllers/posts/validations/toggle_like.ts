import { ContextRunner, body } from "express-validator";

export const toggleLikeRequestValidations: ContextRunner[] = [
    body("postId")
        .exists()
        .isInt({ min: 1 })
        .withMessage("Field `postId` is required and must be a natural number"),
]

