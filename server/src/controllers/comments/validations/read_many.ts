import { ContextRunner, query } from "express-validator";

export const readManyRequestValidations: ContextRunner[] = [
    query("postId")
        .exists()
        .isInt({min: 1})
        .toInt()
        .withMessage("Query parameter `postId` is required and must be a natural number"),
]

