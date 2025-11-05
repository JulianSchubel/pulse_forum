import { ContextRunner, CustomValidator, body } from "express-validator";

export const createRequestValidations: ContextRunner[] = [
    body("postId")
        .exists()
        .isInt()
        .withMessage("Field `postId` is required and must be an integer"),
    body("content")
        .exists()
        .isString()
        .isLength({min: 1 })
        .withMessage("Field `content` is required and must be a string of at least one character"),
]
