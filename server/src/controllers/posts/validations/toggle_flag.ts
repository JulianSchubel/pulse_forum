import { ContextRunner, CustomValidator, body } from "express-validator";

export const toggleFlagRequestValidations: ContextRunner[] = [
    body("postId")
        .exists()
        .isInt({min: 1})
        .withMessage("Field `postId` is required and must be a natural number"),
    body("reason")
        .exists()
        .isString()
        .withMessage("Field `reason` is required")
]

