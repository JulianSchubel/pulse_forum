import { Request } from "express";
import { validationResult, ContextRunner } from 'express-validator';
import { RequestValidationError } from "@/errors"
import { Result } from "@type/result";

export const validateRequest = async (validations: ContextRunner[]) => {
    return async (req: Request<any, any, any, any>) => {
        /* execute validations */
        for (const validation of validations) {
            await validation.run(req);
        }
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return Result.error(new RequestValidationError(result.array()));
        }
        return Result.ok(result);
    };
};


