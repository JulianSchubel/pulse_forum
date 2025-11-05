import { Request, Response, NextFunction } from "express";
import {
    Result,
    resultToApiResponse
} from "@/types";

/**
* Extend Express Response type
*/
declare global {
    namespace Express {
        interface Response {
            sendResult: <T>(result: Result<T>) => void;
        }
    }
}

export function resultHandlerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    /**
    * Patch Express response object to provide method res.sendResult to simplify handler code
    */
    res.sendResult = function <T>(result: Result<T>) {
        const apiResponse = resultToApiResponse(result);
        res.status(apiResponse.status).json(apiResponse);
    };
    next();
}
