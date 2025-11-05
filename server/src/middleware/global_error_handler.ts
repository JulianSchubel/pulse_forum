import { Request, Response, NextFunction } from "express";
import { 
    Result,
    resultToApiResponse 
} from "@/types";

/**
 * Global error-handling middleware. Standardize API responses from internal
 * Result type.
 *
 * Must be registered *after* all routes.
 */
export function globalErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result: Result<any> = { ok: false, error: err };
    const apiResponse = resultToApiResponse(result);
    res.status(apiResponse.status).json(apiResponse);
}
