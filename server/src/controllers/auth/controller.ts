import { Dbi } from "@/database/dbi";
import { BadRequestError, InternalError, SystemError } from "@/errors";
import { validateRequest } from "@/middleware/request_validator";
import { Password } from "@/utilities/password";
import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
    registerRequestValidations,
    loginRequestValidations,
} from "./validations";
import { Result, resultToApiResponse } from "@/types";

export class AuthController {
    public static async register(req: Request, res: Response, next: NextFunction) {
        const validator = await validateRequest(registerRequestValidations);
        const validationResult = await validator(req);
        if(!validationResult.ok) {
            const response = resultToApiResponse(validationResult);
            response.body = validationResult;
            response.status = StatusCodes.BAD_REQUEST;
            res.status(StatusCodes.BAD_REQUEST).json(response);
            return;
        }

        const { username, password } = req.body;
        const passwordHash = await Password.toHash(password);
        const registrationResult = await Dbi.users.create(username, passwordHash);
        if(!registrationResult.ok) {
            return res.sendResult(
                Result.error(
                    new BadRequestError("Username taken!", {})
                )
            );
        }
        const loginResult = await Dbi.auth.login(username, passwordHash);
        if(!loginResult.ok) {
            return res.sendResult(
                Result.error(
                    new InternalError(ReasonPhrases.INTERNAL_SERVER_ERROR, registrationResult)
                )
            );
        }
        req.session = { 
            id: loginResult.value.sessionId, 
            data: { 
                user: {
                    id: loginResult.value.userId,
                    role: loginResult.value.role,
                    username: loginResult.value.username,
                }
            }
        };
        return res.sendResult(loginResult);
    }

    public static async login(req: Request, res: Response) {
        const validator = await validateRequest(loginRequestValidations);
        const validationResult = await validator(req);
        if(!validationResult.ok) {
            const response = resultToApiResponse(validationResult);
            response.body = validationResult;
            response.status = StatusCodes.BAD_REQUEST;
            res.status(StatusCodes.BAD_REQUEST).json(response);
            return;
        }

        const { username } = req.body;
        const userReadResult = await Dbi.users.read(undefined, username);
        if(userReadResult.ok) {
            const loginResult = await Dbi.auth.login(username, userReadResult.value.passwordHash);
            if(!loginResult.ok) {
                return res.sendResult(loginResult);
            }
            req.session = { 
                id: loginResult.value.sessionId, 
                data: { 
                    user: {
                        id: loginResult.value.userId,
                        role: loginResult.value.role,
                        username: loginResult.value.username
                    }
                }
            };
            return res.sendResult(loginResult);
        } else {
            res.sendResult(
            Result.error(
                new SystemError("Invalid username or password", userReadResult)
            )
            );
        }
    }

    public static async logout(req: Request, res: Response, next: NextFunction) {
        if(req.session && req.session.id) {
            const logoutResult = await Dbi.auth.logout(req.session.id);;
            if(!logoutResult.ok) {
                res.sendResult(
                    Result.error(
                        new InternalError(
                            ReasonPhrases.INTERNAL_SERVER_ERROR,
                            logoutResult
                        )
                    )
                );
            }
        }
        req.session = null;
        res.sendResult(Result.ok({}));
    }
}

