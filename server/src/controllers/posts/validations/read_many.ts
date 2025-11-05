import { ContextRunner, query } from "express-validator";

export const readManyRequestValidations: ContextRunner[] = [
    query("page")
        .exists()
        .isInt({ min: 1 })
        .toInt()
        .withMessage("Query parameter `page` is required and must be a natural number"),
    query("limit")
        .exists()
        .isInt({min: 1})
        .toInt()
        .withMessage("Query parameter `limit` is required and must be a natural number"),
]

