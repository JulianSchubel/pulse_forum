import { Request, Response, NextFunction } from "express";
import { Result } from "@/types/result";
import { Dbi } from "@/database/dbi";
import { UnauthenticatedError, UnauthorizedError } from "@/errors";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
    readManyRequestValidations,
    createRequestValidations,
    toggleLikeRequestValidations,
    toggleFlagRequestValidations,
} from "./validations";
import { validateRequest } from "@/middleware/request_validator";
import { resultToApiResponse } from "@/types";
import { Role } from "@/types";
import { SocketService } from "@/services/socket";

export class PostsController {
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

        const {page, limit} = req.query;
        if(Number(page) <= 0) {
            return res.sendResult(Result.ok([]));
        }
        if(Number(limit) <= 0) {
            return res.sendResult(Result.ok([]));
        }
        const offset = (Number(page)-1) * Number(limit);
        const result = await Dbi.posts.readMany(offset, Number(limit));
        return res.sendResult(result);
    }

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

        const { content } = req.body;
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
        const response = await Dbi.posts.create(req.session.data.user.id, content);
        console.log("post create result", response);
        if(response.ok) {
            SocketService.emitPostCreated(response.value);
        }
        return res.sendResult(response);
    }

    public static async toggleLike(req: Request, res: Response, next: NextFunction) {
        const validator = await validateRequest(toggleLikeRequestValidations);
        const validationResult = await validator(req);
        if(!validationResult.ok) {
            const response = resultToApiResponse(validationResult);
            response.body = validationResult;
            response.status = StatusCodes.BAD_REQUEST;
            res.status(StatusCodes.BAD_REQUEST).json(response);
            return;
        }

        const { postId } = req.body;
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
        const response = await Dbi.posts.toggleLike(postId, req.session.data.user.id);
        if(response.ok) {
            SocketService.emitPostLiked(response.value);
        }
        return res.sendResult(response);
    }

    public static async toggleFlag(req: Request, res: Response, next: NextFunction) {
        const validator = await validateRequest(toggleFlagRequestValidations);
        const validationResult = await validator(req);
        if(!validationResult.ok) {
            const response = resultToApiResponse(validationResult);
            response.body = validationResult;
            response.status = StatusCodes.BAD_REQUEST;
            res.status(StatusCodes.BAD_REQUEST).json(response);
            return;
        }

        const { postId, reason } = req.body;
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
        if(req.session?.data.user.role !== Role.MODERATOR) {
            return res.sendResult(
                Result.error(
                    new UnauthorizedError(
                        ReasonPhrases.FORBIDDEN,
                        {}
                    )
                )
            );
        }
        const response = await Dbi.posts.toggleFlag(postId, req.session.data.user.id, reason);
        if(response.ok) {
            SocketService.emitPostFlagged(response.value);
        }
        return res.sendResult(response);
    }
}
