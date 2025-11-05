import { Dbi } from "@/database/dbi";
import { UnauthenticatedError } from "@/errors";
import { Result } from "@/types/result";
import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
    createRequestValidations,
    readManyRequestValidations,
} from "./validations";
import { validateRequest } from "@/middleware/request_validator";
import { resultToApiResponse } from "@/types";

export class CommentsController {
    public static async create(req: Request, res: Response, next: NextFunction) {
        const validator = await validateRequest(createRequestValidations);
        const validationResult = await validator(req);
        if(!validationResult.ok) {
            const response = resultToApiResponse(validationResult);
            response.body = validationResult;
            response.status = StatusCodes.BAD_REQUEST;
            res.status(StatusCodes.BAD_REQUEST).json(response);
            return;
        }

        const { postId, content } = req.body;
        if(!req.session?.data.user.id) {
            return res.sendResult(
                Result.error(
                    new UnauthenticatedError(
                        ReasonPhrases.UNAUTHORIZED,
                        {}
                    )
                )
            );
        }
        const response = await Dbi.comments.create(postId, req.session.data.user.id, content);
        return res.sendResult(response);
    }

    public static async readMany(req: Request, res: Response, next: NextFunction) {
        const validator = await validateRequest(readManyRequestValidations);
        const validationResult = await validator(req);
        if(!validationResult.ok) {
            const response = resultToApiResponse(validationResult);
            response.body = validationResult;
            response.status = StatusCodes.BAD_REQUEST;
            res.status(StatusCodes.BAD_REQUEST).json(response);
            return;
        }

        const { postId } = req.query;
        const response = await Dbi.comments.readMany(Number(postId));
        return res.sendResult(response);
    }
}
