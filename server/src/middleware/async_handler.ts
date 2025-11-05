import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler so that any thrown error or rejected Promise
 * is automatically passed to the global error handler. Only responsibility is
 * to catch errors and pass it on to the global error handler.
 *
 * Idea is to avoid polluting handlers with try-catch blocks
 */
export const asyncHandler = (handler: RequestHandler) => {
    return async (req: Request<any, any, any, any, any>, res: Response<any, any>, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

