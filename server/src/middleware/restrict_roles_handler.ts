import {Request, Response, NextFunction} from "express";
import { Role } from "@/types/role";
import { InternalError } from "@/errors";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Result } from "@/types";

export const restrictRoles = (...restrictedRoles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authorized = restrictedRoles.reduce( (a: boolean,v: Role) => {
            return a || (
                req.session !== null 
                ? restrictedRoles.includes(req.session.data.user.role) 
                : false
            );
        }, false)
        if(!authorized) {
            return res.sendResult(
                Result.error(
                    new InternalError(
                        ReasonPhrases.FORBIDDEN,
                        StatusCodes.FORBIDDEN
                    )
                )
            )
        }
        next();
    }
}


