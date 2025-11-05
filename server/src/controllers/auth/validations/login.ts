import { ContextRunner, CustomValidator, body } from "express-validator";

export const loginRequestValidations: ContextRunner[] = [
    body("username")
        .exists()
        .isString()
        .isLength({ min: 1})
        .withMessage("Field `username` is required and must be a string of at least one character"),
    body("password")
        .exists()
        .isString()
        .isLength({min: 8 })
        .withMessage("Field `password` is required and must be a string of at least eight characters"),
]
