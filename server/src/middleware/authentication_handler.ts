import { Dbi } from "@/database/dbi";
import { InternalError, UnauthenticatedError } from "@/errors";
import { Result, Session } from "@/types";
import { User } from "@/types/data_models/users";
import { Role } from "@/types/role";
import {Request, Response, NextFunction} from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

declare global {
    namespace Express {
        interface Request {
            session: {
                id?: string;
                data: {
                    user: {
                        id: number;
                        role: Role;
                    }
                }
            } | null;
        }
    }
}

export const authenticationHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.session);
        if (!req.session?.id) {
            return res.sendResult(Result.error(new UnauthenticatedError(ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)));
        } else {
            const sessionResult = await Dbi.session.validate(req.session.id);
            console.log("Validation result", sessionResult);
            if (!sessionResult.ok) {
                return res.sendResult(Result.error(new InternalError(ReasonPhrases.INTERNAL_SERVER_ERROR, sessionResult)));
            } else {
                if(sessionResult.value.valid) {
                    req.session.id = sessionResult.value.sessionId;
                    req.session.data.user = {
                        id: sessionResult.value.userId,
                        role: sessionResult.value.role,
                    };
                } else {
                    return res.sendResult(Result.error(new UnauthenticatedError(ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)));
                }
            }
        }
        next();
    } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to extend session" });
    }
}

